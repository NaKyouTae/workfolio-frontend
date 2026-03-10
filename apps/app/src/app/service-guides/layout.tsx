import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "서비스 안내 - 워크폴리오",
    description:
        "오늘의 기록이 내일의 이력서가 됩니다. 일과 이력을 한곳에 쌓아두는 기록 플랫폼, 워크폴리오.",
    openGraph: {
        title: "서비스 안내 - 워크폴리오",
        description:
            "오늘의 기록이 내일의 이력서가 됩니다. 일과 이력을 한곳에 쌓아두는 기록 플랫폼, 워크폴리오.",
        url: "https://workfolio.kr/service-guides",
        siteName: "워크폴리오",
        type: "website",
    },
};

export default function ServiceGuidesLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
