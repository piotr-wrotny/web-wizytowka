// Public content. Replace only with founder-approved facts.
// Prices remain internal hypotheses and are intentionally not public.
export const site = {
  name: 'Piotr Wrotny',
  descriptor: 'Niezależny doradca AI',
  hero: {
    lines: ['Od odpowiedzi AI', 'do dobrze wykonanej pracy.'],
    lead: 'Konsultacje szyte na miarę zespołu i zadania.\nOcena technologii, kryteria jakości\ni praktyczna próba na Twoim materiale.',
  },
  // DRAFT 2026-11-10: hero illustration written by the assistant from the synthetic note on the sample page.
  // It shows the method (check every statement against the source); it is not a model output and must stay labelled.
  proof: {
    titles: { draft: 'Robocze podsumowanie, szkic', final: 'Robocze podsumowanie, po sprawdzeniu' },
    rows: [
      { draft: [['t', 'Rozmowa dotyczyła etapowego uruchomienia obsługi.']], final: 'Rozmowa dotyczyła etapowego uruchomienia obsługi.', source: 'Rozmowa o etapowym uruchomieniu obsługi' },
      { draft: [['t', 'Najpierw trzeba ustalić zakres źródeł danych i liczbę użytkowników.']], final: 'Najpierw trzeba ustalić zakres źródeł danych i liczbę użytkowników.', source: 'ustalić zakres źródeł danych i liczbę użytkowników' },
      { draft: [['t', 'Budżet '], ['del', 'został zatwierdzony'], ['t', '.']], fix: 'wymaga potwierdzenia', final: 'Budżet wymaga potwierdzenia.', source: 'Budżet wymaga potwierdzenia' },
      { draft: [['del', 'Wdrożenie rozpocznie się w marcu.']], fix: 'brak w źródle', final: 'Terminu wdrożenia nie uzgodniono.', source: 'Termin wdrożenia nie został uzgodniony' },
      { draft: [['t', 'Opiekun przygotuje pytania do kolejnej rozmowy.']], final: 'Opiekun przygotuje pytania do kolejnej rozmowy.', source: 'Opiekun ma przygotować pytania' },
    ],
    caption: 'Ilustracja metody na materiale syntetycznym. Szkic i poprawki napisał autor strony; to nie jest wynik działania modelu.',
  },
  perspective: {
    title: 'Produkt. Proces. Technologia.',
    text: 'Doświadczenie Technical Product Managera. Jasne pytanie, uzasadniony wybór, sprawdzalny rezultat.',
  },
  nav: [
    { label: 'Współpraca', href: '/#wspolpraca' },
    { label: 'Podejście', href: '/#podejscie' },
    { label: 'O mnie', href: '/#o-mnie' },
    { label: 'Kontakt', href: '/#kontakt' },
  ],
  // Primary offer: the blue band.
  offer: {
    name: 'Konsultacje AI szyte na miarę',
    subtitle: 'Jedno pytanie, jeden zespół albo jedna decyzja.',
    intro: 'Zaczynam od zadania, nie od narzędzia.\nKończę pisemną rekomendacją albo standardem, który zespół utrzyma sam.',
    link: 'Zobacz formaty współpracy',
  },
  // DRAFT 2026-11-10: the main use case, written by the assistant from the founder's description
  // (recognise problems and knowledge level first, gather material, present, meet, hand over documents).
  // Sheet contents are illustrative, not a record of an engagement. Wording awaits founder approval.
  flow: {
    title: 'Jak przebiega konsultacja.',
    lead: 'Zanim cokolwiek wyjaśnię, ustalam z klientem, co najbardziej przeszkadza i od jakiego poziomu wiedzy zaczynamy. Wszystko, co dzieje się potem, jest przygotowane pod tę odpowiedź.',
    note: 'Przebieg poglądowy. Zawartość kart pokazuje rodzaj materiału; zakres i formę ustalamy przed rozpoczęciem.',
    stages: [
      {
        title: 'Rozpoznanie',
        text: 'Przed konsultacją ustalam z klientem największe problemy i bolączki oraz poziom wiedzy o AI: osoby, zespołu albo całej firmy.',
        value: 'Rozmawiamy o Twojej sytuacji, nie o AI w ogóle.',
        sheet: { kind: 'card', title: 'Rozpoznanie', rows: [['Problemy', 'Co dziś nie działa i gdzie ucieka czas.'], ['Bolączki', 'Co najbardziej przeszkadza w codziennej pracy.']], scale: { label: 'Poziom wiedzy', from: 'początki', to: 'praktyka', steps: 5, at: 2 } },
      },
      {
        title: 'Zebranie materiału',
        text: 'Zbieram dane, przykłady i źródła dobrane do tych problemów i do tego poziomu wiedzy. Bez materiału „na wszelki wypadek”.',
        value: 'Dostajesz wiedzę dobraną do swoich pytań.',
        sheet: { kind: 'list', title: 'Zebrany materiał', items: ['Dane i źródła do nazwanych problemów', 'Przykłady zastosowań na właściwym poziomie', 'Narzędzia, które warto porównać', 'Ograniczenia i ryzyka'] },
      },
      {
        title: 'Prezentacja',
        text: 'Układam materiał w prezentację, która tłumaczy temat krok po kroku, językiem dopasowanym do odbiorców.',
        value: 'Trudny temat staje się zrozumiały dla całego zespołu.',
        sheet: { kind: 'slide', title: 'Prezentacja', heading: 'Od czego zacząć i co sprawdzić najpierw', items: ['Gdzie jesteście dziś', 'Co jest możliwe, a co nie', 'Pierwszy rozsądny krok'] },
      },
      {
        title: 'Spotkanie',
        text: 'Na spotkaniu wyjaśniam, odpowiadam na pytania i razem przechodzimy przez wnioski.',
        value: 'Jest czas na pytania i wątpliwości, zanim podejmiesz decyzję.',
        sheet: { kind: 'questions', title: 'Pytania ze spotkania', items: ['Od czego zacząć?', 'Co zostawić bez zmian?', 'Jak sprawdzić rezultat?'] },
      },
      {
        title: 'Dokumenty',
        text: 'Na koniec przekazuję dokumenty z całą wiedzą: zebrany materiał, prezentację, odpowiedzi na pytania i rekomendację.',
        value: 'Wiedza zostaje u Ciebie i można do niej wracać.',
        sheet: { kind: 'contents', title: 'Dokumenty końcowe', items: ['Rozpoznanie', 'Zebrany materiał', 'Prezentacja', 'Odpowiedzi na pytania', 'Rekomendacja i następny krok'] },
      },
    ],
  },
  // DRAFT 2026-11-09: illustrative situations. Generic roles, no clients, no outcomes. Wording awaits founder approval.
  cases: {
    title: 'Od czego zaczynają klienci.',
    intro: 'Pierwsza wersja jest gotowa, ale senior nadal poprawia fakty, dopowiada kontekst i porządkuje wynik. Każda osoba pracuje inaczej. Trudno powiedzieć, kiedy rezultat jest dobry i kto go zatwierdza. Konsultacja zaczyna się od nazwania tej sytuacji.',
    note: 'Sytuacje przykładowe. Pokazują rodzaj pytania i dobór formatu; nie opisują zleceń ani klientów.',
    items: [
      { role: 'Zespół sprzedaży', situation: 'Notatki po rozmowach z klientami powstają w kilku formach, a podsumowania dla opiekunów wymagają poprawek seniora.', question: 'Czy AI może przygotować robocze podsumowanie bez dopisywania ustaleń, których nie było?', format: 'Standard dla zespołu' },
      { role: 'Obsługa klienta', situation: 'Odpowiedzi na zgłoszenia korzystają z bazy wiedzy, która jest częściowo nieaktualna. Rozważany jest zakup nowego asystenta.', question: 'Czy luka jest w narzędziu, czy w źródłach i sposobie pracy?', format: 'Jedna decyzja' },
      { role: 'Zarząd lub właściciel', situation: 'Na stole leży oferta dostawcy rozwiązania AI z obietnicą oszczędności i terminem decyzji.', question: 'Które założenia oferty da się sprawdzić przed podpisaniem i czego w niej brakuje?', format: 'Przegląd oferty' },
      { role: 'Analizy i raportowanie', situation: 'Miesięczny raport składa się z danych z kilku systemów. AI ma pomóc w opisie, ale nikt nie mierzy, ile czasu faktycznie oszczędza.', question: 'Jak ustawić baseline i próbę, żeby decyzja opierała się na pomiarze?', format: 'Standard dla zespołu' },
      { role: 'HR i rekrutacja', situation: 'Streszczenia kandydatur i notatki z rozmów mają powstawać z pomocą AI. Pojawia się pytanie o dane osobowe i granice użycia.', question: 'Co wolno przekazać narzędziu, a co musi zostać przy człowieku?', format: 'Jedna decyzja, potem standard' },
    ],
  },
  formats: {
    title: 'Trzy formaty. Zakres ustalamy razem.',
    lead: 'Każda konsultacja kończy się zapisem: rekomendacją, standardem albo oceną oferty. Format dobieram do pytania, nie odwrotnie.',
    boundaryNote: 'Zakres, cenę i terminy potwierdzam przed rozpoczęciem współpracy.',
  },
  workflow: {
    name: 'Standard dla zespołu',
    subtitle: 'Jeden sposób pracy z AI: standard, próba i przekazanie.',
    text: 'Jedno powtarzalne zadanie w zatwierdzonym narzędziu. Jasne zasady, kontrola jakości i właściciel procesu. Zespół odtwarza metodę samodzielnie, a po użyciu podejmujemy decyzję: stosować, zmienić, odrzucić.',
    resultTitle: 'Co zostaje po współpracy',
    result: [
      { title: 'Jasne wejście i przebieg', text: 'Karta celu, mapa obecnej i proponowanej pracy oraz edytowalny szablon wejścia.' },
      { title: 'Standard i kontrola jakości', text: 'Instrukcja z rolami i wyjątkami, kryteria oceny oraz przypadki do próby.' },
      { title: 'Próba i przekazanie', text: 'Zapis wyników, ograniczenia, samodzielne odtworzenie przez operatora i decyzja po użyciu.' },
    ],
    conditions: [
      'Dla 2–4 osób wykonujących podobne zadanie, z właścicielem procesu i osobą oceniającą wynik. Jeden workflow 5–7 kroków w jednym zatwierdzonym narzędziu.',
      'Na początek trzy reprezentatywne próbki, do 20 stron łącznie, oraz baseline zadań lub jawnie oznaczone estymacje. Zwykle 10 nowych prób w ciągu 14 dni; inny plan uzgadniamy przed rozpoczęciem.',
      'Rozpoczęcie 60 min, warsztat 90 min, próba i przekazanie 90 min, ocena po użyciu 30 min. Konfiguracja wykonywana przez klienta na jego koncie: maksymalnie 45 minut w całej wspólnej pracy.',
      'Zwykle około 3–4 tygodni od kompletu wejść. Terminy zależą od dostępności zespołu i materiałów; potwierdzamy je wcześniej. Licencje i czas uczestników pozostają po stronie klienta.',
      'Czas zespołu ustalamy przed zakupem; spotkanie kilku osób oznacza nakład każdej z nich.',
    ],
    boundaries: [
      'Nowe integracje i API, kod produkcyjny, automatyczne wysyłki lub zapis w systemach, migracja i administracja wymagają osobnego zakresu.',
      'Usługa nie obejmuje RAG, całofirmowej polityki, formalnej certyfikacji, incydentów, utrzymania ani otwartego czatu po zakończeniu.',
      'Przekazuję uzgodniony standard, próbę i ocenę. Wynik może prowadzić także do zmiany metody, pozostania przy obecnej lub rezygnacji z AI w tym zadaniu.',
      'Jedna zbiorcza runda doprecyzowań dotyczy uzgodnionego wyniku. Moje własne błędy koryguję niezależnie od tej puli; nowy przedmiot pracy wymaga osobnego ustalenia.',
    ],
  },
  consultation: {
    name: 'Jedna decyzja',
    subtitle: 'Rozmowa i pisemna rekomendacja.',
    text: 'Rozważasz dwa rozwiązania, nie wiesz, co sprawdzić przed zakupem, albo chcesz zrozumieć nieudaną próbę? Porządkujemy jedno pytanie, dostępne fakty i kompromisy.',
    outcome: 'Po 60-minutowej sesji otrzymujesz krótką rekomendację z uzasadnieniem, niewiadomymi i następnym krokiem.',
    details: [
      'Sesja 60 minut, maksymalnie dwóch uczestników i do pięciu stron materiału. Dopasowanie sprawdzamy przed rezerwacją.',
      'Memo 1–2 strony do dwóch dni roboczych: rekomendacja, uzasadnienie, niewiadome i następny krok. Jedna zbiorcza odpowiedź do tego samego pytania w ciągu pięciu dni roboczych.',
      'Rozległy research, ocena dużej oferty, konfiguracja zespołu i test działającego systemu wymagają osobnego ustalenia. Konsultacja jest samodzielną usługą; nie trzeba jej kupować przed pracą z zespołem.',
    ],
  },
  review: {
    name: 'Przegląd oferty',
    subtitle: 'Na zapytanie.',
    text: 'Niezależny przegląd jednej oferty AI: jej założeń, kosztów, dowodów i warunków decyzji. To ocena dokumentów; test działającego systemu wymaga osobnego ustalenia.',
  },
  // Example standard shown as an exhibit on the home page (first six rows) and in full on the sample page.
  standard: {
    title: 'Z notatki po rozmowie do roboczego podsumowania.',
    rows: [
      ['Początek', 'Zatwierdzona do użycia notatka; fakty oddzielone od niewiadomych.'],
      ['Koniec', 'Sprawdzone robocze podsumowanie dla opiekuna. Bez automatycznej wysyłki do klienta.'],
      ['Wejście', 'Notatka, odbiorca, cel, wymagany format i dozwolone źródła.'],
      ['AI', 'Porządkuje informacje: ustalenia, braki, pytania i następny krok.'],
      ['Operator', 'Sprawdza każdą tezę względem źródła, usuwa niepoparte zdania i zapisuje poprawki.'],
      ['Stop', 'Niepoparte zobowiązanie, niedozwolone dane lub niepewność krytycznego faktu. Powrót do źródła i oceny człowieka.'],
      ['Właściciel', 'Utrzymuje instrukcję, zatwierdza zmiany i rozstrzyga wyjątki.'],
      ['Wykluczenia', 'Dopisywanie oferty, ceny, terminu lub zobowiązania handlowego; automatyczna wysyłka.'],
    ],
    exhibitRows: 6,
  },
  method: [
    { title: 'Zrozumienie pracy', text: 'Ustalamy, jaki wynik ma zostać zaakceptowany, skąd pochodzą informacje, co wymaga poprawiania i kto odpowiada za zadanie.' },
    { title: 'Projekt i próba', text: 'Porównujemy sensowne alternatywy. Projektujemy wejście, instrukcję i kontrolę jakości. Sprawdzamy uzgodnione przypadki; błąd krytyczny zatrzymuje daną ścieżkę.' },
    { title: 'Przekazanie i decyzja', text: 'Operator odtwarza metodę, a właściciel przejmuje standard. Po użyciu decydujemy: stosować, zmienić, odrzucić albo zebrać brakujące dane.' },
  ],
  methodClosing: 'Dobra rekomendacja może oznaczać także wykorzystanie obecnego narzędzia lub rezygnację ze zmiany.',
  // DRAFT 2026-11-09: derived from conditions, boundaries and method above. Wording awaits founder approval.
  principles: [
    'Nie oceniam narzędzia bez zadania, które ma wykonać.',
    'Nie podaję oszczędności, której nie zmierzono na porównywalnych zadaniach.',
    'Nie przekazuję standardu bez osoby, która będzie go utrzymywać.',
    'Nie uruchamiam automatycznej wysyłki ani zapisu w systemach w pierwszej próbie.',
    'Nie rekomenduję zmiany, gdy obecne narzędzie lub praca ręczna dają akceptowany wynik.',
  ],
  expertise: [
    { title: 'Praca i jakość', text: 'Analiza zadań, wymagania, kryteria oceny, standardy i odpowiedzialność za wynik.' },
    { title: 'Narzędzia i modele', text: 'LLM, kontekst, dobór narzędzi i ocena tego, co da się zrobić w istniejącym środowisku.' },
    { title: 'Architektura i decyzje', text: 'Agenci, automatyzacja, integracje i wiedza firmowa jako zaplecze oceny możliwości, kosztów oraz ograniczeń.' },
  ],
};

export const pageRoutes = ['/', '/materialy/przyklad-standardu/', '/analizy/od-odpowiedzi-do-wyniku/', '/analizy/kiedy-obecne-narzedzie-wystarczy/', '/prywatnosc/'];
