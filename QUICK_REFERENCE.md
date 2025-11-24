# Digital Twin MCP Server - Quick Reference

## 🚀 Quick Commands

```bash
# Development
pnpm dev                    # Start dev server (http://localhost:3000)

# Production
pnpm build                  # Build for production
pnpm start                  # Start production server

# Testing
pnpm dev                    # Then visit http://localhost:3000/test

# Code Quality
pnpm lint                   # Run ESLint
pnpm tsc --noEmit          # Check TypeScript
```

## 📁 Key Files at a Glance

### Core Libraries
| File | Purpose | Key Export |
|------|---------|-----------|
| `lib/upstash.ts` | Vector search | `queryProfile()` |
| `lib/groq.ts` | LLM inference | `generateResponse()` |
| `lib/rag.ts` | RAG pipeline | `ragQuery()` |
| `lib/types.ts` | Type definitions | `RAGResponse` |
| `lib/constants.ts` | Configuration | `APP_CONFIG` |

### Actions
| File | Purpose | Export |
|------|---------|--------|
| `actions/ask-about-profile.ts` | Q&A action | `askAboutProfile()` |
| `actions/search-profile.ts` | Search action | `handleSearchProfile()` |
| `actions/list-profile-sections.ts` | List action | `handleListProfileSections()` |

### Pages
| File | Purpose | URL |
|------|---------|-----|
| `app/page.tsx` | Home page | `/` |
| `app/test/page.tsx` | System test | `/test` |

## 🔗 API Endpoints

### To Implement (Phase 6)
```typescript
// app/api/mcp/route.ts (create this)

POST /api/mcp
{
  "action": "ask-about-profile",
  "params": { "question": "What are your skills?" }
}

POST /api/mcp
{
  "action": "search-profile",
  "params": { "query": "projects", "category": "projects" }
}

POST /api/mcp
{
  "action": "list-profile-sections",
  "params": {}
}
```

## 🔍 RAG Pipeline Flow

```
User Question
    ↓
queryProfile() → Semantic Search (Top 3)
    ↓
formatContextForLLM() → Prepare Context
    ↓
generateResponse() → LLM Inference
    ↓
calculateConfidence() → Score Results
    ↓
RAGResponse { answer, confidence, sources }
```

## 🧩 Integration Points

### Vector Database
```typescript
import { queryProfile } from "@/lib/upstash";

const results = await queryProfile("question", 3);
// Returns: VectorSearchResult[]
```

### LLM Generation
```typescript
import { generateResponse } from "@/lib/groq";

const answer = await generateResponse(context, question);
// Returns: string (first-person response)
```

### Complete RAG
```typescript
import { ragQuery } from "@/lib/rag";

const result = await ragQuery(question);
// Returns: RAGResponse { answer, confidence, sources }
```

## 🔐 Environment Variables

```env
UPSTASH_VECTOR_REST_URL=https://amusing-angelfish-41865-us1-vector.upstash.io
UPSTASH_VECTOR_REST_TOKEN=ABttCVJmNTQ5YzQyODItMDg0Yi00ODI0LWI5ZjAtNzFkYjZmOTI5YjZiMjE1ZTIwNzEwZTQ3NDZlYmZkYzk4MWRhNGJmODczZTE=
GROQ_API_KEY=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
NODE_ENV=development
```

## 📊 Response Format

### RAG Response
```json
{
  "answer": "I have extensive experience with...",
  "confidence": 0.85,
  "sources": [
    {
      "title": "Technical Skills",
      "content": "...",
      "score": 0.87,
      "metadata": { "category": "skills", "tags": [...] }
    }
  ]
}
```

### MCP Tool Result
```json
{
  "content": [
    {
      "type": "text",
      "text": "Response text here"
    }
  ],
  "isError": false
}
```

## 🧪 Testing

### Option 1: Test Page
```bash
pnpm dev
# Visit: http://localhost:3000/test
```

### Option 2: Direct Import
```typescript
// In any server component or API route
import { ragQuery } from "@/lib/rag";

const result = await ragQuery("What are your projects?");
console.log(result.answer);
```

### Option 3: Health Checks
```typescript
import { checkVectorDatabaseHealth } from "@/lib/upstash";
import { checkGroqHealth } from "@/lib/groq";

const vectorOK = await checkVectorDatabaseHealth();
const groqOK = await checkGroqHealth();
```

## 🛠️ Common Tasks

### Add New MCP Action
1. Create `actions/my-action.ts`
2. Export async function returning `MCPToolResult`
3. Add to `lib/constants.ts` MCP_TOOLS array
4. Handle in `app/api/mcp/route.ts`

### Modify Search Behavior
1. Edit `lib/rag.ts` - `ragQuery()` function
2. Adjust `topK` parameter (currently 3)
3. Modify confidence threshold
4. Rebuild and test

### Customize LLM Response
1. Edit `lib/groq.ts` - `SYSTEM_PROMPT`
2. Adjust prompt tone/style
3. Change model if needed (currently llama-3.3-70b-versatile)
4. Rebuild and test

### Add Caching (Future)
1. Import `@vercel/kv` (Redis)
2. Wrap `queryProfile()` with cache check
3. Set TTL for cache entries
4. Monitor cache hit rate

## 📈 Performance Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Vector Query | < 500ms | TBD |
| LLM Generation | < 2s | TBD |
| Total RAG | < 3s | TBD |
| Confidence Score | > 0.7 | TBD |

## 🐛 Common Issues & Fixes

| Issue | Cause | Solution |
|-------|-------|----------|
| ENOTFOUND | Network/DNS | Check connectivity, verify URL |
| Missing API Key | .env.local not loaded | Restart server, check env file |
| Type Error | Outdated SDK | Run `pnpm update` |
| 500 Error | Vector/LLM down | Check service status |
| Slow Response | Rate limited | Check API quota |

## 📚 Documentation Files

- **agents.md** - Project specification & architecture
- **SETUP_GUIDE.md** - Detailed setup & implementation guide
- **IMPLEMENTATION_CHECKLIST.md** - Phase-by-phase progress
- **This file** - Quick reference guide

## 🎯 Deployment Steps

1. **Build**: `pnpm run build`
2. **Vercel**: `vercel deploy` (or use GitHub integration)
3. **Environment**: Set variables in Vercel dashboard
4. **Test**: Verify at https://your-domain.vercel.app/test
5. **Claude**: Update config with production URL

## 🔗 Useful Links

- [Next.js Docs](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Upstash Docs](https://upstash.com/docs)
- [Groq API Docs](https://groq.com/docs)
- [MCP Protocol](https://modelcontextprotocol.io)

## ✅ Verification Checklist

Before deployment:
- [ ] `pnpm run build` succeeds
- [ ] `pnpm lint` shows no errors
- [ ] Test page loads at http://localhost:3000/test
- [ ] Vector DB shows ✅
- [ ] Groq API shows ✅
- [ ] Sample query returns response
- [ ] All .ts files have no type errors
- [ ] Environment variables configured

## 📞 Next Steps

1. **Test locally**: `pnpm dev` → visit `/test`
2. **Verify connectivity**: Check Vector DB and Groq status
3. **Build MCP handler**: Create `app/api/mcp/route.ts`
4. **Deploy**: `vercel deploy`
5. **Integrate Claude**: Update config and test

---

**Status**: ✅ Ready to Use
**Last Updated**: November 22, 2024
**Version**: 1.0.0
