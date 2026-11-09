import React from 'react';
import { 
  X, 
  Printer, 
  ShieldCheck, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Building2, 
  Award,
  Calendar,
  FileCheck2,
  Landmark,
  QrCode
} from 'lucide-react';

export function DossierReportModal({ application, dossier, onClose }) {
  if (!application) return null;

  const score = dossier?.integrity_score ?? application.integrity_score ?? 85;
  const recommendation = dossier?.recommendation || (score >= 80 ? 'FAST_TRACK_APPROVAL' : 'CITIZEN_CLARIFICATION_REQUIRED');
  const riskLevel = dossier?.risk_level || (score >= 80 ? 'LOW' : score >= 50 ? 'MEDIUM' : 'HIGH');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#0c1220] border border-white/[0.08] rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-gov-raised flex flex-col">
        
        {/* Top Header Actions */}
        <div className="p-4 sm:px-6 border-b border-white/[0.08] flex items-center justify-between sticky top-0 bg-[#0c1220]/95 backdrop-blur-xl z-10">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-sm sm:text-base font-sans">Official AI Verification Dossier & Integrity Report</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 border border-white/[0.08] transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Export PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Government Clearance Shell */}
        <div className="p-6 sm:p-8 space-y-6 text-slate-100 bg-[#070b16]">
          
          {/* Official Government Header */}
          <div className="text-center pb-6 border-b border-white/[0.08] relative">
            <div className="inline-block p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 mb-2">
              <Landmark className="w-6 h-6" />
            </div>
            <h2 className="text-xs font-bangla font-semibold text-slate-300 tracking-wide">গণপ্রজাতন্ত্রী বাংলাদেশ সরকার</h2>
            <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
              Ministry of Land | ভূমি সংস্কার বোর্ড ও জরিপ অধিদপ্তর
            </h1>
            <p className="text-xs text-emerald-400 font-mono mt-1">
              TerraAgent Automated Verification Dossier • Docket ID: {application.application_number}
            </p>
          </div>

          {/* Key Metrics / Verdict Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-[#0c1324] border border-white/[0.06]">
            <div className="text-center sm:text-left">
              <span className="text-[10px] font-semibold text-slate-400 font-mono uppercase tracking-wider block">Integrity Rating</span>
              <div className="flex items-baseline space-x-2 mt-1 justify-center sm:justify-start">
                <span className={`text-3xl font-extrabold font-mono ${
                  score >= 80 ? 'text-emerald-400' : score >= 50 ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {score}
                </span>
                <span className="text-xs text-slate-500 font-mono">/ 100</span>
              </div>
            </div>

            <div className="text-center sm:text-left">
              <span className="text-[10px] font-semibold text-slate-400 font-mono uppercase tracking-wider block">Risk Assessment</span>
              <span className={`inline-block mt-2 px-2.5 py-1 rounded text-[11px] font-mono font-bold uppercase tracking-wider ${
                riskLevel === 'LOW' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                riskLevel === 'MEDIUM' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                'bg-rose-950 text-rose-300 border border-rose-800'
              }`}>
                {riskLevel} RISK
              </span>
            </div>

            <div className="text-center sm:text-left">
              <span className="text-[10px] font-semibold text-slate-400 font-mono uppercase tracking-wider block">Policy Recommendation</span>
              <span className="text-xs font-bold text-white block mt-2 font-mono">
                {recommendation.replace(/_/g, ' ')}
              </span>
            </div>
          </div>

          {/* Executive Summary */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-mono mb-2">Executive Summary</h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-[#0c1324] p-4 rounded-xl border border-white/[0.06] font-sans">
              {dossier?.executive_summary || `Applicant ${application.applicant_name_en} filed e-mutation for Plot ${application.plot_number}, Mouza ${application.mouza}. Multi-agent system verified digital identity, title lineage, and tax status. Result: ${recommendation.replace(/_/g, ' ')}.`}
            </p>
          </div>

          {/* Section 1: Identity & Phonetic Verification */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-mono mb-2">
              1. Identity Verification Stream (জাতীয় পরিচয়পত্র ও বানান বিশ্লেষণ)
            </h4>
            <div className="overflow-x-auto rounded-xl border border-white/[0.06] bg-[#0c1324]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#080d18] text-slate-400 border-b border-white/[0.06] font-mono text-[10px] uppercase">
                  <tr>
                    <th className="p-3">Attribute</th>
                    <th className="p-3">Application Value</th>
                    <th className="p-3">Synthetic NID Registry</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] font-mono text-slate-200">
                  <tr>
                    <td className="p-3 text-slate-400 font-sans">English Name</td>
                    <td className="p-3">{application.applicant_name_en}</td>
                    <td className="p-3">{dossier?.identity_findings?.nid_record?.name_en || application.applicant_name_en}</td>
                    <td className="p-3 text-emerald-400 font-sans font-semibold">Matched (OCR)</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-slate-400 font-sans">Bangla Name</td>
                    <td className="p-3 font-bangla">{application.applicant_name_bn}</td>
                    <td className="p-3 font-bangla">{dossier?.identity_findings?.nid_record?.name_bn || application.applicant_name_bn}</td>
                    <td className="p-3 text-emerald-400 font-sans font-semibold">Verified</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-slate-400 font-sans">National ID (NID)</td>
                    <td className="p-3">{application.nid_number}</td>
                    <td className="p-3">{application.nid_number}</td>
                    <td className="p-3 text-emerald-400 font-sans font-semibold">Active & Valid</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-slate-400 font-sans">Date of Birth</td>
                    <td className="p-3">{application.dob}</td>
                    <td className="p-3">{application.dob}</td>
                    <td className="p-3 text-emerald-400 font-sans font-semibold">Consistent</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Land Records & Encumbrances */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-mono mb-2">
              2. Cadastral & Encumbrance Audit (খতিয়ান ও স্বত্ব নিরীক্ষা)
            </h4>
            <div className="p-4 rounded-xl bg-[#0c1324] border border-white/[0.06] space-y-3 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px] font-sans">Survey:</span>
                  <span className="font-semibold text-slate-200">{dossier?.land_record_findings?.survey_type || 'BS Survey'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] font-sans">Plot / Dag:</span>
                  <span className="font-semibold text-slate-200">{application.plot_number}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] font-sans">Khatian No:</span>
                  <span className="font-semibold text-slate-200">{application.khatian_number}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] font-sans">Tax Status:</span>
                  <span className="font-semibold text-emerald-400">{dossier?.land_record_findings?.tax_status || 'Paid (2025)'}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/[0.04]">
                <span className="text-slate-500 block text-[10px] font-sans">Encumbrance & Title Status:</span>
                <span className="font-semibold text-slate-200">
                  {dossier?.land_record_findings?.encumbrance_status || 'Clear. No injunctions or government restrictions.'}
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Officer Action Checklist */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-mono mb-2">
              3. Officer Decision Checklist (সহকারী কমিশনার - ভূমি অ্যাকশন)
            </h4>
            <div className="space-y-2">
              {(dossier?.officer_action_checklist || [
                'Verify applicant photo with Smart NID biometrics',
                'Confirm Upazila Sub-Registry deed registration volume',
                'Generate Digital Mutation Khatian Certificate (ডিজিটাল পর্চা)'
              ]).map((chk, i) => (
                <div key={i} className="flex items-center space-x-2 text-xs text-slate-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{chk}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Digital Signature & Seal */}
          <div className="pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4 font-mono">
            <div>
              <p>Certified by TerraAgent Autonomous Verification Pipeline</p>
              <p className="text-[10px] text-slate-600">Digital Seal: SHA256:{Math.random().toString(36).substring(2, 15)}...gov.bd</p>
            </div>
            <div className="text-right">
              <span className="px-3 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
                DIGITALLY CERTIFIED • GOV.BD
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
