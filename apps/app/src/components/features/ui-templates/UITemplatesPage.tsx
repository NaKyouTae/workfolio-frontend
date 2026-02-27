"use client";

import React from 'react';
import Footer from '@/components/layouts/Footer';
import { KakaoAdfitBanner } from '@workfolio/shared/ui/KakaoAdfitBanner';
import UITemplateList from './UITemplateList';
import styles from './UITemplatesPage.module.css';

const NEXT_PUBLIC_KAKAO_ADFIT_STORE_LEFT_KEY = process.env.NEXT_PUBLIC_KAKAO_ADFIT_STORE_LEFT_KEY;
const NEXT_PUBLIC_KAKAO_ADFIT_STORE_RIGHT_KEY = process.env.NEXT_PUBLIC_KAKAO_ADFIT_STORE_RIGHT_KEY;

const UITemplatesPage: React.FC = () => {
    return (
        <main className={styles.mainLayout}>
            <div className={styles.storeSection} data-scroll-container>
                <div className="page-cont">
                    <UITemplateList />
                </div>
            </div>
            <div className={styles.adWrapper}>
                <KakaoAdfitBanner
                    unit={NEXT_PUBLIC_KAKAO_ADFIT_STORE_LEFT_KEY || ""}
                    width={160}
                    height={600}
                    disabled={!NEXT_PUBLIC_KAKAO_ADFIT_STORE_LEFT_KEY}
                />
            </div>
            <div className={styles.adSideWrapper}>
                <KakaoAdfitBanner
                    unit={NEXT_PUBLIC_KAKAO_ADFIT_STORE_RIGHT_KEY || ""}
                    width={160}
                    height={600}
                    disabled={!NEXT_PUBLIC_KAKAO_ADFIT_STORE_RIGHT_KEY}
                />
            </div>
            <div className={styles.footerWrapper}>
                <Footer />
            </div>
        </main>
    );
};

export default UITemplatesPage;
