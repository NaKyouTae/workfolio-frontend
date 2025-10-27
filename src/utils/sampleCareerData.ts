import { 
  Career, 
  Education, 
  Salary, 
  Project, 
  Activity, 
  Attachment, 
  LanguageSkill, 
  LanguageTest,
  Resume, 
  Resume_Gender,
  Education_EducationStatus,
  Career_EmploymentType,
  LanguageSkill_Language,
  LanguageSkill_LanguageLevel,
  Worker,
  JobSearch,
  JobSearchCompany,
  Interview,
  JobSearchCompany_Status,
  Interview_Type,
  Activity_ActivityType,
  Attachment_AttachmentType
} from '@/generated/common';

// 샘플 Worker 데이터
export const createSampleWorker = (): Worker => {
  return {
    id: 'worker-1',
    name: '홍길동',
    nickName: '홍길동',
    createdAt: Date.now() - 365 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now()
  };
};

// 샘플 Resume 데이터
export const createSampleResume = (): Resume => {
  const now = Date.now();
  const worker = createSampleWorker();
  
  return {
    id: 'resume-1',
    title: '홍길동 이력서',
    name: '홍길동',
    phone: '010-1234-5678',
    email: 'hong@example.com',
    birthDate: now - 30 * 365 * 24 * 60 * 60 * 1000, // 30년 전
    gender: Resume_Gender.MALE,
    job: '풀스택 개발자',
    description: '10년차 풀스택 개발자입니다. React, Node.js, Spring Boot 등 다양한 기술 스택을 다룹니다.',
    isDefault: true,
    publicId: 'hong-resume-public',
    worker,
    createdAt: now - 365 * 24 * 60 * 60 * 1000,
    updatedAt: now
  };
};

// 샘플 Career 데이터
export const createSampleCareers = (): Career[] => {
  const now = Date.now();
  const resume = createSampleResume();
  
  return [
    {
      id: 'career-1',
      name: '테크스타트업',
      position: '시니어 백엔드 개발자',
      department: '개발팀',
      employmentType: Career_EmploymentType.FULL_TIME,
      jobGrade: '책임',
      job: '백엔드 개발자',
      salary: 6000,
      description: 'Spring Boot 기반 마이크로서비스 아키텍처 설계 및 개발\n- RESTful API 설계 및 구현\n- AWS 인프라 구축 및 운영\n- CI/CD 파이프라인 구축',
      isVisible: true,
      priority: 1,
      startedAt: now - 2 * 365 * 24 * 60 * 60 * 1000, // 2년 전
      endedAt: now - 1 * 365 * 24 * 60 * 60 * 1000, // 1년 전
      isWorking: false,
      resume,
      achievements: [],
      salaries: [],
      createdAt: now - 2 * 365 * 24 * 60 * 60 * 1000,
      updatedAt: now - 1 * 365 * 24 * 60 * 60 * 1000
    },
    {
      id: 'career-2',
      name: '글로벌 IT 기업',
      position: '리드 풀스택 개발자',
      department: '플랫폼개발본부',
      employmentType: Career_EmploymentType.FULL_TIME,
      jobGrade: '선임',
      job: '풀스택 개발자',
      salary: 8200,
      description: 'React/Node.js 기반 서비스 개발 및 팀 리딩\n- 프론트엔드 아키텍처 설계\n- 백엔드 API 개발\n- 주니어 개발자 멘토링',
      isVisible: true,
      priority: 2,
      startedAt: now - 1 * 365 * 24 * 60 * 60 * 1000, // 1년 전
      endedAt: 0, // 현재 재직 중
      isWorking: true,
      resume,
      achievements: [],
      salaries: [],
      createdAt: now - 1 * 365 * 24 * 60 * 60 * 1000,
      updatedAt: now
    },
    {
      id: 'career-3',
      name: '중견 소프트웨어 회사',
      position: '주니어 웹 개발자',
      department: '웹개발팀',
      employmentType: Career_EmploymentType.FULL_TIME,
      jobGrade: '사원',
      job: '웹 개발자',
      salary: 4500,
      description: '웹 서비스 유지보수 및 신규 기능 개발\n- jQuery, JSP 기반 레거시 시스템 유지보수\n- Vue.js로 프론트엔드 마이그레이션',
      isVisible: true,
      priority: 3,
      startedAt: now - 3 * 365 * 24 * 60 * 60 * 1000, // 3년 전
      endedAt: now - 2 * 365 * 24 * 60 * 60 * 1000, // 2년 전
      isWorking: false,
      resume,
      achievements: [],
      salaries: [],
      createdAt: now - 3 * 365 * 24 * 60 * 60 * 1000,
      updatedAt: now - 2 * 365 * 24 * 60 * 60 * 1000
    }
  ];
};

// 샘플 Salary 데이터
export const createSampleSalaries = (): Salary[] => {
  const now = Date.now();
  const careers = createSampleCareers();
  
  return [
    {
      id: 'salary-1',
      amount: 4500,
      memo: '입사 시 연봉',
      negotiationDate: now - 3 * 365 * 24 * 60 * 60 * 1000,
      isVisible: true,
      priority: 1,
      career: careers[2], // 중견 소프트웨어 회사
      createdAt: now - 3 * 365 * 24 * 60 * 60 * 1000,
      updatedAt: now - 3 * 365 * 24 * 60 * 60 * 1000
    },
    {
      id: 'salary-2',
      amount: 5500,
      memo: '이직 시 연봉',
      negotiationDate: now - 2 * 365 * 24 * 60 * 60 * 1000,
      isVisible: true,
      priority: 2,
      career: careers[0], // 테크스타트업
      createdAt: now - 2 * 365 * 24 * 60 * 60 * 1000,
      updatedAt: now - 2 * 365 * 24 * 60 * 60 * 1000
    },
    {
      id: 'salary-3',
      amount: 6000,
      memo: '1년차 연봉 협상',
      negotiationDate: now - 1 * 365 * 24 * 60 * 60 * 1000,
      isVisible: true,
      priority: 3,
      career: careers[0], // 테크스타트업
      createdAt: now - 1 * 365 * 24 * 60 * 60 * 1000,
      updatedAt: now - 1 * 365 * 24 * 60 * 60 * 1000
    },
    {
      id: 'salary-4',
      amount: 7500,
      memo: '현재 회사 입사 시 연봉',
      negotiationDate: now - 1 * 365 * 24 * 60 * 60 * 1000,
      isVisible: true,
      priority: 4,
      career: careers[1], // 글로벌 IT 기업
      createdAt: now - 1 * 365 * 24 * 60 * 60 * 1000,
      updatedAt: now - 1 * 365 * 24 * 60 * 60 * 1000
    },
    {
      id: 'salary-5',
      amount: 8200,
      memo: '올해 연봉 인상',
      negotiationDate: now - 3 * 30 * 24 * 60 * 60 * 1000,
      isVisible: true,
      priority: 5,
      career: careers[1], // 글로벌 IT 기업
      createdAt: now - 3 * 30 * 24 * 60 * 60 * 1000,
      updatedAt: now - 3 * 30 * 24 * 60 * 60 * 1000
    }
  ];
};

// 샘플 Education 데이터
export const createSampleEducations = (): Education[] => {
  const now = Date.now();
  const resume = createSampleResume();
  
  return [
    {
      id: 'edu-1',
      major: '컴퓨터공학',
      name: '서울대학교',
      description: '컴퓨터공학 학사 학위 취득\n- 학점: 4.0/4.5\n- 우수 졸업생 표창',
      status: Education_EducationStatus.GRADUATED,
      startedAt: now - 10 * 365 * 24 * 60 * 60 * 1000, // 10년 전
      endedAt: now - 6 * 365 * 24 * 60 * 60 * 1000, // 6년 전
      isVisible: true,
      priority: 1,
      resume,
      createdAt: now - 10 * 365 * 24 * 60 * 60 * 1000,
      updatedAt: now - 6 * 365 * 24 * 60 * 60 * 1000
    },
    {
      id: 'edu-2',
      major: '소프트웨어공학',
      name: '서울대학교 대학원',
      description: '소프트웨어공학 석사 학위 취득\n- 전공: 분산 시스템\n- 논문: 마이크로서비스 아키텍처의 성능 최적화',
      status: Education_EducationStatus.GRADUATED,
      startedAt: now - 6 * 365 * 24 * 60 * 60 * 1000, // 6년 전
      endedAt: now - 4 * 365 * 24 * 60 * 60 * 1000, // 4년 전
      isVisible: true,
      priority: 2,
      resume,
      createdAt: now - 6 * 365 * 24 * 60 * 60 * 1000,
      updatedAt: now - 4 * 365 * 24 * 60 * 60 * 1000
    },
    {
      id: 'edu-3',
      major: '',
      name: 'React 심화 과정',
      description: '프로그래머스 React 고급 개발 과정 수료\n- React Hooks 심화\n- 상태관리 (Redux, Zustand)\n- 성능 최적화',
      status: Education_EducationStatus.COMPLETED,
      startedAt: now - 3 * 30 * 24 * 60 * 60 * 1000, // 3개월 전
      endedAt: now - 2 * 30 * 24 * 60 * 60 * 1000, // 2개월 전
      isVisible: true,
      priority: 3,
      resume,
      createdAt: now - 3 * 30 * 24 * 60 * 60 * 1000,
      updatedAt: now - 2 * 30 * 24 * 60 * 60 * 1000
    },
    {
      id: 'edu-4',
      major: '',
      name: 'AWS Solutions Architect 자격증 준비 과정',
      description: 'AWS 공식 교육 파트너를 통한 자격증 준비 과정',
      status: Education_EducationStatus.COMPLETED,
      startedAt: now - 8 * 30 * 24 * 60 * 60 * 1000, // 8개월 전
      endedAt: now - 6 * 30 * 24 * 60 * 60 * 1000, // 6개월 전
      isVisible: true,
      priority: 4,
      resume,
      createdAt: now - 8 * 30 * 24 * 60 * 60 * 1000,
      updatedAt: now - 6 * 30 * 24 * 60 * 60 * 1000
    }
  ];
};

// 샘플 Project 데이터
export const createSampleProjects = (): Project[] => {
  const now = Date.now();
  const resume = createSampleResume();
  
  return [
    {
      id: 'project-1',
      title: '전사 통합 인증 시스템 구축',
      affiliation: '테크스타트업',
      role: '백엔드 리드 개발자',
      description: 'MSA 기반 통합 인증 시스템 설계 및 개발\n\n주요 역할:\n- Spring Security + OAuth2 기반 인증 서버 구축\n- JWT 토큰 기반 인증/인가 시스템 구현\n- Redis 기반 세션 관리\n\n기술 스택: Spring Boot, Spring Security, OAuth2, Redis, MySQL, Docker',
      startedAt: now - 18 * 30 * 24 * 60 * 60 * 1000, // 18개월 전
      endedAt: now - 12 * 30 * 24 * 60 * 60 * 1000, // 12개월 전
      isVisible: true,
      priority: 1,
      resume,
      createdAt: now - 18 * 30 * 24 * 60 * 60 * 1000,
      updatedAt: now - 12 * 30 * 24 * 60 * 60 * 1000
    },
    {
      id: 'project-2',
      title: 'AI 기반 추천 엔진 개발',
      affiliation: '글로벌 IT 기업',
      role: '풀스택 개발자',
      description: '사용자 행동 데이터 기반 개인화 추천 시스템\n\n주요 역할:\n- 협업 필터링 알고리즘 구현\n- 실시간 추천 API 개발\n- A/B 테스트 시스템 구축\n\n성과: 클릭률 35% 향상\n\n기술 스택: Python, FastAPI, TensorFlow, Apache Kafka, MongoDB',
      startedAt: now - 10 * 30 * 24 * 60 * 60 * 1000, // 10개월 전
      endedAt: now - 6 * 30 * 24 * 60 * 60 * 1000, // 6개월 전
      isVisible: true,
      priority: 2,
      resume,
      createdAt: now - 10 * 30 * 24 * 60 * 60 * 1000,
      updatedAt: now - 6 * 30 * 24 * 60 * 60 * 1000
    },
    {
      id: 'project-3',
      title: '실시간 채팅 서비스',
      affiliation: '글로벌 IT 기업',
      role: '프론트엔드 리드',
      description: 'WebSocket 기반 실시간 채팅 플랫폼 개발\n\n주요 역할:\n- Socket.io 기반 실시간 통신 구현\n- React로 채팅 UI 개발\n- 메시지 큐잉 및 저장 시스템 구축\n\n성과: 동시 접속자 10만명 처리\n\n기술 스택: Node.js, Socket.io, React, Redis, PostgreSQL',
      startedAt: now - 5 * 30 * 24 * 60 * 60 * 1000, // 5개월 전
      endedAt: now, // 진행중
      isVisible: true,
      priority: 3,
      resume,
      createdAt: now - 5 * 30 * 24 * 60 * 60 * 1000,
      updatedAt: now
    }
  ];
};

// 샘플 Activity 데이터
export const createSampleActivities = (): Activity[] => {
  const now = Date.now();
  const resume = createSampleResume();
  
  return [
    {
      id: 'activity-1',
      name: '오픈소스 프로젝트 기여',
      organization: 'React Core Team',
      certificateNumber: '',
      description: 'React 핵심 라이브러리에 버그 수정 및 기능 개선 PR 제출\n- 총 5개의 PR이 머지됨\n- 성능 최적화 및 타입스크립트 마이그레이션 지원',
      startedAt: now - 12 * 30 * 24 * 60 * 60 * 1000, // 12개월 전
      endedAt: now, // 진행중
      isVisible: true,
      type: Activity_ActivityType.EXTERNAL,
      priority: 1,
      resume,
      createdAt: now - 12 * 30 * 24 * 60 * 60 * 1000,
      updatedAt: now
    },
    {
      id: 'activity-2',
      name: '기술 블로그 운영',
      organization: 'velog.io',
      certificateNumber: '',
      description: '개발 관련 기술 블로그 운영 및 글 작성\n- 월 평균 3-4개 포스팅\n- 누적 방문자 10만명 돌파\n- 주제: React, Node.js, AWS, 시스템 설계',
      startedAt: now - 24 * 30 * 24 * 60 * 60 * 1000, // 24개월 전
      endedAt: now, // 진행중
      isVisible: true,
      type: Activity_ActivityType.EXTERNAL,
      priority: 2,
      resume,
      createdAt: now - 24 * 30 * 24 * 60 * 60 * 1000,
      updatedAt: now
    },
    {
      id: 'activity-3',
      name: '개발자 컨퍼런스 발표',
      organization: 'DEVIEW 2024',
      certificateNumber: 'CERT-DEVIEW-2024-001',
      description: 'DEVIEW 2024 - "대규모 트래픽 처리를 위한 아키텍처 설계"\n- 300명 이상 참석\n- 마이크로서비스 아키텍처 설계 경험 공유',
      startedAt: now - 3 * 30 * 24 * 60 * 60 * 1000, // 3개월 전
      endedAt: now - 3 * 30 * 24 * 60 * 60 * 1000, // 하루 행사
      isVisible: true,
      type: Activity_ActivityType.EXTERNAL,
      priority: 3,
      resume,
      createdAt: now - 3 * 30 * 24 * 60 * 60 * 1000,
      updatedAt: now - 3 * 30 * 24 * 60 * 60 * 1000
    },
    {
      id: 'activity-4',
      name: '스터디 그룹 운영',
      organization: '알고리즘 스터디',
      certificateNumber: '',
      description: '주말 알고리즘 스터디 그룹 운영\n- 매주 토요일 오전 10시\n- 백준, 프로그래머스 문제 풀이\n- 10명 규모의 온라인 스터디',
      startedAt: now - 6 * 30 * 24 * 60 * 60 * 1000, // 6개월 전
      endedAt: now, // 진행중
      isVisible: true,
      type: Activity_ActivityType.EXTERNAL,
      priority: 4,
      resume,
      createdAt: now - 6 * 30 * 24 * 60 * 60 * 1000,
      updatedAt: now
    }
  ];
};

// 샘플 LanguageSkill 데이터
export const createSampleLanguageSkills = (): LanguageSkill[] => {
  const now = Date.now();
  const resume = createSampleResume();
  
  return [
    {
      id: 'lang-skill-1',
      language: LanguageSkill_Language.ENGLISH,
      level: LanguageSkill_LanguageLevel.BUSINESS_CONVERSATION,
      isVisible: true,
      priority: 1,
      resume,
      languageTests: [
        {
          id: 'lang-test-1',
          name: 'TOEIC',
          score: '925',
          acquiredAt: now - 6 * 30 * 24 * 60 * 60 * 1000, // 6개월 전
          isVisible: true,
          priority: 1,
          createdAt: now - 6 * 30 * 24 * 60 * 60 * 1000,
          updatedAt: now - 6 * 30 * 24 * 60 * 60 * 1000
        },
        {
          id: 'lang-test-2',
          name: 'TOEIC Speaking',
          score: 'Level 7',
          acquiredAt: now - 4 * 30 * 24 * 60 * 60 * 1000, // 4개월 전
          isVisible: true,
          priority: 2,
          createdAt: now - 4 * 30 * 24 * 60 * 60 * 1000,
          updatedAt: now - 4 * 30 * 24 * 60 * 60 * 1000
        }
      ],
      createdAt: now - 365 * 24 * 60 * 60 * 1000,
      updatedAt: now
    },
    {
      id: 'lang-skill-2',
      language: LanguageSkill_Language.JAPANESE,
      level: LanguageSkill_LanguageLevel.DAILY_CONVERSATION,
      isVisible: true,
      priority: 2,
      resume,
      languageTests: [
        {
          id: 'lang-test-3',
          name: 'JLPT',
          score: 'N3',
          acquiredAt: now - 12 * 30 * 24 * 60 * 60 * 1000, // 12개월 전
          isVisible: true,
          priority: 1,
          createdAt: now - 12 * 30 * 24 * 60 * 60 * 1000,
          updatedAt: now - 12 * 30 * 24 * 60 * 60 * 1000
        }
      ],
      createdAt: now - 365 * 24 * 60 * 60 * 1000,
      updatedAt: now
    }
  ];
};

// 샘플 LanguageTest 데이터 (단독)
export const createSampleLanguageTests = (): LanguageTest[] => {
  const now = Date.now();
  
  return [
    {
      id: 'lang-test-1',
      name: 'TOEIC',
      score: '925',
      acquiredAt: now - 6 * 30 * 24 * 60 * 60 * 1000, // 6개월 전
      isVisible: true,
      priority: 1,
      createdAt: now - 6 * 30 * 24 * 60 * 60 * 1000,
      updatedAt: now - 6 * 30 * 24 * 60 * 60 * 1000
    },
    {
      id: 'lang-test-2',
      name: 'TOEIC Speaking',
      score: 'Level 7',
      acquiredAt: now - 4 * 30 * 24 * 60 * 60 * 1000, // 4개월 전
      isVisible: true,
      priority: 2,
      createdAt: now - 4 * 30 * 24 * 60 * 60 * 1000,
      updatedAt: now - 4 * 30 * 24 * 60 * 60 * 1000
    },
    {
      id: 'lang-test-3',
      name: 'JLPT',
      score: 'N3',
      acquiredAt: now - 12 * 30 * 24 * 60 * 60 * 1000, // 12개월 전
      isVisible: true,
      priority: 3,
      createdAt: now - 12 * 30 * 24 * 60 * 60 * 1000,
      updatedAt: now - 12 * 30 * 24 * 60 * 60 * 1000
    }
  ];
};

// 샘플 Attachment 데이터
export const createSampleAttachments = (): Attachment[] => {
  const now = Date.now();
  const resume = createSampleResume();
  
  return [
    {
      id: 'attach-1',
      fileName: '',
      fileUrl: 'https://example.com/files/portfolio.pdf',
      isVisible: true,
      priority: 1,
      type: Attachment_AttachmentType.RESUME,
      resume,
      createdAt: now - 30 * 24 * 60 * 60 * 1000,
      updatedAt: now - 30 * 24 * 60 * 60 * 1000
    },
    {
      id: 'attach-2',
      fileName: '자기소개서.pdf',
      fileUrl: '',
      isVisible: true,
      priority: 2,
      type: Attachment_AttachmentType.CERTIFICATE,
      resume,
      createdAt: now - 20 * 24 * 60 * 60 * 1000,
      updatedAt: now - 20 * 24 * 60 * 60 * 1000
    },
    {
      id: 'attach-3',
      fileName: '',
      fileUrl: 'https://github.com/honggildong',
      isVisible: true,
      priority: 3,
      type: Attachment_AttachmentType.PORTFOLIO,
      resume,
      createdAt: now - 10 * 24 * 60 * 60 * 1000,
      updatedAt: now - 10 * 24 * 60 * 60 * 1000
    },
    {
      id: 'attach-4',
      fileName: '',
      fileUrl: 'https://blog.honggildong.com',
      isVisible: true,
      priority: 4,
      type: Attachment_AttachmentType.PORTFOLIO,
      resume,
      createdAt: now - 5 * 24 * 60 * 60 * 1000,
      updatedAt: now - 5 * 24 * 60 * 60 * 1000
    }
  ];
};

// 샘플 이직 데이터
export const createSampleJobSearches = (): JobSearch[] => {
  const now = Date.now();
  const worker = createSampleWorker();
  const careers = createSampleCareers();

  return [
    {
      id: 'jobsearch-1',
      title: '2024년 상반기 이직 활동',
      startedAt: now - 6 * 30 * 24 * 60 * 60 * 1000, // 6개월 전
      endedAt: now - 3 * 30 * 24 * 60 * 60 * 1000, // 3개월 전
      memo: '대기업 중심으로 이직 활동을 진행했습니다. 총 15개 회사에 지원하여 3개 회사에서 최종 면접까지 진행했습니다.',
      worker,
      prevCareer: careers[0], // 테크스타트업
      nextCareer: careers[1], // 글로벌 IT 기업
      createdAt: now - 6 * 30 * 24 * 60 * 60 * 1000,
      updatedAt: now - 3 * 30 * 24 * 60 * 60 * 1000
    },
    {
      id: 'jobsearch-2',
      title: '2023년 하반기 이직 활동',
      startedAt: now - 12 * 30 * 24 * 60 * 60 * 1000, // 12개월 전
      endedAt: now - 8 * 30 * 24 * 60 * 60 * 1000, // 8개월 전
      memo: '스타트업과 중견기업을 중심으로 이직 활동을 진행했습니다. 개발자 커뮤니티를 통해 많은 기회를 얻을 수 있었습니다.',
      worker,
      prevCareer: careers[2], // 중견 소프트웨어 회사
      nextCareer: careers[0], // 테크스타트업
      createdAt: now - 12 * 30 * 24 * 60 * 60 * 1000,
      updatedAt: now - 8 * 30 * 24 * 60 * 60 * 1000
    }
  ];
};

// 샘플 이직 회사 데이터
export const createSampleJobSearchCompanies = (jobSearchId: string): JobSearchCompany[] => {
  const now = Date.now();
  const worker = createSampleWorker();
  
  return [
    {
      id: 'jobsearchcompany-1',
      name: '네이버',
      status: JobSearchCompany_Status.REJECTED,
      appliedAt: now - 5 * 30 * 24 * 60 * 60 * 1000, // 5개월 전
      closedAt: now - 4 * 30 * 24 * 60 * 60 * 1000, // 4개월 전
      endedAt: now - 4 * 30 * 24 * 60 * 60 * 1000,
      link: 'https://careers.naver.com',
      jobSearch: {
        id: jobSearchId,
        title: '2024년 상반기 이직 활동',
        startedAt: now - 6 * 30 * 24 * 60 * 60 * 1000,
        endedAt: now - 3 * 30 * 24 * 60 * 60 * 1000,
        memo: '대기업 중심으로 이직 활동을 진행했습니다.',
        worker,
        createdAt: now - 6 * 30 * 24 * 60 * 60 * 1000,
        updatedAt: now - 3 * 30 * 24 * 60 * 60 * 1000
      },
      createdAt: now - 5 * 30 * 24 * 60 * 60 * 1000,
      updatedAt: now - 4 * 30 * 24 * 60 * 60 * 1000
    },
    {
      id: 'jobsearchcompany-2',
      name: '카카오',
      status: JobSearchCompany_Status.PASSED,
      appliedAt: now - 5 * 30 * 24 * 60 * 60 * 1000, // 5개월 전
      closedAt: now - 4 * 30 * 24 * 60 * 60 * 1000, // 4개월 전
      endedAt: now - 4 * 30 * 24 * 60 * 60 * 1000,
      link: 'https://careers.kakao.com',
      jobSearch: {
        id: jobSearchId,
        title: '2024년 상반기 이직 활동',
        startedAt: now - 6 * 30 * 24 * 60 * 60 * 1000,
        endedAt: now - 3 * 30 * 24 * 60 * 60 * 1000,
        memo: '대기업 중심으로 이직 활동을 진행했습니다.',
        worker,
        createdAt: now - 6 * 30 * 24 * 60 * 60 * 1000,
        updatedAt: now - 3 * 30 * 24 * 60 * 60 * 1000
      },
      createdAt: now - 5 * 30 * 24 * 60 * 60 * 1000,
      updatedAt: now - 4 * 30 * 24 * 60 * 60 * 1000
    },
    {
      id: 'jobsearchcompany-3',
      name: '당근마켓',
      status: JobSearchCompany_Status.INTERVIEWING,
      appliedAt: now - 4 * 30 * 24 * 60 * 60 * 1000, // 4개월 전
      closedAt: 0, // 아직 마감되지 않음
      endedAt: undefined,
      link: 'https://about.daangn.com/careers',
      jobSearch: {
        id: jobSearchId,
        title: '2024년 상반기 이직 활동',
        startedAt: now - 6 * 30 * 24 * 60 * 60 * 1000,
        endedAt: now - 3 * 30 * 24 * 60 * 60 * 1000,
        memo: '대기업 중심으로 이직 활동을 진행했습니다.',
        worker,
        createdAt: now - 6 * 30 * 24 * 60 * 60 * 1000,
        updatedAt: now - 3 * 30 * 24 * 60 * 60 * 1000
      },
      createdAt: now - 4 * 30 * 24 * 60 * 60 * 1000,
      updatedAt: now - 1 * 30 * 24 * 60 * 60 * 1000
    },
    {
      id: 'jobsearchcompany-4',
      name: '토스',
      status: JobSearchCompany_Status.APPLIED,
      appliedAt: now - 3 * 30 * 24 * 60 * 60 * 1000, // 3개월 전
      closedAt: 0, // 아직 마감되지 않음
      endedAt: undefined,
      link: 'https://toss.im/careers',
      jobSearch: {
        id: jobSearchId,
        title: '2024년 상반기 이직 활동',
        startedAt: now - 6 * 30 * 24 * 60 * 60 * 1000,
        endedAt: now - 3 * 30 * 24 * 60 * 60 * 1000,
        memo: '대기업 중심으로 이직 활동을 진행했습니다.',
        worker,
        createdAt: now - 6 * 30 * 24 * 60 * 60 * 1000,
        updatedAt: now - 3 * 30 * 24 * 60 * 60 * 1000
      },
      createdAt: now - 3 * 30 * 24 * 60 * 60 * 1000,
      updatedAt: now - 3 * 30 * 24 * 60 * 60 * 1000
    },
    {
      id: 'jobsearchcompany-5',
      name: '쿠팡',
      status: JobSearchCompany_Status.INTERESTED,
      appliedAt: now - 2 * 30 * 24 * 60 * 60 * 1000, // 2개월 전
      closedAt: 0, // 아직 마감되지 않음
      endedAt: undefined,
      link: 'https://www.coupang.jobs',
      jobSearch: {
        id: jobSearchId,
        title: '2024년 상반기 이직 활동',
        startedAt: now - 6 * 30 * 24 * 60 * 60 * 1000,
        endedAt: now - 3 * 30 * 24 * 60 * 60 * 1000,
        memo: '대기업 중심으로 이직 활동을 진행했습니다.',
        worker,
        createdAt: now - 6 * 30 * 24 * 60 * 60 * 1000,
        updatedAt: now - 3 * 30 * 24 * 60 * 60 * 1000
      },
      createdAt: now - 2 * 30 * 24 * 60 * 60 * 1000,
      updatedAt: now - 2 * 30 * 24 * 60 * 60 * 1000
    }
  ];
};

// 샘플 면접 데이터
export const createSampleInterviews = (jobSearchCompanyId: string, jobSearchId: string): Interview[] => {
  const now = Date.now();
  const worker = createSampleWorker();
  
  return [
    {
      id: 'interview-1',
      title: '1차 기술 면접',
      type: Interview_Type.OFFLINE,
      startedAt: now - 3 * 30 * 24 * 60 * 60 * 1000, // 3개월 전
      endedAt: now - 3 * 30 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000, // 2시간 후
      memo: '알고리즘 문제 해결과 시스템 설계에 대한 질문이 주를 이뤘습니다. 코딩 테스트는 중간 수준이었고, 시스템 설계는 대용량 트래픽 처리에 대한 질문이 나왔습니다.',
      jobSearchCompany: {
        id: jobSearchCompanyId,
        name: '당근마켓',
        status: JobSearchCompany_Status.INTERVIEWING,
        appliedAt: now - 4 * 30 * 24 * 60 * 60 * 1000,
        closedAt: 0,
        endedAt: undefined,
        link: 'https://about.daangn.com/careers',
        jobSearch: {
          id: jobSearchId,
          title: '2024년 상반기 이직 활동',
          startedAt: now - 6 * 30 * 24 * 60 * 60 * 1000,
          endedAt: now - 3 * 30 * 24 * 60 * 60 * 1000,
          memo: '대기업 중심으로 이직 활동을 진행했습니다.',
          worker,
          createdAt: now - 6 * 30 * 24 * 60 * 60 * 1000,
          updatedAt: now - 3 * 30 * 24 * 60 * 60 * 1000
        },
        createdAt: now - 4 * 30 * 24 * 60 * 60 * 1000,
        updatedAt: now - 1 * 30 * 24 * 60 * 60 * 1000
      },
      createdAt: now - 3 * 30 * 24 * 60 * 60 * 1000,
      updatedAt: now - 3 * 30 * 24 * 60 * 60 * 1000
    },
    {
      id: 'interview-2',
      title: '2차 문화 적합성 면접',
      type: Interview_Type.OFFLINE,
      startedAt: now - 2 * 30 * 24 * 60 * 60 * 1000, // 2개월 전
      endedAt: now - 2 * 30 * 24 * 60 * 60 * 1000 + 1.5 * 60 * 60 * 1000, // 1.5시간 후
      memo: '팀워크, 커뮤니케이션 스타일, 회사 문화에 대한 질문이 많았습니다. 이전 프로젝트에서의 협업 경험과 갈등 해결 방법에 대해 자세히 이야기했습니다.',
      jobSearchCompany: {
        id: jobSearchCompanyId,
        name: '당근마켓',
        status: JobSearchCompany_Status.INTERVIEWING,
        appliedAt: now - 4 * 30 * 24 * 60 * 60 * 1000,
        closedAt: 0,
        endedAt: undefined,
        link: 'https://about.daangn.com/careers',
        jobSearch: {
          id: jobSearchId,
          title: '2024년 상반기 이직 활동',
          startedAt: now - 6 * 30 * 24 * 60 * 60 * 1000,
          endedAt: now - 3 * 30 * 24 * 60 * 60 * 1000,
          memo: '대기업 중심으로 이직 활동을 진행했습니다.',
          worker,
          createdAt: now - 6 * 30 * 24 * 60 * 60 * 1000,
          updatedAt: now - 3 * 30 * 24 * 60 * 60 * 1000
        },
        createdAt: now - 4 * 30 * 24 * 60 * 60 * 1000,
        updatedAt: now - 1 * 30 * 24 * 60 * 60 * 1000
      },
      createdAt: now - 2 * 30 * 24 * 60 * 60 * 1000,
      updatedAt: now - 2 * 30 * 24 * 60 * 60 * 1000
    },
    {
      id: 'interview-3',
      title: '최종 면접',
      type: Interview_Type.OFFLINE,
      startedAt: now - 1 * 30 * 24 * 60 * 60 * 1000, // 1개월 전
      endedAt: now - 1 * 30 * 24 * 60 * 60 * 1000 + 2.5 * 60 * 60 * 1000, // 2.5시간 후
      memo: 'CTO와의 최종 면접이었습니다. 기술적 역량과 리더십, 회사 비전에 대한 질문이 주를 이뤘습니다. 결과는 아직 기다리고 있는 상태입니다.',
      jobSearchCompany: {
        id: jobSearchCompanyId,
        name: '당근마켓',
        status: JobSearchCompany_Status.INTERVIEWING,
        appliedAt: now - 4 * 30 * 24 * 60 * 60 * 1000,
        closedAt: 0,
        endedAt: undefined,
        link: 'https://about.daangn.com/careers',
        jobSearch: {
          id: jobSearchId,
          title: '2024년 상반기 이직 활동',
          startedAt: now - 6 * 30 * 24 * 60 * 60 * 1000,
          endedAt: now - 3 * 30 * 24 * 60 * 60 * 1000,
          memo: '대기업 중심으로 이직 활동을 진행했습니다.',
          worker,
          createdAt: now - 6 * 30 * 24 * 60 * 60 * 1000,
          updatedAt: now - 3 * 30 * 24 * 60 * 60 * 1000
        },
        createdAt: now - 4 * 30 * 24 * 60 * 60 * 1000,
        updatedAt: now - 1 * 30 * 24 * 60 * 60 * 1000
      },
      createdAt: now - 1 * 30 * 24 * 60 * 60 * 1000,
      updatedAt: now - 1 * 30 * 24 * 60 * 60 * 1000
    }
  ];
};

// ===== 추가 샘플 이력서 데이터 (10세트) =====

// 1. 백엔드 개발자
export const createSampleResume2 = () => {
  const now = Date.now();
  const worker: Worker = {
    id: 'worker-2',
    name: '김민준',
    nickName: '김민준',
    createdAt: now - 365 * 24 * 60 * 60 * 1000,
    updatedAt: now
  };

  const resume: Resume = {
    id: 'resume-2',
    title: '김민준_백엔드개발자',
    name: '김민준',
    phone: '010-2345-6789',
    email: 'minjun.kim@example.com',
    birthDate: now - 28 * 365 * 24 * 60 * 60 * 1000,
    gender: Resume_Gender.MALE,
    job: '백엔드 개발자',
    description: 'Spring Boot와 MSA 아키텍처에 능숙한 5년차 백엔드 개발자입니다.',
    isDefault: false,
    publicId: 'minjun-backend',
    worker,
    createdAt: now - 180 * 24 * 60 * 60 * 1000,
    updatedAt: now - 10 * 24 * 60 * 60 * 1000
  };

  const careers: Career[] = [
    {
      id: 'career-2-1',
      name: '네이버',
      position: '백엔드 개발자',
      department: '검색서비스팀',
      employmentType: Career_EmploymentType.FULL_TIME,
      jobGrade: '시니어',
      job: '백엔드 개발자',
      salary: 8500,
      description: '검색 API 개발 및 최적화\n- Elasticsearch 기반 검색 엔진 구축\n- Redis 캐싱 시스템 도입',
      isVisible: true,
      priority: 1,
      startedAt: now - 5 * 365 * 24 * 60 * 60 * 1000,
      endedAt: 0,
      isWorking: true,
      resume,
      achievements: [],
      salaries: [],
      createdAt: now - 5 * 365 * 24 * 60 * 60 * 1000,
      updatedAt: now
    }
  ];

  const educations: Education[] = [
    {
      id: 'education-2-1',
      major: '컴퓨터공학',
      name: '서울대학교',
      description: '학점 4.0/4.5',
      status: Education_EducationStatus.GRADUATED,
      startedAt: now - 10 * 365 * 24 * 60 * 60 * 1000,
      endedAt: now - 6 * 365 * 24 * 60 * 60 * 1000,
      isVisible: true,
      priority: 1,
      resume,
      createdAt: now - 180 * 24 * 60 * 60 * 1000,
      updatedAt: now
    }
  ];

  const projects: Project[] = [
    {
      id: 'project-2-1',
      title: '검색 서비스 리뉴얼',
      affiliation: '네이버',
      role: '백엔드 리드',
      description: 'Elasticsearch 기반 검색 엔진 구축',
      startedAt: now - 365 * 24 * 60 * 60 * 1000,
      endedAt: now - 180 * 24 * 60 * 60 * 1000,
      isVisible: true,
      priority: 1,
      resume,
      createdAt: now - 365 * 24 * 60 * 60 * 1000,
      updatedAt: now
    }
  ];

  const activities: Activity[] = [
    {
      id: 'activity-2-1',
      name: 'Spring 밋업 발표',
      organization: 'Spring Korea User Group',
      certificateNumber: '',
      description: 'Spring WebFlux 성능 최적화 사례 공유',
      startedAt: now - 200 * 24 * 60 * 60 * 1000,
      endedAt: now - 200 * 24 * 60 * 60 * 1000,
      isVisible: true,
      type: Activity_ActivityType.EXTERNAL,
      priority: 1,
      resume,
      createdAt: now - 200 * 24 * 60 * 60 * 1000,
      updatedAt: now
    }
  ];

  const languageSkills: LanguageSkill[] = [
    {
      id: 'lang-2-1',
      language: LanguageSkill_Language.ENGLISH,
      level: LanguageSkill_LanguageLevel.BUSINESS_CONVERSATION,
      isVisible: true,
      priority: 1,
      resume,
      languageTests: [],
      createdAt: now - 180 * 24 * 60 * 60 * 1000,
      updatedAt: now
    }
  ];

  const attachments: Attachment[] = [];

  return { resume, careers, educations, projects, activities, languageSkills, attachments };
};

// 2. 프론트엔드 개발자
export const createSampleResume3 = () => {
  const now = Date.now();
  const worker: Worker = {
    id: 'worker-3',
    name: '이지은',
    nickName: '이지은',
    createdAt: now - 365 * 24 * 60 * 60 * 1000,
    updatedAt: now
  };

  const resume: Resume = {
    id: 'resume-3',
    title: '이지은_프론트엔드개발자',
    name: '이지은',
    phone: '010-3456-7890',
    email: 'jieun.lee@example.com',
    birthDate: now - 26 * 365 * 24 * 60 * 60 * 1000,
    gender: Resume_Gender.FEMALE,
    job: '프론트엔드 개발자',
    description: 'React와 Next.js를 주력으로 사용하는 3년차 프론트엔드 개발자입니다.',
    isDefault: false,
    publicId: 'jieun-frontend',
    worker,
    createdAt: now - 150 * 24 * 60 * 60 * 1000,
    updatedAt: now - 5 * 24 * 60 * 60 * 1000
  };

  const careers: Career[] = [
    {
      id: 'career-3-1',
      name: '토스',
      position: '프론트엔드 개발자',
      department: 'Core팀',
      employmentType: Career_EmploymentType.FULL_TIME,
      jobGrade: '주니어',
      job: '프론트엔드 개발자',
      salary: 7000,
      description: 'React 기반 웹 앱 개발\n- 컴포넌트 라이브러리 구축\n- Lighthouse 성능 점수 90점 달성',
      isVisible: true,
      priority: 1,
      startedAt: now - 3 * 365 * 24 * 60 * 60 * 1000,
      endedAt: 0,
      isWorking: true,
      resume,
      achievements: [],
      salaries: [],
      createdAt: now - 3 * 365 * 24 * 60 * 60 * 1000,
      updatedAt: now
    }
  ];

  const educations: Education[] = [
    {
      id: 'education-3-1',
      major: '정보시스템학',
      name: '연세대학교',
      description: '학점 3.8/4.5',
      status: Education_EducationStatus.GRADUATED,
      startedAt: now - 8 * 365 * 24 * 60 * 60 * 1000,
      endedAt: now - 4 * 365 * 24 * 60 * 60 * 1000,
      isVisible: true,
      priority: 1,
      resume,
      createdAt: now - 150 * 24 * 60 * 60 * 1000,
      updatedAt: now
    }
  ];

  const projects: Project[] = [
    {
      id: 'project-3-1',
      title: '디자인 시스템 구축',
      affiliation: '토스',
      role: '프론트엔드 리드',
      description: 'Storybook 기반 컴포넌트 라이브러리 개발',
      startedAt: now - 300 * 24 * 60 * 60 * 1000,
      endedAt: now - 150 * 24 * 60 * 60 * 1000,
      isVisible: true,
      priority: 1,
      resume,
      createdAt: now - 300 * 24 * 60 * 60 * 1000,
      updatedAt: now
    }
  ];

  const activities: Activity[] = [];
  const languageSkills: LanguageSkill[] = [
    {
      id: 'lang-3-1',
      language: LanguageSkill_Language.ENGLISH,
      level: LanguageSkill_LanguageLevel.BUSINESS_CONVERSATION,
      isVisible: true,
      priority: 1,
      resume,
      languageTests: [],
      createdAt: now - 150 * 24 * 60 * 60 * 1000,
      updatedAt: now
    }
  ];
  const attachments: Attachment[] = [];

  return { resume, careers, educations, projects, activities, languageSkills, attachments };
};

// 3. UX/UI 디자이너
export const createSampleResume4 = () => {
  const now = Date.now();
  const worker: Worker = {
    id: 'worker-4',
    name: '박서연',
    nickName: '박서연',
    createdAt: now - 365 * 24 * 60 * 60 * 1000,
    updatedAt: now
  };

  const resume: Resume = {
    id: 'resume-4',
    title: '박서연_UX디자이너',
    name: '박서연',
    phone: '010-4567-8901',
    email: 'seoyeon.park@example.com',
    birthDate: now - 29 * 365 * 24 * 60 * 60 * 1000,
    gender: Resume_Gender.FEMALE,
    job: 'UX/UI 디자이너',
    description: '사용자 중심의 디자인을 추구하는 7년차 UX 디자이너입니다.',
    isDefault: false,
    publicId: 'seoyeon-designer',
    worker,
    createdAt: now - 200 * 24 * 60 * 60 * 1000,
    updatedAt: now - 15 * 24 * 60 * 60 * 1000
  };

  const careers: Career[] = [
    {
      id: 'career-4-1',
      name: '카카오',
      job: 'UX 디자이너',
      position: 'UX 디자이너',
      startedAt: now - 4 * 365 * 24 * 60 * 60 * 1000,
      endedAt: 0,
      isWorking: true,
      employmentType: Career_EmploymentType.FULL_TIME,
      salary: 68000000,
      department: '카카오페이팀',
      jobGrade: '시니어',
      description: '카카오페이 앱 UX 개선',
      isVisible: true,
      achievements: [
        {
          id: 'achievement-4-1',
          title: 'MAU 20% 증가',
          role: 'UX 디자이너',
          description: 'MAU 20% 증가',
          isVisible: true,
          createdAt: now - 4 * 365 * 24 * 60 * 60 * 1000,
          updatedAt: now - 4 * 365 * 24 * 60 * 60 * 1000
        },
        {
          id: 'achievement-4-2',
          title: '사용성 테스트 프로세스 구축',
          role: 'UX 디자이너',
          description: '사용성 테스트 프로세스 구축',
          isVisible: true,
          createdAt: now - 4 * 365 * 24 * 60 * 60 * 1000,
          updatedAt: now - 4 * 365 * 24 * 60 * 60 * 1000
        }
      ],
      salaries: [],
      priority: 1,
      resume,
      createdAt: now - 4 * 365 * 24 * 60 * 60 * 1000,
      updatedAt: now
    },
    {
      id: 'career-4-2',
      name: '우아한형제들',
      job: 'UI 디자이너',
      position: 'UI 디자이너',
      startedAt: now - 7 * 365 * 24 * 60 * 60 * 1000,
      endedAt: now - 4 * 365 * 24 * 60 * 60 * 1000,
      isWorking: false,
      employmentType: Career_EmploymentType.FULL_TIME,
      salary: 55000000,
      department: '배민앱팀',
      jobGrade: '주니어',
      description: '배민 앱 UI 디자인',
      isVisible: true,
      achievements: [
        {
          id: 'achievement-4-1',
          title: '리브랜딩 프로젝트 참여',
          role: 'UI 디자이너',
          description: '리브랜딩 프로젝트 참여',
          isVisible: true,
          createdAt: now - 7 * 365 * 24 * 60 * 60 * 1000,
          updatedAt: now - 7 * 365 * 24 * 60 * 60 * 1000
        }
      ],
      salaries: [],
      priority: 1,
      resume,
      createdAt: now - 7 * 365 * 24 * 60 * 60 * 1000,
      updatedAt: now
    }
  ];

  const educations: Education[] = [
    {
      id: 'education-4-1',
      name: '홍익대학교',
      major: '시각디자인',
      startedAt: now - 11 * 365 * 24 * 60 * 60 * 1000,
      endedAt: now - 7 * 365 * 24 * 60 * 60 * 1000,
      status: Education_EducationStatus.GRADUATED,
      description: '학점 3.9/4.5',
      isVisible: true,
      priority: 1,
      resume,
      createdAt: now - 200 * 24 * 60 * 60 * 1000,
      updatedAt: now
    }
  ];

  const projects: Project[] = [
    {
      id: 'project-4-1',
      title: '카카오페이 리디자인',
      affiliation: '카카오',
      role: 'UX 디자이너',
      startedAt: now - 400 * 24 * 60 * 60 * 1000,
      endedAt: now - 300 * 24 * 60 * 60 * 1000,
      description: '사용자 경험 개선을 위한 전면 리디자인',
      isVisible: true,
      priority: 1,
      resume,
      createdAt: now - 400 * 24 * 60 * 60 * 1000,
      updatedAt: now
    }
  ];

  const activities: Activity[] = [
    {
      id: 'activity-4-1',
      name: 'UX Korea 컨퍼런스 발표',
      type: Activity_ActivityType.EXTERNAL,
      organization: 'UX Korea',
      certificateNumber: '',
      startedAt: now - 180 * 24 * 60 * 60 * 1000,
      endedAt: now - 180 * 24 * 60 * 60 * 1000,
      description: '사용자 리서치 방법론 공유',
      isVisible: true,
      priority: 1,
      resume,
      createdAt: now - 180 * 24 * 60 * 60 * 1000,
      updatedAt: now
    }
  ];

  const languageSkills: LanguageSkill[] = [];
  const attachments: Attachment[] = [
    {
      id: 'attachment-4-1',
      fileName: 'portfolio.pdf',
      fileUrl: 'https://example.com/portfolio.pdf',
      type: Attachment_AttachmentType.RESUME,
      isVisible: true,
      priority: 1,
      resume,
      createdAt: now - 200 * 24 * 60 * 60 * 1000,
      updatedAt: now
    }
  ];

  return { resume, careers, educations, projects, activities, languageSkills, attachments };
};

// 4. 프로덕트 매니저
export const createSampleResume5 = () => {
  const now = Date.now();
  const worker: Worker = {
    id: 'worker-5',
    name: '최준호',
    nickName: '최준호',
    createdAt: now - 365 * 24 * 60 * 60 * 1000,
    updatedAt: now
  };

  const resume: Resume = {
    id: 'resume-5',
    title: '최준호_프로덕트매니저',
    name: '최준호',
    phone: '010-5678-9012',
    email: 'junho.choi@example.com',
    birthDate: now - 32 * 365 * 24 * 60 * 60 * 1000,
    gender: Resume_Gender.MALE,
    job: '프로덕트 매니저',
    description: '데이터 기반 의사결정을 중시하는 8년차 PM입니다.',
    isDefault: false,
    publicId: 'junho-pm',
    worker,
    createdAt: now - 220 * 24 * 60 * 60 * 1000,
    updatedAt: now - 20 * 24 * 60 * 60 * 1000
  };

  const careers: Career[] = [
    {
      id: 'career-5-1',
      name: '쿠팡',
      job: 'Product Manager',
      position: 'Product Manager',
      startedAt: now - 5 * 365 * 24 * 60 * 60 * 1000,
      endedAt: 0,
      isWorking: true,
      employmentType: Career_EmploymentType.FULL_TIME,
      salary: 95000000,
      department: '로켓배송팀',
      jobGrade: '시니어',
      description: '로켓배송 서비스 기획 및 개선',
      isVisible: true,
      achievements: [
        {
          id: 'achievement-5-1',
          title: '배송 만족도 15% 상승',
          role: 'Product Manager',
          description: '배송 만족도 15% 상승',
          isVisible: true,
          createdAt: now - 5 * 365 * 24 * 60 * 60 * 1000,
          updatedAt: now - 5 * 365 * 24 * 60 * 60 * 1000
        },
        {
          id: 'achievement-5-2',
          title: '신규 기능 론칭 10+',
          role: 'Product Manager',
          description: '신규 기능 론칭 10+',
          isVisible: true,
          createdAt: now - 5 * 365 * 24 * 60 * 60 * 1000,
          updatedAt: now - 5 * 365 * 24 * 60 * 60 * 1000
        }
      ],
      salaries: [],
      priority: 1,
      resume,
      createdAt: now - 5 * 365 * 24 * 60 * 60 * 1000,
      updatedAt: now
    },
    {
      id: 'career-5-2',
      name: '라인',
      job: 'Product Manager',
      position: 'Associate PM',
      startedAt: now - 8 * 365 * 24 * 60 * 60 * 1000,
      endedAt: now - 5 * 365 * 24 * 60 * 60 * 1000,
      isWorking: false,
      employmentType: Career_EmploymentType.FULL_TIME,
      salary: 65000000,
      department: '메신저팀',
      jobGrade: '주니어',
      description: '라인 메신저 신규 기능 기획',
      isVisible: true,
      achievements: [
        {
          id: 'achievement-5-1',
          title: '스티커 구매율 25% 증가',
          role: 'Product Manager',
          description: '스티커 구매율 25% 증가',
          isVisible: true,
          createdAt: now - 8 * 365 * 24 * 60 * 60 * 1000,
          updatedAt: now - 8 * 365 * 24 * 60 * 60 * 1000
        }
      ],
      salaries: [],
      priority: 1,
      resume,
      createdAt: now - 8 * 365 * 24 * 60 * 60 * 1000,
      updatedAt: now
    }
  ];

  const educations: Education[] = [
    {
      id: 'education-5-1',
      name: '고려대학교',
      major: '경영학',
      startedAt: now - 14 * 365 * 24 * 60 * 60 * 1000,
      endedAt: now - 10 * 365 * 24 * 60 * 60 * 1000,
      status: Education_EducationStatus.GRADUATED,
      description: '학점 4.2/4.5',
      isVisible: true,
      priority: 1,
      resume,
      createdAt: now - 220 * 24 * 60 * 60 * 1000,
      updatedAt: now
    }
  ];

  const projects: Project[] = [
    {
      id: 'project-5-1',
      title: '로켓배송 최적화 프로젝트',
      affiliation: '쿠팡',
      role: 'Product Manager',
      startedAt: now - 450 * 24 * 60 * 60 * 1000,
      endedAt: now - 300 * 24 * 60 * 60 * 1000,
      description: 'AI 기반 배송 경로 최적화',
      isVisible: true,
      priority: 1,
      resume,
      createdAt: now - 450 * 24 * 60 * 60 * 1000,
      updatedAt: now
    }
  ];

  const activities: Activity[] = [];
  const languageSkills: LanguageSkill[] = [
    {
      id: 'lang-5-1',
      language: LanguageSkill_Language.ENGLISH,
      level: LanguageSkill_LanguageLevel.NATIVE_LEVEL,
      languageTests: [
        {
          id: 'lang-test-5-1',
          name: 'TOEIC',
          score: '925',
          acquiredAt: now - 220 * 24 * 60 * 60 * 1000,
          isVisible: true,
          priority: 1,
          createdAt: now - 220 * 24 * 60 * 60 * 1000,
          updatedAt: now - 220 * 24 * 60 * 60 * 1000
        }
      ],
      isVisible: true,
      priority: 1,
      resume,
      createdAt: now - 220 * 24 * 60 * 60 * 1000,
      updatedAt: now
    }
  ];
  const attachments: Attachment[] = [];

  return { resume, careers, educations, projects, activities, languageSkills, attachments };
};

// 5. 데이터 분석가
export const createSampleResume6 = () => {
  const now = Date.now();
  const worker: Worker = {
    id: 'worker-6',
    name: '정수빈',
    nickName: '정수빈',
    createdAt: now - 365 * 24 * 60 * 60 * 1000,
    updatedAt: now
  };

  const resume: Resume = {
    id: 'resume-6',
    title: '정수빈_데이터분석가',
    name: '정수빈',
    phone: '010-6789-0123',
    email: 'subin.jung@example.com',
    birthDate: now - 27 * 365 * 24 * 60 * 60 * 1000,
    gender: Resume_Gender.FEMALE,
    job: '데이터 분석가',
    description: 'Python과 SQL을 활용한 데이터 분석 전문가입니다.',
    isDefault: false,
    publicId: 'subin-analyst',
    worker,
    createdAt: now - 170 * 24 * 60 * 60 * 1000,
    updatedAt: now - 8 * 24 * 60 * 60 * 1000
  };

  const careers: Career[] = [
    {
      id: 'career-6-1',
      name: '넷플릭스',
      job: 'Data Analyst',
      position: 'Data Analyst',
      startedAt: now - 4 * 365 * 24 * 60 * 60 * 1000,
      endedAt: 0,
      isWorking: true,
      employmentType: Career_EmploymentType.FULL_TIME,
      salary: 78000000,
      department: 'Growth팀',
      jobGrade: '미드',
      description: '사용자 행동 데이터 분석',
      isVisible: true,
      achievements: [
        {
          id: 'achievement-6-1',
          title: 'A/B 테스트로 전환율 18% 개선',
          role: 'Data Analyst',
          description: 'A/B 테스트로 전환율 18% 개선',
          isVisible: true,
          createdAt: now - 4 * 365 * 24 * 60 * 60 * 1000,
          updatedAt: now - 4 * 365 * 24 * 60 * 60 * 1000
        },
        {
          id: 'achievement-6-2',
          title: '대시보드 자동화',
          role: 'Data Analyst',
          description: '대시보드 자동화',
          isVisible: true,
          createdAt: now - 4 * 365 * 24 * 60 * 60 * 1000,
          updatedAt: now - 4 * 365 * 24 * 60 * 60 * 1000
        }
      ],
      salaries: [],
      priority: 1,
      resume,
      createdAt: now - 4 * 365 * 24 * 60 * 60 * 1000,
      updatedAt: now
    }
  ];

  const educations: Education[] = [
    {
      id: 'education-6-1',
      name: '카이스트',
      major: '산업공학',
      startedAt: now - 9 * 365 * 24 * 60 * 60 * 1000,
      endedAt: now - 5 * 365 * 24 * 60 * 60 * 1000,
      status: Education_EducationStatus.GRADUATED,
      description: '학점 4.1/4.5',
      isVisible: true,
      priority: 1,
      resume,
      createdAt: now - 170 * 24 * 60 * 60 * 1000,
      updatedAt: now
    }
  ];

  const projects: Project[] = [
    {
      id: 'project-6-1',
      title: '추천 알고리즘 개선',
      affiliation: '넷플릭스',
      role: 'Data Analyst',
      startedAt: now - 350 * 24 * 60 * 60 * 1000,
      endedAt: now - 200 * 24 * 60 * 60 * 1000,
      description: '머신러닝 기반 콘텐츠 추천 시스템',
      isVisible: true,
      priority: 1,
      resume,
      createdAt: now - 350 * 24 * 60 * 60 * 1000,
      updatedAt: now
    }
  ];

  const activities: Activity[] = [];
  const languageSkills: LanguageSkill[] = [];
  const attachments: Attachment[] = [];

  return { resume, careers, educations, projects, activities, languageSkills, attachments };
};

// 6. DevOps 엔지니어
export const createSampleResume7 = () => {
  const now = Date.now();
  const worker: Worker = {
    id: 'worker-7',
    name: '강동우',
    nickName: '강동우',
    createdAt: now - 365 * 24 * 60 * 60 * 1000,
    updatedAt: now
  };

  const resume: Resume = {
    id: 'resume-7',
    title: '강동우_DevOps엔지니어',
    name: '강동우',
    phone: '010-7890-1234',
    email: 'dongwoo.kang@example.com',
    birthDate: now - 31 * 365 * 24 * 60 * 60 * 1000,
    gender: Resume_Gender.MALE,
    job: 'DevOps 엔지니어',
    description: 'Kubernetes와 AWS에 능숙한 인프라 전문가입니다.',
    isDefault: false,
    publicId: 'dongwoo-devops',
    worker,
    createdAt: now - 190 * 24 * 60 * 60 * 1000,
    updatedAt: now - 12 * 24 * 60 * 60 * 1000
  };

  const careers: Career[] = [
    {
      id: 'career-7-1',
      name: '삼성전자',
      job: 'DevOps Engineer',
      position: 'DevOps Engineer',
      startedAt: now - 6 * 365 * 24 * 60 * 60 * 1000,
      endedAt: 0,
      isWorking: true,
      employmentType: Career_EmploymentType.FULL_TIME,
      salary: 88000000,
      department: '클라우드플랫폼팀',
      jobGrade: '시니어',
      description: 'CI/CD 파이프라인 구축 및 운영',
      isVisible: true,
      achievements: [
        {
          id: 'achievement-7-1',
          title: '배포 시간 70% 단축',
          role: 'DevOps Engineer',
          description: '배포 시간 70% 단축',
          isVisible: true,
          createdAt: now - 6 * 365 * 24 * 60 * 60 * 1000,
          updatedAt: now - 6 * 365 * 24 * 60 * 60 * 1000
        },
        {
          id: 'achievement-7-2',
          title: 'Kubernetes 클러스터 관리',
          role: 'DevOps Engineer',
          description: 'Kubernetes 클러스터 관리',
          isVisible: true,
          createdAt: now - 6 * 365 * 24 * 60 * 60 * 1000,
          updatedAt: now - 6 * 365 * 24 * 60 * 60 * 1000
        }
      ],
      salaries: [],
      priority: 1,
      resume,
      createdAt: now - 6 * 365 * 24 * 60 * 60 * 1000,
      updatedAt: now
    }
  ];

  const educations: Education[] = [
    {
      id: 'education-7-1',
      name: '포항공대',
      major: '컴퓨터공학',
      startedAt: now - 13 * 365 * 24 * 60 * 60 * 1000,
      endedAt: now - 9 * 365 * 24 * 60 * 60 * 1000,
      status: Education_EducationStatus.GRADUATED,
      description: '학점 3.7/4.5',
      isVisible: true,
      priority: 1,
      resume,
      createdAt: now - 190 * 24 * 60 * 60 * 1000,
      updatedAt: now
    }
  ];

  const projects: Project[] = [
    {
      id: 'project-7-1',
      title: 'IaC 구축',
      affiliation: '삼성전자',
      role: 'DevOps Engineer',
      startedAt: now - 400 * 24 * 60 * 60 * 1000,
      endedAt: now - 250 * 24 * 60 * 60 * 1000,
      description: 'Terraform을 이용한 인프라 코드화',
      isVisible: true,
      priority: 1,
      resume,
      createdAt: now - 400 * 24 * 60 * 60 * 1000,
      updatedAt: now
    }
  ];

  const activities: Activity[] = [];
  const languageSkills: LanguageSkill[] = [];
  const attachments: Attachment[] = [];

  return { resume, careers, educations, projects, activities, languageSkills, attachments };
};

// 7. 마케터
export const createSampleResume8 = () => {
  const now = Date.now();
  const worker: Worker = {
    id: 'worker-8',
    name: '윤서아',
    nickName: '윤서아',
    createdAt: now - 365 * 24 * 60 * 60 * 1000,
    updatedAt: now
  };

  const resume: Resume = {
    id: 'resume-8',
    title: '윤서아_퍼포먼스마케터',
    name: '윤서아',
    phone: '010-8901-2345',
    email: 'seoa.yoon@example.com',
    birthDate: now - 28 * 365 * 24 * 60 * 60 * 1000,
    gender: Resume_Gender.FEMALE,
    job: '퍼포먼스 마케터',
    description: '데이터 기반 마케팅 전략 수립 및 실행 전문가입니다.',
    isDefault: false,
    publicId: 'seoa-marketer',
    worker,
    createdAt: now - 160 * 24 * 60 * 60 * 1000,
    updatedAt: now - 7 * 24 * 60 * 60 * 1000
  };

  const careers: Career[] = [
    {
      id: 'career-8-1',
      name: '당근마켓',
      job: 'Performance Marketer',
      position: 'Performance Marketer',
      startedAt: now - 4 * 365 * 24 * 60 * 60 * 1000,
      endedAt: 0,
      isWorking: true,
      employmentType: Career_EmploymentType.FULL_TIME,
      salary: 65000000,
      department: '그로스팀',
      jobGrade: '미드',
      description: 'UA 광고 운영 및 최적화',
      isVisible: true,
      achievements: [
        {
          id: 'achievement-8-1',
          title: 'CPA 30% 절감',
          role: 'Performance Marketer',
          description: 'CPA 30% 절감',
          isVisible: true,
          createdAt: now - 4 * 365 * 24 * 60 * 60 * 1000,
          updatedAt: now - 4 * 365 * 24 * 60 * 60 * 1000
        },
        {
          id: 'achievement-8-2',
          title: 'ROAS 200% 달성',
          role: 'Performance Marketer',
          description: 'ROAS 200% 달성',
          isVisible: true,
          createdAt: now - 4 * 365 * 24 * 60 * 60 * 1000,
          updatedAt: now - 4 * 365 * 24 * 60 * 60 * 1000
        }
      ],
      salaries: [],
      priority: 1,
      resume,
      createdAt: now - 4 * 365 * 24 * 60 * 60 * 1000,
      updatedAt: now
    }
  ];

  const educations: Education[] = [
    {
      id: 'education-8-1',
      name: '이화여대',
      major: '경영학',
      startedAt: now - 10 * 365 * 24 * 60 * 60 * 1000,
      endedAt: now - 6 * 365 * 24 * 60 * 60 * 1000,
      status: Education_EducationStatus.GRADUATED,
      description: '학점 3.8/4.5',
      isVisible: true,
      priority: 1,
      resume,
      createdAt: now - 160 * 24 * 60 * 60 * 1000,
      updatedAt: now
    }
  ];

  const projects: Project[] = [
    {
      id: 'project-8-1',
      title: '브랜딩 캠페인',
      affiliation: '당근마켓',
      role: 'Performance Marketer',
      startedAt: now - 300 * 24 * 60 * 60 * 1000,
      endedAt: now - 200 * 24 * 60 * 60 * 1000,
      description: '신규 사용자 확보 캠페인',
      isVisible: true,
      priority: 1,
      resume,
      createdAt: now - 300 * 24 * 60 * 60 * 1000,
      updatedAt: now
    }
  ];

  const activities: Activity[] = [];
  const languageSkills: LanguageSkill[] = [];
  const attachments: Attachment[] = [];

  return { resume, careers, educations, projects, activities, languageSkills, attachments };
};

// 8. QA 엔지니어
export const createSampleResume9 = () => {
  const now = Date.now();
  const worker: Worker = {
    id: 'worker-9',
    name: '조현우',
    nickName: '조현우',
    createdAt: now - 365 * 24 * 60 * 60 * 1000,
    updatedAt: now
  };

  const resume: Resume = {
    id: 'resume-9',
    title: '조현우_QA엔지니어',
    name: '조현우',
    phone: '010-9012-3456',
    email: 'hyunwoo.jo@example.com',
    birthDate: now - 29 * 365 * 24 * 60 * 60 * 1000,
    gender: Resume_Gender.MALE,
    job: 'QA 엔지니어',
    description: '자동화 테스트에 능숙한 6년차 QA 엔지니어입니다.',
    isDefault: false,
    publicId: 'hyunwoo-qa',
    worker,
    createdAt: now - 180 * 24 * 60 * 60 * 1000,
    updatedAt: now - 9 * 24 * 60 * 60 * 1000
  };

  const careers: Career[] = [
    {
      id: 'career-9-1',
      name: 'NHN',
      job: 'QA Engineer',
      position: 'QA Engineer',
      startedAt: now - 6 * 365 * 24 * 60 * 60 * 1000,
      endedAt: 0,
      isWorking: true,
      employmentType: Career_EmploymentType.FULL_TIME,
      salary: 72000000,
      department: '품질관리팀',
      jobGrade: '시니어',
      description: '자동화 테스트 구축 및 운영',
      isVisible: true,
      achievements: [
        {
          id: 'achievement-9-1',
          title: '테스트 커버리지 85% 달성',
          role: 'QA Engineer',
          description: '테스트 커버리지 85% 달성',
          isVisible: true,
          createdAt: now - 6 * 365 * 24 * 60 * 60 * 1000,
          updatedAt: now - 6 * 365 * 24 * 60 * 60 * 1000
        },
        {
          id: 'achievement-9-2',
          title: 'Selenium Grid 구축',
          role: 'QA Engineer',
          description: 'Selenium Grid 구축',
          isVisible: true,
          createdAt: now - 6 * 365 * 24 * 60 * 60 * 1000,
          updatedAt: now - 6 * 365 * 24 * 60 * 60 * 1000
        }
      ],
      salaries: [],
      priority: 1,
      resume,
      createdAt: now - 6 * 365 * 24 * 60 * 60 * 1000,
      updatedAt: now
    }
  ];

  const educations: Education[] = [
    {
      id: 'education-9-1',
      name: '성균관대',
      major: '소프트웨어학',
      startedAt: now - 11 * 365 * 24 * 60 * 60 * 1000,
      endedAt: now - 7 * 365 * 24 * 60 * 60 * 1000,
      status: Education_EducationStatus.GRADUATED,
      description: '학점 3.6/4.5',
      isVisible: true,
      priority: 1,
      resume,
      createdAt: now - 180 * 24 * 60 * 60 * 1000,
      updatedAt: now
    }
  ];

  const projects: Project[] = [
    {
      id: 'project-9-1',
      title: 'E2E 테스트 자동화',
      affiliation: 'NHN',
      role: 'QA Engineer',
      startedAt: now - 380 * 24 * 60 * 60 * 1000,
      endedAt: now - 230 * 24 * 60 * 60 * 1000,
      description: 'Playwright 기반 테스트 자동화',
      isVisible: true,
      priority: 1,
      resume,
      createdAt: now - 380 * 24 * 60 * 60 * 1000,
      updatedAt: now
    }
  ];

  const activities: Activity[] = [];
  const languageSkills: LanguageSkill[] = [];
  const attachments: Attachment[] = [];

  return { resume, careers, educations, projects, activities, languageSkills, attachments };
};

// 9. 모바일 개발자
export const createSampleResume10 = () => {
  const now = Date.now();
  const worker: Worker = {
    id: 'worker-10',
    name: '송민지',
    nickName: '송민지',
    createdAt: now - 365 * 24 * 60 * 60 * 1000,
    updatedAt: now
  };

  const resume: Resume = {
    id: 'resume-10',
    title: '송민지_iOS개발자',
    name: '송민지',
    phone: '010-0123-4567',
    email: 'minji.song@example.com',
    birthDate: now - 26 * 365 * 24 * 60 * 60 * 1000,
    gender: Resume_Gender.FEMALE,
    job: 'iOS 개발자',
    description: 'Swift와 SwiftUI를 전문으로 하는 iOS 개발자입니다.',
    isDefault: false,
    publicId: 'minji-ios',
    worker,
    createdAt: now - 140 * 24 * 60 * 60 * 1000,
    updatedAt: now - 6 * 24 * 60 * 60 * 1000
  };

  const careers: Career[] = [
    {
      id: 'career-10-1',
      name: '야놀자',
      job: 'iOS Developer',
      position: 'iOS Developer',
      startedAt: now - 3 * 365 * 24 * 60 * 60 * 1000,
      endedAt: 0,
      isWorking: true,
      employmentType: Career_EmploymentType.FULL_TIME,
      salary: 68000000,
      department: '앱개발팀',
      jobGrade: '주니어',
      description: 'iOS 앱 개발 및 유지보수',
      isVisible: true,
      achievements: [
        {
          id: 'achievement-10-1',
          title: '앱 크래시율 50% 감소',
          role: 'iOS Developer',
          description: '앱 크래시율 50% 감소',
          isVisible: true,
          createdAt: now - 3 * 365 * 24 * 60 * 60 * 1000,
          updatedAt: now - 3 * 365 * 24 * 60 * 60 * 1000
        },
        {
          id: 'achievement-10-2',
          title: 'SwiftUI 마이그레이션',
          role: 'iOS Developer',
          description: 'SwiftUI 마이그레이션',
          isVisible: true,
          createdAt: now - 3 * 365 * 24 * 60 * 60 * 1000,
          updatedAt: now - 3 * 365 * 24 * 60 * 60 * 1000
        }
      ],
      salaries: [],
      priority: 1,
      resume,
      createdAt: now - 3 * 365 * 24 * 60 * 60 * 1000,
      updatedAt: now
    }
  ];

  const educations: Education[] = [
    {
      id: 'education-10-1',
      name: '한양대학교',
      major: '컴퓨터소프트웨어학',
      startedAt: now - 8 * 365 * 24 * 60 * 60 * 1000,
      endedAt: now - 4 * 365 * 24 * 60 * 60 * 1000,
      status: Education_EducationStatus.GRADUATED,
      description: '학점 3.9/4.5',
      isVisible: true,
      priority: 1,
      resume,
      createdAt: now - 140 * 24 * 60 * 60 * 1000,
      updatedAt: now
    }
  ];

  const projects: Project[] = [
    {
      id: 'project-10-1',
      affiliation: '야놀자',
      role: 'iOS Developer',
      title: '예약 시스템 리뉴얼',
      startedAt: now - 280 * 24 * 60 * 60 * 1000,
      endedAt: now - 180 * 24 * 60 * 60 * 1000,
      description: 'SwiftUI로 예약 화면 재구성',
      isVisible: true,
      priority: 1,
      resume,
      createdAt: now - 280 * 24 * 60 * 60 * 1000,
      updatedAt: now
    }
  ];

  const activities: Activity[] = [];
  const languageSkills: LanguageSkill[] = [];
  const attachments: Attachment[] = [];

  return { resume, careers, educations, projects, activities, languageSkills, attachments };
};

// 10. AI 엔지니어
export const createSampleResume11 = () => {
  const now = Date.now();
  const worker: Worker = {
    id: 'worker-11',
    name: '한지훈',
    nickName: '한지훈',
    createdAt: now - 365 * 24 * 60 * 60 * 1000,
    updatedAt: now
  };

  const resume: Resume = {
    id: 'resume-11',
    title: '한지훈_AI엔지니어',
    name: '한지훈',
    phone: '010-1357-2468',
    email: 'jihoon.han@example.com',
    birthDate: now - 30 * 365 * 24 * 60 * 60 * 1000,
    gender: Resume_Gender.MALE,
    job: 'AI 엔지니어',
    description: '딥러닝과 NLP 전문 AI 엔지니어입니다.',
    isDefault: false,
    publicId: 'jihoon-ai',
    worker,
    createdAt: now - 210 * 24 * 60 * 60 * 1000,
    updatedAt: now - 14 * 24 * 60 * 60 * 1000
  };

  const careers: Career[] = [
    {
      id: 'career-11-1',
      name: '네이버 클로바',
      job: 'AI Researcher',
      position: 'AI Researcher',
      startedAt: now - 5 * 365 * 24 * 60 * 60 * 1000,
      endedAt: 0,
      isWorking: true,
      employmentType: Career_EmploymentType.FULL_TIME,
      salary: 95000000,
      department: 'AI Lab',
      jobGrade: '시니어',
      description: 'NLP 모델 개발 및 최적화',
      isVisible: true,
      achievements: [
        {
          id: 'achievement-11-1',
          title: '한국어 LLM 성능 12% 향상',
          role: 'AI Researcher',
          description: '한국어 LLM 성능 12% 향상',
          isVisible: true,
          createdAt: now - 5 * 365 * 24 * 60 * 60 * 1000,
          updatedAt: now - 5 * 365 * 24 * 60 * 60 * 1000
        },
        {
          id: 'achievement-11-2',
          title: '논문 3편 발표',
          role: 'AI Researcher',
          description: '논문 3편 발표',
          isVisible: true,
          createdAt: now - 5 * 365 * 24 * 60 * 60 * 1000,
          updatedAt: now - 5 * 365 * 24 * 60 * 60 * 1000
        }
      ],
      salaries: [],
      priority: 1,
      resume,
      createdAt: now - 5 * 365 * 24 * 60 * 60 * 1000,
      updatedAt: now
    }
  ];

  const educations: Education[] = [
    {
      id: 'education-11-1',
      name: '서울대학교',
      major: '인공지능',
      startedAt: now - 12 * 365 * 24 * 60 * 60 * 1000,
      endedAt: now - 10 * 365 * 24 * 60 * 60 * 1000,
      status: Education_EducationStatus.GRADUATED,
      description: '석사 학위',
      isVisible: true,
      priority: 1,
      resume,
      createdAt: now - 210 * 24 * 60 * 60 * 1000,
      updatedAt: now
    },
    {
      id: 'education-11-2',
      name: '서울대학교',
      major: '컴퓨터공학',
      startedAt: now - 14 * 365 * 24 * 60 * 60 * 1000,
      endedAt: now - 10 * 365 * 24 * 60 * 60 * 1000,
      status: Education_EducationStatus.GRADUATED,
      description: '학점 4.3/4.5',
      isVisible: true,
      priority: 1,
      resume,
      createdAt: now - 210 * 24 * 60 * 60 * 1000,
      updatedAt: now
    }
  ];

  const projects: Project[] = [
    {
      id: 'project-11-1',
      title: '한국어 감정 분석 모델',
      affiliation: '네이버 클로바',
      role: 'AI Researcher',
      startedAt: now - 420 * 24 * 60 * 60 * 1000,
      endedAt: now - 270 * 24 * 60 * 60 * 1000,
      description: 'Transformer 기반 감정 분석 시스템',
      isVisible: true,
      priority: 1,
      resume,
      createdAt: now - 420 * 24 * 60 * 60 * 1000,
      updatedAt: now
    }
  ];

  const activities: Activity[] = [
    {
      id: 'activity-11-1',
      name: 'NeurIPS 논문 발표',
      type: Activity_ActivityType.EXTERNAL,
      certificateNumber: '',
      organization: 'NeurIPS',
      startedAt: now - 250 * 24 * 60 * 60 * 1000,
      endedAt: now - 250 * 24 * 60 * 60 * 1000,
      description: '한국어 NLP 모델 성능 개선 연구',
      isVisible: true,
      priority: 1,
      resume,
      createdAt: now - 250 * 24 * 60 * 60 * 1000,
      updatedAt: now
    }
  ];

  const languageSkills: LanguageSkill[] = [
    {
      id: 'lang-11-1',
      language: LanguageSkill_Language.ENGLISH,
      level: LanguageSkill_LanguageLevel.NATIVE_LEVEL,
      isVisible: true,
      priority: 1,
      resume,
      languageTests: [
        {
          id: 'lang-test-11-1',
          name: 'TOEIC',
          score: '925',
          acquiredAt: now - 210 * 24 * 60 * 60 * 1000,
          isVisible: true,
          priority: 1,
          createdAt: now - 210 * 24 * 60 * 60 * 1000,
          updatedAt: now - 210 * 24 * 60 * 60 * 1000
        }
      ],
      createdAt: now - 210 * 24 * 60 * 60 * 1000,
      updatedAt: now
    }
  ];
  const attachments: Attachment[] = [];

  return { resume, careers, educations, projects, activities, languageSkills, attachments };
};

// 빈 샘플 Resume 데이터 (기본값만)
export const createEmptySampleResume = (): Resume => {
  const now = Date.now();
  const worker = createSampleWorker();
  
  return {
    id: 'resume-empty',
    title: '',
    name: '',
    phone: '',
    email: '',
    birthDate: undefined,
    gender: undefined,
    job: '',
    description: '',
    isDefault: false,
    publicId: '',
    worker,
    createdAt: now,
    updatedAt: now
  };
};

// 빈 샘플 Career 데이터
export const createEmptySampleCareers = (): Career[] => {
  const now = Date.now();
  const resume = createEmptySampleResume();
  
  return [
    {
      id: 'career-empty',
      name: '',
      position: '',
      department: '',
      employmentType: undefined,
      jobGrade: '',
      job: '',
      salary: 0,
      description: '',
      isVisible: true,
      priority: 0,
      startedAt: undefined,
      endedAt: undefined,
      isWorking: false,
      resume,
      achievements: [],
      salaries: [
        {
          id: 'salary-empty',
          amount: 0,
          negotiationDate: undefined,
          memo: '',
          isVisible: true,
          priority: 0,
          career: undefined,
          createdAt: now,
          updatedAt: now
        }
      ],
      createdAt: now,
      updatedAt: now
    }
  ];
};

// 빈 샘플 Education 데이터
export const createEmptySampleEducations = (): Education[] => {
  const now = Date.now();
  const resume = createEmptySampleResume();
  
  return [
    {
      id: 'education-empty',
      major: '',
      name: '',
      description: '',
      status: undefined,
      startedAt: undefined,
      endedAt: undefined,
      isVisible: true,
      priority: 0,
      resume,
      createdAt: now,
      updatedAt: now
    }
  ];
};

// 빈 샘플 Project 데이터
export const createEmptySampleProjects = (): Project[] => {
  const now = Date.now();
  const resume = createEmptySampleResume();
  
  return [
    {
      id: 'project-empty',
      title: '',
      affiliation: '',
      role: '',
      description: '',
      startedAt: undefined,
      endedAt: undefined,
      isVisible: true,
      priority: 0,
      resume,
      createdAt: now,
      updatedAt: now
    }
  ];
};

// 빈 샘플 Activity 데이터
export const createEmptySampleActivities = (): Activity[] => {
  const now = Date.now();
  const resume = createEmptySampleResume();
  
  return [
    {
      id: 'activity-empty',
      type: undefined,
      name: '',
      organization: '',
      certificateNumber: '',
      startedAt: undefined,
      endedAt: undefined,
      description: '',
      isVisible: true,
      priority: 0,
      resume,
      createdAt: now,
      updatedAt: now
    }
  ];
};

// 빈 샘플 LanguageSkill 데이터
export const createEmptySampleLanguageSkills = (): LanguageSkill[] => {
  const now = Date.now();
  const resume = createEmptySampleResume();
  
  return [
    {
      id: 'lang-empty',
      language: undefined,
      level: undefined,
      isVisible: true,
      priority: 0,
      resume,
      languageTests: [
        {
          id: 'lang-test-empty',
          name: '',
          score: '',
          acquiredAt: undefined,
          isVisible: true,
          priority: 0,
          createdAt: now,
          updatedAt: now
        }
      ],
      createdAt: now,
      updatedAt: now
    }
  ];
};

// 빈 샘플 Attachment 데이터
export const createEmptySampleAttachments = (): Attachment[] => {
  const now = Date.now();
  const resume = createEmptySampleResume();
  
  return [
    {
      id: 'attachment-empty',
      type: undefined,
      fileName: '',
      fileUrl: '',
      isVisible: true,
      priority: 0,
      resume,
      createdAt: now,
      updatedAt: now
    }
  ];
};

// 빈 ResumeDetail 데이터 생성
export const createEmptySampleResumeDetails = () => {
  const resume = createEmptySampleResume();
  const careers = createEmptySampleCareers();
  const educations = createEmptySampleEducations();
  const projects = createEmptySampleProjects();
  const activities = createEmptySampleActivities();
  const languageSkills = createEmptySampleLanguageSkills();
  const attachments = createEmptySampleAttachments();

  return { resume, careers, educations, projects, activities, languageSkills, attachments };
};
