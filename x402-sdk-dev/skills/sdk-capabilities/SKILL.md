---
name: SDK Capabilities
description: This skill should be used when the user asks "what can the SDK do", "what prompts does Bankr support", "SDK features", "supported operations", "what can I build with Bankr", "Bankr SDK capabilities", "what chains are supported", "what tokens can I trade", "SDK supported commands", or wants to understand the full range of operations available through the Bankr SDK.
version: 1.0.0
---

# SDK Capabilities

Complete guide to all operations supported by the Bankr SDK. The SDK accepts natural language prompts and returns transaction data for execution.

## Overview

The Bankr SDK provides AI-powered Web3 operations through natural language prompts. The SDK operates in **wallet mode**, meaning it returns transaction data for you to sign and execute rather than executing transactions directly.

**Key features:**
- Natural language interface (no complex API calls)
- Multi-chain support (EVM chains: Base, Ethereum, Polygon)
- Transaction building with optimal 0x routing
- Market data and analysis
- x402 micropayments ($0.01 USDC per request)

## Supported Chains

| Chain | Native Token | Notes |
|-------|-------------|-------|
| Base | ETH | Default chain, lowest fees |
| Ethereum | ETH | Mainnet |
| Polygon | MATIC | L2, low fees |

**Note:** Solana cross-chain swaps are NOT supported via SDK. The SDK operates in wallet mode which has limited Solana support.

---

## SUPPORTED Operations

### Token Swaps

Exchange tokens on the same chain using 0x routing.

**Example prompts:**
```
"Swap 0.1 ETH to USDC"
"Exchange 100 USDC for WETH"
"Swap 1000 DEGEN to ETH"
"Swap 50% of my ETH to USDC"
"Sell all my DEGEN"
"Swap 0.1 ETH to USDC on Base"
"Exchange 100 USDC for WETH on Polygon"
"Buy $100 of ETH"
"Buy $5 of DEGEN"
"Purchase $50 worth of BNKR"
```

### ERC20 Transfers

Send ERC20 tokens to addresses or social usernames.

**Example prompts:**
```
"Send 100 USDC to 0x1234..."
"Transfer 50 BNKR to @farcasteruser"
"Send 100 USDC to @username"
```

### Native Token Transfers

Send ETH/MATIC to addresses.

**Example prompts:**
```
"Send 0.1 ETH to 0xabcd..."
"Transfer 0.5 ETH to @username"
```

### ETH/WETH Conversion

Wrap and unwrap ETH.

**Example prompts:**
```
"Wrap 1 ETH"
"Convert 0.5 ETH to WETH"
"Unwrap 1 WETH"
"Convert WETH to ETH"
```

### Cross-Chain Swaps (EVM Only)

Bridge or swap tokens across EVM chains. **Solana cross-chain is NOT supported.**

**Example prompts:**
```
"Swap 10 USDC on Base to USDC on Polygon"
"Bridge 1 ETH from Ethereum to Base"
"Swap 100 USDC on Polygon to ETH on Mainnet"
```

### Avantis Leveraged Trading

Trade commodities, forex, and crypto with leverage on Base.

**Available assets:** BTC/USD, ETH/USD, GOLD, SILVER, OIL, EUR/USD, GBP/USD, and more.

**Example prompts:**
```
"Buy $5 of BTC/USD"
"Short $10 of GOLD"
"Long $50 of ETH/USD"
"Buy $10 of GOLD with 5x leverage"
"Short BTC/USD with 10x leverage"
"Buy $25 of OIL with 10x leverage and 5% stop loss"
"Long $50 of ETH/USD with take profit at 150%"
"Buy $100 of BTC/USD with stop loss if price drops by $5000"
```

### Close Avantis Positions

**Example prompts:**
```
"Close all my BTC/USD positions"
"Close all my OIL positions"
"Close my ETH/USD position"
"Close $50 of my GOLD position"
"Close my Bitcoin long"
```

### View Avantis Positions

**Example prompts:**
```
"Show my Avantis positions"
"What are my Avantis positions"
"View my Avantis portfolio"
"What positions do I have on Avantis"
"Show my closed Avantis trades"
```

### Buy NFTs

Purchase NFTs from OpenSea.

**Example prompts:**
```
"Buy the cheapest Tiny Dino NFT"
"Get me an OK Computer NFT"
"Purchase the floor BasedPunk"
"Buy this NFT: https://opensea.io/collection/okcomputers"
"Purchase token #1234 from BasePaint"
```

### Transfer NFTs

Send NFTs to other addresses.

**Example prompts:**
```
"Send my Bored Ape #123 to 0x..."
"Transfer NFT to @username"
```

### List NFTs for Sale

List your NFTs on OpenSea.

**Example prompts:**
```
"List my Bored Ape for 10 ETH"
"Sell my NFT for 5 ETH"
```

### Cancel NFT Listings

**Example prompts:**
```
"Cancel my NFT listing"
"Remove my Bored Ape from sale"
```

### Accept NFT Offers

**Example prompts:**
```
"Accept offer on my NFT"
"Accept the highest offer on my Bored Ape"
```

### Mint NFTs (SeaDrop)

Mint NFTs via SeaDrop protocol.

**Example prompts:**
```
"Mint from the SeaDrop collection at 0x..."
```

### Mint NFTs (Manifold)

Mint NFTs via Manifold.

**Example prompts:**
```
"Mint the Manifold NFT at 0x..."
```

### BNKR Staking

Stake and unstake BNKR tokens.

**Example prompts:**
```
"Stake 1000 BNKR"
"Unstake my BNKR"
"How much BNKR do I have staked?"
```

### View Automations

View your active automations.

**Example prompts:**
```
"Show my automations"
"What automations do I have?"
```

### Cancel Automations

Cancel existing automations.

**Example prompts:**
```
"Cancel my automation"
"Stop all my automations"
```

### Balance Queries

Check token balances.

**Example prompts:**
```
"What are my balances?"
"Show my balances on Base"
"What tokens do I hold?"
"Balances on Polygon"
```

### NFT Balances

Check NFT holdings.

**Example prompts:**
```
"What NFTs do I own?"
"Show my NFTs on Base"
"Do I have any Bored Apes?"
```

### NFT Listings Discovery

Browse NFT listings.

**Example prompts:**
```
"Show me the cheapest Bored Apes"
"What are the top 5 CryptoPunk listings"
"Show me NFTs from BasedPunks"
"What's the floor price for Azuki"
```

### Token Analysis

Get price, market cap, volume, technical analysis, and social sentiment.

**Example prompts:**
```
"Price of ETH"
"What's BTC trading at?"
"Market cap of BNKR"
"Volume of USDC"
"Analyze ETH"
"TA for BNKR"
"Chart analysis for DEGEN"
```

### Token Discovery

Find trending tokens.

**Example prompts:**
```
"What tokens do you recommend on Base?"
"Top tokens on Polygon today"
"Best coins on mainnet right now"
"Trending tokens on Base"
```

---

## NOT SUPPORTED Operations

The following features are not available via the SDK:

### Polymarket

Not supported via SDK:
- Placing bets
- Selling positions
- Redeeming winnings

Use the Bankr trading wallet directly at https://bankr.bot

### Limit Orders

Not supported via SDK. Use https://swap.bankr.bot to place limit orders.

### Automated Orders

Not supported via SDK:
- Stop orders
- TWAP (Time-Weighted Average Price) orders
- DCA (Dollar-Cost Averaging) orders

Use https://swap.bankr.bot to set up automated orders.

### Bankr Earn

Not supported via SDK. Use the Bankr terminal to manage earn.

### Featured NFT Mints

Some featured mints require the Bankr trading wallet and are not available via SDK.

### Solana Cross-Chain Swaps

Solana cross-chain swaps are not supported via SDK. Only EVM chains (Base, Ethereum, Polygon) are supported.

## Transaction Types

The SDK returns transactions with a `type` field. Use this to identify and handle different operations:

| Type | Description |
|------|-------------|
| `swap` | Token exchange via 0x routing |
| `approval` | ERC20 token approval |
| `transfer_erc20` | ERC20 token transfer |
| `transfer_eth` | Native ETH transfer |
| `convert_eth_to_weth` | Wrap ETH to WETH |
| `convert_weth_to_eth` | Unwrap WETH to ETH |
| `transfer_nft` | NFT transfer |
| `mint_manifold_nft` | Mint via Manifold |
| `mint_seadrop_nft` | Mint via SeaDrop |
| `buy_nft` | Purchase NFT |
| `avantisTrade` | Avantis leveraged trade |
| `swapCrossChain` | Cross-chain swap (EVM only) |
| `manage_bankr_staking` | BNKR staking |

---

## Usage Pattern

```typescript
import { BankrClient } from "@bankr/sdk";

const client = new BankrClient({
  privateKey: process.env.BANKR_PRIVATE_KEY as `0x${string}`,
  walletAddress: process.env.BANKR_WALLET_ADDRESS,
});

const result = await client.promptAndWait({
  prompt: "Swap 0.1 ETH to USDC on Base",
});

if (result.status === "completed") {
  // For trading operations: execute the returned transaction
  if (result.transactions?.length) {
    const swapTx = result.transactions.find(tx => tx.type === "swap");

    // Handle approval if needed
    if (swapTx?.metadata.approvalRequired) {
      await wallet.sendTransaction(swapTx.metadata.approvalTx);
    }

    // Execute the swap
    const tx = swapTx.metadata.transaction;
    await wallet.sendTransaction(tx);
  }

  // For queries: read the response
  console.log(result.response);
}
```

---

## Cost

Each request costs $0.01 USDC via x402 micropayments. The payment wallet must have USDC on Base chain.

| Requests | Cost |
|----------|------|
| 100 | $1.00 |
| 1,000 | $10.00 |
| 10,000 | $100.00 |

Gas fees for executing transactions are paid separately from the user's wallet.
