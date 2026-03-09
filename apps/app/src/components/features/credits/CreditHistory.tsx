"use client";

import React, { useEffect, useState } from 'react';
import { useCredits } from '@/hooks/useCredits';
import { CreditTxType, getTxTypeLabel, isCreditAddition } from '@workfolio/shared/types/credit';
import Pagination from '@workfolio/shared/ui/Pagination';
import CreditBalance from './CreditBalance';
import EmptyState from '@workfolio/shared/ui/EmptyState';
import styles from './CreditHistory.module.css';

interface CreditHistoryProps {
    onOpenPaymentWidget?: () => void;
}

const TX_FILTERS = [
    { value: 'ALL' as const, label: '전체' },
    { value: 'CHARGE' as const, label: '충전' },
    { value: 'BONUS' as const, label: '보너스' },
    { value: 'USE' as const, label: '사용' },
    { value: 'REFUND' as const, label: '환불' },
] as const;

function getTxIcon(txType: CreditTxType | string): string {
    const type = typeof txType === 'string' ? txType : CreditTxType[txType];
    switch (type) {
        case 'CHARGE': return '↓';
        case 'BONUS': return '★';
        case 'USE': return '↑';
        case 'REFUND': return '↩';
        case 'ADMIN_ADD': return '+';
        case 'ADMIN_DEDUCT': return '−';
        default: return '•';
    }
}

function getTxIconStyle(txType: CreditTxType | string): string {
    const type = typeof txType === 'string' ? txType : CreditTxType[txType];
    switch (type) {
        case 'CHARGE': return styles.txIconCharge;
        case 'BONUS': return styles.txIconBonus;
        case 'USE': return styles.txIconUse;
        case 'REFUND': return styles.txIconRefund;
        case 'ADMIN_ADD':
        case 'ADMIN_DEDUCT': return styles.txIconAdmin;
        default: return styles.txIconAdmin;
    }
}

const CreditHistory: React.FC<CreditHistoryProps> = ({ onOpenPaymentWidget }) => {
    const { history, totalPages, currentPage, historyLoading, historyError, fetchHistory, fetchBalance } = useCredits();
    const [selectedTxType, setSelectedTxType] = useState<CreditTxType | 'ALL'>('ALL');
    const pageSize = 10;

    useEffect(() => {
        fetchBalance();
        fetchHistory(0, pageSize, selectedTxType === 'ALL' ? undefined : selectedTxType);
    }, [fetchHistory, fetchBalance, selectedTxType]);

    const handlePageChange = (page: number) => {
        fetchHistory(page - 1, pageSize, selectedTxType === 'ALL' ? undefined : selectedTxType);
    };

    const handleFilterChange = (value: CreditTxType | 'ALL') => {
        setSelectedTxType(value);
    };

    const formatNumber = (num: number): string => {
        return num.toLocaleString('ko-KR');
    };

    const formatDate = (timestamp: number | string): string => {
        const date = new Date(Number(timestamp));
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className={styles.creditPage}>
            {/* Left: History */}
            <div className={styles.historySection}>
                <div className="cont-tit">
                    <div>
                        <h3>크레딧 내역</h3>
                    </div>
                    <div className={styles.filterContainer}>
                        {TX_FILTERS.map((filter) => (
                            <button
                                key={filter.value}
                                className={`${styles.filterTab} ${
                                    selectedTxType === filter.value ? styles.filterTabActive : ''
                                }`}
                                onClick={() => handleFilterChange(filter.value === 'ALL' ? 'ALL' : filter.value as unknown as CreditTxType)}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>

                {historyError && (
                    <div className={styles.errorMessage}>
                        {historyError}
                    </div>
                )}

                {/* historyLoading ? (
                    <div className={styles.loadingContainer}>
                        <div className={styles.loadingSpinner} />
                        <span>내역을 불러오는 중...</span>
                    </div>
                ) : */ history.length === 0 ? (
                    <EmptyState text="크레딧 내역이 없습니다." noBorder centerVertically />
                ) : (
                    <>
                        <div className={styles.historyScrollArea}>
                            <div className={styles.historyList}>
                                {history.map((item) => {
                                    const isAddition = isCreditAddition(item.txType);
                                    return (
                                        <div key={item.id} className={styles.historyItem}>
                                            <div className={`${styles.txIconWrap} ${getTxIconStyle(item.txType)}`}>
                                                {getTxIcon(item.txType)}
                                            </div>
                                            <div className={styles.txInfo}>
                                                <div className={styles.txTypeRow}>
                                                    <span className={styles.txTypeBadge}>
                                                        {getTxTypeLabel(item.txType)}
                                                    </span>
                                                </div>
                                                {item.description && (
                                                    <div className={styles.txDescription}>
                                                        {item.description}
                                                    </div>
                                                )}
                                                <div className={styles.txDate}>
                                                    {formatDate(item.createdAt)}
                                                </div>
                                            </div>
                                            <div className={styles.txAmountWrap}>
                                                <div className={`${styles.txAmount} ${isAddition ? styles.positive : styles.negative}`}>
                                                    {isAddition ? '+' : '-'}{formatNumber(Math.abs(item.amount))}
                                                </div>
                                                <div className={styles.txBalanceAfter}>
                                                    잔액 {formatNumber(item.balanceAfter)}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
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

            {/* Right: Balance */}
            <div className={styles.balanceSide}>
                <CreditBalance onOpenPaymentWidget={onOpenPaymentWidget} />
            </div>
        </div>
    );
};

export default CreditHistory;
