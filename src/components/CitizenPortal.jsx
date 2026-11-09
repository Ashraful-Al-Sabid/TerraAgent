import React, { useState } from 'react';
import { 
  Send, 
  Upload, 
  FileText, 
  User, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  Trash2, 
  CheckCircle,
  Eye,
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { PRESET_APPLICATIONS } from '../data/presetApplications.js';
import { AgentOrchestratorView } from './AgentOrchestratorView.jsx';
import { EvidenceViewer } from './EvidenceViewer.jsx';

export function CitizenPortal({ 
  currentApp, 
  setCurrentApp, 
  onRunWorkflow, 
  isRunning, 
  currentProgress,
  onViewDossier,
  onOpenCorrection
}) {
  const [formData, setFormData] = useState(currentApp || PRESET_APPLICATIONS[0].data);
  const [selectedPresetId, setSelectedPresetId] = useState(PRESET_APPLICATIONS[0].id);
  const [uploadNotice, setUploadNotice] = useState('');
  const [previewingDoc, setPreviewingDoc] = useState(null);

  const handleSelectPreset = (preset) => {
    setSelectedPresetId(preset.id);
    const newAppData = {
      ...preset.data,
      id: `app-${Date.now()}`,
      application_number: `TERRA-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'pending',
      risk_level: 'low',
      integrity_score: 0
    };
    setFormData(newAppData);
    setCurrentApp(newAppData);
  };

  const handleChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    setCurrentApp(updated);
  };

  const handleAddDocument = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const newDoc = {
        id: `doc-${Date.now()}`,
        doc_type: file.name.toLowerCase().includes('nid') ? 'nid_card' : 'khatian_porcha',
        file_name: file.name,
        file_size: file.size,
        status: 'uploaded',
        extracted_data: {
          ocr_confidence: 96.0,
          extracted_title: file.name
        }
      };
      const updatedDocs = [...(formData.documents || []), newDoc];
      const updated = { ...formData, documents: updatedDocs };
      setFormData(updated);
      setCurrentApp(updated);
      setUploadNotice(`Document "${file.name}" uploaded successfully for Intake Agent extraction.`);
      setTimeout(() => setUploadNotice(''), 4000);
    }
  };

  const handleRemoveDoc = (docId) => {
    const updatedDocs = (formData.documents || []).filter(d => d.id !== docId);
    const updated = { ...formData, documents: updatedDocs };
    setFormData(updated);
    setCurrentApp(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onRunWorkflow(formData);
  };

  return (
    <div className="space-y-8">
      
      {/* Service Header & Persona Selector */}
      <div className="rounded-2xl bg-[#0c1220] border border-white/[0.08] p-6 sm:p-8 shadow-gov-card relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-medium mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Digital Public Infrastructure • Land Administration Platform</span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            e-Namjari & Title Verification Portal
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 font-bangla leading-relaxed">
            স্বয়ংক্রিয় কৃত্রিম বুদ্ধিমত্তা চালিত ভূমি নামজারি ও রেকর্ড যাচাইকরণ সেবা। আপনার এনআইডি ও খতিয়ানের তথ্য দিন, চারটি এআই এজেন্ট মুহূর্তেই আপনার আবেদন যাচাই করবে।
          </p>
        </div>

        {/* Demo Verification Personas */}
        <div className="mt-6 pt-6 border-t border-white/[0.08]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-mono">
              Pre-Configured Test Personas (Synthetic Verification Cases):
            </span>
            <span className="text-[10px] text-slate-500 hidden sm:inline">Click to populate form</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {PRESET_APPLICATIONS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`text-left p-3 rounded-xl border transition-all ${
                  selectedPresetId === preset.id
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-white shadow-gov-glow ring-1 ring-emerald-500/20'
                    : 'bg-[#101728] border-white/[0.06] text-slate-300 hover:bg-[#141d33] hover:border-white/[0.12]'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="truncate pr-1">{preset.label.split(':')[0]}</span>
                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase tracking-wider ${
                    preset.badgeColor === 'emerald' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                    preset.badgeColor === 'amber' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                    preset.badgeColor === 'rose' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                    'bg-red-950 text-red-300 border border-red-800'
                  }`}>
                    {preset.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1">{preset.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Orchestrator Live Execution View */}
      {currentApp && (
        <AgentOrchestratorView
          application={currentApp}
          currentProgress={currentProgress}
          isRunning={isRunning}
          onViewDossier={onViewDossier}
          onOpenCorrection={onOpenCorrection}
        />
      )}

      {/* Structured Application Submission Form */}
      <form onSubmit={handleSubmit} className="bg-[#0c1220] border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-gov-card backdrop-blur-xl">
        
        {/* Step 1: Personal Identification */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 text-white font-semibold text-sm">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-xs font-mono font-bold">
                1
              </div>
              <span>Applicant Identification & NID Records (আবেদনকারীর ব্যক্তিগত তথ্য)</span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">Cross-referenced with NID & BRIS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Full Legal Name (English) <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.applicant_name_en || ''}
                onChange={(e) => handleChange('applicant_name_en', e.target.value)}
                placeholder="e.g. Md. Arifur Rahman"
                className="w-full bg-[#070a12] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 transition-colors font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                পূর্ণ নাম (বাংলায় - এনআইডি অনুযায়ী) <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.applicant_name_bn || ''}
                onChange={(e) => handleChange('applicant_name_bn', e.target.value)}
                placeholder="যেমন: মো: আরিফুর রহমান"
                className="w-full bg-[#070a12] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 font-bangla transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                National ID (Smart NID) <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.nid_number || ''}
                onChange={(e) => handleChange('nid_number', e.target.value)}
                placeholder="10 or 17 digit NID number"
                className="w-full bg-[#070a12] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 font-mono transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Date of Birth (জন্ম তারিখ) <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.dob || ''}
                onChange={(e) => handleChange('dob', e.target.value)}
                className="w-full bg-[#070a12] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 transition-colors font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                BRIS Birth Registration No (ঐচ্ছিক)
              </label>
              <input
                type="text"
                value={formData.bris_number || ''}
                onChange={(e) => handleChange('bris_number', e.target.value)}
                placeholder="17 digit BRIS registration"
                className="w-full bg-[#070a12] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 font-mono transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Mobile Number for SMS Notifications <span className="text-rose-400">*</span>
              </label>
              <input
                type="tel"
                required
                value={formData.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+8801..."
                className="w-full bg-[#070a12] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 transition-colors font-mono"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Land Plot & Schedule */}
        <div className="mt-8 pt-8 border-t border-white/[0.08]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 text-white font-semibold text-sm">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-xs font-mono font-bold">
                2
              </div>
              <span>Land Parcel & e-Mutation Schedule (জমির তফসিল ও খতিয়ান বিবরণী)</span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">Verified with DLRS digital ledger</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">District (জেলা)</label>
              <input
                type="text"
                required
                value={formData.district || ''}
                onChange={(e) => handleChange('district', e.target.value)}
                className="w-full bg-[#070a12] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Upazila (উপজেলা)</label>
              <input
                type="text"
                required
                value={formData.upazila || ''}
                onChange={(e) => handleChange('upazila', e.target.value)}
                className="w-full bg-[#070a12] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Mouza (মৌজা)</label>
              <input
                type="text"
                required
                value={formData.mouza || ''}
                onChange={(e) => handleChange('mouza', e.target.value)}
                className="w-full bg-[#070a12] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">J.L. Number (জে.এল নং)</label>
              <input
                type="text"
                required
                value={formData.jl_number || ''}
                onChange={(e) => handleChange('jl_number', e.target.value)}
                className="w-full bg-[#070a12] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Khatian Number (খতিয়ান নং)</label>
              <input
                type="text"
                required
                value={formData.khatian_number || ''}
                onChange={(e) => handleChange('khatian_number', e.target.value)}
                className="w-full bg-[#070a12] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Plot / Dag Number (দাগ নং)</label>
              <input
                type="text"
                required
                value={formData.plot_number || ''}
                onChange={(e) => handleChange('plot_number', e.target.value)}
                className="w-full bg-[#070a12] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Area in Decimals (শতক)</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.land_area_decimals || ''}
                onChange={(e) => handleChange('land_area_decimals', e.target.value)}
                className="w-full bg-[#070a12] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Service Type</label>
              <select
                value={formData.application_type || 'mutation_namjari'}
                onChange={(e) => handleChange('application_type', e.target.value)}
                className="w-full bg-[#070a12] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 transition-colors"
              >
                <option value="mutation_namjari">e-Namjari (ই-নামজারি)</option>
                <option value="record_correction">Record Correction (রেকর্ড সংশোধন)</option>
                <option value="warishan_transfer">Heirship Partition (ওয়ারিশান)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Step 3: Evidentiary Documents */}
        <div className="mt-8 pt-8 border-t border-white/[0.08]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 text-white font-semibold text-sm">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-xs font-mono font-bold">
                3
              </div>
              <span>Evidentiary Documents & Intake Scans (প্রয়োজনীয় দলিল ও প্রমাণপত্র)</span>
            </div>

            <label className="cursor-pointer inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-sm">
              <Upload className="w-3.5 h-3.5" />
              <span>Attach Document</span>
              <input type="file" onChange={handleAddDocument} className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
            </label>
          </div>

          {uploadNotice && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{uploadNotice}</span>
            </div>
          )}

          {/* Document Cards with "Inspect Scan" Button */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {(formData.documents || []).map((doc) => (
              <div 
                key={doc.id}
                className="p-3.5 rounded-xl bg-[#070a12] border border-white/[0.08] flex items-center justify-between group hover:border-white/[0.16] transition-colors"
              >
                <div className="flex items-center space-x-3 overflow-hidden">
                  <div className="p-2.5 rounded-xl bg-[#10192e] text-emerald-400 shrink-0 border border-white/[0.04]">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-medium text-slate-200 truncate">{doc.file_name}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">
                      {doc.doc_type?.replace('_', ' ')} • {doc.file_size ? `${Math.round(doc.file_size / 1024)} KB` : 'Verified OCR'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1 shrink-0 ml-2">
                  <button
                    type="button"
                    onClick={() => setPreviewingDoc(doc)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-white/[0.04] transition-colors"
                    title="Inspect OCR Document Scan"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveDoc(doc.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-white/[0.04] transition-colors"
                    title="Remove document"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Trigger */}
        <div className="mt-8 pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>End-to-End Encryption • ISO/IEC 27001 Public Verification Sandbox</span>
          </div>

          <button
            type="submit"
            disabled={isRunning}
            className={`w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-all ${
              isRunning 
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/40 active:scale-95'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isRunning ? 'Multi-Agent Processing...' : 'Dispatch Multi-Agent Verification (যাচাই শুরু করুন)'}</span>
          </button>
        </div>

      </form>

      {/* Interactive Evidence Inspection Modal */}
      {previewingDoc && (
        <EvidenceViewer
          document={previewingDoc}
          onClose={() => setPreviewingDoc(null)}
        />
      )}

    </div>
  );
}
