import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "이직 준비",
    description:
        "이직 준비 과정을 체계적으로 관리하세요. 지원 현황, 면접 일정 등을 한눈에 확인할 수 있습니다.",
    openGraph: {
        title: "이직 준비 - 워크폴리오",
        description:
            "이직 준비 과정을 체계적으로 관리하세요. 지원 현황, 면접 일정 등을 한눈에 확인할 수 있습니다.",
        url: "https://workfolio.spectrify.kr/turn-overs",
        siteName: "워크폴리오",
        type: "website",
    },
    alternates: {
        canonical: "https://workfolio.spectrify.kr/turn-overs",
    },
};

export default function TurnOversLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
