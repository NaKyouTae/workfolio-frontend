import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "이력서 템플릿",
    description:
        "오늘의 기록이 내일의 이력서가 됩니다. 일과 이력을 한곳에 쌓아두는 기록 플랫폼, 워크폴리오.",
    openGraph: {
        title: "이력서 템플릿 - 워크폴리오",
        description:
            "오늘의 기록이 내일의 이력서가 됩니다. 일과 이력을 한곳에 쌓아두는 기록 플랫폼, 워크폴리오.",
        url: "https://workfolio.spectrify.kr/templates",
        siteName: "워크폴리오",
        type: "website",
    },
    alternates: {
        canonical: "https://workfolio.spectrify.kr/templates",
    },
};

export default function TemplatesLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
