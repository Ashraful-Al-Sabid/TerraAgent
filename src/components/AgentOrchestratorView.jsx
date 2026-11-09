import React, { useState, useEffect, useRef } from 'react';
import { 
  FileSearch, 
  Fingerprint, 
  ShieldAlert, 
  FileCheck, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Loader2, 
  Terminal, 
  ChevronDown, 
  ChevronUp,
  FileText
} from 'lucide-react';
import { fetchAgentLogs } from '../lib/supabase';

export function AgentOrchestratorView({ 
  application, 
  currentProgress, 
  isRunning, 
  onViewDossier, 
  onOpenCorrection 
}) {
  const [logs, setLogs] = useState([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const terminalEndRef = useRef(null);

  // Poll or load logs for this application
  useEffect(() => {
    let interval;
    const loadLogs = async () => {
      if (application?.id) {
        const list = await fetchAgentLogs(application.id);
        setLogs(list);
      }
    };

    loadLogs();
    if (isRunning) {
      interval = setInterval(loadLogs, 800);
    }
    return () => clearInterval(interval);
  }, [application?.id, isRunning, currentProgress]);

  // Scroll to bottom of terminal when logs update
  useEffect(() => {
    if (terminalEndRef.current && isExpanded) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isExpanded]);

  if (!application) return null;

  const currentStep = currentProgress?.step || 'IDLE';
  const progressPct = currentProgress?.progress || (application.status === 'verified' || application.status === 'approved' ? 100 : application.status === 'processing' ? 50 : 0);

  // Agent statuses
  const getAgentStatus = (agentName) => {
    if (isRunning) {
      if (currentProgress?.agent === agentName) return 'active';
      if (currentStep === 'DONE') return 'completed';
      
      const order = ['intake', 'identity', 'background', 'dossier'];
      const currentIdx = order.indexOf(currentProgress?.agent || '');
      const agentIdx = order.indexOf(agentName);
      if (currentIdx > agentIdx) return 'completed';
      return 'pending';
    }

    if (application.status === 'verified' || application.status === 'approved') return 'completed';
    if (application.status === 'flagged_discrepancy' && agentName === 'identity') return 'warning';
    if (application.status === 'rejected' && agentName === 'background') return 'error';
    return 'completed';
  };

  const agents = [
    {
      id: 'intake',
      name: 'Intake Agent',
      bnName: 'ডকুমেন্ট প্রসেসিং',
      icon: FileSearch,
      status: getAgentStatus('intake'),
      description: 'OCR & metadata parsing from deeds and NID scans'
    },
    {
      id: 'identity',
      name: 'Identity Agent',
      bnName: 'পরিচয় ও বানান যাচাই',
      icon: Fingerprint,
      status: getAgentStatus('identity'),
      description: 'Bangla-English transliteration & synthetic NID/BRIS matching'
    },
    {
      id: 'background',
      name: 'Background Agent',
      bnName: 'রেকর্ড ও খতিয়ান নিরীক্ষা',
      icon: ShieldAlert,
      status: getAgentStatus('background'),
      description: 'DLRS ledger, court injunction, tax, & vested property audit'
    },
    {
      id: 'dossier',
      name: 'Dossier Agent',
      bnName: 'ডজিয়ার ও সমন্বিত প্রতিবেদন',
      icon: FileCheck,
      status: getAgentStatus('dossier'),
      description: 'Integrity scoring & officer decision checklist synthesis'
    }
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden backdrop-blur-sm">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <h2 className="text-lg font-semibold text-white tracking-tight">Autonomous AI Orchestrator</h2>
            <span className="px-2 py-0.5 rounded text-xs font-mono uppercase bg-slate-800 text-slate-300 border border-slate-700">
              {application.application_number}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Coordinating 4 specialized verification agents with real-time audit ledger
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {application.status === 'flagged_discrepancy' && (
            <button
              onClick={onOpenCorrection}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-colors animate-pulse"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Review & Correct Discrepancies</span>
            </button>
          )}

          <button
            onClick={onViewDossier}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span>View Dossier Report</span>
          </button>
        </div>
      </div>

      {/* Pipeline Progress Bar */}
      <div className="mt-6">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="font-medium text-slate-300 flex items-center space-x-2">
            {isRunning && <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />}
            <span>{currentProgress?.message || 'Orchestration pipeline idle.'}</span>
          </span>
          <span className="font-mono text-emerald-400">{progressPct}%</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* 4 Agent Status Nodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        {agents.map((agent) => {
          const Icon = agent.icon;
          return (
            <div 
              key={agent.id}
              className={`p-4 rounded-xl border transition-all ${
                agent.status === 'active'
                  ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/30 animate-agent-active'
                  : agent.status === 'completed'
                  ? 'bg-slate-900 border-slate-800 text-slate-300'
                  : agent.status === 'warning'
                  ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                  : agent.status === 'error'
                  ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                  : 'bg-slate-950/60 border-slate-900 text-slate-500 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className={`p-2 rounded-lg ${
                  agent.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                  agent.status === 'completed' ? 'bg-slate-800 text-emerald-400' :
                  agent.status === 'warning' ? 'bg-amber-500/20 text-amber-400' :
                  agent.status === 'error' ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-slate-500'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>

                {agent.status === 'active' && <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />}
                {agent.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                {agent.status === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                {agent.status === 'error' && <XCircle className="w-4 h-4 text-rose-400" />}
              </div>

              <div className="mt-3">
                <h4 className="text-sm font-semibold text-white tracking-tight">{agent.name}</h4>
                <p className="text-[11px] font-bangla text-slate-400">{agent.bnName}</p>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">{agent.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Collapsible Execution Terminal & Audit Trail */}
      <div className="mt-6 border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-4 py-2.5 bg-slate-900/90 flex items-center justify-between text-xs font-mono text-slate-300 hover:bg-slate-850 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-white">Live Agent Thought Stream & Audit Ledger</span>
            <span className="text-slate-500">({logs.length} events logged)</span>
          </div>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {isExpanded && (
          <div className="p-4 max-h-56 overflow-y-auto font-mono text-xs space-y-2 bg-slate-950/90">
            {logs.length === 0 ? (
              <p className="text-slate-500 italic">No execution events recorded yet. Click "Verify with Multi-Agent AI" to initiate workflow.</p>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="flex items-start space-x-2 leading-relaxed">
                  <span className="text-slate-500 shrink-0 select-none">
                    {new Date(log.timestamp || log.created_at).toLocaleTimeString()}
                  </span>
                  <span className={`px-1.5 py-0.2 rounded text-[10px] uppercase font-bold shrink-0 ${
                    log.agent_name === 'intake' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' :
                    log.agent_name === 'identity' ? 'bg-purple-950 text-purple-300 border border-purple-800' :
                    log.agent_name === 'background' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                    log.agent_name === 'dossier' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                    'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}>
                    {log.agent_name}
                  </span>
                  <span className={`${
                    log.log_level === 'error' ? 'text-rose-400 font-semibold' :
                    log.log_level === 'warning' ? 'text-amber-300' :
                    log.log_level === 'success' ? 'text-emerald-400 font-medium' :
                    'text-slate-300'
                  }`}>
                    {log.message}
                  </span>
                </div>
              ))
            )}
            <div ref={terminalEndRef} />
          </div>
        )}
      </div>

    </div>
  );
}
