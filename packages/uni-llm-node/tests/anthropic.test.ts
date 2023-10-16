import { UniLLM } from "..";
import { describe, expect, it } from "vitest";
import * as utils from "./utils/validation.util";
import type { ChatCompletionChunk } from "openai/resources/chat";
import { testParams } from "./utils/test-data.util";

const uniLLM = new UniLLM();

describe("#createChatCompletion - Anthropic", () => {
  const model = "anthropic:claude-2";

  describe("Non streaming", () => {
    it("Should return a valid chat completion response", async () => {
      const response = await uniLLM.createChatCompletion(model, {
        ...testParams,
        stream: false,
      });
      expect(() =>
        utils.validateOpenAIChatCompletionResponse(response),
      ).not.toThrow();
    });
  });

  describe("Streaming", () => {
    it("Should return a valid iterable chat completion stream", async () => {
      const response = await uniLLM.createChatCompletion(model, {
        ...testParams,
        stream: true,
      });

      let testChunk: ChatCompletionChunk;

      for await (const chunk of response) {
        testChunk = chunk;
        break;
      }

      expect(() =>
        utils.validateOpenAIChatCompletionChunk(testChunk),
      ).not.toThrow();
    });
  });
});
