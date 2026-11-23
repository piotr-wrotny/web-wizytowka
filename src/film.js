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
//   III  the solution: every step of working together puts out a part of the chaos
//        2.75 zwrot  "Muszę to uporządkować." The bedroom leaves; the market's papers hang over him, red and restless.
//                    He picks up the phone. The advisor answers and asks his three questions; each answer is ticked
//        4 kroki     the four steps, one after another, each lighting its line on the page: the call ends and the first
//                    third of the papers falls quiet into a neat stack; the Karta rozpoznania reaches him and the second
//                    third follows; the team comes in, the advisor presents at a projector, everyone speaks and each
//                    answer becomes a task of their own on the slide, and the last papers settle; the stacks are bound
//                    into the compendium, which the advisor hands over before he goes
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
  function figure(parent, { tie = false, hair = 'short', cloth = { hatch: C.ink, gap: 3.2, weight: 1.25 }, smile = false, glasses = false, beard = false } = {}) {
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
    const grin = el('path', { d: beard ? 'M-6 17Q0 23 6 17' : 'M-8 15Q0 25 8 15', ...line, opacity: smile ? 1 : 0 }, face);
    if (beard) {
      // A small moustache and a small beard: a few short pencil strokes, nothing bushy.
      el('path', { d: 'M-8 13Q-4 9.5 0 12Q4 9.5 8 13', fill: 'none', stroke: C.ink, 'stroke-width': 2.6, 'stroke-linecap': 'round' }, face);
      sketch(face, 'M-11 22Q-9 34 0 36Q9 34 11 22Q0 27 -11 22Z', { hatch: C.ink, gap: 1.6, angle: 80, weight: 1.3, width: 1.2 });
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

export async function startFilm({ root, sections, papers, paperLabel, say, card: cardContent, karta: kartaContent, slide: slideContent, ending, team: teamSays, talk }) {
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
  const advisor = figure(world, { beard: true, smile: true, cloth: blue });
  // A phone, in a hand.
  const handset = arm => {
    const g = group(arm, { visibility: 'hidden', transform: 'translate(0 90) rotate(180)' });
    sketch(g, rrect(-9, -4, 18, 32, 4), { hatch: C.ink, gap: 2, width: 1.3 });
    sketch(g, rrect(-6, 0, 12, 21, 2), { fill: C.blueSoft, stroke: null, still: true });
    return g;
  };
  const phone = handset(hero.arms[1]);
  // The other end of the call: the advisor in a round cut-out, phone at his ear.
  const VIG = [884, 462, 140];
  const vig = group(top, { visibility: 'hidden' });
  sketch(vig, circle(...VIG), { hatch: C.line, gap: 10, angle: -30, weight: .7, width: 1 });
  el('circle', { cx: VIG[0], cy: VIG[1], r: VIG[2] }, el('clipPath', { id: 'film-vig' }, defs));
  const caller = figure(group(group(vig, { 'clip-path': 'url(#film-vig)' }), { transform: `translate(${VIG[0]} ${VIG[1] + 156}) scale(1.08)` }), { beard: true, smile: true, cloth: blue });
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
  const KARTA = [300, 206];
  const karta = sheet(top, ...KARTA, kartaContent.title);
  kartaContent.rows.forEach(([name], i) => {
    const y = 78 + i * 46;
    label(karta, name, 22, y, `font:700 15px ${SANS};fill:${C.ink}`, { 'dominant-baseline': 'central' });
    stroke(karta, `M118 ${y + 2}L${250 - i * 24} ${y}`, C.soft, 1.3, true);
    if (i < kartaContent.rows.length - 1) stroke(karta, `M22 ${y + 23}L${KARTA[0] - 22} ${y + 23}`, C.line, 1, true);
  });
  const SLIDE = [300, 206], SLIDE_AT = [850, 275, 1.15];
  const slide = sheet(top, ...SLIDE, slideContent.title);
  wrap(slideContent.heading, `600 22px ${SERIF}`, SLIDE[0] - 44).forEach((line, k) => label(slide, line, 22, 86 + k * 27, `font:600 22px ${SERIF};fill:${C.ink}`));
  // The rows of the slide are the team's own tasks: each arrives when its owner has spoken.
  const slideRows = slideContent.items.map((_, i) => {
    const row = group(slide, { opacity: 0 });
    sketch(row, circle(28, 152 + i * 16, 2.5), { fill: C.blue, stroke: null, still: true });
    stroke(row, `M40 ${152 + i * 16}L${200 - i * 30} ${151 + i * 16}`, C.soft, 1.2, true);
    return row;
  });
  // The compendium, open on its last page: the recommendation of the synthetic sample.
  const COMP = [470, 0], COMPK = 1.16;
  const comp = group(top);
  const compRows = [];
  {
    let y = 100;
    const rows = ending.rows.map(row => { const lines = wrap(row.text, `17px ${SERIF}`, COMP[0] - 96); const from = y; y += 30 + lines.length * 22 + 20; return { row, lines, from }; });
    COMP[1] = y + 30;
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
  seal(group(cover, { transform: `translate(${COVER[0] - 58} ${COVER[1] - 78}) rotate(-12)` }), 30);
  // The consultation is a conversation: the advisor asks from the screen, each of them answers about their own work,
  // and what they say goes onto the shared slide as a task of their own.
  const chips = team.map(() => {
    const g = group(top, { visibility: 'hidden' });
    sketch(g, rrect(-17, -22, 34, 44, 2), { width: 1.4, still: true });
    stroke(g, 'M-10 -11L6 -11M-10 -3L10 -3M-10 5L3 5', C.soft, 1, true);
    sketch(g, circle(-9, 14, 3), { fill: C.blue, stroke: null, still: true });
    return g;
  });
  const lines = [speech(top, talk.ask, true), ...talk.answers.map((text, i) => speech(top, text, i > 1)), speech(top, talk.close, true)];
  const bubble = speech(top, say);
  const teamBubbles = teamSays.map((text, i) => speech(top, text, i % 2 === 0));

  // --- The market's papers: a stream of small sheets, and four that can be read.
  const N = 24;
  const sheets = Array.from({ length: N }, (_, i) => {
    const g = group(swarmLayer);
    sketch(g, rrect(-17, -22, 34, 44, 2), { width: 1.4, still: true });
    stroke(g, `M-10 -11L${4 + rand(i) * 6} -11M-10 -3L10 -3M-10 5L${rand(i + 9) * 9} 5`, C.soft, 1, true);
    const tint = sketch(g, rrect(-17, -22, 34, 44, 2), { fill: C.red, stroke: C.red, width: 1.6, still: true });
    tint.setAttribute('opacity', '0');
    return { g, tint };
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
    bedX: 0, fridgeX: 0, stream: 0, gather: 0, chaos: 0, say: 0,
    call: 0, vig: 0, talk: 0, pills: 1, q0: 0, q1: 0, q2: 0, t0: 0, t1: 0, t2: 0, quiet0: 0, quiet1: 0, stackX: 1000,
    kartaS: 0, tuck: 0, proj: 0, slideS: 0, bind: 0, bk: 0, big: 0, hold: 0,
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
  // Act III. Enough: the bedroom leaves. The market's papers do not: they hang over him, red and restless.
  at(2.74, .16, { panic: 0, decide: 1 });
  at(2.76, .44, { cs: 1, cx: -140, cy: 80 });
  at(2.8, .12, { say: 1, ease: pop });
  at(2.82, .18, { storm: 0 });
  at(2.86, .14, { door: 1 });
  at(2.9, .3, { bedX: -900, fridgeX: 900, ease: 'power2.in' });
  at(2.97, .3, { gather: 1, ease: 'none' });
  at(3.0, .2, { mx: 400, walk: 2 });
  at(3.12, .14, { chaos: 1 });
  at(3.18, .08, { say: 0 });
  at(3.2, .08, { decide: 0 });
  // He picks up the phone. The advisor answers, and asks his three questions; each answer gets its tick.
  at(3.27, .05, { call: 1, faceX: 6 });
  at(3.33, .05, { vig: 1, ease: pop });
  at(3.4, .21, { talk: 3, ease: 'none' });
  [0, 1, 2].forEach(i => {
    at(3.4 + i * .07, .02, { [`q${i}`]: 1, ease: pop });
    at(3.445 + i * .07, .016, { [`t${i}`]: 1, ease: 'none' });
  });
  // The screen of the turn leaves; the camera settles for the four steps.
  at(3.8, .2, { cs: .9, cx: -85, cy: 124 });
  at(3.9, .06, { pills: 0 });
  // Step 1, the conversation: it was short. A wave, the call ends, and the first third of the papers falls quiet.
  at(4.01, .025, { bye: 1 }, V);
  at(4.03, .08, { quiet0: 1, ease: 'none' });
  at(4.075, .035, { vig: 0, ease: 'power2.in' });
  at(4.1, .03, { call: 0, faceX: 0 });
  // Step 2, recognition: the Karta rozpoznania reaches him, with the programme of the meeting on it. The second third.
  at(4.17, .04, { kartaS: 1, ease: pop });
  at(4.18, .03, { faceX: 7, faceY: -4 });
  at(4.2, .07, { quiet1: 1, ease: 'none' });
  at(4.255, .04, { tuck: 1, faceY: 0 });
  // Step 3, the consultation in the company: the team comes in, the advisor sets up at a projector. It is a conversation:
  // he asks, each of them answers about how they work, and every answer goes up on the slide as a task of their own.
  // With each task the last of the papers settle.
  at(4.285, .07, { mx: 480, walk: 3 });
  at(4.29, .05, { stackX: 1100 });
  at(4.3, .07, { x: 175, walk: 1, ease: 'sine.out' }, M[0]);
  at(4.305, .07, { x: 275, walk: 1, ease: 'sine.out' }, M[1]);
  at(4.31, .07, { x: 375, walk: 1, ease: 'sine.out' }, M[2]);
  at(4.3, .05, { proj: 1, ease: 'power2.out' });
  at(4.31, .07, { x: 592, walk: 1, ease: 'sine.out' }, V);
  at(4.37, .03, { slideS: 1, ease: pop });
  at(4.385, .025, { present: 1 }, V);
  const speak = (i, from, to) => { at(from, .018, { on: 1, ease: pop }, L[i]); at(to, .012, { on: 0 }, L[i]); };
  speak(0, 4.395, 4.44);
  [0, 1, 2].forEach(i => {
    const t0 = 4.455 + i * .058;
    speak(i + 1, t0, t0 + .053);
    at(t0 + .028, .024, { aha: 1, ease: 'sine.in' }, M[i]);
  });
  speak(4, 4.632, 4.682);
  at(4.69, .02, { present: 0 }, V);
  at(4.695, .025, { slideS: 0, ease: 'power2.in' });
  at(4.71, .03, { proj: 0, ease: 'power2.in' });
  // Step 4, the compendium: the stacks are bound into one book, and the advisor hands it over.
  at(4.72, .04, { bind: 1 });
  at(4.72, .03, { give: 1 }, V);
  at(4.75, .035, { bk: 1, ease: pop });
  at(4.76, .03, { smile: 1, faceX: 6 });
  // The work is theirs now: a wave, and the advisor goes.
  at(4.83, .03, { hold: 1 });
  at(4.83, .03, { give: 0, wave: 1 }, V);
  at(4.87, .1, { x: 1900, walk: 2, ease: 'power1.in' }, V);
  at(4.9, .04, { faceX: 0 });
  // Act IV. The compendium opens on its recommendation: where to start, what to check, what to leave. It gets its seal.
  at(5.0, .05, { big: 1 });
  at(5.05, .05, { comp: 1 });
  [0, 1, 2].forEach(i => at(5.14 + i * .04, .02, { [`c${i}`]: 1, ease: 'none' }));
  at(5.25, .03, { seal: 1, ease: 'back.out(2.6)' });
  // It closes into a book again and comes back to his hand. He stands in the middle, his team gathers round and they
  // celebrate. The camera closes in on him.
  at(5.37, .03, { comp: 0 });
  at(5.39, .09, { mx: 735, walk: 4 });
  at(5.4, .09, { x: 520 }, M[0]);
  at(5.4, .09, { x: 628 }, M[1]);
  at(5.4, .09, { x: 904 }, M[2]);
  at(5.43, .06, { big: 0 });
  at(5.42, .08, { day: 1 });
  at(5.505, .05, { cheer: 1, ease: pop });
  at(5.49, .1, { cs: .95, cx: -198, cy: 112 });
  at(5.54, .035, { b0: 1, ease: pop });
  at(5.57, .035, { b1: 1, ease: pop });

  root.appendChild(svg);
  const lastSection = sections[sections.length - 1];
  const cam = { s: 1, x: 0, y: 0 };
  const toStage = (x, y) => [x * cam.s + cam.x, y * cam.s + cam.y];
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
        : S.decide * 10 + S.startle * 30 + S.cheer * (128 + Math.sin(time * 6 + 2) * 10) + S.kartaS * (1 - S.tuck) * 20;
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
    [[V.x - 6, 384], [M[0].x + 8, 388], [M[1].x + 8, 386], [M[2].x - 6, 390], [V.x - 6, 384]].forEach(([x, y], i) => {
      const on = Math.max(0, L[i].on);
      show(lines[i], on > .001);
      set(lines[i], `translate(${n(x)} ${y}) scale(${n(Math.max(.0001, on) * .62)})`);
    });
    chips.forEach((chip, i) => {
      const u = M[i].aha, to = [SLIDE_AT[0] + (60 - SLIDE[0] / 2) * SLIDE_AT[2], SLIDE_AT[1] + (152 + i * 16 - SLIDE[1] / 2) * SLIDE_AT[2]];
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

    // The Karta rozpoznania comes to him and he tucks it away; the slide is thrown onto the projector screen.
    show(karta, S.kartaS > .001 && S.tuck < 1);
    place(karta, KARTA, lerp(lerp(1300, 690, clamp01(S.kartaS)), S.mx - 44, S.tuck), lerp(290, 520, S.tuck), 0, S.kartaS * lerp(1.25, .12, S.tuck), -2 * (1 - S.tuck));
    show(slide, S.slideS > .001);
    place(slide, SLIDE, SLIDE_AT[0], SLIDE_AT[1], 0, Math.max(0, S.slideS) * SLIDE_AT[2]);
    // The compendium. A book: handed over between them, then held up in his hand; in between it opens, big, on its last page.
    const hand = [S.mx + 92, 322], bookAt = [lerp(lerp(538, hand[0], S.hold), 820, S.big), lerp(lerp(528, hand[1], S.hold), 330, S.big)];
    show(cover, S.bk > .001 && S.comp < .5);
    set(cover, `translate(${n(bookAt[0])} ${n(bookAt[1])}) rotate(${n(lerp(4, -3, S.big))}) scale(${n(Math.max(.0001, S.bk) * lerp(lerp(.4, .34, S.hold), 1, S.big))}) translate(${-COVER[0] / 2} ${-COVER[1] / 2})`);
    show(comp, S.comp > .001);
    place(comp, COMP, 820, 330, 0, lerp(.7, COMPK, S.comp), -1.2);
    compRows.forEach(({ tick: mark }, i) => mark.setAttribute('stroke-dashoffset', n(1 - S[`c${i}`])));
    set(compSeal, `translate(${COMP[0] - 58} ${COMP[1] - 52}) rotate(-12) scale(${n(Math.max(.0001, S.seal))})`);

    // Small sheets: a stream from left to right; then a red, restless cloud over him; then, third by third, quiet: each
    // falls into one of three neat stacks on the floor. In the end the stacks become the book.
    const quiet = [S.quiet0, S.quiet1, (M[0].aha + M[1].aha + M[2].aha) / 3];
    for (let i = 0; i < N; i++) {
      const p = rand(i), q = rand(i + 50), s = rand(i + 99);
      const u = (T * .55 + time * .035 * (.6 + q) + p) % 1;
      const fx = -760 + u * 1900, fy = 50 + q * 600 + Math.sin(u * 9 + i) * 42;
      const g = seg(S.gather, q * .5, .5 + q * .5), pile = i % 3, rank = Math.floor(i / 3), calm = seg(quiet[pile], rank / 8 * .6, .4 + rank / 8 * .6), bound = seg(S.bind, 0, .8);
      const merged = bound, flat = g * calm;
      const cloud = [S.mx + (p - .5) * 560 + Math.sin(time * .7 + i) * 16, 4 + q * 100 + Math.cos(time * .9 + i * 2) * 9];
      const wx = lerp(lerp(cloud[0], S.stackX + pile * 42 + (s - .5) * 5, calm), 538, bound);
      const wy = lerp(lerp(cloud[1], 634 - rank * 2.2, calm), 528, bound);
      const [tx, ty] = toStage(wx, wy);
      const flip = Math.cos(u * 15 + i * 2);
      const scale = lerp(S.stream * (.95 + s * .6), cam.s * .95, g) * (1 - merged);
      const simmer = S.chaos * g * (1 - calm), jump = Math.max(0, Math.sin(time * (6 + p * 5) + i * 1.7)) * 11 * simmer * cam.s;
      sheets[i].tint.setAttribute('opacity', n(simmer * (.5 + .3 * Math.sin(time * 4 + i))));
      show(sheets[i].g, scale > .01);
      set(sheets[i].g, `translate(${n(lerp(fx, tx, g))} ${n(lerp(fy, ty, g) - Math.sin(g * Math.PI) * 60 - jump)}) matrix(1 0 ${n(-.6 * flat)} ${n(lerp(1, .42, flat))} 0 0) rotate(${n(lerp(u * 420 + i * 40, (s - .5) * 50 * (1 - calm), g) + Math.sin(time * (9 + q * 4) + i) * 12 * simmer)}) scale(${n(scale * lerp(Math.sign(flip) * Math.max(.18, Math.abs(flip)), 1, g))} ${n(scale)})`);
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
