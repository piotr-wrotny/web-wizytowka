import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowLeft, CaretDown, Copy, Check } from '@phosphor-icons/react';
import { site } from './content/site';
import { articles } from './content/articles';

const samplePath = '/materialy/przyklad-standardu/';

export function getPageMeta(path) {
  const article = articles.find(a => path === `/analizy/${a.slug}/`);
  if (article) return { title: `${article.title} — ${site.descriptor}`, description: article.lead };
  if (path === samplePath) return { title: 'Przykład standardu pracy z AI — dane syntetyczne', description: 'Otwarta demonstracja metody: wejście, kontrola faktów, odpowiedzialność i warunki przerwania pracy.' };
  if (path === '/prywatnosc/') return { title: 'Prywatność prototypu — niezależny doradca AI', description: 'Jak działa demonstracyjny kontakt i co wymaga uzupełnienia przed uruchomieniem obsługi zapytań.' };
  return { title: `${site.name} — niezależny doradca AI`, description: 'Pomoc w uporządkowaniu jednego sposobu pracy z AI i w konkretnych decyzjach technologicznych. Standard, próba i pisemne rekomendacje.' };
}

function Eyebrow({ children, line = false, className = '' }) {
  return <p className={`eyebrow ${line ? 'eyebrow-line' : ''} ${className}`}>{children}</p>;
}

function TextLink({ href, children, className = '', onClick, arrow = true }) {
  return <a className={`text-link ${className}`} href={href} onClick={onClick}><span>{children}</span>{arrow && <ArrowRight weight="light" aria-hidden="true" />}</a>;
}

function Header() {
  const [open, setOpen] = useState(false);
  const toggle = useRef(null);
  const navRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    function keyDown(event) {
      if (event.key === 'Escape') { setOpen(false); toggle.current?.focus(); }
    }
    function outside(event) {
      if (!navRef.current?.contains(event.target) && !toggle.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('keydown', keyDown);
    document.addEventListener('pointerdown', outside);
    return () => { document.removeEventListener('keydown', keyDown); document.removeEventListener('pointerdown', outside); };
  }, [open]);
  return <>
    <a className="skip-link" href="#tresc">Przejdź do treści</a>
    <header className="site-header outer-frame" id="gora">
      <div className="header-inner">
        <a className="wordmark" href="/" aria-label={`${site.name} — strona główna`}>{site.name}</a>
        <button className="nav-toggle" ref={toggle} type="button" aria-controls="main-nav" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? 'Zamknij' : 'Menu'}<CaretDown weight="light" aria-hidden="true" /></button>
        <nav ref={navRef} className={`site-nav ${open ? 'is-open' : ''}`} id="main-nav" aria-label="Nawigacja główna">
          {site.nav.map(item => <a key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}</a>)}
        </nav>
      </div>
    </header>
  </>;
}

function Footer() {
  return <footer className="site-footer outer-frame">
    <div className="footer-top content-inset"><a className="wordmark footer-wordmark" href="/">{site.name}</a><p>Niezależny doradca AI<br />Procesy, jakość i decyzje technologiczne.</p><TextLink href="/#kontakt">Porozmawiajmy o zadaniu</TextLink></div>
    <div className="footer-bottom content-inset"><p>Prototyp · dane właściciela i kontakt do uzupełnienia.</p><a href="/prywatnosc/">Prywatność</a><a href="/#gora">Na początek</a></div>
  </footer>;
}

function Disclosure({ title, children, id }) {
  return <details className="disclosure" id={id}><summary><span>{title}</span><CaretDown weight="light" aria-hidden="true" /></summary><div className="disclosure-body">{children}</div></details>;
}

function Home() {
  function revealScope() {
    const el = document.getElementById('warunki-w');
    if (el) el.open = true;
  }
  return <main id="tresc" tabIndex="-1">
    <section className="hero content-width" aria-labelledby="hero-title">
      <Eyebrow line>{site.descriptor}</Eyebrow>
      <h1 id="hero-title">{site.hero.lines.map((line, i) => <span className="hero-line" key={line}>{line}{i < 2 ? ' ' : ''}</span>)}</h1>
      <p className="hero-lead">{site.hero.lead}</p>
      <div className="hero-actions"><a className="primary-link" href="#kontakt"><span>Opisz zadanie</span><ArrowRight weight="light" aria-hidden="true" /></a><TextLink href={samplePath} arrow={false}>Zobacz próbkę pracy</TextLink></div>
    </section>

    <section className="perspective outer-frame" aria-label="Perspektywa zawodowa">
      <div className="perspective-grid content-inset"><Eyebrow>Perspektywa</Eyebrow><p className="perspective-title">Produkt. Proces.<br />Technologia.</p><p className="perspective-copy">Doświadczenie Technical Product Managera. Jasne pytanie, uzasadniony wybór, sprawdzalny rezultat.</p></div>
    </section>

    <section className="workflow-feature" id="wspolpraca" aria-labelledby="workflow-heading">
      <div className="content-width"><Eyebrow line>Współpraca</Eyebrow><h2 id="workflow-heading">{site.workflow.name}</h2><p className="workflow-subtitle">{site.workflow.subtitle}</p><p className="workflow-intro">{site.workflow.intro}</p><TextLink href="#zakres" onClick={revealScope}>Poznaj zakres współpracy</TextLink></div>
    </section>

    <section className="consultation-teaser content-width" aria-labelledby="consultation-teaser-title"><div><h2 id="consultation-teaser-title">{site.consultation.name}</h2><p>{site.consultation.subtitle}</p></div><TextLink href={samplePath} arrow={false}>Przykład standardu — dane syntetyczne</TextLink></section>

    <section className="editorial-section content-width problem-section" aria-labelledby="problem-title"><Eyebrow>Sytuacja, od której zaczynamy</Eyebrow><div className="split-intro"><h2 id="problem-title">AI już jest w zespole.<br />Czas uporządkować<br className="desktop-only" /> sposób pracy.</h2><div className="body-copy"><p>Pierwsza wersja jest gotowa, ale senior nadal poprawia fakty, dopowiada kontekst i porządkuje wynik. Każda osoba pracuje inaczej. Trudno powiedzieć, kiedy rezultat jest dobry i kto go zatwierdza.</p><p>Jeśli rozpoznajesz taką sytuację, zacznijmy od jednego zadania. Ustalimy, co przeszkadza w jego wykonaniu i jaką zmianę warto sprawdzić.</p></div></div></section>

    <section className="editorial-section content-width scope-section" id="zakres" aria-labelledby="scope-title"><div className="section-heading"><Eyebrow>Jeden sposób pracy z AI</Eyebrow><h2 id="scope-title">Co zostaje po współpracy.</h2><p className="section-lead">Metoda do samodzielnego użycia, kryteria dobrego wyniku i jasna odpowiedzialność.</p></div><ol className="result-list">{site.workflow.result.map((item, i) => <li key={item.title}><span className="row-number">0{i + 1}</span><h3>{item.title}</h3><p>{item.text}</p></li>)}</ol><Disclosure id="warunki-w" title="Dla kogo, jak długo i czego potrzebujemy">{site.workflow.conditions.map(p => <p key={p}>{p}</p>)}<p>Ważne jest również zaangażowanie uczestników. Czas zespołu ustalamy przed zakupem; spotkanie kilku osób oznacza nakład każdej z nich.</p></Disclosure><Disclosure title="Granice zakresu i odpowiedzialności">{site.workflow.boundaries.map(p => <p key={p}>{p}</p>)}<p>Jedna zbiorcza runda doprecyzowań dotyczy uzgodnionego wyniku. Moje własne błędy koryguję niezależnie od tej puli; nowy przedmiot pracy wymaga osobnego ustalenia.</p></Disclosure><div className="scope-end"><TextLink href="#kontakt">Opisz zadanie, które chcesz usprawnić</TextLink><p>Zakres, cenę i terminy potwierdzam przed rozpoczęciem współpracy.</p></div></section>

    <section className="consultation-section editorial-section content-width" id="konsultacja" aria-labelledby="consultation-title"><Eyebrow>Jedno pytanie do rozstrzygnięcia</Eyebrow><div className="split-intro"><h2 id="consultation-title">{site.consultation.name}</h2><div className="body-copy"><p>{site.consultation.text}</p><p>Po 60-minutowej sesji otrzymujesz krótką rekomendację z uzasadnieniem, niewiadomymi i następnym krokiem.</p><TextLink href="/?temat=decyzja#kontakt">Opisz decyzję do konsultacji</TextLink></div></div><Disclosure title="Format i rezultat konsultacji">{site.consultation.details.map(p => <p key={p}>{p}</p>)}</Disclosure><aside className="review-note"><p className="review-question">Masz już ofertę rozwiązania AI?</p><p>Na zapytanie wykonuję niezależny przegląd jednej oferty: jej założeń, kosztów, dowodów i warunków decyzji. To ocena dokumentów; test działającego systemu wymaga osobnego ustalenia.</p><TextLink href="/?temat=oferta#kontakt">Zapytaj o przegląd oferty</TextLink></aside></section>

    <section className="method-section" id="podejscie" aria-labelledby="method-title"><div className="content-width editorial-section"><Eyebrow>Podejście</Eyebrow><h2 id="method-title">Najpierw zadanie.<br />Potem wybór narzędzia.</h2><ol className="method-list">{site.method.map((step, i) => <li key={step.title}><span className="row-number">0{i + 1}</span><h3>{step.title}</h3><p>{step.text}</p></li>)}</ol><p className="method-closing">Dobra rekomendacja może oznaczać także wykorzystanie obecnego narzędzia lub rezygnację ze zmiany.</p></div></section>

    <section className="about-section editorial-section content-width" id="o-mnie" aria-labelledby="about-title"><Eyebrow>O mnie</Eyebrow><div className="split-intro"><h2 id="about-title">Perspektywa produktowa.<br />Techniczna ocena.<br />Zrozumiały wniosek.</h2><div className="body-copy"><p>Jestem {site.name}. Pracuję jako Technical Product Manager. Łączę analizę procesów, architekturę i integrację systemów z wiedzą o modelach językowych, agentach oraz automatyzacji.</p><p>W doradztwie wykorzystuję tę perspektywę do oceny, która zmiana ma sens i jak sprawdzić jej rezultat.</p><p className="editable-note">[Zweryfikowane doświadczenie i publiczny profil zawodowy — do uzupełnienia.]</p></div></div><dl className="expertise-list">{site.expertise.map(item => <div key={item.title}><dt>{item.title}</dt><dd>{item.text}</dd></div>)}</dl><p className="section-note">To zaplecze mojej pracy. Aktualne formy współpracy opisuję w sekcji usług.</p></section>

    <section className="evidence-section editorial-section content-width" id="probka" aria-labelledby="evidence-title"><Eyebrow>Próbka pracy</Eyebrow><div className="split-intro"><h2 id="evidence-title">Zobacz, jak porządkuję problem.</h2><div className="body-copy"><p>Przykład standardu dla zadania: z notatki po rozmowie do roboczego podsumowania. Pokazuje wymagane wejście, kontrolę faktów, rolę człowieka i warunki przerwania pracy.</p><p className="evidence-label">Demonstracja na danych syntetycznych. Nie jest opisem zlecenia ani dowodem osiągniętej oszczędności.</p><TextLink href={samplePath}>Otwórz przykład standardu</TextLink></div></div></section>

    <section className="analyses-section editorial-section content-width" id="analizy" aria-labelledby="analyses-title"><Eyebrow>Analizy</Eyebrow><h2 id="analyses-title">Kilka decyzji, którym<br />warto przyjrzeć się bliżej.</h2><div className="article-list">{articles.map((article, i) => <article key={article.slug}><span className="row-number">0{i + 1}</span><div><p className="article-meta">{article.kind} · {article.date}</p><h3><a href={`/analizy/${article.slug}/`}>{article.title}</a></h3><p>{article.lead}</p></div><a className="article-arrow" href={`/analizy/${article.slug}/`} aria-label={`Czytaj: ${article.title}`}><ArrowRight weight="light" aria-hidden="true" /></a></article>)}</div></section>

    <Contact />
  </main>;
}

function Contact() {
  const [ready, setReady] = useState(false);
  const [values, setValues] = useState({ email: '', name: '', company: '', topic: 'zadanie', message: '' });
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(null);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const errorBox = useRef(null);
  const previewBox = useRef(null);
  useEffect(() => {
    setReady(true);
    const topic = new URLSearchParams(window.location.search).get('temat');
    if (['zadanie', 'decyzja', 'oferta'].includes(topic)) setValues(v => ({ ...v, topic }));
  }, []);
  useEffect(() => { if (Object.keys(errors).length) errorBox.current?.focus(); }, [errors]);
  useEffect(() => { if (preview) previewBox.current?.focus(); }, [preview]);
  function change(event) {
    setValues(v => ({ ...v, [event.target.name]: event.target.value }));
    setPreview(null); setCopied(false); setCopyError(false);
    if (errors[event.target.name]) setErrors(e => { const next = { ...e }; delete next[event.target.name]; return next; });
  }
  function submit(event) {
    event.preventDefault();
    const next = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) next.email = 'Wpisz adres e-mail w poprawnym formacie.';
    if (!values.message.trim()) next.message = 'Opisz krótko zadanie lub decyzję, w której potrzebujesz pomocy.';
    setErrors(next); setCopied(false); setCopyError(false);
    if (Object.keys(next).length) { setPreview(null); return; }
    const topics = { zadanie: 'Jedno zadanie', decyzja: 'Jedna decyzja AI', oferta: 'Przegląd oferty', inne: 'Inny temat' };
    setPreview(`Temat: ${topics[values.topic]}\n${values.name.trim() ? `Imię: ${values.name.trim()}\n` : ''}${values.company.trim() ? `Firma / rola: ${values.company.trim()}\n` : ''}E-mail: ${values.email.trim()}\n\n${values.message.trim()}`);
  }
  async function copyDraft() {
    try { await navigator.clipboard.writeText(preview); setCopied(true); setCopyError(false); }
    catch { setCopyError(true); }
  }
  return <section className="contact-section" id="kontakt" aria-labelledby="contact-title"><div className="contact-grid content-width editorial-section"><div className="contact-intro"><Eyebrow>Kontakt</Eyebrow><h2 id="contact-title">Opisz jedno zadanie<br />lub decyzję.</h2><p>Napisz, co chcesz usprawnić, z jakiego narzędzia korzystasz i na czym polega trudność. Jeśli możesz, dodaj częstotliwość zadania oraz termin.</p><p>Najpierw sprawdzę dopasowanie zakresu. Jeśli temat mieści się w mojej roli, ustalimy następny krok, cenę i terminy.</p><p className="contact-caution">Na początek wystarczy ogólny opis. Nie wpisuj danych klientów, haseł ani poufnych dokumentów.</p></div><div className="contact-form-area"><p className="demo-notice">Formularz demonstracyjny — wiadomość nie zostanie wysłana.</p><form noValidate onSubmit={submit} aria-label="Opis zadania lub decyzji"><fieldset disabled={!ready}><legend className="visually-hidden">Dane do przygotowania opisu</legend>{Object.keys(errors).length > 0 && <div className="error-summary" ref={errorBox} tabIndex="-1" role="alert"><p>Sprawdź oznaczone pola.</p>{Object.entries(errors).map(([id, text]) => <a key={id} href={`#contact-${id}`}>{text}</a>)}</div>}<div className="form-row"><label htmlFor="contact-email">E-mail <span>(wymagany)</span></label><input id="contact-email" name="email" type="email" autoComplete="email" maxLength="254" value={values.email} onChange={change} required aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'error-email' : undefined} />{errors.email && <p className="field-error" id="error-email">{errors.email}</p>}</div><div className="optional-fields"><div className="form-row"><label htmlFor="contact-name">Imię <span>(opcjonalne)</span></label><input id="contact-name" name="name" autoComplete="given-name" maxLength="100" value={values.name} onChange={change} /></div><div className="form-row"><label htmlFor="contact-company">Firma / rola <span>(opcjonalne)</span></label><input id="contact-company" name="company" autoComplete="organization" maxLength="150" value={values.company} onChange={change} /></div></div><div className="form-row"><label htmlFor="contact-topic">Temat</label><select id="contact-topic" name="topic" value={values.topic} onChange={change}><option value="zadanie">Jedno zadanie zespołu</option><option value="decyzja">Jedna decyzja AI</option><option value="oferta">Przegląd oferty AI</option><option value="inne">Inny temat / jeszcze nie wiem</option></select></div><div className="form-row"><label htmlFor="contact-message">Krótki opis <span>(wymagany)</span></label><p className="field-hint" id="message-hint">Zadanie lub decyzja, obecne narzędzie i główna trudność. Bez poufnych materiałów.</p><textarea id="contact-message" name="message" rows="6" maxLength="4000" value={values.message} onChange={change} required aria-invalid={Boolean(errors.message)} aria-describedby={`message-hint${errors.message ? ' error-message' : ''}`} />{errors.message && <p className="field-error" id="error-message">{errors.message}</p>}</div><button className="primary-link form-submit" type="submit"><span>Sprawdź opis</span><ArrowRight weight="light" aria-hidden="true" /></button></fieldset><noscript><p>Ten podgląd wymaga JavaScript do sprawdzenia opisu. Formularz nie wysyła wiadomości.</p></noscript></form><p className="privacy-hint">Opis jest sprawdzany tylko w tej karcie i nie jest wysyłany do serwera ani modelu AI. <a href="/prywatnosc/">Prywatność prototypu</a>.</p>{preview && <div className="draft-preview" ref={previewBox} tabIndex="-1" role="region" aria-label="Podgląd opisu"><p className="draft-title">Opis jest gotowy.</p><p>To podgląd — niczego nie wysłano.</p><pre>{preview}</pre><button type="button" className="text-link" onClick={copyDraft}>{copied ? <Check aria-hidden="true" /> : <Copy weight="light" aria-hidden="true" />}<span>{copied ? 'Skopiowano opis' : 'Kopiuj opis'}</span></button><p className="visually-hidden" role="status">{copied ? 'Opis skopiowano do schowka.' : ''}</p>{copyError && <p role="status">Przeglądarka nie pozwoliła skopiować opisu. Możesz zaznaczyć go powyżej i skopiować ręcznie.</p>}</div>}<p className="contact-placeholder">[Adres e-mail i termin odpowiedzi — do uzupełnienia.]</p></div></div></section>;
}

function ArticleFrame({ label, title, lead, children, isSample = false }) {
  return <main id="tresc" tabIndex="-1" className={`article-page ${isSample ? 'sample-page' : ''}`}><div className="content-width"><a className="back-link" href={isSample ? '/#probka' : '/#analizy'}><ArrowLeft weight="light" aria-hidden="true" />{isSample ? 'Wróć do próbki pracy' : 'Wróć do analiz'}</a><header className="article-header"><Eyebrow line>{label}</Eyebrow><h1>{title}</h1><p className="article-lead">{lead}</p><p className="article-byline">Opracowanie: {site.name} · 29.10.2026</p></header><div className="article-reading">{children}</div><aside className="article-contact"><Eyebrow>Następny krok</Eyebrow><h2>Masz podobne pytanie<br />w swoim zespole?</h2><TextLink href="/#kontakt">Opisz zadanie lub decyzję</TextLink></aside></div></main>;
}

function ArticlePage({ article }) {
  return <ArticleFrame label="Analiza" title={article.title} lead={article.lead}>{article.blocks.map((block, i) => block.type === 'heading' ? <h2 key={i}>{block.text}</h2> : <p key={i}>{block.text}</p>)}</ArticleFrame>;
}

function SamplePage() {
  return <ArticleFrame isSample label="Próbka metody · dane syntetyczne" title="Z notatki po rozmowie do roboczego podsumowania." lead="Projekt standardu: wymagane wejście, kontrola faktów, rola człowieka i warunki przerwania pracy.">
    <div className="sample-notice"><strong>Demonstracja metody. Nieprzeprowadzony test.</strong><p>Cały materiał jest syntetyczny. Nie opisuje zlecenia, rzeczywistego klienta ani wyniku działania modelu.</p></div>
    <h2>Pytanie</h2><p>Jak przygotować podsumowanie dla opiekuna projektu tak, aby nie dopisywać ustaleń, których nie ma w notatce? Ten przykład pokazuje strukturę sposobu pracy, a nie skuteczność całego procesu w firmie.</p>
    <h2>Materiał syntetyczny</h2><blockquote>Rozmowa o etapowym uruchomieniu obsługi. Klient chce najpierw ustalić zakres źródeł danych i liczbę użytkowników. Budżet wymaga potwierdzenia. Termin wdrożenia nie został uzgodniony. Opiekun ma przygotować pytania do kolejnej rozmowy. Nie ustalono terminu następnego spotkania.</blockquote><p>To całość źródła przykładu. Nie istnieje tu rzeczywisty klient ani wykonana rozmowa handlowa.</p>
    <h2>Projekt standardu</h2><dl className="standard-list">{[
      ['Początek', 'Zatwierdzona do użycia notatka; fakty oddzielone od niewiadomych.'],
      ['Koniec', 'Sprawdzone robocze podsumowanie dla opiekuna. Bez automatycznej wysyłki do klienta.'],
      ['Wejście', 'Notatka, odbiorca, cel, wymagany format i dozwolone źródła.'],
      ['AI', 'Porządkuje informacje: ustalenia, braki, pytania i następny krok.'],
      ['Operator', 'Sprawdza każdą tezę względem źródła, usuwa niepoparte zdania i zapisuje poprawki.'],
      ['Właściciel', 'Utrzymuje instrukcję, zatwierdza zmiany i rozstrzyga wyjątki.'],
      ['Wykluczenia', 'Dopisywanie oferty, ceny, terminu lub zobowiązania handlowego; automatyczna wysyłka.'],
      ['Stop', 'Niepoparte zobowiązanie, niedozwolone dane lub niepewność krytycznego faktu. Powrót do źródła i oceny człowieka.'],
    ].map(([title, text]) => <div key={title}><dt>{title}</dt><dd>{text}</dd></div>)}</dl>
    <h2>Instrukcja robocza</h2><div className="instruction-excerpt"><p>Na podstawie wyłącznie podanej notatki przygotuj robocze podsumowanie dla opiekuna projektu. Oddziel ustalenia, informacje do potwierdzenia, pytania i następny krok.</p><p>Nie uzupełniaj brakujących kwot, dat ani zobowiązań. Przy braku informacji wpisz „nie ustalono” albo „do potwierdzenia”. Dla każdej pozycji ustaleń przytocz krótki fragment źródła. Nie wysyłaj wiadomości i nie wykonuj działań w innych systemach.</p></div><p>To projekt instrukcji wymagający próby. Sam jej zapis nie gwarantuje, że model będzie przestrzegał ograniczeń.</p>
    <h2>Oczekiwany wzorzec redakcyjny</h2><p><strong>Ustalenia:</strong> rozmowa dotyczy etapowego uruchomienia obsługi; przed następnym etapem trzeba określić zakres źródeł i liczbę użytkowników.</p><p><strong>Do potwierdzenia:</strong> budżet. <strong>Nie ustalono:</strong> terminu wdrożenia i kolejnego spotkania. <strong>Następny krok:</strong> opiekun przygotowuje pytania o źródła danych oraz użytkowników.</p><p className="section-note">Wzorzec został napisany przez autora materiału. Nie jest wynikiem uruchomienia modelu.</p>
    <h2>Kryteria przed próbą</h2><dl className="standard-list">{[
      ['Zgodność ze źródłem · krytyczne', 'Każde ustalenie ma podstawę w notatce.'],
      ['Brak dopisanych zobowiązań · krytyczne', 'Nieustalona data, cena lub obietnica nie jest przedstawiona jako fakt.'],
      ['Jawne braki', 'Budżet, termin wdrożenia i spotkania zachowują status niewiadomej.'],
      ['Użyteczność', 'Opiekun wie, o co zapytać i co zrobić dalej.'],
      ['Zakres działania · krytyczne', 'Materiał pozostaje roboczy. Bez wysyłki lub zmiany w systemie.'],
    ].map(([title, text]) => <div key={title}><dt>{title}</dt><dd>{text}</dd></div>)}</dl><p>Do przyszłej próby potrzebne są przypadki typowe, niepełne, sprzeczne, z niejasną odpowiedzialnością i z żądaniem działania poza zakresem. Przykłady projektowe należy oddzielić od pozostawionych do oceny.</p>
    <h2>Decyzja i ograniczenia</h2><p>Standard nadaje się do sprawdzenia na dozwolonym materiale. Nie można jeszcze stwierdzić, że poprawił jakość, skrócił czas ani może być użyty bez recenzenta. Nie przeprowadzono testu narzędzia i nie zebrano logu nowych zadań.</p><p><strong>Wariant negatywny:</strong> jeśli każda notatka ma inny cel lub brakuje źródeł, wspólna instrukcja może nie rozwiązać problemu. Najpierw trzeba uporządkować materiał i odpowiedzialność. Przy małym koszcie ręcznego podsumowania wprowadzenie AI może być zbędne.</p><p>Następny krok: wskazać właściciela, uzgodnić miary pełnej pracy i przeprowadzić ograniczoną próbę. To osobna czynność, nie wynik tej demonstracji.</p>
  </ArticleFrame>;
}

function PrivacyPage() {
  return <ArticleFrame label="Prywatność prototypu" title="Najpierw jasny opis. Poufne materiały później." lead="Ten podgląd pozwala zapoznać się ze stroną i sprawdzić opis zadania. Nie uruchamia rzeczywistej obsługi zapytań."><h2>Jak działa formularz</h2><p>Wpisane informacje pozostają w pamięci tej karty przeglądarki. Formularz nie wysyła ich do serwera, poczty ani modelu AI i nie zapisuje ich w cookies lub localStorage. Odświeżenie albo zamknięcie strony usuwa roboczy opis z formularza.</p><p>Przycisk kopiowania przenosi opis do schowka wyłącznie po Twoim kliknięciu. Strona nie odczytuje zawartości schowka.</p><h2>Odwiedziny strony</h2><p>Strona nie zawiera narzędzi reklamowych, zewnętrznej analityki, osadzonych kalendarzy ani formularzy innych dostawców. Fonty są ładowane z tego samego serwisu. Hosting może przetwarzać techniczne dane żądań; nie oznacza to, że prototyp jest usługą bez jakiegokolwiek przetwarzania danych.</p><h2>Przed uruchomieniem kontaktu</h2><p>Do uzupełnienia pozostają rzeczywiste dane administratora, adres kontaktowy, dostawcy i odbiorcy, cele oraz podstawy przetwarzania, retencja, zasady transferów i realizacji praw. Dokument musi odpowiadać faktycznej konfiguracji hostingu, poczty i endpointu.</p><p>Ten opis dotyczy prototypu. Nie jest gotową polityką prywatności dla działającej praktyki. Rzeczywista wysyłka zostanie uruchomiona dopiero po ustaleniu tych elementów.</p></ArticleFrame>;
}

function NotFound() { return <main id="tresc" tabIndex="-1" className="content-width not-found"><Eyebrow>Nie znaleziono strony</Eyebrow><h1>Wróćmy do<br />właściwego miejsca.</h1><TextLink href="/">Przejdź na stronę główną</TextLink></main>; }

export function App({ path: suppliedPath }) {
  const path = suppliedPath || (typeof window !== 'undefined' ? window.location.pathname : '/');
  const normalizedPath = path === '/' ? '/' : `${path.replace(/\/+$/, '')}/`;
  useEffect(() => {
    const meta = getPageMeta(normalizedPath);
    document.title = meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
    if (window.location.hash) requestAnimationFrame(() => {
      const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
      target?.scrollIntoView({ behavior: 'instant' });
    });
  }, [normalizedPath]);
  const article = articles.find(a => normalizedPath === `/analizy/${a.slug}/`);
  const page = normalizedPath === '/' ? <Home /> : article ? <ArticlePage article={article} /> : normalizedPath === samplePath ? <SamplePage /> : normalizedPath === '/prywatnosc/' ? <PrivacyPage /> : <NotFound />;
  return <><Header />{page}<Footer /></>;
}
