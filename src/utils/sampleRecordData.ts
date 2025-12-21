import {
    RecordGroup,
    RecordGroup_RecordGroupRole,
    RecordGroup_RecordGroupType,
    Worker,
    Worker_Gender,
    WorkerRecordGroup_RecordGroupRole,
} from "@/generated/common";
import { RecordGroupDetailResponse } from "@/generated/record_group";
import dayjs from "dayjs";

export const createSampleRecordGroups = (): RecordGroup[] => {
    return [
        {
            id: "1",
            title: "업무",
            isDefault: true,
            type: RecordGroup_RecordGroupType.PRIVATE,
            publicId: "work",
            color: "#ffc107",
            defaultRole: RecordGroup_RecordGroupRole.FULL,
            priority: 1,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        },
        {
            id: "2",
            title: "프로젝트",
            isDefault: false,
            type: RecordGroup_RecordGroupType.SHARED,
            publicId: "project",
            color: "#fd7e14",
            priority: 2,
            defaultRole: RecordGroup_RecordGroupRole.FULL,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        },
    ];
};

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

    // 각 월별로 다양한 타입의 기록 생성
    months.forEach((month) => {
        const daysInMonth = month.daysInMonth();
        const startOfMonth = month.startOf("month");

        // TIME 타입 기록 (시간 단위)
        for (let i = 0; i < 8; i++) {
            const day = Math.floor(Math.random() * daysInMonth) + 1;
            const date = startOfMonth.date(day);
            const hour = Math.floor(Math.random() * 8) + 9; // 9시~17시
            const minute = Math.random() < 0.5 ? 0 : 30;
            const duration = Math.floor(Math.random() * 3) + 1; // 1~3시간

            const titles = [
                "주간 미팅",
                "프로젝트 리뷰",
                "기획 회의",
                "요구사항 분석",
                "디자인 리뷰",
                "기획서 작성",
                "사용자 리서치",
                "프로토타입 검토",
                "기능 명세서 작성",
                "우선순위 논의",
                "문서화",
                "사용자 인터뷰",
                "데이터 분석",
                "경쟁사 분석",
                "로드맵 수립",
                "테스트",
            ];

            records.push({
                id: `record-${recordIdCounter++}`,
                title: titles[Math.floor(Math.random() * titles.length)],
                type: "TIME",
                description: `${
                    titles[Math.floor(Math.random() * titles.length)]
                } 관련 업무를 진행했습니다.`,
                startedAt: date.hour(hour).minute(minute).second(0).valueOf(),
                endedAt: date
                    .hour(hour + duration)
                    .minute(minute)
                    .second(0)
                    .valueOf(),
                recordGroup: Math.random() < 0.5 ? privateGroup : sharedGroup,
                createdAt: Date.now() - (30 - day) * 24 * 60 * 60 * 1000,
                updatedAt: Date.now() - (30 - day) * 24 * 60 * 60 * 1000,
            });
        }

        // DAY 타입 기록 (하루 종일)
        for (let i = 0; i < 4; i++) {
            const day = Math.floor(Math.random() * daysInMonth) + 1;
            const date = startOfMonth.date(day);

            const titles = [
                "클라이언트 미팅",
                "출장",
                "사용자 교육",
                "테스트",
                "프로젝트 기획",
                "로드맵 수립",
                "기능 우선순위 결정",
                "사용자 피드백 수집",
                "프로젝트 킥오프",
                "사용자 리서치",
                "프로토타입 검증",
                "런칭 준비",
            ];

            records.push({
                id: `record-${recordIdCounter++}`,
                title: titles[Math.floor(Math.random() * titles.length)],
                type: "DAY",
                description: `${
                    titles[Math.floor(Math.random() * titles.length)]
                } 관련 업무를 하루 종일 진행했습니다.`,
                startedAt: date.startOf("day").valueOf(),
                endedAt: date.endOf("day").valueOf(),
                recordGroup: Math.random() < 0.5 ? privateGroup : sharedGroup,
                createdAt: Date.now() - (30 - day) * 24 * 60 * 60 * 1000,
                updatedAt: Date.now() - (30 - day) * 24 * 60 * 60 * 1000,
            });
        }

        // MULTI_DAY 타입 기록 (여러 일자)
        for (let i = 0; i < 3; i++) {
            const startDay = Math.floor(Math.random() * (daysInMonth - 2)) + 1;
            const endDay = startDay + Math.floor(Math.random() * 3) + 1; // 2~4일
            const startDate = startOfMonth.date(startDay);
            const endDate = startOfMonth.date(Math.min(endDay, daysInMonth));

            const titles = [
                "기획 회의",
                "사용자 인터뷰",
                "사용자 리서치",
                "프로젝트 기획",
                "기능 기획",
                "데이터 분석",
                "기획 회의",
                "사용자 테스트",
                "최종 검토",
                "런칭 준비",
                "로드맵 수립",
                "요구사항 정의",
            ];

            records.push({
                id: `record-${recordIdCounter++}`,
                title: titles[Math.floor(Math.random() * titles.length)],
                type: "MULTI_DAY",
                description: `${
                    titles[Math.floor(Math.random() * titles.length)]
                } 관련 업무를 여러 일에 걸쳐 진행했습니다.`,
                startedAt: startDate.startOf("day").valueOf(),
                endedAt: endDate.endOf("day").valueOf(),
                recordGroup: Math.random() < 0.5 ? privateGroup : sharedGroup,
                createdAt: Date.now() - (30 - startDay) * 24 * 60 * 60 * 1000,
                updatedAt: Date.now() - (30 - startDay) * 24 * 60 * 60 * 1000,
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
            nickName: "김철수",
            phone: "010-1111-2222",
            email: "kim.cheolsu@example.com",
            birthDate: now - 28 * 365 * 24 * 60 * 60 * 1000,
            gender: Worker_Gender.MALE,
            createdAt: now - 365 * 24 * 60 * 60 * 1000,
            updatedAt: now - 30 * 24 * 60 * 60 * 1000,
        },
        {
            id: "worker-sample-2",
            nickName: "이영희",
            phone: "010-2222-3333",
            email: "lee.younghee@example.com",
            birthDate: now - 26 * 365 * 24 * 60 * 60 * 1000,
            gender: Worker_Gender.FEMALE,
            createdAt: now - 300 * 24 * 60 * 60 * 1000,
            updatedAt: now - 20 * 24 * 60 * 60 * 1000,
        },
        {
            id: "worker-sample-3",
            nickName: "박민수",
            phone: "010-3333-4444",
            email: "park.minsu@example.com",
            birthDate: now - 32 * 365 * 24 * 60 * 60 * 1000,
            gender: Worker_Gender.MALE,
            createdAt: now - 500 * 24 * 60 * 60 * 1000,
            updatedAt: now - 15 * 24 * 60 * 60 * 1000,
        },
        {
            id: "worker-sample-4",
            nickName: "최지은",
            phone: "010-4444-5555",
            email: "choi.jieun@example.com",
            birthDate: now - 24 * 365 * 24 * 60 * 60 * 1000,
            gender: Worker_Gender.FEMALE,
            createdAt: now - 200 * 24 * 60 * 60 * 1000,
            updatedAt: now - 10 * 24 * 60 * 60 * 1000,
        },
        {
            id: "worker-sample-5",
            nickName: "정대현",
            phone: "010-5555-6666",
            email: "jung.daehyun@example.com",
            birthDate: now - 30 * 365 * 24 * 60 * 60 * 1000,
            gender: Worker_Gender.MALE,
            createdAt: now - 400 * 24 * 60 * 60 * 1000,
            updatedAt: now - 25 * 24 * 60 * 60 * 1000,
        },
        {
            id: "worker-sample-6",
            nickName: "한소영",
            phone: "010-6666-7777",
            email: "han.soyoung@example.com",
            birthDate: now - 27 * 365 * 24 * 60 * 60 * 1000,
            gender: Worker_Gender.FEMALE,
            createdAt: now - 250 * 24 * 60 * 60 * 1000,
            updatedAt: now - 5 * 24 * 60 * 60 * 1000,
        },
        {
            id: "worker-sample-7",
            nickName: "윤성호",
            phone: "010-7777-8888",
            email: "yoon.sungho@example.com",
            birthDate: now - 29 * 365 * 24 * 60 * 60 * 1000,
            gender: Worker_Gender.MALE,
            createdAt: now - 350 * 24 * 60 * 60 * 1000,
            updatedAt: now - 18 * 24 * 60 * 60 * 1000,
        },
        {
            id: "worker-sample-8",
            nickName: "강미래",
            phone: "010-8888-9999",
            email: "kang.mirae@example.com",
            birthDate: now - 25 * 365 * 24 * 60 * 60 * 1000,
            gender: Worker_Gender.FEMALE,
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
