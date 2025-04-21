import Head from "next/head"
import "../styles/globals.css"

export const metadata = {
    title: "워크폴리오;",
    description: "A simple Next.js application",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ko">
            <head>
                <Head>
                    <title>{metadata.title}</title>
                    <meta name="description" content={metadata.description} />
                </Head>
            </head>
            <body>{children}</body>
        </html>
    );
}
