'use client'

import { Button } from '@/components/ui/Button'
import { TypeWriter } from '@/components/ui/TypeWriter'
import { Rocket, Play, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'

interface HeroProps {
  onCtaClick: () => void
}

const painPoints = [
  '"그때 뭐라고 결정했더라...?"',
  '"회의록 정리하다 또 야근이네"',
  '"분명 말했는데 왜 안 했대?"',
  '"중요한 거 놓친 것 같은데..."',
]

export function Hero({ onCtaClick }: HeroProps) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      <div className="max-w-4xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span className="text-sm font-medium text-blue-600">
            AI 미팅 어시스턴트
          </span>
        </motion.div>

        {/* Dynamic Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
            <TypeWriter
              texts={painPoints}
              className="text-blue-500"
              typingSpeed={60}
              deletingSpeed={30}
              pauseDuration={2500}
            />
          </h1>
          <p className="text-2xl md:text-3xl font-semibold text-gray-700 mt-4">
            이제 <span className="gradient-text font-bold">Onno</span>가 알아서 챙깁니다
          </p>
        </motion.div>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto"
        >
          회의 중 결정사항, 액션 아이템, 놓친 내용까지
          <br className="hidden md:block" />
          AI가 실시간으로 감지하고 Notion에 자동 저장합니다
        </motion.p>

        {/* Video Container */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative w-full max-w-[800px] mx-auto mb-10"
        >
          {/* Glow effect behind video */}
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-2xl opacity-60" />

          <div
            className="relative aspect-video bg-gray-900 rounded-2xl shadow-2xl overflow-hidden cursor-pointer group"
            onClick={() => setIsVideoPlaying(true)}
          >
            {/* Video thumbnail / placeholder */}
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              {/* Fake UI preview */}
              <div className="absolute inset-4 rounded-lg border border-gray-700/50 overflow-hidden">
                <div className="h-8 bg-gray-800 flex items-center px-3 gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="flex-1 h-4 bg-gray-700 rounded mx-8" />
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex gap-3">
                    <div className="w-32 h-20 bg-gray-700 rounded-lg animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-gray-700 rounded w-3/4" />
                      <div className="h-3 bg-gray-700 rounded w-1/2" />
                    </div>
                  </div>
                  {/* Onno card preview */}
                  <motion.div
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="absolute bottom-8 right-8 bg-white rounded-lg shadow-lg p-3 max-w-[200px]"
                  >
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">O</span>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-800">결정사항 감지됨</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">"다음 주 월요일까지 완료"</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-20 h-20 rounded-full bg-white/95 shadow-2xl flex items-center justify-center group-hover:bg-white transition-colors"
                >
                  <Play className="w-8 h-8 text-blue-500 ml-1" fill="currentColor" />
                </motion.div>
              </div>
            </div>

            {/* Video duration badge */}
            <div className="absolute bottom-4 left-4 px-2 py-1 bg-black/60 rounded text-xs text-white">
              0:45
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-4"
        >
          {/* Main CTA */}
          <Button
            size="lg"
            onClick={onCtaClick}
            leftIcon={<Rocket size={20} />}
            className="w-full max-w-[400px] h-14 text-lg relative overflow-hidden group"
          >
            <span className="relative z-10">무료로 시작하기</span>
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </Button>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle size={16} className="text-green-500" />
              5분 만에 설정 완료
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle size={16} className="text-green-500" />
              카드등록 불필요
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle size={16} className="text-green-500" />
              14일 무료 체험
            </span>
          </div>
        </motion.div>

        {/* Social Proof - Company Logos */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-20 pt-10 border-t border-gray-100"
        >
          <p className="text-sm text-gray-400 mb-6">
            스마트한 팀들이 선택한 미팅 파트너
          </p>
          <div className="flex items-center justify-center gap-8 md:gap-12 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
            {/* Placeholder logos - will be replaced with real ones */}
            {[
              { name: 'TechCorp', width: 'w-24' },
              { name: 'StartupX', width: 'w-20' },
              { name: 'DesignCo', width: 'w-24' },
              { name: 'DataFlow', width: 'w-20' },
            ].map((company) => (
              <div
                key={company.name}
                className={`${company.width} h-8 bg-gray-300 rounded flex items-center justify-center`}
              >
                <span className="text-xs font-medium text-gray-600">{company.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
