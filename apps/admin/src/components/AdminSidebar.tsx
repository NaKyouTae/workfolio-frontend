"use client";

import { usePathname, useRouter } from "next/navigation";
import styles from "./AdminSidebar.module.css";

interface MenuItem {
    name: string;
    path: string;
    icon: React.ReactNode;
}

interface MenuSection {
    label: string;
    items: MenuItem[];
}

const UserIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const TemplateIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="9" y1="21" x2="9" y2="9" />
    </svg>
);

const PaymentIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
);

const CreditIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
);

const RecordIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
    </svg>
);

const CareerIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
);

const TurnoverIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="17 1 21 5 17 9" />
        <path d="M3 11V9a4 4 0 0 1 4-4h14" />
        <polyline points="7 23 3 19 7 15" />
        <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
);

const AttachmentIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.44 11.05l-8.49 8.49a5 5 0 1 1-7.07-7.07l8.49-8.49a3.5 3.5 0 1 1 4.95 4.95L10.83 17.4a2 2 0 1 1-2.83-2.83l7.78-7.78" />
    </svg>
);

const OwnedTemplateIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

const NoticeIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
);

const DashboardIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
    </svg>
);

const LogoutIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);

const menuSections: MenuSection[] = [
    {
        label: "",
        items: [
            { name: "대시보드", path: "/dashboard", icon: <DashboardIcon /> },
        ],
    },
    {
        label: "관리",
        items: [
            { name: "사용자", path: "/dashboard/users", icon: <UserIcon /> },
            { name: "UI 템플릿", path: "/dashboard/templates", icon: <TemplateIcon /> },
            { name: "보유 템플릿", path: "/dashboard/owned-templates", icon: <OwnedTemplateIcon /> },
            { name: "공지사항", path: "/dashboard/notices", icon: <NoticeIcon /> },
        ],
    },
    {
        label: "거래",
        items: [
            { name: "결제 내역", path: "/dashboard/payments", icon: <PaymentIcon /> },
            { name: "크레딧 내역", path: "/dashboard/credits", icon: <CreditIcon /> },
        ],
    },
    {
        label: "활동",
        items: [
            { name: "기록 내역", path: "/dashboard/records", icon: <RecordIcon /> },
            { name: "이력 내역", path: "/dashboard/careers", icon: <CareerIcon /> },
            { name: "이직 내역", path: "/dashboard/turnovers", icon: <TurnoverIcon /> },
            { name: "첨부파일 관리", path: "/dashboard/attachments", icon: <AttachmentIcon /> },
        ],
    },
];

interface AdminSidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export default function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const isActive = (path: string) => {
        if (path === "/dashboard") return pathname === "/dashboard";
        return pathname.startsWith(path);
    };

    const handleLogout = async () => {
        try {
            await fetch("/api/staffs/logout", { method: "POST" });
            sessionStorage.removeItem("admin_logged_in");
            sessionStorage.removeItem("admin_user");
            router.push("/");
        } catch (error) {
            console.error("Logout error:", error);
            sessionStorage.removeItem("admin_logged_in");
            sessionStorage.removeItem("admin_user");
            router.push("/");
        }
    };

    return (
        <>
            <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}>
            <div className={styles.logo}>
                <div className={styles.logoIcon}>W</div>
                <span className={styles.logoText}>Workfolio</span>
                <button
                    type="button"
                    className={styles.closeButton}
                    onClick={onClose}
                    aria-label="메뉴 닫기"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>
            </div>

            <nav className={styles.nav}>
                {menuSections.map((section, sectionIdx) => (
                    <div key={sectionIdx} className={styles.section}>
                        {section.label && (
                            <div className={styles.sectionLabel}>{section.label}</div>
                        )}
                        <ul>
                            {section.items.map((item) => (
                                <li key={item.path}>
                                    <a
                                        href={item.path}
                                        className={`${styles.navLink} ${isActive(item.path) ? styles.navLinkActive : ""}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            router.push(item.path);
                                            onClose?.();
                                        }}
                                    >
                                        <span className={styles.icon}>{item.icon}</span>
                                        <span>{item.name}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </nav>

            <div className={styles.footer}>
                <button onClick={handleLogout} className={styles.logoutButton}>
                    <LogoutIcon />
                    <span>로그아웃</span>
                </button>
            </div>
        </aside>
        {isOpen && <button type="button" className={styles.backdrop} onClick={onClose} aria-label="메뉴 닫기" />}
        </>
    );
}
