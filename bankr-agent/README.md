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
   ```bash
   claude plugin marketplace add BankrBot/claude-plugins
   claude plugin install bankr-agent@bankr-claude-plugins
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

- `POST /agent/prompt` - Submit a prompt
- `GET /agent/job/{jobId}` - Check job status
- `POST /agent/job/{jobId}/cancel` - Cancel a job
