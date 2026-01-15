---
name: SDK Token Swaps
description: This skill should be used when the user asks to "swap tokens", "exchange ETH for USDC", "buy DEGEN", "sell tokens", "swap on Base", "trade crypto", "convert ETH to WETH", "exchange tokens", "token swap code", "0x routing", or any token swap operation. Also use for questions about ERC20 approvals, allowanceTarget, swap transaction execution, or building swap transactions with the Bankr SDK.
version: 1.0.0
---

# SDK Token Swaps

Build and execute multi-chain token swaps with AI-powered 0x routing using the Bankr SDK.

## Overview

The Bankr SDK provides a natural language interface for token swaps across multiple chains. Swaps are routed through 0x protocol for optimal pricing and executed via smart contract transactions. The SDK handles route finding, price quotes, and transaction building automatically.

**Key capabilities:**
- Natural language swap requests
- Multi-chain support (Base, Ethereum, Polygon, Solana)
- 0x-powered routing for best prices
- Automatic transaction building
- ERC20 approval handling guidance

## CRITICAL: ERC20 Approval Requirement

For ERC20 token swaps (selling any token other than native ETH), approve the `allowanceTarget` before executing the swap transaction:

```typescript
import { BankrClient } from "@bankr/sdk";

const client = new BankrClient({
  privateKey: process.env.BANKR_PRIVATE_KEY as `0x${string}`,
  walletAddress: process.env.BANKR_WALLET_ADDRESS,
});

const result = await client.promptAndWait({
  prompt: "Swap 100 USDC to WETH on Base"
});

const swapTx = result.transactions?.find(tx => tx.type === "swap");

if (swapTx?.metadata.allowanceTarget) {
  // Step 1: Approve allowanceTarget to spend USDC
  // This allows the 0x contract to transfer USDC on your behalf
  await approveERC20(
    usdcContractAddress,
    swapTx.metadata.allowanceTarget,
    swapAmount
  );

  // Step 2: Execute the swap transaction
  await wallet.sendTransaction(swapTx.metadata.transaction);
}
```

**Important References:**
- [0x AllowanceHolder Documentation](https://0x.org/docs/introduction/0x-cheat-sheet#allowanceholder-recommended)
- [0x Settler Contract Addresses](https://github.com/0xProject/0x-settler/blob/master/README.md#allowanceholder-addresses)

## Basic Swap

Initialize the client and execute a simple swap:

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
  // Execute transaction with viem/ethers
}
```

## Swap Prompt Formats

The SDK understands various natural language formats for swap requests:

### Amount-Based Swaps

Specify exact token amounts to swap:

```typescript
// Swap specific amount of input token
"Swap 0.1 ETH to USDC"
"Exchange 100 USDC for WETH"
"Swap 1000 DEGEN to ETH"

// With chain specification
"Swap 0.1 ETH to USDC on Base"
"Exchange 100 USDC for WETH on Ethereum"
```

### Value-Based Swaps

Specify USD value to buy or sell:

```typescript
// Buy tokens by USD value
"Buy $100 worth of DEGEN"
"Purchase $50 of ETH"

// Sell tokens by USD value
"Sell $500 of ETH for USDC"
"Exchange $200 worth of DEGEN to USDC"
```

### Percentage-Based Swaps

Swap a percentage of holdings:

```typescript
// Percentage of holdings
"Swap 50% of my ETH to USDC"
"Sell 25% of my DEGEN"
"Exchange half my USDC for ETH"
```

### Chain-Specific Swaps

Explicitly specify the chain:

```typescript
// Base (default)
"Swap ETH to USDC on Base"

// Ethereum mainnet
"Swap ETH to USDC on Ethereum"
"Exchange USDC for WETH on mainnet"

// Polygon
"Swap MATIC to USDC on Polygon"

// Solana
"Swap SOL to USDC on Solana"
```

## Multi-Chain Support

Supported blockchain networks for swaps:

| Chain | Native Token | Notes |
|-------|-------------|-------|
| Base | ETH | Default chain, lowest fees |
| Ethereum | ETH | Mainnet, higher gas |
| Polygon | MATIC | L2, low fees |
| Solana | SOL | Alternative ecosystem |

Base is the default chain. Specify other chains explicitly in the prompt.

## Swap Response Structure

Swap responses include transaction data ready for execution:

```typescript
interface SwapTransaction {
  type: "swap";
  metadata: {
    __ORIGINAL_TX_DATA__: {
      chain: string;                  // "base", "ethereum", etc.
      humanReadableMessage: string;   // "Swap 0.1 ETH for ~250 USDC"
      inputTokenAmount: string;       // "0.1"
      inputTokenTicker: string;       // "ETH"
      outputTokenTicker: string;      // "USDC"
      receiver: string;               // Receiving wallet address
    };
    allowanceTarget?: string;         // Address to approve for ERC20 swaps
    transaction: {
      chainId: number;                // Chain ID (8453 for Base)
      to: string;                     // Contract address
      data: string;                   // Encoded transaction data
      gas: string;                    // Gas limit
      gasPrice: string;               // Gas price in wei
      value: string;                  // ETH value to send (wei)
    };
  };
}
```

## Execute Swap with Viem

Complete example using viem to execute a swap:

```typescript
import { createWalletClient, http, parseUnits } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";

// Initialize wallet
const account = privateKeyToAccount(process.env.WALLET_PK as `0x${string}`);
const walletClient = createWalletClient({
  account,
  chain: base,
  transport: http(),
});

// Get swap transaction from SDK
const result = await client.promptAndWait({
  prompt: "Swap 0.1 ETH to USDC"
});

if (result.status !== "completed" || !result.transactions?.length) {
  throw new Error("Swap failed or no transactions returned");
}

const swapTx = result.transactions[0];
const tx = swapTx.metadata.transaction;

// Handle ERC20 approval if needed
if (swapTx.metadata.allowanceTarget) {
  // Approve the allowanceTarget to spend tokens
  const approvalHash = await walletClient.writeContract({
    address: inputTokenAddress,
    abi: erc20Abi,
    functionName: "approve",
    args: [swapTx.metadata.allowanceTarget, parseUnits(amount, decimals)],
  });
  await publicClient.waitForTransactionReceipt({ hash: approvalHash });
}

// Execute swap
const hash = await walletClient.sendTransaction({
  to: tx.to as `0x${string}`,
  data: tx.data as `0x${string}`,
  value: BigInt(tx.value),
  gas: BigInt(tx.gas),
});

console.log(`Swap transaction: ${hash}`);
```

## Execute Swap with Ethers

Complete example using ethers.js v6:

```typescript
import { ethers } from "ethers";

// Initialize wallet
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.WALLET_PK, provider);

// Get swap transaction
const result = await client.promptAndWait({
  prompt: "Swap 0.1 ETH to USDC"
});

const swapTx = result.transactions?.[0];
const tx = swapTx?.metadata.transaction;

if (!tx) {
  throw new Error("No transaction data");
}

// Handle ERC20 approval if needed
if (swapTx.metadata.allowanceTarget) {
  const tokenContract = new ethers.Contract(
    inputTokenAddress,
    ["function approve(address spender, uint256 amount) returns (bool)"],
    wallet
  );
  const approveTx = await tokenContract.approve(
    swapTx.metadata.allowanceTarget,
    ethers.parseUnits(amount, decimals)
  );
  await approveTx.wait();
}

// Execute swap
const swapTransaction = await wallet.sendTransaction({
  to: tx.to,
  data: tx.data,
  value: BigInt(tx.value),
  gasLimit: BigInt(tx.gas),
});

console.log(`Swap transaction: ${swapTransaction.hash}`);
await swapTransaction.wait();
```

## Error Handling

Handle common swap errors:

```typescript
const result = await client.promptAndWait({
  prompt: "Swap 0.1 ETH to USDC"
});

// Check status
if (result.status === "failed") {
  const error = result.error || "Unknown error";

  if (error.includes("Insufficient balance")) {
    console.error("Not enough tokens to swap");
  } else if (error.includes("No route found")) {
    console.error("No swap route available for this pair");
  } else if (error.includes("Slippage")) {
    console.error("Price moved too much, try again");
  } else {
    console.error(`Swap failed: ${error}`);
  }
  return;
}

// Check for transactions
if (!result.transactions?.length) {
  console.error("No swap transactions returned");
  return;
}

// Verify transaction data
const tx = result.transactions[0].metadata.transaction;
if (!tx.to || !tx.data) {
  console.error("Invalid transaction data");
  return;
}

// Proceed with execution
console.log(result.response);
```

## Verifying Swap Before Execution

Always verify transaction details before signing:

```typescript
const result = await client.promptAndWait({
  prompt: "Swap 100 USDC to ETH"
});

const swapTx = result.transactions?.[0];
const txData = swapTx?.metadata.__ORIGINAL_TX_DATA__;

console.log("Swap details:");
console.log(`  From: ${txData.inputTokenAmount} ${txData.inputTokenTicker}`);
console.log(`  To: ${txData.outputTokenTicker}`);
console.log(`  Chain: ${txData.chain}`);
console.log(`  Receiver: ${txData.receiver}`);
console.log(`  Message: ${txData.humanReadableMessage}`);

// Verify receiver is correct
if (txData.receiver !== expectedWallet) {
  throw new Error("Receiver wallet mismatch!");
}

// Verify chain is correct
if (txData.chain !== "base") {
  console.warn(`Swap is on ${txData.chain}, not Base`);
}
```

## Swap Best Practices

1. **Always check allowanceTarget**: ERC20 swaps require approval before execution
2. **Verify transaction details**: Check amounts, tokens, and receiver before signing
3. **Handle approvals properly**: Approve exact amounts or use infinite approval carefully
4. **Check response status**: Always verify `result.status === "completed"`
5. **Use appropriate timeouts**: Swap quotes expire; set reasonable timeouts (60s recommended)
6. **Handle slippage**: Large swaps may need retries if price moves
7. **Test on testnets**: Verify integration before mainnet transactions

## Common Token Addresses

For reference when building approval transactions:

| Token | Base Address |
|-------|-------------|
| USDC | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` |
| WETH | `0x4200000000000000000000000000000000000006` |
| DEGEN | `0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed` |

## Cost

Each swap request costs $0.10 USDC via x402 micropayments. This covers the SDK query; gas fees for the actual swap transaction are paid separately from the executing wallet.

## Response Times

Expected response times for swap operations:

| Operation | Typical Time |
|-----------|--------------|
| Simple swap quote | 3-5 seconds |
| Complex routing | 5-10 seconds |
| Multi-hop routes | 8-15 seconds |

Set timeouts accordingly: 60 seconds recommended for swap operations.
