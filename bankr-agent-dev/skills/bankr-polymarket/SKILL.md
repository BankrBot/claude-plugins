---
name: Bankr Dev - Polymarket
description: This skill should be used when building prediction market integrations, implementing betting functionality, or querying Polymarket odds. Covers market search, odds checking, and position management.
version: 1.0.0
---

# Polymarket Capability

Interact with Polymarket prediction markets via natural language prompts.

## What You Can Do

| Operation | Example Prompt |
|-----------|----------------|
| Search markets | `Search Polymarket for election` |
| Trending markets | `What prediction markets are trending?` |
| Check odds | `What are the odds Trump wins?` |
| Market details | `Show details for the Super Bowl market` |
| Bet Yes | `Bet $10 on Yes for the election market` |
| Bet No | `Bet $5 on No for Bitcoin hitting 100k` |
| View positions | `Show my Polymarket positions` |
| Redeem winnings | `Redeem my Polymarket positions` |

## Prompt Patterns

```
Search Polymarket for {query}
What are the odds {event}?
Bet {amount} on {Yes|No} for {market}
Show my Polymarket positions
Redeem my Polymarket positions
```

**Chain:** Polygon (uses USDC.e for betting)

## Usage

```typescript
import { execute } from "./bankr-client";

// Check odds
await execute("What are the odds Trump wins the election?");

// Place a bet
await execute("Bet $10 on Yes for Presidential Election 2024");

// View positions
await execute("Show my Polymarket positions");
```

## Related Skills

- `bankr-client-patterns` - Client setup and execute function
- `bankr-api-basics` - API fundamentals
- `bankr-portfolio` - Check USDC balance for betting
