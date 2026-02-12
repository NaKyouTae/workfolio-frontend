"use client";

import React, { useEffect, useState } from 'react';
import { usePayments, getPaymentStatusLabel, getPaymentMethodLabel } from '@/hooks/usePayments';
import { Payment_PaymentStatus } from '@workfolio/shared/generated/common';
import Pagination from '@workfolio/shared/ui/Pagination';
import { useNotification } from '@workfolio/shared/hooks/useNotification';
import styles from './PaymentHistory.module.css';

interface PaymentHistoryProps {
    onOpenPaymentWidget?: () => void;
}

const PaymentHistory: React.FC<PaymentHistoryProps> = ({ onOpenPaymentWidget }) => {
    const {
        payments,
        totalPages,
        currentPage,
        loading,
        error,
        fetchPayments,
        requestRefund,
    } = usePayments();
    const { showNotification } = useNotification();
    const [refundingId, setRefundingId] = useState<string | null>(null);
    const [refundReason, setRefundReason] = useState<string>('');
    const [showRefundModal, setShowRefundModal] = useState<boolean>(false);
    const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
    const pageSize = 10;

    useEffect(() => {
        fetchPayments(0, pageSize);
    }, [fetchPayments]);

    const handlePageChange = (page: number) => {
        fetchPayments(page - 1, pageSize);
    };

    const formatNumber = (num: number): string => {
        return num.toLocaleString('ko-KR');
    };

    const formatDate = (timestamp: number | undefined): string => {
        if (!timestamp) return '-';
        const date = new Date(timestamp);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusClass = (status: Payment_PaymentStatus | string): string => {
        const statusValue = typeof status === 'string' ? status : String(Payment_PaymentStatus[status]);
        switch (statusValue) {
            case 'COMPLETED':
                return styles.statusCompleted;
            case 'PENDING':
                return styles.statusPending;
            case 'FAILED':
                return styles.statusFailed;
            case 'REFUNDED':
                return styles.statusRefunded;
            default:
                return '';
        }
    };

    const canRefund = (status: Payment_PaymentStatus | string): boolean => {
        const statusValue = typeof status === 'string' ? status : String(Payment_PaymentStatus[status]);
        return statusValue === 'COMPLETED';
    };

    const handleRefundClick = (paymentId: string) => {
        setSelectedPaymentId(paymentId);
        setRefundReason('');
        setShowRefundModal(true);
    };

    const handleRefundSubmit = async () => {
        if (!selectedPaymentId) return;
        if (!refundReason.trim()) {
            showNotification('환불 사유를 입력해주세요.', 'error');
            return;
        }

        const payment = payments.find(p => p.id === selectedPaymentId);
        if (!payment) return;

        setRefundingId(selectedPaymentId);
        try {
            const result = await requestRefund(selectedPaymentId, payment.amount, refundReason);
            if (result) {
                showNotification('환불 요청이 완료되었습니다.', 'success');
                setShowRefundModal(false);
                fetchPayments(currentPage, pageSize);
            }
        } catch {
            showNotification('환불 요청 중 오류가 발생했습니다.', 'error');
        } finally {
            setRefundingId(null);
        }
    };

    return (
        <article>
            <div className="cont-box">
                <div className="cont-tit">
                    <div>
                        <h3>결제 내역</h3>
                    </div>
                    {onOpenPaymentWidget && (
                        <button
                            className={styles.addPaymentButton}
                            onClick={onOpenPaymentWidget}
                        >
                            추가 결제
                        </button>
                    )}
                </div>

                {error && (
                    <div className={styles.errorMessage}>
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className={styles.loadingContainer}>
                        <span>로딩 중...</span>
                    </div>
                ) : payments.length === 0 ? (
                    <div className={styles.emptyMessage}>
                        결제 내역이 없습니다.
                    </div>
                ) : (
                    <>
                        <div className={styles.paymentList}>
                            <div className={styles.paymentHeader}>
                                <span className={styles.headerDate}>결제일시</span>
                                <span className={styles.headerPlan}>상품</span>
                                <span className={styles.headerMethod}>결제수단</span>
                                <span className={styles.headerAmount}>금액</span>
                                <span className={styles.headerStatus}>상태</span>
                                <span className={styles.headerAction}>관리</span>
                            </div>
                            {payments.map((payment) => (
                                <div key={payment.id} className={styles.paymentItem}>
                                    <span className={styles.date}>
                                        {formatDate(payment.paidAt || payment.createdAt)}
                                    </span>
                                    <span className={styles.plan}>
                                        {payment.metadataJson ?
                                            (() => {
                                                try {
                                                    const metadata = JSON.parse(payment.metadataJson);
                                                    return metadata.planName || '크레딧 충전';
                                                } catch {
                                                    return '크레딧 충전';
                                                }
                                            })() : '크레딧 충전'
                                        }
                                    </span>
                                    <span className={styles.method}>
                                        {getPaymentMethodLabel(payment.paymentMethod)}
                                    </span>
                                    <span className={styles.amount}>
                                        {formatNumber(payment.amount)}원
                                    </span>
                                    <span className={`${styles.status} ${getStatusClass(payment.status)}`}>
                                        {getPaymentStatusLabel(payment.status)}
                                    </span>
                                    <span className={styles.action}>
                                        {canRefund(payment.status) && (
                                            <button
                                                className={styles.refundButton}
                                                onClick={() => handleRefundClick(payment.id)}
                                                disabled={refundingId === payment.id}
                                            >
                                                {refundingId === payment.id ? '처리중...' : '환불'}
                                            </button>
                                        )}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage + 1}
                                totalPages={totalPages}
                                itemsPerPage={pageSize}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </>
                )}
            </div>

            {/* Refund Modal */}
            {showRefundModal && (
                <div className={styles.modalOverlay} onClick={() => setShowRefundModal(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h4>환불 요청</h4>
                            <button
                                className={styles.closeButton}
                                onClick={() => setShowRefundModal(false)}
                            >
                                &times;
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <label className={styles.label}>
                                환불 사유
                                <textarea
                                    className={styles.textarea}
                                    value={refundReason}
                                    onChange={(e) => setRefundReason(e.target.value)}
                                    placeholder="환불 사유를 입력해주세요."
                                    rows={4}
                                />
                            </label>
                        </div>
                        <div className={styles.modalFooter}>
                            <button
                                className={styles.cancelButton}
                                onClick={() => setShowRefundModal(false)}
                            >
                                취소
                            </button>
                            <button
                                className={styles.submitButton}
                                onClick={handleRefundSubmit}
                                disabled={refundingId !== null}
                            >
                                {refundingId !== null ? '처리중...' : '환불 요청'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </article>
    );
};

export default PaymentHistory;
