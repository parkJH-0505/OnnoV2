'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  MessageSquare,
  Video,
  Globe,
  Folder,
  Settings,
  Wifi,
  Volume2,
  Battery,
  ChevronUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface TaskbarApp {
  id: string
  name: string
  icon: React.ReactNode
  isActive?: boolean
  isOpen?: boolean
  isMinimized?: boolean
  isPinned?: boolean
  hasNotification?: boolean
}

interface VirtualWindow {
  id: string
  app: string
  isMinimized: boolean
}

interface TaskbarProps {
  activeWindowId?: string | null
  windows?: VirtualWindow[]
  onAppClick?: (appId: string) => void
  slackUnread?: number
}

export function Taskbar({ activeWindowId, windows = [], onAppClick, slackUnread = 0 }: TaskbarProps) {
  const [mounted, setMounted] = useState(false)
  const [currentTime, setCurrentTime] = useState('')
  const [currentDate, setCurrentDate] = useState('')

  useEffect(() => {
    setMounted(true)
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      )
      setCurrentDate(
        now.toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })
      )
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  // Helper to check window state
  const getWindowState = (appId: string) => {
    const window = windows.find((w) => w.app === appId)
    return {
      isOpen: !!window,
      isMinimized: window?.isMinimized ?? false,
      isActive: window?.id === activeWindowId && !window?.isMinimized,
    }
  }

  const zoomState = getWindowState('zoom')
  const slackState = getWindowState('slack')

  const pinnedApps: TaskbarApp[] = [
    { id: 'explorer', name: '파일 탐색기', icon: <Folder className="w-6 h-6" />, isPinned: true },
    { id: 'browser', name: 'Microsoft Edge', icon: <Globe className="w-6 h-6" />, isPinned: true },
    {
      id: 'zoom',
      name: 'Zoom',
      icon: <Video className="w-6 h-6" />,
      isActive: zoomState.isActive,
      isOpen: zoomState.isOpen,
      isMinimized: zoomState.isMinimized,
      isPinned: true
    },
    {
      id: 'slack',
      name: 'Slack',
      icon: <MessageSquare className="w-6 h-6" />,
      isActive: slackState.isActive,
      isOpen: slackState.isOpen,
      isMinimized: slackState.isMinimized,
      hasNotification: slackUnread > 0,
      isPinned: true
    },
    { id: 'settings', name: '설정', icon: <Settings className="w-6 h-6" />, isPinned: true },
  ]

  return (
    <div className="absolute bottom-0 left-0 right-0 z-50">
      {/* Windows 11 style frosted glass taskbar */}
      <div className="h-12 bg-gray-900/70 backdrop-blur-2xl border-t border-white/10 flex items-center justify-between px-3">
        {/* Left - Start Button & Search */}
        <div className="flex items-center gap-1">
          {/* Windows Start Button */}
          <button className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-md transition-colors">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
            </svg>
          </button>

          {/* Search */}
          <button className="h-8 px-3 flex items-center gap-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-full transition-colors">
            <Search className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">검색</span>
          </button>
        </div>

        {/* Center - Pinned Apps */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1">
          {pinnedApps.map((app) => (
            <motion.button
              key={app.id}
              onClick={() => onAppClick?.(app.id)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                'relative w-10 h-10 flex items-center justify-center rounded-md transition-colors',
                app.isActive
                  ? 'bg-white/20 text-white'
                  : app.isOpen
                  ? 'bg-white/10 text-white'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white',
              )}
            >
              {app.icon}

              {/* Window state indicator */}
              {app.isOpen && (
                <div
                  className={cn(
                    'absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 rounded-full transition-all',
                    app.isActive
                      ? 'w-4 bg-blue-400'
                      : app.isMinimized
                      ? 'w-1 bg-gray-400'
                      : 'w-2 bg-gray-400',
                  )}
                />
              )}

              {/* Notification badge */}
              {app.hasNotification && slackUnread > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[9px] font-bold">
                  {slackUnread > 9 ? '9+' : slackUnread}
                </span>
              )}
            </motion.button>
          ))}
        </div>

        {/* Right - System Tray */}
        <div className="flex items-center gap-1">
          {/* System tray icons */}
          <button className="p-2 hover:bg-white/10 rounded-md transition-colors">
            <ChevronUp className="w-4 h-4 text-gray-400" />
          </button>

          <div className="flex items-center gap-2 px-2 py-1 hover:bg-white/10 rounded-md transition-colors">
            <Wifi className="w-4 h-4 text-gray-300" />
            <Volume2 className="w-4 h-4 text-gray-300" />
            <Battery className="w-4 h-4 text-gray-300" />
          </div>

          {/* Clock */}
          <button className="px-2 py-1 hover:bg-white/10 rounded-md transition-colors text-right min-w-[60px]">
            <div className="text-xs text-gray-200">{mounted ? currentTime : '--:--'}</div>
            <div className="text-[10px] text-gray-400">{mounted ? currentDate : '----. --. --.'}</div>
          </button>

          {/* Notification center */}
          <button className="w-1 h-6 hover:bg-blue-400/50 rounded transition-colors ml-1" />
        </div>
      </div>
    </div>
  )
}
