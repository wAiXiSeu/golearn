import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Learn from './pages/Learn'
import Practice from './pages/Practice'
import Play from './pages/Play'
import Review from './pages/Review'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <a href="/" className="text-xl font-bold text-gray-900">
                GoLearn
              </a>
            </div>
            <div className="flex space-x-8 items-center">
              <a href="/learn" className="text-gray-600 hover:text-gray-900 font-medium">
                学习
              </a>
              <a href="/practice" className="text-gray-600 hover:text-gray-900 font-medium">
                练习
              </a>
              <a href="/play" className="text-gray-600 hover:text-gray-900 font-medium">
                对弈
              </a>
              <a href="/review" className="text-gray-600 hover:text-gray-900 font-medium">
                复盘
              </a>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/learn/:lessonId" element={<Learn />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/practice/:puzzleId" element={<Practice />} />
          <Route path="/play" element={<Play />} />
          <Route path="/review" element={<Review />} />
        </Routes>
      </main>
    </div>
  )
}

export default App