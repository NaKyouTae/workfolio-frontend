"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import Header from '@/components/layouts/Header';
import Footer from "@/components/layouts/Footer";
import PaymentWidget from '@/components/features/payments/PaymentWidget';
import { useRouter, usePathname } from 'next/navigation';
import { isLoggedIn } from '@workfolio/shared/utils/authUtils';
import GoogleAdBanner from '@/components/ads/GoogleAdBanner';

const NEXT_PUBLIC_ADSENSE_MYPAGE_SLOT = process.env.NEXT_PUBLIC_ADSENSE_MYPAGE_SLOT;

const MENUS = [
    // { key: 'payments', label: '결제 내역' }, // TODO: 사용자 수 늘어나면 추가
    { key: 'credits', label: '크레딧 내역' },
    { key: 'templates', label: '보유 템플릿' },
    { key: 'profile', label: '프로필 관리' },
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
    const [mounted, setMounted] = useState(false);

    const activeMenu = pathname.split('/').pop() || 'credits';

    useEffect(() => {
        setMounted(true);
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
                    {mounted && isLoggedIn() && (
                        <div>
                            <GoogleAdBanner
                                slot={NEXT_PUBLIC_ADSENSE_MYPAGE_SLOT || ""}
                                width={160}
                                height={600}
                            />
                        </div>
                    )}
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
