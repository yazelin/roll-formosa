/**
 * @file test-osm-render.mjs — Stream R standalone-scene tests with SYNTHETIC
 * records (docs/DESIGN-V4.md 並列作業分割 STREAM R). Headless node, no GL:
 * THREE.BatchedMesh/InstancedMesh state is CPU-side until first render, so
 * every Stream R contract is assertable here:
 *
 *   1. osmPools boot feasibility + unit-box + axis-aligned-normals asserts
 *      (positive AND firing-on-violation cases)
 *   2. BatchedExtraPool non-uniform setTransform / fade scale-triples /
 *      rescaleAll / rebaseAll / 4-arg uniform back-compat
 *   3. InstancedPool non-uniform overload + uniform back-compat byte-identity
 *   4. devAssertOsmScaleMatchesRadius (the radius audit DEV assert)
 *   5. OsmGround: synthetic FKT4 outer shard (format v1) — index build,
 *      <=2 builds/frame amortization, major/minor LOD ring, river mesh
 *      decode, RESCALE similarity identity, REBASE identity, reset,
 *      bad-magic disable, failed-latch inertness
 *
 * Run: node scripts/test-osm-render.mjs   (exit 0 = all green)
 */

import * as THREE from 'three';
import { makeOsmPools, osmPoolForBand, devAssertOsmScaleMatchesRadius } from '../src/render/osmPools.js';
import { BatchedExtraPool } from '../src/render/extraPools.js';
import { InstancedPool, getSharedObjectMaterial } from '../src/render/instances.js';
import { OsmGround } from '../src/render/osmGround.js';
import { bus, EVT, PAYLOADS } from '../src/core/events.js';
import {
  OSM_POOL_DETAIL_CAP,
  OSM_POOL_LARGE_CAP,
  OSM_GROUND_MINOR_LOD_FRAC,
  OSM_GROUND_Y_PARK,
  OSM_GROUND_Y_MAJOR,
  LOAD_RADIUS_MIN_M,
} from '../src/config/tuning.js';

let pass = 0;
let fail = 0;
function ok(cond, label) {
  if (cond) {
    pass++;
  } else {
    fail++;
    console.error(`  FAIL: ${label}`);
  }
}
function near(a, b, eps, label) {
  ok(Math.abs(a - b) <= eps, `${label} (${a} vs ${b})`);
}
function throws(fn, label) {
  try {
    fn();
    fail++;
    console.error(`  FAIL (no throw): ${label}`);
  } catch {
    pass++;
  }
}

const mat = getSharedObjectMaterial();

/* ================================================================== */
console.log('[1] osmPools boot asserts');
/* ================================================================== */

/** @returns {Array<{code:number, geometry:THREE.BufferGeometry}>} 16 legal unit boxes. */
function legalMembers() {
  const m = [];
  for (let code = 94; code <= 109; code++) m.push({ code, geometry: new THREE.BoxGeometry(2, 2, 2) });
  return m;
}

const pools = makeOsmPools(mat, legalMembers());
ok(pools.detail instanceof BatchedExtraPool && pools.large instanceof BatchedExtraPool, 'makeOsmPools returns 2 BatchedExtraPool');
ok(pools.detail.capacity === OSM_POOL_DETAIL_CAP, 'detail cap 2048');
ok(pools.large.capacity === OSM_POOL_LARGE_CAP, 'large cap 1024');
ok(pools.detail.mesh.visible === false && pools.large.mesh.visible === false, 'empty pools invisible (no draw)');
ok(osmPoolForBand(pools, 2) === pools.detail, 'band 2 -> detail');
ok(osmPoolForBand(pools, 3) === pools.detail, 'band 3 -> detail');
ok(osmPoolForBand(pools, 4) === pools.large, 'band 4 -> large');
ok(osmPoolForBand(pools, 5) === pools.large, 'band 5 -> large');

throws(() => makeOsmPools(mat, legalMembers().slice(0, 15)), 'member count != 16 throws');
throws(() => {
  const m = legalMembers();
  m[1].code = 94; // duplicate
  makeOsmPools(mat, m);
}, 'duplicate code throws');
throws(() => {
  const m = legalMembers();
  m[3].geometry = new THREE.BoxGeometry(3, 2, 2); // half-extent 1.5 > 1
  makeOsmPools(mat, m);
}, 'non-unit-box throws');
throws(() => {
  const m = legalMembers();
  // Tetrahedron: verts inside the unit cube but normals NOT axis-aligned.
  m[7].geometry = new THREE.TetrahedronGeometry(1);
  makeOsmPools(mat, m);
}, 'sloped (non-axis-aligned) normals throw');

/* ================================================================== */
console.log('[2] BatchedExtraPool non-uniform scale + fades + rescale/rebase');
/* ================================================================== */

const M = new THREE.Matrix4();
const P = new THREE.Vector3();
const Q = new THREE.Quaternion();
const S = new THREE.Vector3();

const slot = pools.detail.alloc(94);
ok(slot >= 0, 'alloc(94) on detail pool');
ok(pools.detail.mesh.visible === true, 'pool visible after alloc');
pools.detail.setTransform(slot, new THREE.Vector3(10, 2, -5), new THREE.Quaternion(), 1.5, 4, 0.75);
pools.detail.mesh.getMatrixAt(slot, M);
M.decompose(P, Q, S);
near(S.x, 1.5, 1e-6, 'non-uniform sx');
near(S.y, 4, 1e-6, 'non-uniform sy');
near(S.z, 0.75, 1e-6, 'non-uniform sz');
near(P.x, 10, 1e-6, 'pos x');

// fadeIn: factor multiplies the WHOLE triple.
pools.detail.fadeIn(slot, 1.0);
pools.detail.update(0.5); // easeOutCubic(0.5) = 1 - 0.5^3 = 0.875
pools.detail.mesh.getMatrixAt(slot, M);
M.decompose(P, Q, S);
near(S.x, 1.5 * 0.875, 1e-5, 'fadeIn scales sx by factor');
near(S.y, 4 * 0.875, 1e-5, 'fadeIn scales sy by factor');
near(S.z, 0.75 * 0.875, 1e-5, 'fadeIn scales sz by factor');
pools.detail.update(0.6); // complete

// rescaleAll multiplies positions AND all three scale axes.
pools.detail.rescaleAll(2);
pools.detail.mesh.getMatrixAt(slot, M);
M.decompose(P, Q, S);
near(P.x, 20, 1e-5, 'rescaleAll pos x *= S');
near(S.x, 3, 1e-5, 'rescaleAll sx *= S');
near(S.y, 8, 1e-5, 'rescaleAll sy *= S');
near(S.z, 1.5, 1e-5, 'rescaleAll sz *= S');

pools.detail.rebaseAll(5, -3);
pools.detail.mesh.getMatrixAt(slot, M);
M.decompose(P, Q, S);
near(P.x, 15, 1e-5, 'rebaseAll pos x -= sx');
near(P.z, -10 + 3, 1e-5, 'rebaseAll pos z -= sz');
near(S.y, 8, 1e-5, 'rebaseAll leaves scale alone');

// 4-arg back-compat: uniform.
const slotU = pools.detail.alloc(95);
pools.detail.setTransform(slotU, new THREE.Vector3(1, 1, 1), new THREE.Quaternion(), 2.5);
pools.detail.mesh.getMatrixAt(slotU, M);
M.decompose(P, Q, S);
ok(Math.abs(S.x - 2.5) < 1e-6 && Math.abs(S.y - 2.5) < 1e-6 && Math.abs(S.z - 2.5) < 1e-6, '4-arg setTransform stays uniform');

// fadeOut auto-frees.
pools.detail.fadeOut(slotU, 0.2);
pools.detail.update(0.3);
ok(pools.detail.allocatedCount === 1, 'fadeOut auto-freed the slot');
pools.detail.reset();
ok(pools.detail.allocatedCount === 0 && pools.detail.mesh.visible === false, 'reset drains + hides');

/* ================================================================== */
console.log('[3] InstancedPool non-uniform overload (back-compat)');
/* ================================================================== */

const ip = new InstancedPool(new THREE.BoxGeometry(2, 2, 2), mat, 8);
const is0 = ip.alloc();
ip.setTransform(is0, new THREE.Vector3(3, 0, 4), new THREE.Quaternion(), 2, 5, 0.5);
ip.flush();
{
  const te = ip.mesh.instanceMatrix.array;
  const o = is0 * 16;
  // Identity quat: column lengths are the scales.
  near(te[o + 0], 2, 1e-6, 'InstancedPool sx');
  near(te[o + 5], 5, 1e-6, 'InstancedPool sy');
  near(te[o + 10], 0.5, 1e-6, 'InstancedPool sz');
}
const is1 = ip.alloc();
ip.setTransform(is1, new THREE.Vector3(0, 0, 0), new THREE.Quaternion(), 3);
{
  const te = ip.mesh.instanceMatrix.array;
  const o = is1 * 16;
  ok(te[o] === 3 && te[o + 5] === 3 && te[o + 10] === 3, 'InstancedPool 4-arg uniform back-compat');
}
ip.rescaleAll(2);
{
  const te = ip.mesh.instanceMatrix.array;
  const o = is0 * 16;
  near(te[o + 5], 10, 1e-5, 'InstancedPool rescaleAll scales sy');
  near(te[o + 12], 6, 1e-5, 'InstancedPool rescaleAll scales pos x');
}

/* ================================================================== */
console.log('[4] devAssertOsmScaleMatchesRadius');
/* ================================================================== */

{
  // unit box scaled (w/2,h/2,d/2)=(3,4,12)/ws — half-diag 13/ws == store radius.
  const ws = 2;
  ok(devAssertOsmScaleMatchesRadius(3 / ws, 4 / ws, 12 / ws, 13 / ws) === true, 'consistent scale/radius passes');
  ok(devAssertOsmScaleMatchesRadius(3, 4, 12, 14) === false, 'mismatch returns false');
}

/* ================================================================== */
console.log('[5] OsmGround — synthetic FKT4 outer shard');
/* ================================================================== */

/**
 * Synthetic outer shard, format v1 (docs/DESIGN-V4.md 付録 A):
 *  - ROAD section, tile (0,0): 2 records
 *      r0: class 2 (primary, MAJOR), n=2, width 10 game m: (10,10)->(60,10)
 *      r1: class 4 (tertiary, MINOR), n=2, width 2 game m: (10,40)->(60,40)
 *  - POLY section, tile (0,0): 2 records (band-sorted by kind asc)
 *      p0: kind 1 WATER, square n=4 t=6:   (100,100)-(120,120)
 *      p1: kind 2 PARK,  triangle n=3 t=3: (150,150),(170,150),(150,170)
 */
function buildSyntheticOuter() {
  const roadRec = (cls, w10q, pts) => {
    const b = new Uint8Array(8 + 4 * (pts.length - 1));
    const dv = new DataView(b.buffer);
    dv.setUint8(0, (cls & 7) | ((pts.length & 0x1f) << 3));
    dv.setUint8(1, w10q);
    dv.setUint16(2, 0, true);
    dv.setUint16(4, pts[0][0], true);
    dv.setUint16(6, pts[0][1], true);
    for (let i = 1; i < pts.length; i++) {
      dv.setInt16(8 + (i - 1) * 4, pts[i][0] - pts[i - 1][0], true);
      dv.setInt16(10 + (i - 1) * 4, pts[i][1] - pts[i - 1][1], true);
    }
    return b;
  };
  const polyRec = (kind, verts, tris) => {
    const b = new Uint8Array(6 + 4 * verts.length + 2 * tris.length);
    const dv = new DataView(b.buffer);
    dv.setUint8(0, kind);
    dv.setUint8(1, 0);
    dv.setUint16(2, verts.length, true);
    dv.setUint16(4, tris.length, true);
    dv.setUint16(6, verts[0][0], true);
    dv.setUint16(8, verts[0][1], true);
    let o = 10;
    for (let i = 1; i < verts.length; i++) {
      dv.setInt16(o, verts[i][0] - verts[i - 1][0], true);
      dv.setInt16(o + 2, verts[i][1] - verts[i - 1][1], true);
      o += 4;
    }
    for (const t of tris) {
      dv.setUint16(o, t, true);
      o += 2;
    }
    return b;
  };

  const roadPayload = [
    roadRec(2, 40, [[100, 100], [600, 100]]), // primary 10 game m wide
    roadRec(4, 8, [[100, 400], [600, 400]]), //  tertiary 2 game m wide
  ];
  const polyPayload = [
    polyRec(1, [[1000, 1000], [1200, 1000], [1200, 1200], [1000, 1200]], [0, 1, 2, 0, 2, 3]),
    polyRec(2, [[1500, 1500], [1700, 1500], [1500, 1700]], [0, 1, 2]),
  ];
  const cat = (arrs) => {
    const n = arrs.reduce((s, a) => s + a.length, 0);
    const out = new Uint8Array(n);
    let o = 0;
    for (const a of arrs) {
      out.set(a, o);
      o += a.length;
    }
    return out;
  };
  const roadBytes = cat(roadPayload);
  const polyBytes = cat(polyPayload);

  const total = 16 + 2 * 16 + roadBytes.length + polyBytes.length;
  const bin = new Uint8Array(total);
  const dv = new DataView(bin.buffer);
  dv.setUint32(0, 0x34544b46, true); // 'FKT4'
  dv.setUint16(4, 1, true); // version
  dv.setUint16(6, 2, true); // sectionCount
  let off = 16 + 2 * 16;
  const sec = (idx, type, tx, tz, count, len) => {
    const o = 16 + idx * 16;
    dv.setUint8(o, type);
    dv.setInt16(o + 2, tx, true);
    dv.setInt16(o + 4, tz, true);
    dv.setUint16(o + 6, count, true);
    dv.setUint32(o + 8, off, true);
    dv.setUint32(o + 12, len, true);
    off += len;
  };
  sec(0, 3, 0, 0, 2, roadBytes.length);
  sec(1, 4, 0, 0, 2, polyBytes.length);
  bin.set(roadBytes, 16 + 2 * 16);
  bin.set(polyBytes, 16 + 2 * 16 + roadBytes.length);
  return bin;
}

const scene = new THREE.Scene();
const scaleMgr = { worldScale: 2 }; // sim = game / 2
const waterMat = new THREE.MeshLambertMaterial();
const world = { ready: false, failed: false, outerBytes: null };
const ground = new OsmGround(scene, scaleMgr, waterMat, world);
const ballPos = new THREE.Vector3();

// Not ready -> inert.
ground.update(1 / 60, ballPos, 100);
ok(scene.children.includes(ground.group), 'group added to scene');
ok(ground.group.children.length === 0, 'inert while !ready');

// Ready with synthetic bytes.
world.outerBytes = buildSyntheticOuter();
world.ready = true;
// Ball at game (35,25) -> sim (17.5, 12.5); fogFarSim huge -> everything in ring.
ballPos.set(17.5, 0, 12.5);
ground.update(1 / 60, ballPos, 1000);

const batch = ground.group.children.find((c) => c.isBatchedMesh);
const river = ground.group.children.find((c) => c.isMesh && c.material === waterMat);
ok(!!batch, 'ground BatchedMesh created');
ok(!!river, 'river mesh created on the SHARED water material');
ok(ground.group.children.length === 2, 'exactly 2 children (+2 draws worst case)');
ok(batch && batch.visible === true, 'batch visible with tiles in ring');

// Transform is the pure function (1/ws, -shift).
near(ground.group.scale.x, 0.5, 1e-9, 'group.scale = 1/worldScale');
near(ground.group.position.x, 0, 1e-9, 'group.position = -shift (0 pre-rebase)');

// River decode: 4 verts, 2 tris, water layer Y, absolute game-m coords.
{
  const g = river.geometry;
  ok(g.getAttribute('position').count === 4, 'river vert count');
  ok(g.index.count === 6, 'river tri count');
  const pa = g.getAttribute('position').array;
  near(pa[0], 100, 1e-4, 'river vert x (game m)');
  near(pa[2], 100, 1e-4, 'river vert z (game m)');
  ok(Math.abs(pa[1] - 0.03) < 1e-6, 'water y-offset 0.03 (parks < water < roads)');
  // Up-facing winding.
  const ia = g.index.array;
  const aX = pa[ia[0] * 3], aZ = pa[ia[0] * 3 + 2];
  const cross =
    (pa[ia[1] * 3] - aX) * (pa[ia[2] * 3 + 2] - aZ) - (pa[ia[1] * 3 + 2] - aZ) * (pa[ia[2] * 3] - aX);
  ok(cross < 0, 'river triangles wind up-facing');
}

// LOD: park + major in ring; minor needs d <= OSM_GROUND_MINOR_LOD_FRAC*fogFar.
// fogFarSim=1000 -> ring covers all; minor ring 0.5*1000*ws(2)=1000 game m: visible.
// 3 instances expected: road-major, road-minor, park.
{
  let vis = 0;
  for (let i = 0; i < 3; i++) if (batch.getVisibleAt(i)) vis++;
  ok(vis === 3, `all 3 tile instances visible in full ring (got ${vis})`);
}

// Shrink fog so the minor ring excludes the tile but the major ring keeps it.
// Tile rect is (0,0)-(200,200) game; ball inside -> d2=0 -> minor stays. Move
// ball to sim x=300 (game 600): d_game=400. minor ring = 0.5*f*ws; choose
// fogFarSim=300 -> minor 300 < 400 (hidden), main ring 300*1.1*2=660 >= 400 (visible).
ballPos.set(300, 0, 0);
ground.update(1 / 60, ballPos, 300);
{
  let vis = 0;
  for (let i = 0; i < 3; i++) if (batch.getVisibleAt(i)) vis++;
  ok(vis === 2, `minor LOD hides tertiary outside ${OSM_GROUND_MINOR_LOD_FRAC}*fogFar (got ${vis})`);
}

// Out of ring entirely -> all hidden, batch invisible (no draw).
ballPos.set(50000, 0, 50000);
ground.update(1 / 60, ballPos, Math.max(20, LOAD_RADIUS_MIN_M));
ok(batch.visible === false, 'batch hidden when no tile in ring');

/* ---- RESCALE similarity identity ---- */
// A world-space (sim) point of OSM geometry must transform exactly like every
// pool position: simPos' = S * simPos (the one-frame similarity).
ballPos.set(17.5, 0, 12.5);
ground.update(1 / 60, ballPos, 1000);
const probeGame = new THREE.Vector3(100, 0.03, 100); // river vert, game m
const before = probeGame.clone().applyMatrix4(ground.group.matrixWorld ?? new THREE.Matrix4());
ground.group.updateMatrixWorld(true);
before.copy(probeGame).applyMatrix4(ground.group.matrixWorld);

const Sf = 0.2;
PAYLOADS.rescale.S = Sf;
bus.emit(EVT.RESCALE, PAYLOADS.rescale);
scaleMgr.worldScale = scaleMgr.worldScale / Sf; // ScaleManager convention: sim positions *= S
// fogFarSim is a sim length: env recomputes it from the already-scaled
// radius in the same frame (binding step order — env.update before
// osmGround.update), so the post-rescale update sees fog*S. Required for
// the GROUND_LIFT_K depth-lift y term's similarity covariance.
ground.update(1 / 60, ballPos, 1000 * Sf);
ground.group.updateMatrixWorld(true);
const after = probeGame.clone().applyMatrix4(ground.group.matrixWorld);
near(after.x, before.x * Sf, 1e-9, 'RESCALE: sim x scales by exactly S');
near(after.z, before.z * Sf, 1e-9, 'RESCALE: sim z scales by exactly S');
near(after.y, before.y * Sf, 1e-9, 'RESCALE: sim y scales by exactly S');

/* ---- REBASE identity ---- */
PAYLOADS.rebase.sx = 7;
PAYLOADS.rebase.sz = -4;
bus.emit(EVT.REBASE, PAYLOADS.rebase);
ground.update(1 / 60, ballPos, 1000);
ground.group.updateMatrixWorld(true);
const rebased = probeGame.clone().applyMatrix4(ground.group.matrixWorld);
near(rebased.x, after.x - 7, 1e-9, 'REBASE: sim x -= sx');
near(rebased.z, after.z + 4, 1e-9, 'REBASE: sim z -= sz');

/* ---- reset clears the shift ---- */
ground.reset();
ground.group.updateMatrixWorld(true);
const resetP = probeGame.clone().applyMatrix4(ground.group.matrixWorld);
near(resetP.x, after.x, 1e-9, 'reset() clears the origin shift');

/* ---- GAME_RESET self-subscription ---- */
PAYLOADS.rebase.sx = 3;
PAYLOADS.rebase.sz = 0;
bus.emit(EVT.REBASE, PAYLOADS.rebase);
bus.emit(EVT.GAME_RESET, PAYLOADS.gameReset);
near(ground.group.position.x, 0, 1e-9, 'GAME_RESET clears the shift (self-subscribed)');

ground.dispose();
ok(!scene.children.includes(ground.group), 'dispose removes the group');

/* ---- bad magic -> disabled, never throws ---- */
{
  const w2 = { ready: true, failed: false, outerBytes: new Uint8Array(32) };
  const g2 = new OsmGround(scene, scaleMgr, waterMat, w2);
  g2.update(1 / 60, ballPos, 100);
  g2.update(1 / 60, ballPos, 100); // idempotent
  ok(g2.group.children.length === 0, 'bad magic disables the layer quietly');
  g2.dispose();
}

/* ---- failed latch -> permanently inert ---- */
{
  const w3 = { ready: true, failed: true, outerBytes: buildSyntheticOuter() };
  const g3 = new OsmGround(scene, scaleMgr, waterMat, w3);
  g3.update(1 / 60, ballPos, 100);
  ok(g3.group.children.length === 0, 'failed=true keeps the layer empty');
  g3.dispose();
}

/* ---- amortization: <=2 entry builds per frame ---- */
{
  // 5 single-record road sections in 5 different tiles, ball at center.
  const recs = [];
  for (let t = 0; t < 5; t++) {
    recs.push({ tx: t, rec: [[100, 100], [600, 100]] });
  }
  const parts = [];
  const payloads = [];
  let off5 = 16 + 5 * 16;
  const head = new Uint8Array(16 + 5 * 16);
  const hdv = new DataView(head.buffer);
  hdv.setUint32(0, 0x34544b46, true);
  hdv.setUint16(4, 1, true);
  hdv.setUint16(6, 5, true);
  for (let t = 0; t < 5; t++) {
    const b = new Uint8Array(8 + 4);
    const dv = new DataView(b.buffer);
    dv.setUint8(0, (2 & 7) | (2 << 3));
    dv.setUint8(1, 20);
    dv.setUint16(4, 100, true);
    dv.setUint16(6, 100, true);
    dv.setInt16(8, 500, true);
    dv.setInt16(10, 0, true);
    payloads.push(b);
    const o = 16 + t * 16;
    hdv.setUint8(o, 3);
    hdv.setInt16(o + 2, t, true);
    hdv.setInt16(o + 4, 0, true);
    hdv.setUint16(o + 6, 1, true);
    hdv.setUint32(o + 8, off5, true);
    hdv.setUint32(o + 12, b.length, true);
    off5 += b.length;
  }
  parts.push(head, ...payloads);
  const n = parts.reduce((s, a) => s + a.length, 0);
  const bin5 = new Uint8Array(n);
  let o5 = 0;
  for (const a of parts) {
    bin5.set(a, o5);
    o5 += a.length;
  }
  const w4 = { ready: true, failed: false, outerBytes: bin5 };
  const sm4 = { worldScale: 1 };
  const g4 = new OsmGround(scene, sm4, waterMat, w4);
  const bp = new THREE.Vector3(500, 0, 100);
  g4.update(1 / 60, bp, 100000);
  const b4 = g4.group.children.find((c) => c.isBatchedMesh);
  ok(b4 && b4.instanceCount === undefined ? true : true, 'noop'); // keep linter calm
  let built1 = 0;
  for (let i = 0; i < 5; i++) {
    try {
      if (b4.getVisibleAt(i)) built1++;
    } catch {
      /* instance not yet added */
    }
  }
  ok(built1 === 2, `first frame builds exactly 2 tiles (got ${built1})`);
  g4.update(1 / 60, bp, 100000);
  g4.update(1 / 60, bp, 100000);
  let built3 = 0;
  for (let i = 0; i < 5; i++) {
    try {
      if (b4.getVisibleAt(i)) built3++;
    } catch {
      /* not added yet */
    }
  }
  ok(built3 === 5, `3 frames build all 5 tiles, 2/frame nearest-first (got ${built3})`);
  g4.dispose();
}

/* ---- park y-offset / road y-offset spot check via built batch ---- */
ok(OSM_GROUND_Y_PARK < 0.03 && 0.03 < OSM_GROUND_Y_MAJOR, 'layer order parks < water < major roads');

/* ================================================================== */
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
