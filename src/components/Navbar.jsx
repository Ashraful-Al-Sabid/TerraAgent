import React from 'react';
import { ShieldCheck, UserCheck, Settings, FileCheck2, Cpu, Database } from 'lucide-react';
import { getSystemSettings } from '../lib/supabase';

export function Navbar({ activeTab, setActiveTab, onOpenSettings }) {
  const settings = getSystemSettings();
  const hasOpenAI = Boolean(settings.openaiApiKey);
  const hasSupabase = Boolean(settings.supabaseUrl && settings.supabaseAnonKey);

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Identity */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('citizen')}>
          <div className="w-10 h-10 rounded-lg bg-emerald-900/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner shadow-emerald-500/20">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight text-white">Terra<span className="text-emerald-400">Agent</span></span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-emerald-950 text-emerald-300 border border-emerald-800/80">MVP</span>
            </div>
            <p className="text-xs text-slate-400 font-bangla">টেকসই ভূমি ও নাগরিক সেবা ভেরিফিকেশন</p>
          </div>
        </div>

        {/* Portal Switcher Tabs */}
        <nav className="flex items-center space-x-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('citizen')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'citizen'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Citizen Portal</span>
            <span className="text-xs font-bangla opacity-80">(নাগরিক)</span>
          </button>

          <button
            onClick={() => setActiveTab('officer')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'officer'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Officer Dashboard</span>
            <span className="text-xs font-bangla opacity-80">(কর্মকর্তা)</span>
          </button>
        </nav>

        {/* Integration Status Badges & Settings */}
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-2 text-xs">
            <div className="flex items-center space-x-1 px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
              <Cpu className={`w-3.5 h-3.5 ${hasOpenAI ? 'text-emerald-400' : 'text-amber-400'}`} />
              <span>{hasOpenAI ? 'GPT-4o Live' : 'AI Emulated'}</span>
            </div>
            <div className="flex items-center space-x-1 px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
              <Database className={`w-3.5 h-3.5 ${hasSupabase ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>{hasSupabase ? 'Supabase Sync' : 'Local Storage'}</span>
            </div>
          </div>

          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Configure API Keys & Database"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
}
