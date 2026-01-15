---
name: SDK Wallet Operations
description: This skill should be used when the user asks to "set up the SDK", "initialize BankrClient", "configure wallet", "set up payment wallet", "connect wallet to Bankr", "get wallet address", "set up environment variables", "configure private key", "two wallet setup", "separate payment and trading wallets", or needs help with SDK client initialization, two-wallet configuration, wallet address derivation, environment setup, or BankrClient options.
version: 1.0.0
---

# SDK Wallet Operations

Initialize and manage the BankrClient with proper wallet configuration for the Bankr SDK.

## Overview

The BankrClient is the main entry point for interacting with the Bankr SDK. Proper wallet configuration is essential for x402 micropayments and transaction building. The SDK supports a two-wallet system that separates payment concerns from transaction execution.

**Key concepts:**
- Payment wallet: Signs x402 USDC payments (required)
- Context wallet: Receives swapped tokens and NFTs (optional)
- Two-wallet separation for enhanced security
- Environment-based configuration

## Two-Wallet System

The Bankr SDK uses two distinct wallet concepts:

### Payment Wallet (`privateKey`)

The payment wallet is **required** and used for:
- Signing x402 micropayments ($0.10 USDC per request)
- Authenticating with the Bankr API
- Must have USDC balance on Base chain

The private key is used to derive the wallet address and sign payment transactions.

### Context Wallet (`walletAddress`)

The context wallet is **optional** and used for:
- Receiving swapped tokens
- Receiving purchased NFTs
- Providing context for balance queries
- Can be different from the payment wallet

If not specified, the context wallet defaults to the address derived from the payment wallet's private key.

## Basic Setup

Minimal configuration using a single wallet for both payments and receiving:

```typescript
import { BankrClient } from "@bankr/sdk";

const client = new BankrClient({
  privateKey: process.env.BANKR_PRIVATE_KEY as `0x${string}`,
});

// Get the derived wallet address
const walletAddress = client.getWalletAddress();
console.log(`Using wallet: ${walletAddress}`);
```

This configuration:
- Uses the private key for x402 payments
- Derives the wallet address from the private key
- Uses the same address for receiving tokens

## Full Configuration

Complete configuration with all available options:

```typescript
import { BankrClient } from "@bankr/sdk";

const client = new BankrClient({
  // Required: Payment wallet private key
  privateKey: process.env.BANKR_PRIVATE_KEY as `0x${string}`,

  // Optional: Override receiving wallet address
  walletAddress: process.env.BANKR_WALLET_ADDRESS,

  // Optional: API base URL (default: production)
  baseUrl: "https://api-staging.bankr.bot",

  // Optional: Request timeout in milliseconds (default: 600000 = 10 min)
  timeout: 600000,
});
```

## Separate Wallets Pattern

For enhanced security, use separate wallets for payments and receiving:

```typescript
const client = new BankrClient({
  // Hot wallet with minimal USDC for payments
  privateKey: process.env.PAYMENT_WALLET_PK as `0x${string}`,

  // Cold wallet or trading wallet receives tokens
  walletAddress: process.env.RECEIVING_WALLET,
});

// Payment wallet (hot): pays $0.10 per request
// Receiving wallet (cold): receives swapped USDC, purchased NFTs, etc.
const result = await client.promptAndWait({
  prompt: "Swap 0.1 ETH to USDC",
});
// USDC goes to RECEIVING_WALLET, not PAYMENT_WALLET
```

### Benefits of Separate Wallets

1. **Security**: Payment wallet exposure is limited to small USDC amounts
2. **Risk management**: Trading funds stay in a separate, more secure wallet
3. **Flexibility**: Different security models for different purposes
4. **Auditability**: Clear separation of payment and trading activities

### Recommended Setup

```
Payment Wallet (Hot):
- Small USDC balance ($5-10 recommended)
- Used only for x402 payments
- Private key in environment

Receiving Wallet (Cold/Trading):
- Holds main trading funds
- Receives swap outputs
- Can be hardware wallet or multi-sig
- Only address needed (no private key exposed)
```

## Per-Request Wallet Override

Override the receiving wallet for individual requests:

```typescript
const client = new BankrClient({
  privateKey: process.env.BANKR_PRIVATE_KEY as `0x${string}`,
  walletAddress: process.env.DEFAULT_WALLET,
});

// Use default wallet
const result1 = await client.promptAndWait({
  prompt: "Swap 0.1 ETH to USDC",
});

// Override wallet for this request only
const result2 = await client.promptAndWait({
  prompt: "Buy $100 of DEGEN",
  walletAddress: "0xDifferentWallet123...",
});

// Back to default wallet
const result3 = await client.promptAndWait({
  prompt: "What are my balances?",
});
```

## Configuration Interface

Complete TypeScript interface for BankrClient configuration:

```typescript
interface BankrClientConfig {
  /**
   * Private key for x402 payment signing.
   * Must be a valid Ethereum private key with 0x prefix.
   * Required field.
   */
  privateKey: `0x${string}`;

  /**
   * Wallet address for receiving tokens and providing context.
   * If not provided, derived from privateKey.
   * Optional field.
   */
  walletAddress?: string;

  /**
   * API base URL.
   * Default: "https://api-staging.bankr.bot"
   * Optional field.
   */
  baseUrl?: string;

  /**
   * Request timeout in milliseconds.
   * Default: 600000 (10 minutes)
   * Optional field.
   */
  timeout?: number;
}
```

## Environment Setup

Configure environment variables for SDK usage:

### Required Variables

```bash
# Payment wallet private key (must have USDC on Base)
# Format: 64 hex characters with 0x prefix
BANKR_PRIVATE_KEY=0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
```

### Optional Variables

```bash
# Receiving wallet address (defaults to payment wallet address)
BANKR_WALLET_ADDRESS=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0

# API endpoint (defaults to production)
BANKR_API_URL=https://api-staging.bankr.bot
```

### .env File Example

```bash
# .env
BANKR_PRIVATE_KEY=0x...your_payment_wallet_key...
BANKR_WALLET_ADDRESS=0x...your_receiving_wallet_address...
```

Load with dotenv:

```typescript
import "dotenv/config";
import { BankrClient } from "@bankr/sdk";

const client = new BankrClient({
  privateKey: process.env.BANKR_PRIVATE_KEY as `0x${string}`,
  walletAddress: process.env.BANKR_WALLET_ADDRESS,
});
```

## Validation Helper

Validate configuration before creating the client:

```typescript
function createValidatedClient(): BankrClient {
  const pk = process.env.BANKR_PRIVATE_KEY;

  // Validate private key format
  if (!pk) {
    throw new Error("BANKR_PRIVATE_KEY environment variable is not set");
  }

  if (!pk.startsWith("0x")) {
    throw new Error("Private key must start with 0x prefix");
  }

  if (pk.length !== 66) {
    throw new Error("Private key must be 64 hex characters (66 with 0x prefix)");
  }

  // Validate hex characters
  const hexRegex = /^0x[0-9a-fA-F]{64}$/;
  if (!hexRegex.test(pk)) {
    throw new Error("Private key contains invalid characters");
  }

  // Validate wallet address if provided
  const walletAddress = process.env.BANKR_WALLET_ADDRESS;
  if (walletAddress) {
    const addressRegex = /^0x[0-9a-fA-F]{40}$/;
    if (!addressRegex.test(walletAddress)) {
      throw new Error("Invalid wallet address format");
    }
  }

  return new BankrClient({
    privateKey: pk as `0x${string}`,
    walletAddress,
  });
}

// Usage
try {
  const client = createValidatedClient();
  console.log(`Client initialized with wallet: ${client.getWalletAddress()}`);
} catch (error) {
  console.error(`Configuration error: ${error.message}`);
  process.exit(1);
}
```

## Address Derivation

Get the wallet address derived from the private key:

```typescript
const client = new BankrClient({
  privateKey: process.env.BANKR_PRIVATE_KEY as `0x${string}`,
});

// Get address derived from private key
const derivedAddress = client.getWalletAddress();
console.log(`Derived address: ${derivedAddress}`);

// If walletAddress was provided, it overrides the derived address
const clientWithOverride = new BankrClient({
  privateKey: process.env.BANKR_PRIVATE_KEY as `0x${string}`,
  walletAddress: "0xCustomAddress...",
});

// Returns the override address, not the derived one
const contextAddress = clientWithOverride.getWalletAddress();
console.log(`Context address: ${contextAddress}`);
```

## Security Best Practices

### Never Commit Private Keys

```bash
# Add to .gitignore
.env
.env.local
*.env
```

### Use Environment Variables

```typescript
// Good: Use environment variables
const client = new BankrClient({
  privateKey: process.env.BANKR_PRIVATE_KEY as `0x${string}`,
});

// Bad: Hardcoded private key (NEVER do this)
const client = new BankrClient({
  privateKey: "0x1234...", // Security risk!
});
```

### Minimize Payment Wallet Balance

Keep only small amounts in the payment wallet:

```
Recommended: $5-10 USDC on Base
Purpose: Covers 50-100 API requests
Refill: When balance drops below $2
```

### Separate Wallet Responsibilities

```
Payment Wallet:
- Hot wallet (private key in env)
- Minimal funds
- Single purpose: API payments

Trading Wallet:
- Could be hardware wallet
- Main trading funds
- Only address exposed to SDK
```

### Rotate Keys Periodically

If the payment wallet is compromised:
1. Transfer remaining USDC to new wallet
2. Generate new private key
3. Update environment variables
4. Fund new wallet with small USDC amount

## Error Handling

Handle initialization errors:

```typescript
try {
  const client = new BankrClient({
    privateKey: process.env.BANKR_PRIVATE_KEY as `0x${string}`,
  });

  // Verify client is functional
  const result = await client.promptAndWait({
    prompt: "What is 1 + 1?",
    timeout: 10000,
  });

  console.log("Client initialized successfully");

} catch (error) {
  if (error.message.includes("Invalid private key")) {
    console.error("Private key format is incorrect");
  } else if (error.message.includes("Insufficient USDC")) {
    console.error("Payment wallet needs USDC on Base");
  } else if (error.message.includes("Network error")) {
    console.error("Cannot connect to Bankr API");
  } else {
    console.error("Initialization failed:", error.message);
  }
}
```

## Testing Configuration

Test wallet configuration without making API calls:

```typescript
import { BankrClient } from "@bankr/sdk";

function testConfiguration() {
  const client = new BankrClient({
    privateKey: process.env.BANKR_PRIVATE_KEY as `0x${string}`,
    walletAddress: process.env.BANKR_WALLET_ADDRESS,
  });

  const address = client.getWalletAddress();

  console.log("Configuration Test:");
  console.log(`  Payment wallet: ${maskAddress(getPaymentAddress(client))}`);
  console.log(`  Context wallet: ${maskAddress(address)}`);
  console.log(`  API endpoint: ${client.baseUrl || "default"}`);
  console.log(`  Timeout: ${client.timeout || 600000}ms`);

  return true;
}

function maskAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

testConfiguration();
```

## Common Issues

### Missing Private Key

```
Error: BANKR_PRIVATE_KEY environment variable is not set
Solution: Set the environment variable or check .env file loading
```

### Invalid Key Format

```
Error: Private key must start with 0x prefix
Solution: Ensure key includes 0x prefix and is 66 characters total
```

### Insufficient USDC

```
Error: Insufficient USDC balance for payment
Solution: Fund payment wallet with USDC on Base chain
```

### Wrong Chain

```
Error: USDC must be on Base chain
Solution: Bridge USDC to Base or swap on Base
```
