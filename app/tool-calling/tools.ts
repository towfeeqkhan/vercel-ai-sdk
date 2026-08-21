import { tool } from "ai";
import { z } from "zod";

export const weatherTool = tool({
  description: "Get the current weather for a given city.",

  inputSchema: z.object({
    city: z.string().describe("The city to get weather for"),
  }),

  execute: async ({ city }) => {
    return {
      city,
      temperature: 25,
      condition: "Sunny",
      humidity: 40,
    };
  },
});
