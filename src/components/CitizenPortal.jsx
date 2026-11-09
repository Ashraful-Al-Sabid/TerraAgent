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
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import { PRESET_APPLICATIONS } from '../data/presetApplications';
import { AgentOrchestratorView } from './AgentOrchestratorView';

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

  // Handle Preset Selection
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

  // Form Field Change
  const handleChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    setCurrentApp(updated);
  };

  // Simulate file upload
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
          ocr_confidence: 96.0
        }
      };
      const updatedDocs = [...(formData.documents || []), newDoc];
      const updated = { ...formData, documents: updatedDocs };
      setFormData(updated);
      setCurrentApp(updated);
      setUploadNotice(`File "${file.name}" uploaded successfully and scheduled for Intake Agent OCR.`);
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
      
      {/* Hero / Header Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950/70 via-slate-900 to-slate-950 border border-emerald-900/40 p-6 sm:p-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 text-xs font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Digital Land Mutation & Public Administration Service</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            e-Namjari & Title Verification Portal
          </h1>
          <p className="mt-2 text-sm text-slate-300 font-bangla leading-relaxed">
            স্বয়ংক্রিয় কৃত্রিম বুদ্ধিমত্তা চালিত ভূমি নামজারি ও রেকর্ড যাচাইকরণ সেবা। আপনার এনআইডি ও খতিয়ানের তথ্য দিন, চারটি এআই এজেন্ট মুহূর্তেই আপনার আবেদন যাচাই করবে।
          </p>
        </div>

        {/* Preset Selector Chips for instant demo testing */}
        <div className="mt-6 pt-6 border-t border-slate-800/80">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-3">
            Quick-Load Test Personas (Hackathon Verification Scenarios):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {PRESET_APPLICATIONS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`text-left p-3 rounded-xl border transition-all ${
                  selectedPresetId === preset.id
                    ? 'bg-emerald-950/60 border-emerald-500/60 text-white shadow-md shadow-emerald-950'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="truncate pr-1">{preset.label.split(':')[0]}</span>
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                    preset.badgeColor === 'emerald' ? 'bg-emerald-900/80 text-emerald-300' :
                    preset.badgeColor === 'amber' ? 'bg-amber-900/80 text-amber-300' :
                    preset.badgeColor === 'rose' ? 'bg-rose-900/80 text-rose-300' :
                    'bg-red-950 text-red-300'
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

      {/* Main Orchestrator Live Execution View (if active or has status) */}
      {currentApp && (
        <AgentOrchestratorView
          application={currentApp}
          currentProgress={currentProgress}
          isRunning={isRunning}
          onViewDossier={onViewDossier}
          onOpenCorrection={onOpenCorrection}
        />
      )}

      {/* Application Submission Form */}
      <form onSubmit={handleSubmit} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl backdrop-blur-sm">
        
        {/* Step 1: Personal Identification */}
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-sm mb-4">
            <User className="w-4 h-4" />
            <span>1. Applicant Identification & NID Details (আবেদনকারীর ব্যক্তিগত তথ্য)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Full Name (English as per NID) <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.applicant_name_en || ''}
                onChange={(e) => handleChange('applicant_name_en', e.target.value)}
                placeholder="e.g. Md. Ashraful Al Sabid"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                নাম (বাংলায় - জাতীয় পরিচয়পত্র অনুযায়ী) <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.applicant_name_bn || ''}
                onChange={(e) => handleChange('applicant_name_bn', e.target.value)}
                placeholder="যেমন: মো: আশরাফুল আল সাবিদ"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-500 font-bangla transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                National ID Number (NID) <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.nid_number || ''}
                onChange={(e) => handleChange('nid_number', e.target.value)}
                placeholder="10 or 17 digit NID"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-500 font-mono transition-colors"
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
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                BRIS Birth Reg No (ঐচ্ছিক / জন্ম নিবন্ধন)
              </label>
              <input
                type="text"
                value={formData.bris_number || ''}
                onChange={(e) => handleChange('bris_number', e.target.value)}
                placeholder="17 digit BRIS number"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-500 font-mono transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Mobile Number (মোবাইল নম্বর) <span className="text-rose-400">*</span>
              </label>
              <input
                type="tel"
                required
                value={formData.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+8801..."
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Land Plot & Registry Specifics */}
        <div className="mt-8 pt-8 border-t border-slate-800">
          <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-sm mb-4">
            <MapPin className="w-4 h-4" />
            <span>2. Land Parcel & e-Mutation Schedule (জমির তফসিল ও খতিয়ান বিবরণী)</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">District (জেলা)</label>
              <input
                type="text"
                required
                value={formData.district || ''}
                onChange={(e) => handleChange('district', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Upazila (উপজেলা)</label>
              <input
                type="text"
                required
                value={formData.upazila || ''}
                onChange={(e) => handleChange('upazila', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Mouza (মৌজা)</label>
              <input
                type="text"
                required
                value={formData.mouza || ''}
                onChange={(e) => handleChange('mouza', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">J.L. Number (জে.এল নং)</label>
              <input
                type="text"
                required
                value={formData.jl_number || ''}
                onChange={(e) => handleChange('jl_number', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Khatian Number (খতিয়ান নং)</label>
              <input
                type="text"
                required
                value={formData.khatian_number || ''}
                onChange={(e) => handleChange('khatian_number', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Plot / Dag Number (দাগ নং)</label>
              <input
                type="text"
                required
                value={formData.plot_number || ''}
                onChange={(e) => handleChange('plot_number', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Area in Decimals (জমির পরিমাণ - শতক)</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.land_area_decimals || ''}
                onChange={(e) => handleChange('land_area_decimals', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Application Type</label>
              <select
                value={formData.application_type || 'mutation_namjari'}
                onChange={(e) => handleChange('application_type', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 transition-colors"
              >
                <option value="mutation_namjari">e-Namjari (ই-নামজারি)</option>
                <option value="record_correction">Record Correction (রেকর্ড সংশোধন)</option>
                <option value="warishan_transfer">Heirship Partition (ওয়ারিশান বণ্টন)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Step 3: Document Attachments */}
        <div className="mt-8 pt-8 border-t border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-sm">
              <Upload className="w-4 h-4" />
              <span>3. Document Attachments for Intake Agent (প্রয়োজনীয় দলিল ও প্রমাণপত্র)</span>
            </div>
            <label className="cursor-pointer inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Document</span>
              <input type="file" onChange={handleAddDocument} className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
            </label>
          </div>

          {uploadNotice && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{uploadNotice}</span>
            </div>
          )}

          {/* Document Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {(formData.documents || []).map((doc) => (
              <div 
                key={doc.id}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3 overflow-hidden">
                  <div className="p-2 rounded-lg bg-slate-900 text-emerald-400 shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-medium text-slate-200 truncate">{doc.file_name}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">
                      {doc.doc_type.replace('_', ' ')} • {doc.file_size ? `${Math.round(doc.file_size / 1024)} KB` : 'Verified OCR'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveDoc(doc.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                  title="Remove document"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit & Orchestrate Action */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Encrypted transmission to TerraAgent Multi-Agent Orchestrator.</span>
          </div>

          <button
            type="submit"
            disabled={isRunning}
            className={`w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl text-sm font-semibold text-white shadow-lg transition-all ${
              isRunning 
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30 active:scale-95'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>{isRunning ? 'Agents Executing Workflow...' : 'Verify with Multi-Agent AI (যাচাই শুরু করুন)'}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
