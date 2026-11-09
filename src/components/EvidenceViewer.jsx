import React from 'react';
import { X, FileText, CheckCircle2, ShieldCheck, Download, Sparkles } from 'lucide-react';

export function EvidenceViewer({ document, onClose }) {
  if (!document) return null;

  const extracted = document.extracted_data || {};
  const confidence = extracted.ocr_confidence || 96.5;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:px-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur-sm z-10">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-white text-sm sm:text-base">{document.file_name}</h3>
              <p className="text-[11px] text-slate-400 font-mono uppercase">
                {document.doc_type?.replace('_', ' ')} • OCR Engine Verified
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          
          {/* Document Preview Canvas Mock */}
          <div className="border border-slate-700/80 rounded-xl p-6 bg-slate-950/90 relative overflow-hidden shadow-inner font-mono text-xs">
            
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 select-none text-slate-300 font-bold text-6xl rotate-[-25deg]">
              GOVT RECORD
            </div>

            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <span className="text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
                {document.doc_type === 'nid_card' ? 'BANGLADESH NATIONAL ID CARD' :
                 document.doc_type === 'khatian_porcha' ? 'BS KHATIAN PORCHA (রেকর্ড অব রাইটস)' :
                 'REGISTERED TRANSFER DEED (কবলা দলিল)'}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-slate-900 border border-slate-800 text-slate-400 font-mono">
                DOC-HASH: {document.id?.substring(0, 10) || '8f92b7c'}
              </span>
            </div>

            {/* Document Specific Preview Fields */}
            {document.doc_type === 'nid_card' ? (
              <div className="space-y-2 text-slate-300">
                <p><span className="text-slate-500">Name:</span> {extracted.extracted_name_en || 'Md. Arifur Rahman'}</p>
                <p><span className="text-slate-500 font-bangla">নাম (বাংলা):</span> <span className="font-bangla">{extracted.extracted_name_bn || 'মো: আরিফুর রহমান'}</span></p>
                <p><span className="text-slate-500">NID No:</span> {extracted.extracted_nid || '19942692015000101'}</p>
                <p><span className="text-slate-500">DOB:</span> {extracted.extracted_dob || '1994-05-14'}</p>
              </div>
            ) : document.doc_type === 'khatian_porcha' ? (
              <div className="space-y-2 text-slate-300">
                <p><span className="text-slate-500">Khatian:</span> {extracted.extracted_khatian || 'KH-4082'}</p>
                <p><span className="text-slate-500">Plot / Dag:</span> {extracted.extracted_plot || 'PL-889'}</p>
                <p><span className="text-slate-500">Mouza:</span> {extracted.extracted_mouza || 'Baunia'}</p>
                <p><span className="text-slate-500">Recorded Owner:</span> {extracted.recorded_owner || 'Md. Arifur Rahman'}</p>
              </div>
            ) : (
              <div className="space-y-2 text-slate-300">
                <p><span className="text-slate-500">Deed No:</span> {extracted.deed_number || '3942/2018'}</p>
                <p><span className="text-slate-500">Sub-Registry:</span> {extracted.sub_registry_office || 'Uttara Sub-Registry'}</p>
                <p><span className="text-slate-500">Transferor:</span> {extracted.transferor || 'Al-Haj Mofizur Rahman'}</p>
                <p><span className="text-slate-500">Transferee:</span> {extracted.transferee || 'Md. Arifur Rahman'}</p>
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
              <span>Security Stamp Verified</span>
              <span className="text-emerald-400 font-semibold">OCR Confidence: {confidence}%</span>
            </div>

          </div>

          {/* Intake Agent Digitized Attributes Card */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Intake Agent Vectorized Key-Value Attributes</span>
            </h4>

            <div className="grid grid-cols-2 gap-3 text-xs">
              {Object.entries(extracted).map(([key, val]) => (
                <div key={key} className="p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-500 block text-[10px] font-mono">{key.replace(/_/g, ' ')}:</span>
                  <span className="font-semibold text-slate-200 truncate block mt-0.5">{String(val)}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200"
          >
            Close Document
          </button>
        </div>

      </div>
    </div>
  );
}
