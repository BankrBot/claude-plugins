# Bankr Claude Plugins Marketplace

Public Claude Code plugins for Web3 development with Bankr's multi-chain DeFi infrastructure.

_Maintained by the Bankr team._

## Available Plugins

### bankr-agent

**Integration with Bankr API for Crypto Trading & Polymarket**

- Crypto trading: Buy/sell tokens on Base, Ethereum, Solana, etc.
- Real-time price queries and market analysis
- Polymarket predictions: Check odds and place bets
- Natural language interface via MCP server

[View Plugin →](./bankr-agent/)

### bankr-x402-sdk-dev

**Integration with @bankr/sdk for Web3 Development**

- Multi-chain token swaps (Base, Polygon, Ethereum, Solana)
- Wallet operations and balance queries
- Transaction building and execution
- x402 micropayment protocol ($0.10 USDC per request)

[View Plugin →](./x402-sdk-dev/)

## Installation

First, add the marketplace:

```bash
claude plugins marketplace add BankrBot/claude-plugins
```

Then install the plugin you want:

```bash
# For bankr-agent (Bankr agent)
claude plugins install bankr-agent@bankr-claude-plugins

# For x402-sdk-dev (Web3 development SDK)
claude plugins install bankr-x402-sdk-dev@bankr-claude-plugins
```

## Requirements

- Claude Code CLI
- Node.js 18+
- USDC on Base (for x402 payments)

## Links

- [Bankr](https://bankr.bot)
- [Documentation](https://docs.bankr.bot)
- [Discord](https://discord.gg/bankr)
- [@bankr/sdk](https://www.npmjs.com/package/@bankr/sdk)

## License

MIT
