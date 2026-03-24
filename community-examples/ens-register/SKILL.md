---
name: ens-register
description: Register ENS names on Ethereum mainnet using Bankr's natural language interface. Use when the user wants to register an ENS name (.eth domain), check ENS name availability, set up reverse records (primary name), or deploy content to ENS subdomains via IPFS. Includes complete workflow for commit-reveal registration, primary name configuration, and subdomain management.
---

# ENS Registration via Bankr

Register and configure ENS names (.eth domains) on Ethereum mainnet using Bankr's natural language crypto agent.

## Prerequisites

- **Bankr skill** installed and configured (`~/.openclaw/skills/bankr`)
- **ETH on Ethereum mainnet** (~0.003-0.005 ETH for registration + gas)
- **Wallet configured** in Bankr

Check balance before starting:
```bash
cd ~/.openclaw/skills/bankr && ./scripts/bankr.sh "what's my ethereum balance?"
```

## Quick Start

### 1. Check Name Availability

ENS names must be 3+ characters. Check if available:

```bash
cd ~/.openclaw/skills/bankr && ./scripts/bankr.sh "is my-name.eth available?"
```

### 2. Register the Name

Use Bankr's natural language interface:

```bash
cd ~/.openclaw/skills/bankr && ./scripts/bankr.sh "register my-name.eth for 1 year"
```

**What happens:**
1. Bankr submits commit transaction (frontrun protection)
2. Waits ~1 minute for commit to be mined
3. Submits register transaction (completes registration)
4. Optionally sets reverse record (primary name)

**Cost:** ~0.002-0.003 ETH ($5-7) for registration + gas

### 3. Set Primary Name (Reverse Record)

Make your address resolve to your ENS name:

```bash
cd ~/.openclaw/skills/bankr && ./scripts/bankr.sh "set my primary ENS name to my-name.eth on ethereum"
```

This sets the L1 reverse record. For Base L2, see [references/l2-setup.md](references/l2-setup.md).

## Creating Subdomains

### Register a Subdomain

```bash
cd ~/.openclaw/skills/bankr && ./scripts/bankr.sh "create subdomain demo.my-name.eth"
```

### Point Subdomain to IPFS Content

After deploying content to IPFS:

```bash
cd ~/.openclaw/skills/bankr && ./scripts/bankr.sh "set contenthash for demo.my-name.eth to ipfs://QmYOUR_CID_HERE"
```

Access via: `https://demo.my-name.eth.limo/`

## Common Workflows

### Deploy Static Site to ENS

1. Build your static site (HTML/CSS/JS)
2. Upload to IPFS: `ipfs add -r ./build`
3. Get CID from output
4. Set contenthash: `./scripts/bankr.sh "set contenthash for demo.my-name.eth to ipfs://Qm..."`
5. Access at `https://demo.my-name.eth.limo/`

See [references/ipfs-deployment.md](references/ipfs-deployment.md) for detailed IPFS workflow.

### Update Subdomain Content

1. Upload new version to IPFS
2. Update contenthash with new CID
3. Changes propagate within minutes

### Agent Identity Setup

For agents registering their identity:

```bash
# Register name
./scripts/bankr.sh "register agent-name.eth for 1 year"

# Set primary name (makes wallet resolve to ENS)
./scripts/bankr.sh "set my primary ENS name to agent-name.eth on ethereum"

# Create subdomain for dashboard
./scripts/bankr.sh "create subdomain dashboard.agent-name.eth"

# Deploy dashboard to IPFS and link
./scripts/bankr.sh "set contenthash for dashboard.agent-name.eth to ipfs://Qm..."
```

## Troubleshooting

### "Insufficient funds"
- Registration costs ~0.003 ETH total
- Check balance: `./scripts/bankr.sh "what's my ethereum balance?"`
- Bridge from Base if needed

### "Name not available"
- Name is already registered
- Try variations or check expiry on https://app.ens.domains

### "Commit not found"
- Wait 1-2 minutes after commit before registering
- Bankr handles timing automatically

### "Transaction reverted"
- Increase gas limit: Specify "with higher gas limit" in prompt
- Check Etherscan for detailed error

## Costs

- **Registration**: ~0.002 ETH/year ($5-6)
- **Gas (commit)**: ~0.00003 ETH ($0.08)
- **Gas (register)**: ~0.00026 ETH ($0.60)
- **Total**: ~0.003 ETH ($6-7) for 1 year

Longer registrations (3-5 years) are more cost-effective.

## Notes

- **Commit-reveal**: ENS uses two transactions to prevent frontrunning
- **Resolver**: Automatically set to ENS Public Resolver (0xF29100983...)
- **Renewals**: Must renew before expiry (set reminder for 11 months)
- **L2 Support**: Primary names work differently on Base/Arbitrum/Optimism (see references)

## Advanced Usage

For advanced topics, see reference files:

- **L2 Primary Names**: [references/l2-setup.md](references/l2-setup.md)
- **IPFS Deployment**: [references/ipfs-deployment.md](references/ipfs-deployment.md)
- **ENS Contracts**: [references/contracts.md](references/contracts.md)
- **Troubleshooting**: [references/troubleshooting.md](references/troubleshooting.md)

## Real Example

From Cruller's registration of `donut-agent.eth`:

```bash
# 1. Check availability
./scripts/bankr.sh "is donut-agent.eth available?"

# 2. Register for 1 year
./scripts/bankr.sh "register donut-agent.eth for 1 year"

# 3. Set primary name on L1
./scripts/bankr.sh "set my primary ENS name to donut-agent.eth on ethereum"

# 4. Create demo subdomain
./scripts/bankr.sh "create subdomain demo.donut-agent.eth"

# 5. Deploy dashboard to IPFS (got CID: QmNW7...)
ipfs add -r ./dashboard-build

# 6. Link subdomain to IPFS
./scripts/bankr.sh "set contenthash for demo.donut-agent.eth to ipfs://QmNW7suCmF95hRAjUGquEZVrd26u1Y7ocoRkiTQjvc7Bg9"

# Access: https://demo.donut-agent.eth.limo/
```

**Total cost**: 0.002555 ETH (~$6.11)
**Time**: ~5 minutes

## Why ENS?

- **Human-readable**: `agent.eth` vs `0x608044...3a72`
- **Decentralized**: No DNS, no takedowns
- **Portable**: Works across all Ethereum apps
- **Programmable**: Subdomains, contenthash, text records
- **Agent identity**: On-chain verifiable identity for AI agents

Perfect for agent web presence and decentralized app hosting.
