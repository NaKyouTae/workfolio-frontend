import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@/hooks/useUser';
import { sampleNotices } from '@/utils/sampleNoticesData';

export interface Notice {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: number;
  views: number;
  isImportant: boolean;
}

export const useNotices = () => {
  const { isLoggedIn } = useUser();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotices = useCallback(async () => {
    // 로그인되지 않은 경우 샘플 데이터 사용
    if (!isLoggedIn) {
      setNotices(sampleNotices);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/notices', {
        method: 'GET',
      });

      if (!response.ok) {
        // 401 에러인 경우 샘플 데이터 사용
        if (response.status === 401) {
          setNotices(sampleNotices);
          setIsLoading(false);
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // API 응답 구조에 맞게 데이터 매핑
      // 실제 API 응답 구조에 따라 수정 필요
      const noticesData: Notice[] = Array.isArray(data) ? data : data.notices || [];
      
      setNotices(noticesData);
    } catch (err) {
      console.error('Error fetching notices:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch notices');
      // 에러 발생 시에도 샘플 데이터 표시
      setNotices(sampleNotices);
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  return {
    notices,
    isLoading,
    error,
    refreshNotices: fetchNotices,
    isSampleData: !isLoggedIn,
  };
};

