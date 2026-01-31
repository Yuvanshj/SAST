import React from 'react';
import BiddingInterface from '../components/BiddingInterface';
import SettingsPanel from '../components/SettingsPanel';
import AuctionRunner from '../components/AuctionRunner';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-6 flex items-center gap-4">
        <Link to="/" className="p-2 hover:bg-white/10 rounded-full text-space-400 transition-colors">
            <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
            <h1 className="text-2xl font-orbitron text-white">Mission Control</h1>
            <p className="text-xs text-space-400 font-mono">AUTHORIZED PERSONNEL ONLY • CLEARANCE LEVEL 5</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Controls (4 cols) */}
        <div className="lg:col-span-4 space-y-6 flex flex-col">
          <div className="flex-none">
              <SettingsPanel />
          </div>
          <div className="flex-1 min-h-[400px]">
              <BiddingInterface />
          </div>
        </div>

        {/* Right Column: Visualization (8 cols) */}
        <div className="lg:col-span-8 flex flex-col justify-center">
           <AuctionRunner />
        </div>
      </div>
    </div>
  );
}
