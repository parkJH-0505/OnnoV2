'use client'

import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Shield,
  Users,
  Lightbulb,
  FileText,
  AlertTriangle,
  Play,
  Pause
} from 'lucide-react'
import { CardType } from './InterventionCard'

interface TimelineEvent {
  id: string
  type: CardType | 'speech'
  timestamp: number // seconds from start
  speaker?: string
  content: string
  title?: string
}

interface TimelineProps {
  events: TimelineEvent[]
  currentTime: number
  duration: number
  isPlaying: boolean
  onSeek?: (time: number) => void
  onPlayPause?: () => void
}

const typeIcons: Record<CardType, typeof ArrowRight> = {
  forward: ArrowRight,
  safety: Shield,
  relation: Users,
  bypass: Lightbulb,
  summary: FileText,
  constraint: AlertTriangle,
}

const typeColors: Record<CardType, string> = {
  forward: 'bg-emerald-500',
  safety: 'bg-amber-500',
  relation: 'bg-blue-500',
  bypass: 'bg-purple-500',
  summary: 'bg-gray-500',
  constraint: 'bg-red-500',
}

export function Timeline({
  events,
  currentTime,
  duration,
  isPlaying,
  onSeek,
  onPlayPause,
}: TimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null)
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progress = (currentTime / duration) * 100

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return
    const rect = timelineRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = x / rect.width
    const newTime = percentage * duration
    onSeek?.(newTime)
  }

  // Filter intervention events (not speech)
  const interventionEvents = events.filter(e => e.type !== 'speech')

  return (
    <div className="bg-gray-900/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-gray-700/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onPlayPause}
            className="w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center text-white transition-colors"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
          </button>
          <div>
            <p className="text-white font-medium">회의 타임라인</p>
            <p className="text-xs text-gray-400">
              {formatTime(currentTime)} / {formatTime(duration)}
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2">
          {Object.entries(typeColors).slice(0, 4).map(([type, color]) => (
            <div key={type} className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${color}`} />
              <span className="text-[10px] text-gray-500 capitalize">{type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline Bar */}
      <div
        ref={timelineRef}
        onClick={handleTimelineClick}
        className="relative h-12 bg-gray-800 rounded-lg cursor-pointer overflow-hidden"
      >
        {/* Progress */}
        <motion.div
          className="absolute top-0 left-0 h-full bg-blue-500/20"
          style={{ width: `${progress}%` }}
        />

        {/* Current time indicator */}
        <motion.div
          className="absolute top-0 h-full w-0.5 bg-blue-500 z-10"
          style={{ left: `${progress}%` }}
        >
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-500 rounded-full" />
        </motion.div>

        {/* Event markers */}
        {interventionEvents.map((event) => {
          const position = (event.timestamp / duration) * 100
          const Icon = typeIcons[event.type as CardType]
          const color = typeColors[event.type as CardType]

          return (
            <motion.div
              key={event.id}
              className="absolute top-1/2 -translate-y-1/2 z-20"
              style={{ left: `${position}%` }}
              onMouseEnter={() => setHoveredEvent(event.id)}
              onMouseLeave={() => setHoveredEvent(null)}
              whileHover={{ scale: 1.3 }}
            >
              <div className={`w-4 h-4 rounded-full ${color} flex items-center justify-center shadow-lg`}>
                <Icon size={8} className="text-white" />
              </div>

              {/* Tooltip */}
              {hoveredEvent === event.id && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 rounded-lg shadow-xl whitespace-nowrap z-30"
                >
                  <p className="text-xs font-medium text-white">{event.title}</p>
                  <p className="text-[10px] text-gray-400">{formatTime(event.timestamp)}</p>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-gray-800 rotate-45" />
                </motion.div>
              )}
            </motion.div>
          )
        })}

        {/* Time markers */}
        {[0, 25, 50, 75, 100].map((percent) => (
          <div
            key={percent}
            className="absolute top-0 h-full border-l border-gray-700/50"
            style={{ left: `${percent}%` }}
          >
            <span className="absolute bottom-1 left-1 text-[8px] text-gray-600">
              {formatTime((percent / 100) * duration)}
            </span>
          </div>
        ))}
      </div>

      {/* Recent Events */}
      <div className="mt-4 space-y-2">
        <p className="text-xs text-gray-500 font-medium">최근 감지된 내용</p>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {interventionEvents.slice(-5).reverse().map((event) => {
            const Icon = typeIcons[event.type as CardType]
            const color = typeColors[event.type as CardType]

            return (
              <button
                key={event.id}
                onClick={() => onSeek?.(event.timestamp)}
                className="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <div className={`w-5 h-5 rounded ${color} flex items-center justify-center`}>
                  <Icon size={10} className="text-white" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-white truncate max-w-[120px]">{event.title}</p>
                  <p className="text-[10px] text-gray-500">{formatTime(event.timestamp)}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
