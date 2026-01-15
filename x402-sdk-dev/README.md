# x402-sdk-dev Plugin

Claude Code integration for [@bankr/sdk](https://www.npmjs.com/package/@bankr/sdk) - AI-assisted Web3 development with multi-chain DeFi.

## Features

- **Multi-Chain**: Base, Polygon, Ethereum, Solana
- **Token Swaps**: AI-powered with 0x routing
- **x402 Payments**: $0.10 USDC per request (Base network)
- **Job Management**: Async submission, polling, cancellation
- **12 Transaction Types**: Swaps, transfers, approvals, NFT ops, DeFi

## Quick Start

```bash
# 1. Copy plugin
cp -r packages/claude-plugins-marketplace/x402-sdk-dev .claude/plugins/

# 2. Install SDK
npm install @bankr/sdk

# 3. Configure environment
export BANKR_PRIVATE_KEY=0x...  # Required: pays $0.10 USDC per request (needs USDC on Base)
export BANKR_WALLET_ADDRESS=0x... # Optional: receives swapped tokens
export BANKR_API_URL=https://api-staging.bankr.bot  # Optional
```

Enable in `.claude/settings.json`:
```json
{ "enabledPlugins": { "x402-sdk-dev@bankr": true } }
```

## Skills

| Skill | Description |
|-------|-------------|
| `sdk-wallet-operations` | Client init, wallet config, address derivation |
| `sdk-token-swaps` | Multi-chain swaps with 0x routing |
| `sdk-balance-queries` | Token balances, portfolio values |
| `sdk-transaction-builder` | Transfers, approvals, NFTs, DeFi |
| `sdk-job-management` | Async job control and monitoring |

## Agent

**web3-dev-assistant** - Guided Web3 development with SDK integration, swap building, and best practices.

## Basic Usage

```typescript
import { BankrClient } from "@bankr/sdk";

const client = new BankrClient({
  privateKey: process.env.BANKR_PRIVATE_KEY as `0x${string}`,
  walletAddress: process.env.BANKR_WALLET_ADDRESS,
});

// Token swap
const swap = await client.promptAndWait({
  prompt: "Swap 0.1 ETH to USDC on Base",
});

// Balance query
const balances = await client.promptAndWait({
  prompt: "What are my token balances?",
});

// Execute returned transaction with your wallet (viem/ethers)
const tx = swap.transactions?.[0].metadata.transaction;
```

## Critical: 0x Swap Approval

For ERC20 swaps, you **must approve the `allowanceTarget`** before executing:

```typescript
const result = await client.promptAndWait({ prompt: "Swap 100 USDC to WETH" });
const swapTx = result.transactions?.find(tx => tx.type === "swap");

if (swapTx?.metadata.allowanceTarget) {
  // 1. Approve allowanceTarget to spend your tokens
  // 2. Then execute swapTx.metadata.transaction
}
```

See [0x AllowanceHolder docs](https://0x.org/docs/introduction/0x-cheat-sheet#allowanceholder-recommended).

## Transaction Types

`swap` | `approval` | `transfer_erc20` | `transfer_eth` | `convert_eth_to_weth` | `convert_weth_to_eth` | `transfer_nft` | `mint_manifold_nft` | `mint_seadrop_nft` | `buy_nft` | `avantisTrade` | `swapCrossChain` | `manage_bankr_staking`

## Two-Wallet System

- **Payment Wallet** (`privateKey`): Pays $0.10 USDC per request. Must have USDC on Base.
- **Context Wallet** (`walletAddress`): Receives swapped tokens. Can be different from payment wallet.

## Troubleshooting

| Error | Solution |
|-------|----------|
| "Payment required" | Add USDC to payment wallet on Base |
| "Invalid wallet address" | Check 0x-prefixed address format |
| Transaction fails | Approve `allowanceTarget` for ERC20 swaps |
| Timeout | Increase timeout or use manual polling |

## Links

[SDK Package](https://www.npmjs.com/package/@bankr/sdk) | [Bankr](https://bankr.bot) | [Docs](https://docs.bankr.bot) | [Discord](https://discord.gg/bankr) | [x402 Protocol](https://www.x402.org/)
