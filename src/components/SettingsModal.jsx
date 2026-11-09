import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  Key, 
  Database, 
  Check, 
  Sparkles, 
  RotateCcw,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { getSystemSettings, saveSystemSettings } from '../lib/supabase';

export function SettingsModal({ onClose, onSettingsUpdated }) {
  const current = getSystemSettings();
  const [openaiApiKey, setOpenaiApiKey] = useState(current.openaiApiKey || '');
  const [supabaseUrl, setSupabaseUrl] = useState(current.supabaseUrl || '');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(current.supabaseAnonKey || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    saveSystemSettings({
      openaiApiKey: openaiApiKey.trim(),
      supabaseUrl: supabaseUrl.trim(),
      supabaseAnonKey: supabaseAnonKey.trim()
    });
    setSaveSuccess(true);
    if (onSettingsUpdated) onSettingsUpdated();
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  const handleResetStorage = () => {
    if (confirm('Reset local application data and reload default synthetic personas?')) {
      localStorage.removeItem('terra_applications');
      localStorage.removeItem('terra_agent_logs');
      localStorage.removeItem('terra_dossier_reports');
      localStorage.removeItem('terra_officer_reviews');
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-base">System Settings & Cloud Integration</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {saveSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-200 text-xs flex items-center space-x-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Credentials saved securely! Connecting to endpoints...</span>
          </div>
        )}

        <form onSubmit={handleSave} className="mt-4 space-y-4">
          
          {/* OpenAI API Key */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                <Key className="w-3.5 h-3.5 text-emerald-400" />
                <span>OpenAI API Key (Optional)</span>
              </label>
              <span className="text-[10px] text-slate-500">gpt-4o-mini inference</span>
            </div>
            <input
              type="password"
              value={openaiApiKey}
              onChange={(e) => setOpenaiApiKey(e.target.value)}
              placeholder="sk-proj-..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 font-mono focus:border-emerald-500 transition-colors"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              If omitted, TerraAgent seamlessly uses its built-in heuristic agent simulation engine.
            </p>
          </div>

          {/* Supabase URL */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span>Supabase Project URL (Optional)</span>
              </label>
            </div>
            <input
              type="url"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              placeholder="https://xyz.supabase.co"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 font-mono focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Supabase Anon Key */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Supabase Anon Key (Optional)
            </label>
            <input
              type="password"
              value={supabaseAnonKey}
              onChange={(e) => setSupabaseAnonKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 font-mono focus:border-emerald-500 transition-colors"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              If omitted, applications and audit logs are safely stored in resilient browser LocalStorage.
            </p>
          </div>

          {/* Reset Demo Data */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleResetStorage}
              className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white text-xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Synthetic Demo Personas & Logs</span>
            </button>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-800 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/30 transition-all"
            >
              Save Configuration
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
