/**
 * `shulam verify <address>` — Claude plugin command for compliance screening.
 *
 * Advisory-only: prints warnings but never throws or blocks execution.
 * Session-cached: repeated checks for the same address are instant.
 */

// ── Types ──────────────────────────────────────────────────────

type ComplianceStatus = 'clear' | 'held' | 'blocked';

interface ScreeningResult {
  status: ComplianceStatus;
  matchScore: number;
  screenedAt: string;
}

// ── Session cache ──────────────────────────────────────────────

const sessionCache = new Map<string, ScreeningResult>();

// ── Status mapping (ADR-23) ────────────────────────────────────

const STATUS_MAP: Record<string, ComplianceStatus> = {
  clear: 'clear',
  held: 'held',
  blocked: 'blocked',
  pending: 'held',
  error: 'held',
};

// ── Command ────────────────────────────────────────────────────

export async function shulamVerify(address: string): Promise<void> {
  const apiKey = process.env.SHULAM_API_KEY;
  const baseUrl = process.env.SHULAM_API_URL ?? 'https://api.shulam.xyz';

  if (!apiKey) {
    console.log('[shulam] No SHULAM_API_KEY set — compliance check skipped.');
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
    const response = await fetch(`${baseUrl}/v1/compliance/screen`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
      body: JSON.stringify({ address }),
    });

    if (!response.ok) {
      console.log(`[shulam] Compliance check returned HTTP ${response.status} — treating as advisory warning.`);
      return;
    }

    const data = await response.json() as Record<string, unknown>;
    const result: ScreeningResult = {
      status: STATUS_MAP[data.status as string] ?? 'held',
      matchScore: (data.matchScore as number) ?? 0,
      screenedAt: (data.screenedAt as string) ?? new Date().toISOString(),
    };

    sessionCache.set(address.toLowerCase(), result);
    printResult(address, result);
  } catch {
    console.log('[shulam] Compliance check failed (network error) — advisory only, continuing.');
  }
}

function printResult(address: string, result: ScreeningResult): void {
  const shortAddr = `${address.slice(0, 6)}...${address.slice(-4)}`;

  switch (result.status) {
    case 'clear':
      console.log(`[shulam] ${shortAddr} — CLEAR (no sanctions match)`);
      break;
    case 'held':
      console.log(`[shulam] ⚠ ${shortAddr} — HELD (match score: ${result.matchScore.toFixed(2)}, under review)`);
      break;
    case 'blocked':
      console.log(`[shulam] ✘ ${shortAddr} — BLOCKED (confirmed sanctions match, score: ${result.matchScore.toFixed(2)})`);
      console.log('[shulam]   WARNING: Transacting with this address may violate sanctions regulations.');
      break;
  }
}
