import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import CareerSidebar from './CareerSidebar';
import CareerContent from './CareerContent';
import { useUser } from '@/hooks/useUser';
import { useResumeDetails } from '@/hooks/useResumeDetails';
import { ResumeDetail } from '@/generated/common';

type ViewMode = 'home' | 'view' | 'edit';

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
    isLoading: isLoadingResumes,
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
  const [isNewResume, setIsNewResume] = useState(false);
  // initialResumeId가 있으면 초기 viewMode를 바로 설정하여 홈 화면이 먼저 보이는 것을 방지
  const [viewMode, setViewMode] = useState<ViewMode>(initialResumeId ? (initialEditMode ? 'edit' : 'view') : 'home');
  const [previousMode, setPreviousMode] = useState<ViewMode>('home'); // edit로 들어가기 전 모드 저장
  const [isLoadingDetail, setIsLoadingDetail] = useState(!!initialResumeId); // 초기 로딩 상태

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

  // URL 파라미터로 초기 상태 설정
  useEffect(() => {
    if (initialResumeId) {
      // 이미 같은 이력서가 선택되어 있고 편집 모드도 같으면 업데이트하지 않음
      if (selectedResumeDetail?.id === initialResumeId && viewMode === (initialEditMode ? 'edit' : 'view')) {
        setIsLoadingDetail(false);
        return;
      }
      
      setIsLoadingDetail(true);
      setViewMode(initialEditMode ? 'edit' : 'view');
      setPreviousMode(initialEditMode ? 'view' : 'home');
      
      // resumeDetails에서 해당 id의 데이터를 찾아서 바로 표시
      const resume = resumeDetails.find(r => r.id === initialResumeId);
      if (resume) {
        setSelectedResumeDetail(resume);
        setIsNewResume(false);
        setIsLoadingDetail(false);
      } else if (resumeDetails.length > 0) {
        // resumeDetails가 로드되었지만 해당 id를 찾지 못한 경우
        setIsLoadingDetail(false);
      }
    } else {
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
    setViewMode('view');
    router.push(`/careers/${resumeDetail.id}`);
    // resumeDetails에서 해당 id의 데이터를 찾아서 바로 표시 (API 조회 없이)
    const foundResume = resumeDetails.find(r => r.id === resumeDetail.id);
    if (foundResume) {
      setSelectedResumeDetail(foundResume);
      setIsNewResume(false);
    }
  };

  // 이력서 편집 (Edit 모드) - Home에서 진입
  const editResumeDetail = (resumeDetail: ResumeDetail) => {
    setPreviousMode('home');
    setViewMode('edit');
    router.push(`/careers/${resumeDetail.id}/edit`);
    // resumeDetails에서 해당 id의 데이터를 찾아서 바로 표시 (API 조회 없이)
    const foundResume = resumeDetails.find(r => r.id === resumeDetail.id);
    if (foundResume) {
      setSelectedResumeDetail(foundResume);
      setIsNewResume(false);
    }
  };

  // 편집 완료 (저장 후 View 모드로 전환)
  const handleSave = async () => {
    // CareerContentEdit가 내부에서 저장을 처리하므로 여기서는 목록만 새로고침
    forceUpdateAfterSave.current = true; // 강제 업데이트 플래그 설정
    await refreshResumeDetails();
    resumeDetailsFetched.current = true; // 패칭 완료 플래그 유지
  };

  // 편집 취소 (이전 화면으로 복귀)
  const handleCancelEdit = () => {
    if (previousMode === 'home') {
      setSelectedResumeDetail(null);
      setIsNewResume(false);
      router.push('/careers');
    } else if (selectedResumeDetail?.id) {
      setViewMode('view');
      router.push(`/careers/${selectedResumeDetail.id}`);
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
    setViewMode('home');
    setSelectedResumeDetail(null);
    setIsNewResume(false);
    router.push('/careers');
  };

  // 이력서 생성 모드
  const handleResumeCreated = () => {
    setSelectedResumeDetail(null);
    setIsNewResume(true);
    setViewMode('edit');
    // 새로 생성하는 경우 URL은 변경하지 않음 (아직 id가 없음)
  };

  // 저장 후 모드 변경
  const handleSaveComplete = (mode: ViewMode) => {
    // mode가 'edit'이 아닌 경우에만 viewMode 업데이트
    if (mode !== 'edit') {
      setViewMode(mode);
      setPreviousMode(mode);
    }
  };

  // edit 모드로 진입 (이전 모드 저장)
  const handleEnterEdit = (fromMode: ViewMode) => {
    if (selectedResumeDetail?.id) {
      setPreviousMode(fromMode);
      setViewMode('edit');
      router.push(`/careers/${selectedResumeDetail.id}/edit`);
    }
  };


  return (
    <main>
      <CareerSidebar 
        resumeDetails={resumeDetails}
        selectedResumeDetail={selectedResumeDetail || null}
        onResumeSelect={viewResumeDetail}
        onResumeCreated={handleResumeCreated}
        onGoHome={goHome}
        isLoading={isLoadingResumes}
      />
      <CareerContent 
        selectedResumeDetail={selectedResumeDetail} 
        resumeDetails={resumeDetails}
        isNewResume={isNewResume}
        viewMode={viewMode}
        isLoading={isLoadingResumes || isLoadingDetail}
        onResumeSelect={(id) => {
          const resume = resumeDetails.find(r => r.id === id);
          if (resume) {
            viewResumeDetail(resume);
          }
        }} 
        onResumeSelectAndEdit={(id) => {
          const resume = resumeDetails.find(r => r.id === id);
          if (resume) {
            editResumeDetail(resume);
          }
        }}
        onSave={handleSave} 
        onDuplicate={(id) => duplicateResume(id, handleDeleteSuccess)} 
        onDelete={(id) => deleteResume(id, handleDeleteSuccess)}
        onEnterEdit={handleEnterEdit}
        onCancelEdit={handleCancelEdit}
        onSaveComplete={handleSaveComplete}
        duplicateResume={(resumeId) => duplicateResume(resumeId, handleDeleteSuccess)}
        deleteResume={(resumeId) => deleteResume(resumeId, handleDeleteSuccess)}
        exportPDF={exportPDF}
        copyURL={copyURL}
        changeDefault={changeDefault}
        calculateTotalCareer={calculateTotalCareer}
      />
    </main>
  );
};

export default CareerPage;
