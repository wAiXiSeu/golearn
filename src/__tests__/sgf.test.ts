import { describe, it, expect } from 'vitest'
import { generateSGF, parseSGF, sgfToGameState, positionToSGF, sgfToPosition } from '../engine/sgf'
import { PASS_POSITION, isPassPosition } from '../types/game'
import type { GameState, Move } from '../types/game'

describe('sgf', () => {
  describe('positionToSGF', () => {
    it('converts position to SGF coordinates', () => {
      expect(positionToSGF({ x: 0, y: 0 }, 19)).toBe('aa')
      expect(positionToSGF({ x: 3, y: 3 }, 19)).toBe('dd')
      expect(positionToSGF({ x: 18, y: 18 }, 19)).toBe('ss')
    })

    it('returns empty string for out of bounds', () => {
      expect(positionToSGF({ x: -1, y: 0 }, 19)).toBe('')
      expect(positionToSGF({ x: 0, y: -1 }, 19)).toBe('')
      expect(positionToSGF({ x: 19, y: 0 }, 19)).toBe('')
    })
  })

  describe('sgfToPosition', () => {
    it('converts SGF coordinates to position', () => {
      expect(sgfToPosition('aa', 19)).toEqual({ x: 0, y: 0 })
      expect(sgfToPosition('dd', 19)).toEqual({ x: 3, y: 3 })
      expect(sgfToPosition('ss', 19)).toEqual({ x: 18, y: 18 })
    })

    it('returns null for invalid input', () => {
      expect(sgfToPosition('', 19)).toBeNull()
      expect(sgfToPosition('a', 19)).toBeNull()
      expect(sgfToPosition('aaa', 19)).toBeNull()
    })
  })

  describe('generateSGF', () => {
    it('generates valid SGF for empty game', () => {
      const gameState: GameState = {
        boardSize: 9,
        board: Array(9).fill(null).map(() => Array(9).fill(null)),
        currentPlayer: 'black',
        moves: [],
        captures: { black: 0, white: 0 },
        koPoint: null,
        passCount: 0,
        isGameOver: false,
      }

      const sgf = generateSGF(gameState, { km: 6.5 })
      expect(sgf).toContain('SZ[9]')
      expect(sgf).toContain('KM[6.5]')
      expect(sgf.startsWith('(')).toBe(true)
      expect(sgf.endsWith(')')).toBe(true)
    })

    it('includes game result when game is over', () => {
      const gameState: GameState = {
        boardSize: 9,
        board: Array(9).fill(null).map(() => Array(9).fill(null)),
        currentPlayer: 'black',
        moves: [],
        captures: { black: 0, white: 0 },
        koPoint: null,
        passCount: 2,
        isGameOver: true,
        result: 'B+2.5',
      }

      const sgf = generateSGF(gameState)
      expect(sgf).toContain('RE[B+2.5]')
    })

    it('handles pass moves correctly', () => {
      const moves: Move[] = [
        { position: { x: 2, y: 2 }, color: 'black', captured: [] },
        { position: PASS_POSITION, color: 'white', captured: [] },
        { position: { x: 3, y: 3 }, color: 'black', captured: [] },
      ]

      const gameState: GameState = {
        boardSize: 9,
        board: Array(9).fill(null).map(() => Array(9).fill(null)),
        currentPlayer: 'white',
        moves,
        captures: { black: 0, white: 0 },
        koPoint: null,
        passCount: 0,
        isGameOver: false,
      }

      const sgf = generateSGF(gameState)
      expect(sgf).toContain('B[cc]')
      expect(sgf).toContain('W[]')
      expect(sgf).toContain('B[dd]')
    })
  })

  describe('parseSGF', () => {
    it('parses basic SGF', () => {
      const sgf = '(;GM[1]FF[4]SZ[9];B[cc];W[cd])'
      const parsed = parseSGF(sgf)

      expect(parsed.game.sz).toBe(9)
      expect(parsed.moves).toHaveLength(2)
      expect(parsed.moves[0].position).toEqual({ x: 2, y: 2 })
      expect(parsed.moves[0].color).toBe('black')
    })

    it('parses metadata correctly', () => {
      const sgf = '(;GM[1]FF[4]SZ[19]PB[Black Player]PW[White Player]KM[7.5]RU[japanese];B[dd])'
      const parsed = parseSGF(sgf)

      expect(parsed.game.sz).toBe(19)
      expect(parsed.game.pb).toBe('Black Player')
      expect(parsed.game.pw).toBe('White Player')
      expect(parsed.game.km).toBe(7.5)
      expect(parsed.game.ru).toBe('japanese')
    })

    it('parses pass moves', () => {
      const sgf = '(;GM[1]FF[4]SZ[9];B[cc];W[];B[dd];W[])'
      const parsed = parseSGF(sgf)

      expect(parsed.moves).toHaveLength(4)
      expect(parsed.moves[1].position).toBe('pass')
      expect(parsed.moves[3].position).toBe('pass')
    })
  })

  describe('sgfToGameState', () => {
    it('converts SGF to game state with correct board size', () => {
      const sgf = '(;GM[1]FF[4]SZ[13];B[dd];W[ee])'
      const parsed = parseSGF(sgf)
      const gameState = sgfToGameState(parsed)

      expect(gameState.boardSize).toBe(13)
      expect(gameState.moves).toHaveLength(2)
    })

    it('preserves pass moves in history', () => {
      const sgf = '(;GM[1]FF[4]SZ[9];B[cc];W[];B[dd];W[])'
      const parsed = parseSGF(sgf)
      const gameState = sgfToGameState(parsed)

      expect(gameState.moves).toHaveLength(4)
      expect(isPassPosition(gameState.moves[1].position)).toBe(true)
      expect(isPassPosition(gameState.moves[3].position)).toBe(true)
    })

    it('detects game over from consecutive passes', () => {
      const sgf = '(;GM[1]FF[4]SZ[9];B[];W[])'
      const parsed = parseSGF(sgf)
      const gameState = sgfToGameState(parsed)

      expect(gameState.isGameOver).toBe(true)
      expect(gameState.passCount).toBe(2)
    })

    it('resets pass count after non-pass move', () => {
      const sgf = '(;GM[1]FF[4]SZ[9];B[];W[cc];B[])'
      const parsed = parseSGF(sgf)
      const gameState = sgfToGameState(parsed)

      expect(gameState.passCount).toBe(1)
      expect(gameState.isGameOver).toBe(false)
    })
  })

  describe('roundtrip', () => {
    it('preserves game state through SGF roundtrip', () => {
      const moves: Move[] = [
        { position: { x: 3, y: 3 }, color: 'black', captured: [] },
        { position: { x: 15, y: 15 }, color: 'white', captured: [] },
        { position: { x: 3, y: 4 }, color: 'black', captured: [] },
      ]

      const originalState: GameState = {
        boardSize: 19,
        board: Array(19).fill(null).map(() => Array(19).fill(null)),
        currentPlayer: 'white',
        moves,
        captures: { black: 0, white: 0 },
        koPoint: null,
        passCount: 0,
        isGameOver: false,
      }

      const sgf = generateSGF(originalState, { pb: 'Player 1', pw: 'Player 2', km: 7.5 })
      const parsed = parseSGF(sgf)
      const restored = sgfToGameState(parsed)

      expect(restored.boardSize).toBe(originalState.boardSize)
      expect(restored.moves).toHaveLength(originalState.moves.length)
      expect(restored.moves[0].position).toEqual(originalState.moves[0].position)
    })

    it('preserves pass moves through roundtrip', () => {
      const moves: Move[] = [
        { position: { x: 2, y: 2 }, color: 'black', captured: [] },
        { position: PASS_POSITION, color: 'white', captured: [] },
        { position: PASS_POSITION, color: 'black', captured: [] },
      ]

      const originalState: GameState = {
        boardSize: 9,
        board: Array(9).fill(null).map(() => Array(9).fill(null)),
        currentPlayer: 'white',
        moves,
        captures: { black: 0, white: 0 },
        koPoint: null,
        passCount: 2,
        isGameOver: true,
      }

      const sgf = generateSGF(originalState)
      const parsed = parseSGF(sgf)
      const restored = sgfToGameState(parsed)

      expect(restored.moves).toHaveLength(3)
      expect(isPassPosition(restored.moves[1].position)).toBe(true)
      expect(isPassPosition(restored.moves[2].position)).toBe(true)
      expect(restored.isGameOver).toBe(true)
    })
  })
})