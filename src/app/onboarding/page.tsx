'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '@/stores/auth-store'
import {
  User,
  Briefcase,
  Users,
  Target,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Sparkles,
  Building,
  Code,
  Palette,
  TrendingUp,
  Megaphone,
  Settings,
  GraduationCap
} from 'lucide-react'
import { AnimatedBackground } from '@/components/ui/AnimatedBackground'

// Step configuration
const steps = [
  { id: 1, title: '역할 선택', description: '회사에서의 역할을 알려주세요' },
  { id: 2, title: '팀 정보', description: '팀과 회사 정보를 입력해주세요' },
  { id: 3, title: '관심 분야', description: '주로 어떤 회의에 참여하시나요?' },
  { id: 4, title: '완료', description: 'Onno 시작 준비 완료!' },
]

// Role options
const roles = [
  { id: 'pm', label: 'Product Manager', icon: Target, description: '제품 기획 및 로드맵 관리' },
  { id: 'engineer', label: 'Engineer', icon: Code, description: '개발 및 기술 구현' },
  { id: 'designer', label: 'Designer', icon: Palette, description: 'UX/UI 디자인' },
  { id: 'marketing', label: 'Marketing', icon: Megaphone, description: '마케팅 및 그로스' },
  { id: 'sales', label: 'Sales', icon: TrendingUp, description: '영업 및 비즈니스 개발' },
  { id: 'operations', label: 'Operations', icon: Settings, description: '운영 및 프로세스 관리' },
  { id: 'executive', label: 'Executive', icon: Briefcase, description: '경영진 및 리더십' },
  { id: 'other', label: 'Other', icon: GraduationCap, description: '기타 역할' },
]

// Team sizes
const teamSizes = [
  { id: '1-10', label: '1-10명' },
  { id: '11-50', label: '11-50명' },
  { id: '51-200', label: '51-200명' },
  { id: '201-500', label: '201-500명' },
  { id: '500+', label: '500명 이상' },
]

// Meeting types
const meetingTypes = [
  { id: 'standup', label: '스탠드업 / 데일리', emoji: '☀️' },
  { id: 'sprint', label: '스프린트 플래닝', emoji: '🏃' },
  { id: 'retrospective', label: '회고 미팅', emoji: '🔄' },
  { id: 'brainstorm', label: '브레인스토밍', emoji: '💡' },
  { id: 'review', label: '리뷰 미팅', emoji: '👀' },
  { id: 'oneonone', label: '1:1 미팅', emoji: '🤝' },
  { id: 'allhands', label: '전체 회의', emoji: '👥' },
  { id: 'client', label: '고객 미팅', emoji: '🎯' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()

  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    role: '',
    companyName: '',
    teamSize: '',
    meetingTypes: [] as string[],
  })

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  const handleRoleSelect = (roleId: string) => {
    setFormData({ ...formData, role: roleId })
  }

  const handleTeamSizeSelect = (sizeId: string) => {
    setFormData({ ...formData, teamSize: sizeId })
  }

  const handleMeetingTypeToggle = (typeId: string) => {
    const newTypes = formData.meetingTypes.includes(typeId)
      ? formData.meetingTypes.filter(t => t !== typeId)
      : [...formData.meetingTypes, typeId]
    setFormData({ ...formData, meetingTypes: newTypes })
  }

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    // Save onboarding data
    localStorage.setItem('onno_onboarding_complete', 'true')
    localStorage.setItem('onno_user_profile', JSON.stringify(formData))
    router.push('/dashboard')
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.role !== ''
      case 2:
        return formData.companyName !== '' && formData.teamSize !== ''
      case 3:
        return formData.meetingTypes.length > 0
      default:
        return true
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      <AnimatedBackground />

      <div className="min-h-screen flex flex-col">
        {/* Progress Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
          <div className="max-w-3xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">O</span>
                </div>
                <span className="font-bold text-xl text-gray-900">Onno</span>
              </div>
              <span className="text-sm text-gray-500">
                {currentStep} / {steps.length}
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / steps.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-2xl">
            <AnimatePresence mode="wait">
              {/* Step 1: Role Selection */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <User size={32} className="text-blue-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      어떤 역할을 담당하고 계신가요?
                    </h1>
                    <p className="text-gray-500">
                      Onno가 회의 분석을 최적화하는 데 도움이 됩니다
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {roles.map((role) => (
                      <motion.button
                        key={role.id}
                        onClick={() => handleRoleSelect(role.id)}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          formData.role === role.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-100 bg-white hover:border-gray-200'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <role.icon
                          size={24}
                          className={formData.role === role.id ? 'text-blue-500' : 'text-gray-400'}
                        />
                        <p className={`mt-2 font-medium text-sm ${
                          formData.role === role.id ? 'text-blue-700' : 'text-gray-700'
                        }`}>
                          {role.label}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {role.description}
                        </p>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Team Info */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Building size={32} className="text-purple-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      팀에 대해 알려주세요
                    </h1>
                    <p className="text-gray-500">
                      맞춤형 기능 추천을 위해 필요한 정보입니다
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        회사 / 팀 이름
                      </label>
                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        placeholder="예: Pocket Company"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        팀 규모
                      </label>
                      <div className="grid grid-cols-5 gap-2">
                        {teamSizes.map((size) => (
                          <button
                            key={size.id}
                            onClick={() => handleTeamSizeSelect(size.id)}
                            className={`py-3 px-2 rounded-lg border-2 text-sm font-medium transition-all ${
                              formData.teamSize === size.id
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-100 text-gray-600 hover:border-gray-200'
                            }`}
                          >
                            {size.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Meeting Types */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Users size={32} className="text-green-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      주로 어떤 회의에 참여하시나요?
                    </h1>
                    <p className="text-gray-500">
                      여러 개 선택 가능합니다
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {meetingTypes.map((type) => (
                      <motion.button
                        key={type.id}
                        onClick={() => handleMeetingTypeToggle(type.id)}
                        className={`p-4 rounded-xl border-2 text-center transition-all ${
                          formData.meetingTypes.includes(type.id)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-100 bg-white hover:border-gray-200'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="text-2xl">{type.emoji}</span>
                        <p className={`mt-2 font-medium text-sm ${
                          formData.meetingTypes.includes(type.id) ? 'text-blue-700' : 'text-gray-700'
                        }`}>
                          {type.label}
                        </p>
                        {formData.meetingTypes.includes(type.id) && (
                          <CheckCircle size={16} className="text-blue-500 mx-auto mt-2" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 4: Complete */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-8"
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                    className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto"
                  >
                    <Sparkles size={48} className="text-white" />
                  </motion.div>

                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                      설정이 완료되었습니다!
                    </h1>
                    <p className="text-lg text-gray-500 max-w-md mx-auto">
                      {user?.name}님, 환영합니다!
                      <br />
                      이제 Onno와 함께 더 생산적인 회의를 시작하세요.
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-6 max-w-md mx-auto">
                    <h3 className="font-medium text-gray-900 mb-4">설정 요약</h3>
                    <div className="space-y-3 text-left text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">역할</span>
                        <span className="font-medium text-gray-900">
                          {roles.find(r => r.id === formData.role)?.label}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">회사</span>
                        <span className="font-medium text-gray-900">{formData.companyName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">팀 규모</span>
                        <span className="font-medium text-gray-900">{formData.teamSize}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">회의 유형</span>
                        <span className="font-medium text-gray-900">
                          {formData.meetingTypes.length}개 선택됨
                        </span>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    onClick={handleComplete}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-blue-500 text-white rounded-xl font-semibold text-lg hover:bg-blue-600 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    대시보드로 이동
                    <ArrowRight size={20} />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* Footer Navigation */}
        {currentStep < 4 && (
          <footer className="bg-white border-t border-gray-100 py-4 px-6">
            <div className="max-w-2xl mx-auto flex items-center justify-between">
              <button
                onClick={handleBack}
                disabled={currentStep === 1}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentStep === 1
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <ArrowLeft size={18} />
                이전
              </button>

              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  canProceed()
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                다음
                <ArrowRight size={18} />
              </button>
            </div>
          </footer>
        )}
      </div>
    </>
  )
}
