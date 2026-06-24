/**
 * @file packs/changhua/narration.js — 月牙 (Formosan black bear) narration table
 * for the Changhua pack.
 *
 * Mirrors the exact data shape of src/config/donackLines.js but with
 * zh-TW Changhua content authored for 月牙's voice: warm, friendly, slightly
 * playful; drops Changhua trivia and cheers the player on.  No Japanese, no
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
 *   LANDMARK_LINE_IDS     landmarkId -> id (0=鹿港龍山寺..8=八卦山大佛/goal)
 *   COLLECT_LINE_IDS      collectibleId -> id (0..12)
 *   FIRST_LINE_BY_CODE    archetypeCode -> id
 *   DUAL_COLLECTIBLE_ID   (none in Changhua — export 'no-dual' sentinel -1)
 *   DUAL_LANDMARK_ID      (-1: donack.js skips landmark if id === DUAL_LANDMARK_ID)
 *
 * Changhua collectible album (P7 canonical list, ids 0-12):
 *   0 台灣黑熊  1 肉圓  2 爌肉飯  3 蚵仔煎  4 牛舌餅  5 鳳眼糕
 *   6 麵線  7 面茶  8 蒸汽火車頭  9 紙扇  10 燈籠
 *   11 鹿港線香  12 媽祖
 *
 * Changhua landmark order (landmarkId = array index in cityMap.LANDMARKS):
 *   0 鹿港龍山寺  1 鹿港天后宮  2 扇形車庫  3 彰化孔廟  4 摸乳巷
 *   5 九曲巷  6 玻璃廟  7 王功燈塔  8 八卦山大佛 (goal)
 *
 * First-absorb archetype codes (Changhua tier layout, code = tier*10 + slot):
 *   T0 = 0-9  (彈珠/小盤香/圖釘/鹿港糖/扇墜/尪仔標/小毛筆/廟珠 + chunk lm)
 *   T1 = 10-19 (竹筷套/線香束/燈籠飾/媽祖符/牛舌餅袋/養樂多/寶特瓶/紅白袋 + chunk lm)
 *   T2 = 20-29 (紙扇/香爐(小)/肉圓碗/爌肉飯盒/玻璃藝品/三角錐/消防栓/招財貓 + chunk lm)
 *   T3 = 30-39 (蒸籠/媽祖神像(小)/紅磚柱/石獅(小)/三輪車/機車/小貨車/變電箱 + chunk lm)
 *   T4 = 40-49 (改裝機車/廟口攤位/紅磚牆/蒸汽火車頭模型/媽祖轎/透天厝/公寓/超商 + chunk lm)
 *   T5 = 50-59 (老街牌樓/扇形車庫單格/蚵殼山/花田/百貨/捷運高架/天橋/停車塔 + chunk lm)
 *   T6 = 60-69 (龍山寺塔/鹿港街屋/大佛座/田尾花市棚/商辦塔/玻璃帷幕街屋/屋頂機房/街區大樓 + chunk lm)
 *
 * Id contract: append-only.  Never reuse or rename existing ids.
 * Static data only — zero runtime allocation beyond module init.
 */

/** @typedef {{text:string, priority:number, expression:string, once:boolean, phase:string}} DonackLine */

const PLAY = 'play';

/**
 * The 月牙 Changhua narration table.
 * @type {Readonly<Record<string, Readonly<DonackLine>>>}
 */
export const DONACK_LINES = Object.freeze({

  /* ---- run start ---- */
  start: Object.freeze({
    text: '從鹿港老街出發！光的箭頭指著下一個目標，跟上囉',
    priority: 2, expression: 'idle', once: true, phase: PLAY,
  }),

  /* ---- tier-ups (index via TIER_UP_LINE_IDS[tierIndex]) ---- */
  // tier0 is the starting tier — no tier-up INTO tier 0; index 0 slot left ''
  tier1: Object.freeze({
    text: '進廟口了！香煙裊裊，媽祖保佑你一路順滾',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier2: Object.freeze({
    text: '騎樓老街！古蹟連著古蹟，鹿港的靈魂就在這裡',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier3: Object.freeze({
    text: '三輪車和蒸籠都來了！這就是傳統市集的熱鬧',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier4: Object.freeze({
    text: '廟口攤位、媽祖轎全都進肚子了，月牙看了都餓了',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier5: Object.freeze({
    text: '扇形車庫出現了！全台灣最後一座火車頭旅館',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier6: Object.freeze({
    text: '八卦山天際線！大佛就在前面等著你了',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),

  /* ---- first-absorb-per-category (index via FIRST_LINE_BY_CODE) ---- */
  first_marble: Object.freeze({
    text: '彈珠一顆！每顆大滾球都是從小東西開始的',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_incense: Object.freeze({
    text: '線香！鹿港的香火已經傳了兩百多年了',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_fan: Object.freeze({
    text: '紙扇！鹿港傳統工藝，每一把都是師傅手工製作',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_meatball: Object.freeze({
    text: '肉圓！彰化名產，月牙推薦吃清蒸的',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_pedicab: Object.freeze({
    text: '三輪車來了！鹿港老街的標準交通工具',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_locomotive: Object.freeze({
    text: '蒸汽火車頭！扇形車庫裡還有好幾輛在保養呢',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_building: Object.freeze({
    text: '整排街屋！月牙也沒想到你這麼快就長這麼大',
    priority: 1, expression: 'happy', once: true, phase: PLAY,
  }),
  first_tower: Object.freeze({
    text: '龍山寺塔！鹿港的天際線現在是你的了',
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
    text: '快到邊界了，轉個彎繞回老街',
    priority: 1, expression: 'thinking', once: false, phase: PLAY,
  }),

  /* ---- landmark trivia (index via LANDMARK_LINE_IDS[landmarkId]) ---- */
  lm_lukang_longshan: Object.freeze({
    text: '鹿港龍山寺！清朝古蹟，台灣保存最完整的清代建築之一',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_lukang_tianhou: Object.freeze({
    text: '鹿港天后宮！媽祖信仰重鎮，每年三月瘋媽祖就是這裡開始的',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_roundhouse: Object.freeze({
    text: '扇形車庫！全台唯一還在運作的扇形車庫，火車頭的旅館',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_changhua_confucius: Object.freeze({
    text: '彰化孔廟！清朝蓋的，到現在還有祭孔大典',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_moruxiang: Object.freeze({
    text: '摸乳巷！寬度只有70公分，據說兩個人要側身才過得去',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_jiuquxiang: Object.freeze({
    text: '九曲巷！故意蓋得彎彎曲曲，用來擋東北季風的',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_glass_temple: Object.freeze({
    text: '玻璃媽祖廟！整座廟用玻璃蓋的，超級閃亮',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_wanggong_lighthouse: Object.freeze({
    text: '王功燈塔！黑白條紋超顯眼，台灣最高的燈塔之一',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_baguashan_buddha: Object.freeze({
    text: '八卦山大佛！22.5公尺高的如來大佛，彰化的地標，要捲進去嗎',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),

  /* ---- goal call ---- */
  goal_call: Object.freeze({
    text: '八卦山大佛在呼喚你，月牙幫你加油！',
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
  col_meatball: Object.freeze({
    text: '彰化肉圓！外皮Q彈內餡飽滿，月牙每次來彰化一定要吃',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_kongrou_rice: Object.freeze({
    text: '爌肉飯！滷到入味的五花肉配白飯，彰化人的靈魂早餐',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_oyster_omelet: Object.freeze({
    text: '蚵仔煎！王功的蚵仔最新鮮，配甜辣醬超對味',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_ox_tongue_cake: Object.freeze({
    text: '牛舌餅！鹿港名產，長得像牛舌頭所以叫這個名字',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_phoenix_eye_cake: Object.freeze({
    text: '鳳眼糕！鹿港傳統糕點，一口一個剛剛好',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_misua: Object.freeze({
    text: '麵線！鹿港的麵線又細又滑，月牙可以吃三碗',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_face_tea: Object.freeze({
    text: '面茶！鹿港獨有的傳統飲品，熱熱喝最好',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_locomotive: Object.freeze({
    text: '蒸汽火車頭！扇形車庫裡的老火車頭，現在變收藏品了',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_paper_fan: Object.freeze({
    text: '紙扇！鹿港師傅手工製作，上面的字畫也是一筆一劃寫的',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_lantern: Object.freeze({
    text: '燈籠！鹿港燈籠出名的漂亮，過年時整條街都紅通通',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_incense: Object.freeze({
    text: '鹿港線香！兩百年的製香工藝，整個鹿港都是香的',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_mazu: Object.freeze({
    text: '媽祖！鹿港天后宮的媽祖最靈驗，信眾遍及全台灣',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),

  /* ---- finale / result ---- */
  goal_contact: Object.freeze({
    text: '滾完八卦山大佛！月牙陪你登頂！',
    priority: 3, expression: 'speaking', once: true, phase: 'cinematic',
  }),
  ascension: Object.freeze({
    text: '哇…從八卦山上看下去，整個彰化平原都在腳下',
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
 * 7-tier Changhua table.
 * @type {ReadonlyArray<string>}
 */
export const TIER_UP_LINE_IDS = Object.freeze([
  '', 'tier1', 'tier2', 'tier3', 'tier4', 'tier5', 'tier6',
]);

/**
 * LandmarkEvent.landmarkId (0..8, strictly increasing dioramaR order per
 * cityMap.LANDMARKS) -> line id.
 * Changhua has no DUAL-tagged landmark: all 9 slots have bespoke lines.
 * @type {ReadonlyArray<string>}
 */
export const LANDMARK_LINE_IDS = Object.freeze([
  'lm_lukang_longshan',     // 0 鹿港龍山寺
  'lm_lukang_tianhou',      // 1 鹿港天后宮
  'lm_roundhouse',          // 2 扇形車庫
  'lm_changhua_confucius',  // 3 彰化孔廟
  'lm_moruxiang',           // 4 摸乳巷
  'lm_jiuquxiang',          // 5 九曲巷
  'lm_glass_temple',        // 6 玻璃廟
  'lm_wanggong_lighthouse', // 7 王功燈塔
  'lm_baguashan_buddha',    // 8 八卦山大佛 (goal — also fires on absorb if ever triggered)
]);

/**
 * CollectEvent.collectibleId (0..12, Changhua canonical P7 album) -> line id.
 * Unknown future ids fall back to 'col_generic'.
 * @type {ReadonlyArray<string>}
 */
export const COLLECT_LINE_IDS = Object.freeze([
  'col_bear',             //  0 台灣黑熊
  'col_meatball',         //  1 肉圓
  'col_kongrou_rice',     //  2 爌肉飯
  'col_oyster_omelet',    //  3 蚵仔煎
  'col_ox_tongue_cake',   //  4 牛舌餅
  'col_phoenix_eye_cake', //  5 鳳眼糕
  'col_misua',            //  6 麵線
  'col_face_tea',         //  7 面茶
  'col_locomotive',       //  8 蒸汽火車頭
  'col_paper_fan',        //  9 紙扇
  'col_lantern',          // 10 燈籠
  'col_incense',          // 11 鹿港線香
  'col_mazu',             // 12 媽祖
]);

/**
 * Changhua has no DUAL-tagged collectible/landmark pair.
 * DUAL_COLLECTIBLE_ID = -1 (sentinel: donack.js skips LANDMARK if
 * p.landmarkId === DUAL_LANDMARK_ID; -1 never matches a real id).
 */
export const DUAL_COLLECTIBLE_ID = -1;
export const DUAL_LANDMARK_ID = -1;

/**
 * First-absorb-per-category: ScoreEvent.archetypeCode -> line id.
 * Changhua codes: code = tier*10 + slot (same formula as the legacy engine).
 *   T0 (0-7): small everyday items — marble triggers 'first_marble'
 *   T1 (10-19): 廟口 consumables — incense_bundle (code 11) triggers 'first_incense'
 *   T2 (20-29): 騎樓老街 objects — paper_fan (20), meatball_bowl (22)
 *   T3 (30-39): 傳統市集 — pedicab (34)
 *   T4 (40-49): 媽祖文化 — steam_locomotive (43) first_locomotive; temple_stall(41) first_building
 *   T5 (50-59): 扇形車庫 — roundhouse_bay (51) first_locomotive
 *   T6 (60-69): 八卦山天際線 — longshan_pagoda (60) first_tower
 * @type {Readonly<Record<number, string>>}
 */
export const FIRST_LINE_BY_CODE = Object.freeze({
  // T0: small items trigger generic marble quip (codes 0-7)
  0: 'first_marble', 1: 'first_incense', 2: 'first_marble', 3: 'first_marble',
  4: 'first_fan', 5: 'first_marble', 6: 'first_marble', 7: 'first_marble',
  // T1: 廟口 — incense_bundle (slot 1 = code 11) gets own line; others share marble category
  10: 'first_marble', 11: 'first_incense', 12: 'first_marble',
  13: 'first_marble', 14: 'first_marble', 15: 'first_marble',
  16: 'first_marble', 17: 'first_marble',
  // T2: 騎樓老街 — paper_fan (20), meatball_bowl (22)
  20: 'first_fan', 21: 'first_incense', 22: 'first_meatball',
  23: 'first_meatball', 24: 'first_fan', 25: 'first_marble',
  26: 'first_marble', 27: 'first_marble',
  // T3: 傳統市集 — pedicab (34) gets own line; rest share pedicab category
  30: 'first_meatball', 31: 'first_marble', 32: 'first_marble',
  33: 'first_marble', 34: 'first_pedicab', 35: 'first_pedicab',
  36: 'first_pedicab', 37: 'first_pedicab',
  // T4: 媽祖文化 buildings — locomotive (43) gets own line; rest are 'first_building'
  40: 'first_pedicab', 41: 'first_building', 42: 'first_building',
  43: 'first_locomotive', 44: 'first_building', 45: 'first_building',
  46: 'first_building', 47: 'first_building',
  // T5/T6: towers
  50: 'first_building', 51: 'first_locomotive', 52: 'first_building',
  53: 'first_building', 54: 'first_tower', 55: 'first_tower',
  56: 'first_tower', 57: 'first_tower',
  60: 'first_tower', 61: 'first_tower', 62: 'first_tower',
  63: 'first_tower', 64: 'first_tower', 65: 'first_tower',
  66: 'first_tower', 67: 'first_tower',
});
