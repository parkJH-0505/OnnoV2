'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Video, VideoOff, MonitorUp, Users, MessageSquare, MoreHorizontal, Shield, ChevronUp, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDemoStore, ZoomParticipant } from '@/stores/demo-store'

export function ZoomSimulator() {
  const { zoomState, currentTime } = useDemoStore()
  const { participants, currentSpeakerId, isScreenSharing, meetingTitle, meetingDuration } = zoomState

  const currentSpeaker = participants.find((p) => p.id === currentSpeakerId)

  // Format meeting time
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="w-full h-full bg-[#242424] flex flex-col">
      {/* Meeting Info Bar */}
      <div className="h-10 bg-[#1c1c1c] flex items-center justify-between px-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-500" />
            <span className="text-green-500 text-xs font-medium">암호화됨</span>
          </div>
          <div className="w-px h-4 bg-gray-700" />
          <span className="text-gray-400 text-xs">{formatTime(currentTime)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white text-sm font-medium">{meetingTitle}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400 text-xs">
          <Users className="w-4 h-4" />
          <span>{participants.length}명 참가</span>
        </div>
      </div>

      {/* Main Video Area */}
      <div className="flex-1 p-4 flex flex-col gap-4 bg-[#1c1c1c]">
        {/* Speaker View */}
        <div className="flex-1 relative rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
          {isScreenSharing ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <MonitorUp className="w-20 h-20 text-blue-400 mx-auto mb-4" />
                <p className="text-white text-lg font-medium">화면 공유 중</p>
                <p className="text-gray-400 text-sm">{currentSpeaker?.name}님의 화면</p>
              </div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSpeaker?.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full flex items-center justify-center relative"
              >
                {/* Simulated video - gradient avatar */}
                <div className="relative">
                  <motion.div
                    animate={{
                      boxShadow: currentSpeaker?.isSpeaking
                        ? ['0 0 0 0 rgba(34, 197, 94, 0)', '0 0 0 20px rgba(34, 197, 94, 0.3)', '0 0 0 0 rgba(34, 197, 94, 0)']
                        : 'none',
                    }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-6xl font-bold shadow-2xl"
                  >
                    {currentSpeaker?.name.charAt(0)}
                  </motion.div>
                  {!currentSpeaker?.isVideoOn && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-full">
                      <span className="text-white text-6xl font-bold">{currentSpeaker?.name.charAt(0)}</span>
                    </div>
                  )}
                </div>

                {/* Speaker info overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <span className="text-white font-medium">{currentSpeaker?.name || '알 수 없음'}</span>
                    {currentSpeaker?.isSpeaking && (
                      <div className="flex items-center gap-1">
                        {[...Array(4)].map((_, i) => (
                          <motion.div
                            key={i}
                            animate={{
                              height: [4, 12 + Math.random() * 8, 4],
                            }}
                            transition={{
                              repeat: Infinity,
                              duration: 0.5,
                              delay: i * 0.1,
                            }}
                            className="w-1 bg-green-500 rounded-full"
                            style={{ height: 4 }}
                          />
                        ))}
                      </div>
                    )}
                    {currentSpeaker?.isMuted && (
                      <MicOff className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Participant Gallery */}
        <div className="h-24 flex gap-2 overflow-x-auto pb-1">
          {participants.map((participant) => (
            <ParticipantTile
              key={participant.id}
              participant={participant}
              isSpeaking={participant.id === currentSpeakerId}
            />
          ))}
        </div>
      </div>

      {/* Control Bar */}
      <div className="h-16 bg-[#1c1c1c] border-t border-gray-800 flex items-center justify-center px-4">
        <div className="flex items-center gap-2">
          <ControlButton icon={<Mic className="w-5 h-5" />} label="음소거" isActive />
          <ControlButton icon={<Video className="w-5 h-5" />} label="비디오 중지" isActive />
          <ControlButton icon={<Shield className="w-5 h-5" />} label="보안" />
          <ControlButton icon={<Users className="w-5 h-5" />} label="참가자" badge={participants.length.toString()} />
          <ControlButton icon={<MessageSquare className="w-5 h-5" />} label="채팅" />
          <ControlButton icon={<MonitorUp className="w-5 h-5" />} label="공유" highlight />
          <ControlButton icon={<MoreHorizontal className="w-5 h-5" />} label="더 보기" />

          <div className="w-px h-8 bg-gray-700 mx-2" />

          <button className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-full transition-colors">
            나가기
          </button>
        </div>
      </div>
    </div>
  )
}

function ParticipantTile({
  participant,
  isSpeaking,
}: {
  participant: ZoomParticipant
  isSpeaking: boolean
}) {
  return (
    <motion.div
      className={cn(
        'w-32 h-full flex-shrink-0 rounded-lg overflow-hidden relative',
        'bg-gradient-to-br from-gray-700 to-gray-800',
        isSpeaking && 'ring-2 ring-green-500',
      )}
    >
      <div className="w-full h-full flex items-center justify-center">
        <div className={cn(
          'w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold',
          participant.isVideoOn
            ? 'bg-gradient-to-br from-purple-500 to-pink-600'
            : 'bg-gray-600',
        )}>
          {participant.name.charAt(0)}
        </div>
      </div>

      {/* Name & Status */}
      <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between px-1">
        <span className="text-white text-[10px] truncate bg-black/60 px-1.5 py-0.5 rounded">
          {participant.name}
        </span>
        <div className="flex items-center gap-1">
          {participant.isMuted && (
            <div className="bg-red-600 p-0.5 rounded">
              <MicOff className="w-2.5 h-2.5 text-white" />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function ControlButton({
  icon,
  label,
  isActive = false,
  highlight = false,
  badge,
}: {
  icon: React.ReactNode
  label: string
  isActive?: boolean
  highlight?: boolean
  badge?: string
}) {
  return (
    <button
      className={cn(
        'relative flex flex-col items-center gap-0.5 p-2.5 rounded-lg transition-colors min-w-[60px]',
        highlight
          ? 'bg-green-600 hover:bg-green-700 text-white'
          : isActive
          ? 'bg-gray-700 text-white hover:bg-gray-600'
          : 'text-gray-300 hover:bg-gray-700/50',
      )}
    >
      <div className="relative">
        {icon}
        {badge && (
          <span className="absolute -top-1 -right-2 bg-blue-500 text-white text-[9px] font-bold px-1 rounded-full">
            {badge}
          </span>
        )}
      </div>
      <span className="text-[10px]">{label}</span>
    </button>
  )
}
