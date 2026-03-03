import { useState, useCallback } from 'react';
import { WorkerUITemplate, UITemplate } from '@workfolio/shared/types/uitemplate';

interface AdminOwnedTemplateListResponse {
  workerUiTemplates: WorkerUITemplate[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
}

interface WorkerDefaultTemplatesResponse {
  defaultUrlUiTemplate?: UITemplate;
  defaultPdfUiTemplate?: UITemplate;
}

export const useAdminOwnedTemplates = () => {
  const [ownedTemplates, setOwnedTemplates] = useState<WorkerUITemplate[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [defaultUrlTemplateId, setDefaultUrlTemplateId] = useState<string | null>(null);
  const [defaultUrlTemplateName, setDefaultUrlTemplateName] = useState<string | null>(null);
  const [defaultPdfTemplateId, setDefaultPdfTemplateId] = useState<string | null>(null);
  const [defaultPdfTemplateName, setDefaultPdfTemplateName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOwnedTemplates = useCallback(async (workerId: string, page = 0, size = 20) => {
    setLoading(true);
    setError(null);
    try {
      const [templatesRes, defaultsRes] = await Promise.all([
        fetch(`/api/ui-templates/owned?workerId=${workerId}&page=${page}&size=${size}`),
        fetch(`/api/ui-templates/worker-defaults?workerId=${workerId}`),
      ]);

      if (!templatesRes.ok) {
        throw new Error('Failed to fetch owned templates');
      }

      const data: AdminOwnedTemplateListResponse = await templatesRes.json();
      setOwnedTemplates(data.workerUiTemplates || []);
      setTotalElements(data.totalElements || 0);
      setTotalPages(data.totalPages || 0);
      setCurrentPage(data.currentPage || 0);

      if (defaultsRes.ok) {
        const defaults: WorkerDefaultTemplatesResponse = await defaultsRes.json();
        setDefaultUrlTemplateId(defaults.defaultUrlUiTemplate?.id || null);
        setDefaultUrlTemplateName(defaults.defaultUrlUiTemplate?.name || null);
        setDefaultPdfTemplateId(defaults.defaultPdfUiTemplate?.id || null);
        setDefaultPdfTemplateName(defaults.defaultPdfUiTemplate?.name || null);
      }

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
    defaultUrlTemplateId,
    defaultUrlTemplateName,
    defaultPdfTemplateId,
    defaultPdfTemplateName,
    loading,
    error,
    fetchOwnedTemplates,
  };
};
