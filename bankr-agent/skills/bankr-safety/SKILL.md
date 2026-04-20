---
name: bankr-safety
description: "Use when configuring Bankr API key security, setting up read-only keys, enabling IP whitelisting, managing rate limits, creating dedicated agent wallets, rotating keys, or addressing any safety and access control topic for Bankr API and CLI integrations."
---

# Bankr Safety & Access Control

Security best practices and access control configuration for the Bankr API and CLI.

## Workflow

1. Set up API key with appropriate capability flags
2. Configure access restrictions (read-only, IP whitelist) based on use case
3. Create a dedicated agent wallet for autonomous agents
4. Follow the pre-deployment checklist before going live

## API Key Capability Flags

Bankr uses a single key format (`bk_...`) with capability flags managed at [bankr.bot/api](https://bankr.bot/api):

| Flag | Controls | Default |
|------|----------|---------|
| `agentApiEnabled` | `/agent/*` endpoints | false |
| `llmGatewayEnabled` | LLM Gateway at `llm.bankr.bot` | false |
| `readOnly` | Restricts agent to read-only tools | false |

## Read-Only Keys

When `readOnly: true`, write tools are filtered from the agent session:

- **Allowed:** balances, prices, analytics, portfolio, research
- **Blocked:** swaps, transfers, NFT purchases, staking, orders, token launches, leverage, Polymarket bets, claims
- `/agent/sign` and `/agent/submit` return 403 for read-only keys

## IP Whitelisting

Set `allowedIps` on your API key to restrict to specific IPs (403 for non-listed). Empty array = all IPs allowed (default).

## Dedicated Agent Wallet

For autonomous agents, create a **separate Bankr account** instead of using a personal wallet:

- **Limited exposure** — compromised key only affects agent wallet funds
- **Clear accounting** — agent transactions isolated from personal activity
- **Easy revocation** — disable agent account without disrupting primary wallet

Recommended gas buffers: Base 0.01–0.05 ETH, Polygon 5–10 MATIC, Ethereum 0.05–0.1 ETH, Solana 0.1–0.5 SOL.

## Rate Limits

| Tier | Daily Limit |
|------|-------------|
| Standard | 100 messages/day |
| Bankr Club | 1,000 messages/day |
| Custom | Set per API key |

Reset window is 24 hours rolling from first message, not midnight.

## Key Management

- Store keys in environment variables (`BANKR_API_KEY`, `BANKR_LLM_KEY`), never in source code
- Add `~/.bankr/` and `.env` to `.gitignore`
- Rotate keys periodically at [bankr.bot/api](https://bankr.bot/api); revoke immediately if compromised
- Use separate keys for Agent API vs LLM Gateway when needed

## Pre-Deployment Checklist

1. Use a dedicated agent wallet, not your personal account
2. Fund with limited amounts appropriate to purpose
3. Set read-only if agent only queries data
4. Configure IP whitelisting for server-side agents
5. Store keys in environment variables
6. Test with small amounts on Base/Polygon before scaling
7. Implement error handling for rate limits (429) and access control (403)
8. Verify recipients and understand calldata before arbitrary transactions
