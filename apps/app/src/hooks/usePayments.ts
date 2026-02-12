import { useState, useCallback } from 'react';
import HttpMethod from '@workfolio/shared/enums/HttpMethod';
import { Payment, Payment_PaymentStatus, Payment_PaymentMethod } from '@workfolio/shared/generated/common';

interface PaymentListResponse {
    payments: Payment[];
    totalElements?: number;
    totalPages?: number;
    currentPage?: number;
}

interface PaymentCreateRequest {
    creditPlanId: string;
    paymentMethod: Payment_PaymentMethod;
}

interface PaymentCreateResponse {
    payment: Payment;
    // Toss Payment integration fields
    orderId?: string;
    orderName?: string;
    amount?: number;
    successUrl?: string;
    failUrl?: string;
}

interface PaymentConfirmRequest {
    paymentId: string;
    providerPaymentId: string;
    orderId?: string;
    amount?: number;
}

interface PaymentRefundRequest {
    refundAmount: number;
    refundReason: string;
}

interface UsePaymentsReturn {
    payments: Payment[];
    selectedPayment: Payment | null;
    totalPages: number;
    currentPage: number;
    totalElements: number;
    loading: boolean;
    error: string | null;
    fetchPayments: (page?: number, size?: number) => Promise<void>;
    fetchPaymentDetails: (id: string) => Promise<Payment | null>;
    createPayment: (creditPlanId: string, paymentMethod?: Payment_PaymentMethod) => Promise<PaymentCreateResponse | null>;
    confirmPayment: (paymentId: string, providerPaymentId: string, orderId?: string, amount?: number) => Promise<Payment | null>;
    requestRefund: (paymentId: string, refundAmount: number, refundReason: string) => Promise<Payment | null>;
    setSelectedPayment: (payment: Payment | null) => void;
}

// Helper function to get payment status in Korean
export function getPaymentStatusLabel(status: Payment_PaymentStatus | string): string {
    const statusValue = typeof status === 'string' ? status : String(Payment_PaymentStatus[status]);
    switch (statusValue) {
        case 'PENDING':
            return '대기중';
        case 'COMPLETED':
            return '완료';
        case 'FAILED':
            return '실패';
        case 'REFUNDED':
            return '환불';
        default:
            return '알 수 없음';
    }
}

// Helper function to get payment method in Korean
export function getPaymentMethodLabel(method: Payment_PaymentMethod | string): string {
    const methodValue = typeof method === 'string' ? method : String(Payment_PaymentMethod[method]);
    switch (methodValue) {
        case 'CARD':
            return '카드';
        case 'CASH':
            return '현금';
        default:
            return '알 수 없음';
    }
}

export const usePayments = (): UsePaymentsReturn => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalElements, setTotalElements] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPayments = useCallback(async (page: number = 0, size: number = 10) => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`/api/payments?page=${page}&size=${size}`, {
                method: HttpMethod.GET,
            });

            if (!response.ok) {
                if (response.status === 401) {
                    setError('로그인이 필요합니다.');
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: PaymentListResponse = await response.json();
            setPayments(data.payments ?? []);
            setTotalPages(data.totalPages ?? 0);
            setCurrentPage(data.currentPage ?? 0);
            setTotalElements(data.totalElements ?? 0);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : '결제 내역 조회 중 오류가 발생했습니다.';
            setError(errorMessage);
            console.error('Error fetching payments:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchPaymentDetails = useCallback(async (id: string): Promise<Payment | null> => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`/api/payments/${id}`, {
                method: HttpMethod.GET,
            });

            if (!response.ok) {
                if (response.status === 401) {
                    setError('로그인이 필요합니다.');
                    return null;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const payment = data.payment;
            setSelectedPayment(payment);
            return payment;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : '결제 상세 조회 중 오류가 발생했습니다.';
            setError(errorMessage);
            console.error('Error fetching payment details:', err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const createPayment = useCallback(async (
        creditPlanId: string,
        paymentMethod: Payment_PaymentMethod = Payment_PaymentMethod.CARD
    ): Promise<PaymentCreateResponse | null> => {
        try {
            setLoading(true);
            setError(null);

            const requestBody: PaymentCreateRequest = {
                creditPlanId,
                paymentMethod,
            };

            const response = await fetch('/api/payments', {
                method: HttpMethod.POST,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    setError('로그인이 필요합니다.');
                    return null;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: PaymentCreateResponse = await response.json();
            return data;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : '결제 생성 중 오류가 발생했습니다.';
            setError(errorMessage);
            console.error('Error creating payment:', err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const confirmPayment = useCallback(async (
        paymentId: string,
        providerPaymentId: string,
        orderId?: string,
        amount?: number
    ): Promise<Payment | null> => {
        try {
            setLoading(true);
            setError(null);

            const requestBody: PaymentConfirmRequest = {
                paymentId,
                providerPaymentId,
                orderId,
                amount,
            };

            const response = await fetch('/api/payments/confirm', {
                method: HttpMethod.POST,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    setError('로그인이 필요합니다.');
                    return null;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.payment;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : '결제 확인 중 오류가 발생했습니다.';
            setError(errorMessage);
            console.error('Error confirming payment:', err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const requestRefund = useCallback(async (
        paymentId: string,
        refundAmount: number,
        refundReason: string
    ): Promise<Payment | null> => {
        try {
            setLoading(true);
            setError(null);

            const requestBody: PaymentRefundRequest = {
                refundAmount,
                refundReason,
            };

            const response = await fetch(`/api/payments/${paymentId}/refund`, {
                method: HttpMethod.POST,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    setError('로그인이 필요합니다.');
                    return null;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            // Update the payment in the list
            setPayments(prev =>
                prev.map(p => p.id === paymentId ? data.payment : p)
            );
            return data.payment;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : '환불 요청 중 오류가 발생했습니다.';
            setError(errorMessage);
            console.error('Error requesting refund:', err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        payments,
        selectedPayment,
        totalPages,
        currentPage,
        totalElements,
        loading,
        error,
        fetchPayments,
        fetchPaymentDetails,
        createPayment,
        confirmPayment,
        requestRefund,
        setSelectedPayment,
    };
};
