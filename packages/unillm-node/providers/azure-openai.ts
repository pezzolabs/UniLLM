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
import { UnifiedErrorResponse } from "../utils/UnifiedErrorResponse";

type AzureOpenAIError = {
  message?: string;
  type?: string;
  param?: string | null;
  code?: string | null;
};

export class AzureOpenAIProvider extends BaseProvider<Providers.AzureOpenAI> {
  private client = new OpenAIClient(
    process.env.AZURE_OPENAI_ENDPOINT as string,
    new AzureKeyCredential(process.env.AZURE_OPENAI_API_KEY as string),
  );

  async createChatCompletionNonStreaming(
    _model: ModelTypes[Providers.AzureOpenAI],
    params: UnifiedCreateChatCompletionParamsNonStreaming,
  ): Promise<UnifiedCreateChatCompletionNonStreamResult> {
    const [, model] = _model.split("/");
    const { baseParams } = this.processUnifiedParamsToAzureOpenAIFormat(params);

    let nativeResult: ChatCompletions;

    try {
      nativeResult = await this.client.getChatCompletions(
        model,
        params.messages,
        {
          ...baseParams,
          stream: false,
        },
      );
    } catch (_error: any) {
      const error = this.getUnifiedErrorFromAzureOpenAIError(
        _error as AzureOpenAIError,
        model,
      );
      throw error;
    }

    const choices: OpenAI.Chat.Completions.ChatCompletion["choices"] =
      nativeResult.choices.map(
        (choice): OpenAI.Chat.Completions.ChatCompletion["choices"][0] => ({
          index: choice.index,
          finish_reason:
            choice.finishReason as OpenAI.Chat.Completions.ChatCompletion["choices"][0]["finish_reason"],
          message: {
            role: choice.message!
              .role as OpenAI.Chat.Completions.ChatCompletion["choices"][0]["message"]["role"],
            content: choice.message!.content ?? null,
            function_call: choice.message!.functionCall
              ? choice.message!.functionCall
              : undefined,
          },
        }),
      );

    const result: OpenAI.Chat.Completions.ChatCompletion = {
      id: nativeResult.id,
      choices,
      model,
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
    params: UnifiedCreateChatCompletionParamsStreaming,
  ): Promise<UnifiedCreateChatCompletionStreamResult> {
    const { baseParams } = this.processUnifiedParamsToAzureOpenAIFormat(params);
    const originalStreamResponse = this.client.listChatCompletions(
      model,
      params.messages,
      {
        ...baseParams,
        stream: true,
      },
    );
    const stream = await this.parseStreamResponse(
      model,
      originalStreamResponse,
    );
    return stream as unknown as UnifiedCreateChatCompletionStreamResult;
  }

  private processUnifiedParamsToAzureOpenAIFormat(
    params:
      | UnifiedCreateChatCompletionParamsNonStreaming
      | UnifiedCreateChatCompletionParamsStreaming,
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
    stream: AsyncIterable<ChatCompletions>,
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

  private getUnifiedErrorFromAzureOpenAIError(
    error: AzureOpenAIError,
    deployment: ModelTypes[Providers.AzureOpenAI],
  ): UnifiedErrorResponse {
    let status = 500;

    // Sometimes Azure returns a status code
    if (typeof error.code === "number") {
      status = error.code;
    } else if (typeof error.code === "string") {
      if (!isNaN(Number(error.code))) {
        status = Number(error.code);
      } else {
        // Sometimes it returns strings
        switch (error.code) {
          case "DeploymentNotFound":
            status = 404;
            break;

          // Need to handle more cases, but this isn't documented anywhere.
        }
      }
    }

    // And sometime it will return the native OpenAI error type, if endpoint and deployment exist
    if (error.type) {
      switch (error.type) {
        case "invalid_request_error":
          status = 400;
          break;

        // Need to handle more cases, but this isn't documented anywhere.
      }
    }

    return new UnifiedErrorResponse(
      {
        model: `azure/openai/${deployment}`,
      },
      status,
      error,
      error.message,
      {},
    );
  }
}
