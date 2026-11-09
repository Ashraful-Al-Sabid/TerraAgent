import assert from 'node:assert';
import { normalizeName, calculateSimilarity, analyzeNameDiscrepancies } from '../src/lib/nameMatcher.js';

console.log('--- Running Name Matcher Tests ---');

// 1. Normalization test
const normEn1 = normalizeName('Md. Arifur Rahman', 'en');
const normEn2 = normalizeName('Mohammad Arifur Rahman', 'en');
assert.strictEqual(normEn1, 'mohammad arifur rahman');
assert.strictEqual(normEn2, 'mohammad arifur rahman');
console.log('✓ Normalization correctly handles Md. abbreviation');

// 2. Similarity test
const simExact = calculateSimilarity('Md. Arifur Rahman', 'Mohammad Arifur Rahman', 'en');
assert.strictEqual(simExact, 1.0);
console.log('✓ Exact semantic similarity calculated as 100%');

const simMinor = calculateSimilarity('Tanveer Ahmad', 'Tanvir Ahmed', 'en');
assert.ok(simMinor > 0.85, `Expected > 85%, got ${simMinor}`);
console.log(`✓ Minor vowel variant detected with high similarity: ${(simMinor * 100).toFixed(1)}%`);

// 3. Bangla Name Analysis
const banglaAnalysis = analyzeNameDiscrepancies(
  'Tanveer Ahmad Shanto',
  'তানভীর আহমেদ শান্ত',
  'Tanvir Ahmed Shanto',
  'তানভীর আহমেদ শান্ত'
);
assert.strictEqual(banglaAnalysis.bnScore, 100);
assert.ok(banglaAnalysis.findings.length > 0);
assert.strictEqual(banglaAnalysis.findings[0].type, 'MINOR_SPELLING_VARIATION');
console.log('✓ Bangla-English discrepancy correctly categorized as MINOR_SPELLING_VARIATION');

console.log('All Name Matcher tests passed successfully!\n');
