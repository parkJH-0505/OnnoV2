'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Hash, ChevronDown, Plus, Search, Bell, AtSign, Bookmark, MoreVertical, Send } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDemoStore, SlackMessage } from '@/stores/demo-store'

const channels = [
  { id: 'general', name: 'general', unread: 0 },
  { id: 'dev-team', name: 'dev-team', unread: 2 },
  { id: 'design', name: 'design', unread: 0 },
  { id: 'announcements', name: 'announcements', unread: 1 },
]

const directMessages = [
  { id: 'dm1', name: '김팀장', status: 'online' },
  { id: 'dm2', name: '이개발', status: 'online' },
  { id: 'dm3', name: '박기획', status: 'away' },
]

export function SlackSimulator() {
  const { slackState } = useDemoStore()
  const [activeChannel, setActiveChannel] = useState('#dev-team')

  const channelMessages = slackState.messages.filter(
    (m) => m.channel === activeChannel
  )

  return (
    <div className="w-full h-full flex bg-[#1a1d21] text-white">
      {/* Sidebar */}
      <div className="w-56 bg-[#19171d] border-r border-gray-800 flex flex-col">
        {/* Workspace Header */}
        <div className="h-12 px-3 flex items-center justify-between border-b border-gray-800">
          <button className="flex items-center gap-1 hover:bg-white/5 px-2 py-1 rounded">
            <span className="font-bold text-lg">Pocket Co.</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-3">
          <NavItem icon={<Search className="w-4 h-4" />} label="검색" />
          <NavItem icon={<AtSign className="w-4 h-4" />} label="멘션 및 반응" />
          <NavItem icon={<Bookmark className="w-4 h-4" />} label="저장됨" />

          {/* Channels */}
          <div className="mt-4">
            <div className="px-3 flex items-center justify-between mb-1">
              <span className="text-gray-400 text-xs font-medium">채널</span>
              <Plus className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer" />
            </div>
            {channels.map((channel) => (
              <ChannelItem
                key={channel.id}
                channel={channel}
                isActive={activeChannel === `#${channel.name}`}
                onClick={() => setActiveChannel(`#${channel.name}`)}
              />
            ))}
          </div>

          {/* Direct Messages */}
          <div className="mt-4">
            <div className="px-3 flex items-center justify-between mb-1">
              <span className="text-gray-400 text-xs font-medium">다이렉트 메시지</span>
              <Plus className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer" />
            </div>
            {directMessages.map((dm) => (
              <DMItem key={dm.id} dm={dm} />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Channel Header */}
        <div className="h-12 px-4 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-gray-400" />
            <span className="font-bold">{activeChannel.replace('#', '')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white" />
            <MoreVertical className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white" />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {channelMessages.map((message) => (
              <MessageItem key={message.id} message={message} />
            ))}
          </AnimatePresence>
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-2 bg-[#222529] rounded-lg px-4 py-2">
            <input
              type="text"
              placeholder={`${activeChannel}에 메시지 보내기`}
              className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none"
            />
            <Send className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white" />
          </div>
        </div>
      </div>
    </div>
  )
}

function NavItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="w-full px-3 py-1.5 flex items-center gap-2 text-gray-300 hover:bg-white/5 text-sm">
      {icon}
      <span>{label}</span>
    </button>
  )
}

function ChannelItem({
  channel,
  isActive,
  onClick,
}: {
  channel: { id: string; name: string; unread: number }
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full px-3 py-1 flex items-center gap-2 text-sm',
        isActive ? 'bg-[#1164a3] text-white' : 'text-gray-300 hover:bg-white/5',
      )}
    >
      <Hash className="w-4 h-4 text-gray-400" />
      <span className={channel.unread > 0 ? 'font-bold' : ''}>{channel.name}</span>
      {channel.unread > 0 && (
        <span className="ml-auto bg-red-500 text-white text-xs px-1.5 rounded-full">
          {channel.unread}
        </span>
      )}
    </button>
  )
}

function DMItem({ dm }: { dm: { id: string; name: string; status: string } }) {
  return (
    <button className="w-full px-3 py-1 flex items-center gap-2 text-sm text-gray-300 hover:bg-white/5">
      <div className="relative">
        <div className="w-5 h-5 rounded bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white">
          {dm.name.charAt(0)}
        </div>
        <div
          className={cn(
            'absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-[#19171d]',
            dm.status === 'online' ? 'bg-green-500' : 'bg-gray-500',
          )}
        />
      </div>
      <span>{dm.name}</span>
    </button>
  )
}

function MessageItem({ message }: { message: SlackMessage }) {
  const [time, setTime] = useState('')

  useEffect(() => {
    setTime(
      new Date(message.timestamp).toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
      })
    )
  }, [message.timestamp])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className={cn(
        'flex gap-3 p-2 rounded-lg',
        message.isNew && 'bg-yellow-500/10',
      )}
    >
      <div className="w-9 h-9 rounded bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
        {message.sender.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="font-bold text-sm">{message.sender}</span>
          <span className="text-xs text-gray-500">{time}</span>
        </div>
        <p className="text-sm text-gray-300 break-words">{message.content}</p>
      </div>
    </motion.div>
  )
}
