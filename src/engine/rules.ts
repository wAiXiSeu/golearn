import type { BoardState, Position, Move } from '../types/game';
import { Board } from './board';

export type Group = Position[];

export interface MoveResult {
  valid: boolean;
  board: BoardState;
  captured: Position[];
  koPoint: Position | null;
  error?: string;
}

export class Rules {
  getGroup(board: Board, position: Position): Group {
    const color = board.getStone(position);
    if (color === null) {
      return [];
    }

    const group: Group = [];
    const visited = new Set<string>();
    const stack: Position[] = [position];

    while (stack.length > 0) {
      const current = stack.pop()!;
      const key = `${current.x},${current.y}`;

      if (visited.has(key)) {
        continue;
      }

      visited.add(key);

      if (board.getStone(current) === color) {
        group.push(current);
        const neighbors = board.getNeighbors(current);
        for (const neighbor of neighbors) {
          const neighborKey = `${neighbor.x},${neighbor.y}`;
          if (!visited.has(neighborKey) && board.getStone(neighbor) === color) {
            stack.push(neighbor);
          }
        }
      }
    }

    return group;
  }

  getLiberties(board: Board, group: Group): Position[] {
    const liberties: Position[] = [];
    const libertySet = new Set<string>();

    for (const stone of group) {
      const neighbors = board.getNeighbors(stone);
      for (const neighbor of neighbors) {
        const key = `${neighbor.x},${neighbor.y}`;
        if (!libertySet.has(key) && board.isEmpty(neighbor)) {
          libertySet.add(key);
          liberties.push(neighbor);
        }
      }
    }

    return liberties;
  }

  isCaptured(board: Board, group: Group): boolean {
    return this.getLiberties(board, group).length === 0;
  }

  captureGroup(board: Board, group: Group): Position[] {
    const captured: Position[] = [];
    for (const stone of group) {
      board.setStone(stone, null);
      captured.push(stone);
    }
    return captured;
  }

  private getOpponentColor(color: 'black' | 'white'): 'black' | 'white' {
    return color === 'black' ? 'white' : 'black';
  }

  private positionEquals(a: Position | null, b: Position | null): boolean {
    if (a === null || b === null) {
      return a === b;
    }
    return a.x === b.x && a.y === b.y;
  }

  isValidMove(
    board: Board,
    position: Position,
    color: 'black' | 'white',
    koPoint: Position | null = null
  ): { valid: boolean; error?: string } {
    if (!board.isValidPosition(position)) {
      return { valid: false, error: 'Position is out of bounds' };
    }

    if (!board.isEmpty(position)) {
      return { valid: false, error: 'Position is already occupied' };
    }

    if (this.positionEquals(position, koPoint)) {
      return { valid: false, error: 'Ko rule violation: cannot recapture immediately' };
    }

    const testBoard = board.clone();
    testBoard.setStone(position, color);

    const opponentColor = this.getOpponentColor(color);
    const neighbors = testBoard.getNeighbors(position);
    let capturesOpponent = false;

    for (const neighbor of neighbors) {
      const neighborStone = testBoard.getStone(neighbor);
      if (neighborStone === opponentColor) {
        const opponentGroup = this.getGroup(testBoard, neighbor);
        if (this.isCaptured(testBoard, opponentGroup)) {
          capturesOpponent = true;
          for (const stone of opponentGroup) {
            testBoard.setStone(stone, null);
          }
        }
      }
    }

    const ownGroup = this.getGroup(testBoard, position);
    if (this.isCaptured(testBoard, ownGroup) && !capturesOpponent) {
      return { valid: false, error: 'Suicide is not allowed' };
    }

    return { valid: true };
  }

  playMove(
    boardState: BoardState,
    position: Position,
    color: 'black' | 'white',
    koPoint: Position | null = null
  ): MoveResult {
    const board = new Board(boardState.length as 9 | 13 | 19);
    board.setState(boardState.map(row => [...row]));

    const validation = this.isValidMove(board, position, color, koPoint);
    if (!validation.valid) {
      return {
        valid: false,
        board: boardState,
        captured: [],
        koPoint,
        error: validation.error,
      };
    }

    board.setStone(position, color);

    const opponentColor = this.getOpponentColor(color);
    const neighbors = board.getNeighbors(position);
    const allCaptured: Position[] = [];

    for (const neighbor of neighbors) {
      const neighborStone = board.getStone(neighbor);
      if (neighborStone === opponentColor) {
        const opponentGroup = this.getGroup(board, neighbor);
        if (this.isCaptured(board, opponentGroup)) {
          const captured = this.captureGroup(board, opponentGroup);
          allCaptured.push(...captured);
        }
      }
    }

    let newKoPoint: Position | null = null;
    if (allCaptured.length === 1) {
      const ownGroup = this.getGroup(board, position);
      if (ownGroup.length === 1) {
        const liberties = this.getLiberties(board, ownGroup);
        if (liberties.length === 1 && this.positionEquals(liberties[0], allCaptured[0])) {
          newKoPoint = allCaptured[0];
        }
      }
    }

    return {
      valid: true,
      board: board.getState(),
      captured: allCaptured,
      koPoint: newKoPoint,
    };
  }

  getLegalMoves(
    board: Board,
    color: 'black' | 'white',
    koPoint: Position | null = null
  ): Position[] {
    const legalMoves: Position[] = [];
    const size = board.getSize();

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const position = { x, y };
        if (this.isValidMove(board, position, color, koPoint).valid) {
          legalMoves.push(position);
        }
      }
    }

    return legalMoves;
  }

  hasLegalMoves(board: Board, color: 'black' | 'white', koPoint: Position | null = null): boolean {
    const size = board.getSize();

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const position = { x, y };
        if (this.isValidMove(board, position, color, koPoint).valid) {
          return true;
        }
      }
    }

    return false;
  }

  createMove(position: Position, color: 'black' | 'white', captured: Position[]): Move {
    return {
      position,
      color,
      captured,
      timestamp: Date.now(),
    };
  }
}