'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Monitor,
  Smartphone,
  Play,
  Pause,
  RotateCcw,
  Settings,
  ChevronLeft,
  Zap,
  Layout,
  X,
  HelpCircle,
  ArrowRight,
  Brain,
  Sparkles,
  FileText,
  CheckCircle,
  Check,
  AlertTriangle,
  Video,
  MessageSquare,
  Target,
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useDemoStore, VirtualWindow as VirtualWindowType, DemoEvent } from '@/stores/demo-store'
import { VirtualDesktop } from '@/components/demo/VirtualDesktop'
import { VirtualWindow } from '@/components/demo/VirtualWindow'
import { ZoomSimulator } from '@/components/demo/apps/ZoomSimulator'
import { SlackSimulator } from '@/components/demo/apps/SlackSimulator'
import { OnnoHUD } from '@/components/demo/hud/OnnoHUD'
import { GuidedTour, TourStep } from '@/components/demo/GuidedTour'

export default function ImmersiveDemoPage() {
  const {
    currentMode,
    setMode,
    isTransitioning,
    isPlaying,
    play,
    pause,
    reset,
    currentTime,
    scenario,
    playbackSpeed,
    setPlaybackSpeed,
    windows,
    hudState,
    addInsight,
    addQuestion,
    updateQualityScore,
    showIntervention,
    setCurrentSpeaker,
    addSlackMessage,
    addTranscriptEntry,
  } = useDemoStore()

  const [showControls, setShowControls] = useState(false) // 기본 숨김
  const [showTour, setShowTour] = useState(false)
  const [tourReady, setTourReady] = useState(false)

  // 가이드 투어 스텝 정의
  const tourSteps: TourStep[] = [
    {
      id: 'welcome',
      targetId: '',
      title: 'Onno 체험 데모',
      description: '실제 회의 환경에서 Onno AI가 어떻게 작동하는지 직접 체험해보세요.\n\n15분 분량의 회의 시뮬레이션을 통해 Onno의 핵심 기능들을 경험할 수 있습니다.',
      icon: <Brain className="w-5 h-5" />,
      position: 'center',
    },
    {
      id: 'zoom-window',
      targetId: 'zoom-window',
      title: 'Zoom 회의 화면',
      description: '실제 Zoom 회의 화면입니다.\n\n회의 참가자들의 화상과 현재 발언자를 확인할 수 있으며, 시뮬레이션이 시작되면 실시간으로 회의가 진행됩니다.',
      icon: <Video className="w-5 h-5" />,
      position: 'right',
      align: 'start',
    },
    {
      id: 'slack-window',
      targetId: 'slack-window',
      title: 'Slack 연동',
      description: '회의 중 Slack 알림이 도착하면 자동으로 표시됩니다.\n\nOnno는 관련 메시지를 분석하여 회의 맥락에 반영합니다.',
      icon: <MessageSquare className="w-5 h-5" />,
      position: 'left',
      align: 'start',
    },
    {
      id: 'onno-hud',
      targetId: 'onno-hud',
      title: 'Onno 플로팅 HUD',
      description: '회의 중 항상 화면 위에 떠있는 Onno AI 어시스턴트입니다.\n\n• 실시간 회의 품질 점수\n• AI 인사이트 & 제안\n• 미해결 질문 추적\n• 스마트 개입 알림\n\n드래그하여 위치를 이동할 수 있습니다.',
      icon: <Brain className="w-5 h-5" />,
      position: 'right',
      align: 'start',
    },
    {
      id: 'mode-switch',
      targetId: 'mode-switch',
      title: '체험 모드 전환',
      description: '두 가지 체험 모드를 제공합니다:\n\n🖥️ 플로팅 모드: 데스크탑 앱처럼 Zoom 위에 떠있는 HUD 형태\n\n🌐 웹 버전: 브라우저에서 사용하는 Decision OS 대시보드',
      icon: <Layout className="w-5 h-5" />,
      position: 'bottom',
    },
    {
      id: 'play-button',
      targetId: 'play-button',
      title: '시나리오 재생',
      description: '재생 버튼을 눌러 15분 분량의 회의 시뮬레이션을 시작하세요!\n\n5배속으로 약 3분 만에 전체 체험이 가능합니다. Onno의 실시간 분석과 스마트 개입을 확인해보세요.',
      icon: <Play className="w-5 h-5" />,
      position: 'bottom',
    },
    {
      id: 'intervention-preview',
      targetId: '',
      title: 'AI 개입 미리보기',
      description: '시뮬레이션 중 Onno는 다음과 같이 개입합니다:\n\n⚠️ 주제 이탈 감지 - 회의가 산으로 갈 때\n🎯 결정 필요 - 논의가 길어질 때\n⏰ 시간 알림 - 남은 시간 안내\n\n각 개입에 대해 "채택" 또는 "보류"로 응답할 수 있습니다.',
      icon: <Target className="w-5 h-5" />,
      position: 'center',
    },
  ]

  // 첫 방문 체크 및 투어 시작
  useEffect(() => {
    const hasSeenTour = localStorage.getItem('onno_demo_tour_v2')
    if (!hasSeenTour) {
      // DOM이 완전히 렌더링된 후 투어 시작
      const timer = setTimeout(() => {
        setShowControls(true) // 컨트롤 패널 열기
        setTimeout(() => {
          setShowTour(true)
          setTourReady(true)
        }, 300)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleTourComplete = () => {
    setShowTour(false)
    localStorage.setItem('onno_demo_tour_v2', 'true')
  }

  const handleTourClose = () => {
    setShowTour(false)
    localStorage.setItem('onno_demo_tour_v2', 'true')
  }

  const startTour = () => {
    setShowTour(true)
    setTourReady(true)
  }

  // Process demo events based on current time
  useEffect(() => {
    if (!isPlaying || !scenario) return

    const interval = setInterval(() => {
      const store = useDemoStore.getState()
      const newTime = store.currentTime + (100 * playbackSpeed)

      // Find events that should trigger
      scenario.events.forEach((event) => {
        const eventTime = event.timestamp / playbackSpeed
        if (eventTime > store.currentTime && eventTime <= newTime) {
          processEvent(event)
        }
      })

      useDemoStore.setState({ currentTime: newTime })

      // Stop at end
      if (newTime >= scenario.duration) {
        pause()
      }
    }, 100)

    return () => clearInterval(interval)
  }, [isPlaying, scenario, playbackSpeed, pause])

  const processEvent = useCallback((event: DemoEvent) => {
    switch (event.type) {
      case 'zoom_speaker_change':
        setCurrentSpeaker(event.payload.speakerId as string)
        break
      case 'hud_insight':
        addInsight({
          id: `insight-${Date.now()}`,
          type: event.payload.type as 'context' | 'suggestion' | 'alert',
          content: event.payload.content as string,
          timestamp: Date.now(),
        })
        break
      case 'hud_question':
        addQuestion({
          id: `question-${Date.now()}`,
          speaker: event.payload.speaker as string,
          content: event.payload.content as string,
          timestamp: Date.now(),
          status: 'pending',
        })
        break
      case 'hud_quality_update':
        updateQualityScore(event.payload.score as number)
        break
      case 'hud_intervention':
        showIntervention({
          id: `intervention-${Date.now()}`,
          type: event.payload.type as 'tangent' | 'decision_needed' | 'time_warning' | 'context',
          title: event.payload.title as string,
          description: event.payload.description as string,
          suggestion: event.payload.suggestion as string,
        })
        break
      case 'slack_notification':
        addSlackMessage({
          id: `slack-${Date.now()}`,
          channel: event.payload.channel as string,
          sender: event.payload.sender as string,
          content: event.payload.content as string,
          timestamp: Date.now(),
          isNew: true,
        })
        break
      case 'transcript_update':
        addTranscriptEntry({
          id: `transcript-${Date.now()}`,
          speaker: event.payload.speaker as string,
          content: event.payload.content as string,
          timestamp: Date.now(),
        })
        break
    }
  }, [addInsight, addQuestion, updateQualityScore, showIntervention, setCurrentSpeaker, addSlackMessage, addTranscriptEntry])

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Guided Tour */}
      <GuidedTour
        steps={tourSteps}
        isOpen={showTour && tourReady}
        onClose={handleTourClose}
        onComplete={handleTourComplete}
      />

      {/* Mode Transition Overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[2000] bg-black flex items-center justify-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Control Button (항상 표시) */}
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={() => setShowControls(!showControls)}
        className={cn(
          'fixed top-4 right-4 z-[1600] p-3 rounded-xl transition-all shadow-lg',
          showControls
            ? 'bg-violet-600 text-white'
            : 'bg-gray-900/90 backdrop-blur-xl text-gray-300 hover:bg-gray-800 border border-gray-700',
        )}
      >
        <Settings className="w-5 h-5" />
      </motion.button>

      {/* Control Panel (슬라이드 다운) */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 right-0 z-[1500] bg-gray-900/95 backdrop-blur-xl border-b border-gray-700"
          >
            <div className="h-16 px-4 flex items-center justify-between max-w-7xl mx-auto">
              {/* Left - Navigation */}
              <div className="flex items-center gap-4">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span className="text-sm hidden sm:inline">대시보드</span>
                </Link>
                <div className="w-px h-6 bg-gray-700" />
                <div>
                  <h1 className="text-white font-bold text-sm">Onno 체험 데모</h1>
                  <p className="text-gray-500 text-xs">15분 회의 시뮬레이션</p>
                </div>
              </div>

              {/* Center - Mode Switch */}
              <div
                data-tour-id="mode-switch"
                className="flex items-center gap-1 bg-gray-800/80 rounded-xl p-1"
              >
                <button
                  onClick={() => setMode('hud')}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    currentMode === 'hud'
                      ? 'bg-violet-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700',
                  )}
                >
                  <Smartphone className="w-4 h-4" />
                  <span className="hidden sm:inline">플로팅 모드 체험</span>
                  <span className="sm:hidden">플로팅</span>
                </button>
                <button
                  onClick={() => setMode('console')}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    currentMode === 'console'
                      ? 'bg-violet-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700',
                  )}
                >
                  <Monitor className="w-4 h-4" />
                  <span className="hidden sm:inline">웹 버전 체험</span>
                  <span className="sm:hidden">웹</span>
                </button>
              </div>

              {/* Right - Playback Controls */}
              <div className="flex items-center gap-3">
                {/* Timeline */}
                <div className="hidden md:flex items-center gap-2 text-sm text-gray-400">
                  <span className="font-mono">{formatTime(currentTime)}</span>
                  <div className="w-24 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-violet-500"
                      style={{ width: `${(currentTime / (scenario?.duration || 1)) * 100}%` }}
                    />
                  </div>
                  <span className="font-mono">{formatTime(scenario?.duration || 0)}</span>
                </div>

                {/* Speed Control */}
                <div className="hidden sm:flex items-center gap-1 bg-gray-800 rounded-lg px-2 py-1">
                  <Zap className="w-3 h-3 text-yellow-500" />
                  <select
                    value={playbackSpeed}
                    onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                    className="bg-transparent text-white text-xs font-medium outline-none cursor-pointer"
                  >
                    <option value={1}>1x</option>
                    <option value={2}>2x</option>
                    <option value={5}>5x</option>
                    <option value={10}>10x</option>
                  </select>
                </div>

                {/* Play/Pause */}
                <button
                  data-tour-id="play-button"
                  onClick={isPlaying ? pause : play}
                  className="p-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl transition-colors"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>

                {/* Reset */}
                <button
                  onClick={reset}
                  className="p-2.5 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-xl transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="relative w-full h-full z-10">
        <AnimatePresence mode="wait">
          {currentMode === 'hud' ? (
            <motion.div
              key="hud-mode"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <HUDModeView windows={windows} />
            </motion.div>
          ) : (
            <motion.div
              key="console-mode"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <ConsoleModeView />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mode Info Badge (하단) */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed bottom-20 left-4 z-[100]"
      >
        <div className="flex items-center gap-2 bg-gray-900/90 backdrop-blur-xl px-4 py-2.5 rounded-xl border border-gray-700 shadow-lg">
          {currentMode === 'hud' ? (
            <>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-gray-300">
                <strong className="text-white">플로팅 모드</strong> - 데스크탑 환경 시뮬레이션
              </span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-sm text-gray-300">
                <strong className="text-white">웹 버전</strong> - Decision OS 대시보드
              </span>
            </>
          )}
        </div>
      </motion.div>

      {/* Help Button */}
      <button
        onClick={() => {
          setShowControls(true) // 컨트롤 패널 먼저 열기
          setTimeout(startTour, 300) // 약간의 딜레이 후 투어 시작
        }}
        className="fixed bottom-20 right-4 z-[100] p-3 bg-gray-900/90 backdrop-blur-xl text-gray-400 hover:text-white rounded-xl border border-gray-700 transition-colors"
      >
        <HelpCircle className="w-5 h-5" />
      </button>

      {/* Quick Play Button (컨트롤이 숨겨져 있을 때) */}
      {!showControls && !isPlaying && currentTime === 0 && (
        <motion.button
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={play}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] flex items-center gap-3 px-8 py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl font-semibold shadow-2xl transition-colors"
        >
          <Play className="w-6 h-6" />
          데모 시작하기
        </motion.button>
      )}
    </div>
  )
}

function HUDModeView({ windows }: { windows: VirtualWindowType[] }) {
  return (
    <VirtualDesktop wallpaper="windows11">
      {/* Render Windows */}
      {windows.map((window) => (
        <VirtualWindow
          key={window.id}
          window={window}
          tourId={window.app === 'zoom' ? 'zoom-window' : window.app === 'slack' ? 'slack-window' : undefined}
        >
          {window.app === 'zoom' && <ZoomSimulator />}
          {window.app === 'slack' && <SlackSimulator />}
        </VirtualWindow>
      ))}

      {/* Onno HUD Overlay */}
      <OnnoHUD />
    </VirtualDesktop>
  )
}

function ConsoleModeView() {
  const { hudState, transcript, zoomState, currentTime, scenario } = useDemoStore()
  const [activeTab, setActiveTab] = useState<'overview' | 'insights' | 'transcript'>('overview')

  // 가상의 액션 아이템 (실제로는 store에서 관리)
  const actionItems = [
    { id: 1, text: '백엔드 팀과 API 연동 미팅 일정 조율', assignee: '이개발', status: 'pending' },
    { id: 2, text: '릴리즈 일정 1주 연기 (12/27)', assignee: '김팀장', status: 'decided' },
    { id: 3, text: 'QA 일정 12/23 시작으로 조정', assignee: '박기획', status: 'pending' },
  ]

  // 가상의 리스크 항목
  const risks = [
    { id: 1, level: 'medium', text: 'API 연동 일정 미확정', suggestion: '백엔드 팀과 빠른 싱크 필요' },
    { id: 2, level: 'low', text: 'QA 기간 3일로 단축됨', suggestion: '핵심 기능 위주 테스트 권장' },
  ]

  const tabs = [
    { id: 'overview', label: '개요', icon: <Layout className="w-4 h-4" /> },
    { id: 'insights', label: 'AI 인사이트', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'transcript', label: '회의록', icon: <FileText className="w-4 h-4" /> },
  ]

  return (
    <div className="w-full h-full bg-[#0f0f13] overflow-auto">
      {/* Header Bar */}
      <div className="sticky top-0 z-20 bg-[#0f0f13]/95 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left - Meeting Info */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold text-white">{zoomState.meetingTitle}</h1>
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-medium rounded-full">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                    LIVE
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {zoomState.participants.length}명 참여 중 • Onno가 분석 중
                </p>
              </div>
            </div>

            {/* Right - Quick Stats */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{hudState.qualityScore}</p>
                <p className="text-xs text-gray-500">회의 점수</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-violet-400">{hudState.insights.length}</p>
                <p className="text-xs text-gray-500">인사이트</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-400">{hudState.questions.length}</p>
                <p className="text-xs text-gray-500">미해결 질문</p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1 mt-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  activeTab === tab.id
                    ? 'bg-violet-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800',
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* AI Intervention Alert (when active) */}
              {hudState.currentIntervention && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 bg-gradient-to-r from-violet-600/20 to-purple-600/20 rounded-2xl border border-violet-500/30"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-violet-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-violet-400 uppercase">AI 개입</span>
                        <span className="px-2 py-0.5 bg-violet-500/30 text-violet-300 text-xs rounded-full">
                          {hudState.currentIntervention.type === 'tangent' && '주제 이탈'}
                          {hudState.currentIntervention.type === 'decision_needed' && '결정 필요'}
                          {hudState.currentIntervention.type === 'time_warning' && '시간 경고'}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-1">
                        {hudState.currentIntervention.title}
                      </h3>
                      <p className="text-sm text-gray-300 mb-3">
                        {hudState.currentIntervention.description}
                      </p>
                      {hudState.currentIntervention.suggestion && (
                        <div className="p-3 bg-white/5 rounded-xl">
                          <p className="text-sm text-violet-200">
                            💡 제안: {hudState.currentIntervention.suggestion}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left - Real-time Feed */}
                <div className="space-y-6">
                  {/* Latest Insights */}
                  <div className="bg-gray-900/50 rounded-2xl border border-gray-800 overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-violet-400" />
                        <h3 className="font-semibold text-white">실시간 인사이트</h3>
                      </div>
                      <span className="text-xs text-gray-500">{hudState.insights.length}개</span>
                    </div>
                    <div className="p-4 space-y-3 max-h-72 overflow-y-auto">
                      {hudState.insights.length > 0 ? (
                        hudState.insights.map((insight, index) => (
                          <motion.div
                            key={insight.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={cn(
                              'p-3 rounded-xl border',
                              insight.type === 'context' && 'bg-blue-500/10 border-blue-500/30',
                              insight.type === 'suggestion' && 'bg-green-500/10 border-green-500/30',
                              insight.type === 'alert' && 'bg-amber-500/10 border-amber-500/30',
                            )}
                          >
                            <div className="flex items-start gap-2">
                              <span className="text-lg">
                                {insight.type === 'context' && '📋'}
                                {insight.type === 'suggestion' && '💡'}
                                {insight.type === 'alert' && '⚠️'}
                              </span>
                              <p className="text-sm text-gray-200">{insight.content}</p>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <Sparkles className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">재생을 시작하면<br />AI 인사이트가 표시됩니다</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Unresolved Questions */}
                  <div className="bg-gray-900/50 rounded-2xl border border-gray-800 overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-amber-400" />
                        <h3 className="font-semibold text-white">미해결 질문</h3>
                      </div>
                      {hudState.questions.length > 0 && (
                        <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-full">
                          {hudState.questions.length}개
                        </span>
                      )}
                    </div>
                    <div className="p-4 space-y-3 max-h-48 overflow-y-auto">
                      {hudState.questions.length > 0 ? (
                        hudState.questions.map((question) => (
                          <motion.div
                            key={question.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/30"
                          >
                            <p className="text-xs text-amber-400 font-medium mb-1">{question.speaker}</p>
                            <p className="text-sm text-gray-200">&ldquo;{question.content}&rdquo;</p>
                          </motion.div>
                        ))
                      ) : (
                        <div className="text-center py-6">
                          <p className="text-sm text-gray-500">✅ 모든 질문이 해결되었습니다</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right - Actions & Risks */}
                <div className="space-y-6">
                  {/* Action Items */}
                  <div className="bg-gray-900/50 rounded-2xl border border-gray-800 overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <h3 className="font-semibold text-white">결정 및 액션 아이템</h3>
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      {actionItems.map((item) => (
                        <div
                          key={item.id}
                          className={cn(
                            'p-3 rounded-xl border flex items-start gap-3',
                            item.status === 'decided'
                              ? 'bg-green-500/10 border-green-500/30'
                              : 'bg-gray-800/50 border-gray-700/50',
                          )}
                        >
                          <div className={cn(
                            'w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
                            item.status === 'decided' ? 'bg-green-500' : 'bg-gray-600',
                          )}>
                            {item.status === 'decided' ? (
                              <Check className="w-3 h-3 text-white" />
                            ) : (
                              <div className="w-2 h-2 bg-gray-400 rounded-full" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-200">{item.text}</p>
                            <p className="text-xs text-gray-500 mt-1">담당: {item.assignee}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Risk Alerts */}
                  <div className="bg-gray-900/50 rounded-2xl border border-gray-800 overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-400" />
                        <h3 className="font-semibold text-white">리스크 감지</h3>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      {risks.map((risk) => (
                        <div
                          key={risk.id}
                          className={cn(
                            'p-3 rounded-xl border',
                            risk.level === 'high' && 'bg-red-500/10 border-red-500/30',
                            risk.level === 'medium' && 'bg-orange-500/10 border-orange-500/30',
                            risk.level === 'low' && 'bg-yellow-500/10 border-yellow-500/30',
                          )}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className={cn(
                              'px-1.5 py-0.5 text-[10px] font-bold uppercase rounded',
                              risk.level === 'high' && 'bg-red-500 text-white',
                              risk.level === 'medium' && 'bg-orange-500 text-white',
                              risk.level === 'low' && 'bg-yellow-500 text-gray-900',
                            )}>
                              {risk.level}
                            </span>
                            <p className="text-sm font-medium text-gray-200">{risk.text}</p>
                          </div>
                          <p className="text-xs text-gray-400 ml-9">→ {risk.suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Participants Grid */}
                  <div className="bg-gray-900/50 rounded-2xl border border-gray-800 overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-800">
                      <h3 className="font-semibold text-white">참석자 ({zoomState.participants.length})</h3>
                    </div>
                    <div className="p-4 grid grid-cols-2 gap-2">
                      {zoomState.participants.map((p) => (
                        <div
                          key={p.id}
                          className={cn(
                            'flex items-center gap-2 p-2 rounded-lg transition-colors',
                            p.isSpeaking ? 'bg-green-500/10' : 'bg-gray-800/30',
                          )}
                        >
                          <div className={cn(
                            'w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold',
                            p.isSpeaking
                              ? 'bg-green-500 ring-2 ring-green-400/50'
                              : 'bg-gradient-to-br from-blue-500 to-purple-600',
                          )}>
                            {p.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-200 truncate">{p.name}</p>
                            {p.isSpeaking && (
                              <p className="text-[10px] text-green-400">발언 중</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'insights' && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="bg-gray-900/50 rounded-2xl border border-gray-800 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-800">
                  <h3 className="font-semibold text-white">AI가 분석한 회의 인사이트</h3>
                  <p className="text-sm text-gray-500 mt-1">Onno가 실시간으로 파악한 중요 정보들</p>
                </div>
                <div className="p-6 space-y-4">
                  {hudState.insights.length > 0 ? (
                    hudState.insights.map((insight, index) => (
                      <motion.div
                        key={insight.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={cn(
                          'p-4 rounded-xl border',
                          insight.type === 'context' && 'bg-blue-500/10 border-blue-500/30',
                          insight.type === 'suggestion' && 'bg-green-500/10 border-green-500/30',
                          insight.type === 'alert' && 'bg-amber-500/10 border-amber-500/30',
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                            insight.type === 'context' && 'bg-blue-500/20',
                            insight.type === 'suggestion' && 'bg-green-500/20',
                            insight.type === 'alert' && 'bg-amber-500/20',
                          )}>
                            {insight.type === 'context' && <FileText className="w-5 h-5 text-blue-400" />}
                            {insight.type === 'suggestion' && <Sparkles className="w-5 h-5 text-green-400" />}
                            {insight.type === 'alert' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                          </div>
                          <div className="flex-1">
                            <span className={cn(
                              'text-xs font-medium uppercase',
                              insight.type === 'context' && 'text-blue-400',
                              insight.type === 'suggestion' && 'text-green-400',
                              insight.type === 'alert' && 'text-amber-400',
                            )}>
                              {insight.type === 'context' && '맥락 정보'}
                              {insight.type === 'suggestion' && '제안'}
                              {insight.type === 'alert' && '주의'}
                            </span>
                            <p className="text-gray-200 mt-1">{insight.content}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-16">
                      <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-8 h-8 text-gray-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-400 mb-2">아직 인사이트가 없습니다</h3>
                      <p className="text-sm text-gray-500">데모를 재생하면 AI가 회의를 분석하여<br />인사이트를 제공합니다</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'transcript' && (
            <motion.div
              key="transcript"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="bg-gray-900/50 rounded-2xl border border-gray-800 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-800">
                  <h3 className="font-semibold text-white">실시간 회의록</h3>
                  <p className="text-sm text-gray-500 mt-1">AI가 자동으로 기록하는 회의 내용</p>
                </div>
                <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto">
                  {transcript.length > 0 ? (
                    transcript.map((entry, index) => (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className="flex gap-4"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {entry.speaker.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-violet-400">{entry.speaker}</span>
                          </div>
                          <p className="text-gray-200">{entry.content}</p>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-16">
                      <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-gray-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-400 mb-2">회의록 대기 중</h3>
                      <p className="text-sm text-gray-500">데모를 재생하면 실시간으로<br />회의 내용이 기록됩니다</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function ConsoleQualityBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-400 w-20">{label}</span>
      <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.5 }}
          className={cn(
            'h-full rounded-full',
            value >= 80 ? 'bg-green-500' : value >= 60 ? 'bg-yellow-500' : 'bg-red-500',
          )}
        />
      </div>
      <span className="text-sm font-medium text-gray-200 w-10 text-right">
        {value}%
      </span>
    </div>
  )
}
