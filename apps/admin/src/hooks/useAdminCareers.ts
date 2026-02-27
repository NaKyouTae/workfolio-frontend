import { useState, useCallback } from 'react';
import { Resume } from '@workfolio/shared/generated/common';

interface AdminResumeListResponse {
  resumes: Resume[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
}

export const useAdminCareers = () => {
  const [careers, setCareers] = useState<Resume[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCareers = useCallback(async (workerId: string, page = 0, size = 20) => {
    setLoading(true);
    setError(null);
    try {
      const url = `/api/careers?workerId=${workerId}&page=${page}&size=${size}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch careers');
      }
      const data: AdminResumeListResponse = await response.json();
      setCareers(data.resumes || []);
      setTotalElements(data.totalElements || 0);
      setTotalPages(data.totalPages || 0);
      setCurrentPage(data.currentPage || 0);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error fetching careers:', err);
      setCareers([]);
      setTotalElements(0);
      setTotalPages(0);
      setCurrentPage(0);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCareer = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/careers/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete resume');
      }
      const data = await response.json();
      return data.isSuccess || false;
    } catch (err) {
      console.error('Error deleting resume:', err);
      return false;
    }
  }, []);

  return {
    careers,
    totalElements,
    totalPages,
    currentPage,
    loading,
    error,
    fetchCareers,
    deleteCareer,
  };
};
