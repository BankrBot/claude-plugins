# IPFS + ENS Deployment

Deploy static websites to IPFS and access them via ENS subdomains.

## Overview

**Traditional Web**: Domain → DNS → Server IP → Website  
**Decentralized Web**: ENS → Contenthash → IPFS CID → Website

**Benefits:**
- Censorship-resistant (no central server)
- No hosting costs (IPFS is peer-to-peer)
- Immutable (content-addressed)
- Fast (CDN-like via gateways)

## Quick Workflow

```bash
# 1. Build your static site
npm run build  # or whatever builds your site

# 2. Upload to IPFS
ipfs add -r ./build

# Result: QmYOUR_CID_HERE

# 3. Set ENS contenthash
cd ~/.openclaw/skills/bankr
./scripts/bankr.sh "set contenthash for demo.my-name.eth to ipfs://QmYOUR_CID_HERE"

# 4. Access via ENS gateway
open https://demo.my-name.eth.limo/
```

## IPFS Installation

### Option 1: IPFS Desktop (Recommended)
Download from: https://docs.ipfs.tech/install/ipfs-desktop/

### Option 2: Command Line
```bash
# macOS
brew install ipfs

# Linux
wget https://dist.ipfs.tech/kubo/v0.25.0/kubo_v0.25.0_linux-amd64.tar.gz
tar -xvzf kubo_v0.25.0_linux-amd64.tar.gz
cd kubo && sudo bash install.sh

# Initialize
ipfs init
ipfs daemon
```

## Uploading to IPFS

### Single File
```bash
ipfs add index.html
# Returns: added QmHash index.html
```

### Directory (Recommended for websites)
```bash
ipfs add -r ./build
# Returns: added QmHash build
```

### Pin to Keep Content Available
```bash
ipfs pin add QmYOUR_CID
```

**Note**: Content stays available as long as at least one IPFS node has it pinned.

## ENS Contenthash Setup

### Create Subdomain
```bash
./scripts/bankr.sh "create subdomain demo.my-name.eth"
```

### Set Contenthash
```bash
./scripts/bankr.sh "set contenthash for demo.my-name.eth to ipfs://QmYOUR_CID"
```

**Format**: Always use `ipfs://` prefix

### Update Content
```bash
# Upload new version
ipfs add -r ./new-build
# Get new CID

# Update contenthash
./scripts/bankr.sh "set contenthash for demo.my-name.eth to ipfs://QmNEW_CID"
```

## Accessing Your Site

### Via ENS Gateways
- **eth.limo**: `https://demo.my-name.eth.limo/` (Recommended)
- **eth.link**: `https://demo.my-name.eth.link/`
- **dweb.link**: `https://demo.my-name.eth.dweb.link/`

### Via IPFS Gateways (Direct)
- `https://ipfs.io/ipfs/QmYOUR_CID`
- `https://cloudflare-ipfs.com/ipfs/QmYOUR_CID`
- `https://gateway.pinata.cloud/ipfs/QmYOUR_CID`

### Via IPFS Desktop
- `ipfs://QmYOUR_CID` (requires IPFS companion browser extension)

## Best Practices

### 1. Build Optimization
```bash
# Minimize file sizes
npm run build --production

# Compress images
# Remove source maps in production
```

### 2. IPFS Pinning Services

For production, use a pinning service to ensure availability:

**Free Tier:**
- **Pinata**: 1 GB free
- **NFT.Storage**: Unlimited free (Web3.Storage)
- **Fleek**: Free hosting + CDN

**Setup Pinata:**
```bash
# Upload via API
curl -X POST "https://api.pinata.cloud/pinning/pinFileToIPFS" \
  -H "pinata_api_key: YOUR_KEY" \
  -H "pinata_secret_api_key: YOUR_SECRET" \
  -F "file=@./build"
```

### 3. Content Updates

**Immutable**: IPFS content is content-addressed (CID = hash of content)

**To update:**
1. Upload new version (gets new CID)
2. Update ENS contenthash to new CID
3. Old version still accessible via old CID (unless unpinned)

### 4. Cache Busting

ENS gateways cache content. To force refresh:
- Use versioned subdomains: `v1.app.eth`, `v2.app.eth`
- Or wait ~5-10 minutes for cache to clear after contenthash update

## Example: DonutDAO Dashboard

Real example from Cruller's deployment:

```bash
# Built Next.js app
cd donutdao-dashboard
npm run build
npm run export  # Static export

# Uploaded to IPFS
ipfs add -r ./out
# Got CID: QmNW7suCmF95hRAjUGquEZVrd26u1Y7ocoRkiTQjvc7Bg9

# Set contenthash
./scripts/bankr.sh "set contenthash for demo.donut-agent.eth to ipfs://QmNW7suCmF95hRAjUGquEZVrd26u1Y7ocoRkiTQjvc7Bg9"

# Live at: https://demo.donut-agent.eth.limo/
```

**Features:**
- Real-time DONUT supply from Base mainnet
- gDONUT staking stats
- ETH price from Coingecko
- Pure HTML/CSS/JS (Ethers.js v6)

## Troubleshooting

### "Content not loading"
- Check CID is correct (case-sensitive)
- Verify content is pinned to IPFS
- Try different gateway (eth.limo vs eth.link)
- Wait 5-10 min for gateway cache

### "Contenthash not set"
- Verify transaction succeeded on Etherscan
- Check you own the subdomain
- Ensure format: `ipfs://QmCID` (not just `QmCID`)

### "Site works on ipfs.io but not ENS gateway"
- ENS gateways have more aggressive caching
- Wait 5-10 minutes
- Clear browser cache
- Try incognito/private window

## Advanced: IPNS (Mutable Pointers)

IPNS provides mutable pointers to IPFS content:

```bash
# Create IPNS name
ipfs name publish QmYOUR_CID

# Get IPNS hash (k51...)
# Set ENS contenthash to IPNS
./scripts/bankr.sh "set contenthash for demo.my-name.eth to ipns://k51..."

# Update content
ipfs name publish QmNEW_CID
# Same IPNS hash, new content
```

**Tradeoff**: IPNS resolution is slower (~2-5 seconds)

## Cost Comparison

**Traditional Hosting (Vercel/Netlify):**
- Free tier: Limited builds/bandwidth
- Pro: $20/month
- Enterprise: $100+/month

**IPFS + ENS:**
- IPFS: Free (self-hosted) or $0-20/month (pinning service)
- ENS: ~$6/year domain + ~$0.50 per contenthash update
- Total: ~$10-30/year

**Winner**: IPFS + ENS is 10-100x cheaper for static sites.

## Why This Matters for Agents

1. **No server maintenance** - Upload and forget
2. **Censorship-resistant** - Can't be taken down
3. **Cost-effective** - Pennies per update
4. **Verifiable** - Content hash is cryptographic proof
5. **Portable** - Works with any ENS-compatible wallet/app

Perfect for agent dashboards, documentation, and web presence.
