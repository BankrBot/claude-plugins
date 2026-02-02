# ENS Contract Reference

Key ENS contracts on Ethereum mainnet and L2s.

## Ethereum Mainnet

### ENS Registry
```
Address: 0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e
```
Root registry for all .eth names.

### ETH Registrar Controller (v3)
```
Address: 0x59E16fcCd424Cc24e280Be16E11Bcd56fb0CE547
```
Handles .eth name registrations (commit-reveal process).

**Key Functions:**
- `makeCommitment()` - Generate commitment hash
- `commit(bytes32)` - Submit commitment
- `register()` - Complete registration after commit
- `renew()` - Extend registration

### Public Resolver
```
Address: 0xF29100983E058B709F3D539b0c765937B804AC15
```
Default resolver for ENS names. Stores:
- Addresses (ETH, BTC, etc.)
- Content hashes (IPFS, Swarm, etc.)
- Text records (email, url, avatar, etc.)

**Key Functions:**
- `setAddr()` - Set address record
- `setContenthash()` - Set IPFS/Swarm content
- `setText()` - Set text records

### Reverse Registrar (L1)
```
Address: 0xA2C122BE93b0074270ebeE7f6b7292C7deB45047
```
Handles reverse records (address → name).

**Key Functions:**
- `setName(string)` - Set primary name for caller
- `claim(address)` - Claim reverse record

## Base L2

### Reverse Registrar
```
Address: 0x0000000000D8e504002cC26E3Ec46D81971C1664
```
Set primary names on Base L2.

**Function:**
- `setName(string)` - Set primary name (e.g., "agent.eth")

## Arbitrum

### Reverse Registrar
```
Address: 0x0000000000D8e504002cC26E3Ec46D81971C1664
```

## Optimism

### Reverse Registrar
```
Address: 0x0000000000D8e504002cC26E3Ec46D81971C1664
```

## Registration Flow (Commit-Reveal)

### Why Two Transactions?

ENS uses commit-reveal to prevent frontrunning:

1. **Commit**: Submit hash of (name + owner + secret)
2. **Wait**: ~1 minute minimum
3. **Reveal**: Submit actual name + owner + secret

**Attacker can't frontrun** because they don't know the name during commit phase.

### Cost Breakdown

**Registration (1 year):**
- Base fee: ~0.002 ETH ($5)
- Commit gas: ~0.00003 ETH ($0.08)
- Register gas: ~0.00026 ETH ($0.60)
- **Total**: ~0.003 ETH (~$6-7)

**Renewal (per year):**
- Base fee: ~0.002 ETH ($5)
- Gas: ~0.0001 ETH ($0.25)
- **Total**: ~0.0021 ETH (~$5.25)

### Gas Tips

- **Commit**: 50,000 gas
- **Register**: 250,000 gas
- **Renew**: 100,000 gas
- **Set primary name**: 50,000 gas

Use higher gas during congestion.

## Subdomain Creation

Subdomains are managed by the parent name owner:

```
Parent: agent.eth (you own this)
Subdomain: demo.agent.eth (you control this)
```

**Process:**
1. Call `setSubnodeOwner()` on ENS Registry
2. Point to Public Resolver
3. Set records (address, contenthash, etc.)

Bankr handles this automatically:
```bash
./scripts/bankr.sh "create subdomain demo.agent.eth"
```

## Contenthash Format

### IPFS
```
ipfs://QmYOUR_CID_HERE
```

### IPNS
```
ipns://k51qzi5uqu5d...
```

### Swarm
```
bzz://HASH
```

Bankr accepts these formats and handles encoding automatically.

## Reverse Records (Primary Names)

### How It Works

**Forward**: `agent.eth` → `0x123...`  
**Reverse**: `0x123...` → `agent.eth`

Reverse records make your address human-readable in:
- Block explorers (Etherscan, Basescan)
- Wallets (MetaMask, Rainbow)
- dApps

### Setting Reverse Record

**L1 (Ethereum):**
- Option 1: Set during registration (`reverseRecord=1`)
- Option 2: Call `setName()` on Reverse Registrar

**L2 (Base, Arbitrum, etc.):**
- Must call `setName()` on L2 Reverse Registrar
- Separate transaction per L2

## Text Records

Store arbitrary key-value data:

```
email → agent@example.com
url → https://myagent.ai
avatar → ipfs://QmAvatarHash
com.twitter → @my_agent
```

Set via Public Resolver:
```bash
./scripts/bankr.sh "set text record 'url' to 'https://myagent.ai' for agent.eth"
```

## Name Expiry

- Names expire after registration period (1-10 years)
- 90-day grace period after expiry (only owner can renew)
- After grace period, name becomes available to public

**Set reminder**: Renew ~30 days before expiry to avoid downtime.

## Security Notes

- **Owner** controls the name (can transfer, set records)
- **Controller** set during registration (ETH Registrar Controller)
- **Resolver** can be changed by owner
- **Protect your keys** - Owner key controls the name

## Resources

- **ENS Docs**: https://docs.ens.domains
- **ENS App**: https://app.ens.domains
- **Contract Source**: https://github.com/ensdomains/ens-contracts
- **Etherscan**: https://etherscan.io/address/0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e
