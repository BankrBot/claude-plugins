/**
 * `shulam trust <address>` — Claude plugin command for trust scoring.
 *
 * Advisory-only: prints score/tier/breakdown but never throws or blocks.
 * Session-cached: repeated lookups are instant.
 */

// ── Types ──────────────────────────────────────────────────────

type TrustTier = 'unknown' | 'new' | 'established' | 'trusted' | 'exemplary';

interface TrustBreakdown {
  volume: number;
  reliability: number;
  compliance: number;
  diversity: number;
  longevity: number;
  stability: number;
}

interface TrustResult {
  score: number;
  tier: TrustTier;
  breakdown: TrustBreakdown;
}

// ── Session cache ──────────────────────────────────────────────

const sessionCache = new Map<string, TrustResult>();

// ── Command ────────────────────────────────────────────────────

export async function shulamTrust(address: string): Promise<void> {
  const apiKey = process.env.SHULAM_API_KEY;
  const baseUrl = process.env.SHULAM_API_URL ?? 'https://api.shulam.xyz';

  if (!apiKey) {
    console.log('[shulam] No SHULAM_API_KEY set — trust check skipped.');
    console.log('[shulam] Get a free key: https://api.shulam.xyz/register');
    return;
  }

  // Check session cache
  const cached = sessionCache.get(address.toLowerCase());
  if (cached) {
    printResult(address, cached);
    return;
  }

  try {
    const response = await fetch(
      `${baseUrl}/v1/trust/score/${encodeURIComponent(address)}`,
      {
        method: 'GET',
        headers: { 'X-API-Key': apiKey },
      },
    );

    if (!response.ok) {
      console.log(`[shulam] Trust lookup returned HTTP ${response.status} — skipping.`);
      return;
    }

    const data = await response.json() as Record<string, unknown>;
    const passport = (data.passport ?? data) as Record<string, unknown>;
    const breakdownRaw = (passport.breakdown ?? {}) as Record<string, number>;

    const result: TrustResult = {
      score: (passport.trustScore as number) ?? 0,
      tier: ((passport.trustTier as string) ?? 'unknown') as TrustTier,
      breakdown: {
        volume: breakdownRaw.volume ?? 0,
        reliability: breakdownRaw.reliability ?? 0,
        compliance: breakdownRaw.compliance ?? 0,
        diversity: breakdownRaw.diversity ?? 0,
        longevity: breakdownRaw.longevity ?? 0,
        stability: breakdownRaw.stability ?? 0,
      },
    };

    sessionCache.set(address.toLowerCase(), result);
    printResult(address, result);
  } catch {
    console.log('[shulam] Trust lookup failed (network error) — advisory only, continuing.');
  }
}

function printResult(address: string, result: TrustResult): void {
  const shortAddr = `${address.slice(0, 6)}...${address.slice(-4)}`;

  console.log(`[shulam] ${shortAddr} — Trust Score: ${result.score}/100 (${result.tier})`);
  console.log(`[shulam]   Volume: ${result.breakdown.volume} | Reliability: ${result.breakdown.reliability} | Compliance: ${result.breakdown.compliance}`);
  console.log(`[shulam]   Diversity: ${result.breakdown.diversity} | Longevity: ${result.breakdown.longevity} | Stability: ${result.breakdown.stability}`);
}
