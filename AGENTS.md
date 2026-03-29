# AGENTS.md - GoLearn Project Guide

## Project Overview

GoLearn is a Go/Weiqi (围棋) learning platform for beginners built with React, TypeScript, and Vite. It features:
- **Learning Module**: Interactive lessons for beginners
- **Practice Module**: 60 puzzles across 6 types (capture, life_death, tesuji, joseki, fuseki, endgame)
- **Play Module**: Local game play with Go rules engine
- **Review Module**: Game replay and analysis

---

## Build/Lint/Test Commands

```bash
# Development server (with hot reload)
npm run dev

# Production build
npm run build

# Lint all files
npm run lint

# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run a single test file
npx vitest run src/__tests__/puzzleValidation.test.ts

# Run tests matching a pattern
npx vitest run -t "positionToCoordinate"

# Preview production build
npm run preview
```

---

## Environment Setup

Copy `.env.example` to `.env` and configure:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/          # Generic components (Button, Card, Modal)
│   └── goban/           # Go board components (Board, Stone, Coordinate)
├── data/
│   └── puzzles/         # Puzzle data files by type
├── engine/              # Core Go game logic
│   ├── board.ts         # Board class
│   ├── rules.ts         # Go rules (capture, ko, suicide)
│   ├── sgf.ts           # SGF parser/generator
│   └── territory.ts     # Territory counting
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and external integrations
│   ├── puzzleValidation.ts
│   ├── supabase.ts
│   └── utils.ts
├── pages/               # Route components
├── stores/              # Zustand state stores
├── types/               # TypeScript type definitions
└── __tests__/           # Test files
```

---

## Code Style Guidelines

### Imports

```typescript
// 1. External libraries first
import { useState, useCallback } from 'react';
import { create } from 'zustand';

// 2. Internal imports (use relative paths with ../)
import type { Position, BoardState } from '../types/game';
import { STAR_POINTS } from '../types/game';

// 3. Use `import type` for type-only imports
import type { Puzzle } from '../types/puzzle';
```

### Naming Conventions

- **Components**: PascalCase (`Board.tsx`, `PuzzleCard.tsx`)
- **Functions**: camelCase (`createEmptyBoard`, `positionToSGF`)
- **Types/Interfaces**: PascalCase (`BoardState`, `PuzzleType`)
- **Constants**: SCREAMING_SNAKE_CASE (`STAR_POINTS`, `DEFAULT_BOARD_SIZE`)
- **Files**: Match primary export (`Board.tsx` exports `Board`)

### TypeScript

```typescript
// Use type for object shapes, interface for extendable types
export type Position = { x: number; y: number };

export interface BoardProps {
  boardSize: number;
  boardState: BoardState;
  onCellClick?: (position: Position) => void;
}

// Union types for finite sets
export type StoneColor = 'black' | 'white' | null;
export type PuzzleType = 'capture' | 'tesuji' | 'life_death' | 'joseki' | 'fuseki' | 'endgame';

// Avoid `any` - use `unknown` when type is truly unknown
// Avoid non-null assertions (!) - handle null explicitly
```

### React Components

```tsx
// Functional components with explicit prop types
interface PuzzleCardProps {
  puzzle: Puzzle;
  onClick: () => void;
}

export function PuzzleCard({ puzzle, onClick }: PuzzleCardProps) {
  // Hooks at the top
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Early returns for edge cases
  if (!puzzle) return null;
  
  return (
    <div className="bg-white rounded-lg" onClick={onClick}>
      {/* Content */}
    </div>
  );
}

// Default exports for route components
export default Practice;
```

### State Management (Zustand)

```typescript
type GameStore = {
  gameState: GameState;
  lastError: string | null;
  playMove: (position: Position) => boolean;
  reset: () => void;
};

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: createDefaultState(),
  lastError: null,
  
  playMove: (position) => {
    const result = rules.playMove(get().gameState.board, position, /*...*/);
    if (!result.valid) {
      set({ lastError: result.error || 'Invalid move' });
      return false;
    }
    set({ gameState: /* updated state */, lastError: null });
    return true;
  },
}));
```

### Error Handling

```typescript
// Throw errors for exceptional cases
if (error) throw error;

// Return null for expected failures
export function sgfToPosition(sgf: string, boardSize: number): Position | null {
  if (sgf.length !== 2) return null;
  // ...
}

// Use optional chaining for nullable values
const stone = board[y]?.[x];
```

### Styling (Tailwind CSS)

```tsx
// Use Tailwind utility classes
<div className="flex flex-col items-center bg-white rounded-lg shadow-md p-4">

// Conditional classes with template literals
<span className={`px-2 py-1 rounded text-xs font-medium ${difficultyColors[difficulty - 1]}`}>

// Inline styles for dynamic values
<div style={{ width: `${gridSize}px`, height: `${gridSize}px` }}>
```

---

## Testing

```typescript
// Test file location: src/__tests__/*.test.ts
// Naming: *.test.ts or *.spec.ts

import { describe, it, expect, beforeEach } from 'vitest';

describe('moduleName', () => {
  describe('functionName', () => {
    it('should do something specific', () => {
      expect(actual).toBe(expected);
    });
    
    it('returns null for invalid input', () => {
      expect(function(invalid)).toBeNull();
    });
  });
});

// Helper functions at top of test file
function createEmptyBoard(size: number): BoardState {
  return Array(size).fill(null).map(() => Array(size).fill(null));
}
```

---

## Go Domain Knowledge

- **Board sizes**: 9x9 (beginners), 13x13 (intermediate), 19x19 (standard)
- **Coordinate system**: x=column (0=left), y=row (0=top)
- **SGF format**: Standard format for game records
- **Star points**: Pre-marked positions on the board

---

## Notes

- Chinese UI text is used throughout (学习, 练习, 对弈, 复盘)
- Puzzles use `MoveNode` tree structure for branching solutions
- The rules engine handles capture, ko, and suicide detection