import { useState, useCallback } from 'react';
import { Record } from '@workfolio/shared/generated/common';

interface AdminRecordListResponse {
  records: Record[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
}

export const useAdminRecords = () => {
  const [records, setRecords] = useState<Record[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = useCallback(async (workerId: string, page = 0, size = 20) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/records?workerId=${workerId}&page=${page}&size=${size}`);
      if (!response.ok) {
        throw new Error('Failed to fetch records');
      }
      const data: AdminRecordListResponse = await response.json();
      setRecords(data.records || []);
      setTotalElements(data.totalElements || 0);
      setTotalPages(data.totalPages || 0);
      setCurrentPage(data.currentPage || 0);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error fetching records:', err);
      setRecords([]);
      setTotalElements(0);
      setTotalPages(0);
      setCurrentPage(0);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    records,
    totalElements,
    totalPages,
    currentPage,
    loading,
    error,
    fetchRecords,
  };
};
