import { useState } from 'react'
import { Board } from '../components/goban/Board'
import { useGameStore } from '../stores/gameStore'
import { useUserStore } from '../stores/userStore'
import { generateSGF } from '../engine/sgf'
import { saveGame } from '../lib/supabase'
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
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [saveTitle, setSaveTitle] = useState('')
  const [notification, setNotification] = useState<string | null>(null)
  
  const { gameState, settings, setBoardSize, setKomi, setRules, playMove, pass, undo, reset } = useGameStore()
  const { user, isAuthenticated } = useUserStore()
  
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

  const showNotification = (msg: string) => {
    setNotification(msg)
    setTimeout(() => setNotification(null), 3000)
  }

  const handleSaveClick = () => {
    if (moves.length === 0) {
      showNotification('没有可保存的棋局')
      return
    }
    setSaveTitle(`对局_${new Date().toLocaleDateString('zh-CN')}`)
    setShowSaveDialog(true)
  }

  const handleSave = async (saveToCloud: boolean) => {
    const sgf = generateSGF(gameState, {
      pb: '黑棋',
      pw: '白棋',
      km: settings.komi,
      ru: settings.rules,
      dt: new Date().toISOString().split('T')[0],
      gn: saveTitle,
    })

    const blob = new Blob([sgf], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${saveTitle.replace(/\s+/g, '_')}.sgf`
    a.click()
    URL.revokeObjectURL(url)

    if (saveToCloud && isAuthenticated && user) {
      try {
        await saveGame(user.id, {
          title: saveTitle,
          sgf_content: sgf,
          board_size: boardSize,
          result: gameState.result || '',
          metadata: {
            komi: settings.komi,
            rules: settings.rules,
            moves_count: moves.length,
          },
        })
        showNotification('棋局已保存到云端')
      } catch {
        showNotification('云端保存失败，请检查网络')
      }
    } else {
      showNotification('SGF文件已下载')
    }

    setShowSaveDialog(false)
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
               onClick={handleSaveClick}
               disabled={moves.length === 0}
               className="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg font-medium text-sm hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
             >
               保存
             </button>
             <button
               onClick={handleNewGame}
               className="px-3 py-2 bg-green-100 text-green-800 rounded-lg font-medium text-sm hover:bg-green-200 transition-colors"
             >
               新局
             </button>
           </div>
           <button
             onClick={() => setShowSettings(!showSettings)}
             className="mt-2 w-full px-3 py-2 bg-purple-100 text-purple-800 rounded-lg font-medium text-sm hover:bg-purple-200 transition-colors"
           >
             {showSettings ? '隐藏设置' : '显示设置'}
           </button>
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
               onClick={handleSaveClick}
               disabled={moves.length === 0}
               className="w-full px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-medium hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
             >
               保存
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

      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">保存棋局</h3>
            <p className="text-gray-600 mb-4">
              棋局将保存为SGF格式文件下载到本地。
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                棋局名称
              </label>
              <input
                type="text"
                value={saveTitle}
                onChange={(e) => setSaveTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {isAuthenticated && (
              <div className="mb-4 flex items-center gap-2">
                <input type="checkbox" id="saveCloud" className="rounded" />
                <label htmlFor="saveCloud" className="text-sm text-gray-600">
                  同时保存到云端
                </label>
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => {
                  const saveToCloud = isAuthenticated && (document.getElementById('saveCloud') as HTMLInputElement)?.checked
                  handleSave(saveToCloud)
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {notification && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {notification}
        </div>
      )}
    </div>
  )
}

export default Play