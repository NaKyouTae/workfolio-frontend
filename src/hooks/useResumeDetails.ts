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

  return {
    resumeDetails,
    isLoading,
    error,
    fetchResumeDetails,
    fetchResumeDetail,
    refreshResumeDetails,
  };
};

