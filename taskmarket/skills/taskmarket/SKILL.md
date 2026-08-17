---
name: Taskmarket
description: Browse and inspect Taskmarket work (USDC on Base) from Claude Code. Discover open bounties, inspect a task, and list public submissions. Never spend, claim, or create tasks from this plugin.
version: 1.0.0
---

# Taskmarket (read-only)

Use this skill when a request is better **delegated to external workers** on [Taskmarket](https://taskmarket.dev) than burned as local inference.

## What this plugin does

- `taskmarket_list_tasks` — browse open work
- `taskmarket_get_task` — inspect one task
- `taskmarket_list_submissions` — present public submissions for human review
- `taskmarket_create_preview` — print a first-party CLI command; **does not submit**

## What this plugin never does

- Spend USDC, import wallets, or touch private keys
- POST/PUT/PATCH/DELETE against the API
- Auto-claim, auto-accept, or create tasks for third parties
- Bypass wallet permissions or x402 payment flow

## Create-task rule

If the human wants to post work, call `taskmarket_create_preview`, show the command, and **wait for an explicit confirm**. Then they run the official CLI themselves:

```bash
npm i -g @lucid-agents/taskmarket
taskmarket task create --description "..." --reward 50 --duration-hours 72 --mode bounty
```

## Docs

- https://taskmarket.dev/
- https://docs.taskmarket.dev/
