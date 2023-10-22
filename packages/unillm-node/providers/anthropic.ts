import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { APIError } from "@anthropic-ai/sdk/error";
import { Stream } from "@anthropic-ai/sdk/streaming";
import {
  UnifiedCreateChatCompletionNonStreamResult,
  UnifiedCreateChatCompletionStreamResult,
  UnifiedCreateChatCompletionParamsNonStreaming,
  UnifiedCreateChatCompletionParamsStreaming,
  Providers,
  ModelTypes,
} from "../utils/types";
import { UnifiedErrorResponse } from "../utils/UnifiedErrorResponse";

import { Tiktoken } from "@dqbd/tiktoken";
import cl100k_base from "@dqbd/tiktoken/encoders/cl100k_base.json";
import { Readable } from "stream";
import { BaseProvider } from "./baseProvider";

export class AnthropicProvider extends BaseProvider<Providers.Anthropic> {
  private anthropic = new Anthropic();

  async createChatCompletionNonStreaming(
    model: ModelTypes[Providers.Anthropic],
    params: UnifiedCreateChatCompletionParamsNonStreaming,
  ): Promise<UnifiedCreateChatCompletionNonStreamResult> {
    const { baseParams, prompt } =
      this.processUnifiedParamsToAnthropicFormat(params);

    let nativeResult: Anthropic.Completions.Completion;

    try {
      nativeResult = await this.anthropic.completions.create({
        ...baseParams,
        model,
        stream: false,
      });
    } catch (_error: unknown) {
      if (!(_error instanceof APIError)) {
        throw _error;
      }

      const error = _error as APIError;
      throw new UnifiedErrorResponse(
        {
          model,
        },
        error.status,
        (error.error as any).error,
        error.message,
        error.headers,
      );
    }

    const finishReasonMapping: {
      [
        key: string
      ]: OpenAI.Chat.Completions.ChatCompletion.Choice["finish_reason"];
    } = {
      max_tokens: "length",
      stop_sequence: "stop",
    };

    const choices: OpenAI.Chat.Completions.ChatCompletion.Choice[] = [
      {
        index: 0,
        message: {
          role: "assistant",
          content: this.trimLeadingSpaces(nativeResult.completion),
        },
        finish_reason: finishReasonMapping[nativeResult.stop_reason],
      },
    ];

    const encoding = new Tiktoken(
      cl100k_base.bpe_ranks,
      cl100k_base.special_tokens,
      cl100k_base.pat_str,
    );

    const prompt_tokens = encoding.encode(prompt).length;
    const completion_tokens = encoding.encode(nativeResult.completion).length;
    const total_tokens = prompt_tokens + completion_tokens;

    encoding.free();

    const result: OpenAI.Chat.Completions.ChatCompletion = {
      id: (nativeResult as any).log_id,
      choices,
      model: nativeResult.model,
      object: "chat.completion",
      usage: { prompt_tokens, completion_tokens, total_tokens },
      created: Date.now(),
    };

    return result;
  }

  async createChatCompletionStreaming(
    model: ModelTypes[Providers.Anthropic],
    params: UnifiedCreateChatCompletionParamsStreaming,
  ): Promise<UnifiedCreateChatCompletionStreamResult> {
    const { baseParams } = this.processUnifiedParamsToAnthropicFormat(params);

    const originalStreamResponse = await this.anthropic.completions.create({
      ...baseParams,
      model,
      stream: true,
    });

    const stream = await this.parseStreamResponse(originalStreamResponse);
    return stream as unknown as UnifiedCreateChatCompletionStreamResult;
  }

  private processUnifiedParamsToAnthropicFormat(
    params:
      | UnifiedCreateChatCompletionParamsNonStreaming
      | UnifiedCreateChatCompletionParamsStreaming,
  ): {
    baseParams: Omit<Anthropic.CompletionCreateParams, "model">;
    prompt: string;
  } {
    let prompt = params.messages.reduce((acc, message) => {
      return `${acc}${
        message.role === "user" ? "\n\nHuman" : "\n\nAssistant"
      }: ${message.content}`;
    }, "");

    prompt += "\nAssistant:";

    const encoding = new Tiktoken(
      cl100k_base.bpe_ranks,
      cl100k_base.special_tokens,
      cl100k_base.pat_str,
    );
    encoding.free();

    const baseParams = {
      max_tokens_to_sample: params.max_tokens ?? 300,
      temperature: params.temperature ?? undefined,
      top_p: params.top_p ?? undefined,
      prompt,
    };

    return { baseParams, prompt };
  }

  private trimLeadingSpaces(text: string): string {
    return text.replace(/^\s+/, "");
  }

  private async parseStreamResponse(
    stream: Stream<Anthropic.Completions.Completion>,
  ): Promise<Readable> {
    const openaiStream = new Readable({
      objectMode: true,
      read() {},
    });

    (async () => {
      for await (const chunk of stream) {
        const openaiChunk: OpenAI.Chat.Completions.ChatCompletionChunk = {
          id: "",
          object: "chat.completion.chunk",
          created: Date.now(),
          model: chunk.model,
          choices: [
            {
              index: 0,
              delta: { content: chunk.completion, role: "assistant" },
              finish_reason: this.getChunkFinishReason(chunk.stop_reason),
            },
          ],
        };
        openaiStream.push(openaiChunk);

        if (chunk.stop_reason === "stop_sequence") {
          openaiStream.push(null);
          break;
        }
      }
    })();

    return openaiStream;
  }

  private getChunkFinishReason(
    anthropicStop: Anthropic.Completions.Completion["stop_reason"],
  ): OpenAI.Chat.Completions.ChatCompletionChunk["choices"][0]["finish_reason"] {
    if (anthropicStop === null) {
      return null;
    }

    if (anthropicStop === "stop_sequence") {
      return "stop";
    }

    return null;
  }
}
