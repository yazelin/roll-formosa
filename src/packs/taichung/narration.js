/**
 * @file packs/taipei/narration.js — 月牙 (Formosan black bear) narration table
 * for the Taipei pack.
 *
 * Mirrors the exact data shape of src/config/donackLines.js but with
 * zh-TW Taipei content authored for 月牙's voice: warm, friendly, slightly
 * playful; drops Taipei trivia and cheers the player on.  No Japanese, no
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
 *   LANDMARK_LINE_IDS     landmarkId -> id (0=北門..8=台北101/goal)
 *   COLLECT_LINE_IDS      collectibleId -> id (0..12)
 *   FIRST_LINE_BY_CODE    archetypeCode -> id
 *   DUAL_COLLECTIBLE_ID   (none in Taipei — export 'no-dual' sentinel -1)
 *   DUAL_LANDMARK_ID      (-1: donack.js skips landmark if id === DUAL_LANDMARK_ID)
 *
 * Taipei collectible album (P7 canonical list, ids 0-12):
 *   0 台灣黑熊  1 珍奶  2 雞排  3 刈包  4 小籠包  5 鳳梨酥
 *   6 電音三太子  7 布袋戲偶  8 YouBike  9 總統府  10 貓空纜車
 *   11 士林大雞排  12 媽祖
 *
 * Taipei landmark order (landmarkId = array index in cityMap.LANDMARKS):
 *   0 北門  1 龍山寺  2 西門紅樓  3 圓山大飯店  4 總統府
 *   5 中正紀念堂  6 自由廣場牌樓  7 小巨蛋  8 台北101 (goal)
 *
 * First-absorb archetype codes (Taipei tier layout, code = tier*10 + slot):
 *   T0 = 0-9  (彈珠/橡皮擦/圖釘/瓶蓋/糖果/尪仔標/鉛筆/鈕扣 + chunk lm)
 *   T1 = 10-19 (養樂多/寶特瓶/檳榔/香/金紙/滷味夾/紅白袋/胡椒餅 + chunk lm)
 *   T2 = 20-29 (紅塑膠椅/安全帽/電鍋/瓦斯桶/三角錐/消防栓/招財貓/YouBike + chunk lm)
 *   T3 = 30-39 (機車/小貨車/變電箱/霓虹招牌/鐵捲門/路樹/棚架/石獅 + chunk lm)
 *   T4 = 40-49 (透天厝/鐵皮屋/公寓/超商/公車/垃圾車/加油站/騎樓柱 + chunk lm)
 *   T5 = 50-59 (商辦大樓/百貨/捷運高架/天橋/停車塔/巨型看板/玻璃帷幕街屋/銀行 + chunk lm)
 *   T6 = 60-69 (玻璃帷幕高樓/跨橋/其他摩天樓/巨型廣告牆/商辦塔/空橋/屋頂機房/街區量體 + chunk lm)
 *
 * Id contract: append-only.  Never reuse or rename existing ids.
 * Static data only — zero runtime allocation beyond module init.
 */

/** @typedef {{text:string, priority:number, expression:string, once:boolean, phase:string}} DonackLine */

const PLAY = 'play';

/**
 * The 月牙 Taipei narration table.
 * @type {Readonly<Record<string, Readonly<DonackLine>>>}
 */
export const DONACK_LINES = Object.freeze({

  /* ---- run start ---- */
  start: Object.freeze({
    text: '從迪化街出發！光的箭頭指著下一個目標，跟上囉',
    priority: 2, expression: 'idle', once: true, phase: PLAY,
  }),

  /* ---- tier-ups (index via TIER_UP_LINE_IDS[tierIndex]) ---- */
  // tier0 is the starting tier — no tier-up INTO tier 0; index 0 slot left ''
  tier1: Object.freeze({
    text: '進夜市了！燈光一亮，台灣的夜生活才剛開始',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier2: Object.freeze({
    text: '騎樓時代！騎樓連著騎樓，台灣城市的專利',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier3: Object.freeze({
    text: '機車海出現了！這才是台北的日常交通工具',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier4: Object.freeze({
    text: '整排萬華街屋和廟都進肚子了，感覺好澎湃',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier5: Object.freeze({
    text: '進入商業文教區！銀行、百貨、捷運高架，全都是你的',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier6: Object.freeze({
    text: '信義天際線！101 就在前面等著你了',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),

  /* ---- first-absorb-per-category (index via FIRST_LINE_BY_CODE) ---- */
  first_marble: Object.freeze({
    text: '彈珠一顆！每顆大滾球都是從小東西開始的',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_betelnut: Object.freeze({
    text: '檳榔！台灣特產，不過月牙可不嚼這個',
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
    text: '機車來了！台灣每兩個人就有一台，這很正常',
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
    text: '摩天樓！台北的天際線現在是你的了',
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
    text: '北門！清朝留下來的城門，全台北保存最完整的一座',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_longshan: Object.freeze({
    text: '龍山寺！求籤、拜月老、聞香，三件事一次搞定',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_ximen: Object.freeze({
    text: '西門紅樓！日治時代的八角市場，現在是文創和展演的場地',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_grand_hotel: Object.freeze({
    text: '圓山大飯店！宮殿式屋頂下藏著六十幾年的外交故事',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_presidential: Object.freeze({
    text: '總統府！日治時代的總督府，牆上的紅磚到現在還是一樣紅',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_cks: Object.freeze({
    text: '中正紀念堂！衛兵交接每整點一次，看過的都說讚',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_liberty_arch: Object.freeze({
    text: '自由廣場牌樓！這四個字是 2007 年才改的，你知道嗎',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_arena: Object.freeze({
    text: '小巨蛋！一萬五千個座位，很多明星的台灣初登場就在這裡',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_taipei101: Object.freeze({
    text: '台北101！508 公尺，風阻尼球重達 660 噸，要巻進去嗎',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),

  /* ---- goal call ---- */
  goal_call: Object.freeze({
    text: '台北101 在呼喚你，月牙幫你加油！',
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
    text: '珍珠奶茶！台灣之光，全世界都在排隊的那種',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_chicken_chop: Object.freeze({
    text: '雞排！比臉還大的那種，夜市必點，月牙也很愛',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_gua_bao: Object.freeze({
    text: '刈包！花生粉、香菜、滷肉，台灣版漢堡的正確打開方式',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_xiaolongbao: Object.freeze({
    text: '小籠包！一口湯汁噴出來才算及格，慢慢吃別急',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_pineapple_cake: Object.freeze({
    text: '鳳梨酥！到台北手信第一名，帶回去送人絕對不會錯',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_electronic_prince: Object.freeze({
    text: '電音三太子！鋼鐵神像配電音，廟會最強 DJ 登場',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_puppet: Object.freeze({
    text: '布袋戲偶！台灣傳統工藝，每個指偶都有自己的江湖',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_youbike: Object.freeze({
    text: 'YouBike！台北最受歡迎的短程代步，騎去捷運站剛剛好',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_pres_office: Object.freeze({
    text: '總統府收藏品！紅磚建築在陽光下特別好看，摺進相簿了',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_gondola: Object.freeze({
    text: '貓空纜車！從木柵坐上去，整個台北盆地都在腳下',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_shihlin_chicken: Object.freeze({
    text: '士林大雞排！比一般還要大上一倍，超值是台灣夜市的精神',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_mazu: Object.freeze({
    text: '媽祖！台灣最多信眾的神明，繞境一走就是好幾天',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),

  /* ---- finale / result ---- */
  goal_contact: Object.freeze({
    text: '滾完台北101！月牙陪你登頂！',
    priority: 3, expression: 'speaking', once: true, phase: 'cinematic',
  }),
  ascension: Object.freeze({
    text: '哇…從這麼高的地方看台北，燈光漂亮得像星星',
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
 * 7-tier Taipei table.
 * @type {ReadonlyArray<string>}
 */
export const TIER_UP_LINE_IDS = Object.freeze([
  '', 'tier1', 'tier2', 'tier3', 'tier4', 'tier5', 'tier6',
]);

/**
 * LandmarkEvent.landmarkId (0..8, strictly increasing dioramaR order per
 * cityMap.LANDMARKS) -> line id.
 * Taipei has no DUAL-tagged landmark: all 9 slots have bespoke lines.
 * @type {ReadonlyArray<string>}
 */
export const LANDMARK_LINE_IDS = Object.freeze([
  'lm_beimen',       // 0 北門(承恩門)
  'lm_longshan',     // 1 龍山寺
  'lm_ximen',        // 2 西門紅樓
  'lm_grand_hotel',  // 3 圓山大飯店
  'lm_presidential', // 4 總統府
  'lm_cks',          // 5 中正紀念堂
  'lm_liberty_arch', // 6 自由廣場牌樓
  'lm_arena',        // 7 小巨蛋
  'lm_taipei101',    // 8 台北101 (goal — also fires on absorb if ever triggered)
]);

/**
 * CollectEvent.collectibleId (0..12, Taipei canonical P7 album) -> line id.
 * Unknown future ids fall back to 'col_generic'.
 * @type {ReadonlyArray<string>}
 */
export const COLLECT_LINE_IDS = Object.freeze([
  'col_bear',             //  0 台灣黑熊
  'col_boba',             //  1 珍奶
  'col_chicken_chop',     //  2 雞排
  'col_gua_bao',          //  3 刈包
  'col_xiaolongbao',      //  4 小籠包
  'col_pineapple_cake',   //  5 鳳梨酥
  'col_electronic_prince',//  6 電音三太子
  'col_puppet',           //  7 布袋戲偶
  'col_youbike',          //  8 YouBike
  'col_pres_office',      //  9 總統府
  'col_gondola',          // 10 貓空纜車
  'col_shihlin_chicken',  // 11 士林大雞排
  'col_mazu',             // 12 媽祖
]);

/**
 * Taipei has no DUAL-tagged collectible/landmark pair.
 * DUAL_COLLECTIBLE_ID = -1 (sentinel: donack.js skips LANDMARK if
 * p.landmarkId === DUAL_LANDMARK_ID; -1 never matches a real id).
 */
export const DUAL_COLLECTIBLE_ID = -1;
export const DUAL_LANDMARK_ID = -1;

/**
 * First-absorb-per-category: ScoreEvent.archetypeCode -> line id.
 * Taipei codes: code = tier*10 + slot (same formula as the legacy engine).
 *   T0 (0-7): small everyday items — marble triggers 'first_marble'
 *   T1 (10-19): 夜市 consumables — betel_nut (code 12) triggers 'first_betelnut'
 *   T2 (20-29): 騎樓 objects — red_plastic_chair (20), rice_cooker (22)
 *   T3 (30-39): 機車海 — scooter (30)
 *   T4 (40-49): 萬華街屋 — city_bus (44) first_bus; townhouse(40) first_building
 *   T5 (50-59): 商業文教 — office_tower (50) first_tower
 *   T6 (60-69): 信義天際線 — glass_highrise (60) first_tower (shared)
 * @type {Readonly<Record<number, string>>}
 */
export const FIRST_LINE_BY_CODE = Object.freeze({
  // T0: small items trigger generic marble quip (codes 0-7)
  0: 'first_marble', 1: 'first_marble', 2: 'first_marble', 3: 'first_marble',
  4: 'first_marble', 5: 'first_marble', 6: 'first_marble', 7: 'first_marble',
  // T1: 夜市 — betel_nut (slot 2 = code 12) gets own line; others share marble category
  10: 'first_marble', 11: 'first_marble', 12: 'first_betelnut',
  13: 'first_marble', 14: 'first_marble', 15: 'first_marble',
  16: 'first_marble', 17: 'first_marble',
  // T2: 騎樓 — red_plastic_chair (20), rice_cooker (22)
  20: 'first_chair', 21: 'first_chair', 22: 'first_ricecooker',
  23: 'first_chair', 24: 'first_chair', 25: 'first_chair',
  26: 'first_chair', 27: 'first_chair',
  // T3: 機車海 — scooter (30) gets own line; rest share scooter category
  30: 'first_scooter', 31: 'first_scooter', 32: 'first_scooter',
  33: 'first_scooter', 34: 'first_scooter', 35: 'first_scooter',
  36: 'first_scooter', 37: 'first_scooter',
  // T4: 萬華 buildings — bus (44) gets own line; rest are 'first_building'
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
