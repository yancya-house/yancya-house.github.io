# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

やんちゃハウス (Yancya House) — RubyKaigi 参加者向けのシェアハウス企画サイト。静的HTMLサイト + Firebase Cloud Functions のバックエンド構成。

- **ホスティング**: Netlify (カスタムドメイン: yancya.house)
- **バックエンド**: Firebase Cloud Functions (Firestore)
- **CI**: GitHub Actions (CodeQL)

## Architecture

- `index.html` / `all.css` — メインページとスタイル
- `2017/` ~ `2026/` — 年度別イベントページ（各 `index.html`）
- `functions/functions/` — Firebase Cloud Functions（TypeScript）
  - `src/index.ts` — アクセスカウンター API（Firestore + セッションCookie）

## Commands (Firebase Functions)

```bash
cd functions/functions

npm run build     # TypeScript コンパイル
npm run lint      # TSLint
npm run serve     # ローカルサーブ
npm run deploy    # Firebase デプロイ
```

## Conventions

- コミットメッセージは Ruby 風の式で書く（例: `yancya.house[2026].members++`）
- フロントエンドはフレームワーク不使用の素の HTML/CSS/JS
- 2026 イベントページでは Ruby WASM (CDN) を利用
