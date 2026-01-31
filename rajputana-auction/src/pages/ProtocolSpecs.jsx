import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Calculator, Variable, TrendingUp, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GlowingEffect } from '../components/ui/glowing-effect';

// Re-using the logic logic for the playground
const calculatePlaygroundScore = (budget, priority, bWeight, pWeight, maxB) => {
    const normB = (budget / maxB) * 100;
    const bComp = normB * bWeight;
    const pComp = (priority * 25) * pWeight;
    return (bComp + pComp).toFixed(2);
};

export default function ProtocolSpecs() {
  const navigate = useNavigate();
  
  // Playground State
  const [pBudget, setPBudget] = useState(25);
  const [pMaxBudget, setPMaxBudget] = useState(50);
  const [pPriority, setPPriority] = useState(2); // 1-4
  const [pWeightB, setPWeightB] = useState(0.6);
  
  const score = calculatePlaygroundScore(pBudget, pPriority, pWeightB, 1 - pWeightB, pMaxBudget);

  return (
    <div className="space-y-12 pb-24">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 border-b border-white/10 pb-6"
      >
        <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-space-400 hover:text-white transition-colors w-fit group"
        >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-mono tracking-wider uppercase">Return to Command</span>
        </button>

        <div>
            <h1 className="text-4xl font-orbitron font-bold text-white tracking-widest">PROTOCOL SPECIFICATIONS</h1>
            <p className="text-space-400 text-sm font-mono mt-2">ALGORITHM TRANSPARENCY & SCORING LOGIC v2.0</p>
        </div>
      </motion.div>

      {/* 1. Core Equation */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 text-white">
            <Variable className="w-6 h-6 text-cosmos-400" />
            <h2 className="text-2xl font-orbitron">The Core Equation</h2>
        </div>
        
        <div className="glass-panel p-8 bg-space-950/50 border border-white/10 rounded-2xl relative overflow-hidden">
             <div className="font-mono text-sm md:text-lg text-center space-y-6">
                <div className="bg-black/40 p-6 rounded-xl border border-white/5 inline-block">
                    <span className="text-space-300">FinalScore</span>
                    <span className="text-white mx-2">=</span>
                    <span className="text-cosmos-400">(NormalizedBudget × W_Budget)</span>
                    <span className="text-white mx-2">+</span>
                    <span className="text-priority-critical">(PriorityScore × 25 × W_Priority)</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-4xl mx-auto mt-8">
                    <div>
                        <h4 className="text-cosmos-400 font-bold mb-2 border-b border-cosmos-400/20 pb-1">Normalized Budget</h4>
                        <p className="text-space-400 text-xs leading-relaxed">
                            <code className="bg-white/10 px-1 rounded"> (Budget / MaxAuctionBudget) * 100 </code>
                            <br/>
                            We normalize all bids against the highest bid in the pool. The highest bidder always gets 100 points for this component.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-priority-critical font-bold mb-2 border-b border-priority-critical/20 pb-1">Priority Score</h4>
                        <p className="text-space-400 text-xs leading-relaxed">
                            <code className="bg-white/10 px-1 rounded"> PriorityLevel * 25 </code>
                            <br/>
                            Non-linear scaling: Critical=100, High=75, Medium=50, Low=25. This allows "Critical" missions to compete purely on urgency.
                        </p>
                    </div>
                </div>
             </div>
        </div>
      </section>

      {/* 2. Interactive Playground */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 text-white">
            <Calculator className="w-6 h-6 text-green-400" />
            <h2 className="text-2xl font-orbitron">Algorithm Playground</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-panel p-6 border border-white/10 rounded-xl space-y-6">
                <div>
                    <label className="text-xs text-space-400 uppercase tracking-wider block mb-2">My Budget ($M)</label>
                    <input 
                        type="range" min="1" max="100" value={pBudget} 
                        onChange={(e) => setPBudget(Number(e.target.value))}
                        className="w-full accent-cosmos-500"
                    />
                    <div className="text-right text-cosmos-400 font-mono">${pBudget}M</div>
                </div>

                <div>
                    <label className="text-xs text-space-400 uppercase tracking-wider block mb-2">Max Bid in Room ($M)</label>
                    <input 
                        type="range" min={pBudget} max="100" value={Math.max(pBudget, pMaxBudget)} 
                        onChange={(e) => setPMaxBudget(Number(e.target.value))}
                        className="w-full accent-space-500"
                    />
                    <div className="text-right text-space-400 font-mono">${Math.max(pBudget, pMaxBudget)}M</div>
                </div>

                <div>
                    <label className="text-xs text-space-400 uppercase tracking-wider block mb-2">My Priority</label>
                    <div className="flex gap-2">
                        {['Low', 'Medium', 'High', 'Critical'].map((label, idx) => (
                            <button
                                key={label}
                                onClick={() => setPPriority(idx + 1)}
                                className={`flex-1 py-2 text-xs font-bold rounded border ${
                                    pPriority === idx + 1 
                                    ? 'bg-white text-black border-white' 
                                    : 'bg-transparent text-space-400 border-white/10 hover:border-white/30'
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="text-xs text-space-400 uppercase tracking-wider block mb-2">Global Budget Weight: {pWeightB}</label>
                    <input 
                        type="range" min="0" max="1" step="0.1" value={pWeightB} 
                        onChange={(e) => setPWeightB(Number(e.target.value))}
                        className="w-full accent-white"
                    />
                    <div className="flex justify-between text-[10px] text-space-500 font-mono mt-1">
                        <span>Budget Heavy</span>
                        <span>Balanced</span>
                        <span>Priority Heavy</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col justify-center">
                <div className="relative rounded-xl p-0.5">
                    <GlowingEffect spread={20} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
                    <div className="glass-panel rounded-xl p-8 bg-space-950 text-center relative z-10">
                        <h4 className="text-space-400 uppercase tracking-widest text-xs mb-4">Calculated Score</h4>
                        <div className="text-6xl font-orbitron font-bold text-white mb-2">{score}</div>
                        <p className="text-space-500 text-xs">/ 100.00 Points</p>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* 3. Advanced Modules */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 text-white">
            <Brain className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-orbitron">Advanced Modules</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-6 border border-white/10 rounded-xl hover:bg-white/5 transition-colors">
                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    Nash Equilibrium Advisor
                </h3>
                <p className="text-sm text-space-300 leading-relaxed mb-4">
                    The "Tactical Advisor" uses a simplified Game Theory approach (Vickrey-Clarke-Groves mechanism inspiration) to reverse-engineer the required bid to win.
                </p>
                <code className="block bg-black/30 p-3 rounded text-xs text-space-400 font-mono">
                    TargetBid = LeaderScore - MyPriorityScore / Weight + Margin
                </code>
            </div>

            <div className="glass-panel p-6 border border-white/10 rounded-xl hover:bg-white/5 transition-colors">
                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-red-400" />
                    Chaos Engine
                </h3>
                <p className="text-sm text-space-300 leading-relaxed mb-4">
                    Introduces stochastic variables (e.g., Solar Flares, geopolitical shifts) that dynamically alter the standard weights (`W_Budget`, `W_Priority`) during the auction lifecycle.
                </p>
                <code className="block bg-black/30 p-3 rounded text-xs text-space-400 font-mono">
                    NewWeight = BaseWeight + (RandomEventSeverity * 0.2)
                </code>
            </div>
        </div>
      </section>

    </div>
  );
}
