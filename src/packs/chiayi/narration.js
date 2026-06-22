/**
 * @file packs/chiayi/narration.js — 月牙 (Formosan black bear) narration table
 * for the Chiayi pack.
 *
 * Mirrors the exact data shape of src/config/donackLines.js but with
 * zh-TW Chiayi content authored for 月牙's voice: warm, friendly, slightly
 * playful; drops Chiayi/Alishan trivia and cheers the player on.
 *
 * Line shape (frozen contract, same as config/donackLines.js):
 *   { text:string, priority:0|1|2|3,
 *     expression:'idle'|'happy'|'thinking'|'speaking',
 *     once:boolean, phase:'title'|'play'|'cinematic'|'result' }
 *
 * Lookup maps (consumed by ui/donack.js when it reads activePack.narration):
 *   DONACK_LINES          id -> line
 *   TIER_UP_LINE_IDS      tierIndex -> id  (index 0 unused)
 *   LANDMARK_LINE_IDS     landmarkId -> id (0=神木..8=射日塔/goal)
 *   COLLECT_LINE_IDS      collectibleId -> id (0..12)
 *   FIRST_LINE_BY_CODE    archetypeCode -> id
 *   DUAL_COLLECTIBLE_ID   (none in Chiayi — export 'no-dual' sentinel -1)
 *   DUAL_LANDMARK_ID      (-1: donack.js skips landmark if id === DUAL_LANDMARK_ID)
 *
 * Chiayi collectible album (ids 0-12):
 *   0 台灣黑熊  1 雞肉飯  2 方塊酥  3 檜木便當  4 阿里山茶  5 麻糬
 *   6 電音三太子  7 布袋戲偶  8 森林小火車  9 蛋餅  10 虱目魚
 *   11 石猴  12 媽祖
 *
 * Chiayi landmark order (landmarkId = array index in cityMap.LANDMARKS):
 *   0 阿里山神木  1 檜意森活村  2 嘉義車站  3 中央噴水池  4 文化路夜市
 *   5 嘉義公園  6 阿里山小火車  7 北港朝天宮  8 射日塔 (goal)
 *
 * Id contract: append-only.  Never reuse or rename existing ids.
 * Static data only — zero runtime allocation beyond module init.
 */

/** @typedef {{text:string, priority:number, expression:string, once:boolean, phase:string}} DonackLine */

const PLAY = 'play';

/**
 * The 月牙 Chiayi narration table.
 * @type {Readonly<Record<string, Readonly<DonackLine>>>}
 */
export const DONACK_LINES = Object.freeze({

  /* ---- run start ---- */
  start: Object.freeze({
    text: '從文化路出發！光的箭頭指著下一個目標，跟上囉',
    priority: 2, expression: 'idle', once: true, phase: PLAY,
  }),

  /* ---- tier-ups (index via TIER_UP_LINE_IDS[tierIndex]) ---- */
  tier1: Object.freeze({
    text: '進夜市了！文化路的燈光一亮，嘉義人的胃開始熱起來',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier2: Object.freeze({
    text: '騎樓時代！木都的老街屋一間接一間',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier3: Object.freeze({
    text: '機車海出現了！嘉義人最愛的交通工具',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier4: Object.freeze({
    text: '整排檜木建築都進肚子了，有檜木香嗎',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier5: Object.freeze({
    text: '車站商圈！火車站、百貨、森林鐵路起點都是你的',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier6: Object.freeze({
    text: '阿里山天際線！射日塔就在前面等著你了',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),

  /* ---- first-absorb-per-category (index via FIRST_LINE_BY_CODE) ---- */
  first_marble: Object.freeze({
    text: '彈珠一顆！每顆大滾球都是從小東西開始的',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_betelnut: Object.freeze({
    text: '檳榔！嘉南平原的特產，不過月牙可不嚼這個',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_chair: Object.freeze({
    text: '紅塑膠椅！辦桌、選舉、廟會都少不了它',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_ricecooker: Object.freeze({
    text: '電鍋！煮雞肉飯的靈魂廚具，嘉義人都懂',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_scooter: Object.freeze({
    text: '機車來了！嘉義人的日常坐騎',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_bus: Object.freeze({
    text: '公車吞進去了！往阿里山的路現在是你的了',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_building: Object.freeze({
    text: '整棟樓！月牙也沒想到你這麼快就長這麼大',
    priority: 1, expression: 'happy', once: true, phase: PLAY,
  }),
  first_tower: Object.freeze({
    text: '高塔！嘉義的天際線現在是你的了',
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
  lm_sacred_tree: Object.freeze({
    text: '阿里山神木！紅檜巨木，見證了千年的歲月',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_hinoki_village: Object.freeze({
    text: '檜意森活村！日治時代的檜木宿舍群，現在是文青散步的好地方',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_chiayi_station: Object.freeze({
    text: '嘉義車站！阿里山森林鐵路的起點，紅磚鐘樓是經典',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_central_fountain: Object.freeze({
    text: '中央噴水池！嘉義市的心臟，八條大路在這裡交會',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_wenhua_night_market: Object.freeze({
    text: '文化路夜市！雞肉飯、方塊酥、沙鍋魚頭，嘉義美食一條街',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_chiayi_park: Object.freeze({
    text: '嘉義公園！日式庭園、神社遺跡、射日塔都在這裡',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_alishan_train: Object.freeze({
    text: '阿里山小火車！紅色車廂爬過Z字形鐵道，看日出必搭',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_beigang_chaotian: Object.freeze({
    text: '北港朝天宮！媽祖信仰聖地，三月瘋媽祖就是這裡',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_sun_shooting_tower: Object.freeze({
    text: '射日塔！射下太陽的勇士，嘉義公園的地標，要巻進去嗎',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),

  /* ---- goal call ---- */
  goal_call: Object.freeze({
    text: '射日塔在呼喚你，月牙幫你加油！',
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
  col_turkey_rice: Object.freeze({
    text: '雞肉飯！嘉義的靈魂美食，一碗接一碗停不下來',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_fangkuaisu: Object.freeze({
    text: '方塊酥！酥酥脆脆的嘉義特產，一口一個太涮嘴',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_hinoki_bento: Object.freeze({
    text: '檜木便當！森林鐵路的經典味道，檜木香讓飯更香',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_alishan_tea: Object.freeze({
    text: '阿里山茶！高山烏龍茶的代表，喝一口回甘好久',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_mochi: Object.freeze({
    text: '麻糬！軟Q有嚼勁，嘉義廟口常見的小點心',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_santaizi: Object.freeze({
    text: '電音三太子！鋼鐵神像配電音，廟會最強 DJ 登場',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_budaixi: Object.freeze({
    text: '布袋戲偶！嘉義是布袋戲的故鄉，每個指偶都有自己的江湖',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_forest_train: Object.freeze({
    text: '森林小火車！嘟嘟嘟往阿里山出發，收進口袋帶著走',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_egg_pancake: Object.freeze({
    text: '蛋餅！早餐店的經典，嘉義人一天的開始',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_milkfish: Object.freeze({
    text: '虱目魚！嘉南平原的養殖魚王，煮粥煮湯都好吃',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_stone_monkey: Object.freeze({
    text: '石猴！嘉義的傳統工藝，每隻猴子都有不同的表情',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_mazu: Object.freeze({
    text: '媽祖！北港朝天宮的主神，三月瘋媽祖就是這位',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),

  /* ---- finale / result ---- */
  goal_contact: Object.freeze({
    text: '滾完射日塔！月牙陪你登頂！',
    priority: 3, expression: 'speaking', once: true, phase: 'cinematic',
  }),
  ascension: Object.freeze({
    text: '哇…從這麼高的地方看嘉義，雲海和平原都在腳下',
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
 * 7-tier Chiayi table.
 * @type {ReadonlyArray<string>}
 */
export const TIER_UP_LINE_IDS = Object.freeze([
  '', 'tier1', 'tier2', 'tier3', 'tier4', 'tier5', 'tier6',
]);

/**
 * LandmarkEvent.landmarkId (0..8, strictly increasing dioramaR order per
 * cityMap.LANDMARKS) -> line id.
 * @type {ReadonlyArray<string>}
 */
export const LANDMARK_LINE_IDS = Object.freeze([
  'lm_sacred_tree',        // 0 阿里山神木
  'lm_hinoki_village',     // 1 檜意森活村
  'lm_chiayi_station',     // 2 嘉義車站
  'lm_central_fountain',   // 3 中央噴水池
  'lm_wenhua_night_market',// 4 文化路夜市
  'lm_chiayi_park',        // 5 嘉義公園
  'lm_alishan_train',      // 6 阿里山小火車
  'lm_beigang_chaotian',   // 7 北港朝天宮
  'lm_sun_shooting_tower', // 8 射日塔 (goal)
]);

/**
 * CollectEvent.collectibleId (0..12, Chiayi album) -> line id.
 * Unknown future ids fall back to 'col_generic'.
 * @type {ReadonlyArray<string>}
 */
export const COLLECT_LINE_IDS = Object.freeze([
  'col_bear',           //  0 台灣黑熊
  'col_turkey_rice',    //  1 雞肉飯
  'col_fangkuaisu',     //  2 方塊酥
  'col_hinoki_bento',   //  3 檜木便當
  'col_alishan_tea',    //  4 阿里山茶
  'col_mochi',          //  5 麻糬
  'col_santaizi',       //  6 電音三太子
  'col_budaixi',        //  7 布袋戲偶
  'col_forest_train',   //  8 森林小火車
  'col_egg_pancake',    //  9 蛋餅
  'col_milkfish',       // 10 虱目魚
  'col_stone_monkey',   // 11 石猴
  'col_mazu',           // 12 媽祖
]);

/**
 * Chiayi has no DUAL-tagged collectible/landmark pair.
 */
export const DUAL_COLLECTIBLE_ID = -1;
export const DUAL_LANDMARK_ID = -1;

/**
 * First-absorb-per-category: ScoreEvent.archetypeCode -> line id.
 * Chiayi codes: code = tier*10 + slot (same formula as the legacy engine).
 * @type {Readonly<Record<number, string>>}
 */
export const FIRST_LINE_BY_CODE = Object.freeze({
  // T0: small items trigger generic marble quip (codes 0-7)
  0: 'first_marble', 1: 'first_marble', 2: 'first_marble', 3: 'first_marble',
  4: 'first_marble', 5: 'first_marble', 6: 'first_marble', 7: 'first_marble',
  // T1: 夜市
  10: 'first_marble', 11: 'first_marble', 12: 'first_betelnut',
  13: 'first_marble', 14: 'first_marble', 15: 'first_marble',
  16: 'first_marble', 17: 'first_marble',
  // T2: 騎樓
  20: 'first_chair', 21: 'first_chair', 22: 'first_ricecooker',
  23: 'first_chair', 24: 'first_chair', 25: 'first_chair',
  26: 'first_chair', 27: 'first_chair',
  // T3: 機車海
  30: 'first_scooter', 31: 'first_scooter', 32: 'first_scooter',
  33: 'first_scooter', 34: 'first_scooter', 35: 'first_scooter',
  36: 'first_scooter', 37: 'first_scooter',
  // T4: 檜木街屋
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
