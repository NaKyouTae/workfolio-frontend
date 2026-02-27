'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from './AdminDashboard.module.css';

interface DashboardStats {
  totalRecordGroups: number;
  totalRecords: number;
  totalTurnOvers: number;
  totalCareers: number;
  totalPaymentAmount: number;
  totalCreditUsedAmount: number;
  totalAttachments: number;
}

const INITIAL_STATS: DashboardStats = {
  totalRecordGroups: 0,
  totalRecords: 0,
  totalTurnOvers: 0,
  totalCareers: 0,
  totalPaymentAmount: 0,
  totalCreditUsedAmount: 0,
  totalAttachments: 0,
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>(INITIAL_STATS);

  useEffect(() => {
    const loadDashboardStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats', { credentials: 'include' });
        if (!response.ok) {
          return;
        }
        const data = await response.json();
        setStats({
          totalRecordGroups: data.totalRecordGroups ?? 0,
          totalRecords: data.totalRecords ?? 0,
          totalTurnOvers: data.totalTurnOvers ?? 0,
          totalCareers: data.totalCareers ?? 0,
          totalPaymentAmount: data.totalPaymentAmount ?? 0,
          totalCreditUsedAmount: data.totalCreditUsedAmount ?? 0,
          totalAttachments: data.totalAttachments ?? 0,
        });
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      }
    };

    loadDashboardStats();
  }, []);

  const statCards = useMemo(() => {
    const items = [
      { label: '전체 기록 그룹 개수', rawValue: stats.totalRecordGroups, value: stats.totalRecordGroups.toLocaleString(), unit: '개' },
      { label: '전체 기록 내역 개수', rawValue: stats.totalRecords, value: stats.totalRecords.toLocaleString(), unit: '건' },
      { label: '전체 이직 내역 수', rawValue: stats.totalTurnOvers, value: stats.totalTurnOvers.toLocaleString(), unit: '건' },
      { label: '전체 이력 내역 수', rawValue: stats.totalCareers, value: stats.totalCareers.toLocaleString(), unit: '건' },
      { label: '총 결제 금액', rawValue: stats.totalPaymentAmount, value: stats.totalPaymentAmount.toLocaleString(), unit: '원' },
      { label: '총 크레딧 사용 금액', rawValue: stats.totalCreditUsedAmount, value: stats.totalCreditUsedAmount.toLocaleString(), unit: '크레딧' },
      { label: '총 첨부파일 개수', rawValue: stats.totalAttachments, value: stats.totalAttachments.toLocaleString(), unit: '개' },
    ];

    const maxValue = Math.max(...items.map((item) => item.rawValue), 1);
    return items.map((item) => ({
      ...item,
      ratio: Math.max(8, Math.round((item.rawValue / maxValue) * 100)),
    }));
  }, [stats]);

  const todayLabel = useMemo(
    () =>
      new Intl.DateTimeFormat('ko-KR', {
        dateStyle: 'full',
      }).format(new Date()),
    []
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1>대시보드</h1>
        <p>운영 핵심 지표를 한 번에 확인할 수 있는 통계 보드입니다.</p>
      </div>

      <div className={styles.content}>
        <div className={styles.overview}>
          <div className={styles.overviewTop}>
            <div className={styles.overviewTitle}>운영 통계 리포트</div>
            <div className={styles.overviewDate}>{todayLabel}</div>
          </div>
        </div>

        <div className={styles.statsGrid}>
          {statCards.map((card, index) => (
            <div key={card.label} className={`${styles.statCard} ${styles[`tone${(index % 4) + 1}`]}`}>
              <div className={styles.statHeader}>
                <div className={styles.statLabel}>{card.label}</div>
                <div className={styles.statUnit}>{card.unit}</div>
              </div>
              <div className={styles.statValue}>{card.value}</div>
              <div className={styles.statTrack}>
                <div className={styles.statFill} style={{ width: `${card.ratio}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
