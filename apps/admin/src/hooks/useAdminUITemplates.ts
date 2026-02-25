import { useState, useCallback } from 'react';
import {
  UITemplate,
  UITemplateImage,
  UITemplateListResponse,
  UITemplateGetResponse,
  AdminUITemplateCreateRequest,
  AdminUITemplateUpdateRequest,
  AdminUITemplateImageListResponse,
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

  const createUITemplate = useCallback(async (request: AdminUITemplateCreateRequest): Promise<boolean> => {
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

      await fetchUITemplates();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error creating ui template:', err);
      return false;
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
  };
};
