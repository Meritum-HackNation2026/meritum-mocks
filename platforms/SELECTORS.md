# Kontrakt selektorów dla wtyczki Meritum

Makiety w `platforms/<serwis>/` odtwarzają te same znaczniki DOM co prawdziwe serwisy, żeby jeden content script działał na obu. Pomiary: Chrome na macOS, konto zalogowane, interfejs po polsku, 21.11.2026, okno 1672 px.

Zasady wspólne dla wszystkich serwisów:

- Nie wybieraj po klasach. Klasy w serwisach są haszowane (`css-g5y9jx r-18u37iz`, `x1lliihq`), a klasy w makietach (`m-*`, `tw-*`) istnieją tylko w makietach.
- Wszystkie serwisy to SPA: feed dociąga posty bez przeładowania, a nawigacja zmienia URL przez `history.pushState`. Potrzebny jest `MutationObserver` na `document.body` (`childList`, `subtree`) i ponowne skanowanie po zmianie URL. Makiety dokładają te same posty przy przewijaniu (`assets/mock.js`), więc ta ścieżka działa też na scenie.
- Oznaczaj przetworzony post atrybutem (np. `data-meritum-id`) i sprawdzaj go przed wstrzyknięciem. Wirtualizowane listy podmieniają treść w istniejącym węźle, więc przy każdej mutacji porównuj też identyfikator posta (link do statusu, `id`), nie tylko obecność znacznika.
- Bloker reklam użytkownika ukrywał reklamy na X, Facebooku i Instagramie (`display:none` na kontenerze). Etykieta reklamy była w DOM, ale niewidoczna, więc pozycji etykiety na X/FB/IG nie zmierzono na żywo.
- Motyw: każdy serwis oznacza go inaczej (opis w sekcjach). Makiety przyjmują `?theme=dark` i ustawiają ten sam znacznik co serwis oraz `html[data-mock-theme]` (tylko makieta).

## X (x.com)

| Element | Selektor |
| --- | --- |
| Kontener feedu | `div[aria-label^="Oś czasu"]` (pl: „Oś czasu: Twoja główna oś czasu”), w `section[role="region"]` w `[data-testid="primaryColumn"]` |
| Wiersz feedu | `[data-testid="cellInnerDiv"]` |
| Post | `article[data-testid="tweet"]` (`role="article"`, `tabindex="0"`) |
| Autor | `[data-testid="User-Name"]`: pierwszy `a[role="link"]` to nazwa, drugi zawiera `@handle`; link do statusu to `a[href*="/status/"]` z `time[datetime]` |
| Awatar | `[data-testid="Tweet-User-Avatar"]`, w środku `[data-testid^="UserAvatar-Container-"]` (sufiks = handle) |
| Tekst | `[data-testid="tweetText"]` (atrybut `lang`) |
| Media | `[data-testid="tweetPhoto"]` (zdjęcia), `[data-testid="card.wrapper"]` (karta linku; w makiecie `card.layoutLarge.media`) |
| Pasek akcji | `[role="group"]` w poście; dzieci: `[data-testid="reply"]`, `"retweet"`, `"like"`, link statystyk `a[href$="/analytics"]`, `"bookmark"`, Udostępnij (bez testid) |
| Reklama | `[data-testid="placementTracking"]` obejmuje `article`; etykieta „Reklama” to `span` poza `User-Name`, obok `[data-testid="caret"]`; reklama nie ma `time` |

Miejsce na „Sprawdź”: dopisz `div` jako ostatnie dziecko `[role="group"]`. Zmierzone 2026-11-22: zakładka (`[data-testid="bookmark"]` w `div` z `display:grid`) i udostępnij renderują się później niż reszta paska, więc wstawianie „przed zakładką” trafiało raz przed, raz za nią. Na końcu paska przycisk jest zawsze w tym samym miejscu, a makieta ma ten sam układ.

Pułapki:
- Lista jest wirtualizowana: `cellInnerDiv` ma `position:absolute; transform:translateY(...)`, kontener ma `min-height` całej listy. Komórki poza ekranem są usuwane, a węzły bywają używane ponownie dla innego posta. Makieta renderuje komórki w normalnym przepływie, bez recyklingu.
- Atrybut `aria-labelledby` posta to lista losowych `id__...`, zmienia się przy każdym renderze.
- Motyw: tylko `body style="background-color: rgb(0,0,0)"` (ciemny) albo biały, plus `meta[name="theme-color"]`.
- Kolumny: nawigacja 275, oś czasu 600, odstęp 30, prawa kolumna 350. Dark: tło `#000`, tekst `#E7E9EA`, drugorzędny `#71767B`, linie `#2F3336`. Light: `#FFF`, `#0F1419`, `#536471`, `#EFF3F4`.

## Facebook (facebook.com)

| Element | Selektor |
| --- | --- |
| Kontener feedu | brak stabilnego. W chwili pomiaru nie było `role="feed"` ani `aria-posinset`. Szukaj w `div[role="main"]` |
| Post | najbliższy przodek `[data-virtualized]`, który zawiera `[data-ad-rendering-role="profile_name"]` (każda jednostka feedu ma własny `div[data-virtualized]`) |
| Autor | `[data-ad-rendering-role="profile_name"] h4 a[role="link"]` |
| Meta | link z czasem obok nazwy (`a[role="link"]` z `aria-labelledby`); ikona widoczności `svg[role="img"]` |
| Tekst | `[data-ad-preview="message"]` (też `[data-ad-rendering-role="story_message"]`) |
| Media | `a[role="link"] img` pod tekstem; karta linku: `[data-ad-rendering-role="meta"]` (domena), `"title"`, `"description"` |
| Pasek akcji | `[data-ad-rendering-role="like_button"]`, `"comment_button"`, `"share_button"`; każdy w `div[role="button"]` z `aria-label` „Zareaguj „Lubię to!” na post …”, „Skomentuj post …”, „Udostępnij post …” |
| Menu posta | `div[role="button"][aria-label="Działania dotyczące tego posta"]`, `a[aria-label^="Ukryj post"]` |
| Reklama | „Sponsorowane” w miejscu czasu w linii meta (wzorzec znany, nie zmierzony; reklamy ukrył bloker). Historycznie FB rozbija ten tekst na litery w ukrytych spanach, więc sprawdzaj `aria-label`/`aria-labelledby` linku, a nie `textContent` |

Miejsce na „Sprawdź”: dopisz przycisk do wiersza akcji, czyli najbliższego wspólnego przodka `like_button` i `share_button` (`display:flex`, rząd), zaraz za elementem z udostępnianiem. Zmierzone 2026-11-22: każda akcja siedzi we własnym pudełku `display:flex; flex-direction:column` (makieta: `.m-ac`), więc rodzic `div[role="button"]` to kolumna, a nie wiersz. Przycisk dopisany do niej ląduje pod ikoną, a karta posta (`overflow:hidden`) go ucina. Wiersz ma `color:#1C1E21` także w ciemnym motywie; ikony i liczby biorą kolor z `--secondary-icon` (jasny `#65686C`, ciemny `#B0B3B8`), więc widżet też. Wiersz siedzi w stopce o stałej wysokości (ok. 42 px) pod przodkiem z `overflow:hidden` (makieta: `.m-ft`), więc wynik idzie za tę stopkę: za dziecko wspólnego przodka paska i autora, które zawiera pasek. Reklama trzyma tekst w `[data-ad-rendering-role="story_message"]` bez `[data-ad-preview="message"]` w środku (zmierzone 2026-11-22).

Pułapki:
- Wirtualizacja: jednostki daleko od ekranu dostają `data-virtualized="true"` i tracą treść (zostaje pusty kontener o tej samej wysokości). Gdy wracają, treść jest renderowana od nowa, więc wstrzyknięty przycisk znika.
- `role="article"` występuje dziesiątki razy (komentarze, zagnieżdżone treści) i nie oznacza posta.
- W feedzie są też jednostki bez autora (Rolki, propozycje): pomijaj kontenery bez `profile_name`.
- Motyw: klasa `__fb-dark-mode` / `__fb-light-mode` na `html`. Dark: strona `#1C1C1D`, karta `#252728`, tekst drugorzędny `#B0B3B8`. Karty: promień 12, cień `0 1px 2px rgba(0,0,0,.2)`, odstęp 12. Kolumny: lewa 360, feed 680, prawa 360, górny pasek 56.

## Instagram (instagram.com)

| Element | Selektor |
| --- | --- |
| Kontener feedu | `main` (bez atrybutów); posty to `article` jako potomkowie |
| Post | `article` (bez `role`, bez testid) |
| Autor | pierwszy `a[href^="/"][role="link"]` w nagłówku posta; `img[alt^="Zdjęcie profilowe"]` to awatar |
| Czas | `time[datetime]` |
| Tekst | podpis pod paskiem akcji: `span[dir="auto"]` po linku autora (bez stabilnego atrybutu) |
| Media | duże `img` (`alt` zaczyna się od „Photo by…”/„Zdjęcie:”) albo `video` |
| Pasek akcji | `section` z `svg[aria-label="Lubię to!"]`, `"Skomentuj"`, `"Repostuj"`, `"Udostępnij"`, `"Zapisz"`; przyciski to `div[role="button"]` wokół svg |
| Menu | `svg[aria-label="Więcej opcji"]` |
| Reklama | tekst „Sponsorowane” w drugiej linii nagłówka (był w DOM, ukryty przez bloker); pod mediami pasek CTA „Dowiedz się więcej” |

Miejsce na „Sprawdź”: dopisz `div[role="button"]` do lewej grupy w `section` paska akcji (obok Udostępnij), przed grupą Zapisz.

Pułapki:
- W DOM były tylko 4 `article` naraz; starsze posty są usuwane przy przewijaniu.
- Szukaj elementów po `aria-label` ikon `svg`, a nie po kolejności dzieci.
- Przy pierwszym wejściu pojawia się modal „Włącz powiadomienia”, który przykrywa feed (nie klikać).
- Motyw: `__fb-dark-mode` na `html`, tło `#0C1014`, tekst `#F5F5F5`, drugorzędny `#A8A8A8`, linie `#262626`. Szyna ikon 72 px, post 470, media 468 (4:5), awatar 32, ikony 24.

## Reddit (reddit.com, interfejs shreddit)

Nie zmierzone: narzędzie przeglądarki blokuje reddit.com. Makieta jest zbudowana z publicznie znanej struktury komponentów shreddit. Przed pokazem na żywo sprawdź selektory na prawdziwej stronie.

| Element | Selektor |
| --- | --- |
| Kontener feedu | `shreddit-feed` |
| Post | `shreddit-post` (custom element) w `article`; reklama: `shreddit-ad-post` |
| Autor | atrybut `author` (w feedzie strony głównej autor nie jest widoczny, w pasku jest subreddit) |
| Subreddit | atrybut `subreddit-prefixed-name` |
| Tytuł | atrybut `post-title` albo `a[slot="title"]` |
| Tekst | `[slot="text-body"]` |
| Media | `[slot="post-media-container"]` |
| Link | atrybut `permalink`, `id="t3_..."` |
| Pasek akcji | w open shadow root posta (`post.shadowRoot`): głosowanie, komentarze, udostępnij |
| Reklama | `shreddit-ad-post`, etykieta „Promowane” w `[slot="credit-bar"]` |
| Dalsze strony | `faceplate-partial[loading="lazy"]` w feedzie |

Miejsce na „Sprawdź”: wstaw element w light DOM jako rodzeństwo zaraz po `shreddit-post` w jego `article`. Wstawienie do `shadowRoot` jest możliwe (root jest otwarty), ale komponent może go przerysować; w makiecie rząd akcji to `shadowRoot.querySelector('[data-post-click-location="vote"]')`.

Pułapki:
- Pasek akcji jest w shadow DOM, więc `document.querySelector` go nie widzi.
- Nowe porcje feedu przychodzą jako HTML z `faceplate-partial` i są wstawiane w miejsce tego elementu.
- Motyw: klasa na `html` (w makiecie `theme-dark` / `theme-light`; do sprawdzenia).

## TikTok (tiktok.com)

| Element | Selektor |
| --- | --- |
| Kontener feedu | `#column-list-container` (to on przewija się, nie `window`; `scroll-snap-type: y mandatory`) w `main#main-content-homepage_hot` |
| Post | `article[data-e2e="recommend-list-item-container"]`, `id="one-column-item-N"`, `data-scroll-index="N"`, wysokość = okno |
| Wideo | `section[data-e2e="feed-video"]` (w środku `video`, `img` plakatu, `canvas`) |
| Autor | `a[href^="/@"]` w nakładce na dole wideo (bez `data-e2e`; tekst w `p`); awatar: `a[data-e2e="video-author-avatar"]` |
| Opis | `[data-e2e="video-desc"]` (spany `desc-span-*`, hashtagi `a[data-e2e="search-common-link"]`) |
| Pasek akcji | `section` obok wideo: `[data-e2e="like-icon"]`, `"comment-icon"`, `"favorite-icon"`, `"share-icon"` (każdy `role="button"`, liczby w `strong[data-e2e$="-count"]`) |
| Nawigacja | `[data-e2e="feed-navigation-prev"]`, `"feed-navigation-next"` |
| Reklama | etykieta „Sponsorowane” przy autorze i przycisk CTA w nakładce (nie zaobserwowane w sesji; brak znanego `data-e2e`, szukaj tekstu w nakładce) |

Miejsce na „Sprawdź”: dopisz element na końcu `section` z akcjami (po `share-icon`), w tym samym formacie co inne akcje (okrągły przycisk 48 px + podpis). Wynik leży na dole samego `section[data-e2e="feed-video"]` (`position:relative`, szerokość kadru). Zmierzone 2026-11-22: rodzic `feed-video` obejmuje też kolumnę akcji (ok. 1320 px przy kadrze 881 px), więc karta zakotwiczona w nim wychodzi poza film i zasłania akcje. Makieta ma ten sam układ: `article > div.m-row > [section feed-video (film i nakładka), section.m-actions]`.

Pułapki:
- Przewijanie dzieje się w `#column-list-container`, więc nasłuchuj `scroll` na nim, a nie na `window`.
- Wideo jest dekodowane do `canvas`/`tt-vod-sr-wrap`; `video` może nie mieć klatek do odczytu.
- Motyw: atrybut `data-theme="dark"` (na `html` lub `body`). Dark: tło `#000`, liczniki `rgba(255,255,255,.75)` 12/700. Nawigacja boczna 240, wideo 9:16 z marginesem 16, kolumna akcji 70 px, 16 px na prawo od wideo.
