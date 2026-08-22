import { tool } from "ai";
import { z } from "zod";

// ------------------------------------
// 1. Weather Tool
// ------------------------------------

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

// ------------------------------------
// 2. Places Tool
// ------------------------------------

export const searchPlacesTool = tool({
  description:
    "Find places and activities in a city based on a category such as indoor activities, outdoor activities, restaurants, sightseeing, or shopping.",

  inputSchema: z.object({
    city: z.string().describe("The city to search in."),
    category: z
      .enum(["museum", "shopping", "restaurant", "indoor", "outdoor"])
      .describe("The type of places or activities to search for."),
  }),

  execute: async ({ city, category }) => {
    // Mock data for now.
    // Later we can use Geoapify/OpenTripMap.

    const places = [
      {
        name: "Mughal Gardens",
        category: "outdoor sightseeing",
        city: "Srinagar",
      },
      {
        name: "Dal Lake Shikara Ride",
        category: "outdoor activity",
        city: "Srinagar",
      },
      {
        name: "Shankaracharya Temple",
        category: "sightseeing",
        city: "Srinagar",
      },
      {
        name: "Kashmir Arts Emporium",
        category: "indoor shopping",
        city: "Srinagar",
      },
      {
        name: "Kashmir Handicrafts Museum",
        category: "indoor activity",
        city: "Srinagar",
      },
      {
        name: "Local Kashmiri Restaurant",
        category: "indoor food",
        city: "Srinagar",
      },
    ];

    const matchingPlaces = places.filter(
      (place) =>
        place.city.toLowerCase() === city.toLowerCase() &&
        place.category.toLowerCase().includes(category.toLowerCase()),
    );

    return {
      city,
      category,
      places: matchingPlaces,
    };
  },
});

// ------------------------------------
// 3. Currency Conversion Tool
// ------------------------------------

export const convertCurrencyTool = tool({
  description:
    "Convert an amount from one currency to another using a fixed exchange rate for this learning project.",

  inputSchema: z.object({
    amount: z.number().describe("The amount to convert."),
    from: z.string().describe("The source currency code, e.g. USD."),
    to: z.string().describe("The target currency code, e.g. INR."),
  }),

  execute: async ({ amount, from, to }) => {
    // Static rates

    const rates: Record<string, number> = {
      USD_INR: 95,
      INR_USD: 1 / 95,
      EUR_INR: 111,
      INR_EUR: 1 / 111,
    };

    const key = `${from.toUpperCase()}_${to.toUpperCase()}`;

    const rate = rates[key];

    if (!rate) {
      throw new Error(`Exchange rate for ${from} to ${to} is not available.`);
    }

    const convertedAmount = amount * rate;

    return {
      amount,
      from: from.toUpperCase(),
      to: to.toUpperCase(),
      exchangeRate: rate,
      convertedAmount: Number(convertedAmount.toFixed(2)),
    };
  },
});

// ------------------------------------
// 4. Budget Calculation Tool
// ------------------------------------

export const calculateBudgetTool = tool({
  description: "Calculate the total trip budget from a list of expenses.",

  inputSchema: z.object({
    items: z.array(
      z.object({
        name: z.string(),
        amount: z.number(),
      }),
    ),
  }),

  execute: async ({ items }) => {
    const total = items.reduce((sum, item) => sum + item.amount, 0);

    return {
      items,
      total: Number(total.toFixed(2)),
    };
  },
});
