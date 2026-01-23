---
name: Bankr Dev - Token Deployment
description: This skill should be used when building token launch tools, implementing Clanker integration, or adding fee claiming functionality. Covers ERC20 deployment, metadata updates, and trading fees.
version: 1.0.0
---

# Token Deployment Capability

Deploy and manage tokens via natural language prompts.

## What You Can Do

| Operation | Example Prompt |
|-----------|----------------|
| Deploy token | `Deploy a token called MyToken with symbol MTK` |
| Deploy with description | `Deploy token MyToken (MTK) with description: A community token` |
| Deploy with socials | `Deploy token MyToken (MTK) with website https://mytoken.xyz and Twitter @mytoken` |
| Check fees | `Check my Clanker fees` |
| Claim fees | `Claim all my Clanker fees` |
| Claim for token | `Claim fees for my token MTK` |
| Claim legacy fees | `Claim legacy Clanker fees` |
| Update description | `Update description for MTK: New description here` |
| Update socials | `Update MTK Twitter to @newhandle` |
| Update image | `Update logo for MTK to https://...` |
| Update reward recipient | `Update reward recipient for MTK to 0x...` |

## Prompt Patterns

```
Deploy a token called {name} with symbol {symbol}
Deploy token {name} ({symbol}) with description: {description}
Deploy token {name} ({symbol}) with website {url} and Twitter @{handle}
Check my Clanker fees
Claim all my Clanker fees
Update description for {symbol}: {new_description}
Update {symbol} Twitter to @{handle}
```

**Supported chains:** Base (primary), Unichain (secondary)

**Rate limits:**
- Standard: 1 token per day
- Bankr Club: 10 tokens per day

## Usage

```typescript
import { execute } from "./bankr-client";

// Deploy token
await execute("Deploy a token called MyToken with symbol MTK");

// With socials
await execute("Deploy token MyToken (MTK) with website https://mytoken.xyz and Twitter @mytoken");

// Check and claim fees
await execute("Check my Clanker fees");
await execute("Claim all my Clanker fees");
```

## Related Skills

- `bankr-client-patterns` - Client setup and execute function
- `bankr-api-basics` - API fundamentals
- `bankr-token-trading` - Trade deployed tokens
