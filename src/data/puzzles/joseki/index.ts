import type { Puzzle } from '../../../types/puzzle';
import type { BoardState, StoneColor } from '../../../types/game';

// Helper to create empty 19x19 board
function createEmptyBoard(): BoardState {
  return Array(19).fill(null).map(() => Array(19).fill(null));
}

// Helper to place stones on board
function placeStones(positions: Array<{ x: number; y: number; color: StoneColor }>): BoardState {
  const board = createEmptyBoard();
  for (const pos of positions) {
    if (pos.color !== null) {
      board[pos.y][pos.x] = pos.color;
    }
  }
  return board;
}

/**
 * Joseki Puzzles Collection
 * 
 * Difficulty distribution:
 * - Level 2 (初级): 2 puzzles
 * - Level 3 (中级): 4 puzzles
 * - Level 4 (高级): 3 puzzles
 * - Level 5 (专家): 1 puzzle
 * 
 * Pattern categories:
 * - 3-4 point kakari responses: 3 puzzles
 * - Star point (hoshi) joseki: 3 puzzles
 * - 4-4 point knight's approach: 2 puzzles
 * - Chinese opening joseki: 1 puzzle
 * - Joseki mistake punishment: 1 puzzle
 */

export const josekiPuzzles: Puzzle[] = [
  // ============================================
  // STAR POINT JOSEKI (3 puzzles)
  // ============================================
  
  /**
   * Puzzle 1: Star Point - Small Knight's Approach
   * Difficulty: 2 (初级)
   * Pattern: Black at star point, White kakari, Black extends
   */
  {
    id: 'joseki-1',
    title: '星位定式 - 小飞挂应对',
    type: 'joseki',
    difficulty: 2,
    boardSize: 19,
    description: '黑先。白方小飞挂星位，黑方如何应对完成定式？',
    initialBoard: placeStones([
      { x: 3, y: 3, color: 'black' },   // Black star point
      { x: 5, y: 4, color: 'white' },   // White kakari (small knight's approach)
    ]),
    initialPlayer: 'black',
    solutionTree: {
      move: { x: 5, y: 2 },
      comment: '黑方一间跳是标准应对，既加强角部又向中央发展。',
      correct: true,
      nextMoves: [
        {
          move: { x: 2, y: 5 },
          comment: '白方拆边是好点。',
          nextMoves: [
            {
              move: { x: 8, y: 3 },
              comment: '黑方拆边完成定式。',
              correct: true,
            },
          ],
        },
        {
          move: { x: 8, y: 3 },
          comment: '黑方先拆边也是可行的。',
          nextMoves: [
            {
              move: { x: 2, y: 5 },
              comment: '白方拆边，定式完成。',
              correct: true,
            },
          ],
        },
      ],
    },
    hint: '黑方应该向中央发展，同时保持对角部的控制。',
    tags: ['joseki', 'star_point', 'kakari', 'one_space_jump'],
  },

  /**
   * Puzzle 2: Star Point - One-Space Pincer
   * Difficulty: 2 (初级)
   * Pattern: Black at star point, White kakari, Black pincers
   */
  {
    id: 'joseki-2',
    title: '星位定式 - 一间夹',
    type: 'joseki',
    difficulty: 2,
    boardSize: 19,
    description: '黑先。白方挂角，黑方如何用夹击完成定式？',
    initialBoard: placeStones([
      { x: 3, y: 3, color: 'black' },   // Black star point
      { x: 5, y: 4, color: 'white' },   // White kakari
    ]),
    initialPlayer: 'black',
    solutionTree: {
      move: { x: 6, y: 3 },
      comment: '黑方一间夹是积极的下法。',
      correct: true,
      nextMoves: [
        {
          move: { x: 5, y: 6 },
          comment: '白方跳出是常见应对。',
          nextMoves: [
            {
              move: { x: 7, y: 4 },
              comment: '黑方继续追击。',
              nextMoves: [
                {
                  move: { x: 4, y: 5 },
                  comment: '白方安定。',
                  correct: true,
                },
              ],
            },
          ],
        },
        {
          move: { x: 4, y: 5 },
          comment: '白方靠出也是一法。',
          nextMoves: [
            {
              move: { x: 5, y: 5 },
              comment: '黑方扳。',
              nextMoves: [
                {
                  move: { x: 4, y: 4 },
                  comment: '白方退。',
                  nextMoves: [
                    {
                      move: { x: 5, y: 6 },
                      comment: '黑方长，定式完成。',
                      correct: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    hint: '夹击是积极的下法，可以限制白方的发展。',
    tags: ['joseki', 'star_point', 'pincer', 'kakari'],
  },

  /**
   * Puzzle 3: Star Point - Two-Space High Pincer
   * Difficulty: 3 (中级)
   * Pattern: Black at star point, White kakari, Black two-space high pincer
   */
  {
    id: 'joseki-3',
    title: '星位定式 - 二间高夹',
    type: 'joseki',
    difficulty: 3,
    boardSize: 19,
    description: '黑先。白方挂角，黑方如何用二间高夹应对？',
    initialBoard: placeStones([
      { x: 3, y: 3, color: 'black' },   // Black star point
      { x: 5, y: 4, color: 'white' },   // White kakari
    ]),
    initialPlayer: 'black',
    solutionTree: {
      move: { x: 7, y: 2 },
      comment: '黑方二间高夹，既攻击又保持灵活性。',
      correct: true,
      nextMoves: [
        {
          move: { x: 5, y: 6 },
          comment: '白方跳出是最常见的应对。',
          nextMoves: [
            {
              move: { x: 8, y: 3 },
              comment: '黑方拆边，形成理想形状。',
              correct: true,
            },
            {
              move: { x: 4, y: 5 },
              comment: '黑方托角也是有力的一手。',
              nextMoves: [
                {
                  move: { x: 5, y: 5 },
                  comment: '白方扳。',
                  nextMoves: [
                    {
                      move: { x: 4, y: 4 },
                      comment: '黑方退。',
                      nextMoves: [
                        {
                          move: { x: 6, y: 5 },
                          comment: '白方长，定式完成。',
                          correct: true,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          move: { x: 4, y: 5 },
          comment: '白方托角试探黑方应手。',
          nextMoves: [
            {
              move: { x: 5, y: 5 },
              comment: '黑方扳是正着。',
              nextMoves: [
                {
                  move: { x: 4, y: 4 },
                  comment: '白方退。',
                  nextMoves: [
                    {
                      move: { x: 5, y: 6 },
                      comment: '黑方长出。',
                      correct: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    hint: '二间高夹是现代围棋常用的下法，注意后续的变化。',
    tags: ['joseki', 'star_point', 'pincer', 'two_space_high'],
  },

  // ============================================
  // 3-4 POINT KAKARI RESPONSES (3 puzzles)
  // ============================================

  /**
   * Puzzle 4: 3-4 Point - Knight's Move Kakari Response
   * Difficulty: 3 (中级)
   * Pattern: Black at 3-4 point, White kakari, Black responds
   */
  {
    id: 'joseki-4',
    title: '小目定式 - 小飞挂应对',
    type: 'joseki',
    difficulty: 3,
    boardSize: 19,
    description: '黑先。白方小飞挂小目，黑方如何应对？',
    initialBoard: placeStones([
      { x: 3, y: 3, color: 'black' },   // Black 3-4 point (komoku)
      { x: 5, y: 4, color: 'white' },   // White knight's approach
    ]),
    initialPlayer: 'black',
    solutionTree: {
      move: { x: 2, y: 5 },
      comment: '黑方小飞应是最基本的定式。',
      correct: true,
      nextMoves: [
        {
          move: { x: 2, y: 2 },
          comment: '白方飞进角。',
          nextMoves: [
            {
              move: { x: 3, y: 5 },
              comment: '黑方拆边，定式完成。',
              correct: true,
            },
          ],
        },
        {
          move: { x: 3, y: 5 },
          comment: '白方拆边。',
          nextMoves: [
            {
              move: { x: 2, y: 2 },
              comment: '黑方飞进角，定式完成。',
              correct: true,
            },
          ],
        },
      ],
    },
    hint: '小飞应是最稳健的应对，既守角又保持发展。',
    tags: ['joseki', 'komoku', 'kakari', 'knight_move'],
  },

  /**
   * Puzzle 5: 3-4 Point - One-Space Jump Response
   * Difficulty: 3 (中级)
   * Pattern: Black at 3-4 point, White kakari, Black one-space jump
   */
  {
    id: 'joseki-5',
    title: '小目定式 - 一间跳应对',
    type: 'joseki',
    difficulty: 3,
    boardSize: 19,
    description: '黑先。白方挂角，黑方如何用一间跳应对？',
    initialBoard: placeStones([
      { x: 3, y: 3, color: 'black' },   // Black 3-4 point
      { x: 5, y: 4, color: 'white' },   // White kakari
    ]),
    initialPlayer: 'black',
    solutionTree: {
      move: { x: 3, y: 5 },
      comment: '黑方一间跳是坚实的下法。',
      correct: true,
      nextMoves: [
        {
          move: { x: 5, y: 6 },
          comment: '白方拆边。',
          nextMoves: [
            {
              move: { x: 2, y: 2 },
              comment: '黑方守角，定式完成。',
              correct: true,
            },
            {
              move: { x: 7, y: 3 },
              comment: '黑方夹击也是有力的一手。',
              correct: true,
            },
          ],
        },
        {
          move: { x: 2, y: 2 },
          comment: '白方飞进角。',
          nextMoves: [
            {
              move: { x: 5, y: 6 },
              comment: '黑方拆边。',
              nextMoves: [
                {
                  move: { x: 7, y: 3 },
                  comment: '白方拆边，定式完成。',
                  correct: true,
                },
              ],
            },
          ],
        },
      ],
    },
    hint: '一间跳是坚实的下法，注意后续的攻防变化。',
    tags: ['joseki', 'komoku', 'one_space_jump', 'kakari'],
  },

  /**
   * Puzzle 6: 3-4 Point - Pincer Response
   * Difficulty: 3 (中级)
   * Pattern: Black at 3-4 point, White kakari, Black pincers
   */
  {
    id: 'joseki-6',
    title: '小目定式 - 夹击应对',
    type: 'joseki',
    difficulty: 3,
    boardSize: 19,
    description: '黑先。白方挂角，黑方如何用夹击应对？',
    initialBoard: placeStones([
      { x: 3, y: 3, color: 'black' },   // Black 3-4 point
      { x: 5, y: 4, color: 'white' },   // White kakari
    ]),
    initialPlayer: 'black',
    solutionTree: {
      move: { x: 6, y: 3 },
      comment: '黑方一间夹是积极的下法。',
      correct: true,
      nextMoves: [
        {
          move: { x: 5, y: 6 },
          comment: '白方跳出。',
          nextMoves: [
            {
              move: { x: 4, y: 5 },
              comment: '黑方托角。',
              nextMoves: [
                {
                  move: { x: 5, y: 5 },
                  comment: '白方扳。',
                  nextMoves: [
                    {
                      move: { x: 4, y: 4 },
                      comment: '黑方退。',
                      nextMoves: [
                        {
                          move: { x: 6, y: 5 },
                          comment: '白方长，定式完成。',
                          correct: true,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          move: { x: 4, y: 5 },
          comment: '白方托角试探。',
          nextMoves: [
            {
              move: { x: 5, y: 5 },
              comment: '黑方扳是正着。',
              nextMoves: [
                {
                  move: { x: 4, y: 4 },
                  comment: '白方退。',
                  nextMoves: [
                    {
                      move: { x: 5, y: 6 },
                      comment: '黑方长出。',
                      correct: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    hint: '夹击是积极的下法，要注意白方的反击手段。',
    tags: ['joseki', 'komoku', 'pincer', 'kakari'],
  },

  // ============================================
  // 4-4 POINT KNIGHT'S APPROACH (2 puzzles)
  // ============================================

  /**
   * Puzzle 7: 4-4 Point - Knight's Approach Response
   * Difficulty: 4 (高级)
   * Pattern: Black at 4-4 point, White knight's approach, Black responds
   */
  {
    id: 'joseki-7',
    title: '星位定式 - 小飞挂进阶',
    type: 'joseki',
    difficulty: 4,
    boardSize: 19,
    description: '黑先。白方小飞挂星位，黑方如何选择最佳应对？',
    initialBoard: placeStones([
      { x: 3, y: 3, color: 'black' },   // Black 4-4 point (star point)
      { x: 5, y: 4, color: 'white' },   // White knight's approach
      { x: 9, y: 3, color: 'black' },   // Black star point (right side)
    ]),
    initialPlayer: 'black',
    solutionTree: {
      move: { x: 5, y: 2 },
      comment: '黑方一间跳是标准应对，配合右边星位形成理想阵型。',
      correct: true,
      nextMoves: [
        {
          move: { x: 2, y: 5 },
          comment: '白方拆边。',
          nextMoves: [
            {
              move: { x: 7, y: 4 },
              comment: '黑方继续发展。',
              correct: true,
            },
          ],
        },
        {
          move: { x: 7, y: 4 },
          comment: '白方夹击右边。',
          nextMoves: [
            {
              move: { x: 2, y: 5 },
              comment: '黑方拆边，形成两翼张开的好形。',
              correct: true,
            },
          ],
        },
      ],
    },
    hint: '考虑全局配置，选择与右边星位配合的下法。',
    tags: ['joseki', 'star_point', 'knight_approach', 'global_thinking'],
  },

  /**
   * Puzzle 8: 4-4 Point - Press Response
   * Difficulty: 4 (高级)
   * Pattern: Black at 4-4 point, White approaches, Black uses press
   */
  {
    id: 'joseki-8',
    title: '星位定式 - 靠压战术',
    type: 'joseki',
    difficulty: 4,
    boardSize: 19,
    description: '黑先。白方挂角，黑方如何用靠压战术应对？',
    initialBoard: placeStones([
      { x: 3, y: 3, color: 'black' },   // Black star point
      { x: 5, y: 4, color: 'white' },   // White kakari
    ]),
    initialPlayer: 'black',
    solutionTree: {
      move: { x: 4, y: 5 },
      comment: '黑方靠是积极的下法，称为"靠压"。',
      correct: true,
      nextMoves: [
        {
          move: { x: 5, y: 5 },
          comment: '白方扳是正常应对。',
          nextMoves: [
            {
              move: { x: 4, y: 4 },
              comment: '黑方退。',
              nextMoves: [
                {
                  move: { x: 5, y: 6 },
                  comment: '白方长。',
                  nextMoves: [
                    {
                      move: { x: 2, y: 5 },
                      comment: '黑方拆边，定式完成。',
                      correct: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          move: { x: 4, y: 4 },
          comment: '白方退也是一法。',
          nextMoves: [
            {
              move: { x: 5, y: 5 },
              comment: '黑方扳。',
              nextMoves: [
                {
                  move: { x: 5, y: 6 },
                  comment: '白方长。',
                  nextMoves: [
                    {
                      move: { x: 2, y: 5 },
                      comment: '黑方拆边。',
                      correct: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    hint: '靠压是积极的战术，可以借力行棋。',
    tags: ['joseki', 'star_point', 'press', 'kakari'],
  },

  // ============================================
  // CHINESE OPENING JOSEKI (1 puzzle)
  // ============================================

  /**
   * Puzzle 9: Chinese Opening Joseki
   * Difficulty: 4 (高级)
   * Pattern: Black uses Chinese opening style response
   */
  {
    id: 'joseki-9',
    title: '中国流定式',
    type: 'joseki',
    difficulty: 4,
    boardSize: 19,
    description: '黑先。在低中国流布局中，白方挂角，黑方如何应对？',
    initialBoard: placeStones([
      { x: 3, y: 3, color: 'black' },   // Black star point (corner)
      { x: 9, y: 3, color: 'black' },   // Black star point (right side)
      { x: 3, y: 9, color: 'black' },   // Black star point (bottom)
      { x: 5, y: 6, color: 'black' },   // Black Chinese opening point
      { x: 5, y: 4, color: 'white' },   // White kakari
    ]),
    initialPlayer: 'black',
    solutionTree: {
      move: { x: 5, y: 2 },
      comment: '黑方一间跳，配合中国流阵型。',
      correct: true,
      nextMoves: [
        {
          move: { x: 2, y: 5 },
          comment: '白方拆边。',
          nextMoves: [
            {
              move: { x: 7, y: 4 },
              comment: '黑方继续发展，形成理想的中国流阵型。',
              correct: true,
            },
          ],
        },
        {
          move: { x: 7, y: 4 },
          comment: '白方夹击。',
          nextMoves: [
            {
              move: { x: 2, y: 5 },
              comment: '黑方拆边。',
              correct: true,
            },
          ],
        },
      ],
    },
    hint: '中国流布局强调快速展开，注意与中央一子的配合。',
    tags: ['joseki', 'chinese_opening', 'fuseki', 'global_thinking'],
  },

  // ============================================
  // JOSEKI MISTAKE PUNISHMENT (1 puzzle)
  // ============================================

  /**
   * Puzzle 10: Punishing Joseki Mistake
   * Difficulty: 5 (专家)
   * Pattern: White makes a mistake in joseki, Black punishes
   */
  {
    id: 'joseki-10',
    title: '定式错误 - 惩罚不当应对',
    type: 'joseki',
    difficulty: 5,
    boardSize: 19,
    description: '黑先。白方在定式中犯了错误，黑方如何惩罚？',
    initialBoard: placeStones([
      { x: 3, y: 3, color: 'black' },   // Black star point
      { x: 5, y: 4, color: 'white' },   // White kakari
      { x: 5, y: 2, color: 'black' },   // Black one-space jump
      { x: 4, y: 5, color: 'white' },   // White's mistake - should extend on 3rd line
    ]),
    initialPlayer: 'black',
    solutionTree: {
      move: { x: 4, y: 4 },
      comment: '黑方扳头！白方二路爬是错误，黑方可以严厉惩罚。',
      correct: true,
      nextMoves: [
        {
          move: { x: 5, y: 5 },
          comment: '白方扳。',
          nextMoves: [
            {
              move: { x: 3, y: 5 },
          comment: '黑方断！这是严厉的惩罚手段。',
              nextMoves: [
                {
                  move: { x: 3, y: 4 },
                  comment: '白方打吃。',
                  nextMoves: [
                    {
                      move: { x: 4, y: 6 },
                      comment: '黑方长，白方崩溃。',
                      correct: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          move: { x: 3, y: 5 },
          comment: '白方退。',
          nextMoves: [
            {
              move: { x: 5, y: 5 },
              comment: '黑方扳，白方角部受损。',
              correct: true,
            },
          ],
        },
      ],
    },
    hint: '白方二路爬是定式错误，黑方应该抓住机会严厉惩罚。',
    tags: ['joseki', 'punishment', 'mistake', 'advanced'],
  },
];

export default josekiPuzzles;