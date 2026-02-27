import "@workfolio/shared/styles/globals.css";
import "../../public/assets/css/reset.css";
import "../../public/assets/css/font.css";
import "../../public/assets/css/ico.css";
import "../../public/assets/css/common.css";
import "../../public/assets/css/style.css";
import "../styles/admin-dark-theme.css";
import "../styles/admin-mobile-first.css";
import ConfirmDialogProvider from "@workfolio/shared/ui/ConfirmDialogProvider";
import NotificationProvider from "@workfolio/shared/ui/NotificationProvider";

export const metadata = {
    title: "워크폴리오 관리자",
    description: "워크폴리오 관리자 대시보드",
    icons: {
        icon: "/assets/img/favicon.svg",
        shortcut: "/assets/img/favicon.ico",
        apple: "/assets/img/favicon.svg",
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ko" suppressHydrationWarning>
            <head suppressHydrationWarning></head>
            <body>
                {children}
                <ConfirmDialogProvider />
                <NotificationProvider />
            </body>
        </html>
    );
}
