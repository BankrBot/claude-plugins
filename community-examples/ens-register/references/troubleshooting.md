# ENS Registration Troubleshooting

Common issues and solutions when registering ENS names via Bankr.

## Registration Issues

### "Name is not available"

**Cause**: Name is already registered

**Solutions:**
1. Check expiry: https://app.ens.domains/NAME.eth
2. Try variations: `my-agent.eth`, `myagent.eth`, `my-agent-ai.eth`
3. Use subdomain of existing name
4. Wait for expiry (if in grace period, check back in 90 days)

### "Insufficient funds for registration"

**Cause**: Not enough ETH in wallet

**Check balance:**
```bash
cd ~/.openclaw/skills/bankr && ./scripts/bankr.sh "what's my ethereum balance?"
```

**Minimum needed:**
- 1 year: ~0.003 ETH ($7)
- 3 years: ~0.006 ETH ($15)
- 5 years: ~0.010 ETH ($25)

**Solutions:**
1. Bridge ETH from Base: `./scripts/bankr.sh "bridge 0.005 ETH from base to ethereum"`
2. Buy more ETH
3. Register for shorter period (1 year minimum)

### "Commit not found"

**Cause**: Trying to register before commit is mined

**How commit-reveal works:**
1. Submit commit (transaction 1)
2. Wait ~1-2 minutes for it to mine
3. Submit register (transaction 2)

**Solution:** Wait 2-3 minutes between commit and register. Bankr handles this automatically, so if you see this error, just retry.

### "Transaction reverted"

**Common causes:**
1. Gas limit too low
2. Name became unavailable between commit and register
3. Insufficient ETH for gas

**Solutions:**
```bash
# Retry with higher gas limit
./scripts/bankr.sh "register my-name.eth for 1 year with higher gas limit"

# Check if name is still available
./scripts/bankr.sh "is my-name.eth available?"

# Check balance
./scripts/bankr.sh "what's my ethereum balance?"
```

## Primary Name Issues

### "Primary name not showing on Etherscan"

**Cause**: Reverse record not set or not propagated

**Solutions:**
1. Verify transaction succeeded: Check Etherscan
2. Wait 5-10 minutes for indexing
3. Re-set primary name:
```bash
./scripts/bankr.sh "set my primary ENS name to my-name.eth on ethereum"
```
4. Clear browser cache and refresh

### "Primary name works on L1 but not L2"

**Cause**: L2 reverse records are separate

**Solution:** Set primary name on each L2:
```bash
# Base
./scripts/bankr.sh "set my primary ENS name to my-name.eth on base"

# Arbitrum
./scripts/bankr.sh "set my primary ENS name to my-name.eth on arbitrum"
```

Requires small amount of ETH on each L2 for gas (~$0.01).

### "Transaction reverted on Base"

**Causes:**
1. Name not registered on L1 first
2. No ETH on Base for gas
3. Wrong network selected

**Solutions:**
1. Verify name is registered on Ethereum mainnet first
2. Bridge some ETH to Base (~$1 worth)
3. Specify "on base" explicitly in prompt

## Subdomain Issues

### "Cannot create subdomain"

**Cause**: Don't own parent name

**Example:**
- `demo.agent.eth` requires owning `agent.eth`
- Can't create `demo.vitalik.eth` if you don't own `vitalik.eth`

**Solution:** Only create subdomains of names you own.

### "Subdomain not resolving"

**Causes:**
1. Contenthash not set
2. Resolver not configured
3. Wrong IPFS CID format

**Check:**
```bash
# Via ENS app
open https://app.ens.domains/demo.my-name.eth

# Via resolver
./scripts/bankr.sh "what is the contenthash for demo.my-name.eth?"
```

**Solutions:**
1. Set contenthash: `./scripts/bankr.sh "set contenthash for demo.my-name.eth to ipfs://QmCID"`
2. Verify IPFS CID format (must start with `Qm` or `bafy`)
3. Check IPFS content is pinned and accessible

## IPFS Contenthash Issues

### "Content not loading via ENS gateway"

**Causes:**
1. Content not pinned to IPFS
2. Wrong CID format
3. Gateway caching old content
4. IPFS node offline

**Debug:**
```bash
# Test IPFS directly
curl https://ipfs.io/ipfs/QmYOUR_CID

# Check ENS contenthash
./scripts/bankr.sh "what is the contenthash for demo.my-name.eth?"

# Test different gateway
open https://demo.my-name.eth.link/  # Try .link instead of .limo
```

**Solutions:**
1. Verify content is accessible via `ipfs.io/ipfs/CID`
2. Check contenthash format: `ipfs://QmCID` (must include `ipfs://` prefix)
3. Wait 10-15 minutes for gateway cache to clear
4. Pin content to IPFS: `ipfs pin add QmCID`
5. Use pinning service (Pinata, NFT.Storage) for reliability

### "Contenthash transaction succeeded but content not showing"

**Cause**: Gateway caching

**Timeline:**
- Transaction confirmed: Instant
- Contenthash updated in ENS: ~1-2 min
- Gateway cache clear: ~5-15 min

**Solution:** Wait 15 minutes, then try:
1. Different gateway (eth.link, dweb.link)
2. Incognito/private window
3. Direct IPFS: `ipfs.io/ipfs/CID`

## Gas & Network Issues

### "Gas price too high"

**Check current gas:**
- https://etherscan.io/gastracker
- https://ethgasstation.info

**Strategies:**
1. **Wait for lower gas** (late night/weekends usually cheaper)
2. **Use lower gas price** (transaction takes longer but costs less)
3. **Register longer** (5 years costs less per year due to fixed gas costs)

**Gas cost ranges:**
- Low congestion: $2-5 total
- Medium: $5-15 total
- High: $15-50+ total

Registration fee (~$5) is constant, but gas varies wildly.

### "Network error / RPC timeout"

**Causes:**
1. RPC node down or rate-limited
2. Network congestion
3. Internet connection issues

**Solutions:**
1. Retry in 1-2 minutes
2. Check Bankr status
3. Verify internet connection
4. Try again during off-peak hours

## Bankr-Specific Issues

### "Bankr not responding"

**Check Bankr status:**
```bash
cd ~/.openclaw/skills/bankr && ./scripts/bankr.sh "what chains do you support?"
```

**If failing:**
1. Check API key is configured
2. Verify `~/.openclaw/skills/bankr/config.json` exists
3. See Bankr skill documentation
4. Restart OpenClaw: `openclaw gateway restart`

### "Command not understood"

**Common mistakes:**
- ❌ "register my-name.eth" (missing duration)
- ✅ "register my-name.eth for 1 year"

- ❌ "set contenthash to QmCID" (missing name)
- ✅ "set contenthash for demo.my-name.eth to ipfs://QmCID"

**Tips:**
- Always specify duration for registrations
- Always specify target name for contenthash/subdomain operations
- Use "on ethereum" or "on base" to clarify chain
- Include full ENS name with .eth suffix

## Getting Help

### Check Transaction Status

All operations involve on-chain transactions. Get TX hash from Bankr output and check:

**Ethereum mainnet:**
```
https://etherscan.io/tx/0xYOUR_TX_HASH
```

**Base:**
```
https://basescan.org/tx/0xYOUR_TX_HASH
```

### Verify Name Status

Check name details:
```
https://app.ens.domains/YOUR-NAME.eth
```

Shows:
- Owner address
- Expiry date
- Resolver configuration
- Records (address, contenthash, text)

### Community Resources

- **ENS Discord**: https://chat.ens.domains
- **ENS Forum**: https://discuss.ens.domains
- **ENS Docs**: https://docs.ens.domains
- **Bankr Support**: Contact via OpenClaw community

## Emergency: Name Registered to Wrong Address

**If you registered a name but don't control it:**

1. **Check ownership:**
```bash
./scripts/bankr.sh "who owns my-name.eth?"
```

2. **If you own it:** Transfer to correct address:
```bash
./scripts/bankr.sh "transfer my-name.eth to 0xNEW_ADDRESS"
```

3. **If someone else owns it:** The name is gone. You'll need to:
   - Register a different name
   - Wait for expiry and try to re-register
   - Contact owner to negotiate transfer

**Prevention:** Double-check wallet address before registering!

## Cost Optimization Tips

1. **Register longer periods** - Gas cost is mostly fixed, so 5 years is most cost-effective
2. **Batch operations** - Register multiple names in low-gas periods
3. **Use L2 for primary names** - Base/Arbitrum gas is ~100x cheaper than L1
4. **Monitor gas** - Set gas price alerts, register during off-peak times

## Success Checklist

After registration, verify:

- [ ] Name registered (check on app.ens.domains)
- [ ] Owner is your address
- [ ] Expiry is correct (1+ years from now)
- [ ] Primary name set on L1
- [ ] Primary name set on L2s (if needed)
- [ ] Subdomains created (if needed)
- [ ] Contenthash set (if deploying content)
- [ ] Content accessible via ENS gateway
- [ ] Set calendar reminder to renew

If all checked, you're done! 🎉
