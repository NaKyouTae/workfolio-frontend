import { useState, useCallback } from 'react';
import {
  FeatureListResponse,
  FeatureGetResponse,
  FeatureCreateRequest,
  FeatureUpdateRequest,
} from '@/generated/feature';
import { Feature, SuccessResponse } from '@/generated/common';

export const useFeatures = () => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 기능 목록 조회 (도메인 필터링 가능)
  const fetchFeatures = useCallback(async (domain?: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = domain ? `/api/features?domain=${domain}` : '/api/features';
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch features');
      }
      const data: FeatureListResponse = await response.json();
      setFeatures(data.features || []);
      return data.features;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error fetching features:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // 기능 상세 조회
  const getFeatureById = useCallback(async (id: string): Promise<Feature | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/features/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch feature');
      }
      const data: FeatureGetResponse = await response.json();
      return data.feature || null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error fetching feature:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 기능 생성
  const createFeature = useCallback(async (request: FeatureCreateRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/features', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create feature');
      }

      const data: SuccessResponse = await response.json();
      if (data.isSuccess) {
        await fetchFeatures(); // 목록 새로고침
      }
      return data.isSuccess || false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error creating feature:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchFeatures]);

  // 기능 수정
  const updateFeature = useCallback(async (request: FeatureUpdateRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/features', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update feature');
      }

      const data: SuccessResponse = await response.json();
      if (data.isSuccess) {
        await fetchFeatures(); // 목록 새로고침
      }
      return data.isSuccess || false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error updating feature:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchFeatures]);

  // 기능 삭제
  const deleteFeature = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/features/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete feature');
      }

      const data: SuccessResponse = await response.json();
      if (data.isSuccess) {
        await fetchFeatures(); // 목록 새로고침
      }
      return data.isSuccess || false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error deleting feature:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchFeatures]);

  return {
    features,
    loading,
    error,
    fetchFeatures,
    getFeatureById,
    createFeature,
    updateFeature,
    deleteFeature,
  };
};

