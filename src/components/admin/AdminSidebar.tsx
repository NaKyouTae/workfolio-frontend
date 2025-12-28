"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./AdminSidebar.module.css";

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const menuItems = [
        {
            name: "대시보드",
            path: "/admin/dashboard",
            icon: "📊",
        },
        {
            name: "사용자 관리",
            path: "/admin/dashboard/users",
            icon: "👥",
        },
        {
            name: "플랜 관리",
            path: "/admin/dashboard/plans",
            icon: "💎",
        },
        {
            name: "기능 관리",
            path: "/admin/dashboard/features",
            icon: "⚙️",
        },
        {
            name: "플랜-기능 관리",
            path: "/admin/dashboard/plan-features",
            icon: "🔗",
        },
        {
            name: "공지사항 관리",
            path: "/admin/dashboard/notices",
            icon: "📢",
        },
    ];

    const handleLogout = async () => {
        try {
            // 서버에 로그아웃 요청 (쿠키 삭제)
            await fetch("/api/staffs/logout", {
                method: "POST",
            });

            // 세션 스토리지 삭제
            sessionStorage.removeItem("admin_logged_in");
            sessionStorage.removeItem("admin_user");

            // 로그인 페이지로 이동
            router.push("/admin");
        } catch (error) {
            console.error("Logout error:", error);
            // 에러가 발생해도 로그인 페이지로 이동
            sessionStorage.removeItem("admin_logged_in");
            sessionStorage.removeItem("admin_user");
            router.push("/admin");
        }
    };

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                <Image
                    src="/workfolio-logo.png"
                    alt="Workfolio Logo"
                    width={120}
                    height={40}
                    style={{ objectFit: "contain" }}
                />
                <h2>Workfolio Admin</h2>
            </div>

            <nav className={styles.nav}>
                <ul>
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <a
                                href={item.path}
                                className={
                                    pathname === item.path
                                        ? `${styles.navLink} ${styles.navLinkActive}`
                                        : styles.navLink
                                }
                                onClick={(e) => {
                                    e.preventDefault();
                                    router.push(item.path);
                                }}
                            >
                                <span className={styles.icon}>{item.icon}</span>
                                <span>{item.name}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className={styles.footer}>
                <button onClick={handleLogout} className={styles.logoutButton}>
                    🚪 로그아웃
                </button>
            </div>
        </aside>
    );
}
