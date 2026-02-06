# Bankr Agent Plugin for Claude Code

Integration with the Bankr API for crypto trading, market analysis, and Polymarket predictions.

## Features

- **Crypto Trading**: Buy/sell tokens on various chains (Base, Ethereum, Solana, etc.)
- **Market Analysis**: Get price information, market trends, and macro crypto insights
- **Polymarket**: Check odds and place bets on prediction markets

## Prerequisites

- Bankr API key (get one at https://bankr.bot/api)
- [Bun](https://bun.sh) runtime

## Installation

1. Set your environment variable:

   ```bash
   export BANKR_API_KEY=bk_your_api_key_here
   ```

2. Build the MCP server:

   ```bash
   cd mcp-server
   bun install
   bun run build
   ```

3. Install the plugin in Claude Code:

   **Claude Code:**
   ```bash
   claude plugin marketplace add BankrBot/claude-plugins
   claude plugin install bankr-agent@bankr-claude-plugins
   ```

   **Other Coding Tools (Cursor, OpenCode, Gemini CLI, Antigravity, etc.):**

   Only skills are compatible with other platforms. Agents, commands, hooks, and MCP servers require Claude Code.

   ```bash
   bunx skills add BankrBot/claude-plugins
   ```

## Usage

The bankr-agent automatically triggers on:

- **Crypto queries**: "What's the price of ethereum?", "Buy $50 of BNKR on base"
- **Trading operations**: "Swap 0.1 ETH for USDC", "What are the trends in DeFi?"
- **Polymarket**: "What are the odds the NYC mayor is Joe?", "Bet $5 on the Eagles"

You can also use the `/bankr-agent` command directly:

```
/bankr-agent What's the current BTC price?
```

## Environment Variables

| Variable        | Required | Default                 | Description                        |
| --------------- | -------- | ----------------------- | ---------------------------------- |
| `BANKR_API_KEY` | Yes      | -                       | Your Bankr API key (prefix: `bk_`) |
| `BANKR_API_URL` | No       | `https://api.bankr.bot` | API base URL                       |

## Components

- **Agent**: `bankr-agent` - Handles crypto/trading/polymarket queries
- **MCP Server**: `bankr-agent-api` - Provides API tools
- **Command**: `/bankr-agent` - Direct invocation

## API Reference

The plugin uses the Bankr Agent API:

### Asynchronous Endpoints (Job-based)
- `POST /agent/prompt` - Submit a natural language prompt
- `GET /agent/job/{jobId}` - Check job status
- `POST /agent/job/{jobId}/cancel` - Cancel a job

### Synchronous Endpoints
- `POST /agent/sign` - Sign messages, typed data, or transactions
- `POST /agent/submit` - Submit raw transactions to the blockchain

### Sign Endpoint

Sign messages without broadcasting:

```bash
curl -X POST https://api.bankr.bot/agent/sign \
  -H "X-API-Key: $BANKR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "signatureType": "personal_sign",
    "message": "Hello, Bankr!"
  }'
```

**Supported signature types:**
- `personal_sign` - Sign plain text messages
- `eth_signTypedData_v4` - Sign EIP-712 typed data (permits, etc.)
- `eth_signTransaction` - Sign transactions without broadcasting

### Submit Endpoint

Submit raw transactions directly:

```bash
curl -X POST https://api.bankr.bot/agent/submit \
  -H "X-API-Key: $BANKR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "transaction": {
      "to": "0x...",
      "chainId": 8453,
      "value": "1000000000000000000",
      "data": "0x..."
    },
    "waitForConfirmation": true
  }'
```

Full API documentation: [docs.bankr.bot/agent-api](https://docs.bankr.bot/agent-api/overview)
