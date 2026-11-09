// ==============================================================================
// Agent 4: Dossier Agent
// Compiles multi-agent evidence into an authoritative structured Dossier Report
// ==============================================================================

import { logAgentActivity, saveDossier } from '../lib/supabase.js';
import { callOpenAI } from '../lib/openai.js';

export async function runDossierAgent(application, intakeResult, identityResult, backgroundResult, onProgress) {
  const appId = application.id;
  const updateProgress = (phase, msg) => {
    if (onProgress) onProgress({ agent: 'dossier', phase, msg });
  };

  await logAgentActivity(
    appId,
    'dossier',
    'INITIATION',
    'info',
    `Dossier Agent synthesizing comprehensive audit across Intake, Identity, and Background Agent streams.`
  );
  updateProgress('synthesizing', 'Synthesizing multi-agent verification vectors...');

  // 1. Calculate Composite Integrity Score
  const idScore = identityResult?.identityScore ?? 50;
  const bgRisk = backgroundResult?.riskScore ?? 50;
  const hasIncompleteDocs = intakeResult?.status === 'incomplete_docs';

  let compositeScore = Math.round((idScore * 0.45) + ((100 - bgRisk) * 0.45));
  if (hasIncompleteDocs) compositeScore -= 15;
  compositeScore = Math.max(5, Math.min(100, compositeScore));

  // 2. Formulate Recommendation
  let recommendation = 'APPROVE';
  let riskLevel = 'LOW';

  const criticalViolations = backgroundResult?.flags?.filter(f => f.severity === 'CRITICAL') || [];
  const highRiskLitigation = backgroundResult?.flags?.filter(f => f.type === 'ACTIVE_COURT_INJUNCTION') || [];
  const identityMismatches = identityResult?.discrepancies?.filter(d => d.severity === 'HIGH' || d.severity === 'CRITICAL') || [];

  if (criticalViolations.length > 0) {
    recommendation = 'REJECT';
    riskLevel = 'CRITICAL';
  } else if (highRiskLitigation.length > 0) {
    recommendation = 'PHYSICAL_HEARING_REQUIRED';
    riskLevel = 'HIGH';
  } else if (identityMismatches.length > 0 || hasIncompleteDocs || compositeScore < 75) {
    recommendation = 'CITIZEN_CLARIFICATION_REQUIRED';
    riskLevel = 'MEDIUM';
  } else {
    recommendation = 'FAST_TRACK_APPROVAL';
    riskLevel = 'LOW';
  }

  // 3. Generate Executive Summary
  const executiveSummary = `Comprehensive multi-agent dossier generated for Application ${application.application_number} (${application.applicant_name_en}). Identity Agent verified NID credentials with ${idScore}% fidelity. Background Agent evaluated BS/RS land records for Plot ${application.plot_number}, Mouza ${application.mouza}. Overall integrity rating established at ${compositeScore}/100. System Recommendation: ${recommendation.replace(/_/g, ' ')}.`;

  const report = {
    application_id: appId,
    application_number: application.application_number,
    applicant_name: application.applicant_name_en,
    executive_summary: executiveSummary,
    integrity_score: compositeScore,
    risk_level: riskLevel,
    recommendation: recommendation,
    identity_findings: {
      score: idScore,
      nid_verified: identityResult?.nidMatch,
      bris_verified: identityResult?.brisMatch,
      discrepancies: identityResult?.discrepancies || []
    },
    land_record_findings: {
      survey_type: backgroundResult?.landRecord?.survey_type || 'Unknown',
      recorded_owner: backgroundResult?.landRecord?.recorded_owner_en || 'Not resolved',
      encumbrance_status: backgroundResult?.landRecord?.encumbrance_status || 'Unverified',
      tax_status: backgroundResult?.landRecord?.last_tax_year ? `Paid up to ${backgroundResult.landRecord.last_tax_year}` : 'Unknown',
      flags: backgroundResult?.flags || []
    },
    document_findings: {
      total_uploaded: intakeResult?.documentsCount || 0,
      missing_required: intakeResult?.missingDocs || []
    },
    officer_action_checklist: [
      recommendation === 'FAST_TRACK_APPROVAL' ? 'Execute Digital Mutation Certificate' : 'Issue Notice to Applicant',
      'Record in Upazila Mutation Ledger (e-Namjari)',
      'Update Upazila Land Office GIS Plot Boundary'
    ]
  };

  // Save report
  await saveDossier(report);

  await logAgentActivity(
    appId,
    'dossier',
    'DOSSIER_COMPILED',
    recommendation === 'FAST_TRACK_APPROVAL' ? 'success' : recommendation === 'REJECT' ? 'error' : 'warning',
    `Dossier completed. Score: ${compositeScore}/100 | Recommendation: ${recommendation.replace(/_/g, ' ')}`,
    { report }
  );

  updateProgress('completed', 'Dossier Agent generated final verification report.');
  return report;
}
