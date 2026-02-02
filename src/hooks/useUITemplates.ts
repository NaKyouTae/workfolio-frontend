import { useState, useCallback } from 'react';
import HttpMethod from '@/enums/HttpMethod';
import {
    UITemplate,
    WorkerUITemplate,
    UITemplateListResponse,
    WorkerUITemplateListResponse,
    UITemplatePurchaseResponse,
    UITemplateOwnershipResponse,
    ActiveUITemplatesResponse,
    UITemplateType,
} from '@/types/uitemplate';

interface UseUITemplatesReturn {
    uiTemplates: UITemplate[];
    myUITemplates: WorkerUITemplate[];
    activeUITemplates: WorkerUITemplate[];
    totalPages: number;
    currentPage: number;
    totalElements: number;
    loading: boolean;
    error: string | null;
    fetchUITemplates: (type?: UITemplateType | string) => Promise<void>;
    fetchMyUITemplates: (page?: number, size?: number) => Promise<void>;
    fetchActiveUITemplates: (type?: UITemplateType | string) => Promise<void>;
    purchaseUITemplate: (uiTemplateId: string) => Promise<UITemplatePurchaseResponse | null>;
    checkOwnership: (uiTemplateId: string) => Promise<UITemplateOwnershipResponse | null>;
}

export const useUITemplates = (): UseUITemplatesReturn => {
    const [uiTemplates, setUITemplates] = useState<UITemplate[]>([]);
    const [myUITemplates, setMyUITemplates] = useState<WorkerUITemplate[]>([]);
    const [activeUITemplates, setActiveUITemplates] = useState<WorkerUITemplate[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalElements, setTotalElements] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch all UI templates (public API)
    const fetchUITemplates = useCallback(async (type?: UITemplateType | string) => {
        try {
            setLoading(true);
            setError(null);

            let url = '/api/anonymous/ui-templates';
            if (type !== undefined && type !== null) {
                const typeValue = typeof type === 'string' ? type : UITemplateType[type];
                url += `?type=${typeValue}`;
            }

            const response = await fetch(url, { method: HttpMethod.GET });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: UITemplateListResponse = await response.json();
            setUITemplates(data.uiTemplates ?? []);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : '템플릿 조회 중 오류가 발생했습니다.';
            setError(errorMessage);
            console.error('Error fetching UI templates:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch my UI templates (authenticated API)
    const fetchMyUITemplates = useCallback(async (page: number = 0, size: number = 20) => {
        try {
            setLoading(true);
            setError(null);

            const url = `/api/ui-templates/my?page=${page}&size=${size}`;
            const response = await fetch(url, { method: HttpMethod.GET });

            if (!response.ok) {
                if (response.status === 401) {
                    setError('로그인이 필요합니다.');
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: WorkerUITemplateListResponse = await response.json();
            setMyUITemplates(data.workerUiTemplates ?? []);
            setTotalPages(data.totalPages ?? 0);
            setCurrentPage(data.currentPage ?? 0);
            setTotalElements(data.totalElements ?? 0);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : '보유 템플릿 조회 중 오류가 발생했습니다.';
            setError(errorMessage);
            console.error('Error fetching my UI templates:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch active UI templates (authenticated API)
    const fetchActiveUITemplates = useCallback(async (type?: UITemplateType | string) => {
        try {
            setLoading(true);
            setError(null);

            let url = '/api/ui-templates/my/active';
            if (type !== undefined && type !== null) {
                const typeValue = typeof type === 'string' ? type : UITemplateType[type];
                url += `?type=${typeValue}`;
            }

            const response = await fetch(url, { method: HttpMethod.GET });

            if (!response.ok) {
                if (response.status === 401) {
                    setError('로그인이 필요합니다.');
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: ActiveUITemplatesResponse = await response.json();
            setActiveUITemplates(data.workerUiTemplates ?? []);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : '유효 템플릿 조회 중 오류가 발생했습니다.';
            setError(errorMessage);
            console.error('Error fetching active UI templates:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Purchase UI template
    const purchaseUITemplate = useCallback(async (uiTemplateId: string): Promise<UITemplatePurchaseResponse | null> => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/ui-templates/purchase', {
                method: HttpMethod.POST,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ uiTemplateId }),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    setError('로그인이 필요합니다.');
                    return null;
                }
                const errorData = await response.json();
                setError(errorData.message || '템플릿 구매에 실패했습니다.');
                return null;
            }

            const data: UITemplatePurchaseResponse = await response.json();
            return data;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : '템플릿 구매 중 오류가 발생했습니다.';
            setError(errorMessage);
            console.error('Error purchasing UI template:', err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // Check UI template ownership
    const checkOwnership = useCallback(async (uiTemplateId: string): Promise<UITemplateOwnershipResponse | null> => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`/api/ui-templates/check/${uiTemplateId}`, {
                method: HttpMethod.GET,
            });

            if (!response.ok) {
                if (response.status === 401) {
                    return { ownsUiTemplate: false };
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: UITemplateOwnershipResponse = await response.json();
            return data;
        } catch (err) {
            console.error('Error checking UI template ownership:', err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        uiTemplates,
        myUITemplates,
        activeUITemplates,
        totalPages,
        currentPage,
        totalElements,
        loading,
        error,
        fetchUITemplates,
        fetchMyUITemplates,
        fetchActiveUITemplates,
        purchaseUITemplate,
        checkOwnership,
    };
};
