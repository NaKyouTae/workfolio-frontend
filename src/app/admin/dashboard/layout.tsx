'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import styles from './dashboard.module.css';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    // 로그인 체크
    const isLoggedIn = sessionStorage.getItem('admin_logged_in');
    if (!isLoggedIn) {
      router.push('/admin');
    }
  }, [router]);

  return (
    <div className={styles.container}>
      <AdminSidebar />
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}

