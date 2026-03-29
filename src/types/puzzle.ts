import type { Position, BoardState } from './game';

export type PuzzleType = 
  | 'life_death' 
  | 'tesuji' 
  | 'joseki' 
  | 'fuseki' 
  | 'best_move' 
  | 'endgame' 
  | 'elementary'
  | 'capture' 
  | 'escape';

export type PuzzleDifficulty = 1 | 2 | 3 | 4 | 5;

export type DifficultyLabel = {
  1: '入门';
  2: '初级';
  3: '中级';
  4: '高级';
  5: '专家';
};

export type PuzzleTypeLabel = {
  life_death: '死活';
  tesuji: '手筋';
  joseki: '定式';
  fuseki: '布局';
  best_move: '最佳着手';
  endgame: '官子';
  elementary: '基础';
  capture: '吃子';
  escape: '逃跑';
};

export type MoveNode = {
  move: Position | 'pass';
  comment?: string;
  correct?: boolean;
  wrong?: boolean;
  nextMoves?: MoveNode[];
};

export type PuzzleMark = {
  position: Position;
  type: 'circle' | 'square' | 'triangle' | 'cross' | 'label';
  label?: string;
};

export type Puzzle = {
  id: string;
  title: string;
  type: PuzzleType;
  difficulty: PuzzleDifficulty;
  boardSize: 9 | 13 | 19;
  description?: string;
  initialBoard: BoardState;
  initialPlayer: 'black' | 'white';
  solutionTree: MoveNode;
  hint?: string;
  source?: string;
  tags?: string[];
  marks?: PuzzleMark[];
  collectionId?: string;
  rank?: number;
};

export type PuzzleAttempt = {
  puzzleId: string;
  userId?: string;
  correct: boolean;
  attempts: number;
  timeSpent: number;
  userMoves: Position[];
  completedAt: Date;
};

export type PuzzleCollection = {
  id: string;
  name: string;
  description?: string;
  puzzles: string[];
  difficultyRange: [PuzzleDifficulty, PuzzleDifficulty];
  type?: PuzzleType;
  puzzleCount?: number;
};

export type SGFMove = string;

export type SGFGameState = {
  black: string;
  white: string;
};

export function encodeSGFMoves(positions: Position[], _boardSize: number): string {
  const cols = 'abcdefghijklmnopqrs';
  return positions.map(p => cols[p.x] + cols[p.y]).join('');
}

export function decodeSGFMoves(sgf: string, boardSize: number): Position[] {
  const positions: Position[] = [];
  const maxCoord = sgf.length;
  for (let i = 0; i < maxCoord; i += 2) {
    const x = sgf.charCodeAt(i) - 97;
    const y = sgf.charCodeAt(i + 1) - 97;
    if (x >= 0 && x < boardSize && y >= 0 && y < boardSize) {
      positions.push({ x, y });
    }
  }
  return positions;
}

export const PUZZLE_TYPE_LABELS: Record<PuzzleType, string> = {
  life_death: '死活',
  tesuji: '手筋',
  joseki: '定式',
  fuseki: '布局',
  best_move: '最佳着手',
  endgame: '官子',
  elementary: '基础',
  capture: '吃子',
  escape: '逃跑',
};

export const DIFFICULTY_LABELS: Record<PuzzleDifficulty, string> = {
  1: '入门',
  2: '初级',
  3: '中级',
  4: '高级',
  5: '专家',
};