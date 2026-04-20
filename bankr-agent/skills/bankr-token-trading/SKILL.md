---
name: bankr-token-trading
description: "Use when executing token swaps, buying or selling crypto, bridging tokens cross-chain, or converting ETH to WETH via the Bankr agent. Covers supported chains (Base, Polygon, Ethereum, Unichain, Solana), amount formats (USD, percentage, exact), slippage handling, and common trading errors."
---

# Bankr Token Trading

Execute token trades, swaps, and cross-chain bridges across multiple blockchains via the Bankr agent.

## Workflow

1. Construct a natural language prompt specifying the trade (token, amount, chain)
2. Bankr selects the optimal route and executes the swap
3. Monitor job status for completion or failure
4. Handle errors per the common issues table below

## Supported Chains

| Chain | Native Token |
|-------|--------------|
| Base | ETH |
| Polygon | MATIC |
| Ethereum | ETH |
| Unichain | ETH |
| Solana | SOL |

If no chain is specified, Bankr selects the most appropriate (Base preferred for low fees). Cross-chain routes are automatically optimized.

## Amount Formats

| Format | Example | Description |
|--------|---------|-------------|
| USD | `$50` | Dollar amount to spend |
| Percentage | `50%` | Percentage of your balance |
| Exact | `0.1 ETH` | Specific token amount |

## Prompt Examples

**Same-chain swaps:**
- "Swap 0.1 ETH for USDC on Base"
- "Buy $50 of BNKR on Base"
- "Sell 50% of my ETH holdings"

**Cross-chain swaps:**
- "Bridge 0.5 ETH from Ethereum to Base"
- "Move 100 USDC from Polygon to Solana"

**ETH/WETH conversion:**
- "Convert 0.1 ETH to WETH"
- "Unwrap 0.5 WETH to ETH"

## Slippage

Default slippage tolerance is applied automatically. For volatile tokens, Bankr adjusts as needed. If slippage is exceeded, the transaction fails safely — no funds are lost.

## Common Issues

| Issue | Resolution |
|-------|------------|
| Insufficient balance | Reduce amount or add funds |
| Token not found | Check token symbol/address |
| High slippage | Try smaller amounts |
| Network congestion | Wait and retry |
