// Two analyses. Block types: paragraph, heading, pull (pull quote taken from the text), table.
// `theses` and `terms` were added on 2026-11-09 as DRAFT: theses summarise the existing text, terms point to glossary.js.
export const articles = [
  {
    slug: 'od-odpowiedzi-do-wyniku',
    title: 'Szybsza odpowiedź AI nie oznacza krótszej pracy',
    kind: 'Analiza',
    date: '29.10.2026',
    lead: 'Liczy się droga do zaakceptowanego wyniku: przygotowanie, kontrola, poprawki i wyjątki.',
    theses: [
      'Czas powstania pierwszej wersji to najmniej ważna liczba. Liczy się nakład do zaakceptowanego wyniku.',
      'Zanim porównasz metody, zapisz, kiedy zadanie jest skończone i który błąd je blokuje.',
      'Sprawdź, komu zmieniła się praca. Oszczędność operatora może być kosztem seniora.',
    ],
    terms: ['baseline', 'blad-krytyczny', 'proba'],
    blocks: [
      { type: 'paragraph', text: 'Najłatwiej zobaczyć czas, w którym AI tworzy pierwszą wersję. Trudniej zauważyć pracę, która zaczyna się chwilę później: sprawdzanie faktów, uzupełnianie kontekstu, poprawianie liczb i dopasowanie materiału do odbiorcy. Właśnie tam może przenieść się koszt zadania.' },
      { type: 'paragraph', text: 'Dlatego pytanie „jak szybko powstała odpowiedź?” jest za wąskie. Użyteczniejsze brzmi: „ile pracy potrzebowaliśmy, żeby zaakceptować wynik?”. Odpowiedź powinna obejmować przygotowanie wejścia, wykonanie, kontrolę, poprawki oraz wyjątki. Gdy w procesie uczestniczą trzy osoby, ich czas liczymy osobno. Oczekiwanie na odpowiedź zapisujemy jako czas kalendarzowy, nie jako godziny pracy ludzi.' },
      { type: 'heading', text: 'Najpierw określ zakończenie zadania' },
      { type: 'paragraph', text: '„Powstało podsumowanie” i „opiekun może użyć podsumowania” to dwa różne stany. W pierwszym wystarczy tekst. W drugim potrzebna jest zgodność ze źródłem, kompletność ustaleń i brak dopisanych zobowiązań. Bez takiej definicji łatwo porównać ręcznie sprawdzony dokument z niesprawdzoną generacją.' },
      { type: 'paragraph', text: 'Warto więc przed próbą zapisać kilka obserwowalnych kryteriów. Czy każda liczba ma źródło? Czy niewiadome pozostają niewiadomymi? Kto akceptuje treść? Który błąd blokuje dalsze użycie niezależnie od tego, jak dobrze napisano pozostałe akapity?' },
      { type: 'heading', text: 'Zmierz drogę do akceptacji' },
      { type: 'paragraph', text: 'Załóżmy, wyłącznie na potrzeby przykładu, że ręczne przygotowanie i sprawdzenie materiału zajmuje łącznie 24 minuty. Z AI przygotowanie wejścia zajmuje 4 minuty, wykonanie 2, kontrola 8, a poprawki 12. Łącznie to 26 minut. Zapisanie samego czasu wykonania dałoby przekonujący, ale mylący obraz poprawy.' },
      {
        type: 'table',
        caption: 'Liczby przykładowe, nie pomiar. Pokazują, jak granica pomiaru zmienia wniosek.',
        head: ['Etap', 'Ręcznie', 'Z AI'],
        rows: [
          ['Przygotowanie wejścia', '', '4 min'],
          ['Wykonanie', '', '2 min'],
          ['Kontrola', '', '8 min'],
          ['Poprawki', '', '12 min'],
          ['Razem do akceptacji', '24 min', '26 min'],
        ],
      },
      { type: 'paragraph', text: 'Ten przykład nie dowodzi, że AI spowalnia pracę. Pokazuje, jak wybór granicy pomiaru może zmienić wniosek. Ten sam proces może działać lepiej po poprawie wejścia, ograniczeniu zakresu albo ustaleniu, czego narzędzie nie powinno robić. Potrzebujemy porównywalnych zadań i jawnego zapisu, a nie z góry przyjętego kierunku efektu.' },
      { type: 'pull', text: 'Dobry wynik po intensywnej korekcie nie oznacza dobrego wyniku pierwszej generacji.' },
      { type: 'paragraph', text: 'Jeśli kontrola obejmuje już poprawki, nie dodawaj ich ponownie. Nie pomijaj nieudanych prób. Zachowaj informację o wersji narzędzia i trudności zadania. Dobry wynik po intensywnej korekcie nie oznacza dobrego wyniku pierwszej generacji.' },
      { type: 'heading', text: 'Sprawdź, komu zmieniła się praca' },
      { type: 'paragraph', text: 'Możliwe, że operator kończy wcześniej, ale senior spędza więcej czasu na recenzji. Możliwe też, że wynik jest lepszy, choć czas pozostaje podobny. Obie sytuacje mogą mieć znaczenie dla firmy, jeśli zostaną opisane uczciwie. Sama liczba wygenerowanych dokumentów nie pozwoli ich rozróżnić.' },
      { type: 'paragraph', text: 'Przy małej próbie zapisuj liczebność, zakres zadań i wyjątki. Brak błędu krytycznego w kilku przykładach nie jest dowodem niezawodności całego rozwiązania. Odzyskany czas oznacza potencjalną zdolność do innej pracy; nie staje się automatycznie oszczędnością gotówki.' },
      { type: 'heading', text: 'Decyzja może dotyczyć sposobu pracy' },
      { type: 'paragraph', text: 'Pierwszym krokiem nie musi być zmiana modelu. Czasem potrzebne jest lepsze źródło, krótsze zadanie, jasne wejście lub wcześniejsza kontrola. Czasem najrozsądniejsza będzie praca ręczna. Właściwa decyzja wynika z jakości zaakceptowanego wyniku i całego nakładu, który był potrzebny do jego uzyskania.' },
      { type: 'paragraph', text: 'Przed kolejną próbą wybierz jedno zadanie, nazwij koniec procesu i zapisz kryteria. Dopiero potem porównaj metody. To skromniejszy początek niż deklaracja transformacji, ale daje podstawę do rzeczywistego wniosku.' },
    ],
  },
  {
    slug: 'kiedy-obecne-narzedzie-wystarczy',
    title: 'Kiedy obecne narzędzie wystarczy',
    kind: 'Analiza',
    date: '29.10.2026',
    lead: 'Nowy zakup ma sens, gdy wiadomo, czego brakuje i jak sprawdzić tę różnicę.',
    theses: [
      '„Potrzebujemy asystenta” to kilka różnych potrzeb. Każda wymaga innej oceny.',
      'Oddziel brak funkcji od braku sposobu pracy. Drugiego nie naprawi zakup.',
      'Porównuj trzy warianty na tym samym zadaniu: bez zakupu, obecne środowisko, nowe narzędzie.',
    ],
    terms: ['wlasciciel-procesu', 'proba', 'standard'],
    blocks: [
      { type: 'paragraph', text: 'Pomysł na nowe narzędzie często pojawia się wcześniej niż opis zadania. „Potrzebujemy asystenta” brzmi konkretnie, ale może oznaczać kilka różnych potrzeb: uporządkowanie wejścia, dostęp do źródeł, przygotowanie pierwszej wersji albo wykonanie działania w systemie. Każda z nich wymaga innej oceny.' },
      { type: 'paragraph', text: 'Zanim porównasz produkty, zapisz, od czego zaczyna się praca i jaki wynik ktoś ma zaakceptować. Wskaż materiały, częstotliwość, osobę odpowiedzialną i koszt błędu. Wtedy łatwiej sprawdzić, czy posiadane środowisko ma rzeczywistą lukę.' },
      { type: 'heading', text: 'Oddziel brak funkcji od braku sposobu pracy' },
      { type: 'paragraph', text: 'Wyobraźmy sobie zespół, który chce nowego asystenta do przygotowywania roboczych odpowiedzi. Każda osoba korzysta jednak z innych źródeł, a część materiałów jest nieaktualna. Nie ma wspólnego formatu ani reguły, co zrobić przy braku ceny lub terminu.' },
      { type: 'paragraph', text: 'Nowe narzędzie może mieć lepsze możliwości. Nie zastąpi jednak decyzji o tym, które źródło jest właściwe i kto zatwierdza zobowiązanie. Przed zakupem warto sprawdzić, ile problemów znika po uporządkowaniu wejścia, wzoru odpowiedzi oraz kontroli w obecnym narzędziu.' },
      { type: 'paragraph', text: 'To nie jest założenie, że zawsze należy pozostać przy tym, co już kupiono. Obecne rozwiązanie może nie spełniać wymagań dotyczących dostępu, danych lub potrzebnej czynności. Ważne, aby brak został nazwany i poparty sprawdzeniem, zamiast wynikać tylko z atrakcyjnej demonstracji innego produktu.' },
      { type: 'heading', text: 'Porównaj trzy sensowne warianty' },
      { type: 'paragraph', text: 'Pierwszy wariant to brak nowego zakupu: zmiana organizacji pracy lub sposób ręczny. Drugi to użycie funkcji dostępnej w obecnym środowisku. Trzeci to nowe rozwiązanie o jasno określonej przewadze. Każdy powinien dotyczyć tego samego zadania i tych samych kryteriów jakości.' },
      { type: 'pull', text: 'Nazwa produktu nie przesądza dostępności funkcji. Deklaracja dostawcy opisuje możliwość; próba na właściwym materiale pokazuje przydatność.' },
      { type: 'paragraph', text: 'Przy obecnym środowisku sprawdź rzeczywisty plan, konfigurację, uprawnienia i dozwolone dane na koncie klienta. Nazwa produktu nie przesądza dostępności funkcji. Deklaracja dostawcy opisuje możliwość; próba na właściwym materiale pomaga ocenić jej przydatność w danym zadaniu.' },
      { type: 'paragraph', text: 'W nowym wariancie policz więcej niż abonament. Znaczenie mają przygotowanie materiałów, wdrożenie ludzi, recenzja, obsługa wyjątków, właściciel techniczny i wyjście z rozwiązania. Gdy pojawiają się integracje albo automatyczne działania, rośnie także zakres odpowiedzialności operacyjnej.' },
      { type: 'heading', text: 'Nazwij powód zmiany' },
      { type: 'paragraph', text: 'Dobra decyzja zakupowa powinna dać się zapisać jednym zdaniem: „wybieramy ten wariant, ponieważ usuwa wskazane ograniczenie i spełnił uzgodnione kryteria”. Obok warto dopisać, czego jeszcze nie sprawdzono oraz kiedy wniosek należy odświeżyć.' },
      { type: 'paragraph', text: 'Jeżeli obecne narzędzie daje wystarczający, akceptowany wynik w rozsądnym koszcie, zakup może poczekać. Jeśli go nie daje, mamy opis luki, który pomoże porównać oferty i uniknąć szukania całego problemu od początku.' },
      { type: 'paragraph', text: 'Niezależna ocena nie musi kończyć się wyborem nowości. Powinna kończyć się jasną decyzją oraz dowodem, na którym ta decyzja się opiera.' },
    ],
  },
];

const months = ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'];
export function formatDate(d) {
  const [day, month, year] = d.split('.');
  return `${Number(day)} ${months[Number(month) - 1]} ${year}`;
}
export function readingMinutes(blocks) {
  const words = blocks.filter(b => b.text).map(b => b.text).join(' ').split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}
