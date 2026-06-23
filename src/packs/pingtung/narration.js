/**
 * @file packs/pingtung/narration.js — 月牙 (Formosan black bear) narration
 * table for the Pingtung pack.
 *
 * Mirrors the exact data shape of src/config/donackLines.js but with zh-TW
 * 屏東 content authored for 月牙's voice: warm, friendly, slightly playful,
 * a little 台語味 (國境之南口氣). Drops 屏東 trivia and cheers the player on.
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
 *   LANDMARK_LINE_IDS     landmarkId -> id (0=恆春南門..8=鵝鑾鼻燈塔/goal)
 *   COLLECT_LINE_IDS      collectibleId -> id (0..12)
 *   FIRST_LINE_BY_CODE    archetypeCode -> id
 *   DUAL_COLLECTIBLE_ID   (none — export -1 sentinel)
 *   DUAL_LANDMARK_ID      (-1: donack.js skips landmark if id === DUAL_LANDMARK_ID)
 *
 * Pingtung collectible album (ids 0-12):
 *   0 台灣黑熊  1 黑鮪魚  2 萬巒豬腳  3 芒果  4 洋蔥  5 瓊麻
 *   6 鯨鯊  7 企鵝  8 潛水面鏡  9 香蕉船  10 排灣陶壺
 *   11 檳榔樹  12 萬金十字架
 *
 * Pingtung landmark order (landmarkId = array index in cityMap.LANDMARKS):
 *   0 恆春南門  1 福安宮  2 萬金聖母聖殿  3 凱撒飯店  4 海生館
 *   5 鵝鑾鼻燈塔  6 貓鼻頭  7 船帆石  8 鵝鑾鼻燈塔 (goal)
 *
 * First-absorb archetype codes (Pingtung tier layout, code = tier*10 + slot).
 *
 * Id contract: append-only.  Never reuse or rename existing ids.
 * Static data only — zero runtime allocation beyond module init.
 */

/** @typedef {{text:string, priority:number, expression:string, once:boolean, phase:string}} DonackLine */

const PLAY = 'play';

/**
 * The 月牙 Pingtung narration table.
 * @type {Readonly<Record<string, Readonly<DonackLine>>>}
 */
export const DONACK_LINES = Object.freeze({

  /* ---- run start ---- */
  start: Object.freeze({
    text: '對屏東市出發！光的箭頭指著國境之南，衝啊',
    priority: 2, expression: 'idle', once: true, phase: PLAY,
  }),

  /* ---- tier-ups (index via TIER_UP_LINE_IDS[tierIndex]) ---- */
  // tier0 is the starting tier — no tier-up INTO tier 0; index 0 slot left ''
  tier1: Object.freeze({
    text: '到墾丁大街囉！燈一亮，台灣尾的暗暝才正開始',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier2: Object.freeze({
    text: '恆春老街！石牆老厝連一排，古城的味道就佇遮',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier3: Object.freeze({
    text: '墾丁海灘出現了！衝浪、潛水、香蕉船，這才是國境之南',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier4: Object.freeze({
    text: '整排恆春古城和廟都滾入來了，足澎湃',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier5: Object.freeze({
    text: '進入海生館和度假區！鯨鯊、企鵝、大飯店攏總是你的',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier6: Object.freeze({
    text: '國境之南天際線！鵝鑾鼻燈塔佇頭前咧等你了',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),

  /* ---- first-absorb-per-category (index via FIRST_LINE_BY_CODE) ---- */
  first_marble: Object.freeze({
    text: '彈珠一粒！逐粒大滾球攏是對細物件開始的',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_seashell: Object.freeze({
    text: '貝殼！墾丁海灘撿的，海的氣味藏佇內底',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_chair: Object.freeze({
    text: '紅塑膠椅！辦桌、廟會、海產攤攏少不了它',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_ricecooker: Object.freeze({
    text: '電鍋！台灣人的靈魂廚具，啥物攏煮會出來',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_scooter: Object.freeze({
    text: '機車來了！墾丁租車趴趴走，這足正常的',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_bus: Object.freeze({
    text: '公車吞落去囉！運將大哥免閣開矣',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_building: Object.freeze({
    text: '規棟樓！月牙嘛無想到你遮緊就大遐爾大',
    priority: 1, expression: 'happy', once: true, phase: PLAY,
  }),
  first_tower: Object.freeze({
    text: '大飯店！度假區的天際線這馬是你的了',
    priority: 1, expression: 'happy', once: true, phase: PLAY,
  }),

  /* ---- play reactions / tips ---- */
  combo15: Object.freeze({
    text: '連消連消！月牙的爪仔拍噗仔拍到欲脫毛矣',
    priority: 1, expression: 'happy', once: true, phase: PLAY,
  }),
  knockoff: Object.freeze({
    text: '摔落去矣！傷大的先閃，對邊仔的細物件補大閣衝',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  repeat_bonk: Object.freeze({
    text: '一直彈倒轉是咧提醒你：時機猶未到，先大欉才講',
    priority: 1, expression: 'thinking', once: true, phase: PLAY,
  }),
  tip_idle: Object.freeze({
    text: '彼爿有細物件！細的先掃光，大的才綴會著',
    priority: 0, expression: 'thinking', once: false, phase: PLAY,
  }),
  tip_dash: Object.freeze({
    text: '衝刺蓄飽矣，揣一條直路全速衝一逝',
    priority: 0, expression: 'thinking', once: false, phase: PLAY,
  }),
  tip_edge: Object.freeze({
    text: '欲到邊界矣，斡一个彎踅倒轉市區',
    priority: 1, expression: 'thinking', once: false, phase: PLAY,
  }),

  /* ---- landmark trivia (index via LANDMARK_LINE_IDS[landmarkId]) ---- */
  lm_hengchun_south_gate: Object.freeze({
    text: '恆春南門！清朝留下來的古城門，恆春四城門保存上好的一座',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_fuan_temple: Object.freeze({
    text: '車城福安宮！全台灣上大的土地公廟，金爐嘛是世界第一',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_wanjin_basilica: Object.freeze({
    text: '萬金聖母聖殿！台灣上古老的天主教堂，一百五十外冬的西班牙風',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_caesar_hotel: Object.freeze({
    text: '墾丁凱撒大飯店！南灣海邊的度假指標，躺佇泳池就看會著海',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_aquarium: Object.freeze({
    text: '國立海生館！鯨鯊游過頭殼頂，企鵝佇你面前搖擺，台灣上大的水族館',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_eluanbi: Object.freeze({
    text: '鵝鑾鼻燈塔！台灣尾的白色地標，一百四十外冬守護巴士海峽',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_maobitou: Object.freeze({
    text: '貓鼻頭！珊瑚礁親像貓咧蹲，佮鵝鑾鼻對看守海峽',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_sail_rock: Object.freeze({
    text: '船帆石！海邊的巨石親像帆船，嘛有人講像尼克森的側面',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_goal_eluanbi: Object.freeze({
    text: '鵝鑾鼻燈塔！21.4公尺高，台灣最南端的燈塔，欲滾入來無',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),

  /* ---- goal call ---- */
  goal_call: Object.freeze({
    text: '鵝鑾鼻燈塔咧叫你矣，月牙共你加油！',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),

  /* ---- collectibles (index via COLLECT_LINE_IDS[collectibleId]) ---- */
  col_generic: Object.freeze({
    text: '收藏品到手！相簿閣加一頁矣',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_bear: Object.freeze({
    text: '台灣黑熊！月牙的家族啦！胸前彼个月牙紋就是我的標誌',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_bluefin_tuna: Object.freeze({
    text: '黑鮪魚！東港的海上黑金，每年四五月是黑鮪魚季',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_pig_trotter: Object.freeze({
    text: '萬巒豬腳！滷得Q彈入味，配蒜頭醬油上對味',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_mango: Object.freeze({
    text: '芒果！枋山的愛文芒果紅閣甜，夏天的滋味',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_onion: Object.freeze({
    text: '洋蔥！恆春半島落山風吹出來的甜洋蔥，冬天收成',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_sisal: Object.freeze({
    text: '瓊麻！恆春的綠色工業，以前做麻繩出名',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_whale_shark: Object.freeze({
    text: '鯨鯊！海生館的明星，世界上大尾的魚仔',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_penguin: Object.freeze({
    text: '企鵝！海生館極地區的人氣王，搖搖擺擺上古錐',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_diving_mask: Object.freeze({
    text: '潛水面鏡！墾丁潛水天堂，珊瑚礁和熱帶魚等你探險',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_banana_boat: Object.freeze({
    text: '香蕉船！南灣水上活動的招牌，刺激又好耍',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_paiwan_pot: Object.freeze({
    text: '排灣陶壺！原住民的百步蛇圖騰，藝術和祭祀的象徵',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_betel_palm: Object.freeze({
    text: '檳榔樹！屏東平原一排排，早期的經濟作物',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_wanjin_cross: Object.freeze({
    text: '萬金十字架！聖殿的信仰象徵，每年聖誕遊行足熱鬧',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),

  /* ---- finale / result ---- */
  goal_contact: Object.freeze({
    text: '滾完鵝鑾鼻燈塔！月牙陪你登頂！',
    priority: 3, expression: 'speaking', once: true, phase: 'cinematic',
  }),
  ascension: Object.freeze({
    text: '哇…對遮爾懸看墾丁，海邊的燈火媠甲若天頂的星',
    priority: 3, expression: 'speaking', once: true, phase: 'cinematic',
  }),
  result: Object.freeze({
    text: '辛苦矣！共成績分享出去，予逐家看月牙的玩家有偌厲害',
    priority: 3, expression: 'speaking', once: true, phase: 'result',
  }),
});

/* ------------------------------------------------------------------ */
/* Frozen event -> line-id lookup tables (consumed by ui/donack.js)    */
/* ------------------------------------------------------------------ */

/**
 * TierUpEvent.tierIndex -> line id (index 0 unused — no tier-up INTO tier 0).
 * 7-tier Pingtung table.
 * @type {ReadonlyArray<string>}
 */
export const TIER_UP_LINE_IDS = Object.freeze([
  '', 'tier1', 'tier2', 'tier3', 'tier4', 'tier5', 'tier6',
]);

/**
 * LandmarkEvent.landmarkId (0..8, strictly increasing dioramaR order per
 * cityMap.LANDMARKS) -> line id.
 * Pingtung has no DUAL-tagged landmark: all 9 slots have bespoke lines.
 * @type {ReadonlyArray<string>}
 */
export const LANDMARK_LINE_IDS = Object.freeze([
  'lm_hengchun_south_gate', // 0 恆春南門
  'lm_fuan_temple',         // 1 福安宮
  'lm_wanjin_basilica',     // 2 萬金聖母聖殿
  'lm_caesar_hotel',        // 3 凱撒飯店
  'lm_aquarium',            // 4 海生館
  'lm_eluanbi',             // 5 鵝鑾鼻燈塔
  'lm_maobitou',            // 6 貓鼻頭
  'lm_sail_rock',           // 7 船帆石
  'lm_goal_eluanbi',        // 8 鵝鑾鼻燈塔 (goal — also fires on absorb if ever triggered)
]);

/**
 * CollectEvent.collectibleId (0..12, Pingtung canonical album) -> line id.
 * Unknown future ids fall back to 'col_generic'.
 * @type {ReadonlyArray<string>}
 */
export const COLLECT_LINE_IDS = Object.freeze([
  'col_bear',             //  0 台灣黑熊
  'col_bluefin_tuna',     //  1 黑鮪魚
  'col_pig_trotter',      //  2 萬巒豬腳
  'col_mango',            //  3 芒果
  'col_onion',            //  4 洋蔥
  'col_sisal',            //  5 瓊麻
  'col_whale_shark',      //  6 鯨鯊
  'col_penguin',          //  7 企鵝
  'col_diving_mask',      //  8 潛水面鏡
  'col_banana_boat',      //  9 香蕉船
  'col_paiwan_pot',       // 10 排灣陶壺
  'col_betel_palm',       // 11 檳榔樹
  'col_wanjin_cross',     // 12 萬金十字架
]);

/**
 * Pingtung has no DUAL-tagged collectible/landmark pair.
 * DUAL_COLLECTIBLE_ID = -1 (sentinel: donack.js skips LANDMARK if
 * p.landmarkId === DUAL_LANDMARK_ID; -1 never matches a real id).
 */
export const DUAL_COLLECTIBLE_ID = -1;
export const DUAL_LANDMARK_ID = -1;

/**
 * First-absorb-per-category: ScoreEvent.archetypeCode -> line id.
 * Pingtung codes: code = tier*10 + slot (same formula as the legacy engine).
 *   T0 (0-7): small everyday items — marble triggers 'first_marble'
 *   T1 (10-19): 墾丁大街 consumables — seashell/coconut items
 *   T2 (20-29): 恆春老街 objects — red_plastic_chair (20), rice_cooker (22)
 *   T3 (30-39): 墾丁海灘 — scooter (30)
 *   T4 (40-49): 恆春古城 — city_bus (44) first_bus; townhouse(40) first_building
 *   T5 (50-59): 海生館度假區 — office_tower (50) first_tower
 *   T6 (60-69): 國境之南天際線 — glass_highrise (60) first_tower (shared)
 * @type {Readonly<Record<number, string>>}
 */
export const FIRST_LINE_BY_CODE = Object.freeze({
  // T0: small items trigger generic marble quip (codes 0-7)
  0: 'first_marble', 1: 'first_marble', 2: 'first_marble', 3: 'first_seashell',
  4: 'first_marble', 5: 'first_marble', 6: 'first_marble', 7: 'first_marble',
  // T1: 墾丁大街 — beach/tropical items share marble category
  10: 'first_marble', 11: 'first_marble', 12: 'first_marble',
  13: 'first_marble', 14: 'first_marble', 15: 'first_marble',
  16: 'first_marble', 17: 'first_marble',
  // T2: 恆春老街 — red_plastic_chair (20), rice_cooker (22)
  20: 'first_chair', 21: 'first_chair', 22: 'first_ricecooker',
  23: 'first_chair', 24: 'first_chair', 25: 'first_chair',
  26: 'first_chair', 27: 'first_chair',
  // T3: 墾丁海灘 — scooter (30) gets own line; rest share scooter category
  30: 'first_scooter', 31: 'first_scooter', 32: 'first_scooter',
  33: 'first_scooter', 34: 'first_scooter', 35: 'first_scooter',
  36: 'first_scooter', 37: 'first_scooter',
  // T4: 恆春古城 buildings — bus (44) gets own line; rest are 'first_building'
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
