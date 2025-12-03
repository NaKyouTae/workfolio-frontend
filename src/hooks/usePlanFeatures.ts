import { useState, useCallback } from 'react';
import {
  PlanFeatureListResponse,
  PlanFeatureGetResponse,
  PlanFeatureCreateRequest,
  PlanFeatureUpdateRequest,
} from '@/generated/plan_feature';
import { PlanFeature, SuccessResponse } from '@/generated/common';

export const usePlanFeatures = () => {
  const [planFeatures, setPlanFeatures] = useState<PlanFeature[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 플랜-기능 목록 조회 (필터링 가능)
  const fetchPlanFeatures = useCallback(async (planId?: string, featureId?: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (planId) params.append('plan_id', planId);
      if (featureId) params.append('feature_id', featureId);

      const url = params.toString() 
        ? `/api/plan-features?${params.toString()}` 
        : '/api/plan-features';

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch plan-features');
      }
      const data: PlanFeatureListResponse = await response.json();
      setPlanFeatures(data.planFeatures || []);
      return data.planFeatures;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error fetching plan-features:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // 플랜-기능 상세 조회
  const getPlanFeatureById = useCallback(async (id: string): Promise<PlanFeature | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/plan-features/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch plan-feature');
      }
      const data: PlanFeatureGetResponse = await response.json();
      return data.planFeature || null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error fetching plan-feature:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 플랜-기능 생성
  const createPlanFeature = useCallback(async (request: PlanFeatureCreateRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/plan-features', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create plan-feature');
      }

      const data: SuccessResponse = await response.json();
      if (data.isSuccess) {
        await fetchPlanFeatures(); // 목록 새로고침
      }
      return data.isSuccess || false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error creating plan-feature:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchPlanFeatures]);

  // 플랜-기능 수정
  const updatePlanFeature = useCallback(async (request: PlanFeatureUpdateRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/plan-features', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update plan-feature');
      }

      const data: SuccessResponse = await response.json();
      if (data.isSuccess) {
        await fetchPlanFeatures(); // 목록 새로고침
      }
      return data.isSuccess || false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error updating plan-feature:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchPlanFeatures]);

  // 플랜-기능 삭제
  const deletePlanFeature = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/plan-features/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete plan-feature');
      }

      const data: SuccessResponse = await response.json();
      if (data.isSuccess) {
        await fetchPlanFeatures(); // 목록 새로고침
      }
      return data.isSuccess || false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error deleting plan-feature:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchPlanFeatures]);

  return {
    planFeatures,
    loading,
    error,
    fetchPlanFeatures,
    getPlanFeatureById,
    createPlanFeature,
    updatePlanFeature,
    deletePlanFeature,
  };
};

