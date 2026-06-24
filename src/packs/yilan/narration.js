/**
 * @file packs/yilan/narration.js — 月牙 (Formosan black bear) narration table
 * for the Yilan pack.
 *
 * Mirrors the exact data shape of src/config/donackLines.js but with
 * zh-TW Yilan content authored for 月牙's voice: warm, friendly, slightly
 * playful; drops Yilan trivia and cheers the player on.  No Japanese, no
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
 *   LANDMARK_LINE_IDS     landmarkId -> id (0=宜蘭火車站..7=龜山島/goal)
 *   COLLECT_LINE_IDS      collectibleId -> id (0..12)
 *   FIRST_LINE_BY_CODE    archetypeCode -> id
 *   DUAL_COLLECTIBLE_ID   (none in Yilan — export 'no-dual' sentinel -1)
 *   DUAL_LANDMARK_ID      (-1: donack.js skips landmark if id === DUAL_LANDMARK_ID)
 *
 * Yilan collectible album (P7 canonical list, ids 0-12):
 *   0 三星蔥  1 蔥油餅  2 鴨賞  3 牛舌餅  4 櫻桃鴨  5 宜蘭麻糬
 *   6 黑糖糕  7 花生糖  8 宜蘭酒  9 蘇澳鮮魚  10 滷味
 *   11 幾米兔子  12 龜山島龜
 *
 * Yilan landmark order (landmarkId = array index in cityMap.LANDMARKS):
 *   0 宜蘭火車站  1 幾米廣場  2 蘭陽博物館  3 頭城老街  4 羅東林業文化園區
 *   5 傳藝中心  6 蘇澳冷泉  7 龜山島 (goal)
 *
 * First-absorb archetype codes (Yilan tier layout, code = tier*10 + slot):
 *   T0 = 0-9  (彈珠/橡皮擦/圖釘/瓶蓋/糖果/尪仔標/鉛筆/鈕扣 + chunk lm)
 *   T1 = 10-19 (養樂多/寶特瓶/青蔥/金紙/鹹鴨蛋/滷味夾/紅白袋/蔥油餅 + chunk lm)
 *   T2 = 20-29 (紅塑膠椅/安全帽/電鍋/瓦斯桶/三角錐/消防栓/招財貓/鐵馬樁 + chunk lm)
 *   T3 = 30-39 (機車/小貨車/稻草捆/霓虹招牌/鐵捲門/田間棕櫚/傳藝牌樓/田間水車 + chunk lm)
 *   T4 = 40-49 (透天厝/鐵皮屋/老公寓/超商/公車/垃圾車/加油站/宜蘭街屋 + chunk lm)
 *   T5 = 50-59 (商辦大樓/漁倉/漁港高架/跨港天橋/停車塔/港區看板/玻璃帷幕街屋/銀行 + chunk lm)
 *   T6 = 60-69 (玻璃帷幕高樓/展覽館/其他摩天樓/巨型廣告牆/圖書館塔/海音中心/屋頂機房/灣區大樓 + chunk lm)
 *
 * Id contract: append-only.  Never reuse or rename existing ids.
 * Static data only — zero runtime allocation beyond module init.
 */

/** @typedef {{text:string, priority:number, expression:string, once:boolean, phase:string}} DonackLine */

const PLAY = 'play';

/**
 * The 月牙 Yilan narration table.
 * @type {Readonly<Record<string, Readonly<DonackLine>>>}
 */
export const DONACK_LINES = Object.freeze({

  /* ---- run start ---- */
  start: Object.freeze({
    text: '從宜蘭火車站出發！沿著蘭陽平原，一路往龜山島滾去',
    priority: 2, expression: 'idle', once: true, phase: PLAY,
  }),

  /* ---- tier-ups (index via TIER_UP_LINE_IDS[tierIndex]) ---- */
  // tier0 is the starting tier — no tier-up INTO tier 0; index 0 slot left ''
  tier1: Object.freeze({
    text: '進羅東夜市了！蔥油餅香味飄來，月牙也餓了',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier2: Object.freeze({
    text: '騎樓時代！宜蘭的騎樓跟台北一樣連成一線',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier3: Object.freeze({
    text: '蘭陽平原！稻田、水車、棕櫚樹，這才是宜蘭的味道',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier4: Object.freeze({
    text: '老街屋和廟都捲進來了，傳統建築好有味道',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier5: Object.freeze({
    text: '蘇澳漁港商區！漁倉、高架、鮮魚味，全都是你的',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier6: Object.freeze({
    text: '龜山島天際線！傳藝中心和蘭陽博物館就在前面',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),

  /* ---- first-absorb-per-category (index via FIRST_LINE_BY_CODE) ---- */
  first_marble: Object.freeze({
    text: '彈珠一顆！每顆大滾球都是從小東西開始的',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_scallion: Object.freeze({
    text: '三星蔥！宜蘭最有名的特產，蔥白又粗又甜',
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
    text: '機車來了！宜蘭人也是機車族，這很正常',
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
    text: '大樓！蘭陽平原的天際線現在是你的了',
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
    text: '快到邊界了，轉個彎繞回蘭陽平原',
    priority: 1, expression: 'thinking', once: false, phase: PLAY,
  }),

  /* ---- landmark trivia (index via LANDMARK_LINE_IDS[landmarkId]) ---- */
  lm_yilan_station: Object.freeze({
    text: '宜蘭火車站！幾米的彩繪把普通車站變成觀光景點',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_jimmy_plaza: Object.freeze({
    text: '幾米廣場！《向左走，向右走》的兔子和行李箱全在這裡',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_lanyang_museum: Object.freeze({
    text: '蘭陽博物館！單面山造型像從平原長出來的石頭，超酷',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_toucheng_old_street: Object.freeze({
    text: '頭城老街！開蘭第一城，清代的紅磚厝還保留著',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_luodong_forestry: Object.freeze({
    text: '羅東林業文化園區！日治時代的太平山林場，現在是綠蔭步道',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_chuanyi_center: Object.freeze({
    text: '傳藝中心！傳統工藝、廟宇建築、布袋戲，一次看個夠',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_suao_cold_spring: Object.freeze({
    text: '蘇澳冷泉！世界上少見的碳酸氫鈣泉，泡下去冰涼到發麻',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_guishan: Object.freeze({
    text: '龜山島！宜蘭人的精神地標，從蘭陽平原任何角度都看得到',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),

  /* ---- goal call ---- */
  goal_call: Object.freeze({
    text: '龜山島在海上呼喚你，月牙幫你加油！',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),

  /* ---- collectibles (index via COLLECT_LINE_IDS[collectibleId]) ---- */
  col_generic: Object.freeze({
    text: '收藏品到手！相簿又多一頁了',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_scallion: Object.freeze({
    text: '三星蔥！蔥白肥嫩，用來煎蛋、包餅都絕配',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_scallion_pancake: Object.freeze({
    text: '蔥油餅！羅東夜市必吃，酥脆中帶蔥香',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_duck_jerky: Object.freeze({
    text: '鴨賞！用甘蔗煙燻的宜蘭名產，配飯超下飯',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_ox_tongue: Object.freeze({
    text: '牛舌餅！薄脆帶甜，宜蘭百年老店的招牌',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_cherry_duck: Object.freeze({
    text: '櫻桃鴨！宜蘭養鴨產業的驕傲，肉質細嫩',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_mochi: Object.freeze({
    text: '宜蘭麻糬！軟Q又不黏牙，傳藝中心必買',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_brown_sugar: Object.freeze({
    text: '黑糖糕！蒸得鬆軟，黑糖香氣撲鼻',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_peanut_candy: Object.freeze({
    text: '花生糖！顆顆飽滿，傳統手工製作',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_wine: Object.freeze({
    text: '宜蘭酒！中興酒廠的紅露酒和甲子蘭酒都很有名',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_suao_fish: Object.freeze({
    text: '蘇澳鮮魚！南方澳漁港的海鮮，新鮮到會彈跳',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_luwei: Object.freeze({
    text: '滷味！夜市必點，月牙特愛豆干和鴨血',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_jimmy_rabbit: Object.freeze({
    text: '幾米兔子！繪本裡的角色跳到宜蘭街頭了',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_guishan_turtle: Object.freeze({
    text: '龜山島龜！宜蘭人心中的神龜，終於收到了',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),

  /* ---- finale / result ---- */
  goal_contact: Object.freeze({
    text: '滾完龜山島！月牙陪你登島！',
    priority: 3, expression: 'speaking', once: true, phase: 'cinematic',
  }),
  ascension: Object.freeze({
    text: '哇…從龜山島看蘭陽平原，稻田和海岸線美得像畫',
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
 * 7-tier Yilan table.
 * @type {ReadonlyArray<string>}
 */
export const TIER_UP_LINE_IDS = Object.freeze([
  '', 'tier1', 'tier2', 'tier3', 'tier4', 'tier5', 'tier6',
]);

/**
 * LandmarkEvent.landmarkId (0..7, strictly increasing dioramaR order per
 * cityMap.LANDMARKS) -> line id.
 * Yilan has no DUAL-tagged landmark: all 8 slots have bespoke lines.
 * @type {ReadonlyArray<string>}
 */
export const LANDMARK_LINE_IDS = Object.freeze([
  'lm_jimmy_plaza',        // 0 幾米廣場 (dioramaR 12)
  'lm_suao_cold_spring',   // 1 蘇澳冷泉 (dioramaR 28)
  'lm_toucheng_old_street',// 2 頭城老街 (dioramaR 28)
  'lm_yilan_station',      // 3 宜蘭火車站 (dioramaR 30)
  'lm_luodong_forestry',   // 4 羅東林業文化園區 (dioramaR 32)
  'lm_lanyang_museum',     // 5 蘭陽博物館 (dioramaR 35)
  'lm_chuanyi_center',     // 6 傳藝中心 (dioramaR 35)
  'lm_guishan',            // 7 龜山島 (goal — dioramaR 250)
]);

/**
 * CollectEvent.collectibleId (0..12, Yilan canonical album) -> line id.
 * Unknown future ids fall back to 'col_generic'.
 * @type {ReadonlyArray<string>}
 */
export const COLLECT_LINE_IDS = Object.freeze([
  'col_scallion',          //  0 三星蔥
  'col_scallion_pancake',  //  1 蔥油餅
  'col_duck_jerky',        //  2 鴨賞
  'col_ox_tongue',         //  3 牛舌餅
  'col_cherry_duck',       //  4 櫻桃鴨
  'col_mochi',             //  5 宜蘭麻糬
  'col_brown_sugar',       //  6 黑糖糕
  'col_peanut_candy',      //  7 花生糖
  'col_wine',              //  8 宜蘭酒
  'col_suao_fish',         //  9 蘇澳鮮魚
  'col_luwei',             // 10 滷味
  'col_jimmy_rabbit',      // 11 幾米兔子
  'col_guishan_turtle',    // 12 龜山島龜
]);

/**
 * Yilan has no DUAL-tagged collectible/landmark pair.
 * DUAL_COLLECTIBLE_ID = -1 (sentinel: donack.js skips LANDMARK if
 * p.landmarkId === DUAL_LANDMARK_ID; -1 never matches a real id).
 */
export const DUAL_COLLECTIBLE_ID = -1;
export const DUAL_LANDMARK_ID = -1;

/**
 * First-absorb-per-category: ScoreEvent.archetypeCode -> line id.
 * Yilan codes: code = tier*10 + slot (same formula as the legacy engine).
 *   T0 (0-7): small everyday items — marble triggers 'first_marble'
 *   T1 (10-19): 羅東夜市 consumables — scallion (12) triggers 'first_scallion'
 *   T2 (20-29): 騎樓 objects — red_plastic_chair (20), rice_cooker (22)
 *   T3 (30-39): 蘭陽平原 — scooter (30)
 *   T4 (40-49): 宜蘭街屋 — city_bus (44) first_bus; townhouse(40) first_building
 *   T5 (50-59): 蘇澳漁港 — fish_warehouse (51) first_tower
 *   T6 (60-69): 龜山島天際線 — glass_highrise (60) first_tower
 * @type {Readonly<Record<number, string>>}
 */
export const FIRST_LINE_BY_CODE = Object.freeze({
  // T0: small items trigger generic marble quip (codes 0-7)
  0: 'first_marble', 1: 'first_marble', 2: 'first_marble', 3: 'first_marble',
  4: 'first_marble', 5: 'first_marble', 6: 'first_marble', 7: 'first_marble',
  // T1: 羅東夜市 — scallion (slot 2 = code 12) gets own line; others share marble category
  10: 'first_marble', 11: 'first_marble', 12: 'first_scallion',
  13: 'first_marble', 14: 'first_marble', 15: 'first_marble',
  16: 'first_marble', 17: 'first_marble',
  // T2: 騎樓 — red_plastic_chair (20), rice_cooker (22)
  20: 'first_chair', 21: 'first_chair', 22: 'first_ricecooker',
  23: 'first_chair', 24: 'first_chair', 25: 'first_chair',
  26: 'first_chair', 27: 'first_chair',
  // T3: 蘭陽平原 — scooter (30) gets own line; rest share scooter category
  30: 'first_scooter', 31: 'first_scooter', 32: 'first_scooter',
  33: 'first_scooter', 34: 'first_scooter', 35: 'first_scooter',
  36: 'first_scooter', 37: 'first_scooter',
  // T4: 宜蘭街屋 buildings — bus (44) gets own line; rest are 'first_building'
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
