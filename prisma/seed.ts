// Onno - Prisma Seed Data
// 버전: 2.1 (Part 1~6.4 전체 통합)
// 생성일: 2025-12-30

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ============================================
  // 1. Users
  // ============================================
  console.log('Creating users...');

  const user1 = await prisma.user.upsert({
    where: { email: 'demo@onno.app' },
    update: {},
    create: {
      id: 'user_demo_001',
      email: 'demo@onno.app',
      name: '김데모',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'test@onno.app' },
    update: {},
    create: {
      id: 'user_test_001',
      email: 'test@onno.app',
      name: '이테스트',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test',
    },
  });

  console.log(`✅ Created ${2} users`);

  // ============================================
  // 2. User Settings (Part 5.2)
  // ============================================
  console.log('Creating user settings...');

  await prisma.userSettings.upsert({
    where: { userId: user1.id },
    update: {},
    create: {
      userId: user1.id,
      dataRetentionDays: 365,
      shareAnalytics: true,
      allowAiTraining: false,
    },
  });

  await prisma.notificationSettings.upsert({
    where: { userId: user1.id },
    update: {},
    create: {
      userId: user1.id,
      frequency: 'medium',
      prepReminderEnabled: true,
      prepReminderMinutes: 15,
      hudAlertsEnabled: true,
      gapDetectionEnabled: true,
      suggestionLevel: 'balanced',
      summaryReadyEnabled: true,
      actionItemReminderEnabled: true,
      dndEnabled: false,
      inAppEnabled: true,
      emailEnabled: true,
      emailDigestFrequency: 'daily',
    },
  });

  console.log('✅ Created user settings');

  // ============================================
  // 3. Accessibility Settings (Part 6.4)
  // ============================================
  console.log('Creating accessibility settings...');

  await prisma.accessibilitySettings.upsert({
    where: { userId: user1.id },
    update: {},
    create: {
      userId: user1.id,
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

  console.log('✅ Created accessibility settings');

  // ============================================
  // 4. User Onboarding (Part 6.3)
  // ============================================
  console.log('Creating user onboarding...');

  await prisma.userOnboarding.upsert({
    where: { userId: user1.id },
    update: {},
    create: {
      userId: user1.id,
      completed: true,
      profileCompleted: true,
      tutorialCompleted: true,
      calendarConnected: true,
      firstMeetingDone: true,
      integrationsDone: true,
      progress: 100,
      completedAt: new Date(),
      currentStep: 'completed',
    },
  });

  // 신규 사용자 (온보딩 진행 중)
  await prisma.userOnboarding.upsert({
    where: { userId: user2.id },
    update: {},
    create: {
      userId: user2.id,
      completed: false,
      profileCompleted: true,
      tutorialCompleted: false,
      calendarConnected: false,
      firstMeetingDone: false,
      integrationsDone: false,
      progress: 20,
      currentStep: 'calendar_connect',
    },
  });

  console.log('✅ Created user onboarding');

  // ============================================
  // 5. Integrations (Part 1, 5.2)
  // ============================================
  console.log('Creating integrations...');

  await prisma.integration.upsert({
    where: { userId_provider: { userId: user1.id, provider: 'google_calendar' } },
    update: {},
    create: {
      userId: user1.id,
      provider: 'google_calendar',
      enabled: true,
      accountEmail: 'demo@gmail.com',
      accountName: '김데모',
      tokenExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30일 후
      lastSyncedAt: new Date(),
    },
  });

  await prisma.integration.upsert({
    where: { userId_provider: { userId: user1.id, provider: 'notion' } },
    update: {},
    create: {
      userId: user1.id,
      provider: 'notion',
      enabled: true,
      accountEmail: 'demo@gmail.com',
      accountName: '김데모의 워크스페이스',
      notionWorkspace: '김데모의 워크스페이스',
      notionDatabaseId: 'db_notion_meetings_001',
      tokenExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      lastSyncedAt: new Date(),
    },
  });

  console.log('✅ Created integrations');

  // ============================================
  // 6. Meetings (Part 1, 2, 3)
  // ============================================
  console.log('Creating meetings...');

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // 오늘 예정된 미팅 (30분 후)
  const upcomingMeeting = await prisma.meeting.create({
    data: {
      id: 'mtg_upcoming_001',
      userId: user1.id,
      title: 'A사 분기 리뷰 미팅',
      company: 'A사',
      platform: 'ZOOM',
      status: 'SCHEDULED',
      startTime: new Date(now.getTime() + 30 * 60 * 1000),
      endTime: new Date(now.getTime() + 90 * 60 * 1000),
      participants: [
        { name: '김영희', email: 'kim@a-company.com', role: 'client' },
        { name: '박철수', email: 'park@a-company.com', role: 'client' },
        { name: '김데모', email: 'demo@onno.app', role: 'host' },
      ],
      metadata: {
        zoomId: 'zoom_123456789',
        meetUrl: 'https://zoom.us/j/123456789',
      },
      prepReminderSent: true,
    },
  });

  // 진행 중인 미팅
  const ongoingMeeting = await prisma.meeting.create({
    data: {
      id: 'mtg_ongoing_001',
      userId: user1.id,
      title: 'B사 제품 데모',
      company: 'B사',
      platform: 'GOOGLE_MEET',
      status: 'ONGOING',
      startTime: new Date(now.getTime() - 20 * 60 * 1000), // 20분 전 시작
      participants: [
        { name: '이민수', email: 'lee@b-corp.com', role: 'client' },
        { name: '김데모', email: 'demo@onno.app', role: 'host' },
      ],
      metadata: {
        meetUrl: 'https://meet.google.com/abc-defg-hij',
      },
    },
  });

  // 완료된 미팅 (어제)
  const completedMeeting1 = await prisma.meeting.create({
    data: {
      id: 'mtg_completed_001',
      userId: user1.id,
      title: 'C사 계약 협상',
      company: 'C사',
      platform: 'ZOOM',
      status: 'COMPLETED',
      startTime: new Date(today.getTime() - 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000), // 어제 10시
      endTime: new Date(today.getTime() - 24 * 60 * 60 * 1000 + 11 * 60 * 60 * 1000), // 어제 11시
      duration: 60,
      participants: [
        { name: '최지원', email: 'choi@c-inc.com', role: 'client' },
        { name: '김데모', email: 'demo@onno.app', role: 'host' },
      ],
    },
  });

  // 완료된 미팅 (3일 전)
  const completedMeeting2 = await prisma.meeting.create({
    data: {
      id: 'mtg_completed_002',
      userId: user1.id,
      title: 'D사 킥오프 미팅',
      company: 'D사',
      platform: 'TEAMS',
      status: 'COMPLETED',
      startTime: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000),
      endTime: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000 + 15.5 * 60 * 60 * 1000),
      duration: 90,
      participants: [
        { name: '정다은', email: 'jung@d-tech.com', role: 'client' },
        { name: '한승우', email: 'han@d-tech.com', role: 'client' },
        { name: '김데모', email: 'demo@onno.app', role: 'host' },
      ],
    },
  });

  console.log(`✅ Created ${4} meetings`);

  // ============================================
  // 7. Meeting Prep (Part 1.5)
  // ============================================
  console.log('Creating meeting preps...');

  await prisma.meetingPrep.create({
    data: {
      meetingId: upcomingMeeting.id,
      status: 'COMPLETED',
      completedAt: new Date(now.getTime() - 10 * 60 * 1000),
      checkedQuestions: [
        '지난 분기 대비 성과 개선점은?',
        '다음 분기 목표와 예상 일정은?',
        '추가 지원이 필요한 부분은?',
      ],
      userQuestions: ['예산 조정 가능 여부 확인'],
      prepTimeSeconds: 85,
    },
  });

  console.log('✅ Created meeting preps');

  // ============================================
  // 8. HUD Session (Part 3)
  // ============================================
  console.log('Creating HUD sessions...');

  await prisma.hudSession.create({
    data: {
      meetingId: ongoingMeeting.id,
      status: 'active',
      startedAt: new Date(now.getTime() - 20 * 60 * 1000),
      audioSource: 'system',
      audioQualityMode: 'AUTO',
      transcriptCount: 45,
      alertCount: 2,
      insightCount: 5,
    },
  });

  await prisma.hudSession.create({
    data: {
      meetingId: completedMeeting1.id,
      status: 'completed',
      startedAt: new Date(today.getTime() - 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000),
      endedAt: new Date(today.getTime() - 24 * 60 * 60 * 1000 + 11 * 60 * 60 * 1000),
      audioSource: 'system',
      transcriptCount: 120,
      alertCount: 3,
      insightCount: 8,
    },
  });

  console.log('✅ Created HUD sessions');

  // ============================================
  // 9. Transcripts (Part 3)
  // ============================================
  console.log('Creating transcripts...');

  const transcriptData = [
    { speaker: '이민수', text: '안녕하세요, 오늘 제품 데모 기대하고 있었습니다.', offset: 0 },
    { speaker: '김데모', text: '네, 감사합니다. 먼저 핵심 기능부터 보여드릴게요.', offset: 1 },
    { speaker: '김데모', text: 'Onno는 미팅 중 실시간으로 중요 결정사항을 추출합니다.', offset: 2 },
    { speaker: '이민수', text: '흥미롭네요. 정확도는 어느 정도인가요?', offset: 3 },
    { speaker: '김데모', text: '현재 약 95% 정확도를 보이고 있습니다.', offset: 4 },
    { speaker: '이민수', text: '가격 정책은 어떻게 되나요? 월 100만원 이하면 좋겠는데요.', offset: 5 },
    { speaker: '김데모', text: '스타터 플랜이 월 49,000원부터 시작합니다.', offset: 6 },
    { speaker: '이민수', text: '괜찮네요. 팀 전체가 사용하면 할인이 있나요?', offset: 7 },
    { speaker: '김데모', text: '10인 이상 팀은 20% 할인을 적용해드립니다.', offset: 8 },
    { speaker: '이민수', text: '좋습니다. 다음 주까지 검토 후 결정하겠습니다.', offset: 9 },
  ];

  for (const t of transcriptData) {
    await prisma.transcript.create({
      data: {
        meetingId: ongoingMeeting.id,
        speaker: t.speaker,
        text: t.text,
        timestamp: new Date(now.getTime() - (20 - t.offset * 2) * 60 * 1000),
        confidence: 0.92 + Math.random() * 0.08,
      },
    });
  }

  // 완료된 미팅 전사
  const completedTranscripts = [
    { speaker: '최지원', text: '계약 조건 중 보안 조항 수정 요청드립니다.' },
    { speaker: '김데모', text: '어떤 부분이 우려되시나요?' },
    { speaker: '최지원', text: '데이터 보관 기간이 너무 길어 보입니다. 1년으로 줄여주세요.' },
    { speaker: '김데모', text: '네, 1년으로 수정 가능합니다.' },
    { speaker: '최지원', text: '감사합니다. 그러면 다음 주 월요일까지 최종 계약서 보내주세요.' },
  ];

  for (let i = 0; i < completedTranscripts.length; i++) {
    await prisma.transcript.create({
      data: {
        meetingId: completedMeeting1.id,
        speaker: completedTranscripts[i].speaker,
        text: completedTranscripts[i].text,
        timestamp: new Date(today.getTime() - 24 * 60 * 60 * 1000 + (10 * 60 + i * 10) * 60 * 1000),
        confidence: 0.95,
      },
    });
  }

  console.log(`✅ Created ${transcriptData.length + completedTranscripts.length} transcripts`);

  // ============================================
  // 10. Insights (Part 3)
  // ============================================
  console.log('Creating insights...');

  await prisma.insight.createMany({
    data: [
      {
        meetingId: ongoingMeeting.id,
        type: 'METRIC',
        content: '정확도 약 95%',
        source: '현재 약 95% 정확도를 보이고 있습니다.',
        confidence: 0.98,
      },
      {
        meetingId: ongoingMeeting.id,
        type: 'METRIC',
        content: '스타터 플랜 월 49,000원',
        source: '스타터 플랜이 월 49,000원부터 시작합니다.',
        confidence: 0.99,
      },
      {
        meetingId: ongoingMeeting.id,
        type: 'METRIC',
        content: '10인 이상 팀 20% 할인',
        source: '10인 이상 팀은 20% 할인을 적용해드립니다.',
        confidence: 0.99,
      },
      {
        meetingId: ongoingMeeting.id,
        type: 'COMMITMENT',
        content: '다음 주까지 검토 후 결정',
        source: '다음 주까지 검토 후 결정하겠습니다.',
        confidence: 0.95,
      },
      {
        meetingId: ongoingMeeting.id,
        type: 'CONCERN',
        content: '월 100만원 이하 예산 제약',
        source: '월 100만원 이하면 좋겠는데요.',
        confidence: 0.88,
      },
      {
        meetingId: completedMeeting1.id,
        type: 'CONCERN',
        content: '데이터 보관 기간 우려',
        source: '데이터 보관 기간이 너무 길어 보입니다.',
        confidence: 0.92,
      },
      {
        meetingId: completedMeeting1.id,
        type: 'COMMITMENT',
        content: '다음 주 월요일까지 최종 계약서 전달',
        source: '다음 주 월요일까지 최종 계약서 보내주세요.',
        confidence: 0.97,
      },
    ],
  });

  console.log('✅ Created insights');

  // ============================================
  // 11. Decisions (Part 3, 4)
  // ============================================
  console.log('Creating decisions...');

  await prisma.decision.createMany({
    data: [
      {
        meetingId: completedMeeting1.id,
        content: '데이터 보관 기간 1년으로 단축',
        goal: '고객사 보안 요구사항 충족',
        decision: '계약서 내 데이터 보관 기간을 기존 3년에서 1년으로 수정',
        assignee: '김데모',
        source: 'AI_EXTRACTED',
        isComplete: true,
        completeness: 80,
        confidence: 0.94,
      },
      {
        meetingId: completedMeeting1.id,
        content: '최종 계약서 다음 주 월요일까지 전달',
        goal: '계약 체결 완료',
        decision: '수정된 계약서를 다음 주 월요일까지 C사에 전달',
        assignee: '김데모',
        deadline: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
        source: 'AI_EXTRACTED',
        isComplete: false,
        completeness: 60,
        confidence: 0.96,
      },
      {
        meetingId: completedMeeting2.id,
        content: '프로젝트 킥오프 완료, 1차 마일스톤 2주 후',
        goal: 'D사 프로젝트 성공적 시작',
        decision: '2주 후 1차 마일스톤 리뷰 진행',
        assignee: '김데모',
        deadline: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000),
        source: 'AI_EXTRACTED',
        isComplete: false,
        completeness: 70,
        confidence: 0.91,
      },
    ],
  });

  console.log('✅ Created decisions');

  // ============================================
  // 12. Actions (Part 3, 4)
  // ============================================
  console.log('Creating actions...');

  await prisma.action.createMany({
    data: [
      {
        meetingId: completedMeeting1.id,
        title: '계약서 데이터 보관 기간 수정',
        description: '데이터 보관 기간을 3년에서 1년으로 수정하고 법무팀 검토 요청',
        assignee: '김데모',
        assigneeEmail: 'demo@onno.app',
        dueDate: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000),
        status: 'COMPLETED',
        completedAt: new Date(),
      },
      {
        meetingId: completedMeeting1.id,
        title: 'C사에 최종 계약서 전달',
        description: '수정된 계약서를 C사 최지원님께 이메일로 전달',
        assignee: '김데모',
        assigneeEmail: 'demo@onno.app',
        dueDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
        status: 'PENDING',
      },
      {
        meetingId: completedMeeting2.id,
        title: 'D사 프로젝트 환경 세팅',
        description: '개발 환경 및 접근 권한 설정',
        assignee: '김데모',
        assigneeEmail: 'demo@onno.app',
        dueDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000),
        status: 'IN_PROGRESS',
      },
      {
        meetingId: completedMeeting2.id,
        title: '1차 마일스톤 리뷰 일정 캘린더 등록',
        description: 'D사 담당자와 1차 마일스톤 리뷰 미팅 일정 조율',
        assignee: '김데모',
        assigneeEmail: 'demo@onno.app',
        dueDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
        status: 'PENDING',
      },
    ],
  });

  console.log('✅ Created actions');

  // ============================================
  // 13. Alerts (Part 3)
  // ============================================
  console.log('Creating alerts...');

  await prisma.alert.createMany({
    data: [
      {
        meetingId: ongoingMeeting.id,
        level: 1,
        title: '예산 관련 질문 권장',
        message: '고객이 예산 제약(월 100만원)을 언급했습니다. 구체적인 팀 규모를 확인해보세요.',
        suggestedQuestion: '현재 팀 규모가 어떻게 되시나요? 정확한 견적을 드리기 위해 확인하고 싶습니다.',
        reason: ['예산 제약 언급', '팀 규모 미확인'],
        shown: true,
        response: 'ASKED',
      },
      {
        meetingId: ongoingMeeting.id,
        level: 2,
        title: '결정 일정 확인 필요',
        message: '"다음 주까지 검토"라고 하셨는데, 구체적인 날짜를 확정하면 좋겠습니다.',
        suggestedQuestion: '다음 주 중 언제쯤 결정을 내리실 수 있을까요? 그때 다시 연락드려도 될까요?',
        reason: ['결정 일정 불명확'],
        shown: true,
        response: null,
      },
      {
        meetingId: completedMeeting1.id,
        level: 2,
        title: '보안 요구사항 상세 확인',
        message: '데이터 보관 기간 외에 다른 보안 요구사항이 있는지 확인이 필요합니다.',
        suggestedQuestion: '데이터 보관 기간 외에 추가로 검토가 필요한 보안 조항이 있으신가요?',
        reason: ['보안 관련 추가 요구사항 가능성'],
        shown: true,
        response: 'ASKED',
      },
    ],
  });

  console.log('✅ Created alerts');

  // ============================================
  // 14. Meeting Confirmation (Part 4)
  // ============================================
  console.log('Creating meeting confirmations...');

  await prisma.meetingConfirmation.create({
    data: {
      meetingId: completedMeeting1.id,
      status: 'CONFIRMED',
      confirmedAt: new Date(today.getTime() - 23 * 60 * 60 * 1000),
      notionPageId: 'notion_page_c_contract',
      notionPageUrl: 'https://notion.so/demo-workspace/c-contract-123',
      notionSavedAt: new Date(today.getTime() - 23 * 60 * 60 * 1000),
      totalGaps: 2,
      filledGaps: 2,
      timeToConfirm: 180,
    },
  });

  await prisma.meetingConfirmation.create({
    data: {
      meetingId: completedMeeting2.id,
      status: 'CONFIRMED',
      confirmedAt: new Date(today.getTime() - 2.5 * 24 * 60 * 60 * 1000),
      notionPageId: 'notion_page_d_kickoff',
      notionPageUrl: 'https://notion.so/demo-workspace/d-kickoff-456',
      notionSavedAt: new Date(today.getTime() - 2.5 * 24 * 60 * 60 * 1000),
      totalGaps: 1,
      filledGaps: 1,
      timeToConfirm: 120,
    },
  });

  console.log('✅ Created meeting confirmations');

  // ============================================
  // 15. Search History & Analytics (Part 5)
  // ============================================
  console.log('Creating search history...');

  await prisma.searchHistory.createMany({
    data: [
      { userId: user1.id, query: 'C사 계약', resultCount: 3 },
      { userId: user1.id, query: '예산 논의', resultCount: 5 },
      { userId: user1.id, query: '다음 주 마감', resultCount: 2 },
      { userId: user1.id, query: 'D사 킥오프', resultCount: 1 },
    ],
  });

  await prisma.searchAnalytics.createMany({
    data: [
      {
        userId: user1.id,
        query: 'C사 계약',
        queryType: 'keyword',
        semanticSuccess: true,
        resultCount: 3,
        clickedResultIndex: 0,
        timeToClickMs: 2500,
        searchTimeMs: 450,
        filterUsed: false,
      },
      {
        userId: user1.id,
        query: '예산 관련 논의한 미팅',
        queryType: 'natural',
        semanticSuccess: true,
        resultCount: 5,
        clickedResultIndex: 1,
        timeToClickMs: 4200,
        searchTimeMs: 680,
        filterUsed: false,
      },
    ],
  });

  console.log('✅ Created search history');

  // ============================================
  // 16. First Time Milestones (Part 6.3)
  // ============================================
  console.log('Creating first time milestones...');

  await prisma.firstTimeMilestone.createMany({
    data: [
      {
        userId: user1.id,
        milestone: 'first_login',
        achievedAt: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000),
        metadata: { source: 'google_oauth' },
      },
      {
        userId: user1.id,
        milestone: 'first_calendar_connect',
        achievedAt: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000),
        metadata: { provider: 'google_calendar' },
      },
      {
        userId: user1.id,
        milestone: 'first_meeting',
        achievedAt: new Date(today.getTime() - 25 * 24 * 60 * 60 * 1000),
        metadata: { meetingId: 'mtg_first_001' },
      },
      {
        userId: user1.id,
        milestone: 'first_notion_connect',
        achievedAt: new Date(today.getTime() - 20 * 24 * 60 * 60 * 1000),
        metadata: { workspace: '김데모의 워크스페이스' },
      },
      {
        userId: user1.id,
        milestone: 'first_confirmation',
        achievedAt: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000),
        metadata: { meetingId: 'mtg_completed_old' },
      },
    ],
  });

  console.log('✅ Created first time milestones');

  // ============================================
  // 17. Empty State Events (Part 6.3)
  // ============================================
  console.log('Creating empty state events...');

  await prisma.emptyStateEvent.createMany({
    data: [
      {
        userId: user2.id,
        eventType: 'empty_state_shown',
        context: 'today_meetings',
        reason: 'first_time',
        dwellTimeMs: 5000,
      },
      {
        userId: user2.id,
        eventType: 'cta_clicked',
        context: 'today_meetings',
        reason: 'first_time',
        action: 'oauth:google_calendar',
      },
    ],
  });

  console.log('✅ Created empty state events');

  // ============================================
  // 18. Accessibility Events (Part 6.4)
  // ============================================
  console.log('Creating accessibility events...');

  await prisma.accessibilityEvent.createMany({
    data: [
      {
        userId: user1.id,
        eventType: 'keyboard_shortcut_used',
        properties: {
          shortcutKey: 'k',
          modifiers: ['ctrl'],
          action: 'openSearch',
          scope: 'global',
          success: true,
          responseTimeMs: 45,
        },
      },
      {
        userId: user1.id,
        eventType: 'keyboard_shortcut_used',
        properties: {
          shortcutKey: 'j',
          modifiers: [],
          action: 'nextCard',
          scope: 'today',
          success: true,
          responseTimeMs: 32,
        },
      },
      {
        userId: user1.id,
        eventType: 'skip_link_used',
        properties: {
          skipLinkType: 'main',
          targetId: 'main-content',
          timeSavedMs: 1200,
        },
      },
    ],
  });

  console.log('✅ Created accessibility events');

  // ============================================
  // 19. Embeddings (Part 5)
  // ============================================
  console.log('Creating embeddings...');

  await prisma.embedding.createMany({
    data: [
      {
        meetingId: completedMeeting1.id,
        chunkIndex: 0,
        text: 'C사 계약 협상 미팅. 보안 조항 수정 요청. 데이터 보관 기간 1년으로 단축.',
        vectorId: 'vec_c_meeting_001_0',
      },
      {
        meetingId: completedMeeting1.id,
        chunkIndex: 1,
        text: '다음 주 월요일까지 최종 계약서 전달 예정. 고객 요구사항 반영 완료.',
        vectorId: 'vec_c_meeting_001_1',
      },
      {
        meetingId: completedMeeting2.id,
        chunkIndex: 0,
        text: 'D사 킥오프 미팅. 프로젝트 범위 및 일정 확정. 2주 후 1차 마일스톤.',
        vectorId: 'vec_d_meeting_002_0',
      },
    ],
  });

  console.log('✅ Created embeddings');

  // ============================================
  // Done
  // ============================================
  console.log('');
  console.log('🎉 Seeding completed successfully!');
  console.log('');
  console.log('📊 Summary:');
  console.log('  - Users: 2');
  console.log('  - Meetings: 4');
  console.log('  - Transcripts: 15');
  console.log('  - Insights: 7');
  console.log('  - Decisions: 3');
  console.log('  - Actions: 4');
  console.log('  - Alerts: 3');
  console.log('  - Integrations: 2');
  console.log('  - And more...');
  console.log('');
  console.log('🔐 Demo accounts:');
  console.log('  - demo@onno.app (완료된 온보딩)');
  console.log('  - test@onno.app (진행 중인 온보딩)');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
