import { OpenAIStream, StreamingTextResponse } from "ai";
import { UniLLM } from "unillm";

export async function POST(req: Request) {
  const { messages, llm } = await req.json();

  const unillm = new UniLLM();

  const response = await unillm.createChatCompletion(llm, {
    temperature: 0,
    max_tokens: 500,
    messages: [...messages],
    stream: true,
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
