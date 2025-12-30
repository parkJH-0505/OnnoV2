'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/stores/auth-store'
import { useNotionStore } from '@/stores/notion-store'
import {
  Calendar,
  Clock,
  FileText,
  TrendingUp,
  Plus,
  Settings,
  Bell,
  Search,
  ChevronRight,
  Play,
  Link2,
  CheckCircle,
  AlertCircle,
  Zap,
  Monitor,
  Smartphone
} from 'lucide-react'
import Link from 'next/link'

// Mock data for dashboard
const recentMeetings = [
  {
    id: 1,
    title: '주간 스프린트 회의',
    date: '오늘 오전 10:00',
    duration: '45분',
    decisions: 3,
    actionItems: 5,
  },
  {
    id: 2,
    title: '제품 기획 미팅',
    date: '어제 오후 2:00',
    duration: '1시간 20분',
    decisions: 7,
    actionItems: 12,
  },
  {
    id: 3,
    title: '디자인 리뷰',
    date: '12월 28일',
    duration: '30분',
    decisions: 2,
    actionItems: 4,
  },
]

const stats = [
  { label: '이번 주 회의', value: '12', icon: Calendar, change: '+3' },
  { label: '절약된 시간', value: '4.2h', icon: Clock, change: '+1.5h' },
  { label: '결정사항', value: '24', icon: FileText, change: '+8' },
  { label: '완료율', value: '87%', icon: TrendingUp, change: '+5%' },
]

export default function DashboardPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()
  const { isConnected: isNotionConnected, workspace, selectedDatabase } = useNotionStore()

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  // Check if user needs onboarding
  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('onno_onboarding_complete')
    if (isAuthenticated && !hasCompletedOnboarding) {
      router.push('/onboarding')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">O</span>
              </div>
              <span className="font-bold text-xl text-gray-900">Onno</span>
            </Link>

            <div className="hidden md:flex items-center gap-1 ml-8">
              <button className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg">
                Today
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">
                회의록
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">
                검색
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg">
              <Search size={20} />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <Link href="/settings" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg">
              <Settings size={20} />
            </Link>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user.name.charAt(0)}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            안녕하세요, {user.name}님!
          </h1>
          <p className="text-gray-500">
            오늘도 생산적인 회의를 위해 Onno가 함께합니다.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <stat.icon size={20} className="text-gray-400" />
                <span className="text-xs font-medium text-green-500">{stat.change}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 mb-8 text-white"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold mb-2">회의 준비 완료!</h2>
              <p className="text-blue-100">
                Google Meet이나 Zoom에서 회의를 시작하면 Onno가 자동으로 분석을 시작합니다.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/demo/meeting" className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors">
                <Play size={20} />
                회의 시작하기
              </Link>
              <Link href="/demo/immersive" className="flex items-center gap-2 px-6 py-3 bg-blue-400 text-white rounded-xl font-semibold hover:bg-blue-300 transition-colors">
                <Monitor size={20} />
                몰입형 데모
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Integration Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-8"
        >
          <Link href="/settings/integrations">
            <div className={`rounded-2xl p-5 border ${
              isNotionConnected
                ? 'bg-green-50 border-green-200 hover:border-green-300'
                : 'bg-amber-50 border-amber-200 hover:border-amber-300'
            } transition-colors cursor-pointer`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <span className="text-xl font-bold text-gray-900">N</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">Notion 연동</h3>
                      {isNotionConnected ? (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-600 rounded-full text-xs font-medium">
                          <CheckCircle size={10} />
                          연결됨
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-600 rounded-full text-xs font-medium">
                          <AlertCircle size={10} />
                          설정 필요
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {isNotionConnected && selectedDatabase
                        ? `${workspace?.name} › ${selectedDatabase.name}`
                        : 'Notion을 연결하면 회의록이 자동으로 저장됩니다'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!isNotionConnected && (
                    <span className="hidden sm:flex items-center gap-1 text-sm text-amber-600 font-medium">
                      <Zap size={14} />
                      지금 연결하기
                    </span>
                  )}
                  <ChevronRight size={20} className="text-gray-400" />
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Recent Meetings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">최근 회의</h2>
            <button className="text-sm text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1">
              전체 보기 <ChevronRight size={16} />
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {recentMeetings.map((meeting, index) => (
              <div
                key={meeting.id}
                className={`p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors ${
                  index !== recentMeetings.length - 1 ? 'border-b border-gray-50' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText size={20} className="text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{meeting.title}</h3>
                    <p className="text-sm text-gray-500">
                      {meeting.date} · {meeting.duration}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right hidden md:block">
                    <p className="text-sm font-medium text-gray-900">
                      결정사항 {meeting.decisions}개
                    </p>
                    <p className="text-xs text-gray-500">
                      액션 아이템 {meeting.actionItems}개
                    </p>
                  </div>
                  <ChevronRight size={20} className="text-gray-300" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Empty State for new users */}
        {recentMeetings.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              아직 회의 기록이 없습니다
            </h3>
            <p className="text-gray-500 mb-6">
              첫 번째 회의를 시작하고 Onno의 마법을 경험해보세요!
            </p>
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors">
              <Plus size={20} />
              첫 회의 시작하기
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
