// ==============================================================================
// TerraAgent Bangla-English Phonetic & Orthographic Name Matcher
// Handles Bangladeshi naming conventions, prefix variations, and phonetic transliteration
// ==============================================================================

/**
 * Standardize common honorifics, titles, and affixes in English and Bengali
 */
export function normalizeName(name = '', lang = 'en') {
  if (!name) return '';
  let str = name.trim().toLowerCase();

  if (lang === 'en') {
    // Expand or standardize abbreviations and prefixes
    str = str
      .replace(/\bmd\.?\b/g, 'mohammad')
      .replace(/\bmohd\.?\b/g, 'mohammad')
      .replace(/\bmohammed\b/g, 'mohammad')
      .replace(/\bmost\b/g, 'mostammat')
      .replace(/\bmst\.?\b/g, 'mostammat')
      .replace(/\bchoudhury\b/g, 'chowdhury')
      .replace(/\bchoudhary\b/g, 'chowdhury')
      .replace(/[-_.]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Standardize common phonetic digraphs in Bangladeshi transliterations
    str = str
      .replace(/ee/g, 'i')
      .replace(/oo/g, 'u')
      .replace(/ph/g, 'f')
      .replace(/ck/g, 'k')
      .replace(/ahmad/g, 'ahmed')
      .replace(/hossain/g, 'hussain')
      .replace(/anwar/g, 'anowar');
  } else if (lang === 'bn') {
    // Normalize Bengali unicode variations
    str = str
      .replace(/মো[:\.\s]*/g, 'মোহাম্মদ ')
      .replace(/মোঃ/g, 'মোহাম্মদ')
      .replace(/মোসাম্মৎ|মোছা[:\.\s]*/g, 'মোসাম্মাৎ ')
      .replace(/আহমদ/g, 'আহমেদ')
      .replace(/আনোয়ার/g, 'আনোয়ার')
      .replace(/হোসন/g, 'হোসেন')
      .replace(/[\u200B-\u200D\uFEFF]/g, '') // remove zero width joiners
      .replace(/\s+/g, ' ')
      .trim();
  }

  return str;
}

/**
 * Calculate Levenshtein Distance
 */
export function levenshteinDistance(s1 = '', s2 = '') {
  const m = s1.length;
  const n = s2.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j],    // deletion
          dp[i][j - 1],    // insertion
          dp[i - 1][j - 1] // substitution
        );
      }
    }
  }

  return dp[m][n];
}

/**
 * Calculate similarity ratio (0.0 to 1.0)
 */
export function calculateSimilarity(s1 = '', s2 = '', lang = 'en') {
  const rawClean1 = s1.trim().toLowerCase().replace(/[-_.]+/g, ' ');
  const rawClean2 = s2.trim().toLowerCase().replace(/[-_.]+/g, ' ');
  if (rawClean1 === rawClean2) return 1.0;

  const norm1 = normalizeName(s1, lang);
  const norm2 = normalizeName(s2, lang);

  if (norm1 === norm2) return 1.0;
  if (!norm1 || !norm2) return 0.0;

  const maxLen = Math.max(norm1.length, norm2.length);
  const dist = levenshteinDistance(norm1, norm2);
  const score = Math.max(0, (maxLen - dist) / maxLen);

  // Check token set intersection for order-invariant matching
  const tokens1 = new Set(norm1.split(' ').filter(Boolean));
  const tokens2 = new Set(norm2.split(' ').filter(Boolean));
  let common = 0;
  tokens1.forEach(t => { if (tokens2.has(t)) common++; });
  const tokenJaccard = common / Math.max(tokens1.size, tokens2.size);

  return Math.max(score, tokenJaccard);
}

/**
 * Detect specific linguistic and orthographic discrepancies
 */
export function analyzeNameDiscrepancies(appliedEn, appliedBn, recordEn, recordBn) {
  const findings = [];
  const enScore = calculateSimilarity(appliedEn, recordEn, 'en');
  const bnScore = calculateSimilarity(appliedBn, recordBn, 'bn');

  // English Name Analysis
  const rawEn1 = appliedEn.trim().toLowerCase();
  const rawEn2 = recordEn.trim().toLowerCase();
  if (rawEn1 !== rawEn2) {
    if (enScore >= 0.85) {
      findings.push({
        type: 'MINOR_SPELLING_VARIATION',
        severity: 'LOW',
        field: 'English Name',
        applied: appliedEn,
        record: recordEn,
        similarity: Math.round(enScore * 100),
        explanation: `Phonetic transliteration difference between "${appliedEn}" and registered "${recordEn}". Likely minor English romanization divergence.`
      });
    } else {
      findings.push({
        type: 'SIGNIFICANT_NAME_MISMATCH',
        severity: 'HIGH',
        field: 'English Name',
        applied: appliedEn,
        record: recordEn,
        similarity: Math.round(enScore * 100),
        explanation: `Substantial divergence between applied "${appliedEn}" and official registry "${recordEn}". Requires citizen clarification.`
      });
    }
  }

  // Bangla Name Analysis
  const rawBn1 = appliedBn.trim();
  const rawBn2 = recordBn.trim();
  if (rawBn1 !== rawBn2) {
    if (bnScore >= 0.88) {
      findings.push({
        type: 'BANGLA_ORTHOGRAPHIC_VARIATION',
        severity: 'LOW',
        field: 'Bangla Name',
        applied: appliedBn,
        record: recordBn,
        similarity: Math.round(bnScore * 100),
        explanation: `Bengali glyph variation detected (e.g. য়/য or honorific prefix মো/মোহাম্মদ). Phonetically equivalent.`
      });
    } else {
      findings.push({
        type: 'BANGLA_NAME_MISMATCH',
        severity: 'HIGH',
        field: 'Bangla Name',
        applied: appliedBn,
        record: recordBn,
        similarity: Math.round(bnScore * 100),
        explanation: `Bangla spelling mismatch between "${appliedBn}" and official "${recordBn}".`
      });
    }
  }

  return {
    enScore: Math.round(enScore * 100),
    bnScore: Math.round(bnScore * 100),
    overallConfidence: Math.round(((enScore + bnScore) / 2) * 100),
    findings
  };
}
