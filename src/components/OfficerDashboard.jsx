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
  Gavel
} from 'lucide-react';
import { fetchApplications, saveApplicationRecord, saveOfficerAction } from '../lib/supabase';

export function OfficerDashboard({ onViewDossier }) {
  const [applications, setApplications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedApp, setSelectedApp] = useState(null);
  const [officerNote, setOfficerNote] = useState('');
  const [actionNotice, setActionNotice] = useState('');

  // Refresh applications
  const loadApps = async () => {
    const list = await fetchApplications();
    setApplications(list);
  };

  useEffect(() => {
    loadApps();
    const interval = setInterval(loadApps, 3000);
    return () => clearInterval(interval);
  }, []);

  // Filter applications
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

  // Calculate metrics
  const totalCount = applications.length;
  const verifiedCount = applications.filter(a => a.status === 'verified' || a.status === 'approved').length;
  const flaggedCount = applications.filter(a => a.status === 'flagged_discrepancy').length;
  const highRiskCount = applications.filter(a => a.risk_level === 'critical' || a.risk_level === 'high' || a.status === 'rejected').length;

  // Officer Action Handler
  const handleOfficerDecision = async (actionType) => {
    if (!selectedApp) return;

    let newStatus = selectedApp.status;
    let label = '';

    if (actionType === 'approved') {
      newStatus = 'approved';
      label = 'Application Approved for Digital Mutation (খতিয়ান সৃজনের নির্দেশ প্রদান করা হলো)';
    } else if (actionType === 'clarification') {
      newStatus = 'flagged_discrepancy';
      label = 'Clarification requested from citizen regarding records';
    } else if (actionType === 'hearing') {
      newStatus = 'flagged_discrepancy';
      label = 'Scheduled for Assistant Commissioner (Land) Physical Hearing';
    } else if (actionType === 'rejected') {
      newStatus = 'rejected';
      label = 'Application Formally Rejected under Land Administration Act';
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
      
      {/* Officer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-xs mb-1">
            <Building className="w-4 h-4" />
            <span>Assistant Commissioner of Land (AC Land) Administrative Portal</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Officer Inspection & Review Dashboard</h1>
          <p className="text-xs text-slate-400 font-bangla mt-0.5">
            সহকারী কমিশনার (ভূমি) ও কানুনগো ড্যাশবোর্ড - এআই এজেন্টের নিরীক্ষা ও অনুমোদন ব্যবস্থাপনা
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono">
            Active Office: Dhaka Circle • AC Land Desk
          </span>
        </div>
      </div>

      {/* Metric Cards Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-medium text-slate-400">Total Caseload</span>
          <p className="text-2xl font-bold font-mono text-white mt-1">{totalCount}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Live digitized applications</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-medium text-slate-400">Clear & Auto-Verified</span>
          <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">{verifiedCount}</p>
          <span className="text-[11px] text-emerald-500/80 mt-1 block">90%+ AI Integrity Score</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-medium text-slate-400">Discrepancies Flagged</span>
          <p className="text-2xl font-bold font-mono text-amber-400 mt-1">{flaggedCount}</p>
          <span className="text-[11px] text-amber-500/80 mt-1 block">Spelling / Document issues</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-medium text-slate-400">High Risk / Disputes</span>
          <p className="text-2xl font-bold font-mono text-rose-400 mt-1">{highRiskCount}</p>
          <span className="text-[11px] text-rose-500/80 mt-1 block">Litigation / Vested property</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, NID, or App ID..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center space-x-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['ALL', 'VERIFIED', 'FLAGGED_DISCREPANCY', 'APPROVED', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                filterStatus === st
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {st === 'FLAGGED_DISCREPANCY' ? 'Discrepant' : st}
            </button>
          ))}
        </div>

      </div>

      {/* Applications Data Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-mono text-[11px]">
              <tr>
                <th className="p-4">App ID</th>
                <th className="p-4">Applicant</th>
                <th className="p-4">Parcel / Schedule</th>
                <th className="p-4">Integrity</th>
                <th className="p-4">Risk</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-sans">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 italic">
                    No applications matching current search criteria.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-850/50 transition-colors">
                    
                    {/* App ID */}
                    <td className="p-4 font-mono font-medium text-slate-300">
                      {app.application_number}
                    </td>

                    {/* Applicant */}
                    <td className="p-4">
                      <div className="font-semibold text-white">{app.applicant_name_en}</div>
                      <div className="text-[11px] text-slate-400 font-bangla">{app.applicant_name_bn}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">NID: {app.nid_number}</div>
                    </td>

                    {/* Parcel */}
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
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        app.risk_level === 'low' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                        app.risk_level === 'medium' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                        'bg-rose-950 text-rose-300 border border-rose-800'
                      }`}>
                        {app.risk_level || 'low'}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider inline-flex items-center space-x-1 ${
                        app.status === 'approved' ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-700/60' :
                        app.status === 'verified' ? 'bg-cyan-900/40 text-cyan-300 border border-cyan-700/60' :
                        app.status === 'flagged_discrepancy' ? 'bg-amber-900/40 text-amber-300 border border-amber-700/60' :
                        app.status === 'rejected' ? 'bg-rose-900/40 text-rose-300 border border-rose-700/60' :
                        'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}>
                        <span>{app.status ? app.status.replace('_', ' ') : 'pending'}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Inspect</span>
                      </button>

                      <button
                        onClick={() => onViewDossier(app)}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 transition-colors"
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

      {/* Case Inspection Modal / Drawer */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base">
                  Officer Inspection: {selectedApp.application_number}
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
              <div className="mt-4 p-3 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-200 text-xs">
                {actionNotice}
              </div>
            )}

            {/* Quick Details */}
            <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">Applicant:</span>
                <span className="font-semibold text-white">{selectedApp.applicant_name_en}</span>
                <span className="text-slate-400 block font-bangla">{selectedApp.applicant_name_bn}</span>
              </div>
              <div>
                <span className="text-slate-500 block">NID & DOB:</span>
                <span className="font-mono text-slate-200">{selectedApp.nid_number}</span>
                <span className="text-slate-400 block font-mono">{selectedApp.dob}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Plot & Khatian:</span>
                <span className="text-slate-200">Plot {selectedApp.plot_number}, Khatian {selectedApp.khatian_number}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Location:</span>
                <span className="text-slate-200">{selectedApp.mouza}, {selectedApp.upazila}, {selectedApp.district}</span>
              </div>
            </div>

            {/* Officer Action Buttons */}
            <div className="mt-6">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                AC Land Official Decision Action:
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => handleOfficerDecision('approved')}
                  className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex flex-col items-center justify-center space-y-1 transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Approve (অনুমোদন)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOfficerDecision('clarification')}
                  className="p-2.5 rounded-xl bg-amber-600/80 hover:bg-amber-600 text-white text-xs font-semibold flex flex-col items-center justify-center space-y-1 transition-all"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Clarify (নোটিশ)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOfficerDecision('hearing')}
                  className="p-2.5 rounded-xl bg-purple-600/80 hover:bg-purple-600 text-white text-xs font-semibold flex flex-col items-center justify-center space-y-1 transition-all"
                >
                  <Gavel className="w-4 h-4" />
                  <span>Hearing (শুনানি)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOfficerDecision('rejected')}
                  className="p-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex flex-col items-center justify-center space-y-1 transition-all"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject (বাতিল)</span>
                </button>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Official AC Land Order / Hearing Remarks:
                </label>
                <textarea
                  rows={2}
                  value={officerNote}
                  onChange={(e) => setOfficerNote(e.target.value)}
                  placeholder="Record formal administrative order or directions to Kanungo..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-600 focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200"
              >
                Close Inspector
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
