'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useNotionStore } from '@/stores/notion-store'
import {
  ArrowLeft,
  Check,
  ChevronRight,
  ExternalLink,
  RefreshCw,
  Settings,
  Database,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  Unplug,
  Zap,
  Clock,
  ToggleLeft,
  ToggleRight
} from 'lucide-react'

export default function IntegrationsPage() {
  const {
    isConnected,
    isConnecting,
    workspace,
    databases,
    selectedDatabase,
    syncSettings,
    lastSyncAt,
    syncHistory,
    connect,
    disconnect,
    selectDatabase,
    updateSyncSettings,
  } = useNotionStore()

  const [showDatabaseSelector, setShowDatabaseSelector] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)

  const handleConnect = async () => {
    try {
      await connect()
    } catch (error) {
      console.error('Connection failed:', error)
    }
  }

  const handleSync = async () => {
    setIsSyncing(true)
    try {
      await useNotionStore.getState().syncMeeting('test')
    } finally {
      setIsSyncing(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="font-semibold text-gray-900">연동 설정</h1>
            <p className="text-xs text-gray-500">외부 서비스와 Onno를 연결합니다</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Notion Integration Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          {/* Card Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">N</span>
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">Notion</h2>
                  <p className="text-sm text-gray-500">
                    회의록을 Notion에 자동으로 저장합니다
                  </p>
                </div>
              </div>

              {/* Connection Status */}
              {isConnected ? (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-600 rounded-full text-sm font-medium">
                  <CheckCircle size={14} />
                  연결됨
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-500 rounded-full text-sm">
                  <AlertCircle size={14} />
                  연결 안됨
                </div>
              )}
            </div>
          </div>

          {/* Connection Section */}
          {!isConnected ? (
            <div className="p-6">
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Database size={28} className="text-gray-400" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">
                  Notion 워크스페이스 연결
                </h3>
                <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
                  Notion을 연결하면 회의 내용이 자동으로 정리되어 저장됩니다
                </p>

                <motion.button
                  onClick={handleConnect}
                  disabled={isConnecting}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isConnecting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      연결 중...
                    </>
                  ) : (
                    <>
                      <Zap size={18} />
                      Notion 연결하기
                    </>
                  )}
                </motion.button>

                <p className="text-xs text-gray-400 mt-4">
                  연결 시 Notion의 읽기/쓰기 권한이 필요합니다
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Connected Workspace Info */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                      {workspace?.icon || '🏢'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{workspace?.name}</p>
                      <p className="text-xs text-gray-500">워크스페이스</p>
                    </div>
                  </div>
                  <button
                    onClick={disconnect}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Unplug size={14} />
                    연결 해제
                  </button>
                </div>
              </div>

              {/* Database Selection */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-medium text-gray-900">저장할 데이터베이스</h3>
                    <p className="text-sm text-gray-500">
                      회의록이 저장될 Notion 데이터베이스를 선택하세요
                    </p>
                  </div>
                </div>

                {selectedDatabase ? (
                  <div
                    className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-xl cursor-pointer hover:bg-blue-100 transition-colors"
                    onClick={() => setShowDatabaseSelector(true)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-xl shadow-sm">
                        {selectedDatabase.icon || '📄'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{selectedDatabase.name}</p>
                        <p className="text-xs text-gray-500">
                          {selectedDatabase.properties.slice(0, 3).join(', ')}...
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-gray-400" />
                  </div>
                ) : (
                  <button
                    onClick={() => setShowDatabaseSelector(true)}
                    className="w-full flex items-center justify-between p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Database size={20} className="text-gray-400" />
                      </div>
                      <span className="text-gray-500">데이터베이스 선택</span>
                    </div>
                    <ChevronRight size={18} className="text-gray-400" />
                  </button>
                )}
              </div>

              {/* Sync Settings */}
              <div className="p-6 border-b border-gray-100">
                <h3 className="font-medium text-gray-900 mb-4">동기화 설정</h3>
                <div className="space-y-4">
                  {[
                    { key: 'autoSync', label: '자동 동기화', desc: '회의 종료 후 자동으로 저장' },
                    { key: 'syncDecisions', label: '결정사항', desc: '회의에서 결정된 내용' },
                    { key: 'syncActionItems', label: '액션 아이템', desc: '할 일 및 담당자' },
                    { key: 'syncSummary', label: 'AI 요약', desc: '회의 내용 요약' },
                    { key: 'syncTranscript', label: '전체 녹취록', desc: '회의 전문 (용량 주의)' },
                    { key: 'notifyOnSync', label: '동기화 알림', desc: '저장 완료 시 알림' },
                  ].map((setting) => (
                    <div
                      key={setting.key}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-700">{setting.label}</p>
                        <p className="text-xs text-gray-500">{setting.desc}</p>
                      </div>
                      <button
                        onClick={() =>
                          updateSyncSettings({
                            [setting.key]: !syncSettings[setting.key as keyof typeof syncSettings],
                          })
                        }
                        className="relative"
                      >
                        {syncSettings[setting.key as keyof typeof syncSettings] ? (
                          <ToggleRight size={36} className="text-blue-500" />
                        ) : (
                          <ToggleLeft size={36} className="text-gray-300" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sync Status */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">동기화 현황</h3>
                  <button
                    onClick={handleSync}
                    disabled={isSyncing || !selectedDatabase}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-500 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
                    {isSyncing ? '동기화 중...' : '수동 동기화'}
                  </button>
                </div>

                {lastSyncAt && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Clock size={14} />
                    <span>마지막 동기화: {formatDate(lastSyncAt)}</span>
                  </div>
                )}

                {syncHistory.length > 0 ? (
                  <div className="space-y-2">
                    {syncHistory.slice(0, 5).map((sync) => (
                      <div
                        key={sync.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {sync.status === 'success' ? (
                            <CheckCircle size={16} className="text-green-500" />
                          ) : (
                            <AlertCircle size={16} className="text-red-500" />
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              {sync.meetingTitle}
                            </p>
                            <p className="text-xs text-gray-500">
                              {sync.itemCount}개 항목 저장됨
                            </p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400">
                          {formatDate(sync.syncedAt)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <FileText size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">아직 동기화된 회의가 없습니다</p>
                  </div>
                )}
              </div>
            </>
          )}
        </motion.div>

        {/* Other Integrations (Coming Soon) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
        >
          <h3 className="font-medium text-gray-900 mb-4">더 많은 연동 (Coming Soon)</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Slack', icon: '💬', desc: '알림 전송' },
              { name: 'Google Calendar', icon: '📅', desc: '일정 연동' },
              { name: 'Jira', icon: '🎯', desc: '이슈 생성' },
              { name: 'Asana', icon: '✅', desc: '태스크 연동' },
            ].map((integration) => (
              <div
                key={integration.name}
                className="p-4 border border-gray-100 rounded-xl text-center opacity-50"
              >
                <span className="text-2xl">{integration.icon}</span>
                <p className="text-sm font-medium text-gray-700 mt-2">
                  {integration.name}
                </p>
                <p className="text-xs text-gray-400">{integration.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </main>

      {/* Database Selector Modal */}
      <AnimatePresence>
        {showDatabaseSelector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setShowDatabaseSelector(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">데이터베이스 선택</h3>
                <p className="text-sm text-gray-500">
                  회의록이 저장될 데이터베이스를 선택하세요
                </p>
              </div>

              <div className="p-4 max-h-80 overflow-y-auto space-y-2">
                {databases.map((db) => (
                  <button
                    key={db.id}
                    onClick={() => {
                      selectDatabase(db)
                      setShowDatabaseSelector(false)
                    }}
                    className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${
                      selectedDatabase?.id === db.id
                        ? 'bg-blue-50 border-2 border-blue-200'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-xl shadow-sm">
                        {db.icon || '📄'}
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">{db.name}</p>
                        <p className="text-xs text-gray-500">
                          {db.properties.join(', ')}
                        </p>
                      </div>
                    </div>
                    {selectedDatabase?.id === db.id && (
                      <Check size={18} className="text-blue-500" />
                    )}
                  </button>
                ))}
              </div>

              <div className="p-4 border-t border-gray-100 bg-gray-50">
                <button
                  onClick={() => setShowDatabaseSelector(false)}
                  className="w-full py-2 text-sm text-gray-500 hover:text-gray-700"
                >
                  취소
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
