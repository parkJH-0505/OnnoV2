'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Users, Clock, TrendingUp } from 'lucide-react'

/**
 * LiveActivityFeed - 사회적 증거 강화
 *
 * 행동경제학 원리:
 * - 사회적 증거: 불확실할 때 타인 행동 모방
 * - 밴드왜건 효과: 다수가 선택하면 따라감
 * - 실시간성: 즉각적 활동이 신뢰도 상승
 */

interface Activity {
  id: string
  type: 'signup' | 'meeting' | 'decision'
  user: string
  location: string
  time: string
}

const cities = ['서울', '부산', '대전', '인천', '대구', '광주', '수원', '성남']
const names = ['김○○', '이○○', '박○○', '최○○', '정○○', '강○○', '조○○', '윤○○']

const generateActivity = (): Activity => {
  const types: Activity['type'][] = ['signup', 'meeting', 'decision']
  return {
    id: Math.random().toString(36).substr(2, 9),
    type: types[Math.floor(Math.random() * types.length)],
    user: names[Math.floor(Math.random() * names.length)],
    location: cities[Math.floor(Math.random() * cities.length)],
    time: '방금 전',
  }
}

const activityConfig = {
  signup: {
    icon: Users,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    message: '님이 Onno를 시작했습니다',
  },
  meeting: {
    icon: Clock,
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    message: '님의 회의가 분석되었습니다',
  },
  decision: {
    icon: CheckCircle,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    message: '님의 결정사항이 저장되었습니다',
  },
}

export function LiveActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Initial delay before showing
    const showTimer = setTimeout(() => {
      setIsVisible(true)
      setActivities([generateActivity()])
    }, 3000)

    // Add new activities periodically
    const interval = setInterval(() => {
      setActivities(prev => {
        const newActivity = generateActivity()
        return [newActivity, ...prev.slice(0, 2)]
      })
    }, 5000)

    return () => {
      clearTimeout(showTimer)
      clearInterval(interval)
    }
  }, [])

  if (!isVisible || activities.length === 0) return null

  const latestActivity = activities[0]
  const config = activityConfig[latestActivity.type]
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed bottom-6 left-6 z-40"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={latestActivity.id}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 max-w-xs"
        >
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${config.bgColor}`}>
              <Icon size={18} className={config.color} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">
                <span className="font-medium">{latestActivity.user}</span>
                {config.message}
              </p>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                <span>{latestActivity.location}</span>
                <span>·</span>
                <span>{latestActivity.time}</span>
              </p>
            </div>
          </div>

          {/* Verified badge */}
          <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <TrendingUp size={12} />
              <span>실시간 활동</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-green-600">Live</span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
