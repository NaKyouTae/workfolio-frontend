"use client";

import React, { useEffect } from 'react';
import { useCredits } from '@/hooks/useCredits';
import styles from './CreditHistory.module.css';

interface CreditBalanceProps {
    onOpenPaymentWidget?: () => void;
}

const CreditBalance: React.FC<CreditBalanceProps> = ({ onOpenPaymentWidget }) => {
    const { balance, loading, fetchBalance } = useCredits();

    useEffect(() => {
        fetchBalance();
    }, [fetchBalance]);

    const formatNumber = (num: number): string => {
        return num.toLocaleString('ko-KR');
    };

    return (
        <div className={styles.balanceCard}>
            <div className={styles.balanceHeader}>
                <h4>보유 크레딧</h4>
            </div>
            <div className={styles.balanceAmount}>
                {loading ? (
                    <span className={styles.loading}>로딩 중...</span>
                ) : (
                    <>
                        <span className={styles.amount}>{formatNumber(balance)}</span>
                        <span className={styles.unit}>크레딧</span>
                    </>
                )}
            </div>
            {onOpenPaymentWidget && (
                <button
                    className={styles.chargeButton}
                    onClick={onOpenPaymentWidget}
                >
                    크레딧 충전하기
                </button>
            )}
        </div>
    );
};

export default CreditBalance;
