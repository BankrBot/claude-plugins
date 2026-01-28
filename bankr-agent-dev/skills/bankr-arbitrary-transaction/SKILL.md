---
name: Bankr Dev - Arbitrary Transactions
description: This skill should be used when building apps that submit raw EVM transactions, custom contract calls, or need to execute pre-built calldata through Bankr. Covers JSON format, validation, and integration patterns.
version: 1.0.0
---

# Arbitrary Transaction Capability

Submit raw EVM transactions with explicit calldata via the Bankr API.

## What You Can Do

| Operation | Description |
|-----------|-------------|
| Submit calldata | Execute pre-built calldata on any supported chain |
| Custom contract calls | Interact with any contract using raw function calls |
| Value transfers with data | Send ETH/MATIC while executing calldata |

## JSON Schema

```json
{
  "to": "0x...",
  "data": "0x...",
  "value": "0",
  "chainId": 8453
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `to` | string | Yes | Contract address (0x + 40 hex chars) |
| `data` | string | Yes | Calldata (0x + hex, or "0x" for empty) |
| `value` | string | Yes | Wei amount as string |
| `chainId` | number | Yes | Target chain (1, 137, or 8453) |

## Supported Chains

| Chain | Chain ID |
|-------|----------|
| Ethereum | 1 |
| Polygon | 137 |
| Base | 8453 |

## Usage

```typescript
import { execute } from "./bankr-client";

// Submit arbitrary transaction
const txJson = {
  to: "0x1234567890abcdef1234567890abcdef12345678",
  data: "0xa9059cbb...",
  value: "0",
  chainId: 8453
};

await execute(`Submit this transaction: ${JSON.stringify(txJson)}`);
```

## Integration Pattern

```typescript
import { execute } from "./bankr-client";

interface ArbitraryTx {
  to: string;
  data: string;
  value: string;
  chainId: number;
}

async function submitArbitraryTx(tx: ArbitraryTx): Promise<void> {
  // Validate before submission
  if (!tx.to.match(/^0x[a-fA-F0-9]{40}$/)) {
    throw new Error("Invalid address format");
  }
  if (!tx.data.startsWith("0x")) {
    throw new Error("Calldata must start with 0x");
  }
  if (![1, 137, 8453].includes(tx.chainId)) {
    throw new Error("Unsupported chain");
  }

  const prompt = `Submit this transaction: ${JSON.stringify(tx)}`;
  await execute(prompt);
}

// Example: ERC-20 transfer
await submitArbitraryTx({
  to: "0xTokenContractAddress...",
  data: "0xa9059cbb000000000000000000000000...", // transfer(address,uint256)
  value: "0",
  chainId: 8453
});
```

## Error Handling

```typescript
try {
  await submitArbitraryTx(tx);
} catch (error) {
  if (error.message.includes("reverted")) {
    // Transaction reverted - check calldata encoding
    console.error("Transaction reverted:", error);
  } else if (error.message.includes("insufficient")) {
    // Not enough funds for gas + value
    console.error("Insufficient funds:", error);
  } else if (error.message.includes("unsupported")) {
    // Chain not supported
    console.error("Unsupported chain:", error);
  }
}
```

## Related Skills

- `bankr-client-patterns` - Client setup and execute function
- `bankr-api-basics` - API fundamentals
- `bankr-token-trading` - Higher-level trading operations
