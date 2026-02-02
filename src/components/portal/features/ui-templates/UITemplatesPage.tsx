"use client";

import React, { useState } from 'react';
import Header from '@/components/portal/layouts/Header';
import Footer from '@/components/portal/layouts/Footer';
import UITemplateList from './UITemplateList';
import CreditBalance from '@/components/portal/features/credits/CreditBalance';
import FloatingNavigation from '@/components/portal/ui/FloatingNavigation';
import PaymentWidget from '@/components/portal/features/payments/PaymentWidget';
import styles from './UITemplatesPage.module.css';

const STORE_FLOATING_NAV_ITEMS = [
    { id: 'section-url', label: 'URL 템플릿' },
    { id: 'section-pdf', label: 'PDF 템플릿' },
];

const UITemplatesPage: React.FC = () => {
    const [showPaymentWidget, setShowPaymentWidget] = useState(false);

    return (
        <>
            <Header />
            <main>
                <section className={styles.storeSection} style={{ width: '75%', margin: '0 auto' }}>
                    <div className="page-cont">
                        <article className={styles.storeArticle}>
                            <UITemplateList />
                        </article>
                        <div className={styles.storeFloatingColumn}>
                            <FloatingNavigation navigationItems={STORE_FLOATING_NAV_ITEMS} />
                            <div className={styles.storeCreditArea}>
                                <CreditBalance compact />
                            </div>
                            <div>
                                <button
                                    type="button"
                                    className={styles.storeChargeButton}
                                    onClick={() => setShowPaymentWidget(true)}
                                >
                                    크레딧 충전
                                </button>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </section>
            </main>
            <PaymentWidget
                isOpen={showPaymentWidget}
                onClose={() => setShowPaymentWidget(false)}
            />
        </>
    );
};

export default UITemplatesPage;
