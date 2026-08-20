import { generateText, Output } from "ai";
import { z } from "zod";

import { model } from "@/lib/ai";

const personSchema = z.object({
  name: z.string(),
  age: z.number(),
  occupation: z.string(),
  location: z.string(),
  hobbies: z.string().nullable(),
});

export default async function Page() {
  const result = await generateText({
    model,
    output: Output.object({
      schema: personSchema,
    }),
    prompt:
      "John is 25 years old, works as a software engineer, and lives in San Francisco.",
  });

  console.log(result.output);

  return <pre>{JSON.stringify(result.output, null, 2)}</pre>;
}
