/**
 * @file active.js — the engine's single content seam. Statically imports every
 * city pack and synchronously exports the one chosen by ?city= / localStorage
 * (see manifest.js). Switching city = reload with a new ?city (no runtime swap,
 * which the "load-time baked activePack" reads in the engine cannot support).
 */
import { activePack as taipei } from './taipei/index.js';
import { activePack as kaohsiung } from './kaohsiung/index.js';
import { activePack as taichung } from './taichung/index.js';
import { activePack as tainan } from './tainan/index.js';
import { activePack as hualien } from './hualien/index.js';
import { resolveCityId } from './manifest.js';

const PACKS = { taipei, kaohsiung, taichung, tainan, hualien };
export const activePack = PACKS[resolveCityId()] || taipei;
export default activePack;
