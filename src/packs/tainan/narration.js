/**
 * @file packs/tainan/narration.js — 月牙 (Formosan black bear) narration table
 * for the Tainan (府城) pack.
 *
 * Mirrors the exact data shape of src/config/donackLines.js but with
 * zh-TW Tainan content authored for 月牙's voice: warm, friendly, slightly
 * playful; drops 府城 trivia and cheers the player on.  No Japanese, no
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
 *   T6 = 60-69 (玻璃帷幕高樓/跨橋/其他摩天樓/巨型廣告牆/商辦塔/空橋/屋頂機房/街區大樓 + chunk lm)
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
    text: '從國華街出發！光的箭頭指著下一個目標，跟著月牙逛府城',
    priority: 2, expression: 'idle', once: true, phase: PLAY,
  }),

  /* ---- tier-ups (index via TIER_UP_LINE_IDS[tierIndex]) ---- */
  // tier0 is the starting tier — no tier-up INTO tier 0; index 0 slot left ''
  tier1: Object.freeze({
    text: '滾進花園夜市囉！燈一亮，府城的暗時鬧熱才正要開始',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier2: Object.freeze({
    text: '到正興街騎樓了！老屋配文青小店，這條巷仔好行',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier3: Object.freeze({
    text: '神農老街出現了！紅磚老屋一棟接一棟，慢慢滾才有味',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier4: Object.freeze({
    text: '孔廟一帶的街屋和廟全進肚子了，府城的古早味好澎湃',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier5: Object.freeze({
    text: '滾到東區商圈！百貨、商辦、大馬路，整片攏總是你的',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier6: Object.freeze({
    text: '安平港的天際線！海風吹過來，林百貨就在前面等你',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),

  /* ---- first-absorb-per-category (index via FIRST_LINE_BY_CODE) ---- */
  first_marble: Object.freeze({
    text: '彈珠一顆！每顆大滾球攏是從這種小物開始的',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_betelnut: Object.freeze({
    text: '路邊的小物！府城老街什麼都有，月牙先幫你收起來',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_chair: Object.freeze({
    text: '紅塑膠椅！辦桌、廟會、吃小吃都少不了這一張',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_ricecooker: Object.freeze({
    text: '老街的家私頭！府城人煮牛肉湯、鹹粥就靠它',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_scooter: Object.freeze({
    text: '機車來了！穿巷仔鑽老街，府城的腳就是它',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_bus: Object.freeze({
    text: '公車吞進去了！司機大哥免閣開了',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_building: Object.freeze({
    text: '整棟樓！月牙也沒想到你這麼緊就長這麼大',
    priority: 1, expression: 'happy', once: true, phase: PLAY,
  }),
  first_tower: Object.freeze({
    text: '高樓！府城的天際線這馬攏是你的了',
    priority: 1, expression: 'happy', once: true, phase: PLAY,
  }),

  /* ---- play reactions / tips ---- */
  combo15: Object.freeze({
    text: '連消連消！月牙的爪子都快拍手拍到脫毛了',
    priority: 1, expression: 'happy', once: true, phase: PLAY,
  }),
  knockoff: Object.freeze({
    text: '掉了！傷大的先繞開，從邊仔的小物補大再衝',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  repeat_bonk: Object.freeze({
    text: '一直彈倒轉來是在提醒你：時機未到，先長大再說',
    priority: 1, expression: 'thinking', once: true, phase: PLAY,
  }),
  tip_idle: Object.freeze({
    text: '彼爿有小物！小的先掃光，大的才追會著',
    priority: 0, expression: 'thinking', once: false, phase: PLAY,
  }),
  tip_dash: Object.freeze({
    text: '衝刺蓄滿了，找條直路全速衝一波',
    priority: 0, expression: 'thinking', once: false, phase: PLAY,
  }),
  tip_edge: Object.freeze({
    text: '快到邊界了，斡個彎繞倒轉老街',
    priority: 1, expression: 'thinking', once: false, phase: PLAY,
  }),

  /* ---- landmark trivia (index via LANDMARK_LINE_IDS[landmarkId]) ---- */
  lm_beimen: Object.freeze({
    text: '安平劍獅！古早人家門楣上的守護神,咬劍鎮宅、避邪保平安',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_longshan: Object.freeze({
    text: '赤崁樓！荷蘭人蓋的普羅民遮城,府城三百多年的老靈魂就在這',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_ximen: Object.freeze({
    text: '臺南孔廟！全臺第一座孔廟,「全臺首學」這四個字就是它的招牌',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_grand_hotel: Object.freeze({
    text: '祀典武廟!拜關公的官廟,紅牆配燕尾脊,府城人都叫它大關帝廟',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_presidential: Object.freeze({
    text: '安平古堡!鄭成功的熱蘭遮城,城牆的老磚到今嘛還站得直挺挺',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_cks: Object.freeze({
    text: '億載金城!沈葆楨建的西式砲台,門口寫著「萬流砥柱」,氣勢十足',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_liberty_arch: Object.freeze({
    text: '臺灣文學館!日治時代的臺南州廳,如今是收藏全臺文學的老房子',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_arena: Object.freeze({
    text: '奇美博物館!白色的西洋宮殿配阿波羅噴泉,拍照打卡的人攏排規排',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_taipei101: Object.freeze({
    text: '林百貨!1932 年的「五層樓仔」,府城第一棟百貨,要滾進去嗎',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),

  /* ---- goal call ---- */
  goal_call: Object.freeze({
    text: '林百貨在呼喚你，月牙幫你加油！',
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
    text: '棺材板！名字驚人,其實是炸吐司挖空裝濃湯,府城獨有的古早味',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_chicken_chop: Object.freeze({
    text: '蝦捲！外酥內彈,包著鮮蝦下去炸,沾醬一口接一口',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_gua_bao: Object.freeze({
    text: '擔仔麵!一碗細細的,肉燥配蝦頭熬的湯,府城百年的好味',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_xiaolongbao: Object.freeze({
    text: '牛肉湯!府城人的早起,溫體牛肉沖滾湯,鮮甜到會醒神',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_pineapple_cake: Object.freeze({
    text: '蝦仁飯!粒粒飽滿的火燒蝦配香米,簡單卻好吃到掃盤',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_electronic_prince: Object.freeze({
    text: '虱目魚!府城人從魚肚煮到魚皮,一尾魚攏總無浪費',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_puppet: Object.freeze({
    text: '椪餅!圓圓中空的古早餅,敲開灑黑糖,是府城人的甜蜜回憶',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_youbike: Object.freeze({
    text: '豆花!府城的豆花軟綿綿,淋糖水配粉圓,熱天透心涼',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_pres_office: Object.freeze({
    text: '關廟鳳梨!關廟的日頭甜,種出來的旺來酸甜對味,摺進相簿了',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_gondola: Object.freeze({
    text: '鹹粥!府城人的暗頓暖胃料理,虱目魚配米粒,一碗落肚足滿足',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_shihlin_chicken: Object.freeze({
    text: '碗粿!在來米漿蒸的,裡面包肉燥香菇蛋黃,淋醬油膏正港好食',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_mazu: Object.freeze({
    text: '媽祖！台灣最多信眾的神明，繞境一走就是好幾天',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),

  /* ---- finale / result ---- */
  goal_contact: Object.freeze({
    text: '滾上林百貨！月牙陪你登頂府城！',
    priority: 3, expression: 'speaking', once: true, phase: 'cinematic',
  }),
  ascension: Object.freeze({
    text: '哇…從這麼懸的所在看府城，運河的燈光媠甲若天星',
    priority: 3, expression: 'speaking', once: true, phase: 'cinematic',
  }),
  result: Object.freeze({
    text: '辛苦了！把成績分享出去，乎逐家看月牙的玩家有偌厲害',
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
