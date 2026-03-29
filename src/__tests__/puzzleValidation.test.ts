import { describe, it, expect, beforeEach } from 'vitest';
import {
  validatePuzzleMove,
  calculateCaptures,
  positionToCoordinate,
  coordinateToPosition,
  applyMove,
  cloneBoard,
} from '../lib/puzzleValidation';
import type { Puzzle } from '../types/puzzle';
import type { BoardState } from '../types/game';

function createEmptyBoard(size: number): BoardState {
  return Array(size).fill(null).map(() => Array(size).fill(null));
}

describe('puzzleValidation', () => {
  describe('positionToCoordinate', () => {
    it('converts position to Go coordinate', () => {
      expect(positionToCoordinate({ x: 0, y: 0 })).toBe('A19');
      expect(positionToCoordinate({ x: 8, y: 0 })).toBe('J19');
      expect(positionToCoordinate({ x: 0, y: 8 })).toBe('A11');
      expect(positionToCoordinate({ x: 3, y: 3 })).toBe('D16');
    });
  });

  describe('coordinateToPosition', () => {
    it('converts Go coordinate to position', () => {
      expect(coordinateToPosition('A19', 19)).toEqual({ x: 0, y: 0 });
      expect(coordinateToPosition('J19', 19)).toEqual({ x: 8, y: 0 });
      expect(coordinateToPosition('A11', 19)).toEqual({ x: 0, y: 8 });
      expect(coordinateToPosition('D16', 19)).toEqual({ x: 3, y: 3 });
    });

    it('returns null for invalid coordinates', () => {
      expect(coordinateToPosition('Z1', 19)).toBeNull();
      expect(coordinateToPosition('A20', 19)).toBeNull();
    });
  });

  describe('cloneBoard', () => {
    it('creates a deep copy of the board', () => {
      const board = createEmptyBoard(9);
      board[0][0] = 'black';
      const cloned = cloneBoard(board);
      
      expect(cloned[0][0]).toBe('black');
      cloned[0][0] = 'white';
      expect(board[0][0]).toBe('black');
    });
  });

  describe('calculateCaptures', () => {
    it('detects single stone capture', () => {
      const board = createEmptyBoard(9);
      board[4][4] = 'white';
      board[3][4] = 'black';
      board[5][4] = 'black';
      board[4][3] = 'black';
      board[4][5] = 'black';

      const captures = calculateCaptures(board, { x: 4, y: 5 }, 'black');
      expect(captures).toHaveLength(0);

      const newBoard = cloneBoard(board);
      newBoard[4][5] = 'black';
      const capturesAfterMove = calculateCaptures(newBoard, { x: 4, y: 4 }, 'black');
      expect(capturesAfterMove).toContainEqual({ x: 4, y: 4 });
    });

    it('detects group capture', () => {
      const board = createEmptyBoard(9);
      board[4][4] = 'white';
      board[4][5] = 'white';
      board[3][4] = 'black';
      board[5][4] = 'black';
      board[3][5] = 'black';
      board[5][5] = 'black';
      board[4][3] = 'black';
      board[4][6] = 'black';

      const captures = calculateCaptures(board, { x: 4, y: 6 }, 'black');
      expect(captures.length).toBe(2);
    });
  });

  describe('applyMove', () => {
    it('places stone and returns captured stones', () => {
      const board = createEmptyBoard(9);
      board[4][4] = 'white';
      board[3][4] = 'black';
      board[5][4] = 'black';
      board[4][3] = 'black';

      const { newBoard, captured } = applyMove(board, { x: 4, y: 5 }, 'black');
      
      expect(newBoard[4][5]).toBe('black');
      expect(captured).toContainEqual({ x: 4, y: 4 });
      expect(newBoard[4][4]).toBeNull();
    });
  });

  describe('validatePuzzleMove', () => {
    const simplePuzzle: Puzzle = {
      id: 'test-1',
      title: '测试题',
      type: 'capture',
      difficulty: 1,
      boardSize: 9,
      description: '吃掉白子',
      initialBoard: createEmptyBoard(9),
      initialPlayer: 'black',
      solutionTree: {
        move: { x: 4, y: 5 },
        correct: true,
        comment: '正确！',
      },
    };

    beforeEach(() => {
      simplePuzzle.initialBoard[4][4] = 'white';
      simplePuzzle.initialBoard[3][4] = 'black';
      simplePuzzle.initialBoard[5][4] = 'black';
      simplePuzzle.initialBoard[4][3] = 'black';
    });

    it('validates correct move', () => {
      const result = validatePuzzleMove(
        simplePuzzle,
        simplePuzzle.initialBoard,
        { x: 4, y: 5 },
        simplePuzzle.solutionTree
      );

      expect(result.isValid).toBe(true);
      expect(result.isCorrect).toBe(true);
    });

    it('rejects wrong move', () => {
      const result = validatePuzzleMove(
        simplePuzzle,
        simplePuzzle.initialBoard,
        { x: 0, y: 0 },
        simplePuzzle.solutionTree
      );

      expect(result.isValid).toBe(true);
      expect(result.isCorrect).toBe(false);
    });
  });
});