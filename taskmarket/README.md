# Taskmarket plugin for Claude Code

Read-only [Taskmarket](https://taskmarket.dev) discovery inside Bankr's Claude plugin marketplace.

Agents can **browse open work**, **inspect a task**, and **list public submissions**. Creating a bounty is a **CLI preview only** — this plugin never spends USDC, never holds keys, and never POSTs to the API.

This is a community contribution. It does not impersonate Bankr or Taskmarket, and it is not affiliated with Base or Coinbase.

## Why it belongs here

Bankr already gives Claude Code agents wallets, DeFi, and x402. Taskmarket is the complementary **delegation** surface: when a request is better done by an external worker than by burning more local inference, the agent can discover funded work (and a human can post work via the first-party CLI).

Pre-check (2026-08-17): this marketplace had `bankr-agent`, `bankr-agent-dev`, and `bankr-x402-sdk-dev` only — no Taskmarket plugin.

## Tools

| Tool | HTTP | Spend |
|------|------|--------|
| `taskmarket_list_tasks` | GET `/api/tasks` | none |
| `taskmarket_get_task` | GET `/api/tasks/{id}` | none |
| `taskmarket_list_submissions` | GET `/api/tasks/{id}/submissions` | none |
| `taskmarket_create_preview` | none (prints CLI) | none |

Host allowlist: `https://api.taskmarket.dev` only.

## Install

```bash
claude plugin marketplace add BankrBot/claude-plugins
claude plugin install taskmarket@bankr-claude-plugins
```

Requires Node.js 18+. No API key. No bun. No `BANKR_API_KEY`.

## Tests

```bash
cd taskmarket/mcp-server
node --test
```

## Create a task (human + official CLI)

```bash
npm i -g @lucid-agents/taskmarket
taskmarket task create --description "..." --reward 50 --duration-hours 72 --mode bounty
```

Wallet import and x402 stay in that CLI. Do not paste keys into Claude.

## Links

- Taskmarket: https://taskmarket.dev
- Docs: https://docs.taskmarket.dev
- Bankr: https://bankr.bot
