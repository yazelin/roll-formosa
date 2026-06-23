/**
 * @file packs/hualien/narration.js — 月牙 (Formosan black bear) narration table
 * for the Hualien pack.
 *
 * Mirrors the exact data shape of src/config/donackLines.js but with
 * zh-TW Hualien content authored for 月牙's voice: warm, friendly, slightly
 * playful; drops Hualien trivia and cheers the player on. No Japanese, no
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
 *   LANDMARK_LINE_IDS     landmarkId -> id (0=慶修院..8=太魯閣牌樓/goal)
 *   COLLECT_LINE_IDS      collectibleId -> id (0..12)
 *   FIRST_LINE_BY_CODE    archetypeCode -> id
 *   DUAL_COLLECTIBLE_ID   (none in Hualien — export 'no-dual' sentinel -1)
 *   DUAL_LANDMARK_ID      (-1: donack.js skips landmark if id === DUAL_LANDMARK_ID)
 *
 * Hualien collectible album (P7 canonical list, ids 0-12):
 *   0 台灣黑熊  1 花蓮麻糬  2 花蓮扁食  3 大理石藝品  4 七星潭石  5 原住民編織
 *   6 公正包子  7 剝皮辣椒  8 金針花  9 飛魚  10 船型木盤  11 月牙彎  12 媽祖
 *
 * Hualien landmark order (landmarkId = array index in cityMap.LANDMARKS):
 *   0 慶修院  1 松園別館  2 七星潭風景區  3 遠雄海洋公園  4 花蓮文創園區
 *   5 東大門夜市  6 鯉魚潭  7 燕子口  8 太魯閣牌樓 (goal)
 *
 * First-absorb archetype codes (Hualien tier layout, code = tier*10 + slot):
 *   T0 = 0-9  (彈珠/橡皮擦/圖釘/大理石珠/原民編織繩/尪仔標/鉛筆/鈕扣 + chunk lm)
 *   T1 = 10-19 (扁食碗/寶特瓶/麻糬盒/香/金紙/官財板/紅白袋/蔥油餅 + chunk lm)
 *   T2 = 20-29 (紅塑膠椅/藤編籃/船型木盤/瓦斯桶/三角錐/消防栓/招財貓/圖騰柱 + chunk lm)
 *   T3 = 30-39 (機車/小貨車/漂流木/鵝卵石堆/風箏/涼亭/海濱棕櫚/石獅 + chunk lm)
 *   T4 = 40-49 (透天厝/石雕工坊/公寓/超商/公車/垃圾車/加油站/騎樓柱 + chunk lm)
 *   T5 = 50-59 (大理石岩塊/吊橋塔/步道欄杆/山壁岩石/停車塔/峽谷看板/遊客中心/隧道口 + chunk lm)
 *   T6 = 60-69 (斷崖岩壁/公路護欄/觀景平台/海蝕洞/蘇花隧道/斷崖大樓/海上巨岩/燈塔 + chunk lm)
 *
 * Id contract: append-only. Never reuse or rename existing ids.
 * Static data only — zero runtime allocation beyond module init.
 */

/** @typedef {{text:string, priority:number, expression:string, once:boolean, phase:string}} DonackLine */

const PLAY = 'play';

/**
 * The 月牙 Hualien narration table.
 * @type {Readonly<Record<string, Readonly<DonackLine>>>}
 */
export const DONACK_LINES = Object.freeze({

  /* ---- run start ---- */
  start: Object.freeze({
    text: '從文創小店出發！光的箭頭指著下一個目標，往太魯閣滾囉',
    priority: 2, expression: 'idle', once: true, phase: PLAY,
  }),

  /* ---- tier-ups (index via TIER_UP_LINE_IDS[tierIndex]) ---- */
  // tier0 is the starting tier — no tier-up INTO tier 0; index 0 slot left ''
  tier1: Object.freeze({
    text: '進東大門夜市了！原住民風味烤肉香飄過來了',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier2: Object.freeze({
    text: '原民街巷！圖騰柱和編織工藝，這是花蓮的文化底蘊',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier3: Object.freeze({
    text: '七星潭到了！海風鹹鹹的，月牙最愛這片藍色太平洋',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier4: Object.freeze({
    text: '石藝街屋和廟！大理石工藝是花蓮的招牌',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier5: Object.freeze({
    text: '太魯閣峽谷！大理石峭壁高聳入雲，世界級的美',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier6: Object.freeze({
    text: '清水斷崖天際！這裡的山海交會，是台灣最壯觀的風景',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),

  /* ---- first-absorb-per-category (index via FIRST_LINE_BY_CODE) ---- */
  first_marble: Object.freeze({
    text: '彈珠一顆！每顆大滾球都是從小東西開始的',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_mochi: Object.freeze({
    text: '麻糬！花蓮名產，Q彈的口感月牙也很愛',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_chair: Object.freeze({
    text: '紅塑膠椅！辦桌、祭典、廟會都少不了它',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_aboriginal: Object.freeze({
    text: '原住民工藝！阿美族、太魯閣族的傳統文化',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_scooter: Object.freeze({
    text: '機車來了！花蓮人騎機車看海，這很正常',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_bus: Object.freeze({
    text: '公車吞進去了！往太魯閣的班次不用再等了',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_building: Object.freeze({
    text: '整棟樓！月牙也沒想到你這麼快就長這麼大',
    priority: 1, expression: 'happy', once: true, phase: PLAY,
  }),
  first_cliff: Object.freeze({
    text: '峽谷岩壁！太魯閣的大理石峭壁現在是你的了',
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
    text: '快到懸崖了，轉個彎繞回市區',
    priority: 1, expression: 'thinking', once: false, phase: PLAY,
  }),

  /* ---- landmark trivia (index via LANDMARK_LINE_IDS[landmarkId]) ---- */
  lm_qingxiu: Object.freeze({
    text: '慶修院！日治時代留下的真言宗寺院，花蓮唯一的國定古蹟',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_pine_garden: Object.freeze({
    text: '松園別館！日治時代的軍官休憩所，百年松樹群很有氣氛',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_qixingtan: Object.freeze({
    text: '七星潭風景區！弧形海灣和鵝卵石灘，花蓮最美的海岸線',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_farglory: Object.freeze({
    text: '遠雄海洋公園！看海豚表演、玩雲霄飛車，全家出遊好去處',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_cultural_park: Object.freeze({
    text: '花蓮文創園區！舊酒廠變身藝文空間，假日市集很熱鬧',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_dongdamen: Object.freeze({
    text: '東大門夜市！原住民一條街、自強夜市、福町夜市三合一',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_liyu_lake: Object.freeze({
    text: '鯉魚潭！花蓮最大內陸湖，租天鵝船遊湖是經典行程',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_swallow: Object.freeze({
    text: '燕子口！大理石峭壁上的燕巢洞穴，太魯閣最經典的步道',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_taroko_gate: Object.freeze({
    text: '太魯閣牌樓！東西橫貫公路的起點，滾進去就是冠軍了',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),

  /* ---- goal call ---- */
  goal_call: Object.freeze({
    text: '太魯閣牌樓在呼喚你，月牙幫你加油！',
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
  col_mochi: Object.freeze({
    text: '花蓮麻糬！曾記和阿美麻糬都很有名，Q彈帶勁',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_wonton: Object.freeze({
    text: '花蓮扁食！比餛飩大顆、比水餃薄皮，花蓮獨有的好味道',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_marble_craft: Object.freeze({
    text: '大理石藝品！花蓮特產，太魯閣峽谷的石頭變藝術品',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_qixingtan_stone: Object.freeze({
    text: '七星潭石！撿一顆漂亮的鵝卵石回家，是來花蓮的儀式',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_aboriginal_weave: Object.freeze({
    text: '原住民編織！阿美族的傳統工藝，每個圖騰都有故事',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_gongzheng_baozi: Object.freeze({
    text: '公正包子！花蓮人從小吃到大的早餐，皮薄餡多湯汁鮮',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_peeled_chili: Object.freeze({
    text: '剝皮辣椒！花蓮名產，配稀飯一口接一口停不下來',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_daylily: Object.freeze({
    text: '金針花！每年八九月六十石山一片金黃，超夢幻',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_flying_fish: Object.freeze({
    text: '飛魚！太平洋的特產，原住民傳統美食',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_aboriginal_plate: Object.freeze({
    text: '船型木盤！原住民傳統餐具，盛裝美食的藝術',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_crescent: Object.freeze({
    text: '月牙彎！花蓮的地標雕塑，跟月牙同名耶',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_mazu: Object.freeze({
    text: '媽祖！台灣最多信眾的神明，保佑海上平安',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),

  /* ---- finale / result ---- */
  goal_contact: Object.freeze({
    text: '滾完太魯閣牌樓！月牙陪你登頂！',
    priority: 3, expression: 'speaking', once: true, phase: 'cinematic',
  }),
  ascension: Object.freeze({
    text: '哇…從這麼高的地方看花蓮，山海交會美得像畫',
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
 * 7-tier Hualien table.
 * @type {ReadonlyArray<string>}
 */
export const TIER_UP_LINE_IDS = Object.freeze([
  '', 'tier1', 'tier2', 'tier3', 'tier4', 'tier5', 'tier6',
]);

/**
 * LandmarkEvent.landmarkId (0..8, strictly increasing dioramaR order per
 * cityMap.LANDMARKS) -> line id.
 * Hualien has no DUAL-tagged landmark: all 9 slots have bespoke lines.
 * @type {ReadonlyArray<string>}
 */
export const LANDMARK_LINE_IDS = Object.freeze([
  'lm_qingxiu',       // 0 慶修院
  'lm_pine_garden',   // 1 松園別館
  'lm_qixingtan',     // 2 七星潭風景區
  'lm_farglory',      // 3 遠雄海洋公園
  'lm_cultural_park', // 4 花蓮文創園區
  'lm_dongdamen',     // 5 東大門夜市
  'lm_liyu_lake',     // 6 鯉魚潭
  'lm_swallow',       // 7 燕子口
  'lm_taroko_gate',   // 8 太魯閣牌樓 (goal — also fires on absorb if ever triggered)
]);

/**
 * CollectEvent.collectibleId (0..12, Hualien canonical P7 album) -> line id.
 * Unknown future ids fall back to 'col_generic'.
 * @type {ReadonlyArray<string>}
 */
export const COLLECT_LINE_IDS = Object.freeze([
  'col_bear',              //  0 台灣黑熊
  'col_mochi',             //  1 花蓮麻糬
  'col_wonton',            //  2 花蓮扁食
  'col_marble_craft',      //  3 大理石藝品
  'col_qixingtan_stone',   //  4 七星潭石
  'col_aboriginal_weave',  //  5 原住民編織
  'col_gongzheng_baozi',   //  6 公正包子
  'col_peeled_chili',      //  7 剝皮辣椒
  'col_daylily',           //  8 金針花
  'col_flying_fish',       //  9 飛魚
  'col_aboriginal_plate',  // 10 船型木盤
  'col_crescent',          // 11 月牙彎
  'col_mazu',              // 12 媽祖
]);

/**
 * Hualien has no DUAL-tagged collectible/landmark pair.
 * DUAL_COLLECTIBLE_ID = -1 (sentinel: donack.js skips LANDMARK if
 * p.landmarkId === DUAL_LANDMARK_ID; -1 never matches a real id).
 */
export const DUAL_COLLECTIBLE_ID = -1;
export const DUAL_LANDMARK_ID = -1;

/**
 * First-absorb-per-category: ScoreEvent.archetypeCode -> line id.
 * Hualien codes: code = tier*10 + slot (same formula as the legacy engine).
 *   T0 (0-7): small everyday items — marble triggers 'first_marble'
 *   T1 (10-19): 東大門夜市 consumables — mochi_box (code 12) triggers 'first_mochi'
 *   T2 (20-29): 原民街 objects — red_plastic_chair (20), boat_plate (22)
 *   T3 (30-39): 七星潭 — scooter (30)
 *   T4 (40-49): 石藝街屋 — city_bus (44) first_bus; townhouse(40) first_building
 *   T5 (50-59): 太魯閣峽谷 — marble_boulder (50) first_cliff
 *   T6 (60-69): 清水斷崖 — cliff_wall (60) first_cliff (shared)
 * @type {Readonly<Record<number, string>>}
 */
export const FIRST_LINE_BY_CODE = Object.freeze({
  // T0: small items trigger generic marble quip (codes 0-7)
  0: 'first_marble', 1: 'first_marble', 2: 'first_marble', 3: 'first_marble',
  4: 'first_aboriginal', 5: 'first_marble', 6: 'first_marble', 7: 'first_marble',
  // T1: 東大門夜市 — mochi_box (slot 2 = code 12) gets own line; others share marble category
  10: 'first_marble', 11: 'first_marble', 12: 'first_mochi',
  13: 'first_marble', 14: 'first_marble', 15: 'first_marble',
  16: 'first_marble', 17: 'first_marble',
  // T2: 原民街 — red_plastic_chair (20), aboriginal crafts
  20: 'first_chair', 21: 'first_aboriginal', 22: 'first_aboriginal',
  23: 'first_chair', 24: 'first_chair', 25: 'first_chair',
  26: 'first_chair', 27: 'first_aboriginal',
  // T3: 七星潭 — scooter (30) gets own line; rest share scooter category
  30: 'first_scooter', 31: 'first_scooter', 32: 'first_scooter',
  33: 'first_scooter', 34: 'first_scooter', 35: 'first_scooter',
  36: 'first_scooter', 37: 'first_scooter',
  // T4: 石藝街屋 buildings — bus (44) gets own line; rest are 'first_building'
  40: 'first_building', 41: 'first_building', 42: 'first_building',
  43: 'first_building', 44: 'first_bus', 45: 'first_building',
  46: 'first_building', 47: 'first_building',
  // T5/T6: cliffs and gorge
  50: 'first_cliff', 51: 'first_cliff', 52: 'first_cliff',
  53: 'first_cliff', 54: 'first_cliff', 55: 'first_cliff',
  56: 'first_cliff', 57: 'first_cliff',
  60: 'first_cliff', 61: 'first_cliff', 62: 'first_cliff',
  63: 'first_cliff', 64: 'first_cliff', 65: 'first_cliff',
  66: 'first_cliff', 67: 'first_cliff',
});
