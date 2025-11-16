import { Notice } from '@/generated/common';

export const sampleNotices: Notice[] = [
  {
    id: 'notice-1',
    title: '워크폴리오에 오신 것을 환영합니다.',
    content: `워크폴리오는 여러분의 이력서와 이직 활동을 효율적으로 관리할 수 있는 플랫폼입니다.

주요 기능:
• 이력서 작성 및 관리
• 이직 활동 기록
• PDF 내보내기
• URL 공유하기

로그인하시면 더 많은 기능을 이용하실 수 있습니다.`,
    isPinned: true,
    createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7일 전
    updatedAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'notice-2',
    title: '워크폴리오에 오신 것을 환영합니다. 워크폴리오에 오신 것을 환영합니다. 워크폴리오에 오신 것을 환영합니다. 워크폴리오에 오신 것을 환영합니다. 워크폴리오에 오신 것을 환영합니다.',
    content: `이것은 일반 공지사항의 예시입니다.

긴 제목의 공지사항도 잘 표시되는지 확인할 수 있습니다.

여러 줄의 내용을 포함할 수 있으며, 사용자에게 중요한 정보를 전달할 수 있습니다.`,
    isPinned: false,
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5일 전
    updatedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'notice-3',
    title: '서비스 업데이트 안내',
    content: `워크폴리오 서비스가 업데이트되었습니다.

새로운 기능:
• 이력서 템플릿 추가
• PDF 내보내기 기능 개선
• 모바일 반응형 디자인 개선

더 나은 서비스를 제공하기 위해 계속 노력하겠습니다.`,
    isPinned: false,
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3일 전
    updatedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'notice-4',
    title: '중요: 개인정보 보호 정책 업데이트',
    content: `개인정보 보호 정책이 업데이트되었습니다.

주요 변경사항:
• 개인정보 처리 방침 명확화
• 데이터 보관 기간 조정
• 사용자 권리 강화

자세한 내용은 개인정보 처리방침 페이지를 확인해주세요.`,
    isPinned: true,
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2일 전
    updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'notice-5',
    title: '이력서 작성 가이드',
    content: `효과적인 이력서를 작성하는 방법을 안내합니다.

팁:
1. 명확하고 간결한 문장 사용
2. 구체적인 성과와 수치 제시
3. 관련 경험 강조
4. 맞춤법과 문법 확인

더 자세한 가이드는 도움말 섹션을 참고해주세요.`,
    isPinned: false,
    createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000, // 1일 전
    updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'notice-6',
    title: '시스템 점검 안내',
    content: `2025년 1월 15일 오전 2시부터 4시까지 시스템 점검이 진행됩니다.

점검 시간 동안 서비스 이용이 제한될 수 있습니다.
불편을 드려 죄송합니다.`,
    isPinned: false,
    createdAt: Date.now() - 6 * 60 * 60 * 1000, // 6시간 전
    updatedAt: Date.now() - 6 * 60 * 60 * 1000,
  },
  {
    id: 'notice-7',
    title: '신규 기능 출시: 이직 활동 추적',
    content: `새로운 기능이 추가되었습니다!

이직 활동 추적 기능으로:
• 지원한 회사 목록 관리
• 면접 일정 관리
• 합격/불합격 결과 기록

더 체계적으로 이직 활동을 관리해보세요.`,
    isPinned: false,
    createdAt: Date.now() - 4 * 60 * 60 * 1000, // 4시간 전
    updatedAt: Date.now() - 4 * 60 * 60 * 1000,
  },
  {
    id: 'notice-8',
    title: '고객센터 운영 시간 안내',
    content: `고객센터 운영 시간을 안내드립니다.

평일: 오전 9시 ~ 오후 6시
주말 및 공휴일: 휴무

문의사항이 있으시면 언제든지 연락주세요.`,
    isPinned: false,
    createdAt: Date.now() - 2 * 60 * 60 * 1000, // 2시간 전
    updatedAt: Date.now() - 2 * 60 * 60 * 1000,
  },
  {
    id: 'notice-9',
    title: '이벤트: 신규 가입자 혜택',
    content: `신규 가입자를 위한 특별 혜택을 준비했습니다!

혜택 내용:
• 프리미엄 플랜 1개월 무료 체험
• 이력서 템플릿 10종 무료 제공
• PDF 내보내기 무제한

지금 바로 가입하고 혜택을 받아보세요!`,
    isPinned: true,
    createdAt: Date.now() - 1 * 60 * 60 * 1000, // 1시간 전
    updatedAt: Date.now() - 1 * 60 * 60 * 1000,
  },
  {
    id: 'notice-10',
    title: 'FAQ 업데이트',
    content: `자주 묻는 질문(FAQ) 섹션이 업데이트되었습니다.

새로 추가된 질문들:
• 계정 설정 방법
• 이력서 공유 방법
• 결제 및 환불 정책

더 많은 질문과 답변을 확인해보세요.`,
    isPinned: false,
    createdAt: Date.now() - 30 * 60 * 1000, // 30분 전
    updatedAt: Date.now() - 30 * 60 * 1000,
  },
];
