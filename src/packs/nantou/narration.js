/**
 * @file packs/nantou/narration.js — 月牙 (Formosan black bear) narration table
 * for the Nantou pack.
 *
 * Mirrors the exact data shape of src/config/donackLines.js but with
 * zh-TW Nantou content authored for 月牙's voice: warm, friendly, slightly
 * playful; drops Nantou trivia and cheers the player on.  No Japanese, no
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
 *   LANDMARK_LINE_IDS     landmarkId -> id (0=文武廟..8=慈恩塔/goal)
 *   COLLECT_LINE_IDS      collectibleId -> id (0..12)
 *   FIRST_LINE_BY_CODE    archetypeCode -> id
 *   DUAL_COLLECTIBLE_ID   (none in Nantou — export 'no-dual' sentinel -1)
 *   DUAL_LANDMARK_ID      (-1: donack.js skips landmark if id === DUAL_LANDMARK_ID)
 *
 * Nantou collectible album (ids 0-12):
 *   0 台灣黑熊  1 珍奶  2 雞排  3 刈包  4 小籠包  5 鳳梨酥
 *   6 電音三太子  7 布袋戲偶  8 竹編籃  9 紹興酒瓶  10 日月潭纜車
 *   11 清境綿羊  12 媽祖
 *
 * Nantou landmark order (landmarkId = array index in cityMap.LANDMARKS):
 *   0 文武廟  1 玄光寺  2 九族文化村  3 清境小瑞士  4 紙教堂
 *   5 集集車站  6 日月潭纜車站  7 埔里酒廠  8 慈恩塔 (goal)
 *
 * First-absorb archetype codes (Nantou tier layout, code = tier*10 + slot):
 *   T0 = 0-9  (竹山柑仔店桌頭 — 彈珠/橡皮擦/圖釘/瓶蓋/糖果/尪仔標/鉛筆/鈕扣 + chunk lm)
 *   T1 = 10-19 (埔里小吃街 — 紹興麵線/茶葉蛋/紹興香腸/紹興酒瓶/筍乾/百香果/豆腐乳/草仔粿 + chunk lm)
 *   T2 = 20-29 (竹山老街騎樓 — 紅塑膠椅/竹編籃/竹製蒸籠/竹藝品展架/三角錐/消防栓/招財貓/腳踏車 + chunk lm)
 *   T3 = 30-39 (茶園梯田 — 茶樹/採茶機/茶園涼亭/茶園石階/揉茶機/茶園棚架/茶園石獅/焙茶爐 + chunk lm)
 *   T4 = 40-49 (埔里街屋與廟 — 透天厝/鐵皮屋/老公寓/超商/公車/垃圾車/加油站/騎樓柱 + chunk lm)
 *   T5 = 50-59 (清境農場 — 民宿渡假村/歐式木屋/纜車柱/天空步道/停車場/巨型看板/清境小瑞士小屋/牧場 + chunk lm)
 *   T6 = 60-69 (日月潭湖畔天際線 — 湖畔飯店/遊艇碼頭/纜車塔/觀景台/商辦塔/空橋/屋頂機房/湖畔大樓群 + chunk lm)
 *
 * Id contract: append-only.  Never reuse or rename existing ids.
 * Static data only — zero runtime allocation beyond module init.
 */

/** @typedef {{text:string, priority:number, expression:string, once:boolean, phase:string}} DonackLine */

const PLAY = 'play';

/**
 * The 月牙 Nantou narration table.
 * @type {Readonly<Record<string, Readonly<DonackLine>>>}
 */
export const DONACK_LINES = Object.freeze({

  /* ---- run start ---- */
  start: Object.freeze({
    text: '從竹山小鎮出發！光的箭頭指著日月潭方向，跟上囉',
    priority: 2, expression: 'idle', once: true, phase: PLAY,
  }),

  /* ---- tier-ups (index via TIER_UP_LINE_IDS[tierIndex]) ---- */
  // tier0 is the starting tier — no tier-up INTO tier 0; index 0 slot left ''
  tier1: Object.freeze({
    text: '埔里小吃街到了！紹興酒香飄過來，這裡的麵線超有名',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier2: Object.freeze({
    text: '竹山老街！竹藝品、竹編籃，南投的竹子產業從這裡開始',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier3: Object.freeze({
    text: '茶園梯田出現了！凍頂烏龍的故鄉，滿山遍野都是茶香',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier4: Object.freeze({
    text: '埔里街屋和地母廟都進肚子了，感覺好澎湃',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier5: Object.freeze({
    text: '清境農場！羊群、歐式木屋、天空步道，像到了瑞士一樣',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier6: Object.freeze({
    text: '日月潭湖畔天際線！慈恩塔就在山頂等著你了',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),

  /* ---- first-absorb-per-category (index via FIRST_LINE_BY_CODE) ---- */
  first_marble: Object.freeze({
    text: '彈珠一顆！每顆大滾球都是從小東西開始的',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_tea: Object.freeze({
    text: '茶葉蛋！用紹興酒滷的特別香，這是埔里的特產',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_bamboo: Object.freeze({
    text: '竹編籃！竹山的竹藝是南投最出名的傳統工藝',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_teabush: Object.freeze({
    text: '茶樹！凍頂烏龍就是從這些茶樹採下來的',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_scooter: Object.freeze({
    text: '機車來了！山路彎彎也要騎，這很南投',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_bus: Object.freeze({
    text: '公車吞進去了！往清境的路上都是這種山路公車',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_building: Object.freeze({
    text: '整棟民宿！清境的歐式小屋現在是你的了',
    priority: 1, expression: 'happy', once: true, phase: PLAY,
  }),
  first_tower: Object.freeze({
    text: '纜車塔！日月潭的天際線現在是你的了',
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
    text: '快到湖邊了，轉個彎繞回陸地',
    priority: 1, expression: 'thinking', once: false, phase: PLAY,
  }),

  /* ---- landmark trivia (index via LANDMARK_LINE_IDS[landmarkId]) ---- */
  lm_wenwu: Object.freeze({
    text: '文武廟！供奉關公和孔子的湖畔大廟，從這裡看日月潭超美',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_xuanguang: Object.freeze({
    text: '玄光寺！玄奘法師的舍利子曾經放在這裡，旁邊還有阿嬤茶葉蛋',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_formosan: Object.freeze({
    text: '九族文化村！原住民文化加上櫻花季，是南投最大的主題樂園',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_qingjing: Object.freeze({
    text: '清境小瑞士！歐式花園配上羊群，海拔一千七，夏天也涼爽',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_paper_dome: Object.freeze({
    text: '紙教堂！921地震後從日本遷來的，用紙管蓋成的教堂超神奇',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_jiji: Object.freeze({
    text: '集集車站！檜木造的百年老站，921重建後還是一樣美',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_ropeway: Object.freeze({
    text: '日月潭纜車站！從九族到伊達邵，一趟七分鐘看盡整個潭',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_puli_winery: Object.freeze({
    text: '埔里酒廠！紹興酒的故鄉，酒香冰棒是來這裡必吃的',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_cien_pagoda: Object.freeze({
    text: '慈恩塔！蔣介石為母親蓋的塔，塔頂剛好是海拔一千公尺',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),

  /* ---- goal call ---- */
  goal_call: Object.freeze({
    text: '慈恩塔在呼喚你，月牙幫你加油！',
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
    text: '鳳梨酥！台灣伴手禮第一名，帶回去送人絕對不會錯',
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
  col_bamboo_basket: Object.freeze({
    text: '竹編籃！竹山的傳統工藝，每個籃子都是師傅手工編的',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_shaoxing: Object.freeze({
    text: '紹興酒瓶！埔里酒廠的招牌，用埔里好水釀的紹興特別香',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_ropeway_gondola: Object.freeze({
    text: '日月潭纜車！紅色車廂從山頭滑過去，風景超美的',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_sheep: Object.freeze({
    text: '清境綿羊！毛茸茸的羊咩咩，清境農場最受歡迎的明星',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_mazu: Object.freeze({
    text: '媽祖！台灣最多信眾的神明，繞境一走就是好幾天',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),

  /* ---- finale / result ---- */
  goal_contact: Object.freeze({
    text: '滾完慈恩塔！月牙陪你登頂！',
    priority: 3, expression: 'speaking', once: true, phase: 'cinematic',
  }),
  ascension: Object.freeze({
    text: '哇…從塔頂看日月潭，湖光山色漂亮得像幅畫',
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
 * 7-tier Nantou table.
 * @type {ReadonlyArray<string>}
 */
export const TIER_UP_LINE_IDS = Object.freeze([
  '', 'tier1', 'tier2', 'tier3', 'tier4', 'tier5', 'tier6',
]);

/**
 * LandmarkEvent.landmarkId (0..8, strictly increasing dioramaR order per
 * cityMap.LANDMARKS) -> line id.
 * Nantou has no DUAL-tagged landmark: all 9 slots have bespoke lines.
 * @type {ReadonlyArray<string>}
 */
export const LANDMARK_LINE_IDS = Object.freeze([
  'lm_wenwu',        // 0 文武廟
  'lm_xuanguang',    // 1 玄光寺
  'lm_formosan',     // 2 九族文化村
  'lm_qingjing',     // 3 清境小瑞士
  'lm_paper_dome',   // 4 紙教堂
  'lm_jiji',         // 5 集集車站
  'lm_ropeway',      // 6 日月潭纜車站
  'lm_puli_winery',  // 7 埔里酒廠
  'lm_cien_pagoda',  // 8 慈恩塔 (goal — also fires on absorb if ever triggered)
]);

/**
 * CollectEvent.collectibleId (0..12, Nantou canonical album) -> line id.
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
  'col_bamboo_basket',    //  8 竹編籃 (nantou-specific)
  'col_shaoxing',         //  9 紹興酒瓶 (nantou-specific)
  'col_ropeway_gondola',  // 10 日月潭纜車 (nantou-specific)
  'col_sheep',            // 11 清境綿羊 (nantou-specific)
  'col_mazu',             // 12 媽祖
]);

/**
 * Nantou has no DUAL-tagged collectible/landmark pair.
 * DUAL_COLLECTIBLE_ID = -1 (sentinel: donack.js skips LANDMARK if
 * p.landmarkId === DUAL_LANDMARK_ID; -1 never matches a real id).
 */
export const DUAL_COLLECTIBLE_ID = -1;
export const DUAL_LANDMARK_ID = -1;

/**
 * First-absorb-per-category: ScoreEvent.archetypeCode -> line id.
 * Nantou codes: code = tier*10 + slot (same formula as the legacy engine).
 *   T0 (0-7): 竹山柑仔店桌頭 — marble triggers 'first_marble'
 *   T1 (10-19): 埔里小吃街 — tea_egg (code 11) triggers 'first_tea'
 *   T2 (20-29): 竹山老街騎樓 — bamboo_basket (21) triggers 'first_bamboo'
 *   T3 (30-39): 茶園梯田 — tea_bush (30) triggers 'first_teabush'
 *   T4 (40-49): 埔里街屋 — city_bus (44) first_bus; townhouse(40) first_building
 *   T5 (50-59): 清境農場 — resort_hotel (50) first_building
 *   T6 (60-69): 日月潭湖畔 — cable_car_tower (62) first_tower
 * @type {Readonly<Record<number, string>>}
 */
export const FIRST_LINE_BY_CODE = Object.freeze({
  // T0: small items trigger generic marble quip (codes 0-7)
  0: 'first_marble', 1: 'first_marble', 2: 'first_marble', 3: 'first_marble',
  4: 'first_marble', 5: 'first_marble', 6: 'first_marble', 7: 'first_marble',
  // T1: 埔里小吃街 — tea_egg (slot 1 = code 11) gets own line; others share marble category
  10: 'first_marble', 11: 'first_tea', 12: 'first_tea',
  13: 'first_marble', 14: 'first_marble', 15: 'first_marble',
  16: 'first_marble', 17: 'first_marble',
  // T2: 竹山老街 — bamboo items trigger 'first_bamboo'
  20: 'first_bamboo', 21: 'first_bamboo', 22: 'first_bamboo',
  23: 'first_bamboo', 24: 'first_bamboo', 25: 'first_bamboo',
  26: 'first_bamboo', 27: 'first_bamboo',
  // T3: 茶園梯田 — tea_bush (30) gets own line; rest share teabush category
  30: 'first_teabush', 31: 'first_teabush', 32: 'first_teabush',
  33: 'first_teabush', 34: 'first_teabush', 35: 'first_teabush',
  36: 'first_teabush', 37: 'first_teabush',
  // T4: 埔里街屋 — bus (44) gets own line; rest are 'first_building'
  40: 'first_building', 41: 'first_building', 42: 'first_building',
  43: 'first_building', 44: 'first_bus', 45: 'first_building',
  46: 'first_building', 47: 'first_building',
  // T5: 清境農場 — resort buildings
  50: 'first_building', 51: 'first_building', 52: 'first_tower',
  53: 'first_building', 54: 'first_building', 55: 'first_building',
  56: 'first_building', 57: 'first_building',
  // T6: 日月潭湖畔 — towers
  60: 'first_tower', 61: 'first_tower', 62: 'first_tower',
  63: 'first_tower', 64: 'first_tower', 65: 'first_tower',
  66: 'first_tower', 67: 'first_tower',
});
