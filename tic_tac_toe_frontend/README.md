# Tic Tac Toe • Nuxt 3 (Ocean Professional)

A modern, responsive Tic Tac Toe game built with Nuxt 3. Features a centered board, minimal UI, smooth transitions, and an Ocean Professional theme (blue primary, amber secondary).

## Features
- Classic 3x3 Tic Tac Toe gameplay
- Scoreboard (X wins, O wins, draws)
- Undo last move
- Reset board and swap who starts (before game begins)
- Light/Dark theme toggle
- Accessible controls and ARIA roles
- Responsive layout with smooth transitions

## Getting Started

Install dependencies:
```bash
# npm
npm install
# pnpm
pnpm install
# yarn
yarn install
# bun
bun install
```

Run in development:
```bash
npm run dev
```
Open http://localhost:3000

Build for production:
```bash
npm run build
npm run preview
```

## Tech Stack
- Nuxt 3 + Vue 3
- TypeScript in Single File Components
- CSS variables for theming (no external CSS frameworks)

## Project Structure
- `app.vue`: Entire UI and game logic implemented here for simplicity.
- `nuxt.config.ts`: App metadata and dev server configuration.

## Accessibility
- Board uses grid and gridcell roles
- Buttons include aria-labels and keyboard focus states

Enjoy the game!
