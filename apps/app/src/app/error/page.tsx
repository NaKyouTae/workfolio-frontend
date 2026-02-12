"use client";

import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import { useRouter } from "next/navigation";

import Image from "next/image";

export default function ErrorPage() {
    const router = useRouter();

    const handleGoHome = () => {
        router.push("/records");
    };

    return (
        <>
            <Header />
            <main>
                <section>
                    <div className="contents">
                        <div className="error-wrap">
                            <Image
                                src="/assets/img/ico/ic-error.svg"
                                alt="error"
                                width={1}
                                height={1}
                            />
                            <div>
                                <p>예기치 못한 문제가 생겼어요.</p>
                                <span>잠시 후 다시 이용해 주세요.</span>
                            </div>
                            <button onClick={handleGoHome}>홈으로 돌아가기</button>
                        </div>
                    </div>
                    <Footer />
                </section>
            </main>
        </>
    );
}
