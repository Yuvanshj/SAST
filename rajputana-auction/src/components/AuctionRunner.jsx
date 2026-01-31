import React from 'react';
import { useAuction } from '../stores/auctionStore';
import { GlowingEffect } from './ui/glowing-effect';
import { Play, RotateCcw, Trophy, Activity, Zap } from 'lucide-react';
import clsx from 'clsx';

export default function AuctionRunner() {
  const { bidders, settings, results, executeAuction, resetResults } = useAuction();

  if (bidders.length < 2 && !results) {
    return (
      <div className="glass-panel rounded-2xl p-12 text-center text-space-400 flex flex-col items-center justify-center h-full min-h-[400px]">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
            <Activity className="w-8 h-8 text-white/50" />
        </div>
        <h3 className="text-2xl font-orbitron mb-2 text-white">Awaiting Signals</h3>
        <p className="max-w-xs mx-auto text-space-400/70 text-sm">Register multiple organizations to initialize the conflict resolution protocol.</p>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="glass-panel rounded-2xl p-12 text-center relative overflow-hidden h-full flex flex-col items-center justify-center">
        <div className="relative z-10 animate-fade-in">
            <h3 className="text-3xl font-orbitron text-white mb-2 tracking-widest">READY TO LAUNCH</h3>
            <p className="text-space-400 mb-8 font-mono text-xs tracking-wide uppercase">Sequence Initiated • Weights Locked</p>
            
            <button
            onClick={executeAuction}
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-300 bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/30 font-orbitron rounded-xl backdrop-blur-md"
            >
            <span className="relative flex items-center gap-3">
                <Play className="w-5 h-5 fill-current" />
                INITIATE PROTOCOL
            </span>
            </button>

            <div className="mt-8 flex justify-center gap-8 text-[10px] font-mono text-space-400/50 uppercase tracking-widest">
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    <span>Algorithm Active</span>
                </div>
                <div className="flex items-center gap-2">
                    <Zap className="w-3 h-3" />
                    <span>Real-time</span>
                </div>
            </div>
        </div>
      </div>
    );
  }

  const { sorted, explanation } = processResults(results);

  return (
    <div className="space-y-6 animate-slide-up">
      
      {/* Winner Card */}
      <div className="relative rounded-xl p-0.5">
          <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
                borderWidth={3}
          />
          <div className="glass-panel rounded-xl p-8 text-center relative overflow-hidden bg-space-950 border border-white/5">
                <div className="inline-flex p-3 rounded-full bg-white/5 text-cosmos-300 mb-6 animate-float border border-white/5">
                    <Trophy className="w-8 h-8" />
                </div>
                
                <h2 className="text-[10px] font-bold text-space-400 uppercase tracking-[0.3em] mb-4">Launch Window Assigned To</h2>
                <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-white mb-6">
                    {sorted[0].name}
                </h1>
                
                <div className="max-w-xl mx-auto bg-white/5 border border-white/5 p-4 rounded-lg">
                <p className="text-space-300 text-sm leading-relaxed font-mono">
                    {explanation}
                </p>
                </div>
          </div>
      </div>

      {/* Breakdown Table */}
      <div className="relative rounded-xl p-0.5">
          <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
                borderWidth={2}
          />
          <div className="glass-panel rounded-xl overflow-hidden bg-space-950 border border-white/5">
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-space-950/20">
                <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cosmos-300" />
                    <h3 className="font-orbitron text-sm text-white tracking-widest">TELEMETRY</h3>
                </div>
                <button onClick={resetResults} className="text-[10px] font-bold font-mono px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-space-300 transition-colors flex items-center gap-2 border border-white/5">
                    <RotateCcw className="w-3 h-3" /> REBOOT
                </button>
            </div>
            
            <div className="p-6 space-y-6">
                {sorted.map((bidder, idx) => (
                    <div key={bidder.id} className="relative group">
                        <div className="flex justify-between items-end mb-2">
                            <span className={clsx("font-bold text-base font-orbitron", idx === 0 ? "text-white" : "text-space-400")}>
                                <span className="text-xs opacity-30 font-mono mr-3">0{idx + 1}</span>
                                {bidder.name}
                            </span>
                            <div className="text-right">
                                <span className="font-mono text-xl font-bold text-white">{bidder.finalScore}</span>
                            </div>
                        </div>

                        {/* Progress Bars - Cleaner */}
                        <div className="h-4 bg-space-950/50 rounded overflow-hidden flex relative border border-white/5">
                            <div 
                                className="h-full bg-cosmos-500/80 hover:bg-cosmos-500 transition-all duration-1000 ease-out" 
                                style={{ width: `${Math.min(bidder.budgetComponent, 100)}%` }}
                            ></div>
                            <div 
                                className="h-full bg-priority-critical/80 hover:bg-priority-critical ml-0.5 transition-all duration-1000 ease-out delay-100" 
                                style={{ width: `${Math.min(bidder.priorityComponent, 100)}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
          </div>
      </div>
    </div>
  );
}

function processResults(results) {
    const { bidders: scoredBidders } = results.calculation_snapshot;
    const winner = scoredBidders[0];
    const runnerUp = scoredBidders[1];
    
    let text = `Secured the launch window. `;
    const budgetWin = winner.budgetComponent > winner.priorityComponent;
    
    if (budgetWin) {
        text += `Primary Factor: Financial Commitment (${winner.budgetComponent.toFixed(1)} pts).`;
    } else {
        text += `Primary Factor: Mission Criticality (${winner.priorityComponent.toFixed(1)} pts).`;
    }

    if (runnerUp) {
        const margin = (winner.finalScore - runnerUp.finalScore).toFixed(2);
        text += ` Margin: +${margin}`;
    }

    return { sorted: scoredBidders, explanation: text };
}
