import { OpenAIStream, StreamingTextResponse } from "ai";
import * as UniLLM from "uni-llm";

export async function POST(req: Request) {
  const { messages, llm } = await req.json();

  const response = await UniLLM.createChatCompletion(llm, {
    temperature: 0,
    max_tokens: 500,
    messages: [...messages],
    stream: true,
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
