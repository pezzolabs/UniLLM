import {
  OpenAIClient,
  AzureKeyCredential,
  GetChatCompletionsOptions,
  ChatCompletions,
} from "@azure/openai";

import OpenAI from "openai";
import {
  UnifiedCreateChatCompletionNonStreamResult,
  UnifiedCreateChatCompletionStreamResult,
  UnifiedCreateChatCompletionParamsNonStreaming,
  UnifiedCreateChatCompletionParamsStreaming,
  Providers,
  ModelTypes,
} from "../utils/types";

import { Readable } from "stream";
import { BaseProvider } from "./baseProvider";

export class AzureOpenAIProvider extends BaseProvider<Providers.AzureOpenAI> {
  private client = new OpenAIClient(
    process.env.AZURE_OPENAI_ENDPOINT as string,
    new AzureKeyCredential(process.env.AZURE_OPENAI_KEY as string)
  );

  async createChatCompletionNonStreaming(
    model: ModelTypes[Providers.AzureOpenAI],
    params: UnifiedCreateChatCompletionParamsNonStreaming<Providers.AzureOpenAI>
  ): Promise<UnifiedCreateChatCompletionNonStreamResult> {
    const { baseParams } = this.processUnifiedParamsToAzureOpenAIFormat(params);

    const nativeResult = await this.client.getChatCompletions(
      model,
      params.messages,
      {
        ...baseParams,
        stream: false,
      }
    );

    const choices: OpenAI.Chat.Completions.ChatCompletion["choices"] =
      nativeResult.choices.map((choice) => ({
        index: choice.index,
        finish_reason:
          choice.finishReason as OpenAI.Chat.Completions.ChatCompletion["choices"][0]["finish_reason"],
        message: {
          role: choice.message!
            .role as OpenAI.Chat.Completions.ChatCompletion["choices"][0]["message"]["role"],
          content: choice.message!.content,
          function_calls: choice.message!.functionCall
            ? choice.message!.functionCall
            : undefined,
        },
      }));

    const result: OpenAI.Chat.Completions.ChatCompletion = {
      id: nativeResult.id,
      choices,
      model: "azure:openai",
      object: "chat.completion",
      usage: {
        prompt_tokens: nativeResult.usage!.promptTokens,
        completion_tokens: nativeResult.usage!.completionTokens,
        total_tokens: nativeResult.usage!.totalTokens,
      },
      created: Date.now(),
    };

    return result;
  }

  async createChatCompletionStreaming(
    model: ModelTypes[Providers.AzureOpenAI],
    params: UnifiedCreateChatCompletionParamsStreaming<Providers.AzureOpenAI>
  ): Promise<UnifiedCreateChatCompletionStreamResult> {
    const { baseParams } = this.processUnifiedParamsToAzureOpenAIFormat(params);
    const originalStreamResponse = this.client.listChatCompletions(
      model,
      params.messages,
      {
        ...baseParams,
        stream: true,
      }
    );
    const stream = await this.parseStreamResponse(
      model,
      originalStreamResponse
    );
    return stream as unknown as UnifiedCreateChatCompletionStreamResult;
  }

  private processUnifiedParamsToAzureOpenAIFormat(
    params:
      | UnifiedCreateChatCompletionParamsNonStreaming<Providers.AzureOpenAI>
      | UnifiedCreateChatCompletionParamsStreaming<Providers.AzureOpenAI>
  ): { baseParams: GetChatCompletionsOptions } {
    const baseParams: GetChatCompletionsOptions = {
      maxTokens: params.max_tokens ?? undefined,
      temperature: params.temperature ?? undefined,
      functions: params.functions ?? undefined,
      functionCall: params.function_call ?? undefined,
      topP: params.top_p ?? undefined,
      user: params.user ?? undefined,
      presencePenalty: params.presence_penalty ?? undefined,
      frequencyPenalty: params.frequency_penalty ?? undefined,
    };

    return { baseParams };
  }

  private async parseStreamResponse(
    deployment: string,
    stream: AsyncIterable<ChatCompletions>
  ): Promise<Readable> {
    const openaiStream = new Readable({
      objectMode: true,
      read() {},
    });

    (async () => {
      for await (const chunk of stream) {
        const openaiChunk: OpenAI.Chat.Completions.ChatCompletionChunk = {
          id: chunk.id,
          created: Number(chunk.created),
          object: "chat.completion.chunk",
          model: deployment,
          choices: chunk.choices.map((choice) => ({
            index: choice.index,
            finish_reason:
              choice.finishReason as OpenAI.Chat.Completions.ChatCompletionChunk.Choice["finish_reason"],
            delta:
              choice.delta as OpenAI.Chat.Completions.ChatCompletionChunk.Choice["delta"],
          })),
        };

        openaiStream.push(openaiChunk);
      }
    })();

    return openaiStream;
  }
}
