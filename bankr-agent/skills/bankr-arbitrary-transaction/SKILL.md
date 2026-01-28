---
name: Bankr Agent - Arbitrary Transactions
description: This skill should be used when the user wants to "submit a transaction", "execute calldata", "send raw transaction", "submit transaction JSON", or provides a JSON object with to/data/value/chainId fields. Handles raw EVM transaction submission.
version: 1.0.0
---

# Arbitrary Transaction Submission

Submit raw EVM transactions with explicit calldata to any supported chain.

## JSON Format

```json
{
  "to": "0x...",
  "data": "0x...",
  "value": "0",
  "chainId": 8453
}
```

| Field | Type | Description |
|-------|------|-------------|
| `to` | string | Target contract address (0x + 40 hex chars) |
| `data` | string | Calldata to execute (0x + hex string) |
| `value` | string | Amount in wei (e.g., "0", "1000000000000000000") |
| `chainId` | number | Target chain ID |

## Supported Chains

| Chain | Chain ID |
|-------|----------|
| Ethereum | 1 |
| Polygon | 137 |
| Base | 8453 |

## Prompt Examples

**Submit a raw transaction:**
```
Submit this transaction:
{
  "to": "0x1234567890abcdef1234567890abcdef12345678",
  "data": "0xa9059cbb000000000000000000000000recipient00000000000000000000000000000000000000000000000000000000000f4240",
  "value": "0",
  "chainId": 8453
}
```

**Execute calldata on a contract:**
```
Execute this calldata on Base:
{
  "to": "0xContractAddress...",
  "data": "0xFunctionSelector...",
  "value": "0",
  "chainId": 8453
}
```

**Send ETH with calldata:**
```
Submit transaction with value:
{
  "to": "0xRecipientAddress...",
  "data": "0x",
  "value": "1000000000000000000",
  "chainId": 1
}
```

## Validation Rules

| Field | Validation |
|-------|------------|
| `to` | Must be 0x followed by exactly 40 hex characters |
| `data` | Must start with 0x, can be "0x" for empty calldata |
| `value` | Wei amount as string, use "0" for no value transfer |
| `chainId` | Must be a supported chain ID |

## Common Issues

| Issue | Resolution |
|-------|------------|
| Unsupported chain | Use chainId 1, 137, or 8453 |
| Invalid address | Ensure 0x + 40 hex chars |
| Invalid calldata | Ensure proper hex encoding with 0x prefix |
| Transaction reverted | Check calldata encoding and contract state |
| Insufficient funds | Ensure wallet has enough ETH/MATIC for gas + value |
