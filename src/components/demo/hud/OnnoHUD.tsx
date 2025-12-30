'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain,
  HelpCircle,
  AlertTriangle,
  Clock,
  Target,
  Lightbulb,
  X,
  Maximize2,
  Minimize2,
  Mic,
  MessageSquare,
  TrendingUp,
  Zap,
  Volume2,
  Check,
  SkipForward,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDemoStore, HUDInsight, HUDQuestion, InterventionData } from '@/stores/demo-store'

export function OnnoHUD() {
  const {
    hudState,
    setHUDMode,
    setHUDPosition,
    dismissIntervention,
    currentTime,
    scenario,
    zoomState,
    transcript,
  } = useDemoStore()

  const { mode, position, insights, questions, qualityScore, currentIntervention } = hudState

  const [showAlert, setShowAlert] = useState(false)
  const [alertExpanded, setAlertExpanded] = useState(false)

  useEffect(() => {
    if (currentIntervention) {
      setShowAlert(true)
      setAlertExpanded(false)

      const timer = setTimeout(() => {
        if (!alertExpanded) {
          setShowAlert(false)
          dismissIntervention()
        }
      }, 10000)

      return () => clearTimeout(timer)
    } else {
      setShowAlert(false)
      setAlertExpanded(false)
    }
  }, [currentIntervention, dismissIntervention])

  const duration = scenario?.duration || 900000
  const progress = (currentTime / duration) * 100
  const meetingMinutes = Math.floor(currentTime / 60000)
  const meetingSeconds = Math.floor((currentTime % 60000) / 1000)

  const handleAdopt = () => {
    console.log('채택:', currentIntervention?.title)
    setShowAlert(false)
    dismissIntervention()
  }

  const handleDefer = () => {
    console.log('보류:', currentIntervention?.title)
    setShowAlert(false)
    dismissIntervention()
  }

  const hudWidth = mode === 'minimized' ? 320 : 420

  return (
    <motion.div
      data-tour-id="onno-hud"
      className="absolute z-[1000] select-none"
      style={{ left: position.x, top: position.y, width: hudWidth }}
      drag
      dragMomentum={false}
      onDragEnd={(_, info) => {
        setHUDPosition({
          x: position.x + info.offset.x,
          y: position.y + info.offset.y,
        })
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity: 1,
        scale: 1,
        width: hudWidth,
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
    >
      {/* 메인 HUD */}
      <div className="relative">
        {/* Soft shadow */}
        <div className="absolute -inset-2 bg-violet-500/10 rounded-3xl blur-2xl" />

        <div
          className={cn(
            'relative w-full rounded-2xl overflow-hidden',
            'bg-white/95 backdrop-blur-xl',
            'border border-gray-200/80',
            'shadow-xl shadow-gray-900/10',
          )}
        >
          <AnimatePresence mode="wait">
            {mode === 'minimized' ? (
              <HUDMinimized
                key="minimized"
                qualityScore={qualityScore}
                meetingMinutes={meetingMinutes}
                meetingSeconds={meetingSeconds}
                currentSpeaker={zoomState.participants.find(p => p.isSpeaking)?.name}
                onExpand={() => setHUDMode('expanded')}
              />
            ) : (
              <HUDExpanded
                key="expanded"
                qualityScore={qualityScore}
                progress={progress}
                meetingMinutes={meetingMinutes}
                meetingSeconds={meetingSeconds}
                meetingTitle={zoomState.meetingTitle}
                insights={insights}
                questions={questions}
                transcript={transcript}
                participants={zoomState.participants}
                onMinimize={() => setHUDMode('minimized')}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 알림 카드 */}
      <AnimatePresence>
        {showAlert && currentIntervention && (
          <AlertCard
            intervention={currentIntervention}
            isExpanded={alertExpanded}
            onToggleExpand={() => setAlertExpanded(!alertExpanded)}
            onAdopt={handleAdopt}
            onDefer={handleDefer}
            onDismiss={() => {
              setShowAlert(false)
              dismissIntervention()
            }}
            hudWidth={hudWidth}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function AlertCard({
  intervention,
  isExpanded,
  onToggleExpand,
  onAdopt,
  onDefer,
  onDismiss,
  hudWidth,
}: {
  intervention: InterventionData
  isExpanded: boolean
  onToggleExpand: () => void
  onAdopt: () => void
  onDefer: () => void
  onDismiss: () => void
  hudWidth: number
}) {
  const config = {
    tangent: {
      icon: <AlertTriangle className="w-5 h-5" />,
      color: 'bg-amber-500',
      lightBg: 'bg-amber-50',
      textColor: 'text-amber-700',
      borderColor: 'border-amber-200',
      gradient: 'from-amber-500 to-orange-500',
      label: '주제 이탈',
    },
    decision_needed: {
      icon: <Target className="w-5 h-5" />,
      color: 'bg-blue-500',
      lightBg: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200',
      gradient: 'from-blue-500 to-indigo-500',
      label: '결정 필요',
    },
    time_warning: {
      icon: <Clock className="w-5 h-5" />,
      color: 'bg-rose-500',
      lightBg: 'bg-rose-50',
      textColor: 'text-rose-700',
      borderColor: 'border-rose-200',
      gradient: 'from-rose-500 to-pink-500',
      label: '시간 알림',
    },
    context: {
      icon: <Lightbulb className="w-5 h-5" />,
      color: 'bg-emerald-500',
      lightBg: 'bg-emerald-50',
      textColor: 'text-emerald-700',
      borderColor: 'border-emerald-200',
      gradient: 'from-emerald-500 to-teal-500',
      label: '컨텍스트',
    },
  }

  const { icon, color, lightBg, textColor, borderColor, gradient, label } = config[intervention.type]

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="mt-3"
      style={{ width: hudWidth }}
    >
      {/* 화살표 */}
      <div className={cn(
        'absolute -top-2 left-8 w-4 h-4 bg-white border-l border-t transform rotate-45',
        borderColor,
      )} />

      <div className={cn(
        'relative bg-white rounded-2xl border shadow-xl shadow-gray-900/10 overflow-hidden',
        borderColor,
      )}>
        {/* 컬러 액센트 바 */}
        <div className={cn('h-1 w-full bg-gradient-to-r', gradient)} />

        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center text-white flex-shrink-0', color)}>
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={cn(
                  'text-[10px] font-bold uppercase px-2 py-0.5 rounded-full',
                  lightBg, textColor,
                )}>
                  {label}
                </span>
                <span className="text-[10px] text-gray-400 font-medium">Onno AI</span>
              </div>
              <p className="text-sm font-semibold text-gray-900">{intervention.title}</p>
              {!isExpanded && (
                <p className="text-xs text-gray-500 mt-1 line-clamp-1">{intervention.description}</p>
              )}
            </div>
            <button
              onClick={onDismiss}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          <button
            onClick={onToggleExpand}
            className="w-full mt-3 py-1.5 flex items-center justify-center gap-1 text-xs text-violet-600 hover:text-violet-700 font-medium transition-colors"
          >
            {isExpanded ? (
              <>접기 <ChevronUp className="w-3 h-3" /></>
            ) : (
              <>자세히 보기 <ChevronDown className="w-3 h-3" /></>
            )}
          </button>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 space-y-3">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-700 leading-relaxed">{intervention.description}</p>
                </div>

                {intervention.suggestion && (
                  <div className="p-3 bg-violet-50 rounded-xl border border-violet-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="w-4 h-4 text-violet-600" />
                      <span className="text-xs text-violet-600 font-semibold">AI 제안</span>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                      {intervention.suggestion}
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={onAdopt}
                    className={cn(
                      'flex-1 py-2.5 px-4 text-white text-sm font-semibold rounded-xl transition-all',
                      'bg-gradient-to-r shadow-md hover:shadow-lg hover:scale-[1.02]',
                      gradient,
                    )}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Check className="w-4 h-4" />
                      쓰기 (채택)
                    </span>
                  </button>
                  <button
                    onClick={onDefer}
                    className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition-colors"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <SkipForward className="w-4 h-4" />
                      패스 (보류)
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!isExpanded && (
          <div className="px-4 pb-4 flex gap-2">
            <button
              onClick={onAdopt}
              className={cn(
                'flex-1 py-2 text-white text-xs font-semibold rounded-lg transition-all hover:opacity-90',
                `bg-gradient-to-r ${gradient}`,
              )}
            >
              <Check className="w-3.5 h-3.5 inline mr-1" />
              채택
            </button>
            <button
              onClick={onDefer}
              className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold rounded-lg transition-colors"
            >
              <SkipForward className="w-3.5 h-3.5 inline mr-1" />
              보류
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}

function HUDMinimized({
  qualityScore,
  meetingMinutes,
  meetingSeconds,
  currentSpeaker,
  onExpand,
}: {
  qualityScore: number
  meetingMinutes: number
  meetingSeconds: number
  currentSpeaker?: string
  onExpand: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full px-4 py-3 flex items-center justify-between cursor-move"
    >
      {/* Left - Logo & Status */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-900">Onno</span>
            <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-semibold">
              LIVE
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="font-mono font-medium text-gray-700">{meetingMinutes}:{meetingSeconds.toString().padStart(2, '0')}</span>
            {currentSpeaker && (
              <>
                <span className="text-gray-300">·</span>
                <span className="flex items-center gap-1">
                  <Volume2 className="w-3 h-3 text-emerald-500" />
                  <span className="text-gray-600">{currentSpeaker}</span>
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right - Quality Score & Actions */}
      <div className="flex items-center gap-3">
        <div className="relative w-11 h-11">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="22"
              cy="22"
              r="18"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              className="text-gray-100"
            />
            <circle
              cx="22"
              cy="22"
              r="18"
              stroke="url(#qualityGradientMini)"
              strokeWidth="3"
              fill="none"
              strokeDasharray={`${(qualityScore / 100) * 113} 113`}
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="qualityGradientMini" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#d946ef" />
              </linearGradient>
            </defs>
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-900">
            {qualityScore}
          </span>
        </div>

        <button
          onClick={onExpand}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Maximize2 className="w-4 h-4 text-gray-500" />
        </button>
      </div>
    </motion.div>
  )
}

function HUDExpanded({
  qualityScore,
  progress,
  meetingMinutes,
  meetingSeconds,
  meetingTitle,
  insights,
  questions,
  transcript,
  participants,
  onMinimize,
}: {
  qualityScore: number
  progress: number
  meetingMinutes: number
  meetingSeconds: number
  meetingTitle: string
  insights: HUDInsight[]
  questions: HUDQuestion[]
  transcript: Array<{ id: string; speaker: string; content: string }>
  participants: Array<{ id: string; name: string; isSpeaking: boolean }>
  onMinimize: () => void
}) {
  const currentSpeaker = participants.find(p => p.isSpeaking)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full flex flex-col cursor-move"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">{meetingTitle}</h3>
              <div className="flex items-center gap-2 text-xs">
                <span className="font-mono font-medium text-gray-700">{meetingMinutes}:{meetingSeconds.toString().padStart(2, '0')}</span>
                <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px] font-semibold">
                  실시간 분석
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onMinimize}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Minimize2 className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="relative h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 rounded-full"
          />
        </div>
      </div>

      {/* Quality Score Section */}
      <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-violet-50/50 to-fuchsia-50/50">
        <div className="flex items-center gap-4">
          {/* Circular Quality Gauge */}
          <div className="relative w-20 h-20 flex-shrink-0">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="34"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                className="text-white"
              />
              <circle
                cx="40"
                cy="40"
                r="34"
                stroke="url(#qualityGradient)"
                strokeWidth="6"
                fill="none"
                strokeDasharray={`${(qualityScore / 100) * 213.6} 213.6`}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="qualityGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="50%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#d946ef" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-gray-900">{qualityScore}</span>
              <span className="text-[10px] text-gray-500 font-medium">품질 점수</span>
            </div>
          </div>

          {/* Quality Metrics */}
          <div className="flex-1 space-y-2.5">
            <QualityMetric icon={<Mic className="w-3.5 h-3.5" />} label="참여도" value={85} />
            <QualityMetric icon={<Target className="w-3.5 h-3.5" />} label="집중도" value={78} />
            <QualityMetric icon={<TrendingUp className="w-3.5 h-3.5" />} label="진행률" value={Math.round(progress)} />
          </div>
        </div>
      </div>

      {/* Live Transcript Preview */}
      {currentSpeaker && transcript.length > 0 && (
        <div className="px-5 py-3 border-b border-gray-100 bg-violet-50/50">
          <div className="flex items-start gap-3">
            <div className="relative flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                {currentSpeaker.name.charAt(0)}
              </div>
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-violet-600 font-semibold mb-0.5">{currentSpeaker.name}</p>
              <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">
                {transcript[transcript.length - 1]?.content || '발언 중...'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Insights & Questions */}
      <div className="flex-1 overflow-y-auto max-h-[280px]">
        <div className="p-5 space-y-4">
          {/* Insights */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg bg-violet-100 flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-violet-600" />
              </div>
              <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                실시간 인사이트
              </h4>
            </div>

            {insights.length > 0 ? (
              <div className="space-y-2">
                {insights.slice(-3).map((insight) => (
                  <InsightCard key={insight.id} insight={insight} />
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-xl">
                회의를 분석하고 있습니다...
              </div>
            )}
          </div>

          {/* Questions */}
          {questions.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  미해결 질문 ({questions.length})
                </h4>
              </div>
              <div className="space-y-2">
                {questions.slice(-2).map((question) => (
                  <QuestionCard key={question.id} question={question} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {participants.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-sm',
                    p.isSpeaking
                      ? 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white'
                      : 'bg-gray-200 text-gray-600',
                  )}
                >
                  {p.name.charAt(0)}
                </div>
              ))}
            </div>
            <span className="text-xs text-gray-500 font-medium">{participants.length}명 참석</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Onno AI 분석 중
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function QualityMetric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: number
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="text-gray-400">{icon}</div>
      <span className="text-xs text-gray-600 w-12 font-medium">{label}</span>
      <div className="flex-1 h-2 bg-white rounded-full overflow-hidden shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.5 }}
          className={cn(
            'h-full rounded-full',
            value >= 80
              ? 'bg-gradient-to-r from-emerald-400 to-teal-400'
              : value >= 60
              ? 'bg-gradient-to-r from-amber-400 to-yellow-400'
              : 'bg-gradient-to-r from-rose-400 to-pink-400',
          )}
        />
      </div>
      <span className="text-xs font-bold text-gray-700 w-8 text-right">{value}%</span>
    </div>
  )
}

function InsightCard({ insight }: { insight: HUDInsight }) {
  const config = {
    context: {
      icon: <Brain className="w-4 h-4" />,
      bgClass: 'bg-blue-50 border-blue-100',
      iconClass: 'text-blue-600',
      textClass: 'text-gray-700',
    },
    suggestion: {
      icon: <Lightbulb className="w-4 h-4" />,
      bgClass: 'bg-emerald-50 border-emerald-100',
      iconClass: 'text-emerald-600',
      textClass: 'text-gray-700',
    },
    alert: {
      icon: <AlertTriangle className="w-4 h-4" />,
      bgClass: 'bg-amber-50 border-amber-100',
      iconClass: 'text-amber-600',
      textClass: 'text-gray-700',
    },
  }

  const { icon, bgClass, iconClass, textClass } = config[insight.type]

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn('flex items-start gap-3 p-3 rounded-xl border', bgClass)}
    >
      <div className={cn('mt-0.5 flex-shrink-0', iconClass)}>{icon}</div>
      <p className={cn('text-sm flex-1 leading-relaxed', textClass)}>{insight.content}</p>
    </motion.div>
  )
}

function QuestionCard({ question }: { question: HUDQuestion }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100"
    >
      <div className="w-7 h-7 rounded-full bg-amber-200 flex items-center justify-center flex-shrink-0">
        <span className="text-xs font-bold text-amber-700">{question.speaker.charAt(0)}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-amber-700 font-semibold mb-0.5">{question.speaker}</p>
        <p className="text-sm text-gray-700 leading-relaxed">{question.content}</p>
      </div>
      <MessageSquare className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
    </motion.div>
  )
}
