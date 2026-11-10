# スプリント合格基準書 — 06 デモの初期データを5件にする（`06-data-5items`）

> Evaluator が、人の決定（2026-11-10、承認済み。下の 0-1）、`docs/criteria.md`（スプリント01 の 1-2・1-8〜1-11、スプリント03、スプリント04 の 4-6、共通条件・人のレビュー② R1・R7）、`docs/screens.md`（1-2 項目定義・一覧・詳細）、`docs/flow.md`、`CLAUDE.md`、`.claude/agents/evaluator.md`、`sprints/01-list-screen/pass-criteria.md`・`sprints/04e-click-no-mouse/pass-criteria.md`、ブランチ `sprint/06-data-5items`（`main` の `4d7a423` から作成）の `mock/`（`data/initial.json`・`data/dummy.json`・`data/candidates.json`・`list.html`・`js/list.js`・`js/detail.js`・`server.js`）と `flows/application-check/`・`flows/application-check-notify/` をもとに作成。
> 本基準書は Evaluator と Generator の合意であり、スプリント中は変更しない。

---

## 0. 目的と判定ルール

**目的**：デモの初期データを20件から **5件** に減らし、デモ当日の待ち時間を短くする（資産4 の実行が約1分半 → 短くなる見込み）。データの中身（番号以外の項目）は今の20件から選んだ5件のまま変えず、画面・フローの仕組み（要素の `id`・`data-*`・アクション）は変えない。フローは件数を毎回画面から取るので、`Main.txt` の処理は変えず、コメントと手順書の「20件」の例だけを直す（PAD への貼り直しは不要）。

| 項目 | 内容 |
|------|------|
| 合格ライン | **80点以上 かつ【必須】条件（06-1〜06-7, 06-9, 06-10, 06-12, C1, C4）がすべて合格** |
| スコア | 各条件は全部満たして合格（部分点なし）。合格した条件の重みの合計（満点100） |
| 差し戻し上限 | **3回**（review-01〜03。3回で不合格なら停止して人に報告） |
| 未確認の扱い | 確認できなかった項目は「未確認」とし、不合格扱い。実機の条件で報告に無い・あいまいな点があれば、review の末尾に進行役に確認してほしい内容を書く（推測で合格にしない） |
| 判定の根拠 | **[画面]** Playwright MCP（`.mcp.json` の設定どおり Edge）の `browser_snapshot`・`browser_take_screenshot`・`browser_evaluate`・`browser_console_messages` の結果。**[机上]** `mock/`・`flows/`・`docs/` のファイル（Read・Grep）と、Evaluator が scratchpad に置く Node スクリプトの出力（JSON の比較、`git diff` のアクション行の比較など）。**[実機]** Evaluator は PAD を操作できないため、進行役が Claude デスクトップ版のセッションに実行を頼み、その **実行結果の報告**（PAD の表示・エラーの文言・実行の開始／終了時刻・出力 CSV のファイル名とバイト数など）を根拠にする。出力 CSV は Evaluator も読んで確かめてよい（読むだけ。Node スクリプトで照合する） |
| 実機の報告に含めてもらうもの | 06-12 の「報告で判定する内容」列のとおり。報告の日時・PAD の版・PAD に入っている資産4 のフローが `main` の `Main.txt`（04e 合格版以降、貼り直していない）のままであることを必ず含める |
| 証跡 | 画面：`evidence/06-data-5items/review-XX_<条件番号>.png`（`browser_take_screenshot` の filename にリポジトリのルートからのこのパスを指定）。机上・実機：`evidence/06-data-5items/review-XX_<static/report/csv>.txt`。**証跡にユーザー名を含むパス（`C:\Users\<名前>\…`）・コンピューター名・アカウント名・テナント情報を書かない**（CSV の場所は `<ドキュメント>\申込状況チェック_デモ\…` と書く） |

### 0-1. 人の決定（2026-11-10、承認済み。基準書の前提）

| # | 内容 | 本基準書での扱い |
|---|------|------------------|
| D1 | 初期データは `main` の `mock/data/initial.json` のうち **元 DM-2026-0003・0005・0010・0014・0018 の5件** を残し、元の並び順のまま **DM-2026-0001〜0005 に振り直す**。番号（`applicationNo`）以外の13項目は元の値のまま。`initial.json` と `dummy.json` は同一の5件にする | 06-1・06-2 |
| D2 | `mock/list.html`・`mock/js/list.js` の「初期データ（20件）」の文言を5件にする。`server.js` は件数を `initial.json` から数えるので変更不要の見込み（変更が要るなら最小限） | 06-3〜06-6 |
| D3 | `flows/application-check/`・`flows/application-check-notify/` の `README.md`・`reference.md`・`Main.txt` のコメントにある件数の例（「全 20 件」など）を5件の前提に直す。`Main.txt` はコメントだけの変更で、アクション（処理）は変えない（貼り直し不要）。`verification-log.md`・過去の `sprints/`・`evidence/` は変更しない | 06-9・06-10 |
| D4 | `docs/` は Planner が並行して修正する（採点対象に含めてよい：`docs/` に20件前提の記述が残っていないこと） | 06-11（Generator の担当外のため【必須】にしない。不合格なら進行役に Planner への依頼を書く） |
| D5 | 追加は DM-2026-0006・0007 と続き、［初期データに戻す］で5件に戻る | 06-5・06-6 |
| D6 | 最後に進行役がデスクトップ版で資産4（申込状況チェック_デモ）を5件で1回実行し、CSV が見出し＋5行・`dummy.json` と不一致0 で出ることを報告として受け取る | 06-12（実機） |

### 0-2. 期待する初期データ（D1 から決まる対応）

| 新しい申込番号 | 元の申込番号 | お客さま名（元のまま。確認用） |
|----------------|--------------|------------------------------|
| DM-2026-0001 | DM-2026-0003 | 見本 三郎 |
| DM-2026-0002 | DM-2026-0005 | サンプル 五月 |
| DM-2026-0003 | DM-2026-0010 | デモ 十和 |
| DM-2026-0004 | DM-2026-0014 | デモ 四季 |
| DM-2026-0005 | DM-2026-0018 | デモ 八雲 |

- 一覧・CSV の並びは申込番号の降順なので、**DM-2026-0005 → DM-2026-0001** の順になる。
- 期待する CSV のバイト数：Evaluator が `main` の `initial.json` から、04c 以降の出力形式（BOM 付き UTF-8・CRLF・最終行の後に改行なし・値をダブルクォートで囲まない）で計算した値は、今の20件で **4,135 バイト**（実機の値と一致）、上の5件で **1,160 バイト**。06-12 ではこの値と照合する。

---

## 1. 採点時の前提

| 項目 | 内容 |
|------|------|
| ブランチ | `sprint/06-data-5items`（`main` の `4d7a423` から作成） |
| 比較の基準 | `git show 4d7a423:<パス>`（基準書の作成時点の `main`。以下「基準」） |
| 採点対象 | `mock/data/initial.json`・`mock/data/dummy.json`・`mock/list.html`・`mock/js/list.js`・`mock/server.js`、`flows/application-check/`・`flows/application-check-notify/` の `Main.txt`・`README.md`・`reference.md`、`docs/`（06-11 のみ） |
| 変更しないもの | `mock/data/candidates.json`・`mock/` のその他のファイル（`login.html`・`detail.html`・`index.html`・`css/`・`js/app.js`・`js/login.js`・`js/detail.js`）、両資産の `verification-log.md`、`sprints/` の 06 以外のフォルダー、`evidence/` の 06 以外のフォルダー（06-3・06-10 で `git diff` が空であることを確認） |
| 「アクション行」の定義 | `Main.txt` のうち `# [ControlRepository][PowerAutomateDesktop]` の行より前で、`#` で始まるコメント行（先頭の空白を除いて判定）・空行を除いた行（`END` も含めて比較する） |
| ブラウザ | Playwright MCP（`.mcp.json` の設定どおり Edge） |
| モックの起動 | Evaluator が `node mock/server.js`（ポート 8080）をバックグラウンドで起動する。画面の確認の前に、一覧のデモ操作で［初期データに戻す］→［実行する］を行い、5件の状態から始める |
| ログイン | demo-user / demo-pass（ダミー値） |
| 後片付け | 画面の確認の最後に［初期データに戻す］→［実行する］で5件に戻し、`mock/data/dummy.json` が `initial.json` と同じ内容で、`git status` に `mock/data/dummy.json` の変更が出ないことを確認する（出た場合は06-2 の判定に記録）。自分が起動したバックグラウンドタスクだけを止める（`node` をまとめて終了するコマンドは使わない）。`evidence/` 直下の `page-*.yml`・`console-*.log` を削除し、ルート直下に `.png` が残っていないことを確認、`browser_close` |
| 実機の実行環境 | PAD に保存済みの資産4（申込状況チェック_デモ。`main` の `Main.txt` と同じ。本スプリントはコメントの変更だけなので貼り直さない）・Microsoft Edge・PAD の Edge 拡張機能が有効。モックは本スプリントのブランチ（またはマージ後の `main`）の `node mock/server.js`。実行前に一覧のデモ操作で［初期データに戻す］→［実行する］で5件にし、その Edge のウィンドウは閉じておく。デモ当日の注意（README 3）どおり、実行中はマウス・キーボードを操作しない |

---

## 2. 合格条件

「判定」列：**[画面]** は Playwright MCP で操作して判定、**[机上]** は Evaluator がファイルを読んで判定、**[実機]** はデスクトップ版のセッションの報告（と出力 CSV）で判定する。**実機でしか確認できない条件は 06-12 だけ**。

| # | 合格条件（観察で判定できる文） | 判定 | 確認方法・報告で判定する内容 | 重み |
|---|-------------------------------|------|------------------------------|------|
| 06-1 | 【必須】**初期データの中身**：`mock/data/initial.json` が JSON として読め、`applications` が **ちょうど5件**。(a) 申込番号が並び順に `DM-2026-0001`・`0002`・`0003`・`0004`・`0005`。(b) 各件の申込番号以外の13項目（`applicationDate`〜`remarks`。キーの種類・数も同じ）が、基準の `initial.json` の元 `DM-2026-0003`・`0005`・`0010`・`0014`・`0018`（0-2 の対応）と **文字単位で一致**（不一致 0）。(c) 各件のキーは14個で、基準と同じキー（値の追加・削除が無い）。(d) `DM-2026-0006` 以降の番号・元の番号のままの件が無い | 机上 | Node スクリプト（基準の `initial.json` と今の `initial.json` を `JSON.parse` して、0-2 の対応で14項目を比較。不一致の件数を出力） | 10 |
| 06-2 | 【必須】**`dummy.json` が `initial.json` と同じ**：(a) `mock/data/dummy.json` が JSON として読め、`initial.json` と内容が同じ（`JSON.parse` した結果を比較して不一致 0。5件・同じ順）。(b) `mock/data/candidates.json` が基準と同じ（`git diff 4d7a423 -- mock/data/candidates.json` が空）。(c) 採点の後片付け（1 節）の後も (a) が成り立ち、Evaluator の画面操作で `dummy.json` が変わったままになっていない | 机上 | Node スクリプト（`JSON.parse` して比較）、`git diff`、後片付けの後の `git status` | 5 |
| 06-3 | 【必須】**モックの文言と変更範囲**：(a) `mock/list.html` の確認表示の文が「初期データ（5件）に戻します。よろしいですか？」、`mock/js/list.js` のリセット完了の文が「初期データ（5件）に戻しました」（件数を `initial.json`／API の返り値から作る書き方でもよいが、画面に出る文字は上と同じになること。06-6 で画面でも確認）。(b) `mock/` の HTML・JS（`server.js` を含む。コメントも含む）に「20件」「20 件」「２０件」のような20件前提の文字が残っていない（Grep 0 件。`mock/data/` と CSS の色コードは除く）。(c) `git diff 4d7a423 --stat -- mock` で変わったファイルが `data/initial.json`・`data/dummy.json`・`list.html`・`js/list.js`・`server.js` の範囲内。`server.js` を変えた場合、変わった行はコメント行だけ（または件数の処理に必要な最小限で、その理由が review に書ける差分）。(d) 要素の `id`・`data-*` 属性（`#application-count`・`#application-tbody`・`#detail-button-<申込番号>`・`#demo-add-button`・`#demo-reset-button`・`#demo-reset-confirm`・`#demo-reset-confirm-text`・`#demo-reset-confirm-button`・`#demo-reset-cancel-button`・`#demo-message` 等）の名前・付け方が基準から変わっていない（`list.html`・`list.js` の差分が文言の行だけ） | 机上 | Read・Grep（`20 *件`・`２０件`）、`git diff 4d7a423 -- mock` | 5 |
| 06-4 | 【必須】**一覧に全5件（画面）**：ログイン後の一覧画面で、(a) `#application-tbody` の行がちょうど **5行**、ページ送りが無い。(b) `#application-count` のテキストが「全 5 件」で、`data-count="5"`。(c) 行の申込番号が上から `DM-2026-0005`・`0004`・`0003`・`0002`・`0001`（申込番号の降順）。(d) 各行の9項目（申込番号〜担当者）の表示テキストが `dummy.json` の該当件と一致（不一致 0）。(e) 各行に `data-application-no` と「詳細」ボタン `#detail-button-<申込番号>` があり、表示完了後に `#application-table` に `data-loaded="true"` が付く。(f) `browser_console_messages` に JS エラーが無い | 画面 | `browser_navigate`（login.html → ログイン）→ `browser_snapshot`、`browser_evaluate`（行数・`#application-count` のテキストと `data-count`・各行の `data-field` のテキストを取り出し、`dummy.json` と照合）、`browser_console_messages`。スクリーンショット `review-XX_06-4.png` | 10 |
| 06-5 | 【必須】**追加で DM-2026-0006・0007（画面）**：5件の状態で `#demo-add-button` を押すと、(a) `#demo-message` が「DM-2026-0006 を追加しました」、(b) 一覧が **6行** で先頭行が `DM-2026-0006`、`#application-count` が「全 6 件」・`data-count="6"`、再表示後に `data-loaded="true"`、(c) 先頭行のお客さま名・申込種別・変更前容量・変更後容量・担当者が `candidates.json` の1件目（基準のまま）の値、ステータスが「受付済」。続けてもう1回押すと、(d) 「DM-2026-0007 を追加しました」、7行・先頭 `DM-2026-0007`・「全 7 件」・`data-count="7"`、お客さま名等が `candidates.json` の2件目の値。(e) 元の5件の行（`DM-2026-0005`〜`0001`）は値が変わらず残っている。(f) JS エラーが無い | 画面 | `browser_click`（`#demo-add-button`）→ `browser_snapshot`・`browser_evaluate`、`browser_console_messages`。スクリーンショット `review-XX_06-5.png` | 10 |
| 06-6 | 【必須】**リセットで5件に戻る（画面）**：06-5 の7件の状態で、(a) `#demo-reset-button` を押すと `#demo-reset-confirm` が表示され、`#demo-reset-confirm-text` が「初期データ（5件）に戻します。よろしいですか？」。(b) `#demo-reset-cancel-button` を押すと確認表示が閉じ、一覧は7件のまま。(c) もう一度［初期データに戻す］→ `#demo-reset-confirm-button` を押すと、`#demo-message` が「初期データ（5件）に戻しました」、一覧が **5行**（`DM-2026-0005`〜`0001`）、「全 5 件」・`data-count="5"`、`data-loaded="true"`、各行の値が `dummy.json`（＝`initial.json`）と一致。(d) リセット後にもう1回 `#demo-add-button` を押すと、また「DM-2026-0006 を追加しました」になり、お客さま名が `candidates.json` の1件目（候補が先頭から使われる）。この後もう一度リセットして5件に戻す。(e) JS エラーが無い | 画面 | `browser_click` → `browser_snapshot`・`browser_evaluate`、`browser_console_messages`。スクリーンショット `review-XX_06-6.png`（(c) の直後） | 10 |
| 06-7 | 【必須】**詳細画面が5件とも開く（画面）**：5件の状態の一覧で、5件それぞれの「詳細」ボタン（`#detail-button-DM-2026-0001`〜`0005`）を押すと、(a) `detail.html?no=<その申込番号>` に移り、`#application-detail` に `data-loaded="true"` が付き、`#detail-error` が表示されない。(b) 見出しが「申込詳細（<申込番号>）」で、14項目（`#field-applicationNo`〜`#field-remarks`）のテキストが `dummy.json` の該当件と一致（5件×14項目で不一致 0。備考が空の件は空）。(c) `#back-to-list-button` で一覧に戻り、5件のまま。(d) 番号を振り直す前の番号で直接開いた `detail.html?no=DM-2026-0010` は「該当する申込が見つかりません」が表示される（古い20件のデータが残っていない）。(e) JS エラーが無い | 画面 | 5件それぞれ `browser_click` → `browser_evaluate`（14項目の取り出しと照合）→ `#back-to-list-button`、`browser_navigate`（(d)）、`browser_console_messages`。スクリーンショット `review-XX_06-7.png`（1件以上） | 10 |
| 06-8 | **初期データの値の形式**：`dummy.json` の5件の全14項目が `docs/screens.md` 1-2 の型・形式に沿う（申込番号 `DM-YYYY-NNNN` で一意、申込日・希望日は `YYYY/MM/DD`、供給地点特定番号は `99` 始まりの数字22桁で一意、申込種別・ステータスは定義された選択値、工事予定日は `YYYY/MM/DD` または「未定」、送配電受付番号は `UK-NNNNNNNN` または「未採番」、値にカンマ・改行・ダブルクォートを含まない）。画面（06-4・06-7）の表示も同じ文字列 | 机上（画面の表示は 06-4・06-7 の結果を使う） | Node スクリプト（正規表現・選択値の照合、一意性）、Read（`docs/screens.md` 1-2） | 5 |
| 06-9 | 【必須】**`Main.txt` はコメントだけの変更（貼り直し不要）**：`flows/application-check/Main.txt` と `flows/application-check-notify/Main.txt` のそれぞれで、(a) `git diff 4d7a423` の変わった行（追加・削除）が **すべてコメント行**（先頭の空白を除いて `#` で始まる行）で、アクション行の差分が **0**（アクション行だけを抜き出して基準と比べ、行数・内容・順が文字単位で同じ）。(b) マーカー行 `# [ControlRepository][PowerAutomateDesktop]` 以降（UI 要素の JSON と `Repository`）が基準と **文字単位で同じ**。(c) 件数の例を書いたコメント（基準の資産4 の L96・資産5 の L102「例「全 20 件」」）が5件の前提（例「全 5 件」等）に直っている。(d) コメントに「20件」「全 20 件」のような20件前提の例が残っていない | 机上 | `git diff`、Node スクリプト（アクション行の抽出と比較、マーカー行以降の比較）、Grep | 10 |
| 06-10 | 【必須】**手順書の件数の例**：両資産の `README.md`・`reference.md` で、(a) 今の前提・手順・例として書かれた件数が5件に直っている（例：［初期データに戻す］で「5件に戻る」、初期データでの CSV の行数「見出し＋5行」・1件追加後「6行」、件数表示の例「全 5 件」、変数の例の申込番号〔`DM-2026-0005,DM-2026-0004,…` 等〕、資産5 の README の確認手順の表〔初回5件 → ［新規案件を追加］2回で7件 等〕）。(b) `reference.md`（資産4）の「8. CSV 出力例」が5件の前提で、例の行が今の `dummy.json` の値と一致し（先頭行 `DM-2026-0005`、最終行 `DM-2026-0001`。Evaluator が Node スクリプトで照合）、「見出し1行＋5行」と書かれている。5件のバイト数を書く場合は 1,160 バイトで、実機で確かめる前に「実機で確認済」と書いていない。(c) 過去の実機の結果（「2026-10-21 に初期20件で連続3回」「20件で 4,135 バイト」等）は、日付・版などで **過去の記録と分かる書き方** なら残してよい。今の前提として20件を書いた箇所（「初期20件で約2分弱」のような今のデモの所要時間・手順としての記述）が残っていない（Evaluator が Grep〔`20 *件`・`2[0-2] *行`・`全 *20`・`DM-2026-00[1-2][0-9]`〕の全ヒットを1件ずつ「過去の記録／今の前提」に分けて review に書く）。(d) `git diff 4d7a423 -- flows/application-check/verification-log.md flows/application-check-notify/verification-log.md` が空、`git diff 4d7a423 --stat -- sprints evidence` に 06 以外のフォルダーが出ない | 机上 | Read・Grep、Node スクリプト（CSV 出力例と `dummy.json` の照合）、`git diff` | 5 |
| 06-11 | **docs に20件前提が残っていない**：`docs/`（`criteria.md`・`screens.md`・`flow.md`・`demo-script.md` ほか）で、初期データの件数・一覧の件数表示・CSV の行数・追加後の番号（`DM-2026-0021` 等）・リセット後の件数などの今の前提が5件（追加で `DM-2026-0006`・`0007`、6件・7件）になっており、20件前提の記述（「20件」「全 20 件」「21件」「22件」「`DM-2026-0020`」等）が、過去の経緯と分かる記述を除いて残っていない | 机上 | Grep（`2[0-2] *件`・`全 *2[0-2]`・`DM-2026-00[1-2][0-9]`）の全ヒットを確認。不合格の場合は、残っている箇所を review 末尾の「進行役への確認・依頼」に書く（`docs/` は Planner の担当のため Generator への指摘にはしない） | 5 |
| 06-12 | 【必須】**資産4 を5件で1回実行（実機＋照合）**：デスクトップ版のセッションが、1 節の実機の実行環境で、PAD に保存済みの資産4（申込状況チェック_デモ。貼り直さない）を **1回** 実行し、(a) エラーのメッセージが出ずに最後まで正常に終わる（Edge が閉じて終了）。(b) 出力された履歴ファイル（`申込状況_YYYYMMDD_HHMM.csv`）と `latest.csv` が、**1,160 バイト**（0-2 の計算値）、先頭3バイトが `EF BB BF`（BOM）、1行目が見出し14列（基準の `reference.md` 8 と同じ順）、2行目以降が **5行**、申込番号の順が `DM-2026-0005` → `DM-2026-0001`、14項目の値が `mock/data/dummy.json` と **不一致 0**。(c) `latest.csv` が同じ実行の履歴ファイルとバイト単位で同一 | 実機（Evaluator が CSV を読んで照合） | 報告：日時・PAD の版・資産4 を貼り直していないこと・実行前に5件にリセットしたこと・開始／終了時刻・結果（正常終了／止まった場合は文言全文とスクリーンショット）・出力されたファイル名とバイト数。Evaluator は `<ドキュメント>\申込状況チェック_デモ` の該当ファイルを読み（読むだけ）、Node スクリプトでバイト数・BOM・見出し・行数・順・14項目を `dummy.json` と照合する（04e の `review-XX_csv.txt` と同じ確認）。報告に無い項目は未確認 | 10 |
| 06-13 | 共通条件 C1・C3・C4（下表。C1・C4 は【必須】） | 机上 | 下表のとおり | 5 |

### 共通条件（06-13 の内訳）

| # | 条件 | 確認方法 |
|---|------|----------|
| C1 | 【必須】本スプリントで変更したファイル（`mock/`・`flows/`）に実在の社名・人名・番号・システム名・ロゴが無く、データは架空データ（基準の `initial.json` から選んだ5件と `candidates.json`）のみ。対象システム名は「申込管理システム（デモ）」 | `git diff 4d7a423` の追加行の Read・Grep |
| C3 | 画面文言・手順書・コメントが日本語（PAD のアクション名・構文のキーワード・変数名・セレクター・JSON のキーは英語可） | Read |
| C4 | 【必須】本スプリントで変更したファイルと、本スプリントで追加した証跡に秘密情報が無い：URL は `http://localhost:8080` のみ、ID/PW はダミー値 demo-user / demo-pass のみ。実機の結果の記録に、コンピューター名・ユーザー名・ユーザー名を含むパス（`C:\Users\<名前>` 等）・アカウント名・メールアドレス・テナント URL・SharePoint のサイト URL・Teams のチャネル ID・トークン等が無い（CSV の場所は `<ドキュメント>\…` と書く） | Grep（`http`・`@`・`C:\\Users`・`sharepoint`・`token`・`tenant` 等） |

- C1・C4 は【必須】のため、どちらかが不合格の場合はスコアに関係なく不合格とする（06-13 の5点も失う）。C3 のみ不合格の場合は 06-13 の5点を失う。

| 重みの合計 | 100 |
|-----------|-----|

（10＋5＋5＋10＋10＋10＋10＋5＋10＋5＋5＋10＋5＝100。画面の条件 06-4〜06-7 の合計は 40、実機の条件 06-12 は 10。【必須】でないのは 06-8・06-11・C3 の計15点）

### criteria.md・人の決定との対応

| 元の条件 | 本基準書 |
|----------|----------|
| 人の決定 D1（5件を残して番号を振り直す） | 06-1・06-2 |
| 人の決定 D2（画面の文言） | 06-3・06-6 |
| 人の決定 D3（フローのコメント・手順書。`Main.txt` の処理は変えない） | 06-9・06-10 |
| 人の決定 D4（docs） | 06-11 |
| 人の決定 D5（追加 0006・0007、リセットで5件） | 06-5・06-6 |
| 人の決定 D6（資産4 の実機1回） | 06-12 |
| criteria 1-2（全件を1ページで表示・件数表示） | 06-4 |
| criteria 1-8（初期データの型・形式） | 06-8 |
| criteria 1-9（新規案件を追加） | 06-5 |
| criteria 1-11（初期データに戻す） | 06-6 |
| criteria スプリント03（詳細画面の14項目） | 06-7 |
| criteria 4-6（CSV：BOM・見出し・14列） | 06-12 |
| 人のレビュー② R1（初期データで `latest.csv` が全件） | 06-12（5件） |
| 共通条件（架空データ・日本語・秘密情報なし・PAD が特定できる `id`/`data-*`） | 06-3 (d)・06-4 (e)・06-13 |

### 証跡ファイル（予定）

| 条件 | ファイル名（`XX` はレビュー回数） |
|------|-----------------------------------|
| 06-1〜06-3, 06-8〜06-11, C1, C4 | `evidence/06-data-5items/review-XX_static.txt`（JSON の比較結果・不一致件数、`git diff --stat`、アクション行どうしの比較、マーカー行以降の比較、Grep 結果と各ヒットの分類、CSV 出力例の照合結果） |
| 06-4〜06-7 | `evidence/06-data-5items/review-XX_06-4.png`〜`review-XX_06-7.png`（`browser_take_screenshot`。必要なら `browser_evaluate` の出力を `review-XX_static.txt` に追記） |
| 06-12 | `evidence/06-data-5items/review-XX_report.txt`（デスクトップ版の報告の要約：日時・PAD の版・貼り直していないこと・時刻・結果。ユーザー名等は書かない）、`evidence/06-data-5items/review-XX_csv.txt`（CSV 照合スクリプトの出力：バイト数・BOM・見出し・行数・申込番号の順・`dummy.json` との不一致件数。CSV のパスは `<ドキュメント>\…` と書く）。渡されたスクリーンショットは `evidence/06-data-5items/review-XX_06-12.png` 等 |

---

## 3. 本スプリントの対象外

- `Main.txt` のアクション（処理）の変更と、PAD への貼り直し（件数は毎回画面から取るため不要。06-9 で処理が変わっていないことだけを見る）
- 資産5（申込状況チェック_通知付き）の実機実行（SharePoint・Teams を含む。手順書の件数の例の修正だけを 06-10 で見る）
- 資産4 の連続実行・実行時間の測定（5件で1回の正常終了と CSV だけを 06-12 で見る。実行時間は報告に書いてもらうが判定には使わない）
- Excel で CSV を開く確認（04c・2026-11-09 の手順で確認済み。CSV の中身は 06-12 で見る）
- `candidates.json` の内容の変更、6件目以降の候補の見直し
- ログイン画面の確認（変更しないため。06-4 の前提としてログインできることだけを使う）
- `verification-log.md`・過去の `sprints/`・`evidence/` の記述の書き換え（変更しないことだけを 06-10 (d) で見る）
- `docs/` の修正そのもの（Planner の担当。06-11 で結果だけを見る）
