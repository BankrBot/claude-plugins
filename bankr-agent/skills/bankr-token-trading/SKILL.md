---
name: Bankr Agent - Token Trading
description: This skill should be used when the user asks to "buy crypto", "sell tokens", "swap ETH", "trade on Base", "exchange tokens", "cross-chain swap", "bridge tokens", "convert ETH to WETH", or any token trading operation. Provides guidance on supported chains, amount formats, and swap operations.
version: 1.0.1
---

# Bankr Token Trading

Execute token trades and swaps across multiple blockchains.

## Execution

**After loading this skill, load `bankr-job-workflow` to execute the request via curl commands.**

## Supported Chains

| Chain | Native Token |
|-------|--------------|
| Base | ETH |
| Polygon | MATIC |
| Ethereum | ETH |
| Unichain | ETH |
| Solana | SOL |

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

## Chain Selection

- If no chain specified, Bankr selects the most appropriate chain
- Base is preferred for most operations due to low fees
- Cross-chain routes are automatically optimized
- Include chain name in prompt to specify: "Buy ETH on Polygon"

## Slippage

- Default slippage tolerance is applied automatically
- For volatile tokens, Bankr adjusts slippage as needed
- If slippage is exceeded, the transaction fails safely

## Common Issues

| Issue | Resolution |
|-------|------------|
| Insufficient balance | Reduce amount or add funds |
| Token not found | Check token symbol/address |
| High slippage | Try smaller amounts |
| Network congestion | Wait and retry |
