import React, { useState, useEffect } from 'react';
import { 
  FileCheck2, 
  Search, 
  Filter, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Eye, 
  Award, 
  Clock, 
  FileText, 
  ShieldCheck, 
  User, 
  Building,
  Check,
  Send,
  HelpCircle,
  Gavel,
  Landmark,
  Scale
} from 'lucide-react';
import { fetchApplications, saveApplicationRecord, saveOfficerAction } from '../lib/supabase.js';

export function OfficerDashboard({ onViewDossier }) {
  const [applications, setApplications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedApp, setSelectedApp] = useState(null);
  const [officerNote, setOfficerNote] = useState('');
  const [actionNotice, setActionNotice] = useState('');

  const loadApps = async () => {
    const list = await fetchApplications();
    setApplications(list);
  };

  useEffect(() => {
    loadApps();
    const interval = setInterval(loadApps, 3000);
    return () => clearInterval(interval);
  }, []);

  const filteredApps = applications.filter((app) => {
    const matchesSearch = 
      (app.applicant_name_en || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.applicant_name_bn || '').includes(searchQuery) ||
      (app.application_number || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.nid_number || '').includes(searchQuery);

    if (!matchesSearch) return false;
    if (filterStatus === 'ALL') return true;
    return app.status?.toLowerCase() === filterStatus.toLowerCase();
  });

  const totalCount = applications.length;
  const verifiedCount = applications.filter(a => a.status === 'verified' || a.status === 'approved').length;
  const flaggedCount = applications.filter(a => a.status === 'flagged_discrepancy').length;
  const highRiskCount = applications.filter(a => a.risk_level === 'critical' || a.risk_level === 'high' || a.status === 'rejected').length;

  const handleOfficerDecision = async (actionType) => {
    if (!selectedApp) return;

    let newStatus = selectedApp.status;
    let label = '';

    if (actionType === 'approved') {
      newStatus = 'approved';
      label = 'Formal Mutation Order Approved: Directing Upazila Land Office to record new Khatian';
    } else if (actionType === 'clarification') {
      newStatus = 'flagged_discrepancy';
      label = 'Official Clarification Notice issued to citizen regarding records';
    } else if (actionType === 'hearing') {
      newStatus = 'flagged_discrepancy';
      label = 'Notice issued: Appearance scheduled at Assistant Commissioner (Land) Court';
    } else if (actionType === 'rejected') {
      newStatus = 'rejected';
      label = 'Application Rejected pursuant to Land Administration & Registration Regulations';
    }

    const updatedApp = {
      ...selectedApp,
      status: newStatus
    };

    await saveApplicationRecord(updatedApp);
    await saveOfficerAction({
      application_id: selectedApp.id,
      officer_name: 'Kazi Nazmul Huda (Senior AC Land)',
      officer_designation: 'Assistant Commissioner (Land), Dhaka Circle',
      action: actionType,
      comments: officerNote || label
    });

    setActionNotice(label);
    setSelectedApp(updatedApp);
    setOfficerNote('');
    loadApps();

    setTimeout(() => setActionNotice(''), 5000);
  };

  return (
    <div className="space-y-8">
      
      {/* Officer Docket Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs mb-1 uppercase tracking-wider">
            <Scale className="w-4 h-4" />
            <span>Assistant Commissioner of Land (AC Land) Judicial & Administrative Desk</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Case Review & Adjudication Docket</h1>
          <p className="text-xs text-slate-400 font-bangla mt-0.5">
            সহকারী কমিশনার (ভূমি) ও কানুনগো ড্যাশবোর্ড - এআই এজেন্টের নিরীক্ষা ও অনুমোদন ব্যবস্থাপনা
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3.5 py-1.5 rounded-xl bg-[#0c1220] border border-white/[0.08] text-slate-300 text-xs font-mono shadow-sm">
            Jurisdiction: Dhaka Circle • AC Land Bench
          </span>
        </div>
      </div>

      {/* KPI Metric Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0c1220] border border-white/[0.08] shadow-gov-card">
          <span className="text-[11px] font-semibold text-slate-400 font-mono uppercase tracking-wider">Total Docket</span>
          <p className="text-2xl font-bold font-mono text-white mt-1">{totalCount}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Digitized applications logged</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0c1220] border border-white/[0.08] shadow-gov-card">
          <span className="text-[11px] font-semibold text-slate-400 font-mono uppercase tracking-wider">Policy Engine Cleared</span>
          <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">{verifiedCount}</p>
          <span className="text-[11px] text-emerald-500/80 mt-1 block">High integrity (90%+) rating</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0c1220] border border-white/[0.08] shadow-gov-card">
          <span className="text-[11px] font-semibold text-slate-400 font-mono uppercase tracking-wider">Notice Pending</span>
          <p className="text-2xl font-bold font-mono text-amber-400 mt-1">{flaggedCount}</p>
          <span className="text-[11px] text-amber-500/80 mt-1 block">Spelling or document review</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0c1220] border border-white/[0.08] shadow-gov-card">
          <span className="text-[11px] font-semibold text-slate-400 font-mono uppercase tracking-wider">Title Clouds / Disputes</span>
          <p className="text-2xl font-bold font-mono text-rose-400 mt-1">{highRiskCount}</p>
          <span className="text-[11px] text-rose-500/80 mt-1 block">Stay order or state property</span>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-[#0c1220] border border-white/[0.08] rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-gov-card">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by applicant, NID, or App ID..."
            className="w-full bg-[#070a12] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 transition-colors font-sans"
          />
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center space-x-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['ALL', 'VERIFIED', 'FLAGGED_DISCREPANCY', 'APPROVED', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors shrink-0 ${
                filterStatus === st
                  ? 'bg-emerald-600/90 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              }`}
            >
              {st === 'FLAGGED_DISCREPANCY' ? 'Discrepant' : st}
            </button>
          ))}
        </div>

      </div>

      {/* Applications Data Table */}
      <div className="bg-[#0c1220] border border-white/[0.08] rounded-2xl overflow-hidden shadow-gov-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#080d18] text-slate-400 border-b border-white/[0.06] font-mono text-[10px] uppercase tracking-wider">
              <tr>
                <th className="p-4">Docket ID</th>
                <th className="p-4">Applicant Record</th>
                <th className="p-4">Cadastral Schedule</th>
                <th className="p-4">Integrity</th>
                <th className="p-4">Risk Level</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Adjudication</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] font-sans">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 italic">
                    No cases match the active filter criteria.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-white/[0.02] transition-colors">
                    
                    {/* Docket ID */}
                    <td className="p-4 font-mono font-medium text-slate-300">
                      {app.application_number}
                    </td>

                    {/* Applicant */}
                    <td className="p-4">
                      <div className="font-semibold text-white">{app.applicant_name_en}</div>
                      <div className="text-[11px] text-slate-400 font-bangla">{app.applicant_name_bn}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">NID: {app.nid_number}</div>
                    </td>

                    {/* Cadastral Schedule */}
                    <td className="p-4 text-slate-300">
                      <div>Plot {app.plot_number} • Khatian {app.khatian_number}</div>
                      <div className="text-[11px] text-slate-500">{app.mouza}, {app.upazila}</div>
                    </td>

                    {/* Integrity Score */}
                    <td className="p-4 font-mono">
                      <span className={`font-bold ${
                        app.integrity_score >= 80 ? 'text-emerald-400' :
                        app.integrity_score >= 50 ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        {app.integrity_score || 0}%
                      </span>
                    </td>

                    {/* Risk Tag */}
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider ${
                        app.risk_level === 'low' ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800' :
                        app.risk_level === 'medium' ? 'bg-amber-950/60 text-amber-300 border border-amber-800' :
                        'bg-rose-950/60 text-rose-300 border border-rose-800'
                      }`}>
                        {app.risk_level || 'low'}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider inline-flex items-center space-x-1 ${
                        app.status === 'approved' ? 'bg-emerald-900/30 text-emerald-300 border border-emerald-700/60' :
                        app.status === 'verified' ? 'bg-cyan-900/30 text-cyan-300 border border-cyan-700/60' :
                        app.status === 'flagged_discrepancy' ? 'bg-amber-900/30 text-amber-300 border border-amber-700/60' :
                        app.status === 'rejected' ? 'bg-rose-900/30 text-rose-300 border border-rose-700/60' :
                        'bg-slate-800/60 text-slate-300 border border-slate-700'
                      }`}>
                        <span>{app.status ? app.status.replace('_', ' ') : 'pending'}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right space-x-2 font-mono">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#101728] hover:bg-[#162138] text-slate-200 border border-white/[0.08] transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Inspect</span>
                      </button>

                      <button
                        onClick={() => onViewDossier(app)}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800/60 transition-colors"
                        title="View Official Dossier"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Dossier</span>
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Case Inspector Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0c1220] border border-white/[0.08] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-gov-raised p-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center space-x-2">
                <Landmark className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base">
                  AC Land Case Inspector • {selectedApp.application_number}
                </h3>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {actionNotice && (
              <div className="mt-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs">
                {actionNotice}
              </div>
            )}

            {/* Quick Details */}
            <div className="mt-4 p-4 rounded-xl bg-[#070a12] border border-white/[0.06] grid grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <span className="text-slate-500 block font-sans">Applicant:</span>
                <span className="font-semibold text-white font-sans">{selectedApp.applicant_name_en}</span>
                <span className="text-slate-400 block font-bangla">{selectedApp.applicant_name_bn}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-sans">NID & DOB:</span>
                <span className="text-slate-200">{selectedApp.nid_number}</span>
                <span className="text-slate-400 block">{selectedApp.dob}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-sans">Cadastral Plot & Khatian:</span>
                <span className="text-slate-200">Plot {selectedApp.plot_number}, Khatian {selectedApp.khatian_number}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-sans">Location:</span>
                <span className="text-slate-200 font-sans">{selectedApp.mouza}, {selectedApp.upazila}, {selectedApp.district}</span>
              </div>
            </div>

            {/* Decision Controls */}
            <div className="mt-6">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 font-mono">
                Administrative Adjudication Action:
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => handleOfficerDecision('approved')}
                  className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex flex-col items-center justify-center space-y-1 transition-all shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>Approve (অনুমোদন)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOfficerDecision('clarification')}
                  className="p-3 rounded-xl bg-amber-600/80 hover:bg-amber-600 text-white text-xs font-semibold flex flex-col items-center justify-center space-y-1 transition-all shadow-sm"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Notice (নোটিশ)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOfficerDecision('hearing')}
                  className="p-3 rounded-xl bg-purple-600/80 hover:bg-purple-600 text-white text-xs font-semibold flex flex-col items-center justify-center space-y-1 transition-all shadow-sm"
                >
                  <Gavel className="w-4 h-4" />
                  <span>Hearing (শুনানি)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOfficerDecision('rejected')}
                  className="p-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex flex-col items-center justify-center space-y-1 transition-all shadow-sm"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject (বাতিল)</span>
                </button>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1 font-sans">
                  Official AC Land Bench Order Remarks:
                </label>
                <textarea
                  rows={2}
                  value={officerNote}
                  onChange={(e) => setOfficerNote(e.target.value)}
                  placeholder="Record formal administrative order, Kanungo direction, or decree reference..."
                  className="w-full bg-[#070a12] border border-white/[0.08] rounded-xl p-2.5 text-xs text-white placeholder-slate-600 focus:border-emerald-500 transition-colors font-sans"
                />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.08] flex justify-end">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-medium text-slate-200 transition-colors"
              >
                Close Case
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
