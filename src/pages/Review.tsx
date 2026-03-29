import { useState, useRef } from 'react'
import { Board } from '../components/goban/Board'
import { useGameStore } from '../stores/gameStore'
import type { Position, Move } from '../types/game'
import { generateSGF, parseSGF, sgfToGameState } from '../engine/sgf'
import { Territory } from '../engine/territory'

const COL_LABELS = 'ABCDEFGHJKLMNOPQRST'

function Review() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showTerritory, setShowTerritory] = useState(false)
  const [notification, setNotification] = useState<string | null>(null)
  
  const { gameState, settings, loadGame, reset } = useGameStore()
  const { board, boardSize, moves, captures } = gameState

  const showNotification = (message: string) => {
    setNotification(message)
    setTimeout(() => setNotification(null), 3000)
  }

  const getBoardAtMove = (moveIndex: number) => {
    const size = boardSize
    const boardState = Array(size).fill(null).map(() => Array(size).fill(null))
    
    for (let i = 0; i <= moveIndex && i < moves.length; i++) {
      const move = moves[i]
      if (move.position.x >= 0 && move.position.y >= 0) {
        boardState[move.position.y][move.position.x] = move.color
        for (const captured of move.captured) {
          boardState[captured.y][captured.x] = null
        }
      }
    }
    
    return boardState
  }

  const handleFirst = () => {
    setCurrentMoveIndex(-1)
    setIsPlaying(false)
  }

  const handlePrevious = () => {
    setCurrentMoveIndex(Math.max(-1, currentMoveIndex - 1))
    setIsPlaying(false)
  }

  const handleNext = () => {
    setCurrentMoveIndex(Math.min(moves.length - 1, currentMoveIndex + 1))
  }

  const handleLast = () => {
    setCurrentMoveIndex(moves.length - 1)
    setIsPlaying(false)
  }

  const handlePlayPause = () => {
    if (currentMoveIndex >= moves.length - 1) {
      setCurrentMoveIndex(-1)
    }
    setIsPlaying(!isPlaying)
  }

  const handleMoveClick = (index: number) => {
    setCurrentMoveIndex(index)
    setIsPlaying(false)
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    try {
      const content = await file.text()
      const parsed = parseSGF(content)
      const newGameState = sgfToGameState(parsed)
      loadGame(newGameState)
      setCurrentMoveIndex(newGameState.moves.length - 1)
      showNotification('SGF文件导入成功')
    } catch {
      showNotification('SGF文件格式错误')
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleExport = () => {
    if (moves.length === 0) {
      showNotification('没有可导出的棋谱')
      return
    }
    
    const sgf = generateSGF(gameState, {
      pb: 'Black',
      pw: 'White',
      km: settings.komi,
      ru: settings.rules,
    })
    
    const blob = new Blob([sgf], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `golearn_${new Date().toISOString().split('T')[0]}.sgf`
    a.click()
    URL.revokeObjectURL(url)
    showNotification('SGF文件已下载')
  }

  const handleClear = () => {
    reset()
    setCurrentMoveIndex(-1)
    showNotification('棋盘已清空')
  }

  const formatMove = (move: Move, index: number): string => {
    if (move.position.x < 0) {
      return `${index + 1}. ${move.color === 'black' ? '黑' : '白'}: 虚手`
    }
    const col = COL_LABELS[move.position.x]
    const row = boardSize - move.position.y
    return `${index + 1}. ${move.color === 'black' ? '黑' : '白'}: ${col}${row}`
  }

  const displayBoard = currentMoveIndex >= 0 ? getBoardAtMove(currentMoveIndex) : board
  const currentMove = currentMoveIndex >= 0 ? moves[currentMoveIndex] : null
  const lastMovePosition = currentMove && currentMove.position.x >= 0 ? currentMove.position : null

  const getTerritoryScore = () => {
    const territory = new Territory()
    const boardObj = {
      getSize: () => boardSize,
      isEmpty: (pos: Position) => displayBoard[pos.y][pos.x] === null,
      getStone: (pos: Position) => displayBoard[pos.y][pos.x],
      getNeighbors: (pos: Position) => {
        const neighbors: Position[] = []
        const deltas = [[-1, 0], [1, 0], [0, -1], [0, 1]]
        for (const [dx, dy] of deltas) {
          const x = pos.x + dx
          const y = pos.y + dy
          if (x >= 0 && x < boardSize && y >= 0 && y < boardSize) {
            neighbors.push({ x, y })
          }
        }
        return neighbors
      },
    } as unknown as Parameters<typeof territory.countTerritory>[0]
    
    const territoryCount = territory.countTerritory(boardObj)
    const blackScore = territoryCount.black + captures.black
    const whiteScore = territoryCount.white + captures.white + settings.komi
    
    return { black: blackScore, white: whiteScore, territory: territoryCount }
  }

  const scoreInfo = showTerritory ? getTerritoryScore() : null

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 flex flex-col items-center">
        <div className="mb-4 flex items-center gap-4 flex-wrap justify-center">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">当前手数:</span>
            <span className="text-sm font-medium">{currentMoveIndex + 1} / {moves.length}</span>
          </div>
          {currentMove && (
            <div className="flex items-center gap-2">
              <div
                className={`w-4 h-4 rounded-full ${
                  currentMove.color === 'black' ? 'bg-gray-900' : 'bg-white border-2 border-gray-300'
                }`}
              />
              <span className="text-sm text-gray-600">
                {currentMove.position.x >= 0
                  ? `${COL_LABELS[currentMove.position.x]}${boardSize - currentMove.position.y}`
                  : '虚手'}
              </span>
            </div>
          )}
          {showTerritory && scoreInfo && (
            <div className="flex items-center gap-4 text-sm">
              <span className={scoreInfo.black > scoreInfo.white ? 'text-green-600 font-semibold' : ''}>
                黑: {scoreInfo.black.toFixed(1)}
              </span>
              <span className={scoreInfo.white > scoreInfo.black ? 'text-green-600 font-semibold' : ''}>
                白: {scoreInfo.white.toFixed(1)}
              </span>
            </div>
          )}
        </div>
        
        <Board
          boardSize={boardSize}
          boardState={displayBoard}
          onCellClick={() => {}}
          lastMove={lastMovePosition}
        />
        
        <div className="mt-4 flex gap-2 flex-wrap justify-center">
          <button
            onClick={handleFirst}
            disabled={currentMoveIndex < 0}
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 disabled:opacity-50"
          >
            开始
          </button>
          <button
            onClick={handlePrevious}
            disabled={currentMoveIndex < 0}
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 disabled:opacity-50"
          >
            上一步
          </button>
          <button
            onClick={handlePlayPause}
            className="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium hover:bg-blue-200"
          >
            {isPlaying ? '暂停' : '播放'}
          </button>
          <button
            onClick={handleNext}
            disabled={currentMoveIndex >= moves.length - 1}
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 disabled:opacity-50"
          >
            下一步
          </button>
          <button
            onClick={handleLast}
            disabled={currentMoveIndex >= moves.length - 1}
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 disabled:opacity-50"
          >
            最后
          </button>
        </div>
      </div>

      <div className="w-full lg:w-80 space-y-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">文件操作</h3>
          <div className="space-y-2">
            <input
              type="file"
              ref={fileInputRef}
              accept=".sgf"
              onChange={handleImport}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-medium hover:bg-blue-200 transition-colors"
            >
              导入 SGF
            </button>
            <button
              onClick={handleExport}
              disabled={moves.length === 0}
              className="w-full px-4 py-2 bg-green-100 text-green-800 rounded-lg font-medium hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              导出 SGF
            </button>
            <button
              onClick={handleClear}
              className="w-full px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors"
            >
              清空棋盘
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">形势判断</h3>
            <button
              onClick={() => setShowTerritory(!showTerritory)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                showTerritory
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {showTerritory ? '隐藏' : '显示'}
            </button>
          </div>
          {showTerritory && scoreInfo && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">黑棋领地</span>
                <span className="font-medium">{scoreInfo.territory.black}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">白棋领地</span>
                <span className="font-medium">{scoreInfo.territory.white}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">黑棋提子</span>
                <span className="font-medium">{captures.black}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">白棋提子</span>
                <span className="font-medium">{captures.white}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-600">贴目</span>
                <span className="font-medium">{settings.komi}</span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            手数列表 ({moves.length})
          </h3>
          <div className="max-h-64 overflow-y-auto space-y-1">
            {moves.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">暂无手数</p>
            ) : (
              moves.map((move, index) => (
                <button
                  key={index}
                  onClick={() => handleMoveClick(index)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    index === currentMoveIndex
                      ? 'bg-blue-100 text-blue-800'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {formatMove(move, index)}
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {notification && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {notification}
        </div>
      )}
    </div>
  )
}

export default Review