import OpenAILogo from "./images/openai.png";
import AnthropicLogo from "./images/anthropic.png";
import AzureLogo from "./images/azure.png";

import { Provider } from "./index";

export const providerToLogoMapping: {
  [key in Provider]: any;
} = {
  openai: OpenAILogo,
  anthropic: AnthropicLogo,
  azure: AzureLogo,
};

export const getProviderLogo = (provider: Provider) => {
  return providerToLogoMapping[provider];
};
