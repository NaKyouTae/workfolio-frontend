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
    ResumeDetail,
    Resume_Gender,
    Education_EducationStatus,
    Career_EmploymentType,
    LanguageSkill_Language,
    LanguageSkill_LanguageLevel,
    Worker,
    Activity_ActivityType,
    Attachment_AttachmentType,
    Attachment_AttachmentCategory,
    Worker_Gender,
    Attachment_AttachmentTargetType,
    Worker_WorkerStatus,
} from "@workfolio/shared/generated/common";

// 샘플 Worker 데이터
export const createSampleWorker = (): Worker => {
    const now = Date.now();
    return {
        id: "worker-1",
        status: Worker_WorkerStatus.ACTIVE,
        phone: "010-1234-5678",
        email: "hong@example.com",
        birthDate: now - 30 * 365 * 24 * 60 * 60 * 1000,
        gender: Worker_Gender.MALE,
        nickName: "홍길동",
        createdAt: now - 365 * 24 * 60 * 60 * 1000,
        updatedAt: now,
    };
};

// 샘플 Resume 데이터
export const createSampleResume = (): Resume => {
    const now = Date.now();
    const worker = createSampleWorker();

    return {
        id: "resume-1",
        title: "홍길동 이력서",
        name: "홍길동",
        phone: "010-1234-5678",
        email: "hong@example.com",
        birthDate: now - 30 * 365 * 24 * 60 * 60 * 1000, // 30년 전
        gender: Resume_Gender.MALE,
        position: "기획자",
        description:
            "10년차 기획자입니다. 서비스 기획, 프로덕트 기획, 사용자 리서치 등 다양한 기획 업무를 담당합니다.",
        isDefault: true,
        worker,
        createdAt: now - 365 * 24 * 60 * 60 * 1000,
        updatedAt: now - 2 * 24 * 60 * 60 * 1000,
    };
};

// 샘플 Career 데이터
export const createSampleCareers = (): Career[] => {
    const now = Date.now();
    const resume = createSampleResume();

    return [
        {
            id: "career-1",
            name: "테크스타트업",
            position: "시니어 기획자",
            department: "기획팀",
            employmentType: Career_EmploymentType.FULL_TIME,
            rank: "책임",
            jobTitle: "기획자",
            salary: 6000,
            description:
                "서비스 기획 및 프로덕트 기획 담당\n- 신규 서비스 기획 및 로드맵 수립\n- 사용자 리서치 및 요구사항 분석\n- 프로젝트 관리 및 이해관계자 커뮤니케이션",
            isVisible: true,
            priority: 1,
            startedAt: now - 2 * 365 * 24 * 60 * 60 * 1000, // 2년 전
            endedAt: now - 1 * 365 * 24 * 60 * 60 * 1000, // 1년 전
            isWorking: false,
            resume,
            salaries: [],
            createdAt: now - 2 * 365 * 24 * 60 * 60 * 1000,
            updatedAt: now - 1 * 365 * 24 * 60 * 60 * 1000,
        },
        {
            id: "career-2",
            name: "글로벌 IT 기업",
            position: "리드 기획자",
            department: "기획본부",
            employmentType: Career_EmploymentType.FULL_TIME,
            jobTitle: "선임",
            rank: "기획자",
            salary: 8200,
            description:
                "서비스 기획 및 프로덕트 기획 리딩\n- 전략 기획 및 로드맵 수립\n- 사용자 리서치 및 데이터 분석\n- 주니어 기획자 멘토링",
            isVisible: true,
            priority: 2,
            startedAt: now - 1 * 365 * 24 * 60 * 60 * 1000, // 1년 전
            endedAt: 0, // 현재 재직 중
            isWorking: true,
            resume,
            salaries: [],
            createdAt: now - 1 * 365 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
        {
            id: "career-3",
            name: "중견 소프트웨어 회사",
            position: "주니어 기획자",
            department: "기획팀",
            employmentType: Career_EmploymentType.FULL_TIME,
            jobTitle: "사원",
            rank: "기획자",
            salary: 4500,
            description:
                "서비스 기획 및 기능 기획 담당\n- 기능 명세서 작성 및 요구사항 정의\n- 사용자 인터뷰 및 피드백 수집\n- 프로젝트 관리 지원",
            isVisible: true,
            priority: 3,
            startedAt: now - 3 * 365 * 24 * 60 * 60 * 1000, // 3년 전
            endedAt: now - 2 * 365 * 24 * 60 * 60 * 1000, // 2년 전
            isWorking: false,
            resume,
            salaries: [],
            createdAt: now - 3 * 365 * 24 * 60 * 60 * 1000,
            updatedAt: now - 2 * 365 * 24 * 60 * 60 * 1000,
        },
    ];
};

// 샘플 Salary 데이터
export const createSampleSalaries = (): Salary[] => {
    const now = Date.now();
    const careers = createSampleCareers();

    return [
        {
            id: "salary-1",
            amount: 4500,
            memo: "입사 시 연봉",
            negotiationDate: now - 3 * 365 * 24 * 60 * 60 * 1000,
            isVisible: true,
            priority: 1,
            career: careers[2], // 중견 소프트웨어 회사
            createdAt: now - 3 * 365 * 24 * 60 * 60 * 1000,
            updatedAt: now - 3 * 365 * 24 * 60 * 60 * 1000,
        },
        {
            id: "salary-2",
            amount: 5500,
            memo: "이직 시 연봉",
            negotiationDate: now - 2 * 365 * 24 * 60 * 60 * 1000,
            isVisible: true,
            priority: 2,
            career: careers[0], // 테크스타트업
            createdAt: now - 2 * 365 * 24 * 60 * 60 * 1000,
            updatedAt: now - 2 * 365 * 24 * 60 * 60 * 1000,
        },
        {
            id: "salary-3",
            amount: 6000,
            memo: "1년차 연봉 협상",
            negotiationDate: now - 1 * 365 * 24 * 60 * 60 * 1000,
            isVisible: true,
            priority: 3,
            career: careers[0], // 테크스타트업
            createdAt: now - 1 * 365 * 24 * 60 * 60 * 1000,
            updatedAt: now - 1 * 365 * 24 * 60 * 60 * 1000,
        },
        {
            id: "salary-4",
            amount: 7500,
            memo: "현재 회사 입사 시 연봉",
            negotiationDate: now - 1 * 365 * 24 * 60 * 60 * 1000,
            isVisible: true,
            priority: 4,
            career: careers[1], // 글로벌 IT 기업
            createdAt: now - 1 * 365 * 24 * 60 * 60 * 1000,
            updatedAt: now - 1 * 365 * 24 * 60 * 60 * 1000,
        },
        {
            id: "salary-5",
            amount: 8200,
            memo: "올해 연봉 인상",
            negotiationDate: now - 3 * 30 * 24 * 60 * 60 * 1000,
            isVisible: true,
            priority: 5,
            career: careers[1], // 글로벌 IT 기업
            createdAt: now - 3 * 30 * 24 * 60 * 60 * 1000,
            updatedAt: now - 3 * 30 * 24 * 60 * 60 * 1000,
        },
    ];
};

// 샘플 Education 데이터
export const createSampleEducations = (): Education[] => {
    const now = Date.now();
    const resume = createSampleResume();

    return [
        {
            id: "edu-1",
            major: "경영학",
            name: "서울대학교",
            description: "경영학 학사 학위 취득\n- 학점: 4.0/4.5\n- 우수 졸업생 표창",
            status: Education_EducationStatus.GRADUATED,
            startedAt: now - 10 * 365 * 24 * 60 * 60 * 1000, // 10년 전
            endedAt: now - 6 * 365 * 24 * 60 * 60 * 1000, // 6년 전
            isVisible: true,
            priority: 1,
            resume,
            createdAt: now - 10 * 365 * 24 * 60 * 60 * 1000,
            updatedAt: now - 6 * 365 * 24 * 60 * 60 * 1000,
        },
        {
            id: "edu-2",
            major: "경영정보학",
            name: "서울대학교 대학원",
            description:
                "경영정보학 석사 학위 취득\n- 전공: 프로덕트 기획\n- 논문: 서비스 기획 프로세스 최적화",
            status: Education_EducationStatus.GRADUATED,
            startedAt: now - 6 * 365 * 24 * 60 * 60 * 1000, // 6년 전
            endedAt: now - 4 * 365 * 24 * 60 * 60 * 1000, // 4년 전
            isVisible: true,
            priority: 2,
            resume,
            createdAt: now - 6 * 365 * 24 * 60 * 60 * 1000,
            updatedAt: now - 4 * 365 * 24 * 60 * 60 * 1000,
        },
        {
            id: "edu-3",
            major: "",
            name: "프로덕트 기획 심화 과정",
            description:
                "프로덕트 기획 고급 과정 수료\n- 서비스 기획 심화\n- 사용자 리서치 방법론\n- 데이터 기반 의사결정",
            status: Education_EducationStatus.COMPLETED,
            startedAt: now - 3 * 30 * 24 * 60 * 60 * 1000, // 3개월 전
            endedAt: now - 2 * 30 * 24 * 60 * 60 * 1000, // 2개월 전
            isVisible: true,
            priority: 3,
            resume,
            createdAt: now - 3 * 30 * 24 * 60 * 60 * 1000,
            updatedAt: now - 2 * 30 * 24 * 60 * 60 * 1000,
        },
        {
            id: "edu-4",
            major: "",
            name: "프로덕트 매니저 자격증 준비 과정",
            description: "프로덕트 매니저 공식 교육 파트너를 통한 자격증 준비 과정",
            status: Education_EducationStatus.COMPLETED,
            startedAt: now - 8 * 30 * 24 * 60 * 60 * 1000, // 8개월 전
            endedAt: now - 6 * 30 * 24 * 60 * 60 * 1000, // 6개월 전
            isVisible: true,
            priority: 4,
            resume,
            createdAt: now - 8 * 30 * 24 * 60 * 60 * 1000,
            updatedAt: now - 6 * 30 * 24 * 60 * 60 * 1000,
        },
    ];
};

// 샘플 Project 데이터
export const createSampleProjects = (): Project[] => {
    const now = Date.now();
    const resume = createSampleResume();

    return [
        {
            id: "project-1",
            title: "전사 통합 인증 시스템 구축",
            affiliation: "테크스타트업",
            role: "기획 리드",
            description:
                "신규 서비스 기획 및 프로젝트 관리\n\n주요 역할:\n- 서비스 기획 및 로드맵 수립\n- 사용자 리서치 및 요구사항 분석\n- 프로젝트 일정 관리 및 이해관계자 커뮤니케이션\n\n성과: 신규 서비스 런칭 성공, 사용자 만족도 20% 향상",
            startedAt: now - 18 * 30 * 24 * 60 * 60 * 1000, // 18개월 전
            endedAt: now - 12 * 30 * 24 * 60 * 60 * 1000, // 12개월 전
            isVisible: true,
            priority: 1,
            resume,
            createdAt: now - 18 * 30 * 24 * 60 * 60 * 1000,
            updatedAt: now - 12 * 30 * 24 * 60 * 60 * 1000,
        },
        {
            id: "project-2",
            title: "AI 기반 추천 엔진 개발",
            affiliation: "글로벌 IT 기업",
            role: "기획자",
            description:
                "사용자 행동 데이터 기반 개인화 추천 기능 기획\n\n주요 역할:\n- 추천 기능 기획 및 요구사항 정의\n- 사용자 리서치 및 데이터 분석\n- A/B 테스트 설계 및 결과 분석\n\n성과: 클릭률 35% 향상",
            startedAt: now - 10 * 30 * 24 * 60 * 60 * 1000, // 10개월 전
            endedAt: now - 6 * 30 * 24 * 60 * 60 * 1000, // 6개월 전
            isVisible: true,
            priority: 2,
            resume,
            createdAt: now - 10 * 30 * 24 * 60 * 60 * 1000,
            updatedAt: now - 6 * 30 * 24 * 60 * 60 * 1000,
        },
        {
            id: "project-3",
            title: "실시간 채팅 서비스",
            affiliation: "글로벌 IT 기업",
            role: "기획 리드",
            description:
                "실시간 채팅 서비스 기획 및 프로젝트 관리\n\n주요 역할:\n- 실시간 채팅 기능 기획 및 요구사항 정의\n- 사용자 리서치 및 UX 설계\n- 프로젝트 일정 관리 및 이해관계자 커뮤니케이션\n\n성과: 동시 접속자 10만명 달성",
            startedAt: now - 5 * 30 * 24 * 60 * 60 * 1000, // 5개월 전
            endedAt: now, // 진행중
            isVisible: true,
            priority: 3,
            resume,
            createdAt: now - 5 * 30 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
    ];
};

// 샘플 Activity 데이터
export const createSampleActivities = (): Activity[] => {
    const now = Date.now();
    const resume = createSampleResume();

    return [
        {
            id: "activity-1",
            name: "오픈소스 프로젝트 기여",
            organization: "Product Management Community",
            certificateNumber: "",
            description:
                "오픈소스 프로젝트의 기획 및 문서화 기여\n- 총 5개의 기획안 제출\n- 사용자 가이드 작성 및 프로세스 개선",
            startedAt: now - 12 * 30 * 24 * 60 * 60 * 1000, // 12개월 전
            endedAt: now, // 진행중
            isVisible: true,
            type: Activity_ActivityType.EXTERNAL,
            priority: 1,
            resume,
            createdAt: now - 12 * 30 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
        {
            id: "activity-2",
            name: "기술 블로그 운영",
            organization: "velog.io",
            certificateNumber: "",
            description:
                "서비스 기획 관련 블로그 운영 및 글 작성\n- 월 평균 3-4개 포스팅\n- 누적 방문자 10만명 돌파\n- 주제: 서비스 기획, 프로덕트 기획, 사용자 리서치, 데이터 분석",
            startedAt: now - 24 * 30 * 24 * 60 * 60 * 1000, // 24개월 전
            endedAt: now, // 진행중
            isVisible: true,
            type: Activity_ActivityType.EXTERNAL,
            priority: 2,
            resume,
            createdAt: now - 24 * 30 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
        {
            id: "activity-3",
            name: "기획자 컨퍼런스 발표",
            organization: "DEVIEW 2024",
            certificateNumber: "CERT-DEVIEW-2024-001",
            description:
                'Product Conference 2024 - "대규모 서비스 기획 프로세스"\n- 300명 이상 참석\n- 서비스 기획 및 프로덕트 기획 경험 공유',
            startedAt: now - 3 * 30 * 24 * 60 * 60 * 1000, // 3개월 전
            endedAt: now - 3 * 30 * 24 * 60 * 60 * 1000, // 하루 행사
            isVisible: true,
            type: Activity_ActivityType.EXTERNAL,
            priority: 3,
            resume,
            createdAt: now - 3 * 30 * 24 * 60 * 60 * 1000,
            updatedAt: now - 3 * 30 * 24 * 60 * 60 * 1000,
        },
        {
            id: "activity-4",
            name: "스터디 그룹 운영",
            organization: "알고리즘 스터디",
            certificateNumber: "",
            description:
                "주말 서비스 기획 스터디 그룹 운영\n- 매주 토요일 오전 10시\n- 서비스 기획 케이스 스터디 및 사례 공유\n- 10명 규모의 온라인 스터디",
            startedAt: now - 6 * 30 * 24 * 60 * 60 * 1000, // 6개월 전
            endedAt: now, // 진행중
            isVisible: true,
            type: Activity_ActivityType.EXTERNAL,
            priority: 4,
            resume,
            createdAt: now - 6 * 30 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
    ];
};

// 샘플 LanguageSkill 데이터
export const createSampleLanguageSkills = (): LanguageSkill[] => {
    const now = Date.now();
    const resume = createSampleResume();

    return [
        {
            id: "lang-skill-1",
            language: LanguageSkill_Language.ENGLISH,
            level: LanguageSkill_LanguageLevel.BUSINESS_CONVERSATION,
            isVisible: true,
            priority: 1,
            resume,
            languageTests: [
                {
                    id: "lang-test-1",
                    name: "TOEIC",
                    score: "925",
                    acquiredAt: now - 6 * 30 * 24 * 60 * 60 * 1000, // 6개월 전
                    isVisible: true,
                    priority: 1,
                    createdAt: now - 6 * 30 * 24 * 60 * 60 * 1000,
                    updatedAt: now - 6 * 30 * 24 * 60 * 60 * 1000,
                },
                {
                    id: "lang-test-2",
                    name: "TOEIC Speaking",
                    score: "Level 7",
                    acquiredAt: now - 4 * 30 * 24 * 60 * 60 * 1000, // 4개월 전
                    isVisible: true,
                    priority: 2,
                    createdAt: now - 4 * 30 * 24 * 60 * 60 * 1000,
                    updatedAt: now - 4 * 30 * 24 * 60 * 60 * 1000,
                },
            ],
            createdAt: now - 365 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
        {
            id: "lang-skill-2",
            language: LanguageSkill_Language.JAPANESE,
            level: LanguageSkill_LanguageLevel.DAILY_CONVERSATION,
            isVisible: true,
            priority: 2,
            resume,
            languageTests: [
                {
                    id: "lang-test-3",
                    name: "JLPT",
                    score: "N3",
                    acquiredAt: now - 12 * 30 * 24 * 60 * 60 * 1000, // 12개월 전
                    isVisible: true,
                    priority: 1,
                    createdAt: now - 12 * 30 * 24 * 60 * 60 * 1000,
                    updatedAt: now - 12 * 30 * 24 * 60 * 60 * 1000,
                },
            ],
            createdAt: now - 365 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
    ];
};

// 샘플 LanguageTest 데이터 (단독)
export const createSampleLanguageTests = (): LanguageTest[] => {
    const now = Date.now();

    return [
        {
            id: "lang-test-1",
            name: "TOEIC",
            score: "925",
            acquiredAt: now - 6 * 30 * 24 * 60 * 60 * 1000, // 6개월 전
            isVisible: true,
            priority: 1,
            createdAt: now - 6 * 30 * 24 * 60 * 60 * 1000,
            updatedAt: now - 6 * 30 * 24 * 60 * 60 * 1000,
        },
        {
            id: "lang-test-2",
            name: "TOEIC Speaking",
            score: "Level 7",
            acquiredAt: now - 4 * 30 * 24 * 60 * 60 * 1000, // 4개월 전
            isVisible: true,
            priority: 2,
            createdAt: now - 4 * 30 * 24 * 60 * 60 * 1000,
            updatedAt: now - 4 * 30 * 24 * 60 * 60 * 1000,
        },
        {
            id: "lang-test-3",
            name: "JLPT",
            score: "N3",
            acquiredAt: now - 12 * 30 * 24 * 60 * 60 * 1000, // 12개월 전
            isVisible: true,
            priority: 3,
            createdAt: now - 12 * 30 * 24 * 60 * 60 * 1000,
            updatedAt: now - 12 * 30 * 24 * 60 * 60 * 1000,
        },
    ];
};

// 샘플 Attachment 데이터
export const createSampleAttachments = (): Attachment[] => {
    const now = Date.now();

    return [
        {
            id: "attach-1",
            category: Attachment_AttachmentCategory.FILE,
            url: "",
            fileName: "",
            fileUrl: "https://example.com/files/portfolio.pdf",
            isVisible: true,
            priority: 1,
            type: Attachment_AttachmentType.RESUME,
            targetId: "",
            targetType: Attachment_AttachmentTargetType.ENTITY_RESUME,
            createdAt: now - 30 * 24 * 60 * 60 * 1000,
            updatedAt: now - 30 * 24 * 60 * 60 * 1000,
        },
        {
            id: "attach-2",
            category: Attachment_AttachmentCategory.FILE,
            url: "",
            fileName: "자기소개서.pdf",
            fileUrl: "",
            isVisible: true,
            priority: 2,
            type: Attachment_AttachmentType.CERTIFICATE,
            targetId: "",
            targetType: Attachment_AttachmentTargetType.ENTITY_RESUME,
            createdAt: now - 20 * 24 * 60 * 60 * 1000,
            updatedAt: now - 20 * 24 * 60 * 60 * 1000,
        },
        {
            id: "attach-3",
            category: Attachment_AttachmentCategory.URL,
            url: "",
            fileName: "",
            fileUrl: "https://github.com/honggildong",
            isVisible: true,
            priority: 3,
            type: Attachment_AttachmentType.PORTFOLIO,
            targetId: "",
            targetType: Attachment_AttachmentTargetType.ENTITY_RESUME,
            createdAt: now - 10 * 24 * 60 * 60 * 1000,
            updatedAt: now - 10 * 24 * 60 * 60 * 1000,
        },
        {
            id: "attach-4",
            category: Attachment_AttachmentCategory.URL,
            url: "",
            fileName: "",
            fileUrl: "https://blog.honggildong.com",
            isVisible: true,
            priority: 4,
            type: Attachment_AttachmentType.PORTFOLIO,
            targetId: "",
            targetType: Attachment_AttachmentTargetType.ENTITY_RESUME,
            createdAt: now - 5 * 24 * 60 * 60 * 1000,
            updatedAt: now - 5 * 24 * 60 * 60 * 1000,
        },
    ];
};

// ===== 추가 샘플 이력서 데이터 (10세트) =====

// 1. 기획자
export const createSampleResume2 = () => {
    const now = Date.now();
    const worker: Worker = {
        id: "worker-2",
        status: Worker_WorkerStatus.ACTIVE,
        nickName: "김민준",
        phone: "010-2345-6789",
        email: "minjun.kim@example.com",
        birthDate: now - 28 * 365 * 24 * 60 * 60 * 1000,
        gender: Worker_Gender.MALE,
        createdAt: now - 300 * 24 * 60 * 60 * 1000,
        updatedAt: now,
    };

    const resume: Resume = {
        id: "resume-2",
        title: "김민준_기획자",
        name: "김민준",
        phone: "010-2345-6789",
        email: "minjun.kim@example.com",
        birthDate: now - 28 * 365 * 24 * 60 * 60 * 1000,
        gender: Resume_Gender.MALE,
        position: "기획자",
        description: "서비스 기획과 프로덕트 기획에 능숙한 5년차 기획자입니다.",
        isDefault: false,
        worker,
        createdAt: now - 280 * 24 * 60 * 60 * 1000,
        updatedAt: now - 3 * 24 * 60 * 60 * 1000,
    };

    const careers: Career[] = [
        {
            id: "career-2-1",
            name: "네이버",
            position: "기획자",
            department: "기획팀",
            employmentType: Career_EmploymentType.FULL_TIME,
            rank: "시니어",
            jobTitle: "기획자",
            salary: 8500,
            description:
                "서비스 기획 및 프로덕트 기획\n- 신규 기능 기획 및 로드맵 수립\n- 사용자 리서치 및 데이터 분석",
            isVisible: true,
            priority: 1,
            startedAt: now - 5 * 365 * 24 * 60 * 60 * 1000,
            endedAt: 0,
            isWorking: true,
            resume,
            salaries: [],
            createdAt: now - 5 * 365 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
    ];

    const educations: Education[] = [
        {
            id: "education-2-1",
            major: "경영학",
            name: "서울대학교",
            description: "학점 4.0/4.5",
            status: Education_EducationStatus.GRADUATED,
            startedAt: now - 10 * 365 * 24 * 60 * 60 * 1000,
            endedAt: now - 6 * 365 * 24 * 60 * 60 * 1000,
            isVisible: true,
            priority: 1,
            resume,
            createdAt: now - 180 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
    ];

    const projects: Project[] = [
        {
            id: "project-2-1",
            title: "검색 서비스 리뉴얼",
            affiliation: "네이버",
            role: "기획 리드",
            description: "검색 기능 개선 프로젝트 기획",
            startedAt: now - 365 * 24 * 60 * 60 * 1000,
            endedAt: now - 180 * 24 * 60 * 60 * 1000,
            isVisible: true,
            priority: 1,
            resume,
            createdAt: now - 365 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
    ];

    const activities: Activity[] = [
        {
            id: "activity-2-1",
            name: "기획자 밋업 발표",
            organization: "Product Manager Korea",
            certificateNumber: "",
            description: "서비스 기획 프로세스 및 사례 공유",
            startedAt: now - 200 * 24 * 60 * 60 * 1000,
            endedAt: now - 200 * 24 * 60 * 60 * 1000,
            isVisible: true,
            type: Activity_ActivityType.EXTERNAL,
            priority: 1,
            resume,
            createdAt: now - 200 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
    ];

    const languageSkills: LanguageSkill[] = [
        {
            id: "lang-2-1",
            language: LanguageSkill_Language.ENGLISH,
            level: LanguageSkill_LanguageLevel.BUSINESS_CONVERSATION,
            isVisible: true,
            priority: 1,
            resume,
            languageTests: [],
            createdAt: now - 180 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
    ];

    const attachments: Attachment[] = [];

    return { resume, careers, educations, projects, activities, languageSkills, attachments };
};

// 2. 기획자
export const createSampleResume3 = () => {
    const now = Date.now();
    const worker: Worker = {
        id: "worker-3",
        phone: "010-3456-7890",
        email: "jieun.lee@example.com",
        birthDate: now - 26 * 365 * 24 * 60 * 60 * 1000,
        gender: Worker_Gender.FEMALE,
        nickName: "이지은",
        status: Worker_WorkerStatus.ACTIVE,
        createdAt: now - 365 * 24 * 60 * 60 * 1000,
        updatedAt: now,
    };

    const resume: Resume = {
        id: "resume-3",
        title: "이지은_기획자",
        name: "이지은",
        phone: "010-3456-7890",
        email: "jieun.lee@example.com",
        birthDate: now - 26 * 365 * 24 * 60 * 60 * 1000,
        gender: Resume_Gender.FEMALE,
        position: "기획자",
        description: "서비스 기획과 사용자 리서치에 능숙한 3년차 기획자입니다.",
        isDefault: true,
        worker,
        createdAt: now - 120 * 24 * 60 * 60 * 1000,
        updatedAt: now - 1 * 24 * 60 * 60 * 1000,
    };

    const careers: Career[] = [
        {
            id: "career-3-1",
            name: "토스",
            position: "기획자",
            department: "기획팀",
            employmentType: Career_EmploymentType.FULL_TIME,
            rank: "주니어",
            jobTitle: "기획자",
            salary: 7000,
            description:
                "서비스 기획 및 기능 기획\n- 기능 명세서 작성\n- 사용자 리서치 및 피드백 수집",
            isVisible: true,
            priority: 1,
            startedAt: now - 3 * 365 * 24 * 60 * 60 * 1000,
            endedAt: 0,
            isWorking: true,
            resume,
            salaries: [],
            createdAt: now - 3 * 365 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
    ];

    const educations: Education[] = [
        {
            id: "education-3-1",
            major: "정보시스템학",
            name: "연세대학교",
            description: "학점 3.8/4.5",
            status: Education_EducationStatus.GRADUATED,
            startedAt: now - 8 * 365 * 24 * 60 * 60 * 1000,
            endedAt: now - 4 * 365 * 24 * 60 * 60 * 1000,
            isVisible: true,
            priority: 1,
            resume,
            createdAt: now - 150 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
    ];

    const projects: Project[] = [
        {
            id: "project-3-1",
            title: "디자인 시스템 구축",
            affiliation: "토스",
            role: "기획 리드",
            description: "디자인 시스템 구축 프로젝트 기획",
            startedAt: now - 300 * 24 * 60 * 60 * 1000,
            endedAt: now - 150 * 24 * 60 * 60 * 1000,
            isVisible: true,
            priority: 1,
            resume,
            createdAt: now - 300 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
    ];

    const activities: Activity[] = [];
    const languageSkills: LanguageSkill[] = [
        {
            id: "lang-3-1",
            language: LanguageSkill_Language.ENGLISH,
            level: LanguageSkill_LanguageLevel.BUSINESS_CONVERSATION,
            isVisible: true,
            priority: 1,
            resume,
            languageTests: [],
            createdAt: now - 150 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
    ];
    const attachments: Attachment[] = [];

    return { resume, careers, educations, projects, activities, languageSkills, attachments };
};

// 3. UX/UI 디자이너
export const createSampleResume4 = () => {
    const now = Date.now();
    const worker: Worker = {
        id: "worker-4",
        status: Worker_WorkerStatus.ACTIVE,
        phone: "010-4567-8901",
        email: "seoyeon.park@example.com",
        birthDate: now - 29 * 365 * 24 * 60 * 60 * 1000,
        gender: Worker_Gender.FEMALE,
        nickName: "박서연",
        createdAt: now - 365 * 24 * 60 * 60 * 1000,
        updatedAt: now,
    };

    const resume: Resume = {
        id: "resume-4",
        title: "박서연_UX디자이너",
        name: "박서연",
        phone: "010-4567-8901",
        email: "seoyeon.park@example.com",
        birthDate: now - 29 * 365 * 24 * 60 * 60 * 1000,
        gender: Resume_Gender.FEMALE,
        position: "UX/UI 디자이너",
        description: "사용자 중심의 디자인을 추구하는 7년차 UX 디자이너입니다.",
        isDefault: false,
        worker,
        createdAt: now - 45 * 24 * 60 * 60 * 1000,
        updatedAt: now - 4 * 24 * 60 * 60 * 1000,
    };

    const careers: Career[] = [
        {
            id: "career-4-1",
            name: "카카오",
            position: "UX 디자이너",
            startedAt: now - 4 * 365 * 24 * 60 * 60 * 1000,
            endedAt: 0,
            isWorking: true,
            employmentType: Career_EmploymentType.FULL_TIME,
            salary: 68000000,
            department: "카카오페이팀",
            jobTitle: "UX 디자이너",
            rank: "시니어",
            description: "카카오페이 앱 UX 개선",
            isVisible: true,
            salaries: [],
            priority: 1,
            resume,
            createdAt: now - 4 * 365 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
        {
            id: "career-4-2",
            name: "우아한형제들",
            position: "UI 디자이너",
            startedAt: now - 7 * 365 * 24 * 60 * 60 * 1000,
            endedAt: now - 4 * 365 * 24 * 60 * 60 * 1000,
            isWorking: false,
            employmentType: Career_EmploymentType.FULL_TIME,
            salary: 55000000,
            department: "배민앱팀",
            jobTitle: "UI 디자이너",
            rank: "주니어",
            description: "배민 앱 UI 디자인",
            isVisible: true,
            salaries: [],
            priority: 1,
            resume,
            createdAt: now - 7 * 365 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
    ];

    const educations: Education[] = [
        {
            id: "education-4-1",
            name: "홍익대학교",
            major: "시각디자인",
            startedAt: now - 11 * 365 * 24 * 60 * 60 * 1000,
            endedAt: now - 7 * 365 * 24 * 60 * 60 * 1000,
            status: Education_EducationStatus.GRADUATED,
            description: "학점 3.9/4.5",
            isVisible: true,
            priority: 1,
            resume,
            createdAt: now - 200 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
    ];

    const projects: Project[] = [
        {
            id: "project-4-1",
            title: "카카오페이 리디자인",
            affiliation: "카카오",
            role: "UX 디자이너",
            startedAt: now - 400 * 24 * 60 * 60 * 1000,
            endedAt: now - 300 * 24 * 60 * 60 * 1000,
            description: "사용자 경험 개선을 위한 전면 리디자인",
            isVisible: true,
            priority: 1,
            resume,
            createdAt: now - 400 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
    ];

    const activities: Activity[] = [
        {
            id: "activity-4-1",
            name: "UX Korea 컨퍼런스 발표",
            type: Activity_ActivityType.EXTERNAL,
            organization: "UX Korea",
            certificateNumber: "",
            startedAt: now - 180 * 24 * 60 * 60 * 1000,
            endedAt: now - 180 * 24 * 60 * 60 * 1000,
            description: "사용자 리서치 방법론 공유",
            isVisible: true,
            priority: 1,
            resume,
            createdAt: now - 180 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
    ];

    const languageSkills: LanguageSkill[] = [];
    const attachments: Attachment[] = [
        {
            id: "attachment-4-1",
            category: Attachment_AttachmentCategory.FILE,
            url: "",
            fileName: "portfolio.pdf",
            fileUrl: "https://example.com/portfolio.pdf",
            type: Attachment_AttachmentType.RESUME,
            isVisible: true,
            priority: 1,
            targetId: "",
            targetType: Attachment_AttachmentTargetType.ENTITY_RESUME,
            createdAt: now - 200 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
    ];

    return { resume, careers, educations, projects, activities, languageSkills, attachments };
};

// 4. 프로덕트 매니저
export const createSampleResume5 = () => {
    const now = Date.now();
    const worker: Worker = {
        id: "worker-5",
        status: Worker_WorkerStatus.ACTIVE,
        phone: "010-5678-9012",
        email: "junho.choi@example.com",
        birthDate: now - 32 * 365 * 24 * 60 * 60 * 1000,
        gender: Worker_Gender.MALE,
        nickName: "최준호",
        createdAt: now - 365 * 24 * 60 * 60 * 1000,
        updatedAt: now,
    };

    const resume: Resume = {
        id: "resume-5",
        title: "최준호_프로덕트매니저",
        name: "최준호",
        phone: "010-5678-9012",
        email: "junho.choi@example.com",
        birthDate: now - 32 * 365 * 24 * 60 * 60 * 1000,
        gender: Resume_Gender.MALE,
        position: "프로덕트 매니저",
        description: "데이터 기반 의사결정을 중시하는 8년차 PM입니다.",
        isDefault: false,
        worker,
        createdAt: now - 90 * 24 * 60 * 60 * 1000,
        updatedAt: now - 7 * 24 * 60 * 60 * 1000,
    };

    const careers: Career[] = [
        {
            id: "career-5-1",
            name: "쿠팡",
            position: "Product Manager",
            startedAt: now - 5 * 365 * 24 * 60 * 60 * 1000,
            endedAt: 0,
            isWorking: true,
            employmentType: Career_EmploymentType.FULL_TIME,
            salary: 95000000,
            department: "로켓배송팀",
            jobTitle: "Product Manager",
            rank: "시니어",
            description: "로켓배송 서비스 기획 및 개선",
            isVisible: true,
            salaries: [],
            priority: 1,
            resume,
            createdAt: now - 5 * 365 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
        {
            id: "career-5-2",
            name: "라인",
            position: "Associate PM",
            startedAt: now - 8 * 365 * 24 * 60 * 60 * 1000,
            endedAt: now - 5 * 365 * 24 * 60 * 60 * 1000,
            isWorking: false,
            employmentType: Career_EmploymentType.FULL_TIME,
            salary: 65000000,
            department: "메신저팀",
            jobTitle: "Product Manager",
            rank: "주니어",
            description: "라인 메신저 신규 기능 기획",
            isVisible: true,
            salaries: [],
            priority: 1,
            resume,
            createdAt: now - 8 * 365 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
    ];

    const educations: Education[] = [
        {
            id: "education-5-1",
            name: "고려대학교",
            major: "경영학",
            startedAt: now - 14 * 365 * 24 * 60 * 60 * 1000,
            endedAt: now - 10 * 365 * 24 * 60 * 60 * 1000,
            status: Education_EducationStatus.GRADUATED,
            description: "학점 4.2/4.5",
            isVisible: true,
            priority: 1,
            resume,
            createdAt: now - 220 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
    ];

    const projects: Project[] = [
        {
            id: "project-5-1",
            title: "로켓배송 최적화 프로젝트",
            affiliation: "쿠팡",
            role: "Product Manager",
            startedAt: now - 450 * 24 * 60 * 60 * 1000,
            endedAt: now - 300 * 24 * 60 * 60 * 1000,
            description: "AI 기반 배송 경로 최적화",
            isVisible: true,
            priority: 1,
            resume,
            createdAt: now - 450 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
    ];

    const activities: Activity[] = [];
    const languageSkills: LanguageSkill[] = [
        {
            id: "lang-5-1",
            language: LanguageSkill_Language.ENGLISH,
            level: LanguageSkill_LanguageLevel.NATIVE_LEVEL,
            languageTests: [
                {
                    id: "lang-test-5-1",
                    name: "TOEIC",
                    score: "925",
                    acquiredAt: now - 220 * 24 * 60 * 60 * 1000,
                    isVisible: true,
                    priority: 1,
                    createdAt: now - 220 * 24 * 60 * 60 * 1000,
                    updatedAt: now - 220 * 24 * 60 * 60 * 1000,
                },
            ],
            isVisible: true,
            priority: 1,
            resume,
            createdAt: now - 220 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
    ];
    const attachments: Attachment[] = [];

    return { resume, careers, educations, projects, activities, languageSkills, attachments };
};

// 5. 데이터 분석가
export const createSampleResume6 = () => {
    const now = Date.now();
    const worker: Worker = {
        id: "worker-6",
        status: Worker_WorkerStatus.ACTIVE,
        phone: "010-6789-0123",
        email: "subin.jung@example.com",
        birthDate: now - 27 * 365 * 24 * 60 * 60 * 1000,
        gender: Worker_Gender.FEMALE,
        nickName: "정수빈",
        createdAt: now - 365 * 24 * 60 * 60 * 1000,
        updatedAt: now,
    };

    const resume: Resume = {
        id: "resume-6",
        title: "정수빈_데이터분석가",
        name: "정수빈",
        phone: "010-6789-0123",
        email: "subin.jung@example.com",
        birthDate: now - 27 * 365 * 24 * 60 * 60 * 1000,
        gender: Resume_Gender.FEMALE,
        position: "데이터 분석가",
        description: "Python과 SQL을 활용한 데이터 분석 전문가입니다.",
        isDefault: false,
        worker,
        createdAt: now - 200 * 24 * 60 * 60 * 1000,
        updatedAt: now - 15 * 24 * 60 * 60 * 1000,
    };

    const careers: Career[] = [
        {
            id: "career-6-1",
            name: "넷플릭스",
            position: "Data Analyst",
            startedAt: now - 4 * 365 * 24 * 60 * 60 * 1000,
            endedAt: 0,
            isWorking: true,
            employmentType: Career_EmploymentType.FULL_TIME,
            salary: 78000000,
            department: "Growth팀",
            jobTitle: "Data Analyst",
            rank: "미드",
            description: "사용자 행동 데이터 분석",
            isVisible: true,
            salaries: [],
            priority: 1,
            resume,
            createdAt: now - 4 * 365 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
    ];

    const educations: Education[] = [
        {
            id: "education-6-1",
            name: "카이스트",
            major: "산업공학",
            startedAt: now - 9 * 365 * 24 * 60 * 60 * 1000,
            endedAt: now - 5 * 365 * 24 * 60 * 60 * 1000,
            status: Education_EducationStatus.GRADUATED,
            description: "학점 4.1/4.5",
            isVisible: true,
            priority: 1,
            resume,
            createdAt: now - 170 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
    ];

    const projects: Project[] = [
        {
            id: "project-6-1",
            title: "추천 알고리즘 개선",
            affiliation: "넷플릭스",
            role: "Data Analyst",
            startedAt: now - 350 * 24 * 60 * 60 * 1000,
            endedAt: now - 200 * 24 * 60 * 60 * 1000,
            description: "머신러닝 기반 콘텐츠 추천 시스템",
            isVisible: true,
            priority: 1,
            resume,
            createdAt: now - 350 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
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
        id: "worker-7",
        status: Worker_WorkerStatus.ACTIVE,
        phone: "010-7890-1234",
        email: "dongwoo.kang@example.com",
        birthDate: now - 31 * 365 * 24 * 60 * 60 * 1000,
        gender: Worker_Gender.MALE,
        nickName: "강동우",
        createdAt: now - 365 * 24 * 60 * 60 * 1000,
        updatedAt: now,
    };

    const resume: Resume = {
        id: "resume-7",
        title: "강동우_DevOps엔지니어",
        name: "강동우",
        phone: "010-7890-1234",
        email: "dongwoo.kang@example.com",
        birthDate: now - 31 * 365 * 24 * 60 * 60 * 1000,
        gender: Resume_Gender.MALE,
        position: "DevOps 엔지니어",
        description: "Kubernetes와 AWS에 능숙한 인프라 전문가입니다.",
        isDefault: false,
        worker,
        createdAt: now - 60 * 24 * 60 * 60 * 1000,
        updatedAt: now - 10 * 24 * 60 * 60 * 1000,
    };

    const careers: Career[] = [
        {
            id: "career-7-1",
            name: "삼성전자",
            position: "DevOps Engineer",
            startedAt: now - 6 * 365 * 24 * 60 * 60 * 1000,
            endedAt: 0,
            isWorking: true,
            employmentType: Career_EmploymentType.FULL_TIME,
            salary: 88000000,
            department: "클라우드플랫폼팀",
            jobTitle: "DevOps Engineer",
            rank: "시니어",
            description: "CI/CD 파이프라인 구축 및 운영",
            isVisible: true,
            salaries: [],
            priority: 1,
            resume,
            createdAt: now - 6 * 365 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
    ];

    const educations: Education[] = [
        {
            id: "education-7-1",
            name: "포항공대",
            major: "컴퓨터공학",
            startedAt: now - 13 * 365 * 24 * 60 * 60 * 1000,
            endedAt: now - 9 * 365 * 24 * 60 * 60 * 1000,
            status: Education_EducationStatus.GRADUATED,
            description: "학점 3.7/4.5",
            isVisible: true,
            priority: 1,
            resume,
            createdAt: now - 190 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
    ];

    const projects: Project[] = [
        {
            id: "project-7-1",
            title: "IaC 구축",
            affiliation: "삼성전자",
            role: "DevOps Engineer",
            startedAt: now - 400 * 24 * 60 * 60 * 1000,
            endedAt: now - 250 * 24 * 60 * 60 * 1000,
            description: "Terraform을 이용한 인프라 코드화",
            isVisible: true,
            priority: 1,
            resume,
            createdAt: now - 400 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
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
        id: "worker-8",
        status: Worker_WorkerStatus.ACTIVE,
        phone: "010-8901-2345",
        email: "seoa.yoon@example.com",
        birthDate: now - 28 * 365 * 24 * 60 * 60 * 1000,
        gender: Worker_Gender.FEMALE,
        nickName: "윤서아",
        createdAt: now - 365 * 24 * 60 * 60 * 1000,
        updatedAt: now,
    };

    const resume: Resume = {
        id: "resume-8",
        title: "윤서아_퍼포먼스마케터",
        name: "윤서아",
        phone: "010-8901-2345",
        email: "seoa.yoon@example.com",
        birthDate: now - 28 * 365 * 24 * 60 * 60 * 1000,
        gender: Resume_Gender.FEMALE,
        position: "퍼포먼스 마케터",
        description: "데이터 기반 마케팅 전략 수립 및 실행 전문가입니다.",
        isDefault: false,
        worker,
        createdAt: now - 150 * 24 * 60 * 60 * 1000,
        updatedAt: now - 12 * 24 * 60 * 60 * 1000,
    };

    const careers: Career[] = [
        {
            id: "career-8-1",
            name: "당근마켓",
            position: "Performance Marketer",
            startedAt: now - 4 * 365 * 24 * 60 * 60 * 1000,
            endedAt: 0,
            isWorking: true,
            employmentType: Career_EmploymentType.FULL_TIME,
            salary: 65000000,
            department: "그로스팀",
            jobTitle: "Performance Marketer",
            rank: "미드",
            description: "UA 광고 운영 및 최적화",
            isVisible: true,
            priority: 1,
            resume,
            salaries: [],
            createdAt: now - 4 * 365 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
    ];

    const educations: Education[] = [
        {
            id: "education-8-1",
            name: "이화여대",
            major: "경영학",
            startedAt: now - 10 * 365 * 24 * 60 * 60 * 1000,
            endedAt: now - 6 * 365 * 24 * 60 * 60 * 1000,
            status: Education_EducationStatus.GRADUATED,
            description: "학점 3.8/4.5",
            isVisible: true,
            priority: 1,
            resume,
            createdAt: now - 160 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
    ];

    const projects: Project[] = [
        {
            id: "project-8-1",
            title: "브랜딩 캠페인",
            affiliation: "당근마켓",
            role: "Performance Marketer",
            startedAt: now - 300 * 24 * 60 * 60 * 1000,
            endedAt: now - 200 * 24 * 60 * 60 * 1000,
            description: "신규 사용자 확보 캠페인",
            isVisible: true,
            priority: 1,
            resume,
            createdAt: now - 300 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
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
        id: "worker-9",
        status: Worker_WorkerStatus.ACTIVE,
        phone: "010-9012-3456",
        email: "hyunwoo.cho@example.com",
        birthDate: now - 30 * 365 * 24 * 60 * 60 * 1000,
        gender: Worker_Gender.MALE,
        nickName: "조현우",
        createdAt: now - 365 * 24 * 60 * 60 * 1000,
        updatedAt: now,
    };

    const resume: Resume = {
        id: "resume-9",
        title: "조현우_QA엔지니어",
        name: "조현우",
        phone: "010-9012-3456",
        email: "hyunwoo.jo@example.com",
        birthDate: now - 29 * 365 * 24 * 60 * 60 * 1000,
        gender: Resume_Gender.MALE,
        position: "QA 엔지니어",
        description: "자동화 테스트에 능숙한 6년차 QA 엔지니어입니다.",
        isDefault: false,
        worker,
        createdAt: now - 30 * 24 * 60 * 60 * 1000,
        updatedAt: now - 5 * 24 * 60 * 60 * 1000,
    };

    const careers: Career[] = [
        {
            id: "career-9-1",
            name: "NHN",
            position: "QA Engineer",
            startedAt: now - 6 * 365 * 24 * 60 * 60 * 1000,
            endedAt: 0,
            isWorking: true,
            employmentType: Career_EmploymentType.FULL_TIME,
            salary: 72000000,
            department: "품질관리팀",
            jobTitle: "QA Engineer",
            rank: "시니어",
            description: "자동화 테스트 구축 및 운영",
            isVisible: true,
            salaries: [],
            priority: 1,
            resume,
            createdAt: now - 6 * 365 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
    ];

    const educations: Education[] = [
        {
            id: "education-9-1",
            name: "성균관대",
            major: "소프트웨어학",
            startedAt: now - 11 * 365 * 24 * 60 * 60 * 1000,
            endedAt: now - 7 * 365 * 24 * 60 * 60 * 1000,
            status: Education_EducationStatus.GRADUATED,
            description: "학점 3.6/4.5",
            isVisible: true,
            priority: 1,
            resume,
            createdAt: now - 180 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
    ];

    const projects: Project[] = [
        {
            id: "project-9-1",
            title: "E2E 테스트 자동화",
            affiliation: "NHN",
            role: "QA Engineer",
            startedAt: now - 380 * 24 * 60 * 60 * 1000,
            endedAt: now - 230 * 24 * 60 * 60 * 1000,
            description: "Playwright 기반 테스트 자동화",
            isVisible: true,
            priority: 1,
            resume,
            createdAt: now - 380 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
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
        id: "worker-10",
        status: Worker_WorkerStatus.ACTIVE,
        phone: "010-0123-4567",
        email: "minji.song@example.com",
        birthDate: now - 26 * 365 * 24 * 60 * 60 * 1000,
        gender: Worker_Gender.FEMALE,
        nickName: "송민지",
        createdAt: now - 365 * 24 * 60 * 60 * 1000,
        updatedAt: now,
    };

    const resume: Resume = {
        id: "resume-10",
        title: "송민지_iOS개발자",
        name: "송민지",
        phone: "010-0123-4567",
        email: "minji.song@example.com",
        birthDate: now - 26 * 365 * 24 * 60 * 60 * 1000,
        gender: Resume_Gender.FEMALE,
        position: "iOS 개발자",
        description: "Swift와 SwiftUI를 전문으로 하는 iOS 개발자입니다.",
        isDefault: false,
        worker,
        createdAt: now - 180 * 24 * 60 * 60 * 1000,
        updatedAt: now - 20 * 24 * 60 * 60 * 1000,
    };

    const careers: Career[] = [
        {
            id: "career-10-1",
            name: "야놀자",
            position: "iOS Developer",
            startedAt: now - 3 * 365 * 24 * 60 * 60 * 1000,
            endedAt: 0,
            isWorking: true,
            employmentType: Career_EmploymentType.FULL_TIME,
            salary: 68000000,
            department: "앱개발팀",
            jobTitle: "iOS Developer",
            rank: "주니어",
            description: "iOS 앱 개발 및 유지보수",
            isVisible: true,
            salaries: [],
            priority: 1,
            resume,
            createdAt: now - 3 * 365 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
    ];

    const educations: Education[] = [
        {
            id: "education-10-1",
            name: "한양대학교",
            major: "컴퓨터소프트웨어학",
            startedAt: now - 8 * 365 * 24 * 60 * 60 * 1000,
            endedAt: now - 4 * 365 * 24 * 60 * 60 * 1000,
            status: Education_EducationStatus.GRADUATED,
            description: "학점 3.9/4.5",
            isVisible: true,
            priority: 1,
            resume,
            createdAt: now - 140 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
    ];

    const projects: Project[] = [
        {
            id: "project-10-1",
            affiliation: "야놀자",
            role: "iOS Developer",
            title: "예약 시스템 리뉴얼",
            startedAt: now - 280 * 24 * 60 * 60 * 1000,
            endedAt: now - 180 * 24 * 60 * 60 * 1000,
            description: "SwiftUI로 예약 화면 재구성",
            isVisible: true,
            priority: 1,
            resume,
            createdAt: now - 280 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
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
        id: "worker-11",
        status: Worker_WorkerStatus.ACTIVE,
        phone: "010-1357-2468",
        email: "jihoon.han@example.com",
        birthDate: now - 30 * 365 * 24 * 60 * 60 * 1000,
        gender: Worker_Gender.MALE,
        nickName: "한지훈",
        createdAt: now - 365 * 24 * 60 * 60 * 1000,
        updatedAt: now,
    };

    const resume: Resume = {
        id: "resume-11",
        title: "한지훈_AI엔지니어",
        name: "한지훈",
        phone: "010-1357-2468",
        email: "jihoon.han@example.com",
        birthDate: now - 30 * 365 * 24 * 60 * 60 * 1000,
        gender: Resume_Gender.MALE,
        position: "AI 엔지니어",
        description: "딥러닝과 NLP 전문 AI 엔지니어입니다.",
        isDefault: false,
        worker,
        createdAt: now - 250 * 24 * 60 * 60 * 1000,
        updatedAt: now - 18 * 24 * 60 * 60 * 1000,
    };

    const careers: Career[] = [
        {
            id: "career-11-1",
            name: "네이버 클로바",
            position: "AI Researcher",
            startedAt: now - 5 * 365 * 24 * 60 * 60 * 1000,
            endedAt: 0,
            isWorking: true,
            employmentType: Career_EmploymentType.FULL_TIME,
            salary: 95000000,
            department: "AI Lab",
            jobTitle: "AI Researcher",
            rank: "시니어",
            description: "NLP 모델 개발 및 최적화",
            isVisible: true,
            priority: 1,
            salaries: [],
            resume,
            createdAt: now - 5 * 365 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
    ];

    const educations: Education[] = [
        {
            id: "education-11-1",
            name: "서울대학교",
            major: "인공지능",
            startedAt: now - 12 * 365 * 24 * 60 * 60 * 1000,
            endedAt: now - 10 * 365 * 24 * 60 * 60 * 1000,
            status: Education_EducationStatus.GRADUATED,
            description: "석사 학위",
            isVisible: true,
            priority: 1,
            resume,
            createdAt: now - 210 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
        {
            id: "education-11-2",
            name: "서울대학교",
            major: "컴퓨터공학",
            startedAt: now - 14 * 365 * 24 * 60 * 60 * 1000,
            endedAt: now - 10 * 365 * 24 * 60 * 60 * 1000,
            status: Education_EducationStatus.GRADUATED,
            description: "학점 4.3/4.5",
            isVisible: true,
            priority: 1,
            resume,
            createdAt: now - 210 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
    ];

    const projects: Project[] = [
        {
            id: "project-11-1",
            title: "한국어 감정 분석 모델",
            affiliation: "네이버 클로바",
            role: "AI Researcher",
            startedAt: now - 420 * 24 * 60 * 60 * 1000,
            endedAt: now - 270 * 24 * 60 * 60 * 1000,
            description: "Transformer 기반 감정 분석 시스템",
            isVisible: true,
            priority: 1,
            resume,
            createdAt: now - 420 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
    ];

    const activities: Activity[] = [
        {
            id: "activity-11-1",
            name: "NeurIPS 논문 발표",
            type: Activity_ActivityType.EXTERNAL,
            certificateNumber: "",
            organization: "NeurIPS",
            startedAt: now - 250 * 24 * 60 * 60 * 1000,
            endedAt: now - 250 * 24 * 60 * 60 * 1000,
            description: "한국어 NLP 모델 성능 개선 연구",
            isVisible: true,
            priority: 1,
            resume,
            createdAt: now - 250 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
    ];

    const languageSkills: LanguageSkill[] = [
        {
            id: "lang-11-1",
            language: LanguageSkill_Language.ENGLISH,
            level: LanguageSkill_LanguageLevel.NATIVE_LEVEL,
            isVisible: true,
            priority: 1,
            resume,
            languageTests: [
                {
                    id: "lang-test-11-1",
                    name: "TOEIC",
                    score: "925",
                    acquiredAt: now - 210 * 24 * 60 * 60 * 1000,
                    isVisible: true,
                    priority: 1,
                    createdAt: now - 210 * 24 * 60 * 60 * 1000,
                    updatedAt: now - 210 * 24 * 60 * 60 * 1000,
                },
            ],
            createdAt: now - 210 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
    ];
    const attachments: Attachment[] = [];

    return { resume, careers, educations, projects, activities, languageSkills, attachments };
};

// 빈 샘플 Resume 데이터 (기본값만)
export const createEmptySampleResume = (): Resume => {
    const now = Date.now();
    const worker = createSampleWorker();

    return {
        id: "resume-empty",
        title: "",
        name: "",
        phone: "",
        email: "",
        birthDate: undefined,
        gender: undefined,
        position: "",
        description: "",
        isDefault: false,
        worker,
        createdAt: now,
        updatedAt: now,
    };
};

// 빈 샘플 Career 데이터
export const createEmptySampleCareers = (): Career[] => {
    const now = Date.now();
    const resume = createEmptySampleResume();

    return [
        {
            id: "career-empty",
            name: "",
            position: "",
            department: "",
            employmentType: undefined,
            jobTitle: "",
            rank: "",
            salary: 0,
            description: "",
            isVisible: true,
            priority: 0,
            startedAt: undefined,
            endedAt: undefined,
            isWorking: false,
            resume,
            salaries: [
                {
                    id: "salary-empty",
                    amount: 0,
                    negotiationDate: undefined,
                    memo: "",
                    isVisible: true,
                    priority: 0,
                    career: undefined,
                    createdAt: now,
                    updatedAt: now,
                },
            ],
            createdAt: now,
            updatedAt: now,
        },
    ];
};

// 빈 샘플 Education 데이터
export const createEmptySampleEducations = (): Education[] => {
    const now = Date.now();
    const resume = createEmptySampleResume();

    return [
        {
            id: "education-empty",
            major: "",
            name: "",
            description: "",
            status: undefined,
            startedAt: undefined,
            endedAt: undefined,
            isVisible: true,
            priority: 0,
            resume,
            createdAt: now,
            updatedAt: now,
        },
    ];
};

// 빈 샘플 Project 데이터
export const createEmptySampleProjects = (): Project[] => {
    const now = Date.now();
    const resume = createEmptySampleResume();

    return [
        {
            id: "project-empty",
            title: "",
            affiliation: "",
            role: "",
            description: "",
            startedAt: undefined,
            endedAt: undefined,
            isVisible: true,
            priority: 0,
            resume,
            createdAt: now,
            updatedAt: now,
        },
    ];
};

// 빈 샘플 Activity 데이터
export const createEmptySampleActivities = (): Activity[] => {
    const now = Date.now();
    const resume = createEmptySampleResume();

    return [
        {
            id: "activity-empty",
            type: undefined,
            name: "",
            organization: "",
            certificateNumber: "",
            startedAt: undefined,
            endedAt: undefined,
            description: "",
            isVisible: true,
            priority: 0,
            resume,
            createdAt: now,
            updatedAt: now,
        },
    ];
};

// 빈 샘플 LanguageSkill 데이터
export const createEmptySampleLanguageSkills = (): LanguageSkill[] => {
    const now = Date.now();
    const resume = createEmptySampleResume();

    return [
        {
            id: "lang-empty",
            language: undefined,
            level: undefined,
            isVisible: true,
            priority: 0,
            resume,
            languageTests: [
                {
                    id: "lang-test-empty",
                    name: "",
                    score: "",
                    acquiredAt: undefined,
                    isVisible: true,
                    priority: 0,
                    createdAt: now,
                    updatedAt: now,
                },
            ],
            createdAt: now,
            updatedAt: now,
        },
    ];
};

// 빈 샘플 Attachment 데이터
export const createEmptySampleAttachments = (): Attachment[] => {
    const now = Date.now();

    return [
        {
            id: "attachment-empty",
            type: undefined,
            fileName: "",
            fileUrl: "",
            category: Attachment_AttachmentCategory.FILE,
            url: "",
            isVisible: true,
            priority: 0,
            targetId: "",
            targetType: Attachment_AttachmentTargetType.ENTITY_RESUME,
            createdAt: now,
            updatedAt: now,
        },
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

// 모든 샘플 Resume 데이터를 한 번에 반환 (가이드에 따라 3개만)
export const createAllSampleResumes = () => {
    return [createSampleResume2(), createSampleResume3(), createSampleResume4()];
};

/** URL 템플릿 미리보기용 샘플 ResumeDetail (공개 이력서 페이지와 동일 구조) */
export const createSampleResumeDetailForPreview = (): ResumeDetail => {
    const now = Date.now();
    const resume = createSampleResume();
    const careers = createSampleCareers();
    const educations = createSampleEducations();
    const projects = createSampleProjects();
    const activities = createSampleActivities();
    const languageSkills = createSampleLanguageSkills();
    const attachments = createSampleAttachments();
    return {
        id: resume.id,
        title: resume.title,
        name: resume.name,
        phone: resume.phone,
        email: resume.email,
        birthDate: resume.birthDate,
        gender: resume.gender,
        position: resume.position,
        description: resume.description,
        isPublic: true,
        isDefault: resume.isDefault,
        publicId: "preview",
        publicStartDate: now - 365 * 24 * 60 * 60 * 1000,
        publicEndDate: now + 365 * 24 * 60 * 60 * 1000,
        worker: resume.worker,
        careers,
        educations,
        projects,
        activities,
        languageSkills,
        attachments,
        createdAt: resume.createdAt,
        updatedAt: resume.updatedAt,
    };
};
