/**
 * @file packs/taitung/narration.js — 月牙 (Formosan black bear) narration table
 * for the Taitung pack.
 *
 * Mirrors the exact data shape of src/config/donackLines.js but with
 * zh-TW Taitung content authored for 月牙's voice: warm, friendly, slightly
 * playful; drops Taitung trivia and cheers the player on. No Japanese, no
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
 *   LANDMARK_LINE_IDS     landmarkId -> id (0=鐵花村..7=知本溫泉)
 *   COLLECT_LINE_IDS      collectibleId -> id (0..12)
 *   FIRST_LINE_BY_CODE    archetypeCode -> id
 *   DUAL_COLLECTIBLE_ID   (none in Taitung — export 'no-dual' sentinel -1)
 *   DUAL_LANDMARK_ID      (-1: donack.js skips landmark if id === DUAL_LANDMARK_ID)
 *
 * Taitung collectible album (P7 canonical list, ids 0-12):
 *   0 釋迦  1 飛魚  2 小米酒  3 原民串珠  4 熱氣球
 *   5 池上便當  6 拼板舟  7 馬告香腸  8 山豬肉
 *   9 排灣陶壺  10 衝浪板  11 台灣黑熊  12 媽祖
 *
 * Taitung landmark order (landmarkId = array index in cityMap.LANDMARKS):
 *   0 鐵花村  1 台東車站  2 池上米倉  3 金城武樹
 *   4 都蘭糖廠  5 鹿野高台熱氣球  6 阿美族民俗中心  7 知本溫泉
 *   (goal = 三仙台八拱橋, handled separately via monument.js)
 *
 * First-absorb archetype codes (Taitung tier layout, code = tier*10 + slot):
 *   T0 = 0-9  (彈珠/橡皮擦/圖釘/小米酒蓋/釋迦糖/尪仔標/鉛筆/鈕扣 + chunk lm)
 *   T1 = 10-19 (米酒/烤山豬肉串/小米粽/馬告香腸/飛魚乾/釋迦/紅白袋/原民串珠 + chunk lm)
 *   T2 = 20-29 (紅塑膠椅/安全帽/電鍋/瓦斯桶/三角錐/消防栓/原民木雕/公共腳踏車樁 + chunk lm)
 *   T3 = 30-39 (機車/小貨車/伯朗大道路標/稻田棧道/金城武樹/稻草人/大片稻田/田邊水牛 + chunk lm)
 *   T4 = 40-49 (透天厝/鐵皮屋/部落公寓/超商/公車/垃圾車/加油站/騎樓柱 + chunk lm)
 *   T5 = 50-59 (民宿大樓/衝浪店/台鐵高架/跨海天橋/停車塔/觀光看板/玻璃帷幕街屋/漁會 + chunk lm)
 *   T6 = 60-69 (熱氣球/珊瑚礁岩/海岸漁船/浮標/民宿塔/漁港吊車/觀光旅館/海岸大樓 + chunk lm)
 *
 * Id contract: append-only. Never reuse or rename existing ids.
 * Static data only — zero runtime allocation beyond module init.
 */

/** @typedef {{text:string, priority:number, expression:string, once:boolean, phase:string}} DonackLine */

const PLAY = 'play';

/**
 * The 月牙 Taitung narration table.
 * @type {Readonly<Record<string, Readonly<DonackLine>>>}
 */
export const DONACK_LINES = Object.freeze({

  /* ---- run start ---- */
  start: Object.freeze({
    text: '從台東市區出發！光的箭頭指著下一個目標，一起滾向太平洋',
    priority: 2, expression: 'idle', once: true, phase: PLAY,
  }),

  /* ---- tier-ups (index via TIER_UP_LINE_IDS[tierIndex]) ---- */
  // tier0 is the starting tier — no tier-up INTO tier 0; index 0 slot left ''
  tier1: Object.freeze({
    text: '進鐵花夜市了！彩色氣球燈籠亮起來，原民風味撲鼻而來',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier2: Object.freeze({
    text: '正氣路騎樓！台東市區的老街風情，釋迦攤一攤接一攤',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier3: Object.freeze({
    text: '伯朗大道！稻田、田埂、金城武樹，這裡是台灣最美的風景',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier4: Object.freeze({
    text: '部落街屋和廟都滾進來了！感覺好像有阿公阿嬤的味道',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier5: Object.freeze({
    text: '海濱觀光區！衝浪店、民宿，熱氣球季的人潮就是這麼熱鬧',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier6: Object.freeze({
    text: '海岸天際線！三仙台就在前面，八座拱橋等著你',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),

  /* ---- first-absorb-per-category (index via FIRST_LINE_BY_CODE) ---- */
  first_marble: Object.freeze({
    text: '彈珠一顆！每顆大滾球都是從小東西開始的',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_millet: Object.freeze({
    text: '小米酒！原住民的智慧結晶，每一口都是祝福',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_chair: Object.freeze({
    text: '紅塑膠椅！辦桌、選舉、廟會都少不了它',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_ricecooker: Object.freeze({
    text: '電鍋！台灣人的靈魂廚具，池上米配它剛剛好',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_scooter: Object.freeze({
    text: '機車來了！台東雖然不擠，但機車還是很方便',
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
  first_balloon: Object.freeze({
    text: '熱氣球！鹿野高台的夏天風景，現在是你的了',
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
    text: '衝刺蓄滿了，找條稻田田埂全速衝一波',
    priority: 0, expression: 'thinking', once: false, phase: PLAY,
  }),
  tip_edge: Object.freeze({
    text: '快到海邊了，轉個彎繞回市區',
    priority: 1, expression: 'thinking', once: false, phase: PLAY,
  }),

  /* ---- landmark trivia (index via LANDMARK_LINE_IDS[landmarkId]) ---- */
  lm_tiehua: Object.freeze({
    text: '鐵花村！彩色熱氣球燈籠掛滿整條街，文創與原民風味的交會點',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_station: Object.freeze({
    text: '台東車站！通往花東縱谷的起點，也是回家的門',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_chishang: Object.freeze({
    text: '池上米倉！冠軍米的故鄉，每一粒都是農民的驕傲',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_takeshi: Object.freeze({
    text: '金城武樹！因為一支廣告紅到國際，這棵茄苳樹是伯朗大道的象徵',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_dulan: Object.freeze({
    text: '都蘭糖廠！日治時代的製糖廠，現在是藝術家和衝浪客的聚落',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_luye: Object.freeze({
    text: '鹿野高台！每年夏天熱氣球升空，草地上滿滿都是追夢的人',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_amis: Object.freeze({
    text: '阿美族民俗中心！傳統竹屋、歌舞表演，原住民文化的活教室',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_jhihben: Object.freeze({
    text: '知本溫泉！泡完湯泡一泡，台東的旅程畫下完美句點',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),

  /* ---- goal call ---- */
  goal_call: Object.freeze({
    text: '三仙台八拱橋在呼喚你，月牙幫你加油！',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),

  /* ---- collectibles (index via COLLECT_LINE_IDS[collectibleId]) ---- */
  col_generic: Object.freeze({
    text: '收藏品到手！相簿又多一頁了',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_sugar_apple: Object.freeze({
    text: '釋迦！台東特產第一名，一顆顆綠色鱗片包著乳白甜蜜',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_flying_fish: Object.freeze({
    text: '飛魚！達悟族的聖魚，蘭嶼的季節信使',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_millet_wine: Object.freeze({
    text: '小米酒！原住民的智慧，喝一口就是祝福',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_beads: Object.freeze({
    text: '原民串珠！每一顆珠子都有故事，排灣族的珍寶',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_balloon: Object.freeze({
    text: '熱氣球！鹿野高台的夏天標誌，五彩繽紛飛上天',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_bento: Object.freeze({
    text: '池上便當！木盒、冠軍米、滷肉，這是台灣便當的極致',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_boat: Object.freeze({
    text: '拼板舟！達悟族的海上座騎，紅白黑三色的驕傲',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_makao: Object.freeze({
    text: '馬告香腸！山胡椒的香氣，原民風味烤肉必點',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_boar: Object.freeze({
    text: '山豬肉！原住民獵人的獎賞，烤起來香氣四溢',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_pot: Object.freeze({
    text: '排灣陶壺！祖靈的居所，排灣族最神聖的傳家寶',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_surfboard: Object.freeze({
    text: '衝浪板！東河金樽的浪，等著你來挑戰',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_bear: Object.freeze({
    text: '台灣黑熊！月牙的家族！胸前那個月牙紋就是我的標誌',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_mazu: Object.freeze({
    text: '媽祖！台灣最多信眾的神明，繞境一走就是好幾天',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),

  /* ---- finale / result ---- */
  goal_contact: Object.freeze({
    text: '滾完三仙台八拱橋！月牙陪你走過海上彩虹！',
    priority: 3, expression: 'speaking', once: true, phase: 'cinematic',
  }),
  ascension: Object.freeze({
    text: '哇…從三仙台看太平洋，日出的第一道光就照在這裡',
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
 * 7-tier Taitung table.
 * @type {ReadonlyArray<string>}
 */
export const TIER_UP_LINE_IDS = Object.freeze([
  '', 'tier1', 'tier2', 'tier3', 'tier4', 'tier5', 'tier6',
]);

/**
 * LandmarkEvent.landmarkId (0..7, strictly increasing dioramaR order per
 * cityMap.LANDMARKS) -> line id.
 * Taitung has no DUAL-tagged landmark: all 8 slots have bespoke lines.
 * @type {ReadonlyArray<string>}
 */
export const LANDMARK_LINE_IDS = Object.freeze([
  'lm_tiehua',    // 0 鐵花村
  'lm_station',   // 1 台東車站
  'lm_chishang',  // 2 池上米倉
  'lm_takeshi',   // 3 金城武樹
  'lm_dulan',     // 4 都蘭糖廠
  'lm_luye',      // 5 鹿野高台熱氣球
  'lm_amis',      // 6 阿美族民俗中心
  'lm_jhihben',   // 7 知本溫泉
]);

/**
 * CollectEvent.collectibleId (0..12, Taitung canonical P7 album) -> line id.
 * Unknown future ids fall back to 'col_generic'.
 * @type {ReadonlyArray<string>}
 */
export const COLLECT_LINE_IDS = Object.freeze([
  'col_sugar_apple',  //  0 釋迦
  'col_flying_fish',  //  1 飛魚
  'col_millet_wine',  //  2 小米酒
  'col_beads',        //  3 原民串珠
  'col_balloon',      //  4 熱氣球
  'col_bento',        //  5 池上便當
  'col_boat',         //  6 拼板舟
  'col_makao',        //  7 馬告香腸
  'col_boar',         //  8 山豬肉
  'col_pot',          //  9 排灣陶壺
  'col_surfboard',    // 10 衝浪板
  'col_bear',         // 11 台灣黑熊
  'col_mazu',         // 12 媽祖
]);

/**
 * Taitung has no DUAL-tagged collectible/landmark pair.
 * DUAL_COLLECTIBLE_ID = -1 (sentinel: donack.js skips LANDMARK if
 * p.landmarkId === DUAL_LANDMARK_ID; -1 never matches a real id).
 */
export const DUAL_COLLECTIBLE_ID = -1;
export const DUAL_LANDMARK_ID = -1;

/**
 * First-absorb-per-category: ScoreEvent.archetypeCode -> line id.
 * Taitung codes: code = tier*10 + slot (same formula as the legacy engine).
 *   T0 (0-7): small everyday items — marble triggers 'first_marble'
 *   T1 (10-19): 鐵花夜市 consumables — millet items (code 10) triggers 'first_millet'
 *   T2 (20-29): 正氣路騎樓 — red_plastic_chair (20), rice_cooker (22)
 *   T3 (30-39): 伯朗大道 — scooter (30)
 *   T4 (40-49): 部落街屋 — city_bus (44) first_bus; townhouse(40) first_building
 *   T5 (50-59): 海濱觀光區 — minsu_building (50) first_building
 *   T6 (60-69): 海岸天際線 — hot_air_balloon (60) first_balloon
 * @type {Readonly<Record<number, string>>}
 */
export const FIRST_LINE_BY_CODE = Object.freeze({
  // T0: small items trigger generic marble quip (codes 0-7)
  0: 'first_marble', 1: 'first_marble', 2: 'first_marble', 3: 'first_marble',
  4: 'first_marble', 5: 'first_marble', 6: 'first_marble', 7: 'first_marble',
  // T1: 鐵花夜市 — rice_wine/millet items (slot 0 = code 10) gets own line
  10: 'first_millet', 11: 'first_millet', 12: 'first_millet',
  13: 'first_millet', 14: 'first_millet', 15: 'first_millet',
  16: 'first_marble', 17: 'first_millet',
  // T2: 正氣路騎樓 — red_plastic_chair (20), rice_cooker (22)
  20: 'first_chair', 21: 'first_chair', 22: 'first_ricecooker',
  23: 'first_chair', 24: 'first_chair', 25: 'first_chair',
  26: 'first_chair', 27: 'first_chair',
  // T3: 伯朗大道 — scooter (30) gets own line; rest share scooter category
  30: 'first_scooter', 31: 'first_scooter', 32: 'first_scooter',
  33: 'first_scooter', 34: 'first_scooter', 35: 'first_scooter',
  36: 'first_scooter', 37: 'first_scooter',
  // T4: 部落街屋 — bus (44) gets own line; rest are 'first_building'
  40: 'first_building', 41: 'first_building', 42: 'first_building',
  43: 'first_building', 44: 'first_bus', 45: 'first_building',
  46: 'first_building', 47: 'first_building',
  // T5: 海濱觀光區 — buildings
  50: 'first_building', 51: 'first_building', 52: 'first_building',
  53: 'first_building', 54: 'first_building', 55: 'first_building',
  56: 'first_building', 57: 'first_building',
  // T6: 海岸天際線 — hot_air_balloon (60) first_balloon
  60: 'first_balloon', 61: 'first_balloon', 62: 'first_balloon',
  63: 'first_balloon', 64: 'first_balloon', 65: 'first_balloon',
  66: 'first_balloon', 67: 'first_balloon',
});
