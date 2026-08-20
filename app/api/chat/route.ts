import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import { model } from "@/lib/ai";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const messages = body.messages as UIMessage[];

  const result = streamText({
    model,
    messages: await convertToModelMessages(messages),
  });

  const stream = toUIMessageStream(result);

  return createUIMessageStreamResponse({
    stream,
  });
}
