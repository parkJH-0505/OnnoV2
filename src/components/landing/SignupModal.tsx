'use client'

import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuthStore } from '@/stores/auth-store'
import { useState } from 'react'
import { Check, ArrowLeft, AlertTriangle } from 'lucide-react'

export function SignupModal() {
  const {
    isSignupModalOpen,
    signupModalView,
    isLoading,
    error,
    closeSignupModal,
    setSignupModalView,
    signInWithGoogle,
    signInWithGithub,
    signUpWithEmail,
  } = useAuthStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!termsAccepted) return
    await signUpWithEmail(email, password)
  }

  const handleLaterClick = () => {
    setSignupModalView('confirm-later')
  }

  const handleConfirmLater = () => {
    closeSignupModal()
  }

  // Main signup view
  const MainView = () => (
    <div className="text-center">
      {/* Header */}
      <div className="text-4xl mb-4">🎉</div>
      <h2 className="text-h2 text-gray-900 mb-3">체험이 마음에 드셨나요?</h2>
      <p className="text-body text-gray-500 mb-6">
        방금 경험한 AI 어시스턴트, 실제 미팅에서도 함께하세요
      </p>

      {/* Benefits Box */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Check size={16} className="text-green-500" />
            <span>14일 무료 체험 (카드등록 불필요)</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Check size={16} className="text-green-500" />
            <span>언제든 취소 가능</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Check size={16} className="text-green-500" />
            <span>체험 데이터 자동 이관</span>
          </div>
        </div>
      </div>

      {/* Primary CTA - Google */}
      <Button
        size="lg"
        onClick={signInWithGoogle}
        isLoading={isLoading}
        className="w-full mb-4 animate-pulse-subtle"
        leftIcon={
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        }
      >
        🚀 구글 계정으로 1초 만에 시작하기
      </Button>

      {/* Secondary CTAs */}
      <div className="flex gap-3 mb-4">
        <Button
          variant="secondary"
          className="flex-1"
          onClick={signInWithGithub}
          disabled={isLoading}
          leftIcon={
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          }
        >
          GitHub 계정
        </Button>
        <Button
          variant="secondary"
          className="flex-1"
          onClick={() => setSignupModalView('email')}
          disabled={isLoading}
          leftIcon={
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          }
        >
          이메일로 가입
        </Button>
      </div>

      {/* Social Proof */}
      <p className="text-sm text-gray-500 mb-6">
        💡 3,500명의 투자심사역이 Onno와 함께합니다
      </p>

      {/* Later Link */}
      <button
        onClick={handleLaterClick}
        className="text-sm text-gray-500 hover:text-gray-700 hover:underline transition-colors"
      >
        나중에
      </button>

      {/* Trust Badges */}
      <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t border-gray-100">
        <span className="text-xs text-gray-400">🔒 256-bit 암호화</span>
        <span className="text-xs text-gray-400">✅ ISO 27001 인증</span>
        <span className="text-xs text-gray-400">🛡️ GDPR 준수</span>
      </div>

      {/* Error message */}
      {error && (
        <p className="mt-4 text-sm text-red-500 bg-red-50 p-3 rounded-lg">
          {error}
        </p>
      )}
    </div>
  )

  // Email signup view
  const EmailView = () => (
    <div>
      <button
        onClick={() => setSignupModalView('main')}
        className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600 mb-6"
      >
        <ArrowLeft size={16} />
        다른 방법으로 가입
      </button>

      <h2 className="text-h3 text-gray-900 mb-6">📧 이메일로 시작하기</h2>

      <form onSubmit={handleEmailSubmit} className="space-y-4">
        <Input
          type="email"
          placeholder="이메일 주소"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
        <Input
          type="password"
          placeholder="비밀번호 (8자 이상)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">
            14일 무료 체험 약관 동의 (필수){' '}
            <a href="#" className="text-blue-500 underline">
              자세히 보기
            </a>
          </span>
        </label>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={!termsAccepted}
          isLoading={isLoading}
        >
          가입 완료
        </Button>
      </form>

      {error && (
        <p className="mt-4 text-sm text-red-500 bg-red-50 p-3 rounded-lg">
          {error}
        </p>
      )}
    </div>
  )

  // Confirm later view
  const ConfirmLaterView = () => (
    <div className="text-center">
      <div className="text-5xl mb-4">⚠️</div>
      <h2 className="text-h3 text-gray-900 mb-3">잠깐만요!</h2>
      <p className="text-sm text-red-500 mb-4">
        가입하지 않으면 체험 데이터가
        <br />
        7일 후 자동으로 삭제됩니다.
      </p>

      <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
        <p className="text-sm font-medium text-gray-700 mb-2">
          지금 가입하면:
        </p>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Check size={16} className="text-green-500" />
            <span>체험 데이터 영구 보관</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Check size={16} className="text-green-500" />
            <span>14일 무료 체험 (카드 불필요)</span>
          </div>
        </div>
      </div>

      <Button
        size="lg"
        onClick={() => setSignupModalView('main')}
        className="w-full mb-3"
      >
        1초 가입하기
      </Button>

      <Button
        variant="secondary"
        className="w-full"
        onClick={handleConfirmLater}
      >
        그래도 나중에
      </Button>
    </div>
  )

  return (
    <Modal
      isOpen={isSignupModalOpen}
      onClose={closeSignupModal}
      size={signupModalView === 'confirm-later' ? 'sm' : 'md'}
    >
      {signupModalView === 'main' && <MainView />}
      {signupModalView === 'email' && <EmailView />}
      {signupModalView === 'confirm-later' && <ConfirmLaterView />}
    </Modal>
  )
}
