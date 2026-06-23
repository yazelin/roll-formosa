/**
 * @file packs/taichung/narration.js — 月牙 (Formosan black bear) narration table
 * for the Taichung pack.
 *
 * Mirrors the exact data shape of src/config/donackLines.js but with zh-TW
 * Taichung content in 月牙's voice: warm, friendly, a touch playful; drops
 * Taichung trivia + local in-jokes (東泉/逢甲/一中/大甲媽…) and cheers the
 * player on. 華語 for mood (distinct from 高雄's 台語). No Japanese kana.
 *
 * Line shape (frozen contract, same as config/donackLines.js):
 *   { text:string, priority:0|1|2|3,
 *     expression:'idle'|'happy'|'thinking'|'speaking',
 *     once:boolean, phase:'title'|'play'|'cinematic'|'result' }
 *
 * Lookup maps (consumed by ui/donack.js when it reads activePack.narration):
 *   DONACK_LINES          id -> line
 *   TIER_UP_LINE_IDS      tierIndex -> id  (index 0 unused)
 *   LANDMARK_LINE_IDS     landmarkId -> id (0=台中車站..8=台中之鑽/goal)
 *   COLLECT_LINE_IDS      collectibleId -> id (0..12)
 *   FIRST_LINE_BY_CODE    archetypeCode -> id
 *   DUAL_COLLECTIBLE_ID / DUAL_LANDMARK_ID  (-1: no dual-tagged pair)
 *
 * Taichung collectible album (ids 0-12):
 *   0 台灣黑熊  1 珍奶  2 太陽餅  3 宮原冰  4 大甲芋頭  5 大腸包小腸
 *   6 麻薏湯  7 繼光香香雞  8 東泉辣椒醬  9 台中肉圓  10 豐原排骨酥麵
 *   11 消波塊  12 大甲媽
 *
 * Taichung landmark order (landmarkId = array index in cityMap.LANDMARKS):
 *   0 台中車站  1 宮原眼科  2 國家歌劇院  3 彩虹眷村  4 七期市政大樓
 *   5 萬和宮  6 一中商圈  7 高美濕地  8 台中之鑽 (goal)
 *   (the extended landmarks, codes 90-98, are EXTRA scenery — no bespoke line.)
 *
 * First-absorb archetype codes (code = tier*10 + slot; chunk archetypes are the
 * pan-Taiwan street objects shared with the engine layout):
 *   T0 桌頭小物 / T1 逢甲夜市 / T2 一中騎樓 / T3 台灣大道車流(機車) /
 *   T4 南屯街屋與廟 / T5 七期商業 / T6 七期天際線
 *
 * Id contract: append-only. Never reuse or rename existing ids.
 * Static data only — zero runtime allocation beyond module init.
 */

/** @typedef {{text:string, priority:number, expression:string, once:boolean, phase:string}} DonackLine */

const PLAY = 'play';

/**
 * The 月牙 Taichung narration table.
 * @type {Readonly<Record<string, Readonly<DonackLine>>>}
 */
export const DONACK_LINES = Object.freeze({

  /* ---- run start ---- */
  start: Object.freeze({
    text: '從中區老街出發！光的箭頭指著下一站，跟上月牙囉',
    priority: 2, expression: 'idle', once: true, phase: PLAY,
  }),

  /* ---- tier-ups (index via TIER_UP_LINE_IDS[tierIndex]) ---- */
  // tier0 is the starting tier — no tier-up INTO tier 0; index 0 slot left ''
  tier1: Object.freeze({
    text: '逢甲夜市到了！全台最大的夜市，從吃到玩一條龍',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier2: Object.freeze({
    text: '一中商圈騎樓！學生的地盤，吃喝玩樂樣樣有',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier3: Object.freeze({
    text: '台灣大道車流出現了！台中的大動脈，公車機車一起跑',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier4: Object.freeze({
    text: '整排南屯老街和廟都進肚子了，犁頭店的古早味',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier5: Object.freeze({
    text: '進入七期商業區！豪宅、百貨、綠園道，台中的精華都在這',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier6: Object.freeze({
    text: '七期天際線！台中之鑽就在前面等著你了',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),

  /* ---- first-absorb-per-category (index via FIRST_LINE_BY_CODE) ---- */
  first_marble: Object.freeze({
    text: '彈珠一顆！每顆大滾球都是從小東西開始的',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_takoyaki: Object.freeze({
    text: '章魚小丸子！逢甲夜市的排隊小攤，一口一顆，月牙差點連竹籤一起滾走',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_chair: Object.freeze({
    text: '紅塑膠椅！辦桌、選舉、廟會都少不了它',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_ricecooker: Object.freeze({
    text: '電鍋！台灣人的靈魂廚具，幾乎什麼都能煮',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_scooter: Object.freeze({
    text: '機車來了！台中路寬機車多，綠燈一亮就是一片車陣',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_bus: Object.freeze({
    text: '公車吞進去了！台灣大道上的運將大哥不用再開了',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_building: Object.freeze({
    text: '整棟樓！月牙也沒想到你這麼快就長這麼大',
    priority: 1, expression: 'happy', once: true, phase: PLAY,
  }),
  first_tower: Object.freeze({
    text: '摩天樓！台中的天際線現在是你的了',
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
  lm_beimen: Object.freeze({
    text: '台中車站！1917 年的紅磚巴洛克老站，國定古蹟，新舊站三代同堂',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_longshan: Object.freeze({
    text: '宮原眼科！日治眼科改成的冰淇淋名店，紅磚立面超好拍',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_ximen: Object.freeze({
    text: '國家歌劇院！伊東豊雄的曲牆，整棟幾乎沒有直角的「聲音涵洞」',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_grand_hotel: Object.freeze({
    text: '彩虹眷村！彩虹爺爺一筆一筆畫出來的，硬是救下了整個眷村',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_presidential: Object.freeze({
    text: '台中市政府！七期的玻璃帷幕大樓，新市政中心就坐落在這',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_cks: Object.freeze({
    text: '萬和宮！南屯三百多年的媽祖廟，犁頭店的信仰中心',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_liberty_arch: Object.freeze({
    text: '一中商圈！台中學生的美食天堂，從早吃到晚都不膩',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_arena: Object.freeze({
    text: '高美濕地！夕陽配大風車，木棧道一路走到海中央',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_taipei101: Object.freeze({
    text: '台中之鑽！225 公尺，台中第一高樓，要捲進去嗎',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),

  /* ---- goal call ---- */
  goal_call: Object.freeze({
    text: '台中之鑽在呼喚你，月牙幫你加油！',
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
  col_boba: Object.freeze({
    text: '珍珠奶茶！台中春水堂發明的，台灣之光就是從這裡開始',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_chicken_chop: Object.freeze({
    text: '太陽餅！台中第一伴手禮，層層酥皮裡其實沒有太陽',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_gua_bao: Object.freeze({
    text: '宮原眼科冰淇淋！口味多到挑不完，排隊也要吃上一支',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_xiaolongbao: Object.freeze({
    text: '大甲芋頭！鬆綿香甜，芋頭控的最愛，做冰做酥都好吃',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_pineapple_cake: Object.freeze({
    text: '大腸包小腸！糯米腸夾烤香腸，逢甲夜市的經典組合',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_electronic_prince: Object.freeze({
    text: '麻薏湯！台中限定的消暑湯品，墨綠色喝起來滿滿古早味',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_puppet: Object.freeze({
    text: '繼光香香雞！台中繼光街起家的鹽酥雞，香香的最涮嘴',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_youbike: Object.freeze({
    text: '東泉辣椒醬！台中人的本命辣醬，炒麵、肉圓什麼都要加',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_pres_office: Object.freeze({
    text: '台中肉圓！皮 Q 餡實淋上紅醬，台中人的下午點心',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_gondola: Object.freeze({
    text: '豐原排骨酥麵！廟東夜市的招牌，炸排骨配湯麵超滿足',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_shihlin_chicken: Object.freeze({
    text: '消波塊！海邊的混凝土四腳獸，台灣海岸線的守護者',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_mazu: Object.freeze({
    text: '大甲媽！大甲鎮瀾宮的媽祖，每年遶境九天八夜萬人空巷',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),

  /* ---- finale / result ---- */
  goal_contact: Object.freeze({
    text: '滾完台中之鑽！月牙陪你登頂！',
    priority: 3, expression: 'speaking', once: true, phase: 'cinematic',
  }),
  ascension: Object.freeze({
    text: '哇…從這麼高的地方看台中，燈火漂亮得像星星',
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
 * @type {ReadonlyArray<string>}
 */
export const TIER_UP_LINE_IDS = Object.freeze([
  '', 'tier1', 'tier2', 'tier3', 'tier4', 'tier5', 'tier6',
]);

/**
 * LandmarkEvent.landmarkId (0..8, strictly increasing dioramaR order per
 * cityMap.LANDMARKS) -> line id. Keys are historical (lm_beimen…); the TEXT is
 * the Taichung landmark at that slot. The goal slot (8) reuses lm_taipei101.
 * @type {ReadonlyArray<string>}
 */
export const LANDMARK_LINE_IDS = Object.freeze([
  'lm_beimen',       // 0 台中車站
  'lm_longshan',     // 1 宮原眼科
  'lm_ximen',        // 2 國家歌劇院
  'lm_grand_hotel',  // 3 彩虹眷村
  'lm_presidential', // 4 七期市政大樓
  'lm_cks',          // 5 萬和宮
  'lm_liberty_arch', // 6 一中商圈
  'lm_arena',        // 7 高美濕地
  'lm_taipei101',    // 8 台中之鑽 (goal — also fires on absorb if ever triggered)
]);

/**
 * CollectEvent.collectibleId (0..12) -> line id. Keys are historical; the TEXT
 * is the Taichung album item at that id. Unknown ids fall back to 'col_generic'.
 * @type {ReadonlyArray<string>}
 */
export const COLLECT_LINE_IDS = Object.freeze([
  'col_bear',             //  0 台灣黑熊
  'col_boba',             //  1 珍奶
  'col_chicken_chop',     //  2 太陽餅
  'col_gua_bao',          //  3 宮原冰
  'col_xiaolongbao',      //  4 大甲芋頭
  'col_pineapple_cake',   //  5 大腸包小腸
  'col_electronic_prince',//  6 麻薏湯
  'col_puppet',           //  7 繼光香香雞
  'col_youbike',          //  8 東泉辣椒醬
  'col_pres_office',      //  9 台中肉圓
  'col_gondola',          // 10 豐原排骨酥麵
  'col_shihlin_chicken',  // 11 消波塊
  'col_mazu',             // 12 大甲媽
]);

/**
 * No DUAL-tagged collectible/landmark pair (sentinel -1 never matches).
 */
export const DUAL_COLLECTIBLE_ID = -1;
export const DUAL_LANDMARK_ID = -1;

/**
 * First-absorb-per-category: ScoreEvent.archetypeCode -> line id.
 * code = tier*10 + slot (chunk archetypes are the pan-Taiwan street objects).
 * @type {Readonly<Record<number, string>>}
 */
export const FIRST_LINE_BY_CODE = Object.freeze({
  // T0: small items trigger the generic marble quip (codes 0-7)
  0: 'first_marble', 1: 'first_marble', 2: 'first_marble', 3: 'first_marble',
  4: 'first_marble', 5: 'first_marble', 6: 'first_marble', 7: 'first_marble',
  // T1: 逢甲夜市 — takoyaki (slot 2 = code 12) gets own line; others share marble
  10: 'first_marble', 11: 'first_marble', 12: 'first_takoyaki',
  13: 'first_marble', 14: 'first_marble', 15: 'first_marble',
  16: 'first_marble', 17: 'first_marble',
  // T2: 騎樓 — red_plastic_chair (20), rice_cooker (22)
  20: 'first_chair', 21: 'first_chair', 22: 'first_ricecooker',
  23: 'first_chair', 24: 'first_chair', 25: 'first_chair',
  26: 'first_chair', 27: 'first_chair',
  // T3: 台灣大道車流 — scooter (30) gets own line; rest share scooter category
  30: 'first_scooter', 31: 'first_scooter', 32: 'first_scooter',
  33: 'first_scooter', 34: 'first_scooter', 35: 'first_scooter',
  36: 'first_scooter', 37: 'first_scooter',
  // T4: 南屯街屋 — bus (44) gets own line; rest are 'first_building'
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
