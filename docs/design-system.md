# System wizualny Esej autorski

Wersja 1.0, 30 października 2026. Wybrany przez założyciela wariant Editorial Expert, na podstawie `design/selected-reference.jpeg`. Nazwa kierunku jest etykietą projektową. Publiczną markę tworzą imię i nazwisko osoby.

## Zasada kompozycji

Duże zdanie otwarcia, spokojne pole papieru, osobista sygnatura i pełna zielona sekcja jednej głównej usługi. Bez fotografii, dekoracyjnego AI i równorzędnej siatki pakietów. Dalsze sekcje korzystają z typografii, odstępów, wierszy i cienkich linii.

Na desktopie hero zachowuje trzy wiersze przesłanej makiety. Na mobile tekst łamie się naturalnie. Zakres W dominuje; K pozostaje samodzielną konsultacją, a R krótką opcją na zapytanie.

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
| --focus | #254FC0 | Widoczny focus na jasnym tle |
| --error | #9D302C | Tekst i oznaczenie błędu |

Obliczone kontrasty: ink/paper 13,74:1; muted/paper 5,24:1; paper/green 7,35:1. Nie są pełnym audytem dostępności. Błędy mają również opis tekstowy. Na ciemnej sekcji focus jest jasny.

## Typografia

Newsreader 400 dla głównych nagłówków, sygnatury i redakcyjnych akcentów. Inter 400/500/600 dla tekstu, nawigacji i kontrolek. Pliki są lokalne, z polskimi znakami i dołączonymi licencjami OFL. Odmiana Newsreader 500 pozostaje dostępna w zestawie, lecz otwarcie wykorzystuje 400, dobrane po porównaniu z makietą.

| Rola | Szeroki ekran | Mobile |
|---|---|---|
| Hero H1 | Płynnie 11,4vw, maks. 164 px; interlinia 0,91 | Płynnie 13,8vw; 44 px przy 320; interlinia 1,02 |
| Lead hero | Do 45 px, interlinia 1,38 | 21 px; 19 px przy 320; interlinia 1,5 |
| Nazwa W na zieleni | Płynnie 9,3vw, maks. 134 px | 44–76 px; 42 px przy 320 |
| Pozostałe H2 | Zwykle 40–60 px | 37 px, 34 px przy 320 |
| Tekst główny | 18–20 px, interlinia 1,6–1,7 | 17 px, interlinia 1,7 |
| Artykuł | 19 px, maks. 760 px szerokości | 17 px, interlinia 1,75 |
| Kontrolki | 16–18 px | Co najmniej 16 px w polach |

Duża skala hero wynika z wybranej makiety; nie jest wzorem dla całej strony. Metadane są mniejsze od tekstu głównego. Długie akapity pozostają wyrównane do lewej, bez wyjustowania.

## Siatka i odstępy

Kontener treści do 1280 px, rama linii do 1344 px. Margines treści płynny do 88 px, na mobile 22 px i 18 px przy 320. Menu mobilne pojawia się poniżej 768 px. Dalsze sekcje korzystają z dwóch kolumn na desktopie i jednej na mobile.

Sekcje redakcyjne: zwykle 100 px odstępu pionowego, 76 px na mniejszych desktopach i 58 px na mobile. Otwierające sekcje mają osobny rytm dopasowany do źródła. Nie dodajemy sztucznego 100vh ani animacji wejścia.

Przyciski mają radius 3 px, pola 2 px. Karty nie są domyślną jednostką. Dowód, analiza i standard są dokumentami, a usługi i metoda — układem treści.

## Komponenty

Header i menu; primary CTA; podkreślony TextLink; Eyebrow z opcjonalną linią; pełna sekcja W; spokojny wiersz K; Disclosure dla warunków; wiersze rezultatów i metody; lista ekspertyzy; lista analiz; ArticleFrame; standard w liście definicji; informacja syntetyczna; Contact; lokalny podgląd opisu; Footer.

Strzałki i chevrony pochodzą z Phosphor Light. Nie są odręcznie rysowanymi substytutami. W wybranej makiecie nie ma niezależnych assetów rastrowych do odtworzenia.

## Zachowanie i dostępność

Menu ma aria-expanded, zamknięcie Escape oraz powrót fokusu. Nawigacja działa zwykłymi linkami. Szczegóły wykorzystują natywne details/summary. Skip link przenosi fokus do main. Pola mają zewnętrzne etykiety, wymagania, opisy i komunikaty błędów; treść zostaje po błędzie. Przy szerokościach 320, 390, 1024 i 1440 px nie stwierdzono poziomego przepełnienia.

Formularz nie wysyła wiadomości. Poprawny wynik prowadzi do lokalnego podglądu i świadomego kopiowania. Nie ma udawanego sukcesu wysyłki ani rezerwacji. Przy braku JavaScript formularz pozostaje nieaktywny; treści stron są wygenerowane w HTML.

Cel: WCAG 2.2 AA. Przegląd prototypu nie jest deklaracją pełnej zgodności. Do publicznego uruchomienia pozostają m.in. rzeczywiste urządzenia, czytnik ekranu, powiększenie i końcowy przepływ zapytań.

## Zmiany i przyszły język

Hero, usługi, metoda i obszary ekspertyzy: `src/content/site.js`. Analizy: `src/content/articles.js`. Profil, próbka, kontakt i mikrocopy stanów: komponenty `src/App.jsx`. Wygląd i responsywność: `src/styles.css`.

Przy angielskiej wersji dodać oddzielne treści i ścieżki /en/, a następnie pełne metadane. Na stronie nie ma pustego przełącznika. Rozbudowa oferty nie wymaga zmiany osobistej identyfikacji.
