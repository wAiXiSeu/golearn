import type { Puzzle } from '../../../types/puzzle';
import type { BoardState, StoneColor } from '../../../types/game';

/**
 * Endgame Puzzles Collection
 * 
 * Distribution:
 * - Board sizes: 1 puzzle (9x9), 2 puzzles (13x13)
 * - Difficulty: 1x level-2, 1x level-3, 1x level-4
 * 
 * Endgame Concepts:
 * - Gote vs Sente (1 puzzle) - Understanding initiative in endgame
 * - Double Sente (1 puzzle) - Most valuable endgame moves
 * - Counting Territory (1 puzzle) - Calculating exact point values
 */

// Helper to create empty board
function createEmptyBoard(size: 9 | 13): BoardState {
  return Array(size).fill(null).map(() => Array(size).fill(null));
}

// Helper to place stones on board
function placeStones(
  size: 9 | 13,
  blackStones: [number, number][],
  whiteStones: [number, number][]
): BoardState {
  const board = createEmptyBoard(size);
  blackStones.forEach(([x, y]) => { board[y][x] = 'black' as StoneColor; });
  whiteStones.forEach(([x, y]) => { board[y][x] = 'white' as StoneColor; });
  return board;
}

export const endgamePuzzles: Puzzle[] = [
  // ============================================
  // PUZZLE 1: Gote vs Sente (9x9, Level 2)
  // ============================================
  /**
   * Gote vs Sente Endgame
   * 
   * Position: Near-endgame with mostly settled territories.
   * Black has two options: a gote move worth 3 points, or a sente move worth 2 points.
   * The sente move is better because after white responds, black can play elsewhere.
   * 
   * Board layout (9x9):
   * - Black territory in upper-left corner (mostly settled)
   * - White territory in lower-right corner (mostly settled)
   * - Boundary moves remaining along the diagonal
   * 
   * Key concept: Sente moves are more valuable than their point count suggests
   * because they maintain initiative.
   */
  {
    id: 'endgame-1',
    title: '官子练习 1 - 先手与后手',
    type: 'endgame',
    difficulty: 2,
    boardSize: 9,
    description: '黑先。选择正确的官子：先手官子还是后手官子？',
    initialBoard: placeStones(9,
      // Black stones - upper left territory
      [
        [0, 0], [1, 0], [2, 0], [3, 0],
        [0, 1], [1, 1], [2, 1],
        [0, 2], [1, 2],
        [0, 3], [1, 3],
        [0, 4], [1, 4], [2, 4],
        [2, 5], [3, 5],
        [3, 6], [4, 6]
      ],
      // White stones - lower right territory
      [
        [5, 0], [6, 0], [7, 0], [8, 0],
        [6, 1], [7, 1], [8, 1],
        [7, 2], [8, 2],
        [7, 3], [8, 3],
        [6, 4], [7, 4], [8, 4],
        [5, 5], [6, 5],
        [4, 7], [5, 7],
        [4, 8], [5, 8], [6, 8], [7, 8], [8, 8]
      ]
    ),
    initialPlayer: 'black',
    solutionTree: {
      move: { x: 4, y: 5 },
      comment: '正确！这是先手官子。黑方在4-5位推进，白方必须应答，否则黑方可以继续扩大。先手官子比后手官子更有价值，因为黑方可以保持主动权，之后再去收其他官子。价值约2目，但因为是先手，实际价值更高。',
      correct: true,
      nextMoves: [
        {
          move: { x: 5, y: 6 },
          comment: '白方必须应答，防止黑方继续推进。',
          nextMoves: [
            {
              move: { x: 3, y: 4 },
              comment: '黑方现在可以收其他官子。先手官子的价值在于保持主动权。',
              correct: true
            }
          ]
        },
        {
          move: { x: 3, y: 4 },
          comment: '白方不应答，黑方可以继续扩大。',
          wrong: true,
          nextMoves: []
        }
      ]
    },
    hint: '先手官子比后手官子更有价值。计算时要考虑主动权的价值。',
    tags: ['endgame', 'sente', 'gote', 'counting', 'beginner'],
    marks: [
      { position: { x: 4, y: 5 }, type: 'circle', label: '先手' },
      { position: { x: 3, y: 4 }, type: 'square', label: '后手' }
    ]
  },

  // ============================================
  // PUZZLE 2: Double Sente (13x13, Level 3)
  // ============================================
  /**
   * Double Sente Endgame
   * 
   * Position: Near-endgame with a critical double sente point.
   * A double sente move is sente for both sides - whoever plays it first
   * gains the benefit AND maintains initiative.
   * 
   * Board layout (13x13):
   * - Black territory on left side
   * - White territory on right side
   * - Central boundary with a double sente point
   * 
   * Key concept: Double sente moves are the most valuable in endgame.
   * They should be played immediately when discovered.
   */
  {
    id: 'endgame-2',
    title: '官子练习 2 - 双先官子',
    type: 'endgame',
    difficulty: 3,
    boardSize: 13,
    description: '黑先。找到双先官子点，这是最有价值的官子。',
    initialBoard: placeStones(13,
      // Black stones - left side territory
      [
        [0, 0], [1, 0], [2, 0], [3, 0], [4, 0],
        [0, 1], [1, 1], [2, 1], [3, 1],
        [0, 2], [1, 2], [2, 2],
        [0, 3], [1, 3],
        [0, 4], [1, 4], [2, 4],
        [2, 5], [3, 5],
        [3, 6], [4, 6],
        [4, 7], [5, 7],
        [5, 8], [6, 8],
        [0, 5], [0, 6], [0, 7], [0, 8], [0, 9], [0, 10], [0, 11], [0, 12],
        [1, 5], [1, 6], [1, 7], [1, 8], [1, 9], [1, 10], [1, 11], [1, 12]
      ],
      // White stones - right side territory
      [
        [8, 0], [9, 0], [10, 0], [11, 0], [12, 0],
        [9, 1], [10, 1], [11, 1], [12, 1],
        [10, 2], [11, 2], [12, 2],
        [11, 3], [12, 3],
        [10, 4], [11, 4], [12, 4],
        [9, 5], [10, 5],
        [8, 6], [9, 6],
        [7, 7], [8, 7],
        [6, 9], [7, 9],
        [12, 5], [12, 6], [12, 7], [12, 8], [12, 9], [12, 10], [12, 11], [12, 12],
        [11, 5], [11, 6], [11, 7], [11, 8], [11, 9], [11, 10], [11, 11], [11, 12]
      ]
    ),
    initialPlayer: 'black',
    solutionTree: {
      move: { x: 6, y: 7 },
      comment: '正确！这是双先官子点。黑方在6-7位推进，对双方都是先手。如果白方不应，黑方可以继续扩大；如果黑方不先占，白方也会来占。双先官子是最有价值的，必须优先抢占。价值约4目，且双方都必须应答。',
      correct: true,
      nextMoves: [
        {
          move: { x: 7, y: 8 },
          comment: '白方必须应答，否则黑方继续推进会损失更多。',
          nextMoves: [
            {
              move: { x: 5, y: 6 },
              comment: '黑方保持先手，继续收其他官子。',
              correct: true
            }
          ]
        },
        {
          move: 'pass',
          comment: '白方不应答是错误的，黑方可以继续扩大。',
          wrong: true,
          nextMoves: [
            {
              move: { x: 7, y: 8 },
              comment: '黑方继续推进，白方损失更大。',
              correct: true
            }
          ]
        }
      ]
    },
    hint: '双先官子是最有价值的官子类型。找到对双方都是先手的点。',
    tags: ['endgame', 'double-sente', 'counting', 'intermediate'],
    marks: [
      { position: { x: 6, y: 7 }, type: 'triangle', label: '双先' }
    ]
  },

  // ============================================
  // PUZZLE 3: Counting Territory (13x13, Level 4)
  // ============================================
  /**
   * Counting Territory Endgame
   * 
   * Position: Complex near-endgame with multiple boundary moves.
   * Player must calculate exact point values and choose the largest move.
   * 
   * Board layout (13x13):
   * - Multiple settled territories with boundary issues
   * - Several gote and sente moves available
   * - Need to count and compare values
   * 
   * Key concept: In endgame, precise counting is essential.
   * Calculate the swing value (difference between playing and not playing).
   */
  {
    id: 'endgame-3',
    title: '官子练习 3 - 目数计算',
    type: 'endgame',
    difficulty: 4,
    boardSize: 13,
    description: '黑先。计算各官子的目数价值，选择最大的官子。',
    initialBoard: placeStones(13,
      // Black stones - multiple territories
      [
        // Upper left corner
        [0, 0], [1, 0], [2, 0],
        [0, 1], [1, 1],
        [0, 2],
        // Left side
        [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8], [0, 9], [0, 10], [0, 11], [0, 12],
        [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7], [1, 8], [1, 9], [1, 10], [1, 11], [1, 12],
        // Lower left area
        [2, 10], [2, 11], [2, 12],
        [3, 10], [3, 11], [3, 12],
        // Central black group
        [4, 4], [5, 4], [6, 4],
        [4, 5], [6, 5],
        [4, 6], [5, 6], [6, 6]
      ],
      // White stones - multiple territories
      [
        // Upper right corner
        [10, 0], [11, 0], [12, 0],
        [11, 1], [12, 1],
        [12, 2],
        // Right side
        [12, 3], [12, 4], [12, 5], [12, 6], [12, 7], [12, 8], [12, 9], [12, 10], [12, 11], [12, 12],
        [11, 2], [11, 3], [11, 4], [11, 5], [11, 6], [11, 7], [11, 8], [11, 9], [11, 10], [11, 11], [11, 12],
        // Lower right area
        [10, 10], [10, 11], [10, 12],
        [9, 10], [9, 11], [9, 12],
        // Central white group
        [7, 4], [8, 4], [9, 4],
        [7, 5], [9, 5],
        [7, 6], [8, 6], [9, 6]
      ]
    ),
    initialPlayer: 'black',
    solutionTree: {
      move: { x: 2, y: 3 },
      comment: '正确！这是最大的官子。计算方法：黑方在此处推进可以增加2目，同时阻止白方在此处获得1目，总价值为3目（swing value = 2+1=3目）。其他官子如中央边界只有约2目价值。在官子阶段，要精确计算每个官子的目数价值，优先选择最大的。',
      correct: true,
      nextMoves: [
        {
          move: { x: 3, y: 4 },
          comment: '白方应答，防止黑方继续扩大。',
          nextMoves: [
            {
              move: { x: 10, y: 3 },
              comment: '黑方继续收其他大官子。白方右上角边界也有约2目价值。',
              correct: true
            }
          ]
        },
        {
          move: { x: 6, y: 3 },
          comment: '白方不应答，黑方可以继续扩大左上角。',
          wrong: true,
          nextMoves: []
        }
      ]
    },
    hint: '官子的目数价值 = (己方增加的目数 + 阻止对方获得的目数) / 2（后手）或直接相加（先手）。精确计算每个官子的价值。',
    tags: ['endgame', 'counting', 'territory', 'calculation', 'advanced'],
    marks: [
      { position: { x: 2, y: 3 }, type: 'circle', label: '3目' },
      { position: { x: 10, y: 3 }, type: 'square', label: '2目' },
      { position: { x: 6, y: 3 }, type: 'triangle', label: '2目' }
    ]
  }
];

export default endgamePuzzles;