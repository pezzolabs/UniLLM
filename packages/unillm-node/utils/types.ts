import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

type StaticParamValues = {
  "openai/gpt-3.5-turbo": "openai/gpt-3.5-turbo";
  "openai/gpt-4": "openai/gpt-4";
  "anthropic/claude-2": "anthropic/claude-2";
};

type AzureOpenAIDynamicValue = {
  [key in `azure/openai/${string}`]?: string;
};

export type ModelParamValues = StaticParamValues & AzureOpenAIDynamicValue;

export enum Providers {
  OpenAI,
  Anthropic,
  AzureOpenAI,
}

export type ModelTypes = {
  [Providers.OpenAI]: OpenAI.CompletionCreateParams["model"];
  [Providers.Anthropic]: Anthropic.CompletionCreateParams["model"];
  [Providers.AzureOpenAI]: string;
};

export type UnifiedCreateChatCompletionParamsBase = Omit<
  OpenAI.Chat.Completions.ChatCompletionCreateParams,
  "model"
>;
export type UnifiedCreateChatCompletionParamsStreaming = Omit<
  OpenAI.Chat.Completions.ChatCompletionCreateParamsStreaming,
  "model"
>;
export type UnifiedCreateChatCompletionParamsNonStreaming = Omit<
  OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming,
  "model"
>;

export type UnifiedCreateChatCompletionNonStreamResult =
  OpenAI.Chat.Completions.ChatCompletion;
export type UnifiedCreateChatCompletionStreamResult =
  AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>;
