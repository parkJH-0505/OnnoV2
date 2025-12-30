import { create } from 'zustand'

// Types for Demo Events
export type DemoEventType =
  | 'zoom_speaker_change'
  | 'zoom_audio_level'
  | 'zoom_screen_share'
  | 'slack_message'
  | 'slack_typing'
  | 'slack_notification'
  | 'hud_insight'
  | 'hud_question'
  | 'hud_intervention'
  | 'hud_quality_update'
  | 'hud_progress_update'
  | 'transcript_update'
  | 'transcript_highlight'

export interface DemoEvent {
  timestamp: number // milliseconds from start
  type: DemoEventType
  payload: Record<string, unknown>
  duration?: number
}

export interface DemoScenario {
  id: string
  title: string
  description: string
  duration: number // total duration in ms
  playbackSpeed: number
  events: DemoEvent[]
}

export interface HUDInsight {
  id: string
  type: 'context' | 'suggestion' | 'alert'
  content: string
  timestamp: number
  icon?: string
}

export interface HUDQuestion {
  id: string
  speaker: string
  content: string
  timestamp: number
  status: 'pending' | 'addressed' | 'deferred'
}

export interface InterventionData {
  id: string
  type: 'tangent' | 'decision_needed' | 'time_warning' | 'context'
  title: string
  description: string
  suggestion?: string
  actions?: Array<{
    label: string
    action: string
  }>
}

export interface VirtualWindow {
  id: string
  app: 'zoom' | 'slack' | 'browser' | 'finder' | 'onno'
  title: string
  position: { x: number; y: number }
  size: { width: number; height: number }
  isMinimized: boolean
  isMaximized: boolean
  zIndex: number
}

export interface TranscriptEntry {
  id: string
  speaker: string
  content: string
  timestamp: number
  isHighlighted?: boolean
}

export interface ZoomParticipant {
  id: string
  name: string
  avatar?: string
  isSpeaking: boolean
  isMuted: boolean
  isVideoOn: boolean
}

export interface SlackMessage {
  id: string
  channel: string
  sender: string
  content: string
  timestamp: number
  isNew?: boolean
}

interface DemoState {
  // Mode
  currentMode: 'hud' | 'console'
  isTransitioning: boolean

  // Scenario & Playback
  scenario: DemoScenario | null
  currentTime: number
  isPlaying: boolean
  playbackSpeed: number

  // HUD State
  hudState: {
    mode: 'minimized' | 'expanded' | 'intervention'
    position: { x: number; y: number }
    insights: HUDInsight[]
    questions: HUDQuestion[]
    qualityScore: number
    currentIntervention: InterventionData | null
  }

  // Virtual Desktop
  windows: VirtualWindow[]
  activeWindowId: string | null
  nextZIndex: number

  // App States
  zoomState: {
    participants: ZoomParticipant[]
    currentSpeakerId: string | null
    isScreenSharing: boolean
    meetingTitle: string
    meetingDuration: number
  }

  slackState: {
    messages: SlackMessage[]
    unreadCount: number
    activeChannel: string
  }

  // Transcript
  transcript: TranscriptEntry[]

  // Actions
  setMode: (mode: 'hud' | 'console') => void
  toggleMode: () => void
  loadScenario: (scenario: DemoScenario) => void
  play: () => void
  pause: () => void
  seek: (time: number) => void
  setPlaybackSpeed: (speed: number) => void

  // HUD Actions
  setHUDMode: (mode: 'minimized' | 'expanded' | 'intervention') => void
  setHUDPosition: (position: { x: number; y: number }) => void
  addInsight: (insight: HUDInsight) => void
  addQuestion: (question: HUDQuestion) => void
  updateQualityScore: (score: number) => void
  showIntervention: (intervention: InterventionData) => void
  dismissIntervention: () => void

  // Window Actions
  createWindow: (window: Omit<VirtualWindow, 'zIndex'>) => void
  closeWindow: (id: string) => void
  focusWindow: (id: string) => void
  updateWindowPosition: (id: string, position: { x: number; y: number }) => void
  updateWindowSize: (id: string, size: { width: number; height: number }) => void
  minimizeWindow: (id: string) => void
  maximizeWindow: (id: string) => void
  restoreWindow: (id: string) => void
  toggleWindowMinimized: (id: string) => void

  // App Actions
  updateZoomParticipant: (id: string, updates: Partial<ZoomParticipant>) => void
  setCurrentSpeaker: (speakerId: string | null) => void
  addSlackMessage: (message: SlackMessage) => void
  addTranscriptEntry: (entry: TranscriptEntry) => void
  highlightTranscript: (id: string) => void

  // Reset
  reset: () => void
}

// Default scenario with Korean content - 15분 분량
const defaultScenario: DemoScenario = {
  id: 'sprint-meeting',
  title: '주간 스프린트 회의',
  description: '15분 분량의 실제 회의 시뮬레이션',
  duration: 900000, // 15 minutes in ms
  playbackSpeed: 5, // 5x speed = 3분 실제 시간
  events: [
    // === 0-1분: 회의 시작 ===
    { timestamp: 0, type: 'zoom_speaker_change', payload: { speakerId: 'p1' } },
    { timestamp: 3000, type: 'transcript_update', payload: { speaker: '김팀장', content: '네, 다들 들어오셨네요. 시작하겠습니다.' } },
    { timestamp: 8000, type: 'hud_insight', payload: { type: 'context', content: '지난 회의 결정사항 3건 미완료' } },
    { timestamp: 15000, type: 'hud_quality_update', payload: { score: 75 } },

    // === 1-2분: 진행상황 공유 ===
    { timestamp: 30000, type: 'transcript_update', payload: { speaker: '김팀장', content: '자, 이번 스프린트 진행상황 먼저 공유해주세요.' } },
    { timestamp: 45000, type: 'zoom_speaker_change', payload: { speakerId: 'p2' } },
    { timestamp: 50000, type: 'transcript_update', payload: { speaker: '이개발', content: '프론트엔드 작업은 70% 완료했습니다. 메인 대시보드 컴포넌트 작업 중입니다.' } },
    { timestamp: 70000, type: 'hud_quality_update', payload: { score: 82 } },
    { timestamp: 80000, type: 'transcript_update', payload: { speaker: '이개발', content: 'API 연동은 다음 주 초에 시작할 수 있을 것 같습니다.' } },

    // === 2-3분: 질문 및 논의 ===
    { timestamp: 100000, type: 'zoom_speaker_change', payload: { speakerId: 'p3' } },
    { timestamp: 105000, type: 'hud_question', payload: { speaker: '박기획', content: 'API 연동 일정은 어떻게 되나요?' } },
    { timestamp: 110000, type: 'transcript_update', payload: { speaker: '박기획', content: 'API 연동 일정이 궁금한데, 백엔드 쪽이랑 싱크는 맞춰봤나요?' } },
    { timestamp: 130000, type: 'zoom_speaker_change', payload: { speakerId: 'p2' } },
    { timestamp: 135000, type: 'transcript_update', payload: { speaker: '이개발', content: '아직 구체적인 싱크는 못 맞췄어요. 이번 주 중으로 미팅 잡아볼게요.' } },
    { timestamp: 150000, type: 'hud_insight', payload: { type: 'suggestion', content: '액션아이템: 백엔드 팀과 API 연동 미팅 일정 조율 필요' } },

    // === 3-4분: 주제 이탈 - 개입 ===
    { timestamp: 180000, type: 'zoom_speaker_change', payload: { speakerId: 'p3' } },
    { timestamp: 185000, type: 'transcript_update', payload: { speaker: '박기획', content: '아 그리고 지난주 디자인 피드백 건도 말씀드리고 싶은데...' } },
    { timestamp: 195000, type: 'hud_intervention', payload: {
      type: 'tangent',
      title: '주제 이탈 감지',
      description: '현재 스프린트 진행상황에서 디자인 피드백으로 주제가 전환되었습니다.',
      suggestion: '"디자인 피드백은 별도 논의로 정리하고, 스프린트 진행 먼저 마무리할까요?"'
    }},

    // === 4-5분: 궤도 복귀 ===
    { timestamp: 240000, type: 'zoom_speaker_change', payload: { speakerId: 'p1' } },
    { timestamp: 245000, type: 'transcript_update', payload: { speaker: '김팀장', content: '디자인 건은 잠깐 메모해두고, 스프린트 먼저 마무리하죠.' } },
    { timestamp: 260000, type: 'hud_quality_update', payload: { score: 88 } },
    { timestamp: 270000, type: 'transcript_update', payload: { speaker: '김팀장', content: '최디자인님, 디자인 작업은 어떻게 진행되고 있나요?' } },
    { timestamp: 285000, type: 'zoom_speaker_change', payload: { speakerId: 'p4' } },
    { timestamp: 290000, type: 'transcript_update', payload: { speaker: '최디자인', content: '모바일 반응형 디자인 마무리 단계입니다. 내일 피그마에 업로드할 예정이에요.' } },

    // === 5-6분: Slack 알림 ===
    { timestamp: 320000, type: 'slack_notification', payload: {
      channel: '#dev-team',
      sender: '배포봇',
      content: '🚀 스테이징 서버 배포 완료 (v2.3.1)'
    }},
    { timestamp: 330000, type: 'hud_insight', payload: { type: 'context', content: '스테이징 배포 완료 - 테스트 가능' } },

    // === 6-8분: 릴리즈 결정 ===
    { timestamp: 360000, type: 'zoom_speaker_change', payload: { speakerId: 'p1' } },
    { timestamp: 365000, type: 'transcript_update', payload: { speaker: '김팀장', content: '릴리즈 일정에 대해 논의해볼까요? 원래 다음 주 금요일 예정인데...' } },
    { timestamp: 400000, type: 'zoom_speaker_change', payload: { speakerId: 'p2' } },
    { timestamp: 405000, type: 'transcript_update', payload: { speaker: '이개발', content: '솔직히 좀 빠듯해요. 테스트 기간을 고려하면 1주 정도 연기하는 게...' } },
    { timestamp: 430000, type: 'hud_intervention', payload: {
      type: 'decision_needed',
      title: '결정 필요',
      description: '릴리즈 일정에 대한 결정이 필요합니다. 논의가 길어지고 있습니다.',
      suggestion: '옵션 1: 기능 축소 후 예정대로 릴리즈\n옵션 2: 1주 연기 후 전체 기능 포함'
    }},
    { timestamp: 480000, type: 'transcript_update', payload: { speaker: '김팀장', content: '좋아요, 1주 연기하고 전체 기능 포함해서 가죠.' } },
    { timestamp: 490000, type: 'hud_insight', payload: { type: 'suggestion', content: '📋 결정: 릴리즈 1주 연기 (12/20 → 12/27)' } },
    { timestamp: 500000, type: 'hud_quality_update', payload: { score: 92 } },

    // === 8-10분: QA 일정 ===
    { timestamp: 520000, type: 'zoom_speaker_change', payload: { speakerId: 'p3' } },
    { timestamp: 525000, type: 'transcript_update', payload: { speaker: '박기획', content: 'QA 일정도 조정해야 할 것 같아요.' } },
    { timestamp: 550000, type: 'transcript_update', payload: { speaker: '박기획', content: '연기된 일정 기준으로 12월 23일부터 QA 진행하면 될까요?' } },
    { timestamp: 580000, type: 'hud_question', payload: { speaker: '김팀장', content: 'QA 기간 3일이면 충분한가요?' } },
    { timestamp: 600000, type: 'transcript_update', payload: { speaker: '김팀장', content: 'QA 기간이 3일인데, 괜찮을까요?' } },

    // === 10-12분: 시간 경고 ===
    { timestamp: 660000, type: 'hud_intervention', payload: {
      type: 'time_warning',
      title: '회의 시간 알림',
      description: '예정 시간의 73%가 경과했습니다. 미논의 안건 1건이 남아있습니다.',
      suggestion: '남은 안건: 다음 스프린트 계획'
    }},
    { timestamp: 680000, type: 'zoom_speaker_change', payload: { speakerId: 'p1' } },
    { timestamp: 685000, type: 'transcript_update', payload: { speaker: '김팀장', content: '시간이 얼마 안 남았네요. 다음 스프린트 간단히 정리하고 마무리할게요.' } },

    // === 12-14분: 다음 스프린트 ===
    { timestamp: 720000, type: 'transcript_update', payload: { speaker: '김팀장', content: '다음 스프린트는 사용자 피드백 반영이 메인이 될 것 같습니다.' } },
    { timestamp: 750000, type: 'hud_insight', payload: { type: 'context', content: '다음 스프린트 주요 목표: 사용자 피드백 반영' } },
    { timestamp: 780000, type: 'slack_notification', payload: {
      channel: '#dev-team',
      sender: '최디자인',
      content: '피그마 링크 공유드려요: figma.com/file/...'
    }},
    { timestamp: 800000, type: 'transcript_update', payload: { speaker: '김팀장', content: '네, 최디자인님 감사합니다. 다들 확인해주세요.' } },

    // === 14-15분: 마무리 ===
    { timestamp: 840000, type: 'zoom_speaker_change', payload: { speakerId: 'p1' } },
    { timestamp: 845000, type: 'transcript_update', payload: { speaker: '김팀장', content: '오늘 회의 잘 마무리됐네요. 정리해보면...' } },
    { timestamp: 860000, type: 'hud_quality_update', payload: { score: 95 } },
    { timestamp: 870000, type: 'hud_insight', payload: { type: 'suggestion', content: '✅ 회의 완료: 결정사항 3건, 액션아이템 5건 정리됨' } },
    { timestamp: 885000, type: 'transcript_update', payload: { speaker: '김팀장', content: '수고하셨습니다. 다음 주에 뵐게요!' } },
    { timestamp: 900000, type: 'hud_quality_update', payload: { score: 96 } },
  ],
}

// Default participants
const defaultParticipants: ZoomParticipant[] = [
  { id: 'p1', name: '김팀장', isSpeaking: false, isMuted: false, isVideoOn: true },
  { id: 'p2', name: '이개발', isSpeaking: false, isMuted: false, isVideoOn: true },
  { id: 'p3', name: '박기획', isSpeaking: false, isMuted: true, isVideoOn: true },
  { id: 'p4', name: '최디자인', isSpeaking: false, isMuted: true, isVideoOn: false },
]

// Default windows configuration
const defaultWindows: VirtualWindow[] = [
  {
    id: 'zoom',
    app: 'zoom',
    title: 'Zoom Meeting',
    position: { x: 60, y: 40 },
    size: { width: 800, height: 550 },
    isMinimized: false,
    isMaximized: false,
    zIndex: 1,
  },
  {
    id: 'slack',
    app: 'slack',
    title: 'Slack - Pocket Company',
    position: { x: 880, y: 60 },
    size: { width: 480, height: 520 },
    isMinimized: false,
    isMaximized: false,
    zIndex: 2,
  },
]

const initialState = {
  currentMode: 'hud' as const,
  isTransitioning: false,
  scenario: defaultScenario,
  currentTime: 0,
  isPlaying: false,
  playbackSpeed: 5,
  hudState: {
    mode: 'expanded' as const,
    position: { x: 20, y: 100 },
    insights: [],
    questions: [],
    qualityScore: 88,
    currentIntervention: null,
  },
  windows: defaultWindows,
  activeWindowId: 'zoom',
  nextZIndex: 3,
  zoomState: {
    participants: defaultParticipants,
    currentSpeakerId: 'p1',
    isScreenSharing: false,
    meetingTitle: '주간 스프린트 회의',
    meetingDuration: 0,
  },
  slackState: {
    messages: [
      { id: 's1', channel: '#general', sender: '시스템', content: '오늘의 회의: 주간 스프린트 회의 (오후 2시)', timestamp: Date.now() - 3600000 },
      { id: 's2', channel: '#dev-team', sender: '이개발', content: 'PR 리뷰 부탁드립니다~', timestamp: Date.now() - 1800000 },
    ],
    unreadCount: 0,
    activeChannel: '#dev-team',
  },
  transcript: [],
}

export const useDemoStore = create<DemoState>()((set, get) => ({
  ...initialState,

  // Mode switching
  setMode: (mode) => {
    set({ isTransitioning: true })
    setTimeout(() => {
      set({ currentMode: mode, isTransitioning: false })
    }, 500)
  },

  toggleMode: () => {
    const { currentMode } = get()
    get().setMode(currentMode === 'hud' ? 'console' : 'hud')
  },

  // Scenario & Playback
  loadScenario: (scenario) => set({ scenario, currentTime: 0 }),

  play: () => set({ isPlaying: true }),

  pause: () => set({ isPlaying: false }),

  seek: (time) => set({ currentTime: time }),

  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),

  // HUD Actions
  setHUDMode: (mode) => set((state) => ({
    hudState: { ...state.hudState, mode }
  })),

  setHUDPosition: (position) => set((state) => ({
    hudState: { ...state.hudState, position }
  })),

  addInsight: (insight) => set((state) => ({
    hudState: {
      ...state.hudState,
      insights: [...state.hudState.insights, insight].slice(-5), // Keep last 5
    }
  })),

  addQuestion: (question) => set((state) => ({
    hudState: {
      ...state.hudState,
      questions: [...state.hudState.questions, question].slice(-3),
    }
  })),

  updateQualityScore: (score) => set((state) => ({
    hudState: { ...state.hudState, qualityScore: score }
  })),

  showIntervention: (intervention) => set((state) => ({
    hudState: {
      ...state.hudState,
      // mode는 변경하지 않고 intervention만 설정 (HUD에서 하단 배너로 표시)
      currentIntervention: intervention,
    }
  })),

  dismissIntervention: () => set((state) => ({
    hudState: {
      ...state.hudState,
      // mode는 변경하지 않고 intervention만 해제
      currentIntervention: null,
    }
  })),

  // Window Actions
  createWindow: (window) => set((state) => ({
    windows: [...state.windows, { ...window, zIndex: state.nextZIndex }],
    nextZIndex: state.nextZIndex + 1,
    activeWindowId: window.id,
  })),

  closeWindow: (id) => set((state) => ({
    windows: state.windows.filter((w) => w.id !== id),
    activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
  })),

  focusWindow: (id) => set((state) => ({
    windows: state.windows.map((w) =>
      w.id === id ? { ...w, zIndex: state.nextZIndex } : w
    ),
    nextZIndex: state.nextZIndex + 1,
    activeWindowId: id,
  })),

  updateWindowPosition: (id, position) => set((state) => ({
    windows: state.windows.map((w) =>
      w.id === id ? { ...w, position } : w
    ),
  })),

  updateWindowSize: (id, size) => set((state) => ({
    windows: state.windows.map((w) =>
      w.id === id ? { ...w, size } : w
    ),
  })),

  minimizeWindow: (id) => set((state) => ({
    windows: state.windows.map((w) =>
      w.id === id ? { ...w, isMinimized: true } : w
    ),
  })),

  maximizeWindow: (id) => set((state) => ({
    windows: state.windows.map((w) =>
      w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
    ),
  })),

  restoreWindow: (id) => set((state) => ({
    windows: state.windows.map((w) =>
      w.id === id ? { ...w, isMinimized: false, zIndex: state.nextZIndex } : w
    ),
    nextZIndex: state.nextZIndex + 1,
    activeWindowId: id,
  })),

  toggleWindowMinimized: (id) => set((state) => {
    const window = state.windows.find((w) => w.id === id)
    if (!window) return state

    if (window.isMinimized) {
      // Restore
      return {
        windows: state.windows.map((w) =>
          w.id === id ? { ...w, isMinimized: false, zIndex: state.nextZIndex } : w
        ),
        nextZIndex: state.nextZIndex + 1,
        activeWindowId: id,
      }
    } else if (state.activeWindowId === id) {
      // Minimize only if it's the active window
      return {
        windows: state.windows.map((w) =>
          w.id === id ? { ...w, isMinimized: true } : w
        ),
        activeWindowId: null,
      }
    } else {
      // Just focus if it's not the active window
      return {
        windows: state.windows.map((w) =>
          w.id === id ? { ...w, zIndex: state.nextZIndex } : w
        ),
        nextZIndex: state.nextZIndex + 1,
        activeWindowId: id,
      }
    }
  }),

  // App Actions
  updateZoomParticipant: (id, updates) => set((state) => ({
    zoomState: {
      ...state.zoomState,
      participants: state.zoomState.participants.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    },
  })),

  setCurrentSpeaker: (speakerId) => set((state) => ({
    zoomState: {
      ...state.zoomState,
      currentSpeakerId: speakerId,
      participants: state.zoomState.participants.map((p) => ({
        ...p,
        isSpeaking: p.id === speakerId,
      })),
    },
  })),

  addSlackMessage: (message) => set((state) => ({
    slackState: {
      ...state.slackState,
      messages: [...state.slackState.messages, message],
      unreadCount: state.slackState.unreadCount + 1,
    },
  })),

  addTranscriptEntry: (entry) => set((state) => ({
    transcript: [...state.transcript, entry],
  })),

  highlightTranscript: (id) => set((state) => ({
    transcript: state.transcript.map((t) => ({
      ...t,
      isHighlighted: t.id === id,
    })),
  })),

  // Reset
  reset: () => set(initialState),
}))
