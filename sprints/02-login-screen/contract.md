# スプリント契約 — 02 ログイン画面（`02-login-screen`）

> Evaluator が `docs/criteria.md`（スプリント02・共通条件）、`docs/screens.md`（1・1-1・2・S1・S2）、`CLAUDE.md`、前スプリントの `sprints/01-list-screen/contract.md`・`review-01.md`（申し送り）をもとに作成。
> 本契約は Evaluator と Generator の合意であり、スプリント中は変更しない。

---

## 0. 判定ルール

| 項目 | 内容 |
|------|------|
| 合格ライン | **80点以上 かつ【必須】条件（2-1, 2-2, 2-4, C1, C2）がすべて合格** |
| スコア | 各条件は全部満たして合格（部分点なし）。合格した条件の重みの合計（満点100） |
| 差し戻し上限 | **3回**（review-01〜03。3回で不合格なら停止して人に報告） |
| 未確認の扱い | 確認できなかった項目は「未確認」とし、不合格扱い |
| 判定の根拠 | Playwright MCP（Edge）の `browser_snapshot`・`browser_take_screenshot`・`browser_console_messages`・`browser_evaluate` の結果、および `mock/` 内ファイルの読み取り結果。推測では判定しない |
| 証跡 | `evidence/02-login-screen/review-XX_<条件番号>.png`（`browser_take_screenshot` の filename にリポジトリのルートからのパスで指定する） |

---

## 1. 採点時の前提

| 項目 | 内容 |
|------|------|
| ブランチ | `sprint/02-login-screen` |
| 起動コマンド | リポジトリのルートで `node mock/server.js`（ポート 8080 で `mock/` を配信）。Evaluator は Bash のバックグラウンド実行で起動・停止する |
| 確認 URL | ログイン `http://localhost:8080/login.html`、ルート `http://localhost:8080/`、一覧 `http://localhost:8080/list.html` |
| ブラウザ | Playwright MCP（`.mcp.json` の設定どおり `--browser msedge`） |
| 固定 ID/PW | demo-user / demo-pass（デモ用のダミー値） |
| 「未ログイン状態」の作り方 | `http://localhost:8080/login.html` を開き、`browser_evaluate` で `sessionStorage.clear()`・`localStorage.clear()`・`localhost` の cookie の全削除を実行する。各条件の確認前に必要に応じてこの手順を行う（Playwright MCP は既定で永続プロファイルを使うため、`browser_close` だけでは状態が消えない場合があることへの対策）。ログイン状態の保持方式（sessionStorage 等）は Generator に任せるが、`docs/screens.md` 1 のとおり **タブ単位** で保持されること |
| 「ログイン画面に移る」の判定 | 最終的な `location.pathname` が `/login.html` で、`<body data-page="login">`・`#login-id`・`#login-password`・`#login-button` が表示されていること（`/` を開いた場合のみ、パスが `/` のままでもログイン画面の内容が表示されていれば可。2-8 参照） |
| 遷移待ち | 画面遷移後は `browser_wait_for`（またはスナップショットの再取得）で遷移先の表示を確認してから判定する。「自動遷移しない」の確認（2-6）は遷移後 3 秒待ってから判定する |
| 採点開始時のデータ | ログイン後、`#demo-reset-button` → `#demo-reset-confirm-button` で初期20件に戻してから始める（リセット前の件数も記録する） |
| データの書き換え | 回帰確認のデモ操作（追加・リセット）で `mock/data/dummy.json` がサーバー経由で書き換わるのは仕様どおりの動作であり、Evaluator による `mock/` の編集には当たらない。採点の最後に画面からリセットし初期20件に戻す |
| 後片付け | 採点の最後に `evidence/` 直下に自動保存された `page-*.yml`・`console-*.log` を削除し、リポジトリのルート直下に `.png` が残っていないことを確認する。サーバー停止・`browser_close` |

---

## 2. 合格条件

| # | 合格条件（観察で判定できる文） | 確認方法 | 重み |
|---|-------------------------------|----------|------|
| 2-1 | 【必須】`http://localhost:8080/login.html` を開くとログイン画面が表示され、ラベル付きの `<input id="login-id">`（テキスト入力）、`<input id="login-password" type="password">`、`<button id="login-button">`（表示文言「ログイン」）がある。`#login-error` は存在するが初期表示では見えない（非表示または空）。これらの `id` は再読み込みしても変わらない | `browser_navigate` → snapshot・`browser_evaluate`（各要素の存在・`type`・表示状態）→ 再読み込みして再取得・比較。スクリーンショット | 15 |
| 2-2 | 【必須】未ログイン状態で `#login-id` に `demo-user`、`#login-password` に `demo-pass` を入力して `#login-button` をクリックすると、同じタブで `/list.html` に遷移し、`<body data-page="list">` の一覧画面が表示され、`#application-table` に `data-loaded="true"` が付き、`#application-count` が「全 20 件」（採点開始時のリセット後）になる | `browser_type` ×2 → `browser_click` → `browser_wait_for` → snapshot・`browser_evaluate`（`location.pathname`・`data-page`・`data-loaded`・件数）。スクリーンショット | 20 |
| 2-3 | 次の4パターンでそれぞれ `#login-button` を押すと、`#login-error` にエラー文言（例「IDまたはパスワードが正しくありません」。日本語で空でないこと）が表示され、`location.pathname` が `/login.html` のまま（一覧に遷移しない）：(a) ID 誤り（`wrong-user` / `demo-pass`）、(b) パスワード誤り（`demo-user` / `wrong-pass`）、(c) 両方未入力、(d) ID のみ入力（`demo-user` / 未入力）。さらに (e) エラー表示後に正しい ID/PW を入力して押すと `/list.html` に遷移する | 各パターンの前にページを開き直して入力 → クリック → snapshot・`browser_evaluate`（`#login-error` のテキスト・表示状態、`location.pathname`）。(a)〜(d) 後に `/list.html` を開いてもログイン画面に移る（ログイン扱いになっていない）ことも確認。スクリーンショット | 15 |
| 2-4 | 【必須】(a) 未ログイン状態で `http://localhost:8080/list.html` をアドレス直接入力（`browser_navigate`）で開くと、ログイン画面に移る（一覧表・件数・デモ操作エリアが操作可能な状態で残らない）。(b) ログイン済みのタブとは別に `browser_tabs`（new）で新しいタブを開き、`/list.html` を開いてもログイン画面に移る（ログイン状態がタブ単位であること） | 未ログイン状態を作る → `browser_navigate` → `browser_wait_for` → snapshot・`browser_evaluate`（`location.pathname`・`data-page`）。(b) は元のタブでログイン後に新しいタブで確認し、確認後に新しいタブを閉じる。スクリーンショット | 15 |
| 2-5 | ログイン後の一覧画面のヘッダーに `#current-user`（テキスト「demo-user でログイン中」）と `#logout-button`（表示文言「ログアウト」）がある。`#logout-button` をクリックするとログイン画面に移り、その後 `/list.html` を直接開くとログイン画面に移る | ログイン → snapshot・`browser_evaluate` → `browser_click`（`#logout-button`）→ snapshot → `browser_navigate`（`/list.html`）→ snapshot・`browser_evaluate`。スクリーンショット | 10 |
| 2-6 | ログイン済みの状態で `/login.html` を開くと、ログインフォーム（`#login-id`・`#login-password`・`#login-button`）が表示され、3秒待っても `/login.html` のまま（一覧へ自動遷移しない）。そこから再度 demo-user / demo-pass でログインすると `/list.html` に遷移する | ログイン → `browser_navigate`（`/login.html`）→ `browser_wait_for`（3秒）→ `browser_evaluate`（`location.pathname`）・snapshot → 再ログイン。スクリーンショット | 10 |
| 2-7 | ログイン画面に `<body data-page="login">` があり、ヘッダーに「申込管理システム（デモ）」と表示され、ブラウザタブのタイトルが「申込管理システム（デモ）- ログイン」である | `browser_evaluate`（`document.body.dataset.page`・`document.title`）・snapshot | 5 |
| 2-8 | `http://localhost:8080/` を開くとログイン画面が表示される（`/login.html` へのリダイレクト、または同じ内容の表示のどちらでも可）。表示された画面は 2-1・2-7 と同じ要素・属性・タイトル（「申込管理システム（デモ）- ログイン」）を持ち、そこから demo-user / demo-pass でログインすると `/list.html` に遷移する。review-01 の申し送りどおり、`/` で表示されるページのタイトルが「申し込み管理デモ」など規則外のものになっていない | `browser_navigate`（`/`）→ snapshot・`browser_evaluate`（`location.pathname`・`data-page`・`document.title`・各 `id` の存在）→ ログイン操作。スクリーンショット | 5 |
| 2-9 | 共通条件 C1〜C4 と、スプリント01 機能の回帰確認 R1・R2 をすべて満たす（下表。C1・C2 は【必須】） | 下表のとおり | 5 |

### 共通条件・回帰確認（2-9 の内訳）

| # | 条件 | 確認方法 |
|---|------|----------|
| C1 | 【必須】ログイン画面・一覧画面・`mock/` 内のファイルに実在の社名・人名・番号・システム名・ロゴが無い（架空データのみ）。ログイン画面・一覧画面ともヘッダーに「申込管理システム（デモ）」と表示され、タブのタイトルが「申込管理システム（デモ）- <画面名>」（ログイン画面は「ログイン」、一覧画面は「申込一覧」）。`/` で表示されるページも同じ規則に従う | snapshot・`browser_evaluate`（`document.title`・`document.images`）、`mock/` 内ファイルの読み取り |
| C2 | 【必須】採点中のすべての操作（ログイン画面表示・`/` 表示・ログイン成功／失敗・未ログインでの一覧アクセス・ログアウト・新しいタブ・回帰確認のデモ操作）を通して、ブラウザのコンソールに JS エラーが出ない | 各操作後に `browser_console_messages`（level: error） |
| C3 | ログイン画面の文言（見出し・ラベル・ボタン・エラーメッセージ）と一覧画面ヘッダーの追加文言（ログイン中表示・ログアウト）が日本語 | snapshot |
| C4 | `mock/` 内のファイルに秘密情報（実 URL・アカウント・チャット ID・トークン等）が無い。ID/PW はダミー値 demo-user / demo-pass のみ | `mock/` 内ファイルを検索（Grep） |
| R1 | （回帰）ログイン後の一覧画面で、初期状態の行数が20、`#application-count` が「全 20 件」・`data-count="20"`、`#application-table` に `data-loaded="true"`、全行に `data-application-no` と9個の `data-field`、各行の「詳細」ボタンに `data-action="detail"` がある（スプリント01 の 1-2・1-4・1-5・1-7 の要点） | ログイン後に `browser_evaluate` で行数・属性を取得 |
| R2 | （回帰）ログイン後の一覧画面で `#demo-add-button` を1回押すと「全 21 件」・先頭行が追加案件・`#demo-message` に追加した申込番号が表示され、`#demo-reset-button` → `#demo-reset-confirm-button` で「全 20 件」に戻る。どちらの操作の後もログイン画面に飛ばされず、一覧画面のまま | `browser_click` → snapshot・`browser_evaluate`。スクリーンショット |

- C1・C2 は【必須】のため、どちらかが不合格の場合はスコアに関係なく不合格とする（2-9 の5点も失う）。
- R1・R2 は【必須】ではないが、満たさない場合は 2-9 の5点を失う。

| 重みの合計 | 100 |
|-----------|-----|

### 証跡ファイル（予定）

| 条件 | ファイル名（`XX` はレビュー回数） |
|------|-----------------------------------|
| 2-1 | `evidence/02-login-screen/review-XX_2-1.png` |
| 2-2 | `evidence/02-login-screen/review-XX_2-2.png` |
| 2-3 | `evidence/02-login-screen/review-XX_2-3a.png` 〜 `review-XX_2-3e.png` |
| 2-4 | `evidence/02-login-screen/review-XX_2-4a.png`、`review-XX_2-4b.png` |
| 2-5 | `evidence/02-login-screen/review-XX_2-5a.png`（ログイン中表示）、`review-XX_2-5b.png`（ログアウト後） |
| 2-6 | `evidence/02-login-screen/review-XX_2-6.png` |
| 2-7 | `evidence/02-login-screen/review-XX_2-7.png`（2-1 と兼ねてもよい） |
| 2-8 | `evidence/02-login-screen/review-XX_2-8.png` |
| 2-9 | `evidence/02-login-screen/review-XX_2-9_R2a.png`（追加後）、`review-XX_2-9_R2b.png`（リセット後） |

---

## 3. 本スプリントの対象外（後続スプリントで確認）

- 「詳細」ボタンの遷移先、詳細画面、詳細画面の未ログインガード・ログアウト（スプリント03）
- Enter キーでのログイン（任意。採点しない）
- スプリント01 の条件のうち、本契約の R1・R2 に含めないもの（列順・並び順の再読み込み比較・サーバー再起動後の保持・追加候補の再現性・デモ操作エリアの配置など）は再採点しない
- データ取得失敗時の `#list-error` 表示（criteria の対象外。採点しない）
- PAD フローの実行確認（Evaluator の範囲外。人のレビュー②）
