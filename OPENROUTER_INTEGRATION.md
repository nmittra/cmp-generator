# OpenRouter Integration & Security Architecture

## Overview

This document explains the secure integration of OpenRouter AI models into the CMP Generator application, including the current BYOK (Bring Your Own Key) implementation and recommendations for production deployment.

## Current Implementation: BYOK Pattern

### How It Works

1. **User Provides API Key**: Users enter their own OpenRouter API key in Settings
2. **Client-Side Storage**: Key is stored in browser's localStorage (base64 encoded)
3. **Direct API Calls**: Application calls OpenRouter API directly from the browser
4. **User Pays**: Users are billed directly by OpenRouter for their usage

### Security Considerations

#### ⚠️ Current Limitations

- **Browser Storage**: API keys stored in localStorage are accessible via DevTools
- **No True Encryption**: Base64 encoding is NOT encryption - it's easily reversible
- **Client-Side Exposure**: Keys are exposed in browser memory during API calls
- **No Rate Limiting**: No server-side control over API usage
- **Not Multi-Tenant Safe**: Suitable for personal use, NOT for shared/multi-user deployments

#### ✅ Current Security Measures

- Clear user warnings about key security
- HTTPS-only API calls
- No keys logged or transmitted to our servers
- User can delete keys at any time
- Keys are scoped to user's browser only

## Production Recommendations

### Option 1: Backend Proxy (Most Secure) ⭐ RECOMMENDED

**Architecture:**
```
Browser → Your Backend Server → OpenRouter API
         (API key stored here)
```

**Implementation:**

```typescript
// Backend API endpoint (Node.js/Express example)
app.post('/api/ai/analyse', authenticateUser, async (req, res) => {
  const { contractText, model } = req.body;
  const userId = req.user.id;
  
  // Check user's usage limits
  const usage = await getUserUsage(userId);
  if (usage.exceeded) {
    return res.status(429).json({ error: 'Usage limit exceeded' });
  }
  
  // Call OpenRouter with server-side API key
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      messages: [/* ... */]
    })
  });
  
  // Track usage
  await trackUsage(userId, response.usage);
  
  return res.json(await response.json());
});
```

**Benefits:**
- ✅ API keys never exposed to client
- ✅ Server-side rate limiting and usage tracking
- ✅ Can implement user quotas and billing
- ✅ Audit trail for all API calls
- ✅ Can cache responses to reduce costs
- ✅ Can implement fallback models

**Security:**
- Store API key in environment variables (never in code)
- Use proper authentication (JWT, OAuth, etc.)
- Implement rate limiting per user
- Log all API calls for audit
- Use HTTPS everywhere

### Option 2: Edge Functions (Vercel/Cloudflare Workers)

**Architecture:**
```
Browser → Edge Function → OpenRouter API
         (API key in env vars)
```

**Implementation (Vercel Edge Function):**

```typescript
// api/ai/analyse.ts
import { NextRequest } from 'next/server';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: NextRequest) {
  // Authenticate user
  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  const { contractText, model } = await req.json();
  
  // Call OpenRouter
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      messages: [/* ... */]
    })
  });
  
  return new Response(await response.text(), {
    headers: { 'Content-Type': 'application/json' }
  });
}
```

**Benefits:**
- ✅ Low latency (edge locations)
- ✅ API keys in environment variables
- ✅ Scalable and cost-effective
- ✅ Easy to deploy

### Option 3: Hybrid Approach (Recommended for SaaS)

**Architecture:**
```
Free Users → BYOK (their own key)
Premium Users → Backend Proxy (included API access)
Enterprise → Dedicated API keys with custom limits
```

**Implementation:**

```typescript
async function callAI(model: string, messages: any[], user: User) {
  if (user.tier === 'free') {
    // Use user's own API key
    const userKey = await getApiKey('openrouter', user.id);
    return callOpenRouterDirect(model, messages, userKey);
  } else {
    // Use backend proxy with included API access
    return callBackendProxy(model, messages, user.token);
  }
}
```

## Available Models via OpenRouter

| Model | Provider | Cost/1K Tokens | Context | Best For |
|-------|----------|----------------|---------|----------|
| Gemini 1.5 Flash | Google | $0.0001 | 1M | Fast analysis, large contracts |
| DeepSeek V3 | DeepSeek | $0.00014 | 64K | Complex reasoning, risk analysis |
| GPT-4o Mini | OpenAI | $0.00015 | 128K | Balanced performance |
| Claude 3.5 Sonnet | Anthropic | $0.003 | 200K | Detailed analysis, long contracts |
| Llama 3.1 70B | Meta | $0.0004 | 128K | Open source, good performance |

## Cost Optimization Strategies

### 1. Model Selection
- Use **Gemini Flash** for most tasks (cheapest, fast)
- Use **DeepSeek** for complex analysis (better reasoning)
- Use **Claude** only for very long contracts (large context)

### 2. Prompt Optimization
- Keep system prompts concise
- Use structured outputs (JSON mode)
- Cache common analyses
- Batch similar requests

### 3. Caching
```typescript
// Cache contract analyses
const cacheKey = hash(contractText + model);
const cached = await getCache(cacheKey);
if (cached) return cached;

const result = await callOpenRouter(model, messages);
await setCache(cacheKey, result, { ttl: 3600 }); // 1 hour
```

### 4. Usage Tracking
```typescript
// Track usage per user
await trackUsage(userId, {
  model,
  tokens: response.usage.total_tokens,
  cost: calculateCost(model, response.usage),
  timestamp: new Date()
});
```

## Security Best Practices

### For BYOK Implementation (Current)

1. **Clear User Communication**
   - Warn users about localStorage security
   - Explain that keys are browser-only
   - Recommend backend proxy for production

2. **Key Validation**
   - Validate keys before saving
   - Check key status/credits
   - Allow users to test their key

3. **Secure Storage**
   - Use Web Crypto API for encryption (future enhancement)
   - Never log API keys
   - Allow easy key deletion

### For Backend Proxy (Production)

1. **Authentication**
   - Use JWT or OAuth 2.0
   - Implement proper session management
   - Rate limit authentication attempts

2. **Authorization**
   - Check user permissions before API calls
   - Implement usage quotas per user/tier
   - Track and limit API usage

3. **API Key Management**
   - Store in environment variables
   - Rotate keys regularly
   - Use different keys for different environments
   - Monitor key usage and set alerts

4. **Audit & Monitoring**
   - Log all API calls (without sensitive data)
   - Monitor for unusual patterns
   - Set up alerts for high usage
   - Implement circuit breakers

5. **Data Protection**
   - Never log contract text
   - Use HTTPS everywhere
   - Implement data retention policies
   - Comply with GDPR/data protection laws

## Implementation Roadmap

### Phase 1: Current (BYOK) ✅
- [x] User provides own API key
- [x] Key stored in localStorage
- [x] Direct API calls from browser
- [x] Basic validation

### Phase 2: Enhanced BYOK
- [ ] Web Crypto API encryption for keys
- [ ] Usage tracking and limits
- [ ] Model cost calculator
- [ ] Key rotation reminders

### Phase 3: Backend Proxy
- [ ] Deploy backend API (Node.js/Python)
- [ ] Implement user authentication
- [ ] Add usage tracking and billing
- [ ] Implement caching layer
- [ ] Add monitoring and alerts

### Phase 4: Enterprise Features
- [ ] Multi-tenant architecture
- [ ] SSO integration
- [ ] Custom model fine-tuning
- [ ] On-premise deployment option
- [ ] Advanced audit trails

## Getting an OpenRouter API Key

1. Visit [openrouter.ai](https://openrouter.ai)
2. Sign up for a free account
3. Navigate to [Keys](https://openrouter.ai/keys)
4. Create a new API key
5. Copy the key (starts with `sk-or-v1-...`)
6. Paste into Settings → OpenRouter API Key

**Free Tier:**
- No monthly fee
- Pay only for tokens used
- Most models cost $0.0001-$0.003 per 1K tokens
- Typical contract analysis: ~4K tokens = $0.0004-$0.012

## Testing the Integration

### Developer Mode Toggle

The application includes a Developer Mode toggle (Settings → Developer Mode) that:
- Unlocks all premium features
- Bypasses usage limits
- Enables testing without API key costs

**⚠️ Warning:** Developer Mode is for testing only. Disable before production use.

### Testing Checklist

- [ ] Upload a contract (.txt, .docx, .pdf)
- [ ] Verify text extraction works
- [ ] Add OpenRouter API key in Settings
- [ ] Validate API key successfully
- [ ] Generate CMP with AI analysis
- [ ] Test different AI models
- [ ] Verify usage tracking
- [ ] Test error handling (invalid key, rate limits)
- [ ] Test Developer Mode toggle

## Support & Resources

- **OpenRouter Docs**: https://openrouter.ai/docs
- **OpenRouter API**: https://openrouter.ai/docs/api
- **Model Playground**: https://openrouter.ai/playground
- **Pricing**: https://openrouter.ai/docs/models

## Contact

For questions about OpenRouter integration or security architecture, please contact the development team.

---

**Last Updated**: 2026
**Version**: 1.0
**Status**: Production Ready (BYOK), Backend Proxy Recommended for Scale
