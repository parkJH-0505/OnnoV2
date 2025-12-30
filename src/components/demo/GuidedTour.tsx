'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, ArrowLeft, Brain, Sparkles, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface TourStep {
  id: string
  targetId: string // data-tour-id attribute value
  title: string
  description: string
  icon?: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center'
  align?: 'start' | 'center' | 'end'
  highlightPadding?: number
}

interface GuidedTourProps {
  steps: TourStep[]
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

export function GuidedTour({ steps, isOpen, onClose, onComplete }: GuidedTourProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const tooltipRef = useRef<HTMLDivElement>(null)

  const step = steps[currentStep]

  // Find and position tooltip relative to target element
  const updatePosition = useCallback(() => {
    if (!step) return

    // center 위치는 특별 처리 (화면 중앙)
    if (step.position === 'center' || !step.targetId) {
      setTargetRect(null)
      setTooltipPosition({
        top: window.innerHeight / 2,
        left: window.innerWidth / 2,
      })
      return
    }

    const target = document.querySelector(`[data-tour-id="${step.targetId}"]`)
    if (!target) {
      // 타겟을 찾을 수 없으면 화면 중앙에 표시
      setTargetRect(null)
      setTooltipPosition({
        top: window.innerHeight / 2,
        left: window.innerWidth / 2,
      })
      return
    }

    const rect = target.getBoundingClientRect()
    setTargetRect(rect)

    const padding = step.highlightPadding ?? 8
    const tooltipWidth = 340
    const tooltipHeight = 200 // 예상 높이

    let top = 0
    let left = 0

    switch (step.position) {
      case 'top':
        top = rect.top - tooltipHeight - 16
        left = step.align === 'start' ? rect.left :
               step.align === 'end' ? rect.right - tooltipWidth :
               rect.left + rect.width / 2 - tooltipWidth / 2
        break
      case 'bottom':
        top = rect.bottom + 16
        left = step.align === 'start' ? rect.left :
               step.align === 'end' ? rect.right - tooltipWidth :
               rect.left + rect.width / 2 - tooltipWidth / 2
        break
      case 'left':
        top = rect.top + rect.height / 2 - tooltipHeight / 2
        left = rect.left - tooltipWidth - 16
        break
      case 'right':
        top = rect.top + rect.height / 2 - tooltipHeight / 2
        left = rect.right + 16
        break
      default:
        top = rect.bottom + 16
        left = rect.left + rect.width / 2 - tooltipWidth / 2
    }

    // 화면 경계 체크
    left = Math.max(16, Math.min(left, window.innerWidth - tooltipWidth - 16))
    top = Math.max(16, Math.min(top, window.innerHeight - tooltipHeight - 16))

    setTooltipPosition({ top, left })
  }, [step])

  useEffect(() => {
    if (isOpen) {
      updatePosition()
      window.addEventListener('resize', updatePosition)
      window.addEventListener('scroll', updatePosition)

      // 타겟 요소가 늦게 렌더링될 수 있으므로 약간의 딜레이 후 재계산
      const timer = setTimeout(updatePosition, 100)

      return () => {
        window.removeEventListener('resize', updatePosition)
        window.removeEventListener('scroll', updatePosition)
        clearTimeout(timer)
      }
    }
  }, [isOpen, currentStep, updatePosition])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    onClose()
  }

  if (!isOpen || !step) return null

  const isCenter = step.position === 'center' || !targetRect
  const padding = step.highlightPadding ?? 8

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[5000]"
      >
        {/* Spotlight overlay */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <mask id="spotlight-mask">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              {targetRect && (
                <motion.rect
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  x={targetRect.left - padding}
                  y={targetRect.top - padding}
                  width={targetRect.width + padding * 2}
                  height={targetRect.height + padding * 2}
                  rx="12"
                  fill="black"
                />
              )}
            </mask>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="rgba(0, 0, 0, 0.75)"
            mask="url(#spotlight-mask)"
            className="pointer-events-auto"
            onClick={handleSkip}
          />
        </svg>

        {/* Highlight border around target */}
        {targetRect && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute pointer-events-none"
            style={{
              top: targetRect.top - padding,
              left: targetRect.left - padding,
              width: targetRect.width + padding * 2,
              height: targetRect.height + padding * 2,
            }}
          >
            <div className="absolute inset-0 rounded-xl border-2 border-violet-500 shadow-lg shadow-violet-500/30" />
            <div className="absolute -inset-1 rounded-xl border border-violet-400/50 animate-pulse" />
          </motion.div>
        )}

        {/* Tooltip */}
        <motion.div
          ref={tooltipRef}
          key={step.id}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className={cn(
            'absolute z-10 w-[340px]',
            isCenter && '-translate-x-1/2 -translate-y-1/2'
          )}
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
          }}
        >
          <div className="bg-gray-900 rounded-2xl border border-gray-700 shadow-2xl shadow-black/50 overflow-hidden">
            {/* Header */}
            <div className="relative px-5 py-4 bg-gradient-to-r from-violet-600/20 to-purple-600/20 border-b border-gray-700/50">
              <div className="flex items-center gap-3">
                {step.icon ? (
                  <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center text-white">
                    {step.icon}
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
                    <Sparkles className="w-5 h-5" />
                  </div>
                )}
                <div>
                  <p className="text-[10px] text-violet-400 uppercase font-semibold tracking-wide">
                    가이드 {currentStep + 1}/{steps.length}
                  </p>
                  <h3 className="text-lg font-bold text-white">{step.title}</h3>
                </div>
              </div>
              <button
                onClick={handleSkip}
                className="absolute top-3 right-3 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="px-5 py-4">
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                {step.description}
              </p>
            </div>

            {/* Progress & Navigation */}
            <div className="px-5 py-4 bg-gray-800/50 border-t border-gray-700/50">
              {/* Step indicators */}
              <div className="flex justify-center gap-1.5 mb-4">
                {steps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentStep(i)}
                    className={cn(
                      'h-1.5 rounded-full transition-all',
                      i === currentStep
                        ? 'w-6 bg-violet-500'
                        : i < currentStep
                        ? 'w-1.5 bg-violet-400/50'
                        : 'w-1.5 bg-gray-600'
                    )}
                  />
                ))}
              </div>

              {/* Navigation buttons */}
              <div className="flex gap-2">
                {currentStep > 0 ? (
                  <button
                    onClick={handlePrev}
                    className="flex items-center gap-1 px-4 py-2.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-xl text-sm font-medium transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    이전
                  </button>
                ) : (
                  <button
                    onClick={handleSkip}
                    className="px-4 py-2.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-xl text-sm font-medium transition-colors"
                  >
                    건너뛰기
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-medium transition-colors"
                >
                  {currentStep === steps.length - 1 ? (
                    <>
                      <Check className="w-4 h-4" />
                      시작하기
                    </>
                  ) : (
                    <>
                      다음
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Pointer arrow */}
          {targetRect && step.position !== 'center' && (
            <div
              className={cn(
                'absolute w-4 h-4 bg-gray-900 border-gray-700 rotate-45',
                step.position === 'top' && 'bottom-[-8px] left-1/2 -translate-x-1/2 border-r border-b',
                step.position === 'bottom' && 'top-[-8px] left-1/2 -translate-x-1/2 border-l border-t',
                step.position === 'left' && 'right-[-8px] top-1/2 -translate-y-1/2 border-t border-r',
                step.position === 'right' && 'left-[-8px] top-1/2 -translate-y-1/2 border-b border-l',
              )}
            />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
