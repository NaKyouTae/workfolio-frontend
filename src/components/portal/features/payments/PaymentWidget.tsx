"use client";

import React, { useEffect, useState } from 'react';
import { useCreditPlans } from '@/hooks/useCreditPlans';
import { usePayments } from '@/hooks/usePayments';
import { useNotification } from '@/hooks/useNotification';
import { CreditPlan } from '@/types/credit';
import { Payment_PaymentMethod } from '@/generated/common';
import styles from './PaymentWidget.module.css';

interface PaymentWidgetProps {
    isOpen: boolean;
    onClose: () => void;
    onPaymentSuccess?: () => void;
}

const PaymentWidget: React.FC<PaymentWidgetProps> = ({
    isOpen,
    onClose,
    onPaymentSuccess,
}) => {
    const { plans, loading: plansLoading, fetchPlans } = useCreditPlans();
    const { createPayment, confirmPayment, loading: paymentLoading } = usePayments();
    const { showNotification } = useNotification();
    const [selectedPlan, setSelectedPlan] = useState<CreditPlan | null>(null);
    const [step, setStep] = useState<'select' | 'confirm' | 'processing'>('select');

    useEffect(() => {
        if (isOpen) {
            fetchPlans();
            setSelectedPlan(null);
            setStep('select');
        }
    }, [isOpen, fetchPlans]);

    const formatNumber = (num: number): string => {
        return num.toLocaleString('ko-KR');
    };

    const handlePlanSelect = (plan: CreditPlan) => {
        setSelectedPlan(plan);
    };

    const handleProceedToConfirm = () => {
        if (!selectedPlan) {
            showNotification('충전할 상품을 선택해주세요.', 'error');
            return;
        }
        setStep('confirm');
    };

    const handleBackToSelect = () => {
        setStep('select');
    };

    const handlePayment = async () => {
        if (!selectedPlan) return;

        setStep('processing');

        try {
            // Create payment request
            const paymentResult = await createPayment(
                selectedPlan.id,
                Payment_PaymentMethod.CARD
            );

            if (!paymentResult) {
                showNotification('결제 생성 중 오류가 발생했습니다.', 'error');
                setStep('confirm');
                return;
            }

            // TODO: Integrate with Toss Payment SDK
            // The actual Toss Payment integration would be done here.
            // For now, we'll simulate a successful payment flow.
            //
            // Example Toss Payment integration:
            // 1. Load Toss Payment SDK
            // 2. Call tossPayments.requestPayment({
            //      amount: paymentResult.amount,
            //      orderId: paymentResult.orderId,
            //      orderName: paymentResult.orderName,
            //      successUrl: paymentResult.successUrl,
            //      failUrl: paymentResult.failUrl,
            //    })
            // 3. On success callback, call confirmPayment with the provider payment ID

            // Simulate Toss Payment completion for demo purposes
            // In production, this would be handled by Toss Payment callback
            const mockProviderPaymentId = `toss_${Date.now()}`;

            const confirmedPayment = await confirmPayment(
                paymentResult.payment.id,
                mockProviderPaymentId,
                paymentResult.orderId,
                paymentResult.amount
            );

            if (confirmedPayment) {
                showNotification('결제가 완료되었습니다.', 'success');
                onPaymentSuccess?.();
                onClose();
            } else {
                showNotification('결제 확인 중 오류가 발생했습니다.', 'error');
                setStep('confirm');
            }
        } catch (error) {
            console.error('Payment error:', error);
            showNotification('결제 처리 중 오류가 발생했습니다.', 'error');
            setStep('confirm');
        }
    };

    const handleClose = () => {
        if (step !== 'processing') {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ''}`}
                onClick={handleClose}
            />

            {/* Left Slide Panel */}
            <div className={`${styles.panel} ${isOpen ? styles.panelOpen : ''}`}>
                <div className={styles.header}>
                    <h3>크레딧 충전</h3>
                    <button
                        className={styles.closeButton}
                        onClick={handleClose}
                        disabled={step === 'processing'}
                    >
                        &times;
                    </button>
                </div>

                <div className={styles.content}>
                    {step === 'select' && (
                        <>
                            <p className={styles.description}>
                                충전할 크레딧 상품을 선택해주세요.
                            </p>

                            {plansLoading ? (
                                <div className={styles.loadingContainer}>
                                    <span>상품 정보를 불러오는 중...</span>
                                </div>
                            ) : plans.length === 0 ? (
                                <div className={styles.emptyMessage}>
                                    현재 이용 가능한 상품이 없습니다.
                                </div>
                            ) : (
                                <div className={styles.planList}>
                                    {plans.map((plan) => (
                                        <div
                                            key={plan.id}
                                            className={`${styles.planCard} ${selectedPlan?.id === plan.id ? styles.planCardSelected : ''} ${plan.isPopular ? styles.planCardPopular : ''}`}
                                            onClick={() => handlePlanSelect(plan)}
                                        >
                                            {plan.isPopular && (
                                                <span className={styles.popularBadge}>인기</span>
                                            )}
                                            <div className={styles.planName}>{plan.name}</div>
                                            {plan.description && (
                                                <div className={styles.planDescription}>
                                                    {plan.description}
                                                </div>
                                            )}
                                            <div className={styles.planCredits}>
                                                <span className={styles.baseCredits}>
                                                    {formatNumber(plan.baseCredits)} 크레딧
                                                </span>
                                                {plan.bonusCredits > 0 && (
                                                    <span className={styles.bonusCredits}>
                                                        +{formatNumber(plan.bonusCredits)} 보너스
                                                    </span>
                                                )}
                                            </div>
                                            <div className={styles.planTotal}>
                                                총 {formatNumber(plan.totalCredits)} 크레딧
                                            </div>
                                            <div className={styles.planPrice}>
                                                {formatNumber(plan.price)}원
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className={styles.footer}>
                                <button
                                    className={styles.cancelButton}
                                    onClick={onClose}
                                >
                                    취소
                                </button>
                                <button
                                    className={styles.primaryButton}
                                    onClick={handleProceedToConfirm}
                                    disabled={!selectedPlan}
                                >
                                    다음
                                </button>
                            </div>
                        </>
                    )}

                    {step === 'confirm' && selectedPlan && (
                        <>
                            <p className={styles.description}>
                                결제 정보를 확인해주세요.
                            </p>

                            <div className={styles.confirmBox}>
                                <div className={styles.confirmRow}>
                                    <span className={styles.confirmLabel}>상품명</span>
                                    <span className={styles.confirmValue}>{selectedPlan.name}</span>
                                </div>
                                <div className={styles.confirmRow}>
                                    <span className={styles.confirmLabel}>기본 크레딧</span>
                                    <span className={styles.confirmValue}>
                                        {formatNumber(selectedPlan.baseCredits)} 크레딧
                                    </span>
                                </div>
                                {selectedPlan.bonusCredits > 0 && (
                                    <div className={styles.confirmRow}>
                                        <span className={styles.confirmLabel}>보너스 크레딧</span>
                                        <span className={`${styles.confirmValue} ${styles.bonusValue}`}>
                                            +{formatNumber(selectedPlan.bonusCredits)} 크레딧
                                        </span>
                                    </div>
                                )}
                                <div className={`${styles.confirmRow} ${styles.confirmTotal}`}>
                                    <span className={styles.confirmLabel}>총 크레딧</span>
                                    <span className={styles.confirmValue}>
                                        {formatNumber(selectedPlan.totalCredits)} 크레딧
                                    </span>
                                </div>
                                <div className={`${styles.confirmRow} ${styles.confirmPrice}`}>
                                    <span className={styles.confirmLabel}>결제 금액</span>
                                    <span className={styles.confirmValue}>
                                        {formatNumber(selectedPlan.price)}원
                                    </span>
                                </div>
                            </div>

                            <div className={styles.paymentNotice}>
                                <p>결제 진행 시 Toss 결제 창으로 이동합니다.</p>
                                {/* TODO: Add actual Toss Payment integration notice */}
                            </div>

                            <div className={styles.footer}>
                                <button
                                    className={styles.cancelButton}
                                    onClick={handleBackToSelect}
                                >
                                    이전
                                </button>
                                <button
                                    className={styles.primaryButton}
                                    onClick={handlePayment}
                                    disabled={paymentLoading}
                                >
                                    {paymentLoading ? '처리 중...' : `${formatNumber(selectedPlan.price)}원 결제하기`}
                                </button>
                            </div>
                        </>
                    )}

                    {step === 'processing' && (
                        <div className={styles.processingContainer}>
                            <div className={styles.spinner} />
                            <p>결제를 처리하고 있습니다...</p>
                            <p className={styles.processingNotice}>
                                잠시만 기다려주세요.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default PaymentWidget;
