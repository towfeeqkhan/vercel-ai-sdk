import { generateText, stepCountIs } from "ai";

import { model } from "@/lib/ai";
import { weatherTool } from "./tools";

export default async function Page() {
  const result = await generateText({
    model,
    prompt: "What's the weather in Srinagar?",
    tools: {
      getWeather: weatherTool,
    },
    stopWhen: stepCountIs(5), // allow multi-step: tool call -> tool result -> final text
  });

  console.log(result.steps); // Complete generation steps
  console.log(result.toolCalls); // Tools the model requested
  console.log(result.toolResults); // Results returned by those tools
  console.log(result.text); // Final generated text
  console.log(result.usage); // Total tokens used for the entire generation
  console.log(result); // Complete result object

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Tool Calling</h1>
      <p className="mt-4 text-lg text-gray-600">{result.text}</p>
    </div>
  );
}
