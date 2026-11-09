// Public content. Replace only with founder-approved facts.
// Prices remain internal DR07 hypotheses and are intentionally not public.
export const site = {
  name: '[IMIĘ I NAZWISKO]',
  descriptor: 'Niezależny doradca AI',
  hero: {
    lines: ['Od odpowiedzi AI', 'do dobrze', 'wykonanej pracy.'],
    lead: 'Pomagam zespołom uporządkować pracę z AI.\nŁączę ocenę technologii, kryteria jakości\ni praktyczną próbę jednego zadania.',
  },
  nav: [
    { label: 'Współpraca', href: '/#wspolpraca' },
    { label: 'Podejście', href: '/#podejscie' },
    { label: 'O mnie', href: '/#o-mnie' },
    { label: 'Kontakt', href: '/#kontakt' },
  ],
  workflow: {
    name: 'Jeden sposób pracy z AI',
    subtitle: 'Standard, próba i przekazanie zespołowi.',
    intro: 'Jedno powtarzalne zadanie w zatwierdzonym narzędziu.\nJasne zasady, kontrola jakości i właściciel procesu.',
    situation: [
      'Pierwsza wersja jest gotowa, ale senior nadal poprawia fakty, dopowiada kontekst i porządkuje wynik. Każda osoba pracuje inaczej. Trudno powiedzieć, kiedy rezultat jest dobry i kto go zatwierdza.',
      'Jeśli rozpoznajesz tę sytuację, zacznijmy od jednego zadania. Ustalimy, co przeszkadza w jego wykonaniu i jaką zmianę warto sprawdzić.',
    ],
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
    boundaryNote: 'Zakres, cenę i terminy potwierdzam przed rozpoczęciem współpracy.',
  },
  consultation: {
    name: 'Konsultacja jednej decyzji AI',
    subtitle: 'Rozmowa i pisemna rekomendacja.',
    text: 'Rozważasz dwa rozwiązania, nie wiesz, co sprawdzić przed zakupem, albo chcesz zrozumieć nieudaną próbę? Porządkujemy jedno pytanie, dostępne fakty i kompromisy.',
    outcome: 'Po 60-minutowej sesji otrzymujesz krótką rekomendację z uzasadnieniem, niewiadomymi i następnym krokiem.',
    details: [
      'Sesja 60 minut, maksymalnie dwóch uczestników i do pięciu stron materiału. Dopasowanie sprawdzamy przed rezerwacją.',
      'Memo 1–2 strony do dwóch dni roboczych: rekomendacja, uzasadnienie, niewiadome i następny krok. Jedna zbiorcza odpowiedź do tego samego pytania w ciągu pięciu dni roboczych.',
      'Rozległy research, ocena dużej oferty, konfiguracja zespołu i test działającego systemu wymagają osobnego ustalenia. Konsultacja jest samodzielną usługą; nie trzeba jej kupować przed pracą z zespołem.',
    ],
    review: 'Niezależny przegląd jednej oferty AI: jej założeń, kosztów, dowodów i warunków decyzji. To ocena dokumentów; test działającego systemu wymaga osobnego ustalenia.',
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
