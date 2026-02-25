'use client';

import styles from './AdminDashboard.module.css';

export default function AdminDashboard() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1>대시보드</h1>
        <p>Workfolio 관리자 대시보드에 오신 것을 환영합니다.</p>
      </div>

      <div className={styles.content}>
        <div className={styles.quickLinks}>
          <h2 className={styles.sectionTitle}>빠른 링크</h2>
          <div className={styles.linkGrid}>
            <a href="/dashboard/users" className={styles.linkCard}>
              <div className={styles.linkTitle}>사용자</div>
              <div className={styles.linkDesc}>사용자 조회 및 관리</div>
            </a>
            <a href="/dashboard/templates" className={styles.linkCard}>
              <div className={styles.linkTitle}>템플릿</div>
              <div className={styles.linkDesc}>템플릿 관리</div>
            </a>
            <a href="/dashboard/payments" className={styles.linkCard}>
              <div className={styles.linkTitle}>결제 내역</div>
              <div className={styles.linkDesc}>결제 내역 조회</div>
            </a>
            <a href="/dashboard/notices" className={styles.linkCard}>
              <div className={styles.linkTitle}>공지사항</div>
              <div className={styles.linkDesc}>공지사항 관리</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
