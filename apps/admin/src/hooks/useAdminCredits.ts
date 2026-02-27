import { useState, useCallback } from 'react';
import { CreditHistory, CreditHistoryListResponse } from '@workfolio/shared/types/credit';

export const useAdminCredits = () => {
  const [creditHistories, setCreditHistories] = useState<CreditHistory[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCreditHistories = useCallback(async (page = 0, size = 20, txType?: string, workerId?: string) => {
    setLoading(true);
    setError(null);
    try {
      let url = `/api/credits?page=${page}&size=${size}`;
      if (txType) {
        url += `&txType=${txType}`;
      }
      if (workerId) {
        url += `&workerId=${workerId}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || `Failed to fetch credit histories (${response.status})`);
      }
      const data: CreditHistoryListResponse = await response.json();
      setCreditHistories(data.creditHistories || []);
      setTotalElements(data.totalElements ?? 0);
      setTotalPages(data.totalPages ?? 0);
      setCurrentPage(data.currentPage ?? 0);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error fetching credit histories:', err);
      setCreditHistories([]);
      setTotalElements(0);
      setTotalPages(0);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCreditHistory = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/credits/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete credit history');
      }
      const data = await response.json();
      return data.isSuccess || false;
    } catch (err) {
      console.error('Error deleting credit history:', err);
      return false;
    }
  }, []);

  const adjustCredits = useCallback(async (
    action: 'ADD' | 'DEDUCT',
    workerId: string,
    amount: number,
    description?: string
  ): Promise<{ isSuccess: boolean; message?: string }> => {
    try {
      const response = await fetch('/api/credits/adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, workerId, amount, description }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        return { isSuccess: false, message: data.error || data.message || '크레딧 조정에 실패했습니다.' };
      }

      return { isSuccess: Boolean(data.isSuccess), message: data.message };
    } catch (err) {
      console.error('Error adjusting credits:', err);
      return { isSuccess: false, message: '크레딧 조정 중 오류가 발생했습니다.' };
    }
  }, []);

  return {
    creditHistories,
    totalElements,
    totalPages,
    currentPage,
    loading,
    error,
    fetchCreditHistories,
    deleteCreditHistory,
    adjustCredits,
  };
};
