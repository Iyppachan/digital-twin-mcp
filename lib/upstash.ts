/**
 * Upstash Vector Database Client
 * Handles semantic search over profile chunks
 */

import { Index } from "@upstash/vector";
import { VectorSearchResult } from "./types";

let vectorIndex: Index | null = null;

/**
 * Initialize Upstash Vector client
 */
function getVectorIndex(): Index {
  if (!vectorIndex) {
    const url = process.env.UPSTASH_VECTOR_REST_URL;
    const token = process.env.UPSTASH_VECTOR_REST_TOKEN;

    if (!url || !token) {
      throw new Error(
        "Missing Upstash Vector credentials. Set UPSTASH_VECTOR_REST_URL and UPSTASH_VECTOR_REST_TOKEN in .env.local"
      );
    }

    vectorIndex = new Index({
      url,
      token,
    });
  }

  return vectorIndex;
}

/**
 * Query the vector database for profile information
 * @param query - Natural language query
 * @param topK - Number of results to return (default: 3)
 * @returns Array of search results with metadata
 */
export async function queryProfile(
  query: string,
  topK: number = 3
): Promise<VectorSearchResult[]> {
  try {
    const index = getVectorIndex();

    const results = await index.query({
      data: query,
      topK,
      includeMetadata: true,
    });

    return results.map((result) => ({
      title: (result.metadata?.title as string) || "Information",
      content: (result.metadata?.content as string) || "",
      score: result.score || 0,
      metadata: result.metadata,
    }));
  } catch (error) {
    console.error("Vector search error:", error);
    throw new Error(
      `Failed to query profile: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Search profile by keywords with optional category filter
 * @param keywords - Search keywords
 * @param category - Optional category filter
 * @returns Filtered search results
 */
export async function searchProfileByKeywords(
  keywords: string,
  category?: string
): Promise<VectorSearchResult[]> {
  try {
    const results = await queryProfile(keywords, 5);

    if (category) {
      return results.filter((r) => r.metadata?.category === category);
    }

    return results;
  } catch (error) {
    console.error("Keyword search error:", error);
    throw error;
  }
}

/**
 * Get profile overview (all available sections)
 * Would require metadata aggregation from the profile JSON
 * This is a placeholder for future implementation
 */
export async function getProfileSections() {
  return [
    {
      name: "Introduction",
      type: "intro",
      description: "Professional summary and pitch",
    },
    {
      name: "Education",
      type: "education",
      description: "Academic background and certifications",
    },
    {
      name: "Experience",
      type: "experience",
      description: "Professional work history",
    },
    {
      name: "Technical Skills",
      type: "technical_skills",
      description: "Programming languages, frameworks, and tools",
    },
    {
      name: "Projects",
      type: "projects",
      description: "Notable projects and implementations",
    },
    {
      name: "Achievements",
      type: "achievements",
      description: "Awards, recognitions, and milestones",
    },
    {
      name: "Career Goals",
      type: "goals",
      description: "Professional aspirations and vision",
    },
    {
      name: "Interview Preparation",
      type: "interview_prep",
      description: "Behavioral and technical preparation",
    },
  ];
}

/**
 * Format search results into context string for LLM
 * @param results - Search results from vector database
 * @returns Formatted context string
 */
export function formatContextForLLM(results: VectorSearchResult[]): string {
  return results
    .map((result) => `${result.title}: ${result.content}`)
    .join("\n\n");
}

/**
 * Health check for vector database connection
 * @returns Boolean indicating if connection is valid
 */
export async function checkVectorDatabaseHealth(): Promise<boolean> {
  try {
    // Try a simple query to verify connection
    await queryProfile("test", 1);
    return true;
  } catch (error) {
    console.error("Vector database health check failed:", error);
    return false;
  }
}
