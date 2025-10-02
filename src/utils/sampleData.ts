import { Company, Certifications, Degrees, Education, Worker, JobSearch, JobSearchCompany, Interview, JobSearchCompany_Status, Interview_Type } from '@/generated/common'
import dayjs from 'dayjs'

export const createSampleRecordGroups = () => {
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

// Monthly용 샘플 레코드
export const createSampleRecordsForMonthly = (recordGroups: object[]) => {
    const now = dayjs()
    const currentMonth = now.month()
    const currentYear = now.year()
    
    return [
        {
            id: '1',
            title: '대전 출장',
            type: 'DAY',
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
            type: 'TIME',
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
            type: 'TIME',
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
            type: 'DAY',
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
            type: 'TIME',
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
            type: 'TIME',
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
            type: 'TIME',
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
            type: 'TIME',
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
            type: 'TIME',
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
            type: 'DAY',
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
            type: 'TIME',
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
            type: 'DAY',
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
            type: 'DAY',
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
            type: 'DAY',
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
            type: 'DAY',
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
            type: 'DAY',
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
            type: 'DAY',
            description: '워크폴리오 사이드 프로젝트 집중 개발 기간 (5일간)',
            startedAt: dayjs(`${currentYear}-${(currentMonth + 3).toString().padStart(2, '0')}-01`).valueOf(),
            endedAt: dayjs(`${currentYear}-${(currentMonth + 3).toString().padStart(2, '0')}-05`).valueOf(),
            recordGroup: recordGroups[5], // 워크폴리오 사이드 프로젝트
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        // 겹치는 멀티 일정 5개 추가
        {
            id: '17',
            title: '긴급 프로젝트 (3일 겹침)',
            type: 'DAY',
            description: '리브랜딩 프로젝트와 겹치는 긴급 프로젝트 (3일간)',
            startedAt: dayjs(`${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-07`).valueOf(),
            endedAt: dayjs(`${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-09`).valueOf(),
            recordGroup: recordGroups[1], // 프로젝트
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '18',
            title: '추가 출장 (2일 겹침)',
            type: 'DAY',
            description: '부산 출장과 겹치는 추가 출장 (2일간)',
            startedAt: dayjs(`${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-23`).valueOf(),
            endedAt: dayjs(`${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-24`).valueOf(),
            recordGroup: recordGroups[2], // 출장
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '19',
            title: '개인 프로젝트 (4일 겹침)',
            type: 'DAY',
            description: '리브랜딩 프로젝트 집중 작업과 겹치는 개인 프로젝트 (4일간)',
            startedAt: dayjs(`${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-26`).valueOf(),
            endedAt: dayjs(`${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-29`).valueOf(),
            recordGroup: recordGroups[3], // 개인 일정
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '20',
            title: '워크샵 (3일 겹침)',
            type: 'DAY',
            description: '연수 및 교육과 겹치는 워크샵 (3일간)',
            startedAt: dayjs(`${currentYear}-${(currentMonth + 2).toString().padStart(2, '0')}-03`).valueOf(),
            endedAt: dayjs(`${currentYear}-${(currentMonth + 2).toString().padStart(2, '0')}-05`).valueOf(),
            recordGroup: recordGroups[0], // 업무
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '21',
            title: '해외 컨퍼런스 (5일 겹침)',
            type: 'DAY',
            description: '해외 출장과 겹치는 컨퍼런스 참석 (5일간)',
            startedAt: dayjs(`${currentYear}-${(currentMonth + 2).toString().padStart(2, '0')}-15`).valueOf(),
            endedAt: dayjs(`${currentYear}-${(currentMonth + 2).toString().padStart(2, '0')}-19`).valueOf(),
            recordGroup: recordGroups[2], // 출장
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        // 월 초반 구간 일정 4개 추가
        {
            id: '22',
            title: '월간 계획 수립 (3일)',
            type: 'DAY',
            description: '새로운 월의 계획 수립 및 목표 설정 (3일간)',
            startedAt: dayjs(`${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-01`).valueOf(),
            endedAt: dayjs(`${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-03`).valueOf(),
            recordGroup: recordGroups[0], // 업무
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '23',
            title: '팀 빌딩 워크샵 (2일)',
            type: 'DAY',
            description: '팀원들과의 빌딩 활동 및 소통 시간 (2일간)',
            startedAt: dayjs(`${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-02`).valueOf(),
            endedAt: dayjs(`${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-03`).valueOf(),
            recordGroup: recordGroups[0], // 업무
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '24',
            title: '신규 프로젝트 킥오프 (4일)',
            type: 'DAY',
            description: '새로운 프로젝트의 킥오프 미팅 및 계획 수립 (4일간)',
            startedAt: dayjs(`${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-04`).valueOf(),
            endedAt: dayjs(`${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-07`).valueOf(),
            recordGroup: recordGroups[1], // 프로젝트
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '25',
            title: '개인 스터디 캠프 (3일)',
            type: 'DAY',
            description: '개인 성장을 위한 스터디 그룹 집중 캠프 (3일간)',
            startedAt: dayjs(`${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-06`).valueOf(),
            endedAt: dayjs(`${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-08`).valueOf(),
            recordGroup: recordGroups[3], // 개인 일정
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
    ]
}

// Weekly용 샘플 레코드
export const createSampleRecordsForWeekly = (recordGroups: object[]) => {
    const now = dayjs()
    const currentWeek = now.startOf('week')
    
    return [
        // ===== SPECIAL-DAY-EVENTS 영역 (MULTI_DAY, DAY 타입) =====
        
        // 일요일~월요일 (MULTI_DAY) - special-day-events에 표시
        {
            id: 'w1',
            title: '주말 워크샵',
            type: 'MULTI_DAY',
            description: '주말 동안 진행되는 팀 워크샵',
            startedAt: currentWeek.add(0, 'day').valueOf(), // 일요일
            endedAt: currentWeek.add(1, 'day').valueOf(), // 월요일
            recordGroup: recordGroups[0], // 업무
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        
        // 월요일~수요일 (MULTI_DAY) - special-day-events에 표시
        {
            id: 'w2',
            title: '주간 프로젝트 리뷰',
            type: 'MULTI_DAY',
            description: '주간 프로젝트 진행 상황 리뷰 및 다음 주 계획 수립',
            startedAt: currentWeek.add(1, 'day').valueOf(), // 월요일
            endedAt: currentWeek.add(3, 'day').valueOf(), // 수요일
            recordGroup: recordGroups[1], // 프로젝트
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        
        // 화요일 (DAY) - special-day-events에 표시
        {
            id: 'w3',
            title: '화요일 집중 작업일',
            type: 'DAY',
            description: '개발 작업에 집중하는 하루',
            startedAt: currentWeek.add(2, 'day').valueOf(),
            endedAt: currentWeek.add(2, 'day').valueOf(),
            recordGroup: recordGroups[0], // 업무
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        
        // 수요일 (DAY) - special-day-events에 표시
        {
            id: 'w4',
            title: '개인 스터디 데이',
            type: 'DAY',
            description: '개인 성장을 위한 스터디 시간',
            startedAt: currentWeek.add(3, 'day').valueOf(),
            endedAt: currentWeek.add(3, 'day').valueOf(),
            recordGroup: recordGroups[4], // 독서 토론 동호회
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        
        // 목요일~금요일 (MULTI_DAY) - special-day-events에 표시
        {
            id: 'w5',
            title: '출장 (2일)',
            type: 'MULTI_DAY',
            description: '부산 고객사 방문 및 현장 점검',
            startedAt: currentWeek.add(4, 'day').valueOf(), // 목요일
            endedAt: currentWeek.add(5, 'day').valueOf(), // 금요일
            recordGroup: recordGroups[2], // 출장
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        
        // 토요일 (DAY) - special-day-events에 표시
        {
            id: 'w6',
            title: '개인 프로젝트',
            type: 'DAY',
            description: '워크폴리오 사이드 프로젝트 작업',
            startedAt: currentWeek.add(6, 'day').valueOf(),
            endedAt: currentWeek.add(6, 'day').valueOf(),
            recordGroup: recordGroups[5], // 워크폴리오 사이드 프로젝트
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        
        // 일요일 (DAY) - special-day-events에 표시
        {
            id: 'w7',
            title: '가족 시간',
            type: 'DAY',
            description: '가족과 함께하는 시간',
            startedAt: currentWeek.add(0, 'day').valueOf(), // 일요일
            endedAt: currentWeek.add(0, 'day').valueOf(),
            recordGroup: recordGroups[3], // 개인 일정
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        
        // ===== TIME 그리드 영역 (TIME 타입) =====
        
        // 일요일 TIME 이벤트들
        {
            id: 'w8',
            title: '일요일 독서 시간',
            type: 'TIME',
            description: '개인 성장을 위한 독서',
            startedAt: currentWeek.add(0, 'day').hour(10).minute(0).valueOf(),
            endedAt: currentWeek.add(0, 'day').hour(12).minute(0).valueOf(),
            recordGroup: recordGroups[4], // 독서 토론 동호회
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: 'w9',
            title: '가족 식사',
            type: 'TIME',
            description: '가족과 함께하는 식사 시간',
            startedAt: currentWeek.add(0, 'day').hour(18).minute(0).valueOf(),
            endedAt: currentWeek.add(0, 'day').hour(20).minute(0).valueOf(),
            recordGroup: recordGroups[3], // 개인 일정
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        
        // 월요일 TIME 이벤트들
        {
            id: 'w10',
            title: '월요일 아침 미팅',
            type: 'TIME',
            description: '주간 시작 미팅 및 우선순위 논의',
            startedAt: currentWeek.add(1, 'day').hour(9).minute(0).valueOf(),
            endedAt: currentWeek.add(1, 'day').hour(10).minute(30).valueOf(),
            recordGroup: recordGroups[0], // 업무
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: 'w11',
            title: '코드 리뷰',
            type: 'TIME',
            description: '팀원들의 코드 리뷰 및 피드백',
            startedAt: currentWeek.add(1, 'day').hour(14).minute(0).valueOf(),
            endedAt: currentWeek.add(1, 'day').hour(16).minute(0).valueOf(),
            recordGroup: recordGroups[0], // 업무
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: 'w12',
            title: '팀 미팅',
            type: 'TIME',
            description: '주간 업무 계획 및 이슈 논의',
            startedAt: currentWeek.add(1, 'day').hour(17).minute(0).valueOf(),
            endedAt: currentWeek.add(1, 'day').hour(18).minute(0).valueOf(),
            recordGroup: recordGroups[0], // 업무
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        
        // 화요일 TIME 이벤트들
        {
            id: 'w13',
            title: '클라이언트 미팅',
            type: 'TIME',
            description: '고객사와의 프로젝트 진행 상황 미팅',
            startedAt: currentWeek.add(2, 'day').hour(10).minute(0).valueOf(),
            endedAt: currentWeek.add(2, 'day').hour(11).minute(30).valueOf(),
            recordGroup: recordGroups[0], // 업무
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: 'w14',
            title: '개발 작업',
            type: 'TIME',
            description: '새로운 기능 개발 작업',
            startedAt: currentWeek.add(2, 'day').hour(14).minute(0).valueOf(),
            endedAt: currentWeek.add(2, 'day').hour(17).minute(0).valueOf(),
            recordGroup: recordGroups[0], // 업무
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: 'w15',
            title: '기술 스터디',
            type: 'TIME',
            description: 'React 18 신기능 스터디',
            startedAt: currentWeek.add(2, 'day').hour(19).minute(0).valueOf(),
            endedAt: currentWeek.add(2, 'day').hour(21).minute(0).valueOf(),
            recordGroup: recordGroups[4], // 독서 토론 동호회
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        
        // 수요일 TIME 이벤트들
        {
            id: 'w16',
            title: '스프린트 플래닝',
            type: 'TIME',
            description: '다음 스프린트 계획 수립',
            startedAt: currentWeek.add(3, 'day').hour(9).minute(0).valueOf(),
            endedAt: currentWeek.add(3, 'day').hour(11).minute(0).valueOf(),
            recordGroup: recordGroups[1], // 프로젝트
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: 'w17',
            title: '데이터베이스 최적화',
            type: 'TIME',
            description: '성능 개선을 위한 DB 쿼리 최적화',
            startedAt: currentWeek.add(3, 'day').hour(14).minute(0).valueOf(),
            endedAt: currentWeek.add(3, 'day').hour(17).minute(0).valueOf(),
            recordGroup: recordGroups[0], // 업무
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: 'w18',
            title: '코드 리팩토링',
            type: 'TIME',
            description: '기존 코드 개선 및 최적화',
            startedAt: currentWeek.add(3, 'day').hour(19).minute(0).valueOf(),
            endedAt: currentWeek.add(3, 'day').hour(21).minute(0).valueOf(),
            recordGroup: recordGroups[5], // 워크폴리오 사이드 프로젝트
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        
        // 목요일 TIME 이벤트들
        {
            id: 'w19',
            title: '출장 준비',
            type: 'TIME',
            description: '부산 출장을 위한 준비 작업',
            startedAt: currentWeek.add(4, 'day').hour(8).minute(0).valueOf(),
            endedAt: currentWeek.add(4, 'day').hour(10).minute(0).valueOf(),
            recordGroup: recordGroups[2], // 출장
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: 'w20',
            title: '출장 이동',
            type: 'TIME',
            description: '부산으로 이동',
            startedAt: currentWeek.add(4, 'day').hour(11).minute(0).valueOf(),
            endedAt: currentWeek.add(4, 'day').hour(15).minute(0).valueOf(),
            recordGroup: recordGroups[2], // 출장
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: 'w21',
            title: '고객사 미팅',
            type: 'TIME',
            description: '부산 고객사와의 프로젝트 미팅',
            startedAt: currentWeek.add(4, 'day').hour(16).minute(0).valueOf(),
            endedAt: currentWeek.add(4, 'day').hour(18).minute(0).valueOf(),
            recordGroup: recordGroups[2], // 출장
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        
        // 금요일 TIME 이벤트들
        {
            id: 'w22',
            title: '현장 점검',
            type: 'TIME',
            description: '고객사 시스템 현장 점검',
            startedAt: currentWeek.add(5, 'day').hour(9).minute(0).valueOf(),
            endedAt: currentWeek.add(5, 'day').hour(12).minute(0).valueOf(),
            recordGroup: recordGroups[2], // 출장
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: 'w23',
            title: '프로젝트 보고서 작성',
            type: 'TIME',
            description: '출장 결과 보고서 작성',
            startedAt: currentWeek.add(5, 'day').hour(14).minute(0).valueOf(),
            endedAt: currentWeek.add(5, 'day').hour(16).minute(30).valueOf(),
            recordGroup: recordGroups[2], // 출장
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: 'w24',
            title: '주간 회고',
            type: 'TIME',
            description: '이번 주 작업 내용 회고 및 다음 주 계획',
            startedAt: currentWeek.add(5, 'day').hour(17).minute(0).valueOf(),
            endedAt: currentWeek.add(5, 'day').hour(18).minute(0).valueOf(),
            recordGroup: recordGroups[0], // 업무
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        
        // 토요일 TIME 이벤트들
        {
            id: 'w25',
            title: '개발 작업',
            type: 'TIME',
            description: '새로운 기능 개발',
            startedAt: currentWeek.add(6, 'day').hour(10).minute(0).valueOf(),
            endedAt: currentWeek.add(6, 'day').hour(14).minute(0).valueOf(),
            recordGroup: recordGroups[5], // 워크폴리오 사이드 프로젝트
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: 'w26',
            title: '코드 리팩토링',
            type: 'TIME',
            description: '기존 코드 개선 및 최적화',
            startedAt: currentWeek.add(6, 'day').hour(15).minute(0).valueOf(),
            endedAt: currentWeek.add(6, 'day').hour(17).minute(0).valueOf(),
            recordGroup: recordGroups[5], // 워크폴리오 사이드 프로젝트
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: 'w27',
            title: '테스트 작성',
            type: 'TIME',
            description: '단위 테스트 및 통합 테스트 작성',
            startedAt: currentWeek.add(6, 'day').hour(19).minute(0).valueOf(),
            endedAt: currentWeek.add(6, 'day').hour(21).minute(0).valueOf(),
            recordGroup: recordGroups[5], // 워크폴리오 사이드 프로젝트
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
    ]
}

// 기존 함수는 monthly용으로 유지 (하위 호환성)
export const createSampleRecords = createSampleRecordsForMonthly

// 샘플 Worker 데이터
const createSampleWorker = (): Worker => ({
    id: 'sample-worker-1',
    name: '김개발',
    nickName: 'devkim',
    createdAt: Date.now() - 365 * 24 * 60 * 60 * 1000, // 1년 전
    updatedAt: Date.now()
});

// 샘플 회사 데이터
export const createSampleCompanies = (): Company[] => {
    const now = Date.now();
    const worker = createSampleWorker();
    
    return [
        {
            id: 'company-1',
            name: '테크스타트업',
            startedAt: now - 2 * 365 * 24 * 60 * 60 * 1000, // 2년 전
            endedAt: now - 1 * 365 * 24 * 60 * 60 * 1000, // 1년 전
            isWorking: false,
            worker,
            createdAt: now - 2 * 365 * 24 * 60 * 60 * 1000,
            updatedAt: now - 1 * 365 * 24 * 60 * 60 * 1000
        },
        {
            id: 'company-2',
            name: '글로벌 IT 기업',
            startedAt: now - 1 * 365 * 24 * 60 * 60 * 1000, // 1년 전
            endedAt: 0, // 현재 재직 중
            isWorking: true,
            worker,
            createdAt: now - 1 * 365 * 24 * 60 * 60 * 1000,
            updatedAt: now
        },
        {
            id: 'company-3',
            name: '중견 소프트웨어 회사',
            startedAt: now - 3 * 365 * 24 * 60 * 60 * 1000, // 3년 전
            endedAt: now - 2 * 365 * 24 * 60 * 60 * 1000, // 2년 전
            isWorking: false,
            worker,
            createdAt: now - 3 * 365 * 24 * 60 * 60 * 1000,
            updatedAt: now - 2 * 365 * 24 * 60 * 60 * 1000
        }
    ];
};

// 샘플 자격증 데이터
export const createSampleCertifications = (): Certifications[] => {
    const now = Date.now();
    const worker = createSampleWorker();
    
    return [
        {
            id: 'cert-1',
            name: 'AWS Solutions Architect Associate',
            number: 'AWS-SAA-123456',
            issuer: 'Amazon Web Services',
            issuedAt: now - 6 * 30 * 24 * 60 * 60 * 1000, // 6개월 전
            expirationPeriod: 3 * 365 * 24 * 60 * 60 * 1000, // 3년
            worker,
            createdAt: now - 6 * 30 * 24 * 60 * 60 * 1000,
            updatedAt: now - 6 * 30 * 24 * 60 * 60 * 1000
        },
        {
            id: 'cert-2',
            name: '정보처리기사',
            number: '2024-123456',
            issuer: '한국산업인력공단',
            issuedAt: now - 1 * 365 * 24 * 60 * 60 * 1000, // 1년 전
            expirationPeriod: 0, // 영구
            worker,
            createdAt: now - 1 * 365 * 24 * 60 * 60 * 1000,
            updatedAt: now - 1 * 365 * 24 * 60 * 60 * 1000
        },
        {
            id: 'cert-3',
            name: 'PMP (Project Management Professional)',
            number: 'PMP-789012',
            issuer: 'Project Management Institute',
            issuedAt: now - 2 * 365 * 24 * 60 * 60 * 1000, // 2년 전
            expirationPeriod: 3 * 365 * 24 * 60 * 60 * 1000, // 3년
            worker,
            createdAt: now - 2 * 365 * 24 * 60 * 60 * 1000,
            updatedAt: now - 2 * 365 * 24 * 60 * 60 * 1000
        },
        {
            id: 'cert-4',
            name: 'Google Cloud Professional Developer',
            number: 'GCP-PD-345678',
            issuer: 'Google Cloud',
            issuedAt: now - 3 * 30 * 24 * 60 * 60 * 1000, // 3개월 전
            expirationPeriod: 3 * 365 * 24 * 60 * 60 * 1000, // 3년
            worker,
            createdAt: now - 3 * 30 * 24 * 60 * 60 * 1000,
            updatedAt: now - 3 * 30 * 24 * 60 * 60 * 1000
        }
    ];
};

// 샘플 학위 데이터
export const createSampleDegrees = (): Degrees[] => {
    const now = Date.now();
    const worker = createSampleWorker();
    
    return [
        {
            id: 'degree-1',
            name: '컴퓨터공학 학사',
            major: '컴퓨터공학',
            startedAt: now - 6 * 365 * 24 * 60 * 60 * 1000, // 6년 전
            endedAt: now - 2 * 365 * 24 * 60 * 60 * 1000, // 2년 전
            worker,
            createdAt: now - 6 * 365 * 24 * 60 * 60 * 1000,
            updatedAt: now - 2 * 365 * 24 * 60 * 60 * 1000
        },
        {
            id: 'degree-2',
            name: '소프트웨어공학 석사',
            major: '소프트웨어공학',
            startedAt: now - 4 * 365 * 24 * 60 * 60 * 1000, // 4년 전
            endedAt: now - 2 * 365 * 24 * 60 * 60 * 1000, // 2년 전
            worker,
            createdAt: now - 4 * 365 * 24 * 60 * 60 * 1000,
            updatedAt: now - 2 * 365 * 24 * 60 * 60 * 1000
        }
    ];
};

// 샘플 교육 데이터
export const createSampleEducations = (): Education[] => {
    const now = Date.now();
    const worker = createSampleWorker();
    
    return [
        {
            id: 'edu-1',
            name: 'React 고급 개발 과정',
            startedAt: now - 3 * 30 * 24 * 60 * 60 * 1000, // 3개월 전
            endedAt: now - 2 * 30 * 24 * 60 * 60 * 1000, // 2개월 전
            agency: '프로그래머스',
            worker,
            createdAt: now - 3 * 30 * 24 * 60 * 60 * 1000,
            updatedAt: now - 2 * 30 * 24 * 60 * 60 * 1000
        },
        {
            id: 'edu-2',
            name: 'AWS 클라우드 아키텍처 설계',
            startedAt: now - 6 * 30 * 24 * 60 * 60 * 1000, // 6개월 전
            endedAt: now - 5 * 30 * 24 * 60 * 60 * 1000, // 5개월 전
            agency: 'AWS 교육 파트너',
            worker,
            createdAt: now - 6 * 30 * 24 * 60 * 60 * 1000,
            updatedAt: now - 5 * 30 * 24 * 60 * 60 * 1000
        },
        {
            id: 'edu-3',
            name: '데이터베이스 최적화 기법',
            startedAt: now - 1 * 30 * 24 * 60 * 60 * 1000, // 1개월 전
            endedAt: now - 15 * 24 * 60 * 60 * 1000, // 15일 전
            agency: '한국데이터베이스진흥원',
            worker,
            createdAt: now - 1 * 30 * 24 * 60 * 60 * 1000,
            updatedAt: now - 15 * 24 * 60 * 60 * 1000
        },
        {
            id: 'edu-4',
            name: '프로젝트 관리 실무',
            startedAt: now - 4 * 30 * 24 * 60 * 60 * 1000, // 4개월 전
            endedAt: now - 3 * 30 * 24 * 60 * 60 * 1000, // 3개월 전
            agency: '한국프로젝트관리협회',
            worker,
            createdAt: now - 4 * 30 * 24 * 60 * 60 * 1000,
            updatedAt: now - 3 * 30 * 24 * 60 * 60 * 1000
        }
    ];
};

// 샘플 구직 데이터
export const createSampleJobSearches = (): JobSearch[] => {
    const now = Date.now();
    const worker = createSampleWorker();
    
    return [
        {
            id: 'jobsearch-1',
            title: '2024년 상반기 구직 활동',
            startedAt: now - 6 * 30 * 24 * 60 * 60 * 1000, // 6개월 전
            endedAt: now - 3 * 30 * 24 * 60 * 60 * 1000, // 3개월 전
            memo: '대기업 중심으로 구직 활동을 진행했습니다. 총 15개 회사에 지원하여 3개 회사에서 최종 면접까지 진행했습니다.',
            worker,
            prevCompany: {
                id: 'company-1',
                name: '테크스타트업',
                startedAt: now - 2 * 365 * 24 * 60 * 60 * 1000,
                endedAt: now - 1 * 365 * 24 * 60 * 60 * 1000,
                isWorking: false,
                worker,
                createdAt: now - 2 * 365 * 24 * 60 * 60 * 1000,
                updatedAt: now - 1 * 365 * 24 * 60 * 60 * 1000
            },
            nextCompany: {
                id: 'company-2',
                name: '글로벌 IT 기업',
                startedAt: now - 1 * 365 * 24 * 60 * 60 * 1000,
                endedAt: 0,
                isWorking: true,
                worker,
                createdAt: now - 1 * 365 * 24 * 60 * 60 * 1000,
                updatedAt: now
            },
            createdAt: now - 6 * 30 * 24 * 60 * 60 * 1000,
            updatedAt: now - 3 * 30 * 24 * 60 * 60 * 1000
        },
        {
            id: 'jobsearch-2',
            title: '2023년 하반기 구직 활동',
            startedAt: now - 12 * 30 * 24 * 60 * 60 * 1000, // 12개월 전
            endedAt: now - 8 * 30 * 24 * 60 * 60 * 1000, // 8개월 전
            memo: '스타트업과 중견기업을 중심으로 구직 활동을 진행했습니다. 개발자 커뮤니티를 통해 많은 기회를 얻을 수 있었습니다.',
            worker,
            prevCompany: {
                id: 'company-3',
                name: '중견 소프트웨어 회사',
                startedAt: now - 3 * 365 * 24 * 60 * 60 * 1000,
                endedAt: now - 2 * 365 * 24 * 60 * 60 * 1000,
                isWorking: false,
                worker,
                createdAt: now - 3 * 365 * 24 * 60 * 60 * 1000,
                updatedAt: now - 2 * 365 * 24 * 60 * 60 * 1000
            },
            nextCompany: {
                id: 'company-1',
                name: '테크스타트업',
                startedAt: now - 2 * 365 * 24 * 60 * 60 * 1000,
                endedAt: now - 1 * 365 * 24 * 60 * 60 * 1000,
                isWorking: false,
                worker,
                createdAt: now - 2 * 365 * 24 * 60 * 60 * 1000,
                updatedAt: now - 1 * 365 * 24 * 60 * 60 * 1000
            },
            createdAt: now - 12 * 30 * 24 * 60 * 60 * 1000,
            updatedAt: now - 8 * 30 * 24 * 60 * 60 * 1000
        }
    ];
};

// 샘플 구직 회사 데이터
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
                title: '2024년 상반기 구직 활동',
                startedAt: now - 6 * 30 * 24 * 60 * 60 * 1000,
                endedAt: now - 3 * 30 * 24 * 60 * 60 * 1000,
                memo: '대기업 중심으로 구직 활동을 진행했습니다.',
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
                title: '2024년 상반기 구직 활동',
                startedAt: now - 6 * 30 * 24 * 60 * 60 * 1000,
                endedAt: now - 3 * 30 * 24 * 60 * 60 * 1000,
                memo: '대기업 중심으로 구직 활동을 진행했습니다.',
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
                title: '2024년 상반기 구직 활동',
                startedAt: now - 6 * 30 * 24 * 60 * 60 * 1000,
                endedAt: now - 3 * 30 * 24 * 60 * 60 * 1000,
                memo: '대기업 중심으로 구직 활동을 진행했습니다.',
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
                title: '2024년 상반기 구직 활동',
                startedAt: now - 6 * 30 * 24 * 60 * 60 * 1000,
                endedAt: now - 3 * 30 * 24 * 60 * 60 * 1000,
                memo: '대기업 중심으로 구직 활동을 진행했습니다.',
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
                title: '2024년 상반기 구직 활동',
                startedAt: now - 6 * 30 * 24 * 60 * 60 * 1000,
                endedAt: now - 3 * 30 * 24 * 60 * 60 * 1000,
                memo: '대기업 중심으로 구직 활동을 진행했습니다.',
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
                    title: '2024년 상반기 구직 활동',
                    startedAt: now - 6 * 30 * 24 * 60 * 60 * 1000,
                    endedAt: now - 3 * 30 * 24 * 60 * 60 * 1000,
                    memo: '대기업 중심으로 구직 활동을 진행했습니다.',
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
                    title: '2024년 상반기 구직 활동',
                    startedAt: now - 6 * 30 * 24 * 60 * 60 * 1000,
                    endedAt: now - 3 * 30 * 24 * 60 * 60 * 1000,
                    memo: '대기업 중심으로 구직 활동을 진행했습니다.',
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
                    title: '2024년 상반기 구직 활동',
                    startedAt: now - 6 * 30 * 24 * 60 * 60 * 1000,
                    endedAt: now - 3 * 30 * 24 * 60 * 60 * 1000,
                    memo: '대기업 중심으로 구직 활동을 진행했습니다.',
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
