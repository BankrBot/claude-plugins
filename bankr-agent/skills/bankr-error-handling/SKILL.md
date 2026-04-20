---
name: bankr-error-handling
description: "Use when encountering Bankr API errors including 401 authentication failures, invalid or missing API keys, BANKR_API_KEY not set errors, job failures (insufficient balance, slippage, reverts), rate limiting (429), or any HTTP error from api.bankr.bot. Provides step-by-step troubleshooting and user-facing error communication patterns."
---

# Bankr Error Handling

Diagnose and resolve Bankr API errors, authentication issues, and job failures.

## Workflow

1. Identify the error type (HTTP status code or job failure message)
2. Follow the matching resolution below
3. Present clear, jargon-free fix steps to the user
4. Do NOT retry automatically when authentication fails — the user must fix their API key first

## Authentication Errors (401)

**Symptoms:** HTTP 401, "Invalid API key", "Unauthorized"

Present these setup steps to the user:

1. Visit https://bankr.bot/api to create a new API key
2. Set the environment variable:
   ```bash
   # Add to ~/.zshrc or ~/.bashrc
   export BANKR_API_KEY=bk_your_api_key_here
   ```
3. Restart the terminal / Claude Code session

## HTTP Status Codes

| Code | Meaning | Action |
|------|---------|--------|
| 400 | Bad request | Check prompt format |
| 401 | Unauthorized | Fix API key (see above) |
| 402 | Payment required | Ensure wallet has BNKR on Base |
| 429 | Rate limited | Wait and retry |
| 500 | Server error | Retry after delay |

## Common Job Failures

| Error | Cause | Resolution |
|-------|-------|------------|
| Insufficient balance | Not enough tokens | Check balance, reduce amount |
| Token not found | Invalid symbol/address | Verify token exists on chain |
| Slippage exceeded | Price moved too much | Retry or try smaller amount |
| Transaction reverted | On-chain failure | Check transaction details |
| Rate limit exceeded | Too many requests | Wait and retry |

## Troubleshooting Checklist

1. **API Key** — set in environment, starts with `bk_`, Claude Code restarted after setting
2. **Network** — internet working, api.bankr.bot reachable
3. **For Trading** — wallet has sufficient balance, token exists on target chain

## Reporting Errors to Users

Always: state what went wrong simply, provide specific fix steps, avoid technical jargon, suggest alternatives.

**Example:**
```
Your Bankr API key is not configured. To set it up:
1. Visit https://bankr.bot/api to create an API key
2. Set BANKR_API_KEY in your environment
3. Restart Claude Code
```
