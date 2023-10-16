import { UniLLM } from "..";
import { describe, expect, it } from "vitest";
import * as utils from "./utils/validation.util";
import type { ChatCompletionChunk } from "openai/resources/chat";
import { testFunctions, testParams } from "./utils/test-data.util";

const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;
const uniLLM = new UniLLM();

describe("#createChatCompletion - Azure OpenAI", () => {
  describe("Non streaming", () => {
    it("Should return a valid chat completion response", async () => {
      const response = await uniLLM.createChatCompletion(`azure:${deployment}`, {
        ...testParams,
        stream: false,
      });
      expect(() =>
        utils.validateOpenAIChatCompletionResponse(response),
      ).not.toThrow();
    });

    it("Should return a valid function calling response", async () => {
      const response = await uniLLM.createChatCompletion(`azure:${deployment}`, {
        ...testParams,
        stream: false,
        functions: testFunctions,
      });
      expect(() =>
        utils.validateOpenAIChatCompletionResponse(response),
      ).not.toThrow();
    });
  });

  describe("Streaming", () => {
    it("Should return a valid iterable chat completion stream", async () => {
      const stream = await uniLLM.createChatCompletion(`azure:${deployment}`, {
        ...testParams,
        stream: true,
      });

      let testChunk: ChatCompletionChunk;

      for await (const chunk of stream) {
        testChunk = chunk;
        break;
      }

      expect(() =>
        utils.validateOpenAIChatCompletionChunk(testChunk),
      ).not.toThrow();
    });
  });
});
