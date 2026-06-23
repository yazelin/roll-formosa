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
import { activePack as taitung } from './taitung/index.js';
import { activePack as hualien } from './hualien/index.js';
import { activePack as keelung } from './keelung/index.js';
import { activePack as newtaipei } from './newtaipei/index.js';
import { activePack as taoyuan } from './taoyuan/index.js';
import { activePack as chiayi } from './chiayi/index.js';
import { activePack as pingtung } from './pingtung/index.js';
import { resolveCityId } from './manifest.js';

const PACKS = {
  taipei, kaohsiung, taichung, tainan, taitung,
  hualien, keelung, newtaipei, taoyuan, chiayi, pingtung };
export const activePack = PACKS[resolveCityId()] || taipei;
export default activePack;
