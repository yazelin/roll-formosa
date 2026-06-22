/**
 * @file packs/newtaipei/narration.js — 月牙 (Formosan black bear) narration table
 * for the New Taipei pack.
 *
 * Mirrors the exact data shape of src/config/donackLines.js but with
 * zh-TW New Taipei content authored for 月牙's voice: warm, friendly, slightly
 * playful; drops New Taipei trivia and cheers the player on. No Japanese, no
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
 *   LANDMARK_LINE_IDS     landmarkId -> id (0=九份..8=情人橋/goal)
 *   COLLECT_LINE_IDS      collectibleId -> id (0..12)
 *   FIRST_LINE_BY_CODE    archetypeCode -> id
 *   DUAL_COLLECTIBLE_ID   (none in New Taipei — export 'no-dual' sentinel -1)
 *   DUAL_LANDMARK_ID      (-1: donack.js skips landmark if id === DUAL_LANDMARK_ID)
 *
 * New Taipei collectible album (ids 0-12):
 *   0 阿給  1 鐵蛋  2 芋圓  3 魚丸  4 天燈  5 鶯歌花瓶
 *   6 茶壺  7 礦工燈  8 酸梅湯  9 陶碗  10 平溪小火車
 *   11 黑糖糕  12 媽祖
 *
 * New Taipei landmark order (landmarkId = array index in cityMap.LANDMARKS):
 *   0 九份老街茶樓  1 十分天燈廣場  2 鶯歌陶瓷博物館  3 三峽祖師廟  4 紅毛城
 *   5 平溪車站  6 林本源園邸  7 新北市政府  8 淡水漁人碼頭情人橋 (goal)
 *
 * First-absorb archetype codes (New Taipei tier layout, code = tier*10 + slot):
 *   T0 = 0-9  (彈珠/橡皮擦/圖釘/黑糖糕/礦工燈/尪仔標/鉛筆/鈕扣 + chunk lm)
 *   T1 = 10-19 (阿給/鐵蛋/天燈/芋圓/魚丸/酸梅湯/寶特瓶/胡椒餅 + chunk lm)
 *   T2 = 20-29 (陶碗/茶壺/紅塑膠椅/瓦斯桶/三角錐/消防栓/陶藝轉盤/花瓶 + chunk lm)
 *   T3 = 30-39 (機車/小貨車/渡輪票亭/霓虹招牌/鐵捲門/路樹/藍白渡船/石獅 + chunk lm)
 *   T4 = 40-49 (透天厝/紅磚屋/老公寓/超商/公車/垃圾車/加油站/騎樓柱 + chunk lm)
 *   T5 = 50-59 (商辦大樓/百貨/捷運高架/天橋/停車塔/巨型看板/玻璃帷幕街屋/銀行 + chunk lm)
 *   T6 = 60-69 (玻璃帷幕高樓/跨河大橋/其他摩天樓/巨型廣告牆/商辦塔/空橋/屋頂機房/河岸量體 + chunk lm)
 *
 * Id contract: append-only. Never reuse or rename existing ids.
 * Static data only — zero runtime allocation beyond module init.
 */

/** @typedef {{text:string, priority:number, expression:string, once:boolean, phase:string}} DonackLine */

const PLAY = 'play';

/**
 * The 月牙 New Taipei narration table.
 * @type {Readonly<Record<string, Readonly<DonackLine>>>}
 */
export const DONACK_LINES = Object.freeze({

  /* ---- run start ---- */
  start: Object.freeze({
    text: '從九份山城出發！追著燈籠的光，往淡水前進囉',
    priority: 2, expression: 'idle', once: true, phase: PLAY,
  }),

  /* ---- tier-ups (index via TIER_UP_LINE_IDS[tierIndex]) ---- */
  // tier0 is the starting tier — no tier-up INTO tier 0; index 0 slot left ''
  tier1: Object.freeze({
    text: '老街時間到！阿給鐵蛋滿街飄香，這才是新北的味道',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier2: Object.freeze({
    text: '鶯歌陶瓷街！騎樓下陶碗茶壺排成列，手藝比價格還要講究',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier3: Object.freeze({
    text: '淡水河岸了！夕陽下的河面金金亮，渡船鳴笛準備出航',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier4: Object.freeze({
    text: '老鎮街屋和廟都進肚子了！三峽的紅磚好有古早味',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier5: Object.freeze({
    text: '新北商業區到了！板橋和新莊的高樓也是你的',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier6: Object.freeze({
    text: '淡水天際線！情人橋就在前面閃著光等你了',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),

  /* ---- first-absorb-per-category (index via FIRST_LINE_BY_CODE) ---- */
  first_marble: Object.freeze({
    text: '彈珠一顆！九份柑仔店的回憶，從這裡開始滾',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_agei: Object.freeze({
    text: '阿給！淡水名產，油豆腐包冬粉，月牙的口袋名單',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_ceramic: Object.freeze({
    text: '陶碗！鶯歌燒出來的，每個都是獨一無二的釉色',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_teapot: Object.freeze({
    text: '茶壺！鶯歌陶瓷的代表，泡老人茶的好傢伙',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_scooter: Object.freeze({
    text: '機車來了！新北人上班通勤的標配',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_ferry: Object.freeze({
    text: '藍白渡船！八里淡水之間的水上公車',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_bus: Object.freeze({
    text: '公車吞進去了！司機大哥今天放假囉',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_building: Object.freeze({
    text: '整棟樓！月牙也沒想到你這麼快就長這麼大',
    priority: 1, expression: 'happy', once: true, phase: PLAY,
  }),
  first_tower: Object.freeze({
    text: '摩天樓！新北的天際線現在是你的了',
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
    text: '快到邊界了，轉個彎繞回山城',
    priority: 1, expression: 'thinking', once: false, phase: PLAY,
  }),

  /* ---- landmark trivia (index via LANDMARK_LINE_IDS[landmarkId]) ---- */
  lm_jiufen: Object.freeze({
    text: '九份老街茶樓！紅燈籠配山景，神隱少女的靈感就從這來',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_shifen: Object.freeze({
    text: '十分天燈廣場！把願望寫上去，放手讓它飛上天',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_yingge: Object.freeze({
    text: '鶯歌陶瓷博物館！整條街都在做陶，台灣的景德鎮',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_sanxia: Object.freeze({
    text: '三峽祖師廟！李梅樹監造五十年，每根石柱都是藝術品',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_fort: Object.freeze({
    text: '紅毛城！四百年荷蘭古堡，淡水河口的歷史守望者',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_pingxi: Object.freeze({
    text: '平溪車站！火車從頭上經過，放完天燈剛好趕那班',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_lin_garden: Object.freeze({
    text: '林本源園邸！台灣最完整的園林建築，板橋林家的百年宅第',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_cityhall: Object.freeze({
    text: '新北市政府！板橋新站旁邊，整個大新北的行政中心',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_lover_bridge: Object.freeze({
    text: '淡水漁人碼頭情人橋！白色弧線配夕陽，牽著手走過去吧',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),

  /* ---- goal call ---- */
  goal_call: Object.freeze({
    text: '情人橋在呼喚你！月牙幫你加油！',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),

  /* ---- collectibles (index via COLLECT_LINE_IDS[collectibleId]) ---- */
  col_generic: Object.freeze({
    text: '收藏品到手！相簿又多一頁了',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_agei: Object.freeze({
    text: '阿給！油豆腐包冬粉澆甜辣醬，淡水老街的招牌',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_iron_egg: Object.freeze({
    text: '鐵蛋！滷到黑亮有嚼勁，吃完一顆停不下來',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_taro_ball: Object.freeze({
    text: '芋圓！九份老街的招牌甜點，QQ彈彈配剉冰',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_fishball: Object.freeze({
    text: '魚丸！淡水渡船頭的經典，一口咬下去滿滿魚漿',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_sky_lantern: Object.freeze({
    text: '天燈！平溪放上天的願望，每盞都載著希望飛',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_yingge_vase: Object.freeze({
    text: '鶯歌花瓶！手拉坯加彩繪，每件都是工藝品',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_teapot: Object.freeze({
    text: '茶壺！泡功夫茶的好傢伙，鶯歌燒的特別溫潤',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_miner_lamp: Object.freeze({
    text: '礦工燈！九份金瓜石的記憶，照亮採金歲月',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_sour_plum: Object.freeze({
    text: '酸梅湯！淡水老街的解渴聖品，酸酸甜甜剛剛好',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_ceramic_bowl: Object.freeze({
    text: '陶碗！鶯歌師傅的手藝，吃飯喝湯都好看',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_pingxi_train: Object.freeze({
    text: '平溪小火車！穿過山林放天燈，這趟鐵道旅行很值',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_brown_sugar: Object.freeze({
    text: '黑糖糕！九份老街的傳統點心，入口就是古早味',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_mazu: Object.freeze({
    text: '媽祖！台灣最多信眾的神明，繞境一走就是好幾天',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),

  /* ---- finale / result ---- */
  goal_contact: Object.freeze({
    text: '滾完情人橋！月牙陪你看夕陽！',
    priority: 3, expression: 'speaking', once: true, phase: 'cinematic',
  }),
  ascension: Object.freeze({
    text: '哇…從橋上看淡水河口，夕陽把水面染成金色',
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
 * 7-tier New Taipei table.
 * @type {ReadonlyArray<string>}
 */
export const TIER_UP_LINE_IDS = Object.freeze([
  '', 'tier1', 'tier2', 'tier3', 'tier4', 'tier5', 'tier6',
]);

/**
 * LandmarkEvent.landmarkId (0..8, strictly increasing dioramaR order per
 * cityMap.LANDMARKS) -> line id.
 * New Taipei has no DUAL-tagged landmark: all 9 slots have bespoke lines.
 * @type {ReadonlyArray<string>}
 */
export const LANDMARK_LINE_IDS = Object.freeze([
  'lm_jiufen',       // 0 九份老街茶樓
  'lm_shifen',       // 1 十分天燈廣場
  'lm_yingge',       // 2 鶯歌陶瓷博物館
  'lm_sanxia',       // 3 三峽祖師廟
  'lm_fort',         // 4 紅毛城
  'lm_pingxi',       // 5 平溪車站
  'lm_lin_garden',   // 6 林本源園邸
  'lm_cityhall',     // 7 新北市政府
  'lm_lover_bridge', // 8 淡水漁人碼頭情人橋 (goal — also fires on absorb if ever triggered)
]);

/**
 * CollectEvent.collectibleId (0..12, New Taipei canonical album) -> line id.
 * Unknown future ids fall back to 'col_generic'.
 * @type {ReadonlyArray<string>}
 */
export const COLLECT_LINE_IDS = Object.freeze([
  'col_agei',           //  0 阿給
  'col_iron_egg',       //  1 鐵蛋
  'col_taro_ball',      //  2 芋圓
  'col_fishball',       //  3 魚丸
  'col_sky_lantern',    //  4 天燈
  'col_yingge_vase',    //  5 鶯歌花瓶
  'col_teapot',         //  6 茶壺
  'col_miner_lamp',     //  7 礦工燈
  'col_sour_plum',      //  8 酸梅湯
  'col_ceramic_bowl',   //  9 陶碗
  'col_pingxi_train',   // 10 平溪小火車
  'col_brown_sugar',    // 11 黑糖糕
  'col_mazu',           // 12 媽祖
]);

/**
 * New Taipei has no DUAL-tagged collectible/landmark pair.
 * DUAL_COLLECTIBLE_ID = -1 (sentinel: donack.js skips LANDMARK if
 * p.landmarkId === DUAL_LANDMARK_ID; -1 never matches a real id).
 */
export const DUAL_COLLECTIBLE_ID = -1;
export const DUAL_LANDMARK_ID = -1;

/**
 * First-absorb-per-category: ScoreEvent.archetypeCode -> line id.
 * New Taipei codes: code = tier*10 + slot (same formula as the legacy engine).
 *   T0 (0-7): small everyday items — marble triggers 'first_marble'
 *   T1 (10-19): 老街小吃 — agei (code 10) triggers 'first_agei'
 *   T2 (20-29): 鶯歌陶瓷 — ceramic_bowl (20), teapot (21)
 *   T3 (30-39): 淡水河岸 — scooter (30), ferry (36)
 *   T4 (40-49): 老鎮街屋 — city_bus (44) first_bus; townhouse(40) first_building
 *   T5 (50-59): 新北商業區 — office_tower (50) first_tower
 *   T6 (60-69): 淡水天際線 — glass_highrise (60) first_tower (shared)
 * @type {Readonly<Record<number, string>>}
 */
export const FIRST_LINE_BY_CODE = Object.freeze({
  // T0: small items trigger generic marble quip (codes 0-7)
  0: 'first_marble', 1: 'first_marble', 2: 'first_marble', 3: 'first_marble',
  4: 'first_marble', 5: 'first_marble', 6: 'first_marble', 7: 'first_marble',
  // T1: 老街 — agei (slot 0 = code 10) gets own line; others share marble category
  10: 'first_agei', 11: 'first_agei', 12: 'first_agei',
  13: 'first_marble', 14: 'first_marble', 15: 'first_marble',
  16: 'first_marble', 17: 'first_marble',
  // T2: 鶯歌陶瓷 — ceramic_bowl (20), teapot (21)
  20: 'first_ceramic', 21: 'first_teapot', 22: 'first_ceramic',
  23: 'first_ceramic', 24: 'first_ceramic', 25: 'first_ceramic',
  26: 'first_ceramic', 27: 'first_ceramic',
  // T3: 淡水河岸 — scooter (30) gets own line; ferry (36)
  30: 'first_scooter', 31: 'first_scooter', 32: 'first_scooter',
  33: 'first_scooter', 34: 'first_scooter', 35: 'first_scooter',
  36: 'first_ferry', 37: 'first_scooter',
  // T4: 老鎮 buildings — bus (44) gets own line; rest are 'first_building'
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
