import { generateText, Output } from "ai";
import { z } from "zod";

import { model } from "@/lib/ai";

import { NextRequest, NextResponse } from "next/server";

const personSchema = z.object({
  name: z.string(),
  age: z.number(),
  occupation: z.string(),
  location: z.string(),
  email: z.string(),
  phone: z.string(),
  hobbies: z.array(z.string()),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const text = body.text;

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid input: text is required and must be a string.",
        },
        {
          status: 400,
        },
      );
    }

    const result = await generateText({
      model,
      output: Output.object({
        schema: personSchema,
      }),
      prompt: `
      Extract the person's information from the following messy text.

      Return the information according to the provided schema.

      If a field is not available in the text:
      - For strings, use an empty string.
      - For age, use 0.
      - For hobbies, use an empty array.

      Do not invent information.

      Text:

      ${text}
      `,
    });

    return NextResponse.json({
      success: true,
      data: result.output,
    });
  } catch (error) {
    console.error("Extraction error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to extract structured data.",
      },
      {
        status: 500,
      },
    );
  }
}
