import type { Puzzle } from '../../types/puzzle';
import { capturePuzzles } from './capture';
import { lifeDeathPuzzles } from './life_death';
import { tesujiPuzzles } from './tesuji';
import { josekiPuzzles } from './joseki';
import { fusekiPuzzles } from './fuseki';
import { endgamePuzzles } from './endgame';

export const allPuzzles: Puzzle[] = [
  ...capturePuzzles,
  ...lifeDeathPuzzles,
  ...tesujiPuzzles,
  ...josekiPuzzles,
  ...fusekiPuzzles,
  ...endgamePuzzles,
];

export function getPuzzleById(id: string): Puzzle | undefined {
  return allPuzzles.find(p => p.id === id);
}

export function getPuzzlesByType(type: Puzzle['type']): Puzzle[] {
  return allPuzzles.filter(p => p.type === type);
}

export function getPuzzlesByDifficulty(difficulty: Puzzle['difficulty']): Puzzle[] {
  return allPuzzles.filter(p => p.difficulty === difficulty);
}

export function getPuzzlesByBoardSize(size: Puzzle['boardSize']): Puzzle[] {
  return allPuzzles.filter(p => p.boardSize === size);
}

export function getDailyPuzzle(dayOffset: number = 0): Puzzle {
  const today = new Date();
  const targetDate = new Date(today);
  targetDate.setDate(targetDate.getDate() + dayOffset);
  
  const dayOfYear = Math.floor(
    (targetDate.getTime() - new Date(targetDate.getFullYear(), 0, 0).getTime()) / 86400000
  );
  
  const types: Puzzle['type'][] = ['capture', 'tesuji', 'life_death', 'joseki', 'endgame', 'fuseki'];
  const dayType = types[dayOfYear % types.length];
  
  const typePuzzles = getPuzzlesByType(dayType);
  const puzzleIndex = dayOfYear % typePuzzles.length;
  
  return typePuzzles[puzzleIndex];
}

export function getRecommendedPuzzles(
  solvedIds: string[],
  count: number = 5
): Puzzle[] {
  const unsolved = allPuzzles.filter(p => !solvedIds.includes(p.id));
  
  const byDifficulty = new Map<Puzzle['difficulty'], Puzzle[]>();
  for (const p of unsolved) {
    const list = byDifficulty.get(p.difficulty) || [];
    list.push(p);
    byDifficulty.set(p.difficulty, list);
  }
  
  const result: Puzzle[] = [];
  const difficulties: Puzzle['difficulty'][] = [1, 2, 3, 2, 1, 3, 4, 2, 3, 5];
  
  for (let i = 0; i < count; i++) {
    const diff = difficulties[i % difficulties.length];
    const list = byDifficulty.get(diff);
    if (list && list.length > 0) {
      const puzzle = list.shift()!;
      result.push(puzzle);
    }
  }
  
  return result;
}

export {
  capturePuzzles,
  lifeDeathPuzzles,
  tesujiPuzzles,
  josekiPuzzles,
  fusekiPuzzles,
  endgamePuzzles,
};