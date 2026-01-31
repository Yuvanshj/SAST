import React from 'react';
import { Trophy, Clock } from 'lucide-react';
import { GlowingEffect } from './ui/glowing-effect';
import clsx from 'clsx';

export default function AuctionCard({ result }) {
    const { winner_id, winner_score, created_at, calculation_snapshot } = result;
    
    // Find winner details from snapshot to be safe (if generic ID lookups fail)
    // The snapshot has { bidders: [], settings: {} } and bidders are sorted. 
    // Usually winner_id matches the first one.
    const winnerData = calculation_snapshot.bidders.find(b => b.id === winner_id) || calculation_snapshot.bidders[0];
    
    if (!winnerData) return null;

    const date = new Date(created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

    return (
        <div className="relative h-full rounded-xl p-0.5">
            <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
                borderWidth={3}
            />
            <div className="relative h-full rounded-xl bg-space-950 overflow-hidden group hover:shadow-[0_0_30px_rgba(139,92,246,0.1)] transition-all duration-300 border border-white/5">
                {/* Header / Banner */}
                <div className="h-24 bg-gradient-to-br from-space-800 to-space-950 relative p-4 flex justify-between items-start">
                     <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
                     <div className="z-10 bg-cosmos-500/20 text-cosmos-300 text-[10px] font-bold px-2 py-1 rounded border border-cosmos-500/20 backdrop-blur-md">
                        COMPLETED
                     </div>
                     <div className="z-10 flex items-center gap-1 text-[10px] text-space-400 font-mono">
                        <Clock className="w-3 h-3" />
                        {date}
                     </div>
                </div>

                {/* Content */}
                <div className="p-5 relative">
                    <div className="absolute -top-10 left-5">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cosmos-600 to-cosmos-800 flex items-center justify-center shadow-lg border-2 border-space-900 group-hover:scale-110 transition-transform">
                            <Trophy className="w-8 h-8 text-white" />
                        </div>
                    </div>

                    <div className="mt-8">
                        <h3 className="text-xl font-orbitron text-white font-bold">{winnerData.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-space-400 uppercase tracking-widest font-mono">Score:</span>
                            <span className="text-2xl font-bold text-cosmos-300 font-orbitron">{Number(winner_score).toFixed(2)}</span>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
                            <div>
                                <span className="block text-[10px] text-space-500 uppercase tracking-wider mb-1">Budget</span>
                                <span className="text-sm font-mono text-white">${(winnerData.budget / 1000000).toFixed(1)}M</span>
                            </div>
                            <div>
                                <span className="block text-[10px] text-space-500 uppercase tracking-wider mb-1">Priority</span>
                                <span className={clsx(
                                    "text-sm font-bold", 
                                    winnerData.priority === 'Critical' ? 'text-priority-critical' : 
                                    winnerData.priority === 'High' ? 'text-priority-high' : 'text-priority-medium'
                                )}>
                                    {winnerData.priority}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
