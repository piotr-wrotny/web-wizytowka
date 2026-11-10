# Portfolio niezależnego doradcy AI

Responsywny prototyp strony Piotra Wrotnego. Oferta główna: konsultacje AI szyte na miarę, w trzech formatach: standard dla zespołu, jedna decyzja, przegląd oferty (na zapytanie). Głównym przykładem pracy jest przebieg konsultacji: rozpoznanie problemów i poziomu wiedzy, zebranie materiału, prezentacja, spotkanie i dokumenty końcowe.

## Co zawiera projekt

Stronę główną, dwie analizy, syntetyczny standard pracy i opis prywatności prototypu. Formularz przygotowuje wyłącznie lokalny podgląd; nie ma endpointu, wysyłki, kalendarza ani zapisu danych. Nazwisko jest prawdziwe; opis doświadczenia, kontakt i dane działalności pozostają placeholderami. Nie ma publicznych cen, wymyślonych klientów ani metryk.

## Kierunek wizualny (2026-11-10)

Strona jest złożona jak sprawdzony dokument. Jedynym motywem graficznym jest ołówek kontrolny: niebieski potwierdza i niesie ofertę, czerwony poprawia, zatrzymuje i oznacza braki. Poza papierem i tuszem nie ma innych kolorów.

- Fonty, lokalne, w `public/fonts`: Brygada 1918 (nagłówki i tekst do czytania), Archivo ze zmienną szerokością (interfejs), IBM Plex Mono (tylko surowy tekst: szkic, instrukcja, podgląd opisu). Licencje OFL obok plików.
- Tokeny koloru, skali i odstępów są na początku `src/styles.css`.
- Elementy wspólne: `Mark` (znaki ołówka), `Note` (uwaga na marginesie, jedno zastrzeżenie na kontekst), `Pending` (czerwone „Do uzupełnienia”), `.sheet` (kartka na biurku: przykład standardu, formularz, karty przebiegu).
- Otwarcie: szkic podsumowania sprawdzany względem źródła (`site.proof`), z przełącznikiem „Z poprawkami / Po sprawdzeniu”. To ilustracja na materiale syntetycznym i tak jest podpisana.
- Przebieg konsultacji (`site.flow`): pięć etapów, każdy zostawia kartę. Na szerokim ekranie z włączonym ruchem karty układają się w rosnącą teczkę obok tekstu; bez ruchu, bez JS i na wąskich ekranach każda karta stoi przy swoim etapie.
- Ruch: sekwencja otwarcia (nagłówek, rysujące się poprawki), teczka przebiegu, słowa oferty rozświetlane przewijaniem, reakcje na hover. Wszystko za klasą `html.js-motion`, której nie ma przy `prefers-reduced-motion` ani z dopiskiem `?nomotion`.

## Edycja

- `src/content/site.js`: hero, ilustracja otwarcia (DRAFT), oferta, przebieg konsultacji (DRAFT), sytuacje przykładowe (DRAFT), formaty, przykład standardu, metoda, zasady „Czego nie robię” (DRAFT), ekspertyza.
- `src/content/articles.js`, `src/content/glossary.js`: analizy i słownik pokazywany na marginesie.
- `src/App.jsx`: skład sekcji i komponenty. `src/motion.js`: rozświetlanie słów.
- `AGENTS.md`: wiążące zasady treści. `docs/launch-readiness.md`: zadania przed publikacją.

## Uruchomienie

Node.js 20 lub nowszy. `npm ci`, potem `npm run dev` (Vite) albo `npm run build`, który tworzy statyczne dokumenty HTML pięciu stron w `dist/client`. `npm test` sprawdza worker. Treść jest czytelna bez JavaScript.

`qa-views` to pomocnicze widoki do zrzutów (`scroll.html?to=przebieg&dy=400`); nie trafiają do `dist/client`.
