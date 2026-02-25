"use client";

import styles from "./AdminPagePlaceholder.module.css";

interface AdminPagePlaceholderProps {
    title: string;
    description: string;
}

export default function AdminPagePlaceholder({ title, description }: AdminPagePlaceholderProps) {
    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <h1>{title}</h1>
                <p>{description}</p>
            </div>
            <div className={styles.content}>
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <line x1="3" y1="9" x2="21" y2="9" />
                            <line x1="9" y1="21" x2="9" y2="9" />
                        </svg>
                    </div>
                    <p className={styles.emptyText}>준비 중인 페이지입니다</p>
                    <p className={styles.emptySubtext}>곧 상세 기능이 추가될 예정입니다.</p>
                </div>
            </div>
        </div>
    );
}
