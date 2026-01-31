import React from 'react';
import { useNavigate } from 'react-router-dom';
import BackgroundVideo from '../assets/homepage-background.mp4';
import { Rocket, Star, Globe } from 'lucide-react';
import { useAuction } from '../stores/auctionStore';






export default function Layout({ children }) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen text-space-400 font-inter selection:bg-cosmos-500 selection:text-white overflow-x-hidden relative">
      {/* Dynamic Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 z-0 w-full h-full object-cover pointer-events-none opacity-40 brightness-75"
      >
        <source src={BackgroundVideo} type="video/mp4" />
      </video>

      {/* Header */}
      <header className="relative z-[60] border-b border-white/5 bg-space-950/70 backdrop-blur-md sticky top-0 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-default">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cosmos-700 to-cosmos-900 shadow-lg group-hover:shadow-cosmos-500/50 transition-all duration-500 flex items-center justify-center p-2">
               <Globe className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="flex flex-col">
              <span className="font-orbitron font-bold text-2xl text-white tracking-widest leading-none">
                RAJPUTANA
              </span>
              <span className="text-[10px] font-bold text-cosmos-300 tracking-[0.3em] uppercase opacity-70 group-hover:opacity-100 transition-opacity">
                Launch Protocol
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
              <button 
                onClick={() => navigate('/analytics')}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-space-900 border border-white/10 rounded-full text-xs font-bold text-white uppercase tracking-wider hover:bg-space-800 hover:border-cosmos-500/50 transition-all shadow-lg hover:shadow-cosmos-500/20"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-cosmos-400"></div>
                View Analytics
              </button>

              {/* ConnectionStatus removed */}
              
              <div className="flex flex-col items-end border-l border-white/10 pl-6">
                  <span className="font-orbitron font-black text-sm text-white tracking-[0.2em]">
                    SAST | TECH GC
                  </span>
              </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-[50] max-w-7xl mx-auto px-6 py-12 pointer-events-auto">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-[50] border-t border-white/5 mt-auto bg-space-950/50 backdrop-blur-sm pointer-events-auto">
        <div className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center text-sm text-space-400/50">
          <p>© 2026 SAST Orbital Command. All rights reserved.</p>
          <div className="flex gap-4">
             <button onClick={() => navigate('/analytics')} className="hover:text-cosmos-300 cursor-pointer transition-colors bg-transparent border-none p-0">Analytics (EDA)</button>
             <span className="hover:text-cosmos-300 cursor-pointer transition-colors">Documentation</span>
             <span className="hover:text-cosmos-300 cursor-pointer transition-colors">Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
