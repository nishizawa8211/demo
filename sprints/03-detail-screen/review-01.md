# Review 01 — 03 申込詳細画面（`03-detail-screen`）
判定: 合格（スコア 100/100、合格ライン 80 かつ【必須】全合格）

- 採点日: 2026-10-14
- 対象: ブランチ `sprint/03-detail-screen`、コミット `1747417`
- 環境: リポジトリのルートで `node mock/server.js`（Bash バックグラウンド起動）、Playwright MCP（Edge）で `http://localhost:8080/` を操作
- 未ログイン状態の作成: `/login.html` で `sessionStorage.clear()`・`localStorage.clear()`・cookie 全削除を実行（実行後 sessionStorage=0、localStorage=0、cookie 空）。採点開始時と 3-7(a) の前の2回実施
- 採点開始時: リセット前の件数は **全 20 件**。ログイン後に `#demo-reset-button` → `#demo-reset-confirm-button` で初期化（「初期データ（20件）に戻しました」・全 20 件）→ `#demo-add-button` 1回で 21件（先頭 `DM-2026-0021`、11行目 `DM-2026-0011`、末尾 `DM-2026-0001`）にしてから 3-1 以降を確認
- 正解データ: 各確認時点で詳細画面から `fetch('/api/applications')` を取得して突き合わせ
- 採点終了時: 画面からリセットし初期20件に戻した（`dummy.json` 20件・`initial.json` と同一、`git status` で `mock/` に差分なし）。`browser_close`、サーバー停止（`/login.html` への接続不可を確認）。`evidence/` 直下の `page-*.yml`・`console-*.log` を削除し、ルート直下に `.png` がないことを確認

| # | 合格条件 | 結果 | 根拠(evidence) | 指摘 |
|---|----------|------|----------------|------|
| 3-1 | 【必須】先頭・中間・末尾の詳細ボタンで同じタブに詳細画面（15） | 合格 | 一覧で `button[data-action="detail"][data-application-no="<番号>"]` をクリック。3行とも `location.pathname`=`/detail.html`、`location.search`=`?no=DM-2026-0021`／`?no=DM-2026-0011`／`?no=DM-2026-0001`、`data-page="detail"`、`#detail-title`=「申込詳細（<番号>）」、`#field-applicationNo`=その番号、`document.title`=「申込管理システム（デモ）- 申込詳細」。各遷移後の `browser_tabs` list はタブ1つのみ。3行はそれぞれ `#back-to-list-button` で一覧に戻ってから実施。`review-01_3-1a.png`・`3-1b.png`・`3-1c.png`（全画面） | - |
| 3-2 | 【必須】14項目がラベルと値の組で順番どおり、値が正解データと一致（20） | 合格 | 3案件とも `#application-detail` の子要素が `DT,DD` ×14 の交互、DT のテキストが「申込番号／申込日／お客さま名／供給地点特定番号／申込種別／変更前容量／変更後容量／ステータス／担当者／需要場所住所／希望日／工事予定日／送配電受付番号／備考」の順、DD の `data-field` も 1-2 の順。値と `/api/applications` の該当案件の突き合わせ: 不一致 0件（3案件とも）。値は `dd` のテキスト（画像・入力欄なし、`document.images`=0）。例 `DM-2026-0011`: `…|工事日調整中|サンプル 秋子|デモ県見本市架空台8-4-1|2026/10/17|未定|UK-00011243|`（備考空）。スクリーンショットは 3-1 と兼用 | - |
| 3-3 | 【必須】`field-*`・`data-field` の属性・包含・件数、再読み込みで不変（15） | 合格 | 3案件とも `[id^="field-"]`=14（重複0）、`[data-field]`=14（重複0）、全要素で `id`=`field-`+`data-field`、すべて `#application-detail` の内側、子要素数0、ラベル文字列の混入なし（不備0件）。`DM-2026-0021` で、クリック表示時・navigate 再読込（navigation type=`navigate`）・`location.reload()`（type=`reload`）の3時点の `id` 一覧（`app-name,current-user,logout-button,business-area,detail-title,detail-error,application-detail,field-applicationNo,…,field-remarks,back-to-list-button`）と `id:data-field` 一覧がすべて同一 | - |
| 3-4 | `data-loaded="true"` の時点で14値が表示済み、再読み込みでも同様（10） | 合格 | 3-1 の3遷移・3-8・3-10 の各遷移後に `#application-detail[data-loaded="true"]`、その時点で `#field-applicationNo` が `?no=` と一致し14値とも正解データと一致。navigate 再読込・`location.reload()` 後も `data-loaded="true"`・値同一。実装上も `render()` の後に `data-loaded` を付与（`mock/js/detail.js`） | - |
| 3-5 | `#back-to-list-button`「一覧へ戻る」で一覧へ、別の行を続けて開ける（10） | 合格 | 文言「一覧へ戻る」。クリック → `/list.html`、`data-page="list"`、`data-loaded="true"`、「全 21 件」・`data-count="21"`・21行（重複なし）、`#current-user`=「demo-user でログイン中」（ログイン画面に飛ばされない）。戻った一覧から中間・末尾の詳細を続けて開けた（3-1）。3-6 の各エラー画面からも一覧（全 21 件）に戻れた。`review-01_3-5.png` | - |
| 3-6 | 存在しない番号・番号なし・番号が空でエラー表示、値なし、`data-loaded` なし（5） | 合格 | (a) `?no=DM-2099-9999`、(b) `/detail.html`、(c) `?no=` の3つとも2秒待機後: `#detail-error`=「該当する申込が見つかりません」（hidden=false、display block）、`data-loaded` 属性なし、`#application-detail` は hidden、`#field-*` の値は空14/14・表示0、`#detail-title`=「申込詳細」。各画面から `#back-to-list-button` → `/list.html`・`data-loaded="true"`・全 21 件。正常表示時は `#detail-error` が hidden・空（3-1 の3案件で確認）。`review-01_3-6a.png`〜`3-6c.png` | - |
| 3-7 | 未ログイン直接・新しいタブ・ログアウト後にログイン画面へ（10） | 合格 | (a) 未ログイン状態作成 → `/detail.html?no=DM-2026-0001` を navigate → 最終 `/login.html`、`data-page="login"`、`#login-id`・`#login-password`・`#login-button` が表示、`#application-detail`・`#field-*` なし（0件）。`review-01_3-7a.png`。(b) 元タブでログイン済み（`DM-2026-0022` の詳細表示中）に `browser_tabs` new で同 URL → `/login.html`、`data-page="login"`、詳細要素なし、sessionStorage=0。確認後に新タブを閉じた。`review-01_3-7b.png`。(c) ヘッダー内に `#current-user`=「demo-user でログイン中」、`#logout-button`=BUTTON「ログアウト」。クリック → `/login.html`（sessionStorage=0）→ 詳細 URL を navigate → `/login.html`、詳細要素なし。`review-01_3-7c.png` | - |
| 3-8 | 追加案件 `DM-2026-0022` の未定・未採番・備考空欄（5） | 合格 | 一覧で追加 → 「全 22 件」・先頭 `DM-2026-0022`・「DM-2026-0022 を追加しました」→ 詳細ボタン → `data-loaded="true"`、`#field-scheduledWorkDate`=「未定」、`#field-receptionNo`=「未採番」、`#field-remarks` は存在しテキスト `""`（API の remarks も `""`）、14値の不一致0件。`DM-2026-0021` も「未定」「未採番」（3-1 で確認）。`review-01_3-8.png` | - |
| 3-9 | 共通条件 C1〜C4・回帰 R1〜R3（5） | 合格 | 下表 | - |
| 3-10 | ブラウザの「戻る」で一覧へ、崩れなし、続けて別の行の詳細（5） | 合格 | `browser_navigate_back` で2回実施。1回目: 末尾 `DM-2026-0001` の詳細（詳細ボタンで表示）→ 戻る → 2秒待機後 `/list.html`、`data-page="list"`、`data-loaded="true"`、「全 21 件」・`data-count="21"`・21行、申込番号の重複0・9セルの欠落／空0行、先頭 `DM-2026-0021`・末尾 `DM-2026-0001`、`#current-user`=「demo-user でログイン中」、navigation type=`back_forward`、コンソールエラー0 → 続けて `DM-2026-0021` の詳細ボタン → `?no=DM-2026-0021`・`#field-applicationNo`=`DM-2026-0021`・`data-loaded="true"`。2回目: その先頭 `DM-2026-0021` の詳細から戻る → 同じ結果（全 21 件・21行・重複0・空0・ログイン中・エラー0）→ 続けて `DM-2026-0015` の詳細ボタン → `?no=DM-2026-0015`・`#field-applicationNo`=`DM-2026-0015`・`data-loaded="true"`。`review-01_3-10a.png`（1回目に戻った一覧）、`review-01_3-10b.png`（2回目の後に開いた `DM-2026-0015`） | - |

### 共通条件・回帰確認（3-9 の内訳）

| # | 条件 | 結果 | 根拠 |
|---|------|------|------|
| C1 | 【必須】架空データのみ、ヘッダー・タブタイトル、詳細にデモ操作なし、「送配電受付番号」 | 合格 | 詳細画面: ヘッダー `#app-name`=「申込管理システム（デモ）」、タイトル「申込管理システム（デモ）- 申込詳細」、`document.images`=0、`#demo-tools`・`[id^="demo-"]`・`[data-demo-action]` は0件（3案件で確認）。一覧画面: タイトル「申込管理システム（デモ）- 申込一覧」、images=0。`mock/` の html/css に `<img`・`<svg`・`url(`・logo なし（grep の該当は `logout-button` のみ）。`mock/data/` に実在電力会社名・URL・メールアドレスなし。項目名は `detail.html` の `<dt>送配電受付番号</dt>` のみで、実在社名を含む名称なし。表示された値は架空名（サンプル／デモ／見本）・`99` 始まりの番号のみ |
| C2 | 【必須】全操作を通してコンソールに JS エラーなし | 合格 | ログイン失敗／成功・リセット・追加・詳細遷移（3行＋`DM-2026-0022`＋`DM-2026-0015`）・navigate 再読込・`location.reload()`・一覧へ戻る・ブラウザの戻る2回・存在しない番号／番号なし／空・新しいタブ・ログアウト・未ログインでの詳細アクセス・再ログイン後のリセットの各段階で `browser_console_messages`（level: error, all）= Errors 0, Warnings 0。自動保存されたコンソールログ6件にも ERROR/WARNING なし（ログイン画面表示時の VERBOSE「Input elements should have autocomplete attributes」のみ） |
| C3 | 詳細画面の文言が日本語 | 合格 | 見出し「申込詳細（<番号>）」、ラベル14個（上記）、ボタン「一覧へ戻る」「ログアウト」、ヘッダー「demo-user でログイン中」、エラー「該当する申込が見つかりません」 |
| C4 | `mock/` に秘密情報なし、ID/PW はダミーのみ | 合格 | Grep（`https?://`・token・secret・webhook・teams・chat・tenant・apikey・メールアドレス・password）: `server.js` の `http://localhost` のコメント／ログ出力／URL パース用ベース、`app.js` の `demo-pass`（ダミー値）、ログイン入力欄の id・label のみ。秘密情報なし |
| R1 | （回帰）未ログインで一覧 → ログイン画面、正しい PW で一覧、誤った PW で `#login-error` | 合格 | 未ログイン状態作成 → `/list.html` を navigate → `/login.html`。`demo-user`／`wrong-pass` → `#login-error`=「IDまたはパスワードが正しくありません」（hidden=false、display block）、`/login.html` に留まり sessionStorage=0。続けて `demo-pass` に直して送信 → `/list.html`、`data-loaded="true"`、全 20 件・20行 |
| R2 | （回帰）リセット直後の行数・件数・全行の属性 | 合格 | リセット直後: 20行、「全 20 件」・`data-count="20"`、`#application-table[data-loaded="true"]`。全20行を走査し、`data-application-no` あり・`[data-field]` 9個・詳細ボタンに `data-action="detail"`・`data-application-no`（行と同値）・`id="detail-button-<申込番号>"` の条件を満たさない行は0行 |
| R3 | （回帰）追加・リセットで一覧のまま、詳細から戻った後も動作 | 合格 | 採点開始時の追加 → 全 21 件・先頭 `DM-2026-0021`・「DM-2026-0021 を追加しました」。詳細から `#back-to-list-button` で戻った一覧で追加 → 「全 22 件」・22行・先頭 `DM-2026-0022`・「DM-2026-0022 を追加しました」、`/list.html` のまま（`review-01_3-9_R3a.png`）。採点最後に（ログアウト → 再ログイン後の一覧で）リセット → 実行 → 「全 20 件」・`data-count="20"`・20行・先頭 `DM-2026-0020`・「初期データ（20件）に戻しました」、`/list.html` のまま（`review-01_3-9_R3b.png`） |

### スコア集計
- 合格: 3-1〜3-10 すべて（15+20+15+10+10+5+10+5+5+5 = 100）
- 【必須】3-1, 3-2, 3-3, C1, C2: すべて合格

## Generator への指摘（不合格項目のみ、再現手順つき）
なし。

### 参考（採点対象外・気づき）
- ログイン画面表示のたびに Edge のコンソールに VERBOSE「Input elements should have autocomplete attributes (suggested: "current-password")」が出る（スプリント02 からの継続。エラー・警告ではないため C2 には影響しない）。
- 3-10 で戻った一覧の navigation type は `back_forward`。キャッシュ（bfcache）から復元されたかどうかは区別していないが、どちらの場合も表示・件数・ログイン状態に崩れはなかった。`detail.js`・`list.js` とも `pageshow`（`persisted`）で再読み込みする実装になっている。
