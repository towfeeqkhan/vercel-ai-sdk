import { generateText, stepCountIs } from "ai";

import { model } from "@/lib/ai";
import { getWeather } from "./tools";
import WeatherCard from "./WeatherCard";

type WeatherData = Parameters<typeof WeatherCard>[0]["weather"];

function isWeatherData(value: unknown): value is WeatherData {
  if (!value || typeof value !== "object") return false;

  const weather = value as Record<string, unknown>;

  return (
    typeof weather.city === "string" &&
    typeof weather.region === "string" &&
    typeof weather.country === "string" &&
    typeof weather.temperature === "number"
  );
}

export default async function Page() {
  const result = await generateText({
    model,

    prompt: "What's the current weather in Srinagar?",

    tools: {
      getWeather,
    },

    stopWhen: stepCountIs(3),
  });

  const weatherResult = result.toolResults.find(
    (result) => result.toolName === "getWeather",
  );

  const weather = isWeatherData(weatherResult?.output)
    ? weatherResult.output
    : null;

  console.log("Tool Results:");
  console.log(result.toolResults);

  console.log("Final Response:");
  console.log(result.text);

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold">AI Weather Assistant</h1>

        {weather ? (
          <WeatherCard weather={weather} />
        ) : (
          <p className="mt-6">Weather information is not available.</p>
        )}
      </div>
    </main>
  );
}
