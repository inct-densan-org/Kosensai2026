# 高専祭 Web サイト バックエンド設計書 2026

最終更新: 2026-06-28

## 1. 本書の位置づけ

本書は [site-specification.md](./site-specification.md) をもとにした、2026 年度版高専祭 Web サイトのバックエンド設計書です。

- 対象範囲は `apps/api` を中心とした API、認証、DB 設計です
- 現在の `apps/api` 実装は `messages` と `health` の最小構成ですが、本書では 2026 年度サイト全体を支える本番設計を定義します
- フロントのページ仕様は `site-specification.md`、本書はそれを支えるデータ構造と API 契約を扱います

## 2. バックエンド全体方針

- API フレームワークは Hono
- DB は SQLite + Drizzle ORM
- 認証は Better Auth
- 公開 API と CMS API はパスと認可で分離する
- トップページの固定セクションデータは DB・API の管理対象外とし、この設計書の対象から外す
- 画像・動画はローカルストレージ保存、DB にはメタデータと参照パスのみ保存する
- 日時はすべて ISO 8601 文字列で保存・返却する
- 主キーは原則 `integer` の自動採番
- 外部参照やデータ再投入に備え、必要なテーブルは別途 stable な運用IDを `unique` で持つ
- 論理削除が必要なデータは `deletedAt` を持つ
- 公開制御が必要なデータは `status` と `publishedAt` を持つ

## 3. API 空間

### 3.1 ルート構成

- `GET /health`
  - ヘルスチェック
- `GET /public/*`
  - 公開サイト向け API
- `POST /auth/*`
  - Better Auth の認証 API
- `GET|POST|PATCH|DELETE /cms/*`
  - CMS 向け API

### 3.2 共通レスポンス形式

成功時:

```json
{
  "data": {}
}
```

一覧取得:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 120,
    "totalPages": 6
  }
}
```

失敗時:

```json
{
  "error": {
    "code": "validation_error",
    "message": "Invalid request",
    "details": {}
  }
}
```

### 3.3 権限制御

- `editor`
  - ブログ記事の作成、更新、下書き保存、論理削除
- `committee`
  - `editor` 権限に加えて、お知らせ作成、イベント当日変更、イベント基本情報更新
  - 実行委員会に発行
- `admin`
  - `committee` 権限に加えて、ユーザー、タグ、会場、屋台、マップ、リアクション集計の管理

## 4. DB 設計

## 4.1 テーブル一覧

| テーブル名 | 用途 |
|---|---|
| `users` | Better Auth のユーザー本体 |
| `sessions` | Better Auth のセッション |
| `accounts` | Better Auth の認証アカウント |
| `verifications` | Better Auth の認証補助データ |
| `news_articles` | お知らせ |
| `blog_articles` | ブログ記事 |
| `tags` | 記事タグ |
| `news_article_tags` | お知らせとタグの中間 |
| `blog_article_tags` | ブログとタグの中間 |
| `media_assets` | 画像・動画ファイルのメタデータ |
| `news_article_media` | お知らせ本文添付 |
| `blog_article_media` | ブログ本文添付 |
| `event_venues` | 会場情報 |
| `events` | イベント本体 |
| `event_status_overrides` | 当日変更の最新状態 |
| `shops` | 屋台・企画詳細 |
| `shop_menu_items` | 屋台メニュー |
| `map_layers` | マップの階層・エリア |
| `map_pins` | 企画ピン、静的ピン、ラベル |
| `map_pin_timetable_groups` | ピンに紐づく時刻表グループ |
| `map_pin_timetable_entries` | 時刻表明細 |
| `reactions` | 個別リアクション記録 |
| `reaction_summaries` | 集計済みリアクション数 |

## 4.1.1 ID 方針

- `id` は内部参照用の主キーとして自動採番する
- 表示順は `sortOrder` で管理し、`id` に順序の意味を持たせない
- 外部参照、CSV 連携、データ再投入時の突合、運用上の識別には別カラムの運用IDを使う
- 運用IDは `code` を基本名とし、英数字とハイフンのみ、テーブル内で `unique` とする
- 公開 URL は専用 `slug` カラムを持たず、必要に応じて `code` または `id` をそのまま使う
- 運用IDの対象は `event_venues` `events` `shops` `shop_menu_items` `map_layers` `map_pins`

## 4.2 認証系テーブル

Better Auth は SQLite/Drizzle 向けのスキーマ定義とテーブル生成導線を持っているため、認証系テーブルは Better Auth の公式生成物をベースに利用する。

- `users` `sessions` `accounts` `verifications` は Better Auth が要求する構造を優先する
- 本書はその上に必要となる業務カラムを含めた最終形を示す
- 実装時は Better Auth の生成スキーマを起点にし、追加項目は拡張設定で寄せる
- 認証テーブルを完全に hand-written で再定義する前提にはしない

### `users`

運営ユーザー。公開側来場者ユーザーは持たない。

| カラム名 | 型 | 必須 | 説明 |
|---|---|---|---|
| `id` | integer | yes | 主キー |
| `username` | text | yes | ログイン ID。一意 |
| `displayName` | text | yes | CMS 表示名 |
| `email` | text | no | 任意連絡先。基本使わない設計にする|
| `passwordHash` | text | yes | Better Auth 管理のハッシュ |
| `role` | text | yes | `editor` `committee` `admin` |
| `isActive` | integer | yes | 0 or 1 |
| `lastLoginAt` | text | no | 最終ログイン日時 |
| `createdAt` | text | yes | 作成日時 |
| `updatedAt` | text | yes | 更新日時 |
| `deletedAt` | text | no | 論理削除日時 |

インデックス:

- `unique(username)`
- `index(role, isActive)`

### `sessions`

Better Auth セッション。

| カラム名 | 型 | 必須 | 説明 |
|---|---|---|---|
| `id` | text | yes | セッション ID |
| `userId` | integer | yes | `users.id` |
| `token` | text | yes | セッショントークン。一意 |
| `expiresAt` | text | yes | 失効日時 |
| `ipAddress` | text | no | 監査用 |
| `userAgent` | text | no | 監査用 |
| `createdAt` | text | yes | 作成日時 |
| `updatedAt` | text | yes | 更新日時 |

### `accounts`

Better Auth の認証プロバイダ情報。初期はローカル認証のみ想定。

| カラム名 | 型 | 必須 | 説明 |
|---|---|---|---|
| `id` | text | yes | 主キー |
| `userId` | integer | yes | `users.id` |
| `provider` | text | yes | `credential` など |
| `providerAccountId` | text | yes | プロバイダ側 ID |
| `createdAt` | text | yes | 作成日時 |
| `updatedAt` | text | yes | 更新日時 |

### `verifications`

パスワード再設定や一時トークン用途を想定。

| カラム名 | 型 | 必須 | 説明 |
|---|---|---|---|
| `id` | text | yes | 主キー |
| `identifier` | text | yes | 対象識別子 |
| `value` | text | yes | トークンやコード |
| `expiresAt` | text | yes | 失効日時 |
| `createdAt` | text | yes | 作成日時 |

## 4.3 記事系テーブル

### `tags`

記事タグ。

| カラム名 | 型 | 必須 | 説明 |
|---|---|---|---|
| `id` | integer | yes | PK |
| `name` | text | yes | 表示名 |
| `color` | text | no | CMS 上の表示補助色 |
| `createdAt` | text | yes | 作成日時 |
| `updatedAt` | text | yes | 更新日時 |
| `deletedAt` | text | no | 論理削除日時 |

### `news_articles`

お知らせ本体。

| カラム名 | 型 | 必須 | 説明 |
|---|---|---|---|
| `id` | integer | yes | PK |
| `title` | text | yes | お知らせタイトル |
| `excerpt` | text | no | 一覧用短文 |
| `body` | text | yes | 原文。Markdown または HTML |
| `sanitizedBody` | text | yes | 公開返却用 HTML |
| `status` | text | yes | `draft` `scheduled` `published` `archived` |
| `priority` | text | yes | `high` `medium` |
| `publishedAt` | text | no | 公開日時 |
| `scheduledAt` | text | no | 予約投稿日時 |
| `createdBy` | integer | yes | `users.id` |
| `updatedBy` | integer | yes | `users.id` |
| `createdAt` | text | yes | 作成日時 |
| `updatedAt` | text | yes | 更新日時 |
| `deletedAt` | text | no | 論理削除日時 |

インデックス:

- `index(status, publishedAt desc)`
- `index(priority, publishedAt desc)`

### `blog_articles`

ブログ記事本体。

| カラム名 | 型 | 必須 | 説明 |
|---|---|---|---|
| `id` | integer | yes | PK |
| `title` | text | yes | 記事タイトル |
| `excerpt` | text | no | 一覧概要 |
| `body` | text | yes | 原文 |
| `sanitizedBody` | text | yes | 公開返却用 HTML |
| `status` | text | yes | `draft` `scheduled` `published` `archived` |
| `articleType` | text | yes | `shop-feature` `review` `highlight` `behind-the-scenes` |
| `coverMediaId` | integer | no | アイキャッチ |
| `authorUserId` | integer | yes | 作成ユーザー |
| `authorDisplayName` | text | no | 表示名義 |
| `publishedAt` | text | no | 公開日時 |
| `scheduledAt` | text | no | 予約投稿日時 |
| `createdBy` | integer | yes | `users.id` |
| `updatedBy` | integer | yes | `users.id` |
| `createdAt` | text | yes | 作成日時 |
| `updatedAt` | text | yes | 更新日時 |
| `deletedAt` | text | no | 論理削除日時 |

インデックス:

- `index(status, publishedAt desc)`
- `index(articleType, publishedAt desc)`

### `news_article_tags`

| カラム名 | 型 | 必須 | 説明 |
|---|---|---|---|
| `newsArticleId` | integer | yes | `news_articles.id` |
| `tagId` | integer | yes | `tags.id` |
| `createdAt` | text | yes | 付与日時 |

制約:

- `primary key(newsArticleId, tagId)`

### `blog_article_tags`

| カラム名 | 型 | 必須 | 説明 |
|---|---|---|---|
| `blogArticleId` | integer | yes | `blog_articles.id` |
| `tagId` | integer | yes | `tags.id` |
| `createdAt` | text | yes | 付与日時 |

制約:

- `primary key(blogArticleId, tagId)`

## 4.4 メディア系テーブル

### `media_assets`

アップロードファイルの共通管理。

| カラム名 | 型 | 必須 | 説明 |
|---|---|---|---|
| `id` | integer | yes | 主キー |
| `kind` | text | yes | `image` `video` `document` |
| `storagePath` | text | yes | サーバー内保存パス |
| `publicUrl` | text | yes | 公開 URL |
| `originalName` | text | yes | 元ファイル名 |
| `mimeType` | text | yes | MIME type |
| `size` | integer | yes | バイト数 |
| `width` | integer | no | 画像・動画幅 |
| `height` | integer | no | 画像・動画高 |
| `durationSeconds` | integer | no | 動画長さ |
| `altText` | text | no | 画像代替文 |
| `uploadedBy` | integer | yes | `users.id` |
| `createdAt` | text | yes | 作成日時 |
| `deletedAt` | text | no | 論理削除日時 |

### `news_article_media`

| カラム名 | 型 | 必須 | 説明 |
|---|---|---|---|
| `id` | integer | yes | 主キー |
| `newsArticleId` | integer | yes | `news_articles.id` |
| `mediaAssetId` | integer | yes | `media_assets.id` |
| `sortOrder` | integer | yes | 表示順 |
| `usageType` | text | yes | `inline` `thumbnail` |
| `createdAt` | text | yes | 作成日時 |

### `blog_article_media`

| カラム名 | 型 | 必須 | 説明 |
|---|---|---|---|
| `id` | integer | yes | 主キー |
| `blogArticleId` | integer | yes | `blog_articles.id` |
| `mediaAssetId` | integer | yes | `media_assets.id` |
| `sortOrder` | integer | yes | 表示順 |
| `usageType` | text | yes | `cover` `inline` `gallery` `video` |
| `createdAt` | text | yes | 作成日時 |

## 4.5 イベント系テーブル

### `event_venues`

会場マスタ。

| カラム名 | 型 | 必須 | 説明 |
|---|---|---|---|
| `id` | integer | yes | 主キー |
| `code` | text | yes | 運用上の安定識別子。一意 |
| `name` | text | yes | 会場名 |
| `description` | text | no | 補足説明 |
| `mapLayerId` | integer | no | `map_layers.id` |
| `createdAt` | text | yes | 作成日時 |
| `updatedAt` | text | yes | 更新日時 |

制約:

- `unique(code)`

### `events`

タイムテーブルに表示するイベント。

| カラム名 | 型 | 必須 | 説明 |
|---|---|---|---|
| `id` | integer | yes | 主キー |
| `code` | text | yes | 運用上の安定識別子。一意 |
| `title` | text | yes | 演目名または企画名 |
| `description` | text | no | 詳細説明 |
| `venueId` | integer | yes | `event_venues.id` |
| `eventDate` | text | yes | `YYYY-MM-DD` |
| `startAt` | text | yes | ISO 8601 |
| `endAt` | text | yes | ISO 8601 |
| `status` | text | yes | `scheduled` `changed` `cancelled` |
| `notes` | text | no | 補足情報 |
| `rainyVenueText` | text | no | 雨天代替会場表示 |
| `restrictionText` | text | no | 参加制限表示 |
| `createdAt` | text | yes | 作成日時 |
| `updatedAt` | text | yes | 更新日時 |
| `deletedAt` | text | no | 論理削除日時 |

インデックス:

- `unique(code)`
- `index(eventDate, venueId, startAt)`
- `index(status, eventDate, startAt)`

### `event_status_overrides`

当日変更は履歴を持たず、1 イベント 1 レコードの最新状態のみ保持する。

| カラム名 | 型 | 必須 | 説明 |
|---|---|---|---|
| `eventId` | integer | yes | `events.id`。主キー兼外部キー |
| `changeType` | text | yes | `cancelled` `time_changed` `venue_changed` `note_updated` |
| `overrideStatus` | text | yes | `changed` `cancelled` |
| `overrideStartAt` | text | no | 変更後開始時刻 |
| `overrideEndAt` | text | no | 変更後終了時刻 |
| `overrideVenueId` | integer | no | 変更後会場 |
| `message` | text | no | 補足文 |
| `updatedBy` | integer | yes | `users.id` |
| `updatedAt` | text | yes | 更新日時 |

## 4.6 屋台・マップ系テーブル

### `shops`

トップ企画紹介とマップモーダルで使う屋台情報。

| カラム名 | 型 | 必須 | 説明 |
|---|---|---|---|
| `id` | integer | yes | 主キー |
| `code` | text | yes | 運用上の安定識別子。一意 |
| `name` | text | yes | 屋台名 |
| `description` | text | yes | 説明文 |
| `posterMediaId` | integer | no | ポスター画像 |
| `snsUrl` | text | no | SNS リンク |
| `status` | text | yes | `draft` `published` `hidden` |
| `sortOrder` | integer | yes | 表示順 |
| `createdAt` | text | yes | 作成日時 |
| `updatedAt` | text | yes | 更新日時 |
| `deletedAt` | text | no | 論理削除日時 |

制約:

- `unique(code)`

### `shop_menu_items`

| カラム名 | 型 | 必須 | 説明 |
|---|---|---|---|
| `id` | integer | yes | 主キー |
| `code` | text | yes | 運用上の安定識別子。一意 |
| `shopId` | integer | yes | `shops.id` |
| `name` | text | yes | メニュー名 |
| `description` | text | no | 補足説明 |
| `price` | integer | yes | 円 |
| `taxMode` | text | yes | `included` `excluded` |
| `sortOrder` | integer | yes | 表示順 |
| `createdAt` | text | yes | 作成日時 |
| `updatedAt` | text | yes | 更新日時 |

制約:

- `unique(code)`

### `map_layers`

マップ画像の階層やフロアを管理する。

| カラム名 | 型 | 必須 | 説明 |
|---|---|---|---|
| `id` | integer | yes | 主キー |
| `code` | text | yes | 運用上の安定識別子。一意 |
| `name` | text | yes | 表示名 |
| `imageUrl` | text | yes | ベース画像 URL |
| `width` | integer | no | 元画像幅 |
| `height` | integer | no | 元画像高 |
| `sortOrder` | integer | yes | 表示順 |
| `createdAt` | text | yes | 作成日時 |
| `updatedAt` | text | yes | 更新日時 |

制約:

- `unique(code)`

### `map_pins`

企画ピン、案内ピン、ラベルを一元管理する。

| カラム名 | 型 | 必須 | 説明 |
|---|---|---|---|
| `id` | integer | yes | 主キー |
| `code` | text | yes | 運用上の安定識別子。一意 |
| `mapLayerId` | integer | yes | `map_layers.id` |
| `pinType` | text | yes | `shop` `guide` `label` |
| `shopId` | integer | no | `shops.id` |
| `title` | text | yes | 表示名 |
| `label` | text | no | ピン番号や短い識別子 |
| `description` | text | no | モーダル補足 |
| `x` | real | yes | 画像基準 X 座標 |
| `y` | real | yes | 画像基準 Y 座標 |
| `color` | text | no | ピン色 |
| `iconType` | text | no | `reception` `rest` `trash` `bus` など |
| `isInteractive` | integer | yes | 0 or 1 |
| `sortOrder` | integer | yes | 表示順 |
| `createdAt` | text | yes | 作成日時 |
| `updatedAt` | text | yes | 更新日時 |

インデックス:

- `unique(code)`
- `index(shopId)`
- `index(pinType, iconType)`

### `map_pin_timetable_groups`

| カラム名 | 型 | 必須 | 説明 |
|---|---|---|---|
| `id` | integer | yes | 主キー |
| `mapPinId` | integer | yes | `map_pins.id` |
| `title` | text | yes | 時刻表タイトル |
| `description` | text | no | 補足説明 |
| `sortOrder` | integer | yes | 表示順 |
| `createdAt` | text | yes | 作成日時 |
| `updatedAt` | text | yes | 更新日時 |

### `map_pin_timetable_entries`

| カラム名 | 型 | 必須 | 説明 |
|---|---|---|---|
| `id` | integer | yes | 主キー |
| `groupId` | integer | yes | `map_pin_timetable_groups.id` |
| `departureAt` | text | yes | 機械可読な出発時刻 |
| `label` | text | yes | 画面表示用時刻文字列 |
| `note` | text | no | 備考 |
| `sortOrder` | integer | yes | 表示順 |
| `createdAt` | text | yes | 作成日時 |
| `updatedAt` | text | yes | 更新日時 |

## 4.7 リアクション系テーブル

### `reactions`

公開側からの 1 端末 1 リアクション管理。

| カラム名 | 型 | 必須 | 説明 |
|---|---|---|---|
| `id` | integer | yes | 主キー |
| `targetType` | text | yes | `blog` `shop` |
| `targetId` | integer | yes | 対象レコード ID |
| `fingerprint` | text | yes | Cookie または端末識別子 |
| `reactionType` | text | yes | 2026 年度は `heart` 固定 |
| `createdAt` | text | yes | 作成日時 |

制約:

- `unique(targetType, targetId, fingerprint, reactionType)`

### `reaction_summaries`

一覧高速化用の集計テーブル。

| カラム名 | 型 | 必須 | 説明 |
|---|---|---|---|
| `targetType` | text | yes | `blog` `shop` |
| `targetId` | integer | yes | 対象レコード ID |
| `reactionType` | text | yes | `heart` |
| `count` | integer | yes | 集計数 |
| `updatedAt` | text | yes | 集計更新日時 |

制約:

- `primary key(targetType, targetId, reactionType)`

## 5. 公開 API 設計

### 5.1 実装対象エンドポイント一覧

- ( `/health` [`GET`] )
- `/public/news` [`GET`]
- `/public/news/:id` [`GET`]
- `/public/blog` [`GET`]
- `/public/blog/:id` [`GET`]
- `/public/map` [`GET`]
- `/public/shops/:id` [`GET`]
- `/public/events` [`GET`]
- `/public/events/:code` [`GET`]
- `/public/reactions/:targetType/:targetId` [`GET`]
- `/public/reactions` [`POST`]

### 5.2 GET `/health`

用途:

- 稼働確認

レスポンス:

```json
{
  "data": {
    "ok": true,
    "timestamp": "2026-06-28T12:34:56.000Z"
  }
}
```

### 5.4 GET `/public/news`

クエリ:

- `page`: number
- `pageSize`: number
- `tagId`: number
- `priority`: `high` `medium`

レスポンス例:

```json
{
  "data": [
    {
      "id": 10,
      "title": "台風接近に伴う開催情報",
      "excerpt": "開催可否に関するお知らせです",
      "priority": "high",
      "publishedAt": "2026-10-31T09:00:00.000Z"
    }
  ]
}
```

並び順:

- `priority = high` を先頭
- 同 priority 内は `publishedAt desc`

### 5.5 GET `/public/news/:id`

パス:

- `id`: integer

レスポンス:

```json
{
  "data": {
    "id": 10,
    "title": "台風接近に伴う開催情報",
    "excerpt": "開催可否に関するお知らせです",
    "body": "<p>...</p>",
    "priority": "high",
    "media": [],
    "publishedAt": "2026-10-31T09:00:00.000Z"
  }
}
```

備考:

- `body` は必ずサニタイズ済み HTML

### 5.6 GET `/public/blog`

クエリ:

- `page`: number
- `pageSize`: number
- `q`: string
- `tagId`: number
- `articleType`: string

レスポンス:

```json
{
  "data": [
    {
      "id": 25,
      "title": "焼きそば屋台の推しポイント",
      "excerpt": "おすすめ商品を紹介します",
      "coverImageUrl": "/uploads/media/25.webp",
      "tags": [],
      "articleType": "shop-feature",
      "author": {
        "id": 4,
        "displayName": "実行委員会"
      },
      "reactionCount": 18,
      "publishedAt": "2026-10-29T12:00:00.000Z"
    }
  ]
}
```

検索対象:

- `title`
- `excerpt`
- `body`

### 5.7 GET `/public/blog/:id`

パス:

- `id`: integer

レスポンス:

```json
{
  "data": {
    "id": 25,
    "title": "焼きそば屋台の推しポイント",
    "excerpt": "おすすめ商品を紹介します",
    "body": "<p>...</p>",
    "coverImageUrl": "/uploads/media/25.webp",
    "media": [
      {
        "id": 81,
        "kind": "image",
        "url": "/uploads/media/81.webp",
        "altText": "調理中の様子"
      }
    ],
    "videos": [
      {
        "id": 82,
        "kind": "video",
        "url": "/uploads/media/82.mp4",
        "posterUrl": "/uploads/media/82-poster.webp",
        "durationSeconds": 32
      }
    ],
    "tags": [],
    "articleType": "shop-feature",
    "author": {
      "id": 4,
      "displayName": "実行委員会"
    },
    "reactionCount": 18,
    "publishedAt": "2026-10-29T12:00:00.000Z"
  }
}
```

### 5.8 GET `/public/map`

用途:

- `/map` ページ初期表示用の全体データ

クエリ:

- `index`: number 任意

レスポンス:

```json
{
  "data": {
    "layers": [],
    "pins": [],
    "shops": [],
    "selectedIndex": 0
  }
}
```

備考:

- `index` 指定時は対象屋台をレスポンスに含める
- フロントはこの値を使って対象マップへスクロールする

### 5.9 GET `/public/shops/:id`

パス:

- `id`: integer

レスポンス:

```json
{
  "data": {
    "id": 7,
    "name": "焼きそば屋台",
    "description": "こだわりソースの焼きそばを提供します",
    "posterImageUrl": "/uploads/media/91.webp",
    "snsUrl": "https://example.com",
    "menuItems": [
      {
        "id": 1,
        "name": "焼きそば",
        "price": 500,
        "taxMode": "included"
      }
    ],
    "reactionCount": 42
  }
}
```

### 5.10 GET `/public/events`

クエリ:

- `date`: `YYYY-MM-DD` 任意
- `venueCode`: string 任意

レスポンス:

```json
{
  "data": [
    {
      "id": 12,
      "code": "light-music-stage-1",
      "title": "軽音ライブ",
      "venue": {
        "id": 2,
        "name": "中庭ステージ"
      },
      "eventDate": "2026-11-01",
      "startAt": "2026-11-01T10:00:00+09:00",
      "endAt": "2026-11-01T10:30:00+09:00",
      "status": "changed",
      "override": {
        "changeType": "time_changed",
        "message": "開始が 10 分遅れます",
        "startAt": "2026-11-01T10:10:00+09:00",
        "endAt": "2026-11-01T10:40:00+09:00",
        "venue": null
      }
    }
  ]
}
```

### 5.11 GET `/public/events/:code`

パス:

- `code`: string

レスポンス:

```json
{
  "data": {
    "id": 12,
    "title": "軽音ライブ",
    "description": "演奏企画の紹介文",
    "venue": {
      "id": 2,
      "name": "中庭ステージ"
    },
    "eventDate": "2026-11-01",
    "startAt": "2026-11-01T10:00:00+09:00",
    "endAt": "2026-11-01T10:30:00+09:00",
    "status": "changed",
    "notes": "雨天時は体育館へ移動",
    "override": {
      "changeType": "time_changed",
      "message": "開始が 10 分遅れます",
      "startAt": "2026-11-01T10:10:00+09:00",
      "endAt": "2026-11-01T10:40:00+09:00",
      "venue": null
    }
  }
}
```

### 5.12 GET `/public/reactions/:targetType/:targetId`

パス:

- `targetType`: `blog` `shop`
- `targetId`: integer

レスポンス:

```json
{
  "data": {
    "targetType": "shop",
    "targetId": 7,
    "reactionType": "heart",
    "count": 42,
    "reacted": true
  }
}
```

### 5.13 POST `/public/reactions`

リクエスト:

```json
{
  "targetType": "shop",
  "targetId": 7
}
```

レスポンス:

```json
{
  "data": {
    "targetType": "shop",
    "targetId": 7,
    "reactionType": "heart",
    "count": 43,
    "reacted": true
  }
}
```

制御:

- Cookie または署名付き端末識別子で重複送信を抑止
- 同一対象への二重登録は `409`

## 6. CMS API 設計

### 6.1 実装対象エンドポイント一覧

- `/auth/sign-in` [`POST`]
- `/auth/sign-out` [`POST`]
- `/cms/session` [`GET`]
- `/cms/news` [`GET`/`POST`]
- `/cms/news/:id` [`PATCH`/`DELETE`]
- `/cms/blog` [`GET`/`POST`]
- `/cms/blog/:id` [`PATCH`/`DELETE`]
- `/cms/blog/:id/preview` [`POST`]
- `/cms/media` [`POST`]
- `/cms/media/:id` [`DELETE`]
- `/cms/events` [`GET`/`POST`]
- `/cms/events/:id` [`PATCH`]
- `/cms/events/:id/status` [`PATCH`/`DELETE`]
- `/cms/admin/venues` [`GET`/`POST`]
- `/cms/admin/venues/:id` [`PATCH`/`DELETE`]
- `/cms/admin/shops` [`GET`/`POST`]
- `/cms/admin/shops/:id` [`PATCH`/`DELETE`]
- `/cms/admin/map/layers` [`GET`/`POST`]
- `/cms/admin/map/layers/:id` [`PATCH`/`DELETE`]
- `/cms/admin/map/pins` [`GET`/`POST`]
- `/cms/admin/map/pins/:id` [`PATCH`/`DELETE`]
- `/cms/admin/map/pins/:id/timetable` [`GET`/`PUT`]
- `/cms/admin/tags` [`GET`/`POST`]
- `/cms/admin/tags/:id` [`PATCH`/`DELETE`]
- `/cms/admin/users` [`GET`/`POST`]
- `/cms/admin/users/:id` [`PATCH`/`DELETE`]
- `/cms/admin/reactions` [`GET`]

### 6.2 認証 API

### POST `/auth/sign-in`

リクエスト:

```json
{
  "username": "committee01",
  "password": "plain-password"
}
```

レスポンス:

```json
{
  "data": {
    "user": {
      "id": 1,
      "displayName": "実行委員",
      "role": "committee"
    }
  }
}
```

### POST `/auth/sign-out`

レスポンス:

```json
{
  "data": {
    "ok": true
  }
}
```

### GET `/cms/session`

レスポンス:

```json
{
  "data": {
    "user": {
      "id": 1,
      "username": "committee01",
      "displayName": "実行委員",
      "role": "committee"
    }
  }
}
```

### 6.3 CMS 記事 API

### GET `/cms/news`

クエリ:

- `page`
- `pageSize`
- `status`
- `priority`
- `tagId`

レスポンスは公開 API に加えて管理情報を含める。

追加返却項目:

- `status`
- `scheduledAt`
- `createdAt`
- `updatedAt`
- `createdBy`
- `updatedBy`

### POST `/cms/news`

権限:

- `committee` 以上

リクエスト:

```json
{
  "title": "台風接近に伴う開催情報",
  "excerpt": "開催可否に関するお知らせです",
  "body": "# お知らせ本文",
  "status": "published",
  "priority": "high",
  "tagIds": [2, 3],
  "thumbnailMediaId": 30,
  "publishedAt": "2026-10-31T09:00:00.000Z",
  "scheduledAt": null
}
```

レスポンス:

```json
{
  "data": {
    "id": 10
  }
}
```

### PATCH `/cms/news/:id`

権限:

- `committee` 以上

更新対象:

- タイトル
- 本文
- 公開状態
- 優先度
- タグ
- 公開日時

### DELETE `/cms/news/:id`

権限:

- `committee` 以上

挙動:

- 論理削除

### GET `/cms/blog`

クエリ:

- `page`
- `pageSize`
- `status`
- `articleType`
- `tagId`
- `authorUserId`
- `q`

### POST `/cms/blog`

権限:

- `editor` 以上

リクエスト:

```json
{
  "title": "焼きそば屋台の推しポイント",
  "excerpt": "おすすめ商品を紹介します",
  "body": "# 本文",
  "status": "draft",
  "articleType": "shop-feature",
  "tagIds": [4],
  "coverMediaId": 81,
  "authorDisplayName": "実行委員会",
  "publishedAt": null,
  "scheduledAt": null,
  "mediaIds": [81, 82]
}
```

### PATCH `/cms/blog/:id`

権限:

- `editor` 以上
- 自分の作成記事以外を編集できるかは `committee` 以上のみ許可

### DELETE `/cms/blog/:id`

権限:

- `editor` 以上

挙動:

- 論理削除

### POST `/cms/blog/:id/preview`

用途:

- 下書きプレビュー用 HTML 生成

レスポンス:

```json
{
  "data": {
    "sanitizedBody": "<p>...</p>"
  }
}
```

### 6.4 CMS メディア API

### POST `/cms/media`

権限:

- `editor` 以上

リクエスト:

- `multipart/form-data`
- `file`
- `kind`
- `altText`

レスポンス:

```json
{
  "data": {
    "id": 81,
    "kind": "image",
    "url": "/uploads/media/81.webp"
  }
}
```

### DELETE `/cms/media/:id`

権限:

- `editor` 以上

挙動:

- 参照中なら削除不可
- 未参照なら論理削除

### 6.5 CMS イベント API

### GET `/cms/events`

クエリ:

- `date`
- `venueId`
- `status`

### POST `/cms/events`

権限:

- `committee` 以上

リクエスト:

```json
{
  "title": "軽音ライブ",
  "code": "light-music-stage-1",
  "description": "演奏企画の紹介文",
  "venueId": 2,
  "eventDate": "2026-11-01",
  "startAt": "2026-11-01T10:00:00+09:00",
  "endAt": "2026-11-01T10:30:00+09:00",
  "notes": "雨天時は体育館へ移動"
}
```

### PATCH `/cms/events/:id`

権限:

- `committee` 以上

### PATCH `/cms/events/:id/status`

権限:

- `committee` 以上

リクエスト:

```json
{
  "changeType": "time_changed",
  "overrideStatus": "changed",
  "overrideStartAt": "2026-11-01T10:10:00+09:00",
  "overrideEndAt": "2026-11-01T10:40:00+09:00",
  "overrideVenueId": null,
  "message": "開始が 10 分遅れます"
}
```

レスポンス:

```json
{
  "data": {
    "eventId": 12,
    "status": "changed"
  }
}
```

### DELETE `/cms/events/:id/status`

権限:

- `committee` 以上

挙動:

- `event_status_overrides` を削除し、`events.status` を `scheduled` に戻す

### 6.6 CMS 会場 API

### GET `/cms/admin/venues`
### POST `/cms/admin/venues`
### PATCH `/cms/admin/venues/:id`
### DELETE `/cms/admin/venues/:id`

権限:

- `admin`

### 6.7 CMS 屋台・マップ API

### GET `/cms/admin/shops`
### POST `/cms/admin/shops`
### PATCH `/cms/admin/shops/:id`
### DELETE `/cms/admin/shops/:id`

権限:

- `admin`

`POST` / `PATCH` のリクエスト例:

```json
{
  "code": "yakisoba",
  "name": "焼きそば屋台",
  "description": "こだわりソースの焼きそばを提供します",
  "posterMediaId": 91,
  "snsUrl": "https://example.com",
  "status": "published",
  "menuItems": [
    {
      "name": "焼きそば",
      "description": "",
      "price": 500,
      "taxMode": "included",
      "sortOrder": 1
    }
  ]
}
```

### GET `/cms/admin/map/layers`
### POST `/cms/admin/map/layers`
### PATCH `/cms/admin/map/layers/:id`
### DELETE `/cms/admin/map/layers/:id`

権限:

- `admin`

### GET `/cms/admin/map/pins`
### POST `/cms/admin/map/pins`
### PATCH `/cms/admin/map/pins/:id`
### DELETE `/cms/admin/map/pins/:id`

権限:

- `admin`

リクエスト例:

```json
{
  "code": "nakaniwa-12",
  "mapLayerId": 2,
  "pinType": "shop",
  "shopId": 7,
  "title": "焼きそば屋台",
  "label": "12",
  "description": "中庭エリア",
  "x": 320.5,
  "y": 180.2,
  "color": "#ff7a00",
  "iconType": null,
  "isInteractive": true,
  "sortOrder": 12
}
```

### GET `/cms/admin/map/pins/:id/timetable`
### PUT `/cms/admin/map/pins/:id/timetable`

権限:

- `admin`

用途:

- バス時刻表などの一括更新

### 6.8 CMS タグ API

### GET `/cms/admin/tags`
### POST `/cms/admin/tags`
### PATCH `/cms/admin/tags/:id`
### DELETE `/cms/admin/tags/:id`

権限:

- `admin`

### 6.9 CMS ユーザー API

### GET `/cms/admin/users`
### POST `/cms/admin/users`
### PATCH `/cms/admin/users/:id`
### DELETE `/cms/admin/users/:id`

権限:

- `admin`

`POST` リクエスト例:

```json
{
  "username": "editor01",
  "displayName": "広報担当",
  "email": "editor@example.com",
  "password": "plain-password",
  "role": "editor",
  "isActive": true
}
```

### 6.10 CMS リアクション集計 API

### GET `/cms/admin/reactions`

権限:

- `admin`

クエリ:

- `targetType`
- `targetId`
- `page`
- `pageSize`

レスポンス:

```json
{
  "data": [
    {
      "targetType": "shop",
      "targetId": 7,
      "reactionType": "heart",
      "count": 42,
      "updatedAt": "2026-11-01T10:20:00.000Z"
    }
  ]
}
```

## 7. バリデーション方針

- Hono + Zod で全エンドポイントの入力を検証する
- `id` は整数
- `code` は英数字、ハイフンのみ
- `status`、`role`、`priority`、`articleType` は enum 検証
- 公開 API に返す `body` は DB 保存前または返却前にサニタイズ
- メディア upload は MIME type、ファイルサイズ、拡張子を検証

## 8. インデックス・運用上の注意

- 記事一覧は `status + publishedAt` の複合インデックスを前提にする
- イベント一覧は `eventDate + venueId + startAt` で引く
- リアクションは `reaction_summaries` を参照し、`reactions` 全件集計を避ける
- 予約投稿は API 起動時のバッチではなく、取得時に `status` と `publishedAt` を評価してもよい
- 論理削除データは通常検索から除外する

## 9. 実装優先順

1. `users` `sessions` など Better Auth 連携
2. `news_articles` `blog_articles` `tags` `news_article_tags` `blog_article_tags` `media_assets`
3. `event_venues` `events` `event_status_overrides`
4. `shops` `shop_menu_items` `map_layers` `map_pins` `map_pin_timetable_groups` `map_pin_timetable_entries`
5. `reactions` `reaction_summaries`

## 10. 現行実装との差分

- 現在の `apps/api/src/db/schema.ts` には `messages` テーブルのみ存在する
- 現在の `apps/api/src/index.ts` には `GET /health` と `GET|POST /messages` のみ存在する
- 本書の内容を実装する場合は、Drizzle schema、migration、Hono route、認証導線、メディア保存処理を段階的に追加する必要がある
