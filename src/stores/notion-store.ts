import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface NotionWorkspace {
  id: string
  name: string
  icon?: string
}

interface NotionDatabase {
  id: string
  name: string
  icon?: string
  properties: string[]
}

interface NotionState {
  // Connection state
  isConnected: boolean
  isConnecting: boolean
  accessToken: string | null

  // Workspace & Database
  workspace: NotionWorkspace | null
  databases: NotionDatabase[]
  selectedDatabase: NotionDatabase | null

  // Sync settings
  syncSettings: {
    autoSync: boolean
    syncDecisions: boolean
    syncActionItems: boolean
    syncSummary: boolean
    syncTranscript: boolean
    notifyOnSync: boolean
  }

  // Last sync info
  lastSyncAt: string | null
  syncHistory: Array<{
    id: string
    meetingTitle: string
    syncedAt: string
    itemCount: number
    status: 'success' | 'failed'
  }>

  // Actions
  connect: () => Promise<void>
  disconnect: () => void
  selectDatabase: (database: NotionDatabase) => void
  updateSyncSettings: (settings: Partial<NotionState['syncSettings']>) => void
  syncMeeting: (meetingId: string) => Promise<void>
}

// Mock data for demo
const mockWorkspace: NotionWorkspace = {
  id: 'ws_1',
  name: 'Pocket Company',
  icon: '🏢',
}

const mockDatabases: NotionDatabase[] = [
  {
    id: 'db_1',
    name: '회의록',
    icon: '📝',
    properties: ['제목', '날짜', '참석자', '결정사항', '액션아이템'],
  },
  {
    id: 'db_2',
    name: '프로젝트 관리',
    icon: '📊',
    properties: ['프로젝트', '상태', '담당자', '마감일'],
  },
  {
    id: 'db_3',
    name: '팀 위키',
    icon: '📚',
    properties: ['제목', '카테고리', '작성자', '태그'],
  },
]

export const useNotionStore = create<NotionState>()(
  persist(
    (set, get) => ({
      // Initial state
      isConnected: false,
      isConnecting: false,
      accessToken: null,
      workspace: null,
      databases: [],
      selectedDatabase: null,
      syncSettings: {
        autoSync: true,
        syncDecisions: true,
        syncActionItems: true,
        syncSummary: true,
        syncTranscript: false,
        notifyOnSync: true,
      },
      lastSyncAt: null,
      syncHistory: [],

      // Connect to Notion (mock)
      connect: async () => {
        set({ isConnecting: true })

        try {
          // Simulate OAuth flow
          await new Promise((resolve) => setTimeout(resolve, 2000))

          // Mock successful connection
          set({
            isConnected: true,
            isConnecting: false,
            accessToken: 'mock_token_' + Math.random().toString(36).substr(2, 9),
            workspace: mockWorkspace,
            databases: mockDatabases,
          })
        } catch (error) {
          set({ isConnecting: false })
          throw error
        }
      },

      // Disconnect from Notion
      disconnect: () => {
        set({
          isConnected: false,
          accessToken: null,
          workspace: null,
          databases: [],
          selectedDatabase: null,
          lastSyncAt: null,
        })
      },

      // Select a database for sync
      selectDatabase: (database) => {
        set({ selectedDatabase: database })
      },

      // Update sync settings
      updateSyncSettings: (settings) => {
        set((state) => ({
          syncSettings: { ...state.syncSettings, ...settings },
        }))
      },

      // Sync a meeting (mock)
      syncMeeting: async (meetingId) => {
        const { selectedDatabase, syncHistory } = get()

        if (!selectedDatabase) {
          throw new Error('No database selected')
        }

        // Simulate sync
        await new Promise((resolve) => setTimeout(resolve, 1500))

        const newSyncEntry = {
          id: 'sync_' + Math.random().toString(36).substr(2, 9),
          meetingTitle: '주간 스프린트 회의',
          syncedAt: new Date().toISOString(),
          itemCount: Math.floor(Math.random() * 10) + 3,
          status: 'success' as const,
        }

        set({
          lastSyncAt: new Date().toISOString(),
          syncHistory: [newSyncEntry, ...syncHistory.slice(0, 9)],
        })
      },
    }),
    {
      name: 'onno-notion-storage',
      partialize: (state) => ({
        isConnected: state.isConnected,
        accessToken: state.accessToken,
        workspace: state.workspace,
        selectedDatabase: state.selectedDatabase,
        syncSettings: state.syncSettings,
      }),
    }
  )
)
