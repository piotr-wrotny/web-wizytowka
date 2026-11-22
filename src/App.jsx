import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowLeft, CaretDown, Copy, Check } from '@phosphor-icons/react';
import { site as rawSite } from './content/site';
import { articles as rawArticles, formatDate, readingMinutes } from './content/articles';
import { glossary as rawGlossary } from './content/glossary';
import { initMotion } from './motion';

const samplePath = '/materialy/przyklad-standardu/';
const pathHref = '/#przebieg';
// The former presentation page. Since 2026-11-22 the home page carries the path itself; the old address opens it there.
const legacyDeckPath = '/konsultacja/';
const guidePath = rawSite.guide.path;
const compendiumPath = rawSite.compendium.path;

/* Polish typesetting: a one-letter word never ends a line. Binds i, w, z, o, a, u (and capitals) to the next word. */
export function pl(text) {
  return typeof text === 'string' ? text.replace(/(?<=^|[\s(„])([aiouwzAIOUWZ])\s(?=\S)/g, '$1\u00a0') : text;
}
const plDeep = v => typeof v === 'string' ? pl(v) : Array.isArray(v) ? v.map(plDeep) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, plDeep(x)])) : v;
const site = plDeep(rawSite);
const articles = plDeep(rawArticles);
const glossary = plDeep(rawGlossary);

const navSections = {
  '/#przebieg': ['przebieg'],
  '/#sytuacje': ['sytuacje'],
  '/#zakres': ['zakres'],
  '/#o-mnie': ['o-mnie'],
  '/#kontakt': ['kontakt'],
};

export function getPageMeta(path) {
  const article = articles.find(a => path === `/analizy/${a.slug}/`);
  if (article) return { title: `${article.title} — ${site.descriptor}`, description: article.lead };
  if (path === samplePath) return { title: 'Przykład standardu pracy z AI — dane syntetyczne', description: 'Otwarta demonstracja metody: wejście, kontrola faktów, odpowiedzialność i warunki przerwania pracy.' };
  if (path === site.principlesPath) return { title: `${site.principlesTitle} — ${site.name}`, description: site.principlesLead };
  if (path === guidePath) return { title: `Przewodnik po AI i narzędziach — ${site.name}`, description: site.guide.lead };
  if (path === compendiumPath) return { title: 'Przykładowe kompendium po konsultacji — dane syntetyczne', description: 'Jak wygląda dokument, który zostaje po konsultacji: moduły ogólne i rozdziały napisane dla jednej firmy. Przykład w całości syntetyczny.' };
  if (path === '/prywatnosc/') return { title: 'Prywatność prototypu — niezależny doradca AI', description: 'Jak działają demonstracyjne formularze i co wymaga uzupełnienia przed uruchomieniem obsługi zapytań.' };
  return { title: `${site.name} — niezależny doradca AI`, description: 'Konsultacje AI szyte na miarę: od pierwszej rozmowy do kompendium, które zostaje w firmie. Doradzam, nie wdrażam. Bezpłatny przewodnik po AI i narzędziach.' };
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
function Words({ text, manual = false }) {
  const tokens = text.split(/(\s+)/);
  const n = tokens.filter(t => t.trim()).length;
  let i = 0;
  return <span className="words" data-words={manual ? undefined : ''} style={{ '--n': n }}>{tokens.map((t, k) => t.trim() ? <span key={k} style={{ '--i': i++ }}>{t}</span> : t)}</span>;
}

function Header({ overHero = false, path }) {
  const [open, setOpen] = useState(false);
  const [onHero, setOnHero] = useState(overHero);
  const bar = useRef(null);
  useEffect(() => {
    if (!overHero) { setOnHero(false); return; }
    const hero = document.querySelector('.hero');
    if (!hero) return;
    const update = () => setOnHero(hero.getBoundingClientRect().bottom > (bar.current?.offsetHeight || 0));
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, [overHero]);
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
    <header className="site-header" id="gora" ref={bar} data-over-hero={onHero ? '' : undefined}>
      <div className="header-inner wrap">
        <a className="wordmark" translate="no" href="/" aria-label={`${site.name}, strona główna`}>{site.name}</a>
        <p className="header-role">{site.descriptor}</p>
        <button className="nav-toggle" ref={toggle} type="button" aria-controls="main-nav" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? 'Zamknij' : 'Menu'}<CaretDown aria-hidden="true" /></button>
        <nav ref={navRef} className={`site-nav ${open ? 'is-open' : ''}`} id="main-nav" aria-label="Nawigacja główna">
          {site.nav.map(item => <a key={item.href} href={item.href} aria-current={active === item.href ? 'true' : path === item.href ? 'page' : undefined} onClick={() => setOpen(false)}>{item.label}</a>)}
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
        <a href={site.principlesPath}>{site.principlesTitle}</a>
        <a className="motion-on" href="?motion">Włącz animacje</a>
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

/* Sample-page exhibit: a draft summary being checked against its source.
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
    <figcaption>{proof.caption}</figcaption>
  </figure>;
}

/* Stage 0 keeps what can be read without talking to anyone: the guide and the analyses. Its sheet is a real index. */
const openLinks = [
  { label: site.guide.form.subject, meta: 'PDF', href: guidePath },
  ...articles.map(a => ({ label: a.title, meta: `${readingMinutes(a.blocks)} min`, href: `/analizy/${a.slug}/` })),
];

/* One sheet of the consultation dossier. Contents are illustrative and say what kind of material the stage produces. */
function FlowSheet({ sheet, index = 0, label, className = '' }) {
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
  } else if (sheet.kind === 'links') {
    body = <ul className="fs-list fs-links">{openLinks.map(link => <li key={link.href}><a href={link.href}>{link.label}</a><span>{link.meta}</span></li>)}</ul>;
  } else {
    body = <ul className={`fs-list fs-${sheet.kind}`}>{sheet.items.map(item => <li key={item}><Mark kind={sheet.kind === 'questions' ? 'tick' : 'bar'} /><span>{item}</span></li>)}</ul>;
  }
  return <div className={`sheet flow-sheet ${className}`} style={{ '--i': index }}>
    <div className="sheet-bar"><p>{sheet.title}</p><p>{label}</p></div>
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

/* Situations. Rendered as a list of native disclosures on the server and on narrow screens; on a wide screen with JS it becomes
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
  const facts = c => <dl className="case-facts">
    <div><dt>{cases.panelFirst}</dt><dd>{c.first}</dd></div>
    <div><dt>Format</dt><dd>{c.format}</dd></div>
  </dl>;
  const detail = c => <>
    <p className="case-question">{c.question}</p>
    <p className="case-situation">{c.situation}</p>
    {facts(c)}
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
      : <div className="case-list">{cases.items.map(c => <details className="disclosure case-item" key={c.role}>
        <summary><span><span className="case-role">{c.role}</span><span className="case-question">{c.question}</span></span><CaretDown aria-hidden="true" /></summary>
        <div className="disclosure-body"><p className="case-situation">{c.situation}</p>{facts(c)}</div>
      </details>)}</div>}
    <Note className="section-note">{cases.note}</Note>
  </section>;
}

/* The client path, one stage per screen: open knowledge (0), then the five stages of the consultation, then one closing screen.
   Every screen has the same composition (number, name, one sentence, what it gives, one sheet, at most one link), so the reader
   only ever moves down. Each slide carries its own theme, so the page is complete without JS. With motion the theme moves to <html>
   and cross-fades; on a wide screen every stage is pinned while its scene plays, and each slide gets --sp (0 to 1), its progress
   through the viewport, which the stylesheet turns into the choreography. */
function Path() {
  const { flow } = site;
  const stages = flow.stages;
  const sheets = stages.length - 1;
  const [active, setActive] = useState(-1);
  const deck = useRef(null);
  useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains('js-motion')) return;
    const slides = Array.from(deck.current.querySelectorAll('.slide'));
    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      const middle = vh / 2;
      let current = null;
      for (const el of slides) {
        const r = el.getBoundingClientRect();
        if (r.top <= middle && r.bottom > middle) current = el;
        const pinned = r.height > vh * 1.3;
        const travel = pinned ? vh * 0.85 + (r.height - vh) : vh * 0.95;
        el.style.setProperty('--sp', Math.min(1, Math.max(0, (vh * 0.85 - r.top) / travel)).toFixed(4));
      }
      const theme = current?.dataset.theme;
      if (theme && html.dataset.theme !== theme) html.dataset.theme = theme;
      if (!theme && html.dataset.theme) delete html.dataset.theme;
      setActive(current ? Number(current.dataset.index) : -1);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(frame); delete html.dataset.theme; };
  }, []);
  return <div className="deck" id="przebieg" ref={deck} data-on={active >= 0 ? '' : undefined}>
    {stages.map((stage, i) => <section key={stage.title} className="slide slide-stage" id={`etap-${i}`} data-theme={flow.themes[i]} data-index={i} aria-labelledby={`etap-${i}-title`}>
      <div className="slide-pin">
        <div className="wrap slide-grid">
          <div className="slide-copy">
            <p className="slide-numeral" aria-hidden="true">{i}</p>
            <h2 id={`etap-${i}-title`}><span className="visually-hidden">{`Etap ${i}: `}</span><span className="slide-title-inner">{stage.title}</span></h2>
            <svg className="slide-underline" viewBox="0 0 320 14" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M3 9.5C42 4 86 3.5 128 6.5s96 5.5 189-2.5" pathLength="1" /></svg>
            <p className="slide-text"><Words text={stage.text} manual /></p>
            <p className="note slide-value"><Mark kind="tick" /><span>{stage.value}</span></p>
            {stage.action && <p className="slide-action"><TextLink href={stage.action.href} arrow>{stage.action.label}</TextLink></p>}
          </div>
          <div className="slide-visual">
            {i === sheets && <div className="slide-stack" aria-hidden="true">{stages.slice(1, -1).map((s, k) => <div className="slide-stack-tab" key={s.title} style={{ '--k': k }}><p>{s.sheet.title}</p><p>{`${k + 1} z ${sheets}`}</p></div>)}</div>}
            <FlowSheet sheet={stage.sheet} index={i} label={i ? `${i} z ${sheets}` : stage.sheet.label} />
          </div>
        </div>
      </div>
    </section>)}
    <section className="slide slide-end" data-theme="blue" data-index={stages.length} aria-labelledby="path-end-title">
      <div className="wrap">
        <h2 id="path-end-title"><span className="slide-title-inner">{flow.cta.title}</span></h2>
        <p className="slide-lead">{flow.cta.text}</p>
        <div className="slide-end-actions"><Button href="/?temat=inne#kontakt">{flow.cta.button}</Button></div>
        <FlowTerms headingLevel="h3" />
        <Note className="section-note">{flow.note}</Note>
      </div>
    </section>
    <nav className="deck-rail" aria-label={flow.indexLabel}>
      <ol>{stages.map((stage, i) => <li key={stage.title}><a href={`#etap-${i}`} aria-current={i === active ? 'step' : undefined}><span className="deck-rail-label">{`${i}. ${stage.title}`}</span></a></li>)}</ol>
    </nav>
  </div>;
}

/* Home is the client path, read screen by screen: the offer in one sentence, the path (stages 0 to 5 and its closing screen),
   then the evidence and the background: situations, formats, the person, and the card that starts the first conversation. */
function Home() {
  const { flow, formats, workflow, consultation, review } = site;
  const sheets = flow.stages.length - 1;
  return <main id="tresc" tabIndex="-1">
    <section className="hero theme-blue" aria-labelledby="hero-title">
      <div className="wrap">
        <div className="hero-row">
          <div className="hero-copy">
            <h1 id="hero-title">{site.hero.lines.map((line, i) => <span className="hero-line" key={line} style={{ '--i': i }}><span className="hero-line-inner">{line}{i < site.hero.lines.length - 1 ? ' ' : ''}</span></span>)}</h1>
            <p className="hero-lead">{site.hero.lead}</p>
            <div className="hero-actions"><Button href="/?temat=inne#kontakt">{flow.cta.button}</Button></div>
          </div>
          {/* The finished dossier: the four sheets a consultation leaves behind, the compendium on top. Stage 0 and the optional
              fifth stage leave no document, so they are not in the pile. Decorative here; the path below carries the content. */}
          <div className="hero-pile" aria-hidden="true">
            {flow.stages.slice(1, -1).map((stage, i) => <FlowSheet key={stage.title} sheet={stage.sheet} index={i} label={`${i + 1} z ${sheets}`} />)}
          </div>
        </div>
        {/* The map of the path: what the next screens walk through, in order. */}
        <nav className="path-index" aria-label={flow.indexLabel}>
          <ol>{flow.stages.map((stage, i) => <li key={stage.title} style={{ '--i': i }}><a href={`#etap-${i}`}><span aria-hidden="true">{i}</span>{stage.title}</a></li>)}</ol>
        </nav>
      </div>
    </section>

    <Path />

    <Cases />

    <section className="section formats wrap" id="zakres" aria-labelledby="formats-title">
      <div className="section-head">
        <h2 id="formats-title">{formats.title}</h2>
        <p className="section-lead">{formats.lead}</p>
      </div>
      <div className="format-rows">
        <article className="format-row" id="standard-dla-zespolu" aria-labelledby="format-w">
          <header className="format-head"><h3 id="format-w">{workflow.name}</h3><p>{workflow.subtitle}</p></header>
          <div className="format-body">
            <p className="format-text">{workflow.text}</p>
            <div className="disclosures">
              <Disclosure title={workflow.resultTitle}><dl className="result-list">{workflow.result.map(item => <div key={item.title}><dt>{item.title}</dt><dd>{item.text}</dd></div>)}</dl></Disclosure>
              <Disclosure id="warunki-w" title="Dla kogo, jak długo i czego potrzebujemy">{workflow.conditions.map(p => <p key={p}>{p}</p>)}</Disclosure>
              <Disclosure title="Granice zakresu i odpowiedzialności">{workflow.boundaries.map(p => <p key={p}>{p}</p>)}</Disclosure>
            </div>
            <div className="format-links"><TextLink href="/?temat=zadanie#kontakt" arrow>Opisz zadanie zespołu</TextLink><TextLink href={samplePath}>Zobacz przykład standardu</TextLink></div>
          </div>
        </article>
        <article className="format-row" id="konsultacja" aria-labelledby="format-k">
          <header className="format-head"><h3 id="format-k">{consultation.name}</h3><p>{consultation.subtitle}</p></header>
          <div className="format-body">
            <p className="format-text">{consultation.text}</p>
            <p className="format-text">{consultation.outcome}</p>
            <div className="disclosures"><Disclosure title="Format i rezultat konsultacji">{consultation.details.map(p => <p key={p}>{p}</p>)}</Disclosure></div>
            <div className="format-links"><TextLink href="/?temat=decyzja#kontakt" arrow>Opisz decyzję</TextLink></div>
          </div>
        </article>
        <article className="format-row" id="przeglad-oferty" aria-labelledby="format-r">
          <header className="format-head"><h3 id="format-r">{review.name}</h3><p>{review.subtitle}</p></header>
          <div className="format-body">
            <p className="format-text">{review.text}</p>
            <div className="format-links"><TextLink href="/?temat=oferta#kontakt" arrow>Zapytaj o przegląd oferty</TextLink></div>
          </div>
        </article>
      </div>
      <Note className="section-note">{formats.boundaryNote}</Note>
    </section>

    <section className="section about wrap" id="o-mnie" aria-labelledby="about-title">
      <h2 id="about-title">Perspektywa produktowa. Techniczna ocena. Zrozumiały wniosek.</h2>
      <div className="about-grid">
        <div className="about-bio">
          <p>{pl(`Jestem ${site.name}. Pracuję jako Technical Product Manager. Łączę analizę procesów, architekturę i integrację systemów z wiedzą o modelach językowych, agentach oraz automatyzacji.`)}</p>
          <p>{pl('W doradztwie wykorzystuję tę perspektywę do oceny, która zmiana ma sens i jak sprawdzić jej rezultat.')}</p>
          <p className="about-link"><TextLink href={site.principlesPath} arrow>{site.principlesTitle}</TextLink></p>
          <Pending>zweryfikowane doświadczenie i publiczny profil zawodowy.</Pending>
        </div>
        <dl className="expertise">{site.expertise.map(item => <div key={item.title}><dt>{item.title}</dt><dd>{item.text}</dd></div>)}</dl>
      </div>
    </section>

    <Contact />
  </main>;
}

/* The contact form is the card of the first conversation: the three questions of stage 1, answered in writing.
   An open question carries a pencil query; once it has an answer the query becomes a tick.
   A local demonstration: it validates and shows a draft; nothing is sent. */
function Contact() {
  const { contact } = site;
  const questions = site.flow.stages[1].sheet.items;
  const [ready, setReady] = useState(false);
  const [answers, setAnswers] = useState(() => questions.map(() => ''));
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState(null);
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(null);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const errorBox = useRef(null);
  const previewBox = useRef(null);
  const focusSummary = useRef(false);
  useEffect(() => {
    setReady(true);
    const requested = new URLSearchParams(window.location.search).get('temat');
    if (contact.topics[requested]) setTopic(requested);
  }, []);
  useEffect(() => { if (focusSummary.current) { focusSummary.current = false; errorBox.current?.focus(); } }, [errors]);
  useEffect(() => { if (preview) previewBox.current?.focus(); }, [preview]);
  const emailOk = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  const messages = { answer: 'Odpowiedz krótko na pierwsze pytanie; od niego zaczniemy.', email: 'Wpisz adres e-mail w poprawnym formacie.' };
  const clear = key => setErrors(e => { if (!e[key]) return e; const next = { ...e }; delete next[key]; return next; });
  const reset = () => { setPreview(null); setCopied(false); setCopyError(false); };
  function answer(i, value) { reset(); setAnswers(list => list.map((x, k) => k === i ? value : x)); if (i === 0) clear('answer'); }
  function checkEmail() { if (email.trim() && !emailOk(email)) setErrors(e => ({ ...e, email: messages.email })); }
  function submit(event) {
    event.preventDefault();
    const next = {};
    if (!answers[0].trim()) next.answer = messages.answer;
    if (!emailOk(email)) next.email = messages.email;
    reset();
    if (Object.keys(next).length) { focusSummary.current = true; setErrors(next); return; }
    setErrors({});
    const parts = questions.map((q, i) => answers[i].trim() ? `${q}\n${answers[i].trim()}` : null).filter(Boolean);
    setPreview(`${topic ? `Temat: ${contact.topics[topic]}\n\n` : ''}${parts.join('\n\n')}\n\n${contact.replyLabel} ${email.trim()}`);
  }
  async function copyDraft() {
    try { await navigator.clipboard.writeText(preview); setCopied(true); setCopyError(false); }
    catch { setCopyError(true); }
  }
  const errorTargets = { answer: 'card-q0', email: 'contact-email' };
  return <section className="contact" id="kontakt" aria-labelledby="contact-title">
    <div className="wrap contact-grid">
      <div className="contact-intro">
        <h2 id="contact-title">{contact.title}</h2>
        <p>{contact.text}</p>
        <Note>{contact.note}</Note>
        <Pending>{contact.pending}</Pending>
      </div>
      <div className="sheet contact-sheet card">
        <div className="sheet-bar"><p>{contact.sheetTitle}{topic ? `: ${contact.topics[topic]}` : ''}</p><p>Formularz demonstracyjny</p></div>
        <form noValidate onSubmit={submit} aria-label="Karta pierwszej rozmowy">
          <fieldset disabled={!ready}>
            <legend className="visually-hidden">Trzy pytania i adres do odpowiedzi</legend>
            {Object.keys(errors).length > 0 && <div className="error-summary" ref={errorBox} tabIndex="-1" role="alert"><p>Dwie rzeczy są potrzebne, żeby karta była gotowa.</p>{Object.entries(errors).map(([key, text]) => <a key={key} href={`#${errorTargets[key]}`}>{text}</a>)}</div>}
            {questions.map((question, i) => <div className="card-q" key={question} data-answered={answers[i].trim() ? '' : undefined}>
              <label htmlFor={`card-q${i}`}><span className="card-q-mark" aria-hidden="true"><Mark kind="query" /><Mark kind="tick" /></span><span>{question}</span>{i > 0 && <span className="card-q-opt">(opcjonalne)</span>}</label>
              {i === 0 && <p className="field-hint" id="card-hint">{contact.hint}</p>}
              <textarea id={`card-q${i}`} name={`q${i}`} rows="2" maxLength="1500" value={answers[i]} onChange={e => answer(i, e.target.value)} required={i === 0} aria-invalid={i === 0 && Boolean(errors.answer)} aria-describedby={i === 0 ? `card-hint${errors.answer ? ' card-error' : ''}` : undefined} />
              {i === 0 && errors.answer && <p className="field-error" id="card-error">{errors.answer}</p>}
            </div>)}
            <div className="mail-head card-reply">
              <div className="mail-to"><label htmlFor="contact-email">{contact.replyLabel}<span className="visually-hidden"> adres e-mail (wymagany)</span></label><input id="contact-email" name="email" type="email" autoComplete="email" spellCheck="false" maxLength="254" placeholder="twoj@adres.pl" value={email} onChange={e => { setEmail(e.target.value); clear('email'); reset(); }} onBlur={checkEmail} required aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'error-email' : undefined} /></div>
              {errors.email && <p className="field-error" id="error-email">{errors.email}</p>}
            </div>
            <div className="mail-foot">
              <Button type="submit" compact>{contact.button}</Button>
              <p className="demo-notice">Formularz działa tylko w tej karcie przeglądarki; nic nie jest wysyłane do serwera ani modelu AI. <a href="/prywatnosc/">Prywatność prototypu</a>.</p>
            </div>
          </fieldset>
          <noscript><p className="demo-notice">Sprawdzenie karty wymaga JavaScript. Formularz nie wysyła wiadomości.</p></noscript>
        </form>
        {preview && <div className="mail-done draft-preview" ref={previewBox} tabIndex="-1" role="region" aria-label="Podgląd karty">
          <p className="draft-title"><Mark kind="tick" />Karta jest gotowa.</p>
          <p>To podgląd; niczego nie wysłano.</p>
          <pre>{preview}</pre>
          <button type="button" className="link" onClick={copyDraft}>{copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}<span>{copied ? 'Skopiowano kartę' : 'Kopiuj kartę'}</span></button>
          <p className="visually-hidden" role="status">{copied ? 'Kartę skopiowano do schowka.' : ''}</p>
          {copyError && <p role="status">Przeglądarka nie pozwoliła skopiować karty. Możesz zaznaczyć ją powyżej i skopiować ręcznie.</p>}
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
      <aside className="article-contact"><h2>Masz podobne pytanie w swoim zespole?</h2><Button href="/?temat=inne#kontakt">{site.flow.cta.button}</Button></aside>
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
  return <ArticleFrame kind="Analiza" title={article.title} lead={article.lead} meta={meta} theses={article.theses} terms={article.terms} backHref="/#etap-0" backLabel="Wróć do wiedzy otwartej" dropcap>
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
  return <ArticleFrame kind="Przykład standardu, dane syntetyczne" title={standard.title} lead="Projekt standardu: wymagane wejście, kontrola faktów, rola człowieka i warunki przerwania pracy." meta={['Materiał syntetyczny', formatDate('29.10.2026'), `Opracowanie: ${site.name}`]} terms={['standard', 'operator', 'wlasciciel-procesu', 'blad-krytyczny', 'proba']} backHref="/#standard-dla-zespolu" backLabel="Wróć do formatów współpracy">
    <p className="boundary"><strong>Demonstracja metody, test nieprzeprowadzony.</strong> Cały materiał jest syntetyczny. Nie opisuje zlecenia, rzeczywistego klienta ani wyniku działania modelu.</p>
    <h2>Pytanie</h2><p>Jak przygotować podsumowanie dla opiekuna projektu tak, aby nie dopisywać ustaleń, których nie ma w notatce? Ten przykład pokazuje strukturę sposobu pracy, a nie skuteczność całego procesu w firmie.</p>
    <h2>Materiał syntetyczny</h2><blockquote>Rozmowa o etapowym uruchomieniu obsługi. Klient chce najpierw ustalić zakres źródeł danych i liczbę użytkowników. Budżet wymaga potwierdzenia. Termin wdrożenia nie został uzgodniony. Opiekun ma przygotować pytania do kolejnej rozmowy. Nie ustalono terminu następnego spotkania.</blockquote><p>To całość źródła przykładu.</p>
    <h2>Sprawdzenie względem źródła</h2><p>Tak wygląda kontrola opisana w standardzie: każde zdanie szkicu dostaje fragment źródła albo poprawkę.</p><Proof />
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

/* Stage 0 of the client path: the free guide. The form is the e-mail the visitor would receive: ticking a tool writes its block
   into the letter, two or more add the generated note, and the address goes in the letter's own "Do:" line.
   A local demonstration: nothing is sent, stored or generated. */
/* A box to tick, as on a paper form: the pencil tick is drawn larger than the box. Used for every choice on the guide page. */
function Pick({ children, plain = false, ...input }) {
  return <label className={`pick${plain ? ' pick-plain' : ''}`}><input type="checkbox" {...input} /><span className="pick-box" aria-hidden="true"><Mark kind="tick" /></span><span className="pick-text">{children}</span></label>;
}

function GuideForm() {
  const { form } = site.guide;
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState('');
  const [picked, setPicked] = useState([]);
  const [none, setNone] = useState(false);
  const [updates, setUpdates] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const field = useRef(null);
  const doneBox = useRef(null);
  useEffect(() => { setReady(true); }, []);
  useEffect(() => { if (done) doneBox.current?.focus(); }, [done]);
  function toggle(item) {
    setDone(false); setNone(false);
    setPicked(list => list.includes(item) ? list.filter(x => x !== item) : [...list, item]);
  }
  function toggleNone() { setDone(false); setPicked([]); setNone(v => !v); }
  function submit(event) {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setError('Wpisz adres e-mail w poprawnym formacie.'); setDone(false); field.current?.focus(); return; }
    setError(''); setDone(true);
  }
  const ordered = form.groups.flatMap(g => g.items).filter(item => picked.includes(item));
  const n = ordered.length;
  const summary = ['przewodnik', n > 0 && `${n} ${n === 1 ? 'omówienie' : n < 5 ? 'omówienia' : 'omówień'}`, n > 1 && 'dopisek'].filter(Boolean).join(' + ');
  return <form className="guide-form" noValidate onSubmit={submit} aria-label="Przewodnik i Twoje narzędzia">
    <fieldset disabled={!ready}>
      <legend className="visually-hidden">Narzędzia i adres</legend>
      <fieldset className="picks">
        <legend>{form.stackLegend} <span>(opcjonalne)</span></legend>
        <p className="field-hint">{form.stackHint}</p>
        {form.groups.map(group => <div className="pick-group" role="group" aria-labelledby={`pick-${group.id}`} key={group.id}>
          <p id={`pick-${group.id}`}>{group.title}</p>
          <div className="pick-options">{group.items.map(item => <Pick key={item} name="stack" value={item} checked={picked.includes(item)} onChange={() => toggle(item)}><span translate="no">{item}</span></Pick>)}</div>
        </div>)}
        <div className="pick-group pick-none"><Pick plain name="stack-none" checked={none} onChange={toggleNone}>{form.none}</Pick></div>
      </fieldset>
      <p className="mail-status" role="status"><span>W mailu:</span> {summary}</p>
      <div className="sheet mail" data-done={done ? '' : undefined}>
        <div className="sheet-bar"><p>{form.mailTitle}</p><p>Podgląd, nic nie jest wysyłane</p></div>
        <div className="mail-head">
          <div className="mail-to"><label htmlFor="guide-email">Do:<span className="visually-hidden"> adres e-mail (wymagany)</span></label><input id="guide-email" ref={field} name="email" type="email" autoComplete="email" spellCheck="false" maxLength="254" placeholder="twoj@adres.pl" value={email} onChange={e => { setEmail(e.target.value); setError(''); setDone(false); }} required aria-invalid={Boolean(error)} aria-describedby={error ? 'guide-error-email' : undefined} /></div>
          {error && <p className="field-error" id="guide-error-email" role="alert">{error}</p>}
          <p className="mail-subject"><span>Temat:</span> {form.subject}</p>
          <p className="mail-address-note">{form.addressNote}</p>
        </div>
        <ul className="mail-rows">
          <li><Mark kind="tick" /><div><p className="mail-item">{form.guideRow}</p><p className="mail-sub">{form.guideSub}</p></div></li>
          {ordered.map(item => <li key={item}><Mark kind="tick" /><div><p className="mail-item">{form.blockLabel}: <span translate="no">{item}</span></p></div></li>)}
          {n > 1 && <li key="note" className="mail-note"><Mark kind="bar" /><div><p className="mail-item">{form.noteRow}</p><p className="mail-sub">{form.noteTag}</p></div></li>}
          {n > 0 && <li key="parts" className="mail-parts"><p className="mail-sub">{form.blockParts}</p></li>}
          {n === 0 && none && <li key="none"><Mark kind="bar" /><div><p className="mail-item">{form.noneRow}</p><p className="mail-sub">{form.noneSub}</p></div></li>}
          {n === 0 && !none && <li key="empty" className="mail-empty"><p className="mail-sub">{form.emptyHint}</p></li>}
        </ul>
        <div className="mail-foot">
          <Pick plain name="updates" checked={updates} onChange={() => { setUpdates(v => !v); setDone(false); }}>{form.updates}</Pick>
          <Button type="submit" compact>{form.button}</Button>
        </div>
        {done && <div className="mail-done" ref={doneBox} tabIndex="-1" role="status">
          <p className="draft-title"><Mark kind="tick" />{form.doneTitle}</p>
          <p>{form.doneText}</p>
        </div>}
      </div>
    </fieldset>
    <noscript><p>Składanie maila wymaga JavaScript. Formularz niczego nie wysyła.</p></noscript>
  </form>;
}

/* The guide page is read top to bottom, one question per screen: what is it, what is inside, how do I get it.
   Everything sits on one column of the grid. The only motion is the letter answering the reader's choices. */
function GuidePage() {
  const { guide } = site;
  return <main id="tresc" tabIndex="-1" className="guide">
    <section className="scene scene-intro" aria-labelledby="guide-title">
      <div className="wrap scene-grid"><div className="scene-col">
        <a className="back-link" href="/#etap-0"><ArrowLeft aria-hidden="true" />Wróć do wiedzy otwartej</a>
        <h1 id="guide-title">{guide.title}</h1>
        <p className="article-lead">{guide.lead}</p>
        <p className="meta">{guide.meta.map(m => <span key={m}>{m}</span>)}</p>
        <div className="guide-jump"><Button href="#pobierz">{guide.jump}</Button></div>
      </div></div>
    </section>
    <section className="scene scene-desk" aria-labelledby="guide-contents-title">
      <div className="wrap scene-grid"><div className="scene-col">
        <h2 className="scene-title" id="guide-contents-title">{guide.contentsTitle}</h2>
        <div className="sheet guide-toc">
          <div className="sheet-bar"><p>{guide.form.subject}</p><p>Spis treści</p></div>
          <ol>{guide.chapters.map((chapter, i) => <li key={chapter.title}>
            <span className="guide-numeral" aria-hidden="true">{i + 1}</span>
            <div><h3>{chapter.title}</h3><p>{chapter.text}</p></div>
          </li>)}</ol>
          <div className="sheet-foot"><p>{guide.tocFoot}</p></div>
        </div>
        <Pending>{guide.pending}</Pending>
      </div></div>
    </section>
    <section className="scene" id="pobierz" aria-labelledby="guide-get-title">
      <div className="wrap scene-grid"><div className="scene-col">
        <h2 className="scene-title" id="guide-get-title">{guide.form.title}</h2>
        <p className="scene-lead">{guide.form.intro}</p>
        <GuideForm />
        <Note>{guide.form.note} <a href="/prywatnosc/">Prywatność prototypu</a>.</Note>
        <CallToAction headingLevel="h2" title={guide.next.title} text={guide.next.text} button={guide.next.button} href={compendiumPath} secondary={<TextLink href={pathHref} arrow>{guide.next.link}</TextLink>} />
      </div></div>
    </section>
  </main>;
}

function CompendiumPage() {
  const { compendium: c } = site;
  let offset = 0;
  return <ArticleFrame kind="Przykładowe kompendium, dane syntetyczne" title={c.title} lead={c.lead} meta={['Materiał syntetyczny', formatDate('22.11.2026'), `Opracowanie: ${site.name}`]} backHref="/#etap-4" backLabel="Wróć do etapu „Kompendium”">
    <p className="boundary"><strong>Przykład syntetyczny.</strong> {c.boundary}</p>
    <h2>Czym jest kompendium</h2>{c.intro.map(p => <p key={p}>{p}</p>)}
    <h2>{c.contentsTitle}</h2>
    <div className="sheet"><div className="sheet-bar"><p>Kompendium</p><p>Przykład, materiał syntetyczny</p></div>
      {c.parts.map(part => {
        const start = offset;
        offset += part.items.length;
        return <div className="sheet-part" key={part.title}><p className="sheet-part-title">{part.title}</p><ol className="fs-contents" start={start + 1} style={{ counterReset: `doc ${start}` }}>{part.items.map(item => <li key={item}><span>{item}</span></li>)}</ol></div>;
      })}
    </div>
    <p>{c.guideLink}: <a href={guidePath}>zobacz przewodnik</a>.</p>
    <h2>{c.excerptTitle}</h2><p>{c.excerptLead}</p>
    <div className="sheet"><div className="sheet-bar"><p>{c.excerptSheet}</p><p>Rozdział 5 z 8, przykład</p></div><StandardTable rows={c.excerpt} /></div>
    <p>{c.closing}</p>
  </ArticleFrame>;
}

/* "Czego nie robię" on its own page (ink ground), linked from the person section and the footer. */
function PrinciplesPage() {
  return <main id="tresc" tabIndex="-1" className="principles principles-page">
    <div className="wrap principles-grid">
      <div className="principles-head">
        <a className="back-link" href="/#o-mnie"><ArrowLeft aria-hidden="true" />Wróć na stronę główną</a>
        <h1>{site.principlesTitle}</h1>
        <p>{site.principlesLead}</p>
      </div>
      <ul>{site.principles.map(p => <li key={p}><span className="principle-no">Nie</span><span className="principle-text">{p.replace(/^Nie\s+/, '')}</span></li>)}</ul>
      <div className="principles-cta"><p>{site.principlesCta}</p><Button href="/?temat=inne#kontakt">{site.flow.cta.button}</Button></div>
    </div>
  </main>;
}

function PrivacyPage() {
  return <ArticleFrame kind="Prototyp" title="Najpierw jasny opis. Poufne materiały później." lead="Ten podgląd pozwala zapoznać się ze stroną i sprawdzić opis zadania. Nie uruchamia rzeczywistej obsługi zapytań." backHref="/#kontakt" backLabel="Wróć do kontaktu">
    <h2>Jak działają formularze</h2><p>Dotyczy to obu formularzy: karty pierwszej rozmowy i przewodnika. Wpisane informacje pozostają w pamięci tej karty przeglądarki. Żaden z formularzy nie wysyła ich do serwera, poczty ani modelu AI i nie zapisuje ich w cookies lub localStorage. Odświeżenie albo zamknięcie strony usuwa roboczy opis z formularza.</p><p>Formularz przewodnika pokazuje wyłącznie podgląd wiadomości. Przewodnik nie jest jeszcze wysyłany, adres nie jest zapisywany, a zaznaczone narzędzia i zgoda na kolejne wiadomości nie opuszczają tej karty. Dopisek do zestawu narzędzi nie jest generowany: żadne dane nie trafiają do modelu AI.</p><p>Przycisk kopiowania przenosi opis do schowka wyłącznie po Twoim kliknięciu. Strona nie odczytuje zawartości schowka.</p>
    <h2>Odwiedziny strony</h2><p>Strona nie zawiera narzędzi reklamowych, zewnętrznej analityki, osadzonych kalendarzy ani formularzy innych dostawców. Fonty są ładowane z tego samego serwisu. Hosting może przetwarzać techniczne dane żądań; nie oznacza to, że prototyp jest usługą bez jakiegokolwiek przetwarzania danych.</p>
    <h2>Przed uruchomieniem kontaktu</h2><p>Przed uruchomieniem wysyłki przewodnika potrzebne będą osobne podstawy: jedna dla dostarczenia zamówionego pliku, druga, dobrowolna, dla kolejnych wiadomości. Do uzupełnienia pozostają rzeczywiste dane administratora, adres kontaktowy, dostawcy i odbiorcy, cele oraz podstawy przetwarzania, retencja, zasady transferów i realizacji praw. Dokument musi odpowiadać faktycznej konfiguracji hostingu, poczty i endpointu.</p><p>Ten opis dotyczy prototypu. Nie jest gotową polityką prywatności dla działającej praktyki. Rzeczywista wysyłka zostanie uruchomiona dopiero po ustaleniu tych elementów.</p>
  </ArticleFrame>;
}

function NotFound() {
  return <main id="tresc" tabIndex="-1" className="wrap not-found"><p className="article-kind">Nie znaleziono strony</p><h1>Wróćmy do właściwego miejsca.</h1><Button href="/">Przejdź na stronę główną</Button></main>;
}

export function App({ path: suppliedPath }) {
  const path = suppliedPath || (typeof window !== 'undefined' ? window.location.pathname : '/');
  const cleanPath = path === '/' ? '/' : `${path.replace(/\/+$/, '')}/`;
  const legacyDeck = cleanPath === legacyDeckPath;
  const normalizedPath = legacyDeck ? '/' : cleanPath;
  useEffect(() => {
    if (legacyDeck) window.history.replaceState(null, '', pathHref);
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
  const page = normalizedPath === '/' ? <Home /> : article ? <ArticlePage article={article} /> : normalizedPath === samplePath ? <SamplePage /> : normalizedPath === guidePath ? <GuidePage /> : normalizedPath === site.principlesPath ? <PrinciplesPage /> : normalizedPath === compendiumPath ? <CompendiumPage /> : normalizedPath === '/prywatnosc/' ? <PrivacyPage /> : <NotFound />;
  return <><Header overHero={normalizedPath === '/'} path={normalizedPath} />{page}<Footer /></>;
}
