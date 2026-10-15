# Review 01 — 04b フロー前半の作り直し：UI 要素定義の同梱（`04b-flow-ui-elements`）
判定: 合格（スコア 100/100、合格ライン 80 かつ【必須】条件 4b-1〜4b-5・4b-7・4b-8・C1・C4 がすべて合格）

- 対象：ブランチ `sprint/04b-flow-ui-elements`、コミット `8a538ec`（`flows/application-check/Main.txt`・`README.md`）
- 比較の基準：`main`（`375b341`）の `Main.txt`・`README.md`（UI 要素表 U1〜U22・アクション表）
- 見本：`input/pad-sample.txt`・`input/pad-sample-custom.txt`（スクリプトで構造だけを取り出して比較。全文は読んでいない）
- 確認方法：Evaluator が scratchpad に置いた独自スクリプト（`eval04b/eval-parse.js`・`eval04b/eval-4b8.js`。Generator の `check-main.js` は使っていない）と Read・Grep
- Playwright MCP：使っていない。4b-8 (d) の条件（`mock/` の差分なし・全セレクターがスプリント04 と同じ文字列）を満たしたため、スプリント04 review-01 の 4-5・4-6 の照合結果を引き継いだ（契約どおり）。サーバーの起動や画面のスクリーンショット取得もしていない
- 範囲外：PAD 実機への貼り付け（UI 要素が実際に登録されるか、ダミー画像で取り込めるか、`%CurrentNo%` が実行時に置き換わるか）は人のレビュー②で確認する

| # | 合格条件 | 結果 | 根拠(evidence) | 指摘 |
|---|----------|------|----------------|------|
| 4b-1 | 【必須】形式とパース（10） | 合格 | `review-01_parse.txt`「4b-1」：UTF-8（往復一致・U+FFFD なし・BOM なし）、マーカー行は115行目の1回だけ。その次の行から末尾までを `JSON.parse` できる。最上位キーは `ControlRepositorySymbols`（1個）・`ImageRepositorySymbol`・`ConnectionReferences`。`Name: appmask`、`Repository` は文字列で、パースすると `Screens`（配列）・`Version: 1`。`ImportMetadata` は見本と完全一致（`Type: Local`・`DesktopType: local`・`ConnectionString: ""`）。`ImageRepositorySymbol.Repository` はパースでき `Images: []`。`ConnectionReferences: []` | なし（改行は LF。見本の `input/pad-sample.txt` も CR を含まず LF のため、見本と同じ） |
| 4b-2 | 【必須】画面・UI 要素の構造が見本と同じ（10） | 合格 | `review-01_parse.txt`「4b-2」：(a) 3画面とも `Web Page`・`domcontainer`・`msedge`。セレクターは見本と同じキーで、`domcontainer` の要素1個・`IsCustom: false`。(b) 22要素とも必須キーがそろい、`SelectorCount` 1・`Selectors` 1個。セレクターの固定値（`Default Selector`・`IsCustom: true` 等）の食い違いは0件。(c) 見本に無いキー・階層は0件（見本にあって Main に無いのは `ScreenshotPath` だけ）。(d) InstanceId 25個とも GUID 形式で、重複なし。見本の GUID（4個）と一致するものも無い。(e) Tag は期待値と全件一致。mock での照合：`login.html` の input×2・button、`list.html` の table・span、`list.js` の `createElement('button')`、`detail.html` の dl・dd×14・button（`review-01_4b-8.txt` 末尾） | 申告1（`ElementTypeName` の値）：契約 (c) で確認するのは「キー」なので、値が見本に無いこと（`Input text`・`Definition description` 等。見本の値は `Web Page`・`Button` だけ）は不合格の理由にならない。README R-21 にレビュー②の確認事項として書かれているため、それで足りると判断した |
| 4b-3 | 【必須】参照と定義の一致（15） | 合格 | `review-01_parse.txt`「4b-3」：参照22組（重複を除く）と定義22組の差分は、どちら向きも0件。定義内の重複も0件。画面は `LoginPage`・`ListPage`・`DetailPage`（要素は3・3・16個）。main の UI 要素表（22行）とも大文字小文字を区別して差分0件 | なし |
| 4b-4 | 【必須】セレクターの内容（15） | 合格 | `review-01_parse.txt`「4b-4」：22要素とも `IsCustom: true` で、CustomSelector は main の表の「セレクター」列と一致（不一致0件）。U6 は `button[data-action="detail"][data-application-no="%CurrentNo%"]`。禁止パターン（`:contains`・`Text=`・`nth-`・`:eq(`・`:first`/`:last`・クラス・`Class=`・`>`・`demo-tools`・`#demo-`・`data-demo-action`）はどれも0件。使っている id / data-* は screens.md にある（`field-*` は screens.md S3 の `id="field-<キー>"` の規則どおり） | なし |
| 4b-5 | 【必須】見本の実データを持ち込まない（10） | 合格 | `review-01_parse.txt`「4b-5」：`DM-20`・`detail-button-`・`Button '詳細'`・`Body '`・`Main content '`・`Section '`・`business-area`・`table-wrap`・`controlRepo-screenshots`・`Web Page '` は、デコードした Repository にも Main.txt 全文にも0件。見本の ScreenshotPath・InstanceId も0件。要素名・画面名は U1〜U22 の名前そのもの。各要素の `Elements` は1個で、`Ignore: false` の属性は `Id` だけ（U6 は0個）。値はどれも CustomSelector に含まれていて食い違わない | なし |
| 4b-6 | スクリーンショットの扱い（5） | 合格 | `review-01_parse.txt`「4b-6」：25個（画面3・要素22）とも同じ1種類の値。デコードすると69バイトで、先頭は `89 50 4E 47`。見本の画像とは一致しない。`ScreenshotPath` はすべて省略。README 2-2「スクリーンショットの扱い」（53〜59行）に、ダミー画像にしたこと、プレビュー画像が出ないこと、必須と分かった場合の対処（3-1 の予備手順に進む／取り込み直す）が書かれている | 申告2：契約で認めているダミー画像の扱いに当たる。申告4（［UI 要素の置換］）は下の「改善提案」を参照（不合格の理由にはしない） |
| 4b-7 | 【必須】README の更新（10） | 合格 | Read（README 37〜131行・369〜395行）と `review-01_4b-8.txt` の Grep：(1) 2-2 を「貼り付けで自動的に登録される」に変え、手で登録する8ステップは 3-1 の予備手順に移した。「すべて登録しておく」は0件。(2) 3 の 1〜4 に、新しいフローに貼ること、マーカー行と JSON まで全文コピーすること、［UI 要素］ペインで3画面・22要素（3・3・16）を確かめること、U6 を開いて `%CurrentNo%` が残っているのを確かめることが書かれている。(3) UI 要素表 U1〜U22 が確認用として残っている。(4) 3-1 に［UI 要素の追加］→ Ctrl＋クリック → 名前の変更 → テキスト エディターでセレクターを置き換える手順と、アクション表から手作業で作る手順がある。(5) R-19（貼り付けだけで登録される）・R-20（ダミー画像で取り込める）を追加。(6) Main.txt 冒頭1〜4行に「手で登録」の記述は無い | なし |
| 4b-8 | 【必須】回帰（スプリント04 の 4-1〜4-11）（20） | 合格 | `review-01_4b-8.txt`：(a) アクション行は main と同じ84行で、差分0件。変わったのはコメント行（冒頭の1行を2行に置き換え）だけ。開始と END の対応、`'''` の数（140・偶数）、`%` が奇数の行（0件）、未定義の変数（0件）に問題なし。(b) Step0〜4 のブロック、`LOOP FOREACH CurrentNo IN ApplicationNos`、`detail-button` のクリック、`FOR 30` の待機3か所、14項目の順、CSV 2ファイル、`ErrorEnd`（GOTO 7件・LABEL 1件）、メッセージは main と同じ件数で残っており、手順0〜4・7 の順序も保たれている。(c) README の 1〜8 節がそろっている。4〜9 節は main から変更なし（diff のハンクで確認）。(d) `git diff main -- mock` は空。CustomSelector 22個と JS 内の `#application-tbody tr[data-application-no]` は、スプリント04 で照合済みの文字列と同じ。そのため、スプリント04 review-01 の 4-5・4-6（合格）をそのまま引き継いだ | なし |
| 4b-9 | 共通条件 C1・C3・C4（5） | 合格 | 下の内訳を参照 | なし |
| C1 | 【必須】実在の情報なし | 合格 | `review-01_parse.txt`「C1 / C4」・Read：今回増えたのは UI 要素名・セレクター・`ローカル コンピューター`・ダミー画像だけで、実在の社名・人名・番号・システム名は無い。見本由来の申込番号（`DM-20`）も0件 | なし |
| C3 | 日本語 | 合格 | Read：README の追加部分と Main.txt の追加コメントは日本語。英語は JSON のキー・PAD の値・セレクターだけ | なし |
| C4 | 【必須】秘密情報なし | 合格 | `review-01_parse.txt`「C1 / C4」：URL は `http://localhost:8080`（README は `/login.html` を含む）だけ。メールアドレス、`C:\Users`、ユーザー名、`token` はいずれも0件。`ServerAddress` と `TargetDesktop` は使っていない。`ConnectionString` は空。ID/PW は demo-user / demo-pass だけ | なし |

**合計：10＋10＋15＋15＋10＋5＋10＋20＋5＝100/100**

## Generator への指摘（不合格項目のみ、再現手順つき）

なし（全条件合格）。

## 改善提案（任意。合否には影響しない）

1. **［UI 要素の置換］のメニュー名（申告4）**：README 2-2 の「スクリーンショットの扱い」（59行）に、PAD 上で確かめていないメニュー名が書かれている。「等」が付いており、予備手順（3-1）という別の道もあるため不合格にはしない。ただし、レビュー②で確かめられるように、R-20 か R-21 に「取り込み直すときのメニュー名（［UI 要素の置換］）が PAD の表示と合っているか」を加えるとよい。
2. **2-2 本文（45行）の言い切り**：「PAD が UI 要素をコピーしたときに出力する形式と同じなので、…貼り付けるだけで UI 要素も登録される」は、まだ確かめていない内容を言い切っている。18行と R-19 で未確認だと断ってはいるが、45行にも「（レビュー②で確認予定。登録されない場合は 3-1）」と添えると誤解が減る。
3. **10 節の表の並び**：R-19〜R-21 が R-16 と R-17 の間にあり、番号順になっていない。見た目だけの問題。
4. **`ElementTypeName`（申告1）**：見本に無い値を使ったことによる影響は、レビュー②の R-21 で確かめる。貼り付けでエラーになる場合の回避策の候補は、見本にある値（`Button`）にそろえるか、PAD で実際に取り込んだ要素の値に合わせること（実機の結果を見てから決めればよい）。
