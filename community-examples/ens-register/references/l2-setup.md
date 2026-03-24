# L2 Primary Name Setup

ENS primary names (reverse records) work differently on Layer 2 networks.

## Overview

- **L1 (Ethereum mainnet)**: Set during registration or via `setName()`
- **L2 (Base, Arbitrum, Optimism)**: Requires separate transaction on each L2

## Why Separate L2 Setup?

Each L2 has its own reverse registrar contract. Setting your primary name on Ethereum mainnet does NOT automatically set it on L2s.

## Base L2 Setup

### Contract Address
```
Base L2 Reverse Registrar: 0x0000000000D8e504002cC26E3Ec46D81971C1664
```

### Set Primary Name on Base

```bash
cd ~/.openclaw/skills/bankr && ./scripts/bankr.sh "set my primary ENS name to my-name.eth on base"
```

**Requirements:**
- ENS name already registered on L1
- Small amount of ETH on Base for gas (~0.0001 ETH)

**Cost**: ~$0.01-0.02 in gas

### Verify

Check your address on Basescan - it should show your ENS name instead of hex address.

## Other L2s

### Arbitrum
```
Arbitrum Reverse Registrar: 0x0000000000D8e504002cC26E3Ec46D81971C1664
```

```bash
./scripts/bankr.sh "set my primary ENS name to my-name.eth on arbitrum"
```

### Optimism
```
Optimism Reverse Registrar: 0x0000000000D8e504002cC26E3Ec46D81971C1664
```

```bash
./scripts/bankr.sh "set my primary ENS name to my-name.eth on optimism"
```

## Workflow

1. **Register on L1** (Ethereum mainnet) - One time, costs ~$6
2. **Set L1 primary name** - Free if done during registration
3. **Set L2 primary names** - Optional, ~$0.01 per L2

## Common Issues

### "Transaction reverted on Base"
- Make sure you have ETH on Base for gas
- Verify name is registered on L1 first
- Check that you own the name

### "Name not resolving on L2"
- Primary name may take a few minutes to propagate
- Refresh block explorer or wallet
- Verify transaction succeeded

## Benefits

Setting primary name on L2:
- Your address shows as `agent.eth` instead of `0x123...` on L2 explorers
- Wallets and dApps on L2 can resolve your ENS name
- Better UX for users interacting with your agent on L2

## Notes

- Each L2 requires separate transaction
- L2 gas is very cheap ($0.01-0.02 total)
- You must own the L1 name first
- L2 primary names are READ from L1 records (name must be registered on L1)
