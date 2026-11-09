// ==============================================================================
// TerraAgent Supabase Client & Resilient Data Layer
// Connects to Supabase Cloud or seamlessly falls back to persistent local storage
// ==============================================================================

import { createClient } from '@supabase/supabase-js';
import { PRESET_APPLICATIONS } from '../data/presetApplications.js';

// Storage keys
const STORAGE_APPS = 'terra_applications';
const STORAGE_LOGS = 'terra_agent_logs';
const STORAGE_REPORTS = 'terra_dossier_reports';
const STORAGE_REVIEWS = 'terra_officer_reviews';
const STORAGE_SETTINGS = 'terra_system_settings';

// Safe storage accessor
const safeStorage = {
  getItem: (key) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
        return globalThis.localStorage.getItem(key);
      }
    } catch (e) {}
    return null;
  },
  setItem: (key, val) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, val);
      } else if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
        globalThis.localStorage.setItem(key, val);
      }
    } catch (e) {}
  },
  removeItem: (key) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      } else if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
        globalThis.localStorage.removeItem(key);
      }
    } catch (e) {}
  }
};

// Helper to get system settings (credentials)
export function getSystemSettings() {
  try {
    const raw = safeStorage.getItem(STORAGE_SETTINGS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to parse system settings', e);
  }
  return {
    supabaseUrl: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || '',
    supabaseAnonKey: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || '',
    openaiApiKey: (typeof import.meta !== 'undefined' && import.meta.env?.OPENAI_API_KEY) || ''
  };
}

export function saveSystemSettings(settings) {
  safeStorage.setItem(STORAGE_SETTINGS, JSON.stringify(settings));
}

// Initialize Supabase instance dynamically
export function getSupabase() {
  const settings = getSystemSettings();
  if (settings.supabaseUrl && settings.supabaseAnonKey && settings.supabaseUrl.startsWith('http')) {
    try {
      return createClient(settings.supabaseUrl, settings.supabaseAnonKey);
    } catch (err) {
      console.warn('Supabase client initialization error, falling back to local storage:', err);
      return null;
    }
  }
  return null;
}

// Initialize Local Store with Presets if empty or upgrade legacy names
function initLocalStore() {
  const existing = safeStorage.getItem(STORAGE_APPS);
  const needsSeed = !existing || existing.includes('Sabid') || existing.includes('Ashraful');

  if (needsSeed) {
    const seeded = PRESET_APPLICATIONS.map((preset, idx) => ({
      id: preset.id,
      application_number: `TERRA-2026-${1000 + idx}`,
      ...preset.data,
      status: idx === 0 ? 'verified' : idx === 1 ? 'flagged_discrepancy' : idx === 2 ? 'processing' : 'rejected',
      risk_level: idx === 0 ? 'low' : idx === 1 ? 'medium' : idx === 2 ? 'high' : 'critical',
      integrity_score: idx === 0 ? 96 : idx === 1 ? 72 : idx === 2 ? 34 : 12,
      created_at: new Date(Date.now() - (idx * 3600000 * 24)).toISOString(),
      updated_at: new Date().toISOString()
    }));
    safeStorage.setItem(STORAGE_APPS, JSON.stringify(seeded));
  }
  if (!safeStorage.getItem(STORAGE_LOGS)) {
    safeStorage.setItem(STORAGE_LOGS, JSON.stringify([]));
  }
  if (!safeStorage.getItem(STORAGE_REPORTS)) {
    safeStorage.setItem(STORAGE_REPORTS, JSON.stringify([]));
  }
  if (!safeStorage.getItem(STORAGE_REVIEWS)) {
    safeStorage.setItem(STORAGE_REVIEWS, JSON.stringify([]));
  }
}

// Run initializer
initLocalStore();

// ==============================================================================
// High-Level Data Access Functions (Supabase + Local Fallback)
// ==============================================================================

export async function fetchApplications() {
  const client = getSupabase();
  if (client) {
    try {
      const { data, error } = await client
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data;
    } catch (e) {
      console.warn('Supabase fetch error, using local fallback:', e);
    }
  }

  // Local fallback
  try {
    const stored = safeStorage.getItem(STORAGE_APPS);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
}

export async function fetchApplicationById(id) {
  const client = getSupabase();
  if (client) {
    try {
      const { data, error } = await client
        .from('applications')
        .select('*')
        .eq('id', id)
        .single();
      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase fetch by ID error:', e);
    }
  }

  const stored = safeStorage.getItem(STORAGE_APPS);
  const list = stored ? JSON.parse(stored) : [];
  return list.find(app => app.id === id) || null;
}

export async function saveApplicationRecord(app) {
  const client = getSupabase();
  const newApp = {
    ...app,
    id: app.id || `app-${Date.now()}`,
    application_number: app.application_number || `TERRA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    created_at: app.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  if (client) {
    try {
      const { error } = await client.from('applications').upsert(newApp);
      if (error) console.warn('Supabase upsert failed, mirroring to local:', error);
    } catch (e) {
      console.warn('Supabase save error:', e);
    }
  }

  // Always mirror in localStorage for instant responsiveness
  try {
    const stored = safeStorage.getItem(STORAGE_APPS);
    let list = stored ? JSON.parse(stored) : [];
    const index = list.findIndex(a => a.id === newApp.id);
    if (index >= 0) {
      list[index] = newApp;
    } else {
      list.unshift(newApp);
    }
    safeStorage.setItem(STORAGE_APPS, JSON.stringify(list));
  } catch (e) {
    console.error('Local save failed:', e);
  }

  return newApp;
}

export async function logAgentActivity(applicationId, agentName, phase, logLevel, message, details = {}) {
  const logEntry = {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    application_id: applicationId,
    agent_name: agentName,
    phase: phase,
    log_level: logLevel, // info, warning, error, success
    message: message,
    details: details,
    timestamp: new Date().toISOString()
  };

  const client = getSupabase();
  if (client) {
    try {
      await client.from('agent_logs').insert(logEntry);
    } catch (e) {
      // ignore
    }
  }

  // Save to local store
  try {
    const stored = safeStorage.getItem(STORAGE_LOGS);
    let list = stored ? JSON.parse(stored) : [];
    list.unshift(logEntry);
    safeStorage.setItem(STORAGE_LOGS, JSON.stringify(list.slice(0, 500))); // keep latest 500
  } catch (e) {
    console.error('Log save error:', e);
  }

  return logEntry;
}

export async function fetchAgentLogs(applicationId) {
  const client = getSupabase();
  if (client) {
    try {
      const { data, error } = await client
        .from('agent_logs')
        .select('*')
        .eq('application_id', applicationId)
        .order('created_at', { ascending: true });
      if (!error && data && data.length > 0) return data;
    } catch (e) {
      // ignore
    }
  }

  try {
    const stored = safeStorage.getItem(STORAGE_LOGS);
    const list = stored ? JSON.parse(stored) : [];
    return list
      .filter(l => l.application_id === applicationId)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  } catch (e) {
    return [];
  }
}

export async function saveDossier(report) {
  const client = getSupabase();
  const entry = {
    ...report,
    id: report.id || `dos-${Date.now()}`,
    generated_at: new Date().toISOString()
  };

  if (client) {
    try {
      await client.from('dossier_reports').upsert(entry);
    } catch (e) {
      // ignore
    }
  }

  try {
    const stored = safeStorage.getItem(STORAGE_REPORTS);
    let list = stored ? JSON.parse(stored) : [];
    const idx = list.findIndex(r => r.application_id === report.application_id);
    if (idx >= 0) list[idx] = entry;
    else list.unshift(entry);
    safeStorage.setItem(STORAGE_REPORTS, JSON.stringify(list));
  } catch (e) {
    console.error('Report save error:', e);
  }

  return entry;
}

export async function fetchDossierByAppId(applicationId) {
  const client = getSupabase();
  if (client) {
    try {
      const { data, error } = await client
        .from('dossier_reports')
        .select('*')
        .eq('application_id', applicationId)
        .maybeSingle();
      if (!error && data) return data;
    } catch (e) {
      // ignore
    }
  }

  try {
    const stored = safeStorage.getItem(STORAGE_REPORTS);
    const list = stored ? JSON.parse(stored) : [];
    return list.find(r => r.application_id === applicationId) || null;
  } catch (e) {
    return null;
  }
}

export async function saveOfficerAction(review) {
  const client = getSupabase();
  const entry = {
    ...review,
    id: `rev-${Date.now()}`,
    reviewed_at: new Date().toISOString()
  };

  if (client) {
    try {
      await client.from('officer_reviews').insert(entry);
    } catch (e) {
      // ignore
    }
  }

  try {
    const stored = safeStorage.getItem(STORAGE_REVIEWS);
    let list = stored ? JSON.parse(stored) : [];
    list.unshift(entry);
    safeStorage.setItem(STORAGE_REVIEWS, JSON.stringify(list));
  } catch (e) {
    console.error('Review save error:', e);
  }

  return entry;
}
