import React, { useState, useEffect, useRef } from 'react';
import CareerSidebar from './CareerSidebar';
import CareerHome from './CareerHome';
import { useUser } from '@/hooks/useUser';
import { useResumeDetails } from '@/hooks/useResumeDetails';
import { ResumeDetail } from '@/generated/common';
import CareerContentView from './CareerContentView';
import CareerContentEdit from './CareerContentEdit';
import CareerContentCreate from './CareerContentCreate';

const CareerPage: React.FC = () => {
  // 사용자 인증 상태
  const { user, isLoading: userLoading, fetchUser } = useUser();

  // 이력서 목록 관리
  const { 
    resumeDetails, 
    isLoading, 
    fetchResumeDetails,
    refreshResumeDetails,
    duplicateResume,
    deleteResume,
    exportPDF,
    copyURL,
    calculateTotalCareer,
  } = useResumeDetails();

  // 선택된 이력서
  const [selectedResumeDetail, setSelectedResumeDetail] = useState<ResumeDetail | null>(null);
  
  // 편집 모드 상태
  const [isEditMode, setIsEditMode] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);

  // 편집 모드 진입 위치 추적 ('home' | 'view')
  const [editFrom, setEditFrom] = useState<'home' | 'view'>('view');

  // 초기 로드 여부를 추적하는 ref
  const userFetchAttempted = useRef(false);
  
  // 편집 완료 후 강제 업데이트를 위한 ref
  const forceUpdateAfterSave = useRef(false);

  // 컴포넌트 마운트 시 사용자 정보 가져오기
  useEffect(() => {
    if (!user && !userLoading && !userFetchAttempted.current) {
      console.log('Fetching user information...');
      userFetchAttempted.current = true;
      fetchUser().catch(error => {
        console.error('Failed to fetch user:', error);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchResumeDetails();
  }, [fetchResumeDetails]);

  // resumeDetails가 업데이트되면 selectedResumeDetail도 업데이트
  useEffect(() => {
    if (selectedResumeDetail && resumeDetails.length > 0) {
      const updatedResume = resumeDetails.find(r => r.id === selectedResumeDetail.id);
      if (updatedResume) {
        // 편집 완료 후이거나 updatedAt이 다른 경우 업데이트
        if (forceUpdateAfterSave.current || updatedResume.updatedAt !== selectedResumeDetail.updatedAt) {
          setSelectedResumeDetail(updatedResume);
          forceUpdateAfterSave.current = false; // 플래그 리셋
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeDetails]);

  // 이력서 상세 보기 (View 모드)
  const viewResumeDetail = (resumeDetail: ResumeDetail) => {
    setSelectedResumeDetail(resumeDetail);
    setIsEditMode(false);
  };

  // 이력서 편집 (Edit 모드) - Home에서 진입
  const editResumeDetail = (resumeDetail: ResumeDetail) => {
    setSelectedResumeDetail(resumeDetail);
    setIsEditMode(true);
    setEditFrom('home'); // Home에서 왔음을 기록
  };

  // 편집 모드 토글 - View에서 진입
  const toggleEditMode = () => {
    setIsEditMode(prev => !prev);
    setEditFrom('view'); // View에서 왔음을 기록
  };

  // 편집 완료 (저장 후 View 모드로 전환)
  const handleEditComplete = async () => {
    setIsEditMode(false);
    forceUpdateAfterSave.current = true; // 강제 업데이트 플래그 설정
    await refreshResumeDetails();
  };

  // 편집 취소 (이전 화면으로 복귀)
  const handleEditCancel = () => {
    if (editFrom === 'home') {
      // Home에서 왔으면 Home으로 복귀
      goHome();
    } else {
      // View에서 왔으면 View 모드로 전환
      setIsEditMode(false);
      setIsCreateMode(false);
    }
  };

  // 삭제 성공 후 홈으로 이동
  const handleDeleteSuccess = async () => {
    await refreshResumeDetails();
    goHome();
  };

  // 이력서 홈으로 이동
  const goHome = () => {
    setSelectedResumeDetail(null);
    setIsEditMode(false);
  };

  // 이력서 생성 모드
  const handleResumeCreated = () => {
    setIsCreateMode(true);
  };

  // 이력서 생성 완료 후 모드 종료
  const handleResumeCreatedSuccess = async () => {
    setIsEditMode(false);
    setIsCreateMode(false);
    await refreshResumeDetails();
  };

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        로딩 중...
      </div>
    );
  }

  // 메인 뷰
  return (
    <main style={{ display: 'flex', height: 'calc(100vh - 6.4rem)', backgroundColor: '#f8f9fa' }}>
      <CareerSidebar 
        resumeDetails={resumeDetails}
        selectedResumeDetail={selectedResumeDetail || null}
        onResumeSelect={viewResumeDetail}
        onResumeCreated={handleResumeCreated}
        onGoHome={goHome}
      />
      
      {/* 이력서 홈 (목록) */}
      {!selectedResumeDetail && !isCreateMode && (
        <CareerHome 
          resumeDetails={resumeDetails}
          onEdit={editResumeDetail}
          duplicateResume={(resumeId) => duplicateResume(resumeId, handleDeleteSuccess)}
          deleteResume={(resumeId) => deleteResume(resumeId, handleDeleteSuccess)}
          exportPDF={exportPDF}
          copyURL={copyURL}
          calculateTotalCareer={calculateTotalCareer}
        />
      )}
      
      {/* 이력서 상세 보기 (View 모드) */}
      {selectedResumeDetail && !isEditMode && !isCreateMode && (
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          overflow: 'hidden',
          backgroundColor: '#f8f9fa',
          height: '100%',
          width: '100%'
        }}>
          <CareerContentView 
            selectedResumeDetail={selectedResumeDetail}
            onEdit={toggleEditMode}
            duplicateResume={(resumeId) => duplicateResume(resumeId, handleDeleteSuccess)}
            deleteResume={(resumeId) => deleteResume(resumeId, handleDeleteSuccess)}
            exportPDF={exportPDF}
            copyURL={copyURL}
          />
        </div>
      )}
      
      {/* 이력서 편집 (Edit 모드) */}
      {selectedResumeDetail && isEditMode && !isCreateMode && (
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <CareerContentEdit 
            selectedResumeDetail={selectedResumeDetail}
            onSave={handleEditComplete}
            onCancel={handleEditCancel}
          />
        </div>
      )}
      {/* 이력서 생성 모달 */}
      {
        isCreateMode && (
          <CareerContentCreate
            onCancel={handleEditCancel}
            onSuccess={handleResumeCreatedSuccess}
          />
        )
      }
    </main>
  );
};

export default CareerPage;
