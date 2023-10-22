<p align="center">
  <h1 align="center">
  <a href="https://docs.unillm.ai/#gh-light-mode-only" target="_blank">
    <img src=".github/assets/logo-light-mode.svg" alt="logo" width="280">
  </a>

  <a href="https://docs.unillm.ai/#gh-dark-mode-only" target="_blank">
    <img src=".github/assets/logo-dark-mode.svg" alt="logo" width="280">
  </a>
  </h1>
</p>

<p align="center">
  <strong>UniLLM is a library that allows you to call any LLM using the OpenAI API, with 100% type safety.</strong>
</p>

<p align="center">
<img src="https://github.com/pezzolabs/pezzo/actions/workflows/ci.yaml/badge.svg" />
<a href="CODE_OF_CONDUCT.md">
  <img src="https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg" alt="Contributor Covenant">
</a>
<a href="https://opensource.org/licenses/MIT">
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License">
</a>
<a href="https://www.npmjs.com/package/unillm" target="_blank">
  <img src="https://img.shields.io/badge/npm-@pezzo/client-green">
</a>
</p>

# Benefits

- ✨ Integrate with any provider and model using the OpenAI API
- 💬 Consistent chatCompletion responses and logs across all models and providers
- 💯 Type safety across all providers and models
- 🔁 Seamlessly switch between LLMs without rewriting your codebase
- ✅ If you write tests for your service, you only need to test it once
- 🔜 (Coming Soon) Request caching and rate limiting
- 🔜 (Coming Soon) Cost monitoring and alerting

# Usage

## [✨ Check our interactive documentation ✨](https://docs.unillm.ai)

## 💬 Chat Completions

With UniLLM, you can use chat completions even for providers/models that don't natively support it (e.g. Anthropic).

```bash
npm i unillm
```

```ts
import { UniLLM } from 'unillm';

const uniLLM = new UniLLM();

// OpenAI
const response = await uniLLM.createChatCompletion("openai/gpt-3.5-turbo", { messages: ... });
const response = await uniLLM.createChatCompletion("openai/gpt-4", { messages: ... });

// Anthropic
const response = await uniLLM.createChatCompletion("anthropic/claude-2", { messages: ... });
const response = await uniLLM.createChatCompletion("anthropic/claude-1-instant", { messages: ... });

// Azure OpenAI
const response = await uniLLM.createChatCompletion("azure/openai/<deployment-name>", { messages: ... });

// More coming soon!
```

Want to see more examples? Check out the **[interactive docs](https://docs.unillm.ai)**.

## ⚡️ Streaming

To enable streaming, simply provide `stream: true` in the options object. Here is an example:

```ts
const response = await uniLLM.createChatCompletion("openai/gpt-3.5-turbo", {
  messages: ...,
  stream: true
});
```

Want to see more examples? Check out the **[interactive docs](https://docs.unillm.ai)**.

# Contributing

We welcome contributions from the community! Please feel free to submit pull requests or create issues for bugs or feature suggestions.

If you want to contribute but not sure how, join our [Discord](https://pezzo.cc/discord) and we'll be happy to help you out!

Please check out [CONTRIBUTING.md](CONTRIBUTING.md) before contributing.

# License

This repository's source code is available under the [MIT](LICENSE).
