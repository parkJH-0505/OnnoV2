'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Users, X, Sparkles } from 'lucide-react'

/**
 * UrgencyBanner - 손실 회피 심리 활용
 *
 * 행동경제학 원리:
 * - 손실 회피: 득보다 실에 2배 강하게 반응
 * - 희소성: 제한된 자원에 더 높은 가치 부여
 * - 사회적 증거: 타인의 행동이 행동 촉진
 */

interface UrgencyBannerProps {
  onCtaClick: () => void
}

export function UrgencyBanner({ onCtaClick }: UrgencyBannerProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 47, seconds: 32 })
  const [recentSignups, setRecentSignups] = useState(47)

  // 카운트다운 타이머 (손실 회피 + 희소성)
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // 실시간 가입자 수 업데이트 (사회적 증거)
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setRecentSignups(prev => prev + 1)
      }
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
      >
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-6 text-white text-sm">
            {/* 희소성 메시지 */}
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-yellow-300" />
              <span className="font-medium">
                <span className="hidden sm:inline">오늘만! </span>
                30일 무료 체험
              </span>
            </div>

            {/* 카운트다운 (손실 회피) */}
            <div className="hidden md:flex items-center gap-2">
              <Clock size={14} className="text-white/70" />
              <span className="font-mono">
                {String(timeLeft.hours).padStart(2, '0')}:
                {String(timeLeft.minutes).padStart(2, '0')}:
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-white/70 text-xs">남음</span>
            </div>

            {/* 실시간 가입자 (사회적 증거) */}
            <div className="hidden lg:flex items-center gap-2">
              <div className="flex -space-x-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-5 h-5 rounded-full bg-white/20 border border-white/30"
                  />
                ))}
              </div>
              <span className="text-white/90">
                <motion.span
                  key={recentSignups}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="inline-block font-semibold"
                >
                  {recentSignups}
                </motion.span>
                명이 오늘 가입
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              onClick={onCtaClick}
              className="px-4 py-1.5 bg-white text-purple-600 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              지금 시작
            </motion.button>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 text-white/70 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
