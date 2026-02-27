import { useState, useCallback } from 'react';
import { TurnOver } from '@workfolio/shared/generated/common';

interface AdminTurnOverListResponse {
  turnOvers: TurnOver[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
}

export const useAdminTurnOvers = () => {
  const [turnOvers, setTurnOvers] = useState<TurnOver[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTurnOvers = useCallback(async (workerId: string, page = 0, size = 20) => {
    setLoading(true);
    setError(null);
    try {
      const url = `/api/turn-overs?workerId=${workerId}&page=${page}&size=${size}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch turn-overs');
      }
      const data: AdminTurnOverListResponse = await response.json();
      setTurnOvers(data.turnOvers || []);
      setTotalElements(data.totalElements || 0);
      setTotalPages(data.totalPages || 0);
      setCurrentPage(data.currentPage || 0);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error fetching turn-overs:', err);
      setTurnOvers([]);
      setTotalElements(0);
      setTotalPages(0);
      setCurrentPage(0);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTurnOver = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/turn-overs/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete turn-over');
      }
      const data = await response.json();
      return data.isSuccess || false;
    } catch (err) {
      console.error('Error deleting turn-over:', err);
      return false;
    }
  }, []);

  return {
    turnOvers,
    totalElements,
    totalPages,
    currentPage,
    loading,
    error,
    fetchTurnOvers,
    deleteTurnOver,
  };
};
