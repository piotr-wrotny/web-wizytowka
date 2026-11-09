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
    ],
    boundaries: [
      'Nowe integracje i API, kod produkcyjny, automatyczne wysyłki lub zapis w systemach, migracja i administracja wymagają osobnego zakresu.',
      'Usługa nie obejmuje RAG, całofirmowej polityki, formalnej certyfikacji, incydentów, utrzymania ani otwartego czatu po zakończeniu.',
      'Przekazuję uzgodniony standard, próbę i ocenę. Wynik może prowadzić także do zmiany metody, pozostania przy obecnej lub rezygnacji z AI w tym zadaniu.',
    ],
  },
  consultation: {
    name: 'Konsultacja jednej decyzji AI',
    subtitle: 'Rozmowa i pisemna rekomendacja.',
    text: 'Rozważasz dwa rozwiązania, nie wiesz, co sprawdzić przed zakupem, albo chcesz zrozumieć nieudaną próbę? Porządkujemy jedno pytanie, dostępne fakty i kompromisy.',
    details: [
      'Sesja 60 minut, maksymalnie dwóch uczestników i do pięciu stron materiału. Dopasowanie sprawdzamy przed rezerwacją.',
      'Memo 1–2 strony do dwóch dni roboczych: rekomendacja, uzasadnienie, niewiadome i następny krok. Jedna zbiorcza odpowiedź do tego samego pytania w ciągu pięciu dni roboczych.',
      'Rozległy research, ocena dużej oferty, konfiguracja zespołu i test działającego systemu wymagają osobnego ustalenia. Konsultacja jest samodzielną usługą; nie trzeba jej kupować przed pracą z zespołem.',
    ],
  },
  method: [
    { title: 'Zrozumienie pracy', text: 'Ustalamy, jaki wynik ma zostać zaakceptowany, skąd pochodzą informacje, co wymaga poprawiania i kto odpowiada za zadanie.' },
    { title: 'Projekt i próba', text: 'Porównujemy sensowne alternatywy. Projektujemy wejście, instrukcję i kontrolę jakości. Sprawdzamy uzgodnione przypadki; błąd krytyczny zatrzymuje daną ścieżkę.' },
    { title: 'Przekazanie i decyzja', text: 'Operator odtwarza metodę, a właściciel przejmuje standard. Po użyciu decydujemy: stosować, zmienić, odrzucić albo zebrać brakujące dane.' },
  ],
  expertise: [
    { title: 'Praca i jakość', text: 'Analiza zadań, wymagania, kryteria oceny, standardy i odpowiedzialność za wynik.' },
    { title: 'Narzędzia i modele', text: 'LLM, kontekst, dobór narzędzi i ocena tego, co da się zrobić w istniejącym środowisku.' },
    { title: 'Architektura i decyzje', text: 'Agenci, automatyzacja, integracje i wiedza firmowa jako zaplecze oceny możliwości, kosztów oraz ograniczeń.' },
  ],
};

export const pageRoutes = ['/', '/materialy/przyklad-standardu/', '/analizy/od-odpowiedzi-do-wyniku/', '/analizy/kiedy-obecne-narzedzie-wystarczy/', '/prywatnosc/'];
