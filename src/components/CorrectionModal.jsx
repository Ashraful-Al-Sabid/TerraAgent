import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  Check, 
  RefreshCw, 
  ArrowRight, 
  ShieldCheck, 
  FileEdit,
  Sparkles
} from 'lucide-react';
import { saveApplicationRecord, logAgentActivity } from '../lib/supabase';

export function CorrectionModal({ application, onClose, onResubmit }) {
  if (!application) return null;

  const discrepancies = application.discrepancy_flags || [];
  const [corrections, setCorrections] = useState({
    applicant_name_en: application.applicant_name_en,
    applicant_name_bn: application.applicant_name_bn,
    nid_number: application.nid_number,
    dob: application.dob,
    khatian_number: application.khatian_number,
    plot_number: application.plot_number,
    land_area_decimals: application.land_area_decimals
  });

  const [citizenNote, setCitizenNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApplyOfficialFix = (field, officialVal) => {
    if (officialVal) {
      setCorrections(prev => ({ ...prev, [field]: officialVal }));
    }
  };

  const handleSubmitCorrections = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updatedApp = {
        ...application,
        ...corrections,
        is_resubmitted: true,
        correction_history: [
          ...(application.correction_history || []),
          {
            timestamp: new Date().toISOString(),
            previous: {
              applicant_name_en: application.applicant_name_en,
              applicant_name_bn: application.applicant_name_bn,
              dob: application.dob
            },
            corrected: corrections,
            citizen_note: citizenNote
          }
        ]
      };

      await logAgentActivity(
        application.id,
        'orchestrator',
        'CITIZEN_CORRECTION_SUBMITTED',
        'info',
        `Citizen submitted rectifications for Application ${application.application_number}. Triggering re-evaluation.`,
        { corrections, citizenNote }
      );

      await saveApplicationRecord(updatedApp);
      setIsSubmitting(false);
      onResubmit(updatedApp);
      onClose();
    } catch (err) {
      console.error('Failed to submit corrections:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur-sm z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Citizen Correction & Resubmission</h3>
              <p className="text-xs text-slate-400">Review discrepancies flagged by Identity & Background Agents</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmitCorrections} className="p-6 space-y-6">
          
          {/* Discrepancies Summary Banner */}
          <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30">
            <h4 className="text-xs font-semibold text-amber-300 uppercase tracking-wider mb-2">
              Action Required: {discrepancies.length} Discrepanc{discrepancies.length === 1 ? 'y' : 'ies'} Found
            </h4>
            <div className="space-y-3">
              {discrepancies.map((disc, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-semibold text-slate-200">{disc.title || disc.type}</span>
                      <p className="text-slate-400 mt-1 leading-relaxed">{disc.message || disc.description}</p>
                    </div>
                    {disc.official && (
                      <button
                        type="button"
                        onClick={() => handleApplyOfficialFix(disc.field, disc.official)}
                        className="ml-3 shrink-0 flex items-center space-x-1 px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/80 hover:bg-emerald-900 transition-colors"
                        title="Autofill official spelling"
                      >
                        <Sparkles className="w-3 h-3 text-emerald-400" />
                        <span>Autofill Official</span>
                      </button>
                    )}
                  </div>

                  {disc.official && (
                    <div className="mt-2 pt-2 border-t border-slate-800 flex items-center space-x-4 text-[11px] font-mono">
                      <span className="text-rose-400">Submitted: "{disc.applied}"</span>
                      <ArrowRight className="w-3 h-3 text-slate-500" />
                      <span className="text-emerald-400">Official NID: "{disc.official}"</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Editable Fields for Correction */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
              <FileEdit className="w-4 h-4 text-emerald-400" />
              <span>Corrected Application Fields</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Full Name (English)
                </label>
                <input
                  type="text"
                  value={corrections.applicant_name_en}
                  onChange={(e) => setCorrections({ ...corrections, applicant_name_en: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  নাম (বাংলায়)
                </label>
                <input
                  type="text"
                  value={corrections.applicant_name_bn}
                  onChange={(e) => setCorrections({ ...corrections, applicant_name_bn: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white font-bangla focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={corrections.dob}
                  onChange={(e) => setCorrections({ ...corrections, dob: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  National ID (NID)
                </label>
                <input
                  type="text"
                  value={corrections.nid_number}
                  onChange={(e) => setCorrections({ ...corrections, nid_number: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            {/* Citizen clarification note */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Clarification Statement for Officer & AI (নাগরিকের স্পষ্টীকরণ নোট)
              </label>
              <textarea
                rows={2}
                value={citizenNote}
                onChange={(e) => setCitizenNote(e.target.value)}
                placeholder="e.g. Corrected English spelling to match Smart NID card. Uploaded affidavit if required."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/30 transition-all"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Resubmitting...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Apply Corrections & Resubmit Application</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
