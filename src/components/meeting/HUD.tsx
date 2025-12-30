'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Settings,
  Minimize2,
  Maximize2,
  X,
  Clock,
  Users,
  FileText,
  AlertCircle,
  ChevronUp,
  ChevronDown
} from 'lucide-react'

interface HUDProps {
  isRecording: boolean
  meetingDuration: number // in seconds
  participantCount: number
  decisionCount: number
  actionItemCount: number
  onToggleMinimize?: () => void
  onClose?: () => void
}

export function HUD({
  isRecording,
  meetingDuration,
  participantCount,
  decisionCount,
  actionItemCount,
  onToggleMinimize,
  onClose,
}: HUDProps) {
  const [isMinimized, setIsMinimized] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleMinimize = () => {
    setIsMinimized(!isMinimized)
    onToggleMinimize?.()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-4 right-4 z-50"
    >
      <AnimatePresence mode="wait">
        {isMinimized ? (
          // Minimized View
          <motion.div
            key="minimized"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-gray-900/95 backdrop-blur-xl rounded-full px-4 py-2 flex items-center gap-3 shadow-2xl border border-gray-700/50 cursor-pointer"
            onClick={handleMinimize}
          >
            {/* Recording indicator */}
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-white text-sm font-medium">{formatDuration(meetingDuration)}</span>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-2 text-gray-400">
              <span className="text-xs">{decisionCount} 결정</span>
              <span className="text-gray-600">·</span>
              <span className="text-xs">{actionItemCount} 액션</span>
            </div>

            <Maximize2 size={14} className="text-gray-400" />
          </motion.div>
        ) : (
          // Expanded View
          <motion.div
            key="expanded"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden"
            style={{ width: 320 }}
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-700/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">O</span>
                </div>
                <span className="text-white font-semibold">Onno</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleMinimize}
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Minimize2 size={14} />
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Recording Status */}
            <div className="px-4 py-3 border-b border-gray-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isRecording ? (
                    <>
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                      </span>
                      <span className="text-red-400 text-sm font-medium">녹음 중</span>
                    </>
                  ) : (
                    <>
                      <span className="w-3 h-3 rounded-full bg-gray-500"></span>
                      <span className="text-gray-400 text-sm">대기 중</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2 text-white">
                  <Clock size={14} className="text-gray-400" />
                  <span className="text-sm font-mono">{formatDuration(meetingDuration)}</span>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="px-4 py-3 grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
                  <Users size={12} />
                </div>
                <p className="text-white font-semibold">{participantCount}</p>
                <p className="text-xs text-gray-500">참여자</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-green-400 mb-1">
                  <FileText size={12} />
                </div>
                <p className="text-white font-semibold">{decisionCount}</p>
                <p className="text-xs text-gray-500">결정사항</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-blue-400 mb-1">
                  <AlertCircle size={12} />
                </div>
                <p className="text-white font-semibold">{actionItemCount}</p>
                <p className="text-xs text-gray-500">액션아이템</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="px-4 py-3 border-t border-gray-700/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors">
                  <Mic size={16} />
                </button>
                <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors">
                  <Settings size={16} />
                </button>
              </div>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                최근 알림
                {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
