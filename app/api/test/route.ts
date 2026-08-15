import { generateText } from "ai";
import { model } from "@/lib/ai";
import { NextResponse } from "next/server";

export async function GET() {
  const result = await generateText({
    model,
    prompt: "Explain TypeScript in one sentence.",
  });

  return NextResponse.json({
    success: true,
    text: result.text,
  });
}
