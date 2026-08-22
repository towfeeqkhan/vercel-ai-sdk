import { tool } from "ai";
import { z } from "zod";

export const getWeather = tool({
  description: "Get the current weather for a given city.",

  inputSchema: z.object({
    city: z.string().describe("The city to get weather for"),
  }),

  execute: async ({ city }) => {
    const apiKey = process.env.WEATHER_API_KEY;

    if (!apiKey) {
      throw new Error(
        "WEATHER_API_KEY is not set in the environment variables.",
      );
    }

    const url = new URL("https://api.weatherapi.com/v1/current.json");

    url.searchParams.append("key", apiKey);
    url.searchParams.append("q", city);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Weather API request failed: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    return {
      city: data.location.name,
      region: data.location.region,
      country: data.location.country,
      temperature: data.current.temp_c,
      feelsLike: data.current.feelslike_c,
      condition: data.current.condition.text,
      humidity: data.current.humidity,
      windSpeed: data.current.wind_kph,
      lastUpdated: data.current.last_updated,
    };
  },
});
