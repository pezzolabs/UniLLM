import OpenAI from "openai";
import {
  UnifiedCreateChatCompletionParamsStreaming,
  UnifiedCreateChatCompletionParamsNonStreaming,
  UnifiedCreateChatCompletionNonStreamResult,
  UnifiedCreateChatCompletionStreamResult,
  Providers,
  ModelTypes,
} from "../utils/types";
import { BaseProvider } from "./baseProvider";
import { APIError } from "openai/error";
import { UnifiedErrorResponse } from "../utils/UnifiedErrorResponse";

export class OpenAIProvider extends BaseProvider<Providers.OpenAI> {
  private openai = new OpenAI();

  async createChatCompletionNonStreaming(
    model: ModelTypes[Providers.OpenAI],
    params: UnifiedCreateChatCompletionParamsNonStreaming,
  ): Promise<UnifiedCreateChatCompletionNonStreamResult> {
    try {
      const response = await this.openai.chat.completions.create({
        ...params,
        model,
        stream: false,
      });

      return response;
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
        error.error,
        error.message,
        error.headers,
      );
    }
  }

  async createChatCompletionStreaming(
    model: ModelTypes[Providers.OpenAI],
    params: UnifiedCreateChatCompletionParamsStreaming,
  ): Promise<UnifiedCreateChatCompletionStreamResult> {
    const stream = await this.openai.chat.completions.create({
      ...params,
      model,
      stream: true,
    });
    return stream;
  }
}
