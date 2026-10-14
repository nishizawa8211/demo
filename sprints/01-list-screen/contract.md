# スプリント契約 — 01 申込一覧画面＋デモ操作エリア（`01-list-screen`）

> Evaluator が `docs/criteria.md`（スプリント01・共通条件）、`docs/screens.md`（0・1・2・S2）、`CLAUDE.md` をもとに作成。
> 本契約は Evaluator と Generator の合意であり、スプリント中は変更しない。

---

## 0. 判定ルール

| 項目 | 内容 |
|------|------|
| 合格ライン | **80点以上 かつ【必須】条件（1-1, 1-2, 1-4, 1-9, 1-11, 1-14, C1, C2）がすべて合格** |
| スコア | 各条件は全部満たして合格（部分点なし）。合格した条件の重みの合計（満点100） |
| 差し戻し上限 | **3回**（review-01〜03。3回で不合格なら停止して人に報告） |
| 未確認の扱い | 確認できなかった項目は「未確認」とし、不合格扱い |
| 判定の根拠 | Playwright MCP（Edge）の `browser_snapshot`・`browser_take_screenshot`・`browser_console_messages`・`browser_evaluate` の結果、および `mock/` 内ファイルの読み取り結果。推測では判定しない |
| 証跡 | `evidence/01-list-screen/review-XX_<条件番号>.png` |

---

## 1. 採点時の前提

| 項目 | 内容 |
|------|------|
| ブランチ | `sprint/01-list-screen` |
| サーバー配置 | `mock/server.js`（Generator の担当フォルダ内）。Node 標準モジュールのみ使用し、`package.json` や `npm install` を必要としない |
| 起動コマンド | リポジトリのルートで `node mock/server.js`（ポート 8080 で `mock/` を配信）。Evaluator は Bash のバックグラウンド実行で起動・停止する |
| 確認 URL | `http://localhost:8080/list.html` |
| ブラウザ | Playwright MCP（`.mcp.json` の設定どおり `--browser msedge`） |
| ログイン | スプリント01ではログイン画面・未ログインガードは未実装のため、**一覧画面に直接アクセスして採点してよい**。ガードはスプリント02で追加・確認する |
| 詳細画面 | スプリント03で作るため、「詳細」ボタンの遷移先は本スプリントでは確認しない（属性のみ確認） |
| 採点開始時のデータ | 採点開始時に `#demo-reset-button` → `#demo-reset-confirm-button` で初期20件に戻してから始める（1-2 で確認する件数は初期状態の値）。ただし 1-11 の確認を兼ねるため、リセット前に件数が20件でない場合はその件数も記録する |
| データの書き換え | 採点中のデモ操作（追加・リセット）により `mock/data/dummy.json` がサーバー経由で書き換わる。これは仕様どおりの動作であり、Evaluator による `mock/` の編集には当たらない。採点の最後に画面からリセットし初期20件に戻す |
| 当日日付 | 1-10 の「当日」は採点を実行した日の日付（`YYYY/MM/DD`） |

---

## 2. 合格条件

| # | 合格条件（観察で判定できる文） | 確認方法 | 重み |
|---|-------------------------------|----------|------|
| 1-1 | 【必須】`node mock/server.js` で外部パッケージのインストールなしにサーバーが起動し、Edge で `http://localhost:8080/list.html` が開け、一覧画面が表示される | `mock/` に `package.json`・`node_modules` 依存が無いこと、`server.js` の `require` が Node 標準モジュールのみであることを読み取り確認。起動後 `browser_navigate` → snapshot・スクリーンショット | 10 |
| 1-2 | 【必須】初期状態で `dummy.json` の全件（20件）が1ページで表示され、ページ送り（ページ番号・次へ等）が無い。`#application-count` のテキストが「全 20 件」で、`data-count="20"` を持つ | snapshot で行数・ページ送りの有無を確認。`browser_evaluate` で `#application-tbody tr` の件数、`#application-count` のテキストと `data-count` を取得し、`dummy.json` の件数と照合 | 10 |
| 1-3 | 一覧表の列見出しが左から「申込番号／申込日／お客さま名／供給地点特定番号／申込種別／変更前容量／変更後容量／ステータス／担当者」の順で、最後の列に「詳細」ボタンがある | snapshot で見出し行の順序と各行末のボタンを確認 | 5 |
| 1-4 | 【必須】`#application-table` 内に `<tbody id="application-tbody">` があり、全行の `<tr>` に `data-application-no="<申込番号>"` があり、各セルに `data-field`（`applicationNo`, `applicationDate`, `customerName`, `supplyPointNo`, `applicationType`, `capacityBefore`, `capacityAfter`, `status`, `assignee`）がある。各 `data-field` 要素のテキストが値のみ（ラベル等が混ざらない）で、`dummy.json` の該当値と一致する | `browser_evaluate` で全行・全セルの属性とテキストを取得し `dummy.json` と突き合わせ | 10 |
| 1-5 | 一覧の表示完了後に `#application-table` に `data-loaded="true"` が付いている | `browser_evaluate` で属性値を取得 | 5 |
| 1-6 | 行の並び順が申込番号の降順で、ページを再読み込み（2回）しても行の順序・`data-application-no`・各 `data-field` の値・`id` が変わらない | `browser_evaluate` で行の順序と属性を取得 → 再読み込み後に再取得して比較 | 5 |
| 1-7 | 全行に「詳細」ボタンがあり、`data-action="detail"`、`data-application-no="<その行の申込番号>"`、`id="detail-button-<申込番号>"` を持つ（遷移先はスプリント03で確認） | `browser_evaluate` で全ボタンの属性を取得 | 5 |
| 1-8 | `dummy.json` の初期20件の全14項目が `docs/screens.md` 1-2 の型・形式に沿う（申込番号 `DM-YYYY-NNNN` で一意、日付 `YYYY/MM/DD`、供給地点特定番号は `99` 始まりの数字22桁、申込種別・ステータスは定義された選択値、工事予定日は日付または「未定」、送配電受付番号は `UK-NNNNNNNN` または「未採番」）。どの値にもカンマ・改行・ダブルクォートを含まない。申込種別・ステータスが複数種類に分かれている | `mock/data/dummy.json`（または初期データの保持ファイル）を読み取り、全値を検査 | 5 |
| 1-9 | 【必須】初期20件の状態で `#demo-add-button` を1回押すと、`#demo-message` に追加した申込番号を含む「〜を追加しました」が表示され、一覧の先頭行がその申込番号になり、`#application-count` が「全 21 件」・`data-count="21"` になり、再表示後に `data-loaded="true"` が付く | `browser_click` → snapshot・`browser_evaluate`・スクリーンショット | 10 |
| 1-10 | 1-9 で追加された案件の申込番号が既存の最大番号+1、申込日が採点当日、ステータス「受付済」、工事予定日「未定」、送配電受付番号「未採番」である | 一覧の表示値と、`dummy.json`（またはサーバーが返すデータ）の追加レコードを確認 | 5 |
| 1-11 | 【必須】(a) `#demo-reset-button` を押すと `#demo-tools` 内に確認表示「初期データ（20件）に戻します。よろしいですか？」と `#demo-reset-confirm-button`・`#demo-reset-cancel-button` が表示される（ブラウザ標準ダイアログではない）。(b) `#demo-reset-cancel-button` を押すと確認表示が閉じ、一覧・件数は押す前と同じ。(c) 再度 `#demo-reset-button` → `#demo-reset-confirm-button` を押すと、一覧が初期20件・件数表示「全 20 件」（`data-count="20"`）に戻り、`#demo-message` に「初期データ（20件）に戻しました」が表示され、確認表示が閉じる | 追加済み（21件以上）の状態で (a)→(b)→(c) の順に操作し、各段階で snapshot・スクリーンショット | 10 |
| 1-12 | 1件追加した後にサーバーを停止・再起動し、一覧を再読み込みしても追加した案件が表示され、件数が追加後の値のままである | Bash でサーバー停止 → `node mock/server.js` で再起動 → `browser_navigate` → snapshot | 5 |
| 1-13 | 追加内容が決まった候補から順番に選ばれる：リセット後に2件追加した内容（お客さま名・供給地点特定番号・申込種別・変更前後容量・担当者）を記録し、再度リセットして2件追加すると、同じ申込番号・同じ内容になる | 追加 → 記録 → リセット → 追加 → 比較（`browser_evaluate` で行データを取得） | 5 |
| 1-14 | 【必須】デモ操作の要素（`#demo-add-button`・`#demo-reset-button`・`#demo-reset-confirm-button`・`#demo-reset-cancel-button`・`#demo-message`）がすべて `<section id="demo-tools">` 内にあり、`#demo-tools` は `#application-table` の外で、表より下（画面下部）に配置されている。見出し「デモ操作（デモ用の機能です）」があり、枠線または背景色で業務エリアと見た目が分かれている。`#demo-tools` 内のどの要素にも `data-field`・`data-application-no`・`data-action` が付いておらず、ボタンには `data-demo-action`（`add` / `reset` / `reset-confirm` / `reset-cancel`）が付いている | `browser_evaluate` で DOM の包含関係・位置（`getBoundingClientRect`）・属性・計算済みスタイル（border / background）を取得。スクリーンショットで見た目を確認 | 5 |
| 1-15 | 共通条件 C1〜C4 をすべて満たす（下表。C1・C2 は【必須】） | 下表のとおり | 5 |

### 共通条件（1-15 の内訳）

| # | 条件 | 確認方法 |
|---|------|----------|
| C1 | 【必須】画面・`dummy.json`・追加候補データに、実在の社名・人名・番号・システム名・ロゴが無い（架空データのみ。人名は「サンプル」「デモ」等の架空とわかる名前、供給地点特定番号は `99` 始まり、住所は架空の地名）。ヘッダーに「申込管理システム（デモ）」と表示され、タブのタイトルが「申込管理システム（デモ）- <画面名>」 | snapshot、`mock/` 内ファイルの読み取り |
| C2 | 【必須】採点中のすべての操作（表示・再読み込み・追加・リセット・キャンセル・サーバー再起動後の表示）を通して、ブラウザのコンソールに JS エラーが出ない | 各操作後に `browser_console_messages`（level: error） |
| C3 | 画面文言（見出し・列名・ボタン・メッセージ）が日本語 | snapshot |
| C4 | `mock/` 内のファイルに秘密情報（実 URL・アカウント・チャット ID・トークン等）が無い | `mock/` 内ファイルを検索（Grep） |

- C1・C2 は【必須】のため、どちらかが不合格の場合はスコアに関係なく不合格とする（1-15 の5点も失う）。

| 重みの合計 | 100 |
|-----------|-----|

---

## 3. 本スプリントの対象外（後続スプリントで確認）

- ログイン画面、未ログイン時のガード、`#logout-button`、`#current-user`（スプリント02）
- 「詳細」ボタンの遷移先、詳細画面（スプリント03）
- データ取得失敗時の `#list-error` 表示（criteria の対象外。採点しない）
- PAD フローの実行確認（Evaluator の範囲外。人のレビュー②）
