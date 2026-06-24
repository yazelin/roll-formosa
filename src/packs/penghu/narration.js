/**
 * @file packs/penghu/narration.js — 月牙 (Formosan black bear) narration table
 * for the Penghu pack.
 *
 * Mirrors the exact data shape of src/config/donackLines.js but with
 * zh-TW Penghu content authored for 月牙's voice: warm, friendly, slightly
 * playful; drops Penghu trivia and cheers the player on. Uses island/ocean
 * vocabulary fitting Penghu's character.
 *
 * Line shape (frozen contract, same as config/donackLines.js):
 *   { text:string, priority:0|1|2|3,
 *     expression:'idle'|'happy'|'thinking'|'speaking',
 *     once:boolean, phase:'title'|'play'|'cinematic'|'result' }
 *
 * Lookup maps (consumed by ui/donack.js when it reads activePack.narration):
 *   DONACK_LINES          id -> line
 *   TIER_UP_LINE_IDS      tierIndex -> id  (index 0 unused)
 *   LANDMARK_LINE_IDS     landmarkId -> id (0=雙心石滬..8=跨海大橋/goal)
 *   COLLECT_LINE_IDS      collectibleId -> id (0..12)
 *   FIRST_LINE_BY_CODE    archetypeCode -> id
 *   DUAL_COLLECTIBLE_ID   (none in Penghu — export 'no-dual' sentinel -1)
 *   DUAL_LANDMARK_ID      (-1: donack.js skips landmark if id === DUAL_LANDMARK_ID)
 *
 * Penghu collectible album (ids 0-12):
 *   0 台灣黑熊  1 仙人掌冰  2 黑糖糕  3 海鮮麵線  4 小卷乾  5 花生酥
 *   6 風獅爺  7 漁船  8 海膽  9 珊瑚  10 石頭屋  11 牡蠣  12 媽祖
 *
 * Penghu landmark order (landmarkId = array index in cityMap.LANDMARKS):
 *   0 雙心石滬  1 天后宮  2 大菓葉玄武岩  3 鯨魚洞  4 西嶼燈塔
 *   5 中央老街  6 觀音亭  7 澎湖機場  8 跨海大橋 (goal)
 *
 * Id contract: append-only. Never reuse or rename existing ids.
 * Static data only — zero runtime allocation beyond module init.
 */

/** @typedef {{text:string, priority:number, expression:string, once:boolean, phase:string}} DonackLine */

const PLAY = 'play';

/**
 * The 月牙 Penghu narration table.
 * @type {Readonly<Record<string, Readonly<DonackLine>>>}
 */
export const DONACK_LINES = Object.freeze({

  /* ---- run start ---- */
  start: Object.freeze({
    text: '從馬公出發！跟著光的箭頭，離島風光等著你',
    priority: 2, expression: 'idle', once: true, phase: PLAY,
  }),

  /* ---- tier-ups (index via TIER_UP_LINE_IDS[tierIndex]) ---- */
  // tier0 is the starting tier — no tier-up INTO tier 0; index 0 slot left ''
  tier1: Object.freeze({
    text: '進海鮮攤了！海的味道一打開，澎湖的夜才剛開始',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier2: Object.freeze({
    text: '漁港碼頭到了！看著漁船進出，這就是離島的日常',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier3: Object.freeze({
    text: '馬公街道出現了！玄武岩、仙人掌，澎湖味滿滿',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier4: Object.freeze({
    text: '馬公街區都進肚子了，石頭屋和古廟好澎湃',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier5: Object.freeze({
    text: '進入漁港商區！漁會大樓、魚市場，全都是你的',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier6: Object.freeze({
    text: '離島天際線！風力發電機轉呀轉，跨海大橋就在前面',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),

  /* ---- first-absorb-per-category (index via FIRST_LINE_BY_CODE) ---- */
  first_marble: Object.freeze({
    text: '彈珠一顆！每顆大滾球都是從小東西開始的',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_shell: Object.freeze({
    text: '貝殼！澎湖的海灘處處都是寶藏',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_chair: Object.freeze({
    text: '紅塑膠椅！漁港邊聊天喝茶，這張椅子少不了',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_ricecooker: Object.freeze({
    text: '電鍋！台灣人的靈魂廚具，幾乎什麼都能煮',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_scooter: Object.freeze({
    text: '機車來了！澎湖的路不大，騎機車最方便',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_bus: Object.freeze({
    text: '公車吞進去了！司機大哥不用再開了',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_building: Object.freeze({
    text: '整棟樓！月牙也沒想到你這麼快就長這麼大',
    priority: 1, expression: 'happy', once: true, phase: PLAY,
  }),
  first_tower: Object.freeze({
    text: '大建築！離島的天際線現在是你的了',
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
    text: '快到邊界了，轉個彎繞回市區',
    priority: 1, expression: 'thinking', once: false, phase: PLAY,
  }),

  /* ---- landmark trivia (index via LANDMARK_LINE_IDS[landmarkId]) ---- */
  lm_double_heart: Object.freeze({
    text: '雙心石滬！兩顆心疊在一起，澎湖最浪漫的打卡點',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_tianhou: Object.freeze({
    text: '天后宮！全台最古老的媽祖廟，四百多年香火不斷',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_basalt: Object.freeze({
    text: '大菓葉玄武岩！六角形石柱天然排列，大自然的鬼斧神工',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_whale_cave: Object.freeze({
    text: '鯨魚洞！海浪侵蝕的海蝕洞，形狀像鯨魚張嘴',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_siyu_lighthouse: Object.freeze({
    text: '西嶼燈塔！全台第一座洋式燈塔，守望大海一百多年',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_zhongyang: Object.freeze({
    text: '中央老街！清朝留下來的老街，走過就像穿越時空',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_guanyinting: Object.freeze({
    text: '觀音亭！夕陽加上彩虹橋，澎湖人最愛的約會聖地',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_airport: Object.freeze({
    text: '澎湖機場！離島的大門，每天載著旅客來來去去',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_crosssea: Object.freeze({
    text: '跨海大橋！2494公尺，東亞最長的跨海大橋，要滾進去嗎',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),

  /* ---- goal call ---- */
  goal_call: Object.freeze({
    text: '跨海大橋在呼喚你，月牙幫你加油！',
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
  col_cactus_ice: Object.freeze({
    text: '仙人掌冰！澎湖特產，紫紅色的清涼，吃過就忘不了',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_brown_sugar: Object.freeze({
    text: '黑糖糕！軟Q帶點焦香，澎湖的伴手禮首選',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_seafood_noodles: Object.freeze({
    text: '海鮮麵線！滿滿的小卷和蛤蜊，海的鮮味一口入魂',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_dried_squid: Object.freeze({
    text: '小卷乾！太陽曬過的海味，配啤酒最對味',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_peanut: Object.freeze({
    text: '花生酥！澎湖花生又香又脆，做成酥餅更好吃',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_wind_lion: Object.freeze({
    text: '風獅爺！澎湖的守護神，擋風辟邪保平安',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_fishing_boat: Object.freeze({
    text: '漁船！大海是澎湖人的冰箱，漁船就是去採購的車',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_sea_urchin: Object.freeze({
    text: '海膽！金黃色的海味，夏天來澎湖必吃',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_coral: Object.freeze({
    text: '珊瑚！海底的花園，美麗但記得只能看不能摸',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_stone_house: Object.freeze({
    text: '石頭屋！咾咕石堆成的古厝，擋風又冬暖夏涼',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_oyster: Object.freeze({
    text: '牡蠣！澎湖的海蚵特別肥美，現烤最鮮',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_mazu: Object.freeze({
    text: '媽祖！澎湖最多信眾的神明，天后宮裡香火鼎盛',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),

  /* ---- finale / result ---- */
  goal_contact: Object.freeze({
    text: '滾完澎湖跨海大橋！月牙陪你跨越大海！',
    priority: 3, expression: 'speaking', once: true, phase: 'cinematic',
  }),
  ascension: Object.freeze({
    text: '哇…從橋上看出去，整片大海和離島都在腳下閃閃發光',
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
 * 7-tier Penghu table.
 * @type {ReadonlyArray<string>}
 */
export const TIER_UP_LINE_IDS = Object.freeze([
  '', 'tier1', 'tier2', 'tier3', 'tier4', 'tier5', 'tier6',
]);

/**
 * LandmarkEvent.landmarkId (0..8, strictly increasing dioramaR order per
 * cityMap.LANDMARKS) -> line id.
 * Penghu has no DUAL-tagged landmark: all 9 slots have bespoke lines.
 * @type {ReadonlyArray<string>}
 */
export const LANDMARK_LINE_IDS = Object.freeze([
  'lm_double_heart',    // 0 雙心石滬
  'lm_tianhou',         // 1 天后宮
  'lm_basalt',          // 2 大菓葉玄武岩
  'lm_whale_cave',      // 3 鯨魚洞
  'lm_siyu_lighthouse', // 4 西嶼燈塔
  'lm_zhongyang',       // 5 中央老街
  'lm_guanyinting',     // 6 觀音亭
  'lm_airport',         // 7 澎湖機場
  'lm_crosssea',        // 8 跨海大橋 (goal)
]);

/**
 * CollectEvent.collectibleId (0..12, Penghu canonical album) -> line id.
 * Unknown future ids fall back to 'col_generic'.
 * @type {ReadonlyArray<string>}
 */
export const COLLECT_LINE_IDS = Object.freeze([
  'col_bear',           //  0 台灣黑熊
  'col_cactus_ice',     //  1 仙人掌冰
  'col_brown_sugar',    //  2 黑糖糕
  'col_seafood_noodles',//  3 海鮮麵線
  'col_dried_squid',    //  4 小卷乾
  'col_peanut',         //  5 花生酥
  'col_wind_lion',      //  6 風獅爺
  'col_fishing_boat',   //  7 漁船
  'col_sea_urchin',     //  8 海膽
  'col_coral',          //  9 珊瑚
  'col_stone_house',    // 10 石頭屋
  'col_oyster',         // 11 牡蠣
  'col_mazu',           // 12 媽祖
]);

/**
 * Penghu has no DUAL-tagged collectible/landmark pair.
 * DUAL_COLLECTIBLE_ID = -1 (sentinel: donack.js skips LANDMARK if
 * p.landmarkId === DUAL_LANDMARK_ID; -1 never matches a real id).
 */
export const DUAL_COLLECTIBLE_ID = -1;
export const DUAL_LANDMARK_ID = -1;

/**
 * First-absorb-per-category: ScoreEvent.archetypeCode -> line id.
 * Penghu codes: code = tier*10 + slot (same formula as the legacy engine).
 *   T0 (0-7): small everyday items — marble triggers 'first_marble', shell triggers 'first_shell'
 *   T1 (10-19): 海鮮攤 consumables
 *   T2 (20-29): 漁港 objects — red_plastic_chair (20), rice_cooker (22)
 *   T3 (30-39): 馬公街道 — scooter (30)
 *   T4 (40-49): 馬公街區 — city_bus (44) first_bus; stone_house(40) first_building
 *   T5 (50-59): 漁港商區 — fishery_building (50) first_tower
 *   T6 (60-69): 離島天際線 — wind_turbine (60) first_tower (shared)
 * @type {Readonly<Record<number, string>>}
 */
export const FIRST_LINE_BY_CODE = Object.freeze({
  // T0: small items trigger generic marble quip (codes 0-7), shell (3) gets own line
  0: 'first_marble', 1: 'first_marble', 2: 'first_marble', 3: 'first_shell',
  4: 'first_marble', 5: 'first_marble', 6: 'first_marble', 7: 'first_marble',
  // T1: 海鮮攤 — all share marble category
  10: 'first_marble', 11: 'first_marble', 12: 'first_marble',
  13: 'first_marble', 14: 'first_marble', 15: 'first_marble',
  16: 'first_marble', 17: 'first_marble',
  // T2: 漁港碼頭 — red_plastic_chair (20), rice_cooker (22)
  20: 'first_chair', 21: 'first_chair', 22: 'first_ricecooker',
  23: 'first_chair', 24: 'first_chair', 25: 'first_chair',
  26: 'first_chair', 27: 'first_chair',
  // T3: 馬公街道 — scooter (30) gets own line; rest share scooter category
  30: 'first_scooter', 31: 'first_scooter', 32: 'first_scooter',
  33: 'first_scooter', 34: 'first_scooter', 35: 'first_scooter',
  36: 'first_scooter', 37: 'first_scooter',
  // T4: 馬公街區 — bus (44) gets own line; rest are 'first_building'
  40: 'first_building', 41: 'first_building', 42: 'first_building',
  43: 'first_building', 44: 'first_bus', 45: 'first_building',
  46: 'first_building', 47: 'first_building',
  // T5/T6: towers
  50: 'first_tower', 51: 'first_tower', 52: 'first_tower',
  53: 'first_tower', 54: 'first_tower', 55: 'first_tower',
  56: 'first_tower', 57: 'first_tower',
  60: 'first_tower', 61: 'first_tower', 62: 'first_tower',
  63: 'first_tower', 64: 'first_tower', 65: 'first_tower',
  66: 'first_tower', 67: 'first_tower',
});
