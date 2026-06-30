# 高専祭2026 ホームページ

このリポジトリは、`apps/web` の Next.js フロントエンドと `apps/api` の Hono API を同じモノレポで管理します。

## 初回セットアップ

前提:

- Node.js 22 系
- `corepack` が使えること

1. 環境変数を用意します。

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/env.example apps/web/.env.local
```

2. 依存をインストールします。

```bash
corepack enable
pnpm install
```

3. 開発サーバーを起動します。

```bash
pnpm dev
```

## Nix / direnv

`Nix` と `direnv` を使う場合は、リポジトリ直下で一度だけ許可してください。

```bash
direnv allow
```

`flake.nix` では Node.js 22 を使い、`corepack` 経由で `pnpm@9.15.4` を有効化します。
`better-sqlite3` のビルドに必要なツールも同時に読み込みます。

```bash
pnpm install
pnpm dev
```

## プロジェクト構成

- `apps/web`: Next.js フロントエンド
- `apps/api`: Hono API サーバー
- `apps/db/data`: SQLite のデータ保存先
- `packages/shared`: API と Web で共有する型・定義
- `packages/config`: 共有 tsconfig
- `docs/backend.md`: バックエンドの詳細

## よく使うコマンド

- `pnpm dev`: Web と API をまとめて起動
- `pnpm dev:web`: Web だけ起動
- `pnpm dev:api`: API だけ起動
- `pnpm build`: 全ワークスペースをビルド
- `pnpm check`: 型チェック
- `pnpm lint`: lint 相当の確認

## 参考

- バックエンドの詳細は [docs/backend.md](docs/backend.md) を参照してください。
