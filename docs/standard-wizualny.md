# Standard wizualny strony

Stan na 2026-11-23 (strona główna opowiada historię odwiedzającego; ścieżka klienta jest na stronie usługi `/konsultacja/`). Dokument opisuje kierunek z gałęzi `redesign/reimagined`, zaakceptowany przez założyciela 2026-11-10, w postaci wdrożonej w `src/styles.css` i `src/App.jsx`. Gdy kod i dokument się rozjadą, rozstrzyga decyzja założyciela; dokument trzeba wtedy poprawić razem z kodem.

Zasady treści (co wolno napisać, co jest DRAFT, czego nie wymyślać) są w `AGENTS.md`. Ten dokument dotyczy wyłącznie wyglądu i zachowania.

---

## 1. Idea

Strona jest złożona jak **sprawdzony dokument**: papier, tusz i ołówek recenzenta. Wszystko, co widać, powinno dać się opisać jednym z tych trzech materiałów.

- **Papier** to tło i kartki leżące na biurku.
- **Tusz** to tekst, linie podziału i ciemne sekcje.
- **Ołówek** to jedyny motyw graficzny: niebieski potwierdza i niesie ofertę, czerwony poprawia, zatrzymuje i oznacza braki.

**Jedna rzecz na ekran, czytana z góry na dół** (decyzja założyciela 2026-11-22). Każdy ekran odpowiada na jedno pytanie odwiedzającego i ma najwyżej jedno działanie. Układ ekranów tego samego rodzaju jest identyczny, bez przeplatania stron lewej i prawej. Zanim dodasz element, nazwij pytanie, na które odpowiada; jeśli odpowiada już na nie coś innego, nie dodawaj go.

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
| `--red` | `#c02a16` (4,65:1 także na tle biurka; na tle tuszu `#ff8a75`) | ołówek poprawiający: skreślenia, błędy, „Stop”, „Do uzupełnienia” |
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
| `desk` | etapy ścieżki na stronie głównej | `--paper` → `#e2e6e2` |
| `ink` | etapy ścieżki na stronie głównej | tło tusz, tekst papier, niebieski rozjaśniony `#a9b8ff` |
| `blue` | hero (`.theme-blue`), nagłówek nad hero, ekran zamykający ścieżkę | tło `#2340c8`, tekst `#fcfdfb`, „niebieski” staje się biały |

Strona „Czego nie robię” i stopka mają tło `--ink` i tekst `--paper`; linie na nich to `--paper` z 24% krycia.

**Kartka jest zawsze papierem i tuszem**, niezależnie od otaczającego motywu (`.sheet`, `.proof` przywracają tokeny jasne). Dzięki temu teczka w niebieskim hero i karty na ciemnym slajdzie wyglądają jak ten sam papier.

Każda z dwóch stron ze scenami ma dokładnie **dwa niebieskie pola**. Strona główna: hero i scena zwrotu („Zacznij od swojej pracy, nie od rynku”), czyli miejsce, w którym pojawia się oferta. Strona usługi: hero i ekran zamykający ścieżkę (`.slide-end`). Pozostałe sceny używają tylko motywów `paper`, `desk` i `ink`. Trzeciego niebieskiego pola nie dodajemy. Czerwony ołówek nie pisze na niebieskim tle.

### 2.4 Wyjątki od tokenów

Wartości wpisane na sztywno są dozwolone tylko tam, gdzie element musi wyglądać tak samo niezależnie od motywu: zakładki stosu kartek na ostatnim etapie, `@property` z wartościami początkowymi, style druku i `<noscript>`. Każdy nowy wyjątek wymaga tego samego uzasadnienia.

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
- **Polska typografia:** funkcja `pl()` w `App.jsx` wiąże jednoliterowe spójniki i przyimki (a, i, o, u, w, z) z następnym słowem. Każdy nowy tekst z `src/content` przechodzi przez `plDeep`/`pl`. (Do 2026-11-22 funkcja wstawiała zwykłą spację i nie działała; poprawione na twardą spację.)

### 3.1 Skala

| Token | Wartość | Użycie |
|---|---|---|
| `--t-display` | `clamp(2.6rem, 6.9vw, 6rem)` | nagłówek hero, tytuł strony przewodnika |
| `--t-title` | `clamp(2.2rem, 4.7vw, 4rem)` | tytuł artykułu, tytuły etapów ścieżki, ekran zamykający |
| `--t-h2` | `clamp(1.9rem, 3.2vw, 2.875rem)` | nagłówek sekcji, etap przebiegu |
| `--t-h3` | `clamp(1.375rem, 1.9vw, 1.75rem)` | pytanie klienta, zasady, podtytuł hero |
| `--t-lead` | `clamp(1.125rem, 1.45vw, 1.3125rem)` | lead hero, tekst etapów, bio |
| `--t-body` | `1.0625rem` (17 px) | tekst bazowy, `line-height: 1.6` |
| `--t-small` | `.9375rem` (15 px) | opisy, etykiety pól, nawigacja |
| `--t-meta` | `.8125rem` (13 px) | metadane, pasek kartki, podpisy |

Tekst artykułu: szeryf `1.25rem / 1.62` (na telefonie `1.125rem / 1.6`), inicjał niebieski na 3.9 em.

Największy stopień na stronie ma zawsze jej pierwszy nagłówek; tytuły etapów są o stopień mniejsze, żeby ekrany ścieżki nie konkurowały z hero. Nowych stopni nie dodajemy. Jeśli coś nie pasuje do skali, najpierw sprawdzamy, czy element nie jest w złej roli.

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
| ≤ 900 px | siatki 12-kolumnowe przechodzą w jedną kolumnę; etapy ścieżki nie są przypinane; teczka w hero strony usługi i sterta papierów w hero strony głównej znikają (powtarzają to, co jest tuż pod nimi); sceny nie mają głębi 3D; mapa etapów w dwóch kolumnach; sytuacje jako rozwijane pytania |
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
- Kartką są: kartki etapów ścieżki (teczka), karta pierwszej rozmowy (formularz kontaktowy, p. 5.9), spis treści przewodnika, kartki komentarzy i list z analizą na stronie przewodnika (p. 5.12), spis treści i fragment przykładowego kompendium, panel sytuacji, przykład standardu, szkic do sprawdzenia, rozwijane menu na telefonie.
- Kartka nie jest „kafelkiem” do układania w siatce. Nie stawiamy obok siebie rzędu równych kartek. Kartki leżą pojedynczo albo w **stosie** (teczka: każda kolejna przesunięta o 48 px w dół, widać paski poprzednich).

Rodzaje treści kartek etapów (`FlowSheet`): `card` (wiersze i skala 1–5), `questions`/`list` (pozycje ze znakiem), `slide` (tytuł i trzy numerowane punkty), `contents` (spis z kropkami i numerami stron), `links` (prawdziwy spis z linkami: tylko etap 0; cały wiersz jest celem kliknięcia, metadana po prawej). Kartki etapów 1–5 noszą w pasku „n z 5”, kartka etapu 0 nie należy do teczki.

### 5.5 Listy i wiersze zamiast kafelków

Domyślny sposób pokazania zbioru rzeczy to **wiersze rozdzielone liniami** w siatce 12 kolumn:

- sytuacje: na szerokim ekranie z JS pionowe zakładki i kartka-panel; na wąskim i bez JS rozwijane pytania (`<details>`: rola w Archivo, pytanie w szeryfie h3, po rozwinięciu opis i dwa fakty);
- formaty: zwarte wiersze, szczegóły w rozwijanych sekcjach;
- ekspertyza, warunki konsultacji (`terms`), mapa etapów w hero (`.path-index`): kolumny z linią tuszu u góry; warunki ze znakiem ✓, mapa z cyfrą etapu nad nazwą.

### 5.6 Przyciski i linki

- **Przycisk** (`.btn`): niebieskie tło, biały tekst Archivo 500, min. 56 px wysokości (kompaktowy 52 px), promień 4 px, strzałka w prawo. Hover: `--blue-deep` i strzałka przesuwa się o 5 px. Na telefonie na pełną szerokość. **Jeden przycisk na kontekst**; drugie działanie to link.
- Na niebieskim polu przycisk odwraca się: białe tło, niebieski tekst.
- **Link tekstowy** (`.link`): niebieski, 500, podkreślenie 1 px, które na hover pogrubia się do 2 px; opcjonalna strzałka przesuwa się o 4 px. Min. 44 px wysokości celu.
- Powrót: `.back-link` ze strzałką w lewo.

### 5.7 Wezwania do działania

- **Przycisk** stoi tylko tam, gdzie zaczyna się rozmowa albo pobranie: hero obu stron, ekran zamykający ścieżkę, panel sytuacji, strona „Czego nie robię”, przewodnik, kontakt.
- **Działanie etapu** to link tekstowy ze strzałką pod uwagą o wartości (`.slide-action`), najwyżej jeden na etap. Etapy bez naturalnego działania (2, 3) go nie mają.
- **`CallToAction`** (linia tuszu u góry, tytuł szeryfowy po lewej, przycisk i ewentualnie link po prawej) zamyka stronę przewodnika.
- Działanie nosi tę samą nazwę w całej drodze: „Opisz swoją sytuację” na przycisku, w linku etapu 1 i w tytule sekcji kontaktu; „Pobierz przewodnik” w etapie 0 i na przycisku przewodnika, gdy plik istnieje (do tego czasu przycisk prowadzi do spisu treści).

### 5.8 Rozwijane sekcje (`Disclosure`)

Natywne `<details>`, min. 56 px, strzałka `CaretDown` obraca się o 180°, wysokość animowana przez `::details-content`. Tekst wewnątrz w `--t-small`, `--ink-soft`.

### 5.9 Formularze

Formularz nie jest zbiorem pól obok treści. **Jest dokumentem, który odwiedzający wypełnia albo dostaje**, leżącym na kartce: w kontakcie to karta pierwszej rozmowy, na stronie przewodnika to analiza: kartki komentarzy i list (p. 5.12). Formularz zawsze mówi wprost, że niczego nie wysyła.

- **Pole to linia do pisania**: bez ramki, sama dolna krawędź `--field-line` (kontrast ≥ 3:1; podpowiedź w polu jest tekstem, więc ma kolor `--ink-soft`), hover: tusz, fokus: niebieska i pogrubiona do 2 px, błąd: czerwona. Min. 44 px. Pól w pełnej ramce nie używamy.
- **Adres** stoi w wierszu nagłówka w mono („Do:”, „Odpowiedź na:”), bo to surowa linia listu.
- **Karta pierwszej rozmowy (`Contact`)**: trzy pytania z kartki etapu 1, każde jako etykieta w kursywie szeryfowej nad linią do pisania (`.card-q`). Otwarte pytanie ma znak `query` w `--ink-soft`; gdy pojawia się odpowiedź, znak zmienia się w niebieski ✓, który się rysuje. Wymagane jest pierwsze pytanie i adres; pozostałe mają dopisek „(opcjonalne)”. Pole rośnie z tekstem (`field-sizing: content`, w starszych przeglądarkach uchwyt zmiany rozmiaru).
- **Błędy**: komunikat pod polem, przy nieudanym sprawdzeniu zbiorcze podsumowanie u góry z fokusem i linkami do pól; adres jest sprawdzany przy opuszczeniu pola. Wpisane wartości zostają.
- **Podgląd** gotowej karty: mono na papierze, ze znakiem ✓ i przyciskiem kopiowania.

**Pole do odhaczenia (`Pick`).** Kwadrat 20 px z krawędzią `--field-line` na tle kartki, jak na papierowym formularzu. Zaznaczenie rysuje niebieski znak ✓ większy niż kwadrat (27 px, wychodzi poza krawędź), krawędź robi się niebieska, a etykieta przechodzi z `--ink-soft` w tusz. Pod spodem jest natywny checkbox: działa z klawiatury, fokus pokazuje kontur wokół kwadratu, cel ma min. 48 px. Wybór narzędzia to nazwa w szeryfie (`clamp(1.375rem, 2.2vw, 1.75rem)`); zgoda i „nie wiem” to wariant `pick-plain` w Archivo. Nie używamy natywnie rysowanych checkboxów ani przełączników-pigułek.

### 5.10 Tabele danych

Linia tuszu u góry, wiersze `--line`, liczby wyrównane do prawej i tabularne, ostatni wiersz (suma) pogrubiony z linią tuszu. Podpis pod tabelą w `--t-meta`.

### 5.11 Szkic sprawdzany względem źródła (`Proof`)

Tekst szkicu w mono, poprawki na marginesie czerwoną kursywą, skreślenie czerwoną kreską 1.5 px (nie `line-through`). Przełącznik „Z poprawkami / Po sprawdzeniu” to segmentowany przełącznik na tle biurka. Wersja po sprawdzeniu przechodzi na szeryf z niebieskim ✓ i cytatem źródła.

### 5.12 Analiza, która odpowiada od razu (`GuideAnalysis`)

Od 2026-11-27 przewodnik nie wymaga adresu, a formularz na jego stronie jest osobną ofertą: analizą własnych narzędzi. Nie jest zbiorem pól obok treści. **Najpierw odpowiada na stronie, potem prosi o adres**:

- Nad kartką grupy pól do odhaczenia (p. 5.9), rozdzielone liniami; pierwsza linia tuszem.
- Pod polami każde odhaczone narzędzie rozwija własną kartkę (`tool-card`): pasek z nazwą szeryfem i stanem („Stan na …” albo „Komentarz w przygotowaniu”), pod nim wiersze komentarza (etykieta półgruba, treść obok). Kartka bez napisanego komentarza pokazuje jego budowę miękkim tuszem. Przy dwóch i więcej dochodzi kartka zestawu: tytuł niebieską kursywą szeryfową i podpis, że jest wygenerowana.
- List pojawia się dopiero, gdy coś jest zaznaczone. Kartka: pasek („Twoja analiza” / „Podgląd, nic nie jest wysyłane”), nagłówek listu w mono („Do:” z polem adresu, „Temat:”), wiersze z tym, co list zawiera, stopka ze zgodą i jednym przyciskiem.
- Pole adresu to linia do pisania w wierszu „Do:” (p. 5.9), pod nim zdanie o tym, do czego adres służy.
- W liście każde odhaczone narzędzie ma wiersz „Komentarz: …” ze znakiem ✓. Przy dwóch i więcej pojawia się wiersz zestawu: niebieska kursywa szeryfowa ze znakiem ⊢ i podpisem, że jest wygenerowany. Pusty stan nad listem mówi, co zrobić; „Nie wiem albo nie korzystam” odsyła do spisu treści i nie pokazuje listu.
- Na ekranie ≤ 900 px list jest pod zgięciem w chwili wyboru, więc do dołu ekranu przykleja się jedna linia „W analizie: 2 komentarze + zestaw razem” (tło biurka, linia tuszu u góry). To też komunikat `role="status"` dla czytników.
- Po sprawdzeniu adresu kartka dostaje dolny wiersz z dużym ✓ i zdaniem, że nic nie wysłano.

Zasada ogólna dla interakcji: **efekt ma być odpowiedzią na działanie czytelnika i ma pokazywać, co się zmieniło.** Element, który tylko się rusza, nie wchodzi.

---

## 6. Strony i ich prezencja

- **Strona główna — historia odwiedzającego, ekran po ekranie.** Kolejność: hero (niebieski; sytuacja odwiedzającego i sterta papierów z rynku) → rynek (biurko; cztery papiery i pytania czerwonym ołówkiem) → dwa odruchy (tusz; skreślony szkic planu) → zwrot (niebieski; karta pierwszej rozmowy) → spotkanie w firmie (papier; slajd z zadaniami zespołu) → zakończenie (biurko; rekomendacja z przykładowego kompendium) → sytuacje → o mnie → kontakt (tło biurka) z listą lektur → stopka. Ekrany problemu niosą uwagę czerwonym ołówkiem ze znakiem „?”, ekrany rozwiązania niebieskie odhaczenie.
- **Papier z rynku (`.paper`).** Kartka z paskiem (rodzaj papieru, etykieta „Przykład”) i jednym zdaniem obietnicy. Obietnica jest złożona głośno: Archivo 700, szerokość 110%, interlinia 1,3. To jedyne miejsce, w którym bezszeryf krzyczy; głos doradcy pozostaje szeryfową kursywą ołówka. Papiery są ilustracją i zawsze mają etykietę oraz uwagę „Papiery przykładowe”.
- **Strona usługi `/konsultacja/` — ścieżka klienta, ekran po ekranie.** Kolejność: hero (niebieski; nagłówek oferty, teczka, mapa etapów) → etapy 0–5 → ekran zamykający ścieżkę (niebieski) → formaty jako wiersze → stopka.
  - **Hero** (niebieskie pole, dokładnie jeden ekran razem z nagłówkiem): nagłówek w dwóch liniach, druga kursywą; jedno zdanie; jeden przycisk; obok teczka czterech kart z kompendium na wierzchu; u dołu mapa sześciu etapów. Nic więcej.
  - **Etap** (`.slide-stage`): zawsze ten sam układ, tekst w kolumnach 1–6, kartka w 8–12. Cyfra etapu (do 9 rem), tytuł w `--t-title` z podkreśleniem ołówkiem, jedno–dwa zdania, wartość ze znakiem ✓, najwyżej jeden link. Etapy nie są odwracane na przemian.
  - **Ekran zamykający** (`.slide-end`): tytuł, zdanie, przycisk, „Konsultacja w skrócie” w czterech kolumnach, jedna uwaga.
- **`/czego-nie-robie/`** — strona na tle tuszu: tytuł i jedno zdanie po lewej (przyklejone), pięć zasad po prawej ze słowem „Nie” czerwoną kursywą, na końcu zdanie i przycisk.
- **`/przewodnik/`** — strona czytana z góry na dół, **jedno pytanie na ekran**: co to jest (tytuł w `--t-display`, lead, jeden przycisk), co jest w środku (kartka ze spisem treści na tle biurka; data stanu i aktualizacje w stopce kartki), jak to dostać (list z p. 5.12, potem jedno wezwanie). Wszystko stoi w jednej kolumnie siatki (kolumny 4–10; 3–10 poniżej 1100 px; pełna szerokość poniżej 900 px), więc oko idzie tylko w dół. Sceny (`.scene`) mają na szerokim ekranie co najmniej wysokość ekranu. Bez nadtytułów, bez wejść przy przewijaniu: jedyny ruch to list odpowiadający na wybór.
- **Analizy, przykład standardu i przykładowe kompendium** — kolumna do czytania (43 rem) w szeryfie, obok margines z pojęciami ze słownika (przyklejony), na górze trzy tezy. Przykład standardu i przykładowe kompendium zawsze z podpisem o materiale syntetycznym.
- **Stopka** zawiera kolofon z nazwami krojów i link „Włącz animacje”.

---

## 7. Ruch

Jeden język: **ołówek stawia znaki, kartki są kładzione na biurku, tusz wypełnia formy.** Jedyny autorski moment to sekwencja otwarcia; wszystko po niej odpowiada na przewijanie (sceny etapów) albo na działanie czytelnika (odhaczenia, wiersze listu, znak przy pytaniu). Nie dodajemy wejść „pojaw się przy przewinięciu” do zwykłych sekcji.

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
| `settle` | wyjście z przezroczystości z 16 px w górę | tekst pod nagłówkiem, mapa etapów w hero |
| `lay` | kartka opada z −44 px i obrotu −2.5° | teczka w hero strony usługi |
| `drop`, `drop-deep` | papier spada na biurko; na szerokim ekranie z głębi (620 px przed kartką, obrót w osi X) | sterta w hero strony głównej |
| `pile-away` | sterta odchyla się i oddala razem z przewijaniem pierwszego ekranu (tylko z `animation-timeline`) | hero strony głównej |
| `draw` | kreska znaku rysuje się (`stroke-dashoffset`) | znaki ✓ i ⊢ |
| `strike` | czerwone skreślenie przeciąga się w poprzek | szkic w `Proof` |
| `rule` | linia tuszu rysuje się od lewej | mapa etapów w hero |
| `appear` | samo krycie | panel sytuacji, uwagi |
| `mail-in` | kartka komentarza i wiersz listu wsuwają się z −10 px, znak ✓ się rysuje | strona przewodnika, po odhaczeniu narzędzia |
| `mail-lift` | kartka unosi się o 10 px z obrotem −0.5° i wraca | list przewodnika, po sprawdzeniu adresu |

### 7.4 Sceny sterowane przewijaniem

- **Słowa rozświetlane przewijaniem** (`Words`): w etapach ścieżki słowa zdania przechodzą z krycia 0.22 do 1.
- **Etapy ścieżki** (strona usługi, ≥ 901 px i ≥ 560 px wysokości): każdy etap przypięty na 220 vh. Scena rozgrywa się na pierwszych 80% przewijania etapu, a gotowy ekran stoi jeszcze ok. 40% wysokości ekranu, zanim odjedzie. Kartka etapu jest widziana w tej samej perspektywie co sceny strony głównej (`--cam`). Na ostatnim etapie zakładki wcześniejszych kartek należą do wysokości wizualizacji, więc na niskim oknie nie wchodzą pod nagłówek. Postęp `--sp` (0→1) rozkłada się na zmienne pochodne: `--a` kartka kładziona na biurko, `--t` cyfra wypełnia się tuszem i tytuł wyjeżdża, `--u` podkreślenie ołówkiem, `--w` zdanie czytane słowo po słowie, `--r` kartka wypełniana wiersz po wierszu, `--v` wartość odhaczona i link etapu. Scena cofa się przy przewijaniu w górę. Na ostatnim etapie spod kartki wysuwają się zakładki poprzednich czterech. Motyw etapu przechodzi na całą stronę razem z nagłówkiem i wraca do papieru po wyjściu ze ścieżki. Po prawej kropki etapów, widoczne tylko w obrębie ścieżki.
- **Sceny historii** (strona główna, ten sam mechanizm `useScenes`; ≥ 901 px i ≥ 560 px wysokości: każda scena przypięta na 200 vh). Tytuł, podkreślenie, zdanie i uwaga działają jak w etapach ścieżki. Własny ruch scen: pytania czerwonym ołówkiem dopisują się do papierów po kolei (`--q`), skreślenia planu rysują się od lewej, wiersze slajdu ze spotkania wchodzą po kolei, odhaczenia rekomendacji rysują się wiersz po wierszu.
- **Głębia (CSS 3D, tylko szeroki ekran).** Biurko leży w perspektywie (1600–1700 px). Zmienna `--cam` (0→1) to kamera: przy 0 patrzy wzdłuż biurka (kartka odchylona o 60°, 380 px w głąb), przy 1 patrzy prosto na kartkę. Połowa ruchu kamery dzieje się po przypięciu sceny; ołówek zaczyna pracę, gdy kartka jest już czytelna. Papiery z rynku unoszą się na różnych wysokościach i osiadają, karta pierwszej rozmowy leży grzbietem do góry i jest odwracana (`--flip`), pod kompendium leżą głębiej dwie wcześniejsze kartki. Kartki to prawdziwy tekst na płaszczyznach CSS: bez canvasu i WebGL, bez nowych zależności. Element z `preserve-3d` nie dostaje `opacity`; przenikanie robią liście.
- **Film (strona główna, `src/film.js`).** Rysunek 2D ołówkiem na papierze: jeden SVG przyklejony za tekstem pierwszych ekranów, sterowany jedną osią czasu `T` (numer sekcji, której górna krawędź minęła górę ekranu, plus ułamek jej przewinięcia). Kształty szkicuje rough.js: każdy to wycinanka z papieru (`#fcfdfb`) z konturem tuszem i kreskowaniem ołówkiem zamiast wypełnień; garnitur i rama łóżka są kreskowane gęsto, kołdra niebiesko. Każdy kształt jest narysowany dwa razy inną ręką i oba rysunki zmieniają się co ok. 0,2 s, więc kreska „drga” jak w animacji rysunkowej. Ruch prowadzi jedna oś czasu GSAP przewijana razem ze stroną (z krótkim opóźnieniem); ruch tła (drżenie lodówki, kołysanie dymków, „z” nad śpiącym) idzie z zegara. Paleta strony: papierowa biel, tusz, niebieski krawat i kołdra, czerwień tylko dla lodówki i krzyku „AI!”. Wycinanki są czytelne na każdym motywie (niebieskim, biurku, tuszu), bo niosą własny papier; tło rysunku jest przezroczyste, więc motyw strony przechodzi pod sceną. Rysunek trzyma się prawych 60% ekranu. Bez WebGL. Film ma cztery akty: dobry świat (sen pod kołdrą, księżyc w oknie), trudność (papiery, cisza, coraz wolniejsze podejście do lodówki z najazdem kamery, stuknięcie, wybuch „AI!”), rozwiązanie (bez mebli i, od 2026-11-28, bez papierów: gdy krzyk cichnie, papiery znikają, sypialnia odjeżdża, bohater zostaje sam w ciszy i dopiero wtedy mówi „Muszę to uporządkować.”; potem dzwoni do doradcy, który w okrągłym wycięciu zadaje trzy pytania pierwszej rozmowy, każda odpowiedź dostaje ptaszek; potem jedna scena spotkania w firmie: rozmowa się kończy, zespół wchodzi na prezentację przy rzutniku, doradca w niebieskim pyta, każdy odpowiada w dymku, a jego odpowiedź zostaje zapisana na slajdzie słowami jako własne zadanie; slajd schodzi z ekranu i staje się książką, którą doradca wręcza i odchodzi) i lepszy świat (kompendium otwiera się na rekomendacji, dostaje zieloną pieczęć i zamyka się w książkę „Kompendium szyte na miarę”; bohater stoi na środku z książką w ręce, zespół świętuje wokół niego, w oknie dzień, kamera najeżdża na bohatera). Otwarte dokumenty stają nad głowami postaci i ich nie zasłaniają. Sceny grają na pierwszym planie. Ekran spotkania jest zwykłą sceną historii przypiętą na 420 vh: każdy dymek stoi około jednej trzeciej ekranu, a link do strony usługi wchodzi dopiero po wręczeniu książki. Małe papiery rynku należą tylko do kłopotu: płyną przez ekran do końca burzy i potem ich nie ma (decyzja założyciela 2026-11-28; wcześniej wisiały nad bohaterem jako czerwona chmura). Scena lodówki ma 360 vh, zakończenie 420 vh (plan z pieczęcią stoi ponad pół ekranu, zanim się zamknie); film kończy się z ostatnim ekranem historii i odjeżdża razem z nim. **Zieleń (`--green: #1f7a4d`) jest jedynym wyjątkiem od reguły dwóch ołówków** i występuje tylko tutaj: pieczęć na kompendium, przycisk „Opisz swoją sytuację” pod zespołem (tylko gdy gra film), zielone zalanie ekranu prowadzące do kontaktu i panel kontaktu otwarty tą drogą (zielone tło, bohater z książką na karcie). Pól formularza zieleń nie oznacza.
- **Zatrzymanie sceny.** Scena historii ma 240 vh: wszystkie jej animacje kończą się przy ok. 80% postępu, a gotowy ekran stoi jeszcze prawie pół ekranu przewijania. Scena nieprzypięta jest gotowa, gdy jej górna krawędź jest jeszcze ćwierć ekranu poniżej góry.
- **Link do przypiętej sceny** (mapa etapów, kropki, adres z kotwicą) przewija do końca sceny, czyli do miejsca, w którym kartka jest już wypełniona.
- **Nagłówek**: przy przewijaniu dostaje dolną linię (`animation-timeline: scroll()`, jeśli przeglądarka wspiera).
- Przejścia między stronami: `@view-transition` (tylko bez preferencji ograniczenia ruchu).

### 7.5 Hover

Podkreślenie dorysowuje się od lewej, strzałka przesuwa się o 4–8 px, tytuł analizy zmienia kolor na niebieski, a strzałka obraca się o −45°. Nic nie powiększa się i nie podskakuje.

---

## 8. Dostępność (warunki konieczne)

- Strona w pełni czytelna bez JS (prerender) i z `prefers-reduced-motion`.
- Cel kliknięcia min. 44 px.
- Focus: niebieski kontur 2 px z odstępem 3 px (biały na niebieskim i ciemnym tle).
- Link „Przejdź do treści”, `aria-current` w nawigacji i na kropkach etapów, zakładki sytuacji obsługiwane strzałkami, Home i End. Tytuł etapu ma dla czytników dopisek „Etap n:”.
- Elementy dekoracyjne (teczka i sterta papierów w hero, stos kartek, znaki) mają `aria-hidden`; ta sama treść jest dostępna w tekście.
- Kontrast tekstu co najmniej WCAG AA; obramowanie pól co najmniej 3:1.

---

## 9. Lista kontrolna dla nowego elementu

1. Czy da się go opisać jako papier, tusz albo ołówek? Jeśli nie, przemyśl go od nowa.
2. Czy używa wyłącznie tokenów koloru, skali i odstępów?
3. Czy kolor coś znaczy (niebieski = potwierdzone/działanie, czerwony = poprawka/brak)?
4. Czy struktura opiera się na liniach i odstępach, a nie na tłach i cieniach?
5. Czy działa w motywach `blue` i `ink` (jeśli może się tam znaleźć)?
6. Czy bez JS i bez ruchu jest w stanie końcowym?
7. Czy ma jedno zastrzeżenie na kontekst i co najwyżej jedno działanie? Na jakie pytanie odwiedzającego odpowiada i czy nic innego już na nie nie odpowiada?
8. Czy wygląda dobrze przy 320, 390, 900, 1280 i 1440 px?

---

## 10. Porządki do zrobienia w kodzie

W `src/styles.css` zostały reguły po wcześniejszych układach, które nie mają już odpowiedników w `App.jsx`: `.offer*`, `.exhibit*`, `.method-steps`, `.step-numeral`, `.method-closing` oraz część `.format-grid`/`.format-primary`/`.format-side`. Reguły po dawnej sekcji przebiegu, analizach, pełnych polach formularza i osobnej prezentacji usunięto 2026-11-22.
