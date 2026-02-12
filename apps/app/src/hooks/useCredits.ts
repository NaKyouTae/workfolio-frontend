import { useState, useCallback } from 'react';
import HttpMethod from '@workfolio/shared/enums/HttpMethod';
import {
    CreditHistory,
    CreditBalanceResponse,
    CreditHistoryListResponse,
    CreditUseResponse,
    CreditTxType,
} from '@workfolio/shared/types/credit';

interface UseCreditsReturn {
    balance: number;
    history: CreditHistory[];
    totalPages: number;
    currentPage: number;
    totalElements: number;
    loading: boolean;
    error: string | null;
    fetchBalance: () => Promise<void>;
    fetchHistory: (page?: number, size?: number, txType?: CreditTxType | string) => Promise<void>;
    useCredits: (amount: number, description?: string, referenceType?: string, referenceId?: string) => Promise<CreditUseResponse | null>;
}

export const useCredits = (): UseCreditsReturn => {
    const [balance, setBalance] = useState<number>(0);
    const [history, setHistory] = useState<CreditHistory[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalElements, setTotalElements] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchBalance = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/credits', { method: HttpMethod.GET });

            if (!response.ok) {
                if (response.status === 401) {
                    setError('로그인이 필요합니다.');
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: CreditBalanceResponse = await response.json();
            setBalance(data.balance ?? 0);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : '크레딧 잔액 조회 중 오류가 발생했습니다.';
            setError(errorMessage);
            console.error('Error fetching credit balance:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchHistory = useCallback(async (page: number = 0, size: number = 10, txType?: CreditTxType | string) => {
        try {
            setLoading(true);
            setError(null);

            let url = `/api/credits/history?page=${page}&size=${size}`;
            if (txType !== undefined && txType !== null) {
                const txTypeValue = typeof txType === 'string' ? txType : CreditTxType[txType];
                url += `&txType=${txTypeValue}`;
            }

            const response = await fetch(url, { method: HttpMethod.GET });

            if (!response.ok) {
                if (response.status === 401) {
                    setError('로그인이 필요합니다.');
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: CreditHistoryListResponse = await response.json();
            setHistory(data.creditHistories ?? []);
            setTotalPages(data.totalPages ?? 0);
            setCurrentPage(data.currentPage ?? 0);
            setTotalElements(data.totalElements ?? 0);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : '크레딧 내역 조회 중 오류가 발생했습니다.';
            setError(errorMessage);
            console.error('Error fetching credit history:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const useCredits = useCallback(async (
        amount: number,
        description?: string,
        referenceType?: string,
        referenceId?: string
    ): Promise<CreditUseResponse | null> => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/credits/use', {
                method: HttpMethod.POST,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount,
                    description,
                    referenceType,
                    referenceId,
                }),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    setError('로그인이 필요합니다.');
                    return null;
                }
                if (response.status === 400) {
                    setError('크레딧이 부족합니다.');
                    return null;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: CreditUseResponse = await response.json();
            setBalance(data.balanceAfter);
            return data;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : '크레딧 사용 중 오류가 발생했습니다.';
            setError(errorMessage);
            console.error('Error using credits:', err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        balance,
        history,
        totalPages,
        currentPage,
        totalElements,
        loading,
        error,
        fetchBalance,
        fetchHistory,
        useCredits,
    };
};
