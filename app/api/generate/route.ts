import { generateText } from "ai";
import { model } from "@/lib/ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const prompt = body.prompt;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "Prompt is required",
        },
        {
          status: 400,
        },
      );
    }

    const result = await generateText({
      model,
      prompt,
    });

    return NextResponse.json({
      success: true,
      text: result.text,
    });
  } catch (error) {
    console.error("AI generation error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong while generating the response.",
      },
      {
        status: 500,
      },
    );
  }
}
