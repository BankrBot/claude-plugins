# Bankr Agent Plugin for Claude Code

Integration with the Bankr API for crypto trading, market analysis, and Polymarket predictions.

## Features

- **Crypto Trading**: Buy/sell tokens on various chains (Base, Ethereum, Solana, etc.)
- **Market Analysis**: Get price information, market trends, and macro crypto insights
- **Polymarket**: Check odds and place bets on prediction markets
- **Portfolio**: Check balances across all chains
- **Transfers**: Send tokens to addresses, ENS, or social handles
- **Leverage Trading**: Long/short positions via Avantis
- **NFTs**: Browse and buy NFTs via OpenSea
- **Automation**: Limit orders, DCA, stop-loss

## Prerequisites

- Bankr API key (get one at https://bankr.bot/api)

## Installation

1. Set your environment variable:

   ```bash
   export BANKR_API_KEY=bk_your_api_key_here
   ```

2. Install the plugin in Claude Code:

   ```bash
   claude plugin marketplace add BankrBot/claude-plugins
   claude plugin install bankr-agent@bankr-claude-plugins
   ```

   **Other Coding Tools (Cursor, OpenCode, Gemini CLI, Antigravity, etc.):**

   ```bash
   bunx skills add BankrBot/claude-plugins
   ```

## Usage

Skills are automatically triggered based on your query:

- **Price queries**: "What's the price of ethereum?", "ETH price"
- **Trading**: "Buy $50 of BNKR on base", "Swap 0.1 ETH for USDC"
- **Polymarket**: "What are the odds on the election?", "Bet $5 on the Eagles"
- **Portfolio**: "Show my balance", "What tokens do I have?"
- **Transfers**: "Send 0.1 ETH to vitalik.eth"

## Environment Variables

| Variable        | Required | Default                 | Description                        |
| --------------- | -------- | ----------------------- | ---------------------------------- |
| `BANKR_API_KEY` | Yes      | -                       | Your Bankr API key (prefix: `bk_`) |
| `BANKR_API_URL` | No       | `https://api.bankr.bot` | API base URL                       |

## Skills

| Skill | Triggers |
|-------|----------|
| `bankr-market-research` | Price queries, market data, analysis |
| `bankr-token-trading` | Buy, sell, swap tokens |
| `bankr-portfolio` | Balance, holdings queries |
| `bankr-transfers` | Send tokens to addresses/ENS |
| `bankr-polymarket` | Prediction market operations |
| `bankr-leverage-trading` | Avantis long/short positions |
| `bankr-nft-operations` | NFT browsing and purchases |
| `bankr-automation` | Limit orders, DCA, stop-loss |
| `bankr-token-deployment` | Deploy tokens via Clanker |
| `bankr-arbitrary-transaction` | Raw EVM transaction submission |
| `bankr-job-workflow` | Core API execution pattern |
| `bankr-error-handling` | Troubleshooting and setup |

## API Reference

The plugin uses the Bankr Agent API:

- `POST /agent/prompt` - Submit a prompt
- `GET /agent/job/{jobId}` - Check job status
- `POST /agent/job/{jobId}/cancel` - Cancel a job
