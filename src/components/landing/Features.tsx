'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ui/ScrollReveal'
import { Target, Zap, FileText, Search, Users, Bell } from 'lucide-react'

const features = [
  {
    icon: Target,
    title: '실시간 결정사항 추적',
    description: '회의 중 언급된 결정사항을 AI가 자동으로 감지하고 하이라이트합니다.',
    color: 'from-blue-500 to-cyan-500',
    lightColor: 'bg-blue-50',
    preview: (
      <div className="space-y-2 p-3">
        <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg border border-blue-100">
          <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center">
            <span className="text-white text-[10px]">✓</span>
          </div>
          <span className="text-xs text-gray-700">"다음 주 월요일까지 완료"</span>
        </div>
        <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg border border-green-100">
          <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center">
            <span className="text-white text-[10px]">✓</span>
          </div>
          <span className="text-xs text-gray-700">"김팀장님이 담당"</span>
        </div>
      </div>
    ),
  },
  {
    icon: Bell,
    title: '놓친 부분 실시간 알림',
    description: '중요한 내용을 놓쳤을 때 HUD를 통해 즉시 알려드립니다.',
    color: 'from-purple-500 to-pink-500',
    lightColor: 'bg-purple-50',
    preview: (
      <div className="p-3">
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-lg"
        >
          <div className="flex items-start gap-2">
            <Bell size={14} className="text-white mt-0.5" />
            <div>
              <p className="text-xs font-medium text-white">예산 관련 결정</p>
              <p className="text-[10px] text-white/80">방금 중요한 결정이 있었어요</p>
            </div>
          </div>
        </motion.div>
      </div>
    ),
  },
  {
    icon: FileText,
    title: 'Notion 자동 저장',
    description: '회의 종료 후 결정사항과 액션 아이템이 Notion에 자동 저장됩니다.',
    color: 'from-gray-700 to-gray-900',
    lightColor: 'bg-gray-50',
    preview: (
      <div className="p-3 space-y-2">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <div className="w-4 h-4 bg-gray-800 rounded flex items-center justify-center">
            <span className="text-white text-[8px] font-bold">N</span>
          </div>
          <span>회의록 자동 생성됨</span>
        </div>
        <div className="space-y-1">
          <div className="h-2 bg-gray-200 rounded w-3/4" />
          <div className="h-2 bg-gray-200 rounded w-1/2" />
          <div className="h-2 bg-gray-200 rounded w-2/3" />
        </div>
      </div>
    ),
  },
  {
    icon: Search,
    title: '시맨틱 검색',
    description: '"지난주 예산 관련 결정" 같은 자연어로 과거 회의 내용을 검색하세요.',
    color: 'from-cyan-500 to-blue-500',
    lightColor: 'bg-cyan-50',
    preview: (
      <div className="p-3">
        <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200 shadow-sm">
          <Search size={12} className="text-gray-400" />
          <span className="text-xs text-gray-500">예산 관련 결정...</span>
        </div>
        <div className="mt-2 space-y-1">
          <div className="p-1.5 bg-blue-50 rounded text-[10px] text-blue-600">
            12/15 주간회의 - 예산 20% 증액 결정
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: Users,
    title: '팀 공유 기능',
    description: '팀원들과 회의 내용을 실시간으로 공유하고 협업하세요.',
    color: 'from-green-500 to-emerald-500',
    lightColor: 'bg-green-50',
    preview: (
      <div className="p-3">
        <div className="flex -space-x-2">
          {['bg-blue-400', 'bg-green-400', 'bg-purple-400', 'bg-pink-400'].map((color, i) => (
            <div
              key={i}
              className={`w-6 h-6 rounded-full ${color} border-2 border-white flex items-center justify-center`}
            >
              <span className="text-[8px] text-white font-medium">
                {['J', 'K', 'L', 'M'][i]}
              </span>
            </div>
          ))}
          <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
            <span className="text-[8px] text-gray-500">+3</span>
          </div>
        </div>
        <p className="text-[10px] text-gray-500 mt-2">7명이 함께 보고 있어요</p>
      </div>
    ),
  },
  {
    icon: Zap,
    title: 'Chrome 확장 프로그램',
    description: 'Google Meet, Zoom 등 화상회의 도구와 원클릭 연동됩니다.',
    color: 'from-yellow-500 to-orange-500',
    lightColor: 'bg-yellow-50',
    preview: (
      <div className="p-3 flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center shadow-lg">
          <Zap size={16} className="text-white" />
        </div>
        <div>
          <p className="text-xs font-medium text-gray-700">Onno 확장</p>
          <p className="text-[10px] text-green-500">● 연결됨</p>
        </div>
      </div>
    ),
  },
]

// 3D Tilt Card Component
function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const tiltX = (y - centerY) / 10
    const tiltY = (centerX - x) / 10
    setTilt({ x: tiltX, y: tiltY })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
    setIsHovering(false)
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: tilt.x,
        rotateY: tilt.y,
        scale: isHovering ? 1.02 : 1,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
    >
      {children}
    </motion.div>
  )
}

export function Features() {
  return (
    <section id="features" className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal className="text-center mb-16">
          <p className="text-sm font-semibold text-blue-500 mb-4 tracking-wide uppercase">
            Features
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Onno가 챙겨드립니다
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            회의에만 집중하세요. 나머지는 AI가 알아서 합니다.
          </p>
        </ScrollReveal>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.1}>
          {features.map((feature, index) => (
            <StaggerItem key={index}>
              <TiltCard className="h-full">
                <div className="relative h-full p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
                  {/* Gradient background on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                  {/* Icon */}
                  <div className={`relative inline-flex items-center justify-center w-12 h-12 rounded-xl ${feature.lightColor} mb-4`}>
                    <feature.icon className={`w-6 h-6 bg-gradient-to-r ${feature.color} bg-clip-text`} style={{ color: 'transparent', backgroundClip: 'text', WebkitBackgroundClip: 'text' }} />
                    <feature.icon className={`w-6 h-6 absolute`} style={{ background: `linear-gradient(135deg, var(--tw-gradient-stops))`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }} />
                    <div className={`w-6 h-6 bg-gradient-to-r ${feature.color} rounded`} style={{ WebkitMaskImage: `url("data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>')}")` }}>
                    </div>
                    <feature.icon className="w-6 h-6 text-gray-700" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {feature.description}
                  </p>

                  {/* Preview */}
                  <div className="mt-auto pt-4 border-t border-gray-50 -mx-2">
                    <div className="bg-gray-50 rounded-lg overflow-hidden">
                      {feature.preview}
                    </div>
                  </div>

                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </div>
                </div>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
