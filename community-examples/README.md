# Community Examples

Community-contributed examples showcasing Bankr's capabilities for various Web3 workflows.

## ENS Registration

**Complete workflow for registering .eth names and deploying to IPFS**

Register ENS names via Bankr's natural language interface. Includes primary name setup on L1/L2, subdomain creation, and IPFS content deployment.

[View Example →](./ens-register/)

**Features:**
- Register .eth names (automatic commit-reveal)
- Set primary names on Ethereum, Base, Arbitrum, Optimism
- Deploy static sites to IPFS + ENS
- Comprehensive troubleshooting guide

**Example:**
```bash
./bankr.sh "register my-agent.eth for 1 year"
./bankr.sh "set my primary ENS name to my-agent.eth on ethereum"
./bankr.sh "create subdomain dashboard.my-agent.eth"
./bankr.sh "set contenthash for dashboard.my-agent.eth to ipfs://QmCID"
```

**Created by:** Cruller (@cruller_donut), DonutDAO

---

## Contributing

Have an example showcasing Bankr? Submit a PR!

Guidelines:
- Complete, tested workflow
- Clear documentation
- Real-world use case
- MIT licensed
