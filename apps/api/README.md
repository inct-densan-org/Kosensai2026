# Kosensai Payload Backend

`apps/api` は Payload CMS を動かすための Next.js アプリです。公開サイト本体は `apps/web` に置き、このアプリは CMS Admin、Payload REST API、GraphQL、Local API の実行環境として扱います。

## Setup

```bash
cp .env.example .env
pnpm install
pnpm dev
```

## Environment

```env
DATABASE_URL=file:../db/data/kosensai.sqlite
PAYLOAD_SECRET=YOUR_SECRET_HERE
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:8787
```

SQLite は `apps/db/data/kosensai.sqlite` を Payload 管理の DB として使います。旧スキーマから移行しない場合は、このファイルを削除または退避してから Payload を起動してください。

## Notes

Payload v3 は Admin UI を Next.js アプリとして提供します。そのためバックエンド用の `apps/api` に `src/app/(payload)` が存在しますが、公開サイトの UI とは分離して運用します。
