/**
 * @file packs/kinmen/narration.js — 月牙 (Formosan black bear) narration table
 * for the Kinmen pack.
 *
 * Mirrors the exact data shape of src/config/donackLines.js but with
 * zh-TW Kinmen content authored for 月牙's voice: warm, friendly, slightly
 * playful; drops Kinmen trivia and cheers the player on.  No Japanese, no
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
 *   LANDMARK_LINE_IDS     landmarkId -> id (0=翟山坑道..8=莒光樓/goal)
 *   COLLECT_LINE_IDS      collectibleId -> id (0..12)
 *   FIRST_LINE_BY_CODE    archetypeCode -> id
 *   DUAL_COLLECTIBLE_ID   (none in Kinmen — export 'no-dual' sentinel -1)
 *   DUAL_LANDMARK_ID      (-1: donack.js skips landmark if id === DUAL_LANDMARK_ID)
 *
 * Kinmen collectible album (ids 0-12):
 *   0 台灣黑熊  1 金門高粱酒  2 貢糖  3 風獅爺公仔  4 石蚵煎  5 金門牛肉乾
 *   6 金門菜刀  7 金門麵線  8 高粱糖  9 鋼盔  10 砲彈殼  11 廣東粥  12 媽祖
 *
 * Kinmen landmark order (landmarkId = array index in cityMap.LANDMARKS):
 *   0 翟山坑道  1 得月樓  2 風獅爺  3 山后民俗文化村  4 馬山觀測所
 *   5 文台寶塔  6 金門國家公園  7 建功嶼  8 莒光樓 (goal)
 *
 * First-absorb archetype codes (Kinmen tier layout, code = tier*10 + slot):
 *   T0 = 0-9  (彈珠/橡皮擦/圖釘/貢糖/高粱糖/尪仔標/鉛筆/鈕扣 + chunk lm)
 *   T1 = 10-19 (高粱酒瓶/牛肉乾/貢糖盒/石蚵/酒杯/煤油燈/蚵仔串/麵線碗 + chunk lm)
 *   T2 = 20-29 (紅塑膠椅/斗笠/石臼/瓦斯桶/三角錐/消防栓/風獅爺小像/曬魚架 + chunk lm)
 *   T3 = 30-39 (機車/小貨車/彈藥箱/纜繩柱/軍用桶/漁網堆/木麻黃/石獅 + chunk lm)
 *   T4 = 40-49 (透天厝/閩南洋樓/番仔樓/超商/公車/垃圾車/加油站/廊道柱 + chunk lm)
 *   T5 = 50-59 (軍營/坑道入口/碉堡/雷達站/營舍/反空降樁/瞭望塔/彈藥庫 + chunk lm)
 *   T6 = 60-67 (巨型風獅爺/巨岩/海崖/砲台/觀景台/大型坑道口/水頭塔/海岸大石 + chunk lm)
 *
 * Id contract: append-only.  Never reuse or rename existing ids.
 * Static data only — zero runtime allocation beyond module init.
 */

/** @typedef {{text:string, priority:number, expression:string, once:boolean, phase:string}} DonackLine */

const PLAY = 'play';

/**
 * The 月牙 Kinmen narration table.
 * @type {Readonly<Record<string, Readonly<DonackLine>>>}
 */
export const DONACK_LINES = Object.freeze({

  /* ---- run start ---- */
  start: Object.freeze({
    text: '從金城老街出發！光的箭頭指著下一個目標，跟上囉',
    priority: 2, expression: 'idle', once: true, phase: PLAY,
  }),

  /* ---- tier-ups (index via TIER_UP_LINE_IDS[tierIndex]) ---- */
  // tier0 is the starting tier — no tier-up INTO tier 0; index 0 slot left ''
  tier1: Object.freeze({
    text: '高粱酒巷弄！空氣裡都是陳年酒香，月牙聞到都醉了',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier2: Object.freeze({
    text: '閩南聚落出現！紅磚燕尾脊，老金門的建築美學',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier3: Object.freeze({
    text: '戰地碼頭！漁船和軍艦曾經並肩停泊的地方',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier4: Object.freeze({
    text: '洋樓與宗祠！南洋僑匯蓋的番仔樓，整排都是故事',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier5: Object.freeze({
    text: '坑道與軍事據點！八二三的歷史刻在每一塊花崗岩上',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier6: Object.freeze({
    text: '風獅爺天際線！巨大的守護神在海風中等著你',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),

  /* ---- first-absorb-per-category (index via FIRST_LINE_BY_CODE) ---- */
  first_marble: Object.freeze({
    text: '彈珠一顆！每顆大滾球都是從小東西開始的',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_kaoliang: Object.freeze({
    text: '高粱酒瓶！58 度的金門特產，月牙可不敢喝',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_chair: Object.freeze({
    text: '紅塑膠椅！柑仔店前、廟口前，金門人也愛坐這個',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_mortar: Object.freeze({
    text: '石臼！以前金門阿嬤都用這個搗花生做貢糖',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_scooter: Object.freeze({
    text: '機車來了！小島上最方便的交通工具',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_bus: Object.freeze({
    text: '島上公車！班次不多，但連結了每個聚落',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_mansion: Object.freeze({
    text: '閩南洋樓！南洋華僑賺了錢寄回來蓋的，每棟都是家族的驕傲',
    priority: 1, expression: 'happy', once: true, phase: PLAY,
  }),
  first_bunker: Object.freeze({
    text: '碉堡！八二三砲戰時守護金門的堅強防線',
    priority: 1, expression: 'happy', once: true, phase: PLAY,
  }),
  first_windlion: Object.freeze({
    text: '巨型風獅爺！鎮風煞、護聚落，金門最強守護神',
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
    text: '快到邊界了，轉個彎繞回聚落',
    priority: 1, expression: 'thinking', once: false, phase: PLAY,
  }),

  /* ---- landmark trivia (index via LANDMARK_LINE_IDS[landmarkId]) ---- */
  lm_zhaishan: Object.freeze({
    text: '翟山坑道！花崗岩裡挖出來的小艇坑道，水面倒影美到不行',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_deyue: Object.freeze({
    text: '得月樓！水頭聚落的防禦塔，南洋風格混閩南底蘊',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_windlion: Object.freeze({
    text: '風獅爺！金門最有代表性的守護神，鎮風鎮煞保平安',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_shanhou: Object.freeze({
    text: '山后民俗文化村！十八棟閩南古厝，保存最完整的傳統聚落',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_mashan: Object.freeze({
    text: '馬山觀測所！距離對岸只有 2 公里，以前是喊話站的地方',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_wentai: Object.freeze({
    text: '文台寶塔！明朝就有的石塔，金門最古老的地標',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_nationalpark: Object.freeze({
    text: '金門國家公園！全台唯一以戰地文化為主題的國家公園',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_jiangongyu: Object.freeze({
    text: '建功嶼！潮汐限定的神秘小島，退潮才能走過去',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_juguang: Object.freeze({
    text: '莒光樓！八二三勝利的紀念塔，金門最經典的地標',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),

  /* ---- goal call ---- */
  goal_call: Object.freeze({
    text: '莒光樓在呼喚你，月牙幫你加油！',
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
  col_kaoliang: Object.freeze({
    text: '金門高粱酒！58 度的烈酒，金門人宴客必備的面子',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_gongtang: Object.freeze({
    text: '貢糖！麥芽加花生，入口即化的金門古早味',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_windlion_figurine: Object.freeze({
    text: '風獅爺公仔！帶一尊回家，守護你的小天地',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_oyster: Object.freeze({
    text: '石蚵煎！金門的石蚵特別小顆特別鮮，跟台灣的不一樣',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_beef_jerky: Object.freeze({
    text: '金門牛肉乾！牛隻吃高粱酒糟長大的，肉質特別香',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_knife: Object.freeze({
    text: '金門菜刀！砲彈殼回收打造，把武器變成廚房工具的智慧',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_noodles: Object.freeze({
    text: '金門麵線！日曬的傳統手工麵線，口感 Q 彈',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_sorghum_candy: Object.freeze({
    text: '高粱糖！高粱酒加麥芽糖，金門限定的微醺甜蜜',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_helmet: Object.freeze({
    text: '鋼盔！八二三的記憶，戰地歲月的見證',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_shell: Object.freeze({
    text: '砲彈殼！從對岸飛過來的 47 萬顆砲彈之一，現在是紀念品',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_congee: Object.freeze({
    text: '廣東粥！一碗料多到滿出來，金門早餐的標準配備',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_mazu: Object.freeze({
    text: '媽祖！金門靠海的聚落都有媽祖廟，保佑討海人平安',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),

  /* ---- finale / result ---- */
  goal_contact: Object.freeze({
    text: '滾完莒光樓！月牙陪你守護金門！',
    priority: 3, expression: 'speaking', once: true, phase: 'cinematic',
  }),
  ascension: Object.freeze({
    text: '哇…從莒光樓俯瞰金門，海峽對岸的廈門燈火閃爍',
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
 * 7-tier Kinmen table.
 * @type {ReadonlyArray<string>}
 */
export const TIER_UP_LINE_IDS = Object.freeze([
  '', 'tier1', 'tier2', 'tier3', 'tier4', 'tier5', 'tier6',
]);

/**
 * LandmarkEvent.landmarkId (0..8, strictly increasing dioramaR order per
 * cityMap.LANDMARKS) -> line id.
 * Kinmen has no DUAL-tagged landmark: all 9 slots have bespoke lines.
 * @type {ReadonlyArray<string>}
 */
export const LANDMARK_LINE_IDS = Object.freeze([
  'lm_zhaishan',      // 0 翟山坑道
  'lm_deyue',         // 1 得月樓
  'lm_windlion',      // 2 風獅爺
  'lm_shanhou',       // 3 山后民俗文化村
  'lm_mashan',        // 4 馬山觀測所
  'lm_wentai',        // 5 文台寶塔
  'lm_nationalpark',  // 6 金門國家公園
  'lm_jiangongyu',    // 7 建功嶼
  'lm_juguang',       // 8 莒光樓 (goal — also fires on absorb if ever triggered)
]);

/**
 * CollectEvent.collectibleId (0..12, Kinmen canonical album) -> line id.
 * Unknown future ids fall back to 'col_generic'.
 * @type {ReadonlyArray<string>}
 */
export const COLLECT_LINE_IDS = Object.freeze([
  'col_bear',               //  0 台灣黑熊
  'col_kaoliang',           //  1 金門高粱酒
  'col_gongtang',           //  2 貢糖
  'col_windlion_figurine',  //  3 風獅爺公仔
  'col_oyster',             //  4 石蚵煎
  'col_beef_jerky',         //  5 金門牛肉乾
  'col_knife',              //  6 金門菜刀
  'col_noodles',            //  7 金門麵線
  'col_sorghum_candy',      //  8 高粱糖
  'col_helmet',             //  9 鋼盔
  'col_shell',              // 10 砲彈殼
  'col_congee',             // 11 廣東粥
  'col_mazu',               // 12 媽祖
]);

/**
 * Kinmen has no DUAL-tagged collectible/landmark pair.
 * DUAL_COLLECTIBLE_ID = -1 (sentinel: donack.js skips LANDMARK if
 * p.landmarkId === DUAL_LANDMARK_ID; -1 never matches a real id).
 */
export const DUAL_COLLECTIBLE_ID = -1;
export const DUAL_LANDMARK_ID = -1;

/**
 * First-absorb-per-category: ScoreEvent.archetypeCode -> line id.
 * Kinmen codes: code = tier*10 + slot (same formula as the legacy engine).
 *   T0 (0-7): small everyday items — marble triggers 'first_marble'
 *   T1 (10-17): 高粱酒巷 consumables — kaoliang_bottle (code 10) gets own line
 *   T2 (20-27): 閩南聚落 — red_plastic_chair (20), stone_mortar (22)
 *   T3 (30-37): 戰地碼頭 — scooter (30)
 *   T4 (40-47): 洋樓與宗祠 — island_bus (44) first_bus; minnan_mansion(41) first_mansion
 *   T5 (50-57): 坑道與軍事據點 — bunker (52) first_bunker
 *   T6 (60-67): 風獅爺天際線 — giant_wind_lion (60) first_windlion
 * @type {Readonly<Record<number, string>>}
 */
export const FIRST_LINE_BY_CODE = Object.freeze({
  // T0: small items trigger generic marble quip (codes 0-7)
  0: 'first_marble', 1: 'first_marble', 2: 'first_marble', 3: 'first_marble',
  4: 'first_marble', 5: 'first_marble', 6: 'first_marble', 7: 'first_marble',
  // T1: 高粱酒巷 — kaoliang_bottle (slot 0 = code 10) gets own line; others share marble category
  10: 'first_kaoliang', 11: 'first_marble', 12: 'first_marble',
  13: 'first_marble', 14: 'first_marble', 15: 'first_marble',
  16: 'first_marble', 17: 'first_marble',
  // T2: 閩南聚落 — red_plastic_chair (20), stone_mortar (22)
  20: 'first_chair', 21: 'first_chair', 22: 'first_mortar',
  23: 'first_chair', 24: 'first_chair', 25: 'first_chair',
  26: 'first_chair', 27: 'first_chair',
  // T3: 戰地碼頭 — scooter (30) gets own line; rest share scooter category
  30: 'first_scooter', 31: 'first_scooter', 32: 'first_scooter',
  33: 'first_scooter', 34: 'first_scooter', 35: 'first_scooter',
  36: 'first_scooter', 37: 'first_scooter',
  // T4: 洋樓與宗祠 — bus (44) gets own line; mansion(41) gets own line; rest are 'first_mansion'
  40: 'first_mansion', 41: 'first_mansion', 42: 'first_mansion',
  43: 'first_mansion', 44: 'first_bus', 45: 'first_mansion',
  46: 'first_mansion', 47: 'first_mansion',
  // T5: 坑道與軍事據點 — bunker (52) gets own line
  50: 'first_bunker', 51: 'first_bunker', 52: 'first_bunker',
  53: 'first_bunker', 54: 'first_bunker', 55: 'first_bunker',
  56: 'first_bunker', 57: 'first_bunker',
  // T6: 風獅爺天際線 — giant_wind_lion (60) first_windlion
  60: 'first_windlion', 61: 'first_windlion', 62: 'first_windlion',
  63: 'first_windlion', 64: 'first_windlion', 65: 'first_windlion',
  66: 'first_windlion', 67: 'first_windlion',
});
