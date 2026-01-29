---
name: Bankr Agent - Market Research
description: This skill should be used when the user asks about "token price", "market data", "technical analysis", "sentiment", "trending tokens", "price chart", "market cap", "token research", "what's the price of", "analyze token", or any market research query. Provides guidance on token research, analysis, and market intelligence.
version: 1.0.1
---

# Bankr Market Research

Research tokens and analyze market data.

## Execution

**After loading this skill, load `bankr-job-workflow` to execute the request via curl commands.**

## Capabilities

- Token search across chains
- Price and market data
- Technical analysis
- Social sentiment
- Price charts
- Trending tokens

## Prompt Examples

**Price queries:**
- "What's the price of ETH?"
- "How much is Bitcoin worth?"

**Market data:**
- "Show me ETH market data"
- "What's the market cap of BNKR?"

**Technical analysis:**
- "Do technical analysis on ETH"
- "Show RSI for Bitcoin"
- "Is ETH overbought?"

**Sentiment:**
- "What's the sentiment on ETH?"
- "Is the community bullish on SOL?"

**Charts:**
- "Show me ETH price chart"
- "Generate BTC chart for last week"

**Discovery:**
- "What tokens are trending?"
- "Show top gainers today"
- "Compare ETH vs SOL"

## Data Available

### Price Data
- Current USD price
- 24h / 7d change
- All-time high/low

### Market Metrics
- Market cap
- 24h volume
- Circulating/total supply
- Number of holders

### Technical Indicators
- RSI (Relative Strength Index)
- MACD
- Moving averages (50, 200)
- Support/resistance levels

## Supported Chains

Token research works across Base, Polygon, Ethereum, Solana, and Unichain.

## Token Search

Find tokens by name or symbol:
- "Search for BNKR token"
- "Find tokens called Bankr"
- "What is the contract for PEPE on Base?"

## Limitations

- Historical data limited to available timeframes
- Sentiment based on available social data
- New tokens may have limited data
- Not investment advice
