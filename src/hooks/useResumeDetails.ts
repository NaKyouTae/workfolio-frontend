import { useState, useCallback } from 'react';
import { ResumeDetail } from '@/generated/common';
import HttpMethod from '@/enums/HttpMethod';

/**
 * 이력서 목록을 관리하는 커스텀 훅
 */
export const useResumeDetails = () => {
  const [resumeDetails, setResumeDetails] = useState<ResumeDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 이력서 목록 조회
  const fetchResumeDetails = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/resumes/details', {
        method: HttpMethod.GET,
      });

      if (response.ok) {
        const data = await response.json();
        setResumeDetails(data.resumes || []);
      } else {
        const errorMsg = 'Failed to fetch resumes';
        console.error(errorMsg);
        setError(errorMsg);
      }
    } catch (error) {
      const errorMsg = 'Error fetching resumes';
      console.error(errorMsg, error);
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 특정 이력서 상세 조회
  const fetchResumeDetail = useCallback(async (): Promise<ResumeDetail | null> => {
    try {
      const response = await fetch(`/api/resumes/details`, {
        method: HttpMethod.GET,
      });

      if (response.ok) {
        const data = await response.json();
        return data.resume || null;
      } else {
        console.error('Failed to fetch resume detail');
        return null;
      }
    } catch (error) {
      console.error('Error fetching resume detail:', error);
      return null;
    }
  }, []);

  // 이력서 목록 리프레시
  const refreshResumeDetails = useCallback(async () => {
    await fetchResumeDetails();
  }, [fetchResumeDetails]);

  // 이력서 복제
  const duplicateResume = useCallback(async (resumeId?: string): Promise<boolean> => {
    if (!resumeId) {
      alert('이력서 ID가 없습니다.');
      return false;
    }

    try {
      const response = await fetch(`/api/resumes/${resumeId}/duplicate`, {
        method: HttpMethod.POST,
      });

      if (response.ok) {
        await response.json();
        alert('이력서가 성공적으로 복제되었습니다.');
        await fetchResumeDetails();
        return true;
      } else {
        const errorData = await response.json();
        alert(`복제 실패: ${errorData.error || '알 수 없는 오류'}`);
        return false;
      }
    } catch (error) {
      console.error('이력서 복제 중 오류 발생:', error);
      alert('이력서 복제 중 오류가 발생했습니다.');
      return false;
    }
  }, [fetchResumeDetails]);

  // 이력서 삭제
  const deleteResume = useCallback(async (resumeId?: string): Promise<boolean> => {
    if (!resumeId) {
      alert('이력서 ID가 없습니다.');
      return false;
    }

    const isConfirmed = window.confirm('정말로 이 이력서를 삭제하시겠습니까?');
    if (!isConfirmed) {
      return false;
    }

    try {
      const response = await fetch(`/api/resumes/${resumeId}`, {
        method: HttpMethod.DELETE,
      });

      if (response.ok || response.status === 204) {
        alert('이력서가 성공적으로 삭제되었습니다.');
        await fetchResumeDetails();
        return true;
      } else {
        const errorData = await response.json();
        alert(`삭제 실패: ${errorData.error || '알 수 없는 오류'}`);
        return false;
      }
    } catch (error) {
      console.error('이력서 삭제 중 오류 발생:', error);
      alert('이력서 삭제 중 오류가 발생했습니다.');
      return false;
    }
  }, [fetchResumeDetails]);

  // PDF 내보내기
  const exportPDF = useCallback(async (resumeId?: string): Promise<void> => {
    // TODO: PDF 내보내기 기능 구현
    console.log('PDF 내보내기:', resumeId);
    alert('PDF 내보내기 기능은 추후 구현될 예정입니다.');
  }, []);

  // URL 복사
  const copyURL = useCallback((publicId?: string): void => {
    console.log('URL 복사:', publicId);
    alert('URL 복사 기능은 추후 구현될 예정입니다.');
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
  };
};

