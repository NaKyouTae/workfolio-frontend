import { useState, useEffect, useCallback } from 'react';
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
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotices = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 샘플 데이터 사용
      setNotices(sampleNotices.map(notice => ({
        id: notice.id,
        title: notice.title,
        content: notice.content,
        author: '관리자',
        createdAt: notice.createdAt,
        views: 0,
        isImportant: notice.isPinned || false,
        updatedAt: notice.updatedAt,
        isPinned: notice.isPinned || false,
      })));
      setIsLoading(false);
      return;

      // API 호출 부분 (주석 처리)
      /*
      const response = await fetch('/api/release/notices', {
        method: 'GET',
      });

      if (!response.ok) {
        // 에러 발생 시 샘플 데이터 사용
        setNotices(sampleNotices.map(notice => ({
          id: notice.id,
          title: notice.title,
          content: notice.content,
          author: '관리자',
          createdAt: notice.createdAt,
          views: 0,
          isImportant: notice.isPinned || false,
        })));
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      
      // ReleaseNoticeListResponse 구조: { notices: Notice[] }
      const noticesData: Notice[] = data.notices || [];
      
      setNotices(noticesData.map(notice => ({
        id: notice.id,
        title: notice.title,
        content: notice.content,
        author: '관리자',
        createdAt: notice.createdAt,
        views: 0,
        isImportant: notice.isPinned || false,
      })));
      */
    } catch (err) {
      console.error('Error fetching notices:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch notices');
      // 에러 발생 시에도 샘플 데이터 표시
      setNotices(sampleNotices.map(notice => ({
        id: notice.id,
        title: notice.title,
        content: notice.content,
        author: '관리자',
        createdAt: notice.createdAt,
        views: 0,
        isImportant: notice.isPinned || false,
        updatedAt: notice.updatedAt,
        isPinned: notice.isPinned || false,
      })));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  return {
    notices,
    isLoading,
    error,
    refreshNotices: fetchNotices,
    isSampleData: false, // 인증 불필요하므로 항상 false
  };
};

