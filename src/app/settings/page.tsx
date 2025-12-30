'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useAuthStore } from '@/stores/auth-store'
import { useNotionStore } from '@/stores/notion-store'
import {
  ArrowLeft,
  User,
  Link2,
  Bell,
  Shield,
  Palette,
  HelpCircle,
  ChevronRight,
  LogOut,
  CheckCircle,
  AlertCircle,
  Smartphone,
  Globe,
  CreditCard
} from 'lucide-react'

const settingsGroups = [
  {
    title: '계정',
    items: [
      {
        id: 'profile',
        icon: User,
        label: '프로필',
        description: '이름, 이메일, 프로필 사진',
        href: '/settings/profile',
      },
      {
        id: 'notifications',
        icon: Bell,
        label: '알림',
        description: '알림 설정 및 방해 금지 모드',
        href: '/settings/notifications',
      },
      {
        id: 'security',
        icon: Shield,
        label: '보안',
        description: '비밀번호 및 2단계 인증',
        href: '/settings/security',
      },
    ],
  },
  {
    title: '연동',
    items: [
      {
        id: 'integrations',
        icon: Link2,
        label: '외부 서비스 연동',
        description: 'Notion, Slack, Google Calendar',
        href: '/settings/integrations',
        badge: 'notion',
      },
      {
        id: 'extension',
        icon: Smartphone,
        label: '확장 프로그램',
        description: 'Chrome 확장 프로그램 관리',
        href: '/settings/extension',
      },
    ],
  },
  {
    title: '설정',
    items: [
      {
        id: 'appearance',
        icon: Palette,
        label: '테마 및 표시',
        description: '다크 모드, 언어, 글꼴 크기',
        href: '/settings/appearance',
      },
      {
        id: 'language',
        icon: Globe,
        label: '언어 및 지역',
        description: '한국어, 시간대',
        href: '/settings/language',
      },
    ],
  },
  {
    title: '구독',
    items: [
      {
        id: 'subscription',
        icon: CreditCard,
        label: '구독 관리',
        description: 'Pro 플랜, 결제 정보',
        href: '/settings/subscription',
        badge: 'pro',
      },
    ],
  },
  {
    title: '지원',
    items: [
      {
        id: 'help',
        icon: HelpCircle,
        label: '도움말 센터',
        description: 'FAQ, 가이드, 고객 지원',
        href: '/help',
      },
    ],
  },
]

export default function SettingsPage() {
  const { user, signOut } = useAuthStore()
  const { isConnected: isNotionConnected } = useNotionStore()

  const getBadge = (badgeType?: string) => {
    if (badgeType === 'notion') {
      return isNotionConnected ? (
        <span className="flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-600 rounded-full text-xs font-medium">
          <CheckCircle size={10} />
          연결됨
        </span>
      ) : (
        <span className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs">
          <AlertCircle size={10} />
          연결 필요
        </span>
      )
    }
    if (badgeType === 'pro') {
      return (
        <span className="px-2 py-0.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-xs font-medium">
          PRO
        </span>
      )
    }
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-6 h-16 flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </Link>
          <h1 className="font-semibold text-gray-900">설정</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        {/* User Profile Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900">
                {user?.name || '사용자'}
              </h2>
              <p className="text-sm text-gray-500">{user?.email || 'user@example.com'}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs font-medium">
                  Pro 회원
                </span>
                <span className="text-xs text-gray-400">
                  가입일: 2025.12.30
                </span>
              </div>
            </div>
            <Link
              href="/settings/profile"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight size={20} className="text-gray-400" />
            </Link>
          </div>
        </motion.div>

        {/* Settings Groups */}
        <div className="space-y-6">
          {settingsGroups.map((group, groupIndex) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: groupIndex * 0.05 }}
            >
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-1">
                {group.title}
              </h3>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
                {group.items.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                        <Icon size={20} className="text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900">{item.label}</p>
                          {getBadge(item.badge)}
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          {item.description}
                        </p>
                      </div>
                      <ChevronRight size={18} className="text-gray-300" />
                    </Link>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <button
            onClick={() => {
              signOut()
              window.location.href = '/'
            }}
            className="w-full flex items-center justify-center gap-2 p-4 text-red-500 hover:bg-red-50 rounded-2xl border border-gray-100 transition-colors"
          >
            <LogOut size={18} />
            <span className="font-medium">로그아웃</span>
          </button>
        </motion.div>

        {/* Version Info */}
        <div className="mt-8 text-center text-xs text-gray-400">
          <p>Onno v1.0.0</p>
          <p className="mt-1">© 2025 Onno. All rights reserved.</p>
        </div>
      </main>
    </div>
  )
}
