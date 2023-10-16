import { z } from "zod";
import type {
  ChatCompletion,
  ChatCompletionChunk,
} from "openai/resources/chat";
import { UnifiedCreateChatCompletionNonStreamResult } from "../../utils/types";

/**
 * Validates an object against the OpenAI ChatCompletion response schema.
 */
export function validateOpenAIChatCompletionResponse(
  obj: UnifiedCreateChatCompletionNonStreamResult,
) {
  const schema: z.ZodType<ChatCompletion> = z.strictObject({
    id: z.string(),
    choices: z.array(
      z.strictObject({
        finish_reason: z.enum([
          "stop",
          "length",
          "function_call",
          "content_filter",
        ]),
        index: z.number(),
        // One of
        message: z.union([
          // Content
          z.strictObject({
            content: z.string(),
            role: z.enum(["user", "assistant", "system", "assistant"]),
            function_call: z.undefined(),
          }),
          // or, function call
          z.strictObject({
            content: z.null(),
            role: z.enum(["assistant"]),
            function_call: z
              .strictObject({
                arguments: z.string(),
                name: z.string(),
              })
              .optional(),
          }),
        ]),
      }),
    ),
    created: z.number(),
    model: z.string(),
    object: z.string(),
    usage: z.strictObject({
      prompt_tokens: z.number(),
      completion_tokens: z.number(),
      total_tokens: z.number(),
    }),
  });

  schema.parse(obj);
}

/**
 * Validates an object against the OpenAI ChatCompletionChunk schema.
 */
export function validateOpenAIChatCompletionChunk(obj: ChatCompletionChunk) {
  const schema: z.ZodType<ChatCompletionChunk> = z.strictObject({
    id: z.string(),
    object: z.enum(["chat.completion.chunk"]),
    created: z.number(),
    model: z.string(),
    choices: z.array(
      z.strictObject({
        index: z.number(),
        finish_reason: z
          .enum(["stop", "length", "function_call", "content_filter"])
          .nullable(),
        // One of
        delta: z.union([
          // Content
          z.strictObject({
            content: z.string().nullable(),
            role: z.enum(["user", "assistant", "system", "function"]),
          }),
          // or, function call
          z.strictObject({
            function_call: z.strictObject({
              arguments: z.string(),
              name: z.string(),
            }),
          }),
        ]),
      }),
    ),
  });

  schema.parse(obj);
}
