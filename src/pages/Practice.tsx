import { useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import type { Puzzle } from '../types/puzzle'
import type { Position, BoardState } from '../types/game'
import { STAR_POINTS } from '../types/game'
import { allPuzzles } from '../data/puzzles'

const puzzles = allPuzzles

// ============================================================================
// PUZZLE BOARD COMPONENT - Renders stones at intersections
// ============================================================================

function PuzzleBoard({
  boardSize,
  boardState,
  onCellClick,
  lastMove,
  currentPlayer,
}: {
  boardSize: number
  boardState: BoardState
  onCellClick: (position: Position) => void
  lastMove?: Position | null
  currentPlayer: 'black' | 'white'
}) {
  const [hoverPosition, setHoverPosition] = useState<Position | null>(null)

  const cellSize = 36
  const stoneSize = cellSize - 4
  const gridSize = (boardSize - 1) * cellSize
  const boardPixelSize = gridSize + cellSize

  const isLastMove = useCallback(
    (x: number, y: number) => lastMove?.x === x && lastMove?.y === y,
    [lastMove]
  )

  return (
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
        {Array.from({ length: boardSize }).map((_, i) => (
          <g key={i}>
            <line
              x1={0}
              y1={i * cellSize}
              x2={gridSize}
              y2={i * cellSize}
              stroke="#5c4a3d"
              strokeWidth="1"
            />
            <line
              x1={i * cellSize}
              y1={0}
              x2={i * cellSize}
              y2={gridSize}
              stroke="#5c4a3d"
              strokeWidth="1"
            />
          </g>
        ))}
        {STAR_POINTS[boardSize]?.map((point) => (
          <circle
            key={`star-${point.x}-${point.y}`}
            cx={point.x * cellSize}
            cy={point.y * cellSize}
            r={3}
            fill="#5c4a3d"
          />
        ))}
      </svg>

      {Array.from({ length: boardSize }).map((_, y) =>
        Array.from({ length: boardSize }).map((_, x) => {
          const stone = boardState[y]?.[x]
          const isHovered = hoverPosition?.x === x && hoverPosition?.y === y
          const isEmpty = !stone

          return (
            <div
              key={`cell-${x}-${y}`}
              className="absolute flex items-center justify-center cursor-pointer"
              style={{
                left: x * cellSize,
                top: y * cellSize,
                width: cellSize,
                height: cellSize,
              }}
              onMouseEnter={() => isEmpty && setHoverPosition({ x, y })}
              onMouseLeave={() => setHoverPosition(null)}
              onClick={() => isEmpty && onCellClick({ x, y })}
            >
              {stone && (
                <div
                  className={`absolute rounded-full shadow-md transition-all duration-150 ${
                    stone === 'black'
                      ? 'bg-gradient-to-br from-gray-600 to-gray-900'
                      : 'bg-gradient-to-br from-white to-gray-200 border border-gray-300'
                  }`}
                  style={{
                    width: stoneSize,
                    height: stoneSize,
                  }}
                />
              )}

              {isHovered && !stone && (
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

              {isLastMove(x, y) && stone && (
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
            </div>
          )
        })
      )}
    </div>
  )
}

// ============================================================================
// PUZZLE CARD COMPONENT
// ============================================================================

const PuzzleCard = ({ puzzle, onClick }: { puzzle: Puzzle; onClick: () => void }) => {
  const difficultyLabels = ['入门', '初级', '中级', '高级', '专家']
  const difficultyColors = ['bg-green-100 text-green-700', 'bg-blue-100 text-blue-700', 'bg-yellow-100 text-yellow-700', 'bg-orange-100 text-orange-700', 'bg-red-100 text-red-700']
  const typeLabels: Record<string, string> = {
    capture: '吃子',
    tesuji: '手筋',
    life_death: '死活',
    escape: '逃跑',
    joseki: '定式',
    fuseki: '布局',
    endgame: '官子',
    elementary: '基础',
    best_move: '最佳着手',
  }

  return (
    <div
      className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer border border-gray-100"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-900">{puzzle.title}</h3>
        <span className={`px-2 py-1 rounded text-xs font-medium ${difficultyColors[puzzle.difficulty - 1]}`}>
          {difficultyLabels[puzzle.difficulty - 1]}
        </span>
      </div>
      <p className="text-gray-600 text-sm mb-3">{puzzle.description}</p>
      <div className="flex gap-2">
        <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-xs">
          {typeLabels[puzzle.type] || puzzle.type}
        </span>
        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
          {puzzle.boardSize}x{puzzle.boardSize}
        </span>
      </div>
    </div>
  )
}

// ============================================================================
// PUZZLE VIEW COMPONENT
// ============================================================================

const PuzzleView = ({ puzzle, onBack }: { puzzle: Puzzle; onBack: () => void }) => {
  const [board, setBoard] = useState<BoardState>(() => 
    puzzle.initialBoard.map(row => [...row])
  )
  const [currentPlayer] = useState<'black' | 'white'>(puzzle.initialPlayer)
  const [showHint, setShowHint] = useState(false)
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null)
  const [attemptCount, setAttemptCount] = useState(0)

  const handleCellClick = (pos: Position) => {
    if (board[pos.y][pos.x] !== null) return

    const newBoard = board.map(row => [...row])
    newBoard[pos.y][pos.x] = currentPlayer
    setBoard(newBoard)
    setAttemptCount(prev => prev + 1)

    const solution = puzzle.solutionTree
    if (typeof solution.move !== 'string' && solution.move.x === pos.x && solution.move.y === pos.y) {
      setResult('correct')
    } else {
      setResult('wrong')
      setTimeout(() => {
        setResult(null)
        setBoard(puzzle.initialBoard.map(row => [...row]))
      }, 1500)
    }
  }

  const resetPuzzle = () => {
    setBoard(puzzle.initialBoard.map(row => [...row]))
    setResult(null)
    setAttemptCount(0)
    setShowHint(false)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={onBack} className="mb-4 text-gray-600 hover:text-gray-900 flex items-center gap-1">
        ← 返回题库
      </button>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">{puzzle.title}</h2>
          <span className="text-gray-500 text-sm">尝试次数: {attemptCount}</span>
        </div>

        <p className="text-gray-600 mb-6">{puzzle.description}</p>

        <div className="flex gap-8 flex-col lg:flex-row">
          <div className="flex-1 flex justify-center">
            <div className="bg-amber-50 rounded-xl p-4 inline-block">
              <PuzzleBoard
                boardSize={puzzle.boardSize}
                boardState={board}
                onCellClick={handleCellClick}
                lastMove={result === 'correct' ? (typeof puzzle.solutionTree.move !== 'string' ? puzzle.solutionTree.move : null) : null}
                currentPlayer={currentPlayer}
              />
            </div>
          </div>

          <div className="w-full lg:w-64 space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">执子方: </span>
              <span className={currentPlayer === 'black' ? 'text-gray-900 font-semibold' : 'text-gray-500 font-semibold'}>
                {currentPlayer === 'black' ? '黑方' : '白方'}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={resetPuzzle}
                className="flex-1 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium text-gray-700"
              >
                重置
              </button>
              <button
                onClick={() => setShowHint(!showHint)}
                className="flex-1 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium"
              >
                {showHint ? '隐藏提示' : '提示'}
              </button>
            </div>

            {showHint && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="font-medium text-yellow-800 mb-1">提示</p>
                <p className="text-yellow-700 text-sm">{puzzle.hint}</p>
              </div>
            )}

            {result === 'correct' && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="font-semibold text-green-800 mb-1">正确!</p>
                <p className="text-green-700 text-sm">{puzzle.solutionTree.comment}</p>
              </div>
            )}

            {result === 'wrong' && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="font-semibold text-red-700">再想想...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// MAIN PRACTICE COMPONENT
// ============================================================================

function Practice() {
  const { puzzleId } = useParams()
  const [selectedPuzzle, setSelectedPuzzle] = useState<Puzzle | null>(null)
  const [filterType, setFilterType] = useState<string>('')
  const [filterDifficulty, setFilterDifficulty] = useState<string>('')

  const filteredPuzzles = puzzles.filter(p => {
    if (filterType && p.type !== filterType) return false
    if (filterDifficulty && p.difficulty !== parseInt(filterDifficulty)) return false
    return true
  })

  if (puzzleId) {
    const puzzle = puzzles.find(p => p.id === puzzleId)
    if (puzzle) {
      return <PuzzleView puzzle={puzzle} onBack={() => setSelectedPuzzle(null)} />
    }
  }

  if (selectedPuzzle) {
    return <PuzzleView puzzle={selectedPuzzle} onBack={() => setSelectedPuzzle(null)} />
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-2 text-gray-900">练习题库</h1>
      <p className="text-gray-600 mb-6">通过练习提高你的围棋水平</p>

      <div className="mb-6 flex gap-4 flex-wrap">
        <select
          className="px-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">全部类型</option>
          <option value="capture">吃子</option>
          <option value="tesuji">手筋</option>
          <option value="life_death">死活</option>
          <option value="joseki">定式</option>
          <option value="fuseki">布局</option>
          <option value="endgame">官子</option>
        </select>
        <select
          className="px-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          value={filterDifficulty}
          onChange={(e) => setFilterDifficulty(e.target.value)}
        >
          <option value="">全部难度</option>
          <option value="1">入门</option>
          <option value="2">初级</option>
          <option value="3">中级</option>
          <option value="4">高级</option>
          <option value="5">专家</option>
        </select>
        <span className="text-gray-500 py-2 ml-auto">
          共 {filteredPuzzles.length} 道题目
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPuzzles.map(puzzle => (
          <PuzzleCard key={puzzle.id} puzzle={puzzle} onClick={() => setSelectedPuzzle(puzzle)} />
        ))}
      </div>

      <div className="mt-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
        <h2 className="font-semibold text-gray-900 mb-2">每日挑战</h2>
        <p className="text-gray-600 mb-4">每天精选一道题目，完成后可获得积分奖励。</p>
        <button className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium">
          开始今日挑战
        </button>
      </div>
    </div>
  )
}

export default Practice