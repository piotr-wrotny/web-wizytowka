// The story as a small drawn film behind the home page's text, scrubbed by the scroll. Loaded on demand (wide screens, motion
// on); without it the page shows its flat sheets. It is a pencil drawing on cut-out paper: every shape is sketched by rough.js
// (twice, so the line "boils" like hand-drawn animation) and moved by one GSAP timeline. The little man in a suit stands for
// the visitor; he is nobody in particular. The solution is the advisor, drawn after the founder (short black hair, a small
// moustache and beard, no glasses): first on the phone, then in the room at a projector. He helps and leaves; the hero stays
// the hero and the last frame is his.
//
// Four acts. Timeline T: the index of the section whose top has passed the top of the screen, plus how far it has scrolled.
//   I    the good world
//        0 hero      asleep under a safe blanket, the moon in the window
//   II   the trouble
//        0.4         woken up; the market's papers stream past, four stop in front of him with a question in red pencil
//        1.6 to 2.3  the papers leave and it goes quiet. He walks over to the fridge, slower and slower; it trembles, it thumps,
//                    he flinches, looks back at us, reaches again
//        2.3 stawka  he opens it, and "AI!" bursts out at him; then it shouts from everywhere. Now the problem has a name
//   III  the solution (founder, 2026-11-28): quiet, a thought, a call, a meeting, something concrete for them
//        2.75 zwrot  the shouting stops, the papers are gone, the bedroom leaves. Alone, he thinks: "Muszę to uporządkować."
//                    He picks up the phone. The advisor answers and asks his three questions; each answer is ticked
//        4 spotkanie one scene, the meeting in the company (founder, 2026-11-27; it replaces the four steps played one after
//                    another, with the Karta rozpoznania): the call ends;
//                    the team comes in, the advisor stands at a projector and asks, everyone answers, and each answer is
//                    written on the slide as a task of their own; the slide
//                    becomes the compendium, which the advisor hands over before he goes
//   IV   the better world
//        5 koniec    the compendium opens on its recommendation and gets its green seal, then closes into a book. No desk,
//                    no advisor: the hero stands in the middle with the book in his hand, his team around him celebrating;
//                    the camera closes in on him
//
// The timeline tweens plain state objects; the ticker turns the state into transforms. Ambient motion (breathing, trembling,
// wobble) runs on the clock and is gated by the state, so the scroll only ever decides what happens, not how fast a hand shakes.
import gsap from 'gsap';
import rough from 'roughjs';

const NS = 'http://www.w3.org/2000/svg';
const C = { paper: '#fcfdfb', ink: '#14161a', soft: '#4d5359', line: '#c6ccc7', blue: '#2340c8', blueSoft: '#cdd6ff', red: '#c02a16', glow: '#ff6a4d', green: '#1f7a4d' };
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

/* The drawing kit: sketched shapes, tick marks, figures and the green seal, bound to one SVG. */
function kit(svg) {
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

  const tickMark = (parent, x, y, k = 1, color = C.blue) => el('path', { d: `M${x} ${y + 1 * k}L${x + 9 * k} ${y + 11 * k}L${x + 26 * k} ${y - 12 * k}`, fill: 'none', stroke: color, 'stroke-width': 3.4 * Math.sqrt(k), 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': 1, 'stroke-dashoffset': 1 }, parent);
  /* A figure, built around its feet; arms, legs and face are separate so it can act. The hero wears a suit and a blue tie;
     the people of his team are drawn the same way and are nobody in particular either. */
  function figure(parent, { tie = false, hair = 'short', cloth = { hatch: C.ink, gap: 3.2, weight: 1.25 }, smile = false, glasses = false, beard = false, trousers = cloth } = {}) {
    const g = group(parent);
    const limb = (x, y, d, opts) => { const inner = group(group(g, { transform: `translate(${x} ${y})` })); sketch(inner, d, opts); return inner; };
    const legs = [-1, 1].map(side => {
      const leg = limb(side * 16, -98, rrect(-12, -4, 24, 98, 9), trousers);
      sketch(leg, rrect(-15 + side * 5, 86, 34, 13, 6), { hatch: C.ink, gap: 2.2 });
      return leg;
    });
    const legGroup = legs.map(leg => leg.parentNode);
    sketch(g, rrect(-40, -194, 80, 104, 18), cloth);
    if (tie) {
      sketch(g, poly([[-13, -193], [13, -193], [0, -148]]), { width: 1.4 });
      sketch(g, poly([[-4.5, -190], [4.5, -190], [6.5, -150], [0, -138], [-6.5, -150]]), { fill: C.blue, width: 1.2 });
    } else sketch(g, 'M-12 -193Q0 -176 12 -193Z', { width: 1.3 });
    // The advisor wears a shirt, collar open and no tie: collar points, a placket down the front and its buttons.
    if (beard) {
      [-1, 1].forEach(side => sketch(g, poly([[side * 13, -194], [side * 2, -177], [side * 17, -171]]), { ...cloth, width: 1.3 }));
      stroke(g, 'M0 -176L0 -92', C.ink, 1.2, true);
      for (const y of [-160, -138, -116]) sketch(g, circle(0, y, 2.2), { width: 1, still: true });
    }
    const head = group(group(g, { transform: 'translate(0 -224)' }));
    const ink = { hatch: C.ink, gap: 2.4, angle: 20, weight: 1.3 };
    if (hair === 'long') sketch(head, 'M-36 -6Q-44 30 -38 52L-24 50Q-28 20 -26 -6ZM36 -6Q44 30 38 52L24 50Q28 20 26 -6Z', ink);
    if (hair === 'bun') sketch(head, circle(0, -40, 13), ink);
    sketch(head, circle(0, 0, 35));
    if (hair === 'bald') stroke(head, 'M-30 -18Q0 -30 30 -18', C.ink, 1.4);
    // The advisor's hair (after the founder's photo, 2026-11-28): an ordinary short cut, a little fuller on top than the
    // others' and brushed to one side. It keeps close to the head: any higher and it reads as a big head of hair.
    else if (beard) sketch(head, 'M-34 -9Q-37 -27 -22 -35Q-2 -41 16 -37Q35 -30 34 -9Q26 -19 12 -22Q-10 -25 -34 -9Z', { ...ink, gap: 2 });
    else sketch(head, hair === 'long' ? 'M-34 -8A35 35 0 0 1 34 -8Q20 -22 4 -24Q-16 -22 -34 -8Z' : 'M-33 -12A35 35 0 0 1 33 -12Q16 -25 0 -20Q-18 -16 -33 -12Z', ink);
    const face = group(head);
    const eyes = [-1, 1].map(side => el('ellipse', { cx: side * 11.5, cy: 3, rx: 3.3, ry: 3.3, fill: C.ink }, face));
    if (glasses) el('path', { d: `${circle(-11.5, 3, 8)}${circle(11.5, 3, 8)}M-3.5 3L3.5 3`, fill: 'none', stroke: C.ink, 'stroke-width': 1.5 }, face);
    const line = { fill: 'none', stroke: C.ink, 'stroke-width': 1.8, 'stroke-linecap': 'round' };
    const mouth = el('path', { d: 'M-5 18Q0 20 5 18', ...line, opacity: smile ? 0 : 1 }, face);
    const grin = el('path', { d: beard ? 'M-6 17Q0 23 6 17' : 'M-8 15Q0 25 8 15', ...line, opacity: smile ? 1 : 0 }, face);
    if (beard) {
      // After the founder's photo (2026-11-28): dark, strong eyebrows, a full moustache, and a goatee on the chin only, not
      // along the jaw. A few pencil strokes each, nothing bushy.
      el('path', { d: 'M-19 -7Q-12 -11.5 -5 -7.5M5 -7.5Q12 -11.5 19 -7', fill: 'none', stroke: C.ink, 'stroke-width': 3.2, 'stroke-linecap': 'round' }, face);
      el('path', { d: 'M-10.5 14.5Q-5.5 8.5 0 11.5Q5.5 8.5 10.5 14.5', fill: 'none', stroke: C.ink, 'stroke-width': 3.8, 'stroke-linecap': 'round' }, face);
      sketch(face, 'M-7.5 23.5Q-9 33 0 36.5Q9 33 7.5 23.5Q0 26.5 -7.5 23.5Z', { fill: C.ink, hatch: C.ink, gap: 1.4, angle: 80, weight: 1.4, width: 1.2 });
    }
    const gasp = el('ellipse', { cx: 0, cy: 19, rx: 5, ry: 7, fill: C.ink, opacity: 0 }, face);
    const arms = [-1, 1].map(side => {
      const arm = limb(side * 45, -180, rrect(-10, -6, 20, 80, 9), cloth);
      sketch(arm, circle(0, 82, 10.5), { width: 1.5 });
      return arm;
    });
    return { g, legs, legGroup, head, face, eyes, mouth, grin, gasp, arms };
  }

  /* The one green on the site: the seal on the finished compendium. A sign that it is done, not a certificate. */
  function seal(parent, r) {
    const g = group(parent);
    sketch(g, circle(0, 0, r), { fill: C.green, stroke: C.green, hatch: '#165c39', gap: 5, angle: 50, weight: .8, width: 1.2 });
    el('path', { d: `M${-.42 * r} ${.02 * r}L${-.1 * r} ${.36 * r}L${.46 * r} ${-.34 * r}`, fill: 'none', stroke: C.paper, 'stroke-width': Math.max(2, r * .15), 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    return g;
  }
  /* The compendium as he holds it: a booklet with a blue ribbon and the green seal. */
  function booklet(parent) {
    sketch(parent, rrect(-20, -8, 40, 52, 3), { width: 1.4 });
    sketch(parent, poly([[-16, -8], [-9, -8], [-9, 44], [-16, 44]]), { fill: C.blue, width: 1 });
    seal(group(parent, { transform: 'translate(5 18)' }), 11);
  }
  return { sketch, stroke, shade, tickMark, figure, seal, booklet };
}

/* After the green button of the story: the hero stands on the contact card with his compendium. Decoration only. */
export function drawGuest(container) {
  if (!container || container.firstChild) return;
  const svg = el('svg', { viewBox: '-70 -330 170 340', focusable: 'false' }, container);
  const { figure, booklet } = kit(svg);
  const guest = figure(svg, { tie: true, smile: true });
  guest.arms[1].setAttribute('transform', 'rotate(-152)');
  guest.arms[0].setAttribute('transform', 'rotate(7)');
  booklet(group(guest.arms[1], { transform: 'translate(0 96) rotate(180)' }));
}

export async function startFilm({ root, sections, papers, paperLabel, say, card: cardContent, slide: slideContent, ending, team: teamSays, talk }) {
  await Promise.all([`700 19px Archivo`, `800 52px Archivo`, `500 13px Archivo`, `italic 30px "Brygada 1918"`, `17px "Brygada 1918"`].map(f => document.fonts.load(f, 'AIąż?')));
  const svg = el('svg', { viewBox: '0 0 1000 800', preserveAspectRatio: 'xMaxYMid meet', focusable: 'false' });
  const { sketch, stroke, shade, tickMark, figure, seal, booklet } = kit(svg);
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

  const defs = el('defs', {}, svg);
  const world = group(svg);          // the room, seen by a camera (scale and shift)
  const swarmLayer = group(svg);     // the market's stream of sheets
  const front = group(svg);          // the four papers that can be read
  const top = group(svg);            // seen by the same camera as the room, but in front of the stream: sheets and speech

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

  // --- Acts III and IV. No furniture: people, what they hold, and a projector screen for the meeting.
  const day = group(world, { visibility: 'hidden' });
  sketch(day, rrect(664, 120, 132, 132, 5));
  stroke(day, 'M730 122L730 250M666 186L794 186', C.ink, 1.5);
  sketch(day, circle(762, 154, 15), { width: 1.2, hatch: C.soft, gap: 4 });
  stroke(day, 'M762 130L762 124M782 138L787 133M738 154L732 154M743 138L738 133M786 154L792 154', C.ink, 1.3);
  // The meeting in the company: a screen on a tripod, a projector on the floor, the slide thrown onto the screen.
  const SCREEN = [660, 150, 380, 250];
  const projector = group(world, { visibility: 'hidden' });
  stroke(projector, `M850 ${SCREEN[1] + SCREEN[3]}L850 604M850 600L792 640M850 600L908 640M850 600L850 640`, C.ink, 2.4);
  sketch(projector, poly([[718, 606], [SCREEN[0] + 8, SCREEN[1] + SCREEN[3] - 4], [SCREEN[0] + SCREEN[2] - 8, SCREEN[1] + SCREEN[3] - 4], [742, 606]]), { fill: null, stroke: null, hatch: C.line, gap: 11, angle: 80, weight: .7, still: true });
  sketch(projector, rrect(SCREEN[0] - 8, SCREEN[1] - 8, SCREEN[2] + 16, SCREEN[3] + 16, 6), { hatch: C.ink, gap: 2.6, angle: 35 });
  sketch(projector, rrect(...SCREEN, 3), { width: 1.4 });
  sketch(projector, rrect(700, 606, 58, 28, 5), { hatch: C.soft, gap: 3 });
  sketch(projector, circle(730, 606, 7), { fill: C.blueSoft, width: 1.2 });

  const manShade = shade(world, 0, 643, 58);
  const manFront = group(world);     // once he is up, he stands in front of everything
  const hero = figure(manSlot, { tie: true });
  const man = hero.g;
  const team = [
    figure(world, { hair: 'long', cloth: { hatch: C.soft, gap: 5, angle: 40 }, smile: true }),
    figure(world, { hair: 'bald', glasses: true, cloth: { hatch: C.soft, gap: 4, angle: -60, weight: 1 }, smile: true }),
    figure(world, { hair: 'bun', cloth: { hatch: C.ink, gap: 6, angle: 10, weight: 1 }, smile: true }),
  ];
  // The advisor wears the site's blue: the colour that confirms and carries the offer.
  const blue = { hatch: C.blue, gap: 3.4, angle: -50, weight: 1.15 };
  const advisor = figure(world, { beard: true, smile: true, cloth: blue, trousers: { hatch: C.ink, gap: 3.2, weight: 1.25 } });
  // A phone, in a hand.
  const handset = arm => {
    const g = group(arm, { visibility: 'hidden', transform: 'translate(0 90) rotate(180)' });
    // A smartphone that reads as one at this size: a dark body, a lit screen, the line of the speaker and a camera dot.
    sketch(g, rrect(-12, -7, 24, 44, 5), { hatch: C.ink, gap: 1.8, width: 1.5 });
    sketch(g, rrect(-9, -1, 18, 30, 2), { fill: C.blueSoft, stroke: C.ink, width: 1, still: true });
    stroke(g, 'M-4 -4L4 -4', C.paper, 1.6, true);
    sketch(g, circle(0, 33, 1.6), { fill: C.paper, stroke: null, still: true });
    return g;
  };
  const phone = handset(hero.arms[1]);
  // The other end of the call: the advisor in a round cut-out, phone at his ear.
  const VIG = [884, 462, 140];
  const vig = group(top, { visibility: 'hidden' });
  sketch(vig, circle(...VIG), { hatch: C.line, gap: 10, angle: -30, weight: .7, width: 1 });
  el('circle', { cx: VIG[0], cy: VIG[1], r: VIG[2] }, el('clipPath', { id: 'film-vig' }, defs));
  const caller = figure(group(group(vig, { 'clip-path': 'url(#film-vig)' }), { transform: `translate(${VIG[0]} ${VIG[1] + 262}) scale(1.3)` }), { beard: true, smile: true, cloth: blue });
  caller.legGroup.forEach(leg => leg.setAttribute('visibility', 'hidden'));
  handset(caller.arms[0]).setAttribute('visibility', 'visible');
  caller.arms[0].setAttribute('transform', 'rotate(154) scale(1 .58)');
  stroke(vig, circle(...VIG), C.ink, 2.6);
    // "z" over the sleeper: only ever seen on the blue of the first screen.
  const zs = [0, 1, 2].map(() => label(world, 'z', 0, 0, `font:italic 600 44px ${SERIF};fill:${C.paper}`, { 'text-anchor': 'middle' }));
  // On the phone, a few marks beside whoever is speaking.
  const talkMarks = [0, 1].map(() => stroke(top, 'M0 0L-22 -12M2 14L-24 14M0 28L-22 40', C.ink, 2.6));

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

  // --- What the consultation is made of. The three questions of the first conversation are asked on the phone: they stack up
  // between the two of them, and each gets its tick when he has answered.
  const pills = cardContent.questions.map(question => {
    const g = group(top, { visibility: 'hidden' });
    measure.font = `italic 23px ${SERIF}`;
    const w = Math.ceil(measure.measureText(question).width) + 84;
    sketch(g, rrect(0, -27, w, 54, 27), { width: 1.6 });
    label(g, question, 60, 0, `font:italic 23px ${SERIF};fill:${C.ink}`, { 'dominant-baseline': 'central' });
    return { g, tick: tickMark(g, 20, 0, .9) };
  });
  // The slide on the projector screen, where it is handed over as a book, and the height of each of its rows.
  const SLIDE = [300, 216], SLIDE_AT = [850, 275, 1.15], HANDOVER = [550, 528], rowY = i => 151 + i * 24;
  const slide = sheet(top, ...SLIDE, slideContent.title);
  wrap(slideContent.heading, `600 22px ${SERIF}`, SLIDE[0] - 44).forEach((line, k) => label(slide, line, 22, 86 + k * 27, `font:600 22px ${SERIF};fill:${C.ink}`));
  // The rows of the slide are the team's own tasks, in words: each is written in when its owner has spoken.
  const slideRows = talk.tasks.map((task, i) => {
    const row = group(slide, { opacity: 0 });
    // A row as on the site's own sheets: a hairline above, a blue serif numeral, the task in words. No bullet points.
    stroke(row, `M22 ${rowY(i) - 12}L${SLIDE[0] - 22} ${rowY(i) - 12}`, C.line, 1, true);
    label(row, String(i + 1), 24, rowY(i), `font:500 20px ${SERIF};fill:${C.blue}`, { 'dominant-baseline': 'central' });
    label(row, task, 48, rowY(i), `font:600 17px ${SANS};fill:${C.ink}`, { 'dominant-baseline': 'central' });
    return row;
  });
  // The compendium, open on its last page: the recommendation of the synthetic sample.
  const COMP = [470, 0], COMPK = 1.16;
  const comp = group(top);
  const compRows = [];
  {
    let y = 100;
    const rows = ending.rows.map(row => { const lines = wrap(row.text, `17px ${SERIF}`, COMP[0] - 96); const from = y; y += 30 + lines.length * 22 + 20; return { row, lines, from }; });
    // Room under the last row for the seal: it never lands on the words of the recommendation.
    COMP[1] = y + 64;
    sheet(comp, ...COMP, ending.title, ending.label);
    label(comp, ending.part, 22, 72, `font:500 13px ${SANS};letter-spacing:.04em;fill:${C.soft}`);
    rows.forEach(({ row, lines, from }, i) => {
      label(comp, row.label, 66, from + 10, `font:700 17px ${SANS};fill:${C.ink}`, { 'dominant-baseline': 'central' });
      lines.forEach((line, k) => label(comp, line, 66, from + 36 + k * 22, `font:17px ${SERIF};fill:${C.ink}`, { 'dominant-baseline': 'central' }));
      if (i < rows.length - 1) stroke(comp, `M22 ${from + 36 + lines.length * 22}L${COMP[0] - 22} ${from + 36 + lines.length * 22}`, C.line, 1, true);
      compRows.push({ y: from + 10, tick: tickMark(comp, 24, from + 10) });
    });
  }
  const compSeal = seal(group(comp), 32);
  // Closed, the plan is a book: the compendium, made to measure. A real one: a back cover, a block of pages, a spine, a ribbon.
  const COVER = [250, 330];
  const cover = group(top, { visibility: 'hidden' });
  sketch(cover, rrect(16, 13, COVER[0], COVER[1], 5), { hatch: C.ink, gap: 3, angle: 30 });
  sketch(cover, rrect(9, 8, COVER[0] + 2, COVER[1] + 1, 3), { hatch: C.soft, gap: 2.2, angle: 0, weight: .8, width: 1.2 });
  sketch(cover, poly([[176, COVER[1] + 6], [196, COVER[1] + 6], [196, COVER[1] + 44], [186, COVER[1] + 34], [176, COVER[1] + 44]]), { fill: C.blue, width: 1.1 });
  sketch(cover, rrect(0, 0, COVER[0], COVER[1], 5), { width: 2 });
  sketch(cover, rrect(0, 0, 32, COVER[1], 4), { fill: C.blueSoft, hatch: C.blue, gap: 5, angle: 70, weight: 1 });
  stroke(cover, `M54 96L${COVER[0] - 22} 96`, C.ink, 1.4, true);
  stroke(cover, `M54 ${COVER[1] - 24}L${COVER[0] - 22} ${COVER[1] - 24}`, C.line, 1.2, true);
  // The title is fitted to the cover, whatever the words are.
  ending.book.forEach((line, k) => {
    const base = k ? 25 : 33, font = size => `${k ? 'italic' : '600'} ${size}px ${SERIF}`;
    measure.font = font(base);
    const size = Math.floor(base * Math.min(1, (COVER[0] - 54 - 26) / measure.measureText(line).width));
    label(cover, line, 54, k ? 176 : 142, `font:${font(size)};fill:${C.ink}`);
  });
  label(cover, ending.label, 54, 78, `font:500 12.5px ${SANS};fill:${C.soft}`);
  // The cover carries the seal only once the plan has been sealed: while the four steps play the book has no sign on it,
  // and green is kept for the ending.
  const coverSeal = seal(group(cover, { transform: `translate(${COVER[0] - 58} ${COVER[1] - 78}) rotate(-12)` }), 30);
  // The consultation is a conversation: the advisor asks from the screen, each of them answers about their own work,
  // and what they say goes onto the shared slide as a task of their own.
  const chips = team.map(() => {
    const g = group(top, { visibility: 'hidden' });
    sketch(g, rrect(-17, -22, 34, 44, 2), { width: 1.4, still: true });
    stroke(g, 'M-10 -11L6 -11M-10 -3L10 -3M-10 5L3 5', C.soft, 1, true);
    sketch(g, circle(-9, 14, 3), { fill: C.blue, stroke: null, still: true });
    return g;
  });
  const lines = [speech(top, talk.ask, true), ...talk.answers.map((text, i) => speech(top, text, i > 1))];
  const bubble = speech(top, say);
  const teamBubbles = teamSays.map((text, i) => speech(top, text, i % 2 === 0));

  // --- The market's papers: a stream of small sheets, and four that can be read.
  // The small sheets belong to the trouble only (founder, 2026-11-28): they stream past and are gone when the shouting stops.
  // Nothing of the market hangs over him afterwards. Until then they gathered into a red cloud that the work quieted part by part.
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
    cs: 1.45, cx: 138, cy: -208,
    mx: 400, my: 520, mr: -90, faceX: 0, faceY: 0, eye: .1, walk: 0, reach: 0, startle: 0,
    zs: 1, bl: 1, puzzled: 0, panic: 0, decide: 0, hint: 0, thump: 0, storm: 0, door: 1,
    bedX: 0, fridgeX: 0, stream: 0, say: 0,
    call: 0, vig: 0, talk: 0, pills: 1, q0: 0, q1: 0, q2: 0, t0: 0, t1: 0, t2: 0,
    proj: 0, slideS: 0, bind: 0, bk: 0, big: 0, hold: 0,
    comp: 0, c0: 0, c1: 0, c2: 0, seal: 0, smile: 0, day: 0, cheer: 0, b0: 0, b1: 0,
  };
  const P = homes.map(([, y, r], i) => ({ x: -1000 - i * 130, y: y - 50, r: r - 22, q: 0 }));
  const H = shoutPlan.map(() => ({ s: 0, k: 0, d: 0 }));
  // His team: where each one stands, how far through their walk they are, how far their task is on its way to the slide.
  const M = [{ x: -700, walk: 0, aha: 0 }, { x: -820, walk: 0, aha: 0 }, { x: -940, walk: 0, aha: 0 }];
  const L = lines.map(() => ({ on: 0 }));
  // The advisor in the room, and on the phone.
  const V = { x: 1700, walk: 0, present: 0, give: 0, wave: 0, bye: 0 };
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
  // Act III (founder, 2026-11-28). The shouting stops, the papers are gone and the bedroom leaves: nothing is left on the screen
  // but him. In that quiet he thinks about what he wants to do with it, and only then says so. Then he gets in touch.
  at(2.74, .16, { panic: 0 });
  at(2.76, .44, { cs: 1, cx: -140, cy: 80 });
  at(2.8, .14, { stream: 0 });
  at(2.82, .18, { storm: 0 });
  at(2.86, .14, { door: 1 });
  at(2.9, .2, { bedX: -900, fridgeX: 900, ease: 'power2.in' });
  at(2.96, .14, { mx: 400, walk: 2 });
  at(3.1, .04, { decide: 1 });
  at(3.11, .03, { say: 1, ease: pop });
  at(3.22, .03, { say: 0 });
  at(3.23, .04, { decide: 0 });
  // He picks up the phone. The advisor answers, and asks his three questions; each answer gets its tick.
  at(3.27, .05, { call: 1, faceX: 6 });
  at(3.33, .05, { vig: 1, ease: pop });
  at(3.4, .21, { talk: 3, ease: 'none' });
  [0, 1, 2].forEach(i => {
    at(3.4 + i * .07, .02, { [`q${i}`]: 1, ease: pop });
    at(3.445 + i * .07, .016, { [`t${i}`]: 1, ease: 'none' });
  });
  // The screen of the turn leaves; the camera settles for the meeting.
  at(3.8, .2, { cs: .9, cx: -85, cy: 124 });
  at(3.9, .06, { pills: 0 });
  // The call was short. A wave, and it ends.
  at(4.0, .03, { bye: 1 }, V);
  at(4.055, .03, { vig: 0, ease: 'power2.in' });
  at(4.08, .03, { call: 0, faceX: 0 });
  // One scene, the meeting in the company (the screen is 420vh, so 0.01 here is about 4vh of scroll): the team comes in, the
  // advisor sets up at a projector. It is a conversation: he asks, each of them answers about how they work, and every answer
  // is written on the slide as a task of their own. Each bubble stays for about a third of a screen.
  at(4.09, .08, { mx: 480, walk: 3 });
  at(4.1, .08, { x: 175, walk: 1, ease: 'sine.out' }, M[0]);
  at(4.106, .08, { x: 275, walk: 1, ease: 'sine.out' }, M[1]);
  at(4.112, .08, { x: 375, walk: 1, ease: 'sine.out' }, M[2]);
  at(4.1, .06, { proj: 1, ease: 'power2.out' });
  at(4.11, .08, { x: 620, walk: 1, ease: 'sine.out' }, V);
  at(4.19, .03, { slideS: 1, ease: pop });
  at(4.205, .025, { present: 1 }, V);
  const speak = (i, from, to) => { at(from, .018, { on: 1, ease: pop }, L[i]); at(to, .012, { on: 0 }, L[i]); };
  speak(0, 4.225, 4.3);
  [0, 1, 2].forEach(i => {
    const t0 = 4.315 + i * .09;
    speak(i + 1, t0, t0 + .08);
    at(t0 + .036, .034, { aha: 1, ease: 'sine.in' }, M[i]);
  });
  at(4.585, .02, { present: 0 }, V);
  // What they said becomes the book: the slide comes down from the screen into the advisor's hands and is the compendium he
  // hands over. The screen folds away behind it. Then the picture is held until the screen is released (at 4.76).
  at(4.595, .045, { bind: 1 });
  at(4.6, .03, { give: 1 }, V);
  at(4.63, .02, { slideS: 0, ease: 'power2.in' });
  at(4.63, .035, { bk: 1, ease: pop });
  at(4.635, .04, { proj: 0, ease: 'power2.in' });
  at(4.645, .03, { smile: 1, faceX: 6 });
  // The work is theirs now: a wave, and the advisor goes.
  at(4.79, .03, { hold: 1 });
  at(4.79, .03, { give: 0, wave: 1 }, V);
  at(4.83, .11, { x: 1900, walk: 2, ease: 'power1.in' }, V);
  at(4.87, .04, { faceX: 0 });
  // Act IV. The compendium opens on its recommendation: where to start, what to check, what to leave. It gets its seal.
  at(5.0, .05, { big: 1 });
  at(5.05, .05, { comp: 1 });
  [0, 1, 2].forEach(i => at(5.13 + i * .035, .02, { [`c${i}`]: 1, ease: 'none' }));
  at(5.235, .03, { seal: 1, ease: 'back.out(2.6)' });
  // The sealed plan is held (over half a screen of scroll: it is the frame with the most to read). Then it closes into a book
  // again and comes back to his hand. He stands in the middle, his team gathers round and they celebrate. The camera closes
  // in on him.
  at(5.4, .03, { comp: 0 });
  at(5.42, .09, { mx: 735, walk: 4 });
  at(5.43, .09, { x: 520 }, M[0]);
  at(5.43, .09, { x: 628 }, M[1]);
  at(5.43, .09, { x: 904 }, M[2]);
  at(5.46, .06, { big: 0 });
  at(5.45, .08, { day: 1 });
  at(5.535, .05, { cheer: 1, ease: pop });
  at(5.52, .1, { cs: .95, cx: -198, cy: 112 });
  at(5.57, .035, { b0: 1, ease: pop });
  at(5.6, .035, { b1: 1, ease: pop });

  root.appendChild(svg);
  const lastSection = sections[sections.length - 1];
  const cam = { s: 1, x: 0, y: 0 };
  const set = (node, value) => node.setAttribute('transform', value);
  const show = (node, on) => node.setAttribute('visibility', on ? 'visible' : 'hidden');
  /* A sheet about its own centre: upright (lie 0) or lying flat (lie 1). */
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
    const view = `translate(${n(cam.x)} ${n(cam.y)}) scale(${n(cam.s)})`;
    set(world, view);
    set(top, view);

    // The bedroom. Asleep, the blanket breathes.
    const roomOn = S.bedX > -890;
    show(bed, roomOn); show(bedTop, roomOn); show(fridge, roomOn);
    set(bed, `translate(${n(S.bedX)} 0)`);
    set(bedTop, `translate(${n(S.bedX)} 572) scale(1 ${n(S.bl * (1 + S.zs * Math.sin(time * 1.9) * .025))}) translate(0 -572)`);
    const tremble = Math.sin(time * 34) * (S.hint * 1.1 + S.storm * .5);
    set(fridge, `translate(${n(S.fridgeX)} ${n(-S.thump * 16)})`);
    set(fridgeBody, `rotate(${n(tremble + S.thump * 3)} 830 640)`);
    set(door, `translate(900 0) skewY(${n((1 - S.door) * -5)}) scale(${n(S.door)} 1) translate(-900 0)`);
    gapLight.setAttribute('opacity', n(S.hint * (.55 + .45 * Math.sin(time * 9))));
    rays.setAttribute('opacity', n(Math.max(seg(S.hint, .4, 1) * (.5 + .5 * Math.sin(time * 11)), S.thump, S.storm)));
    show(day, S.day > .01);
    day.setAttribute('opacity', n(S.day));

    // The man.
    const stride = Math.sin(S.walk * Math.PI * 8), panic = S.panic, awake = seg(S.mr, -60, 0), walking = S.walk % 1 !== 0;
    const mx = S.mx + panic * Math.sin(time * 21) * 2.5, my = S.my - Math.abs(stride) * 5 * (walking ? 1 : 0);
    set(man, `translate(${n(mx)} ${n(my)}) rotate(${n(S.mr + panic * Math.sin(time * 9) * 2.5)}) scale(1 ${n(1 - panic * .05)})`);
    const want = S.mr > -45 ? manFront : manSlot;
    if (want !== slot) { slot = want; slot.appendChild(man); }
    set(manShade, `translate(${n(mx)} 0)`);
    manShade.setAttribute('opacity', n(.3 * awake * (1 - Math.abs(S.my - 640) / 180)));
    hero.legs.forEach((leg, i) => set(leg, `rotate(${n((i ? 1 : -1) * stride * 24)})`));
    const look = S.puzzled * Math.sin(time * 1.5) * 8 + panic * Math.sin(time * 2.6) * 9;
    set(hero.face, `translate(${n(S.faceX + look)} ${n(S.faceY + panic * -2)})`);
    set(hero.head, `rotate(${n(S.puzzled * Math.sin(time * 1.5 + .6) * 5)})`);
    const wide = Math.max(panic, S.startle);
    hero.eyes.forEach(eye => { eye.setAttribute('ry', n(3.3 * S.eye * (1 + wide * .5))); eye.setAttribute('rx', n(3.3 * (1 + wide * .35))); });
    hero.mouth.setAttribute('opacity', n((1 - panic) * (1 - S.smile)));
    hero.grin.setAttribute('opacity', n(S.smile));
    hero.gasp.setAttribute('opacity', n(panic));
    show(phone, S.call > .5);
    hero.arms.forEach((arm, i) => {
      const side = i ? -1 : 1; // positive turns clockwise: the left arm swings out to the left
      const swing = walking ? -stride * 14 * (i ? (1 - S.reach) * (1 - S.hold) : 1) : 0;
      const acting = i
        ? -S.reach * 76 - S.decide * 168 * (1 - S.call) - S.startle * 30 - S.call * 152 - S.hold * 150 - S.cheer * (1 - S.hold) * 128
        : S.decide * 10 + S.startle * 30 + S.cheer * (128 + Math.sin(time * 6 + 2) * 10);
      set(arm, `rotate(${n(side * (7 + S.puzzled * 24 + panic * (150 + Math.sin(time * 13 + i) * 9)) + acting + swing)}) scale(1 ${n(i ? lerp(1, .58, S.call) : 1)})`);
    });
    zs.forEach((z, i) => {
      const u = (time * .3 + i / 3) % 1;
      set(z, `translate(${n(196 + u * 46)} ${n(478 - u * 96)}) scale(${n(.45 + u * .7)})`);
      z.setAttribute('opacity', n(S.zs * Math.sin(u * Math.PI)));
    });

    // His team: they walk in, listen, speak, and stay.
    team.forEach((member, i) => {
      const m = M[i], on = m.x > -650 && m.x < 1650;
      show(member.g, on);
      if (!on) return;
      const step = Math.sin(m.walk * Math.PI * 6), going = m.walk > 0 && m.walk < 1;
      const bob = going ? Math.abs(step) * 5 : Math.sin(time * 1.6 + i * 2) * 1.2 + S.cheer * Math.abs(Math.sin(time * 4 + i)) * 4;
      set(member.g, `translate(${n(m.x)} ${n(640 - bob)}) scale(${[.95, .97, .92][i]})`);
      member.legs.forEach((leg, k) => set(leg, `rotate(${n(going ? (k ? 1 : -1) * step * 22 : 0)})`));
      member.arms.forEach((arm, k) => set(arm, `rotate(${n((k ? -1 : 1) * (7 + S.cheer * (146 + Math.sin(time * 6 + i * 2 + k) * 12)) + (going ? -step * 12 : 0))})`));
      set(member.face, `translate(${m.x < (S.proj > .5 ? 850 : S.mx) ? 5 : -5} ${S.proj > .5 ? -2 : 0})`);
    });
    // The advisor in the room: he walks in, presents, hands the book over, waves and goes.
    {
      const here = V.x < 1650, step = Math.sin(V.walk * Math.PI * 6), going = V.walk % 1 !== 0;
      show(advisor.g, here);
      set(advisor.g, `translate(${n(V.x)} ${n(640 - (going ? Math.abs(step) * 5 : Math.sin(time * 1.4)))})`);
      advisor.legs.forEach((leg, k) => set(leg, `rotate(${n(going ? (k ? 1 : -1) * step * 22 : 0)})`));
      set(advisor.arms[0], `rotate(${n(7 + V.give * 62 + (going ? -step * 12 : 0))})`);
      set(advisor.arms[1], `rotate(${n(-7 - V.present * (104 + Math.sin(time * 2.4) * 8) - V.wave * (150 + Math.sin(time * 9) * 14) + (going && !V.wave ? -step * 12 : 0))})`);
      set(advisor.face, `translate(${V.present ? 4 : V.wave ? 3 : -5} ${V.present ? -2 : 0})`);
    }
    // The projector screen rises from its tripod for the meeting and folds away after it.
    show(projector, S.proj > .001);
    set(projector, `translate(0 ${n((1 - S.proj) * 60)})`);
    projector.setAttribute('opacity', n(clamp01(S.proj * 1.4)));
    // The phone call: the advisor in his cut-out, the three questions stacking up between them, a tick for each answer.
    const ring = Math.max(0, S.vig);
    show(vig, ring > .001);
    set(vig, `translate(${VIG[0]} ${VIG[1]}) scale(${n(Math.max(.0001, ring))}) translate(${-VIG[0]} ${-VIG[1]})`);
    set(caller.arms[1], `rotate(${n(-7 - V.bye * (150 + Math.sin(time * 9) * 14))})`);
    set(caller.face, 'translate(-5 1)');
    const turn = S.talk % 1, speaking = S.talk > 0 && S.talk < 3;
    talkMarks.forEach((marks, i) => {
      set(marks, i ? `translate(${VIG[0] - 62} ${VIG[1] - 96})` : `translate(${n(S.mx - 52)} 404)`);
      marks.setAttribute('opacity', n(speaking ? (i ? pulse(turn, 0, .4) : pulse(turn, .4, .9)) : 0));
    });
    pills.forEach(({ g, tick: mark }, i) => {
      const on = Math.max(0, S[`q${i}`]) * S.pills;
      show(g, on > .001);
      set(g, `translate(${n(S.mx + 30)} ${150 + i * 62}) scale(${n(Math.max(.0001, on) * .9)})`);
      mark.setAttribute('stroke-dashoffset', n(1 - S[`t${i}`]));
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
    // Who says what, where: each above their own head, one at a time.
    [[V.x - 6, 384], [M[0].x + 8, 388], [M[1].x + 8, 386], [M[2].x - 6, 390]].forEach(([x, y], i) => {
      const on = Math.max(0, L[i].on);
      show(lines[i], on > .001);
      set(lines[i], `translate(${n(x)} ${y}) scale(${n(Math.max(.0001, on) * .62)})`);
    });
    chips.forEach((chip, i) => {
      const u = M[i].aha, to = [SLIDE_AT[0] + (60 - SLIDE[0] / 2) * SLIDE_AT[2], SLIDE_AT[1] + (rowY(i) - SLIDE[1] / 2) * SLIDE_AT[2]];
      show(chip, u > .001 && u < .999);
      set(chip, `translate(${n(lerp(M[i].x, to[0], u))} ${n(lerp(360, to[1], u) - Math.sin(u * Math.PI) * 60)}) rotate(${n((1 - u) * (i - 1) * 14)}) scale(${n(lerp(.9, .3, u))})`);
      slideRows[i].setAttribute('opacity', n(seg(u, .85, 1)));
    });
    show(bubble, S.say > .001);
    set(bubble, `translate(${n(S.mx + 6)} 372) scale(${n(Math.max(0, S.say))})`);
    [[512, 386], [912, 390]].forEach(([x, y], i) => {
      const b = S[`b${i}`];
      show(teamBubbles[i], b > .001);
      set(teamBubbles[i], `translate(${x} ${y}) scale(${n(Math.max(0, b) * .66)})`);
    });

    // The slide is thrown onto the projector screen; when the meeting is over it comes down to where the book is handed over.
    const fold = seg(S.bind, 0, 1);
    show(slide, S.slideS > .001);
    place(slide, SLIDE, lerp(SLIDE_AT[0], HANDOVER[0], fold), lerp(SLIDE_AT[1], HANDOVER[1], fold) - Math.sin(fold * Math.PI) * 40, 0, Math.max(0, S.slideS) * lerp(SLIDE_AT[2], .3, fold), fold * -5);
    // The compendium. A book: handed over between them, then held up in his hand; in between it opens, big, on its last page.
    const hand = [S.mx + 92, 322], bookAt = [lerp(lerp(HANDOVER[0], hand[0], S.hold), 820, S.big), lerp(lerp(HANDOVER[1], hand[1], S.hold), 330, S.big)];
    show(cover, S.bk > .001 && S.comp < .5);
    coverSeal.setAttribute('opacity', S.seal > .5 ? 1 : 0);
    set(cover, `translate(${n(bookAt[0])} ${n(bookAt[1])}) rotate(${n(lerp(4, -3, S.big))}) scale(${n(Math.max(.0001, S.bk) * lerp(lerp(.4, .34, S.hold), 1, S.big))}) translate(${-COVER[0] / 2} ${-COVER[1] / 2})`);
    show(comp, S.comp > .001);
    place(comp, COMP, 820, 330, 0, lerp(.7, COMPK, S.comp), -1.2);
    compRows.forEach(({ tick: mark }, i) => mark.setAttribute('stroke-dashoffset', n(1 - S[`c${i}`])));
    set(compSeal, `translate(${COMP[0] - 58} ${COMP[1] - 46}) rotate(-12) scale(${n(Math.max(.0001, S.seal))})`);

    // Small sheets: a stream from left to right while the trouble lasts, tumbling as they go. When it ends they are gone.
    for (let i = 0; i < N; i++) {
      const p = rand(i), q = rand(i + 50), s = rand(i + 99);
      const u = (T * .55 + time * .035 * (.6 + q) + p) % 1;
      const fx = -760 + u * 1900, fy = 50 + q * 600 + Math.sin(u * 9 + i) * 42;
      const flip = Math.cos(u * 15 + i * 2);
      const scale = S.stream * (.95 + s * .6);
      show(sheets[i], scale > .01);
      set(sheets[i], `translate(${n(fx)} ${n(fy)}) rotate(${n(u * 420 + i * 40)}) scale(${n(scale * Math.sign(flip) * Math.max(.18, Math.abs(flip)))} ${n(scale)})`);
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
