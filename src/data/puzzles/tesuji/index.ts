import type { Puzzle } from '../../../types/puzzle';
import type { BoardState, StoneColor } from '../../../types/game';

function createEmptyBoard(size: 9 | 13): BoardState {
  return Array(size).fill(null).map(() => Array(size).fill(null));
}

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

export const tesujiPuzzles: Puzzle[] = [
  // ============================================================
  // THROW-IN TESUJI (2 puzzles)
  // ============================================================
  
  /**
   * Throw-in Tesuji #1 - 9x9
   * Classic throw-in to reduce liberties and create atari
   * Black sacrifices a stone to put white in atari
   */
  {
    id: 'tesuji-throw-in-001',
    title: '投石问路',
    type: 'tesuji',
    difficulty: 2,
    boardSize: 9,
    description: '黑方如何利用弃子战术，使白棋陷入困境？',
    initialBoard: placeStones(9,
      // Black stones
      [[2, 3], [3, 3], [4, 3], [3, 2], [4, 2], [5, 2], [2, 4]],
      // White stones
      [[3, 4], [4, 4], [5, 4], [5, 3], [6, 3], [4, 5], [5, 5]]
    ),
    initialPlayer: 'black',
    solutionTree: {
      move: { x: 3, y: 5 },
      comment: '投石！黑方在3-5位投入一子，白方若提吃，黑方可继续追击。',
      correct: true,
      nextMoves: [
        {
          move: { x: 4, y: 5 },
          comment: '白方提吃黑子',
          nextMoves: [
            {
              move: { x: 3, y: 5 },
              comment: '黑方再次投入，形成连续打吃！',
              correct: true
            }
          ]
        },
        {
          move: { x: 6, y: 4 },
          comment: '白方逃跑',
          nextMoves: [
            {
              move: { x: 4, y: 5 },
              comment: '黑方提吃白子，成功！',
              correct: true
            }
          ]
        }
      ]
    },
    hint: '思考如何通过牺牲一颗棋子来获得更大的利益。',
    tags: ['throw-in', 'sacrifice', 'atari', 'liberties'],
    marks: [
      { position: { x: 3, y: 5 }, type: 'circle' }
    ]
  },

  /**
   * Throw-in Tesuji #2 - 9x9
   * Throw-in to create a false eye
   */
  {
    id: 'tesuji-throw-in-002',
    title: '破眼投石',
    type: 'tesuji',
    difficulty: 3,
    boardSize: 9,
    description: '黑方如何利用投石破坏白棋的眼位？',
    initialBoard: placeStones(9,
      // Black stones
      [[1, 1], [2, 1], [3, 1], [1, 2], [3, 2], [1, 3], [2, 3], [4, 3], [2, 4], [3, 4]],
      // White stones
      [[2, 2], [4, 2], [4, 1], [5, 1], [5, 2], [5, 3], [4, 4], [5, 4]]
    ),
    initialPlayer: 'black',
    solutionTree: {
      move: { x: 3, y: 3 },
      comment: '投石破眼！黑方在3-3位投入，破坏白棋做眼的空间。',
      correct: true,
      nextMoves: [
        {
          move: { x: 3, y: 3 },
          comment: '白方提吃',
          nextMoves: [
            {
              move: { x: 2, y: 3 },
              comment: '黑方打吃，白棋无法做活！',
              correct: true
            }
          ]
        }
      ]
    },
    hint: '投石后白方若提吃，黑方可以继续追击。',
    tags: ['throw-in', 'false-eye', 'life-death'],
    marks: [
      { position: { x: 3, y: 3 }, type: 'circle' }
    ]
  },

  // ============================================================
  // CRANE'S NEST TESUJI (1 puzzle)
  // ============================================================
  
  /**
   * Crane's Nest - 9x9
   * Classic shape tesuji resembling a crane's nest
   */
  {
    id: 'tesuji-crane-nest-001',
    title: '鹤巢',
    type: 'tesuji',
    difficulty: 4,
    boardSize: 9,
    description: '黑方如何利用"鹤巢"手筋吃掉白棋？',
    initialBoard: placeStones(9,
      // Black stones - surrounding formation
      [[2, 2], [3, 2], [4, 2], [5, 2], [2, 3], [5, 3], [2, 4], [3, 5], [4, 5], [5, 4], [5, 5]],
      // White stones - the "nest"
      [[3, 3], [4, 3], [3, 4], [4, 4]]
    ),
    initialPlayer: 'black',
    solutionTree: {
      move: { x: 4, y: 4 },
      comment: '鹤巢手筋！黑方在4-4位点入，形成经典的鹤巢形状。',
      correct: true,
      nextMoves: [
        {
          move: { x: 5, y: 4 },
          comment: '白方抵抗',
          nextMoves: [
            {
              move: { x: 3, y: 4 },
              comment: '黑方继续，白棋被吃！',
              correct: true
            }
          ]
        },
        {
          move: { x: 3, y: 4 },
          comment: '白方另一边抵抗',
          nextMoves: [
            {
              move: { x: 5, y: 4 },
              comment: '黑方从另一边打吃，成功！',
              correct: true
            }
          ]
        }
      ]
    },
    hint: '鹤巢是一种特殊的吃子形状，需要找到关键的点入位置。',
    tags: ['crane-nest', 'shape', 'capture', 'classic'],
    marks: [
      { position: { x: 4, y: 4 }, type: 'triangle' }
    ]
  },

  // ============================================================
  // EYE-STEALING TESUJI (2 puzzles)
  // ============================================================
  
  /**
   * Eye-stealing Tesuji #1 - 9x9
   * Stealing the eye by placing inside
   */
  {
    id: 'tesuji-eye-steal-001',
    title: '夺眼',
    type: 'tesuji',
    difficulty: 3,
    boardSize: 9,
    description: '黑方如何夺走白棋的眼位，使其无法做活？',
    initialBoard: placeStones(9,
      // Black stones
      [[1, 1], [2, 1], [3, 1], [4, 1], [1, 2], [4, 2], [1, 3], [2, 4], [3, 4], [4, 3]],
      // White stones
      [[2, 2], [3, 2], [2, 3], [3, 3]]
    ),
    initialPlayer: 'black',
    solutionTree: {
      move: { x: 2, y: 3 },
      comment: '夺眼手筋！黑方点入白棋眼位，使其无法做出两眼。',
      correct: true,
      nextMoves: [
        {
          move: { x: 3, y: 3 },
          comment: '白方抵抗',
          nextMoves: [
            {
              move: { x: 2, y: 2 },
              comment: '黑方打吃，白棋死！',
              correct: true
            }
          ]
        }
      ]
    },
    hint: '找到白棋眼位的关键点，一击致命。',
    tags: ['eye-stealing', 'life-death', 'invasion'],
    marks: [
      { position: { x: 2, y: 3 }, type: 'circle' }
    ]
  },

  /**
   * Eye-stealing Tesuji #2 - 13x13
   * More complex eye-stealing in corner
   */
  {
    id: 'tesuji-eye-steal-002',
    title: '角部夺眼',
    type: 'tesuji',
    difficulty: 4,
    boardSize: 13,
    description: '黑方如何在角部夺走白棋的眼位？',
    initialBoard: placeStones(13,
      // Black stones
      [[0, 0], [1, 0], [2, 0], [0, 1], [3, 1], [0, 2], [1, 3], [2, 3], [3, 2]],
      // White stones
      [[1, 1], [2, 1], [1, 2], [2, 2]]
    ),
    initialPlayer: 'black',
    solutionTree: {
      move: { x: 1, y: 2 },
      comment: '角部夺眼！黑方点入白棋眼位的关键点。',
      correct: true,
      nextMoves: [
        {
          move: { x: 2, y: 2 },
          comment: '白方抵抗',
          nextMoves: [
            {
              move: { x: 1, y: 1 },
              comment: '黑方打吃，白棋无法做活！',
              correct: true
            }
          ]
        }
      ]
    },
    hint: '角部的眼位更加脆弱，找到关键点。',
    tags: ['eye-stealing', 'corner', 'life-death'],
    marks: [
      { position: { x: 1, y: 2 }, type: 'circle' }
    ]
  },

  // ============================================================
  // CUT TESUJI (2 puzzles)
  // ============================================================
  
  /**
   * Cut Tesuji #1 - 9x9
   * Cutting through to separate groups
   */
  {
    id: 'tesuji-cut-001',
    title: '切断',
    type: 'tesuji',
    difficulty: 3,
    boardSize: 9,
    description: '黑方如何切断白棋，将其分成两块？',
    initialBoard: placeStones(9,
      // Black stones
      [[2, 2], [3, 2], [4, 2], [5, 2], [2, 3], [5, 3], [2, 4], [3, 5], [4, 5], [5, 4]],
      // White stones
      [[3, 3], [4, 3], [3, 4], [4, 4]]
    ),
    initialPlayer: 'black',
    solutionTree: {
      move: { x: 4, y: 4 },
      comment: '切断手筋！黑方切断白棋，将其分成两块无法联系的棋。',
      correct: true,
      nextMoves: [
        {
          move: { x: 5, y: 4 },
          comment: '白方逃跑',
          nextMoves: [
            {
              move: { x: 3, y: 4 },
              comment: '黑方打吃，成功切断！',
              correct: true
            }
          ]
        },
        {
          move: { x: 3, y: 4 },
          comment: '白方另一边逃跑',
          nextMoves: [
            {
              move: { x: 5, y: 4 },
              comment: '黑方打吃另一边，成功切断！',
              correct: true
            }
          ]
        }
      ]
    },
    hint: '找到白棋两块棋之间的薄弱环节。',
    tags: ['cut', 'separation', 'tactics'],
    marks: [
      { position: { x: 4, y: 4 }, type: 'cross' }
    ]
  },

  /**
   * Cut Tesuji #2 - 13x13
   * More complex cutting tesuji
   */
  {
    id: 'tesuji-cut-002',
    title: '中盘切断',
    type: 'tesuji',
    difficulty: 4,
    boardSize: 13,
    description: '黑方如何在中盘切断白棋的联络？',
    initialBoard: placeStones(13,
      // Black stones
      [[4, 4], [5, 4], [6, 4], [7, 4], [4, 5], [7, 5], [4, 6], [5, 7], [6, 7], [7, 6]],
      // White stones
      [[5, 5], [6, 5], [5, 6], [6, 6]]
    ),
    initialPlayer: 'black',
    solutionTree: {
      move: { x: 6, y: 6 },
      comment: '中盘切断！黑方找到白棋联络的关键点。',
      correct: true,
      nextMoves: [
        {
          move: { x: 7, y: 6 },
          comment: '白方抵抗',
          nextMoves: [
            {
              move: { x: 5, y: 6 },
              comment: '黑方打吃，成功切断白棋！',
              correct: true
            }
          ]
        }
      ]
    },
    hint: '观察白棋两块棋之间的连接点。',
    tags: ['cut', 'middle-game', 'separation'],
    marks: [
      { position: { x: 6, y: 6 }, type: 'cross' }
    ]
  },

  // ============================================================
  // CONNECT UNDER TESUJI (2 puzzles)
  // ============================================================
  
  /**
   * Connect Under #1 - 9x9
   * Connecting underneath opponent's stones
   */
  {
    id: 'tesuji-connect-001',
    title: '渡过',
    type: 'tesuji',
    difficulty: 3,
    boardSize: 9,
    description: '黑方如何从白棋下方渡过，连接两块棋？',
    initialBoard: placeStones(9,
      // Black stones
      [[1, 1], [2, 1], [1, 2], [6, 1], [7, 1], [7, 2]],
      // White stones
      [[3, 1], [4, 1], [5, 1], [3, 2], [4, 2], [5, 2], [4, 3], [5, 3]]
    ),
    initialPlayer: 'black',
    solutionTree: {
      move: { x: 4, y: 3 },
      comment: '渡过手筋！黑方从白棋下方渡过，成功连接。',
      correct: true,
      nextMoves: [
        {
          move: { x: 5, y: 3 },
          comment: '白方阻挡',
          nextMoves: [
            {
              move: { x: 3, y: 3 },
              comment: '黑方继续渡过，成功连接！',
              correct: true
            }
          ]
        }
      ]
    },
    hint: '有时候需要从对手的棋下方寻找连接的路径。',
    tags: ['connect', 'under', 'sabaki'],
    marks: [
      { position: { x: 4, y: 3 }, type: 'circle' }
    ]
  },

  /**
   * Connect Under #2 - 13x13
   * More complex connection tesuji
   */
  {
    id: 'tesuji-connect-002',
    title: '边部渡过',
    type: 'tesuji',
    difficulty: 4,
    boardSize: 13,
    description: '黑方如何在边部渡过白棋的封锁？',
    initialBoard: placeStones(13,
      // Black stones
      [[0, 0], [1, 0], [0, 1], [8, 0], [9, 0], [9, 1]],
      // White stones
      [[2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1], [4, 2], [5, 2]]
    ),
    initialPlayer: 'black',
    solutionTree: {
      move: { x: 4, y: 2 },
      comment: '边部渡过！黑方找到白棋封锁的薄弱点。',
      correct: true,
      nextMoves: [
        {
          move: { x: 5, y: 2 },
          comment: '白方阻挡',
          nextMoves: [
            {
              move: { x: 3, y: 2 },
              comment: '黑方成功渡过！',
              correct: true
            }
          ]
        }
      ]
    },
    hint: '边部的封锁往往有渡过的机会。',
    tags: ['connect', 'edge', 'sabaki'],
    marks: [
      { position: { x: 4, y: 2 }, type: 'circle' }
    ]
  },

  // ============================================================
  // ATTACHMENT TESUJI (2 puzzles)
  // ============================================================
  
  /**
   * Attachment Tesuji #1 - 9x9
   * Using attachment to create shape
   */
  {
    id: 'tesuji-attachment-001',
    title: '靠',
    type: 'tesuji',
    difficulty: 3,
    boardSize: 9,
    description: '黑方如何利用靠的手筋获得好形？',
    initialBoard: placeStones(9,
      // Black stones
      [[2, 3], [3, 3], [4, 3], [2, 4], [2, 5], [3, 5]],
      // White stones
      [[3, 4], [4, 4], [5, 4], [4, 5], [5, 5], [5, 3]]
    ),
    initialPlayer: 'black',
    solutionTree: {
      move: { x: 4, y: 5 },
      comment: '靠的手筋！黑方靠在白棋上，创造好形。',
      correct: true,
      nextMoves: [
        {
          move: { x: 5, y: 5 },
          comment: '白方扳',
          nextMoves: [
            {
              move: { x: 4, y: 6 },
              comment: '黑方长，获得好形！',
              correct: true
            }
          ]
        },
        {
          move: { x: 4, y: 6 },
          comment: '白方退',
          nextMoves: [
            {
              move: { x: 5, y: 5 },
              comment: '黑方扳，获得好形！',
              correct: true
            }
          ]
        }
      ]
    },
    hint: '靠是一种常用的手筋，可以试探对手的应手。',
    tags: ['attachment', 'shape', 'kigh'],
    marks: [
      { position: { x: 4, y: 5 }, type: 'triangle' }
    ]
  },

  /**
   * Attachment Tesuji #2 - 13x13
   * Attachment to create cutting points
   */
  {
    id: 'tesuji-attachment-002',
    title: '靠断',
    type: 'tesuji',
    difficulty: 5,
    boardSize: 13,
    description: '黑方如何利用靠的手筋创造切断的机会？',
    initialBoard: placeStones(13,
      // Black stones
      [[4, 4], [5, 4], [6, 4], [4, 5], [4, 6], [5, 6], [6, 5]],
      // White stones
      [[5, 5], [6, 5], [7, 5], [6, 6], [7, 6], [7, 4]]
    ),
    initialPlayer: 'black',
    solutionTree: {
      move: { x: 6, y: 6 },
      comment: '靠断手筋！黑方靠在白棋上，创造切断的机会。',
      correct: true,
      nextMoves: [
        {
          move: { x: 7, y: 6 },
          comment: '白方扳',
          nextMoves: [
            {
              move: { x: 6, y: 7 },
              comment: '黑方断！白棋被分成两块。',
              correct: true
            }
          ]
        },
        {
          move: { x: 6, y: 7 },
          comment: '白方退',
          nextMoves: [
            {
              move: { x: 7, y: 6 },
              comment: '黑方扳，获得好形！',
              correct: true
            }
          ]
        }
      ]
    },
    hint: '靠可以创造对手的弱点，为后续的切断做准备。',
    tags: ['attachment', 'cut', 'shape', 'advanced'],
    marks: [
      { position: { x: 6, y: 6 }, type: 'triangle' }
    ]
  },

  // ============================================================
  // SHOULDER HIT TESUJI (1 puzzle)
  // ============================================================
  
  /**
   * Shoulder Hit - 9x9
   * Classic shoulder hit to reduce and influence
   */
  {
    id: 'tesuji-shoulder-001',
    title: '肩冲',
    type: 'tesuji',
    difficulty: 2,
    boardSize: 9,
    description: '黑方如何利用肩冲来限制白棋的发展？',
    initialBoard: placeStones(9,
      // Black stones
      [[2, 2], [3, 2], [2, 3]],
      // White stones
      [[5, 5], [6, 5], [5, 6], [6, 6]]
    ),
    initialPlayer: 'black',
    solutionTree: {
      move: { x: 5, y: 4 },
      comment: '肩冲手筋！黑方在白棋上方肩冲，限制其向中央发展。',
      correct: true,
      nextMoves: [
        {
          move: { x: 5, y: 3 },
          comment: '白方爬',
          nextMoves: [
            {
              move: { x: 4, y: 4 },
              comment: '黑方长，获得外势！',
              correct: true
            }
          ]
        },
        {
          move: { x: 6, y: 4 },
          comment: '白方另一边爬',
          nextMoves: [
            {
              move: { x: 4, y: 4 },
              comment: '黑方长，获得外势！',
              correct: true
            }
          ]
        }
      ]
    },
    hint: '肩冲是一种常用的削减手法，可以限制对手的发展。',
    tags: ['shoulder-hit', 'reduction', 'influence', 'basic'],
    marks: [
      { position: { x: 5, y: 4 }, type: 'square' }
    ]
  }
];