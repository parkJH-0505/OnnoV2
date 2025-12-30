'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Taskbar } from './Taskbar'
import { useDemoStore } from '@/stores/demo-store'

interface VirtualDesktopProps {
  children: ReactNode
  showTaskbar?: boolean
  wallpaper?: 'windows11' | 'windows11-dark' | 'gradient'
}

export function VirtualDesktop({
  children,
  showTaskbar = true,
  wallpaper = 'windows11',
}: VirtualDesktopProps) {
  const { activeWindowId, windows, toggleWindowMinimized, slackState } = useDemoStore()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative w-full h-full overflow-hidden"
    >
      {/* Windows 11 Bloom Wallpaper */}
      {wallpaper === 'windows11' && (
        <div className="absolute inset-0">
          {/* Base gradient - Windows 11 blue */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a5f] via-[#0c2d4a] to-[#0a1628]" />

          {/* Bloom effect - layered gradients */}
          <div className="absolute inset-0">
            {/* Main bloom */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-60"
              style={{
                background: 'radial-gradient(ellipse at center, #6366f1 0%, #3b82f6 25%, #0ea5e9 50%, transparent 70%)',
                filter: 'blur(60px)',
              }}
            />
            {/* Secondary bloom - pink accent */}
            <div
              className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full opacity-40"
              style={{
                background: 'radial-gradient(ellipse at center, #ec4899 0%, #8b5cf6 50%, transparent 70%)',
                filter: 'blur(80px)',
              }}
            />
            {/* Tertiary bloom - teal accent */}
            <div
              className="absolute bottom-1/3 left-1/4 w-[350px] h-[350px] rounded-full opacity-30"
              style={{
                background: 'radial-gradient(ellipse at center, #14b8a6 0%, #0ea5e9 50%, transparent 70%)',
                filter: 'blur(60px)',
              }}
            />
          </div>

          {/* Subtle noise texture */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }} />
        </div>
      )}

      {wallpaper === 'windows11-dark' && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black" />
      )}

      {/* Desktop Content Area */}
      <div className="relative w-full h-[calc(100%-48px)] overflow-hidden">
        {children}
      </div>

      {/* Windows 11 Taskbar */}
      {showTaskbar && (
        <Taskbar
          activeWindowId={activeWindowId}
          windows={windows}
          onAppClick={(appId) => {
            const window = windows.find((w) => w.app === appId)
            if (window) {
              toggleWindowMinimized(window.id)
            }
          }}
          slackUnread={slackState.unreadCount}
        />
      )}
    </motion.div>
  )
}

export { Taskbar } from './Taskbar'
