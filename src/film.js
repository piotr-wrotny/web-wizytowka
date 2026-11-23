// The story as a small 3D film behind the home page's text, scrubbed by the scroll. Loaded on demand (wide screens, motion on,
// WebGL available); without it the page shows its flat sheets. Everything is built from geometry in code: a paper-model room
// and an anonymous little man in a suit. He stands for the visitor; he is nobody in particular.
//
// Timeline T: the index of the section whose top has passed the top of the screen, plus how far it has scrolled through.
//   0 hero      asleep, then woken up as the first papers arrive
//   1 rynek     the market's papers stream past, four of them stop in front of him with a question in red pencil
//   1.6 to 2    he walks over to the fridge, which trembles and leaks red light
//   2 stawka    he looks back, opens it, and "AI!" bursts out at him; then it shouts from everywhere
//   3 zwrot     "Muszę to uporządkować." The bedroom leaves, a desk arrives, the papers land on it, and the card of
//               the first conversation comes down in front of him: three questions, ticked one by one
//   3.5 to 4    while the steps screen arrives, the heap is sorted into four stacks
//   4 kroki     the film fades; from here on the page is paper again, ending with the real compendium sheet
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

const C = { paper: '#fcfdfb', line: '#c6ccc7', desk: '#dfe3df', ink: '#14161a', inkSoft: '#4d5359', blue: '#2340c8', blueSoft: '#cdd6ff', red: '#c02a16', skin: '#f1e6d8' };
const clamp01 = x => Math.min(1, Math.max(0, x));
const seg = (t, a, b) => { const x = clamp01((t - a) / (b - a)); return x * x * (3 - 2 * x); };
const lerp = (a, b, t) => a + (b - a) * t;
const pop = x => { const y = clamp01(x) - 1; return 1 + 2.70158 * y * y * y + 1.70158 * y * y; };
const rand = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

const mat = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.9, metalness: 0, ...extra });
function solid(geometry, material, x = 0, y = 0, z = 0) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}
const rbox = (w, h, d, r, material, x, y, z) => solid(new RoundedBoxGeometry(w, h, d, 4, r), material, x, y, z);

function texture(w, h, draw) {
  const canvas = document.createElement('canvas');
  canvas.width = w * 2; canvas.height = h * 2;
  const g = canvas.getContext('2d');
  g.scale(2, 2);
  draw(g, w, h);
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}
function wrap(g, text, x, y, maxWidth, lineHeight) {
  let line = '';
  for (const word of text.split(' ')) {
    const next = line ? `${line} ${word}` : word;
    if (line && g.measureText(next).width > maxWidth) { g.fillText(line, x, y); line = word; y += lineHeight; } else line = next;
  }
  g.fillText(line, x, y);
  return y;
}
function roundRect(g, x, y, w, h, r) { g.beginPath(); g.roundRect(x, y, w, h, r); g.fill(); }

/* A paper of the market, the same content as the flat sheets: kind, label, the loud claim and, once asked, the pencil's question. */
function paperTexture(paper, label, withQuery) {
  return texture(400, 300, (g, w, h) => {
    g.fillStyle = C.paper; g.fillRect(0, 0, w, h);
    g.strokeStyle = C.line; g.lineWidth = 2; g.strokeRect(1, 1, w - 2, h - 2);
    g.beginPath(); g.moveTo(0, 44); g.lineTo(w, 44); g.stroke();
    g.fillStyle = C.ink; g.font = '500 15px Archivo, sans-serif'; g.textBaseline = 'middle';
    g.fillText(paper.kind, 22, 23);
    g.fillStyle = C.inkSoft; g.textAlign = 'right'; g.fillText(label, w - 22, 23); g.textAlign = 'left';
    g.fillStyle = C.ink; g.font = '700 25px Archivo, sans-serif'; g.textBaseline = 'alphabetic';
    wrap(g, paper.claim, 22, 86, w - 44, 31);
    if (withQuery) {
      g.strokeStyle = '#d9ddd9'; g.lineWidth = 1; g.beginPath(); g.moveTo(22, h - 62); g.lineTo(w - 22, h - 62); g.stroke();
      g.fillStyle = C.red; g.font = 'italic 25px "Brygada 1918", serif';
      g.fillText(`?  ${paper.query}`, 22, h - 26);
    }
  });
}
/* The card of the first conversation, as an object of the film: the same three questions as on the flat sheet. */
function cardTexture(card, ticks) {
  return texture(640, 400, (g, w) => {
    g.fillStyle = C.paper; g.fillRect(0, 0, w, 400);
    g.strokeStyle = C.line; g.lineWidth = 2; g.strokeRect(1, 1, w - 2, 398);
    g.beginPath(); g.moveTo(0, 62); g.lineTo(w, 62); g.stroke();
    g.fillStyle = C.ink; g.font = '500 20px Archivo, sans-serif'; g.textBaseline = 'middle';
    g.fillText(card.title, 36, 32);
    g.fillStyle = C.inkSoft; g.textAlign = 'right'; g.fillText(card.label, w - 36, 32); g.textAlign = 'left';
    card.questions.forEach((question, i) => {
      const y = 124 + i * 96;
      if (i < ticks) { g.strokeStyle = C.blue; g.lineWidth = 4; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); g.moveTo(38, y + 2); g.lineTo(50, y + 14); g.lineTo(72, y - 14); g.stroke(); }
      g.fillStyle = C.ink; g.font = 'italic 33px "Brygada 1918", serif'; g.fillText(question, 96, y);
      if (i < card.questions.length - 1) { g.strokeStyle = '#d9ddd9'; g.lineWidth = 1; g.beginPath(); g.moveTo(36, y + 48); g.lineTo(w - 36, y + 48); g.stroke(); }
    });
  });
}
function shoutTexture() {
  return texture(260, 200, (g, w) => {
    g.fillStyle = C.red; roundRect(g, 6, 6, w - 12, 150, 34);
    g.beginPath(); g.moveTo(54, 150); g.lineTo(40, 196); g.lineTo(108, 150); g.fill();
    g.fillStyle = C.paper; g.font = '800 104px Archivo, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('AI!', w / 2, 86);
  });
}
function sayTexture(text) {
  return texture(620, 210, (g, w) => {
    g.fillStyle = C.paper; roundRect(g, 6, 6, w - 12, 140, 30);
    g.beginPath(); g.moveTo(70, 144); g.lineTo(52, 204); g.lineTo(140, 144); g.fill();
    g.fillStyle = C.ink; g.font = 'italic 46px "Brygada 1918", serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(text, w / 2, 78);
  });
}
function letterTexture() {
  return texture(64, 64, g => { g.fillStyle = C.paper; g.font = 'italic 56px "Brygada 1918", serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('z', 32, 30); });
}
function sprite(map, w, h) {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map, transparent: true, depthWrite: false }));
  s.userData.size = [w, h];
  s.scale.set(0.0001, 0.0001, 1);
  return s;
}

function buildMan() {
  const man = new THREE.Group();
  const suit = mat(C.ink), skin = mat(C.skin);
  for (const side of [-1, 1]) {
    man.add(solid(new THREE.CapsuleGeometry(0.12, 0.6, 6, 14), suit, side * 0.15, 0.44, 0));
    man.add(rbox(0.2, 0.11, 0.38, 0.05, suit, side * 0.15, 0.055, 0.07));
  }
  man.add(rbox(0.74, 0.88, 0.44, 0.15, suit, 0, 1.27, 0));
  man.add(solid(new THREE.BoxGeometry(0.2, 0.46, 0.02), mat(C.paper), 0, 1.44, 0.222));
  man.add(solid(new THREE.BoxGeometry(0.085, 0.4, 0.02), mat(C.blue), 0, 1.41, 0.236));
  const head = new THREE.Group();
  head.position.y = 2.0;
  head.add(solid(new THREE.SphereGeometry(0.29, 36, 24), skin));
  const hair = solid(new THREE.SphereGeometry(0.305, 36, 16, 0, Math.PI * 2, 0, Math.PI * 0.42), suit);
  hair.rotation.x = -0.35;
  head.add(hair);
  const eyes = [-1, 1].map(side => solid(new THREE.SphereGeometry(0.034, 12, 10), suit, side * 0.105, 0.02, 0.268));
  eyes.forEach(eye => { eye.castShadow = false; head.add(eye); });
  man.add(head);
  const arms = [-1, 1].map(side => {
    const pivot = new THREE.Group();
    pivot.position.set(side * 0.45, 1.6, 0);
    pivot.add(solid(new THREE.CapsuleGeometry(0.085, 0.5, 6, 12), suit, 0, -0.33, 0));
    pivot.add(solid(new THREE.SphereGeometry(0.1, 16, 12), skin, 0, -0.7, 0));
    man.add(pivot);
    return pivot;
  });
  return { man, head, eyes, arms };
}

export async function startFilm({ canvas, sections, papers, paperLabel, say, card: cardContent }) {
  await Promise.all(['700 25px Archivo', '800 104px Archivo', '500 15px Archivo', 'italic 46px "Brygada 1918"'].map(f => document.fonts.load(f, 'AIąż?')));
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);

  scene.add(new THREE.HemisphereLight('#ffffff', '#aab0c4', 1.9));
  const sun = new THREE.DirectionalLight('#ffffff', 2.1);
  sun.position.set(-5, 9, 7);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.radius = 6;
  Object.assign(sun.shadow.camera, { left: -8, right: 8, top: 8, bottom: -4, near: 1, far: 30 });
  scene.add(sun);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(60, 30), new THREE.ShadowMaterial({ opacity: 0.2 }));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  // The bedroom: a bed on the left, a fridge on the right. It leaves when order arrives.
  const bed = new THREE.Group();
  bed.position.set(-1.9, 0, 0);
  bed.add(rbox(2.6, 0.32, 1.36, 0.06, mat(C.inkSoft), 0, 0.36, 0));
  bed.add(rbox(2.5, 0.22, 1.26, 0.09, mat(C.paper), 0, 0.6, 0));
  bed.add(rbox(0.12, 1.1, 1.36, 0.05, mat(C.inkSoft), -1.3, 0.75, 0));
  bed.add(rbox(0.62, 0.18, 0.92, 0.08, mat(C.paper), -0.86, 0.78, 0));
  const blanket = rbox(1.6, 0.78, 1.3, 0.12, mat(C.blueSoft), 0.42, 1.08, 0);
  bed.add(blanket);
  scene.add(bed);

  const fridge = new THREE.Group();
  fridge.position.set(2.3, 0, -1.0);
  fridge.add(rbox(1.1, 2.3, 0.86, 0.07, mat(C.paper), 0, 1.15, 0));
  fridge.add(solid(new THREE.PlaneGeometry(0.94, 2.1), new THREE.MeshBasicMaterial({ color: C.red }), 0, 1.15, 0.436));
  const door = new THREE.Group();
  door.position.set(0.55, 0, 0.44);
  door.add(rbox(1.1, 2.3, 0.09, 0.04, mat(C.paper), -0.55, 1.15, 0.045));
  door.add(rbox(0.06, 0.5, 0.06, 0.02, mat(C.ink), -0.98, 1.3, 0.12));
  fridge.add(door);
  scene.add(fridge);

  const deskTop = 0.99;
  const desk = new THREE.Group();
  desk.position.set(2.0, -4, 0.7);
  desk.add(rbox(2.7, 0.09, 1.15, 0.03, mat(C.desk), 0, 0.945, 0));
  for (const [x, z] of [[-1.2, -0.45], [1.2, -0.45], [-1.2, 0.45], [1.2, 0.45]]) desk.add(solid(new THREE.BoxGeometry(0.08, 0.9, 0.08), mat(C.ink), x, 0.45, z));
  scene.add(desk);

  const { man, head, eyes, arms } = buildMan();
  scene.add(man);

  // The market's papers: a stream of blank sheets, and four that can be read.
  const N = 44;
  const sheets = new THREE.InstancedMesh(new THREE.BoxGeometry(0.44, 0.58, 0.006), mat(C.paper, { side: THREE.DoubleSide }), N);
  sheets.castShadow = true;
  sheets.frustumCulled = false;
  scene.add(sheets);
  const big = papers.map((paper, i) => {
    const plain = paperTexture(paper, paperLabel, false), asked = paperTexture(paper, paperLabel, true);
    const mesh = solid(new THREE.BoxGeometry(1.44, 1.08, 0.012), [mat(C.paper), mat(C.paper), mat(C.paper), mat(C.paper), mat('#ffffff', { map: plain }), mat(C.paper)]);
    mesh.userData = { plain, asked, i };
    scene.add(mesh);
    return mesh;
  });
  const bigHome = [[-1.75, 2.75, 0.8], [-0.15, 3.25, 0.4], [-2.0, 1.45, 1.4], [1.1, 3.05, 0.6]];
  const cardMaps = [0, 1, 2, 3].map(n => cardTexture(cardContent, n));
  const card = solid(new THREE.BoxGeometry(2.5, 1.56, 0.014), [mat(C.paper), mat(C.paper), mat(C.paper), mat(C.paper), mat('#ffffff', { map: cardMaps[0] }), mat(C.paper)]);
  card.scale.setScalar(0.0001);
  scene.add(card);
  const glow = new THREE.PointLight(C.red, 0, 7);
  glow.position.set(1.9, 1.4, 0.3);
  scene.add(glow);

  const shoutMap = shoutTexture();
  // Where each shout comes from, where it ends up, how large it is: the fridge first.
  const shoutPlan = [
    [[2.3, 1.3, -0.5], [1.3, 2.25, 2.0], 1.45],
    [[-1.6, 0.2, 0.7], [-0.9, 0.85, 2.0], 0.85],
    [[-3.0, 1.0, 0], [-1.25, 2.6, 1.8], 0.95],
    [[0.2, 4.6, 0], [0.45, 2.85, 1.7], 1.0],
    [[3.6, 0.4, 1], [2.35, 0.85, 2.1], 0.8],
    [[3.4, 4.2, -1], [2.5, 2.7, 1.8], 0.7],
  ];
  const shouts = shoutPlan.map(() => { const s = sprite(shoutMap, 1.3, 1.0); scene.add(s); return s; });
  const bubble = sprite(sayTexture(say), 3.0, 1.02);
  scene.add(bubble);
  const zMap = letterTexture();
  const zs = [0, 1, 2].map(() => { const s = sprite(zMap, 0.3, 0.3); scene.add(s); return s; });

  const dummy = new THREE.Object3D();
  const look = new THREE.Vector3();
  // time, camera position, look-at, picture shift to the right and upwards (fractions of the screen)
  const cams = [
    [0, [-0.9, 2.3, 9.2], [-1.3, 1.0, 0], 0.24, 0.02],
    [1.1, [0.2, 2.5, 11.4], [0.25, 1.6, 0], 0.21, 0.0],
    [1.62, [0.2, 2.5, 11.4], [0.25, 1.6, 0], 0.21, 0.0],
    // Closer, on the man and the fridge: what happens when he opens it?
    [2.0, [1.0, 2.1, 8.6], [1.75, 1.4, -0.3], 0.2, 0.0],
    [2.19, [1.0, 2.1, 8.4], [1.75, 1.4, -0.3], 0.2, 0.0],
    [2.34, [0.5, 2.4, 11.8], [0.4, 1.65, 0], 0.21, 0.0],
    [2.75, [0.5, 2.4, 11.8], [0.4, 1.65, 0], 0.21, 0.0],
    [3.2, [1.3, 2.4, 9.8], [1.6, 1.6, 0.3], 0.2, 0.0],
    [3.66, [1.3, 2.4, 9.8], [1.6, 1.6, 0.3], 0.2, 0.0],
    // The steps screen uses the full width for its text: the desk is seen from further away, in the free upper right.
    [3.93, [1.9, 3.4, 13.5], [2.1, 1.2, 0.6], 0.27, 0.26],
    [6, [1.9, 3.4, 13.5], [2.1, 1.2, 0.6], 0.27, 0.26],
  ];
  let width = 0, height = 0, frame = 0, T = -1, shown = -1, running = true, last = performance.now();
  const start = performance.now();

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
    if (!running) return;
    frame = requestAnimationFrame(tick);
    const target = timeline();
    // Follow the scroll with a short, frame-rate independent lag, so a slow machine is not left behind.
    const now = performance.now(), dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    T = T < 0 ? target : T + (target - T) * (1 - Math.exp(-dt * 10));
    // The steps screen scrolls its own text through the picture, so the film is over just after that screen has arrived.
    const visible = 1 - seg(T, 4.03, 4.28);
    if (visible !== shown) { canvas.style.opacity = visible.toFixed(3); shown = visible; }
    if (visible <= 0) return;
    if (!canvas.clientWidth) return;
    const time = (performance.now() - start) / 1000;
    if (canvas.clientWidth !== width || canvas.clientHeight !== height) {
      width = canvas.clientWidth; height = canvas.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
    }

    // Camera: keyframes over T, and the picture shifted to the side the text leaves free.
    let k = 0;
    while (k < cams.length - 2 && T > cams[k + 1][0]) k++;
    const a = cams[k], b = cams[k + 1], m = seg(T, a[0], b[0]);
    camera.position.set(lerp(a[1][0], b[1][0], m), lerp(a[1][1], b[1][1], m), lerp(a[1][2], b[1][2], m));
    look.set(lerp(a[2][0], b[2][0], m), lerp(a[2][1], b[2][1], m), lerp(a[2][2], b[2][2], m));
    camera.lookAt(look);
    camera.setViewOffset(width, height, -lerp(a[3], b[3], m) * width, lerp(a[4], b[4], m) * height, width, height);
    camera.updateProjectionMatrix();

    // The bedroom and the desk.
    const leave = seg(T, 2.9, 3.2), arrive = seg(T, 2.95, 3.25);
    bed.position.x = -1.9 - leave * 11;
    fridge.position.x = 2.3 + leave * 11;
    desk.position.y = lerp(-4, 0, arrive);
    const wake = seg(T, 0.42, 0.9);
    blanket.scale.y = lerp(1, 0.14, seg(T, 0.42, 0.7));
    blanket.position.y = lerp(1.08, 0.76, seg(T, 0.42, 0.7));
    // The fridge gives itself away before it is opened: it trembles and red light leaks out.
    const hint = seg(T, 1.7, 2.05) * (1 - seg(T, 2.2, 2.3)), storm = seg(T, 2.2, 2.3) * (1 - seg(T, 2.8, 3.0));
    fridge.rotation.z = Math.sin(time * 33) * 0.013 * hint;
    glow.intensity = hint * 9 + storm * 16;
    door.rotation.y = 1.75 * (seg(T, 2.1, 2.21) - seg(T, 2.85, 3.0));

    const deskX = desk.position.x, deskZ = desk.position.z;

    // The man: asleep on his side, up on his feet, overwhelmed, then decided.
    const panic = seg(T, 2.2, 2.28) * (1 - seg(T, 2.72, 2.9));
    const puzzled = seg(T, 1.0, 1.2) * (1 - seg(T, 1.55, 1.65));
    // He walks over to the fridge, looks back once, reaches for the handle; what jumps out throws him back.
    const walk = seg(T, 1.62, 1.95), recoil = seg(T, 2.2, 2.32), reach = seg(T, 1.92, 2.04) * (1 - seg(T, 2.2, 2.26));
    const glance = seg(T, 1.99, 2.04) * (1 - seg(T, 2.07, 2.12));
    const decide = seg(T, 2.72, 2.9) * (1 - seg(T, 3.25, 3.45));
    const work = seg(T, 3.5, 3.72);
    man.position.set(lerp(-0.9, 0.15, wake) + walk * 1.1 - recoil * 0.8 + work * 0.45, lerp(1.08, 0, wake) + Math.sin(wake * Math.PI) * 0.55 + Math.abs(Math.sin(walk * 14)) * 0.05 * (walk < 1 ? 1 : 0), lerp(0, 0.5, wake) - walk * 0.35 + recoil * 0.35 + work * 0.1);
    man.rotation.z = lerp(Math.PI / 2, 0, wake) + panic * Math.sin(time * 9) * 0.035;
    man.rotation.y = puzzled * Math.sin(time * 1.1) * 0.5 + (walk - recoil) * 2.0 + panic * Math.sin(time * 2.3) * 0.7 + work * 0.75;
    man.scale.y = 1 - panic * 0.06;
    head.rotation.x = panic * 0.3 + work * 0.35;
    head.rotation.y = puzzled * Math.sin(time * 1.7 + 1) * 0.5 - glance * 1.3;
    eyes.forEach(eye => { eye.scale.y = lerp(0.12, 1, seg(T, 0.36, 0.46)) * (1 + panic * 0.5); });
    arms.forEach((arm, i) => {
      const side = i ? 1 : -1;
      arm.rotation.z = side * (0.12 + puzzled * 0.45 + panic * 2.55 + (i ? decide * 2.9 : decide * 0.2) + work * 0.25);
      arm.rotation.x = -work * (1.0 + Math.sin(time * 3 + i * 2) * 0.25) - panic * 0.3 - (i ? reach * 1.35 : 0);
    });
    zs.forEach((z, i) => {
      const u = (time * 0.32 + i / 3) % 1, on = 1 - seg(T, 0.3, 0.44);
      z.position.set(-2.55 + u * 0.55, 1.75 + u * 1.3, 0.3);
      z.material.opacity = on * Math.sin(u * Math.PI);
      z.scale.setScalar(on ? 0.22 + u * 0.3 : 0.0001);
    });

    // Papers: a stream from left to right, then a heap on the desk, then four stacks.
    const flow = seg(T, 0.62, 1.15), gather = seg(T, 2.95, 3.3);
    for (let i = 0; i < N; i++) {
      const p = rand(i), q = rand(i + 50), s = rand(i + 99);
      const u = (T * 0.55 + time * 0.035 * (0.6 + q) + p) % 1;
      const fx = -7.5 + u * 15, fy = 0.9 + q * 3.1 + Math.sin(u * 9 + i) * 0.35, fz = -2.2 + s * 4;
      const stack = i % 4, level = Math.floor(i / 4);
      const sorted = seg(T, 3.6 + stack * 0.07, 3.78 + stack * 0.07);
      const hx = deskX - 0.2 + (p - 0.5) * 1.5, hz = deskZ + (q - 0.5) * 0.6, hy = deskTop + 0.01 + i * 0.007;
      const sx = deskX - 0.93 + stack * 0.62, sz = deskZ + 0.05, sy = deskTop + 0.008 + level * 0.014;
      const tx = lerp(hx, sx, sorted), ty = lerp(hy, sy, sorted) + Math.sin(sorted * Math.PI) * 0.5, tz = lerp(hz, sz, sorted);
      const g = seg(gather, q * 0.5, 0.5 + q * 0.5);
      dummy.position.set(lerp(fx, tx, g), lerp(fy, ty, g) + Math.sin(g * Math.PI) * 0.8, lerp(fz, tz, g));
      dummy.rotation.set(lerp(u * 9 + i, -Math.PI / 2, g), lerp(u * 5 + q * 6, 0, g), lerp(Math.sin(u * 7 + i) * 0.9, (s - 0.5) * (1 - sorted) * 1.4, g));
      dummy.scale.setScalar(flow * (1 - 0.18 * g));
      dummy.updateMatrix();
      sheets.setMatrixAt(i, dummy.matrix);
    }
    sheets.instanceMatrix.needsUpdate = true;

    // The four papers that can be read: they stop in front of him, the pencil asks, later they join the heap.
    big.forEach((mesh, i) => {
      const t0 = 0.86 + i * 0.1, come = seg(T, t0, t0 + 0.2), go = seg(T, 2.95 + i * 0.04, 3.25 + i * 0.04);
      const asked = T > t0 + 0.34;
      const face = mesh.material[4];
      if (face.map !== (asked ? mesh.userData.asked : mesh.userData.plain)) { face.map = asked ? mesh.userData.asked : mesh.userData.plain; face.needsUpdate = true; }
      const home = bigHome[i], shake = panic * Math.sin(time * 11 + i) * 0.05;
      const x = lerp(-9 - i, home[0], come), y = lerp(home[1] + 1, home[1], come) + Math.sin(time * 0.9 + i * 1.7) * 0.06, z = home[2];
      mesh.position.set(lerp(x, deskX - 0.7 + i * 0.45, go) + shake, lerp(y, deskTop + 0.2 + i * 0.01, go) + Math.sin(go * Math.PI) * 0.7, lerp(z, deskZ - 0.1, go));
      mesh.rotation.set(lerp(0, -Math.PI / 2, go), lerp((i % 2 ? -1 : 1) * 0.22 + (1 - come) * 2, 0, go), lerp((i % 2 ? 1 : -1) * 0.05, (i - 1.5) * 0.2, go));
      mesh.scale.setScalar(lerp(1, 0.42, go) * (come > 0 ? 1 : 0.0001) * (1 - seg(T, 3.5, 3.65)));
    });

    // "AI!" from everywhere.
    shouts.forEach((s, i) => {
      // The first one comes out of the fridge, straight at him; the rest follow from everywhere.
      const [from, to, size] = shoutPlan[i], t0 = i ? 2.25 + i * 0.038 : 2.2;
      const out = pop((T - t0) / 0.09) * (T > t0 ? 1 : 0), off = seg(T, 2.82 + i * 0.02, 3.0 + i * 0.02), mv = seg(T, t0, t0 + 0.09);
      const wobble = 1 + Math.sin(time * 7 + i * 2.1) * 0.06;
      s.position.set(lerp(from[0], to[0], mv) + Math.sin(time * 5 + i) * 0.04, lerp(from[1], to[1], mv) - off * 2.5, lerp(from[2], to[2], mv));
      const scale = Math.max(0.0001, out * (1 - off) * size * wobble);
      s.scale.set(s.userData.size[0] * scale, s.userData.size[1] * scale, 1);
      s.material.rotation = Math.sin(time * 4 + i * 1.3) * 0.08 * (1 - off);
    });
    const speak = pop((T - 2.78) / 0.14) * (T > 2.78 ? 1 : 0) * (1 - seg(T, 3.2, 3.32));
    bubble.position.set(man.position.x + 1.1, 3.4, man.position.z + 0.2);

    // The consultation enters as one calm sheet: the card of the first conversation, its questions ticked one by one.
    // Later it lies down on the desk as the first of the four stacks.
    const cardIn = seg(T, 3.22, 3.36), cardDown = seg(T, 3.64, 3.82);
    const ticks = T > 3.45 ? 3 : T > 3.41 ? 2 : T > 3.37 ? 1 : 0;
    if (card.material[4].map !== cardMaps[ticks]) { card.material[4].map = cardMaps[ticks]; card.material[4].needsUpdate = true; }
    card.position.set(lerp(2.5, deskX - 0.93, cardDown), lerp(lerp(5.0, 2.15, cardIn), deskTop + 0.17, cardDown) + Math.sin(cardDown * Math.PI) * 0.4, lerp(0.75, deskZ + 0.05, cardDown));
    card.rotation.set(lerp(0, -Math.PI / 2, cardDown), lerp(-0.2, 0, cardDown), lerp((1 - cardIn) * 0.25, 0, cardDown));
    card.scale.setScalar(Math.max(0.0001, cardIn * lerp(1, 0.24, cardDown)));
    bubble.scale.set(Math.max(0.0001, bubble.userData.size[0] * speak), Math.max(0.0001, bubble.userData.size[1] * speak), 1);

    renderer.render(scene, camera);
  }
  tick();
  return () => {
    running = false;
    cancelAnimationFrame(frame);
    renderer.dispose();
    scene.traverse(o => { o.geometry?.dispose?.(); [].concat(o.material || []).forEach(x => { x.map?.dispose?.(); x.dispose?.(); }); });
  };
}
