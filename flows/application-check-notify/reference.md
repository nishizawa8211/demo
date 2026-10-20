# 申込状況チェック_通知付き — リファレンス（資産5・付加価値（保留））

当日の手順は [README.md](./README.md)。照合・実機の記録は [verification-log.md](./verification-log.md)。資産4（デモ本編）は `flows/application-check/` で、この資産5とは別。

| 節 | 内容 |
|----|------|
| 1 | 資産4との差分（意図して変えた箇所） |
| 2 | UI 要素（資産4と同じ 8 要素） |
| 3 | 変数 |
| 4 | エラー表（止まった手順と Teams の通知の手順名） |
| 5 | Teams の投稿文 |
| 6 | コネクタのアクションの書式（実機の PAD の出力に合わせた）・貼り付け後の再設定・実機で確認すること（C1〜C4） |
| 7 | アクション表（`Main.txt` と1対1） |

---

## 1. 資産4との差分（意図して変えた箇所）

資産4の `Main.txt`（コミット `12be3e2` の版）との比較（`Main.txt` の手順0〜4 の本文・末尾の UI 要素の定義は**1文字も変えていない**）。

| # | 場所 | 変更 | 理由 |
|---|------|------|------|
| D1 | ファイル先頭のコメント（4行） | 資産5用の説明に書き換え | 別資産であることを分かるようにする |
| D2 | 手順0 の前（設定、アクション表 No.1〜4） | 追加：`SharePointSiteUrl`・`SharePointFolder`・`ChatRecipient`（プレースホルダー）、`NotifyOnError` ＝ YES | 実値を `Main.txt` に書かず、人が PAD 上で設定する。失敗通知を出すか決める目印 |
| D3 | 手順0〜4（アクション表 No.5〜103） | **変更なし**（順・内容とも資産4の No.1〜99 と同じ） | 回帰を起こさない |
| D4 | 手順5-1（Step5a_GetPrevious） | 追加 | 前回の `latest.csv` の取得と初回判定 |
| D5 | 手順5-2（Step5b_FindNew） | 追加 | 申込番号による新規案件の抽出 |
| D6 | 手順5-3（Step5c_Save） | 追加 | SharePoint への保存（履歴ファイル → `latest.csv`） |
| D7 | 手順6（Step6_Notify） | 追加 | Teams への投稿（毎回1回） |
| D8 | 手順7（ブラウザーを閉じる・EXIT。No.172〜173） | 内容は同じ（資産4の No.100〜101）。位置は手順6 の後 | 資産4のコメント行「手順5〜6 はここ」の位置に D4〜D7 を入れた |
| D9 | `ErrorEnd` | 追加：失敗通知（`NotifyOnError` が YES のとき、Teams に投稿）。**追加の位置は、エラー情報の取得・置換の後、画面のメッセージの前**。取得・置換・メッセージ・ブラウザーを閉じる処理は資産4と同じ行 | 失敗時の Teams 通知。通知が失敗しても止まらないよう、投稿の直後に個別のエラー時の設定を付けた |
| D10 | 手順書 | 資産5の `README.md`・`reference.md`・`verification-log.md` を新規作成 | 資産4の分割に合わせる |
| D11 | コネクタ 5 行の書式・`ConvertFromBinary` の列挙値・末尾の `ConnectionReferences`（2026-10-20、実機の貼り付けの結果を受けて修正） | 6-1 のとおり。`File.ConvertFromBinary` の `IfFileExists` を `File.IfFileExists.Overwrite` から `File.IfExists.Overwrite` に変更（このアクションの列挙型は `IfExists`。`WriteCSV` の `File.IfFileExists.Overwrite` は別の列挙型で正しい） | 実機の PAD が出力した書式に合わせる |

- UI 要素（末尾の JSON の `Repository` 部分）は資産4とバイト単位で同じ（3画面・8要素・`InstanceId` 重複なし）。資産5で UI 要素は足していない。違うのは末尾の `ConnectionReferences`（資産4は空、資産5はプレースホルダー 2 件。6-1）だけ。
- 手順5〜6 の失敗も `ErrorEnd`（画面のメッセージ・Teams の失敗通知・ブラウザーを閉じる）に集まる。

---

## 2. UI 要素（資産4と同じ。貼り付けで自動登録）

| No | 画面名 | 要素名 | セレクター |
|----|--------|--------|------------|
| U1 | LoginPage | login-id | `#login-id` |
| U2 | LoginPage | login-password | `#login-password` |
| U3 | LoginPage | login-button | `#login-button` |
| U4 | ListPage | application-table-loaded | `#application-table[data-loaded="true"]` |
| U5 | ListPage | application-count | `#application-count` |
| U6 | ListPage | detail-button | `button[data-action="detail"][data-application-no="%CurrentNo%"]` |
| U7 | DetailPage | application-detail-loaded | `#application-detail[data-loaded="true"]` |
| U22 | DetailPage | back-to-list-button | `#back-to-list-button` |

- 表示テキスト・行番号・クラス・階層位置・デモ操作エリアに依存しない（資産4と同じ基準）。UI 要素を手で登録する予備手順は資産4の reference.md の 3-1 と同じ。

---

## 3. 変数

資産4の変数（`StepMessage`・`BaseUrl`・`LoginId`・`LoginPassword`・`WorkFolder`・`RunDateTime`・`RunStamp`・`HistoryFileName`・`CurrentTable`・`ApplicationNos` など）は資産4の reference.md の 4 と同じ。資産5で足した変数：

| 変数 | 内容 | 設定場所（アクション表 No.） |
|------|------|------------------------------|
| `SharePointSiteUrl` | 保存先サイトの URL（**プレースホルダー**。リンクの組み立てに使う） | 1 |
| `SharePointFolder` | 保存先フォルダー（ライブラリを含むパス。**プレースホルダー**・直接入力） | 2 |
| `ChatRecipient` | 投稿先（作成者本人。**プレースホルダー**） | 3 |
| `NotifyOnError` | 失敗通知を出すか（YES／NO）。手順6 に入るとき NO | 4・152 |
| `PreviousExists` | 前回の `latest.csv` の有無（True／False）。無ければ初回扱い | 108・117・127 |
| `PreviousBinary` | 取得した前回の `latest.csv`。実機の出力名は `GetFileContentByPathResponse`（応答型の可能性があり、バイナリそのものかは未確認。6-3 の C1）。取得に失敗した場合は `NONE` のまま | 110・111 |
| `PrevError`／`PrevErrorText` | 前回の取得が失敗したときのエラー情報（「無い」か別の理由かの判定に使う） | 113・115 |
| `PreviousTable`／`PreviousNos` | 前回の CSV の内容／申込番号のリスト | 123・124 |
| `PreviousNosKey` | `,申込番号,申込番号,…,` の形の文字（新規判定の比較用） | 109・126 |
| `NewRows` | 新規案件（`CurrentTable` の行のうち、申込番号が前回に無いもの。14列） | 132〜137 |
| `HistoryBinary`／`LatestBinary` | 保存用にバイナリへ変換した履歴ファイル／`latest.csv` | 142・147 |
| `HistoryFileLink` | 履歴ファイルへのリンク（サイトの URL ＋ フォルダー ＋ ファイル名。空白は `%20` に置換） | 144・145 |
| `RunDateTimeText` | 取得日時の文字（`yyyy/MM/dd HH:mm`） | 154 |
| `PostPattern`／`PostMessage` | 投稿のパターン（初回／新規あり／新規0件）／投稿する文 | 156〜170 |
| `NewLines`／`NewIndex`／`NewLine`／`NewRow` | 新規あり の各案件の行を組み立てる | 161〜166 |
| `ErrorDateTime`／`ErrorDateTimeText` | 失敗した時刻 | 178・179 |
| `StopStep` | 止まった手順の名前（`StepMessage` の先頭の「手順◯◯」） | 180 |
| `ErrorDetailHtml` | `ErrorDetail`（ユーザー名を含むパスを伏せた版）の改行を `<br>` にしたもの | 181 |

---

## 4. エラー表（止まった手順と Teams の通知の手順名）

画面のメッセージは `StepMessage`（先頭が手順名）に「（PAD のエラー情報：…）」を足した形で、資産4と同じ。Teams の失敗通知の「手順◯◯」は、その `StepMessage` の先頭の「手順◯◯」の部分（`Main.txt` の `StopStep` の正規表現が切り出す）。

| No | どこで止まったか | Teams の通知の手順名 | 画面のメッセージ（`StepMessage` の先頭） |
|----|------------------|----------------------|------------------------------------------|
| E0 | 手順0（初期化） | 手順0 | 手順0：初期化…に失敗しました |
| E1 | 手順1-1〜1-2（モックに接続できない） | 手順1-1〜1-2 | 手順1-1〜1-2：モック画面に接続できません… |
| E2 | 手順1-3〜1-4（ID・パスワードの入力／ログインボタン） | 手順1-3〜1-4 | 手順1-3〜1-4：ログイン画面で… |
| E3 | 手順1-4〜1-5／手順1-5（ログイン後に一覧が出ない） | 手順1-4〜1-5／手順1-5 | 手順1-4〜1-5：ログインボタンをクリックしても…／手順1-5：ログイン後に一覧画面が… |
| E4 | 手順2-1（申込番号の取得） | 手順2-1 | 手順2-1：一覧から申込番号を取得できませんでした |
| E5 | 手順2-2（件数表示の取得） | 手順2-2 | 手順2-2：一覧の件数表示…を取得できませんでした |
| E6 | 手順2-2（件数の不一致） | 手順2-2 | 手順2-2：件数が一致しません… |
| E7 | 手順3-1（「詳細」ボタン） | 手順3-1 | 手順3-1：申込番号 … の「詳細」ボタンを… |
| E8 | 手順3-2（詳細画面が出ない） | 手順3-2 | 手順3-2：申込番号 … の詳細画面が表示されませんでした… |
| E9 | 手順3-3〜3-4（項目の取得） | 手順3-3〜3-4 | 手順3-3〜3-4：申込番号 … の詳細画面から項目を… |
| E10 | 手順3-3（申込番号の不一致） | 手順3-3 | 手順3-3：申込番号が一致しません… |
| E11 | 手順3-4（14項目がそろわない） | 手順3-4 | 手順3-4：申込番号 … の詳細画面から14項目を… |
| E12 | 手順3-5（一覧へ戻れない） | 手順3-5 | 手順3-5：申込番号 … の詳細画面から一覧画面に… |
| E13 | 手順4（CSV の書き出し） | 手順4 | 手順4：CSV ファイルを書き出せませんでした… |
| **E14** | 手順5-1（前回の `latest.csv` の取得が「無い」以外で失敗。**初回扱いにしない**） | 手順5-1 | 手順5-1：SharePoint から前回の latest.csv を取得できませんでした… |
| **E14b** | 手順5-1（取得できたが内容を読み込めない） | 手順5-1 | 手順5-1：前回の latest.csv は取得できましたが、内容を読み込めませんでした |
| **E15** | 手順5-2（新規判定の失敗） | 手順5-2 | 手順5-2：新規案件の判定に失敗しました |
| **E16** | 手順5-3（履歴ファイルの保存の失敗。`latest.csv` は保存しない） | 手順5-3 | 手順5-3：SharePoint への履歴ファイルの保存に失敗しました… |
| **E16b** | 手順5-3（履歴ファイルは保存済みで `latest.csv` の保存に失敗） | 手順5-3 | 手順5-3：履歴ファイルは SharePoint に保存しましたが、latest.csv の保存に失敗しました… |
| **E17** | 手順6（正常時の Teams 投稿の失敗） | **通知しない**（`NotifyOnError` が NO） | 手順6：Teams への投稿に失敗しました。CSV は SharePoint に保存済みです… |

- 手順0〜4 のメッセージ全文・人がすること・実機で出た例は資産4の reference.md の 6。
- E14〜E17 は資産5で増えたエラー。手順5〜6 のエラーも手順ごとのブロックから `ErrorEnd` に集まり、メッセージ・失敗通知（E17 を除く）・ブラウザーを閉じる処理は手順0〜4 と同じ。
- **前回の取得が「無い」のか別の失敗かの見分け方**：取得の前に `PreviousBinary` を `NONE` にしておき、取得が失敗すると `NONE` のまま残る。そのときエラー情報の文面に `404`／`NotFound`／`not found`／`見つかりません`／`存在しません` のどれかがあれば「ファイルが無い」（初回扱い）、無ければ別の失敗として手順5-1 で停止する。**実機で「ファイルが無い」ときに実際に出る文面は未確認**（初回の場面で別の失敗として止まったら、出た文面を報告して判定の文字を直す）。
- **手順6 で止まったときの CSV**：CSV は SharePoint に保存済み。再実行すると今回の分が「前回」になるため新規0件になる。

---

## 5. Teams の投稿文（毎回必ず1回。投稿先は作成者本人の個人チャット）

改行は `<br>`（Teams の投稿の本文が HTML として扱われる想定。実機で `<br>` がそのまま見える場合は改行の入れ方を直す）。

| 場面 | 投稿文（`PostMessage`） |
|------|-------------------------|
| 初回 | 【申込状況チェック】初回実行のため、全 N 件を保存しました（比較する前回データがありません）（取得日時：yyyy/MM/dd HH:mm）<br><br>CSV：`<履歴ファイルへのリンク>` |
| 新規あり | 【申込状況チェック】新規案件が N 件あります（取得日時：…／全 M 件）<br><br>1. 申込番号／お客さま名／申込種別／変更前容量 → 変更後容量／ステータス<br>2. …<br><br>CSV：`<履歴ファイルへのリンク>` |
| 新規0件 | 【申込状況チェック】新規案件はありません（全 N 件を確認しました）（取得日時：…）<br><br>CSV：`<履歴ファイルへのリンク>` |
| 失敗 | 【申込状況チェック】取得に失敗しました。手順◯◯ で停止（取得日時：…）<br>`StepMessage`<br>（PAD のエラー情報：ユーザー名を含むパスを伏せた版）。**リンクは付けない** |

- リンクは履歴ファイルを指す（`latest.csv` ではない）。リンクは `SharePointSiteUrl`／`SharePointFolder`／ファイル名から組み立てる（空白は `%20`）。SharePoint の「ファイルの作成」の出力（`CreateFileResponse2`）に使えるリンクの項目があればそれに置き換えてよい（実機で確認）。
- 新規あり の各案件は、`NewRows` の列 0（申込番号）・2（お客さま名）・4（申込種別）・5（変更前容量）・6（変更後容量）・7（ステータス）を使う。
- 取得日時は、正常時は `RunDateTime`、失敗時は失敗した時刻。

---

## 6. コネクタのアクションの設定値と、貼り付け後の再設定

### 6-1. 書式（実機の PAD が出力した形に合わせた。2026-10-20）

最初の版（コミット `1c93b3f`）の書式（`ConnectorId: $'''shared_sharepointonline'''` と、`dataset:`・`body_recipient:` などの `@` 無しの入力）は**実機の PAD に受け付けられず**、SharePoint・Teams の 5 行が「不明なアクション」になって保存できなかった（「コネクタ定義の準備に失敗しました」）。デスクトップ版のセッションが手で配置し直して保存に成功し、PAD が出力した書式を報告してきたため、それに合わせて直した。実値は伏せてある（プレースホルダー）。

- `Connection: '<接続参照ID>'`（実機では GUID。ここでは `<SharePoint 接続参照ID>`／`<Teams 接続参照ID>`）
- `ConnectorId: '/providers/Microsoft.PowerApps/apis/shared_sharepointonline'`（Teams は `.../shared_teams`）
- `OperationId: 'GetFileContentByPath'`／`'CreateFile'`／`'PostMessageToConversation'`
- 入力と出力は **`@` を付ける**：`@dataset:`・`@path:`・`@folderPath:`・`@name:`・`@body:`・`@'body/recipient':`・`@'body/messageBody':`・`@<出力名>=> <変数>`
- コネクタの行の直前に、PAD が付ける注釈の行（`@@dataset:`／`@@path:`／`@@folderPath:`／`@@connectionDisplayName:`）を置いた。構文解析器は、この注釈の行を直後のステートメントに付くものとして受け付ける
- 末尾の JSON の `ConnectionReferences` に、`ConnectorId`・`DisplayName`・`LogicalName`・`ConnectionName` のキーでプレースホルダーを 2 件（SharePoint・Teams）入れた。**この形で貼り付けて保存できるかは未確認**

実値（サイトの URL・サイト名・フォルダー・投稿先・接続参照の GUID／表示名／接続名）は `Main.txt` に書かない。

### 6-2. 貼り付け後の再設定（実機で試すこと）

プレースホルダーのまま貼り付けても、保存できる保証はない（未確認）。次のどちらかで、実値に直してから保存する。

1. **PAD 上でアクションを開いて選び直す（推奨）**：5 つのコネクタのアクションを開き、「接続」で作成済みの接続参照を選び、SharePoint はサイトを一覧から選ぶ。保存できたら、`ConnectionReferences` のプレースホルダー（`<…接続参照名>` など）は PAD が実値に置き換えている。
2. **貼り付ける前にテキストで置換する**：`Main.txt` をコピーしたものの中の `<SharePoint 接続参照ID>`・`<SharePoint 接続参照名>`・`<SharePoint 接続名>`・`<Teams …>`・`<サイト名> - <保存先サイト>`・`<保存先サイト>` を、実値に置き換えてから貼り付ける（置換後のファイルは**コミットしない**）。

貼り付けただけで保存できなかった場合は、5 つのアクションを消し、次の表のとおりに手で配置する。

| No | コネクタ／操作 | 設定する内容 |
|----|----------------|--------------|
| 111 | SharePoint ／ パスによるファイル コンテンツの取得（`GetFileContentByPath`） | サイト：一覧から選ぶ。ファイル パス：`%SharePointFolder%/latest.csv`（直接入力）。「コンテンツの種類を推測する」（`inferContentType`）：実機の既定は True（最初の版は False にしていた。6-3 の C3）。出力 `GetFileContentByPathResponse` → 変数 `PreviousBinary`。直後に「個別のエラー時の設定」で**フロー実行を続行する／次のアクション**（ファイルが無くても止めないため） |
| 143 | SharePoint ／ ファイルの作成（`CreateFile`） | サイト：一覧から選ぶ。フォルダーのパス：`%SharePointFolder%`（直接入力）。ファイル名：`%HistoryFileName%`。**ファイル コンテンツ：`%HistoryBinary%`（バイナリ必須）**。出力 `CreateFileResponse2` |
| 148 | SharePoint ／ ファイルの作成（`CreateFile`） | 同上。ファイル名：`latest.csv`。ファイル コンテンツ：`%LatestBinary%`。出力 `CreateFileResponse`。**既存の `latest.csv` の上書きはできない可能性が高い（6-3 の C2）** |
| 171 | Teams ／ チャットまたはチャネルにメッセージを投稿する（`PostMessageToConversation`） | 投稿者（`poster`）：Flow bot。投稿先（`location`）：Chat with Flow bot。宛先（`body/recipient`）：`%ChatRecipient%`。メッセージ（`body/messageBody`）：`%PostMessage%`。出力 `PostMessageToConversationResponse` |
| 182 | Teams ／ 同上 | 同じ投稿先。メッセージ：失敗通知の文（`Main.txt` の行のとおり）。出力 `PostMessageToConversationResponse2`。直後に「個別のエラー時の設定」で**フロー実行を続行する／次のアクション** |

### 6-3. 実機で確認すること（未確認。推測を含む）

| # | 内容 | 今の `Main.txt` | 確認と、だめだったときの直し方 |
|---|------|-----------------|--------------------------------|
| C1 | **`PreviousBinary` の型**。実機の PAD の出力名は `GetFileContentByPathResponse` で、「応答」型の変数であり、ファイルの内容そのもの（バイナリ）ではない可能性がある。`File.ConvertFromBinary`（No.122）には `PreviousBinary` をそのまま渡している | 応答がそのままバイナリとして使える場合の形 | 実行後、変数ペインで `PreviousBinary` の型と中身を見る。オブジェクトで、内容を指すプロパティがあれば、No.122 の「バイナリ データ」をそのプロパティ（例：`%PreviousBinary.<プロパティ名>%`）にする。プロパティ名はこの資料では**不明**（実機で見て書く）。また、取得が失敗したとき `PreviousBinary` が `NONE` のまま残る前提（No.110・114）が、型の違いで成り立つかも確認する |
| C2 | **`latest.csv` の上書き**。SharePoint の「ファイルの作成」には「ファイルが存在する場合」の設定が無い。`latest.csv` が既にあるときの上書きができない可能性が高い（推測） | `CreateFile` のまま（2 回目の実行で手順5-3 が失敗する恐れ） | 2 回目の実行（新規あり）で試す。上書きされない場合の候補（いずれも**未試行・推測**）：(1) 作成の前に既存の `latest.csv` を「ファイルの削除」で消す（ファイルの識別子が要るため、先に「パスによるファイル メタデータの取得」で取得する必要がある見込み）、(2) 既存があるときは「ファイルの更新」（`UpdateFile`。同じくファイルの識別子が要る見込み）に切り替える。どれにするかは実機の画面の項目を見て決め、`Main.txt` と手順5-3 を直す |
| C3 | `@inferContentType` は実機の既定が True（最初の版の `Main.txt` は False だった）。True にしたまま、CSV の内容が文字化けしないか | True（既定に合わせた） | `previous.csv` の文字（日本語）が壊れていないか、手順5-1 の `ReadCSV` の結果で確認。壊れる場合は False を試す |
| C4 | 貼り付けただけで保存できるか（プレースホルダーのままの `Connection`／`ConnectionReferences`） | 上の 6-1 のとおり | 保存できなければ 6-2 の 1 または 2 |

---
## 7. アクション表

- `Main.txt` のアクション行（`#` コメント・空行・`END` を除く）を上から順に並べた。**表の No と `Main.txt` の行は1対1で同じ順・同じ数（186行）**。資産4は 107 行で、資産5の No.5〜103（手順0〜4）、No.172〜176・184〜186（手順7 と `ErrorEnd` の資産4の行）は「資産4 の No.n と同じ」と書いてある（計 107 行）。新規は 79 行。
- PAD のステータス バーのアクション数は、構文解析器で数えた 229 の見込み（コメントも1つ、ブロックのエラー時の設定は開始と1つ、If・Loop の終わりも1つと数える。）。最初の版の貼り付けでは実機でも 229 アクションと表示された（コネクタの 5 行が「不明なアクション」になった状態）。今の版の表示は未確認。コネクタの行の直前の `@@` の注釈の行は、アクションとして数えない（表にも入れていない）。
- 「主な設定値」は `Main.txt` の行の要約（文字列は長いものを省略。`\\` は `Main.txt` での書き方のまま）。アクション名は PAD の日本語表示に近い名前で、表示と少し違う場合がある。
- 手順5〜6 のブロックと `ErrorEnd` の中の `IF`／`ELSE`／`ON ERROR` も1行として数える。

| No | 手順 | ブロック | アクション名（PAD デザイナー） | 主な設定値（`Main.txt` の行の要約） | 生成される変数 | 資産4との関係 |
|----|------|----------|-------------------------------|--------------------------------------|----------------|---------------|
| 1 | 設定 | — | 変数の設定 | `SharePointSiteUrl` ＝ `<保存先サイトの URL>` | `SharePointSiteUrl` | 新規 |
| 2 | 設定 | — | 変数の設定 | `SharePointFolder` ＝ `<保存先フォルダー>` | `SharePointFolder` | 新規 |
| 3 | 設定 | — | 変数の設定 | `ChatRecipient` ＝ `<投稿先>` | `ChatRecipient` | 新規 |
| 4 | 設定 | — | 変数の設定 | `NotifyOnError` ＝ `YES` | `NotifyOnError` | 新規 |
| 5 | 0 | Step0_Init | ブロック エラー発生時（ブロックの開始） | 名前：`Step0_Init` | — | 資産4 の No.1 と同じ |
| 6 | 0 | Step0_Init | （直前のブロックのエラー時の設定） | 例外処理モード：フロー実行を続行する | — | 資産4 の No.2 と同じ |
| 7 | 0 | Step0_Init | ラベルに移動 | `ErrorEnd` | — | 資産4 の No.3 と同じ |
| 8 | 0 | Step0_Init | 変数の設定 | `StepMessage` ＝ `手順0：初期化（実行日時の取得・作業フォルダの作成・データテーブルの準備）に失敗しました` | `StepMessage` | 資産4 の No.4 と同じ |
| 9 | 0 | Step0_Init | 変数の設定 | `BaseUrl` ＝ `http://localhost:8080` | `BaseUrl` | 資産4 の No.5 と同じ |
| 10 | 0 | Step0_Init | 変数の設定 | `LoginId` ＝ `demo-user` | `LoginId` | 資産4 の No.6 と同じ |
| 11 | 0 | Step0_Init | 変数の設定 | `LoginPassword` ＝ `demo-pass` | `LoginPassword` | 資産4 の No.7 と同じ |
| 12 | 0 | Step0_Init | 変数の設定 | `WorkFolderName` ＝ `申込状況チェック_デモ` | `WorkFolderName` | 資産4 の No.8 と同じ |
| 13 | 0 | Step0_Init | 現在の日時を取得します | DateTimeFormat: DateTime.DateTimeFormat.DateAndTime CurrentDateTime=> RunDateTime | `RunDateTime` | 資産4 の No.9 と同じ |
| 14 | 0 | Step0_Init | datetime をテキストに変換 | DateTime: RunDateTime CustomFormat: `yyyyMMdd_HHmm` Result=> RunStamp | `RunStamp` | 資産4 の No.10 と同じ |
| 15 | 0 | Step0_Init | 変数の設定 | `HistoryFileName` ＝ `申込状況_%RunStamp%.csv` | `HistoryFileName` | 資産4 の No.11 と同じ |
| 16 | 0 | Step0_Init | 特別なフォルダーを取得 | SpecialFolder: Folder.SpecialFolder.Personal SpecialFolderPath=> DocumentsFolder | `DocumentsFolder` | 資産4 の No.12 と同じ |
| 17 | 0 | Step0_Init | 変数の設定 | `WorkFolder` ＝ `%DocumentsFolder%\\%WorkFolderName%` | `WorkFolder` | 資産4 の No.13 と同じ |
| 18 | 0 | Step0_Init | フォルダーが存在する場合 | Path: WorkFolder | — | 資産4 の No.14 と同じ |
| 19 | 0 | Step0_Init | フォルダーを作成 | FolderPath: DocumentsFolder FolderName: WorkFolderName Folder=> CreatedFolder | `CreatedFolder` | 資産4 の No.15 と同じ |
| 20 | 0 | Step0_Init | 新しいデータ テーブルを作成する | InputTable: { ^[`申込番号`, `申込日`, `お客さま名`, `供給地点特定番号`, `申込種別`, `変更前容量`, `変更後容量`, `ステータス`, `担当者`, `需要場所住所`, `希望日`, `工事予定日`, `送配電受付番号`, `備考`], [``, ``, ``, ``, ``, ``, ``, ``, ``, ``, ``, ``, ``, ``] } DataTable=> CurrentTable | `CurrentTable` | 資産4 の No.16 と同じ |
| 21 | 0 | Step0_Init | データ テーブルから行を削除する | DataTable: CurrentTable RowIndex: 0 | — | 資産4 の No.17 と同じ |
| 22 | 1 | Step1_Login | ブロック エラー発生時（ブロックの開始） | 名前：`Step1_Login` | — | 資産4 の No.18 と同じ |
| 23 | 1 | Step1_Login | （直前のブロックのエラー時の設定） | 例外処理モード：フロー実行を続行する | — | 資産4 の No.19 と同じ |
| 24 | 1 | Step1_Login | ラベルに移動 | `ErrorEnd` | — | 資産4 の No.20 と同じ |
| 25 | 1 | Step1_Login | 変数の設定 | `StepMessage` ＝ `手順1-1〜1-2：モック画面に接続できません。server.js が起動しているか確認して…` | `StepMessage` | 資産4 の No.21 と同じ |
| 26 | 1 | Step1_Login | 新しい Microsoft Edge を起動する | Url: `%BaseUrl%/login.html` WindowState: WebAutomation.BrowserWindowState.Maximized ClearCache: False ClearCookies: False WaitForPageToLoadTimeout: 60 Timeout: 60 BrowserInstance=> Browser | `Browser` | 資産4 の No.22 と同じ |
| 27 | 1 | Step1_Login | Web ページのコンテンツを待機 | 要素が表示されるまで最大 30 秒待つ：BrowserInstance: Browser Control: appmask['LoginPage']['login-id'] | — | 資産4 の No.23 と同じ |
| 28 | 1 | Step1_Login | 変数の設定 | `StepMessage` ＝ `手順1-3〜1-4：ログイン画面で ID・パスワードの入力またはログインボタンのクリックがで…` | `StepMessage` | 資産4 の No.24 と同じ |
| 29 | 1 | Step1_Login | Web ページのコンテンツを待機 | 要素が表示されるまで最大 30 秒待つ：BrowserInstance: Browser Control: appmask['LoginPage']['login-button'] | — | 資産4 の No.25 と同じ |
| 30 | 1 | Step1_Login | 変数の設定 | `LoginCheck` ＝ `NG` | `LoginCheck` | 資産4 の No.26 と同じ |
| 31 | 1 | Step1_Login | 変数の設定 | `ListCheck` ＝ `NG` | `ListCheck` | 資産4 の No.27 と同じ |
| 32 | 1 | Step1_Login | ループ（Loop） | `LoginTry FROM 1 TO 3 STEP 1` | `LoginTry` | 資産4 の No.28 と同じ |
| 33 | 1 | Step1_Login | If | ListCheck <> `OK` | — | 資産4 の No.29 と同じ |
| 34 | 1 | Step1_Login | If | LoginTry > 1 | — | 資産4 の No.30 と同じ |
| 35 | 1 | Step1_Login | 待機（Wait） | 2 秒 | — | 資産4 の No.31 と同じ |
| 36 | 1 | Step1_Login | ウィンドウにフォーカスする | WindowInstance: Browser.Handle | — | 資産4 の No.32 と同じ |
| 37 | 1 | Step1_Login | （直前のアクションの個別のエラー時の設定） | フロー実行を続行する／次のアクションに移動 | — | 資産4 の No.33 と同じ |
| 38 | 1 | Step1_Login | 変数の設定 | `LoginCheck` ＝ `NG` | `LoginCheck` | 資産4 の No.34 と同じ |
| 39 | 1 | Step1_Login | Web ページ内のテキスト フィールドに入力する | BrowserInstance: Browser Control: appmask['LoginPage']['login-id'] Text: LoginId EmulateTyping: True UnfocusAfterPopulate: False Mode: WebAutomation.PopulateTextMode.Replace WaitForPageToLoadTimeout: 60 | — | 資産4 の No.35 と同じ |
| 40 | 1 | Step1_Login | （直前のアクションの個別のエラー時の設定） | フロー実行を続行する／次のアクションに移動 | — | 資産4 の No.36 と同じ |
| 41 | 1 | Step1_Login | Web ページ内のテキスト フィールドに入力する | BrowserInstance: Browser Control: appmask['LoginPage']['login-password'] Text: LoginPassword EmulateTyping: True UnfocusAfterPopulate: False Mode: WebAutomation.PopulateTextMode.Replace WaitForPageToLoadTimeout: 60 | — | 資産4 の No.37 と同じ |
| 42 | 1 | Step1_Login | （直前のアクションの個別のエラー時の設定） | フロー実行を続行する／次のアクションに移動 | — | 資産4 の No.38 と同じ |
| 43 | 1 | Step1_Login | Web ページで JavaScript 関数を実行します | BrowserInstance: Browser Javascript: `function ExecuteScript() { var id = document.g…` Result=> LoginCheck | `LoginCheck` | 資産4 の No.39 と同じ |
| 44 | 1 | Step1_Login | （直前のアクションの個別のエラー時の設定） | フロー実行を続行する／次のアクションに移動 | — | 資産4 の No.40 と同じ |
| 45 | 1 | Step1_Login | If | LoginCheck = `OK` | — | 資産4 の No.41 と同じ |
| 46 | 1 | Step1_Login | Web ページのリンクをクリックします | BrowserInstance: Browser Control: appmask['LoginPage']['login-button'] WaitForPageToLoadTimeout: 60 | — | 資産4 の No.42 と同じ |
| 47 | 1 | Step1_Login | （直前のアクションの個別のエラー時の設定） | フロー実行を続行する／次のアクションに移動 | — | 資産4 の No.43 と同じ |
| 48 | 1 | Step1_Login | Web ページのコンテンツを待機 | 要素が表示されるまで最大 30 秒待つ：BrowserInstance: Browser Control: appmask['ListPage']['application-table-loaded'] | — | 資産4 の No.44 と同じ |
| 49 | 1 | Step1_Login | （直前のアクションの個別のエラー時の設定） | フロー実行を続行する／次のアクションに移動 | — | 資産4 の No.45 と同じ |
| 50 | 1 | Step1_Login | Web ページに次が含まれる場合 | BrowserInstance: Browser Control: appmask['ListPage']['application-table-loaded'] | — | 資産4 の No.46 と同じ |
| 51 | 1 | Step1_Login | 変数の設定 | `ListCheck` ＝ `OK` | `ListCheck` | 資産4 の No.47 と同じ |
| 52 | 1 | Step1_Login | If | ListCheck <> `OK` | — | 資産4 の No.48 と同じ |
| 53 | 1 | Step1_Login | If | LoginCheck <> `OK` | — | 資産4 の No.49 と同じ |
| 54 | 1 | Step1_Login | 変数の設定 | `StepMessage` ＝ `手順1-3〜1-4：ログイン画面で ID・パスワードを入力できませんでした（3 回試しても一…` | `StepMessage` | 資産4 の No.50 と同じ |
| 55 | 1 | Step1_Login | ラベルに移動 | `ErrorEnd` | — | 資産4 の No.51 と同じ |
| 56 | 1 | Step1_Login | 変数の設定 | `StepMessage` ＝ `手順1-4〜1-5：ログインボタンをクリックしても一覧画面が表示されませんでした（3 回試し…` | `StepMessage` | 資産4 の No.52 と同じ |
| 57 | 1 | Step1_Login | ラベルに移動 | `ErrorEnd` | — | 資産4 の No.53 と同じ |
| 58 | 1 | Step1_Login | 変数の設定 | `StepMessage` ＝ `手順1-5：ログイン後に一覧画面が表示されませんでした（30 秒待っても読み込みが完了しませ…` | `StepMessage` | 資産4 の No.54 と同じ |
| 59 | 1 | Step1_Login | Web ページのコンテンツを待機 | 要素が表示されるまで最大 30 秒待つ：BrowserInstance: Browser Control: appmask['ListPage']['application-table-loaded'] | — | 資産4 の No.55 と同じ |
| 60 | 2 | Step2_GetList | ブロック エラー発生時（ブロックの開始） | 名前：`Step2_GetList` | — | 資産4 の No.56 と同じ |
| 61 | 2 | Step2_GetList | （直前のブロックのエラー時の設定） | 例外処理モード：フロー実行を続行する | — | 資産4 の No.57 と同じ |
| 62 | 2 | Step2_GetList | ラベルに移動 | `ErrorEnd` | — | 資産4 の No.58 と同じ |
| 63 | 2 | Step2_GetList | 変数の設定 | `StepMessage` ＝ `手順2-1：一覧から申込番号を取得できませんでした` | `StepMessage` | 資産4 の No.59 と同じ |
| 64 | 2 | Step2_GetList | Web ページで JavaScript 関数を実行します | BrowserInstance: Browser Javascript: `function ExecuteScript() { var rows = document…` Result=> ApplicationNosText | `ApplicationNosText` | 資産4 の No.60 と同じ |
| 65 | 2 | Step2_GetList | テキストの分割 | Text: ApplicationNosText CustomDelimiter: `,` IsRegEx: False Result=> ApplicationNos | `ApplicationNos` | 資産4 の No.61 と同じ |
| 66 | 2 | Step2_GetList | 変数の設定 | `StepMessage` ＝ `手順2-2：一覧の件数表示（「全 N 件」）を取得できませんでした` | `StepMessage` | 資産4 の No.62 と同じ |
| 67 | 2 | Step2_GetList | Web ページ上の要素の詳細を取得します | BrowserInstance: Browser Control: appmask['ListPage']['application-count'] AttributeName: `Own Text` AttributeValue=> DataCountText | `DataCountText` | 資産4 の No.63 と同じ |
| 68 | 2 | Step2_GetList | テキストを解析 | Text: DataCountText TextToFind: `[0-9]+` StartingPosition: 0 IgnoreCase: False OccurrencePosition=> DataCountPosition Match=> DataCountDigits | `DataCountPosition`、`DataCountDigits` | 資産4 の No.64 と同じ |
| 69 | 2 | Step2_GetList | テキストを数値に変換 | Text: DataCountDigits Number=> DataCount | `DataCount` | 資産4 の No.65 と同じ |
| 70 | 2 | Step2_GetList | If | ApplicationNos.Count <> DataCount | — | 資産4 の No.66 と同じ |
| 71 | 2 | Step2_GetList | 変数の設定 | `StepMessage` ＝ `手順2-2：件数が一致しません（画面の件数 %DataCount% 件／取得 %Applic…` | `StepMessage` | 資産4 の No.67 と同じ |
| 72 | 2 | Step2_GetList | ラベルに移動 | `ErrorEnd` | — | 資産4 の No.68 と同じ |
| 73 | 3 | Step3_GetDetails | ブロック エラー発生時（ブロックの開始） | 名前：`Step3_GetDetails` | — | 資産4 の No.69 と同じ |
| 74 | 3 | Step3_GetDetails | （直前のブロックのエラー時の設定） | 例外処理モード：フロー実行を続行する | — | 資産4 の No.70 と同じ |
| 75 | 3 | Step3_GetDetails | ラベルに移動 | `ErrorEnd` | — | 資産4 の No.71 と同じ |
| 76 | 3 | Step3_GetDetails | For each | `ApplicationNos` の各要素を `CurrentNo` に | `CurrentNo` | 資産4 の No.72 と同じ |
| 77 | 3 | Step3_GetDetails | 変数の設定 | `StepMessage` ＝ `手順3-1：申込番号 %CurrentNo% の「詳細」ボタンをクリックできませんでした` | `StepMessage` | 資産4 の No.73 と同じ |
| 78 | 3 | Step3_GetDetails | ウィンドウにフォーカスする | WindowInstance: Browser.Handle | — | 資産4 の No.74 と同じ |
| 79 | 3 | Step3_GetDetails | （直前のアクションの個別のエラー時の設定） | フロー実行を続行する／次のアクションに移動 | — | 資産4 の No.75 と同じ |
| 80 | 3 | Step3_GetDetails | Web ページのリンクをクリックします | BrowserInstance: Browser Control: appmask['ListPage']['detail-button'] WaitForPageToLoadTimeout: 60 | — | 資産4 の No.76 と同じ |
| 81 | 3 | Step3_GetDetails | 変数の設定 | `StepMessage` ＝ `手順3-2：申込番号 %CurrentNo% の詳細画面が表示されませんでした（30 秒。該…` | `StepMessage` | 資産4 の No.77 と同じ |
| 82 | 3 | Step3_GetDetails | Web ページのコンテンツを待機 | 要素が表示されるまで最大 30 秒待つ：BrowserInstance: Browser Control: appmask['DetailPage']['application-detail-loaded'] | — | 資産4 の No.78 と同じ |
| 83 | 3 | Step3_GetDetails | 変数の設定 | `StepMessage` ＝ `手順3-3〜3-4：申込番号 %CurrentNo% の詳細画面から項目を取得できませんでし…` | `StepMessage` | 資産4 の No.79 と同じ |
| 84 | 3 | Step3_GetDetails | Web ページで JavaScript 関数を実行します | BrowserInstance: Browser Javascript: `function ExecuteScript() { var keys = [\"appli…` Result=> DetailText | `DetailText` | 資産4 の No.80 と同じ |
| 85 | 3 | Step3_GetDetails | テキストの分割 | Text: DetailText CustomDelimiter: `,` IsRegEx: False Result=> DetailValues | `DetailValues` | 資産4 の No.81 と同じ |
| 86 | 3 | Step3_GetDetails | If | DetailValues.Count <> 14 | — | 資産4 の No.82 と同じ |
| 87 | 3 | Step3_GetDetails | 変数の設定 | `StepMessage` ＝ `手順3-4：申込番号 %CurrentNo% の詳細画面から14項目を取得できませんでした（…` | `StepMessage` | 資産4 の No.83 と同じ |
| 88 | 3 | Step3_GetDetails | ラベルに移動 | `ErrorEnd` | — | 資産4 の No.84 と同じ |
| 89 | 3 | Step3_GetDetails | If | DetailValues[0] <> CurrentNo | — | 資産4 の No.85 と同じ |
| 90 | 3 | Step3_GetDetails | 変数の設定 | `StepMessage` ＝ `手順3-3：申込番号が一致しません（対象 %CurrentNo%／詳細画面 %DetailV…` | `StepMessage` | 資産4 の No.86 と同じ |
| 91 | 3 | Step3_GetDetails | ラベルに移動 | `ErrorEnd` | — | 資産4 の No.87 と同じ |
| 92 | 3 | Step3_GetDetails | データ テーブルに行を挿入 | DataTable: CurrentTable RowToAdd: DetailValues | — | 資産4 の No.88 と同じ |
| 93 | 3 | Step3_GetDetails | 変数の設定 | `StepMessage` ＝ `手順3-5：申込番号 %CurrentNo% の詳細画面から一覧画面に戻れませんでした（30…` | `StepMessage` | 資産4 の No.89 と同じ |
| 94 | 3 | Step3_GetDetails | ウィンドウにフォーカスする | WindowInstance: Browser.Handle | — | 資産4 の No.90 と同じ |
| 95 | 3 | Step3_GetDetails | （直前のアクションの個別のエラー時の設定） | フロー実行を続行する／次のアクションに移動 | — | 資産4 の No.91 と同じ |
| 96 | 3 | Step3_GetDetails | Web ページのリンクをクリックします | BrowserInstance: Browser Control: appmask['DetailPage']['back-to-list-button'] WaitForPageToLoadTimeout: 60 | — | 資産4 の No.92 と同じ |
| 97 | 3 | Step3_GetDetails | Web ページのコンテンツを待機 | 要素が表示されるまで最大 30 秒待つ：BrowserInstance: Browser Control: appmask['ListPage']['application-table-loaded'] | — | 資産4 の No.93 と同じ |
| 98 | 4 | Step4_WriteCsv | ブロック エラー発生時（ブロックの開始） | 名前：`Step4_WriteCsv` | — | 資産4 の No.94 と同じ |
| 99 | 4 | Step4_WriteCsv | （直前のブロックのエラー時の設定） | 例外処理モード：フロー実行を続行する | — | 資産4 の No.95 と同じ |
| 100 | 4 | Step4_WriteCsv | ラベルに移動 | `ErrorEnd` | — | 資産4 の No.96 と同じ |
| 101 | 4 | Step4_WriteCsv | 変数の設定 | `StepMessage` ＝ `手順4：CSV ファイルを書き出せませんでした。同じ名前のファイルを Excel 等で開いて…` | `StepMessage` | 資産4 の No.97 と同じ |
| 102 | 4 | Step4_WriteCsv | CSV ファイルに書き込みます | VariableToWrite: CurrentTable CSVFile: `%WorkFolder%\\%HistoryFileName%` CsvFileEncoding: File.CSVEncoding.UTF8 IncludeColumnNames: True IfFileExists: File.IfFileExists.Overwrite ColumnsSeparator: File.CSVColumnsSeparator.Comma | — | 資産4 の No.98 と同じ |
| 103 | 4 | Step4_WriteCsv | CSV ファイルに書き込みます | VariableToWrite: CurrentTable CSVFile: `%WorkFolder%\\latest.csv` CsvFileEncoding: File.CSVEncoding.UTF8 IncludeColumnNames: True IfFileExists: File.IfFileExists.Overwrite ColumnsSeparator: File.CSVColumnsSeparator.Comma | — | 資産4 の No.99 と同じ |
| 104 | 5-1 | Step5a_GetPrevious | ブロック エラー発生時（ブロックの開始） | 名前：`Step5a_GetPrevious` | — | 新規 |
| 105 | 5-1 | Step5a_GetPrevious | （直前のブロックのエラー時の設定） | 例外処理モード：フロー実行を続行する | — | 新規 |
| 106 | 5-1 | Step5a_GetPrevious | ラベルに移動 | `ErrorEnd` | — | 新規 |
| 107 | 5-1 | Step5a_GetPrevious | 変数の設定 | `StepMessage` ＝ `手順5-1：SharePoint から前回の latest.csv を取得できませんでした（…` | `StepMessage` | 新規 |
| 108 | 5-1 | Step5a_GetPrevious | 変数の設定 | `PreviousExists` ＝ False | `PreviousExists` | 新規 |
| 109 | 5-1 | Step5a_GetPrevious | 変数の設定 | `PreviousNosKey` ＝ `,` | `PreviousNosKey` | 新規 |
| 110 | 5-1 | Step5a_GetPrevious | 変数の設定 | `PreviousBinary` ＝ `NONE` | `PreviousBinary` | 新規 |
| 111 | 5-1 | Step5a_GetPrevious | SharePoint コネクタのアクション（`GetFileContentByPath`） | 接続参照・サイト／投稿先はプレースホルダー。@dataset: `<保存先サイト>` @path: `%SharePointFolder%/latest.csv` @inferContentType: True @GetFileContentByPathResponse=> PreviousBinary（接続は `<SharePoint 接続参照ID>`、ConnectorId は `/providers/Microsoft.PowerApps/apis/shared_sharepointonline`） | `PreviousBinary` | 新規 |
| 112 | 5-1 | Step5a_GetPrevious | （直前のアクションの個別のエラー時の設定） | フロー実行を続行する／次のアクションに移動 | — | 新規 |
| 113 | 5-1 | Step5a_GetPrevious | 最後のエラーを取得 | `PrevError Reset: False` | `PrevError` | 新規 |
| 114 | 5-1 | Step5a_GetPrevious | If | PreviousBinary = `NONE` | — | 新規 |
| 115 | 5-1 | Step5a_GetPrevious | 変数の設定 | `PrevErrorText` ＝ `%PrevError%` | `PrevErrorText` | 新規 |
| 116 | 5-1 | Step5a_GetPrevious | If | Contains(PrevErrorText, `404`, True) OR Contains(PrevErrorText, `NotFound`, True) OR Contains(PrevErrorText, `not found`, True) OR Contains(PrevErrorText, `見つかりません`, True) OR Contains(PrevErrorText, `存在しません`, True) | — | 新規 |
| 117 | 5-1 | Step5a_GetPrevious | 変数の設定 | `PreviousExists` ＝ False | `PreviousExists` | 新規 |
| 118 | 5-1 | Step5a_GetPrevious | Else | — | — | 新規 |
| 119 | 5-1 | Step5a_GetPrevious | ラベルに移動 | `ErrorEnd` | — | 新規 |
| 120 | 5-1 | Step5a_GetPrevious | Else | — | — | 新規 |
| 121 | 5-1 | Step5a_GetPrevious | 変数の設定 | `StepMessage` ＝ `手順5-1：前回の latest.csv は取得できましたが、内容を読み込めませんでした` | `StepMessage` | 新規 |
| 122 | 5-1 | Step5a_GetPrevious | バイナリ データをファイルに変換 | BinaryData: PreviousBinary File: `%WorkFolder%\\previous.csv` IfFileExists: File.IfExists.Overwrite | — | 新規 |
| 123 | 5-1 | Step5a_GetPrevious | CSV ファイルから読み取ります | CSVFile: `%WorkFolder%\\previous.csv` Encoding: File.CSVEncoding.UTF8 TrimFields: False FirstLineContainsColumnNames: True ColumnsSeparator: File.CSVColumnsSeparator.Comma CSVTable=> PreviousTable | `PreviousTable` | 新規 |
| 124 | 5-1 | Step5a_GetPrevious | データ テーブルの列をリストに取得 | DataTable: PreviousTable ColumnNameOrIndex: `申込番号` ColumnAsList=> PreviousNos | `PreviousNos` | 新規 |
| 125 | 5-1 | Step5a_GetPrevious | For each | `PreviousNos` の各要素を `PreviousNo` に | `PreviousNo` | 新規 |
| 126 | 5-1 | Step5a_GetPrevious | 変数の設定 | `PreviousNosKey` ＝ PreviousNosKey + PreviousNo + `,` | `PreviousNosKey` | 新規 |
| 127 | 5-1 | Step5a_GetPrevious | 変数の設定 | `PreviousExists` ＝ True | `PreviousExists` | 新規 |
| 128 | 5-2 | Step5b_FindNew | ブロック エラー発生時（ブロックの開始） | 名前：`Step5b_FindNew` | — | 新規 |
| 129 | 5-2 | Step5b_FindNew | （直前のブロックのエラー時の設定） | 例外処理モード：フロー実行を続行する | — | 新規 |
| 130 | 5-2 | Step5b_FindNew | ラベルに移動 | `ErrorEnd` | — | 新規 |
| 131 | 5-2 | Step5b_FindNew | 変数の設定 | `StepMessage` ＝ `手順5-2：新規案件の判定に失敗しました` | `StepMessage` | 新規 |
| 132 | 5-2 | Step5b_FindNew | 新しいデータ テーブルを作成する | InputTable: { ^[`申込番号`, `申込日`, `お客さま名`, `供給地点特定番号`, `申込種別`, `変更前容量`, `変更後容量`, `ステータス`, `担当者`, `需要場所住所`, `希望日`, `工事予定日`, `送配電受付番号`, `備考`], [``, ``, ``, ``, ``, ``, ``, ``, ``, ``, ``, ``, ``, ``] } DataTable=> NewRows | `NewRows` | 新規 |
| 133 | 5-2 | Step5b_FindNew | データ テーブルから行を削除する | DataTable: NewRows RowIndex: 0 | — | 新規 |
| 134 | 5-2 | Step5b_FindNew | If | PreviousExists = True | — | 新規 |
| 135 | 5-2 | Step5b_FindNew | For each | `CurrentTable` の各要素を `CurrentRow` に | `CurrentRow` | 新規 |
| 136 | 5-2 | Step5b_FindNew | If | NOT Contains(PreviousNosKey, `,%CurrentRow[0]%,`, False) | — | 新規 |
| 137 | 5-2 | Step5b_FindNew | データ テーブルに行を挿入 | DataTable: NewRows RowToAdd: [CurrentRow[0], CurrentRow[1], CurrentRow[2], CurrentRow[3], CurrentRow[4], CurrentRow[5], CurrentRow[6], CurrentRow[7], CurrentRow[8], CurrentRow[9], CurrentRow[10], CurrentRow[11], CurrentRow[12], CurrentRow[13]] | — | 新規 |
| 138 | 5-3 | Step5c_Save | ブロック エラー発生時（ブロックの開始） | 名前：`Step5c_Save` | — | 新規 |
| 139 | 5-3 | Step5c_Save | （直前のブロックのエラー時の設定） | 例外処理モード：フロー実行を続行する | — | 新規 |
| 140 | 5-3 | Step5c_Save | ラベルに移動 | `ErrorEnd` | — | 新規 |
| 141 | 5-3 | Step5c_Save | 変数の設定 | `StepMessage` ＝ `手順5-3：SharePoint への履歴ファイルの保存に失敗しました（latest.csv…` | `StepMessage` | 新規 |
| 142 | 5-3 | Step5c_Save | ファイルをバイナリ データに変換 | File: `%WorkFolder%\\%HistoryFileName%` BinaryData=> HistoryBinary | `HistoryBinary` | 新規 |
| 143 | 5-3 | Step5c_Save | SharePoint コネクタのアクション（`CreateFile`） | 接続参照・サイト／投稿先はプレースホルダー。@dataset: `<保存先サイト>` @folderPath: SharePointFolder @name: HistoryFileName @body: HistoryBinary @CreateFileResponse=> CreateFileResponse2 | — | 新規 |
| 144 | 5-3 | Step5c_Save | 変数の設定 | `HistoryFileLink` ＝ `%SharePointSiteUrl%/%SharePointFolder%/%Histor…` | `HistoryFileLink` | 新規 |
| 145 | 5-3 | Step5c_Save | テキストを置換する | Text: HistoryFileLink TextToFind: `\\x20` IgnoreCase: False ReplaceWith: `%%20` ActivateEscapeSequences: False Result=> HistoryFileLink | `HistoryFileLink` | 新規 |
| 146 | 5-3 | Step5c_Save | 変数の設定 | `StepMessage` ＝ `手順5-3：履歴ファイルは SharePoint に保存しましたが、latest.csv の…` | `StepMessage` | 新規 |
| 147 | 5-3 | Step5c_Save | ファイルをバイナリ データに変換 | File: `%WorkFolder%\\latest.csv` BinaryData=> LatestBinary | `LatestBinary` | 新規 |
| 148 | 5-3 | Step5c_Save | SharePoint コネクタのアクション（`CreateFile`） | 接続参照・サイト／投稿先はプレースホルダー。@dataset: `<保存先サイト>` @folderPath: SharePointFolder @name: `latest.csv` @body: LatestBinary @CreateFileResponse=> CreateFileResponse | — | 新規 |
| 149 | 6 | Step6_Notify | ブロック エラー発生時（ブロックの開始） | 名前：`Step6_Notify` | — | 新規 |
| 150 | 6 | Step6_Notify | （直前のブロックのエラー時の設定） | 例外処理モード：フロー実行を続行する | — | 新規 |
| 151 | 6 | Step6_Notify | ラベルに移動 | `ErrorEnd` | — | 新規 |
| 152 | 6 | Step6_Notify | 変数の設定 | `NotifyOnError` ＝ `NO` | `NotifyOnError` | 新規 |
| 153 | 6 | Step6_Notify | 変数の設定 | `StepMessage` ＝ `手順6：Teams への投稿に失敗しました。CSV は SharePoint に保存済みです…` | `StepMessage` | 新規 |
| 154 | 6 | Step6_Notify | datetime をテキストに変換 | DateTime: RunDateTime CustomFormat: `yyyy/MM/dd HH:mm` Result=> RunDateTimeText | `RunDateTimeText` | 新規 |
| 155 | 6 | Step6_Notify | If | PreviousExists = False | — | 新規 |
| 156 | 6 | Step6_Notify | 変数の設定 | `PostPattern` ＝ `初回` | `PostPattern` | 新規 |
| 157 | 6 | Step6_Notify | 変数の設定 | `PostMessage` ＝ `【申込状況チェック】初回実行のため、全 %CurrentTable.RowsCount% 件…` | `PostMessage` | 新規 |
| 158 | 6 | Step6_Notify | Else | — | — | 新規 |
| 159 | 6 | Step6_Notify | If | NewRows.RowsCount > 0 | — | 新規 |
| 160 | 6 | Step6_Notify | 変数の設定 | `PostPattern` ＝ `新規あり` | `PostPattern` | 新規 |
| 161 | 6 | Step6_Notify | 変数の設定 | `NewLines` ＝ `` | `NewLines` | 新規 |
| 162 | 6 | Step6_Notify | 変数の設定 | `NewIndex` ＝ 0 | `NewIndex` | 新規 |
| 163 | 6 | Step6_Notify | For each | `NewRows` の各要素を `NewRow` に | `NewRow` | 新規 |
| 164 | 6 | Step6_Notify | 変数の設定 | `NewIndex` ＝ NewIndex + 1 | `NewIndex` | 新規 |
| 165 | 6 | Step6_Notify | 変数の設定 | `NewLine` ＝ `%NewIndex%. %NewRow[0]%／%NewRow[2]%／%NewRow[4]…` | `NewLine` | 新規 |
| 166 | 6 | Step6_Notify | 変数の設定 | `NewLines` ＝ NewLines + NewLine | `NewLines` | 新規 |
| 167 | 6 | Step6_Notify | 変数の設定 | `PostMessage` ＝ `【申込状況チェック】新規案件が %NewRows.RowsCount% 件あります（取得日時…` | `PostMessage` | 新規 |
| 168 | 6 | Step6_Notify | Else | — | — | 新規 |
| 169 | 6 | Step6_Notify | 変数の設定 | `PostPattern` ＝ `新規0件` | `PostPattern` | 新規 |
| 170 | 6 | Step6_Notify | 変数の設定 | `PostMessage` ＝ `【申込状況チェック】新規案件はありません（全 %CurrentTable.RowsCount…` | `PostMessage` | 新規 |
| 171 | 6 | Step6_Notify | Teams コネクタのアクション（`PostMessageToConversation`） | 接続参照・サイト／投稿先はプレースホルダー。@poster: `Flow bot` @location: `Chat with Flow bot` @'body/recipient': ChatRecipient @'body/messageBody': PostMessage @PostMessageToConversationResponse=> PostMessageToConversationResponse | — | 新規 |
| 172 | 7 | — | Web ブラウザーを閉じる | BrowserInstance: Browser | — | 資産4 の No.100 と同じ |
| 173 | 7 | — | フローを停止する（正常終了） | 終了コード：0 | — | 資産4 の No.101 と同じ |
| 174 | エラー時 | — | ラベル | `ErrorEnd` | — | 資産4 の No.102 と同じ |
| 175 | エラー時 | — | 最後のエラーを取得 | `LastError Reset: True` | `LastError` | 資産4 の No.103 と同じ |
| 176 | エラー時 | — | テキストを置換する | Text: `%LastError%` TextToFind: `(?m)[A-Za-z]:\\\\Users\\\\.*?(?=申込状況チェック_デモ\|$)` IgnoreCase: True ReplaceWith: `<ユーザー フォルダー>` ActivateEscapeSequences: False Result=> ErrorDetail | `ErrorDetail` | 資産4 の No.104 と同じ |
| 177 | エラー時 | — | If | NotifyOnError = `YES` | — | 新規 |
| 178 | エラー時 | — | 現在の日時を取得します | DateTimeFormat: DateTime.DateTimeFormat.DateAndTime CurrentDateTime=> ErrorDateTime | `ErrorDateTime` | 新規 |
| 179 | エラー時 | — | datetime をテキストに変換 | DateTime: ErrorDateTime CustomFormat: `yyyy/MM/dd HH:mm` Result=> ErrorDateTimeText | `ErrorDateTimeText` | 新規 |
| 180 | エラー時 | — | テキストを置換する | Text: `%StepMessage%` TextToFind: `(?s)^(手順[0-9〜-]+).*$` IgnoreCase: False ReplaceWith: `$1` ActivateEscapeSequences: False Result=> StopStep | `StopStep` | 新規 |
| 181 | エラー時 | — | テキストを置換する | Text: `%ErrorDetail%` TextToFind: `\\r?\\n` IgnoreCase: False ReplaceWith: `<br>` ActivateEscapeSequences: False Result=> ErrorDetailHtml | `ErrorDetailHtml` | 新規 |
| 182 | エラー時 | — | Teams コネクタのアクション（`PostMessageToConversation`） | 接続参照・サイト／投稿先はプレースホルダー。@poster: `Flow bot` @location: `Chat with Flow bot` @'body/recipient': ChatRecipient @'body/messageBody': `【申込状況チェック】取得に失敗しました。%StopStep% で停止（取得日時：%Error…` | — | 新規 |
| 183 | エラー時 | — | （直前のアクションの個別のエラー時の設定） | フロー実行を続行する／次のアクションに移動 | — | 新規 |
| 184 | エラー時 | — | メッセージを表示 | Title: `申込状況チェック_デモ（エラーで停止しました）` Message: `%StepMessage%（PAD のエラー情報：%ErrorDetail%）` Icon: Display.Icon.ErrorIcon Buttons: Display.Buttons.OK DefaultButton: Display.DefaultButton.Button1 IsTopMost: True ButtonPressed=> ButtonPressed | `ButtonPressed` | 資産4 の No.105 と同じ |
| 185 | エラー時 | — | Web ブラウザーを閉じる | BrowserInstance: Browser | — | 資産4 の No.106 と同じ |
| 186 | エラー時 | — | （直前のアクションの個別のエラー時の設定） | フロー実行を続行する／次のアクションに移動 | — | 資産4 の No.107 と同じ |
