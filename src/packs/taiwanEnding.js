/**
 * @file taiwanEnding.js — SHARED Formosa-island finale data for every pack.
 *
 * The win cinematic (render/endingView.js) shows one Taiwan silhouette with the
 * CURRENT city's pin lit and every other city dim. The island geography is the
 * same for all packs, so it lives here ONCE — packs just re-export `ending`:
 *
 *     // src/packs/<city>/ending.js
 *     export { ending } from '../taiwanEnding.js';
 *
 * Which pin lights is decided by the ENGINE from the active city id (passed to
 * EndingView), NOT by per-pack data — so a newly scaffolded city is correct with
 * zero ending work. Add a new pack id to CITIES below and its pin lights itself.
 *
 * Coordinate convention (matches endingView.js):
 *   x = east–west (positive = east), z = north–south (positive = south).
 *   Normalized roughly x∈[−0.4,0.3], z∈[−1,1] after the NARROW squeeze.
 */

/**
 * Taiwan is tall and narrow (~394 km × 144 km ≈ 2.7:1). The raw outline below is
 * a bit fat, and the finale camera's oblique angle squishes it further, so we
 * squeeze x to keep the silhouette reading as Taiwan rather than a green blob.
 */
const NARROW = 0.6;

/** Raw 28-point clockwise Taiwan outline [x, z], north tip first. */
const RAW_OUTLINE = [
  [ 0.00, -1.00], [ 0.10, -0.90], [ 0.30, -0.80], [ 0.42, -0.68],
  [ 0.48, -0.55], [ 0.50, -0.38], [ 0.50, -0.20], [ 0.48,  0.00],
  [ 0.46,  0.15], [ 0.42,  0.30], [ 0.36,  0.48], [ 0.24,  0.65],
  [ 0.10,  0.82], [-0.05,  1.00], [-0.20,  0.86], [-0.30,  0.72],
  [-0.40,  0.58], [-0.52,  0.42], [-0.58,  0.28], [-0.62,  0.12],
  [-0.62, -0.02], [-0.60, -0.18], [-0.54, -0.32], [-0.44, -0.46],
  [-0.34, -0.58], [-0.22, -0.70], [-0.10, -0.82], [-0.04, -0.92],
];

// x is negated (EW mirror): with the finale camera, un-negated x put western
// cities (高雄/台南) on the screen's right. Verified via taipei(N)/高雄(SW) probes.
const EW = -NARROW;

/** Taiwan polygon: narrowed + EW-corrected [x, z] pairs. */
export const TAIWAN_OUTLINE = RAW_OUTLINE.map(([x, z]) => [x * EW, z]);

/**
 * Every city pin. `id` MUST match the pack id (src/packs/<id>) — EndingView
 * lights the pin whose id === active city id. Main-island cities sit on the
 * silhouette; the three outlying counties (澎湖/金門/馬祖) float west of it
 * (no land under them — acceptable; refine with islets later).
 */
const RAW_CITIES = [
  { id: 'keelung',   name: '基隆', x:  0.16, z: -0.92 },
  { id: 'taipei',    name: '台北', x:  0.05, z: -0.85 },
  { id: 'newtaipei', name: '新北', x: -0.02, z: -0.80 },
  { id: 'taoyuan',   name: '桃園', x: -0.20, z: -0.70 },
  { id: 'hsinchu',   name: '新竹', x: -0.34, z: -0.54 },
  { id: 'miaoli',    name: '苗栗', x: -0.44, z: -0.40 },
  { id: 'taichung',  name: '台中', x: -0.50, z: -0.14 },
  { id: 'changhua',  name: '彰化', x: -0.56, z: -0.02 },
  { id: 'nantou',    name: '南投', x: -0.22, z: -0.06 },
  { id: 'yunlin',    name: '雲林', x: -0.56, z:  0.10 },
  { id: 'chiayi',    name: '嘉義', x: -0.52, z:  0.22 },
  { id: 'tainan',    name: '台南', x: -0.52, z:  0.38 },
  { id: 'kaohsiung', name: '高雄', x: -0.42, z:  0.52 },
  { id: 'pingtung',  name: '屏東', x: -0.26, z:  0.62 },
  { id: 'yilan',     name: '宜蘭', x:  0.34, z: -0.60 },
  { id: 'hualien',   name: '花蓮', x:  0.44, z: -0.18 },
  { id: 'taitung',   name: '台東', x:  0.30, z:  0.42 },
  { id: 'penghu',    name: '澎湖', x: -1.05, z:  0.12 },
  { id: 'kinmen',    name: '金門', x: -1.25, z:  0.22 },
  { id: 'matsu',     name: '馬祖', x: -0.95, z: -0.86 },
];

/** City pins with x narrowed + EW-corrected to match the outline. */
export const CITIES = RAW_CITIES.map((c) => ({ ...c, x: c.x * EW }));

/** Color palette (hex integers, consumed by endingView.js via THREE.Color). */
export const COLORS = {
  island: 0x1a3a1f,
  islandEmissive: 0x2a5c2a,
  ocean: 0x061420,
  cityLit: 0xffd060,
  cityLitGlow: 0xff9a20,
  cityDim: 0x3a5070,
  starBase: 0xd0e0ff,
};

/** Full ending surface (activePack.ending). EndingView lights by active id. */
export const ending = {
  islandOutline: TAIWAN_OUTLINE,
  cities: CITIES,
  colors: COLORS,
};
