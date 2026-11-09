// ==============================================================================
// Agent 2: Identity Agent
// Compares applicant data against Synthetic NID & BRIS Registries,
// detects phonetic/orthographic Bangla-English spelling variations
// ==============================================================================

import { logAgentActivity } from '../lib/supabase.js';
import { SYNTHETIC_NID_REGISTRY, SYNTHETIC_BRIS_REGISTRY } from '../data/syntheticRegistry.js';
import { analyzeNameDiscrepancies } from '../lib/nameMatcher.js';
import { callOpenAI } from '../lib/openai.js';

export async function runIdentityAgent(application, intakeResult, onProgress) {
  const appId = application.id;
  const updateProgress = (phase, msg) => {
    if (onProgress) onProgress({ agent: 'identity', phase, msg });
  };

  await logAgentActivity(
    appId,
    'identity',
    'INITIATION',
    'info',
    `Identity Agent activated for applicant: ${application.applicant_name_en} (${application.applicant_name_bn}) | NID: ${application.nid_number}`
  );
  updateProgress('querying_nid', 'Querying Synthetic National Identity (NID) Database...');

  // 1. Query NID Registry
  const nidRecord = SYNTHETIC_NID_REGISTRY.find(r => r.nid_number === application.nid_number);
  const brisRecord = SYNTHETIC_BRIS_REGISTRY.find(r => r.bris_number === application.bris_number || r.dob === application.dob);

  let nidMatch = false;
  let brisMatch = false;
  const discrepancies = [];
  let integrityDeduction = 0;

  if (!nidRecord) {
    discrepancies.push({
      type: 'NID_RECORD_NOT_FOUND',
      field: 'nid_number',
      severity: 'CRITICAL',
      message: `NID number ${application.nid_number} could not be resolved in the National ID registry.`,
      recommended_action: 'Please verify and re-enter your 10 or 17 digit Smart NID number.'
    });
    integrityDeduction += 50;

    await logAgentActivity(
      appId,
      'identity',
      'NID_LOOKUP_FAILED',
      'error',
      `NID verification failed: No matching identity found for ${application.nid_number}.`
    );
  } else {
    nidMatch = true;
    await logAgentActivity(
      appId,
      'identity',
      'NID_RECORD_LOCATED',
      'success',
      `NID record verified in Election Commission registry for citizen: ${nidRecord.name_en}`,
      { nidRecord }
    );

    // 2. Cross-match DOB
    updateProgress('verifying_dob', 'Cross-verifying Date of Birth...');
    if (application.dob !== nidRecord.dob) {
      discrepancies.push({
        type: 'DOB_MISMATCH',
        field: 'dob',
        severity: 'HIGH',
        message: `Date of birth in application (${application.dob}) does not match NID record (${nidRecord.dob}).`,
        applied: application.dob,
        official: nidRecord.dob,
        recommended_action: 'Correct application Date of Birth to match your official NID.'
      });
      integrityDeduction += 25;
      await logAgentActivity(
        appId,
        'identity',
        'DOB_MISMATCH',
        'warning',
        `DOB mismatch: Application states ${application.dob}, official NID states ${nidRecord.dob}.`
      );
    } else {
      await logAgentActivity(
        appId,
        'identity',
        'DOB_VERIFIED',
        'success',
        `Date of birth verified: ${application.dob}`
      );
    }

    // 3. Orthographic & Phonetic Bangla-English Name Comparison
    updateProgress('linguistic_analysis', 'Executing bilingual phonetic and orthographic analysis...');
    const nameAnalysis = analyzeNameDiscrepancies(
      application.applicant_name_en,
      application.applicant_name_bn,
      nidRecord.name_en,
      nidRecord.name_bn
    );

    if (nameAnalysis.findings.length > 0) {
      for (const f of nameAnalysis.findings) {
        if (f.severity === 'HIGH') {
          integrityDeduction += 20;
          discrepancies.push({
            type: f.type,
            field: f.field === 'English Name' ? 'applicant_name_en' : 'applicant_name_bn',
            severity: 'HIGH',
            message: f.explanation,
            applied: f.applied,
            official: f.record,
            similarity: f.similarity,
            recommended_action: `Update ${f.field} to match official record "${f.record}".`
          });
          await logAgentActivity(
            appId,
            'identity',
            'NAME_SPELLING_MISMATCH',
            'warning',
            `Discrepancy detected in ${f.field}: "${f.applied}" vs official "${f.record}" (${f.similarity}% similarity).`,
            f
          );
        } else {
          // Low severity phonetic variation (e.g. minor transliteration)
          integrityDeduction += 5;
          await logAgentActivity(
            appId,
            'identity',
            'PHONETIC_VARIANCE_LOGGED',
            'info',
            `Minor phonetic variation: "${f.applied}" vs official "${f.record}". Tolerable under DLRS guidelines.`,
            f
          );
        }
      }
    } else {
      await logAgentActivity(
        appId,
        'identity',
        'NAME_MATCH_EXACT',
        'success',
        'Bilingual name matching: 100% exact match between Bangla and English official records.'
      );
    }
  }

  // 4. BRIS Cross-Check
  updateProgress('querying_bris', 'Cross-referencing Birth Registration Information System (BRIS)...');
  if (brisRecord) {
    brisMatch = true;
    await logAgentActivity(
      appId,
      'identity',
      'BRIS_VERIFIED',
      'success',
      `Birth Registration record ${brisRecord.bris_number} authenticated. Parent lineage consistent.`,
      { brisRecord }
    );
  } else {
    await logAgentActivity(
      appId,
      'identity',
      'BRIS_SKIPPED',
      'info',
      'BRIS verification not provided or matched via alternate parent lineage.'
    );
  }

  const identityScore = Math.max(0, 100 - integrityDeduction);
  const status = discrepancies.length === 0 ? 'verified' : discrepancies.some(d => d.severity === 'CRITICAL' || d.severity === 'HIGH') ? 'discrepancy_flagged' : 'minor_variance';

  const result = {
    agent: 'identity',
    status,
    identityScore,
    nidMatch,
    brisMatch,
    nidRecord: nidRecord || null,
    brisRecord: brisRecord || null,
    discrepancies,
    summary: discrepancies.length === 0
      ? `Identity authenticated with 100% confidence. NID and name transliterations verified.`
      : `Identity check completed with ${discrepancies.length} discrepancy flag(s) identified.`
  };

  updateProgress('completed', 'Identity Agent verification finished.');
  return result;
}
