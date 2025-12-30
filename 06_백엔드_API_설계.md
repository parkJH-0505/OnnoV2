# Onno 백엔드 API 설계

**버전**: 2.1 (Part 6.4 접근성 - 접근성 설정 API, 키보드 단축키, 접근성 Analytics)
**작성일**: 2025-12-29 (최종 업데이트: 2025-12-30)
**대상**: 백엔드 개발자
**목적**: 완전한 API 명세 및 데이터베이스 스키마 정의
**Part 1.4 업데이트**: Notion OAuth 및 저장 API 추가
**Part 1.5 업데이트**: 미팅 준비 데이터 및 알림 API 추가
**Part 2 업데이트**: Today 화면 데이터 및 카드 상태 관리 API 추가
**Part 3 업데이트**: HUD 실시간 세션, 알림 시스템, Gap 분석, 사용자 응답 처리 API 추가
**Part 4 업데이트**: 확정 모달 API, 결정 사항 관리, Notion 저장 API, 완료 처리 추가
**Part 5 업데이트**: 시맨틱 검색 API, 벡터 검색, 결과 랭킹, 필터링, 관련 미팅 API 추가
**Part 5.2 업데이트**: 설정 API, OAuth 통합 관리, 알림 설정, 프로필/계정 관리, 데이터 프라이버시 추가
**Part 6.1 업데이트**: 에러 분류 시스템, 에러 응답 표준화, 복구 서비스, 에러 로깅/통계, 에러 미들웨어, 국제화, 성능 지표 추가
**Part 6.2 업데이트**: 스트리밍 응답 API, 진행률 추적 서비스, 장기 실행 작업 패턴, 로딩 힌트 메타데이터, 폴링 API, 로딩 성능 메트릭 추가
**Part 6.3 업데이트**: 빈 상태 콘텐츠 API, 첫 사용자 감지 서비스, 빈 상태 Analytics 엔드포인트, 빈 상태 DB 스키마 추가
**Part 6.4 업데이트**: 접근성 설정 API, 키보드 단축키 설정, 접근성 Analytics 엔드포인트, 접근성 DB 스키마 추가

---

## 📋 목차

1. [기술 스택](#1-기술-스택)
2. [시스템 아키텍처](#2-시스템-아키텍처)
3. [데이터베이스 설계](#3-데이터베이스-설계)
4. [API 엔드포인트](#4-api-엔드포인트)
5. [WebSocket 이벤트](#5-websocket-이벤트)
6. [인증 및 인가](#6-인증-및-인가)
7. [AI 파이프라인](#7-ai-파이프라인)
8. [외부 통합](#8-외부-통합)
9. [에러 처리](#9-에러-처리)
10. [성능 및 확장성](#10-성능-및-확장성)
11. [보안](#11-보안)
12. [배포 및 모니터링](#12-배포-및-모니터링)

---

## 1. 기술 스택

### 1.1 Core Stack

```json
{
  "runtime": "Node.js 20 LTS",
  "framework": "Next.js 14 (App Router)",
  "language": "TypeScript 5.3",
  "orm": "Prisma 5.0",
  "validation": "Zod 3.22"
}
```

**선택 이유:**

```
Next.js 14:
├─ API Routes (RESTful)
├─ Server Actions (RPC-style)
├─ Edge Runtime (저지연)
├─ Vercel 배포 간편
└─ 프론트엔드와 통합 가능 (향후)

Prisma:
├─ Type-safe ORM
├─ Migration 관리
├─ Client 자동 생성
└─ PostgreSQL 최적화

Zod:
├─ Runtime validation
├─ TypeScript 타입 추론
└─ API 입력 검증
```

### 1.2 데이터베이스

```json
{
  "primary": "PostgreSQL 16 (Supabase)",
  "vector": "Pinecone (Serverless)",
  "cache": "Redis (Upstash)",
  "storage": "S3 Compatible (Supabase Storage)"
}
```

**선택 이유:**

```
PostgreSQL:
├─ ACID 보장 (데이터 무결성)
├─ JSON 지원 (유연성)
├─ Full-text search
└─ Supabase (관리형, 무료 tier)

Pinecone:
├─ 벡터 검색 전용
├─ Serverless (비용 효율)
├─ 빠른 검색 (<100ms)
└─ OpenAI Embeddings 호환

Redis:
├─ 세션 캐싱
├─ API Rate Limiting
└─ 실시간 데이터 임시 저장
```

### 1.3 AI & ML

```json
{
  "stt": "Deepgram Nova-2",
  "llm": "OpenAI GPT-4 Turbo",
  "embeddings": "OpenAI text-embedding-3-small",
  "alternative-llm": "Anthropic Claude 3.5 Sonnet"
}
```

### 1.4 실시간 통신

```json
{
  "websocket": "Socket.IO 4.6",
  "pubsub": "Redis Pub/Sub"
}
```

### 1.5 외부 통합

```json
{
  "notion": "@notionhq/client 2.2",
  "salesforce": "jsforce 2.0",
  "google-calendar": "googleapis",
  "slack": "@slack/web-api 6.10"
}
```

---

## 2. 시스템 아키텍처

### 2.1 전체 구조

```
┌─────────────────────────────────────────────────────────┐
│                     Client Layer                         │
│  (Browser Extension, HUD, Web App)                       │
└────────────┬───────────────────────────┬─────────────────┘
             │ REST API                  │ WebSocket
             │                           │
┌────────────▼───────────────────────────▼─────────────────┐
│                   Next.js API Server                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │ API Routes  │  │ WebSocket   │  │ Edge API    │      │
│  │ /api/*      │  │ Socket.IO   │  │ (Regional)  │      │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘      │
│         │                │                │              │
│  ┌──────▼────────────────▼────────────────▼──────┐      │
│  │          Service Layer (Business Logic)       │      │
│  │  - MeetingService                             │      │
│  │  - DecisionService                            │      │
│  │  - SearchService                              │      │
│  │  - IntegrationService                         │      │
│  └──────┬────────────────┬────────────────┬──────┘      │
└─────────┼────────────────┼────────────────┼─────────────┘
          │                │                │
┌─────────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐
│   PostgreSQL   │  │  Pinecone   │  │    Redis    │
│   (Supabase)   │  │  (Vector)   │  │   (Cache)   │
└────────────────┘  └─────────────┘  └─────────────┘
          │
          │
┌─────────▼──────────────────────────────────────────────┐
│                  AI Pipeline                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ Deepgram │  │ GPT-4    │  │ Claude   │             │
│  │ (STT)    │  │ (LLM)    │  │ (LLM)    │             │
│  └──────────┘  └──────────┘  └──────────┘             │
└─────────────────────────────────────────────────────────┘
          │
          │
┌─────────▼──────────────────────────────────────────────┐
│                External Integrations                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ Notion   │  │Salesforce│  │ Slack    │             │
│  └──────────┘  └──────────┘  └──────────┘             │
└─────────────────────────────────────────────────────────┘
```

### 2.2 요청 흐름

```
사용자 요청
    ↓
Next.js API Route
    ↓
Middleware (인증, Rate Limit)
    ↓
Zod Validation (입력 검증)
    ↓
Service Layer (비즈니스 로직)
    ↓
Prisma Client (데이터베이스)
    ↓
Response (JSON)
```

---

## 3. 데이터베이스 설계

### 3.1 Prisma Schema

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// User & Authentication
// ============================================

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String
  avatar        String?

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  meetings      Meeting[]
  integrations  Integration[]

  @@map("users")
}

// ============================================
// Meeting
// ============================================

model Meeting {
  id            String       @id @default(cuid())
  userId        String

  title         String
  company       String?
  platform      Platform     @default(ZOOM)
  status        MeetingStatus @default(SCHEDULED)

  startTime     DateTime
  endTime       DateTime?
  duration      Int?         // 분 단위

  participants  Json?        // { name, email, role }[]
  metadata      Json?        // { zoomId, meetUrl, etc }

  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt

  user          User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  transcripts   Transcript[]
  decisions     Decision[]
  insights      Insight[]
  actions       Action[]

  @@index([userId, startTime])
  @@index([company])
  @@map("meetings")
}

enum Platform {
  ZOOM
  GOOGLE_MEET
  TEAMS
  OTHER
}

enum MeetingStatus {
  SCHEDULED
  ONGOING
  COMPLETED
  CANCELLED
}

// ============================================
// Transcript (실시간 전사)
// ============================================

model Transcript {
  id            String    @id @default(cuid())
  meetingId     String

  timestamp     DateTime  @default(now())
  speaker       String    // 발화자 이름 또는 "Speaker 1"
  text          String    @db.Text
  confidence    Float?    // STT 신뢰도 (0-1)

  meeting       Meeting   @relation(fields: [meetingId], references: [id], onDelete: Cascade)

  @@index([meetingId, timestamp])
  @@map("transcripts")
}

// ============================================
// Decision (결정 8요소)
// ============================================

model Decision {
  id            String    @id @default(cuid())
  meetingId     String

  goal          String?   @db.Text
  evidence      Json?     // { claim, source, timestamp }[]
  assumptions   Json?     // string[]
  risks         Json?     // { risk, impact, probability }[]
  unknowns      Json?     // string[]
  decision      String?   @db.Text
  actions       Json?     // → Action 테이블로 정규화
  outcome       String?   @db.Text

  completeness  Int       @default(0) // 0-100 (8요소 채워진 정도)

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  meeting       Meeting   @relation(fields: [meetingId], references: [id], onDelete: Cascade)

  @@index([meetingId])
  @@map("decisions")
}

// ============================================
// Insight (인사이트 추출)
// ============================================

model Insight {
  id            String       @id @default(cuid())
  meetingId     String

  type          InsightType
  content       String       @db.Text
  source        String?      // 발화 원문
  timestamp     DateTime     @default(now())
  confidence    Float?       // AI 신뢰도

  metadata      Json?        // { speaker, context, etc }

  meeting       Meeting      @relation(fields: [meetingId], references: [id], onDelete: Cascade)

  @@index([meetingId, type])
  @@map("insights")
}

enum InsightType {
  METRIC        // 숫자, 지표 (MAU 10만)
  CLAIM         // 주장, 사실 (경쟁사는 3곳)
  CONCERN       // 우려 사항 (보안 걱정됨)
  QUESTION      // 미해결 질문
  COMMITMENT    // 약속 (다음 주까지)
}

// ============================================
// Action (액션 아이템)
// ============================================

model Action {
  id            String       @id @default(cuid())
  meetingId     String

  title         String
  description   String?      @db.Text
  assignee      String?      // 담당자 이름
  assigneeEmail String?
  dueDate       DateTime?
  status        ActionStatus @default(PENDING)

  externalId    String?      // Notion, Salesforce 등 외부 ID
  externalUrl   String?

  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt
  completedAt   DateTime?

  meeting       Meeting      @relation(fields: [meetingId], references: [id], onDelete: Cascade)

  @@index([meetingId, status])
  @@index([assigneeEmail, status])
  @@map("actions")
}

enum ActionStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

// ============================================
// Alert (갭 감지 알림)
// ============================================

model Alert {
  id            String     @id @default(cuid())
  meetingId     String

  level         Int        // 1, 2, 3
  title         String
  message       String     @db.Text
  suggestedQuestion String? @db.Text
  reason        Json?      // string[]

  shown         Boolean    @default(false)
  response      AlertResponse? // 사용자 응답

  createdAt     DateTime   @default(now())

  @@index([meetingId, createdAt])
  @@map("alerts")
}

enum AlertResponse {
  ASKED         // 물어봄
  DISMISSED     // 무시
  RISK_ACCEPTED // 위험 감수 (Level 3)
}

// ============================================
// Integration (외부 도구 연동)
// ============================================

model Integration {
  id            String          @id @default(cuid())
  userId        String

  platform      IntegrationType
  enabled       Boolean         @default(true)

  credentials   String?         @db.Text // 암호화된 토큰
  metadata      Json?           // { workspaceId, databaseId, etc }

  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt

  user          User            @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, platform])
  @@map("integrations")
}

enum IntegrationType {
  NOTION
  SALESFORCE
  SLACK
  GOOGLE_CALENDAR
}

// ============================================
// Embedding (벡터 검색용)
// ============================================

model Embedding {
  id            String    @id @default(cuid())
  meetingId     String
  chunkIndex    Int       // 분할된 전사의 인덱스

  text          String    @db.Text
  vectorId      String    // Pinecone의 Vector ID

  createdAt     DateTime  @default(now())

  @@unique([meetingId, chunkIndex])
  @@index([meetingId])
  @@map("embeddings")
}
```

### 3.2 인덱스 전략

```sql
-- 성능 최적화를 위한 추가 인덱스

-- 미팅 검색 (회사별, 날짜별)
CREATE INDEX idx_meetings_company_date ON meetings(company, start_time DESC);

-- 전사 전체 텍스트 검색
CREATE INDEX idx_transcripts_text_search ON transcripts USING gin(to_tsvector('english', text));

-- 액션 아이템 (담당자별 미완료)
CREATE INDEX idx_actions_assignee_pending ON actions(assignee_email, status) WHERE status != 'COMPLETED';

-- 알림 (미팅별 최신순)
CREATE INDEX idx_alerts_meeting_recent ON alerts(meeting_id, created_at DESC);
```

---

## 4. API 엔드포인트

### 4.1 Authentication

#### POST /api/auth/signup

```typescript
// Request
{
  "email": "user@example.com",
  "name": "홍길동",
  "password": "secure_password"
}

// Response 201
{
  "user": {
    "id": "usr_123",
    "email": "user@example.com",
    "name": "홍길동"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST /api/auth/login

```typescript
// Request
{
  "email": "user@example.com",
  "password": "secure_password"
}

// Response 200
{
  "user": { ... },
  "token": "..."
}
```

#### POST /api/auth/oauth/google

```typescript
// Request (Part 1.3: 구글 로그인)
{
  "code": "google_oauth_code",
  "redirectUri": "https://onno.ai/auth/callback"
}

// Response 200
{
  "user": {
    "id": "usr_123",
    "email": "user@gmail.com",
    "name": "민수",
    "provider": "google",
    "createdAt": "2025-12-29T10:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "demoDataMigrated": true  // 체험 데이터 이관 완료 여부
}
```

#### POST /api/auth/oauth/github

```typescript
// Request (Part 1.3: GitHub 로그인)
{
  "code": "github_oauth_code",
  "redirectUri": "https://onno.ai/auth/callback"
}

// Response 200
{
  "user": { ... },
  "token": "...",
  "demoDataMigrated": true
}
```

#### POST /api/auth/signup/email

```typescript
// Request (Part 1.3: 이메일 가입)
{
  "email": "user@example.com",
  "password": "secure_password",
  "termsAccepted": true
}

// Response 201
{
  "user": {
    "id": "usr_123",
    "email": "user@example.com",
    "provider": "email",
    "emailVerified": false,
    "createdAt": "2025-12-29T10:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "demoDataMigrated": true
}

// Error 400
{
  "error": "EMAIL_ALREADY_EXISTS",
  "message": "이미 가입된 이메일입니다",
  "suggestedProvider": "google"  // 해당 이메일로 가입한 방법
}
```

#### POST /api/auth/migrate-demo-data

```typescript
// Request (Part 1.3: 체험 데이터 이관)
{
  "userId": "usr_123",
  "demoSessionId": "demo_session_abc123"  // 쿠키에서 가져옴
}

// Response 200
{
  "success": true,
  "migratedItems": {
    "meetings": 1,
    "decisions": 3,
    "insights": 5,
    "actions": 2
  }
}

// Response 404 (체험 데이터 없음 or 만료)
{
  "error": "DEMO_DATA_NOT_FOUND",
  "message": "체험 데이터를 찾을 수 없습니다 (7일 경과 또는 삭제됨)"
}
```

### 4.2 Analytics (설치 추적 및 가입 이벤트)

#### POST /api/analytics/installation

```typescript
// Request (설치 시뮬레이션 이벤트 추적)
{
  "event": "started" | "completed" | "abandoned",
  "browser": "Chrome" | "Edge" | "Brave",
  "timestamp": "2025-12-29T10:00:00Z"
}

// Response 200
{
  "success": true
}
```

**주의사항:**
- 실제 파일 다운로드는 없음
- 단순 이벤트 로깅만 수행
- 사용자 유입 경로 분석용

#### POST /api/analytics/signup

```typescript
// Request (Part 1.3: 회원가입 이벤트 추적)
{
  "event": "signup_modal_shown" | "signup_attempted" | "signup_completed" | "signup_abandoned",
  "method": "google" | "github" | "email" | null,
  "timestamp": "2025-12-29T10:00:00Z",
  "metadata": {
    "demoCompleted": true,
    "timeFromDemoEnd": 1500,  // 밀리초 (1.5초)
    "laterClicked": false
  }
}

// Response 200
{
  "success": true
}
```

**추적 이벤트:**
- `signup_modal_shown`: 가입 모달 표시됨
- `signup_attempted`: 가입 버튼 클릭 (구글/GitHub/이메일)
- `signup_completed`: 가입 완료 (계정 생성 성공)
- `signup_abandoned`: "나중에" 클릭으로 이탈

**목표 지표:**
- 모달 표시 → 가입 시도: > 45%
- 가입 시도 → 가입 완료: > 93%
- 전체 전환율 (데모 완료 → 가입): > 42%

---

### 4.3 Meetings

#### GET /api/meetings

```typescript
// Query Parameters
?from=2025-01-01&to=2025-12-31&company=A사&status=completed&limit=20&offset=0

// Response 200
{
  "meetings": [
    {
      "id": "mtg_123",
      "title": "A사 2차 투자 검토",
      "company": "A사",
      "platform": "ZOOM",
      "status": "COMPLETED",
      "startTime": "2025-12-29T10:00:00Z",
      "endTime": "2025-12-29T11:00:00Z",
      "duration": 60,
      "participants": [
        { "name": "김대표", "email": "ceo@acompany.com", "role": "CEO" }
      ],
      "summary": {
        "decisionCount": 3,
        "insightCount": 12,
        "actionCount": 5
      }
    }
  ],
  "total": 150,
  "limit": 20,
  "offset": 0
}
```

#### GET /api/meetings/:id

```typescript
// Response 200
{
  "meeting": {
    "id": "mtg_123",
    "title": "A사 2차 투자 검토",
    "company": "A사",
    "platform": "ZOOM",
    "status": "COMPLETED",
    "startTime": "2025-12-29T10:00:00Z",
    "endTime": "2025-12-29T11:00:00Z",
    "duration": 60,
    "participants": [...],
    "transcript": [
      {
        "id": "tr_1",
        "timestamp": "2025-12-29T10:05:23Z",
        "speaker": "김대표",
        "text": "저희 MAU는 현재 10만입니다.",
        "confidence": 0.95
      }
    ],
    "decisions": [
      {
        "id": "dec_1",
        "goal": "A사 투자 진행 여부 결정",
        "evidence": [...],
        "decision": "DD 진행 합의",
        "completeness": 75
      }
    ],
    "insights": [
      {
        "id": "ins_1",
        "type": "METRIC",
        "content": "MAU 10만, 월 성장률 15%",
        "timestamp": "2025-12-29T10:05:23Z"
      }
    ],
    "actions": [
      {
        "id": "act_1",
        "title": "재무 자료 제출",
        "assignee": "김대표",
        "dueDate": "2025-01-10T00:00:00Z",
        "status": "PENDING"
      }
    ]
  }
}
```

#### POST /api/meetings

```typescript
// Request
{
  "title": "B사 1차 미팅",
  "company": "B사",
  "platform": "GOOGLE_MEET",
  "startTime": "2025-12-30T14:00:00Z",
  "participants": [
    { "name": "이대표", "email": "ceo@bcompany.com" }
  ]
}

// Response 201
{
  "meeting": {
    "id": "mtg_124",
    ...
  }
}
```

#### PATCH /api/meetings/:id

```typescript
// Request
{
  "status": "COMPLETED",
  "endTime": "2025-12-29T11:00:00Z"
}

// Response 200
{
  "meeting": { ... }
}
```

#### POST /api/meetings/:id/confirm

```typescript
// Request (회의 후 확정)
{
  "decisions": [
    {
      "goal": "투자 진행 여부",
      "decision": "DD 진행",
      "completeness": 80
    }
  ],
  "actions": [
    {
      "title": "재무 자료 제출",
      "assignee": "김대표",
      "assigneeEmail": "ceo@acompany.com",
      "dueDate": "2025-01-10"
    }
  ],
  "insights": [
    {
      "type": "METRIC",
      "content": "MAU 10만"
    }
  ]
}

// Response 200
{
  "success": true,
  "meeting": { ... },
  "integrations": {
    "notion": { "pageId": "..." },
    "salesforce": { "dealId": "..." },
    "slack": { "messageTs": "..." }
  }
}
```

### 4.3 Decisions

#### GET /api/decisions

```typescript
// Query: ?meetingId=mtg_123

// Response 200
{
  "decisions": [
    {
      "id": "dec_1",
      "meetingId": "mtg_123",
      "goal": "투자 진행 여부 결정",
      "evidence": [
        {
          "claim": "MAU 10만",
          "source": "김대표 발언",
          "timestamp": "2025-12-29T10:05:23Z"
        }
      ],
      "assumptions": ["시장 성장 지속"],
      "risks": [
        {
          "risk": "경쟁 심화",
          "impact": "HIGH",
          "probability": 0.6
        }
      ],
      "unknowns": ["CAC 채널별 상세"],
      "decision": "DD 진행 합의",
      "completeness": 75
    }
  ]
}
```

### 4.4 Search

#### POST /api/search

```typescript
// Request
{
  "query": "A사 CAC",
  "filters": {
    "company": "A사",
    "from": "2024-01-01",
    "to": "2025-12-31"
  },
  "limit": 10
}

// Response 200
{
  "results": [
    {
      "meetingId": "mtg_123",
      "meetingTitle": "A사 2차 미팅",
      "date": "2025-12-29",
      "excerpt": "CAC는 채널별로 온라인이 $85, 오프라인이 $120입니다.",
      "highlights": [
        {
          "text": "CAC는 채널별로 온라인이 $85",
          "start": 0,
          "end": 20
        }
      ],
      "relevance": 0.92
    }
  ],
  "total": 3
}
```

### 4.5 Actions

#### GET /api/actions

```typescript
// Query: ?status=PENDING&assignee=me&sort=dueDate

// Response 200
{
  "actions": [
    {
      "id": "act_1",
      "meetingId": "mtg_123",
      "meetingTitle": "A사 2차 미팅",
      "title": "재무 자료 제출",
      "assignee": "김대표",
      "assigneeEmail": "ceo@acompany.com",
      "dueDate": "2025-01-10T00:00:00Z",
      "status": "PENDING",
      "externalUrl": "https://notion.so/page123"
    }
  ]
}
```

#### PATCH /api/actions/:id

```typescript
// Request
{
  "status": "COMPLETED"
}

// Response 200
{
  "action": { ... }
}
```

### 4.6 Integrations

#### GET /api/integrations

```typescript
// Response 200
{
  "integrations": [
    {
      "id": "int_1",
      "platform": "NOTION",
      "enabled": true,
      "metadata": {
        "workspaceName": "내 워크스페이스",
        "databaseId": "db_123"
      }
    }
  ]
}
```

#### POST /api/integrations/:platform/connect

```typescript
// Request (Notion 예시)
{
  "code": "oauth_code_from_notion"
}

// Response 200
{
  "integration": {
    "id": "int_1",
    "platform": "NOTION",
    "enabled": true
  }
}
```

#### DELETE /api/integrations/:id

```typescript
// Response 204 No Content
```

### 4.7 Notion 통합 (Part 1.4)

#### GET /api/auth/notion

```typescript
// OAuth 시작 - 리다이렉트 URL 반환
// Query: ?redirectUri=https://onno.ai/app

// Response: Notion OAuth 페이지로 리다이렉트
// → https://api.notion.com/v1/oauth/authorize?client_id=...&redirect_uri=...
```

#### GET /api/auth/notion/callback

```typescript
// Notion OAuth 콜백 (Notion이 호출)
// Query: ?code=oauth_code&state=state_value

// 처리 흐름:
// 1. code로 access_token 교환
// 2. Workspace 정보 가져오기
// 3. 토큰 암호화 후 저장
// 4. 부모 창으로 메시지 전송 후 팝업 닫기

// Response: HTML (팝업 닫기 스크립트)
/*
<script>
  window.opener.postMessage({
    type: 'NOTION_AUTH_SUCCESS',
    payload: {
      workspaceId: 'ws_123',
      workspaceName: '민수의 워크스페이스',
      accessToken: 'secret_abc...'
    }
  }, '*');
  window.close();
</script>
*/
```

#### GET /api/integrations/notion/status

```typescript
// Notion 연결 상태 확인
// Header: Authorization: Bearer {token}

// Response 200 (연결됨)
{
  "isConnected": true,
  "workspace": {
    "id": "ws_123",
    "name": "민수의 워크스페이스",
    "icon": "https://notion.so/icon.png"
  },
  "connectedAt": "2025-12-30T10:00:00Z"
}

// Response 200 (미연결)
{
  "isConnected": false
}
```

#### POST /api/integrations/notion/save

```typescript
// 미팅 데이터를 Notion에 저장
// Header: Authorization: Bearer {token}

// Request
{
  "meetingId": "mtg_123",
  "meetingTitle": "A사 2차 투자 검토",
  "company": "A사",
  "startTime": "2025-12-30T10:00:00Z",
  "endTime": "2025-12-30T11:00:00Z",
  "decisions": [
    {
      "content": "DD 진행 합의",
      "details": {
        "startDate": "2025-01-06",
        "assignee": "김대표"
      }
    }
  ],
  "actions": [
    {
      "title": "재무 자료 제출",
      "assignee": "김대표",
      "dueDate": "2025-01-10"
    }
  ],
  "insights": [
    {
      "type": "METRIC",
      "content": "MAU 10만, 월 성장률 15%"
    },
    {
      "type": "METRIC",
      "content": "유료 전환율 8%"
    }
  ]
}

// Response 201
{
  "success": true,
  "pageId": "page_abc123",
  "pageUrl": "https://notion.so/page_abc123",
  "savedAt": "2025-12-30T11:05:00Z"
}

// Response 401 (Notion 미연결)
{
  "error": "NOTION_NOT_CONNECTED",
  "message": "Notion이 연결되어 있지 않습니다"
}

// Response 500 (저장 실패)
{
  "error": "NOTION_SAVE_FAILED",
  "message": "Notion 저장에 실패했습니다",
  "details": {
    "reason": "API rate limit exceeded"
  }
}
```

#### DELETE /api/integrations/notion/disconnect

```typescript
// Notion 연결 해제
// Header: Authorization: Bearer {token}

// Response 200
{
  "success": true,
  "disconnectedAt": "2025-12-30T12:00:00Z"
}
```

#### POST /api/analytics/notion

```typescript
// Notion 통합 이벤트 추적 (Part 1.4)
// Request
{
  "event": "notion_checkbox_shown" | "notion_checkbox_checked" | "notion_connect_clicked" |
           "notion_oauth_completed" | "notion_oauth_denied" | "notion_save_completed" | "notion_save_failed",
  "timestamp": "2025-12-30T10:00:00Z",
  "metadata": {
    "isConnected": boolean,
    "workspaceId": string | null,
    "errorType": string | null,
    "retryCount": number | null
  }
}

// Response 200
{
  "success": true
}
```

**Notion 이벤트 추적 지표:**
```
체크박스 선택률 = notion_checkbox_checked / notion_checkbox_shown
목표: > 60%

연결 전환율 = notion_oauth_completed / notion_connect_clicked
목표: > 80%

저장 성공률 = notion_save_completed / notion_save_attempted
목표: > 95%
```

### 4.8 미팅 준비 API (Part 1.5)

#### GET /meetings/:meetingId/prep

미팅 준비 데이터를 가져옵니다.

```typescript
// Response
{
  "success": true,
  "data": {
    "meetingId": "mtg_abc123",
    "companyName": "A사",
    "meetingNumber": 2,
    "meetingTime": "10:00",
    "scheduledAt": "2025-12-30T10:00:00Z",
    "minutesUntilMeeting": 15,
    "pastMeetings": [
      {
        "id": "mtg_prev1",
        "date": "2025-12-22",
        "meetingNumber": 1,
        "summary": [
          "MAU 10만, 월 성장률 15%",
          "시리즈A 50억 희망",
          "경쟁사 B사 대비 우위점 논의"
        ]
      }
    ],
    "unconfirmedItems": [
      {
        "id": "unconf_1",
        "label": "CAC (고객획득비용)",
        "description": "채널별 CAC 상세 수치 미확인"
      },
      {
        "id": "unconf_2",
        "label": "LTV (고객생애가치)",
        "description": "계산 방식 및 기간 미확인"
      }
    ],
    "suggestedQuestions": [
      {
        "id": "q_1",
        "text": "CAC는 채널별로 어떻게 다른가요?"
      },
      {
        "id": "q_2",
        "text": "LTV 계산 방식이 어떻게 되나요?"
      }
    ]
  }
}
```

#### POST /meetings/:meetingId/prep/complete

미팅 준비 완료를 저장합니다.

```typescript
// Request
{
  "checkedQuestions": ["q_1", "q_2"],
  "userQuestions": ["팀 규모와 채용 계획은?"],
  "prepTimeSeconds": 95
}

// Response
{
  "success": true,
  "data": {
    "prepId": "prep_xyz789",
    "completedAt": "2025-12-30T09:50:00Z"
  }
}
```

#### POST /meetings/:meetingId/prep/skip

준비 건너뛰기를 기록합니다.

```typescript
// Request
{
  "reason": "time_constraint" // "time_constraint" | "not_needed" | "other"
}

// Response
{
  "success": true
}
```

#### 미팅 준비 데이터 생성 로직

```typescript
// services/meetingPrepService.ts

interface PrepDataGenerator {
  generatePrepData(meetingId: string): Promise<PrepData>;
}

export class MeetingPrepService implements PrepDataGenerator {
  constructor(
    private db: PrismaClient,
    private aiService: AIService,
    private cacheService: CacheService
  ) {}

  async generatePrepData(meetingId: string): Promise<PrepData> {
    // 캐시 확인 (10분 TTL)
    const cached = await this.cacheService.get(`prep:${meetingId}`);
    if (cached) return cached;

    const meeting = await this.db.meeting.findUnique({
      where: { id: meetingId },
      include: {
        company: true,
        user: true,
      },
    });

    if (!meeting) throw new Error('Meeting not found');

    // 1. 과거 미팅 조회
    const pastMeetings = await this.getPastMeetings(
      meeting.companyId,
      meeting.id
    );

    // 2. 미확인 항목 추출 (과거 미팅에서 확인 안 된 것들)
    const unconfirmedItems = await this.getUnconfirmedItems(pastMeetings);

    // 3. AI 질문 생성
    const suggestedQuestions = await this.generateQuestions(
      meeting,
      pastMeetings,
      unconfirmedItems
    );

    // 4. 미팅까지 남은 시간 계산
    const minutesUntilMeeting = this.calculateMinutesUntil(meeting.scheduledAt);

    const prepData = {
      meetingId: meeting.id,
      companyName: meeting.company.name,
      meetingNumber: await this.getMeetingNumber(meeting.companyId, meeting.id),
      meetingTime: format(meeting.scheduledAt, 'HH:mm'),
      scheduledAt: meeting.scheduledAt.toISOString(),
      minutesUntilMeeting,
      pastMeetings,
      unconfirmedItems,
      suggestedQuestions,
    };

    // 캐시 저장
    await this.cacheService.set(`prep:${meetingId}`, prepData, 600); // 10분

    return prepData;
  }

  private async getPastMeetings(
    companyId: string,
    currentMeetingId: string
  ): Promise<PastMeeting[]> {
    const meetings = await this.db.meeting.findMany({
      where: {
        companyId,
        id: { not: currentMeetingId },
        status: 'COMPLETED',
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        insights: true,
        decisions: true,
      },
    });

    return meetings.map((m, idx) => ({
      id: m.id,
      date: format(m.createdAt, 'yyyy-MM-dd'),
      meetingNumber: meetings.length - idx,
      summary: this.extractSummary(m.insights, m.decisions),
    }));
  }

  private async getUnconfirmedItems(
    pastMeetings: PastMeeting[]
  ): Promise<UnconfirmedItem[]> {
    // 지난 미팅들에서 'GAP' 유형의 미해결 항목 추출
    const unconfirmed = await this.db.decision.findMany({
      where: {
        meetingId: { in: pastMeetings.map((m) => m.id) },
        type: 'GAP',
        status: { not: 'CONFIRMED' },
      },
      take: 5,
    });

    return unconfirmed.map((item) => ({
      id: item.id,
      label: item.title,
      description: item.description,
    }));
  }

  private async generateQuestions(
    meeting: Meeting,
    pastMeetings: PastMeeting[],
    unconfirmedItems: UnconfirmedItem[]
  ): Promise<SuggestedQuestion[]> {
    // AI를 활용한 맞춤형 질문 생성
    const prompt = this.buildQuestionPrompt(
      meeting,
      pastMeetings,
      unconfirmedItems
    );

    const response = await this.aiService.generate({
      model: 'gpt-4-turbo-preview',
      prompt,
      maxTokens: 500,
    });

    return this.parseQuestions(response);
  }

  private buildQuestionPrompt(
    meeting: Meeting,
    pastMeetings: PastMeeting[],
    unconfirmedItems: UnconfirmedItem[]
  ): string {
    return `
다음 미팅을 위한 핵심 질문 2-3개를 생성해주세요.

회사: ${meeting.company.name}
미팅 차수: ${pastMeetings.length + 1}차
이전 미팅 요약:
${pastMeetings.map((m) => `- ${m.date}: ${m.summary.join(', ')}`).join('\n')}

미확인 항목:
${unconfirmedItems.map((i) => `- ${i.label}: ${i.description}`).join('\n')}

질문은 다음 형식으로 작성:
1. [질문 내용]
2. [질문 내용]
    `.trim();
  }

  private calculateMinutesUntil(scheduledAt: Date): number {
    const now = new Date();
    const diff = scheduledAt.getTime() - now.getTime();
    return Math.max(0, Math.floor(diff / 60000));
  }
}
```

#### 푸시 알림 스케줄링 (미팅 10분 전)

```typescript
// services/notificationService.ts

import { CronJob } from 'cron';
import webpush from 'web-push';

export class NotificationService {
  constructor(
    private db: PrismaClient,
    private pushService: PushService
  ) {
    // 매분 실행되는 크론 작업
    new CronJob('* * * * *', this.checkUpcomingMeetings.bind(this)).start();
  }

  private async checkUpcomingMeetings(): Promise<void> {
    const now = new Date();
    const tenMinutesLater = new Date(now.getTime() + 10 * 60 * 1000);
    const elevenMinutesLater = new Date(now.getTime() + 11 * 60 * 1000);

    // 10분 후 미팅 조회
    const upcomingMeetings = await this.db.meeting.findMany({
      where: {
        scheduledAt: {
          gte: tenMinutesLater,
          lt: elevenMinutesLater,
        },
        status: 'SCHEDULED',
        prepReminderSent: false,
      },
      include: {
        user: {
          include: {
            pushSubscriptions: true,
          },
        },
        company: true,
      },
    });

    for (const meeting of upcomingMeetings) {
      await this.sendPrepReminder(meeting);
      await this.db.meeting.update({
        where: { id: meeting.id },
        data: { prepReminderSent: true },
      });
    }
  }

  private async sendPrepReminder(meeting: Meeting & { user: User; company: Company }): Promise<void> {
    const payload = {
      title: '미팅 준비 알림',
      body: `${meeting.company.name} 미팅이 10분 후 시작됩니다. 준비하시겠어요?`,
      icon: '/icons/prep-reminder.png',
      data: {
        type: 'prep_reminder',
        meetingId: meeting.id,
        url: `/meetings/${meeting.id}/prep`,
      },
    };

    for (const subscription of meeting.user.pushSubscriptions) {
      try {
        await this.pushService.send(subscription, payload);

        // 이벤트 로깅
        await this.logEvent('prep_reminder_pushed', {
          meetingId: meeting.id,
          userId: meeting.userId,
        });
      } catch (error) {
        console.error('Push notification failed:', error);
      }
    }
  }
}
```

#### 데이터베이스 스키마 추가 (Part 1.5)

```prisma
// schema.prisma (추가)

model MeetingPrep {
  id              String    @id @default(cuid())
  meetingId       String    @unique
  meeting         Meeting   @relation(fields: [meetingId], references: [id])

  // 준비 상태
  status          PrepStatus @default(PENDING)
  completedAt     DateTime?
  skippedAt       DateTime?
  skipReason      String?

  // 선택된 질문들
  checkedQuestions String[]
  userQuestions    String[]

  // 메트릭
  prepTimeSeconds Int?

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

enum PrepStatus {
  PENDING     // 준비 대기
  COMPLETED   // 준비 완료
  SKIPPED     // 건너뜀
  EXPIRED     // 미팅 시작으로 만료
}

// Meeting 모델에 추가
model Meeting {
  // ... 기존 필드들

  // Part 1.5: 준비 관련
  prepReminderSent Boolean   @default(false)
  prep             MeetingPrep?
}
```

**미팅 준비 이벤트 추적 (Part 1.5):**

```typescript
// 이벤트 타입
type PrepEventType =
  | 'prep_reminder_pushed'      // 10분 전 알림 발송
  | 'prep_reminder_clicked'     // 알림에서 직접 클릭
  | 'prep_card_shown'           // 오늘 화면에서 카드 표시
  | 'prep_button_clicked'       // [준비하기] 클릭
  | 'prep_modal_opened'         // 모달 열림
  | 'prep_past_expanded'        // 지난 미팅 섹션 확장
  | 'prep_unconfirmed_viewed'   // 미확인 항목 확인
  | 'prep_question_unchecked'   // AI 질문 체크 해제
  | 'prep_question_added'       // 사용자 질문 추가
  | 'prep_completed'            // 준비 완료 클릭
  | 'prep_skipped'              // 나중에 클릭
  | 'prep_direct_start';        // 바로 시작 클릭

// POST /analytics/events 예시
{
  "event": "prep_completed",
  "properties": {
    "meetingId": "mtg_abc123",
    "companyName": "A사",
    "meetingNumber": 2,
    "pastMeetingCount": 1,
    "unconfirmedCount": 2,
    "suggestedQuestionCount": 2,
    "userQuestionCount": 1,
    "checkedQuestionCount": 3,
    "prepTimeSeconds": 95,
    "isQuickMode": false
  },
  "timestamp": "2025-12-30T09:50:00Z"
}
```

**Part 1.5 핵심 지표:**
```
준비 완료율 = prep_completed / (prep_modal_opened - prep_direct_start)
목표: > 70%

평균 준비 시간 = avg(prepTimeSeconds)
목표: < 120초

AI 질문 채택률 = (suggestedQuestionCount - uncheckedCount) / suggestedQuestionCount
목표: > 80%

건너뛰기 비율 = prep_skipped / prep_modal_opened
목표: < 30%
```

### 4.9 Today 화면 API (Part 2)

#### GET /api/today - Today 화면 데이터 조회

```typescript
// Request
GET /api/today
Authorization: Bearer <token>
Query Parameters:
  - timezone: string (optional, default: 'Asia/Seoul')

// Response 200
{
  "success": true,
  "data": {
    "greeting": {
      "message": "좋은 아침이에요, 민수님 👋",
      "date": "2025년 12월 30일 월요일",
      "timeOfDay": "morning"
    },
    "sections": {
      "urgent": {
        "count": 2,
        "items": [
          {
            "id": "mtg_001",
            "type": "unconfirmed_decision",
            "companyName": "A사",
            "meetingNumber": 2,
            "title": "어제 A사 미팅 - 결정 확정 안 됨",
            "missingFields": ["담당자", "기한"],
            "estimatedTime": 3,
            "createdAt": "2025-12-29T10:00:00Z",
            "urgencyScore": 95
          }
        ]
      },
      "today": {
        "count": 3,
        "items": [
          {
            "id": "mtg_002",
            "companyName": "A사",
            "meetingNumber": 2,
            "scheduledAt": "2025-12-30T10:00:00Z",
            "state": "urgent",
            "hasUnconfirmed": true,
            "unconfirmedCount": 2,
            "unconfirmedItems": ["CAC", "LTV"],
            "prepTimeEstimate": 120,
            "suggestedQuestions": [
              "CAC는 채널별로 어떻게 되나요?",
              "LTV 계산 방식이 어떻게 되나요?"
            ]
          }
        ]
      },
      "later": {
        "count": 4,
        "items": []  // 접힌 상태이므로 별도 API 호출 필요
      }
    },
    "alerts": {
      "overload": false,
      "urgentPileup": false
    }
  },
  "metadata": {
    "totalMeetings": 9,
    "totalUnconfirmed": 3,
    "lastUpdated": "2025-12-30T08:00:00Z"
  }
}

// Response 401
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "인증이 필요합니다"
  }
}
```

#### GET /api/today/section/:type - 섹션별 데이터 조회

```typescript
// Request
GET /api/today/section/later?page=1&limit=10
Authorization: Bearer <token>

// Response 200
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "mtg_005",
        "companyName": "D사",
        "meetingNumber": 1,
        "scheduledAt": "2025-12-31T14:00:00Z",
        "state": "pending",
        "hasUnconfirmed": false
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 4,
      "hasMore": false
    }
  }
}
```

#### PATCH /api/meetings/:id/state - 미팅 카드 상태 변경

```typescript
// Request
PATCH /api/meetings/mtg_002/state
Authorization: Bearer <token>
Content-Type: application/json

{
  "state": "prepping",
  "metadata": {
    "triggeredFrom": "card_prep_clicked",
    "timeUntilMeeting": 35
  }
}

// Response 200
{
  "success": true,
  "data": {
    "id": "mtg_002",
    "previousState": "urgent",
    "newState": "prepping",
    "stateChangedAt": "2025-12-30T09:25:00Z",
    "validTransitions": ["ready"]
  }
}

// Response 400 (잘못된 상태 전환)
{
  "success": false,
  "error": {
    "code": "INVALID_STATE_TRANSITION",
    "message": "pending 상태에서 ready로 직접 전환할 수 없습니다",
    "validTransitions": ["urgent", "skipped"]
  }
}
```

#### TodayScreenService 구현

```typescript
// src/services/TodayScreenService.ts

import { prisma } from '@/lib/prisma';
import { addHours, startOfDay, endOfDay, isToday } from 'date-fns';

type SectionType = 'urgent' | 'today' | 'later';
type CardState = 'pending' | 'urgent' | 'prepping' | 'ready' | 'live' | 'skipped';

interface TodayScreenData {
  greeting: {
    message: string;
    date: string;
    timeOfDay: 'morning' | 'afternoon' | 'evening';
  };
  sections: Record<SectionType, {
    count: number;
    items: any[];
  }>;
  alerts: {
    overload: boolean;
    urgentPileup: boolean;
  };
}

export class TodayScreenService {
  // 시간대별 인사 메시지 생성
  private getGreeting(userName: string, timezone: string): TodayScreenData['greeting'] {
    const now = new Date();
    const hour = parseInt(
      now.toLocaleString('en-US', { hour: 'numeric', hour12: false, timeZone: timezone })
    );

    let message: string;
    let timeOfDay: 'morning' | 'afternoon' | 'evening';

    if (hour >= 5 && hour < 12) {
      message = `좋은 아침이에요, ${userName}님 👋`;
      timeOfDay = 'morning';
    } else if (hour >= 12 && hour < 18) {
      message = `좋은 오후예요, ${userName}님 👋`;
      timeOfDay = 'afternoon';
    } else {
      message = `좋은 저녁이에요, ${userName}님 👋`;
      timeOfDay = 'evening';
    }

    const date = now.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      timeZone: timezone,
    });

    return { message, date, timeOfDay };
  }

  // 카드 상태 계산
  private calculateCardState(meeting: any): CardState {
    if (meeting.isLive) return 'live';
    if (meeting.prepCompleted) return 'ready';
    if (meeting.prepStarted) return 'prepping';
    if (meeting.prepSkipped) return 'skipped';

    const hoursUntil = (new Date(meeting.scheduledAt).getTime() - Date.now()) / (1000 * 60 * 60);

    if (hoursUntil <= 24 && hoursUntil > 0 && meeting.hasUnconfirmed) {
      return 'urgent';
    }

    return 'pending';
  }

  // 우선순위 점수 계산
  private calculateUrgencyScore(meeting: any): number {
    let score = 0;
    const hoursUntil = (new Date(meeting.scheduledAt).getTime() - Date.now()) / (1000 * 60 * 60);

    // 시간 기반 점수 (24시간 이내 = 높은 점수)
    if (hoursUntil <= 1) score += 50;
    else if (hoursUntil <= 6) score += 40;
    else if (hoursUntil <= 12) score += 30;
    else if (hoursUntil <= 24) score += 20;

    // 미확인 항목 점수
    score += (meeting.unconfirmedCount || 0) * 10;

    // 미팅 횟수 (기존 관계) 점수
    score += Math.min(meeting.meetingNumber || 1, 5) * 5;

    return score;
  }

  // Today 화면 전체 데이터 조회
  async getTodayData(userId: string, timezone = 'Asia/Seoul'): Promise<TodayScreenData> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const now = new Date();
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);
    const next24h = addHours(now, 24);

    // 미팅 조회
    const meetings = await prisma.meeting.findMany({
      where: {
        userId,
        scheduledAt: { gte: now },
      },
      include: {
        company: true,
        decisions: { where: { confirmedAt: null } },
        prepSession: true,
      },
      orderBy: { scheduledAt: 'asc' },
    });

    // 미확정 결정 조회 (24시간 이내)
    const unconfirmedDecisions = await prisma.decision.findMany({
      where: {
        meeting: { userId },
        confirmedAt: null,
        createdAt: { gte: addHours(now, -24) },
      },
      include: { meeting: { include: { company: true } } },
    });

    // 미팅 데이터 변환
    const enrichedMeetings = meetings.map(meeting => ({
      id: meeting.id,
      companyName: meeting.company?.name || 'Unknown',
      meetingNumber: meeting.meetingNumber,
      scheduledAt: meeting.scheduledAt,
      state: this.calculateCardState(meeting),
      hasUnconfirmed: meeting.decisions.length > 0,
      unconfirmedCount: meeting.decisions.length,
      unconfirmedItems: meeting.decisions.map(d => d.element),
      prepTimeEstimate: this.estimatePrepTime(meeting),
      suggestedQuestions: [], // AI 질문은 별도 서비스에서 조회
      urgencyScore: this.calculateUrgencyScore(meeting),
    }));

    // 긴급 섹션 (24시간 내 확정 필요 + 미확정 결정)
    const urgentItems = [
      ...unconfirmedDecisions.map(d => ({
        id: d.id,
        type: 'unconfirmed_decision',
        companyName: d.meeting.company?.name,
        meetingNumber: d.meeting.meetingNumber,
        title: `${d.meeting.company?.name} 미팅 - ${d.element} 확정 안 됨`,
        missingFields: this.getMissingFields(d),
        estimatedTime: 3,
        createdAt: d.createdAt,
        urgencyScore: 90,
      })),
      ...enrichedMeetings.filter(m =>
        m.state === 'urgent' ||
        (m.hasUnconfirmed && new Date(m.scheduledAt) <= next24h)
      ),
    ].sort((a, b) => b.urgencyScore - a.urgencyScore);

    // 오늘 미팅 섹션
    const todayItems = enrichedMeetings.filter(m =>
      isToday(new Date(m.scheduledAt)) &&
      !urgentItems.find(u => u.id === m.id)
    );

    // 나중에 섹션 (오늘 이후)
    const laterItems = enrichedMeetings.filter(m =>
      !isToday(new Date(m.scheduledAt)) &&
      !urgentItems.find(u => u.id === m.id)
    );

    // 알림 상태
    const alerts = {
      overload: todayItems.length >= 5,
      urgentPileup: urgentItems.length >= 5,
    };

    return {
      greeting: this.getGreeting(user?.name || '사용자', timezone),
      sections: {
        urgent: { count: urgentItems.length, items: urgentItems },
        today: { count: todayItems.length, items: todayItems },
        later: { count: laterItems.length, items: [] }, // 접힌 상태
      },
      alerts,
    };
  }

  // 미팅 상태 변경
  async updateMeetingState(
    meetingId: string,
    newState: CardState,
    metadata?: Record<string, any>
  ) {
    const meeting = await prisma.meeting.findUnique({ where: { id: meetingId } });
    if (!meeting) throw new Error('Meeting not found');

    const currentState = this.calculateCardState(meeting);
    const validTransitions = this.getValidTransitions(currentState);

    if (!validTransitions.includes(newState)) {
      throw new Error(`Invalid transition from ${currentState} to ${newState}`);
    }

    // 상태별 업데이트
    const updateData: any = { stateUpdatedAt: new Date() };

    switch (newState) {
      case 'prepping':
        updateData.prepStarted = true;
        updateData.prepStartedAt = new Date();
        break;
      case 'ready':
        updateData.prepCompleted = true;
        updateData.prepCompletedAt = new Date();
        break;
      case 'skipped':
        updateData.prepSkipped = true;
        updateData.prepSkippedAt = new Date();
        break;
      case 'live':
        updateData.isLive = true;
        updateData.startedAt = new Date();
        break;
    }

    const updated = await prisma.meeting.update({
      where: { id: meetingId },
      data: updateData,
    });

    // 이벤트 로깅
    await prisma.event.create({
      data: {
        type: 'card_state_changed',
        meetingId,
        metadata: {
          previousState: currentState,
          newState,
          ...metadata,
        },
      },
    });

    return {
      id: updated.id,
      previousState: currentState,
      newState,
      stateChangedAt: updated.stateUpdatedAt,
      validTransitions: this.getValidTransitions(newState),
    };
  }

  // 유효한 상태 전환 목록
  private getValidTransitions(currentState: CardState): CardState[] {
    const transitions: Record<CardState, CardState[]> = {
      pending: ['urgent', 'skipped'],
      urgent: ['prepping', 'skipped'],
      prepping: ['ready'],
      ready: ['live', 'skipped'],
      live: [],
      skipped: ['prepping'],
    };
    return transitions[currentState] || [];
  }

  // 준비 시간 추정
  private estimatePrepTime(meeting: any): number {
    let baseTime = 60; // 기본 1분

    // 미확인 항목당 30초 추가
    baseTime += (meeting.decisions?.length || 0) * 30;

    // 과거 미팅 있으면 요약 읽기 30초
    if (meeting.meetingNumber > 1) baseTime += 30;

    return Math.min(baseTime, 300); // 최대 5분
  }

  // 누락 필드 추출
  private getMissingFields(decision: any): string[] {
    const missing: string[] = [];
    if (!decision.assignee) missing.push('담당자');
    if (!decision.dueDate) missing.push('기한');
    if (!decision.confirmedBy) missing.push('확정자');
    return missing;
  }
}
```

#### Today 화면 이벤트 로깅

```typescript
// src/types/today-events.ts

type TodayEventType =
  | 'today_screen_viewed'       // Today 화면 진입
  | 'today_section_expanded'    // 섹션 펼침
  | 'today_section_collapsed'   // 섹션 접음
  | 'today_card_clicked'        // 카드 클릭
  | 'today_empty_state_shown'   // 빈 상태 표시
  | 'today_refresh_triggered'   // 새로고침
  | 'today_overload_shown';     // 과부하 경고 표시

type CardEventType =
  | 'card_viewed'              // 카드 뷰포트 진입
  | 'card_clicked'             // 카드 클릭
  | 'card_prep_clicked'        // [준비하기] 클릭
  | 'card_start_clicked'       // [바로 시작] 클릭
  | 'card_state_changed'       // 상태 전환
  | 'card_urgent_triggered'    // 긴급 상태 전환
  | 'card_pulse_shown';        // 펄스 애니메이션 표시

interface TodayEventPayload {
  userId: string;
  sessionId: string;
  event: TodayEventType | CardEventType;
  metadata: {
    // Today 화면 이벤트
    urgentCount?: number;
    todayCount?: number;
    laterCount?: number;
    totalUnconfirmed?: number;
    timeOfDay?: 'morning' | 'afternoon' | 'evening';
    sectionType?: string;

    // 카드 이벤트
    cardId?: string;
    meetingId?: string;
    companyName?: string;
    meetingNumber?: number;
    cardState?: CardState;
    previousState?: CardState;
    newState?: CardState;
    timeUntilMeeting?: number;
    hasUnconfirmed?: boolean;
    unconfirmedCount?: number;
  };
  timestamp: string;
}

// 이벤트 로깅 샘플
const todayScreenViewedEvent: TodayEventPayload = {
  userId: "usr_123",
  sessionId: "sess_abc",
  event: "today_screen_viewed",
  metadata: {
    urgentCount: 2,
    todayCount: 3,
    laterCount: 4,
    totalUnconfirmed: 5,
    timeOfDay: "morning"
  },
  timestamp: "2025-12-30T08:00:00Z"
};

const cardPrepClickedEvent: TodayEventPayload = {
  userId: "usr_123",
  sessionId: "sess_abc",
  event: "card_prep_clicked",
  metadata: {
    cardId: "card_001",
    meetingId: "mtg_002",
    companyName: "A사",
    meetingNumber: 2,
    cardState: "urgent",
    timeUntilMeeting: 35,
    hasUnconfirmed: true,
    unconfirmedCount: 2
  },
  timestamp: "2025-12-30T09:25:00Z"
};
```

**Part 2 핵심 지표:**
```
평균 스캔 시간 = avg(sessionDuration WHERE today_screen_viewed)
목표: < 10초

긴급 항목 처리율 = count(urgent_completed) / count(urgent_shown)
목표: > 80%

준비하기 클릭률 = count(card_prep_clicked) / count(card_viewed)
목표: > 70%

건너뛰기율 = count(card_start_clicked) / count(card_viewed WHERE hasUnconfirmed)
목표: < 30%

평균 행동까지 시간 = avg(timeToClick WHERE card_viewed to card_prep_clicked)
목표: < 5초
```

### 4.10 HUD 세션 API (Part 3.1)

#### POST /api/hud/session - HUD 세션 시작

```typescript
// Request
POST /api/hud/session
Authorization: Bearer <token>
Content-Type: application/json

{
  "platform": "zoom",  // "zoom" | "meet" | "teams"
  "meetingUrl": "https://zoom.us/j/123456789",
  "autoStarted": true,
  "detectedAt": "2025-12-30T10:00:00Z"
}

// Response 201
{
  "success": true,
  "data": {
    "sessionId": "hud_sess_001",
    "meetingId": "mtg_003",
    "platform": "zoom",
    "startedAt": "2025-12-30T10:00:05Z",
    "status": "active",
    "settings": {
      "alertLevels": [1, 2, 3],
      "opacityDefault": 0.8,
      "autoHideAfter": 300000  // 5분
    }
  }
}

// Response 409 (이미 활성 세션 존재)
{
  "success": false,
  "error": {
    "code": "SESSION_ALREADY_ACTIVE",
    "message": "이미 활성화된 HUD 세션이 있습니다",
    "activeSessionId": "hud_sess_000"
  }
}
```

#### GET /api/hud/session/:id - HUD 세션 조회

```typescript
// Request
GET /api/hud/session/hud_sess_001
Authorization: Bearer <token>

// Response 200
{
  "success": true,
  "data": {
    "sessionId": "hud_sess_001",
    "meetingId": "mtg_003",
    "platform": "zoom",
    "startedAt": "2025-12-30T10:00:05Z",
    "status": "active",
    "duration": 1800,  // 초 단위
    "stats": {
      "totalAlerts": { "level1": 5, "level2": 2, "level3": 0 },
      "alertsActioned": 6,
      "alertsDeferred": 1,
      "alertsIgnored": 0,
      "gapsIdentified": 3,
      "gapsResolved": 2,
      "idleRatio": 0.97
    },
    "deferredItems": [
      {
        "id": "def_001",
        "alertId": "alt_003",
        "question": "결제 조건은 어떻게 되나요?",
        "category": "gap",
        "deferredAt": "2025-12-30T10:15:00Z"
      }
    ]
  }
}
```

#### PATCH /api/hud/session/:id/end - HUD 세션 종료

```typescript
// Request
PATCH /api/hud/session/hud_sess_001/end
Authorization: Bearer <token>
Content-Type: application/json

{
  "endReason": "meeting_ended",  // "meeting_ended" | "user_stopped" | "error"
  "summary": {
    "totalDuration": 3600,
    "idleTime": 3480,
    "alertTime": 120
  }
}

// Response 200
{
  "success": true,
  "data": {
    "sessionId": "hud_sess_001",
    "endedAt": "2025-12-30T11:00:05Z",
    "finalStats": {
      "totalAlerts": { "level1": 8, "level2": 3, "level3": 1 },
      "alertsActioned": 10,
      "alertsDeferred": 2,
      "alertsIgnored": 0,
      "gapsIdentified": 5,
      "gapsResolved": 4,
      "risksAccepted": 0,
      "idleRatio": 0.97
    },
    "pendingActions": [
      {
        "type": "deferred_question",
        "count": 2,
        "items": ["결제 조건은 어떻게 되나요?", "계약 기간 협상 가능한가요?"]
      }
    ]
  }
}
```

### 4.11 알림 시스템 API (Part 3.3)

#### GET /api/hud/alerts - 현재 세션 알림 목록

```typescript
// Request
GET /api/hud/alerts?sessionId=hud_sess_001&level=2,3
Authorization: Bearer <token>

// Response 200
{
  "success": true,
  "data": {
    "alerts": [
      {
        "id": "alt_001",
        "level": 2,
        "category": "gap",
        "icon": "💡",
        "title": "정보 누락 감지",
        "message": "예산 범위에 대한 정보가 확인되지 않았습니다",
        "suggestedQuestion": "예산 범위가 어느 정도 되실까요?",
        "reason": [
          "가격 논의가 진행 중이나 예산 언급 없음",
          "결정권자가 예산 승인 필요하다고 언급"
        ],
        "timestamp": "2025-12-30T10:15:00Z",
        "status": "pending",  // "pending" | "actioned" | "deferred" | "ignored"
        "expiresAt": "2025-12-30T10:15:10Z"
      }
    ],
    "pendingCount": 1,
    "totalCount": 7
  }
}
```

#### POST /api/hud/alerts/:id/action - 알림에 대한 사용자 응답

```typescript
// Request
POST /api/hud/alerts/alt_001/action
Authorization: Bearer <token>
Content-Type: application/json

{
  "action": "ask",  // "ask" | "defer" | "dismiss" | "accept_risk"
  "metadata": {
    "responseTime": 2500,  // ms
    "questionCopied": true
  }
}

// Response 200 (ask)
{
  "success": true,
  "data": {
    "alertId": "alt_001",
    "action": "ask",
    "result": {
      "status": "question_copied",
      "question": "예산 범위가 어느 정도 되실까요?",
      "followUp": {
        "trackAnswer": true,
        "expectedKeywords": ["억", "만원", "예산", "비용"]
      }
    }
  }
}

// Response 200 (defer)
{
  "success": true,
  "data": {
    "alertId": "alt_001",
    "action": "defer",
    "result": {
      "deferredItemId": "def_002",
      "addedToDeferredList": true,
      "currentDeferredCount": 3
    }
  }
}

// Response 200 (accept_risk - Level 3만)
{
  "success": true,
  "data": {
    "alertId": "alt_001",
    "action": "accept_risk",
    "result": {
      "riskAccepted": true,
      "warningAcknowledged": true,
      "riskCategory": "contract_terms"
    }
  }
}
```

### 4.12 Gap 분석 API (Part 3.3)

#### GET /api/meetings/:id/gaps - 미팅 중 Gap 분석 결과

```typescript
// Request
GET /api/meetings/mtg_003/gaps
Authorization: Bearer <token>

// Response 200
{
  "success": true,
  "data": {
    "meetingId": "mtg_003",
    "analyzedAt": "2025-12-30T10:30:00Z",
    "gaps": [
      {
        "id": "gap_001",
        "category": "budget",
        "severity": "high",
        "description": "예산 범위 미확인",
        "detectedAt": "2025-12-30T10:15:00Z",
        "status": "resolved",
        "resolvedAt": "2025-12-30T10:18:00Z",
        "resolvedBy": {
          "type": "user_question",
          "alertId": "alt_001"
        }
      },
      {
        "id": "gap_002",
        "category": "timeline",
        "severity": "medium",
        "description": "도입 시점 미확정",
        "detectedAt": "2025-12-30T10:25:00Z",
        "status": "pending",
        "suggestedQuestion": "도입 예정 시점이 언제쯤 되실까요?"
      }
    ],
    "summary": {
      "total": 5,
      "resolved": 3,
      "pending": 2,
      "resolutionRate": 0.6
    }
  }
}
```

### 4.13 연기 항목 API (Part 3.4)

#### GET /api/hud/deferred - 연기된 항목 목록

```typescript
// Request
GET /api/hud/deferred?sessionId=hud_sess_001
Authorization: Bearer <token>

// Response 200
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "def_001",
        "alertId": "alt_003",
        "question": "결제 조건은 어떻게 되나요?",
        "category": "gap",
        "priority": "high",
        "deferredAt": "2025-12-30T10:15:00Z",
        "suggestedAskTime": "meeting_end",
        "context": {
          "relatedTranscript": "가격은 협의 가능합니다",
          "transcriptTimestamp": "2025-12-30T10:14:30Z"
        }
      }
    ],
    "count": 2
  }
}
```

#### DELETE /api/hud/deferred/:id - 연기 항목 제거 (해결됨)

```typescript
// Request
DELETE /api/hud/deferred/def_001
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "resolved",  // "resolved" | "asked" | "not_relevant"
  "metadata": {
    "resolvedAt": "2025-12-30T10:45:00Z",
    "resolvedBy": "user_action"
  }
}

// Response 200
{
  "success": true,
  "data": {
    "id": "def_001",
    "status": "resolved",
    "remainingCount": 1
  }
}
```

### 4.14 HUD 분석 이벤트 API (Part 3)

#### POST /api/analytics/hud - HUD 이벤트 로깅

```typescript
// Request
POST /api/analytics/hud
Authorization: Bearer <token>
Content-Type: application/json

{
  "sessionId": "hud_sess_001",
  "events": [
    {
      "type": "alert_shown",
      "alertId": "alt_001",
      "level": 2,
      "category": "gap",
      "timestamp": "2025-12-30T10:15:00Z"
    },
    {
      "type": "alert_ask_clicked",
      "alertId": "alt_001",
      "timeToAction": 2500,
      "timestamp": "2025-12-30T10:15:02.5Z"
    },
    {
      "type": "gap_resolved",
      "gapId": "gap_001",
      "alertId": "alt_001",
      "timestamp": "2025-12-30T10:18:00Z"
    }
  ]
}

// Response 200
{
  "success": true,
  "data": {
    "processedCount": 3,
    "sessionStats": {
      "alertsShown": 7,
      "alertsActioned": 6,
      "gapsResolved": 3
    }
  }
}
```

#### HUDSessionService 구현

```typescript
// src/services/HUDSessionService.ts

import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';
import { GapAnalysisService } from './GapAnalysisService';
import { AlertGeneratorService } from './AlertGeneratorService';

type Platform = 'zoom' | 'meet' | 'teams';
type AlertLevel = 1 | 2 | 3;
type AlertCategory = 'gap' | 'decision' | 'action' | 'risk';
type AlertAction = 'ask' | 'defer' | 'dismiss' | 'accept_risk';
type SessionStatus = 'active' | 'paused' | 'ended';

interface HUDSessionStats {
  totalAlerts: { level1: number; level2: number; level3: number };
  alertsActioned: number;
  alertsDeferred: number;
  alertsIgnored: number;
  gapsIdentified: number;
  gapsResolved: number;
  risksAccepted: number;
  idleRatio: number;
}

interface DeferredItem {
  id: string;
  alertId: string;
  question: string;
  category: AlertCategory;
  deferredAt: Date;
}

export class HUDSessionService {
  private gapAnalysis: GapAnalysisService;
  private alertGenerator: AlertGeneratorService;

  constructor() {
    this.gapAnalysis = new GapAnalysisService();
    this.alertGenerator = new AlertGeneratorService();
  }

  // Part 3.1: 세션 시작
  async startSession(
    userId: string,
    platform: Platform,
    meetingUrl: string,
    autoStarted: boolean
  ) {
    // 기존 활성 세션 확인
    const existingSession = await prisma.hudSession.findFirst({
      where: { userId, status: 'active' }
    });

    if (existingSession) {
      throw new Error('SESSION_ALREADY_ACTIVE');
    }

    // 미팅 ID 매칭 또는 생성
    const meeting = await this.findOrCreateMeeting(userId, platform, meetingUrl);

    // 세션 생성
    const session = await prisma.hudSession.create({
      data: {
        userId,
        meetingId: meeting.id,
        platform,
        meetingUrl,
        autoStarted,
        status: 'active',
        startedAt: new Date(),
        stats: {
          totalAlerts: { level1: 0, level2: 0, level3: 0 },
          alertsActioned: 0,
          alertsDeferred: 0,
          alertsIgnored: 0,
          gapsIdentified: 0,
          gapsResolved: 0,
          risksAccepted: 0,
          idleRatio: 1.0,
        },
      },
    });

    // Redis에 세션 캐시
    await redis.setex(
      `hud:session:${session.id}`,
      3600 * 4, // 4시간 TTL
      JSON.stringify(session)
    );

    return session;
  }

  // Part 3.2: Idle 상태 업데이트
  async updateIdleStats(sessionId: string, idleTime: number, totalTime: number) {
    const idleRatio = totalTime > 0 ? idleTime / totalTime : 1.0;

    await prisma.hudSession.update({
      where: { id: sessionId },
      data: {
        stats: {
          update: { idleRatio }
        }
      }
    });

    // Redis 캐시 업데이트
    const cached = await redis.get(`hud:session:${sessionId}`);
    if (cached) {
      const session = JSON.parse(cached);
      session.stats.idleRatio = idleRatio;
      await redis.setex(`hud:session:${sessionId}`, 3600 * 4, JSON.stringify(session));
    }
  }

  // Part 3.3: 알림 생성 및 관리
  async processTranscriptForAlerts(sessionId: string, transcript: string) {
    const session = await this.getSession(sessionId);
    if (!session) throw new Error('SESSION_NOT_FOUND');

    // Gap 분석
    const gaps = await this.gapAnalysis.analyze(session.meetingId, transcript);

    // 알림 생성
    const alerts = [];
    for (const gap of gaps) {
      const alert = await this.alertGenerator.createFromGap(gap, session.id);
      alerts.push(alert);

      // 세션 통계 업데이트
      await this.incrementAlertCount(sessionId, alert.level);
    }

    return alerts;
  }

  // Part 3.4: 사용자 응답 처리
  async handleAlertAction(
    sessionId: string,
    alertId: string,
    action: AlertAction,
    metadata?: Record<string, any>
  ) {
    const session = await this.getSession(sessionId);
    if (!session) throw new Error('SESSION_NOT_FOUND');

    const alert = await prisma.hudAlert.findUnique({
      where: { id: alertId }
    });
    if (!alert) throw new Error('ALERT_NOT_FOUND');

    let result: any;

    switch (action) {
      case 'ask':
        result = await this.handleAskAction(session, alert, metadata);
        break;
      case 'defer':
        result = await this.handleDeferAction(session, alert);
        break;
      case 'dismiss':
        result = await this.handleDismissAction(session, alert);
        break;
      case 'accept_risk':
        result = await this.handleAcceptRiskAction(session, alert);
        break;
    }

    // 분석 이벤트 기록
    await this.logAnalyticsEvent(sessionId, `alert_${action}`, {
      alertId,
      level: alert.level,
      category: alert.category,
      ...metadata
    });

    return result;
  }

  private async handleAskAction(session: any, alert: any, metadata?: any) {
    // 알림 상태 업데이트
    await prisma.hudAlert.update({
      where: { id: alert.id },
      data: { status: 'actioned', actionedAt: new Date() }
    });

    // 세션 통계 업데이트
    await prisma.hudSession.update({
      where: { id: session.id },
      data: {
        stats: {
          update: {
            alertsActioned: { increment: 1 }
          }
        }
      }
    });

    return {
      status: 'question_copied',
      question: alert.suggestedQuestion,
      followUp: {
        trackAnswer: true,
        expectedKeywords: this.extractKeywords(alert.category)
      }
    };
  }

  private async handleDeferAction(session: any, alert: any) {
    // 연기 항목 생성
    const deferredItem = await prisma.deferredItem.create({
      data: {
        sessionId: session.id,
        alertId: alert.id,
        question: alert.suggestedQuestion,
        category: alert.category,
        priority: alert.level === 3 ? 'high' : 'medium',
      }
    });

    // 알림 상태 업데이트
    await prisma.hudAlert.update({
      where: { id: alert.id },
      data: { status: 'deferred' }
    });

    // 세션 통계 업데이트
    await prisma.hudSession.update({
      where: { id: session.id },
      data: {
        stats: {
          update: {
            alertsDeferred: { increment: 1 }
          }
        }
      }
    });

    const count = await prisma.deferredItem.count({
      where: { sessionId: session.id, status: 'pending' }
    });

    return {
      deferredItemId: deferredItem.id,
      addedToDeferredList: true,
      currentDeferredCount: count
    };
  }

  private async handleAcceptRiskAction(session: any, alert: any) {
    if (alert.level !== 3 || alert.category !== 'risk') {
      throw new Error('INVALID_RISK_ACCEPT');
    }

    // 알림 상태 업데이트
    await prisma.hudAlert.update({
      where: { id: alert.id },
      data: { status: 'risk_accepted', actionedAt: new Date() }
    });

    // 세션 통계 업데이트
    await prisma.hudSession.update({
      where: { id: session.id },
      data: {
        stats: {
          update: {
            risksAccepted: { increment: 1 },
            alertsActioned: { increment: 1 }
          }
        }
      }
    });

    return {
      riskAccepted: true,
      warningAcknowledged: true,
      riskCategory: alert.metadata?.riskCategory || 'unknown'
    };
  }

  // 세션 종료
  async endSession(sessionId: string, endReason: string, summary?: any) {
    const session = await this.getSession(sessionId);
    if (!session) throw new Error('SESSION_NOT_FOUND');

    // 최종 통계 계산
    const finalStats = await this.calculateFinalStats(session);

    // 세션 업데이트
    await prisma.hudSession.update({
      where: { id: sessionId },
      data: {
        status: 'ended',
        endedAt: new Date(),
        endReason,
        stats: finalStats
      }
    });

    // Redis 캐시 삭제
    await redis.del(`hud:session:${sessionId}`);

    // 연기 항목 확인
    const pendingDeferred = await prisma.deferredItem.findMany({
      where: { sessionId, status: 'pending' }
    });

    return {
      sessionId,
      endedAt: new Date(),
      finalStats,
      pendingActions: pendingDeferred.length > 0 ? [
        {
          type: 'deferred_question',
          count: pendingDeferred.length,
          items: pendingDeferred.map(d => d.question)
        }
      ] : []
    };
  }

  private async getSession(sessionId: string) {
    // Redis에서 먼저 조회
    const cached = await redis.get(`hud:session:${sessionId}`);
    if (cached) return JSON.parse(cached);

    // DB에서 조회
    return prisma.hudSession.findUnique({
      where: { id: sessionId }
    });
  }

  private async incrementAlertCount(sessionId: string, level: AlertLevel) {
    const levelKey = `level${level}` as const;
    await prisma.hudSession.update({
      where: { id: sessionId },
      data: {
        stats: {
          update: {
            totalAlerts: {
              update: { [levelKey]: { increment: 1 } }
            },
            gapsIdentified: { increment: 1 }
          }
        }
      }
    });
  }

  private extractKeywords(category: AlertCategory): string[] {
    const keywordMap: Record<AlertCategory, string[]> = {
      gap: ['예산', '비용', '가격', '기한', '담당자'],
      decision: ['결정', '승인', '확정', '동의'],
      action: ['진행', '시작', '완료', '다음'],
      risk: ['리스크', '위험', '문제', '주의'],
    };
    return keywordMap[category] || [];
  }

  private async calculateFinalStats(session: any): Promise<HUDSessionStats> {
    // 실제 통계 계산 로직
    const alerts = await prisma.hudAlert.findMany({
      where: { sessionId: session.id }
    });

    const stats: HUDSessionStats = {
      totalAlerts: { level1: 0, level2: 0, level3: 0 },
      alertsActioned: 0,
      alertsDeferred: 0,
      alertsIgnored: 0,
      gapsIdentified: 0,
      gapsResolved: 0,
      risksAccepted: 0,
      idleRatio: session.stats?.idleRatio || 0.95,
    };

    for (const alert of alerts) {
      stats.totalAlerts[`level${alert.level}` as keyof typeof stats.totalAlerts]++;
      if (alert.status === 'actioned') stats.alertsActioned++;
      if (alert.status === 'deferred') stats.alertsDeferred++;
      if (alert.status === 'ignored' || alert.status === 'timeout') stats.alertsIgnored++;
      if (alert.status === 'risk_accepted') stats.risksAccepted++;
      if (alert.category === 'gap') stats.gapsIdentified++;
      if (alert.category === 'gap' && alert.status === 'actioned') stats.gapsResolved++;
    }

    return stats;
  }

  private async logAnalyticsEvent(
    sessionId: string,
    eventType: string,
    metadata: Record<string, any>
  ) {
    await prisma.analyticsEvent.create({
      data: {
        sessionId,
        eventType,
        metadata,
        timestamp: new Date()
      }
    });
  }

  private async findOrCreateMeeting(userId: string, platform: Platform, meetingUrl: string) {
    // 기존 미팅 찾기 또는 새로 생성
    let meeting = await prisma.meeting.findFirst({
      where: {
        userId,
        platform,
        OR: [
          { meetingUrl },
          { status: 'scheduled', scheduledAt: { gte: new Date() } }
        ]
      }
    });

    if (!meeting) {
      meeting = await prisma.meeting.create({
        data: {
          userId,
          platform,
          meetingUrl,
          status: 'live',
          startedAt: new Date()
        }
      });
    }

    return meeting;
  }
}
```

**Part 3 핵심 지표:**
```
자동 시작률 = count(meeting_auto_started) / count(meeting_detected)
목표: > 90%

평균 Idle 비율 = avg(idleRatio WHERE session_ended)
목표: > 95%

알림 실행률 = count(alert_ask_clicked) / count(alert_shown WHERE level >= 2)
목표: > 50%

Gap 해결률 = count(gap_resolved) / count(gap_identified)
목표: > 70%

연기 완료율 = count(deferred_resolved) / count(deferred_added)
목표: > 80%

위험 감수율 = count(risk_accepted) / count(risk_dialog_shown)
목표: < 20%

평균 응답 시간 = avg(timeToAction WHERE alert_ask_clicked)
목표: < 5초
```

### 4.15 확정 모달 API (Part 4.2)

#### 확정 모달 데이터 조회

```http
GET /api/meetings/{meetingId}/confirmation
```

**Response:**
```json
{
  "meeting": {
    "id": "mtg_123",
    "title": "A사 투자 검토 미팅",
    "startTime": "2025-12-30T14:00:00Z",
    "endTime": "2025-12-30T15:23:00Z",
    "duration": 4980
  },
  "decisions": [
    {
      "id": "dec_1",
      "content": "시리즈A 500억 밸류 제안 합의",
      "assignee": "김철수",
      "deadline": "2025-01-15",
      "isComplete": true,
      "source": "ai_extracted"
    },
    {
      "id": "dec_2",
      "content": "기술 실사 일정 조율 필요",
      "assignee": null,
      "deadline": null,
      "isComplete": false,
      "source": "ai_extracted"
    }
  ],
  "insights": [
    "창업자 실행력 평가: 5/5",
    "시장 진입 타이밍 적절",
    "MAU 10만, 월 성장률 15%"
  ],
  "gaps": {
    "total": 3,
    "filled": 1
  }
}
```

#### 결정 사항 업데이트

```http
PATCH /api/decisions/{decisionId}
```

**Request:**
```json
{
  "assignee": "박지영",
  "deadline": "2025-01-20"
}
```

**Response:**
```json
{
  "decision": {
    "id": "dec_2",
    "content": "기술 실사 일정 조율 필요",
    "assignee": "박지영",
    "deadline": "2025-01-20",
    "isComplete": true,
    "updatedAt": "2025-12-30T15:25:00Z"
  }
}
```

#### 결정 사항 추가 (수동)

```http
POST /api/meetings/{meetingId}/decisions
```

**Request:**
```json
{
  "content": "추가 논의 사항: 경쟁사 분석",
  "assignee": null,
  "deadline": null
}
```

#### 결정 사항 삭제

```http
DELETE /api/decisions/{decisionId}
```

### 4.16 확정 완료 API (Part 4.2-4.3)

#### 확정 저장 (로컬 + Notion)

```http
POST /api/meetings/{meetingId}/confirm
```

**Request:**
```json
{
  "decisions": [
    {
      "id": "dec_1",
      "assignee": "김철수",
      "deadline": "2025-01-15"
    },
    {
      "id": "dec_2",
      "assignee": "박지영",
      "deadline": "2025-01-20"
    }
  ],
  "saveToNotion": true,
  "notionWorkspaceId": "workspace_abc"
}
```

**Response:**
```json
{
  "success": true,
  "meeting": {
    "id": "mtg_123",
    "status": "confirmed",
    "confirmedAt": "2025-12-30T15:30:00Z"
  },
  "notion": {
    "saved": true,
    "pageId": "page_xyz",
    "pageUrl": "https://notion.so/mtg_123"
  }
}
```

#### Notion 저장 재시도

```http
POST /api/meetings/{meetingId}/notion/retry
```

**Response:**
```json
{
  "success": true,
  "pageId": "page_xyz",
  "pageUrl": "https://notion.so/mtg_123"
}
```

### 4.17 나중에 처리 API (Part 4)

#### 나중에 처리 상태로 전환

```http
POST /api/meetings/{meetingId}/defer
```

**Response:**
```json
{
  "success": true,
  "meeting": {
    "id": "mtg_123",
    "status": "deferred",
    "deferredAt": "2025-12-30T15:25:00Z"
  },
  "notification": {
    "scheduled": true,
    "scheduledAt": "2025-12-30T18:00:00Z"
  }
}
```

#### 연기된 미팅 목록 조회

```http
GET /api/meetings/deferred
```

**Response:**
```json
{
  "meetings": [
    {
      "id": "mtg_123",
      "title": "A사 투자 검토 미팅",
      "deferredAt": "2025-12-30T15:25:00Z",
      "gaps": { "total": 2, "filled": 0 },
      "priority": "high"
    }
  ]
}
```

### 4.18 Part 4 데이터베이스 스키마

```prisma
// Part 4 관련 추가 스키마

model MeetingConfirmation {
  id                String    @id @default(cuid())
  meetingId         String    @unique
  meeting           Meeting   @relation(fields: [meetingId], references: [id])

  // 확정 상태
  status            ConfirmationStatus @default(PENDING)
  confirmedAt       DateTime?
  deferredAt        DateTime?

  // 결정 사항
  decisions         Decision[]

  // Notion 통합
  notionPageId      String?
  notionPageUrl     String?
  notionSavedAt     DateTime?
  notionError       String?

  // 메타데이터
  totalGaps         Int       @default(0)
  filledGaps        Int       @default(0)
  timeToConfirm     Int?      // 초 단위

  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
}

enum ConfirmationStatus {
  PENDING
  IN_PROGRESS
  CONFIRMED
  DEFERRED
  SKIPPED
}

model Decision {
  id              String    @id @default(cuid())
  confirmationId  String
  confirmation    MeetingConfirmation @relation(fields: [confirmationId], references: [id])

  // 결정 내용
  content         String
  assignee        String?
  deadline        DateTime?
  source          DecisionSource @default(AI_EXTRACTED)

  // 상태
  isComplete      Boolean   @default(false)
  isEdited        Boolean   @default(false)

  // 추출 메타데이터
  extractedFrom   String?   // 전사 텍스트 참조
  confidence      Float?    // AI 신뢰도

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

enum DecisionSource {
  AI_EXTRACTED
  USER_ADDED
  EDITED
}
```

### 4.19 Part 4 서비스 구현

```typescript
// src/services/ConfirmationService.ts

import { prisma } from '@/lib/prisma';
import { NotionService } from './NotionService';
import { AnalyticsService } from './AnalyticsService';

export class ConfirmationService {
  // 확정 모달 데이터 조회
  async getConfirmationData(meetingId: string) {
    const meeting = await prisma.meeting.findUnique({
      where: { id: meetingId },
      include: {
        confirmation: {
          include: {
            decisions: true
          }
        },
        insights: true,
        transcript: true
      }
    });

    if (!meeting) {
      throw new Error('Meeting not found');
    }

    // 확정 데이터가 없으면 AI 추출 실행
    if (!meeting.confirmation) {
      const confirmation = await this.createConfirmationFromAI(meeting);
      return confirmation;
    }

    return {
      meeting: {
        id: meeting.id,
        title: meeting.title,
        startTime: meeting.startTime,
        endTime: meeting.endTime,
        duration: meeting.duration
      },
      decisions: meeting.confirmation.decisions,
      insights: meeting.insights.map(i => i.content),
      gaps: {
        total: meeting.confirmation.totalGaps,
        filled: meeting.confirmation.filledGaps
      }
    };
  }

  // AI 기반 결정사항 추출
  private async createConfirmationFromAI(meeting: any) {
    const decisions = await this.extractDecisionsFromTranscript(
      meeting.transcript
    );

    const confirmation = await prisma.meetingConfirmation.create({
      data: {
        meetingId: meeting.id,
        status: 'PENDING',
        totalGaps: decisions.filter(d => !d.isComplete).length,
        filledGaps: 0,
        decisions: {
          create: decisions
        }
      },
      include: {
        decisions: true
      }
    });

    return confirmation;
  }

  // 결정 사항 업데이트
  async updateDecision(
    decisionId: string,
    updates: { assignee?: string; deadline?: string }
  ) {
    const decision = await prisma.decision.update({
      where: { id: decisionId },
      data: {
        ...updates,
        isComplete: !!updates.assignee && !!updates.deadline,
        isEdited: true
      }
    });

    // 빈칸 상태 재계산
    await this.recalculateGaps(decision.confirmationId);

    // 이벤트 로깅
    AnalyticsService.track('gap_field_filled', {
      decisionId,
      field: updates.assignee ? 'assignee' : 'deadline'
    });

    return decision;
  }

  // 확정 완료 처리
  async confirm(
    meetingId: string,
    data: {
      decisions: Array<{ id: string; assignee: string; deadline: string }>;
      saveToNotion: boolean;
      notionWorkspaceId?: string;
    }
  ) {
    const startTime = Date.now();

    // 결정사항 일괄 업데이트
    for (const decision of data.decisions) {
      await prisma.decision.update({
        where: { id: decision.id },
        data: {
          assignee: decision.assignee,
          deadline: new Date(decision.deadline),
          isComplete: true
        }
      });
    }

    // 확정 상태로 변경
    const confirmation = await prisma.meetingConfirmation.update({
      where: { meetingId },
      data: {
        status: 'CONFIRMED',
        confirmedAt: new Date(),
        timeToConfirm: Math.floor((Date.now() - startTime) / 1000)
      }
    });

    // Notion 저장 (선택적)
    let notionResult = null;
    if (data.saveToNotion && data.notionWorkspaceId) {
      try {
        notionResult = await NotionService.saveMeeting(
          meetingId,
          data.notionWorkspaceId
        );

        await prisma.meetingConfirmation.update({
          where: { meetingId },
          data: {
            notionPageId: notionResult.pageId,
            notionPageUrl: notionResult.pageUrl,
            notionSavedAt: new Date()
          }
        });
      } catch (error) {
        await prisma.meetingConfirmation.update({
          where: { meetingId },
          data: {
            notionError: error.message
          }
        });
      }
    }

    // 이벤트 로깅
    AnalyticsService.track('confirm_clicked', {
      meetingId,
      timeToConfirm: confirmation.timeToConfirm,
      totalDecisions: data.decisions.length,
      savedToNotion: !!notionResult
    });

    return {
      success: true,
      meeting: confirmation,
      notion: notionResult
    };
  }

  // 나중에 처리
  async defer(meetingId: string) {
    const confirmation = await prisma.meetingConfirmation.update({
      where: { meetingId },
      data: {
        status: 'DEFERRED',
        deferredAt: new Date()
      }
    });

    // 리마인더 알림 예약 (3시간 후)
    await this.scheduleReminder(meetingId, 3 * 60 * 60 * 1000);

    // 이벤트 로깅
    AnalyticsService.track('later_clicked', { meetingId });

    return confirmation;
  }

  // 빈칸 상태 재계산
  private async recalculateGaps(confirmationId: string) {
    const decisions = await prisma.decision.findMany({
      where: { confirmationId }
    });

    const totalGaps = decisions.filter(d => !d.isComplete).length;
    const filledGaps = decisions.filter(d => d.isComplete).length;

    await prisma.meetingConfirmation.update({
      where: { id: confirmationId },
      data: { totalGaps, filledGaps }
    });
  }

  // 리마인더 예약
  private async scheduleReminder(meetingId: string, delayMs: number) {
    // Bull Queue 또는 Vercel Cron 사용
    await queueService.add('confirmation_reminder', {
      meetingId,
      type: 'DEFERRED_MEETING'
    }, {
      delay: delayMs
    });
  }
}
```

**Part 4 핵심 지표:**
```
확정 완료율 = count(status = CONFIRMED) / count(meeting_ended WHERE duration > 300)
목표: > 85%

평균 확정 시간 = avg(timeToConfirm WHERE status = CONFIRMED)
목표: < 180초

빈칸 채우기율 = sum(filledGaps) / sum(totalGaps)
목표: > 90%

모달 포기율 = count(status = DEFERRED OR abandoned) / count(confirmation_shown)
목표: < 15%

Notion 저장 성공률 = count(notionSavedAt IS NOT NULL) / count(saveToNotion = true)
목표: > 95%

나중에 복귀율 = count(DEFERRED → CONFIRMED) / count(status = DEFERRED)
목표: > 70%
```

---

### 4.20 시맨틱 검색 API (Part 5)

```typescript
// POST /api/search
// 시맨틱 검색 실행

interface SearchRequest {
  query: string;                    // 사용자 검색어 (자연어)
  parsedQuery?: {                   // 프론트엔드에서 파싱된 의도 (선택)
    timeRange?: { start: Date; end: Date };
    person?: string;
    company?: string;
    topic?: string;
    decisionElement?: 'decision' | 'action' | 'risk' | 'assumption';
    keywords: string[];
  };
  filter?: {
    dateRange: 'all' | 'week' | 'month' | '3months' | 'custom';
    customDateRange?: { start: Date; end: Date };
    companies: string[];
    persons: string[];
    decisionElements: string[];
  };
  sortBy?: 'relevance' | 'date';
  limit?: number;                   // 기본값: 20
  offset?: number;                  // 페이지네이션
}

interface SearchResponse {
  results: SearchResult[];
  totalCount: number;
  searchTimeMs: number;
  semanticParseResult: {
    success: boolean;
    parsedIntent: ParsedQuery | null;
    confidence: number;
  };
  suggestions?: string[];           // 검색 결과 없을 때 제안
}

interface SearchResult {
  meetingId: string;
  meetingTitle: string;
  meetingDate: Date;
  company?: string;
  attendees: string[];
  snippets: Snippet[];
  decisionSummary?: string;
  mentionCount: number;
  relevanceScore: number;
}

interface Snippet {
  text: string;
  speaker?: string;
  timestamp?: Date;
  highlightRanges: Array<{ start: number; end: number }>;
}

// Request 예시
POST /api/search
{
  "query": "3개월 전 A사 CAC",
  "filter": {
    "dateRange": "all",
    "companies": [],
    "persons": [],
    "decisionElements": []
  },
  "sortBy": "relevance",
  "limit": 20,
  "offset": 0
}

// Response 예시
{
  "results": [
    {
      "meetingId": "mtg_abc123",
      "meetingTitle": "A사 2차 미팅",
      "meetingDate": "2024-09-15T14:00:00Z",
      "company": "A사",
      "attendees": ["김대표", "이과장", "민수"],
      "snippets": [
        {
          "text": "CAC는 채널별로 온라인 $85, 오프라인 $120입니다",
          "speaker": "김대표",
          "timestamp": "2024-09-15T14:32:00Z",
          "highlightRanges": [{ "start": 0, "end": 3 }]
        }
      ],
      "decisionSummary": "CAC 정보 확인: 온라인 $85, 오프라인 $120",
      "mentionCount": 3,
      "relevanceScore": 0.92
    }
  ],
  "totalCount": 3,
  "searchTimeMs": 156,
  "semanticParseResult": {
    "success": true,
    "parsedIntent": {
      "timeRange": {
        "start": "2024-09-01T00:00:00Z",
        "end": "2024-12-30T23:59:59Z"
      },
      "company": "A사",
      "keywords": ["CAC"]
    },
    "confidence": 0.89
  }
}
```

---

### 4.21 시맨틱 쿼리 파싱 서비스 (Part 5)

```typescript
// src/services/search/semanticParser.ts
// AI 기반 자연어 쿼리 파싱 서비스

import { openai } from '@/lib/openai';

interface ParsedQuery {
  timeRange?: { start: Date; end: Date };
  person?: string;
  company?: string;
  topic?: string;
  decisionElement?: 'decision' | 'action' | 'risk' | 'assumption';
  keywords: string[];
  intent?: 'find_info' | 'find_person_said' | 'find_decision' | 'find_timeline';
}

export async function parseSemanticQuery(query: string): Promise<{
  parsed: ParsedQuery;
  confidence: number;
}> {
  // 1. 규칙 기반 파싱 (빠른 처리)
  const ruleBasedResult = parseWithRules(query);

  // 규칙으로 충분히 파싱되면 바로 반환
  if (ruleBasedResult.confidence > 0.8) {
    return ruleBasedResult;
  }

  // 2. AI 기반 파싱 (복잡한 쿼리)
  const aiResult = await parseWithAI(query);

  // 결과 병합 (규칙 기반 + AI)
  return mergeResults(ruleBasedResult, aiResult);
}

function parseWithRules(query: string): { parsed: ParsedQuery; confidence: number } {
  const parsed: ParsedQuery = { keywords: [] };
  let matchCount = 0;
  let totalPossibleMatches = 4;

  // 시간 표현 파싱
  const timePatterns: Array<{
    regex: RegExp;
    handler: () => { start: Date; end: Date };
  }> = [
    {
      regex: /(\d+)개월\s*전/,
      handler: () => {
        const months = parseInt(query.match(/(\d+)개월\s*전/)![1]);
        const end = new Date();
        const start = new Date();
        start.setMonth(start.getMonth() - months);
        return { start, end };
      }
    },
    {
      regex: /지난\s*주/,
      handler: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 7);
        return { start, end };
      }
    },
    {
      regex: /지난\s*달/,
      handler: () => {
        const end = new Date();
        const start = new Date();
        start.setMonth(start.getMonth() - 1);
        return { start, end };
      }
    },
    {
      regex: /이번\s*주/,
      handler: () => {
        const end = new Date();
        const start = new Date();
        const dayOfWeek = start.getDay();
        start.setDate(start.getDate() - dayOfWeek);
        return { start, end };
      }
    },
  ];

  for (const { regex, handler } of timePatterns) {
    if (regex.test(query)) {
      parsed.timeRange = handler();
      matchCount++;
      break;
    }
  }

  // 회사명 추출
  const companyMatch = query.match(/([A-Z가-힣]+사)/);
  if (companyMatch) {
    parsed.company = companyMatch[1];
    matchCount++;
  }

  // 사람 이름 추출
  const personPatterns = [
    /([가-힣]{2,4})(대표|과장|부장|팀장|사장|이사|님)/,
    /([가-힣]{2,4})가\s*(말한|약속한|언급한)/,
  ];
  for (const pattern of personPatterns) {
    const match = query.match(pattern);
    if (match) {
      parsed.person = match[1] + (match[2]?.match(/대표|과장|부장|팀장|사장|이사/) ? match[2] : '');
      matchCount++;
      break;
    }
  }

  // 결정 요소 키워드 추출
  const decisionKeywords: Record<string, ParsedQuery['decisionElement']> = {
    '결정': 'decision',
    '결론': 'decision',
    '합의': 'decision',
    '액션': 'action',
    '할일': 'action',
    '약속': 'action',
    '리스크': 'risk',
    '우려': 'risk',
    '위험': 'risk',
    '미확인': 'assumption',
    '가정': 'assumption',
  };

  for (const [keyword, element] of Object.entries(decisionKeywords)) {
    if (query.includes(keyword)) {
      parsed.decisionElement = element;
      matchCount++;
      break;
    }
  }

  // 남은 키워드 추출
  let cleanedQuery = query;
  if (parsed.timeRange) cleanedQuery = cleanedQuery.replace(/\d+개월\s*전|지난\s*(주|달)|이번\s*주/g, '');
  if (parsed.company) cleanedQuery = cleanedQuery.replace(parsed.company, '');
  if (parsed.person) cleanedQuery = cleanedQuery.replace(parsed.person, '');

  const keywords = cleanedQuery
    .split(/\s+/)
    .filter(k => k.length > 1 && !['이', '그', '저', '의', '를', '을', '가', '에', '한'].includes(k));

  if (keywords.length > 0) {
    parsed.keywords = keywords;
  }

  const confidence = matchCount / totalPossibleMatches;
  return { parsed, confidence: Math.max(confidence, 0.3) };
}

async function parseWithAI(query: string): Promise<{ parsed: ParsedQuery; confidence: number }> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: `You are a search query parser for a meeting intelligence system. Parse the user's natural language query into structured search parameters.

Output JSON with these fields:
- timeRange: { start: ISO date, end: ISO date } - if time is mentioned
- person: string - if a person's name is mentioned
- company: string - if a company is mentioned
- topic: string - the main topic being searched
- decisionElement: "decision" | "action" | "risk" | "assumption" - if a specific type is requested
- keywords: string[] - remaining important keywords
- intent: "find_info" | "find_person_said" | "find_decision" | "find_timeline"
- confidence: number 0-1`
      },
      { role: 'user', content: query }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.1,
  });

  try {
    const result = JSON.parse(response.choices[0].message.content || '{}');
    return {
      parsed: {
        timeRange: result.timeRange,
        person: result.person,
        company: result.company,
        topic: result.topic,
        decisionElement: result.decisionElement,
        keywords: result.keywords || [],
        intent: result.intent,
      },
      confidence: result.confidence || 0.5,
    };
  } catch {
    return { parsed: { keywords: [query] }, confidence: 0.3 };
  }
}

function mergeResults(
  ruleBased: { parsed: ParsedQuery; confidence: number },
  aiBased: { parsed: ParsedQuery; confidence: number }
): { parsed: ParsedQuery; confidence: number } {
  // 각 필드별로 더 확실한 결과 선택
  const merged: ParsedQuery = {
    timeRange: ruleBased.parsed.timeRange || aiBased.parsed.timeRange,
    person: ruleBased.parsed.person || aiBased.parsed.person,
    company: ruleBased.parsed.company || aiBased.parsed.company,
    topic: aiBased.parsed.topic,
    decisionElement: ruleBased.parsed.decisionElement || aiBased.parsed.decisionElement,
    keywords: [...new Set([...ruleBased.parsed.keywords, ...aiBased.parsed.keywords])],
    intent: aiBased.parsed.intent,
  };

  const avgConfidence = (ruleBased.confidence + aiBased.confidence) / 2;
  return { parsed: merged, confidence: avgConfidence };
}
```

---

### 4.22 벡터 검색 서비스 (Part 5)

```typescript
// src/services/search/vectorSearch.ts
// Pinecone 기반 벡터 검색 서비스

import { Pinecone } from '@pinecone-database/pinecone';
import { openai } from '@/lib/openai';

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const index = pinecone.index('onno-meetings');

interface VectorSearchParams {
  query: string;
  filters?: {
    userId: string;
    teamId?: string;
    dateRange?: { start: Date; end: Date };
    companies?: string[];
    attendees?: string[];
  };
  topK?: number;
}

interface VectorSearchResult {
  meetingId: string;
  segmentId: string;
  score: number;
  text: string;
  metadata: {
    speaker?: string;
    timestamp?: Date;
    meetingTitle?: string;
    company?: string;
  };
}

export async function searchWithVectors(
  params: VectorSearchParams
): Promise<VectorSearchResult[]> {
  const { query, filters, topK = 50 } = params;

  // 1. 쿼리 임베딩 생성
  const embedding = await generateEmbedding(query);

  // 2. Pinecone 필터 구성
  const pineconeFilter: Record<string, any> = {
    userId: filters?.userId,
  };

  if (filters?.teamId) {
    pineconeFilter.teamId = filters.teamId;
  }

  if (filters?.dateRange) {
    pineconeFilter.meetingDate = {
      $gte: filters.dateRange.start.toISOString(),
      $lte: filters.dateRange.end.toISOString(),
    };
  }

  if (filters?.companies?.length) {
    pineconeFilter.company = { $in: filters.companies };
  }

  // 3. 벡터 검색 실행
  const results = await index.namespace('transcripts').query({
    vector: embedding,
    topK,
    filter: pineconeFilter,
    includeMetadata: true,
  });

  // 4. 결과 변환
  return results.matches?.map((match) => ({
    meetingId: match.metadata?.meetingId as string,
    segmentId: match.id,
    score: match.score || 0,
    text: match.metadata?.text as string,
    metadata: {
      speaker: match.metadata?.speaker as string | undefined,
      timestamp: match.metadata?.timestamp
        ? new Date(match.metadata.timestamp as string)
        : undefined,
      meetingTitle: match.metadata?.meetingTitle as string | undefined,
      company: match.metadata?.company as string | undefined,
    },
  })) || [];
}

async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });
  return response.data[0].embedding;
}

// 검색 결과 리랭킹
export async function rerankResults(
  query: string,
  results: VectorSearchResult[],
  userHistory?: {
    frequentSearches: string[];
    frequentMeetings: string[];
  }
): Promise<VectorSearchResult[]> {
  // 1. 기본 벡터 유사도 점수
  const scoredResults = results.map((r) => ({
    ...r,
    adjustedScore: r.score,
  }));

  // 2. 최신성 부스트 (최근 미팅 우선)
  const now = new Date();
  for (const result of scoredResults) {
    if (result.metadata.timestamp) {
      const daysDiff = (now.getTime() - result.metadata.timestamp.getTime()) / (1000 * 60 * 60 * 24);
      // 최근 30일 이내면 점수 부스트
      if (daysDiff < 30) {
        result.adjustedScore *= 1 + (0.25 * (30 - daysDiff) / 30);
      }
    }
  }

  // 3. 사용자 히스토리 기반 부스트
  if (userHistory) {
    for (const result of scoredResults) {
      // 자주 접근하는 미팅이면 부스트
      if (userHistory.frequentMeetings.includes(result.meetingId)) {
        result.adjustedScore *= 1.15;
      }
    }
  }

  // 4. 정확 매칭 부스트
  const queryLower = query.toLowerCase();
  for (const result of scoredResults) {
    if (result.text.toLowerCase().includes(queryLower)) {
      result.adjustedScore *= 1.3;
    }
  }

  // 5. 점수 순 정렬
  return scoredResults.sort((a, b) => b.adjustedScore - a.adjustedScore);
}

// 임베딩 인덱싱 (미팅 저장 시 호출)
export async function indexMeetingSegments(
  meetingId: string,
  segments: Array<{
    id: string;
    text: string;
    speaker?: string;
    timestamp?: Date;
  }>,
  metadata: {
    userId: string;
    teamId?: string;
    meetingTitle: string;
    meetingDate: Date;
    company?: string;
    attendees: string[];
  }
): Promise<void> {
  // 세그먼트별 임베딩 생성
  const vectors = await Promise.all(
    segments.map(async (segment) => {
      const embedding = await generateEmbedding(segment.text);
      return {
        id: segment.id,
        values: embedding,
        metadata: {
          meetingId,
          text: segment.text,
          speaker: segment.speaker,
          timestamp: segment.timestamp?.toISOString(),
          ...metadata,
        },
      };
    })
  );

  // Pinecone에 업서트
  await index.namespace('transcripts').upsert(vectors);
}
```

---

### 4.23 검색 결과 그룹화 및 랭킹 (Part 5)

```typescript
// src/services/search/resultAggregator.ts
// 검색 결과를 미팅 단위로 그룹화하고 랭킹

import { VectorSearchResult } from './vectorSearch';
import { prisma } from '@/lib/prisma';

interface AggregatedSearchResult {
  meetingId: string;
  meetingTitle: string;
  meetingDate: Date;
  company?: string;
  attendees: string[];
  snippets: Array<{
    text: string;
    speaker?: string;
    timestamp?: Date;
    highlightRanges: Array<{ start: number; end: number }>;
  }>;
  decisionSummary?: string;
  mentionCount: number;
  relevanceScore: number;
}

export async function aggregateSearchResults(
  vectorResults: VectorSearchResult[],
  query: string,
  sortBy: 'relevance' | 'date'
): Promise<AggregatedSearchResult[]> {
  // 1. 미팅 ID 별로 그룹화
  const meetingGroups = new Map<string, VectorSearchResult[]>();

  for (const result of vectorResults) {
    const existing = meetingGroups.get(result.meetingId) || [];
    existing.push(result);
    meetingGroups.set(result.meetingId, existing);
  }

  // 2. 각 미팅의 상세 정보 조회
  const meetingIds = Array.from(meetingGroups.keys());
  const meetings = await prisma.meeting.findMany({
    where: { id: { in: meetingIds } },
    include: {
      attendees: true,
      decisions: {
        take: 3,
        orderBy: { confidence: 'desc' },
      },
    },
  });

  // 3. 결과 구성
  const aggregatedResults: AggregatedSearchResult[] = [];

  for (const meeting of meetings) {
    const segments = meetingGroups.get(meeting.id) || [];

    // 키워드 하이라이팅
    const snippets = segments.slice(0, 3).map((seg) => ({
      text: seg.text,
      speaker: seg.metadata.speaker,
      timestamp: seg.metadata.timestamp,
      highlightRanges: findHighlightRanges(seg.text, query),
    }));

    // 관련도 점수 계산 (세그먼트 점수 평균)
    const avgScore = segments.reduce((sum, s) => sum + s.score, 0) / segments.length;

    // 결정 사항 요약
    const decisionSummary = meeting.decisions.length > 0
      ? meeting.decisions.map(d => d.content).join(' | ')
      : undefined;

    aggregatedResults.push({
      meetingId: meeting.id,
      meetingTitle: meeting.title,
      meetingDate: meeting.scheduledAt,
      company: meeting.companyName || undefined,
      attendees: meeting.attendees.map(a => a.name),
      snippets,
      decisionSummary,
      mentionCount: segments.length,
      relevanceScore: avgScore,
    });
  }

  // 4. 정렬
  if (sortBy === 'relevance') {
    aggregatedResults.sort((a, b) => b.relevanceScore - a.relevanceScore);
  } else {
    aggregatedResults.sort((a, b) => b.meetingDate.getTime() - a.meetingDate.getTime());
  }

  return aggregatedResults;
}

function findHighlightRanges(
  text: string,
  query: string
): Array<{ start: number; end: number }> {
  const ranges: Array<{ start: number; end: number }> = [];
  const keywords = query.split(/\s+/).filter(k => k.length > 1);
  const textLower = text.toLowerCase();

  for (const keyword of keywords) {
    const keywordLower = keyword.toLowerCase();
    let startIndex = 0;

    while (true) {
      const index = textLower.indexOf(keywordLower, startIndex);
      if (index === -1) break;

      ranges.push({
        start: index,
        end: index + keyword.length,
      });
      startIndex = index + 1;
    }
  }

  // 오버래핑 범위 병합
  return mergeRanges(ranges);
}

function mergeRanges(
  ranges: Array<{ start: number; end: number }>
): Array<{ start: number; end: number }> {
  if (ranges.length === 0) return [];

  ranges.sort((a, b) => a.start - b.start);
  const merged: Array<{ start: number; end: number }> = [ranges[0]];

  for (let i = 1; i < ranges.length; i++) {
    const current = ranges[i];
    const last = merged[merged.length - 1];

    if (current.start <= last.end) {
      last.end = Math.max(last.end, current.end);
    } else {
      merged.push(current);
    }
  }

  return merged;
}
```

---

### 4.24 관련 미팅 API (Part 5.3)

```typescript
// GET /api/meetings/:meetingId/related
// 관련 미팅 조회

interface RelatedMeetingsResponse {
  meetings: RelatedMeeting[];
}

interface RelatedMeeting {
  meetingId: string;
  meetingTitle: string;
  meetingDate: Date;
  relationType: 'same_company' | 'same_topic' | 'same_attendees' | 'follow_up';
  relevanceScore: number;
  topicOverlap?: string[];
}

// 서비스 구현
export async function getRelatedMeetings(
  meetingId: string,
  userId: string,
  limit: number = 5
): Promise<RelatedMeeting[]> {
  // 현재 미팅 정보 조회
  const currentMeeting = await prisma.meeting.findUnique({
    where: { id: meetingId },
    include: {
      attendees: true,
      decisions: true,
    },
  });

  if (!currentMeeting) return [];

  // 1. 같은 회사 미팅
  const sameCompanyMeetings = currentMeeting.companyName
    ? await prisma.meeting.findMany({
        where: {
          userId,
          companyName: currentMeeting.companyName,
          id: { not: meetingId },
        },
        orderBy: { scheduledAt: 'desc' },
        take: 3,
      })
    : [];

  // 2. 같은 참석자 미팅
  const attendeeNames = currentMeeting.attendees.map((a) => a.name);
  const sameAttendeeMeetings = await prisma.meeting.findMany({
    where: {
      userId,
      id: { not: meetingId },
      attendees: {
        some: { name: { in: attendeeNames } },
      },
    },
    orderBy: { scheduledAt: 'desc' },
    take: 3,
  });

  // 3. 비슷한 주제 미팅 (벡터 검색 활용)
  const meetingTopics = currentMeeting.decisions
    .map((d) => d.content)
    .join(' ')
    .slice(0, 500);

  const similarTopicResults = meetingTopics
    ? await searchWithVectors({
        query: meetingTopics,
        filters: { userId },
        topK: 10,
      })
    : [];

  const similarTopicMeetingIds = [
    ...new Set(
      similarTopicResults
        .filter((r) => r.meetingId !== meetingId)
        .map((r) => r.meetingId)
    ),
  ].slice(0, 3);

  // 4. 결과 조합 및 중복 제거
  const allRelated = new Map<string, RelatedMeeting>();

  for (const m of sameCompanyMeetings) {
    allRelated.set(m.id, {
      meetingId: m.id,
      meetingTitle: m.title,
      meetingDate: m.scheduledAt,
      relationType: 'same_company',
      relevanceScore: 0.9,
    });
  }

  for (const m of sameAttendeeMeetings) {
    if (!allRelated.has(m.id)) {
      allRelated.set(m.id, {
        meetingId: m.id,
        meetingTitle: m.title,
        meetingDate: m.scheduledAt,
        relationType: 'same_attendees',
        relevanceScore: 0.7,
      });
    }
  }

  for (const mId of similarTopicMeetingIds) {
    if (!allRelated.has(mId)) {
      const m = await prisma.meeting.findUnique({ where: { id: mId } });
      if (m) {
        allRelated.set(mId, {
          meetingId: m.id,
          meetingTitle: m.title,
          meetingDate: m.scheduledAt,
          relationType: 'same_topic',
          relevanceScore: 0.6,
        });
      }
    }
  }

  // 점수 순 정렬 후 반환
  return Array.from(allRelated.values())
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, limit);
}
```

---

### 4.25 검색 히스토리 및 추천 API (Part 5)

```typescript
// GET /api/search/suggestions
// 검색 추천 및 히스토리 조회

interface SearchSuggestionsResponse {
  recentSearches: Array<{
    query: string;
    timestamp: Date;
  }>;
  suggestions: string[];
  frequentTopics: Array<{
    topic: string;
    count: number;
  }>;
}

// 서비스 구현
export async function getSearchSuggestions(userId: string): Promise<SearchSuggestionsResponse> {
  // 1. 최근 검색 기록
  const recentSearches = await prisma.searchHistory.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 10,
    select: {
      query: true,
      createdAt: true,
    },
  });

  // 2. 최근 미팅 기반 추천 주제
  const recentMeetings = await prisma.meeting.findMany({
    where: { userId },
    orderBy: { scheduledAt: 'desc' },
    take: 10,
    include: {
      decisions: { select: { content: true } },
    },
  });

  // 결정사항에서 키워드 추출
  const allDecisions = recentMeetings.flatMap((m) => m.decisions.map((d) => d.content));
  const keywordCounts = new Map<string, number>();

  for (const decision of allDecisions) {
    const keywords = extractKeywords(decision);
    for (const kw of keywords) {
      keywordCounts.set(kw, (keywordCounts.get(kw) || 0) + 1);
    }
  }

  // 3. 자주 검색되는 주제
  const frequentTopics = Array.from(keywordCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([topic, count]) => ({ topic, count }));

  // 4. 추천 검색어 (회사명, 참석자명 등)
  const companies = await prisma.meeting.findMany({
    where: { userId, companyName: { not: null } },
    distinct: ['companyName'],
    select: { companyName: true },
    take: 5,
  });

  const suggestions = [
    ...companies.map((c) => c.companyName!),
    ...frequentTopics.slice(0, 3).map((t) => t.topic),
    '이번 주',
    '미확인',
    '리스크',
  ];

  return {
    recentSearches: recentSearches.map((s) => ({
      query: s.query,
      timestamp: s.createdAt,
    })),
    suggestions: [...new Set(suggestions)].slice(0, 8),
    frequentTopics: frequentTopics.slice(0, 5),
  };
}

// POST /api/search/history
// 검색 기록 저장
export async function saveSearchHistory(
  userId: string,
  query: string,
  resultCount: number
): Promise<void> {
  await prisma.searchHistory.create({
    data: {
      userId,
      query,
      resultCount,
    },
  });
}

function extractKeywords(text: string): string[] {
  // 간단한 키워드 추출 (실제로는 더 정교한 NLP 사용)
  return text
    .split(/[\s,.]+/)
    .filter((w) => w.length > 2)
    .filter((w) => !['그리고', '하지만', '그러나', '또한', '따라서'].includes(w))
    .slice(0, 3);
}
```

---

### 4.26 Part 5 데이터베이스 스키마

```prisma
// Part 5 관련 추가 스키마

model SearchHistory {
  id          String   @id @default(cuid())
  userId      String
  query       String
  resultCount Int
  createdAt   DateTime @default(now())

  user User @relation(fields: [userId], references: [id])

  @@index([userId, createdAt(sort: Desc)])
}

model SearchAnalytics {
  id                String   @id @default(cuid())
  userId            String
  query             String
  queryType         String   // keyword, natural, time, person, decision_element
  semanticSuccess   Boolean
  resultCount       Int
  clickedResultIndex Int?
  timeToClickMs     Int?
  searchTimeMs      Int
  filterUsed        Boolean
  createdAt         DateTime @default(now())

  user User @relation(fields: [userId], references: [id])

  @@index([userId, createdAt(sort: Desc)])
  @@index([queryType])
}

model MeetingEmbedding {
  id        String @id @default(cuid())
  meetingId String
  segmentId String
  text      String @db.Text
  embedding Bytes  // 벡터 데이터 (실제로는 Pinecone에 저장)

  meeting Meeting @relation(fields: [meetingId], references: [id])

  @@index([meetingId])
}
```

---

**Part 5 핵심 지표:**

```sql
-- 검색 사용률
검색 사용률 = count(search_submitted) / count(dau)
목표: > 20%

-- 검색 성공률
검색 성공률 = count(result_clicked) / count(search_submitted)
목표: > 70%

-- 첫 결과 클릭률
첫 결과 클릭률 = count(clickedResultIndex = 0) / count(result_clicked)
목표: > 50%

-- 시맨틱 검색 성공률
시맨틱 성공률 = count(semanticSuccess = true) / count(search_submitted)
목표: > 80%

-- 평균 검색 시간
평균 검색 시간 = avg(timeToClickMs WHERE result_clicked)
목표: < 10초

-- 재검색 비율
재검색 비율 = count(search_submitted WHERE 이전 검색 5분 이내) / count(search_submitted)
목표: < 25%

-- 필터 사용률
필터 사용률 = count(filterUsed = true) / count(search_completed)
목표: < 30% (시맨틱이 잘 되면 필터 불필요)
```

---

### 4.27 설정 API (Part 5.2)

```typescript
// === 설정 개요 ===
// 설정 철학: "필요할 때만 찾고, 변경은 최소화"
// 설정 진입률 < 10%가 성공 지표 (잘 동작하면 설정할 필요 없음)

// === 설정 카테고리 ===
// 1. 통합 관리 (40%) - Notion, Calendar OAuth
// 2. 알림 설정 (30%) - 빈도, 카테고리별 on/off
// 3. 프로필 (15%) - 이름, 이메일, 비밀번호
// 4. 구독 (10%) - 플랜, 결제
// 5. 기타 (5%) - 데이터, 로그아웃

// === 설정 메인 API ===
// GET /api/settings
export async function GET(request: NextRequest) {
  const session = await requireAuth(request);

  const settings = await prisma.userSettings.findUnique({
    where: { userId: session.userId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          profileImage: true,
        }
      },
      integrations: true,
      notificationSettings: true,
      subscription: true,
    }
  });

  // 통합 상태 계산
  const integrationStatus = calculateIntegrationStatus(settings.integrations);

  return NextResponse.json({
    success: true,
    data: {
      profile: {
        id: settings.user.id,
        name: settings.user.name,
        email: settings.user.email,
        profileImage: settings.user.profileImage,
      },
      integrations: {
        notion: integrationStatus.notion,
        googleCalendar: integrationStatus.googleCalendar,
        outlook: integrationStatus.outlook,
        slack: { status: 'coming_soon' },
        salesforce: { status: 'coming_soon' },
      },
      notifications: settings.notificationSettings,
      subscription: {
        plan: settings.subscription?.plan || 'free',
        status: settings.subscription?.status || 'active',
        expiresAt: settings.subscription?.expiresAt,
      },
      dataPrivacy: {
        retentionDays: settings.dataRetentionDays,
        shareAnalytics: settings.shareAnalytics,
      }
    }
  });
}

// 통합 상태 계산 함수
function calculateIntegrationStatus(integrations: Integration[]) {
  const statusMap: Record<string, IntegrationStatus> = {};

  const providers = ['notion', 'google_calendar', 'outlook'];

  for (const provider of providers) {
    const integration = integrations.find(i => i.provider === provider);

    if (!integration) {
      statusMap[toCamelCase(provider)] = {
        status: 'disconnected',
        isRequired: provider === 'notion' || provider === 'google_calendar',
      };
    } else if (isTokenExpired(integration)) {
      statusMap[toCamelCase(provider)] = {
        status: 'expired',
        accountEmail: integration.accountEmail,
        expiresAt: integration.tokenExpiresAt,
        isRequired: provider === 'notion' || provider === 'google_calendar',
      };
    } else {
      statusMap[toCamelCase(provider)] = {
        status: 'connected',
        accountEmail: integration.accountEmail,
        connectedAt: integration.connectedAt,
        lastSyncedAt: integration.lastSyncedAt,
      };
    }
  }

  return statusMap;
}
```

---

### 4.28 통합 관리 서비스 (Part 5.2)

```typescript
// === OAuth 연동 시작 ===
// POST /api/settings/integrations/:provider/connect
export async function POST(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  const session = await requireAuth(request);
  const { provider } = params;

  // 지원되는 프로바이더 확인
  const supportedProviders = ['notion', 'google_calendar', 'outlook'];
  if (!supportedProviders.includes(provider)) {
    return NextResponse.json({
      success: false,
      error: {
        code: 'UNSUPPORTED_PROVIDER',
        message: `${provider}는 아직 지원되지 않습니다`
      }
    }, { status: 400 });
  }

  // OAuth URL 생성
  const oauthUrl = generateOAuthUrl(provider, {
    userId: session.userId,
    redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/${provider}`,
    state: generateSecureState(session.userId),
    scopes: getProviderScopes(provider),
  });

  // 연동 시도 로깅
  await prisma.integrationEvent.create({
    data: {
      userId: session.userId,
      provider,
      eventType: 'oauth_started',
      timestamp: new Date(),
    }
  });

  return NextResponse.json({
    success: true,
    data: {
      oauthUrl,
      provider,
      expiresIn: 600, // 10분
    }
  });
}

// 프로바이더별 OAuth URL 생성
function generateOAuthUrl(
  provider: string,
  config: OAuthConfig
): string {
  switch (provider) {
    case 'notion':
      return `https://api.notion.com/v1/oauth/authorize?${new URLSearchParams({
        client_id: process.env.NOTION_CLIENT_ID!,
        redirect_uri: config.redirectUri,
        response_type: 'code',
        state: config.state,
        owner: 'user',
      })}`;

    case 'google_calendar':
      return `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        redirect_uri: config.redirectUri,
        response_type: 'code',
        state: config.state,
        scope: config.scopes.join(' '),
        access_type: 'offline',
        prompt: 'consent',
      })}`;

    case 'outlook':
      return `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${new URLSearchParams({
        client_id: process.env.OUTLOOK_CLIENT_ID!,
        redirect_uri: config.redirectUri,
        response_type: 'code',
        state: config.state,
        scope: config.scopes.join(' '),
      })}`;

    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

// 프로바이더별 스코프
function getProviderScopes(provider: string): string[] {
  switch (provider) {
    case 'notion':
      return []; // Notion은 OAuth 과정에서 사용자가 선택

    case 'google_calendar':
      return [
        'https://www.googleapis.com/auth/calendar.readonly',
        'https://www.googleapis.com/auth/calendar.events.readonly',
        'openid',
        'email',
        'profile',
      ];

    case 'outlook':
      return [
        'Calendars.Read',
        'User.Read',
        'offline_access',
      ];

    default:
      return [];
  }
}

// === OAuth 콜백 처리 ===
// GET /api/auth/callback/:provider
export async function handleOAuthCallback(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  // 에러 처리
  if (error) {
    return redirectWithError(error, params.provider);
  }

  // 상태 검증
  const statePayload = verifyState(state);
  if (!statePayload) {
    return redirectWithError('invalid_state', params.provider);
  }

  try {
    // 토큰 교환
    const tokens = await exchangeCodeForTokens(params.provider, code);

    // 사용자 정보 가져오기
    const accountInfo = await getAccountInfo(params.provider, tokens.accessToken);

    // 통합 저장/업데이트
    await prisma.integration.upsert({
      where: {
        userId_provider: {
          userId: statePayload.userId,
          provider: params.provider,
        }
      },
      update: {
        accessToken: encrypt(tokens.accessToken),
        refreshToken: tokens.refreshToken ? encrypt(tokens.refreshToken) : null,
        tokenExpiresAt: new Date(Date.now() + tokens.expiresIn * 1000),
        accountEmail: accountInfo.email,
        accountName: accountInfo.name,
        lastSyncedAt: new Date(),
      },
      create: {
        userId: statePayload.userId,
        provider: params.provider,
        accessToken: encrypt(tokens.accessToken),
        refreshToken: tokens.refreshToken ? encrypt(tokens.refreshToken) : null,
        tokenExpiresAt: new Date(Date.now() + tokens.expiresIn * 1000),
        accountEmail: accountInfo.email,
        accountName: accountInfo.name,
        connectedAt: new Date(),
        lastSyncedAt: new Date(),
      }
    });

    // 연동 성공 로깅
    await prisma.integrationEvent.create({
      data: {
        userId: statePayload.userId,
        provider: params.provider,
        eventType: 'connected',
        metadata: {
          accountEmail: accountInfo.email,
        },
        timestamp: new Date(),
      }
    });

    // Notion인 경우 기본 데이터베이스 선택 화면으로
    if (params.provider === 'notion') {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/settings/integrations/notion/select-database`
      );
    }

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/settings/integrations?connected=${params.provider}`
    );

  } catch (error) {
    await logOAuthError(statePayload.userId, params.provider, error);
    return redirectWithError('token_exchange_failed', params.provider);
  }
}

// === 통합 연결 해제 ===
// DELETE /api/settings/integrations/:provider
export async function DELETE(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  const session = await requireAuth(request);
  const { provider } = params;

  // 필수 통합인지 확인
  const isRequired = ['notion', 'google_calendar'].includes(provider);

  // 해제 확인 토큰 검증 (이중 확인)
  const body = await request.json();
  if (!body.confirmationToken) {
    return NextResponse.json({
      success: false,
      error: {
        code: 'CONFIRMATION_REQUIRED',
        message: '연결 해제를 위해 확인이 필요합니다',
        isRequired,
        consequences: getDisconnectionConsequences(provider),
      }
    }, { status: 400 });
  }

  // 통합 삭제
  await prisma.integration.delete({
    where: {
      userId_provider: {
        userId: session.userId,
        provider,
      }
    }
  });

  // 연결 해제 로깅
  await prisma.integrationEvent.create({
    data: {
      userId: session.userId,
      provider,
      eventType: 'disconnected',
      metadata: {
        reason: body.reason || 'user_initiated',
      },
      timestamp: new Date(),
    }
  });

  return NextResponse.json({
    success: true,
    data: {
      provider,
      disconnectedAt: new Date().toISOString(),
      warning: isRequired
        ? '필수 통합이 해제되었습니다. 일부 기능이 제한됩니다.'
        : null,
    }
  });
}

// 연결 해제 결과 설명
function getDisconnectionConsequences(provider: string): string[] {
  switch (provider) {
    case 'notion':
      return [
        '새로운 미팅 기록이 Notion에 저장되지 않습니다',
        '기존 저장된 기록은 Notion에 유지됩니다',
        '재연결 시 다시 데이터베이스를 선택해야 합니다',
      ];

    case 'google_calendar':
      return [
        'Google Calendar 미팅이 Today에 표시되지 않습니다',
        '미팅 자동 준비 기능이 비활성화됩니다',
        'Outlook Calendar만 사용 가능합니다',
      ];

    case 'outlook':
      return [
        'Outlook Calendar 미팅이 Today에 표시되지 않습니다',
        'Google Calendar만 사용 가능합니다',
      ];

    default:
      return [];
  }
}

// === Notion 데이터베이스 선택 ===
// GET /api/settings/integrations/notion/databases
export async function getNotionDatabases(request: NextRequest) {
  const session = await requireAuth(request);

  const integration = await getIntegrationWithRefresh(
    session.userId,
    'notion'
  );

  if (!integration) {
    return NextResponse.json({
      success: false,
      error: {
        code: 'NOT_CONNECTED',
        message: 'Notion이 연결되어 있지 않습니다',
      }
    }, { status: 400 });
  }

  // Notion API로 데이터베이스 목록 가져오기
  const notionClient = new Client({ auth: decrypt(integration.accessToken) });

  const response = await notionClient.search({
    filter: { property: 'object', value: 'database' },
    sort: { direction: 'descending', timestamp: 'last_edited_time' },
  });

  const databases = response.results
    .filter((db: any) => db.object === 'database')
    .map((db: any) => ({
      id: db.id,
      title: db.title?.[0]?.plain_text || 'Untitled',
      icon: db.icon?.emoji || db.icon?.external?.url || null,
      lastEditedAt: db.last_edited_time,
    }));

  return NextResponse.json({
    success: true,
    data: {
      databases,
      currentDatabaseId: integration.notionDatabaseId,
    }
  });
}

// POST /api/settings/integrations/notion/databases
export async function selectNotionDatabase(request: NextRequest) {
  const session = await requireAuth(request);
  const body = await request.json();

  const schema = z.object({
    databaseId: z.string().min(1),
  });

  const validated = schema.parse(body);

  // 데이터베이스 접근 가능한지 확인
  const integration = await getIntegrationWithRefresh(session.userId, 'notion');
  const notionClient = new Client({ auth: decrypt(integration.accessToken) });

  try {
    await notionClient.databases.retrieve({
      database_id: validated.databaseId,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: {
        code: 'DATABASE_NOT_ACCESSIBLE',
        message: '선택한 데이터베이스에 접근할 수 없습니다',
      }
    }, { status: 400 });
  }

  // 저장
  await prisma.integration.update({
    where: {
      userId_provider: {
        userId: session.userId,
        provider: 'notion',
      }
    },
    data: {
      notionDatabaseId: validated.databaseId,
    }
  });

  return NextResponse.json({
    success: true,
    data: {
      databaseId: validated.databaseId,
      message: 'Notion 데이터베이스가 설정되었습니다',
    }
  });
}
```

---

### 4.29 알림 설정 서비스 (Part 5.2)

```typescript
// === 알림 설정 조회 ===
// GET /api/settings/notifications
export async function GET(request: NextRequest) {
  const session = await requireAuth(request);

  const settings = await prisma.notificationSettings.findUnique({
    where: { userId: session.userId },
  });

  // 기본값 반환
  if (!settings) {
    return NextResponse.json({
      success: true,
      data: getDefaultNotificationSettings(),
    });
  }

  return NextResponse.json({
    success: true,
    data: {
      // 전체 빈도 (low/medium/high)
      frequency: settings.frequency,

      // 미팅 전
      beforeMeeting: {
        prepReminder: settings.prepReminderEnabled,
        prepReminderTime: settings.prepReminderMinutes, // 15분 전
        calendarSync: settings.calendarSyncEnabled,
      },

      // 미팅 중
      duringMeeting: {
        hudAlerts: settings.hudAlertsEnabled,
        gapDetection: settings.gapDetectionEnabled,
        suggestionLevel: settings.suggestionLevel, // minimal/balanced/proactive
      },

      // 미팅 후
      afterMeeting: {
        summaryReady: settings.summaryReadyEnabled,
        actionItemReminder: settings.actionItemReminderEnabled,
        followUpSuggestion: settings.followUpSuggestionEnabled,
      },

      // 방해 금지
      doNotDisturb: {
        enabled: settings.dndEnabled,
        startTime: settings.dndStartTime, // "22:00"
        endTime: settings.dndEndTime,     // "08:00"
        weekendsOff: settings.dndWeekendsOff,
      },

      // 채널
      channels: {
        inApp: settings.inAppEnabled,
        email: settings.emailEnabled,
        emailDigest: settings.emailDigestFrequency, // 'realtime' | 'daily' | 'weekly' | 'off'
      }
    }
  });
}

// 기본 알림 설정
function getDefaultNotificationSettings(): NotificationSettingsResponse {
  return {
    frequency: 'medium',
    beforeMeeting: {
      prepReminder: true,
      prepReminderTime: 15,
      calendarSync: true,
    },
    duringMeeting: {
      hudAlerts: true,
      gapDetection: true,
      suggestionLevel: 'balanced',
    },
    afterMeeting: {
      summaryReady: true,
      actionItemReminder: true,
      followUpSuggestion: false,
    },
    doNotDisturb: {
      enabled: false,
      startTime: '22:00',
      endTime: '08:00',
      weekendsOff: false,
    },
    channels: {
      inApp: true,
      email: true,
      emailDigest: 'daily',
    }
  };
}

// === 알림 설정 업데이트 ===
// PATCH /api/settings/notifications
export async function PATCH(request: NextRequest) {
  const session = await requireAuth(request);
  const body = await request.json();

  const schema = z.object({
    frequency: z.enum(['low', 'medium', 'high']).optional(),

    beforeMeeting: z.object({
      prepReminder: z.boolean().optional(),
      prepReminderTime: z.number().min(5).max(60).optional(),
      calendarSync: z.boolean().optional(),
    }).optional(),

    duringMeeting: z.object({
      hudAlerts: z.boolean().optional(),
      gapDetection: z.boolean().optional(),
      suggestionLevel: z.enum(['minimal', 'balanced', 'proactive']).optional(),
    }).optional(),

    afterMeeting: z.object({
      summaryReady: z.boolean().optional(),
      actionItemReminder: z.boolean().optional(),
      followUpSuggestion: z.boolean().optional(),
    }).optional(),

    doNotDisturb: z.object({
      enabled: z.boolean().optional(),
      startTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
      endTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
      weekendsOff: z.boolean().optional(),
    }).optional(),

    channels: z.object({
      inApp: z.boolean().optional(),
      email: z.boolean().optional(),
      emailDigest: z.enum(['realtime', 'daily', 'weekly', 'off']).optional(),
    }).optional(),
  });

  const validated = schema.parse(body);

  // 빈도 변경 시 관련 설정 자동 조정
  if (validated.frequency) {
    validated.duringMeeting = {
      ...validated.duringMeeting,
      ...getFrequencyPreset(validated.frequency),
    };
  }

  // Flatten for Prisma update
  const updateData = flattenNotificationSettings(validated);

  const updated = await prisma.notificationSettings.upsert({
    where: { userId: session.userId },
    update: updateData,
    create: {
      userId: session.userId,
      ...getDefaultNotificationSettingsForDb(),
      ...updateData,
    }
  });

  // 설정 변경 로깅
  await prisma.settingsEvent.create({
    data: {
      userId: session.userId,
      category: 'notification',
      action: 'updated',
      changes: validated,
      timestamp: new Date(),
    }
  });

  return NextResponse.json({
    success: true,
    data: {
      message: '알림 설정이 저장되었습니다',
      updated: formatNotificationSettings(updated),
    }
  });
}

// 빈도 프리셋
function getFrequencyPreset(frequency: 'low' | 'medium' | 'high') {
  switch (frequency) {
    case 'low':
      return {
        suggestionLevel: 'minimal' as const,
        gapDetection: false,
        followUpSuggestion: false,
      };
    case 'medium':
      return {
        suggestionLevel: 'balanced' as const,
        gapDetection: true,
        followUpSuggestion: false,
      };
    case 'high':
      return {
        suggestionLevel: 'proactive' as const,
        gapDetection: true,
        followUpSuggestion: true,
      };
  }
}

// === 알림 테스트 ===
// POST /api/settings/notifications/test
export async function testNotification(request: NextRequest) {
  const session = await requireAuth(request);
  const body = await request.json();

  const schema = z.object({
    type: z.enum(['prep_reminder', 'hud_alert', 'summary_ready', 'action_item']),
    channel: z.enum(['in_app', 'email']),
  });

  const validated = schema.parse(body);

  // 테스트 알림 발송
  await notificationService.sendTestNotification(
    session.userId,
    validated.type,
    validated.channel
  );

  return NextResponse.json({
    success: true,
    data: {
      message: '테스트 알림이 발송되었습니다',
      type: validated.type,
      channel: validated.channel,
    }
  });
}
```

---

### 4.30 프로필 및 계정 서비스 (Part 5.2)

```typescript
// === 프로필 조회 ===
// GET /api/settings/profile
export async function GET(request: NextRequest) {
  const session = await requireAuth(request);

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      profileImage: true,
      createdAt: true,
      lastLoginAt: true,
    }
  });

  return NextResponse.json({
    success: true,
    data: {
      profile: user,
      canChangeEmail: !user.email.includes('@social'), // 소셜 로그인이 아닌 경우만
    }
  });
}

// === 프로필 업데이트 ===
// PATCH /api/settings/profile
export async function PATCH(request: NextRequest) {
  const session = await requireAuth(request);
  const body = await request.json();

  const schema = z.object({
    name: z.string().min(1).max(50).optional(),
    profileImage: z.string().url().optional(),
  });

  const validated = schema.parse(body);

  const updated = await prisma.user.update({
    where: { id: session.userId },
    data: validated,
    select: {
      id: true,
      name: true,
      email: true,
      profileImage: true,
    }
  });

  // 프로필 변경 로깅
  await prisma.settingsEvent.create({
    data: {
      userId: session.userId,
      category: 'profile',
      action: 'updated',
      changes: Object.keys(validated),
      timestamp: new Date(),
    }
  });

  return NextResponse.json({
    success: true,
    data: {
      profile: updated,
      message: '프로필이 업데이트되었습니다',
    }
  });
}

// === 프로필 이미지 업로드 ===
// POST /api/settings/profile/image
export async function uploadProfileImage(request: NextRequest) {
  const session = await requireAuth(request);
  const formData = await request.formData();
  const file = formData.get('image') as File;

  if (!file) {
    return NextResponse.json({
      success: false,
      error: { code: 'NO_FILE', message: '파일이 없습니다' }
    }, { status: 400 });
  }

  // 파일 유효성 검사
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if (file.size > maxSize) {
    return NextResponse.json({
      success: false,
      error: { code: 'FILE_TOO_LARGE', message: '파일 크기는 5MB 이하여야 합니다' }
    }, { status: 400 });
  }

  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({
      success: false,
      error: { code: 'INVALID_TYPE', message: 'JPG, PNG, WebP 파일만 가능합니다' }
    }, { status: 400 });
  }

  // 이미지 리사이즈 및 업로드
  const buffer = Buffer.from(await file.arrayBuffer());
  const resized = await sharp(buffer)
    .resize(200, 200, { fit: 'cover' })
    .webp({ quality: 80 })
    .toBuffer();

  const fileName = `profiles/${session.userId}/${Date.now()}.webp`;
  const url = await uploadToStorage(fileName, resized, 'image/webp');

  // 프로필 업데이트
  await prisma.user.update({
    where: { id: session.userId },
    data: { profileImage: url },
  });

  return NextResponse.json({
    success: true,
    data: {
      imageUrl: url,
      message: '프로필 이미지가 업데이트되었습니다',
    }
  });
}

// === 비밀번호 변경 ===
// POST /api/settings/password
export async function changePassword(request: NextRequest) {
  const session = await requireAuth(request);
  const body = await request.json();

  const schema = z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8).regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      '대소문자와 숫자를 포함해야 합니다'
    ),
    confirmPassword: z.string(),
  }).refine(data => data.newPassword === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['confirmPassword'],
  });

  const validated = schema.parse(body);

  // 현재 비밀번호 확인
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { passwordHash: true },
  });

  const isValid = await bcrypt.compare(validated.currentPassword, user.passwordHash);
  if (!isValid) {
    return NextResponse.json({
      success: false,
      error: { code: 'INVALID_PASSWORD', message: '현재 비밀번호가 올바르지 않습니다' }
    }, { status: 400 });
  }

  // 새 비밀번호 해시 및 저장
  const newHash = await bcrypt.hash(validated.newPassword, 12);

  await prisma.user.update({
    where: { id: session.userId },
    data: { passwordHash: newHash },
  });

  // 다른 세션 모두 만료
  await prisma.session.deleteMany({
    where: {
      userId: session.userId,
      id: { not: session.sessionId },
    }
  });

  // 비밀번호 변경 로깅
  await prisma.settingsEvent.create({
    data: {
      userId: session.userId,
      category: 'account',
      action: 'password_changed',
      metadata: { otherSessionsInvalidated: true },
      timestamp: new Date(),
    }
  });

  return NextResponse.json({
    success: true,
    data: {
      message: '비밀번호가 변경되었습니다. 다른 기기에서 다시 로그인해야 합니다.',
    }
  });
}

// === 계정 삭제 ===
// DELETE /api/settings/account
export async function deleteAccount(request: NextRequest) {
  const session = await requireAuth(request);
  const body = await request.json();

  const schema = z.object({
    password: z.string().min(1),
    reason: z.string().optional(),
    confirmText: z.literal('계정 삭제'),
  });

  const validated = schema.parse(body);

  // 비밀번호 확인
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { passwordHash: true, email: true },
  });

  const isValid = await bcrypt.compare(validated.password, user.passwordHash);
  if (!isValid) {
    return NextResponse.json({
      success: false,
      error: { code: 'INVALID_PASSWORD', message: '비밀번호가 올바르지 않습니다' }
    }, { status: 400 });
  }

  // 소프트 삭제 (30일 보관 후 완전 삭제)
  await prisma.user.update({
    where: { id: session.userId },
    data: {
      deletedAt: new Date(),
      email: `deleted_${session.userId}@deleted.onno.app`,
      name: 'Deleted User',
    }
  });

  // 모든 세션 삭제
  await prisma.session.deleteMany({
    where: { userId: session.userId },
  });

  // 계정 삭제 로깅
  await prisma.accountDeletionLog.create({
    data: {
      userId: session.userId,
      originalEmail: user.email,
      reason: validated.reason,
      deletedAt: new Date(),
      scheduledPermanentDeleteAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    }
  });

  return NextResponse.json({
    success: true,
    data: {
      message: '계정이 삭제되었습니다. 30일 이내에 다시 로그인하면 계정을 복구할 수 있습니다.',
      permanentDeleteAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    }
  });
}
```

---

### 4.31 데이터 프라이버시 서비스 (Part 5.2)

```typescript
// === 데이터 설정 조회 ===
// GET /api/settings/data-privacy
export async function GET(request: NextRequest) {
  const session = await requireAuth(request);

  const settings = await prisma.userSettings.findUnique({
    where: { userId: session.userId },
    select: {
      dataRetentionDays: true,
      shareAnalytics: true,
      allowAiTraining: true,
    }
  });

  const stats = await prisma.$queryRaw`
    SELECT
      COUNT(DISTINCT m.id) as meeting_count,
      COUNT(DISTINCT d.id) as decision_count,
      SUM(LENGTH(t.content)) as total_transcript_bytes
    FROM "Meeting" m
    LEFT JOIN "Decision" d ON d."meetingId" = m.id
    LEFT JOIN "Transcript" t ON t."meetingId" = m.id
    WHERE m."userId" = ${session.userId}
  `;

  return NextResponse.json({
    success: true,
    data: {
      retention: {
        days: settings?.dataRetentionDays || 365,
        options: [30, 90, 180, 365, -1], // -1 = 무제한
      },
      privacy: {
        shareAnalytics: settings?.shareAnalytics ?? true,
        allowAiTraining: settings?.allowAiTraining ?? false,
      },
      dataStats: {
        meetingCount: Number(stats[0].meeting_count),
        decisionCount: Number(stats[0].decision_count),
        storageUsedMb: Math.round(Number(stats[0].total_transcript_bytes || 0) / 1024 / 1024 * 10) / 10,
      }
    }
  });
}

// === 데이터 설정 업데이트 ===
// PATCH /api/settings/data-privacy
export async function PATCH(request: NextRequest) {
  const session = await requireAuth(request);
  const body = await request.json();

  const schema = z.object({
    dataRetentionDays: z.number().min(-1).max(730).optional(),
    shareAnalytics: z.boolean().optional(),
    allowAiTraining: z.boolean().optional(),
  });

  const validated = schema.parse(body);

  await prisma.userSettings.upsert({
    where: { userId: session.userId },
    update: validated,
    create: {
      userId: session.userId,
      ...validated,
    }
  });

  // 보존 기간 변경 시 정리 작업 스케줄
  if (validated.dataRetentionDays && validated.dataRetentionDays > 0) {
    await scheduleDataCleanup(session.userId, validated.dataRetentionDays);
  }

  return NextResponse.json({
    success: true,
    data: {
      message: '데이터 설정이 저장되었습니다',
    }
  });
}

// === 데이터 내보내기 ===
// POST /api/settings/data-privacy/export
export async function exportData(request: NextRequest) {
  const session = await requireAuth(request);

  // 기존 진행 중인 내보내기 확인
  const existingExport = await prisma.dataExport.findFirst({
    where: {
      userId: session.userId,
      status: 'processing',
    }
  });

  if (existingExport) {
    return NextResponse.json({
      success: false,
      error: {
        code: 'EXPORT_IN_PROGRESS',
        message: '이미 데이터 내보내기가 진행 중입니다',
        exportId: existingExport.id,
        startedAt: existingExport.createdAt,
      }
    }, { status: 400 });
  }

  // 내보내기 작업 생성
  const exportJob = await prisma.dataExport.create({
    data: {
      userId: session.userId,
      status: 'processing',
      format: 'zip',
    }
  });

  // 백그라운드 작업 시작
  await exportQueue.add('export-user-data', {
    exportId: exportJob.id,
    userId: session.userId,
  });

  return NextResponse.json({
    success: true,
    data: {
      exportId: exportJob.id,
      status: 'processing',
      message: '데이터 내보내기가 시작되었습니다. 완료되면 이메일로 알려드립니다.',
      estimatedTime: '약 5-10분',
    }
  });
}

// === 데이터 내보내기 상태 확인 ===
// GET /api/settings/data-privacy/export/:exportId
export async function getExportStatus(
  request: NextRequest,
  { params }: { params: { exportId: string } }
) {
  const session = await requireAuth(request);

  const exportJob = await prisma.dataExport.findFirst({
    where: {
      id: params.exportId,
      userId: session.userId,
    }
  });

  if (!exportJob) {
    return NextResponse.json({
      success: false,
      error: { code: 'NOT_FOUND', message: '내보내기 작업을 찾을 수 없습니다' }
    }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    data: {
      exportId: exportJob.id,
      status: exportJob.status,
      downloadUrl: exportJob.status === 'completed' ? exportJob.downloadUrl : null,
      expiresAt: exportJob.expiresAt,
      createdAt: exportJob.createdAt,
      completedAt: exportJob.completedAt,
    }
  });
}

// === 데이터 삭제 요청 ===
// POST /api/settings/data-privacy/delete-data
export async function requestDataDeletion(request: NextRequest) {
  const session = await requireAuth(request);
  const body = await request.json();

  const schema = z.object({
    dataType: z.enum(['meetings', 'decisions', 'transcripts', 'all']),
    dateRange: z.object({
      start: z.string().datetime().optional(),
      end: z.string().datetime().optional(),
    }).optional(),
    confirm: z.literal(true),
  });

  const validated = schema.parse(body);

  // 삭제 작업 생성
  const deletionJob = await prisma.dataDeletion.create({
    data: {
      userId: session.userId,
      dataType: validated.dataType,
      dateRange: validated.dateRange || null,
      status: 'pending',
      scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24시간 후
    }
  });

  // 확인 이메일 발송
  await sendDeletionConfirmationEmail(session.userId, deletionJob.id);

  return NextResponse.json({
    success: true,
    data: {
      deletionId: deletionJob.id,
      status: 'pending',
      message: '데이터 삭제가 예약되었습니다. 24시간 내에 확인 이메일의 링크를 클릭해주세요.',
      scheduledAt: deletionJob.scheduledAt,
      canCancelBefore: deletionJob.scheduledAt,
    }
  });
}
```

---

### 4.32 Part 5.2 데이터베이스 스키마

```prisma
// Part 5.2 관련 추가 스키마

model UserSettings {
  id              String   @id @default(cuid())
  userId          String   @unique

  // 데이터 프라이버시
  dataRetentionDays Int    @default(365)
  shareAnalytics    Boolean @default(true)
  allowAiTraining   Boolean @default(false)

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  user User @relation(fields: [userId], references: [id])
}

model Integration {
  id              String   @id @default(cuid())
  userId          String
  provider        String   // 'notion' | 'google_calendar' | 'outlook'

  accessToken     String   @db.Text  // encrypted
  refreshToken    String?  @db.Text  // encrypted
  tokenExpiresAt  DateTime

  accountEmail    String?
  accountName     String?

  // Notion 전용
  notionDatabaseId String?
  notionWorkspace  String?

  connectedAt     DateTime @default(now())
  lastSyncedAt    DateTime?

  user User @relation(fields: [userId], references: [id])

  @@unique([userId, provider])
  @@index([provider])
}

model IntegrationEvent {
  id          String   @id @default(cuid())
  userId      String
  provider    String
  eventType   String   // 'oauth_started' | 'connected' | 'disconnected' | 'refresh_failed' | 'sync_completed'
  metadata    Json?
  timestamp   DateTime @default(now())

  @@index([userId, timestamp(sort: Desc)])
  @@index([provider, eventType])
}

model NotificationSettings {
  id              String   @id @default(cuid())
  userId          String   @unique

  frequency       String   @default("medium") // 'low' | 'medium' | 'high'

  // 미팅 전
  prepReminderEnabled   Boolean @default(true)
  prepReminderMinutes   Int     @default(15)
  calendarSyncEnabled   Boolean @default(true)

  // 미팅 중
  hudAlertsEnabled      Boolean @default(true)
  gapDetectionEnabled   Boolean @default(true)
  suggestionLevel       String  @default("balanced") // 'minimal' | 'balanced' | 'proactive'

  // 미팅 후
  summaryReadyEnabled       Boolean @default(true)
  actionItemReminderEnabled Boolean @default(true)
  followUpSuggestionEnabled Boolean @default(false)

  // 방해 금지
  dndEnabled        Boolean @default(false)
  dndStartTime      String? // "22:00"
  dndEndTime        String? // "08:00"
  dndWeekendsOff    Boolean @default(false)

  // 채널
  inAppEnabled          Boolean @default(true)
  emailEnabled          Boolean @default(true)
  emailDigestFrequency  String  @default("daily") // 'realtime' | 'daily' | 'weekly' | 'off'

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  user User @relation(fields: [userId], references: [id])
}

model SettingsEvent {
  id          String   @id @default(cuid())
  userId      String
  category    String   // 'profile' | 'notification' | 'integration' | 'account' | 'data_privacy'
  action      String   // 'opened' | 'updated' | 'saved' | 'cancelled' | 'password_changed'
  changes     Json?
  metadata    Json?
  timestamp   DateTime @default(now())

  @@index([userId, timestamp(sort: Desc)])
  @@index([category, action])
}

model DataExport {
  id          String   @id @default(cuid())
  userId      String
  status      String   @default("pending") // 'pending' | 'processing' | 'completed' | 'failed'
  format      String   @default("zip")

  downloadUrl String?
  fileSizeBytes BigInt?

  createdAt   DateTime @default(now())
  completedAt DateTime?
  expiresAt   DateTime?

  @@index([userId, status])
}

model DataDeletion {
  id          String   @id @default(cuid())
  userId      String
  dataType    String   // 'meetings' | 'decisions' | 'transcripts' | 'all'
  dateRange   Json?
  status      String   @default("pending") // 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled'

  scheduledAt DateTime
  confirmedAt DateTime?
  completedAt DateTime?
  cancelledAt DateTime?

  createdAt   DateTime @default(now())

  @@index([userId, status])
  @@index([scheduledAt, status])
}

model AccountDeletionLog {
  id                        String   @id @default(cuid())
  userId                    String
  originalEmail             String
  reason                    String?
  deletedAt                 DateTime
  scheduledPermanentDeleteAt DateTime
  permanentlyDeletedAt      DateTime?

  @@index([scheduledPermanentDeleteAt, permanentlyDeletedAt])
}
```

---

**Part 5.2 핵심 지표:**

```sql
-- 설정 진입률 (낮을수록 좋음)
설정 진입률 = count(settings_opened) / count(dau)
목표: < 10% (잘 동작하면 설정 필요 없음)

-- 평균 설정 체류 시간 (짧을수록 좋음)
평균 체류 시간 = avg(settings_closed.timestamp - settings_opened.timestamp)
목표: < 60초

-- 통합 연결 성공률
통합 성공률 = count(oauth_connected) / count(oauth_started)
목표: > 85%

-- 알림 설정 변경률
알림 변경률 = count(notification_settings_updated) / count(settings_opened)
목표: < 30% (기본값이 적합하면 변경 불필요)

-- 필수 통합 연결률
필수 연결률 = count(users WHERE notion_connected AND calendar_connected) / count(active_users)
목표: > 95%

-- 데이터 내보내기 완료율
내보내기 완료율 = count(export_completed) / count(export_requested)
목표: > 99%

-- 계정 삭제 취소율 (유지율)
삭제 취소율 = count(deletion_cancelled) / count(deletion_requested)
지표: 높을수록 사용자 유지
```

---

## 5. WebSocket 이벤트

### 5.1 연결

```typescript
// Client → Server
socket.emit('authenticate', {
  token: 'jwt_token'
});

// Server → Client
socket.emit('authenticated', {
  userId: 'usr_123'
});
```

### 5.2 미팅 관련

```typescript
// Client → Server (미팅 시작)
socket.emit('meeting:start', {
  meetingId: 'mtg_123'
});

// Server → Client (전사 실시간 수신)
socket.on('transcript', (data) => {
  // {
  //   id: 'tr_1',
  //   timestamp: '2025-12-29T10:05:23Z',
  //   speaker: '김대표',
  //   text: 'MAU는 10만입니다.',
  //   confidence: 0.95
  // }
});

// Server → Client (인사이트 수신)
socket.on('insight', (data) => {
  // {
  //   id: 'ins_1',
  //   type: 'METRIC',
  //   content: 'MAU 10만',
  //   confidence: 0.88
  // }
});

// Server → Client (알림 수신)
socket.on('alert', (data) => {
  // {
  //   id: 'alt_1',
  //   level: 2,
  //   title: '확인 필요',
  //   message: '예산 승인 프로세스 미확인',
  //   suggestedQuestion: '승인은 누가 하시나요?'
  // }
});

// Client → Server (미팅 종료)
socket.emit('meeting:end', {
  meetingId: 'mtg_123'
});
```

### 5.3 HUD 실시간 이벤트 (Part 3)

```typescript
// Server → Client (HUD 세션 시작)
socket.on('hud:session_started', (data) => {
  // {
  //   sessionId: 'hud_sess_001',
  //   meetingId: 'mtg_003',
  //   platform: 'zoom',
  //   startedAt: '2025-12-30T10:00:05Z'
  // }
});

// Server → Client (실시간 알림)
socket.on('hud:alert', (data) => {
  // {
  //   id: 'alt_001',
  //   level: 2,
  //   category: 'gap',
  //   icon: '💡',
  //   title: '정보 누락 감지',
  //   message: '예산 범위에 대한 정보가 확인되지 않았습니다',
  //   suggestedQuestion: '예산 범위가 어느 정도 되실까요?',
  //   reason: ['가격 논의가 진행 중이나 예산 언급 없음'],
  //   expiresAt: '2025-12-30T10:15:10Z'
  // }
});

// Client → Server (알림 응답)
socket.emit('hud:alert_action', {
  alertId: 'alt_001',
  action: 'ask',  // 'ask' | 'defer' | 'dismiss' | 'accept_risk'
  responseTime: 2500
});

// Server → Client (알림 응답 결과)
socket.on('hud:alert_result', (data) => {
  // {
  //   alertId: 'alt_001',
  //   action: 'ask',
  //   result: {
  //     status: 'question_copied',
  //     question: '예산 범위가 어느 정도 되실까요?'
  //   }
  // }
});

// Server → Client (Gap 해결 알림)
socket.on('hud:gap_resolved', (data) => {
  // {
  //   gapId: 'gap_001',
  //   alertId: 'alt_001',
  //   category: 'budget',
  //   resolvedBy: 'user_question',
  //   resolvedAt: '2025-12-30T10:18:00Z'
  // }
});

// Server → Client (연기 항목 추가)
socket.on('hud:deferred_added', (data) => {
  // {
  //   id: 'def_001',
  //   alertId: 'alt_003',
  //   question: '결제 조건은 어떻게 되나요?',
  //   category: 'gap',
  //   currentCount: 2
  // }
});

// Client → Server (투명도 상태 변경)
socket.emit('hud:opacity_changed', {
  sessionId: 'hud_sess_001',
  opacityState: 'inactive',  // 'active' | 'default' | 'inactive'
  timestamp: '2025-12-30T10:20:00Z'
});

// Client → Server (HUD 확장/축소)
socket.emit('hud:expanded', {
  sessionId: 'hud_sess_001',
  expanded: true,
  timestamp: '2025-12-30T10:21:00Z'
});

// Server → Client (세션 통계 업데이트)
socket.on('hud:stats_updated', (data) => {
  // {
  //   sessionId: 'hud_sess_001',
  //   stats: {
  //     totalAlerts: { level1: 5, level2: 2, level3: 0 },
  //     alertsActioned: 6,
  //     gapsResolved: 2,
  //     idleRatio: 0.97
  //   }
  // }
});

// Server → Client (세션 종료)
socket.on('hud:session_ended', (data) => {
  // {
  //   sessionId: 'hud_sess_001',
  //   endedAt: '2025-12-30T11:00:05Z',
  //   endReason: 'meeting_ended',
  //   finalStats: { ... },
  //   pendingActions: [{ type: 'deferred_question', count: 2 }]
  // }
});
```

### 5.4 에러 처리

```typescript
// Server → Client
socket.on('error', (error) => {
  // {
  //   code: 'STT_FAILED',
  //   message: 'STT 서비스 오류',
  //   retryable: true
  // }
});
```

---

## 6. 인증 및 인가

### 6.1 JWT 토큰

```typescript
// src/lib/auth.ts
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = '7d';

export function generateToken(userId: string) {
  return jwt.sign(
    { userId },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

export function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded;
  } catch (error) {
    return null;
  }
}
```

### 6.2 Middleware

```typescript
// src/middleware/auth.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function authMiddleware(req: NextRequest) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }

  // Request에 userId 추가
  req.headers.set('X-User-Id', decoded.userId);

  return NextResponse.next();
}
```

### 6.3 Rate Limiting

```typescript
// src/middleware/rateLimit.ts
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

export async function rateLimit(
  userId: string,
  limit: number = 100, // 요청 수
  window: number = 60   // 초
) {
  const key = `ratelimit:${userId}`;
  const current = await redis.incr(key);

  if (current === 1) {
    await redis.expire(key, window);
  }

  if (current > limit) {
    throw new Error('Rate limit exceeded');
  }

  return {
    remaining: limit - current,
    reset: window,
  };
}
```

---

## 7. AI 파이프라인

### 7.1 STT (Deepgram)

```typescript
// src/services/stt.ts
import { createClient } from '@deepgram/sdk';

const deepgram = createClient(process.env.DEEPGRAM_API_KEY!);

export async function transcribeAudio(audioUrl: string) {
  const { result } = await deepgram.listen.prerecorded.transcribeUrl(
    { url: audioUrl },
    {
      model: 'nova-2',
      language: 'ko',
      punctuate: true,
      diarize: true, // 화자 분리
      utterances: true,
    }
  );

  return result.results.channels[0].alternatives[0].words.map((word) => ({
    word: word.word,
    start: word.start,
    end: word.end,
    confidence: word.confidence,
    speaker: word.speaker,
  }));
}

// 실시간 STT (WebSocket)
export function transcribeStream() {
  const connection = deepgram.listen.live({
    model: 'nova-2',
    language: 'ko',
    punctuate: true,
    interim_results: true,
  });

  return connection;
}
```

### 7.2 인사이트 추출 (GPT-4)

```typescript
// src/services/ai/insights.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function extractInsights(transcript: string) {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: `당신은 비즈니스 미팅 분석 전문가입니다.
전사록을 읽고 다음을 추출하세요:
1. 숫자/지표 (METRIC): 구체적인 수치
2. 주장/사실 (CLAIM): 검증 가능한 진술
3. 우려사항 (CONCERN): 리스크, 걱정
4. 약속/커밋먼트 (COMMITMENT): 액션 아이템

JSON 형식으로 반환:
{
  "insights": [
    {
      "type": "METRIC",
      "content": "MAU 10만",
      "source": "발화 원문",
      "confidence": 0.95
    }
  ]
}`,
      },
      {
        role: 'user',
        content: transcript,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.3,
  });

  const result = JSON.parse(completion.choices[0].message.content!);
  return result.insights;
}
```

### 7.3 결정 8요소 추적

```typescript
// src/services/ai/decisions.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function trackDecisionElements(transcript: string) {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: `전사록에서 결정 8요소를 추적하세요:

1. Goal (목표): 무엇을 결정하려 하는가?
2. Evidence (증거): 결정을 뒷받침하는 데이터/사실
3. Assumption (가정): 전제로 하는 믿음
4. Risk (리스크): 잠재적 위험
5. Unknown (미지): 아직 모르는 것
6. Decision (결정): 내린 결정
7. Action (액션): 다음 단계
8. Outcome (결과): 기대 결과

JSON 형식:
{
  "goal": "...",
  "evidence": [...],
  "assumptions": [...],
  "risks": [...],
  "unknowns": [...],
  "decision": "...",
  "actions": [...],
  "outcome": "...",
  "completeness": 75  // 0-100
}`,
      },
      {
        role: 'user',
        content: transcript,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.2,
  });

  return JSON.parse(completion.choices[0].message.content!);
}
```

### 7.4 갭 감지

```typescript
// src/services/ai/gapDetection.ts
export async function detectGaps(
  decisionElements: any,
  currentTime: number // 회의 경과 시간 (분)
) {
  const gaps = [];

  // Rule 1: 30분 이상 진행 + Risk 항목 없음
  if (currentTime > 30 && !decisionElements.risks?.length) {
    gaps.push({
      level: 2,
      title: '확인 필요',
      message: '리스크 논의가 아직 없습니다',
      suggestedQuestion: '이 결정의 잠재적 리스크는 무엇인가요?',
    });
  }

  // Rule 2: Decision 있는데 Action 없음
  if (decisionElements.decision && !decisionElements.actions?.length) {
    gaps.push({
      level: 2,
      title: '확인 필요',
      message: '결정은 내려졌으나 다음 단계가 명확하지 않습니다',
      suggestedQuestion: '구체적으로 누가 언제까지 무엇을 하나요?',
    });
  }

  // Rule 3: 계약/법적 키워드 + Unknown 많음
  const hasLegalKeywords = /계약|해지|조건|법적/.test(
    JSON.stringify(decisionElements)
  );
  if (hasLegalKeywords && decisionElements.unknowns?.length > 3) {
    gaps.push({
      level: 3,
      title: '치명적 누락',
      message: '계약 관련 중요 항목이 논의되지 않았습니다',
      reason: [
        '법적 분쟁 가능성',
        `미확인 항목 ${decisionElements.unknowns.length}개`,
      ],
      suggestedQuestion: '계약 조건을 명확히 할 수 있을까요?',
    });
  }

  return gaps;
}
```

### 7.5 임베딩 & 검색

```typescript
// src/services/ai/embeddings.ts
import OpenAI from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

const index = pinecone.index('onno-meetings');

// 전사록 → 임베딩 → Pinecone 저장
export async function indexMeeting(meetingId: string, transcript: string) {
  // 1. 전사록을 청크로 분할 (512 토큰씩)
  const chunks = splitIntoChunks(transcript, 512);

  // 2. 각 청크를 임베딩
  const embeddings = await Promise.all(
    chunks.map(async (chunk, idx) => {
      const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: chunk,
      });

      return {
        id: `${meetingId}_${idx}`,
        values: response.data[0].embedding,
        metadata: {
          meetingId,
          chunkIndex: idx,
          text: chunk,
        },
      };
    })
  );

  // 3. Pinecone에 저장
  await index.upsert(embeddings);
}

// 검색 쿼리 → 유사 문서 반환
export async function searchMeetings(query: string, topK: number = 10) {
  // 1. 쿼리 임베딩
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: query,
  });

  // 2. Pinecone 검색
  const results = await index.query({
    vector: response.data[0].embedding,
    topK,
    includeMetadata: true,
  });

  return results.matches.map((match) => ({
    meetingId: match.metadata?.meetingId,
    text: match.metadata?.text,
    score: match.score,
  }));
}

function splitIntoChunks(text: string, maxTokens: number) {
  // 간단한 청크 분할 (실제로는 tiktoken 사용 권장)
  const sentences = text.split(/[.!?]\s+/);
  const chunks = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > maxTokens * 4) {
      chunks.push(currentChunk);
      currentChunk = sentence;
    } else {
      currentChunk += ' ' + sentence;
    }
  }

  if (currentChunk) chunks.push(currentChunk);
  return chunks;
}
```

---

## 8. 외부 통합

### 8.1 Notion 통합

```typescript
// src/services/integrations/notion.ts
import { Client } from '@notionhq/client';
import { prisma } from '@/lib/db';

export async function createMeetingPage(userId: string, meeting: any) {
  // 1. 사용자의 Notion 통합 정보 가져오기
  const integration = await prisma.integration.findUnique({
    where: {
      userId_platform: {
        userId,
        platform: 'NOTION',
      },
    },
  });

  if (!integration || !integration.credentials) {
    throw new Error('Notion not connected');
  }

  // 2. Notion Client 초기화
  const notion = new Client({
    auth: decrypt(integration.credentials),
  });

  const databaseId = integration.metadata?.databaseId;

  // 3. 페이지 생성
  const page = await notion.pages.create({
    parent: { database_id: databaseId },
    properties: {
      Title: {
        title: [
          {
            text: {
              content: `${meeting.company} ${meeting.title}`,
            },
          },
        ],
      },
      Date: {
        date: {
          start: meeting.startTime.toISOString(),
        },
      },
      Company: {
        select: {
          name: meeting.company,
        },
      },
    },
    children: [
      // 결정 사항
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ text: { content: '✅ 결정 사항' } }],
        },
      },
      ...meeting.decisions.map((decision: any) => ({
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{ text: { content: decision.decision } }],
        },
      })),

      // 액션 아이템
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ text: { content: '📋 액션 아이템' } }],
        },
      },
      ...meeting.actions.map((action: any) => ({
        object: 'block',
        type: 'to_do',
        to_do: {
          rich_text: [
            {
              text: {
                content: `${action.title} (${action.assignee}, ${action.dueDate})`,
              },
            },
          ],
          checked: false,
        },
      })),

      // 인사이트
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ text: { content: '💡 주요 인사이트' } }],
        },
      },
      ...meeting.insights.map((insight: any) => ({
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{ text: { content: insight.content } }],
        },
      })),
    ],
  });

  return {
    pageId: page.id,
    url: page.url,
  };
}

function decrypt(encrypted: string) {
  // 암호화된 토큰 복호화 (crypto 사용)
  // 구현 생략
  return encrypted;
}
```

### 8.2 Salesforce 통합

```typescript
// src/services/integrations/salesforce.ts
import jsforce from 'jsforce';

export async function updateDeal(userId: string, meeting: any) {
  const integration = await prisma.integration.findUnique({
    where: {
      userId_platform: { userId, platform: 'SALESFORCE' },
    },
  });

  if (!integration) {
    throw new Error('Salesforce not connected');
  }

  const conn = new jsforce.Connection({
    instanceUrl: integration.metadata?.instanceUrl,
    accessToken: decrypt(integration.credentials!),
  });

  // Opportunity 업데이트
  const result = await conn.sobject('Opportunity').update({
    Id: meeting.metadata?.salesforceOpportunityId,
    StageName: 'Due Diligence', // DD 진행 중
    NextStep: meeting.actions[0]?.title || '',
    Description: meeting.decisions[0]?.decision || '',
  });

  return result;
}
```

### 8.3 Slack 통합

```typescript
// src/services/integrations/slack.ts
import { WebClient } from '@slack/web-api';

export async function postToSlack(userId: string, meeting: any) {
  const integration = await prisma.integration.findUnique({
    where: {
      userId_platform: { userId, platform: 'SLACK' },
    },
  });

  if (!integration) return;

  const slack = new WebClient(decrypt(integration.credentials!));
  const channelId = integration.metadata?.channelId || '#sales';

  const message = await slack.chat.postMessage({
    channel: channelId,
    text: `${meeting.company} 미팅 완료`,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `${meeting.company} ${meeting.title}`,
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*결정:*\n${meeting.decisions[0]?.decision || '-'}`,
          },
          {
            type: 'mrkdwn',
            text: `*다음 단계:*\n${meeting.actions[0]?.title || '-'}`,
          },
        ],
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `담당: ${meeting.actions[0]?.assignee || '-'} | 기한: ${meeting.actions[0]?.dueDate || '-'}`,
          },
        ],
      },
    ],
  });

  return {
    messageTs: message.ts,
    permalink: await slack.chat.getPermalink({
      channel: channelId,
      message_ts: message.ts!,
    }),
  };
}
```

---

## 9. 에러 처리

### 9.1 에러 코드 정의

```typescript
// src/lib/errors.ts
export enum ErrorCode {
  // Auth
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INVALID_TOKEN = 'INVALID_TOKEN',

  // Validation
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_FIELD = 'MISSING_FIELD',

  // Resource
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',

  // External
  STT_FAILED = 'STT_FAILED',
  AI_FAILED = 'AI_FAILED',
  INTEGRATION_FAILED = 'INTEGRATION_FAILED',

  // System
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
}

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    public message: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}
```

### 9.2 에러 핸들러

```typescript
// src/app/api/middleware/errorHandler.ts
import { NextRequest, NextResponse } from 'next/server';
import { AppError, ErrorCode } from '@/lib/errors';

export function errorHandler(error: unknown) {
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      },
      { status: error.statusCode }
    );
  }

  // Prisma 에러
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        {
          error: {
            code: ErrorCode.ALREADY_EXISTS,
            message: 'Resource already exists',
          },
        },
        { status: 409 }
      );
    }
  }

  // 기타 에러
  console.error('Unhandled error:', error);
  return NextResponse.json(
    {
      error: {
        code: ErrorCode.INTERNAL_ERROR,
        message: 'Internal server error',
      },
    },
    { status: 500 }
  );
}
```

### 9.3 Part 6.1: 에러 처리 - 5-Layer Framework

> **Cross-Cutting Concern**: 에러 처리는 모든 Part에 걸쳐 일관되게 적용되는 시스템 전반의 관심사입니다.
> "에러는 막다른 길이 아니라 우회로" - 사용자가 중단 없이 목표를 달성할 수 있도록 지원합니다.

#### 9.3.1 확장된 에러 분류 시스템

```typescript
// src/lib/errors/types.ts - Part 6.1

/**
 * 에러 심각도 정의
 */
export type ErrorSeverity = 'critical' | 'major' | 'minor' | 'info';

/**
 * 에러 도메인 정의
 */
export type ErrorDomain =
  | 'network'      // 네트워크 연결 문제
  | 'auth'         // 인증/권한 문제
  | 'integration'  // 외부 서비스 통합 문제
  | 'ai'           // AI 서비스 문제
  | 'media'        // 미디어 처리 문제
  | 'storage'      // 저장소 문제
  | 'validation';  // 입력 검증 문제

/**
 * 에러 타입 정의
 */
export type ErrorType =
  // Network errors
  | 'NETWORK_OFFLINE'
  | 'NETWORK_TIMEOUT'
  | 'NETWORK_SERVER_ERROR'
  // Auth errors
  | 'AUTH_SESSION_EXPIRED'
  | 'AUTH_TOKEN_INVALID'
  | 'AUTH_PERMISSION_DENIED'
  | 'AUTH_GOOGLE_OAUTH_FAILED'
  // Integration errors
  | 'INTEGRATION_CALENDAR_SYNC_FAILED'
  | 'INTEGRATION_NOTION_AUTH_EXPIRED'
  | 'INTEGRATION_NOTION_SAVE_FAILED'
  | 'INTEGRATION_HUBSPOT_AUTH_EXPIRED'
  | 'INTEGRATION_HUBSPOT_SYNC_FAILED'
  | 'INTEGRATION_SLACK_DISCONNECTED'
  // AI errors
  | 'AI_STT_FAILED'
  | 'AI_ANALYSIS_FAILED'
  | 'AI_RATE_LIMITED'
  | 'AI_QUOTA_EXCEEDED'
  // Media errors
  | 'MEDIA_MICROPHONE_PERMISSION_DENIED'
  | 'MEDIA_MICROPHONE_NOT_FOUND'
  | 'MEDIA_RECORDING_FAILED'
  | 'MEDIA_AUDIO_QUALITY_LOW'
  // Storage errors
  | 'STORAGE_QUOTA_EXCEEDED'
  | 'STORAGE_UPLOAD_FAILED'
  | 'STORAGE_READ_FAILED'
  // Validation errors
  | 'VALIDATION_INVALID_INPUT'
  | 'VALIDATION_MISSING_FIELD';

/**
 * 확장된 에러 인터페이스
 */
export interface EnhancedError {
  id: string;              // UUID for tracking
  type: ErrorType;
  domain: ErrorDomain;
  severity: ErrorSeverity;
  code: string;            // e.g., 'ERR_NETWORK_001'
  message: string;         // User-friendly message (i18n key)
  technicalMessage: string; // Developer-friendly message
  timestamp: Date;
  recoverable: boolean;
  recoveryStrategy?: RecoveryStrategy;
  metadata?: Record<string, any>;
  context?: {
    userId?: string;
    sessionId?: string;
    meetingId?: string;
    part?: string;         // Which Part this error occurred in
    component?: string;
    action?: string;
  };
}

/**
 * 복구 전략 정의
 */
export type RecoveryStrategy =
  | 'retry_with_backoff'   // 지수 백오프로 재시도
  | 'refresh_token'        // 토큰 갱신 후 재시도
  | 'reconnect'            // 재연결 시도
  | 'fallback'             // 대체 기능 활성화
  | 'manual';              // 사용자 수동 개입 필요
```

#### 9.3.2 에러 응답 표준화

```typescript
// src/lib/errors/response.ts - Part 6.1

import { EnhancedError, ErrorSeverity, ErrorDomain, RecoveryStrategy } from './types';

/**
 * 표준 에러 응답 인터페이스
 */
export interface ErrorResponse {
  error: {
    id: string;
    type: string;
    code: string;
    message: string;
    severity: ErrorSeverity;
    domain: ErrorDomain;
    recoverable: boolean;
    recovery?: {
      strategy: RecoveryStrategy;
      retryAfter?: number;    // seconds
      retryCount?: number;
      maxRetries?: number;
      fallbackAvailable?: boolean;
      ctaLabel?: string;      // i18n key
      ctaAction?: string;     // action identifier
    };
    details?: Record<string, any>;
    helpUrl?: string;
    timestamp: string;
  };
}

/**
 * 에러 응답 생성 함수
 */
export function createErrorResponse(
  error: EnhancedError,
  includeDetails: boolean = false
): ErrorResponse {
  return {
    error: {
      id: error.id,
      type: error.type,
      code: error.code,
      message: error.message,
      severity: error.severity,
      domain: error.domain,
      recoverable: error.recoverable,
      recovery: error.recoveryStrategy ? {
        strategy: error.recoveryStrategy,
        retryAfter: getRetryAfterSeconds(error),
        maxRetries: getMaxRetries(error),
        fallbackAvailable: hasFallback(error),
        ctaLabel: getCtaLabel(error),
        ctaAction: getCtaAction(error),
      } : undefined,
      details: includeDetails ? error.metadata : undefined,
      helpUrl: getHelpUrl(error),
      timestamp: error.timestamp.toISOString(),
    },
  };
}

/**
 * HTTP 상태 코드 매핑
 */
export function getHttpStatusCode(error: EnhancedError): number {
  const statusMap: Record<string, number> = {
    // Network
    NETWORK_OFFLINE: 503,
    NETWORK_TIMEOUT: 504,
    NETWORK_SERVER_ERROR: 500,
    // Auth
    AUTH_SESSION_EXPIRED: 401,
    AUTH_TOKEN_INVALID: 401,
    AUTH_PERMISSION_DENIED: 403,
    AUTH_GOOGLE_OAUTH_FAILED: 401,
    // Integration
    INTEGRATION_CALENDAR_SYNC_FAILED: 502,
    INTEGRATION_NOTION_AUTH_EXPIRED: 401,
    INTEGRATION_NOTION_SAVE_FAILED: 502,
    INTEGRATION_HUBSPOT_AUTH_EXPIRED: 401,
    INTEGRATION_HUBSPOT_SYNC_FAILED: 502,
    INTEGRATION_SLACK_DISCONNECTED: 502,
    // AI
    AI_STT_FAILED: 502,
    AI_ANALYSIS_FAILED: 502,
    AI_RATE_LIMITED: 429,
    AI_QUOTA_EXCEEDED: 429,
    // Media
    MEDIA_MICROPHONE_PERMISSION_DENIED: 403,
    MEDIA_MICROPHONE_NOT_FOUND: 404,
    MEDIA_RECORDING_FAILED: 500,
    MEDIA_AUDIO_QUALITY_LOW: 422,
    // Storage
    STORAGE_QUOTA_EXCEEDED: 507,
    STORAGE_UPLOAD_FAILED: 500,
    STORAGE_READ_FAILED: 500,
    // Validation
    VALIDATION_INVALID_INPUT: 400,
    VALIDATION_MISSING_FIELD: 400,
  };

  return statusMap[error.type] || 500;
}
```

#### 9.3.3 에러 팩토리

```typescript
// src/lib/errors/factory.ts - Part 6.1

import { v4 as uuidv4 } from 'uuid';
import {
  EnhancedError,
  ErrorType,
  ErrorDomain,
  ErrorSeverity,
  RecoveryStrategy
} from './types';

/**
 * 에러 구성 정의
 */
interface ErrorConfig {
  domain: ErrorDomain;
  severity: ErrorSeverity;
  recoverable: boolean;
  recoveryStrategy?: RecoveryStrategy;
  defaultMessage: string;
  code: string;
}

/**
 * 에러 타입별 구성
 */
const ERROR_CONFIGS: Record<ErrorType, ErrorConfig> = {
  // Network errors
  NETWORK_OFFLINE: {
    domain: 'network',
    severity: 'major',
    recoverable: true,
    recoveryStrategy: 'reconnect',
    defaultMessage: 'error.network.offline',
    code: 'ERR_NET_001',
  },
  NETWORK_TIMEOUT: {
    domain: 'network',
    severity: 'minor',
    recoverable: true,
    recoveryStrategy: 'retry_with_backoff',
    defaultMessage: 'error.network.timeout',
    code: 'ERR_NET_002',
  },
  NETWORK_SERVER_ERROR: {
    domain: 'network',
    severity: 'major',
    recoverable: true,
    recoveryStrategy: 'retry_with_backoff',
    defaultMessage: 'error.network.server',
    code: 'ERR_NET_003',
  },
  // Auth errors
  AUTH_SESSION_EXPIRED: {
    domain: 'auth',
    severity: 'major',
    recoverable: true,
    recoveryStrategy: 'refresh_token',
    defaultMessage: 'error.auth.session_expired',
    code: 'ERR_AUTH_001',
  },
  AUTH_TOKEN_INVALID: {
    domain: 'auth',
    severity: 'critical',
    recoverable: true,
    recoveryStrategy: 'manual',
    defaultMessage: 'error.auth.token_invalid',
    code: 'ERR_AUTH_002',
  },
  AUTH_PERMISSION_DENIED: {
    domain: 'auth',
    severity: 'major',
    recoverable: false,
    defaultMessage: 'error.auth.permission_denied',
    code: 'ERR_AUTH_003',
  },
  AUTH_GOOGLE_OAUTH_FAILED: {
    domain: 'auth',
    severity: 'critical',
    recoverable: true,
    recoveryStrategy: 'manual',
    defaultMessage: 'error.auth.google_oauth_failed',
    code: 'ERR_AUTH_004',
  },
  // Integration errors
  INTEGRATION_CALENDAR_SYNC_FAILED: {
    domain: 'integration',
    severity: 'minor',
    recoverable: true,
    recoveryStrategy: 'retry_with_backoff',
    defaultMessage: 'error.integration.calendar_sync',
    code: 'ERR_INT_001',
  },
  INTEGRATION_NOTION_AUTH_EXPIRED: {
    domain: 'integration',
    severity: 'major',
    recoverable: true,
    recoveryStrategy: 'manual',
    defaultMessage: 'error.integration.notion_auth',
    code: 'ERR_INT_002',
  },
  INTEGRATION_NOTION_SAVE_FAILED: {
    domain: 'integration',
    severity: 'minor',
    recoverable: true,
    recoveryStrategy: 'retry_with_backoff',
    defaultMessage: 'error.integration.notion_save',
    code: 'ERR_INT_003',
  },
  INTEGRATION_HUBSPOT_AUTH_EXPIRED: {
    domain: 'integration',
    severity: 'major',
    recoverable: true,
    recoveryStrategy: 'manual',
    defaultMessage: 'error.integration.hubspot_auth',
    code: 'ERR_INT_004',
  },
  INTEGRATION_HUBSPOT_SYNC_FAILED: {
    domain: 'integration',
    severity: 'minor',
    recoverable: true,
    recoveryStrategy: 'retry_with_backoff',
    defaultMessage: 'error.integration.hubspot_sync',
    code: 'ERR_INT_005',
  },
  INTEGRATION_SLACK_DISCONNECTED: {
    domain: 'integration',
    severity: 'minor',
    recoverable: true,
    recoveryStrategy: 'manual',
    defaultMessage: 'error.integration.slack_disconnected',
    code: 'ERR_INT_006',
  },
  // AI errors
  AI_STT_FAILED: {
    domain: 'ai',
    severity: 'major',
    recoverable: true,
    recoveryStrategy: 'retry_with_backoff',
    defaultMessage: 'error.ai.stt_failed',
    code: 'ERR_AI_001',
  },
  AI_ANALYSIS_FAILED: {
    domain: 'ai',
    severity: 'minor',
    recoverable: true,
    recoveryStrategy: 'retry_with_backoff',
    defaultMessage: 'error.ai.analysis_failed',
    code: 'ERR_AI_002',
  },
  AI_RATE_LIMITED: {
    domain: 'ai',
    severity: 'minor',
    recoverable: true,
    recoveryStrategy: 'retry_with_backoff',
    defaultMessage: 'error.ai.rate_limited',
    code: 'ERR_AI_003',
  },
  AI_QUOTA_EXCEEDED: {
    domain: 'ai',
    severity: 'major',
    recoverable: false,
    defaultMessage: 'error.ai.quota_exceeded',
    code: 'ERR_AI_004',
  },
  // Media errors
  MEDIA_MICROPHONE_PERMISSION_DENIED: {
    domain: 'media',
    severity: 'critical',
    recoverable: true,
    recoveryStrategy: 'manual',
    defaultMessage: 'error.media.mic_permission',
    code: 'ERR_MED_001',
  },
  MEDIA_MICROPHONE_NOT_FOUND: {
    domain: 'media',
    severity: 'critical',
    recoverable: false,
    defaultMessage: 'error.media.mic_not_found',
    code: 'ERR_MED_002',
  },
  MEDIA_RECORDING_FAILED: {
    domain: 'media',
    severity: 'major',
    recoverable: true,
    recoveryStrategy: 'retry_with_backoff',
    defaultMessage: 'error.media.recording_failed',
    code: 'ERR_MED_003',
  },
  MEDIA_AUDIO_QUALITY_LOW: {
    domain: 'media',
    severity: 'info',
    recoverable: true,
    recoveryStrategy: 'fallback',
    defaultMessage: 'error.media.audio_quality',
    code: 'ERR_MED_004',
  },
  // Storage errors
  STORAGE_QUOTA_EXCEEDED: {
    domain: 'storage',
    severity: 'major',
    recoverable: false,
    defaultMessage: 'error.storage.quota_exceeded',
    code: 'ERR_STR_001',
  },
  STORAGE_UPLOAD_FAILED: {
    domain: 'storage',
    severity: 'minor',
    recoverable: true,
    recoveryStrategy: 'retry_with_backoff',
    defaultMessage: 'error.storage.upload_failed',
    code: 'ERR_STR_002',
  },
  STORAGE_READ_FAILED: {
    domain: 'storage',
    severity: 'minor',
    recoverable: true,
    recoveryStrategy: 'retry_with_backoff',
    defaultMessage: 'error.storage.read_failed',
    code: 'ERR_STR_003',
  },
  // Validation errors
  VALIDATION_INVALID_INPUT: {
    domain: 'validation',
    severity: 'info',
    recoverable: true,
    recoveryStrategy: 'manual',
    defaultMessage: 'error.validation.invalid_input',
    code: 'ERR_VAL_001',
  },
  VALIDATION_MISSING_FIELD: {
    domain: 'validation',
    severity: 'info',
    recoverable: true,
    recoveryStrategy: 'manual',
    defaultMessage: 'error.validation.missing_field',
    code: 'ERR_VAL_002',
  },
};

/**
 * 에러 생성 함수
 */
export function createError(
  type: ErrorType,
  technicalMessage: string,
  context?: EnhancedError['context'],
  metadata?: Record<string, any>
): EnhancedError {
  const config = ERROR_CONFIGS[type];

  return {
    id: uuidv4(),
    type,
    domain: config.domain,
    severity: config.severity,
    code: config.code,
    message: config.defaultMessage,
    technicalMessage,
    timestamp: new Date(),
    recoverable: config.recoverable,
    recoveryStrategy: config.recoveryStrategy,
    context,
    metadata,
  };
}
```

#### 9.3.4 복구 서비스

```typescript
// src/lib/errors/recovery.ts - Part 6.1

import { EnhancedError, RecoveryStrategy } from './types';
import { prisma } from '@/lib/prisma';

/**
 * 복구 결과 인터페이스
 */
export interface RecoveryResult {
  success: boolean;
  error?: EnhancedError;
  retryCount?: number;
  fallbackActivated?: boolean;
}

/**
 * 지수 백오프 설정
 */
interface BackoffConfig {
  initialDelayMs: number;
  maxDelayMs: number;
  maxRetries: number;
  multiplier: number;
}

const DEFAULT_BACKOFF: BackoffConfig = {
  initialDelayMs: 1000,
  maxDelayMs: 30000,
  maxRetries: 3,
  multiplier: 2,
};

/**
 * 지수 백오프로 재시도
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  errorType: string,
  config: BackoffConfig = DEFAULT_BACKOFF
): Promise<{ data?: T; error?: EnhancedError; retryCount: number }> {
  let lastError: any;
  let delay = config.initialDelayMs;

  for (let attempt = 1; attempt <= config.maxRetries; attempt++) {
    try {
      const data = await operation();
      return { data, retryCount: attempt };
    } catch (error) {
      lastError = error;

      // 마지막 시도가 아니면 대기
      if (attempt < config.maxRetries) {
        await sleep(delay);
        delay = Math.min(delay * config.multiplier, config.maxDelayMs);
      }
    }
  }

  return {
    error: createError(
      errorType as any,
      `Failed after ${config.maxRetries} retries: ${lastError.message}`,
      undefined,
      { lastError: lastError.message, retries: config.maxRetries }
    ),
    retryCount: config.maxRetries,
  };
}

/**
 * 토큰 갱신 서비스
 */
export async function refreshAuthToken(
  userId: string,
  provider: 'google' | 'notion' | 'hubspot' | 'slack'
): Promise<RecoveryResult> {
  try {
    const token = await prisma.oAuthToken.findUnique({
      where: {
        userId_provider: { userId, provider },
      },
    });

    if (!token?.refreshToken) {
      return {
        success: false,
        error: createError(
          'AUTH_TOKEN_INVALID',
          `No refresh token available for ${provider}`
        ),
      };
    }

    // Provider별 토큰 갱신
    const newTokens = await refreshProviderToken(provider, token.refreshToken);

    await prisma.oAuthToken.update({
      where: { id: token.id },
      data: {
        accessToken: newTokens.accessToken,
        refreshToken: newTokens.refreshToken || token.refreshToken,
        expiresAt: newTokens.expiresAt,
      },
    });

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: createError(
        'AUTH_TOKEN_INVALID',
        `Token refresh failed: ${error.message}`
      ),
    };
  }
}

/**
 * Provider별 토큰 갱신
 */
async function refreshProviderToken(
  provider: string,
  refreshToken: string
): Promise<{
  accessToken: string;
  refreshToken?: string;
  expiresAt: Date;
}> {
  const endpoints: Record<string, string> = {
    google: 'https://oauth2.googleapis.com/token',
    notion: 'https://api.notion.com/v1/oauth/token',
    hubspot: 'https://api.hubapi.com/oauth/v1/token',
    slack: 'https://slack.com/api/oauth.v2.access',
  };

  const clientIds: Record<string, string> = {
    google: process.env.GOOGLE_CLIENT_ID!,
    notion: process.env.NOTION_CLIENT_ID!,
    hubspot: process.env.HUBSPOT_CLIENT_ID!,
    slack: process.env.SLACK_CLIENT_ID!,
  };

  const clientSecrets: Record<string, string> = {
    google: process.env.GOOGLE_CLIENT_SECRET!,
    notion: process.env.NOTION_CLIENT_SECRET!,
    hubspot: process.env.HUBSPOT_CLIENT_SECRET!,
    slack: process.env.SLACK_CLIENT_SECRET!,
  };

  const response = await fetch(endpoints[provider], {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: clientIds[provider],
      client_secret: clientSecrets[provider],
    }),
  });

  if (!response.ok) {
    throw new Error(`Token refresh failed: ${response.status}`);
  }

  const data = await response.json();

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: new Date(Date.now() + data.expires_in * 1000),
  };
}

/**
 * 재연결 서비스
 */
export async function reconnect(
  userId: string,
  sessionId: string
): Promise<RecoveryResult> {
  try {
    // WebSocket 재연결 로직
    // 실제 구현에서는 Redis pub/sub을 통해 클라이언트에게 재연결 요청

    await prisma.hudSession.update({
      where: { id: sessionId },
      data: {
        status: 'RECONNECTING',
        lastReconnectAttempt: new Date(),
      },
    });

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: createError(
        'NETWORK_OFFLINE',
        `Reconnection failed: ${error.message}`
      ),
    };
  }
}

/**
 * 폴백 활성화
 */
export async function activateFallback(
  errorType: string,
  userId: string,
  sessionId?: string
): Promise<RecoveryResult> {
  const fallbackMap: Record<string, () => Promise<void>> = {
    AI_STT_FAILED: async () => {
      // STT 실패 시 로컬 버퍼링 모드 활성화
      if (sessionId) {
        await prisma.hudSession.update({
          where: { id: sessionId },
          data: {
            fallbackMode: 'LOCAL_BUFFER',
            fallbackActivatedAt: new Date(),
          },
        });
      }
    },
    AI_ANALYSIS_FAILED: async () => {
      // 분석 실패 시 기본 요약만 제공
      if (sessionId) {
        await prisma.hudSession.update({
          where: { id: sessionId },
          data: {
            fallbackMode: 'BASIC_SUMMARY',
            fallbackActivatedAt: new Date(),
          },
        });
      }
    },
    NETWORK_OFFLINE: async () => {
      // 오프라인 모드 활성화
      // 클라이언트에서 처리 (서버에서는 상태만 기록)
    },
    MEDIA_AUDIO_QUALITY_LOW: async () => {
      // 저품질 오디오 모드 활성화
      if (sessionId) {
        await prisma.hudSession.update({
          where: { id: sessionId },
          data: {
            audioQualityMode: 'LOW',
            fallbackActivatedAt: new Date(),
          },
        });
      }
    },
  };

  const fallbackFn = fallbackMap[errorType];

  if (!fallbackFn) {
    return {
      success: false,
      error: createError(
        errorType as any,
        `No fallback available for ${errorType}`
      ),
      fallbackActivated: false,
    };
  }

  try {
    await fallbackFn();
    return { success: true, fallbackActivated: true };
  } catch (error: any) {
    return {
      success: false,
      error: createError(
        errorType as any,
        `Fallback activation failed: ${error.message}`
      ),
      fallbackActivated: false,
    };
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

#### 9.3.5 에러 로깅 서비스

```typescript
// src/lib/errors/logging.ts - Part 6.1

import { EnhancedError } from './types';
import { prisma } from '@/lib/prisma';

/**
 * 에러 로그 인터페이스
 */
export interface ErrorLog {
  id: string;
  errorId: string;
  type: string;
  domain: string;
  severity: string;
  code: string;
  message: string;
  technicalMessage: string;
  userId?: string;
  sessionId?: string;
  meetingId?: string;
  part?: string;
  component?: string;
  action?: string;
  metadata?: Record<string, any>;
  stackTrace?: string;
  recoveryAttempted: boolean;
  recoveryStrategy?: string;
  recoveryResult?: string;
  userAgent?: string;
  ipAddress?: string;
  createdAt: Date;
}

/**
 * 에러 로깅 함수
 */
export async function logError(
  error: EnhancedError,
  additionalContext?: {
    stackTrace?: string;
    userAgent?: string;
    ipAddress?: string;
  }
): Promise<void> {
  try {
    await prisma.errorLog.create({
      data: {
        errorId: error.id,
        type: error.type,
        domain: error.domain,
        severity: error.severity,
        code: error.code,
        message: error.message,
        technicalMessage: error.technicalMessage,
        userId: error.context?.userId,
        sessionId: error.context?.sessionId,
        meetingId: error.context?.meetingId,
        part: error.context?.part,
        component: error.context?.component,
        action: error.context?.action,
        metadata: error.metadata,
        stackTrace: additionalContext?.stackTrace,
        recoveryAttempted: false,
        recoveryStrategy: error.recoveryStrategy,
        userAgent: additionalContext?.userAgent,
        ipAddress: additionalContext?.ipAddress,
      },
    });
  } catch (logError) {
    // 로깅 실패 시 콘솔에 기록 (무한 루프 방지)
    console.error('Failed to log error:', logError);
    console.error('Original error:', error);
  }
}

/**
 * 복구 결과 로깅
 */
export async function logRecoveryResult(
  errorId: string,
  success: boolean,
  details?: string
): Promise<void> {
  try {
    await prisma.errorLog.update({
      where: { errorId },
      data: {
        recoveryAttempted: true,
        recoveryResult: success ? 'SUCCESS' : 'FAILED',
        recoveryDetails: details,
        recoveryAttemptedAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Failed to log recovery result:', error);
  }
}

/**
 * 에러 통계 집계
 */
export async function getErrorStats(
  userId: string,
  timeRange: { start: Date; end: Date }
): Promise<{
  totalErrors: number;
  byDomain: Record<string, number>;
  bySeverity: Record<string, number>;
  recoveryRate: number;
  topErrors: Array<{ type: string; count: number }>;
}> {
  const [total, byDomain, bySeverity, recovered, topErrors] = await Promise.all([
    // 총 에러 수
    prisma.errorLog.count({
      where: {
        userId,
        createdAt: { gte: timeRange.start, lte: timeRange.end },
      },
    }),
    // 도메인별 집계
    prisma.errorLog.groupBy({
      by: ['domain'],
      where: {
        userId,
        createdAt: { gte: timeRange.start, lte: timeRange.end },
      },
      _count: true,
    }),
    // 심각도별 집계
    prisma.errorLog.groupBy({
      by: ['severity'],
      where: {
        userId,
        createdAt: { gte: timeRange.start, lte: timeRange.end },
      },
      _count: true,
    }),
    // 복구 성공 수
    prisma.errorLog.count({
      where: {
        userId,
        createdAt: { gte: timeRange.start, lte: timeRange.end },
        recoveryResult: 'SUCCESS',
      },
    }),
    // 상위 에러 타입
    prisma.errorLog.groupBy({
      by: ['type'],
      where: {
        userId,
        createdAt: { gte: timeRange.start, lte: timeRange.end },
      },
      _count: true,
      orderBy: { _count: { type: 'desc' } },
      take: 5,
    }),
  ]);

  return {
    totalErrors: total,
    byDomain: Object.fromEntries(
      byDomain.map(d => [d.domain, d._count])
    ),
    bySeverity: Object.fromEntries(
      bySeverity.map(s => [s.severity, s._count])
    ),
    recoveryRate: total > 0 ? recovered / total : 0,
    topErrors: topErrors.map(e => ({ type: e.type, count: e._count })),
  };
}
```

#### 9.3.6 에러 API 엔드포인트

```typescript
// src/app/api/v1/errors/route.ts - Part 6.1

import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { logError, getErrorStats } from '@/lib/errors/logging';
import { createError } from '@/lib/errors/factory';
import { z } from 'zod';

/**
 * POST /api/v1/errors - 클라이언트 에러 로깅
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    const schema = z.object({
      type: z.string(),
      message: z.string(),
      technicalMessage: z.string().optional(),
      context: z.object({
        sessionId: z.string().optional(),
        meetingId: z.string().optional(),
        part: z.string().optional(),
        component: z.string().optional(),
        action: z.string().optional(),
      }).optional(),
      metadata: z.record(z.any()).optional(),
      stackTrace: z.string().optional(),
    });

    const parsed = schema.parse(body);

    const error = createError(
      parsed.type as any,
      parsed.technicalMessage || parsed.message,
      { userId: user.id, ...parsed.context },
      parsed.metadata
    );

    await logError(error, {
      stackTrace: parsed.stackTrace,
      userAgent: req.headers.get('user-agent') || undefined,
      ipAddress: req.headers.get('x-forwarded-for') || req.ip,
    });

    return NextResponse.json({
      success: true,
      errorId: error.id
    });
  } catch (error) {
    console.error('Error logging failed:', error);
    return NextResponse.json(
      { error: 'Failed to log error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/v1/errors/stats - 에러 통계 조회
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const range = searchParams.get('range') || '7d';

    const now = new Date();
    const start = new Date();

    switch (range) {
      case '24h':
        start.setHours(start.getHours() - 24);
        break;
      case '7d':
        start.setDate(start.getDate() - 7);
        break;
      case '30d':
        start.setDate(start.getDate() - 30);
        break;
      default:
        start.setDate(start.getDate() - 7);
    }

    const stats = await getErrorStats(user.id, { start, end: now });

    return NextResponse.json({ data: stats });
  } catch (error) {
    console.error('Error stats fetch failed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch error stats' },
      { status: 500 }
    );
  }
}
```

```typescript
// src/app/api/v1/errors/[errorId]/recovery/route.ts - Part 6.1

import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import {
  retryWithBackoff,
  refreshAuthToken,
  reconnect,
  activateFallback
} from '@/lib/errors/recovery';
import { logRecoveryResult } from '@/lib/errors/logging';
import { z } from 'zod';

/**
 * POST /api/v1/errors/:errorId/recovery - 에러 복구 시도
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { errorId: string } }
) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    const schema = z.object({
      strategy: z.enum([
        'retry_with_backoff',
        'refresh_token',
        'reconnect',
        'fallback',
      ]),
      errorType: z.string(),
      sessionId: z.string().optional(),
      provider: z.enum(['google', 'notion', 'hubspot', 'slack']).optional(),
    });

    const { strategy, errorType, sessionId, provider } = schema.parse(body);

    let result;

    switch (strategy) {
      case 'refresh_token':
        if (!provider) {
          return NextResponse.json(
            { error: 'Provider required for token refresh' },
            { status: 400 }
          );
        }
        result = await refreshAuthToken(user.id, provider);
        break;

      case 'reconnect':
        if (!sessionId) {
          return NextResponse.json(
            { error: 'Session ID required for reconnect' },
            { status: 400 }
          );
        }
        result = await reconnect(user.id, sessionId);
        break;

      case 'fallback':
        result = await activateFallback(errorType, user.id, sessionId);
        break;

      case 'retry_with_backoff':
        // 클라이언트에서 재시도 로직 실행
        // 서버에서는 복구 시도 기록만
        result = { success: true };
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid recovery strategy' },
          { status: 400 }
        );
    }

    // 복구 결과 로깅
    await logRecoveryResult(
      params.errorId,
      result.success,
      result.error?.technicalMessage
    );

    return NextResponse.json({
      success: result.success,
      fallbackActivated: result.fallbackActivated,
      error: result.error ? {
        type: result.error.type,
        message: result.error.message,
      } : undefined,
    });
  } catch (error) {
    console.error('Recovery failed:', error);
    return NextResponse.json(
      { error: 'Recovery attempt failed' },
      { status: 500 }
    );
  }
}
```

#### 9.3.7 에러 데이터베이스 스키마

```prisma
// prisma/schema.prisma - Part 6.1 추가

model ErrorLog {
  id                  String    @id @default(uuid())
  errorId             String    @unique
  type                String
  domain              String
  severity            String
  code                String
  message             String
  technicalMessage    String
  userId              String?
  sessionId           String?
  meetingId           String?
  part                String?
  component           String?
  action              String?
  metadata            Json?
  stackTrace          String?   @db.Text
  recoveryAttempted   Boolean   @default(false)
  recoveryStrategy    String?
  recoveryResult      String?   // 'SUCCESS' | 'FAILED' | null
  recoveryDetails     String?
  recoveryAttemptedAt DateTime?
  userAgent           String?
  ipAddress           String?
  createdAt           DateTime  @default(now())

  // Relations
  user                User?     @relation(fields: [userId], references: [id])

  @@index([userId])
  @@index([domain])
  @@index([severity])
  @@index([type])
  @@index([createdAt])
  @@index([code])
}

// HudSession 모델에 폴백 필드 추가
model HudSession {
  // ... 기존 필드

  // Part 6.1: 폴백 모드 필드
  fallbackMode          String?   // 'LOCAL_BUFFER' | 'BASIC_SUMMARY' | null
  fallbackActivatedAt   DateTime?
  audioQualityMode      String?   // 'HIGH' | 'LOW' | 'AUTO'
  lastReconnectAttempt  DateTime?
}
```

#### 9.3.8 에러 미들웨어

```typescript
// src/middleware/errorMiddleware.ts - Part 6.1

import { NextRequest, NextResponse } from 'next/server';
import { createError } from '@/lib/errors/factory';
import { createErrorResponse, getHttpStatusCode } from '@/lib/errors/response';
import { logError } from '@/lib/errors/logging';

/**
 * 글로벌 에러 미들웨어
 */
export async function withErrorHandling(
  handler: (req: NextRequest) => Promise<NextResponse>,
  req: NextRequest
): Promise<NextResponse> {
  try {
    return await handler(req);
  } catch (error: any) {
    // 이미 처리된 에러인 경우
    if (error.id && error.type && error.domain) {
      const enhancedError = error;
      await logError(enhancedError, {
        userAgent: req.headers.get('user-agent') || undefined,
        ipAddress: req.headers.get('x-forwarded-for') || req.ip,
      });

      return NextResponse.json(
        createErrorResponse(enhancedError),
        { status: getHttpStatusCode(enhancedError) }
      );
    }

    // 알 수 없는 에러 처리
    const unknownError = createError(
      'NETWORK_SERVER_ERROR',
      error.message || 'Unknown error occurred',
      {
        action: req.nextUrl.pathname,
      },
      { originalError: error.toString() }
    );

    await logError(unknownError, {
      stackTrace: error.stack,
      userAgent: req.headers.get('user-agent') || undefined,
      ipAddress: req.headers.get('x-forwarded-for') || req.ip,
    });

    return NextResponse.json(
      createErrorResponse(unknownError),
      { status: 500 }
    );
  }
}

/**
 * API Route 래퍼
 */
export function withErrorHandler(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    return withErrorHandling(handler, req);
  };
}
```

#### 9.3.9 에러 메시지 국제화

```typescript
// src/lib/errors/i18n.ts - Part 6.1

/**
 * 에러 메시지 번역 키
 */
export const ERROR_MESSAGES: Record<string, Record<string, string>> = {
  ko: {
    // Network
    'error.network.offline': '인터넷 연결이 끊어졌습니다. 연결 상태를 확인해주세요.',
    'error.network.timeout': '요청 시간이 초과되었습니다. 다시 시도해주세요.',
    'error.network.server': '서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.',

    // Auth
    'error.auth.session_expired': '세션이 만료되었습니다. 다시 로그인해주세요.',
    'error.auth.token_invalid': '인증 정보가 유효하지 않습니다. 다시 로그인해주세요.',
    'error.auth.permission_denied': '이 작업을 수행할 권한이 없습니다.',
    'error.auth.google_oauth_failed': 'Google 로그인에 실패했습니다. 다시 시도해주세요.',

    // Integration
    'error.integration.calendar_sync': '캘린더 동기화에 실패했습니다. 다시 시도해주세요.',
    'error.integration.notion_auth': 'Notion 연결이 만료되었습니다. 다시 연결해주세요.',
    'error.integration.notion_save': 'Notion 저장에 실패했습니다. 다시 시도해주세요.',
    'error.integration.hubspot_auth': 'HubSpot 연결이 만료되었습니다. 다시 연결해주세요.',
    'error.integration.hubspot_sync': 'HubSpot 동기화에 실패했습니다. 다시 시도해주세요.',
    'error.integration.slack_disconnected': 'Slack 연결이 끊어졌습니다. 다시 연결해주세요.',

    // AI
    'error.ai.stt_failed': '음성 인식에 실패했습니다. 마이크를 확인해주세요.',
    'error.ai.analysis_failed': 'AI 분석에 실패했습니다. 다시 시도해주세요.',
    'error.ai.rate_limited': '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
    'error.ai.quota_exceeded': 'AI 사용량이 초과되었습니다. 플랜을 업그레이드해주세요.',

    // Media
    'error.media.mic_permission': '마이크 권한이 필요합니다. 브라우저 설정에서 허용해주세요.',
    'error.media.mic_not_found': '마이크를 찾을 수 없습니다. 마이크를 연결해주세요.',
    'error.media.recording_failed': '녹음에 실패했습니다. 다시 시도해주세요.',
    'error.media.audio_quality': '오디오 품질이 낮습니다. 마이크를 확인해주세요.',

    // Storage
    'error.storage.quota_exceeded': '저장 공간이 부족합니다. 불필요한 파일을 삭제해주세요.',
    'error.storage.upload_failed': '파일 업로드에 실패했습니다. 다시 시도해주세요.',
    'error.storage.read_failed': '파일을 읽을 수 없습니다. 다시 시도해주세요.',

    // Validation
    'error.validation.invalid_input': '입력값이 올바르지 않습니다. 확인 후 다시 시도해주세요.',
    'error.validation.missing_field': '필수 항목이 누락되었습니다. 모든 항목을 입력해주세요.',

    // CTA Labels
    'error.cta.retry': '다시 시도',
    'error.cta.reconnect': '다시 연결',
    'error.cta.login': '로그인',
    'error.cta.settings': '설정으로 이동',
    'error.cta.upgrade': '플랜 업그레이드',
    'error.cta.dismiss': '닫기',
  },
  en: {
    // Network
    'error.network.offline': 'You are offline. Please check your connection.',
    'error.network.timeout': 'Request timed out. Please try again.',
    'error.network.server': 'Cannot connect to server. Please try again later.',

    // Auth
    'error.auth.session_expired': 'Your session has expired. Please log in again.',
    'error.auth.token_invalid': 'Authentication invalid. Please log in again.',
    'error.auth.permission_denied': 'You don\'t have permission for this action.',
    'error.auth.google_oauth_failed': 'Google login failed. Please try again.',

    // ... 나머지 영어 번역
  },
};

/**
 * 에러 메시지 번역 함수
 */
export function translateErrorMessage(
  key: string,
  locale: string = 'ko'
): string {
  return ERROR_MESSAGES[locale]?.[key] || ERROR_MESSAGES['ko'][key] || key;
}
```

#### 9.3.10 에러 처리 성능 지표

```typescript
// src/lib/errors/metrics.ts - Part 6.1

/**
 * Part 6.1 에러 처리 목표 지표
 */
export const ERROR_METRICS_TARGETS = {
  // 에러율
  errorRate: {
    target: 0.01, // 1% 미만
    warning: 0.02,
    critical: 0.05,
  },

  // 자동 복구율
  autoRecoveryRate: {
    target: 0.7, // 70% 이상
    warning: 0.5,
    critical: 0.3,
  },

  // 사용자 복구율
  userRecoveryRate: {
    target: 0.6, // 60% 이상
    warning: 0.4,
    critical: 0.2,
  },

  // 에러 이탈율
  errorChurnRate: {
    target: 0.1, // 10% 미만
    warning: 0.2,
    critical: 0.3,
  },

  // 에러 표시 시간
  errorDisplayTime: {
    target: 100, // 100ms 이내
    warning: 200,
    critical: 500,
  },

  // 복구 시도 시간
  recoveryAttemptTime: {
    target: 1000, // 1초 이내
    warning: 3000,
    critical: 5000,
  },
};

/**
 * 에러 메트릭 수집 함수
 */
export async function collectErrorMetrics(
  userId: string,
  timeRange: { start: Date; end: Date }
): Promise<{
  errorRate: number;
  autoRecoveryRate: number;
  userRecoveryRate: number;
  errorChurnRate: number;
  status: 'healthy' | 'warning' | 'critical';
}> {
  const stats = await getErrorStats(userId, timeRange);

  // 전체 요청 수 대비 에러율 계산
  // (실제 구현에서는 총 요청 수 추적 필요)
  const errorRate = stats.totalErrors / 1000; // 예시

  const autoRecoveryRate = stats.recoveryRate;

  // 사용자 복구율 (CTA 클릭 후 성공)
  // (실제 구현에서는 별도 추적 필요)
  const userRecoveryRate = 0.65; // 예시

  // 에러 발생 후 이탈율
  // (실제 구현에서는 세션 추적 필요)
  const errorChurnRate = 0.08; // 예시

  // 상태 판단
  let status: 'healthy' | 'warning' | 'critical' = 'healthy';

  if (
    errorRate > ERROR_METRICS_TARGETS.errorRate.critical ||
    autoRecoveryRate < ERROR_METRICS_TARGETS.autoRecoveryRate.critical ||
    errorChurnRate > ERROR_METRICS_TARGETS.errorChurnRate.critical
  ) {
    status = 'critical';
  } else if (
    errorRate > ERROR_METRICS_TARGETS.errorRate.warning ||
    autoRecoveryRate < ERROR_METRICS_TARGETS.autoRecoveryRate.warning ||
    errorChurnRate > ERROR_METRICS_TARGETS.errorChurnRate.warning
  ) {
    status = 'warning';
  }

  return {
    errorRate,
    autoRecoveryRate,
    userRecoveryRate,
    errorChurnRate,
    status,
  };
}
```

---

## 10. 성능 및 확장성

### 10.1 캐싱 전략

```typescript
// src/lib/cache.ts
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 300 // 5분
): Promise<T> {
  // 1. 캐시에서 확인
  const cached = await redis.get(key);
  if (cached) {
    return cached as T;
  }

  // 2. 없으면 fetcher 실행
  const data = await fetcher();

  // 3. 캐시에 저장
  await redis.set(key, data, { ex: ttl });

  return data;
}

// 사용 예시
export async function getMeetings(userId: string) {
  return getCached(
    `meetings:${userId}`,
    () => prisma.meeting.findMany({ where: { userId } }),
    300
  );
}
```

### 10.2 데이터베이스 최적화

```typescript
// 1. 커넥션 풀 설정
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  relationMode = "prisma"
}

// .env
DATABASE_URL="postgresql://user:pass@host:5432/db?connection_limit=10"

// 2. 쿼리 최적화 (N+1 방지)
const meetings = await prisma.meeting.findMany({
  where: { userId },
  include: {
    decisions: true,
    insights: true,
    actions: true,
  },
  take: 20,
  orderBy: { startTime: 'desc' },
});
```

### 10.3 백그라운드 작업

```typescript
// src/lib/queue.ts (향후 BullMQ 도입 권장)
export async function processAsync<T>(
  task: () => Promise<T>
): Promise<void> {
  // 비동기로 실행 (응답 즉시 반환)
  task().catch((error) => {
    console.error('Background task failed:', error);
    // Sentry 등 에러 트래킹
  });
}

// 사용 예시: 통합 작업은 백그라운드에서
export async function confirmMeeting(meetingId: string) {
  // 1. 즉시 응답
  const meeting = await prisma.meeting.update({
    where: { id: meetingId },
    data: { status: 'COMPLETED' },
  });

  // 2. 통합 작업은 백그라운드
  processAsync(async () => {
    await createMeetingPage(meeting.userId, meeting);
    await updateDeal(meeting.userId, meeting);
    await postToSlack(meeting.userId, meeting);
  });

  return meeting;
}
```

### 10.4 Part 6.2: 스트리밍 응답 API (Streaming Response)

```typescript
// src/lib/streaming.ts
// 5-Layer Framework: Structure/Logic Layer - 스트리밍 응답 구현

import { NextResponse } from 'next/server';

// ============================================
// 10.4.1 스트리밍 응답 타입 정의
// ============================================

type StreamingChunkType =
  | 'start'           // 스트리밍 시작
  | 'chunk'           // 데이터 청크
  | 'progress'        // 진행률 업데이트
  | 'metadata'        // 메타데이터
  | 'complete'        // 완료
  | 'error';          // 에러

interface StreamingChunk<T = unknown> {
  type: StreamingChunkType;
  data?: T;
  progress?: number;        // 0-100
  estimatedTimeMs?: number; // 남은 예상 시간
  timestamp: number;
  chunkIndex: number;
}

interface StreamingOptions {
  onStart?: () => void;
  onChunk?: (chunk: StreamingChunk) => void;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
  chunkDelay?: number;  // 청크 간 최소 딜레이 (ms)
}

// ============================================
// 10.4.2 스트리밍 응답 유틸리티
// ============================================

export function createStreamingResponse(
  generator: AsyncGenerator<StreamingChunk>,
  options?: { contentType?: string }
): Response {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let chunkIndex = 0;

      try {
        // 시작 청크 전송
        const startChunk: StreamingChunk = {
          type: 'start',
          timestamp: Date.now(),
          chunkIndex: chunkIndex++,
        };
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(startChunk)}\n\n`)
        );

        // 데이터 청크 전송
        for await (const chunk of generator) {
          const enrichedChunk = {
            ...chunk,
            chunkIndex: chunkIndex++,
            timestamp: chunk.timestamp || Date.now(),
          };
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(enrichedChunk)}\n\n`)
          );
        }

        // 완료 청크 전송
        const completeChunk: StreamingChunk = {
          type: 'complete',
          timestamp: Date.now(),
          chunkIndex: chunkIndex++,
        };
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(completeChunk)}\n\n`)
        );

      } catch (error) {
        // 에러 청크 전송
        const errorChunk: StreamingChunk = {
          type: 'error',
          data: error instanceof Error ? error.message : 'Unknown error',
          timestamp: Date.now(),
          chunkIndex: chunkIndex++,
        };
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(errorChunk)}\n\n`)
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': options?.contentType || 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // Nginx 버퍼링 비활성화
    },
  });
}

// ============================================
// 10.4.3 AI 스트리밍 응답 (GPT/Claude)
// ============================================

export async function* streamAIResponse(
  prompt: string,
  context: { userId: string; meetingId?: string }
): AsyncGenerator<StreamingChunk> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const stream = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [{ role: 'user', content: prompt }],
    stream: true,
  });

  let totalTokens = 0;
  const estimatedTotalTokens = Math.ceil(prompt.length / 4) * 3; // 대략적 추정

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || '';
    totalTokens += content.length / 4; // 대략적 토큰 추정

    if (content) {
      yield {
        type: 'chunk',
        data: content,
        progress: Math.min(99, Math.round((totalTokens / estimatedTotalTokens) * 100)),
        timestamp: Date.now(),
        chunkIndex: 0, // 실제 chunkIndex는 createStreamingResponse에서 설정
      };
    }
  }
}

// ============================================
// 10.4.4 스트리밍 API 엔드포인트
// ============================================

// POST /api/ai/stream
export async function POST(req: NextRequest) {
  const { userId } = await validateSession(req);
  const { prompt, meetingId } = await req.json();

  const generator = streamAIResponse(prompt, { userId, meetingId });
  return createStreamingResponse(generator);
}

// 실시간 미팅 분석 스트리밍
// POST /api/meetings/[id]/analyze/stream
export async function streamMeetingAnalysis(
  meetingId: string,
  userId: string
): AsyncGenerator<StreamingChunk> {
  const meeting = await prisma.meeting.findUnique({
    where: { id: meetingId },
    include: { transcript: true },
  });

  if (!meeting) throw new Error('Meeting not found');

  const stages = [
    { name: '전사 분석', weight: 20 },
    { name: '핵심 주제 추출', weight: 30 },
    { name: '결정 사항 식별', weight: 30 },
    { name: '액션 아이템 정리', weight: 20 },
  ];

  let currentProgress = 0;

  for (const stage of stages) {
    // 스테이지 시작 메타데이터
    yield {
      type: 'metadata',
      data: { stage: stage.name },
      progress: currentProgress,
      timestamp: Date.now(),
      chunkIndex: 0,
    };

    // AI 분석 스트리밍
    const stageGenerator = streamAIResponse(
      `Analyze ${stage.name} for meeting: ${meeting.transcript?.content}`,
      { userId, meetingId }
    );

    for await (const chunk of stageGenerator) {
      const adjustedProgress = currentProgress +
        ((chunk.progress || 0) / 100) * stage.weight;

      yield {
        ...chunk,
        progress: Math.round(adjustedProgress),
      };
    }

    currentProgress += stage.weight;
  }
}
```

### 10.5 Part 6.2: 진행률 추적 API (Progress Tracking)

```typescript
// src/lib/progress-tracker.ts
// 5-Layer Framework: Structure/Logic Layer - 진행률 추적

import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

// ============================================
// 10.5.1 진행률 상태 타입
// ============================================

type ProgressStatus =
  | 'pending'       // 대기 중
  | 'processing'    // 처리 중
  | 'completed'     // 완료
  | 'failed'        // 실패
  | 'cancelled';    // 취소됨

interface ProgressState {
  id: string;
  status: ProgressStatus;
  progress: number;           // 0-100
  currentStep: string;        // 현재 단계 설명
  totalSteps: number;         // 전체 단계 수
  currentStepIndex: number;   // 현재 단계 인덱스
  startedAt: number;          // 시작 시간 (timestamp)
  updatedAt: number;          // 마지막 업데이트 (timestamp)
  estimatedCompletionMs?: number; // 예상 남은 시간
  metadata?: Record<string, unknown>;
  error?: {
    code: string;
    message: string;
  };
}

// ============================================
// 10.5.2 진행률 추적 서비스
// ============================================

export class ProgressTracker {
  private readonly keyPrefix = 'progress:';
  private readonly ttl = 3600; // 1시간

  async create(id: string, totalSteps: number, metadata?: Record<string, unknown>): Promise<ProgressState> {
    const state: ProgressState = {
      id,
      status: 'pending',
      progress: 0,
      currentStep: '준비 중...',
      totalSteps,
      currentStepIndex: 0,
      startedAt: Date.now(),
      updatedAt: Date.now(),
      metadata,
    };

    await redis.set(
      `${this.keyPrefix}${id}`,
      JSON.stringify(state),
      { ex: this.ttl }
    );

    // WebSocket으로 초기 상태 브로드캐스트
    await this.broadcastProgress(id, state);

    return state;
  }

  async update(
    id: string,
    updates: Partial<Pick<ProgressState, 'progress' | 'currentStep' | 'currentStepIndex' | 'status' | 'estimatedCompletionMs'>>
  ): Promise<ProgressState | null> {
    const key = `${this.keyPrefix}${id}`;
    const existing = await redis.get(key);

    if (!existing) return null;

    const state = JSON.parse(existing as string) as ProgressState;
    const updatedState: ProgressState = {
      ...state,
      ...updates,
      updatedAt: Date.now(),
    };

    await redis.set(key, JSON.stringify(updatedState), { ex: this.ttl });

    // WebSocket으로 업데이트 브로드캐스트
    await this.broadcastProgress(id, updatedState);

    return updatedState;
  }

  async complete(id: string, metadata?: Record<string, unknown>): Promise<ProgressState | null> {
    return this.update(id, {
      status: 'completed',
      progress: 100,
      currentStep: '완료',
      ...(metadata && { metadata }),
    } as Partial<ProgressState>);
  }

  async fail(id: string, error: { code: string; message: string }): Promise<ProgressState | null> {
    const key = `${this.keyPrefix}${id}`;
    const existing = await redis.get(key);

    if (!existing) return null;

    const state = JSON.parse(existing as string) as ProgressState;
    const updatedState: ProgressState = {
      ...state,
      status: 'failed',
      updatedAt: Date.now(),
      error,
    };

    await redis.set(key, JSON.stringify(updatedState), { ex: this.ttl });
    await this.broadcastProgress(id, updatedState);

    return updatedState;
  }

  async get(id: string): Promise<ProgressState | null> {
    const existing = await redis.get(`${this.keyPrefix}${id}`);
    return existing ? JSON.parse(existing as string) : null;
  }

  async cancel(id: string): Promise<ProgressState | null> {
    return this.update(id, {
      status: 'cancelled',
      currentStep: '취소됨',
    });
  }

  private async broadcastProgress(id: string, state: ProgressState): Promise<void> {
    // Redis Pub/Sub를 통한 WebSocket 브로드캐스트
    await redis.publish('progress-updates', JSON.stringify({
      id,
      state,
    }));
  }
}

export const progressTracker = new ProgressTracker();

// ============================================
// 10.5.3 진행률 추적 API 엔드포인트
// ============================================

// GET /api/progress/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = await validateSession(req);
  const progress = await progressTracker.get(params.id);

  if (!progress) {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'Progress not found' } },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: progress,
  });
}

// DELETE /api/progress/[id] - 작업 취소
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = await validateSession(req);
  const progress = await progressTracker.cancel(params.id);

  if (!progress) {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'Progress not found' } },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: progress,
  });
}
```

### 10.6 Part 6.2: 장기 실행 작업 패턴 (Long-Running Operations)

```typescript
// src/lib/long-running-operations.ts
// 5-Layer Framework: Structure/Logic Layer - 장기 실행 작업

import { v4 as uuidv4 } from 'uuid';
import { progressTracker } from './progress-tracker';

// ============================================
// 10.6.1 장기 실행 작업 타입
// ============================================

type OperationType =
  | 'meeting_analysis'      // 미팅 분석
  | 'bulk_export'           // 대량 내보내기
  | 'notion_sync'           // Notion 동기화
  | 'salesforce_sync'       // Salesforce 동기화
  | 'search_reindex'        // 검색 재색인
  | 'audio_transcription';  // 오디오 전사

interface LongRunningOperation {
  id: string;
  type: OperationType;
  userId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  result?: unknown;
  error?: { code: string; message: string };
  metadata?: Record<string, unknown>;
}

// ============================================
// 10.6.2 장기 실행 작업 서비스
// ============================================

export class LongRunningOperationService {

  async createOperation(
    type: OperationType,
    userId: string,
    metadata?: Record<string, unknown>
  ): Promise<LongRunningOperation> {
    const operationId = uuidv4();

    const operation: LongRunningOperation = {
      id: operationId,
      type,
      userId,
      status: 'queued',
      progress: 0,
      createdAt: new Date(),
      metadata,
    };

    // DB에 저장
    await prisma.longRunningOperation.create({
      data: {
        id: operationId,
        type,
        userId,
        status: 'queued',
        progress: 0,
        metadata: metadata || {},
      },
    });

    // 진행률 추적 시작
    await progressTracker.create(operationId, this.getStepsForType(type), {
      type,
      userId,
    });

    return operation;
  }

  async startOperation(
    operationId: string,
    executor: (onProgress: (progress: number, step: string) => Promise<void>) => Promise<unknown>
  ): Promise<void> {
    // 상태 업데이트: processing
    await prisma.longRunningOperation.update({
      where: { id: operationId },
      data: { status: 'processing', startedAt: new Date() },
    });

    await progressTracker.update(operationId, {
      status: 'processing',
      currentStep: '처리 시작...',
    });

    try {
      const result = await executor(async (progress, step) => {
        await progressTracker.update(operationId, {
          progress,
          currentStep: step,
        });
      });

      // 완료 처리
      await prisma.longRunningOperation.update({
        where: { id: operationId },
        data: {
          status: 'completed',
          completedAt: new Date(),
          result: result || {},
        },
      });

      await progressTracker.complete(operationId);

    } catch (error) {
      // 실패 처리
      const errorInfo = {
        code: 'OPERATION_FAILED',
        message: error instanceof Error ? error.message : 'Unknown error',
      };

      await prisma.longRunningOperation.update({
        where: { id: operationId },
        data: {
          status: 'failed',
          error: errorInfo,
        },
      });

      await progressTracker.fail(operationId, errorInfo);
    }
  }

  private getStepsForType(type: OperationType): number {
    const stepMap: Record<OperationType, number> = {
      meeting_analysis: 4,     // 전사 분석 → 주제 추출 → 결정 식별 → 액션 정리
      bulk_export: 3,          // 데이터 수집 → 포맷 변환 → 파일 생성
      notion_sync: 5,          // 인증 확인 → 데이터 수집 → 변환 → 업로드 → 검증
      salesforce_sync: 5,      // 동일
      search_reindex: 3,       // 문서 수집 → 임베딩 생성 → 인덱싱
      audio_transcription: 4,  // 오디오 처리 → 전사 → 정리 → 저장
    };
    return stepMap[type] || 3;
  }

  async getOperation(operationId: string): Promise<LongRunningOperation | null> {
    return prisma.longRunningOperation.findUnique({
      where: { id: operationId },
    });
  }

  async cancelOperation(operationId: string): Promise<void> {
    await prisma.longRunningOperation.update({
      where: { id: operationId },
      data: { status: 'cancelled' },
    });
    await progressTracker.cancel(operationId);
  }

  async getUserOperations(
    userId: string,
    options?: { status?: string; limit?: number }
  ): Promise<LongRunningOperation[]> {
    return prisma.longRunningOperation.findMany({
      where: {
        userId,
        ...(options?.status && { status: options.status }),
      },
      take: options?.limit || 10,
      orderBy: { createdAt: 'desc' },
    });
  }
}

export const longRunningOperationService = new LongRunningOperationService();

// ============================================
// 10.6.3 장기 실행 작업 API 엔드포인트
// ============================================

// POST /api/operations
export async function POST(req: NextRequest) {
  const { userId } = await validateSession(req);
  const { type, metadata } = await req.json();

  const operation = await longRunningOperationService.createOperation(
    type,
    userId,
    metadata
  );

  // 백그라운드에서 작업 시작
  processAsync(async () => {
    await longRunningOperationService.startOperation(
      operation.id,
      async (onProgress) => {
        // 실제 작업 로직 (type에 따라 분기)
        return executeOperation(operation.type, operation.metadata, onProgress);
      }
    );
  });

  // 즉시 응답 (operation ID 반환)
  return NextResponse.json({
    success: true,
    data: {
      operationId: operation.id,
      status: 'queued',
      progressUrl: `/api/progress/${operation.id}`,
      streamUrl: `/api/operations/${operation.id}/stream`,
    },
  });
}

// GET /api/operations/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = await validateSession(req);
  const operation = await longRunningOperationService.getOperation(params.id);

  if (!operation || operation.userId !== userId) {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'Operation not found' } },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: operation,
  });
}

// GET /api/operations - 사용자의 모든 작업 목록
export async function GET(req: NextRequest) {
  const { userId } = await validateSession(req);
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') || undefined;
  const limit = parseInt(searchParams.get('limit') || '10');

  const operations = await longRunningOperationService.getUserOperations(
    userId,
    { status, limit }
  );

  return NextResponse.json({
    success: true,
    data: operations,
  });
}
```

### 10.7 Part 6.2: 로딩 힌트 응답 메타데이터

```typescript
// src/lib/loading-hints.ts
// 5-Layer Framework: Strategy Layer - 프론트엔드에게 로딩 힌트 제공

// ============================================
// 10.7.1 로딩 힌트 타입
// ============================================

type LoadingHintType =
  | 'instant'           // 즉시 완료 (< 100ms)
  | 'fast'              // 빠름 (100-500ms)
  | 'moderate'          // 보통 (500ms-2s)
  | 'slow'              // 느림 (2-10s)
  | 'long_running'      // 장기 실행 (> 10s)
  | 'streaming';        // 스트리밍

interface LoadingHint {
  type: LoadingHintType;
  estimatedDurationMs?: number;
  displayType: 'none' | 'skeleton' | 'spinner' | 'progress' | 'streaming';
  cancellable: boolean;
  retryable: boolean;
  progressTracking?: {
    enabled: boolean;
    pollingIntervalMs?: number;
    streamUrl?: string;
  };
}

// ============================================
// 10.7.2 API별 로딩 힌트 매핑
// ============================================

const LOADING_HINTS: Record<string, LoadingHint> = {
  // 즉시 응답 API
  'GET /api/user/profile': {
    type: 'instant',
    displayType: 'none',
    cancellable: false,
    retryable: true,
  },

  // 빠른 응답 API
  'GET /api/meetings': {
    type: 'fast',
    estimatedDurationMs: 200,
    displayType: 'skeleton',
    cancellable: false,
    retryable: true,
  },

  // 보통 응답 API
  'POST /api/search': {
    type: 'moderate',
    estimatedDurationMs: 1000,
    displayType: 'skeleton',
    cancellable: true,
    retryable: true,
  },

  // 느린 응답 API
  'POST /api/meetings/[id]/analyze': {
    type: 'slow',
    estimatedDurationMs: 5000,
    displayType: 'progress',
    cancellable: true,
    retryable: true,
    progressTracking: {
      enabled: true,
      pollingIntervalMs: 1000,
    },
  },

  // 장기 실행 API
  'POST /api/integrations/notion/sync': {
    type: 'long_running',
    estimatedDurationMs: 30000,
    displayType: 'progress',
    cancellable: true,
    retryable: true,
    progressTracking: {
      enabled: true,
      pollingIntervalMs: 2000,
    },
  },

  // 스트리밍 API
  'POST /api/ai/stream': {
    type: 'streaming',
    displayType: 'streaming',
    cancellable: true,
    retryable: false,
    progressTracking: {
      enabled: true,
      streamUrl: '/api/ai/stream',
    },
  },
};

// ============================================
// 10.7.3 로딩 힌트 미들웨어
// ============================================

export function withLoadingHints(handler: NextHandler): NextHandler {
  return async (req: NextRequest, context: NextContext) => {
    const response = await handler(req, context);

    // API 경로 키 생성
    const method = req.method;
    const pathname = new URL(req.url).pathname
      .replace(/\/[a-f0-9-]{36}/g, '/[id]')  // UUID를 [id]로 치환
      .replace(/\/\d+/g, '/[id]');            // 숫자도 [id]로 치환

    const hintKey = `${method} ${pathname}`;
    const hint = LOADING_HINTS[hintKey];

    if (hint) {
      // 헤더에 로딩 힌트 추가
      const headers = new Headers(response.headers);
      headers.set('X-Loading-Hint', JSON.stringify(hint));
      headers.set('X-Estimated-Duration-Ms', String(hint.estimatedDurationMs || 0));
      headers.set('X-Cancellable', String(hint.cancellable));

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }

    return response;
  };
}

// ============================================
// 10.7.4 응답 엔벨로프에 로딩 힌트 포함
// ============================================

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
  meta?: {
    loadingHint?: LoadingHint;
    timing?: {
      startedAt: number;
      completedAt: number;
      durationMs: number;
    };
    pagination?: {
      page: number;
      pageSize: number;
      totalCount: number;
      hasMore: boolean;
    };
  };
}

export function createApiResponse<T>(
  data: T,
  options?: {
    loadingHint?: LoadingHint;
    startTime?: number;
    pagination?: { page: number; pageSize: number; totalCount: number };
  }
): ApiResponse<T> {
  const completedAt = Date.now();

  return {
    success: true,
    data,
    meta: {
      ...(options?.loadingHint && { loadingHint: options.loadingHint }),
      ...(options?.startTime && {
        timing: {
          startedAt: options.startTime,
          completedAt,
          durationMs: completedAt - options.startTime,
        },
      }),
      ...(options?.pagination && {
        pagination: {
          ...options.pagination,
          hasMore: options.pagination.page * options.pagination.pageSize < options.pagination.totalCount,
        },
      }),
    },
  };
}
```

### 10.8 Part 6.2: 백그라운드 작업 폴링 API

```typescript
// src/app/api/operations/[id]/poll/route.ts
// 5-Layer Framework: Structure/Logic Layer - 폴링 API

import { NextRequest, NextResponse } from 'next/server';
import { progressTracker } from '@/lib/progress-tracker';

// ============================================
// 10.8.1 폴링 엔드포인트
// ============================================

// GET /api/operations/[id]/poll
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = await validateSession(req);
  const { searchParams } = new URL(req.url);

  // 롱 폴링 타임아웃 (기본 30초, 최대 60초)
  const timeoutMs = Math.min(
    parseInt(searchParams.get('timeout') || '30000'),
    60000
  );

  // 마지막 업데이트 시간 (변경 감지용)
  const lastUpdatedAt = parseInt(searchParams.get('lastUpdatedAt') || '0');

  const startTime = Date.now();
  let progress = await progressTracker.get(params.id);

  // 롱 폴링: 변경이 있을 때까지 대기
  while (
    progress &&
    progress.updatedAt <= lastUpdatedAt &&
    progress.status !== 'completed' &&
    progress.status !== 'failed' &&
    progress.status !== 'cancelled' &&
    Date.now() - startTime < timeoutMs
  ) {
    await new Promise(resolve => setTimeout(resolve, 500)); // 500ms 간격으로 체크
    progress = await progressTracker.get(params.id);
  }

  if (!progress) {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'Operation not found' } },
      { status: 404 }
    );
  }

  // 캐시 방지 헤더
  return NextResponse.json(
    {
      success: true,
      data: progress,
      meta: {
        polledAt: Date.now(),
        changed: progress.updatedAt > lastUpdatedAt,
      },
    },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    }
  );
}

// ============================================
// 10.8.2 배치 폴링 엔드포인트
// ============================================

// POST /api/operations/poll-batch
export async function POST(req: NextRequest) {
  const { userId } = await validateSession(req);
  const { operationIds } = await req.json();

  if (!Array.isArray(operationIds) || operationIds.length === 0) {
    return NextResponse.json(
      { error: { code: 'INVALID_INPUT', message: 'operationIds required' } },
      { status: 400 }
    );
  }

  // 최대 10개까지만 허용
  const limitedIds = operationIds.slice(0, 10);

  const results = await Promise.all(
    limitedIds.map(async (id) => {
      const progress = await progressTracker.get(id);
      return { id, progress };
    })
  );

  return NextResponse.json({
    success: true,
    data: results.reduce((acc, { id, progress }) => {
      if (progress) acc[id] = progress;
      return acc;
    }, {} as Record<string, ProgressState>),
  });
}
```

### 10.9 Part 6.2: 로딩 성능 메트릭

```typescript
// src/lib/loading-metrics.ts
// 5-Layer Framework: Metrics Layer - 로딩 성능 측정

// ============================================
// 10.9.1 로딩 메트릭 타입
// ============================================

interface LoadingMetric {
  endpoint: string;
  method: string;
  duration: number;            // 응답 시간 (ms)
  status: 'success' | 'error' | 'cancelled' | 'timeout';
  timestamp: number;
  metadata?: {
    userId?: string;
    operationType?: string;
    dataSize?: number;         // 응답 크기 (bytes)
    cacheHit?: boolean;        // 캐시 히트 여부
  };
}

// 로딩 메트릭 목표값
const LOADING_METRICS_TARGETS = {
  // 응답 시간 목표 (ms)
  responseTime: {
    p50: 200,    // 50% 요청이 200ms 이내
    p90: 500,    // 90% 요청이 500ms 이내
    p99: 2000,   // 99% 요청이 2초 이내
  },

  // 로딩 abandon rate (사용자가 로딩 중 이탈)
  abandonRate: {
    target: 0.05,    // 5% 미만
    warning: 0.10,   // 10% 경고
    critical: 0.20,  // 20% 심각
  },

  // 로딩 cancel rate (사용자가 취소)
  cancelRate: {
    target: 0.10,    // 10% 미만
    warning: 0.20,   // 20% 경고
    critical: 0.30,  // 30% 심각
  },

  // Optimistic UI 롤백률
  optimisticRollbackRate: {
    target: 0.02,    // 2% 미만
    warning: 0.05,   // 5% 경고
    critical: 0.10,  // 10% 심각
  },

  // 스트리밍 완료율
  streamingCompletionRate: {
    target: 0.95,    // 95% 이상
    warning: 0.85,   // 85% 경고
    critical: 0.70,  // 70% 심각
  },
};

// ============================================
// 10.9.2 로딩 메트릭 서비스
// ============================================

export class LoadingMetricsService {
  private metrics: LoadingMetric[] = [];

  record(metric: LoadingMetric): void {
    this.metrics.push(metric);

    // 버퍼가 차면 Analytics 서비스로 전송
    if (this.metrics.length >= 100) {
      this.flush();
    }
  }

  async flush(): Promise<void> {
    if (this.metrics.length === 0) return;

    const batch = [...this.metrics];
    this.metrics = [];

    // Analytics 서비스로 전송 (예: Mixpanel, Amplitude)
    await fetch('/api/analytics/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        events: batch.map(m => ({
          event: 'api_loading_metric',
          properties: m,
        })),
      }),
    });
  }

  calculatePercentiles(durations: number[]): {
    p50: number;
    p90: number;
    p99: number;
    mean: number;
  } {
    if (durations.length === 0) {
      return { p50: 0, p90: 0, p99: 0, mean: 0 };
    }

    const sorted = [...durations].sort((a, b) => a - b);
    const mean = sorted.reduce((a, b) => a + b, 0) / sorted.length;

    return {
      p50: sorted[Math.floor(sorted.length * 0.5)],
      p90: sorted[Math.floor(sorted.length * 0.9)],
      p99: sorted[Math.floor(sorted.length * 0.99)],
      mean,
    };
  }
}

export const loadingMetricsService = new LoadingMetricsService();

// ============================================
// 10.9.3 로딩 메트릭 미들웨어
// ============================================

export function withLoadingMetrics(handler: NextHandler): NextHandler {
  return async (req: NextRequest, context: NextContext) => {
    const startTime = Date.now();
    const userId = req.headers.get('x-user-id') || undefined;

    try {
      const response = await handler(req, context);

      loadingMetricsService.record({
        endpoint: new URL(req.url).pathname,
        method: req.method,
        duration: Date.now() - startTime,
        status: response.ok ? 'success' : 'error',
        timestamp: Date.now(),
        metadata: {
          userId,
          dataSize: parseInt(response.headers.get('content-length') || '0'),
          cacheHit: response.headers.get('x-cache') === 'HIT',
        },
      });

      return response;
    } catch (error) {
      loadingMetricsService.record({
        endpoint: new URL(req.url).pathname,
        method: req.method,
        duration: Date.now() - startTime,
        status: 'error',
        timestamp: Date.now(),
        metadata: { userId },
      });

      throw error;
    }
  };
}

// ============================================
// 10.9.4 로딩 대시보드 API
// ============================================

// GET /api/admin/loading-metrics
export async function GET(req: NextRequest) {
  const { isAdmin } = await validateAdminSession(req);
  if (!isAdmin) {
    return NextResponse.json(
      { error: { code: 'FORBIDDEN', message: 'Admin access required' } },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(req.url);
  const hours = parseInt(searchParams.get('hours') || '24');

  // 지정 시간 내 메트릭 조회
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);

  const metrics = await prisma.loadingMetric.groupBy({
    by: ['endpoint', 'method'],
    where: {
      timestamp: { gte: since },
    },
    _avg: { duration: true },
    _count: true,
    _min: { duration: true },
    _max: { duration: true },
  });

  // 상태별 통계
  const statusStats = await prisma.loadingMetric.groupBy({
    by: ['status'],
    where: {
      timestamp: { gte: since },
    },
    _count: true,
  });

  return NextResponse.json({
    success: true,
    data: {
      byEndpoint: metrics,
      byStatus: statusStats,
      targets: LOADING_METRICS_TARGETS,
      period: { hours, since },
    },
  });
}
```

### 10.10 Part 6.2: 장기 실행 작업 DB 스키마

```prisma
// prisma/schema.prisma (추가)

// ============================================
// 10.10.1 장기 실행 작업 모델
// ============================================

model LongRunningOperation {
  id          String   @id @default(uuid())
  type        String   // meeting_analysis, bulk_export, notion_sync 등
  userId      String
  status      String   @default("queued") // queued, processing, completed, failed, cancelled
  progress    Int      @default(0) // 0-100
  metadata    Json?    // 작업별 추가 데이터
  result      Json?    // 완료 시 결과
  error       Json?    // 실패 시 에러 정보
  createdAt   DateTime @default(now())
  startedAt   DateTime?
  completedAt DateTime?

  user        User     @relation(fields: [userId], references: [id])

  @@index([userId, status])
  @@index([createdAt])
  @@index([type, status])
}

// ============================================
// 10.10.2 로딩 메트릭 모델
// ============================================

model LoadingMetric {
  id          String   @id @default(uuid())
  endpoint    String
  method      String
  duration    Int      // 밀리초
  status      String   // success, error, cancelled, timeout
  timestamp   DateTime @default(now())
  userId      String?
  operationType String?
  dataSize    Int?     // bytes
  cacheHit    Boolean  @default(false)

  @@index([endpoint, timestamp])
  @@index([userId, timestamp])
  @@index([status, timestamp])
}

// ============================================
// 10.10.3 낙관적 UI 롤백 추적 모델
// ============================================

model OptimisticRollback {
  id          String   @id @default(uuid())
  userId      String
  action      String   // 원래 액션 (update_decision, confirm_action 등)
  entityType  String   // 엔티티 타입 (decision, action, meeting 등)
  entityId    String   // 엔티티 ID
  originalData Json    // 롤백된 원본 데이터
  attemptedData Json   // 시도했던 데이터
  errorCode   String   // 실패 사유
  errorMessage String
  rolledBackAt DateTime @default(now())

  @@index([userId, rolledBackAt])
  @@index([entityType, entityId])
  @@index([errorCode])
}
```

### 10.11 Part 6.3: 빈 상태 콘텐츠 API (Empty State Content)

```typescript
// src/app/api/empty-state/content/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

// ============================================
// 10.11.1 빈 상태 콘텐츠 타입 정의
// ============================================

type EmptyStateReason =
  | 'first_time'         // 첫 사용 - 데이터 생성 전
  | 'no_data'            // 조건 만족 데이터 없음
  | 'filtered_out'       // 필터링으로 인한 빈 결과
  | 'search_no_match'    // 검색 결과 없음
  | 'completed_all'      // 모든 항목 완료
  | 'temporal_gap'       // 특정 기간에 데이터 없음
  | 'permission_limited' // 권한 부족으로 접근 불가
  | 'feature_not_setup'; // 기능 미설정

type EmptyStateContext =
  | 'today_meetings'
  | 'past_meetings'
  | 'search_results'
  | 'decisions_list'
  | 'actions_list'
  | 'insights_list'
  | 'notifications'
  | 'integrations'
  | 'hud_idle'
  | 'filter_results';

type EmptyStateTone = 'neutral' | 'positive' | 'encouraging' | 'helpful';

interface EmptyStateAction {
  label: string;
  action: string; // navigate:/path, open:modal, reset:filters, oauth:provider
  variant: 'primary' | 'secondary' | 'text';
}

interface EmptyStateContent {
  context: EmptyStateContext;
  reason: EmptyStateReason;
  illustration: {
    type: 'icon' | 'illustration' | 'animation';
    asset: string;
    size: 'sm' | 'md' | 'lg';
  };
  title: string;
  description: string;
  tone: EmptyStateTone;
  actions: EmptyStateAction[];
  suggestions?: string[];
  metadata?: Record<string, unknown>;
}

// ============================================
// 10.11.2 빈 상태 콘텐츠 레지스트리
// ============================================

const EMPTY_STATE_REGISTRY: Record<string, EmptyStateContent> = {
  // Today 화면 - 첫 사용
  'today_meetings:first_time': {
    context: 'today_meetings',
    reason: 'first_time',
    illustration: { type: 'illustration', asset: 'welcome-calendar', size: 'lg' },
    title: 'Onno에 오신 것을 환영합니다!',
    description: '첫 미팅을 시작하면 AI가 자동으로 중요한 내용을 정리해드립니다.',
    tone: 'encouraging',
    actions: [
      { label: '캘린더 연결하기', action: 'oauth:google', variant: 'primary' },
      { label: '사용법 알아보기', action: 'open:onboarding', variant: 'secondary' },
    ],
    suggestions: ['Google 캘린더', 'Outlook 연동', '샘플 미팅 보기'],
  },

  // Today 화면 - 오늘 미팅 없음
  'today_meetings:no_data': {
    context: 'today_meetings',
    reason: 'no_data',
    illustration: { type: 'illustration', asset: 'relax-coffee', size: 'md' },
    title: '오늘은 미팅이 없습니다',
    description: '여유로운 하루 보내세요! 과거 미팅 기록을 확인하거나 새 미팅을 준비할 수 있습니다.',
    tone: 'positive',
    actions: [
      { label: '과거 미팅 보기', action: 'navigate:/past', variant: 'primary' },
    ],
    suggestions: ['지난주 미팅', '중요 결정 사항', '미완료 액션'],
  },

  // 검색 - 초기 상태
  'search_results:first_time': {
    context: 'search_results',
    reason: 'first_time',
    illustration: { type: 'icon', asset: 'search', size: 'md' },
    title: '미팅 기록을 검색해보세요',
    description: '"김철수 언급한 예산 논의" 같이 자연스러운 문장으로 검색할 수 있습니다.',
    tone: 'helpful',
    actions: [],
    suggestions: ['지난 분기 매출', '김철수 언급한 내용', 'Q4 목표'],
  },

  // 검색 - 결과 없음
  'search_results:search_no_match': {
    context: 'search_results',
    reason: 'search_no_match',
    illustration: { type: 'illustration', asset: 'no-results', size: 'md' },
    title: '검색 결과가 없습니다',
    description: '다른 키워드로 검색해보시거나, 필터를 조정해보세요.',
    tone: 'neutral',
    actions: [
      { label: '필터 초기화', action: 'reset:filters', variant: 'secondary' },
    ],
    suggestions: ['더 넓은 기간', '유사 키워드', '필터 해제'],
  },

  // 필터 결과 없음
  'filter_results:filtered_out': {
    context: 'filter_results',
    reason: 'filtered_out',
    illustration: { type: 'icon', asset: 'filter-x', size: 'sm' },
    title: '필터 조건에 맞는 결과가 없습니다',
    description: '필터 조건을 변경하거나 초기화해보세요.',
    tone: 'neutral',
    actions: [
      { label: '필터 초기화', action: 'reset:filters', variant: 'primary' },
    ],
  },

  // 결정 사항 - 없음
  'decisions_list:no_data': {
    context: 'decisions_list',
    reason: 'no_data',
    illustration: { type: 'icon', asset: 'clipboard-check', size: 'sm' },
    title: '이 미팅에서 도출된 결정 사항이 없습니다',
    description: 'AI가 명확한 결정 사항을 감지하지 못했습니다.',
    tone: 'neutral',
    actions: [],
  },

  // 액션 아이템 - 모두 완료
  'actions_list:completed_all': {
    context: 'actions_list',
    reason: 'completed_all',
    illustration: { type: 'illustration', asset: 'celebration', size: 'md' },
    title: '모든 액션을 완료했습니다! 🎉',
    description: '훌륭해요! 모든 할 일을 마쳤습니다.',
    tone: 'positive',
    actions: [
      { label: '완료된 항목 보기', action: 'open:completed', variant: 'text' },
    ],
  },

  // 통합 설정 - 연결된 서비스 없음
  'integrations:feature_not_setup': {
    context: 'integrations',
    reason: 'feature_not_setup',
    illustration: { type: 'illustration', asset: 'connect-services', size: 'lg' },
    title: '서비스를 연결해보세요',
    description: 'Notion, Salesforce 등과 연동하면 미팅 결과를 자동으로 정리할 수 있습니다.',
    tone: 'encouraging',
    actions: [
      { label: 'Notion 연결', action: 'oauth:notion', variant: 'primary' },
      { label: 'Salesforce 연결', action: 'oauth:salesforce', variant: 'secondary' },
    ],
  },

  // HUD - 대기 중
  'hud_idle:temporal_gap': {
    context: 'hud_idle',
    reason: 'temporal_gap',
    illustration: { type: 'animation', asset: 'waiting-pulse', size: 'sm' },
    title: '미팅 대기 중',
    description: '대화가 감지되면 자동으로 분석을 시작합니다.',
    tone: 'neutral',
    actions: [],
  },

  // 알림 - 없음
  'notifications:no_data': {
    context: 'notifications',
    reason: 'no_data',
    illustration: { type: 'icon', asset: 'bell-off', size: 'sm' },
    title: '새로운 알림이 없습니다',
    description: '모든 알림을 확인했습니다.',
    tone: 'neutral',
    actions: [],
  },
};

// ============================================
// 10.11.3 빈 상태 콘텐츠 요청 스키마
// ============================================

const getContentSchema = z.object({
  context: z.enum([
    'today_meetings', 'past_meetings', 'search_results',
    'decisions_list', 'actions_list', 'insights_list',
    'notifications', 'integrations', 'hud_idle', 'filter_results',
  ]),
  reason: z.enum([
    'first_time', 'no_data', 'filtered_out', 'search_no_match',
    'completed_all', 'temporal_gap', 'permission_limited', 'feature_not_setup',
  ]),
  locale: z.string().default('ko'),
  metadata: z.record(z.unknown()).optional(),
});

// ============================================
// 10.11.4 빈 상태 콘텐츠 API 엔드포인트
// ============================================

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const context = searchParams.get('context');
  const reason = searchParams.get('reason');

  const parsed = getContentSchema.safeParse({
    context,
    reason,
    locale: searchParams.get('locale') || 'ko',
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid parameters', details: parsed.error.errors },
      { status: 400 }
    );
  }

  const key = `${parsed.data.context}:${parsed.data.reason}`;
  const content = EMPTY_STATE_REGISTRY[key];

  if (!content) {
    // 기본 빈 상태 콘텐츠 반환
    return NextResponse.json({
      success: true,
      data: {
        context: parsed.data.context,
        reason: parsed.data.reason,
        illustration: { type: 'icon', asset: 'inbox', size: 'md' },
        title: '표시할 내용이 없습니다',
        description: '조건에 맞는 데이터가 없습니다.',
        tone: 'neutral' as EmptyStateTone,
        actions: [],
      },
    });
  }

  return NextResponse.json({
    success: true,
    data: content,
  });
}

// ============================================
// 10.11.5 빈 상태 콘텐츠 벌크 조회
// ============================================

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const contexts = z.array(z.object({
    context: z.string(),
    reason: z.string(),
  })).safeParse(body.contexts);

  if (!contexts.success) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }

  const results: Record<string, EmptyStateContent | null> = {};

  for (const item of contexts.data) {
    const key = `${item.context}:${item.reason}`;
    results[key] = EMPTY_STATE_REGISTRY[key] || null;
  }

  return NextResponse.json({
    success: true,
    data: results,
  });
}
```

### 10.12 Part 6.3: 첫 사용자 감지 서비스 (First-Time User Detection)

```typescript
// src/services/first-time-user.service.ts

import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';

// ============================================
// 10.12.1 첫 사용자 상태 타입
// ============================================

interface FirstTimeStatus {
  isFirstTime: boolean;
  hasCompletedOnboarding: boolean;
  hasConnectedCalendar: boolean;
  hasFirstMeeting: boolean;
  hasFirstDecision: boolean;
  hasConnectedIntegration: boolean;
  onboardingProgress: number; // 0-100
  createdAt: Date;
  lastActivityAt: Date | null;
}

interface FirstTimeCheckResult {
  context: string;
  isFirstTime: boolean;
  reason: string;
  suggestedContent?: {
    title: string;
    description: string;
    action: string;
  };
}

// ============================================
// 10.12.2 캐시 키 생성
// ============================================

function getFirstTimeStatusCacheKey(userId: string): string {
  return `first_time_status:${userId}`;
}

// ============================================
// 10.12.3 첫 사용자 상태 조회 함수
// ============================================

export async function getFirstTimeStatus(userId: string): Promise<FirstTimeStatus> {
  // 캐시 확인
  const cacheKey = getFirstTimeStatusCacheKey(userId);
  const cached = await redis.get(cacheKey);

  if (cached) {
    return JSON.parse(cached);
  }

  // 사용자 정보 조회
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      _count: {
        select: {
          meetings: true,
          decisions: true,
          integrations: true,
        },
      },
      onboarding: true,
      integrations: {
        where: { type: 'GOOGLE_CALENDAR' },
        take: 1,
      },
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const status: FirstTimeStatus = {
    isFirstTime: user._count.meetings === 0,
    hasCompletedOnboarding: user.onboarding?.completed || false,
    hasConnectedCalendar: user.integrations.length > 0,
    hasFirstMeeting: user._count.meetings > 0,
    hasFirstDecision: user._count.decisions > 0,
    hasConnectedIntegration: (await prisma.integration.count({
      where: { userId, type: { in: ['NOTION', 'SALESFORCE', 'SLACK'] } },
    })) > 0,
    onboardingProgress: calculateOnboardingProgress(user),
    createdAt: user.createdAt,
    lastActivityAt: user.lastActivityAt,
  };

  // 캐시에 저장 (5분)
  await redis.set(cacheKey, JSON.stringify(status), 'EX', 300);

  return status;
}

// ============================================
// 10.12.4 온보딩 진행률 계산
// ============================================

function calculateOnboardingProgress(user: any): number {
  let progress = 0;
  const steps = [
    { check: user.onboarding?.profileCompleted, weight: 20 },
    { check: user.integrations?.length > 0, weight: 25 },
    { check: user._count.meetings > 0, weight: 25 },
    { check: user._count.decisions > 0, weight: 15 },
    { check: user.onboarding?.tutorialCompleted, weight: 15 },
  ];

  for (const step of steps) {
    if (step.check) {
      progress += step.weight;
    }
  }

  return progress;
}

// ============================================
// 10.12.5 컨텍스트별 첫 사용자 확인
// ============================================

export async function checkFirstTimeForContext(
  userId: string,
  context: string
): Promise<FirstTimeCheckResult> {
  const status = await getFirstTimeStatus(userId);

  const contextChecks: Record<string, () => FirstTimeCheckResult> = {
    today_meetings: () => {
      if (!status.hasConnectedCalendar) {
        return {
          context,
          isFirstTime: true,
          reason: 'no_calendar_connected',
          suggestedContent: {
            title: '캘린더를 연결해주세요',
            description: 'Google 캘린더를 연결하면 미팅이 자동으로 표시됩니다.',
            action: 'oauth:google',
          },
        };
      }
      if (!status.hasFirstMeeting) {
        return {
          context,
          isFirstTime: true,
          reason: 'no_meetings_yet',
          suggestedContent: {
            title: '첫 미팅을 시작해보세요',
            description: '미팅을 시작하면 AI가 자동으로 내용을 정리합니다.',
            action: 'open:tutorial',
          },
        };
      }
      return { context, isFirstTime: false, reason: 'has_data' };
    },

    search_results: () => {
      if (!status.hasFirstMeeting) {
        return {
          context,
          isFirstTime: true,
          reason: 'no_meetings_to_search',
          suggestedContent: {
            title: '검색할 미팅이 없습니다',
            description: '미팅을 진행하면 여기서 검색할 수 있습니다.',
            action: 'navigate:/',
          },
        };
      }
      return { context, isFirstTime: false, reason: 'has_searchable_data' };
    },

    integrations: () => {
      if (!status.hasConnectedIntegration) {
        return {
          context,
          isFirstTime: true,
          reason: 'no_integrations',
          suggestedContent: {
            title: '서비스를 연결해보세요',
            description: 'Notion, Salesforce와 연동하여 생산성을 높이세요.',
            action: 'navigate:/settings/integrations',
          },
        };
      }
      return { context, isFirstTime: false, reason: 'has_integrations' };
    },

    hud: () => ({
      context,
      isFirstTime: !status.hasFirstMeeting,
      reason: status.hasFirstMeeting ? 'experienced_user' : 'first_hud_use',
    }),
  };

  const checker = contextChecks[context];
  if (!checker) {
    return { context, isFirstTime: false, reason: 'unknown_context' };
  }

  return checker();
}

// ============================================
// 10.12.6 첫 사용자 상태 무효화 (캐시)
// ============================================

export async function invalidateFirstTimeStatus(userId: string): Promise<void> {
  const cacheKey = getFirstTimeStatusCacheKey(userId);
  await redis.del(cacheKey);
}
```

```typescript
// src/app/api/user/first-time-status/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  getFirstTimeStatus,
  checkFirstTimeForContext,
} from '@/services/first-time-user.service';

// ============================================
// 10.12.7 첫 사용자 상태 API
// ============================================

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const context = searchParams.get('context');

  if (context) {
    // 특정 컨텍스트에 대한 첫 사용자 확인
    const result = await checkFirstTimeForContext(session.user.id, context);
    return NextResponse.json({ success: true, data: result });
  }

  // 전체 첫 사용자 상태 조회
  const status = await getFirstTimeStatus(session.user.id);
  return NextResponse.json({ success: true, data: status });
}
```

### 10.13 Part 6.3: 빈 상태 Analytics API

```typescript
// src/app/api/analytics/empty-state/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// ============================================
// 10.13.1 빈 상태 이벤트 타입
// ============================================

type EmptyStateEventType =
  | 'empty_state_shown'
  | 'empty_state_cta_clicked'
  | 'empty_state_dismissed'
  | 'empty_state_navigated'
  | 'empty_state_bounced'
  | 'first_time_onboarding_started'
  | 'first_time_onboarding_completed'
  | 'search_suggestion_clicked'
  | 'filter_reset_clicked';

// ============================================
// 10.13.2 이벤트 로깅 스키마
// ============================================

const emptyStateEventSchema = z.object({
  eventType: z.enum([
    'empty_state_shown',
    'empty_state_cta_clicked',
    'empty_state_dismissed',
    'empty_state_navigated',
    'empty_state_bounced',
    'first_time_onboarding_started',
    'first_time_onboarding_completed',
    'search_suggestion_clicked',
    'filter_reset_clicked',
  ]),
  context: z.string(),
  reason: z.string(),
  action: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
  sessionId: z.string().optional(),
  dwellTimeMs: z.number().optional(),
});

// ============================================
// 10.13.3 빈 상태 이벤트 로깅 API
// ============================================

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = emptyStateEventSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid event data', details: parsed.error.errors },
      { status: 400 }
    );
  }

  const event = await prisma.emptyStateEvent.create({
    data: {
      userId: session.user.id,
      eventType: parsed.data.eventType,
      context: parsed.data.context,
      reason: parsed.data.reason,
      action: parsed.data.action,
      metadata: parsed.data.metadata || {},
      sessionId: parsed.data.sessionId,
      dwellTimeMs: parsed.data.dwellTimeMs,
    },
  });

  return NextResponse.json({ success: true, data: { id: event.id } });
}

// ============================================
// 10.13.4 빈 상태 메트릭 조회 API
// ============================================

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const hours = parseInt(searchParams.get('hours') || '24', 10);
  const context = searchParams.get('context');

  const since = new Date(Date.now() - hours * 60 * 60 * 1000);

  // 컨텍스트별 통계
  const contextStats = await prisma.emptyStateEvent.groupBy({
    by: ['context', 'eventType'],
    where: {
      timestamp: { gte: since },
      ...(context ? { context } : {}),
    },
    _count: true,
  });

  // CTA 클릭률 계산
  const shownEvents = await prisma.emptyStateEvent.count({
    where: {
      eventType: 'empty_state_shown',
      timestamp: { gte: since },
      ...(context ? { context } : {}),
    },
  });

  const ctaClickedEvents = await prisma.emptyStateEvent.count({
    where: {
      eventType: 'empty_state_cta_clicked',
      timestamp: { gte: since },
      ...(context ? { context } : {}),
    },
  });

  const bouncedEvents = await prisma.emptyStateEvent.count({
    where: {
      eventType: 'empty_state_bounced',
      timestamp: { gte: since },
      ...(context ? { context } : {}),
    },
  });

  const navigatedEvents = await prisma.emptyStateEvent.count({
    where: {
      eventType: 'empty_state_navigated',
      timestamp: { gte: since },
      ...(context ? { context } : {}),
    },
  });

  // 평균 체류 시간
  const avgDwellTime = await prisma.emptyStateEvent.aggregate({
    where: {
      eventType: 'empty_state_dismissed',
      timestamp: { gte: since },
      dwellTimeMs: { not: null },
      ...(context ? { context } : {}),
    },
    _avg: { dwellTimeMs: true },
  });

  // 온보딩 완료율
  const onboardingStarted = await prisma.emptyStateEvent.count({
    where: {
      eventType: 'first_time_onboarding_started',
      timestamp: { gte: since },
    },
  });

  const onboardingCompleted = await prisma.emptyStateEvent.count({
    where: {
      eventType: 'first_time_onboarding_completed',
      timestamp: { gte: since },
    },
  });

  // 메트릭 계산
  const metrics = {
    conversionRate: shownEvents > 0 ? (ctaClickedEvents / shownEvents) * 100 : 0,
    bounceRate: shownEvents > 0 ? (bouncedEvents / shownEvents) * 100 : 0,
    explorationRate: shownEvents > 0 ? (navigatedEvents / shownEvents) * 100 : 0,
    averageDwellTimeMs: avgDwellTime._avg.dwellTimeMs || 0,
    onboardingCompletionRate: onboardingStarted > 0
      ? (onboardingCompleted / onboardingStarted) * 100
      : 0,
  };

  // 목표 대비 성과
  const targets = {
    conversionRate: { target: 30, current: metrics.conversionRate, met: metrics.conversionRate >= 30 },
    bounceRate: { target: 20, current: metrics.bounceRate, met: metrics.bounceRate <= 20 },
    explorationRate: { target: 50, current: metrics.explorationRate, met: metrics.explorationRate >= 50 },
    onboardingCompletionRate: { target: 60, current: metrics.onboardingCompletionRate, met: metrics.onboardingCompletionRate >= 60 },
  };

  return NextResponse.json({
    success: true,
    data: {
      byContext: contextStats,
      metrics,
      targets,
      period: { hours, since },
      totals: {
        shown: shownEvents,
        ctaClicked: ctaClickedEvents,
        bounced: bouncedEvents,
        navigated: navigatedEvents,
      },
    },
  });
}
```

```typescript
// src/app/api/analytics/empty-state/by-context/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// ============================================
// 10.13.5 컨텍스트별 빈 상태 상세 메트릭
// ============================================

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const hours = parseInt(searchParams.get('hours') || '24', 10);
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);

  // 컨텍스트별 이벤트 집계
  const contexts = [
    'today_meetings', 'past_meetings', 'search_results',
    'decisions_list', 'actions_list', 'insights_list',
    'notifications', 'integrations', 'hud_idle', 'filter_results',
  ];

  const contextMetrics = await Promise.all(
    contexts.map(async (context) => {
      const [shown, ctaClicked, bounced, navigated] = await Promise.all([
        prisma.emptyStateEvent.count({
          where: { context, eventType: 'empty_state_shown', timestamp: { gte: since } },
        }),
        prisma.emptyStateEvent.count({
          where: { context, eventType: 'empty_state_cta_clicked', timestamp: { gte: since } },
        }),
        prisma.emptyStateEvent.count({
          where: { context, eventType: 'empty_state_bounced', timestamp: { gte: since } },
        }),
        prisma.emptyStateEvent.count({
          where: { context, eventType: 'empty_state_navigated', timestamp: { gte: since } },
        }),
      ]);

      return {
        context,
        shown,
        ctaClicked,
        bounced,
        navigated,
        conversionRate: shown > 0 ? ((ctaClicked / shown) * 100).toFixed(1) : '0.0',
        bounceRate: shown > 0 ? ((bounced / shown) * 100).toFixed(1) : '0.0',
      };
    })
  );

  // 성과 순위
  const ranked = [...contextMetrics]
    .filter((m) => m.shown > 0)
    .sort((a, b) => parseFloat(b.conversionRate) - parseFloat(a.conversionRate));

  return NextResponse.json({
    success: true,
    data: {
      contexts: contextMetrics,
      topPerforming: ranked.slice(0, 3),
      needsImprovement: ranked.slice(-3).reverse(),
      period: { hours, since },
    },
  });
}
```

### 10.14 Part 6.3: 빈 상태 DB 스키마

```prisma
// prisma/schema.prisma (추가)

// ============================================
// 10.14.1 빈 상태 이벤트 모델
// ============================================

model EmptyStateEvent {
  id          String   @id @default(uuid())
  userId      String
  eventType   String   // empty_state_shown, cta_clicked, dismissed, navigated, bounced 등
  context     String   // today_meetings, search_results, decisions_list 등
  reason      String   // first_time, no_data, filtered_out, search_no_match 등
  action      String?  // 클릭된 CTA 액션 (navigate:/, oauth:google 등)
  metadata    Json?    // 추가 메타데이터
  sessionId   String?  // 세션 ID (동일 세션 추적용)
  dwellTimeMs Int?     // 체류 시간 (밀리초)
  timestamp   DateTime @default(now())

  user        User     @relation(fields: [userId], references: [id])

  @@index([userId, timestamp])
  @@index([context, timestamp])
  @@index([eventType, timestamp])
  @@index([reason, timestamp])
  @@index([sessionId])
}

// ============================================
// 10.14.2 사용자 온보딩 상태 모델
// ============================================

model UserOnboarding {
  id                String   @id @default(uuid())
  userId            String   @unique
  completed         Boolean  @default(false)
  profileCompleted  Boolean  @default(false)
  tutorialCompleted Boolean  @default(false)
  calendarConnected Boolean  @default(false)
  firstMeetingDone  Boolean  @default(false)
  integrationsDone  Boolean  @default(false)
  progress          Int      @default(0) // 0-100
  startedAt         DateTime @default(now())
  completedAt       DateTime?
  skippedAt         DateTime?
  lastStepAt        DateTime?
  currentStep       String?  // 현재 온보딩 단계

  user              User     @relation(fields: [userId], references: [id])

  @@index([userId])
  @@index([completed])
}

// ============================================
// 10.14.3 첫 사용자 마일스톤 모델
// ============================================

model FirstTimeMilestone {
  id          String   @id @default(uuid())
  userId      String
  milestone   String   // first_meeting, first_decision, first_integration 등
  achievedAt  DateTime @default(now())
  metadata    Json?    // 마일스톤별 추가 정보

  user        User     @relation(fields: [userId], references: [id])

  @@unique([userId, milestone])
  @@index([userId])
  @@index([milestone])
}

// ============================================
// 10.14.4 빈 상태 A/B 테스트 배정 모델
// ============================================

model EmptyStateExperiment {
  id            String   @id @default(uuid())
  userId        String
  experimentId  String   // 실험 ID (empty_state_cta_v2 등)
  variant       String   // control, variant_a, variant_b 등
  context       String   // 적용 컨텍스트
  assignedAt    DateTime @default(now())
  convertedAt   DateTime?
  converted     Boolean  @default(false)
  metadata      Json?

  user          User     @relation(fields: [userId], references: [id])

  @@unique([userId, experimentId, context])
  @@index([experimentId, variant])
  @@index([userId])
}
```

```typescript
// src/lib/empty-state-experiment.ts

import { prisma } from '@/lib/prisma';

// ============================================
// 10.14.5 A/B 테스트 배정 서비스
// ============================================

interface ExperimentConfig {
  id: string;
  variants: string[];
  weights: number[]; // 각 variant 비율 (합계 = 1)
  contexts: string[];
}

const ACTIVE_EXPERIMENTS: ExperimentConfig[] = [
  {
    id: 'empty_state_cta_style_v1',
    variants: ['control', 'variant_a', 'variant_b'],
    weights: [0.34, 0.33, 0.33],
    contexts: ['today_meetings', 'search_results', 'integrations'],
  },
  {
    id: 'empty_state_illustration_v1',
    variants: ['icon', 'illustration'],
    weights: [0.5, 0.5],
    contexts: ['today_meetings', 'integrations'],
  },
];

export async function getExperimentVariant(
  userId: string,
  experimentId: string,
  context: string
): Promise<string | null> {
  const config = ACTIVE_EXPERIMENTS.find((e) => e.id === experimentId);
  if (!config || !config.contexts.includes(context)) {
    return null;
  }

  // 기존 배정 확인
  const existing = await prisma.emptyStateExperiment.findUnique({
    where: {
      userId_experimentId_context: { userId, experimentId, context },
    },
  });

  if (existing) {
    return existing.variant;
  }

  // 새 배정 (가중치 기반 랜덤)
  const random = Math.random();
  let cumulative = 0;
  let variant = config.variants[0];

  for (let i = 0; i < config.variants.length; i++) {
    cumulative += config.weights[i];
    if (random <= cumulative) {
      variant = config.variants[i];
      break;
    }
  }

  // 배정 저장
  await prisma.emptyStateExperiment.create({
    data: {
      userId,
      experimentId,
      variant,
      context,
    },
  });

  return variant;
}

export async function recordExperimentConversion(
  userId: string,
  experimentId: string,
  context: string
): Promise<void> {
  await prisma.emptyStateExperiment.updateMany({
    where: {
      userId,
      experimentId,
      context,
      converted: false,
    },
    data: {
      converted: true,
      convertedAt: new Date(),
    },
  });
}
```

---

### 10.15 Part 6.4: 접근성 설정 API (Accessibility Settings)

```typescript
// src/types/accessibility.ts

// 10.15.1 접근성 설정 타입 정의
export type AccessibilityFeature =
  | 'screen_reader'
  | 'keyboard_nav'
  | 'focus_management'
  | 'color_contrast'
  | 'reduced_motion'
  | 'text_scaling'
  | 'high_contrast'
  | 'skip_link'
  | 'aria_live';

export interface AccessibilitySettings {
  id: string;
  userId: string;

  // 모션 설정
  reduceMotion: boolean;
  reduceTransparency: boolean;

  // 시각 설정
  highContrast: boolean;
  largeText: boolean;
  textScaleFactor: number; // 1.0 - 2.0

  // 포커스 설정
  showFocusOutline: boolean;
  focusOutlineWidth: 'normal' | 'thick';

  // 스크린 리더 설정
  verboseMode: boolean;
  announceStatusChanges: boolean;

  // 키보드 설정
  keyboardShortcutsEnabled: boolean;
  customShortcuts: Record<string, string>;
  stickyKeys: boolean;

  // 메타데이터
  createdAt: Date;
  updatedAt: Date;
}

// 10.15.2 키보드 단축키 설정 타입
export type ShortcutScope =
  | 'global'
  | 'today'
  | 'hud'
  | 'search'
  | 'modal'
  | 'settings';

export interface KeyboardShortcut {
  id: string;
  action: string;
  key: string;
  modifiers: ('ctrl' | 'alt' | 'shift' | 'meta')[];
  scope: ShortcutScope;
  description: string;
  isCustom: boolean;
  isEnabled: boolean;
}

export interface UserShortcutOverride {
  id: string;
  userId: string;
  shortcutId: string;
  customKey: string;
  customModifiers: string[];
  isEnabled: boolean;
  createdAt: Date;
}
```

```typescript
// src/app/api/accessibility/settings/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// 10.15.3 접근성 설정 스키마
const accessibilitySettingsSchema = z.object({
  reduceMotion: z.boolean().optional(),
  reduceTransparency: z.boolean().optional(),
  highContrast: z.boolean().optional(),
  largeText: z.boolean().optional(),
  textScaleFactor: z.number().min(1.0).max(2.0).optional(),
  showFocusOutline: z.boolean().optional(),
  focusOutlineWidth: z.enum(['normal', 'thick']).optional(),
  verboseMode: z.boolean().optional(),
  announceStatusChanges: z.boolean().optional(),
  keyboardShortcutsEnabled: z.boolean().optional(),
  customShortcuts: z.record(z.string()).optional(),
  stickyKeys: z.boolean().optional(),
});

// 10.15.4 접근성 설정 조회 API
export async function GET(req: NextRequest) {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    let settings = await prisma.accessibilitySettings.findUnique({
      where: { userId: session.user.id },
    });

    // 설정이 없으면 기본값 생성
    if (!settings) {
      settings = await prisma.accessibilitySettings.create({
        data: {
          userId: session.user.id,
          reduceMotion: false,
          reduceTransparency: false,
          highContrast: false,
          largeText: false,
          textScaleFactor: 1.0,
          showFocusOutline: true,
          focusOutlineWidth: 'normal',
          verboseMode: false,
          announceStatusChanges: true,
          keyboardShortcutsEnabled: true,
          customShortcuts: {},
          stickyKeys: false,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error('Failed to fetch accessibility settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// 10.15.5 접근성 설정 업데이트 API
export async function PATCH(req: NextRequest) {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const validated = accessibilitySettingsSchema.parse(body);

    const settings = await prisma.accessibilitySettings.upsert({
      where: { userId: session.user.id },
      update: {
        ...validated,
        updatedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        reduceMotion: validated.reduceMotion ?? false,
        reduceTransparency: validated.reduceTransparency ?? false,
        highContrast: validated.highContrast ?? false,
        largeText: validated.largeText ?? false,
        textScaleFactor: validated.textScaleFactor ?? 1.0,
        showFocusOutline: validated.showFocusOutline ?? true,
        focusOutlineWidth: validated.focusOutlineWidth ?? 'normal',
        verboseMode: validated.verboseMode ?? false,
        announceStatusChanges: validated.announceStatusChanges ?? true,
        keyboardShortcutsEnabled: validated.keyboardShortcutsEnabled ?? true,
        customShortcuts: validated.customShortcuts ?? {},
        stickyKeys: validated.stickyKeys ?? false,
      },
    });

    // 접근성 설정 변경 이벤트 기록
    await prisma.accessibilityEvent.create({
      data: {
        userId: session.user.id,
        eventType: 'setting_changed',
        properties: {
          changedFields: Object.keys(validated),
          newValues: validated,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Failed to update accessibility settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
```

```typescript
// src/app/api/accessibility/shortcuts/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

// 10.15.6 기본 키보드 단축키 정의
const DEFAULT_SHORTCUTS: KeyboardShortcut[] = [
  // Global
  { id: 'global_search', action: 'openSearch', key: 'k', modifiers: ['ctrl'], scope: 'global', description: '검색 열기', isCustom: false, isEnabled: true },
  { id: 'global_home', action: 'goToToday', key: 'h', modifiers: ['ctrl', 'shift'], scope: 'global', description: 'Today로 이동', isCustom: false, isEnabled: true },
  { id: 'global_settings', action: 'openSettings', key: ',', modifiers: ['ctrl'], scope: 'global', description: '설정 열기', isCustom: false, isEnabled: true },
  { id: 'global_help', action: 'showHelp', key: '?', modifiers: ['shift'], scope: 'global', description: '도움말', isCustom: false, isEnabled: true },

  // Today
  { id: 'today_next', action: 'nextCard', key: 'j', modifiers: [], scope: 'today', description: '다음 카드', isCustom: false, isEnabled: true },
  { id: 'today_prev', action: 'prevCard', key: 'k', modifiers: [], scope: 'today', description: '이전 카드', isCustom: false, isEnabled: true },
  { id: 'today_enter', action: 'enterMeeting', key: 'Enter', modifiers: [], scope: 'today', description: '미팅 입장', isCustom: false, isEnabled: true },
  { id: 'today_refresh', action: 'refreshCards', key: 'r', modifiers: [], scope: 'today', description: '새로고침', isCustom: false, isEnabled: true },

  // HUD
  { id: 'hud_toggle', action: 'toggleHUD', key: 'Escape', modifiers: [], scope: 'hud', description: 'HUD 최소화', isCustom: false, isEnabled: true },
  { id: 'hud_save', action: 'saveNote', key: 's', modifiers: ['ctrl'], scope: 'hud', description: '노트 저장', isCustom: false, isEnabled: true },
  { id: 'hud_capture', action: 'captureDecision', key: 'd', modifiers: ['ctrl'], scope: 'hud', description: '결정 캡처', isCustom: false, isEnabled: true },
  { id: 'hud_navigate', action: 'navigateSections', key: 'Tab', modifiers: [], scope: 'hud', description: '섹션 이동', isCustom: false, isEnabled: true },

  // Search
  { id: 'search_close', action: 'closeSearch', key: 'Escape', modifiers: [], scope: 'search', description: '검색 닫기', isCustom: false, isEnabled: true },
  { id: 'search_next', action: 'nextResult', key: 'ArrowDown', modifiers: [], scope: 'search', description: '다음 결과', isCustom: false, isEnabled: true },
  { id: 'search_prev', action: 'prevResult', key: 'ArrowUp', modifiers: [], scope: 'search', description: '이전 결과', isCustom: false, isEnabled: true },
  { id: 'search_select', action: 'selectResult', key: 'Enter', modifiers: [], scope: 'search', description: '결과 선택', isCustom: false, isEnabled: true },

  // Modal
  { id: 'modal_close', action: 'closeModal', key: 'Escape', modifiers: [], scope: 'modal', description: '모달 닫기', isCustom: false, isEnabled: true },
  { id: 'modal_confirm', action: 'confirmModal', key: 'Enter', modifiers: ['ctrl'], scope: 'modal', description: '확인', isCustom: false, isEnabled: true },
];

// 10.15.7 키보드 단축키 조회 API
export async function GET(req: NextRequest) {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    // 사용자 커스텀 단축키 오버라이드 조회
    const overrides = await prisma.userShortcutOverride.findMany({
      where: { userId: session.user.id },
    });

    const overrideMap = new Map(
      overrides.map(o => [o.shortcutId, o])
    );

    // 기본 단축키와 오버라이드 병합
    const shortcuts = DEFAULT_SHORTCUTS.map(shortcut => {
      const override = overrideMap.get(shortcut.id);
      if (override) {
        return {
          ...shortcut,
          key: override.customKey || shortcut.key,
          modifiers: override.customModifiers || shortcut.modifiers,
          isEnabled: override.isEnabled,
          isCustom: true,
        };
      }
      return shortcut;
    });

    return NextResponse.json({
      success: true,
      data: {
        shortcuts,
        scopes: ['global', 'today', 'hud', 'search', 'modal', 'settings'],
      },
    });
  } catch (error) {
    console.error('Failed to fetch shortcuts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shortcuts' },
      { status: 500 }
    );
  }
}

// 10.15.8 키보드 단축키 커스터마이즈 API
export async function PUT(req: NextRequest) {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { shortcutId, customKey, customModifiers, isEnabled } = await req.json();

    // 단축키 충돌 검사
    const existingOverrides = await prisma.userShortcutOverride.findMany({
      where: { userId: session.user.id },
    });

    const conflicts = existingOverrides.filter(o =>
      o.shortcutId !== shortcutId &&
      o.customKey === customKey &&
      JSON.stringify(o.customModifiers) === JSON.stringify(customModifiers) &&
      o.isEnabled
    );

    if (conflicts.length > 0) {
      return NextResponse.json(
        {
          error: 'Shortcut conflict',
          conflictWith: conflicts[0].shortcutId
        },
        { status: 409 }
      );
    }

    const override = await prisma.userShortcutOverride.upsert({
      where: {
        userId_shortcutId: {
          userId: session.user.id,
          shortcutId,
        },
      },
      update: {
        customKey,
        customModifiers,
        isEnabled,
      },
      create: {
        userId: session.user.id,
        shortcutId,
        customKey,
        customModifiers,
        isEnabled,
      },
    });

    // 단축키 변경 이벤트 기록
    await prisma.accessibilityEvent.create({
      data: {
        userId: session.user.id,
        eventType: 'shortcut_customized',
        properties: {
          shortcutId,
          customKey,
          customModifiers,
          isEnabled,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: override,
    });
  } catch (error) {
    console.error('Failed to update shortcut:', error);
    return NextResponse.json(
      { error: 'Failed to update shortcut' },
      { status: 500 }
    );
  }
}

// 10.15.9 단축키 초기화 API
export async function DELETE(req: NextRequest) {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const shortcutId = searchParams.get('shortcutId');

    if (shortcutId) {
      // 특정 단축키 초기화
      await prisma.userShortcutOverride.delete({
        where: {
          userId_shortcutId: {
            userId: session.user.id,
            shortcutId,
          },
        },
      });
    } else {
      // 모든 단축키 초기화
      await prisma.userShortcutOverride.deleteMany({
        where: { userId: session.user.id },
      });
    }

    return NextResponse.json({
      success: true,
      message: shortcutId
        ? 'Shortcut reset to default'
        : 'All shortcuts reset to defaults',
    });
  } catch (error) {
    console.error('Failed to reset shortcuts:', error);
    return NextResponse.json(
      { error: 'Failed to reset shortcuts' },
      { status: 500 }
    );
  }
}
```

### 10.16 Part 6.4: 접근성 Analytics API

```typescript
// src/types/accessibility-analytics.ts

// 10.16.1 접근성 이벤트 타입
export type AccessibilityEventType =
  | 'keyboard_shortcut_used'
  | 'screen_reader_detected'
  | 'focus_trap_entered'
  | 'focus_trap_exited'
  | 'skip_link_used'
  | 'setting_changed'
  | 'shortcut_customized'
  | 'reduced_motion_activated'
  | 'high_contrast_activated'
  | 'aria_live_announced'
  | 'text_scaling_changed'
  | 'focus_indicator_shown'
  | 'accessibility_issue_reported'
  | 'keyboard_navigation_pattern';

export interface AccessibilityEventProperties {
  // keyboard_shortcut_used
  shortcutKey?: string;
  modifiers?: string[];
  action?: string;
  scope?: string;
  success?: boolean;
  responseTimeMs?: number;

  // screen_reader_detected
  screenReaderType?: 'nvda' | 'jaws' | 'voiceover' | 'talkback' | 'unknown';
  detectionMethod?: 'aria-live' | 'focus-event' | 'user-agent' | 'manual';
  browserInfo?: string;

  // focus_trap
  trapContainerId?: string;
  trapType?: 'modal' | 'dropdown' | 'panel' | 'tooltip';
  timeInTrapMs?: number;
  tabCycleCount?: number;
  focusReturnedCorrectly?: boolean;

  // skip_link
  skipLinkType?: 'main' | 'nav' | 'search' | 'footer';
  targetId?: string;
  timeSavedMs?: number;

  // setting_changed
  changedFields?: string[];
  newValues?: Record<string, unknown>;
  previousValues?: Record<string, unknown>;

  // reduced_motion / high_contrast
  source?: 'user_preference' | 'system_preference';
  enabled?: boolean;

  // text_scaling
  scaleFactor?: number;
  previousScaleFactor?: number;

  // accessibility_issue
  issueType?: string;
  description?: string;
  affectedElement?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';

  // keyboard_navigation
  navigationPath?: string[];
  elementsVisited?: number;
  backtrackCount?: number;
  taskCompleted?: boolean;
  taskDurationMs?: number;

  // common
  screen?: string;
  component?: string;
}
```

```typescript
// src/app/api/accessibility/analytics/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// 10.16.2 이벤트 로깅 스키마
const accessibilityEventSchema = z.object({
  eventType: z.enum([
    'keyboard_shortcut_used',
    'screen_reader_detected',
    'focus_trap_entered',
    'focus_trap_exited',
    'skip_link_used',
    'setting_changed',
    'shortcut_customized',
    'reduced_motion_activated',
    'high_contrast_activated',
    'aria_live_announced',
    'text_scaling_changed',
    'focus_indicator_shown',
    'accessibility_issue_reported',
    'keyboard_navigation_pattern',
  ]),
  properties: z.record(z.unknown()),
  timestamp: z.string().datetime().optional(),
  sessionId: z.string().optional(),
});

// 10.16.3 접근성 이벤트 로깅 API
export async function POST(req: NextRequest) {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();

    // 배치 이벤트 지원
    const events = Array.isArray(body) ? body : [body];
    const validatedEvents = events.map(e => accessibilityEventSchema.parse(e));

    const created = await prisma.accessibilityEvent.createMany({
      data: validatedEvents.map(event => ({
        userId: session.user.id,
        eventType: event.eventType,
        properties: event.properties,
        sessionId: event.sessionId,
        createdAt: event.timestamp ? new Date(event.timestamp) : new Date(),
      })),
    });

    return NextResponse.json({
      success: true,
      data: { count: created.count },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Failed to log accessibility event:', error);
    return NextResponse.json(
      { error: 'Failed to log event' },
      { status: 500 }
    );
  }
}

// 10.16.4 접근성 메트릭 조회 API
export async function GET(req: NextRequest) {
  const session = await getServerSession();

  if (!session?.user?.id) {
    // 관리자만 전체 통계 조회 가능
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get('days') || '30');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // 집계 쿼리
    const [
      totalEvents,
      eventsByType,
      shortcutUsage,
      accessibilityFeatureUsage,
      screenReaderUsers,
      wcagIssues,
    ] = await Promise.all([
      // 총 이벤트 수
      prisma.accessibilityEvent.count({
        where: { createdAt: { gte: startDate } },
      }),

      // 이벤트 타입별 집계
      prisma.accessibilityEvent.groupBy({
        by: ['eventType'],
        where: { createdAt: { gte: startDate } },
        _count: true,
      }),

      // 키보드 단축키 사용 통계
      prisma.accessibilityEvent.findMany({
        where: {
          eventType: 'keyboard_shortcut_used',
          createdAt: { gte: startDate },
        },
        select: { properties: true },
      }),

      // 접근성 기능 사용자 수
      prisma.accessibilitySettings.groupBy({
        by: ['reduceMotion', 'highContrast', 'largeText'],
        _count: true,
      }),

      // 스크린 리더 사용자 수
      prisma.accessibilityEvent.findMany({
        where: {
          eventType: 'screen_reader_detected',
          createdAt: { gte: startDate },
        },
        distinct: ['userId'],
      }),

      // 접근성 이슈 리포트
      prisma.accessibilityEvent.findMany({
        where: {
          eventType: 'accessibility_issue_reported',
          createdAt: { gte: startDate },
        },
        select: { properties: true },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
    ]);

    // 키보드 단축키 사용률 계산
    const shortcutStats = shortcutUsage.reduce((acc, event) => {
      const props = event.properties as { action?: string; success?: boolean };
      const action = props.action || 'unknown';
      if (!acc[action]) {
        acc[action] = { total: 0, success: 0 };
      }
      acc[action].total++;
      if (props.success) acc[action].success++;
      return acc;
    }, {} as Record<string, { total: number; success: number }>);

    return NextResponse.json({
      success: true,
      data: {
        period: { days, startDate, endDate: new Date() },
        overview: {
          totalEvents,
          uniqueScreenReaderUsers: screenReaderUsers.length,
          wcagIssuesReported: wcagIssues.length,
        },
        eventsByType: eventsByType.map(e => ({
          type: e.eventType,
          count: e._count,
        })),
        shortcutUsage: Object.entries(shortcutStats).map(([action, stats]) => ({
          action,
          total: stats.total,
          successRate: stats.total > 0
            ? (stats.success / stats.total * 100).toFixed(1)
            : 0,
        })),
        accessibilityFeatureUsage: accessibilityFeatureUsage.map(g => ({
          reduceMotion: g.reduceMotion,
          highContrast: g.highContrast,
          largeText: g.largeText,
          count: g._count,
        })),
        recentIssues: wcagIssues.map(i => i.properties),
      },
    });
  } catch (error) {
    console.error('Failed to fetch accessibility metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}
```

```typescript
// src/app/api/accessibility/audit/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

// 10.16.5 접근성 감사 결과 저장/조회 API
interface AuditResult {
  id: string;
  url: string;
  wcagLevel: 'A' | 'AA' | 'AAA';
  timestamp: string;
  results: {
    violations: AuditViolation[];
    passes: number;
    incomplete: number;
    inapplicable: number;
  };
  score: number;
}

interface AuditViolation {
  id: string;
  impact: 'minor' | 'moderate' | 'serious' | 'critical';
  description: string;
  helpUrl: string;
  nodes: {
    html: string;
    target: string[];
    failureSummary: string;
  }[];
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const auditResult = await req.json() as AuditResult;

    const saved = await prisma.accessibilityAudit.create({
      data: {
        userId: session.user.id,
        url: auditResult.url,
        wcagLevel: auditResult.wcagLevel,
        score: auditResult.score,
        violationCount: auditResult.results.violations.length,
        passCount: auditResult.results.passes,
        incompleteCount: auditResult.results.incomplete,
        results: auditResult.results as object,
      },
    });

    // 심각한 위반 사항은 별도 알림
    const criticalViolations = auditResult.results.violations.filter(
      v => v.impact === 'critical'
    );

    if (criticalViolations.length > 0) {
      await prisma.accessibilityEvent.create({
        data: {
          userId: session.user.id,
          eventType: 'accessibility_issue_reported',
          properties: {
            source: 'automated_audit',
            url: auditResult.url,
            criticalViolationCount: criticalViolations.length,
            violations: criticalViolations.map(v => ({
              id: v.id,
              description: v.description,
              nodeCount: v.nodes.length,
            })),
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: saved.id,
        score: saved.score,
        violationCount: saved.violationCount,
        criticalViolations: criticalViolations.length,
      },
    });
  } catch (error) {
    console.error('Failed to save audit result:', error);
    return NextResponse.json(
      { error: 'Failed to save audit' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const url = searchParams.get('url');

    const audits = await prisma.accessibilityAudit.findMany({
      where: {
        ...(url && { url }),
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        url: true,
        wcagLevel: true,
        score: true,
        violationCount: true,
        passCount: true,
        incompleteCount: true,
        createdAt: true,
      },
    });

    // 스코어 트렌드 계산
    const scoreHistory = await prisma.accessibilityAudit.groupBy({
      by: ['createdAt'],
      _avg: { score: true },
      orderBy: { createdAt: 'asc' },
      take: 30,
    });

    return NextResponse.json({
      success: true,
      data: {
        audits,
        trend: scoreHistory.map(h => ({
          date: h.createdAt,
          avgScore: h._avg.score,
        })),
        summary: {
          latestScore: audits[0]?.score || 0,
          totalAudits: audits.length,
          avgViolations: audits.reduce((sum, a) => sum + a.violationCount, 0) / audits.length || 0,
        },
      },
    });
  } catch (error) {
    console.error('Failed to fetch audits:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audits' },
      { status: 500 }
    );
  }
}
```

### 10.17 Part 6.4: 접근성 DB 스키마

```prisma
// prisma/schema.prisma (Part 6.4 접근성 추가)

// 10.17.1 접근성 설정 모델
model AccessibilitySettings {
  id                      String   @id @default(cuid())
  userId                  String   @unique
  user                    User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  // 모션 설정
  reduceMotion            Boolean  @default(false)
  reduceTransparency      Boolean  @default(false)

  // 시각 설정
  highContrast            Boolean  @default(false)
  largeText               Boolean  @default(false)
  textScaleFactor         Float    @default(1.0)

  // 포커스 설정
  showFocusOutline        Boolean  @default(true)
  focusOutlineWidth       String   @default("normal") // normal | thick

  // 스크린 리더 설정
  verboseMode             Boolean  @default(false)
  announceStatusChanges   Boolean  @default(true)

  // 키보드 설정
  keyboardShortcutsEnabled Boolean @default(true)
  customShortcuts         Json     @default("{}")
  stickyKeys              Boolean  @default(false)

  createdAt               DateTime @default(now())
  updatedAt               DateTime @updatedAt

  @@map("accessibility_settings")
}

// 10.17.2 사용자 단축키 오버라이드 모델
model UserShortcutOverride {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  shortcutId      String
  customKey       String?
  customModifiers Json     @default("[]")
  isEnabled       Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@unique([userId, shortcutId])
  @@index([userId])
  @@map("user_shortcut_overrides")
}

// 10.17.3 접근성 이벤트 모델
model AccessibilityEvent {
  id         String   @id @default(cuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  eventType  String
  properties Json     @default("{}")
  sessionId  String?
  createdAt  DateTime @default(now())

  @@index([userId])
  @@index([eventType])
  @@index([createdAt])
  @@index([sessionId])
  @@map("accessibility_events")
}

// 10.17.4 접근성 감사 결과 모델
model AccessibilityAudit {
  id              String   @id @default(cuid())
  userId          String?
  user            User?    @relation(fields: [userId], references: [id], onDelete: SetNull)
  url             String
  wcagLevel       String   @default("AA") // A | AA | AAA
  score           Float
  violationCount  Int
  passCount       Int
  incompleteCount Int
  results         Json
  createdAt       DateTime @default(now())

  @@index([url])
  @@index([createdAt])
  @@index([score])
  @@map("accessibility_audits")
}

// 10.17.5 스크린 리더 세션 모델
model ScreenReaderSession {
  id               String   @id @default(cuid())
  userId           String
  user             User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  screenReaderType String   // nvda | jaws | voiceover | talkback | unknown
  browserInfo      String?
  startedAt        DateTime @default(now())
  endedAt          DateTime?
  pagesVisited     Int      @default(0)
  ariaAnnouncements Int     @default(0)
  focusEvents      Int      @default(0)

  @@index([userId])
  @@index([screenReaderType])
  @@index([startedAt])
  @@map("screen_reader_sessions")
}
```

```typescript
// src/services/accessibility-service.ts

import { prisma } from '@/lib/prisma';

// 10.17.6 접근성 서비스 클래스
export class AccessibilityService {
  // 사용자 접근성 프로필 조회
  async getUserAccessibilityProfile(userId: string) {
    const [settings, shortcuts, recentEvents] = await Promise.all([
      prisma.accessibilitySettings.findUnique({
        where: { userId },
      }),
      prisma.userShortcutOverride.findMany({
        where: { userId },
      }),
      prisma.accessibilityEvent.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 100,
      }),
    ]);

    // 스크린 리더 사용 여부 추론
    const screenReaderUsed = recentEvents.some(
      e => e.eventType === 'screen_reader_detected'
    );

    // 키보드 네비게이션 선호도 추론
    const keyboardEvents = recentEvents.filter(
      e => e.eventType === 'keyboard_shortcut_used' ||
           e.eventType === 'keyboard_navigation_pattern'
    );
    const keyboardPreferred = keyboardEvents.length > 20;

    return {
      settings,
      customShortcuts: shortcuts,
      inferred: {
        screenReaderUsed,
        keyboardPreferred,
        eventCount: recentEvents.length,
      },
    };
  }

  // 접근성 피처 사용 통계
  async getFeatureUsageStats(days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const stats = await prisma.accessibilitySettings.aggregate({
      _count: true,
      _sum: {
        // Boolean을 숫자로 집계하기 위한 Raw 쿼리 필요
      },
    });

    // Raw 쿼리로 상세 통계
    const featureStats = await prisma.$queryRaw<
      { feature: string; enabled_count: number; total: number }[]
    >`
      SELECT
        'reduceMotion' as feature,
        SUM(CASE WHEN "reduceMotion" = true THEN 1 ELSE 0 END) as enabled_count,
        COUNT(*) as total
      FROM accessibility_settings
      UNION ALL
      SELECT
        'highContrast',
        SUM(CASE WHEN "highContrast" = true THEN 1 ELSE 0 END),
        COUNT(*)
      FROM accessibility_settings
      UNION ALL
      SELECT
        'largeText',
        SUM(CASE WHEN "largeText" = true THEN 1 ELSE 0 END),
        COUNT(*)
      FROM accessibility_settings
      UNION ALL
      SELECT
        'keyboardShortcutsEnabled',
        SUM(CASE WHEN "keyboardShortcutsEnabled" = true THEN 1 ELSE 0 END),
        COUNT(*)
      FROM accessibility_settings
    `;

    return featureStats.map(f => ({
      feature: f.feature,
      enabledCount: Number(f.enabled_count),
      total: Number(f.total),
      percentage: f.total > 0
        ? ((Number(f.enabled_count) / Number(f.total)) * 100).toFixed(1)
        : 0,
    }));
  }

  // WCAG 준수율 계산
  async calculateWCAGComplianceRate() {
    const recentAudits = await prisma.accessibilityAudit.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    if (recentAudits.length === 0) {
      return { complianceRate: null, message: 'No audits available' };
    }

    const avgScore = recentAudits.reduce((sum, a) => sum + a.score, 0)
      / recentAudits.length;

    const avgViolations = recentAudits.reduce((sum, a) => sum + a.violationCount, 0)
      / recentAudits.length;

    return {
      complianceRate: avgScore.toFixed(1),
      avgViolationsPerPage: avgViolations.toFixed(1),
      auditCount: recentAudits.length,
      trend: this.calculateTrend(recentAudits.map(a => a.score)),
    };
  }

  private calculateTrend(scores: number[]): 'improving' | 'stable' | 'declining' {
    if (scores.length < 2) return 'stable';

    const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
    const secondHalf = scores.slice(Math.floor(scores.length / 2));

    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

    const diff = secondAvg - firstAvg;

    if (diff > 2) return 'improving';
    if (diff < -2) return 'declining';
    return 'stable';
  }

  // 키보드 단축키 사용 분석
  async analyzeShortcutUsage(userId?: string, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const events = await prisma.accessibilityEvent.findMany({
      where: {
        eventType: 'keyboard_shortcut_used',
        createdAt: { gte: startDate },
        ...(userId && { userId }),
      },
    });

    const actionStats: Record<string, {
      count: number;
      successCount: number;
      avgResponseTime: number;
      responseTimes: number[];
    }> = {};

    events.forEach(event => {
      const props = event.properties as {
        action?: string;
        success?: boolean;
        responseTimeMs?: number;
      };

      const action = props.action || 'unknown';

      if (!actionStats[action]) {
        actionStats[action] = {
          count: 0,
          successCount: 0,
          avgResponseTime: 0,
          responseTimes: [],
        };
      }

      actionStats[action].count++;
      if (props.success) actionStats[action].successCount++;
      if (props.responseTimeMs) {
        actionStats[action].responseTimes.push(props.responseTimeMs);
      }
    });

    // 평균 응답 시간 계산
    Object.keys(actionStats).forEach(action => {
      const times = actionStats[action].responseTimes;
      actionStats[action].avgResponseTime = times.length > 0
        ? times.reduce((a, b) => a + b, 0) / times.length
        : 0;
      delete (actionStats[action] as any).responseTimes;
    });

    return {
      totalUsage: events.length,
      byAction: Object.entries(actionStats)
        .map(([action, stats]) => ({
          action,
          count: stats.count,
          successRate: stats.count > 0
            ? ((stats.successCount / stats.count) * 100).toFixed(1)
            : 0,
          avgResponseTimeMs: stats.avgResponseTime.toFixed(0),
        }))
        .sort((a, b) => b.count - a.count),
    };
  }
}

export const accessibilityService = new AccessibilityService();
```

---

## 11. 보안

### 11.1 데이터 암호화

```typescript
// src/lib/crypto.ts
import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const SECRET_KEY = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

export function decrypt(encrypted: string): string {
  const [ivHex, authTagHex, encryptedText] = encrypted.split(':');

  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');

  const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
```

### 11.2 입력 검증 (Zod)

```typescript
// src/lib/validations.ts
import { z } from 'zod';

export const createMeetingSchema = z.object({
  title: z.string().min(1).max(200),
  company: z.string().optional(),
  platform: z.enum(['ZOOM', 'GOOGLE_MEET', 'TEAMS', 'OTHER']),
  startTime: z.coerce.date(),
  participants: z
    .array(
      z.object({
        name: z.string(),
        email: z.string().email().optional(),
        role: z.string().optional(),
      })
    )
    .optional(),
});

// API Route에서 사용
export async function POST(req: NextRequest) {
  const body = await req.json();

  // 검증
  const parsed = createMeetingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          code: 'INVALID_INPUT',
          message: 'Validation failed',
          details: parsed.error.errors,
        },
      },
      { status: 400 }
    );
  }

  // ...
}
```

---

## 12. 배포 및 모니터링

### 12.1 환경 변수

```bash
# .env.production
DATABASE_URL="postgresql://..."
REDIS_URL="..."
PINECONE_API_KEY="..."
OPENAI_API_KEY="..."
DEEPGRAM_API_KEY="..."
JWT_SECRET="..."
ENCRYPTION_KEY="..."

# Integrations
NOTION_CLIENT_ID="..."
NOTION_CLIENT_SECRET="..."
SALESFORCE_CLIENT_ID="..."
```

### 12.2 Vercel 배포

```json
// vercel.json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "DATABASE_URL": "@database-url",
    "OPENAI_API_KEY": "@openai-api-key"
  },
  "regions": ["icn1"]  // 서울 리전
}
```

### 12.3 모니터링

```typescript
// src/lib/monitoring.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});

// 에러 트래킹
export function captureError(error: unknown, context?: Record<string, any>) {
  Sentry.captureException(error, { extra: context });
}

// 성능 모니터링
export function trackPerformance(name: string, duration: number) {
  Sentry.metrics.distribution(name, duration, {
    unit: 'millisecond',
  });
}
```

---

**문서 끝**

**최종 업데이트**: 2025-12-30 (Part 3 HUD 인터랙션 API 추가)

**다음 단계:**
1. Prisma 마이그레이션 생성
2. API 엔드포인트 구현
3. AI 파이프라인 테스트
4. 통합 테스트 작성
5. 성능 벤치마크
6. 프로덕션 배포
7. **Part 3 HUD 세션 API 구현**: HUDSessionService, 알림 시스템, Gap 분석, 연기 항목 관리
