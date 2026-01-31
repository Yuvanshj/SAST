import React, { useMemo } from 'react';
import { useAuction } from '../stores/auctionStore';
import { useNavigate } from 'react-router-dom';
import { TRAINING_DATA } from '../data/training_data';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis, LineChart, Line
} from 'recharts';
import { motion } from 'motion/react';
import { GlowingEffect } from '../components/ui/glowing-effect';
import { Activity, Calendar, Database, DollarSign, Layers, Rocket, Shield, TrendingUp, ArrowLeft } from 'lucide-react';

const COLORS = {
  primary: '#6366f1',
  secondary: '#8b5cf6', 
  accent: '#f43f5e',
  success: '#10b981',
  warning: '#f59e0b',
  background: '#0f172a',
  grid: '#334155'
};

const PIE_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981'];

export default function AnalyticsEDA() {
  const { bidders, settings, uploadBatchBidders } = useAuction();
  const navigate = useNavigate();

  // handleLoadData removed

  // --- Data Processing ---
  const kpiData = useMemo(() => {
    const totalBudget = bidders.reduce((sum, b) => sum + (Number(b.budget_million_usd || b.budget) || 0), 0);
    const avgReadiness = bidders.reduce((sum, b) => sum + (Number(b.technical_readiness) || 0), 0) / (bidders.length || 1);
    const totalPayload = bidders.reduce((sum, b) => sum + (Number(b.payload_mass_kg) || 0), 0);
    
    return {
      totalCandidates: bidders.length,
      totalBudget: totalBudget, // Assuming millions if from CSV, or raw if local
      avgReadiness: avgReadiness.toFixed(1),
      totalPayload: (totalPayload / 1000).toFixed(1) // tonnes
    };
  }, [bidders]);

  const timelineData = useMemo(() => {
    return bidders
      .map(b => ({
        id: b.bidder_id || b.id,
        date: new Date(b.launch_window_date || b.created_at).getTime(),
        dateStr: new Date(b.launch_window_date || b.created_at).toLocaleDateString(),
        priority: b.priority_level || b.priority,
        org: b.organization_type || 'Unknown',
        budget: Number(b.budget_million_usd || b.budget) || 0,
      }))
      .sort((a, b) => a.date - b.date);
  }, [bidders]);

  const orgTypeData = useMemo(() => {
    const counts = bidders.reduce((acc, curr) => {
      const type = curr.organization_type || 'Unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
  }, [bidders]);

  const scatterData = useMemo(() => {
    return bidders.map(b => ({
        name: b.name || b.bidder_id,
        x: Number(b.payload_mass_kg) || 0,
        y: Number(b.budget_million_usd || b.budget) || 0,
        z: Number(b.technical_readiness) || 5, // Bubble size based on readiness
        priority: b.priority_level || b.priority
    })).filter(d => d.x > 0 || d.y > 0);
  }, [bidders]);

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

        <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-space-900 border border-white/10">
                <Database className="w-6 h-6 text-cosmos-400" />
            </div>
            <div>
                <h1 className="text-3xl font-orbitron font-bold text-white tracking-wider">Mission Control Analytics</h1>
                <p className="text-space-400 text-sm">Real-time telemetry and exploratory analysis of auction candidates.</p>
            </div>
        </div>
      </motion.div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Active Candidates" value={kpiData.totalCandidates} icon={<Rocket />} color="text-blue-400" />
        <KpiCard title="Total Committed Value" value={`$${kpiData.totalBudget.toLocaleString()}M`} icon={<DollarSign />} color="text-green-400" />
        <KpiCard title="Avg. Readiness Level" value={`TRL ${kpiData.avgReadiness}`} icon={<Layers />} color="text-purple-400" />
        <KpiCard title="Total Payload Mass" value={`${kpiData.totalPayload}t`} icon={<Activity />} color="text-orange-400" />
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">
        {/* Timeline Chart - Spans 2 cols */}
        <div className="lg:col-span-2 relative isolate group h-full">
            <GlassCard title="Launch Window Timeline" subtitle="Projected launch dates across all missions">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                        <XAxis 
                            dataKey="date" 
                            type="number" 
                            domain={['dataMin', 'dataMax']} 
                            tickFormatter={(unix) => new Date(unix).toLocaleDateString(undefined, {month:'short', day:'numeric'})}
                            stroke="#64748b"
                            tick={{fill: '#64748b', fontSize: 10}}
                        />
                        <YAxis 
                            dataKey="budget" 
                            name="Budget" 
                            unit="M" 
                            stroke="#64748b"
                            tick={{fill: '#64748b', fontSize: 10}}
                        />
                        <Tooltip 
                            cursor={{ strokeDasharray: '3 3' }}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const data = payload[0].payload;
                                    return (
                                        <div className="bg-space-950 border border-cosmos-500/30 p-3 rounded-lg shadow-xl backdrop-blur-xl">
                                            <p className="text-white font-bold mb-1">{data.org}</p>
                                            <p className="text-xs text-space-300">Date: {data.dateStr}</p>
                                            <p className="text-xs text-green-400">Budget: ${data.budget}M</p>
                                            <p className="text-[10px] uppercase mt-2 bg-white/10 w-fit px-2 py-0.5 rounded">{data.priority}</p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Legend />
                        <Scatter name="Missions" data={timelineData} fill="#8884d8">
                            {timelineData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.budget > 25 ? COLORS.accent : COLORS.primary} />
                            ))}
                        </Scatter>
                    </ScatterChart>
                </ResponsiveContainer>
            </GlassCard>
        </div>

        {/* Org Dist Pie - Spans 1 col */}
        <div className="h-full">
            <GlassCard title="Organization Type" subtitle="Sector breakdown">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={orgTypeData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {orgTypeData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="rgba(0,0,0,0)" />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                </ResponsiveContainer>
            </GlassCard>
        </div>
      </div>

      {/* Second Row Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
         <GlassCard title="Cost Effectiveness Analysis" subtitle="Budget (Y) vs Payload Mass (X) • Size = Technical Readiness">
            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis type="number" dataKey="x" name="Payload" unit="kg" stroke="#64748b" />
                    <YAxis type="number" dataKey="y" name="Budget" unit="M" stroke="#64748b" />
                    <ZAxis type="number" dataKey="z" range={[50, 400]} name="Readiness" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                    <Scatter name="Candidates" data={scatterData} fill="#10b981" fillOpacity={0.6} />
                </ScatterChart>
            </ResponsiveContainer>
         </GlassCard>

         <GlassCard title="Mission Urgency Distribution" subtitle="Priority Level Breakdown">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bidders} layout="vertical" margin={{ left: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                    <XAxis type="number" stroke="#64748b" />
                    <YAxis dataKey="priority_level" type="category" stroke="#94a3b8" width={100} />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                    <Bar dataKey="urgency_score" fill="#f59e0b" radius={[0, 4, 4, 0]} maxBarSize={20} name="Urgency Score" />
                </BarChart>
             </ResponsiveContainer>
         </GlassCard>
      </div>

      {/* Detailed Data Table */}
      <div className="relative isolate group mt-8">
        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} />
        <div className="relative z-10 bg-space-950/40 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                <h3 className="text-xl font-orbitron text-white">Mission Manifest</h3>
                <div className="flex gap-2">
                    {/* Buttons removed as per user request */}
                </div>
            </div>
            <div className="overflow-x-auto max-h-[500px]">
            <table className="w-full text-left text-sm text-space-200">
                <thead className="text-xs uppercase bg-space-950 text-space-400 sticky top-0 z-20">
                <tr>
                    <th className="px-6 py-4 font-semibold tracking-wider">Mission ID</th>
                    <th className="px-6 py-4 font-semibold tracking-wider">Organization</th>
                    <th className="px-6 py-4 font-semibold tracking-wider">Type</th>
                    <th className="px-6 py-4 font-semibold tracking-wider text-right">Budget</th>
                    <th className="px-6 py-4 font-semibold tracking-wider text-right">Payload</th>
                    <th className="px-6 py-4 font-semibold tracking-wider text-center">Priority</th>
                    <th className="px-6 py-4 font-semibold tracking-wider">Launch Window</th>
                    <th className="px-6 py-4 font-semibold tracking-wider text-center">Readiness</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-space-900/20">
                {bidders.length === 0 ? (
                    <tr>
                        <td colSpan={8} className="px-6 py-12 text-center text-space-500">
                           <div className="flex flex-col items-center gap-4">
                                <Activity className="w-12 h-12 opacity-20" />
                                <div className="max-w-md text-center">
                                    <h3 className="text-white font-bold mb-2">Awaiting Mission Data</h3>
                                    <p className="text-xs mb-4">No telemetry signals detected in the system.</p>
                                    
                                    <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg text-left">
                                        <p className="text-red-400 font-bold text-xs uppercase mb-2">⚠️ Configuration Required</p>
                                        <p className="text-xs text-space-300 leading-relaxed mb-3">
                                            The <code className="text-white bg-black/50 px-1 rounded">bidders</code> table is missing.
                                        </p>
                                        <div className="bg-black/50 p-2 rounded text-[10px] font-mono text-space-400 overflow-x-auto whitespace-pre">
                                            Run the `supabase_schema.sql` script in your Supabase SQL Editor to initialize the database.
                                        </div>
                                    </div>
                                </div>
                           </div>
                        </td>
                    </tr>
                ) : (
                    bidders.map((b, i) => (
                        <tr key={i} className="hover:bg-white/5 transition-colors group">
                            <td className="px-6 py-4 font-mono text-xs text-space-400 group-hover:text-white transition-colors">{b.bidder_id || b.id || `#${i+1}`}</td>
                            <td className="px-6 py-4 font-bold text-white">{b.name || `Bidder ${i+1}`}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded text-[10px] uppercase border ${
                                    (b.organization_type === 'Military' || b.priority === 'Critical') ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                    (b.organization_type === 'Commercial') ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                    'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                }`}>
                                    {b.organization_type || 'Unknown'}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right font-mono text-green-400">${Number(b.budget_million_usd || b.budget).toLocaleString()}M</td>
                            <td className="px-6 py-4 text-right font-mono text-space-300">{Number(b.payload_mass_kg || 0).toLocaleString()} kg</td>
                            <td className="px-6 py-4 text-center">
                                <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                                    (b.priority_level === 'Critical' || b.priority === 'Critical') ? 'bg-red-500 animate-pulse' :
                                    (b.priority_level === 'High' || b.priority === 'High') ? 'bg-orange-500' :
                                    'bg-blue-500'
                                }`}></span>
                                {b.priority_level || b.priority}
                            </td>
                            <td className="px-6 py-4 text-space-300">{new Date(b.launch_window_date || b.created_at).toLocaleDateString()}</td>
                            <td className="px-6 py-4 text-center">
                                <div className="w-16 h-1.5 bg-space-800 rounded-full overflow-hidden inline-block align-middle">
                                    <div 
                                        className="h-full bg-cosmos-500" 
                                        style={{ width: `${((Number(b.technical_readiness) || 5) / 10) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="ml-2 text-xs text-space-400">{b.technical_readiness || 5}/10</span>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
            </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, icon, color }) {
    return (
        <div className="relative isolate group p-[1px] rounded-xl overflow-hidden">
            <GlowingEffect spread={20} glow={true} disabled={false} proximity={64} inactiveZone={0.01} />
            <div className="relative z-10 bg-space-950/60 backdrop-blur-xl border border-white/10 rounded-xl p-5 h-full flex flex-col justify-between hover:bg-space-900/60 transition-colors">
                <div className="flex justify-between items-start mb-4">
                    <span className="text-space-400 text-xs font-bold uppercase tracking-widest leading-relaxed">{title}</span>
                    <div className={`p-2 rounded-lg bg-white/5 ${color} bg-opacity-10`}>
                        {React.cloneElement(icon, { size: 18 })}
                    </div>
                </div>
                <div className="text-3xl font-orbitron font-bold text-white tracking-widest">{value}</div>
            </div>
        </div>
    )
}

function GlassCard({ title, subtitle, children }) {
    return (
        <div className="relative isolate group h-full flex flex-col">
            <GlowingEffect spread={40} glow={true} disabled={false} proximity={128} inactiveZone={0.1} />
            <div className="relative z-10 bg-space-950/40 backdrop-blur-xl border border-white/10 rounded-xl p-6 h-full flex flex-col shadow-lg">
                <div className="mb-6">
                    <h3 className="text-lg font-orbitron font-bold text-white tracking-wide">{title}</h3>
                    {subtitle && <p className="text-xs text-space-400 mt-1">{subtitle}</p>}
                </div>
                <div className="flex-1 w-full min-h-0 relative">
                    <div className="absolute inset-0">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}
