import Script from "next/script"
import "../styles/globals.css"
import "../../public/assets/css/reset.css"
import "../../public/assets/css/font.css"
import "../../public/assets/css/ico.css"
import "../../public/assets/css/common.css"
import "../../public/assets/css/style.css"
import ConfirmDialogProvider from "@/components/portal/ui/ConfirmDialogProvider"
import NotificationProvider from "@/components/portal/ui/NotificationProvider"

export const metadata = {
    title: "워크폴리오 - 나만의 기록장",
    description: "일과 이력을 한곳에 쌓아두는 기록 플랫폼, 워크폴리오. 경험을 정리하고 커리어를 성장시켜 보세요.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ko">
            <head>
                <link rel="icon" type="image/svg+xml" href="../../public/assets/img/favicon.svg" />
            </head>
            <body>
                <Script
                    id="microsoft-clarity"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `
                            (function(c,l,a,r,i,t,y){
                                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                            })(window, document, "clarity", "script", "ug4gm8dyl9");
                        `,
                    }}
                />
                {children}
                <ConfirmDialogProvider />
                <NotificationProvider />
            </body>
        </html>
    );
}
