import type { BoardState, Position, StoneColor, TerritoryCount } from '../types/game';
import { Board } from './board';

export interface TerritoryRegion {
  positions: Position[];
  owner: 'black' | 'white' | null;
}

export interface ScoreResult {
  black: number;
  white: number;
  winner: 'black' | 'white' | null;
  margin: number;
  territory: TerritoryCount;
  captures: TerritoryCount;
  komi: number;
}

export class Territory {
  findTerritory(board: Board): TerritoryRegion[] {
    const size = board.getSize();
    const visited = new Set<string>();
    const regions: TerritoryRegion[] = [];

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const position = { x, y };
        const key = `${x},${y}`;

        if (visited.has(key)) {
          continue;
        }

        if (!board.isEmpty(position)) {
          continue;
        }

        const region = this.findEmptyRegion(board, position, visited);
        const owner = this.determineTerritoryOwner(board, region.positions);
        regions.push({
          positions: region.positions,
          owner,
        });
      }
    }

    return regions;
  }

  private findEmptyRegion(
    board: Board,
    start: Position,
    visited: Set<string>
  ): { positions: Position[] } {
    const positions: Position[] = [];
    const stack: Position[] = [start];

    while (stack.length > 0) {
      const current = stack.pop()!;
      const key = `${current.x},${current.y}`;

      if (visited.has(key)) {
        continue;
      }

      if (!board.isEmpty(current)) {
        continue;
      }

      visited.add(key);
      positions.push(current);

      const neighbors = board.getNeighbors(current);
      for (const neighbor of neighbors) {
        const neighborKey = `${neighbor.x},${neighbor.y}`;
        if (!visited.has(neighborKey) && board.isEmpty(neighbor)) {
          stack.push(neighbor);
        }
      }
    }

    return { positions };
  }

  determineTerritoryOwner(board: Board, region: Position[]): 'black' | 'white' | null {
    const adjacentColors = new Set<StoneColor>();

    for (const position of region) {
      const neighbors = board.getNeighbors(position);
      for (const neighbor of neighbors) {
        const stone = board.getStone(neighbor);
        if (stone !== null) {
          adjacentColors.add(stone);
        }
      }
    }

    if (adjacentColors.size === 0) {
      return null;
    }

    if (adjacentColors.size === 1) {
      const colors = Array.from(adjacentColors);
      return colors[0] as 'black' | 'white';
    }

    return null;
  }

  countTerritory(board: Board): TerritoryCount {
    const regions = this.findTerritory(board);
    const count: TerritoryCount = { black: 0, white: 0 };

    for (const region of regions) {
      if (region.owner === 'black') {
        count.black += region.positions.length;
      } else if (region.owner === 'white') {
        count.white += region.positions.length;
      }
    }

    return count;
  }

  countStones(board: Board): TerritoryCount {
    const count: TerritoryCount = { black: 0, white: 0 };
    const size = board.getSize();

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const stone = board.getStone({ x, y });
        if (stone === 'black') {
          count.black++;
        } else if (stone === 'white') {
          count.white++;
        }
      }
    }

    return count;
  }

  calculateScore(
    boardState: BoardState,
    captures: TerritoryCount,
    komi: number,
    rules: 'chinese' | 'japanese' = 'japanese'
  ): ScoreResult {
    const board = new Board(boardState.length as 9 | 13 | 19);
    board.setState(boardState);

    const territory = this.countTerritory(board);
    const stones = this.countStones(board);

    let blackScore: number;
    let whiteScore: number;

    if (rules === 'chinese') {
      blackScore = territory.black + stones.black;
      whiteScore = territory.white + stones.white + komi;
    } else {
      blackScore = territory.black + captures.black;
      whiteScore = territory.white + captures.white + komi;
    }

    const winner = blackScore > whiteScore ? 'black' : whiteScore > blackScore ? 'white' : null;
    const margin = Math.abs(blackScore - whiteScore);

    return {
      black: blackScore,
      white: whiteScore,
      winner,
      margin,
      territory,
      captures,
      komi,
    };
  }

  getDeadStones(board: Board): { black: Position[]; white: Position[] } {
    const deadStones: { black: Position[]; white: Position[] } = {
      black: [],
      white: [],
    };

    const size = board.getSize();
    const visited = new Set<string>();

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const position = { x, y };
        const key = `${x},${y}`;

        if (visited.has(key)) {
          continue;
        }

        const stone = board.getStone(position);
        if (stone === null) {
          continue;
        }

        const group = this.getGroupWithVisited(board, position, visited);
        const liberties = this.getGroupLiberties(board, group);

        if (liberties.length === 1) {
          const isSurrounded = this.isGroupSurrounded(board, group);
          if (isSurrounded) {
            for (const pos of group) {
              if (stone === 'black') {
                deadStones.black.push(pos);
              } else {
                deadStones.white.push(pos);
              }
            }
          }
        }
      }
    }

    return deadStones;
  }

  private getGroupWithVisited(board: Board, start: Position, visited: Set<string>): Position[] {
    const color = board.getStone(start);
    if (color === null) {
      return [];
    }

    const group: Position[] = [];
    const stack: Position[] = [start];

    while (stack.length > 0) {
      const current = stack.pop()!;
      const key = `${current.x},${current.y}`;

      if (visited.has(key)) {
        continue;
      }

      if (board.getStone(current) !== color) {
        continue;
      }

      visited.add(key);
      group.push(current);

      const neighbors = board.getNeighbors(current);
      for (const neighbor of neighbors) {
        const neighborKey = `${neighbor.x},${neighbor.y}`;
        if (!visited.has(neighborKey)) {
          stack.push(neighbor);
        }
      }
    }

    return group;
  }

  private getGroupLiberties(board: Board, group: Position[]): Position[] {
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

  private isGroupSurrounded(board: Board, group: Position[]): boolean {
    const color = board.getStone(group[0]);
    if (color === null) return false;

    const opponentColor = color === 'black' ? 'white' : 'black';
    const checkedLiberties = new Set<string>();

    for (const stone of group) {
      const neighbors = board.getNeighbors(stone);
      for (const neighbor of neighbors) {
        const key = `${neighbor.x},${neighbor.y}`;
        if (checkedLiberties.has(key)) continue;

        if (board.isEmpty(neighbor)) {
          checkedLiberties.add(key);
          const territoryOwner = this.getPointTerritoryOwner(board, neighbor);
          if (territoryOwner !== opponentColor) {
            return false;
          }
        }
      }
    }

    return true;
  }

  private getPointTerritoryOwner(board: Board, start: Position): 'black' | 'white' | null {
    const visited = new Set<string>();
    const stack: Position[] = [start];
    const adjacentColors = new Set<StoneColor>();

    while (stack.length > 0) {
      const current = stack.pop()!;
      const key = `${current.x},${current.y}`;

      if (visited.has(key)) continue;
      visited.add(key);

      const stone = board.getStone(current);
      if (stone !== null) {
        adjacentColors.add(stone);
        continue;
      }

      const neighbors = board.getNeighbors(current);
      for (const neighbor of neighbors) {
        const neighborKey = `${neighbor.x},${neighbor.y}`;
        if (!visited.has(neighborKey)) {
          stack.push(neighbor);
        }
      }
    }

    if (adjacentColors.size === 1) {
      return Array.from(adjacentColors)[0] as 'black' | 'white';
    }

    return null;
  }
}