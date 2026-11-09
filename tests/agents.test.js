import assert from 'node:assert';

// Polyfill localStorage if running in pure node environment
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (k) => store.get(k) || null,
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear()
  };
}

import { PRESET_APPLICATIONS } from '../src/data/presetApplications.js';
import { runIntakeAgent } from '../src/services/intakeAgent.js';
import { runIdentityAgent } from '../src/services/identityAgent.js';
import { runBackgroundAgent } from '../src/services/backgroundAgent.js';
import { runDossierAgent } from '../src/services/dossierAgent.js';

console.log('--- Running Multi-Agent Core Engine Tests ---');

async function testPipeline() {
  // Test Case 1: Clean Application (Sabid)
  const cleanApp = {
    ...PRESET_APPLICATIONS[0].data,
    id: 'test-app-001',
    application_number: 'TERRA-TEST-001'
  };

  console.log('Testing Intake Agent on clean app...');
  const intakeResult = await runIntakeAgent(cleanApp);
  assert.strictEqual(intakeResult.status, 'complete');
  assert.strictEqual(intakeResult.missingDocs.length, 0);
  console.log('✓ Intake Agent: Ingestion complete & verified.');

  console.log('Testing Identity Agent on clean app...');
  const identityResult = await runIdentityAgent(cleanApp, intakeResult);
  assert.strictEqual(identityResult.status, 'verified');
  assert.strictEqual(identityResult.nidMatch, true);
  assert.strictEqual(identityResult.identityScore, 100);
  console.log('✓ Identity Agent: NID and bilingual names matched 100%.');

  console.log('Testing Background Agent on clean land plot...');
  const backgroundResult = await runBackgroundAgent(cleanApp, identityResult);
  assert.strictEqual(backgroundResult.status, 'clear');
  assert.strictEqual(backgroundResult.riskLevel, 'low');
  console.log('✓ Background Agent: Title clear, no encumbrances or arrears.');

  console.log('Testing Dossier Agent synthesis...');
  const dossierResult = await runDossierAgent(cleanApp, intakeResult, identityResult, backgroundResult);
  assert.strictEqual(dossierResult.recommendation, 'FAST_TRACK_APPROVAL');
  assert.ok(dossierResult.integrity_score >= 85);
  console.log(`✓ Dossier Agent: Integrity score ${dossierResult.integrity_score}/100, Verdict: ${dossierResult.recommendation}`);

  // Test Case 2: Injunction Disputed Land (Kazi Anowar)
  const disputedApp = {
    ...PRESET_APPLICATIONS[2].data,
    id: 'test-app-003',
    application_number: 'TERRA-TEST-003'
  };

  console.log('\nTesting Background Agent on disputed land (Court Injunction)...');
  const bgDispute = await runBackgroundAgent(disputedApp, null);
  assert.ok(bgDispute.flags.some(f => f.type === 'ACTIVE_COURT_INJUNCTION'));
  assert.ok(bgDispute.riskScore >= 60);
  console.log(`✓ Background Agent: Correctly flagged Title Suit injunction and set risk score to ${bgDispute.riskScore}`);

  const dossierDispute = await runDossierAgent(disputedApp, null, { identityScore: 90 }, bgDispute);
  assert.strictEqual(dossierDispute.recommendation, 'PHYSICAL_HEARING_REQUIRED');
  console.log('✓ Dossier Agent: Correctly escalated disputed land to PHYSICAL_HEARING_REQUIRED');

  console.log('\nAll Multi-Agent Engine tests passed successfully!\n');
}

testPipeline().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
