/**
 * OpenRouter Integration for AI Model Access
 * 
 * SECURITY ARCHITECTURE:
 * =====================
 * 
 * This implementation uses a BYOK (Bring Your Own Key) pattern where users
 * provide their own OpenRouter API key. The key is stored encrypted in the
 * browser's localStorage.
 * 
 * SECURITY CONSIDERATIONS:
 * ------------------------
 * 
 * 1. CLIENT-SIDE LIMITATIONS:
 *    - API keys stored in browser are accessible via DevTools
 *    - No true security without a backend proxy
 *    - Suitable for personal use, NOT for multi-tenant SaaS
 * 
 * 2. PRODUCTION RECOMMENDATIONS:
 *    a) Backend Proxy (Most Secure):
 *       - Client → Your Server → OpenRouter
 *       - API key stored server-side only
 *       - Add rate limiting, user authentication, usage tracking
 *    
 *    b) Edge Functions (Vercel/Cloudflare Workers):
 *       - Serverless proxy with API key in environment variables
 *       - Low latency, scalable
 *       - Still requires authentication layer
 *    
 *    c) Hybrid Approach:
 *       - Free tier: BYOK (user's own key)
 *       - Premium tier: Backend proxy with included API access
 *       - Enterprise: Dedicated API keys with usage limits
 * 
 * 3. CURRENT IMPLEMENTATION:
 *    - BYOK pattern for all users
 *    - Base64 encoding (NOT encryption) for demo purposes
 *    - Clear user warnings about key security
 *    - Option to upgrade to backend-proxied access
 * 
 * 4. FUTURE ENHANCEMENTS:
 *    - Add Web Crypto API for proper AES encryption
 *    - Implement backend proxy for premium users
 *    - Add usage tracking and rate limiting
 *    - Support for multiple AI providers (not just OpenRouter)
 */

import { getApiKey } from '../context/UserContext';

export interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenRouterResponse {
  id: string;
  choices: {
    message: {
      role: string;
      content: string;
    };
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Available models via OpenRouter
export const OPENROUTER_MODELS = {
  'google/gemini-flash-1.5': {
    name: 'Gemini 1.5 Flash',
    provider: 'Google',
    description: 'Fast, cost-effective, good for most tasks',
    contextWindow: '1M tokens',
    costPer1kTokens: '$0.0001',
    recommended: true
  },
  'deepseek/deepseek-chat': {
    name: 'DeepSeek V3',
    provider: 'DeepSeek',
    description: 'Strong reasoning, excellent for analysis',
    contextWindow: '64K tokens',
    costPer1kTokens: '$0.00014',
    recommended: true
  },
  'openai/gpt-4o-mini': {
    name: 'GPT-4o Mini',
    provider: 'OpenAI',
    description: 'Balanced performance and cost',
    contextWindow: '128K tokens',
    costPer1kTokens: '$0.00015',
    recommended: false
  },
  'anthropic/claude-3.5-sonnet': {
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    description: 'Excellent for complex analysis',
    contextWindow: '200K tokens',
    costPer1kTokens: '$0.003',
    recommended: false
  },
  'meta-llama/llama-3.1-70b-instruct': {
    name: 'Llama 3.1 70B',
    provider: 'Meta',
    description: 'Open source, good performance',
    contextWindow: '128K tokens',
    costPer1kTokens: '$0.0004',
    recommended: false
  }
} as const;

export type OpenRouterModel = keyof typeof OPENROUTER_MODELS;

/**
 * Call OpenRouter API with the user's API key
 * 
 * @param model - The model ID to use
 * @param messages - Array of messages for the conversation
 * @param options - Additional options (temperature, max_tokens, etc.)
 * @returns The AI response
 * 
 * SECURITY NOTE:
 * This function retrieves the API key from localStorage.
 * In production, this should be replaced with a backend proxy.
 */
export async function callOpenRouter(
  model: OpenRouterModel,
  messages: OpenRouterMessage[],
  options: {
    temperature?: number;
    max_tokens?: number;
    stream?: boolean;
  } = {}
): Promise<OpenRouterResponse> {
  const apiKey = await getApiKey('openrouter');
  
  if (!apiKey) {
    throw new Error(
      'OpenRouter API key not found. Please add your API key in Settings.'
    );
  }

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin, // Required by OpenRouter
      'X-Title': 'CMP Generator' // Optional: identifies your app
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.max_tokens ?? 4000,
      stream: options.stream ?? false
    })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    
    if (response.status === 401) {
      throw new Error(
        'Invalid API key. Please check your OpenRouter API key in Settings.'
      );
    }
    
    if (response.status === 429) {
      throw new Error(
        'Rate limit exceeded. Please wait a moment and try again.'
      );
    }
    
    throw new Error(
      error.error?.message || `OpenRouter API error: ${response.status}`
    );
  }

  return await response.json();
}

/**
 * Analyse a contract using OpenRouter
 * 
 * @param contractText - The contract text to analyse
 * @param model - The model to use
 * @returns Analysis results
 */
export async function analyseContractWithOpenRouter(
  contractText: string,
  model: OpenRouterModel = 'google/gemini-flash-1.5'
): Promise<string> {
  const systemPrompt = `You are an expert UK government contract manager with deep knowledge of:
- Procurement Act 2023 (PA23)
- Government Commercial Function (GCF) standards
- Contract management best practices
- Risk management frameworks
- Performance monitoring

Your task is to analyse contracts and generate comprehensive Contract Management Plans (CMPs) that are fully compliant with PA23 and aligned with GCF guidelines.

When analysing a contract:
1. Identify key terms, obligations, and risks
2. Extract critical dates, milestones, and deliverables
3. Assess compliance with PA23 requirements
4. Recommend governance structures
5. Identify performance metrics and KPIs
6. Highlight potential risks and mitigation strategies

Be thorough, professional, and specific to UK government context.`;

  const userPrompt = `Please analyse the following contract and provide a comprehensive summary including:

1. Contract Overview (type, value, duration, key parties)
2. Key Obligations and Deliverables
3. Critical Dates and Milestones
4. Payment Terms and Financial Arrangements
5. Performance Requirements and KPIs
6. Risk Assessment (top 5 risks with mitigation strategies)
7. Governance Recommendations
8. PA23 Compliance Notes
9. Areas Requiring Further Clarification

Contract text:
${contractText}`;

  const response = await callOpenRouter(model, [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ], {
    temperature: 0.3, // Lower temperature for more consistent analysis
    max_tokens: 4000
  });

  return response.choices[0]?.message?.content || 'No response received';
}

/**
 * Generate a specific CMP section using OpenRouter
 */
export async function generateCMPSection(
  sectionTitle: string,
  contractText: string,
  model: OpenRouterModel = 'google/gemini-flash-1.5'
): Promise<string> {
  const systemPrompt = `You are generating a specific section of a Contract Management Plan (CMP) for UK government. Ensure compliance with PA23 and GCF standards. Be specific, actionable, and professional.`;

  const userPrompt = `Generate the "${sectionTitle}" section for the following contract. Include:
- Specific details extracted from the contract
- PA23 references where applicable
- GCF alignment notes
- Actionable recommendations
- Clear structure with headings and bullet points

Contract:
${contractText}`;

  const response = await callOpenRouter(model, [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ], {
    temperature: 0.5,
    max_tokens: 3000
  });

  return response.choices[0]?.message?.content || 'No response received';
}

/**
 * Ask a question about the contract using OpenRouter
 */
export async function askAboutContract(
  question: string,
  contractText: string,
  model: OpenRouterModel = 'google/gemini-flash-1.5'
): Promise<string> {
  const systemPrompt = `You are a UK government contract management expert. Answer questions about contracts based on the provided contract text. Be specific and reference relevant sections when possible.`;

  const userPrompt = `Based on the following contract, please answer this question:

Question: ${question}

Contract:
${contractText}`;

  const response = await callOpenRouter(model, [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ], {
    temperature: 0.4,
    max_tokens: 2000
  });

  return response.choices[0]?.message?.content || 'No response received';
}

/**
 * Validate an OpenRouter API key
 */
export async function validateOpenRouterKey(apiKey: string): Promise<{
  valid: boolean;
  error?: string;
  usage?: {
    credits_used: number;
    credits_remaining: number;
  };
}> {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/auth/key', {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        return { valid: false, error: 'Invalid API key' };
      }
      return { valid: false, error: `API error: ${response.status}` };
    }

    const data = await response.json();
    return {
      valid: true,
      usage: data.data?.usage
    };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Failed to validate key'
    };
  }
}
