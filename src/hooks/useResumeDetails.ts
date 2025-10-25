import { useState, useCallback } from 'react';
import { ResumeDetail } from '@/generated/common';
import HttpMethod from '@/enums/HttpMethod';
import DateUtil from '@/utils/DateUtil';
import dayjs from 'dayjs';
import { useConfirmStore } from './useConfirm';
import { useNotificationStore } from './useNotification';
import { 
  createSampleResume, 
  createSampleCareers, 
  createSampleEducations,
  createSampleProjects,
  createSampleActivities,
  createSampleLanguageSkills,
  createSampleAttachments
} from '@/utils/sampleCareerData';

/**
 * 로그인 상태 확인 함수
 */
const checkIsLoggedIn = (): boolean => {
  if (typeof window === 'undefined') return false;
  return document.cookie.includes('accessToken=') && document.cookie.includes('refreshToken=');
};

/**
 * 샘플 ResumeDetail 데이터 생성
 */
const createSampleResumeDetails = (): ResumeDetail[] => {
  const resume = createSampleResume();
  const careers = createSampleCareers();
  const educations = createSampleEducations();
  const projects = createSampleProjects();
  const activities = createSampleActivities();
  const languageSkills = createSampleLanguageSkills();
  const attachments = createSampleAttachments();

  return [
    {
      ...resume,
      careers,
      educations,
      projects,
      activities,
      languageSkills,
      attachments,
    }
  ];
};

/**
 * 이력서 목록을 관리하는 커스텀 훅
 */
export const useResumeDetails = () => {
  const [resumeDetails, setResumeDetails] = useState<ResumeDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { confirm } = useConfirmStore();
  const { showNotification } = useNotificationStore();

  // 이력서 목록 조회
  const fetchResumeDetails = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // 로그인 상태 확인
      if (!checkIsLoggedIn()) {
        console.log('User not logged in, returning sample data');
        const sampleData = createSampleResumeDetails();
        setResumeDetails(sampleData);
        setIsLoading(false);
        return;
      }
      
      const response = await fetch('/api/resumes/details', {
        method: HttpMethod.GET,
      });

      if (response.ok) {
        const data = await response.json();
        setResumeDetails(data.resumes || []);
      } else {
        // API 호출 실패 시에도 샘플 데이터 사용
        console.log('API call failed, returning sample data');
        const sampleData = createSampleResumeDetails();
        setResumeDetails(sampleData);
      }
    } catch (error) {
      // 에러 발생 시에도 샘플 데이터 사용
      console.log('Error occurred, returning sample data:', error);
      const sampleData = createSampleResumeDetails();
      setResumeDetails(sampleData);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 특정 이력서 상세 조회
  const fetchResumeDetail = useCallback(async (): Promise<ResumeDetail | null> => {
    try {
      // 로그인 상태 확인
      if (!checkIsLoggedIn()) {
        console.log('User not logged in, returning sample data');
        const sampleData = createSampleResumeDetails();
        return sampleData[0] || null;
      }

      const response = await fetch(`/api/resumes/details`, {
        method: HttpMethod.GET,
      });

      if (response.ok) {
        const data = await response.json();
        return data.resume || null;
      } else {
        // API 호출 실패 시에도 샘플 데이터 사용
        console.log('API call failed, returning sample data');
        const sampleData = createSampleResumeDetails();
        return sampleData[0] || null;
      }
    } catch (error) {
      // 에러 발생 시에도 샘플 데이터 사용
      console.log('Error fetching resume detail, returning sample data:', error);
      const sampleData = createSampleResumeDetails();
      return sampleData[0] || null;
    }
  }, []);

  // 이력서 목록 리프레시
  const refreshResumeDetails = useCallback(async () => {
    await fetchResumeDetails();
  }, [fetchResumeDetails]);

  // 이력서 복제 (콜백 처리)
  const duplicateResume = useCallback(async (resumeId?: string, onSuccess?: () => void): Promise<void> => {
    if (!resumeId) {
      alert('이력서 ID가 없습니다.');
      return;
    }

    try {
      const response = await fetch(`/api/resumes/${resumeId}/duplicate`, {
        method: HttpMethod.POST,
      });

      if (response.ok) {
        await response.json();
        alert('이력서가 성공적으로 복제되었습니다.');
        await fetchResumeDetails();
        
        // 성공 시 콜백 실행
        if (onSuccess) {
          onSuccess();
        }
      } else {
        const errorData = await response.json();
        alert(`복제 실패: ${errorData.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('이력서 복제 중 오류 발생:', error);
      alert('이력서 복제 중 오류가 발생했습니다.');
    }
  }, [fetchResumeDetails]);

  // 이력서 삭제 (confirm 포함, 콜백 처리)
  const deleteResume = useCallback(async (resumeId?: string, onSuccess?: () => void): Promise<void> => {
    if (!resumeId) {
      console.error('이력서 ID가 없습니다.');
      return;
    }

    // 삭제 확인 다이얼로그
    const result = await confirm({
      icon: '/assets/img/ico/ic-delete.png',
      title: '이력서를 삭제하시겠습니까?',
      description: '삭제하면 이력서에 작성된 내용이 모두 사라집니다.\n한 번 삭제하면 되돌릴 수 없습니다.',
      confirmText: '삭제하기',
      cancelText: '돌아가기',
    });

    if (!result) {
      return; // 취소한 경우
    }

    try {
      const response = await fetch(`/api/resumes/${resumeId}`, {
        method: HttpMethod.DELETE,
      });

      if (response.ok || response.status === 204) {
        await fetchResumeDetails();
        
        // 성공 시 콜백 실행
        if (onSuccess) {
          onSuccess();
        }
      } else {
        const errorData = await response.json();
        alert(`삭제 실패: ${errorData.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('이력서 삭제 중 오류 발생:', error);
      alert('이력서 삭제 중 오류가 발생했습니다.');
    }
  }, [fetchResumeDetails, confirm]);

  // PDF 내보내기 (콜백 처리)
  const exportPDF = useCallback(async (resumeId?: string, onSuccess?: () => void): Promise<void> => {
    // TODO: PDF 내보내기 기능 구현
    console.log('PDF 내보내기:', resumeId);
    
    try {
      // TODO: 실제 PDF 다운로드 로직 구현
      // const response = await fetch(`/api/resumes/${resumeId}/export-pdf`, {
      //   method: HttpMethod.GET,
      // });
      
      // 임시: 다운로드 완료 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // PDF 저장 완료 알림 표시
      showNotification('PDF 저장 완료', '#4caf50');
      
      // 성공 시 콜백 실행
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('PDF 내보내기 중 오류 발생:', error);
      showNotification('PDF 내보내기에 실패했습니다', '#f44336');
    }
  }, [showNotification]);

  // URL 복사 (confirm 포함, 콜백 처리)
  const copyURL = useCallback(async (publicId?: string, onSuccess?: () => void): Promise<void> => {
    if (!publicId) {
      alert('공개 URL이 없습니다.');
      return;
    }

    // URL 공유 확인 다이얼로그
    const result = await confirm({
      icon: '/assets/img/ico/ic-folder.png',
      title: `https://workfolio.com/${publicId}`,
      description: 'URL이 만들어졌어요.\n복사해서 이력서를 공유해 보세요.',
      confirmText: '공유하기',
      cancelText: '돌아가기',
    });

    if (!result) {
      return; // 취소한 경우
    }

    // URL 복사
    const url = `${window.location.origin}/resume/${publicId}`;
    try {
      await navigator.clipboard.writeText(url);
      alert('URL이 복사되었습니다.');
      
      // 성공 시 콜백 실행
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('URL 복사 실패:', err);
      alert('URL 복사에 실패했습니다.');
    }
  }, [confirm]);

  // 총 경력 계산
  const calculateTotalCareer = useCallback((resume: ResumeDetail): string => {
    if (!resume.careers || resume.careers.length === 0) {
      return '';
    }

    let totalMonths = 0;

    resume.careers.forEach((career) => {
      const startedAt = career.startedAt;
      if (!startedAt) return;

      let endTimestamp: number;
      if (career.isWorking) {
        endTimestamp = Date.now();
      } else {
        endTimestamp = DateUtil.normalizeTimestamp(career.endedAt || 0);
      }

      const start = dayjs(DateUtil.normalizeTimestamp(startedAt));
      const end = dayjs(endTimestamp);
      const careerMonths = end.diff(start, 'month');
      totalMonths += careerMonths;
    });

    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    return `총 경력 ${years}년 ${months}개월`;
  }, []);

  return {
    resumeDetails,
    isLoading,
    error,
    fetchResumeDetails,
    fetchResumeDetail,
    refreshResumeDetails,
    duplicateResume,
    deleteResume,
    exportPDF,
    copyURL,
    calculateTotalCareer,
  };
};

