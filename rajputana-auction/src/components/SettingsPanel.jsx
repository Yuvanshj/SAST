import React from 'react';
import { useAuction } from '../stores/auctionStore';
import { Settings, Sliders, Info } from 'lucide-react';
import { GlowingEffect } from './ui/glowing-effect';

export default function SettingsPanel() {
  const { settings, updateSettings } = useAuction();
  const { budget_weight, priority_weight } = settings;

  const handleBudgetChange = (e) => {
    const val = parseFloat(e.target.value);
    let wBudget = Math.min(Math.max(val, 0), 1);
    let wPriority = parseFloat((1 - wBudget).toFixed(2));
    updateSettings({ budget_weight: wBudget, priority_weight: wPriority });
  };

  return (
    <div className="relative rounded-2xl p-0.5">
      <GlowingEffect
        spread={40}
        glow={true}
        disabled={false}
        proximity={64}
        inactiveZone={0.01}
        borderWidth={3}
      />
      <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group bg-space-950 border border-white/5">
        {/* Decorative gradient blob */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-cosmos-500/10 rounded-full blur-3xl -z-10 transition-opacity group-hover:opacity-75"></div>

        <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
            <div className="p-2 bg-white/5 rounded-lg text-cosmos-300">
            <Sliders className="w-5 h-5" />
            </div>
            <h2 className="font-orbitron text-lg font-semibold text-white tracking-wide">Mission Parameters</h2>
        </div>

        <div className="space-y-8">
            {/* Sliders */}
            <div className="relative rounded-xl p-0.5">
                <GlowingEffect
                    spread={40}
                    glow={true}
                    disabled={false}
                    proximity={64}
                    inactiveZone={0.01}
                    borderWidth={2}
                />
                <div className="bg-space-900/40 rounded-xl p-4 border border-white/5">
                    <div className="flex justify-between text-sm mb-4 font-orbitron tracking-wider">
                        <span className="text-cosmos-300">Budget Weight</span>
                        <span className="text-priority-critical">Priority Weight</span>
                    </div>
                    
                    <div className="relative h-6 flex items-center mb-6">
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={budget_weight}
                                onChange={handleBudgetChange}
                                className="absolute w-full h-2 bg-space-950 rounded-lg appearance-none cursor-pointer z-10 opacity-0"
                            />
                            {/* Custom Track */}
                            <div className="w-full h-3 bg-space-950 rounded-full overflow-hidden relative border border-white/5">
                                <div 
                                    className="h-full bg-gradient-to-r from-cosmos-500 to-priority-critical" 
                                    style={{ width: '100%' }}
                                ></div>
                                {/* Thumb Indicator (visual only) */}
                                <div 
                                    className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_white] z-20 pointer-events-none transition-all duration-75"
                                    style={{ left: `${budget_weight * 100}%` }}
                                ></div>
                            </div>
                    </div>
                    
                    <div className="flex justify-between text-xs text-space-400 font-mono">
                        <span className="bg-cosmos-900/50 px-2 py-1 rounded border border-cosmos-500/30">
                            {Math.round(budget_weight * 100)}% FINANCIAL
                        </span>
                        <span className="bg-priority-critical/10 px-2 py-1 rounded border border-priority-critical/30 text-priority-critical">
                            {Math.round(priority_weight * 100)}% URGENCY
                        </span>
                    </div>
                </div>
            </div>

            {/* Priority Legend */}
            <div className="relative rounded-xl p-0.5">
                <GlowingEffect
                    spread={40}
                    glow={true}
                    disabled={false}
                    proximity={64}
                    inactiveZone={0.01}
                    borderWidth={2}
                />
                <div className="p-4 bg-space-900/80 rounded-xl border border-white/5 relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                        <Info className="w-3 h-3 text-space-400" />
                        <h3 className="text-[10px] font-bold text-space-400 uppercase tracking-widest">Multipliers</h3>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-2 text-center">
                        {[
                            { label: 'Low', color: 'bg-priority-low', mult: '1x' },
                            { label: 'Med', color: 'bg-priority-medium', mult: '2x' },
                            { label: 'High', color: 'bg-priority-high', mult: '3x' },
                            { label: 'Crit', color: 'bg-priority-critical', mult: '4x', animate: true }
                        ].map((p) => (
                            <div key={p.label} className="bg-space-950 rounded p-2 border border-white/5 flex flex-col items-center gap-1">
                                <span className={`w-2 h-2 rounded-full ${p.color} ${p.animate ? 'animate-pulse' : ''}`}></span>
                                <span className="text-[10px] text-space-300 font-bold">{p.label}</span>
                                <span className="text-[9px] text-space-500 font-mono">{p.mult}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
