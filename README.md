# Bankr Claude Plugins Marketplace

Public Claude Code plugins for Web3 development with Bankr's multi-chain DeFi infrastructure.

*Maintained by the Bankr team.*

## Available Plugins

### x402-sdk-dev
**Integration with @bankr/sdk for Web3 Development**

- Multi-chain token swaps (Base, Polygon, Ethereum, Solana)
- Wallet operations and balance queries
- Transaction building and execution
- x402 micropayment protocol ($0.10 USDC per request)

[View Plugin →](./x402-sdk-dev/)

## Installation

```bash
# Copy plugin to your project
cp -r packages/claude-plugins-marketplace/x402-sdk-dev .claude/plugins/
```

Enable in `.claude/settings.json`:
```json
{
  "enabledPlugins": {
    "x402-sdk-dev@bankr": true
  }
}
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
