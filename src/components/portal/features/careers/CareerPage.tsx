import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import CareerSidebar from './CareerSidebar';
import CareerIntegration from './CareerIntegration';
import { useUser } from '@/hooks/useUser';
import { useResumeDetails } from '@/hooks/useResumeDetails';
import { ResumeDetail } from '@/generated/common';
import CareerContentView from './CareerContentView';
import CareerContentEdit from './CareerContentEdit';
import CareerContentCreate from './CareerContentCreate';

import Footer from "@/components/portal/layouts/Footer"

interface CareerPageProps {
  initialResumeId?: string;
  initialEditMode?: boolean;
}

const CareerPage: React.FC<CareerPageProps> = ({ initialResumeId, initialEditMode = false }) => {
  const router = useRouter();
  // 사용자 인증 상태
  const { user, fetchUser } = useUser();

  // 이력서 목록 관리
  const { 
    resumeDetails, 
    fetchResumeDetails,
    refreshResumeDetails,
    duplicateResume,
    deleteResume,
    exportPDF,
    copyURL,
    calculateTotalCareer,
    changeDefault,
  } = useResumeDetails();

  // 선택된 이력서
  const [selectedResumeDetail, setSelectedResumeDetail] = useState<ResumeDetail | null>(null);
  
  // 편집 모드 상태
  // initialResumeId가 있으면 초기 상태를 바로 설정하여 홈 화면이 먼저 보이는 것을 방지
  const [isEditMode, setIsEditMode] = useState(initialEditMode);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(!!initialResumeId); // 초기 로딩 상태

  // 편집 모드 진입 위치 추적 ('home' | 'view')
  const [editFrom, setEditFrom] = useState<'home' | 'view'>('view');

  // 초기 로드 여부를 추적하는 ref
  const userFetchAttempted = useRef(false);
  const resumeDetailsFetched = useRef(false);
  
  // 편집 완료 후 강제 업데이트를 위한 ref
  const forceUpdateAfterSave = useRef(false);

  // 컴포넌트 마운트 시 사용자 정보 가져오기
  useEffect(() => {
    if (!user && !userFetchAttempted.current) {
      userFetchAttempted.current = true;
      fetchUser().catch(error => {
        console.error('Failed to fetch user:', error);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 이력서 목록은 한 번만 패칭 (페이지 리마운트 시 중복 패칭 방지)
  useEffect(() => {
    if (!resumeDetailsFetched.current) {
      resumeDetailsFetched.current = true;
      fetchResumeDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // URL 파라미터로 초기 상태 설정 (resumeDetails가 로드된 후에만 실행)
  useEffect(() => {
    if (initialResumeId && resumeDetails.length > 0) {
      setIsLoadingDetail(true);
      const resume = resumeDetails.find(r => r.id === initialResumeId);
      if (resume) {
        // 이미 같은 이력서가 선택되어 있고 편집 모드도 같으면 업데이트하지 않음
        if (selectedResumeDetail?.id === resume.id && isEditMode === initialEditMode) {
          setIsLoadingDetail(false);
          return;
        }
        setSelectedResumeDetail(resume);
        setIsEditMode(initialEditMode);
        setEditFrom(initialEditMode ? 'view' : 'view');
      }
      setIsLoadingDetail(false);
    } else if (!initialResumeId) {
      setIsLoadingDetail(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialResumeId, initialEditMode, resumeDetails]);

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
    router.push(`/careers/${resumeDetail.id}`);
  };

  // 이력서 편집 (Edit 모드) - Home에서 진입
  const editResumeDetail = (resumeDetail: ResumeDetail) => {
    setSelectedResumeDetail(resumeDetail);
    setIsEditMode(true);
    setEditFrom('home'); // Home에서 왔음을 기록
    router.push(`/careers/${resumeDetail.id}/edit`);
  };

  // 편집 모드 토글 - View에서 진입
  const toggleEditMode = () => {
    if (selectedResumeDetail) {
      setIsEditMode(true);
      setEditFrom('view'); // View에서 왔음을 기록
      router.push(`/careers/${selectedResumeDetail.id}/edit`);
    }
  };

  // 편집 완료 (저장 후 View 모드로 전환)
  const handleEditComplete = async () => {
    setIsEditMode(false);
    forceUpdateAfterSave.current = true; // 강제 업데이트 플래그 설정
    await refreshResumeDetails();
    resumeDetailsFetched.current = true; // 패칭 완료 플래그 유지
    if (selectedResumeDetail) {
      router.push(`/careers/${selectedResumeDetail.id}`);
    }
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
      if (selectedResumeDetail) {
        router.push(`/careers/${selectedResumeDetail.id}`);
      }
    }
  };

  // 삭제 성공 후 홈으로 이동
  const handleDeleteSuccess = async () => {
    await refreshResumeDetails();
    resumeDetailsFetched.current = true; // 패칭 완료 플래그 유지
    goHome();
  };

  // 이력서 홈으로 이동
  const goHome = () => {
    setSelectedResumeDetail(null);
    setIsEditMode(false);
    setIsLoadingDetail(false);
    router.push('/careers');
  };

  // 이력서 생성 모드
  const handleResumeCreated = () => {
    setIsCreateMode(true);
  };

  // 이력서 생성 완료 후 모드 종료
  const handleResumeCreatedSuccess = async (resumeId?: string) => {
    setIsEditMode(false);
    setIsCreateMode(false);
    await refreshResumeDetails();
    resumeDetailsFetched.current = true; // 패칭 완료 플래그 유지
    // 생성된 이력서가 있으면 해당 페이지로 이동
    if (resumeId) {
      router.push(`/careers/${resumeId}`);
    }
  };

  // 데이터 로딩 중이면 로딩 화면 표시 (홈 화면이 먼저 보이는 것을 방지)
  if (isLoadingDetail) {
    return (
      <main>
        <CareerSidebar 
          resumeDetails={resumeDetails}
          selectedResumeDetail={selectedResumeDetail || null}
          onResumeSelect={viewResumeDetail}
          onResumeCreated={handleResumeCreated}
          onGoHome={goHome}
        />
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div>로딩 중...</div>
        </div>
      </main>
    );
  }

  // 메인 뷰
  return (
    <main>
      <CareerSidebar 
        resumeDetails={resumeDetails}
        selectedResumeDetail={selectedResumeDetail || null}
        onResumeSelect={viewResumeDetail}
        onResumeCreated={handleResumeCreated}
        onGoHome={goHome}
      />
      
      {/* 이력서 홈 (목록) */}
      {!selectedResumeDetail && !isCreateMode && (
        <CareerIntegration 
          resumeDetails={resumeDetails}
          onView={viewResumeDetail}
          onEdit={editResumeDetail}
          duplicateResume={(resumeId) => duplicateResume(resumeId, handleDeleteSuccess)}
          deleteResume={(resumeId) => deleteResume(resumeId, handleDeleteSuccess)}
          exportPDF={exportPDF}
          copyURL={copyURL}
          calculateTotalCareer={calculateTotalCareer}
          changeDefault={changeDefault}
        />
      )}
      
      {/* 이력서 상세 보기 (View 모드) */}
      {selectedResumeDetail && !isEditMode && !isCreateMode && (
        <section>
          <CareerContentView 
            selectedResumeDetail={selectedResumeDetail}
            onEdit={toggleEditMode}
            duplicateResume={(resumeId) => duplicateResume(resumeId, handleDeleteSuccess)}
            deleteResume={(resumeId) => deleteResume(resumeId, handleDeleteSuccess)}
            exportPDF={exportPDF}
            copyURL={copyURL}
          />
          <Footer/>
        </section>
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
          <Footer/>
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
