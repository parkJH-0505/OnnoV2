'use client'

import { motion } from 'framer-motion'
import {
  Video,
  MessageSquare,
  Globe,
  Folder,
  Settings,
  Mail,
  Calendar
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface DockApp {
  id: string
  name: string
  icon: React.ReactNode
  isActive?: boolean
  hasNotification?: boolean
}

interface DockProps {
  activeWindowId?: string | null
  onAppClick?: (appId: string) => void
  slackUnread?: number
}

export function Dock({ activeWindowId, onAppClick, slackUnread = 0 }: DockProps) {
  const apps: DockApp[] = [
    { id: 'finder', name: 'Finder', icon: <Folder className="w-8 h-8" /> },
    { id: 'zoom', name: 'Zoom', icon: <Video className="w-8 h-8" />, isActive: activeWindowId === 'zoom' },
    { id: 'slack', name: 'Slack', icon: <MessageSquare className="w-8 h-8" />, isActive: activeWindowId === 'slack', hasNotification: slackUnread > 0 },
    { id: 'browser', name: 'Chrome', icon: <Globe className="w-8 h-8" /> },
    { id: 'mail', name: 'Mail', icon: <Mail className="w-8 h-8" /> },
    { id: 'calendar', name: 'Calendar', icon: <Calendar className="w-8 h-8" /> },
    { id: 'settings', name: '설정', icon: <Settings className="w-8 h-8" /> },
  ]

  return (
    <motion.div
      initial={{ y: 80 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="absolute bottom-2 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="flex items-end gap-1 px-2 py-1.5 bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/30 shadow-2xl">
        {apps.map((app, index) => (
          <motion.div
            key={app.id}
            className="relative group"
            whileHover={{ scale: 1.2, y: -10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            {/* Tooltip */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none">
              {app.name}
            </div>

            {/* App Icon */}
            <button
              onClick={() => onAppClick?.(app.id)}
              className={cn(
                'w-12 h-12 flex items-center justify-center rounded-xl transition-colors',
                'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800',
                'hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-700',
                'shadow-lg',
                app.id === 'zoom' && 'from-blue-400 to-blue-600 text-white',
                app.id === 'slack' && 'from-purple-400 to-purple-600 text-white',
                app.id === 'browser' && 'from-yellow-400 to-red-500 text-white',
              )}
            >
              {app.icon}
            </button>

            {/* Active indicator */}
            {app.isActive && (
              <motion.div
                layoutId="dock-indicator"
                className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-gray-600 dark:bg-gray-300 rounded-full"
              />
            )}

            {/* Notification badge */}
            {app.hasNotification && slackUnread > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-lg"
              >
                {slackUnread > 9 ? '9+' : slackUnread}
              </motion.div>
            )}

            {/* Divider after main apps */}
            {index === 5 && (
              <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-px h-10 bg-gray-400/30" />
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
