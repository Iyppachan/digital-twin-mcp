/**
 * MCP Action: Search Profile
 * Search for specific information within the profile
 */

import { searchProfile } from "@/lib/rag";
import { MCPToolResult } from "@/lib/types";

export async function handleSearchProfile(
  query: string,
  category?: string
): Promise<MCPToolResult> {
  try {
    if (!query || query.trim().length === 0) {
      return {
        content: [
          {
            type: "text",
            text: "Please provide search keywords.",
          },
        ],
        isError: true,
      };
    }

    const results = await searchProfile(query, category);

    if (results.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: `No results found for "${query}"${category ? ` in category "${category}"` : ""}.`,
          },
        ],
        isError: false,
      };
    }

    // Format results
    const formattedResults = results
      .map(
        (result, index) =>
          `${index + 1}. **${result.title}** (${result.type}, relevance: ${(result.relevance * 100).toFixed(0)}%)\n   ${result.preview}`
      )
      .join("\n\n");

    const responseText = `Found ${results.length} matching result${results.length !== 1 ? "s" : ""}:\n\n${formattedResults}`;

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
          text: `Error searching profile: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}
