// ==============================================================================
// Vercel Serverless Function: Synthetic Records Query Endpoint
// ==============================================================================

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { type, query } = req.query;

  return res.status(200).json({
    status: 'success',
    type: type || 'general',
    query: query || '',
    timestamp: new Date().toISOString()
  });
}
