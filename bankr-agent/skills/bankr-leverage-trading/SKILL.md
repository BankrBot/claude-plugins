---
name: Bankr Agent - Leverage Trading
description: This skill should be used when the user asks about "leverage trading", "long position", "short position", "Avantis", "derivatives", "forex trading", "commodities trading", "open a position", "close position", "stop loss", "take profit", or any leveraged trading operation. Provides guidance on Avantis perpetuals trading.
version: 1.0.1
---

# Bankr Leverage Trading

Trade with leverage using Avantis perpetuals on Base.

## Execution

**After loading this skill, load `bankr-job-workflow` to execute the request via curl commands.**

## Overview

Avantis offers long/short positions with up to 100x leverage on crypto, forex, and commodities.

**Chain**: Base

## Supported Markets

- **Crypto**: BTC, ETH, SOL, ARB, AVAX, BNB, DOGE, LINK, OP, MATIC
- **Forex**: EUR/USD, GBP/USD, USD/JPY, AUD/USD, USD/CAD
- **Commodities**: Gold (XAU), Silver (XAG), Oil (WTI), Natural Gas

## Prompt Examples

**Open positions:**
- "Open a 5x long on ETH with $100"
- "Short Bitcoin with 10x leverage"
- "Long Gold with 2x leverage"

**With risk management:**
- "Long ETH 5x with stop loss at $3000"
- "Short BTC 10x with take profit at 20%"
- "Long SOL 3x with SL at $150 and TP at $200"

**View/close positions:**
- "Show my Avantis positions"
- "Close my ETH long"
- "Exit all my Avantis positions"

## Position Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| Leverage | 1x to 100x (default: 1x) | "5x leverage" |
| Collateral | Amount to use | "$100", "0.1 ETH" |
| Stop Loss | Auto-close to limit losses | "stop loss at $3000" |
| Take Profit | Auto-close to lock gains | "take profit at $4000" |

## Leverage Guidelines

| Risk Level | Leverage | Use Case |
|------------|----------|----------|
| Conservative | 1-3x | Long-term views |
| Moderate | 3-10x | Swing trading |
| Aggressive | 10-25x | Short-term scalps |
| High Risk | 25x+ | Experienced only |

## Common Issues

| Issue | Resolution |
|-------|------------|
| Insufficient collateral | Add more funds |
| Asset not supported | Check available markets |
| Liquidation | Position closed, collateral lost |
| High funding rate | Consider shorter hold time |

## Risk Management Tips

1. Start with low leverage (2-5x)
2. Always use stop loss to limit downside
3. Don't over-leverage - position sizing matters
4. Monitor positions - markets move fast
5. Understand liquidation risk
