# スプリント契約 — 03 申込詳細画面（`03-detail-screen`）

> Evaluator が `docs/criteria.md`（スプリント03・共通条件）、`docs/screens.md`（1・1-1・1-2・2・S2・S3・4）、`docs/flow.md`（手順3）、`CLAUDE.md`、前スプリントの `sprints/01-list-screen/contract.md`・`review-01.md`、`sprints/02-login-screen/contract.md`・`review-01.md`（申し送り）をもとに作成。
> 本契約は Evaluator と Generator の合意であり、スプリント中は変更しない。

---

## 0. 判定ルール

| 項目 | 内容 |
|------|------|
| 合格ライン | **80点以上 かつ【必須】条件（3-1, 3-2, 3-3, C1, C2）がすべて合格** |
| スコア | 各条件は全部満たして合格（部分点なし）。合格した条件の重みの合計（満点100） |
| 差し戻し上限 | **3回**（review-01〜03。3回で不合格なら停止して人に報告） |
| 未確認の扱い | 確認できなかった項目は「未確認」とし、不合格扱い |
| 判定の根拠 | Playwright MCP（Edge）の `browser_snapshot`・`browser_take_screenshot`・`browser_console_messages`・`browser_evaluate` の結果、および `mock/` 内ファイル・`/api/applications` の読み取り結果。推測では判定しない |
| 証跡 | `evidence/03-detail-screen/review-XX_<条件番号>.png`（`browser_take_screenshot` の filename にリポジトリのルートからのパスで指定する） |

---

## 1. 採点時の前提

| 項目 | 内容 |
|------|------|
| ブランチ | `sprint/03-detail-screen` |
| 起動コマンド | リポジトリのルートで `node mock/server.js`（ポート 8080 で `mock/` を配信）。Evaluator は Bash のバックグラウンド実行で起動・停止する |
| 確認 URL | ログイン `http://localhost:8080/login.html`、一覧 `http://localhost:8080/list.html`、詳細 `http://localhost:8080/detail.html?no=<申込番号>` |
| ブラウザ | Playwright MCP（`.mcp.json` の設定どおり `--browser msedge`） |
| 固定 ID/PW | demo-user / demo-pass（デモ用のダミー値） |
| 「未ログイン状態」の作り方 | `http://localhost:8080/login.html` を開き、`browser_evaluate` で `sessionStorage.clear()`・`localStorage.clear()`・`localhost` の cookie の全削除を実行する（スプリント02 と同じ手順） |
| 「ログイン画面に移る」の判定 | 最終的な `location.pathname` が `/login.html` で、`<body data-page="login">`・`#login-id`・`#login-password`・`#login-button` が表示され、詳細画面の要素（`#application-detail`・`#field-*`）が存在しないこと |
| 比較用の正解データ | 各確認時点で、ログイン中の画面から `browser_evaluate` で `fetch('/api/applications')` を取得した結果（= `mock/data/dummy.json` の内容）を正とする。採点の最後に `dummy.json` を読み取り、同じ内容であることも確認する |
| 「値が一致する」の判定 | 値の要素の `textContent` の前後空白を除いた文字列が、正解データの値と完全一致すること。データ上の「未定」「未採番」はその文字列、備考の空文字は値の要素のテキストが空であること |
| 遷移待ち | 画面遷移後は `browser_wait_for`（またはスナップショットの再取得）で、遷移先の `data-loaded="true"` またはエラー表示を確認してから判定する |
| 採点開始時のデータ | ログイン後、一覧で `#demo-reset-button` → `#demo-reset-confirm-button` を押して初期20件に戻し（リセット前の件数も記録する）、続けて `#demo-add-button` を1回押して21件（先頭が追加案件 `DM-2026-0021`）にしてから 3-1 以降を確認する |
| 行の選び方（3-1・3-2） | 21件の状態の一覧で、**先頭行**（追加案件 `DM-2026-0021`）、**中間行**（上から11行目。初期データどおりなら `DM-2026-0011`）、**末尾行**（`DM-2026-0001`）の3行。行は申込番号で特定し、`button[data-action="detail"][data-application-no="<申込番号>"]` をクリックする（PAD と同じ操作。URL 直接指定ではない） |
| データの書き換え | デモ操作（追加・リセット）で `mock/data/dummy.json` がサーバー経由で書き換わるのは仕様どおりの動作であり、Evaluator による `mock/` の編集には当たらない。採点の最後に画面からリセットし初期20件に戻す |
| 後片付け | 採点の最後に `evidence/` 直下に自動保存された `page-*.yml`・`console-*.log` を削除し、リポジトリのルート直下に `.png` が残っていないことを確認する。サーバー停止・`browser_close` |

---

## 2. 合格条件

| # | 合格条件（観察で判定できる文） | 確認方法 | 重み |
|---|-------------------------------|----------|------|
| 3-1 | 【必須】ログイン後の一覧（21件）で、先頭行（`DM-2026-0021`・デモ操作で追加した案件）・中間行（11行目）・末尾行（`DM-2026-0001`）の「詳細」ボタンをそれぞれクリックすると、**同じタブ** で `location.pathname` が `/detail.html`、`?no=` の値がクリックした行の申込番号になり、`<body data-page="detail">` の詳細画面が表示され、`#detail-title` が「申込詳細（<その申込番号>）」、`#field-applicationNo` のテキストがその申込番号になる。ブラウザタブのタイトルは「申込管理システム（デモ）- 申込詳細」 | 一覧で `browser_click`（各行の詳細ボタン）→ `browser_wait_for` → `browser_evaluate`（`location.pathname`・`location.search`・`data-page`・`document.title`・`#detail-title`・`#field-applicationNo`）・`browser_tabs`（list でタブが1つのまま）。3行それぞれ一覧に戻ってから実施。スクリーンショット | 15 |
| 3-2 | 【必須】3-1 の3案件それぞれで、詳細画面に `docs/screens.md` 1-2 の **14項目すべて** が、ラベル（項目名：申込番号／申込日／お客さま名／供給地点特定番号／申込種別／変更前容量／変更後容量／ステータス／担当者／需要場所住所／希望日／工事予定日／送配電受付番号／備考）と値の組で、**この順番** に表示され、14個の値がすべて正解データ（`/api/applications` の該当案件）と一致する（不一致0件）。値はページ上のテキストとして取得できる（画像・入力欄・`title` 属性だけの表示ではない） | `browser_evaluate` で `#application-detail` 内のラベルと値を順に取得し、正解データと突き合わせ（不一致件数を記録）・snapshot。スクリーンショット | 20 |
| 3-3 | 【必須】詳細画面の14個の値の要素それぞれに `id="field-<キー>"` と `data-field="<キー>"`（キーは `docs/screens.md` 1-2、同じ要素に両方）があり、すべて `#application-detail` の内側にある。各値の要素は子要素を持たず（またはテキストが値だけで）、ラベル文字列を含まない。`id="field-*"`・`data-field` は詳細画面内でそれぞれ14個ちょうどで重複が無い。`#application-detail`・`#detail-title`・`#back-to-list-button`・`#logout-button` の `id` と各 `field-*` の `id`・`data-field` は、再読み込み（navigate 再読込・`location.reload()`）しても変わらない | `browser_evaluate`（`[id^="field-"]`・`[data-field]` の件数・重複・`id` と `data-field` の対応・子要素数・ラベル文字列の混入、`#application-detail` との包含関係）→ 再読み込みして属性一覧を比較 | 15 |
| 3-4 | 詳細の表示完了後、`#application-detail` に `data-loaded="true"` が付く。`data-loaded="true"` の時点で14個の値がすべて表示済みである（`#field-applicationNo` が `?no=` の値と一致）。詳細画面を再読み込みしても同様 | 3-1 の各遷移後に `browser_wait_for` → `browser_evaluate`（`data-loaded` と各値）。再読み込み後も確認 | 10 |
| 3-5 | 詳細画面に `#back-to-list-button`（表示文言「一覧へ戻る」）があり、クリックすると同じタブで `/list.html` に遷移し、一覧が再表示される（`#application-table` に `data-loaded="true"`、`#application-count` と行数がその時点の件数（21 または 22 件）と一致、ログイン画面に飛ばされない）。戻った一覧から別の行の詳細を開けること（3-1 の3行を続けて確認できること）も含む | 詳細画面で `browser_click`（`#back-to-list-button`）→ `browser_wait_for` → `browser_evaluate`（`location.pathname`・`data-loaded`・件数・行数）。スクリーンショット | 10 |
| 3-6 | ログイン済みで次の URL を開くと、`#detail-error` に「該当する申込が見つかりません」が表示され、14項目の値は表示されない（`#field-*` の値が空、または要素が無い・非表示）。また、PAD が正常表示と取り違えないよう `#application-detail` に `data-loaded="true"` が付かない。`#back-to-list-button` で一覧に戻れる：(a) 存在しない番号 `/detail.html?no=DM-2099-9999`、(b) 番号なし `/detail.html`、(c) 番号が空 `/detail.html?no=`。正常な案件の表示時は `#detail-error` が非表示または空である | `browser_navigate` → 2秒待機 → snapshot・`browser_evaluate`（`#detail-error` のテキスト・表示状態、`data-loaded`、`#field-*` の値）→ `browser_click`（`#back-to-list-button`）。スクリーンショット | 5 |
| 3-7 | (a) 未ログイン状態で `http://localhost:8080/detail.html?no=DM-2026-0001` をアドレス直接入力（`browser_navigate`）で開くとログイン画面に移る（詳細の値が操作可能な状態で残らない）。(b) ログイン済みのタブとは別に `browser_tabs`（new）で新しいタブを開き、同じ URL を開いてもログイン画面に移る。(c) 詳細画面のヘッダーに `#current-user`（「demo-user でログイン中」）と `#logout-button`（「ログアウト」）があり、`#logout-button` でログイン画面に移り、その後に詳細画面の URL を開くとログイン画面に移る | 未ログイン状態を作る → `browser_navigate` → `browser_wait_for` → snapshot・`browser_evaluate`（`location.pathname`・`data-page`・`#application-detail` の有無）。(b) は確認後に新しいタブを閉じる。スクリーンショット | 10 |
| 3-8 | 一覧で `#demo-add-button` をもう1回押して22件にし、追加案件 `DM-2026-0022` の詳細を「詳細」ボタンで開くと、工事予定日 `#field-scheduledWorkDate` が「未定」、送配電受付番号 `#field-receptionNo` が「未採番」、備考 `#field-remarks` が空欄（テキストが空で、要素は存在する）で表示される。`DM-2026-0021` も工事予定日「未定」・送配電受付番号「未採番」で表示される（3-1 の確認で兼ねる） | 一覧で追加 → 詳細ボタン → `browser_evaluate`（3項目のテキスト・要素の存在）・snapshot。スクリーンショット | 5 |
| 3-9 | 共通条件 C1〜C4 と、スプリント01・02 の回帰確認 R1〜R3 をすべて満たす（下表。C1・C2 は【必須】） | 下表のとおり | 5 |
| 3-10 | 一覧の「詳細」ボタンで開いた詳細画面から、ブラウザの「戻る」（`browser_navigate_back`）で一覧に戻れる。戻った一覧は `location.pathname` が `/list.html`、`<body data-page="list">`、`#application-table` に `data-loaded="true"`、`#application-count` の件数・`data-count` と行数が一致し、行の重複・欠落・空表示が無い（ブラウザのキャッシュから復元された場合も含め表示が崩れない）。ログイン中のまま（ログイン画面に飛ばされず、`#current-user` が「demo-user でログイン中」）で、コンソールに JS エラーが出ない。戻った一覧から続けて別の行の「詳細」ボタンで、その行の詳細（`#field-applicationNo` がその申込番号、`data-loaded="true"`）を開ける | 詳細ボタンで詳細を開く → `browser_navigate_back` → `browser_wait_for` → snapshot・`browser_evaluate`（`location.pathname`・`data-page`・`data-loaded`・件数・行数・申込番号の重複・`#current-user`）・`browser_console_messages`（level: error）→ 別の行の詳細ボタンを `browser_click` → `browser_evaluate`。少なくとも2回（先頭行・末尾行の詳細から）実施。スクリーンショット | 5 |

### 共通条件・回帰確認（3-9 の内訳）

| # | 条件 | 確認方法 |
|---|------|----------|
| C1 | 【必須】詳細画面・一覧画面・`mock/` 内のファイルに実在の社名・人名・番号・システム名・ロゴが無い（架空データのみ）。詳細画面のヘッダーに「申込管理システム（デモ）」と表示され、タブのタイトルが「申込管理システム（デモ）- 申込詳細」。詳細画面にデモ操作エリア（`#demo-tools`・`demo-` で始まる `id`・`data-demo-action`）が無い。項目名は「送配電受付番号」（実在社名を含む名称を使わない） | snapshot・`browser_evaluate`（`document.title`・`document.images`・`#demo-tools` 等の有無）、`mock/` 内ファイルの読み取り |
| C2 | 【必須】採点中のすべての操作（ログイン・一覧表示・詳細遷移3行＋追加案件・再読み込み・一覧へ戻る・ブラウザの「戻る」・存在しない番号／番号なし・未ログインでの詳細アクセス・新しいタブ・ログアウト・回帰確認のデモ操作）を通して、ブラウザのコンソールに JS エラーが出ない（存在しない番号・番号なしの表示も JS エラーにしない） | 各操作後に `browser_console_messages`（level: error） |
| C3 | 詳細画面の文言（見出し・ラベル・ボタン・エラーメッセージ）が日本語 | snapshot |
| C4 | `mock/` 内のファイルに秘密情報（実 URL・アカウント・チャット ID・トークン等）が無い。ID/PW はダミー値 demo-user / demo-pass のみ | `mock/` 内ファイルを検索（Grep） |
| R1 | （回帰・スプリント02）未ログイン状態で `/list.html` を開くとログイン画面に移り、demo-user / demo-pass でログインすると `/list.html` に遷移する。誤った PW（`demo-user` / `wrong-pass`）では `#login-error` が表示され `/login.html` に留まる | 未ログイン状態を作る → navigate・ログイン操作 → `browser_evaluate` |
| R2 | （回帰・スプリント01）ログイン後の一覧で、リセット直後に行数20・`#application-count`「全 20 件」・`data-count="20"`・`#application-table[data-loaded="true"]`、全行に `data-application-no` と9個の `data-field`、各行の「詳細」ボタンに `data-action="detail"`・`data-application-no`・`id="detail-button-<申込番号>"` がある | `browser_evaluate` で行数・属性を取得 |
| R3 | （回帰・スプリント01）一覧で `#demo-add-button` を押すと件数が1増え先頭行が追加案件・`#demo-message` に追加した申込番号が表示され、`#demo-reset-button` → `#demo-reset-confirm-button` で「全 20 件」に戻る。どちらの操作の後も一覧画面のまま。詳細画面から一覧へ戻った後もデモ操作が同様に動く | `browser_click` → snapshot・`browser_evaluate`。スクリーンショット |

- C1・C2 は【必須】のため、どちらかが不合格の場合はスコアに関係なく不合格とする（3-9 の5点も失う）。
- R1〜R3 は【必須】ではないが、満たさない場合は 3-9 の5点を失う。
- 3-10（ブラウザの「戻る」）は人のレビューでの追加要望により criteria.md に加えて設けた条件。PAD は `#back-to-list-button` で戻る（`docs/flow.md` 手順3）ため【必須】にはしない。重み5点は 3-1 を 20→15 に減らして充てた（3-1 は【必須】で、不合格なら点数に関係なく不合格になるため、減らしても合否への影響がない）。

| 重みの合計 | 100 |
|-----------|-----|

### 証跡ファイル（予定）

| 条件 | ファイル名（`XX` はレビュー回数） |
|------|-----------------------------------|
| 3-1 | `evidence/03-detail-screen/review-XX_3-1a.png`（先頭 `DM-2026-0021`）、`review-XX_3-1b.png`（中間）、`review-XX_3-1c.png`（末尾 `DM-2026-0001`） |
| 3-2 | 3-1 のスクリーンショットと兼ねる（14項目すべてが写るよう撮影。写りきらない場合は `review-XX_3-2a.png` 〜 `3-2c.png` を追加） |
| 3-3・3-4 | `browser_evaluate` の結果を review に記録（スクリーンショットは 3-1 と兼ねる） |
| 3-5 | `evidence/03-detail-screen/review-XX_3-5.png`（一覧へ戻った後） |
| 3-6 | `evidence/03-detail-screen/review-XX_3-6a.png`（存在しない番号）、`review-XX_3-6b.png`（番号なし）、`review-XX_3-6c.png`（番号が空） |
| 3-7 | `evidence/03-detail-screen/review-XX_3-7a.png`（未ログインで直接）、`review-XX_3-7b.png`（新しいタブ）、`review-XX_3-7c.png`（ログアウト後） |
| 3-8 | `evidence/03-detail-screen/review-XX_3-8.png`（`DM-2026-0022` の詳細） |
| 3-10 | `evidence/03-detail-screen/review-XX_3-10a.png`（「戻る」で戻った一覧）、`review-XX_3-10b.png`（続けて開いた別の行の詳細） |
| 3-9 | `evidence/03-detail-screen/review-XX_3-9_R3a.png`（追加後）、`review-XX_3-9_R3b.png`（リセット後） |

---

## 3. 本スプリントの対象外（後続スプリント・人のレビューで確認）

- 詳細画面での「新規案件を追加」「初期データに戻す」（詳細画面にはデモ操作エリアを置かない。C1 で「無いこと」だけ確認）
- データ取得失敗時（サーバー停止中など）の詳細画面の表示（criteria の対象外。採点しない）
- スプリント01・02 の条件のうち、本契約の R1〜R3 に含めないもの（列順・並び順の再読み込み比較・サーバー再起動後の保持・追加候補の再現性・`/` の表示・ログイン済みでのログイン画面表示など）は再採点しない
- PAD フローの実行確認（Evaluator の範囲外。人のレビュー②）
