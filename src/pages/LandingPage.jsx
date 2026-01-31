import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Rocket, Activity, Database, FileText, ArrowRight, Zap, ShieldCheck, Globe } from 'lucide-react';
import { GlowingEffect } from '../components/ui/glowing-effect';
import { useAuction } from '../stores/auctionStore';

function CommandCard({ title, desc, icon: Icon, to, colorClass = "text-cosmos-300" }) {
    return (
        <div className="relative rounded-xl p-0.5 group h-full">
            <GlowingEffect spread={30} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
            <Link to={to} className="block h-full">
                <div className="glass-panel p-6 rounded-xl h-full bg-space-950 border border-white/5 relative z-10 transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-white/5">
                    <div className={`w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-4 ${colorClass} group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6" />
                    </div>
                    
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-white font-orbitron text-lg tracking-wide">{title}</h3>
                        <ArrowRight className="w-4 h-4 text-space-400 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </div>
                    
                    <p className="text-sm text-space-400 leading-relaxed font-mono opacity-80 group-hover:opacity-100 transition-opacity">
                        {desc}
                    </p>
                </div>
            </Link>
        </div>
    );
}

export default function LandingPage() {
  const { isLive } = useAuction();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center relative z-10 space-y-16">
      
      {/* Hero Section */}
      <div className="max-w-4xl px-4 animate-in slide-in-from-bottom-8 fade-in duration-1000">
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-cosmos-900/30 border border-cosmos-500/20 text-cosmos-300 text-xs font-mono mb-8 backdrop-blur-md">
            <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></span>
            {/* <span className="tracking-widest uppercase">
                {isLive ? 'SYSTEM OPERATIONAL' : 'OFFLINE SIMULATION'}
            </span> */}
        </div>
        
        <h1 className="text-5xl md:text-7xl font-orbitron font-bold text-white mb-6 tracking-tight leading-tight">
          Rajputana <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cosmos-300 to-cosmos-500">Mission Hub</span>
        </h1>
        
        <p className="text-lg text-space-400 max-w-2xl mx-auto leading-relaxed">
          Central command interface for orbital launch allocation. <br/>
          Select a module to initiate protocol.
        </p>
      </div>

      {/* Mission Control Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl px-6 animate-in fade-in duration-1000 delay-200">
          
          <CommandCard 
            to="/admin"
            title="Launch Control"
            desc="Configure bidders, set weights, and execute the conflict resolution algorithm."
            icon={Rocket}
            colorClass="text-purple-400"
          />

          <CommandCard 
            to="/analytics"
            title="Telemetry"
            desc="Real-time EDA dashboard for visualizing bidder metrics and auction outcomes."
            icon={Activity}
            colorClass="text-blue-400"
          />

          <CommandCard 
            to="/data-preview"
            title="Data Manifest"
            desc="Inspect raw training signals and verify local dataset integrity."
            icon={Database}
            colorClass="text-emerald-400"
          />

          <CommandCard 
            to="/docs"
            title="Protocol Specs"
            desc="Mathematical documentation, algorithm playground, and compliance specs."
            icon={FileText}
            colorClass="text-rose-400"
          />

      </div>
      
       {/* Secondary Actions */}
       <div className="flex gap-4 animate-in fade-in duration-1000 delay-500">
            <Link to="/gallery" className="text-xs font-mono text-space-500 hover:text-white transition-colors flex items-center gap-2">
                <Globe className="w-3 h-3" />
                PUBLIC ACCESS GALLEY
            </Link>
             <span className="text-space-800">•</span>
            <a href="#" className="text-xs font-mono text-space-500 hover:text-white transition-colors flex items-center gap-2">
                <ShieldCheck className="w-3 h-3" />
                SECURITY AUDIT
            </a>
       </div>

    </div>
  );
}
