# Architektura i jej strażnicy

Zasady są w skillu `meritum-architecture` w monorepo (`.claude/skills/meritum-architecture/SKILL.md`). Tu jest tylko to, co je egzekwuje w tym repo. Wszystko działa lokalnie i w CI (`.github/workflows/ci.yml`, job `verify`).

| Zasada                              | Kontrola                                                                                                                                                                                                                                                                             |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| wycinki domenowe, prywatne `_pliki` | `.dependency-cruiser.cjs` (`pnpm depcruise`): `no-deep-domain-import` (inna domena tylko przez jej `index.ts`), `no-private-import` (`_plik.ts` tylko z własnego folderu), `no-circular`                                                                                             |
| heksagonalna                        | `.dependency-cruiser.cjs`: `domain-without-frameworks` (kod domeny nie importuje Hono ani postgres; okablowanie to `src/server.ts`), `adapters-only-from-factory`; co jest okablowaniem, mówi `repo.wiring`                                                                          |
| lintery na pełną moc                | Biome: `recommended` plus wszystkie reguły `complexity`, `performance` i `security`, `noNestedTernary` i kilka innych z `style`/`suspicious`; `tsc` z `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`, `noPropertyAccessFromIndexSignature` |
| JSDoc z funkcjami produktu          | `tests/architecture/jsdoc.test.ts` (`pnpm test`): każdy `export` w `src/` i `tests/` (poza plikami `*.test.*`) ma JSDoc z `@feature US-XXX-00` (albo `F-00`, `ADR-00`, `none (infrastructure)`), a funkcja `@param`, `@returns` (chyba że zwraca `void`) i `@throws`, gdy rzuca      |
| najwyżej 250 linii na plik          | `tests/architecture/file-length.test.ts` (`.ts`, `.tsx`, `.js`, `.css` w całym repo poza `platforms/`)                                                                                                                                                                               |
| stałe                               | `tests/architecture/constants.test.ts`: `const UPPER_CASE` tylko w `constants.ts`, każda z JSDoc                                                                                                                                                                                     |
| typy                                | `tsc` strict, Biome `noExplicitAny`                                                                                                                                                                                                                                                  |
| złożoność                           | Biome `noExcessiveCognitiveComplexity` (15) i reszta grupy `complexity`; `noNestedTernary` wymusza nazwane warunki                                                                                                                                                                   |
| martwy kod                          | `knip` (`knip.jsonc`)                                                                                                                                                                                                                                                                |
| bezpieczeństwo                      | Biome, grupa `security` (w tym `noSecrets`)                                                                                                                                                                                                                                          |

Testy architektury czytają kod liniami, nie parserem (TypeScript 7.0 nie ma jeszcze stabilnego API kompilatora), więc polegają na formatowaniu Biome: deklaracje najwyższego poziomu zaczynają się w kolumnie 0. Ustawienia repo (foldery, wykluczenia) są w `tests/architecture/settings.ts`; reszta plików w `tests/architecture/` jest taka sama w meritum-frontend, meritum-extension i meritum-mocks.

`complexity/useLiteralKeys` jest wyłączone, bo kłóci się z `noPropertyAccessFromIndexSignature` w `tsc` (`process.env['X']`). dependency-cruiser czyta TypeScript przez `@swc/core` (`parser: 'swc'`), bo nie obsługuje TypeScriptu 7.0.

## Wyjątki

Wąsko i z powodem: `// biome-ignore lint/<grupa>/<reguła>: <powód>` w linii, wpis w `excluded` w `tests/architecture/settings.ts` albo w `knip.jsonc` / `.dependency-cruiser.cjs` z komentarzem.

Obecne wyjątki:

- kopie z design systemu (`contracts/`, `copy/`, `tokens/`, `platforms/`, `pnpm sync`) są poza Biome, testami architektury i knipem; pilnuje ich `pnpm sync:check`;
- `LOCAL_DB` w `src/constants.ts`: `// biome-ignore lint/security/noSecrets` (lokalna baza deweloperska, ta sama co w README backendu);
- knip pomija `@swc/core` (parser dependency-cruisera); `pnpm-workspace.yaml` nie pozwala mu uruchamiać skryptu instalacyjnego.

Testy to `node --test` (Node 26 uruchamia TypeScript bez kompilacji), tak jak testy jednostkowe w `src/`; vitest nie jest potrzebny. Pliki `.tsx` ładuje `tsx` (`--import tsx`), a DOM daje happy-dom z `tests/setup-dom.ts`. Skrypt podaje wzorce plików (`src/**/*.test.ts`, `tests/**/*.test.{ts,tsx}`), bo domyślne wzorce `node --test` pomijają `.tsx`; jak pisać test komponentu, mówi README.
