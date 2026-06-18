/**
 * @file packs/taichung/landmarks/prefectural_hall.js — Roll Formosa Taichung pack.
 *
 * 台中州廳 (Taichung Prefectural Hall, 1913, 森山松之助) — the Japanese-colonial
 * Western-Baroque officialdom, a national historic monument. Silhouette: a LOW,
 * broad, strictly SYMMETRICAL two-storey PALE-CREAM masonry官署 — a round-arched
 * ground-floor ARCADE under a paired-column second-floor COLONNADE, laced with
 * white horizontal string-bands; a slightly PROUD central entrance pavilion
 * crowned by a triangular PEDIMENT; and rising over the centre a square pavilion
 * carrying a steep dark slate MANSARD roof topped by a small CUPOLA dome with a
 * finial. The two ends step forward as matching wing pavilions with their own
 * little mansard caps. Wide cream Baroque body + central domed mansard pavilion +
 * symmetrical wings is the whole read (總統府氣質 but矮、淺、寬).
 *
 * Built with ONLY the engine geometry vocabulary (geomHelpers.js); the math is an
 * engine red line. finish() merges → recenters → normalizes to a UNIT bounding
 * sphere (radius 1), so PROPORTIONS carry the read: body emphatically wider than
 * tall, central pavilion+dome owning the top, never a tower. Square cross-sections
 * come from cyl(seg=4, ry=PI/4); arched heads are open half-cylinders (thetaLen=PI);
 * the mansard is a steep cone(seg=4). rng() only jitters the finial — never
 * structure. <= 600 triangles.
 *
 * Palette: pale cream / light-yellow洗石子 body, white dressed-stone bands &
 * columns, dark recessed arched openings, and the dark blue-grey slate mansard
 * roof with a pale verdigris cupola.
 */

import { box, cyl, cone, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

// ---- palette ----------------------------------------------------------------
const CREAM = 0xe8e0cc; // pale cream / light-yellow body (the read color)
const CREAM_L = 0xf3ecda; // sunlit upper wall / lit stone
const CREAM_D = 0xcec5ab; // shadowed plinth / recess
const STONE = 0xf4efe2; // white dressed stone (bands, columns, pediment)
const STONE_L = 0xfbf8ef; // sunlit white stone highlight
const STONE_D = 0xd9d0bb; // shadowed stone underside
const WIN = 0x32302b; // dark recessed window / arch void
const ROOF = 0x42505c; // dark slate-grey mansard roof (steep dark cap)
const ROOF_L = 0x5d6c79; // lit mansard slope
const ROOF_D = 0x2f3a44; // mansard shadow / ridge
const DOME = 0x7fa394; // pale verdigris cupola dome
const DOME_D = 0x577567; // cupola shadow
const GOLD = 0xc9a24a; // finial gilt

export const NM_PREFECTURAL_HALL = {
  id: 'prefectural_hall',
  name: '台中州廳',
  dioramaRHint: 15, // low ~two-storey官廳 block, central pavilion ~modest (rescaled)
  colorHex: CREAM,

  buildGeometry(rng) {
    const FACE = PI / 4; // orient square (seg=4) cross-sections to the axes
    const parts = [];

    // Authored footprint: body ~5.0 wide x ~1.45 tall x ~1.9 deep — emphatically
    // a wide, low官署, never a tower. Front (entrance) face is +Z.
    const bodyW = 5.0;
    const bodyH = 1.45;
    const bodyD = 1.9;
    const frontZ = bodyD / 2;

    // === STONE PLINTH ========================================================
    // Low dressed base, slightly broader than the body so it "sits". One graded
    // box (stone→cream) is enough; it doubles as plinth + cream base course.
    parts.push(box(bodyW + 0.2, 0.34, bodyD + 0.2, STONE_D, { y: 0.18, hex2: CREAM }));

    // === MAIN CREAM BODY (broad two-storey block) ============================
    const baseY = 0.36; // top of plinth
    const bodyY = baseY + bodyH / 2;
    parts.push(box(bodyW, bodyH, bodyD, CREAM, { y: bodyY, hex2: CREAM_L }));

    // White horizontal string-bands: a strong floor band between the two storeys
    // (over the arcade) + a top cornice — the Baroque white lacing on cream.
    const floorBandY = baseY + bodyH * 0.5; // between ground arcade & upper colonnade
    parts.push(box(bodyW + 0.06, 0.12, bodyD + 0.06, STONE, { y: floorBandY, hex2: STONE_L }));
    // top cornice caps the body (the central pavilion springs straight off it —
    // no separate parapet course needed).
    parts.push(box(bodyW + 0.1, 0.16, bodyD + 0.1, STONE_L, { y: baseY + bodyH + 0.04, hex2: STONE_D }));

    // === GROUND-FLOOR ARCADE (round arches, front +Z) ========================
    // A rhythm of recessed round-arched bays across the lower storey: dark void +
    // white half-ring archivolt + white pier between bays. Mirrored about centre,
    // skipping the centre (the entrance pavilion sits there).
    const arcBottom = baseY + 0.04; // springs just above the plinth
    const arcH = bodyH * 0.5 - 0.14; // arch shaft height up to the floor band
    // One long recessed dark band gives the arcade shadow cheaply; the white
    // piers + half-cyl arch heads on top of it read as the round-arched bays.
    parts.push(box(3.9, arcH + 0.04, 0.1, WIN, { y: arcBottom + (arcH + 0.04) / 2, z: frontZ - 0.05 }));
    const arch = (cx, r, depth) => {
      // dark half-cylinder arch head (rounded top of the bay)
      parts.push(cyl(r, r, depth, 4, WIN, { rx: HALF_PI, thetaLen: PI, open: true, x: cx, y: arcBottom + arcH, z: frontZ - 0.04 }));
    };
    const arcR = 0.2;
    // round-arched heads on the inner bays (nearest the entrance) carry the
    // arcade's round-arch read; the outer bays read via the white piers + band.
    for (const sx of [-1, 1]) {
      arch(sx * 0.78, arcR, 0.12);
    }
    // white piers between the arcade bays (the masonry between arches) — these
    // give the white-on-cream lacing the dropped archivolts would have.
    for (const px of [-1.98, -1.18, -0.4, 0.4, 1.18, 1.98]) {
      parts.push(box(0.13, arcH + 0.16, 0.06, STONE, { x: px, y: arcBottom + (arcH + 0.16) / 2, z: frontZ + 0.01, hex2: STONE_L }));
    }

    // === SECOND-FLOOR COLONNADE (paired columns + windows, front +Z) =========
    // Over the arcade: tall windows in the cream wall with slim white columns set
    // proud between them — the classical upper order. Open low-seg cylinders keep
    // the colonnade cheap; the floor band below + top cornice above frame it.
    const colBottom = floorBandY + 0.08;
    const colH = baseY + bodyH - colBottom - 0.16;
    // one long recessed dark band = the upper-storey window run (cheap)
    parts.push(box(3.9, colH - 0.04, 0.06, WIN, { y: colBottom + colH / 2, z: frontZ }));
    // slim white square pilasters (seg4 open — no caps needed against the wall)
    // proud of the band, articulating the colonnade order.
    for (const cx of [-1.96, -1.18, -0.4, 0.4, 1.18, 1.96]) {
      parts.push(cyl(0.07, 0.075, colH, 4, STONE_L, { open: true, ry: FACE, x: cx, y: colBottom + colH / 2, z: frontZ + 0.05, hex2: STONE }));
    }

    // Rear (−Z): a single recessed window band so the back is not blank (cheap).
    parts.push(box(bodyW - 1.4, bodyH - 0.5, 0.06, WIN, { y: bodyY + 0.04, z: -(bodyD / 2 + 0.01) }));

    // === SYMMETRICAL WING END PAVILIONS ======================================
    // The two ends step FORWARD and up a touch as matching pavilions, each capped
    // by its own small dark mansard — the tripartite Baroque massing (centre +
    // two wings) read straight-on.
    const wingW = 0.92;
    const wingH = bodyH + 0.28;
    const wingHalf = 0.5; // mansard rise
    for (const sx of [-1, 1]) {
      const wx = sx * (bodyW / 2 - 0.42);
      // raised pavilion block, projecting forward
      parts.push(box(wingW, wingH, bodyD + 0.22, CREAM_L, { x: wx, y: baseY + wingH / 2, z: 0.04, hex2: CREAM }));
      // pavilion cornice
      parts.push(box(wingW + 0.12, 0.14, bodyD + 0.34, STONE_L, { x: wx, y: baseY + wingH + 0.04, z: 0.04, hex2: STONE }));
      // a tall window on each wing front (echoes the centre) — a single graded
      // box (cream→dark) reads as the recessed bay for one box of cost.
      parts.push(box(0.28, wingH * 0.55, 0.07, WIN, { x: wx, y: baseY + wingH * 0.46, z: frontZ + 0.13, hex2: WIN }));
      // small dark mansard cap over each wing pavilion (4-sided steep cone) — the
      // cone apex itself reads as the ridge, so no separate boss is needed.
      const wEave = baseY + wingH + 0.11;
      parts.push(cone(1.0, wingHalf, 4, ROOF_L, { ry: FACE, sx: (wingW + 0.18) / 1.42, sz: (bodyD + 0.4) / 1.42, y: wEave + wingHalf / 2, hex2: ROOF }));
    }

    // === CENTRAL ENTRANCE PAVILION + PEDIMENT ================================
    // A slightly proud central bay: a big arched doorway flanked by paired white
    // columns, crowned by the white triangular pediment — the centrepiece under
    // the domed mansard pavilion.
    const porchW = 1.4;
    const porchH = bodyH + 0.16;
    parts.push(box(porchW, porchH, 0.24, CREAM_L, { y: baseY + porchH / 2, z: frontZ + 0.07, hex2: CREAM })); // proud porch face
    // big central arched doorway (dark void + white archivolt)
    parts.push(box(0.66, 0.86, 0.22, WIN, { y: baseY + 0.43 + 0.02, z: frontZ + 0.16 }));
    parts.push(cyl(0.33, 0.33, 0.22, 5, WIN, { rx: HALF_PI, thetaLen: PI, open: true, y: baseY + 0.88, z: frontZ + 0.16 }));
    // white half-ring archivolt — kept on the centre arch only (the one ornate
    // arch surround; the arcade relies on its white piers instead).
    parts.push(cyl(0.43, 0.43, 0.14, 5, STONE_L, { rx: HALF_PI, thetaLen: PI, open: true, y: baseY + 0.88, z: frontZ + 0.22, hex2: STONE }));
    // paired white columns flanking the doorway (the portico order) — seg4 open
    // square shafts, the iconic州廳 entrance pairing.
    for (const cx of [-0.52, -0.4, 0.4, 0.52]) {
      parts.push(cyl(0.06, 0.065, porchH * 0.62, 4, STONE_L, { open: true, ry: FACE, x: cx, y: baseY + porchH * 0.31 + 0.02, z: frontZ + 0.2, hex2: STONE }));
    }
    // upper central window over the door (under the pediment)
    parts.push(box(0.5, 0.42, 0.07, WIN, { y: baseY + bodyH - 0.18, z: frontZ + 0.16 }));

    // Pediment: a low triangular gable over the central bay. cyl(seg=3) on its
    // side gives a clean triangular prism facing the viewer; a white cornice caps
    // its base (the classic pediment entablature).
    const pedY = baseY + porchH + 0.06;
    parts.push(box(porchW + 0.22, 0.14, 0.36, STONE_L, { y: pedY, z: frontZ + 0.05, hex2: STONE })); // pediment base cornice
    parts.push(
      cyl(0.42, 0.42, 0.34, 3, STONE, {
        rx: HALF_PI, // lay the triangular prism on its side, flat base down
        sx: (porchW + 0.18) / (0.42 * 1.5), // stretch to porch width
        sy: 0.5, // flatten to a shallow Baroque gable
        y: pedY + 0.12,
        z: frontZ + 0.05,
        hex2: STONE_L,
      })
    );

    // === CENTRAL MANSARD PAVILION + CUPOLA DOME (the visual hero) ============
    // Rising over the centre: a short square cream pavilion drum, a steep dark
    // slate MANSARD roof (the unmistakable官廳 crown), then a small pale verdigris
    // CUPOLA dome with a lantern + finial. Owns the top WITHOUT becoming a tower.
    const pavW = 1.02; // square pavilion footprint (half-width-ish for cyl seg=4)
    const pavBaseY = baseY + bodyH + 0.18; // springs from the central parapet
    const pavH = 0.72; // short drum — keeps the silhouette low/squat
    // square cream pavilion drum (flat faces front the axes)
    parts.push(cyl(pavW, pavW, pavH, 4, CREAM, { ry: FACE, y: pavBaseY + pavH / 2, hex2: CREAM_L }));
    // a tall round-arched window on the front of the pavilion drum
    parts.push(box(0.3, pavH * 0.6, 0.08, WIN, { y: pavBaseY + pavH * 0.46, z: pavW + 0.01 }));
    parts.push(cyl(0.16, 0.16, 0.08, 5, WIN, { rx: HALF_PI, thetaLen: PI, open: true, y: pavBaseY + pavH * 0.46 + pavH * 0.3, z: pavW + 0.01 }));
    // white pavilion cornice (the mansard springs from it)
    const pavTopY = pavBaseY + pavH;
    parts.push(cyl(pavW + 0.08, pavW + 0.14, 0.16, 4, STONE_L, { ry: FACE, y: pavTopY + 0.08, hex2: STONE }));

    // STEEP DARK MANSARD ROOF — a tall 4-sided cone (the dark slate cap that
    // dominates the centre). Lit-lower (ROOF_L) → shadow-ridge (ROOF_D) gradient.
    const mansardEave = pavTopY + 0.16;
    const mansardH = 1.05;
    parts.push(cone(1.0, mansardH, 4, ROOF_L, { ry: FACE, sx: (pavW + 0.24) / 0.71, sz: (pavW + 0.24) / 0.71, y: mansardEave + mansardH / 2, hex2: ROOF_D }));
    // small dormer hint on the front mansard face (the官廳 roof window) — a single
    // pale box with a gradient to dark reads as the surround + glazing in one.
    parts.push(box(0.2, 0.2, 0.12, STONE_L, { y: mansardEave + mansardH * 0.32, z: pavW * 0.62, hex2: WIN }));

    // PALE VERDIGRIS CUPOLA DOME crowning the mansard — a small bulbous hemisphere
    // + lantern + finial. The bright cap that catches the eye over the dark roof.
    const mansardApexY = mansardEave + mansardH;
    const domeR = pavW * 0.42;
    const domeBaseY = mansardApexY - 0.04;
    // tiny white drum the dome sits on (open ring — caps unseen behind dome/mansard)
    parts.push(cyl(domeR * 1.05, domeR * 1.15, 0.16, 6, STONE_L, { open: true, y: domeBaseY + 0.06, hex2: STONE }));
    // bulbous verdigris hemisphere (lit-lower → shadow-apex), slightly squashed
    parts.push(sph(domeR, DOME, { ws: 6, hs: 4, theta0: 0, thetaLen: HALF_PI, sy: 1.15, y: domeBaseY + 0.13, hex2: DOME_D }));

    // lantern + finial crowning the cupola
    const j = (rng() - 0.5) * 0.015; // tiny finial jitter (variation only)
    const lanternY = domeBaseY + 0.13 + domeR * 1.05;
    parts.push(cyl(domeR * 0.3, domeR * 0.36, 0.14, 4, DOME, { y: lanternY + 0.06, hex2: DOME_D })); // lantern drum
    parts.push(cyl(0.03, 0.05, 0.24, 4, GOLD, { open: true, y: lanternY + 0.28 + j })); // finial mast + gilt orb (tapered post)
    parts.push(cone(0.045, 0.14, 5, GOLD, { y: lanternY + 0.47 + j })); // gilt finial spike crowning the州廳

    return finish(parts);
  },
};

export default NM_PREFECTURAL_HALL;
