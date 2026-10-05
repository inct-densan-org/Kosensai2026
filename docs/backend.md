# 高専祭 Web サイト バックエンド設計書 2026

最終更新: 2026-09-13

## 1. 位置づけ

バックエンドは Payload CMS を中心に構成します。従来の Hono API、Better Auth、Drizzle ORM は現時点では削除し、`apps/api` は Payload の `config` と collection 定義を持つモジュールとして扱います。

公開サイトや管理画面へ組み込む場合は、`@kosensai/api` から Payload config または Local API client を import して利用します。

```ts
import { getPayloadClient, payloadConfig } from '@kosensai/api/index'
```

## 2. 方針

- CMS・認証・DB 管理は Payload に寄せる
- `apps/api` では HTTP サーバーを持たず、Payload runtime に組み込める形を優先する
- Hono 依存の route / repository / schema は廃止する
- 管理者、実行委員、屋台担当の権限は Payload collection の `access` で制御する
- 固定データやファイル管理に寄せる領域は、Payload collection に入れるかを都度判断する

## 3. ディレクトリ

```txt
apps/api
  next.config.ts
  src
    index.ts
    payload.config.ts
    access
      roles.ts
    app
      (payload)
    collections
      Articles.ts
      EventStatusOverrides.ts
      Media.ts
      Shops.ts
      Tags.ts
      Users.ts
```

## 4. 環境変数

```env
DATABASE_URL=file:../db/data/kosensai.sqlite
PAYLOAD_SECRET=replace-with-a-32-character-secret
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:8787
```

## 5. Collections

### `users`

Payload auth を使う CMS ユーザーです。

- `loginId`: 運用上のログインID。一意
- `name`: 表示名
- `role`: `shop_staff` `committee` `admin`
- `shops`: ユーザーが編集できる `shops` 参照。屋台担当は必須運用、実行委員は必要な場合だけ複数指定可能

### `media`

画像などのアップロードファイルを扱います。公開ページから参照されるため read は公開、作成・更新・削除は CMS 権限ユーザーに限定します。

### `tags`

記事タグです。作成・更新は実行委員以上、削除は管理者に限定します。

### `blog-article-types`

ブログ記事の主分類です。管理は管理者のみ行い、ブログ記事ではこの collection から 1 つ選択します。

### `shops`

屋台・企画情報です。`code` と `name` は管理者のみ更新できます。`menu` は画像なしのリッチテキストで、管理者またはその屋台の屋台担当者だけ更新できます。

### `news-articles`

お知らせ記事です。作成・更新は実行委員以上、削除は管理者に限定します。

### `blog-articles`

ブログ記事です。作成・更新は CMS 権限ユーザー、削除は管理者に限定します。

### `shop-announcements`

屋台ごとのお知らせです。屋台担当者と実行委員は自分に紐づく屋台のお知らせだけ作成・更新できます。管理者は全屋台を扱えます。

### `event-status-overrides`

当日変更など、静的イベント情報に対する最新状態の上書きを管理します。

## 6. 組み込み方針

Next.js に組み込む場合は、Payload の route handler 側で `payloadConfig` を利用します。サーバー処理やバッチからは `getPayloadClient()` を使い、Payload Local API 経由で collection を操作します。

Hono ルートは復活させず、独自 API が必要になった場合も Payload Local API を呼ぶ薄い adapter として実装します。

## 7. コマンド

- `pnpm dev:api`: Payload 管理画面を `http://localhost:8787/admin` で起動
- `pnpm payload:types`: Payload 型定義生成
- `pnpm payload:migrate`: Payload migration 実行
