# Review 01 — 01 申込一覧画面＋デモ操作エリア（`01-list-screen`）
判定: 合格（スコア 100/100、合格ライン 80 かつ【必須】全合格）

- 採点日: 2026-10-14（当日日付 `2026/10/14`）
- 対象: ブランチ `sprint/01-list-screen`、コミット `8f35c05`
- 環境: リポジトリのルートで `node mock/server.js`（Bash バックグラウンド起動）、Playwright MCP（Edge）で `http://localhost:8080/list.html` を操作
- 採点開始時: リセット前の件数は **全 20 件**（`dummy.json` は `initial.json` と同一）。契約どおり `#demo-reset-button` → `#demo-reset-confirm-button` で初期化してから開始
- 採点終了時: 画面からリセットし初期20件に戻した（`dummy.json` と `initial.json` が同一、`git status` で `mock/` に差分なし）。サーバー停止・ブラウザ終了済み

| # | 合格条件 | 結果 | 根拠(evidence) | 指摘 |
|---|----------|------|----------------|------|
| 1-1 | 【必須】標準モジュールのみでサーバー起動・一覧表示（10） | 合格 | `mock/` に `package.json`・`node_modules` なし。`server.js` の `require` は `http`/`fs`/`path` のみ。起動ログ「申込管理システム（デモ）: http://localhost:8080/list.html」、navigate 後に一覧表示。`review-01_1-1.png` | - |
| 1-2 | 【必須】初期20件を1ページ表示、ページ送りなし、「全 20 件」・`data-count="20"`（10） | 合格 | evaluate: `#application-tbody tr`=20、`dummy.json`=20件、`#application-count`=「全 20 件」・`data-count="20"`、ページ送り要素（次へ/前へ/ページ番号）0件。snapshot でも20行のみ。`review-01_1-2.png` | - |
| 1-3 | 列見出しの順序と行末の「詳細」ボタン（5） | 合格 | snapshot: 申込番号／申込日／お客さま名／供給地点特定番号／申込種別／変更前容量／変更後容量／ステータス／担当者／詳細 の順。全行の最終セルに button「詳細」。`review-01_1-2.png` | - |
| 1-4 | 【必須】`tbody#application-tbody`、行の `data-application-no`、セルの `data-field`、値が `dummy.json` と一致（10） | 合格 | evaluate: `tbody` の親が `#application-table`。全20行で `data-application-no` あり、9個の `data-field` が規定順に存在、各セルは子要素なし・`textContent` が `dummy.json` の値と完全一致（不一致0件） | - |
| 1-5 | 表示完了後 `data-loaded="true"`（5） | 合格 | evaluate: `#application-table[data-loaded]`=`"true"`（初期表示・追加後・リセット後・再起動後すべて） | - |
| 1-6 | 申込番号降順、再読み込み2回で順序・属性・値・id 不変（5） | 合格 | evaluate: 行順 DM-2026-0020→0001（降順）。`#application-table` の outerHTML（`data-loaded` 除く）を保存 → navigate 再読込 → F5 → `location.reload()`（navigation type=`reload`）後も完全一致 | - |
| 1-7 | 全行の詳細ボタンに `data-action="detail"`・`data-application-no`・`id="detail-button-<番号>"`（5） | 合格 | evaluate: 全20行で3属性とも該当行の申込番号と一致（不一致0件）。追加行 `DM-2026-0021` も同様 | - |
| 1-8 | 初期20件の14項目の型・形式、禁止文字なし、種別・ステータスが複数種類（5） | 合格 | `mock/data/initial.json`・`dummy.json` を Node スクリプトで全値検査し違反0件（番号一意・`DM-YYYY-NNNN`、日付は実在日、供給地点 `99`+20桁、選択値、工事予定日、`UK-NNNNNNNN`、カンマ/改行/ダブルクォートなし）。申込種別: 契約容量変更14・契約電力変更3・新設3、ステータス: 受付済4・審査中5・工事日調整中3・工事予定3・完了5 | - |
| 1-9 | 【必須】追加でメッセージ・先頭行・「全 21 件」・`data-count="21"`・`data-loaded="true"`（10） | 合格 | クリック後 evaluate: `#demo-message`=「DM-2026-0021 を追加しました」、先頭行 `DM-2026-0021`、「全 21 件」・`data-count="21"`、`data-loaded="true"`、行数21。`review-01_1-9.png` | - |
| 1-10 | 追加案件が最大+1・当日・受付済・未定・未採番（5） | 合格 | 一覧表示: `DM-2026-0021`（既存最大 0020 +1）、申込日 `2026/10/14`（採点当日）、ステータス「受付済」。`dummy.json` の追加レコード: `scheduledWorkDate`=「未定」、`receptionNo`=「未採番」 | - |
| 1-11 | 【必須】リセット確認表示 (a)、キャンセル (b)、実行 (c)（10） | 合格 | (a) 21件状態で押下 → `#demo-tools` 内に「初期データ（20件）に戻します。よろしいですか？」と実行する／キャンセルが表示、ブラウザダイアログは発生せず `review-01_1-11a.png`。(b) キャンセル → 確認表示非表示、「全 21 件」・21行・先頭 0021 のまま、サーバー側も21件 `review-01_1-11b.png`。(c) 再押下 → 実行 → 20行（初期データの番号と一致）、「全 20 件」・`data-count="20"`、メッセージ「初期データ（20件）に戻しました」、確認表示非表示 `review-01_1-11c.png` | - |
| 1-12 | サーバー再起動後も追加案件と件数が残る（5） | 合格 | 21件状態でサーバープロセスを停止（接続不可を確認）→ `node mock/server.js` 再起動 → navigate: 先頭 `DM-2026-0021`（サンプル 新太）、「全 21 件」・`data-count="21"`、21行。`review-01_1-12.png` | - |
| 1-13 | リセット後2件追加の内容が再現する（5） | 合格 | 1回目: 0021 サンプル 新太／9900000000000000002001／契約容量変更／30A→50A／デモ 花子、0022 デモ 若葉／9900000000000000002002／契約電力変更／8kW→12kW／サンプル 春子（`review-01_1-13a.png`）。リセット→2件追加の2回目と9項目すべて完全一致（`review-01_1-13b.png`） | - |
| 1-14 | 【必須】デモ操作要素が `section#demo-tools` 内・表の外・表より下、見出し・見た目分離、禁止属性なし、`data-demo-action`（5） | 合格 | evaluate: `#demo-tools` は SECTION、5要素すべて内包、表との包含関係なし、表の下端 < エリア上端。見出し「デモ操作（デモ用の機能です）」。border `2px dashed rgb(199,125,0)`、背景 `rgb(255,247,230)`（業務エリアは白）。内部の `data-field`/`data-application-no`/`data-action` は0件。ボタンは add / reset / reset-confirm / reset-cancel。`review-01_1-14.png` | - |
| 1-15 | 共通条件 C1〜C4（5） | 合格 | 下表 | - |

### 共通条件（1-15 の内訳）

| # | 条件 | 結果 | 根拠 |
|---|------|------|------|
| C1 | 【必須】架空データのみ、ヘッダー・タブタイトル | 合格 | 人名は「サンプル／デモ／見本／テスト ＋名」のみ、住所は「デモ県…」のみ、供給地点特定番号は全件 `99` 始まり（`initial.json`・`candidates.json`）。画像・ロゴなし（`document.images`=0）。ヘッダー「申込管理システム（デモ）」、タイトル「申込管理システム（デモ）- 申込一覧」 |
| C2 | 【必須】全操作を通してコンソールに JS エラーなし | 合格 | 表示・再読み込み3回・追加5回・リセット5回・キャンセル・サーバー再起動後表示の各段階で `browser_console_messages`（level: error, all: true）= Errors 0, Warnings 0 |
| C3 | 画面文言が日本語 | 合格 | snapshot: 見出し・列名・ボタン（詳細／新規案件を追加／初期データに戻す／実行する／キャンセル）・メッセージすべて日本語 |
| C4 | `mock/` に秘密情報なし | 合格 | Grep（URL・token・password・secret・webhook・teams・メールアドレス）: `http://localhost` のコメント・ログ出力のみ |

### スコア集計
- 合格: 1-1〜1-15 すべて（10+10+5+10+5+5+5+5+10+5+10+5+5+5+5 = 100）
- 【必須】1-1, 1-2, 1-4, 1-9, 1-11, 1-14, C1, C2: すべて合格

## Generator への指摘（不合格項目のみ、再現手順つき）
なし。

### 参考（採点対象外・次スプリント向けの気づき）
- `mock/index.html` のタイトルが「申し込み管理デモ」で、C1 の「申込管理システム（デモ）- <画面名>」形式になっていない。スプリント01の対象画面ではないため採点に含めていないが、スプリント02（ログイン画面、`/` でログイン画面を表示）で合わせて対応すること。
