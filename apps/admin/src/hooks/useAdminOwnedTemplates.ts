import { useState, useCallback } from 'react';
import { WorkerUITemplate } from '@workfolio/shared/types/uitemplate';

interface AdminOwnedTemplateListResponse {
  workerUiTemplates: WorkerUITemplate[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
}

export const useAdminOwnedTemplates = () => {
  const [ownedTemplates, setOwnedTemplates] = useState<WorkerUITemplate[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOwnedTemplates = useCallback(async (workerId: string, page = 0, size = 20) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/ui-templates/owned?workerId=${workerId}&page=${page}&size=${size}`);
      if (!response.ok) {
        throw new Error('Failed to fetch owned templates');
      }
      const data: AdminOwnedTemplateListResponse = await response.json();
      setOwnedTemplates(data.workerUiTemplates || []);
      setTotalElements(data.totalElements || 0);
      setTotalPages(data.totalPages || 0);
      setCurrentPage(data.currentPage || 0);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error fetching owned templates:', err);
      setOwnedTemplates([]);
      setTotalElements(0);
      setTotalPages(0);
      setCurrentPage(0);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    ownedTemplates,
    totalElements,
    totalPages,
    currentPage,
    loading,
    error,
    fetchOwnedTemplates,
  };
};
