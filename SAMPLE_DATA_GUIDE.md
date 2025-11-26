# 샘플 데이터 가이드

이 문서는 로그인하지 않은 사용자에게 표시될 샘플 데이터의 구조와 요구사항을 정리한 가이드입니다.

## 목차
1. [기록 관리 샘플 데이터](#기록-관리-샘플-데이터)
2. [이력 관리 샘플 데이터](#이력-관리-샘플-데이터)
3. [이직 관리 샘플 데이터](#이직-관리-샘플-데이터)
4. [데이터 생성 함수 구조](#데이터-생성-함수-구조)

---

## 기록 관리 샘플 데이터

### 파일 위치
- `src/utils/sampleRecordData.ts`

### 기록장 (RecordGroup)

#### 요구사항
- **개인 기록장**: 1개
  - 타입: `RecordGroup_RecordGroupType.PRIVATE`
  - 기본 기록장 여부: 선택 가능
  - 색상: 임의 지정

- **공유 기록장**: 1개
  - 타입: `RecordGroup_RecordGroupType.SHARED`
  - 기본 기록장 여부: `false`
  - 색상: 임의 지정
  - 공유 멤버: 샘플 Worker 데이터 포함

#### 함수
- `createSampleRecordGroups()`: 기록장 배열 반환
- `createSampleRecordGroupDetails(recordGroup)`: 기록장 상세 정보 반환 (공유 멤버 포함)

### 기록 (Record)

#### 요구사항
- **기간**: 현재 날짜 기준
  - 이전 한 달 (현재 월 - 1개월)
  - 현재 한 달 (현재 월)
  - 다음 한 달 (현재 월 + 1개월)

- **기록 타입 분포**:
  - **시간 단위 (TIME)**: 특정 시간대에 시작/종료되는 기록
    - 예: 회의, 미팅, 작업 등
    - `startedAt`, `endedAt`에 시간 정보 포함
    - 하루 종일이 아닌 특정 시간대 기록
  
  - **단일 일자 (DAY)**: 하루 종일 기록
    - 예: 출장, 휴가, 이벤트 등
    - `startedAt`: 해당 날짜 00:00:00
    - `endedAt`: 해당 날짜 23:59:59
  
  - **여러 일자 (MULTI_DAY)**: 여러 날에 걸친 기록
    - 예: 프로젝트, 출장, 교육 등
    - `startedAt`: 시작 날짜 00:00:00
    - `endedAt`: 종료 날짜 23:59:59
    - 최소 2일 이상의 기간

- **기록 분포**:
  - 각 기록장별로 균등하게 분배
  - 주간/월간/목록 뷰에서 모두 표시 가능하도록 구성
  - 주간 뷰: 시간 단위 기록이 주로 표시
  - 월간 뷰: 모든 타입의 기록이 표시
  - 목록 뷰: 모든 타입의 기록이 시간순으로 표시

- **기록 내용**:
  - 제목: 다양한 업무/일정 관련 제목
  - 설명: 상세한 내용 포함
  - 기록장: 개인 기록장 또는 공유 기록장에 균등 분배

#### 함수
- `createSampleRecords(recordGroups)`: 기록 배열 반환
  - 파라미터: `recordGroups` - 기록장 배열
  - 반환: Record 배열 (현재 날짜 기준 동적 생성)

#### 데이터 구조 예시
```typescript
{
  id: string,
  title: string,
  type: 'TIME' | 'DAY' | 'MULTI_DAY',
  description: string,
  startedAt: number, // timestamp
  endedAt: number, // timestamp
  recordGroup: RecordGroup,
  createdAt: number,
  updatedAt: number
}
```

---

## 이력 관리 샘플 데이터

### 파일 위치
- `src/utils/sampleCareerData.ts`

### 이력서 (Resume)

#### 요구사항
- **이력서 개수**: 3개
- **각 이력서별 구성**:
  - 기본 정보 (이름, 연락처, 생년월일, 성별, 직무, 자기소개 등)
  - 학력 (Education): 1~3개
  - 경력 (Career): 2~4개
  - 프로젝트 (Project): 2~5개
  - 활동 (Activity): 1~4개
  - 언어 (LanguageSkill): 1~3개
  - 언어 시험 (LanguageTest): 0~2개
  - 첨부파일 (Attachment): 0~3개

- **다양성**:
  - 각 이력서는 서로 다른 직무/경력/학력으로 구성
  - 경력 기간이 겹치지 않도록 구성
  - 프로젝트는 다양한 기술 스택과 역할 포함
  - 활동은 다양한 유형 (봉사, 동아리, 수상 등) 포함
  - 언어는 다양한 언어와 수준 포함

- **기본 이력서**:
  - 3개 중 1개는 `isDefault: true`로 설정

#### 함수
- `createSampleResume2()`, `createSampleResume3()`, `createSampleResume4()`: 각 이력서 데이터 반환
- `createAllSampleResumes()`: 모든 이력서 배열 반환

#### 데이터 구조
각 이력서는 다음 구조를 포함:
```typescript
{
  resume: Resume,
  careers: Career[],
  educations: Education[],
  projects: Project[],
  activities: Activity[],
  languageSkills: LanguageSkill[],
  languageTests?: LanguageTest[],
  attachments?: Attachment[]
}
```

### 학력 (Education)

#### 요구사항
- 각 이력서별 1~3개
- 다양한 학교 유형 (대학교, 대학원, 전문대 등)
- 다양한 전공
- 졸업 상태 다양 (졸업, 재학, 휴학 등)

### 경력 (Career)

#### 요구사항
- 각 이력서별 2~4개
- 고용 형태 다양 (정규직, 계약직, 인턴 등)
- 직급 다양 (주임, 대리, 과장, 차장, 부장, 책임 등)
- 연봉 정보 포함 (Salary 배열)
- 재직 기간이 겹치지 않도록 구성
- 최소 1개는 현재 재직 중 (`isWorking: true`)

### 프로젝트 (Project)

#### 요구사항
- 각 이력서별 2~5개
- 다양한 프로젝트 유형 (웹, 모바일, AI, 데이터 분석 등)
- 다양한 기술 스택
- 역할 다양 (PM, 개발자, 디자이너 등)
- 기간 다양 (단기, 중기, 장기)

### 활동 (Activity)

#### 요구사항
- 각 이력서별 1~4개
- 활동 유형 다양:
  - 봉사활동
  - 동아리/모임
  - 수상 경력
  - 강의/세미나
  - 기타 활동

### 언어 (LanguageSkill)

#### 요구사항
- 각 이력서별 1~3개
- 다양한 언어 (영어, 중국어, 일본어, 스페인어 등)
- 다양한 수준 (초급, 중급, 고급, 원어민 수준 등)

### 언어 시험 (LanguageTest)

#### 요구사항
- 각 이력서별 0~2개
- 다양한 시험 종류 (TOEIC, TOEFL, IELTS, OPIc 등)
- 점수/등급 다양

### 첨부파일 (Attachment)

#### 요구사항
- 각 이력서별 0~3개
- 다양한 파일 유형 (포트폴리오, 인증서, 수상증명서 등)
- 다양한 카테고리

---

## 이직 관리 샘플 데이터

### 파일 위치
- `src/utils/sampleTurnOverData.ts`

### 이직 활동 (TurnOverDetail)

#### 요구사항
- **총 개수**: 5개
- **상태 분포**:
  - **완료 건**: 4개
  - **진행 중**: 1개

#### 완료 건 (4개)

##### 목표 (TurnOverGoal)
- 이직 이유 (`reason`): 구체적이고 현실적인 이유
- 목표 (`goal`): 명확한 목표 설정
- 자기소개서 (`selfIntroductions`): 2~4개
  - 다양한 질문에 대한 답변
  - 질문: 지원 동기, 강점/약점, 입사 후 포부 등
- 면접 질문 (`interviewQuestions`): 3~6개
  - 기술 질문과 답변
  - 다양한 주제 (기술, 인성, 상황 대응 등)
- 체크리스트 (`checkList`): 5~10개
  - 대부분 체크 완료 (`checked: true`)
  - 일부 미완료 가능

##### 도전 (TurnOverChallenge)
- **지원 기록 (JobApplication)**: 10~30개 (랜덤)
  - 각 지원 기록은 다양한 상태 포함:
    - 서류 전형
    - 코딩 테스트
    - 1차 면접
    - 2차 면접
    - 최종 면접
    - 합격/불합격
  - 회사명 다양
  - 지원 날짜 다양 (과거부터 현재까지)
  - 상태별 분포:
    - 서류 전형: 다수
    - 면접 단계: 중간
    - 최종 합격: 1개 (최종 선택 회사)
  - 각 단계별 상세 정보 포함:
    - 면접 질문과 답변
    - 코딩 테스트 문제와 풀이
    - 피드백 등

##### 회고 (TurnOverRetrospective)
- **필수**: 최종 선택 회사 정보 포함
  - 회사명 (`finalCompanyName`)
  - 고용 형태 (`employmentType`)
  - 입사 예정일 또는 입사일
  - 최종 연봉 (`finalSalary`)
  - 선택 이유 (`reason`)
- 이직 과정 회고 (`reflection`)
- 배운 점 (`lessons`)
- 아쉬운 점 (`regrets`)
- 조언 (`advice`)

#### 진행 중 건 (1개)

##### 목표 (TurnOverGoal)
- 이직 이유와 목표 설정 완료
- 자기소개서: 1~3개 (작성 중)
- 면접 질문: 1~3개 (준비 중)
- 체크리스트: 일부만 완료

##### 도전 (TurnOverChallenge)
- **지원 기록**: 5개
  - 대부분 서류 전형 단계
  - 일부 면접 진행 중
  - 최종 합격 없음

##### 회고 (TurnOverRetrospective)
- **없음**: 진행 중이므로 회고 데이터 없음

#### 함수
- `createSampleTurnOver1()` ~ `createSampleTurnOver5()`: 각 이직 활동 데이터 반환
- `createAllSampleTurnOvers()`: 모든 이직 활동 배열 반환

#### 데이터 구조
```typescript
{
  id: string,
  name: string, // 이직 활동 제목
  turnOverGoal: TurnOverGoalDetail | null,
  turnOverChallenge: TurnOverChallengeDetail | null,
  turnOverRetrospective: TurnOverRetrospectiveDetail | null, // 완료 건만 포함
  createdAt: number,
  updatedAt: number
}
```

---

## 데이터 생성 함수 구조

### 기록 관리

#### `createSampleRecordGroups()`
- **반환**: `RecordGroup[]`
- **개수**: 2개 (개인 1개, 공유 1개)
- **용도**: 기록장 목록 표시

#### `createSampleRecords(recordGroups)`
- **파라미터**: `recordGroups: RecordGroup[]`
- **반환**: `Record[]`
- **특징**: 
  - 현재 날짜 기준 동적 생성
  - 이전/현재/다음 한 달 데이터
  - 시간/단일/여러일자 단위 다양하게 구성

#### `createSampleRecordGroupDetails(recordGroup)`
- **파라미터**: `recordGroup: RecordGroup | undefined`
- **반환**: `RecordGroupDetailResponse | undefined`
- **용도**: 기록장 상세 정보 (공유 멤버 포함)

### 이력 관리

#### `createSampleResume2()`, `createSampleResume3()`, `createSampleResume4()`
- **반환**: `{ resume, careers, educations, projects, activities, languageSkills, attachments }`
- **용도**: 각 이력서의 전체 데이터 반환

#### `createAllSampleResumes()`
- **반환**: 이력서 데이터 배열
- **용도**: 모든 샘플 이력서 반환

### 이직 관리

#### `createSampleTurnOver1()` ~ `createSampleTurnOver5()`
- **반환**: `TurnOverDetail`
- **용도**: 각 이직 활동 데이터 반환
- **구성**:
  - TurnOver1: 진행 중 (회고 없음)
  - TurnOver2~5: 완료 (회고 포함, 지원 기록 10~30개)

#### `createAllSampleTurnOvers()`
- **반환**: `TurnOverDetail[]`
- **용도**: 모든 샘플 이직 활동 반환

---

## 데이터 생성 원칙

### 1. 현실성
- 실제 사용자가 입력할 수 있는 수준의 현실적인 데이터
- 회사명, 직무, 기술 스택 등은 실제 존재하는 것과 유사하게
- 날짜와 기간은 논리적으로 구성

### 2. 다양성
- 각 카테고리별로 다양한 유형의 데이터 포함
- 단조롭지 않도록 다양한 패턴과 조합

### 3. 일관성
- 같은 이력서 내의 데이터는 일관성 유지
- 경력 기간이 겹치지 않도록
- 날짜 순서가 논리적으로

### 4. 완전성
- 필수 필드는 모두 채워짐
- 선택 필드는 다양하게 구성
- 빈 배열보다는 최소 1개 이상의 데이터 포함

### 5. 동적 생성
- 기록 데이터는 현재 날짜 기준으로 동적 생성
- 고정된 날짜가 아닌 상대적 날짜 사용
- `dayjs`를 활용한 날짜 계산

---

## 구현 시 주의사항

### 기록 데이터
1. 현재 날짜를 기준으로 이전/현재/다음 한 달 계산
2. 주간 뷰에서는 시간 단위 기록이 잘 보이도록 구성
3. 월간 뷰에서는 모든 타입의 기록이 균등하게 분포
4. 목록 뷰에서는 시간순 정렬이 자연스럽도록

### 이력서 데이터
1. 각 이력서는 서로 다른 직무/경력으로 구성
2. 경력 기간이 논리적으로 연결되도록
3. 프로젝트와 경력의 기술 스택이 일관성 있도록
4. 기본 이력서는 가장 완성도 높은 것으로 설정

### 이직 활동 데이터
1. 완료 건은 반드시 회고 데이터 포함
2. 완료 건의 최종 선택 회사는 도전 탭의 지원 기록 중 하나와 일치
3. 진행 중 건은 회고 데이터 없음
4. 지원 기록 개수는 랜덤하되 10~30개 범위 내
5. 진행 중 건은 5개로 고정

---

## 기존 데이터 활용

기존 `sampleRecordData.ts`, `sampleCareerData.ts`, `sampleTurnOverData.ts` 파일에 이미 샘플 데이터가 있으므로, 이를 참고하여 새로운 구조에 맞게 재구성합니다.

### 기존 데이터 확인
- 기록 데이터: 2025년 10월~11월 고정 데이터 존재
- 이력서 데이터: 11개의 샘플 이력서 존재
- 이직 활동 데이터: 5개의 샘플 이직 활동 존재

### 재구성 방향
1. 기존 데이터의 구조와 패턴을 유지
2. 요구사항에 맞게 개수와 구성 조정
3. 현재 날짜 기준으로 동적 생성하도록 변경 (기록 데이터)
4. 데이터의 다양성과 현실성 유지

---

## 업데이트 이력

- 2025-01-XX: 초기 문서 작성

