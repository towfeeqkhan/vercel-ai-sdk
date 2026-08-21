import { generateText, stepCountIs } from "ai";

import { model } from "@/lib/ai";
import { weatherTool } from "./tools";

export default async function WeatherPage() {
  const result = await generateText({
    model,

    prompt: "What's the current weather in Srinagar?",

    tools: {
      getWeather: weatherTool,
    },

    stopWhen: stepCountIs(5),
  });

  console.log("AI Response:");
  console.log(result.text);

  console.log("\nTool Calls:");
  console.log(result.toolCalls);

  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <div className="max-w-2xl">
        <h1 className="mb-6 text-3xl font-bold">Weather Tool Calling</h1>

        <div className="rounded-lg border p-6">
          <p className="whitespace-pre-wrap">{result.text}</p>
        </div>
      </div>
    </main>
  );
}
