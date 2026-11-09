# Design QA

Źródło wizualne: `design/selected-reference.jpeg` (893 × 1536 px, kompozycja desktopowa). Od 2026-11-09 makieta jest wiążąca dla otwarcia strony: header, hero, pasek „Perspektywa”, zielony blok W i wiersz K. Poniżej układ projektowany samodzielnie w granicach systemu wizualnego (`docs/design-system.md`).

## Metoda

Zrzuty headless Chromium (systemowy `/usr/bin/chromium`, `--headless=new`, skala 1, bez pasków przewijania, `--virtual-time-budget=6000`). Pełne strony w oknach 1440, 768 i 390 px; podstrony w 1280 i 390 px. Pliki: `design/qa/before/` (stan z 2026-10-30) i `design/qa/after/` (stan po rewizji z 2026-11-09). Emulacja urządzeń, czytnik ekranu i pomiary Core Web Vitals nie były częścią tego przeglądu.

## Przegląd z 2026-11-09 (Fable): stan przed

Wnioski z `design/qa/before/`:

- Strona główna poniżej wiersza K składała się z ośmiu sekcji o identycznej anatomii (eyebrow, szeryfowy H2 po lewej, Inter po prawej, cienka linia). Wrażenie szablonu.
- Brak artefaktu pracy na stronie głównej; próbka standardu schowana za linkiem z trzema zastrzeżeniami.
- Dziewięć zdań asekuracji na stronie głównej; powtórzone zastrzeżenia przy formularzu (4 noty).
- Architektura zapętlona: W → K → problem → W → K → R; link z zielonego bloku przeskakiwał sekcję.
- Defekty detalu: sierota „AI” w H2 konsultacji (1440), „pracy.” samotne w hero (390), brak spacji w „Proces.Technologia.” (mobile), strzałka listy analiz ~700 px od tytułu, puste pół-kolumny pod K i Podejściem, kolumna artykułu (760 px wyśrodkowana) rozjechana z lewym marginesem nagłówka.

## Wykonane zmiany

1. Strona główna w jednej osi: Sytuacja + rezultaty + warunki jako sekcja W; eksponat standardu (tablica, 6 wierszy, tło sand); K jako wcięta nota z R w przypisie; Podejście w trzech kolumnach z cyframi; dwie analizy w dwóch kolumnach; O mnie z wierszami ekspertyzy; Kontakt.
2. Eyebrow all-caps i strzałki przy każdym linku zostają tylko w otwarciu (makieta). Numeracja tylko przy trzech krokach metody.
3. Jedno zastrzeżenie na kontekst. Marker `Do uzupełnienia` jako jeden konsekwentny element dla faktów od założyciela.
4. Podstrony: nagłówek i kolumna czytelnicza na wspólnej lewej krawędzi; marginalia ze słownikiem po prawej (sticky); tezy pod nagłówkiem; pull quote; tabela dla przykładu 24 vs 26 min; linia metadanych z czasem czytania.
5. Detal: `text-wrap: balance` na nagłówkach i `pretty` na akapitach; hero mobile 11,8vw (3 wiersze przy 390 i 320); spacja w „Proces. Technologia.”; płynne otwieranie disclosure (`::details-content`, 220 ms, wyłączone przy reduced-motion); hover linków bez skoku grubości; favicon SVG; `og:title`/`og:description` per strona w prerenderze.

## Drugie przejście (2026-11-09, warstwa wizualna)

- Newsreader italic (latin + latin-ext, woff2 z Google Fonts, OFL) dla cytatu wyciągniętego, cytowanego materiału, puenty metody i leadu noty K.
- Niełamliwe spacje po jednoliterowych spójnikach i przyimkach (`pl()`), zastosowane do całej treści.
- Inicjał na początku analiz (float, Newsreader, zieleń).
- Podkreślenie linków jako gradient tła: pogrubienie przy hover bez skoku układu. Fokus klawiatury w kolorze ink (na zieleni paper) zamiast niebieskiego. Zaznaczenie tekstu w zieleni.
- Nawigacja śledzi bieżącą sekcję (`aria-current`, podkreślenie w zieleni).
- Kontakt na papierze zamiast drugiego odcienia sand; pola o ton jaśniejsze (`--field-bg`). Eksponat jest jedynym tonowanym pasmem poniżej zieleni.
- Kolofon w stopce: skład, brak śledzenia, status prototypu.
- `@view-transition` między stronami przy braku preferencji reduced-motion.

## Trzecie przejście (2026-11-09, skala i oferta)

Założyciel: strona główna „samym skalowaniem odstaje” od jakości podstrony analizy; usługą główną są konsultacje AI szyte na miarę; dozwolone placeholdery sytuacji.

- Jedna skala typograficzna dla całej strony (tokeny `--t-*`). Otwarcie wraca do natywnych proporcji makiety: hero 108 px zamiast 164, nagłówek zielonego bloku 72 zamiast 134, nawigacja 17 zamiast 24, sygnatura 30 zamiast 42, przycisk hero 24 px zamiast 40. Header strony głównej i podstron jest teraz identyczny.
- Zielony blok: „Konsultacje AI szyte na miarę”. Wiersz pod nim wskazuje format „Jedna decyzja” i eksponat.
- Nowa sekcja sytuacji: pięć przykładowych ról z pytaniem i doborem formatu, oznaczone jako poglądowe (`site.cases`, DRAFT).
- W/K/R jako trzy formaty w jednej sekcji; W zachowuje rezultaty i warunki, R jest przypisem.
- Zweryfikowane na 1440, 768 i 390: brak sierot w nagłówkach, hero w trzech wierszach na mobile, wiersze sytuacji i formatów składają się do jednej kolumny poniżej 900 px.

## Czwarte przejście (2026-11-09, przewijane doświadczenie)

Założyciel: „wodotryski animacji, efekt wow, który pasuje do klimatu, przewijane doświadczenie jak Apple”. Wprowadzone: sekwencja otwarcia, cofanie hero, sticky kurczący się nagłówek, wlewający się zielony blok, słowa rozświetlane przewijaniem, odsłanianie sekcji i wierszy tablicy sterowane przewijaniem, przypięta scena metody (desktop), ziarno papieru. Szczegóły w `docs/design-system.md`, sekcja „Ruch”.

Weryfikacja przez `qa-views/scroll.html` (iframe tej samej domeny przewinięty do elementu): hero po sekwencji, przewinięcie 260 px (nagłówek skompaktowany, hero wygaszone), zielony blok w połowie wejścia i po wejściu (słowa częściowo rozświetlone), scena metody przy 9 % i 73 % postępu (krok 1 i 3, pasek rośnie). Pierwsza wersja odsłaniania opierała się na IntersectionObserver i w headless nie odpalała; zastąpiona przez `animation-timeline: view()`, co usuwa ryzyko niewidocznej treści w razie braku callbacku.

Nazwisko założyciela (Piotr Wrotny) wprowadzone do sygnatury, tytułów, bio i podpisów.

## Stan po (weryfikacja na `design/qa/after/`)

- 1440: brak sierot w nagłówkach sekcji; eksponat czytelny jako tablica; nota K wcięta od kolumny 4 z zieloną linią; cyfry metody w zieleni; analizy w dwóch kolumnach z linkiem w polu.
- 768: siatki trzykolumnowe złożone do jednej kolumny poniżej 900 px; nota K wcięta o jedną kolumnę; marginalia pod tekstem.
- 390: hero w trzech wierszach; tablica eksponatu jako lista z etykietą nad opisem; przycisk W w jednym wierszu; stopka bez przepełnienia.
- Podstrony 1280: tezy w trzech kolumnach; marginalia sticky; tabela z wyrównaniem liczb do prawej i podpisem.
- Build: `npm run build` generuje 5 stron; CSS 6,8 kB gzip; testy workera 3/3.

## Do sprawdzenia poza tym przeglądem

Rzeczywiste iOS/Android, czytnik ekranu (kolejność: tezy → treść → marginalia), zoom 200 %, Firefox (brak animacji `::details-content`, zachowanie bez zmian funkcjonalnych), druk podstron z marginaliami ukrytymi.
