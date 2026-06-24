/**
 * @file packs/penghu/narration.js — 月牙 (Formosan black bear) narration table
 * for the Penghu pack.
 *
 * Mirrors the exact data shape of src/config/donackLines.js but with
 * zh-TW Penghu content authored for 月牙's voice: warm, friendly, slightly
 * playful; drops Penghu trivia and cheers the player on.  No Japanese, no
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
 *   LANDMARK_LINE_IDS     landmarkId -> id (0=雙心石滬..8=跨海大橋/goal)
 *   COLLECT_LINE_IDS      collectibleId -> id (0..12)
 *   FIRST_LINE_BY_CODE    archetypeCode -> id
 *   DUAL_COLLECTIBLE_ID   (none in Penghu — export 'no-dual' sentinel -1)
 *   DUAL_LANDMARK_ID      (-1: donack.js skips landmark if id === DUAL_LANDMARK_ID)
 *
 * Penghu collectible album (P7 canonical list, ids 0-12):
 *   0 台灣黑熊  1 仙人掌冰  2 黑糖糕  3 小管乾  4 海膽  5 風獅爺
 *   6 咾咕石  7 花生酥  8 漁船模型  9 蘆薈產品  10 玄武岩紀念品
 *   11 貝殼收藏  12 媽祖
 *
 * Penghu landmark order (landmarkId = array index in cityMap.LANDMARKS):
 *   0 雙心石滬  1 天后宮  2 中央老街  3 大菓葉玄武岩  4 漁翁島燈塔
 *   5 二崁聚落  6 鯨魚洞  7 風櫃洞  8 跨海大橋 (goal)
 *
 * First-absorb archetype codes (Penghu tier layout, code = tier*10 + slot):
 *   T0 = 0-9  (彈珠/橡皮擦/圖釘/貝殼/仙人掌糖/尪仔標/鉛筆/鈕扣 + chunk lm)
 *   T1 = 10-19 (仙人掌冰/烤小管/海膽/黑糖糕/風茹茶/花枝丸/炸魚/海菜 + chunk lm)
 *   T2 = 20-29 (紅塑膠椅/安全帽/電鍋/瓦斯桶/三角錐/消防栓/風獅爺小像/漁網捲 + chunk lm)
 *   T3 = 30-39 (機車/小貨車/漁船/鐵捲門/繫纜柱/漁網捲大/碼頭棕櫚/石敢當 + chunk lm)
 *   T4 = 40-49 (咾咕石厝/鐵皮屋/老公寓/超商/公車/垃圾車/加油站/騎樓柱 + chunk lm)
 *   T5 = 50-59 (商辦大樓/港倉/觀光船/跨港天橋/停車塔/港區看板/玻璃帷幕街屋/銀行 + chunk lm)
 *   T6 = 60-69 (玻璃帷幕高樓/橋墩/其他摩天樓/巨型廣告牆/圖書館塔/遊客中心/屋頂機房/灣區大樓 + chunk lm)
 *
 * Id contract: append-only.  Never reuse or rename existing ids.
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
    text: '從馬公出發！海風吹來，澎湖的冒險開始了',
    priority: 2, expression: 'idle', once: true, phase: PLAY,
  }),

  /* ---- tier-ups (index via TIER_UP_LINE_IDS[tierIndex]) ---- */
  // tier0 is the starting tier — no tier-up INTO tier 0; index 0 slot left ''
  tier1: Object.freeze({
    text: '漁港夜市到了！海鮮香味讓月牙的鼻子都動了',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier2: Object.freeze({
    text: '漁村騎樓！曬魚乾、補漁網，離島生活的日常',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier3: Object.freeze({
    text: '觀光碼頭來了！漁船一艘接一艘，準備出海囉',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier4: Object.freeze({
    text: '古厝與天后宮！咾咕石蓋的房子，百年都不倒',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier5: Object.freeze({
    text: '玄武岩海岸！這些柱狀岩石，可是幾百萬年前的火山熔岩',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier6: Object.freeze({
    text: '跨海大橋天際線！全台灣最長的跨海大橋就在眼前',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),

  /* ---- first-absorb-per-category (index via FIRST_LINE_BY_CODE) ---- */
  first_marble: Object.freeze({
    text: '彈珠一顆！每顆大滾球都是從小東西開始的',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_squid: Object.freeze({
    text: '小管！澎湖的海味代表，新鮮現烤最對味',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_chair: Object.freeze({
    text: '紅塑膠椅！海產攤、廟埕、漁港邊都少不了它',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_ricecooker: Object.freeze({
    text: '電鍋！台灣人的靈魂廚具，離島也一樣離不開',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_scooter: Object.freeze({
    text: '機車來了！澎湖觀光必備，環島騎一圈剛剛好',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_boat: Object.freeze({
    text: '漁船收進來了！澎湖人靠海吃海，這是生計的根本',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_building: Object.freeze({
    text: '整間咾咕石厝！這種珊瑚礁建材，澎湖獨有',
    priority: 1, expression: 'happy', once: true, phase: PLAY,
  }),
  first_tower: Object.freeze({
    text: '高樓！澎湖的天際線雖然不高，但這座夠看了',
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
    text: '快到海邊了，轉個彎繞回島上',
    priority: 1, expression: 'thinking', once: false, phase: PLAY,
  }),

  /* ---- landmark trivia (index via LANDMARK_LINE_IDS[landmarkId]) ---- */
  lm_double_heart: Object.freeze({
    text: '雙心石滬！七美的浪漫地標，兩顆心疊在一起捕魚用',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_tianhou: Object.freeze({
    text: '澎湖天后宮！全台灣歷史最悠久的媽祖廟，四百多年了',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_zhongyang: Object.freeze({
    text: '中央老街！清朝就有的老街，走一趟像穿越時空',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_daguoye: Object.freeze({
    text: '大菓葉玄武岩！柱狀節理排排站，大自然的建築奇觀',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_lighthouse: Object.freeze({
    text: '漁翁島燈塔！台灣最古老的洋式燈塔，一百五十年的光',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_erkan: Object.freeze({
    text: '二崁聚落！咾咕石古厝群，整個村都是活的博物館',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_whale: Object.freeze({
    text: '鯨魚洞！海蝕洞像張大嘴的鯨魚，小門嶼的招牌景點',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_fenggui: Object.freeze({
    text: '風櫃洞！浪拍進洞穴會發出呼呼聲，像大地在呼吸',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_bridge: Object.freeze({
    text: '跨海大橋！2494 公尺，連接白沙和西嶼，要滾過去嗎',
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
    text: '仙人掌冰！桃紅色的冰淇淋，吃一口整個夏天都沁涼',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_brown_sugar_cake: Object.freeze({
    text: '黑糖糕！澎湖名產第一名，Q彈帶著焦糖香',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_dried_squid: Object.freeze({
    text: '小管乾！澎湖的海味伴手禮，配啤酒絕配',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_sea_urchin: Object.freeze({
    text: '海膽！澎湖夏天的限定美味，新鮮的最甜',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_windlion: Object.freeze({
    text: '風獅爺！鎮風煞的守護神，每尊表情都不一樣',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_coral_stone: Object.freeze({
    text: '咾咕石！珊瑚礁做的建材，澎湖古厝的靈魂',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_peanut: Object.freeze({
    text: '花生酥！澎湖花生又香又脆，做成酥更涮嘴',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_boat_model: Object.freeze({
    text: '漁船模型！縮小版的討海人生，精緻得很',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_aloe: Object.freeze({
    text: '蘆薈產品！澎湖日照強，蘆薈長得特別好',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_basalt: Object.freeze({
    text: '玄武岩紀念品！把火山的記憶帶回家',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_seashell: Object.freeze({
    text: '貝殼收藏！澎湖的海灘上什麼貝殼都有',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_mazu: Object.freeze({
    text: '媽祖！台灣最多信眾的神明，澎湖人更是虔誠',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),

  /* ---- finale / result ---- */
  goal_contact: Object.freeze({
    text: '滾過跨海大橋了！月牙陪你橫跨澎湖！',
    priority: 3, expression: 'speaking', once: true, phase: 'cinematic',
  }),
  ascension: Object.freeze({
    text: '哇…從橋上看下去，整片澎湖灣藍得發亮',
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
  'lm_double_heart',  // 0 雙心石滬
  'lm_tianhou',       // 1 澎湖天后宮
  'lm_zhongyang',     // 2 中央老街
  'lm_daguoye',       // 3 大菓葉玄武岩
  'lm_lighthouse',    // 4 漁翁島燈塔
  'lm_erkan',         // 5 二崁聚落
  'lm_whale',         // 6 鯨魚洞
  'lm_fenggui',       // 7 風櫃洞
  'lm_bridge',        // 8 跨海大橋 (goal — also fires on absorb if ever triggered)
]);

/**
 * CollectEvent.collectibleId (0..12, Penghu canonical P7 album) -> line id.
 * Unknown future ids fall back to 'col_generic'.
 * @type {ReadonlyArray<string>}
 */
export const COLLECT_LINE_IDS = Object.freeze([
  'col_bear',              //  0 台灣黑熊
  'col_cactus_ice',        //  1 仙人掌冰
  'col_brown_sugar_cake',  //  2 黑糖糕
  'col_dried_squid',       //  3 小管乾
  'col_sea_urchin',        //  4 海膽
  'col_windlion',          //  5 風獅爺
  'col_coral_stone',       //  6 咾咕石
  'col_peanut',            //  7 花生酥
  'col_boat_model',        //  8 漁船模型
  'col_aloe',              //  9 蘆薈產品
  'col_basalt',            // 10 玄武岩紀念品
  'col_seashell',          // 11 貝殼收藏
  'col_mazu',              // 12 媽祖
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
 *   T0 (0-7): small everyday items — marble triggers 'first_marble'
 *   T1 (10-19): 漁港夜市 seafood — grilled_squid (code 11) triggers 'first_squid'
 *   T2 (20-29): 漁村騎樓 objects — red_plastic_chair (20), rice_cooker (22)
 *   T3 (30-39): 觀光碼頭 — scooter (30), fishing_boat (32)
 *   T4 (40-49): 古厝與天后宮 — coral_house(40) first_building; island_bus (44) first_boat
 *   T5 (50-59): 玄武岩海岸 — office_tower (50) first_tower
 *   T6 (60-69): 跨海大橋天際線 — glass_highrise (60) first_tower (shared)
 * @type {Readonly<Record<number, string>>}
 */
export const FIRST_LINE_BY_CODE = Object.freeze({
  // T0: small items trigger generic marble quip (codes 0-7)
  0: 'first_marble', 1: 'first_marble', 2: 'first_marble', 3: 'first_marble',
  4: 'first_marble', 5: 'first_marble', 6: 'first_marble', 7: 'first_marble',
  // T1: 漁港夜市 — grilled_squid (slot 1 = code 11) gets own line; others share marble category
  10: 'first_marble', 11: 'first_squid', 12: 'first_squid',
  13: 'first_marble', 14: 'first_marble', 15: 'first_squid',
  16: 'first_squid', 17: 'first_marble',
  // T2: 漁村騎樓 — red_plastic_chair (20), rice_cooker (22)
  20: 'first_chair', 21: 'first_chair', 22: 'first_ricecooker',
  23: 'first_chair', 24: 'first_chair', 25: 'first_chair',
  26: 'first_chair', 27: 'first_chair',
  // T3: 觀光碼頭 — scooter (30), fishing_boat (32) gets own line
  30: 'first_scooter', 31: 'first_scooter', 32: 'first_boat',
  33: 'first_scooter', 34: 'first_scooter', 35: 'first_boat',
  36: 'first_scooter', 37: 'first_scooter',
  // T4: 古厝 buildings — bus (44) shares boat line; rest are 'first_building'
  40: 'first_building', 41: 'first_building', 42: 'first_building',
  43: 'first_building', 44: 'first_boat', 45: 'first_building',
  46: 'first_building', 47: 'first_building',
  // T5/T6: towers
  50: 'first_tower', 51: 'first_tower', 52: 'first_tower',
  53: 'first_tower', 54: 'first_tower', 55: 'first_tower',
  56: 'first_tower', 57: 'first_tower',
  60: 'first_tower', 61: 'first_tower', 62: 'first_tower',
  63: 'first_tower', 64: 'first_tower', 65: 'first_tower',
  66: 'first_tower', 67: 'first_tower',
});

/**
 * The narration object exposed via activePack.narration. Consumers read:
 *   activePack.narration.DONACK_LINES[id]
 *   activePack.narration.TIER_UP_LINE_IDS[tierIndex]
 *   activePack.narration.LANDMARK_LINE_IDS[landmarkId]
 *   activePack.narration.COLLECT_LINE_IDS[collectibleId]
 *   activePack.narration.FIRST_LINE_BY_CODE[code]
 *   activePack.narration.DUAL_COLLECTIBLE_ID / DUAL_LANDMARK_ID
 */
export const narration = Object.freeze({
  DONACK_LINES,
  TIER_UP_LINE_IDS,
  LANDMARK_LINE_IDS,
  COLLECT_LINE_IDS,
  FIRST_LINE_BY_CODE,
  DUAL_COLLECTIBLE_ID,
  DUAL_LANDMARK_ID,
});

export default narration;
