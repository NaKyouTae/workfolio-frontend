'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import LoadingScreen from '@workfolio/shared/ui/LoadingScreen';
import { SelectedWorkerProvider } from '@/contexts/SelectedWorkerContext';
import styles from './layout.module.css';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // 쿠키에서 토큰 확인 (클라이언트에서는 직접 읽을 수 없으므로 API 호출)
    const checkAdminAuth = async () => {
      try {
        // 쿠키 확인을 위한 API 호출
        const response = await fetch('/api/staffs/check-auth', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          // 토큰이 없거나 유효하지 않으면 로그인 페이지로
          sessionStorage.removeItem('admin_logged_in');
          sessionStorage.removeItem('admin_user');
          router.push('/');
          return;
        }

        // 세션 스토리지도 확인
        const isLoggedIn = sessionStorage.getItem('admin_logged_in');
        if (!isLoggedIn) {
          router.push('/');
          return;
        }

        setIsChecking(false);
      } catch (error) {
        console.error('Auth check error:', error);
        sessionStorage.removeItem('admin_logged_in');
        sessionStorage.removeItem('admin_user');
        router.push('/');
      }
    };

    checkAdminAuth();
  }, [router]);

  // 인증 확인 중에는 아무것도 렌더링하지 않음
  if (isChecking) {
    return (
      <LoadingScreen minHeight="100vh" />
    );
  }

  return (
    <SelectedWorkerProvider>
      <div className={styles.container}>
        <AdminSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <section className={styles.section}>
          <div className={styles.mobileTopBar}>
            <button
              type="button"
              className={styles.mobileMenuButton}
              onClick={() => setIsSidebarOpen(true)}
              aria-label="메뉴 열기"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 6H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <h1>관리자</h1>
          </div>
          <div className={styles.contents}>
            {children}
          </div>
        </section>
      </div>
    </SelectedWorkerProvider>
  );
}
