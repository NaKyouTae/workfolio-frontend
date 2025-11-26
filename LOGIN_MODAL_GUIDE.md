# 로그인 팝업 가이드

이 문서는 로그인하지 않은 사용자가 특정 기능을 사용하려고 할 때 로그인 팝업이 표시되는 모든 영역을 정리한 가이드입니다.

## 목차
1. [헤더](#헤더)
2. [기록 관리](#기록-관리)
3. [이력 관리](#이력-관리)
4. [이직 관리](#이직-관리)
5. [마이페이지](#마이페이지)

---

## 헤더

### 위치
- **파일**: `src/components/portal/layouts/Header.tsx`

### 로그인 팝업이 표시되는 경우
1. **로그인 버튼 클릭**
   - 로그인하지 않은 사용자가 헤더의 "로그인" 버튼 클릭 시
   - 함수: `handleLoginClick`

2. **마이페이지 링크 클릭**
   - 로그인하지 않은 사용자가 헤더의 "마이페이지" 링크 클릭 시
   - 함수: `handleMypageClick`

---

## 기록 관리

### 1. 기록장 관리

#### 기록장 생성
- **파일**: 
  - `src/components/portal/features/records/sidebar/record-groups/record-groups-owned/RecordGroupsOwned.tsx` (개인 기록장)
  - `src/components/portal/features/records/sidebar/record-groups/record-groups-shard/RecordGroupsShared.tsx` (공유 기록장)
- **함수**: `handleCreateGroupRequest`, `createRecordGroup`
- **동작**: 기록장 추가 버튼 클릭 시 또는 기록장 생성 시

#### 기록장 이름 변경
- **파일**: `src/components/portal/features/records/sidebar/record-groups/RecordGroupItem.tsx`
- **함수**: 기록장 이름 변경 버튼 클릭 시
- **동작**: "기록장 이름 변경" 버튼 클릭 시

#### 기록장 삭제
- **파일**: 
  - `src/components/portal/features/records/sidebar/record-groups/RecordGroups.tsx` (사이드바)
  - `src/components/portal/features/records/sidebar/records-config/RecordPrivateGroupManagement.tsx` (개인 기록장)
  - `src/components/portal/features/records/sidebar/records-config/RecordSharedGroupManagement.tsx` (공유 기록장)
  - `src/components/portal/features/records/sidebar/records-config/detail/RecordGroupDetailManagement.tsx` (기록장 설정)
- **함수**: `deleteRecordGroup`, `handleDelete`
- **동작**: 기록장 삭제 버튼 클릭 시

#### 기록장 설정 저장
- **파일**: `src/components/portal/features/records/sidebar/records-config/detail/RecordGroupDetailManagement.tsx`
- **함수**: `handleSave`
- **동작**: 기록장 설정에서 "저장하기" 버튼 클릭 시

#### 기록장 탈퇴
- **파일**: `src/components/portal/features/records/sidebar/records-config/detail/RecordGroupDetailManagement.tsx`
- **함수**: `handleLeave`
- **동작**: 공유 기록장에서 "탈퇴하기" 버튼 클릭 시

### 2. 기록 설정

#### 기록 설정 저장
- **파일**: `src/components/portal/features/records/sidebar/records-config/RecordConfig.tsx`
- **함수**: `handleSave`
- **동작**: 기록 설정에서 "저장하기" 버튼 클릭 시

### 3. 기록 생성

#### 사이드바에서 기록 생성
- **파일**: `src/components/portal/features/records/sidebar/SidebarButton.tsx`
- **함수**: `openRecordCreateModal`
- **동작**: "신규 기록 추가" 버튼 클릭 시

#### 주간 뷰에서 기록 생성
- **파일**: `src/components/portal/features/records/calendar/weekly/WeeklyCalendar.tsx`
- **함수**: `handleSubSlotClick`
- **동작**: 시간 슬롯 클릭 시 또는 하루 종일 영역 클릭 시

#### 월간 뷰에서 기록 생성
- **파일**: `src/components/portal/features/records/calendar/monthly/MonthlyCalendar.tsx`
- **함수**: `handleEmptyRecordClick`
- **동작**: 빈 날짜 영역 클릭 시

#### 목록 뷰에서 기록 생성
- **파일**: `src/components/portal/features/records/calendar/list/ListCalendar.tsx`
- **함수**: `handleOpenCreateModal`
- **동작**: 기록 생성 버튼 클릭 시

### 4. 기록 수정

#### 기록 상세에서 수정
- **파일**: `src/components/portal/features/records/modal/RecordDetail.tsx`
- **함수**: 수정 버튼 클릭 핸들러
- **동작**: 기록 상세 모달에서 "수정" 버튼 클릭 시

### 5. 기록 삭제

#### 기록 상세에서 삭제
- **파일**: `src/components/portal/features/records/modal/RecordDetail.tsx`
- **함수**: 삭제 버튼 클릭 핸들러
- **동작**: 기록 상세 모달에서 "삭제" 버튼 클릭 시

#### 기록 수정 모달에서 삭제
- **파일**: `src/components/portal/features/records/modal/RecordUpdateModal.tsx`
- **함수**: 삭제 버튼 클릭 핸들러
- **동작**: 기록 수정 모달에서 "삭제" 버튼 클릭 시

#### 주간 뷰에서 삭제
- **파일**: `src/components/portal/features/records/calendar/weekly/WeeklyCalendar.tsx`
- **함수**: `handleDeleteRecord`
- **동작**: 기록 삭제 버튼 클릭 시

#### 월간 뷰에서 삭제
- **파일**: `src/components/portal/features/records/calendar/monthly/MonthlyCalendar.tsx`
- **함수**: `handleDeleteRecord`
- **동작**: 기록 삭제 버튼 클릭 시

#### 목록 뷰에서 삭제
- **파일**: `src/components/portal/features/records/calendar/list/ListCalendar.tsx`
- **함수**: `handleDeleteRecord`
- **동작**: 기록 삭제 버튼 클릭 시

#### 검색 결과에서 삭제
- **파일**: `src/components/portal/features/records/search/RecordSearch.tsx`
- **함수**: `handleDeleteRecord`
- **동작**: 검색 결과에서 기록 삭제 버튼 클릭 시

---

## 이력 관리

### 1. 이력서 목록

#### 이력서 생성
- **파일**: `src/components/portal/features/careers/CareerSidebar.tsx`
- **함수**: `handleResumeCreated`
- **동작**: "신규 이력 추가" 버튼 클릭 시

#### 이력서 편집
- **파일**: `src/components/portal/features/careers/CareerIntegration.tsx`
- **함수**: `handleEdit`
- **동작**: 이력서 목록에서 "편집" 버튼 클릭 시

#### 이력서 복제
- **파일**: `src/components/portal/features/careers/CareerIntegration.tsx`
- **함수**: `handleDuplicate`
- **동작**: 이력서 목록에서 "복제" 버튼 클릭 시

#### 이력서 삭제
- **파일**: `src/components/portal/features/careers/CareerIntegration.tsx`
- **함수**: `handleDelete`
- **동작**: 이력서 목록에서 "삭제" 버튼 클릭 시

#### 기본 이력 변경
- **파일**: `src/components/portal/features/careers/CareerIntegration.tsx`
- **함수**: `handleChangeDefault`
- **동작**: 이력서 목록에서 라디오 버튼 또는 라벨 클릭 시

### 2. 이력서 상세

#### 이력서 편집
- **파일**: `src/components/portal/features/careers/CareerContentView.tsx`
- **함수**: `handleEdit`
- **동작**: 이력서 상세 페이지에서 "편집" 버튼 클릭 시

#### 이력서 복제
- **파일**: `src/components/portal/features/careers/CareerContentView.tsx`
- **함수**: `handleDuplicateResume`
- **동작**: 이력서 상세 페이지에서 "복제" 버튼 클릭 시

#### 이력서 삭제
- **파일**: `src/components/portal/features/careers/CareerContentView.tsx`
- **함수**: `handleDeleteResume`
- **동작**: 이력서 상세 페이지에서 "삭제" 버튼 클릭 시

#### 기본 이력 변경
- **파일**: `src/components/portal/features/careers/CareerContentView.tsx`
- **함수**: `handleChangeDefault`
- **동작**: 이력서 상세 페이지에서 기본 이력 체크박스 클릭 시

### 3. 이력서 편집/생성

#### 이력서 편집 저장
- **파일**: `src/components/portal/features/careers/CareerContentEdit.tsx`
- **함수**: `handleSaveAll`
- **동작**: 이력서 편집 페이지에서 "저장하기" 버튼 클릭 시

#### 이력서 생성 저장
- **파일**: `src/components/portal/features/careers/CareerContentCreate.tsx`
- **함수**: `handleSaveAll`
- **동작**: 이력서 생성 페이지에서 "저장하기" 버튼 클릭 시

---

## 이직 관리

### 1. 이직 활동 목록

#### 이직 활동 생성
- **파일**: `src/components/portal/features/turn-overs/TurnOversSidebar.tsx`
- **함수**: `handleTurnOverCreated`
- **동작**: "신규 이직 추가" 버튼 클릭 시

#### 이직 활동 편집
- **파일**: `src/components/portal/features/turn-overs/content/TurnOversIntegration.tsx`
- **함수**: `handleEdit`
- **동작**: 이직 활동 목록에서 "편집" 버튼 클릭 시

#### 이직 활동 복제
- **파일**: `src/components/portal/features/turn-overs/content/TurnOversIntegration.tsx`
- **함수**: `handleDuplicate`
- **동작**: 이직 활동 목록에서 "복제" 버튼 클릭 시

#### 이직 활동 삭제
- **파일**: `src/components/portal/features/turn-overs/content/TurnOversIntegration.tsx`
- **함수**: `handleDelete`
- **동작**: 이직 활동 목록에서 "삭제" 버튼 클릭 시

### 2. 이직 활동 상세

#### 이직 활동 편집
- **파일**: `src/components/portal/features/turn-overs/content/TurnOverContentViewHeader.tsx`
- **함수**: `handleEdit`
- **동작**: 이직 활동 상세 페이지에서 "편집" 버튼 클릭 시
- **참고**: 모달은 상위 컴포넌트(`TurnOversContent`)에서 관리

#### 체크리스트 클릭
- **파일**: `src/components/portal/features/turn-overs/content/view/common/CheckListView.tsx`
- **함수**: `handleCheckboxChange`
- **동작**: 체크리스트 항목 클릭 시
- **참고**: `alert` 대신 `useNotification` 사용

### 3. 이직 활동 편집/생성

#### 이직 활동 편집 저장
- **파일**: `src/components/portal/features/turn-overs/TurnOversContent.tsx`
- **함수**: `handleSave`
- **동작**: 이직 활동 편집 페이지에서 저장 시

#### 이직 활동 복제
- **파일**: `src/components/portal/features/turn-overs/TurnOversContent.tsx`
- **함수**: `handleDuplicate`
- **동작**: 이직 활동 복제 버튼 클릭 시

#### 이직 활동 삭제
- **파일**: `src/components/portal/features/turn-overs/TurnOversContent.tsx`
- **함수**: `handleDelete`
- **동작**: 이직 활동 삭제 버튼 클릭 시

---

## 마이페이지

### 마이페이지 접근
- **파일**: `src/app/mypage/page.tsx`
- **함수**: `useEffect` (컴포넌트 마운트 시)
- **동작**: 마이페이지 접근 시 자동으로 로그인 체크 후 팝업 표시

---

## 공통 사항

### 로그인 체크 함수
- **파일**: `src/utils/authUtils.ts`
- **함수**: `isLoggedIn()`
- **설명**: `accessToken` 쿠키 존재 여부를 확인하여 로그인 상태를 판단

### 로그인 모달 컴포넌트
- **파일**: `src/components/portal/ui/LoginModal.tsx`
- **기능**: 
  - 카카오 로그인 연동
  - ESC 키로 닫기 지원
  - 로그인 성공 시 자동 닫기 및 페이지 새로고침

### 사용 패턴
```typescript
const [showLoginModal, setShowLoginModal] = useState(false);

const handleAction = () => {
  if (!isLoggedIn()) {
    setShowLoginModal(true);
    return;
  }
  // 로그인된 경우 실제 액션 수행
};

// JSX
<LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
```
