'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Rocket, X } from 'lucide-react'

interface FloatingCTAProps {
  onCtaClick: () => void
  showAfterScroll?: number // pixels
}

export function FloatingCTA({ onCtaClick, showAfterScroll = 600 }: FloatingCTAProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > showAfterScroll && !isDismissed) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [showAfterScroll, isDismissed])

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsDismissed(true)
    setIsVisible(false)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.8 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2"
        >
          {/* Dismiss button */}
          <motion.button
            onClick={handleDismiss}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={14} />
          </motion.button>

          {/* Main CTA button */}
          <motion.button
            onClick={onCtaClick}
            className="relative flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-shadow group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full">
              <span className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20" />
            </span>

            <Rocket size={18} className="relative z-10" />
            <span className="relative z-10">무료 체험</span>

            {/* Badge */}
            <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-pink-500 text-white text-[10px] font-bold rounded-full">
              14일
            </span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
