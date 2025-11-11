import Head from "next/head"
import "../styles/globals.css"
import "../../public/assets/css/reset.css"
import "../../public/assets/css/font.css"
import "../../public/assets/css/ico.css"
import "../../public/assets/css/common.css"
import "../../public/assets/css/style.css"
import ConfirmDialogProvider from "@/components/portal/ui/ConfirmDialogProvider"
import NotificationProvider from "@/components/portal/ui/NotificationProvider"
import TokenRefreshProvider from "@/components/portal/providers/TokenRefreshProvider"

export const metadata = {
    title: "워크폴리오 - 나만의 기록장",
    description: "일과 이력을 한곳에 쌓아두는 기록 플랫폼, 워크폴리오. 경험을 정리하고 커리어를 성장시켜 보세요.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ko">
            <head>
                <Head>
                    <title>{metadata.title}</title>
                    <link rel="icon" type="image/svg+xml" href="../../public/assets/img/favicon.svg" />
                    
                    {/* 기본 메타 태그 */}
                    <meta name="description" content={metadata.description} />
                    {/* <meta name="keywords" content="워크폴리오, Workfolio, 기록 플랫폼, 커리어 관리, 업무 기록, 이력 관리, 자기계발, 커리어 성장" />
                    <meta name="author" content="Workfolio" /> */}
                    
                    {/* 오픈 그래프 */}
                    {/* <meta property="og:title" content="워크폴리오 - 나만의 기록장" />
                    <meta property="og:description" content="일과 이력을 한곳에 쌓아두는 기록 플랫폼, 워크폴리오. 경험을 정리하고 커리어를 성장시켜 보세요." />
                    <meta property="og:type" content="website" />
                    <meta property="og:url" content="" />
                    <meta property="og:image" content="" /> */}
                </Head>
            </head>
            <body>
                <TokenRefreshProvider>
                    {children}
                    <ConfirmDialogProvider />
                    <NotificationProvider />
                </TokenRefreshProvider>
            </body>
        </html>
    );
}
