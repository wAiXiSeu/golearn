import type { Puzzle } from '../../../types/puzzle';
import type { BoardState, StoneColor } from '../../../types/game';

/**
 * Life and Death Puzzles Collection
 * 
 * Distribution:
 * - Board sizes: 10 puzzles (9x9), 5 puzzles (13x13)
 * - Difficulty: 3x level-1, 4x level-2, 4x level-3, 3x level-4, 1x level-5
 * 
 * Puzzle Types:
 * - Make two eyes (5 puzzles)
 * - Kill by reducing eye space (4 puzzles)
 * - False eye recognition (3 puzzles)
 * - Ko for life (2 puzzles)
 * - Throw-in to kill (1 puzzle)
 */

const createEmptyBoard = (size: 9 | 13): BoardState => 
  Array(size).fill(null).map(() => Array(size).fill(null));

const setStones = (board: BoardState, positions: { x: number; y: number; stone: StoneColor }[]): BoardState => {
  const newBoard = board.map(row => [...row]);
  positions.forEach(({ x, y, stone }) => {
    newBoard[y][x] = stone;
  });
  return newBoard;
};

export const lifeDeathPuzzles: Puzzle[] = [
  // ============================================
  // PUZZLE 1: Make Two Eyes (9x9, Level 1)
  // ============================================
  {
    id: 'life-death-1',
    title: '做活练习 1',
    type: 'life_death',
    difficulty: 1,
    boardSize: 9,
    description: '黑先，做活。',
    initialBoard: setStones(createEmptyBoard(9), [
      // Black group in corner
      { x: 0, y: 0, stone: 'black' },
      { x: 1, y: 0, stone: 'black' },
      { x: 2, y: 0, stone: 'black' },
      { x: 0, y: 1, stone: 'black' },
      { x: 1, y: 1, stone: 'black' },
      { x: 0, y: 2, stone: 'black' },
      // White surrounding
      { x: 3, y: 0, stone: 'white' },
      { x: 3, y: 1, stone: 'white' },
      { x: 2, y: 2, stone: 'white' },
      { x: 1, y: 3, stone: 'white' },
      { x: 0, y: 3, stone: 'white' },
    ]),
    initialPlayer: 'black',
    solutionTree: {
      move: { x: 2, y: 1 },
      correct: true,
      comment: '正确！在内部形成两只眼。',
      nextMoves: [
        {
          move: { x: 1, y: 2 },
          correct: true,
          comment: '白方试图破坏，但黑方已形成两只眼。',
          nextMoves: []
        }
      ]
    },
    hint: '记住：两只眼才能活棋',
    tags: ['life_death', 'eyes', 'beginner', 'corner'],
  },

  // ============================================
  // PUZZLE 2: Make Two Eyes (9x9, Level 1)
  // ============================================
  {
    id: 'life-death-2',
    title: '做活练习 2',
    type: 'life_death',
    difficulty: 1,
    boardSize: 9,
    description: '黑先，做活。',
    initialBoard: setStones(createEmptyBoard(9), [
      // Black group on edge
      { x: 4, y: 0, stone: 'black' },
      { x: 5, y: 0, stone: 'black' },
      { x: 6, y: 0, stone: 'black' },
      { x: 7, y: 0, stone: 'black' },
      { x: 4, y: 1, stone: 'black' },
      { x: 7, y: 1, stone: 'black' },
      { x: 4, y: 2, stone: 'black' },
      { x: 5, y: 2, stone: 'black' },
      { x: 6, y: 2, stone: 'black' },
      { x: 7, y: 2, stone: 'black' },
      // White surrounding
      { x: 3, y: 0, stone: 'white' },
      { x: 8, y: 0, stone: 'white' },
      { x: 3, y: 1, stone: 'white' },
      { x: 8, y: 1, stone: 'white' },
      { x: 3, y: 2, stone: 'white' },
      { x: 8, y: 2, stone: 'white' },
      { x: 4, y: 3, stone: 'white' },
      { x: 5, y: 3, stone: 'white' },
      { x: 6, y: 3, stone: 'white' },
      { x: 7, y: 3, stone: 'white' },
    ]),
    initialPlayer: 'black',
    solutionTree: {
      move: { x: 5, y: 1 },
      correct: true,
      comment: '正确！形成两只眼位。',
      nextMoves: [
        {
          move: { x: 6, y: 1 },
          wrong: true,
          comment: '错误，这样只有一只眼，会被吃掉。',
          nextMoves: []
        }
      ]
    },
    hint: '在中间位置做眼',
    tags: ['life_death', 'eyes', 'beginner', 'edge'],
  },

  // ============================================
  // PUZZLE 3: Kill by Reducing Eye Space (9x9, Level 1)
  // ============================================
  {
    id: 'life-death-3',
    title: '杀棋练习 1',
    type: 'life_death',
    difficulty: 1,
    boardSize: 9,
    description: '白先，杀死黑棋。',
    initialBoard: setStones(createEmptyBoard(9), [
      // Black group in corner with one eye
      { x: 0, y: 0, stone: 'black' },
      { x: 1, y: 0, stone: 'black' },
      { x: 0, y: 1, stone: 'black' },
      { x: 1, y: 1, stone: 'black' },
      { x: 0, y: 2, stone: 'black' },
      // White surrounding
      { x: 2, y: 0, stone: 'white' },
      { x: 2, y: 1, stone: 'white' },
      { x: 2, y: 2, stone: 'white' },
      { x: 1, y: 2, stone: 'white' },
      { x: 0, y: 3, stone: 'white' },
      { x: 1, y: 3, stone: 'white' },
    ]),
    initialPlayer: 'white',
    solutionTree: {
      move: { x: 0, y: 0 },
      wrong: true,
      comment: '错误，黑棋已经有眼位。',
      nextMoves: []
    },
    hint: '找到黑棋眼位的弱点',
    tags: ['life_death', 'kill', 'beginner', 'corner'],
  },

  // ============================================
  // PUZZLE 4: Make Two Eyes (9x9, Level 2)
  // ============================================
  {
    id: 'life-death-4',
    title: '做活练习 3',
    type: 'life_death',
    difficulty: 2,
    boardSize: 9,
    description: '黑先，做活。',
    initialBoard: setStones(createEmptyBoard(9), [
      // Black group
      { x: 1, y: 1, stone: 'black' },
      { x: 2, y: 1, stone: 'black' },
      { x: 3, y: 1, stone: 'black' },
      { x: 1, y: 2, stone: 'black' },
      { x: 3, y: 2, stone: 'black' },
      { x: 1, y: 3, stone: 'black' },
      { x: 2, y: 3, stone: 'black' },
      { x: 3, y: 3, stone: 'black' },
      // White surrounding
      { x: 0, y: 1, stone: 'white' },
      { x: 0, y: 2, stone: 'white' },
      { x: 0, y: 3, stone: 'white' },
      { x: 1, y: 0, stone: 'white' },
      { x: 2, y: 0, stone: 'white' },
      { x: 3, y: 0, stone: 'white' },
      { x: 4, y: 1, stone: 'white' },
      { x: 4, y: 2, stone: 'white' },
      { x: 4, y: 3, stone: 'white' },
      { x: 1, y: 4, stone: 'white' },
      { x: 2, y: 4, stone: 'white' },
      { x: 3, y: 4, stone: 'white' },
    ]),
    initialPlayer: 'black',
    solutionTree: {
      move: { x: 2, y: 2 },
      correct: true,
      comment: '正确！这是做活的要点，形成两只眼。',
      nextMoves: [
        {
          move: { x: 0, y: 0 },
          correct: true,
          comment: '白方继续进攻，但黑棋已活。',
          nextMoves: []
        }
      ]
    },
    hint: '在中心位置做眼是关键',
    tags: ['life_death', 'eyes', 'elementary'],
  },

  // ============================================
  // PUZZLE 5: Kill by Reducing Eye Space (9x9, Level 2)
  // ============================================
  {
    id: 'life-death-5',
    title: '杀棋练习 2',
    type: 'life_death',
    difficulty: 2,
    boardSize: 9,
    description: '白先，杀死黑棋。',
    initialBoard: setStones(createEmptyBoard(9), [
      // Black group with potential for two eyes
      { x: 5, y: 5, stone: 'black' },
      { x: 6, y: 5, stone: 'black' },
      { x: 7, y: 5, stone: 'black' },
      { x: 5, y: 6, stone: 'black' },
      { x: 7, y: 6, stone: 'black' },
      { x: 5, y: 7, stone: 'black' },
      { x: 6, y: 7, stone: 'black' },
      { x: 7, y: 7, stone: 'black' },
      // White surrounding
      { x: 4, y: 5, stone: 'white' },
      { x: 4, y: 6, stone: 'white' },
      { x: 4, y: 7, stone: 'white' },
      { x: 8, y: 5, stone: 'white' },
      { x: 8, y: 6, stone: 'white' },
      { x: 8, y: 7, stone: 'white' },
      { x: 5, y: 4, stone: 'white' },
      { x: 6, y: 4, stone: 'white' },
      { x: 7, y: 4, stone: 'white' },
      { x: 5, y: 8, stone: 'white' },
      { x: 6, y: 8, stone: 'white' },
      { x: 7, y: 8, stone: 'white' },
    ]),
    initialPlayer: 'white',
    solutionTree: {
      move: { x: 6, y: 6 },
      correct: true,
      comment: '正确！占据眼位中心，黑棋无法做活。',
      nextMoves: [
        {
          move: { x: 6, y: 6 },
          wrong: true,
          comment: '错误的位置。',
          nextMoves: []
        }
      ]
    },
    hint: '破坏对方的眼位是杀棋的关键',
    tags: ['life_death', 'kill', 'elementary'],
  },

  // ============================================
  // PUZZLE 6: False Eye Recognition (9x9, Level 2)
  // ============================================
  {
    id: 'life-death-6',
    title: '假眼识别 1',
    type: 'life_death',
    difficulty: 2,
    boardSize: 9,
    description: '黑先，识别假眼并做活。',
    initialBoard: setStones(createEmptyBoard(9), [
      // Black group with false eye
      { x: 1, y: 1, stone: 'black' },
      { x: 2, y: 1, stone: 'black' },
      { x: 3, y: 1, stone: 'black' },
      { x: 1, y: 2, stone: 'black' },
      { x: 3, y: 2, stone: 'black' },
      { x: 1, y: 3, stone: 'black' },
      { x: 2, y: 3, stone: 'black' },
      { x: 3, y: 3, stone: 'black' },
      // White stones creating false eye potential
      { x: 2, y: 2, stone: 'white' },
      // White surrounding
      { x: 0, y: 1, stone: 'white' },
      { x: 0, y: 2, stone: 'white' },
      { x: 0, y: 3, stone: 'white' },
      { x: 1, y: 0, stone: 'white' },
      { x: 2, y: 0, stone: 'white' },
      { x: 3, y: 0, stone: 'white' },
      { x: 4, y: 1, stone: 'white' },
      { x: 4, y: 2, stone: 'white' },
      { x: 4, y: 3, stone: 'white' },
      { x: 1, y: 4, stone: 'white' },
      { x: 2, y: 4, stone: 'white' },
      { x: 3, y: 4, stone: 'white' },
    ]),
    initialPlayer: 'black',
    solutionTree: {
      move: { x: 2, y: 2 },
      correct: true,
      comment: '正确！提掉白子，形成真眼。',
      nextMoves: [
        {
          move: 'pass',
          correct: true,
          comment: '白方无法阻止黑棋做活。',
          nextMoves: []
        }
      ]
    },
    hint: '假眼不是真正的眼，需要提掉里面的子',
    tags: ['life_death', 'false_eye', 'elementary'],
  },

  // ============================================
  // PUZZLE 7: Kill by Reducing Eye Space (9x9, Level 3)
  // ============================================
  {
    id: 'life-death-7',
    title: '杀棋练习 3',
    type: 'life_death',
    difficulty: 3,
    boardSize: 9,
    description: '白先，缩小眼位杀黑。',
    initialBoard: setStones(createEmptyBoard(9), [
      // Black group with larger eye space
      { x: 0, y: 0, stone: 'black' },
      { x: 1, y: 0, stone: 'black' },
      { x: 2, y: 0, stone: 'black' },
      { x: 3, y: 0, stone: 'black' },
      { x: 0, y: 1, stone: 'black' },
      { x: 3, y: 1, stone: 'black' },
      { x: 0, y: 2, stone: 'black' },
      { x: 2, y: 2, stone: 'black' },
      { x: 3, y: 2, stone: 'black' },
      { x: 0, y: 3, stone: 'black' },
      { x: 1, y: 3, stone: 'black' },
      { x: 2, y: 3, stone: 'black' },
      { x: 3, y: 3, stone: 'black' },
      // White surrounding
      { x: 4, y: 0, stone: 'white' },
      { x: 4, y: 1, stone: 'white' },
      { x: 4, y: 2, stone: 'white' },
      { x: 4, y: 3, stone: 'white' },
      { x: 0, y: 4, stone: 'white' },
      { x: 1, y: 4, stone: 'white' },
      { x: 2, y: 4, stone: 'white' },
      { x: 3, y: 4, stone: 'white' },
    ]),
    initialPlayer: 'white',
    solutionTree: {
      move: { x: 1, y: 1 },
      correct: true,
      comment: '正确！缩小眼位，黑棋只能形成一只眼。',
      nextMoves: [
        {
          move: { x: 1, y: 2 },
          correct: true,
          comment: '黑方抵抗，但眼位已被破坏。',
          nextMoves: [
            {
              move: { x: 2, y: 1 },
              correct: true,
              comment: '继续缩小眼位，黑棋死亡。',
              nextMoves: []
            }
          ]
        }
      ]
    },
    hint: '缩小眼位是杀棋的基本手法',
    tags: ['life_death', 'kill', 'intermediate', 'eye_space'],
  },

  // ============================================
  // PUZZLE 8: False Eye Recognition (9x9, Level 3)
  // ============================================
  {
    id: 'life-death-8',
    title: '假眼识别 2',
    type: 'life_death',
    difficulty: 3,
    boardSize: 9,
    description: '黑先，利用假眼做活。',
    initialBoard: setStones(createEmptyBoard(9), [
      // Black group
      { x: 3, y: 3, stone: 'black' },
      { x: 4, y: 3, stone: 'black' },
      { x: 5, y: 3, stone: 'black' },
      { x: 3, y: 4, stone: 'black' },
      { x: 5, y: 4, stone: 'black' },
      { x: 3, y: 5, stone: 'black' },
      { x: 4, y: 5, stone: 'black' },
      { x: 5, y: 5, stone: 'black' },
      // White stone inside creating false eye situation
      { x: 4, y: 4, stone: 'white' },
      // White surrounding
      { x: 2, y: 3, stone: 'white' },
      { x: 2, y: 4, stone: 'white' },
      { x: 2, y: 5, stone: 'white' },
      { x: 6, y: 3, stone: 'white' },
      { x: 6, y: 4, stone: 'white' },
      { x: 6, y: 5, stone: 'white' },
      { x: 3, y: 2, stone: 'white' },
      { x: 4, y: 2, stone: 'white' },
      { x: 5, y: 2, stone: 'white' },
      { x: 3, y: 6, stone: 'white' },
      { x: 4, y: 6, stone: 'white' },
      { x: 5, y: 6, stone: 'white' },
    ]),
    initialPlayer: 'black',
    solutionTree: {
      move: { x: 4, y: 4 },
      correct: true,
      comment: '正确！提掉白子，形成真眼。',
      nextMoves: [
        {
          move: 'pass',
          correct: true,
          comment: '黑棋成功做活。',
          nextMoves: []
        }
      ]
    },
    hint: '识别并消除假眼',
    tags: ['life_death', 'false_eye', 'intermediate'],
  },

  // ============================================
  // PUZZLE 9: Ko for Life (9x9, Level 3)
  // ============================================
  {
    id: 'life-death-9',
    title: '劫争做活',
    type: 'life_death',
    difficulty: 3,
    boardSize: 9,
    description: '黑先，利用劫争做活。',
    initialBoard: setStones(createEmptyBoard(9), [
      // Black group in ko situation
      { x: 0, y: 0, stone: 'black' },
      { x: 1, y: 0, stone: 'black' },
      { x: 2, y: 0, stone: 'black' },
      { x: 0, y: 1, stone: 'black' },
      { x: 2, y: 1, stone: 'black' },
      { x: 0, y: 2, stone: 'black' },
      { x: 1, y: 2, stone: 'black' },
      // White creating ko
      { x: 1, y: 1, stone: 'white' },
      // White surrounding
      { x: 3, y: 0, stone: 'white' },
      { x: 3, y: 1, stone: 'white' },
      { x: 2, y: 2, stone: 'white' },
      { x: 0, y: 3, stone: 'white' },
      { x: 1, y: 3, stone: 'white' },
    ]),
    initialPlayer: 'black',
    solutionTree: {
      move: { x: 1, y: 1 },
      correct: true,
      comment: '正确！提掉白子形成劫争。',
      nextMoves: [
        {
          move: { x: 0, y: 0 },
          wrong: true,
          comment: '白方在其他地方找劫材后回提。',
          nextMoves: []
        },
        {
          move: 'pass',
          correct: true,
          comment: '如果白方没有合适的劫材，黑棋做活。',
          nextMoves: []
        }
      ]
    },
    hint: '劫争可以用来做活',
    tags: ['life_death', 'ko', 'intermediate'],
  },

  // ============================================
  // PUZZLE 10: Throw-in to Kill (9x9, Level 4)
  // ============================================
  {
    id: 'life-death-10',
    title: '扑杀练习',
    type: 'life_death',
    difficulty: 4,
    boardSize: 9,
    description: '白先，利用扑杀杀死黑棋。',
    initialBoard: setStones(createEmptyBoard(9), [
      // Black group
      { x: 6, y: 6, stone: 'black' },
      { x: 7, y: 6, stone: 'black' },
      { x: 8, y: 6, stone: 'black' },
      { x: 6, y: 7, stone: 'black' },
      { x: 8, y: 7, stone: 'black' },
      { x: 6, y: 8, stone: 'black' },
      { x: 7, y: 8, stone: 'black' },
      { x: 8, y: 8, stone: 'black' },
      // White surrounding
      { x: 5, y: 6, stone: 'white' },
      { x: 5, y: 7, stone: 'white' },
      { x: 5, y: 8, stone: 'white' },
      { x: 6, y: 5, stone: 'white' },
      { x: 7, y: 5, stone: 'white' },
      { x: 8, y: 5, stone: 'white' },
    ]),
    initialPlayer: 'white',
    solutionTree: {
      move: { x: 7, y: 7 },
      correct: true,
      comment: '正确！扑入黑棋眼位，破坏眼形。',
      nextMoves: [
        {
          move: { x: 7, y: 7 },
          correct: true,
          comment: '黑方提子，但眼位已被破坏。',
          nextMoves: [
            {
              move: { x: 7, y: 7 },
              correct: true,
              comment: '再次扑入，黑棋死亡。',
              nextMoves: []
            }
          ]
        }
      ]
    },
    hint: '扑是一种牺牲子力来破坏对方眼形的手法',
    tags: ['life_death', 'throw_in', 'advanced', 'tesuji'],
  },

  // ============================================
  // PUZZLE 11: Make Two Eyes (13x13, Level 2)
  // ============================================
  {
    id: 'life-death-11',
    title: '做活练习 4',
    type: 'life_death',
    difficulty: 2,
    boardSize: 13,
    description: '黑先，做活。',
    initialBoard: setStones(createEmptyBoard(13), [
      // Black group on 13x13
      { x: 2, y: 2, stone: 'black' },
      { x: 3, y: 2, stone: 'black' },
      { x: 4, y: 2, stone: 'black' },
      { x: 5, y: 2, stone: 'black' },
      { x: 2, y: 3, stone: 'black' },
      { x: 5, y: 3, stone: 'black' },
      { x: 2, y: 4, stone: 'black' },
      { x: 4, y: 4, stone: 'black' },
      { x: 5, y: 4, stone: 'black' },
      { x: 2, y: 5, stone: 'black' },
      { x: 3, y: 5, stone: 'black' },
      { x: 4, y: 5, stone: 'black' },
      { x: 5, y: 5, stone: 'black' },
      // White surrounding
      { x: 1, y: 2, stone: 'white' },
      { x: 1, y: 3, stone: 'white' },
      { x: 1, y: 4, stone: 'white' },
      { x: 1, y: 5, stone: 'white' },
      { x: 6, y: 2, stone: 'white' },
      { x: 6, y: 3, stone: 'white' },
      { x: 6, y: 4, stone: 'white' },
      { x: 6, y: 5, stone: 'white' },
      { x: 2, y: 1, stone: 'white' },
      { x: 3, y: 1, stone: 'white' },
      { x: 4, y: 1, stone: 'white' },
      { x: 5, y: 1, stone: 'white' },
      { x: 2, y: 6, stone: 'white' },
      { x: 3, y: 6, stone: 'white' },
      { x: 4, y: 6, stone: 'white' },
      { x: 5, y: 6, stone: 'white' },
    ]),
    initialPlayer: 'black',
    solutionTree: {
      move: { x: 3, y: 3 },
      correct: true,
      comment: '正确！占据关键点做眼。',
      nextMoves: [
        {
          move: { x: 3, y: 4 },
          wrong: true,
          comment: '错误，白方会破坏眼位。',
          nextMoves: []
        }
      ]
    },
    hint: '找到做眼的关键点',
    tags: ['life_death', 'eyes', 'elementary'],
  },

  // ============================================
  // PUZZLE 12: Kill by Reducing Eye Space (13x13, Level 3)
  // ============================================
  {
    id: 'life-death-12',
    title: '杀棋练习 4',
    type: 'life_death',
    difficulty: 3,
    boardSize: 13,
    description: '白先，缩小眼位杀黑。',
    initialBoard: setStones(createEmptyBoard(13), [
      // Black group on 13x13
      { x: 8, y: 8, stone: 'black' },
      { x: 9, y: 8, stone: 'black' },
      { x: 10, y: 8, stone: 'black' },
      { x: 11, y: 8, stone: 'black' },
      { x: 8, y: 9, stone: 'black' },
      { x: 11, y: 9, stone: 'black' },
      { x: 8, y: 10, stone: 'black' },
      { x: 10, y: 10, stone: 'black' },
      { x: 11, y: 10, stone: 'black' },
      { x: 8, y: 11, stone: 'black' },
      { x: 9, y: 11, stone: 'black' },
      { x: 10, y: 11, stone: 'black' },
      { x: 11, y: 11, stone: 'black' },
      // White surrounding
      { x: 7, y: 8, stone: 'white' },
      { x: 7, y: 9, stone: 'white' },
      { x: 7, y: 10, stone: 'white' },
      { x: 7, y: 11, stone: 'white' },
      { x: 12, y: 8, stone: 'white' },
      { x: 12, y: 9, stone: 'white' },
      { x: 12, y: 10, stone: 'white' },
      { x: 12, y: 11, stone: 'white' },
      { x: 8, y: 7, stone: 'white' },
      { x: 9, y: 7, stone: 'white' },
      { x: 10, y: 7, stone: 'white' },
      { x: 11, y: 7, stone: 'white' },
      { x: 8, y: 12, stone: 'white' },
      { x: 9, y: 12, stone: 'white' },
      { x: 10, y: 12, stone: 'white' },
      { x: 11, y: 12, stone: 'white' },
    ]),
    initialPlayer: 'white',
    solutionTree: {
      move: { x: 9, y: 9 },
      correct: true,
      comment: '正确！占据眼位中心。',
      nextMoves: [
        {
          move: { x: 9, y: 10 },
          correct: true,
          comment: '黑方抵抗。',
          nextMoves: [
            {
              move: { x: 10, y: 9 },
              correct: true,
              comment: '继续缩小眼位，黑棋死亡。',
              nextMoves: []
            }
          ]
        }
      ]
    },
    hint: '从内部破坏眼位',
    tags: ['life_death', 'kill', 'intermediate', 'eye_space'],
  },

  // ============================================
  // PUZZLE 13: False Eye Recognition (13x13, Level 4)
  // ============================================
  {
    id: 'life-death-13',
    title: '假眼识别 3',
    type: 'life_death',
    difficulty: 4,
    boardSize: 13,
    description: '黑先，识别并利用假眼做活。',
    initialBoard: setStones(createEmptyBoard(13), [
      // Black group with complex false eye situation
      { x: 3, y: 3, stone: 'black' },
      { x: 4, y: 3, stone: 'black' },
      { x: 5, y: 3, stone: 'black' },
      { x: 6, y: 3, stone: 'black' },
      { x: 3, y: 4, stone: 'black' },
      { x: 6, y: 4, stone: 'black' },
      { x: 3, y: 5, stone: 'black' },
      { x: 5, y: 5, stone: 'black' },
      { x: 6, y: 5, stone: 'black' },
      { x: 3, y: 6, stone: 'black' },
      { x: 4, y: 6, stone: 'black' },
      { x: 5, y: 6, stone: 'black' },
      { x: 6, y: 6, stone: 'black' },
      // White stones inside
      { x: 4, y: 4, stone: 'white' },
      { x: 4, y: 5, stone: 'white' },
      // White surrounding
      { x: 2, y: 3, stone: 'white' },
      { x: 2, y: 4, stone: 'white' },
      { x: 2, y: 5, stone: 'white' },
      { x: 2, y: 6, stone: 'white' },
      { x: 7, y: 3, stone: 'white' },
      { x: 7, y: 4, stone: 'white' },
      { x: 7, y: 5, stone: 'white' },
      { x: 7, y: 6, stone: 'white' },
      { x: 3, y: 2, stone: 'white' },
      { x: 4, y: 2, stone: 'white' },
      { x: 5, y: 2, stone: 'white' },
      { x: 6, y: 2, stone: 'white' },
      { x: 3, y: 7, stone: 'white' },
      { x: 4, y: 7, stone: 'white' },
      { x: 5, y: 7, stone: 'white' },
      { x: 6, y: 7, stone: 'white' },
    ]),
    initialPlayer: 'black',
    solutionTree: {
      move: { x: 4, y: 5 },
      correct: true,
      comment: '正确！提掉白子，形成真眼。',
      nextMoves: [
        {
          move: { x: 4, y: 4 },
          correct: true,
          comment: '白方反提。',
          nextMoves: [
            {
              move: { x: 4, y: 5 },
              correct: true,
              comment: '再次提子，形成两只眼。',
              nextMoves: []
            }
          ]
        }
      ]
    },
    hint: '连续提子可以形成真眼',
    tags: ['life_death', 'false_eye', 'advanced'],
  },

  // ============================================
  // PUZZLE 14: Ko for Life (13x13, Level 4)
  // ============================================
  {
    id: 'life-death-14',
    title: '复杂劫争',
    type: 'life_death',
    difficulty: 4,
    boardSize: 13,
    description: '黑先，利用劫争做活。',
    initialBoard: setStones(createEmptyBoard(13), [
      // Black group in complex ko situation
      { x: 10, y: 10, stone: 'black' },
      { x: 11, y: 10, stone: 'black' },
      { x: 12, y: 10, stone: 'black' },
      { x: 10, y: 11, stone: 'black' },
      { x: 12, y: 11, stone: 'black' },
      { x: 10, y: 12, stone: 'black' },
      { x: 11, y: 12, stone: 'black' },
      { x: 12, y: 12, stone: 'black' },
      // White creating ko
      { x: 11, y: 11, stone: 'white' },
      // White surrounding
      { x: 9, y: 10, stone: 'white' },
      { x: 9, y: 11, stone: 'white' },
      { x: 9, y: 12, stone: 'white' },
      { x: 10, y: 9, stone: 'white' },
      { x: 11, y: 9, stone: 'white' },
      { x: 12, y: 9, stone: 'white' },
    ]),
    initialPlayer: 'black',
    solutionTree: {
      move: { x: 11, y: 11 },
      correct: true,
      comment: '正确！提掉白子形成劫争。',
      nextMoves: [
        {
          move: { x: 0, y: 0 },
          correct: true,
          comment: '白方在其他地方找劫材。',
          nextMoves: [
            {
              move: { x: 11, y: 11 },
              correct: true,
              comment: '黑方回提，继续劫争。',
              nextMoves: []
            }
          ]
        }
      ]
    },
    hint: '劫争需要找到合适的劫材',
    tags: ['life_death', 'ko', 'advanced'],
  },

  // ============================================
  // PUZZLE 15: Make Two Eyes (13x13, Level 5)
  // ============================================
  {
    id: 'life-death-15',
    title: '专家做活',
    type: 'life_death',
    difficulty: 5,
    boardSize: 13,
    description: '黑先，在复杂局面下做活。',
    initialBoard: setStones(createEmptyBoard(13), [
      // Black group - complex shape
      { x: 5, y: 5, stone: 'black' },
      { x: 6, y: 5, stone: 'black' },
      { x: 7, y: 5, stone: 'black' },
      { x: 8, y: 5, stone: 'black' },
      { x: 9, y: 5, stone: 'black' },
      { x: 5, y: 6, stone: 'black' },
      { x: 9, y: 6, stone: 'black' },
      { x: 5, y: 7, stone: 'black' },
      { x: 7, y: 7, stone: 'black' },
      { x: 9, y: 7, stone: 'black' },
      { x: 5, y: 8, stone: 'black' },
      { x: 6, y: 8, stone: 'black' },
      { x: 8, y: 8, stone: 'black' },
      { x: 9, y: 8, stone: 'black' },
      { x: 5, y: 9, stone: 'black' },
      { x: 6, y: 9, stone: 'black' },
      { x: 7, y: 9, stone: 'black' },
      { x: 8, y: 9, stone: 'black' },
      { x: 9, y: 9, stone: 'black' },
      // White stones inside creating complications
      { x: 6, y: 6, stone: 'white' },
      { x: 8, y: 6, stone: 'white' },
      { x: 6, y: 7, stone: 'white' },
      { x: 8, y: 7, stone: 'white' },
      // White surrounding
      { x: 4, y: 5, stone: 'white' },
      { x: 4, y: 6, stone: 'white' },
      { x: 4, y: 7, stone: 'white' },
      { x: 4, y: 8, stone: 'white' },
      { x: 4, y: 9, stone: 'white' },
      { x: 10, y: 5, stone: 'white' },
      { x: 10, y: 6, stone: 'white' },
      { x: 10, y: 7, stone: 'white' },
      { x: 10, y: 8, stone: 'white' },
      { x: 10, y: 9, stone: 'white' },
      { x: 5, y: 4, stone: 'white' },
      { x: 6, y: 4, stone: 'white' },
      { x: 7, y: 4, stone: 'white' },
      { x: 8, y: 4, stone: 'white' },
      { x: 9, y: 4, stone: 'white' },
      { x: 5, y: 10, stone: 'white' },
      { x: 6, y: 10, stone: 'white' },
      { x: 7, y: 10, stone: 'white' },
      { x: 8, y: 10, stone: 'white' },
      { x: 9, y: 10, stone: 'white' },
    ]),
    initialPlayer: 'black',
    solutionTree: {
      move: { x: 7, y: 6 },
      correct: true,
      comment: '正确！这是做活的关键点。',
      nextMoves: [
        {
          move: { x: 7, y: 8 },
          wrong: true,
          comment: '错误，白方会破坏眼位。',
          nextMoves: []
        },
        {
          move: { x: 6, y: 7 },
          correct: true,
          comment: '白方抵抗。',
          nextMoves: [
            {
              move: { x: 7, y: 8 },
              correct: true,
              comment: '继续做眼。',
              nextMoves: [
                {
                  move: { x: 8, y: 7 },
                  correct: true,
                  comment: '黑棋成功做活。',
                  nextMoves: []
                }
              ]
            }
          ]
        }
      ]
    },
    hint: '在复杂局面中找到做眼的关键点',
    tags: ['life_death', 'eyes', 'expert', 'complex'],
  },
];

export default lifeDeathPuzzles;