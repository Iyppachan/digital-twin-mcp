/**
 * Application Constants
 */

export const APP_CONFIG = {
  // Vector search configuration
  VECTOR_TOP_K: 3,
  MIN_CONFIDENCE_THRESHOLD: 0.5,

  // LLM configuration
  LLM_MODEL: "llama-3.3-70b-versatile",
  LLM_MAX_TOKENS: 1024,
  LLM_TEMPERATURE: 0.7,

  // Server configuration
  SERVER_NAME: "digital-twin",
  SERVER_VERSION: "1.0.0",

  // Profile name
  PROFILE_OWNER: "Aiyppachan",
};

export const PROFILE_CATEGORIES = [
  "intro",
  "education",
  "experience",
  "technical_skills",
  "projects",
  "achievements",
  "goals",
  "interview_prep",
];

export const MCP_TOOLS = [
  {
    name: "ask-about-profile",
    description: "Ask the digital twin about professional profile information",
    inputSchema: {
      type: "object",
      properties: {
        question: {
          type: "string",
          description: "Your question about the profile",
        },
      },
      required: ["question"],
    },
  },
  {
    name: "search-profile",
    description: "Search for specific information within the profile",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search keywords",
        },
        category: {
          type: "string",
          enum: PROFILE_CATEGORIES,
          description: "Optional category filter",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "list-profile-sections",
    description: "Get an overview of available profile sections",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
];
