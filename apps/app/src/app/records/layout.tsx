import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "업무 기록",
    description:
        "프로젝트, 주간 회고, 업무 성과를 기록하고 관리하세요. 기록이 쌓이면 이력서가 자동으로 만들어집니다.",
    openGraph: {
        title: "업무 기록 - 워크폴리오",
        description:
            "프로젝트, 주간 회고, 업무 성과를 기록하고 관리하세요. 기록이 쌓이면 이력서가 자동으로 만들어집니다.",
        url: "https://www.workfolio.kr/records",
        siteName: "워크폴리오",
        type: "website",
    },
    alternates: {
        canonical: "https://www.workfolio.kr/records",
    },
};

export default function RecordsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
