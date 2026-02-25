"use client";

import { useEffect, useRef } from "react";

interface KakaoAdFitProps {
    unit?: string;
    width?: number;
    height?: number;
}

const KakaoAdFit: React.FC<KakaoAdFitProps> = ({
    unit = process.env.NEXT_PUBLIC_KAKAO_ADFIT_MYPAGE_KEY,
    width = 250,
    height = 250,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const initialized = useRef(false);

    useEffect(() => {
        if (!unit || initialized.current) return;

        const ins = document.createElement("ins");
        ins.className = "kakao_ad_area";
        ins.style.display = "none";
        ins.setAttribute("data-ad-unit", unit);
        ins.setAttribute("data-ad-width", String(width));
        ins.setAttribute("data-ad-height", String(height));

        containerRef.current?.appendChild(ins);

        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "//t1.daumcdn.net/kas/static/ba.min.js";
        script.async = true;

        containerRef.current?.appendChild(script);
        initialized.current = true;

        return () => {
            if (containerRef.current) {
                containerRef.current.innerHTML = "";
            }
            initialized.current = false;
        };
    }, [unit, width, height]);

    if (!unit) return null;

    return <div ref={containerRef} />;
};

export default KakaoAdFit;
