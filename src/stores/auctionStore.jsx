import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { runAuction, PRIORITY_SCORES } from '../utils/auctionLogic';
import { TRAINING_DATA } from '../data/training_data';

const AuctionContext = createContext();

export function AuctionProvider({ children }) {
  const [bidders, setBidders] = useState([]);
  const [settings, setSettings] = useState({
    budget_weight: 0.6, 
    priority_weight: 0.4,
    priority_map: PRIORITY_SCORES
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false); // New state to track connection



  // Load initial data
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // Fetch from 'active_bids' instead of 'bidders'
        const { data: biddersData, error: biddersError } = await supabase.from('active_bids').select('*').order('created_at', { ascending: true });
        
        if (biddersError || !biddersData) {
            console.warn("Supabase fetch error or empty.", biddersError);
             setBidders([]);
             setIsLive(false);
        } else if (biddersData.length === 0) {
             console.log("Active bids empty.");
             setBidders([]);
             setIsLive(true);
        } else {
            console.log("Supabase connected. Active bids found:", biddersData.length);
            setBidders(biddersData);
            setIsLive(true);
        }

        const { data: settingsData } = await supabase.from('auction_settings').select('*').limit(1);
        if (settingsData && settingsData.length > 0) {
            setSettings(settingsData[0]);
        }
      } catch (err) {
        console.error('Unexpected error loading data', err);
        setBidders([]); // Fallback
        setIsLive(false);
      } finally {
        setLoading(false);
      }
    }
    loadData();
    // ... subscription code remains same ...
    const channel = supabase.channel('auction-room')
        // ...
        .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  const addBidder = async (bidder) => {
    // Calculate priority_score implicitly if not provided, based on map (DB also does this but good for local checks)
    const pScore = settings.priority_map[bidder.priority] || 1;
    const newBidder = { 
        ...bidder, 
        priority_score: pScore,
        // Add ID if missing (for local offline mode)
        id: bidder.id || crypto.randomUUID(),
        created_at: new Date().toISOString()
    };
    
    // Optimistic Update (Immediate Feedback)
    setBidders((prev) => [...prev, newBidder]);

    if (isLive) {
        // We rely on Supabase Realtime to update the UI state (bidders list) normally,
        // but since we did optimistic update, we might get a duplicate if we don't handle it,
        // however, Supabase Realtime usually handles this well or we can filter.
        // For this hybrid approach, let's just send it.
        const { error } = await supabase.from('active_bids').insert({
            ...bidder,
            priority_score: pScore
        });
        
        if (error) {
            console.error("Error adding bidder to DB", error);
            // If DB fails, we still have it locally (optimistic), so maybe toast warning?
        }
    } else {
        console.log("Offline Mode: Bidder added locally only.");
    }
  };

  const uploadBatchBidders = async (batchData) => {
    setLoading(true);
    // Transform data to match Schema if needed, but assuming training_data.js is already formatted
    // Add default priority_score
    const formatted = batchData.map(b => ({
      ...b,
      name: b.organization_type + ' Mission ' + b.bidder_id.split('_').pop(), // Generate a name from ID
      // Map CSV/Training fields to Schema fields
      budget: b.budget || b.budget_million_usd, 
      priority: b.priority || b.priority_level, 
      priority_score: settings.priority_map[b.priority_level || b.priority] || 1
    }));

    const { error } = await supabase.from('active_bids').insert(formatted);
    if (error) console.error("Batch upload failed", error);
    setLoading(false);
  };

  const deleteBidder = async (id) => {
    // Optimistic Update: Immediately remove from UI
    setBidders((prev) => prev.filter((b) => b.id !== id));

    if (isLive) {
        const { error } = await supabase.from('active_bids').delete().eq('id', id);
        if (error) {
             console.error("Error deleting bidder from DB", error);
        }
    } else {
        console.log("Offline Mode: Bidder deleted locally.");
    }
  };

  const updateBidder = async (id, updates) => {
    // Implicit priority score update if priority changed
    let pScore = updates.priority_score;
    if (updates.priority && !pScore) {
        pScore = settings.priority_map[updates.priority] || 1;
    }
    const safeUpdates = { ...updates, priority_score: pScore };

    // Optimistic Update
    setBidders((prev) => prev.map(b => b.id === id ? { ...b, ...safeUpdates } : b));

    if (isLive) {
        const { error } = await supabase.from('active_bids').update(safeUpdates).eq('id', id);
        if (error) console.error("Error updating bidder", error);
    }
  };



  const updateSettings = async (newSettings) => {
    // Optimistic Update for instant slider response
    setSettings((prev) => ({ ...prev, ...newSettings }));
    
    // Only send to DB if potentially live, but for settings we usually always try to persist
    const idToUpdate = settings.id;
    let error;
    
    if (idToUpdate) {
        ({ error } = await supabase.from('auction_settings').update(newSettings).eq('id', idToUpdate));
    } else {
         ({ error } = await supabase.from('auction_settings').upsert(newSettings));
    }

    if (error) console.error("Error updating settings", error);
  };

  const executeAuction = async () => {
    const scoredBidders = runAuction(bidders, settings);
    const winner = scoredBidders[0];
    
    const resultPayload = {
      winner_id: winner ? winner.id : null,
      winner_score: winner ? winner.finalScore : 0,
      calculation_snapshot: { bidders: scoredBidders, settings }
    };

    setResults(resultPayload);
    await supabase.from('auction_results').insert(resultPayload);
  };

  const resetResults = () => {
    setResults(null);
  }

  return (
    <AuctionContext.Provider value={{
      bidders,
      settings,
      results,
      loading,
      isLive,
      error: null, // Always show data (local or remote)
      addBidder,
      updateBidder,
      uploadBatchBidders,
      deleteBidder,
      updateSettings,
      executeAuction,
      resetResults
    }}>
      {children}
    </AuctionContext.Provider>
  );
}

export function useAuction() {
  return useContext(AuctionContext);
}
