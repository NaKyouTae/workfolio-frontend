import { Record, RecordGroup, Record_RecordType } from '../../generated/common'
import dayjs from 'dayjs'

export const createSampleRecordGroups = (): RecordGroup[] => {
    return [
        {
            id: '1',
            title: '업무',
            isPublic: false,
            publicId: 'work',
            color: '#ffc107',
            priority: 1,
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2',
            title: '프로젝트',
            isPublic: false,
            publicId: 'project',
            color: '#fd7e14',
            priority: 2,
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '3',
            title: '출장',
            isPublic: false,
            publicId: 'business-trip',
            color: '#ffc107',
            priority: 3,
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '4',
            title: '개인 일정',
            isPublic: false,
            publicId: 'personal',
            color: '#28a745',
            priority: 4,
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '5',
            title: '독서 토론 동호회',
            isPublic: true,
            publicId: 'book-club',
            color: '#007bff',
            priority: 5,
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '6',
            title: '워크폴리오 사이드 프로젝트',
            isPublic: true,
            publicId: 'workfolio-side',
            color: '#17a2b8',
            priority: 6,
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
    ]
}

export const createSampleRecords = (recordGroups: RecordGroup[]): Record[] => {
    const now = dayjs()
    const currentMonth = now.month()
    const currentYear = now.year()
    
    return [
        {
            id: '1',
            title: '대전 출장',
            type: Record_RecordType.DAY,
            description: '대전 고객사 방문 및 미팅',
            startedAt: dayjs(`${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-01`).valueOf(),
            endedAt: dayjs(`${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-01`).valueOf(),
            recordGroup: recordGroups[2], // 출장
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2',
            title: '뉴스레터 발송 확인',
            type: Record_RecordType.TIME,
            description: '월간 뉴스레터 발송 및 수신자 반응 확인',
            startedAt: dayjs(`${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-03`).hour(10).minute(0).valueOf(),
            endedAt: dayjs(`${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-03`).hour(11).minute(30).valueOf(),
            recordGroup: recordGroups[0], // 업무
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '3',
            title: '제안 요청서 검토',
            type: Record_RecordType.TIME,
            description: '신규 프로젝트 제안서 검토 및 피드백',
            startedAt: dayjs(`${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-05`).hour(7).minute(0).valueOf(),
            endedAt: dayjs(`${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-05`).hour(9).minute(0).valueOf(),
            recordGroup: recordGroups[0], // 업무
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '4',
            title: '리브랜딩 프로젝트 시작',
            type: Record_RecordType.DAY,
            description: '회사 리브랜딩 프로젝트 킥오프',
            startedAt: dayjs(`${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-08`).valueOf(),
            endedAt: dayjs(`${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-08`).valueOf(),
            recordGroup: recordGroups[1], // 프로젝트
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '5',
            title: '리브랜딩 킥오프 미팅',
            type: Record_RecordType.TIME,
            description: '리브랜딩 프로젝트 팀 킥오프 미팅',
            startedAt: dayjs(`${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-08`).hour(14).minute(0).valueOf(),
            endedAt: dayjs(`${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-08`).hour(16).minute(0).valueOf(),
            recordGroup: recordGroups[1], // 프로젝트
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '6',
            title: '현장 사전 점검',
            type: Record_RecordType.TIME,
            description: '신규 사무실 이전을 위한 현장 점검',
            startedAt: dayjs(`${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-12`).hour(9).minute(0).valueOf(),
            endedAt: dayjs(`${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-12`).hour(12).minute(30).valueOf(),
            recordGroup: recordGroups[0], // 업무
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '7',
            title: '독서 토론 동호회 참석',
            type: Record_RecordType.TIME,
            description: '장소 : 종로 스타벅스\n참석자 : 홍길동, 김철수, 김영희\n첨부파일 : 독서감상문_250308.hwp',
            startedAt: dayjs(`${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-12`).hour(20).minute(0).valueOf(),
            endedAt: dayjs(`${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-12`).hour(22).minute(30).valueOf(),
            recordGroup: recordGroups[4], // 독서 토론 동호회
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '7-2',
            title: '독서 토론 동호회 사전 준비',
            type: Record_RecordType.TIME,
            description: '독서 토론 자료 준비 및 발표 자료 정리',
            startedAt: dayjs(`${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-12`).hour(18).minute(0).valueOf(),
            endedAt: dayjs(`${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-12`).hour(19).minute(30).valueOf(),
            recordGroup: recordGroups[4], // 독서 토론 동호회
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '8',
            title: '주간 팀 미팅',
            type: Record_RecordType.TIME,
            description: '주간 진행 상황 공유 및 다음 주 계획 수립',
            startedAt: dayjs(`${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-15`).hour(10).minute(0).valueOf(),
            endedAt: dayjs(`${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-15`).hour(11).minute(30).valueOf(),
            recordGroup: recordGroups[0], // 업무
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '9',
            title: '개인 일정',
            type: Record_RecordType.DAY,
            description: '가족과의 시간',
            startedAt: dayjs(`${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-16`).valueOf(),
            endedAt: dayjs(`${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-16`).valueOf(),
            recordGroup: recordGroups[3], // 개인 일정
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '10',
            title: '워크폴리오 사이드 프로젝트 회의',
            type: Record_RecordType.TIME,
            description: '사이드 프로젝트 진행 상황 점검 및 다음 단계 계획',
            startedAt: dayjs(`${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-20`).hour(19).minute(0).valueOf(),
            endedAt: dayjs(`${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-20`).hour(21).minute(0).valueOf(),
            recordGroup: recordGroups[5], // 워크폴리오 사이드 프로젝트
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        // 3일 기간 데이터
        {
            id: '11',
            title: '부산 출장 (3일)',
            type: Record_RecordType.DAY,
            description: '부산 고객사 방문 및 현장 점검 (3일간)',
            startedAt: dayjs(`${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-22`).valueOf(),
            endedAt: dayjs(`${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-24`).valueOf(),
            recordGroup: recordGroups[2], // 출장
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        // 5일 기간 데이터
        {
            id: '12',
            title: '리브랜딩 프로젝트 집중 작업 (5일)',
            type: Record_RecordType.DAY,
            description: '리브랜딩 프로젝트 핵심 작업 기간 (5일간 집중)',
            startedAt: dayjs(`${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-25`).valueOf(),
            endedAt: dayjs(`${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-29`).valueOf(),
            recordGroup: recordGroups[1], // 프로젝트
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        // 7일 기간 데이터
        {
            id: '13',
            title: '연수 및 교육 (7일)',
            type: Record_RecordType.DAY,
            description: '신기술 연수 및 교육 과정 참여 (7일간)',
            startedAt: dayjs(`${currentYear}-${(currentMonth + 2).toString().padStart(2, '0')}-01`).valueOf(),
            endedAt: dayjs(`${currentYear}-${(currentMonth + 2).toString().padStart(2, '0')}-07`).valueOf(),
            recordGroup: recordGroups[0], // 업무
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        // 10일 기간 데이터
        {
            id: '14',
            title: '해외 출장 (10일)',
            type: Record_RecordType.DAY,
            description: '싱가포르 지사 방문 및 글로벌 미팅 (10일간)',
            startedAt: dayjs(`${currentYear}-${(currentMonth + 2).toString().padStart(2, '0')}-10`).valueOf(),
            endedAt: dayjs(`${currentYear}-${(currentMonth + 2).toString().padStart(2, '0')}-19`).valueOf(),
            recordGroup: recordGroups[2], // 출장
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        // 추가 3일 기간 데이터
        {
            id: '15',
            title: '개인 휴가 (3일)',
            type: Record_RecordType.DAY,
            description: '가족과 함께하는 개인 휴가 (3일간)',
            startedAt: dayjs(`${currentYear}-${(currentMonth + 2).toString().padStart(2, '0')}-25`).valueOf(),
            endedAt: dayjs(`${currentYear}-${(currentMonth + 2).toString().padStart(2, '0')}-27`).valueOf(),
            recordGroup: recordGroups[3], // 개인 일정
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        // 추가 5일 기간 데이터
        {
            id: '16',
            title: '워크폴리오 개발 스프린트 (5일)',
            type: Record_RecordType.DAY,
            description: '워크폴리오 사이드 프로젝트 집중 개발 기간 (5일간)',
            startedAt: dayjs(`${currentYear}-${(currentMonth + 3).toString().padStart(2, '0')}-01`).valueOf(),
            endedAt: dayjs(`${currentYear}-${(currentMonth + 3).toString().padStart(2, '0')}-05`).valueOf(),
            recordGroup: recordGroups[5], // 워크폴리오 사이드 프로젝트
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
    ]
}
