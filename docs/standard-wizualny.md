# Standard wizualny strony

Stan na 2026-11-22. Dokument opisuje kierunek z gałęzi `redesign/reimagined`, zaakceptowany przez założyciela 2026-11-10, w postaci wdrożonej w `src/styles.css` i `src/App.jsx`. Gdy kod i dokument się rozjadą, rozstrzyga decyzja założyciela; dokument trzeba wtedy poprawić razem z kodem.

Zasady treści (co wolno napisać, co jest DRAFT, czego nie wymyślać) są w `AGENTS.md`. Ten dokument dotyczy wyłącznie wyglądu i zachowania.

---

## 1. Idea

Strona jest złożona jak **sprawdzony dokument**: papier, tusz i ołówek recenzenta. Wszystko, co widać, powinno dać się opisać jednym z tych trzech materiałów.

- **Papier** to tło i kartki leżące na biurku.
- **Tusz** to tekst, linie podziału i ciemne sekcje.
- **Ołówek** to jedyny motyw graficzny: niebieski potwierdza i niesie ofertę, czerwony poprawia, zatrzymuje i oznacza braki.

Konsekwencje dla każdej nowej rzeczy:

1. Nie dodajemy kolorów, gradientów dekoracyjnych, ikon ilustracyjnych, zdjęć stockowych ani ilustracji. Jeśli czegoś nie da się pokazać typografią, linią albo kartką, prawdopodobnie nie jest potrzebne.
2. Struktura wynika z linii (1 px) i odstępów, nie z ramek, teł i cieni. Cień ma tylko kartka.
3. Ruch to ołówek, który stawia znaki, i kartki kładzione na biurku. Nic nie lata, nie odbija się, nie świeci.
4. Strona jest kompletna bez JavaScriptu i bez ruchu. Ruch tylko opowiada to, co i tak jest na ekranie.

---

## 2. Kolor

Tokeny są na początku `src/styles.css` (`:root`). W kodzie używamy wyłącznie tokenów, nigdy wartości wpisanych na sztywno (wyjątki w p. 2.4).

### 2.1 Paleta

| Token | Wartość | Rola |
|---|---|---|
| `--paper` | `#f0f2ef` | tło strony (papier offsetowy) |
| `--sheet` | `#fcfdfb` | kartka leżąca na biurku, pola formularza |
| `--desk` | `#e2e6e2` | biurko: tło sekcji kontaktu, tło przełączników |
| `--ink` | `#14161a` | tekst, linie mocne, tło sekcji „Czego nie robię” i stopki |
| `--ink-soft` | `#4d5359` | tekst drugorzędny: leady sekcji, opisy, metadane |
| `--line` | `#c6ccc7` | linia podziału między wierszami, krawędź kartki |
| `--line-soft` | `#d9ddd9` | linia wewnątrz kartki, między pozycjami listy |
| `--field-line` | `#767c83` | obramowanie pól formularza (kontrast ≥ 3:1), kropki spisu treści |
| `--blue` | `#2340c8` | ołówek potwierdzający: oferta, linki, przyciski, numery, znaki ✓ |
| `--blue-deep` | `#1a31a3` | hover przycisku |
| `--on-blue` | `#fcfdfb` | tekst na niebieskim |
| `--on-blue-soft` | `#cdd6ff` | tekst drugorzędny na niebieskim |
| `--red` | `#c42b17` | ołówek poprawiający: skreślenia, błędy, „Stop”, „Do uzupełnienia” |
| `--red-on-ink` | `#ff8a75` | czerwony na ciemnym tle (słowo „Nie” w zasadach) |

### 2.2 Znaczenie koloru

- **Niebieski = potwierdzone, oferta, działanie.** Przyciski, linki, numery etapów, znak ✓, uwagi na marginesie (`Note`), podkreślenia nawigacji, pasek postępu prezentacji.
- **Czerwony = poprawka, granica, brak.** Skreślenie w szkicu, błąd pola, wiersz „Stop” w standardzie, `Pending` („Do uzupełnienia”), słowo „Nie”. Czerwonego nigdy nie używamy do akcentu ani do wezwania do działania.
- Poza papierem, tuszem i dwoma ołówkami **nie ma innych kolorów**. Szarości to wyłącznie tokeny z tabeli.

### 2.3 Motywy (pola koloru)

Motyw podmienia tokeny, a nie poszczególne elementy, dlatego każdy komponent działa w każdym motywie.

| Motyw | Gdzie | Co się zmienia |
|---|---|---|
| `paper` | domyślny | — |
| `desk` | slajdy `/konsultacja/` | `--paper` → `#e2e6e2` |
| `ink` | slajdy `/konsultacja/` | tło tusz, tekst papier, niebieski rozjaśniony `#a9b8ff` |
| `blue` | hero (`.theme-blue`), nagłówek nad hero, slajd końcowy | tło `#2340c8`, tekst `#fcfdfb`, „niebieski” staje się biały |

Ciemne sekcje strony głównej („Czego nie robię”, stopka) mają tło `--ink` i tekst `--paper`; linie na nich to `--paper` z 24% krycia.

**Kartka jest zawsze papierem i tuszem**, niezależnie od otaczającego motywu (`.sheet`, `.proof` przywracają tokeny jasne). Dzięki temu teczka w niebieskim hero i karty na ciemnym slajdzie wyglądają jak ten sam papier.

Na stronie głównej są dokładnie **dwa niebieskie pola**: hero i mocne wezwanie zamykające przebieg konsultacji (`.flow-close .cta`). Trzeciego nie dodajemy.

### 2.4 Wyjątki od tokenów

Wartości wpisane na sztywno są dozwolone tylko tam, gdzie element musi wyglądać tak samo niezależnie od motywu: pełne niebieskie pole wezwania, zakładki stosu kartek na ostatnim slajdzie, `@property` z wartościami początkowymi, style druku i `<noscript>`. Każdy nowy wyjątek wymaga tego samego uzasadnienia.

---

## 3. Typografia

Trzy kroje, wszystkie lokalne w `public/fonts` (licencje OFL obok plików), ładowane z `font-display: swap`. Bez Google Fonts i zewnętrznych CDN.

| Krój | Token | Rola |
|---|---|---|
| **Brygada 1918** (szeryf, 400–700, z kursywą) | `--serif` | głos: wszystkie nagłówki, pytania klientów, tekst analiz, uwagi na marginesie, cytaty, numery |
| **Archivo** (bezszeryf, oś szerokości 62–125%) | `--sans` | interfejs: tekst bazowy, nawigacja, przyciski, etykiety, formularz, metadane |
| **IBM Plex Mono** (400) | `--mono` | wyłącznie surowy tekst maszynowy: szkic do sprawdzenia, instrukcja dla modelu, podgląd opisu z formularza |

Zasady:

- Mono nigdy nie służy do dekoracji, etykiet „technicznych” ani nagłówków. Oznacza: „to jest surowy tekst, a nie zredagowana treść”.
- Kursywa szeryfowa oznacza **głos piszącego na marginesie**: podtytuł hero, uwagi (`Note`), lead artykułu, cytat wyróżniony, druga linia nagłówka hero, słowo „Nie”.
- Etykiety i metadane to Archivo z lekko zwężoną szerokością: `font-stretch: 92–94%`, waga 500–600. Nie używamy wersalików ani rozstrzelenia (`letter-spacing` dodatniego).
- Nagłówki: szeryf, waga 500 (nie bold), ujemny tracking `-.015em` do `-.04em` (im większy stopień, tym ciaśniej), `line-height` 0.92–1.12, `text-wrap: balance`.
- Tekst ciągły: `text-wrap: pretty`, długość wiersza 34–64 znaków (`max-width` w `ch`).
- Liczby w tabelach i metadanych: `font-variant-numeric: tabular-nums`; numery etapów: `lining-nums`.
- **Polska typografia:** funkcja `pl()` w `App.jsx` wiąże jednoliterowe spójniki i przyimki (a, i, o, u, w, z) z następnym słowem. Każdy nowy tekst z `src/content` przechodzi przez `plDeep`/`pl`.

### 3.1 Skala

| Token | Wartość | Użycie |
|---|---|---|
| `--t-display` | `clamp(2.6rem, 6.9vw, 6rem)` | nagłówek hero, tytuły slajdów |
| `--t-title` | `clamp(2.2rem, 4.7vw, 4rem)` | tytuł artykułu, mocne wezwanie |
| `--t-h2` | `clamp(1.9rem, 3.2vw, 2.875rem)` | nagłówek sekcji, etap przebiegu |
| `--t-h3` | `clamp(1.375rem, 1.9vw, 1.75rem)` | pytanie klienta, zasady, podtytuł hero |
| `--t-lead` | `clamp(1.125rem, 1.45vw, 1.3125rem)` | lead hero, tekst etapów, bio |
| `--t-body` | `1.0625rem` (17 px) | tekst bazowy, `line-height: 1.6` |
| `--t-small` | `.9375rem` (15 px) | opisy, etykiety pól, nawigacja |
| `--t-meta` | `.8125rem` (13 px) | metadane, pasek kartki, podpisy |

Tekst artykułu: szeryf `1.25rem / 1.62` (na telefonie `1.125rem / 1.6`), inicjał niebieski na 3.9 em.

Nowych stopni nie dodajemy. Jeśli coś nie pasuje do skali, najpierw sprawdzamy, czy element nie jest w złej roli.

---

## 4. Siatka, odstępy, rytm

- Kontener `.wrap`: maksymalnie **1320 px**, margines boczny `--gutter` = `clamp(20px, 5vw, 72px)` (16 px poniżej 360 px szerokości).
- Siatka **12 kolumn**, odstęp `--gap` = `clamp(20px, 2.4vw, 32px)`. Typowy układ sekcji: nagłówek w kolumnach 1–6, lead w 8–12; treść 1–6 lub 4–11, element boczny 8–12.
- Odstęp pionowy sekcji: `--section` = `clamp(72px, 9vw, 128px)`. Odstęp nagłówek → treść: `clamp(40px, 5vw, 72px)`.
- **Linie zamiast pudełek.** Lista lub tabela zaczyna się linią tuszu (`1px solid var(--ink)`), wiersze dzieli `--line`, pozycje wewnątrz kartki `--line-soft`.
- Zaokrąglenia małe i stałe: kartka 3 px, przycisk i pola 4 px, przełącznik 5 px. Nic okrągłego poza kropkami nawigacji prezentacji.
- Nagłówek strony: 65 px (68 px na telefonie), przyklejony, półprzezroczysty papier z rozmyciem; nad hero przejmuje niebieskie pole.

### 4.1 Punkty przełamania

| Szerokość | Zmiana |
|---|---|
| ≤ 1100 px | węższe kolumny boczne, artykuł 38rem + margines |
| ≤ 900 px | siatki 12-kolumnowe przechodzą w jedną kolumnę; teczka przebiegu wraca do etapów; sytuacje jako lista |
| ≤ 767 px | menu rozwijane, przyciski na pełną szerokość, tabele w jednej kolumnie |
| ≤ 359 px | mniejszy margines i znak słowny |

Minimalna szerokość strony: 320 px, bez poziomego przewijania.

---

## 5. Elementy

### 5.1 Znaki ołówka (`Mark`)

Jedyny zestaw grafik własnych: SVG 18×18, kreska `1.7`, zaokrąglone końce, kolor z `currentColor`, rozmiar `1.05em`.

| Znak | Znaczenie |
|---|---|
| `tick` ✓ | sprawdzone, jest w źródle, warunek spełniony |
| `bar` ⊢ | uwaga na marginesie, poprawka |
| `caret` ^ | wstawka (zarezerwowany) |
| `query` ? | otwarte pytanie, brak do uzupełnienia |

Nowe znaki muszą być znakami korektorskimi rysowanymi jedną kreską. Ścieżki mają `pathLength="1"`, żeby dało się je „rysować” w animacji.

### 5.2 Ikony interfejsu

Tylko `@phosphor-icons/react`, wariant regular: `ArrowRight`, `ArrowLeft`, `CaretDown`, `Copy`, `Check`. Ikona zawsze towarzyszy tekstowi i ma `aria-hidden`. Ikon nie używamy jako ilustracji sekcji.

### 5.3 Uwagi na marginesie

- `Note`: niebieska kursywa szeryfowa ze znakiem `bar`, max 46 ch. **Jedno zastrzeżenie na kontekst** (sekcję, kartę, stronę).
- `Pending`: czerwona, ze znakiem `query`, zaczyna się od „**Do uzupełnienia:**”. Oznacza fakt, który założyciel musi dostarczyć. Nie usuwamy jej, dopóki fakt nie zostanie dostarczony.

### 5.4 Kartka (`.sheet`)

Kartka leżąca na biurku: tło `--sheet`, krawędź `--line`, promień 3 px, cień `--shadow-sheet`. To **jedyny element z cieniem** (oraz `.proof`).

- Pasek u góry (`.sheet-bar`): tytuł po lewej w tuszu, licznik lub status po prawej („2 z 5”, „Formularz demonstracyjny”), Archivo `--t-meta`, zwężony.
- Opcjonalna stopka (`.sheet-foot`) w tym samym stylu.
- Wewnątrz: wiersze `dt/dd` lub listy oddzielone `--line-soft`.
- Kartką są: karty przebiegu konsultacji (teczka), formularz kontaktowy, formularz przewodnika, spis treści i fragment przykładowego kompendium, panel sytuacji, przykład standardu, szkic do sprawdzenia, rozwijane menu na telefonie.
- Kartka nie jest „kafelkiem” do układania w siatce. Nie stawiamy obok siebie rzędu równych kartek. Kartki leżą pojedynczo albo w **stosie** (teczka: każda kolejna przesunięta o 48 px w dół, widać paski poprzednich).

Rodzaje treści kart przebiegu (`FlowSheet`): `card` (wiersze i skala 1–5), `questions`/`list` (pozycje ze znakiem), `slide` (tytuł i trzy numerowane punkty), `contents` (spis z kropkami i numerami stron).

### 5.5 Listy i wiersze zamiast kafelków

Domyślny sposób pokazania zbioru rzeczy to **wiersze rozdzielone liniami** w siatce 12 kolumn:

- etapy przebiegu: duża niebieska cyfra, nagłówek h2, tekst, wartość dla klienta jako uwaga ze znakiem ✓;
- sytuacje: rola (Archivo), pytanie (szeryf h3), opis, format; na szerokim ekranie z JS pionowe zakładki i kartka-panel;
- formaty: zwarte wiersze, szczegóły w rozwijanych sekcjach;
- wiedza otwarta (przewodnik, analizy, przykładowe kompendium): metadane, duży tytuł z podkreśleniem na hover, strzałka;
- rozdziały przewodnika (`.guide-chapters`): niebieska cyfra, tytuł szeryfowy w stopniu `--t-h3`, opis w `--ink-soft` po prawej;
- ekspertyza, warunki konsultacji (`terms`): cztery kolumny z linią tuszu u góry i znakiem ✓.

### 5.6 Przyciski i linki

- **Przycisk** (`.btn`): niebieskie tło, biały tekst Archivo 500, min. 56 px wysokości (kompaktowy 52 px), promień 4 px, strzałka w prawo. Hover: `--blue-deep` i strzałka przesuwa się o 5 px. Na telefonie na pełną szerokość. **Jeden przycisk na kontekst**; drugie działanie to link.
- Na niebieskim polu przycisk odwraca się: białe tło, niebieski tekst.
- **Link tekstowy** (`.link`): niebieski, 500, podkreślenie 1 px, które na hover pogrubia się do 2 px; opcjonalna strzałka przesuwa się o 4 px. Min. 44 px wysokości celu.
- Powrót: `.back-link` ze strzałką w lewo.

### 5.7 Wezwania do działania (`CallToAction`)

Linia tuszu u góry, tytuł szeryfowy po lewej, przycisk (i ewentualnie link) po prawej. Wariant mocny, tylko pod przebiegiem konsultacji, to pełne niebieskie pole z tytułem w stopniu `--t-title`. Wezwania stoją po przebiegu, po formatach, po zasadach i na końcu prezentacji.

### 5.8 Rozwijane sekcje (`Disclosure`)

Natywne `<details>`, min. 56 px, strzałka `CaretDown` obraca się o 180°, wysokość animowana przez `::details-content`. Tekst wewnątrz w `--t-small`, `--ink-soft`.

### 5.9 Formularz

Leży na kartce na tle biurka. Etykieta nad polem (Archivo 600, zwężona), dopisek „(wymagany)/(opcjonalne)” w `--t-meta`. Pole: tło `--sheet`, krawędź `--field-line`, 52 px. Focus: niebieska krawędź i poświata 3 px z 22% niebieskiego. Błąd: czerwona krawędź, komunikat pod polem, zbiorcze podsumowanie błędów u góry z fokusem. Podgląd gotowego opisu w mono na papierze, ze znakiem ✓. Formularz zawsze mówi wprost, że niczego nie wysyła.

Pola wyboru (`.check`): natywny checkbox 20 px w kolorze `--blue` (`accent-color`), etykieta obok, cel min. 44 px. Grupy opcji (`.stack-group`) to wiersze: nazwa grupy po lewej, opcje po prawej, pierwsza linia tuszem, kolejne `--line-soft`. Zgoda stoi osobno, między dwiema liniami, tuż nad przyciskiem.

### 5.10 Tabele danych

Linia tuszu u góry, wiersze `--line`, liczby wyrównane do prawej i tabularne, ostatni wiersz (suma) pogrubiony z linią tuszu. Podpis pod tabelą w `--t-meta`.

### 5.11 Szkic sprawdzany względem źródła (`Proof`)

Tekst szkicu w mono, poprawki na marginesie czerwoną kursywą, skreślenie czerwoną kreską 1.5 px (nie `line-through`). Przełącznik „Z poprawkami / Po sprawdzeniu” to segmentowany przełącznik na tle biurka. Wersja po sprawdzeniu przechodzi na szeryf z niebieskim ✓ i cytatem źródła.

---

## 6. Strony i ich prezencja

- **Strona główna — jedna oś.** Kolejność: hero (niebieskie pole, nagłówek w dwóch liniach, druga kursywą; obok gotowa teczka czterech kart, kompendium na wierzchu; pod przyciskiem link do przewodnika) → przebieg konsultacji → sytuacje → formaty jako wiersze → „Czego nie robię” (tło tuszu) → wiedza otwarta → o mnie → kontakt (tło biurka) → stopka (tusz, duży znak słowny). Hero wypełnia dokładnie jeden ekran razem z nagłówkiem.
- **`/konsultacja/`** — przewijana prezentacja: wstęp, pięć etapów (każdy jeden ekran, z motywem `paper`/`desk`/`ink`/`blue`), slajd końcowy na niebiesko. Wielka cyfra etapu (do 15 rem), tytuł w `--t-display`, kartka po drugiej stronie; co drugi slajd odwrócony.
- **`/przewodnik/`** — nagłówek jak w artykule (rodzaj, tytuł, lead kursywą, metadane, jeden przycisk prowadzący do formularza), rozdziały jako wiersze, „Przewodnik w skrócie” w czterech kolumnach, potem formularz na kartce na tle biurka i jedno wezwanie na końcu.
- **Analizy, przykład standardu i przykładowe kompendium** — kolumna do czytania (43 rem) w szeryfie, obok margines z pojęciami ze słownika (przyklejony), na górze trzy tezy. Przykład standardu i przykładowe kompendium zawsze z podpisem o materiale syntetycznym.
- **Stopka** zawiera kolofon z nazwami krojów i link „Włącz animacje”.

---

## 7. Ruch

Jeden język: **ołówek stawia znaki, kartki są kładzione na biurku, tusz wypełnia formy.** Jedyny autorski moment to sekwencja otwarcia; wszystko po niej odpowiada na przewijanie i działania czytelnika.

### 7.1 Bramka

- Ruch działa tylko pod klasą `html.js-motion`, ustawianą przed pierwszym malowaniem w `index.html`.
- Klasy nie ma przy `prefers-reduced-motion: reduce`, chyba że odwiedzający sam włączy animacje (link w stopce albo `?motion`, zapamiętywane w `localStorage`). `?nomotion` wyłącza ruch i kasuje wybór.
- Każdy stan „przed animacją” musi być zapisany tak, żeby bez klasy element był w stanie końcowym. Wzorzec: `var(--sp, 1)`, czyli brak zmiennej oznacza scenę ukończoną.
- Druk ustawia wszystkie sceny jako ukończone.

### 7.2 Krzywe i czasy

- Krzywa główna `--ease` = `cubic-bezier(.16, 1, .3, 1)` (szybki start, długie wyhamowanie). Do zmian koloru i krycia: `ease`.
- Mikrointerakcje (hover, kolor): 0.2 s. Przesunięcia strzałek, podkreślenia: 0.35–0.45 s. Wejścia: 0.7–1.1 s. Zmiana motywu całej strony: 0.9 s.
- Opóźnienia kaskadowe liczymy ze zmiennej `--i` (indeks elementu): 0.06–0.13 s na krok.
- Bez sprężyn, odbić, obrotów 3D, paralaksy tła, rozmycia w ruchu i efektów cząsteczkowych.

### 7.3 Słownik ruchów (`@keyframes`)

| Nazwa | Ruch | Gdzie |
|---|---|---|
| `rise` | linia tekstu wyjeżdża spod maski | nagłówek hero, wstęp prezentacji |
| `settle` | wyjście z przezroczystości z 16 px w górę | tekst pod nagłówkiem, indeks etapów |
| `lay` | kartka opada z −44 px i obrotu −2.5° | teczka w hero |
| `draw` | kreska znaku rysuje się (`stroke-dashoffset`) | znaki ✓ i ⊢ |
| `strike` | czerwone skreślenie przeciąga się w poprzek | szkic w `Proof` |
| `rule` | linia tuszu rysuje się od lewej | indeks etapów |
| `appear` | samo krycie | panel sytuacji, uwagi |

### 7.4 Sceny sterowane przewijaniem

- **Słowa rozświetlane przewijaniem** (`Words`, `motion.js` ustawia `--p`): słowa przechodzą z krycia 0.38 (0.22 w prezentacji) do 1.
- **Teczka przebiegu** (strona główna, ≥ 901 px): kartki są przypięte obok tekstu i układają się w stos w miarę czytania; aktywny etap w pełnym tuszu, pozostałe 42% krycia.
- **Prezentacja `/konsultacja/`** (≥ 901 px i ≥ 560 px wysokości): każdy etap przypięty na 220 vh. Postęp `--sp` (0→1) rozkłada się na zmienne pochodne: `--a` kartka kładziona na biurko, `--t` cyfra wypełnia się tuszem i tytuł wyjeżdża, `--u` podkreślenie ołówkiem, `--w` zdanie czytane słowo po słowie, `--r` kartka wypełniana wiersz po wierszu, `--v` wartość odhaczona. Scena cofa się przy przewijaniu w górę. Na ostatnim etapie spod kartki wysuwają się zakładki poprzednich czterech. Motyw slajdu przechodzi na całą stronę razem z nagłówkiem. U góry niebieski pasek postępu, po prawej kropki etapów.
- **Nagłówek**: przy przewijaniu dostaje dolną linię (`animation-timeline: scroll()`, jeśli przeglądarka wspiera).
- Przejścia między stronami: `@view-transition` (tylko bez preferencji ograniczenia ruchu).

### 7.5 Hover

Podkreślenie dorysowuje się od lewej, strzałka przesuwa się o 4–8 px, tytuł analizy zmienia kolor na niebieski, a strzałka obraca się o −45°. Nic nie powiększa się i nie podskakuje.

---

## 8. Dostępność (warunki konieczne)

- Strona w pełni czytelna bez JS (prerender) i z `prefers-reduced-motion`.
- Cel kliknięcia min. 44 px.
- Focus: niebieski kontur 2 px z odstępem 3 px (biały na niebieskim i ciemnym tle).
- Link „Przejdź do treści”, `aria-current` w nawigacji, zakładki sytuacji obsługiwane strzałkami, Home i End.
- Elementy dekoracyjne (teczka w hero, stos kartek, znaki) mają `aria-hidden`; ta sama treść jest dostępna w tekście.
- Kontrast tekstu co najmniej WCAG AA; obramowanie pól co najmniej 3:1.

---

## 9. Lista kontrolna dla nowego elementu

1. Czy da się go opisać jako papier, tusz albo ołówek? Jeśli nie, przemyśl go od nowa.
2. Czy używa wyłącznie tokenów koloru, skali i odstępów?
3. Czy kolor coś znaczy (niebieski = potwierdzone/działanie, czerwony = poprawka/brak)?
4. Czy struktura opiera się na liniach i odstępach, a nie na tłach i cieniach?
5. Czy działa w motywach `blue` i `ink` (jeśli może się tam znaleźć)?
6. Czy bez JS i bez ruchu jest w stanie końcowym?
7. Czy ma jedno zastrzeżenie na kontekst i co najwyżej jeden przycisk?
8. Czy wygląda dobrze przy 320, 390, 900, 1280 i 1440 px?

---

## 10. Porządki do zrobienia w kodzie

W `src/styles.css` zostały reguły po wcześniejszych układach, które nie mają już odpowiedników w `App.jsx`: `.offer*`, `.exhibit*`, `.method-steps`, `.step-numeral`, `.method-closing` oraz część `.format-grid`/`.format-primary`/`.format-side`. Komentarz w `src/motion.js` wspomina „the green pour” i „pinned method scene”, których już nie ma. Nie wpływa to na wygląd, ale warto to usunąć, żeby kod odpowiadał temu dokumentowi.
