'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/landing/Header'
import { Hero } from '@/components/landing/Hero'
import { PainPoints } from '@/components/landing/PainPoints'
import { Features } from '@/components/landing/Features'
import { SocialProof } from '@/components/landing/SocialProof'
import { SignupModal } from '@/components/landing/SignupModal'
import { FloatingCTA } from '@/components/landing/FloatingCTA'
import { UrgencyBanner } from '@/components/landing/UrgencyBanner'
import { LiveActivityFeed } from '@/components/landing/LiveActivityFeed'
import { AnimatedBackground } from '@/components/ui/AnimatedBackground'
import { ScrollProgress } from '@/components/ui/ScrollReveal'
import { useAuthStore } from '@/stores/auth-store'
import { motion } from 'framer-motion'
import { Rocket } from 'lucide-react'

export default function LandingPage() {
  const router = useRouter()
  const { openSignupModal, isAuthenticated, user } = useAuthStore()
  const [mounted, setMounted] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)

  // 클라이언트 마운트 확인
  useEffect(() => {
    setMounted(true)
  }, [])

  // Redirect authenticated users to onboarding or dashboard
  useEffect(() => {
    if (mounted && isAuthenticated && user) {
      setIsRedirecting(true)
      const hasCompletedOnboarding = localStorage.getItem('onno_onboarding_complete')
      if (hasCompletedOnboarding) {
        router.push('/dashboard')
      } else {
        router.push('/onboarding')
      }
    }
  }, [mounted, isAuthenticated, user, router])

  // Show loading only when actually redirecting
  if (isRedirecting) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">잠시만 기다려주세요...</p>
        </div>
      </main>
    )
  }

  return (
    <>
      {/* Urgency Banner - 손실 회피 심리 활용 */}
      <UrgencyBanner onCtaClick={openSignupModal} />

      {/* Scroll Progress Bar */}
      <ScrollProgress />

      {/* Animated Background */}
      <AnimatedBackground />

      {/* Header - 배너 높이만큼 top offset */}
      <div className="pt-10">
        <Header onLoginClick={openSignupModal} />
      </div>

      {/* Live Activity Feed - 사회적 증거 */}
      <LiveActivityFeed />

      <main className="relative">
        {/* Hero Section */}
        <Hero onCtaClick={openSignupModal} />

        {/* Pain Points Section */}
        <PainPoints />

        {/* Features Section */}
        <Features />

        {/* Social Proof Section */}
        <SocialProof />

        {/* Pricing Section */}
        <section id="pricing" className="py-24 px-6 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-sm font-semibold text-blue-500 mb-4 tracking-wide uppercase">
                Pricing
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                심플한 가격 정책
              </h2>
              <p className="text-lg text-gray-500 mb-12">
                14일 무료 체험 후 결정하세요. 카드등록 없이 바로 시작.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative"
            >
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl opacity-60" />

              <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 max-w-md mx-auto overflow-hidden">
                {/* Popular badge */}
                <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
                  POPULAR
                </div>

                <div className="text-sm font-medium text-blue-500 mb-2">
                  Pro 플랜
                </div>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-5xl font-bold text-gray-900">
                    ₩29,000
                  </span>
                  <span className="text-gray-500">/월</span>
                </div>
                <p className="text-sm text-gray-400 mb-8">
                  연간 결제 시 ₩24,000/월
                </p>

                <ul className="text-left space-y-4 mb-8">
                  {[
                    '무제한 미팅 녹음 및 분석',
                    '실시간 HUD 알림',
                    'Notion 자동 연동',
                    '시맨틱 검색 (무제한)',
                    '팀 공유 기능 (최대 10명)',
                    '우선 고객 지원',
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-3 text-sm">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 text-xs">✓</span>
                      </div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>

                <motion.button
                  onClick={openSignupModal}
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Rocket size={20} />
                    14일 무료로 시작하기
                  </span>
                  {/* Shimmer */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </motion.button>

                <p className="mt-4 text-xs text-gray-400">
                  언제든지 취소 가능 • 숨겨진 비용 없음
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-24 px-6 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                오늘부터 회의 스트레스,
                <br />
                Onno에게 맡기세요
              </h2>
              <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto">
                5분 만에 설정하고, 다음 회의부터 바로 효과를 경험하세요.
                <br />
                이미 1,200+ 팀이 Onno와 함께합니다.
              </p>

              <motion.button
                onClick={openSignupModal}
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-shadow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Rocket size={24} />
                무료로 시작하기
              </motion.button>

              <p className="mt-6 text-sm text-blue-200">
                카드등록 불필요 • 14일 무료 체험 • 언제든 취소
              </p>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 bg-gray-900 text-white">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                  <span className="font-bold text-lg">O</span>
                </div>
                <span className="font-bold text-xl">Onno</span>
              </div>

              <div className="flex flex-wrap justify-center gap-8">
                <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">
                  기능
                </a>
                <a href="#pricing" className="text-sm text-gray-400 hover:text-white transition-colors">
                  가격
                </a>
                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                  블로그
                </a>
                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                  고객사례
                </a>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-500">
                © 2025 Onno. All rights reserved.
              </p>
              <div className="flex gap-6">
                <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">
                  이용약관
                </a>
                <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">
                  개인정보처리방침
                </a>
                <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">
                  문의하기
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* Floating CTA */}
      <FloatingCTA onCtaClick={openSignupModal} />

      {/* Signup Modal */}
      <SignupModal />
    </>
  )
}
