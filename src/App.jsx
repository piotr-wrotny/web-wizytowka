import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowLeft, CaretDown, Copy, Check } from '@phosphor-icons/react';
import { site as rawSite } from './content/site';
import { articles as rawArticles, formatDate, readingMinutes } from './content/articles';
import { glossary as rawGlossary } from './content/glossary';
import { initMotion } from './motion';

const samplePath = '/materialy/przyklad-standardu/';
const deckPath = '/konsultacja/';

/* Polish typesetting: a one-letter word never ends a line. Binds i, w, z, o, a, u (and capitals) to the next word. */
export function pl(text) {
  return typeof text === 'string' ? text.replace(/(^|[\s(„])([aiouwzAIOUWZ])\s(?=\S)/g, '$1$2 ') : text;
}
const plDeep = v => typeof v === 'string' ? pl(v) : Array.isArray(v) ? v.map(plDeep) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, plDeep(x)])) : v;
const site = plDeep(rawSite);
const articles = plDeep(rawArticles);
const glossary = plDeep(rawGlossary);

const navSections = {
  '/#wspolpraca': ['wspolpraca', 'przebieg', 'sytuacje', 'zakres', 'standard'],
  '/#podejscie': ['podejscie', 'zasady', 'analizy'],
  '/#o-mnie': ['o-mnie'],
  '/#kontakt': ['kontakt'],
};

export function getPageMeta(path) {
  const article = articles.find(a => path === `/analizy/${a.slug}/`);
  if (article) return { title: `${article.title} — ${site.descriptor}`, description: article.lead };
  if (path === samplePath) return { title: 'Przykład standardu pracy z AI — dane syntetyczne', description: 'Otwarta demonstracja metody: wejście, kontrola faktów, odpowiedzialność i warunki przerwania pracy.' };
  if (path === deckPath) return { title: `Jak przebiega konsultacja — ${site.name}`, description: 'Pięć etapów konsultacji AI: rozpoznanie problemów i poziomu wiedzy, zebranie materiału, prezentacja, spotkanie i dokumenty końcowe.' };
  if (path === '/prywatnosc/') return { title: 'Prywatność prototypu — niezależny doradca AI', description: 'Jak działa demonstracyjny kontakt i co wymaga uzupełnienia przed uruchomieniem obsługi zapytań.' };
  return { title: `${site.name} — niezależny doradca AI`, description: 'Konsultacje AI szyte na miarę zespołu i zadania: standard dla zespołu, jedna decyzja albo przegląd oferty. Ocena technologii, kryteria jakości i praktyczna próba.' };
}

/* ------------------------------------------------------------------
   The reviewer's pencil. Blue confirms, red corrects. These marks are the
   site's one graphic device: they appear where something was checked,
   corrected, or is still an open query.
   ------------------------------------------------------------------ */
const marks = {
  tick: 'M2.5 9.5l4 4.5L15.5 3',
  bar: 'M4 2.5v13M4 9h10',
  caret: 'M3 14l6-10 6 10',
  query: 'M5.5 6.2c0-2 1.5-3.4 3.6-3.4 2 0 3.4 1.2 3.4 3 0 2.9-3.5 2.7-3.5 5.6M9 15.1v.4',
};
function Mark({ kind }) {
  return <svg className={`mark mark-${kind}`} viewBox="0 0 18 18" aria-hidden="true" focusable="false"><path d={marks[kind]} pathLength="1" /></svg>;
}

/* A margin note in blue pencil: one boundary statement per context. */
function Note({ children, className = '' }) {
  return <p className={`note ${className}`}><Mark kind="bar" /><span>{children}</span></p>;
}

/* An open query in red pencil: a fact the founder still has to supply. */
function Pending({ children }) {
  return <p className="note note-query"><Mark kind="query" /><span><strong>Do uzupełnienia:</strong> {children}</span></p>;
}

function TextLink({ href, children, className = '', onClick, arrow = false }) {
  return <a className={`link ${className}`} href={href} onClick={onClick}><span>{children}</span>{arrow && <ArrowRight aria-hidden="true" />}</a>;
}

function Button({ href, children, type, compact = false }) {
  const inner = <><span>{children}</span><ArrowRight aria-hidden="true" /></>;
  const cls = `btn${compact ? ' btn-compact' : ''}`;
  return href ? <a className={cls} href={href}>{inner}</a> : <button className={cls} type={type || 'button'}>{inner}</button>;
}

/* Text whose words light up with scroll progress (motion.js sets --p on the wrapper). */
function Words({ text }) {
  const tokens = text.split(/(\s+)/);
  const n = tokens.filter(t => t.trim()).length;
  let i = 0;
  return <span className="words" data-words style={{ '--n': n }}>{tokens.map((t, k) => t.trim() ? <span key={k} style={{ '--i': i++ }}>{t}</span> : t)}</span>;
}

function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);
  const toggle = useRef(null);
  const navRef = useRef(null);
  useEffect(() => {
    if (window.location.pathname !== '/' || !('IntersectionObserver' in window)) return;
    const lookup = {};
    for (const [href, ids] of Object.entries(navSections)) ids.forEach(id => { lookup[id] = href; });
    const els = Object.keys(lookup).map(id => document.getElementById(id)).filter(Boolean);
    const visible = new Set();
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) visible.add(e.target.id); else visible.delete(e.target.id); });
      const top = els.filter(el => visible.has(el.id)).map(el => [el.id, el.getBoundingClientRect().top]).sort((a, b) => b[1] - a[1])[0];
      setActive(top ? lookup[top[0]] : null);
    }, { rootMargin: '-20% 0px -60% 0px' });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
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
    <header className="site-header" id="gora">
      <div className="header-inner wrap">
        <a className="wordmark" translate="no" href="/" aria-label={`${site.name}, strona główna`}>{site.name}</a>
        <p className="header-role">{site.descriptor}</p>
        <button className="nav-toggle" ref={toggle} type="button" aria-controls="main-nav" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? 'Zamknij' : 'Menu'}<CaretDown aria-hidden="true" /></button>
        <nav ref={navRef} className={`site-nav ${open ? 'is-open' : ''}`} id="main-nav" aria-label="Nawigacja główna">
          {site.nav.map(item => <a key={item.href} href={item.href} aria-current={active === item.href ? 'true' : undefined} onClick={() => setOpen(false)}>{item.label}</a>)}
        </nav>
      </div>
    </header>
  </>;
}

function Footer() {
  return <footer className="site-footer">
    <div className="wrap">
      <div className="footer-top">
        <a className="footer-wordmark" translate="no" href="/">{site.name}</a>
        <div className="footer-side">
          <p>Niezależny doradca AI.<br />Procesy, jakość i decyzje technologiczne.</p>
          <TextLink href="/#kontakt" arrow>Porozmawiajmy o zadaniu</TextLink>
        </div>
      </div>
      <div className="footer-bottom">
        <p className="colophon">Skład: Brygada 1918, Archivo i IBM Plex Mono, fonty lokalne. Bez śledzenia i analityki. Prototyp; kontakt i dane działalności do uzupełnienia.</p>
        <a href="/prywatnosc/">Prywatność</a>
        <a href="#gora">Na początek</a>
      </div>
    </div>
  </footer>;
}

function Disclosure({ title, children, id }) {
  return <details className="disclosure" id={id}><summary><span>{title}</span><CaretDown aria-hidden="true" /></summary><div className="disclosure-body">{children}</div></details>;
}

function StandardTable({ rows, className = '' }) {
  return <dl className={`standard-table ${className}`}>{rows.map(([title, text]) => <div key={title} className={title === 'Stop' ? 'is-stop' : undefined}><dt>{title}</dt><dd>{pl(text)}</dd></div>)}</dl>;
}

/* Hero exhibit: a draft summary being checked against its source. The headline, enacted.
   Draft state shows the corrections; final state shows the accepted text with the source fragment behind each statement. */
function Proof() {
  const { proof } = site;
  const [state, setState] = useState('draft');
  const [touched, setTouched] = useState(false);
  const show = next => { setTouched(true); setState(next); };
  const final = state === 'final';
  return <figure className="proof" data-state={state} data-touched={touched ? '' : undefined}>
    <div className="proof-bar">
      <p className="proof-title" aria-live="polite">{final ? proof.titles.final : proof.titles.draft}</p>
      <div className="proof-switch" role="group" aria-label="Wersja podsumowania">
        <button type="button" aria-pressed={!final} onClick={() => show('draft')}>Z poprawkami</button>
        <button type="button" aria-pressed={final} onClick={() => show('final')}>Po sprawdzeniu</button>
      </div>
    </div>
    <ol className="proof-rows">
      {proof.rows.map((row, i) => <li key={`${row.source}-${state}`} style={{ '--i': i }}>
        <p className="proof-text">{final ? row.final : row.draft.map(([kind, text], k) => kind === 'del' ? <del key={k}>{text}</del> : <span key={k}>{text}</span>)}</p>
        {final
          ? <p className="proof-margin is-ok"><Mark kind="tick" /><span><span className="visually-hidden">Źródło: </span>„{row.source}”</span></p>
          : row.fix
            ? <p className="proof-margin is-fix"><Mark kind="bar" /><span><span className="visually-hidden">Poprawka: </span>{row.fix}</span></p>
            : <p className="proof-margin is-ok"><Mark kind="tick" /><span>jest w źródle</span></p>}
      </li>)}
    </ol>
    <figcaption>{proof.caption} <a href={samplePath}>Pełny przykład standardu</a></figcaption>
  </figure>;
}

/* One sheet of the consultation dossier. Contents are illustrative and say what kind of material the stage produces. */
function FlowSheet({ sheet, index, total, className = '' }) {
  let body;
  if (sheet.kind === 'card') {
    const { scale } = sheet;
    body = <dl className="fs-card">
      {sheet.rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
      <div><dt>{scale.label}</dt><dd>
        <span className="fs-scale" role="img" aria-label={`Skala od „${scale.from}” do „${scale.to}”, przykładowe zaznaczenie: ${scale.at} z ${scale.steps}`}>
          {Array.from({ length: scale.steps }, (_, i) => <span key={i} className={i + 1 === scale.at ? 'is-at' : undefined}>{i + 1 === scale.at && <Mark kind="tick" />}</span>)}
        </span>
        <span className="fs-scale-ends" aria-hidden="true"><span>{scale.from}</span><span>{scale.to}</span></span>
      </dd></div>
    </dl>;
  } else if (sheet.kind === 'slide') {
    body = <div className="fs-slide"><p className="fs-slide-title">{sheet.heading}</p><ol>{sheet.items.map(item => <li key={item}>{item}</li>)}</ol></div>;
  } else if (sheet.kind === 'contents') {
    body = <ol className="fs-contents">{sheet.items.map(item => <li key={item}><span>{item}</span></li>)}</ol>;
  } else {
    body = <ul className={`fs-list fs-${sheet.kind}`}>{sheet.items.map(item => <li key={item}><Mark kind={sheet.kind === 'questions' ? 'tick' : 'bar'} /><span>{item}</span></li>)}</ul>;
  }
  return <div className={`sheet flow-sheet ${className}`} style={{ '--i': index }}>
    <div className="sheet-bar"><p>{sheet.title}</p><p>{`${index + 1} z ${total}`}</p></div>
    {body}
  </div>;
}

/* The consultation in short: the terms that hold for every engagement, then one action. */
function FlowTerms({ headingLevel: H = 'h3' }) {
  const { flow } = site;
  return <div className="terms">
    <H className="terms-title">{flow.termsTitle}</H>
    <dl className="terms-list">{flow.terms.map(t => <div key={t.title}><dt><Mark kind="tick" />{t.title}</dt><dd>{t.text}</dd></div>)}</dl>
  </div>;
}

/* A call to action that is hard to miss: one sentence, one button, optionally a second link. */
function CallToAction({ title, text, button, href = '/?temat=inne#kontakt', secondary, headingLevel: H = 'h3' }) {
  return <div className="cta">
    <div className="cta-copy"><H className="cta-title">{title}</H>{text && <p>{text}</p>}</div>
    <div className="cta-actions"><Button href={href}>{button}</Button>{secondary}</div>
  </div>;
}

/* Situations. Rendered as a plain list on the server and on narrow screens; on a wide screen with JS it becomes
   a master-detail view (vertical tabs) so one question at a time gets the full stage. */
function Cases() {
  const { cases } = site;
  const [enhanced, setEnhanced] = useState(false);
  const [current, setCurrent] = useState(0);
  const tabs = useRef([]);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 901px)');
    const sync = () => setEnhanced(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  function onKeyDown(event) {
    const last = cases.items.length - 1;
    const next = event.key === 'ArrowDown' ? (current === last ? 0 : current + 1) : event.key === 'ArrowUp' ? (current === 0 ? last : current - 1) : event.key === 'Home' ? 0 : event.key === 'End' ? last : null;
    if (next === null) return;
    event.preventDefault();
    setCurrent(next);
    tabs.current[next]?.focus();
  }
  const detail = c => <>
    <p className="case-question">{c.question}</p>
    <p className="case-situation">{c.situation}</p>
    <dl className="case-facts">
      <div><dt>{cases.panelFirst}</dt><dd>{c.first}</dd></div>
      <div><dt>Format</dt><dd>{c.format}</dd></div>
    </dl>
  </>;
  return <section className="section cases wrap" id="sytuacje" aria-labelledby="cases-title">
    <div className="section-head">
      <h2 id="cases-title">{cases.title}</h2>
      <p className="section-lead">{cases.intro}</p>
    </div>
    {enhanced
      ? <div className="case-browser">
        <div className="case-tabs" role="tablist" aria-orientation="vertical" aria-labelledby="cases-title" onKeyDown={onKeyDown}>
          {cases.items.map((c, i) => <button key={c.role} ref={el => { tabs.current[i] = el; }} type="button" role="tab" id={`case-tab-${i}`} aria-selected={i === current} aria-controls="case-panel" tabIndex={i === current ? 0 : -1} onClick={() => setCurrent(i)}>
            <span className="case-tab-index" aria-hidden="true">{i + 1}</span><span>{c.role}</span>
          </button>)}
        </div>
        <div className="sheet case-panel" role="tabpanel" id="case-panel" aria-labelledby={`case-tab-${current}`} tabIndex="0">
          <div className="sheet-bar"><p>{cases.items[current].role}</p><p>{`${current + 1} z ${cases.items.length}`}</p></div>
          <div className="case-panel-body" key={current}>
            {detail(cases.items[current])}
            <Button href="/?temat=inne#kontakt" compact>{cases.panelCta}</Button>
          </div>
        </div>
      </div>
      : <ul className="case-list">{cases.items.map(c => <li key={c.role}>
        <h3>{c.role}</h3>
        <div className="case-text">{detail(c)}</div>
      </li>)}</ul>}
    <Note className="section-note">{cases.note}</Note>
  </section>;
}

/* The consultation as a scrolled presentation: one stage per screen, and the whole page takes the stage's theme.
   Each slide carries its own theme, so the page is complete without JS; with motion the theme moves to <html>
   and cross-fades as slides pass the middle of the screen. */
function DeckPage() {
  const { flow } = site;
  const total = flow.stages.length;
  const [active, setActive] = useState(-1);
  const deck = useRef(null);
  useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains('js-motion')) return;
    const slides = Array.from(deck.current.querySelectorAll('.slide'));
    let frame = 0;
    const update = () => {
      frame = 0;
      const middle = window.innerHeight / 2;
      const slide = slides.find(el => { const r = el.getBoundingClientRect(); return r.top <= middle && r.bottom > middle; });
      if (!slide) return;
      if (html.dataset.theme !== slide.dataset.theme) html.dataset.theme = slide.dataset.theme;
      setActive(Number(slide.dataset.index));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(frame); delete html.dataset.theme; };
  }, []);
  return <main id="tresc" tabIndex="-1" className="deck" ref={deck}>
    <section className="slide slide-intro" data-theme="paper" data-index="-1" aria-labelledby="deck-title">
      <div className="wrap">
        <a className="back-link" href="/#przebieg"><ArrowLeft aria-hidden="true" />Wróć na stronę główną</a>
        <h1 id="deck-title">{flow.deck.title}</h1>
        <p className="slide-lead">{flow.lead}</p>
        <ol className="deck-index">{flow.stages.map((stage, i) => <li key={stage.title}><a href={`#etap-${i + 1}`}><span aria-hidden="true">{i + 1}</span>{stage.title}</a></li>)}</ol>
      </div>
    </section>
    {flow.stages.map((stage, i) => <section key={stage.title} className={`slide slide-stage${i % 2 ? ' is-flipped' : ''}`} id={`etap-${i + 1}`} data-theme={flow.deck.themes[i]} data-index={i} aria-labelledby={`etap-${i + 1}-title`}>
      <div className="wrap slide-grid">
        <div className="slide-copy">
          <p className="slide-numeral" aria-hidden="true">{i + 1}</p>
          <h2 id={`etap-${i + 1}-title`}>{stage.title}</h2>
          <p className="slide-text">{stage.text}</p>
          <p className="note slide-value"><Mark kind="tick" /><span>{stage.value}</span></p>
        </div>
        <div className="slide-visual"><FlowSheet sheet={stage.sheet} index={i} total={total} /></div>
      </div>
    </section>)}
    <section className="slide slide-end" data-theme="blue" data-index={total} aria-labelledby="deck-end-title">
      <div className="wrap">
        <h2 id="deck-end-title">{flow.cta.title}</h2>
        <p className="slide-lead">{flow.cta.text}</p>
        <div className="slide-end-actions"><Button href="/?temat=inne#kontakt">{flow.cta.button}</Button><TextLink href="/#zakres">Zobacz formaty współpracy</TextLink></div>
        <FlowTerms headingLevel="h3" />
        <Note className="section-note">{flow.note}</Note>
      </div>
    </section>
    <nav className="deck-rail" aria-label="Etapy konsultacji">
      <ol>{flow.stages.map((stage, i) => <li key={stage.title}><a href={`#etap-${i + 1}`} aria-current={i === active ? 'step' : undefined}><span className="visually-hidden">{`Etap ${i + 1}: ${stage.title}`}</span></a></li>)}</ol>
    </nav>
  </main>;
}

/* The main use case: five stages, each leaving a sheet. On wide screens the sheets pile up beside the text as the reader scrolls,
   so the finished dossier is on the desk by the last stage. Without JS or motion the pile is simply complete. */
function Flow() {
  const { flow } = site;
  const total = flow.stages.length;
  const [active, setActive] = useState(total - 1);
  const [live, setLive] = useState(false);
  const list = useRef(null);
  useEffect(() => {
    if (!document.documentElement.classList.contains('js-motion') || !('IntersectionObserver' in window) || !window.matchMedia('(min-width: 901px)').matches) return;
    const items = Array.from(list.current.children);
    const seen = new Set();
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { const i = items.indexOf(e.target); if (e.isIntersecting) seen.add(i); else seen.delete(i); });
      if (seen.size) setActive(Math.max(...seen));
      else if (items[0].getBoundingClientRect().top > window.innerHeight * 0.5) setActive(0);
    }, { rootMargin: '-10% 0px -50% 0px' });
    items.forEach(el => io.observe(el));
    setActive(0); setLive(true);
    return () => io.disconnect();
  }, []);
  return <section className="section flow wrap" id="przebieg" aria-labelledby="flow-title" data-live={live ? '' : undefined}>
    <div className="section-head">
      <h2 id="flow-title">{flow.title}</h2>
      <p className="section-lead">{flow.lead}</p>
    </div>
    <div className="flow-grid">
      <ol className="flow-list" ref={list}>
        {flow.stages.map((stage, i) => <li key={stage.title} className={i === active ? 'is-active' : undefined}>
          <span className="flow-numeral" aria-hidden="true">{i + 1}</span>
          <div className="flow-text">
            <h3>{stage.title}</h3>
            <p>{stage.text}</p>
            <p className="note flow-value"><Mark kind="tick" /><span>{stage.value}</span></p>
            <FlowSheet sheet={stage.sheet} index={i} total={total} className="flow-sheet-inline" />
          </div>
        </li>)}
      </ol>
      <div className="flow-pile" aria-hidden="true">
        {flow.stages.map((stage, i) => <FlowSheet key={stage.title} sheet={stage.sheet} index={i} total={total} className={`flow-sheet-piled${i > active ? ' is-ahead' : ''}${i === active ? ' is-top' : ''}`} />)}
      </div>
    </div>
    <Note className="section-note">{flow.note}</Note>
    <div className="flow-close">
      <FlowTerms />
      <CallToAction title={flow.cta.title} text={flow.cta.text} button={flow.cta.button} secondary={<TextLink href={deckPath} arrow>{flow.deck.link}</TextLink>} />
    </div>
  </section>;
}

function Home() {
  const { offer, cases, formats, workflow, consultation, review, standard, perspective } = site;
  return <main id="tresc" tabIndex="-1">
    <section className="hero wrap" aria-labelledby="hero-title">
      <h1 id="hero-title">{site.hero.lines.map((line, i) => <span className="hero-line" key={line} style={{ '--i': i }}><span className="hero-line-inner">{line}{i < site.hero.lines.length - 1 ? ' ' : ''}</span></span>)}</h1>
      <div className="hero-row">
        <div className="hero-copy">
          <p className="hero-lead">{site.hero.lead}</p>
          <div className="hero-actions">
            <Button href="#kontakt">Opisz zadanie</Button>
            <TextLink href="#przebieg">Zobacz, jak przebiega konsultacja</TextLink>
          </div>
          <div className="perspective">
            <p className="perspective-title">{perspective.title}</p>
            <p className="perspective-copy">{perspective.text}</p>
          </div>
        </div>
        <Proof />
      </div>
    </section>

    <section className="offer" id="wspolpraca" aria-labelledby="offer-heading">
      <div className="wrap offer-grid">
        <div className="offer-main">
          <h2 id="offer-heading">{offer.name}</h2>
          <p className="offer-subtitle">{offer.subtitle}</p>
          <p className="offer-intro"><Words text={offer.intro} /></p>
        </div>
        <nav className="offer-index" aria-label="Formaty współpracy">
          <p className="offer-index-title">{offer.link}</p>
          <ul>
            {[[workflow, '#standard-dla-zespolu'], [consultation, '#konsultacja'], [review, '#przeglad-oferty']].map(([f, href]) => <li key={href}>
              <a href={href}><span className="offer-index-name">{f.name}</span><span className="offer-index-sub">{f.subtitle}</span><ArrowRight aria-hidden="true" /></a>
            </li>)}
          </ul>
        </nav>
      </div>
    </section>

    <Flow />

    <Cases />

    <section className="section formats wrap" id="zakres" aria-labelledby="formats-title">
      <div className="section-head">
        <h2 id="formats-title">{formats.title}</h2>
        <p className="section-lead">{formats.lead}</p>
      </div>
      <div className="format-grid">
        <article className="format format-primary" id="standard-dla-zespolu" aria-labelledby="format-w">
          <header className="format-head"><h3 id="format-w">{workflow.name}</h3><p>{workflow.subtitle}</p></header>
          <p className="format-text">{workflow.text}</p>
          <h4 className="format-sub">{workflow.resultTitle}</h4>
          <dl className="result-list">{workflow.result.map(item => <div key={item.title}><dt>{item.title}</dt><dd>{item.text}</dd></div>)}</dl>
          <div className="disclosures">
            <Disclosure id="warunki-w" title="Dla kogo, jak długo i czego potrzebujemy">{workflow.conditions.map(p => <p key={p}>{p}</p>)}</Disclosure>
            <Disclosure title="Granice zakresu i odpowiedzialności">{workflow.boundaries.map(p => <p key={p}>{p}</p>)}</Disclosure>
          </div>
          <TextLink href="/?temat=zadanie#kontakt" arrow>Opisz zadanie zespołu</TextLink>
        </article>
        <div className="format-side">
          <article className="format" id="konsultacja" aria-labelledby="format-k">
            <header className="format-head"><h3 id="format-k">{consultation.name}</h3><p>{consultation.subtitle}</p></header>
            <p className="format-text">{consultation.text}</p>
            <p className="format-text">{consultation.outcome}</p>
            <div className="disclosures"><Disclosure title="Format i rezultat konsultacji">{consultation.details.map(p => <p key={p}>{p}</p>)}</Disclosure></div>
            <TextLink href="/?temat=decyzja#kontakt" arrow>Opisz decyzję</TextLink>
          </article>
          <article className="format" id="przeglad-oferty" aria-labelledby="format-r">
            <header className="format-head"><h3 id="format-r">{review.name}</h3><p>{review.subtitle}</p></header>
            <p className="format-text">{review.text}</p>
            <TextLink href="/?temat=oferta#kontakt" arrow>Zapytaj o przegląd oferty</TextLink>
          </article>
        </div>
      </div>
      <Note className="section-note">{formats.boundaryNote}</Note>
      <CallToAction title="Nie wiesz, który format pasuje?" text="Opisz sytuację. Format dobiorę do pytania i potwierdzę zakres przed rozpoczęciem." button="Opisz sytuację" />
    </section>

    <section className="exhibit" id="standard" aria-labelledby="exhibit-title">
      <div className="wrap exhibit-grid">
        <div className="exhibit-side">
          <h2 id="exhibit-title">{standard.title}</h2>
          <p className="exhibit-caption">{pl('Przykład standardu na materiale syntetycznym, przed próbą. Pełny zapis z instrukcją roboczą, wzorcem wyniku i kryteriami oceny jest na osobnej stronie.')}</p>
          <TextLink href={samplePath} arrow>Otwórz pełny przykład</TextLink>
        </div>
        <div className="sheet exhibit-sheet">
          <div className="sheet-bar"><p>Standard pracy</p><p>Przykład, materiał syntetyczny</p></div>
          <StandardTable rows={standard.rows.slice(0, standard.exhibitRows)} />
          <div className="sheet-foot"><p>{`${standard.exhibitRows} z ${standard.rows.length} pozycji`}</p><a href={samplePath}>Pozostałe: właściciel i wykluczenia</a></div>
        </div>
      </div>
    </section>

    <section className="section method wrap" id="podejscie" aria-labelledby="method-title">
      <h2 id="method-title">Najpierw zadanie. Potem wybór narzędzia.</h2>
      <ol className="method-steps">{site.method.map((step, i) => <li key={step.title}>
        <span className="step-numeral" aria-hidden="true">{i + 1}</span>
        <h3>{step.title}</h3>
        <p>{step.text}</p>
      </li>)}</ol>
      <p className="method-closing">{site.methodClosing}</p>
    </section>

    <section className="principles" id="zasady" aria-labelledby="principles-title">
      <div className="wrap principles-grid">
        <h2 id="principles-title">Czego nie robię</h2>
        <ul>{site.principles.map(p => {
          const rest = p.replace(/^Nie\s+/, '');
          return <li key={p}><span className="principle-no">Nie</span><span className="principle-text">{rest}</span></li>;
        })}</ul>
        <div className="principles-cta"><p>Zamiast tego zaczynam od Twojego zadania.</p><Button href="#kontakt">Opisz zadanie</Button></div>
      </div>
    </section>

    <section className="section analyses wrap" id="analizy" aria-labelledby="analyses-title">
      <h2 id="analyses-title">Kilka decyzji, którym warto przyjrzeć się bliżej.</h2>
      <div className="analysis-list">{articles.map(article => <article key={article.slug}>
        <p className="meta"><span>{formatDate(article.date)}</span><span>{readingMinutes(article.blocks)} min czytania</span></p>
        <h3><a href={`/analizy/${article.slug}/`}>{article.title}</a></h3>
        <p className="analysis-lead">{article.lead}</p>
        <ArrowRight className="analysis-arrow" aria-hidden="true" />
      </article>)}</div>
    </section>

    <section className="section about wrap" id="o-mnie" aria-labelledby="about-title">
      <h2 id="about-title">Perspektywa produktowa. Techniczna ocena. Zrozumiały wniosek.</h2>
      <div className="about-grid">
        <div className="about-bio">
          <p>{pl(`Jestem ${site.name}. Pracuję jako Technical Product Manager. Łączę analizę procesów, architekturę i integrację systemów z wiedzą o modelach językowych, agentach oraz automatyzacji.`)}</p>
          <p>{pl('W doradztwie wykorzystuję tę perspektywę do oceny, która zmiana ma sens i jak sprawdzić jej rezultat.')}</p>
          <Pending>zweryfikowane doświadczenie i publiczny profil zawodowy.</Pending>
        </div>
        <dl className="expertise">{site.expertise.map(item => <div key={item.title}><dt>{item.title}</dt><dd>{item.text}</dd></div>)}</dl>
      </div>
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
  return <section className="contact" id="kontakt" aria-labelledby="contact-title">
    <div className="wrap contact-grid">
      <div className="contact-intro">
        <h2 id="contact-title">Opisz jedno zadanie lub decyzję.</h2>
        <p>{pl('Napisz, co chcesz usprawnić, z jakiego narzędzia korzystasz i na czym polega trudność. Jeśli możesz, dodaj częstotliwość zadania oraz termin.')}</p>
        <p>{pl('Najpierw sprawdzę dopasowanie zakresu. Jeśli temat mieści się w mojej roli, ustalimy następny krok, cenę i terminy.')}</p>
        <Note>{pl('Na początek wystarczy ogólny opis. Nie wpisuj danych klientów, haseł ani poufnych dokumentów.')}</Note>
        <Pending>adres e-mail i termin odpowiedzi.</Pending>
      </div>
      <div className="sheet contact-sheet">
        <div className="sheet-bar"><p>Opis zadania</p><p>Formularz demonstracyjny</p></div>
        <div className="contact-form-area">
          <p className="demo-notice">Opis jest sprawdzany tylko w tej karcie; nic nie jest wysyłane do serwera ani modelu AI. <a href="/prywatnosc/">Prywatność prototypu</a>.</p>
          <form noValidate onSubmit={submit} aria-label="Opis zadania lub decyzji">
            <fieldset disabled={!ready}>
              <legend className="visually-hidden">Dane do przygotowania opisu</legend>
              {Object.keys(errors).length > 0 && <div className="error-summary" ref={errorBox} tabIndex="-1" role="alert"><p>Sprawdź oznaczone pola.</p>{Object.entries(errors).map(([id, text]) => <a key={id} href={`#contact-${id}`}>{text}</a>)}</div>}
              <div className="form-row"><label htmlFor="contact-email">E-mail <span>(wymagany)</span></label><input id="contact-email" name="email" type="email" autoComplete="email" spellCheck="false" maxLength="254" value={values.email} onChange={change} required aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'error-email' : undefined} />{errors.email && <p className="field-error" id="error-email">{errors.email}</p>}</div>
              <div className="optional-fields">
                <div className="form-row"><label htmlFor="contact-name">Imię <span>(opcjonalne)</span></label><input id="contact-name" name="name" autoComplete="given-name" maxLength="100" value={values.name} onChange={change} /></div>
                <div className="form-row"><label htmlFor="contact-company">Firma / rola <span>(opcjonalne)</span></label><input id="contact-company" name="company" autoComplete="organization" maxLength="150" value={values.company} onChange={change} /></div>
              </div>
              <div className="form-row"><label htmlFor="contact-topic">Temat</label><div className="select-wrap"><select id="contact-topic" name="topic" value={values.topic} onChange={change}><option value="zadanie">Jedno zadanie zespołu</option><option value="decyzja">Jedna decyzja AI</option><option value="oferta">Przegląd oferty AI</option><option value="inne">Inny temat / jeszcze nie wiem</option></select><CaretDown aria-hidden="true" /></div></div>
              <div className="form-row"><label htmlFor="contact-message">Krótki opis <span>(wymagany)</span></label><p className="field-hint" id="message-hint">Zadanie lub decyzja, obecne narzędzie i główna trudność.</p><textarea id="contact-message" name="message" rows="6" maxLength="4000" value={values.message} onChange={change} required aria-invalid={Boolean(errors.message)} aria-describedby={`message-hint${errors.message ? ' error-message' : ''}`} />{errors.message && <p className="field-error" id="error-message">{errors.message}</p>}</div>
              <Button type="submit" compact>Sprawdź opis</Button>
            </fieldset>
            <noscript><p>Ten podgląd wymaga JavaScript do sprawdzenia opisu. Formularz nie wysyła wiadomości.</p></noscript>
          </form>
          {preview && <div className="draft-preview" ref={previewBox} tabIndex="-1" role="region" aria-label="Podgląd opisu">
            <p className="draft-title"><Mark kind="tick" />Opis jest gotowy.</p>
            <p>To podgląd; niczego nie wysłano.</p>
            <pre>{preview}</pre>
            <button type="button" className="link" onClick={copyDraft}>{copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}<span>{copied ? 'Skopiowano opis' : 'Kopiuj opis'}</span></button>
            <p className="visually-hidden" role="status">{copied ? 'Opis skopiowano do schowka.' : ''}</p>
            {copyError && <p role="status">Przeglądarka nie pozwoliła skopiować opisu. Możesz zaznaczyć go powyżej i skopiować ręcznie.</p>}
          </div>}
        </div>
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

function ArticleFrame({ kind, title, lead, meta, theses, terms, children, backHref, backLabel, dropcap = false }) {
  return <main id="tresc" tabIndex="-1" className="article-page">
    <div className="wrap">
      <a className="back-link" href={backHref}><ArrowLeft aria-hidden="true" />{backLabel}</a>
      <header className="article-header">
        <p className="article-kind">{kind}</p>
        <h1>{title}</h1>
        <p className="article-lead">{lead}</p>
        {meta && <p className="meta">{meta.map(m => <span key={m}>{m}</span>)}</p>}
      </header>
      {theses && <ol className="theses" aria-label="W skrócie">{theses.map(t => <li key={t}>{t}</li>)}</ol>}
      <div className="article-body">
        <div className={`article-reading ${dropcap ? 'has-dropcap' : ''}`}>{children}</div>
        <Marginalia terms={terms} />
      </div>
      <aside className="article-contact"><h2>Masz podobne pytanie w swoim zespole?</h2><Button href="/#kontakt">Opisz zadanie lub decyzję</Button></aside>
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
  const meta = [formatDate(article.date), `${readingMinutes(article.blocks)} min czytania`, `Opracowanie: ${site.name}`];
  return <ArticleFrame kind="Analiza" title={article.title} lead={article.lead} meta={meta} theses={article.theses} terms={article.terms} backHref="/#analizy" backLabel="Wróć do analiz" dropcap>
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
  return <ArticleFrame kind="Przykład standardu, dane syntetyczne" title={standard.title} lead="Projekt standardu: wymagane wejście, kontrola faktów, rola człowieka i warunki przerwania pracy." meta={['Materiał syntetyczny', formatDate('29.10.2026'), `Opracowanie: ${site.name}`]} terms={['standard', 'operator', 'wlasciciel-procesu', 'blad-krytyczny', 'proba']} backHref="/#standard" backLabel="Wróć do przykładu na stronie głównej">
    <p className="boundary"><strong>Demonstracja metody, test nieprzeprowadzony.</strong> Cały materiał jest syntetyczny. Nie opisuje zlecenia, rzeczywistego klienta ani wyniku działania modelu.</p>
    <h2>Pytanie</h2><p>Jak przygotować podsumowanie dla opiekuna projektu tak, aby nie dopisywać ustaleń, których nie ma w notatce? Ten przykład pokazuje strukturę sposobu pracy, a nie skuteczność całego procesu w firmie.</p>
    <h2>Materiał syntetyczny</h2><blockquote>Rozmowa o etapowym uruchomieniu obsługi. Klient chce najpierw ustalić zakres źródeł danych i liczbę użytkowników. Budżet wymaga potwierdzenia. Termin wdrożenia nie został uzgodniony. Opiekun ma przygotować pytania do kolejnej rozmowy. Nie ustalono terminu następnego spotkania.</blockquote><p>To całość źródła przykładu.</p>
    <h2>Projekt standardu</h2><div className="sheet"><div className="sheet-bar"><p>Standard pracy</p><p>Przykład, materiał syntetyczny</p></div><StandardTable rows={standard.rows} /></div>
    <h2>Instrukcja robocza</h2><div className="instruction-excerpt"><p>Na podstawie wyłącznie podanej notatki przygotuj robocze podsumowanie dla opiekuna projektu. Oddziel ustalenia, informacje do potwierdzenia, pytania i następny krok.</p><p>Nie uzupełniaj brakujących kwot, dat ani zobowiązań. Przy braku informacji wpisz „nie ustalono” albo „do potwierdzenia”. Dla każdej pozycji ustaleń przytocz krótki fragment źródła. Nie wysyłaj wiadomości i nie wykonuj działań w innych systemach.</p></div><p>To projekt instrukcji wymagający próby. Sam jej zapis nie gwarantuje, że model będzie przestrzegał ograniczeń.</p>
    <h2>Oczekiwany wzorzec redakcyjny</h2><p><strong>Ustalenia:</strong> rozmowa dotyczy etapowego uruchomienia obsługi; przed następnym etapem trzeba określić zakres źródeł i liczbę użytkowników.</p><p><strong>Do potwierdzenia:</strong> budżet. <strong>Nie ustalono:</strong> terminu wdrożenia i kolejnego spotkania. <strong>Następny krok:</strong> opiekun przygotowuje pytania o źródła danych oraz użytkowników.</p><p className="section-remark">Wzorzec napisał autor materiału. Nie jest wynikiem uruchomienia modelu.</p>
    <h2>Kryteria przed próbą</h2><div className="sheet"><StandardTable rows={[
      ['Zgodność ze źródłem, krytyczne', 'Każde ustalenie ma podstawę w notatce.'],
      ['Brak dopisanych zobowiązań, krytyczne', 'Nieustalona data, cena lub obietnica nie jest przedstawiona jako fakt.'],
      ['Jawne braki', 'Budżet, termin wdrożenia i spotkania zachowują status niewiadomej.'],
      ['Użyteczność', 'Opiekun wie, o co zapytać i co zrobić dalej.'],
      ['Zakres działania, krytyczne', 'Materiał pozostaje roboczy. Bez wysyłki lub zmiany w systemie.'],
    ]} /></div><p>Do przyszłej próby potrzebne są przypadki typowe, niepełne, sprzeczne, z niejasną odpowiedzialnością i z żądaniem działania poza zakresem. Przykłady projektowe należy oddzielić od pozostawionych do oceny.</p>
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

function NotFound() {
  return <main id="tresc" tabIndex="-1" className="wrap not-found"><p className="article-kind">Nie znaleziono strony</p><h1>Wróćmy do właściwego miejsca.</h1><Button href="/">Przejdź na stronę główną</Button></main>;
}

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
    return initMotion();
  }, [normalizedPath]);
  const article = articles.find(a => normalizedPath === `/analizy/${a.slug}/`);
  const page = normalizedPath === '/' ? <Home /> : article ? <ArticlePage article={article} /> : normalizedPath === samplePath ? <SamplePage /> : normalizedPath === deckPath ? <DeckPage /> : normalizedPath === '/prywatnosc/' ? <PrivacyPage /> : <NotFound />;
  return <><Header />{page}<Footer /></>;
}
