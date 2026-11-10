# スプリント実施状況

| # | スプリント | 状態 | 判定・スコア | 差し戻し | main マージ | 記録 |
|---|---|---|---|---|---|---|
| 01 | 一覧画面（デモ操作を含む） | 完了 | 合格 100/100 | 0回 | 2026-10-14 | [合格基準書](01-list-screen/pass-criteria.md) / [review-01](01-list-screen/review-01.md) |
| 02 | ログイン画面 | 完了 | 合格 100/100 | 0回 | 2026-10-14 | [合格基準書](02-login-screen/pass-criteria.md) / [review-01](02-login-screen/review-01.md) |
| 03 | 詳細画面 | 完了 | 合格 100/100 | 0回 | 2026-10-14 | [合格基準書](03-detail-screen/pass-criteria.md) / [review-01](03-detail-screen/review-01.md) |
| 04 | フロー前半（ログイン〜CSV 出力） | 完了（PAD 実機は未確認） | 合格 100/100 | 0回 | 2026-10-14 | [合格基準書](04-flow-scrape/pass-criteria.md) / [review-01](04-flow-scrape/review-01.md) |
| 04b | フロー前半の作り直し（UI 要素の定義を Main.txt に同梱） | 完了（PAD 実機は未確認） | 合格 100/100 | 0回 | 2026-10-15 | [合格基準書](04b-flow-ui-elements/pass-criteria.md) / [review-01](04b-flow-ui-elements/review-01.md) / [review-02](04b-flow-ui-elements/review-02.md) |
| 04c | フロー前半の PAD 実機確認と修正 | 完了（ログインボタンの停止対策は 04d へ） | 合格 100/100（review-02。4c-4 の扱い・Excel 確認の代替は人が了承 2026-10-19） | 1回 | 2026-10-19 | [合格基準書](04c-flow-pad-check/pass-criteria.md) / [review-01](04c-flow-pad-check/review-01.md) / [review-02](04c-flow-pad-check/review-02.md) |
| 04d | ログインの停止対策（クリックのやり直し・Edge を前面に） | 完了 | 合格 95/100（review-02。4d-8 Edge の前面化の目視は未確認のまま終了：人の判断） | 1回 | 2026-10-19 | [合格基準書](04d-login-stability/pass-criteria.md) / [review-01](04d-login-stability/review-01.md) / [review-02](04d-login-stability/review-02.md) |
| 04e | クリックの物理マウス操作をやめる（3か所に `MouseClick: False`） | 完了 | 合格 100/100（review-02。4e-12 は人の回答〔帯はログイン画面で表示〕による追記で合格） | 1回 | 2026-10-21 | [合格基準書](04e-click-no-mouse/pass-criteria.md) / [review-01](04e-click-no-mouse/review-01.md) / [review-02](04e-click-no-mouse/review-02.md) |
| 05 | フロー後半（SharePoint 保存・比較・Teams 投稿）＝資産4＋α。付加価値 | 完了 | 合格 100/100（review-03。追補2〔リンクを保存場所のフォルダーへの文字のリンクに〕は人が承認 2026-11-05） | 3回 | 2026-11-05 | [合格基準書](05-flow-notify/pass-criteria.md) / [review-01](05-flow-notify/review-01.md) / [review-02](05-flow-notify/review-02.md) / [review-03](05-flow-notify/review-03.md) |
| 06 | 初期データを20件から5件に（人の決定 2026-11-10） | 完了 | 合格 100/100（review-01。06-12 は PAD 11.2610.155.0 で実機確認、5件 約46秒） | 0回 | 2026-11-10 | [合格基準書](06-data-5items/pass-criteria.md) / [review-01](06-data-5items/review-01.md) |

状態：未着手 / 合格基準書作成中 / 実装中 / 採点中 / 差し戻し中 / 完了 / 停止 / 保留

方針（2026-10-20、人の決定）：デモ版は 04d までを正とする。05 は `flows/application-check-notify/` に別資産として作る（4 は凍結）。4 に修正が入ったら 5 への反映要否を判断し、必要なら反映する。SharePoint の保存先などの実値は docs・flows に書かず、PAD 上で設定する。
