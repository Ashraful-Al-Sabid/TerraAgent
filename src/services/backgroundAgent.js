// ==============================================================================
// Agent 3: Background Agent
// Verifies land records, chain of title, encumbrances, court injunctions & tax status
// ==============================================================================

import { logAgentActivity } from '../lib/supabase.js';
import { SYNTHETIC_LAND_REGISTRY } from '../data/syntheticRegistry.js';

export async function runBackgroundAgent(application, identityResult, onProgress) {
  const appId = application.id;
  const updateProgress = (phase, msg) => {
    if (onProgress) onProgress({ agent: 'background', phase, msg });
  };

  await logAgentActivity(
    appId,
    'background',
    'INITIATION',
    'info',
    `Background Agent querying Directorate of Land Records & Surveys (DLRS) ledger for Khatian: ${application.khatian_number}, Plot: ${application.plot_number}, Mouza: ${application.mouza}.`
  );
  updateProgress('querying_dlrs', 'Interfacing with e-Khatian and Land Record Ledger...');

  // Search synthetic land registry
  const landRecord = SYNTHETIC_LAND_REGISTRY.find(
    r => (r.khatian_number === application.khatian_number && r.plot_number === application.plot_number) ||
         (r.district.toLowerCase() === (application.district || '').toLowerCase() && r.mouza.toLowerCase() === (application.mouza || '').toLowerCase())
  );

  const backgroundFlags = [];
  let riskScore = 0; // 0 to 100 (higher means riskier)

  if (!landRecord) {
    backgroundFlags.push({
      type: 'PLOT_RECORD_UNRESOLVED',
      severity: 'HIGH',
      title: 'Land Record Not Found in DLRS Digital Index',
      description: `No direct digital BS/RS ledger match for Plot ${application.plot_number}, Khatian ${application.khatian_number} in Mouza ${application.mouza}. Manual Kanungo verification required.`,
      recommended_action: 'Submit certified physical Porcha copy or verify JL Number and Mouza spelling.'
    });
    riskScore += 40;

    await logAgentActivity(
      appId,
      'background',
      'LEDGER_UNRESOLVED',
      'warning',
      `Land record unverified in immediate digital index. Requires manual field survey or archival review.`
    );
  } else {
    await logAgentActivity(
      appId,
      'background',
      'LEDGER_FOUND',
      'success',
      `Record resolved: ${landRecord.survey_type} Survey | Recorded Owner: ${landRecord.recorded_owner_en} | Area: ${landRecord.area_decimals} decimals`,
      { landRecord }
    );

    // Encumbrance & Legal Status Check
    updateProgress('encumbrance_audit', 'Conducting encumbrance, litigation, and vested property audit...');

    if (landRecord.encumbrance_status.includes('Vested Property') || landRecord.recorded_owner_en.includes('Government')) {
      backgroundFlags.push({
        type: 'CRITICAL_VESTED_PROPERTY',
        severity: 'CRITICAL',
        title: 'Prohibited: Vested / Government Khas Property',
        description: `Plot ${application.plot_number} is officially designated as "${landRecord.encumbrance_status}". Transfer or mutation is strictly prohibited by Land Administration Law.`,
        recommended_action: 'Application cannot proceed. Designated as State-owned property.'
      });
      riskScore += 90;

      await logAgentActivity(
        appId,
        'background',
        'CRITICAL_ENCUMBRANCE_FOUND',
        'error',
        `Violation: Plot is tagged as Vested Property / Khas Land. Mutation prohibited.`,
        { encumbrance: landRecord.encumbrance_status }
      );
    } else if (landRecord.encumbrance_status.includes('Court Injunction') || landRecord.encumbrance_status.includes('Title Suit')) {
      backgroundFlags.push({
        type: 'ACTIVE_COURT_INJUNCTION',
        severity: 'HIGH',
        title: 'Civil Litigation / Injunction Active',
        description: `A court injunction is recorded against this property: ${landRecord.encumbrance_status}. Mutation cannot take effect until title dispute is disposed.`,
        recommended_action: 'Must attend formal AC Land judicial hearing with court decree clearance.'
      });
      riskScore += 65;

      await logAgentActivity(
        appId,
        'background',
        'LITIGATION_ALERT',
        'warning',
        `Court Injunction identified: ${landRecord.encumbrance_status}. Flagged for officer review.`,
        { litigation: landRecord.encumbrance_status }
      );
    } else {
      await logAgentActivity(
        appId,
        'background',
        'ENCUMBRANCE_CLEAR',
        'success',
        `Encumbrance status: Clean title. No civil court caveats or government restrictions found.`
      );
    }

    // Tax Status Check (Dakhila)
    updateProgress('tax_audit', 'Verifying Land Development Tax (ভূমি উন্নয়ন কর) status...');
    const currentYear = 2026;
    if (landRecord.last_tax_year < currentYear - 2) {
      backgroundFlags.push({
        type: 'UNPAID_LAND_TAX',
        severity: 'MEDIUM',
        title: 'Overdue Land Development Tax (Dakhila)',
        description: `Land development tax has not been paid since ${landRecord.last_tax_year}. Arrears must be settled.`,
        recommended_action: 'Pay overdue Land Development Tax online via ldtax.gov.bd and attach latest Dakhila.'
      });
      riskScore += 20;

      await logAgentActivity(
        appId,
        'background',
        'TAX_ARREARS_DETECTED',
        'warning',
        `Tax arrears detected. Last paid fiscal year: ${landRecord.last_tax_year}.`
      );
    } else {
      await logAgentActivity(
        appId,
        'background',
        'TAX_UP_TO_DATE',
        'success',
        `Land tax up to date (Fiscal year ${landRecord.last_tax_year} verified).`
      );
    }

    // Land Area Consistency Check
    const requestedArea = parseFloat(application.land_area_decimals) || 0;
    if (requestedArea > landRecord.area_decimals) {
      backgroundFlags.push({
        type: 'AREA_EXCEEDS_RECORDED',
        severity: 'HIGH',
        title: 'Area Discrepancy: Requested Area Exceeds Registered Share',
        description: `Applied mutation area (${requestedArea} decimals) exceeds recorded parcel share (${landRecord.area_decimals} decimals).`,
        recommended_action: 'Revise application area or provide partition survey deed.'
      });
      riskScore += 30;

      await logAgentActivity(
        appId,
        'background',
        'AREA_OVERAGE_DETECTED',
        'warning',
        `Area discrepancy: Applied ${requestedArea} decimals > Registered ${landRecord.area_decimals} decimals.`
      );
    }
  }

  const finalRiskLevel = riskScore >= 70 ? 'critical' : riskScore >= 40 ? 'high' : riskScore >= 15 ? 'medium' : 'low';

  const result = {
    agent: 'background',
    status: backgroundFlags.length === 0 ? 'clear' : backgroundFlags.some(f => f.severity === 'CRITICAL') ? 'critical_violation' : 'encumbrances_found',
    riskScore,
    riskLevel: finalRiskLevel,
    landRecord: landRecord || null,
    flags: backgroundFlags,
    summary: backgroundFlags.length === 0
      ? `Background verification passed. Clear title, valid tax dakhila, no legal encumbrances.`
      : `Background verification completed with ${backgroundFlags.length} flag(s). Risk Level: ${finalRiskLevel.toUpperCase()}.`
  };

  updateProgress('completed', 'Background Agent finished record validation.');
  return result;
}
