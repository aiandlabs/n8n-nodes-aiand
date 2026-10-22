# @aiand/n8n-nodes-aiand

An n8n chat model node for [ai&](https://aiand.com), which serves open-weight models (DeepSeek, Kimi, GLM, Qwen, Gemma, gpt-oss and more) from Japan.

Connect **ai& Chat Model** to an AI Agent, Basic LLM Chain or any other node that takes a chat model.

## Installation

Follow n8n's [community nodes installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) and install `@aiand/n8n-nodes-aiand`.

## Credentials

1. Create an API key at [aiand.com](https://aiand.com). Keys start with `sk-`.
2. In n8n, create an **ai& API** credential and paste the key.

n8n checks the key against `https://api.aiand.com/v1/models` when you save the credential.

## Usage

1. Add an **AI Agent** (or another node with a chat model input).
2. Connect **ai& Chat Model** to its **Chat Model** input and pick the credential.
3. Choose a model. The list is read live from the ai& API, so new models appear without updating this node.

### Options

| Option               | What it does                                                                                                                                                                                                                                                         |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Reasoning Effort     | How much the model thinks before answering. The choices are the levels the selected model supports, which differ by model (for example `low`/`high`/`max` or `none`/`low`/`medium`/`xhigh`). **Model Default** sends nothing and uses the model's published default. |
| Maximum Tokens       | Upper limit on the length of the reply.                                                                                                                                                                                                                              |
| Sampling Temperature | Randomness of the reply.                                                                                                                                                                                                                                             |

### Example: an agent with a tool

1. **Chat Trigger** → **AI Agent**
2. **ai& Chat Model** → the agent's Chat Model input, model `deepseek-ai/deepseek-v4.1-flash`
3. **Calculator** → the agent's Tool input

Ask the chat "What is 1234 × 5678 + 91011?" and the agent calls the calculator twice before answering.

## Compatibility

Tested with n8n 2.44.5: AI Agent with tools on every ai& model, each model's reasoning levels, and the credential check.

For the **Structured Output Parser**, use a model other than `openai/gpt-oss-120b`: it omits the wrapper object n8n's parser asks for.

## Development

```bash
npm ci
npm run lint
npm run build
npm run dev   # starts a local n8n with this node loaded
```

Releases are published to npm by `.github/workflows/publish.yml` with provenance when a version tag is pushed.

## Resources

- [ai& API reference](https://docs.aiand.com)
- [n8n community nodes](https://docs.n8n.io/integrations/#community-nodes)

## License

[MIT](LICENSE.md)
