"use client";

import React, { useState, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import Header from '@/components/portal/layouts/Header';
import Footer from "@/components/portal/layouts/Footer"
import ProfileManagement from '@/components/portal/features/mypage/ProfileManagement';
import CreditHistory from '@/components/portal/features/credits/CreditHistory';
import PaymentHistory from '@/components/portal/features/payments/PaymentHistory';
import PaymentWidget from '@/components/portal/features/payments/PaymentWidget';
import MyUITemplates from '@/components/portal/features/ui-templates/MyUITemplates';
import { useNotification } from '@/hooks/useNotification';
import { useRouter } from 'next/navigation';
import { isLoggedIn } from '@/utils/authUtils';
import LoginModal from '@/components/portal/ui/LoginModal';

const Mypage: React.FC = () => {
    const router = useRouter();
    const { deleteAccount, isLoading } = useUser();
    const { showNotification } = useNotification();
    const [activeMenu, setActiveMenu] = useState('profile');

    const handleOpenTemplateStore = () => {
        router.push('/templates');
    };
    const [isDeleting, setIsDeleting] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showPaymentWidget, setShowPaymentWidget] = useState(false);

    useEffect(() => {
        if (!isLoggedIn()) {
            setShowLoginModal(true);
        }
    }, []);

    const handleWithdraw = async () => {
        if (!confirm('정말로 회원 탈퇴를 하시겠습니까? 탈퇴 후에는 모든 데이터가 삭제되며 복구할 수 없습니다.')) {
            return;
        }

        try {
            setIsDeleting(true);
            await deleteAccount();
            // 성공 시에는 자동으로 리다이렉트되므로 여기까지 도달하지 않음
        } catch (error) {
            console.error('회원 탈퇴 실패:', error);
            // 400 에러는 이미 deleteAccount에서 성공으로 처리되므로 여기까지 오지 않음
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
        // Refresh credit/payment data after successful payment
        // This will be handled by the individual components re-fetching their data
    };

    return (
        <>
            <Header />
            <main>
                {/* Left Menu */}
                <aside>
                    <div className="aside-cont">
                        <ul className="aside-menu">
                            <li className={`${activeMenu === 'profile' ? 'active' : ''}`} onClick={() => setActiveMenu('profile')}>프로필 관리</li>
                            <li className={`${activeMenu === 'credits' ? 'active' : ''}`} onClick={() => setActiveMenu('credits')}>크레딧 내역</li>
                            <li className={`${activeMenu === 'payments' ? 'active' : ''}`} onClick={() => setActiveMenu('payments')}>결제 내역</li>
                            <li className={`${activeMenu === 'templates' ? 'active' : ''}`} onClick={() => setActiveMenu('templates')}>보유 템플릿</li>
                            <li className={`${activeMenu === 'withdraw' ? 'active' : ''}`} onClick={() => setActiveMenu('withdraw')}>회원 탈퇴</li>
                        </ul>
                    </div>
                </aside>
                {/* Right Content */}
                <section>
                    <div className="contents">
                        <div className="page-title">
                            <div>
                                <h2>마이페이지</h2>
                            </div>
                        </div>
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
            <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
            <PaymentWidget
                isOpen={showPaymentWidget}
                onClose={handleClosePaymentWidget}
                onPaymentSuccess={handlePaymentSuccess}
            />
        </>
    );
};

export default Mypage;
