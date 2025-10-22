import React, { useState, useEffect, useRef, useCallback } from 'react';
import CareerSidebar from './CareerSidebar';
import CareerHome from './CareerHome';
import { useUser } from '@/hooks/useUser';
import { ResumeDetail } from '@/generated/common';
import HttpMethod from '@/enums/HttpMethod';

const CareerPage: React.FC = () => {
  // 사용자 인증 상태
  const { isLoggedIn, user, isLoading: userLoading, fetchUser } = useUser();

  // 선택된 이력서
  const [selectedResumeDetail, setSelectedResumeDetail] = useState<ResumeDetail | null>(null);
  const [resumeDetails, setResumeDetails] = useState<ResumeDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 초기 로드 여부를 추적하는 ref
  const userFetchAttempted = useRef(false);

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

  // 이력서 목록 조회
  const fetchResumeDetails = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/resumes', {
        method: HttpMethod.GET,
      });

      if (response.ok) {
        const data = await response.json();
        setResumeDetails(data.resumeDetails || []);
      } else {
        console.error('Failed to fetch resumes');
      }
    } catch (error) {
      console.error('Error fetching resumes:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResumeDetails();
  }, [fetchResumeDetails]);

  // 이력서 상세 보기
  const viewResumeDetail = (resumeDetail: ResumeDetail) => {
    setSelectedResumeDetail(resumeDetail);
  };

  // 이력서 홈으로 이동
  const goHome = () => {
    setSelectedResumeDetail(null);
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
        selectedResumeDetail={selectedResumeDetail || null}
        onResumeSelect={viewResumeDetail}
        onGoHome={goHome}
      />
      <CareerHome 
        selectedResumeDetail={selectedResumeDetail || null}
        resumeDetails={resumeDetails}
        isLoggedIn={isLoggedIn}
      />
    </main>
  );
};

export default CareerPage;
