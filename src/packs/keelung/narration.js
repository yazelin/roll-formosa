/**
 * @file packs/keelung/narration.js — 月牙 (Formosan black bear) narration table
 * for the Keelung pack.
 *
 * Mirrors the exact data shape of src/config/donackLines.js but with
 * zh-TW Keelung content authored for 月牙's voice: warm, friendly, slightly
 * playful; drops Keelung trivia and cheers the player on.
 *
 * Line shape (frozen contract, same as config/donackLines.js):
 *   { text:string, priority:0|1|2|3,
 *     expression:'idle'|'happy'|'thinking'|'speaking',
 *     once:boolean, phase:'title'|'play'|'cinematic'|'result' }
 *
 * Keelung landmark order (landmarkId = array index in cityMap.LANDMARKS):
 *   0 廟口夜市牌樓  1 基隆火車站  2 中正公園觀音像  3 海洋廣場
 *   4 仙洞巖  5 和平島公園  6 基隆嶼燈塔  7 慶安宮  8 正濱漁港彩色屋 (goal)
 */

/** @typedef {{text:string, priority:number, expression:string, once:boolean, phase:string}} DonackLine */

const PLAY = 'play';

/**
 * The 月牙 Keelung narration table.
 * @type {Readonly<Record<string, Readonly<DonackLine>>>}
 */
export const DONACK_LINES = Object.freeze({

  /* ---- run start ---- */
  start: Object.freeze({
    text: '從廟口出發！雨都基隆，港風帶著鹹味的冒險開始',
    priority: 2, expression: 'idle', once: true, phase: PLAY,
  }),

  /* ---- tier-ups (index via TIER_UP_LINE_IDS[tierIndex]) ---- */
  tier1: Object.freeze({
    text: '廟口夜市到了！鼎邊銼、營養三明治，基隆人的早餐和宵夜',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier2: Object.freeze({
    text: '騎樓底下好涼快！基隆雨多，這裡剛好避一避',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier3: Object.freeze({
    text: '漁港風味出現了！漁網、纜柱、小漁船，這才是港都日常',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier4: Object.freeze({
    text: '港邊街屋和老廟都進肚子了，慶安宮的香火一定很旺',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier5: Object.freeze({
    text: '商港區來了！貨櫃、倉庫、跨港大橋，基隆港的大動脈',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier6: Object.freeze({
    text: '海港天際線！彩色屋就在前面等著你了',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),

  /* ---- first-absorb-per-category (index via FIRST_LINE_BY_CODE) ---- */
  first_marble: Object.freeze({
    text: '彈珠一顆！基隆小孩放學後的零食和玩具都在柑仔店',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_dingbian: Object.freeze({
    text: '鼎邊銼！基隆廟口的招牌，湯頭鮮甜、米片滑嫩',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_chair: Object.freeze({
    text: '紅塑膠椅！廟口攤位前坐下來，準備大快朵頤',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_ricecooker: Object.freeze({
    text: '電鍋！台灣人的靈魂廚具，港邊漁家也少不了',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_scooter: Object.freeze({
    text: '機車來了！在基隆的山坡巷弄裡穿梭最方便',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_fishing_net: Object.freeze({
    text: '漁網捲！基隆漁港的日常風景，漁民的生財工具',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_bus: Object.freeze({
    text: '公車吞進去了！從廟口到和平島一路都是風景',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_building: Object.freeze({
    text: '港邊老公寓！窗戶開著就能聞到海風和鹹味',
    priority: 1, expression: 'happy', once: true, phase: PLAY,
  }),
  first_container: Object.freeze({
    text: '貨櫃！基隆港曾是台灣第一大港，貨櫃堆得跟山一樣高',
    priority: 1, expression: 'happy', once: true, phase: PLAY,
  }),
  first_tower: Object.freeze({
    text: '港務大樓！基隆港的天際線就是月牙眼中最美的風景',
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
    text: '衝刺蓄滿了，順著港邊跑道全速衝一波',
    priority: 0, expression: 'thinking', once: false, phase: PLAY,
  }),
  tip_edge: Object.freeze({
    text: '快到海邊了，轉個彎繞回港區',
    priority: 1, expression: 'thinking', once: false, phase: PLAY,
  }),

  /* ---- landmark trivia (index via LANDMARK_LINE_IDS[landmarkId]) ---- */
  lm_miaokou_gate: Object.freeze({
    text: '廟口夜市牌樓！基隆最老的夜市就從這裡開始',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_keelung_station: Object.freeze({
    text: '基隆火車站！西部幹線的終點站，下車就聞到海的味道',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_guanyin_statue: Object.freeze({
    text: '中正公園觀音像！22.5 公尺高，俯瞰整個基隆港',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_ocean_plaza: Object.freeze({
    text: '海洋廣場！看郵輪進港的最佳位置，KEELUNG 大字就在這裡',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_xiandonyan: Object.freeze({
    text: '仙洞巖！天然海蝕洞裡的廟，岩壁上有清朝的石刻',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_heping_island: Object.freeze({
    text: '和平島公園！蕈狀岩和豆腐岩，大自然的鬼斧神工',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_keelung_islet: Object.freeze({
    text: '基隆嶼！火山小島配燈塔，每年夏天開放登島',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_qingan_temple: Object.freeze({
    text: '慶安宮！基隆最老的媽祖廟，廟口夜市就在它旁邊長大',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_zhengbin: Object.freeze({
    text: '正濱漁港彩色屋！七彩的房子倒映在水面，IG 必拍打卡點',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),

  /* ---- goal call ---- */
  goal_call: Object.freeze({
    text: '正濱彩色屋在呼喚你，月牙幫你加油！',
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
    text: '雞排！比臉還大的那種，廟口攤位也有賣',
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
    text: '鳳梨酥！台灣伴手禮經典款，送人絕對不會錯',
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
    text: 'YouBike！基隆雖然多山，平地還是騎得到',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_pres_office: Object.freeze({
    text: '總統府收藏品！紅磚建築在陽光下特別好看，摺進相簿了',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_gondola: Object.freeze({
    text: '貓空纜車！雖然這是台北的，但基隆人也愛去玩',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_shihlin_chicken: Object.freeze({
    text: '士林大雞排！超大份量是夜市精神，廟口也不輸',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_mazu: Object.freeze({
    text: '媽祖！基隆慶安宮的主神，保佑漁民出海平安',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),

  /* ---- finale / result ---- */
  goal_contact: Object.freeze({
    text: '滾完正濱彩色屋！月牙陪你吹海風！',
    priority: 3, expression: 'speaking', once: true, phase: 'cinematic',
  }),
  ascension: Object.freeze({
    text: '哇…從彩色屋這邊看過去，基隆港好美',
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
 * LandmarkEvent.landmarkId -> line id.
 * Keelung has 9 landmarks (including goal).
 * @type {ReadonlyArray<string>}
 */
export const LANDMARK_LINE_IDS = Object.freeze([
  'lm_miaokou_gate',   // 0 廟口夜市牌樓
  'lm_keelung_station',// 1 基隆火車站
  'lm_guanyin_statue', // 2 中正公園觀音像
  'lm_ocean_plaza',    // 3 海洋廣場
  'lm_xiandonyan',     // 4 仙洞巖
  'lm_heping_island',  // 5 和平島公園
  'lm_keelung_islet',  // 6 基隆嶼燈塔
  'lm_qingan_temple',  // 7 慶安宮
  'lm_zhengbin',       // 8 正濱漁港彩色屋 (goal)
]);

/**
 * CollectEvent.collectibleId (0..12, canonical album) -> line id.
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
 * Keelung has no DUAL-tagged collectible/landmark pair.
 */
export const DUAL_COLLECTIBLE_ID = -1;
export const DUAL_LANDMARK_ID = -1;

/**
 * First-absorb-per-category: ScoreEvent.archetypeCode -> line id.
 * Keelung codes: code = tier*10 + slot.
 * @type {Readonly<Record<number, string>>}
 */
export const FIRST_LINE_BY_CODE = Object.freeze({
  // T0: small items (codes 0-7)
  0: 'first_marble', 1: 'first_marble', 2: 'first_marble', 3: 'first_marble',
  4: 'first_marble', 5: 'first_marble', 6: 'first_marble', 7: 'first_marble',
  // T1: 廟口小吃 — dingbian_cuo (slot 0 = code 10) gets own line
  10: 'first_dingbian', 11: 'first_dingbian', 12: 'first_dingbian',
  13: 'first_dingbian', 14: 'first_dingbian', 15: 'first_dingbian',
  16: 'first_dingbian', 17: 'first_dingbian',
  // T2: 騎樓 — red_plastic_chair (20), rice_cooker (22)
  20: 'first_chair', 21: 'first_chair', 22: 'first_ricecooker',
  23: 'first_chair', 24: 'first_chair', 25: 'first_chair',
  26: 'first_chair', 27: 'first_chair',
  // T3: 漁港街 — scooter (30), fishing_net (32)
  30: 'first_scooter', 31: 'first_scooter', 32: 'first_fishing_net',
  33: 'first_scooter', 34: 'first_scooter', 35: 'first_scooter',
  36: 'first_scooter', 37: 'first_scooter',
  // T4: 港邊街屋 — bus (44) gets own line; rest are 'first_building'
  40: 'first_building', 41: 'first_building', 42: 'first_building',
  43: 'first_building', 44: 'first_bus', 45: 'first_building',
  46: 'first_building', 47: 'first_building',
  // T5: 商港 — container (52)
  50: 'first_tower', 51: 'first_container', 52: 'first_container',
  53: 'first_tower', 54: 'first_tower', 55: 'first_tower',
  56: 'first_tower', 57: 'first_tower',
  // T6: 海港天際線
  60: 'first_tower', 61: 'first_tower', 62: 'first_tower',
  63: 'first_tower', 64: 'first_tower', 65: 'first_tower',
  66: 'first_tower', 67: 'first_tower',
});
