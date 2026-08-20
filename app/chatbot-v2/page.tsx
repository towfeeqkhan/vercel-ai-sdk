"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

export default function Chatbot() {
  const [input, setInput] = useState("");

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!input.trim()) {
      return;
    }

    sendMessage({
      text: input,
    });

    setInput("");
  }

  const isLoading = status === "submitted" || status === "streaming";

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto flex max-w-2xl flex-col">
        <h1 className="mb-6 text-3xl font-bold">AI Chatbot</h1>

        <div className="mb-6 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="rounded-lg border p-4">
              <p className="mb-2 font-semibold">
                {message.role === "user" ? "You" : "AI"}
              </p>

              {message.parts.map((part, index) => {
                if (part.type === "text") {
                  return (
                    <p key={index} className="whitespace-pre-wrap">
                      {part.text}
                    </p>
                  );
                }

                return null;
              })}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask something..."
            className="min-h-32 w-full rounded-lg border p-4"
          />

          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="rounded-lg bg-black px-5 py-3 text-white disabled:opacity-50"
          >
            {status === "submitted"
              ? "Sending..."
              : status === "streaming"
                ? "Generating..."
                : "Send"}
          </button>
        </form>
      </div>
    </main>
  );
}
