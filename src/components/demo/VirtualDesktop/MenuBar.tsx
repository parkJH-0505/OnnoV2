'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Wifi, Battery, Volume2, Search } from 'lucide-react'

interface MenuBarProps {
  activeApp?: string
}

export function MenuBar({ activeApp = 'Finder' }: MenuBarProps) {
  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        })
      )
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const appMenus: Record<string, string[]> = {
    Finder: ['파일', '편집', '보기', '이동', '윈도우', '도움말'],
    Zoom: ['Zoom', '파일', '편집', '보기', '회의', '도움말'],
    Slack: ['Slack', '파일', '편집', '보기', '도움말'],
    Chrome: ['Chrome', '파일', '편집', '보기', '기록', '북마크', '도움말'],
  }

  const menus = appMenus[activeApp] || appMenus.Finder

  return (
    <motion.div
      initial={{ y: -24 }}
      animate={{ y: 0 }}
      className="h-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl flex items-center justify-between px-2 text-[13px] font-medium select-none border-b border-gray-200/50 dark:border-gray-700/50"
      style={{ WebkitUserSelect: 'none' }}
    >
      {/* Left side - Apple menu and app menus */}
      <div className="flex items-center gap-4">
        {/* Apple logo */}
        <span className="text-gray-700 dark:text-gray-300 px-2 cursor-default">

        </span>

        {/* App name (bold) */}
        <span className="font-semibold text-gray-900 dark:text-white">
          {activeApp}
        </span>

        {/* Menu items */}
        <div className="flex items-center gap-4">
          {menus.slice(1).map((menu) => (
            <span
              key={menu}
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white cursor-default"
            >
              {menu}
            </span>
          ))}
        </div>
      </div>

      {/* Right side - System icons */}
      <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
        <Volume2 className="w-4 h-4" />
        <Battery className="w-4 h-4" />
        <Wifi className="w-4 h-4" />
        <Search className="w-4 h-4" />
        <span className="text-gray-600 dark:text-gray-400 ml-1">{currentTime}</span>
      </div>
    </motion.div>
  )
}
