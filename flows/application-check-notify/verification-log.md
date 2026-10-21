# 申込状況チェック_通知付き — 検証ログ（照合の結果・実機の書式との照合と未確認・実機の結果）

当日の手順は [README.md](./README.md)、設定値・エラー表・アクション表は [reference.md](./reference.md)。資産5（付加価値・保留）の記録で、デモ本編の資産4（`flows/application-check/`）の検証ログとは別。

| 節 | 内容 |
|----|------|
| 1 | 経緯と今の版（1-1：04e の反映の記録） |
| 2 | PAD の定義との照合（今の版） |
| 3 | 実機の PAD が出した書式との照合と、確認済み／未確認 |
| 4 | 実機の結果（貼り付けの事実と、実行は未実施の欄） |
| 5 | 実機で確認してほしいこと（レビュー②・進行役向け） |

---

## 1. 経緯と今の版

- 2026-10-20：人の決定でスプリント05 を付加価値（保留）として別資産 `flows/application-check-notify/` に作った。資産4の `Main.txt`（コミット `12be3e2` の版）を出発点にコピーし、手順5〜6 と失敗時の Teams 通知を足した（差分は reference.md の 1）。
- 実機（デスクトップ版）で分かっていたこと：SharePoint「ファイルの作成」の「ファイル コンテンツ」はバイナリ必須（「ファイルをバイナリ データに変換」を経由）。フォルダーのパスは直接入力、サイトは一覧から選択。接続参照は作成済み。→ `Main.txt` に反映した。
- 2026-10-20（実機の貼り付け）：最初の版（コミット `1c93b3f`）を実機（PAD 11.2609.183.0）に貼り付けたところ、229 アクションで貼り付けはできたが、SharePoint・Teams のコネクタ 5 行が「不明なアクション」になり、保存できなかった（「コネクタ定義の準備に失敗しました」）。デスクトップ版のセッションが手で配置し直して保存に成功し、PAD が出力した実際の書式を報告してきた。→ `Main.txt` のコネクタ 5 行と `File.ConvertFromBinary` の列挙値、末尾の `ConnectionReferences` を、その書式に直した（reference.md の 6-1、D11）。
- 2026-10-21：スプリント04e（資産4の3か所のクリックを物理的なマウス操作にしない。`main` へのマージは `752291d`）の修正を資産5に反映した（1-1）。
- 今の版の `Main.txt`：**コミット ID は未記入**（コミット後に進行役が追記する。`<コミット ID>`）。直した版を実機に貼り付けて保存できるかは**未確認**。

### 1-1. 04e の反映の記録（2026-10-21）

| 項目 | 内容 |
|------|------|
| 日付 | 2026-10-21（合格基準書の「5. 追補」〔人が承認 2026-10-21〕の 5-2 (f)・5-9 (f)・5-11 (f)） |
| 基準にした資産4の版 | **`752291d`**（04e のマージ後の `main`。資産4の凍結の版） |
| 反映した3行（アクション表 No.／`Main.txt` の行） | No.46 ログインボタン（68 行目。資産4の No.42・62 行目）、No.80「詳細」（121 行目。資産4の No.76・115 行目）、No.96「一覧へ戻る」（142 行目。資産4の No.92・136 行目）。3行とも、資産4の対応する行と **行頭の空白を除いて文字単位で同じ** にした：`WebAutomation.Click.Click BrowserInstance: Browser Control: <要素> ClickType: WebAutomation.ClickType.LeftClick MouseClick: False WaitForPageToLoadTimeout: 60 MousePositionRelativeToElement: WebAutomation.RectangleEdgePoint.MiddleCenter OffsetX: 0 OffsetY: 0` |
| ほかに変えた行 | 手順1 の説明のコメント行1行（44 行目。資産4の 38 行目と同じ文にした：クリックは「物理クリックを送信」オフである旨を足した文）。アクション行はこの3行のほかに変えていない |
| 書き方の根拠 | 資産4の verification-log.md 10-0j（実機の PAD 11.2609 のデザイナーで「物理クリックを送信」をオフにして保存し、コピーした文と同じ）。照合は資産4の verification-log.md 10-0 の「今の版の照合」 |
| 反映の前後の確認（Node スクリプト、2026-10-21） | `WebAutomation.Click.Click` の行は 3 行で、3 行とも資産4（`752291d`）の 62・115・136 行目と一致。`MouseClick: True` の行・`MouseClick` の無いクリックの行は 0。反映の前（`63f4a5f`）との比較で、アクション行（`#` コメント・空行・`END` を除く行）は 197 行のまま（コネクタの `@@` の注釈の行 11 行を含む数え方。除くとアクション表と同じ 186 行）で、変わったのは 46・80・96 番目の3行だけ（＝アクション表 No.46・80・96）。追加・削除・順の入れ替えは無い。全体の行数も同じ。マーカー行 `# [ControlRepository][PowerAutomateDesktop]` 以降は文字単位で同じ。手順0〜4（`# 手順0. 初期化` から `Step4_WriteCsv` の `END` まで 144 行）は資産4（`752291d`）と文字単位で同じ |
| 実機の確認 | **未実施**（4 の 5-13 (f)・5-14 (f)〜5-16 (f)・5-18 (e) の欄）。資産5の今の版を「実機で確認済」とは書かない |

## 2. PAD の定義との照合（今の版。2026-10-20）

照合に使ったのは、この PC の PAD 11.2609.183.0 の構文解析器（`Microsoft.Flow.RPA.Desktop.Robin.Language.dll` の `LangParser.GetStatements`）と、各アクション モジュール（`Microsoft.Flow.RPA.Desktop.Modules.*.Actions.dll`）の定義（PowerShell で読み込み、`ActionAttribute`・`ThrowsAttribute`・セレクターの引数・列挙値を確認）。04b〜04d と同じ方法。SharePoint・Teams のコネクタのアクションの定義はローカルに無いが、**今の版のコネクタ 5 行の書式は、実機の PAD が出力したもの（デスクトップ版のセッションの報告）に合わせてある**（3 で、実機で確認済みのものと未確認のものを分けた）。

| 確認したこと | 結果 |
|--------------|------|
| 構文解析器（`LangParser.GetStatements`） | （2026-10-20 の版での結果。04e の反映〔1-1〕の後は再実行していない：下の「04e の反映後」の行）**エラー 0**、**229 ステートメント**（内訳：アクション 44、コネクタ 5、代入 56、コメント 41、If 17、Else 4、End 31、ブロック 9、For each 4、Loop 1、Wait 7、Goto 6、エラー取得 2、Label 1、Exit 1）。最初の版を実機に貼り付けたときの PAD の表示も 229 アクションで、構文解析器の数と一致した。今の版の実機の表示は未確認 |
| 書き戻し（解析結果を PAD の書式で文字列に戻す） | 空でない行 289 行のうち **289 行が一致**（`@@` の注釈の行・コネクタの出力の `@…=> 変数` を含む。最初の版で一致しなかった出力の行も、実機の書式にしたことで一致した）。コネクタの行の直前の `@@` の注釈の行は、構文解析器が直後のステートメントに付くものとして受け付ける（ステートメント数は増えない） |
| 手順0〜4 の回帰 | `Main.txt` の手順0〜4（`# 手順0. 初期化` から `Step4_WriteCsv` の `END` まで 144 行）は、資産4（**`752291d`**。04e の反映の前は `12be3e2` と比べて同じだった）と**文字単位で同じ**（2026-10-21 に Node スクリプトで確認）。アクション行は資産4の 107 行がすべて順に含まれる（reference.md の 7 で No. の対応を確認できる） |
| **3か所のクリックの引数（04e の反映後。5-9 (f)）** | No.46・80・96 の `WebAutomation.Click.Click` の3行は、資産4（`752291d`）の No.42・76・92 の行と行頭の空白を除いて文字単位で同じ（1-1）。セレクター `Click` の8つの引数（`ClickType`・`MouseClick`・`MousePositionRelativeToElement`・`OffsetX`・`OffsetY`・`WaitForPageToLoadTimeout`・`BrowserInstance`・`Control`）を3行ともこの並びで書いている。**名前・型・列挙値の不一致 0**（資産4から引き継いだアクションとして、資産4の verification-log.md 10-0 の「今の版の照合」〔PAD 11.2609.183.0 のファイルとの照合：`ClickBase` の入力プロパティ `MouseClick`＝`System.Boolean`、`ClickType`＝列挙型 `ClickType` の `LeftClick`、`MousePositionRelativeToElement`＝列挙型 `RectangleEdgePoint` の `MiddleCenter`、`OffsetX`・`OffsetY`・`WaitForPageToLoadTimeout`＝`System.Int32`、`BrowserInstance`・`Control` は基底クラスのプロパティ〕の結論を引き継ぐ。根拠は3行が資産4と文字単位で同じこと）。資産5の今の版での PAD のファイルとの再照合は、この作業の環境で PAD のインストール先が既定の場所に見つからなかったため行っていない |
| **ステートメント数（04e の反映後）** | 反映の前と同じ **229** の見込み（変えたのはアクション行3行の引数と、既存のコメント行1行の文だけで、行の追加・削除は無い。資産4でも同じ変更で 128 → 128 だった：資産4の verification-log.md 10-0）。構文解析器での再実行はしていない（上の行と同じ理由） |
| UI 要素の定義（末尾の JSON） | `Repository` 部分（3画面・8要素・`CustomSelector` 同じ・`InstanceId` 重複なし）は資産4と**同じ**。違うのは末尾の `ConnectionReferences`（資産4は空、今の版はプレースホルダー 2 件。JSON として読めることを確認）。マーカー行は 1 回。`appmask` の参照は延べ 13 か所（資産4と同じ） |
| 未定義の変数・括弧・ブロック | 未定義の変数 0（ラベル `ErrorEnd` と UI 要素 `appmask` を除く）。`BLOCK`／`IF`／`LOOP`（31）と `ON ERROR`／`ON BLOCK ERROR`（20）の合計 51 に対し `END` が 51 で、入れ子は閉じている。`'''` の対はパーサーが受け付けた |
| **新しく使ったアクションの名前・パラメーター名・列挙値**（ローカルの定義と照合） | **不一致 0**（下の表の 10 種類・14 か所。資産4から引き継いだ行は資産4の照合〔04d：38 か所不一致 0。04e の今の版も 38 か所不一致 0：資産4の verification-log.md 10-0〕の対象と同じ行） |
| `ON ERROR` の付け先 | 11 か所（下の表）。ローカルの定義でエラーの種類を宣言しているのは 9 か所、残る 2 か所はコネクタ（3 の A9）。**宣言していないアクションへの `ON ERROR` は 0**（照合できたものについて） |
| `NEXT ACTION`（構文解析器は通すがデザイナーが受け付けない書き方） | **0 件**。`ON ERROR` の中身はすべて空 |
| 固定秒数の待機 | `WAIT 2` の 1 か所だけ（資産4と同じ） |
| 実値 | SharePoint のサイト名・URL・フォルダー名・Teams の投稿先・接続の名前・ID（GUID）・メールアドレス・テナント名は `Main.txt` に無い（`<保存先サイトの URL>`・`<保存先フォルダー>`・`<投稿先>`・`<保存先サイト>`・`<サイト名> - <保存先サイト>`・`<SharePoint 接続参照ID／名／接続名>`・`<Teams 接続参照ID／名／接続名>` のプレースホルダー）。URL は `http://localhost:8080` のみ。ID/PW は demo-user／demo-pass のみ |

**新しく使ったアクション（資産5で追加。ローカルの定義と照合できたもの）**

| アクション（`Main.txt`） | アクション クラス | 確認したこと |
|--------------------------|-------------------|--------------|
| `File.ConvertToBinary`（No.142・147） | `ConvertFileToBinaryAction`（`Name`・`Id` なし → クラス名から `ConvertToBinary`）。セレクターなし | 引数 `File`（入力）・`BinaryData`（出力）。`ThrowsAttribute`：`FileNotFoundError`・`ConvertFileToBinaryError`。「ファイルをバイナリ データに変換」に当たる |
| `File.ConvertFromBinary`（No.122） | `ConvertBinaryToFileAction`。セレクターなし | 引数 `BinaryData`・`File`・`IfFileExists`。**このアクションの `IfFileExists` の列挙型は `IfExists`（`DoNothing`／`Overwrite`）なので、`File.IfExists.Overwrite` と書く**（最初の版は `File.IfFileExists.Overwrite` と書いていて誤り。実機の出力で気づき、定義を確認して直した。`File.WriteToCSVFile.WriteCSV` の `IfFileExists` は別の列挙型 `IfFileExists`〔`Overwrite`／`Append`〕で、`File.IfFileExists.Overwrite` のままで正しい）。`ThrowsAttribute`：`InvalidDirectoryError`・`ConvertBinaryToFileError` |
| `File.ReadFromCSVFile.ReadCSV`（No.123） | `ReadFromCSVFileAction`、セレクター `ReadFromCSVFileSelector`（`ActionName` ＝ `ReadCSV`） | 引数 `CSVFile`・`Encoding`（列挙 `UTF8`）・`TrimFields`・`FirstLineContainsColumnNames`・`ColumnsSeparator`（列挙 `Comma`）・`CSVTable` はすべてセレクターの引数に含まれる。`ThrowsAttribute`：`ReadFromCsvError` |
| `Variables.RetrieveDataTableColumnIntoList`（No.124） | 同名クラス。セレクターなし | 引数 `DataTable`・`ColumnNameOrIndex`（文字列）・`ColumnAsList`（出力・リスト）。`ThrowsAttribute`：`ColumnNameNotFoundError`・`ColumnIndexOutOfRangeError` |
| `Variables.AddRowToDataTable.AppendRowToDataTable`（No.137。資産4 No.88 と同じセレクター） | `AddRowToDataTable` | `RowToAdd` の型は `List<object>` なので、14個の要素のリストで渡している（行オブジェクトそのものは渡していない） |
| `Variables.CreateNewDatatable`・`Variables.DeleteRowFromDataTable`（No.132〜133） | 資産4 No.16〜17 と同じ書き方 | 同じ |
| `Text.ConvertDateTimeToText.FromCustomDateTime`（No.154・179。資産4 No.10 と同じ） | 同じ | 同じ |
| `Text.Replace.ReplaceTextWithRegex`（No.145・180・181。資産4 No.104 と同じセレクター） | 同じ | 引数 `Text`・`TextToFind`・`IgnoreCase`・`ReplaceWith`・`ActivateEscapeSequences`・`Result` はセレクターの引数に含まれる。**「テキストを置換する」には個別のエラー時の設定を付けていない**（資産4の 10-0f と同じ理由） |
| `DateTime.GetCurrentDateTime.Local`（No.178。資産4 No.9 と同じ） | 同じ | 同じ |
| 構文：`IF`／`ELSE`、`IF Contains(…)`、`SET x TO x + y`、`ERROR => PrevError Reset: False`、`LOOP FOREACH … IN <データ テーブルまたはリスト>`、`%x[0]%`、`%x.RowsCount%` | — | **構文解析器は受け付けた**（エラー 0・書き戻し一致）。ただし構文解析器は関数名・プロパティ名を検証しないため、`Contains(…)` が PAD で有効な書き方か・データ テーブルの行に `[0]` で列を指定できるか・`RowsCount` が使えるかは**実機で確認する**（5 の R1）。`RowsCount` の文字列は PAD の実行時の DLL（`Robin.Shared.Runtime`）にあることだけ確認した |

**個別のエラー時の設定（`ON ERROR`）を付けているアクション**

| アクション表 No. | アクション | エラーの種類の宣言（`ThrowsAttribute`） | 付けられるか |
|------------------|------------|------------------------------------------|--------------|
| 資産4から引き継いだ 8 か所 | ウィンドウにフォーカス（3）・テキスト入力（2）・JavaScript・クリック（No.46→47。04e の反映後も直後の空の `ON ERROR` ／ `END` はそのまま）・待機 | 資産4の照合表（04d・04e）のとおり | 付けられる（資産4で実機確認済み） |
| 111（→112） | `External.InvokeCloudConnector`（前回の `latest.csv` の取得） | ローカルに無い。実機の PAD が出力した形（`ON ERROR`／`END`、内容は「フロー実行を続行する・次のアクションに移動」）に合わせた | 実機の PAD が出力した形。今の版の貼り付け・保存は未確認 |
| 182（→183） | `External.InvokeCloudConnector`（失敗通知の Teams 投稿） | 同上 | 同上 |
| 185（→186） | `WebAutomation.CloseWebBrowser` | `CloseWebBrowserError` | 付けられる（資産4と同じ） |

## 3. 実機の PAD が出した書式との照合と、確認済み／未確認

SharePoint・Teams のアクションは、PAD の「クラウド コネクタ」として実行時に Microsoft のサービスから定義が取得されるため、この PC のローカルには定義が無く、ローカルの照合はできない。代わりに、**実機（PAD 11.2609.183.0）の事実**を根拠にする。

### 3-1. 実機で起きた事実（デスクトップ版のセッションの報告。2026-10-20）

- 最初の版（コミット `1c93b3f`）の `Main.txt` を貼り付けた：229 アクションで貼り付けはできた。
- SharePoint・Teams のコネクタ 5 行が「不明なアクション」になり、保存できなかった（「コネクタ定義の準備に失敗しました」）。
- デスクトップ版のセッションが手で配置し直して保存に成功し、PAD が出力した書式を報告してきた：`@@dataset`／`@@path`／`@@folderPath`／`@@connectionDisplayName` の注釈の行、`Connection: '<GUID>'`、`ConnectorId: '/providers/Microsoft.PowerApps/apis/shared_…'`、`OperationId: '…'`、`@` 付きの入力・出力、`File.IfExists.Overwrite`、末尾の `ConnectionReferences`（`ConnectorId`／`DisplayName`／`LogicalName`／`ConnectionName`）。
- 最初の版の誤り：コネクタの書式のほか、`File.ConvertFromBinary` の列挙値（`File.IfFileExists.Overwrite` → 正しくは `File.IfExists.Overwrite`。ローカルの定義でも確認）、`inferContentType` の値（False → 実機の既定は True）。

### 3-2. 今の版の確認状況

| # | 項目 | 状況 |
|---|------|------|
| A1 | コネクタのアクションの書式 | **実機の PAD が出した書式に合わせて直した**。構文解析器はエラー 0・書き戻しが全行一致。**直した版の貼り付け・保存は未確認** |
| A2 | `Connection`（接続参照 ID）・接続参照名・サイト・フォルダー・投稿先 | **プレースホルダーのまま**（実値は書かない）。貼り付けただけで保存できるかは**未確認**。再設定の手順は README の 3、reference.md の 6-2 |
| A3 | `ConnectionReferences`（末尾の JSON）のプレースホルダー 2 件 | キー名は実機の報告どおり。値はプレースホルダー。この形での貼り付けは**未確認** |
| A4 | Teams の操作名と入力名（`PostMessageToConversation`、`poster`・`location`・`body/recipient`・`body/messageBody`） | 実機の PAD が出した形。**作成者の個人チャット（Flow ボット）への投稿が実際にできるかは未確認** |
| A5 | **C1：`PreviousBinary` の型**（`GetFileContentByPathResponse`） | **未確認**。応答型で、ファイルの内容そのものではない可能性がある。`File.ConvertFromBinary` に直接渡しているので、実行時に変数ペインで確認する。違った場合の直し方は reference.md の 6-3 |
| A6 | **C2：`latest.csv` の上書き** | **未確認（推測）**。SharePoint「ファイルの作成」に「ファイルが存在する場合」の設定が無く、上書きできない可能性が高い。`Main.txt` は現時点の最善の形（`CreateFile` のまま）。候補（削除してから作成／ファイルの更新）は reference.md の 6-3 |
| A7 | **C3：`inferContentType`** | 実機の既定の True にした。True で日本語が文字化けしないかは**未確認** |
| A8 | 前回の `latest.csv` が「無い」ときのエラー情報の文面 | `404`／`NotFound` など 5 種の文字で判定する**推測**。応答型の変数に変わったことで、取得失敗時に `PreviousBinary` が `NONE` のまま残る前提が成り立つかも**未確認** |
| A9 | コネクタのアクションに付ける `ON ERROR`（No.111・182） | 実機の PAD の出力にも `ON ERROR`／`END` があった（続行・次のアクションへ）。形は一致。実際に失敗を続行できるかは**未実行** |
| A10 | `<br>` で改行した本文が Teams に正しく表示されるか。`%%20`（`%20` に置換）が期待どおりか | **未確認** |

- 構文解析器は、アクションの名前や設定の正しさの根拠にならない（資産4の 10-0 と同じ）。**「実機で動いた」とは書いていない。**

## 4. 実機の結果（実行は未実施。デスクトップ版の実行結果が出てから追記する）

| 項目 | 内容 |
|------|------|
| 最初の版（`1c93b3f`）の貼り付け | 2026-10-20、PAD 11.2609.183.0。229 アクションで貼り付けできたが、コネクタ 5 行が「不明なアクション」で保存できなかった（3-1）。手で配置し直して保存に成功 |
| 今の版の貼り付け・保存・設定（5-13） | **未確認**（`<コミット ID>`。貼り付け直後と設定後のエラー ペインの件数、ステータス バーのアクション数〔見込み 229〕、UI 要素の画面数・要素数〔3・8〕、README の設定手順のとおりだったか） |
| 3か所のクリックの「物理的なクリックを送信」（5-13 (f)） | **未確認**（デザイナーで No.46 ログインボタン・No.80「詳細」・No.96「一覧へ戻る」を開いたときの状態。3か所とも「オフ」の見込み） |
| 実行ログの Click の `mouseClick`（5-14 (f)〜5-16 (f)・5-18 (e)） | **未確認**（各回の時刻の範囲の Click の記録の件数〔要素別〕・`mouseClick` の値ごとの件数〔True 0 件の見込み〕・成否・ログインボタンの Click の回数。実行ログは `%LOCALAPPDATA%MicrosoftPower Automate DesktopDataCollection*RobinRobot.log`。件数と値だけを書き、ログの本文やユーザー名を含むパスは書かない） |

| 場面（順序は 初回 → 新規あり → 新規0件 → Excel で確認 → 失敗） | 条件 | 開始／終了時刻 | 結果 | Teams の投稿（届いたか・文言） | SharePoint の状態 | CSV の確認 |
|---------------------------------------------------------------|------|----------------|------|-------------------------------|-------------------|------------|
| 5-14 初回 | モック20件・`latest.csv` 無し | 未実施 | 未確認 | 未確認（「初回実行のため、全 20 件を保存しました（比較する前回データがありません）」＋リンク） | 未確認（履歴ファイルと `latest.csv`） | 未確認（4,135 バイト・BOM あり・14列・20行） |
| 5-15 新規あり | モック22件（2件追加）・`latest.csv` は20件 | 未実施 | 未確認 | 未確認（「新規案件が 2 件あります」＋2件の内容＋リンク） | 未確認（`latest.csv` が上書きされ22件。C2） | 未確認（22行） |
| 5-16 新規0件 | モック22件のまま再実行 | 未実施 | 未確認 | 未確認（「新規案件はありません（全 22 件を確認しました）」＋リンク） | 未確認 | 未確認 |
| 5-17 SharePoint 上の CSV を Excel で開く | — | 未実施 | 未確認 | — | — | 未確認 |
| 5-18 失敗（モックを止める） | モックのサーバーを停止 | 未実施 | 未確認 | 未確認（「取得に失敗しました。手順◯◯で停止」・リンクなし） | 未確認（実行前から変わらない） | 未確認（ローカルに今回分が出力されない） |

- 実行時間は参考として記録する（採点しない）。
- 結果が出るまで、どの欄も「確認済」とは書かない。
- 04e の反映（1-1）で `Main.txt` が変わったため、反映より前の版で実機の確認をしていた場合でも、反映後の版ですべての場面をやり直す（合格基準書の追補 A9）。

## 5. 実機で確認してほしいこと（レビュー②・進行役向け）

| # | 内容 |
|---|------|
| R0 | 直した版の `Main.txt` を貼り付けて保存できるか（プレースホルダーのまま／接続参照・サイトを選び直したあと）。保存できない場合は、エラーの文言と、どの行かを報告（reference.md の 6-2） |
| R1 | `IF Contains(…)`、`%NewRow[0]%`（データ テーブルの行の列を番号で指定）、`%CurrentTable.RowsCount%`、`SET x TO x + y`（文字・数値の連結）が PAD で意図どおり動くか（エラー ペイン、投稿文の内容） |
| R2 | Teams の作成者の個人チャット（Flow ボット）への投稿がデスクトップ版のコネクタでできるか（できない場合の扱いは人が決める） |
| R3 | **C2**：SharePoint の「ファイルの作成」で、既存の `latest.csv` が上書きされるか（されなければ、削除してから作成／ファイルの更新に変える。reference.md の 6-3）。履歴ファイルのリンク（サイトの URL ＋フォルダー＋ファイル名）が開けるか |
| R4 | 前回の `latest.csv` が無いときのエラー情報の文面（reference.md の 4 の判定の文字で「無い」と判定できるか）。取得失敗時に `PreviousBinary` が `NONE` のままか |
| R5 | 失敗通知の `手順◯◯` が、画面のメッセージの先頭と同じ文言で投稿されるか（`StopStep` の正規表現）。PAD のエラー情報にユーザー名を含むパスが残っていないか |
| R6 | 失敗通知の投稿自体を失敗させた場合に、画面のメッセージとブラウザーを閉じる処理が飛ばされないか（任意。実機で再現しにくい） |
| R7 | **C1**：`PreviousBinary` の型と中身（変数ペイン）。`File.ConvertFromBinary` がそのまま使えたか、プロパティを指定する必要があったか |
| R8 | **C3**：`inferContentType` が True で、`previous.csv` の日本語が壊れないか |
| R9 | **04e の反映**：貼り付けて保存したフローのデザイナーで、No.46・80・96 の「物理的なクリックを送信」が3つともオフか。各場面の実行で、実行ログの Click の `mouseClick` がすべて False（True が 0 件）・すべて成功か、ログインボタンの Click の回数（やり直しが起きたか）。実行中はマウス・キーボードを操作しない（README の 4） |
