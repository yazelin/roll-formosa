/**
 * @file taipei/ending.js — Pack-driven Formosa-island reveal definition.
 *
 * Exported as `ending` on the Taipei StagePack. Consumed by
 * render/endingView.js to build the win-cinematic island view:
 *   - A stylized Taiwan ("番薯" sweet-potato) island polygon in the XZ plane.
 *   - City pin list with lit/dim states.
 *   - Color palette (island body, lit city glow, dim city dot, ocean tint).
 *
 * Polygon coordinate convention:
 *   x = east–west (positive = east)
 *   z = north–south (positive = south, matching THREE.js XZ world plane)
 *   Range: roughly –1..+1 in both axes; z spans –1 (north tip near Taipei)
 *   to +1 (south tip at Eluanbi).
 *
 * 28-point clockwise outline, starting at the narrow northern tip and tracing
 * west coast first, then the east coast back up. Captured from the real island
 * silhouette at ~1:5 aspect ratio (394 km tall, 144 km wide at widest).
 */

/**
 * Taiwan polygon: 28 clockwise points [x, z].
 * x=0, z=-1  → narrow north tip (Taipei/Keelung area)
 * Widest west bulge around z=0.05..0.15, x=−0.60
 * East coast is straighter (Hualien cliff line)
 * South tapers to x=−0.05, z=+1 (Eluanbi)
 */
export const TAIWAN_OUTLINE = [
  // North tip
  [ 0.00, -1.00], // N1 — narrow crown, Keelung/Sanzhi
  [ 0.10, -0.90], // NE1 — slight NE bulge (Jiufen ridge)
  [ 0.30, -0.80], // NE2 — Yilan coast opening
  [ 0.42, -0.68], // NE3 — Yilan southeast
  [ 0.48, -0.55], // E1  — Hualien north (Suao Cliff)
  [ 0.50, -0.38], // E2  — Hualien city (east coast straight)
  [ 0.50, -0.20], // E3  — Hualien south
  [ 0.48,  0.00], // E4  — Tropic of Cancer crossing
  [ 0.46,  0.15], // E5  — Taitung north
  [ 0.42,  0.30], // E6  — Taitung coast
  [ 0.36,  0.48], // SE1 — Southeast taper begins
  [ 0.24,  0.65], // SE2 — approaching tip
  [ 0.10,  0.82], // SE3 — Hengchun peninsula east
  [-0.05,  1.00], // S   — Eluanbi southernmost tip
  [-0.20,  0.86], // SW1 — Hengchun west flank
  [-0.30,  0.72], // SW2 — Fangliao coast
  [-0.40,  0.58], // SW3 — Kaohsiung south
  [-0.52,  0.42], // W5  — Kaohsiung coast
  [-0.58,  0.28], // W4  — Tainan south
  [-0.62,  0.12], // W3  — Tainan / Chiayi (widest section west)
  [-0.62, -0.02], // W2  — Taichung south — maximum west extent
  [-0.60, -0.18], // W1  — Taichung / Miaoli
  [-0.54, -0.32], // NW4 — Hsinchu coast
  [-0.44, -0.46], // NW3 — Taoyuan coast
  [-0.34, -0.58], // NW2 — Danshui mouth
  [-0.22, -0.70], // NW1 — Bali / Tamsui north
  [-0.10, -0.82], // N3  — Shilin / Beitou
  [-0.04, -0.92], // N2  — approaching north tip again
  // (closes back to [0.00, -1.00])
];

/**
 * City pins. x/z normalized same as TAIWAN_OUTLINE.
 * `lit: true` = bright glow (Taipei, pack is unlocked);
 * `lit: false` = dim dot ("coming soon").
 */
export const CITIES = [
  { name: '台北', x:  0.02, z: -0.87, lit: false  }, // Taipei — north, lit
  { name: '基隆', x:  0.12, z: -0.88, lit: false }, // Keelung
  { name: '桃園', x: -0.22, z: -0.72, lit: false }, // Taoyuan
  { name: '新竹', x: -0.38, z: -0.54, lit: false }, // Hsinchu
  { name: '台中', x: -0.46, z: -0.12, lit: true }, // Taichung
  { name: '嘉義', x: -0.52,  z: 0.20, lit: false }, // Chiayi
  { name: '台南', x: -0.52,  z: 0.36, lit: false }, // Tainan
  { name: '高雄', x: -0.44,  z: 0.50, lit: false }, // Kaohsiung
  { name: '花蓮', x:  0.44, z: -0.38, lit: false }, // Hualien (east coast)
];

/** Color palette (hex integers, consumed by endingView.js via THREE.Color). */
export const COLORS = {
  /** Island land body — warm subtropical green. */
  island: 0x1a3a1f,
  /** Island edge highlight / emissive — slightly lighter. */
  islandEmissive: 0x2a5c2a,
  /** Ocean floor (background plane around the island). */
  ocean: 0x061420,
  /** Lit city glow — warm amber (Taipei beacon). */
  cityLit: 0xffd060,
  /** Lit city halo / bloom tint. */
  cityLitGlow: 0xff9a20,
  /** Dim city dot — cool blue-grey ("coming soon" muted). */
  cityDim: 0x3a5070,
  /** Star shell — same style as earthView.js. */
  starBase: 0xd0e0ff,
};

/**
 * Ending definition object (the full activePack.ending surface).
 * endingView.js reads islandOutline, cities, colors.
 */
export const ending = {
  islandOutline: TAIWAN_OUTLINE,
  cities: CITIES,
  colors: COLORS,
};
