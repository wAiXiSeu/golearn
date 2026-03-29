import { useNavigate } from 'react-router-dom';
import { BookOpen, Target, Users, History, ArrowRight, Play } from 'lucide-react';

const features = [
  {
    icon: BookOpen,
    title: '学习',
    description: '从基础规则到高级战术，系统化的围棋教程',
    color: 'bg-amber-100 text-amber-700',
    path: '/learn',
  },
  {
    icon: Target,
    title: '练习',
    description: '精选死活题与手筋训练，提升计算能力',
    color: 'bg-emerald-100 text-emerald-700',
    path: '/practice',
  },
  {
    icon: Users,
    title: '对弈',
    description: '与AI对弈或在线匹配，实战检验学习成果',
    color: 'bg-blue-100 text-blue-700',
    path: '/play',
  },
  {
    icon: History,
    title: '复盘',
    description: '记录对局历史，AI分析助你找出改进点',
    color: 'bg-purple-100 text-purple-700',
    path: '/review',
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }} />
        </div>
        <div className="relative px-8 py-20 sm:px-12 lg:px-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              围棋入门学习平台
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 mb-8 leading-relaxed">
              从零开始学习围棋，掌握千年智慧。系统化的课程体系，
              互动式教学方法，让围棋学习变得简单有趣。
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/learn')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors"
              >
                <Play className="w-5 h-5" />
                开始学习
              </button>
              <button
                onClick={() => navigate('/practice')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors"
              >
                进入练习
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">全方位学习体验</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            四大核心模块，覆盖围棋学习的方方面面
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <button
              key={feature.title}
              onClick={() => navigate(feature.path)}
              className="group text-left p-6 bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-amber-300 transition-all"
            >
              <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Quick Start Section */}
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 sm:p-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">准备好开始了吗？</h2>
            <p className="text-slate-600">从第一课开始，探索围棋的奥秘</p>
          </div>
          <button
            onClick={() => navigate('/learn/basic-1')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-amber-500/25"
          >
            <Play className="w-5 h-5" />
            立即开始学习
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 pt-8 pb-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">Go</span>
            </div>
            <span className="font-semibold text-slate-900">GoLearn</span>
          </div>
          <p className="text-slate-500 text-sm">
            围棋入门学习平台 · 传承千年智慧
          </p>
        </div>
      </footer>
    </div>
  );
}
