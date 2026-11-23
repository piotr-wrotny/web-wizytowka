// Public content. Replace only with founder-approved facts.
// Prices remain internal hypotheses and are intentionally not public.
export const site = {
  name: 'Piotr Wrotny',
  descriptor: 'Niezależny doradca AI',
  // The head of the service page (/konsultacja/). Headline approved by the founder on 2026-11-10; since 2026-11-23 it names
  // the offer there, and the home page opens with the visitor's situation instead (`story.hero`).
  // DRAFT 2026-11-22: `lead` re-written by the assistant as one statement of the offer; the path itself follows on the next screens.
  hero: {
    lines: ['Konsultacje AI', 'szyte na miarę.'],
    lead: 'Od pierwszej rozmowy do kompendium, które zostaje w firmie. Doradzam, nie wdrażam.',
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
  // DRAFT 2026-11-23: the home page is the visitor's story; the consultation is its resolution (founder decision 2026-11-23).
  // The visitor is the hero, addressed directly; nobody is invented. The papers of the market and the struck-out plan are
  // illustrations written by the assistant: they quote no offer, company or event, carry no numbers and must stay labelled.
  // The ending shows the recommendation of the synthetic sample compendium (same invented team as `compendium`).
  // Headline chosen by the founder on 2026-11-23; every other line awaits approval.
  story: {
    hero: {
      lines: ['Musisz coś zrobić z AI.', 'Tylko co?'],
      lead: 'Masz wrażenie, że konkurencja już korzysta, a rynek co tydzień ogłasza przełom.',
    },
    paperLabel: 'Przykład',
    papersNote: 'Papiery przykładowe. Nie cytują żadnej oferty, firmy ani wydarzenia.',
    papers: [
      { kind: 'Oferta dostawcy', claim: 'Asystent AI dla Twojej firmy. Oszczędność czasu już w pierwszym miesiącu.', query: 'zmierzona na czym?' },
      { kind: 'Newsletter', claim: 'Dziesięć narzędzi AI, które musisz znać w tym tygodniu.', query: 'do jakiego zadania?' },
      { kind: 'Zaproszenie', claim: 'AI w jeden dzień. Szkolenie z certyfikatem dla całego zespołu.', query: 'od jakiego poziomu?' },
      { kind: 'Notatka z zespołu', claim: 'Marketing korzysta z jednego narzędzia, sprzedaż z innego, księgowość z żadnego.', query: 'kto ustala zasady?' },
    ],
    chaos: {
      title: 'Rynek nie pomaga wybrać.',
      text: 'Każda oferta obiecuje oszczędność, każde narzędzie jest najlepsze, a w zespole każdy używa czegoś innego.',
      query: 'Żaden z tych papierów nie pyta, co przeszkadza w Twojej firmie.',
    },
    stake: {
      // DRAFT 2026-11-23 (second cut): the screen is the pressure itself, as the founder told it: AI shouting from everywhere,
      // the fridge included. The two reflexes moved into the pencil's note; the struck-out plan stays as the flat illustration.
      // Previous: 'Kupić coś na szybko albo czekać.' / 'Oba wyjścia kosztują. Narzędzie kupione na szybko nie ma zadania, które
      // miałoby wykonać. A kiedy firma czeka, zespół i tak korzysta z AI na własną rękę, bez wspólnych zasad.'
      title: 'AI krzyczy z każdej strony.',
      text: 'Z ofert, z newsletterów, z każdej aplikacji. Masz wrażenie, że zaraz wyskoczy z lodówki.',
      query: 'Kupić coś na szybko czy czekać? Oba odruchy zaczynają od narzędzia, nie od Twojej pracy.',
      plan: {
        title: 'Plan na AI, szkic',
        rows: [
          { text: 'Kupimy asystenta i zobaczymy, co z tego wyjdzie.', fix: 'narzędzie bez zadania' },
          { text: 'Poczekamy, aż rynek się uspokoi.', fix: 'zespół już korzysta, bez zasad' },
        ],
      },
    },
    turn: {
      title: 'Zacznij od swojej pracy, nie od rynku.',
      text: 'Konsultacja szyta na miarę zaczyna się od trzech pytań o Twoją firmę. Narzędzia przychodzą potem, jeśli w ogóle są potrzebne.',
      value: 'Doradzam, nie wdrażam, więc nie doradzam wdrożeń na zapas.',
      sheetLabel: 'Trzy pytania',
      // What the little man says in the film when he has had enough.
      say: 'Muszę to uporządkować.',
    },
    steps: {
      title: 'Cztery kroki od chaosu do decyzji.',
      items: [
        { title: 'Rozmowa', text: 'Wiesz, czy to temat na konsultację. Krótko i bezpłatnie.' },
        { title: 'Rozpoznanie', text: 'Twoje bolączki i program spotkania są na jednej karcie.' },
        { title: 'Konsultacja w firmie', text: 'Zespół widzi AI na własnych zadaniach, na danych demonstracyjnych.' },
        { title: 'Kompendium', text: 'Zostaje dokument z rekomendacją, od czego zacząć.' },
      ],
      action: 'Zobacz, jak przebiega konsultacja',
    },
    ending: {
      title: 'Na końcu wiesz, od czego zacząć.',
      text: 'Po konsultacji dostajesz kompendium. Porządkuje to, co padło na spotkaniu, i kończy się rekomendacją: od czego zacząć, co sprawdzić, co odpuścić.',
      value: 'Zamawiasz dokument, do którego zespół wraca, a nie godziny spotkania.',
      action: 'Zobacz przykładowe kompendium',
      sheet: { title: 'Kompendium: dział obsługi klienta', label: 'Przykład syntetyczny', part: 'Rekomendacja' },
    },
    later: {
      title: 'Jeszcze nie teraz?',
      text: 'Możesz najpierw poczytać. Przewodnik i analizy są otwarte, bez rozmowy.',
      link: 'Zobacz, jak przebiega konsultacja',
      sheet: { kind: 'links', title: 'Do przeczytania', label: 'Bez rozmowy' },
    },
  },
  nav: [
    { label: 'Konsultacja', href: '/konsultacja/' },
    { label: 'Sytuacje', href: '/#sytuacje' },
    { label: 'Przewodnik', href: '/przewodnik/' },
    { label: 'O mnie', href: '/#o-mnie' },
    { label: 'Kontakt', href: '/#kontakt' },
  ],
  // DRAFT 2026-11-22: the main use case, re-cut by the assistant to the client path approved by the founder on 2026-11-22
  // (~/Work/ai-ekspert/oferta/sciezka-klienta.md, stages 1-5): call, recognition and programme, consultation on site,
  // compendium, optional next step. It replaces the 2026-11-10 cut (recognition, material, presentation, meeting, documents).
  // Sheet contents are illustrative, not a record of an engagement. Wording awaits founder approval.
  // Founder decision 2026-11-23: the compendium ends with a recommendation (where to start, what to check, what to leave).
  // Since 2026-11-23 the path is shown on the service page (/konsultacja/); the home page tells the visitor's story.
  flow: {
    title: 'Jak przebiega konsultacja.',
    lead: 'Zanim cokolwiek wyjaśnię, ustalam z klientem, co najbardziej przeszkadza i od jakiego poziomu wiedzy zaczynamy. Wszystko, co dzieje się potem, jest przygotowane pod tę odpowiedź.',
    note: 'Przebieg poglądowy. Zawartość kart pokazuje rodzaj materiału; zakres i formę ustalamy przed rozpoczęciem.',
    // DRAFT 2026-11-22: the consultation in short. "Spotkanie pod potrzeby" and "dowolna liczba uczestników" come from the founder (2026-11-10); the rest is derived from the path.
    termsTitle: 'Konsultacja w skrócie',
    terms: [
      { title: 'Spotkanie pod potrzeby', text: 'Temat, poziom i przykłady wynikają z rozpoznania, nie z gotowego szkolenia.' },
      { title: 'Dowolna liczba uczestników', text: 'Jedna osoba, zespół albo kilka działów naraz.' },
      { title: 'Wasze zadania, dane demonstracyjne', text: 'Dwa lub trzy zastosowania z Waszej pracy, pokazane bez poufnych materiałów.' },
      { title: 'Kompendium na koniec', text: 'Wątki ze spotkania i z dyskusji, uporządkowane i rozwinięte, z rekomendacją na końcu.' },
    ],
    cta: { title: 'Zacznijmy od rozmowy.', text: 'Opisz, co dziś najbardziej przeszkadza. Odpowiem propozycją krótkiej, bezpłatnej rozmowy.', button: 'Opisz swoją sytuację' },
    // One theme per stage, 0 to 5. No blue here: the hero and the closing screen are the page's two blue fields.
    themes: ['paper', 'desk', 'ink', 'paper', 'desk', 'ink'],
    indexLabel: 'Etapy ścieżki klienta',
    // Stage 0 is open knowledge (free guide, analyses). Its sheet is a real index with links; the sheets of stages 1-5 are illustrative.
    stages: [
      {
        title: 'Wiedza otwarta',
        text: 'Zanim porozmawiamy, możesz po prostu poczytać: bezpłatny przewodnik po AI i narzędziach oraz analizy.',
        value: 'Sprawdzasz, jak myślę, zanim poświęcisz mi czas.',
        action: { label: 'Pobierz przewodnik', href: '/przewodnik/' },
        sheet: { kind: 'links', title: 'Do przeczytania', label: 'Bez rozmowy' },
      },
      {
        title: 'Rozmowa',
        text: 'Krótka, bezpłatna rozmowa. Sprawdzamy, czy temat mieści się w mojej roli, i nazywamy pierwsze bolączki.',
        value: 'Wiesz, czy konsultacja ma sens, zanim cokolwiek zamówisz.',
        action: { label: 'Opisz swoją sytuację', href: '/?temat=inne#kontakt' },
        sheet: { kind: 'questions', title: 'Pierwsza rozmowa', items: ['Co dziś najbardziej przeszkadza?', 'Kto miałby wziąć udział?', 'Jaki rezultat byłby użyteczny?'] },
      },
      {
        title: 'Rozpoznanie',
        text: 'Z Twoich odpowiedzi na kilka pytań powstaje Karta rozpoznania i program spotkania. Termin rezerwujemy, gdy zaakceptujesz program.',
        value: 'Wiesz, o czym będzie spotkanie, zanim zajmiesz czas zespołu.',
        sheet: { kind: 'card', title: 'Karta rozpoznania', rows: [['Problemy', 'Co dziś nie działa i gdzie ucieka czas.'], ['Bolączki', 'Co najbardziej przeszkadza w codziennej pracy.'], ['Program', 'Tematy spotkania, do akceptacji.']], scale: { label: 'Poziom wiedzy', from: 'początki', to: 'praktyka', steps: 5, at: 2 } },
      },
      {
        title: 'Konsultacja w firmie',
        text: 'Prezentacja prowadzi od wspólnych pojęć do realiów Twojej firmy. Pokazuję dwa lub trzy Wasze zastosowania na danych demonstracyjnych, potem dyskutujemy w grupie.',
        value: 'Zespół widzi AI na własnych zadaniach, bez wynoszenia poufnych danych.',
        sheet: { kind: 'slide', title: 'Prezentacja', heading: 'Od wspólnych pojęć do Waszych zadań', items: ['Wspólne pojęcia', 'Wasze zastosowania', 'Dyskusja w grupie'] },
      },
      {
        title: 'Kompendium',
        text: 'Po spotkaniu dostajesz kompendium: wątki ze spotkania i z dyskusji, uporządkowane i rozwinięte. Kończy się rekomendacją: od czego zacząć, co sprawdzić, co odpuścić.',
        action: { label: 'Zobacz przykładowe kompendium', href: '/materialy/przykladowe-kompendium/' },
        value: 'Zamawiasz dokument, do którego zespół wraca, a nie godziny spotkania.',
        sheet: { kind: 'contents', title: 'Kompendium', items: ['Wspólne pojęcia', 'Mapa narzędzi', 'Wasze zastosowania', 'Wątki z dyskusji', 'Rekomendacja'] },
      },
      {
        title: 'Dalej, jeśli warto',
        text: 'Na kompendium można skończyć. Jeśli warto iść dalej, możliwa jest kolejna konsultacja, Standard dla zespołu albo wskazanie, co warto wdrożyć.',
        value: 'Wdrożeń nie mam w ofercie, więc nie doradzam ich na zapas.',
        action: { label: 'Zobacz formaty współpracy', href: '#zakres' },
        sheet: { kind: 'list', title: 'Możliwe dalsze kroki', items: ['Kolejna konsultacja', 'Standard dla zespołu', 'Wskazanie, co warto wdrożyć', 'Nic więcej: kompendium wystarcza'] },
      },
    ],
  },
  // DRAFT 2026-11-22: stage 0 of the client path, "open knowledge". Written by the assistant from
  // ~/Work/ai-ekspert/oferta/sciezka-klienta.md. The guide (PDF) does not exist yet; its date, the update terms,
  // the e-mail delivery and the consents are open founder decisions. The form on /przewodnik/ is a local demonstration.
  // The stack list is a proposal: every item is a block the founder has to write, date and maintain.
  guide: {
    path: '/przewodnik/',
    title: 'Dowiedz się o AI i narzędziach.',
    lead: 'Bezpłatny przewodnik, który wyrównuje słownictwo przed pierwszą rozmową: co AI potrafi, czego nie i jak nazwać to, z czego już korzystasz.',
    meta: ['PDF', 'Bezpłatny, za adres e-mail', 'Wydanie w przygotowaniu'],
    jump: 'Pobierz przewodnik',
    contentsTitle: 'Co jest w środku',
    chapters: [
      { title: 'Co AI potrafi, a czego nie', text: 'Gdzie model pomaga, gdzie zgaduje i po czym to poznać.' },
      { title: 'Mapa narzędzi', text: 'Asystenci, środowiska pracy i automatyzacje: co jest czym i do czego służy.' },
      { title: 'Jak dawać AI kontekst', text: 'Co model musi dostać, żeby wynik dało się zaakceptować.' },
      { title: 'Od czatu do agenta', text: 'Czat, asystent, przepływ pracy, agent: cztery poziomy i kiedy który ma sens.' },
      { title: 'Słownik', text: 'Pojęcia, które wracają w rozmowach o AI, wyjaśnione zwykłym językiem.' },
    ],
    // Dated and updated: said by the document itself, in the foot of its contents sheet.
    tocFoot: 'Każde wydanie ma datę stanu. Nowe powstaje, gdy zmienia się coś istotnego.',
    pending: 'przewodnik (PDF), data wydania, zasady aktualizacji oraz rzeczywista wysyłka.',
    // The form is the e-mail itself: ticking a tool writes its block into the letter below, the address goes in the "Do:" line.
    form: {
      title: 'Pobierz przewodnik.',
      intro: 'Zaznacz, z czego korzystasz, i zobacz, co dopisuje się do maila. Adres podajesz na końcu.',
      note: 'To demonstracja: mail składa się w tej karcie, nic nie jest wysyłane ani zapisywane.',
      stackLegend: 'Z czego korzystasz?',
      stackHint: 'Możesz zaznaczyć kilka pozycji albo żadnej.',
      groups: [
        { id: 'asystent', title: 'Asystent lub agent', items: ['ChatGPT', 'Microsoft Copilot', 'Gemini', 'Claude'] },
        { id: 'srodowisko', title: 'Środowisko pracy', items: ['Microsoft 365', 'Google Workspace'] },
        { id: 'automatyzacje', title: 'Automatyzacje', items: ['Power Automate', 'Zapier', 'Make', 'n8n'] },
      ],
      none: 'Nie wiem albo nie korzystam',
      mailTitle: 'Twój mail',
      subject: 'Przewodnik po AI i narzędziach',
      addressNote: 'Adres służy do wysłania przewodnika. Bez newslettera.',
      guideRow: 'Przewodnik (PDF)',
      guideSub: 'Pięć rozdziałów, z datą stanu. W przygotowaniu.',
      blockLabel: 'Omówienie',
      blockParts: 'W każdym omówieniu: co to jest, do czego się nadaje, co nowego (z datą), ograniczenia i poufność, jeden praktyczny tip.',
      noteRow: 'Dopisek: co ten zestaw daje razem',
      noteTag: 'Wygenerowany automatycznie, wyłącznie z omówień powyżej.',
      noneRow: 'Bez omówień narzędzi',
      noneSub: 'Dobry początek: rozdział „Mapa narzędzi”.',
      emptyHint: 'Zaznacz narzędzie powyżej, a jego omówienie dopisze się tutaj.',
      updates: 'Chcę dostać wiadomość, gdy przewodnik albo zaznaczone narzędzia istotnie się zmienią. To osobna zgoda; można ją wycofać.',
      button: 'Sprawdź adres',
      doneTitle: 'Adres jest poprawny.',
      doneText: 'W działającej wersji ten mail trafiłby teraz do Ciebie. Dziś nic nie zostało wysłane ani zapisane.',
    },
    next: { title: 'Wolisz najpierw zobaczyć efekt końcowy?', text: 'Kompendium to dokument, który zostaje po konsultacji. Przykład jest w całości syntetyczny.', button: 'Zobacz przykładowe kompendium', link: 'Zobacz całą ścieżkę' },
  },
  // DRAFT 2026-11-22: a synthetic sample compendium, written by the assistant. The team, the meeting and every detail are invented
  // and unrelated to any engagement; no model was run. It shows the structure only (general modules + client chapters)
  // DRAFT 2026-11-23: since the founder decided that the compendium ends with a recommendation, the sample closes with one,
  // written by the assistant for the same invented team. The home page shows these three rows as the ending of the story.
  compendium: {
    path: '/materialy/przykladowe-kompendium/',
    title: 'Kompendium po konsultacji: dział obsługi klienta.',
    lead: 'Przykład dokumentu, który zostaje po spotkaniu: moduły ogólne i rozdziały napisane dla jednej firmy.',
    boundary: 'Zespół, spotkanie i wszystkie szczegóły są zmyślone. Nie opisują zlecenia ani klienta; nie uruchamiano żadnego modelu.',
    intro: [
      'Kompendium porządkuje i rozwija to, o czym była mowa na spotkaniu, razem z wątkami, które pojawiły się dopiero w dyskusji. Uczestnicy dostają je po konsultacji i mogą do niego wracać.',
      'Ma dwie części. Moduły ogólne pochodzą z tej samej bazy co przewodnik i są dobierane do poziomu zespołu. Rozdziały klienta powstają dla jednej firmy: opisują jej zastosowania pokazane na danych demonstracyjnych oraz to, co wyszło w rozmowie. Na końcu jest rekomendacja: od czego zacząć, co sprawdzić, co odpuścić.',
    ],
    contentsTitle: 'Spis treści przykładu',
    parts: [
      { title: 'Moduły ogólne', items: ['Co AI potrafi, a czego nie', 'Jak dawać AI kontekst', 'Od czatu do agenta', 'Słownik'] },
      { title: 'Rozdziały klienta', items: ['Odpowiedź na zgłoszenie na podstawie bazy wiedzy', 'Streszczenie długiego zgłoszenia przy przekazaniu sprawy', 'Wątki z dyskusji', 'Otwarte pytania', 'Rekomendacja'] },
    ],
    excerptTitle: 'Fragment rozdziału klienta',
    excerptLead: 'Tak wygląda jeden rozdział: sytuacja zespołu, to, co pokazano na spotkaniu, i to, co wyszło w dyskusji.',
    excerptSheet: 'Odpowiedź na zgłoszenie na podstawie bazy wiedzy',
    excerpt: [
      ['Sytuacja', 'Konsultanci odpowiadają na powtarzalne pytania, korzystając z bazy wiedzy. Część artykułów jest nieaktualna, a odpowiedzi różnią się między osobami.'],
      ['Pokazane na spotkaniu', 'Szkic odpowiedzi przygotowany wyłącznie z artykułów bazy wiedzy, z przytoczeniem artykułu przy każdym zdaniu. Materiał: trzy zmyślone zgłoszenia i sześć zmyślonych artykułów.'],
      ['Przypadek graniczny', 'Na jedno ze zgłoszeń baza nie zawiera odpowiedzi. Poprawny szkic to „brak w źródłach, przekaż do drugiej linii”, a nie zgadywanie.'],
      ['Z dyskusji', 'Kto odpowiada za aktualność artykułów. Czy szkic może trafić do klienta bez przeczytania przez konsultanta. Co zrobić ze zgłoszeniami, w których klient podaje dane osobowe.'],
      ['Otwarte', 'Które kategorie zgłoszeń nadają się do pierwszej próby i kto zatwierdza zmiany w bazie wiedzy.'],
    ],
    excerptLabel: 'Rozdział 5 z 9, przykład',
    recommendationTitle: 'Rekomendacja',
    recommendationLead: 'Tak kończy się kompendium: trzy krótkie odpowiedzi, które wynikają z rozdziałów powyżej.',
    recommendationLabel: 'Rozdział 9 z 9, przykład',
    // `text` is the row shown on the home page; the sample page adds `more`.
    recommendation: [
      { label: 'Zacząć od', text: 'Szkiców odpowiedzi z bazy wiedzy w jednej kategorii zgłoszeń.', more: 'Konsultant czyta każdy szkic przed wysłaniem.' },
      { label: 'Sprawdzić', text: 'Kto odpowiada za aktualność artykułów w tej kategorii.', more: 'Bez tego szkice powtarzają stare informacje.' },
      { label: 'Odpuścić', text: 'Zakup nowego asystenta, dopóki źródła nie są uporządkowane.', more: 'Na razie także zgłoszenia z danymi osobowymi.' },
    ],
    closing: 'W prawdziwym kompendium każdy rozdział klienta jest rozwinięty do kilku stron, a moduły ogólne mają datę stanu, tak jak przewodnik.',
    guideLink: 'Moduły ogólne mają ten sam układ co przewodnik',
  },
  // DRAFT 2026-11-09: illustrative situations. Generic roles, no clients, no outcomes. Wording awaits founder approval.
  cases: {
    // DRAFT 2026-11-23: on the home page the situations are the visitor's own version of the story, so the title asks.
    // Previous title (kept in the knowledge base as the section name): 'Od czego zaczynają klienci.'
    title: 'Która sytuacja jest Twoja?',
    // DRAFT 2026-11-22: shortened to one sentence. Previous intro: 'Pierwsza wersja jest gotowa, ale senior nadal poprawia fakty, dopowiada kontekst i porządkuje wynik. Każda osoba pracuje inaczej. Trudno powiedzieć, kiedy rezultat jest dobry i kto go zatwierdza. Konsultacja zaczyna się od nazwania tej sytuacji.'
    intro: 'Osiem przykładowych sytuacji i pytanie, od którego zaczęłoby się rozpoznanie.',
    note: 'Sytuacje przykładowe. Pokazują rodzaj pytania i dobór formatu; nie opisują zleceń ani klientów.',
    panelFirst: 'Od tego zaczynamy rozpoznanie',
    panelCta: 'Opisz podobną sytuację',
    items: [
      { role: 'Zespół na początku drogi', situation: 'Firma chce zacząć korzystać z AI, ale poziom wiedzy w zespole jest różny, a oczekiwania niejasne.', question: 'Od czego zacząć, kiedy każdy wie o AI co innego?', format: 'Konsultacja szyta na miarę', first: 'Kto czego już próbował, jakie są obawy i jaki pierwszy rezultat byłby użyteczny.' },
      { role: 'Zespół sprzedaży', situation: 'Notatki po rozmowach z klientami powstają w kilku formach, a podsumowania dla opiekunów wymagają poprawek seniora.', question: 'Czy AI może przygotować robocze podsumowanie bez dopisywania ustaleń, których nie było?', format: 'Standard dla zespołu', first: 'Jak dziś powstaje podsumowanie, kto je poprawia i który błąd jest niedopuszczalny.' },
      { role: 'Obsługa klienta', situation: 'Odpowiedzi na zgłoszenia korzystają z bazy wiedzy, która jest częściowo nieaktualna. Rozważany jest zakup nowego asystenta.', question: 'Czy luka jest w narzędziu, czy w źródłach i sposobie pracy?', format: 'Jedna decyzja', first: 'Skąd pochodzą odpowiedzi, kto aktualizuje bazę wiedzy i czego oczekujecie od asystenta.' },
      { role: 'Zarząd lub właściciel', situation: 'Na stole leży oferta dostawcy rozwiązania AI z obietnicą oszczędności i terminem decyzji.', question: 'Które założenia oferty da się sprawdzić przed podpisaniem i czego w niej brakuje?', format: 'Przegląd oferty', first: 'Jaką decyzję trzeba podjąć, do kiedy i które obietnice oferty są dla niej kluczowe.' },
      { role: 'Analizy i raportowanie', situation: 'Miesięczny raport składa się z danych z kilku systemów. AI ma pomóc w opisie, ale nikt nie mierzy, ile czasu faktycznie oszczędza.', question: 'Jak ustawić baseline i próbę, żeby decyzja opierała się na pomiarze?', format: 'Standard dla zespołu', first: 'Ile trwa raport dziś, kto go sprawdza i co uznacie za poprawę.' },
      { role: 'HR i rekrutacja', situation: 'Streszczenia kandydatur i notatki z rozmów mają powstawać z pomocą AI. Pojawia się pytanie o dane osobowe i granice użycia.', question: 'Co wolno przekazać narzędziu, a co musi zostać przy człowieku?', format: 'Jedna decyzja, potem standard', first: 'Jakie dane trafiają do notatek, kto ma do nich dostęp i jakie zasady już obowiązują.' },
      { role: 'Marketing i treści', situation: 'Teksty powstają szybciej, ale brzmią podobnie i wymagają długiej redakcji przed publikacją.', question: 'Jak ustawić pracę z AI, żeby redakcja była krótsza, a głos marki pozostał własny?', format: 'Standard dla zespołu', first: 'Jak wygląda droga tekstu od briefu do publikacji i gdzie dziś ucieka czas.' },
      { role: 'IT i bezpieczeństwo', situation: 'Pracownicy korzystają z różnych narzędzi AI na własną rękę. Brakuje wspólnych zasad.', question: 'Od jakich zasad zacząć, żeby nie blokować pracy i nie tracić kontroli nad danymi?', format: 'Jedna decyzja', first: 'Z jakich narzędzi faktycznie korzystają zespoły i jakie dane mogą do nich trafiać.' },
    ],
  },
  // DRAFT 2026-11-22: the contact form is the card of the first conversation: the three questions of stage 1, answered in writing.
  // A local demonstration: it validates and shows a draft; nothing is sent.
  contact: {
    title: 'Opisz swoją sytuację.',
    text: 'To te same trzy pytania, od których zaczyna się pierwsza rozmowa. Odpowiem propozycją krótkiej, bezpłatnej rozmowy.',
    note: 'Wystarczy ogólny opis. Nie wpisuj danych klientów, haseł ani poufnych dokumentów.',
    pending: 'adres e-mail i termin odpowiedzi.',
    sheetTitle: 'Pierwsza rozmowa',
    replyLabel: 'Odpowiedź na:',
    button: 'Sprawdź kartę',
    topics: { zadanie: 'Standard dla zespołu', decyzja: 'Jedna decyzja', oferta: 'Przegląd oferty' },
    hint: 'Zadanie lub decyzja, obecne narzędzie i główna trudność.',
  },
  formats: {
    title: 'Trzy formaty. Zakres ustalamy razem.',
    // DRAFT 2026-11-22: lead re-written so the formats sit beside the full consultation path instead of competing with it.
    lead: 'Pełna konsultacja kończy się kompendium. Gdy pytanie jest węższe albo idziemy krok dalej, wystarcza jeden z trzech formatów. Każdy kończy się zapisem: rekomendacją, standardem albo oceną oferty.',
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
  // Example standard, shown in full on the sample page (linked from the "Standard dla zespołu" format).
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
  // Not rendered on the home page since 2026-11-10: the consultation flow is the one process shown there.
  method: [
    { title: 'Zrozumienie pracy', text: 'Ustalamy, jaki wynik ma zostać zaakceptowany, skąd pochodzą informacje, co wymaga poprawiania i kto odpowiada za zadanie.' },
    { title: 'Projekt i próba', text: 'Porównujemy sensowne alternatywy. Projektujemy wejście, instrukcję i kontrolę jakości. Sprawdzamy uzgodnione przypadki; błąd krytyczny zatrzymuje daną ścieżkę.' },
    { title: 'Przekazanie i decyzja', text: 'Operator odtwarza metodę, a właściciel przejmuje standard. Po użyciu decydujemy: stosować, zmienić, odrzucić albo zebrać brakujące dane.' },
  ],
  methodClosing: 'Dobra rekomendacja może oznaczać także wykorzystanie obecnego narzędzia lub rezygnację ze zmiany.',
  // DRAFT 2026-11-09: derived from conditions, boundaries and method above. Wording awaits founder approval.
  // Since 2026-11-22 shown on its own page (/czego-nie-robie/), linked from the person section and the footer.
  principlesPath: '/czego-nie-robie/',
  principlesTitle: 'Czego nie robię',
  principlesLead: 'Pięć rzeczy, których nie robię, żeby rekomendacja dała się obronić.',
  principlesCta: 'Zamiast tego zaczynam od Twojego zadania.',
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

export const pageRoutes = ['/', '/konsultacja/', '/przewodnik/', '/czego-nie-robie/', '/materialy/przykladowe-kompendium/', '/materialy/przyklad-standardu/', '/analizy/od-odpowiedzi-do-wyniku/', '/analizy/kiedy-obecne-narzedzie-wystarczy/', '/prywatnosc/'];
