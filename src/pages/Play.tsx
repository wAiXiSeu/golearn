import { useState } from 'react'
import { Board } from '../components/goban/Board'
import { useGameStore } from '../stores/gameStore'
import type { Position } from '../types/game'

const BOARD_SIZES = [
  { value: 9, label: '9x9' },
  { value: 13, label: '13x13' },
  { value: 19, label: '19x19' },
] as const

const RULES = [
  { value: 'chinese', label: '中国规则' },
  { value: 'japanese', label: '日本规则' },
] as const

function Play() {
  const [showSettings, setShowSettings] = useState(false)
  const [showConfirmNewGame, setShowConfirmNewGame] = useState(false)
  
  const { gameState, settings, setBoardSize, setKomi, setRules, playMove, pass, undo, reset } = useGameStore()
  
  const { board, boardSize, currentPlayer, moves, captures, isGameOver } = gameState

  const handleMove = (position: Position) => {
    if (isGameOver) return
    playMove(position)
  }

  const handlePass = () => {
    if (isGameOver) return
    pass()
  }

  const handleUndo = () => {
    undo()
  }

  const handleNewGame = () => {
    setShowConfirmNewGame(true)
  }

  const confirmNewGame = () => {
    reset()
    setShowConfirmNewGame(false)
  }

  const handleBoardSizeChange = (size: 9 | 13 | 19) => {
    setBoardSize(size)
  }

  const handleKomiChange = (komi: number) => {
    setKomi(komi)
  }

  const handleRulesChange = (rules: 'chinese' | 'japanese') => {
    setRules(rules)
  }

  const lastMove = moves.length > 0 ? moves[moves.length - 1].position : null
  const moveCount = moves.length

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 flex flex-col items-center">
        <div className="mb-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div
              className={`w-4 h-4 rounded-full ${
                currentPlayer === 'black' ? 'bg-gray-900' : 'bg-white border-2 border-gray-300'
              }`}
            />
            <span className="text-sm font-medium text-gray-700">
              {currentPlayer === 'black' ? '黑棋' : '白棋'} 执子
            </span>
          </div>
          {isGameOver && (
            <span className="text-sm font-bold text-green-600">
              对局结束
            </span>
          )}
        </div>
        
        <Board
          boardSize={boardSize}
          boardState={board}
          onCellClick={handleMove}
          lastMove={lastMove}
          currentPlayer={currentPlayer}
        />
        
        <div className="lg:hidden mt-4 w-full">
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={handlePass}
              disabled={isGameOver}
              className="px-3 py-2 bg-amber-100 text-amber-800 rounded-lg font-medium text-sm hover:bg-amber-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              虚手
            </button>
            <button
              onClick={handleUndo}
              disabled={moves.length === 0}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              悔棋
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg font-medium text-sm hover:bg-blue-200 transition-colors"
            >
              设置
            </button>
            <button
              onClick={handleNewGame}
              className="px-3 py-2 bg-green-100 text-green-800 rounded-lg font-medium text-sm hover:bg-green-200 transition-colors"
            >
              新局
            </button>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-80 space-y-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">对局信息</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">手数</span>
              <span className="font-medium">{moveCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">黑棋提子</span>
              <span className="font-medium">{captures.black}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">白棋提子</span>
              <span className="font-medium">{captures.white}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">贴目</span>
              <span className="font-medium">{settings.komi}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">规则</span>
              <span className="font-medium">
                {settings.rules === 'chinese' ? '中国' : '日本'}
              </span>
            </div>
          </div>
        </div>

        <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">操作</h3>
          
          <div className="space-y-2">
            <button
              onClick={handlePass}
              disabled={isGameOver}
              className="w-full px-4 py-2 bg-amber-100 text-amber-800 rounded-lg font-medium hover:bg-amber-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              虚手
            </button>
            <button
              onClick={handleUndo}
              disabled={moves.length === 0}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              悔棋
            </button>
            <button
              onClick={handleNewGame}
              className="w-full px-4 py-2 bg-green-100 text-green-800 rounded-lg font-medium hover:bg-green-200 transition-colors"
            >
              新局
            </button>
          </div>
        </div>

        <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${showSettings ? 'block' : 'hidden lg:block'}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">设置</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                棋盘大小
              </label>
              <div className="flex gap-2">
                {BOARD_SIZES.map((size) => (
                  <button
                    key={size.value}
                    onClick={() => handleBoardSizeChange(size.value)}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      settings.boardSize === size.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                贴目
              </label>
              <input
                type="number"
                value={settings.komi}
                onChange={(e) => handleKomiChange(parseFloat(e.target.value) || 0)}
                step={0.5}
                min={0}
                max={20}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                规则
              </label>
              <div className="flex gap-2">
                {RULES.map((rule) => (
                  <button
                    key={rule.value}
                    onClick={() => handleRulesChange(rule.value)}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      settings.rules === rule.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {rule.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showConfirmNewGame && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">确认新局</h3>
            <p className="text-gray-600 mb-4">
              当前对局进度将丢失，是否开始新局？
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmNewGame(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={confirmNewGame}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Play