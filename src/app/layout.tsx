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
                {/* Google Tag Manager */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                            })(window,document,'script','dataLayer','GTM-54V8GMJ8');
                        `,
                    }}
                />
                {/* End Google Tag Manager */}
                <link rel="icon" type="image/svg+xml" href="../../public/assets/img/favicon.svg" />
            </head>
            <body>
                {/* Google Tag Manager (noscript) */}
                <noscript>
                    <iframe
                        src="https://www.googletagmanager.com/ns.html?id=GTM-54V8GMJ8"
                        height="0"
                        width="0"
                        style={{ display: 'none', visibility: 'hidden' }}
                    />
                </noscript>
                {/* End Google Tag Manager (noscript) */}
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
