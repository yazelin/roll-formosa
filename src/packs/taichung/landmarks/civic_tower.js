/**
 * @file packs/taichung/landmarks/civic_tower.js — Roll Formosa Taichung landmark.
 *
 * NM_CIVIC_TOWER — 七期市政大樓 (台中市政府新市政大樓, Xitun 7th Redevelopment Zone).
 * Silhouette: two INTERLOCKING blue-glass slab volumes — one TALL, one LOWER —
 * that cross/offset each other, each stepping back (層層退縮) toward its top, all
 * springing from one WIDE, LOW podium (裙樓). Clean modern office geometry: every
 * volume is a wide rectangular slab (wider than deep) wearing a horizontal glass
 * curtain wall, with thin dark transom cornices marking each setback. The two
 * towers sit slightly apart along X and the lower one is pushed forward in Z so
 * from 3/4 view they read as two distinct masses sliding past one another.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); finish()
 * merges → recenters → normalizes to a UNIT bounding sphere, so proportions
 * (not absolute size) carry the silhouette. <= 600 triangles (hero budget).
 */

import { box, towerBanded, finish } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

const GLASS_LO = 0x3f6f9a; // blue curtain glass (lower floors, in shadow)
const GLASS_HI = 0x6fa8d0; // brighter sky-blue glass (upper floors, catching light)
const WIN = 0x2c5070; // recessed window band between floor slabs
const LIT = 0xbfe2ff; // a few lit-up floor bands
const MULLION = 0x1d2e3e; // dark steel transom / setback cornice
const PODIUM_LO = 0x33536e; // podium glass base (shadow)
const PODIUM_HI = 0x5a8bb4; // podium glass base (light)
const PLINTH = 0x222c36; // ground plinth slab

export const NM_CIVIC_TOWER = {
  id: 'civic_tower',
  name: '七期市政大樓',
  landmarkId: 4,
  dioramaRHint: 60, // modern glass office block, ~60 m to the tall volume's crown
  colorHex: GLASS_HI,

  buildGeometry(rng) {
    const parts = [];

    // ---- 1) Wide low podium / 裙樓 ----------------------------------------
    // A broad shallow base both volumes share; banded glass with a dark cornice
    // lip and a ground plinth a touch wider than the glazing.
    parts.push(box(2.4, 0.14, 1.7, PLINTH, { y: 0.07 })); // ground plinth slab
    parts.push(
      towerBanded(2.1, 0.62, 1.45, 3, PODIUM_LO, WIN, LIT, rng, {
        y: 0.45, hex2: PODIUM_HI,
      }) // podium curtain wall (2 storeys of retail/lobby glass)
    );
    parts.push(box(2.18, 0.07, 1.52, MULLION, { y: 0.8 })); // podium cornice lip
    const podTop = 0.83; // y where the towers spring from the podium

    // ---- 2) TALL volume — wide slab, two setbacks toward the top ----------
    // Pushed to the -X side and set back in -Z so it sits behind/beside the
    // lower mass. Slab is wider (X) than deep (Z) — a reading office floorplate.
    const tx = -0.42; // tall volume X offset
    const tz = -0.18; // tall volume Z offset (pushed back)
    // base section (tallest, fullest plate)
    let y = podTop;
    let h = 1.85;
    parts.push(
      towerBanded(1.18, h, 0.92, 9, GLASS_LO, WIN, LIT, rng, {
        x: tx, z: tz, y: y + h / 2, hex2: GLASS_HI,
      }) // tall volume — main shaft
    );
    parts.push(box(1.22, 0.06, 0.96, MULLION, { x: tx, z: tz, y: y + h })); // setback cornice
    y += h;
    // first setback (narrower, stepped in on the +X face)
    h = 1.15;
    parts.push(
      towerBanded(0.92, h, 0.82, 6, GLASS_LO, WIN, LIT, rng, {
        x: tx - 0.1, z: tz, y: y + h / 2, hex2: GLASS_HI,
      }) // tall volume — first setback
    );
    parts.push(box(0.96, 0.06, 0.86, MULLION, { x: tx - 0.1, z: tz, y: y + h })); // setback cornice
    y += h;
    // crown section (slimmest cap) + thin parapet
    h = 0.6;
    parts.push(
      towerBanded(0.66, h, 0.7, 3, GLASS_LO, WIN, LIT, rng, {
        x: tx - 0.18, z: tz, y: y + h / 2, hex2: GLASS_HI,
      }) // tall volume — crown
    );
    parts.push(box(0.7, 0.08, 0.74, MULLION, { x: tx - 0.18, z: tz, y: y + h + 0.02 })); // crown parapet
    // rooftop mechanical box (clean modern penthouse)
    parts.push(box(0.34, 0.16, 0.4, 0x9aa6b0, { x: tx - 0.18, z: tz, y: y + h + 0.13 })); // rooftop plant

    // ---- 3) LOWER volume — wider/squatter slab, one setback ---------------
    // Pushed to the +X side and forward in +Z so it overlaps & crosses the tall
    // mass; deliberately broader and lower so the two volumes interlock.
    const lx = 0.5; // lower volume X offset
    const lz = 0.3; // lower volume Z offset (pushed forward, crossing)
    let ly = podTop;
    let lh = 1.5;
    parts.push(
      towerBanded(1.1, lh, 1.0, 7, GLASS_LO, WIN, LIT, rng, {
        x: lx, z: lz, y: ly + lh / 2, hex2: GLASS_HI,
      }) // lower volume — main mass
    );
    parts.push(box(1.14, 0.06, 1.04, MULLION, { x: lx, z: lz, y: ly + lh })); // setback cornice
    ly += lh;
    // single stepped-back upper section
    lh = 0.78;
    parts.push(
      towerBanded(0.82, lh, 0.82, 4, GLASS_LO, WIN, LIT, rng, {
        x: lx + 0.1, z: lz, y: ly + lh / 2, hex2: GLASS_HI,
      }) // lower volume — upper setback
    );
    parts.push(box(0.86, 0.08, 0.86, MULLION, { x: lx + 0.1, z: lz, y: ly + lh + 0.02 })); // upper parapet
    parts.push(box(0.3, 0.14, 0.3, 0x9aa6b0, { x: lx + 0.1, z: lz, y: ly + lh + 0.12 })); // rooftop plant

    // ---- 4) Interlock seam — a slim vertical glazed link between volumes ---
    // A thin tall pane in the gap where the two slabs slide past each other,
    // reinforcing the "two crossing volumes" read from a 3/4 view.
    parts.push(
      towerBanded(0.22, 2.4, 0.6, 9, MULLION, WIN, LIT, rng, {
        x: 0.04, z: 0.08, y: podTop + 1.2, hex2: GLASS_HI,
      }) // glazed connector spine
    );

    return finish(parts);
  },
};

export default NM_CIVIC_TOWER;
