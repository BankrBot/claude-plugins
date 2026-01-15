---
name: sdk-token-swaps
description: Build and execute token swaps across multiple chains using AI assistance. Use for swaps, DEX routing, and cross-chain exchanges.
---

# SDK Token Swaps

Build and execute multi-chain token swaps with AI-powered 0x routing.

## CRITICAL: ERC20 Approval Requirement

For ERC20 swaps, you **must approve `allowanceTarget`** before executing:

```typescript
const result = await client.promptAndWait({
  prompt: "Swap 100 USDC to WETH on Base"
});

const swapTx = result.transactions?.find(tx => tx.type === "swap");
if (swapTx?.metadata.allowanceTarget) {
  // 1. Approve allowanceTarget to spend USDC
  await approveERC20(usdcAddress, swapTx.metadata.allowanceTarget, amount);

  // 2. Execute swap
  await wallet.sendTransaction(swapTx.metadata.transaction);
}
```

**References**:
- [0x AllowanceHolder](https://0x.org/docs/introduction/0x-cheat-sheet#allowanceholder-recommended)
- [0x Settler Addresses](https://github.com/0xProject/0x-settler/blob/master/README.md#allowanceholder-addresses)

## Basic Swap

```typescript
import { BankrClient } from "@bankr/sdk";

const client = new BankrClient({
  privateKey: process.env.BANKR_PRIVATE_KEY as `0x${string}`,
  walletAddress: process.env.BANKR_WALLET_ADDRESS,
});

const result = await client.promptAndWait({
  prompt: "Swap 0.1 ETH to USDC on Base",
});

if (result.status === "completed" && result.transactions) {
  const tx = result.transactions[0].metadata.transaction;
  // Execute with viem/ethers
}
```

## Swap Formats

```typescript
// Amount-based
"Swap 0.1 ETH to USDC"
"Exchange 100 USDC for WETH"

// Value-based
"Buy $100 worth of DEGEN"
"Sell $500 of ETH for USDC"

// Percentage
"Swap 50% of my ETH to USDC"

// Chain-specific
"Swap ETH to USDC on Ethereum"
"Buy DEGEN on Base with USDC"
"Swap SOL to USDC on Solana"
```

## Multi-Chain Support

- **Base** (default): Fastest, lowest fees
- **Ethereum**: Mainnet
- **Polygon**: L2
- **Solana**: Alternative

## Swap Response Structure

```typescript
interface SwapTransaction {
  type: "swap";
  metadata: {
    __ORIGINAL_TX_DATA__: {
      chain: string;
      humanReadableMessage: string;
      inputTokenAmount: string;
      inputTokenTicker: string;
      outputTokenTicker: string;
      receiver: string;
    };
    allowanceTarget?: string;  // Approve this for ERC20 swaps
    transaction: {
      chainId: number;
      to: string;
      data: string;
      gas: string;
      gasPrice: string;
      value: string;
    };
  };
}
```

## Execute with Viem

```typescript
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";

const account = privateKeyToAccount(process.env.WALLET_PK as `0x${string}`);
const walletClient = createWalletClient({ account, chain: base, transport: http() });

const result = await client.promptAndWait({ prompt: "Swap 0.1 ETH to USDC" });
const tx = result.transactions?.[0].metadata.transaction;

if (tx) {
  const hash = await walletClient.sendTransaction({
    to: tx.to as `0x${string}`,
    data: tx.data as `0x${string}`,
    value: BigInt(tx.value),
    gas: BigInt(tx.gas),
  });
}
```

## Error Handling

```typescript
const result = await client.promptAndWait({ prompt: "Swap 0.1 ETH to USDC" });

if (result.status === "failed") {
  console.error(result.error);  // "Insufficient balance", etc.
  return;
}

if (!result.transactions?.length) {
  console.error("No transactions returned");
  return;
}
```

## Best Practices

1. Always check `allowanceTarget` for ERC20 swaps
2. Verify transaction details before executing
3. Check `result.status === "completed"` before accessing transactions
4. Handle approvals before swap execution
