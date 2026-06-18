/**
 * @file packs/kaohsiung/narration.js — 月牙 (Formosan black bear) narration
 * table for the Kaohsiung pack.
 *
 * Mirrors the exact data shape of src/config/donackLines.js but with zh-TW
 * 高雄 content authored for 月牙's voice: warm, friendly, slightly playful, a
 * little 台語味 (港都口氣). Drops 高雄 trivia and cheers the player on. No
 * Japanese, no legacy references.
 *
 * Line shape (frozen contract, same as config/donackLines.js):
 *   { text:string, priority:0|1|2|3,
 *     expression:'idle'|'happy'|'thinking'|'speaking',
 *     once:boolean, phase:'title'|'play'|'cinematic'|'result' }
 *
 * Lookup maps (consumed by ui/donack.js when it reads activePack.narration):
 *   DONACK_LINES          id -> line
 *   TIER_UP_LINE_IDS      tierIndex -> id  (index 0 unused)
 *   LANDMARK_LINE_IDS     landmarkId -> id (0=光之穹頂..8=高雄85/goal)
 *   COLLECT_LINE_IDS      collectibleId -> id (0..12)
 *   FIRST_LINE_BY_CODE    archetypeCode -> id
 *   DUAL_COLLECTIBLE_ID   (none — export -1 sentinel)
 *   DUAL_LANDMARK_ID      (-1: donack.js skips landmark if id === DUAL_LANDMARK_ID)
 *
 * Kaohsiung collectible album (ids 0-12):
 *   0 台灣黑熊  1 木瓜牛奶  2 大碗公冰  3 旗鼓餅  4 鹽埕鴨肉  5 黑輪
 *   6 旗津渡輪  7 高捷少女  8 旗津三輪車  9 旗山香蕉  10 貨櫃
 *   11 春秋閣  12 美濃油紙傘
 *
 * Kaohsiung landmark order (landmarkId = array index in cityMap.LANDMARKS):
 *   0 美麗島光之穹頂  1 駁二藝術特區  2 旗津燈塔  3 龍虎塔  4 三鳳宮
 *   5 流行音樂中心  6 大港橋  7 夢時代摩天輪  8 高雄85大樓 (goal)
 *
 * First-absorb archetype codes (Kaohsiung tier layout, code = tier*10 + slot).
 *
 * Id contract: append-only.  Never reuse or rename existing ids.
 * Static data only — zero runtime allocation beyond module init.
 */

/** @typedef {{text:string, priority:number, expression:string, once:boolean, phase:string}} DonackLine */

const PLAY = 'play';

/**
 * The 月牙 Kaohsiung narration table.
 * @type {Readonly<Record<string, Readonly<DonackLine>>>}
 */
export const DONACK_LINES = Object.freeze({

  /* ---- run start ---- */
  start: Object.freeze({
    text: '對鹽埕出發！光的箭頭指著下一站，緊綴上來啦',
    priority: 2, expression: 'idle', once: true, phase: PLAY,
  }),

  /* ---- tier-ups (index via TIER_UP_LINE_IDS[tierIndex]) ---- */
  // tier0 is the starting tier — no tier-up INTO tier 0; index 0 slot left ''
  tier1: Object.freeze({
    text: '到六合夜市囉！燈一亮，港都的暗暝才正開始',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier2: Object.freeze({
    text: '鹽埕騎樓！一排騎樓接一排，老高雄的味道就佇遮',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier3: Object.freeze({
    text: '哈瑪星港邊出現了！這才是高雄人的日常',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier4: Object.freeze({
    text: '整排鹽埕街屋和廟都滾入來了，足澎湃',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier5: Object.freeze({
    text: '進入港區和商業帶！貨櫃、碼頭、商辦攏總是你的',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier6: Object.freeze({
    text: '亞洲新灣區天際線！85大樓佇頭前咧等你了',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),

  /* ---- first-absorb-per-category (index via FIRST_LINE_BY_CODE) ---- */
  first_marble: Object.freeze({
    text: '彈珠一粒！逐粒大滾球攏是對細物件開始的',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_betelnut: Object.freeze({
    text: '檳榔！台灣特產，不過月牙可不嚼這味',
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
    text: '機車來了！高雄路闊機車多，這足正常的',
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
    text: '摩天樓！高雄的天際線這馬是你的了',
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
  lm_dome_of_light: Object.freeze({
    text: '美麗島站光之穹頂！四千五百片彩色玻璃，全世界揣會著的上媠地鐵站',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_pier2: Object.freeze({
    text: '駁二藝術特區！舊倉庫變身做文創基地，鹽埕港邊上潮的所在',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_cijin_lighthouse: Object.freeze({
    text: '旗津燈塔！白色的塔徛佇旗後山頂，顧高雄港百外冬矣',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_dragon_tiger: Object.freeze({
    text: '龍虎塔！蓮池潭邊的地標，入龍喉出虎口會消災解厄喔',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_sanfeng: Object.freeze({
    text: '三鳳宮！拜中壇元帥的大廟，三民區的香火攏佇遮咧旺',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_music_center: Object.freeze({
    text: '高雄流行音樂中心！海邊一排白色珊瑚礁建築，灣區的新門面',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_dagang_bridge: Object.freeze({
    text: '大港橋！台灣上長的水平旋轉橋，時間到就斡開予船過',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_dream_wheel: Object.freeze({
    text: '夢時代摩天輪！起佇百貨厝頂，坐起去規个港都攏看現現',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_kaohsiung_85: Object.freeze({
    text: '高雄85大樓！378公尺，正面寫一个「高」字，欲滾入來無',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),

  /* ---- goal call ---- */
  goal_call: Object.freeze({
    text: '高雄85大樓咧叫你矣，月牙共你加油！',
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
  col_papaya_milk: Object.freeze({
    text: '木瓜牛奶！高雄人從細啉到大，南部的味就是較芳較甜',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_big_bowl_ice: Object.freeze({
    text: '大碗公冰！規碗親像面盆遐爾大，鹽埕熱天的救星',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_qigu_cake: Object.freeze({
    text: '旗鼓餅！旗津的古早味，名是對「旗」津「鼓」山來的',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_duck_meat: Object.freeze({
    text: '鹽埕鴨肉！一碗鴨肉飯配冬粉，老饕攏知影遮的滋味',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_oden: Object.freeze({
    text: '黑輪！南部叫做烏輪，夜市熱湯邊一定愛來一支',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_cijin_ferry: Object.freeze({
    text: '旗津渡輪！對鼓山坐過去旗津，連人帶機車攏載會過',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_mrt_girls: Object.freeze({
    text: '高捷少女！高雄捷運的看板娘，搭車逐工攏咧陪你',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_pedicab: Object.freeze({
    text: '旗津三輪車！踏佇海岸邊，慢慢仔晃過旗津老街上對味',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_cishan_banana: Object.freeze({
    text: '旗山香蕉！外銷日本紅遍天的「金蕉」，旗山的驕傲',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_mini_container: Object.freeze({
    text: '貨櫃！高雄港的象徵，一櫃一櫃疊起來就是港都的脈動',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_spring_autumn: Object.freeze({
    text: '春秋閣！蓮池潭頂的雙閣樓，騎佇龍身上的觀音上出名',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_meinong_umbrella: Object.freeze({
    text: '美濃油紙傘！客家庄的手路工藝，一枝一枝攏是師傅糊出來的',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),

  /* ---- finale / result ---- */
  goal_contact: Object.freeze({
    text: '滾完高雄85大樓！月牙陪你登頂！',
    priority: 3, expression: 'speaking', once: true, phase: 'cinematic',
  }),
  ascension: Object.freeze({
    text: '哇…對遮爾懸看高雄，港邊的燈火媠甲若天頂的星',
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
 * 7-tier Kaohsiung table.
 * @type {ReadonlyArray<string>}
 */
export const TIER_UP_LINE_IDS = Object.freeze([
  '', 'tier1', 'tier2', 'tier3', 'tier4', 'tier5', 'tier6',
]);

/**
 * LandmarkEvent.landmarkId (0..8, strictly increasing dioramaR order per
 * cityMap.LANDMARKS) -> line id.
 * Kaohsiung has no DUAL-tagged landmark: all 9 slots have bespoke lines.
 * @type {ReadonlyArray<string>}
 */
export const LANDMARK_LINE_IDS = Object.freeze([
  'lm_dome_of_light',     // 0 美麗島光之穹頂
  'lm_pier2',             // 1 駁二藝術特區
  'lm_cijin_lighthouse',  // 2 旗津燈塔
  'lm_dragon_tiger',      // 3 龍虎塔
  'lm_sanfeng',           // 4 三鳳宮
  'lm_music_center',      // 5 高雄流行音樂中心
  'lm_dagang_bridge',     // 6 大港橋
  'lm_dream_wheel',       // 7 夢時代摩天輪
  'lm_kaohsiung_85',      // 8 高雄85大樓 (goal — also fires on absorb if ever triggered)
]);

/**
 * CollectEvent.collectibleId (0..12, Kaohsiung canonical album) -> line id.
 * Unknown future ids fall back to 'col_generic'.
 * @type {ReadonlyArray<string>}
 */
export const COLLECT_LINE_IDS = Object.freeze([
  'col_bear',             //  0 台灣黑熊
  'col_papaya_milk',      //  1 木瓜牛奶
  'col_big_bowl_ice',     //  2 大碗公冰
  'col_qigu_cake',        //  3 旗鼓餅
  'col_duck_meat',        //  4 鹽埕鴨肉
  'col_oden',             //  5 黑輪
  'col_cijin_ferry',      //  6 旗津渡輪
  'col_mrt_girls',        //  7 高捷少女
  'col_pedicab',          //  8 旗津三輪車
  'col_cishan_banana',    //  9 旗山香蕉
  'col_mini_container',   // 10 貨櫃
  'col_spring_autumn',    // 11 春秋閣
  'col_meinong_umbrella', // 12 美濃油紙傘
]);

/**
 * Kaohsiung has no DUAL-tagged collectible/landmark pair.
 * DUAL_COLLECTIBLE_ID = -1 (sentinel: donack.js skips LANDMARK if
 * p.landmarkId === DUAL_LANDMARK_ID; -1 never matches a real id).
 */
export const DUAL_COLLECTIBLE_ID = -1;
export const DUAL_LANDMARK_ID = -1;

/**
 * First-absorb-per-category: ScoreEvent.archetypeCode -> line id.
 * Kaohsiung codes: code = tier*10 + slot (same formula as the legacy engine).
 *   T0 (0-7): small everyday items — marble triggers 'first_marble'
 *   T1 (10-19): 夜市 consumables — betel_nut (code 12) triggers 'first_betelnut'
 *   T2 (20-29): 騎樓 objects — red_plastic_chair (20), rice_cooker (22)
 *   T3 (30-39): 哈瑪星港邊 — scooter (30)
 *   T4 (40-49): 鹽埕街屋 — city_bus (44) first_bus; townhouse(40) first_building
 *   T5 (50-59): 港區/商業 — office_tower (50) first_tower
 *   T6 (60-69): 灣區天際線 — glass_highrise (60) first_tower (shared)
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
  // T3: 哈瑪星港邊 — scooter (30) gets own line; rest share scooter category
  30: 'first_scooter', 31: 'first_scooter', 32: 'first_scooter',
  33: 'first_scooter', 34: 'first_scooter', 35: 'first_scooter',
  36: 'first_scooter', 37: 'first_scooter',
  // T4: 鹽埕 buildings — bus (44) gets own line; rest are 'first_building'
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
