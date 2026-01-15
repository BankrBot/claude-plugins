---
name: sdk-wallet-operations
description: Initialize and manage Bankr SDK client instances with wallet configuration. Use for client setup, wallet config, or address derivation.
---

# SDK Wallet Operations

Initialize and manage BankrClient with proper wallet configuration.

## Two-Wallet System

- **Payment Wallet** (`privateKey`): Signs x402 USDC payments ($0.10/request). Must have USDC on Base.
- **Context Wallet** (`walletAddress`): Receives swapped tokens. Optional, can differ from payment wallet.

## Basic Setup

```typescript
import { BankrClient } from "@bankr/sdk";

const client = new BankrClient({
  privateKey: process.env.BANKR_PRIVATE_KEY as `0x${string}`,
});

console.log(`Payment wallet: ${client.getWalletAddress()}`);
```

## Full Configuration

```typescript
const client = new BankrClient({
  privateKey: process.env.BANKR_PRIVATE_KEY as `0x${string}`,
  walletAddress: process.env.BANKR_WALLET_ADDRESS,  // Receives tokens
  baseUrl: "https://api-staging.bankr.bot",         // Default
  timeout: 600000,                                   // 10 min default
});
```

## Separate Wallets Pattern

```typescript
const client = new BankrClient({
  privateKey: process.env.PAYMENT_WALLET_PK as `0x${string}`,  // Pays $0.10
  walletAddress: process.env.RECEIVING_WALLET,                  // Gets tokens
});

// Wallet A pays, Wallet B receives USDC
await client.promptAndWait({ prompt: "Swap 0.1 ETH to USDC" });
```

## Per-Request Wallet Override

```typescript
await client.promptAndWait({
  prompt: "Buy $100 of DEGEN",
  walletAddress: "0xDifferentWallet...",  // Override for this request
});
```

## Configuration Interface

```typescript
interface BankrClientConfig {
  privateKey: `0x${string}`;  // Required
  walletAddress?: string;      // Optional
  baseUrl?: string;            // Default: "https://api-staging.bankr.bot"
  timeout?: number;            // Default: 600000 (10 min)
}
```

## Environment Setup

```bash
# Required: Payment wallet (needs USDC on Base)
BANKR_PRIVATE_KEY=0x1234567890abcdef...

# Optional: Receiving wallet
BANKR_WALLET_ADDRESS=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0
```

## Validation Helper

```typescript
function initClient(): BankrClient {
  const pk = process.env.BANKR_PRIVATE_KEY;
  if (!pk?.startsWith("0x") || pk.length !== 66) {
    throw new Error("Invalid private key format");
  }
  return new BankrClient({
    privateKey: pk as `0x${string}`,
    walletAddress: process.env.BANKR_WALLET_ADDRESS,
  });
}
```

## Security

- Never commit private keys
- Use environment variables
- Separate payment and trading wallets
- Keep payment wallet with minimal USDC ($5-10 recommended)
