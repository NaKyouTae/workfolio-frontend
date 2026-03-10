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
        credit: 0,
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
        {
            id: "activity-5",
            name: "정보처리기사",
            organization: "한국산업인력공단",
            certificateNumber: "CERT-2022-56789",
            description: "정보처리기사 자격증 취득",
            startedAt: now - 18 * 30 * 24 * 60 * 60 * 1000,
            endedAt: now - 18 * 30 * 24 * 60 * 60 * 1000,
            isVisible: true,
            type: Activity_ActivityType.CERTIFICATION,
            priority: 5,
            resume,
            createdAt: now - 18 * 30 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
        {
            id: "activity-6",
            name: "SQLD",
            organization: "한국데이터산업진흥원",
            certificateNumber: "SQLD-2023-12345",
            description: "SQL 개발자 자격증 취득",
            startedAt: now - 10 * 30 * 24 * 60 * 60 * 1000,
            endedAt: now - 10 * 30 * 24 * 60 * 60 * 1000,
            isVisible: true,
            type: Activity_ActivityType.CERTIFICATION,
            priority: 6,
            resume,
            createdAt: now - 10 * 30 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
        {
            id: "activity-7",
            name: "서비스 기획 공모전 대상",
            organization: "한국인터넷진흥원",
            certificateNumber: "",
            description: "AI 기반 서비스 기획안으로 대상 수상",
            startedAt: now - 8 * 30 * 24 * 60 * 60 * 1000,
            endedAt: now - 8 * 30 * 24 * 60 * 60 * 1000,
            isVisible: true,
            type: Activity_ActivityType.AWARD,
            priority: 7,
            resume,
            createdAt: now - 8 * 30 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
        {
            id: "activity-8",
            name: "UX 디자인 챌린지 우수상",
            organization: "디자인진흥원",
            certificateNumber: "",
            description: "모바일 앱 UX 개선 프로젝트로 우수상 수상",
            startedAt: now - 14 * 30 * 24 * 60 * 60 * 1000,
            endedAt: now - 14 * 30 * 24 * 60 * 60 * 1000,
            isVisible: true,
            type: Activity_ActivityType.COMPETITION,
            priority: 8,
            resume,
            createdAt: now - 14 * 30 * 24 * 60 * 60 * 1000,
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

// ===== 기업 유형별 샘플 이력서 데이터 (5세트) =====

// 1. 스타트업 이력서
export const createStartupResume = () => {
    const now = Date.now();
    const worker: Worker = {
        id: "worker-startup",
        status: Worker_WorkerStatus.ACTIVE,
        nickName: "김도현",
        phone: "010-2345-6789",
        email: "dohyun.kim@example.com",
        birthDate: now - 28 * 365 * 24 * 60 * 60 * 1000,
        gender: Worker_Gender.MALE,
        createdAt: now - 300 * 24 * 60 * 60 * 1000,
        credit: 0,
        updatedAt: now,
    };

    const resume: Resume = {
        id: "resume-startup",
        title: "스타트업 이력서",
        name: "김도현",
        phone: "010-2345-6789",
        email: "dohyun.kim@example.com",
        birthDate: now - 28 * 365 * 24 * 60 * 60 * 1000,
        gender: Resume_Gender.MALE,
        position: "풀스택 개발자",
        description:
            "빠른 실행력과 문제 해결 능력을 갖춘 4년차 풀스택 개발자입니다. 초기 스타트업에서 MVP 개발부터 서비스 스케일업까지 경험했습니다.",
        isDefault: true,
        worker,
        createdAt: now - 280 * 24 * 60 * 60 * 1000,
        updatedAt: now - 3 * 24 * 60 * 60 * 1000,
    };

    const careers: Career[] = [
        {
            id: "career-startup-1",
            name: "핏투게더",
            position: "풀스택 개발자",
            department: "프로덕트팀",
            employmentType: Career_EmploymentType.FULL_TIME,
            rank: "리드",
            jobTitle: "풀스택 개발자",
            salary: 5500,
            description:
                "초기 멤버로 합류하여 서비스 전반 개발\n- MVP 기획 및 개발 (React + Node.js)\n- 사용자 피드백 기반 빠른 이터레이션\n- 월간 활성 사용자 0 → 5만명 성장 기여",
            isVisible: true,
            priority: 1,
            startedAt: now - 2 * 365 * 24 * 60 * 60 * 1000,
            endedAt: 0,
            isWorking: true,
            resume,
            salaries: [],
            createdAt: now - 2 * 365 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
        {
            id: "career-startup-2",
            name: "데일리랩",
            position: "주니어 개발자",
            department: "개발팀",
            employmentType: Career_EmploymentType.FULL_TIME,
            rank: "사원",
            jobTitle: "프론트엔드 개발자",
            salary: 3800,
            description:
                "초기 스타트업에서 프론트엔드 개발 담당\n- React 기반 웹앱 개발\n- 2주 스프린트 기반 애자일 개발",
            isVisible: true,
            priority: 2,
            startedAt: now - 4 * 365 * 24 * 60 * 60 * 1000,
            endedAt: now - 2 * 365 * 24 * 60 * 60 * 1000,
            isWorking: false,
            resume,
            salaries: [],
            createdAt: now - 4 * 365 * 24 * 60 * 60 * 1000,
            updatedAt: now - 2 * 365 * 24 * 60 * 60 * 1000,
        },
    ];

    const educations: Education[] = [
        {
            id: "education-startup-1",
            major: "컴퓨터공학",
            name: "한국외국어대학교",
            description: "학점 3.7/4.5",
            status: Education_EducationStatus.GRADUATED,
            startedAt: now - 8 * 365 * 24 * 60 * 60 * 1000,
            endedAt: now - 4 * 365 * 24 * 60 * 60 * 1000,
            isVisible: true,
            priority: 1,
            resume,
            createdAt: now - 180 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
    ];

    const projects: Project[] = [
        {
            id: "project-startup-1",
            title: "핏투게더 MVP 개발",
            affiliation: "핏투게더",
            role: "풀스택 개발자",
            description:
                "피트니스 매칭 플랫폼 MVP 기획 및 개발\n- 3주 만에 MVP 런칭\n- 사용자 인터뷰 20회 진행 후 피봇 결정\n- 월 매출 0 → 500만원 달성",
            startedAt: now - 18 * 30 * 24 * 60 * 60 * 1000,
            endedAt: now - 12 * 30 * 24 * 60 * 60 * 1000,
            isVisible: true,
            priority: 1,
            resume,
            createdAt: now - 18 * 30 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
        {
            id: "project-startup-2",
            title: "그로스 해킹 프로젝트",
            affiliation: "핏투게더",
            role: "그로스 리드",
            description:
                "데이터 기반 사용자 확보 전략 수립\n- A/B 테스트 30건 이상 진행\n- 전환율 15% → 28% 개선\n- 리텐션율 2배 향상",
            startedAt: now - 8 * 30 * 24 * 60 * 60 * 1000,
            endedAt: now,
            isVisible: true,
            priority: 2,
            resume,
            createdAt: now - 8 * 30 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
    ];

    const activities: Activity[] = [
        {
            id: "activity-startup-1",
            name: "스타트업 해커톤 우승",
            organization: "서울창업허브",
            certificateNumber: "",
            description: "48시간 해커톤에서 AI 기반 헬스케어 서비스로 대상 수상",
            startedAt: now - 200 * 24 * 60 * 60 * 1000,
            endedAt: now - 198 * 24 * 60 * 60 * 1000,
            isVisible: true,
            type: Activity_ActivityType.AWARD,
            priority: 1,
            resume,
            createdAt: now - 200 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
        {
            id: "activity-startup-2",
            name: "정보처리기사",
            organization: "한국산업인력공단",
            certificateNumber: "CERT-2023-11111",
            description: "정보처리기사 자격증 취득",
            startedAt: now - 300 * 24 * 60 * 60 * 1000,
            endedAt: now - 300 * 24 * 60 * 60 * 1000,
            isVisible: true,
            type: Activity_ActivityType.CERTIFICATION,
            priority: 2,
            resume,
            createdAt: now - 300 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
        {
            id: "activity-startup-3",
            name: "AWS Solutions Architect",
            organization: "Amazon Web Services",
            certificateNumber: "AWS-SAA-2024-001",
            description: "AWS 솔루션즈 아키텍트 어소시에이트 자격증 취득",
            startedAt: now - 150 * 24 * 60 * 60 * 1000,
            endedAt: now - 150 * 24 * 60 * 60 * 1000,
            isVisible: true,
            type: Activity_ActivityType.CERTIFICATION,
            priority: 3,
            resume,
            createdAt: now - 150 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
    ];

    const languageSkills: LanguageSkill[] = [
        {
            id: "lang-startup-1",
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

// 2. 중소기업 이력서
export const createSmeResume = () => {
    const now = Date.now();
    const worker: Worker = {
        id: "worker-sme",
        status: Worker_WorkerStatus.ACTIVE,
        phone: "010-3456-7890",
        email: "jieun.lee@example.com",
        birthDate: now - 31 * 365 * 24 * 60 * 60 * 1000,
        gender: Worker_Gender.FEMALE,
        nickName: "이지은",
        createdAt: now - 365 * 24 * 60 * 60 * 1000,
        credit: 0,
        updatedAt: now,
    };

    const resume: Resume = {
        id: "resume-sme",
        title: "중소기업 이력서",
        name: "이지은",
        phone: "010-3456-7890",
        email: "jieun.lee@example.com",
        birthDate: now - 31 * 365 * 24 * 60 * 60 * 1000,
        gender: Resume_Gender.FEMALE,
        position: "경영지원 팀장",
        description:
            "중소기업에서 인사, 총무, 회계 등 경영지원 전반을 담당한 7년차 실무자입니다. 소규모 조직의 효율적 운영에 강점이 있습니다.",
        isDefault: false,
        worker,
        createdAt: now - 120 * 24 * 60 * 60 * 1000,
        updatedAt: now - 1 * 24 * 60 * 60 * 1000,
    };

    const careers: Career[] = [
        {
            id: "career-sme-1",
            name: "(주)한성테크",
            position: "경영지원 팀장",
            department: "경영지원팀",
            employmentType: Career_EmploymentType.FULL_TIME,
            rank: "팀장",
            jobTitle: "경영지원",
            salary: 5200,
            description:
                "경영지원 전반 총괄\n- 인사/총무/회계 업무 관리\n- ERP 시스템 도입 및 운영\n- ISO 9001 인증 획득 주도\n- 직원 교육 프로그램 기획 및 운영",
            isVisible: true,
            priority: 1,
            startedAt: now - 4 * 365 * 24 * 60 * 60 * 1000,
            endedAt: 0,
            isWorking: true,
            resume,
            salaries: [],
            createdAt: now - 4 * 365 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
        {
            id: "career-sme-2",
            name: "(주)미래솔루션",
            position: "인사담당자",
            department: "관리부",
            employmentType: Career_EmploymentType.FULL_TIME,
            rank: "대리",
            jobTitle: "인사담당",
            salary: 3800,
            description:
                "인사 및 총무 업무 담당\n- 채용 프로세스 관리\n- 급여 정산 및 4대보험 관리\n- 거래처 관리 및 계약 업무",
            isVisible: true,
            priority: 2,
            startedAt: now - 7 * 365 * 24 * 60 * 60 * 1000,
            endedAt: now - 4 * 365 * 24 * 60 * 60 * 1000,
            isWorking: false,
            resume,
            salaries: [],
            createdAt: now - 7 * 365 * 24 * 60 * 60 * 1000,
            updatedAt: now - 4 * 365 * 24 * 60 * 60 * 1000,
        },
    ];

    const educations: Education[] = [
        {
            id: "education-sme-1",
            major: "경영학",
            name: "국민대학교",
            description: "학점 3.6/4.5",
            status: Education_EducationStatus.GRADUATED,
            startedAt: now - 13 * 365 * 24 * 60 * 60 * 1000,
            endedAt: now - 9 * 365 * 24 * 60 * 60 * 1000,
            isVisible: true,
            priority: 1,
            resume,
            createdAt: now - 150 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
    ];

    const projects: Project[] = [
        {
            id: "project-sme-1",
            title: "ERP 시스템 도입",
            affiliation: "(주)한성테크",
            role: "프로젝트 매니저",
            description:
                "전사 ERP 시스템 도입 프로젝트 총괄\n- 요구사항 분석 및 벤더 선정\n- 업무 프로세스 재설계\n- 전 직원 교육 진행\n- 업무 효율 30% 향상",
            startedAt: now - 2 * 365 * 24 * 60 * 60 * 1000,
            endedAt: now - 18 * 30 * 24 * 60 * 60 * 1000,
            isVisible: true,
            priority: 1,
            resume,
            createdAt: now - 2 * 365 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
    ];

    const activities: Activity[] = [
        {
            id: "activity-sme-1",
            name: "ERP 정보관리사 1급",
            organization: "한국생산성본부",
            certificateNumber: "ERP-2023-12345",
            description: "ERP 정보관리사 1급 취득",
            startedAt: now - 300 * 24 * 60 * 60 * 1000,
            endedAt: now - 300 * 24 * 60 * 60 * 1000,
            isVisible: true,
            type: Activity_ActivityType.CERTIFICATION,
            priority: 1,
            resume,
            createdAt: now - 300 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
        {
            id: "activity-sme-2",
            name: "중소기업 경영혁신 우수상",
            organization: "중소벤처기업부",
            certificateNumber: "",
            description: "ERP 도입을 통한 경영혁신 우수사례 수상",
            startedAt: now - 180 * 24 * 60 * 60 * 1000,
            endedAt: now - 180 * 24 * 60 * 60 * 1000,
            isVisible: true,
            type: Activity_ActivityType.AWARD,
            priority: 2,
            resume,
            createdAt: now - 180 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
    ];

    const languageSkills: LanguageSkill[] = [];
    const attachments: Attachment[] = [];

    return { resume, careers, educations, projects, activities, languageSkills, attachments };
};

// 3. 중견기업 이력서
export const createMidsizeResume = () => {
    const now = Date.now();
    const worker: Worker = {
        id: "worker-midsize",
        status: Worker_WorkerStatus.ACTIVE,
        phone: "010-4567-8901",
        email: "seoyeon.park@example.com",
        birthDate: now - 34 * 365 * 24 * 60 * 60 * 1000,
        gender: Worker_Gender.FEMALE,
        nickName: "박서연",
        createdAt: now - 365 * 24 * 60 * 60 * 1000,
        credit: 0,
        updatedAt: now,
    };

    const resume: Resume = {
        id: "resume-midsize",
        title: "중견기업 이력서",
        name: "박서연",
        phone: "010-4567-8901",
        email: "seoyeon.park@example.com",
        birthDate: now - 34 * 365 * 24 * 60 * 60 * 1000,
        gender: Resume_Gender.FEMALE,
        position: "해외영업 과장",
        description:
            "10년차 해외영업 전문가입니다. 동남아 시장 개척 및 글로벌 거래선 관리 경험이 풍부하며, 체계적인 영업 프로세스 구축에 강점이 있습니다.",
        isDefault: false,
        worker,
        createdAt: now - 45 * 24 * 60 * 60 * 1000,
        updatedAt: now - 4 * 24 * 60 * 60 * 1000,
    };

    const careers: Career[] = [
        {
            id: "career-midsize-1",
            name: "(주)세원산업",
            position: "해외영업 과장",
            department: "해외사업부",
            employmentType: Career_EmploymentType.FULL_TIME,
            rank: "과장",
            jobTitle: "해외영업",
            salary: 6800,
            description:
                "동남아 시장 영업 총괄\n- 베트남/태국/인도네시아 거래선 40개사 관리\n- 연간 매출 150억원 달성\n- 신규 시장(인도) 진출 프로젝트 리드\n- 해외 전시회 기획 및 참가",
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
        {
            id: "career-midsize-2",
            name: "(주)대한기계",
            position: "해외영업 대리",
            department: "영업팀",
            employmentType: Career_EmploymentType.FULL_TIME,
            rank: "대리",
            jobTitle: "해외영업",
            salary: 4800,
            description:
                "해외 거래처 관리 및 수출 업무\n- 중국/일본 시장 거래선 관리\n- 수출입 서류 관리\n- 해외 바이어 미팅 및 통역",
            isVisible: true,
            priority: 2,
            startedAt: now - 10 * 365 * 24 * 60 * 60 * 1000,
            endedAt: now - 5 * 365 * 24 * 60 * 60 * 1000,
            isWorking: false,
            resume,
            salaries: [],
            createdAt: now - 10 * 365 * 24 * 60 * 60 * 1000,
            updatedAt: now - 5 * 365 * 24 * 60 * 60 * 1000,
        },
    ];

    const educations: Education[] = [
        {
            id: "education-midsize-1",
            major: "국제통상학",
            name: "부산대학교",
            description: "학점 3.8/4.5",
            status: Education_EducationStatus.GRADUATED,
            startedAt: now - 14 * 365 * 24 * 60 * 60 * 1000,
            endedAt: now - 10 * 365 * 24 * 60 * 60 * 1000,
            isVisible: true,
            priority: 1,
            resume,
            createdAt: now - 200 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
    ];

    const projects: Project[] = [
        {
            id: "project-midsize-1",
            title: "인도 시장 신규 진출",
            affiliation: "(주)세원산업",
            role: "프로젝트 리더",
            description:
                "인도 시장 진출 전략 수립 및 실행\n- 시장 조사 및 타당성 분석\n- 현지 파트너사 발굴 (5개사)\n- 첫해 매출 30억원 달성",
            startedAt: now - 18 * 30 * 24 * 60 * 60 * 1000,
            endedAt: now - 6 * 30 * 24 * 60 * 60 * 1000,
            isVisible: true,
            priority: 1,
            resume,
            createdAt: now - 18 * 30 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
        {
            id: "project-midsize-2",
            title: "글로벌 품질 표준화",
            affiliation: "(주)세원산업",
            role: "TF 멤버",
            description:
                "해외 납품 품질 표준화 프로젝트\n- 국제 품질 기준 조사 및 적용\n- 해외 거래선 클레임 50% 감소",
            startedAt: now - 3 * 365 * 24 * 60 * 60 * 1000,
            endedAt: now - 2 * 365 * 24 * 60 * 60 * 1000,
            isVisible: true,
            priority: 2,
            resume,
            createdAt: now - 3 * 365 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
    ];

    const activities: Activity[] = [];

    const languageSkills: LanguageSkill[] = [
        {
            id: "lang-midsize-1",
            language: LanguageSkill_Language.ENGLISH,
            level: LanguageSkill_LanguageLevel.BUSINESS_CONVERSATION,
            isVisible: true,
            priority: 1,
            resume,
            languageTests: [
                {
                    id: "lang-test-midsize-1",
                    name: "TOEIC",
                    score: "885",
                    acquiredAt: now - 6 * 30 * 24 * 60 * 60 * 1000,
                    isVisible: true,
                    priority: 1,
                    createdAt: now - 6 * 30 * 24 * 60 * 60 * 1000,
                    updatedAt: now - 6 * 30 * 24 * 60 * 60 * 1000,
                },
            ],
            createdAt: now - 365 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
        {
            id: "lang-midsize-2",
            language: LanguageSkill_Language.JAPANESE,
            level: LanguageSkill_LanguageLevel.DAILY_CONVERSATION,
            isVisible: true,
            priority: 2,
            resume,
            languageTests: [
                {
                    id: "lang-test-midsize-2",
                    name: "JLPT",
                    score: "N2",
                    acquiredAt: now - 12 * 30 * 24 * 60 * 60 * 1000,
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

    const attachments: Attachment[] = [];

    return { resume, careers, educations, projects, activities, languageSkills, attachments };
};

// 4. 대기업 이력서
export const createEnterpriseResume = () => {
    const now = Date.now();
    const worker: Worker = {
        id: "worker-enterprise",
        status: Worker_WorkerStatus.ACTIVE,
        phone: "010-5678-9012",
        email: "junho.choi@example.com",
        birthDate: now - 36 * 365 * 24 * 60 * 60 * 1000,
        gender: Worker_Gender.MALE,
        nickName: "최준호",
        createdAt: now - 365 * 24 * 60 * 60 * 1000,
        credit: 0,
        updatedAt: now,
    };

    const resume: Resume = {
        id: "resume-enterprise",
        title: "대기업 이력서",
        name: "최준호",
        phone: "010-5678-9012",
        email: "junho.choi@example.com",
        birthDate: now - 36 * 365 * 24 * 60 * 60 * 1000,
        gender: Resume_Gender.MALE,
        position: "전략기획 차장",
        description:
            "12년차 전략기획 전문가입니다. 대기업에서 사업 전략 수립, M&A, 신사업 기획 등 다양한 전략 업무를 수행했습니다.",
        isDefault: false,
        worker,
        createdAt: now - 90 * 24 * 60 * 60 * 1000,
        updatedAt: now - 7 * 24 * 60 * 60 * 1000,
    };

    const careers: Career[] = [
        {
            id: "career-enterprise-1",
            name: "삼성전자",
            position: "전략기획 차장",
            department: "경영기획실",
            employmentType: Career_EmploymentType.FULL_TIME,
            rank: "차장",
            jobTitle: "전략기획",
            salary: 12000,
            description:
                "글로벌 사업 전략 수립 및 실행\n- 반도체 사업부 중장기 전략 수립\n- M&A 실사 및 PMI 프로젝트 리드\n- ESG 경영 전략 기획\n- 이사회 보고 자료 작성",
            isVisible: true,
            priority: 1,
            startedAt: now - 7 * 365 * 24 * 60 * 60 * 1000,
            endedAt: 0,
            isWorking: true,
            resume,
            salaries: [],
            createdAt: now - 7 * 365 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
        {
            id: "career-enterprise-2",
            name: "LG전자",
            position: "전략기획 과장",
            department: "기획조정실",
            employmentType: Career_EmploymentType.FULL_TIME,
            rank: "과장",
            jobTitle: "전략기획",
            salary: 8500,
            description:
                "사업부 전략 기획 담당\n- 연간 사업 계획 수립\n- 경쟁사 분석 및 시장 동향 리포트\n- 글로벌 컨퍼런스 기획",
            isVisible: true,
            priority: 2,
            startedAt: now - 12 * 365 * 24 * 60 * 60 * 1000,
            endedAt: now - 7 * 365 * 24 * 60 * 60 * 1000,
            isWorking: false,
            resume,
            salaries: [],
            createdAt: now - 12 * 365 * 24 * 60 * 60 * 1000,
            updatedAt: now - 7 * 365 * 24 * 60 * 60 * 1000,
        },
    ];

    const educations: Education[] = [
        {
            id: "education-enterprise-1",
            major: "경영학",
            name: "서울대학교",
            description: "학점 4.1/4.5",
            status: Education_EducationStatus.GRADUATED,
            startedAt: now - 18 * 365 * 24 * 60 * 60 * 1000,
            endedAt: now - 14 * 365 * 24 * 60 * 60 * 1000,
            isVisible: true,
            priority: 1,
            resume,
            createdAt: now - 220 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
        {
            id: "education-enterprise-2",
            major: "MBA",
            name: "서울대학교 경영대학원",
            description: "경영전략 전공\n- 우수 논문상 수상",
            status: Education_EducationStatus.GRADUATED,
            startedAt: now - 8 * 365 * 24 * 60 * 60 * 1000,
            endedAt: now - 6 * 365 * 24 * 60 * 60 * 1000,
            isVisible: true,
            priority: 2,
            resume,
            createdAt: now - 220 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
    ];

    const projects: Project[] = [
        {
            id: "project-enterprise-1",
            title: "반도체 사업 M&A 프로젝트",
            affiliation: "삼성전자",
            role: "PMI 리드",
            description:
                "해외 반도체 기업 인수합병 프로젝트\n- 대상 기업 실사 및 가치 평가\n- PMI 전략 수립 및 실행\n- 인수 후 시너지 효과 1,200억원 달성",
            startedAt: now - 3 * 365 * 24 * 60 * 60 * 1000,
            endedAt: now - 2 * 365 * 24 * 60 * 60 * 1000,
            isVisible: true,
            priority: 1,
            resume,
            createdAt: now - 3 * 365 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
        {
            id: "project-enterprise-2",
            title: "디지털 전환 TF",
            affiliation: "삼성전자",
            role: "TF 멤버",
            description:
                "전사 디지털 전환 전략 수립\n- AI/클라우드 기반 업무 혁신\n- RPA 도입으로 반복 업무 40% 자동화",
            startedAt: now - 18 * 30 * 24 * 60 * 60 * 1000,
            endedAt: now - 6 * 30 * 24 * 60 * 60 * 1000,
            isVisible: true,
            priority: 2,
            resume,
            createdAt: now - 18 * 30 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
    ];

    const activities: Activity[] = [
        {
            id: "activity-enterprise-1",
            name: "글로벌 경영 컨퍼런스 발표",
            organization: "World Business Forum",
            certificateNumber: "",
            description: "디지털 전환 시대의 전략 기획 - 300명 참석 기조 발표",
            startedAt: now - 180 * 24 * 60 * 60 * 1000,
            endedAt: now - 180 * 24 * 60 * 60 * 1000,
            isVisible: true,
            type: Activity_ActivityType.AWARD,
            priority: 1,
            resume,
            createdAt: now - 180 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
        {
            id: "activity-enterprise-2",
            name: "PMP",
            organization: "PMI",
            certificateNumber: "PMP-2022-98765",
            description: "Project Management Professional 자격증 취득",
            startedAt: now - 3 * 365 * 24 * 60 * 60 * 1000,
            endedAt: now - 3 * 365 * 24 * 60 * 60 * 1000,
            isVisible: true,
            type: Activity_ActivityType.CERTIFICATION,
            priority: 2,
            resume,
            createdAt: now - 3 * 365 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
        {
            id: "activity-enterprise-3",
            name: "디지털 혁신 경진대회 최우수상",
            organization: "한국경영학회",
            certificateNumber: "",
            description: "AI 기반 전략 기획 프레임워크로 최우수상 수상",
            startedAt: now - 250 * 24 * 60 * 60 * 1000,
            endedAt: now - 250 * 24 * 60 * 60 * 1000,
            isVisible: true,
            type: Activity_ActivityType.COMPETITION,
            priority: 3,
            resume,
            createdAt: now - 250 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
    ];

    const languageSkills: LanguageSkill[] = [
        {
            id: "lang-enterprise-1",
            language: LanguageSkill_Language.ENGLISH,
            level: LanguageSkill_LanguageLevel.NATIVE_LEVEL,
            languageTests: [
                {
                    id: "lang-test-enterprise-1",
                    name: "TOEIC",
                    score: "960",
                    acquiredAt: now - 12 * 30 * 24 * 60 * 60 * 1000,
                    isVisible: true,
                    priority: 1,
                    createdAt: now - 12 * 30 * 24 * 60 * 60 * 1000,
                    updatedAt: now - 12 * 30 * 24 * 60 * 60 * 1000,
                },
                {
                    id: "lang-test-enterprise-2",
                    name: "OPIc",
                    score: "AL",
                    acquiredAt: now - 8 * 30 * 24 * 60 * 60 * 1000,
                    isVisible: true,
                    priority: 2,
                    createdAt: now - 8 * 30 * 24 * 60 * 60 * 1000,
                    updatedAt: now - 8 * 30 * 24 * 60 * 60 * 1000,
                },
            ],
            isVisible: true,
            priority: 1,
            resume,
            createdAt: now - 365 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
    ];

    const attachments: Attachment[] = [];

    return { resume, careers, educations, projects, activities, languageSkills, attachments };
};

// 5. 공기업 이력서
export const createPublicCorpResume = () => {
    const now = Date.now();
    const worker: Worker = {
        id: "worker-public",
        status: Worker_WorkerStatus.ACTIVE,
        phone: "010-6789-0123",
        email: "subin.jung@example.com",
        birthDate: now - 33 * 365 * 24 * 60 * 60 * 1000,
        gender: Worker_Gender.FEMALE,
        nickName: "정수빈",
        createdAt: now - 365 * 24 * 60 * 60 * 1000,
        credit: 0,
        updatedAt: now,
    };

    const resume: Resume = {
        id: "resume-public",
        title: "공기업 이력서",
        name: "정수빈",
        phone: "010-6789-0123",
        email: "subin.jung@example.com",
        birthDate: now - 33 * 365 * 24 * 60 * 60 * 1000,
        gender: Resume_Gender.FEMALE,
        position: "정책기획 대리",
        description:
            "8년차 공기업 정책기획 전문가입니다. 공공서비스 기획, 정부 정책 연구, 경영평가 대응 등의 경험을 보유하고 있습니다.",
        isDefault: false,
        worker,
        createdAt: now - 200 * 24 * 60 * 60 * 1000,
        updatedAt: now - 15 * 24 * 60 * 60 * 1000,
    };

    const careers: Career[] = [
        {
            id: "career-public-1",
            name: "한국전력공사",
            position: "정책기획 대리",
            department: "경영기획처",
            employmentType: Career_EmploymentType.FULL_TIME,
            rank: "대리",
            jobTitle: "정책기획",
            salary: 6200,
            description:
                "경영기획 및 정책 연구\n- 정부 에너지 정책 대응 전략 수립\n- 공공기관 경영평가 자료 작성 (A등급 달성)\n- 국정감사 대비 자료 준비\n- ESG 경영 실천 계획 수립",
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
        {
            id: "career-public-2",
            name: "한국수자원공사",
            position: "행정직",
            department: "총무부",
            employmentType: Career_EmploymentType.FULL_TIME,
            rank: "사원",
            jobTitle: "행정직",
            salary: 4200,
            description:
                "총무 및 행정 업무\n- 예산 집행 관리\n- 민원 처리 및 공공데이터 관리\n- 안전 관리 점검 업무 보조",
            isVisible: true,
            priority: 2,
            startedAt: now - 8 * 365 * 24 * 60 * 60 * 1000,
            endedAt: now - 5 * 365 * 24 * 60 * 60 * 1000,
            isWorking: false,
            resume,
            salaries: [],
            createdAt: now - 8 * 365 * 24 * 60 * 60 * 1000,
            updatedAt: now - 5 * 365 * 24 * 60 * 60 * 1000,
        },
    ];

    const educations: Education[] = [
        {
            id: "education-public-1",
            major: "행정학",
            name: "고려대학교",
            description: "학점 3.9/4.5",
            status: Education_EducationStatus.GRADUATED,
            startedAt: now - 13 * 365 * 24 * 60 * 60 * 1000,
            endedAt: now - 9 * 365 * 24 * 60 * 60 * 1000,
            isVisible: true,
            priority: 1,
            resume,
            createdAt: now - 170 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
        {
            id: "education-public-2",
            major: "공공정책학",
            name: "고려대학교 행정대학원",
            description: "석사 학위\n- 논문: 공공기관 경영평가 지표 개선 방안 연구",
            status: Education_EducationStatus.GRADUATED,
            startedAt: now - 6 * 365 * 24 * 60 * 60 * 1000,
            endedAt: now - 4 * 365 * 24 * 60 * 60 * 1000,
            isVisible: true,
            priority: 2,
            resume,
            createdAt: now - 170 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
    ];

    const projects: Project[] = [
        {
            id: "project-public-1",
            title: "공공기관 경영평가 대응",
            affiliation: "한국전력공사",
            role: "실무 담당",
            description:
                "공공기관 경영평가 A등급 달성 프로젝트\n- 경영평가 지표별 실적 분석\n- 개선 과제 도출 및 실행\n- 전년 대비 2단계 등급 상향",
            startedAt: now - 2 * 365 * 24 * 60 * 60 * 1000,
            endedAt: now - 18 * 30 * 24 * 60 * 60 * 1000,
            isVisible: true,
            priority: 1,
            resume,
            createdAt: now - 2 * 365 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
        {
            id: "project-public-2",
            title: "사회적 가치 실현 프로젝트",
            affiliation: "한국전력공사",
            role: "기획 담당",
            description:
                "지역사회 상생 프로그램 기획\n- 에너지 취약계층 지원 프로그램\n- 지역 주민 간담회 운영\n- 사회공헌 예산 효율화 20%",
            startedAt: now - 12 * 30 * 24 * 60 * 60 * 1000,
            endedAt: now - 3 * 30 * 24 * 60 * 60 * 1000,
            isVisible: true,
            priority: 2,
            resume,
            createdAt: now - 12 * 30 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
    ];

    const activities: Activity[] = [
        {
            id: "activity-public-1",
            name: "한국행정학회 논문 발표",
            organization: "한국행정학회",
            certificateNumber: "",
            description: "공공기관 성과관리 체계 개선에 관한 연구 발표",
            startedAt: now - 250 * 24 * 60 * 60 * 1000,
            endedAt: now - 250 * 24 * 60 * 60 * 1000,
            isVisible: true,
            type: Activity_ActivityType.EXTERNAL,
            priority: 1,
            resume,
            createdAt: now - 250 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
        {
            id: "activity-public-2",
            name: "행정관리사 1급",
            organization: "행정안전부",
            certificateNumber: "ADM-2021-54321",
            description: "행정관리사 1급 자격증 취득",
            startedAt: now - 4 * 365 * 24 * 60 * 60 * 1000,
            endedAt: now - 4 * 365 * 24 * 60 * 60 * 1000,
            isVisible: true,
            type: Activity_ActivityType.CERTIFICATION,
            priority: 2,
            resume,
            createdAt: now - 4 * 365 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
        {
            id: "activity-public-3",
            name: "공공서비스 혁신 우수상",
            organization: "기획재정부",
            certificateNumber: "",
            description: "공공기관 경영평가 우수 사례로 수상",
            startedAt: now - 200 * 24 * 60 * 60 * 1000,
            endedAt: now - 200 * 24 * 60 * 60 * 1000,
            isVisible: true,
            type: Activity_ActivityType.AWARD,
            priority: 3,
            resume,
            createdAt: now - 200 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        },
    ];

    const languageSkills: LanguageSkill[] = [
        {
            id: "lang-public-1",
            language: LanguageSkill_Language.ENGLISH,
            level: LanguageSkill_LanguageLevel.BUSINESS_CONVERSATION,
            isVisible: true,
            priority: 1,
            resume,
            languageTests: [
                {
                    id: "lang-test-public-1",
                    name: "TOEIC",
                    score: "870",
                    acquiredAt: now - 8 * 30 * 24 * 60 * 60 * 1000,
                    isVisible: true,
                    priority: 1,
                    createdAt: now - 8 * 30 * 24 * 60 * 60 * 1000,
                    updatedAt: now - 8 * 30 * 24 * 60 * 60 * 1000,
                },
            ],
            createdAt: now - 365 * 24 * 60 * 60 * 1000,
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

// 모든 샘플 Resume 데이터를 한 번에 반환 (기업 유형별 5개)
export const createAllSampleResumes = () => {
    return [
        createStartupResume(),
        createSmeResume(),
        createMidsizeResume(),
        createEnterpriseResume(),
        createPublicCorpResume(),
    ];
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
        profileImageUrl: "placeholder",
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
