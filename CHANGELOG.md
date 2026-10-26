# Changelog

All notable changes to this package are documented here. Versioning follows semver; before `1.0`, a minor version may include breaking changes.

## [Unreleased]

## [0.1.2] - 2026-10-26

### Changed

- Searching for "aiand" (or "ai and") in n8n's node panel now finds the node; before, only "ai&" did.
- The node's description now reads "Japan-hosted AI models. Your data stays in Japan".

## [0.1.1] - 2026-10-26

### Changed

- Releases are staged on npm through a trusted publisher and go live only after a maintainer approves them with 2FA. No npm token is stored in the repository.

## [0.1.0] - 2026-10-23

### Added

- **ai& Chat Model** node for n8n's AI Agent and other nodes with a chat model input.
- **ai& API** credential, checked against the ai& API when saved.
- Model list read live from the ai& API; models scheduled for retirement are left out.
- Reasoning Effort option offering each model's own levels, plus the model's default.
- Maximum Tokens and Sampling Temperature options.
