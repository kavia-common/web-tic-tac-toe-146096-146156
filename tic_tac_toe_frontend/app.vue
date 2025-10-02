<template>
  <div :class="['min-h-screen', 'flex', 'flex-col', 'bg-[var(--bg)]', 'text-[var(--text)]']">
    <header class="w-full border-b border-black/5 bg-white/80 backdrop-blur sticky top-0 z-10">
      <div class="max-w-3xl mx-auto px-4 py-5 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--primary)]/90 to-[var(--primary)]/60 shadow-md flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 3h2v18H6zM16 3h2v18h-2zM3 6h18v2H3zM3 16h18v2H3z"/>
            </svg>
          </div>
          <div>
            <h1 class="text-xl font-semibold tracking-tight">Tic Tac Toe</h1>
            <p class="text-xs text-black/60">Ocean Professional • Modern UI</p>
          </div>
        </div>

        <button
          class="px-3 py-2 text-sm rounded-lg border border-black/5 hover:border-black/10 transition-colors"
          @click="toggleTheme"
          aria-label="Toggle theme"
        >
          {{ theme === 'light' ? 'Dark' : 'Light' }} Mode
        </button>
      </div>
    </header>

    <main class="flex-1">
      <div class="max-w-3xl mx-auto px-4">
        <section
          class="mt-10 md:mt-14 p-6 md:p-8 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-black/5 bg-white relative overflow-hidden"
        >
          <div
            class="absolute inset-0 -z-10 pointer-events-none opacity-70"
            aria-hidden="true"
          >
            <div class="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[var(--primary-10)] blur-3xl"></div>
            <div class="absolute -bottom-16 -left-10 w-60 h-60 rounded-full bg-[var(--secondary-12)] blur-3xl"></div>
          </div>

          <div class="flex flex-col items-center">
            <div class="text-center mb-6">
              <p class="text-sm uppercase tracking-wider text-black/60">Current Turn</p>
              <div class="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--surface)] border border-black/5 shadow-sm">
                <span class="font-semibold text-lg tracking-tight" :style="{ color: currentPlayerColor }">
                  {{ currentPlayer }}
                </span>
                <span class="text-black/30">•</span>
                <span class="text-black/60 text-sm">Round {{ round }}</span>
              </div>
            </div>

            <div
              class="grid grid-cols-3 gap-3 md:gap-4 p-3 md:p-4 rounded-2xl bg-[var(--board-bg)] border border-black/5 shadow-inner"
              role="grid"
              aria-label="Tic Tac Toe board"
            >
              <button
                v-for="(cell, index) in board"
                :key="index"
                role="gridcell"
                :aria-label="cell ? 'Cell ' + (index + 1) + ' ' + cell : 'Cell ' + (index + 1) + ' empty'"
                :disabled="!!cell || !!winner"
                @click="handleMove(index)"
                class="w-[22vw] h-[22vw] sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 aspect-square rounded-xl bg-white border border-black/5 shadow hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 disabled:cursor-not-allowed relative overflow-hidden"
              >
                <span
                  v-if="cell === 'X'"
                  class="text-[8vw] sm:text-5xl md:text-6xl font-extrabold text-[var(--primary)] drop-shadow-[0_6px_16px_rgba(37,99,235,0.25)]"
                >
                  X
                </span>
                <span
                  v-else-if="cell === 'O'"
                  class="text-[8vw] sm:text-5xl md:text-6xl font-extrabold text-[var(--secondary)] drop-shadow-[0_6px_16px_rgba(245,158,11,0.25)]"
                >
                  O
                </span>

                <div
                  v-if="winner && winningLine && winningLine.includes(index)"
                  class="absolute inset-0 bg-[var(--primary)]/5"
                />
              </button>
            </div>

            <transition name="fade-up">
              <div
                v-if="winner || isDraw"
                class="mt-6 md:mt-8 w-full"
              >
                <div
                  class="p-4 md:p-5 rounded-xl border border-black/5 bg-[var(--surface)] shadow-sm flex items-center justify-between gap-3"
                  :class="winner ? 'ring-1 ring-[var(--primary)]/20' : ''"
                  role="status"
                >
                  <div class="flex items-center gap-3">
                    <div
                      class="w-9 h-9 rounded-lg flex items-center justify-center"
                      :style="{ background: winner ? 'var(--primary-12)' : 'var(--secondary-12)' }"
                    >
                      <svg v-if="winner" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-[var(--primary)]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.2l-3.5-3.5L4 14.2l5 5 12-12-1.5-1.5z"/>
                      </svg>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-[var(--secondary)]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                      </svg>
                    </div>
                    <p class="font-medium">
                      <template v-if="winner">
                        Winner: <span :style="{ color: currentPlayerColor }">{{ winner }}</span>
                      </template>
                      <template v-else>
                        It's a draw. Try again!
                      </template>
                    </p>
                  </div>

                  <div class="flex items-center gap-2">
                    <button
                      class="px-3 py-2 text-sm rounded-lg border border-black/5 bg-white hover:bg-black/5 transition-colors"
                      @click="undo"
                      :disabled="history.length === 0 || !!winner || isDraw"
                    >
                      Undo
                    </button>
                    <button
                      class="px-3 py-2 text-sm rounded-lg border border-black/5 bg-white hover:bg-black/5 transition-colors"
                      @click="reset"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </transition>

            <div class="mt-6 md:mt-8 w-full grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                class="btn-primary"
                @click="reset"
                aria-label="Reset game"
              >
                <span class="btn-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 6V3L8 7l4 4V8c2.76 0 5 2.24 5 5a5 5 0 11-9.9-1h-2.02A7.002 7.002 0 0019 13c0-3.87-3.13-7-7-7z"/>
                  </svg>
                </span>
                Reset
              </button>

              <button
                class="btn-secondary"
                @click="undo"
                :disabled="history.length === 0 || !!winner || isDraw"
                aria-label="Undo last move"
              >
                <span class="btn-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 5V2L7 7l5 5V9c3.31 0 6 2.69 6 6 0 1.64-.66 3.13-1.73 4.22l1.42 1.42A7.955 7.955 0 0020 15c0-4.42-3.58-8-8-8z"/>
                  </svg>
                </span>
                Undo
              </button>

              <button
                class="btn-ghost"
                @click="swapFirstPlayer"
                :disabled="moves > 0"
                aria-label="Swap first player"
                title="Can only swap before the game starts"
              >
                <span class="btn-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 7h11v2H7v3L3 8l4-4v3zm10 10H6v-2h11v-3l4 4-4 4v-3z"/>
                  </svg>
                </span>
                First Move: {{ firstPlayer }}
              </button>
            </div>

            <div class="mt-6 w-full">
              <div class="p-4 rounded-xl border border-black/5 bg-white shadow-sm">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="font-semibold">Scoreboard</h3>
                  <button class="text-sm text-black/60 hover:text-black/80" @click="resetScores">Reset scores</button>
                </div>
                <div class="grid grid-cols-3 gap-3 text-sm">
                  <div class="score-card">
                    <span class="label">X Wins</span>
                    <span class="value text-[var(--primary)]">{{ scores.X }}</span>
                  </div>
                  <div class="score-card">
                    <span class="label">O Wins</span>
                    <span class="value text-[var(--secondary)]">{{ scores.O }}</span>
                  </div>
                  <div class="score-card">
                    <span class="label">Draws</span>
                    <span class="value">{{ scores.draws }}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        <footer class="py-10 text-center text-sm text-black/50">
          Built with Nuxt 3 • Smooth, modern gameplay experience
        </footer>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// Core reactive state
import { ref, computed, watch } from 'vue'

type Player = 'X' | 'O'
type Cell = Player | null

const board = ref<Cell[]>(Array(9).fill(null))
const currentPlayer = ref<Player>('X')
const firstPlayer = ref<Player>('X')
const winner = ref<Player | null>(null)
const winningLine = ref<number[] | null>(null)
const isDraw = ref<boolean>(false)
const moves = ref<number>(0)
const round = ref<number>(1)
const history = ref<number[]>([]) // stack of move indices for undo
const scores = ref<{ X: number; O: number; draws: number }>({ X: 0, O: 0, draws: 0 })

// Ocean Professional theme support
const theme = ref<'light' | 'dark'>('light')
const primary = '#2563EB'
const secondary = '#F59E0B'

const currentPlayerColor = computed(() => (currentPlayer.value === 'X' ? primary : secondary))

// PUBLIC_INTERFACE
function handleMove(index: number) {
  /** Handles a player move at index; updates board, checks for win/draw, and toggles player. */
  if (board.value[index] || winner.value) return
  board.value[index] = currentPlayer.value
  history.value.push(index)
  moves.value++

  const evaluation = evaluateBoard(board.value)
  if (evaluation.winner) {
    winner.value = evaluation.winner
    winningLine.value = evaluation.line
    incrementScore(evaluation.winner)
    return
  }

  if (moves.value === 9) {
    isDraw.value = true
    scores.value.draws += 1
    return
  }

  togglePlayer()
}

// PUBLIC_INTERFACE
function undo() {
  /** Undo last move if possible and restore game state. */
  if (history.value.length === 0 || winner.value || isDraw.value) return
  const lastIdx = history.value.pop() as number
  board.value[lastIdx] = null
  moves.value--
  togglePlayer()
}

// PUBLIC_INTERFACE
function reset() {
  /** Resets board for a new round, increments round, preserves scores. */
  board.value = Array(9).fill(null)
  history.value = []
  winner.value = null
  winningLine.value = null
  isDraw.value = false
  moves.value = 0
  currentPlayer.value = firstPlayer.value
  round.value++
}

// PUBLIC_INTERFACE
function resetScores() {
  /** Resets the scoreboard to zero. */
  scores.value = { X: 0, O: 0, draws: 0 }
}

// PUBLIC_INTERFACE
function swapFirstPlayer() {
  /** Swaps which player goes first; only allowed before any move in current round. */
  if (moves.value > 0) return
  firstPlayer.value = firstPlayer.value === 'X' ? 'O' : 'X'
  currentPlayer.value = firstPlayer.value
}

// PUBLIC_INTERFACE
function toggleTheme() {
  /** Toggles between light and dark theme modes. */
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

function togglePlayer() {
  currentPlayer.value = currentPlayer.value === 'X' ? 'O' : 'X'
}

function incrementScore(p: Player) {
  scores.value[p] += 1
}

// PUBLIC_INTERFACE
function evaluateBoard(b: Cell[]): { winner: Player | null; line: number[] | null } {
  /** Evaluates the board for a winner; returns winner and winning line if any. */
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (const [a, bIdx, c] of lines) {
    if (b[a] && b[a] === b[bIdx] && b[a] === b[c]) {
      return { winner: b[a], line: [a, bIdx, c] }
    }
  }
  return { winner: null, line: null }
}

// Theming via CSS variables on :root
watch(theme, (val) => {
  const root = document.documentElement
  if (val === 'light') {
    root.style.setProperty('--bg', '#f9fafb')
    root.style.setProperty('--surface', '#ffffff')
    root.style.setProperty('--text', '#111827')
    root.style.setProperty('--primary', primary)
    root.style.setProperty('--secondary', secondary)
    root.style.setProperty('--primary-10', 'rgba(37, 99, 235, 0.10)')
    root.style.setProperty('--secondary-12', 'rgba(245, 158, 11, 0.12)')
    root.style.setProperty('--board-bg', 'linear-gradient(180deg, rgba(37,99,235,0.06), rgba(255,255,255,0.9))')
  } else {
    root.style.setProperty('--bg', '#0b1220')
    root.style.setProperty('--surface', '#0f172a')
    root.style.setProperty('--text', '#e5e7eb')
    root.style.setProperty('--primary', primary)
    root.style.setProperty('--secondary', secondary)
    root.style.setProperty('--primary-10', 'rgba(37, 99, 235, 0.20)')
    root.style.setProperty('--secondary-12', 'rgba(245, 158, 11, 0.20)')
    root.style.setProperty('--board-bg', 'linear-gradient(180deg, rgba(15,23,42,0.9), rgba(2,6,23,0.6))')
  }
}, { immediate: true })
</script>

<style>
:root {
  --bg: #f9fafb;
  --surface: #ffffff;
  --text: #111827;
  --primary: #2563EB;
  --secondary: #F59E0B;
  --primary-10: rgba(37, 99, 235, 0.10);
  --secondary-12: rgba(245, 158, 11, 0.12);
  --board-bg: linear-gradient(180deg, rgba(37,99,235,0.06), rgba(255,255,255,0.9));
}

* {
  box-sizing: border-box;
}

html, body, #__nuxt {
  height: 100%;
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 200ms ease;
}
.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

/* Utility classes (minimal, framework-agnostic) */
.min-h-screen { min-height: 100vh; }
.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.w-full { width: 100%; }
.max-w-3xl { max-width: 48rem; }
.mx-auto { margin-left: auto; margin-right: auto; }
.px-4 { padding-left: 1rem; padding-right: 1rem; }
.py-5 { padding-top: 1.25rem; padding-bottom: 1.25rem; }
.mt-10 { margin-top: 2.5rem; }
.md\:mt-14 { margin-top: 3.5rem; }
.p-6 { padding: 1.5rem; }
.p-4 { padding: 1rem; }
.md\:p-8 { padding: 2rem; }
.rounded-2xl { border-radius: 1rem; }
.rounded-xl { border-radius: 0.75rem; }
.rounded-lg { border-radius: 0.5rem; }
.shadow { box-shadow: 0 10px 25px rgba(0,0,0,0.08); }
.shadow-md { box-shadow: 0 8px 20px rgba(0,0,0,0.12); }
.shadow-sm { box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
.shadow-inner { box-shadow: inset 0 1px 3px rgba(0,0,0,0.06); }
.border { border-width: 1px; }
.border-b { border-bottom-width: 1px; }
.border-black\/5 { border-color: rgba(0,0,0,0.05); }
.bg-white { background-color: #ffffff; }
.bg-white\/80 { background-color: rgba(255,255,255,0.8); }
.bg-black\/5 { background-color: rgba(0,0,0,0.05); }
.bg-\[var\(--surface\)\] { background-color: var(--surface); }
.bg-\[var\(--primary-10\)\] { background-color: var(--primary-10); }
.bg-\[var\(--secondary-12\)\] { background-color: var(--secondary-12); }
.bg-\[var\(--primary\)\]\/5 { background-color: color-mix(in oklab, var(--primary) 5%, transparent); }
.text-\[var\(--text\)\] { color: var(--text); }
.text-black\/60 { color: rgba(0,0,0,0.6); }
.text-black\/50 { color: rgba(0,0,0,0.5); }
.text-black\/30 { color: rgba(0,0,0,0.3); }
.text-white { color: white; }
.text-xl { font-size: 1.25rem; }
.text-lg { font-size: 1.125rem; }
.text-sm { font-size: 0.875rem; }
.font-semibold { font-weight: 600; }
.font-extrabold { font-weight: 800; }
.tracking-tight { letter-spacing: -0.01em; }
.uppercase { text-transform: uppercase; }
.tracking-wider { letter-spacing: 0.08em; }
.sticky { position: sticky; }
.top-0 { top: 0; }
.z-10 { z-index: 10; }
.backdrop-blur { backdrop-filter: blur(8px); }
.grid { display: grid; }
.grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.gap-3 { gap: 0.75rem; }
.gap-2 { gap: 0.5rem; }
.gap-4 { gap: 1rem; }
.mb-6 { margin-bottom: 1.5rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mt-6 { margin-top: 1.5rem; }
.md\:mt-8 { margin-top: 2rem; }
.aspect-square { aspect-ratio: 1 / 1; }
.hover\:bg-black\/5:hover { background-color: rgba(0,0,0,0.05); }
.hover\:border-black\/10:hover { border-color: rgba(0,0,0,0.10); }
.transition-colors { transition: color 200ms ease, background-color 200ms ease, border-color 200ms ease; }
.transition-all { transition: all 220ms ease; }
.focus\:outline-none:focus { outline: 0; }
.focus\:ring-2:focus { box-shadow: 0 0 0 2px color-mix(in oklab, var(--primary) 40%, transparent); }
.ring-1 { box-shadow: 0 0 0 1px color-mix(in oklab, var(--primary) 20%, transparent); }
.ring-\[var\(--primary\)\]\/20 { box-shadow: 0 0 0 1px color-mix(in oklab, var(--primary) 20%, transparent); }
.relative { position: relative; }
.absolute { position: absolute; }
.inset-0 { inset: 0; }
.-top-20 { top: -5rem; }
.-right-20 { right: -5rem; }
.-bottom-16 { bottom: -4rem; }
.-left-10 { left: -2.5rem; }
.pointer-events-none { pointer-events: none; }
.opacity-70 { opacity: .7; }
.inline-flex { display: inline-flex; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.gap-3 { gap: .75rem; }
.gap-2 { gap: .5rem; }
.w-9 { width: 2.25rem; }
.h-9 { height: 2.25rem; }
.rounded-full { border-radius: 9999px; }
.rounded-xl { border-radius: 0.75rem; }
.-z-10 { z-index: -10; }
.md\:gap-4 { gap: 1rem; }
.sm\:w-28 { width: 7rem; }
.sm\:h-28 { height: 7rem; }
.md\:w-32 { width: 8rem; }
.md\:h-32 { height: 8rem; }
.lg\:w-36 { width: 9rem; }
.lg\:h-36 { height: 9rem; }
.text-\[8vw\] { font-size: 8vw; }
.sm\:text-5xl { font-size: 3rem; }
.md\:text-6xl { font-size: 3.75rem; }

/* Buttons */
.btn-primary,
.btn-secondary,
.btn-ghost {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: .5rem;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  font-weight: 600;
  border: 1px solid rgba(0,0,0,0.05);
  box-shadow: 0 6px 16px rgba(0,0,0,0.06);
  transition: transform 160ms ease, box-shadow 160ms ease, background-color 160ms ease, color 160ms ease, border-color 160ms ease;
  cursor: pointer;
  user-select: none;
}

.btn-primary {
  background: linear-gradient(135deg, color-mix(in oklab, var(--primary) 92%, white), color-mix(in oklab, var(--primary) 88%, white));
  color: white;
}
.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(37,99,235,0.25);
}
.btn-secondary {
  background: linear-gradient(135deg, color-mix(in oklab, var(--secondary) 94%, white), color-mix(in oklab, var(--secondary) 88%, white));
  color: #1f2937;
}
.btn-secondary:disabled {
  opacity: .5;
  cursor: not-allowed;
}
.btn-secondary:hover:enabled {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(245,158,11,0.25);
}
.btn-ghost {
  background: white;
  color: #111827;
}
.btn-ghost:hover {
  background: rgba(0,0,0,0.04);
}

.btn-icon {
  width: 1.6rem;
  height: 1.6rem;
  border-radius: .6rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in oklab, var(--surface) 70%, var(--primary));
  color: white;
  box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--primary) 20%, transparent);
}

/* Scoreboard cards */
.score-card {
  display: flex;
  flex-direction: column;
  gap: .25rem;
  padding: .75rem;
  border: 1px solid rgba(0,0,0,0.05);
  border-radius: .75rem;
  background: white;
}
.score-card .label {
  font-size: .75rem;
  color: rgba(0,0,0,0.55);
}
.score-card .value {
  font-weight: 700;
  font-size: 1.125rem;
}
</style>
