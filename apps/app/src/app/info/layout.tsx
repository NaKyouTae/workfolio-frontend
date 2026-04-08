import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "워크폴리오 소개 - 일과 이력을 한곳에 쌓아두는 기록 플랫폼",
    description:
        "업무 기록을 쌓으면 이력서가 자동으로 만들어집니다. 주간 회고·프로젝트 기록으로 이력서를 관리하는 플랫폼, 워크폴리오.",
    openGraph: {
        title: "워크폴리오 - 나만의 커리어 기록 플랫폼",
        description:
            "업무 기록을 쌓으면 이력서가 자동으로 만들어집니다. 주간 회고·프로젝트 기록으로 이력서를 관리하는 플랫폼, 워크폴리오.",
        url: "https://workfolio.spectrify.kr/info",
        siteName: "워크폴리오",
        type: "website",
    },
    alternates: {
        canonical: "https://workfolio.spectrify.kr/info",
    },
};

export default function InfoLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
