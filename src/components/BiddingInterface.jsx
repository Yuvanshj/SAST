import React, { useState } from 'react';
import { useAuction } from '../stores/auctionStore';
import { GlowingEffect } from './ui/glowing-effect';
import { Plus, Trash2, User, Wallet, Activity, Pencil, Rocket, Save, X } from 'lucide-react';
import clsx from 'clsx';

export default function BiddingInterface() {
  const { bidders, addBidder, updateBidder, deleteBidder, deployTestFleet } = useAuction();
  
  const [newOrg, setNewOrg] = useState('');
  const [newBudget, setNewBudget] = useState('');
  const [newPriority, setNewPriority] = useState('Low');
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newOrg || !newBudget) return;
    
    const payload = {
        name: newOrg,
        budget: parseFloat(newBudget),
        priority: newPriority
    };

    if (editingId) {
        updateBidder(editingId, payload);
        setEditingId(null);
    } else {
        addBidder(payload);
    }

    setNewOrg('');
    setNewBudget('');
    setNewPriority('Low');
  };

  const handleEdit = (bidder) => {
    setNewOrg(bidder.name);
    setNewBudget(bidder.budget);
    setNewPriority(bidder.priority);
    setEditingId(bidder.id);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNewOrg('');
    setNewBudget('');
    setNewPriority('Low');
  };

  const priorityMeta = {
      Low: { color: 'text-priority-low', bg: 'bg-priority-low/10', border: 'border-priority-low/20' },
      Medium: { color: 'text-priority-medium', bg: 'bg-priority-medium/10', border: 'border-priority-medium/20' },
      High: { color: 'text-priority-high', bg: 'bg-priority-high/10', border: 'border-priority-high/20' },
      Critical: { color: 'text-priority-critical', bg: 'bg-priority-critical/10', border: 'border-priority-critical/20' }
  };

  const formatMoney = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
      <div className="relative rounded-2xl p-0.5 h-full">
          <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
                borderWidth={3}
          />
          <div className="glass-panel rounded-2xl flex flex-col h-full overflow-hidden group transition-all duration-300 bg-space-950 border border-white/5 top-0 left-0 w-full h-full">
            <div className="p-6 border-b border-white/5 bg-white/5 flex justify-between items-center backdrop-blur-sm relative z-10">
                <div className="flex items-center gap-2 text-white">
                <User className="w-5 h-5 text-cosmos-500" />
                <h2 className="font-orbitron text-lg font-semibold tracking-wide">Active Bidders</h2>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={deployTestFleet}
                        className="p-1.5 rounded-lg bg-space-800 text-cosmos-400 hover:bg-cosmos-600 hover:text-white transition-colors"
                        title="Deploy Dummy Missions"
                    >
                        <Rocket className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-mono bg-space-950 px-2 py-1 rounded text-cosmos-300 border border-cosmos-500/20">
                        {bidders.length} ORGS
                    </span>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar relative z-10">
                {bidders.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-48 text-space-700 italic text-sm border-2 border-dashed border-space-800 rounded-xl m-2">
                        <Activity className="w-8 h-8 mb-2 opacity-50" />
                        <span>No signals detected.</span>
                        <span className="text-xs">Add an organization or Deploy Fleet.</span>
                    </div>
                )}
                
                {/* Display only top 10 most recent */}
                {[...bidders]
                    .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)) // Newest first
                    .slice(0, 10)
                    .map((b) => {
                    const meta = priorityMeta[b.priority] || priorityMeta['Low'];
                    return (
                        <div key={b.id} className={clsx("relative rounded-xl p-0.5 transition-opacity", editingId === b.id ? "opacity-50 pointer-events-none" : "opacity-100")}>
                            <GlowingEffect
                                spread={40}
                                glow={true}
                                disabled={false}
                                proximity={64}
                                inactiveZone={0.01}
                                borderWidth={2}
                            />
                            <div className={clsx(
                                "relative flex items-center justify-between p-4 rounded-xl border transition-all duration-300 group/card overflow-hidden",
                                "bg-space-900 border-white/5",
                                meta.border && "" 
                            )}>
                                <div>
                                    <div className="font-bold text-white text-lg tracking-tight group-hover/card:text-shadow-custom transition-all">
                                        {b.name || b.bidder_id || 'Unknown Signal'}
                                        {b.organization_type && <span className="ml-2 text-[10px] text-space-400 border border-space-700 px-1.5 py-0.5 rounded align-middle font-normal opacity-70">{b.organization_type}</span>}
                                    </div>
                                    <div className="text-xs flex gap-3 mt-1.5 items-center">
                                        <span className="flex items-center gap-1 text-green-400 font-mono tracking-wide bg-green-400/10 px-1.5 py-0.5 rounded border border-green-400/20">
                                            <Wallet className="w-3 h-3" />
                                            {formatMoney(b.budget)}
                                        </span>
                                        <span className={clsx("font-bold uppercase text-[10px] px-2 py-0.5 rounded-full border flex items-center gap-1", meta.color, meta.bg, meta.border)}>
                                            <span className={clsx("w-1.5 h-1.5 rounded-full animate-pulse", meta.color.replace('text-', 'bg-'))}></span>
                                            {b.priority}
                                        </span>
                                        {/* Launch Window Display */}
                                        <span className="flex items-center gap-1 text-space-400 font-mono text-[10px] tracking-tight ml-auto opacity-70">
                                            <span>T-0:</span>
                                            {b.created_at ? new Date(b.created_at).toLocaleString(undefined, { 
                                                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                                            }) : 'PENDING'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover/card:opacity-100 transition-all translate-x-2 group-hover/card:translate-x-0">
                                    <button 
                                        onClick={() => handleEdit(b)}
                                        className="p-2 text-space-500 hover:text-cosmos-400 hover:bg-cosmos-500/10 rounded-lg"
                                        title="Edit Mission"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => deleteBidder(b.id)}
                                        className="p-2 text-space-700 hover:text-red-400 hover:bg-red-400/10 rounded-lg"
                                        title="Remove Bidder"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className={clsx("p-5 bg-space-950/30 border-t border-white/5 grid gap-4 backdrop-blur-md relative z-10 transition-colors", editingId ? "bg-cosmos-900/10 border-cosmos-500/30" : "")}>
                {editingId && (
                    <div className="absolute top-0 right-0 px-2 py-1 bg-cosmos-600 text-[10px] text-white font-bold rounded-bl-lg">
                        EDITING MODE
                    </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-space-500 ml-1">Organization ID</label>
                        <div className="relative rounded-lg p-[1px]">
                             <GlowingEffect spread={20} glow={true} disabled={false} proximity={32} inactiveZone={0.01} borderWidth={1} />
                             <input 
                                type="text" 
                                placeholder="e.g. AstroCorp" 
                                className="glass-input w-full px-4 py-2.5 rounded-lg text-sm bg-space-900 border-transparent relative z-10 focus:ring-0 focus:outline-none"
                                value={newOrg}
                                onChange={e => setNewOrg(e.target.value)}
                                />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-space-500 ml-1">Mission Priority</label>
                        <div className="relative rounded-lg p-[1px]">
                            <GlowingEffect spread={20} glow={true} disabled={false} proximity={32} inactiveZone={0.01} borderWidth={1} />
                            <div className="relative z-10">
                                <select 
                                className="glass-input w-full px-4 py-2.5 rounded-lg text-sm appearance-none cursor-pointer bg-space-900 border-transparent focus:ring-0 focus:outline-none"
                                value={newPriority}
                                onChange={e => setNewPriority(e.target.value)}
                                >
                                    <option value="Low" className="bg-space-900 text-priority-low">Low Priority</option>
                                    <option value="Medium" className="bg-space-900 text-priority-medium">Medium Priority</option>
                                    <option value="High" className="bg-space-900 text-priority-high">High Priority</option>
                                    <option value="Critical" className="bg-space-900 text-priority-critical">Critical Priority</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-space-500">
                                    <Activity className="w-3 h-3" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <div className="space-y-1 flex-1">
                         <div className="relative rounded-lg p-[1px]">
                             <GlowingEffect spread={20} glow={true} disabled={false} proximity={32} inactiveZone={0.01} borderWidth={1} />
                             <input 
                                type="number" 
                                placeholder="Budget Allocation (USD)" 
                                className="glass-input w-full px-4 py-2.5 rounded-lg text-sm font-mono bg-space-900 border-transparent relative z-10 focus:ring-0 focus:outline-none"
                                value={newBudget}
                                onChange={e => setNewBudget(e.target.value)}
                             />
                         </div>
                    </div>
                    
                    <div className="relative rounded-lg p-[1px] flex-shrink-0 flex gap-2">
                         <GlowingEffect spread={20} glow={true} disabled={false} proximity={32} inactiveZone={0.01} borderWidth={1} />
                         
                         {editingId && (
                            <button 
                                type="button"
                                onClick={cancelEdit}
                                className="relative z-10 bg-space-800 hover:bg-space-700 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all"
                             >
                                <X className="w-4 h-4" />
                             </button>
                         )}

                         <button 
                            type="submit" 
                            className={clsx(
                                "relative z-10 text-white px-6 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow-lg hover:-translate-y-0.5 h-full",
                                editingId ? "bg-cosmos-600 hover:bg-cosmos-500 shadow-cosmos-600/50" : "bg-cosmos-700 hover:bg-cosmos-600 hover:shadow-cosmos-700/50"
                            )}
                         >
                            {editingId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                            <span className="hidden sm:inline">{editingId ? 'Update' : 'Add Signal'}</span>
                         </button>
                    </div>
                </div>
            </form>
          </div>
      </div>
  );
}
