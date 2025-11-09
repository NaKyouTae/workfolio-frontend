import { Notice } from '@/hooks/useNotices';

/**
 * 샘플 공지사항 데이터
 * 로그인하지 않은 사용자에게 표시됩니다.
 */
export const sampleNotices: Notice[] = [
  {
    id: 'sample-1',
    title: '워크폴리오에 오신 것을 환영합니다!',
    content: `워크폴리오는 여러분의 이력서와 이직 활동을 효율적으로 관리할 수 있는 플랫폼입니다.

주요 기능:
• 이력서 작성 및 관리
• 이직 활동 기록
• PDF 내보내기
• URL 공유하기

로그인하시면 더 많은 기능을 이용하실 수 있습니다.`,
    author: '워크폴리오 팀',
    createdAt: Date.now() - 86400000,
    views: 1250,
    isImportant: true,
  },
  {
    id: 'sample-2',
    title: '새로운 기능이 추가되었습니다',
    content: `이력서 템플릿 기능이 새롭게 추가되었습니다.

다양한 템플릿 중에서 선택하여 전문적인 이력서를 작성해보세요.

• 클래식 템플릿
• 모던 템플릿
• 심플 템플릿

더 많은 템플릿이 계속 추가될 예정입니다.`,
    author: '워크폴리오 팀',
    createdAt: Date.now() - 172800000,
    views: 890,
    isImportant: false,
  },
  {
    id: 'sample-3',
    title: '개인정보 처리방침 안내',
    content: `워크폴리오는 사용자의 개인정보를 소중히 다룹니다.

개인정보 처리방침이 업데이트되었습니다.
자세한 내용은 설정 페이지에서 확인하실 수 있습니다.

개인정보 보호를 위해 항상 최선을 다하겠습니다.`,
    author: '워크폴리오 팀',
    createdAt: Date.now() - 259200000,
    views: 567,
    isImportant: true,
  },
  {
    id: 'sample-4',
    title: '서비스 이용 가이드',
    content: `워크폴리오를 처음 사용하시나요?

이용 가이드를 통해 주요 기능을 익혀보세요:

1. 이력서 작성하기
2. 이직 활동 기록하기
3. 목표 설정하기
4. 진행 상황 관리하기

궁금한 점이 있으시면 언제든 문의해주세요!`,
    author: '워크폴리오 팀',
    createdAt: Date.now() - 345600000,
    views: 1450,
    isImportant: false,
  },
];

