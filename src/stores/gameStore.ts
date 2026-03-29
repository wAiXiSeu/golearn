import { create } from 'zustand'
import type { GameState, GameSettings, Position, BoardState, Move } from '../types/game'
import { createEmptyBoard } from '../lib/utils'
import { DEFAULT_BOARD_SIZE } from '../types/game'
import { Rules } from '../engine/rules'

type GameStore = {
  gameState: GameState
  settings: GameSettings
  lastError: string | null
  
  setBoardSize: (size: 9 | 13 | 19) => void
  setKomi: (komi: number) => void
  setRules: (rules: 'chinese' | 'japanese') => void
  
  playMove: (position: Position) => boolean
  pass: () => void
  undo: () => void
  reset: () => void
  
  loadGame: (state: GameState) => void
  loadFromSGF: (sgf: string) => void
  
  getCurrentBoard: () => BoardState
  getLastMove: () => Move | null
  getLastError: () => string | null
}

const defaultSettings: GameSettings = {
  boardSize: DEFAULT_BOARD_SIZE,
  komi: 7.5,
  rules: 'chinese',
  handicap: 0,
}

const rules = new Rules()

const createDefaultGameState = (settings: GameSettings): GameState => ({
  boardSize: settings.boardSize,
  board: createEmptyBoard(settings.boardSize),
  currentPlayer: 'black',
  moves: [],
  captures: { black: 0, white: 0 },
  koPoint: null,
  passCount: 0,
  isGameOver: false,
})

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: createDefaultGameState(defaultSettings),
  settings: defaultSettings,
  lastError: null,
  
  setBoardSize: (size) => {
    const newSettings = { ...get().settings, boardSize: size }
    set({
      settings: newSettings,
      gameState: createDefaultGameState(newSettings),
      lastError: null,
    })
  },
  
  setKomi: (komi) => {
    set({ settings: { ...get().settings, komi } })
  },
  
  setRules: (rules) => {
    set({ settings: { ...get().settings, rules } })
  },
  
  playMove: (position) => {
    const { gameState } = get()
    
    if (gameState.isGameOver) return false
    
    const result = rules.playMove(
      gameState.board,
      position,
      gameState.currentPlayer,
      gameState.koPoint
    )
    
    if (!result.valid) {
      set({ lastError: result.error || 'Invalid move' })
      return false
    }
    
    const move: Move = {
      position,
      color: gameState.currentPlayer,
      captured: result.captured,
      timestamp: Date.now(),
    }
    
    const newCaptures = { ...gameState.captures }
    if (result.captured.length > 0) {
      if (gameState.currentPlayer === 'black') {
        newCaptures.black += result.captured.length
      } else {
        newCaptures.white += result.captured.length
      }
    }
    
    set({
      gameState: {
        ...gameState,
        board: result.board,
        currentPlayer: gameState.currentPlayer === 'black' ? 'white' : 'black',
        moves: [...gameState.moves, move],
        koPoint: result.koPoint,
        captures: newCaptures,
        passCount: 0,
      },
      lastError: null,
    })
    
    return true
  },
  
  pass: () => {
    const { gameState } = get()
    
    if (gameState.isGameOver) return
    
    const newPassCount = gameState.passCount + 1
    const isGameOver = newPassCount >= 2
    
    set({
      gameState: {
        ...gameState,
        currentPlayer: gameState.currentPlayer === 'black' ? 'white' : 'black',
        passCount: newPassCount,
        isGameOver,
        winner: isGameOver ? null : undefined,
        koPoint: null,
      },
    })
  },
  
  undo: () => {
    const { gameState } = get()
    
    if (gameState.moves.length === 0) return
    
    const lastMove = gameState.moves[gameState.moves.length - 1]
    const newMoves = gameState.moves.slice(0, -1)
    
    const newBoard = gameState.board.map(row => [...row])
    newBoard[lastMove.position.y][lastMove.position.x] = null
    
    for (const captured of lastMove.captured) {
      newBoard[captured.y][captured.x] = lastMove.color === 'black' ? 'white' : 'black'
    }
    
    set({
      gameState: {
        ...gameState,
        board: newBoard,
        currentPlayer: lastMove.color,
        moves: newMoves,
        captures: {
          black: gameState.captures.black - (lastMove.color === 'black' ? lastMove.captured.length : 0),
          white: gameState.captures.white - (lastMove.color === 'white' ? lastMove.captured.length : 0),
        },
        passCount: 0,
        isGameOver: false,
        koPoint: null,
      },
      lastError: null,
    })
  },
  
  reset: () => {
    set({ 
      gameState: createDefaultGameState(get().settings),
      lastError: null,
    })
  },
  
  loadGame: (state) => {
    set({ gameState: state, lastError: null })
  },
  
  loadFromSGF: (_sgf) => {
    set({ gameState: createDefaultGameState(get().settings), lastError: null })
  },
  
  getCurrentBoard: () => get().gameState.board,
  
  getLastMove: () => {
    const moves = get().gameState.moves
    return moves.length > 0 ? moves[moves.length - 1] : null
  },
  
  getLastError: () => get().lastError,
}))