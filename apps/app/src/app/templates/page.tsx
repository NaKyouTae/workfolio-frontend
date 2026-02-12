"use client";

import UITemplatesPage from '@/components/features/ui-templates/UITemplatesPage';
import Header from '@/components/layouts/Header';
import styles from './templates-page.module.css';

export default function Page() {
    return (
        <div className={styles.pageWrapper}>
            <Header />
            <UITemplatesPage />
        </div>
    );
}
