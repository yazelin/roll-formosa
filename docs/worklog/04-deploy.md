# Phase 4 作業ログ: デプロイ（Cloudflare Pages パブリック公開）

**手法**: メインループ（インライン）で wrangler CLI を直接実行。マルチエージェント化する規模ではないため単独作業と判断。

## 手順と意思決定

1. **認証**: CLAUDE.md の規約どおり、`CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` を macOS Keychain からサービス名のみで取得し、シェルの環境変数としてその場で渡した（ファイルへの書き出し・平文保存は一切なし）。
2. **最終ビルド**: レビューフェーズの全修正を含む `npm run build` を実行 → `dist/` 585.73 kB（gzip 154.31 kB）。Three.js込みで約150KBに収まり、設計時のバンドル予算どおり。
3. **プロジェクト作成**: `npx wrangler pages project create fable-katamari --production-branch main`
   - Cloudflare Pages はデフォルトでパブリック公開（Cloudflare Access を設定しない＝誰でもアクセス可能）。ユーザー要件が「public公開」のため Access は意図的に設定しない。
4. **デプロイ**: `npx wrangler pages deploy dist --project-name fable-katamari --branch main`
   - `public/_headers` も同時にアップロードされ、ハッシュ付きアセット（/assets/*）に immutable キャッシュが効く。
5. **公開確認**:
   - `https://fable-katamari.pages.dev` → HTTP 200、`<title>Fable Katamari — 転がして、世界を呑み込め</title>` を確認
   - 検証エージェントが本番URLでブラウザ実機テスト（タイトル表示→開始→プレイ→HUD更新→コンソールエラー確認）を実施

## 結果

- **公開URL**: https://fable-katamari.pages.dev （パブリック、認証なし）
- 静的サイトのみ（サーバーレス）。今後の更新は `npm run build && npx wrangler pages deploy dist --project-name fable-katamari --branch main` で再デプロイ可能。

---

# Phase 8: v2デプロイ（月アップデート公開）

- レビュー修正込みの最終ビルド: 648.77 kB（gzip 173.07 kB）
- `npx wrangler pages deploy dist --project-name fable-katamari --branch main`（認証は前回同様Keychainからその場取得）
- 本番URL https://fable-katamari.pages.dev が新バンドル（index-B2j8m2P_.js）で200を確認
- 検証エージェントが本番URLでタイトル→プレイ→ダッシュ→月フィナーレ→リザルト→XシェアURLまで実機確認

## v2 累計実行統計（ultracode）

| フェーズ | エージェント数 | サブエージェントトークン | 所要時間 |
|---|---|---|---|
| 5. v2設計（旧スコープ+月スコープの2回） | 6 | 約86.4万 | 約61分 |
| 6. v2実装（契約+5並列+統合） | 7 | 約119.6万 | 約52分 |
| 7. v2レビュー（3次元→敵対的検証→修正→実測調整） | 24 | 約175.8万 | 約62分 |
| 8. v2デプロイ+本番検証 | 1 | - | 約5分 |
| **v2合計** | **38** | **約382万** | 約3時間 |
| **v1+v2総計** | **86** | **約759万** | 約5.5時間 |

---

# Phase 12: v3デプロイ（箱庭東京アップデート公開）

- レビュー修正+dev-start記録ガード込みの最終ビルド: 755.82 kB（gzip 205.42 kB）
- `npx wrangler pages deploy dist --project-name fable-katamari --branch main`（Keychain認証、平文保存なし）
- 本番URL https://fable-katamari.pages.dev が新バンドル（index-BS3zzv-3.js）で200、ドナックWebPアセット配信も確認
- 検証エージェントが本番URLでモバイル(390x844)プレイ＋デスクトップでスカイツリーフィナーレ＋XシェアURL＋記録ガードまで実機確認

## v3 累計実行統計（ultracode）

| フェーズ | エージェント数 | サブエージェントトークン | 所要時間 |
|---|---|---|---|
| 9. v3設計（設計→批評→改訂） | 3 | 約46.0万 | 約37分 |
| 10. v3実装（契約+5並列+統合） | 7 | 約204.2万 | 約125分 |
| 11. v3レビュー（初回+トークン上限後の再開） | 29 | 約356.3万 | 約235分 |
| 12. v3デプロイ+本番検証 | 1 | - | 約10分 |
| **v3合計** | **40** | **約607万** | 約6.8時間 |
| **v1+v2+v3総計** | **126** | **約1,366万** | 約12時間超 |

**特記事項**: v3レビューのフィクサー/バリデータがセッショントークン上限で一度停止（ユーザーへ報告済み）。
トークン回復後、Workflowの `resumeFromRunId` 機能でレビュー/敵対的検証フェーズのキャッシュを温存したまま
再開し、フィクサーとバリデータのみ再実行 — 中断コストを最小化した。

---

# Phase 16: v4デプロイ（リアル東京公開）

- 最終ビルド: 797.84 kB（gzip 219.17 kB、JSバジェット240以内）+ 東京データ約285KB gz（core+outer+manifest）
- `npm run osm:verify` ALL GREEN（予算/カウント/カバレッジ/ナビゲビリティ/ODbLフィールド）をデプロイ前に確認
- `npx wrangler pages deploy dist --project-name fable-katamari --branch main`
- 本番200確認: 新バンドル（index-DjgMrl9T.js）、tokyo-v4-manifest.json、tokyo-v4-core.bin 配信OK
- 検証エージェントが本番でOSMクレジット表示・東京データ取得・実ビル描画・吸収動作を確認

## v4 累計実行統計（ultracode）

| フェーズ | エージェント数 | サブエージェントトークン | 所要時間 |
|---|---|---|---|
| 14. v4設計（設計→批評→改訂、批評がOverpass実測） | 3 | 約39.8万 | 約38分 |
| 15. v4実装（契約+パイプライン+3並列+統合、中断3回を再開） | 延べ18枠/実行12 | 約312万 | 約4時間（中断除く実働） |
| 16. v4デプロイ+本番検証 | 1 | - | 約10分 |
| **v4合計** | **約16** | **約352万** | 約5時間 |
| **v1〜v4総計** | **約142** | **約1,718万** | 約17時間超 |
