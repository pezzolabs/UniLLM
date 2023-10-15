import { UnifiedCreateChatCompletionParamsBase } from "../../utils/types";

export const testParams: UnifiedCreateChatCompletionParamsBase = {
  temperature: 0,
  max_tokens: 50,
  messages: [
    {
      role: "user",
      content: "How much is 2+2?",
    }
  ],
};

export const testFunctions: UnifiedCreateChatCompletionParamsBase["functions"] = [
  {
    name: "add",
    description: "Adds two numbers",
    parameters: {
      type: "object",
      properties: {
        num1: {
          type: "number",
          description: "First number to add"
        },
        num2: {
          type: "number",
          description: "Second number to add"
        }
      }
    }
  }
];