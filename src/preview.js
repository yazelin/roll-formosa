/**
 * @file preview.js — DEV-only geometry gallery (paired with /preview.html).
 *
 * Renders every landmark + collectible + the goal monument of ?city=<id> in a
 * lit, labelled, slowly-rotating grid — using the SAME geometry vocabulary,
 * vertex-color material and lighting style as the game — so each hand-built
 * geometry's silhouette can be reviewed (live in a browser, or via a headless
 * screenshot: `node scripts/headless-check.mjs http://localhost:<port>/preview.html?city=<id> out.png`).
 *
 * Auto-discovers geometry via import.meta.glob (no per-city wiring). Pure dev
 * tool: not referenced by index.html, so it never enters the production bundle.
 */

import * as THREE from 'three';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { mulberry32 } from './core/rng.js';

const city = new URLSearchParams(location.search).get('city') || 'taipei';

// Eager-glob every pack's geometry sources; filter to the requested city below.
const LM = import.meta.glob('./packs/*/landmarks/*.js', { eager: true });
const COL = import.meta.glob('./packs/*/collectibles/*.js', { eager: true });
const MON = import.meta.glob('./packs/*/monument.js', { eager: true });

/** Pull the {id,name,buildGeometry} descriptor out of a module (named or default). */
function descOf(mod) {
  if (mod.default && typeof mod.default.buildGeometry === 'function') return mod.default;
  return Object.values(mod).find((v) => v && typeof v.buildGeometry === 'function') || null;
}
const inCity = (path) => path.split('/').includes(city);

const items = [];
for (const [path, mod] of Object.entries(MON)) {
  if (!inCity(path)) continue;
  const g = mod.goalMonument || descOf(mod);
  if (g && g.buildGeometry) items.push({ kind: 'monument', id: 'GOAL', name: g.name || '', build: g.buildGeometry });
}
for (const [path, mod] of Object.entries(LM)) {
  if (!inCity(path)) continue;
  const d = descOf(mod);
  if (d) items.push({ kind: 'landmark', id: d.id || path, name: d.name || '', build: d.buildGeometry });
}
for (const [path, mod] of Object.entries(COL)) {
  if (!inCity(path)) continue;
  const d = descOf(mod);
  if (d) items.push({ kind: 'collectible', id: d.id || path, name: d.name || '', build: d.buildGeometry });
}

document.getElementById('title').innerHTML =
  `Geometry Preview — <b>${city}</b> · ${items.length} 件(GOAL monument + 地標 + 收藏)· 灰=monument/landmark, 全部 unit-normalized`;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0e0e1a);
scene.add(new THREE.HemisphereLight(0xffffff, 0x556688, 1.8));
const dir = new THREE.DirectionalLight(0xffffff, 2.0);
dir.position.set(4, 8, 5);
scene.add(dir);

const SP = 3.0; // grid spacing (each geo is a unit sphere, ~2 units tall)
const cols = Math.max(1, Math.ceil(Math.sqrt(items.length)));
const rows = Math.ceil(items.length / cols);
const mat = new THREE.MeshLambertMaterial({ vertexColors: true });
const spin = [];

items.forEach((it, i) => {
  let geo;
  try {
    geo = it.build(mulberry32(0x1234 + i));
  } catch (e) {
    console.error(`[preview] buildGeometry FAILED for ${it.kind} ${it.id}:`, e);
    return;
  }
  const mesh = new THREE.Mesh(geo, mat);
  const cx = (i % cols) * SP;
  const cz = Math.floor(i / cols) * SP;
  mesh.position.set(cx, 0, cz);
  scene.add(mesh);
  spin.push(mesh);

  const div = document.createElement('div');
  div.className = 'lbl';
  div.innerHTML = `<span class="kind-${it.kind}">${it.name || '(?)'}</span><span class="id">${it.id}</span>`;
  const label = new CSS2DObject(div);
  label.position.set(cx, -1.35, cz);
  scene.add(label);
});

// Frame the whole grid.
const cxC = ((cols - 1) * SP) / 2;
const czC = ((rows - 1) * SP) / 2;
const span = Math.max(cols, rows) * SP;
const cam = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 500);
cam.position.set(cxC, span * 0.85, czC + span * 1.25);
cam.lookAt(cxC, 0, czC);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const labels = new CSS2DRenderer();
labels.setSize(window.innerWidth, window.innerHeight);
labels.domElement.style.cssText = 'position:absolute;top:0;left:0;pointer-events:none';
document.body.appendChild(labels.domElement);

addEventListener('resize', () => {
  cam.aspect = window.innerWidth / window.innerHeight;
  cam.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  labels.setSize(window.innerWidth, window.innerHeight);
});

let t = 0;
function loop() {
  requestAnimationFrame(loop);
  t += 0.005;
  // gentle turntable so a live viewer sees all sides; a screenshot catches a 3/4.
  for (const m of spin) m.rotation.y = Math.sin(t) * 0.6 - 0.5;
  renderer.render(scene, cam);
  labels.render(scene, cam);
}
loop();
