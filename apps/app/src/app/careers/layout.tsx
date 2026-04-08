import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "커리어 관리",
    description:
        "경력, 학력, 자격증 등 커리어 정보를 체계적으로 관리하세요. 이력서에 자동으로 반영됩니다.",
    openGraph: {
        title: "커리어 관리 - 워크폴리오",
        description:
            "경력, 학력, 자격증 등 커리어 정보를 체계적으로 관리하세요. 이력서에 자동으로 반영됩니다.",
        url: "https://workfolio.spectrify.kr/careers",
        siteName: "워크폴리오",
        type: "website",
    },
    alternates: {
        canonical: "https://workfolio.spectrify.kr/careers",
    },
};

export default function CareersLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
