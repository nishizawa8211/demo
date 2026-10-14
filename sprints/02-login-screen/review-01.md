# Review 01 — 02 ログイン画面（`02-login-screen`）
判定: 合格（スコア 100/100、合格ライン 80 かつ【必須】全合格）

- 採点日: 2026-10-14
- 対象: ブランチ `sprint/02-login-screen`、コミット `7722697`
- 環境: リポジトリのルートで `node mock/server.js`（Bash バックグラウンド起動）、Playwright MCP（Edge）で `http://localhost:8080/` を操作
- 未ログイン状態の作成: `/login.html` で `sessionStorage.clear()`・`localStorage.clear()`・cookie 全削除を実行（実行後 sessionStorage=0、localStorage=0、cookie 空）
- 採点開始時: リセット前の件数は **全 20 件**。ログイン後に `#demo-reset-button` → `#demo-reset-confirm-button` で初期化（「初期データ（20件）に戻しました」・全 20 件）してから 2-2 以降を確認
- 採点終了時: 画面からリセットし初期20件に戻した（`dummy.json` 20件・`initial.json` と同一、`git status` で `mock/` に差分なし）。サーバー停止（`/` への接続不可を確認）・`browser_close` 済み。`evidence/` 直下の `page-*.yml`・`console-*.log` を削除し、ルート直下に `.png` がないことを確認
- 備考: `review-01_2-5a.png` は最初の撮影がスクロール位置の影響でヘッダーを含まなかったため、採点の最後（ログイン中の一覧画面、最終リセット後）に先頭へスクロールして撮り直した。判定根拠の evaluate 結果は最初の確認時のもの

| # | 合格条件 | 結果 | 根拠(evidence) | 指摘 |
|---|----------|------|----------------|------|
| 2-1 | 【必須】ログイン画面の入力欄・ボタン・`#login-error`、`id` が再読み込みで不変（15） | 合格 | evaluate: `#login-id`=INPUT type=text（label「ログインID」）、`#login-password`=INPUT type=password（label「パスワード」）、`#login-button`=BUTTON「ログイン」、`#login-error` は存在・`hidden`・display none・空文字。`id` 一覧 `app-name,login-area,login-form,login-id,login-password,login-error,login-button` が navigate 再読込・F5・`location.reload()`（navigation type=`reload`）後も同一。`review-01_2-1.png` | - |
| 2-2 | 【必須】未ログインから demo-user / demo-pass でログインし、同じタブで一覧・`data-loaded`・「全 20 件」（20） | 合格 | 未ログイン状態作成 → 入力 → クリック → `/list.html`、`data-page="list"`、`data-loaded="true"`、「全 20 件」・`data-count="20"`、20行。`browser_tabs` list でタブは1つのみ（同じタブ）。`review-01_2-2.png` | - |
| 2-3 | 誤り4パターンでエラー表示・遷移なし、(e) エラー後の正しい入力で遷移（15） | 合格 | 各パターンはページを開き直して実施。(a) `wrong-user`/`demo-pass`、(b) `demo-user`/`wrong-pass`、(c) 両方未入力、(d) `demo-user`/未入力 のすべてで `#login-error`=「IDまたはパスワードが正しくありません」（hidden=false、display block）、`location.pathname`=`/login.html`、sessionStorage=0。各パターン直後に `/list.html` を開くと `/login.html`（`data-page="login"`）に移る（ログイン扱いになっていない）。(e) `wrong-user` でエラー表示後、demo-user / demo-pass でクリック → `/list.html`、全 20 件。`review-01_2-3a.png`〜`review-01_2-3e.png` | - |
| 2-4 | 【必須】未ログインで `/list.html` 直接 → ログイン画面、別タブでもログイン画面（15） | 合格 | (a) 未ログインで navigate → 最終 URL `/login.html`、`data-page="login"`、`#application-table`・`#application-count`・`#demo-tools` は存在しない。`review-01_2-4a.png`。(b) 元タブでログイン済み（一覧表示中）の状態で `browser_tabs` new → `/list.html` → `/login.html`（`data-page="login"`、sessionStorage=0、一覧・デモ操作エリアなし）。確認後に新タブを閉じた。`review-01_2-4b.png` | - |
| 2-5 | ヘッダーのログイン中表示・ログアウト、ログアウト後のガード（10） | 合格 | evaluate: ヘッダー内に `#current-user`=「demo-user でログイン中」、`#logout-button`=BUTTON「ログアウト」。クリック → `/login.html`（`data-page="login"`、`#login-id`/`#login-password`/`#login-button` あり、sessionStorage=0）。続けて `/list.html` を navigate → `/login.html`、一覧表なし。`review-01_2-5a.png`、`review-01_2-5b.png` | - |
| 2-6 | ログイン済みで `/login.html` を開いても自動遷移しない、再ログインで一覧へ（10） | 合格 | ログイン済み（`DemoAuth.isLoggedIn()`=true）で `/login.html` を navigate → 3秒待機後も `/login.html`、3要素とも表示（offsetParent あり）。再度 demo-user / demo-pass → `/list.html`、`data-loaded="true"`、全 20 件。`review-01_2-6.png` | - |
| 2-7 | ログイン画面の `data-page`・ヘッダー・タイトル（5） | 合格 | evaluate: `data-page="login"`、ヘッダー「申込管理システム（デモ）」、`document.title`=「申込管理システム（デモ）- ログイン」。`review-01_2-1.png`（2-1 と兼用） | - |
| 2-8 | `/` でログイン画面、同じ要素・タイトル、そこからログイン（5） | 合格 | curl: `/` は 302 → `/login.html`。navigate `/` → `/login.html`、`data-page="login"`、タイトル「申込管理システム（デモ）- ログイン」、`id` 一覧が 2-1 と同一、password type、`#login-error` hidden。そこから demo-user / demo-pass → `/list.html`、全 20 件。`mock/index.html` もタイトル「申込管理システム（デモ）- ログイン」に修正済み（review-01 の申し送り対応済み）。`review-01_2-8.png` | - |
| 2-9 | 共通条件 C1〜C4・回帰 R1・R2（5） | 合格 | 下表 | - |

### 共通条件・回帰確認（2-9 の内訳）

| # | 条件 | 結果 | 根拠 |
|---|------|------|------|
| C1 | 【必須】架空データのみ、ヘッダー・タブタイトル | 合格 | ログイン画面・一覧画面・`/` とも `document.images`=0、ロゴなし（`mock/` の html/css に `<img`・`logo`・`svg`・`url(` なし）。ヘッダー「申込管理システム（デモ）」、タイトルはログイン「申込管理システム（デモ）- ログイン」、一覧「申込管理システム（デモ）- 申込一覧」、`/` も前者。新規ファイル（`login.html`・`app.js`・`login.js`・`index.html`）に実在の社名・人名・番号・システム名なし。データは sprint01 から変更なし（架空名のみ） |
| C2 | 【必須】全操作を通してコンソールに JS エラーなし | 合格 | ログイン画面表示・再読み込み・`/` 表示・ログイン成功／失敗(a)〜(e)・未ログインでの一覧アクセス・ログアウト・新しいタブ・追加・リセットの各段階で `browser_console_messages`（level: error）= Errors 0, Warnings 0。自動保存されたコンソールログ全件にも ERROR/WARNING なし（VERBOSE の autocomplete 推奨メッセージのみ） |
| C3 | 画面文言が日本語 | 合格 | snapshot: 見出し「ログイン」、ラベル「ログインID」「パスワード」、ボタン「ログイン」、エラー「IDまたはパスワードが正しくありません」、一覧ヘッダー「demo-user でログイン中」「ログアウト」 |
| C4 | `mock/` に秘密情報なし、ID/PW はダミーのみ | 合格 | Grep（URL・token・secret・webhook・teams・メールアドレス・password）: `http://localhost` のコメント・ログ出力、`app.js` の `demo-user`／`demo-pass`（デモ用ダミー値）と入力欄の id のみ |
| R1 | （回帰）一覧の行数・件数・属性 | 合格 | ログイン後 evaluate: 20行、「全 20 件」・`data-count="20"`、`data-loaded="true"`、全行に `data-application-no`・9個の `data-field`・`data-action="detail"` ボタン（欠落0行） |
| R2 | （回帰）追加・リセットで一覧のまま | 合格 | 追加 → 「全 21 件」・21行・先頭 `DM-2026-0021`・`#demo-message`=「DM-2026-0021 を追加しました」、`/list.html` のまま（`review-01_2-9_R2a.png`）。リセット → 実行 → 「全 20 件」・20行・先頭 `DM-2026-0020`・「初期データ（20件）に戻しました」、`/list.html` のまま（`review-01_2-9_R2b.png`） |

### スコア集計
- 合格: 2-1〜2-9 すべて（15+20+15+15+10+10+5+5+5 = 100）
- 【必須】2-1, 2-2, 2-4, C1, C2: すべて合格

## Generator への指摘（不合格項目のみ、再現手順つき）
なし。

### 参考（採点対象外・次スプリント向けの気づき）
- ログイン画面表示のたびに Edge のコンソールに VERBOSE「Input elements should have autocomplete attributes (suggested: "current-password")」が出る。エラー・警告ではないため C2 には影響しない。気になる場合は `#login-password` に `autocomplete="current-password"`（または `off`）を付ければ消える（任意）。
- スプリント03 では詳細画面にも `<html data-auth="required">` を付け、未ログインガード・ログアウトが一覧と同様に働くことを確認する予定。
