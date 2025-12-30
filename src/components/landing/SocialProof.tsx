'use client'

import { motion } from 'framer-motion'
import { ScrollReveal, AnimatedCounter } from '@/components/ui/ScrollReveal'
import { Star, Quote } from 'lucide-react'

// Company logos for marquee
const companies = [
  'TechCorp', 'StartupX', 'DesignCo', 'DataFlow', 'CloudNine',
  'InnovateLab', 'SmartWork', 'FutureTeam', 'AgilePro', 'SyncHub'
]

// Testimonials
const testimonials = [
  {
    content: '회의록 정리 시간이 70% 줄었어요. 이제 회의 끝나면 바로 퇴근합니다.',
    author: '김지현',
    role: 'Product Manager',
    company: 'TechCorp',
    avatar: 'K',
    avatarColor: 'bg-blue-500',
  },
  {
    content: '결정사항 놓칠까봐 항상 불안했는데, Onno 쓰고 나서는 회의에만 집중해요.',
    author: '박서준',
    role: 'Engineering Lead',
    company: 'StartupX',
    avatar: 'P',
    avatarColor: 'bg-purple-500',
  },
  {
    content: '팀원들과 정보 공유가 훨씬 수월해졌어요. 같은 내용을 다르게 기억하는 일이 없어졌습니다.',
    author: '이수아',
    role: 'Design Director',
    company: 'DesignCo',
    avatar: 'L',
    avatarColor: 'bg-pink-500',
  },
]

// Stats
const stats = [
  { value: 1247, label: '활성 사용자', suffix: '+' },
  { value: 15000, label: '분석된 회의', suffix: '+' },
  { value: 47, label: '절약된 시간', suffix: '분/회의' },
  { value: 98, label: '고객 만족도', suffix: '%' },
]

// Logo Marquee Component
function LogoMarquee() {
  return (
    <div className="relative overflow-hidden py-8">
      {/* Gradient masks */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 to-transparent z-10" />

      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {/* Double the logos for seamless loop */}
        {[...companies, ...companies].map((company, index) => (
          <div
            key={index}
            className="flex-shrink-0 h-10 px-8 bg-white rounded-lg border border-gray-200 flex items-center justify-center shadow-sm"
          >
            <span className="text-sm font-medium text-gray-400">{company}</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

// Testimonial Card
function TestimonialCard({ testimonial, index }: { testimonial: typeof testimonials[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="relative p-6 bg-white rounded-2xl shadow-lg border border-gray-100"
    >
      {/* Quote icon */}
      <Quote className="absolute top-4 right-4 w-8 h-8 text-gray-100" />

      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={14} className="text-yellow-400" fill="currentColor" />
        ))}
      </div>

      {/* Content */}
      <p className="text-gray-700 mb-6 relative z-10">
        "{testimonial.content}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full ${testimonial.avatarColor} flex items-center justify-center`}>
          <span className="text-white font-medium">{testimonial.avatar}</span>
        </div>
        <div>
          <p className="font-medium text-gray-900">{testimonial.author}</p>
          <p className="text-sm text-gray-500">{testimonial.role} @ {testimonial.company}</p>
        </div>
      </div>
    </motion.div>
  )
}

export function SocialProof() {
  return (
    <section className="py-24 bg-gray-50">
      {/* Stats Section */}
      <div className="max-w-6xl mx-auto px-6 mb-20">
        <ScrollReveal className="text-center mb-12">
          <p className="text-sm font-semibold text-blue-500 mb-4 tracking-wide uppercase">
            Trusted by Teams
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            숫자로 증명합니다
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <ScrollReveal key={index} delay={index * 0.1} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                <AnimatedCounter
                  target={stat.value}
                  duration={2}
                  suffix={stat.suffix}
                />
              </div>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Logo Marquee */}
      <div className="mb-20">
        <p className="text-center text-sm text-gray-400 mb-4">
          혁신적인 팀들이 Onno를 선택했습니다
        </p>
        <LogoMarquee />
      </div>

      {/* Testimonials */}
      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
            실제 사용자들의 이야기
          </h3>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>

      {/* Live activity indicator */}
      <ScrollReveal delay={0.3} className="mt-16 text-center">
        <div className="inline-flex items-center gap-3 px-5 py-3 bg-white rounded-full shadow-md border border-gray-100">
          <div className="relative">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping" />
          </div>
          <span className="text-sm text-gray-600">
            지난 24시간 동안 <span className="font-semibold text-gray-900">47명</span>이 가입했습니다
          </span>
          {/* Avatar stack */}
          <div className="flex -space-x-2">
            {['bg-blue-400', 'bg-green-400', 'bg-purple-400'].map((color, i) => (
              <div key={i} className={`w-6 h-6 rounded-full ${color} border-2 border-white`} />
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  )
}
