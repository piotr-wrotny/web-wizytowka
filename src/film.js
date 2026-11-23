// The story as a small drawn film behind the home page's text, scrubbed by the scroll. Loaded on demand (wide screens, motion
// on); without it the page shows its flat sheets. It is a pencil drawing on cut-out paper: every shape is sketched by rough.js
// (twice, so the line "boils" like hand-drawn animation) and moved by one GSAP timeline. The little man in a suit stands for
// the visitor; he is nobody in particular. The consultation is the checking pencil of the whole site (blue confirms, red
// queries), not a person: the story stays the visitor's.
//
// Four acts. Timeline T: the index of the section whose top has passed the top of the screen, plus how far it has scrolled.
//   I    the good world
//        0 hero      asleep under a safe blanket, the moon in the window
//   II   the trouble
//        0.4         woken up; the market's papers stream past, four stop in front of him with a question in red pencil
//        1.6 to 2.3  the papers leave and it goes quiet. He walks over to the fridge, slower and slower; it trembles, it thumps,
//                    he flinches, looks back at us, reaches again
//        2.3 stawka  he opens it, and "AI!" bursts out at him; then it shouts from everywhere. Now the problem has a name
//   III  the solution: every step of working together puts a part of the chaos in order
//        2.75 zwrot  "Muszę to uporządkować." The bedroom leaves, a desk arrives, the papers land on it in a heap. The pencil
//                    comes in with the card of the first conversation: he leaves his answers, the pencil ticks them
//        4 kroki     the four steps, one after another, each lighting its title on the page: they talk; the heap becomes one
//                    card; the team comes in and sees the presentation; everything is bound into one compendium
//   IV   the better world
//        5 koniec    the compendium opens on its recommendation, the pencil ticks it and leaves. He is not alone with the
//                    problem any more: he sits at a tidy desk, calm, his team around him, daylight in the window
//
// The timeline tweens plain state objects; the ticker turns the state into transforms. Ambient motion (breathing, trembling,
// wobble) runs on the clock and is gated by the state, so the scroll only ever decides what happens, not how fast a hand shakes.
import gsap from 'gsap';
import rough from 'roughjs';

const NS = 'http://www.w3.org/2000/svg';
const C = { paper: '#fcfdfb', ink: '#14161a', soft: '#4d5359', line: '#c6ccc7', blue: '#2340c8', blueSoft: '#cdd6ff', red: '#c02a16', glow: '#ff6a4d' };
const SERIF = "'Brygada 1918', Georgia, serif", SANS = "Archivo, 'Segoe UI', sans-serif";
const clamp01 = x => Math.min(1, Math.max(0, x));
const seg = (t, a, b) => { const x = clamp01((t - a) / (b - a)); return x * x * (3 - 2 * x); };
const lerp = (a, b, t) => a + (b - a) * t;
const rand = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const n = x => Math.round(x * 100) / 100;
const pulse = (x, a, b) => (x > a && x < b ? Math.sin(((x - a) / (b - a)) * Math.PI) : 0);

function el(name, attrs = {}, parent) {
  const node = document.createElementNS(NS, name);
  for (const key in attrs) node.setAttribute(key, attrs[key]);
  parent?.appendChild(node);
  return node;
}
const group = (parent, attrs) => el('g', attrs, parent);
const rrect = (x, y, w, h, r) => `M${x + r} ${y}H${x + w - r}Q${x + w} ${y} ${x + w} ${y + r}V${y + h - r}Q${x + w} ${y + h} ${x + w - r} ${y + h}H${x + r}Q${x} ${y + h} ${x} ${y + h - r}V${y + r}Q${x} ${y} ${x + r} ${y}Z`;
const poly = points => `M${points.map(p => p.join(' ')).join('L')}Z`;
const circle = (cx, cy, r) => `M${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}Z`;

export async function startFilm({ root, sections, papers, paperLabel, say, card: cardContent, karta: kartaContent, slide: slideContent, ending, team: teamSays }) {
  await Promise.all([`700 19px Archivo`, `800 52px Archivo`, `500 13px Archivo`, `italic 30px "Brygada 1918"`, `17px "Brygada 1918"`].map(f => document.fonts.load(f, 'AIąż?')));
  const svg = el('svg', { viewBox: '0 0 1000 800', preserveAspectRatio: 'xMaxYMid meet', focusable: 'false' });
  const rc = rough.svg(svg);
  let seed = 7;

  /* One sketched shape: a paper-coloured cut-out with a pencil outline and, if asked, pencil hatching over it. Drawn twice with
     different hands; the two drawings alternate a few times a second. */
  function sketch(parent, d, { fill = C.paper, stroke = C.ink, width = 1.9, hatch, gap = 5, angle = -41, weight = 1.1, rough: r = 1.1, still = false } = {}) {
    const g = group(parent);
    const id = seed += 2;
    for (const b of still ? [0] : [0, 1]) {
      const frame = group(g, still ? {} : { class: `b${b}` });
      const base = { roughness: r, bowing: 1.1, seed: id + b, preserveVertices: true };
      if (fill || stroke) frame.appendChild(rc.path(d, { ...base, fill: fill || undefined, fillStyle: 'solid', stroke: stroke || 'none', strokeWidth: width }));
      if (hatch) frame.appendChild(rc.path(d, { ...base, stroke: 'none', fill: hatch, fillStyle: 'hachure', hachureGap: gap, hachureAngle: angle, fillWeight: weight }));
    }
    return g;
  }
  const stroke = (parent, d, color = C.ink, width = 1.9, still = false) => sketch(parent, d, { fill: null, stroke: color, width, still });
  const shade = (parent, cx, cy, rx) => { const g = sketch(parent, `M${cx - rx} ${cy}Q${cx} ${cy - 12} ${cx + rx} ${cy}Q${cx} ${cy + 12} ${cx - rx} ${cy}Z`, { fill: null, stroke: null, hatch: C.ink, gap: 4, angle: -20, weight: 1, still: true }); g.setAttribute('opacity', '.3'); return g; };

  const measure = document.createElement('canvas').getContext('2d');
  function wrap(text, font, maxWidth) {
    measure.font = font;
    const lines = [];
    let line = '';
    for (const word of text.split(' ')) {
      const next = line ? `${line} ${word}` : word;
      if (line && measure.measureText(next).width > maxWidth) { lines.push(line); line = word; } else line = next;
    }
    lines.push(line);
    return lines;
  }
  function label(parent, text, x, y, style, attrs = {}) {
    const t = el('text', { x, y, style, ...attrs }, parent);
    t.textContent = text;
    return t;
  }
  const tickMark = (parent, x, y, k = 1) => el('path', { d: `M${x} ${y + 1 * k}L${x + 9 * k} ${y + 11 * k}L${x + 26 * k} ${y - 12 * k}`, fill: 'none', stroke: C.blue, 'stroke-width': 3.4 * Math.sqrt(k), 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': 1, 'stroke-dashoffset': 1 }, parent);
  /* A sheet of the consultation: a bar with its title and label, then whatever the caller draws. */
  function sheet(parent, w, h, title, tag) {
    const g = group(parent);
    sketch(g, rrect(0, 0, w, h, 4), { width: 1.7 });
    stroke(g, `M2 46L${w - 2} 46`, C.line, 1.4, true);
    label(g, title, 22, 29, `font:500 14px ${SANS};fill:${C.ink}`);
    if (tag) label(g, tag, w - 22, 29, `font:500 14px ${SANS};fill:${C.soft}`, { 'text-anchor': 'end' });
    return g;
  }
  /* A speech bubble; the origin is the tip of its tail, at the bottom left (or at the bottom right, mirrored). */
  function speech(parent, text, mirrored = false) {
    const g = group(parent, { visibility: 'hidden' });
    measure.font = `italic 30px ${SERIF}`;
    const w = Math.ceil(measure.measureText(text).width) + 56;
    const inner = group(g, { transform: `translate(${mirrored ? 36 - w : -36} -128)` });
    const x = v => (mirrored ? w - v : v);
    sketch(inner, poly([[x(44), 80], [x(34), 126], [x(104), 80]]), { width: 1.6 });
    sketch(inner, rrect(0, 0, w, 84, 26), { width: 1.6 });
    sketch(inner, poly([[x(47), 78], [x(40), 112], [x(98), 78]]), { stroke: null, still: true });
    label(inner, text, w / 2, 43, `font:italic 30px ${SERIF};fill:${C.ink}`, { 'text-anchor': 'middle', 'dominant-baseline': 'central' });
    return g;
  }

  /* A figure, built around its feet; arms, legs and face are separate so it can act. The hero wears a suit and a blue tie;
     the people of his team are drawn the same way and are nobody in particular either. */
  function figure(parent, { tie = false, hair = 'short', cloth = { hatch: C.ink, gap: 3.2, weight: 1.25 }, smile = false, glasses = false } = {}) {
    const g = group(parent);
    const limb = (x, y, d, opts) => { const inner = group(group(g, { transform: `translate(${x} ${y})` })); sketch(inner, d, opts); return inner; };
    const legs = [-1, 1].map(side => {
      const leg = limb(side * 16, -98, rrect(-12, -4, 24, 98, 9), cloth);
      sketch(leg, rrect(-15 + side * 5, 86, 34, 13, 6), { hatch: C.ink, gap: 2.2 });
      return leg;
    });
    const legGroup = legs.map(leg => leg.parentNode);
    sketch(g, rrect(-40, -194, 80, 104, 18), cloth);
    if (tie) {
      sketch(g, poly([[-13, -193], [13, -193], [0, -148]]), { width: 1.4 });
      sketch(g, poly([[-4.5, -190], [4.5, -190], [6.5, -150], [0, -138], [-6.5, -150]]), { fill: C.blue, width: 1.2 });
    } else sketch(g, 'M-12 -193Q0 -176 12 -193Z', { width: 1.3 });
    const head = group(group(g, { transform: 'translate(0 -224)' }));
    const ink = { hatch: C.ink, gap: 2.4, angle: 20, weight: 1.3 };
    if (hair === 'long') sketch(head, 'M-36 -6Q-44 30 -38 52L-24 50Q-28 20 -26 -6ZM36 -6Q44 30 38 52L24 50Q28 20 26 -6Z', ink);
    if (hair === 'bun') sketch(head, circle(0, -40, 13), ink);
    sketch(head, circle(0, 0, 35));
    if (hair === 'bald') stroke(head, 'M-30 -18Q0 -30 30 -18', C.ink, 1.4);
    else sketch(head, hair === 'long' ? 'M-34 -8A35 35 0 0 1 34 -8Q20 -22 4 -24Q-16 -22 -34 -8Z' : 'M-33 -12A35 35 0 0 1 33 -12Q16 -25 0 -20Q-18 -16 -33 -12Z', ink);
    const face = group(head);
    const eyes = [-1, 1].map(side => el('ellipse', { cx: side * 11.5, cy: 3, rx: 3.3, ry: 3.3, fill: C.ink }, face));
    if (glasses) el('path', { d: `${circle(-11.5, 3, 8)}${circle(11.5, 3, 8)}M-3.5 3L3.5 3`, fill: 'none', stroke: C.ink, 'stroke-width': 1.5 }, face);
    const line = { fill: 'none', stroke: C.ink, 'stroke-width': 1.8, 'stroke-linecap': 'round' };
    const mouth = el('path', { d: 'M-5 18Q0 20 5 18', ...line, opacity: smile ? 0 : 1 }, face);
    const grin = el('path', { d: 'M-8 15Q0 25 8 15', ...line, opacity: smile ? 1 : 0 }, face);
    const gasp = el('ellipse', { cx: 0, cy: 19, rx: 5, ry: 7, fill: C.ink, opacity: 0 }, face);
    const arms = [-1, 1].map(side => {
      const arm = limb(side * 45, -180, rrect(-10, -6, 20, 80, 9), cloth);
      sketch(arm, circle(0, 82, 10.5), { width: 1.5 });
      return arm;
    });
    return { g, legs, legGroup, head, face, eyes, mouth, grin, gasp, arms };
  }

  const defs = el('defs', {}, svg);
  const world = group(svg);          // the room, seen by a camera (scale and shift)
  const swarmLayer = group(svg);     // the market's stream of sheets
  const front = group(svg);          // the four papers that can be read
  const top = group(svg);            // seen by the same camera as the room, but in front of the stream: sheets, speech, the pencil

  // --- Act I, the bedroom: a bed on the left under a window with the moon, a fridge on the right. It leaves when order arrives.
  const bed = group(world);
  sketch(bed, rrect(236, 268, 132, 132, 5), { fill: C.blueSoft, hatch: C.blue, gap: 7, angle: 40, weight: .8 });
  stroke(bed, 'M302 270L302 398M238 334L366 334', C.ink, 1.5);
  sketch(bed, 'M322 288A17 17 0 1 0 344 312A13 13 0 1 1 322 288Z', { width: 1.2 });
  for (const [x, y] of [[262, 296], [280, 362], [348, 366], [256, 318]]) sketch(bed, circle(x, y, 2.6), { width: 1, still: true });
  shade(bed, 250, 643, 215);
  sketch(bed, rrect(84, 612, 14, 30, 3), { hatch: C.soft, gap: 3 });
  sketch(bed, rrect(404, 612, 14, 30, 3), { hatch: C.soft, gap: 3 });
  sketch(bed, rrect(56, 468, 18, 148, 6), { hatch: C.soft, gap: 4 });
  sketch(bed, rrect(70, 574, 362, 42, 6), { hatch: C.soft, gap: 6, angle: 30 });
  sketch(bed, rrect(78, 544, 350, 34, 10));
  sketch(bed, rrect(90, 520, 104, 30, 13));
  const manSlot = group(world);      // asleep, the man lies between the mattress and the blanket
  const bedTop = group(world);
  sketch(bedTop, 'M210 572L210 486Q211 462 238 461L410 457Q433 459 434 484L434 572Z', { fill: C.blueSoft, hatch: C.blue, gap: 9, angle: 60, weight: .9 });

  const fridge = group(world);
  shade(fridge, 830, 643, 95);
  const fridgeBody = group(fridge);
  sketch(fridgeBody, rrect(760, 330, 140, 310, 8));
  sketch(fridgeBody, rrect(769, 339, 122, 292, 4), { fill: C.red, stroke: C.ink, hatch: '#7d160a', gap: 7, angle: 70 });
  const gapLight = stroke(fridgeBody, 'M761 344L761 628', C.glow, 3.5);
  const door = group(fridgeBody);
  sketch(door, rrect(760, 330, 140, 310, 8));
  stroke(door, 'M762 432L898 432', C.ink, 1.6);
  sketch(door, rrect(771, 452, 9, 66, 4), { hatch: C.ink, gap: 2.5 });
  sketch(door, rrect(771, 366, 9, 40, 4), { hatch: C.ink, gap: 2.5 });
  sketch(door, 'M812 478L846 474L850 514L815 519Z', { width: 1.3 });
  stroke(door, 'M820 488L840 485M821 497L842 494M822 506L835 504', C.soft, 1.1);
  sketch(door, circle(831, 478, 4), { fill: C.blue, stroke: C.ink, width: 1 });
  const rays = group(fridge);
  for (const [a, b] of [[[752, 360], [724, 348]], [[751, 420], [718, 418]], [[752, 500], [722, 508]], [[752, 580], [726, 596]], [[780, 322], [770, 296]], [[832, 320], [834, 290]], [[884, 322], [896, 296]], [[908, 380], [934, 370]], [[908, 520], [936, 528]]]) stroke(rays, `M${a.join(' ')}L${b.join(' ')}`, C.glow, 3.6);

  // --- Acts III and IV: daylight in a window, a chair and whoever stands behind the desk, the desk, then everyone in front.
  const day = group(world, { visibility: 'hidden' });
  sketch(day, rrect(196, 250, 132, 132, 5));
  stroke(day, 'M262 252L262 380M198 316L326 316', C.ink, 1.5);
  sketch(day, circle(294, 284, 15), { width: 1.2, hatch: C.soft, gap: 4 });
  stroke(day, 'M294 260L294 254M314 268L319 263M270 284L264 284M275 268L270 263M318 284L324 284', C.ink, 1.3);
  const back = group(world);
  const chair = group(back, { visibility: 'hidden' });
  sketch(chair, rrect(650, 430, 100, 150, 14), { hatch: C.soft, gap: 5, angle: 70 });
  sketch(chair, rrect(660, 576, 9, 66, 2), { hatch: C.ink, gap: 3 });
  sketch(chair, rrect(731, 576, 9, 66, 2), { hatch: C.ink, gap: 3 });
  const manBack = group(back);
  const desk = group(world);
  shade(desk, 760, 643, 190);
  sketch(desk, rrect(634, 566, 9, 66, 2), { hatch: C.soft, gap: 3 });
  sketch(desk, rrect(912, 566, 9, 66, 2), { hatch: C.soft, gap: 3 });
  sketch(desk, rrect(598, 572, 12, 70, 2), { hatch: C.ink, gap: 3 });
  sketch(desk, rrect(890, 572, 12, 70, 2), { hatch: C.ink, gap: 3 });
  sketch(desk, poly([[590, 560], [910, 560], [942, 518], [622, 518]]));
  sketch(desk, rrect(590, 560, 320, 15, 2), { hatch: C.soft, gap: 5, angle: 20 });
  // The compendium on the desk: everything the consultation produced, bound into one document.
  const book = group(desk, { visibility: 'hidden' });
  {
    const inner = group(book, { transform: 'translate(766 532)' });
    sketch(inner, poly([[-46, 14], [38, 14], [58, -12], [-26, -12]]), { width: 1.5 });
    sketch(inner, poly([[-46, 14], [38, 14], [38, 24], [-46, 24]]), { hatch: C.soft, gap: 2.5, angle: 0, width: 1.4 });
    sketch(inner, poly([[38, 14], [58, -12], [58, -2], [38, 24]]), { hatch: C.soft, gap: 3, width: 1.4 });
    sketch(inner, poly([[10, -12], [20, -12], [0, 14], [-10, 14]]), { fill: C.blue, width: 1 });
  }
  const bookTick = tickMark(group(desk, { transform: 'translate(766 532)' }), 14, -2, .7);

  const manShade = shade(world, 0, 643, 58);
  const manFront = group(world);     // once he is up, he stands in front of the furniture
  const hero = figure(manSlot, { tie: true });
  const man = hero.g;
  const team = [
    figure(world, { hair: 'long', cloth: { hatch: C.soft, gap: 5, angle: 40 }, smile: true }),
    figure(back, { hair: 'bald', glasses: true, cloth: { hatch: C.blue, gap: 4.5, angle: -60, weight: 1 }, smile: true }),
    figure(world, { hair: 'bun', cloth: { hatch: C.ink, gap: 6, angle: 10, weight: 1 }, smile: true }),
  ];
  const teamAha = team.map(member => tickMark(group(member.g), -12, -290, 1));

  // "z" over the sleeper: only ever seen on the blue of the first screen.
  const zs = [0, 1, 2].map(() => label(world, 'z', 0, 0, `font:italic 600 44px ${SERIF};fill:${C.paper}`, { 'text-anchor': 'middle' }));
  // The first step is a conversation: a few marks beside whoever is speaking.
  const talkMarks = [0, 1].map(i => stroke(world, i ? 'M0 0L-22 -12M2 14L-24 14M0 28L-22 40' : 'M0 0L22 -12M-2 14L24 14M0 28L22 40', C.ink, 2.6));

  // --- What is said. "AI!" in red, from everywhere; the fridge first.
  const shoutPlan = [
    [[838, 470], [742, 392], 1.45, -1],
    [[250, 624], [300, 474], .9, 1],
    [[-190, 400], [120, 300], 1.0, 1],
    [[480, -330], [462, 168], 1.05, 1],
    [[1190, 660], [1000, 588], .85, -1],
    [[1150, -260], [930, 196], .78, -1],
  ];
  const shouts = shoutPlan.map(([, , , dir]) => {
    const g = group(world, { visibility: 'hidden' });
    const inner = group(g);
    sketch(inner, poly([[-30 * dir, 28], [-46 * dir, 64], [2 * dir, 28]]), { fill: C.red, stroke: C.red, width: 1 });
    sketch(inner, rrect(-66, -46, 132, 78, 24), { fill: C.red, stroke: C.red, hatch: '#8f1c0c', gap: 8, angle: 60, weight: .8 });
    label(inner, 'AI!', 0, -7, `font:800 52px ${SANS};font-stretch:112%;fill:${C.paper}`, { 'text-anchor': 'middle', 'dominant-baseline': 'central' });
    return { g, inner };
  });

  // --- The sheets of the consultation, as objects of the film. Each can stand upright in front of him or lie on the desk.
  const CARD = [440, 274];
  const card = sheet(top, ...CARD, cardContent.title, cardContent.label);
  const cardTicks = cardContent.questions.map((question, i) => {
    const y = 84 + i * 76;
    wrap(question, `italic 23px ${SERIF}`, CARD[0] - 90).forEach((line, k) => label(card, line, 66, y + k * 27, `font:italic 23px ${SERIF};fill:${C.ink}`, { 'dominant-baseline': 'central' }));
    if (i < cardContent.questions.length - 1) stroke(card, `M22 ${y + 38}L${CARD[0] - 22} ${y + 38}`, C.line, 1, true);
    // His answer: a line of handwriting, written before the pencil ticks it.
    const answer = el('path', { d: `M66 ${y + 23}q8 -7 16 0t16 0t16 0t16 0t16 0t16 0t16 0t16 0t${40 + i * 22} -2`, fill: 'none', stroke: C.soft, 'stroke-width': 1.5, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': 1, 'stroke-dashoffset': 1 }, card);
    return { tick: tickMark(card, 24, y), answer };
  });
  const KARTA = [300, 206];
  const karta = sheet(top, ...KARTA, kartaContent.title);
  kartaContent.rows.forEach(([name], i) => {
    const y = 78 + i * 46;
    label(karta, name, 22, y, `font:700 15px ${SANS};fill:${C.ink}`, { 'dominant-baseline': 'central' });
    stroke(karta, `M118 ${y + 2}L${250 - i * 24} ${y}`, C.soft, 1.3, true);
    if (i < kartaContent.rows.length - 1) stroke(karta, `M22 ${y + 23}L${KARTA[0] - 22} ${y + 23}`, C.line, 1, true);
  });
  const SLIDE = [300, 206];
  const slide = sheet(top, ...SLIDE, slideContent.title);
  wrap(slideContent.heading, `600 22px ${SERIF}`, SLIDE[0] - 44).forEach((line, k) => label(slide, line, 22, 86 + k * 27, `font:600 22px ${SERIF};fill:${C.ink}`));
  slideContent.items.forEach((_, i) => { sketch(slide, circle(28, 152 + i * 16, 2.5), { fill: C.blue, stroke: null, still: true }); stroke(slide, `M40 ${152 + i * 16}L${200 - i * 30} ${151 + i * 16}`, C.soft, 1.2, true); });
  // The compendium, open on its last page: the recommendation of the synthetic sample.
  const COMP = [470, 0], COMPK = 1.16;
  const comp = group(top);
  const compRows = [];
  {
    let y = 100;
    const rows = ending.rows.map(row => { const lines = wrap(row.text, `17px ${SERIF}`, COMP[0] - 96); const from = y; y += 30 + lines.length * 22 + 20; return { row, lines, from }; });
    COMP[1] = y + 2;
    sheet(comp, ...COMP, ending.title, ending.label);
    label(comp, ending.part, 22, 72, `font:500 13px ${SANS};letter-spacing:.04em;fill:${C.soft}`);
    rows.forEach(({ row, lines, from }, i) => {
      label(comp, row.label, 66, from + 10, `font:700 17px ${SANS};fill:${C.ink}`, { 'dominant-baseline': 'central' });
      lines.forEach((line, k) => label(comp, line, 66, from + 36 + k * 22, `font:17px ${SERIF};fill:${C.ink}`, { 'dominant-baseline': 'central' }));
      if (i < rows.length - 1) stroke(comp, `M22 ${from + 36 + lines.length * 22}L${COMP[0] - 22} ${from + 36 + lines.length * 22}`, C.line, 1, true);
      compRows.push({ y: from + 10, tick: tickMark(comp, 24, from + 10) });
    });
  }
  const bubble = speech(top, say);
  const teamBubbles = teamSays.map((text, i) => speech(top, text, i % 2 === 1));

  // --- The pencil: the two-ended checking pencil of the site. Blue end down, to confirm. Built around its tip.
  const pencil = group(top, { visibility: 'hidden' });
  sketch(pencil, poly([[-17, -250], [17, -250], [6, -282], [-6, -282]]), { hatch: C.soft, gap: 5, width: 1.5 });
  sketch(pencil, poly([[-6, -282], [6, -282], [0, -297]]), { fill: C.red, width: 1.2 });
  sketch(pencil, rrect(-17, -250, 34, 102, 2), { fill: C.red, hatch: '#8f1c0c', gap: 7, angle: 80, weight: .8 });
  sketch(pencil, rrect(-17, -150, 34, 104, 2), { fill: C.blueSoft, hatch: C.blue, gap: 5, angle: 80, weight: 1 });
  sketch(pencil, poly([[-17, -48], [17, -48], [5, -13], [-5, -13]]), { hatch: C.soft, gap: 5, width: 1.5 });
  sketch(pencil, poly([[-5, -13], [5, -13], [0, 0]]), { fill: C.blue, width: 1.2 });
  for (const side of [-1, 1]) { el('circle', { cx: side * 7.5, cy: -120, r: 5.2, fill: C.paper, stroke: C.ink, 'stroke-width': 1.2 }, pencil); el('circle', { cx: side * 7.5 - 1.5, cy: -119, r: 2.2, fill: C.ink }, pencil); }

  // --- The market's papers: a stream of small sheets, and four that can be read.
  const N = 24;
  const sheets = Array.from({ length: N }, (_, i) => {
    const g = group(swarmLayer);
    sketch(g, rrect(-17, -22, 34, 44, 2), { width: 1.4, still: true });
    stroke(g, `M-10 -11L${4 + rand(i) * 6} -11M-10 -3L10 -3M-10 5L${rand(i + 9) * 9} 5`, C.soft, 1, true);
    return g;
  });
  const PW = 292;
  const homes = [[96, 30, -4], [470, 8, 3], [40, 262, 2.5], [520, 250, -3]];
  const big = papers.map((paper, i) => {
    const g = group(front);
    const lines = wrap(paper.claim, `700 19px ${SANS}`, PW - 44);
    const h = 34 + 30 + lines.length * 24 + 12 + 42;
    sketch(g, rrect(0, 0, PW, h, 3), { width: 1.6 });
    stroke(g, `M2 34L${PW - 2} 34`, C.line, 1.3, true);
    label(g, paper.kind, 16, 22, `font:500 12.5px ${SANS};fill:${C.ink}`);
    label(g, paperLabel, PW - 16, 22, `font:500 12.5px ${SANS};fill:${C.soft}`, { 'text-anchor': 'end' });
    lines.forEach((line, k) => label(g, line, 16, 64 + k * 24, `font:700 19px ${SANS};font-stretch:108%;fill:${C.ink}`));
    // The pencil's question is written from left to right: a clip that widens.
    const clip = el('clipPath', { id: `film-q${i}` }, defs);
    const reveal = el('rect', { x: 0, y: h - 48, width: 0, height: 48 }, clip);
    const query = group(g, { 'clip-path': `url(#film-q${i})` });
    stroke(query, `M16 ${h - 44}L${PW - 16} ${h - 44}`, C.line, 1, true);
    label(query, `?  ${paper.query}`, 16, h - 17, `font:italic 21px ${SERIF};fill:${C.red}`);
    return { g, h, reveal };
  });

  // --- State and timeline. Positions on the timeline are values of T.
  const S = {
    cs: 1.45, cx: 138, cy: -208, kc: 0,
    mx: 400, my: 520, mr: -90, faceX: 0, faceY: 0, eye: .1, walk: 0, reach: 0, startle: 0,
    zs: 1, bl: 1, puzzled: 0, panic: 0, decide: 0, hint: 0, thump: 0, storm: 0, door: 1,
    bedX: 0, fridgeX: 0, deskX: 760, stream: 0, gather: 0, merge: 0, say: 0,
    px: 1560, py: 640, pr: 0, phop: 0,
    cardY: -520, cardR: 7, lie: 0, a0: 0, a1: 0, a2: 0, t0: 0, t1: 0, t2: 0,
    talk: 0, kartaS: 0, kartaLie: 0, slideS: 0, slideLie: 0, bind: 0, book: 0, bookTick: 0,
    comp: 0, c0: 0, c1: 0, c2: 0, sit: 0, smile: 0, day: 0, cheer: 0, b0: 0, b1: 0,
  };
  const P = homes.map(([, y, r], i) => ({ x: -1000 - i * 130, y: y - 50, r: r - 22, q: 0 }));
  const H = shoutPlan.map(() => ({ s: 0, k: 0, d: 0 }));
  // His team: where each one stands, how far through their walk they are, whether they have seen their own task done.
  const M = [{ x: -700, walk: 0, aha: 0 }, { x: 1700, walk: 0, aha: 0 }, { x: 1760, walk: 0, aha: 0 }];
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'sine.inOut' } });
  const at = (t, d, vars, target = S) => tl.to(target, { duration: d, ...vars }, t);
  const pop = 'back.out(2)';

  // Act I. Close on the sleeper.
  at(.3, .14, { zs: 0 });
  at(.36, .1, { eye: 1 });
  at(.42, .28, { bl: .2 });
  at(.42, .48, { mx: 500, mr: 0 });
  at(.42, .2, { my: 462, ease: 'sine.out' });
  at(.62, .28, { my: 640, ease: 'sine.in' });
  // Act II. The camera backs away for the market: papers stream past, four stop, the pencil asks; he looks from one to the next.
  at(.55, .55, { cs: .7, cx: 164, cy: 322 });
  at(.62, .5, { stream: 1 });
  at(1.0, .2, { puzzled: 1 });
  at(1.52, .1, { puzzled: 0 });
  big.forEach((_, i) => {
    const t0 = .86 + i * .1, [x, y, r] = homes[i];
    at(t0, .2, { x, y, r, ease: 'power2.out' }, P[i]);
    at(t0 + .34, .09, { q: 1, ease: 'none' }, P[i]);
    at(1.58 + i * .03, .17, { y: -460, r: r + (i % 2 ? 14 : -14), ease: 'power2.in' }, P[i]);
  });
  // Quiet. He walks over to the fridge, slower with every step; the camera closes in and keeps closing.
  at(1.58, .2, { stream: 0 });
  at(1.58, .08, { faceX: 8 });
  at(1.62, .38, { cs: 1.3, cx: -449, cy: -96 });
  at(1.62, .37, { mx: 652, walk: 1, ease: 'sine.out' });
  at(1.7, .3, { hint: .45 });
  at(2.0, .27, { cs: 1.5, cx: -612, cy: -204, hint: 1, ease: 'none' });
  // He reaches; it thumps; he flinches, looks back at us, and reaches again.
  at(2.03, .05, { reach: 1 });
  at(2.09, .012, { thump: 1, ease: 'power2.out' });
  at(2.102, .04, { thump: 0 });
  at(2.09, .03, { reach: 0, startle: 1, mx: 628, ease: 'power2.out' });
  at(2.13, .03, { faceX: -8 });
  at(2.17, .04, { faceX: 8, startle: 0 });
  at(2.19, .05, { reach: 1, mx: 652 });
  // He opens it. What jumps out throws him back; then it shouts from everywhere.
  const BURST = 2.29;
  at(2.245, .045, { door: -.3, ease: 'power2.out' });
  at(BURST, .05, { hint: 0, reach: 0 });
  at(BURST, .08, { storm: 1, panic: 1 });
  at(BURST, .11, { mx: 556, ease: 'power2.out' });
  at(BURST - .01, .14, { cs: .85, cx: 92, cy: 176, ease: 'power2.out' });
  at(BURST + .04, .12, { stream: 1 });
  at(BURST + .1, .1, { faceX: 0 });
  H.forEach((h, i) => {
    const t0 = i ? BURST + .04 + i * .035 : BURST;
    at(t0, .1, { s: 1, ease: 'back.out(2.4)' }, h);
    at(t0, .1, { k: 1, ease: 'power2.out' }, h);
    at(2.84 + i * .02, .16, { d: 1, ease: 'power2.in' }, h);
  });
  // Act III. Enough: the bedroom leaves, a desk arrives, the papers land on it in a heap.
  at(2.74, .16, { panic: 0, decide: 1 });
  at(2.76, .44, { cs: 1, cx: -140, cy: 80 });
  at(2.8, .12, { say: 1, ease: pop });
  at(2.82, .18, { storm: 0 });
  at(2.86, .14, { door: 1 });
  at(2.9, .3, { bedX: -900, fridgeX: 900, ease: 'power2.in' });
  at(3.0, .26, { deskX: 0, ease: 'power2.out' });
  at(2.97, .36, { gather: 1, ease: 'none' });
  at(3.2, .1, { say: 0 });
  at(3.25, .15, { decide: 0 });
  // The consultation enters: the pencil, with the card of the first conversation. He leaves his answers; the pencil ticks them.
  at(3.27, .15, { px: 1010, phop: 1, ease: 'none' });
  at(3.3, .12, { cardY: -8, cardR: -1.5, ease: 'power2.out' });
  at(3.42, .03, { faceX: 7, faceY: -3, reach: .45 });
  [0, 1, 2].forEach(i => {
    const t0 = 3.42 + i * .055;
    at(t0, .03, { [`a${i}`]: 1, ease: 'none' });
    at(t0 + .012, .028, { px: 529, py: 78 + i * 76, pr: 26 });
    at(t0 + .04, .016, { [`t${i}`]: 1, ease: 'none' });
  });
  at(3.6, .04, { px: 1010, py: 640, pr: 0, reach: 0, faceY: 0 });
  // The screen of the turn leaves: the card lies down on the desk and the camera finds its place above the four steps.
  at(3.68, .16, { lie: 1 });
  at(3.8, .2, { kc: 1 });
  at(3.8, .16, { px: 1110, mx: 545 });
  // Step 1, the conversation: he speaks, the pencil answers. Short.
  at(4.04, .14, { talk: 1, ease: 'none' });
  // Step 2, recognition: the pencil goes over the heap and it becomes one card.
  at(4.2, .04, { px: 968, py: 540, pr: -24, faceY: 2 });
  at(4.22, .1, { merge: 1, ease: 'none' });
  at(4.28, .05, { kartaS: 1, ease: pop });
  at(4.3, .04, { px: 1110, py: 640, pr: 0 });
  at(4.33, .04, { kartaLie: 1 });
  // Step 3, the consultation in the company: his team comes in, the presentation goes up, each of them sees their own task.
  at(4.38, .1, { x: 396, walk: 1, ease: 'sine.out' }, M[0]);
  at(4.39, .1, { x: 846, walk: 1, ease: 'sine.out' }, M[1]);
  at(4.4, .1, { x: 996, walk: 1, ease: 'sine.out' }, M[2]);
  at(4.4, .05, { faceX: 0, faceY: 0 });
  at(4.44, .05, { slideS: 1, ease: pop });
  M.forEach((member, i) => at(4.485 + i * .016, .016, { aha: 1, ease: 'none' }, member));
  at(4.54, .035, { slideLie: 1 });
  // Step 4, the compendium: everything is bound into one document, and the pencil signs it off.
  at(4.585, .05, { bind: 1 });
  at(4.615, .05, { book: 1, ease: pop });
  at(4.65, .03, { px: 786, py: 528, pr: -22 });
  at(4.68, .02, { bookTick: 1, ease: 'none' });
  at(4.71, .04, { px: 1110, py: 640, pr: 0 });
  // Act IV. The compendium opens on its recommendation; three ticks, and the pencil has done its work.
  at(4.8, .22, { kc: 0, cs: .82, cx: 45, cy: 175 });
  at(5.05, .09, { comp: 1 });
  [0, 1, 2].forEach(i => {
    at(5.15 + i * .04, .022, { px: 708 + (50 - COMP[0] / 2) * COMPK, py: 160 + (compRows[i].y - COMP[1] / 2) * COMPK, pr: 26 });
    at(5.172 + i * .04, .016, { [`c${i}`]: 1, ease: 'none' });
  });
  at(5.29, .04, { px: 1110, py: 640, pr: 0 });
  at(5.31, .07, { comp: 0 });
  at(5.33, .025, { pr: -16 });
  at(5.355, .025, { pr: 0 });
  at(5.38, .12, { px: 1900, phop: 2, ease: 'power1.in' });
  // He is not alone with it any more: he sits down at a tidy desk, his team around him, daylight in the window.
  at(5.36, .1, { day: 1 });
  at(5.38, .1, { sit: 1, mx: 700, smile: 1 });
  at(5.4, .08, { x: 440 }, M[0]);
  at(5.4, .08, { x: 1060 }, M[2]);
  at(5.5, .05, { b0: 1, ease: pop });
  at(5.52, .06, { cheer: 1, ease: pop });
  at(5.56, .05, { b1: 1, ease: pop });

  root.appendChild(svg);
  const stepsList = sections[4]?.querySelector('.story-steps');
  const lastSection = sections[sections.length - 1];
  const cam = { s: 1, x: 0, y: 0 };
  const toStage = (x, y) => [x * cam.s + cam.x, y * cam.s + cam.y];
  const set = (node, value) => node.setAttribute('transform', value);
  const show = (node, on) => node.setAttribute('visibility', on ? 'visible' : 'hidden');
  /* A sheet standing upright (lie 0) or lying on the desk (lie 1), about its own centre. */
  const place = (node, [w, h], x, y, lie, scale, rot = 0) => set(node, `translate(${n(x)} ${n(y)}) matrix(1 0 ${n(-.6 * lie)} ${n(lerp(1, .42, lie))} 0 0) rotate(${n(rot)}) scale(${n(Math.max(.0001, scale))}) translate(${-w / 2} ${-h / 2})`);
  let T = -1, shown = '', last = performance.now(), boil = 0, boilAt = 0, slot = manSlot;
  const start = last;

  function timeline() {
    let value = 0;
    for (let i = 0; i < sections.length; i++) {
      const r = sections[i].getBoundingClientRect();
      if (r.top > 0) break;
      value = i + clamp01(-r.top / r.height);
    }
    return value;
  }
  /* The steps screen keeps its four columns of text at the bottom, so there the picture is fitted into what is left above
     them, whatever the window's height. */
  function stepsCamera() {
    const box = svg.getBoundingClientRect(), list = stepsList.getBoundingClientRect();
    const k = Math.min(box.width / 1000, box.height / 800), y0 = box.top + (box.height - 800 * k) / 2;
    const ground = (list.top - y0) / k - 30, ceiling = (window.innerHeight * .1 - y0) / k;
    const s = Math.max(.3, Math.min(.74, (ground - ceiling) / 440));
    return [s, 640 - 766 * s, ground - 640 * s];
  }

  function tick() {
    const target = timeline();
    // Follow the scroll with a short, frame-rate independent lag, so a slow machine is not left behind.
    const now = performance.now(), dt = Math.min(.1, (now - last) / 1000);
    last = now;
    T = T < 0 ? target : T + (target - T) * (1 - Math.exp(-dt * 10));
    // The film ends with the last screen of the story and scrolls away with it.
    const vh = window.innerHeight, bottom = lastSection.getBoundingClientRect().bottom;
    const shift = bottom < vh ? `translateY(${Math.round(bottom - vh)}px)` : '';
    if (shift !== shown) { root.style.transform = shift; shown = shift; }
    if (bottom <= 0) return;
    tl.time(Math.min(T, tl.duration()));
    const time = (now - start) / 1000;
    if (now - boilAt > 190) { boilAt = now; boil ^= 1; svg.classList.toggle('boil', !!boil); }

    cam.s = S.cs; cam.x = S.cx; cam.y = S.cy;
    if (S.kc > 0 && stepsList) { const [s, x, y] = stepsCamera(); cam.s = lerp(S.cs, s, S.kc); cam.x = lerp(S.cx, x, S.kc); cam.y = lerp(S.cy, y, S.kc); }
    const view = `translate(${n(cam.x)} ${n(cam.y)}) scale(${n(cam.s)})`;
    set(world, view);
    set(top, view);

    // The bedroom. Asleep, the blanket breathes.
    const roomOn = S.bedX > -890;
    show(bed, roomOn); show(bedTop, roomOn); show(fridge, roomOn);
    show(desk, S.deskX < 750);
    set(bed, `translate(${n(S.bedX)} 0)`);
    set(bedTop, `translate(${n(S.bedX)} 572) scale(1 ${n(S.bl * (1 + S.zs * Math.sin(time * 1.9) * .025))}) translate(0 -572)`);
    const tremble = Math.sin(time * 34) * (S.hint * 1.1 + S.storm * .5);
    set(fridge, `translate(${n(S.fridgeX)} ${n(-S.thump * 16)})`);
    set(fridgeBody, `rotate(${n(tremble + S.thump * 3)} 830 640)`);
    set(door, `translate(900 0) skewY(${n((1 - S.door) * -5)}) scale(${n(S.door)} 1) translate(-900 0)`);
    gapLight.setAttribute('opacity', n(S.hint * (.55 + .45 * Math.sin(time * 9))));
    rays.setAttribute('opacity', n(Math.max(seg(S.hint, .4, 1) * (.5 + .5 * Math.sin(time * 11)), S.thump, S.storm)));
    set(desk, `translate(${n(S.deskX)} 0)`);
    show(day, S.day > .01);
    day.setAttribute('opacity', n(S.day));
    show(chair, S.sit > .01);
    set(chair, `translate(0 ${n((1 - S.sit) * 40)})`);
    chair.setAttribute('opacity', n(S.sit));

    // The man.
    const stride = Math.sin(S.walk * Math.PI * 8), panic = S.panic, awake = seg(S.mr, -60, 0), sit = S.sit, walking = S.walk > 0 && S.walk < 1;
    const mx = S.mx + panic * Math.sin(time * 21) * 2.5, my = S.my - Math.abs(stride) * 5 * (walking ? 1 : 0) + sit * 27;
    set(man, `translate(${n(mx)} ${n(my)}) rotate(${n(S.mr + panic * Math.sin(time * 9) * 2.5)}) scale(1 ${n(1 - panic * .05)})`);
    const want = sit > .2 ? manBack : S.mr > -45 ? manFront : manSlot;
    if (want !== slot) { slot = want; slot.appendChild(man); }
    set(manShade, `translate(${n(mx)} 0)`);
    manShade.setAttribute('opacity', n(.3 * awake * (1 - sit) * (1 - Math.abs(S.my - 640) / 180)));
    hero.legs.forEach((leg, i) => set(leg, `rotate(${n((i ? 1 : -1) * stride * 24)})`));
    hero.legGroup.forEach(leg => show(leg, sit < .5));
    const look = S.puzzled * Math.sin(time * 1.5) * 8 + panic * Math.sin(time * 2.6) * 9;
    set(hero.face, `translate(${n(S.faceX + look)} ${n(S.faceY + panic * -2)})`);
    set(hero.head, `rotate(${n(S.puzzled * Math.sin(time * 1.5 + .6) * 5)})`);
    const wide = Math.max(panic, S.startle);
    hero.eyes.forEach(eye => { eye.setAttribute('ry', n(3.3 * S.eye * (1 + wide * .5))); eye.setAttribute('rx', n(3.3 * (1 + wide * .35))); });
    hero.mouth.setAttribute('opacity', n((1 - panic) * (1 - S.smile)));
    hero.grin.setAttribute('opacity', n(S.smile));
    hero.gasp.setAttribute('opacity', n(panic));
    hero.arms.forEach((arm, i) => {
      const side = i ? -1 : 1; // positive turns clockwise: the left arm swings out to the left
      const swing = walking ? -stride * 14 * (i ? 1 - S.reach : 1) : 0;
      const acting = i ? -S.reach * 76 - S.decide * 168 - S.startle * 30 : S.decide * 10 + S.startle * 30;
      set(arm, `rotate(${n((side * (7 + S.puzzled * 24 + panic * (150 + Math.sin(time * 13 + i) * 9)) + acting + swing) * (1 - sit * .6))})`);
    });
    zs.forEach((z, i) => {
      const u = (time * .3 + i / 3) % 1;
      set(z, `translate(${n(196 + u * 46)} ${n(478 - u * 96)}) scale(${n(.45 + u * .7)})`);
      z.setAttribute('opacity', n(S.zs * Math.sin(u * Math.PI)));
    });

    // His team: they walk in, stand around the desk, and stay.
    team.forEach((member, i) => {
      const m = M[i], on = m.x > -650 && m.x < 1650;
      show(member.g, on);
      if (!on) return;
      const step = Math.sin(m.walk * Math.PI * 6), going = m.walk > 0 && m.walk < 1;
      const bob = going ? Math.abs(step) * 5 : Math.sin(time * 1.6 + i * 2) * 1.2 + S.cheer * Math.abs(Math.sin(time * 4 + i)) * 4;
      set(member.g, `translate(${n(m.x)} ${n(640 - bob)}) scale(${[.95, .97, .92][i]})`);
      member.legs.forEach((leg, k) => set(leg, `rotate(${n(going ? (k ? 1 : -1) * step * 22 : 0)})`));
      const raised = k => (i === 0 && !k) || (i === 2 && k) ? S.cheer * 150 : 0;
      member.arms.forEach((arm, k) => set(arm, `rotate(${n((k ? -1 : 1) * (7 + raised(k)) + (going ? -step * 12 : 0))})`));
      set(member.face, `translate(${i === 0 ? 5 : -5} 0)`);
      teamAha[i].setAttribute('stroke-dashoffset', n(1 - m.aha));
      teamAha[i].setAttribute('opacity', n(1 - S.slideLie));
    });
    talkMarks.forEach((marks, i) => {
      const on = i ? pulse(S.talk, .26, .5) + pulse(S.talk, .76, 1) : pulse(S.talk, .02, .26) + pulse(S.talk, .5, .76);
      set(marks, i ? `translate(${n(S.px - 34)} 506)` : `translate(${n(S.mx + 50)} 402)`);
      marks.setAttribute('opacity', n(on));
    });

    // The four papers that can be read.
    big.forEach(({ g, h, reveal }, i) => {
      const p = P[i], bob = Math.sin(time * .9 + i * 1.7) * 4;
      show(g, p.y > -455);
      set(g, `translate(${n(p.x)} ${n(p.y + bob)}) rotate(${n(p.r)} ${PW / 2} ${h / 2})`);
      reveal.setAttribute('width', n(p.q * PW));
    });

    // "AI!" from everywhere.
    shouts.forEach(({ g, inner }, i) => {
      const [from, to, size] = shoutPlan[i], h = H[i];
      const scale = Math.max(0, h.s * (1 - h.d)) * size;
      show(g, scale > .001);
      set(g, `translate(${n(lerp(from[0], to[0], h.k))} ${n(lerp(from[1], to[1], h.k) + h.d * 260)}) scale(${n(scale)})`);
      set(inner, `rotate(${n(Math.sin(time * 4 + i * 1.3) * 5)}) scale(${n(1 + Math.sin(time * 7 + i * 2.1) * .06)})`);
    });
    show(bubble, S.say > .001);
    set(bubble, `translate(${n(S.mx + 6)} 372) scale(${n(Math.max(0, S.say))})`);
    [[452, 372], [1050, 388]].forEach(([x, y], i) => {
      const b = S[`b${i}`];
      show(teamBubbles[i], b > .001);
      set(teamBubbles[i], `translate(${x} ${y}) scale(${n(Math.max(0, b) * .8)})`);
    });

    // The sheets. Each stands in front of him while it is being made, lies down on the desk, and ends up in the compendium.
    const bind = S.bind, deskX = S.deskX, toBook = x => lerp(x, 766, bind);
    show(card, S.cardY > -519 && bind < 1);
    place(card, CARD, lerp(700, toBook(669), S.lie), lerp(S.cardY + CARD[1] / 2, 528, S.lie) - Math.sin(S.lie * Math.PI) * 30, S.lie, lerp(1, .15, S.lie) * (1 - bind), S.cardR * (1 - S.lie));
    cardTicks.forEach(({ tick: mark, answer }, i) => { mark.setAttribute('stroke-dashoffset', n(1 - S[`t${i}`])); answer.setAttribute('stroke-dashoffset', n(1 - S[`a${i}`])); });
    show(karta, S.kartaS > .001 && bind < 1);
    place(karta, KARTA, lerp(772, toBook(770), S.kartaLie), lerp(330, 530, S.kartaLie) - Math.sin(S.kartaLie * Math.PI) * 24, S.kartaLie, S.kartaS * lerp(1, .2, S.kartaLie) * (1 - bind), -2 * (1 - S.kartaLie));
    show(slide, S.slideS > .001 && bind < 1);
    place(slide, SLIDE, lerp(772, toBook(858), S.slideLie), lerp(330, 532, S.slideLie) - Math.sin(S.slideLie * Math.PI) * 24, S.slideLie, S.slideS * lerp(1, .2, S.slideLie) * (1 - bind), 2 * (1 - S.slideLie));
    show(book, S.book > .001);
    set(book, `translate(766 532) scale(${n(Math.max(.0001, S.book))}) translate(-766 -532)`);
    bookTick.setAttribute('stroke-dashoffset', n(1 - S.bookTick));
    bookTick.setAttribute('opacity', n(clamp01(S.book) * (1 - S.comp)));
    show(comp, S.comp > .001);
    place(comp, COMP, lerp(766, 708, S.comp), lerp(528, 160, S.comp), 1 - S.comp, lerp(.12, COMPK, S.comp), -1.2 * S.comp);
    compRows.forEach(({ tick: mark }, i) => mark.setAttribute('stroke-dashoffset', n(1 - S[`c${i}`])));

    // The pencil hops along on its tip.
    show(pencil, S.px < 1540);
    const hop = Math.abs(Math.sin(S.phop * Math.PI * 5)) * 26 + (S.py === 640 && S.px < 1500 ? Math.max(0, Math.sin(time * 2.2)) * 5 : 0);
    set(pencil, `translate(${n(S.px)} ${n(S.py - hop)}) rotate(${n(S.pr + Math.sin(time * 1.3) * 1.5)})`);

    // Small sheets: a stream from left to right, then a heap on the desk; the pencil turns the heap into one card.
    for (let i = 0; i < N; i++) {
      const p = rand(i), q = rand(i + 50), s = rand(i + 99);
      const u = (T * .55 + time * .035 * (.6 + q) + p) % 1;
      const fx = -760 + u * 1900, fy = 50 + q * 600 + Math.sin(u * 9 + i) * 42;
      const g = seg(S.gather, q * .5, .5 + q * .5), merged = seg(S.merge, p * .5, .5 + p * .5), flat = g * (1 - merged);
      const [tx, ty] = toStage(lerp(652 + p * 236, 772, merged) + deskX, lerp(530 + q * 22 - i * .4, 340, merged));
      const flip = Math.cos(u * 15 + i * 2);
      const scale = lerp(S.stream * (.95 + s * .6), cam.s * .95, g) * (1 - merged);
      show(sheets[i], scale > .01);
      set(sheets[i], `translate(${n(lerp(fx, tx, g))} ${n(lerp(fy, ty, g) - Math.sin(g * Math.PI) * 130)}) matrix(1 0 ${n(-.6 * flat)} ${n(lerp(1, .42, flat))} 0 0) rotate(${n(lerp(u * 420 + i * 40, (s - .5) * 70 * (1 - merged), g))}) scale(${n(scale * lerp(Math.sign(flip) * Math.max(.18, Math.abs(flip)), 1, g))} ${n(scale)})`);
    }
  }
  gsap.ticker.add(tick);
  tick();
  return () => {
    gsap.ticker.remove(tick);
    tl.kill();
    // Only its own drawing: another run of the film may already own the root.
    svg.remove();
    if (!root.firstChild) root.style.transform = '';
  };
}
