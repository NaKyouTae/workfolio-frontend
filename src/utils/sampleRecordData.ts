import { RecordGroup, RecordGroup_RecordGroupRole, RecordGroup_RecordGroupType, Worker, Worker_Gender } from '@/generated/common'
import { RecordGroupDetailResponse } from '@/generated/record_group'
import dayjs from 'dayjs'

export const createSampleRecordGroups = (): RecordGroup[] => {
    return [
        {
            id: '1',
            title: '업무',
            isDefault: false,
            type: RecordGroup_RecordGroupType.PRIVATE,
            publicId: 'work',
            color: '#ffc107',
            priority: 1,
            role: RecordGroup_RecordGroupRole.FULL,
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2',
            title: '프로젝트',
            isDefault: false,
            type: RecordGroup_RecordGroupType.SHARED,
            publicId: 'project',
            color: '#fd7e14',
            priority: 2,
            role: RecordGroup_RecordGroupRole.FULL,
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '3',
            title: '출장',
            isDefault: false,
            type: RecordGroup_RecordGroupType.PRIVATE,
            publicId: 'business-trip',
            color: '#ffc107',
            priority: 3,
            role: RecordGroup_RecordGroupRole.FULL,
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '4',
            title: '개인 일정',
            isDefault: false,
            type: RecordGroup_RecordGroupType.PRIVATE,
            publicId: 'personal',
            color: '#28a745',
            priority: 4,
            role: RecordGroup_RecordGroupRole.FULL,
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '5',
            title: '독서 토론 동호회',
            isDefault: false,
            type: RecordGroup_RecordGroupType.PRIVATE,
            publicId: 'book-club',
            color: '#007bff',
            priority: 5,
            role: RecordGroup_RecordGroupRole.FULL,
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '6',
            title: '워크폴리오 사이드 프로젝트',
            isDefault: false,
            type: RecordGroup_RecordGroupType.SHARED,
            publicId: 'workfolio-side',
            color: '#17a2b8',
            priority: 6,
            role: RecordGroup_RecordGroupRole.FULL,
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
    ]
}


// 기존 함수는 monthly용으로 유지 (하위 호환성)
export const createSampleRecords = (recordGroups: object[]) => {
    // 2025년 10월-11월 고정 샘플 데이터
    return [
        // 2025년 10월 첫째 주 (10/6-10/12)
        {
            id: '2025100101',
            title: '주간 미팅',
            type: 'TIME',
            description: '주간 진행 상황 공유 및 다음 주 계획 수립',
            startedAt: dayjs('2025-10-07').hour(9).minute(0).second(0).valueOf(),
            endedAt: dayjs('2025-10-07').hour(10).minute(0).second(0).valueOf(),
            recordGroup: recordGroups[0],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025100102',
            title: '프로젝트 리뷰',
            type: 'TIME',
            description: '프로젝트 진행 상황 점검 및 이슈 해결',
            startedAt: dayjs('2025-10-07').hour(14).minute(0).second(0).valueOf(),
            endedAt: dayjs('2025-10-07').hour(16).minute(0).second(0).valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025100103',
            title: '클라이언트 미팅',
            type: 'DAY',
            description: '고객 요구사항 확인 및 제안서 검토',
            startedAt: dayjs('2025-10-08').startOf('day').valueOf(),
            endedAt: dayjs('2025-10-08').endOf('day').valueOf(),
            recordGroup: recordGroups[0],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025100104',
            title: '팀 빌딩',
            type: 'TIME',
            description: '팀원 간 소통 및 협업 강화',
            startedAt: dayjs('2025-10-09').hour(10).minute(30).second(0).valueOf(),
            endedAt: dayjs('2025-10-09').hour(12).minute(0).second(0).valueOf(),
            recordGroup: recordGroups[2],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025100105',
            title: '코드 리뷰',
            type: 'MULTI_DAY',
            description: '코드 품질 향상을 위한 리뷰 세션',
            startedAt: dayjs('2025-10-10').startOf('day').valueOf(),
            endedAt: dayjs('2025-10-12').endOf('day').valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025100106',
            title: '데이터베이스 최적화',
            type: 'TIME',
            description: '데이터베이스 성능 최적화 및 인덱스 튜닝',
            startedAt: dayjs('2025-10-08').hour(15).minute(0).second(0).valueOf(),
            endedAt: dayjs('2025-10-08').hour(17).minute(0).second(0).valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025100107',
            title: 'API 문서화',
            type: 'TIME',
            description: 'REST API 문서 작성 및 스웨거 설정',
            startedAt: dayjs('2025-10-09').hour(13).minute(0).second(0).valueOf(),
            endedAt: dayjs('2025-10-09').hour(15).minute(0).second(0).valueOf(),
            recordGroup: recordGroups[0],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025100108',
            title: '사용자 피드백 분석',
            type: 'DAY',
            description: '사용자 피드백 수집 및 분석',
            startedAt: dayjs('2025-10-11').startOf('day').valueOf(),
            endedAt: dayjs('2025-10-11').endOf('day').valueOf(),
            recordGroup: recordGroups[2],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },

        // 2025년 10월 둘째 주 (10/13-10/19)
        {
            id: '2025100201',
            title: '기획 회의',
            type: 'TIME',
            description: '신규 기능 기획 및 요구사항 정의',
            startedAt: dayjs('2025-10-14').hour(9).minute(0).second(0).valueOf(),
            endedAt: dayjs('2025-10-14').hour(11).minute(0).second(0).valueOf(),
            recordGroup: recordGroups[0],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025100202',
            title: '디자인 리뷰',
            type: 'TIME',
            description: 'UI/UX 디자인 검토 및 개선사항 논의',
            startedAt: dayjs('2025-10-15').hour(14).minute(0).second(0).valueOf(),
            endedAt: dayjs('2025-10-15').hour(15).minute(30).second(0).valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025100203',
            title: '테스트',
            type: 'DAY',
            description: '기능 테스트 및 버그 수정',
            startedAt: dayjs('2025-10-16').startOf('day').valueOf(),
            endedAt: dayjs('2025-10-16').endOf('day').valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025100204',
            title: '배포',
            type: 'TIME',
            description: '프로덕션 환경 배포 및 모니터링',
            startedAt: dayjs('2025-10-17').hour(16).minute(0).second(0).valueOf(),
            endedAt: dayjs('2025-10-17').hour(18).minute(0).second(0).valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025100205',
            title: '모니터링 설정',
            type: 'TIME',
            description: '시스템 모니터링 도구 설정 및 알림 구성',
            startedAt: dayjs('2025-10-13').hour(11).minute(0).second(0).valueOf(),
            endedAt: dayjs('2025-10-13').hour(12).minute(30).second(0).valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025100206',
            title: '사용자 교육',
            type: 'DAY',
            description: '신규 사용자 교육 및 온보딩',
            startedAt: dayjs('2025-10-15').startOf('day').valueOf(),
            endedAt: dayjs('2025-10-15').endOf('day').valueOf(),
            recordGroup: recordGroups[2],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025100207',
            title: '로깅 시스템 구축',
            type: 'TIME',
            description: '중앙화된 로깅 시스템 구축 및 설정',
            startedAt: dayjs('2025-10-16').hour(9).minute(0).second(0).valueOf(),
            endedAt: dayjs('2025-10-16').hour(11).minute(0).second(0).valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025100208',
            title: '성능 벤치마크',
            type: 'MULTI_DAY',
            description: '시스템 성능 벤치마크 및 비교 분석',
            startedAt: dayjs('2025-10-18').startOf('day').valueOf(),
            endedAt: dayjs('2025-10-19').endOf('day').valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },

        // 2025년 10월 셋째 주 (10/20-10/26)
        {
            id: '2025100301',
            title: '문서화',
            type: 'TIME',
            description: '프로젝트 문서 정리 및 가이드 작성',
            startedAt: dayjs('2025-10-21').hour(10).minute(0).second(0).valueOf(),
            endedAt: dayjs('2025-10-21').hour(12).minute(0).second(0).valueOf(),
            recordGroup: recordGroups[0],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025100302',
            title: '사용자 인터뷰',
            type: 'MULTI_DAY',
            description: '사용자 피드백 수집 및 분석',
            startedAt: dayjs('2025-10-22').startOf('day').valueOf(),
            endedAt: dayjs('2025-10-24').endOf('day').valueOf(),
            recordGroup: recordGroups[2],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025100303',
            title: '데이터 분석',
            type: 'TIME',
            description: '비즈니스 데이터 분석 및 인사이트 도출',
            startedAt: dayjs('2025-10-25').hour(9).minute(30).second(0).valueOf(),
            endedAt: dayjs('2025-10-25').hour(11).minute(30).second(0).valueOf(),
            recordGroup: recordGroups[0],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025100304',
            title: '마이크로서비스 설계',
            type: 'DAY',
            description: '마이크로서비스 아키텍처 설계 및 분할 전략',
            startedAt: dayjs('2025-10-21').startOf('day').valueOf(),
            endedAt: dayjs('2025-10-21').endOf('day').valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025100305',
            title: '컨테이너화',
            type: 'TIME',
            description: '애플리케이션 컨테이너화 및 Docker 설정',
            startedAt: dayjs('2025-10-22').hour(14).minute(0).second(0).valueOf(),
            endedAt: dayjs('2025-10-22').hour(16).minute(0).second(0).valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025100306',
            title: 'A/B 테스트',
            type: 'MULTI_DAY',
            description: '사용자 경험 개선을 위한 A/B 테스트',
            startedAt: dayjs('2025-10-23').startOf('day').valueOf(),
            endedAt: dayjs('2025-10-24').endOf('day').valueOf(),
            recordGroup: recordGroups[2],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025100307',
            title: '캐싱 전략',
            type: 'TIME',
            description: '캐싱 전략 수립 및 Redis 도입',
            startedAt: dayjs('2025-10-26').hour(10).minute(0).second(0).valueOf(),
            endedAt: dayjs('2025-10-26').hour(12).minute(0).second(0).valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },

        // 2025년 10월 넷째 주 (10/27-11/2)
        {
            id: '2025100401',
            title: '성능 최적화',
            type: 'DAY',
            description: '시스템 성능 개선 및 최적화',
            startedAt: dayjs('2025-10-28').startOf('day').valueOf(),
            endedAt: dayjs('2025-10-28').endOf('day').valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025100402',
            title: '보안 점검',
            type: 'TIME',
            description: '보안 취약점 점검 및 대응',
            startedAt: dayjs('2025-10-29').hour(14).minute(0).second(0).valueOf(),
            endedAt: dayjs('2025-10-29').hour(16).minute(0).second(0).valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025100403',
            title: '인프라 구축',
            type: 'MULTI_DAY',
            description: '서버 인프라 구축 및 설정',
            startedAt: dayjs('2025-10-30').startOf('day').valueOf(),
            endedAt: dayjs('2025-11-01').endOf('day').valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025100404',
            title: 'CI/CD 파이프라인',
            type: 'TIME',
            description: '지속적 통합/배포 파이프라인 구축',
            startedAt: dayjs('2025-10-28').hour(15).minute(0).second(0).valueOf(),
            endedAt: dayjs('2025-10-28').hour(17).minute(0).second(0).valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025100405',
            title: '로드 밸런싱',
            type: 'DAY',
            description: '로드 밸런서 설정 및 트래픽 분산',
            startedAt: dayjs('2025-10-29').startOf('day').valueOf(),
            endedAt: dayjs('2025-10-29').endOf('day').valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025100406',
            title: '모니터링 대시보드',
            type: 'TIME',
            description: '실시간 모니터링 대시보드 구축',
            startedAt: dayjs('2025-10-31').hour(9).minute(0).second(0).valueOf(),
            endedAt: dayjs('2025-10-31').hour(11).minute(0).second(0).valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025100407',
            title: '재해 복구',
            type: 'MULTI_DAY',
            description: '재해 복구 계획 수립 및 테스트',
            startedAt: dayjs('2025-11-01').startOf('day').valueOf(),
            endedAt: dayjs('2025-11-02').endOf('day').valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },

        // 2025년 11월 첫째 주 (11/3-11/9)
        {
            id: '2025110101',
            title: '주간 미팅',
            type: 'TIME',
            description: '주간 진행 상황 공유 및 다음 주 계획 수립',
            startedAt: dayjs('2025-11-04').hour(9).minute(0).second(0).valueOf(),
            endedAt: dayjs('2025-11-04').hour(10).minute(0).second(0).valueOf(),
            recordGroup: recordGroups[0],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025110102',
            title: '프로젝트 리뷰',
            type: 'TIME',
            description: '프로젝트 진행 상황 점검 및 이슈 해결',
            startedAt: dayjs('2025-11-05').hour(14).minute(0).second(0).valueOf(),
            endedAt: dayjs('2025-11-05').hour(16).minute(0).second(0).valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025110103',
            title: '클라이언트 미팅',
            type: 'DAY',
            description: '고객 요구사항 확인 및 제안서 검토',
            startedAt: dayjs('2025-11-06').startOf('day').valueOf(),
            endedAt: dayjs('2025-11-06').endOf('day').valueOf(),
            recordGroup: recordGroups[0],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025110104',
            title: '팀 빌딩',
            type: 'TIME',
            description: '팀원 간 소통 및 협업 강화',
            startedAt: dayjs('2025-11-07').hour(10).minute(30).second(0).valueOf(),
            endedAt: dayjs('2025-11-07').hour(12).minute(0).second(0).valueOf(),
            recordGroup: recordGroups[2],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025110105',
            title: '마이그레이션 계획',
            type: 'DAY',
            description: '레거시 시스템 마이그레이션 계획 수립',
            startedAt: dayjs('2025-11-04').startOf('day').valueOf(),
            endedAt: dayjs('2025-11-04').endOf('day').valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025110106',
            title: 'API 게이트웨이',
            type: 'TIME',
            description: 'API 게이트웨이 설정 및 라우팅 구성',
            startedAt: dayjs('2025-11-05').hour(16).minute(0).second(0).valueOf(),
            endedAt: dayjs('2025-11-05').hour(18).minute(0).second(0).valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025110107',
            title: '사용자 권한 관리',
            type: 'TIME',
            description: '사용자 권한 및 인증 시스템 구축',
            startedAt: dayjs('2025-11-06').hour(13).minute(0).second(0).valueOf(),
            endedAt: dayjs('2025-11-06').hour(15).minute(0).second(0).valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025110108',
            title: '데이터 마이그레이션',
            type: 'MULTI_DAY',
            description: '기존 데이터 마이그레이션 및 검증',
            startedAt: dayjs('2025-11-08').startOf('day').valueOf(),
            endedAt: dayjs('2025-11-09').endOf('day').valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },

        // 2025년 11월 둘째 주 (11/10-11/16)
        {
            id: '2025110201',
            title: '코드 리뷰',
            type: 'TIME',
            description: '코드 품질 향상을 위한 리뷰 세션',
            startedAt: dayjs('2025-11-11').hour(9).minute(0).second(0).valueOf(),
            endedAt: dayjs('2025-11-11').hour(11).minute(0).second(0).valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025110202',
            title: '기획 회의',
            type: 'MULTI_DAY',
            description: '신규 기능 기획 및 요구사항 정의',
            startedAt: dayjs('2025-11-12').startOf('day').valueOf(),
            endedAt: dayjs('2025-11-13').endOf('day').valueOf(),
            recordGroup: recordGroups[0],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025110203',
            title: '디자인 리뷰',
            type: 'TIME',
            description: 'UI/UX 디자인 검토 및 개선사항 논의',
            startedAt: dayjs('2025-11-14').hour(14).minute(0).second(0).valueOf(),
            endedAt: dayjs('2025-11-14').hour(15).minute(30).second(0).valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025110204',
            title: '서비스 메시',
            type: 'DAY',
            description: '서비스 메시 아키텍처 도입 및 설정',
            startedAt: dayjs('2025-11-11').startOf('day').valueOf(),
            endedAt: dayjs('2025-11-11').endOf('day').valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025110205',
            title: '이벤트 소싱',
            type: 'TIME',
            description: '이벤트 소싱 패턴 도입 및 구현',
            startedAt: dayjs('2025-11-12').hour(10).minute(0).second(0).valueOf(),
            endedAt: dayjs('2025-11-12').hour(12).minute(0).second(0).valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025110206',
            title: 'CQRS 패턴',
            type: 'TIME',
            description: 'CQRS 패턴 구현 및 이벤트 스토어 구축',
            startedAt: dayjs('2025-11-13').hour(15).minute(0).second(0).valueOf(),
            endedAt: dayjs('2025-11-13').hour(17).minute(0).second(0).valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025110207',
            title: '사가 패턴',
            type: 'MULTI_DAY',
            description: '분산 트랜잭션을 위한 사가 패턴 구현',
            startedAt: dayjs('2025-11-15').startOf('day').valueOf(),
            endedAt: dayjs('2025-11-16').endOf('day').valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },

        // 2025년 11월 셋째 주 (11/17-11/23)
        {
            id: '2025110301',
            title: '테스트',
            type: 'DAY',
            description: '기능 테스트 및 버그 수정',
            startedAt: dayjs('2025-11-18').startOf('day').valueOf(),
            endedAt: dayjs('2025-11-18').endOf('day').valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025110302',
            title: '배포',
            type: 'TIME',
            description: '프로덕션 환경 배포 및 모니터링',
            startedAt: dayjs('2025-11-19').hour(16).minute(0).second(0).valueOf(),
            endedAt: dayjs('2025-11-19').hour(18).minute(0).second(0).valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025110303',
            title: '문서화',
            type: 'TIME',
            description: '프로젝트 문서 정리 및 가이드 작성',
            startedAt: dayjs('2025-11-20').hour(10).minute(0).second(0).valueOf(),
            endedAt: dayjs('2025-11-20').hour(12).minute(0).second(0).valueOf(),
            recordGroup: recordGroups[0],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025110304',
            title: '사용자 인터뷰',
            type: 'MULTI_DAY',
            description: '사용자 피드백 수집 및 분석',
            startedAt: dayjs('2025-11-21').startOf('day').valueOf(),
            endedAt: dayjs('2025-11-22').endOf('day').valueOf(),
            recordGroup: recordGroups[2],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025110305',
            title: '도메인 모델링',
            type: 'DAY',
            description: '도메인 주도 설계 및 모델링',
            startedAt: dayjs('2025-11-18').startOf('day').valueOf(),
            endedAt: dayjs('2025-11-18').endOf('day').valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025110306',
            title: '헥사고날 아키텍처',
            type: 'TIME',
            description: '헥사고날 아키텍처 패턴 도입',
            startedAt: dayjs('2025-11-19').hour(9).minute(0).second(0).valueOf(),
            endedAt: dayjs('2025-11-19').hour(11).minute(0).second(0).valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025110307',
            title: '이벤트 스토밍',
            type: 'TIME',
            description: '이벤트 스토밍 워크샵 및 도메인 분석',
            startedAt: dayjs('2025-11-20').hour(14).minute(0).second(0).valueOf(),
            endedAt: dayjs('2025-11-20').hour(16).minute(0).second(0).valueOf(),
            recordGroup: recordGroups[0],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025110308',
            title: '바운디드 컨텍스트',
            type: 'MULTI_DAY',
            description: '바운디드 컨텍스트 정의 및 경계 설정',
            startedAt: dayjs('2025-11-23').startOf('day').valueOf(),
            endedAt: dayjs('2025-11-24').endOf('day').valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },

        // 2025년 11월 넷째 주 (11/24-11/30)
        {
            id: '2025110401',
            title: '데이터 분석',
            type: 'TIME',
            description: '비즈니스 데이터 분석 및 인사이트 도출',
            startedAt: dayjs('2025-11-25').hour(9).minute(30).second(0).valueOf(),
            endedAt: dayjs('2025-11-25').hour(11).minute(30).second(0).valueOf(),
            recordGroup: recordGroups[0],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025110402',
            title: '성능 최적화',
            type: 'DAY',
            description: '시스템 성능 개선 및 최적화',
            startedAt: dayjs('2025-11-26').startOf('day').valueOf(),
            endedAt: dayjs('2025-11-26').endOf('day').valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025110403',
            title: '보안 점검',
            type: 'TIME',
            description: '보안 취약점 점검 및 대응',
            startedAt: dayjs('2025-11-27').hour(14).minute(0).second(0).valueOf(),
            endedAt: dayjs('2025-11-27').hour(16).minute(0).second(0).valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025110404',
            title: '인프라 구축',
            type: 'MULTI_DAY',
            description: '서버 인프라 구축 및 설정',
            startedAt: dayjs('2025-11-28').startOf('day').valueOf(),
            endedAt: dayjs('2025-11-30').endOf('day').valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025110405',
            title: '폴리글랏 프로그래밍',
            type: 'TIME',
            description: '다양한 언어와 기술 스택 도입',
            startedAt: dayjs('2025-11-25').hour(10).minute(0).second(0).valueOf(),
            endedAt: dayjs('2025-11-25').hour(12).minute(0).second(0).valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025110406',
            title: 'API 버전 관리',
            type: 'DAY',
            description: 'API 버전 관리 전략 수립 및 구현',
            startedAt: dayjs('2025-11-26').startOf('day').valueOf(),
            endedAt: dayjs('2025-11-26').endOf('day').valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025110407',
            title: '서킷 브레이커',
            type: 'TIME',
            description: '서킷 브레이커 패턴 구현 및 장애 격리',
            startedAt: dayjs('2025-11-27').hour(15).minute(0).second(0).valueOf(),
            endedAt: dayjs('2025-11-27').hour(17).minute(0).second(0).valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025110408',
            title: '분산 추적',
            type: 'MULTI_DAY',
            description: '분산 시스템 추적 및 모니터링 구축',
            startedAt: dayjs('2025-11-29').startOf('day').valueOf(),
            endedAt: dayjs('2025-11-30').endOf('day').valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },

        // 2025년 12월 첫째 주 (12/1-12/7)
        {
            id: '2025120101',
            title: '연말 정리',
            type: 'TIME',
            description: '연말 업무 정리 및 다음 해 계획 수립',
            startedAt: dayjs('2025-12-02').hour(9).minute(0).second(0).valueOf(),
            endedAt: dayjs('2025-12-02').hour(11).minute(0).second(0).valueOf(),
            recordGroup: recordGroups[0],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025120102',
            title: '성과 평가',
            type: 'DAY',
            description: '연간 성과 평가 및 피드백',
            startedAt: dayjs('2025-12-03').startOf('day').valueOf(),
            endedAt: dayjs('2025-12-03').endOf('day').valueOf(),
            recordGroup: recordGroups[0],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025120103',
            title: '회고 미팅',
            type: 'TIME',
            description: '팀 회고 및 개선사항 논의',
            startedAt: dayjs('2025-12-04').hour(14).minute(0).second(0).valueOf(),
            endedAt: dayjs('2025-12-04').hour(16).minute(0).second(0).valueOf(),
            recordGroup: recordGroups[2],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025120104',
            title: '기술 세미나',
            type: 'MULTI_DAY',
            description: '신기술 트렌드 세미나 참석',
            startedAt: dayjs('2025-12-05').startOf('day').valueOf(),
            endedAt: dayjs('2025-12-06').endOf('day').valueOf(),
            recordGroup: recordGroups[2],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025120105',
            title: '연말 보너스',
            type: 'TIME',
            description: '연말 보너스 지급 및 성과 평가',
            startedAt: dayjs('2025-12-02').hour(16).minute(0).second(0).valueOf(),
            endedAt: dayjs('2025-12-02').hour(17).minute(0).second(0).valueOf(),
            recordGroup: recordGroups[0],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025120106',
            title: '연말 파티 기획',
            type: 'DAY',
            description: '연말 파티 기획 및 준비',
            startedAt: dayjs('2025-12-03').startOf('day').valueOf(),
            endedAt: dayjs('2025-12-03').endOf('day').valueOf(),
            recordGroup: recordGroups[2],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025120107',
            title: '연말 정산',
            type: 'TIME',
            description: '연말 정산 및 세무 처리',
            startedAt: dayjs('2025-12-04').hour(9).minute(0).second(0).valueOf(),
            endedAt: dayjs('2025-12-04').hour(11).minute(0).second(0).valueOf(),
            recordGroup: recordGroups[0],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025120108',
            title: '연말 휴가 신청',
            type: 'MULTI_DAY',
            description: '연말 휴가 신청 및 승인',
            startedAt: dayjs('2025-12-07').startOf('day').valueOf(),
            endedAt: dayjs('2025-12-08').endOf('day').valueOf(),
            recordGroup: recordGroups[2],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },

        // 2025년 12월 둘째 주 (12/8-12/14)
        {
            id: '2025120201',
            title: '신규 프로젝트 기획',
            type: 'TIME',
            description: '2026년 신규 프로젝트 기획 및 요구사항 정의',
            startedAt: dayjs('2025-12-09').hour(10).minute(0).second(0).valueOf(),
            endedAt: dayjs('2025-12-09').hour(12).minute(0).second(0).valueOf(),
            recordGroup: recordGroups[0],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025120202',
            title: '아키텍처 설계',
            type: 'DAY',
            description: '시스템 아키텍처 설계 및 검토',
            startedAt: dayjs('2025-12-10').startOf('day').valueOf(),
            endedAt: dayjs('2025-12-10').endOf('day').valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025120203',
            title: '코드 품질 개선',
            type: 'TIME',
            description: '기존 코드 리팩토링 및 품질 개선',
            startedAt: dayjs('2025-12-11').hour(9).minute(30).second(0).valueOf(),
            endedAt: dayjs('2025-12-11').hour(11).minute(30).second(0).valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025120204',
            title: '사용자 테스트',
            type: 'MULTI_DAY',
            description: '베타 사용자 테스트 및 피드백 수집',
            startedAt: dayjs('2025-12-12').startOf('day').valueOf(),
            endedAt: dayjs('2025-12-13').endOf('day').valueOf(),
            recordGroup: recordGroups[2],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025120205',
            title: '연말 정산',
            type: 'TIME',
            description: '연말 정산 및 세무 처리',
            startedAt: dayjs('2025-12-09').hour(14).minute(0).second(0).valueOf(),
            endedAt: dayjs('2025-12-09').hour(16).minute(0).second(0).valueOf(),
            recordGroup: recordGroups[0],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025120206',
            title: '연말 선물',
            type: 'DAY',
            description: '연말 선물 준비 및 배송',
            startedAt: dayjs('2025-12-10').startOf('day').valueOf(),
            endedAt: dayjs('2025-12-10').endOf('day').valueOf(),
            recordGroup: recordGroups[2],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025120207',
            title: '연말 감사',
            type: 'TIME',
            description: '고객사 연말 감사 인사',
            startedAt: dayjs('2025-12-11').hour(10).minute(0).second(0).valueOf(),
            endedAt: dayjs('2025-12-11').hour(12).minute(0).second(0).valueOf(),
            recordGroup: recordGroups[0],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025120208',
            title: '연말 파티',
            type: 'MULTI_DAY',
            description: '연말 파티 및 팀 빌딩',
            startedAt: dayjs('2025-12-14').startOf('day').valueOf(),
            endedAt: dayjs('2025-12-15').endOf('day').valueOf(),
            recordGroup: recordGroups[2],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },

        // 2025년 12월 셋째 주 (12/15-12/21)
        {
            id: '2025120301',
            title: '연말 파티 준비',
            type: 'TIME',
            description: '연말 파티 기획 및 준비',
            startedAt: dayjs('2025-12-16').hour(15).minute(0).second(0).valueOf(),
            endedAt: dayjs('2025-12-16').hour(17).minute(0).second(0).valueOf(),
            recordGroup: recordGroups[2],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025120302',
            title: '보안 강화',
            type: 'DAY',
            description: '시스템 보안 강화 및 취약점 점검',
            startedAt: dayjs('2025-12-17').startOf('day').valueOf(),
            endedAt: dayjs('2025-12-17').endOf('day').valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025120303',
            title: '데이터 백업',
            type: 'TIME',
            description: '연말 데이터 백업 및 복구 테스트',
            startedAt: dayjs('2025-12-18').hour(20).minute(0).second(0).valueOf(),
            endedAt: dayjs('2025-12-18').hour(22).minute(0).second(0).valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025120304',
            title: '연말 정리',
            type: 'DAY',
            description: '사무실 정리 및 문서 정리',
            startedAt: dayjs('2025-12-16').startOf('day').valueOf(),
            endedAt: dayjs('2025-12-16').endOf('day').valueOf(),
            recordGroup: recordGroups[0],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025120305',
            title: '연말 감사',
            type: 'TIME',
            description: '고객사 연말 감사 인사',
            startedAt: dayjs('2025-12-17').hour(11).minute(0).second(0).valueOf(),
            endedAt: dayjs('2025-12-17').hour(13).minute(0).second(0).valueOf(),
            recordGroup: recordGroups[0],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025120306',
            title: '연말 선물',
            type: 'TIME',
            description: '연말 선물 준비 및 배송',
            startedAt: dayjs('2025-12-19').hour(14).minute(0).second(0).valueOf(),
            endedAt: dayjs('2025-12-19').hour(16).minute(0).second(0).valueOf(),
            recordGroup: recordGroups[2],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025120307',
            title: '연말 휴가',
            type: 'MULTI_DAY',
            description: '연말 휴가 및 휴식',
            startedAt: dayjs('2025-12-20').startOf('day').valueOf(),
            endedAt: dayjs('2025-12-21').endOf('day').valueOf(),
            recordGroup: recordGroups[2],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },

        // 2025년 12월 넷째 주 (12/22-12/28)
        {
            id: '2025120401',
            title: '연말 휴가',
            type: 'MULTI_DAY',
            description: '연말 휴가 및 휴식',
            startedAt: dayjs('2025-12-23').startOf('day').valueOf(),
            endedAt: dayjs('2025-12-27').endOf('day').valueOf(),
            recordGroup: recordGroups[2],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025120402',
            title: '연말 정리',
            type: 'TIME',
            description: '연말 업무 정리 및 문서 정리',
            startedAt: dayjs('2025-12-22').hour(9).minute(0).second(0).valueOf(),
            endedAt: dayjs('2025-12-22').hour(11).minute(0).second(0).valueOf(),
            recordGroup: recordGroups[0],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025120403',
            title: '연말 감사',
            type: 'TIME',
            description: '고객사 연말 감사 인사',
            startedAt: dayjs('2025-12-22').hour(14).minute(0).second(0).valueOf(),
            endedAt: dayjs('2025-12-22').hour(16).minute(0).second(0).valueOf(),
            recordGroup: recordGroups[0],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025120404',
            title: '연말 선물',
            type: 'DAY',
            description: '연말 선물 준비 및 배송',
            startedAt: dayjs('2025-12-28').startOf('day').valueOf(),
            endedAt: dayjs('2025-12-28').endOf('day').valueOf(),
            recordGroup: recordGroups[2],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2025120405',
            title: '연말 파티',
            type: 'MULTI_DAY',
            description: '연말 파티 및 팀 빌딩',
            startedAt: dayjs('2025-12-29').startOf('day').valueOf(),
            endedAt: dayjs('2025-12-30').endOf('day').valueOf(),
            recordGroup: recordGroups[2],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },

        // 2026년 1월 첫째 주 (1/5-1/11)
        {
            id: '2026010101',
            title: '신년 계획 수립',
            type: 'TIME',
            description: '2026년 신년 계획 수립 및 목표 설정',
            startedAt: dayjs('2026-01-06').hour(9).minute(0).second(0).valueOf(),
            endedAt: dayjs('2026-01-06').hour(11).minute(0).second(0).valueOf(),
            recordGroup: recordGroups[0],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2026010102',
            title: '신기술 도입',
            type: 'DAY',
            description: '새로운 기술 스택 도입 및 학습',
            startedAt: dayjs('2026-01-07').startOf('day').valueOf(),
            endedAt: dayjs('2026-01-07').endOf('day').valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2026010103',
            title: '팀 워크샵',
            type: 'MULTI_DAY',
            description: '팀 워크샵 및 협업 강화',
            startedAt: dayjs('2026-01-08').startOf('day').valueOf(),
            endedAt: dayjs('2026-01-09').endOf('day').valueOf(),
            recordGroup: recordGroups[2],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2026010104',
            title: '시스템 점검',
            type: 'TIME',
            description: '신년 시스템 점검 및 최적화',
            startedAt: dayjs('2026-01-10').hour(14).minute(0).second(0).valueOf(),
            endedAt: dayjs('2026-01-10').hour(16).minute(0).second(0).valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2026010105',
            title: '신년 목표',
            type: 'DAY',
            description: '2026년 신년 목표 설정 및 계획',
            startedAt: dayjs('2026-01-06').startOf('day').valueOf(),
            endedAt: dayjs('2026-01-06').endOf('day').valueOf(),
            recordGroup: recordGroups[0],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2026010106',
            title: '신기술 학습',
            type: 'TIME',
            description: '새로운 기술 스택 학습 및 실습',
            startedAt: dayjs('2026-01-07').hour(15).minute(0).second(0).valueOf(),
            endedAt: dayjs('2026-01-07').hour(17).minute(0).second(0).valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2026010107',
            title: '팀 워크샵',
            type: 'MULTI_DAY',
            description: '팀 워크샵 및 협업 강화',
            startedAt: dayjs('2026-01-08').startOf('day').valueOf(),
            endedAt: dayjs('2026-01-09').endOf('day').valueOf(),
            recordGroup: recordGroups[2],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2026010108',
            title: '신년 인사',
            type: 'TIME',
            description: '고객사 신년 인사 및 계획 공유',
            startedAt: dayjs('2026-01-10').hour(10).minute(0).second(0).valueOf(),
            endedAt: dayjs('2026-01-10').hour(12).minute(0).second(0).valueOf(),
            recordGroup: recordGroups[0],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },

        // 2026년 1월 둘째 주 (1/12-1/18)
        {
            id: '2026010201',
            title: '신규 프로젝트 시작',
            type: 'TIME',
            description: '2026년 첫 번째 프로젝트 킥오프',
            startedAt: dayjs('2026-01-13').hour(10).minute(0).second(0).valueOf(),
            endedAt: dayjs('2026-01-13').hour(12).minute(0).second(0).valueOf(),
            recordGroup: recordGroups[0],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2026010202',
            title: '개발 환경 구축',
            type: 'DAY',
            description: '새로운 개발 환경 구축 및 설정',
            startedAt: dayjs('2026-01-14').startOf('day').valueOf(),
            endedAt: dayjs('2026-01-14').endOf('day').valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2026010203',
            title: '코딩 스탠다드',
            type: 'TIME',
            description: '팀 코딩 스탠다드 수립 및 가이드 작성',
            startedAt: dayjs('2026-01-15').hour(9).minute(30).second(0).valueOf(),
            endedAt: dayjs('2026-01-15').hour(11).minute(30).second(0).valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2026010204',
            title: '사용자 리서치',
            type: 'MULTI_DAY',
            description: '사용자 니즈 조사 및 리서치',
            startedAt: dayjs('2026-01-16').startOf('day').valueOf(),
            endedAt: dayjs('2026-01-17').endOf('day').valueOf(),
            recordGroup: recordGroups[2],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2026010205',
            title: '신규 프로젝트 기획',
            type: 'DAY',
            description: '2026년 첫 번째 프로젝트 기획 및 설계',
            startedAt: dayjs('2026-01-13').startOf('day').valueOf(),
            endedAt: dayjs('2026-01-13').endOf('day').valueOf(),
            recordGroup: recordGroups[0],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2026010206',
            title: '개발 환경 구축',
            type: 'TIME',
            description: '새로운 개발 환경 구축 및 설정',
            startedAt: dayjs('2026-01-14').hour(16).minute(0).second(0).valueOf(),
            endedAt: dayjs('2026-01-14').hour(18).minute(0).second(0).valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2026010207',
            title: '코딩 스탠다드',
            type: 'MULTI_DAY',
            description: '팀 코딩 스탠다드 수립 및 가이드 작성',
            startedAt: dayjs('2026-01-15').startOf('day').valueOf(),
            endedAt: dayjs('2026-01-16').endOf('day').valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2026010208',
            title: '사용자 인터뷰',
            type: 'TIME',
            description: '사용자 인터뷰 및 피드백 수집',
            startedAt: dayjs('2026-01-18').hour(9).minute(0).second(0).valueOf(),
            endedAt: dayjs('2026-01-18').hour(11).minute(0).second(0).valueOf(),
            recordGroup: recordGroups[2],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },

        // 2026년 1월 셋째 주 (1/19-1/25)
        {
            id: '2026010301',
            title: '프로토타입 개발',
            type: 'DAY',
            description: 'MVP 프로토타입 개발',
            startedAt: dayjs('2026-01-20').startOf('day').valueOf(),
            endedAt: dayjs('2026-01-20').endOf('day').valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2026010302',
            title: '디자인 시스템',
            type: 'TIME',
            description: '디자인 시스템 구축 및 컴포넌트 개발',
            startedAt: dayjs('2026-01-21').hour(14).minute(0).second(0).valueOf(),
            endedAt: dayjs('2026-01-21').hour(16).minute(0).second(0).valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2026010303',
            title: '성능 테스트',
            type: 'TIME',
            description: '시스템 성능 테스트 및 최적화',
            startedAt: dayjs('2026-01-22').hour(10).minute(0).second(0).valueOf(),
            endedAt: dayjs('2026-01-22').hour(12).minute(0).second(0).valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2026010304',
            title: '고객 미팅',
            type: 'MULTI_DAY',
            description: '주요 고객사 미팅 및 요구사항 확인',
            startedAt: dayjs('2026-01-23').startOf('day').valueOf(),
            endedAt: dayjs('2026-01-24').endOf('day').valueOf(),
            recordGroup: recordGroups[0],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2026010305',
            title: '프로토타입 검토',
            type: 'DAY',
            description: 'MVP 프로토타입 검토 및 개선',
            startedAt: dayjs('2026-01-20').startOf('day').valueOf(),
            endedAt: dayjs('2026-01-20').endOf('day').valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2026010306',
            title: '디자인 시스템',
            type: 'TIME',
            description: '디자인 시스템 구축 및 컴포넌트 개발',
            startedAt: dayjs('2026-01-21').hour(9).minute(0).second(0).valueOf(),
            endedAt: dayjs('2026-01-21').hour(11).minute(0).second(0).valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2026010307',
            title: '성능 테스트',
            type: 'MULTI_DAY',
            description: '시스템 성능 테스트 및 최적화',
            startedAt: dayjs('2026-01-22').startOf('day').valueOf(),
            endedAt: dayjs('2026-01-23').endOf('day').valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2026010308',
            title: '고객 피드백',
            type: 'TIME',
            description: '고객 피드백 수집 및 분석',
            startedAt: dayjs('2026-01-25').hour(14).minute(0).second(0).valueOf(),
            endedAt: dayjs('2026-01-25').hour(16).minute(0).second(0).valueOf(),
            recordGroup: recordGroups[0],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },

        // 2026년 1월 넷째 주 (1/26-2/1)
        {
            id: '2026010401',
            title: '배포 준비',
            type: 'TIME',
            description: '프로덕션 배포 준비 및 체크리스트 검토',
            startedAt: dayjs('2026-01-27').hour(9).minute(0).second(0).valueOf(),
            endedAt: dayjs('2026-01-27').hour(11).minute(0).second(0).valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2026010402',
            title: '문서화',
            type: 'DAY',
            description: '프로젝트 문서화 및 사용자 가이드 작성',
            startedAt: dayjs('2026-01-28').startOf('day').valueOf(),
            endedAt: dayjs('2026-01-28').endOf('day').valueOf(),
            recordGroup: recordGroups[0],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2026010403',
            title: '최종 테스트',
            type: 'TIME',
            description: '최종 통합 테스트 및 버그 수정',
            startedAt: dayjs('2026-01-29').hour(14).minute(0).second(0).valueOf(),
            endedAt: dayjs('2026-01-29').hour(18).minute(0).second(0).valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2026010404',
            title: '런칭 준비',
            type: 'MULTI_DAY',
            description: '서비스 런칭 준비 및 마케팅',
            startedAt: dayjs('2026-01-30').startOf('day').valueOf(),
            endedAt: dayjs('2026-02-01').endOf('day').valueOf(),
            recordGroup: recordGroups[0],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2026010405',
            title: '배포 테스트',
            type: 'DAY',
            description: '프로덕션 배포 테스트 및 검증',
            startedAt: dayjs('2026-01-27').startOf('day').valueOf(),
            endedAt: dayjs('2026-01-27').endOf('day').valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2026010406',
            title: '문서화',
            type: 'TIME',
            description: '프로젝트 문서화 및 사용자 가이드 작성',
            startedAt: dayjs('2026-01-28').hour(10).minute(0).second(0).valueOf(),
            endedAt: dayjs('2026-01-28').hour(12).minute(0).second(0).valueOf(),
            recordGroup: recordGroups[0],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2026010407',
            title: '최종 테스트',
            type: 'MULTI_DAY',
            description: '최종 통합 테스트 및 버그 수정',
            startedAt: dayjs('2026-01-29').startOf('day').valueOf(),
            endedAt: dayjs('2026-01-30').endOf('day').valueOf(),
            recordGroup: recordGroups[1],
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: '2026010408',
            title: '런칭 이벤트',
            type: 'TIME',
            description: '서비스 런칭 이벤트 및 발표',
            startedAt: dayjs('2026-02-01').hour(14).minute(0).second(0).valueOf(),
            endedAt: dayjs('2026-02-01').hour(16).minute(0).second(0).valueOf(),
            recordGroup: recordGroups[0],
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
    ]
}

// 샘플 Worker 데이터 (로그인 안되어있을 때 사용)
export const createSampleWorkers = (): Worker[] => {
    const now = Date.now();
    return [
        {
            id: 'worker-sample-1',
            nickName: '김철수',
            phone: '010-1111-2222',
            email: 'kim.cheolsu@example.com',
            birthDate: now - 28 * 365 * 24 * 60 * 60 * 1000,
            gender: Worker_Gender.MALE,
            createdAt: now - 365 * 24 * 60 * 60 * 1000,
            updatedAt: now - 30 * 24 * 60 * 60 * 1000
        },
        {
            id: 'worker-sample-2',
            nickName: '이영희',
            phone: '010-2222-3333',
            email: 'lee.younghee@example.com',
            birthDate: now - 26 * 365 * 24 * 60 * 60 * 1000,
            gender: Worker_Gender.FEMALE,
            createdAt: now - 300 * 24 * 60 * 60 * 1000,
            updatedAt: now - 20 * 24 * 60 * 60 * 1000
        },
        {
            id: 'worker-sample-3',
            nickName: '박민수',
            phone: '010-3333-4444',
            email: 'park.minsu@example.com',
            birthDate: now - 32 * 365 * 24 * 60 * 60 * 1000,
            gender: Worker_Gender.MALE,
            createdAt: now - 500 * 24 * 60 * 60 * 1000,
            updatedAt: now - 15 * 24 * 60 * 60 * 1000
        },
        {
            id: 'worker-sample-4',
            nickName: '최지은',
            phone: '010-4444-5555',
            email: 'choi.jieun@example.com',
            birthDate: now - 24 * 365 * 24 * 60 * 60 * 1000,
            gender: Worker_Gender.FEMALE,
            createdAt: now - 200 * 24 * 60 * 60 * 1000,
            updatedAt: now - 10 * 24 * 60 * 60 * 1000
        },
        {
            id: 'worker-sample-5',
            nickName: '정대현',
            phone: '010-5555-6666',
            email: 'jung.daehyun@example.com',
            birthDate: now - 30 * 365 * 24 * 60 * 60 * 1000,
            gender: Worker_Gender.MALE,
            createdAt: now - 400 * 24 * 60 * 60 * 1000,
            updatedAt: now - 25 * 24 * 60 * 60 * 1000
        },
        {
            id: 'worker-sample-6',
            nickName: '한소영',
            phone: '010-6666-7777',
            email: 'han.soyoung@example.com',
            birthDate: now - 27 * 365 * 24 * 60 * 60 * 1000,
            gender: Worker_Gender.FEMALE,
            createdAt: now - 250 * 24 * 60 * 60 * 1000,
            updatedAt: now - 5 * 24 * 60 * 60 * 1000
        },
        {
            id: 'worker-sample-7',
            nickName: '윤성호',
            phone: '010-7777-8888',
            email: 'yoon.sungho@example.com',
            birthDate: now - 29 * 365 * 24 * 60 * 60 * 1000,
            gender: Worker_Gender.MALE,
            createdAt: now - 350 * 24 * 60 * 60 * 1000,
            updatedAt: now - 18 * 24 * 60 * 60 * 1000
        },
        {
            id: 'worker-sample-8',
            nickName: '강미래',
            phone: '010-8888-9999',
            email: 'kang.mirae@example.com',
            birthDate: now - 25 * 365 * 24 * 60 * 60 * 1000,
            gender: Worker_Gender.FEMALE,
            createdAt: now - 180 * 24 * 60 * 60 * 1000,
            updatedAt: now - 8 * 24 * 60 * 60 * 1000
        },
        {
            id: 'worker-sample-9',
            nickName: '나규태',
            phone: '010-1111-2222',
            email: 'kim.cheolsu@example.com',
            birthDate: now - 28 * 365 * 24 * 60 * 60 * 1000,
            gender: Worker_Gender.MALE,
            createdAt: now - 365 * 24 * 60 * 60 * 1000,
            updatedAt: now - 30 * 24 * 60 * 60 * 1000
        },
        {
            id: 'worker-sample-10',
            nickName: '최보영',
            phone: '010-1111-2222',
            email: 'kim.cheolsu@example.com',
            birthDate: now - 28 * 365 * 24 * 60 * 60 * 1000,
            gender: Worker_Gender.MALE,
            createdAt: now - 365 * 24 * 60 * 60 * 1000,
            updatedAt: now - 30 * 24 * 60 * 60 * 1000
        },
        {
            id: 'worker-sample-11',
            nickName: '최진원',
            phone: '010-1111-2222',
            email: 'kim.cheolsu@example.com',
            birthDate: now - 28 * 365 * 24 * 60 * 60 * 1000,
            gender: Worker_Gender.MALE,
            createdAt: now - 365 * 24 * 60 * 60 * 1000,
            updatedAt: now - 30 * 24 * 60 * 60 * 1000
        },
        {
            id: 'worker-sample-12',
            nickName: '최윤영',
            phone: '010-1111-2222',
            email: 'kim.cheolsu@example.com',
            birthDate: now - 28 * 365 * 24 * 60 * 60 * 1000,
            gender: Worker_Gender.MALE,
            createdAt: now - 365 * 24 * 60 * 60 * 1000,
            updatedAt: now - 30 * 24 * 60 * 60 * 1000
        },
        {
            id: 'worker-sample-13',
            nickName: '최봉준',
            phone: '010-1111-2222',
            email: 'kim.cheolsu@example.com',
            birthDate: now - 28 * 365 * 24 * 60 * 60 * 1000,
            gender: Worker_Gender.MALE,
            createdAt: now - 365 * 24 * 60 * 60 * 1000,
            updatedAt: now - 30 * 24 * 60 * 60 * 1000
        },
    ];
};

// 샘플 RecordGroupDetailResponse 데이터 (로그인 안되어있을 때 사용)
export const createSampleRecordGroupDetails = (recordGroup: RecordGroup | null): RecordGroupDetailResponse | null => {
    if (!recordGroup) {
        return null;
    }
    
    // 일부 샘플 워커를 공유 멤버로 설정 (3-5명 정도)
    const sampleWorkers = createSampleWorkers();
    const sharedWorkers = sampleWorkers.slice(0, 4); // 처음 4명을 공유 멤버로
    
    return {
        groups: recordGroup,
        workers: sharedWorkers
    };
};
