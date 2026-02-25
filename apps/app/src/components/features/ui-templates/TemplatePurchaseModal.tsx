'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { UITemplate, formatDuration } from '@workfolio/shared/types/uitemplate';
import { useNotification } from '@workfolio/shared/hooks/useNotification';
import styles from './TemplatePurchaseModal.module.css';

interface TemplatePurchaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    template: UITemplate | null;
    balance: number;
    isOwned?: boolean;
    onPurchase: (uiTemplateId: string, planId?: string) => Promise<unknown>;
    onSuccess: () => void;
}

const TemplatePurchaseModal: React.FC<TemplatePurchaseModalProps> = ({
    isOpen,
    onClose,
    template,
    balance,
    isOwned = false,
    onPurchase,
    onSuccess,
}) => {
    const plans = useMemo(() => {
        if (!template?.plans?.length) return [];
        return [...template.plans].sort((a, b) => a.displayOrder - b.displayOrder);
    }, [template?.plans]);

    const { showNotification } = useNotification();
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
        } catch (err) {
            const message = err instanceof Error ? err.message : '템플릿 구매에 실패했습니다.';
            showNotification(message, 'error');
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
                    {isOwned && (
                        <p className={styles.ownedNotice}>
                            이미 보유한 템플릿입니다. 재구매 시 이용 기간이 연장됩니다.
                        </p>
                    )}
                    {plans.length > 0 ? (
                        <>
                            <p className={styles.planHint}>이용 기간을 선택하세요.</p>
                            <div className={styles.planList} role="radiogroup" aria-label="이용 기간 선택">
                                {plans.map((plan) => (
                                    <label
                                        key={plan.id}
                                        className={styles.planRow + (selectedPlanId === plan.id ? ` ${styles.selected}` : '')}
                                    >
                                        <input
                                            type="radio"
                                            name="plan"
                                            value={plan.id}
                                            checked={selectedPlanId === plan.id}
                                            onChange={() => setSelectedPlanId(plan.id)}
                                            className={styles.planRadio}
                                        />
                                        <span className={styles.planRowLabel}>
                                            {formatDuration(plan.durationDays)}
                                        </span>
                                        <span className={styles.planRowPrice}>
                                            {plan.price.toLocaleString()} 크레딧
                                        </span>
                                    </label>
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
                        <p className={styles.balanceError}>
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
