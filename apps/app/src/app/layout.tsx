import type { Metadata } from "next";
import Script from "next/script";
import "@workfolio/shared/styles/globals.css";
import "../../public/assets/css/reset.css";
import "../../public/assets/css/font.css";
import "../../public/assets/css/ico.css";
import "../../public/assets/css/common.css";
import "../../public/assets/css/style.css";
import ConfirmDialogProvider from "@workfolio/shared/ui/ConfirmDialogProvider";
import NotificationProvider from "@workfolio/shared/ui/NotificationProvider";
import GoogleAnalytics from "@workfolio/shared/ui/GoogleAnalytics";

export const metadata: Metadata = {
    metadataBase: new URL("https://workfolio.spectrify.kr"),
    title: {
        default: "워크폴리오 - 나만의 기록장",
        template: "%s | 워크폴리오",
    },
    description:
        "업무 기록을 쌓으면 이력서가 자동으로 만들어집니다. 주간 회고·프로젝트 기록으로 이력서를 관리하는 플랫폼, 워크폴리오.",
    icons: {
        icon: "/assets/img/favicon.svg",
        shortcut: "/assets/img/favicon.ico",
        apple: "/assets/img/favicon.svg",
    },
    openGraph: {
        title: "워크폴리오 - 나만의 커리어 기록 플랫폼",
        description:
            "업무 기록을 쌓으면 이력서가 자동으로 만들어집니다. 주간 회고·프로젝트 기록으로 이력서를 관리하는 플랫폼, 워크폴리오.",
        url: "https://workfolio.spectrify.kr",
        siteName: "워크폴리오",
        type: "website",
        locale: "ko_KR",
    },
    twitter: {
        card: "summary_large_image",
        title: "워크폴리오 - 나만의 커리어 기록 플랫폼",
        description:
            "업무 기록을 쌓으면 이력서가 자동으로 만들어집니다. 주간 회고·프로젝트 기록으로 이력서를 관리하는 플랫폼, 워크폴리오.",
    },
    // 주의: 루트 layout 에서는 canonical 을 설정하지 않습니다.
    // 루트에 고정 canonical 을 두면 하위 모든 페이지가 "나는 홈페이지다" 라고
    // 잘못 선언하게 됩니다. 각 페이지가 필요 시 자체 metadata 에서 지정하세요.
    //
    // metadataBase 가 workfolio.spectrify.kr 로 설정되어 있어, og:url / 구조화 데이터
    // 등 모든 절대 URL 은 자동으로 workfolio 호스트 기준으로 렌더링됩니다.
    // 이를 통해 spectrify.kr 과 workfolio.spectrify.kr 중복 노출 시에도
    // Google 은 workfolio 를 canonical 로 선택합니다.
    verification: {
        google: "7Z5qXHvXmaZVGUrCaUMCuRR5uMGbTCBwG8-fSJMouLE",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ko" suppressHydrationWarning>
            <head suppressHydrationWarning>{/* favicon은 metadata에서 설정됨 */}</head>
            <body>
                {/* JSON-LD Structured Data — AEO (Answer Engine Optimization) */}
                {/* AI 검색 엔진(ChatGPT, Claude, Perplexity, Gemini 등)과 Google 이 */}
                {/* "워크폴리오" 서비스를 정확히 이해하도록 여러 스키마를 제공합니다. */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Organization",
                            name: "Spectrify",
                            url: "https://spectrify.kr",
                            logo: "https://workfolio.spectrify.kr/workfolio-logo.png",
                        }),
                    }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "WebSite",
                            name: "워크폴리오",
                            alternateName: "Workfolio",
                            url: "https://workfolio.spectrify.kr",
                            description:
                                "업무 기록을 쌓으면 이력서가 자동으로 만들어집니다. 주간 회고·프로젝트 기록으로 이력서를 관리하는 플랫폼, 워크폴리오.",
                            inLanguage: "ko-KR",
                            publisher: {
                                "@type": "Organization",
                                name: "Spectrify",
                                url: "https://spectrify.kr",
                            },
                            potentialAction: {
                                "@type": "SearchAction",
                                target: "https://workfolio.spectrify.kr/records?q={search_term_string}",
                                "query-input": "required name=search_term_string",
                            },
                        }),
                    }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "SoftwareApplication",
                            name: "워크폴리오",
                            alternateName: "Workfolio",
                            applicationCategory: "BusinessApplication",
                            operatingSystem: "Web",
                            url: "https://workfolio.spectrify.kr",
                            description:
                                "업무 기록을 쌓으면 이력서가 자동으로 만들어집니다. 주간 회고, 프로젝트 기록, 경력 관리, 이력서 템플릿을 한 곳에서 관리하는 커리어 기록 플랫폼입니다.",
                            inLanguage: "ko-KR",
                            offers: {
                                "@type": "Offer",
                                price: "0",
                                priceCurrency: "KRW",
                            },
                            featureList: [
                                "업무 기록 및 주간 회고",
                                "프로젝트 기록",
                                "경력 관리",
                                "이력서 자동 생성",
                                "이력서 템플릿",
                                "커리어 대시보드",
                            ],
                            publisher: {
                                "@type": "Organization",
                                name: "Spectrify",
                                url: "https://spectrify.kr",
                            },
                        }),
                    }}
                />
                {/* Google Tag Manager */}
                <Script
                    id="google-tag-manager"
                    strategy="afterInteractive"
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
                {/* Google Tag Manager (noscript) */}
                <noscript>
                    <iframe
                        src="https://www.googletagmanager.com/ns.html?id=GTM-54V8GMJ8"
                        height="0"
                        width="0"
                        style={{ display: "none", visibility: "hidden" }}
                    />
                </noscript>
                {/* End Google Tag Manager (noscript) */}
                {/* Google tag (gtag.js) */}
                <Script
                    src="https://www.googletagmanager.com/gtag/js?id=G-8J6C1GC0QS"
                    strategy="afterInteractive"
                />
                <Script
                    id="google-analytics"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());
                            gtag('config', 'G-8J6C1GC0QS');
                        `,
                    }}
                />
                {/* End Google tag (gtag.js) */}
                {/* Google AdSense */}
                <Script
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6008464533427245"
                    strategy="afterInteractive"
                    crossOrigin="anonymous"
                />
                {/* End Google AdSense */}
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
                <GoogleAnalytics />
                {children}
                <ConfirmDialogProvider />
                <NotificationProvider />
            </body>
        </html>
    );
}
