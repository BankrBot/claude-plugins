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

### bankr-agent-dev

**Developer Toolkit for Building on the Bankr Agent API**

- Scaffold projects: Generate bots, web services, dashboards, CLI tools
- API documentation: Endpoints, job patterns, TypeScript interfaces
- Working examples: Ready-to-use client code with polling and cancellation

[View Plugin →](./bankr-agent-dev/)

### bankr-x402-sdk-dev

**Integration with @bankr/sdk for Web3 Development**

- Market analysis: prices, charts, TA, trending tokens, social sentiment
- Portfolio tracking: balances, NFT holdings, positions
- Token swaps with 0x routing and cross-chain bridges (EVM chains)
- Leveraged trading via Avantis (commodities, forex, crypto up to 150x)
- NFT operations: buy, transfer, list, mint
- x402 micropayments ($0.01 USDC per request)

**Note:** Solana and Polymarket are not supported via SDK (wallet mode limitations).

[View Plugin →](./x402-sdk-dev/)

## Installation

### Claude Code

First, add the marketplace:

```bash
claude plugin marketplace add BankrBot/claude-plugins
```

Then install the plugin you want:

```bash
# For bankr-agent (Bankr agent)
claude plugin install bankr-agent@bankr-claude-plugins

# For bankr-agent-dev (Developer toolkit)
claude plugin install bankr-agent-dev@bankr-claude-plugins

# For bankr-x402-sdk-dev (Web3 development SDK)
claude plugin install bankr-x402-sdk-dev@bankr-claude-plugins
```

### Other Coding Tools (Cursor, OpenCode, Gemini CLI, Antigravity, etc.)

Only skills are compatible with other platforms. Agents, commands, hooks, and MCP servers require Claude Code.

```bash
bunx skills add BankrBot/claude-plugins
```

## Requirements

- Claude Code CLI
- Node.js 20+
- USDC on Base (for x402 payments)

## Community Examples

See [community-examples/](./community-examples/) for real-world examples of Bankr workflows contributed by the community.

## Links

- [Bankr](https://bankr.bot)
- [Documentation](https://docs.bankr.bot)
- [Discord](https://discord.gg/bankr)
- [@bankr/sdk](https://www.npmjs.com/package/@bankr/sdk)

## License

MIT
