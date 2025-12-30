'use client'

import { motion } from 'framer-motion'
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ui/ScrollReveal'
import { Clock, FileSearch, AlertTriangle, Users } from 'lucide-react'

const painPoints = [
  {
    icon: Clock,
    title: '회의록 정리에 1시간+',
    description: '회의 끝나고 또 회의록 정리하느라 퇴근이 늦어지시나요?',
    stat: '평균 47분',
    statLabel: '회의당 정리 시간',
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-100',
  },
  {
    icon: FileSearch,
    title: '결정사항 추적 불가',
    description: '"분명 회의 때 결정했는데..." 다들 다르게 기억하고 있진 않나요?',
    stat: '62%',
    statLabel: '의 결정사항이 실행 안됨',
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-100',
  },
  {
    icon: AlertTriangle,
    title: '놓친 내용 불안감',
    description: '"중요한 거 놓친 것 같은데..." 불안한 느낌을 받으신 적 있나요?',
    stat: '3.2회',
    statLabel: '회의당 놓치는 중요 내용',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-100',
  },
  {
    icon: Users,
    title: '팀원 간 정보 비대칭',
    description: '같은 회의였는데 팀원들이 서로 다른 내용을 기억하고 있나요?',
    stat: '78%',
    statLabel: '의 팀이 정보 불일치 경험',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-100',
  },
]

export function PainPoints() {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal className="text-center mb-16">
          <p className="text-sm font-semibold text-blue-500 mb-4 tracking-wide uppercase">
            The Problem
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            이런 경험, 익숙하시죠?
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            매일 반복되는 비효율, 이제 끝낼 때가 됐습니다
          </p>
        </ScrollReveal>

        <StaggerContainer className="grid md:grid-cols-2 gap-6" staggerDelay={0.15}>
          {painPoints.map((point, index) => (
            <StaggerItem key={index}>
              <motion.div
                className={`relative p-6 rounded-2xl border ${point.borderColor} ${point.bgColor} overflow-hidden group cursor-default`}
                whileHover={{ scale: 1.02, y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${point.bgColor} ${point.color} mb-4`}>
                  <point.icon size={24} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {point.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {point.description}
                </p>

                {/* Stat */}
                <div className="flex items-baseline gap-2">
                  <span className={`text-2xl font-bold ${point.color}`}>
                    {point.stat}
                  </span>
                  <span className="text-sm text-gray-500">
                    {point.statLabel}
                  </span>
                </div>

                {/* Decorative gradient */}
                <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Transition text */}
        <ScrollReveal delay={0.3} className="text-center mt-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-lg border border-gray-100">
            <span className="text-2xl">👇</span>
            <span className="text-gray-700 font-medium">
              그래서 <span className="text-blue-500 font-bold">Onno</span>를 만들었습니다
            </span>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
