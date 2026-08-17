"use client";

import { FormEvent, useState } from "react";

export default function Chatbot() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!prompt) {
      return;
    }

    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setResponse(data.text);
    } catch (error) {
      console.log(error);
      setResponse("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-3xl font-bold">AI Text Generator</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Enter your prompt..."
            className="min-h-40 w-full rounded-lg border p-4"
          />

          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="rounded-lg bg-black px-5 py-3 text-white disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </form>

        {response && (
          <div className="mt-8 rounded-lg border p-5">
            <h2 className="mb-3 text-xl font-semibold">AI Response</h2>

            <p className="whitespace-pre-wrap">{response}</p>
          </div>
        )}
      </div>
    </main>
  );
}
