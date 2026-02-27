import { useState, useCallback } from 'react';
import { Payment } from '@workfolio/shared/generated/common';

interface AdminPaymentListResponse {
  payments: Payment[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
}

export const useAdminPayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = useCallback(async (workerId: string, page = 0, size = 20) => {
    setLoading(true);
    setError(null);
    try {
      const url = `/api/payments?workerId=${workerId}&page=${page}&size=${size}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch payments');
      }
      const data: AdminPaymentListResponse = await response.json();
      setPayments(data.payments || []);
      setTotalElements(data.totalElements || 0);
      setTotalPages(data.totalPages || 0);
      setCurrentPage(data.currentPage || 0);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error fetching payments:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePayment = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/payments/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete payment');
      }
      const data = await response.json();
      return data.isSuccess || false;
    } catch (err) {
      console.error('Error deleting payment:', err);
      return false;
    }
  }, []);

  return {
    payments,
    totalElements,
    totalPages,
    currentPage,
    loading,
    error,
    fetchPayments,
    deletePayment,
  };
};
