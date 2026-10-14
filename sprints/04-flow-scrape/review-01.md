# Review 01 — 04 フロー前半（`04-flow-scrape`）
判定: 合格（スコア 100/100、合格ライン 80 かつ【必須】全合格）

- 採点日: 2026-10-14
- 対象: ブランチ `sprint/04-flow-scrape`、コミット `d71de2c`（`flows/application-check/README.md`・`Main.txt`）
- `mock/` の変更: `git diff 60b72aa HEAD -- mock` で差分なし（スプリント03 完了時点の `mock/` で照合）
- 環境: リポジトリのルートで `node mock/server.js`（Bash バックグラウンド起動）、Playwright MCP（Edge）で `http://localhost:8080/` を操作
- 採点開始時のデータ: ログイン（`#login-id`・`#login-password` に入力、`#login-button` クリック）→ 一覧で `#demo-reset-button` → `#demo-reset-confirm-button`（画面操作）で初期20件 → 20件で照合 → `#demo-add-button` 1回（画面操作）で21件（先頭 `DM-2026-0021`、11行目 `DM-2026-0011`、末尾 `DM-2026-0001`）→ 21件で照合・通し確認。データ準備に API は使っていない
- 正解データ: 各確認時点で画面から `fetch('/api/applications')` を取得
- 採点終了時: 画面からリセットし初期20件に戻した（`/api/applications` 20件・`data-count="20"`、`git status` で `mock/` に差分なし）。`browser_close`、サーバー停止（`/login.html` への接続不可を確認）。`evidence/` 直下の `page-*.yml`・`console-*.log` を削除し、ルート直下に `.png` がないことを確認

| # | 合格条件 | 結果 | 根拠(evidence) | 指摘 |
|---|----------|------|----------------|------|
| 4-1 | 【必須】ファイル構成・UTF-8・フロー名・相対リンク・スプリント05 の追加位置（5） | 合格 | `flows/application-check/` に `README.md`・`Main.txt` のみ（`file` で両方 UTF-8 Unicode text）。サブフローは Main のみと明記。フロー名「申込状況チェック_デモ」（README 3行目・2-1）。ファイル構成表に `./README.md`・`./Main.txt` の相対リンク。追加位置は README 9「No.78（`latest.csv` の書き出し）の後、No.79（Web ブラウザーを閉じる）の前」、`Main.txt` 103行目に同じ位置のコメント行 | - |
| 4-2 | 【必須】手順書の8節（10） | 合格 | (1) 前提: PAD・Edge・Edge 拡張機能（入れ方つき）・`node mock/server.js`・`http://localhost:8080`。(2) 準備: 2-1 フロー作成、2-2 UI 要素の登録手順8ステップ（自動生成セレクターを全部消し表の形に貼る、複数セレクターは1つに）、UI 要素表 U1〜U22（画面名・要素名・画面・セレクター・`#` が使えない場合・用途）。(3) 貼り付け手順7ステップと「貼り付けに失敗した場合はアクション表 No.1 から手作業で作る」。(4) 変数表（`BaseUrl`・`LoginId`・`LoginPassword`・`RunDateTime`・`RunStamp`・`WorkFolder`・`HistoryFileName`・`ApplicationNos`・`CurrentTable` ＋ 補助変数。内容・設定方法・初期値）、`LoginPassword` を［機密としてマーク］。(5) 実行手順（起動→デモ操作でデータ準備→実行→出力場所・ファイル名・行数・BOM 確認方法）。(6) E0〜E13 のメッセージと対処。(7) アクション表 No.1〜84。(8) CSV 出力例（見出し＋4行） | - |
| 4-3 | 【必須】アクション表と定義テキストの1対1・机上の構文チェック（10） | 合格 | `Main.txt` のアクション行（`#`・空行・`END` 除く）を数えると84行で、表 No.1〜84 と同じ順に1対1対応（不一致0件）。設定値（セレクター／UI 要素名・入力値・タイムアウト30秒／60秒・`yyyyMMdd_HHmm`・`File.CSVEncoding.UTF8`・カンマ・上書き・`%WorkFolder%\%HistoryFileName%`・`%WorkFolder%\latest.csv`）の食い違い0件。構文: 開始（`BLOCK`5・`ON BLOCK ERROR`5・`IF`3・`LOOP FOREACH`1・`ON ERROR`1＝15）と `END`15 が一致し入れ子も対応。`'''` は140個（偶数）で全リテラルが閉じている。`%` が奇数個の行0。使用変数はすべて先行行で `SET`／`=>` により生成。`appmask[...]` の参照は22種類で UI 要素表 U1〜U22 と画面名・要素名とも一致 | - |
| 4-4 | 【必須】手順0〜4 の順、手順7 のブラウザを閉じる（5） | 合格 | 表の手順列と `Main.txt`: 0（No.4〜17: 日時取得・`yyyyMMdd_HHmm`・`申込状況_%RunStamp%.csv`・フォルダが無ければ作成・14列テーブル）→ 1（No.22 `LaunchEdge`＝新しいインスタンスで `%BaseUrl%/login.html`、No.23 `#login-id` 待機、No.25〜27 入力・クリック、No.29 一覧 `data-loaded` 待機）→ 2（No.34〜35 全件取得、No.37〜41 `data-count` 照合）→ 3（No.45〜72）→ 4（No.77〜78）→ 7（No.79 ブラウザを閉じる、No.80 終了） | - |
| 4-5 | 【必須】セレクターの書き方（10） | 合格 | 使用セレクター: `#login-id`・`#login-password`・`#login-button`・`#application-table[data-loaded="true"]`・`#application-count`（属性 `data-count`）・`button[data-action="detail"][data-application-no="%CurrentNo%"]`・`#application-detail[data-loaded="true"]`・`#field-<キー>` 14個・`#back-to-list-button`・JS 内の `#application-tbody tr[data-application-no]`（属性 `data-application-no`）。代替列も `input[Id="login-id"]` 等の要素名＋`Id` のみ。Grep: `Main.txt` に `nth`・`eq(`・`contains`・`class`・` > `・`Text=`・`:first` なし、`demo` は `demo-user`/`demo-pass` のみ。README の `:eq()`・`html > body` は「消す対象」の説明、`#demo-tools` は「操作しない」の説明のみ | - |
| 4-6 | 【必須】実画面照合・机上の通し確認（10） | 合格 | (a) ログイン画面: `#login-id`・`#login-password`・`#login-button`・`[Id="login-id"]` 各1。一覧20件: `#application-table[data-loaded="true"]`1、`#application-count`1（`data-count="20"`）、行セレクター20、詳細ボタンセレクターは20番号すべて各1、No.34 の JS をそのまま実行した結果が `/api/applications` の番号列と一致、代替 `table[Id=...]`・`span[Id=...]` 各1。一覧21件: 行21＝`data-count` 21、詳細ボタン21番号すべて各1、表示順＝API 順。詳細3件: `#application-detail[data-loaded="true"]`・`#field-*`14個・`#back-to-list-button` 各1（`dl[Id=...]` も1）。どのセレクターも `#demo-tools` 内の要素0。(b) 手順書どおりに操作: ログイン → 一覧 `data-loaded` → `DM-2026-0021`・`DM-2026-0011`・`DM-2026-0001` の詳細ボタン → 各 `data-loaded="true"`・`#field-applicationNo`＝対象番号 → 14項目を `textContent` で取得、正解データとの不一致0件（`0021` は未定・未採番、`0011` は未定・備考空 `""`）→ `#back-to-list-button` で一覧 `data-loaded="true"`・全21件。参考として21件すべての14項目も画面から取得し不一致0件（期待値 CSV に保存）。コンソール error/warning 0件。`review-01_4-6a.png`〜`4-6f.png`、`review-01_4-6_expected.csv`（見出し＋21行・14列・UTF-8 BOM 付き・CRLF） | 中間行の1回目のクリックで Playwright MCP 側が5秒タイムアウト（画面は一覧のまま、`data-loaded="true"`）。再実行で遷移しコンソールエラーもないため、ツール側の一時的な事象として扱った |
| 4-7 | 【必須】全件ループ（10） | 合格 | No.45 `LOOP FOREACH CurrentNo IN ApplicationNos`（手順2 の取得結果）。Grep: `Main.txt` に `DM-20`・`20`/`21` の件数リテラル・回数指定 LOOP・`detail.html` なし。遷移は No.47 の U6（`button[data-action="detail"][data-application-no="%CurrentNo%"]`）クリックのみ。各回の最後に No.71 `#back-to-list-button` → No.72 一覧 `data-loaded` 待機。追加案件も同じループで取得される旨を README 5-2・7「全件ループについて」に記載 | - |
| 4-8 | `data-loaded` 等の出現待ち・タイムアウト30秒・固定秒の待機なし（5） | 合格 | 待機は No.23（`#login-id`）・No.29／72（`#application-table[data-loaded="true"]`）・No.49（`#application-detail[data-loaded="true"]`）の4か所で、すべて `ElementToAppear … FOR 30`。`WAIT` の Grep 該当はこの4行のみ（固定秒の `WAIT <秒>` なし）。README 7 で `FOR 30` がタイムアウトであることを説明 | - |
| 4-9 | 【必須】14項目の取得・順番・空行なし・申込番号の確認（10） | 合格 | No.51 で `#field-applicationNo` を取得 → No.52 で `CurrentNo` と比較（不一致は E10 で停止）→ No.56〜68 で残り13項目を `Own Text` で取得 → No.69 で14変数を screens.md 1-2 の順に位置で並べて追加（空の備考も列がずれない）。見出し（No.16）は screens.md 1-2 と同じ順・同じ項目名。作成時の空行は No.17 で削除。モックの `dd` は `textContent` で値のみ（子要素なし）なので `Own Text` で表示テキストがそのまま取れる構造 | - |
| 4-10 | 【必須】CSV 出力（10） | 合格 | No.77 `%WorkFolder%\%HistoryFileName%`・No.78 `%WorkFolder%\latest.csv`。両方 `File.CSVEncoding.UTF8`・`IncludeColumnNames: True`・`IfFileExists.Overwrite`・`ColumnsSeparator.Comma`。手順書に設定名「UTF-8」と BOM が付く理由・「BOM なし」を選ばない旨、実行後の確認（Excel／`Format-Hex` で `EF BB BF`、ユーザー名を書かないパス指定）。`yyyyMMdd_HHmm`。`WorkFolder` は `Folder.GetSpecialFolder`（Personal）＋`申込状況チェック_デモ`。`C:\Users` の Grep 該当なし。書き出しは Step4 ブロックのみで、手順0〜3 のエラーは `ErrorEnd` に移動するので書き出されない | - |
| 4-11 | エラー時の扱い（10） | 合格 | 手順ごとに `BLOCK`＋`ON BLOCK ERROR`→`GOTO ErrorEnd`（Step0〜4 の5ブロック）、件数不一致（No.39〜41）・番号不一致（No.52〜54）は `GOTO ErrorEnd`。`ErrorEnd` でメッセージ表示 → `CloseWebBrowser`（`ON ERROR` で失敗しても続行）→ 終了。(a) E1「…モック画面に接続できません。server.js が起動しているか確認してください」、(b) E3「手順1-5：ログイン後に一覧画面が表示されませんでした…」、(c) E6（画面の件数・取得件数・取得した申込番号）、E7〜E12（`%CurrentNo%` を含む。E8 は `#detail-error` の場合を含む）。`Main.txt` の13文言と README 6 の E0〜E13 の文言は一致 | - |
| 4-12 | 共通条件 C1・C3・C4（5） | 合格 | 下表 | - |

### 共通条件（4-12 の内訳）

| # | 条件 | 結果 | 根拠 |
|---|------|------|------|
| C1 | 【必須】架空データのみ・「送配電受付番号」・「申込管理システム（デモ）」 | 合格 | 実在の電力会社名・「株式会社」・「託送」等の Grep 該当なし。CSV 出力例4行は `dummy.json` 初期データ（画面から取得した値）と一致。項目名「送配電受付番号」。対象システム名は「申込管理システム（デモ）」 |
| C3 | 日本語 | 合格 | 手順書・メッセージ・コメントは日本語。英語はアクション名・構文・変数名・セレクターのみ |
| C4 | 【必須】秘密情報なし | 合格 | `http` の該当は `http://localhost:8080` のみ。ID/PW は demo-user / demo-pass のみ。`@`・`C:\`・`token` の該当なし。SharePoint・Teams は「PAD 上で設定し `flows/` には書かない／`<作成時に設定>`」の記述のみで値なし |

### Robin 構文の「レビュー②で要確認」（README 10、R-1〜R-18）の扱い

契約 2-3 により、アクション名の綴り・列挙値・パラメーター名など PAD 固有の細部は本スプリントでは採点しない。判定は 2-1・2-2（アクション表との1対1、机上の構文チェック）で行い、いずれも満たした。推測を含む箇所が手作業での再現を妨げないかは次のとおり確認した。

- ブロックのエラー処理（R-1）: 表 No.1〜3 等で「ブロック エラー発生時」→「例外処理モード：フロー実行を続行する」→「ラベルに移動：`ErrorEnd`」と UI 上の設定で書かれ、3 で設定画面の操作とラベルを先に作る手順もある。テキストが貼れなくても作れる
- ループ外への GOTO（R-2）: 移動先・条件は表 No.39〜41・52〜54 で明確。移動できない場合の直し方（ループ・ブロックを抜けた後で移動する）も記載
- `WAIT … FOR 30`（R-4）: 表で「Web ページのコンテンツを待機・要素が表示される・UI 要素・タイムアウト 30 秒」と UI の設定で書かれている
- パラメーター名（R-5〜R-15）: 表の「主な設定値」に UI 上の項目名と値（例：属性名 `data-count` を直接入力、`Own Text`、カスタム区切り `,`、列名を含める：オン 等）が書かれており、名前の違いがあっても設定内容は一意に決まる

推測を含む箇所はすべて README 10 に列挙済みで、アクション表だけで手作業による再現ができる具体さがあるため、4-3 を不合格にする理由にはならないと判断した。

## Generator への指摘（不合格項目のみ、再現手順つき）

なし。

### 範囲外・参考（採点には影響しない。レビュー②や次スプリントで見るとよい点）

1. 表 No.25・26（テキスト フィールドへの入力）の「主な設定値」に、`Main.txt` にある `WaitForPageToLoadTimeout: 60` が書かれていない（食い違いではなく記載漏れ。PAD の既定値のままでも動作上は問題ない見込み）。
2. 一覧が0件の場合、No.35 のテキストの分割は空文字から1要素のリストを作るため、件数不一致（E6）で止まる。デモでは0件にならないので実害はない。
3. E13（CSV 書き出し）で `latest.csv` だけが失敗すると、履歴ファイルだけ残る（README 6 に記載済み）。
4. 「UTF-8」で BOM が付くかは PAD の版によって選択肢名が異なる可能性がある（README R-12）。レビュー②で `Format-Hex` による確認を必ず行うこと。比較用に `evidence/04-flow-scrape/review-01_4-6_expected.csv`（21件状態の期待値）を置いた。
