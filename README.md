# @aiand/n8n-nodes-aiand

An n8n chat model node for [ai&](https://aiand.com), which serves open-weight models (DeepSeek, Kimi, GLM, Qwen, Gemma, gpt-oss and more) from Japan.

Connect **ai& Chat Model** to an AI Agent, Basic LLM Chain or any other node that takes a chat model.

![ai& Chat Model as the model of an AI Agent with memory and tools](https://raw.githubusercontent.com/aiandlabs/n8n-nodes-aiand/main/docs/agent-workflow.png)

## Installation

Follow n8n's [community nodes installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) and install `@aiand/n8n-nodes-aiand`.

## Credentials

1. Create an API key at [aiand.com](https://aiand.com). Keys start with `sk-`.
2. In n8n, create an **ai& API** credential and paste the key.

n8n checks the key against `https://api.aiand.com/v1/models` when you save the credential.

## Usage

1. Add an **AI Agent** (or another node with a chat model input).
2. Connect **ai& Chat Model** to its **Chat Model** input and pick the credential.
3. Choose a model. The list is read live from the ai& API, so new models appear without updating this node, and models scheduled for retirement are left out. A workflow already set to a model that is later retired stops working at its retirement date; switch it to another model.

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

Tested with n8n 2.44.6, installed from npm through **Settings → Community Nodes** (and updated in place): AI Agent with memory and tools on every ai& model, each model's reasoning levels, the Text Classifier, Information Extractor and Basic LLM Chain, and the credential check.

For the **Structured Output Parser**, use a model other than `openai/gpt-oss-120b`: it omits the wrapper object n8n's parser asks for.

## Development

```bash
npm ci
npm run lint
npm run build
npm run dev   # starts a local n8n with this node loaded
```

### Releasing

`main` only takes changes through reviewed PRs, so there is no release script: n8n-node's `release` command commits and pushes to `main` itself.

1. In a PR, bump `version` in `package.json` and move the `[Unreleased]` entries in `CHANGELOG.md` under the new version.
2. Merge it and wait for `validate` to pass on `main`.
3. Tag the merged commit with `v` plus the new version:

   ```bash
   git switch main && git pull
   TAG="v$(node -p "require('./package.json').version")"
   git tag "$TAG" && git push origin "$TAG"
   ```

4. Approve the staged version with your 2FA, on npmjs.com under **Staged Packages** or with `npm stage list @aiand/n8n-nodes-aiand` and `npm stage approve <id>`. It is not installable until then.

`.github/workflows/publish.yml` checks the tag against `package.json`, `main`, `validate` and npm, stages the version on npm with provenance through a trusted publisher (no token), and creates the GitHub release from the changelog.

## Resources

- [ai& API reference](https://docs.aiand.com)
- [n8n community nodes](https://docs.n8n.io/integrations/#community-nodes)

## License

[MIT](LICENSE.md)
