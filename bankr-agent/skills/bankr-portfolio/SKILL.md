---
name: Bankr Agent - Portfolio
description: This skill should be used when the user asks about "my balance", "portfolio", "token holdings", "check balance", "how much do I have", "wallet balance", "what tokens do I own", "show my holdings", or any balance/portfolio query. Provides guidance on checking balances across chains.
version: 1.0.1
---

# Bankr Portfolio

Query token balances and portfolio across all supported chains.

## Execution

**After loading this skill, load `bankr-job-workflow` to execute the request via curl commands.**

## Supported Chains

| Chain | Native Token |
|-------|-------------|
| Base | ETH |
| Polygon | MATIC |
| Ethereum | ETH |
| Unichain | ETH |
| Solana | SOL |

## Prompt Examples

**Full portfolio:**
- "Show my portfolio"
- "What's my total balance?"
- "How much crypto do I have?"

**Chain-specific:**
- "Show my Base balance"
- "What tokens do I have on Polygon?"

**Token-specific:**
- "How much ETH do I have?"
- "What's my USDC balance?"
- "Show my ETH across all chains"

## Features

- **USD Valuation**: All balances include current USD value
- **Multi-Chain Aggregation**: See the same token across all chains
- **Real-Time Prices**: Values reflect current market prices

## Common Tokens Tracked

- **Stablecoins**: USDC, USDT, DAI
- **DeFi**: UNI, AAVE, LINK
- **Memecoins**: DOGE, SHIB, PEPE
- **Project tokens**: BNKR, ARB, OP

## Use Cases

**Before trading:**
- "Do I have enough ETH to swap for 100 USDC?"

**Portfolio review:**
- "What's my largest holding?"
- "Show portfolio breakdown by chain"

**After transactions:**
- "Did my ETH arrive?"
- "Show my new BNKR balance"

## Notes

- Balance queries are read-only (no transactions)
- Shows balance of connected wallet address
- Very small balances (dust) may be excluded
