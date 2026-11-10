# Gotowość do publikacji i backlog

30 października 2026. Prototyp jest gotowy do przeglądu i iteracji. Nie został opublikowany jako produkcyjna oferta i nie przyjmuje rzeczywistych wiadomości.

## Wykonane

Responsywny frontend. Strona główna, dwie pełne analizy, syntetyczny standard i opis prywatności prototypu. Działające linki, menu, szczegóły zakresu, wybór tematu kontaktu, walidacja, podgląd i kopiowanie. Pięć stron generowanych statycznie podczas builda. Brak sztucznych referencji i publicznego eksperymentalnego cennika.

## P0 przed publiczną publikacją

| Właściciel | Zadanie | Warunek ukończenia |
|---|---|---|
| Założyciel | Opis doświadczenia i publiczny profil (nazwisko Piotr Wrotny wprowadzone 2026-11-09) | Zatwierdzone fakty, realny profil i dozwolony zakres ujawnienia; usunięty marker „Do uzupełnienia” w sekcji O mnie |
| Założyciel | Akceptacja treści oznaczonych `DRAFT` (2026-11-09) | Brzmienie „Czego nie robię” (`site.principles`), słownika (`src/content/glossary.js`), tez analiz (`articles[].theses`) pięciu sytuacji przykładowych (`site.cases`), przebiegu konsultacji z warunkami zbiorczymi i wezwaniem do akcji (`site.flow`) oraz ilustracji otwarcia (`site.proof`) zatwierdzone lub poprawione; usunięte komentarze `DRAFT` |
| Założyciel | Dane działalności, kontakt i dostępność | Prawdziwe dane, e-mail oraz wykonalny termin odpowiedzi |
| Założyciel | Polityka oferty i ceny | Akceptowany zakres, cena kohorty, podatki/VAT, płatności i realny kalendarz; hipotezy DR07 nie są walidowanym cennikiem |
| Założyciel i prawnik | Prywatność i warunki usług | Dokumenty odpowiadają administratorowi, dostawcom, retencji i przepływowi; odpowiednio ocenione obowiązki oraz prawa kupującego |
| Założyciel i wykonawca techniczny | Operacyjny formularz | Uzgodniony dostawca, minimalizacja, endpoint, walidacja serwerowa i ograniczenie nadużyć; potwierdzony odbiór wiadomości testowej |
| Założyciel | Domena i docelowy hosting | Własność kont, HTTPS, uprawnienia, backup i rollback; świadomie wybrana grupa odbiorców |
| Frontend i tester | Końcowe sprawdzenie dostępności | Klawiatura, czytnik ekranu, zoom, rzeczywiste iOS/Android, finalne stany formularza; poprawione istotne problemy |
| Frontend | Metadane i indeksowanie | Prawdziwy canonical, sitemap i opis; usunięcie noindex dopiero dla właściwej publicznej wersji |

Fotografia nie blokuje publikacji: wybrany wariant został świadomie zrealizowany bez portretu. Później można dodać realne zdjęcie w profilu, z prawami do publikacji.

## P1 po pierwszych rozmowach

Sprawdzić, czy odbiorca własnymi słowami rozumie rezultat W i odróżnia go od wdrożenia produkcyjnego. Ocenić użycie próbki, źródła zapytań, dopasowanie, oferty i zapłatę. Doprecyzować copy na podstawie powracających pytań. Dodać prawdziwy opis przypadku dopiero po użyciu, pomiarze i uzyskaniu praw.

## P2 przy rzeczywistej potrzebie

Wersja EN, kolejna autorska analiza, mała odmiana branżowa po płatnych dowodach. Osobne strony usług dopiero przy potrzebie, która uzasadnia dodatkowe utrzymanie. Bez automatycznego przejścia do newslettera, portalu, abonamentu i utrzymania AI.

## Ograniczenia weryfikacji

Przeprowadzono przegląd w Chrome w dostępnej przeglądarce Work. Szerokości sprawdzano przez rzeczywiste viewporty CSS w iframe, bez emulacji konkretnego telefonu. Nie wykonano testu na fizycznych urządzeniach, pełnego audytu WCAG ani pomiarów Core Web Vitals w ruchu rzeczywistym. Nie wysyłano wiadomości. Nie wykonano publicznego wdrożenia.
