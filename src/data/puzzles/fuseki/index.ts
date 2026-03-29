import type { Puzzle } from '../../../types/puzzle';
import type { BoardState, StoneColor } from '../../../types/game';

function createEmptyBoard(): BoardState {
  return Array(19).fill(null).map(() => Array(19).fill(null)) as BoardState;
}

function placeStones(
  blackPositions: [number, number][],
  whitePositions: [number, number][]
): BoardState {
  const board = createEmptyBoard();
  blackPositions.forEach(([x, y]) => {
    board[y][x] = 'black' as StoneColor;
  });
  whitePositions.forEach(([x, y]) => {
    board[y][x] = 'white' as StoneColor;
  });
  return board;
}

/**
 * Fuseki (Opening) Puzzles
 * 
 * These puzzles focus on opening principles:
 * - Corner enclosure selection
 * - Extension direction
 * - Pincer selection
 * - Influence vs territory trade-offs
 */
export const fusekiPuzzles: Puzzle[] = [
  /**
   * Puzzle 1: Corner Enclosure Choice (Difficulty 2)
   * 
   * Position: Black has played 4-4 in top-right corner.
   * White has played 4-4 in bottom-left corner.
   * 
   * Question: What is the best way for Black to enclose the corner?
   * 
   * Principle: The knight's move enclosure (小飞守角) is the most solid
   * and flexible enclosure, providing both territory and a base for future moves.
   */
  {
    id: 'fuseki-1',
    title: '布局原则 1 - 守角选择',
    type: 'fuseki',
    difficulty: 2,
    boardSize: 19,
    description: '黑先。黑方在右上角有星位一子，请选择最佳的守角方式。',
    initialBoard: placeStones(
      [[15, 3]],  // Black: Q16 (top-right 4-4 point)
      [[3, 15]]   // White: D4 (bottom-left 4-4 point)
    ),
    initialPlayer: 'black',
    solutionTree: {
      move: { x: 16, y: 4 },  // R15 - Knight's move enclosure
      comment: '小飞守角是最坚实的守角方式，既确保角地，又为后续发展留下余地。',
      correct: true,
      nextMoves: [
        {
          move: { x: 15, y: 4 },  // Q15 - One-space jump enclosure
          comment: '一间跳守角也是可行的，但不如小飞守角坚实。',
          correct: true,
        },
        {
          move: { x: 17, y: 3 },  // R16 - Large knight's move
          comment: '大飞守角虽然围地更大，但不够坚实，容易被对方点入。',
          wrong: true,
        }
      ]
    },
    hint: '考虑守角的坚实程度和后续发展潜力。小飞守角是最常用的守角方式。',
    tags: ['fuseki', 'opening', 'corner-enclosure', 'basics'],
  },

  /**
   * Puzzle 2: Extension Direction (Difficulty 3)
   * 
   * Position: Both players have corner enclosures.
   * Black needs to choose the best extension direction.
   * 
   * Question: Which side should Black extend along?
   * 
   * Principle: Extend towards the larger side (大场优先).
   * Also consider the relative positions of opponent's stones.
   */
  {
    id: 'fuseki-2',
    title: '布局原则 2 - 开拆方向',
    type: 'fuseki',
    difficulty: 3,
    boardSize: 19,
    description: '黑先。双方各守一角，黑方应选择哪个方向开拆？',
    initialBoard: placeStones(
      [
        [15, 3], [16, 4],  // Black: Q16 + R15 (top-right corner enclosure)
        [3, 3],             // Black: D16 (top-left 4-4)
      ],
      [
        [3, 15], [4, 16],   // White: D4 + E3 (bottom-left corner enclosure)
        [15, 15],           // White: Q4 (bottom-right 4-4)
      ]
    ),
    initialPlayer: 'black',
    solutionTree: {
      move: { x: 9, y: 3 },  // J16 - Extension along the top side
      comment: '拆边要选择大的一方。上边比下边更宽敞，是优先选择的方向。',
      correct: true,
      nextMoves: [
        {
          move: { x: 3, y: 9 },  // D10 - Extension along the left side
          comment: '左边也是可行的方向，但上边更宽敞，价值更大。',
          correct: true,
        },
        {
          move: { x: 15, y: 9 },  // Q10 - Extension towards opponent
          comment: '向对方势力方向拆边不是最佳选择，应该先占据空旷的大场。',
          wrong: true,
        }
      ]
    },
    hint: '开拆要选择大的一方，优先占据空旷的区域。',
    tags: ['fuseki', 'opening', 'extension', 'direction'],
  },

  /**
   * Puzzle 3: Extension Direction - Complex (Difficulty 3)
   * 
   * Position: More complex position with multiple corners occupied.
   * Black needs to find the best extension considering both sides.
   * 
   * Question: Where should Black extend?
   * 
   * Principle: Consider both the size of the extension and the
   * relationship with existing stones (好点).
   */
  {
    id: 'fuseki-3',
    title: '布局原则 3 - 拆边要点',
    type: 'fuseki',
    difficulty: 3,
    boardSize: 19,
    description: '黑先。局面复杂，黑方应选择哪个拆边要点？',
    initialBoard: placeStones(
      [
        [3, 3], [4, 4],     // Black: D16 + E15 (top-left small enclosure)
        [15, 3],            // Black: Q16 (top-right 4-4)
      ],
      [
        [3, 15],            // White: D4 (bottom-left 4-4)
        [15, 15], [14, 16], // White: Q4 + P3 (bottom-right small enclosure)
      ]
    ),
    initialPlayer: 'black',
    solutionTree: {
      move: { x: 9, y: 3 },  // J16 - Center extension on top
      comment: '星位拆边是布局的好点，既扩张自己又限制对方。',
      correct: true,
      nextMoves: [
        {
          move: { x: 9, y: 15 },  // J4 - Center extension on bottom
          comment: '下边星位也是好点，但上边黑方势力更强，配合更好。',
          correct: true,
        },
        {
          move: { x: 6, y: 3 },  // G16 - Extension between corners
          comment: '虽然也是拆边，但位置不够理想，不如星位拆边价值大。',
          wrong: true,
        }
      ]
    },
    hint: '星位拆边是布局中的重要好点，要优先考虑。',
    tags: ['fuseki', 'opening', 'extension', 'star-point'],
  },

  /**
   * Puzzle 4: Pincer Selection (Difficulty 4)
   * 
   * Position: White has approached Black's corner.
   * Black needs to choose the appropriate pincer.
   * 
   * Question: What is the best pincer for Black?
   * 
   * Principle: Choose pincer based on the overall position.
   * Consider the direction of your other stones and the
   * territory/influence balance.
   */
  {
    id: 'fuseki-4',
    title: '布局原则 4 - 夹击选择',
    type: 'fuseki',
    difficulty: 4,
    boardSize: 19,
    description: '黑先。白方挂角，黑方应如何夹击？',
    initialBoard: placeStones(
      [
        [3, 3],             // Black: D16 (top-left 4-4)
        [15, 3], [16, 4],   // Black: Q16 + R15 (top-right enclosure)
      ],
      [
        [3, 15],            // White: D4 (bottom-left 4-4)
        [5, 5],             // White: F14 (approach to top-left)
      ]
    ),
    initialPlayer: 'black',
    solutionTree: {
      move: { x: 2, y: 5 },  // C14 - One-space low pincer
      comment: '一间低夹是常用的夹击方式，既攻击对方又确保角地。',
      correct: true,
      nextMoves: [
        {
          move: { x: 2, y: 6 },  // C13 - Two-space low pincer
          comment: '二间低夹也是可行的，给对方留有余地，但攻击性稍弱。',
          correct: true,
        },
        {
          move: { x: 5, y: 2 },  // F17 - High pincer
          comment: '高夹虽然可以取势，但让对方容易安定，不是最佳选择。',
          wrong: true,
        }
      ]
    },
    hint: '夹击要考虑全局配置。低夹更注重实地，高夹更注重外势。',
    tags: ['fuseki', 'opening', 'pincer', 'attack'],
  },

  /**
   * Puzzle 5: Influence vs Territory (Difficulty 4)
   * 
   * Position: Black has a choice between a territorial move
   * and an influential move.
   * 
   * Question: Should Black choose territory or influence?
   * 
   * Principle: Balance territory and influence based on the
   * overall position. When ahead in territory, build influence.
   * When behind, secure territory.
   */
  {
    id: 'fuseki-5',
    title: '布局原则 5 - 实地与外势',
    type: 'fuseki',
    difficulty: 4,
    boardSize: 19,
    description: '黑先。黑方可以选择取实地或取外势，应该如何抉择？',
    initialBoard: placeStones(
      [
        [3, 3], [5, 5],     // Black: D16 + F14 (top-left area)
        [15, 3],            // Black: Q16 (top-right 4-4)
      ],
      [
        [3, 15], [4, 14],   // White: D4 + E5 (bottom-left area)
        [15, 15],           // White: Q4 (bottom-right 4-4)
        [5, 3],             // White: F16 (approach to top-right)
      ]
    ),
    initialPlayer: 'black',
    solutionTree: {
      move: { x: 17, y: 4 },  // R15 - Solid extension for territory
      comment: '黑方已有外势潜力，此时应选择取实地，保持平衡。',
      correct: true,
      nextMoves: [
        {
          move: { x: 17, y: 2 },  // R17 - High extension for influence
          comment: '高拆可以取势，但黑方已有外势，此时取地更为平衡。',
          correct: true,
        },
        {
          move: { x: 14, y: 4 },  // O15 - Extension towards center
          comment: '这个方向拆边价值不大，应该优先考虑角部和边上的要点。',
          wrong: true,
        }
      ]
    },
    hint: '实地与外势的选择要根据全局配置来决定。已有外势时，应适当取地保持平衡。',
    tags: ['fuseki', 'opening', 'territory', 'influence', 'balance'],
  },
];

export default fusekiPuzzles;