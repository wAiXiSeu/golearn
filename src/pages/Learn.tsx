import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle, Circle, Play, BookOpen, Target, Award, RefreshCw, HelpCircle, Lightbulb } from 'lucide-react';
import type { BoardState, Position } from '../types/game';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

type LessonStepType = 'explain' | 'demonstrate' | 'interactive' | 'quiz';

type LessonStep = {
  id: string;
  title: string;
  content: string;
  type: LessonStepType;
  boardState: BoardState;
  highlightPositions?: Position[];
  arrowPositions?: { from: Position; to: Position; color?: string }[];
  libertyLabels?: { position: Position; count: number }[];
  interactivePrompt?: string;
  expectedMoves?: Position[];
  quizQuestion?: string;
  quizOptions?: string[];
  correctAnswer?: number;
  explanation?: string;
  animationSequence?: { boardState: BoardState; delay: number; description: string }[];
};

type Lesson = {
  id: string;
  title: string;
  description: string;
  category: 'basic' | 'tactics' | 'endgame' | 'opening';
  categoryName: string;
  difficulty: 1 | 2 | 3;
  duration: number;
  progress: number;
  steps: LessonStep[];
};

// ============================================================================
// BOARD UTILITY FUNCTIONS
// ============================================================================

const createEmptyBoard = (size: number = 9): BoardState => {
  return Array(size).fill(null).map(() => Array(size).fill(null));
};

const cloneBoard = (board: BoardState): BoardState => {
  return board.map(row => [...row]);
};

const placeStone = (board: BoardState, x: number, y: number, color: 'black' | 'white'): BoardState => {
  const newBoard = cloneBoard(board);
  newBoard[y][x] = color;
  return newBoard;
};

const placeStones = (board: BoardState, positions: { x: number; y: number; color: 'black' | 'white' }[]): BoardState => {
  const newBoard = cloneBoard(board);
  positions.forEach(({ x, y, color }) => {
    if (y >= 0 && y < newBoard.length && x >= 0 && x < newBoard[0].length) {
      newBoard[y][x] = color;
    }
  });
  return newBoard;
};



// ============================================================================
// LESSON DATA WITH ACTUAL STONE POSITIONS
// ============================================================================

const lessons: Lesson[] = [
  // ============================================================================
  // LESSON 1: 气的概念 (Liberties)
  // ============================================================================
  {
    id: 'basic-1',
    title: '气的概念',
    description: '学习围棋中最基本的概念——气，了解棋子生存的基础',
    category: 'basic',
    categoryName: '基础规则',
    difficulty: 1,
    duration: 10,
    progress: 0,
    steps: [
      {
        id: 'step-1-1',
        title: '什么是气',
        content: '在围棋中，每个棋子都有"气"。气是指棋子周围直线相连的空交叉点。一个棋子最多有4口气（上、下、左、右）。\n\n观察棋盘上的黑子，它位于中央，有4口气。',
        type: 'explain',
        boardState: placeStone(createEmptyBoard(9), 4, 4, 'black'),
        highlightPositions: [{ x: 4, y: 3 }, { x: 4, y: 5 }, { x: 3, y: 4 }, { x: 5, y: 4 }],
        libertyLabels: [{ position: { x: 4, y: 4 }, count: 4 }],
      },
      {
        id: 'step-1-2',
        title: '边缘与角落的气',
        content: '位于棋盘边缘的棋子只有3口气，位于角落的棋子只有2口气。\n\n观察这三个位置的黑子：\n• 角落(0,0)：2口气\n• 边缘(4,0)：3口气\n• 中央(4,4)：4口气',
        type: 'explain',
        boardState: placeStones(createEmptyBoard(9), [
          { x: 0, y: 0, color: 'black' },
          { x: 4, y: 0, color: 'black' },
          { x: 4, y: 4, color: 'black' },
        ]),
        highlightPositions: [{ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 4, y: 4 }],
        libertyLabels: [
          { position: { x: 0, y: 0 }, count: 2 },
          { position: { x: 4, y: 0 }, count: 3 },
          { position: { x: 4, y: 4 }, count: 4 },
        ],
      },
      {
        id: 'step-1-3',
        title: '连接增加气',
        content: '当同色棋子相连时，它们的气是共享的。两个相连的黑子有6口气！',
        type: 'demonstrate',
        boardState: placeStones(createEmptyBoard(9), [
          { x: 4, y: 4, color: 'black' },
          { x: 5, y: 4, color: 'black' },
        ]),
        highlightPositions: [{ x: 4, y: 3 }, { x: 4, y: 5 }, { x: 3, y: 4 }, { x: 5, y: 3 }, { x: 5, y: 5 }, { x: 6, y: 4 }],
        libertyLabels: [{ position: { x: 4, y: 4 }, count: 6 }],
      },
      {
        id: 'step-1-4',
        title: '互动练习',
        content: '请在棋盘上放置一个黑子，观察它有多少口气。点击任意空位放置黑子。',
        type: 'interactive',
        boardState: createEmptyBoard(9),
        interactivePrompt: '点击棋盘放置黑子，观察气的数量',
      },
      {
        id: 'step-1-5',
        title: '小测验',
        content: '一个位于棋盘中央、没有连接其他棋子的单颗黑子，有几口气？',
        type: 'quiz',
        boardState: placeStone(createEmptyBoard(9), 4, 4, 'black'),
        quizQuestion: '中央位置的单颗棋子有几口气？',
        quizOptions: ['2口气', '3口气', '4口气', '5口气'],
        correctAnswer: 2,
        explanation: '正确！位于棋盘中央的单颗棋子有上、下、左、右4个方向的气，共4口气。',
      },
    ],
  },

  // ============================================================================
  // LESSON 2: 提子 (Capture)
  // ============================================================================
  {
    id: 'basic-2',
    title: '提子',
    description: '当棋子的气全部被堵住时，该棋子将被提走',
    category: 'basic',
    categoryName: '基础规则',
    difficulty: 1,
    duration: 15,
    progress: 0,
    steps: [
      {
        id: 'step-2-1',
        title: '提子规则',
        content: '当一方的棋子（或棋块）的所有气都被对方占据时，这些棋子将被从棋盘上提走。',
        type: 'explain',
        boardState: createEmptyBoard(9),
      },
      {
        id: 'step-2-2',
        title: '单颗棋子被提',
        content: '观察这个例子：白棋被黑棋包围，只剩最后一口气。',
        type: 'demonstrate',
        boardState: placeStones(createEmptyBoard(9), [
          { x: 4, y: 3, color: 'black' },
          { x: 4, y: 5, color: 'black' },
          { x: 3, y: 4, color: 'black' },
          { x: 5, y: 4, color: 'black' },
          { x: 4, y: 4, color: 'white' },
        ]),
        highlightPositions: [{ x: 4, y: 4 }],
        libertyLabels: [{ position: { x: 4, y: 4 }, count: 0 }],
      },
      {
        id: 'step-2-3',
        title: '执行提子',
        content: '白棋没有气了！现在黑棋在(4,4)落子，白棋被提走。',
        type: 'demonstrate',
        boardState: placeStones(createEmptyBoard(9), [
          { x: 4, y: 3, color: 'black' },
          { x: 4, y: 5, color: 'black' },
          { x: 3, y: 4, color: 'black' },
          { x: 5, y: 4, color: 'black' },
          { x: 4, y: 4, color: 'black' },
        ]),
        highlightPositions: [{ x: 4, y: 4 }],
        arrowPositions: [{ from: { x: 4, y: 4 }, to: { x: 4, y: 4 }, color: '#ef4444' }],
      },
      {
        id: 'step-2-4',
        title: '多颗棋子被提',
        content: '相连的棋子作为一个整体计算气。当这个整体没有气时，所有相连的棋子都被提走。',
        type: 'demonstrate',
        boardState: placeStones(createEmptyBoard(9), [
          { x: 3, y: 3, color: 'black' },
          { x: 4, y: 3, color: 'black' },
          { x: 5, y: 3, color: 'black' },
          { x: 3, y: 4, color: 'black' },
          { x: 5, y: 4, color: 'black' },
          { x: 3, y: 5, color: 'black' },
          { x: 4, y: 5, color: 'black' },
          { x: 5, y: 5, color: 'black' },
          { x: 4, y: 4, color: 'white' },
        ]),
        highlightPositions: [{ x: 4, y: 4 }],
      },
      {
        id: 'step-2-5',
        title: '互动练习',
        content: '白棋只剩一口气了！请在最后一口气上放置黑子，提走白棋。',
        type: 'interactive',
        boardState: placeStones(createEmptyBoard(9), [
          { x: 4, y: 3, color: 'black' },
          { x: 4, y: 5, color: 'black' },
          { x: 3, y: 4, color: 'black' },
          { x: 5, y: 4, color: 'black' },
          { x: 4, y: 4, color: 'white' },
        ]),
        highlightPositions: [{ x: 4, y: 4 }],
        expectedMoves: [{ x: 4, y: 4 }],
        interactivePrompt: '点击(4,4)位置放置黑子，提走白棋',
      },
    ],
  },

  // ============================================================================
  // LESSON 3: 禁着点 (Illegal Moves)
  // ============================================================================
  {
    id: 'basic-3',
    title: '禁着点',
    description: '了解不能落子的位置——禁着点',
    category: 'basic',
    categoryName: '基础规则',
    difficulty: 2,
    duration: 12,
    progress: 0,
    steps: [
      {
        id: 'step-3-1',
        title: '什么是禁着点',
        content: '禁着点是指落子后该棋子立即处于无气状态，且不能提走对方棋子的位置。',
        type: 'explain',
        boardState: createEmptyBoard(9),
      },
      {
        id: 'step-3-2',
        title: '禁着点示例',
        content: '观察这个形状：黑棋形成了一个"口袋"。白棋不能直接在口袋中落子，因为那样会立即没有气。',
        type: 'demonstrate',
        boardState: placeStones(createEmptyBoard(9), [
          { x: 3, y: 3, color: 'black' },
          { x: 4, y: 3, color: 'black' },
          { x: 5, y: 3, color: 'black' },
          { x: 3, y: 4, color: 'black' },
          { x: 5, y: 4, color: 'black' },
          { x: 3, y: 5, color: 'black' },
          { x: 4, y: 5, color: 'black' },
          { x: 5, y: 5, color: 'black' },
        ]),
        highlightPositions: [{ x: 4, y: 4 }],
      },
      {
        id: 'step-3-3',
        title: '例外情况',
        content: '但是，如果落子能提走对方棋子，那么这个位置就不是禁着点！',
        type: 'demonstrate',
        boardState: placeStones(createEmptyBoard(9), [
          { x: 3, y: 4, color: 'black' },
          { x: 5, y: 4, color: 'black' },
          { x: 4, y: 3, color: 'black' },
          { x: 4, y: 5, color: 'black' },
          { x: 4, y: 4, color: 'white' },
        ]),
        highlightPositions: [{ x: 4, y: 4 }],
        explanation: '白棋在(4,4)只有一口气。如果黑棋在(4,4)落子，可以提走白棋，所以这不是禁着点。',
      },
      {
        id: 'step-3-4',
        title: '小测验',
        content: '判断以下情况：',
        type: 'quiz',
        boardState: placeStones(createEmptyBoard(9), [
          { x: 3, y: 3, color: 'black' },
          { x: 5, y: 3, color: 'black' },
          { x: 3, y: 5, color: 'black' },
          { x: 5, y: 5, color: 'black' },
          { x: 4, y: 4, color: 'white' },
        ]),
        quizQuestion: '黑棋可以在(4,4)落子吗？',
        quizOptions: ['可以，能提子', '不可以，是禁着点', '不确定'],
        correctAnswer: 0,
        explanation: '正确！虽然(4,4)被包围，但落子后能提走中央的白棋，所以不是禁着点。',
      },
    ],
  },

  // ============================================================================
  // LESSON 4: 双打吃 (Double Atari)
  // ============================================================================
  {
    id: 'tactics-1',
    title: '双打吃',
    description: '学习最基本的吃子技巧——双打吃',
    category: 'tactics',
    categoryName: '战术技巧',
    difficulty: 2,
    duration: 20,
    progress: 0,
    steps: [
      {
        id: 'step-4-1',
        title: '双打吃原理',
        content: '双打吃是指一步棋同时威胁对方两块棋，使对方无法同时救两块棋。这是围棋中最基本的吃子技巧。',
        type: 'explain',
        boardState: createEmptyBoard(9),
      },
      {
        id: 'step-4-2',
        title: '双打吃示例',
        content: '观察这个局面：黑棋下在★位置，同时威胁左右两块白棋。白棋只能救一边，另一边会被吃掉！',
        type: 'demonstrate',
        boardState: placeStones(createEmptyBoard(9), [
          { x: 2, y: 4, color: 'white' },
          { x: 3, y: 4, color: 'white' },
          { x: 5, y: 4, color: 'white' },
          { x: 6, y: 4, color: 'white' },
          { x: 2, y: 3, color: 'black' },
          { x: 3, y: 3, color: 'black' },
          { x: 5, y: 3, color: 'black' },
          { x: 6, y: 3, color: 'black' },
          { x: 4, y: 4, color: 'black' },
        ]),
        highlightPositions: [{ x: 4, y: 4 }],
        arrowPositions: [
          { from: { x: 4, y: 4 }, to: { x: 2, y: 4 }, color: '#ef4444' },
          { from: { x: 4, y: 4 }, to: { x: 6, y: 4 }, color: '#ef4444' },
        ],
      },
      {
        id: 'step-4-3',
        title: '双打吃机会',
        content: '寻找双打吃机会：当对方有两块棋都只剩2口气，且共享一个空位时，就是双打吃的机会！',
        type: 'demonstrate',
        boardState: placeStones(createEmptyBoard(9), [
          { x: 2, y: 3, color: 'white' },
          { x: 3, y: 3, color: 'white' },
          { x: 5, y: 3, color: 'white' },
          { x: 6, y: 3, color: 'white' },
          { x: 2, y: 2, color: 'black' },
          { x: 3, y: 2, color: 'black' },
          { x: 5, y: 2, color: 'black' },
          { x: 6, y: 2, color: 'black' },
        ]),
        highlightPositions: [{ x: 4, y: 3 }],
      },
      {
        id: 'step-4-4',
        title: '互动练习',
        content: '找到双打吃的机会！黑棋应该下在哪里同时威胁两块白棋？',
        type: 'interactive',
        boardState: placeStones(createEmptyBoard(9), [
          { x: 2, y: 3, color: 'white' },
          { x: 3, y: 3, color: 'white' },
          { x: 5, y: 3, color: 'white' },
          { x: 6, y: 3, color: 'white' },
          { x: 2, y: 2, color: 'black' },
          { x: 3, y: 2, color: 'black' },
          { x: 5, y: 2, color: 'black' },
          { x: 6, y: 2, color: 'black' },
        ]),
        expectedMoves: [{ x: 4, y: 3 }],
        interactivePrompt: '点击(4,3)位置执行双打吃',
      },
      {
        id: 'step-4-5',
        title: '小测验',
        content: '双打吃的核心是什么？',
        type: 'quiz',
        boardState: createEmptyBoard(9),
        quizQuestion: '双打吃的核心战术思想是什么？',
        quizOptions: ['同时攻击两块棋', '包围对方', '占据角部', '连接自己的棋'],
        correctAnswer: 0,
        explanation: '正确！双打吃的关键是一步棋同时威胁对方两块棋，让对方无法兼顾。',
      },
    ],
  },

  // ============================================================================
  // LESSON 5: 征子 (Ladder)
  // ============================================================================
  {
    id: 'tactics-2',
    title: '征子',
    description: '掌握征子技巧，学会追杀对方棋子',
    category: 'tactics',
    categoryName: '战术技巧',
    difficulty: 3,
    duration: 25,
    progress: 0,
    steps: [
      {
        id: 'step-5-1',
        title: '征子方法',
        content: '征子是一种追杀对方棋子的方法，通过连续打吃将对方棋子赶向棋盘边缘。',
        type: 'explain',
        boardState: createEmptyBoard(9),
      },
      {
        id: 'step-5-2',
        title: '征子起始形状',
        content: '征子需要特定的形状：对方棋子只剩2口气，且呈对角线排列。',
        type: 'demonstrate',
        boardState: placeStones(createEmptyBoard(9), [
          { x: 3, y: 3, color: 'white' },
          { x: 4, y: 3, color: 'black' },
          { x: 2, y: 4, color: 'black' },
          { x: 3, y: 4, color: 'black' },
        ]),
        highlightPositions: [{ x: 3, y: 3 }],
        libertyLabels: [{ position: { x: 3, y: 3 }, count: 2 }],
      },
      {
        id: 'step-5-3',
        title: '征子过程',
        content: '黑棋在(4,4)打吃，白棋只能向边缘逃跑。黑棋继续追击...',
        type: 'demonstrate',
        boardState: placeStones(createEmptyBoard(9), [
          { x: 3, y: 3, color: 'white' },
          { x: 4, y: 3, color: 'black' },
          { x: 2, y: 4, color: 'black' },
          { x: 3, y: 4, color: 'black' },
          { x: 4, y: 4, color: 'black' },
        ]),
        arrowPositions: [{ from: { x: 4, y: 4 }, to: { x: 3, y: 3 }, color: '#ef4444' }],
      },
      {
        id: 'step-5-4',
        title: '征子成功',
        content: '最终白棋被赶到边缘，无处可逃，被全部提走！',
        type: 'demonstrate',
        boardState: placeStones(createEmptyBoard(9), [
          { x: 7, y: 0, color: 'white' },
          { x: 8, y: 0, color: 'black' },
          { x: 6, y: 1, color: 'black' },
          { x: 7, y: 1, color: 'black' },
          { x: 8, y: 1, color: 'black' },
        ]),
        highlightPositions: [{ x: 7, y: 0 }],
        libertyLabels: [{ position: { x: 7, y: 0 }, count: 1 }],
      },
      {
        id: 'step-5-5',
        title: '征子方向',
        content: '征子要将对方赶向边缘。注意：如果对方有援军，征子可能失败！',
        type: 'explain',
        boardState: placeStones(createEmptyBoard(9), [
          { x: 3, y: 3, color: 'white' },
          { x: 4, y: 3, color: 'black' },
          { x: 2, y: 4, color: 'black' },
          { x: 3, y: 4, color: 'black' },
          { x: 5, y: 5, color: 'white' },
        ]),
        highlightPositions: [{ x: 5, y: 5 }],
        explanation: '白棋在(5,5)有援军，如果黑棋征子，白棋可以逃跑并连接援军。',
      },
    ],
  },

  // ============================================================================
  // LESSON 6: 官子基础 (Endgame)
  // ============================================================================
  {
    id: 'endgame-1',
    title: '官子基础',
    description: '了解官子的概念和基本收官方法',
    category: 'endgame',
    categoryName: '官子入门',
    difficulty: 2,
    duration: 18,
    progress: 0,
    steps: [
      {
        id: 'step-6-1',
        title: '什么是官子',
        content: '官子是指对局后期，双方边界大致确定后，争夺剩余小利益的阶段。',
        type: 'explain',
        boardState: createEmptyBoard(9),
      },
      {
        id: 'step-6-2',
        title: '大官子示例',
        content: '这是常见的大官子形状。黑棋下在★位置，可以围住5目地盘。',
        type: 'demonstrate',
        boardState: placeStones(createEmptyBoard(9), [
          { x: 0, y: 0, color: 'black' },
          { x: 1, y: 0, color: 'black' },
          { x: 2, y: 0, color: 'black' },
          { x: 0, y: 1, color: 'black' },
          { x: 0, y: 2, color: 'black' },
          { x: 3, y: 1, color: 'white' },
          { x: 3, y: 2, color: 'white' },
          { x: 1, y: 3, color: 'white' },
          { x: 2, y: 3, color: 'white' },
        ]),
        highlightPositions: [{ x: 1, y: 1 }],
      },
      {
        id: 'step-6-3',
        title: '先手官子',
        content: '先手官子是指下完后对方必须应的棋。先手官子价值更高！',
        type: 'demonstrate',
        boardState: placeStones(createEmptyBoard(9), [
          { x: 4, y: 2, color: 'black' },
          { x: 5, y: 2, color: 'black' },
          { x: 6, y: 2, color: 'black' },
          { x: 4, y: 3, color: 'white' },
          { x: 5, y: 3, color: 'white' },
          { x: 6, y: 3, color: 'white' },
        ]),
        highlightPositions: [{ x: 4, y: 4 }, { x: 6, y: 4 }],
      },
      {
        id: 'step-6-4',
        title: '官子大小计算',
        content: '官子大小 = 己方获得的目数 + 对方失去的目数。双方增减的都要算！',
        type: 'explain',
        boardState: createEmptyBoard(9),
      },
    ],
  },

  // ============================================================================
  // NEW LESSON 7: 连接与分断 (Connection and Separation)
  // ============================================================================
  {
    id: 'basic-4',
    title: '连接与分断',
    description: '学习如何连接自己的棋和分断对方的棋',
    category: 'basic',
    categoryName: '基础规则',
    difficulty: 2,
    duration: 15,
    progress: 0,
    steps: [
      {
        id: 'step-7-1',
        title: '连接的重要性',
        content: '连接是指将两块或多块棋子连成一体。连接的棋子共享气，更不容易被吃。',
        type: 'explain',
        boardState: createEmptyBoard(9),
      },
      {
        id: 'step-7-2',
        title: '直接连接',
        content: '在相邻的空位落子，可以直接连接两块棋。',
        type: 'demonstrate',
        boardState: placeStones(createEmptyBoard(9), [
          { x: 3, y: 4, color: 'black' },
          { x: 5, y: 4, color: 'black' },
        ]),
        highlightPositions: [{ x: 4, y: 4 }],
        explanation: '黑棋在(4,4)落子，两块黑棋就连成一体了。',
      },
      {
        id: 'step-7-3',
        title: '分断对方',
        content: '在对方两块棋之间落子，可以阻止它们连接，这叫"分断"。',
        type: 'demonstrate',
        boardState: placeStones(createEmptyBoard(9), [
          { x: 3, y: 4, color: 'white' },
          { x: 5, y: 4, color: 'white' },
          { x: 4, y: 4, color: 'black' },
        ]),
        highlightPositions: [{ x: 4, y: 4 }],
        explanation: '黑棋占据(4,4)，成功分断了两块白棋！',
      },
      {
        id: 'step-7-4',
        title: '虎口连接',
        content: '虎口是一种特殊的连接方式。棋子下在虎口内会被立即提走，所以对方不敢下。',
        type: 'demonstrate',
        boardState: placeStones(createEmptyBoard(9), [
          { x: 3, y: 3, color: 'black' },
          { x: 5, y: 3, color: 'black' },
          { x: 4, y: 4, color: 'black' },
        ]),
        highlightPositions: [{ x: 4, y: 3 }],
        explanation: '(4,3)就是虎口。白棋如果下在这里，会被立即提走。',
      },
      {
        id: 'step-7-5',
        title: '互动练习',
        content: '白棋试图连接！请黑棋下在关键位置分断白棋。',
        type: 'interactive',
        boardState: placeStones(createEmptyBoard(9), [
          { x: 3, y: 4, color: 'white' },
          { x: 5, y: 4, color: 'white' },
        ]),
        expectedMoves: [{ x: 4, y: 4 }],
        interactivePrompt: '点击(4,4)位置分断白棋',
      },
    ],
  },

  // ============================================================================
  // NEW LESSON 8: 眼的概念 (Eyes)
  // ============================================================================
  {
    id: 'basic-5',
    title: '眼的概念',
    description: '学习什么是眼，以及眼在围棋中的重要性',
    category: 'basic',
    categoryName: '基础规则',
    difficulty: 2,
    duration: 18,
    progress: 0,
    steps: [
      {
        id: 'step-8-1',
        title: '什么是眼',
        content: '眼是指由己方棋子包围的空白交叉点。眼是棋子生存的基础。',
        type: 'explain',
        boardState: createEmptyBoard(9),
      },
      {
        id: 'step-8-2',
        title: '真眼与假眼',
        content: '真眼是指对方无法破坏的眼。角上需要3子、边上需要4子、中央需要5子才能形成真眼。观察角上的真眼：(1,1)位置是空点，被3颗黑子包围。',
        type: 'demonstrate',
        boardState: placeStones(createEmptyBoard(9), [
          { x: 0, y: 1, color: 'black' },
          { x: 1, y: 0, color: 'black' },
          { x: 1, y: 1, color: 'black' },
        ]),
        highlightPositions: [{ x: 0, y: 0 }],
        explanation: '角上的真眼：(0,0)是空的，被3颗黑子包围，形成真眼。',
      },
      {
        id: 'step-8-3',
        title: '边上的眼',
        content: '边上需要4颗棋子才能形成真眼。',
        type: 'demonstrate',
        boardState: placeStones(createEmptyBoard(9), [
          { x: 3, y: 0, color: 'black' },
          { x: 4, y: 0, color: 'black' },
          { x: 5, y: 0, color: 'black' },
          { x: 3, y: 1, color: 'black' },
          { x: 5, y: 1, color: 'black' },
        ]),
        highlightPositions: [{ x: 4, y: 1 }],
      },
      {
        id: 'step-8-4',
        title: '中央的眼',
        content: '中央需要5颗棋子才能形成真眼。',
        type: 'demonstrate',
        boardState: placeStones(createEmptyBoard(9), [
          { x: 3, y: 3, color: 'black' },
          { x: 5, y: 3, color: 'black' },
          { x: 3, y: 5, color: 'black' },
          { x: 5, y: 5, color: 'black' },
          { x: 4, y: 4, color: 'black' },
        ]),
        highlightPositions: [{ x: 4, y: 4 }],
      },
      {
        id: 'step-8-5',
        title: '假眼的危险',
        content: '假眼看起来像是眼，但对方可以破坏它。只有真眼才能保证活棋。',
        type: 'demonstrate',
        boardState: placeStones(createEmptyBoard(9), [
          { x: 3, y: 3, color: 'black' },
          { x: 5, y: 3, color: 'black' },
          { x: 3, y: 5, color: 'black' },
          { x: 4, y: 4, color: 'black' },
        ]),
        highlightPositions: [{ x: 4, y: 4 }],
        explanation: '这不是真眼！白棋可以在(5,5)和(4,5)破坏这个眼。',
      },
    ],
  },

  // ============================================================================
  // NEW LESSON 9: 活棋与死棋 (Life and Death)
  // ============================================================================
  {
    id: 'basic-6',
    title: '活棋与死棋',
    description: '学习如何判断棋块的死活',
    category: 'basic',
    categoryName: '基础规则',
    difficulty: 3,
    duration: 20,
    progress: 0,
    steps: [
      {
        id: 'step-9-1',
        title: '活棋的条件',
        content: '活棋是指无法被对方杀死的棋块。活棋需要至少两个真眼。',
        type: 'explain',
        boardState: createEmptyBoard(9),
      },
      {
        id: 'step-9-2',
        title: '两眼活棋',
        content: '这是最简单的活棋形状：黑棋围成了两个独立的眼（两个空点）。有两个眼的棋块是活棋。',
        type: 'demonstrate',
        boardState: placeStones(createEmptyBoard(9), [
          { x: 2, y: 3, color: 'black' },
          { x: 3, y: 3, color: 'black' },
          { x: 4, y: 3, color: 'black' },
          { x: 5, y: 3, color: 'black' },
          { x: 6, y: 3, color: 'black' },
          { x: 2, y: 4, color: 'black' },
          { x: 4, y: 4, color: 'black' },
          { x: 6, y: 4, color: 'black' },
          { x: 2, y: 5, color: 'black' },
          { x: 3, y: 5, color: 'black' },
          { x: 4, y: 5, color: 'black' },
          { x: 5, y: 5, color: 'black' },
          { x: 6, y: 5, color: 'black' },
        ]),
        highlightPositions: [{ x: 3, y: 4 }, { x: 5, y: 4 }],
        explanation: '黑棋有两个眼：(3,4)和(5,4)。有两个眼的棋块是活棋！',
      },
      {
        id: 'step-9-3',
        title: '死棋示例',
        content: '这块白棋只有一个眼（中心空点），是死棋。黑棋可以下在中心将其提走。',
        type: 'demonstrate',
        boardState: placeStones(createEmptyBoard(9), [
          { x: 3, y: 3, color: 'white' },
          { x: 4, y: 3, color: 'white' },
          { x: 5, y: 3, color: 'white' },
          { x: 3, y: 4, color: 'white' },
          { x: 5, y: 4, color: 'white' },
          { x: 3, y: 5, color: 'white' },
          { x: 4, y: 5, color: 'white' },
          { x: 5, y: 5, color: 'white' },
        ]),
        highlightPositions: [{ x: 4, y: 4 }],
        explanation: '白棋只有一个眼（中心空点），是死棋。',
      },
      {
        id: 'step-9-4',
        title: '双活',
        content: '双活是指双方都没有两个眼，但谁也无法杀死对方的情况。',
        type: 'demonstrate',
        boardState: placeStones(createEmptyBoard(9), [
          { x: 3, y: 3, color: 'black' },
          { x: 4, y: 3, color: 'black' },
          { x: 5, y: 3, color: 'black' },
          { x: 3, y: 4, color: 'black' },
          { x: 5, y: 4, color: 'white' },
          { x: 3, y: 5, color: 'white' },
          { x: 4, y: 5, color: 'white' },
          { x: 5, y: 5, color: 'white' },
        ]),
        highlightPositions: [{ x: 4, y: 4 }],
        explanation: '中间的(4,4)是双方共享的"公气"。这是双活！',
      },
      {
        id: 'step-9-5',
        title: '小测验',
        content: '判断以下棋块的死活：',
        type: 'quiz',
        boardState: placeStones(createEmptyBoard(9), [
          { x: 3, y: 3, color: 'black' },
          { x: 4, y: 3, color: 'black' },
          { x: 5, y: 3, color: 'black' },
          { x: 3, y: 4, color: 'black' },
          { x: 5, y: 4, color: 'black' },
          { x: 3, y: 5, color: 'black' },
          { x: 4, y: 5, color: 'black' },
          { x: 5, y: 5, color: 'black' },
        ]),
        quizQuestion: '这块黑棋是活棋还是死棋？',
        quizOptions: ['活棋', '死棋', '不确定'],
        correctAnswer: 0,
        explanation: '正确！这块黑棋有两个眼，是活棋。',
      },
    ],
  },

  // ============================================================================
  // NEW LESSON 10: 打劫规则 (Ko)
  // ============================================================================
  {
    id: 'basic-7',
    title: '打劫规则',
    description: '学习围棋中特殊的打劫规则',
    category: 'basic',
    categoryName: '基础规则',
    difficulty: 2,
    duration: 15,
    progress: 0,
    steps: [
      {
        id: 'step-10-1',
        title: '什么是打劫',
        content: '打劫是指双方可以互相提子的循环局面。为了防止无限循环，围棋有特殊规则。',
        type: 'explain',
        boardState: createEmptyBoard(9),
      },
      {
        id: 'step-10-2',
        title: '打劫的形状',
        content: '这是典型的打劫形状。黑棋提走白棋后，白棋不能立即提回来。',
        type: 'demonstrate',
        boardState: placeStones(createEmptyBoard(9), [
          { x: 3, y: 4, color: 'black' },
          { x: 5, y: 4, color: 'black' },
          { x: 4, y: 3, color: 'black' },
          { x: 4, y: 5, color: 'black' },
          { x: 4, y: 4, color: 'white' },
        ]),
        highlightPositions: [{ x: 4, y: 4 }],
        libertyLabels: [{ position: { x: 4, y: 4 }, count: 1 }],
      },
      {
        id: 'step-10-3',
        title: '提子后',
        content: '黑棋提走白棋后，这个位置就是"打劫"。',
        type: 'demonstrate',
        boardState: placeStones(createEmptyBoard(9), [
          { x: 3, y: 4, color: 'black' },
          { x: 5, y: 4, color: 'black' },
          { x: 4, y: 3, color: 'black' },
          { x: 4, y: 5, color: 'black' },
          { x: 4, y: 4, color: 'black' },
        ]),
        highlightPositions: [{ x: 4, y: 4 }],
        explanation: '黑棋提子后，白棋不能立即在(4,4)提回来！',
      },
      {
        id: 'step-10-4',
        title: '打劫规则',
        content: '打劫规则：一方提子后，对方不能立即提回来，必须先在别处下一手（找劫材）。',
        type: 'explain',
        boardState: createEmptyBoard(9),
      },
      {
        id: 'step-10-5',
        title: '找劫材',
        content: '白棋需要在棋盘别处下一手，如果黑棋应，白棋才能提回打劫。',
        type: 'demonstrate',
        boardState: placeStones(createEmptyBoard(9), [
          { x: 3, y: 4, color: 'black' },
          { x: 5, y: 4, color: 'black' },
          { x: 4, y: 3, color: 'black' },
          { x: 4, y: 5, color: 'black' },
          { x: 4, y: 4, color: 'black' },
          { x: 7, y: 7, color: 'white' },
        ]),
        highlightPositions: [{ x: 7, y: 7 }],
        explanation: '白棋在(7,7)找劫材。如果黑棋应，白棋就能提回打劫。',
      },
    ],
  },

  // ============================================================================
  // NEW LESSON 11: 布局基础 (Opening)
  // ============================================================================
  {
    id: 'opening-1',
    title: '布局基础',
    description: '学习围棋开局的常见下法和原则',
    category: 'opening',
    categoryName: '布局入门',
    difficulty: 2,
    duration: 22,
    progress: 0,
    steps: [
      {
        id: 'step-11-1',
        title: '角部优先',
        content: '围棋开局通常从角部开始。角部最容易围地，也最容易做活。',
        type: 'explain',
        boardState: createEmptyBoard(9),
      },
      {
        id: 'step-11-2',
        title: '星位',
        content: '星位是角部的重要位置。下在星位可以兼顾两边的发展。',
        type: 'demonstrate',
        boardState: placeStone(createEmptyBoard(9), 2, 2, 'black'),
        highlightPositions: [{ x: 2, y: 2 }],
        explanation: '黑棋下在星位(3,3)，可以向右和向下两个方向发展。',
      },
      {
        id: 'step-11-3',
        title: '小目',
        content: '小目是另一个重要的角部位置，更注重实地。',
        type: 'demonstrate',
        boardState: placeStone(createEmptyBoard(9), 2, 3, 'black'),
        highlightPositions: [{ x: 2, y: 3 }],
        explanation: '小目(3,4)比星位更靠近边，更容易围取实地。',
      },
      {
        id: 'step-11-4',
        title: '开局顺序',
        content: '通常开局顺序是：占角 → 守角/挂角 → 拆边。',
        type: 'demonstrate',
        boardState: placeStones(createEmptyBoard(9), [
          { x: 2, y: 2, color: 'black' },
          { x: 6, y: 2, color: 'white' },
          { x: 2, y: 6, color: 'black' },
          { x: 6, y: 6, color: 'white' },
        ]),
        highlightPositions: [{ x: 2, y: 2 }, { x: 6, y: 2 }, { x: 2, y: 6 }, { x: 6, y: 6 }],
        explanation: '双方各占两个角，这是常见的开局。',
      },
      {
        id: 'step-11-5',
        title: '布局原则',
        content: '布局三原则：\n1. 先占角\n2. 再占边\n3. 最后进入中腹',
        type: 'explain',
        boardState: createEmptyBoard(9),
      },
      {
        id: 'step-11-6',
        title: '小测验',
        content: '测试你对布局的理解：',
        type: 'quiz',
        boardState: createEmptyBoard(9),
        quizQuestion: '围棋开局应该先从哪个位置开始？',
        quizOptions: ['角部', '边部', '中央', '都可以'],
        correctAnswer: 0,
        explanation: '正确！角部最容易围地和做活，所以开局通常从角部开始。',
      },
    ],
  },
];

// ============================================================================
// CATEGORIES CONFIGURATION
// ============================================================================

const categories = [
  { id: 'basic', name: '基础规则', icon: BookOpen, color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { id: 'tactics', name: '战术技巧', icon: Target, color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { id: 'endgame', name: '官子入门', icon: Award, color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { id: 'opening', name: '布局入门', icon: Lightbulb, color: 'bg-blue-100 text-blue-700 border-blue-200' },
];

// ============================================================================
// INTERACTIVE BOARD COMPONENT
// ============================================================================

interface InteractiveBoardProps {
  size?: number;
  boardState: BoardState;
  highlightPositions?: Position[];
  arrowPositions?: { from: Position; to: Position; color?: string }[];
  libertyLabels?: { position: Position; count: number }[];
  onCellClick?: (position: Position) => void;
  interactive?: boolean;
  currentPlayer?: 'black' | 'white';
  lastMove?: Position | null;
  showCoordinates?: boolean;
}

function InteractiveBoard({
  size = 9,
  boardState,
  highlightPositions = [],
  arrowPositions = [],
  libertyLabels = [],
  onCellClick,
  interactive = false,
  currentPlayer = 'black',
  lastMove = null,
  showCoordinates = true,
}: InteractiveBoardProps) {
  const [hoverPosition, setHoverPosition] = useState<Position | null>(null);
  const [animatedStones, setAnimatedStones] = useState<Set<string>>(new Set());

  const cellSize = 36;
  const stoneSize = cellSize - 4;
  const gridSize = (size - 1) * cellSize;
  const boardPixelSize = gridSize + cellSize;

  useEffect(() => {
    const newStones = new Set<string>();
    boardState.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          newStones.add(`${x}-${y}`);
        }
      });
    });
    setAnimatedStones(newStones);
  }, [boardState]);

  const isHighlighted = (x: number, y: number) => {
    return highlightPositions.some(pos => pos.x === x && pos.y === y);
  };

  const getLibertyLabel = (x: number, y: number) => {
    return libertyLabels.find(l => l.position.x === x && l.position.y === y);
  };

  const COLUMN_LABELS = 'ABCDEFGHJKLMNOPQRST';
  const columns = COLUMN_LABELS.slice(0, size).split('');
  const rows = Array.from({ length: size }, (_, i) => size - i);

  return (
    <div className="flex flex-col items-center">
      {showCoordinates && (
        <div className="flex justify-between mb-1" style={{ width: gridSize }}>
          {columns.map((col) => (
            <span key={`top-${col}`} className="text-xs font-medium text-stone-600 select-none w-4 text-center">
              {col}
            </span>
          ))}
        </div>
      )}

      <div className="flex">
        {showCoordinates && (
          <div className="flex flex-col justify-between pr-1" style={{ height: gridSize }}>
            {rows.map((row) => (
              <span key={`left-${row}`} className="text-xs font-medium text-stone-600 select-none h-4 flex items-center">
                {row}
              </span>
            ))}
          </div>
        )}

        <div
          className="relative rounded-lg shadow-lg overflow-hidden"
          style={{
            width: boardPixelSize,
            height: boardPixelSize,
            background: 'linear-gradient(135deg, #dcb35c 0%, #c4a035 100%)',
          }}
        >
          <svg
            className="absolute pointer-events-none"
            style={{
              left: cellSize / 2,
              top: cellSize / 2,
              width: gridSize,
              height: gridSize,
            }}
          >
            {Array.from({ length: size }).map((_, i) => (
              <g key={i}>
                <line
                  x1={0}
                  y1={i * cellSize}
                  x2={gridSize}
                  y2={i * cellSize}
                  stroke="#5c4a3d"
                  strokeWidth={1}
                />
                <line
                  x1={i * cellSize}
                  y1={0}
                  x2={i * cellSize}
                  y2={gridSize}
                  stroke="#5c4a3d"
                  strokeWidth={1}
                />
              </g>
            ))}
            {size === 9 && (
              <>
                <circle cx={2 * cellSize} cy={2 * cellSize} r={3} fill="#5c4a3d" />
                <circle cx={4 * cellSize} cy={2 * cellSize} r={3} fill="#5c4a3d" />
                <circle cx={6 * cellSize} cy={2 * cellSize} r={3} fill="#5c4a3d" />
                <circle cx={2 * cellSize} cy={4 * cellSize} r={3} fill="#5c4a3d" />
                <circle cx={4 * cellSize} cy={4 * cellSize} r={3} fill="#5c4a3d" />
                <circle cx={6 * cellSize} cy={4 * cellSize} r={3} fill="#5c4a3d" />
                <circle cx={2 * cellSize} cy={6 * cellSize} r={3} fill="#5c4a3d" />
                <circle cx={4 * cellSize} cy={6 * cellSize} r={3} fill="#5c4a3d" />
                <circle cx={6 * cellSize} cy={6 * cellSize} r={3} fill="#5c4a3d" />
              </>
            )}
            {arrowPositions.map((arrow, idx) => (
              <g key={`arrow-${idx}`}>
                <defs>
                  <marker id={`arrowhead-${idx}`} markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill={arrow.color || '#ef4444'} />
                  </marker>
                </defs>
                <line
                  x1={arrow.from.x * cellSize}
                  y1={arrow.from.y * cellSize}
                  x2={arrow.to.x * cellSize}
                  y2={arrow.to.y * cellSize}
                  stroke={arrow.color || '#ef4444'}
                  strokeWidth={2}
                  markerEnd={`url(#arrowhead-${idx})`}
                  opacity={0.8}
                />
              </g>
            ))}
          </svg>

          {Array.from({ length: size }).map((_, y) =>
            Array.from({ length: size }).map((_, x) => {
              const stone = boardState[y]?.[x];
              const isHovered = hoverPosition?.x === x && hoverPosition?.y === y;
              const isEmpty = !stone;
              const highlighted = isHighlighted(x, y);
              const libertyLabel = getLibertyLabel(x, y);
              const isLastMoveCell = lastMove?.x === x && lastMove?.y === y;

              return (
                <div
                  key={`cell-${x}-${y}`}
                  className={`absolute flex items-center justify-center ${interactive && isEmpty ? 'cursor-pointer' : ''}`}
                  style={{
                    left: x * cellSize,
                    top: y * cellSize,
                    width: cellSize,
                    height: cellSize,
                  }}
                  onMouseEnter={() => interactive && isEmpty && setHoverPosition({ x, y })}
                  onMouseLeave={() => setHoverPosition(null)}
                  onClick={() => interactive && onCellClick?.({ x, y })}
                >
                  {highlighted && (
                    <div
                      className="absolute rounded-full border-2 border-red-500 animate-pulse"
                      style={{
                        width: cellSize - 8,
                        height: cellSize - 8,
                      }}
                    />
                  )}

                  {stone && (
                    <div
                      className={`absolute rounded-full shadow-md transition-all duration-300 ${
                        stone === 'black'
                          ? 'bg-gradient-to-br from-gray-600 to-gray-900'
                          : 'bg-gradient-to-br from-white to-gray-200 border border-gray-300'
                      }`}
                      style={{
                        width: stoneSize,
                        height: stoneSize,
                        animation: animatedStones.has(`${x}-${y}`) ? 'stonePlace 0.3s ease-out' : undefined,
                      }}
                    />
                  )}

                  {interactive && isHovered && !stone && (
                    <div
                      className={`absolute rounded-full opacity-40 ${
                        currentPlayer === 'black'
                          ? 'bg-gradient-to-br from-gray-600 to-gray-900'
                          : 'bg-gradient-to-br from-white to-gray-200 border border-gray-300'
                      }`}
                      style={{
                        width: stoneSize,
                        height: stoneSize,
                      }}
                    />
                  )}

                  {isLastMoveCell && stone && (
                    <div
                      className={`absolute rounded-full border-2 ${
                        stone === 'black' ? 'border-red-400' : 'border-red-500'
                      }`}
                      style={{
                        width: stoneSize * 0.5,
                        height: stoneSize * 0.5,
                      }}
                    />
                  )}

                  {libertyLabel && (
                    <div
                      className="absolute flex items-center justify-center text-xs font-bold text-red-600 bg-white/90 rounded-full shadow-sm"
                      style={{
                        width: 18,
                        height: 18,
                        top: -8,
                        right: -8,
                      }}
                    >
                      {libertyLabel.count}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {showCoordinates && (
          <div className="flex flex-col justify-between pl-1" style={{ height: gridSize }}>
            {rows.map((row) => (
              <span key={`right-${row}`} className="text-xs font-medium text-stone-600 select-none h-4 flex items-center">
                {row}
              </span>
            ))}
          </div>
        )}
      </div>

      {showCoordinates && (
        <div className="flex justify-between mt-1" style={{ width: gridSize }}>
          {columns.map((col) => (
            <span key={`bottom-${col}`} className="text-xs font-medium text-stone-600 select-none w-4 text-center">
              {col}
            </span>
          ))}
        </div>
      )}

      <style>{`
        @keyframes stonePlace {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ============================================================================
// QUIZ COMPONENT
// ============================================================================

// ============================================================================
// QUIZ COMPONENT
// ============================================================================

interface QuizComponentProps {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  onComplete: (correct: boolean) => void;
}

function QuizComponent({ question, options, correctAnswer, explanation, onComplete }: QuizComponentProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (idx: number) => {
    if (showResult) return;
    setSelected(idx);
  };

  const handleSubmit = () => {
    if (selected === null) return;
    setShowResult(true);
    onComplete(selected === correctAnswer);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
        <HelpCircle className="w-5 h-5 text-amber-500" />
        {question}
      </h3>

      <div className="space-y-2">
        {options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleSelect(idx)}
            disabled={showResult}
            className={`w-full p-3 text-left rounded-lg border-2 transition-all ${
              selected === idx
                ? showResult
                  ? idx === correctAnswer
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-red-500 bg-red-50'
                  : 'border-amber-500 bg-amber-50'
                : showResult && idx === correctAnswer
                ? 'border-emerald-500 bg-emerald-50'
                : 'border-slate-200 hover:border-amber-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                  selected === idx
                    ? showResult
                      ? idx === correctAnswer
                        ? 'bg-emerald-500 text-white'
                        : 'bg-red-500 text-white'
                      : 'bg-amber-500 text-white'
                    : showResult && idx === correctAnswer
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {String.fromCharCode(65 + idx)}
              </div>
              <span className="text-slate-700">{option}</span>
              {showResult && idx === correctAnswer && (
                <CheckCircle className="w-5 h-5 text-emerald-500 ml-auto" />
              )}
              {showResult && selected === idx && idx !== correctAnswer && (
                <span className="text-red-500 ml-auto text-sm">✗</span>
              )}
            </div>
          </button>
        ))}
      </div>

      {!showResult ? (
        <button
          onClick={handleSubmit}
          disabled={selected === null}
          className="w-full py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
        >
          提交答案
        </button>
      ) : (
        <div className={`p-4 rounded-lg ${selected === correctAnswer ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'}`}>
          <p className="text-slate-700">
            <span className="font-semibold">
              {selected === correctAnswer ? '✓ 回答正确！' : '✗ 回答错误'}
            </span>
          </p>
          <p className="text-slate-600 mt-2">{explanation}</p>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// LESSON LIST VIEW
// ============================================================================

function LessonList({ onSelectLesson }: { onSelectLesson: (lessonId: string) => void }) {
  const lessonsByCategory = categories.map(cat => ({
    ...cat,
    lessons: lessons.filter(l => l.category === cat.id),
  }));

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">课程学习</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          从基础规则到高级战术，循序渐进掌握围棋精髓
        </p>
      </div>

      {lessonsByCategory.map(category => (
        <section key={category.id} className="space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-10 h-10 rounded-lg ${category.color} flex items-center justify-center`}>
              <category.icon className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">{category.name}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {category.lessons.map(lesson => (
              <button
                key={lesson.id}
                onClick={() => onSelectLesson(lesson.id)}
                className="group text-left p-5 bg-white rounded-xl border border-slate-200 hover:border-amber-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-slate-900 group-hover:text-amber-600 transition-colors">
                    {lesson.title}
                  </h3>
                  {lesson.progress === 100 ? (
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  ) : lesson.progress > 0 ? (
                    <Circle className="w-5 h-5 text-amber-500" />
                  ) : (
                    <Play className="w-5 h-5 text-slate-400" />
                  )}
                </div>
                <p className="text-sm text-slate-600 mb-4 line-clamp-2">{lesson.description}</p>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <span className="font-medium">难度:</span>
                    {'★'.repeat(lesson.difficulty)}{'☆'.repeat(3 - lesson.difficulty)}
                  </span>
                  <span>{lesson.duration}分钟</span>
                </div>
                {lesson.progress > 0 && lesson.progress < 100 && (
                  <div className="mt-3">
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all"
                        style={{ width: `${lesson.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

// ============================================================================
// LESSON DETAIL VIEW
// ============================================================================

function LessonDetail({ lessonId, onBack }: { lessonId: string; onBack: () => void }) {
  const lesson = lessons.find(l => l.id === lessonId);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [interactiveBoard, setInteractiveBoard] = useState<BoardState>(createEmptyBoard(9));
  const [lastMove, setLastMove] = useState<Position | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    setCurrentStepIndex(0);
    setQuizCompleted(false);
    setFeedback(null);
  }, [lessonId]);

  useEffect(() => {
    if (lesson) {
      const step = lesson.steps[currentStepIndex];
      setInteractiveBoard(cloneBoard(step.boardState));
      setLastMove(null);
      setFeedback(null);
    }
  }, [lesson, currentStepIndex]);

  if (!lesson) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">课程未找到</p>
        <button onClick={onBack} className="mt-4 text-amber-600 hover:text-amber-700">
          返回课程列表
        </button>
      </div>
    );
  }

  const currentStep = lesson.steps[currentStepIndex];
  const progressPercent = ((currentStepIndex + 1) / lesson.steps.length) * 100;

  const handleNext = () => {
    if (currentStepIndex < lesson.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      setQuizCompleted(false);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      setQuizCompleted(false);
    }
  };

  const handleCellClick = (position: Position) => {
    if (currentStep.type !== 'interactive') return;

    const newBoard = placeStone(interactiveBoard, position.x, position.y, 'black');
    setInteractiveBoard(newBoard);
    setLastMove(position);

    // Check if move matches expected moves
    if (currentStep.expectedMoves) {
      const isCorrect = currentStep.expectedMoves.some(
        move => move.x === position.x && move.y === position.y
      );
      if (isCorrect) {
        setFeedback('✓ 正确！');
      } else {
        setFeedback('再试试看，这个位置不太对...');
      }
    }
  };

  const handleQuizComplete = (_correct: boolean) => {
    setQuizCompleted(true);
  };

  const resetInteractiveBoard = () => {
    setInteractiveBoard(cloneBoard(currentStep.boardState));
    setLastMove(null);
    setFeedback(null);
  };

  const getStepTypeLabel = (type: LessonStepType) => {
    switch (type) {
      case 'explain': return '讲解';
      case 'demonstrate': return '演示';
      case 'interactive': return '练习';
      case 'quiz': return '测验';
    }
  };

  const getStepTypeColor = (type: LessonStepType) => {
    switch (type) {
      case 'explain': return 'bg-blue-100 text-blue-700';
      case 'demonstrate': return 'bg-purple-100 text-purple-700';
      case 'interactive': return 'bg-amber-100 text-amber-700';
      case 'quiz': return 'bg-emerald-100 text-emerald-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{lesson.title}</h1>
          <p className="text-sm text-slate-500">{lesson.categoryName}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">
            步骤 {currentStepIndex + 1} / {lesson.steps.length}
          </span>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStepTypeColor(currentStep.type)}`}>
              {getStepTypeLabel(currentStep.type)}
            </span>
            <span className="text-sm text-slate-500">{Math.round(progressPercent)}%</span>
          </div>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-500 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Text Content */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">{currentStep.title}</h2>
          <p className="text-slate-600 leading-relaxed whitespace-pre-line">{currentStep.content}</p>

          {currentStep.explanation && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-800 text-sm flex items-start gap-2">
                <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0" />
                {currentStep.explanation}
              </p>
            </div>
          )}

          {currentStep.type === 'interactive' && currentStep.interactivePrompt && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm flex items-start gap-2">
                <Target className="w-4 h-4 mt-0.5 flex-shrink-0" />
                {currentStep.interactivePrompt}
              </p>
            </div>
          )}

          {feedback && (
            <div className={`mt-4 p-3 rounded-lg ${
              feedback.startsWith('✓') ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {feedback}
            </div>
          )}

          {currentStep.type === 'quiz' && currentStep.quizQuestion && currentStep.quizOptions && (
            <div className="mt-6">
              <QuizComponent
                question={currentStep.quizQuestion}
                options={currentStep.quizOptions}
                correctAnswer={currentStep.correctAnswer || 0}
                explanation={currentStep.explanation || ''}
                onComplete={handleQuizComplete}
              />
            </div>
          )}
        </div>

        {/* Board */}
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col items-center">
          <InteractiveBoard
            size={9}
            boardState={currentStep.type === 'interactive' ? interactiveBoard : currentStep.boardState}
            highlightPositions={currentStep.highlightPositions}
            arrowPositions={currentStep.arrowPositions}
            libertyLabels={currentStep.libertyLabels}
            onCellClick={handleCellClick}
            interactive={currentStep.type === 'interactive'}
            currentPlayer="black"
            lastMove={lastMove}
          />

          {currentStep.type === 'interactive' && (
            <button
              onClick={resetInteractiveBoard}
              className="mt-4 flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              重置棋盘
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={handlePrevious}
          disabled={currentStepIndex === 0}
          className="inline-flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          上一步
        </button>

        <div className="flex gap-2">
          {lesson.steps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStepIndex(idx)}
              className={`w-2 h-2 rounded-full transition-colors ${
                idx === currentStepIndex ? 'bg-amber-500' : 'bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={currentStepIndex === lesson.steps.length - 1 || (currentStep.type === 'quiz' && !quizCompleted)}
          className="inline-flex items-center gap-2 px-6 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
        >
          {currentStepIndex === lesson.steps.length - 1 ? '完成' : '下一步'}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN LEARN COMPONENT
// ============================================================================

export default function Learn() {
  const { lessonId } = useParams<{ lessonId?: string }>();
  const navigate = useNavigate();

  const handleSelectLesson = (id: string) => {
    navigate(`/learn/${id}`);
  };

  const handleBack = () => {
    navigate('/learn');
  };

  if (lessonId) {
    return <LessonDetail lessonId={lessonId} onBack={handleBack} />;
  }

  return <LessonList onSelectLesson={handleSelectLesson} />;
}
