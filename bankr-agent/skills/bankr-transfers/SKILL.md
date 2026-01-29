---
name: Bankr Agent - Transfers
description: This skill should be used when the user asks to "send tokens", "transfer ETH", "send to ENS", "transfer to wallet", "send to @username", "transfer to Farcaster", "send to Twitter handle", or any asset transfer operation. Provides guidance on recipient resolution and transfer formats.
version: 1.0.1
---

# Bankr Transfers

Transfer tokens to addresses, ENS names, or social handles.

## Execution

**After loading this skill, load `bankr-job-workflow` to execute the request via curl commands.**

## Supported Transfers

- **EVM Chains**: Base, Polygon, Ethereum, Unichain (ETH, MATIC, ERC20 tokens)
- **Solana**: SOL and SPL tokens

## Recipient Formats

| Format | Example | Description |
|--------|---------|-------------|
| Address | `0x1234...abcd` | Direct wallet address |
| ENS | `vitalik.eth` | Ethereum Name Service |
| Twitter | `@elonmusk` | Twitter/X username |
| Farcaster | `@dwr.eth` | Farcaster username |
| Telegram | `@username` | Telegram handle |

Social handles are resolved to linked wallet addresses before sending.

## Amount Formats

| Format | Example | Description |
|--------|---------|-------------|
| USD | `$50` | Dollar amount |
| Percentage | `50%` | Percentage of balance |
| Exact | `0.1 ETH` | Specific amount |

## Prompt Examples

**To addresses:**
- "Send 0.5 ETH to 0x1234..."
- "Transfer 100 USDC to 0xabcd..."

**To ENS:**
- "Send 1 ETH to vitalik.eth"
- "Transfer $50 of USDC to mydomain.eth"

**To social handles:**
- "Send $20 of ETH to @friend on Twitter"
- "Transfer 0.1 ETH to @user on Farcaster"

**With chain specified:**
- "Send ETH on Base to vitalik.eth"
- "Send 10% of my ETH to @friend"

## Chain Selection

If not specified, Bankr selects automatically based on recipient activity and gas costs. Specify chain in prompt if needed.

## Common Issues

| Issue | Resolution |
|-------|------------|
| ENS not found | Verify the ENS name exists |
| Social handle not found | Check username is correct |
| No linked wallet | User hasn't linked wallet to social |
| Insufficient balance | Reduce amount or add funds |

## Security Notes

- Always verify recipient before confirming
- Social handle resolution shows the resolved address
- Large transfers may require additional confirmation
