# 申込状況チェック_デモ — PAD フロー手順書（スプリント04：手順0〜4）

- フロー名：**申込状況チェック_デモ**（`docs/flow.md` 0）
- 種類：Power Automate Desktop（PAD）のデスクトップフロー1本。クラウドフローは使わない
- 操作対象：モック「申込管理システム（デモ）」（`http://localhost:8080`）。一覧画面のデモ操作エリア（`#demo-tools`）は操作しない
- 本スプリントの範囲：`docs/flow.md` 手順0（初期化）→ 1（Edge 起動・ログイン）→ 2（申込番号の全件取得）→ 3（全件の詳細取得）→ 4（ローカルに CSV 出力）と、手順7 相当の「ブラウザを閉じる」
- スプリント05 で、同じフローに手順5〜6（SharePoint・Teams）を足す（位置は「9. スプリント05 で手順を足す位置」）

## ファイル構成

| ファイル | 内容 | 貼り付け先 |
|----------|------|------------|
| [README.md](./README.md) | この手順書 | — |
| [Main.txt](./Main.txt) | アクション定義テキスト（Robin 構文）＋末尾に UI 要素（U1〜U22）の定義（`# [ControlRepository][PowerAutomateDesktop]` の行と JSON） | PAD デザイナーの **Main** サブフロー（末尾まで全文を貼り付ける） |

- サブフローは Main の1つだけ（ほかのサブフローは作らない）。

> **この手順書の読み方**：`Main.txt` のアクション行は、この PC の PAD（11.2609.183.0）自身の構文解析器とアクション定義ファイルと照合し、**構文エラー 0・アクション名／パラメーター名／列挙値の不一致 0** にしてある（照合の内容と直した箇所は「10-0」）。末尾の UI 要素の定義は、人が PAD でコピーした実物の形式に合わせてあり、項目名の構成も実物と一致している。ただし **PAD に貼り付けての確認と実行はまだしていない**（人のレビュー②で確認する）。PAD の版の違い等で貼り付けられない場合は、**UI 要素を手で登録し（3-1）、「7. アクション表」を上から順に見て、同じアクションを手作業で作れば同じフローになる**ように書いてある。実機でないと確かめられない点は「10-1. レビュー②で要確認」に一覧にした。

---

## 1. 前提

| 項目 | 内容 |
|------|------|
| PC | フロー作成に使う Windows PC（デモも同じ PC） |
| PAD | Power Automate Desktop がインストール済みで、会社のアカウントでサインインしていること |
| ブラウザ | Microsoft Edge |
| PAD の Edge 拡張機能 | 「Microsoft Power Automate」拡張機能が Edge にインストール・**有効化**されていること（PAD の［ツール］→［ブラウザー拡張機能］→［Microsoft Edge］から入れられる） |
| Node.js | モックの起動に使う（外部パッケージは不要） |
| モックの起動 | リポジトリのルートで `node mock/server.js` を実行する（ポート 8080）。止めるときはそのウィンドウで Ctrl+C |
| 対象 URL | `http://localhost:8080`（ログイン画面は `http://localhost:8080/login.html`） |
| ログイン | デモ用のダミー ID/PW（demo-user / demo-pass）。実在の認証情報ではない |

---

## 2. 準備

### 2-1. 新しいフローの作成
1. PAD コンソールで［＋ 新しいフロー］を押す。
2. フロー名に **申込状況チェック_デモ** と入力して［作成］を押す。PAD デザイナーが開く。

### 2-2. UI 要素（貼り付けで自動的に登録される）

`Main.txt` は UI 要素を `appmask['<画面名>']['<要素名>']` の名前で参照する。`Main.txt` の末尾（`# [ControlRepository][PowerAutomateDesktop]` の行とその後の JSON）に、下の表の **3画面・22要素（U1〜U22）の定義** が入っている。PAD が UI 要素をコピーしたときに出力する形式と同じなので、**「3. 貼り付け手順」で全文を貼り付けるだけで UI 要素も登録される**（PAD 実機ではまだ確かめていない。レビュー②で確認予定〔10 の R-19〕。登録されない場合は 3-1）。貼り付けの前に UI 要素を手で登録する必要はない。

- 下の表は **確認用**（貼り付け後に［UI 要素］ペインの内容と見比べる）。貼り付けで登録されない場合だけ、「3-1. 予備手順」で表のとおりに手で登録する。
- 画面名・要素名・セレクターは、大文字小文字・ハイフンまで表のとおり。`Main.txt` 末尾の定義では、どの要素も **カスタム セレクター 1つだけ**（表の「セレクター」列の文字列）になっている。
- 画面（`LoginPage` / `ListPage` / `DetailPage`）は、PAD が既定で作る「Edge のページ（`domcontainer`）」の形にしてある。URL では区別しないので、どの画面の要素も、そのとき Edge に表示されているページから探される。
- セレクターは `docs/screens.md` 1-1・S1〜S3 の業務用 `id` / `data-*` だけで書いてある（表示テキスト・行番号・クラス・階層位置・デモ操作エリアは使わない）。
- PAD のセレクター エディターで `#login-id` のような `#` の書き方が受け付けられない場合は、同じ意味の `input[Id="login-id"]`（要素名＋`Id` 属性）の形に書き換える（例は表の「`#` が使えない場合」列）。

**スクリーンショットの扱い**

- PAD がコピーするときは各画面・各要素の取り込み時のスクリーンショット（画像）が JSON に入るが、`Main.txt` には **実際の画面のスクリーンショットを入れていない**。代わりに、全画面・全要素で同じ **1×1 ピクセルの灰色のダミー画像**（PNG、69 バイト）を入れ、画像ファイルの保存場所（`ScreenshotPath`）は省いている。
- そのため、貼り付け後の［UI 要素］ペインで要素を選んでも **プレビュー画像は表示されない**（灰色の点になる）。セレクターで要素を探すので、フローの実行には影響しない。
- プレビュー画像が欲しい場合や、取り込みでスクリーンショットが必須と分かった場合（貼り付けで UI 要素が登録されない・画像のエラーが出る等）は、次のどちらかにする。
  - 「3-1. 予備手順」に進み、UI 要素を手で登録してから貼り付ける。
  - 貼り付けで登録された要素を［UI 要素］ペインで開き、取り込み直す（モックを表示した状態で要素を右クリック →［UI 要素の置換］等で同じ要素を Ctrl＋クリック）。取り込み直した後は、セレクターが表のセレクター1つだけになっているか必ず確かめる。

**UI 要素表**

| No | 画面名 | 要素名 | 画面（取り込むとき開く画面） | セレクター | `#` が使えない場合 | 用途 |
|----|--------|--------|------------------------------|------------|--------------------|------|
| U1 | LoginPage | login-id | S1 ログイン `/login.html` | `#login-id` | `input[Id="login-id"]` | ログイン画面の表示待ち・ID 入力 |
| U2 | LoginPage | login-password | S1 ログイン | `#login-password` | `input[Id="login-password"]` | パスワード入力 |
| U3 | LoginPage | login-button | S1 ログイン | `#login-button` | `button[Id="login-button"]` | ログインボタンのクリック |
| U4 | ListPage | application-table-loaded | S2 一覧 `/list.html` | `#application-table[data-loaded="true"]` | `table[Id="application-table"][data-loaded="true"]` | 一覧の読み込み完了の待機 |
| U5 | ListPage | application-count | S2 一覧 | `#application-count` | `span[Id="application-count"]` | 件数（属性 `data-count`）の取得 |
| U6 | ListPage | detail-button | S2 一覧（どれか1行の「詳細」ボタンを取り込む） | `button[data-action="detail"][data-application-no="%CurrentNo%"]` | （同じ） | ループ中の申込番号の「詳細」ボタンのクリック |
| U7 | DetailPage | application-detail-loaded | S3 詳細 `/detail.html?no=...`（一覧の「詳細」から開く） | `#application-detail[data-loaded="true"]` | `dl[Id="application-detail"][data-loaded="true"]` | 詳細の読み込み完了の待機 |
| U8 | DetailPage | field-applicationNo | S3 詳細 | `#field-applicationNo` | `dd[Id="field-applicationNo"]` | 申込番号（一致確認にも使う） |
| U9 | DetailPage | field-applicationDate | S3 詳細 | `#field-applicationDate` | `dd[Id="field-applicationDate"]` | 申込日 |
| U10 | DetailPage | field-customerName | S3 詳細 | `#field-customerName` | `dd[Id="field-customerName"]` | お客さま名 |
| U11 | DetailPage | field-supplyPointNo | S3 詳細 | `#field-supplyPointNo` | `dd[Id="field-supplyPointNo"]` | 供給地点特定番号 |
| U12 | DetailPage | field-applicationType | S3 詳細 | `#field-applicationType` | `dd[Id="field-applicationType"]` | 申込種別 |
| U13 | DetailPage | field-capacityBefore | S3 詳細 | `#field-capacityBefore` | `dd[Id="field-capacityBefore"]` | 変更前容量 |
| U14 | DetailPage | field-capacityAfter | S3 詳細 | `#field-capacityAfter` | `dd[Id="field-capacityAfter"]` | 変更後容量 |
| U15 | DetailPage | field-status | S3 詳細 | `#field-status` | `dd[Id="field-status"]` | ステータス |
| U16 | DetailPage | field-assignee | S3 詳細 | `#field-assignee` | `dd[Id="field-assignee"]` | 担当者 |
| U17 | DetailPage | field-siteAddress | S3 詳細 | `#field-siteAddress` | `dd[Id="field-siteAddress"]` | 需要場所住所 |
| U18 | DetailPage | field-desiredDate | S3 詳細 | `#field-desiredDate` | `dd[Id="field-desiredDate"]` | 希望日 |
| U19 | DetailPage | field-scheduledWorkDate | S3 詳細 | `#field-scheduledWorkDate` | `dd[Id="field-scheduledWorkDate"]` | 工事予定日（「未定」もそのまま取得） |
| U20 | DetailPage | field-receptionNo | S3 詳細 | `#field-receptionNo` | `dd[Id="field-receptionNo"]` | 送配電受付番号（「未採番」もそのまま取得） |
| U21 | DetailPage | field-remarks | S3 詳細 | `#field-remarks` | `dd[Id="field-remarks"]` | 備考（空欄は空文字） |
| U22 | DetailPage | back-to-list-button | S3 詳細 | `#back-to-list-button` | `button[Id="back-to-list-button"]` | 一覧へ戻るボタンのクリック |

- 「画面（取り込むとき開く画面）」列は、予備手順で手で登録する場合と、取り込み直す場合に使う。
- U4・U7 は、`table` / `dl` 要素のセレクターに `[data-loaded="true"]` を付けた形（読み込み完了の目印が付くまで「待機」が終わらないようにするため）。
- U6 の `%CurrentNo%` はフローの変数（ループ中の申込番号）。PAD はセレクター内の `%変数名%` を実行時に値に置き換える。この形にしてあるので、件数や並び順が変わっても同じ UI 要素で全行を扱える（手で取り込む場合は、どの行の「詳細」ボタンでもよく、セレクターを表の形に書き換える）。
- UI 要素ではなく JavaScript の中で使うセレクターが1つある：`#application-tbody tr[data-application-no]`（アクション表 No.34。一覧の全行から属性 `data-application-no` を取り出す）。

---

## 3. 貼り付け手順

1. 貼り付け先は、2-1 で作った **新しいフロー**（または ［UI 要素］ペインに `LoginPage`・`ListPage`・`DetailPage` と同じ名前の画面・要素が無いフロー）にする。同じ名前の UI 要素が既にあると、名前が重なって正しく登録されない場合がある。
2. [Main.txt](./Main.txt) をテキスト エディター（メモ帳等）で開き、**Ctrl＋A で全文を選択してコピー**する。**末尾の `# [ControlRepository][PowerAutomateDesktop]` の行と、その後の JSON（最後の `}` まで）も必ず含める**（この部分が UI 要素の定義。途中で切れると UI 要素が登録されない）。先頭の `#` コメント行も含めてよい。
3. PAD デザイナーで **Main** タブ（サブフロー）を開き、ワークスペースの空いている所を一度クリックしてから **Ctrl＋V** で貼り付ける。
4. 右側の **［UI 要素］ペイン** を開き、次を確かめる。
   - 画面が `LoginPage`・`ListPage`・`DetailPage` の **3つ** あり、その下に要素が **計22個**（`LoginPage` 3個・`ListPage` 3個・`DetailPage` 16個）できていること。名前が 2-2 の UI 要素表と同じであること。
   - **U6（`ListPage` の `detail-button`）をダブルクリック** してセレクター ビルダーを開き、カスタム セレクターが `button[data-action="detail"][data-application-no="%CurrentNo%"]` のまま（`%CurrentNo%` が残っている）であること。
   - 何個か（例：U1 `login-id`・U4 `application-table-loaded`）を開き、セレクターが表の「セレクター」列と同じ1つだけであること。
5. 変数ペインに `StepMessage`・`BaseUrl`・`CurrentTable` などの変数ができていること、アクションが「7. アクション表」と同じ順に並んでいることを確かめる（表の No.1〜3 のように、ブロックの開始とそのエラー時の設定は PAD 上では1つのアクションとして表示される。No.83〜85 も同様）。
6. 「4. 変数設定」の **`LoginPassword` を機密としてマーク** する。
7. デザイナー上部の［保存］を押す。
8. エラー ペインに赤いエラーが出ている場合は、該当のアクションをダブルクリックし、「7. アクション表」の設定値どおりに直す（UI 要素名の誤り・列挙値の名前の違いが多い）。

- **UI 要素が登録されない・UI 要素の部分でエラーになる場合**：貼り付けた分を削除し、「3-1. 予備手順」で UI 要素を手で登録してから、もう一度貼り付ける。
- **貼り付けに失敗した場合**（何も貼り付けられない、エラーが多くて直せない等）：貼り付けた分を削除し、「3-1. 予備手順」で UI 要素を登録したうえで、**「7. アクション表」を No.1 から順に見て、同じアクションを左のアクション一覧からドラッグして手作業で作る**。表の「主な設定値」「生成される変数」「エラー時の設定」をそのまま入力すれば、`Main.txt` と同じフローになる。

- 「ブロック エラー発生時」（BLOCK）は、ブロックの中にアクションを入れる入れ物になる。表で「ブロック内」と書いたアクションは、そのブロックの中に入れる。
- ブロックのエラー時の設定（No.2〜3 など）：ブロックのアクションを開き →［例外処理モード］（または［エラー発生時］）で **［フロー実行を続行する］→［ラベルに移動］→ `ErrorEnd`** を選ぶ。ラベル `ErrorEnd`（No.81）は先に作っておくと選べる。

### 3-1. 予備手順：UI 要素を手で登録する（貼り付けで UI 要素が登録されない場合だけ）

通常は不要。貼り付けで UI 要素が登録されない・エラーになる場合に、**2-2 の UI 要素表と同じ画面名・要素名・セレクターで UI 要素を手で登録してから**、アクションを貼り付ける（またはアクション表から手作業で作る）。

**登録のしかた（1要素ごと）**
1. `node mock/server.js` でモックを起動し、Edge で対象の画面を開いておく（一覧・詳細はログインしてから開く。開く画面は表の「画面（取り込むとき開く画面）」列）。
2. PAD デザイナー右側の［UI 要素］ペイン →［UI 要素の追加］を押す。
3. Edge 上で対象の要素にマウスを合わせ、赤枠が出たら **Ctrl＋クリック** で取り込む。
4. 取り込まれた画面（`Web Page '...'` のような名前）を右クリック →［名前の変更］で、表の「画面名」（`LoginPage` / `ListPage` / `DetailPage`）にする。2個目以降の同じ画面の要素は、この画面の下に入る。
5. 取り込まれた要素を右クリック →［名前の変更］で、表の「要素名」にする。
6. 要素をダブルクリックしてセレクター ビルダーを開き、**［テキスト エディター］をオンにする**。
7. 自動生成されたセレクター（`html > body > main > ...` のような階層位置や `:eq()`・クラスを含むもの）を **全部消し**、表の「セレクター」をそのまま貼り付けて［保存］する。
8. セレクターが複数登録されている場合（セレクター一覧に2つ以上ある場合）は、表のセレクター1つだけを残して他は削除する。

**登録した後のアクションの貼り付け**
- 22個すべて登録したら、[Main.txt](./Main.txt) のうち **`# [ControlRepository][PowerAutomateDesktop]` の行より前だけ** をコピーして Main に貼り付ける（末尾の JSON まで貼ると、同じ名前の UI 要素がもう一度登録されようとして重なる）。その後は「3. 貼り付け手順」の 5. 以降と同じ。
- それでも貼り付けられない場合は、「7. アクション表」から手作業で作る（上の「貼り付けに失敗した場合」）。

---

## 4. 変数設定

貼り付け（または手作業での作成）で、下の変数は自動でできる。PAD 上で値を入れる「入力変数」は無い（すべてフローの中で設定する）。

| 変数名 | 内容 | 設定方法（アクション表 No.） | 初期値・例 |
|--------|------|------------------------------|-----------|
| `StepMessage` | エラー時に表示するメッセージ。各手順の前に、その手順で止まったときの文言を入れておく | 変数の設定（No.4 ほか） | 「6. エラー時のメッセージと対処」の文言 |
| `BaseUrl` | モックの URL | 変数の設定（No.5） | `http://localhost:8080` |
| `LoginId` | ログイン ID（ダミー） | 変数の設定（No.6） | `demo-user` |
| `LoginPassword` | パスワード（ダミー）。**機密として扱う** | 変数の設定（No.7）。設定後、変数ペインで `LoginPassword` を右クリック →［機密としてマーク］（Mark as sensitive）。実行ログ・デバッグ表示に値が出なくなる | `demo-pass` |
| `WorkFolderName` | 作業フォルダの名前 | 変数の設定（No.8） | `申込状況チェック_デモ` |
| `RunDateTime` | 実行日時 | 現在の日時を取得（No.9） | 例：2026/10/14 10:30:15 |
| `RunStamp` | ファイル名用の日時（`yyyyMMdd_HHmm`：月は大文字 `MM`、分は小文字 `mm`、時は24時間の `HH`） | datetime をテキストに変換（No.10） | 例：`20261014_1030` |
| `HistoryFileName` | 履歴ファイル名 `申込状況_<RunStamp>.csv` | 変数の設定（No.11） | 例：`申込状況_20261014_1030.csv` |
| `DocumentsFolder` | ドキュメント フォルダのパス（ログイン中のユーザーのもの。パスは直書きしない） | 特別なフォルダーを取得（No.12、ドキュメント） | 例：`<ドキュメント>` |
| `WorkFolder` | 作業フォルダ `<ドキュメント>\申込状況チェック_デモ` | 変数の設定（No.13）。無ければ作成（No.14〜15） | 例：`<ドキュメント>\申込状況チェック_デモ` |
| `CreatedFolder` | 作成したフォルダ（以後は使わない） | フォルダーを作成（No.15） | — |
| `CurrentTable` | 今回取得した全件（14列のデータ テーブル） | 新しいデータ テーブルを作成（No.16）→ 空行の削除（No.17）→ 1件ごとに行を追加（No.69） | 見出し14列・0行で開始 |
| `Browser` | 起動した Edge のインスタンス | 新しい Microsoft Edge を起動する（No.22） | — |
| `ApplicationNosText` | 一覧の申込番号をカンマでつないだテキスト | JavaScript 関数を実行（No.34） | 例：`DM-2026-0020,DM-2026-0019,…` |
| `ApplicationNos` | 申込番号のリスト（一覧の表示順。全件） | テキストの分割（No.35） | — |
| `DataCountText` | 一覧の `#application-count` の属性 `data-count`（テキスト） | 要素の詳細を取得（No.37） | 例：`20` |
| `DataCount` | `DataCountText` を数値にしたもの | テキストを数値に変換（No.38） | — |
| `CurrentNo` | ループ中の申込番号（ループ変数） | For each（No.45） | — |
| `Val_applicationNo` 〜 `Val_remarks`（14個） | 詳細画面から取得した14項目の値（表示テキストのまま） | 要素の詳細を取得（No.51、No.56〜68） | — |
| `ButtonPressed` | メッセージの押されたボタン（以後は使わない） | メッセージを表示（No.82） | — |

- 件数（20件・21件など）や申込番号はどこにも直書きしていない。件数は毎回画面から取得する。
- SharePoint・Teams 関係の変数（`SharePointSite` 等）はスプリント05 で作る。値はその時に PAD 上で設定し、`flows/` には書かない。

---

## 5. 実行手順

1. リポジトリのルートで `node mock/server.js` を実行し、モックを起動する（ウィンドウは開いたままにする）。
2. 必要ならデモ用のデータを用意する：Edge で `http://localhost:8080/login.html` を開いて demo-user / demo-pass でログインし、一覧画面下部の「デモ操作」エリアで［新規案件を追加］（1件ずつ増える）や［初期データに戻す］→［実行する］（20件に戻る）を押す。**これは人が行う操作で、フローはデモ操作エリアを触らない。** 追加した案件は一覧の先頭行に出るが、フローは一覧の全行の申込番号を取得してから1件ずつ処理するので、追加した案件も同じループで取得される。終わったらこの Edge のウィンドウは閉じてよい（フローは新しい Edge を起動する）。
3. PAD コンソールで「申込状況チェック_デモ」の［実行］（▷）を押す（デザイナーで開いている場合はデザイナーの［実行］でもよい）。
4. 新しい Edge が開き、ログイン → 一覧 → 先頭行から順に「詳細」→「一覧へ戻る」を全件くり返したあと、Edge が閉じる。実行中はマウス・キーボードに触らない。
5. 出力ファイルを確認する。
   - 場所：**ドキュメント フォルダ\申込状況チェック_デモ**（エクスプローラーの左の［ドキュメント］から開く。OneDrive でドキュメントをバックアップしている PC では OneDrive 側のドキュメントになる）
   - ファイル：`申込状況_YYYYMMDD_HHMM.csv`（実行した日時。例：`申込状況_20261014_1030.csv`）と `latest.csv`。同じ分に2回実行すると履歴ファイルは上書きされる。`latest.csv` は毎回上書きされる
   - 中身：1行目が見出し（14列）、2行目から一覧の件数と同じ行数（初期データなら20行、1件追加後なら21行）
6. **BOM（UTF-8 BOM 付き）の確認**：次のどちらかで確かめる。
   - Excel で `latest.csv` をダブルクリックして開き、日本語（お客さま名・申込種別など）が文字化けしていないこと
   - PowerShell で次を実行し、先頭3バイトが `EF BB BF` であること（ユーザー名を書かずにドキュメント フォルダを指定している）

     ```powershell
     Format-Hex -Path (Join-Path ([Environment]::GetFolderPath('MyDocuments')) '申込状況チェック_デモ\latest.csv') | Select-Object -First 1
     ```

**注意：供給地点特定番号（22桁）**
- CSV には22桁の数字をそのまま書き出す（人の決定事項。対策はしない）。
- Excel で CSV を開くと数値として扱われ、`9.9E+21` のような指数表示になり、下の桁が `0` に丸められて見える。**CSV ファイル自体の値は正しい**（メモ帳で開くと22桁のまま）。デモで Excel を見せる場合はこの点に注意する。

---

## 6. エラー時のメッセージと対処

どのエラーでも、フローは **その場で止まり（CSV は書き出さない）**、次のメッセージを表示する。メッセージの［OK］を押すと、ブラウザを閉じる処理を試みてフローが終わる（ブラウザが起動していない場合は閉じる処理を飛ばす）。

- メッセージ画面のタイトル：**申込状況チェック_デモ（エラーで停止しました）**
- 手順ごとにブロック（「ブロック エラー発生時」）を分け、エラーになったらラベル `ErrorEnd` に移動してメッセージを表示する。メッセージ文言は変数 `StepMessage` に、その手順を始める前に入れてある。
- `<申込番号>`・`<件数>` などは実行時の値が入る。

| No | どこで止まったか | 表示されるメッセージ（`StepMessage`） | 表示されたときに人がすること |
|----|------------------|---------------------------------------|------------------------------|
| E0 | 手順0（初期化） | 手順0：初期化（実行日時の取得・作業フォルダの作成・データテーブルの準備）に失敗しました | ドキュメント フォルダに `申込状況チェック_デモ` フォルダを作れるか（同名のファイルが無いか、書き込み権限）を確認して再実行 |
| E1 | 手順1-1〜1-2（Edge 起動・ログイン画面が開かない、`#login-id` が 30 秒出ない） | 手順1-1〜1-2：モック画面に接続できません。server.js が起動しているか確認してください | `node mock/server.js` が起動しているか（ウィンドウが開いているか）、`http://localhost:8080/login.html` を Edge で開けるか、PAD の Edge 拡張機能が有効かを確認して再実行 |
| E2 | 手順1-3〜1-4（ID・パスワードの入力、ログインボタンのクリック） | 手順1-3〜1-4：ログイン画面で ID・パスワードの入力またはログインボタンのクリックができませんでした | UI 要素 U1〜U3 のセレクターが表のとおりかを確認して再実行 |
| E3 | 手順1-5（ログイン後に一覧が 30 秒以内に表示されない） | 手順1-5：ログイン後に一覧画面が表示されませんでした（30 秒待っても読み込みが完了しません）。ID・パスワードと一覧画面の表示を確認してください | 変数 `LoginId`・`LoginPassword` の値（demo-user / demo-pass）、一覧に「データを読み込めませんでした」が出ていないか、U4 のセレクターを確認して再実行 |
| E4 | 手順2-1（申込番号の取得） | 手順2-1：一覧から申込番号を取得できませんでした | No.34 の JavaScript が表のとおりかを確認して再実行 |
| E5 | 手順2-2（件数表示の取得） | 手順2-2：一覧の件数表示（data-count）を取得できませんでした | U5 のセレクターと No.37 の属性名 `data-count` を確認して再実行 |
| E6 | 手順2-2（件数の不一致） | 手順2-2：件数が一致しません（画面の件数 `<件数>` 件／取得 `<件数>` 件）。取得した申込番号：`<申込番号の一覧>` | 実行中にデモ操作をしていないか確認する。一覧を再読み込みして件数表示と行数が合っていることを確認して再実行 |
| E7 | 手順3-1（「詳細」ボタンのクリック） | 手順3-1：申込番号 `<申込番号>` の「詳細」ボタンをクリックできませんでした | U6 のセレクター（`%CurrentNo%` を含む形）を確認する。実行中に一覧のデータが変わっていないか確認して再実行 |
| E8 | 手順3-2（詳細画面が 30 秒以内に表示されない。該当なしで `#detail-error` が出た場合も含む） | 手順3-2：申込番号 `<申込番号>` の詳細画面が表示されませんでした（30 秒。該当する申込が見つからない場合を含む） | Edge に「該当する申込が見つかりません」が出ていれば、実行中に［初期データに戻す］等でデータが変わっていないか確認して再実行。U7 のセレクターも確認 |
| E9 | 手順3-3（詳細画面の申込番号の取得） | 手順3-3：申込番号 `<申込番号>` の詳細画面から申込番号を取得できませんでした | U8 のセレクターを確認して再実行 |
| E10 | 手順3-3（申込番号の不一致） | 手順3-3：申込番号が一致しません（対象 `<申込番号>`／詳細画面 `<申込番号>`） | 別の行の「詳細」が押されていないか（U6 のセレクターが表のとおりか）を確認して再実行 |
| E11 | 手順3-4（14項目の取得） | 手順3-4：申込番号 `<申込番号>` の項目を取得できませんでした | U9〜U21 のセレクターと名前を確認して再実行 |
| E12 | 手順3-5（一覧へ戻る・一覧の再表示が 30 秒以内に終わらない） | 手順3-5：申込番号 `<申込番号>` の詳細画面から一覧画面に戻れませんでした（30 秒） | U22・U4 のセレクター、モックが止まっていないかを確認して再実行 |
| E13 | 手順4（CSV の書き出し） | 手順4：CSV ファイルを書き出せませんでした。同じ名前のファイルを Excel 等で開いていないか確認してください | `latest.csv` や履歴ファイルを Excel で開いていれば閉じて再実行（このエラーのときは履歴ファイルだけ書き出されている場合がある。再実行で上書きされる） |

- エラー時の再実行（自動リトライ）は行わない（brief 11・`docs/flow.md` 4）。人が原因を直してから、もう一度実行する。
- 手順3 の途中で止まった場合、それまでに取得した分も CSV には書き出さない（前回の `latest.csv` はそのまま残る）。

---

## 7. アクション表

- `Main.txt` のアクション行（`#` コメント行・空行・`END` を除く）を上から順に並べた。**表の No と `Main.txt` の行は1対1で同じ順・同じ数（85行）**。
- 「手順」列は `docs/flow.md` の手順番号。「ブロック内」は、どのブロック（BLOCK）の中に入れるか。
- アクション名は PAD デザイナー（日本語表示）の名前。版によって表記が少し違う場合がある（10 を参照）。
- 待機（「Web ページのコンテンツを待機」）は `Main.txt` では `WAIT (WebAutomation.WaitForWebPageContent.WebPageToContainElement …) FOR 30` と書かれる。これは **要素が出るまで最大 30 秒待つ** 設定（タイムアウト 30 秒）で、固定秒数の待機（「待機」アクション `WAIT <秒>`）ではない。固定秒数の待機は使っていない。
- 「エラー時の設定」が「ブロック Stepx」のアクションは、アクション自体には何も設定せず、ブロックのエラー時処理（ラベル `ErrorEnd` へ移動）で扱う。

**`Main.txt` を手で直すときの注意（文字のエスケープ）**

PAD の貼り付けテキストでは `$'''…'''` の中の次の文字をエスケープする。デザイナーの画面には下の「設定値」の形（`\` や `"` が1つ）で表示されるので、表の値をそのまま `Main.txt` に書くと貼り付け時に構文エラーになる。

| 画面での値 | `Main.txt` での書き方 | 該当箇所 |
|------------|----------------------|----------|
| `\`（円記号・バックスラッシュ） | `\\` | No.13（`%DocumentsFolder%\\%WorkFolderName%`）・No.77・78（CSV のファイル パス） |
| `"`（ダブルクォート） | `\"` | No.34 の JavaScript 内のセレクター |

- とくに `\%` と書くと `%` が「変数の始まり」ではなく文字として扱われ、そこから後ろの行まで読み飛ばされて貼り付けが失敗する。パスの区切りは必ず `\\` にする。

| No | 手順 | ブロック内 | アクション名（PAD デザイナー） | 主な設定値 | 生成される変数 | エラー時の設定 |
|----|------|-----------|-------------------------------|-----------|---------------|---------------|
| 1 | 0 | — | ブロック エラー発生時（ブロックの開始） | 名前：`Step0_Init` | — | No.2〜3 |
| 2 | 0 | Step0_Init | （No.1 のエラー時の設定） | 例外処理モード：フロー実行を続行する | — | — |
| 3 | 0 | Step0_Init | （No.1 のエラー時の設定の続き） | ラベルに移動：`ErrorEnd` | — | — |
| 4 | 0 | Step0_Init | 変数の設定 | `StepMessage` ＝ E0 の文言（6 を参照） | `StepMessage` | ブロック Step0_Init |
| 5 | 0 | Step0_Init | 変数の設定 | `BaseUrl` ＝ `http://localhost:8080` | `BaseUrl` | ブロック Step0_Init |
| 6 | 0 | Step0_Init | 変数の設定 | `LoginId` ＝ `demo-user` | `LoginId` | ブロック Step0_Init |
| 7 | 0 | Step0_Init | 変数の設定 | `LoginPassword` ＝ `demo-pass`（変数を機密としてマーク） | `LoginPassword` | ブロック Step0_Init |
| 8 | 0 | Step0_Init | 変数の設定 | `WorkFolderName` ＝ `申込状況チェック_デモ` | `WorkFolderName` | ブロック Step0_Init |
| 9 | 0-1 | Step0_Init | 現在の日時を取得します | 取得：現在の日時、タイムゾーン：システム タイム ゾーン（ローカル） | `RunDateTime` | ブロック Step0_Init |
| 10 | 0-1 | Step0_Init | datetime をテキストに変換 | 変換する datetime：`%RunDateTime%`、使用する形式：カスタム、カスタム形式：`yyyyMMdd_HHmm` | `RunStamp` | ブロック Step0_Init |
| 11 | 0-1 | Step0_Init | 変数の設定 | `HistoryFileName` ＝ `申込状況_%RunStamp%.csv` | `HistoryFileName` | ブロック Step0_Init |
| 12 | 0-2 | Step0_Init | 特別なフォルダーを取得 | 特別なフォルダーの名前：ドキュメント（Personal） | `DocumentsFolder` | ブロック Step0_Init |
| 13 | 0-2 | Step0_Init | 変数の設定 | `WorkFolder` ＝ `%DocumentsFolder%\%WorkFolderName%` | `WorkFolder` | ブロック Step0_Init |
| 14 | 0-2 | Step0_Init | フォルダーが存在する場合 | フォルダーが：存在しない、フォルダーのパス：`%WorkFolder%` | — | ブロック Step0_Init |
| 15 | 0-2 | Step0_Init（No.14 の中） | フォルダーを作成 | 新しいフォルダーを次の場所に作成：`%DocumentsFolder%`、新しいフォルダー名：`%WorkFolderName%` | `CreatedFolder` | ブロック Step0_Init |
| 16 | 0-3 | Step0_Init | 新しいデータ テーブルを作成する | 列見出し（14列・この順）：申込番号／申込日／お客さま名／供給地点特定番号／申込種別／変更前容量／変更後容量／ステータス／担当者／需要場所住所／希望日／工事予定日／送配電受付番号／備考。行：空の1行 | `CurrentTable` | ブロック Step0_Init |
| 17 | 0-3 | Step0_Init | データ テーブルから行を削除する | データ テーブル：`%CurrentTable%`、行インデックス：`0`（作成時の空行を削除し、見出しだけ・0行にする） | — | ブロック Step0_Init |
| 18 | 1 | — | ブロック エラー発生時（ブロックの開始） | 名前：`Step1_Login` | — | No.19〜20 |
| 19 | 1 | Step1_Login | （No.18 のエラー時の設定） | 例外処理モード：フロー実行を続行する | — | — |
| 20 | 1 | Step1_Login | （No.18 のエラー時の設定の続き） | ラベルに移動：`ErrorEnd` | — | — |
| 21 | 1-1 | Step1_Login | 変数の設定 | `StepMessage` ＝ E1 の文言 | — | ブロック Step1_Login |
| 22 | 1-1 | Step1_Login | 新しい Microsoft Edge を起動する | 起動モード：新しいインスタンスを起動する、初期 URL：`%BaseUrl%/login.html`、ウィンドウの状態：最大化、キャッシュ・Cookie のクリア：しない、ページ読み込みのタイムアウト：60 秒 | `Browser` | ブロック Step1_Login |
| 23 | 1-2 | Step1_Login | Web ページのコンテンツを待機 | ブラウザー インスタンス：`%Browser%`、Web ページの状態：要素が表示される、UI 要素：`LoginPage` › `login-id`（`#login-id`）、タイムアウト：30 秒 | — | ブロック Step1_Login |
| 24 | 1-3 | Step1_Login | 変数の設定 | `StepMessage` ＝ E2 の文言 | — | ブロック Step1_Login |
| 25 | 1-3 | Step1_Login | Web ページ内のテキスト フィールドに入力する | ブラウザー インスタンス：`%Browser%`、UI 要素：`LoginPage` › `login-id`（`#login-id`）、テキスト：`%LoginId%`、入力をエミュレートする：オン、入力後にテキスト ボックスからフォーカスを外す：オフ、入力モード：テキストを置き換える | — | ブロック Step1_Login |
| 26 | 1-3 | Step1_Login | Web ページ内のテキスト フィールドに入力する | UI 要素：`LoginPage` › `login-password`（`#login-password`）、テキスト：`%LoginPassword%`、他は No.25 と同じ | — | ブロック Step1_Login |
| 27 | 1-4 | Step1_Login | Web ページのリンクをクリックします | ブラウザー インスタンス：`%Browser%`、UI 要素：`LoginPage` › `login-button`（`#login-button`）、ページ読み込みのタイムアウト：60 秒 | — | ブロック Step1_Login |
| 28 | 1-5 | Step1_Login | 変数の設定 | `StepMessage` ＝ E3 の文言 | — | ブロック Step1_Login |
| 29 | 1-5 | Step1_Login | Web ページのコンテンツを待機 | 要素が表示される、UI 要素：`ListPage` › `application-table-loaded`（`#application-table[data-loaded="true"]`）、タイムアウト：30 秒 | — | ブロック Step1_Login |
| 30 | 2 | — | ブロック エラー発生時（ブロックの開始） | 名前：`Step2_GetList` | — | No.31〜32 |
| 31 | 2 | Step2_GetList | （No.30 のエラー時の設定） | 例外処理モード：フロー実行を続行する | — | — |
| 32 | 2 | Step2_GetList | （No.30 のエラー時の設定の続き） | ラベルに移動：`ErrorEnd` | — | — |
| 33 | 2-1 | Step2_GetList | 変数の設定 | `StepMessage` ＝ E4 の文言 | — | ブロック Step2_GetList |
| 34 | 2-1 | Step2_GetList | Web ページで JavaScript 関数を実行します | ブラウザー インスタンス：`%Browser%`、JavaScript 関数：下の「No.34 の JavaScript」 | `ApplicationNosText` | ブロック Step2_GetList |
| 35 | 2-1 | Step2_GetList | テキストの分割 | 分割するテキスト：`%ApplicationNosText%`、区切り記号の種類：カスタム、カスタム区切り記号：`,`（カンマ）、正規表現：オフ | `ApplicationNos` | ブロック Step2_GetList |
| 36 | 2-2 | Step2_GetList | 変数の設定 | `StepMessage` ＝ E5 の文言 | — | ブロック Step2_GetList |
| 37 | 2-2 | Step2_GetList | Web ページ上の要素の詳細を取得します | UI 要素：`ListPage` › `application-count`（`#application-count`）、属性名：`data-count`（一覧に無いので直接入力） | `DataCountText` | ブロック Step2_GetList |
| 38 | 2-2 | Step2_GetList | テキストを数値に変換 | 変換するテキスト：`%DataCountText%` | `DataCount` | ブロック Step2_GetList |
| 39 | 2-2 | Step2_GetList | If | 最初のオペランド：`%ApplicationNos.Count%`、演算子：と等しくない（<>）、2番目のオペランド：`%DataCount%` | — | ブロック Step2_GetList |
| 40 | 2-2 | Step2_GetList（No.39 の中） | 変数の設定 | `StepMessage` ＝ E6 の文言（`手順2-2：件数が一致しません（画面の件数 %DataCount% 件／取得 %ApplicationNos.Count% 件）。取得した申込番号：%ApplicationNosText%`） | — | ブロック Step2_GetList |
| 41 | 2-2 | Step2_GetList（No.39 の中） | 移動先（Go to） | ラベル：`ErrorEnd` | — | — |
| 42 | 3 | — | ブロック エラー発生時（ブロックの開始） | 名前：`Step3_GetDetails` | — | No.43〜44 |
| 43 | 3 | Step3_GetDetails | （No.42 のエラー時の設定） | 例外処理モード：フロー実行を続行する | — | — |
| 44 | 3 | Step3_GetDetails | （No.42 のエラー時の設定の続き） | ラベルに移動：`ErrorEnd` | — | — |
| 45 | 3 | Step3_GetDetails | For each | 反復処理を行う値：`%ApplicationNos%`（手順2 で取得した全件）、保存先：`CurrentNo` | `CurrentNo` | ブロック Step3_GetDetails |
| 46 | 3-1 | Step3_GetDetails（ループ内） | 変数の設定 | `StepMessage` ＝ E7 の文言（`%CurrentNo%` を含む） | — | ブロック Step3_GetDetails |
| 47 | 3-1 | Step3_GetDetails（ループ内） | Web ページのリンクをクリックします | UI 要素：`ListPage` › `detail-button`（`button[data-action="detail"][data-application-no="%CurrentNo%"]`）、ページ読み込みのタイムアウト：60 秒 | — | ブロック Step3_GetDetails |
| 48 | 3-2 | Step3_GetDetails（ループ内） | 変数の設定 | `StepMessage` ＝ E8 の文言（`%CurrentNo%` を含む） | — | ブロック Step3_GetDetails |
| 49 | 3-2 | Step3_GetDetails（ループ内） | Web ページのコンテンツを待機 | 要素が表示される、UI 要素：`DetailPage` › `application-detail-loaded`（`#application-detail[data-loaded="true"]`）、タイムアウト：30 秒 | — | ブロック Step3_GetDetails |
| 50 | 3-3 | Step3_GetDetails（ループ内） | 変数の設定 | `StepMessage` ＝ E9 の文言（`%CurrentNo%` を含む） | — | ブロック Step3_GetDetails |
| 51 | 3-3 | Step3_GetDetails（ループ内） | Web ページ上の要素の詳細を取得します | UI 要素：`DetailPage` › `field-applicationNo`（`#field-applicationNo`）、属性名：`Own Text` | `Val_applicationNo` | ブロック Step3_GetDetails |
| 52 | 3-3 | Step3_GetDetails（ループ内） | If | `%Val_applicationNo%` と等しくない（<>） `%CurrentNo%` | — | ブロック Step3_GetDetails |
| 53 | 3-3 | Step3_GetDetails（No.52 の中） | 変数の設定 | `StepMessage` ＝ E10 の文言（`手順3-3：申込番号が一致しません（対象 %CurrentNo%／詳細画面 %Val_applicationNo%）`） | — | ブロック Step3_GetDetails |
| 54 | 3-3 | Step3_GetDetails（No.52 の中） | 移動先（Go to） | ラベル：`ErrorEnd` | — | — |
| 55 | 3-4 | Step3_GetDetails（ループ内） | 変数の設定 | `StepMessage` ＝ E11 の文言（`%CurrentNo%` を含む） | — | ブロック Step3_GetDetails |
| 56 | 3-4 | Step3_GetDetails（ループ内） | Web ページ上の要素の詳細を取得します | `DetailPage` › `field-applicationDate`（`#field-applicationDate`）、属性名：`Own Text` | `Val_applicationDate` | ブロック Step3_GetDetails |
| 57 | 3-4 | 同上 | Web ページ上の要素の詳細を取得します | `DetailPage` › `field-customerName`（`#field-customerName`）、`Own Text` | `Val_customerName` | ブロック Step3_GetDetails |
| 58 | 3-4 | 同上 | Web ページ上の要素の詳細を取得します | `DetailPage` › `field-supplyPointNo`（`#field-supplyPointNo`）、`Own Text` | `Val_supplyPointNo` | ブロック Step3_GetDetails |
| 59 | 3-4 | 同上 | Web ページ上の要素の詳細を取得します | `DetailPage` › `field-applicationType`（`#field-applicationType`）、`Own Text` | `Val_applicationType` | ブロック Step3_GetDetails |
| 60 | 3-4 | 同上 | Web ページ上の要素の詳細を取得します | `DetailPage` › `field-capacityBefore`（`#field-capacityBefore`）、`Own Text` | `Val_capacityBefore` | ブロック Step3_GetDetails |
| 61 | 3-4 | 同上 | Web ページ上の要素の詳細を取得します | `DetailPage` › `field-capacityAfter`（`#field-capacityAfter`）、`Own Text` | `Val_capacityAfter` | ブロック Step3_GetDetails |
| 62 | 3-4 | 同上 | Web ページ上の要素の詳細を取得します | `DetailPage` › `field-status`（`#field-status`）、`Own Text` | `Val_status` | ブロック Step3_GetDetails |
| 63 | 3-4 | 同上 | Web ページ上の要素の詳細を取得します | `DetailPage` › `field-assignee`（`#field-assignee`）、`Own Text` | `Val_assignee` | ブロック Step3_GetDetails |
| 64 | 3-4 | 同上 | Web ページ上の要素の詳細を取得します | `DetailPage` › `field-siteAddress`（`#field-siteAddress`）、`Own Text` | `Val_siteAddress` | ブロック Step3_GetDetails |
| 65 | 3-4 | 同上 | Web ページ上の要素の詳細を取得します | `DetailPage` › `field-desiredDate`（`#field-desiredDate`）、`Own Text` | `Val_desiredDate` | ブロック Step3_GetDetails |
| 66 | 3-4 | 同上 | Web ページ上の要素の詳細を取得します | `DetailPage` › `field-scheduledWorkDate`（`#field-scheduledWorkDate`）、`Own Text` | `Val_scheduledWorkDate` | ブロック Step3_GetDetails |
| 67 | 3-4 | 同上 | Web ページ上の要素の詳細を取得します | `DetailPage` › `field-receptionNo`（`#field-receptionNo`）、`Own Text` | `Val_receptionNo` | ブロック Step3_GetDetails |
| 68 | 3-4 | 同上 | Web ページ上の要素の詳細を取得します | `DetailPage` › `field-remarks`（`#field-remarks`）、`Own Text`（空欄は空文字になる） | `Val_remarks` | ブロック Step3_GetDetails |
| 69 | 3-4 | 同上 | データ テーブルに行を挿入 | データ テーブル：`%CurrentTable%`、挿入場所：データ テーブルの末尾、新しい値：`[Val_applicationNo, Val_applicationDate, Val_customerName, Val_supplyPointNo, Val_applicationType, Val_capacityBefore, Val_capacityAfter, Val_status, Val_assignee, Val_siteAddress, Val_desiredDate, Val_scheduledWorkDate, Val_receptionNo, Val_remarks]`（14個を見出しと同じ順に位置で並べる。空の備考でも列がずれない） | — | ブロック Step3_GetDetails |
| 70 | 3-5 | 同上 | 変数の設定 | `StepMessage` ＝ E12 の文言（`%CurrentNo%` を含む） | — | ブロック Step3_GetDetails |
| 71 | 3-5 | 同上 | Web ページのリンクをクリックします | UI 要素：`DetailPage` › `back-to-list-button`（`#back-to-list-button`）、ページ読み込みのタイムアウト：60 秒 | — | ブロック Step3_GetDetails |
| 72 | 3-5 | 同上 | Web ページのコンテンツを待機 | 要素が表示される、UI 要素：`ListPage` › `application-table-loaded`（`#application-table[data-loaded="true"]`）、タイムアウト：30 秒（次の行の「詳細」を押す前に一覧の読み込み完了を待つ） | — | ブロック Step3_GetDetails |
| 73 | 4 | — | ブロック エラー発生時（ブロックの開始） | 名前：`Step4_WriteCsv` | — | No.74〜75 |
| 74 | 4 | Step4_WriteCsv | （No.73 のエラー時の設定） | 例外処理モード：フロー実行を続行する | — | — |
| 75 | 4 | Step4_WriteCsv | （No.73 のエラー時の設定の続き） | ラベルに移動：`ErrorEnd` | — | — |
| 76 | 4 | Step4_WriteCsv | 変数の設定 | `StepMessage` ＝ E13 の文言 | — | ブロック Step4_WriteCsv |
| 77 | 4-1 | Step4_WriteCsv | CSV ファイルに書き込む | 書き込む変数：`%CurrentTable%`、ファイル パス：`%WorkFolder%\%HistoryFileName%`、エンコード：UTF-8、［詳細］列名を含める：オン、ファイルが存在する場合：上書き、列区切り記号：コンマ | — | ブロック Step4_WriteCsv |
| 78 | 4-2 | Step4_WriteCsv | CSV ファイルに書き込む | ファイル パス：`%WorkFolder%\latest.csv`、他は No.77 と同じ（UTF-8・列名を含める・上書き・コンマ） | — | ブロック Step4_WriteCsv |
| 79 | 7 | — | Web ブラウザーを閉じる | ブラウザー インスタンス：`%Browser%` | — | なし（既定：フローを停止） |
| 80 | 7 | — | フローを停止する | フローの終了：正常に終了（コード 0） | — | — |
| 81 | エラー時 | — | ラベル | ラベル名：`ErrorEnd` | — | — |
| 82 | エラー時 | — | メッセージを表示 | タイトル：`申込状況チェック_デモ（エラーで停止しました）`、表示するメッセージ：`%StepMessage%`、アイコン：エラー、ボタン：OK、常に手前に表示：オン | `ButtonPressed` | — |
| 83 | エラー時 | — | Web ブラウザーを閉じる | ブラウザー インスタンス：`%Browser%` | — | No.84〜85 |
| 84 | エラー時 | — | （No.83 のエラー時の設定） | エラー発生時：フロー実行を続行する（`Main.txt` では `ON ERROR`） | — | — |
| 85 | エラー時 | — | （No.83 のエラー時の設定の続き） | 次のアクションに進む（`Main.txt` では `NEXT ACTION`。Edge が起動していない場合も止まらずに終わる） | — | — |

**No.34 の JavaScript**（`Main.txt` では1行。中のセレクターは `#application-tbody tr[data-application-no]`。`Main.txt` では文字列の中なのでダブルクォートが `\"` になっている）

```javascript
function ExecuteScript() {
  var rows = document.querySelectorAll("#application-tbody tr[data-application-no]");
  var nos = [];
  for (var i = 0; i < rows.length; i++) { nos.push(rows[i].getAttribute("data-application-no")); }
  return nos.join(",");
}
```

**CSV の設定（No.77・78）について**
- エンコード：**UTF-8**（PAD の選択肢の「UTF-8」。`Main.txt` では `File.CSVEncoding.UTF8`）。PAD（.NET）の「UTF-8」は書き出し時にファイルの先頭に BOM（`EF BB BF`）を付ける。BOM があると Excel が UTF-8 と判断して日本語が文字化けしない。版によって「UTF-8（BOM なし）」のような選択肢がある場合は、そちらは **選ばない**。実行後に 5 の 6. の方法で BOM を確かめる。
- 列区切り記号：**コンマ**を明示して選ぶ（「システムの既定」は選ばない。地域設定によって区切りが変わるのを避けるため）。
- 列名を含める：オン（1行目が見出しになる）。ファイルが存在する場合：上書き。
- CSV の書き出しは手順3 の全件ループが最後まで終わった後だけ実行される。手順0〜3 のどこかでエラーになると、ラベル `ErrorEnd` に移動するため No.77・78 は実行されない。

**全件ループについて**
- 手順3 は手順2 で取得した申込番号リスト `ApplicationNos` の全件に対する For each で、件数・申込番号・行番号はどこにも直書きしていない。デモ操作で追加した案件（一覧の先頭行）も、手順2 で取得されるので同じループで取得される。
- 詳細画面への移動は、一覧の「詳細」ボタン（U6）のクリックだけで行う。URL（`detail.html?no=`）を直接開くアクションは使わない。
- 各回の最後に「一覧へ戻る」（U22）を押し、一覧の読み込み完了（U4）を待ってから次の申込番号の「詳細」を押す。

---

## 8. CSV 出力例

`mock/data/dummy.json` の初期データ（20件）で実行した場合の先頭3行と最終行（並びは一覧の表示順＝申込番号の降順）。実際のファイルは UTF-8（BOM 付き）・カンマ区切りで、見出し1行＋20行。

```csv
申込番号,申込日,お客さま名,供給地点特定番号,申込種別,変更前容量,変更後容量,ステータス,担当者,需要場所住所,希望日,工事予定日,送配電受付番号,備考
DM-2026-0020,2026/09/29,テスト 十郎,9900000000000000001741,契約容量変更,20A,30A,受付済,デモ 夏美,デモ県見本市見本町8-1-2,2026/11/13,未定,未採番,
DM-2026-0019,2026/09/26,見本 九重,9900000000000000001704,契約容量変更,30A,40A,受付済,サンプル 秋子,デモ県サンプル市架空台7-7-4,2026/11/10,未定,未採番,立会い希望あり
DM-2026-0018,2026/09/23,デモ 八雲,9900000000000000001667,契約容量変更,40A,60A,受付済,デモ 花子,デモ県デモ市試験町6-2-1,2026/11/07,未定,未採番,駐車スペースあり
（中略）
DM-2026-0001,2026/08/03,サンプル 一郎,9900000000000000001038,契約容量変更,30A,40A,完了,デモ 花子,デモ県サンプル市見本町1-2-3,2026/09/17,2026/09/20,UK-00010113,立会い希望あり
```

- 1行目の DM-2026-0020 のように備考が空の行は、行末がカンマで終わる（14列目が空）。
- 「未定」「未採番」は画面の表示どおりの文字列で出る。
- 供給地点特定番号は22桁の数字をそのまま書く（Excel では指数表示になる。5 の注意を参照）。
- 値にカンマ・改行・ダブルクォートは含まれない（`docs/screens.md` 1 の制約）。PAD が値をダブルクォートで囲んで書き出すかどうかは版によって違う可能性があり、レビュー②で確認する（囲まれていても Excel での表示・スプリント05 の読み込みには影響しない）。

---

## 9. スプリント05 で手順を足す位置

- 手順5〜6（SharePoint から前回 `latest.csv` の取得・新規判定・SharePoint への保存・Teams 投稿）は、**No.78（`latest.csv` の書き出し）の後、No.79（Web ブラウザーを閉じる）の前** に追加する。`Main.txt` では次のコメント行の位置：
  `# ===== スプリント05：手順5〜6 はここ（次の「手順7」のブラウザを閉じるアクションの前）に追加する =====`
- 追加する手順も、手順ごとに「ブロック エラー発生時」で囲み、エラー時はラベル `ErrorEnd` に移動する（メッセージ表示とブラウザを閉じる処理を共通で使う）。
- SharePoint の保存先・Teams の投稿先・接続情報は PAD 上で設定し、`flows/` には `<作成時に設定>` のようなプレースホルダーだけを書く。

---

## 10. 検証状況とレビュー②で要確認

### 10-0. この PC の PAD の定義と照合した結果（2026-10-15）

`Main.txt` のアクション行を、この PC にインストールされている **Power Automate for desktop 11.2609.183.0** 自身のファイルと機械的に照合した。

- **構文**：PAD のフロー テキストの構文解析器（`Microsoft.Flow.RPA.Desktop.Robin.Language.dll`）で解析 → **エラー 0**（96 ステートメント。`#` コメント・`BLOCK` ／ `ON BLOCK ERROR`・`WAIT … FOR`・`LABEL` ／ `GOTO`・`EXIT Code:` がすべて正しい書き方だと確認できた）。
- **アクション名・パラメーター名・列挙値**：各アクション モジュール（`Microsoft.Flow.RPA.Desktop.Modules.*.Actions.dll`）の定義と照合 → 41 か所のアクション呼び出しで **不一致 0**。
  - アクション名の決まり方は **`ActionAttribute` の `Name` → `Id` → クラス名** の順（`Name` があればそれが `Main.txt` に書く名前）。根拠：`Database.OpenConnection` クラスは `@ActionAttribute(Name=Connect)` で、その移行用クラスが宣言する完全名が `Database.Connect`（`Excel.AttachToRunningExcel`／`Name=Attach` → `Excel.Attach` も同じ）。
  - セレクター名（`…Action.<セレクター>` の部分）は、セレクター クラスの `ActionName` プロパティの値（クラス名の `…Selector` ではない）。
- **書き戻し**：解析した結果を PAD 自身の書式で文字列に戻すと、`Main.txt` の本文と一致した（PAD がコピーするのと同じ書き方になっている）。
- **UI 要素の定義（末尾の JSON）**：実機でコピーした見本（`input/pad-sample-custom.txt`）と項目名の構成が一致。`appmask['画面']['要素']` の参照 22 件すべてが定義済みの要素に対応し、`InstanceId` も重複なし。

この照合で見つかって直したもの（スプリント04b の追加修正）：

| 直した内容 | 直す前 | 直した後 |
|------------|--------|----------|
| パスの `\` のエスケープ（`\%` で貼り付けが壊れる） | `%DocumentsFolder%\%WorkFolderName%` 等 3 か所 | `%DocumentsFolder%\\%WorkFolderName%` |
| 待機のセレクター名（`ElementToAppear` は存在しない） | `WaitForWebPageContent.ElementToAppear`（4 か所） | `WaitForWebPageContent.WebPageToContainElement` |
| 特別なフォルダーの列挙値（PAD 独自の enum で .NET のものではない） | `System.Environment.SpecialFolder.Personal` | `Folder.SpecialFolder.Personal` |
| No.83 のエラー時の設定（中身が空だった） | `ON ERROR` ／ `END` | `ON ERROR` ／ `NEXT ACTION` ／ `END` |
| JavaScript 内のダブルクォート | `"…"` | `\"…\"` |
| UI 要素の種類名（`dl` ／ `dd`） | `Definition list` ／ `Definition description` | `Description list` ／ `Description details` |

**照合のときに一度まちがえたこと（記録）**

- アクション名を `ActionAttribute` の `Id` だけで照合し、`Id` が無いときクラス名を正解として扱ったため、`Text.SplitText` ／ `Text.ToNumber` ／ `Text.ConvertDateTimeToText` ／ `File.WriteToCSVFile` ／ `Folder.Create` の 5 件を「クラス名（`…Action` 付き）が正しい」と誤判定し、いったん書き換えてしまった。これらのクラスは `Id` ではなく **`Name`** を持っており、**元の名前が正しい**。別セッションの独立検証で指摘を受け、上の決まり（`Name` → `Id` → クラス名）を確認して元に戻した。
- 構文解析（`LangParser`）はアクション名を検証しない。書き戻しの一致も「書き方」が同じことしか示さないので、**名前の正しさの根拠にはならない**。名前は必ずモジュールの属性（`Name` ／ `Id`）で確かめる。

### 10-1. レビュー②で要確認

照合できるのは「書き方」までで、**貼り付けたときの PAD の動き・実行結果は実機でしか確認できない**。下の表の「状態」が「実機」の行をレビュー②で確認し、違っていたら PAD 上で「7. アクション表」の設定値どおりに直す。

| # | 対象（アクション表 No.） | 状態 | 確認すること |
|---|--------------------------|------|-------------|
| R-1 | ブロック（No.1〜3 ほか各ブロック） | 構文は照合済 | `BLOCK <名前>` ／ `ON BLOCK ERROR` ／ `GOTO ErrorEnd` ／ `END` の書き方（ブロック名に引用符は不要、`ON BLOCK ERROR` の後のキーワードも不要と確認済み）。貼り付けで崩れた場合は、ブロックを手作業で作り、例外処理モードを「フロー実行を続行する → ラベルに移動：ErrorEnd」にする |
| R-2 | 移動先（No.41・54） | 実機 | ループ（For each）やブロックの中から、外のラベル `ErrorEnd` に移動できること。できない場合は、ループ・ブロックを抜けた後で移動する形に直す |
| R-3 | アクションのエラー時の設定（No.83〜85） | 構文は照合済 | `ON ERROR` ／ `NEXT ACTION` ／ `END` が「フロー実行を続行する → 次のアクションに進む」として表示されること |
| R-4 | 待機（No.23・29・49・72） | 照合済 | `WAIT (WebAutomation.WaitForWebPageContent.WebPageToContainElement …) FOR 30` の書き方と、タイムアウト 30 秒が設定されること |
| R-5 | Edge 起動（No.22） | 照合済 | `WebAutomation.LaunchEdge.LaunchEdge` のパラメーター名（`WindowState`・`ClearCache`・`Timeout` 等）。新しい版で追加されたパラメーターがあれば既定値でよい |
| R-6 | テキスト フィールドに入力（No.25・26） | 照合済 | アクション名 `PopulateTextField.PopulateTextField` と `EmulateTyping` 等のパラメーター名 |
| R-7 | クリック（No.27・47・71） | 照合済 | `WebAutomation.Click.Click` のパラメーター |
| R-8 | 要素の詳細を取得（No.37・51・56〜68） | 名前は照合済 | 属性名に `data-count` を直接入力できること、`Own Text` で値だけが取れること（空の備考が空文字になること）、出力パラメーター名 `AttributeValue` |
| R-9 | JavaScript 関数を実行（No.34） | 名前は照合済 | `WebAutomation.ExecuteJavascript` のパラメーター名、関数名 `ExecuteScript` の戻り値が `Result` に入ること |
| R-10 | テキストの分割（No.35）・テキストを数値に変換（No.38）・If（No.39） | 名前は照合済 | `Text.SplitText.SplitWithDelimiter` ／ `Text.ToNumber` の書き方、リストの件数 `%ApplicationNos.Count%` と数値の比較 |
| R-11 | データ テーブル（No.16・17・69） | 名前は照合済 | `Variables.CreateNewDatatable` の表の書き方（見出しを `$'''…'''` で書いてよいか）、空行の削除 `Variables.DeleteRowFromDataTable`、行の追加 `Variables.AddRowToDataTable.AppendRowToDataTable`。見出しだけ（0行）のデータ テーブルを直接作れる版なら No.17 は不要だが、その場合も No.17 を残すと行が無くエラーになるので、作成時の行の有無に合わせる |
| R-12 | CSV に書き込む（No.77・78） | 名前は照合済 | 列挙値の名前（`File.CSVEncoding.UTF8`・`File.CSVColumnsSeparator.Comma`・`File.IfFileExists.Overwrite`）、「UTF-8」で BOM が付くこと（5 の 6. で確認）、値がダブルクォートで囲まれるかどうか |
| R-13 | フォルダー（No.12・14・15） | 照合済 | `Folder.SpecialFolder.Personal` がドキュメントになること、`IF (Folder.IfFolderExists.DoesNotExist Path: …) THEN` の書き方 |
| R-14 | 日時（No.9・10） | 名前は照合済 | `DateTime.GetCurrentDateTime.Local` と `Text.ConvertDateTimeToText.FromCustomDateTime` の書き方。`yyyyMMdd_HHmm` で `20261014_1030` の形になること |
| R-15 | メッセージ・停止（No.80・82） | 照合済 | `Display.ShowMessageDialog.ShowMessage` のパラメーター、`EXIT Code: 0` |
| R-16 | UI 要素（U1〜U22） | 実機 | セレクター エディターで `#id` の書き方が使えること（使えなければ「`#` が使えない場合」列の形）、U6 の `%CurrentNo%` がセレクター内で値に置き換わること |
| R-17 | アクション名 | 実機 | 表の日本語のアクション名が、使っている PAD の版の表示と合っているか |
| R-18 | 実行結果 | 実機 | 出力 CSV の件数（一覧と同数）・14列・BOM・Excel での文字化け、実行時間（`docs/criteria.md` R1・R5〜R7） |
| R-19 | UI 要素の定義（`Main.txt` 末尾） | 実機 | **貼り付けだけで UI 要素が登録されること**（［UI 要素］ペインに3画面・22要素ができ、名前とセレクターが 2-2 の表どおりで、U6 に `%CurrentNo%` が残ること）。登録されない場合は 3-1 の予備手順で登録する |
| R-20 | UI 要素のスクリーンショット | 実機 | **スクリーンショット無し（1×1 のダミー画像）で取り込めること**。取り込めない場合は 3-1 の予備手順で登録するか、登録された要素を取り込み直す（2-2「スクリーンショットの扱い」）。あわせて、取り込み直すときのメニュー名（2-2 に書いた［UI 要素の置換］）が PAD の表示と合っているかも確かめる |
| R-21 | UI 要素の種類の表示名 | 照合済 | 要素の種類（定義の `ElementTypeName`）は PAD の名前に合わせた（`Web Page`・`Input text`・`Input password`・`Button`・`Table`・`Span`・`Description list`・`Description details`）。表示が違ってもセレクターで要素を探すので実行には影響しない想定。エラーになる場合は該当要素を取り込み直す |
