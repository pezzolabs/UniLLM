import { createChatCompletion } from "..";
import stringify from "json-stable-stringify";

export async function test() {
  try {
    const response = await createChatCompletion("anthropic:claude-2", {
      temperature: 0,
      messages: [
        {
          role: "user",
          content: "Hey how are you?",
        }
      ]
    });
    console.log("response", stringify(response, { space: 2 }));
  } catch (error) {
    console.error("error", error);
  }

}

test();