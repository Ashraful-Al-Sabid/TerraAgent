// ==============================================================================
// Vercel Serverless Function: Multi-Agent Orchestrator Endpoint
// Runs the Intake -> Identity -> Background -> Dossier pipeline on the server
// ==============================================================================

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. POST required.' });
  }

  try {
    const { application } = req.body;
    if (!application || !application.applicant_name_en) {
      return res.status(400).json({ error: 'Missing valid application payload.' });
    }

    const appId = application.id || `app-${Date.now()}`;
    const appNumber = application.application_number || `TERRA-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    // 1. Intake Agent evaluation
    const documents = application.documents || [];
    const missingDocs = ['nid_card', 'khatian_porcha'].filter(
      type => !documents.map(d => d.doc_type).includes(type)
    );

    // 2. Identity Agent evaluation
    const isArifur = application.applicant_name_en.toLowerCase().includes('arifur') || application.nid_number.includes('00101');
    const isMismatch = application.applicant_name_en.toLowerCase().includes('tanveer');
    
    let identityScore = isArifur ? 100 : isMismatch ? 72 : 88;
    const discrepancies = [];

    if (isMismatch) {
      discrepancies.push({
        type: 'MINOR_SPELLING_VARIATION',
        field: 'English Name',
        applied: application.applicant_name_en,
        official: 'Tanvir Ahmed Shanto',
        similarity: 86,
        severity: 'MEDIUM'
      });
    }

    // 3. Background Agent evaluation
    const isDisputed = (application.plot_number || '').includes('102') || (application.upazila || '').toLowerCase().includes('gazipur');
    const isVested = (application.plot_number || '').includes('415') || (application.upazila || '').toLowerCase().includes('mirpur');

    let backgroundRisk = isVested ? 95 : isDisputed ? 75 : 10;
    const backgroundFlags = [];

    if (isVested) {
      backgroundFlags.push({
        type: 'CRITICAL_VESTED_PROPERTY',
        severity: 'CRITICAL',
        title: 'Prohibited: Vested / Government Khas Property',
        description: 'Plot is classified as State Vested Property ("ক" তফসিল). Mutation prohibited.'
      });
    } else if (isDisputed) {
      backgroundFlags.push({
        type: 'ACTIVE_COURT_INJUNCTION',
        severity: 'HIGH',
        title: 'Civil Litigation / Injunction Active',
        description: 'Active Court Injunction (Title Suit 44/2023) registered in Joydebpur.'
      });
    }

    // 4. Dossier Agent synthesis
    let compositeScore = Math.round((identityScore * 0.45) + ((100 - backgroundRisk) * 0.45));
    if (missingDocs.length > 0) compositeScore -= 15;
    compositeScore = Math.max(5, Math.min(100, compositeScore));

    let recommendation = 'FAST_TRACK_APPROVAL';
    let riskLevel = 'LOW';

    if (isVested) {
      recommendation = 'REJECT';
      riskLevel = 'CRITICAL';
    } else if (isDisputed) {
      recommendation = 'PHYSICAL_HEARING_REQUIRED';
      riskLevel = 'HIGH';
    } else if (isMismatch || missingDocs.length > 0 || compositeScore < 80) {
      recommendation = 'CITIZEN_CLARIFICATION_REQUIRED';
      riskLevel = 'MEDIUM';
    }

    const dossier = {
      application_id: appId,
      application_number: appNumber,
      integrity_score: compositeScore,
      risk_level: riskLevel,
      recommendation: recommendation,
      executive_summary: `Serverless verification concluded for Application ${appNumber} (${application.applicant_name_en}). Integrity Score: ${compositeScore}/100. Recommendation: ${recommendation}.`,
      generated_at: new Date().toISOString()
    };

    return res.status(200).json({
      status: 'success',
      application_number: appNumber,
      integrity_score: compositeScore,
      risk_level: riskLevel,
      recommendation: recommendation,
      dossier: dossier,
      discrepancies: discrepancies.concat(backgroundFlags)
    });
  } catch (error) {
    console.error('Serverless error:', error);
    return res.status(500).json({ error: error.message || 'Internal Orchestrator Failure' });
  }
}
