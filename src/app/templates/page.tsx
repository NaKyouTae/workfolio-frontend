"use client";

import UITemplatesPage from '@/components/portal/features/ui-templates/UITemplatesPage';
import Header from '@/components/portal/layouts/Header';
import styles from './templates-page.module.css';

export default function Page() {
    return (
        <div className={styles.pageWrapper}>
            <Header />
            <UITemplatesPage />
        </div>
    );
}
