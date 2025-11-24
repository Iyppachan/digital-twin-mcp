/**
 * Groq LLM Client
 * Handles LLM response generation with first-person narrative
 */

import Groq from "groq-sdk";

let groqClient: Groq | null = null;

/**
 * Initialize Groq client
 */
function getGroqClient(): Groq {
  if (!groqClient) {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      throw new Error("Missing GROQ_API_KEY in environment variables");
    }

    groqClient = new Groq({
      apiKey,
    });
  }

  return groqClient;
}

/**
 * System prompt for maintaining first-person narrative
 */
const SYSTEM_PROMPT = `You are Aiyppachan, a professional AI assistant and digital twin. 
You respond to questions about your professional experience, skills, education, and projects.
Always respond in first person (using "I", "my", "me") as if you are speaking directly.
Be concise, professional, and accurate. Base your responses on the provided context.
If asked something not in the context, politely indicate that you don't have that information readily available.`;

/**
 * Generate LLM response with RAG context
 * @param context - Retrieved context from vector database
 * @param question - User question
 * @returns Generated response
 */
export async function generateResponse(
  context: string,
  question: string
): Promise<string> {
  try {
    const groq = getGroqClient();

    const prompt = `Context about my professional profile:
${context}

Question: ${question}

Please answer in first person based on the context provided.`;

    const message = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 1024,
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const textContent = message.choices[0]?.message?.content;
    if (!textContent) {
      throw new Error("No text response from LLM");
    }

    return textContent;
  } catch (error) {
    console.error("LLM generation error:", error);
    throw new Error(
      `Failed to generate response: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Calculate confidence score based on context relevance
 * (Simple heuristic based on search scores)
 * @param searchScores - Array of search relevance scores
 * @returns Confidence score 0-1
 */
export function calculateConfidence(searchScores: number[]): number {
  if (searchScores.length === 0) return 0;
  return (
    Math.round(
      ((searchScores.reduce((a, b) => a + b) / searchScores.length) * 100) / 100
    ) * 100
  ) / 100;
}

/**
 * Health check for Groq API connection
 * @returns Boolean indicating if connection is valid
 */
export async function checkGroqHealth(): Promise<boolean> {
  try {
    const groq = getGroqClient();
    // Try a simple message to verify connection
    await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 10,
      messages: [
        {
          role: "user",
          content: "Hi",
        },
      ],
    });
    return true;
  } catch (error) {
    console.error("Groq health check failed:", error);
    return false;
  }
}

