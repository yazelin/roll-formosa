/**
 * @file packs/matsu/narration.js — 月牙 (Formosan black bear) narration table
 * for the Matsu pack.
 *
 * Mirrors the exact data shape of src/config/donackLines.js but with
 * zh-TW Matsu content authored for 月牙's voice: warm, friendly, slightly
 * playful; drops Matsu trivia and cheers the player on. No Japanese, no
 * legacy references.
 *
 * Line shape (frozen contract, same as config/donackLines.js):
 *   { text:string, priority:0|1|2|3,
 *     expression:'idle'|'happy'|'thinking'|'speaking',
 *     once:boolean, phase:'title'|'play'|'cinematic'|'result' }
 *
 * Lookup maps (consumed by ui/donack.js when it reads activePack.narration):
 *   DONACK_LINES          id -> line
 *   TIER_UP_LINE_IDS      tierIndex -> id  (index 0 unused)
 *   LANDMARK_LINE_IDS     landmarkId -> id (0=芹壁聚落..8=媽祖巨神像/goal)
 *   COLLECT_LINE_IDS      collectibleId -> id (0..12)
 *   FIRST_LINE_BY_CODE    archetypeCode -> id
 *   DUAL_COLLECTIBLE_ID   (none in Matsu — export 'no-dual' sentinel -1)
 *   DUAL_LANDMARK_ID      (-1: donack.js skips landmark if id === DUAL_LANDMARK_ID)
 *
 * Matsu collectible album (13 items, ids 0-12):
 *   0 台灣黑熊  1 老酒麵線  2 繼光餅  3 紅糟  4 馬祖高粱酒  5 藍眼淚
 *   6 風獅爺  7 蚵仔煎  8 馬祖漁船  9 閩東石屋  10 鋼盔
 *   11 墨魚乾  12 媽祖神像
 *
 * Matsu landmark order (landmarkId = array index in cityMap.LANDMARKS):
 *   0 芹壁聚落  1 北海坑道  2 東引燈塔  3 境天后宮  4 鐵堡
 *   5 八角據點遺址  6 藍眼淚沙灘  7 東莒島燈塔  8 媽祖巨神像 (goal)
 *
 * Id contract: append-only. Never reuse or rename existing ids.
 * Static data only — zero runtime allocation beyond module init.
 */

/** @typedef {{text:string, priority:number, expression:string, once:boolean, phase:string}} DonackLine */

const PLAY = 'play';

/**
 * The 月牙 Matsu narration table.
 * @type {Readonly<Record<string, Readonly<DonackLine>>>}
 */
export const DONACK_LINES = Object.freeze({

  /* ---- run start ---- */
  start: Object.freeze({
    text: '從馬祖漁村出發！海風鹹鹹的，藍眼淚在等著你',
    priority: 2, expression: 'idle', once: true, phase: PLAY,
  }),

  /* ---- tier-ups (index via TIER_UP_LINE_IDS[tierIndex]) ---- */
  // tier0 is the starting tier — no tier-up INTO tier 0; index 0 slot left ''
  tier1: Object.freeze({
    text: '進老酒巷了！馬祖老酒的香味，月牙都聞到了',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier2: Object.freeze({
    text: '芹壁聚落！閩東式石厝依山面海，每間都是風景',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier3: Object.freeze({
    text: '漁港碼頭！漁船進進出出，這裡的海鮮最新鮮',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier4: Object.freeze({
    text: '閩東石厝和廟都滾進來了，月牙感受到信仰的力量',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier5: Object.freeze({
    text: '進入坑道區！這些軍事據點見證了戰地歲月',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier6: Object.freeze({
    text: '藍眼淚海岸天際線！媽祖巨神像就在前方守護著',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),

  /* ---- first-absorb-per-category (index via FIRST_LINE_BY_CODE) ---- */
  first_marble: Object.freeze({
    text: '彈珠一顆！每顆大滾球都是從小東西開始的',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_seashell: Object.freeze({
    text: '貝殼！馬祖的海邊到處都是，聽得到海的聲音',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_chair: Object.freeze({
    text: '紅塑膠椅！從漁村到廟口，哪裡都有它',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_wine: Object.freeze({
    text: '老酒瓶！馬祖老酒越陳越香，八年以上才夠味',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_scooter: Object.freeze({
    text: '機車來了！離島交通就靠它，繞一圈不用一小時',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_bus: Object.freeze({
    text: '公車吞進去了！馬祖的公車班次少，要看準時間',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_building: Object.freeze({
    text: '整棟石厝！閩東建築就是要這樣一磚一石疊起來',
    priority: 1, expression: 'happy', once: true, phase: PLAY,
  }),
  first_tunnel: Object.freeze({
    text: '坑道入口！這些戰地坑道是馬祖的特殊記憶',
    priority: 1, expression: 'happy', once: true, phase: PLAY,
  }),

  /* ---- play reactions / tips ---- */
  combo15: Object.freeze({
    text: '連消連消！月牙的爪子都快鼓掌到脫毛了',
    priority: 1, expression: 'happy', once: true, phase: PLAY,
  }),
  knockoff: Object.freeze({
    text: '掉了！太大的先繞開，從旁邊的小東西補大再衝',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  repeat_bonk: Object.freeze({
    text: '一直彈回來是在提醒你：還沒到時候，先長大再說',
    priority: 1, expression: 'thinking', once: true, phase: PLAY,
  }),
  tip_idle: Object.freeze({
    text: '那邊有小東西！小的先掃光，大的才追得上',
    priority: 0, expression: 'thinking', once: false, phase: PLAY,
  }),
  tip_dash: Object.freeze({
    text: '衝刺蓄滿了，找條直路全速衝一波',
    priority: 0, expression: 'thinking', once: false, phase: PLAY,
  }),
  tip_edge: Object.freeze({
    text: '快到海邊了，小心別掉下去，轉個彎繞回來',
    priority: 1, expression: 'thinking', once: false, phase: PLAY,
  }),

  /* ---- landmark trivia (index via LANDMARK_LINE_IDS[landmarkId]) ---- */
  lm_qinbi: Object.freeze({
    text: '芹壁聚落！號稱馬祖地中海，石屋配藍天真的美',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_beihai: Object.freeze({
    text: '北海坑道！退潮才能走進去，水道兩側都是花崗岩',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_dongyin: Object.freeze({
    text: '東引燈塔！百年白色燈塔，台灣最北的領土地標',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_tianhou: Object.freeze({
    text: '境天后宮！馬祖最古老的媽祖廟，傳說林默娘就葬在這',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_iron_fort: Object.freeze({
    text: '鐵堡！建在海蝕洞裡的軍事據點，以前養軍犬看守',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_bajiu: Object.freeze({
    text: '八角據點遺址！八角形碉堡是馬祖特有的軍事建築',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_blue_tears: Object.freeze({
    text: '藍眼淚沙灘！夜光藻發光的奇景，四月到九月最美',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_dongju: Object.freeze({
    text: '東莒島燈塔！花崗岩砌成的百年古蹟，夕陽時最美',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_mazu_goddess: Object.freeze({
    text: '媽祖巨神像！29.6 公尺高，全世界最高的媽祖神像',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),

  /* ---- goal call ---- */
  goal_call: Object.freeze({
    text: '媽祖巨神像在呼喚你，月牙幫你加油！',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),

  /* ---- collectibles (index via COLLECT_LINE_IDS[collectibleId]) ---- */
  col_generic: Object.freeze({
    text: '收藏品到手！相簿又多一頁了',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_bear: Object.freeze({
    text: '台灣黑熊！月牙的家族！胸前那個月牙紋就是我的標誌',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_aged_wine_noodle: Object.freeze({
    text: '老酒麵線！馬祖第一名產，老酒、麵線、紅糟，暖到心裡',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_jiguang: Object.freeze({
    text: '繼光餅！戚繼光打仗時掛脖子上的乾糧，馬祖人早餐必備',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_red_yeast: Object.freeze({
    text: '紅糟！馬祖料理的靈魂，紅糟鰻、紅糟肉，看了就餓',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_kaoliang: Object.freeze({
    text: '馬祖高粱酒！跟金門高粱不一樣，這裡的比較甜',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_blue_tears: Object.freeze({
    text: '藍眼淚！夜光藻發出的藍光，馬祖最夢幻的風景',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_wind_lion: Object.freeze({
    text: '風獅爺！鎮風避邪的守護神，村口都會擺一尊',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_oyster: Object.freeze({
    text: '蚵仔煎！馬祖的蚵仔特別肥，煎起來香噴噴',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_boat: Object.freeze({
    text: '馬祖漁船！討海人的生財工具，出海打魚去',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_stone_house: Object.freeze({
    text: '閩東石屋！花崗岩、黃土、海砂，蓋出防風的家',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_helmet: Object.freeze({
    text: '鋼盔！戰地時期的遺物，現在是歷史的見證',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_cuttlefish: Object.freeze({
    text: '墨魚乾！馬祖特產，曬乾後更有嚼勁',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_mazu: Object.freeze({
    text: '媽祖神像！海上守護神，馬祖地名就是從媽祖來的',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),

  /* ---- finale / result ---- */
  goal_contact: Object.freeze({
    text: '滾完媽祖巨神像！月牙陪你朝聖！',
    priority: 3, expression: 'speaking', once: true, phase: 'cinematic',
  }),
  ascension: Object.freeze({
    text: '哇…從媽祖巨神像往下看，整個馬祖列島都在腳下',
    priority: 3, expression: 'speaking', once: true, phase: 'cinematic',
  }),
  result: Object.freeze({
    text: '辛苦了！把成績分享出去，讓大家看看月牙的玩家有多強',
    priority: 3, expression: 'speaking', once: true, phase: 'result',
  }),
});

/* ------------------------------------------------------------------ */
/* Frozen event -> line-id lookup tables (consumed by ui/donack.js)    */
/* ------------------------------------------------------------------ */

/**
 * TierUpEvent.tierIndex -> line id (index 0 unused — no tier-up INTO tier 0).
 * 7-tier Matsu table.
 * @type {ReadonlyArray<string>}
 */
export const TIER_UP_LINE_IDS = Object.freeze([
  '', 'tier1', 'tier2', 'tier3', 'tier4', 'tier5', 'tier6',
]);

/**
 * LandmarkEvent.landmarkId (0..8, strictly increasing dioramaR order per
 * cityMap.LANDMARKS) -> line id.
 * Matsu has no DUAL-tagged landmark: all 9 slots have bespoke lines.
 * @type {ReadonlyArray<string>}
 */
export const LANDMARK_LINE_IDS = Object.freeze([
  'lm_qinbi',        // 0 芹壁聚落
  'lm_beihai',       // 1 北海坑道
  'lm_dongyin',      // 2 東引燈塔
  'lm_tianhou',      // 3 境天后宮
  'lm_iron_fort',    // 4 鐵堡
  'lm_bajiu',        // 5 八角據點遺址
  'lm_blue_tears',   // 6 藍眼淚沙灘
  'lm_dongju',       // 7 東莒島燈塔
  'lm_mazu_goddess', // 8 媽祖巨神像 (goal)
]);

/**
 * CollectEvent.collectibleId (0..12, Matsu album) -> line id.
 * Unknown future ids fall back to 'col_generic'.
 * @type {ReadonlyArray<string>}
 */
export const COLLECT_LINE_IDS = Object.freeze([
  'col_bear',             //  0 台灣黑熊
  'col_aged_wine_noodle', //  1 老酒麵線
  'col_jiguang',          //  2 繼光餅
  'col_red_yeast',        //  3 紅糟
  'col_kaoliang',         //  4 馬祖高粱酒
  'col_blue_tears',       //  5 藍眼淚
  'col_wind_lion',        //  6 風獅爺
  'col_oyster',           //  7 蚵仔煎
  'col_boat',             //  8 馬祖漁船
  'col_stone_house',      //  9 閩東石屋
  'col_helmet',           // 10 鋼盔
  'col_cuttlefish',       // 11 墨魚乾
  'col_mazu',             // 12 媽祖神像
]);

/**
 * Matsu has no DUAL-tagged collectible/landmark pair.
 * DUAL_COLLECTIBLE_ID = -1 (sentinel: donack.js skips LANDMARK if
 * p.landmarkId === DUAL_LANDMARK_ID; -1 never matches a real id).
 */
export const DUAL_COLLECTIBLE_ID = -1;
export const DUAL_LANDMARK_ID = -1;

/**
 * First-absorb-per-category: ScoreEvent.archetypeCode -> line id.
 * Matsu codes: code = tier*10 + slot (same formula as the legacy engine).
 *   T0 (0-7): small everyday items — marble triggers 'first_marble'
 *   T1 (10-19): 老酒巷 items — aged wine (code 10) triggers 'first_wine'
 *   T2 (20-29): 芹壁聚落 objects — red_plastic_chair (20)
 *   T3 (30-39): 漁港碼頭 — scooter (30)
 *   T4 (40-49): 閩東石厝與廟 — island_bus (44) first_bus; stone_building(41) first_building
 *   T5 (50-59): 坑道與軍事據點 — tunnel_entrance (51) first_tunnel
 *   T6 (60-69): 藍眼淚海岸 — lighthouse (60) first_building
 * @type {Readonly<Record<number, string>>}
 */
export const FIRST_LINE_BY_CODE = Object.freeze({
  // T0: small items trigger generic marble quip (codes 0-7)
  0: 'first_marble', 1: 'first_marble', 2: 'first_marble', 3: 'first_seashell',
  4: 'first_marble', 5: 'first_marble', 6: 'first_marble', 7: 'first_marble',
  // T1: 老酒巷 — aged wine (slot 0 = code 10) gets own line
  10: 'first_wine', 11: 'first_wine', 12: 'first_wine',
  13: 'first_wine', 14: 'first_wine', 15: 'first_wine',
  16: 'first_wine', 17: 'first_wine',
  // T2: 芹壁聚落 — red_plastic_chair (20)
  20: 'first_chair', 21: 'first_chair', 22: 'first_chair',
  23: 'first_chair', 24: 'first_chair', 25: 'first_chair',
  26: 'first_chair', 27: 'first_chair',
  // T3: 漁港碼頭 — scooter (30)
  30: 'first_scooter', 31: 'first_scooter', 32: 'first_scooter',
  33: 'first_scooter', 34: 'first_scooter', 35: 'first_scooter',
  36: 'first_scooter', 37: 'first_scooter',
  // T4: 閩東石厝 — bus (44); buildings get 'first_building'
  40: 'first_building', 41: 'first_building', 42: 'first_building',
  43: 'first_building', 44: 'first_bus', 45: 'first_building',
  46: 'first_building', 47: 'first_building',
  // T5: 坑道 — tunnel (51)
  50: 'first_tunnel', 51: 'first_tunnel', 52: 'first_tunnel',
  53: 'first_tunnel', 54: 'first_tunnel', 55: 'first_tunnel',
  56: 'first_tunnel', 57: 'first_tunnel',
  // T6: 海岸
  60: 'first_building', 61: 'first_building', 62: 'first_building',
  63: 'first_building', 64: 'first_building', 65: 'first_building',
  66: 'first_building', 67: 'first_building',
});
