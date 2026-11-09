import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.jsx';
import { CitizenPortal } from './components/CitizenPortal.jsx';
import { OfficerDashboard } from './components/OfficerDashboard.jsx';
import { DossierReportModal } from './components/DossierReportModal.jsx';
import { CorrectionModal } from './components/CorrectionModal.jsx';
import { SettingsModal } from './components/SettingsModal.jsx';
import { PRESET_APPLICATIONS } from './data/presetApplications.js';
import { orchestrateVerificationWorkflow } from './services/orchestrator.js';
import { fetchDossierByAppId, saveApplicationRecord } from './lib/supabase.js';

export function App() {
  const [activeTab, setActiveTab] = useState('citizen'); // 'citizen' or 'officer'
  const [currentApp, setCurrentApp] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(null);
  
  // Modals
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [viewingDossier, setViewingDossier] = useState(null);
  const [isCorrectionOpen, setIsCorrectionOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Initialize with the first preset application
  useEffect(() => {
    if (!currentApp) {
      const defaultPreset = PRESET_APPLICATIONS[0];
      const initial = {
        ...defaultPreset.data,
        id: defaultPreset.id,
        application_number: 'TERRA-2026-1001',
        status: 'pending',
        risk_level: 'low',
        integrity_score: 0
      };
      setCurrentApp(initial);
    }
  }, [currentApp]);

  // Execute Multi-Agent Verification Workflow
  const handleRunWorkflow = async (appData) => {
    setIsRunning(true);
    setCurrentProgress({ step: 'START', agent: 'orchestrator', progress: 5, message: 'Initiating Multi-Agent Pipeline...' });

    try {
      // Ensure application is saved
      const saved = await saveApplicationRecord(appData);
      setCurrentApp(saved);

      const result = await orchestrateVerificationWorkflow(saved, (stepInfo) => {
        setCurrentProgress(stepInfo);
        if (stepInfo.updatedApp) {
          setCurrentApp(stepInfo.updatedApp);
        }
      });

      if (result.dossier) {
        setViewingDossier(result.dossier);
      }

      // If discrepancies flagged, prompt user
      if (result.application.status === 'flagged_discrepancy') {
        setIsCorrectionOpen(true);
      }
    } catch (err) {
      console.error('Workflow error:', err);
    } finally {
      setIsRunning(false);
    }
  };

  // Open Dossier Report Modal
  const handleOpenDossier = async (targetApp = currentApp) => {
    if (!targetApp) return;
    const dossier = await fetchDossierByAppId(targetApp.id);
    setViewingDossier(dossier);
    setIsDossierOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-white flex flex-col selection:bg-emerald-600 selection:text-white font-sans">
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Surface View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'citizen' ? (
          <CitizenPortal
            currentApp={currentApp}
            setCurrentApp={setCurrentApp}
            onRunWorkflow={handleRunWorkflow}
            isRunning={isRunning}
            currentProgress={currentProgress}
            onViewDossier={() => handleOpenDossier(currentApp)}
            onOpenCorrection={() => setIsCorrectionOpen(true)}
          />
        ) : (
          <OfficerDashboard
            onViewDossier={(app) => {
              setCurrentApp(app);
              handleOpenDossier(app);
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-[#070a12] py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-300">TerraAgent</span>
            <span>•</span>
            <span className="font-bangla">টেকসই ভূমি সেবা অটোমেশন প্ল্যাটফর্ম</span>
          </div>
          <div className="flex items-center space-x-4 text-[11px] font-mono">
            <span>GovTech Bangladesh</span>
            <span>•</span>
            <span className="text-emerald-400">Autonomous Public Service Verification Core</span>
          </div>
        </div>
      </footer>

      {/* Dossier Report Modal */}
      {isDossierOpen && (
        <DossierReportModal
          application={currentApp}
          dossier={viewingDossier}
          onClose={() => setIsDossierOpen(false)}
        />
      )}

      {/* Citizen Correction Modal */}
      {isCorrectionOpen && (
        <CorrectionModal
          application={currentApp}
          onClose={() => setIsCorrectionOpen(false)}
          onResubmit={(updated) => {
            setCurrentApp(updated);
            handleRunWorkflow(updated);
          }}
        />
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal
          onClose={() => setIsSettingsOpen(false)}
          onSettingsUpdated={() => {
            // refreshed
          }}
        />
      )}

    </div>
  );
}

export default App;
