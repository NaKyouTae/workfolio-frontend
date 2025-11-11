'use client';

import { useEffect, useState } from 'react';
import { usePlans } from '@/hooks/usePlans';
import { useFeatures } from '@/hooks/useFeatures';
import { usePlanFeatures } from '@/hooks/usePlanFeatures';
import styles from '@/app/admin/dashboard/dashboard.module.css';

export default function AdminDashboard() {
  const { plans, fetchPlans } = usePlans();
  const { features, fetchFeatures } = useFeatures();
  const { planFeatures, fetchPlanFeatures } = usePlanFeatures();

  const [stats, setStats] = useState({
    totalPlans: 0,
    totalFeatures: 0,
    totalPlanFeatures: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchPlans(),
        fetchFeatures(),
        fetchPlanFeatures(),
      ]);
    };
    loadData();
  }, [fetchPlans, fetchFeatures, fetchPlanFeatures]);

  useEffect(() => {
    setStats({
      totalPlans: plans.length,
      totalFeatures: features.length,
      totalPlanFeatures: planFeatures.length,
    });
  }, [plans, features, planFeatures]);

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1>대시보드</h1>
        <p>Workfolio 관리자 대시보드에 오신 것을 환영합니다.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        <div className={styles.card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ fontSize: '48px' }}>💎</div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#667eea' }}>
                {stats.totalPlans}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>전체 플랜</div>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ fontSize: '48px' }}>⚙️</div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#764ba2' }}>
                {stats.totalFeatures}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>전체 기능</div>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ fontSize: '48px' }}>🔗</div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#10b981' }}>
                {stats.totalPlanFeatures}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>플랜-기능 연결</div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.card} style={{ marginTop: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>빠른 링크</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          <a 
            href="/admin/dashboard/plans" 
            style={{ 
              padding: '20px', 
              background: '#f8f9fa', 
              borderRadius: '8px', 
              textDecoration: 'none',
              color: '#333',
              transition: 'all 0.2s',
              display: 'block'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#e9ecef'}
            onMouseOut={(e) => e.currentTarget.style.background = '#f8f9fa'}
          >
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>💎</div>
            <div style={{ fontWeight: '600' }}>플랜 관리</div>
            <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
              플랜 생성, 수정, 삭제
            </div>
          </a>

          <a 
            href="/admin/dashboard/features" 
            style={{ 
              padding: '20px', 
              background: '#f8f9fa', 
              borderRadius: '8px', 
              textDecoration: 'none',
              color: '#333',
              transition: 'all 0.2s',
              display: 'block'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#e9ecef'}
            onMouseOut={(e) => e.currentTarget.style.background = '#f8f9fa'}
          >
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>⚙️</div>
            <div style={{ fontWeight: '600' }}>기능 관리</div>
            <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
              기능 생성, 수정, 삭제
            </div>
          </a>

          <a 
            href="/admin/dashboard/plan-features" 
            style={{ 
              padding: '20px', 
              background: '#f8f9fa', 
              borderRadius: '8px', 
              textDecoration: 'none',
              color: '#333',
              transition: 'all 0.2s',
              display: 'block'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#e9ecef'}
            onMouseOut={(e) => e.currentTarget.style.background = '#f8f9fa'}
          >
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔗</div>
            <div style={{ fontWeight: '600' }}>플랜-기능 관리</div>
            <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
              플랜과 기능 연결 관리
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

