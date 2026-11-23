# Portfolio niezależnego doradcy AI

Responsywny prototyp strony Piotra Wrotnego. Strona główna opowiada historię odwiedzającego: przedsiębiorcy, który czuje, że musi coś zrobić z AI, a rynek nie pomaga wybrać. Rozwiązaniem tej historii są konsultacje AI szyte na miarę. Prezentacja usługi ma własną stronę `/konsultacja/`: przebieg zgodny ze ścieżką klienta (rozmowa, rozpoznanie i program, konsultacja w firmie, kompendium z rekomendacją, opcjonalny dalszy krok) oraz trzy formaty: standard dla zespołu, jedna decyzja, przegląd oferty (na zapytanie). Etap 0 ścieżki to wiedza otwarta: bezpłatny przewodnik (`/przewodnik/`), analizy i syntetyczne przykładowe kompendium.

## Co zawiera projekt

Stronę główną z historią odwiedzającego, stronę usługi ze ścieżką klienta i formatami, stronę przewodnika, stronę „Czego nie robię”, dwie analizy, syntetyczny standard pracy, syntetyczne przykładowe kompendium i opis prywatności prototypu. Oba formularze (karta pierwszej rozmowy i przewodnik) przygotowują wyłącznie lokalny podgląd; nie ma endpointu, wysyłki, kalendarza ani zapisu danych. Nazwisko jest prawdziwe; opis doświadczenia, kontakt i dane działalności pozostają placeholderami. Nie ma publicznych cen, wymyślonych klientów ani metryk.

## Kierunek wizualny (2026-11-10)

Strona jest złożona jak sprawdzony dokument. Jedynym motywem graficznym jest ołówek kontrolny: niebieski potwierdza i niesie ofertę, czerwony poprawia, zatrzymuje i oznacza braki. Poza papierem i tuszem nie ma innych kolorów.

- Fonty, lokalne, w `public/fonts`: Brygada 1918 (nagłówki i tekst do czytania), Archivo ze zmienną szerokością (interfejs), IBM Plex Mono (tylko surowy tekst: szkic, instrukcja, podgląd opisu). Licencje OFL obok plików.
- Tokeny koloru, skali i odstępów są na początku `src/styles.css`.
- Elementy wspólne: `Mark` (znaki ołówka), `Note` (uwaga na marginesie, jedno zastrzeżenie na kontekst), `Pending` (czerwone „Do uzupełnienia”), `.sheet` (kartka na biurku: przykład standardu, formularz, karty przebiegu).
- Układ strony głównej: historia odwiedzającego, czytana ekran po ekranie (`Story`, treść w `site.story`). Hero (sytuacja odwiedzającego, jeden przycisk, sterta papierów z rynku), potem sceny: rynek, dwa odruchy, zwrot, cztery kroki, zakończenie z rekomendacją; dalej sytuacje, o mnie i kontakt z listą lektur dla niegotowych na rozmowę. Na szerokim ekranie, z włączonym ruchem, za tekstem gra mały film rysunkowy 2D przewijany razem ze stroną (`src/film.js`: SVG szkicowany przez rough.js, poruszany przez GSAP, ładowany na żądanie): człowieczek w garniturze śpi, budzi się, mijają go papiery z rynku, zewsząd krzyczy „AI!”, w końcu mówi „Muszę to uporządkować.” i przychodzi rozwiązanie: karta pierwszej rozmowy, potem telefon do doradcy z trzema pytaniami, Karta rozpoznania i prezentacja przy rzutniku z zespołem (rozmowa w dymkach), grane po kolei na przypiętym ekranie czterech kroków; każdy krok ucisza część czerwonych papierów, a na końcu bohater stoi na środku z książką w ręce, wśród świętującego zespołu. Zielony przycisk pod tą sceną prowadzi zielonym przejściem do panelu kontaktu. Bez filmu (telefon, ograniczony ruch, brak JavaScriptu) te same ekrany pokazują płaskie kartki, z głębią CSS 3D tam, gdzie jest ruch. Sceny są przypięte na czas swojej animacji i jeszcze przez chwilę po niej. „Czego nie robię” ma własną stronę `/czego-nie-robie/`; metoda w trzech krokach i przykład standardu żyją poza stroną główną.
- Strona usługi `/konsultacja/` (`ServicePage`): hero z nagłówkiem oferty, teczką czterech kart i mapą etapów, etapy 0–5 po jednym na ekran w tym samym układzie (`Path`, treść w `site.flow.stages`), ekran zamykający z „Konsultacją w skrócie”, potem formaty. Sceny obu stron korzystają z tego samego mechanizmu przewijania (`useScenes`).
- Etap 0 „Wiedza otwarta” prowadzi do przewodnika i analiz (jego kartka to prawdziwy spis z linkami); kartki etapów 1–5 są poglądowe. Każdy slajd ma motyw (`site.flow.themes`: paper, desk, ink). Tokeny koloru są zarejestrowane przez `@property`, więc z włączonym ruchem motyw przechodzi płynnie na całą stronę razem z nagłówkiem; bez ruchu każdy slajd nosi swój motyw sam. Link do przypiętego etapu otwiera go na końcu sceny, gdy kartka jest już wypełniona.
- Szkic podsumowania sprawdzany względem źródła (`site.proof`, przełącznik „Z poprawkami / Po sprawdzeniu”) jest na podstronie przykładu standardu. To ilustracja na materiale syntetycznym i tak jest podpisana.
- „Od czego zaczynają klienci” (`site.cases`): osiem sytuacji. Na szerokim ekranie przeglądarka z pionowymi zakładkami (strzałki, Home, End), na wąskim i bez JS rozwijane pytania.
- Kontakt (`site.contact`): formularz jest kartą pierwszej rozmowy, czyli trzema pytaniami z etapu 1. Otwarte pytanie ma znak zapytania ołówkiem, który po odpowiedzi zmienia się w ✓. Demonstracja; niczego nie wysyła.
- Ruch: sekwencja otwarcia (nagłówek, teczka, mapa etapów) i sceny etapów. Na szerokim ekranie każdy etap jest przypięty (170vh), a jego scena jest sterowana przewijaniem przez zmienną `--sp` (kartka kładziona na biurku, cyfra wypełniana tuszem, tytuł podkreślany ołówkiem, zdanie czytane słowo po słowie, kartka wypełniana wiersz po wierszu). Poza tym rusza się tylko to, co odpowiada na działanie czytelnika (odhaczenia, wiersze listu). Wszystko za klasą `html.js-motion`. Nie ma jej przy `prefers-reduced-motion`, chyba że odwiedzający sam włączy animacje (link „Włącz animacje” w stopce albo dopisek `?motion`, zapamiętywany w localStorage); `?nomotion` wyłącza ruch i kasuje ten wybór.

## Edycja

- Przewodnik (`site.guide`, `/przewodnik/`): trzy ekrany czytane z góry na dół (co to jest, co jest w środku, jak to dostać). Formularz jest mailem, który składa się na oczach odwiedzającego: odhaczone narzędzie dopisuje swoje omówienie, przy dwóch pojawia się oznaczony dopisek, adres wpisuje się w linii „Do:”. Demonstracja; niczego nie wysyła. Przykładowe kompendium (`site.compendium`) jest w całości syntetyczne.
- `src/content/site.js`: hero (DRAFT), ilustracja sprawdzania szkicu (DRAFT), przebieg konsultacji (DRAFT), przewodnik, wiedza otwarta i przykładowe kompendium (DRAFT), sytuacje przykładowe (DRAFT), formaty, przykład standardu, metoda, zasady „Czego nie robię” (DRAFT), ekspertyza.
- `src/content/articles.js`, `src/content/glossary.js`: analizy i słownik pokazywany na marginesie.
- `src/App.jsx`: skład stron i komponenty (`Path`, `Cases`, `Contact`, `GuideForm`, `Pick`). `src/motion.js`: rozświetlanie słów.
- `AGENTS.md`: wiążące zasady treści. `docs/launch-readiness.md`: zadania przed publikacją.

## Uruchomienie

Node.js 20 lub nowszy. `npm ci`, potem `npm run dev` (Vite) albo `npm run build`, który tworzy statyczne dokumenty HTML ośmiu stron w `dist/client`. `npm test` sprawdza worker. Treść jest czytelna bez JavaScript.

`qa-views` to pomocnicze widoki do zrzutów (`scroll.html?to=przebieg&dy=400`); nie trafiają do `dist/client`.

## Cloudflare

Worker (`worker/index.js`) serwuje statyczne pliki z `dist/client` przez binding `ASSETS`; konfiguracja w `wrangler.jsonc`, nagłówki cache i `X-Robots-Tag` w `public/_headers`. Nieznana trasa HTML dostaje stronę główną.

- `npm run preview`: build i lokalny podgląd przez `wrangler dev` (http://127.0.0.1:8787).
- `npm run deploy:check`: build i `wrangler deploy --dry-run`, bez publikacji.
- `npm run deploy`: build i publikacja. Wymaga wcześniejszego `npx wrangler login`. Skrypt `scripts/check-deploy-branch.mjs` przerywa wdrożenie, jeśli nie jesteś na `deploy/cloudflare`, masz niezacommitowane zmiany albo gałąź różni się od origin.

### Gałęzie i wdrożenie

Zmiany płyną w jedną stronę, wyłącznie fast-forward:

`dev` (bieżąca praca) → `main` (sprawdzony stan: build i testy przechodzą) → `deploy/cloudflare` (dokładnie to, co jest na produkcji).

Produkcja jest wdrażana **tylko z `deploy/cloudflare`**. Wydanie: `git switch deploy/cloudflare && git merge --ff-only main && git push origin deploy/cloudflare`, a następnie wdrożenie: automatycznie przez Cloudflare Workers Builds, jeśli jest podłączone do tej gałęzi, albo ręcznie przez `npm run deploy`.

Strona jest publikowana pod `piotrwrotny.pl` i `www.piotrwrotny.pl` (Custom Domain w `wrangler.jsonc`) oraz pod adresem `*.workers.dev`; `noindex` zostaje do publicznej wersji. Formularz pozostaje lokalną demonstracją. Sekrety nie trafiają do repo.
