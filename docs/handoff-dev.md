# Handoff: przegląd wyglądu i jakości (gałąź `dev`)

> Stan 2026-11-09: Faza 1 i Faza 2 wykonane. Diagnoza i koncepcja: `docs/plan-fable.md`. Wyniki i zrzuty: `design-qa.md`, `design/qa/before`, `design/qa/after`. Otwarte: akceptacja treści `DRAFT` przez założyciela (`docs/launch-readiness.md`, P0).

Data: 2026-11-09. Zadanie dla Fable 5.1 w roli architekta: ocenić wygląd i jakość strony i ją wzmocnić.

## Cel
Wizytówka eksperta AI. Obecne wrażenie założyciela: „mizerna powłoka”. Strona ma budzić zaufanie i pokazywać głębię myślenia, nie wyglądać jak szablon.

## Twarde ograniczenia (z AGENTS.md)
- Wzorzec: `design/selected-reference.jpeg` (Esej autorski). Papier, Newsreader, Inter, pine-green oferta główna.
- Bez portretów, bez dekoracyjnych grafik AI, bez wymyślonych klientów/metryk/certyfikatów, bez cen.
- W = główna, K = samodzielna, R = na zapytanie. Domeny ekspertyzy nie są usługami.
- Formularz tylko lokalny podgląd; nie wysyłać danych, nie twierdzić, że wysłano.
- Polski pierwszy, treści w `src/content/*`. Artykuły i przykład dostępne bez zostawiania kontaktu.

## Stan wyjściowy (fakty)
- ~720 linii kodu łącznie: `src/App.jsx` 201, `src/styles.css` 311, `site.js` 59, `articles.js` 136. Jedna strona główna + 4 podstrony.
- Dev: `npm ci && npm run dev` (http://127.0.0.1:5173/). `npm test` = 3 testy workera, przechodzą.
- `design-qa.md` opisuje porównanie ze wzorcem tylko dla jednego widoku desktop 893 px; zrzutów w repo nie ma.
- Nie wykonano jeszcze wizualnego przeglądu w tej sesji.

## Tryb pracy: najpierw rewizja, potem wdrożenie
Poniższa lista kroków to szkic Sonneta, nie polecenie. Może być przeciętna. Nie wykonuj jej mechanicznie.

1. **Faza 1, bez zmian w kodzie.** Obejrzyj stronę (zrzuty: mobile 390, tablet 768, desktop 1280/1440), przeczytaj `src/`, `docs/design-system.md` i wzorzec. Sam sformułuj diagnozę: co dokładnie czyni stronę „powłoką” i jaka jest ambicja jakościowa wizytówki eksperta AI.
2. **Zrewiduj plan.** Odrzuć, zmień lub dodaj kroki; uzasadnij krótko. Zapisz własny plan w `docs/plan-fable.md` i przedstaw go założycielowi do akceptacji przed Fazą 2.
3. **Faza 2: wdrożenie po swojemu.** Własna koncepcja i dobór środków, w granicach ograniczeń z AGENTS.md. Po większych zmianach sprawdzaj render i `npm run build`.
4. Treści wymagające danych założyciela zostają jawnymi placeholderami (`docs/launch-readiness.md`, P0).
5. Zaktualizuj `design-qa.md` o faktyczne zrzuty i wyniki.

### Szkic Sonneta do rewizji (kandydaci, nie decyzje)
- Podejrzewane źródła „powłoki”: mało materiału pokazującego metodę w działaniu, płaskie sekcje, krótkie podstrony, brak mikrointerakcji.
- Pytanie otwarte: czy wzorzec `selected-reference.jpeg` sam nie ogranicza głębi, i co wolno rozbudować poza nim.
