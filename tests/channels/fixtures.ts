/**
 * CheckResult fixtures for the Discord mock tests; fragments are made up for the tests.
 *
 * @feature US-WTY-08, F-04
 */
import type { CheckResult, ClaimResult } from '../../contracts/meritum.ts'

/**
 * A decisive claim with one quote and a strength.
 *
 * @param overrides - Fields to change.
 * @returns The claim.
 * @feature US-WTY-08, F-04
 */
export function decisiveClaim(overrides: Partial<ClaimResult> = {}): ClaimResult {
  return {
    claim: 'Językiem urzędowym w Polsce jest język polski.',
    claim_date: '2026-11-21',
    claim_date_source: 'today',
    verdict: 'confirmed',
    explanation: 'Konstytucja mówi to wprost w artykule 27.',
    strength: {
      level: 'strong',
      premises: { independent_sources: 2, primary_sources: 1, agreement: 'consistent' },
    },
    citations: [
      {
        stance: 'supports',
        fragment: 'W Rzeczypospolitej Polskiej językiem urzędowym jest język polski.',
        source: {
          id: 's_01',
          title: 'Konstytucja Rzeczypospolitej Polskiej',
          publisher: 'Sejm RP',
          publisher_id: 'sejm',
          url: 'https://isap.sejm.gov.pl/',
          domain: 'isap.sejm.gov.pl',
          kind: 'akt_prawny',
          tier: 'primary',
          published_at: '1997-07-16T00:00:00Z',
          fetched_at: '2026-11-01T00:00:00Z',
        },
      },
    ],
    ...overrides,
  }
}

/**
 * A finished check with the given claims.
 *
 * @param claims - The claims.
 * @returns The result.
 * @feature US-WTY-08, F-04
 */
export function doneResult(claims: ClaimResult[]): CheckResult {
  return { check_id: 'c_01', status: 'done', claims, corpus_version: 'v1', ai_disclosure: true }
}
