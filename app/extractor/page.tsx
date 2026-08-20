"use client";

import { useState } from "react";

type ExtractedData = {
  name: string;
  age: number;
  occupation: string;
  location: string;
  email: string;
  phone: string;
  hobbies: string[];
};

export default function ExtractorPage() {
  const [text, setText] = useState("");

  const [extractedData, setExtractedData] = useState<ExtractedData | null>(
    null,
  );

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  async function handleExtract() {
    if (!text.trim()) {
      return;
    }

    setLoading(true);
    setExtractedData(null);
    setError("");

    try {
      const response = await fetch("/api/extract", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          text,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong.");
      }

      setExtractedData(result.data);
    } catch (error) {
      console.error(error);

      setError("Failed to extract data. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-3xl font-bold">Messy Data → JSON</h1>

        {/* Input */}
        <div className="space-y-4">
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Paste messy text here..."
            className="min-h-48 w-full rounded-lg border p-4"
          />

          <button
            onClick={handleExtract}
            disabled={loading || !text.trim()}
            className="rounded-lg bg-black px-5 py-3 text-white disabled:opacity-50"
          >
            {loading ? "Extracting..." : "Extract Data"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-lg border border-red-500 p-4 text-red-500">
            {error}
          </div>
        )}

        {/* Output */}
        {extractedData && (
          <div className="mt-8 rounded-lg border p-5">
            <h2 className="mb-4 text-xl font-semibold">Structured Data</h2>

            <pre className="overflow-x-auto rounded-lg bg-gray-800 p-4 text-sm">
              {JSON.stringify(extractedData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}
