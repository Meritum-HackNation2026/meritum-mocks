# meritum-mocks

Makiety X, Facebooka, Instagrama, Reddita i TikToka do demo wtyczki Meritum oraz makieta Discorda, na której jury sprawdza kanał Discord bez konta i bez dołączania do serwera. Strony odtwarzają te same znaczniki DOM co prawdziwe serwisy (kontrakt selektorów: `platforms/SELECTORS.md`), więc jeden content script działa i na makiecie, i na prawdziwej stronie. Pod spodem jest mały backend w Hono z własnym schematem w bazie.

| Platforma | prd (`main`)                                                        |
| --------- | ------------------------------------------------------------------- |
| X         | https://meritum-x.gburek.app                                        |
| Facebook  | https://meritum-facebook.gburek.app                                 |
| Instagram | https://meritum-instagram.gburek.app                                |
| Reddit    | https://meritum-reddit.gburek.app                                   |
| TikTok    | https://meritum-tiktok.gburek.app                                   |
| Discord   | https://meritum-discord.gburek.app (czeka na trasę w meritum-infra) |

Jeden kontener `meritum-mocks-prd` obsługuje wszystkie sześć adresów i wybiera makietę po nagłówku `Host` (`src/routing.ts`). Baza: schemat `mocks_<env>`, rola `meritum_mocks_<env>`. `?theme=dark` przełącza motyw makiety.

| Ścieżka       | Co zwraca                                                        |
| ------------- | ---------------------------------------------------------------- |
| `/`           | makieta platformy z adresu (lokalnie: lista makiet)              |
| `/assets/*`   | wspólne style, skrypt przewijania i obrazki                      |
| `/api/health` | `{status, env, platform, database}`; 503, gdy baza nie odpowiada |

### Makieta Discorda

Rozmowa z botem Meritum w ramce podobnej do Discorda (`src/channels/`, lokalnie http://localhost:3000/discord/). Strona działa bez JavaScriptu: formularz wysyła wiadomość do serwera makiety, a ten woła to samo API co prawdziwy bot: `POST /api/v1/checks` z `channel: "discord"` i losowym identyfikatorem użytkownika makiety (`channel_user_id`, z którego API liczy skrót), potem `GET /api/v1/checks/{id}` do wyniku. Identyfikator leży w ciasteczku `meritum_discord_user`; jego brak (albo zły format) znaczy pierwszy kontakt. Po wysłaniu przeglądarka przechodzi do nowej odpowiedzi (`#reply`), a linki w niej są klikalne. Formularz przyjmuje najwyżej 32 KB.

Odpowiedź dzielimy tak jak bot (backend/007), tekstami `discord` i `ai_notice` z `copy/pl.json`:

1. Przy pierwszym kontakcie pierwsza wiadomość zaczyna się od informacji, że odpowiada system AI.
2. Podsumowanie: liczba twierdzeń, link do pełnej karty i werdykt każdego twierdzenia.
3. Po jednej wiadomości na twierdzenie: werdykt, jeden cytat (pierwszy, który popiera albo podważa twierdzenie) z wydawcą i datą oraz siła podstawy. Twierdzenie bez cytatu podaje, czego nie ustalono.
4. Wiadomość ma najwyżej 2000 znaków. Dłuższą dzielimy tylko między liniami szablonu z `copy/pl.json`, więc cytat (także z podziałem wiersza w środku) nigdy nie jest przecięty.

Sprawdzenie bez twierdzeń (`needs_clarification`, `out_of_scope`), błędne wejście i awaria API dają stan słowem i podpowiedź z `copy/pl.json`, nigdy werdykt; pierwsza taka odpowiedź też zaczyna się od informacji o AI.

| Zmienna            | Domyślnie                                      | Co ustawia                        |
| ------------------ | ---------------------------------------------- | --------------------------------- |
| `MERITUM_API_URL`  | `https://meritum.gburek.app`                   | API, które woła makieta           |
| `MERITUM_CARD_URL` | `https://meritum.gburek.app/?check={check_id}` | link do karty wyniku w odpowiedzi |

Porównanie z prawdziwym botem (ten sam tekst, ta sama część merytoryczna `CheckResult`) robimy ręcznie, poza CI: wyślij tekst botowi i makiecie, potem porównaj `GET /api/v1/checks/{id}` obu sprawdzeń. Testy w CI używają atrapy API.

### Kopie z design systemu

Teksty, tokeny, kontrakty i strony makiet pochodzą z [meritum-design-system](https://github.com/Meritum-HackNation2026/meritum-design-system) (ADR-33). W repo leżą ich kopie:

| Kopia                  | Źródło w design systemie                                                                        |
| ---------------------- | ----------------------------------------------------------------------------------------------- |
| `contracts/meritum.ts` | `contracts/meritum.ts`                                                                          |
| `copy/pl.json`         | `copy/pl.json`                                                                                  |
| `tokens/meritum.css`   | `tokens/meritum.css`                                                                            |
| `brand/`               | `brand/meritum-app-icon.svg`, `meritum-mark.svg`, `meritum-mark-on-dark.svg` (makieta Discorda) |
| `platforms/`           | `demo/platforms/` (z kontraktem selektorów `SELECTORS.md`)                                      |

Kopii nie edytuj tutaj. Zmień design system i uruchom `pnpm sync` (albo `pnpm sync <gałąź|tag|commit>`; potrzebny `gh` z dostępem do repo design systemu). Skrypt zapisuje commit źródła w `SOURCE` i sumy plików w `SHA256SUMS`. `pnpm test` (`tests/design-system-copy.test.ts`) bez sieci porównuje kopie z `SHA256SUMS` i wypisuje plik, którego suma się nie zgadza. Biome, knip i testy architektury pomijają kopie, bo nie trzymają się stylu kodu aplikacji.

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

`.github/workflows/ci.yml`: `verify` (Biome, typy, testy) na runnerach GCP, `deploy` na `dellpromaxgb10` tylko z `main`, po zielonym `verify`. `deploy/deploy.sh` buduje obraz na hoście, podmienia kontener i sprawdza przez gateway każdą z pięciu domen platform (strona i `/api/health` z działającą bazą). Krok „Public check” sprawdza adresy publiczne.

Plik `~/meritum/envs/mocks-<env>.env`, rolę, schemat i trasy w Cloudflare tworzy platforma z [meritum-infra](https://github.com/Meritum-HackNation2026/meritum-infra). Repo ma tylko gałąź `main`: zmiany przez PR do `main`, bez bezpośrednich pushy, gałęzie funkcji usuwane ręcznie po merge'u. Środowiska dev nie wdrażamy: adresy `meritum-<platforma>-dev.gburek.app` (dla wtyczki w wariancie dev) obsługuje ten sam kontener `meritum-mocks-prd`, a trasy do niego ustawia meritum-infra.
