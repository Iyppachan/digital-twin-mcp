/**
 * MCP Action: Ask About Profile
 * Query the digital twin about professional information
 */

import { ragQuery } from "@/lib/rag";
import { MCPToolResult } from "@/lib/types";

export async function askAboutProfile(
  question: string
): Promise<MCPToolResult> {
  try {
    if (!question || question.trim().length === 0) {
      return {
        content: [
          {
            type: "text",
            text: "Please provide a question about my professional profile.",
          },
        ],
        isError: true,
      };
    }

    // Execute RAG pipeline
    const ragResponse = await ragQuery(question);

    // Format response
    const responseText = `${ragResponse.answer}\n\n[Confidence: ${(ragResponse.confidence * 100).toFixed(0)}%]`;

    return {
      content: [
        {
          type: "text",
          text: responseText,
        },
      ],
      isError: false,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return {
      content: [
        {
          type: "text",
          text: `Error processing query: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}
