/**
 * @file donackLines.js — Donack コメントテーブル (v3, FROZEN — docs/DESIGN-V3.md
 * §ドナック実況). The full authored Japanese copy: 45 lines (the design's
 * "~42 lines" + the Phase-3 col_golden_objet and v5 col_stackchan appends;
 * the v5 polish also retexts 'start' and 'ascension' in place — ids
 * unchanged, append-only contract intact), each keyed by a FROZEN string id.
 * ui/donack.js consumes this
 * table verbatim; per-id dedupe / once-per-run semantics hang off these ids,
 * so ids are append-only — never reuse, rename or reorder.
 *
 * Line shape (frozen contract):
 *   { text:string, priority:0|1|2|3, expression:'idle'|'happy'|'thinking'|'speaking',
 *     once:boolean, phase:'title'|'play'|'cinematic'|'result' }
 *
 *  - priority: P3 landmark+finale (always shows, interrupts the current
 *    bubble), P2 collectible/tier-up, P1 first-absorb-per-category /
 *    combo>=15 / knock-off / edge, P0 idle-stuck tips.
 *  - once:true  = once per RUN (reset on GAME_START/GAME_RESET).
 *    once:false = repeatable tip — per-id DONACK_TIP_COOLDOWN_S (30 s).
 *  - expression map (binding): landmark trivia/finale -> speaking,
 *    collectible/tier-up/combo -> happy, tips/idle/edge -> thinking,
 *    default -> idle.
 *  - phase gating (binding, MINOR 17): P0/P1/P2 lines emit only in 'play';
 *    'ascension' is the ONLY 'cinematic'-tagged emitter besides the
 *    GOAL_CONTACT shout (shown the same frame the phase flips); 'result'
 *    is the only 'result' emitter.
 *  - DUAL-TAG (MINOR 13): ハチ公像 carries collectibleId 10 AND landmarkId 0;
 *    only the single merged line fires ('dual_hachiko' — the design table's
 *    line #42). donack.js maps COLLECT id 10 -> 'dual_hachiko' and SKIPS
 *    LANDMARK id 0.
 *
 * Persona: bright, observant dev-partner duck; 1-2 sentences; no forced tics.
 *
 * Static data only — zero runtime allocation beyond module init.
 */

/** @typedef {{text:string, priority:number, expression:string, once:boolean, phase:string}} DonackLine */

/* Local shorthands (module init only). */
const PLAY = 'play';

/**
 * The frozen line table: id -> line. 45 entries.
 * @type {Readonly<Record<string, Readonly<DonackLine>>>}
 */
export const DONACK_LINES = Object.freeze({
  /* ---- run start (v5: センゴク電子 rename + onboarding arrow callout) ---- */
  start: Object.freeze({
    text: 'センゴク電子パーツからスタート！光る矢印の先にパーツがあるよ',
    priority: 2, expression: 'idle', once: true, phase: PLAY,
  }),

  /* ---- tier-ups (index via TIER_UP_LINE_IDS[tierIndex]) ---- */
  tier1: Object.freeze({
    text: '棚エリア卒業！つぎはお店の床を片づけよ',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier2: Object.freeze({
    text: 'お店の外へ！電気街が待ってるよ',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier3: Object.freeze({
    text: '車もイケる大きさになった！下町へ転がろう',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier4: Object.freeze({
    text: 'ビルが食べごろに見えてきた…感覚バグってきたね',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier5: Object.freeze({
    text: 'もう東京の主役だよ。ランドマーク総ナメだ！',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  tier6: Object.freeze({
    text: 'ここまで来たら、あとは…あの塔だけ！',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),

  /* ---- first-absorb-per-category (index via FIRST_LINE_BY_CODE) ---- */
  first_neji: Object.freeze({
    text: 'ネジ1本からの東京制覇、はじまりはじまり〜',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_animal: Object.freeze({
    text: 'ネコさんごめんね！あとで返す…かも',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_person: Object.freeze({
    text: '人も巻き込むのがカタマリの様式美だよ',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_car: Object.freeze({
    text: '車いっちゃった！もう立派な災害だね',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  first_building: Object.freeze({
    text: 'ビル！？スケール感どうなってるの！最高！',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),

  /* ---- play reactions / tips ---- */
  combo15: Object.freeze({
    text: 'コンボすごい！その調子その調子！',
    priority: 1, expression: 'happy', once: true, phase: PLAY,
  }),
  knockoff: Object.freeze({
    text: 'あっ剥がれた！デカいのに突っ込むと落ちるよ',
    priority: 1, expression: 'idle', once: true, phase: PLAY,
  }),
  repeat_bonk: Object.freeze({
    text: '跳ね返されたら格上サイン。まわりから育てて再挑戦！',
    priority: 1, expression: 'thinking', once: true, phase: PLAY,
  }),
  tip_idle: Object.freeze({
    text: 'デカいのはまだ無理。小さいのからコツコツ行こ！',
    priority: 0, expression: 'thinking', once: false, phase: PLAY,
  }),
  tip_dash: Object.freeze({
    text: 'ダッシュ満タンだよ。広い道でドーンと使お！',
    priority: 0, expression: 'thinking', once: false, phase: PLAY,
  }),
  tip_edge: Object.freeze({
    text: 'そっちは海！Uターン推奨〜',
    priority: 1, expression: 'thinking', once: false, phase: PLAY,
  }),

  /* ---- landmark trivia (index via LANDMARK_LINE_IDS[landmarkId];
   *      landmarkId 0 = ハチ公像 -> the merged 'dual_hachiko' instead) ---- */
  lm_saigo: Object.freeze({
    text: '西郷さんが連れてる犬、名前は『ツン』っていうんだよ',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_kaminarimon: Object.freeze({
    text: '雷門の大提灯、重さ約700kgあるんだよ。いい重りだね',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_radiokaikan: Object.freeze({
    text: 'アキバのシンボル確保！ここはジャンクと電子部品の聖地なんだ',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_109: Object.freeze({
    text: '109は『トーキュー』って読むんだよ。まるごと回収！',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_scramble: Object.freeze({
    text: 'この交差点、1回の青信号で約3000人が渡るんだって',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_dome: Object.freeze({
    text: 'やった、これで何でも『東京ドーム1個分』で説明できるね',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_tokyo_station: Object.freeze({
    text: '赤レンガの丸の内駅舎は1914年完成。100年選手だよ',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_diet: Object.freeze({
    text: '議事堂は完成まで17年かかったんだ。巻き込むのは一瞬！',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_rainbow: Object.freeze({
    text: 'レインボーブリッジ、実は歩いて渡れるって知ってた？',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),
  lm_tower: Object.freeze({
    text: '333mの東京タワー！エッフェル塔より高いんだよ。…ついに巻いちゃったね',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),

  /* ---- goal call ---- */
  goal_call: Object.freeze({
    text: '634m…ムサシ！スカイツリーが呼んでる、行こう！',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),

  /* ---- collectibles (index via COLLECT_LINE_IDS[collectibleId];
   *      ids 3/9 and any future id 12+ fall back to 'col_generic') ---- */
  col_generic: Object.freeze({
    text: 'それコレクションだ！アルバムに記録したよ',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_manekineko: Object.freeze({
    text: '金の招き猫！商売繁盛まちがいなしだね',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_shinkukan: Object.freeze({
    text: '真空管だ！いまや超貴重品だよ、それ',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_retro_game: Object.freeze({
    text: 'レトロゲーム機！…まだ動くかな。動くといいな',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_gaming_pc: Object.freeze({
    text: '光るPCだ！アキバの戦利品って感じ',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_otoro: Object.freeze({
    text: '大トロ！転がす前にひと口…はダメだよね',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_daruma: Object.freeze({
    text: 'だるまゲット！願いごとは『全部巻き込む』で決まりだね',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_panda: Object.freeze({
    text: '上野といえばパンダ！ふわふわ確保〜',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_kaminari_okoshi: Object.freeze({
    text: '雷おこし！浅草みやげの定番だよ',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  col_yakatabune: Object.freeze({
    text: '屋形船ゲット！東京湾の夜景つき',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  // APPENDED (Phase-3 fix): ids 3 and 9 previously SHARED the once:true
  // 'col_generic' line, so whichever was collected second got no bubble at
  // all. Id 9 gets its own line (append-only contract — new id, no reuse).
  col_golden_objet: Object.freeze({
    text: 'なにこの金ピカのオブジェ！？よくわかんないけど確保！',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),
  // APPENDED (v5): collectible id 12 スタックチャン — the open-source
  // M5Stack robot, Donack's cousin (append-only contract — new id only).
  col_stackchan: Object.freeze({
    text: 'スタックチャンだ！ボクのいとこみたいなロボだよ',
    priority: 2, expression: 'happy', once: true, phase: PLAY,
  }),

  /* ---- DUAL ハチ公 (the design table's merged line "#42") ---- */
  dual_hachiko: Object.freeze({
    text: 'ハチ公ゲット！約10年ご主人を待った忠犬だよ。アルバムに記録！',
    priority: 3, expression: 'speaking', once: true, phase: PLAY,
  }),

  /* ---- finale / result ---- */
  goal_contact: Object.freeze({
    text: 'やった────！東京まるごと、いただき！',
    priority: 3, expression: 'speaking', once: true, phase: 'cinematic',
  }),
  // v5 space-earth ending: the ascension now lifts off into space over a
  // glowing procedural Earth (render/earthView.js) — the line follows.
  ascension: Object.freeze({
    text: 'うわぁ…地球が見えるよ…！東京の光、きれいだね',
    priority: 3, expression: 'speaking', once: true, phase: 'cinematic',
  }),
  result: Object.freeze({
    text: 'おつかれさま！記録、Xで自慢しちゃお',
    priority: 3, expression: 'speaking', once: true, phase: 'result',
  }),
});

/* ------------------------------------------------------------------ */
/* Frozen event -> line-id lookup tables (consumed by ui/donack.js)     */
/* ------------------------------------------------------------------ */

/**
 * TierUpEvent.tierIndex -> line id (index 0 unused — there is no tier-up
 * INTO tier 0). 7-tier v3 table.
 * @type {ReadonlyArray<string>}
 */
export const TIER_UP_LINE_IDS = Object.freeze([
  '', 'tier1', 'tier2', 'tier3', 'tier4', 'tier5', 'tier6',
]);

/**
 * LandmarkEvent.landmarkId (frozen 0..10, threshold-ladder order — Phase-0
 * appendix) -> line id. Index 0 (ハチ公像) is '' on purpose: the DUAL-TAG
 * rule routes it through COLLECT id 10 -> 'dual_hachiko' and the LANDMARK
 * emission is skipped by donack.js.
 * @type {ReadonlyArray<string>}
 */
export const LANDMARK_LINE_IDS = Object.freeze([
  '',                 // 0 ハチ公像 — DUAL, handled via COLLECT (dual_hachiko)
  'lm_saigo',         // 1 西郷さん像
  'lm_kaminarimon',   // 2 雷門
  'lm_radiokaikan',   // 3 ラジオ会館風ビル
  'lm_109',           // 4 渋谷109
  'lm_scramble',      // 5 スクランブル交差点
  'lm_dome',          // 6 東京ドーム
  'lm_tokyo_station', // 7 東京駅丸の内駅舎
  'lm_diet',          // 8 国会議事堂
  'lm_rainbow',       // 9 レインボーブリッジ
  'lm_tower',         // 10 東京タワー
]);

/**
 * CollectEvent.collectibleId (frozen 0..12, COLLECTIBLE_IDS) -> line id.
 * Id 3 (秋葉原フィギュア) uses the generic line; donack.js also falls back
 * to 'col_generic' for any future id >= 13 (append-only contract).
 * @type {ReadonlyArray<string>}
 */
export const COLLECT_LINE_IDS = Object.freeze([
  'col_manekineko',      // 0 金の招き猫
  'col_shinkukan',       // 1 真空管
  'col_retro_game',      // 2 レトロゲーム機
  'col_generic',         // 3 秋葉原フィギュア (no bespoke line)
  'col_gaming_pc',       // 4 ゲーミングPC
  'col_otoro',           // 5 特上大トロ
  'col_daruma',          // 6 だるま
  'col_panda',           // 7 パンダのぬいぐるみ
  'col_kaminari_okoshi', // 8 雷おこし
  'col_golden_objet',    // 9 金色のオブジェ (own line — was 'col_generic',
                         //   which is once:true and shared with id 3: the
                         //   second of the pair never got a bubble)
  'dual_hachiko',        // 10 ハチ公像 — DUAL (merged line "#42")
  'col_yakatabune',      // 11 屋形船
  'col_stackchan',       // 12 スタックチャン (v5 append)
]);

/** The DUAL-tagged collectible/landmark ids (ハチ公像). */
export const DUAL_COLLECTIBLE_ID = 10;
export const DUAL_LANDMARK_ID = 0;

/**
 * First-absorb-per-category: ScoreEvent.archetypeCode -> line id.
 * Codes follow the FROZEN 70-id chunk table (code = tier*10 + slot,
 * DESIGN-V3.md Phase-0 appendix):
 *   ネジ系  = 0 screw, 1 resistor, 2 capacitor (T0 parts bin)
 *   生き物  = 24 cat, 25 pigeon (T2)
 *   通行人  = 21 person (T2)
 *   車      = 30 car, 31 taxi, 32 bus, 33 truck (T3)
 *   ビル    = 40 zakkyo_building, 41 mansion (T4), 50 skyscraper,
 *             51 tower_mansion, 52 hotel, 53 department_store (T5)
 * @type {Readonly<Record<number, string>>}
 */
export const FIRST_LINE_BY_CODE = Object.freeze({
  0: 'first_neji', 1: 'first_neji', 2: 'first_neji',
  24: 'first_animal', 25: 'first_animal',
  21: 'first_person',
  30: 'first_car', 31: 'first_car', 32: 'first_car', 33: 'first_car',
  40: 'first_building', 41: 'first_building',
  50: 'first_building', 51: 'first_building',
  52: 'first_building', 53: 'first_building',
});
