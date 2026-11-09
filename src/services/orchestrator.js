// ==============================================================================
// Agent Orchestrator
// Coordinates the multi-agent workflow: Intake -> Identity -> Background -> Dossier
// ==============================================================================

import { saveApplicationRecord, logAgentActivity } from '../lib/supabase.js';
import { runIntakeAgent } from './intakeAgent.js';
import { runIdentityAgent } from './identityAgent.js';
import { runBackgroundAgent } from './backgroundAgent.js';
import { runDossierAgent } from './dossierAgent.js';

// Small async delay helper for realistic visualization
const delay = (ms) => new Promise(res => setTimeout(res, ms));

export async function orchestrateVerificationWorkflow(application, onStepUpdate) {
  const appId = application.id;

  try {
    // 1. Orchestration Start
    if (onStepUpdate) onStepUpdate({ step: 'START', agent: 'orchestrator', progress: 5, message: 'Initiating Multi-Agent Pipeline...' });
    
    await logAgentActivity(
      appId,
      'orchestrator',
      'PIPELINE_INITIATED',
      'info',
      `Orchestrator launched workflow for Application ${application.application_number}. Target: Bangladesh Land Mutation Clearance.`
    );

    await saveApplicationRecord({
      ...application,
      status: 'processing',
      current_agent: 'intake'
    });

    await delay(600);

    // 2. Stage 1: Intake Agent
    if (onStepUpdate) onStepUpdate({ step: 'INTAKE', agent: 'intake', progress: 25, message: 'Intake Agent: Extracting documents & metadata...' });
    const intakeResult = await runIntakeAgent(application, (progress) => {
      if (onStepUpdate) onStepUpdate({ step: 'INTAKE', agent: 'intake', progress: 30, message: progress.msg });
    });

    await delay(700);

    // 3. Stage 2: Identity Agent
    if (onStepUpdate) onStepUpdate({ step: 'IDENTITY', agent: 'identity', progress: 50, message: 'Identity Agent: Cross-referencing NID & bilingual names...' });
    await saveApplicationRecord({
      ...application,
      current_agent: 'identity'
    });

    const identityResult = await runIdentityAgent(application, intakeResult, (progress) => {
      if (onStepUpdate) onStepUpdate({ step: 'IDENTITY', agent: 'identity', progress: 55, message: progress.msg });
    });

    await delay(700);

    // 4. Stage 3: Background Agent
    if (onStepUpdate) onStepUpdate({ step: 'BACKGROUND', agent: 'background', progress: 75, message: 'Background Agent: Validating land title & encumbrance records...' });
    await saveApplicationRecord({
      ...application,
      current_agent: 'background'
    });

    const backgroundResult = await runBackgroundAgent(application, identityResult, (progress) => {
      if (onStepUpdate) onStepUpdate({ step: 'BACKGROUND', agent: 'background', progress: 80, message: progress.msg });
    });

    await delay(700);

    // 5. Stage 4: Dossier Agent
    if (onStepUpdate) onStepUpdate({ step: 'DOSSIER', agent: 'dossier', progress: 90, message: 'Dossier Agent: Synthesizing audit report & integrity score...' });
    await saveApplicationRecord({
      ...application,
      current_agent: 'dossier'
    });

    const dossierResult = await runDossierAgent(application, intakeResult, identityResult, backgroundResult, (progress) => {
      if (onStepUpdate) onStepUpdate({ step: 'DOSSIER', agent: 'dossier', progress: 95, message: progress.msg });
    });

    await delay(500);

    // 6. Final Status Transition
    let finalStatus = 'verified';
    if (dossierResult.recommendation === 'REJECT') {
      finalStatus = 'rejected';
    } else if (dossierResult.recommendation === 'CITIZEN_CLARIFICATION_REQUIRED' || identityResult.status === 'discrepancy_flagged') {
      finalStatus = 'flagged_discrepancy';
    }

    const updatedApp = await saveApplicationRecord({
      ...application,
      status: finalStatus,
      risk_level: dossierResult.risk_level.toLowerCase(),
      integrity_score: dossierResult.integrity_score,
      current_agent: 'completed',
      discrepancy_flags: identityResult.discrepancies.concat(backgroundResult.flags)
    });

    await logAgentActivity(
      appId,
      'orchestrator',
      'PIPELINE_COMPLETE',
      finalStatus === 'verified' ? 'success' : finalStatus === 'rejected' ? 'error' : 'warning',
      `Multi-agent execution concluded with status: ${finalStatus.toUpperCase()}. Integrity Score: ${dossierResult.integrity_score}/100.`,
      { dossierResult }
    );

    if (onStepUpdate) onStepUpdate({
      step: 'DONE',
      agent: 'orchestrator',
      progress: 100,
      message: `Workflow complete. Status: ${finalStatus.toUpperCase()}`,
      dossier: dossierResult,
      updatedApp
    });

    return {
      success: true,
      application: updatedApp,
      intake: intakeResult,
      identity: identityResult,
      background: backgroundResult,
      dossier: dossierResult
    };

  } catch (error) {
    console.error('Orchestrator error:', error);
    await logAgentActivity(
      appId,
      'orchestrator',
      'PIPELINE_ERROR',
      'error',
      `Pipeline exception: ${error.message}`
    );
    if (onStepUpdate) onStepUpdate({ step: 'ERROR', agent: 'orchestrator', progress: 100, message: `Pipeline Error: ${error.message}` });
    throw error;
  }
}
