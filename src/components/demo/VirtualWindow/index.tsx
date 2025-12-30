'use client'

import { ReactNode, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { X, Minus, Square, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDemoStore, VirtualWindow as VirtualWindowType } from '@/stores/demo-store'

interface VirtualWindowProps {
  window: VirtualWindowType
  children: ReactNode
  onClose?: () => void
  tourId?: string
}

export function VirtualWindow({ window, children, onClose, tourId }: VirtualWindowProps) {
  const {
    activeWindowId,
    focusWindow,
    updateWindowPosition,
    updateWindowSize,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
  } = useDemoStore()

  const constraintsRef = useRef<HTMLDivElement>(null)
  const isActive = activeWindowId === window.id
  const [isResizing, setIsResizing] = useState(false)
  const [resizeDirection, setResizeDirection] = useState<string | null>(null)

  if (window.isMinimized) {
    return null
  }

  const appIcons: Record<string, string> = {
    zoom: '🎥',
    slack: '💬',
    browser: '🌐',
    finder: '📁',
    onno: '🧠',
  }

  const handleResizeStart = (direction: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsResizing(true)
    setResizeDirection(direction)

    const startX = e.clientX
    const startY = e.clientY
    const startWidth = window.size.width
    const startHeight = window.size.height
    const startPosX = window.position.x
    const startPosY = window.position.y

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX
      const deltaY = moveEvent.clientY - startY

      let newWidth = startWidth
      let newHeight = startHeight
      let newX = startPosX
      let newY = startPosY

      // Right edge
      if (direction.includes('e')) {
        newWidth = Math.max(300, startWidth + deltaX)
      }
      // Left edge
      if (direction.includes('w')) {
        const widthChange = Math.min(deltaX, startWidth - 300)
        newWidth = startWidth - widthChange
        newX = startPosX + widthChange
      }
      // Bottom edge
      if (direction.includes('s')) {
        newHeight = Math.max(200, startHeight + deltaY)
      }
      // Top edge
      if (direction.includes('n')) {
        const heightChange = Math.min(deltaY, startHeight - 200)
        newHeight = startHeight - heightChange
        newY = startPosY + heightChange
      }

      updateWindowSize(window.id, { width: newWidth, height: newHeight })
      updateWindowPosition(window.id, { x: newX, y: newY })
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      setResizeDirection(null)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  return (
    <>
      {/* Constraint boundary */}
      <div ref={constraintsRef} className="absolute inset-0 pointer-events-none" />

      <motion.div
        data-tour-id={tourId}
        drag={!isResizing}
        dragMomentum={false}
        dragConstraints={constraintsRef}
        onDragEnd={(_, info) => {
          if (!isResizing) {
            updateWindowPosition(window.id, {
              x: window.position.x + info.offset.x,
              y: window.position.y + info.offset.y,
            })
          }
        }}
        onClick={() => focusWindow(window.id)}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{
          opacity: 1,
          scale: 1,
          x: window.isMaximized ? 0 : window.position.x,
          y: window.isMaximized ? 0 : window.position.y,
          width: window.isMaximized ? '100%' : window.size.width,
          height: window.isMaximized ? 'calc(100% - 48px)' : window.size.height,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{ zIndex: window.zIndex }}
        className={cn(
          'absolute overflow-hidden',
          'rounded-lg shadow-2xl',
          'border border-gray-700/50',
          isActive ? 'shadow-black/40' : 'shadow-black/20',
        )}
      >
        {/* Windows 11 Title Bar */}
        <div
          className={cn(
            'h-9 flex items-center justify-between px-3 cursor-move select-none',
            'bg-gray-900/95 backdrop-blur-sm',
          )}
          onDoubleClick={() => maximizeWindow(window.id)}
        >
          {/* Left - App icon and title */}
          <div className="flex items-center gap-2">
            <span className="text-sm">{appIcons[window.app] || '📄'}</span>
            <span className="text-sm text-gray-300 font-medium truncate max-w-[200px]">
              {window.title}
            </span>
          </div>

          {/* Right - Window controls */}
          <div className="flex items-center -mr-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                minimizeWindow(window.id)
              }}
              className="w-11 h-9 flex items-center justify-center hover:bg-gray-700/50 transition-colors"
            >
              <Minus className="w-4 h-4 text-gray-400" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                maximizeWindow(window.id)
              }}
              className="w-11 h-9 flex items-center justify-center hover:bg-gray-700/50 transition-colors"
            >
              {window.isMaximized ? (
                <Copy className="w-3.5 h-3.5 text-gray-400" />
              ) : (
                <Square className="w-3.5 h-3.5 text-gray-400" />
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onClose ? onClose() : closeWindow(window.id)
              }}
              className="w-11 h-9 flex items-center justify-center hover:bg-red-600 transition-colors group"
            >
              <X className="w-4 h-4 text-gray-400 group-hover:text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="h-[calc(100%-36px)] overflow-hidden bg-gray-900">
          {children}
        </div>

        {/* Resize Handles (only when not maximized) */}
        {!window.isMaximized && (
          <>
            {/* Edges */}
            <div
              className="absolute top-0 left-2 right-2 h-1 cursor-n-resize hover:bg-blue-500/30 transition-colors"
              onMouseDown={handleResizeStart('n')}
            />
            <div
              className="absolute bottom-0 left-2 right-2 h-1 cursor-s-resize hover:bg-blue-500/30 transition-colors"
              onMouseDown={handleResizeStart('s')}
            />
            <div
              className="absolute left-0 top-2 bottom-2 w-1 cursor-w-resize hover:bg-blue-500/30 transition-colors"
              onMouseDown={handleResizeStart('w')}
            />
            <div
              className="absolute right-0 top-2 bottom-2 w-1 cursor-e-resize hover:bg-blue-500/30 transition-colors"
              onMouseDown={handleResizeStart('e')}
            />

            {/* Corners */}
            <div
              className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize hover:bg-blue-500/30 transition-colors"
              onMouseDown={handleResizeStart('nw')}
            />
            <div
              className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize hover:bg-blue-500/30 transition-colors"
              onMouseDown={handleResizeStart('ne')}
            />
            <div
              className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize hover:bg-blue-500/30 transition-colors"
              onMouseDown={handleResizeStart('sw')}
            />
            <div
              className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize hover:bg-blue-500/30 transition-colors"
              onMouseDown={handleResizeStart('se')}
            />
          </>
        )}
      </motion.div>
    </>
  )
}
