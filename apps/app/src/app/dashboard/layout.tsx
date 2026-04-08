import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "대시보드",
    description:
        "나의 업무 기록과 커리어 현황을 한눈에 확인하세요. 워크폴리오 대시보드에서 기록 통계와 활동을 관리합니다.",
    openGraph: {
        title: "대시보드 - 워크폴리오",
        description:
            "나의 업무 기록과 커리어 현황을 한눈에 확인하세요. 워크폴리오 대시보드에서 기록 통계와 활동을 관리합니다.",
        url: "https://workfolio.spectrify.kr/dashboard",
        siteName: "워크폴리오",
        type: "website",
    },
    alternates: {
        canonical: "https://workfolio.spectrify.kr/dashboard",
    },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
