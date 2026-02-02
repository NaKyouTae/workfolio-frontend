"use client";

import React, { useEffect, useState } from 'react';
import { useCredits } from '@/hooks/useCredits';
import { CreditTxType, getTxTypeLabel, isCreditAddition } from '@/types/credit';
import Pagination from '@/components/portal/ui/Pagination';
import CreditBalance from './CreditBalance';
import styles from './CreditHistory.module.css';

interface CreditHistoryProps {
    onOpenPaymentWidget?: () => void;
}

const CreditHistory: React.FC<CreditHistoryProps> = ({ onOpenPaymentWidget }) => {
    const { history, totalPages, currentPage, loading, error, fetchHistory, fetchBalance } = useCredits();
    const [selectedTxType, setSelectedTxType] = useState<CreditTxType | 'ALL'>('ALL');
    const pageSize = 10;

    useEffect(() => {
        fetchBalance();
        fetchHistory(0, pageSize, selectedTxType === 'ALL' ? undefined : selectedTxType);
    }, [fetchHistory, fetchBalance, selectedTxType]);

    const handlePageChange = (page: number) => {
        fetchHistory(page - 1, pageSize, selectedTxType === 'ALL' ? undefined : selectedTxType);
    };

    const handleTxTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value === 'ALL') {
            setSelectedTxType('ALL');
        } else {
            setSelectedTxType(value as unknown as CreditTxType);
        }
    };

    const formatNumber = (num: number): string => {
        return num.toLocaleString('ko-KR');
    };

    const formatDate = (timestamp: number): string => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <article>
            <CreditBalance onOpenPaymentWidget={onOpenPaymentWidget} />

            <div className="cont-box">
                <div className="cont-tit">
                    <div>
                        <h3>크레딧 내역</h3>
                    </div>
                    <div className={styles.filterContainer}>
                        <select
                            value={selectedTxType === 'ALL' ? 'ALL' : String(selectedTxType)}
                            onChange={handleTxTypeChange}
                            className={styles.filterSelect}
                        >
                            <option value="ALL">전체</option>
                            <option value="CHARGE">충전</option>
                            <option value="BONUS">보너스</option>
                            <option value="USE">사용</option>
                            <option value="REFUND">환불</option>
                        </select>
                    </div>
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
                ) : history.length === 0 ? (
                    <div className={styles.emptyMessage}>
                        크레딧 내역이 없습니다.
                    </div>
                ) : (
                    <>
                        <div className={styles.historyList}>
                            <div className={styles.historyHeader}>
                                <span className={styles.headerDate}>일시</span>
                                <span className={styles.headerType}>유형</span>
                                <span className={styles.headerAmount}>금액</span>
                                <span className={styles.headerBalance}>잔액</span>
                                <span className={styles.headerDescription}>설명</span>
                            </div>
                            {history.map((item) => {
                                const isAddition = isCreditAddition(item.txType);
                                return (
                                    <div key={item.id} className={styles.historyItem}>
                                        <span className={styles.date}>
                                            {formatDate(item.createdAt)}
                                        </span>
                                        <span className={styles.type}>
                                            {getTxTypeLabel(item.txType)}
                                        </span>
                                        <span className={`${styles.amount} ${isAddition ? styles.positive : styles.negative}`}>
                                            {isAddition ? '+' : '-'}{formatNumber(Math.abs(item.amount))}
                                        </span>
                                        <span className={styles.balance}>
                                            {formatNumber(item.balanceAfter)}
                                        </span>
                                        <span className={styles.description}>
                                            {item.description || '-'}
                                        </span>
                                    </div>
                                );
                            })}
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
        </article>
    );
};

export default CreditHistory;
