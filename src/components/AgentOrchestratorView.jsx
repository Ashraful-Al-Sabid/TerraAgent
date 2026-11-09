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
  FileText,
  Activity,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { fetchAgentLogs } from '../lib/supabase.js';

export function AgentOrchestratorView({ 
  application, 
  currentProgress, 
  isRunning, 
  onViewDossier, 
  onOpenCorrection 
}) {
  const [logs, setLogs] = useState([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const terminalEndRef = useRef(null);

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
      interval = setInterval(loadLogs, 700);
    }
    return () => clearInterval(interval);
  }, [application?.id, isRunning, currentProgress]);

  useEffect(() => {
    if (terminalEndRef.current && isExpanded) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isExpanded]);

  if (!application) return null;

  const currentStep = currentProgress?.step || 'IDLE';
  const progressPct = currentProgress?.progress || (
    application.status === 'verified' || application.status === 'approved' ? 100 : 
    application.status === 'processing' ? 50 : 0
  );

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
      bnName: 'ডকুমেন্ট ও ওভিআর বিশ্লেষণ',
      tag: 'OCR ENGINE',
      icon: FileSearch,
      status: getAgentStatus('intake'),
      description: 'Document extraction, metadata parsing, & tamper check'
    },
    {
      id: 'identity',
      name: 'Identity Agent',
      bnName: 'দ্বিভাষিক নাম ও এনআইডি',
      tag: 'PHONETIC CROSS-MATCH',
      icon: Fingerprint,
      status: getAgentStatus('identity'),
      description: 'Bangla-English transliteration & synthetic NID/BRIS comparison'
    },
    {
      id: 'background',
      name: 'Background Agent',
      bnName: 'খতিয়ান ও স্বত্ব নিরীক্ষা',
      tag: 'DLRS LEDGER AUDIT',
      icon: ShieldAlert,
      status: getAgentStatus('background'),
      description: 'DLRS ownership chain, court stay orders, & tax status'
    },
    {
      id: 'dossier',
      name: 'Dossier Agent',
      bnName: 'সমন্বিত ডজিয়ার প্রতিবেদন',
      tag: 'EXECUTIVE SYNTHESIS',
      icon: FileCheck,
      status: getAgentStatus('dossier'),
      description: 'Integrity scoring & officer decision checklist formulation'
    }
  ];

  const filteredLogs = logs.filter(log => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'WARNINGS') return log.log_level === 'warning' || log.log_level === 'error';
    return log.agent_name?.toLowerCase() === activeFilter.toLowerCase();
  });

  return (
    <div className="bg-[#0c1220] border border-white/[0.08] rounded-2xl p-6 shadow-gov-card relative overflow-hidden backdrop-blur-xl">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center space-x-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isRunning ? 'bg-emerald-400' : 'bg-slate-400'
              }`} />
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                isRunning ? 'bg-emerald-500' : 'bg-slate-400'
              }`} />
            </span>
            <h2 className="text-sm font-semibold tracking-wide uppercase text-white font-mono">
              Autonomous Verification Core • Workflow Dispatcher
            </h2>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono text-slate-300 bg-white/[0.05] border border-white/[0.08]">
              {application.application_number}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Coordinated pipeline processing evidence across 4 autonomous agents
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {application.status === 'flagged_discrepancy' && (
            <button
              onClick={onOpenCorrection}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-all shadow-sm"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Review Discrepancies</span>
            </button>
          )}

          <button
            onClick={onViewDossier}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-950/70 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900/80 transition-all shadow-sm"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span>Inspection Dossier</span>
          </button>
        </div>
      </div>

      {/* Pipeline Progress Status */}
      <div className="mt-5">
        <div className="flex items-center justify-between text-xs mb-2 font-mono">
          <span className="text-slate-300 flex items-center space-x-2">
            {isRunning ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
            ) : (
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <span className="font-sans font-medium text-slate-200">{currentProgress?.message || 'Pipeline standby.'}</span>
          </span>
          <span className="text-emerald-400 font-bold">{progressPct}%</span>
        </div>
        <div className="w-full bg-[#131b30] rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* 4 Agent Pipeline Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-6">
        {agents.map((agent, idx) => {
          const Icon = agent.icon;
          return (
            <div 
              key={agent.id}
              className={`p-4 rounded-xl border transition-all duration-200 relative overflow-hidden ${
                agent.status === 'active'
                  ? 'bg-emerald-950/30 border-emerald-500/50 shadow-gov-glow ring-1 ring-emerald-500/20'
                  : agent.status === 'completed'
                  ? 'bg-[#10192e] border-white/[0.08] text-slate-200'
                  : agent.status === 'warning'
                  ? 'bg-amber-950/20 border-amber-500/40 text-amber-200'
                  : agent.status === 'error'
                  ? 'bg-rose-950/20 border-rose-500/40 text-rose-200'
                  : 'bg-[#0a0f1d] border-white/[0.04] text-slate-500 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${
                  agent.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                  agent.status === 'completed' ? 'bg-white/[0.05] text-emerald-400' :
                  agent.status === 'warning' ? 'bg-amber-500/20 text-amber-400' :
                  agent.status === 'error' ? 'bg-rose-500/20 text-rose-400' : 'bg-white/[0.03] text-slate-500'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] font-mono text-slate-400 tracking-wider uppercase">{agent.tag}</span>
                  {agent.status === 'active' && <Loader2 className="w-3.5 h-3.5 text-emerald-400 animate-spin" />}
                  {agent.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  {agent.status === 'warning' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                  {agent.status === 'error' && <XCircle className="w-3.5 h-3.5 text-rose-400" />}
                </div>
              </div>

              <div className="mt-3.5">
                <div className="flex items-baseline space-x-2">
                  <h4 className="text-xs font-bold text-white tracking-tight">{agent.name}</h4>
                  <span className="text-[10px] font-bangla text-slate-400">{agent.bnName}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">{agent.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Execution Terminal & Audit Ledger */}
      <div className="mt-6 border border-white/[0.08] rounded-xl overflow-hidden bg-[#070b16]">
        
        {/* Terminal Header Bar */}
        <div className="px-4 py-2.5 bg-[#0e1628] border-b border-white/[0.06] flex items-center justify-between text-xs font-mono">
          <div className="flex items-center space-x-2">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold text-slate-200">Cryptographic Verification & Multi-Agent Telemetry</span>
            <span className="text-slate-500 text-[11px]">({logs.length} events logged)</span>
          </div>

          <div className="flex items-center space-x-2">
            <div className="hidden sm:flex items-center space-x-1 bg-black/40 p-0.5 rounded-lg border border-white/[0.04] text-[10px]">
              {['ALL', 'WARNINGS', 'INTAKE', 'IDENTITY', 'BACKGROUND', 'DOSSIER'].map((flt) => (
                <button
                  key={flt}
                  onClick={() => setActiveFilter(flt)}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    activeFilter === flt ? 'bg-emerald-950 text-emerald-300 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {flt}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded text-slate-400 hover:text-white"
            >
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Streaming Logs */}
        {isExpanded && (
          <div className="p-4 max-h-52 overflow-y-auto font-mono text-[11px] space-y-1.5 bg-[#070b16]/95">
            {filteredLogs.length === 0 ? (
              <p className="text-slate-500 italic">No telemetry recorded for this filter. Initiate verification to stream events.</p>
            ) : (
              filteredLogs.map((log) => (
                <div key={log.id} className="flex items-start space-x-2.5 leading-relaxed hover:bg-white/[0.02] p-1 rounded">
                  <span className="text-slate-500 shrink-0 select-none text-[10px]">
                    {new Date(log.timestamp || log.created_at).toLocaleTimeString()}
                  </span>
                  <span className={`px-1.5 py-0.2 rounded text-[9px] uppercase font-bold shrink-0 border ${
                    log.agent_name === 'intake' ? 'bg-cyan-950/60 text-cyan-300 border-cyan-800/60' :
                    log.agent_name === 'identity' ? 'bg-purple-950/60 text-purple-300 border-purple-800/60' :
                    log.agent_name === 'background' ? 'bg-amber-950/60 text-amber-300 border-amber-800/60' :
                    log.agent_name === 'dossier' ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60' :
                    'bg-slate-900 text-slate-300 border-slate-700'
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
