import type { BoardState, Position, StoneColor } from '../types/game';
import type { Puzzle, MoveNode } from '../types/puzzle';

export type ValidationResult = {
  isValid: boolean;
  isCorrect: boolean | null;
  isWrong?: boolean;
  message?: string;
  nextNode?: MoveNode;
  capturedStones?: Position[];
};

function isValidPosition(board: BoardState, pos: Position): boolean {
  return pos.x >= 0 && pos.x < board.length && pos.y >= 0 && pos.y < board.length;
}

function getNeighbors(pos: Position, size: number): Position[] {
  const neighbors: Position[] = [];
  const offsets = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  for (const [dx, dy] of offsets) {
    const nx = pos.x + dx;
    const ny = pos.y + dy;
    if (nx >= 0 && nx < size && ny >= 0 && ny < size) {
      neighbors.push({ x: nx, y: ny });
    }
  }
  return neighbors;
}

function getGroup(board: BoardState, pos: Position): Position[] {
  const color = board[pos.y]?.[pos.x];
  if (!color) return [];
  
  const group: Position[] = [];
  const visited = new Set<string>();
  const stack: Position[] = [pos];
  
  while (stack.length > 0) {
    const current = stack.pop()!;
    const key = `${current.x},${current.y}`;
    
    if (visited.has(key)) continue;
    visited.add(key);
    
    if (board[current.y]?.[current.x] === color) {
      group.push(current);
      const neighbors = getNeighbors(current, board.length);
      for (const neighbor of neighbors) {
        const neighborKey = `${neighbor.x},${neighbor.y}`;
        if (!visited.has(neighborKey) && board[neighbor.y]?.[neighbor.x] === color) {
          stack.push(neighbor);
        }
      }
    }
  }
  
  return group;
}

function getLiberties(board: BoardState, group: Position[]): Position[] {
  const liberties: Position[] = [];
  const libertySet = new Set<string>();
  
  for (const stone of group) {
    const neighbors = getNeighbors(stone, board.length);
    for (const neighbor of neighbors) {
      const key = `${neighbor.x},${neighbor.y}`;
      if (!libertySet.has(key) && board[neighbor.y]?.[neighbor.x] === null) {
        libertySet.add(key);
        liberties.push(neighbor);
      }
    }
  }
  
  return liberties;
}

export function isValidMove(board: BoardState, pos: Position, _player: StoneColor): boolean {
  if (!isValidPosition(board, pos)) return false;
  if (board[pos.y]?.[pos.x] !== null) return false;
  return true;
}

export function validatePuzzleMove(
  puzzle: Puzzle,
  currentBoard: BoardState,
  move: Position,
  currentNode: MoveNode
): ValidationResult {
  const player = puzzle.initialPlayer;
  
  if (!isValidMove(currentBoard, move, player)) {
    return {
      isValid: false,
      isCorrect: null,
      message: '此处不能落子',
    };
  }

  if (currentNode.move === 'pass') {
    return {
      isValid: true,
      isCorrect: null,
      message: '请选择落子位置',
    };
  }

  const expectedMove = currentNode.move;
  const isExpectedMove = expectedMove.x === move.x && expectedMove.y === move.y;

  if (isExpectedMove) {
    const capturedStones = calculateCaptures(currentBoard, move, player);
    return {
      isValid: true,
      isCorrect: currentNode.correct === true,
      message: currentNode.comment || (currentNode.correct ? '正确！' : '继续...'),
      nextNode: currentNode.nextMoves?.[0],
      capturedStones,
    };
  }

  for (const branch of currentNode.nextMoves || []) {
    if (branch.move !== 'pass' && branch.move.x === move.x && branch.move.y === move.y) {
      const capturedStones = calculateCaptures(currentBoard, move, player);
      return {
        isValid: true,
        isCorrect: branch.correct === true,
        isWrong: branch.wrong === true,
        message: branch.comment || (branch.wrong ? '这不是最佳着法' : '继续...'),
        nextNode: branch.nextMoves?.[0],
        capturedStones,
      };
    }
  }

  return {
    isValid: true,
    isCorrect: false,
    isWrong: true,
    message: '这不是正确的着法',
  };
}

export function calculateCaptures(
  board: BoardState,
  move: Position,
  player: StoneColor
): Position[] {
  const opponent: StoneColor = player === 'black' ? 'white' : 'black';
  const captured: Position[] = [];
  
  const neighbors = getNeighbors(move, board.length);

  for (const neighbor of neighbors) {
    if (board[neighbor.y]?.[neighbor.x] === opponent) {
      const group = getGroup(board, neighbor);
      const liberties = getLiberties(board, group);
      if (liberties.length === 0) {
        captured.push(...group);
      }
    }
  }

  return captured;
}

export function findMoveInTree(
  node: MoveNode,
  move: Position
): MoveNode | null {
  if (node.move !== 'pass') {
    if (node.move.x === move.x && node.move.y === move.y) {
      return node;
    }
  }

  for (const branch of node.nextMoves || []) {
    const found = findMoveInTree(branch, move);
    if (found) return found;
  }

  return null;
}

export function isPuzzleComplete(node: MoveNode | undefined): boolean {
  if (!node) return true;
  if (node.correct === true && (!node.nextMoves || node.nextMoves.length === 0)) {
    return true;
  }
  return false;
}

export function getHintForNode(node: MoveNode): string | undefined {
  if (node.move !== 'pass') {
    const coord = positionToCoordinate(node.move);
    return `提示：考虑 ${coord} 位置`;
  }
  return undefined;
}

export function positionToCoordinate(pos: Position): string {
  const cols = 'ABCDEFGHJKLMNOPQRST';
  const col = cols[pos.x];
  const row = 19 - pos.y;
  return `${col}${row}`;
}

export function coordinateToPosition(coord: string, boardSize: number): Position | null {
  const match = coord.match(/^([A-HJ-NP-T])(\d+)$/i);
  if (!match) return null;

  const col = match[1].toUpperCase();
  const row = parseInt(match[2], 10);

  const cols = 'ABCDEFGHJKLMNOPQRST';
  const x = cols.indexOf(col);
  const y = boardSize - row;

  if (x < 0 || x >= boardSize || y < 0 || y >= boardSize) {
    return null;
  }

  return { x, y };
}

export function cloneBoard(board: BoardState): BoardState {
  return board.map(row => [...row]);
}

export function applyMove(
  board: BoardState,
  move: Position,
  player: StoneColor
): { newBoard: BoardState; captured: Position[] } {
  const newBoard = cloneBoard(board);
  newBoard[move.y][move.x] = player;
  
  const captured = calculateCaptures(newBoard, move, player);
  
  for (const stone of captured) {
    newBoard[stone.y][stone.x] = null;
  }

  return { newBoard, captured };
}