/**
 * @file preview.js — 物件圖鑑 (Object Showcase), paired with /preview.html.
 *
 * Player-facing AND dev tool. Renders EVERY object of a city in a lit, labelled,
 * sectioned, scrollable 3D layout — goal monument + landmarks + collectibles + the
 * 70 chunk street objects (grouped by their 7 tiers). A neon city switcher swaps
 * cities IN-PAGE (no reload — this is not the game engine, just rebuild the meshes);
 * the header shows the object count + the katamari scale range; clicking an object
 * focuses it large with its name and tier/kind. Reached from the title screen's
 * 「物件圖鑑」 button.
 *
 * Auto-discovers geometry via import.meta.glob (no per-city wiring). Dev affordances
 * kept: ?kind=<monument|landmark|collectible|chunk> narrows; ?item=<id> close-up.
 * Built as a 2nd Vite entry (vite.config.js), so it ships to GitHub Pages.
 */
import * as THREE from 'three';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { mulberry32 } from './core/rng.js';
import { CITIES, DEFAULT_CITY } from './packs/manifest.js';
import { START_RADIUS_M } from './config/tuning.js';
// Engine constant from src/render/goalTower.js — inlined (not imported) so the
// showcase bundle doesn't pull in the goal-tower renderer + its deps for one number.
const MONUMENT_HEIGHT_M = 508;

/* ---- eager-glob every pack's geometry sources; filter by city below ---- */
const LM = import.meta.glob('./packs/*/landmarks/*.js', { eager: true });
const COL = import.meta.glob('./packs/*/collectibles/*.js', { eager: true });
const MON = import.meta.glob('./packs/*/monument.js', { eager: true });
const ARCH = import.meta.glob('./packs/*/archetypes/*.js', { eager: true });
const TIERMOD = import.meta.glob('./packs/*/tiers.js', { eager: true });

/* ---- layout constants (tuned against headless screenshots) ---- */
const COLS = 6; // items per row — narrow rows keep each object readably large
const SP = 2.8; // x spacing between objects
const ROWGAP = 3.0; // z spacing between rows in a section
const HEAD_GAP = 2.4; // depth a section header occupies before its first row
const SECTION_GAP = 1.8; // extra depth between sections
const BASE_Z = 8; // world z of the nearest band (camera looks here)
const CX = ((COLS - 1) * SP) / 2; // x-centre of every row
const VISIBLE_DEPTH = 11; // ~how much depth fits on screen (for scroll clamp)
const FOG_NEAR = 18, FOG_FAR = 44; // fade far bands into the dark; scroll brings them forward
const LABEL_NEAR = 18, LABEL_FAR = 40; // DOM labels can't fog — distance-fade them to match

/* ---- query params ---- */
const params = new URLSearchParams(location.search);
let city = params.get('city') || DEFAULT_CITY;
const onlyKind = params.get('kind'); // dev narrow
const onlyItem = params.get('item'); // dev close-up
const initialScroll = parseFloat(params.get('scroll') || '0') || 0; // dev: screenshot lower bands
const focusParam = params.get('focus'); // dev: auto-open focus on load (screenshot verify)

/* deterministic per-id seed so geometry is stable but varied */
function seedOf(id) {
  let h = 0x9e3779b9;
  for (let i = 0; i < id.length; i++) h = (Math.imul(h ^ id.charCodeAt(i), 0x01000193) >>> 0);
  return h >>> 0;
}
const belongs = (path, c) => path.split('/').includes(c);
function descOf(mod) {
  if (mod.default && typeof mod.default.buildGeometry === 'function') return mod.default;
  return Object.values(mod).find((v) => v && typeof v.buildGeometry === 'function') || null;
}

/** Discover one city's objects → { monument, landmarks, collectibles, chunkByTier, tierNames }. */
function discover(c) {
  let monument = null;
  for (const [p, mod] of Object.entries(MON)) {
    if (!belongs(p, c)) continue;
    const g = mod.goalMonument || descOf(mod);
    if (g && g.buildGeometry) monument = { id: 'goal', name: g.name || '終點', kind: 'monument', build: g.buildGeometry };
  }
  const landmarks = [];
  for (const [p, mod] of Object.entries(LM)) {
    if (!belongs(p, c)) continue;
    const d = descOf(mod);
    if (d) landmarks.push({ id: d.id || p, name: d.name || '', kind: 'landmark', build: d.buildGeometry });
  }
  const collectibles = [];
  for (const [p, mod] of Object.entries(COL)) {
    if (!belongs(p, c)) continue;
    const d = descOf(mod);
    if (d) collectibles.push({ id: d.id || p, name: d.name || '', kind: 'collectible', build: d.buildGeometry });
  }
  const chunkByTier = new Map();
  for (const [p, mod] of Object.entries(ARCH)) {
    if (!belongs(p, c)) continue;
    const arr = Array.isArray(mod.default) ? mod.default : Object.values(mod).find((v) => Array.isArray(v));
    if (!Array.isArray(arr)) continue;
    for (const a of arr) {
      if (!a || typeof a.buildGeometry !== 'function') continue;
      const t = a.tier ?? 0;
      if (!chunkByTier.has(t)) chunkByTier.set(t, []);
      chunkByTier.get(t).push({ id: a.id, name: a.displayName || a.name || '', kind: 'chunk', tier: t, build: a.buildGeometry });
    }
  }
  let tierNames = [];
  for (const [p, mod] of Object.entries(TIERMOD)) {
    if (!belongs(p, c)) continue;
    const tiers = mod.TIERS || mod.default;
    if (Array.isArray(tiers)) tierNames = tiers.map((t) => t.name || '');
  }
  return { monument, landmarks, collectibles, chunkByTier, tierNames };
}

/** Build ordered sections from a model, applying dev ?kind / ?item filters. */
function sectionsOf(model) {
  let secs = [];
  if (model.monument) secs.push({ title: '★ 終點', kind: 'monument', items: [model.monument] });
  if (model.landmarks.length) secs.push({ title: '地標', kind: 'landmark', items: model.landmarks });
  if (model.collectibles.length) secs.push({ title: '收藏', kind: 'collectible', items: model.collectibles });
  for (const t of [...model.chunkByTier.keys()].sort((a, b) => a - b)) {
    secs.push({ title: `T${t}　${model.tierNames[t] || '街頭物'}`, kind: 'chunk', items: model.chunkByTier.get(t) });
  }
  if (onlyKind) secs = secs.filter((s) => s.kind === onlyKind);
  if (onlyItem) {
    const hit = [];
    for (const s of secs) for (const it of s.items) if (it.id === onlyItem || it.id.includes(onlyItem) || (it.name && it.name.includes(onlyItem))) hit.push(it);
    secs = hit.length ? [{ title: `close-up: ${onlyItem}`, kind: hit[0].kind, items: hit }] : [];
  }
  return secs;
}

/* ================================ scene ================================ */
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b0b16);
scene.fog = new THREE.Fog(0x0b0b16, FOG_NEAR, FOG_FAR); // distant bands melt into the dark
scene.add(new THREE.HemisphereLight(0xffffff, 0x445588, 1.7));
const dir = new THREE.DirectionalLight(0xffffff, 1.85);
dir.position.set(5, 9, 6);
scene.add(dir);
const rim = new THREE.DirectionalLight(0x6fb0ff, 0.55);
rim.position.set(-6, 3, -5);
scene.add(rim);
const mat = new THREE.MeshLambertMaterial({ vertexColors: true });

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(innerWidth, innerHeight);
labelRenderer.domElement.style.cssText = 'position:absolute;top:0;left:0;pointer-events:none';
document.body.appendChild(labelRenderer.domElement);

const cam = new THREE.PerspectiveCamera(46, innerWidth / innerHeight, 0.1, 2000);
const CAM_POS = new THREE.Vector3(CX, 7.5, 16);
const CAM_LOOK = new THREE.Vector3(CX, 0, 3);
cam.position.copy(CAM_POS);
cam.lookAt(CAM_LOOK);

let galleryGroup = null; // current city's meshes + labels
let spinners = []; // meshes to turntable
let clickable = []; // meshes for raycast
let fadeables = []; // CSS2D labels to distance-fade (DOM can't respect fog)
const _v = new THREE.Vector3();
let totalDepth = 0;
let scrollZ = 0;
let maxScroll = 0;

/** Tear down the current gallery (dispose geometry, remove label DOM). */
function teardown() {
  if (!galleryGroup) return;
  galleryGroup.traverse((o) => {
    if (o.isMesh && o.geometry) o.geometry.dispose();
    if (o.element && o.element.remove) o.element.remove();
  });
  scene.remove(galleryGroup);
  galleryGroup = null;
  spinners = [];
  clickable = [];
  fadeables = [];
}

/** Build the sectioned gallery for `sections`. */
function buildGallery(sections) {
  galleryGroup = new THREE.Group();
  let depth = 0;
  for (const sec of sections) {
    const headDiv = document.createElement('div');
    headDiv.className = `sc-band kind-${sec.kind}`;
    headDiv.innerHTML = `${sec.title}<span class="n">${sec.items.length}</span>`;
    const head = new CSS2DObject(headDiv);
    head.position.set(CX, 1.9, BASE_Z - (depth + 0.6));
    galleryGroup.add(head);
    fadeables.push(head);
    depth += HEAD_GAP;

    const rows = Math.ceil(sec.items.length / COLS);
    for (let i = 0; i < sec.items.length; i++) {
      const it = sec.items[i];
      let geo;
      try {
        geo = it.build(mulberry32(seedOf(it.id)));
      } catch (e) {
        console.error(`[showcase] buildGeometry FAILED for ${it.kind} ${it.id}:`, e);
        continue;
      }
      const mesh = new THREE.Mesh(geo, mat);
      // centre short rows; the monument row gets a gentle scale-up
      const inRow = Math.min(COLS, sec.items.length - Math.floor(i / COLS) * COLS);
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      const x = (col - (inRow - 1) / 2) * SP + CX;
      const z = BASE_Z - (depth + row * ROWGAP);
      mesh.position.set(x, 0, z);
      if (sec.kind === 'monument') mesh.scale.setScalar(1.5);
      mesh.userData.item = it;
      galleryGroup.add(mesh);
      spinners.push(mesh);
      clickable.push(mesh);

      const div = document.createElement('div');
      div.className = `lbl kind-${it.kind}`;
      div.textContent = it.name || it.id;
      const lab = new CSS2DObject(div);
      lab.position.set(x, sec.kind === 'monument' ? -1.9 : -1.35, z);
      galleryGroup.add(lab);
      fadeables.push(lab);
    }
    depth += rows * ROWGAP + SECTION_GAP;
  }
  totalDepth = depth;
  maxScroll = Math.max(0, totalDepth - VISIBLE_DEPTH);
  galleryGroup.position.z = 0;
  scene.add(galleryGroup);
}

/* ---- header + city switcher chrome ---- */
const headerEl = document.getElementById('sc-header');
const citiesEl = document.getElementById('sc-cities');
function fmtLen(m) {
  return m < 1 ? `${Math.round(m * 100)} cm` : `${Math.round(m)} m`;
}
function updateHeader(model, total) {
  const cityName = (CITIES.find((c) => c.id === city) || {}).displayName || city;
  if (total === 0) {
    headerEl.innerHTML = `<b>${cityName}</b> · 即將推出,尚無物件`;
    return;
  }
  headerEl.innerHTML =
    `<b>${cityName}</b> · ${total} 件物件 · ` +
    `<span class="sc-scale">${fmtLen(START_RADIUS_M)} → ${fmtLen(MONUMENT_HEIGHT_M)}</span>`;
}
function buildCityPills() {
  citiesEl.textContent = '';
  for (const c of CITIES) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'sc-pill' + (c.id === city ? ' active' : '') + (c.status !== 'ready' ? ' soon' : '');
    b.textContent = c.displayName;
    b.addEventListener('click', () => switchCity(c.id));
    citiesEl.appendChild(b);
  }
}

/** (Re)render a city without reloading the page. */
function render(c) {
  city = c;
  closeFocus();
  teardown();
  const model = discover(c);
  const sections = sectionsOf(model);
  const total = sections.reduce((n, s) => n + s.items.length, 0);
  buildGallery(sections);
  scrollZ = Math.min(initialScroll, maxScroll);
  applyScroll();
  updateHeader(model, total);
  buildCityPills();
  if (focusParam) {
    const m = clickable.find((mm) => {
      const it = mm.userData.item;
      return it.id === focusParam || it.id.includes(focusParam) || (it.name && it.name.includes(focusParam));
    });
    if (m) openFocus(m.userData.item);
  }
}
function switchCity(id) {
  if (id === city) return;
  const u = new URL(location.href);
  u.searchParams.set('city', id);
  history.replaceState(null, '', u);
  render(id);
}

/* ---- scroll (wheel + drag), clamped ---- */
function applyScroll() {
  scrollZ = Math.max(0, Math.min(maxScroll, scrollZ));
  if (galleryGroup) galleryGroup.position.z = scrollZ;
}
const hintEl = document.getElementById('sc-hint');
let hinted = false;
function usedScroll() {
  if (hinted || !hintEl) return;
  hinted = true;
  hintEl.style.opacity = '0';
}
addEventListener('wheel', (e) => { if (focusItem) return; scrollZ += e.deltaY * 0.012; applyScroll(); usedScroll(); }, { passive: true });

/* ---- pointer: distinguish tap (focus) from drag (scroll) ---- */
let down = null;
renderer.domElement.addEventListener('pointerdown', (e) => {
  if (focusItem) return;
  down = { x: e.clientX, y: e.clientY, lastY: e.clientY, t: performance.now(), moved: false };
  renderer.domElement.setPointerCapture(e.pointerId);
});
renderer.domElement.addEventListener('pointermove', (e) => {
  if (!down || focusItem) return;
  if (Math.abs(e.clientX - down.x) + Math.abs(e.clientY - down.y) > 8) down.moved = true;
  if (down.moved) {
    scrollZ -= (e.clientY - down.lastY) * 0.05; // drag up → deeper
    down.lastY = e.clientY;
    applyScroll();
    usedScroll();
  }
});
renderer.domElement.addEventListener('pointerup', (e) => {
  if (!down || focusItem) { down = null; return; }
  const tap = !down.moved && performance.now() - down.t < 400;
  down = null;
  if (tap) tryFocus(e.clientX, e.clientY);
});

/* ---- click-to-focus ---- */
const ray = new THREE.Raycaster();
let focusItem = null;
let focusMesh = null;
const focusEl = document.getElementById('sc-focus');
const focusName = document.getElementById('sc-focus-name');
const focusMeta = document.getElementById('sc-focus-meta');
const KIND_LABEL = { monument: '終點地標', landmark: '地標', collectible: '收藏品', chunk: '街頭物' };
function tryFocus(px, py) {
  const r = renderer.domElement.getBoundingClientRect();
  ray.setFromCamera(new THREE.Vector2(((px - r.left) / r.width) * 2 - 1, -((py - r.top) / r.height) * 2 + 1), cam);
  const hit = ray.intersectObjects(clickable, false)[0];
  if (hit) openFocus(hit.object.userData.item);
}
function openFocus(item) {
  focusItem = item;
  if (galleryGroup) galleryGroup.visible = false;
  let geo;
  try { geo = item.build(mulberry32(seedOf(item.id))); } catch { return; }
  focusMesh = new THREE.Mesh(geo, mat);
  focusMesh.scale.setScalar(3.4);
  focusMesh.position.copy(CAM_LOOK).setY(1.2);
  scene.add(focusMesh);
  focusName.textContent = item.name || item.id;
  const meta = [KIND_LABEL[item.kind] || item.kind];
  if (item.kind === 'chunk') meta.push(`T${item.tier}`);
  focusMeta.textContent = meta.join(' · ');
  focusEl.classList.remove('hidden');
}
function closeFocus() {
  if (!focusItem) return;
  focusItem = null;
  if (focusMesh) { scene.remove(focusMesh); focusMesh.geometry.dispose(); focusMesh = null; }
  if (galleryGroup) galleryGroup.visible = true;
  focusEl.classList.add('hidden');
}
document.getElementById('sc-focus-close').addEventListener('click', closeFocus);
focusEl.addEventListener('click', (e) => { if (e.target === focusEl) closeFocus(); });
addEventListener('keydown', (e) => { if (e.key === 'Escape') closeFocus(); });

/* ---- resize ---- */
addEventListener('resize', () => {
  cam.aspect = innerWidth / innerHeight;
  cam.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  labelRenderer.setSize(innerWidth, innerHeight);
});

/* ---- loop ---- */
let t = 0;
function loop() {
  requestAnimationFrame(loop);
  t += 0.005;
  const spin = Math.sin(t) * 0.6 - 0.4;
  if (focusItem && focusMesh) focusMesh.rotation.y += 0.012;
  else for (const m of spinners) m.rotation.y = spin;
  // Fade DOM labels by camera distance (fog only affects meshes). Group offset is
  // z-only, so world pos = local + (0,0,scrollZ).
  const sz = galleryGroup ? galleryGroup.position.z : 0;
  for (const o of fadeables) {
    if (focusItem) { o.element.style.opacity = '0'; continue; }
    _v.set(o.position.x, o.position.y, o.position.z + sz);
    const d = cam.position.distanceTo(_v);
    const op = d <= LABEL_NEAR ? 1 : d >= LABEL_FAR ? 0 : 1 - (d - LABEL_NEAR) / (LABEL_FAR - LABEL_NEAR);
    o.element.style.opacity = op.toFixed(2);
  }
  renderer.render(scene, cam);
  labelRenderer.render(scene, cam);
}

render(city);
loop();
