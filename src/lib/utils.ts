import type { Position, BoardState } from '../types/game'

export function positionToSGF(pos: Position, boardSize: number): string {
  const letters = 'abcdefghijklmnopqrs'
  if (pos.x < 0 || pos.x >= boardSize || pos.y < 0 || pos.y >= boardSize) {
    return ''
  }
  return letters[pos.x] + letters[pos.y]
}

export function sgfToPosition(sgf: string, boardSize: number): Position | null {
  if (sgf.length !== 2) return null
  const letters = 'abcdefghijklmnopqrs'
  const x = letters.indexOf(sgf[0])
  const y = letters.indexOf(sgf[1])
  if (x < 0 || x >= boardSize || y < 0 || y >= boardSize) {
    return null
  }
  return { x, y }
}

export function createEmptyBoard(size: number): BoardState {
  return Array(size).fill(null).map(() => Array(size).fill(null))
}

export function cloneBoard(board: BoardState): BoardState {
  return board.map(row => [...row])
}

export function getNeighbors(pos: Position, boardSize: number): Position[] {
  const neighbors: Position[] = []
  const deltas = [[-1, 0], [1, 0], [0, -1], [0, 1]]
  
  for (const [dx, dy] of deltas) {
    const x = pos.x + dx
    const y = pos.y + dy
    if (x >= 0 && x < boardSize && y >= 0 && y < boardSize) {
      neighbors.push({ x, y })
    }
  }
  
  return neighbors
}

export function formatCoordinates(pos: Position, boardSize: number): string {
  const letters = 'ABCDEFGHJKLMNOPQRST'
  const column = letters[pos.x]
  const row = boardSize - pos.y
  return `${column}${row}`
}

export function oppositeColor(color: 'black' | 'white'): 'black' | 'white' {
  return color === 'black' ? 'white' : 'black'
}

export function boardEquals(a: BoardState, b: BoardState): boolean {
  if (a.length !== b.length) return false
  for (let y = 0; y < a.length; y++) {
    for (let x = 0; x < a[y].length; x++) {
      if (a[y][x] !== b[y][x]) return false
    }
  }
  return true
}

export function countStones(board: BoardState): { black: number; white: number } {
  let black = 0
  let white = 0
  
  for (const row of board) {
    for (const stone of row) {
      if (stone === 'black') black++
      if (stone === 'white') white++
    }
  }
  
  return { black, white }
}