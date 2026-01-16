---
name: SDK Transaction Builder
description: This skill should be used when the user asks to "send tokens", "transfer ETH", "send USDC to", "transfer NFT", "wrap ETH", "unwrap WETH", "bridge tokens", "mint NFT", "buy NFT", "approve token", "build transaction", "DeFi transaction", or needs to build transactions for transfers, approvals, NFT operations, cross-chain bridges, ETH/WETH conversions, or DeFi interactions beyond simple swaps using the Bankr SDK.
version: 1.0.0
---

# SDK Transaction Builder

Build complex blockchain transactions with AI assistance using the Bankr SDK.

## Overview

The Bankr SDK supports building various transaction types beyond simple token swaps. Use natural language prompts to generate transaction data for transfers, NFT operations, cross-chain bridges, and DeFi interactions. The SDK returns ready-to-execute transaction objects.

**Key capabilities:**
- Token transfers (ERC20 and native)
- NFT transfers, mints, and purchases
- ETH/WETH wrapping and unwrapping
- Cross-chain token bridges
- ERC20 approvals
- DeFi protocol interactions

## Transaction Types

The SDK supports the following transaction types:

| Type | Description | Use Case |
|------|-------------|----------|
| `swap` | Token swaps | Exchange one token for another |
| `approval` | ERC20 approvals | Grant spending permission |
| `transfer_erc20` | ERC20 transfers | Send tokens to address |
| `transfer_eth` | ETH transfers | Send native ETH |
| `convert_eth_to_weth` | Wrap ETH | Convert ETH to WETH |
| `convert_weth_to_eth` | Unwrap WETH | Convert WETH to ETH |
| `transfer_nft` | NFT transfers | Send NFT to address |
| `mint_manifold_nft` | Manifold mints | Mint from Manifold contracts |
| `mint_seadrop_nft` | SeaDrop mints | Mint from SeaDrop contracts |
| `buy_nft` | NFT purchases | Buy NFT from marketplace |
| `swapCrossChain` | Cross-chain bridges | Move tokens between chains |
| `avantisTrade` | Avantis perpetuals | Trade perpetual futures |
| `manage_bankr_staking` | Bankr staking | Stake/unstake BANKR tokens |

## ERC20 Transfers

Send ERC20 tokens to another address:

```typescript
import { BankrClient } from "@bankr/sdk";

const client = new BankrClient({
  privateKey: process.env.BANKR_PRIVATE_KEY as `0x${string}`,
  walletAddress: process.env.BANKR_WALLET_ADDRESS,
});

const result = await client.promptAndWait({
  prompt: "Send 100 USDC to 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0",
});

if (result.status === "completed" && result.transactions) {
  const tx = result.transactions.find(t => t.type === "transfer_erc20");
  // Execute transaction
}
```

### Transfer Prompt Examples

```typescript
// Specific amount
"Send 100 USDC to 0x742d35..."
"Transfer 0.5 ETH to vitalik.eth"

// With chain specification
"Send 50 USDC to 0x123... on Base"
"Transfer 100 MATIC on Polygon to 0x456..."

// Multiple recipients (separate requests)
"Send 25 USDC to 0xAlice..."
"Send 25 USDC to 0xBob..."
```

## Native ETH Transfers

Send native ETH:

```typescript
const result = await client.promptAndWait({
  prompt: "Send 0.1 ETH to 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0",
});

const tx = result.transactions?.find(t => t.type === "transfer_eth");
```

## ETH/WETH Conversions

Wrap ETH to WETH or unwrap WETH to ETH:

```typescript
// Wrap ETH to WETH
const wrapResult = await client.promptAndWait({
  prompt: "Wrap 0.5 ETH to WETH",
});

const wrapTx = wrapResult.transactions?.find(
  t => t.type === "convert_eth_to_weth"
);

// Unwrap WETH to ETH
const unwrapResult = await client.promptAndWait({
  prompt: "Unwrap 1 WETH to ETH",
});

const unwrapTx = unwrapResult.transactions?.find(
  t => t.type === "convert_weth_to_eth"
);
```

### When to Wrap/Unwrap

- **Wrap ETH**: Some DeFi protocols and swaps require WETH instead of native ETH
- **Unwrap WETH**: Convert back to native ETH for transfers or gas payments

## NFT Operations

### Transfer NFT

Send an NFT to another address:

```typescript
const result = await client.promptAndWait({
  prompt: "Transfer my Pudgy Penguin #1234 to 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0",
});

const tx = result.transactions?.find(t => t.type === "transfer_nft");
```

### Mint NFT

Mint from supported platforms:

```typescript
// Manifold mint
const manifoldMint = await client.promptAndWait({
  prompt: "Mint NFT from Manifold contract 0xabc123...",
});

// SeaDrop mint
const seadropMint = await client.promptAndWait({
  prompt: "Mint from SeaDrop collection 0xdef456...",
});
```

### Buy NFT

Purchase NFT from marketplace:

```typescript
const result = await client.promptAndWait({
  prompt: "Buy the cheapest Pudgy Penguin on OpenSea",
});

const buyTx = result.transactions?.find(t => t.type === "buy_nft");

if (buyTx) {
  console.log(`Price: ${buyTx.metadata.__ORIGINAL_TX_DATA__.inputTokenAmount}`);
  // Execute purchase transaction
}
```

## Cross-Chain Bridges

Bridge tokens between chains:

```typescript
const result = await client.promptAndWait({
  prompt: "Bridge 100 USDC from Ethereum to Base",
});

const bridgeTx = result.transactions?.find(t => t.type === "swapCrossChain");

if (bridgeTx) {
  const txData = bridgeTx.metadata.__ORIGINAL_TX_DATA__;
  console.log(`From: ${txData.chain}`);
  console.log(`Amount: ${txData.inputTokenAmount} ${txData.inputTokenTicker}`);
  console.log(`Receiver: ${txData.receiver}`);
}
```

### Bridge Prompt Examples

```typescript
// Specific chains
"Bridge 100 USDC from Ethereum to Base"
"Move 0.5 ETH from Base to Ethereum"

// With amount
"Bridge $500 worth of ETH from Polygon to Base"
```

**Note**: Cross-chain bridges take longer (10-30 seconds for quote, plus on-chain confirmation time).

## ERC20 Approvals

Build approval transactions for token spending:

```typescript
const result = await client.promptAndWait({
  prompt: "Approve Uniswap to spend my USDC",
});

const approvalTx = result.transactions?.find(t => t.type === "approval");
```

## Transaction Metadata

All transactions include metadata for verification:

```typescript
interface TransactionMetadata {
  __ORIGINAL_TX_DATA__: {
    chain: string;                  // Target chain
    humanReadableMessage: string;   // Human description
    inputTokenAmount: string;       // Amount being sent/swapped
    inputTokenTicker: string;       // Token symbol
    outputTokenTicker: string;      // Output token (for swaps)
    receiver: string;               // Recipient address
  };
  transaction: {
    chainId: number;                // Chain ID (8453 = Base)
    to: string;                     // Contract/recipient address
    data: string;                   // Encoded call data
    gas: string;                    // Gas limit
    gasPrice: string;               // Gas price (wei)
    value: string;                  // Native value (wei)
  };
  allowanceTarget?: string;         // For swaps requiring approval
}
```

## Multi-Step Workflows

Complex operations may require multiple transactions:

```typescript
// Example: Wrap ETH then swap WETH to USDC

// Step 1: Wrap ETH
const wrapResult = await client.promptAndWait({
  prompt: "Wrap 1 ETH to WETH",
});
const wrapTx = wrapResult.transactions?.[0];

// Execute wrap transaction
const wrapHash = await wallet.sendTransaction(wrapTx.metadata.transaction);
await publicClient.waitForTransactionReceipt({ hash: wrapHash });

// Step 2: Swap WETH to USDC
const swapResult = await client.promptAndWait({
  prompt: "Swap 1 WETH to USDC",
});
const swapTx = swapResult.transactions?.[0];

// Handle approval if needed
if (swapTx.metadata.allowanceTarget) {
  await approveToken(wethAddress, swapTx.metadata.allowanceTarget, amount);
}

// Execute swap
const swapHash = await wallet.sendTransaction(swapTx.metadata.transaction);
```

## Transaction Validation

Validate transaction data before execution:

```typescript
function validateTransaction(tx: any): boolean {
  const txData = tx.metadata?.transaction;

  // Check required fields
  if (!txData) {
    console.error("Missing transaction data");
    return false;
  }

  if (!txData.to) {
    console.error("Missing 'to' address");
    return false;
  }

  if (!txData.data && !txData.value) {
    console.error("Missing data and value");
    return false;
  }

  if (!txData.chainId) {
    console.error("Missing chainId");
    return false;
  }

  return true;
}

// Usage
const result = await client.promptAndWait({ prompt: "..." });

if (result.transactions?.every(validateTransaction)) {
  // All transactions valid, proceed with execution
  for (const tx of result.transactions) {
    await executeTx(tx);
  }
} else {
  console.error("Invalid transaction data");
}
```

## Execute with Viem

Execute any transaction type with viem:

```typescript
import { createWalletClient, createPublicClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";

const account = privateKeyToAccount(process.env.WALLET_PK as `0x${string}`);
const walletClient = createWalletClient({
  account,
  chain: base,
  transport: http(),
});
const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});

async function executeTransaction(tx: any) {
  const txData = tx.metadata.transaction;

  const hash = await walletClient.sendTransaction({
    to: txData.to as `0x${string}`,
    data: txData.data as `0x${string}`,
    value: BigInt(txData.value || "0"),
    gas: BigInt(txData.gas),
  });

  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  return receipt;
}

// Execute all transactions in result
const result = await client.promptAndWait({
  prompt: "Send 100 USDC to 0x742d35...",
});

if (result.status === "completed" && result.transactions) {
  for (const tx of result.transactions) {
    const receipt = await executeTransaction(tx);
    console.log(`Transaction ${tx.type}: ${receipt.transactionHash}`);
  }
}
```

## Error Handling

Handle transaction-specific errors:

```typescript
const result = await client.promptAndWait({
  prompt: "Send 100 USDC to 0x742d35...",
});

if (result.status === "failed") {
  const error = result.error || "";

  if (error.includes("Insufficient balance")) {
    console.error("Not enough tokens for this transfer");
  } else if (error.includes("Invalid address")) {
    console.error("The recipient address is invalid");
  } else if (error.includes("NFT not found")) {
    console.error("The specified NFT was not found in wallet");
  } else if (error.includes("Bridge not supported")) {
    console.error("This chain pair is not supported for bridging");
  } else {
    console.error(`Transaction failed: ${error}`);
  }
  return;
}

if (!result.transactions?.length) {
  console.error("No transactions generated");
  return;
}
```

## Timing Guidelines

Expected response times by transaction type:

| Transaction Type | Typical Time |
|-----------------|--------------|
| ERC20 transfer | 2-5 seconds |
| ETH transfer | 2-5 seconds |
| ETH/WETH wrap/unwrap | 2-5 seconds |
| NFT transfer | 3-5 seconds |
| NFT purchase | 5-10 seconds |
| NFT mint | 5-10 seconds |
| Cross-chain bridge | 10-30 seconds |

## Best Practices

1. **Validate transactions**: Always check transaction data before signing
2. **Verify recipients**: Double-check recipient addresses in metadata
3. **Handle multi-step flows**: Wait for each transaction to confirm before the next
4. **Set appropriate timeouts**: Longer timeouts for bridges and NFT operations
5. **Check status**: Always verify `result.status === "completed"`
6. **Log transaction hashes**: Store hashes for debugging and tracking
7. **Test thoroughly**: Verify transaction flows on testnets before mainnet

## Cost

Each transaction request costs $0.01 USDC via x402 micropayments. This covers the SDK query; actual gas fees are paid separately from the executing wallet.
