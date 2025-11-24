/**
 * RAG (Retrieval-Augmented Generation) Orchestration
 * Coordinates vector search and LLM response generation
 */

import { queryProfile, formatContextForLLM, getProfileSections } from "./upstash";
import { generateResponse, calculateConfidence } from "./groq";
import { RAGResponse, ProfileSearchResult } from "./types";

/**
 * Main RAG pipeline: search + generate
 * @param question - User question
 * @returns RAG response with answer, confidence, and sources
 */
export async function ragQuery(question: string): Promise<RAGResponse> {
  try {
    // 1. Query vector database for relevant chunks
    const searchResults = await queryProfile(question, 3);

    if (searchResults.length === 0) {
      return {
        answer:
          "I don't have information about that in my profile. Feel free to ask me about my skills, projects, experience, education, or other aspects of my professional background.",
        confidence: 0,
        sources: [],
      };
    }

    // 2. Format context for LLM
    const context = formatContextForLLM(searchResults);

    // 3. Generate response with LLM
    const answer = await generateResponse(context, question);

    // 4. Calculate confidence based on search scores
    const scores = searchResults.map((r) => r.score);
    const confidence = calculateConfidence(scores);

    return {
      answer,
      confidence,
      sources: searchResults,
    };
  } catch (error) {
    console.error("RAG query error:", error);
    throw new Error(
      `Failed to process query: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Search profile with keyword filtering
 * @param query - Search query
 * @param category - Optional category filter
 * @returns Array of matching profile chunks
 */
export async function searchProfile(
  query: string,
  category?: string
): Promise<ProfileSearchResult[]> {
  try {
    const results = await queryProfile(query, 5);

    const filtered = category
      ? results.filter((r) => r.metadata?.category === category)
      : results;

    return filtered.map((result, index) => ({
      id: `${index}`,
      title: result.title,
      type: (typeof result.metadata?.type === "string" ? result.metadata.type : "unknown"),
      relevance: result.score,
      preview: result.content.substring(0, 150) + "...",
    }));
  } catch (error) {
    console.error("Profile search error:", error);
    throw error;
  }
}

/**
 * Get profile overview
 * @returns List of available profile sections
 */
export async function getProfileOverview() {
  try {
    return await getProfileSections();
  } catch (error) {
    console.error("Profile overview error:", error);
    throw error;
  }
}

/**
 * Multi-query RAG (ask follow-up questions in context)
 * @param questions - Array of sequential questions
 * @returns Array of RAG responses
 */
export async function multiQueryRAG(
  questions: string[]
): Promise<RAGResponse[]> {
  const results: RAGResponse[] = [];

  for (const question of questions) {
    const result = await ragQuery(question);
    results.push(result);
  }

  return results;
}
