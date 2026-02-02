import { useState, useCallback } from 'react';
import HttpMethod from '@/enums/HttpMethod';
import { CreditPlan, CreditPlanListResponse } from '@/types/credit';

interface UseCreditPlansReturn {
    plans: CreditPlan[];
    loading: boolean;
    error: string | null;
    fetchPlans: () => Promise<void>;
}

export const useCreditPlans = (): UseCreditPlansReturn => {
    const [plans, setPlans] = useState<CreditPlan[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPlans = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/credit-plans', { method: HttpMethod.GET });

            if (!response.ok) {
                if (response.status === 401) {
                    setError('로그인이 필요합니다.');
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: CreditPlanListResponse = await response.json();
            // Sort by displayOrder and filter only active plans
            const activePlans = (data.creditPlans ?? [])
                .filter(plan => plan.isActive)
                .sort((a, b) => a.displayOrder - b.displayOrder);
            setPlans(activePlans);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : '크레딧 플랜 조회 중 오류가 발생했습니다.';
            setError(errorMessage);
            console.error('Error fetching credit plans:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        plans,
        loading,
        error,
        fetchPlans,
    };
};
