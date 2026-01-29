---
name: Bankr Agent - Job Workflow
description: This skill should be used when executing Bankr requests, submitting prompts to Bankr API, polling for job status, checking job progress, or understanding the submit-poll-complete workflow pattern. Provides the core asynchronous job pattern for all Bankr API operations.
version: 2.0.0
---

# Bankr Job Workflow

Execute Bankr API operations using the asynchronous job pattern.

## Prerequisites

The `BANKR_API_KEY` environment variable must be set:

```bash
export BANKR_API_KEY=bk_your_api_key_here
```

Get your API key at https://bankr.bot/api (enable "Agent API").

## Core Pattern: Submit-Poll-Complete

1. **Submit** - Send prompt via curl, receive job ID
2. **Poll** - Check status every 2 seconds until terminal state
3. **Complete** - Report results to user

## API Commands

### Submit a Prompt

```bash
curl -s -X POST "https://api.bankr.bot/agent/prompt" \
  -H "x-api-key: $BANKR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "YOUR_PROMPT_HERE"}'
```

**Response:**
```json
{"success": true, "jobId": "job_xxx", "status": "pending"}
```

Extract the `jobId` for polling.

### Check Job Status

```bash
curl -s -X GET "https://api.bankr.bot/agent/job/JOB_ID_HERE" \
  -H "x-api-key: $BANKR_API_KEY"
```

**Response fields:**
- `status`: pending | processing | completed | failed | cancelled
- `response`: Text answer (when completed)
- `transactions`: Array of executed transactions
- `statusUpdates`: Progress messages during execution
- `error`: Error message (when failed)

### Cancel a Job

```bash
curl -s -X POST "https://api.bankr.bot/agent/job/JOB_ID_HERE/cancel" \
  -H "x-api-key: $BANKR_API_KEY" \
  -H "Content-Type: application/json"
```

## Execution Workflow

### Step 1: Submit the Request

Run the submit command with the user's prompt:

```bash
curl -s -X POST "https://api.bankr.bot/agent/prompt" \
  -H "x-api-key: $BANKR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Buy $50 of ETH on Base"}'
```

Parse the response to get `jobId`.

### Step 2: Poll for Status

Run the status command, replacing JOB_ID with the actual job ID:

```bash
curl -s -X GET "https://api.bankr.bot/agent/job/job_xxx" \
  -H "x-api-key: $BANKR_API_KEY"
```

Check the `status` field:
- `pending` or `processing`: Wait 2 seconds, poll again
- `completed`: Read `response` and `transactions`, report to user
- `failed`: Read `error` field, report to user
- `cancelled`: Inform user job was cancelled

### Step 3: Report Results

When `status` is `completed`:
- Show the `response` text to the user
- If `transactions` array exists, summarize what was executed

## Job Status States

| Status | Action |
|--------|--------|
| `pending` | Keep polling |
| `processing` | Keep polling, report statusUpdates if present |
| `completed` | Read response and transactions, report to user |
| `failed` | Check error field, report to user |
| `cancelled` | Inform user job was cancelled |

## Timing

- **Poll interval**: 2 seconds
- **Typical completion**: 30 seconds to 2 minutes
- **Suggest cancellation**: After 3+ minutes for simple queries

## Error Handling

### Missing API Key

If you get an error about missing `BANKR_API_KEY`, inform the user:

```
The BANKR_API_KEY environment variable is not set.

To fix this:
1. Get an API key at https://bankr.bot/api (enable "Agent API")
2. Add to your shell config: export BANKR_API_KEY=bk_your_key
3. Restart Claude Code
```

### Invalid API Key (401 error)

If you get a 401 response, the API key is invalid or expired. Ask the user to verify their key at https://bankr.bot/api.

### Network Errors

If curl fails, retry after a brief delay. The job continues server-side regardless—you can resume polling with the same jobId.

## Output Guidelines

| Query Type | Output Format |
|------------|---------------|
| Price queries | State price clearly (e.g., "ETH is $3,245.67") |
| Trades | Confirm amounts and transaction details |
| Market analysis | Summarize key insights concisely |
| Polymarket | State odds with context |
| Balances | List holdings with USD values |
| Errors | Explain clearly, suggest alternatives |

## Example: Complete Workflow

User asks: "What's the price of ETH?"

**1. Submit:**
```bash
curl -s -X POST "https://api.bankr.bot/agent/prompt" \
  -H "x-api-key: $BANKR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "What is the price of ETH?"}'
```
Response: `{"success": true, "jobId": "job_abc123", "status": "pending"}`

**2. Poll (repeat until terminal):**
```bash
curl -s -X GET "https://api.bankr.bot/agent/job/job_abc123" \
  -H "x-api-key: $BANKR_API_KEY"
```

**3. When completed, report:**
"ETH is currently trading at $3,245.67"
