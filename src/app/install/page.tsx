'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Chrome,
  Download,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  Shield,
  Zap,
  Settings,
  Play,
  Puzzle,
  MonitorPlay
} from 'lucide-react'
import { AnimatedBackground } from '@/components/ui/AnimatedBackground'
import Link from 'next/link'

const installSteps = [
  {
    id: 1,
    title: 'Chrome 웹스토어 방문',
    description: 'Chrome 웹스토어에서 Onno 확장 프로그램을 찾습니다.',
    icon: Chrome,
    action: 'Chrome 웹스토어 열기',
    detail: '버튼을 클릭하면 새 탭에서 Chrome 웹스토어가 열립니다.',
  },
  {
    id: 2,
    title: '확장 프로그램 추가',
    description: '"Chrome에 추가" 버튼을 클릭합니다.',
    icon: Download,
    action: null,
    detail: '권한 요청 팝업이 나타나면 "확장 프로그램 추가"를 클릭하세요.',
  },
  {
    id: 3,
    title: '권한 허용',
    description: '회의 분석을 위해 필요한 권한을 허용합니다.',
    icon: Shield,
    action: null,
    detail: 'Onno는 회의 탭에서만 작동하며, 데이터는 안전하게 암호화됩니다.',
  },
  {
    id: 4,
    title: '설치 완료!',
    description: '이제 Google Meet, Zoom에서 Onno를 사용할 수 있습니다.',
    icon: CheckCircle,
    action: '첫 회의 시작하기',
    detail: '브라우저 우상단의 Onno 아이콘을 클릭해 시작하세요.',
  },
]

const features = [
  {
    icon: Zap,
    title: '원클릭 시작',
    description: '회의 시작 시 자동으로 활성화',
  },
  {
    icon: MonitorPlay,
    title: 'Google Meet & Zoom',
    description: '주요 화상회의 플랫폼 지원',
  },
  {
    icon: Settings,
    title: '커스텀 설정',
    description: '알림, 언어, 저장 옵션 설정',
  },
]

export default function InstallPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isExtensionInstalled, setIsExtensionInstalled] = useState(false)

  // Check if extension is installed (mock - in real app would use chrome.runtime)
  useEffect(() => {
    // This would be replaced with actual extension detection
    const checkExtension = () => {
      // Mock check - in production, communicate with extension
      const installed = localStorage.getItem('onno_extension_installed') === 'true'
      setIsExtensionInstalled(installed)
      if (installed) {
        setCurrentStep(4)
      }
    }
    checkExtension()

    // Listen for extension installation message
    window.addEventListener('message', (event) => {
      if (event.data.type === 'ONNO_EXTENSION_INSTALLED') {
        setIsExtensionInstalled(true)
        setCurrentStep(4)
        localStorage.setItem('onno_extension_installed', 'true')
      }
    })
  }, [])

  const handleWebStoreClick = () => {
    // Open Chrome Web Store (mock URL)
    window.open('https://chrome.google.com/webstore/detail/onno', '_blank')
    // Move to next step after a delay
    setTimeout(() => {
      if (currentStep === 1) setCurrentStep(2)
    }, 2000)
  }

  const handleSimulateInstall = () => {
    // For demo purposes - simulate installation
    setCurrentStep(2)
    setTimeout(() => setCurrentStep(3), 1500)
    setTimeout(() => {
      setCurrentStep(4)
      setIsExtensionInstalled(true)
      localStorage.setItem('onno_extension_installed', 'true')
    }, 3000)
  }

  return (
    <>
      <AnimatedBackground />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">O</span>
            </div>
            <span className="font-bold text-xl text-gray-900">Onno</span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">이미 설치하셨나요?</span>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-blue-500 hover:text-blue-600"
            >
              대시보드로 이동
            </Link>
          </div>
        </nav>
      </header>

      <main className="min-h-screen pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-6">
              <Puzzle size={16} className="text-blue-500" />
              <span className="text-sm font-medium text-blue-600">Chrome 확장 프로그램</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Onno 확장 프로그램 설치
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              간단한 4단계로 설치를 완료하고,
              <br />
              다음 회의부터 바로 Onno를 사용해보세요.
            </p>
          </motion.div>

          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              {installSteps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <motion.div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${
                      currentStep >= step.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                    animate={{
                      scale: currentStep === step.id ? 1.1 : 1,
                    }}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle size={20} />
                    ) : (
                      step.id
                    )}
                  </motion.div>
                  {index < installSteps.length - 1 && (
                    <div className="w-full h-1 mx-2 bg-gray-100 rounded hidden md:block" style={{ width: '80px' }}>
                      <motion.div
                        className="h-full bg-blue-500 rounded"
                        initial={{ width: 0 }}
                        animate={{
                          width: currentStep > step.id ? '100%' : '0%',
                        }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Current Step Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8"
            >
              {installSteps.map((step) => {
                if (step.id !== currentStep) return null
                const StepIcon = step.icon

                return (
                  <div key={step.id} className="text-center">
                    <motion.div
                      className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center ${
                        step.id === 4 ? 'bg-green-100' : 'bg-blue-100'
                      }`}
                      animate={{
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    >
                      <StepIcon
                        size={40}
                        className={step.id === 4 ? 'text-green-500' : 'text-blue-500'}
                      />
                    </motion.div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Step {step.id}: {step.title}
                    </h2>
                    <p className="text-gray-600 mb-4">{step.description}</p>
                    <p className="text-sm text-gray-400 mb-8">{step.detail}</p>

                    {step.action && (
                      <motion.button
                        onClick={step.id === 1 ? handleWebStoreClick : undefined}
                        className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
                          step.id === 4
                            ? 'bg-green-500 hover:bg-green-600 text-white'
                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {step.id === 1 ? (
                          <>
                            <Chrome size={20} />
                            {step.action}
                            <ExternalLink size={16} />
                          </>
                        ) : (
                          <>
                            <Play size={20} />
                            {step.action}
                            <ArrowRight size={16} />
                          </>
                        )}
                      </motion.button>
                    )}

                    {step.id === 4 && (
                      <Link href="/dashboard">
                        <motion.button
                          className="inline-flex items-center gap-2 px-8 py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold text-lg"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Play size={20} />
                          대시보드로 이동
                          <ArrowRight size={16} />
                        </motion.button>
                      </Link>
                    )}

                    {/* Demo button for testing */}
                    {step.id === 1 && (
                      <button
                        onClick={handleSimulateInstall}
                        className="mt-4 text-sm text-gray-400 hover:text-gray-600 underline"
                      >
                        (데모: 설치 시뮬레이션)
                      </button>
                    )}
                  </div>
                )
              })}
            </motion.div>
          </AnimatePresence>

          {/* Step List */}
          <div className="grid md:grid-cols-4 gap-4 mb-12">
            {installSteps.map((step) => {
              const StepIcon = step.icon
              const isCompleted = currentStep > step.id
              const isCurrent = currentStep === step.id

              return (
                <motion.div
                  key={step.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isCompleted
                      ? 'bg-green-50 border-green-200'
                      : isCurrent
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-gray-50 border-gray-100'
                  }`}
                  animate={{
                    scale: isCurrent ? 1.02 : 1,
                  }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <StepIcon
                      size={20}
                      className={
                        isCompleted
                          ? 'text-green-500'
                          : isCurrent
                          ? 'text-blue-500'
                          : 'text-gray-400'
                      }
                    />
                    <span
                      className={`text-sm font-medium ${
                        isCompleted
                          ? 'text-green-700'
                          : isCurrent
                          ? 'text-blue-700'
                          : 'text-gray-500'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {isCompleted && (
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <CheckCircle size={12} />
                      완료
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>

          {/* Features */}
          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
              설치 후 사용 가능한 기능
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 mx-auto mb-3 bg-white rounded-xl shadow-sm flex items-center justify-center">
                    <feature.icon size={24} className="text-blue-500" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">{feature.title}</h4>
                  <p className="text-sm text-gray-500">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              설치에 문제가 있으신가요?{' '}
              <a href="#" className="text-blue-500 hover:underline">
                설치 가이드 보기
              </a>
              {' '}또는{' '}
              <a href="#" className="text-blue-500 hover:underline">
                고객센터 문의
              </a>
            </p>
          </div>
        </div>
      </main>
    </>
  )
}
