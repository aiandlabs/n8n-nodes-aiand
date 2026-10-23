# Security Policy

## Reporting a vulnerability

Report it privately through [GitHub Security Advisories](https://github.com/aiandlabs/n8n-nodes-aiand/security/advisories/new) for this repository. Do not open a public issue.

Please include what an attacker can do and what they need first, steps to reproduce, the package and n8n versions, and any mitigation you know of.

Fixes ship in the latest release only; there are no backport branches before `1.0`.

## Scope

The node runs inside n8n. The API key is stored in n8n's own encrypted credential store; the node only reads it to call `https://api.aiand.com/v1`.

In scope: the key reaching any other host, appearing in node output, logs or error messages, or being sent with requests it should not authenticate.

In scope too: a user who can use or view a workflow but does not own the credential seeing its key, for example in another user's node output.

Out of scope: anything that needs control of the credential itself or of the n8n instance (its database, its encryption key, or owner or admin access), which already exposes every credential stored there.
