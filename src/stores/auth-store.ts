import { create } from 'zustand'

interface User {
  id: string
  email: string
  name: string
  provider: 'google' | 'github' | 'email'
  createdAt: string
}

interface AuthState {
  // State
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  // Modal state
  isSignupModalOpen: boolean
  signupModalView: 'main' | 'email' | 'confirm-later'

  // Actions
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  // Modal actions
  openSignupModal: () => void
  closeSignupModal: () => void
  setSignupModalView: (view: 'main' | 'email' | 'confirm-later') => void

  // Auth actions
  signInWithGoogle: () => Promise<void>
  signInWithGithub: () => Promise<void>
  signUpWithEmail: (email: string, password: string) => Promise<void>
  signOut: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  isSignupModalOpen: false,
  signupModalView: 'main',

  // State setters
  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
    }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  // Modal actions
  openSignupModal: () =>
    set({
      isSignupModalOpen: true,
      signupModalView: 'main',
      error: null,
    }),

  closeSignupModal: () =>
    set({
      isSignupModalOpen: false,
      signupModalView: 'main',
    }),

  setSignupModalView: (view) => set({ signupModalView: view }),

  // Auth actions
  signInWithGoogle: async () => {
    const { setLoading, setError, setUser, closeSignupModal } = get()
    setLoading(true)
    setError(null)

    try {
      // TODO: Implement actual Google OAuth
      // For now, simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock user for development
      const mockUser: User = {
        id: 'usr_' + Math.random().toString(36).substr(2, 9),
        email: 'user@gmail.com',
        name: '테스트 사용자',
        provider: 'google',
        createdAt: new Date().toISOString(),
      }

      setUser(mockUser)
      closeSignupModal()
    } catch (error) {
      setError('Google 로그인에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  },

  signInWithGithub: async () => {
    const { setLoading, setError, setUser, closeSignupModal } = get()
    setLoading(true)
    setError(null)

    try {
      // TODO: Implement actual GitHub OAuth
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const mockUser: User = {
        id: 'usr_' + Math.random().toString(36).substr(2, 9),
        email: 'user@github.com',
        name: 'GitHub 사용자',
        provider: 'github',
        createdAt: new Date().toISOString(),
      }

      setUser(mockUser)
      closeSignupModal()
    } catch (error) {
      setError('GitHub 로그인에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  },

  signUpWithEmail: async (email: string, password: string) => {
    const { setLoading, setError, setUser, closeSignupModal } = get()
    setLoading(true)
    setError(null)

    try {
      // Validation
      if (!email || !email.includes('@')) {
        throw new Error('올바른 이메일 주소를 입력해주세요.')
      }
      if (!password || password.length < 8) {
        throw new Error('비밀번호는 8자 이상이어야 합니다.')
      }

      // TODO: Implement actual email signup API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const mockUser: User = {
        id: 'usr_' + Math.random().toString(36).substr(2, 9),
        email,
        name: email.split('@')[0],
        provider: 'email',
        createdAt: new Date().toISOString(),
      }

      setUser(mockUser)
      closeSignupModal()
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : '회원가입에 실패했습니다. 다시 시도해주세요.'
      )
    } finally {
      setLoading(false)
    }
  },

  signOut: () => {
    set({
      user: null,
      isAuthenticated: false,
    })
  },
}))
