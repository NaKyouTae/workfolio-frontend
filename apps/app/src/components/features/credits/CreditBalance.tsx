"use client";

import React, { useEffect } from 'react';
import { useCredits } from '@/hooks/useCredits';
import styles from './CreditHistory.module.css';

interface CreditBalanceProps {
    onOpenPaymentWidget?: () => void;
    /** 플로팅 등 좁은 영역용 컴팩트 스타일 */
    compact?: boolean;
}

const CreditBalance: React.FC<CreditBalanceProps> = ({ onOpenPaymentWidget, compact = false }) => {
    const { balance, balanceLoading, fetchBalance } = useCredits();

    useEffect(() => {
        fetchBalance();
    }, [fetchBalance]);

    const formatNumber = (num: number): string => {
        return num.toLocaleString('ko-KR');
    };

    return (
        <div className={`${styles.balanceCard} ${compact ? styles.balanceCardCompact : ''}`}>
            <div className={styles.balanceInfo}>
                <div className={styles.balanceHeader}>
                    <div className={styles.balanceLabel}>
                        <h4>보유 크레딧</h4>
                    </div>
                </div>
                <div className={styles.balanceAmount}>
                    {balanceLoading ? (
                        <span className={styles.loading}>불러오는 중...</span>
                    ) : (
                        <>
                            <span className={styles.balanceAmountValue}>{formatNumber(balance)}</span>
                            <span className={styles.unit}>크레딧</span>
                        </>
                    )}
                </div>
            </div>
            {onOpenPaymentWidget && (
                <button
                    className={styles.chargeButton}
                    onClick={onOpenPaymentWidget}
                >
                    충전하기
                </button>
            )}
        </div>
    );
};

export default CreditBalance;
