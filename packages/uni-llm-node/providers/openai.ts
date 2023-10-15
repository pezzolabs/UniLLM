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

export class OpenAIProvider extends BaseProvider<Providers.OpenAI> {
  private openai = new OpenAI();

  async createChatCompletionNonStreaming(
    model: ModelTypes[Providers.OpenAI],
    params: UnifiedCreateChatCompletionParamsNonStreaming
  ): Promise<UnifiedCreateChatCompletionNonStreamResult> {
    const response = await this.openai.chat.completions.create({
      ...params,
      model,
      stream: false,
    });

    return response;
  }

  async createChatCompletionStreaming(
    model: ModelTypes[Providers.OpenAI],
    params: UnifiedCreateChatCompletionParamsStreaming
  ): Promise<UnifiedCreateChatCompletionStreamResult> {
    const stream = await this.openai.chat.completions.create({
      ...params,
      model,
      stream: true,
    });
    return stream;
  }
}
