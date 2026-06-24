/**
 * @file packs/yunlin/narration.js — 月牙 (Formosan black bear) narration table
 * for the Yunlin pack.
 *
 * Mirrors the exact data shape of src/config/donackLines.js but with
 * zh-TW Yunlin content authored for 月牙's voice: warm, friendly, slightly
 * playful; drops Yunlin trivia and cheers the player on. No Japanese, no
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
 *   LANDMARK_LINE_IDS     landmarkId -> id (0=北港朝天宮..8=西螺大橋/goal)
 *   COLLECT_LINE_IDS      collectibleId -> id (0..12)
 *   FIRST_LINE_BY_CODE    archetypeCode -> id
 *   DUAL_COLLECTIBLE_ID   (none in Yunlin — export 'no-dual' sentinel -1)
 *   DUAL_LANDMARK_ID      (-1: donack.js skips landmark if id === DUAL_LANDMARK_ID)
 *
 * Yunlin collectible album (P7 canonical list, ids 0-12):
 *   0 台灣黑熊  1 西螺醬油  2 花生  3 布袋戲偶  4 咖啡杯  5 碗粿
 *   6 電音三太子  7 布袋戲  8 斗笠  9 芋頭  10 西瓜
 *   11 甘蔗  12 媽祖
 *
 * Yunlin landmark order (landmarkId = array index in cityMap.LANDMARKS):
 *   0 北港朝天宮  1 西螺老街  2 虎尾布袋戲館  3 古坑咖啡園  4 斗六圓環
 *   5 劍湖山世界  6 斗南火車站  7 雲林布袋戲偶文物館  8 西螺大橋 (goal)
 *
 * First-absorb archetype codes (Yunlin tier layout, code = tier*10 + slot):
 *   T0 = 0-9  (戲棚腳柑仔店：彈珠/橡皮擦/圖釘/瓶蓋/戲偶頭/牙膏/鉛筆/鈕扣)
 *   T1 = 10-19 (西螺老街夜市：醬油瓶/醬菜罐/花生/滷味夾/香/金紙/紅白袋/豆花碗)
 *   T2 = 20-29 (戲院騎樓：紅塑膠椅/安全帽/電鍋/瓦斯桶/三角錐/消防栓/招財貓/農用推車)
 *   T3 = 30-39 (西螺大街：機車/小貨車/變電箱/霓虹招牌/鐵捲門/路樹/廟會棚架/石獅)
 *   T4 = 40-49 (北港街屋與廟：透天厝/鐵皮屋/公寓/宮廟香爐/公車/垃圾車/加油站/廟柱)
 *   T5 = 50-59 (古坑咖啡大道：咖啡莊園/觀光工廠/農會超市/天橋/停車塔/巨型咖啡杯招牌/玻璃溫室/農會倉庫)
 *   T6 = 60-69 (西螺大橋天際線：西螺大橋橋墩/跨河橋段/濁水溪河堤/巨型廣告牆/商辦塔/空橋/糖廠煙囪/街區大樓)
 *
 * Id contract: append-only. Never reuse or rename existing ids.
 * Static data only — zero runtime allocation beyond module init.
 */

/** @typedef {{text:string, priority:number, expression:string, once:boolean, phase:string}} DonackLine */

const PLAY = 'play';

/**
 * The 月牙 Yunlin narration table.
 * @type {Readonly<Record<string, Readonly<DonackLine>>>}
 */
export const DONACK_LINES = Object.freeze({

  /* ---- run start ---- */
  start: Object.freeze({
    text: '從西螺老街出發！光的箭頭指著下一個目標，跟上囉',
    priority: 2, expression: 'idle', once: true, phase: PLAY,
  }),

  /* ---- tier-ups (index via TIER_UP_LINE_IDS[tierIndex]) ---- */
  // tier0 is the starting tier — no tier-up INTO tier 0; index 0 slot left ''
  tier1: Object.freeze({
    text: '進夜市了！西螺老街的醬油香，台灣最道地的味道',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier2: Object.freeze({
    text: '戲院騎樓！虎尾的布袋戲館就在附近，很有文化氣息',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier3: Object.freeze({
    text: '西螺大街！這裡的老街保存得很好，慢慢逛慢慢捲',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier4: Object.freeze({
    text: '北港街屋和廟都進肚子了！媽祖婆保佑你順利過關',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier5: Object.freeze({
    text: '古坑咖啡大道！台灣咖啡的故鄉，喝一杯再上路',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier6: Object.freeze({
    text: '西螺大橋天際線！濁水溪上的紅鐵橋就在前面等你',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),

  /* ---- first-absorb-per-category (index via FIRST_LINE_BY_CODE) ---- */
  first_marble: Object.freeze({
    text: '彈珠一顆！戲棚腳的小朋友最愛玩這個',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_soysauce: Object.freeze({
    text: '醬油瓶！西螺醬油百年老店，月牙也想沾來吃',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_chair: Object.freeze({
    text: '紅塑膠椅！廟會、辦桌、看戲都少不了它',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_ricecooker: Object.freeze({
    text: '電鍋！農家的靈魂廚具，煮飯煮粥都靠它',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_scooter: Object.freeze({
    text: '機車來了！雲林人的腳，去哪都騎這台',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_bus: Object.freeze({
    text: '公車吞進去了！台西客運跑遍雲林大小鎮',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_building: Object.freeze({
    text: '整棟廟！北港朝天宮的建築真的很壯觀',
    priority: 1, expression: 'happy', once: true, phase: PLAY,
  }),
  first_tower: Object.freeze({
    text: '大橋橋墩！西螺大橋的紅色鐵架，雲林的地標',
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
    text: '快到濁水溪邊了，轉個彎繞回街上',
    priority: 1, expression: 'thinking', once: false, phase: PLAY,
  }),

  /* ---- landmark trivia (index via LANDMARK_LINE_IDS[landmarkId]) ---- */
  lm_beigang_chaotian: Object.freeze({
    text: '北港朝天宮！三百多年的媽祖廟，香火鼎盛全台知名',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_xiluo_oldstreet: Object.freeze({
    text: '西螺老街！巴洛克式的洋樓，醬油飄香的百年老街',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_huwei_puppet: Object.freeze({
    text: '虎尾布袋戲館！台灣布袋戲的發源地，金光閃閃的戲偶超厲害',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_gukeng_coffee: Object.freeze({
    text: '古坑咖啡園！台灣咖啡的故鄉，海拔剛好、日照充足',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_douliu_roundabout: Object.freeze({
    text: '斗六圓環！雲林縣治中心，圓環噴水池是在地人的約會地標',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_janfusun: Object.freeze({
    text: '劍湖山世界！摩天輪和雲霄飛車，中部最大的遊樂園',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_dounan_station: Object.freeze({
    text: '斗南火車站！日治時代的木造車站，等車的時候很有復古感',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_puppet_center: Object.freeze({
    text: '雲林布袋戲偶文物館！收藏了好多經典戲偶，每尊都是藝術品',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_xiluo_bridge: Object.freeze({
    text: '西螺大橋！1939公尺的紅色鐵橋，曾是遠東第一大橋',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),

  /* ---- goal call ---- */
  goal_call: Object.freeze({
    text: '西螺大橋在呼喚你，月牙幫你加油！',
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
  col_soysauce: Object.freeze({
    text: '西螺醬油！百年老店的黑金，滷肉飯淋一點超香',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_peanut: Object.freeze({
    text: '雲林花生！台灣花生產量第一的縣，又香又脆',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_puppet: Object.freeze({
    text: '布袋戲偶！雲林是布袋戲的故鄉，每尊戲偶都有江湖故事',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_coffee: Object.freeze({
    text: '咖啡杯！古坑咖啡，台灣自己種的精品豆',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_ricebowl: Object.freeze({
    text: '碗粿！雲林的傳統小吃，淋上醬油膏最對味',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_santaizi: Object.freeze({
    text: '電音三太子！鋼鐵神像配電音，廟會最強 DJ 登場',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_budaixi: Object.freeze({
    text: '布袋戲！掌中乾坤，一口說盡千古事',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_strawhat: Object.freeze({
    text: '斗笠！農夫下田的標配，防曬又透氣',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_taro: Object.freeze({
    text: '芋頭！雲林的芋頭田，紫色的芋泥超濃郁',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_watermelon: Object.freeze({
    text: '西瓜！二崙、崙背的西瓜最甜，夏天必吃',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_sugarcane: Object.freeze({
    text: '甘蔗！虎尾糖廠的甜蜜記憶，小火車載著甘蔗跑',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_mazu: Object.freeze({
    text: '媽祖！北港朝天宮的媽祖婆，保佑漁民平安出海',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),

  /* ---- finale / result ---- */
  goal_contact: Object.freeze({
    text: '滾完西螺大橋！月牙陪你跨過濁水溪！',
    priority: 3, expression: 'speaking', once: true, phase: 'cinematic',
  }),
  ascension: Object.freeze({
    text: '哇…從橋上看濁水溪，夕陽染紅了整片農田',
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
 * 7-tier Yunlin table.
 * @type {ReadonlyArray<string>}
 */
export const TIER_UP_LINE_IDS = Object.freeze([
  '', 'tier1', 'tier2', 'tier3', 'tier4', 'tier5', 'tier6',
]);

/**
 * LandmarkEvent.landmarkId (0..8, strictly increasing dioramaR order per
 * cityMap.LANDMARKS) -> line id.
 * Yunlin has no DUAL-tagged landmark: all 9 slots have bespoke lines.
 * @type {ReadonlyArray<string>}
 */
export const LANDMARK_LINE_IDS = Object.freeze([
  'lm_huwei_puppet',     // 0 虎尾布袋戲館
  'lm_dounan_station',   // 1 斗南火車站
  'lm_gukeng_coffee',    // 2 古坑咖啡園
  'lm_xiluo_oldstreet',  // 3 西螺老街
  'lm_puppet_center',    // 4 雲林布袋戲偶文物館
  'lm_douliu_roundabout',// 5 斗六圓環
  'lm_beigang_chaotian', // 6 北港朝天宮
  'lm_janfusun',         // 7 劍湖山世界
  'lm_xiluo_bridge',     // 8 西螺大橋 (goal — also fires on absorb if ever triggered)
]);

/**
 * CollectEvent.collectibleId (0..12, Yunlin canonical P7 album) -> line id.
 * Unknown future ids fall back to 'col_generic'.
 * @type {ReadonlyArray<string>}
 */
export const COLLECT_LINE_IDS = Object.freeze([
  'col_bear',      //  0 台灣黑熊
  'col_soysauce',  //  1 西螺醬油
  'col_peanut',    //  2 花生
  'col_puppet',    //  3 布袋戲偶
  'col_coffee',    //  4 咖啡杯
  'col_ricebowl',  //  5 碗粿
  'col_santaizi', //  6 電音三太子
  'col_budaixi',   //  7 布袋戲
  'col_strawhat',  //  8 斗笠
  'col_taro',      //  9 芋頭
  'col_watermelon',// 10 西瓜
  'col_sugarcane', // 11 甘蔗
  'col_mazu',      // 12 媽祖
]);

/**
 * Yunlin has no DUAL-tagged collectible/landmark pair.
 * DUAL_COLLECTIBLE_ID = -1 (sentinel: donack.js skips LANDMARK if
 * p.landmarkId === DUAL_LANDMARK_ID; -1 never matches a real id).
 */
export const DUAL_COLLECTIBLE_ID = -1;
export const DUAL_LANDMARK_ID = -1;

/**
 * First-absorb-per-category: ScoreEvent.archetypeCode -> line id.
 * Yunlin codes: code = tier*10 + slot (same formula as the legacy engine).
 *   T0 (0-7): small everyday items — marble triggers 'first_marble'
 *   T1 (10-19): 西螺老街夜市 — soy_sauce_bottle (10) triggers 'first_soysauce'
 *   T2 (20-29): 戲院騎樓 — red_plastic_chair (20), rice_cooker (22)
 *   T3 (30-39): 西螺大街 — scooter (30)
 *   T4 (40-49): 北港街屋與廟 — city_bus (44) first_bus; temple(40) first_building
 *   T5 (50-59): 古坑咖啡大道 — coffee_farm (50) first_tower
 *   T6 (60-69): 西螺大橋天際線 — bridge_pier (60) first_tower
 * @type {Readonly<Record<number, string>>}
 */
export const FIRST_LINE_BY_CODE = Object.freeze({
  // T0: small items trigger generic marble quip (codes 0-7)
  0: 'first_marble', 1: 'first_marble', 2: 'first_marble', 3: 'first_marble',
  4: 'first_marble', 5: 'first_marble', 6: 'first_marble', 7: 'first_marble',
  // T1: 西螺老街夜市 — soy_sauce_bottle (slot 0 = code 10) gets own line; others share marble
  10: 'first_soysauce', 11: 'first_marble', 12: 'first_marble',
  13: 'first_marble', 14: 'first_marble', 15: 'first_marble',
  16: 'first_marble', 17: 'first_marble',
  // T2: 戲院騎樓 — red_plastic_chair (20), rice_cooker (22)
  20: 'first_chair', 21: 'first_chair', 22: 'first_ricecooker',
  23: 'first_chair', 24: 'first_chair', 25: 'first_chair',
  26: 'first_chair', 27: 'first_chair',
  // T3: 西螺大街 — scooter (30) gets own line; rest share scooter category
  30: 'first_scooter', 31: 'first_scooter', 32: 'first_scooter',
  33: 'first_scooter', 34: 'first_scooter', 35: 'first_scooter',
  36: 'first_scooter', 37: 'first_scooter',
  // T4: 北港街屋與廟 — bus (44) gets own line; rest are 'first_building'
  40: 'first_building', 41: 'first_building', 42: 'first_building',
  43: 'first_building', 44: 'first_bus', 45: 'first_building',
  46: 'first_building', 47: 'first_building',
  // T5/T6: towers (bridge piers, farms, etc.)
  50: 'first_tower', 51: 'first_tower', 52: 'first_tower',
  53: 'first_tower', 54: 'first_tower', 55: 'first_tower',
  56: 'first_tower', 57: 'first_tower',
  60: 'first_tower', 61: 'first_tower', 62: 'first_tower',
  63: 'first_tower', 64: 'first_tower', 65: 'first_tower',
  66: 'first_tower', 67: 'first_tower',
});
