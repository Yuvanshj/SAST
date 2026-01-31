import React from 'react';
import { TRAINING_DATA } from '../data/training_data';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

export default function DataPreview() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 pb-12">
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
            <h1 className="text-3xl font-orbitron font-bold text-white tracking-wider">Offline Data Preview</h1>
            <p className="text-space-400 text-sm">Direct visualization of local training data (No Database Connection Required).</p>
        </div>
      </motion.div>

      {/* Data Table */}
      <div className="relative isolate group">
        <div className="relative z-10 bg-space-950/40 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-space-200">
                <thead className="text-xs uppercase bg-space-950 text-space-400 sticky top-0 z-20">
                <tr>
                    <th className="px-6 py-4 font-semibold tracking-wider">ID</th>
                    <th className="px-6 py-4 font-semibold tracking-wider">Organization</th>
                    <th className="px-6 py-4 font-semibold tracking-wider">Type</th>
                    <th className="px-6 py-4 font-semibold tracking-wider text-right">Budget</th>
                    <th className="px-6 py-4 font-semibold tracking-wider text-right">Payload (kg)</th>
                    <th className="px-6 py-4 font-semibold tracking-wider text-center">Priority</th>
                    <th className="px-6 py-4 font-semibold tracking-wider">Launch Date</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-space-900/20">
                    {TRAINING_DATA.map((row, i) => (
                        <tr key={i} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 font-mono text-xs text-space-400">{row.bidder_id}</td>
                            <td className="px-6 py-4 font-bold text-white">{row.organization_type}</td>
                            <td className="px-6 py-4 text-xs opacity-70">{row.mission_type}</td>
                            <td className="px-6 py-4 text-right font-mono text-green-400">${row.budget_million_usd}M</td>
                            <td className="px-6 py-4 text-right font-mono text-space-300">{row.payload_mass_kg}</td>
                            <td className="px-6 py-4 text-center">
                                <span className={`inline-block px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                                    row.priority_level === 'Critical' ? 'bg-red-500/20 text-red-400' :
                                    row.priority_level === 'High' ? 'bg-orange-500/20 text-orange-400' :
                                    'bg-blue-500/20 text-blue-400'
                                }`}>
                                    {row.priority_level}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-space-300">{row.launch_window_date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </div>
      </div>
    </div>
  );
}
