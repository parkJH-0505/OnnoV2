'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  FileText,
  CheckCircle,
  AlertCircle,
  Share2,
  Download,
  Copy,
  ExternalLink,
  ChevronRight,
  Play,
  MessageSquare,
  Target,
  Shield,
  Lightbulb,
  AlertTriangle
} from 'lucide-react'

// Mock meeting data
const meetingData = {
  id: '1',
  title: '주간 스프린트 회의',
  date: '2025년 12월 30일 (월)',
  time: '오전 10:00 - 10:45',
  duration: '45분',
  participants: [
    { name: '김팀장', role: 'Host', avatar: 'K' },
    { name: '이기획', role: 'Participant', avatar: 'L' },
    { name: '박개발', role: 'Participant', avatar: 'P' },
    { name: '최디자인', role: 'Participant', avatar: 'C' },
  ],
  summary: `이번 주간 스프린트 회의에서는 다음 스프린트의 주요 목표와 일정을 확정했습니다. 디자인 시안 최종 확정은 다음 주 월요일까지, 프로토타입 완성은 금요일까지로 결정되었습니다. 예산 제약으로 인해 외부 서비스 사용은 제한되며, 기존 컴포넌트 재사용을 통해 개발 시간을 단축하기로 했습니다.`,
  decisions: [
    {
      id: 'd1',
      content: '다음 주 월요일까지 디자인 시안 최종 확정',
      speaker: '김팀장',
      timestamp: '10:05',
      type: 'forward',
    },
    {
      id: 'd2',
      content: '이번 주 금요일까지 프로토타입 완성해서 공유',
      speaker: '김팀장',
      timestamp: '10:32',
      type: 'forward',
    },
    {
      id: 'd3',
      content: '기존 컴포넌트 재사용으로 개발 시간 단축',
      speaker: '박개발',
      timestamp: '10:20',
      type: 'bypass',
    },
  ],
  actionItems: [
    {
      id: 'a1',
      content: 'API 연동 작업',
      assignee: '박개발',
      dueDate: '1월 3일',
      status: 'pending',
    },
    {
      id: 'a2',
      content: '디자인 시안 최종 검토',
      assignee: '최디자인',
      dueDate: '1월 6일',
      status: 'pending',
    },
    {
      id: 'a3',
      content: '백업 플랜 문서 작성',
      assignee: '이기획',
      dueDate: '1월 2일',
      status: 'pending',
    },
  ],
  risks: [
    {
      id: 'r1',
      content: '일정이 촉박하여 백업 플랜 필요',
      speaker: '이기획',
      severity: 'medium',
    },
    {
      id: 'r2',
      content: '예산 제약으로 외부 서비스 사용 불가',
      speaker: '최매니저',
      severity: 'high',
    },
  ],
  notionUrl: 'https://notion.so/meeting-123',
}

const typeIcons = {
  forward: Target,
  bypass: Lightbulb,
  safety: Shield,
  constraint: AlertTriangle,
}

const typeColors = {
  forward: 'text-emerald-500 bg-emerald-50 border-emerald-200',
  bypass: 'text-purple-500 bg-purple-50 border-purple-200',
  safety: 'text-amber-500 bg-amber-50 border-amber-200',
  constraint: 'text-red-500 bg-red-50 border-red-200',
}

export default function MeetingSummaryPage({ params }: { params: { id: string } }) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </Link>
            <div>
              <h1 className="font-semibold text-gray-900">{meetingData.title}</h1>
              <p className="text-xs text-gray-500">{meetingData.date}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Share2 size={16} />
              공유
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Download size={16} />
              내보내기
            </button>
            <a
              href={meetingData.notionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              <span>N</span>
              Notion에서 보기
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="col-span-2 space-y-6">
            {/* Video/Recording Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 rounded-2xl aspect-video flex items-center justify-center relative overflow-hidden group cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
              <div className="text-center relative z-10">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-white/30 transition-colors">
                  <Play size={28} className="text-white ml-1" />
                </div>
                <p className="text-white font-medium">녹음 재생하기</p>
                <p className="text-white/60 text-sm mt-1">{meetingData.duration}</p>
              </div>
            </motion.div>

            {/* AI Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">O</span>
                </div>
                <h2 className="font-semibold text-gray-900">AI 요약</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">{meetingData.summary}</p>
            </motion.div>

            {/* Decisions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <FileText size={18} className="text-emerald-500" />
                  결정사항
                </h2>
                <span className="text-sm text-gray-500">{meetingData.decisions.length}개</span>
              </div>

              <div className="space-y-3">
                {meetingData.decisions.map((decision) => {
                  const Icon = typeIcons[decision.type as keyof typeof typeIcons] || Target
                  const colorClass = typeColors[decision.type as keyof typeof typeColors] || typeColors.forward

                  return (
                    <div
                      key={decision.id}
                      className={`p-4 rounded-xl border ${colorClass} flex items-start justify-between group`}
                    >
                      <div className="flex items-start gap-3">
                        <Icon size={18} className="mt-0.5" />
                        <div>
                          <p className="text-gray-900">{decision.content}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {decision.speaker} · {decision.timestamp}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCopy(decision.content, decision.id)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        {copiedId === decision.id ? (
                          <CheckCircle size={14} className="text-green-500" />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                    </div>
                  )
                })}
              </div>
            </motion.div>

            {/* Action Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <CheckCircle size={18} className="text-blue-500" />
                  액션 아이템
                </h2>
                <span className="text-sm text-gray-500">{meetingData.actionItems.length}개</span>
              </div>

              <div className="space-y-3">
                {meetingData.actionItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-gray-50 rounded-xl flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded-md border-gray-300 text-blue-500 focus:ring-blue-500"
                      />
                      <div>
                        <p className="text-gray-900">{item.content}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full">
                            {item.assignee}
                          </span>
                          <span className="text-xs text-gray-500">
                            마감: {item.dueDate}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-400 transition-colors" />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Risks */}
            {meetingData.risks.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                    <AlertCircle size={18} className="text-amber-500" />
                    리스크 / 주의사항
                  </h2>
                  <span className="text-sm text-gray-500">{meetingData.risks.length}개</span>
                </div>

                <div className="space-y-3">
                  {meetingData.risks.map((risk) => (
                    <div
                      key={risk.id}
                      className={`p-4 rounded-xl border ${
                        risk.severity === 'high'
                          ? 'bg-red-50 border-red-200'
                          : 'bg-amber-50 border-amber-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <AlertTriangle
                          size={18}
                          className={risk.severity === 'high' ? 'text-red-500' : 'text-amber-500'}
                        />
                        <div>
                          <p className="text-gray-900">{risk.content}</p>
                          <p className="text-xs text-gray-500 mt-1">{risk.speaker}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Meeting Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
            >
              <h3 className="font-semibold text-gray-900 mb-4">미팅 정보</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar size={16} className="text-gray-400" />
                  <span className="text-gray-600">{meetingData.date}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock size={16} className="text-gray-400" />
                  <span className="text-gray-600">{meetingData.time}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MessageSquare size={16} className="text-gray-400" />
                  <span className="text-gray-600">{meetingData.duration} 녹음됨</span>
                </div>
              </div>
            </motion.div>

            {/* Participants */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
            >
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users size={16} className="text-gray-400" />
                참여자 ({meetingData.participants.length})
              </h3>
              <div className="space-y-3">
                {meetingData.participants.map((participant, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {participant.avatar}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{participant.name}</p>
                      <p className="text-xs text-gray-500">{participant.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white"
            >
              <h3 className="font-semibold mb-4">이 회의의 성과</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-3xl font-bold">{meetingData.decisions.length}</p>
                  <p className="text-sm text-blue-100">결정사항</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">{meetingData.actionItems.length}</p>
                  <p className="text-sm text-blue-100">액션 아이템</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}
