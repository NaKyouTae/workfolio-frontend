import { useState, useCallback } from 'react';
import {

  PlanGetResponse,
  PlanCreateRequest,
  PlanUpdateRequest,
} from '../generated/plan';
import { Plan, SuccessResponse } from '../generated/common';
import { ReleasePlanListResponse, ReleasePlanDetail } from '../generated/release';

export const usePlans = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 전체 플랜 목록 조회 (인증 불필요한 release API 사용)
  const fetchPlans = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/release/plans');
      if (!response.ok) {
        throw new Error('Failed to fetch plans');
      }
      const data: ReleasePlanListResponse = await response.json();
      
      // ReleasePlanDetail을 Plan으로 변환
      const convertedPlans: Plan[] = (data.plans || []).map((releasePlan: ReleasePlanDetail) => ({
        id: releasePlan.id,
        name: releasePlan.name,
        type: releasePlan.type,
        price: releasePlan.price,
        currency: releasePlan.currency,
        priority: releasePlan.priority,
        description: releasePlan.description || '',
        createdAt: releasePlan.createdAt,
        updatedAt: releasePlan.updatedAt,
      }));
      
      setPlans(convertedPlans);
      return convertedPlans;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error fetching plans:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // 플랜 상세 조회
  const getPlanById = useCallback(async (id: string): Promise<Plan | undefined> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/plans/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch plan');
      }
      const data: PlanGetResponse = await response.json();
      return data.plan;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error fetching plan:', err);
      return undefined;
    } finally {
      setLoading(false);
    }
  }, []);

  // 플랜 생성
  const createPlan = useCallback(async (request: PlanCreateRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create plan');
      }

      const data: SuccessResponse = await response.json();
      if (data.isSuccess) {
        await fetchPlans(); // 목록 새로고침
      }
      return data.isSuccess || false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error creating plan:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchPlans]);

  // 플랜 수정
  const updatePlan = useCallback(async (request: PlanUpdateRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/plans', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update plan');
      }

      const data: SuccessResponse = await response.json();
      if (data.isSuccess) {
        await fetchPlans(); // 목록 새로고침
      }
      return data.isSuccess || false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error updating plan:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchPlans]);

  // 플랜 삭제
  const deletePlan = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/plans/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete plan');
      }

      const data: SuccessResponse = await response.json();
      if (data.isSuccess) {
        await fetchPlans(); // 목록 새로고침
      }
      return data.isSuccess || false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error deleting plan:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchPlans]);

  return {
    plans,
    loading,
    error,
    fetchPlans,
    getPlanById,
    createPlan,
    updatePlan,
    deletePlan,
  };
};

