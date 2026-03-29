export type StoneColor = 'black' | 'white' | null;

export type Position = {
  x: number;
  y: number;
};

export type BoardState = StoneColor[][];

export type Move = {
  position: Position;
  color: 'black' | 'white';
  captured: Position[];
  timestamp?: number;
};

export type GameState = {
  boardSize: 9 | 13 | 19;
  board: BoardState;
  currentPlayer: 'black' | 'white';
  moves: Move[];
  captures: {
    black: number;
    white: number;
  };
  koPoint: Position | null;
  passCount: number;
  isGameOver: boolean;
  winner?: 'black' | 'white' | null;
  result?: string;
};

export type GameSettings = {
  boardSize: 9 | 13 | 19;
  komi: number;
  rules: 'chinese' | 'japanese';
  handicap: number;
};

export type TerritoryCount = {
  black: number;
  white: number;
};

export const DEFAULT_BOARD_SIZE = 19;

export const STAR_POINTS: Record<number, Position[]> = {
  19: [
    { x: 3, y: 3 }, { x: 9, y: 3 }, { x: 15, y: 3 },
    { x: 3, y: 9 }, { x: 9, y: 9 }, { x: 15, y: 9 },
    { x: 3, y: 15 }, { x: 9, y: 15 }, { x: 15, y: 15 },
  ],
  13: [
    { x: 3, y: 3 }, { x: 6, y: 3 }, { x: 9, y: 3 },
    { x: 3, y: 6 }, { x: 6, y: 6 }, { x: 9, y: 6 },
    { x: 3, y: 9 }, { x: 6, y: 9 }, { x: 9, y: 9 },
  ],
  9: [
    { x: 2, y: 2 }, { x: 4, y: 2 }, { x: 6, y: 2 },
    { x: 2, y: 4 }, { x: 4, y: 4 }, { x: 6, y: 4 },
    { x: 2, y: 6 }, { x: 4, y: 6 }, { x: 6, y: 6 },
  ],
};