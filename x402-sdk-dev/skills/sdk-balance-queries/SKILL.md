---
name: SDK Balance Queries
description: This skill should be used when the user asks "what are my balances", "how much ETH do I have", "check my wallet", "show my tokens", "portfolio value", "what tokens do I own", "NFT holdings", "how much USDC", "get token balances", "wallet contents", or any question about token balances, wallet contents, portfolio values, or NFT holdings across chains using the Bankr SDK.
version: 1.0.0
---

# SDK Balance Queries

Query multi-chain token balances and portfolio data with AI-powered analysis using the Bankr SDK and x402 micropayments.

## Overview

The Bankr SDK provides a simple natural language interface for querying token balances, portfolio values, and NFT holdings across multiple blockchains. Balance queries are processed through the AI backend and return rich, formatted responses with optional charts and analysis cards.

**Key capabilities:**
- Multi-chain balance queries (Base, Ethereum, Polygon, Solana)
- Token balance lookup by symbol or contract
- Portfolio valuation in USD
- NFT collection holdings and floor prices
- Rich data responses with charts and analysis

## Basic Query

Initialize the BankrClient and query balances using natural language prompts:

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

### Single Token Queries

Query specific token balances on a particular chain:

```typescript
// Specific token on default chain (Base)
const usdcBalance = await client.promptAndWait({
  prompt: "How much USDC do I have?",
});

// Specific token on specific chain
const ethBalance = await client.promptAndWait({
  prompt: "How much ETH do I have on Ethereum mainnet?",
});

// Token by contract address
const tokenBalance = await client.promptAndWait({
  prompt: "What's my balance of token 0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed?",
});
```

### Multi-Token Queries

Query multiple tokens in a single request:

```typescript
// Multiple specific tokens
const balances = await client.promptAndWait({
  prompt: "Show me my ETH, USDC, and DEGEN balances",
});

// All tokens on a chain
const allOnBase = await client.promptAndWait({
  prompt: "What tokens do I have on Base?",
});
```

### Multi-Chain Queries

Query balances across multiple blockchains:

```typescript
// All chains
const allChains = await client.promptAndWait({
  prompt: "Show my balances across all chains",
});

// Specific chains
const ethAndBase = await client.promptAndWait({
  prompt: "What are my balances on Base and Ethereum?",
});

// Compare holdings
const comparison = await client.promptAndWait({
  prompt: "Compare my USDC holdings across all chains",
});
```

### Portfolio Value Queries

Get USD valuations of holdings:

```typescript
// Total portfolio value
const totalValue = await client.promptAndWait({
  prompt: "What's my total portfolio value in USD?",
});

// Specific token value
const degenValue = await client.promptAndWait({
  prompt: "How much is my DEGEN worth in USD?",
});

// Chain-specific value
const baseValue = await client.promptAndWait({
  prompt: "What's the total value of my Base holdings?",
});
```

### NFT Queries

Query NFT holdings and valuations:

```typescript
// List NFT collections
const nftCollections = await client.promptAndWait({
  prompt: "Show me my NFT collections",
});

// NFT floor prices
const floorPrices = await client.promptAndWait({
  prompt: "What's the floor price of my NFTs?",
});

// Specific collection
const pudgyInfo = await client.promptAndWait({
  prompt: "How many Pudgy Penguins do I own?",
});
```

## Query Different Wallet

Query balances for a wallet other than the configured context wallet:

```typescript
// Override wallet for this query only
const result = await client.promptAndWait({
  prompt: "What are the balances in this wallet?",
  walletAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0",
});

// Query specific wallet with specific tokens
const otherWallet = await client.promptAndWait({
  prompt: "How much ETH and USDC does this address have?",
  walletAddress: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
});
```

## Rich Data Responses

Balance queries may return rich data including charts and analysis cards. Handle these appropriately:

```typescript
const result = await client.promptAndWait({
  prompt: "Show my portfolio breakdown",
});

// Check for rich data
if (result.richData && result.richData.length > 0) {
  for (const data of result.richData) {
    switch (data.type) {
      case "chart":
        console.log(`Portfolio chart: ${data.url}`);
        // Display chart image from URL
        break;
      case "social-card":
        console.log(`Analysis card: ${data.text}`);
        // Display card content
        break;
      case "table":
        console.log(`Data table: ${JSON.stringify(data.rows)}`);
        // Render table data
        break;
    }
  }
}
```

## Response Structure

Balance query responses follow the standard SDK response format:

```typescript
interface BalanceQueryResponse {
  status: "completed" | "failed" | "pending" | "processing";
  response: string;           // Human-readable balance summary
  richData?: RichDataItem[];  // Charts, cards, tables
  jobId: string;              // Job identifier
  processingTime?: number;    // Time in milliseconds
}

interface RichDataItem {
  type: "chart" | "social-card" | "table" | "image";
  url?: string;               // For charts/images
  text?: string;              // For cards
  rows?: any[];               // For tables
}
```

## Supported Chains

Balance queries support the following blockchain networks:

| Chain | Default | Notes |
|-------|---------|-------|
| Base | Yes | Primary chain, fastest responses |
| Ethereum | No | Mainnet ERC20 and NFTs |
| Polygon | No | L2 tokens and NFTs |
| Solana | No | SPL tokens and NFTs |

Specify chain in natural language: "on Base", "on Ethereum", "on mainnet", "on Polygon", "on Solana"

## Response Times

Expected response times vary by query complexity:

| Query Type | Typical Time | Notes |
|------------|--------------|-------|
| Single token balance | 2-3 seconds | Fastest |
| Multiple tokens | 3-5 seconds | Single chain |
| Multi-chain query | 5-10 seconds | Queries all chains |
| Portfolio valuation | 3-5 seconds | Includes USD conversion |
| NFT holdings | 5-10 seconds | Fetches metadata |
| NFT floor prices | 8-12 seconds | External API calls |

## Error Handling

Handle common balance query errors:

```typescript
const result = await client.promptAndWait({
  prompt: "What are my balances?",
  timeout: 30000, // 30 second timeout
});

if (result.status === "failed") {
  const error = result.error;

  if (error?.includes("Invalid address")) {
    console.error("The wallet address format is invalid");
  } else if (error?.includes("Rate limited")) {
    console.error("Too many requests, try again later");
  } else if (error?.includes("Chain not supported")) {
    console.error("The specified chain is not supported");
  } else {
    console.error(`Balance query failed: ${error}`);
  }
  return;
}

console.log(result.response);
```

## Best Practices

1. **Use specific queries**: "How much USDC on Base?" is faster than "Show all balances everywhere"
2. **Cache responses**: Balance data is valid for short periods; avoid redundant queries
3. **Handle timeouts**: Set appropriate timeouts for multi-chain queries (longer) vs single token (shorter)
4. **Check status**: Always verify `result.status === "completed"` before using response data
5. **Process rich data**: Display charts and cards when available for better UX

## Cost

Each balance query costs $0.10 USDC via x402 micropayments, regardless of complexity. The payment wallet must have sufficient USDC on Base to cover query costs.

## Common Prompt Patterns

Effective prompts for balance queries:

```typescript
// Recommended patterns
"What are my token balances on Base?"
"How much ETH do I have?"
"Show my USDC balance across all chains"
"What's my total portfolio value?"
"List my NFT holdings"

// Less effective (still work but slower)
"Can you check what tokens I might have?"
"I'm wondering about my balances"
"Tell me everything about my wallet"
```
