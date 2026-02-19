/**
 * x402 Pre-flight Compliance Hook
 *
 * Intercepts x402 payment flows to run an advisory compliance check
 * before the payment is submitted. Prints warnings but never blocks.
 *
 * Integration: Register as a pre-payment hook in the x402 plugin pipeline.
 */

type ComplianceStatus = 'clear' | 'held' | 'blocked';

const STATUS_MAP: Record<string, ComplianceStatus> = {
  clear: 'clear',
  held: 'held',
  blocked: 'blocked',
  pending: 'held',
  error: 'held',
};

// Session-level cache (lives for plugin lifetime)
const preflightCache = new Map<string, ComplianceStatus>();

export interface PreflightResult {
  address: string;
  status: ComplianceStatus;
  advisory: boolean;
  message: string;
}

/**
 * Run a pre-flight compliance check on the payment recipient.
 * Advisory-only: always returns (never throws), prints warnings.
 */
export async function x402Preflight(recipientAddress: string): Promise<PreflightResult> {
  const apiKey = process.env.SHULAM_API_KEY;
  const baseUrl = process.env.SHULAM_API_URL ?? 'https://api.shulam.xyz';

  // No API key — skip silently
  if (!apiKey) {
    return {
      address: recipientAddress,
      status: 'clear',
      advisory: true,
      message: 'Compliance check skipped (no SHULAM_API_KEY). Set one at https://api.shulam.xyz/register',
    };
  }

  // Check cache
  const cached = preflightCache.get(recipientAddress.toLowerCase());
  if (cached) {
    return {
      address: recipientAddress,
      status: cached,
      advisory: true,
      message: cached === 'clear'
        ? 'Recipient passed compliance pre-flight (cached).'
        : `WARNING: Recipient is ${cached} — proceed with caution.`,
    };
  }

  try {
    const response = await fetch(`${baseUrl}/v1/compliance/screen`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
      body: JSON.stringify({ address: recipientAddress }),
    });

    if (!response.ok) {
      return {
        address: recipientAddress,
        status: 'clear',
        advisory: true,
        message: `Compliance pre-flight returned HTTP ${response.status} — proceeding anyway.`,
      };
    }

    const data = await response.json() as Record<string, unknown>;
    const status = STATUS_MAP[data.status as string] ?? 'held';

    preflightCache.set(recipientAddress.toLowerCase(), status);

    let message: string;
    switch (status) {
      case 'clear':
        message = 'Recipient passed compliance pre-flight.';
        break;
      case 'held':
        message = 'WARNING: Recipient has a partial sanctions match — compliance review pending.';
        console.log(`[shulam-x402] ⚠ Pre-flight: ${recipientAddress.slice(0, 10)}... is HELD`);
        break;
      case 'blocked':
        message = 'WARNING: Recipient is on a sanctions list. Payment may violate regulations.';
        console.log(`[shulam-x402] ✘ Pre-flight: ${recipientAddress.slice(0, 10)}... is BLOCKED`);
        break;
    }

    return { address: recipientAddress, status, advisory: true, message };
  } catch {
    return {
      address: recipientAddress,
      status: 'clear',
      advisory: true,
      message: 'Compliance pre-flight failed (network error) — proceeding anyway.',
    };
  }
}
