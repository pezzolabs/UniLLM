import { APIError } from "openai/error";
import { Headers } from "openai/core";
import { Model } from "llm-repo";

export type UniLLMMetadata = {
  model: Model;
};

export class UnifiedErrorResponse extends APIError {
  constructor(
    public metadata: UniLLMMetadata,
    status: number | undefined,
    error: Object | undefined,
    message: string | undefined,
    headers: Headers | undefined,
  ) {
    super(status, error, message, headers);
  }
}
