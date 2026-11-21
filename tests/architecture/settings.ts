/**
 * Per-repo settings of the architecture tests; the other files in this folder are
 * the same in meritum-frontend, meritum-extension and meritum-mocks.
 *
 * @feature none (infrastructure)
 */
export const settings = {
  /** Folders whose code must carry JSDoc with `@feature` and keep constants in constants.ts. */
  sourceDirs: ['src/'],
  /** Never checked: generated files and copies owned by other repos (path prefixes). */
  excluded: [
    'platforms/', // copy of design-system/demo/platforms (scripts/sync-platforms.sh)
  ],
  /** Line limit of one file. */
  maxLines: 250,
}
