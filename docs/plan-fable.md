# Plan Fable: diagnoza i koncepcja wzmocnienia strony

Data: 2026-11-09. Gałąź `dev`. Faza 1 wykonana bez zmian w kodzie. Zrzuty stanu wyjściowego: `design/qa/before/` (strona główna 1440 / 768 / 390, próbka standardu 1280, analiza 1280).

## 1. Diagnoza

Strona jest wiernym odwzorowaniem makiety, która opisuje wyłącznie otwarcie: header, hero, pasek „Perspektywa”, zielony blok W i wiersz K. To około 1500 px z ponad 9000 px strony głównej. Wszystko poniżej zostało dopisane bez wzorca i widać to.

**Co działa.** Hero jest najmocniejszym fragmentem: Newsreader 164 px, ciasny tracking, trzy wiersze, czysty papier. Zielony blok W trzyma napięcie. Fonty lokalne z polskimi znakami, kontrasty policzone, dostępność formularza i menu powyżej standardu prototypu. Strona próbki standardu (lista definicji Początek / Koniec / Wejście / AI / Operator / Stop, instrukcja robocza, kryteria) to merytorycznie najlepszy materiał na stronie.

**Co sprawia wrażenie „powłoki”.** Pięć przyczyn, w kolejności wagi:

1. **Jeden moduł powtórzony osiem razy.** Od sekcji „Sytuacja” do „Kontakt” każda sekcja ma identyczną anatomię: eyebrow, szeryfowy H2 w lewej kolumnie, Inter w prawej, cienka linia. Osiem razy z rzędu. Oko uczy się wzorca po drugiej sekcji i przestaje czytać. To jest dokładnie mechanika szablonu, choć szablonu nie użyto.

2. **Strona mówi o myśleniu, ale go nie pokazuje.** Na stronie głównej nie ma ani jednego artefaktu pracy: tabeli, standardu, kryterium, porównania. Jedyny dowód myślenia (próbka standardu) jest schowany za linkiem i opatrzony trzema zastrzeżeniami. Dla eksperta AI dowodem kompetencji jest jakość rozumowania widoczna od razu, a nie obietnica, że gdzieś jest.

3. **Nadmiar asekuracji w copy.** Na stronie głównej naliczyłem dziewięć zdań, które mówią, czym oferta *nie jest* lub czego *nie zrobiono*: „Demonstracja na danych syntetycznych. Nie jest opisem zlecenia ani dowodem…”, „To zaplecze mojej pracy. Aktualne formy współpracy opisuję w sekcji usług.”, „Zakres, cenę i terminy potwierdzam przed rozpoczęciem”, „[Zweryfikowane doświadczenie… do uzupełnienia]”, „Formularz demonstracyjny…”, „Opis jest sprawdzany tylko w tej karcie…”. Każde z osobna jest uczciwe. Razem tworzą ton osoby, która przeprasza, że zajmuje czas. Uczciwość ma zostać; rozproszenie i powtórzenia nie.

4. **Architektura informacji zapętla się.** Czytelnik widzi: W (zielony blok) → K (wiersz) → problem → W jeszcze raz („Co zostaje”) → K jeszcze raz (pełna sekcja) → R. Link „Poznaj zakres współpracy” w zielonym bloku przeskakuje nad sekcją „Sytuacja” do `#zakres`. W wierszu K leży link do próbki standardu, który z K nie ma nic wspólnego (odziedziczone z makiety, gdzie treść była wypełniaczem).

5. **Brak detalu, który mówi „ktoś się tym zajął”.** Sieroty w nagłówkach („Konsultacja jednej decyzji / AI” na 1440; „pracy.” samotne w hero na 390), brak spacji w „Proces.Technologia.” na mobile, strzałka listy analiz oddalona o 700 px od tytułu, puste pół-kolumny pod nagłówkami K i Podejście, kolumna artykułu (760 px, wyśrodkowana) rozjechana względem lewego marginesu nagłówka artykułu. Interakcja ogranicza się do grubości podkreślenia. Nic nie oddycha.

**Wniosek.** To dobrze złożona okładka bez książki. Wzorzec nie jest winny: opisuje otwarcie i robi to dobrze. Winna jest decyzja, żeby resztę strony wypełnić jednym układem i treścią, która sama siebie pomniejsza.

## 2. Ambicja

Czytelnik ma zamknąć stronę z poczuciem, że dostał już mały kawałek osądu tej osoby, zanim napisał. W kierunku „Esej autorski” oznacza to, że strona główna zachowuje się jak esej z eksponatami: teza, argument, dowód w postaci artefaktu, marginalia, a dopiero potem oferta i kontakt. Nie broszura z ośmioma nagłówkami.

## 3. Rewizja szkicu Sonneta

Szkic w `docs/handoff-dev.md` trafnie wskazał „mało materiału pokazującego metodę w działaniu” i „płaskie sekcje”. Resztę zmieniam:

- **Odrzucam „brak mikrointerakcji” jako przyczynę.** Strona redakcyjna nie potrzebuje animacji wejścia; system wizualny słusznie ich zakazuje. Potrzebuje kilku precyzyjnych stanów (otwieranie disclosure, podkreślenia, fokus), nie ruchu dla ruchu.
- **Odrzucam „krótkie podstrony” jako przyczynę.** Podstrony są wystarczająco długie. Są za płaskie typograficznie: same H2 i akapity, bez pull quote, tabeli, numerowanych tez. Przykład „24 vs 26 minut” w analizie prosi się o małą tabelę, a jest ukryty w prozie.
- **Dodaję to, czego szkic nie widział:** nadmiar asekuracji w copy (pkt 3) i zapętloną architekturę (pkt 4). To są główne źródła wrażenia „mizerności”, a nie brak dodatkowych sekcji.
- **Pytanie szkicu „czy wzorzec ogranicza głębię”** rozstrzygam: nie. Wzorzec kończy się na wierszu K. Wszystko poniżej jest otwarte; AGENTS.md wymaga wierności tylko temu, co na obrazie widać.

## 4. Koncepcja Fazy 2

### 4.1 Jedna oś zamiast ośmiu modułów

Nowa kolejność strony głównej:

1. Hero (bez zmian).
2. Perspektywa (bez zmian).
3. **W, zielony blok** (bez zmian w wyglądzie). Link „Poznaj zakres” prowadzi do sekcji bezpośrednio pod spodem.
4. **Sytuacja → Co zostaje** jako jedna sekcja W: problem jest uzasadnieniem usługi, nie osobnym rozdziałem. Trzy rezultaty i dwa disclosure zostają.
5. **Eksponat: przykład standardu** przeniesiony na stronę główną w wersji skróconej (sześć wierszy listy definicji) i złożony jak tablica w eseju: numer, tytuł, jedna linia podpisu („Materiał syntetyczny; pełna wersja i kryteria na osobnej stronie”). To jest jeden ruch, który zmienia stronę z obietnicy w dowód.
6. **K jako jedna zwarta sekcja** w innym rejestrze niż W (węższa, bez dużego H2, bliżej noty niż rozdziału). R jako przypis pod K, nie osobny `aside`. Wiersz K zaraz pod zielonym blokiem zostaje jako jednolinijkowy wskaźnik z poprawnym linkiem do `#konsultacja`, bo tak jest w makiecie.
7. **Podejście** (trzy kroki) w innym układzie niż rezultaty: trzy kolumny na tle sand zamiast kolejnych wierszy.
8. **Analizy** z poprawioną siatką: tytuł, lead i strzałka w jednym polu szerokości czytelniczej, nie rozciągnięte na 1280 px.
9. **O mnie** skrócone do tego, co prawdziwe, z jednym jawnym miejscem „do uzupełnienia” jako elementem składu, nie przeprosinami w treści.
10. Kontakt (układ bez zmian; redukcja powtórzonych zastrzeżeń do jednego na kontekst).

### 4.2 Zasada jednego zastrzeżenia

Każdy kontekst dostaje jedno zdanie granicy, złożone konsekwentnie (ten sam styl noty), zamiast dwóch–trzech rozsianych w body copy. Fakty zostają: dane syntetyczne, brak wysyłki, placeholdery, brak cen. Znikają zdania meta („To zaplecze mojej pracy. Aktualne formy współpracy opisuję w sekcji usług.”), które niczego nie chronią.

### 4.3 Środki redakcyjne na podstronach

- Kolumna czytelnicza wyrównana do lewej krawędzi nagłówka, z prawą kolumną marginaliów (definicje: baseline, błąd krytyczny, właściciel procesu; w analizach odsyłacze do próbki).
- Pull quote raz na analizę; mała tabela dla przykładu 24 vs 26 minut.
- Numerowane tezy (3–4) na początku każdej analizy jako streszczenie dla czytelnika, który nie czyta całości.
- Stała linia metadanych: rodzaj · data · czas czytania.

### 4.4 Detal

- `text-wrap: balance` na nagłówkach, `pretty` na akapitach; ręczne łamania tylko tam, gdzie makieta ich wymaga.
- Naprawa: spacja w „Proces. Technologia.” na mobile; sierota „AI” w H2 konsultacji; „pracy.” w hero 390; odległość strzałki w liście analiz; puste pół-kolumny.
- Stany: płynne otwieranie disclosure (height, 200 ms, wyłączone przy reduced-motion), podkreślenie linku animowane od lewej, wyraźny focus na zieleni. Nic więcej.
- `index.html`: favicon (literowy, SVG, bez grafiki AI), `og:title` / `og:description`, `lang="pl"` już jest. `noindex` zostaje do publikacji.

### 4.5 Nowa treść wymagająca akceptacji głosu

Dwa krótkie bloki, które pokazują ekspertyzę jako postawę, nie jako referencje, więc nie łamią zakazu wymyślania dowodów:

- **„Czego nie robię”** (4–5 punktów): nie oceniam narzędzia bez zadania, nie podaję oszczędności bez pomiaru, nie zostawiam standardu bez właściciela, nie uruchamiam automatycznej wysyłki w pierwszej próbie. Wyprowadzone z istniejącej treści `site.js`, więc merytorycznie już zatwierdzone; nowa jest forma.
- **Słownik roboczy** (5–6 haseł) jako marginalia na podstronach: baseline, błąd krytyczny, właściciel procesu, operator, próba, standard. Precyzja słownika jest dowodem rygoru.

Oba napiszę jako szkice do akceptacji założyciela; do czasu akceptacji oznaczone w kodzie komentarzem `// DRAFT`.

## 5. Kolejność prac i kontrola

1. Struktura strony głównej (4.1) i zasada jednego zastrzeżenia (4.2). Zrzuty, `npm run build`, porównanie z `design/qa/before/`.
2. Eksponat standardu na stronie głównej (4.1 pkt 5) i poprawki detalu (4.4).
3. Podstrony (4.3).
4. Nowa treść (4.5) jako szkic.
5. `design-qa.md`: aktualizacja o zrzuty przed/po i listę wykonanych poprawek. `docs/design-system.md`: nowe komponenty (eksponat, nota graniczna, marginalia).

Po każdym kroku: zrzuty 390 / 768 / 1440, build przechodzi, testy workera przechodzą, brak poziomego przepełnienia.

## 6. Decyzje dla założyciela

1. **Zgoda na restrukturyzację** strony głównej wg 4.1, w szczególności: połączenie „Sytuacji” z W oraz sprowadzenie K do jednej sekcji.
2. **Zgoda na eksponat** (skrócony standard) na stronie głównej. To zmienia stronę najbardziej i jest jedyną rzeczą, której wzorzec nie przewidywał powyżej wiersza K.
3. **Zgoda na pisanie szkiców treści** z 4.5. Bez tej zgody wykonuję tylko 4.1–4.4.
4. **Potwierdzenie**, że wzorzec `selected-reference.jpeg` jest wiążący dla otwarcia (do wiersza K włącznie), a poniżej mam wolną rękę w granicach systemu wizualnego.

## 7. Czego nie zrobię

Nie dodam portretu, grafik, ikon ozdobnych, liczb, nazw klientów, certyfikatów ani cen. Nie zmienię kolorów, fontów ani otwarcia strony. Nie dodam animacji wejścia. Nie podłączę formularza. Nie usunę żadnego faktycznego zastrzeżenia; zmienię tylko jego liczbę i miejsce.
