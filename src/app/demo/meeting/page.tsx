'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HUD, CardStack, Timeline, CardType } from '@/components/meeting'
import {
  ArrowLeft,
  Play,
  Pause,
  SkipForward,
  Volume2,
  Settings,
  Maximize,
  Users,
  MessageSquare
} from 'lucide-react'
import Link from 'next/link'

// Demo meeting data
const demoEvents = [
  {
    id: '1',
    type: 'forward' as CardType,
    title: '일정 확정',
    content: '다음 주 월요일까지 디자인 시안 최종 확정하기로 결정했습니다.',
    timestamp: 45,
    speaker: '김팀장',
  },
  {
    id: '2',
    type: 'relation' as CardType,
    title: '담당자 지정',
    content: '박개발님이 API 연동 작업을 담당하기로 했습니다.',
    timestamp: 120,
    speaker: '김팀장',
  },
  {
    id: '3',
    type: 'safety' as CardType,
    title: '리스크 감지',
    content: '일정이 촉박할 수 있어서 백업 플랜을 준비해야 할 것 같습니다.',
    timestamp: 180,
    speaker: '이기획',
  },
  {
    id: '4',
    type: 'bypass' as CardType,
    title: '대안 제시',
    content: '기존 컴포넌트를 재사용하면 개발 시간을 단축할 수 있을 것 같습니다.',
    timestamp: 240,
    speaker: '박개발',
  },
  {
    id: '5',
    type: 'constraint' as CardType,
    title: '제약사항 확인',
    content: '예산이 한정되어 있어서 외부 서비스 사용은 어려울 것 같습니다.',
    timestamp: 300,
    speaker: '최매니저',
  },
  {
    id: '6',
    type: 'forward' as CardType,
    title: '액션 아이템',
    content: '이번 주 금요일까지 프로토타입 완성해서 공유하기로 했습니다.',
    timestamp: 360,
    speaker: '김팀장',
  },
  {
    id: '7',
    type: 'summary' as CardType,
    title: '중간 요약',
    content: '지금까지 3개의 결정사항과 2개의 액션 아이템이 도출되었습니다.',
    timestamp: 420,
    speaker: 'Onno AI',
  },
]

const DEMO_DURATION = 480 // 8 minutes

export default function MeetingDemoPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [activeCards, setActiveCards] = useState<typeof demoEvents>([])
  const [showTimeline, setShowTimeline] = useState(true)

  // Simulate meeting progress
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= DEMO_DURATION) {
          setIsPlaying(false)
          return prev
        }
        return prev + 1
      })
    }, 100) // 10x speed for demo

    return () => clearInterval(interval)
  }, [isPlaying])

  // Check for new events
  useEffect(() => {
    const newEvents = demoEvents.filter(
      (event) =>
        event.timestamp <= currentTime &&
        !activeCards.find((c) => c.id === event.id)
    )

    if (newEvents.length > 0) {
      setActiveCards((prev) => [...newEvents, ...prev])
    }
  }, [currentTime, activeCards])

  const handleSeek = useCallback((time: number) => {
    setCurrentTime(time)
    // Reset cards that are after the new time
    setActiveCards(demoEvents.filter((e) => e.timestamp <= time))
  }, [])

  const handleDismissCard = useCallback((id: string) => {
    setActiveCards((prev) => prev.filter((c) => c.id !== id))
  }, [])

  const handleCardAction = useCallback((id: string, action: string) => {
    console.log(`Card ${id} action: ${action}`)
  }, [])

  const handleReset = () => {
    setCurrentTime(0)
    setActiveCards([])
    setIsPlaying(false)
  }

  const decisionCount = activeCards.filter(c => c.type === 'forward').length
  const actionItemCount = activeCards.filter(c => ['forward', 'relation'].includes(c.type)).length

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Mock Video Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Fake video conference grid */}
        <div className="absolute inset-0 grid grid-cols-2 gap-2 p-4 opacity-30">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-gray-800 rounded-xl flex items-center justify-center"
            >
              <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center">
                <Users size={32} className="text-gray-500" />
              </div>
            </div>
          ))}
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-gray-950/50" />
      </div>

      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-3 py-2 bg-gray-800/80 hover:bg-gray-700/80 rounded-lg backdrop-blur-sm transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="text-sm">나가기</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 bg-red-500/20 border border-red-500/50 rounded-full text-red-400 text-xs font-medium flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              DEMO MODE
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 bg-gray-800/80 hover:bg-gray-700/80 rounded-lg backdrop-blur-sm transition-colors">
              <Volume2 size={16} />
            </button>
            <button className="p-2 bg-gray-800/80 hover:bg-gray-700/80 rounded-lg backdrop-blur-sm transition-colors">
              <Settings size={16} />
            </button>
            <button className="p-2 bg-gray-800/80 hover:bg-gray-700/80 rounded-lg backdrop-blur-sm transition-colors">
              <Maximize size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* HUD */}
      <HUD
        isRecording={isPlaying}
        meetingDuration={Math.floor(currentTime)}
        participantCount={4}
        decisionCount={decisionCount}
        actionItemCount={actionItemCount}
      />

      {/* Intervention Cards */}
      <CardStack
        cards={activeCards.map(card => ({
          ...card,
          timestamp: `${Math.floor(card.timestamp / 60)}:${(card.timestamp % 60).toString().padStart(2, '0')}`
        }))}
        onDismiss={handleDismissCard}
        onAction={handleCardAction}
      />

      {/* Bottom Controls */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-4">
        {/* Timeline Toggle */}
        <div className="flex justify-center mb-4">
          <button
            onClick={() => setShowTimeline(!showTimeline)}
            className="px-4 py-2 bg-gray-800/80 hover:bg-gray-700/80 rounded-full backdrop-blur-sm text-sm flex items-center gap-2 transition-colors"
          >
            <MessageSquare size={14} />
            {showTimeline ? '타임라인 숨기기' : '타임라인 보기'}
          </button>
        </div>

        {/* Timeline */}
        <AnimatePresence>
          {showTimeline && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="max-w-4xl mx-auto"
            >
              <Timeline
                events={demoEvents}
                currentTime={currentTime}
                duration={DEMO_DURATION}
                isPlaying={isPlaying}
                onSeek={handleSeek}
                onPlayPause={() => setIsPlaying(!isPlaying)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Playback Controls (when timeline hidden) */}
        {!showTimeline && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-4"
          >
            <button
              onClick={handleReset}
              className="p-3 bg-gray-800/80 hover:bg-gray-700/80 rounded-full backdrop-blur-sm transition-colors"
            >
              <SkipForward size={18} className="rotate-180" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-4 bg-blue-500 hover:bg-blue-600 rounded-full transition-colors"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-0.5" />}
            </button>
            <button
              onClick={() => handleSeek(Math.min(currentTime + 60, DEMO_DURATION))}
              className="p-3 bg-gray-800/80 hover:bg-gray-700/80 rounded-full backdrop-blur-sm transition-colors"
            >
              <SkipForward size={18} />
            </button>
          </motion.div>
        )}
      </div>

      {/* Instructions Overlay (initial) */}
      <AnimatePresence>
        {currentTime === 0 && !isPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-2xl p-8 max-w-md text-center border border-gray-700"
            >
              <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Play size={32} className="text-blue-400 ml-1" />
              </div>
              <h2 className="text-2xl font-bold mb-3">미팅 데모 체험</h2>
              <p className="text-gray-400 mb-6">
                재생 버튼을 클릭하면 AI가 실시간으로 회의 내용을 분석하는 것을 체험할 수 있습니다.
              </p>
              <div className="space-y-3 text-left text-sm text-gray-500 mb-6">
                <p>• 결정사항, 액션 아이템이 자동으로 감지됩니다</p>
                <p>• 카드를 클릭해 상세 내용을 확인하세요</p>
                <p>• 타임라인에서 원하는 시점으로 이동할 수 있습니다</p>
              </div>
              <button
                onClick={() => setIsPlaying(true)}
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Play size={18} />
                데모 시작하기
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
