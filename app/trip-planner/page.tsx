import { generateText, stepCountIs } from "ai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { model } from "@/lib/ai";

import {
  weatherTool,
  searchPlacesTool,
  convertCurrencyTool,
  calculateBudgetTool,
} from "./tools";

export default async function TripPlannerPage() {
  const result = await generateText({
    model,

    tools: {
      getWeather: weatherTool,
      searchPlaces: searchPlacesTool,
      convertCurrency: convertCurrencyTool,
      calculateBudget: calculateBudgetTool,
    },

    stopWhen: stepCountIs(15),

    prompt: `
      Plan a 3-day trip to Srinagar in August.

      My total budget is $800.

      Convert my $800 budget to INR.

      Check the current weather in Srinagar.

      Based on the weather:
      - If the weather is cold or rainy, prefer indoor activities.
      - Otherwise, suggest outdoor activities.

      Search for suitable places and activities in Srinagar.

      Create a reasonable budget for:
      - accommodation
      - food
      - transportation
      - activities

      Use the budget calculation tool to calculate the total.

      Finally, give me a clear 3-day trip plan including:
      - weather information
      - recommended activities
      - estimated expenses
      - total budget
      - remaining money

      Use the tools whenever necessary.
    `,
  });

  console.log("========== FINAL RESPONSE ==========");
  console.log(result.text);

  console.log("========== STEPS ==========");

  result.steps.forEach((step, index) => {
    console.log(`\nStep ${index}:`);

    console.log("Tool Calls:");
    console.log(step.toolCalls);

    console.log("Tool Results:");
    console.log(step.toolResults);
  });

  console.log("========== TOTAL USAGE ==========");
  console.log(result.usage);

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-3xl font-bold">Trip Planner</h1>

        <div className="whitespace-pre-wrap rounded-lg border p-6">
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
