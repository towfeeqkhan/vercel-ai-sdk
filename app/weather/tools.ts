import { tool } from "ai";
import { z } from "zod";

export const weatherTool = tool({
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

export const timeTool = tool({
  description: "Get the current time and date for a given timezone or city.",

  inputSchema: z.object({
    timeZone: z
      .string()
      .describe(
        "IANA timezone string (e.g., 'Asia/Kolkata', 'America/New_York', 'Europe/London') or city name.",
      ),
  }),

  execute: async ({ timeZone }) => {
    try {
      let resolvedTimeZone = timeZone.trim();

      const aliases: Record<string, string> = {
        srinagar: "Asia/Kolkata",
        delhi: "Asia/Kolkata",
        mumbai: "Asia/Kolkata",
        india: "Asia/Kolkata",
        london: "Europe/London",
        "new york": "America/New_York",
      };

      const normalizedInput = resolvedTimeZone.toLowerCase();
      if (aliases[normalizedInput]) {
        resolvedTimeZone = aliases[normalizedInput];
      }

      const now = new Date();

      const timeFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone: resolvedTimeZone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });

      const dateFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone: resolvedTimeZone,
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      return {
        timeZone: resolvedTimeZone,
        formattedTime: timeFormatter.format(now),
        formattedDate: dateFormatter.format(now),
        isoString: now.toISOString(),
      };
    } catch {
      throw new Error(
        `Invalid timezone provided: '${timeZone}'. Please pass a valid IANA timezone name.`,
      );
    }
  },
});
