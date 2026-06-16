/**
 * @file packs/kaohsiung/landmarks/takao_railway.js — Roll Formosa Kaohsiung pack.
 *
 * 舊打狗驛 (Old Takao Station / Takao Railway Museum, 哈瑪星 Hamasen, 鼓山 Gushan).
 * A curated hero geometry: a low, single-storey Japanese-colonial WOODEN railway
 * station — a long timber hall under a shallow hipped tile roof, with a small
 * gabled entrance porch out front — standing beside a railway PLATFORM sheltered by
 * a slim open-sided canopy (月台雨棚) on a row of posts. A short stub of track and a
 * couple of tiny signals read it unmistakably as the old Hamasen terminus.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is an
 * engine red line. finish() merges → recenters → normalizes to a UNIT bounding
 * sphere (radius 1), so this is authored in unit-ish space with correct PROPORTIONS
 * (a long LOW building hugging the ground beside a flat sheltered platform — NOT a
 * tall tower). The integration step owns the size-ladder; dioramaRHint is the
 * real-world footprint hint. <= 600 triangles (hero budget).
 */

import { box, cyl, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Palette — Hamasen wooden station materials (日式木造 timber + tile).
const PLINTH = 0x9a9384; // concrete / stone plinth the station sits on
const WOOD = 0xb38a52; // 木造 warm timber plank wall (body)
const WOOD_D = 0x8a6638; // shadowed lower course of the timber wall
const TRIM = 0xe7ddc9; // pale window / door frame + sill trim
const TILE = 0x6e5b46; // 屋瓦 weathered grey-brown hipped tile roof
const TILE_D = 0x4f3f30; // deep eave-shadow under the roof
const RIDGE = 0x3d3127; // dark roof ridge cap line
const PLAT = 0xb8b0a0; // 月台 pale concrete platform deck
const CANOPY = 0x55504a; // 雨棚 dark steel platform-canopy roof
const POST = 0x736c62; // canopy support posts
const RAIL = 0x55504c; // steel rail / track furniture
const SLEEP = 0x6f5a40; // wooden track sleepers
const GLASS = 0x35506a; // dark window glazing

// Square cross-sections come from cyl(seg=4) rotated PI/8 to read as chamfered.
const Q = HALF_PI / 4; // PI/8

/**
 * Author one row of platform-canopy posts + the canopy slab over them.
 * @param {THREE.BufferGeometry[]} out
 * @param {number} px  platform center x
 * @param {number} topY  platform deck top height
 */
function platformCanopy(out, px, topY) {
  const len = 1.9; // canopy run along z
  const postH = 0.34;
  // Slim posts in a back + front row (square section, cheap).
  for (const sz of [-0.18, 0.18]) {
    for (let i = -1; i <= 1; i++) {
      out.push(box(0.03, postH, 0.03, POST, { x: px + sz, y: topY + postH / 2, z: i * (len / 2.5) }));
    }
  }
  // Flat shallow canopy roof (slight forward pitch baked as gradient).
  out.push(box(0.5, 0.04, len + 0.18, CANOPY, { x: px, y: topY + postH + 0.02, z: 0, hex2: TILE_D }));
  // Thin fascia drip edge along the front.
  out.push(box(0.52, 0.05, 0.03, RIDGE, { x: px, y: topY + postH, z: len / 2 + 0.09 }));
}

export const NM_TAKAO_RAILWAY = {
  id: 'takao_railway_museum',
  name: '舊打狗驛',
  landmarkId: 0,
  dioramaRHint: 35, // ~ old Hamasen station + platform footprint radius in metres
  colorHex: 0xa88450, // the station's signature warm timber wood tone
  buildGeometry(rng) {
    const j = (rng() - 0.5) * 0.02; // tiny non-structural jitter on track furniture
    const parts = [];

    // ---- Ground plinth slab the whole diorama sits on --------------------
    parts.push(box(2.7, 0.1, 2.3, PLINTH, { y: 0.05, hex2: 0x807a6c }));

    // ---- Station building (long LOW timber hall) -------------------------
    const bx = -0.55; // building center x (sits to one side; platform on the other)
    const bw = 0.55; // body width (x)
    const bl = 1.7; // body length (z) — long hall
    const wallH = 0.46; // single-storey wall height
    const by = 0.1; // plinth top
    const wallTop = by + wallH;

    // Timber plank wall body (木造), darker shadowed lower course via gradient.
    parts.push(box(bw, wallH, bl, WOOD, { x: bx, y: by + wallH / 2, hex2: WOOD_D }));
    // Pale base sill course running around the foot of the walls.
    parts.push(box(bw + 0.04, 0.06, bl + 0.04, TRIM, { x: bx, y: by + 0.03 }));

    // Rows of tall framed windows + door down the platform-facing long wall.
    const wz0 = -bl / 2 + 0.22;
    for (let i = 0; i < 6; i++) {
      const wz = wz0 + i * 0.27;
      // window frame (pale trim) flush to platform side (+x face of building)
      parts.push(box(0.04, 0.26, 0.16, TRIM, { x: bx + bw / 2, y: by + 0.26, z: wz }));
      // dark glazing recessed in the frame
      parts.push(box(0.02, 0.2, 0.11, GLASS, { x: bx + bw / 2 + 0.012, y: by + 0.26, z: wz }));
    }
    // Single door on the street-facing long wall (-x face).
    parts.push(box(0.04, 0.34, 0.18, TRIM, { x: bx - bw / 2, y: by + 0.17, z: 0.15 }));
    parts.push(box(0.02, 0.28, 0.13, WOOD_D, { x: bx - bw / 2 - 0.012, y: by + 0.16, z: 0.15 }));

    // Shallow hipped tile roof: a wide flat-topped pyramid (cyl seg=4 frustum)
    // gives the four-sided hip; a low ridge cap sits on top.
    const eaveOver = 0.12; // roof overhangs the walls
    parts.push(
      cyl(0.16, Math.max(bw, bl) * 0.62, 0.2, 4, TILE, {
        ry: Q,
        x: bx,
        y: wallTop + 0.1,
        sx: ((bw + eaveOver) / (bl + eaveOver)),
        hex2: TILE_D,
      })
    );
    // Long ridge cap line along the top of the hip.
    parts.push(box(0.05, 0.04, bl * 0.5, RIDGE, { x: bx, y: wallTop + 0.2 }));
    // Wide eave fascia boards front + back to read the deep overhang.
    parts.push(box(bw + eaveOver * 2, 0.04, 0.04, TILE_D, { x: bx, y: wallTop + 0.015, z: bl / 2 + eaveOver }));
    parts.push(box(bw + eaveOver * 2, 0.04, 0.04, TILE_D, { x: bx, y: wallTop + 0.015, z: -bl / 2 - eaveOver }));

    // Small gabled entrance porch projecting off the street side.
    const porchZ = -0.15;
    parts.push(box(0.22, 0.3, 0.3, WOOD, { x: bx - bw / 2 - 0.11, y: by + 0.15, z: porchZ, hex2: WOOD_D }));
    // Little gable roof over the porch (triangular prism via cyl seg=3).
    parts.push(cyl(0.001, 0.2, 0.34, 3, TILE, { rx: HALF_PI, ry: PI, x: bx - bw / 2 - 0.11, y: by + 0.34, z: porchZ, hex2: TILE_D }));

    // ---- Railway platform + sheltered canopy (月台 + 雨棚) ----------------
    const px = 0.55; // platform center x (opposite side from street)
    const platTop = by + 0.06;
    parts.push(box(0.7, 0.12, 2.0, PLAT, { x: px, y: by + 0.06, hex2: 0xa39b8b }));
    // platform edge nosing strip (warning line).
    parts.push(box(0.04, 0.13, 2.0, TRIM, { x: px + 0.35, y: by + 0.065 }));
    platformCanopy(parts, px, platTop);

    // ---- Short stub of track beyond the platform -------------------------
    const tx = px + 0.55; // track center x, just off the platform edge
    for (const sx of [-0.05, 0.05]) {
      parts.push(box(0.02, 0.03, 2.0, RAIL, { x: tx + sx + j, y: by + 0.025 })); // two rails
    }
    for (let i = -3; i <= 3; i++) {
      parts.push(box(0.22, 0.025, 0.05, SLEEP, { x: tx, y: by + 0.012, z: i * 0.28 })); // sleepers
    }
    // A small dark signal post at the track end.
    parts.push(cyl(0.012, 0.012, 0.3, 4, RAIL, { x: tx + 0.12, y: by + 0.15, z: -0.85 }));
    parts.push(box(0.05, 0.07, 0.02, 0x9a2a22, { x: tx + 0.12, y: by + 0.29, z: -0.83 })); // red signal blade

    return finish(parts);
  },
};

export default NM_TAKAO_RAILWAY;
