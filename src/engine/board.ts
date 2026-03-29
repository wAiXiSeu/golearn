import type { BoardState, Position, StoneColor } from '../types/game';

export class Board {
  private state: BoardState;
  private size: number;

  constructor(size: 9 | 13 | 19 = 19) {
    this.size = size;
    this.state = this.initializeBoard(size);
  }

  initializeBoard(size: number): BoardState {
    const board: BoardState = [];
    for (let y = 0; y < size; y++) {
      board[y] = [];
      for (let x = 0; x < size; x++) {
        board[y][x] = null;
      }
    }
    return board;
  }

  getStone(position: Position): StoneColor {
    if (!this.isValidPosition(position)) {
      return null;
    }
    return this.state[position.y][position.x];
  }

  setStone(position: Position, color: StoneColor): void {
    if (!this.isValidPosition(position)) {
      throw new Error(`Invalid position: (${position.x}, ${position.y})`);
    }
    this.state[position.y][position.x] = color;
  }

  isValidPosition(position: Position): boolean {
    return (
      position.x >= 0 &&
      position.x < this.size &&
      position.y >= 0 &&
      position.y < this.size
    );
  }

  getState(): BoardState {
    return this.state;
  }

  setState(state: BoardState): void {
    this.state = state;
  }

  getSize(): number {
    return this.size;
  }

  clone(): Board {
    const newBoard = new Board(this.size as 9 | 13 | 19);
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        newBoard.state[y][x] = this.state[y][x];
      }
    }
    return newBoard;
  }

  getNeighbors(position: Position): Position[] {
    const neighbors: Position[] = [];
    const directions = [
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
      { x: 1, y: 0 },
    ];

    for (const dir of directions) {
      const neighbor = { x: position.x + dir.x, y: position.y + dir.y };
      if (this.isValidPosition(neighbor)) {
        neighbors.push(neighbor);
      }
    }

    return neighbors;
  }

  isEmpty(position: Position): boolean {
    return this.getStone(position) === null;
  }

  clear(): void {
    this.state = this.initializeBoard(this.size);
  }
}