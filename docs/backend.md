# バックエンド詳細

`apps/api` は Hono + Drizzle + SQLite で構成された API サーバーです。

## 起動の流れ

- `apps/api/src/index.ts` で `drizzle-orm/better-sqlite3/migrator` を呼び、起動時に migration を適用します。
- その後 `createApp()` で Hono アプリを作成し、`@hono/node-server` で起動します。
- `apps/api/src/env.ts` で環境変数を読み取り、未設定時はデフォルト値を使います。

## 環境変数

- `DATABASE_PATH`: SQLite ファイルの相対パス
  - デフォルトは `../db/data/kosensai.sqlite`
- `PORT`: API の待受ポート
  - デフォルトは `8787`
- `CORS_ORIGIN`: CORS 許可元
  - デフォルトは `http://localhost:3000`

## ルーティング

- `GET /health`
  - `apps/api/src/routes/system.ts`
  - 稼働確認用のヘルスチェック
- `GET /messages`
  - `apps/api/src/routes/messages.ts`
  - 登録済みメッセージを一覧取得
- `POST /messages`
  - `apps/api/src/routes/messages.ts`
  - `body` を受け取り、新しいメッセージを保存

## データアクセス

- `apps/api/src/db/client.ts` で `better-sqlite3` と Drizzle のクライアントを生成します。
- `apps/api/src/db/path.ts` で API ルートから SQLite ファイルと migration ディレクトリのパスを解決します。
- `apps/api/src/db/schema.ts` では `messages` テーブルを定義しています。

## メッセージ保存

- `apps/api/src/repositories/system.ts` がメッセージの読み書きを担当します。
- `listMessages()` は `id` の降順で取得します。
- `createMessage()` は `createdAt` を `ISOString` で付与して保存します。
- 入力バリデーションは `apps/api/src/schemas/system.ts` の `messageInputSchema` で行います。

## 開発コマンド

- `pnpm --filter @kosensai/api dev`
- `pnpm --filter @kosensai/api build`
- `pnpm --filter @kosensai/api check`
- `pnpm --filter @kosensai/api db:generate`
- `pnpm --filter @kosensai/api db:migrate`

