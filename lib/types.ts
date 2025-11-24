/**
 * Type definitions for Digital Twin MCP Server
 */

export interface ProfileChunk {
  id: string;
  title: string;
  type: string;
  content: string;
  metadata?: {
    category?: string;
    tags?: string[];
  };
}

export interface VectorSearchResult {
  title: string;
  content: string;
  score: number;
  metadata?: Record<string, unknown>;
}

export interface RAGResponse {
  answer: string;
  confidence: number;
  sources: VectorSearchResult[];
}

export interface MCPToolResult {
  content: Array<{
    type: "text";
    text: string;
  }>;
  isError: boolean;
}

export interface ProfileSearchResult {
  id: string;
  title: string;
  type: string;
  relevance: number;
  preview: string;
}

export interface ProfileSection {
  name: string;
  type: string;
  description: string;
  count?: number;
}
