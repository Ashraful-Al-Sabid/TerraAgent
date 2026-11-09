import React from 'react';
import { ShieldCheck, UserCheck, Settings, FileCheck2, Cpu, Database, Landmark, ExternalLink } from 'lucide-react';
import { getSystemSettings } from '../lib/supabase.js';

export function Navbar({ activeTab, setActiveTab, onOpenSettings }) {
  const settings = getSystemSettings();
  const hasOpenAI = Boolean(settings.openaiApiKey);
  const hasSupabase = Boolean(settings.supabaseUrl && settings.supabaseAnonKey);

  return (
    <header className="border-b border-white/[0.08] bg-[#070a12]/90 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Institutional Seal */}
        <div 
          className="flex items-center space-x-3.5 cursor-pointer group"
          onClick={() => setActiveTab('citizen')}
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-b from-emerald-900/40 to-slate-900 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-gov-card group-hover:border-emerald-500/50 transition-colors">
            <Landmark className="w-5 h-5 text-emerald-400" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#070a12]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-base tracking-tight text-white">Terra<span className="text-emerald-400 font-semibold">Agent</span></span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono tracking-wider font-semibold uppercase bg-emerald-950/70 text-emerald-300 border border-emerald-800/60">
                GOV.BD
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-bangla tracking-normal">ডিজিটাল ভূমি সেবা ও স্বয়ংক্রিয় যাচাইকরণ প্ল্যাটফর্ম</p>
          </div>
        </div>

        {/* Portal Switcher Tabs (Segmented Control) */}
        <nav className="flex items-center p-1 rounded-xl bg-[#0d1424] border border-white/[0.08] shadow-inner">
          <button
            onClick={() => setActiveTab('citizen')}
            className={`flex items-center space-x-2 px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'citizen'
                ? 'bg-emerald-600/90 text-white shadow-sm shadow-emerald-900/50 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Citizen Portal</span>
            <span className="text-[11px] font-bangla opacity-75">(নাগরিক)</span>
          </button>

          <button
            onClick={() => setActiveTab('officer')}
            className={`flex items-center space-x-2 px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'officer'
                ? 'bg-emerald-600/90 text-white shadow-sm shadow-emerald-900/50 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Officer Review</span>
            <span className="text-[11px] font-bangla opacity-75">(এসি ল্যান্ড)</span>
          </button>
        </nav>

        {/* System Telemetry & Configuration */}
        <div className="flex items-center space-x-3">
          <div className="hidden lg:flex items-center space-x-2 text-xs font-mono">
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-[#0d1424] border border-white/[0.06] text-slate-300">
              <span className={`w-1.5 h-1.5 rounded-full ${hasOpenAI ? 'bg-emerald-400' : 'bg-amber-400'} animate-pulse`} />
              <Cpu className="w-3 h-3 text-slate-400" />
              <span className="text-[11px]">{hasOpenAI ? 'GPT-4o Engine' : 'Heuristic Engine'}</span>
            </div>
            
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-[#0d1424] border border-white/[0.06] text-slate-300">
              <Database className="w-3 h-3 text-slate-400" />
              <span className="text-[11px]">{hasSupabase ? 'Supabase Sync' : 'Zero-Loss Storage'}</span>
            </div>
          </div>

          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-[#0d1424] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white transition-colors"
            title="System Settings & Cloud Integration"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
}
