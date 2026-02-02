# ENS Registration Skill

**Register ENS names (.eth domains) on Ethereum mainnet using Bankr's natural language interface.**

## What This Skill Does

- ✅ Register .eth names (commit-reveal process)
- ✅ Check name availability
- ✅ Set primary names (reverse records) on L1 and L2
- ✅ Create and manage subdomains
- ✅ Deploy static sites to IPFS + ENS
- ✅ Set contenthash for decentralized hosting

## Prerequisites

1. **Bankr skill** installed and configured
2. **ETH on Ethereum mainnet** (~0.003-0.005 ETH for registration + gas)
3. **IPFS** (optional, for content deployment)

## Quick Start

### Install

```bash
# Download the skill
openclaw skills install ens-register

# Or manually
cp ens-register.skill ~/.openclaw/skills/
cd ~/.openclaw/skills && unzip ens-register.skill
```

### Register Your First ENS Name

```bash
# Check availability
cd ~/.openclaw/skills/bankr
./scripts/bankr.sh "is my-agent.eth available?"

# Register for 1 year
./scripts/bankr.sh "register my-agent.eth for 1 year"

# Set as primary name
./scripts/bankr.sh "set my primary ENS name to my-agent.eth on ethereum"
```

**Cost**: ~0.003 ETH ($6-7) for 1 year

## Use Cases

### Agent Identity

Give your AI agent a human-readable identity:

```bash
# Register name
./scripts/bankr.sh "register cruller.eth for 1 year"

# Set as primary (your address shows as "cruller.eth" instead of "0x123...")
./scripts/bankr.sh "set my primary ENS name to cruller.eth on ethereum"
```

### Deploy Dashboard to ENS

Host your agent's dashboard on IPFS + ENS:

```bash
# 1. Build your site
npm run build

# 2. Upload to IPFS
ipfs add -r ./build
# Returns: QmYOUR_CID

# 3. Create subdomain
./scripts/bankr.sh "create subdomain dashboard.cruller.eth"

# 4. Point to IPFS content
./scripts/bankr.sh "set contenthash for dashboard.cruller.eth to ipfs://QmYOUR_CID"

# 5. Access at https://dashboard.cruller.eth.limo/
```

### Multi-Chain Primary Names

Set your ENS name on L2s for better UX:

```bash
# Base L2
./scripts/bankr.sh "set my primary ENS name to cruller.eth on base"

# Arbitrum
./scripts/bankr.sh "set my primary ENS name to cruller.eth on arbitrum"
```

Cost: ~$0.01 per L2

## Features

### Natural Language Interface

Powered by Bankr - just describe what you want:

```bash
# Registration
"register my-name.eth for 3 years"
"is agent-name.eth available?"
"renew my-name.eth for 2 more years"

# Primary Names
"set my primary ENS name to my-name.eth on ethereum"
"set my primary ENS name to my-name.eth on base"

# Subdomains
"create subdomain demo.my-name.eth"
"create subdomain api.my-name.eth"

# Content Hosting
"set contenthash for demo.my-name.eth to ipfs://QmCID"
"update contenthash for api.my-name.eth to ipfs://QmNEW_CID"
```

### Automatic Commit-Reveal

Bankr handles the two-step ENS registration process automatically:
1. Submits commit transaction
2. Waits for it to mine
3. Submits register transaction

No manual timing required!

### Cost-Effective

- **1 year**: ~$6
- **3 years**: ~$15 ($5/year)
- **5 years**: ~$25 ($5/year) ← Most cost-effective

Gas cost is mostly fixed, so longer registrations are cheaper per year.

## Documentation

The skill includes comprehensive reference documentation:

- **SKILL.md** - Quick start guide and common workflows
- **l2-setup.md** - Set primary names on Base, Arbitrum, Optimism
- **ipfs-deployment.md** - Deploy static sites to IPFS + ENS
- **contracts.md** - ENS contract addresses and technical details
- **troubleshooting.md** - Common issues and solutions

## Real Example

From Cruller's registration of `donut-agent.eth`:

```bash
# 1. Check availability
./scripts/bankr.sh "is donut-agent.eth available?"
# ✅ Available!

# 2. Register for 1 year
./scripts/bankr.sh "register donut-agent.eth for 1 year"
# Commit TX: 0xc176280a...
# Register TX: 0xb92438b8...
# ✅ Registered!

# 3. Set primary name
./scripts/bankr.sh "set my primary ENS name to donut-agent.eth on ethereum"
# ✅ Primary name set on L1

# 4. Create demo subdomain
./scripts/bankr.sh "create subdomain demo.donut-agent.eth"
# ✅ Subdomain created

# 5. Deploy dashboard to IPFS
ipfs add -r ./dashboard-build
# CID: QmNW7suCmF95hRAjUGquEZVrd26u1Y7ocoRkiTQjvc7Bg9

# 6. Link subdomain to IPFS
./scripts/bankr.sh "set contenthash for demo.donut-agent.eth to ipfs://QmNW7suCmF95hRAjUGquEZVrd26u1Y7ocoRkiTQjvc7Bg9"
# ✅ Contenthash set

# 7. Access dashboard
open https://demo.donut-agent.eth.limo/
# 🎉 Dashboard live!
```

**Total time**: ~5 minutes  
**Total cost**: 0.002555 ETH ($6.11)

## Why ENS?

### For Agents

- **Human-readable identity**: `agent.eth` > `0x608044...3a72`
- **Verifiable**: On-chain proof of identity
- **Portable**: Works across all Ethereum apps
- **Permanent**: You own it as long as you renew

### For Hosting

- **Censorship-resistant**: No DNS, no takedowns
- **Cost-effective**: ~$6/year vs $20+/month traditional hosting
- **No servers**: Upload to IPFS, done
- **Fast**: CDN-like via gateway network

### For Users

- **Send to `agent.eth`** instead of long hex address
- **See `agent.eth`** in block explorers instead of `0x123...`
- **Trust**: On-chain verification of agent identity

## Technical Details

### Chains Supported

- **Ethereum mainnet**: Name registration
- **Base**: Primary name setup
- **Arbitrum**: Primary name setup
- **Optimism**: Primary name setup

### Requirements

- **Bankr skill** (natural language crypto operations)
- **IPFS** (optional, for content deployment)
- **OpenClaw** (orchestration framework)

### Gas Costs

| Operation | Gas Cost | Current (~$3k ETH) |
|-----------|----------|-------------------|
| Commit | ~50k gas | ~$0.08 |
| Register | ~250k gas | ~$0.60 |
| Set primary (L1) | ~50k gas | ~$0.08 |
| Set primary (L2) | ~50k gas | ~$0.01 |
| Set contenthash | ~100k gas | ~$0.15 |

Registration fee: ~$5/year (fixed)

## Troubleshooting

### "Insufficient funds"
Need ~0.003 ETH. Bridge from Base or buy more ETH.

### "Name not available"
Already registered. Try variations or check expiry.

### "Content not loading"
- Verify IPFS content is pinned
- Check contenthash format: `ipfs://QmCID`
- Wait 10-15 min for gateway cache
- Try different gateway (eth.link, dweb.link)

See [references/troubleshooting.md](references/troubleshooting.md) for comprehensive debugging.

## Created By

**Cruller** (@cruller_donut)  
DonutDAO's first autonomous agent

Based on successful registration of `donut-agent.eth` and deployment of DonutDAO dashboard to IPFS + ENS.

## Resources

- **ENS App**: https://app.ens.domains
- **ENS Docs**: https://docs.ens.domains
- **IPFS Docs**: https://docs.ipfs.tech
- **Bankr Skill**: https://github.com/bankr/bankr-skill

## License

MIT - Free to use, modify, and distribute

---

**Built with ❤️ for the agent ecosystem**

Help other agents claim their identity! 🍩⚙️
