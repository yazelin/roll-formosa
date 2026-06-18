/**
 * @file locale.js — zh-TW string table for the Kaohsiung pack.
 *
 * Keys are stable identifiers. Missing keys return a visible '⚠[key]' fallback
 * so a typo is immediately surfaced in the UI without crashing.
 *
 * Number formatting: use `numFmt` (Intl.NumberFormat 'zh-TW') for scores /
 * large integers, or call `t.fmt(n)` which falls back to String(n) in
 * non-Intl environments.
 *
 * Usage:
 *   import { t } from './locale.js';
 *   t('hud.rareFound')               // (ja) rare-found +5000  -> '發現稀有！+5000'
 *   t('hud.goalCall')                // goal toast
 *   t('hud.landmark', '龍山寺')      // landmark absorbed toast
 *   t('hud.collect', 3, 13)          // collection count label
 */

/** @type {Record<string, string|Function>} */
const TABLE = {
  // ---- HUD toasts ----
  'hud.rareFound':    '發現稀有！+5000',
  'hud.goalCall':     '高雄 85 大樓在呼喚你…！',
  'hud.goalGuide':    '朝高雄 85 大樓前進！',
  /** hud.landmark is a function: (nameZh) => string */
  'hud.landmark':     (name) => `「${name}」捲進來了！`,
  /** hud.collect is a function: (found, total) => string */
  'hud.collect':      (found, total) => `收藏 ${found}/${total}`,

  // ---- Screens — share / best lines ----
  'screens.shareText':    (timeStr, rank, score, found, total) =>
    `🗼Roll Formosa 高雄捲完了！\n⏱${timeStr}／RANK ${rank}／⭐${score}\n🏯稀有 ${found}/${total} 收藏`,
  'screens.bestTime':     (timeStr, rank) => `最佳時間 ${timeStr} (RANK ${rank})`,
  'screens.bestScore':    (score) => `最高分 ${score}`,
  'screens.personalBest': (line) => `個人最佳：${line}`,
  'screens.collectHeader': (n, total) => `🏯 收藏 ${n}/${total}`,

  // ---- Touch control hints (screens.js) ----
  'hints.drag':   '拖曳 / Drag',
  'hints.move':   '移動 / Move',
  'hints.two':    '雙指 / 2nd finger',
  'hints.boost':  '加速 / Boost',
  'hints.dash':   '衝刺 / Dash',

  // ---- 月牙 (mascot) toggle ----
  'donack.on':  '月牙·導遊 ON',
  'donack.off': '月牙·導遊 OFF',

  // ---- Title screen ----
  'title.subtitle':    '捲啊捲，捲遍全高雄。 / Roll up all of Kaohsiung.',
  'title.start':       '開始 / START',
  'title.seedLine':    '從 2cm 圖釘，一路到 378m 高雄 85 大樓 — From a 2cm pushpin to the 85 Sky Tower.',
  'title.personalBest': '個人最佳：',

  // ---- Win overlay ----
  'win.title':         '高雄，全部捲走了！',
  'win.subtitle':      'YOU ROLLED UP KAOHSIUNG',
  'win.labelTime':     '⏱ 時間 / TIME',
  'win.labelScore':    '⭐ 分數 / SCORE',
  'win.labelSize':     '📏 最終大小 / SIZE',
  'win.detail':        (absorbed, rares) => `捲入 ${absorbed} 個 · 稀有 ${rares} 個`,
  'win.postX':         'X 分享 / POST',
  'win.rollAgain':     '再來一次 / ROLL AGAIN',
  'win.seedLine':      (seed) => `SEED: ${seed}（同一 seed，同樣世界 / same seed, same world）`,
};

/**
 * Look up a locale string. Interpolated keys hold a function — pass remaining
 * args as positional params. Missing keys return '⚠[key]' (visible, never a
 * crash).
 *
 * @param {string} key
 * @param {...*} args Positional interpolation args (for function values).
 * @returns {string}
 */
export function t(key, ...args) {
  const v = TABLE[key];
  if (v === undefined) return `⚠[${key}]`;
  if (typeof v === 'function') return v(...args);
  return v;
}

/**
 * Intl.NumberFormat for zh-TW (score display, absorb count, etc.).
 * Gracefully falls back to String() in environments without Intl.
 * @type {Intl.NumberFormat|null}
 */
export const numFmt =
  typeof Intl !== 'undefined' && typeof Intl.NumberFormat === 'function'
    ? new Intl.NumberFormat('zh-TW')
    : null;

/**
 * Format a number using zh-TW grouping; falls back to String(n) without Intl.
 * @param {number} n
 * @returns {string}
 */
export function fmt(n) {
  return numFmt !== null ? numFmt.format(n) : String(n);
}

/**
 * The locale object exposed via activePack.locale. Consumers read:
 *   activePack.locale.t(key, ...args)
 *   activePack.locale.fmt(n)
 */
export const locale = { t, fmt, numFmt };
export default locale;
