'use client'

import { motion } from 'framer-motion'

/**
 * ProgressRing - 목표 그래디언트 효과 적용
 *
 * 심리학 원리:
 * - 목표 그래디언트: 목표에 가까울수록 동기 증가
 * - 엔도우드 프로그레스: 시작점 제공으로 완료 욕구 자극
 * - 시각적 피드백: 진행 상황 명확히 인지
 */

interface ProgressRingProps {
  progress: number // 0-100
  size?: number
  strokeWidth?: number
  showPercentage?: boolean
  label?: string
  color?: 'blue' | 'green' | 'purple'
}

export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  showPercentage = true,
  label,
  color = 'blue',
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  const colors = {
    blue: {
      gradient: ['#3B82F6', '#8B5CF6'],
      bg: '#E0E7FF',
      text: 'text-blue-600',
    },
    green: {
      gradient: ['#10B981', '#059669'],
      bg: '#D1FAE5',
      text: 'text-green-600',
    },
    purple: {
      gradient: ['#8B5CF6', '#EC4899'],
      bg: '#EDE9FE',
      text: 'text-purple-600',
    },
  }

  const currentColor = colors[color]

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={currentColor.bg}
          strokeWidth={strokeWidth}
        />

        {/* Gradient definition */}
        <defs>
          <linearGradient id={`progress-gradient-${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={currentColor.gradient[0]} />
            <stop offset="100%" stopColor={currentColor.gradient[1]} />
          </linearGradient>
        </defs>

        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#progress-gradient-${color})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showPercentage && (
          <motion.span
            key={progress}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`text-2xl font-bold ${currentColor.text}`}
          >
            {Math.round(progress)}%
          </motion.span>
        )}
        {label && (
          <span className="text-xs text-gray-500 mt-1">{label}</span>
        )}
      </div>
    </div>
  )
}

/**
 * StepProgress - 단계별 진행 표시
 *
 * 적용 원리:
 * - 청킹: 큰 작업을 작은 단위로 분리
 * - 성취감: 각 단계 완료 시 시각적 보상
 */

interface StepProgressProps {
  currentStep: number
  totalSteps: number
  labels?: string[]
}

export function StepProgress({ currentStep, totalSteps, labels }: StepProgressProps) {
  return (
    <div className="flex items-center justify-between w-full max-w-md mx-auto">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1
        const isCompleted = stepNumber < currentStep
        const isCurrent = stepNumber === currentStep
        const isLast = stepNumber === totalSteps

        return (
          <div key={index} className="flex items-center flex-1">
            {/* Step indicator */}
            <div className="flex flex-col items-center">
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${
                  isCompleted
                    ? 'bg-green-500 text-white'
                    : isCurrent
                    ? 'bg-blue-500 text-white ring-4 ring-blue-100'
                    : 'bg-gray-100 text-gray-400'
                }`}
                animate={{
                  scale: isCurrent ? 1.1 : 1,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {isCompleted ? (
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </motion.svg>
                ) : (
                  stepNumber
                )}
              </motion.div>

              {/* Label */}
              {labels && labels[index] && (
                <span className={`mt-2 text-xs ${
                  isCurrent ? 'text-blue-600 font-medium' : 'text-gray-400'
                }`}>
                  {labels[index]}
                </span>
              )}
            </div>

            {/* Connector line */}
            {!isLast && (
              <div className="flex-1 h-0.5 mx-2 bg-gray-100 relative overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-green-500"
                  initial={{ width: '0%' }}
                  animate={{ width: isCompleted ? '100%' : '0%' }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
