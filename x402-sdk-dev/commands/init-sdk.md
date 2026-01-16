---
name: init-sdk
description: Initialize Bankr SDK in current project - installs package, creates client file, sets up environment
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
argument-hint: "[output-path]"
---

# Initialize Bankr SDK

Set up the Bankr SDK in the user's project with proper configuration.

## Arguments

- `[output-path]` (optional): Directory for the client file. Defaults to `src/` if it exists, otherwise project root.

## Workflow

### Step 1: Detect Project Configuration

Check the project setup:

```bash
# Check for package.json (required)
ls package.json

# Detect package manager from lockfiles
ls package-lock.json 2>/dev/null  # npm
ls yarn.lock 2>/dev/null          # yarn
ls pnpm-lock.yaml 2>/dev/null     # pnpm
ls bun.lockb 2>/dev/null          # bun
```

**Package manager priority:** bun.lockb > pnpm-lock.yaml > yarn.lock > package-lock.json > default to npm

Check for TypeScript:
```bash
ls tsconfig.json 2>/dev/null
```

If `tsconfig.json` exists, use TypeScript (`.ts`). Otherwise use JavaScript (`.js`).

### Step 2: Check if SDK Already Installed

```bash
grep -q "@bankr/sdk" package.json
```

If not found, install it using the detected package manager:

| Manager | Command |
|---------|---------|
| npm | `npm install @bankr/sdk` |
| yarn | `yarn add @bankr/sdk` |
| pnpm | `pnpm add @bankr/sdk` |
| bun | `bun add @bankr/sdk` |

### Step 3: Determine Output Path

1. If user provided `[output-path]`, use that
2. Else if `src/` directory exists, use `src/`
3. Else if `lib/` directory exists, use `lib/`
4. Else use project root

### Step 4: Create Client File

Create the appropriate file based on TypeScript detection.

**For TypeScript (`bankr-client.ts`):**

```typescript
import { BankrClient } from "@bankr/sdk";

/**
 * Bankr SDK Client
 *
 * Provides AI-powered Web3 operations with x402 micropayments.
 * Each API request costs $0.01 USDC (paid from payment wallet on Base).
 *
 * Environment Variables:
 *   BANKR_PRIVATE_KEY - Required: Payment wallet private key (needs USDC on Base)
 *   BANKR_WALLET_ADDRESS - Optional: Receiving wallet (defaults to payment wallet)
 *   BANKR_API_URL - Optional: API endpoint (defaults to https://api.bankr.bot)
 *
 * @example
 * ```typescript
 * import { bankrClient } from "./bankr-client";
 *
 * // Token swap
 * const swap = await bankrClient.promptAndWait({
 *   prompt: "Swap 0.1 ETH to USDC on Base",
 * });
 *
 * // Check balances
 * const balances = await bankrClient.promptAndWait({
 *   prompt: "What are my token balances?",
 * });
 *
 * // The SDK returns transaction data - execute with viem/ethers
 * if (swap.status === "completed" && swap.transactions) {
 *   const tx = swap.transactions[0].metadata.transaction;
 *   // await wallet.sendTransaction(tx);
 * }
 * ```
 *
 * @see https://www.npmjs.com/package/@bankr/sdk
 * @see https://docs.bankr.bot
 */

// Validate required environment variable
if (!process.env.BANKR_PRIVATE_KEY) {
  throw new Error(
    "BANKR_PRIVATE_KEY environment variable is required. " +
    "This wallet pays $0.01 USDC per request and must have USDC on Base."
  );
}

export const bankrClient = new BankrClient({
  // Required: Payment wallet private key
  // This wallet pays $0.01 USDC per API request (must have USDC on Base)
  privateKey: process.env.BANKR_PRIVATE_KEY as `0x${string}`,

  // Optional: Override receiving wallet address
  // If not set, tokens are sent to the payment wallet address
  walletAddress: process.env.BANKR_WALLET_ADDRESS,

  // Optional: API endpoint (defaults to production)
  ...(process.env.BANKR_API_URL && { baseUrl: process.env.BANKR_API_URL }),
});

// Export the wallet address for reference
export const bankrWalletAddress = bankrClient.getWalletAddress();
```

**For JavaScript (`bankr-client.js`):**

```javascript
const { BankrClient } = require("@bankr/sdk");

/**
 * Bankr SDK Client
 *
 * Provides AI-powered Web3 operations with x402 micropayments.
 * Each API request costs $0.01 USDC (paid from payment wallet on Base).
 *
 * Environment Variables:
 *   BANKR_PRIVATE_KEY - Required: Payment wallet private key (needs USDC on Base)
 *   BANKR_WALLET_ADDRESS - Optional: Receiving wallet (defaults to payment wallet)
 *   BANKR_API_URL - Optional: API endpoint (defaults to https://api.bankr.bot)
 *
 * @example
 * ```javascript
 * const { bankrClient } = require("./bankr-client");
 *
 * // Token swap
 * const swap = await bankrClient.promptAndWait({
 *   prompt: "Swap 0.1 ETH to USDC on Base",
 * });
 *
 * // Check balances
 * const balances = await bankrClient.promptAndWait({
 *   prompt: "What are my token balances?",
 * });
 * ```
 *
 * @see https://www.npmjs.com/package/@bankr/sdk
 * @see https://docs.bankr.bot
 */

// Validate required environment variable
if (!process.env.BANKR_PRIVATE_KEY) {
  throw new Error(
    "BANKR_PRIVATE_KEY environment variable is required. " +
    "This wallet pays $0.01 USDC per request and must have USDC on Base."
  );
}

const bankrClient = new BankrClient({
  // Required: Payment wallet private key
  privateKey: process.env.BANKR_PRIVATE_KEY,

  // Optional: Override receiving wallet address
  walletAddress: process.env.BANKR_WALLET_ADDRESS,

  // Optional: API endpoint
  ...(process.env.BANKR_API_URL && { baseUrl: process.env.BANKR_API_URL }),
});

// Export the client and wallet address
module.exports = {
  bankrClient,
  bankrWalletAddress: bankrClient.getWalletAddress(),
};
```

### Step 5: Create/Update .env.example

Check if `.env.example` exists. If it does, append the Bankr variables (if not already present). If it doesn't exist, create it.

```bash
# .env.example content to add:

# Bankr SDK Configuration
# See: https://docs.bankr.bot

# Required: Payment wallet private key
# This wallet pays $0.01 USDC per API request (must have USDC on Base)
# Format: 64 hex characters with 0x prefix
BANKR_PRIVATE_KEY=0x

# Optional: Receiving wallet address
# Tokens from swaps/purchases go here. Defaults to payment wallet if not set.
# BANKR_WALLET_ADDRESS=0x

# Optional: API endpoint override (defaults to https://api.bankr.bot)
# BANKR_API_URL=https://api.bankr.bot
```

### Step 6: Check .gitignore

Verify `.env` is in `.gitignore` to prevent committing secrets:

```bash
grep -q "^\.env$" .gitignore 2>/dev/null || grep -q "\.env" .gitignore 2>/dev/null
```

If not found, warn the user to add `.env` to `.gitignore`.

### Step 7: Summary

After completing all steps, show a summary:

```
Bankr SDK initialized successfully!

Created:
  - {output-path}/bankr-client.{ts|js}
  - .env.example (updated with Bankr variables)

Next steps:
  1. Copy .env.example to .env
  2. Add your payment wallet private key to BANKR_PRIVATE_KEY
  3. Fund the wallet with USDC on Base ($1-2 recommended)
  4. Import and use:

     import { bankrClient } from "{output-path}/bankr-client";

     const result = await bankrClient.promptAndWait({
       prompt: "Swap 0.1 ETH to USDC on Base",
     });

Documentation: https://docs.bankr.bot
```

## Error Handling

- **No package.json**: "This command must be run in a Node.js project with package.json"
- **SDK install fails**: Show the error and suggest manual installation
- **File already exists**: Ask user if they want to overwrite

## Tips

- If the user specifies a custom path like `lib/services`, create the directory if needed
- Preserve existing content in .env.example, only append new variables
- Use ES modules syntax if package.json has `"type": "module"` (even for .js files)
