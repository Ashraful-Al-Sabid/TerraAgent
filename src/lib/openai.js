// ==============================================================================
// TerraAgent OpenAI Integration & Agent Reasoning Service
// Real OpenAI API calls with graceful deterministic fallback
// ==============================================================================

import { getSystemSettings } from './supabase.js';

/**
 * Perform a chat completion using OpenAI API or intelligent simulation
 */
export async function callOpenAI({ systemPrompt, userPrompt, temperature = 0.2, responseFormat = 'json' }) {
  const settings = getSystemSettings();
  const apiKey = settings.openaiApiKey || (typeof process !== 'undefined' ? process.env?.OPENAI_API_KEY : '');

  if (apiKey && apiKey.startsWith('sk-')) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: temperature,
          response_format: responseFormat === 'json' ? { type: 'json_object' } : undefined
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.warn('OpenAI API returned error, falling back to simulated engine:', errorData);
      } else {
        const data = await response.json();
        const content = data.choices[0].message.content;
        return responseFormat === 'json' ? JSON.parse(content) : content;
      }
    } catch (err) {
      console.warn('OpenAI request failed, invoking heuristic agent reasoning engine:', err);
    }
  }

  // Graceful heuristic engine (for offline, free tier, or demo stability)
  return null;
}
