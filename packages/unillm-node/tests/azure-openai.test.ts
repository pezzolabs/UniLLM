import { UniLLM } from "..";
import { describe, expect, it } from "vitest";
import * as utils from "./utils/validation.util";
import type { ChatCompletionChunk } from "openai/resources/chat";
import { testFunctions, testParams } from "./utils/test-data.util";

const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;
const unillm = new UniLLM();

describe("#createChatCompletion - Azure OpenAI", () => {
  describe("Non streaming", () => {
    it("Should return a valid chat completion response", async () => {
      const response = await unillm.createChatCompletion(
        `azure/openai/${deployment}`,
        {
          ...testParams,
          stream: false,
        },
      );
      expect(() =>
        utils.validateOpenAIChatCompletionResponse(response),
      ).not.toThrow();
    });

    it("Should return a valid function calling response", async () => {
      const response = await unillm.createChatCompletion(
        `azure/openai/${deployment}`,
        {
          ...testParams,
          stream: false,
          functions: testFunctions,
        },
      );
      expect(() =>
        utils.validateOpenAIChatCompletionResponse(response),
      ).not.toThrow();
    });

    it("Should throw an error and return a unified error response", async () => {
      let errorOccurred = false;
      try {
        await unillm.createChatCompletion(`azure/openai/${deployment}`, {
          ...testParams,
          stream: false,
          messages: [],
        });
      } catch (error) {
        errorOccurred = true;
        expect(() =>
          utils.validateOpenAIChatCompletionErrorResponse(error),
        ).not.toThrow();
      }
      expect(errorOccurred).toBeTruthy();
    });
  });

  describe("Streaming", () => {
    it("Should return a valid iterable chat completion stream", async () => {
      const stream = await unillm.createChatCompletion(
        `azure/openai/${deployment}`,
        {
          ...testParams,
          stream: true,
        },
      );

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
