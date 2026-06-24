/**
 * @file packs/miaoli/narration.js — 月牙 (Formosan black bear) narration
 * table for the Miaoli pack.
 *
 * Mirrors the exact data shape of src/config/donackLines.js but with zh-TW
 * 苗栗 content authored for 月牙's voice: warm, friendly, slightly playful, a
 * little 客家味. Drops 苗栗 trivia and cheers the player on. No Japanese, no
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
 *   LANDMARK_LINE_IDS     landmarkId -> id (0=勝興車站..8=龍騰斷橋/goal)
 *   COLLECT_LINE_IDS      collectibleId -> id (0..12)
 *   FIRST_LINE_BY_CODE    archetypeCode -> id
 *   DUAL_COLLECTIBLE_ID   (none — export -1 sentinel)
 *   DUAL_LANDMARK_ID      (-1: donack.js skips landmark if id === DUAL_LANDMARK_ID)
 *
 * Miaoli collectible album (ids 0-12):
 *   0 台灣黑熊  1 客家擂茶  2 大湖草莓  3 桐花  4 客家粄條  5 客家麻糬
 *   6 柿餅  7 三義木雕  8 舊山線鐵道自行車  9 藺草帽  10 客家花布
 *   11 客家菜包  12 桐油瓶
 *
 * Miaoli landmark order (landmarkId = array index in cityMap.LANDMARKS):
 *   0 勝興車站  1 南庄老街  2 大湖草莓園  3 三義木雕博物館  4 通霄神社
 *   5 公館桐花步道  6 苑裡藺草博物館  7 明德水庫  8 龍騰斷橋 (goal)
 *
 * First-absorb archetype codes (Miaoli tier layout, code = tier*10 + slot).
 *
 * Id contract: append-only.  Never reuse or rename existing ids.
 * Static data only — zero runtime allocation beyond module init.
 */

/** @typedef {{text:string, priority:number, expression:string, once:boolean, phase:string}} DonackLine */

const PLAY = 'play';

/**
 * The 月牙 Miaoli narration table.
 * @type {Readonly<Record<string, Readonly<DonackLine>>>}
 */
export const DONACK_LINES = Object.freeze({

  /* ---- run start ---- */
  start: Object.freeze({
    text: '對客庄柑仔店出發！光的箭頭指下一站，跟上來喔',
    priority: 2, expression: 'idle', once: true, phase: PLAY,
  }),

  /* ---- tier-ups (index via TIER_UP_LINE_IDS[tierIndex]) ---- */
  // tier0 is the starting tier — no tier-up INTO tier 0; index 0 slot left ''
  tier1: Object.freeze({
    text: '到客家小吃街囉！擂茶香、粄條Q，這就是苗栗的味道',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier2: Object.freeze({
    text: '草莓園騎樓！大湖的草莓紅通通，一籃一籃滾入來',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier3: Object.freeze({
    text: '三義木雕街！木頭香和桐花香混在一起，聞起來真棒',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier4: Object.freeze({
    text: '整排客庄街屋和廟都滾入來了，感覺好澎湃',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier5: Object.freeze({
    text: '進入舊山線鐵道區！火車、隧道、鐵橋，全都是你的',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier6: Object.freeze({
    text: '龍騰斷橋天際線！紅磚拱門就在前面等著你了',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),

  /* ---- first-absorb-per-category (index via FIRST_LINE_BY_CODE) ---- */
  first_marble: Object.freeze({
    text: '彈珠一顆！每顆大滾球都是從小東西開始的',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_strawberry: Object.freeze({
    text: '草莓！大湖的紅寶石，又甜又香',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_chair: Object.freeze({
    text: '紅塑膠椅！辦桌、廟會、草莓園都少不了它',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_ricecooker: Object.freeze({
    text: '電鍋！台灣人的靈魂廚具，煮粄條剛剛好',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_scooter: Object.freeze({
    text: '機車來了！山線小路騎機車最方便',
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
    text: '高樓！苗栗的天際線現在是你的了',
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
    text: '快到邊界了，轉個彎繞回客庄',
    priority: 1, expression: 'thinking', once: false, phase: PLAY,
  }),

  /* ---- landmark trivia (index via LANDMARK_LINE_IDS[landmarkId]) ---- */
  lm_shengxing: Object.freeze({
    text: '勝興車站！海拔 402 公尺，台灣西部最高的火車站',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_nanzhuang: Object.freeze({
    text: '南庄老街！百年桂花巷，客家風情古色古香',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_dahu: Object.freeze({
    text: '大湖草莓園！每年冬天紅通通一片，酸酸甜甜好滋味',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_sanyi: Object.freeze({
    text: '三義木雕博物館！台灣木雕藝術的殿堂，每件作品都有生命',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_tongxiao: Object.freeze({
    text: '通霄神社！日治時代留下來的，現在變成打卡熱點',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_gongguan: Object.freeze({
    text: '公館桐花步道！五月雪紛飛，白色花瓣鋪滿山路',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_yuanli: Object.freeze({
    text: '苑裡藺草博物館！用藺草編帽子和蓆子，傳統工藝好厲害',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_mingde: Object.freeze({
    text: '明德水庫！湖光山色，吊橋搖啊搖，好愜意',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_longteng: Object.freeze({
    text: '龍騰斷橋！1908 年建的紅磚拱橋，地震後成了最美的廢墟',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),

  /* ---- goal call ---- */
  goal_call: Object.freeze({
    text: '龍騰斷橋在呼喚你，月牙幫你加油！',
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
  col_leicha: Object.freeze({
    text: '客家擂茶！杵臼磨出來的香，喝一口暖到心底',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_strawberry: Object.freeze({
    text: '大湖草莓！冬天來苗栗就是要採草莓，現採現吃最新鮮',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_tung_blossom: Object.freeze({
    text: '桐花！五月雪，滿山遍野的白色花海好浪漫',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_bantiao: Object.freeze({
    text: '客家粄條！Q彈滑嫩，乾炒湯煮都好吃',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_mochi: Object.freeze({
    text: '客家麻糬！裹著花生粉和芝麻，甜滋滋黏答答',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_persimmon: Object.freeze({
    text: '柿餅！新埔曬出來的，軟Q帶甜，秋天的味道',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_woodcarving: Object.freeze({
    text: '三義木雕！師傅一刀一鑿刻出來的藝術品',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_railbike: Object.freeze({
    text: '舊山線鐵道自行車！踩著鐵軌穿過隧道，好特別的體驗',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_rush_hat: Object.freeze({
    text: '藺草帽！苑裡阿嬤一針一線編出來的，涼爽又好看',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_hakka_floral: Object.freeze({
    text: '客家花布！大紅大綠的牡丹花，熱情又喜氣',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_caibao: Object.freeze({
    text: '客家菜包！蘿蔔絲餡料包進去，鹹香鹹香的',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_tung_oil: Object.freeze({
    text: '桐油！以前點燈用的，現在是古早味的代表',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),

  /* ---- finale / result ---- */
  goal_contact: Object.freeze({
    text: '滾完龍騰斷橋！月牙陪你登頂！',
    priority: 3, expression: 'speaking', once: true, phase: 'cinematic',
  }),
  ascension: Object.freeze({
    text: '哇…從斷橋上面看山線，綠油油的山谷好漂亮',
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
 * 7-tier Miaoli table.
 * @type {ReadonlyArray<string>}
 */
export const TIER_UP_LINE_IDS = Object.freeze([
  '', 'tier1', 'tier2', 'tier3', 'tier4', 'tier5', 'tier6',
]);

/**
 * LandmarkEvent.landmarkId (0..8, strictly increasing dioramaR order per
 * cityMap.LANDMARKS) -> line id.
 * Miaoli has no DUAL-tagged landmark: all 9 slots have bespoke lines.
 * @type {ReadonlyArray<string>}
 */
export const LANDMARK_LINE_IDS = Object.freeze([
  'lm_shengxing',     // 0 勝興車站
  'lm_nanzhuang',     // 1 南庄老街
  'lm_dahu',          // 2 大湖草莓園
  'lm_sanyi',         // 3 三義木雕博物館
  'lm_tongxiao',      // 4 通霄神社
  'lm_gongguan',      // 5 公館桐花步道
  'lm_yuanli',        // 6 苑裡藺草博物館
  'lm_mingde',        // 7 明德水庫
  'lm_longteng',      // 8 龍騰斷橋 (goal — also fires on absorb if ever triggered)
]);

/**
 * CollectEvent.collectibleId (0..12, Miaoli canonical album) -> line id.
 * Unknown future ids fall back to 'col_generic'.
 * @type {ReadonlyArray<string>}
 */
export const COLLECT_LINE_IDS = Object.freeze([
  'col_bear',           //  0 台灣黑熊
  'col_leicha',         //  1 客家擂茶
  'col_strawberry',     //  2 大湖草莓
  'col_tung_blossom',   //  3 桐花
  'col_bantiao',        //  4 客家粄條
  'col_mochi',          //  5 客家麻糬
  'col_persimmon',      //  6 柿餅
  'col_woodcarving',    //  7 三義木雕
  'col_railbike',       //  8 舊山線鐵道自行車
  'col_rush_hat',       //  9 藺草帽
  'col_hakka_floral',   // 10 客家花布
  'col_caibao',         // 11 客家菜包
  'col_tung_oil',       // 12 桐油瓶
]);

/**
 * Miaoli has no DUAL-tagged collectible/landmark pair.
 * DUAL_COLLECTIBLE_ID = -1 (sentinel: donack.js skips LANDMARK if
 * p.landmarkId === DUAL_LANDMARK_ID; -1 never matches a real id).
 */
export const DUAL_COLLECTIBLE_ID = -1;
export const DUAL_LANDMARK_ID = -1;

/**
 * First-absorb-per-category: ScoreEvent.archetypeCode -> line id.
 * Miaoli codes: code = tier*10 + slot (same formula as the legacy engine).
 *   T0 (0-7): small everyday items — marble triggers 'first_marble'
 *   T1 (10-19): 客家小吃 — strawberry (code 12) triggers 'first_strawberry'
 *   T2 (20-29): 草莓園騎樓 — red_plastic_chair (20), rice_cooker (22)
 *   T3 (30-39): 三義木雕街 — scooter (30)
 *   T4 (40-49): 客庄街屋 — city_bus (44) first_bus; townhouse(40) first_building
 *   T5 (50-59): 舊山線鐵道 — office_tower (50) first_tower
 *   T6 (60-69): 龍騰斷橋天際線 — glass_highrise (60) first_tower (shared)
 * @type {Readonly<Record<number, string>>}
 */
export const FIRST_LINE_BY_CODE = Object.freeze({
  // T0: small items trigger generic marble quip (codes 0-7)
  0: 'first_marble', 1: 'first_marble', 2: 'first_marble', 3: 'first_marble',
  4: 'first_marble', 5: 'first_marble', 6: 'first_marble', 7: 'first_marble',
  // T1: 客家小吃 — strawberry (slot 2 = code 12) gets own line; others share marble category
  10: 'first_marble', 11: 'first_marble', 12: 'first_strawberry',
  13: 'first_marble', 14: 'first_marble', 15: 'first_marble',
  16: 'first_marble', 17: 'first_marble',
  // T2: 草莓園騎樓 — red_plastic_chair (20), rice_cooker (22)
  20: 'first_chair', 21: 'first_chair', 22: 'first_ricecooker',
  23: 'first_chair', 24: 'first_chair', 25: 'first_chair',
  26: 'first_chair', 27: 'first_chair',
  // T3: 三義木雕街 — scooter (30) gets own line; rest share scooter category
  30: 'first_scooter', 31: 'first_scooter', 32: 'first_scooter',
  33: 'first_scooter', 34: 'first_scooter', 35: 'first_scooter',
  36: 'first_scooter', 37: 'first_scooter',
  // T4: 客庄 buildings — bus (44) gets own line; rest are 'first_building'
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
