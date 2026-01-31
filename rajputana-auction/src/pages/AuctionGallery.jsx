import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import AuctionCard from '../components/AuctionCard';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AuctionGallery() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadResults() {
        try {
            const { data } = await supabase.from('auction_results').select('*').order('created_at', { ascending: false });
            if (data) setResults(data);
        } catch (e) {
            console.error("Failed to load gallery", e);
        } finally {
            setLoading(false);
        }
    }
    loadResults();
  }, []);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
            <Link to="/" className="p-2 hover:bg-white/10 rounded-full text-space-400 transition-colors">
                <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
                <h1 className="text-3xl font-orbitron text-white">Mission Logs</h1>
                <p className="text-sm text-space-400">Public record of allocated launch windows</p>
            </div>
        </div>
      </div>

      {loading ? (
          <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-cosmos-500 animate-spin" />
          </div>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.length === 0 && (
                  <div className="col-span-full py-20 text-center text-space-500 italic">
                      No missions recorded in the public ledger yet.
                  </div>
              )}
              {results.map(r => (
                  <AuctionCard key={r.id} result={r} />
              ))}
          </div>
      )}
    </div>
  );
}
