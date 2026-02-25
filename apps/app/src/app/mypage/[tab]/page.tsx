"use client";

import React, { useState, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import Header from '@/components/layouts/Header';
import Footer from "@/components/layouts/Footer"
import ProfileManagement from '@/components/features/mypage/ProfileManagement';
import CreditHistory from '@/components/features/credits/CreditHistory';
import PaymentHistory from '@/components/features/payments/PaymentHistory';
import PaymentWidget from '@/components/features/payments/PaymentWidget';
import MyUITemplates from '@/components/features/ui-templates/MyUITemplates';
import { useNotification } from '@workfolio/shared/hooks/useNotification';
import { useRouter, useParams } from 'next/navigation';
import { isLoggedIn } from '@workfolio/shared/utils/authUtils';
import { KakaoAdfitBanner } from '@workfolio/shared/ui/KakaoAdfitBanner';

const NEXT_PUBLIC_KAKAO_ADFIT_MYPAGE_KEY = process.env.NEXT_PUBLIC_KAKAO_ADFIT_MYPAGE_KEY;

const VALID_TABS = ['profile', 'credits', 'payments', 'templates', 'withdraw'] as const;
type Tab = typeof VALID_TABS[number];

const MypageTabPage: React.FC = () => {
    const router = useRouter();
    const params = useParams();
    const tab = params.tab as string;
    const { deleteAccount, isLoading } = useUser();
    const { showNotification } = useNotification();
    const [isDeleting, setIsDeleting] = useState(false);
    const [showPaymentWidget, setShowPaymentWidget] = useState(false);

    const activeMenu = VALID_TABS.includes(tab as Tab) ? tab : 'profile';

    useEffect(() => {
        if (!VALID_TABS.includes(tab as Tab)) {
            router.replace('/mypage/profile');
        }
    }, [tab, router]);

    useEffect(() => {
        if (!isLoggedIn()) {
            router.replace('/records');
        }
    }, [router]);

    const handleOpenTemplateStore = () => {
        router.push('/templates');
    };

    const handleWithdraw = async () => {
        if (!confirm('정말로 회원 탈퇴를 하시겠습니까? 탈퇴 후에는 모든 데이터가 삭제되며 복구할 수 없습니다.')) {
            return;
        }

        try {
            setIsDeleting(true);
            await deleteAccount();
        } catch (error) {
            console.error('회원 탈퇴 실패:', error);
            showNotification('회원 탈퇴 중 오류가 발생했습니다. 다시 시도해주세요.', 'error');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleOpenPaymentWidget = () => {
        setShowPaymentWidget(true);
    };

    const handleClosePaymentWidget = () => {
        setShowPaymentWidget(false);
    };

    const handlePaymentSuccess = () => {
    };

    const handleMenuClick = (menu: Tab) => {
        router.push(`/mypage/${menu}`);
    };

    return (
        <>
            <Header />
            <main>
                {/* Left Menu */}
                <aside>
                    <div className="aside-cont">
                        <ul className="aside-menu">
                            <li className={`${activeMenu === 'profile' ? 'active' : ''}`} onClick={() => handleMenuClick('profile')}>프로필 관리</li>
                            <li className={`${activeMenu === 'payments' ? 'active' : ''}`} onClick={() => handleMenuClick('payments')}>결제 내역</li>
                            <li className={`${activeMenu === 'credits' ? 'active' : ''}`} onClick={() => handleMenuClick('credits')}>크레딧 내역</li>
                            <li className={`${activeMenu === 'templates' ? 'active' : ''}`} onClick={() => handleMenuClick('templates')}>보유 템플릿</li>
                            <li className={`${activeMenu === 'withdraw' ? 'active' : ''}`} onClick={() => handleMenuClick('withdraw')}>회원 탈퇴</li>
                        </ul>
                    </div>
                    <div>
                        <KakaoAdfitBanner
                            unit={NEXT_PUBLIC_KAKAO_ADFIT_MYPAGE_KEY || ""}
                            width={160}
                            height={600}
                            disabled={!NEXT_PUBLIC_KAKAO_ADFIT_MYPAGE_KEY}
                        />
                    </div>
                </aside>
                {/* Right Content */}
                <section>
                    <div className="contents">
                        <div className="page-cont">
                            {activeMenu === 'profile' && (
                                <ProfileManagement />
                            )}
                            {activeMenu === 'credits' && (
                                <CreditHistory onOpenPaymentWidget={handleOpenPaymentWidget} />
                            )}
                            {activeMenu === 'payments' && (
                                <PaymentHistory onOpenPaymentWidget={handleOpenPaymentWidget} />
                            )}
                            {activeMenu === 'templates' && (
                                <MyUITemplates onOpenUITemplateStore={handleOpenTemplateStore} />
                            )}
                            {activeMenu === 'withdraw' && (
                                <div className="cont-box">
                                    <div className="cont-tit">
                                        <div>
                                            <h3>회원 탈퇴</h3>
                                        </div>
                                    </div>
                                    <ul className="setting-list">
                                        <li>
                                            <p>회원 탈퇴</p>
                                            <button className="xsm" onClick={handleWithdraw} disabled={!isLoggedIn || isDeleting || isLoading}>탈퇴하기</button>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                    <Footer/>
                </section>
            </main>
            <PaymentWidget
                isOpen={showPaymentWidget}
                onClose={handleClosePaymentWidget}
                onPaymentSuccess={handlePaymentSuccess}
            />
        </>
    );
};

export default MypageTabPage;
