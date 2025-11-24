/**
 * MCP Action: List Profile Sections
 * Get an overview of available profile sections
 */

import { getProfileOverview } from "@/lib/rag";
import { MCPToolResult } from "@/lib/types";

export async function handleListProfileSections(): Promise<MCPToolResult> {
  try {
    const sections = await getProfileOverview();

    if (sections.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: "No profile sections available.",
          },
        ],
        isError: false,
      };
    }

    // Format sections
    const formattedSections = sections
      .map(
        (section) =>
          `• **${section.name}** (${section.type})\n  ${section.description}`
      )
      .join("\n\n");

    const responseText = `My profile contains the following sections:\n\n${formattedSections}\n\nYou can ask me about any of these areas!`;

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
          text: `Error retrieving profile sections: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}
