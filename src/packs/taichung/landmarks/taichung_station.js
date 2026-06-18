/**
 * @file packs/taichung/landmarks/taichung_station.js — Roll Formosa Taichung pack, landmark 0.
 *
 * 台中車站 (old Taichung Station, 1917) — the Baroque red-brick terminal, a
 * national historic monument. Silhouette: a BROAD, low, strictly SYMMETRICAL
 * red-brick station body (brick red) laced with white horizontal stone bands
 * and pierced by a rhythm of arched windows; over the central entrance a white
 * triangular PEDIMENT (gable); and rising from the centre a square brick CLOCK
 * TOWER carrying a clock face on each side, crowned by a dark copper-green
 * DOME with a small lantern + finial. Wide brick body + central gable + square
 * tower + green dome is the entire read.
 *
 * Built with ONLY the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so PROPORTIONS carry the read: body much wider
 * than tall, then a slim square tower whose green dome owns the top. Square
 * cross-sections come from cyl(...) with seg=4 rotated PI/4 so flat faces point
 * at the axes; arched window heads are half-cylinders (thetaLen=PI). rng() is
 * used only for a hair of dome-finial jitter — never for structure. <= 600 tris.
 *
 * Palette: warm brick red body, white stone string-bands/cornices/pediment,
 * dark recessed arched windows, and the signature copper-green oxidized dome.
 */

import { box, cyl, cone, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// ---- palette ----------------------------------------------------------------
const BRICK = 0xa6432f; // warm Baroque brick red (body read color)
const BRICK_L = 0xbb5238; // sunlit brick (toward the top of walls)
const BRICK_D = 0x83351f; // shadowed brick (plinth / recesses)
const STONE = 0xeae3d2; // white-cream dressed stone (bands / cornice / pediment)
const STONE_L = 0xf4eee0; // sunlit stone highlight
const STONE_D = 0xcfc6b0; // shadowed stone underside
const WIN = 0x2a2622; // dark recessed window glass / arch void
const DOME = 0x4a7a5a; // oxidized copper-green dome (the hero green)
const DOME_L = 0x6fa080; // lit dome highlight
const DOME_D = 0x355c43; // dome shadow / underside
const CLOCK = 0xf2ecdc; // pale clock face
const GOLD = 0xc9a24a; // finial / clock-hand gilt

export const NM_TAICHUNG_STATION = {
  id: 'taichung_station',
  name: '台中車站',
  landmarkId: 0,
  dioramaRHint: 25, // ~60 m wide brick terminal, tower ~30 m (integration may rescale)
  colorHex: BRICK,

  buildGeometry(rng) {
    const FACE = PI / 4; // orient square (seg=4) cross-sections to the axes
    const parts = [];

    // Authored footprint: body ~5.0 wide x ~1.5 tall x ~1.9 deep — emphatically
    // a wide civic terminal, never a tower. Front face is +Z.
    const bodyW = 5.0;
    const bodyH = 1.5;
    const bodyD = 1.9;
    const frontZ = bodyD / 2;

    // === STONE PLINTH ========================================================
    // Low dressed-stone base, slightly broader than the brick so it "sits".
    parts.push(box(bodyW + 0.3, 0.22, bodyD + 0.3, STONE_D, { y: 0.11, hex2: STONE }));
    parts.push(box(bodyW + 0.12, 0.16, bodyD + 0.12, BRICK_D, { y: 0.3, hex2: BRICK })); // brick base course

    // === MAIN BRICK BODY (broad two-storey block) ============================
    const bodyY = 0.38 + bodyH / 2;
    parts.push(box(bodyW, bodyH, bodyD, BRICK, { y: bodyY, hex2: BRICK_L }));

    // White horizontal stone string-band — the signature brick-and-white lacing
    // (one strong mid-floor band; the cornice below the roofline gives the upper).
    parts.push(box(bodyW + 0.06, 0.12, bodyD + 0.06, STONE, { y: 0.38 + bodyH * 0.46, hex2: STONE_L })); // mid floor band
    // Top stone cornice + parapet capping the body.
    parts.push(box(bodyW + 0.1, 0.14, bodyD + 0.1, STONE_L, { y: 0.38 + bodyH + 0.02, hex2: STONE })); // cornice
    parts.push(box(bodyW + 0.04, 0.12, bodyD + 0.04, STONE_D, { y: 0.38 + bodyH + 0.14 })); // low parapet

    // === SYMMETRICAL WING END PAVILIONS ======================================
    // The two ends step up a touch and carry their own little cornices — the
    // tripartite Baroque rhythm (centre + two wings) seen straight-on.
    for (const sx of [-1, 1]) {
      const wx = sx * (bodyW / 2 - 0.45);
      parts.push(box(0.9, bodyH + 0.34, bodyD + 0.16, BRICK_L, { x: wx, y: 0.38 + (bodyH + 0.34) / 2, hex2: BRICK })); // raised end pavilion
      parts.push(box(1.02, 0.16, bodyD + 0.28, STONE_L, { x: wx, y: 0.38 + bodyH + 0.38, hex2: STONE })); // pavilion cornice + cap (single course)
    }

    // === ARCHED WINDOWS (front +Z) ===========================================
    // Tall arched bays across the lower storey: a dark recessed box (the void)
    // + a white stone archivolt half-ring + a half-cylinder arch head, repeated
    // symmetrically. Cheap per-bay read of the Baroque arcade.
    const arch = (cx, z, r, h, depth) => {
      // recessed dark void body
      parts.push(box(r * 2.0, h, depth, WIN, { x: cx, y: 0.5 + h / 2, z: z - 0.04 }));
      // half-cylinder arched head (rounded top), dark void — low seg keeps cost down
      parts.push(cyl(r, r, depth, 5, WIN, { rx: HALF_PI, thetaLen: PI, open: true, x: cx, y: 0.5 + h, z: z - 0.04 }));
      // white stone archivolt half-ring framing the arch head — one cheap open
      // half-cyl reads as the white Baroque arch surround (replaces 2 jamb boxes)
      parts.push(cyl(r + 0.06, r + 0.06, depth * 0.7, 5, STONE, { rx: HALF_PI, thetaLen: PI, open: true, x: cx, y: 0.5 + h, z: z + 0.02 }));
    };
    // Four symmetrical arched bays flanking the central entrance (front).
    const bayR = 0.2;
    const bayH = 0.5;
    for (const sx of [-1, 1]) {
      arch(sx * 0.85, frontZ + 0.01, bayR, bayH, 0.14);
      arch(sx * 1.6, frontZ + 0.01, bayR, bayH, 0.14);
    }
    // Upper-storey small square windows over the inner bays (front). The white
    // string-band already runs under them, so no separate lintel is needed.
    for (const sx of [-1, 1]) {
      parts.push(box(0.26, 0.3, 0.08, WIN, { x: sx * 0.85, y: 0.38 + bodyH * 0.78, z: frontZ + 0.02 }));
    }
    // Rear (−Z): a single recessed window band so the back is not blank (cheap).
    parts.push(box(bodyW - 1.4, bodyH - 0.6, 0.06, WIN, { y: bodyY + 0.05, z: -(bodyD / 2 + 0.01) }));

    // === CENTRAL ENTRANCE + TRIANGULAR PEDIMENT ==============================
    // A slightly proud central porch bay with a big arched doorway, crowned by
    // the white triangular gable (pediment) — the centrepiece under the tower.
    const porchW = 1.4;
    const porchH = bodyH + 0.2;
    parts.push(box(porchW, porchH, 0.22, BRICK_L, { y: 0.38 + porchH / 2, z: frontZ + 0.06, hex2: BRICK })); // proud porch face
    // Big central arched doorway (dark void + stone archivolt).
    parts.push(box(0.66, 0.9, 0.2, WIN, { y: 0.5 + 0.45, z: frontZ + 0.14 }));
    parts.push(cyl(0.33, 0.33, 0.2, 6, WIN, { rx: HALF_PI, thetaLen: PI, open: true, y: 0.5 + 0.9, z: frontZ + 0.14 }));
    parts.push(cyl(0.43, 0.43, 0.14, 6, STONE, { rx: HALF_PI, thetaLen: PI, open: true, y: 0.5 + 0.9, z: frontZ + 0.2 }));
    parts.push(box(0.1, 0.92, 0.14, STONE, { x: -0.4, y: 0.5 + 0.46, z: frontZ + 0.2 })); // door jamb L
    parts.push(box(0.1, 0.92, 0.14, STONE, { x: 0.4, y: 0.5 + 0.46, z: frontZ + 0.2 })); // door jamb R

    // Pediment: a low triangular gable. cyl(seg=3) lying on its side gives a
    // clean triangular prism cross-section facing the viewer; cap its base with
    // a white horizontal cornice (the classic pediment entablature).
    const pedY = 0.38 + porchH + 0.08;
    parts.push(box(porchW + 0.2, 0.14, 0.34, STONE_L, { y: pedY, z: frontZ + 0.04, hex2: STONE })); // pediment base cornice
    parts.push(
      cyl(0.42, 0.42, 0.32, 3, STONE, {
        rx: HALF_PI, // lay the triangular prism on its side
        ry: 0, // flat base down, apex up
        rz: 0,
        sx: (porchW + 0.16) / (0.42 * 1.5), // stretch to porch width
        sy: 0.55, // flatten to a shallow Baroque gable
        y: pedY + 0.13,
        z: frontZ + 0.04,
        hex2: STONE_L,
      })
    );

    // === SQUARE CLOCK TOWER ==================================================
    // A slim square brick tower rising from the centre, above the pediment.
    // Square cross-section via cyl(seg=4, ry=PI/4) so flat faces front the axes.
    const towW = 0.62; // half-diagonal-ish; tuned so the square reads ~0.86 wide
    const towBaseY = 0.38 + bodyH + 0.18;
    const towH = 1.7;
    // Tower body (brick, lit toward top).
    parts.push(cyl(towW, towW, towH, 4, BRICK, { ry: FACE, y: towBaseY + towH / 2, hex2: BRICK_L }));
    // White stone bands wrapping the tower (Baroque articulation), one low, one
    // high, framing the clock zone between them.
    for (const by of [0.22, 0.74]) {
      parts.push(cyl(towW + 0.04, towW + 0.04, 0.1, 4, STONE, { ry: FACE, y: towBaseY + towH * by, hex2: STONE_L }));
    }
    // Tower-top cornice (white), broader, the dome springs from it (single
    // course doubling as the dome seat).
    const towTopY = towBaseY + towH;
    parts.push(cyl(towW + 0.04, towW + 0.13, 0.22, 4, STONE_L, { ry: FACE, y: towTopY + 0.1, hex2: STONE }));

    // Clock faces on all four sides near the top of the tower body — one pale
    // round dial per face, set proud of the brick (the clock-tower read). A
    // single low-seg disc per face keeps the four-faced clock cheap.
    const clockY = towBaseY + towH * 0.86;
    for (const a of [0, HALF_PI, PI, -HALF_PI]) {
      const nx = Math.sin(a); // outward face normal (unit)
      const nz = Math.cos(a);
      // a small square pale panel proud of each brick face reads as a clock dial
      // on the four-faced tower for the cost of one box per face
      parts.push(box(0.34, 0.34, 0.06, CLOCK, { ry: a, x: nx * towW * 0.93, y: clockY, z: nz * towW * 0.93, hex2: GOLD }));
    }

    // === COPPER-GREEN DOME (the visual hero) =================================
    // A bulbous oxidized-copper dome capping the square tower — the unmistakable
    // crown of the old station. Hemispheric body + a small lantern + finial.
    const domeR = towW + 0.16;
    const domeBaseY = towTopY + 0.2;
    // Main dome — a low hemisphere (slightly squashed for the squat copper look)
    // springing straight off the white tower cornice. Gradient lit-lower (DOME_L)
    // → shadowed-apex (DOME_D) gives the rounded copper read in one shell, so no
    // extra drum or crown re-skin is needed.
    parts.push(sph(domeR, DOME_L, { ws: 8, hs: 4, theta0: 0, thetaLen: HALF_PI, sy: 1.22, y: domeBaseY + 0.04, hex2: DOME_D }));

    // Small lantern + finial crowning the dome.
    const j = (rng() - 0.5) * 0.015; // tiny finial jitter (variation only)
    const lanternY = domeBaseY + domeR * 1.08;
    parts.push(cyl(domeR * 0.3, domeR * 0.38, 0.2, 5, DOME_L, { y: lanternY + 0.1, hex2: DOME })); // lantern drum (the small cupola the finial rises from)
    parts.push(cyl(0.03, 0.055, 0.28, 4, GOLD, { y: lanternY + 0.44 + j })); // finial mast + gilt orb folded into a tapered post
    parts.push(cone(0.045, 0.16, 5, GOLD, { y: lanternY + 0.66 + j })); // weather-vane spike crowning the station

    return finish(parts);
  },
};

export default NM_TAICHUNG_STATION;
