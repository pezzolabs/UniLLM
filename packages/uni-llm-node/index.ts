import { OpenAIProvider } from "./providers/openai";
import {
  ModelParamValues,
  UnifiedCreateChatCompletionNonStreamResult,
  UnifiedCreateChatCompletionParamsNonStreaming,
  UnifiedCreateChatCompletionParamsStreaming,
  UnifiedCreateChatCompletionStreamResult,
} from "./utils/types";
import { BaseProvider } from "./providers/baseProvider";
import { ModelTypes } from "./utils/types";
import { AnthropicProvider } from "./providers/anthropic";
import { AzureOpenAIProvider } from "./providers/azure-openai";

const providers: { [k: string]: new () => BaseProvider<keyof ModelTypes> } = {
  openai: OpenAIProvider,
  anthropic: AnthropicProvider,
  azure: AzureOpenAIProvider,
};

// Non-streaming version
export function createChatCompletion(
  providerAndModel: keyof ModelParamValues,
  params: UnifiedCreateChatCompletionParamsNonStreaming,
): Promise<UnifiedCreateChatCompletionNonStreamResult>;

// Streaming version
export function createChatCompletion(
  providerAndModel: keyof ModelParamValues,
  params: UnifiedCreateChatCompletionParamsStreaming,
): Promise<UnifiedCreateChatCompletionStreamResult>;

export function createChatCompletion(
  providerAndModel: keyof ModelParamValues,
  params:
    | UnifiedCreateChatCompletionParamsNonStreaming
    | UnifiedCreateChatCompletionParamsStreaming,
):
  | Promise<UnifiedCreateChatCompletionNonStreamResult>
  | Promise<UnifiedCreateChatCompletionStreamResult> {
  const [providerName, model] = providerAndModel.split(":");
  const provider = providers[providerName];

  if (!provider) {
    throw new Error(`Invalid provider provided - "${providerName}"`);
  }

  const providerInstance = new provider();

  if (params.stream === true) {
    return providerInstance.createChatCompletionStreaming(model, { ...params });
  } else {
    return providerInstance.createChatCompletionNonStreaming(model, {
      ...params,
    });
  }
}
