import { useState, useCallback } from 'react';
import {
  NoticeListResponse,
  NoticeGetResponse,
  NoticeCreateRequest,
  NoticeUpdateRequest,
} from '@workfolio/shared/generated/notice';
import { Notice } from '@workfolio/shared/generated/common';
import { SuccessResponse } from '@workfolio/shared/generated/common';

export const useAdminNotices = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 전체 공지사항 목록 조회
  const fetchNotices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/notices');
      if (!response.ok) {
        throw new Error('Failed to fetch notices');
      }
      const data: NoticeListResponse = await response.json();
      setNotices(data.notices || []);
      return data.notices;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error fetching notices:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // 공지사항 상세 조회
  const getNoticeById = useCallback(async (id: string): Promise<Notice | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/notices/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch notice');
      }
      const data: NoticeGetResponse = await response.json();
      return data.notice || null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error fetching notice:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 공지사항 생성
  const createNotice = useCallback(async (request: NoticeCreateRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/notices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create notice');
      }

      const data: SuccessResponse = await response.json();
      if (data.isSuccess) {
        await fetchNotices(); // 목록 새로고침
      }
      return data.isSuccess || false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error creating notice:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchNotices]);

  // 공지사항 수정
  const updateNotice = useCallback(async (request: NoticeUpdateRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/notices', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update notice');
      }

      const data: SuccessResponse = await response.json();
      if (data.isSuccess) {
        await fetchNotices(); // 목록 새로고침
      }
      return data.isSuccess || false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error updating notice:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchNotices]);

  // 공지사항 삭제
  const deleteNotice = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/notices/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete notice');
      }

      const data: SuccessResponse = await response.json();
      if (data.isSuccess) {
        await fetchNotices(); // 목록 새로고침
      }
      return data.isSuccess || false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error deleting notice:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchNotices]);

  return {
    notices,
    loading,
    error,
    fetchNotices,
    getNoticeById,
    createNotice,
    updateNotice,
    deleteNotice,
  };
};
