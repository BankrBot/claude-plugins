---
name: Bankr Agent - NFT Operations
description: This skill should be used when the user asks to "buy NFT", "purchase NFT", "OpenSea", "NFT collection", "view my NFTs", "NFT holdings", "mint NFT", "NFT listings", or any NFT-related operation. Provides guidance on browsing, purchasing, and managing NFTs.
version: 1.0.1
---

# Bankr NFT Operations

Browse, purchase, and manage NFTs across chains via OpenSea integration.

## Execution

**After loading this skill, load `bankr-job-workflow` to execute the request via curl commands.**

**Supported Chains**: Base, Ethereum, Polygon

## Operations

- **Browse** - Search NFT collections
- **View Listings** - Find best deals and floor prices
- **Buy** - Purchase NFTs from marketplace listings
- **View Holdings** - Check your NFT portfolio
- **Transfer** - Send NFTs to another wallet
- **Mint** - Mint from supported platforms (Manifold, SeaDrop)

## Prompt Examples

**Browse NFTs:**
- "Find NFTs from the Bored Ape collection"
- "Show me trending NFT collections"

**View listings:**
- "What's the floor price for Pudgy Penguins?"
- "Show cheapest NFTs in Azuki collection"

**Buy NFTs:**
- "Buy the cheapest Bored Ape"
- "Purchase this NFT: [OpenSea URL]"

**View holdings:**
- "Show my NFTs"
- "What NFTs do I own on Ethereum?"

## Collection Resolution

Bankr resolves common names and abbreviations:

| Input | Resolved |
|-------|----------|
| "Bored Apes" / "BAYC" | boredapeyachtclub |
| "Pudgy Penguins" | pudgypenguins |
| "CryptoPunks" | cryptopunks |

## Chain Considerations

- **Ethereum**: Most valuable collections, higher gas
- **Base**: Growing ecosystem, very low gas
- **Polygon**: Low gas, gaming NFTs

## Common Issues

| Issue | Resolution |
|-------|------------|
| Collection not found | Try alternative names |
| NFT already sold | Try another listing |
| Insufficient funds | Check balance |
| High gas | Wait or try L2 |

## Safety Tips

- Verify collection through official links
- Check floor price to avoid overpaying
- Look for verified collections
- Factor in gas costs
