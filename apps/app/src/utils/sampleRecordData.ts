import {
    RecordGroup,
    RecordGroup_RecordGroupRole,
    RecordGroup_RecordGroupType,
    Worker,
    Worker_Gender,
    Worker_WorkerStatus,
    WorkerRecordGroup_RecordGroupRole,
} from "@workfolio/shared/generated/common";
import { RecordGroupDetailResponse } from "@workfolio/shared/generated/record_group";
import dayjs from "dayjs";

export const createSampleRecordGroups = (): RecordGroup[] => {
    return [
        {
            id: "1",
            title: "업무",
            isDefault: true,
            type: RecordGroup_RecordGroupType.PRIVATE,
            publicId: "work",
            color: "#FFCC00",
            defaultRole: RecordGroup_RecordGroupRole.FULL,
            priority: 1,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        },
        {
            id: "2",
            title: "프로젝트",
            isDefault: false,
            type: RecordGroup_RecordGroupType.PRIVATE,
            publicId: "project",
            color: "#FF9500",
            priority: 2,
            defaultRole: RecordGroup_RecordGroupRole.FULL,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        },
    ];
};

// 템플릿별 샘플 description 생성
const sampleWeeklyReviewDescriptions = [
    "## 이번 주 한 일\nAPI 설계 및 프론트엔드 컴포넌트 개발을 진행했습니다. 사용자 인증 모듈을 완성하고, 대시보드 UI를 리팩토링했습니다.\n\n## 문제\n레거시 API와의 호환성 이슈가 발생했습니다.\n\n## 해결\n어댑터 패턴을 도입하여 기존 API와의 호환성을 유지하면서 새로운 구조로 전환했습니다.\n\n## 성과\n인증 모듈 개발 완료, 대시보드 로딩 속도 40% 개선\n\n## 배운 점\n점진적 마이그레이션의 중요성을 다시 한번 느꼈습니다.",
    "## 이번 주 한 일\n신규 기능 기획 회의 3회, 디자인 리뷰 2회 참여. QA 테스트 케이스 작성 및 버그 수정 5건 처리.\n\n## 문제\nQA 과정에서 예상치 못한 엣지 케이스가 다수 발견되었습니다.\n\n## 해결\n테스트 커버리지를 높이고, 경계값 테스트를 추가했습니다.\n\n## 성과\n버그 수정 완료 및 릴리즈 준비 완료\n\n## 배운 점\n초기 기획 단계에서 엣지 케이스를 더 꼼꼼히 고려해야 합니다.",
    "## 이번 주 한 일\n팀 스프린트 리뷰 진행, 차주 스프린트 백로그 정리, 기술 부채 해소 작업 수행.\n\n## 문제\n기술 부채로 인해 새로운 기능 추가 속도가 저하되고 있었습니다.\n\n## 해결\n핵심 모듈의 코드를 리팩토링하고 테스트 코드를 보강했습니다.\n\n## 성과\n코드 품질 지표 15% 향상, 빌드 시간 20% 단축\n\n## 배운 점\n정기적인 기술 부채 해소 시간 확보가 필요합니다.",
];

const sampleProjectReviewDescriptions = [
    "## 프로젝트 목표\n사용자 이탈률을 줄이기 위한 온보딩 프로세스 개선\n\n## 내 역할\n프론트엔드 개발 리드로서 UI/UX 개선 및 A/B 테스트 설계를 담당했습니다.\n\n## 문제\n기존 온보딩 단계가 7단계로 복잡하여 이탈률이 높았습니다.\n\n## 해결\n핵심 단계만 남기고 3단계로 간소화했으며, 프로그레스 바를 추가했습니다.\n\n## 성과\n온보딩 완료율 35% 향상, 신규 가입자 첫 주 리텐션 20% 증가",
    "## 프로젝트 목표\n실시간 알림 시스템 구축으로 사용자 참여도 향상\n\n## 내 역할\nWebSocket 기반 실시간 통신 모듈 설계 및 구현을 담당했습니다.\n\n## 문제\n기존 폴링 방식의 알림은 서버 부하가 크고 지연이 발생했습니다.\n\n## 해결\nWebSocket을 도입하고 메시지 큐를 활용해 안정적인 실시간 전달 구조를 구축했습니다.\n\n## 성과\n알림 전달 지연 시간 90% 감소, 서버 요청량 60% 절감",
    "## 프로젝트 목표\n내부 어드민 대시보드 구축으로 운영 효율화\n\n## 내 역할\n풀스택 개발자로서 백엔드 API 설계와 프론트엔드 대시보드 개발을 담당했습니다.\n\n## 문제\n기존에는 DB를 직접 조회해야 해서 비개발 직군의 데이터 접근이 어려웠습니다.\n\n## 해결\n직관적인 대시보드와 필터링, 엑셀 내보내기 기능을 구현했습니다.\n\n## 성과\n운영팀 데이터 조회 시간 80% 단축, 주간 보고서 자동화 달성",
];

const sampleAchievementDescriptions = [
    "## 문제\n페이지 로딩 시간이 평균 4초로 사용자 이탈이 증가하고 있었습니다.\n\n## 내가 한 일\n코드 스플리팅, 이미지 최적화, CDN 적용 등 성능 최적화 작업을 수행했습니다.\n\n## 결과\n페이지 로딩 시간이 평균 1.2초로 단축되었습니다.\n\n## 수치 변화\n로딩 시간 70% 감소, 이탈률 25% 감소",
    "## 문제\n수동 배포 프로세스로 인해 릴리즈 주기가 2주에 한 번으로 제한되어 있었습니다.\n\n## 내가 한 일\nCI/CD 파이프라인을 구축하고 자동 테스트, 스테이징 환경 배포를 자동화했습니다.\n\n## 결과\n배포 주기가 일 단위로 단축되었고, 배포 실패율도 크게 감소했습니다.\n\n## 수치 변화\n배포 주기 10배 단축, 배포 실패율 90% 감소",
    "## 문제\n검색 기능의 정확도가 낮아 사용자 불만이 많았습니다.\n\n## 내가 한 일\nElasticsearch를 도입하고 형태소 분석기를 적용하여 검색 로직을 전면 개편했습니다.\n\n## 결과\n검색 정확도와 속도가 크게 향상되었습니다.\n\n## 수치 변화\n검색 정확도 45% 향상, 검색 응답 시간 60% 단축",
];

const sampleDailyLogDescriptions = [
    "## 오늘 한 일\n- 사용자 프로필 페이지 UI 구현\n- 코드 리뷰 3건 처리\n- 팀 스탠드업 미팅 참여\n\n## 내일 할 일\n- 프로필 수정 API 연동\n- 단위 테스트 작성\n\n## 이슈\n프로필 이미지 업로드 시 파일 크기 제한 정책 확인 필요",
    "## 오늘 한 일\n- 결제 모듈 버그 수정 2건\n- 신규 기능 기획 미팅 참여\n- 기술 문서 업데이트\n\n## 내일 할 일\n- 결제 모듈 통합 테스트\n- 릴리즈 노트 작성\n\n## 이슈\n외부 결제 API 응답 지연 현상 모니터링 필요",
    "## 오늘 한 일\n- 대시보드 차트 컴포넌트 개발\n- 디자이너와 UI 피드백 미팅\n- 성능 프로파일링 진행\n\n## 내일 할 일\n- 차트 데이터 API 연동\n- 반응형 레이아웃 적용\n\n## 이슈\n차트 라이브러리 번들 사이즈가 커서 대안 검토 필요",
    "## 오늘 한 일\n- 알림 설정 페이지 구현\n- 이메일 발송 기능 테스트\n- 코드 리뷰 피드백 반영\n\n## 내일 할 일\n- 푸시 알림 연동\n- QA 팀 테스트 지원\n\n## 이슈\n없음",
];

// 현재 날짜 기준으로 동적 생성 (이전/현재/다음 한 달)
export const createSampleRecords = (recordGroups: object[]) => {
    const now = dayjs();
    const records: Array<{
        id: string;
        title: string;
        type: string;
        description: string;
        startedAt: number;
        endedAt: number;
        recordGroup: object;
        createdAt: number;
        updatedAt: number;
    }> = [];
    let recordIdCounter = 1;

    // 이전 한 달, 현재 한 달, 다음 한 달
    const months = [now.subtract(1, "month"), now, now.add(1, "month")];

    // 각 기록장에 균등하게 분배
    const privateGroup = recordGroups[0];
    const sharedGroup = recordGroups[1];

    // 각 월별로 다양한 템플릿의 기록 생성
    months.forEach((month, monthIdx) => {
        const daysInMonth = month.daysInMonth();
        const startOfMonth = month.startOf("month");

        // 주간 회고 (weekly_review) - 월별 1~2건, DAY 타입
        for (let i = 0; i < 2; i++) {
            // 매주 금요일 근처에 배치
            const weekNum = i + 1;
            const day = Math.min(weekNum * 7, daysInMonth);
            const date = startOfMonth.date(day);
            const desc = sampleWeeklyReviewDescriptions[(monthIdx * 2 + i) % sampleWeeklyReviewDescriptions.length];

            const titles = [
                `${month.format("M")}월 ${weekNum}주차 회고`,
                `${month.format("M")}월 ${weekNum}주 주간 회고`,
            ];

            records.push({
                id: `record-${recordIdCounter++}`,
                title: titles[i % titles.length],
                type: "DAY",
                description: desc,
                startedAt: date.startOf("day").valueOf(),
                endedAt: date.endOf("day").valueOf(),
                recordGroup: privateGroup,
                createdAt: Date.now() - (30 - day) * 24 * 60 * 60 * 1000,
                updatedAt: Date.now() - (30 - day) * 24 * 60 * 60 * 1000,
            });
        }

        // 프로젝트 회고 (project_review) - 월별 1건, MULTI_DAY 타입
        {
            const startDay = Math.floor(daysInMonth * 0.2) + 1;
            const endDay = Math.min(startDay + 4, daysInMonth);
            const startDate = startOfMonth.date(startDay);
            const endDate = startOfMonth.date(endDay);
            const desc = sampleProjectReviewDescriptions[monthIdx % sampleProjectReviewDescriptions.length];

            const titles = [
                "온보딩 개선 프로젝트 회고",
                "실시간 알림 시스템 프로젝트 회고",
                "어드민 대시보드 프로젝트 회고",
            ];

            records.push({
                id: `record-${recordIdCounter++}`,
                title: titles[monthIdx % titles.length],
                type: "MULTI_DAY",
                description: desc,
                startedAt: startDate.startOf("day").valueOf(),
                endedAt: endDate.endOf("day").valueOf(),
                recordGroup: sharedGroup,
                createdAt: Date.now() - (30 - startDay) * 24 * 60 * 60 * 1000,
                updatedAt: Date.now() - (30 - startDay) * 24 * 60 * 60 * 1000,
            });
        }

        // 성과 기록 (achievement) - 월별 2건, TIME 타입
        for (let i = 0; i < 2; i++) {
            const day = Math.floor(daysInMonth * (0.3 + i * 0.3)) + 1;
            const date = startOfMonth.date(Math.min(day, daysInMonth));
            const hour = 10 + i * 3;
            const desc = sampleAchievementDescriptions[(monthIdx * 2 + i) % sampleAchievementDescriptions.length];

            const titles = [
                "페이지 로딩 성능 최적화",
                "CI/CD 파이프라인 구축",
                "검색 기능 전면 개편",
                "API 응답 속도 개선",
                "테스트 커버리지 확대",
                "모바일 반응형 대응",
            ];

            records.push({
                id: `record-${recordIdCounter++}`,
                title: titles[(monthIdx * 2 + i) % titles.length],
                type: "TIME",
                description: desc,
                startedAt: date.hour(hour).minute(0).second(0).valueOf(),
                endedAt: date.hour(hour + 2).minute(0).second(0).valueOf(),
                recordGroup: Math.random() < 0.5 ? privateGroup : sharedGroup,
                createdAt: Date.now() - (30 - day) * 24 * 60 * 60 * 1000,
                updatedAt: Date.now() - (30 - day) * 24 * 60 * 60 * 1000,
            });
        }

        // 일일 업무 기록 (daily_log) - 월별 3건, DAY 타입
        for (let i = 0; i < 3; i++) {
            const day = Math.floor(daysInMonth * (0.2 + i * 0.25)) + 1;
            const date = startOfMonth.date(Math.min(day, daysInMonth));
            const desc = sampleDailyLogDescriptions[(monthIdx * 3 + i) % sampleDailyLogDescriptions.length];

            records.push({
                id: `record-${recordIdCounter++}`,
                title: `${date.format("M/D")} 업무 일지`,
                type: "DAY",
                description: desc,
                startedAt: date.startOf("day").valueOf(),
                endedAt: date.endOf("day").valueOf(),
                recordGroup: privateGroup,
                createdAt: Date.now() - (30 - day) * 24 * 60 * 60 * 1000,
                updatedAt: Date.now() - (30 - day) * 24 * 60 * 60 * 1000,
            });
        }

        // 빈 기록 (free) - 기존처럼 TIME/DAY/MULTI_DAY 혼합
        // TIME 타입 빈 기록
        for (let i = 0; i < 3; i++) {
            const day = Math.floor(Math.random() * daysInMonth) + 1;
            const date = startOfMonth.date(day);
            const hour = Math.floor(Math.random() * 8) + 9;
            const duration = Math.floor(Math.random() * 3) + 1;

            const titles = [
                "주간 미팅", "프로젝트 리뷰", "기획 회의", "요구사항 분석",
                "디자인 리뷰", "기획서 작성", "프로토타입 검토", "데이터 분석",
            ];

            records.push({
                id: `record-${recordIdCounter++}`,
                title: titles[Math.floor(Math.random() * titles.length)],
                type: "TIME",
                description: `${titles[Math.floor(Math.random() * titles.length)]} 관련 업무를 진행했습니다.`,
                startedAt: date.hour(hour).minute(0).second(0).valueOf(),
                endedAt: date.hour(hour + duration).minute(0).second(0).valueOf(),
                recordGroup: Math.random() < 0.5 ? privateGroup : sharedGroup,
                createdAt: Date.now() - (30 - day) * 24 * 60 * 60 * 1000,
                updatedAt: Date.now() - (30 - day) * 24 * 60 * 60 * 1000,
            });
        }

        // DAY 타입 빈 기록
        for (let i = 0; i < 2; i++) {
            const day = Math.floor(Math.random() * daysInMonth) + 1;
            const date = startOfMonth.date(day);

            const titles = [
                "클라이언트 미팅", "출장", "사용자 교육",
                "프로젝트 킥오프", "사용자 리서치", "런칭 준비",
            ];

            records.push({
                id: `record-${recordIdCounter++}`,
                title: titles[Math.floor(Math.random() * titles.length)],
                type: "DAY",
                description: `${titles[Math.floor(Math.random() * titles.length)]} 관련 업무를 진행했습니다.`,
                startedAt: date.startOf("day").valueOf(),
                endedAt: date.endOf("day").valueOf(),
                recordGroup: Math.random() < 0.5 ? privateGroup : sharedGroup,
                createdAt: Date.now() - (30 - day) * 24 * 60 * 60 * 1000,
                updatedAt: Date.now() - (30 - day) * 24 * 60 * 60 * 1000,
            });
        }
    });

    return records;
};

// 샘플 Worker 데이터 (로그인 안되어있을 때 사용)
export const createSampleWorkers = (): Worker[] => {
    const now = Date.now();
    return [
        {
            id: "worker-sample-1",
            status: Worker_WorkerStatus.ACTIVE,
            nickName: "김철수",
            phone: "010-1111-2222",
            email: "kim.cheolsu@example.com",
            birthDate: now - 28 * 365 * 24 * 60 * 60 * 1000,
            gender: Worker_Gender.MALE,
            credit: 0,
            createdAt: now - 365 * 24 * 60 * 60 * 1000,
            updatedAt: now - 30 * 24 * 60 * 60 * 1000,
        },
        {
            id: "worker-sample-2",
            status: Worker_WorkerStatus.ACTIVE,
            nickName: "이영희",
            phone: "010-2222-3333",
            email: "lee.younghee@example.com",
            birthDate: now - 26 * 365 * 24 * 60 * 60 * 1000,
            gender: Worker_Gender.FEMALE,
            credit: 0,
            createdAt: now - 300 * 24 * 60 * 60 * 1000,
            updatedAt: now - 20 * 24 * 60 * 60 * 1000,
        },
        {
            id: "worker-sample-3",
            status: Worker_WorkerStatus.ACTIVE,
            nickName: "박민수",
            phone: "010-3333-4444",
            email: "park.minsu@example.com",
            birthDate: now - 32 * 365 * 24 * 60 * 60 * 1000,
            gender: Worker_Gender.MALE,
            credit: 0,
            createdAt: now - 500 * 24 * 60 * 60 * 1000,
            updatedAt: now - 15 * 24 * 60 * 60 * 1000,
        },
        {
            id: "worker-sample-4",
            status: Worker_WorkerStatus.ACTIVE,
            nickName: "최지은",
            phone: "010-4444-5555",
            email: "choi.jieun@example.com",
            birthDate: now - 24 * 365 * 24 * 60 * 60 * 1000,
            gender: Worker_Gender.FEMALE,
            credit: 0,
            createdAt: now - 200 * 24 * 60 * 60 * 1000,
            updatedAt: now - 10 * 24 * 60 * 60 * 1000,
        },
        {
            id: "worker-sample-5",
            status: Worker_WorkerStatus.ACTIVE,
            nickName: "정대현",
            phone: "010-5555-6666",
            email: "jung.daehyun@example.com",
            birthDate: now - 30 * 365 * 24 * 60 * 60 * 1000,
            gender: Worker_Gender.MALE,
            credit: 0,
            createdAt: now - 400 * 24 * 60 * 60 * 1000,
            updatedAt: now - 25 * 24 * 60 * 60 * 1000,
        },
        {
            id: "worker-sample-6",
            status: Worker_WorkerStatus.ACTIVE,
            nickName: "한소영",
            phone: "010-6666-7777",
            email: "han.soyoung@example.com",
            birthDate: now - 27 * 365 * 24 * 60 * 60 * 1000,
            gender: Worker_Gender.FEMALE,
            credit: 0,
            createdAt: now - 250 * 24 * 60 * 60 * 1000,
            updatedAt: now - 5 * 24 * 60 * 60 * 1000,
        },
        {
            id: "worker-sample-7",
            status: Worker_WorkerStatus.ACTIVE,
            nickName: "윤성호",
            phone: "010-7777-8888",
            email: "yoon.sungho@example.com",
            birthDate: now - 29 * 365 * 24 * 60 * 60 * 1000,
            gender: Worker_Gender.MALE,
            credit: 0,
            createdAt: now - 350 * 24 * 60 * 60 * 1000,
            updatedAt: now - 18 * 24 * 60 * 60 * 1000,
        },
        {
            id: "worker-sample-8",
            status: Worker_WorkerStatus.ACTIVE,
            nickName: "강미래",
            phone: "010-8888-9999",
            email: "kang.mirae@example.com",
            birthDate: now - 25 * 365 * 24 * 60 * 60 * 1000,
            gender: Worker_Gender.FEMALE,
            credit: 0,
            createdAt: now - 180 * 24 * 60 * 60 * 1000,
            updatedAt: now - 8 * 24 * 60 * 60 * 1000,
        },
    ];
};

// 샘플 RecordGroupDetailResponse 데이터 (로그인 안되어있을 때 사용)
export const createSampleRecordGroupDetails = (
    recordGroup: RecordGroup | undefined
): RecordGroupDetailResponse | undefined => {
    if (!recordGroup) {
        return undefined;
    }

    // 일부 샘플 워커를 공유 멤버로 설정 (3-5명 정도)
    const sampleWorkers = createSampleWorkers();
    const sharedWorkers = sampleWorkers.slice(0, 4); // 처음 4명을 공유 멤버로

    return {
        groups: recordGroup,
        workers: sharedWorkers.map((worker: Worker) => {
            return {
                id: worker.id,
                publicId: "",
                priority: 1,
                role: WorkerRecordGroup_RecordGroupRole.FULL,
                worker: worker,
                recordGroup: recordGroup,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            };
        }),
    };
};
