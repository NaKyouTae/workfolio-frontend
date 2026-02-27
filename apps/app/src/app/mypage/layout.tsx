"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import Header from '@/components/layouts/Header';
import Footer from "@/components/layouts/Footer";
import PaymentWidget from '@/components/features/payments/PaymentWidget';
import { useRouter, usePathname } from 'next/navigation';
import { isLoggedIn } from '@workfolio/shared/utils/authUtils';
import { KakaoAdfitBanner } from '@workfolio/shared/ui/KakaoAdfitBanner';

const NEXT_PUBLIC_KAKAO_ADFIT_MYPAGE_KEY = process.env.NEXT_PUBLIC_KAKAO_ADFIT_MYPAGE_KEY;

const MENUS = [
    { key: 'profile', label: '프로필 관리' },
    { key: 'payments', label: '결제 내역' },
    { key: 'credits', label: '크레딧 내역' },
    { key: 'templates', label: '보유 템플릿' },
    { key: 'withdraw', label: '회원 탈퇴' },
] as const;

const PaymentWidgetContext = createContext<{ openPaymentWidget: () => void }>({
    openPaymentWidget: () => {},
});

export function usePaymentWidgetContext() {
    return useContext(PaymentWidgetContext);
}

export default function MypageLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [showPaymentWidget, setShowPaymentWidget] = useState(false);

    const activeMenu = pathname.split('/').pop() || 'profile';

    useEffect(() => {
        if (!isLoggedIn()) {
            router.replace('/records');
        }
    }, [router]);

    const handleMenuClick = (menu: string) => {
        router.push(`/mypage/${menu}`);
    };

    return (
        <PaymentWidgetContext.Provider value={{ openPaymentWidget: () => setShowPaymentWidget(true) }}>
            <Header />
            <main>
                <aside>
                    <div className="aside-cont">
                        <ul className="aside-menu">
                            {MENUS.map((menu) => (
                                <li
                                    key={menu.key}
                                    className={activeMenu === menu.key ? 'active' : ''}
                                    onClick={() => handleMenuClick(menu.key)}
                                >
                                    {menu.label}
                                </li>
                            ))}
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
                <section>
                    <div className="contents">
                        {children}
                    </div>
                    <Footer />
                </section>
            </main>
            <PaymentWidget
                isOpen={showPaymentWidget}
                onClose={() => setShowPaymentWidget(false)}
                onPaymentSuccess={() => {}}
            />
        </PaymentWidgetContext.Provider>
    );
}
