/**
 * @file manifest.js — city registry (single source of truth for the selector
 * and active.js). status: 'ready' = playable; 'soon' = greyed "即將推出".
 */
export const CITIES = Object.freeze([
  Object.freeze({ id: 'taipei',    displayName: '台北', tagline: '101 終點',   status: 'ready' }),
  Object.freeze({ id: 'kaohsiung', displayName: '高雄', tagline: '85 大樓終點', status: 'ready' }),
  Object.freeze({ id: 'taichung', displayName: '台中', tagline: '台中之鑽終點', status: 'ready' }),
  Object.freeze({ id: 'tainan', displayName: '台南', tagline: '林百貨終點', status: 'ready' }),
  Object.freeze({ id: 'taitung', displayName: '台東', tagline: '三仙台終點', status: 'ready' }),
  Object.freeze({ id: 'hualien', displayName: '花蓮', tagline: '太魯閣終點', status: 'ready' }),
  Object.freeze({ id: 'keelung', displayName: '基隆', tagline: '雨港廟口', status: 'ready' }),
  Object.freeze({ id: 'newtaipei', displayName: '新北', tagline: '淡水漁人碼頭終點', status: 'ready' }),
  Object.freeze({ id: 'taoyuan', displayName: '桃園', tagline: '大溪老街終點', status: 'ready' }),
  Object.freeze({ id: 'chiayi', displayName: '嘉義', tagline: '阿里山下的木都', status: 'ready' }),
  Object.freeze({ id: 'hsinchu', displayName: '新竹', tagline: '城隍廟終點', status: 'ready' }),
  Object.freeze({ id: 'pingtung', displayName: '屏東', tagline: '鵝鑾鼻燈塔終點', status: 'ready' }),
  Object.freeze({ id: 'yilan', displayName: '宜蘭', tagline: '龜山島終點', status: 'ready' }),
  Object.freeze({ id: 'nantou', displayName: '南投', tagline: '日月潭終點', status: 'ready' }),
  Object.freeze({ id: 'changhua', displayName: '彰化', tagline: '八卦山大佛終點', status: 'ready' }),
  Object.freeze({ id: 'yunlin', displayName: '雲林', tagline: '西螺大橋終點', status: 'ready' }),
]);

export const DEFAULT_CITY = 'taipei';

/** Resolve the chosen city id from ?city= then localStorage, validated against CITIES. */
export function resolveCityId() {
  let id = null;
  try {
    const u = new URLSearchParams(globalThis.location?.search || '');
    id = u.get('city');
    if (!id && globalThis.localStorage) id = globalThis.localStorage.getItem('rf_city');
  } catch { /* SSR/test: fall through to default */ }
  const ok = CITIES.some((c) => c.id === id && c.status === 'ready');
  return ok ? id : DEFAULT_CITY;
}
