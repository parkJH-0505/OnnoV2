# Onno Figma 디자인 상세 스펙

**버전**: 2.1 (Part 6.4 접근성 - 포커스 스타일, 색상 대비, 스킵 링크 디자인 스펙)
**작성일**: 2025-12-29 (최종 업데이트: 2025-12-30)
**대상**: 디자이너, 프론트엔드 개발자
**목적**: Figma에서 바로 작업 가능한 완전한 디자인 스펙 제공
**Part 1.4 업데이트**: 확정 모달에 Notion 통합 UI 추가
**Part 1.5 업데이트**: 미팅 준비 모달 5-Layer Framework 기반 상세 스펙
**Part 2 업데이트**: Today 화면 섹션 구조 및 카드 상태 디자인 스펙 추가
**Part 3 업데이트**: HUD 자동 시작, 알림 레벨별 디자인, 응답 피드백 스펙 추가
**Part 4 업데이트**: 확정 모달 고도화, 자동 전환 애니메이션, 완료 화면 디자인 추가
**Part 5 업데이트**: 검색 진입 화면, 결과 카드, 상세 조회, 하이라이트 네비게이션 디자인 추가
**Part 5.2 업데이트**: 설정 화면, 통합 관리, 알림 설정, 프로필 편집 디자인 스펙 추가
**Part 6.1 업데이트**: 에러 모달, 배너, 토스트, 인라인, 오프라인 상태바, 권한 모달, 복구 진행 UI 추가
**Part 6.2 업데이트**: Skeleton, Spinner, Progress Bar, Steps Progress, Streaming Text, Pulse, 낙관적 UI 피드백 추가
**Part 6.3 업데이트**: 빈 상태 컨테이너, 일러스트레이션, CTA 버튼, 제안 칩, 인라인 빈 상태, 애니메이션, 반응형 레이아웃 추가
**Part 6.4 업데이트**: 포커스 링 스타일, 색상 대비 가이드, 스킵 링크, 터치 영역, 키보드 힌트, 고대비 모드 디자인 추가

---

## 📋 목차

1. [Figma 파일 구조](#1-figma-파일-구조)
2. [디자인 시스템](#2-디자인-시스템)
3. [화면 1: 지금 (Now)](#3-화면-1-지금-now)
4. [화면 2: 오늘 (Today)](#4-화면-2-오늘-today)
5. [화면 3: 검색 (Search)](#5-화면-3-검색-search)
6. [공통 컴포넌트](#6-공통-컴포넌트)
7. [애니메이션 스펙](#7-애니메이션-스펙)
8. [반응형 가이드](#8-반응형-가이드)
9. [다크모드 (향후)](#9-다크모드-향후)
10. [디자인 QA 체크리스트](#10-디자인-qa-체크리스트)

---

## 1. Figma 파일 구조

### 1.1 페이지 구성

```
Onno Design System
├─ 📄 Cover (프로젝트 소개)
├─ 🎨 Design System
│  ├─ Colors
│  ├─ Typography
│  ├─ Spacing
│  ├─ Icons
│  └─ Components
│
├─ 🖼️ Onboarding
│  ├─ Landing Page
│  ├─ Installation Modal 1 (Browser Selection)
│  ├─ Installation Modal 2 (Installing)
│  └─ Installation Modal 3 (Complete)
│
├─ 🖼️ Screens
│  ├─ 1. Now Screen
│  │  ├─ State: Idle
│  │  ├─ State: Alert Level 1
│  │  ├─ State: Alert Level 2
│  │  └─ State: Alert Level 3
│  │
│  ├─ 2. Today Screen
│  │  ├─ Morning View
│  │  ├─ Preparation Modal
│  │  └─ Confirmation Modal
│  │
│  └─ 3. Search Screen
│     ├─ Empty State
│     ├─ Search Results
│     └─ Detail View
│
├─ 🔄 Flows
│  ├─ Meeting Flow (전체 여정)
│  ├─ Onboarding Flow
│  └─ Error States
│
└─ 📱 Prototype
   └─ Interactive Prototype (클릭 가능)
```

### 1.2 Frame 크기 표준

```
브라우저 확장 (Chrome Side Panel):
├─ Width: 400px (고정)
└─ Height: 600px (최소), 스크롤 가능

HUD (Always-on-Top):
├─ Idle: 300 × 60px
├─ Alert Level 1: 300 × 120px
├─ Alert Level 2: 375 × 180px
└─ Alert Level 3: 375 × 250px

데스크톱 웹앱 (향후):
├─ Min Width: 1024px
└─ Max Width: 1440px
```

---

## 2. 디자인 시스템

### 2.1 컬러 팔레트

#### Primary Colors (3가지만)

```
🟢 초록 (Success / Active)
├─ Primary:   #10B981 (Green 500)
├─ Hover:     #059669 (Green 600)
├─ Light:     #D1FAE5 (Green 100)
└─ 용도: 청취 중, 완료 상태, 긍정 액션

🟡 노랑 (Warning)
├─ Primary:   #F59E0B (Amber 500)
├─ Hover:     #D97706 (Amber 600)
├─ Light:     #FEF3C7 (Amber 100)
└─ 용도: 경고, 주의 필요 알림

🔴 빨강 (Critical)
├─ Primary:   #EF4444 (Red 500)
├─ Hover:     #DC2626 (Red 600)
├─ Light:     #FEE2E2 (Red 100)
└─ 용도: 긴급 알림, 치명적 문제

🔵 파랑 (Info / Action)
├─ Primary:   #3B82F6 (Blue 500)
├─ Hover:     #2563EB (Blue 600)
├─ Light:     #DBEAFE (Blue 100)
└─ 용도: 정보, 링크, 주요 CTA 버튼
```

#### Neutral Colors

```
회색 (Grayscale)
├─ Gray 900:  #111827 (제목, 본문)
├─ Gray 700:  #374151 (부제목)
├─ Gray 500:  #6B7280 (보조 텍스트)
├─ Gray 300:  #D1D5DB (테두리)
├─ Gray 100:  #F3F4F6 (배경)
└─ Gray 50:   #F9FAFB (카드 배경)

White:        #FFFFFF (메인 배경)
Black:        #000000 (사용 금지, Gray 900 사용)
```

#### Semantic Colors

```
성공: #10B981 (Green 500)
에러: #EF4444 (Red 500)
경고: #F59E0B (Amber 500)
정보: #3B82F6 (Blue 500)
```

### 2.2 타이포그래피

#### 폰트 패밀리

```
Primary Font:
├─ 한글: Pretendard (https://github.com/orioncactus/pretendard)
├─ 영문: Inter (Google Fonts)
└─ 코드: Fira Code (Monospace)

폰트 로드:
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
```

#### 텍스트 스타일

```
Heading 1 (H1)
├─ Font: Pretendard Bold
├─ Size: 24px
├─ Line Height: 32px (133%)
├─ Letter Spacing: -0.02em
└─ 용도: 페이지 타이틀

Heading 2 (H2)
├─ Font: Pretendard SemiBold
├─ Size: 20px
├─ Line Height: 28px (140%)
├─ Letter Spacing: -0.01em
└─ 용도: 섹션 제목

Heading 3 (H3)
├─ Font: Pretendard SemiBold
├─ Size: 16px
├─ Line Height: 24px (150%)
├─ Letter Spacing: 0
└─ 용도: 카드 제목

Body Large
├─ Font: Pretendard Regular
├─ Size: 16px
├─ Line Height: 24px (150%)
├─ Letter Spacing: 0
└─ 용도: 중요 본문

Body Regular
├─ Font: Pretendard Regular
├─ Size: 14px
├─ Line Height: 20px (143%)
├─ Letter Spacing: 0
└─ 용도: 일반 본문 (가장 많이 사용)

Body Small
├─ Font: Pretendard Regular
├─ Size: 12px
├─ Line Height: 16px (133%)
├─ Letter Spacing: 0
└─ 용도: 캡션, 메타 정보

Caption
├─ Font: Pretendard Medium
├─ Size: 10px
├─ Line Height: 14px (140%)
├─ Letter Spacing: 0.02em
└─ 용도: 배지, 태그
```

### 2.3 간격 시스템 (4px Grid)

```
Spacing Scale (Tailwind 호환):

0:    0px
1:    4px    (0.25rem)
2:    8px    (0.5rem)
3:    12px   (0.75rem)
4:    16px   (1rem)     ← 기본 단위
5:    20px   (1.25rem)
6:    24px   (1.5rem)
8:    32px   (2rem)
10:   40px   (2.5rem)
12:   48px   (3rem)
16:   64px   (4rem)

사용 가이드:
├─ 요소 내부 padding: 4 (16px)
├─ 요소 간 gap: 3 (12px)
├─ 섹션 간 margin: 6 (24px)
└─ 화면 여백: 8 (32px)
```

### 2.4 아이콘 시스템

#### 아이콘 라이브러리

```
사용: Lucide Icons (https://lucide.dev)
이유: 깔끔, 일관성, React 컴포넌트 제공

크기:
├─ Small:  16×16px
├─ Medium: 20×20px (기본)
└─ Large:  24×24px

색상:
├─ Default: currentColor (텍스트 색상 상속)
├─ Stroke Width: 2px
└─ Corner Radius: 2px
```

#### 주요 아이콘 목록

```
Navigation:
├─ 지금: Radio (또는 Dot)
├─ 오늘: Calendar
├─ 검색: Search
└─ 설정: Settings

Actions:
├─ 추가: Plus
├─ 편집: Edit
├─ 삭제: Trash2
├─ 확인: Check
├─ 닫기: X
└─ 더보기: MoreVertical

Status:
├─ 성공: CheckCircle
├─ 경고: AlertTriangle
├─ 에러: XCircle
├─ 정보: Info
└─ 로딩: Loader (애니메이션)

Meeting:
├─ 마이크: Mic
├─ 음소거: MicOff
├─ 재생: Play
├─ 일시정지: Pause
└─ 종료: StopCircle
```

### 2.5 그림자 (Elevation)

```
Shadow 1 (Subtle):
├─ box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
└─ 용도: 카드 기본 상태

Shadow 2 (Medium):
├─ box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
│              0 2px 4px -1px rgba(0, 0, 0, 0.06)
└─ 용도: 카드 hover, 드롭다운

Shadow 3 (Large):
├─ box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
│              0 4px 6px -2px rgba(0, 0, 0, 0.05)
└─ 용도: 모달, 중요 알림

Shadow 4 (Extra Large):
├─ box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
│              0 10px 10px -5px rgba(0, 0, 0, 0.04)
└─ 용도: HUD Alert Level 3
```

### 2.6 테두리 반경 (Border Radius)

```
Radius Scale:

none:   0px
sm:     4px     (작은 요소: 태그, 배지)
md:     8px     (기본: 버튼, 입력 필드)
lg:     12px    (카드)
xl:     16px    (모달, HUD)
2xl:    24px    (큰 카드)
full:   9999px  (원형: 아바타, 상태 표시)

사용 가이드:
├─ 버튼: 8px (md)
├─ 입력 필드: 8px (md)
├─ 카드: 12px (lg)
├─ HUD: 16px (xl)
└─ 모달: 16px (xl)
```

---

## 3. 온보딩: 설치 시뮬레이션

### 3.1 랜딩 페이지

#### 레이아웃

```
┌──────────────────────────────────────────────────────┐
│  [Onno 로고]        제품   가격   고객사   로그인     │
├──────────────────────────────────────────────────────┤
│                                                       │
│         회의 중 놓치는 것들,                          │
│         이제 AI가 알아서 챙깁니다                     │
│                                                       │
│    [═══════════════] 45초 데모 영상 자동재생          │
│                                                       │
│   ┌──────────────────────────────────────┐           │
│   │  🚀 지금 바로 체험하기 (무료)        │           │
│   └──────────────────────────────────────┘           │
│                                                       │
│   "5분만에 설정 완료  •  카드등록 불필요"            │
│                                                       │
└──────────────────────────────────────────────────────┘
```

#### 상세 스펙

```
Container:
├─ Width: 1440px (max), 100vw
├─ Background: Linear Gradient
│   from: #FFFFFF
│   to: #F9FAFB
│
Hero Section:
├─ Padding: 80px 40px
├─ Text Align: center
│
Headline:
├─ Font: Pretendard Bold
├─ Size: 48px
├─ Line Height: 64px
├─ Color: #111827 (Gray 900)
├─ Margin Bottom: 32px
│
Video Container:
├─ Width: 800px
├─ Height: 450px (16:9)
├─ Border Radius: 16px
├─ Shadow: Shadow 3
├─ Autoplay: true
├─ Loop: true
│
CTA Button:
├─ Width: 400px
├─ Height: 56px
├─ Background: #3B82F6 (Blue 500)
├─ Color: #FFFFFF
├─ Font: Pretendard Bold
├─ Size: 18px
├─ Border Radius: 12px
├─ Shadow: Shadow 2
├─ Hover: scale(1.02), Shadow 3
│
Subtitle:
├─ Font: Pretendard Regular
├─ Size: 14px
├─ Color: #6B7280 (Gray 500)
├─ Margin Top: 16px
```

### 3.2 설치 모달 - 1단계 (브라우저 선택)

```
Overlay:
├─ Background: rgba(0, 0, 0, 0.6)
├─ Backdrop Filter: blur(8px)
├─ z-index: 10000
│
Modal Container:
├─ Width: 540px
├─ Background: #FFFFFF
├─ Border Radius: 16px (xl)
├─ Shadow: Shadow 4
├─ Padding: 32px
│
Progress Header:
├─ Font: Pretendard SemiBold
├─ Size: 20px
├─ Color: #111827
├─ Margin Bottom: 8px
├─ Text: "Onno 설치 (1/3단계)"
│
Description:
├─ Font: Pretendard Regular
├─ Size: 14px
├─ Color: #6B7280
├─ Margin Bottom: 24px
│
Browser Options:
├─ Display: flex
├─ Gap: 16px
├─ Justify Content: center
│
Browser Card:
├─ Width: 140px
├─ Height: 140px
├─ Border: 2px solid #E5E7EB (default)
├─ Border: 2px solid #3B82F6 (selected)
├─ Border Radius: 12px
├─ Background: #F9FAFB (default)
├─ Background: #DBEAFE (selected)
├─ Cursor: pointer
├─ Transition: all 200ms
│
Next Button:
├─ Width: 100%
├─ Height: 48px
├─ Background: #3B82F6
├─ Color: #FFFFFF
├─ Margin Top: 24px
```

### 3.3 설치 모달 - 2단계 (설치 진행)

```
Progress Bar:
├─ Width: 100%
├─ Height: 8px
├─ Background: #E5E7EB (Gray 200)
├─ Border Radius: 4px
│
Progress Fill:
├─ Height: 8px
├─ Background: #3B82F6 (Blue 500)
├─ Border Radius: 4px
├─ Animation: 0% → 100% (2.5초)
├─ Transition: linear
│
Status Items:
├─ Display: flex
├─ Flex Direction: column
├─ Gap: 12px
├─ Margin Top: 24px
│
Status Item:
├─ Display: flex
├─ Align Items: center
├─ Gap: 12px
├─ Font: Pretendard Regular
├─ Size: 14px
│
Check Icon (완료):
├─ Size: 20×20px
├─ Color: #10B981 (Green 500)
│
Arrow Icon (진행 중):
├─ Size: 20×20px
├─ Color: #3B82F6 (Blue 500)
├─ Animation: pulse
│
Tip Box:
├─ Background: #DBEAFE (Blue 100)
├─ Border: 1px solid #3B82F6
├─ Border Radius: 8px
├─ Padding: 12px
├─ Margin Top: 24px
```

### 3.4 설치 모달 - 3단계 (완료)

```
Success Icon:
├─ Size: 64×64px
├─ Color: #10B981 (Green 500)
├─ Animation: scale bounce (400ms)
├─ Margin: 0 auto 16px
│
Title:
├─ Font: Pretendard Bold
├─ Size: 24px
├─ Color: #111827
├─ Text Align: center
├─ Text: "🎉 설치 완료!"
│
Browser Visual Guide:
├─ Width: 100%
├─ Height: 120px
├─ Background: #F9FAFB
├─ Border: 1px solid #E5E7EB
├─ Border Radius: 12px
├─ Padding: 16px
├─ Margin: 24px 0
│
Start Button:
├─ Width: 100%
├─ Height: 56px
├─ Background: #3B82F6
├─ Color: #FFFFFF
├─ Font: Pretendard Bold
├─ Size: 18px
├─ Icon: Rocket (24×24px)
├─ Text: "🚀 Onno 시작하기"
│
Later Link:
├─ Font: Pretendard Medium
├─ Size: 14px
├─ Color: #6B7280
├─ Text Align: center
├─ Margin Top: 16px
├─ Text: "나중에 시작하기"
├─ Hover: underline
```

### 3.5 회원가입 모달 (Signup Modal)

```
타이밍: 저장 완료 메시지 1.5초 후 페이드인

Overlay:
├─ Background: rgba(0, 0, 0, 0.6)
├─ Backdrop Filter: blur(8px)
├─ z-index: 10000
│
Modal Container:
├─ Width: 540px
├─ Background: #FFFFFF
├─ Border Radius: 16px (xl)
├─ Shadow: Shadow 4
├─ Padding: 40px
├─ Animation: fadeIn + slideUp (0.5s)
│
Header:
├─ Icon: 🎉 (32×32px)
├─ Title: "체험이 마음에 드셨나요?"
├─ Font: Pretendard Bold
├─ Size: 24px
├─ Color: #111827
├─ Text Align: center
├─ Margin Bottom: 12px
│
Subtitle:
├─ Text: "방금 경험한 AI 어시스턴트, 실제 미팅에서도 함께하세요"
├─ Font: Pretendard Regular
├─ Size: 16px
├─ Color: #6B7280
├─ Text Align: center
├─ Margin Bottom: 24px
│
Benefits Box:
├─ Background: #F9FAFB
├─ Border: 1px solid #E5E7EB
├─ Border Radius: 12px
├─ Padding: 16px
├─ Margin Bottom: 24px
├─ Items (Gap: 8px):
│   ├─ ✅ 14일 무료 체험 (카드등록 불필요)
│   ├─ ✅ 언제든 취소 가능
│   └─ ✅ 체험 데이터 자동 이관
│
Primary CTA (Google Login):
├─ Width: 100%
├─ Height: 56px
├─ Background: #3B82F6 (Blue 500)
├─ Color: #FFFFFF
├─ Font: Pretendard Bold
├─ Size: 18px
├─ Border Radius: 12px
├─ Shadow: Shadow 2
├─ Icon: Google Logo (24×24px, left)
├─ Text: "🚀 구글 계정으로 1초 만에 시작하기"
├─ Hover: scale(1.02), Shadow 3
├─ Animation: pulse (subtle, 2s loop)
├─ Margin Bottom: 16px
│
Secondary CTAs (Row):
├─ Display: flex
├─ Gap: 12px
├─ Margin Bottom: 16px
│
GitHub Button:
├─ Width: 50%
├─ Height: 48px
├─ Background: #FFFFFF
├─ Border: 1px solid #E5E7EB
├─ Color: #111827
├─ Font: Pretendard Medium
├─ Size: 14px
├─ Border Radius: 8px
├─ Icon: GitHub Logo (20×20px)
├─ Text: "GitHub 계정"
│
Email Button:
├─ Width: 50%
├─ Height: 48px
├─ Background: #FFFFFF
├─ Border: 1px solid #E5E7EB
├─ Color: #111827
├─ Font: Pretendard Medium
├─ Size: 14px
├─ Border Radius: 8px
├─ Icon: Email Icon (20×20px)
├─ Text: "이메일로 가입"
│
Social Proof:
├─ Text: "💡 3,500명의 투자심사역이 Onno와 함께합니다"
├─ Font: Pretendard Regular
├─ Size: 14px
├─ Color: #6B7280
├─ Text Align: center
├─ Margin Bottom: 24px
│
Later Link:
├─ Font: Pretendard Medium
├─ Size: 14px
├─ Color: #6B7280
├─ Text Align: center
├─ Text: "나중에"
├─ Hover: underline
│
Trust Badges (Footer):
├─ Display: flex
├─ Gap: 16px
├─ Justify Content: center
├─ Margin Top: 24px
├─ Items:
│   ├─ 🔒 256-bit 암호화
│   ├─ ✅ ISO 27001 인증
│   └─ 🛡️ GDPR 준수
├─ Font: Pretendard Regular
├─ Size: 12px
├─ Color: #9CA3AF
```

#### 이메일 가입 폼 (Email Signup Form)

```
"이메일로 가입" 클릭 시 모달 내용 교체:

Form Container:
├─ Width: 100%
├─ Padding: 0 (모달 패딩 유지)
│
Title:
├─ Text: "📧 이메일로 시작하기"
├─ Font: Pretendard Bold
├─ Size: 20px
├─ Color: #111827
├─ Margin Bottom: 24px
│
Email Input:
├─ Width: 100%
├─ Height: 48px
├─ Border: 1px solid #E5E7EB
├─ Border Radius: 8px
├─ Padding: 12px 16px
├─ Font: Pretendard Regular
├─ Size: 14px
├─ Placeholder: "이메일 주소"
├─ Margin Bottom: 12px
│
Password Input:
├─ Width: 100%
├─ Height: 48px
├─ Border: 1px solid #E5E7EB
├─ Border Radius: 8px
├─ Padding: 12px 16px
├─ Font: Pretendard Regular
├─ Size: 14px
├─ Placeholder: "비밀번호 (8자 이상)"
├─ Type: password
├─ Margin Bottom: 16px
│
Terms Checkbox:
├─ Display: flex
├─ Align Items: center
├─ Gap: 8px
├─ Margin Bottom: 24px
├─ Checkbox: 16×16px
├─ Label: "14일 무료 체험 약관 동의 (필수)"
├─ Font: Pretendard Regular
├─ Size: 14px
├─ Link: "자세히 보기" (underline)
│
Submit Button:
├─ Width: 100%
├─ Height: 48px
├─ Background: #3B82F6
├─ Color: #FFFFFF
├─ Font: Pretendard Bold
├─ Size: 16px
├─ Border Radius: 8px
├─ Text: "가입 완료"
├─ Disabled: 약관 미동의 시 (opacity: 0.5)
│
Back Link:
├─ Text: "← 다른 방법으로 가입"
├─ Font: Pretendard Medium
├─ Size: 14px
├─ Color: #3B82F6
├─ Margin Top: 16px
├─ Cursor: pointer
```

#### "나중에" 확인 모달

```
"나중에" 클릭 시 작은 확인 모달 등장:

Confirmation Modal:
├─ Width: 400px
├─ Background: #FFFFFF
├─ Border Radius: 16px
├─ Shadow: Shadow 4
├─ Padding: 32px
│
Icon:
├─ ⚠️ (48×48px)
├─ Margin: 0 auto 16px
│
Title:
├─ Text: "잠깐만요!"
├─ Font: Pretendard Bold
├─ Size: 20px
├─ Color: #111827
├─ Text Align: center
├─ Margin Bottom: 12px
│
Warning Text:
├─ Text: "가입하지 않으면 체험 데이터가"
│         "7일 후 자동으로 삭제됩니다."
├─ Font: Pretendard Regular
├─ Size: 14px
├─ Color: #EF4444 (Red)
├─ Text Align: center
├─ Margin Bottom: 16px
│
Benefits Reminder:
├─ Text: "지금 가입하면:"
├─ Font: Pretendard SemiBold
├─ Size: 14px
├─ Margin Bottom: 8px
├─ Items:
│   ├─ ✅ 체험 데이터 영구 보관
│   └─ ✅ 14일 무료 체험 (카드 불필요)
│
Primary Button:
├─ Width: 100%
├─ Height: 48px
├─ Background: #3B82F6
├─ Text: "1초 가입하기"
├─ Margin Bottom: 12px
│
Secondary Button:
├─ Width: 100%
├─ Height: 48px
├─ Background: transparent
├─ Border: 1px solid #E5E7EB
├─ Color: #6B7280
├─ Text: "그래도 나중에"
```

---

## 4. 화면 1: 지금 (Now)

### 3.1 상태 1: Idle (대기)

#### 레이아웃

```
┌─────────────────────────────────┐
│ 🟢  23:45  [2]                  │  300 × 60px
└─────────────────────────────────┘
```

#### 상세 스펙

```
Container:
├─ Width: 300px
├─ Height: 60px
├─ Background: rgba(255, 255, 255, 0.95) (반투명 흰색)
├─ Border: 1px solid #E5E7EB (Gray 200)
├─ Border Radius: 16px (xl)
├─ Shadow: Shadow 2
└─ Backdrop Filter: blur(10px) (배경 블러)

Position:
├─ Fixed (화면에 고정)
├─ Top: 20px
├─ Right: 20px
└─ z-index: 9999

Content Layout (Flexbox):
├─ Display: flex
├─ Align Items: center
├─ Padding: 12px 16px
└─ Gap: 12px

Elements:
1. Status Indicator (🟢)
   ├─ Size: 12 × 12px
   ├─ Background: #10B981 (Green 500)
   ├─ Border Radius: full
   └─ Animation: pulse (2s infinite)

2. Time Display
   ├─ Font: Pretendard Medium
   ├─ Size: 16px
   ├─ Color: #374151 (Gray 700)
   └─ Text: "MM:SS" 형식

3. Badge (인사이트 개수)
   ├─ Background: #3B82F6 (Blue 500)
   ├─ Color: #FFFFFF
   ├─ Font: Pretendard SemiBold
   ├─ Size: 12px
   ├─ Padding: 2px 8px
   ├─ Border Radius: 12px (full)
   └─ Text: "[2]" 형식
```

#### Hover State

```
Hover Effects:
├─ Background: rgba(255, 255, 255, 1) (불투명)
├─ Shadow: Shadow 3
├─ Cursor: pointer
└─ Transition: all 200ms ease
```

### 3.2 상태 2: Alert Level 1 (정보)

#### 레이아웃

```
[클릭 시 확장]

┌─────────────────────────────────┐
│ 🟢  23:45                       │
│                                 │
│ 💡 참고 사항 (3)                 │
│                                 │
│ • 유사 딜 3건 참조 가능           │
│ • 경쟁사 B사 정보 있음            │
│ • 용어 CAC 설명 준비됨            │
│                                 │
│          [닫기]                  │
└─────────────────────────────────┘
```

#### 상세 스펙

```
Container:
├─ Width: 300px
├─ Height: auto (콘텐츠 기반)
├─ Max Height: 400px (스크롤)
├─ Background: #FFFFFF
├─ Border: 2px solid #D1D5DB (Gray 300)
├─ Border Radius: 16px (xl)
└─ Shadow: Shadow 3

Header (접을 수 있음):
├─ 🟢 + 시간 표시
├─ Padding: 16px
└─ Border Bottom: 1px solid #E5E7EB

Content:
├─ Padding: 16px
└─ Line Height: 1.5

Title:
├─ Font: Pretendard SemiBold
├─ Size: 16px
├─ Color: #111827 (Gray 900)
└─ Margin Bottom: 12px

List Items:
├─ Font: Pretendard Regular
├─ Size: 14px
├─ Color: #374151 (Gray 700)
├─ Line Height: 20px
└─ Margin: 8px 0

Footer:
├─ Padding: 12px 16px
└─ Border Top: 1px solid #E5E7EB

Close Button:
├─ Width: 100%
├─ Height: 36px
├─ Background: #F3F4F6 (Gray 100)
├─ Color: #6B7280 (Gray 500)
├─ Font: Pretendard Medium
├─ Size: 14px
├─ Border Radius: 8px (md)
└─ Hover: #E5E7EB (Gray 200)
```

### 3.3 상태 3: Alert Level 2 (주의)

#### 레이아웃

```
┌─────────────────────────────────────┐
│ ⚠️ 확인 필요                         │
│                                     │
│ 예산 승인 프로세스 미확인            │
│                                     │
│ 제안 질문:                           │
│ "승인은 누가 하시나요?"              │
│                                     │
│  [물어보기]    [나중에]              │
└─────────────────────────────────────┘
```

#### 상세 스펙

```
Container:
├─ Width: 375px (더 넓음)
├─ Height: auto
├─ Background: #FFFFFF
├─ Border: 2px solid #F59E0B (Amber 500)
├─ Border Radius: 16px (xl)
├─ Shadow: Shadow 3
└─ Position: 화면 우측 상단 (고정)

Animation (등장):
├─ From: opacity 0, translateY(-20px)
├─ To: opacity 1, translateY(0)
├─ Duration: 300ms
└─ Easing: cubic-bezier(0.4, 0, 0.2, 1)

Content Padding:
└─ 20px (all sides)

Icon + Title:
├─ Icon: ⚠️ (24×24px)
├─ Font: Pretendard SemiBold
├─ Size: 18px
├─ Color: #111827 (Gray 900)
├─ Display: flex
├─ Gap: 8px
└─ Margin Bottom: 16px

Message:
├─ Font: Pretendard Regular
├─ Size: 14px
├─ Color: #374151 (Gray 700)
├─ Line Height: 20px
└─ Margin Bottom: 16px

Suggested Question Box:
├─ Background: #DBEAFE (Blue 100)
├─ Border: 1px solid #3B82F6 (Blue 500)
├─ Border Radius: 8px (md)
├─ Padding: 12px
└─ Margin Bottom: 16px

Question Label:
├─ Font: Pretendard Medium
├─ Size: 12px
├─ Color: #6B7280 (Gray 500)
└─ Margin Bottom: 4px

Question Text:
├─ Font: Pretendard SemiBold
├─ Size: 14px
├─ Color: #1F2937 (Gray 800)
└─ Quotes: "..."

Action Buttons (Flexbox):
├─ Display: flex
├─ Gap: 8px
└─ Width: 100%

Primary Button (물어보기):
├─ Flex: 1
├─ Height: 40px
├─ Background: #3B82F6 (Blue 500)
├─ Color: #FFFFFF
├─ Font: Pretendard SemiBold
├─ Size: 14px
├─ Border Radius: 8px (md)
├─ Hover: #2563EB (Blue 600)
└─ Transition: 200ms

Secondary Button (나중에):
├─ Width: auto
├─ Padding: 0 16px
├─ Height: 40px
├─ Background: transparent
├─ Color: #6B7280 (Gray 500)
├─ Font: Pretendard Medium
├─ Size: 14px
├─ Border Radius: 8px (md)
├─ Hover: #F3F4F6 (Gray 100)
└─ Transition: 200ms
```

### 3.4 상태 4: Alert Level 3 (긴급)

#### 레이아웃

```
┌─────────────────────────────────────┐
│ 🚨 치명적 누락                       │
│                                     │
│ 계약 해지 조건 논의 안 됨            │
│                                     │
│ 왜 위험?                             │
│ • 법적 분쟁 가능성                   │
│ • 과거 2건 유사 사례                 │
│                                     │
│  [지금 확인 →]    [위험 감수]        │
└─────────────────────────────────────┘
```

#### 상세 스펙

```
Container:
├─ Width: 375px
├─ Height: auto
├─ Background: #FFFFFF
├─ Border: 3px solid #EF4444 (Red 500) ← 더 두꺼움
├─ Border Radius: 16px (xl)
├─ Shadow: Shadow 4 (더 강함)
└─ Position: 화면 중앙 (중요!)

Animation (등장):
├─ From: opacity 0, scale(0.95)
├─ To: opacity 1, scale(1)
├─ Duration: 400ms
├─ Easing: cubic-bezier(0.34, 1.56, 0.64, 1) (bounce)
└─ + Sound: "띵!" (1회)

Border Animation (펄스):
├─ Keyframes: box-shadow 변화
├─ From: 0 0 0 0 rgba(239, 68, 68, 0)
├─ To: 0 0 0 8px rgba(239, 68, 68, 0)
├─ Duration: 2s
└─ Iteration: infinite

Icon + Title:
├─ Icon: 🚨 (28×28px) ← 더 큼
├─ Font: Pretendard Bold ← 더 굵음
├─ Size: 20px ← 더 큼
├─ Color: #DC2626 (Red 600)
└─ Margin Bottom: 16px

Message:
├─ Font: Pretendard SemiBold
├─ Size: 16px ← 더 큼
├─ Color: #111827 (Gray 900)
└─ Margin Bottom: 16px

Reason Section:
├─ Label: "왜 위험?"
├─ Font: Pretendard SemiBold
├─ Size: 14px
├─ Color: #6B7280 (Gray 500)
└─ Margin Bottom: 8px

Reason List:
├─ Background: #FEE2E2 (Red 100)
├─ Border Radius: 8px (md)
├─ Padding: 12px
└─ Margin Bottom: 16px

List Item:
├─ Font: Pretendard Regular
├─ Size: 14px
├─ Color: #7F1D1D (Red 900)
├─ Line Height: 20px
└─ Prefix: "•" (bullet)

Primary Button (지금 확인):
├─ Background: #EF4444 (Red 500)
├─ Color: #FFFFFF
├─ Icon: ArrowRight (16×16px)
└─ Hover: #DC2626 (Red 600)

Secondary Button (위험 감수):
├─ Color: #EF4444 (Red 500)
├─ Font: Pretendard Medium
└─ Hover: #FEE2E2 (Red 100)
```

### 3.5 HUD 고도화 디자인 (Part 3)

#### 3.5.1 자동 시작 시퀀스

```
HUD 등장 애니메이션 (Part 3.1):

초기 상태:
├─ Opacity: 0
├─ Scale: 0.9
└─ Position: 우측 상단 + 10px offset

등장 애니메이션:
├─ Duration: 300ms
├─ Easing: cubic-bezier(0.4, 0, 0.2, 1)
├─ Opacity: 0 → 1
├─ Scale: 0.9 → 1
├─ translateY: -10px → 0
└─ + 녹음 시작 인디케이터 pulse

녹음 시작 표시:
┌─────────────────────────────────┐
│ 🟢  00:00  ●REC                 │
└─────────────────────────────────┘
        ↑
        └─ REC 표시 3초 후 fade-out

REC 인디케이터:
├─ Background: #EF4444 (Red 500)
├─ Color: #FFFFFF
├─ Font: Pretendard Bold, 10px
├─ Padding: 2px 6px
├─ Border Radius: 4px
├─ Animation: blink 1s infinite
└─ Duration: 3초 표시 후 fade-out
```

#### 3.5.2 새 미팅 프롬프트 (캘린더 미매칭)

```
┌─────────────────────────────────────┐
│ 🟢  00:05                           │
├─────────────────────────────────────┤
│                                     │
│ 새 미팅이 감지되었어요               │
│                                     │
│ 회사명: [                         ] │ ← 자동 포커스
│                                     │
│ 최근: A사, B사, C사                  │ ← 빠른 선택 칩
│                                     │
│ [ 시작하기 ]        5초 후 자동 시작 │
│                                     │
└─────────────────────────────────────┘

Container:
├─ Width: 320px
├─ Height: auto
├─ Background: #FFFFFF
├─ Border: 1px solid #E5E7EB
├─ Border Radius: 16px
├─ Shadow: Shadow 3
└─ Animation: slide-down 300ms

Input Field:
├─ Height: 40px
├─ Background: #F9FAFB
├─ Border: 1px solid #D1D5DB
├─ Border Radius: 8px
├─ Font: Pretendard Regular, 14px
├─ Padding: 0 12px
├─ Focus Border: #3B82F6
└─ Placeholder: "회사명 입력..."

Quick Select Chips:
├─ Display: flex
├─ Gap: 8px
├─ Margin Top: 12px
└─ Chip Style:
    ├─ Background: #E5E7EB
    ├─ Color: #374151
    ├─ Font: Pretendard Medium, 12px
    ├─ Padding: 6px 12px
    ├─ Border Radius: 16px
    └─ Hover: Background #D1D5DB

Countdown Text:
├─ Font: Pretendard Regular, 12px
├─ Color: #9CA3AF
└─ Animation: countdown (숫자만 변경)
```

#### 3.5.3 HUD Idle 확장 상태

```
수동 확장 시 (클릭):
┌─────────────────────────────────────┐
│ 🟢  23:45                    [−]    │ ← 닫기 버튼
├─────────────────────────────────────┤
│                                     │
│ 📊 수집된 정보                       │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ MAU         10만        10:05  │ │ ← 인사이트 행
│ ├─────────────────────────────────┤ │
│ │ MRR         $50K        10:12  │ │
│ ├─────────────────────────────────┤ │
│ │ Churn       2.5%        10:18  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ 💡 참고 사항 (2)              ▶      │ ← 접힌 상태
│                                     │
└─────────────────────────────────────┘

Expanded Container:
├─ Width: 320px
├─ Max Height: 400px (스크롤)
├─ Background: #FFFFFF
├─ Border: 1px solid #E5E7EB
├─ Border Radius: 16px
├─ Shadow: Shadow 3
├─ Transition: height 300ms ease
└─ Overflow: hidden → auto (확장 시)

Insight Row:
├─ Display: grid
├─ Grid: "label value time" / 1fr 1fr auto
├─ Padding: 10px 12px
├─ Border Bottom: 1px solid #F3F4F6
├─ Hover: Background #F9FAFB
└─ Cursor: pointer

Insight Label:
├─ Font: Pretendard Medium, 13px
└─ Color: #6B7280

Insight Value:
├─ Font: Pretendard SemiBold, 14px
├─ Color: #111827
└─ Text Align: right

Insight Time:
├─ Font: Pretendard Regular, 11px
├─ Color: #9CA3AF
└─ Margin Left: 8px

Collapsible Section:
├─ Cursor: pointer
├─ Hover: Background #F9FAFB
├─ Transition: all 200ms
└─ Chevron Rotate: 0deg → 90deg (확장 시)
```

#### 3.5.4 투명도 자동 조절

```
투명도 상태 머신:

기본 상태 (80%):
├─ Background: rgba(255, 255, 255, 0.80)
├─ Backdrop Filter: blur(10px)
└─ 적용: 미팅 시작 후 기본

Hover 상태 (100%):
├─ Background: rgba(255, 255, 255, 1.0)
├─ Transition: 150ms ease
└─ 적용: 마우스 오버 시

비활성 상태 (60%):
├─ Background: rgba(255, 255, 255, 0.60)
├─ Transition: 2000ms ease
└─ 적용: 5분 이상 상호작용 없음

CSS:
.hud-container {
  background: rgba(255, 255, 255, 0.80);
  backdrop-filter: blur(10px);
  transition: background 150ms ease, opacity 150ms ease;
}

.hud-container:hover {
  background: rgba(255, 255, 255, 1.0);
}

.hud-container.inactive {
  background: rgba(255, 255, 255, 0.60);
  transition: background 2000ms ease;
}
```

#### 3.5.5 알림 타이밍 인디케이터

```
알림 대기 중 표시 (내부용):

Level 2 알림 등장 직전:
┌─────────────────────────────────┐
│ 🟢  23:45  [2]                  │
│ ⏳                              │ ← 미세한 로딩 인디케이터
└─────────────────────────────────┘

Pending Indicator:
├─ Icon: ⏳ (Hourglass)
├─ Size: 12×12px
├─ Position: absolute, bottom: 4px, right: 4px
├─ Opacity: 0.5
├─ Animation: pulse 1s infinite
└─ Duration: 최대 2초 (타이밍 대기)

목적: "알림이 곧 올 수 있음" 시각적 힌트
```

#### 3.5.6 질문 수행 피드백

```
[물어보기] 클릭 후:
┌─────────────────────────────────────┐
│ 💬 질문 중...                       │
├─────────────────────────────────────┤
│                                     │
│ "승인은 누가 하시나요?"              │ ← 제안 질문
│                                     │
│ [복사됨 ✓]                          │ ← 클립보드 복사 확인
│                                     │
└─────────────────────────────────────┘

(3초 후 Idle 복귀)

(답변 감지 시)
┌─────────────────────────────────────┐
│ ✓ 답변 수집됨                        │ ← 토스트
│                                     │
│ "법무팀 최종 승인"                   │ ← 요약된 답변
└─────────────────────────────────────┘

Question Prompt Container:
├─ Width: 320px
├─ Background: #EFF6FF (Blue 50)
├─ Border: 2px solid #3B82F6 (Blue 500)
├─ Border Radius: 16px
├─ Padding: 16px
└─ Animation: fade-in 200ms

Question Text:
├─ Font: Pretendard SemiBold, 15px
├─ Color: #1E40AF (Blue 800)
├─ Text Align: center
└─ Quotes Style: italic

Copied Badge:
├─ Background: #10B981 (Green 500)
├─ Color: #FFFFFF
├─ Font: Pretendard Medium, 12px
├─ Padding: 4px 12px
├─ Border Radius: 16px
├─ Icon: Check (왼쪽)
└─ Animation: bounce-in 300ms

Answer Toast:
├─ Position: fixed, bottom: 20px, right: 20px
├─ Width: 280px
├─ Background: #ECFDF5 (Green 50)
├─ Border: 1px solid #10B981 (Green 500)
├─ Border Radius: 12px
├─ Padding: 12px 16px
├─ Shadow: Shadow 2
├─ Animation: slide-up 300ms, fade-out 300ms (2초 후)
└─ Auto Dismiss: 2초

Answer Text:
├─ Font: Pretendard Medium, 13px
├─ Color: #065F46 (Green 800)
└─ Max Lines: 2 (ellipsis)
```

#### 3.5.7 위험 감수 확인 다이얼로그

```
[위험 감수] 클릭 시:
┌─────────────────────────────────────┐
│                                     │
│ ⚠️ 정말 진행하시겠어요?              │
│                                     │
│ 이 결정이 문제를 일으킬 수 있어요:   │
│ • 계약 조건 미확인                  │
│ • 법적 분쟁 가능성                  │
│                                     │
│ 사유 (선택):                        │
│ [                               ]   │
│                                     │
│ [돌아가기]        [위험 감수 확인]   │
│                                     │
└─────────────────────────────────────┘

Confirmation Dialog:
├─ Width: 360px
├─ Background: #FEF2F2 (Red 50)
├─ Border: 2px solid #EF4444 (Red 500)
├─ Border Radius: 16px
├─ Padding: 24px
├─ Shadow: Shadow 4
├─ Backdrop: rgba(0, 0, 0, 0.3)
└─ Animation: scale-in 200ms

Warning Icon:
├─ Size: 32×32px
├─ Color: #EF4444 (Red 500)
└─ Margin Bottom: 16px

Risk List:
├─ Font: Pretendard Regular, 13px
├─ Color: #991B1B (Red 800)
├─ Line Height: 20px
├─ List Style: disc
└─ Padding Left: 16px

Reason Input:
├─ Width: 100%
├─ Height: 40px
├─ Background: #FFFFFF
├─ Border: 1px solid #FCA5A5 (Red 300)
├─ Border Radius: 8px
├─ Font: Pretendard Regular, 14px
├─ Placeholder: "사유 입력 (선택사항)"
└─ Focus Border: #EF4444

Back Button:
├─ Background: transparent
├─ Color: #6B7280
├─ Border: 1px solid #D1D5DB
├─ Hover: Background #F9FAFB
└─ Font: Pretendard Medium, 14px

Confirm Button:
├─ Background: #EF4444 (Red 500)
├─ Color: #FFFFFF
├─ Hover: Background #DC2626 (Red 600)
└─ Font: Pretendard SemiBold, 14px
```

#### 3.5.8 연기 항목 배지

```
[나중에] 클릭 or 타임아웃 후:

Idle 상태 배지 업데이트:
┌─────────────────────────────────┐
│ 🟢  24:15  [3]                  │ ← 숫자 +1
└─────────────────────────────────┘

Level 3 연기 시 특수 배지:
┌─────────────────────────────────┐
│ 🟢  24:15  [2][!]               │ ← 경고 배지 추가
└─────────────────────────────────┘

Warning Badge:
├─ Background: #FEE2E2 (Red 100)
├─ Color: #991B1B (Red 800)
├─ Font: Pretendard Bold, 10px
├─ Text: "!"
├─ Width: 16px, Height: 16px
├─ Border Radius: 50%
├─ Border: 1px solid #EF4444
├─ Animation: pulse 2s infinite
└─ Tooltip: "위험 감수 항목 있음"

Badge Update Animation:
├─ Scale: 1 → 1.2 → 1
├─ Duration: 300ms
└─ Easing: ease-out
```

---

## 4. 화면 2: 오늘 (Today)

### 4.1 메인 뷰 (아침)

#### 전체 레이아웃

```
┌──────────────────────────────────────┐
│  좋은 아침이에요, 민수님 👋           │  ← Header
│  2025년 12월 29일 일요일             │
├──────────────────────────────────────┤
│                                      │
│  🔴 지금 바로 처리 (2)                │  ← Section 1
│  ───────────────────────────         │
│  [Card 1]                            │
│  [Card 2]                            │
│                                      │
│  📅 오늘 미팅 (3)                     │  ← Section 2
│  ───────────────────────────         │
│  [Card 1]                            │
│  [Card 2]                            │
│  [Card 3]                            │
│                                      │
│  ⏰ 나중에 (4) [펼치기 ▼]             │  ← Section 3 (접힘)
│                                      │
└──────────────────────────────────────┘
```

#### 상세 스펙

```
Container:
├─ Width: 400px (Side Panel)
├─ Height: 100vh (전체 높이)
├─ Background: #F9FAFB (Gray 50)
├─ Overflow: auto (스크롤)
└─ Padding: 24px 20px

Header Section:
├─ Margin Bottom: 24px
└─ Padding Bottom: 16px
    Border Bottom: 1px solid #E5E7EB

Greeting:
├─ Font: Pretendard Bold
├─ Size: 24px
├─ Color: #111827 (Gray 900)
├─ Line Height: 32px
└─ Margin Bottom: 4px

시간대별 인사:
├─ 05:00-11:59: "좋은 아침이에요"
├─ 12:00-17:59: "좋은 오후예요"
└─ 18:00-04:59: "좋은 저녁이에요"

Date:
├─ Font: Pretendard Regular
├─ Size: 14px
├─ Color: #6B7280 (Gray 500)
└─ Format: "YYYY년 MM월 DD일 요일"

Section Header:
├─ Display: flex
├─ Align Items: center
├─ Gap: 8px
├─ Margin: 24px 0 12px 0

Section Icon + Title:
├─ Icon: 20×20px
├─ Font: Pretendard SemiBold
├─ Size: 16px
├─ Color: #111827 (Gray 900)

Section Count Badge:
├─ Background: #E5E7EB (Gray 200)
├─ Color: #374151 (Gray 700)
├─ Font: Pretendard SemiBold
├─ Size: 12px
├─ Padding: 2px 8px
├─ Border Radius: 12px (full)
```

### 4.2 카드 컴포넌트 (미팅 카드)

#### 레이아웃

```
┌────────────────────────────────┐
│ 10:00 A사 2차 투자 검토         │  ← Title
│                                │
│ 💡 준비 필요:                   │  ← Badge
│ • 지난번 미확인: CAC, LTV       │  ← List
│ • 꼭 물어볼 질문 2개 준비됨     │
│                                │
│ 예상 준비 시간: 2분             │  ← Meta
│                                │
│  [준비하기]    [바로 시작]      │  ← Actions
└────────────────────────────────┘
```

#### 상세 스펙

```
Container:
├─ Background: #FFFFFF
├─ Border: 1px solid #E5E7EB (Gray 200)
├─ Border Radius: 12px (lg)
├─ Padding: 16px
├─ Margin Bottom: 12px
├─ Shadow: Shadow 1
└─ Hover: Shadow 2 + Border #3B82F6

Card Title:
├─ Font: Pretendard SemiBold
├─ Size: 16px
├─ Color: #111827 (Gray 900)
├─ Line Height: 24px
└─ Margin Bottom: 12px

Time Prefix:
├─ Font: Pretendard Medium
├─ Color: #3B82F6 (Blue 500)
└─ Format: "HH:MM"

Badge (💡 준비 필요):
├─ Background: #DBEAFE (Blue 100)
├─ Color: #1E40AF (Blue 800)
├─ Font: Pretendard Medium
├─ Size: 12px
├─ Padding: 4px 8px
├─ Border Radius: 6px
├─ Display: inline-flex
├─ Gap: 4px
└─ Margin Bottom: 8px

List Items:
├─ Font: Pretendard Regular
├─ Size: 14px
├─ Color: #374151 (Gray 700)
├─ Line Height: 20px
├─ Padding Left: 16px
└─ List Style: disc

Meta (예상 시간):
├─ Font: Pretendard Regular
├─ Size: 12px
├─ Color: #6B7280 (Gray 500)
├─ Margin: 12px 0
└─ Display: flex + gap

Action Buttons:
├─ Display: flex
├─ Gap: 8px
└─ Margin Top: 12px

Primary Button (준비하기):
├─ Flex: 1
├─ Height: 36px
├─ Background: #3B82F6 (Blue 500)
├─ Color: #FFFFFF
├─ Font: Pretendard SemiBold
├─ Size: 14px
├─ Border Radius: 8px (md)
└─ Hover: #2563EB (Blue 600)

Secondary Button (바로 시작):
├─ Padding: 0 12px
├─ Height: 36px
├─ Background: transparent
├─ Color: #6B7280 (Gray 500)
├─ Font: Pretendard Medium
├─ Size: 14px
├─ Border: 1px solid #D1D5DB (Gray 300)
├─ Border Radius: 8px (md)
└─ Hover: #F3F4F6 (Gray 100)
```

### 4.3 확정 모달 (회의 후)

#### 레이아웃

```
┌────────────────────────────────┐
│ 📝 방금 회의 정리 (5분)         │  ← Header
├────────────────────────────────┤
│                                │
│ ✅ 결정 사항 (1):               │
│ ┌──────────────────────────┐  │
│ │ DD 진행 합의              │  │
│ │ 시작일: 2025-01-06        │  │
│ │ 담당: 김대표 (A사)        │  │
│ └──────────────────────────┘  │
│                                │
│ ⚠️ 빈칸 채우기 (2):              │
│ ┌──────────────────────────┐  │
│ │ 액션: 재무 자료 제출      │  │
│ │ 담당: [____] ← 입력       │  │
│ │ 기한: [____] ← 날짜       │  │
│ └──────────────────────────┘  │
│                                │
│ 📋 인사이트 (5개 추출됨):       │
│ ✓ MAU 10만, 월 성장률 15%       │
│ ✓ 유료 전환율 8%                │
│ ... [더 보기]                   │
│                                │
│ [확정 완료 →]                   │
│ 예상 시간: 2분 남음             │
│                                │
└────────────────────────────────┘
```

#### 상세 스펙

```
Modal Overlay:
├─ Background: rgba(0, 0, 0, 0.5) (반투명 검정)
├─ Position: fixed
├─ Top: 0, Left: 0
├─ Width: 100vw
├─ Height: 100vh
├─ Display: flex
├─ Justify Content: center
├─ Align Items: center
└─ z-index: 10000

Modal Container:
├─ Width: 480px
├─ Max Height: 80vh
├─ Background: #FFFFFF
├─ Border Radius: 16px (xl)
├─ Shadow: Shadow 4
├─ Overflow: auto
└─ Animation: scale(0.95 → 1), opacity(0 → 1)

Modal Header:
├─ Background: #F9FAFB (Gray 50)
├─ Padding: 20px
├─ Border Bottom: 1px solid #E5E7EB
└─ Sticky Top: 0

Header Title:
├─ Font: Pretendard Bold
├─ Size: 20px
├─ Color: #111827 (Gray 900)
└─ Display: flex + gap

Time Badge:
├─ Background: #FEF3C7 (Amber 100)
├─ Color: #92400E (Amber 800)
├─ Font: Pretendard SemiBold
├─ Size: 12px
├─ Padding: 4px 8px
├─ Border Radius: 6px
└─ Text: "(5분)"

Modal Body:
├─ Padding: 20px
└─ Max Height: calc(80vh - 160px)

Section (결정/액션/인사이트):
├─ Margin Bottom: 24px
└─ Last Child: Margin Bottom 0

Section Header:
├─ Font: Pretendard SemiBold
├─ Size: 14px
├─ Color: #6B7280 (Gray 500)
├─ Margin Bottom: 12px
└─ Display: flex + gap

Subsection Card:
├─ Background: #F9FAFB (Gray 50)
├─ Border: 1px solid #E5E7EB (Gray 200)
├─ Border Radius: 8px (md)
├─ Padding: 12px
└─ Margin Bottom: 8px

Input Field (빈칸):
├─ Width: 100%
├─ Height: 36px
├─ Background: #FFFFFF
├─ Border: 1px solid #D1D5DB (Gray 300)
├─ Border Radius: 6px
├─ Padding: 0 12px
├─ Font: Pretendard Regular
├─ Size: 14px
├─ Placeholder Color: #9CA3AF (Gray 400)
└─ Focus: Border #3B82F6 (Blue 500)

Modal Footer:
├─ Padding: 16px 20px
├─ Border Top: 1px solid #E5E7EB
├─ Sticky Bottom: 0
└─ Background: #FFFFFF

Confirm Button:
├─ Width: 100%
├─ Height: 44px
├─ Background: #3B82F6 (Blue 500)
├─ Color: #FFFFFF
├─ Font: Pretendard Bold
├─ Size: 16px
├─ Border Radius: 8px (md)
├─ Icon: ArrowRight (20×20px)
└─ Hover: #2563EB (Blue 600)

Time Remaining:
├─ Font: Pretendard Regular
├─ Size: 12px
├─ Color: #6B7280 (Gray 500)
├─ Text Align: center
└─ Margin Top: 8px
```

### 4.4 확정 모달 - Notion 통합 섹션 (Part 1.4)

#### 레이아웃

```
[확정 모달 하단에 추가되는 섹션]

│ ────────────────────────────────  │
│                                   │
│ 💾 저장 옵션                        │
│                                   │
│ ┌─────────────────────────────┐  │
│ │ ☑ Notion에 저장하기          │  │
│ │                              │  │
│ │ [미연결 상태]                 │  │
│ │ [🔗 Notion 연결하기]         │  │
│ │ "30초면 연결 완료!"           │  │
│ │                              │  │
│ │ [연결됨 상태]                 │  │
│ │ ✅ Notion 연결됨              │  │
│ │ (민수의 워크스페이스)         │  │
│ │ 저장 위치: Onno 회의록        │  │
│ └─────────────────────────────┘  │
│                                   │
```

#### 상세 스펙

```
Save Options Section:
├─ Border Top: 1px solid #E5E7EB (Gray 200)
├─ Padding Top: 20px
├─ Margin Top: 20px
└─ Margin Bottom: 20px

Section Title:
├─ Font: Pretendard SemiBold
├─ Size: 14px
├─ Color: #374151 (Gray 700)
├─ Display: flex
├─ Gap: 8px
├─ Margin Bottom: 12px
└─ Icon: 💾 (16×16px)

Notion Option Container:
├─ Background: #F9FAFB (Gray 50)
├─ Border: 1px solid #E5E7EB (Gray 200)
├─ Border Radius: 12px (lg)
├─ Padding: 16px
└─ Transition: border-color 200ms

Notion Option Container (Checked):
├─ Border: 2px solid #3B82F6 (Blue 500)
└─ Background: #EFF6FF (Blue 50)

Checkbox Row:
├─ Display: flex
├─ Align Items: center
├─ Gap: 12px
└─ Margin Bottom: 12px

Checkbox:
├─ Width: 20px
├─ Height: 20px
├─ Border: 2px solid #D1D5DB (Gray 300)
├─ Border Radius: 4px
├─ Background: #FFFFFF
├─ Cursor: pointer
└─ Transition: 150ms

Checkbox (Checked):
├─ Background: #3B82F6 (Blue 500)
├─ Border: 2px solid #3B82F6 (Blue 500)
└─ Icon: Check (white, 14×14px)

Checkbox Label:
├─ Font: Pretendard SemiBold
├─ Size: 16px
├─ Color: #111827 (Gray 900)
└─ Cursor: pointer
```

#### 미연결 상태

```
Disconnected State Container:
├─ Margin Top: 12px
├─ Padding Left: 32px (checkbox align)
└─ Display: flex
    Flex Direction: column
    Gap: 8px

Connect Button:
├─ Width: 100%
├─ Height: 44px
├─ Background: #3B82F6 (Blue 500)
├─ Color: #FFFFFF
├─ Font: Pretendard SemiBold
├─ Size: 14px
├─ Border Radius: 8px (md)
├─ Border: none
├─ Display: flex
├─ Align Items: center
├─ Justify Content: center
├─ Gap: 8px
├─ Cursor: pointer
├─ Transition: 200ms
├─ Icon: Link (🔗) (20×20px)
├─ Text: "Notion 연결하기"
└─ Hover: #2563EB (Blue 600), Shadow 2

Microcopy:
├─ Font: Pretendard Regular
├─ Size: 13px
├─ Color: #6B7280 (Gray 500)
├─ Text Align: center
└─ Text: "30초면 연결 완료!"
```

#### 연결됨 상태

```
Connected State Container:
├─ Margin Top: 12px
├─ Padding Left: 32px (checkbox align)
└─ Display: flex
    Flex Direction: column
    Gap: 8px

Connected Badge:
├─ Display: inline-flex
├─ Align Items: center
├─ Gap: 8px

Connected Icon:
├─ Size: 20×20px
├─ Color: #10B981 (Green 500)
└─ Icon: CheckCircle

Connected Text:
├─ Font: Pretendard SemiBold
├─ Size: 14px
└─ Color: #10B981 (Green 500)

Workspace Name:
├─ Font: Pretendard Regular
├─ Size: 14px
├─ Color: #374151 (Gray 700)
├─ Background: #F3F4F6 (Gray 100)
├─ Padding: 4px 8px
├─ Border Radius: 4px
└─ Display: inline-block

Save Location:
├─ Font: Pretendard Regular
├─ Size: 13px
├─ Color: #6B7280 (Gray 500)
└─ Margin Top: 4px

Disconnect Link:
├─ Font: Pretendard Medium
├─ Size: 12px
├─ Color: #9CA3AF (Gray 400)
├─ Cursor: pointer
├─ Hover: Color #6B7280 (Gray 500), underline
└─ Text: "연결 해제"
```

#### OAuth 팝업 로딩 상태

```
Loading Overlay (체크박스 선택 + 연결 클릭 후):
├─ Position: absolute
├─ Top: 0
├─ Left: 0
├─ Width: 100%
├─ Height: 100%
├─ Background: rgba(255, 255, 255, 0.9)
├─ Border Radius: 12px
├─ Display: flex
├─ Flex Direction: column
├─ Align Items: center
├─ Justify Content: center
├─ Gap: 12px
└─ z-index: 10

Spinner:
├─ Size: 32×32px
├─ Color: #3B82F6 (Blue 500)
└─ Animation: rotate 1s linear infinite

Loading Text:
├─ Font: Pretendard Medium
├─ Size: 14px
├─ Color: #374151 (Gray 700)
└─ Text: "Notion 연결 중..."
```

#### 저장 완료 상태 (Notion 저장 성공)

```
Success Message (Toast 또는 인라인):
├─ Background: #D1FAE5 (Green 100)
├─ Border: 1px solid #10B981 (Green 500)
├─ Border Radius: 8px
├─ Padding: 12px 16px
├─ Display: flex
├─ Align Items: center
├─ Gap: 12px
├─ Margin Top: 12px
└─ Animation: fadeIn 300ms

Success Icon:
├─ Size: 20×20px
├─ Color: #10B981 (Green 500)
└─ Icon: CheckCircle

Success Text:
├─ Font: Pretendard Medium
├─ Size: 14px
└─ Color: #065F46 (Green 800)

View in Notion Link:
├─ Font: Pretendard SemiBold
├─ Size: 14px
├─ Color: #3B82F6 (Blue 500)
├─ Display: inline-flex
├─ Align Items: center
├─ Gap: 4px
├─ Icon: ExternalLink (16×16px)
├─ Text: "Notion에서 보기"
├─ Cursor: pointer
└─ Hover: underline
```

#### 에러 상태

```
Error Message:
├─ Background: #FEE2E2 (Red 100)
├─ Border: 1px solid #EF4444 (Red 500)
├─ Border Radius: 8px
├─ Padding: 12px 16px
├─ Display: flex
├─ Align Items: center
├─ Gap: 12px
├─ Margin Top: 12px
└─ Animation: shake 300ms

Error Icon:
├─ Size: 20×20px
├─ Color: #EF4444 (Red 500)
└─ Icon: AlertCircle

Error Text:
├─ Font: Pretendard Medium
├─ Size: 14px
└─ Color: #991B1B (Red 800)

Retry Button:
├─ Font: Pretendard SemiBold
├─ Size: 14px
├─ Color: #EF4444 (Red 500)
├─ Background: transparent
├─ Border: 1px solid #EF4444 (Red 500)
├─ Border Radius: 6px
├─ Padding: 6px 12px
├─ Cursor: pointer
├─ Hover: Background #FEE2E2 (Red 100)
└─ Text: "다시 시도"
```

### 4.5 준비 모달 (Part 1.5: 5-Layer Framework)

#### 전체 레이아웃

```
┌────────────────────────────────┐
│ 📋 A사 2차 미팅 준비 (10:00)    │  ← Header
├────────────────────────────────┤
│                                │
│ 📜 지난 미팅 요약                │  ← Section 1 (접힘 가능)
│ ┌──────────────────────────┐  │
│ │ 1차 미팅 (12/22)         │  │
│ │ • MAU 10만, 성장률 15%   │  │
│ │ • 시리즈A 50억 희망       │  │
│ │          [펼치기 ▼]      │  │
│ └──────────────────────────┘  │
│                                │
│ ⚠️ 미확인 사항 (2)              │  ← Section 2
│ ┌──────────────────────────┐  │
│ │ ⬜ CAC (고객획득비용)      │  │
│ │ ⬜ LTV (고객생애가치)      │  │
│ └──────────────────────────┘  │
│                                │
│ 💡 AI 추천 질문                 │  ← Section 3
│ ┌──────────────────────────┐  │
│ │ ☑ "CAC는 채널별로 어떻게  │  │
│ │    다른가요?"            │  │
│ │ ☑ "LTV 계산 방식이        │  │
│ │    어떻게 되나요?"        │  │
│ │ + 질문 추가              │  │
│ └──────────────────────────┘  │
│                                │
│  [준비 완료 →]    [나중에]     │  ← Actions
│                                │
│ 예상 준비 시간: 2분             │  ← Meta
└────────────────────────────────┘
```

#### 상세 스펙

```
Modal Overlay:
├─ Background: rgba(0, 0, 0, 0.5)
├─ Position: fixed
├─ Top: 0, Left: 0
├─ Width: 100vw, Height: 100vh
├─ Display: flex
├─ Justify Content: center
├─ Align Items: center
├─ Backdrop Filter: blur(4px)
└─ z-index: 10000

Modal Container:
├─ Width: 420px
├─ Max Height: 85vh
├─ Background: #FFFFFF
├─ Border Radius: 16px (xl)
├─ Shadow: Shadow 4
├─ Overflow: hidden
└─ Animation: scale(0.95 → 1), opacity(0 → 1), 300ms

Modal Header:
├─ Background: #3B82F6 (Blue 500)
├─ Padding: 20px
├─ Color: #FFFFFF
├─ Sticky Top: 0
└─ z-index: 10

Header Title:
├─ Font: Pretendard Bold
├─ Size: 18px
├─ Color: #FFFFFF
├─ Display: flex
├─ Gap: 8px
└─ Icon: 📋 (20×20px)

Meeting Time Badge:
├─ Background: rgba(255, 255, 255, 0.2)
├─ Color: #FFFFFF
├─ Font: Pretendard SemiBold
├─ Size: 12px
├─ Padding: 4px 8px
├─ Border Radius: 6px
└─ Text: "(10:00)"

Modal Body:
├─ Padding: 20px
├─ Overflow Y: auto
└─ Max Height: calc(85vh - 180px)
```

#### Section 1: 지난 미팅 요약 (접힘 가능)

```
Section Container:
├─ Background: #F9FAFB (Gray 50)
├─ Border: 1px solid #E5E7EB (Gray 200)
├─ Border Radius: 12px (lg)
├─ Margin Bottom: 16px
└─ Overflow: hidden

Section Header (Clickable):
├─ Padding: 12px 16px
├─ Display: flex
├─ Align Items: center
├─ Justify Content: space-between
├─ Cursor: pointer
├─ Transition: background 150ms
└─ Hover: Background #F3F4F6 (Gray 100)

Section Title:
├─ Font: Pretendard SemiBold
├─ Size: 14px
├─ Color: #374151 (Gray 700)
├─ Display: flex
├─ Gap: 8px
└─ Icon: 📜 (16×16px)

Expand Icon:
├─ Size: 16×16px
├─ Color: #9CA3AF (Gray 400)
├─ Icon: ChevronDown
├─ Transition: transform 200ms
└─ Expanded: rotate(180deg)

Section Content (Collapsed):
├─ Max Height: 0
├─ Overflow: hidden
├─ Transition: max-height 300ms ease
└─ Padding: 0 16px

Section Content (Expanded):
├─ Max Height: 200px
├─ Padding: 0 16px 16px 16px
└─ Transition: max-height 300ms ease

Past Meeting Card:
├─ Background: #FFFFFF
├─ Border: 1px solid #E5E7EB (Gray 200)
├─ Border Radius: 8px (md)
├─ Padding: 12px
└─ Margin Bottom: 8px

Past Meeting Title:
├─ Font: Pretendard SemiBold
├─ Size: 13px
├─ Color: #111827 (Gray 900)
└─ Margin Bottom: 8px

Past Meeting Items:
├─ Font: Pretendard Regular
├─ Size: 13px
├─ Color: #6B7280 (Gray 500)
├─ Line Height: 18px
└─ List Style: disc (inside)
```

#### Section 2: 미확인 사항

```
Section Header:
├─ Font: Pretendard SemiBold
├─ Size: 14px
├─ Color: #374151 (Gray 700)
├─ Display: flex
├─ Gap: 8px
├─ Margin Bottom: 12px
└─ Icon: ⚠️ (16×16px)

Count Badge:
├─ Background: #FEF3C7 (Amber 100)
├─ Color: #92400E (Amber 800)
├─ Font: Pretendard SemiBold
├─ Size: 11px
├─ Padding: 2px 6px
├─ Border Radius: 10px (full)
└─ Margin Left: 4px

Unconfirmed Item Container:
├─ Background: #FFFBEB (Amber 50)
├─ Border: 1px solid #FCD34D (Amber 300)
├─ Border Radius: 8px (md)
├─ Padding: 12px
└─ Margin Bottom: 16px

Unconfirmed Item:
├─ Display: flex
├─ Align Items: center
├─ Gap: 10px
├─ Padding: 8px 0
└─ Border Bottom: 1px solid #FDE68A (Amber 200)
    Last Child: Border none

Checkbox (Unconfirmed):
├─ Width: 18px
├─ Height: 18px
├─ Border: 2px solid #D97706 (Amber 600)
├─ Border Radius: 4px
├─ Background: #FFFFFF
└─ Cursor: pointer

Item Label:
├─ Font: Pretendard Medium
├─ Size: 14px
├─ Color: #92400E (Amber 800)
└─ Flex: 1

Item Description (Optional):
├─ Font: Pretendard Regular
├─ Size: 12px
├─ Color: #B45309 (Amber 700)
└─ Margin Top: 2px
```

#### Section 3: AI 추천 질문

```
Section Header:
├─ Font: Pretendard SemiBold
├─ Size: 14px
├─ Color: #374151 (Gray 700)
├─ Display: flex
├─ Gap: 8px
├─ Margin Bottom: 12px
└─ Icon: 💡 (16×16px)

Questions Container:
├─ Background: #F0FDF4 (Green 50)
├─ Border: 1px solid #86EFAC (Green 300)
├─ Border Radius: 8px (md)
├─ Padding: 12px
└─ Margin Bottom: 16px

Question Item:
├─ Display: flex
├─ Align Items: flex-start
├─ Gap: 10px
├─ Padding: 10px 0
├─ Border Bottom: 1px solid #BBF7D0 (Green 200)
└─ Last Child: Border none

Checkbox (Question - Default Checked):
├─ Width: 20px
├─ Height: 20px
├─ Border: 2px solid #10B981 (Green 500)
├─ Border Radius: 4px
├─ Background: #10B981 (Green 500)
├─ Cursor: pointer
└─ Icon: Check (white, 14×14px)

Checkbox (Question - Unchecked):
├─ Background: #FFFFFF
├─ Border: 2px solid #D1D5DB (Gray 300)
└─ Icon: none

Question Text:
├─ Font: Pretendard Regular
├─ Size: 14px
├─ Color: #065F46 (Green 800)
├─ Line Height: 20px
└─ Flex: 1

Add Question Button:
├─ Width: 100%
├─ Height: 36px
├─ Background: transparent
├─ Border: 1px dashed #86EFAC (Green 300)
├─ Border Radius: 6px
├─ Color: #10B981 (Green 500)
├─ Font: Pretendard Medium
├─ Size: 13px
├─ Display: flex
├─ Align Items: center
├─ Justify Content: center
├─ Gap: 6px
├─ Cursor: pointer
├─ Margin Top: 8px
├─ Icon: Plus (16×16px)
├─ Text: "질문 추가"
├─ Transition: 150ms
└─ Hover: Background #DCFCE7 (Green 100), Border solid
```

#### Modal Footer

```
Footer Container:
├─ Padding: 16px 20px
├─ Border Top: 1px solid #E5E7EB (Gray 200)
├─ Background: #FFFFFF
├─ Sticky Bottom: 0
└─ Display: flex
    Flex Direction: column
    Gap: 12px

Action Buttons:
├─ Display: flex
├─ Gap: 12px
└─ Width: 100%

Primary Button (준비 완료):
├─ Flex: 2
├─ Height: 44px
├─ Background: #10B981 (Green 500)
├─ Color: #FFFFFF
├─ Font: Pretendard Bold
├─ Size: 15px
├─ Border Radius: 8px (md)
├─ Border: none
├─ Display: flex
├─ Align Items: center
├─ Justify Content: center
├─ Gap: 8px
├─ Icon: ArrowRight (18×18px)
├─ Text: "준비 완료"
├─ Cursor: pointer
├─ Transition: 200ms
└─ Hover: Background #059669 (Green 600), Shadow 2

Secondary Button (나중에):
├─ Flex: 1
├─ Height: 44px
├─ Background: transparent
├─ Border: 1px solid #D1D5DB (Gray 300)
├─ Color: #6B7280 (Gray 500)
├─ Font: Pretendard Medium
├─ Size: 14px
├─ Border Radius: 8px (md)
├─ Cursor: pointer
├─ Transition: 150ms
└─ Hover: Background #F9FAFB (Gray 50)

Meta Text (예상 시간):
├─ Font: Pretendard Regular
├─ Size: 12px
├─ Color: #9CA3AF (Gray 400)
├─ Text Align: center
└─ Display: flex
    Gap: 4px
    Justify Content: center
    Icon: Clock (14×14px)
```

#### Edge Case States

##### 첫 미팅 (과거 기록 없음)

```
Empty Past Meeting State:
├─ Background: #F9FAFB (Gray 50)
├─ Border: 1px solid #E5E7EB (Gray 200)
├─ Border Radius: 12px (lg)
├─ Padding: 24px
├─ Text Align: center
└─ Margin Bottom: 16px

Empty Icon:
├─ Size: 40×40px
├─ Color: #D1D5DB (Gray 300)
├─ Icon: FileText
└─ Margin Bottom: 12px

Empty Title:
├─ Font: Pretendard SemiBold
├─ Size: 14px
├─ Color: #6B7280 (Gray 500)
└─ Margin Bottom: 4px

Empty Description:
├─ Font: Pretendard Regular
├─ Size: 13px
└─ Color: #9CA3AF (Gray 400)

Empty Texts:
├─ Title: "첫 미팅입니다"
└─ Description: "이전 미팅 기록이 없습니다"
```

##### 다회차 미팅 (3회 이상)

```
Multiple Meetings Tab:
├─ Display: flex
├─ Gap: 8px
├─ Margin Bottom: 12px
├─ Overflow X: auto
└─ Padding Bottom: 4px (스크롤바 공간)

Meeting Tab Button:
├─ Min Width: fit-content
├─ Height: 32px
├─ Padding: 0 12px
├─ Background: #F3F4F6 (Gray 100)
├─ Border: 1px solid #E5E7EB (Gray 200)
├─ Border Radius: 16px (full)
├─ Color: #6B7280 (Gray 500)
├─ Font: Pretendard Medium
├─ Size: 12px
├─ Cursor: pointer
├─ Transition: 150ms
└─ White Space: nowrap

Meeting Tab Button (Active):
├─ Background: #3B82F6 (Blue 500)
├─ Border: 1px solid #3B82F6 (Blue 500)
└─ Color: #FFFFFF
```

##### 긴급 모드 (5분 이내)

```
Quick Prep Mode Banner:
├─ Background: #FEE2E2 (Red 100)
├─ Border: 1px solid #FECACA (Red 200)
├─ Border Radius: 8px (md)
├─ Padding: 10px 12px
├─ Margin Bottom: 16px
├─ Display: flex
├─ Align Items: center
├─ Gap: 8px
└─ Animation: pulse (subtle, 2s)

Banner Icon:
├─ Size: 18×18px
├─ Color: #DC2626 (Red 600)
└─ Icon: Clock (또는 AlertTriangle)

Banner Text:
├─ Font: Pretendard SemiBold
├─ Size: 13px
└─ Color: #991B1B (Red 800)

Banner Message: "5분 후 미팅! 핵심만 빠르게 확인하세요"

Quick Prep Simplified View:
├─ 지난 미팅 섹션: 기본 접힘 (자동 collapse)
├─ 미확인 사항: 상위 2개만 표시
├─ AI 질문: 상위 1개만 표시
└─ "전체 보기" 링크 추가
```

##### AI 실패 상태

```
AI Error Container:
├─ Background: #FEE2E2 (Red 100)
├─ Border: 1px solid #EF4444 (Red 500)
├─ Border Radius: 8px (md)
├─ Padding: 16px
└─ Margin Bottom: 16px

Error Icon:
├─ Size: 24×24px
├─ Color: #EF4444 (Red 500)
├─ Icon: AlertCircle
└─ Margin Bottom: 8px

Error Title:
├─ Font: Pretendard SemiBold
├─ Size: 14px
├─ Color: #991B1B (Red 800)
└─ Margin Bottom: 4px

Error Description:
├─ Font: Pretendard Regular
├─ Size: 13px
├─ Color: #B91C1C (Red 700)
└─ Margin Bottom: 12px

Retry Button:
├─ Width: 100%
├─ Height: 36px
├─ Background: #EF4444 (Red 500)
├─ Color: #FFFFFF
├─ Font: Pretendard SemiBold
├─ Size: 13px
├─ Border Radius: 6px
├─ Display: flex
├─ Align Items: center
├─ Justify Content: center
├─ Gap: 6px
├─ Icon: RefreshCw (14×14px)
└─ Text: "다시 시도"

Skip Option:
├─ Font: Pretendard Medium
├─ Size: 12px
├─ Color: #6B7280 (Gray 500)
├─ Text Align: center
├─ Margin Top: 8px
├─ Cursor: pointer
├─ Hover: underline
└─ Text: "준비 없이 시작하기"
```

#### 애니메이션 스펙

```
Modal Enter:
├─ Overlay: opacity 0 → 1 (250ms)
├─ Container:
│   ├─ From: scale(0.95), opacity: 0, translateY(20px)
│   ├─ To: scale(1), opacity: 1, translateY(0)
│   ├─ Duration: 300ms
│   └─ Easing: cubic-bezier(0.34, 1.56, 0.64, 1)

Section Expand:
├─ From: max-height: 0
├─ To: max-height: 200px
├─ Duration: 300ms
└─ Easing: cubic-bezier(0.4, 0, 0.2, 1)

Checkbox Toggle:
├─ Transform: scale(0.9 → 1.1 → 1)
├─ Duration: 200ms
└─ Icon Fade: 150ms

Question Add:
├─ From: opacity: 0, translateY(-10px)
├─ To: opacity: 1, translateY(0)
├─ Duration: 250ms
└─ Easing: cubic-bezier(0.4, 0, 0.2, 1)

Prep Complete Success:
├─ Button: scale(1 → 0.95 → 1)
├─ Duration: 200ms
├─ Background: #10B981 → #059669 → #10B981
└─ + Confetti animation (optional)
```

### 4.6 Today 화면 섹션 구조 (Part 2.1)

#### 전체 레이아웃 (5-Layer Framework)

```
┌──────────────────────────────────────┐
│  좋은 아침이에요, 민수님 👋           │  ← 인사 섹션
│  2025년 12월 30일 월요일             │
├──────────────────────────────────────┤
│  🔴 지금 바로 처리 (2) [펼침]         │  ← 긴급 섹션
│  ───────────────────────────         │
│  [확정 대기 카드]                      │
│  [기한 임박 카드]                      │
├──────────────────────────────────────┤
│  📅 오늘 미팅 (3) [펼침]              │  ← 오늘 미팅 섹션
│  ───────────────────────────         │
│  [10:00 A사 미팅 카드]                │
│  [14:00 B사 미팅 카드]                │
│  [16:00 C사 미팅 카드]                │
├──────────────────────────────────────┤
│  ⏰ 나중에 (4) [접힘] ▼              │  ← 나중에 섹션
│                                      │
└──────────────────────────────────────┘
```

#### 섹션 상세 스펙

```
Section Component (공통):
├─ Container:
│   ├─ Margin Bottom: 20px
│   └─ Border Bottom: 1px solid #E5E7EB (마지막 제외)
│
├─ Header (Clickable):
│   ├─ Display: flex
│   ├─ Align Items: center
│   ├─ Justify Content: space-between
│   ├─ Padding: 8px 0
│   ├─ Cursor: pointer
│   └─ Transition: opacity 200ms
│
├─ Title Container:
│   ├─ Display: flex
│   ├─ Gap: 8px
│   └─ Align Items: center
│
├─ Section Icon:
│   ├─ Size: 20×20px
│   └─ Color: 섹션별 상이
│
├─ Section Title:
│   ├─ Font: Pretendard SemiBold
│   ├─ Size: 16px
│   └─ Color: #111827 (Gray 900)
│
└─ Count Badge:
    ├─ Background: 섹션별 상이
    ├─ Color: 섹션별 상이
    ├─ Font: Pretendard Bold
    ├─ Size: 12px
    ├─ Padding: 2px 10px
    ├─ Border Radius: 10px
    └─ Min Width: 24px

섹션별 컬러:

🔴 긴급 섹션:
├─ Icon Color: #EF4444 (Red 500)
├─ Badge BG: #FEE2E2 (Red 100)
├─ Badge Color: #991B1B (Red 800)
└─ 펄스 애니메이션 적용

📅 오늘 미팅:
├─ Icon Color: #3B82F6 (Blue 500)
├─ Badge BG: #DBEAFE (Blue 100)
└─ Badge Color: #1E40AF (Blue 800)

⏰ 나중에:
├─ Icon Color: #6B7280 (Gray 500)
├─ Badge BG: #E5E7EB (Gray 200)
├─ Badge Color: #374151 (Gray 700)
└─ 기본 접힘 상태

펼침/접힘 아이콘:
├─ Icon: ChevronDown
├─ Size: 16×16px
├─ Color: #9CA3AF (Gray 400)
├─ Transition: transform 200ms
└─ 펼침 시: rotate(180deg)
```

#### 섹션 콘텐츠 영역

```
Content Container:
├─ Overflow: hidden
├─ Transition: max-height 300ms ease
├─ Collapsed: max-height 0, padding 0
└─ Expanded: max-height 500px (auto calc), padding 12px 0

카드 목록:
├─ Display: flex
├─ Flex Direction: column
├─ Gap: 12px
└─ Padding: 0
```

#### Empty States

```
Case 1: 완전 신규 사용자
┌──────────────────────────────────────┐
│  환영해요! 🎉                         │
│                                      │
│         [일러스트]                    │
│      📅 ────────                     │
│                                      │
│    첫 미팅을 기다리고 있어요           │
│    캘린더를 연동하면 자동으로          │
│    미팅이 나타나요                     │
│                                      │
│       [캘린더 연동하기]               │
│       [데모 미팅 체험]                │
│                                      │
└──────────────────────────────────────┘

Empty State Container:
├─ Padding: 48px 24px
├─ Text Align: center
├─ Background: #F9FAFB (Gray 50)
├─ Border: 2px dashed #E5E7EB (Gray 200)
└─ Border Radius: 16px (xl)

Illustration:
├─ Size: 120×120px
├─ Margin Bottom: 24px
└─ Opacity: 0.8

Title:
├─ Font: Pretendard Bold
├─ Size: 20px
├─ Color: #111827 (Gray 900)
└─ Margin Bottom: 8px

Description:
├─ Font: Pretendard Regular
├─ Size: 14px
├─ Color: #6B7280 (Gray 500)
├─ Line Height: 22px
└─ Margin Bottom: 24px

Primary CTA:
├─ Background: #3B82F6 (Blue 500)
├─ Color: #FFFFFF
├─ Font: Pretendard SemiBold
├─ Size: 14px
├─ Padding: 12px 24px
├─ Border Radius: 8px
├─ Hover: Background #2563EB (Blue 600)
└─ Margin Bottom: 12px

Secondary CTA:
├─ Background: transparent
├─ Color: #6B7280 (Gray 500)
├─ Font: Pretendard Medium
├─ Size: 14px
├─ Padding: 8px 16px
├─ Border: 1px solid #E5E7EB (Gray 200)
├─ Border Radius: 8px
└─ Hover: Background #F9FAFB (Gray 50)


Case 2: 오늘 미팅 없음
┌──────────────────────────────────────┐
│  📅 오늘 미팅 (0)                     │
│  ─────────────────────               │
│                                      │
│    오늘은 여유롭네요! ☕               │
│    내일 미팅 준비해볼까요?             │
│                                      │
└──────────────────────────────────────┘

Relaxed State:
├─ Padding: 24px
├─ Text Align: center
├─ Background: #F0FDF4 (Green 50)
├─ Border Radius: 12px (lg)
├─ Emoji Size: 32px
├─ Message Font: Pretendard Medium, 14px
└─ Color: #166534 (Green 800)


Case 3: 과부하 경고 (5건 이상)
┌──────────────────────────────────────┐
│  ⚠️ 오늘 미팅이 많네요                 │
│  중요한 것만 집중하세요                │
│  ─────────────────────               │
│  [접힌 카드 3개]                      │
│  [+ 2개 더 보기 ▼]                    │
└──────────────────────────────────────┘

Overload Warning:
├─ Background: #FEF3C7 (Yellow 100)
├─ Border: 1px solid #F59E0B (Yellow 500)
├─ Border Radius: 8px
├─ Padding: 12px 16px
├─ Margin Bottom: 12px
├─ Icon: ⚠️ 16×16px
├─ Text Font: Pretendard Medium, 13px
└─ Color: #92400E (Yellow 800)

더 보기 버튼:
├─ Font: Pretendard Medium
├─ Size: 13px
├─ Color: #3B82F6 (Blue 500)
├─ Text Align: center
├─ Padding: 12px
├─ Background: #F3F4F6 (Gray 100)
├─ Border Radius: 8px
├─ Cursor: pointer
└─ Hover: Background #E5E7EB (Gray 200)
```

### 4.7 카드 상태 디자인 (Part 2.2)

#### 카드 상태 머신

```
상태 전환 다이어그램:

   PENDING ──→ URGENT ──→ PREPPING
      │           │           │
      │           ↓           ↓
      └──→ SKIPPED ←──── READY ──→ LIVE

각 상태별 시각적 차별화:

┌─────────────────────────────────────────────────────────┐
│ State     │ Border      │ Background │ Badge           │
├─────────────────────────────────────────────────────────┤
│ PENDING   │ #E5E7EB 1px │ #FFFFFF    │ 없음            │
│ URGENT    │ #EF4444 2px │ #FEF2F2    │ 🔴 빨간 펄스    │
│ PREPPING  │ #3B82F6 2px │ #EFF6FF    │ 🔵 파란 스피너  │
│ READY     │ #10B981 2px │ #ECFDF5    │ ✅ 녹색 체크    │
│ LIVE      │ #8B5CF6 2px │ #F5F3FF    │ 🔴 라이브 점   │
│ SKIPPED   │ #E5E7EB 1px │ #F9FAFB    │ ⚠️ 준비 안 됨   │
└─────────────────────────────────────────────────────────┘
```

#### 상태별 상세 스펙

```
PENDING State (낮은 우선순위):
Container:
├─ Border: 1px solid #E5E7EB (Gray 200)
├─ Background: #FFFFFF
├─ Opacity: 0.9
└─ Box Shadow: none

Title:
├─ Color: #6B7280 (Gray 500)
└─ Font Weight: Medium

CTA:
└─ Hidden (표시 안 함)


URGENT State (긴급):
Container:
├─ Border: 2px solid #EF4444 (Red 500)
├─ Background: #FEF2F2 (Red 50)
├─ Box Shadow: 0 0 0 4px rgba(239, 68, 68, 0.1)
└─ Animation: pulse (아래 참조)

Title:
├─ Color: #991B1B (Red 800)
└─ Font Weight: Bold

Badge:
├─ Position: absolute
├─ Top: -6px, Right: -6px
├─ Width: 12px, Height: 12px
├─ Background: #EF4444 (Red 500)
├─ Border: 2px solid #FFFFFF
├─ Border Radius: 50%
└─ Animation: pulse 2s infinite

Pulse Animation:
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 0 0 8px rgba(239, 68, 68, 0);
  }
}


PREPPING State (준비 중):
Container:
├─ Border: 2px solid #3B82F6 (Blue 500)
├─ Background: #EFF6FF (Blue 50)
├─ Box Shadow: Shadow 2
└─ Position: relative

Progress Indicator:
├─ Position: absolute
├─ Bottom: 0, Left: 0
├─ Width: 100%
├─ Height: 3px
├─ Background: #DBEAFE (Blue 100)
└─ Progress Fill: #3B82F6, width: [진행률]%

Spinner Badge:
├─ Position: absolute
├─ Top: -6px, Right: -6px
├─ Width: 20px, Height: 20px
├─ Background: #3B82F6 (Blue 500)
├─ Border: 2px solid #FFFFFF
├─ Border Radius: 50%
└─ Animation: spin 1s linear infinite

Spin Animation:
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}


READY State (준비 완료):
Container:
├─ Border: 2px solid #10B981 (Green 500)
├─ Background: #ECFDF5 (Green 50)
└─ Box Shadow: Shadow 1

Check Badge:
├─ Position: absolute
├─ Top: -6px, Right: -6px
├─ Width: 20px, Height: 20px
├─ Background: #10B981 (Green 500)
├─ Border: 2px solid #FFFFFF
├─ Border Radius: 50%
├─ Icon: Check (white, 12px)
└─ Animation: bounce-in on appear

CTA:
├─ Text: "미팅 시작"
├─ Background: #10B981 (Green 500)
├─ Hover: #059669 (Green 600)
└─ Icon: PlayCircle (왼쪽)


LIVE State (진행 중):
Container:
├─ Border: 2px solid #8B5CF6 (Purple 500)
├─ Background: #F5F3FF (Purple 50)
└─ Cursor: pointer (클릭 시 Now 화면)

Live Badge:
├─ Background: #8B5CF6 (Purple 500)
├─ Color: #FFFFFF
├─ Font: Pretendard Bold, 10px
├─ Text: "LIVE"
├─ Padding: 2px 6px
├─ Border Radius: 4px
├─ Position: absolute, Top: 12px, Right: 12px
└─ Animation: blink 1s infinite

Dot Indicator:
├─ Width: 8px, Height: 8px
├─ Background: #EF4444 (Red 500)
├─ Border Radius: 50%
├─ Margin Right: 4px
└─ Animation: pulse 1.5s infinite

CTA:
├─ Text: "회의 보기"
├─ Background: #8B5CF6 (Purple 500)
└─ Hover: #7C3AED (Purple 600)


SKIPPED State (건너뜀):
Container:
├─ Border: 1px solid #E5E7EB (Gray 200)
├─ Background: #F9FAFB (Gray 50)
├─ Opacity: 0.8
└─ Position: relative

Warning Badge:
├─ Background: #FEF3C7 (Yellow 100)
├─ Color: #92400E (Yellow 800)
├─ Font: Pretendard Medium, 11px
├─ Text: "⚠️ 준비 안 됨"
├─ Padding: 4px 8px
├─ Border Radius: 6px
└─ Position: absolute, Top: 12px, Right: 12px

CTA:
├─ Text: "지금 준비하기"
├─ Background: transparent
├─ Border: 1px solid #F59E0B (Yellow 500)
├─ Color: #92400E (Yellow 800)
└─ Hover: Background #FEF3C7
```

#### 카드 인터랙션 상세

```
Hover Effect (공통):
├─ Transform: translateY(-2px)
├─ Box Shadow: Shadow 3
├─ Transition: all 200ms ease
└─ Border Color: 상태별 darker shade

Click/Tap Feedback:
├─ Transform: scale(0.98)
├─ Duration: 100ms
└─ Easing: ease-out

CTA Button Hover:
├─ Background: darker shade
├─ Transform: translateX(2px)
└─ Transition: all 150ms

Dual CTA Layout:
┌────────────────────────────────────┐
│                                    │
│  [   준비하기   ]  [  바로 시작  ]  │
│      Primary         Secondary     │
│                                    │
└────────────────────────────────────┘

Button Container:
├─ Display: flex
├─ Gap: 12px
├─ Margin Top: 16px
└─ Justify Content: flex-end

Primary CTA (준비하기):
├─ Flex: 1
├─ Background: #3B82F6 (Blue 500)
├─ Color: #FFFFFF
├─ Font: Pretendard SemiBold, 14px
├─ Padding: 10px 16px
├─ Border Radius: 8px
├─ Text Align: center
└─ Hover: Background #2563EB (Blue 600)

Secondary CTA (바로 시작):
├─ Flex: 0 (auto width)
├─ Background: transparent
├─ Color: #6B7280 (Gray 500)
├─ Font: Pretendard Medium, 14px
├─ Padding: 10px 16px
├─ Border: 1px solid #E5E7EB (Gray 200)
├─ Border Radius: 8px
└─ Hover: Background #F9FAFB, Border #D1D5DB
```

#### 카운트다운 타이머 (미팅 임박)

```
미팅 5분 이내:
┌────────────────────────────────────┐
│ 🔴 10:00 A사 미팅        ⏱️ 4:32  │
│                                    │
│ 💡 빠른 준비 권장 (30초)            │
│                                    │
│  [ ⚡ 빠른 준비 ]  [  바로 시작  ]  │
└────────────────────────────────────┘

Countdown Container:
├─ Display: flex
├─ Align Items: center
├─ Gap: 6px
├─ Position: absolute
├─ Top: 16px, Right: 16px
└─ Background: #FEE2E2 (Red 100)

Timer Icon:
├─ Icon: Clock
├─ Size: 14×14px
└─ Color: #EF4444 (Red 500)

Timer Text:
├─ Font: Pretendard Bold
├─ Size: 14px
├─ Color: #991B1B (Red 800)
├─ Font Feature: tabular-nums (고정폭 숫자)
└─ Animation: blink when < 1min

Quick Prep CTA:
├─ Background: #F59E0B (Yellow 500)
├─ Color: #FFFFFF
├─ Icon: ⚡ (Zap)
├─ Font: Pretendard Bold, 14px
├─ Padding: 10px 20px
├─ Border Radius: 8px
├─ Animation: subtle pulse
└─ Hover: Background #D97706 (Yellow 600)
```

### 4.8 확정 및 통합 디자인 (Part 4)

> **핵심 원칙**: "미팅 끝 = 정리 끝. 끊김 없는 전환으로 완료감 제공"

#### 4.8.1 HUD → 확정 모달 전환 애니메이션

```
전환 시퀀스 (Total: 1100ms):

Phase 1: HUD Fade Out (200ms)
├─ Duration: 200ms
├─ Timing: ease-out
├─ Transform: scale(1 → 0.95)
├─ Opacity: 1 → 0
└─ Z-index: 9999

Phase 2: Transition Delay (500ms)
├─ Purpose: 종료 확신 + 심리적 전환
└─ No visual change

Phase 3: Modal Overlay Fade In (150ms)
├─ Background: rgba(0, 0, 0, 0 → 0.5)
├─ Timing: ease-in
└─ Blur: backdrop-filter: blur(0 → 4px)

Phase 4: Modal Content Slide Up (400ms)
├─ Duration: 400ms
├─ Timing: cubic-bezier(0.16, 1, 0.3, 1) (spring)
├─ Transform: translateY(20px) → translateY(0)
├─ Opacity: 0 → 1
├─ Scale: 0.97 → 1
└─ Stagger: 결정사항 카드들 50ms 간격 순차 등장
```

#### 4.8.2 확정 모달 고도화 레이아웃

```
┌─────────────────────────────────────────────────────────────────┐
│                                                            [×]  │
│                                                                  │
│  📋 A사 투자 검토 미팅                                           │
│  ──────────────────────────────────────────────────────────    │
│  12월 30일 월요일 14:00 ~ 15:23 (1시간 23분)                     │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  🎯 핵심 결정 사항                              진행률: 2/3 ○○●  │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ✓ 1. 시리즈A 500억 밸류 제안 → 합의                      │   │
│  │                                                          │   │
│  │    👤 담당    📅 기한                                    │   │
│  │    [김철수▼]  [2025-01-15]                              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ⚠ 2. 기술 실사 일정 조율 필요                            │   │
│  │                                                 [빈칸!]  │   │
│  │    👤 담당         📅 기한                               │   │
│  │    [________]      [________]  ← 노란 테두리 펄스         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ✓ 3. 리드 투자자 역할 A사 담당                           │   │
│  │                                                          │   │
│  │    👤 담당      📅 기한                                  │   │
│  │    [A사 대표]   [________]                              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  💡 인사이트 요약                                   [더 보기 ▼]  │
│  • 창업자 실행력 ⭐⭐⭐⭐⭐                                        │
│  • 시장 진입 타이밍 적절                                         │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ☑ Notion "투자 미팅 DB"에 저장  (✓ 연결됨: 민수의 워크스페이스)  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    [✓ 확정하기]                            │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  [나중에 처리 →]                                                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

#### 4.8.3 빈칸 상태별 디자인

```
Gap Field States:

State 1: Empty (미입력)
├─ Border: 2px solid #FCD34D (Yellow 300)
├─ Background: #FFFBEB (Yellow 50)
├─ Animation: pulse (1.5s infinite)
│   └─ box-shadow: 0 0 0 0 → 0 0 0 4px rgba(252, 211, 77, 0.4)
├─ Placeholder: "입력하세요" (Gray 400)
└─ Icon: ⚠️ (우측 상단, 노란색)

State 2: Focused (입력 중)
├─ Border: 2px solid #3B82F6 (Blue 500)
├─ Background: #FFFFFF
├─ Animation: none
├─ Box Shadow: 0 0 0 4px rgba(59, 130, 246, 0.2)
└─ Caret: Blue 500

State 3: Filled (입력 완료)
├─ Border: 1px solid #10B981 (Green 500)
├─ Background: #ECFDF5 (Green 50)
├─ Animation: check mark appear (300ms)
├─ Icon: ✓ (우측, 녹색)
└─ Text: Gray 900

State 4: Suggestion Dropdown (자동완성)
├─ Position: absolute, below input
├─ Background: #FFFFFF
├─ Border: 1px solid #E5E7EB
├─ Border Radius: 8px
├─ Shadow: Shadow 3
├─ Max Height: 200px
├─ Overflow: auto
└─ Item:
   ├─ Padding: 10px 12px
   ├─ Hover: Background #F3F4F6
   ├─ Selected: Background #EFF6FF, Left border 3px Blue 500
   └─ Font: Pretendard Regular 14px
```

#### 4.8.4 진행률 인디케이터

```
Progress Indicator (우측 상단):

Layout:
├─ Display: flex
├─ Gap: 4px
├─ Align Items: center
└─ Text: "진행률: 2/3"

Text:
├─ Font: Pretendard Medium
├─ Size: 12px
├─ Color: #6B7280 (Gray 500)
└─ Margin Right: 8px

Dots:
├─ Width: 8px
├─ Height: 8px
├─ Border Radius: 50%
├─ Completed: #10B981 (Green 500)
├─ Empty: #E5E7EB (Gray 200)
└─ Transition: background-color 300ms

All Complete State:
├─ All dots: Green 500
├─ Text: "모두 완료!" (Green 600)
├─ Animation: celebratory bounce
└─ Confetti: 3-4 particles (optional)
```

#### 4.8.5 확정하기 버튼 상태

```
Confirm Button States:

State 1: Disabled (빈칸 있음)
├─ Background: #E5E7EB (Gray 200)
├─ Color: #9CA3AF (Gray 400)
├─ Cursor: not-allowed
├─ Text: "빈칸을 채워주세요"
└─ Icon: none

State 2: Enabled (모두 완료)
├─ Background: #10B981 (Green 500)
├─ Color: #FFFFFF
├─ Cursor: pointer
├─ Text: "✓ 확정하기"
├─ Icon: CheckCircle (20×20px)
├─ Animation: subtle glow
│   └─ box-shadow: 0 0 20px rgba(16, 185, 129, 0.3)
└─ Hover: Background #059669 (Green 600)

State 3: Saving (저장 중)
├─ Background: #10B981 (Green 500)
├─ Color: #FFFFFF
├─ Cursor: wait
├─ Text: "저장 중..."
├─ Icon: Spinner (rotating)
│   └─ Animation: spin 1s linear infinite
└─ Opacity: 0.8
```

#### 4.8.6 완료 화면

```
Completion Screen Layout:
┌───────────────────────────────────────────────────────────────┐
│                                                                │
│                                                                │
│                          ✓                                     │
│                    (원형 체크마크)                              │
│                                                                │
│                    저장 완료!                                   │
│                                                                │
│         Notion "투자 미팅 DB"에 저장되었습니다                   │
│                                                                │
│    ┌─────────────────┐    ┌─────────────────┐                 │
│    │ Notion에서 보기  │    │ Today로 돌아가기 │                 │
│    └─────────────────┘    └─────────────────┘                 │
│                                                                │
│              ──────────── 3초 후 자동 이동                      │
│                                                                │
└───────────────────────────────────────────────────────────────┘
```

#### 4.8.7 완료 화면 상세 스펙

```
Completion Container:
├─ Width: 100%
├─ Height: 100%
├─ Display: flex
├─ Flex Direction: column
├─ Justify Content: center
├─ Align Items: center
├─ Background: #FFFFFF
├─ Padding: 40px
└─ Animation: fade in (300ms)

Success Icon:
├─ Size: 80×80px
├─ Color: #10B981 (Green 500)
├─ Icon: CheckCircle (filled)
├─ Animation:
│   ├─ Scale: 0 → 1.2 → 1 (500ms, bounce)
│   ├─ Opacity: 0 → 1 (300ms)
│   └─ Draw: stroke-dashoffset animation
└─ Glow: 0 0 40px rgba(16, 185, 129, 0.3)

Title "저장 완료!":
├─ Font: Pretendard Bold
├─ Size: 24px
├─ Color: #111827 (Gray 900)
├─ Margin Top: 24px
└─ Animation: slide up + fade in (delay 200ms)

Description:
├─ Font: Pretendard Regular
├─ Size: 14px
├─ Color: #6B7280 (Gray 500)
├─ Margin Top: 8px
├─ Text Align: center
└─ Animation: slide up + fade in (delay 300ms)

Button Container:
├─ Display: flex
├─ Gap: 12px
├─ Margin Top: 32px
└─ Animation: slide up + fade in (delay 400ms)

Notion Button:
├─ Background: #000000
├─ Color: #FFFFFF
├─ Font: Pretendard SemiBold 14px
├─ Padding: 12px 24px
├─ Border Radius: 8px
├─ Icon: Notion logo (16×16px, left)
└─ Hover: opacity 0.9

Today Button:
├─ Background: #F3F4F6 (Gray 100)
├─ Color: #374151 (Gray 700)
├─ Font: Pretendard Medium 14px
├─ Padding: 12px 24px
├─ Border Radius: 8px
└─ Hover: Background #E5E7EB

Auto Redirect Timer:
├─ Font: Pretendard Regular
├─ Size: 12px
├─ Color: #9CA3AF (Gray 400)
├─ Margin Top: 24px
├─ Display: flex
├─ Gap: 4px
└─ Progress Bar:
    ├─ Width: 100px
    ├─ Height: 2px
    ├─ Background: #E5E7EB
    ├─ Fill: #10B981 (animating left to right)
    └─ Duration: 3s linear
```

#### 4.8.8 에러 및 재시도 UI

```
Error Toast (저장 실패):
┌───────────────────────────────────────────────────────┐
│ ⚠️  Notion 저장에 실패했습니다        [재시도] [닫기]  │
│     로컬에는 저장되었습니다                            │
└───────────────────────────────────────────────────────┘

Error Toast Spec:
├─ Position: fixed bottom 24px, center
├─ Width: auto (max 400px)
├─ Background: #FEF2F2 (Red 50)
├─ Border: 1px solid #FECACA (Red 200)
├─ Border Left: 4px solid #EF4444 (Red 500)
├─ Border Radius: 8px
├─ Padding: 12px 16px
├─ Shadow: Shadow 3
└─ Animation: slide up + fade in

Retry Button:
├─ Background: #EF4444 (Red 500)
├─ Color: #FFFFFF
├─ Font: Pretendard SemiBold 12px
├─ Padding: 6px 12px
├─ Border Radius: 4px
└─ Hover: #DC2626 (Red 600)

Retry Loading State:
├─ Button text: "재시도 중..."
├─ Icon: Spinner (12×12px, left)
└─ Disabled: true
```

#### 4.8.9 나중에 처리 확인 다이얼로그

```
Later Confirmation Dialog:
┌────────────────────────────────────────┐
│                                        │
│  나중에 처리할까요?                     │
│                                        │
│  Today 화면에서 다시 확인할 수 있어요    │
│                                        │
│  ┌──────────┐    ┌──────────┐         │
│  │ 아니요    │    │  네      │         │
│  └──────────┘    └──────────┘         │
│                                        │
└────────────────────────────────────────┘

Dialog Spec:
├─ Width: 320px
├─ Background: #FFFFFF
├─ Border Radius: 16px
├─ Shadow: Shadow 4
├─ Padding: 24px
└─ Position: center of overlay

Title:
├─ Font: Pretendard SemiBold 18px
├─ Color: #111827
└─ Text Align: center

Description:
├─ Font: Pretendard Regular 14px
├─ Color: #6B7280
├─ Margin Top: 8px
└─ Text Align: center

Button "아니요":
├─ Background: #F3F4F6
├─ Color: #374151
├─ Width: 50%
└─ Hover: #E5E7EB

Button "네":
├─ Background: #3B82F6
├─ Color: #FFFFFF
├─ Width: 50%
└─ Hover: #2563EB
```

#### 4.8.10 짧은 미팅 간소화 모달

```
Short Meeting Modal (미팅 < 5분):
┌────────────────────────────────────────────────────────┐
│                                                        │
│  📝 짧은 미팅이었네요 (4분 32초)                         │
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │ 특별한 결정사항이 없었습니다                       │ │
│  │                                                  │ │
│  │ 녹취록은 자동 저장되었어요                        │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
│  ☑ Notion에 저장 (빈 미팅으로)                         │
│                                                        │
│  ┌────────────────┐    ┌────────────────┐            │
│  │  건너뛰기       │    │  저장하기       │            │
│  └────────────────┘    └────────────────┘            │
│                                                        │
└────────────────────────────────────────────────────────┘

Short Meeting Modal Spec:
├─ Width: 400px
├─ Background: #FFFFFF
├─ Border Radius: 16px
├─ Shadow: Shadow 4
└─ Animation: scale up (0.95 → 1)

Header:
├─ Font: Pretendard Bold 18px
├─ Color: #111827
├─ Icon: 📝 (left)
└─ Badge: duration (Gray background)

Content Card:
├─ Background: #F9FAFB
├─ Border Radius: 12px
├─ Padding: 16px
├─ Text: Pretendard Regular 14px
└─ Color: #6B7280

Skip Button:
├─ Background: transparent
├─ Border: 1px solid #E5E7EB
├─ Color: #6B7280
└─ Hover: Background #F9FAFB

Save Button:
├─ Background: #3B82F6
├─ Color: #FFFFFF
└─ Hover: #2563EB
```

---

## 5. 화면 3: 검색 (Search)

### 5.1 검색 화면 (Empty State)

#### 레이아웃

```
┌──────────────────────────────────────┐
│                                      │
│  🔍 검색                              │
│  ┌────────────────────────────────┐  │
│  │ 과거 대화 검색...              │  │  ← 검색창
│  └────────────────────────────────┘  │
│                                      │
│                                      │
│          🔎                          │  ← Empty State
│                                      │
│    과거 회의 내용을 검색하세요        │
│                                      │
│  예시:                                │
│  • "A사 예산"                         │
│  • "지난달 실패한 딜"                 │
│  • "김대표 약속"                      │
│                                      │
└──────────────────────────────────────┘
```

#### 상세 스펙

```
Container:
├─ Width: 400px
├─ Height: 100vh
├─ Background: #F9FAFB (Gray 50)
├─ Padding: 24px 20px
└─ Overflow: auto

Search Header:
├─ Font: Pretendard Bold
├─ Size: 24px
├─ Color: #111827 (Gray 900)
├─ Margin Bottom: 16px
└─ Display: flex + gap

Search Input Container:
├─ Position: relative
├─ Width: 100%
└─ Margin Bottom: 24px

Search Icon:
├─ Position: absolute
├─ Left: 12px
├─ Top: 50%
├─ Transform: translateY(-50%)
├─ Color: #9CA3AF (Gray 400)
└─ Size: 20×20px

Search Input:
├─ Width: 100%
├─ Height: 44px
├─ Background: #FFFFFF
├─ Border: 2px solid #E5E7EB (Gray 200)
├─ Border Radius: 12px (lg)
├─ Padding: 0 12px 0 44px (왼쪽 아이콘 공간)
├─ Font: Pretendard Regular
├─ Size: 16px
├─ Color: #111827 (Gray 900)
├─ Placeholder: "과거 대화 검색..."
├─ Placeholder Color: #9CA3AF (Gray 400)
└─ Focus: Border #3B82F6 (Blue 500)

Empty State Container:
├─ Display: flex
├─ Flex Direction: column
├─ Align Items: center
├─ Justify Content: center
├─ Padding: 60px 20px
└─ Text Align: center

Empty Icon:
├─ Size: 64×64px
├─ Color: #D1D5DB (Gray 300)
└─ Margin Bottom: 16px

Empty Message:
├─ Font: Pretendard Regular
├─ Size: 16px
├─ Color: #6B7280 (Gray 500)
└─ Margin Bottom: 24px

Example Section:
├─ Background: #FFFFFF
├─ Border: 1px solid #E5E7EB (Gray 200)
├─ Border Radius: 12px (lg)
├─ Padding: 16px
└─ Width: 100%

Example Label:
├─ Font: Pretendard SemiBold
├─ Size: 12px
├─ Color: #6B7280 (Gray 500)
├─ Margin Bottom: 12px
└─ Text: "예시:"

Example Item:
├─ Font: Pretendard Regular
├─ Size: 14px
├─ Color: #3B82F6 (Blue 500)
├─ Line Height: 28px
├─ Cursor: pointer
├─ Hover: Underline
└─ Prefix: "•"
```

### 5.2 검색 결과

#### 레이아웃

```
┌──────────────────────────────────────┐
│  🔍 검색                              │
│  ┌────────────────────────────────┐  │
│  │ A사 CAC                        │  │
│  └────────────────────────────────┘  │
│                                      │
│  결과 3개                             │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ A사 2차 미팅 (2025.12.29)      │  │
│  │                                │  │
│  │ "CAC는 채널별로 온라인 $85,    │  │
│  │  오프라인 $120입니다"          │  │
│  │                                │  │
│  │ [전체 보기 →]                  │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ A사 1차 미팅 (2025.12.22)      │  │
│  │ "CAC 관련 질문..."             │  │
│  │ [전체 보기 →]                  │  │
│  └────────────────────────────────┘  │
│                                      │
└──────────────────────────────────────┘
```

#### 상세 스펙

```
Results Header:
├─ Font: Pretendard Medium
├─ Size: 14px
├─ Color: #6B7280 (Gray 500)
├─ Margin: 16px 0 12px 0
└─ Text: "결과 N개"

Result Card:
├─ Background: #FFFFFF
├─ Border: 1px solid #E5E7EB (Gray 200)
├─ Border Radius: 12px (lg)
├─ Padding: 16px
├─ Margin Bottom: 12px
├─ Shadow: Shadow 1
└─ Hover: Shadow 2 + Border #3B82F6

Card Title (미팅 정보):
├─ Font: Pretendard SemiBold
├─ Size: 16px
├─ Color: #111827 (Gray 900)
├─ Margin Bottom: 8px
└─ Format: "회사명 미팅명 (날짜)"

Date Badge:
├─ Background: #F3F4F6 (Gray 100)
├─ Color: #6B7280 (Gray 500)
├─ Font: Pretendard Medium
├─ Size: 12px
├─ Padding: 2px 8px
├─ Border Radius: 6px
└─ Display: inline-block

Excerpt (발췌):
├─ Font: Pretendard Regular
├─ Size: 14px
├─ Color: #374151 (Gray 700)
├─ Line Height: 20px
├─ Max Lines: 3 (clamp)
├─ Margin: 12px 0
└─ Background: #F9FAFB (Gray 50)
    Padding: 12px
    Border Radius: 8px (md)

Highlight (검색어 강조):
├─ Background: #FEF3C7 (Amber 100)
├─ Color: #92400E (Amber 800)
├─ Font Weight: 600 (SemiBold)
├─ Padding: 2px 4px
└─ Border Radius: 4px

View Button:
├─ Font: Pretendard Medium
├─ Size: 14px
├─ Color: #3B82F6 (Blue 500)
├─ Display: inline-flex
├─ Gap: 4px
├─ Icon: ArrowRight (16×16px)
└─ Hover: Underline
```

---

### 5.3 검색 진입 화면 고도화 (Part 5)

#### 레이아웃

```
┌──────────────────────────────────────────────────────────────┐
│  🔍 검색                                                      │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐    │
│  │ 🔍 무엇이든 물어보세요 (예: "A사 예산", "지난주 리스크")│    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
│  ───────────────────────────────────────────────────────    │
│                                                              │
│  💡 추천 검색                                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │ A사 예산  │ │ 리스크   │ │ 이번주   │ │ 미확인   │        │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘        │
│                                                              │
│  🕐 최근 검색                                                 │
│  ├─ "CAC 논의" - 2일 전                                      │
│  ├─ "B사 계약 조건" - 1주일 전                               │
│  └─ "김대표 약속" - 2주일 전                                 │
│                                                              │
│  📊 자주 검색되는 주제                                        │
│  ├─ 예산/가격: 23회                                          │
│  ├─ 일정/타임라인: 18회                                       │
│  └─ 리스크/우려: 15회                                        │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

#### 상세 스펙

```
Search Input (고도화):
├─ Width: 100%
├─ Height: 48px
├─ Background: #FFFFFF
├─ Border: 2px solid #E5E7EB (Gray 200)
├─ Border Radius: 12px (lg)
├─ Padding: 0 16px 0 44px
├─ Font: Pretendard Regular
├─ Size: 16px
├─ Color: #111827 (Gray 900)
├─ Placeholder: "무엇이든 물어보세요 (예: 'A사 예산', '지난주 리스크')"
├─ Placeholder Color: #9CA3AF (Gray 400)
├─ Focus Border: #3B82F6 (Blue 500)
├─ Focus Shadow: 0 0 0 3px rgba(59, 130, 246, 0.1)
└─ Transition: border 150ms, box-shadow 150ms

Suggestion Chips Container:
├─ Display: flex
├─ Flex Wrap: wrap
├─ Gap: 8px
├─ Margin Top: 16px
└─ Margin Bottom: 24px

Suggestion Chip:
├─ Height: 32px
├─ Background: #F3F4F6 (Gray 100)
├─ Border Radius: 16px (full)
├─ Padding: 0 12px
├─ Font: Pretendard Regular
├─ Size: 14px
├─ Color: #374151 (Gray 700)
├─ Cursor: pointer
├─ Hover Background: #E5E7EB (Gray 200)
└─ Transition: background 150ms

Section Header:
├─ Font: Pretendard SemiBold
├─ Size: 14px
├─ Color: #6B7280 (Gray 500)
├─ Display: flex
├─ Align Items: center
├─ Gap: 8px
├─ Margin Bottom: 12px
└─ Icon Size: 16×16px

Recent Search Item:
├─ Display: flex
├─ Justify Content: space-between
├─ Align Items: center
├─ Padding: 12px 0
├─ Border Bottom: 1px solid #F3F4F6 (Gray 100)
├─ Cursor: pointer
└─ Hover Background: #F9FAFB (Gray 50)

Recent Search Query:
├─ Font: Pretendard Regular
├─ Size: 15px
├─ Color: #111827 (Gray 900)
└─ Flex: 1

Recent Search Time:
├─ Font: Pretendard Regular
├─ Size: 13px
├─ Color: #9CA3AF (Gray 400)
└─ White Space: nowrap

Frequent Topic Item:
├─ Display: flex
├─ Justify Content: space-between
├─ Padding: 8px 0
├─ Font: Pretendard Regular
├─ Size: 14px
└─ Color: #374151 (Gray 700)

Frequency Badge:
├─ Background: #DBEAFE (Blue 100)
├─ Color: #1D4ED8 (Blue 700)
├─ Font: Pretendard Medium
├─ Size: 12px
├─ Padding: 2px 8px
└─ Border Radius: 12px
```

---

### 5.4 검색 결과 카드 고도화 (Part 5)

#### 레이아웃

```
┌──────────────────────────────────────────────────────────────┐
│  🔍 검색                                                      │
├──────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐    │
│  │ A사 예산                                              │ ✕ │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
│  결과 3건 (0.2초)                    [관련도순 ▼] [필터 ▼]   │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────────┐  │
│  │ 📋 A사 2차 미팅                              🏢 A사    │  │
│  │ 2025.12.29 (일) 14:00 • 김대표, 이과장                  │  │
│  │ ─────────────────────────────────────────────────────  │  │
│  │ 김대표: "**예산**은 Q1에 $50만 정도 생각하고 있어요.     │  │
│  │        다만 **예산** 확정은 내부 승인 후..."            │  │
│  │ ─────────────────────────────────────────────────────  │  │
│  │ 💡 결정: Q1 예산 $50만 (내부 승인 필요)                 │  │
│  │ 💡 언급: "예산" 3회                                    │  │
│  │                                           [상세 보기 →] │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ─ 그게 전부입니다 ─                                         │
└──────────────────────────────────────────────────────────────┘
```

#### 상세 스펙

```
Results Header:
├─ Display: flex
├─ Justify Content: space-between
├─ Align Items: center
├─ Padding: 12px 0
├─ Border Bottom: 1px solid #E5E7EB (Gray 200)
└─ Margin Bottom: 16px

Results Count:
├─ Font: Pretendard Regular
├─ Size: 14px
├─ Color: #6B7280 (Gray 500)
└─ Includes search time in parentheses

Filter/Sort Buttons:
├─ Display: flex
├─ Gap: 8px
└─ Align Items: center

Filter Button:
├─ Height: 32px
├─ Background: #FFFFFF
├─ Border: 1px solid #E5E7EB (Gray 200)
├─ Border Radius: 8px
├─ Padding: 0 12px
├─ Font: Pretendard Medium
├─ Size: 13px
├─ Color: #374151 (Gray 700)
├─ Display: flex
├─ Gap: 4px
├─ Align Items: center
├─ Icon: ChevronDown (16×16px)
├─ Cursor: pointer
└─ Hover Background: #F9FAFB (Gray 50)

Result Card (고도화):
├─ Background: #FFFFFF
├─ Border: 1px solid #E5E7EB (Gray 200)
├─ Border Radius: 12px (lg)
├─ Padding: 16px
├─ Margin Bottom: 12px
├─ Cursor: pointer
├─ Hover: Border #3B82F6 (Blue 500), Shadow 0 4px 12px rgba(0,0,0,0.08)
└─ Transition: all 200ms ease-out

Card Header:
├─ Display: flex
├─ Justify Content: space-between
├─ Align Items: flex-start
└─ Margin Bottom: 8px

Meeting Title:
├─ Font: Pretendard SemiBold
├─ Size: 16px
├─ Color: #111827 (Gray 900)
├─ Display: flex
├─ Gap: 8px
└─ Align Items: center

Company Badge:
├─ Background: #EFF6FF (Blue 50)
├─ Color: #1D4ED8 (Blue 700)
├─ Font: Pretendard Medium
├─ Size: 12px
├─ Padding: 4px 8px
├─ Border Radius: 6px
└─ White Space: nowrap

Meeting Meta:
├─ Font: Pretendard Regular
├─ Size: 13px
├─ Color: #6B7280 (Gray 500)
├─ Display: flex
├─ Gap: 8px
└─ Margin Bottom: 12px

Snippet Container:
├─ Background: #F9FAFB (Gray 50)
├─ Border Radius: 8px
├─ Padding: 12px
├─ Margin: 12px 0
└─ Font: Pretendard Regular

Snippet Text:
├─ Font: Pretendard Regular
├─ Size: 14px
├─ Color: #374151 (Gray 700)
├─ Line Height: 1.6
└─ Max Lines: 4 (overflow: hidden)

Highlight Span:
├─ Background: #FEF3C7 (Amber 100)
├─ Color: #92400E (Amber 800)
├─ Font Weight: 600 (SemiBold)
├─ Padding: 1px 4px
├─ Border Radius: 4px
└─ Box Decoration Break: clone

Decision Summary:
├─ Display: flex
├─ Gap: 8px
├─ Align Items: center
├─ Padding: 8px 0
├─ Font: Pretendard Regular
├─ Size: 14px
├─ Color: #374151 (Gray 700)
└─ Icon: 16×16px, Color: #10B981 (Green 500)

Mention Count:
├─ Font: Pretendard Regular
├─ Size: 13px
├─ Color: #6B7280 (Gray 500)
└─ Margin Left: auto

End of Results:
├─ Text Align: center
├─ Font: Pretendard Regular
├─ Size: 14px
├─ Color: #9CA3AF (Gray 400)
├─ Padding: 24px 0
└─ Border Top: 1px dashed #E5E7EB (Gray 200)
```

---

### 5.5 검색 상세 조회 (Part 5)

#### 레이아웃

```
┌──────────────────────────────────────────────────────────────┐
│  ← 검색 결과                    A사 2차 미팅                  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ 🔍 "A사 예산" 검색 결과 (2/3)      [◀ 이전] [다음 ▶]   │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│  📅 2025.12.29 (일) 14:00-15:30                              │
│  👥 김대표, 이과장 (A사) / 민수 (Onno)                        │
│  🏢 A사 | 딜 스테이지: 협상                                   │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│  ▼ 대화 내용                                                 │
│  ─────────────────────────────────────────────────────────   │
│  ...                                                         │
│                                                              │
│  ┌─ 검색 결과 ─────────────────────────────────────────────┐ │
│  │ 민수: "**예산** 관련해서 진행 상황이 어떻게 되셨나요?"   │ │
│  │                                                         │ │
│  │ 김대표: "**예산**은 Q1에 $50만 정도 생각하고 있어요.     │ │
│  │        다만 **예산** 확정은 내부 승인 후에 알려드릴게요" │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
│  ...                                                         │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│  💡 이 미팅의 결정사항                                        │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ ✓ Q1 **예산** $50만 (내부 승인 필요)                    │  │
│  │ ✓ 다음 미팅: 1월 2주차                                  │  │
│  │ ⚠ 리스크: 내부 승인 지연 가능성                         │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  🔗 관련 미팅                                                 │
│  ├─ A사 1차 미팅 (12.22) - "예산" 첫 논의                    │
│  └─ A사 3차 미팅 (예정) - 예산 확정 예정                     │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

#### 상세 스펙

```
Detail Header:
├─ Height: 56px
├─ Background: #FFFFFF
├─ Border Bottom: 1px solid #E5E7EB (Gray 200)
├─ Display: flex
├─ Justify Content: space-between
├─ Align Items: center
├─ Padding: 0 16px
├─ Position: sticky
├─ Top: 0
└─ z-index: 100

Back Button:
├─ Display: flex
├─ Align Items: center
├─ Gap: 8px
├─ Font: Pretendard Medium
├─ Size: 14px
├─ Color: #6B7280 (Gray 500)
├─ Icon: ArrowLeft (20×20px)
├─ Cursor: pointer
└─ Hover Color: #111827 (Gray 900)

Meeting Title (Header):
├─ Font: Pretendard SemiBold
├─ Size: 18px
├─ Color: #111827 (Gray 900)
└─ Text Align: center

Highlight Navigator:
├─ Background: #EFF6FF (Blue 50)
├─ Border: 1px solid #DBEAFE (Blue 200)
├─ Border Radius: 8px
├─ Padding: 8px 12px
├─ Display: flex
├─ Justify Content: space-between
├─ Align Items: center
├─ Margin: 16px
└─ Gap: 12px

Navigator Info:
├─ Display: flex
├─ Align Items: center
├─ Gap: 8px
├─ Font: Pretendard Regular
├─ Size: 14px
├─ Color: #1D4ED8 (Blue 700)
└─ Icon: 16×16px

Navigator Buttons:
├─ Display: flex
├─ Gap: 4px
└─ Align Items: center

Navigator Button:
├─ Width: 32px
├─ Height: 32px
├─ Background: #FFFFFF
├─ Border: 1px solid #DBEAFE (Blue 200)
├─ Border Radius: 6px
├─ Display: flex
├─ Justify Content: center
├─ Align Items: center
├─ Icon: 16×16px, Color: #3B82F6 (Blue 500)
├─ Cursor: pointer
├─ Hover Background: #DBEAFE (Blue 200)
├─ Disabled: Opacity 0.5, Cursor not-allowed
└─ Transition: background 150ms

Meeting Info Section:
├─ Background: #F9FAFB (Gray 50)
├─ Padding: 16px
├─ Border Bottom: 1px solid #E5E7EB (Gray 200)
└─ Display: flex flex-col gap-8px

Info Row:
├─ Display: flex
├─ Align Items: center
├─ Gap: 8px
├─ Font: Pretendard Regular
├─ Size: 14px
├─ Color: #374151 (Gray 700)
└─ Icon: 16×16px, Color: #6B7280 (Gray 500)

Highlight Box:
├─ Background: #FFFBEB (Amber 50)
├─ Border: 2px solid #FCD34D (Amber 300)
├─ Border Radius: 8px
├─ Padding: 12px 16px
├─ Margin: 8px 0
└─ Animation: fadeIn 300ms ease-out

Highlight Box Label:
├─ Font: Pretendard Medium
├─ Size: 12px
├─ Color: #B45309 (Amber 700)
├─ Background: #FEF3C7 (Amber 100)
├─ Padding: 2px 8px
├─ Border Radius: 4px
├─ Margin Bottom: 8px
└─ Display: inline-block

Transcript Line:
├─ Padding: 8px 0
├─ Font: Pretendard Regular
├─ Size: 15px
├─ Line Height: 1.7
└─ Color: #374151 (Gray 700)

Speaker Name:
├─ Font: Pretendard SemiBold
├─ Size: 14px
├─ Color: #111827 (Gray 900)
├─ Margin Right: 8px
└─ Display: inline

Decision Summary Box:
├─ Background: #ECFDF5 (Green 50)
├─ Border: 1px solid #A7F3D0 (Green 200)
├─ Border Radius: 8px
├─ Padding: 16px
└─ Margin: 16px 0

Decision Item:
├─ Display: flex
├─ Align Items: flex-start
├─ Gap: 8px
├─ Padding: 8px 0
└─ Border Bottom: 1px solid #D1FAE5 (Green 100)

Decision Icon:
├─ Width: 20px
├─ Height: 20px
├─ Flex Shrink: 0
├─ Color (decision): #10B981 (Green 500)
├─ Color (risk): #F59E0B (Amber 500)
└─ Color (action): #3B82F6 (Blue 500)

Related Meetings Section:
├─ Padding: 16px
├─ Border Top: 1px solid #E5E7EB (Gray 200)
└─ Background: #FFFFFF

Related Meeting Item:
├─ Display: flex
├─ Align Items: center
├─ Gap: 12px
├─ Padding: 12px
├─ Border: 1px solid #E5E7EB (Gray 200)
├─ Border Radius: 8px
├─ Margin Bottom: 8px
├─ Cursor: pointer
├─ Hover Border: #3B82F6 (Blue 500)
└─ Transition: border 150ms

Related Meeting Icon:
├─ Width: 40px
├─ Height: 40px
├─ Background: #F3F4F6 (Gray 100)
├─ Border Radius: 8px
├─ Display: flex
├─ Justify Content: center
├─ Align Items: center
└─ Icon: 20×20px, Color: #6B7280 (Gray 500)

Related Meeting Info:
├─ Flex: 1
└─ Display: flex flex-col

Related Meeting Title:
├─ Font: Pretendard Medium
├─ Size: 14px
├─ Color: #111827 (Gray 900)
└─ Margin Bottom: 4px

Related Meeting Description:
├─ Font: Pretendard Regular
├─ Size: 13px
└─ Color: #6B7280 (Gray 500)
```

---

### 5.6 검색 필터 패널 (Part 5)

#### 레이아웃

```
┌──────────────────────────────────────────────────────────────┐
│  필터                                               ✕        │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  기간                                                        │
│  ○ 전체  ● 최근 1주  ○ 최근 1개월  ○ 최근 3개월  ○ 직접선택  │
│                                                              │
│  ───────────────────────────────────────────────────────    │
│                                                              │
│  회사/딜                                                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 전체                                              ▼  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ───────────────────────────────────────────────────────    │
│                                                              │
│  참석자                                                      │
│  ┌─────────────┐ ┌─────────────┐                            │
│  │ 김대표    ✕ │ │ + 추가      │                            │
│  └─────────────┘ └─────────────┘                            │
│                                                              │
│  ───────────────────────────────────────────────────────    │
│                                                              │
│  결정 요소                                                    │
│  □ 결정  □ 액션  □ 리스크  □ 미확인                          │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│  [초기화]                                    [적용 (필터 3)] │
└──────────────────────────────────────────────────────────────┘
```

#### 상세 스펙

```
Filter Panel:
├─ Position: fixed
├─ Bottom: 0
├─ Left: 0
├─ Right: 0
├─ Background: #FFFFFF
├─ Border Radius: 16px 16px 0 0
├─ Box Shadow: 0 -4px 24px rgba(0, 0, 0, 0.15)
├─ z-index: 200
├─ Max Height: 70vh
├─ Overflow: auto
└─ Animation: slideUp 300ms ease-out

Panel Header:
├─ Display: flex
├─ Justify Content: space-between
├─ Align Items: center
├─ Padding: 16px 20px
├─ Border Bottom: 1px solid #E5E7EB (Gray 200)
└─ Position: sticky top-0

Panel Title:
├─ Font: Pretendard SemiBold
├─ Size: 18px
└─ Color: #111827 (Gray 900)

Close Button:
├─ Width: 32px
├─ Height: 32px
├─ Background: #F3F4F6 (Gray 100)
├─ Border Radius: 50%
├─ Display: flex
├─ Justify Content: center
├─ Align Items: center
├─ Icon: X (20×20px)
├─ Icon Color: #6B7280 (Gray 500)
└─ Cursor: pointer

Filter Section:
├─ Padding: 20px
└─ Border Bottom: 1px solid #F3F4F6 (Gray 100)

Section Label:
├─ Font: Pretendard SemiBold
├─ Size: 14px
├─ Color: #374151 (Gray 700)
└─ Margin Bottom: 12px

Radio Group:
├─ Display: flex
├─ Flex Wrap: wrap
├─ Gap: 12px
└─ Align Items: center

Radio Option:
├─ Display: flex
├─ Align Items: center
├─ Gap: 6px
├─ Cursor: pointer
└─ Font: Pretendard Regular Size 14px Color #374151

Radio Circle:
├─ Width: 18px
├─ Height: 18px
├─ Border: 2px solid #D1D5DB (Gray 300)
├─ Border Radius: 50%
├─ Display: flex
├─ Justify Content: center
└─ Align Items: center

Radio Circle (selected):
├─ Border Color: #3B82F6 (Blue 500)
└─ Inner Dot: 8px, Background #3B82F6

Select Dropdown:
├─ Width: 100%
├─ Height: 44px
├─ Background: #FFFFFF
├─ Border: 1px solid #E5E7EB (Gray 200)
├─ Border Radius: 8px
├─ Padding: 0 12px
├─ Display: flex
├─ Justify Content: space-between
├─ Align Items: center
├─ Cursor: pointer
├─ Font: Pretendard Regular
├─ Size: 15px
└─ Color: #111827 (Gray 900)

Person Tag:
├─ Background: #EFF6FF (Blue 50)
├─ Border: 1px solid #DBEAFE (Blue 200)
├─ Border Radius: 20px
├─ Padding: 6px 12px
├─ Display: inline-flex
├─ Align Items: center
├─ Gap: 6px
├─ Font: Pretendard Regular
├─ Size: 14px
└─ Color: #1D4ED8 (Blue 700)

Add Person Button:
├─ Border: 1px dashed #D1D5DB (Gray 300)
├─ Border Radius: 20px
├─ Padding: 6px 12px
├─ Display: inline-flex
├─ Align Items: center
├─ Gap: 4px
├─ Font: Pretendard Regular
├─ Size: 14px
├─ Color: #6B7280 (Gray 500)
├─ Cursor: pointer
└─ Hover Border: #3B82F6 (Blue 500)

Checkbox Group:
├─ Display: flex
├─ Flex Wrap: wrap
└─ Gap: 16px

Checkbox Item:
├─ Display: flex
├─ Align Items: center
├─ Gap: 8px
├─ Cursor: pointer
├─ Font: Pretendard Regular
├─ Size: 14px
└─ Color: #374151 (Gray 700)

Checkbox Box:
├─ Width: 18px
├─ Height: 18px
├─ Border: 2px solid #D1D5DB (Gray 300)
├─ Border Radius: 4px
├─ Background: #FFFFFF
└─ Transition: all 150ms

Checkbox Box (checked):
├─ Background: #3B82F6 (Blue 500)
├─ Border Color: #3B82F6
└─ Icon: Check (12×12px), Color #FFFFFF

Panel Footer:
├─ Padding: 16px 20px
├─ Border Top: 1px solid #E5E7EB (Gray 200)
├─ Display: flex
├─ Justify Content: space-between
├─ Align Items: center
├─ Position: sticky
├─ Bottom: 0
└─ Background: #FFFFFF

Reset Button:
├─ Background: transparent
├─ Border: none
├─ Font: Pretendard Medium
├─ Size: 14px
├─ Color: #6B7280 (Gray 500)
├─ Cursor: pointer
└─ Hover Color: #111827 (Gray 900)

Apply Button:
├─ Height: 44px
├─ Background: #3B82F6 (Blue 500)
├─ Border Radius: 8px
├─ Padding: 0 24px
├─ Font: Pretendard SemiBold
├─ Size: 15px
├─ Color: #FFFFFF
├─ Cursor: pointer
├─ Hover Background: #2563EB (Blue 600)
└─ Transition: background 150ms
```

---

### 5.7 검색 No Results 상태 (Part 5)

#### 레이아웃

```
┌──────────────────────────────────────────────────────────────┐
│  🔍 검색                                                      │
├──────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐    │
│  │ A사 예싼                                              │ ✕ │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│                    😕                                         │
│                                                              │
│           "A사 예싼" 검색 결과가 없습니다                      │
│                                                              │
│  ───────────────────────────────────────────────────────    │
│                                                              │
│  💡 이런 검색어를 시도해보세요:                               │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │ A사 예산    │  │ A사         │  │ 예산        │          │
│  │ (오타 수정) │  │             │  │             │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
│                                                              │
│  ───────────────────────────────────────────────────────    │
│                                                              │
│  📅 기간 제한 없이 검색                                       │
│  현재 최근 3개월만 검색 중입니다                              │
│  [전체 기간 검색]                                            │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

#### 상세 스펙

```
No Results Container:
├─ Display: flex
├─ Flex Direction: column
├─ Align Items: center
├─ Padding: 48px 20px
└─ Text Align: center

Empty Icon:
├─ Size: 64×64px
├─ Color: #D1D5DB (Gray 300)
└─ Margin Bottom: 16px

No Results Message:
├─ Font: Pretendard Regular
├─ Size: 16px
├─ Color: #374151 (Gray 700)
└─ Margin Bottom: 24px

Query Highlight:
├─ Font: Pretendard SemiBold
└─ Color: #111827 (Gray 900)

Suggestion Section:
├─ Width: 100%
├─ Padding: 24px
├─ Background: #F9FAFB (Gray 50)
├─ Border Radius: 12px
└─ Margin Bottom: 16px

Suggestion Label:
├─ Display: flex
├─ Align Items: center
├─ Gap: 8px
├─ Font: Pretendard Medium
├─ Size: 14px
├─ Color: #6B7280 (Gray 500)
├─ Icon: 16×16px
└─ Margin Bottom: 12px

Suggestion Chip:
├─ Background: #FFFFFF
├─ Border: 1px solid #E5E7EB (Gray 200)
├─ Border Radius: 8px
├─ Padding: 12px 16px
├─ Cursor: pointer
├─ Hover Border: #3B82F6 (Blue 500)
└─ Transition: border 150ms

Chip Main Text:
├─ Font: Pretendard Medium
├─ Size: 14px
├─ Color: #111827 (Gray 900)
└─ Margin Bottom: 4px

Chip Subtitle:
├─ Font: Pretendard Regular
├─ Size: 12px
└─ Color: #9CA3AF (Gray 400)

Expand Search Section:
├─ Width: 100%
├─ Padding: 16px
├─ Background: #FEF3C7 (Amber 100)
├─ Border: 1px solid #FCD34D (Amber 300)
├─ Border Radius: 8px
├─ Text Align: left
└─ Display: flex flex-col gap-8px

Expand Icon:
├─ Size: 20×20px
└─ Color: #B45309 (Amber 700)

Expand Title:
├─ Font: Pretendard SemiBold
├─ Size: 14px
└─ Color: #92400E (Amber 800)

Expand Description:
├─ Font: Pretendard Regular
├─ Size: 13px
└─ Color: #B45309 (Amber 700)

Expand Button:
├─ Height: 36px
├─ Background: #FFFFFF
├─ Border: 1px solid #FCD34D (Amber 300)
├─ Border Radius: 6px
├─ Padding: 0 16px
├─ Font: Pretendard Medium
├─ Size: 14px
├─ Color: #92400E (Amber 800)
├─ Cursor: pointer
├─ Hover Background: #FEF3C7 (Amber 100)
└─ Margin Top: 8px
```

### 5.8 설정 메인 화면 (Part 5.2)

설정 화면은 **"빠르게 찾고, 빠르게 나가기"**를 원칙으로 설계됩니다.

#### 레이아웃

```
┌─────────────────────────────────────────────────┐
│  [←] 설정                             [🔍]      │  ← Header (56px)
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ 👤                                      │   │  ← Profile Section
│  │    민수님                                │   │
│  │    minsu@company.com                    │   │
│  │    [프로필 편집]                         │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  📊 사용 요약                                   │  ← Stats Section
│  ├─ 총 미팅 127건                              │
│  ├─ 이번 달 15건                               │
│  └─ 저장된 인사이트 342개                       │
│                                                 │
├─────────────────────────────────────────────────┤
│  🔗 통합                                   [>]  │  ← Category List
│  🔔 알림                                   [>]  │
│  🎨 HUD 설정                               [>]  │
│  💳 구독                                   [>]  │
│  🔒 개인정보 및 보안                        [>]  │
│  📁 데이터 관리                            [>]  │
│  ❓ 도움말                                 [>]  │
├─────────────────────────────────────────────────┤
│  🚪 로그아웃                                    │  ← Danger Zone
│                                                 │
│  Onno v1.0.0                                    │  ← Footer
└─────────────────────────────────────────────────┘
```

#### 상세 스펙

```
Settings Container:
├─ Width: 100%
├─ Height: 100vh
├─ Background: #F9FAFB (Gray 50)
└─ Display: flex flex-col

Settings Header:
├─ Height: 56px
├─ Background: #FFFFFF
├─ Border Bottom: 1px solid #E5E7EB (Gray 200)
├─ Padding: 0 16px
├─ Display: flex
├─ Align Items: center
├─ Justify Content: space-between
└─ Position: sticky
    Top: 0
    z-index: 100

Back Button:
├─ Size: 40×40px
├─ Background: transparent
├─ Border: none
├─ Display: flex
├─ Align Items: center
├─ Justify Content: center
├─ Cursor: pointer
└─ Hover Background: #F3F4F6 (Gray 100)

Back Icon:
├─ Size: 24×24px
└─ Color: #374151 (Gray 700)

Header Title:
├─ Font: Pretendard SemiBold
├─ Size: 18px
├─ Color: #111827 (Gray 900)
└─ Flex: 1

Search Button:
├─ Size: 40×40px
├─ Background: transparent
├─ Border: none
├─ Display: flex
├─ Align Items: center
├─ Justify Content: center
├─ Cursor: pointer
└─ Hover Background: #F3F4F6 (Gray 100)

Profile Section:
├─ Width: 100%
├─ Padding: 24px 16px
├─ Background: #FFFFFF
├─ Border Bottom: 1px solid #E5E7EB (Gray 200)
├─ Display: flex
├─ Flex Direction: column
├─ Align Items: center
└─ Gap: 12px

Profile Avatar:
├─ Size: 80×80px
├─ Border Radius: 40px (50%)
├─ Background: #3B82F6 (Blue 500)
├─ Display: flex
├─ Align Items: center
├─ Justify Content: center
├─ Font: Pretendard Bold
├─ Font Size: 32px
├─ Color: #FFFFFF
└─ Fallback Icon: 24×24px

Profile Name:
├─ Font: Pretendard SemiBold
├─ Size: 20px
├─ Color: #111827 (Gray 900)
└─ Margin Top: 4px

Profile Email:
├─ Font: Pretendard Regular
├─ Size: 14px
├─ Color: #6B7280 (Gray 500)
└─ Margin Top: 2px

Edit Profile Button:
├─ Height: 36px
├─ Padding: 0 16px
├─ Background: #FFFFFF
├─ Border: 1px solid #E5E7EB (Gray 200)
├─ Border Radius: 8px
├─ Font: Pretendard Medium
├─ Size: 14px
├─ Color: #374151 (Gray 700)
├─ Cursor: pointer
├─ Margin Top: 8px
└─ Hover:
    Background: #F9FAFB (Gray 50)
    Border Color: #D1D5DB (Gray 300)

Stats Section:
├─ Width: 100%
├─ Padding: 16px
├─ Background: #FFFFFF
├─ Border Bottom: 8px solid #F3F4F6 (Gray 100)
└─ Display: flex flex-col gap-8px

Stats Title:
├─ Font: Pretendard SemiBold
├─ Size: 14px
├─ Color: #6B7280 (Gray 500)
└─ Margin Bottom: 4px

Stats Item:
├─ Display: flex
├─ Justify Content: space-between
├─ Align Items: center
└─ Padding: 4px 0

Stats Label:
├─ Font: Pretendard Regular
├─ Size: 14px
└─ Color: #374151 (Gray 700)

Stats Value:
├─ Font: Pretendard SemiBold
├─ Size: 14px
└─ Color: #111827 (Gray 900)

Category List:
├─ Width: 100%
├─ Background: #FFFFFF
└─ Display: flex flex-col

Category Item:
├─ Width: 100%
├─ Height: 56px
├─ Padding: 0 16px
├─ Background: #FFFFFF
├─ Border Bottom: 1px solid #F3F4F6 (Gray 100)
├─ Display: flex
├─ Align Items: center
├─ Gap: 12px
├─ Cursor: pointer
└─ Transition: 200ms

Category Item Hover:
└─ Background: #F9FAFB (Gray 50)

Category Icon:
├─ Size: 24×24px
└─ Color: #6B7280 (Gray 500)

Category Label:
├─ Flex: 1
├─ Font: Pretendard Medium
├─ Size: 15px
└─ Color: #111827 (Gray 900)

Category Badge (Optional):
├─ Padding: 2px 8px
├─ Background: #DBEAFE (Blue 100)
├─ Border Radius: 10px
├─ Font: Pretendard Medium
├─ Size: 11px
└─ Color: #1D4ED8 (Blue 700)

Category Arrow:
├─ Size: 20×20px
└─ Color: #9CA3AF (Gray 400)

Danger Zone (Logout):
├─ Width: 100%
├─ Height: 56px
├─ Padding: 0 16px
├─ Background: #FFFFFF
├─ Margin Top: 8px
├─ Display: flex
├─ Align Items: center
├─ Gap: 12px
├─ Cursor: pointer
└─ Border Bottom: 1px solid #F3F4F6

Logout Icon:
├─ Size: 24×24px
└─ Color: #EF4444 (Red 500)

Logout Label:
├─ Font: Pretendard Medium
├─ Size: 15px
└─ Color: #EF4444 (Red 500)

Footer Version:
├─ Width: 100%
├─ Padding: 24px 16px
├─ Text Align: center
├─ Font: Pretendard Regular
├─ Size: 12px
└─ Color: #9CA3AF (Gray 400)
```

### 5.9 통합 관리 화면 (Part 5.2)

#### 레이아웃

```
┌─────────────────────────────────────────────────┐
│  [←] 통합                                        │
├─────────────────────────────────────────────────┤
│                                                 │
│  연결됨                                          │
│  ┌─────────────────────────────────────────┐   │
│  │ 📓 Notion                               │   │
│  │    워크스페이스: Onno Team               │   │
│  │    저장 위치: /Meetings                  │   │
│  │    마지막 동기화: 2분 전                  │   │
│  │    ┌──────────┐ ┌──────────┐            │   │
│  │    │ 설정 변경 │ │ 연결 해제 │            │   │
│  │    └──────────┘ └──────────┘            │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ 📅 Google Calendar                       │   │
│  │    계정: minsu@gmail.com                 │   │
│  │    동기화: 양방향                         │   │
│  │    ┌──────────┐ ┌──────────┐            │   │
│  │    │ 설정 변경 │ │ 연결 해제 │            │   │
│  │    └──────────┘ └──────────┘            │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  연결 가능                                       │
│  ┌─────────────────────────────────────────┐   │
│  │ 📅 Outlook Calendar          [연결하기]  │   │
│  │    Microsoft 캘린더와 연동               │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  출시 예정                                       │
│  ┌─────────────────────────────────────────┐   │
│  │ 💬 Slack                    [Coming Soon]│   │
│  │    미팅 요약을 채널에 자동 공유           │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ 📊 Salesforce               [Coming Soon]│   │
│  │    CRM과 미팅 데이터 자동 연동            │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
└─────────────────────────────────────────────────┘
```

#### 상세 스펙

```
Integration Container:
├─ Width: 100%
├─ Min Height: 100vh
├─ Background: #F9FAFB (Gray 50)
├─ Padding: 16px
└─ Display: flex flex-col gap-24px

Section Title:
├─ Font: Pretendard SemiBold
├─ Size: 13px
├─ Color: #6B7280 (Gray 500)
├─ Text Transform: uppercase
├─ Letter Spacing: 0.5px
└─ Margin Bottom: 8px

Connected Card:
├─ Width: 100%
├─ Padding: 16px
├─ Background: #FFFFFF
├─ Border: 1px solid #E5E7EB (Gray 200)
├─ Border Radius: 12px
├─ Display: flex flex-col gap-12px
└─ Box Shadow: 0 1px 3px rgba(0,0,0,0.05)

Connected Card Header:
├─ Display: flex
├─ Align Items: center
└─ Gap: 12px

Integration Icon Container:
├─ Size: 48×48px
├─ Background: #F3F4F6 (Gray 100)
├─ Border Radius: 10px
├─ Display: flex
├─ Align Items: center
└─ Justify Content: center

Integration Icon:
├─ Size: 28×28px
└─ Color: varies by type

Integration Name:
├─ Font: Pretendard SemiBold
├─ Size: 16px
└─ Color: #111827 (Gray 900)

Connected Badge:
├─ Padding: 2px 8px
├─ Background: #D1FAE5 (Green 100)
├─ Border Radius: 10px
├─ Font: Pretendard Medium
├─ Size: 11px
└─ Color: #047857 (Green 700)

Connection Details:
├─ Display: flex flex-col gap-4px
├─ Padding Left: 60px
└─ Font: Pretendard Regular

Detail Row:
├─ Display: flex
├─ Gap: 8px
├─ Font Size: 13px
└─ Color: #6B7280 (Gray 500)

Detail Label:
├─ Color: #9CA3AF (Gray 400)
└─ Min Width: 80px

Detail Value:
└─ Color: #374151 (Gray 700)

Last Sync (Success):
├─ Display: flex
├─ Align Items: center
├─ Gap: 4px
├─ Color: #059669 (Green 600)
└─ Font Size: 12px

Card Actions:
├─ Display: flex
├─ Gap: 8px
├─ Padding Left: 60px
└─ Margin Top: 4px

Settings Change Button:
├─ Height: 32px
├─ Padding: 0 12px
├─ Background: #FFFFFF
├─ Border: 1px solid #E5E7EB (Gray 200)
├─ Border Radius: 6px
├─ Font: Pretendard Medium
├─ Size: 13px
├─ Color: #374151 (Gray 700)
├─ Cursor: pointer
└─ Hover:
    Background: #F9FAFB
    Border Color: #D1D5DB

Disconnect Button:
├─ Height: 32px
├─ Padding: 0 12px
├─ Background: #FFFFFF
├─ Border: 1px solid #FCA5A5 (Red 300)
├─ Border Radius: 6px
├─ Font: Pretendard Medium
├─ Size: 13px
├─ Color: #DC2626 (Red 600)
├─ Cursor: pointer
└─ Hover:
    Background: #FEF2F2 (Red 50)
    Border Color: #F87171 (Red 400)

Available Card:
├─ Width: 100%
├─ Padding: 16px
├─ Background: #FFFFFF
├─ Border: 1px solid #E5E7EB (Gray 200)
├─ Border Radius: 12px
├─ Display: flex
├─ Align Items: center
├─ Gap: 12px
└─ Cursor: pointer

Available Card Hover:
├─ Border Color: #3B82F6 (Blue 500)
└─ Background: #F0F9FF (Blue 50)

Connect Button:
├─ Height: 36px
├─ Padding: 0 16px
├─ Background: #3B82F6 (Blue 500)
├─ Border: none
├─ Border Radius: 8px
├─ Font: Pretendard SemiBold
├─ Size: 14px
├─ Color: #FFFFFF
├─ Cursor: pointer
├─ Margin Left: auto
└─ Hover:
    Background: #2563EB (Blue 600)

Coming Soon Card:
├─ Width: 100%
├─ Padding: 16px
├─ Background: #F9FAFB (Gray 50)
├─ Border: 1px dashed #D1D5DB (Gray 300)
├─ Border Radius: 12px
├─ Display: flex
├─ Align Items: center
├─ Gap: 12px
├─ Opacity: 0.8
└─ Cursor: pointer

Coming Soon Badge:
├─ Padding: 4px 10px
├─ Background: #F3F4F6 (Gray 100)
├─ Border Radius: 12px
├─ Font: Pretendard Medium
├─ Size: 12px
├─ Color: #6B7280 (Gray 500)
└─ Margin Left: auto

Coming Soon Card Hover:
└─ Border Color: #9CA3AF (Gray 400)
```

### 5.10 알림 설정 화면 (Part 5.2)

#### 레이아웃

```
┌─────────────────────────────────────────────────┐
│  [←] 알림                                        │
├─────────────────────────────────────────────────┤
│                                                 │
│  알림 빈도                                       │
│  ┌─────────────────────────────────────────┐   │
│  │ 적음     ●───────────────○─────○ 많음    │   │
│  │          ↑                              │   │
│  │       현재 설정                          │   │
│  └─────────────────────────────────────────┘   │
│  💡 하루 평균 3-5개 알림                         │
│                                                 │
├─────────────────────────────────────────────────┤
│  미팅 전                                    [⌄] │
├─────────────────────────────────────────────────┤
│  │  준비 리마인더                    [● ON]     │
│  │  └─ 알림 시점: [10분 전 ▼]                   │
│  │                                              │
│  │  일정 변경 알림                   [● ON]     │
│  │                                              │
├─────────────────────────────────────────────────┤
│  미팅 중                                    [⌄] │
├─────────────────────────────────────────────────┤
│  │  AI 인사이트                      [● ON]     │
│  │  갭 감지 알림                     [● ON]     │
│  │  위험 신호 알림                   [● ON]     │
│  │                                              │
├─────────────────────────────────────────────────┤
│  미팅 후                                    [⌄] │
├─────────────────────────────────────────────────┤
│  │  확정 리마인더                    [● ON]     │
│  │  └─ 알림 시점: [1시간 후 ▼]                  │
│  │                                              │
│  │  액션 아이템 리마인더             [● ON]     │
│  │                                              │
├─────────────────────────────────────────────────┤
│  방해 금지                                       │
│  ┌─────────────────────────────────────────┐   │
│  │ 🌙                           [○ OFF]    │   │
│  │    22:00 - 08:00                        │   │
│  │    이 시간에는 알림을 보내지 않아요       │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
└─────────────────────────────────────────────────┘
```

#### 상세 스펙

```
Notification Container:
├─ Width: 100%
├─ Min Height: 100vh
├─ Background: #F9FAFB (Gray 50)
└─ Display: flex flex-col

Frequency Section:
├─ Width: 100%
├─ Padding: 20px 16px
├─ Background: #FFFFFF
├─ Border Bottom: 8px solid #F3F4F6
└─ Display: flex flex-col gap-12px

Frequency Title:
├─ Font: Pretendard SemiBold
├─ Size: 15px
└─ Color: #111827 (Gray 900)

Slider Container:
├─ Width: 100%
├─ Height: 48px
├─ Position: relative
└─ Display: flex align-items-center

Slider Track:
├─ Width: 100%
├─ Height: 4px
├─ Background: #E5E7EB (Gray 200)
├─ Border Radius: 2px
└─ Position: relative

Slider Track Filled:
├─ Height: 4px
├─ Background: #3B82F6 (Blue 500)
├─ Border Radius: 2px
└─ Position: absolute left-0

Slider Thumb:
├─ Size: 24×24px
├─ Background: #FFFFFF
├─ Border: 2px solid #3B82F6 (Blue 500)
├─ Border Radius: 12px
├─ Box Shadow: 0 2px 4px rgba(0,0,0,0.1)
├─ Cursor: grab
└─ Position: absolute

Slider Labels:
├─ Display: flex
├─ Justify Content: space-between
├─ Font: Pretendard Regular
├─ Size: 13px
└─ Color: #9CA3AF (Gray 400)

Frequency Hint:
├─ Display: flex
├─ Align Items: center
├─ Gap: 6px
├─ Padding: 8px 12px
├─ Background: #EFF6FF (Blue 50)
├─ Border Radius: 8px
├─ Font: Pretendard Regular
├─ Size: 13px
└─ Color: #1D4ED8 (Blue 700)

Category Section:
├─ Width: 100%
├─ Background: #FFFFFF
└─ Border Bottom: 1px solid #E5E7EB

Category Header:
├─ Width: 100%
├─ Height: 52px
├─ Padding: 0 16px
├─ Display: flex
├─ Align Items: center
├─ Justify Content: space-between
├─ Cursor: pointer
└─ Background: #FFFFFF

Category Header Hover:
└─ Background: #F9FAFB (Gray 50)

Category Title:
├─ Font: Pretendard SemiBold
├─ Size: 15px
└─ Color: #111827 (Gray 900)

Expand Icon:
├─ Size: 20×20px
├─ Color: #9CA3AF (Gray 400)
└─ Transition: transform 200ms

Category Content (Expanded):
├─ Width: 100%
├─ Padding: 0 16px 16px 16px
└─ Display: flex flex-col gap-4px

Notification Item:
├─ Width: 100%
├─ Padding: 12px 0
├─ Display: flex
├─ Align Items: center
├─ Justify Content: space-between
└─ Border Bottom: 1px solid #F3F4F6 (Gray 100)

Notification Item (Last):
└─ Border Bottom: none

Notification Label:
├─ Font: Pretendard Medium
├─ Size: 14px
└─ Color: #374151 (Gray 700)

Notification Description:
├─ Font: Pretendard Regular
├─ Size: 12px
├─ Color: #9CA3AF (Gray 400)
└─ Margin Top: 2px

Toggle Switch:
├─ Width: 44px
├─ Height: 24px
├─ Background: #E5E7EB (Gray 200) [OFF]
├─ Background: #3B82F6 (Blue 500) [ON]
├─ Border Radius: 12px
├─ Cursor: pointer
├─ Transition: background 200ms
└─ Position: relative

Toggle Knob:
├─ Size: 20×20px
├─ Background: #FFFFFF
├─ Border Radius: 10px
├─ Box Shadow: 0 1px 3px rgba(0,0,0,0.2)
├─ Position: absolute
├─ Top: 2px
├─ Left: 2px [OFF]
├─ Left: 22px [ON]
└─ Transition: left 200ms

Time Selector:
├─ Margin Left: 24px
├─ Margin Top: 4px
├─ Display: flex
├─ Align Items: center
└─ Gap: 8px

Time Select Dropdown:
├─ Height: 32px
├─ Padding: 0 12px
├─ Background: #F3F4F6 (Gray 100)
├─ Border: 1px solid #E5E7EB (Gray 200)
├─ Border Radius: 6px
├─ Font: Pretendard Regular
├─ Size: 13px
├─ Color: #374151 (Gray 700)
└─ Cursor: pointer

DND Section:
├─ Width: 100%
├─ Padding: 16px
├─ Background: #FFFFFF
├─ Margin Top: 8px
└─ Display: flex flex-col gap-8px

DND Card:
├─ Width: 100%
├─ Padding: 16px
├─ Background: #F9FAFB (Gray 50)
├─ Border: 1px solid #E5E7EB (Gray 200)
├─ Border Radius: 12px
├─ Display: flex
└─ Gap: 12px

DND Icon:
├─ Size: 24×24px
└─ Color: #6366F1 (Indigo 500)

DND Content:
├─ Flex: 1
└─ Display: flex flex-col gap-4px

DND Title:
├─ Font: Pretendard SemiBold
├─ Size: 14px
└─ Color: #111827 (Gray 900)

DND Time:
├─ Font: Pretendard Regular
├─ Size: 13px
└─ Color: #6B7280 (Gray 500)

DND Description:
├─ Font: Pretendard Regular
├─ Size: 12px
└─ Color: #9CA3AF (Gray 400)
```

### 5.11 Notion 설정 모달 (Part 5.2)

#### 레이아웃

```
┌─────────────────────────────────────────────────┐
│  Notion 설정                              [×]   │
├─────────────────────────────────────────────────┤
│                                                 │
│  저장 위치                                       │
│  ┌─────────────────────────────────────────┐   │
│  │ 📁 /Meetings                        [▼] │   │
│  └─────────────────────────────────────────┘   │
│  미팅 기록이 저장될 Notion 페이지               │
│                                                 │
│  저장 옵션                                       │
│  ├─ ☑ 미팅 종료 시 자동 저장                    │
│  ├─ ☑ 전사 내용 포함                            │
│  └─ ☐ 참석자 정보 포함                          │
│                                                 │
│  템플릿                                          │
│  ┌─────────────────────────────────────────┐   │
│  │ 기본 미팅 템플릿                    [▼] │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│        ┌──────────┐   ┌──────────────┐         │
│        │   취소   │   │     저장     │         │
│        └──────────┘   └──────────────┘         │
└─────────────────────────────────────────────────┘
```

#### 상세 스펙

```
Modal Overlay:
├─ Position: fixed
├─ Top: 0
├─ Left: 0
├─ Width: 100vw
├─ Height: 100vh
├─ Background: rgba(0, 0, 0, 0.5)
├─ Display: flex
├─ Align Items: center
├─ Justify Content: center
└─ z-index: 1000

Modal Container:
├─ Width: 420px
├─ Max Height: 80vh
├─ Background: #FFFFFF
├─ Border Radius: 16px
├─ Box Shadow: 0 25px 50px rgba(0,0,0,0.25)
├─ Display: flex flex-col
└─ Overflow: hidden

Modal Header:
├─ Height: 56px
├─ Padding: 0 20px
├─ Border Bottom: 1px solid #E5E7EB (Gray 200)
├─ Display: flex
├─ Align Items: center
└─ Justify Content: space-between

Modal Title:
├─ Font: Pretendard SemiBold
├─ Size: 18px
└─ Color: #111827 (Gray 900)

Close Button:
├─ Size: 32×32px
├─ Background: transparent
├─ Border: none
├─ Border Radius: 8px
├─ Display: flex
├─ Align Items: center
├─ Justify Content: center
├─ Cursor: pointer
└─ Hover Background: #F3F4F6 (Gray 100)

Modal Content:
├─ Flex: 1
├─ Padding: 20px
├─ Overflow Y: auto
└─ Display: flex flex-col gap-24px

Form Group:
└─ Display: flex flex-col gap-8px

Form Label:
├─ Font: Pretendard SemiBold
├─ Size: 14px
└─ Color: #374151 (Gray 700)

Form Select:
├─ Width: 100%
├─ Height: 44px
├─ Padding: 0 16px
├─ Background: #FFFFFF
├─ Border: 1px solid #E5E7EB (Gray 200)
├─ Border Radius: 8px
├─ Font: Pretendard Regular
├─ Size: 14px
├─ Color: #111827 (Gray 900)
├─ Cursor: pointer
├─ Appearance: none
└─ Background Image: dropdown arrow

Form Select Focus:
├─ Border Color: #3B82F6 (Blue 500)
└─ Box Shadow: 0 0 0 3px rgba(59,130,246,0.1)

Form Hint:
├─ Font: Pretendard Regular
├─ Size: 12px
└─ Color: #9CA3AF (Gray 400)

Checkbox Group:
└─ Display: flex flex-col gap-12px

Checkbox Item:
├─ Display: flex
├─ Align Items: center
├─ Gap: 12px
└─ Cursor: pointer

Checkbox:
├─ Size: 20×20px
├─ Background: #FFFFFF [unchecked]
├─ Background: #3B82F6 (Blue 500) [checked]
├─ Border: 2px solid #E5E7EB (Gray 200) [unchecked]
├─ Border: 2px solid #3B82F6 (Blue 500) [checked]
├─ Border Radius: 4px
├─ Display: flex
├─ Align Items: center
└─ Justify Content: center

Checkbox Icon:
├─ Size: 14×14px
├─ Color: #FFFFFF
└─ Display: none [unchecked]

Checkbox Label:
├─ Font: Pretendard Regular
├─ Size: 14px
└─ Color: #374151 (Gray 700)

Modal Footer:
├─ Padding: 16px 20px
├─ Border Top: 1px solid #E5E7EB (Gray 200)
├─ Display: flex
├─ Gap: 12px
└─ Justify Content: flex-end

Cancel Button:
├─ Height: 40px
├─ Padding: 0 20px
├─ Background: #FFFFFF
├─ Border: 1px solid #E5E7EB (Gray 200)
├─ Border Radius: 8px
├─ Font: Pretendard Medium
├─ Size: 14px
├─ Color: #374151 (Gray 700)
├─ Cursor: pointer
└─ Hover:
    Background: #F9FAFB
    Border Color: #D1D5DB

Save Button:
├─ Height: 40px
├─ Padding: 0 20px
├─ Background: #3B82F6 (Blue 500)
├─ Border: none
├─ Border Radius: 8px
├─ Font: Pretendard SemiBold
├─ Size: 14px
├─ Color: #FFFFFF
├─ Cursor: pointer
└─ Hover:
    Background: #2563EB (Blue 600)
```

### 5.12 연결 해제 확인 다이얼로그 (Part 5.2)

#### 레이아웃

```
┌─────────────────────────────────────────────────┐
│                                                 │
│              ⚠️                                 │
│                                                 │
│     연결을 해제하시겠어요?                        │
│                                                 │
│     Notion 연결을 해제하면 미팅 내용이            │
│     더 이상 자동으로 저장되지 않아요.             │
│                                                 │
│     기존에 저장된 내용은 Notion에 유지돼요.        │
│                                                 │
│        ┌──────────────┐ ┌──────────────┐       │
│        │    취소      │ │   연결 해제   │       │
│        └──────────────┘ └──────────────┘       │
│                                                 │
└─────────────────────────────────────────────────┘
```

#### 상세 스펙

```
Dialog Container:
├─ Width: 360px
├─ Padding: 24px
├─ Background: #FFFFFF
├─ Border Radius: 16px
├─ Box Shadow: 0 25px 50px rgba(0,0,0,0.25)
└─ Display: flex flex-col align-items-center

Warning Icon Container:
├─ Size: 56×56px
├─ Background: #FEF3C7 (Amber 100)
├─ Border Radius: 28px (50%)
├─ Display: flex
├─ Align Items: center
├─ Justify Content: center
└─ Margin Bottom: 16px

Warning Icon:
├─ Size: 28×28px
└─ Color: #D97706 (Amber 600)

Dialog Title:
├─ Font: Pretendard SemiBold
├─ Size: 18px
├─ Color: #111827 (Gray 900)
├─ Text Align: center
└─ Margin Bottom: 8px

Dialog Description:
├─ Font: Pretendard Regular
├─ Size: 14px
├─ Color: #6B7280 (Gray 500)
├─ Text Align: center
├─ Line Height: 1.5
└─ Margin Bottom: 24px

Dialog Actions:
├─ Display: flex
├─ Gap: 12px
└─ Width: 100%

Cancel Button:
├─ Flex: 1
├─ Height: 44px
├─ Background: #FFFFFF
├─ Border: 1px solid #E5E7EB (Gray 200)
├─ Border Radius: 8px
├─ Font: Pretendard Medium
├─ Size: 14px
├─ Color: #374151 (Gray 700)
├─ Cursor: pointer
└─ Hover:
    Background: #F9FAFB
    Border Color: #D1D5DB

Disconnect Confirm Button:
├─ Flex: 1
├─ Height: 44px
├─ Background: #EF4444 (Red 500)
├─ Border: none
├─ Border Radius: 8px
├─ Font: Pretendard SemiBold
├─ Size: 14px
├─ Color: #FFFFFF
├─ Cursor: pointer
└─ Hover:
    Background: #DC2626 (Red 600)
```

### 5.13 프로필 편집 화면 (Part 5.2)

#### 레이아웃

```
┌─────────────────────────────────────────────────┐
│  [×] 프로필 편집                        [저장]  │
├─────────────────────────────────────────────────┤
│                                                 │
│              ┌──────────┐                       │
│              │    👤    │                       │
│              │  [편집]  │                       │
│              └──────────┘                       │
│                                                 │
│  이름                                           │
│  ┌─────────────────────────────────────────┐   │
│  │ 민수                                    │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  이메일                                         │
│  ┌─────────────────────────────────────────┐   │
│  │ minsu@company.com              [✓ 인증됨]│   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  회사                                           │
│  ┌─────────────────────────────────────────┐   │
│  │ Onno Inc.                               │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  직함                                           │
│  ┌─────────────────────────────────────────┐   │
│  │ 투자심사역                               │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
└─────────────────────────────────────────────────┘
```

#### 상세 스펙

```
Profile Edit Container:
├─ Width: 100%
├─ Min Height: 100vh
├─ Background: #F9FAFB (Gray 50)
└─ Display: flex flex-col

Profile Edit Header:
├─ Height: 56px
├─ Background: #FFFFFF
├─ Border Bottom: 1px solid #E5E7EB (Gray 200)
├─ Padding: 0 16px
├─ Display: flex
├─ Align Items: center
├─ Justify Content: space-between
└─ Position: sticky top-0 z-100

Close Button:
├─ Size: 40×40px
├─ Background: transparent
├─ Border: none
└─ Display: flex align-items-center justify-content-center

Header Title:
├─ Flex: 1
├─ Font: Pretendard SemiBold
├─ Size: 18px
├─ Color: #111827 (Gray 900)
└─ Text Align: center

Save Button (Header):
├─ Height: 36px
├─ Padding: 0 16px
├─ Background: #3B82F6 (Blue 500)
├─ Border: none
├─ Border Radius: 8px
├─ Font: Pretendard SemiBold
├─ Size: 14px
├─ Color: #FFFFFF
└─ Cursor: pointer

Save Button Disabled:
├─ Background: #E5E7EB (Gray 200)
├─ Color: #9CA3AF (Gray 400)
└─ Cursor: not-allowed

Avatar Section:
├─ Width: 100%
├─ Padding: 32px 16px
├─ Background: #FFFFFF
├─ Display: flex flex-col
├─ Align Items: center
└─ Border Bottom: 8px solid #F3F4F6

Avatar Container:
├─ Position: relative
└─ Display: inline-block

Avatar Image:
├─ Size: 100×100px
├─ Border Radius: 50px (50%)
├─ Object Fit: cover
└─ Background: #E5E7EB (placeholder)

Avatar Edit Button:
├─ Position: absolute
├─ Bottom: 0
├─ Right: 0
├─ Size: 32×32px
├─ Background: #FFFFFF
├─ Border: 2px solid #E5E7EB (Gray 200)
├─ Border Radius: 16px
├─ Display: flex
├─ Align Items: center
├─ Justify Content: center
├─ Cursor: pointer
└─ Box Shadow: 0 2px 4px rgba(0,0,0,0.1)

Avatar Edit Icon:
├─ Size: 16×16px
└─ Color: #374151 (Gray 700)

Form Section:
├─ Width: 100%
├─ Padding: 16px
├─ Background: #FFFFFF
└─ Display: flex flex-col gap-20px

Form Field:
└─ Display: flex flex-col gap-6px

Form Label:
├─ Font: Pretendard SemiBold
├─ Size: 14px
└─ Color: #374151 (Gray 700)

Form Input:
├─ Width: 100%
├─ Height: 48px
├─ Padding: 0 16px
├─ Background: #FFFFFF
├─ Border: 1px solid #E5E7EB (Gray 200)
├─ Border Radius: 10px
├─ Font: Pretendard Regular
├─ Size: 15px
└─ Color: #111827 (Gray 900)

Form Input Focus:
├─ Border Color: #3B82F6 (Blue 500)
└─ Box Shadow: 0 0 0 3px rgba(59,130,246,0.1)

Form Input Readonly:
├─ Background: #F9FAFB (Gray 50)
├─ Color: #6B7280 (Gray 500)
└─ Cursor: not-allowed

Verified Badge:
├─ Display: inline-flex
├─ Align Items: center
├─ Gap: 4px
├─ Padding: 2px 8px
├─ Background: #D1FAE5 (Green 100)
├─ Border Radius: 12px
├─ Font: Pretendard Medium
├─ Size: 12px
├─ Color: #047857 (Green 700)
└─ Position: absolute right-16px
```

---

### 5.14 에러 모달 (Part 6.1)

에러 처리 UI는 **횡단 관심사**로, 모든 화면에서 일관되게 사용됩니다.

#### Critical Error 모달 (전체 화면)

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│                                                     │
│                     ⛔                              │
│                                                     │
│              세션이 만료되었습니다                    │
│                                                     │
│         보안을 위해 다시 로그인해주세요               │
│                                                     │
│         ┌─────────────────────────────┐            │
│         │        다시 로그인           │            │
│         └─────────────────────────────┘            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

#### 상세 스펙 (Critical Modal)

```
Overlay:
├─ Position: fixed inset-0
├─ Background: rgba(0,0,0,0.6)
├─ Backdrop Filter: blur(4px)
├─ Z-Index: 10000
└─ Display: flex center center

Modal Container:
├─ Width: min(90vw, 400px)
├─ Background: #FFFFFF
├─ Border Radius: 24px
├─ Padding: 48px 32px
├─ Text Align: center
└─ Box Shadow: 0 24px 48px rgba(0,0,0,0.2)

Error Icon:
├─ Font Size: 64px
├─ Margin Bottom: 24px
└─ Animation: pulse 2s infinite

Title:
├─ Font: Pretendard Bold
├─ Size: 22px
├─ Color: #111827 (Gray 900)
├─ Margin Bottom: 12px
└─ Line Height: 1.3

Description:
├─ Font: Pretendard Regular
├─ Size: 15px
├─ Color: #6B7280 (Gray 500)
├─ Margin Bottom: 32px
└─ Line Height: 1.5

Primary CTA Button:
├─ Width: 100%
├─ Height: 52px
├─ Background: #3B82F6 (Blue 500)
├─ Border Radius: 12px
├─ Font: Pretendard SemiBold
├─ Size: 16px
├─ Color: #FFFFFF
└─ Hover: Background #2563EB (Blue 600)
```

---

### 5.15 에러 배너 (Part 6.1)

#### Major Error 배너 (고정 상단)

```
┌──────────────────────────────────────────────────────────┐
│ ⚠️  Notion 연결이 끊어졌습니다. 미팅 기록이 저장되지     │
│     않습니다.                               [재연결] [×] │
└──────────────────────────────────────────────────────────┘
```

#### 상세 스펙 (Error Banner)

```
Banner Container:
├─ Position: sticky top-0
├─ Width: 100%
├─ Min Height: 52px
├─ Background: #FEF3C7 (Yellow 100)
├─ Border Bottom: 1px solid #F59E0B (Yellow 500)
├─ Padding: 12px 16px
├─ Display: flex
├─ Align Items: center
├─ Gap: 12px
└─ Z-Index: 9000

Warning Variant:
├─ Background: #FEF3C7 (Yellow 100)
├─ Border Color: #F59E0B (Yellow 500)
├─ Icon Color: #D97706 (Yellow 600)
└─ Text Color: #92400E (Yellow 800)

Error Variant:
├─ Background: #FEE2E2 (Red 100)
├─ Border Color: #EF4444 (Red 500)
├─ Icon Color: #DC2626 (Red 600)
└─ Text Color: #991B1B (Red 800)

Info Variant:
├─ Background: #DBEAFE (Blue 100)
├─ Border Color: #3B82F6 (Blue 500)
├─ Icon Color: #2563EB (Blue 600)
└─ Text Color: #1E40AF (Blue 800)

Icon:
├─ Size: 20px
├─ Flex Shrink: 0
└─ Margin Top: 2px (align with first line)

Message:
├─ Flex: 1
├─ Font: Pretendard Medium
├─ Size: 14px
├─ Line Height: 1.4
└─ Word Break: keep-all

Action Button:
├─ Height: 32px
├─ Padding: 0 16px
├─ Background: transparent
├─ Border: 1px solid currentColor
├─ Border Radius: 6px
├─ Font: Pretendard SemiBold
├─ Size: 13px
├─ Color: inherit
└─ Hover: Background rgba(0,0,0,0.05)

Close Button:
├─ Width: 32px
├─ Height: 32px
├─ Background: transparent
├─ Border Radius: 6px
├─ Display: flex center center
├─ Color: inherit
├─ Opacity: 0.6
└─ Hover: Opacity 1, Background rgba(0,0,0,0.05)
```

---

### 5.16 에러 토스트 (Part 6.1)

#### Minor Error 토스트

```
┌──────────────────────────────────────────┐
│ ⚠️  네트워크 연결 실패        [다시 시도] │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ ❌  Notion 저장 실패    [다시 시도] [설정] │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ ✅  연결이 복구되었습니다                  │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ 🔄  재연결 중... (2/3)                    │
└──────────────────────────────────────────┘
```

#### 상세 스펙 (Error Toast)

```
Toast Container:
├─ Position: fixed
├─ Bottom: 24px (or top for HUD)
├─ Right: 24px
├─ Z-Index: 9500
├─ Display: flex flex-col
├─ Gap: 8px
└─ Max Width: 400px

Toast Item:
├─ Min Width: 280px
├─ Max Width: 400px
├─ Background: #FFFFFF
├─ Border Radius: 12px
├─ Padding: 14px 16px
├─ Display: flex
├─ Align Items: center
├─ Gap: 12px
├─ Box Shadow: 0 8px 24px rgba(0,0,0,0.12)
├─ Border Left: 4px solid (varies by type)
└─ Animation: slideIn 0.3s ease-out

Toast Type Colors (Border Left):
├─ Error: #EF4444 (Red 500)
├─ Warning: #F59E0B (Yellow 500)
├─ Success: #10B981 (Green 500)
├─ Info: #3B82F6 (Blue 500)
└─ Loading: #6B7280 (Gray 500)

Icon:
├─ Size: 20px
├─ Flex Shrink: 0
└─ Color: matches border color

Message:
├─ Flex: 1
├─ Font: Pretendard Medium
├─ Size: 14px
├─ Color: #111827 (Gray 900)
└─ Line Height: 1.4

CTA Button (Text Style):
├─ Font: Pretendard SemiBold
├─ Size: 13px
├─ Color: #3B82F6 (Blue 500)
├─ Padding: 4px 8px
├─ Border Radius: 4px
└─ Hover: Background #EFF6FF (Blue 50)

Close Button:
├─ Width: 24px
├─ Height: 24px
├─ Background: transparent
├─ Border Radius: 4px
├─ Color: #9CA3AF (Gray 400)
└─ Hover: Color #6B7280, Background #F3F4F6

Auto Dismiss:
├─ Info: 3초
├─ Success: 3초
├─ Warning: 5초
├─ Error: 수동 닫기 필요
└─ Loading: 작업 완료까지

Progress Bar (Auto Dismiss):
├─ Height: 3px
├─ Position: absolute bottom-0 left-0
├─ Background: currentColor
├─ Opacity: 0.3
├─ Animation: shrink (duration)s linear
└─ Border Radius: 0 0 8px 8px
```

---

### 5.17 인라인 에러 메시지 (Part 6.1)

#### Info Level 인라인

```
검색 결과:
┌─────────────────────────────────────────┐
│ ℹ️  오프라인 모드입니다.                  │
│     연결되면 자동으로 동기화됩니다.        │
└─────────────────────────────────────────┘
[검색 결과 표시...]
```

#### 상세 스펙 (Inline Error)

```
Inline Container:
├─ Width: 100%
├─ Background: #F3F4F6 (Gray 100)
├─ Border Radius: 8px
├─ Padding: 12px 16px
├─ Margin: 8px 0
├─ Display: flex
├─ Gap: 10px
└─ Align Items: flex-start

Info Variant:
├─ Background: #F0F9FF (Blue 50)
├─ Icon Color: #3B82F6 (Blue 500)
└─ Text Color: #1E40AF (Blue 800)

Warning Variant:
├─ Background: #FFFBEB (Yellow 50)
├─ Icon Color: #F59E0B (Yellow 500)
└─ Text Color: #92400E (Yellow 800)

Error Variant:
├─ Background: #FEF2F2 (Red 50)
├─ Icon Color: #EF4444 (Red 500)
└─ Text Color: #991B1B (Red 800)

Icon:
├─ Size: 18px
├─ Flex Shrink: 0
└─ Margin Top: 2px

Content:
├─ Flex: 1
├─ Font: Pretendard Regular
├─ Size: 14px
├─ Line Height: 1.5
└─ Color: inherit
```

---

### 5.18 오프라인 모드 상태바 (Part 6.1)

#### HUD 오프라인 상태

```
┌─────────────────────────────────────────┐
│ 📡 오프라인 모드 - 데이터는 저장됨        │
└─────────────────────────────────────────┘
```

#### 상세 스펙 (Offline Status Bar)

```
Status Bar:
├─ Width: 100%
├─ Height: 36px
├─ Background: #F3F4F6 (Gray 100)
├─ Border Bottom: 1px solid #E5E7EB (Gray 200)
├─ Display: flex center center
├─ Gap: 8px
└─ Padding: 0 12px

Offline State:
├─ Background: #FEF3C7 (Yellow 100)
├─ Border Color: #F59E0B (Yellow 500)
├─ Icon: 📡 or ⚠️
└─ Text Color: #92400E (Yellow 800)

Reconnecting State:
├─ Background: #DBEAFE (Blue 100)
├─ Border Color: #3B82F6 (Blue 500)
├─ Icon: 🔄 (spinning)
├─ Text: "재연결 중..."
└─ Text Color: #1E40AF (Blue 800)

Connected State (Success Flash):
├─ Background: #D1FAE5 (Green 100)
├─ Border Color: #10B981 (Green 500)
├─ Icon: ✅ or 🟢
├─ Text: "연결됨"
├─ Text Color: #065F46 (Green 800)
└─ Animation: fadeOut after 2s

Icon:
├─ Size: 14px
└─ Animation: spin 1s linear infinite (reconnecting only)

Text:
├─ Font: Pretendard Medium
├─ Size: 12px
└─ Line Height: 1

Retry Button (if shown):
├─ Font: Pretendard SemiBold
├─ Size: 12px
├─ Color: #3B82F6
├─ Text Decoration: underline
└─ Margin Left: 8px
```

---

### 5.19 권한 요청 모달 (Part 6.1)

#### 마이크 권한 모달

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│                     🎙️                              │
│                                                     │
│              마이크 권한이 필요합니다                 │
│                                                     │
│       Onno가 회의 내용을 기록하려면 마이크            │
│       접근 권한이 필요합니다.                        │
│                                                     │
│       ┌─────────────────────────────────┐          │
│       │    브라우저 설정에서 허용하기      │          │
│       └─────────────────────────────────┘          │
│                                                     │
│       ┌─────────────────────────────────┐          │
│       │    설정 방법 보기                 │          │
│       └─────────────────────────────────┘          │
│                                                     │
│                    [나중에]                         │
│                                                     │
└─────────────────────────────────────────────────────┘
```

#### 상세 스펙 (Permission Modal)

```
Modal Container:
├─ Width: min(90vw, 420px)
├─ Background: #FFFFFF
├─ Border Radius: 24px
├─ Padding: 40px 32px
├─ Text Align: center
└─ Box Shadow: 0 24px 48px rgba(0,0,0,0.15)

Permission Icon:
├─ Font Size: 56px
├─ Margin Bottom: 20px
└─ Animation: bounce 1s ease-in-out

Title:
├─ Font: Pretendard Bold
├─ Size: 20px
├─ Color: #111827 (Gray 900)
├─ Margin Bottom: 12px
└─ Line Height: 1.3

Description:
├─ Font: Pretendard Regular
├─ Size: 15px
├─ Color: #6B7280 (Gray 500)
├─ Margin Bottom: 28px
└─ Line Height: 1.5

Primary Button:
├─ Width: 100%
├─ Height: 50px
├─ Background: #3B82F6 (Blue 500)
├─ Border Radius: 12px
├─ Font: Pretendard SemiBold
├─ Size: 15px
├─ Color: #FFFFFF
├─ Margin Bottom: 12px
└─ Hover: Background #2563EB

Secondary Button:
├─ Width: 100%
├─ Height: 50px
├─ Background: transparent
├─ Border: 1px solid #E5E7EB (Gray 200)
├─ Border Radius: 12px
├─ Font: Pretendard Medium
├─ Size: 15px
├─ Color: #374151 (Gray 700)
└─ Hover: Background #F9FAFB

Skip Link:
├─ Font: Pretendard Regular
├─ Size: 14px
├─ Color: #9CA3AF (Gray 400)
├─ Margin Top: 16px
├─ Cursor: pointer
└─ Hover: Color #6B7280
```

---

### 5.20 복구 진행 상태 (Part 6.1)

#### 재시도 진행 표시

```
┌──────────────────────────────────────────┐
│ 🔄  저장 재시도 중...                      │
│     [████████░░░░░░░░] 2/3                │
└──────────────────────────────────────────┘
```

#### 상세 스펙 (Recovery Progress)

```
Progress Container:
├─ Min Width: 280px
├─ Background: #FFFFFF
├─ Border Radius: 12px
├─ Padding: 16px
├─ Box Shadow: 0 8px 24px rgba(0,0,0,0.12)
├─ Border Left: 4px solid #3B82F6
└─ Display: flex flex-col gap-8px

Header Row:
├─ Display: flex
├─ Align Items: center
└─ Gap: 10px

Spinner Icon:
├─ Size: 18px
├─ Color: #3B82F6
└─ Animation: spin 1s linear infinite

Status Text:
├─ Font: Pretendard Medium
├─ Size: 14px
└─ Color: #111827

Progress Bar Container:
├─ Height: 8px
├─ Background: #E5E7EB (Gray 200)
├─ Border Radius: 4px
└─ Overflow: hidden

Progress Bar Fill:
├─ Height: 100%
├─ Background: #3B82F6
├─ Border Radius: 4px
├─ Transition: width 0.3s ease
└─ Width: (current/max * 100)%

Attempt Counter:
├─ Font: Pretendard Regular
├─ Size: 12px
├─ Color: #6B7280
├─ Text Align: right
└─ Format: "{current}/{max}"
```

### 5.21 Skeleton 로딩 컴포넌트 (Part 6.2)

> 로딩 상태는 **횡단 관심사(Cross-Cutting Concern)**로, 모든 Part에서 일관되게 적용됩니다.
> 철학: "기다림을 가치로 전환" - 콘텐츠 형태를 미리 보여주어 체감 시간을 줄입니다.

#### 미팅 카드 Skeleton

```
┌─────────────────────────────────────┐
│ [━━━━━━] [━━━━]                     │  ← 시간, 상태 태그
│ [━━━━━━━━━━━━━━━━━]                 │  ← 제목
│ [━━━━━━━━━━] [━━━━━━]               │  ← 참석자, 회사
│                                     │
│ [━━━━━━━━━]                         │  ← 버튼
└─────────────────────────────────────┘
```

#### 상세 스펙 (Skeleton)

```
Skeleton Element Base:
├─ Background: #E5E7EB (Gray 200)
├─ Border Radius: 4px (텍스트), 8px (카드), 50% (원형)
├─ Overflow: hidden
└─ Position: relative

Shimmer Animation:
├─ Pseudo Element: ::after
├─ Content: ""
├─ Position: absolute inset 0
├─ Background: linear-gradient(
│   90deg,
│   transparent 0%,
│   rgba(255,255,255,0.4) 50%,
│   transparent 100%
│ )
├─ Animation: shimmer 1.5s infinite
└─ Transform: translateX(-100%) → translateX(100%)

@keyframes shimmer:
├─ 0%: transform: translateX(-100%)
└─ 100%: transform: translateX(100%)

Skeleton Sizes (텍스트):
├─ XS: height 12px, width 60px
├─ SM: height 14px, width 100px
├─ MD: height 16px, width 150px
├─ LG: height 20px, width 200px
└─ XL: height 24px, width 100%

Skeleton Card:
├─ Same border radius as real card (12px)
├─ Same padding as real card
├─ Same shadow (subtle)
└─ Gap between elements: same as real card
```

#### 검색 결과 Skeleton

```
┌─────────────────────────────────────┐
│ [●] [━━━━━━━━━━━━━━━━]              │
│     [━━━━━━━━━] [━━━━]              │
│     [━━━━━━━━━━━━━━━━━━━━━]         │
├─────────────────────────────────────┤
│ [●] [━━━━━━━━━━━━]                  │
│     [━━━━━━] [━━━━━━]               │
│     [━━━━━━━━━━━━━━━]               │
└─────────────────────────────────────┘

Search Skeleton Item:
├─ Left: Circle (32×32px, radius 50%)
├─ Title: width 70%, height 16px
├─ Meta: width 40%, height 12px
├─ Description: width 90%, height 14px
└─ Gap: 12px
```

### 5.22 Spinner 컴포넌트 (Part 6.2)

#### 레이아웃 및 사이즈

```
┌─ Small (16px) ─┐  ┌─ Medium (24px) ─┐
│      ◠         │  │       ◠         │
│                │  │                 │
└────────────────┘  └─────────────────┘

┌─ Large (40px) ─┐  ┌─ XL (64px) ─────┐
│      ◠         │  │       ◠         │
│                │  │                 │
│                │  │                 │
└────────────────┘  └─────────────────┘
```

#### 상세 스펙 (Spinner)

```
Spinner Base:
├─ Display: inline-block
├─ Border Radius: 50%
├─ Border Style: solid
├─ Border Color: transparent transparent transparent currentColor
├─ Animation: spin 0.8s linear infinite
└─ Box Sizing: border-box

@keyframes spin:
├─ 0%: transform: rotate(0deg)
└─ 100%: transform: rotate(360deg)

Size Variants:
├─ Small:
│   ├─ Size: 16×16px
│   ├─ Border Width: 2px
│   └─ Use: 버튼 내부, 인라인
├─ Medium:
│   ├─ Size: 24×24px
│   ├─ Border Width: 2.5px
│   └─ Use: 인라인 액션
├─ Large:
│   ├─ Size: 40×40px
│   ├─ Border Width: 3px
│   └─ Use: 영역 로딩
└─ XL:
    ├─ Size: 64×64px
    ├─ Border Width: 4px
    └─ Use: 전체 화면

Color Variants:
├─ Primary: #3B82F6 (Blue 600)
├─ Secondary: #6B7280 (Gray 500)
├─ White: #FFFFFF (on dark backgrounds)
└─ Current: inherit from parent color
```

### 5.23 Progress Bar 컴포넌트 (Part 6.2)

#### Linear Progress

```
Indeterminate:
┌──────────────────────────────────────┐
│ ███░░░░░░░░░░███░░░░░░░░░░░░░░░░░░░░ │ ← 좌우 이동
└──────────────────────────────────────┘

Determinate:
┌──────────────────────────────────────┐
│ ██████████████░░░░░░░░░░░░░░░░░░░░░░ │ ← 45%
└──────────────────────────────────────┘

With Label:
┌──────────────────────────────────────┐
│ 저장 중...                     45%   │
│ ██████████████░░░░░░░░░░░░░░░░░░░░░░ │
└──────────────────────────────────────┘
```

#### 상세 스펙 (Linear Progress)

```
Progress Track:
├─ Height: 4px (default), 8px (large)
├─ Background: #E5E7EB (Gray 200)
├─ Border Radius: 2px (half of height)
├─ Overflow: hidden
└─ Width: 100%

Progress Fill (Determinate):
├─ Height: 100%
├─ Background: #3B82F6 (Blue 600)
├─ Border Radius: inherit
├─ Transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1)
└─ Width: {progress}%

Progress Fill (Indeterminate):
├─ Width: 30%
├─ Animation: indeterminate 1.5s ease-in-out infinite
└─ Transform Origin: left

@keyframes indeterminate:
├─ 0%: transform: translateX(-100%)
├─ 50%: transform: translateX(150%)
└─ 100%: transform: translateX(-100%)

Progress Label:
├─ Font: Pretendard Medium
├─ Size: 14px
├─ Color: #374151 (Gray 700)
├─ Display: flex
├─ Justify Content: space-between
├─ Margin Bottom: 8px
└─ Percentage: #6B7280 (Gray 500)
```

#### Circular Progress

```
┌───────┐
│  ╭─╮  │
│  │   │  ← 45% 채워진 원
│  ╰──╯ │
└───────┘
```

```
Circular Progress:
├─ Size: 40px (default), 24px (small), 64px (large)
├─ Stroke Width: 4px
├─ Track Color: #E5E7EB (Gray 200)
├─ Fill Color: #3B82F6 (Blue 600)
├─ Rotation: -90deg (12시 방향 시작)
├─ Stroke Dasharray: circumference
├─ Stroke Dashoffset: circumference * (1 - progress/100)
└─ Transition: stroke-dashoffset 0.3s ease
```

### 5.24 Steps Progress (Part 6.2)

#### 단계 진행 표시

```
┌────────────────────────────────────────────┐
│  ①────────●────────○────────○              │
│  완료      진행중    대기      대기          │
│                                            │
│  ✓ 데이터 수집 완료                          │
│  ⟳ Notion에 저장 중...                      │
│  ○ HubSpot 동기화 대기                      │
│  ○ Slack 알림 대기                          │
└────────────────────────────────────────────┘
```

#### 상세 스펙 (Steps Progress)

```
Steps Container:
├─ Display: flex
├─ Align Items: center
├─ Gap: 0 (connector fills gap)
└─ Padding: 16px 0

Step Node:
├─ Size: 24px (circle)
├─ Border Radius: 50%
├─ Display: flex
├─ Align Items: center
├─ Justify Content: center
├─ Font: Pretendard SemiBold
├─ Size: 12px
└─ Transition: all 0.3s ease

Step States:
├─ Completed:
│   ├─ Background: #10B981 (Green 500)
│   ├─ Color: #FFFFFF
│   └─ Icon: Checkmark (12px)
├─ Active:
│   ├─ Background: #3B82F6 (Blue 600)
│   ├─ Color: #FFFFFF
│   └─ Content: step number or Spinner
├─ Pending:
│   ├─ Background: #E5E7EB (Gray 200)
│   ├─ Color: #9CA3AF (Gray 400)
│   └─ Border: 2px solid #D1D5DB
└─ Error:
    ├─ Background: #EF4444 (Red 500)
    ├─ Color: #FFFFFF
    └─ Icon: X (12px)

Step Connector:
├─ Height: 2px
├─ Flex: 1
├─ Min Width: 24px
├─ Background: #E5E7EB (Gray 200)
└─ Completed: #10B981 (Green 500)

Step Label:
├─ Font: Pretendard Regular
├─ Size: 12px
├─ Color: #6B7280 (Gray 500)
├─ Text Align: center
├─ Margin Top: 8px
└─ Max Width: 80px
```

### 5.25 Streaming Text 컴포넌트 (Part 6.2)

#### AI 응답 스트리밍

```
┌──────────────────────────────────────┐
│ 이번 미팅에서 논의된 주요 사항은       │
│ 다음과 같습니다:                      │
│                                      │
│ 1. 계약 조건 협의|                    │ ← 깜빡이는 커서
└──────────────────────────────────────┘
```

#### 상세 스펙 (Streaming Text)

```
Streaming Container:
├─ Font: Pretendard Regular
├─ Size: 14px
├─ Line Height: 1.6
├─ Color: #374151 (Gray 700)
└─ White Space: pre-wrap

Typing Cursor:
├─ Display: inline-block
├─ Width: 2px
├─ Height: 1em
├─ Background: #3B82F6 (Blue 600)
├─ Margin Left: 1px
├─ Animation: blink 1s step-end infinite
└─ Vertical Align: text-bottom

@keyframes blink:
├─ 0%, 50%: opacity: 1
└─ 51%, 100%: opacity: 0

Character Animation:
├─ Each character appears with opacity fade
├─ Duration: 30-50ms per character
├─ Easing: ease-out
└─ Smooth typing effect

Typing Indicator (waiting):
├─ Content: "●●●"
├─ Animation: typing-dots 1.4s infinite
├─ Each dot staggers by 0.2s
└─ Scale: 1 → 1.2 → 1

@keyframes typing-dots:
├─ 0%, 60%, 100%: transform: scale(1)
└─ 30%: transform: scale(1.2)
```

### 5.26 Pulse 인디케이터 (Part 6.2)

#### 실시간 연결 상태

```
┌────────────────────┐
│  🟢 LIVE  연결됨   │  ← 🟢가 맥박처럼 깜빡임
└────────────────────┘
```

#### 상세 스펙 (Pulse)

```
Pulse Container:
├─ Display: inline-flex
├─ Align Items: center
└─ Gap: 6px

Pulse Dot:
├─ Size: 8px
├─ Border Radius: 50%
├─ Background: #10B981 (Green 500) [connected]
├─ Background: #EAB308 (Yellow 500) [connecting]
├─ Background: #EF4444 (Red 500) [disconnected]
├─ Position: relative
└─ Animation: pulse 2s ease-in-out infinite

@keyframes pulse:
├─ 0%:
│   ├─ transform: scale(1)
│   └─ box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7)
├─ 50%:
│   ├─ transform: scale(1.1)
│   └─ box-shadow: 0 0 0 8px rgba(16, 185, 129, 0)
└─ 100%:
    ├─ transform: scale(1)
    └─ box-shadow: 0 0 0 0 rgba(16, 185, 129, 0)

Pulse Ring (outer):
├─ Position: absolute
├─ Size: 100%
├─ Border Radius: 50%
├─ Border: 2px solid currentColor
├─ Opacity: 0.3
└─ Animation: pulse-ring 2s ease-out infinite

@keyframes pulse-ring:
├─ 0%: transform: scale(1); opacity: 0.5
├─ 100%: transform: scale(2); opacity: 0
```

### 5.27 낙관적 UI 피드백 (Part 6.2)

#### 저장 완료 피드백

```
토글 저장:
┌──────────────────────────────────┐
│ 알림 설정   [████]  ✓            │  ← 체크 표시 후 사라짐
└──────────────────────────────────┘

텍스트 자동 저장:
┌──────────────────────────────────┐
│ 제목: 계약 검토 미팅  ☁️ 저장됨   │  ← 구름 아이콘 표시
└──────────────────────────────────┘

롤백 시:
┌──────────────────────────────────┐
│ ⚠️ 저장 실패 - 변경사항 복원됨    │  ← 토스트 알림
└──────────────────────────────────┘
```

#### 상세 스펙 (Optimistic Feedback)

```
Success Check Animation:
├─ Icon: Checkmark
├─ Size: 16px
├─ Color: #10B981 (Green 500)
├─ Initial: scale(0) rotate(-45deg)
├─ Animate to: scale(1) rotate(0deg)
├─ Duration: 0.3s
├─ Easing: cubic-bezier(0.175, 0.885, 0.32, 1.275)
├─ Hold: 1.5s
└─ Fade out: 0.3s

Auto-save Indicator:
├─ Icon: Cloud + Check
├─ Size: 14px
├─ Color: #6B7280 (Gray 500)
├─ Text: "저장됨"
├─ Font: Pretendard Regular
├─ Size: 12px
├─ Opacity: 0.7
├─ Appear: fade in 0.2s
└─ Disappear: fade out 0.3s after 2s

Saving State:
├─ Icon: Cloud + Spinner
├─ Text: "저장 중..."
├─ Animation: subtle pulse
└─ Color: #9CA3AF (Gray 400)

Rollback Toast:
├─ Type: Warning
├─ Icon: ⚠️
├─ Message: "저장 실패 - 변경사항 복원됨"
├─ Duration: 4s
├─ Action: "다시 시도"
├─ Animation: slide in from bottom
└─ Background: #FFFBEB (Yellow 50)
```

### 5.28 빈 상태 컨테이너 (Part 6.3)

```
빈 상태는 데이터가 없는 상황에서 사용자에게 가치를 전달하고
다음 행동을 유도하는 중요한 UX 요소입니다.

기본 레이아웃:
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                                                         │
│                    [일러스트/아이콘]                    │
│                       80 × 80px                         │
│                                                         │
│                         제목                            │
│                    "미팅이 없어요"                       │
│                                                         │
│                        설명                              │
│           "캘린더를 연동하면 미팅이 표시됩니다"          │
│                                                         │
│              ┌─────────────────────────┐                │
│              │   [Primary CTA 버튼]    │                │
│              └─────────────────────────┘                │
│                                                         │
│                  [Secondary 링크]                        │
│                                                         │
│                 💡 제안 1  💡 제안 2                     │
│                                                         │
└─────────────────────────────────────────────────────────┘

Full Page Empty State Container:
├─ Display: flex
├─ Flex Direction: column
├─ Align Items: center
├─ Justify Content: center
├─ Min Height: 400px
├─ Padding: 48px 24px
├─ Text Align: center
└─ Background: transparent
```

### 5.29 빈 상태 일러스트레이션 (Part 6.3)

```
일러스트레이션 크기:
├─ Large (lg): 120 × 120px - 전체 페이지 빈 상태
├─ Medium (md): 80 × 80px - 섹션 빈 상태
└─ Small (sm): 48 × 48px - 인라인 빈 상태

일러스트레이션 스타일:
├─ Style: Flat, minimal line art
├─ Primary Color: #3B82F6 (Blue 500)
├─ Secondary Color: #BFDBFE (Blue 200)
├─ Accent Color: #FCD34D (Yellow 400)
├─ Neutral: #E5E7EB (Gray 200)
└─ Line Width: 2px

일러스트레이션 매핑:
┌─────────────────────────────────────────────────────────┐
│ Context              │ Asset Name           │ Size     │
├─────────────────────────────────────────────────────────┤
│ 첫 사용 환영         │ welcome-calendar     │ lg (120) │
│ 오늘 미팅 없음       │ relax-coffee         │ md (80)  │
│ 모든 미팅 완료       │ celebration-check    │ lg (120) │
│ 검색 초기            │ search-magnifier     │ lg (120) │
│ 검색 결과 없음       │ no-results           │ md (80)  │
│ 필터 결과 없음       │ filter-empty         │ md (80)  │
│ 결정 사항 없음       │ lightbulb-dim        │ md (80)  │
│ 액션 없음            │ clipboard-empty      │ md (80)  │
│ 모든 액션 완료       │ confetti             │ md (80)  │
│ 통합 서비스 없음     │ connect-apps         │ lg (120) │
│ 알림 없음            │ bell-quiet           │ md (80)  │
│ HUD 대기             │ pulse-waiting        │ sm (48)  │
│ 권한 없음            │ lock-shield          │ md (80)  │
│ 오프라인             │ cloud-offline        │ md (80)  │
└─────────────────────────────────────────────────────────┘

아이콘 폴백 (일러스트 미사용 시):
├─ Icon Set: Lucide Icons
├─ Size: 48px / 64px / 80px
├─ Color: #9CA3AF (Gray 400)
├─ Stroke Width: 1.5px
└─ Container: 원형 배경 #F3F4F6 (Gray 100)
   Size: icon × 1.6
```

### 5.30 빈 상태 텍스트 (Part 6.3)

```
Title (제목):
├─ Font: Pretendard SemiBold
├─ Size: 18px (lg), 16px (md), 14px (sm)
├─ Color: #1F2937 (Gray 800)
├─ Line Height: 1.4
├─ Max Width: 280px
├─ Margin Top: 24px (lg), 16px (md), 12px (sm)
└─ Text Align: center

Description (설명):
├─ Font: Pretendard Regular
├─ Size: 14px (lg/md), 13px (sm)
├─ Color: #6B7280 (Gray 500)
├─ Line Height: 1.5
├─ Max Width: 320px
├─ Margin Top: 8px
└─ Text Align: center

톤별 스타일:
┌─────────────────────────────────────────────────────────┐
│ Tone         │ Title Style        │ Icon/Illustration  │
├─────────────────────────────────────────────────────────┤
│ neutral      │ 기본 스타일        │ Gray 아이콘        │
│ positive     │ 🎉 이모지 포함 가능│ 밝은 색상 일러스트 │
│ encouraging  │ 따뜻한 문구        │ 환영 일러스트      │
│ helpful      │ 안내 중심          │ 도움 아이콘        │
└─────────────────────────────────────────────────────────┘

텍스트 예시:
┌─────────────────────────────────────────────────────────┐
│ 컨텍스트       │ 제목                    │ 설명         │
├─────────────────────────────────────────────────────────┤
│ 첫 사용        │ "첫 미팅을 기다리고     │ "캘린더를    │
│                │  있어요"                │  연동하면..."│
├─────────────────────────────────────────────────────────┤
│ 미팅 없음      │ "오늘은 미팅이 없어요"  │ "여유로운    │
│                │                         │  하루..."    │
├─────────────────────────────────────────────────────────┤
│ 완료           │ "오늘 미팅 완료! 🎉"    │ "수고하셨    │
│                │                         │  어요!"      │
├─────────────────────────────────────────────────────────┤
│ 검색 결과 없음 │ "검색 결과가 없습니다"  │ "다른 키워   │
│                │                         │  드로..."    │
└─────────────────────────────────────────────────────────┘
```

### 5.31 빈 상태 CTA 버튼 (Part 6.3)

```
Primary CTA:
├─ Variant: Primary Button
├─ Min Width: 160px
├─ Height: 44px
├─ Font: Pretendard SemiBold 14px
├─ Background: #3B82F6 (Blue 500)
├─ Color: #FFFFFF
├─ Border Radius: 8px
├─ Margin Top: 24px
├─ Hover: #2563EB (Blue 600)
├─ Active: #1D4ED8 (Blue 700)
└─ Shadow: Shadow 1

Primary CTA 예시:
├─ "캘린더 연동하기"
├─ "Notion 연동하기"
├─ "첫 미팅 추가"
├─ "지난 미팅 보기"
└─ "필터 초기화"

Secondary CTA:
├─ Variant: Text Link
├─ Font: Pretendard Medium 14px
├─ Color: #6B7280 (Gray 500)
├─ Margin Top: 12px
├─ Hover: #3B82F6 (Blue 500)
├─ Hover Decoration: underline
└─ Cursor: pointer

Secondary CTA 예시:
├─ "수동으로 미팅 추가"
├─ "나중에 하기"
├─ "전체 필터 해제"
└─ "도움말 보기"

버튼 레이아웃:
┌─────────────────────────────────────────────────────────┐
│                                                         │
│         ┌───────────────────────────────┐               │
│         │      캘린더 연동하기         │               │
│         └───────────────────────────────┘               │
│                                                         │
│                 수동으로 미팅 추가                       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 5.32 빈 상태 제안 칩 (Part 6.3)

```
검색 빈 상태에서 대안 검색어 제안:

Suggestion Chips Container:
├─ Display: flex
├─ Flex Wrap: wrap
├─ Gap: 8px
├─ Justify Content: center
├─ Margin Top: 20px
└─ Max Width: 320px

Suggestion Chip:
├─ Display: inline-flex
├─ Align Items: center
├─ Gap: 6px
├─ Padding: 8px 12px
├─ Background: #F3F4F6 (Gray 100)
├─ Border: 1px solid #E5E7EB (Gray 200)
├─ Border Radius: 16px (full)
├─ Font: Pretendard Regular 13px
├─ Color: #4B5563 (Gray 600)
├─ Cursor: pointer
└─ Transition: 200ms

Chip Hover:
├─ Background: #E5E7EB (Gray 200)
├─ Border Color: #D1D5DB (Gray 300)
└─ Color: #1F2937 (Gray 800)

Chip Active:
├─ Background: #DBEAFE (Blue 100)
├─ Border Color: #93C5FD (Blue 300)
└─ Color: #1D4ED8 (Blue 700)

Chip Icon (선택):
├─ Icon: 💡 or 🔍
├─ Size: 14px
└─ Position: left

예시 레이아웃:
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   💡 "지난 달 예산"  💡 "Q4 전략"  💡 "김철수"          │
│                                                         │
│         🔍 날짜 범위 확대    🔍 필터 조건 완화          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 5.33 인라인 빈 상태 (Part 6.3)

```
섹션 내 부분 빈 상태 (결정 사항만 없는 경우 등):

Inline Empty Container:
├─ Display: flex
├─ Flex Direction: column
├─ Align Items: center
├─ Padding: 24px 16px
├─ Background: #F9FAFB (Gray 50)
├─ Border: 1px dashed #E5E7EB (Gray 200)
├─ Border Radius: 8px
└─ Min Height: 80px

Inline Empty Icon:
├─ Size: 32px
├─ Color: #9CA3AF (Gray 400)
└─ Margin Bottom: 8px

Inline Empty Text:
├─ Font: Pretendard Regular 13px
├─ Color: #6B7280 (Gray 500)
├─ Text Align: center
└─ Max Width: 200px

Inline Add Button (선택):
├─ Variant: Ghost Button
├─ Size: Small
├─ Icon: + (Plus)
├─ Label: "추가하기"
├─ Margin Top: 12px
├─ Color: #3B82F6 (Blue 500)
└─ Hover: Background #EFF6FF (Blue 50)

예시:
┌─────────────────────────────────────────────────────────┐
│ 결정 사항                                               │
├─────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────┐  │
│  │              📋                                   │  │
│  │        결정 사항이 없습니다                       │  │
│  │                                                   │  │
│  │         [+ 수동으로 추가]                         │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 5.34 빈 상태 애니메이션 (Part 6.3)

```
Entry Animation (빈 상태 진입):
├─ Type: Fade + Scale
├─ From: opacity 0, scale 0.95
├─ To: opacity 1, scale 1
├─ Duration: 300ms
├─ Easing: ease-out
├─ Delay: 200ms (로딩 완료 후)
└─ Stagger: 아이콘 → 제목 → 설명 → CTA (각 50ms)

Illustration Animation (일러스트):
├─ Type: Subtle Float or Pulse
├─ Translation Y: 0 → -4px → 0
├─ Duration: 3s
├─ Iteration: infinite
├─ Timing: ease-in-out
└─ Optional: SVG path animation

CTA Button Animation:
├─ Type: Attention Pulse (선택)
├─ Scale: 1 → 1.02 → 1
├─ Duration: 2s
├─ Iteration: 2 (then stop)
├─ Delay: 1s (화면 진입 후)
└─ Purpose: CTA 주목 유도

Exit Animation (데이터 로드됨):
├─ Type: Fade + Scale Down
├─ From: opacity 1, scale 1
├─ To: opacity 0, scale 0.95
├─ Duration: 200ms
├─ Easing: ease-in
└─ Followed By: 데이터 콘텐츠 페이드 인

Framer Motion 예시:
const emptyStateVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      delay: 0.2,
      staggerChildren: 0.05
    }
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
};
```

### 5.35 빈 상태 반응형 레이아웃 (Part 6.3)

```
Desktop (> 768px):
├─ Illustration Size: lg (120px)
├─ Title: 18px
├─ Description: 14px
├─ Max Content Width: 400px
├─ Padding: 48px
└─ CTA Button Width: auto (min 160px)

Tablet (481px - 768px):
├─ Illustration Size: md (80px)
├─ Title: 16px
├─ Description: 14px
├─ Max Content Width: 320px
├─ Padding: 32px
└─ CTA Button Width: auto (min 140px)

Mobile (< 480px):
├─ Illustration Size: md (80px)
├─ Title: 16px
├─ Description: 13px
├─ Max Content Width: 280px
├─ Padding: 24px 16px
├─ CTA Button Width: 100% (full width)
└─ Suggestion Chips: 2 rows max

HUD 내 빈 상태 (375px width):
├─ Illustration Size: sm (48px)
├─ Title: 14px
├─ Description: 12px
├─ Padding: 16px
├─ CTA: Compact button or link
└─ Layout: 간결하게 (설명 생략 가능)
```

### 5.36 포커스 링 스타일 (Part 6.4)

```
Focus Ring 스타일 (WCAG 2.1 AA 준수):

기본 포커스 링:
├─ Outline: 2px solid #3B82F6 (Blue 500)
├─ Outline Offset: 2px
├─ Border Radius: inherit (요소 라운드 따라감)
└─ Transition: outline-offset 100ms ease

포커스 링 두꺼운 버전 (접근성 설정):
├─ Outline: 3px solid #3B82F6
├─ Outline Offset: 3px
└─ Box Shadow: 0 0 0 6px rgba(59, 130, 246, 0.2)

포커스 링 색상 변형:
├─ Default: #3B82F6 (Blue 500)
├─ Error Context: #EF4444 (Red 500)
├─ Success Context: #22C55E (Green 500)
└─ High Contrast: #000000 (Black)

요소별 포커스 스타일:

Button Focus:
├─ Default: 2px Blue 500 ring + offset 2px
├─ Shadow: 0 0 0 4px rgba(59, 130, 246, 0.3)
└─ Transition: all 100ms

Input Focus:
├─ Border: 2px solid #3B82F6
├─ Shadow: 0 0 0 4px rgba(59, 130, 246, 0.1)
└─ Background: #FFFFFF

Link Focus:
├─ Text Underline: 2px solid currentColor
├─ Outline: 2px solid #3B82F6
└─ Outline Offset: 4px

Card Focus:
├─ Border: 2px solid #3B82F6
├─ Shadow: 0 0 0 4px rgba(59, 130, 246, 0.15)
└─ Transform: scale(1.01)

Tab Focus:
├─ Background: rgba(59, 130, 246, 0.1)
├─ Border Bottom: 3px solid #3B82F6
└─ No outline (custom indicator)

Checkbox/Radio Focus:
├─ Outline: 2px solid #3B82F6
├─ Outline Offset: 2px
└─ Box Shadow: 0 0 0 4px rgba(59, 130, 246, 0.2)
```

### 5.37 색상 대비 가이드 (Part 6.4)

```
WCAG 2.1 색상 대비 요구사항:
├─ AA 일반 텍스트: 4.5:1 이상
├─ AA 큰 텍스트 (18px+): 3:1 이상
├─ AAA 일반 텍스트: 7:1 이상
└─ UI 컴포넌트/그래픽: 3:1 이상

Onno 색상 대비 매트릭스:

텍스트 on 흰색 배경 (#FFFFFF):
├─ Gray 900 (#1E293B): 14.8:1 ✓ AAA
├─ Gray 700 (#374151): 8.9:1 ✓ AAA
├─ Gray 600 (#4B5563): 6.4:1 ✓ AA
├─ Gray 500 (#6B7280): 5.0:1 ✓ AA
├─ Gray 400 (#9CA3AF): 2.7:1 ⚠️ Large only
└─ Gray 300 (#D1D5DB): 1.6:1 ✗ Fail

Primary 색상 on 흰색 배경:
├─ Blue 500 (#3B82F6): 4.5:1 ✓ AA (경계선)
├─ Blue 600 (#2563EB): 5.9:1 ✓ AA
├─ Blue 700 (#1D4ED8): 7.8:1 ✓ AAA
└─ Blue 800 (#1E40AF): 9.6:1 ✓ AAA

상태 색상 on 흰색 배경:
├─ Red 500 (#EF4444): 4.6:1 ✓ AA
├─ Red 600 (#DC2626): 5.8:1 ✓ AA
├─ Green 500 (#22C55E): 3.2:1 ⚠️ Large only
├─ Green 600 (#16A34A): 4.1:1 ⚠️ Near AA
├─ Green 700 (#15803D): 5.5:1 ✓ AA
├─ Orange 500 (#F97316): 3.1:1 ⚠️ Large only
└─ Orange 600 (#EA580C): 4.2:1 ⚠️ Near AA

권장 색상 조합:
├─ 본문 텍스트: Gray 900 on White
├─ 보조 텍스트: Gray 600 on White
├─ 비활성 텍스트: Gray 500 on White
├─ 링크: Blue 600 on White (Blue 500 hover)
├─ 에러 텍스트: Red 600 on White
├─ 성공 텍스트: Green 700 on White
├─ 버튼 텍스트: White on Blue 500+
└─ 플레이스홀더: Gray 400 (Large 또는 아이콘 함께)

색맹 사용자 대응:
├─ 빨강-초록 구분: 아이콘 + 텍스트 레이블 필수
├─ 성공/에러: ✓/✗ 아이콘 함께 표시
├─ 상태 표시: 색상 + 패턴 or 아이콘
└─ 차트/그래프: 패턴 채움 활용
```

### 5.38 스킵 링크 (Part 6.4)

```
스킵 링크 컴포넌트:

레이아웃:
┌────────────────────────────────────────┐
│  [본문으로 바로 가기] (기본 숨김)        │
└────────────────────────────────────────┘
포커스 시 화면 상단에 표시

Hidden State (기본):
├─ Position: absolute
├─ Top: -100px
├─ Left: 0
├─ Width: 1px
├─ Height: 1px
├─ Overflow: hidden
└─ Clip: rect(0, 0, 0, 0)

Visible State (포커스 시):
├─ Position: fixed
├─ Top: 16px
├─ Left: 16px
├─ Width: auto
├─ Height: auto
├─ Background: #1E293B (Gray 900)
├─ Color: #FFFFFF
├─ Font: Pretendard SemiBold 14px
├─ Padding: 12px 24px
├─ Border Radius: 8px
├─ Shadow: Shadow 4
├─ z-index: 10000
├─ Outline: 2px solid #3B82F6
├─ Outline Offset: 2px
└─ Transition: all 100ms

스킵 링크 그룹 (여러 섹션):
├─ "메인 콘텐츠로 이동"
├─ "네비게이션으로 이동"
├─ "검색으로 이동"
└─ "설정으로 이동"

포커스 시 순서:
1. Skip Link 표시
2. Tab으로 다음 Skip Link 이동
3. Enter로 해당 섹션 이동
4. 섹션 첫 포커스 요소로 포커스 이동
```

### 5.39 터치 영역 (Part 6.4)

```
최소 터치 영역 요구사항 (WCAG 2.5.5):
├─ 최소 크기: 44×44px
├─ 권장 크기: 48×48px
└─ 여백: 인접 요소와 최소 8px 간격

요소별 터치 영역:

버튼:
├─ 최소 높이: 44px
├─ 최소 너비: 44px
├─ Padding: 12px 16px
└─ 작은 버튼도 터치 영역은 44px 유지

아이콘 버튼:
├─ 아이콘 크기: 24px
├─ 터치 영역: 44×44px
├─ Padding: 10px
└─ 시각적 크기 < 터치 영역 (투명 padding)

체크박스/라디오:
├─ 시각적 크기: 20×20px
├─ 터치 영역: 44×44px
├─ 레이블 포함 시 전체 영역 터치 가능
└─ Padding: 12px

토글 스위치:
├─ 트랙 크기: 44×24px
├─ 터치 영역: 트랙 전체
└─ Thumb: 20×20px

링크:
├─ 최소 높이: 44px (인라인 링크 예외)
├─ Line Height: 1.5 이상
└─ 인접 링크 간격: 8px 이상

드롭다운 아이템:
├─ 높이: 44px
├─ Padding: 12px 16px
└─ 첫/마지막 아이템 추가 여백: 8px

카드 터치:
├─ 전체 카드 터치 가능
├─ 내부 버튼 터치 시 카드 이벤트 중지
└─ 최소 터치 영역 내 중첩 방지
```

### 5.40 키보드 힌트 (Part 6.4)

```
키보드 단축키 힌트 디자인:

Tooltip 힌트:
├─ Background: #1E293B (Gray 900)
├─ Color: #FFFFFF
├─ Font: Pretendard Medium 12px
├─ Padding: 6px 10px
├─ Border Radius: 6px
├─ Shadow: Shadow 2
├─ Max Width: 200px
└─ Appear: 700ms delay (hover/focus)

단축키 배지:
├─ Background: #F1F5F9 (Gray 100)
├─ Color: #475569 (Gray 600)
├─ Font: Pretendard Medium 11px
├─ Padding: 2px 6px
├─ Border: 1px solid #E2E8F0 (Gray 200)
├─ Border Radius: 4px
├─ Min Width: 20px
└─ Text Align: center

예시:
┌──────────────────────────────────────┐
│  🔍 검색 [/]                         │
│  ⌨️ 다음 미팅 [j]                    │
│  ⌨️ 이전 미팅 [k]                    │
│  ❌ 닫기 [Esc]                       │
└──────────────────────────────────────┘

모달 내 키보드 힌트:
├─ 위치: 모달 하단 또는 상단 우측
├─ 스타일: 작은 텍스트 + 배지
└─ 예: "저장: ⌘+Enter | 닫기: Esc"

단축키 안내 패널 (Shift+?):
┌────────────────────────────────────────┐
│              키보드 단축키              │
├────────────────────────────────────────┤
│  전역                                   │
│  ──────────────────────────            │
│  [/]           검색으로 이동            │
│  [Esc]         모달 닫기                │
│  [?]           단축키 안내              │
│                                         │
│  Today 화면                             │
│  ──────────────────────────            │
│  [j]           다음 미팅                │
│  [k]           이전 미팅                │
│  [Enter]       미팅 열기                │
│  [p]           미팅 준비                │
│                                         │
│  HUD                                    │
│  ──────────────────────────            │
│  [Space]       녹음 토글                │
│  [c]           결정 확정                │
│  [d]           제안 무시                │
└────────────────────────────────────────┘
```

### 5.41 고대비 모드 (Part 6.4)

```
고대비 모드 색상 팔레트:

배경:
├─ Primary: #FFFFFF (순백)
├─ Secondary: #F8F8F8 (매우 연한 회색)
├─ Tertiary: #EEEEEE (연한 회색)
└─ Inverse: #000000 (순흑)

텍스트:
├─ Primary: #000000 (순흑)
├─ Secondary: #333333 (진한 회색)
├─ Disabled: #666666 (회색)
└─ Inverse: #FFFFFF (순백)

인터랙티브:
├─ Link: #0000EE (표준 링크 파랑)
├─ Link Visited: #551A8B (방문 보라)
├─ Focus: #000000 (3px solid)
└─ Button: #000000 bg, #FFFFFF text

상태:
├─ Error: #CC0000 (진한 빨강)
├─ Success: #006600 (진한 초록)
├─ Warning: #CC6600 (진한 주황)
└─ Info: #0066CC (진한 파랑)

테두리:
├─ Default: #000000 (1px solid)
├─ Focus: #000000 (3px solid)
└─ Divider: #333333

고대비 모드 버튼:
┌─────────────────┐
│  ■ 확인         │ ← Black bg, White text
├─────────────────┤
│  □ 취소         │ ← White bg, Black border/text
└─────────────────┘

고대비 모드 카드:
┌─────────────────────────────────────┐
│ ┌─────────────────────────────────┐ │
│ │  미팅 제목                      │ │ ← 2px Black border
│ │  ─────────────────────          │ │
│ │  시간: 14:00 - 15:00           │ │
│ │  [■ 준비하기] [□ 상세 보기]    │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘

고대비 감지 (CSS):
├─ @media (prefers-contrast: more)
├─ @media (forced-colors: active)
└─ -ms-high-contrast: active (Legacy IE)
```

### 5.42 스크린 리더 전용 텍스트 (Part 6.4)

```
시각적으로 숨김, 스크린 리더는 읽음:

.sr-only 스타일:
├─ Position: absolute
├─ Width: 1px
├─ Height: 1px
├─ Padding: 0
├─ Margin: -1px
├─ Overflow: hidden
├─ Clip: rect(0, 0, 0, 0)
├─ White Space: nowrap
└─ Border: 0

사용 예시:

아이콘 버튼:
<button>
  <Icon name="settings" />
  <span class="sr-only">설정 열기</span>
</button>

배지:
<Badge color="red">
  3
  <span class="sr-only">개의 읽지 않은 알림</span>
</Badge>

상태 표시:
<div aria-live="polite">
  <Spinner />
  <span class="sr-only">저장 중입니다. 잠시만 기다려주세요.</span>
</div>

진행률:
<ProgressBar value={75} />
<span class="sr-only">75% 완료됨</span>

이미지 대체 텍스트:
<img src="chart.png" alt="" />
<span class="sr-only">
  2024년 4분기 매출 차트. 10월 100만원, 11월 150만원, 12월 200만원.
</span>

테이블 요약:
<table>
  <caption class="sr-only">
    오늘의 미팅 목록. 총 3개의 미팅이 있습니다.
  </caption>
  ...
</table>

폼 필드 설명:
<label for="email">이메일</label>
<input id="email" />
<span id="email-hint" class="sr-only">
  회사 이메일 주소를 입력하세요. 예: name@company.com
</span>
```

### 5.43 애니메이션 접근성 (Part 6.4)

```
모션 감소 (prefers-reduced-motion) 대응:

기본 애니메이션:
├─ Duration: 200-300ms
├─ Easing: ease-out
└─ Transform: translate, scale, opacity

모션 감소 시:
├─ Duration: 0ms 또는 극히 짧게 (50ms)
├─ 페이드만 유지 (위치 이동 없음)
└─ 스케일 변환 제거

예시 CSS:
```css
.card {
  transition: transform 300ms, opacity 300ms;
}

@media (prefers-reduced-motion: reduce) {
  .card {
    transition: opacity 50ms;
    transform: none !important;
  }
}
```

애니메이션 유형별 대응:

페이지 전환:
├─ 기본: Slide + Fade (300ms)
└─ 감소: Fade only (100ms)

모달 열기:
├─ 기본: Scale up + Fade (200ms)
└─ 감소: Fade only (100ms)

로딩 스피너:
├─ 기본: 360° 회전
└─ 감소: Pulse (크기 변환 없음)

토스트 알림:
├─ 기본: Slide in from bottom
└─ 감소: Fade in

드롭다운:
├─ 기본: Scale Y + Fade
└─ 감소: Instant 표시

카드 호버:
├─ 기본: translateY(-2px) + shadow
└─ 감소: shadow만 변경

자동 슬라이드/캐러셀:
├─ 기본: 자동 진행 (5초 간격)
└─ 감소: 자동 진행 중지, 수동만

깜빡임 금지:
├─ 초당 3회 이상 깜빡임 금지 (광과민성 발작 위험)
├─ 깜빡이는 영역: 화면의 25% 미만
└─ 사용자 제어 가능해야 함
```

---

## 6. 공통 컴포넌트

### 6.1 내비게이션 탭

#### 레이아웃

```
┌────────────────────────────────────────┐
│  [🟢 지금]  [📅 오늘]  [🔍 검색]  [⚙️]  │
└────────────────────────────────────────┘
```

#### 상세 스펙

```
Container:
├─ Width: 100%
├─ Height: 56px
├─ Background: #FFFFFF
├─ Border Bottom: 1px solid #E5E7EB (Gray 200)
├─ Display: flex
├─ Padding: 0 8px
└─ Position: sticky
    Top: 0
    z-index: 100

Tab Button:
├─ Flex: 1 (동일 너비)
├─ Height: 56px
├─ Background: transparent
├─ Border: none
├─ Display: flex
├─ Flex Direction: column
├─ Align Items: center
├─ Justify Content: center
├─ Gap: 4px
├─ Cursor: pointer
└─ Transition: 200ms

Tab Icon:
├─ Size: 24×24px
├─ Color: #9CA3AF (Gray 400) [Inactive]
└─ Color: #3B82F6 (Blue 500) [Active]

Tab Label:
├─ Font: Pretendard Medium
├─ Size: 12px
├─ Color: #6B7280 (Gray 500) [Inactive]
└─ Color: #3B82F6 (Blue 500) [Active]

Active Indicator:
├─ Position: absolute
├─ Bottom: 0
├─ Width: 100%
├─ Height: 2px
├─ Background: #3B82F6 (Blue 500)
└─ Transition: 300ms cubic-bezier(0.4, 0, 0.2, 1)

Hover State (Inactive):
├─ Background: #F9FAFB (Gray 50)
└─ Transition: 200ms
```

### 6.2 버튼 컴포넌트

#### Primary Button

```
Default State:
├─ Background: #3B82F6 (Blue 500)
├─ Color: #FFFFFF
├─ Font: Pretendard SemiBold
├─ Size: 14px
├─ Height: 40px
├─ Padding: 0 16px
├─ Border: none
├─ Border Radius: 8px (md)
├─ Cursor: pointer
└─ Transition: 200ms

Hover:
├─ Background: #2563EB (Blue 600)
└─ Shadow: Shadow 2

Active:
├─ Background: #1D4ED8 (Blue 700)
└─ Transform: scale(0.98)

Disabled:
├─ Background: #E5E7EB (Gray 200)
├─ Color: #9CA3AF (Gray 400)
├─ Cursor: not-allowed
└─ Opacity: 0.6

Loading:
├─ Opacity: 0.7
├─ Cursor: wait
└─ Icon: Spinner animation
```

#### Secondary Button

```
Default State:
├─ Background: transparent
├─ Color: #6B7280 (Gray 500)
├─ Font: Pretendard Medium
├─ Border: 1px solid #D1D5DB (Gray 300)
└─ Other: same as Primary

Hover:
├─ Background: #F3F4F6 (Gray 100)
├─ Border: #9CA3AF (Gray 400)
└─ Color: #374151 (Gray 700)
```

#### Danger Button

```
Default State:
├─ Background: #EF4444 (Red 500)
├─ Color: #FFFFFF
└─ Other: same as Primary

Hover:
├─ Background: #DC2626 (Red 600)
└─ Shadow: Shadow 2
```

### 6.3 입력 필드

#### Text Input

```
Default State:
├─ Width: 100%
├─ Height: 40px
├─ Background: #FFFFFF
├─ Border: 1px solid #D1D5DB (Gray 300)
├─ Border Radius: 8px (md)
├─ Padding: 0 12px
├─ Font: Pretendard Regular
├─ Size: 14px
├─ Color: #111827 (Gray 900)
└─ Transition: 200ms

Focus:
├─ Border: 2px solid #3B82F6 (Blue 500)
├─ Outline: none
└─ Box Shadow: 0 0 0 3px rgba(59, 130, 246, 0.1)

Error:
├─ Border: 2px solid #EF4444 (Red 500)
└─ Box Shadow: 0 0 0 3px rgba(239, 68, 68, 0.1)

Disabled:
├─ Background: #F3F4F6 (Gray 100)
├─ Color: #9CA3AF (Gray 400)
└─ Cursor: not-allowed

Placeholder:
├─ Color: #9CA3AF (Gray 400)
└─ Font Style: normal
```

#### Label

```
Label:
├─ Font: Pretendard Medium
├─ Size: 14px
├─ Color: #374151 (Gray 700)
├─ Margin Bottom: 6px
└─ Display: block

Required Indicator:
├─ Color: #EF4444 (Red 500)
├─ Content: "*"
└─ Margin Left: 2px

Helper Text:
├─ Font: Pretendard Regular
├─ Size: 12px
├─ Color: #6B7280 (Gray 500)
└─ Margin Top: 4px

Error Message:
├─ Font: Pretendard Regular
├─ Size: 12px
├─ Color: #EF4444 (Red 500)
├─ Margin Top: 4px
└─ Display: flex + gap (with icon)
```

### 6.4 토스트 알림

#### 레이아웃

```
┌────────────────────────────────┐
│ ✓  확정이 완료되었습니다        │
└────────────────────────────────┘
```

#### 상세 스펙

```
Container:
├─ Position: fixed
├─ Bottom: 24px
├─ Right: 24px
├─ Width: auto
├─ Min Width: 280px
├─ Max Width: 400px
├─ Background: #111827 (Gray 900)
├─ Color: #FFFFFF
├─ Border Radius: 12px (lg)
├─ Padding: 16px
├─ Shadow: Shadow 3
├─ z-index: 10000
└─ Animation: slide up + fade in

Success Toast:
├─ Icon: CheckCircle (20×20px)
├─ Icon Color: #10B981 (Green 500)
└─ Display: flex + gap

Error Toast:
├─ Icon: XCircle (20×20px)
├─ Icon Color: #EF4444 (Red 500)
└─ Background: #7F1D1D (Red 900)

Info Toast:
├─ Icon: Info (20×20px)
└─ Icon Color: #3B82F6 (Blue 500)

Message:
├─ Font: Pretendard Medium
├─ Size: 14px
├─ Line Height: 20px
└─ Flex: 1

Auto Dismiss:
├─ Duration: 3000ms (3초)
└─ Progress Bar (optional):
    Height: 2px
    Background: #FFFFFF
    Position: absolute bottom
```

---

## 7. 애니메이션 스펙

### 7.1 페이지 전환

```
Transition Type: Fade + Slide

Enter Animation:
├─ From: opacity: 0, translateX(20px)
├─ To: opacity: 1, translateX(0)
├─ Duration: 300ms
└─ Easing: cubic-bezier(0.4, 0, 0.2, 1)

Exit Animation:
├─ From: opacity: 1, translateX(0)
├─ To: opacity: 0, translateX(-20px)
├─ Duration: 200ms
└─ Easing: cubic-bezier(0.4, 0, 1, 1)
```

### 7.2 HUD 상태 전환

```
Idle → Alert (확장):
├─ Transform: scale(1) → scale(1.05) → scale(1)
├─ Opacity: 1
├─ Height: 60px → 180px
├─ Duration: 400ms
└─ Easing: cubic-bezier(0.34, 1.56, 0.64, 1) (bounce)

Alert → Idle (축소):
├─ Transform: scale(1) → scale(0.95) → scale(1)
├─ Opacity: 1
├─ Height: 180px → 60px
├─ Duration: 300ms
└─ Easing: cubic-bezier(0.4, 0, 0.2, 1)
```

### 7.3 리스트 아이템 등장

```
Stagger Animation (순차 등장):
├─ Item Delay: 50ms (between items)
├─ From: opacity: 0, translateY(10px)
├─ To: opacity: 1, translateY(0)
├─ Duration: 300ms
└─ Easing: cubic-bezier(0.4, 0, 0.2, 1)

Example (3개 아이템):
├─ Item 1: delay 0ms
├─ Item 2: delay 50ms
└─ Item 3: delay 100ms
```

### 7.4 버튼 클릭 피드백

```
Ripple Effect:
├─ Origin: 클릭 위치
├─ From: scale(0), opacity: 0.5
├─ To: scale(4), opacity: 0
├─ Duration: 600ms
├─ Easing: cubic-bezier(0, 0, 0.2, 1)
└─ Background: currentColor

Scale Effect:
├─ Active: scale(0.98)
├─ Duration: 100ms
└─ Easing: ease-out
```

### 7.5 로딩 스피너

```
Spinner Animation:
├─ Type: Circular rotation
├─ Duration: 1000ms
├─ Iteration: infinite
├─ Easing: linear
└─ SVG:
    <svg width="20" height="20" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="8"
        stroke="currentColor"
        stroke-width="2"
        stroke-dasharray="50.265"
        stroke-dashoffset="12.566"
        fill="none" />
    </svg>
```

### 7.6 모달 등장/사라짐

```
Modal Enter:
├─ Overlay: opacity 0 → 1 (300ms)
├─ Container:
│   ├─ From: scale(0.95), opacity: 0
│   ├─ To: scale(1), opacity: 1
│   ├─ Duration: 300ms
│   └─ Easing: cubic-bezier(0, 0, 0.2, 1)

Modal Exit:
├─ Overlay: opacity 1 → 0 (200ms)
├─ Container:
│   ├─ From: scale(1), opacity: 1
│   ├─ To: scale(0.95), opacity: 0
│   ├─ Duration: 200ms
│   └─ Easing: cubic-bezier(0.4, 0, 1, 1)
```

---

## 8. 반응형 가이드

### 8.1 브라우저 확장 (고정)

```
Chrome Side Panel:
├─ Width: 400px (고정, 변경 불가)
├─ Height: 100vh (전체 높이)
└─ Scroll: vertical only

주의사항:
├─ 가로 스크롤 금지
├─ 모든 콘텐츠는 400px 내 표시
└─ 긴 텍스트는 줄바꿈 (word-break: break-word)
```

### 8.2 HUD (Always-on-Top)

```
Desktop:
├─ Position: fixed (top-right)
├─ Top: 20px
├─ Right: 20px
└─ Draggable: 향후 추가

Small Screen (< 1024px):
├─ Position: fixed (bottom-center)
├─ Bottom: 20px
├─ Left: 50%
├─ Transform: translateX(-50%)
└─ Width: min(375px, calc(100vw - 40px))
```

---

## 9. 다크모드 (향후)

### 9.1 다크모드 컬러

```
Background:
├─ Main: #0F172A (Slate 900)
├─ Card: #1E293B (Slate 800)
└─ Elevated: #334155 (Slate 700)

Text:
├─ Primary: #F1F5F9 (Slate 100)
├─ Secondary: #CBD5E1 (Slate 300)
└─ Tertiary: #94A3B8 (Slate 400)

Border:
├─ Default: #334155 (Slate 700)
└─ Hover: #475569 (Slate 600)

Note: MVP에서는 라이트 모드만 구현
```

---

## 10. 디자인 QA 체크리스트

### 10.1 디자인 완성도

```
□ 모든 화면 상태 디자인됨 (Idle, Hover, Active, Disabled)
□ 에러 상태 디자인됨
□ 로딩 상태 디자인됨
□ Empty State 디자인됨
□ 모든 인터랙션 프로토타입 연결됨
□ 컴포넌트 일관성 확인 (버튼, 입력, 카드)
□ 색상 접근성 확인 (대비 4.5:1 이상)
□ 타이포그래피 계층 명확
□ 간격 시스템 준수 (4px grid)
□ 아이콘 일관성 (크기, 스타일)
```

### 10.2 기술 전달 준비

```
□ Figma 파일 정리 (레이어 명명 규칙)
□ Auto Layout 적용 (반응형)
□ 컴포넌트화 완료 (재사용)
□ Variants 설정 (상태별)
□ Design Tokens 정의 (색상, 간격)
□ Dev Mode 활성화 (개발자 인스펙션)
□ 주석 추가 (특수 케이스)
□ 프로토타입 공유 링크 생성
```

### 10.3 사용자 테스트 준비

```
□ 클릭 가능한 프로토타입
□ 실제 데이터로 채워짐 (Lorem Ipsum ✗)
□ 주요 플로우 시나리오 3개 준비
□ 에러 케이스 시뮬레이션
□ 모바일/데스크톱 뷰 준비
```

---

## 부록: Figma 파일 템플릿 구조

```
📁 Onno Design System
│
├─ 📄 Cover
│  └─ 프로젝트 소개, 팀, 버전 정보
│
├─ 🎨 1. Design System
│  ├─ 1.1 Colors
│  │  ├─ Primary Colors (컬러 스와치)
│  │  ├─ Neutral Colors
│  │  └─ Semantic Colors
│  │
│  ├─ 1.2 Typography
│  │  ├─ H1, H2, H3 샘플
│  │  ├─ Body Large, Regular, Small
│  │  └─ Caption
│  │
│  ├─ 1.3 Spacing
│  │  └─ 0, 1, 2, 3, 4, 6, 8, 12, 16 (박스로 표시)
│  │
│  ├─ 1.4 Icons
│  │  └─ 주요 아이콘 모음 (20×20px)
│  │
│  └─ 1.5 Components
│     ├─ Button (Primary, Secondary, Danger)
│     ├─ Input (Default, Focus, Error)
│     ├─ Card
│     ├─ Badge
│     ├─ Navigation
│     └─ Toast
│
├─ 🖼️ 2. Screens
│  ├─ 2.1 Now Screen
│  │  ├─ Frame: Idle (300×60)
│  │  ├─ Frame: Alert L1 (300×120)
│  │  ├─ Frame: Alert L2 (375×180)
│  │  └─ Frame: Alert L3 (375×250)
│  │
│  ├─ 2.2 Today Screen
│  │  ├─ Frame: Morning View (400×600)
│  │  ├─ Frame: Preparation Modal
│  │  └─ Frame: Confirmation Modal
│  │
│  └─ 2.3 Search Screen
│     ├─ Frame: Empty State (400×600)
│     ├─ Frame: Search Results
│     └─ Frame: Detail View
│
├─ 🔄 3. Flows
│  ├─ 3.1 Meeting Flow
│  │  └─ 화살표로 연결된 전체 여정
│  │
│  ├─ 3.2 Onboarding Flow
│  │  └─ Step 1 → 2 → 3 → 4 → 5
│  │
│  └─ 3.3 Error States
│     ├─ Network Error
│     ├─ STT Failed
│     └─ API Error
│
└─ 📱 4. Prototype
   └─ Interactive Prototype
      ├─ 시작: Today 화면
      ├─ 클릭: 각 버튼 연결
      └─ 전환: 페이지 애니메이션
```

---

**다음 단계:**

1. **Figma 파일 생성**: 이 스펙대로 Figma에서 디자인 시작
2. **컴포넌트 우선**: Design System 먼저 완성 후 화면 작업
3. **프로토타입 연결**: 모든 화면 완성 후 인터랙션 추가
4. **개발자 전달**: Dev Mode로 CSS 값 자동 추출

---

**문서 끝**
