---
name: Bankr Agent - Automation
description: This skill should be used when the user asks about "limit order", "stop loss", "DCA", "TWAP", "schedule", "automate", "recurring order", "price trigger", "cancel automation", "my automations", or any automated trading operation. Provides guidance on limit orders, scheduled commands, and automated strategies.
version: 1.0.1
---

# Bankr Automation

Set up automated orders and scheduled trading strategies.

## Execution

**After loading this skill, load `bankr-job-workflow` to execute the request via curl commands.**

## Order Types

### Limit Orders
Execute at target price:
- "Set a limit order to buy ETH at $3,000"
- "Limit order: sell BNKR when it hits $0.02"

### Stop Loss Orders
Automatically sell to limit losses:
- "Set stop loss for my ETH at $2,500"
- "Stop loss: sell 50% of BNKR if it drops 20%"

### DCA (Dollar Cost Averaging)
Invest fixed amounts at regular intervals:
- "DCA $100 into ETH every week"
- "Set up daily $50 Bitcoin purchases"

### TWAP (Time-Weighted Average Price)
Spread large orders over time:
- "TWAP: buy $1000 of ETH over 24 hours"
- "Spread my sell order over 4 hours"

### Scheduled Commands
Run any Bankr command on a schedule:
- "Every morning, check my portfolio"
- "At 9am daily, check ETH price"

## Managing Automations

**View:**
- "Show my automations"
- "What limit orders do I have?"

**Cancel:**
- "Cancel my ETH limit order"
- "Stop my DCA into Bitcoin"

## Chain Support

- **EVM Chains** (Base, Polygon, Ethereum): All order types supported
- **Solana**: Uses Jupiter Trigger API for limit orders, stop loss, and DCA

## Common Issues

| Issue | Resolution |
|-------|------------|
| Order not triggering | Check price threshold |
| Insufficient balance | Ensure funds available when order executes |
| Order cancelled | May expire or conflict with other orders |

## Tips

1. Start small - test with small amounts first
2. Set alerts - get notified on execution
3. Review regularly - update orders as market changes
4. Combine strategies - DCA + stop loss works well
5. Factor in fees - consider per-transaction costs for DCA
