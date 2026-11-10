# Portfolio niezależnego doradcy AI

Responsywny prototyp strony Piotra Wrotnego. Oferta główna: konsultacje AI szyte na miarę, w trzech formatach: standard dla zespołu, jedna decyzja, przegląd oferty (na zapytanie). Głównym przykładem pracy jest przebieg konsultacji: rozpoznanie problemów i poziomu wiedzy, zebranie materiału, prezentacja, spotkanie i dokumenty końcowe.

## Co zawiera projekt

Stronę główną, dwie analizy, syntetyczny standard pracy i opis prywatności prototypu. Formularz przygotowuje wyłącznie lokalny podgląd; nie ma endpointu, wysyłki, kalendarza ani zapisu danych. Nazwisko jest prawdziwe; opis doświadczenia, kontakt i dane działalności pozostają placeholderami. Nie ma publicznych cen, wymyślonych klientów ani metryk.

## Kierunek wizualny (2026-11-10)

Strona jest złożona jak sprawdzony dokument. Jedynym motywem graficznym jest ołówek kontrolny: niebieski potwierdza i niesie ofertę, czerwony poprawia, zatrzymuje i oznacza braki. Poza papierem i tuszem nie ma innych kolorów.

- Fonty, lokalne, w `public/fonts`: Brygada 1918 (nagłówki i tekst do czytania), Archivo ze zmienną szerokością (interfejs), IBM Plex Mono (tylko surowy tekst: szkic, instrukcja, podgląd opisu). Licencje OFL obok plików.
- Tokeny koloru, skali i odstępów są na początku `src/styles.css`.
- Elementy wspólne: `Mark` (znaki ołówka), `Note` (uwaga na marginesie, jedno zastrzeżenie na kontekst), `Pending` (czerwone „Do uzupełnienia”), `.sheet` (kartka na biurku: przykład standardu, formularz, karty przebiegu).
- Układ strony głównej (jedna oś): hero z ofertą na niebieskim polu i gotową teczką pięciu kart, przebieg konsultacji, sytuacje, trzy formaty jako zwarte wiersze, „Czego nie robię”, analizy, o mnie, kontakt. Metoda w trzech krokach i karta przykładowego standardu nie są już osobnymi sekcjami strony głównej; treści zostały w `site.js`, a standard na swojej podstronie.
- Szkic podsumowania sprawdzany względem źródła (`site.proof`, przełącznik „Z poprawkami / Po sprawdzeniu”) jest na podstronie przykładu standardu. To ilustracja na materiale syntetycznym i tak jest podpisana.
- Przebieg konsultacji (`site.flow`): pięć etapów, każdy zostawia kartę. Na szerokim ekranie z włączonym ruchem karty układają się w rosnącą teczkę obok tekstu; bez ruchu, bez JS i na wąskich ekranach każda karta stoi przy swoim etapie.
- Prezentacja `/konsultacja/`: ten sam przebieg jako przewijana prezentacja, jeden etap na ekran. Każdy slajd ma motyw (`site.flow.deck.themes`: paper, desk, ink, blue). Tokeny koloru są zarejestrowane przez `@property`, więc z włączonym ruchem motyw przechodzi płynnie na całą stronę razem z nagłówkiem; bez ruchu każdy slajd nosi swój motyw sam.
- „Konsultacja w skrócie” (`site.flow.terms`) i wezwania do akcji (`CallToAction`): po przebiegu, po formatach, po zasadach i na końcu prezentacji.
- „Od czego zaczynają klienci” (`site.cases`): osiem sytuacji. Na szerokim ekranie przeglądarka z pionowymi zakładkami (strzałki, Home, End), na wąskim i bez JS zwykła lista.
- Ruch: sekwencja otwarcia (nagłówek, rysujące się poprawki), teczka przebiegu, słowa oferty rozświetlane przewijaniem, reakcje na hover. Na `/konsultacja/` każdy etap jest na szerokim ekranie przypięty, a jego scena jest sterowana przewijaniem przez zmienną `--sp` (kartka kładziona na biurku, cyfra wypełniana tuszem, tytuł podkreślany ołówkiem, zdanie czytane słowo po słowie, kartka wypełniana wiersz po wierszu). Wszystko za klasą `html.js-motion`. Nie ma jej przy `prefers-reduced-motion`, chyba że odwiedzający sam włączy animacje (link „Włącz animacje” w stopce albo dopisek `?motion`, zapamiętywany w localStorage); `?nomotion` wyłącza ruch i kasuje ten wybór.

## Edycja

- `src/content/site.js`: hero (DRAFT), ilustracja sprawdzania szkicu (DRAFT), przebieg konsultacji (DRAFT), sytuacje przykładowe (DRAFT), formaty, przykład standardu, metoda, zasady „Czego nie robię” (DRAFT), ekspertyza.
- `src/content/articles.js`, `src/content/glossary.js`: analizy i słownik pokazywany na marginesie.
- `src/App.jsx`: skład sekcji i komponenty. `src/motion.js`: rozświetlanie słów.
- `AGENTS.md`: wiążące zasady treści. `docs/launch-readiness.md`: zadania przed publikacją.

## Uruchomienie

Node.js 20 lub nowszy. `npm ci`, potem `npm run dev` (Vite) albo `npm run build`, który tworzy statyczne dokumenty HTML sześciu stron w `dist/client`. `npm test` sprawdza worker. Treść jest czytelna bez JavaScript.

`qa-views` to pomocnicze widoki do zrzutów (`scroll.html?to=przebieg&dy=400`); nie trafiają do `dist/client`.

## Cloudflare

Worker (`worker/index.js`) serwuje statyczne pliki z `dist/client` przez binding `ASSETS`; konfiguracja w `wrangler.jsonc`, nagłówki cache i `X-Robots-Tag` w `public/_headers`. Nieznana trasa HTML dostaje stronę główną.

- `npm run preview`: build i lokalny podgląd przez `wrangler dev` (http://127.0.0.1:8787).
- `npm run deploy:check`: build i `wrangler deploy --dry-run`, bez publikacji.
- `npm run deploy`: build i publikacja. Wymaga wcześniejszego `npx wrangler login`.

Prototyp publikujemy tylko pod adresem `*.workers.dev`. Domenę `piotrwrotny.com` podpinamy w panelu Cloudflare (Custom Domain) dopiero po decyzji założyciela; `noindex` zostaje do publicznej wersji. Formularz pozostaje lokalną demonstracją. Sekrety nie trafiają do repo.
