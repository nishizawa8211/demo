# 申込状況チェック_通知付き — 検証ログ（照合の結果・照合できなかったもの・実機の結果）

当日の手順は [README.md](./README.md)、設定値・エラー表・アクション表は [reference.md](./reference.md)。資産5（付加価値・保留）の記録で、デモ本編の資産4（`flows/application-check/`）の検証ログとは別。

| 節 | 内容 |
|----|------|
| 1 | 経緯と今の版 |
| 2 | PAD の定義との照合（今の版） |
| 3 | **照合できなかったもの**（SharePoint・Teams のアクションなど） |
| 4 | 実機の結果（**未実施**。結果が出てから追記する） |
| 5 | 実機で確認してほしいこと（レビュー②・進行役向け） |

---

## 1. 経緯と今の版

- 2026-10-20：人の決定でスプリント05 を付加価値（保留）として別資産 `flows/application-check-notify/` に作った。資産4の `Main.txt`（コミット `12be3e2` の版）を出発点にコピーし、手順5〜6 と失敗時の Teams 通知を足した（差分は reference.md の 1）。
- 実機（デスクトップ版）で分かっていたこと：SharePoint「ファイルの作成」の「ファイル コンテンツ」はバイナリ必須（「ファイルをバイナリ データに変換」を経由）。フォルダーのパスは直接入力、サイトは一覧から選択。接続参照は作成済み。→ `Main.txt` に反映した。
- 今の版の `Main.txt`：**コミット ID は未記入**（コミット後に進行役が追記する。`<コミット ID>`）。実機で試す前に、この版のコミット ID を記録する。

## 2. PAD の定義との照合（今の版。2026-10-20）

照合に使ったのは、この PC の PAD 11.2609.183.0 の構文解析器（`Microsoft.Flow.RPA.Desktop.Robin.Language.dll` の `LangParser.GetStatements`）と、各アクション モジュール（`Microsoft.Flow.RPA.Desktop.Modules.*.Actions.dll`）の定義（PowerShell で読み込み、`ActionAttribute` の `Name` → `Id` → クラス名、`ThrowsAttribute`、セレクターの `ActionName` と引数、列挙値を確認）。04b〜04d と同じ方法で、SharePoint・Teams の定義だけはローカルに無い（3）。

| 確認したこと | 結果 |
|--------------|------|
| 構文解析器（`LangParser.GetStatements`） | **エラー 0**、**229 ステートメント**（内訳：アクション 44、コネクタ 5、代入 56、コメント 41、If 17、Else 4、End 31、ブロック 9、For each 4、Loop 1、Wait 7、Goto 6、エラー取得 2、Label 1、Exit 1）。PAD のステータス バーの表示は実機で確認していない（資産4は構文解析器の数と実機の表示が一致していた） |
| 書き戻し（解析結果を PAD の書式で文字列に戻す） | 空でない行 278 行のうち **277 行が一致**。残る 1 行は、前回取得のコネクタの行の末尾 `Result=> PreviousBinary`（構文解析器はコネクタのアクションの出力を書き戻さない）。**貼り付けでこの出力が引き継がれない可能性があるため、README の 3 の 4b に人が設定する手順を書いた** |
| 手順0〜4 の回帰 | `Main.txt` の手順0〜4（`# 手順0. 初期化` から `Step4_WriteCsv` の `END` まで 144 行）は、資産4（`12be3e2`）と**文字単位で同じ**。アクション行は資産4の 107 行がすべて順に含まれる（reference.md の 7 で No. の対応を確認できる） |
| UI 要素の定義（末尾の JSON） | マーカー行から最後まで資産4と**バイト単位で同じ**（3画面・8要素・`CustomSelector` 同じ・`InstanceId` 重複なし）。マーカー行は 1 回。`appmask` の参照は延べ 13 か所（資産4と同じ。資産5で UI 要素は足していない） |
| 未定義の変数・括弧・ブロック | 未定義の変数 0（ラベル `ErrorEnd` と UI 要素 `appmask` を除く）。`BLOCK`／`IF`／`LOOP` と `END` の入れ子は閉じている。`'''` の対はパーサーが受け付けた |
| **新しく使ったアクションの名前・パラメーター名・列挙値**（ローカルの定義と照合） | **不一致 0**（下の表の 10 種類・14 か所。資産4から引き継いだ行は資産4の照合〔04d：38 か所不一致 0〕の対象と同じ行） |
| `ON ERROR` の付け先 | 11 か所（下の表）。ローカルの定義でエラーの種類を宣言しているのは 9 か所、残る 2 か所はコネクタ（3 の A6）。**宣言していないアクションへの `ON ERROR` は 0**（照合できたものについて） |
| `NEXT ACTION`（構文解析器は通すがデザイナーが受け付けない書き方） | **0 件**。`ON ERROR` の中身はすべて空 |
| 固定秒数の待機 | `WAIT 2` の 1 か所だけ（資産4と同じ） |
| 実値 | SharePoint のサイト名・URL・フォルダー名・Teams の投稿先・接続の名前・ID・メールアドレス・テナント名は `Main.txt` に無い（`<保存先サイトの URL>`・`<保存先フォルダー>`・`<投稿先>`・`<保存先サイト>`・`<SharePoint 接続参照（作成時に設定）>`・`<Teams 接続参照（作成時に設定）>` のプレースホルダー）。URL は `http://localhost:8080` のみ。ID/PW は demo-user／demo-pass のみ |

**新しく使ったアクション（資産5で追加。ローカルの定義と照合できたもの）**

| アクション（`Main.txt`） | アクション クラス | 確認したこと |
|--------------------------|-------------------|--------------|
| `File.ConvertToBinary`（No.142・147） | `ConvertFileToBinaryAction`（`Name`・`Id` なし → クラス名から `ConvertToBinary`）。セレクターなし | 引数 `File`（入力）・`BinaryData`（出力）。`ThrowsAttribute`：`FileNotFoundError`・`ConvertFileToBinaryError`。「ファイルをバイナリ データに変換」に当たる |
| `File.ConvertFromBinary`（No.122） | `ConvertBinaryToFileAction`。セレクターなし | 引数 `BinaryData`・`File`・`IfFileExists`（列挙：`DoNothing`／`Overwrite`。`Overwrite` を使用）。`ThrowsAttribute`：`InvalidDirectoryError`・`ConvertBinaryToFileError` |
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
| 資産4から引き継いだ 8 か所 | ウィンドウにフォーカス（3）・テキスト入力（2）・JavaScript・クリック・待機 | 資産4の照合表（04d）のとおり | 付けられる（資産4で実機確認済み） |
| 111（→112） | `External.InvokeCloudConnector`（前回の `latest.csv` の取得） | ローカルに無い（3 の A6）。構文解析器は受け付けた | 構文解析器は受け付けた。デザイナーの検証は**未確認** |
| 182（→183） | `External.InvokeCloudConnector`（失敗通知の Teams 投稿） | 同上 | 同上 |
| 185（→186） | `WebAutomation.CloseWebBrowser` | `CloseWebBrowserError` | 付けられる（資産4と同じ） |

## 3. 照合できなかったもの（正直な記録）

SharePoint と Teams のアクションは、PAD の「クラウド コネクタ」として実行時に Microsoft のサービスから定義（Swagger）が取得される。この PC のインストール先・ローカルの保存先（`%LOCALAPPDATA%` 配下）を調べたが、SharePoint・Teams の定義ファイルは**見つからなかった**。そのため次は**照合できていない**。`Main.txt` に書いた値は、コネクタの一般的な操作名と入力名に基づく**推測**で、実機の貼り付け・設定で補う。

| # | 照合できなかったこと | `Main.txt` に書いたこと（推測） | 補う方法 |
|---|----------------------|----------------------------------|----------|
| A1 | コネクタのアクションの書式 | PAD の構文解析器が持つ `InvokeCloudConnectorStatement`（アクション名 `External.InvokeCloudConnector`、静的な入力 `Connection`・`ConnectorId`・`OperationId`、省略できる `timeout`、動的な入力・出力）に合わせた。構文解析器はこの書式を受け付けた（エラー 0） | 実機の貼り付け（5-13）。受け付けられない場合は reference.md の 6 で手で配置する |
| A2 | `Connection`（接続参照）の書き方 | プレースホルダーの文字列。実際の接続参照の指定の書式は不明 | 貼り付け後、各アクションで作成済みの接続参照を選ぶ（README の 3 の 1） |
| A3 | SharePoint の操作名と入力名 | `GetFileContentByPath`（`dataset`・`path`・`inferContentType`）、`CreateFile`（`dataset`・`folderPath`・`name`・`body`） | 貼り付け後、PAD の画面の項目に合わせて選び直す（reference.md の 6）。動的な入力名の書き方（`/` を含む名前は構文解析器が受け付けない）は不明 |
| A4 | Teams の操作名と入力名 | `PostMessageToConversation`（`poster`・`location`・`body_recipient`・`body_messageBody`）。**作成者の個人チャット（Flow ボットとのチャット）に投稿できるか、デスクトップ版のコネクタで使えるかも未確認** | 実機（5-14〜5-16・5-18）。できない場合は人が代替の投稿先を決める |
| A5 | SharePoint の `CreateFile` の出力と、既存の `latest.csv` の上書き | 出力は使っていない（リンクはサイトの URL ＋フォルダー＋ファイル名から組み立てる）。**上書きされるか不明** | 実機（5-15）。上書きされずにエラーになる場合は、ファイルの更新に変える |
| A6 | コネクタのアクションに付ける `ON ERROR` のエラーの種類 | 構文解析器は受け付けた。`Language.dll` に `ConnectorTimeoutError`・`ConnectorExecutionError` の文字列があることは確認したが、`ThrowsAttribute` による宣言はローカルに無く、デザイナーの検証は未確認 | 実機の貼り付け（エラー ペインの件数） |
| A7 | 前回の `latest.csv` が「無い」ときのエラー情報の文面 | `404`／`NotFound`／`not found`／`見つかりません`／`存在しません` のどれかを含めば「無い」と判定（reference.md の 4） | 実機（5-14）。初回で別の失敗として止まったら、文面を報告して判定の文字を直す |
| A8 | コネクタのアクションの出力（ファイルの内容）を変数 `PreviousBinary` に入れる設定 | `Result=> PreviousBinary`（構文解析器は書き戻さない） | 貼り付け後に人が設定（README の 3 の 4b） |
| A9 | `<br>` で改行した本文が Teams に正しく表示されるか。`%%20`（`%20` に置換）が期待どおりか | `<br>`・`%%20` | 実機（5-14・5-15） |

- 構文解析器は、アクションの名前や設定の正しさの根拠にならない（資産4の 10-0 と同じ）。上の A1〜A9 は、実機で貼り付け・設定・実行してはじめて分かる。**「照合できた」とは書いていない。**

## 4. 実機の結果（未実施。デスクトップ版の実行結果が出てから追記する）

| 項目 | 内容 |
|------|------|
| 日付・PAD の版・試した `Main.txt` のコミット ID | **未実施**（`<コミット ID>`） |
| 5-13 貼り付け・保存・設定 | **未確認**（貼り付け直後と設定後のエラー ペインの件数、ステータス バーのアクション数〔見込み 229〕、UI 要素の画面数・要素数〔3・8〕、README の設定手順のとおりだったか） |

| 場面（順序は 初回 → 新規あり → 新規0件 → Excel で確認 → 失敗） | 条件 | 開始／終了時刻 | 結果 | Teams の投稿（届いたか・文言） | SharePoint の状態 | CSV の確認 |
|---------------------------------------------------------------|------|----------------|------|-------------------------------|-------------------|------------|
| 5-14 初回 | モック20件・`latest.csv` 無し | 未実施 | 未確認 | 未確認（「初回実行のため、全 20 件を保存しました（比較する前回データがありません）」＋リンク） | 未確認（履歴ファイルと `latest.csv`） | 未確認（4,135 バイト・BOM あり・14列・20行） |
| 5-15 新規あり | モック22件（2件追加）・`latest.csv` は20件 | 未実施 | 未確認 | 未確認（「新規案件が 2 件あります」＋2件の内容＋リンク） | 未確認（`latest.csv` が上書きされ22件） | 未確認（22行） |
| 5-16 新規0件 | モック22件のまま再実行 | 未実施 | 未確認 | 未確認（「新規案件はありません（全 22 件を確認しました）」＋リンク） | 未確認 | 未確認 |
| 5-17 SharePoint 上の CSV を Excel で開く | — | 未実施 | 未確認 | — | — | 未確認 |
| 5-18 失敗（モックを止める） | モックのサーバーを停止 | 未実施 | 未確認 | 未確認（「取得に失敗しました。手順◯◯で停止」・リンクなし） | 未確認（実行前から変わらない） | 未確認（ローカルに今回分が出力されない） |

- 実行時間は参考として記録する（採点しない）。
- 結果が出るまで、どの欄も「確認済」とは書かない。

## 5. 実機で確認してほしいこと（レビュー②・進行役向け）

| # | 内容 |
|---|------|
| R1 | `IF Contains(…)`、`%NewRow[0]%`（データ テーブルの行の列を番号で指定）、`%CurrentTable.RowsCount%`、`SET x TO x + y`（文字・数値の連結）が PAD で意図どおり動くか（エラー ペイン、投稿文の内容） |
| R2 | Teams の作成者の個人チャット（Flow ボット）への投稿がデスクトップ版のコネクタでできるか（できない場合の扱いは人が決める） |
| R3 | SharePoint の「ファイルの作成」で、既存の `latest.csv` が上書きされるか。履歴ファイルのリンク（サイトの URL ＋フォルダー＋ファイル名）が開けるか |
| R4 | 前回の `latest.csv` が無いときのエラー情報の文面（reference.md の 4 の判定の文字で「無い」と判定できるか） |
| R5 | 失敗通知の `手順◯◯` が、画面のメッセージの先頭と同じ文言で投稿されるか（`StopStep` の正規表現）。PAD のエラー情報にユーザー名を含むパスが残っていないか |
| R6 | 失敗通知の投稿自体を失敗させた場合に、画面のメッセージとブラウザーを閉じる処理が飛ばされないか（任意。実機で再現しにくい） |
