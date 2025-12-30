'use client'

import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertCircle, Info, X, Sparkles, Trophy, Star, Heart } from 'lucide-react'

/**
 * Feedback System - 노먼의 3단계 감정 설계
 *
 * 본능적(Visceral): 시각적 애니메이션, 색상
 * 행동적(Behavioral): 즉각적 피드백, 상태 변화
 * 반성적(Reflective): 성취감, 의미 부여
 */

// ============ Toast Notifications ============

type ToastType = 'success' | 'error' | 'info' | 'celebration'

interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void
  showSuccess: (title: string, message?: string) => void
  showError: (title: string, message?: string) => void
  showCelebration: (title: string, message?: string) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}

const toastConfig = {
  success: {
    icon: CheckCircle,
    bg: 'bg-green-50',
    border: 'border-green-200',
    iconColor: 'text-green-500',
    titleColor: 'text-green-800',
  },
  error: {
    icon: AlertCircle,
    bg: 'bg-red-50',
    border: 'border-red-200',
    iconColor: 'text-red-500',
    titleColor: 'text-red-800',
  },
  info: {
    icon: Info,
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    iconColor: 'text-blue-500',
    titleColor: 'text-blue-800',
  },
  celebration: {
    icon: Trophy,
    bg: 'bg-gradient-to-r from-yellow-50 to-orange-50',
    border: 'border-yellow-200',
    iconColor: 'text-yellow-500',
    titleColor: 'text-yellow-800',
  },
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts(prev => [...prev, { ...toast, id }])

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, toast.duration || 4000)
  }

  const showSuccess = (title: string, message?: string) => {
    showToast({ type: 'success', title, message })
  }

  const showError = (title: string, message?: string) => {
    showToast({ type: 'error', title, message })
  }

  const showCelebration = (title: string, message?: string) => {
    showToast({ type: 'celebration', title, message, duration: 5000 })
  }

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ showToast, showSuccess, showError, showCelebration }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map(toast => {
            const config = toastConfig[toast.type]
            const Icon = config.icon

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 100, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 100, scale: 0.9 }}
                className={`${config.bg} ${config.border} border rounded-xl p-4 shadow-lg min-w-[300px] max-w-sm`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 ${config.iconColor}`}>
                    {toast.type === 'celebration' ? (
                      <motion.div
                        animate={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 0.5, repeat: 2 }}
                      >
                        <Icon size={20} />
                      </motion.div>
                    ) : (
                      <Icon size={20} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium ${config.titleColor}`}>{toast.title}</p>
                    {toast.message && (
                      <p className="text-sm text-gray-600 mt-1">{toast.message}</p>
                    )}
                  </div>
                  <button
                    onClick={() => dismissToast(toast.id)}
                    className="flex-shrink-0 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Progress bar */}
                <motion.div
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: 0 }}
                  transition={{ duration: (toast.duration || 4000) / 1000, ease: 'linear' }}
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 origin-left rounded-b-xl overflow-hidden"
                />
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

// ============ Confetti Effect ============

interface ConfettiProps {
  active: boolean
  onComplete?: () => void
}

export function Confetti({ active, onComplete }: ConfettiProps) {
  const [particles, setParticles] = useState<Array<{
    id: number
    x: number
    color: string
    delay: number
  }>>([])

  useEffect(() => {
    if (active) {
      const newParticles = Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B'][
          Math.floor(Math.random() * 5)
        ],
        delay: Math.random() * 0.5,
      }))
      setParticles(newParticles)

      const timer = setTimeout(() => {
        setParticles([])
        onComplete?.()
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [active, onComplete])

  if (!active || particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[200] overflow-hidden">
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          initial={{
            x: `${particle.x}vw`,
            y: '-10px',
            rotate: 0,
            scale: 1,
          }}
          animate={{
            y: '110vh',
            rotate: Math.random() * 720 - 360,
            scale: 0,
          }}
          transition={{
            duration: 2 + Math.random(),
            delay: particle.delay,
            ease: 'easeIn',
          }}
          className="absolute w-3 h-3"
          style={{ backgroundColor: particle.color }}
        />
      ))}
    </div>
  )
}

// ============ Success Animation ============

interface SuccessAnimationProps {
  show: boolean
  message?: string
  onComplete?: () => void
}

export function SuccessAnimation({ show, message = '완료!', onComplete }: SuccessAnimationProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onComplete?.()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [show, onComplete])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', damping: 15 }}
            className="bg-white rounded-3xl p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center"
            >
              <motion.div
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <CheckCircle size={40} className="text-green-500" />
              </motion.div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-xl font-bold text-gray-900"
            >
              {message}
            </motion.p>

            {/* Sparkles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                initial={{
                  opacity: 0,
                  scale: 0,
                  x: '50%',
                  y: '50%',
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: `${50 + Math.cos((i * 60 * Math.PI) / 180) * 80}%`,
                  y: `${50 + Math.sin((i * 60 * Math.PI) / 180) * 80}%`,
                }}
                transition={{
                  delay: 0.3 + i * 0.1,
                  duration: 0.6,
                }}
              >
                <Star size={16} className="text-yellow-400" fill="currentColor" />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ============ Pulse Button ============

interface PulseButtonProps {
  children: ReactNode
  onClick?: () => void
  className?: string
  pulseColor?: string
}

export function PulseButton({
  children,
  onClick,
  className = '',
  pulseColor = 'rgba(59, 130, 246, 0.5)',
}: PulseButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`relative ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Pulse rings */}
      <span className="absolute inset-0 rounded-xl">
        <motion.span
          className="absolute inset-0 rounded-xl"
          style={{ backgroundColor: pulseColor }}
          animate={{
            scale: [1, 1.5],
            opacity: [0.5, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      </span>
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}
