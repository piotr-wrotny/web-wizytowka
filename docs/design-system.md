# System wizualny Esej autorski

Wersja 1.0, 30 października 2026. Wybrany przez założyciela wariant Editorial Expert, na podstawie `design/selected-reference.jpeg`. Nazwa kierunku jest etykietą projektową. Publiczną markę tworzą imię i nazwisko osoby.

## Zasada kompozycji

Duże zdanie otwarcia, spokojne pole papieru, osobista sygnatura i pełna zielona sekcja jednej głównej usługi. Bez fotografii, dekoracyjnego AI i równorzędnej siatki pakietów.

Makieta jest wiążąca dla kompozycji otwarcia: header, hero, pasek „Perspektywa”, zielony blok oferty głównej i wiersz wskazujący (decyzja założyciela z 2026-11-09). Jej natywne proporcje (893 px szerokości) są sufitem skali; otwarcie nie jest już skalowane 1,6× do 1440 px. Poniżej strona główna prowadzi jedną oś: sytuacje przykładowe, trzy formaty współpracy, eksponat standardu, metoda, analizy, osoba, kontakt. Każda sekcja ma inną anatomię; powtarzanie jednego układu jest błędem, nie konsekwencją.

Oferta główna to konsultacje AI szyte na miarę. Formaty: Standard dla zespołu (W, najbardziej rozbudowany: rezultaty i warunki), Jedna decyzja (K), Przegląd oferty (R, na zapytanie). Wiersz pod zielonym blokiem wskazuje format K i eksponat, jak w makiecie.

Na desktopie hero zachowuje trzy wiersze makiety. Na mobile hero łamie się na trzy wiersze przy 390 i 320 px (skala 11,8vw).

## Skala typograficzna

Jedno źródło dla wszystkich stron, tokeny w `:root`:

| Token | Wartość | Użycie |
|---|---|---|
| --t-display | clamp(54px, 7.3vw, 108px) | Wyłącznie H1 hero |
| --t-title | clamp(40px, 4.9vw, 72px) | H2 zielonego bloku, H1 podstron, H1 404 |
| --t-h2 | clamp(32px, 3.3vw, 48px) | H2 sekcji strony głównej; 34 px na mobile |
| --t-h3 | clamp(23px, 2vw, 28px) | Podnagłówki, role w sytuacjach, kroki metody |
| --t-lead | clamp(20px, 1.75vw, 25px) | Lead podstron |
| --t-body | 19 px (17 px mobile) | Tekst główny |
| --t-small / --t-meta | 15 / 14 px | Noty, podpisy, metadane |

Poza tokenami dopuszczalne są tylko lokalne rozmiary pośrednie (np. nagłówek formatu 26–34 px, nagłówek eksponatu 26–34 px). Nie dodawać nowych rozmiarów w vw bez tokenu.

## Urządzenia typograficzne i ich zasięg

- Eyebrow (all-caps, tracking 0,2em, opcjonalna linia): tylko w otwarciu, bo tak jest w makiecie. Poniżej wiersza K nagłówki stoją same.
- Strzałka przy linku: działania główne (CTA, „Czytaj analizę”, „Otwórz pełny przykład”). Linki w treści i przypisach bez strzałki.
- Numeracja: tylko tam, gdzie treść jest sekwencją (trzy kroki metody, duże cyfry Newsreader w zieleni). Rezultaty i lista analiz bez numerów.
- Jedno zastrzeżenie na kontekst. Fakty do uzupełnienia przez założyciela wyłącznie przez komponent `Pending` („Do uzupełnienia:” z przerywaną linią po lewej), nigdy jako nawias w treści.
- `text-wrap: balance` na nagłówkach, `pretty` na akapitach. Ręczne `<br>` tylko w otwarciu.

## Kolory

| Token CSS | Wartość | Rola |
|---|---|---|
| --paper | #F6F4EE | Główne tło i jasny tekst na zieleni |
| --ink | #202823 | Tekst podstawowy |
| --muted | #5F6862 | Tekst pomocniczy i metadane |
| --green | #20594D | Główna usługa, przyciski i linki |
| --green-hover | #17463D | Hover primary CTA |
| --sand | #E7E3D8 | Sekcja metody i przykłady |
| --line | #C5C9BF | Separatory |
| --field-line | #758077 | Granice pól i menu |
| --focus | = --ink | Fokus klawiatury (2 px, offset 5 px); na zieleni paper. Od 2026-11-09 w palecie zamiast niebieskiego |
| --field-bg | #FBFAF6 | Tło pól formularza, o ton jaśniejsze od papieru |
| --error | #9D302C | Tekst i oznaczenie błędu |

Obliczone kontrasty: ink/paper 13,74:1; muted/paper 5,24:1; paper/green 7,35:1. Nie są pełnym audytem dostępności. Błędy mają również opis tekstowy. Na ciemnej sekcji focus jest jasny.

## Typografia

Newsreader 400 dla głównych nagłówków, sygnatury i redakcyjnych akcentów. Newsreader 400 italic (woff2, latin + latin-ext, dodana 2026-11-09) wyłącznie dla: cytatu wyciągniętego, cytowanego materiału, puenty metody i leadu noty K. Inter 400/500/600 dla tekstu, nawigacji i kontrolek. Pliki są lokalne, z polskimi znakami i dołączonymi licencjami OFL. Odmiana Newsreader 500 pozostaje dostępna w zestawie, lecz otwarcie wykorzystuje 400, dobrane po porównaniu z makietą.

Skład polski: jednoliterowe spójniki i przyimki (i, w, z, o, a, u oraz wersaliki) nie kończą wiersza. Funkcja `pl()` w `src/App.jsx` wstawia niełamliwą spację po nich na granicy treści (`site`, `articles`, `glossary`) i w tekstach inline. Analizy otwiera inicjał (pierwsza litera pierwszego akapitu, Newsreader, zieleń, trzy wiersze); próbka i prywatność jako dokumenty go nie mają. Zaznaczenie tekstu: zieleń z papierowym tekstem, na zieleni odwrotnie.

| Rola | Szeroki ekran | Mobile |
|---|---|---|
| Hero H1 | --t-display, maks. 108 px; interlinia 0,95 | Płynnie 11,8vw; 40 px przy 320; interlinia 1,04 |
| Lead hero | 21–29 px, interlinia 1,4 | 20 px; 18 px przy 320 |
| Oferta na zieleni | --t-title, maks. 72 px | 38–64 px; 36 px przy 320 |
| H2 sekcji | --t-h2, maks. 48 px | 34 px, 31 px przy 320 |
| Tekst główny | 19 px, interlinia 1,65 | 17 px, interlinia 1,7 |
| Artykuł | 19 px, kolumna 720 px | 17 px, interlinia 1,75 |
| Nawigacja / sygnatura | 15–17 px / 24–30 px | 15 px / 23 px |
| Kontrolki | 16–18 px | Co najmniej 16 px w polach |

Metadane są mniejsze od tekstu głównego. Długie akapity pozostają wyrównane do lewej, bez wyjustowania.

## Siatka i odstępy

Kontener treści do 1280 px, rama linii do 1344 px. Margines treści płynny do 88 px, na mobile 22 px i 18 px przy 320. Menu mobilne pojawia się poniżej 768 px. Dalsze sekcje korzystają z dwóch kolumn na desktopie i jednej na mobile.

Sekcje poniżej otwarcia: `.section` z odstępem pionowym płynnie 60–108 px, 56 px na mobile. Siatki trzykolumnowe składają się do jednej kolumny poniżej 900 px; split 5/7 poniżej 768 px. Otwierające sekcje mają osobny rytm dopasowany do źródła. Nie dodajemy sztucznego 100vh ani animacji wejścia. Jedyny ruch: otwieranie Disclosure (220 ms), obrót chevronu, przesunięcie strzałki przy hover; wyłączone przy `prefers-reduced-motion`.

Przyciski mają radius 3 px, pola 2 px. Karty nie są domyślną jednostką. Dowód, analiza i standard są dokumentami, a usługi i metoda — układem treści.

## Komponenty

Otwarcie: Header i menu; primary CTA; podkreślony TextLink; Eyebrow z opcjonalną linią; pełna sekcja W; wiersz K.

Strona główna poniżej: sytuacje (`.case-list`, wiersze 3/6/3: rola w serifie, sytuacja i pytanie w kursywie, format; `.boundary-note` z etykietą „przykładowe”); formaty (`.format-list`, wiersze 4/8: `.format-head` z serifowym tytułem i kursywnym podtytułem, `.format-body`; wariant `.format-primary` z grubszą linią zawiera `.result-list` i Disclosure, `.format-footnote` dla R); eksponat (`.exhibit-section`, tło sand, kolumna boczna sticky z etykietą „Tablica 1”, tytułem, podpisem i linkiem; `StandardTable` z grubą linią górną); metoda (`.method-steps`, trzy kolumny z `.step-numeral`; `.principles` „Czego nie robię”); analizy (`.article-grid`, dwie kolumny, `.article-meta` bez separatorów); osoba (split 5/7, `Pending`, `.expertise-rows`); Contact z jedną notą demonstracyjną; Footer z kolofonem.

Podstrony: `ArticleFrame` (kicker `.article-kind`, H1, lead, `.article-meta`, `.theses` w trzech kolumnach, `.article-body` = kolumna czytelnicza 720 px + `Marginalia` sticky), `.pull` dla cytatu wyciągniętego, `DataTable` z podpisem pod spodem, `.boundary` dla jednego zastrzeżenia, `StandardTable` w wariancie czytelniczym.

Słownik (`src/content/glossary.js`) i zasady (`site.principles`) są oznaczone `DRAFT` do akceptacji założyciela.

Strzałki i chevrony pochodzą z Phosphor Light. Nie są odręcznie rysowanymi substytutami. W wybranej makiecie nie ma niezależnych assetów rastrowych do odtworzenia.

## Zachowanie i dostępność

Menu ma aria-expanded, zamknięcie Escape oraz powrót fokusu. Nawigacja działa zwykłymi linkami; na stronie głównej IntersectionObserver oznacza bieżącą sekcję (`aria-current`, podkreślenie w zieleni). Podkreślenie TextLink jest gradientem tła, więc pogrubienie przy hover nie przesuwa układu. Przejście między stronami: `@view-transition{navigation:auto}` tylko przy `prefers-reduced-motion: no-preference`. Szczegóły wykorzystują natywne details/summary. Skip link przenosi fokus do main. Pola mają zewnętrzne etykiety, wymagania, opisy i komunikaty błędów; treść zostaje po błędzie. Przy szerokościach 320, 390, 1024 i 1440 px nie stwierdzono poziomego przepełnienia.

Formularz nie wysyła wiadomości. Poprawny wynik prowadzi do lokalnego podglądu i świadomego kopiowania. Nie ma udawanego sukcesu wysyłki ani rezerwacji. Przy braku JavaScript formularz pozostaje nieaktywny; treści stron są wygenerowane w HTML.

Cel: WCAG 2.2 AA. Przegląd prototypu nie jest deklaracją pełnej zgodności. Do publicznego uruchomienia pozostają m.in. rzeczywiste urządzenia, czytnik ekranu, powiększenie i końcowy przepływ zapytań.

## Zmiany i przyszły język

Hero, usługi, metoda i obszary ekspertyzy: `src/content/site.js`. Analizy: `src/content/articles.js`. Profil, próbka, kontakt i mikrocopy stanów: komponenty `src/App.jsx`. Wygląd i responsywność: `src/styles.css`.

Przy angielskiej wersji dodać oddzielne treści i ścieżki /en/, a następnie pełne metadane. Na stronie nie ma pustego przełącznika. Rozbudowa oferty nie wymaga zmiany osobistej identyfikacji.
