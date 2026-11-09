# Portfolio niezależnego doradcy AI

Responsywny prototyp w wybranym kierunku Esej autorski / Editorial Expert. Wersja 1.1, 09.11.2026. Oferta główna: konsultacje AI szyte na miarę, w trzech formatach: standard dla zespołu (W), jedna decyzja (K), przegląd oferty (R, na zapytanie).

## Co zawiera projekt

Stronę główną, dwie analizy, syntetyczny standard pracy i opis prywatności prototypu. Formularz przygotowuje wyłącznie lokalny podgląd; nie ma endpointu, wysyłki, kalendarza ani zapisu danych. Dane osoby i kontakt pozostają placeholderami. W cenach publicznych nie ma kwot.

## Edycja

- `src/content/site.js`: hero, nawigacja, oferta główna, sytuacje przykładowe (DRAFT), trzy formaty współpracy, przykład standardu (eksponat i pełna wersja), metoda, zasady „Czego nie robię” (DRAFT) i ekspertyza.
- `src/content/articles.js`: treści dwóch analiz z tezami, cytatem wyciągniętym i tabelą; pomocnicze `formatDate` i `readingMinutes`.
- `src/content/glossary.js`: słownik roboczy pokazywany jako marginalia na podstronach (DRAFT).
- `src/App.jsx`: skład sekcji, profil, kontakt i mikrocopy.
- `docs/plan-fable.md`: diagnoza i koncepcja rewizji z 2026-11-09; `design/qa/before` i `design/qa/after`: zrzuty przed i po.
- `src/styles.css`: tokeny, typografia, siatka i zachowania responsive.
- `design/selected-reference.jpeg`: dokładny obraz wybrany przez założyciela.
- `docs/design-system.md`: finalny system wizualny.
- `docs/launch-readiness.md`: zadania przed publikacją i priorytety iteracji.
- `docs/tresci-finalne.txt`: eksport treści z gotowych stron HTML.
- `design-qa.md`: wykonany przegląd i jego ograniczenia.

## Odtworzenie poza bieżącym podglądem

Node.js i npm. `npm ci` odtwarza zależności z lockfile. `npm run dev` uruchamia Vite. `npm run build` tworzy statyczne dokumenty HTML i assety w `dist/client`. Bieżący prototyp jest już uruchomiony w Work; te polecenia służą późniejszemu odtworzeniu.

React/Vite wykorzystano dla wspólnych komponentów, stanów i podglądu w Work. Build generuje komplet treści do HTML; odczyt stron nie wymaga oczekiwania na React. JavaScript obsługuje menu i formularz. To większy pakiet niż ręcznie napisany HTML — około 76 kB gzip głównego JS — ale bez osobnego backendu, bazy i CMS.

## Zakres uruchomienia

To materiał do przeglądu. Przed publiczną ofertą uzupełnij wskazane dane i proces kontaktu zgodnie z `docs/launch-readiness.md`. Zachowaj etykiety syntetycznego materiału, granice zakresów i informację demonstracyjnego formularza. Nie umieszczaj poufnych danych ani sekretów w kodzie.

Licencje fontów są w `public/fonts`; Newsreader italic (woff2, latin i latin-ext) pochodzi z Google Fonts na tej samej licencji OFL. Ikony: Phosphor, MIT. W projekcie nie ma wygenerowanego portretu ani fikcyjnego dowodu klientowskiego.

`qa-views` jest pomocniczym widokiem do kontroli różnych szerokości w przeglądarce; nie trafia do `dist/client`.
