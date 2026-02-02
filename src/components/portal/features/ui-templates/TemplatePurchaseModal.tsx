'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { UITemplate, formatDuration } from '@/types/uitemplate';
import styles from './TemplatePurchaseModal.module.css';

interface TemplatePurchaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    template: UITemplate | null;
    balance: number;
    onPurchase: (uiTemplateId: string, planId?: string) => Promise<unknown>;
    onSuccess: () => void;
}

const TemplatePurchaseModal: React.FC<TemplatePurchaseModalProps> = ({
    isOpen,
    onClose,
    template,
    balance,
    onPurchase,
    onSuccess,
}) => {
    const plans = useMemo(() => {
        if (!template?.plans?.length) return [];
        return [...template.plans].sort((a, b) => a.displayOrder - b.displayOrder);
    }, [template?.plans]);

    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(
        plans.length > 0 ? plans[0].id : null
    );
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && plans.length > 0) {
            setSelectedPlanId(plans[0].id);
        } else if (isOpen && plans.length === 0) {
            setSelectedPlanId(null);
        }
    }, [isOpen, template?.id, plans.length]);

    const selectedPlan = selectedPlanId ? plans.find((p) => p.id === selectedPlanId) : null;
    const finalPrice = selectedPlan ? selectedPlan.price : template?.price ?? 0;
    const canPurchase = finalPrice > 0 && balance >= finalPrice;

    const handlePurchase = async () => {
        if (!template || loading || !canPurchase) return;
        setLoading(true);
        try {
            await onPurchase(template.id, selectedPlan?.id);
            onSuccess();
            onClose();
        } finally {
            setLoading(false);
        }
    };

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={handleOverlayClick}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>{template?.name ?? '템플릿'} 구매</h2>
                    <button type="button" className={styles.closeButton} onClick={onClose} aria-label="닫기">
                        ×
                    </button>
                </div>
                <div className={styles.content}>
                    {plans.length > 0 ? (
                        <>
                            <p className={styles.noPlanHint}>이용 기간을 선택하세요.</p>
                            <div className={styles.planList}>
                                {plans.map((plan) => (
                                    <button
                                        key={plan.id}
                                        type="button"
                                        className={styles.planRow + (selectedPlanId === plan.id ? ` ${styles.selected}` : '')}
                                        onClick={() => setSelectedPlanId(plan.id)}
                                    >
                                        <span className={styles.planRowLabel}>
                                            {formatDuration(plan.durationDays)}
                                        </span>
                                        <span className={styles.planRowPrice}>
                                            {plan.price.toLocaleString()} 크레딧
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </>
                    ) : (
                        <p className={styles.noPlanHint}>
                            {template ? `${template.name} · ${(template.price).toLocaleString()} 크레딧 · ${formatDuration(template.durationDays)}` : ''}
                        </p>
                    )}
                    <div className={styles.finalRow}>
                        <span className={styles.finalLabel}>결제 금액</span>
                        <span className={styles.finalAmount}>{finalPrice.toLocaleString()} 크레딧</span>
                    </div>
                    {balance < finalPrice && (
                        <p style={{ marginTop: '8px', fontSize: '13px', color: '#dc2626' }}>
                            보유 크레딧이 부족합니다. (보유: {balance.toLocaleString()} 크레딧)
                        </p>
                    )}
                </div>
                <div className={styles.footer}>
                    <button type="button" className={styles.cancelButton} onClick={onClose}>
                        취소
                    </button>
                    <button
                        type="button"
                        className={styles.purchaseButton}
                        onClick={handlePurchase}
                        disabled={!canPurchase || loading}
                    >
                        {loading ? '처리 중…' : '구매하기'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TemplatePurchaseModal;
