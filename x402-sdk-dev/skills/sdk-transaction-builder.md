---
name: sdk-transaction-builder
description: Build blockchain transactions including transfers, approvals, NFT operations, and DeFi interactions. Use for advanced transaction building beyond simple swaps.
---

# SDK Transaction Builder

Build complex transactions with AI assistance.

## Transaction Types

| Type | Description |
|------|-------------|
| `swap` | Token swaps |
| `approval` | ERC20 approvals |
| `transfer_erc20` | ERC20 transfers |
| `transfer_eth` | ETH transfers |
| `convert_eth_to_weth` | Wrap ETH |
| `convert_weth_to_eth` | Unwrap WETH |
| `transfer_nft` | NFT transfers |
| `mint_manifold_nft` | Manifold mints |
| `mint_seadrop_nft` | SeaDrop mints |
| `buy_nft` | NFT purchases |
| `avantisTrade` | Avantis perpetuals |
| `swapCrossChain` | Cross-chain bridges |
| `manage_bankr_staking` | Bankr staking |

## ERC20 Transfer

```typescript
const result = await client.promptAndWait({
  prompt: "Send 100 USDC to 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0",
});

const tx = result.transactions?.find(t => t.type === "transfer_erc20");
```

## ETH/WETH Conversion

```typescript
// Wrap ETH
const wrap = await client.promptAndWait({ prompt: "Wrap 0.5 ETH to WETH" });

// Unwrap WETH
const unwrap = await client.promptAndWait({ prompt: "Unwrap 1 WETH to ETH" });
```

## NFT Operations

```typescript
// Transfer
const transfer = await client.promptAndWait({
  prompt: "Transfer my Pudgy Penguin #1234 to 0x742d35..."
});

// Buy
const buy = await client.promptAndWait({
  prompt: "Buy the cheapest Pudgy Penguin on OpenSea"
});
```

## Cross-Chain Bridge

```typescript
const bridge = await client.promptAndWait({
  prompt: "Bridge 100 USDC from Ethereum to Base"
});

const tx = bridge.transactions?.find(t => t.type === "swapCrossChain");
```

## Transaction Metadata

```typescript
interface TransactionMetadata {
  __ORIGINAL_TX_DATA__: {
    chain: string;
    humanReadableMessage: string;
    inputTokenAmount: string;
    inputTokenTicker: string;
    outputTokenTicker: string;
    receiver: string;
  };
  transaction: {
    chainId: number;
    to: string;
    data: string;
    gas: string;
    gasPrice: string;
    value: string;
  };
  allowanceTarget?: string;  // For ERC20 swaps
}
```

## Multi-Step Workflow

```typescript
// 1. Wrap ETH
const wrap = await client.promptAndWait({ prompt: "Wrap 1 ETH to WETH" });
// Execute wrap...

// 2. Swap WETH
const swap = await client.promptAndWait({ prompt: "Swap 1 WETH to USDC" });
// Execute swap...
```

## Validation

```typescript
function validateTx(tx: any): boolean {
  const txData = tx.metadata?.transaction;
  return !!(txData?.to && txData?.data && txData?.chainId);
}

const result = await client.promptAndWait({ prompt: "..." });
if (result.transactions?.every(validateTx)) {
  // Execute transactions
}
```

## Cost

$0.10 USDC per request via x402.
