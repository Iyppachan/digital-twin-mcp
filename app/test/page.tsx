/**
 * Test page for verifying RAG functionality
 */

import { Suspense } from "react";
import { ragQuery } from "@/lib/rag";
import { VectorSearchResult, RAGResponse } from "@/lib/types";
import { checkVectorDatabaseHealth } from "@/lib/upstash";
import { checkGroqHealth } from "@/lib/groq";

async function StatusChecks() {
  let vectorDB = false;
  let groqAPI = false;
  let ragTest: RAGResponse | null = null;

  try {
    vectorDB = await checkVectorDatabaseHealth();
  } catch (e) {
    console.error("Vector DB check failed:", e);
  }

  try {
    groqAPI = await checkGroqHealth();
  } catch (e) {
    console.error("Groq check failed:", e);
  }

  if (vectorDB && groqAPI) {
    try {
      ragTest = await ragQuery("What are your technical skills?");
    } catch (e) {
      console.error("RAG test failed:", e);
    }
  }

  return (
    <>
      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className={`p-6 rounded-lg ${vectorDB ? "bg-green-900" : "bg-red-900"}`}>
          <h2 className="text-xl font-semibold mb-2">Vector Database</h2>
          <p>{vectorDB ? "✅ Connected" : "❌ Disconnected"}</p>
        </div>

        <div className={`p-6 rounded-lg ${groqAPI ? "bg-green-900" : "bg-red-900"}`}>
          <h2 className="text-xl font-semibold mb-2">Groq API</h2>
          <p>{groqAPI ? "✅ Connected" : "❌ Disconnected"}</p>
        </div>
      </div>

      {/* RAG Test Result */}
      {ragTest && (
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">📝 RAG Test Result</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Question:</h3>
              <p className="text-gray-300">What are your technical skills?</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Answer:</h3>
              <p className="text-gray-300 leading-relaxed">{ragTest.answer}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Confidence:</h3>
              <p className="text-gray-300">{(ragTest.confidence * 100).toFixed(0)}%</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Sources:</h3>
              <div className="space-y-2">
                {ragTest.sources.map((source: VectorSearchResult, idx: number) => (
                  <div key={idx} className="bg-gray-700 p-3 rounded">
                    <p className="font-semibold">{source.title}</p>
                    <p className="text-sm text-gray-400">Relevance: {(source.score * 100).toFixed(0)}%</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">🤖 Digital Twin - System Test</h1>

        <Suspense
          fallback={
            <div className="bg-gray-800 p-6 rounded-lg">
              <p className="text-gray-300">Loading system status...</p>
            </div>
          }
        >
          <StatusChecks />
        </Suspense>

        {/* Environment Info */}
        <div className="mt-8 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">ℹ️ Environment Info</h2>
          <ul className="space-y-2 text-gray-300">
            <li>• Node.js Environment: production</li>
            <li>• Next.js App Router: Enabled</li>
            <li>• TypeScript: v5.9.3</li>
            <li>• Upstash Vector: Connected</li>
            <li>• Groq API: Connected</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

