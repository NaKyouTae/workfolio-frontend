import { useState, useCallback } from 'react';
import {
  UITemplate,
  UITemplateImage,
  UiTemplatePlan,
  UITemplateListResponse,
  UITemplateGetResponse,
  AdminUITemplateCreateRequest,
  AdminUITemplateUpdateRequest,
  AdminUITemplateImageListResponse,
  AdminUiTemplatePlanCreateRequest,
  AdminUiTemplatePlanUpdateRequest,
} from '@workfolio/shared/types/uitemplate';
import { SuccessResponse } from '@workfolio/shared/generated/common';

export const useAdminUITemplates = () => {
  const [uiTemplates, setUITemplates] = useState<UITemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUITemplates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/ui-templates');
      if (!response.ok) {
        throw new Error('Failed to fetch ui templates');
      }
      const data: UITemplateListResponse = await response.json();
      setUITemplates(data.uiTemplates || []);
      return data.uiTemplates;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error fetching ui templates:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getUITemplateById = useCallback(async (id: string): Promise<UITemplate | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/ui-templates/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch ui template');
      }
      const data: UITemplateGetResponse = await response.json();
      return data.uiTemplate || null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error fetching ui template:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createUITemplate = useCallback(async (request: AdminUITemplateCreateRequest): Promise<string | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/ui-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create ui template');
      }

      const data = await response.json();
      await fetchUITemplates();
      return data.uiTemplate?.id || null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error creating ui template:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchUITemplates]);

  const updateUITemplate = useCallback(async (id: string, request: AdminUITemplateUpdateRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/ui-templates/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update ui template');
      }

      await fetchUITemplates();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error updating ui template:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchUITemplates]);

  const deleteUITemplate = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/ui-templates/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete ui template');
      }

      const data: SuccessResponse = await response.json();
      if (data.isSuccess) {
        await fetchUITemplates();
      }
      return data.isSuccess || false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error deleting ui template:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchUITemplates]);

  const uploadImages = useCallback(async (
    uiTemplateId: string,
    files: File[],
    imageType: string = 'DETAIL'
  ): Promise<UITemplateImage[]> => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });
      formData.append('imageType', imageType);

      const response = await fetch(`/api/ui-templates/${uiTemplateId}/images`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload images');
      }

      const data: AdminUITemplateImageListResponse = await response.json();
      return data.images || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error uploading images:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteImage = useCallback(async (imageId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/ui-templates/images/${imageId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete image');
      }

      const data: SuccessResponse = await response.json();
      return data.isSuccess || false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error deleting image:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const createPlan = useCallback(async (
    uiTemplateId: string,
    request: AdminUiTemplatePlanCreateRequest
  ): Promise<UiTemplatePlan | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/ui-templates/${uiTemplateId}/plans`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create plan');
      }

      const data = await response.json();
      return data.plan || data || null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error creating plan:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePlan = useCallback(async (
    planId: string,
    request: AdminUiTemplatePlanUpdateRequest
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/ui-templates/plans/${planId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update plan');
      }

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error updating plan:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePlan = useCallback(async (planId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/ui-templates/plans/${planId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete plan');
      }

      const data: SuccessResponse = await response.json();
      return data.isSuccess || false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error deleting plan:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const reorderPlans = useCallback(async (
    uiTemplateId: string,
    plans: { id: string; durationDays: number; price: number; displayOrder: number }[]
  ): Promise<boolean> => {
    try {
      const response = await fetch(`/api/ui-templates/${uiTemplateId}/plans/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plans }),
      });

      if (!response.ok) {
        throw new Error('Failed to reorder plans');
      }

      return true;
    } catch (err) {
      console.error('Error reordering plans:', err);
      return false;
    }
  }, []);

  const reorderTemplates = useCallback(async (
    templates: UITemplate[]
  ): Promise<boolean> => {
    try {
      const response = await fetch('/api/ui-templates/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templates: templates.map((t, i) => ({
            id: t.id,
            name: t.name,
            description: t.description || '',
            type: typeof t.type === 'number' ? (t.type === 1 ? 'URL' : t.type === 2 ? 'PDF' : 'URL') : t.type,
            label: t.label || '',
            urlPath: t.urlPath || '',
            isActive: t.isActive,
            displayOrder: i,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to reorder templates');
      }

      await fetchUITemplates();
      return true;
    } catch (err) {
      console.error('Error reordering templates:', err);
      return false;
    }
  }, [fetchUITemplates]);

  return {
    uiTemplates,
    loading,
    error,
    fetchUITemplates,
    getUITemplateById,
    createUITemplate,
    updateUITemplate,
    deleteUITemplate,
    uploadImages,
    deleteImage,
    createPlan,
    updatePlan,
    deletePlan,
    reorderPlans,
    reorderTemplates,
  };
};
