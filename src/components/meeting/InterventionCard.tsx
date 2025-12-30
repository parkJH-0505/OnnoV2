'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  Shield,
  Users,
  Lightbulb,
  FileText,
  AlertTriangle,
  X,
  Check,
  Clock,
  ChevronRight,
  Bookmark,
  Share2
} from 'lucide-react'

// Card types based on Onno intervention system
export type CardType = 'forward' | 'safety' | 'relation' | 'bypass' | 'summary' | 'constraint'

interface InterventionCardProps {
  id: string
  type: CardType
  title: string
  content: string
  timestamp: string
  speaker?: string
  isNew?: boolean
  onDismiss?: (id: string) => void
  onAction?: (id: string, action: string) => void
}

const cardConfig: Record<CardType, {
  icon: typeof ArrowRight
  label: string
  color: string
  bgColor: string
  borderColor: string
  description: string
}> = {
  forward: {
    icon: ArrowRight,
    label: '진행',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    description: '결정사항 또는 다음 단계',
  },
  safety: {
    icon: Shield,
    label: '안전',
    color: 'text-amber-500',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    description: '리스크 또는 주의사항',
  },
  relation: {
    icon: Users,
    label: '관계',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    description: '담당자 또는 역할 지정',
  },
  bypass: {
    icon: Lightbulb,
    label: '우회',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    description: '대안 또는 새로운 아이디어',
  },
  summary: {
    icon: FileText,
    label: '요약',
    color: 'text-gray-500',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    description: '주요 내용 정리',
  },
  constraint: {
    icon: AlertTriangle,
    label: '제약',
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    description: '제한사항 또는 블로커',
  },
}

export function InterventionCard({
  id,
  type,
  title,
  content,
  timestamp,
  speaker,
  isNew = false,
  onDismiss,
  onAction,
}: InterventionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const config = cardConfig[type]
  const Icon = config.icon

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden rounded-xl border ${config.borderColor} ${config.bgColor} shadow-lg backdrop-blur-sm`}
      style={{ width: 320 }}
    >
      {/* New indicator */}
      {isNew && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 3 }}
          className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"
        />
      )}

      {/* Header */}
      <div className="px-4 py-3 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${config.bgColor} border ${config.borderColor}`}>
            <Icon size={18} className={config.color} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold uppercase tracking-wide ${config.color}`}>
                {config.label}
              </span>
              {isNew && (
                <span className="px-1.5 py-0.5 bg-blue-500 text-white text-[10px] font-bold rounded">
                  NEW
                </span>
              )}
            </div>
            <p className="text-sm font-medium text-gray-900 mt-0.5">{title}</p>
          </div>
        </div>

        <button
          onClick={() => onDismiss?.(id)}
          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-lg transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className={`text-sm text-gray-600 ${isExpanded ? '' : 'line-clamp-2'}`}>
          "{content}"
        </p>
        {content.length > 80 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-blue-500 hover:text-blue-600 mt-1"
          >
            {isExpanded ? '접기' : '더보기'}
          </button>
        )}
      </div>

      {/* Meta */}
      <div className="px-4 py-2 bg-white/50 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Clock size={12} />
          <span>{timestamp}</span>
          {speaker && (
            <>
              <span>·</span>
              <span>{speaker}</span>
            </>
          )}
        </div>

        {/* Actions */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex items-center gap-1"
            >
              <button
                onClick={() => onAction?.(id, 'bookmark')}
                className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                title="북마크"
              >
                <Bookmark size={12} />
              </button>
              <button
                onClick={() => onAction?.(id, 'share')}
                className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                title="공유"
              >
                <Share2 size={12} />
              </button>
              <button
                onClick={() => onAction?.(id, 'confirm')}
                className="p-1.5 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                title="확인"
              >
                <Check size={12} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// Card Stack for displaying multiple cards
interface CardStackProps {
  cards: Array<{
    id: string
    type: CardType
    title: string
    content: string
    timestamp: string
    speaker?: string
  }>
  onDismiss?: (id: string) => void
  onAction?: (id: string, action: string) => void
}

export function CardStack({ cards, onDismiss, onAction }: CardStackProps) {
  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-3">
      <AnimatePresence mode="popLayout">
        {cards.slice(0, 3).map((card, index) => (
          <InterventionCard
            key={card.id}
            {...card}
            isNew={index === 0}
            onDismiss={onDismiss}
            onAction={onAction}
          />
        ))}
      </AnimatePresence>

      {cards.length > 3 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <button className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 mx-auto">
            +{cards.length - 3}개 더 보기
            <ChevronRight size={12} />
          </button>
        </motion.div>
      )}
    </div>
  )
}
