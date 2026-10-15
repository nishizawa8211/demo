# スプリント契約 — 04b フロー前半の作り直し：UI 要素定義の同梱（`04b-flow-ui-elements`）

> Evaluator が `docs/criteria.md`（スプリント04・共通条件）、`docs/screens.md`（1-1・S1〜S3）、`docs/flow.md`、`CLAUDE.md`、`sprints/04-flow-scrape/contract.md`・`review-01.md`、`main` ブランチ（`375b341`）の `flows/application-check/Main.txt`・`README.md`、人が PAD でコピーした見本 `input/pad-sample.txt`（既定セレクター）・`input/pad-sample-custom.txt`（カスタムセレクター）の構造をもとに作成。
> 本契約は Evaluator と Generator の合意であり、スプリント中は変更しない。

---

## 0. 目的と判定ルール

**目的**：`flows/application-check/Main.txt` を PAD がコピー時に出力する形式（アクション行＋`# [ControlRepository][PowerAutomateDesktop]`＋JSON）にし、**PAD デザイナーに貼り付けるだけで UI 要素（U1〜U22）も登録される**ようにする。フローの処理内容（スプリント04 の合格条件 4-1〜4-11）は変えない。

| 項目 | 内容 |
|------|------|
| 合格ライン | **80点以上 かつ【必須】条件（4b-1〜4b-5, 4b-7, 4b-8, C1, C4）がすべて合格** |
| スコア | 各条件は全部満たして合格（部分点なし）。合格した条件の重みの合計（満点100） |
| 差し戻し上限 | **3回**（review-01〜03。3回で不合格なら停止して人に報告） |
| 未確認の扱い | 確認できなかった項目は「未確認」とし、不合格扱い |
| 判定の根拠 | (1) `flows/` の定義テキスト・手順書の記載（Read・Grep による机上確認）、(2) Evaluator が scratchpad に置く Node スクリプトによる `Main.txt` のパース結果（JSON・Repository 文字列のパース、画面・UI 要素・セレクターの列挙、`appmask[...]` 参照との突き合わせ、見本との比較）。スクリプトの出力は証跡として `evidence/` に保存する。推測では判定しない |
| 範囲外 | **PAD 実機での貼り付け確認**（UI 要素が実際に登録されるか、スクリーンショット無しで取り込めるか、`%CurrentNo%` を含むカスタムセレクターが実行時に解決されるか）は Evaluator では実行確認できないため、**人のレビュー②** で確認する |
| 証跡 | `evidence/04b-flow-ui-elements/review-XX_<条件番号>.txt` 等（スクリプト出力・Grep 結果）。画面照合を行った場合のスクリーンショットは `browser_take_screenshot` の filename にリポジトリのルートからのパス `evidence/04b-flow-ui-elements/review-XX_<条件番号>.png` で指定する |

---

## 1. 採点時の前提

| 項目 | 内容 |
|------|------|
| ブランチ | `sprint/04b-flow-ui-elements`（`main` の `375b341` から作成） |
| 採点対象 | `flows/application-check/` 配下（`Main.txt`・`README.md`。ファイルを追加した場合はそれも） |
| 比較の基準（スプリント04 時点） | `git show main:flows/application-check/README.md` の「UI 要素表」（U1〜U22：画面名・要素名・セレクター・`#` が使えない場合）と「7. アクション表」、`git show main:flows/application-check/Main.txt` |
| 見本 | `input/pad-sample.txt`・`input/pad-sample-custom.txt`（git 管理外。14万字あるため全文は読まず、スクリプトで構造・キー・値を取り出して比較する） |
| `mock/` | 本スプリントで変更しない。`git diff main -- mock` で差分が無いことを確認する |
| 「アクション行」の定義 | `Main.txt` のうち `# [ControlRepository][PowerAutomateDesktop]` の行より前の部分で、`#` コメント・空行・`END` を除いた行（スプリント04 の 4-3 と同じ数え方。マーカー行以降の JSON はアクション行に数えない） |
| 後片付け | Playwright MCP を使った場合は、`evidence/` 直下に自動保存された `page-*.yml`・`console-*.log` を削除し、リポジトリのルート直下に `.png` が残っていないことを確認する。サーバーは自分が起動したバックグラウンドタスクだけを止める。`browser_close` |

---

## 2. 合格条件

| # | 合格条件（観察で判定できる文） | 確認方法 | 重み |
|---|-------------------------------|----------|------|
| 4b-1 | 【必須】**形式とパース**：`Main.txt` が UTF-8 のテキストで、アクション行の後に `# [ControlRepository][PowerAutomateDesktop]` の行が **ちょうど1回** あり、その行の後からファイル末尾までが1つの JSON として `JSON.parse` できる（マーカー行の後に JSON 以外のアクション行が無い）。JSON の最上位は見本と同じく `ControlRepositorySymbols`（要素1個）・`ImageRepositorySymbol`・`ConnectionReferences` を持つ。`ControlRepositorySymbols[0]` は `Name` が `appmask`、`Repository` が文字列で、**その文字列も `JSON.parse` でき**、`Screens`（配列）と `Version` を持つ。`ImportMetadata` は見本と同じローカル（`Type: "Local"`・`DesktopType: "local"`・`ConnectionString: ""`）。`ImageRepositorySymbol.Repository` も文字列として `JSON.parse` でき、`Images` が空配列。`ConnectionReferences` は空配列 | Node スクリプト（パース結果とキー一覧を出力） | 10 |
| 4b-2 | 【必須】**画面・UI 要素の構造が見本と同じ**：(a) 各画面（`Screens[]`）が `Name`・`ElementTypeName: "Web Page"`・`Tag: "domcontainer"`・`ProcessName: "msedge"`・`InstanceId`・`SelectorCount`・`Selectors`（見本と同じ `domcontainer` の要素1個の既定セレクター）・`Controls` を持つ。(b) 各 UI 要素（`Controls[]`）が `Name`・`ElementTypeName`・`Tag`・`InstanceId`・`AutomationProtocol`・`SelectorCount`・`Selectors` を持ち、`SelectorCount` と `Selectors` の個数が一致して **1**。セレクターは `Name: "Default Selector"`・`Ignore: false`・`IsCustom: true`・`IsImageBased: false`・`IsPlaceholderSelector: false`・`IsWindowsInstance: false`・`ImageSelector: null`・`Properties: []`・`CustomSelector`（空でない文字列）を持つ。(c) 画面・UI 要素・セレクターに使われているキーは、すべて見本（2ファイル）の同じ階層に出てくるキーである（見本に無いキーを作っていない）。(d) `InstanceId` はすべて GUID 形式（`8-4-4-4-12` の16進）で、ファイル内で重複せず、見本の `InstanceId` と同じ値が無い。(e) 各 UI 要素の `Tag` が、モックの該当要素のタグ名（U1・U2 `input`、U3・U6・U22 `button`、U4 `table`、U5 `span`、U7 `dl`、U8〜U21 `dd`）と一致する | Node スクリプト（見本のキー集合との差分、GUID 形式・重複・見本との一致の有無、Tag の一覧を出力）。Tag は `mock/*.html`・`mock/js/*.js` を Read で照合 | 10 |
| 4b-3 | 【必須】**参照と定義の一致**：`Main.txt` のアクション行に出てくる `appmask['X']['Y']` の組（重複を除く）と、Repository に定義された「画面 `Name` × UI 要素 `Name`」の組が **完全に一致** する（参照されているのに定義が無い組が0件、定義されているのに参照されない組が0件）。画面は `LoginPage`・`ListPage`・`DetailPage` の3つ、UI 要素は計22個で、画面名・要素名がスプリント04 の UI 要素表 U1〜U22 と大文字小文字・ハイフンまで同じ。同じ画面内で同じ要素名が重複していない | Node スクリプト（参照の集合・定義の集合・差分を出力）・`git show main:flows/application-check/README.md` の UI 要素表と照合 | 15 |
| 4b-4 | 【必須】**セレクターの内容**：22個の UI 要素すべてで `IsCustom: true` かつ `CustomSelector` が、スプリント04 の UI 要素表の同じ No の「セレクター」列または「`#` が使えない場合」列の文字列と **一致** する（JSON のエスケープを戻した後の文字列で比較。U6 は `button[data-action="detail"][data-application-no="%CurrentNo%"]` で、変数 `%CurrentNo%` をそのまま含む）。すべての `CustomSelector` が `docs/screens.md` 1-1・S1〜S3 の業務用 `id` / `data-*` と要素名だけでできており、表示テキスト（`:contains`・`Text=` 等）、行番号・順番（`nth-child`・`:eq(`・`:first` 等）、CSS クラス（`.xxx`・`Class=`）、階層位置の連鎖（` > ` 等）、デモ操作エリア（`#demo-tools`・`demo-` で始まる `id`・`data-demo-action`）を含まない | Node スクリプト（22個の CustomSelector を一覧出力し、基準表との一致・禁止パターンの Grep 結果を出力） | 15 |
| 4b-5 | 【必須】**見本の実データを持ち込まない**：デコードした Repository 全体と `Main.txt` 全文に、見本の行固有の値・長い表示テキスト・自動生成の階層情報が無い。具体的には次の文字列が **0件**：`DM-20`（申込番号）、`detail-button-`（行ごとに変わる id）、`Button '詳細'`・`Body '`・`Main content '`・`Section '`（見本の自動生成の要素名・表示テキスト）、`business-area`・`table-wrap`（見本の階層に出てくる id・クラス）、見本の `ScreenshotPath`（`controlRepo-screenshots\…`）と `InstanceId`。UI 要素の `Name` は U1〜U22 の要素名そのもので、画面の `Name` は 4b-3 の3つ（見本の `Web Page 'http://…'` のような自動生成名を画面名・要素名に使わない）。各セレクターの `Elements` を持つ場合、その中の属性で `Ignore: false` のものは `Id` か `data-*` だけで、値は 4b-4 の CustomSelector と矛盾しない | Node スクリプト（各文字列の件数、`Elements` の `Ignore: false` 属性の一覧を出力） | 10 |
| 4b-6 | **スクリーンショットの扱い**：見本の `ScreenShot`（Base64 PNG）を流用しない。画面・UI 要素の `ScreenShot` は「キーを省く／`null`／空文字」のいずれか、またはすべて同じ小さなダミー画像（Base64 をデコードすると PNG の先頭 `89 50 4E 47`、2KB 以下）。`ScreenshotPath` は省くか `null`。どの扱いにしたか、その結果 PAD の UI 要素ペインでプレビュー画像が表示されないこと、取り込みでスクリーンショットが必須と判明した場合の対処（4b-7 の予備手順へ進む、または PAD 上で UI 要素を開いて取り込み直す）が README に書かれている | Node スクリプト（各 `ScreenShot` の有無・長さ・先頭バイト、見本の Base64 との一致の有無）・Read（README） | 5 |
| 4b-7 | 【必須】**README の更新**：README（`flows/application-check/README.md`）が次を満たす。(1) 「2. 準備」の UI 要素の登録が **貼り付けで自動的に登録される** 手順に変わり、貼り付け前に UI 要素を手で登録する手順（旧 2-2 の8ステップ）が通常の手順から外れている。「3. 貼り付け手順」の「2-2 の UI 要素をすべて登録しておく」も削除・変更されている。(2) 貼り付け手順に、`Main.txt` を **末尾の `# [ControlRepository][PowerAutomateDesktop]` と JSON まで含めて全文** コピーすること、新しいフロー（または同じ名前の UI 要素が無いフロー）に貼ること、貼り付け後に［UI 要素］ペインで `LoginPage`・`ListPage`・`DetailPage` の3画面・22要素ができていることと、U6（`detail-button`）を開いてカスタムセレクターに `%CurrentNo%` が残っていることを確かめる手順がある。(3) UI 要素表（U1〜U22：画面名・要素名・セレクター・用途）が確認用として残っている。(4) **予備手順**：貼り付けで UI 要素が登録されない・エラーになる場合に、UI 要素を手で登録してから（旧 2-2 と同等の具体さ：［UI 要素の追加］→ Ctrl＋クリック → 画面名・要素名の変更 → セレクター ビルダーのテキスト エディターで表のセレクターに置き換え）アクションを貼り付ける、またはアクション表から手作業で作る手順が残っている。(5) 「レビュー②で要確認」に「貼り付けだけで UI 要素が登録されること」「スクリーンショット無し（またはダミー）で取り込めること」が追加されている。(6) `Main.txt` 冒頭のコメントに「UI 要素は貼り付け前に手で登録する」旨の記述が残っていない | Read（README の該当節・`Main.txt` 冒頭） | 10 |
| 4b-8 | 【必須】**回帰（スプリント04 の 4-1〜4-11）**：スプリント04 の合格条件 4-1〜4-11 が、本スプリント後の `flows/` でも引き続き満たされる。確認は次のとおり：(a) アクション行（1 の定義）を `main` の `Main.txt` と比べ、変更が無い、または変更があっても README のアクション表と同じ順・同じ数で1対1に対応し設定値が食い違わない（4-3）。開始と `END` の数・入れ子、`'''` の対、`%` の対、未定義の変数が無いことを再確認する。(b) 4-4・4-7〜4-11 の判定に使った記述（手順0〜4 と 7 の順序、`LOOP FOREACH CurrentNo IN ApplicationNos`、詳細ボタンのクリックで遷移、`data-loaded` 待機の `FOR 30`、14項目の順、CSV 2ファイルの設定、`ErrorEnd` とメッセージ文言）が残っている。(c) README の 4-2 の8節（前提・準備・貼り付け・変数・実行・エラー時・アクション表・CSV 出力例）がそろっている（準備の UI 要素の節は 4b-7 の形でよい）。(d) 4-5・4-6：`git diff main -- mock` が空で、全セレクター（22個の CustomSelector と JS 内の `#application-tbody tr[data-application-no]`）がスプリント04 review-01 で実画面照合済みの文字列と同じであれば、4-6 の照合結果を引き継ぐ。同じでないセレクターがある場合は、そのセレクターだけ Playwright MCP で該当画面を開き `document.querySelectorAll` の件数（スプリント04 契約 4-6 (a) と同じ基準）を確認する | `git diff main -- flows/application-check/Main.txt`・Node スクリプト（アクション行の抽出と数、構文チェック）・Read・Grep。必要な場合のみ Playwright MCP | 20 |
| 4b-9 | 共通条件 C1・C3・C4（下表。C1・C4 は【必須】） | 下表のとおり | 5 |

### 共通条件（4b-9 の内訳）

| # | 条件 | 確認方法 |
|---|------|----------|
| C1 | 【必須】`flows/` 内のファイル（デコードした Repository を含む）に実在の社名・人名・番号・システム名・ロゴが無く、データ例は `mock/data/dummy.json` の架空データのみ。対象システム名は「申込管理システム（デモ）」 | Read・Grep・Node スクリプト |
| C3 | 手順書・メッセージ文言・コメントが日本語（PAD のアクション名・構文のキーワード・変数名・セレクター・JSON のキーは英語可） | Read |
| C4 | 【必須】`flows/` 内のファイル（デコードした Repository を含む）に秘密情報が無い：URL は `http://localhost:8080` のみ、ID/PW はダミー値 demo-user / demo-pass のみ、`ImportMetadata.ConnectionString` は空、アクション行に `TargetDesktop` 等の接続情報を含める場合も見本と同じローカル（`ServerAddress` が空）で、コンピューター名・ユーザー名・ユーザー名を含むパス（`C:\Users\<名前>` 等）・テナント／サイト URL・チャット ID・トークン・メールアドレスが無い | Grep（`http`・`@`・`C:\\Users`・`ServerAddress`・`ConnectionString`・`token` 等）・Node スクリプト |

- C1・C4 は【必須】のため、どちらかが不合格の場合はスコアに関係なく不合格とする（4b-9 の5点も失う）。C3 のみ不合格の場合は 4b-9 の5点を失う。

| 重みの合計 | 100 |
|-----------|-----|

### criteria.md・スプリント04 契約との対応

| 元の条件 | 本契約 |
|----------|--------|
| criteria 4-1 成果物がある（定義テキストと手順書） | 4b-1（形式）＋ 4b-7（手順書）＋ 4b-8 (a)(c) |
| criteria 4-3 セレクター方針 | 4b-4（CustomSelector）＋ 4b-5（見本の値を持ち込まない）＋ 4b-8 (d) |
| criteria 4-2・4-4〜4-7 | 4b-8 (b)（スプリント04 の判定を回帰確認） |
| criteria 4-8 C4 | 4b-9（C1・C3 を追加、C4 は【必須】） |
| スプリント04 契約 2-2「UI 要素リポジトリの定義を含める場合はセレクターが UI 要素表と一致」 | 4b-3・4b-4 |

### 証跡ファイル（予定）

| 条件 | ファイル名（`XX` はレビュー回数） |
|------|-----------------------------------|
| 4b-1〜4b-6, C1, C4 | `evidence/04b-flow-ui-elements/review-XX_parse.txt`（パーススクリプトの出力：キー一覧、画面・UI 要素・CustomSelector の一覧、参照と定義の差分、禁止文字列の件数、ScreenShot の扱い、InstanceId の確認結果） |
| 4b-8 | `evidence/04b-flow-ui-elements/review-XX_4b-8.txt`（アクション行の数・`main` との差分の要約・構文チェック結果） |
| 4b-8 (d) で画面照合した場合 | `evidence/04b-flow-ui-elements/review-XX_4b-8d.png` |

---

## 3. 本スプリントの対象外（人のレビュー②等で確認）

- **PAD デザイナーへの実際の貼り付け**：UI 要素が自動で登録されるか、スクリーンショット無し（またはダミー）で取り込めるか、カスタムセレクターと `%CurrentNo%` が実行時に機能するか（人のレビュー②：R1・R6 の前提として確認）
- PAD での実行・出力 CSV の確認（人のレビュー②：R1・R5・R6・R7）
- PAD のアクション名・列挙値・JSON のキーの正確な意味（見本との構造一致までを本スプリントで確認する）
- 手順5〜6（スプリント05）
