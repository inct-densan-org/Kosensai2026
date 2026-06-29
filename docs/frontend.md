# 高専祭 Web サイト フロントエンド設計書 2026

最終更新: 2026-06-28

## 1. 本書の位置づけ

本書は [site-specification.md](./site-specification.md) をもとにした、2026 年度版高専祭 Web サイトのフロントエンド設計書です。

- 対象範囲は `apps/web` を中心としたページ構成、UI 構成、データ取得方針です
- [backend.md](./backend.md) と対になる文書で、API 契約の詳細はバックエンド設計書を参照します
- 現在の `apps/web` 実装は最小構成ですが、本書では 2026 年度サイト全体を支える実装方針を定義します

## 2. フロントエンド全体方針

- フレームワークは Next.js App Router
- 公開サイトと CMS は同一 `apps/web` 内で管理する
- API 呼び出しは Hono RPC の型共有を前提にし、hand-written fetch 層を増やしすぎない
- 公開ページは SEO、初速、安定表示を優先し、可能な限り Server Component を基本にする
- フォーム、モーダル、リアクション、ズーム・パンなどの強い操作性が必要な箇所のみ Client Component に切り出す
- CMS は role ごとに表示制御し、`editor` `committee` `admin` の権限境界を画面側でも明示する
- デザインは学園祭らしい賑やかさを持たせつつ、過剰演出で可読性を落とさない
- モバイルファーストで組み、Safari/Firefox/Chrome/Edge を前提にする

## 3. 実装対象ページ一覧

### 3.1 公開ページ

- `/` トップページ
- `/news` お知らせ一覧
- `/news/[id]` お知らせ詳細
- `/blog` ブログ一覧
- `/blog/[id]` ブログ詳細
- `/map` 校内マップ
- `/events` イベント一覧
- `/events/[code]` イベント詳細
- `/login` CMS ログイン

### 3.2 CMS ページ

- `/cms` CMS トップ、または role に応じたダッシュボード分岐
- `/cms/news` お知らせ一覧
- `/cms/news/new` お知らせ作成
- `/cms/news/[id]` お知らせ編集
- `/cms/blog` ブログ一覧
- `/cms/blog/new` ブログ作成
- `/cms/blog/[id]` ブログ編集
- `/cms/events` イベント一覧
- `/cms/events/[id]` イベント基本情報編集
- `/cms/events/[id]/status` 当日変更編集
- `/cms/profile` 自分のセッション情報確認

### 3.3 Admin 専用ページ

- `/cms/admin` 管理者トップ
- `/cms/admin/users` ユーザー管理
- `/cms/admin/tags` タグ管理
- `/cms/admin/venues` 会場管理
- `/cms/admin/shops` 屋台管理
- `/cms/admin/map/layers` マップ階層管理
- `/cms/admin/map/pins` マップピン管理
- `/cms/admin/reactions` リアクション集計閲覧

## 4. App Router 構成方針

## 4.1 ルートグループ

`app` 配下は少なくとも以下のように分ける。

```txt
apps/web/src/app
├── (public)/
├── (cms)/
├── (cms-admin)/
├── api/               # Next 側で必要な route handler がある場合のみ
├── globals.css
└── layout.tsx
```

- `(public)` は来場者向け公開ページ
- `(cms)` は `editor` `committee` `admin` 共通で使う CMS ページ
- `(cms-admin)` は `admin` 専用ページ
- URL には route group 名を出さず、画面ごとの layout だけを分ける

## 4.2 想定ディレクトリ構成

```txt
apps/web/src
├── app/
│   ├── (public)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── news/
│   │   ├── blog/
│   │   ├── map/
│   │   └── events/
│   ├── (cms)/
│   │   ├── cms/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── news/
│   │   │   ├── blog/
│   │   │   ├── events/
│   │   │   └── profile/
│   │   └── login/
│   ├── (cms-admin)/
│   │   └── cms/
│   │       └── admin/
│   │           ├── layout.tsx
│   │           ├── page.tsx
│   │           ├── users/
│   │           ├── tags/
│   │           ├── venues/
│   │           ├── shops/
│   │           ├── map/
│   │           └── reactions/
│   ├── globals.css
│   └── layout.tsx
├── components/
├── features/
├── lib/
├── hooks/
└── types/
```

## 4.3 役割分担

- `app/*`
  - ルーティング、レイアウト、ページ単位のデータ取得入口
- `components/*`
  - 複数ページで使う共通 UI
- `features/*`
  - `news` `blog` `map` `events` `cms` など機能単位の UI とロジック
- `lib/*`
  - API client、認証 helper、日時整形、URL helper
- `hooks/*`
  - Client Component 向けカスタム hook
- `types/*`
  - UI 側で使う view model 型

## 5. レイアウト設計

## 5.1 ルートレイアウト

`apps/web/src/app/layout.tsx`

- `<html lang="ja">`
- 共通 metadata
- 共通フォント設定
- グローバル CSS 読み込み
- 必要なら theme provider や auth session provider をここで包む

## 5.2 公開レイアウト

`app/(public)/layout.tsx`

- 固定ヘッダー
- 主要導線ナビゲーション
- 背景表現
- フッター
- OGP や構造化データの共通設定

## 5.3 CMS 共通レイアウト

`app/(cms)/cms/layout.tsx`

- CMS ヘッダー
- サイドナビまたは下部ナビ
- セッション情報表示
- 権限に応じたメニュー制御

## 5.4 Admin レイアウト

`app/(cms-admin)/cms/admin/layout.tsx`

- 管理者メニューを CMS 一般画面と分離する
- `admin` 以外はここで即座にアクセス拒否または CMS トップへリダイレクトする

## 6. 公開ページ設計

## 6.1 `/` トップページ

### 画面構成

1. ヒーロー
2. 挨拶
3. トップ NEWS
4. 企画紹介
5. 注意事項
6. アクセス
7. 協賛
8. パンフレット

### 実装方針

- `page.tsx` は Server Component とする
- ヒーロー、挨拶、注意事項、アクセス、協賛、パンフレットの固定データは DB・API の管理対象外とし、ファイルまたは静的設定から組み立てる
- トップ NEWS と企画紹介に使うお知らせ・屋台情報は API から取得する
- セクションごとに `features/home/components/*` へ分割する
- 屋台詳細モーダルやスライダーは Client Component に分離する
- NEWS は最大表示件数を絞り、一覧ページへの導線を置く
- 企画紹介セクションは PC とモバイルで UI を切り替える

想定コンポーネント:

- `HeroSection`
- `GreetingSection`
- `TopNewsSection`
- `FeaturedShopsSection`
- `NoticeSection`
- `AccessSection`
- `SponsorsSection`
- `PamphletSection`
- `ShopDetailModal`

## 6.2 `/news`

### 一覧ページ

- Server Component で一覧取得
- ページネーション、タグ、重要度で絞り込める構成にする
- カードまたは縦リストで公開日、タイトル、タグを表示する

### 詳細ページ `/news/[id]`

- `generateMetadata` でタイトルと description を生成する
- 本文はサニタイズ済み HTML を表示する
- 添付画像がある場合のみ本文下または本文中に表示する

## 6.3 `/blog`

### 一覧ページ

- Server Component で初期一覧を取得する
- 検索入力、タグ、記事種別フィルタは Client Component にする
- 絞り込み変更時は URL クエリと同期する

### 詳細ページ `/blog/[id]`

- 本文、画像、動画、タグ、リアクション UI を表示する
- 動画は `preload="none"` を基本にする
- リアクション送信のみ Client Component に切り出す

## 6.4 `/map`

### 画面構成

1. 固定ナビ
2. 企画選択 UI
3. 補足案内カード
4. マップ表示
5. 屋台詳細モーダル

### 実装方針

- ベースデータ取得は Server Component で行う
- ズーム、パン、ピン選択、URL コピー、モーダル制御は Client Component にする
- `index` クエリを読み取り、初期選択状態へ反映する
- 1 屋台に複数ピンがある前提で、選択対象のピン集合を扱える state にする

想定コンポーネント:

- `MapShell`
- `MapLayerTabs`
- `MapCanvas`
- `PinOverlay`
- `MapSidebar`
- `TimetableModal`
- `ShopDetailModal`

## 6.5 `/events`

### 一覧ページ

- 日付、会場ごとのグルーピング表示
- `changed` `cancelled` の状態を視覚的に区別する
- 当日変更がある場合は通常情報と変更情報を併記する

### 詳細ページ `/events/[code]`

- 会場、時間、補足情報を表示する
- 1 code = 1 event として単一イベントを表示する

## 6.6 `/login`

- ユーザー名 + パスワード入力
- Better Auth の sign-in を呼ぶ
- ログイン後は role に応じて `/cms` または `/cms/admin` に遷移する

## 7. CMS ページ設計

## 7.1 `/cms`

- role に応じたメニューを表示する
- `editor` にはブログ中心の導線
- `committee` にはお知らせ、イベント当日変更導線を追加
- `admin` には `/cms/admin/*` への導線も表示する

## 7.2 `/cms/news`

- 一覧、検索、状態フィルタ、公開日表示
- 新規作成、編集、論理削除
- `committee` 以上のみ表示

## 7.3 `/cms/blog`

- 一覧、検索、記事種別フィルタ
- 下書き保存、プレビュー、公開予約
- `editor` 以上が利用可能

## 7.4 `/cms/events`

- 一覧表示と当日変更導線を分けて見せる
- 通常編集と当日変更編集は UI を分離する
- 当日運営を想定し、スマホでも押しやすい導線にする

## 7.5 `/cms/admin/*`

- `users` `tags` `venues` `shops` `map` `reactions` は管理者専用
- ルーティングだけでなくメニューも `admin` のみに表示する
- 一括更新系の画面では保存単位を明確にする

## 8. データ取得方針

## 8.1 API client

現行の `apps/web/src/lib/api.ts` を起点に、Hono RPC 型共有を使う。

- `hc<AppType>(apiBaseUrl)` を利用する
- API 型は `@kosensai/api` 側から import する
- DTO を UI ごとに手書きで重複定義しすぎない
- `lib/api.ts` には base client と薄い helper だけを置く

## 8.2 Server Component で取るもの

- お知らせ一覧と詳細
- ブログ一覧初期データと詳細
- イベント一覧と詳細
- マップ初期データ
- CMS 一覧ページの初回表示データ

## 8.3 Client Component で扱うもの

- フォーム送信
- モーダル開閉
- タブ切り替え
- リアクション送信
- 検索ボックス
- URL クエリと連動するフィルタ
- ズーム・パン操作

## 8.4 キャッシュ方針

- 公開一覧は `revalidate` を使った ISR 相当を基本とする
- イベント当日変更や CMS 後の即時反映が必要な箇所は `no-store` も検討する
- CMS 画面は最新性優先で `no-store` を基本とする

## 9. 状態管理方針

- ページ初期データは Server Component props で渡す
- ページ内の短命 state は `useState` で閉じる
- 複数コンポーネントで共有する UI state は feature 単位の context で扱う
- グローバル状態ライブラリは、必要になるまで導入しない
- URL に載せるべき状態は `searchParams` へ寄せる

## 10. コンポーネント分割方針

## 10.1 共通 UI

`components/ui/*`

- `Button`
- `Input`
- `Textarea`
- `Select`
- `Dialog`
- `Badge`
- `Pagination`
- `EmptyState`
- `ErrorState`
- `LoadingState`

## 10.2 ドメイン単位

`features/*`

- `features/home/*`
- `features/news/*`
- `features/blog/*`
- `features/map/*`
- `features/events/*`
- `features/cms-news/*`
- `features/cms-blog/*`
- `features/cms-events/*`
- `features/cms-admin/*`

### 分割ルール

- API 呼び出しを直接 UI 部品の深い階層へ散らさない
- `page.tsx` に JSX と状態管理を詰め込みすぎない
- フォームは `FormShell` と入力部品を分離する
- モーダルはトリガーと本体を分離し、再利用しやすくする

## 11. 認証・認可のフロント方針

- ログイン状態は Better Auth のセッション API を基準に判断する
- CMS レイアウトで未認証なら `/login` へリダイレクトする
- `admin` 専用画面はレイアウト段階でガードする
- role に応じてサイドメニュー、ボタン、編集導線を出し分ける
- 非表示だけでなく、サーバー側でもアクセス制御前提とする

## 12. フォーム実装方針

- 入力検証は UI 側でも最低限行うが、最終判断は API 側に委ねる
- エディタ画面は保存中、保存成功、保存失敗の状態を明示する
- 公開予約や公開状態変更は誤操作を避ける確認 UI を置く
- 画像 upload はドラッグアンドドロップ対応を検討する
- 動画 upload は進捗表示を必須とする

## 13. スタイリング方針

- グローバル変数は `globals.css` で管理する
- サイト全体の色、余白、角丸、影は CSS 変数化する
- ページ固有の複雑な見た目は feature 単位に閉じる
- デフォルトの無難な見た目に寄りすぎず、学園祭サイトとしての印象を持たせる
- ただし CMS は公開サイトより操作性、可読性、情報密度を優先する

## 14. メタデータ・SEO 方針

- 公開ページは `generateMetadata` を適切に実装する
- お知らせ詳細、ブログ詳細はタイトルと要約を description に使う
- OGP 画像がある記事は記事ごとに差し替え可能にする
- CMS やログインページはインデックス対象にしない

## 15. エラーハンドリング方針

- `not-found.tsx` を公開詳細ページと CMS 編集ページで適切に用意する
- `error.tsx` でページ単位の表示崩壊を防ぐ
- API エラー時はユーザーが次に何をすればよいか分かる文言にする
- データ 0 件はエラーではなく空状態 UI で扱う

## 16. 環境変数

- `NEXT_PUBLIC_API_URL`
  - API ベース URL

備考:

- 現行 `apps/web/src/lib/api.ts` でも `parseWebEnv(process.env)` を通して利用している
