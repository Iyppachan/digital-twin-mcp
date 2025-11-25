import { NextRequest, NextResponse } from 'next/server';
import { askAboutProfile } from '@/actions/ask-about-profile';
import { handleSearchProfile } from '@/actions/search-profile';
import { handleListProfileSections } from '@/actions/list-profile-sections';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Handle different MCP methods
    switch (body.method) {
      case 'tools/list':
        return NextResponse.json({
          tools: [
            {
              name: 'askAboutProfile',
              description: 'Ask questions about Iyppachan Tom\'s professional profile',
              inputSchema: {
                type: 'object',
                properties: {
                  question: { type: 'string' }
                },
                required: ['question']
              }
            },
            {
              name: 'searchProfile',
              description: 'Search through professional profile',
              inputSchema: {
                type: 'object',
                properties: {
                  query: { type: 'string' }
                },
                required: ['query']
              }
            },
            {
              name: 'listProfileSections',
              description: 'List available profile sections',
              inputSchema: { type: 'object', properties: {} }
            }
          ]
        });
      
      case 'tools/call':
        const { name, arguments: args } = body.params;
        
        if (name === 'askAboutProfile') {
          const result = await askAboutProfile(args.question);
          return NextResponse.json({ content: [{ type: 'text', text: result }] });
        }
        
        if (name === 'searchProfile') {
          const result = await handleSearchProfile(args.query);
          return NextResponse.json({ content: [{ type: 'text', text: JSON.stringify(result) }] });
        }
        
        if (name === 'listProfileSections') {
          const result = await handleListProfileSections();
          return NextResponse.json({ content: [{ type: 'text', text: JSON.stringify(result) }] });
        }
        
        return NextResponse.json({ error: 'Unknown tool' }, { status: 400 });
      
      default:
        return NextResponse.json({ error: 'Unknown method' }, { status: 400 });
    }
  } catch (error) {
    console.error('MCP API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Digital Twin MCP Server',
    status: 'running' 
  });
}