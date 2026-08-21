import { generateText, stepCountIs } from "ai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { model } from "@/lib/ai";
import { timeTool, weatherTool } from "./tools";

export default async function WeatherPage() {
  const result = await generateText({
    model,
    prompt: "What is the current time and weather in Srinagar right now?",
    tools: {
      getWeather: weatherTool,
      getTime: timeTool,
    },
    stopWhen: stepCountIs(10),
  });

  result.steps.forEach((step, index) => {
    console.log(`Step ${index}:`);
    console.log(step.toolCalls);
    console.log(step.toolResults);
  });

  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <h1 className="mb-6 text-3xl font-bold">Weather Tool Calling</h1>

        <div className="rounded-lg border p-6 bg-card text-card-foreground">
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {result.text}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </main>
  );
}
