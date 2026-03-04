"use client";

import React from 'react';
import Footer from '@/components/layouts/Footer';
import GoogleAdBanner from '@/components/ads/GoogleAdBanner';
import UITemplateList from './UITemplateList';
import styles from './UITemplatesPage.module.css';

const NEXT_PUBLIC_ADSENSE_STORE_LEFT_SLOT = process.env.NEXT_PUBLIC_ADSENSE_STORE_LEFT_SLOT;
const NEXT_PUBLIC_ADSENSE_STORE_RIGHT_SLOT = process.env.NEXT_PUBLIC_ADSENSE_STORE_RIGHT_SLOT;

const UITemplatesPage: React.FC = () => {
    return (
        <main className={styles.mainLayout}>
            <div className={styles.storeSection} data-scroll-container>
                <div className="page-cont">
                    <UITemplateList />
                </div>
            </div>
            <div className={styles.adWrapper}>
                <GoogleAdBanner
                    slot={NEXT_PUBLIC_ADSENSE_STORE_LEFT_SLOT || ""}
                    width={160}
                    height={600}
                />
            </div>
            <div className={styles.adSideWrapper}>
                <GoogleAdBanner
                    slot={NEXT_PUBLIC_ADSENSE_STORE_RIGHT_SLOT || ""}
                    width={160}
                    height={600}
                />
            </div>
            <div className={styles.footerWrapper}>
                <Footer />
            </div>
        </main>
    );
};

export default UITemplatesPage;
