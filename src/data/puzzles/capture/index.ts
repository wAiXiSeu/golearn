import type { Puzzle } from '../../../types/puzzle';
import type { BoardState } from '../../../types/game';

function createEmptyBoard(): BoardState {
  return Array(9).fill(null).map(() => Array(9).fill(null)) as BoardState;
}

export const capturePuzzles: Puzzle[] = [
  // LEVEL 1 - 入门 (5 puzzles)
  {
    id: 'capture-1',
    title: '吃子练习 1',
    type: 'capture',
    difficulty: 1,
    boardSize: 9,
    description: '黑先，吃掉白子。',
    initialBoard: (() => {
      const board = createEmptyBoard();
      board[4][4] = 'white';
      board[3][4] = 'black';
      board[5][4] = 'black';
      board[4][3] = 'black';
      return board;
    })(),
    initialPlayer: 'black',
    solutionTree: {
      move: { x: 4, y: 5 },
      correct: true,
      comment: '正确！填掉最后一口气，吃掉白子。',
      nextMoves: [
        {
          move: { x: 4, y: 6 },
          wrong: true,
          comment: '这里不能吃掉白子。'
        }
      ]
    },
    hint: '找到白子的最后一口气',
    tags: ['capture', 'beginner', 'one-stone']
  },
  {
    id: 'capture-2',
    title: '吃子练习 2',
    type: 'capture',
    difficulty: 1,
    boardSize: 9,
    description: '黑先，吃掉边上的白子。',
    initialBoard: (() => {
      const board = createEmptyBoard();
      board[0][4] = 'white';
      board[0][3] = 'black';
      board[1][4] = 'black';
      return board;
    })(),
    initialPlayer: 'black',
    solutionTree: {
      move: { x: 0, y: 5 },
      correct: true,
      comment: '正确！吃掉边上的白子。',
      nextMoves: [
        {
          move: { x: 0, y: 2 },
          wrong: true,
          comment: '这里不能吃掉白子。'
        }
      ]
    },
    hint: '白子在边上，只有两口气',
    tags: ['capture', 'beginner', 'edge']
  },
  {
    id: 'capture-3',
    title: '吃子练习 3',
    type: 'capture',
    difficulty: 1,
    boardSize: 9,
    description: '黑先，吃掉两个白子。',
    initialBoard: (() => {
      const board = createEmptyBoard();
      board[4][4] = 'white';
      board[4][5] = 'white';
      board[3][4] = 'black';
      board[5][4] = 'black';
      board[3][5] = 'black';
      board[5][5] = 'black';
      board[4][6] = 'black';
      return board;
    })(),
    initialPlayer: 'black',
    solutionTree: {
      move: { x: 4, y: 3 },
      correct: true,
      comment: '正确！吃掉两个白子。',
      nextMoves: [
        {
          move: { x: 4, y: 2 },
          wrong: true,
          comment: '这里不能吃掉白子。'
        }
      ]
    },
    hint: '两个白子共享气，找到它们的最后一口气',
    tags: ['capture', 'beginner', 'two-stones']
  },
  {
    id: 'capture-4',
    title: '吃子练习 4',
    type: 'capture',
    difficulty: 1,
    boardSize: 9,
    description: '黑先，吃掉角上的白子。',
    initialBoard: (() => {
      const board = createEmptyBoard();
      board[0][0] = 'white';
      board[1][0] = 'black';
      return board;
    })(),
    initialPlayer: 'black',
    solutionTree: {
      move: { x: 0, y: 1 },
      correct: true,
      comment: '正确！吃掉角上的白子。',
      nextMoves: [
        {
          move: { x: 2, y: 0 },
          wrong: true,
          comment: '这里不能吃掉白子。'
        }
      ]
    },
    hint: '角上的子只有两口气',
    tags: ['capture', 'beginner', 'corner']
  },
  {
    id: 'capture-5',
    title: '吃子练习 5',
    type: 'capture',
    difficulty: 1,
    boardSize: 9,
    description: '黑先，吃掉三个白子。',
    initialBoard: (() => {
      const board = createEmptyBoard();
      board[4][3] = 'white';
      board[4][4] = 'white';
      board[4][5] = 'white';
      board[3][3] = 'black';
      board[5][3] = 'black';
      board[3][4] = 'black';
      board[5][4] = 'black';
      board[3][5] = 'black';
      board[5][5] = 'black';
      board[4][6] = 'black';
      return board;
    })(),
    initialPlayer: 'black',
    solutionTree: {
      move: { x: 4, y: 2 },
      correct: true,
      comment: '正确！吃掉三个白子。',
      nextMoves: [
        {
          move: { x: 4, y: 1 },
          wrong: true,
          comment: '这里不能吃掉白子。'
        }
      ]
    },
    hint: '三个白子连成一线，找到它们的最后一口气',
    tags: ['capture', 'beginner', 'three-stones']
  },

  // LEVEL 2 - 初级 (5 puzzles)
  {
    id: 'capture-6',
    title: '枷吃练习',
    type: 'capture',
    difficulty: 2,
    boardSize: 9,
    description: '黑先，用枷吃掉白子。',
    initialBoard: (() => {
      const board = createEmptyBoard();
      board[4][4] = 'white';
      board[3][4] = 'black';
      board[4][3] = 'black';
      return board;
    })(),
    initialPlayer: 'black',
    solutionTree: {
      move: { x: 5, y: 5 },
      correct: true,
      comment: '正确！枷吃成功，白子无处可逃。',
      nextMoves: [
        {
          move: { x: 5, y: 4 },
          wrong: true,
          comment: '白子可以从另一边逃跑。',
          nextMoves: [
            {
              move: { x: 6, y: 4 },
              correct: true,
              comment: '白子逃跑后，继续追击。'
            }
          ]
        }
      ]
    },
    hint: '枷是一种包围技巧，让白子无处可逃',
    tags: ['capture', 'geta', 'net', 'intermediate']
  },
  {
    id: 'capture-7',
    title: '征子练习 1',
    type: 'capture',
    difficulty: 2,
    boardSize: 9,
    description: '黑先，用征子吃掉白子。',
    initialBoard: (() => {
      const board = createEmptyBoard();
      board[4][4] = 'white';
      board[3][4] = 'black';
      board[4][3] = 'black';
      board[2][2] = 'black';
      board[3][3] = 'black';
      board[5][5] = 'black';
      board[6][6] = 'black';
      return board;
    })(),
    initialPlayer: 'black',
    solutionTree: {
      move: { x: 5, y: 4 },
      correct: true,
      comment: '正确！开始征子。',
      nextMoves: [
        {
          move: { x: 4, y: 5 },
          wrong: true,
          comment: '这不是征子的正确方向。'
        }
      ]
    },
    hint: '征子需要连续追击，让白子只有一口气',
    tags: ['capture', 'ladder', 'intermediate']
  },
  {
    id: 'capture-8',
    title: '连接吃子',
    type: 'capture',
    difficulty: 2,
    boardSize: 9,
    description: '黑先，连接黑子后吃掉白子。',
    initialBoard: (() => {
      const board = createEmptyBoard();
      board[4][4] = 'white';
      board[4][5] = 'white';
      board[3][4] = 'black';
      board[5][4] = 'black';
      board[3][5] = 'black';
      board[5][5] = 'black';
      board[4][7] = 'black';
      return board;
    })(),
    initialPlayer: 'black',
    solutionTree: {
      move: { x: 4, y: 6 },
      correct: true,
      comment: '正确！连接后可以吃掉白子。',
      nextMoves: [
        {
          move: { x: 4, y: 3 },
          wrong: true,
          comment: '这里不能吃掉白子。'
        }
      ]
    },
    hint: '先连接自己的子，再吃白子',
    tags: ['capture', 'connect', 'intermediate']
  },
  {
    id: 'capture-9',
    title: '双吃练习',
    type: 'capture',
    difficulty: 2,
    boardSize: 9,
    description: '黑先，找到可以同时威胁两个白子的位置。',
    initialBoard: (() => {
      const board = createEmptyBoard();
      board[3][3] = 'white';
      board[5][5] = 'white';
      board[2][3] = 'black';
      board[3][2] = 'black';
      board[5][4] = 'black';
      board[6][5] = 'black';
      return board;
    })(),
    initialPlayer: 'black',
    solutionTree: {
      move: { x: 4, y: 4 },
      correct: true,
      comment: '正确！双吃，白子必失一子。',
      nextMoves: [
        {
          move: { x: 4, y: 3 },
          wrong: true,
          comment: '这个位置不能同时威胁两个白子。'
        }
      ]
    },
    hint: '找到一个可以同时威胁两个白子的位置',
    tags: ['capture', 'double-atari', 'intermediate']
  },
  {
    id: 'capture-10',
    title: '边上吃子',
    type: 'capture',
    difficulty: 2,
    boardSize: 9,
    description: '黑先，吃掉边上的白子。',
    initialBoard: (() => {
      const board = createEmptyBoard();
      board[0][4] = 'white';
      board[0][5] = 'white';
      board[0][3] = 'black';
      board[1][4] = 'black';
      board[1][5] = 'black';
      return board;
    })(),
    initialPlayer: 'black',
    solutionTree: {
      move: { x: 0, y: 6 },
      correct: true,
      comment: '正确！吃掉边上的白子。',
      nextMoves: [
        {
          move: { x: 1, y: 3 },
          wrong: true,
          comment: '这不是正确的位置。'
        }
      ]
    },
    hint: '白子在边上，找到它们的最后一口气',
    tags: ['capture', 'edge', 'intermediate']
  },

  // LEVEL 3 - 中级 (3 puzzles)
  {
    id: 'capture-11',
    title: '征子练习 2',
    type: 'capture',
    difficulty: 3,
    boardSize: 9,
    description: '黑先，用征子吃掉白子。注意征子路线。',
    initialBoard: (() => {
      const board = createEmptyBoard();
      board[2][2] = 'white';
      board[1][2] = 'black';
      board[2][1] = 'black';
      board[0][0] = 'black';
      board[1][1] = 'black';
      board[3][3] = 'black';
      board[4][4] = 'black';
      board[5][5] = 'black';
      board[6][6] = 'black';
      board[7][7] = 'black';
      return board;
    })(),
    initialPlayer: 'black',
    solutionTree: {
      move: { x: 3, y: 2 },
      correct: true,
      comment: '正确！征子成立。',
      nextMoves: [
        {
          move: { x: 2, y: 3 },
          wrong: true,
          comment: '这不是征子的正确方向。'
        }
      ]
    },
    hint: '征子需要沿着对角线追击',
    tags: ['capture', 'ladder', 'advanced']
  },
  {
    id: 'capture-12',
    title: '倒扑练习',
    type: 'capture',
    difficulty: 3,
    boardSize: 9,
    description: '黑先，用倒扑吃掉白子。',
    initialBoard: (() => {
      const board = createEmptyBoard();
      board[4][4] = 'white';
      board[4][5] = 'white';
      board[5][4] = 'white';
      board[3][4] = 'black';
      board[4][3] = 'black';
      board[5][3] = 'black';
      board[6][4] = 'black';
      board[4][6] = 'black';
      return board;
    })(),
    initialPlayer: 'black',
    solutionTree: {
      move: { x: 5, y: 5 },
      correct: true,
      comment: '正确！倒扑成功，吃掉白子。',
      nextMoves: [
        {
          move: { x: 5, y: 5 },
          wrong: true,
          comment: '这个位置是正确的。'
        }
      ]
    },
    hint: '倒扑是先送一子，再吃回更多的技巧',
    tags: ['capture', 'snapback', 'advanced']
  },
  {
    id: 'capture-13',
    title: '共气吃子',
    type: 'capture',
    difficulty: 3,
    boardSize: 9,
    description: '黑先，利用共气吃掉白子。',
    initialBoard: (() => {
      const board = createEmptyBoard();
      board[3][3] = 'white';
      board[3][4] = 'white';
      board[5][3] = 'white';
      board[5][4] = 'white';
      board[2][3] = 'black';
      board[2][4] = 'black';
      board[4][2] = 'black';
      board[4][5] = 'black';
      board[6][3] = 'black';
      board[6][4] = 'black';
      return board;
    })(),
    initialPlayer: 'black',
    solutionTree: {
      move: { x: 4, y: 3 },
      correct: true,
      comment: '正确！利用共气吃掉白子。',
      nextMoves: [
        {
          move: { x: 4, y: 4 },
          correct: true,
          comment: '这也是正确的位置！'
        }
      ]
    },
    hint: '两个白子组共享气，找到关键点',
    tags: ['capture', 'shared-liberties', 'advanced']
  },

  // LEVEL 4 - 高级 (2 puzzles)
  {
    id: 'capture-14',
    title: '征子练习 3',
    type: 'capture',
    difficulty: 4,
    boardSize: 9,
    description: '黑先，判断征子是否成立。',
    initialBoard: (() => {
      const board = createEmptyBoard();
      board[4][4] = 'white';
      board[3][4] = 'black';
      board[4][3] = 'black';
      board[1][1] = 'black';
      board[2][2] = 'black';
      board[3][3] = 'black';
      board[5][5] = 'black';
      board[6][6] = 'black';
      board[7][7] = 'black';
      board[8][8] = 'black';
      return board;
    })(),
    initialPlayer: 'black',
    solutionTree: {
      move: { x: 5, y: 4 },
      correct: true,
      comment: '正确！征子成立，可以吃掉白子。',
      nextMoves: [
        {
          move: { x: 4, y: 5 },
          wrong: true,
          comment: '这不是征子的正确方向。'
        }
      ]
    },
    hint: '检查征子路线上是否有障碍',
    tags: ['capture', 'ladder', 'expert']
  },
  {
    id: 'capture-15',
    title: '复杂倒扑',
    type: 'capture',
    difficulty: 4,
    boardSize: 9,
    description: '黑先，找到最佳的吃子方法。',
    initialBoard: (() => {
      const board = createEmptyBoard();
      board[4][3] = 'white';
      board[4][4] = 'white';
      board[4][5] = 'white';
      board[5][4] = 'white';
      board[3][3] = 'black';
      board[3][4] = 'black';
      board[3][5] = 'black';
      board[5][3] = 'black';
      board[5][5] = 'black';
      board[6][4] = 'black';
      board[4][6] = 'black';
      return board;
    })(),
    initialPlayer: 'black',
    solutionTree: {
      move: { x: 4, y: 2 },
      correct: true,
      comment: '正确！形成倒扑，吃掉白子。',
      nextMoves: [
        {
          move: { x: 5, y: 4 },
          wrong: true,
          comment: '这个位置已经有子了。'
        }
      ]
    },
    hint: '仔细观察白子的形状，找到可以倒扑的位置',
    tags: ['capture', 'snapback', 'expert']
  }
];

export default capturePuzzles;