import {
  UnifiedCreateChatCompletionParamsNonStreaming,
  UnifiedCreateChatCompletionParamsStreaming,
  UnifiedCreateChatCompletionNonStreamResult,
  UnifiedCreateChatCompletionStreamResult,
  ModelTypes,
} from "../utils/types";

export abstract class BaseProvider<Provider extends keyof ModelTypes> {
  abstract createChatCompletionNonStreaming(
    model: ModelTypes[Provider],
    params: UnifiedCreateChatCompletionParamsNonStreaming
  ): Promise<UnifiedCreateChatCompletionNonStreamResult>;

  abstract createChatCompletionStreaming(
    model: ModelTypes[Provider],
    params: UnifiedCreateChatCompletionParamsStreaming
  ): Promise<UnifiedCreateChatCompletionStreamResult>;
}
