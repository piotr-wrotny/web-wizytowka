import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowLeft, CaretDown, Copy, Check } from '@phosphor-icons/react';
import { site } from './content/site';
import { articles, formatDate, readingMinutes } from './content/articles';
import { glossary } from './content/glossary';

const samplePath = '/materialy/przyklad-standardu/';

export function getPageMeta(path) {
  const article = articles.find(a => path === `/analizy/${a.slug}/`);
  if (article) return { title: `${article.title} — ${site.descriptor}`, description: article.lead };
  if (path === samplePath) return { title: 'Przykład standardu pracy z AI — dane syntetyczne', description: 'Otwarta demonstracja metody: wejście, kontrola faktów, odpowiedzialność i warunki przerwania pracy.' };
  if (path === '/prywatnosc/') return { title: 'Prywatność prototypu — niezależny doradca AI', description: 'Jak działa demonstracyjny kontakt i co wymaga uzupełnienia przed uruchomieniem obsługi zapytań.' };
  return { title: `${site.name} — niezależny doradca AI`, description: 'Pomoc w uporządkowaniu jednego sposobu pracy z AI i w konkretnych decyzjach technologicznych. Standard, próba i pisemne rekomendacje.' };
}

/* Eyebrow is the opening's device (header to the K row, as in the selected mock). Below it, headings stand alone. */
function Eyebrow({ children, line = false, className = '' }) {
  return <p className={`eyebrow ${line ? 'eyebrow-line' : ''} ${className}`}>{children}</p>;
}

function TextLink({ href, children, className = '', onClick, arrow = true }) {
  return <a className={`text-link ${className}`} href={href} onClick={onClick}><span>{children}</span>{arrow && <ArrowRight weight="light" aria-hidden="true" />}</a>;
}

/* One consistent marker for every fact the founder still has to supply. */
function Pending({ children }) {
  return <p className="pending"><span className="pending-label">Do uzupełnienia</span>{children}</p>;
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
    <div className="footer-top content-inset">
      <a className="wordmark footer-wordmark" href="/">{site.name}</a>
      <p>Niezależny doradca AI<br />Procesy, jakość i decyzje technologiczne.</p>
      <TextLink href="/#kontakt">Porozmawiajmy o zadaniu</TextLink>
    </div>
    <div className="footer-bottom content-inset">
      <p>Prototyp. Dane właściciela i kontakt do uzupełnienia.</p>
      <a href="/prywatnosc/">Prywatność</a>
      <a href="/#gora">Na początek</a>
    </div>
  </footer>;
}

function Disclosure({ title, children, id }) {
  return <details className="disclosure" id={id}><summary><span>{title}</span><CaretDown weight="light" aria-hidden="true" /></summary><div className="disclosure-body">{children}</div></details>;
}

function StandardTable({ rows, className = '' }) {
  return <dl className={`standard-table ${className}`}>{rows.map(([title, text]) => <div key={title}><dt>{title}</dt><dd>{text}</dd></div>)}</dl>;
}

function Home() {
  const { workflow, consultation, standard } = site;
  return <main id="tresc" tabIndex="-1">
    {/* Opening: faithful to design/selected-reference.jpeg down to the K row. */}
    <section className="hero content-width" aria-labelledby="hero-title">
      <Eyebrow line>{site.descriptor}</Eyebrow>
      <h1 id="hero-title">{site.hero.lines.map((line, i) => <span className="hero-line" key={line}>{line}{i < 2 ? ' ' : ''}</span>)}</h1>
      <p className="hero-lead">{site.hero.lead}</p>
      <div className="hero-actions"><a className="primary-link" href="#kontakt"><span>Opisz zadanie</span><ArrowRight weight="light" aria-hidden="true" /></a><TextLink href="#standard" arrow={false}>Zobacz próbkę pracy</TextLink></div>
    </section>

    <section className="perspective outer-frame" aria-label="Perspektywa zawodowa">
      <div className="perspective-grid content-inset"><Eyebrow>Perspektywa</Eyebrow><p className="perspective-title">Produkt. Proces.<br />{' '}Technologia.</p><p className="perspective-copy">Doświadczenie Technical Product Managera. Jasne pytanie, uzasadniony wybór, sprawdzalny rezultat.</p></div>
    </section>

    <section className="workflow-feature" id="wspolpraca" aria-labelledby="workflow-heading">
      <div className="content-width"><Eyebrow line>Współpraca</Eyebrow><h2 id="workflow-heading">{workflow.name}</h2><p className="workflow-subtitle">{workflow.subtitle}</p><p className="workflow-intro">{workflow.intro}</p><TextLink href="#zakres">Poznaj zakres współpracy</TextLink></div>
    </section>

    <section className="consultation-teaser content-width" aria-labelledby="consultation-teaser-title">
      <div><h2 id="consultation-teaser-title"><a href="#konsultacja">{consultation.name}</a></h2><p>{consultation.subtitle}</p></div>
      <TextLink href="#standard" arrow={false}>Przykład standardu — dane syntetyczne</TextLink>
    </section>

    {/* Below the K row: one axis. Problem, offer, exhibit, consultation, method, analyses, person, contact. */}
    <section className="section scope-section content-width" id="zakres" aria-labelledby="scope-title">
      <div className="split-intro">
        <h2 id="scope-title">AI już jest w zespole. Czas uporządkować sposób pracy.</h2>
        <div className="body-copy">{workflow.situation.map(p => <p key={p}>{p}</p>)}</div>
      </div>
      <div className="results">
        <h3 className="subheading">Co zostaje po współpracy</h3>
        <dl className="result-list">{workflow.result.map(item => <div key={item.title}><dt>{item.title}</dt><dd>{item.text}</dd></div>)}</dl>
      </div>
      <div className="disclosures">
        <Disclosure id="warunki-w" title="Dla kogo, jak długo i czego potrzebujemy">{workflow.conditions.map(p => <p key={p}>{p}</p>)}</Disclosure>
        <Disclosure title="Granice zakresu i odpowiedzialności">{workflow.boundaries.map(p => <p key={p}>{p}</p>)}</Disclosure>
      </div>
      <div className="scope-end"><a className="primary-link primary-link-compact" href="#kontakt"><span>Opisz zadanie</span><ArrowRight weight="light" aria-hidden="true" /></a><p>{workflow.boundaryNote}</p></div>
    </section>

    <section className="exhibit-section" id="standard" aria-labelledby="exhibit-title">
      <div className="section content-width exhibit-grid">
        <div className="exhibit-side">
          <p className="exhibit-label">Tablica 1</p>
          <h2 id="exhibit-title">{standard.title}</h2>
          <p className="exhibit-caption">Przykład standardu na materiale syntetycznym, przed próbą. Pełny zapis z instrukcją roboczą, wzorcem wyniku i kryteriami oceny jest na osobnej stronie.</p>
          <TextLink href={samplePath}>Otwórz pełny przykład</TextLink>
        </div>
        <StandardTable rows={standard.rows.slice(0, standard.exhibitRows)} className="exhibit-table" />
      </div>
    </section>

    <section className="section consultation-note content-width" id="konsultacja" aria-labelledby="consultation-title">
      <div className="note-body">
        <h2 id="consultation-title">{consultation.name}</h2>
        <p className="note-lead">{consultation.subtitle}</p>
        <p>{consultation.text}</p>
        <p>{consultation.outcome}</p>
        <TextLink href="/?temat=decyzja#kontakt">Opisz decyzję do konsultacji</TextLink>
        <Disclosure title="Format i rezultat konsultacji">{consultation.details.map(p => <p key={p}>{p}</p>)}</Disclosure>
        <p className="footnote"><span>Na zapytanie.</span> {consultation.review} <a href="/?temat=oferta#kontakt">Zapytaj o przegląd oferty</a>.</p>
      </div>
    </section>

    <section className="section method-section content-width" id="podejscie" aria-labelledby="method-title">
      <h2 id="method-title">Najpierw zadanie. Potem wybór narzędzia.</h2>
      <ol className="method-steps">{site.method.map((step, i) => <li key={step.title}><span className="step-numeral" aria-hidden="true">{i + 1}</span><h3>{step.title}</h3><p>{step.text}</p></li>)}</ol>
      <p className="method-closing">{site.methodClosing}</p>
      <div className="principles">
        <h3 className="subheading">Czego nie robię</h3>
        <ul>{site.principles.map(p => <li key={p}>{p}</li>)}</ul>
      </div>
    </section>

    <section className="section analyses-section content-width" id="analizy" aria-labelledby="analyses-title">
      <h2 id="analyses-title">Kilka decyzji, którym warto przyjrzeć się bliżej.</h2>
      <div className="article-grid">{articles.map(article => <article key={article.slug}>
        <p className="article-meta"><span>{article.kind}</span><span>{formatDate(article.date)}</span><span>{readingMinutes(article.blocks)} min czytania</span></p>
        <h3><a href={`/analizy/${article.slug}/`}>{article.title}</a></h3>
        <p>{article.lead}</p>
        <TextLink href={`/analizy/${article.slug}/`}>Czytaj analizę</TextLink>
      </article>)}</div>
    </section>

    <section className="section about-section content-width" id="o-mnie" aria-labelledby="about-title">
      <div className="split-intro">
        <h2 id="about-title">Perspektywa produktowa. Techniczna ocena. Zrozumiały wniosek.</h2>
        <div className="body-copy">
          <p>Jestem {site.name}. Pracuję jako Technical Product Manager. Łączę analizę procesów, architekturę i integrację systemów z wiedzą o modelach językowych, agentach oraz automatyzacji.</p>
          <p>W doradztwie wykorzystuję tę perspektywę do oceny, która zmiana ma sens i jak sprawdzić jej rezultat.</p>
          <Pending>zweryfikowane doświadczenie i publiczny profil zawodowy.</Pending>
        </div>
      </div>
      <dl className="expertise-rows">{site.expertise.map(item => <div key={item.title}><dt>{item.title}</dt><dd>{item.text}</dd></div>)}</dl>
    </section>

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
  return <section className="contact-section" id="kontakt" aria-labelledby="contact-title">
    <div className="contact-grid content-width section">
      <div className="contact-intro">
        <h2 id="contact-title">Opisz jedno zadanie lub decyzję.</h2>
        <p>Napisz, co chcesz usprawnić, z jakiego narzędzia korzystasz i na czym polega trudność. Jeśli możesz, dodaj częstotliwość zadania oraz termin.</p>
        <p>Najpierw sprawdzę dopasowanie zakresu. Jeśli temat mieści się w mojej roli, ustalimy następny krok, cenę i terminy.</p>
        <p className="contact-caution">Na początek wystarczy ogólny opis. Nie wpisuj danych klientów, haseł ani poufnych dokumentów.</p>
        <Pending>adres e-mail i termin odpowiedzi.</Pending>
      </div>
      <div className="contact-form-area">
        <p className="demo-notice">Formularz demonstracyjny. Opis jest sprawdzany tylko w tej karcie; nic nie jest wysyłane do serwera ani modelu AI. <a href="/prywatnosc/">Prywatność prototypu</a>.</p>
        <form noValidate onSubmit={submit} aria-label="Opis zadania lub decyzji">
          <fieldset disabled={!ready}>
            <legend className="visually-hidden">Dane do przygotowania opisu</legend>
            {Object.keys(errors).length > 0 && <div className="error-summary" ref={errorBox} tabIndex="-1" role="alert"><p>Sprawdź oznaczone pola.</p>{Object.entries(errors).map(([id, text]) => <a key={id} href={`#contact-${id}`}>{text}</a>)}</div>}
            <div className="form-row"><label htmlFor="contact-email">E-mail <span>(wymagany)</span></label><input id="contact-email" name="email" type="email" autoComplete="email" maxLength="254" value={values.email} onChange={change} required aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'error-email' : undefined} />{errors.email && <p className="field-error" id="error-email">{errors.email}</p>}</div>
            <div className="optional-fields">
              <div className="form-row"><label htmlFor="contact-name">Imię <span>(opcjonalne)</span></label><input id="contact-name" name="name" autoComplete="given-name" maxLength="100" value={values.name} onChange={change} /></div>
              <div className="form-row"><label htmlFor="contact-company">Firma / rola <span>(opcjonalne)</span></label><input id="contact-company" name="company" autoComplete="organization" maxLength="150" value={values.company} onChange={change} /></div>
            </div>
            <div className="form-row"><label htmlFor="contact-topic">Temat</label><select id="contact-topic" name="topic" value={values.topic} onChange={change}><option value="zadanie">Jedno zadanie zespołu</option><option value="decyzja">Jedna decyzja AI</option><option value="oferta">Przegląd oferty AI</option><option value="inne">Inny temat / jeszcze nie wiem</option></select></div>
            <div className="form-row"><label htmlFor="contact-message">Krótki opis <span>(wymagany)</span></label><p className="field-hint" id="message-hint">Zadanie lub decyzja, obecne narzędzie i główna trudność.</p><textarea id="contact-message" name="message" rows="6" maxLength="4000" value={values.message} onChange={change} required aria-invalid={Boolean(errors.message)} aria-describedby={`message-hint${errors.message ? ' error-message' : ''}`} />{errors.message && <p className="field-error" id="error-message">{errors.message}</p>}</div>
            <button className="primary-link primary-link-compact" type="submit"><span>Sprawdź opis</span><ArrowRight weight="light" aria-hidden="true" /></button>
          </fieldset>
          <noscript><p>Ten podgląd wymaga JavaScript do sprawdzenia opisu. Formularz nie wysyła wiadomości.</p></noscript>
        </form>
        {preview && <div className="draft-preview" ref={previewBox} tabIndex="-1" role="region" aria-label="Podgląd opisu">
          <p className="draft-title">Opis jest gotowy.</p>
          <p>To podgląd; niczego nie wysłano.</p>
          <pre>{preview}</pre>
          <button type="button" className="text-link" onClick={copyDraft}>{copied ? <Check aria-hidden="true" /> : <Copy weight="light" aria-hidden="true" />}<span>{copied ? 'Skopiowano opis' : 'Kopiuj opis'}</span></button>
          <p className="visually-hidden" role="status">{copied ? 'Opis skopiowano do schowka.' : ''}</p>
          {copyError && <p role="status">Przeglądarka nie pozwoliła skopiować opisu. Możesz zaznaczyć go powyżej i skopiować ręcznie.</p>}
        </div>}
      </div>
    </div>
  </section>;
}

function Marginalia({ terms }) {
  if (!terms?.length) return null;
  return <aside className="marginalia" aria-label="Pojęcia użyte w tekście">
    <h2>Pojęcia w tym tekście</h2>
    <dl>{terms.map(key => glossary[key] && <div key={key}><dt>{glossary[key].term}</dt><dd>{glossary[key].text}</dd></div>)}</dl>
  </aside>;
}

function ArticleFrame({ kind, title, lead, meta, theses, terms, children, backHref, backLabel }) {
  return <main id="tresc" tabIndex="-1" className="article-page">
    <div className="content-width">
      <a className="back-link" href={backHref}><ArrowLeft weight="light" aria-hidden="true" />{backLabel}</a>
      <header className="article-header">
        <p className="article-kind">{kind}</p>
        <h1>{title}</h1>
        <p className="article-lead">{lead}</p>
        {meta && <p className="article-meta">{meta.map(m => <span key={m}>{m}</span>)}</p>}
      </header>
      {theses && <ul className="theses" aria-label="W skrócie">{theses.map(t => <li key={t}>{t}</li>)}</ul>}
      <div className="article-body">
        <div className="article-reading">{children}</div>
        <Marginalia terms={terms} />
      </div>
      <aside className="article-contact"><h2>Masz podobne pytanie w swoim zespole?</h2><TextLink href="/#kontakt">Opisz zadanie lub decyzję</TextLink></aside>
    </div>
  </main>;
}

function DataTable({ block }) {
  return <table className="data-table">
    <caption>{block.caption}</caption>
    <thead><tr>{block.head.map(h => <th key={h} scope="col">{h}</th>)}</tr></thead>
    <tbody>{block.rows.map(row => <tr key={row[0]}>{row.map((cell, i) => i === 0 ? <th key={i} scope="row">{cell}</th> : <td key={i}>{cell || <span aria-hidden="true">–</span>}</td>)}</tr>)}</tbody>
  </table>;
}

function ArticlePage({ article }) {
  const meta = [article.kind, formatDate(article.date), `${readingMinutes(article.blocks)} min czytania`, `Opracowanie: ${site.name}`];
  return <ArticleFrame kind="Analiza" title={article.title} lead={article.lead} meta={meta} theses={article.theses} terms={article.terms} backHref="/#analizy" backLabel="Wróć do analiz">
    {article.blocks.map((block, i) => {
      if (block.type === 'heading') return <h2 key={i}>{block.text}</h2>;
      if (block.type === 'pull') return <p key={i} className="pull" aria-hidden="true">{block.text}</p>;
      if (block.type === 'table') return <DataTable key={i} block={block} />;
      return <p key={i}>{block.text}</p>;
    })}
  </ArticleFrame>;
}

function SamplePage() {
  const { standard } = site;
  return <ArticleFrame kind="Przykład standardu, dane syntetyczne" title={standard.title} lead="Projekt standardu: wymagane wejście, kontrola faktów, rola człowieka i warunki przerwania pracy." meta={['Materiał syntetyczny', formatDate('29.10.2026'), `Opracowanie: ${site.name}`]} terms={['standard', 'operator', 'wlasciciel-procesu', 'blad-krytyczny', 'proba']} backHref="/#standard" backLabel="Wróć do tablicy na stronie głównej">
    <p className="boundary"><strong>Demonstracja metody, test nieprzeprowadzony.</strong> Cały materiał jest syntetyczny. Nie opisuje zlecenia, rzeczywistego klienta ani wyniku działania modelu.</p>
    <h2>Pytanie</h2><p>Jak przygotować podsumowanie dla opiekuna projektu tak, aby nie dopisywać ustaleń, których nie ma w notatce? Ten przykład pokazuje strukturę sposobu pracy, a nie skuteczność całego procesu w firmie.</p>
    <h2>Materiał syntetyczny</h2><blockquote>Rozmowa o etapowym uruchomieniu obsługi. Klient chce najpierw ustalić zakres źródeł danych i liczbę użytkowników. Budżet wymaga potwierdzenia. Termin wdrożenia nie został uzgodniony. Opiekun ma przygotować pytania do kolejnej rozmowy. Nie ustalono terminu następnego spotkania.</blockquote><p>To całość źródła przykładu.</p>
    <h2>Projekt standardu</h2><StandardTable rows={standard.rows} />
    <h2>Instrukcja robocza</h2><div className="instruction-excerpt"><p>Na podstawie wyłącznie podanej notatki przygotuj robocze podsumowanie dla opiekuna projektu. Oddziel ustalenia, informacje do potwierdzenia, pytania i następny krok.</p><p>Nie uzupełniaj brakujących kwot, dat ani zobowiązań. Przy braku informacji wpisz „nie ustalono” albo „do potwierdzenia”. Dla każdej pozycji ustaleń przytocz krótki fragment źródła. Nie wysyłaj wiadomości i nie wykonuj działań w innych systemach.</p></div><p>To projekt instrukcji wymagający próby. Sam jej zapis nie gwarantuje, że model będzie przestrzegał ograniczeń.</p>
    <h2>Oczekiwany wzorzec redakcyjny</h2><p><strong>Ustalenia:</strong> rozmowa dotyczy etapowego uruchomienia obsługi; przed następnym etapem trzeba określić zakres źródeł i liczbę użytkowników.</p><p><strong>Do potwierdzenia:</strong> budżet. <strong>Nie ustalono:</strong> terminu wdrożenia i kolejnego spotkania. <strong>Następny krok:</strong> opiekun przygotowuje pytania o źródła danych oraz użytkowników.</p><p className="section-note">Wzorzec napisał autor materiału. Nie jest wynikiem uruchomienia modelu.</p>
    <h2>Kryteria przed próbą</h2><StandardTable rows={[
      ['Zgodność ze źródłem, krytyczne', 'Każde ustalenie ma podstawę w notatce.'],
      ['Brak dopisanych zobowiązań, krytyczne', 'Nieustalona data, cena lub obietnica nie jest przedstawiona jako fakt.'],
      ['Jawne braki', 'Budżet, termin wdrożenia i spotkania zachowują status niewiadomej.'],
      ['Użyteczność', 'Opiekun wie, o co zapytać i co zrobić dalej.'],
      ['Zakres działania, krytyczne', 'Materiał pozostaje roboczy. Bez wysyłki lub zmiany w systemie.'],
    ]} /><p>Do przyszłej próby potrzebne są przypadki typowe, niepełne, sprzeczne, z niejasną odpowiedzialnością i z żądaniem działania poza zakresem. Przykłady projektowe należy oddzielić od pozostawionych do oceny.</p>
    <h2>Decyzja i ograniczenia</h2><p>Standard nadaje się do sprawdzenia na dozwolonym materiale. Nie można jeszcze stwierdzić, że poprawił jakość, skrócił czas ani może być użyty bez recenzenta. Nie przeprowadzono testu narzędzia i nie zebrano logu nowych zadań.</p><p><strong>Wariant negatywny:</strong> jeśli każda notatka ma inny cel lub brakuje źródeł, wspólna instrukcja może nie rozwiązać problemu. Najpierw trzeba uporządkować materiał i odpowiedzialność. Przy małym koszcie ręcznego podsumowania wprowadzenie AI może być zbędne.</p><p>Następny krok: wskazać właściciela, uzgodnić miary pełnej pracy i przeprowadzić ograniczoną próbę. To osobna czynność, nie wynik tej demonstracji.</p>
  </ArticleFrame>;
}

function PrivacyPage() {
  return <ArticleFrame kind="Prototyp" title="Najpierw jasny opis. Poufne materiały później." lead="Ten podgląd pozwala zapoznać się ze stroną i sprawdzić opis zadania. Nie uruchamia rzeczywistej obsługi zapytań." backHref="/#kontakt" backLabel="Wróć do kontaktu">
    <h2>Jak działa formularz</h2><p>Wpisane informacje pozostają w pamięci tej karty przeglądarki. Formularz nie wysyła ich do serwera, poczty ani modelu AI i nie zapisuje ich w cookies lub localStorage. Odświeżenie albo zamknięcie strony usuwa roboczy opis z formularza.</p><p>Przycisk kopiowania przenosi opis do schowka wyłącznie po Twoim kliknięciu. Strona nie odczytuje zawartości schowka.</p>
    <h2>Odwiedziny strony</h2><p>Strona nie zawiera narzędzi reklamowych, zewnętrznej analityki, osadzonych kalendarzy ani formularzy innych dostawców. Fonty są ładowane z tego samego serwisu. Hosting może przetwarzać techniczne dane żądań; nie oznacza to, że prototyp jest usługą bez jakiegokolwiek przetwarzania danych.</p>
    <h2>Przed uruchomieniem kontaktu</h2><p>Do uzupełnienia pozostają rzeczywiste dane administratora, adres kontaktowy, dostawcy i odbiorcy, cele oraz podstawy przetwarzania, retencja, zasady transferów i realizacji praw. Dokument musi odpowiadać faktycznej konfiguracji hostingu, poczty i endpointu.</p><p>Ten opis dotyczy prototypu. Nie jest gotową polityką prywatności dla działającej praktyki. Rzeczywista wysyłka zostanie uruchomiona dopiero po ustaleniu tych elementów.</p>
  </ArticleFrame>;
}

function NotFound() { return <main id="tresc" tabIndex="-1" className="content-width not-found"><p className="article-kind">Nie znaleziono strony</p><h1>Wróćmy do właściwego miejsca.</h1><TextLink href="/">Przejdź na stronę główną</TextLink></main>; }

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
