import { useState, useCallback } from 'react';
import { CreditHistory, CreditHistoryListResponse } from '@workfolio/shared/types/credit';

export const useAdminCredits = () => {
  const [creditHistories, setCreditHistories] = useState<CreditHistory[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCreditHistories = useCallback(async (page = 0, size = 20, txType?: string) => {
    setLoading(true);
    setError(null);
    try {
      let url = `/api/credits?page=${page}&size=${size}`;
      if (txType) {
        url += `&txType=${txType}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch credit histories');
      }
      const data: CreditHistoryListResponse = await response.json();
      setCreditHistories(data.creditHistories || []);
      setTotalElements(data.totalElements || 0);
      setTotalPages(data.totalPages || 0);
      setCurrentPage(data.currentPage || 0);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error fetching credit histories:', err);
      return null;
    } finally {
      setLoading(false);
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
  };
};
