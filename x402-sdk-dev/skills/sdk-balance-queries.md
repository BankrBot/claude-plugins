---
name: sdk-balance-queries
description: Query token balances, portfolio values, and wallet holdings across chains. Use for balance checks, portfolio analysis, and wallet inspection.
---

# SDK Balance Queries

Query multi-chain token balances with AI-powered analysis.

## Basic Query

```typescript
import { BankrClient } from "@bankr/sdk";

const client = new BankrClient({
  privateKey: process.env.BANKR_PRIVATE_KEY as `0x${string}`,
  walletAddress: process.env.BANKR_WALLET_ADDRESS,
});

const result = await client.promptAndWait({
  prompt: "What are my token balances?",
});

console.log(result.response);
// "You have 150.5 USDC, 0.25 ETH, 1000 DEGEN on Base..."
```

## Query Examples

```typescript
// Specific token
"How much USDC do I have on Base?"

// Multiple tokens
"Show me my ETH, USDC, and DEGEN balances"

// Multi-chain
"Show my balances across all chains"
"What are my balances on Base and Ethereum?"

// Portfolio value
"What's my total portfolio value in USD?"
"How much is my DEGEN worth?"

// NFTs
"Show me my NFT collections"
"What's the floor price of my NFTs?"
```

## Query Different Wallet

```typescript
const result = await client.promptAndWait({
  prompt: "What are the balances in this wallet?",
  walletAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0",
});
```

## Rich Data

Responses may include charts and analysis cards:

```typescript
if (result.richData) {
  for (const data of result.richData) {
    if (data.type === "chart") {
      console.log(`Chart: ${data.url}`);
    }
    if (data.type === "social-card") {
      console.log(`Analysis: ${data.text}`);
    }
  }
}
```

## Supported Chains

- Base (default)
- Ethereum
- Polygon
- Solana

## Response Times

- Balance queries: 2-5 seconds
- Multi-chain queries: 5-10 seconds
- NFT queries: 5-10 seconds

## Cost

$0.10 USDC per query via x402.
