# Digital Twin MCP Server

## Project Overview

An MCP (Model Context Protocol) server that exposes a Digital Twin AI assistant to Claude Desktop. The server integrates with Upstash Vector for semantic search and Groq API for LLM-powered responses.

## Architecture

```
Claude Desktop
      ↓
MCP Server (Next.js)
      ├── /actions (MCP Server Actions)
      ├── /lib
      │   ├── upstash.ts (Vector search)
      │   ├── groq.ts (LLM inference)
      │   └── mcp-server.ts (MCP protocol)
      └── /public (Assets)
```

## Technology Stack

- **Framework**: Next.js 16.0.3 with TypeScript
- **Package Manager**: pnpm
- **Vector Database**: Upstash Vector (TypeScript SDK)
- **LLM**: Groq API (llama-3.3-70b-versatile)
- **UI**: ShadCN components (optional for future dashboard)
- **Protocol**: MCP (Model Context Protocol)

## MCP Actions

### 1. `ask-about-profile` Action
Query the digital twin about professional profile information.

**Input:**
- `question` (string): User question about profile

**Output:**
- `answer` (string): First-person response from digital twin
- `confidence` (number): Relevance score (0-1)
- `sources` (array): Retrieved chunks used

**Example:**
```
Input: "What are your key technical skills?"
Output: "I have strong expertise in Python, distributed systems, and AI/ML..."
```

### 2. `search-profile` Action
Search for specific information within the profile.

**Input:**
- `query` (string): Search keywords
- `category` (optional): Filter by category (skills, projects, education, etc.)

**Output:**
- `results` (array): Matching content chunks with relevance scores
- `count` (number): Number of results

### 3. `list-profile-sections` Action
Get an overview of available profile sections.

**Output:**
- `sections` (array): Available content categories with descriptions

## Implementation Plan

### Phase 1: Project Setup ✅
- [x] Initialize Next.js 16.0.3 with TypeScript
- [x] Configure Tailwind CSS and PostCSS
- [ ] Install MCP SDK dependencies
- [ ] Add environment variables configuration

### Phase 2: Vector Database Integration
- [ ] Install `@upstash/vector` package
- [ ] Create `lib/upstash.ts` with query functionality
- [ ] Implement metadata extraction from vectors
- [ ] Add caching for performance

### Phase 3: LLM Integration
- [ ] Install `groq-sdk` package
- [ ] Create `lib/groq.ts` with response generation
- [ ] Implement prompt engineering for first-person narrative
- [ ] Add streaming response support

### Phase 4: MCP Server Implementation
- [ ] Install MCP SDK (`@modelcontextprotocol/sdk`)
- [ ] Create server initialization in `lib/mcp-server.ts`
- [ ] Implement all three actions
- [ ] Add error handling and logging

### Phase 5: Testing & Deployment
- [ ] Test locally with Claude Desktop
- [ ] Verify all actions work correctly
- [ ] Performance optimization
- [ ] Deploy to production

## File Structure

```
mydigitaltwin/
├── app/
│   ├── api/
│   │   └── mcp/
│   │       └── route.ts          (MCP protocol handler)
│   ├── layout.tsx                 (Root layout)
│   ├── page.tsx                   (Dashboard - optional)
│   └── globals.css
├── lib/
│   ├── mcp-server.ts             (MCP server logic)
│   ├── upstash.ts                (Vector database client)
│   ├── groq.ts                   (LLM client)
│   ├── constants.ts              (Configuration)
│   └── types.ts                  (TypeScript types)
├── actions/
│   ├── ask-about-profile.ts
│   ├── search-profile.ts
│   └── list-profile-sections.ts
├── .env.local                     (Environment variables)
├── package.json
├── tsconfig.json
└── next.config.ts
```

## Environment Variables

```
UPSTASH_VECTOR_REST_URL=<url>
UPSTASH_VECTOR_REST_TOKEN=<token>
GROQ_API_KEY=<key>
NODE_ENV=production
```

## Integration Points

### Reference: Roll Dice MCP Server Pattern
```typescript
// Server initialization
const server = new Server({
  name: "digital-twin",
  version: "1.0.0"
});

// Action registration
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  switch(name) {
    case 'ask-about-profile':
      return await askAboutProfile(args.question);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});
```

### Reference: Binal Digital Twin (Python Implementation)
The current Python implementation provides the reference logic:
- **Query Format**: Semantic search over 22 content chunks
- **Retrieval**: Top-3 results (cosine similarity)
- **Response Generation**: Context + question → LLM → first-person answer
- **Metadata**: Title, type, category, tags for each chunk

## Setup Instructions

### 1. Install Dependencies
```bash
pnpm add @upstash/vector groq-sdk @modelcontextprotocol/sdk
pnpm add -D @types/node @types/react
```

### 2. Configure Environment
Create `.env.local`:
```
UPSTASH_VECTOR_REST_URL=<your-upstash-url>
UPSTASH_VECTOR_REST_TOKEN=<your-upstash-token>
GROQ_API_KEY=<your-groq-key>
```

### 3. Implement Vector Client
See `lib/upstash.ts` implementation guide below

### 4. Implement LLM Client
See `lib/groq.ts` implementation guide below

### 5. Setup MCP Server
See `lib/mcp-server.ts` implementation guide below

### 6. Test Locally
```bash
pnpm dev
# Test with Claude Desktop MCP configuration
```

## Implementation Examples

### Upstash Vector Query (Python → TypeScript)
**Python (Reference):**
```python
results = index.query(data=question, top_k=3, include_metadata=True)
for result in results:
    metadata = result.metadata
    title = metadata.get('title')
    content = metadata.get('content')
```

**TypeScript (Implementation):**
```typescript
import { Index } from "@upstash/vector";

const index = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN,
});

async function queryProfile(question: string) {
  const results = await index.query(question, {
    topK: 3,
    includeMetadata: true,
  });
  
  return results.map(r => ({
    title: r.metadata?.title,
    content: r.metadata?.content,
    score: r.score,
  }));
}
```

### Groq LLM Response (Python → TypeScript)
**Python (Reference):**
```python
context = "\n\n".join(top_docs)
response = client.messages.create(
  model="llama-3.3-70b-versatile",
  messages=[{"role": "user", "content": prompt}],
)
```

**TypeScript (Implementation):**
```typescript
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function generateResponse(context: string, question: string) {
  const prompt = `You are Aiyppachan, a professional assistant...
  
Context:
${context}

Question: ${question}`;

  const message = await groq.messages.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });
  
  return message.content[0].type === "text" ? message.content[0].text : "";
}
```

## MCP Server Action Handler
**TypeScript (Implementation):**
```typescript
async function askAboutProfile(question: string) {
  try {
    // Query vector database
    const chunks = await queryProfile(question);
    const context = chunks.map(c => `${c.title}: ${c.content}`).join("\n\n");
    
    // Generate LLM response
    const answer = await generateResponse(context, question);
    
    return {
      content: [
        {
          type: "text",
          text: answer,
        },
      ],
      isError: false,
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
}
```

## Development Workflow

1. **Local Development**: `pnpm dev` (runs on http://localhost:3000)
2. **Testing Actions**: Use MCP test client or Claude Desktop
3. **Building**: `pnpm build`
4. **Production**: Deployed to Vercel or self-hosted server

## Deployment Options

1. **Vercel** (Recommended)
   - Zero-config Next.js deployment
   - Automatic CI/CD
   - Built-in observability

2. **Self-Hosted**
   - Docker containerization
   - Environment variable injection
   - Port configuration (default 3000)

3. **Claude Desktop Integration**
   - Add MCP server to Claude config
   - Point to deployed URL or local server
   - Test with sample queries

## Key Features

✅ **Semantic Search** - Query profile with natural language
✅ **First-Person Responses** - AI responds as "I" (Aiyppachan)
✅ **High Relevance** - Top-3 vector similarity search
✅ **Fast Inference** - Groq API for rapid LLM responses
✅ **Type-Safe** - Full TypeScript implementation
✅ **MCP Compatible** - Works with Claude Desktop and other MCP clients

## Success Criteria

- [x] Next.js project initialized
- [ ] All MCP actions fully functional
- [ ] Vector search returns relevant chunks
- [ ] LLM generates accurate responses
- [ ] Claude Desktop integration working
- [ ] Performance optimized (<2s response time)
- [ ] Error handling robust
- [ ] Code well-documented

## Resources

- [MCP Protocol Documentation](https://modelcontextprotocol.io)
- [Upstash Vector SDK](https://upstash.com/docs/vector/overall/getstarted)
- [Groq API Documentation](https://groq.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## Troubleshooting

### Issue: Vector queries return no results
- **Check**: Ensure vectors are indexed (run `embed_digitaltwin.py`)
- **Fix**: Verify Upstash credentials in `.env.local`

### Issue: LLM responses generic or off-topic
- **Check**: Verify context is being passed correctly
- **Fix**: Test Python RAG system first

### Issue: MCP server not connecting
- **Check**: Claude Desktop configuration
- **Fix**: Ensure server is running on correct port

## Next Steps

1. Install required packages
2. Set up Upstash TypeScript client
3. Implement Groq integration
4. Build MCP server actions
5. Test with Claude Desktop
6. Deploy to production
