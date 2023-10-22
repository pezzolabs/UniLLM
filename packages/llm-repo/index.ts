export type ProviderDefinition = {
  name: string;
};

export const providers: {
  [key: string]: ProviderDefinition;
} = {
  openai: {
    name: "OpenAI",
  },
  anthropic: {
    name: "Anthropic",
  },
  azure: {
    name: "Azure",
  },
};

export type Provider = keyof typeof providers;

export type ModelDefinition = {
  provider: keyof typeof providers;
  name: string;
  setup: string;
};

const openaiSetup = `  Make sure the following environment variables are set:
  OPENAI_API_KEY - your OpenAI API key
`;

const anthropicSetup = `  Make sure the following environment variables are set:
  ANTHROPIC_API_KEY - your Anthropic API key
`;

const azureSetup = `  Make sure the following environment variables are set:
  AZURE_OPENAI_ENDPOINT   - your Azure OpenAI endpoint
  AZURE_OPENAI_API_KEY    - your Azure OpenAI API key
  AZURE_OPENAI_DEPLOYMENT - your Azure OpenAI deployment name
`;

export const models: {
  [key: string]: ModelDefinition;
} = {
  "openai/gpt-3.5-turbo": {
    provider: "openai",
    name: "GPT-3.5 Turbo",
    setup: openaiSetup,
  },
  "openai/gpt-4": {
    provider: "openai",
    name: "GPT-4",
    setup: openaiSetup,
  },
  "anthropic/claude-2": {
    provider: "anthropic",
    name: "Claude 2",
    setup: anthropicSetup,
  },
  "anthropic/claude-1-instant": {
    provider: "anthropic",
    name: "Claude 1 Instant",
    setup: anthropicSetup,
  },
  "azure/openai": {
    provider: "azure",
    name: "Azure OpenAI",
    setup: azureSetup,
  },
};

export type Model = keyof typeof models;
