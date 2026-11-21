# meritum-mocks

Makiety X, Facebooka, Instagrama, Reddita i TikToka do demo wtyczki Meritum. Strony odtwarzają te same znaczniki DOM co prawdziwe serwisy (kontrakt selektorów: `platforms/SELECTORS.md`), więc jeden content script działa i na makiecie, i na prawdziwej stronie. Pod spodem jest mały backend w Hono z własnym schematem w bazie.

| Platforma | prd (`main`)                         |
| --------- | ------------------------------------ |
| X         | https://meritum-x.gburek.app         |
| Facebook  | https://meritum-facebook.gburek.app  |
| Instagram | https://meritum-instagram.gburek.app |
| Reddit    | https://meritum-reddit.gburek.app    |
| TikTok    | https://meritum-tiktok.gburek.app    |

Jeden kontener `meritum-mocks-prd` obsługuje wszystkie pięć adresów i wybiera makietę po nagłówku `Host` (`src/routing.ts`). Baza: schemat `mocks_<env>`, rola `meritum_mocks_<env>`. `?theme=dark` przełącza motyw makiety.

| Ścieżka       | Co zwraca                                                        |
| ------------- | ---------------------------------------------------------------- |
| `/`           | makieta platformy z adresu (lokalnie: lista makiet)              |
| `/assets/*`   | wspólne style, skrypt przewijania i obrazki                      |
| `/api/health` | `{status, env, platform, database}`; 503, gdy baza nie odpowiada |

Źródłem stron jest design system (`design-system/demo/platforms/`, razem z kontraktem selektorów `SELECTORS.md`). `platforms/` to kopia: nie edytuj jej tutaj, tylko zmień design system i uruchom `scripts/sync-platforms.sh [ścieżka-do-design-system]` (domyślnie `../design-system`). Skrypt zapisuje commit źródła w `platforms/SOURCE`. Biome nie lintuje kopii, bo nie trzyma się stylu kodu aplikacji.

## Praca lokalna

Node 26 uruchamia TypeScript bez kompilacji.

```bash
pnpm install
pnpm dev            # http://localhost:3000, makiety pod /x/, /reddit/ itd.
pnpm check && pnpm typecheck && pnpm test
pnpm depcruise && pnpm knip   # granice importów, martwy kod
```

### Test komponentu

`pnpm test` ładuje przed testami `tsx` (Node nie przekształca JSX) i `tests/setup-dom.ts`, który rejestruje DOM z happy-dom i czyści go po każdym teście. Test komponentu to plik `tests/<domena>/<komponent>.test.tsx`: renderuje komponent przez `@testing-library/react` i szuka elementów po roli i tekście z `copy/pl.json`, nie po klasach CSS. Wzór: `tests/example/brand-heading.test.tsx`.

```tsx
render(<BrandHeading text={brandName} />)
assert.ok(screen.getByRole('heading', { level: 1, name: brandName }))
```

Testy w przeglądarce (e2e) nie wchodzą do CI; uruchamia się je ręcznie albo lokalnie.

Zasady architektury i to, co je sprawdza: [docs/architecture.md](docs/architecture.md).

Bazę daje `docker compose up -d --wait db` w repo backendu (domyślny `DATABASE_URL` pasuje). Bez bazy strony działają, a `/api/health` zwraca 503.

## CI/CD

`.github/workflows/ci.yml`: `verify` (Biome, typy, testy) na runnerach GCP, `deploy` na `dellpromaxgb10` tylko z `main`, po zielonym `verify`. `deploy/deploy.sh` buduje obraz na hoście, podmienia kontener i sprawdza przez gateway każdą z pięciu domen (strona i `/api/health` z działającą bazą). Krok „Public check” sprawdza adresy publiczne.

Plik `~/meritum/envs/mocks-<env>.env`, rolę, schemat i trasy w Cloudflare tworzy platforma z [meritum-infra](https://github.com/Meritum-HackNation2026/meritum-infra). Repo ma tylko gałąź `main`: zmiany przez PR do `main`, bez bezpośrednich pushy, gałęzie funkcji usuwane ręcznie po merge'u. Środowiska dev już nie wdrażamy. Kontener `meritum-mocks-dev` i adresy `meritum-<platforma>-dev.gburek.app` zostały po dawnym przepływie i nie dostają nowych wersji.
