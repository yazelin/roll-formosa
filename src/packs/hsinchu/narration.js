/**
 * @file packs/hsinchu/narration.js — 月牙 (Formosan black bear) narration
 * table for the Hsinchu pack.
 *
 * Mirrors the exact data shape of src/config/donackLines.js but with zh-TW
 * 新竹 content authored for 月牙's voice: warm, friendly, slightly playful,
 * wind-city / tech-hub 風城味. Drops 新竹 trivia and cheers the player on.
 * No Japanese, no legacy references.
 *
 * Line shape (frozen contract, same as config/donackLines.js):
 *   { text:string, priority:0|1|2|3,
 *     expression:'idle'|'happy'|'thinking'|'speaking',
 *     once:boolean, phase:'title'|'play'|'cinematic'|'result' }
 *
 * Lookup maps (consumed by ui/donack.js when it reads activePack.narration):
 *   DONACK_LINES          id -> line
 *   TIER_UP_LINE_IDS      tierIndex -> id  (index 0 unused)
 *   LANDMARK_LINE_IDS     landmarkId -> id (0=新竹火車站..8=城隍廟/goal)
 *   COLLECT_LINE_IDS      collectibleId -> id (0..12)
 *   FIRST_LINE_BY_CODE    archetypeCode -> id
 *   DUAL_COLLECTIBLE_ID   (none — export -1 sentinel)
 *   DUAL_LANDMARK_ID      (-1: donack.js skips landmark if id === DUAL_LANDMARK_ID)
 *
 * Hsinchu collectible album (ids 0-12):
 *   0 新竹貢丸  1 米粉  2 柿餅  3 玻璃藝品  4 晶片  5 風獅爺
 *   6 蒸汽火車模型  7 鴨香飯碗  8 台灣黑熊  9 蔥抓餅  10 竹筷
 *   11 客家擂茶  12 媽祖
 *
 * Hsinchu landmark order (landmarkId = array index in cityMap.LANDMARKS):
 *   0 新竹火車站  1 東門城  2 玻璃工藝博物館  3 新竹動物園  4 清華大學大門
 *   5 科學園區探索館  6 十七公里海岸風車  7 青草湖大佛  8 新竹城隍廟 (goal)
 *
 * First-absorb archetype codes (Hsinchu tier layout, code = tier*10 + slot).
 *
 * Id contract: append-only.  Never reuse or rename existing ids.
 * Static data only — zero runtime allocation beyond module init.
 */

/** @typedef {{text:string, priority:number, expression:string, once:boolean, phase:string}} DonackLine */

const PLAY = 'play';

/**
 * The 月牙 Hsinchu narration table.
 * @type {Readonly<Record<string, Readonly<DonackLine>>>}
 */
export const DONACK_LINES = Object.freeze({

  /* ---- run start ---- */
  start: Object.freeze({
    text: '從城隍廟口出發！光的箭頭指著下一站，跟上囉',
    priority: 2, expression: 'idle', once: true, phase: PLAY,
  }),

  /* ---- tier-ups (index via TIER_UP_LINE_IDS[tierIndex]) ---- */
  // tier0 is the starting tier — no tier-up INTO tier 0; index 0 slot left ''
  tier1: Object.freeze({
    text: '到城隍廟夜市了！貢丸米粉的香味撲鼻而來',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier2: Object.freeze({
    text: '護城河騎樓！風城的老街區就是這個味道',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier3: Object.freeze({
    text: '東門街巷出現了！新竹古城的氣息還留在這裡',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier4: Object.freeze({
    text: '整排北門街屋和廟都滾入來了，真澎湃',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier5: Object.freeze({
    text: '進入科學園區！晶圓廠、辦公大樓都是你的了',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier6: Object.freeze({
    text: '風城天際線！城隍廟就在前方等著你了',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),

  /* ---- first-absorb-per-category (index via FIRST_LINE_BY_CODE) ---- */
  first_marble: Object.freeze({
    text: '彈珠一顆！每顆大滾球都是從小東西開始的',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_meatball: Object.freeze({
    text: '貢丸！新竹名產，Q彈有勁就是這個味',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_chair: Object.freeze({
    text: '紅塑膠椅！辦桌、廟會、米粉攤都少不了它',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_noodle_rack: Object.freeze({
    text: '米粉曬架！新竹米粉要靠九降風才能曬得乾透',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_scooter: Object.freeze({
    text: '機車來了！風城的風大，騎車可要穩穩的',
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
    text: '摩天樓！新竹的科技天際線現在是你的了',
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
  lm_hsinchu_station: Object.freeze({
    text: '新竹火車站！日治時期的巴洛克風建築，全台最老的現役車站',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_dongmen: Object.freeze({
    text: '東門城！竹塹城的舊城門，新竹市定古蹟的代表',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_glass_museum: Object.freeze({
    text: '玻璃工藝博物館！新竹公園裡的玻璃殿堂，風城玻璃產業的驕傲',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_hsinchu_zoo: Object.freeze({
    text: '新竹動物園！重新開幕後超熱門，沒有籠子的動物園這裡先行',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_tsing_hua: Object.freeze({
    text: '清華大學！梅園、成功湖，培養出無數科技人才的學府',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_science_park: Object.freeze({
    text: '科學園區探索館！台灣半導體奇蹟的起點就在這裡',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_seventeen_km: Object.freeze({
    text: '十七公里海岸風車！沿著海岸線騎腳踏車，風大到會被吹跑',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_big_buddha: Object.freeze({
    text: '青草湖大佛！坐鎮湖畔的大佛，是新竹人的共同記憶',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_chenghuang: Object.freeze({
    text: '新竹城隍廟！創建於清雍正年間，官階最高的城隍爺在這裡',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),

  /* ---- goal call ---- */
  goal_call: Object.freeze({
    text: '新竹城隍廟在呼喚你，月牙幫你加油！',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),

  /* ---- collectibles (index via COLLECT_LINE_IDS[collectibleId]) ---- */
  col_generic: Object.freeze({
    text: '收藏品到手！相簿又多一頁了',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_meatball: Object.freeze({
    text: '新竹貢丸！Q彈帶勁，一咬就爆汁，全台灣都知道的名產',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_rice_noodle: Object.freeze({
    text: '新竹米粉！靠九降風才能曬出這樣細緻的口感',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_persimmon: Object.freeze({
    text: '柿餅！新埔的秋天就是這個味道，一顆顆橘紅色的太陽',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_glass: Object.freeze({
    text: '玻璃藝品！新竹曾是台灣玻璃工藝的重鎮',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_chip: Object.freeze({
    text: '晶片！新竹科學園區製造的，全世界的電子產品都靠它',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_wind_lion: Object.freeze({
    text: '風獅爺！風城的守護神，擋住九降風的煞氣',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_train: Object.freeze({
    text: '蒸汽火車模型！紀念新竹車站的百年歷史',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_duck: Object.freeze({
    text: '鴨香飯碗！城隍廟口的排隊美食，月牙也很想吃一碗',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_bear: Object.freeze({
    text: '台灣黑熊！月牙的家族！胸前那個月牙紋就是我的標誌',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_scallion: Object.freeze({
    text: '蔥抓餅！城隍廟夜市的人氣攤位，排隊也甘願',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_chopsticks: Object.freeze({
    text: '竹筷！新竹古時候產很多竹子，地名就是這麼來的',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_lei_cha: Object.freeze({
    text: '客家擂茶！新竹有很多客家庄，這是傳統的待客之道',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_mazu: Object.freeze({
    text: '媽祖！台灣最多信眾的神明，繞境一走就是好幾天',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),

  /* ---- finale / result ---- */
  goal_contact: Object.freeze({
    text: '滾完新竹城隍廟！月牙陪你參拜！',
    priority: 3, expression: 'speaking', once: true, phase: 'cinematic',
  }),
  ascension: Object.freeze({
    text: '哇…從這麼高的地方看新竹，九降風都吹不到我們了',
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
 * 7-tier Hsinchu table.
 * @type {ReadonlyArray<string>}
 */
export const TIER_UP_LINE_IDS = Object.freeze([
  '', 'tier1', 'tier2', 'tier3', 'tier4', 'tier5', 'tier6',
]);

/**
 * LandmarkEvent.landmarkId (0..8, strictly increasing dioramaR order per
 * cityMap.LANDMARKS) -> line id.
 * Hsinchu has no DUAL-tagged landmark: all 9 slots have bespoke lines.
 * @type {ReadonlyArray<string>}
 */
export const LANDMARK_LINE_IDS = Object.freeze([
  'lm_hsinchu_station', // 0 新竹火車站
  'lm_dongmen',         // 1 東門城
  'lm_glass_museum',    // 2 玻璃工藝博物館
  'lm_hsinchu_zoo',     // 3 新竹動物園
  'lm_tsing_hua',       // 4 清華大學大門
  'lm_science_park',    // 5 科學園區探索館
  'lm_seventeen_km',    // 6 十七公里海岸風車
  'lm_big_buddha',      // 7 青草湖大佛
  'lm_chenghuang',      // 8 新竹城隍廟 (goal — also fires on absorb if ever triggered)
]);

/**
 * CollectEvent.collectibleId (0..12, Hsinchu canonical album) -> line id.
 * Unknown future ids fall back to 'col_generic'.
 * @type {ReadonlyArray<string>}
 */
export const COLLECT_LINE_IDS = Object.freeze([
  'col_meatball',     //  0 新竹貢丸
  'col_rice_noodle',  //  1 米粉
  'col_persimmon',    //  2 柿餅
  'col_glass',        //  3 玻璃藝品
  'col_chip',         //  4 晶片
  'col_wind_lion',    //  5 風獅爺
  'col_train',        //  6 蒸汽火車模型
  'col_duck',         //  7 鴨香飯碗
  'col_bear',         //  8 台灣黑熊
  'col_scallion',     //  9 蔥抓餅
  'col_chopsticks',   // 10 竹筷
  'col_lei_cha',      // 11 客家擂茶
  'col_mazu',         // 12 媽祖
]);

/**
 * Hsinchu has no DUAL-tagged collectible/landmark pair.
 * DUAL_COLLECTIBLE_ID = -1 (sentinel: donack.js skips LANDMARK if
 * p.landmarkId === DUAL_LANDMARK_ID; -1 never matches a real id).
 */
export const DUAL_COLLECTIBLE_ID = -1;
export const DUAL_LANDMARK_ID = -1;

/**
 * First-absorb-per-category: ScoreEvent.archetypeCode -> line id.
 * Hsinchu codes: code = tier*10 + slot (same formula as the legacy engine).
 *   T0 (0-7): small everyday items — marble triggers 'first_marble'
 *   T1 (10-19): 夜市 consumables — meatball_soup (10) triggers 'first_meatball'
 *   T2 (20-29): 護城河騎樓 objects — red_plastic_chair (20), noodle_rack (22)
 *   T3 (30-39): 東門街巷 — scooter (30)
 *   T4 (40-49): 北門街屋 — city_bus (44) first_bus; townhouse(40) first_building
 *   T5 (50-59): 科學園區 — office_tower (50) first_tower
 *   T6 (60-69): 風城天際線 — glass_highrise (60) first_tower (shared)
 * @type {Readonly<Record<number, string>>}
 */
export const FIRST_LINE_BY_CODE = Object.freeze({
  // T0: small items trigger generic marble quip (codes 0-7)
  0: 'first_marble', 1: 'first_marble', 2: 'first_marble', 3: 'first_marble',
  4: 'first_marble', 5: 'first_marble', 6: 'first_marble', 7: 'first_marble',
  // T1: 夜市 — meatball_soup (slot 0 = code 10) gets own line; others share marble category
  10: 'first_meatball', 11: 'first_meatball', 12: 'first_meatball',
  13: 'first_marble', 14: 'first_marble', 15: 'first_marble',
  16: 'first_marble', 17: 'first_marble',
  // T2: 護城河騎樓 — red_plastic_chair (20), noodle_rack (22)
  20: 'first_chair', 21: 'first_chair', 22: 'first_noodle_rack',
  23: 'first_chair', 24: 'first_chair', 25: 'first_chair',
  26: 'first_chair', 27: 'first_chair',
  // T3: 東門街巷 — scooter (30) gets own line; rest share scooter category
  30: 'first_scooter', 31: 'first_scooter', 32: 'first_scooter',
  33: 'first_scooter', 34: 'first_scooter', 35: 'first_scooter',
  36: 'first_scooter', 37: 'first_scooter',
  // T4: 北門街屋 buildings — bus (44) gets own line; rest are 'first_building'
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
