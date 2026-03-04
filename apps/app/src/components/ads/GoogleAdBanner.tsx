"use client";

import { useEffect, useRef } from "react";

declare global {
    interface Window {
        adsbygoogle: Array<Record<string, unknown>>;
    }
}

interface GoogleAdBannerProps {
    slot: string;
    width: number;
    height: number;
    format?: "auto" | "rectangle" | "vertical" | "horizontal";
    responsive?: boolean;
}

const GoogleAdBanner: React.FC<GoogleAdBannerProps> = ({
    slot,
    width,
    height,
    format = "auto",
    responsive = false,
}) => {
    const pushed = useRef(false);

    useEffect(() => {
        if (!slot || pushed.current) return;
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            pushed.current = true;
        } catch (e) {
            console.error("AdSense push error:", e);
        }
    }, [slot]);

    if (!slot) return null;

    return (
        <ins
            className="adsbygoogle"
            style={{ display: "inline-block", width: `${width}px`, height: `${height}px` }}
            data-ad-client="ca-pub-6008464533427245"
            data-ad-slot={slot}
            data-ad-format={format}
            data-full-width-responsive={responsive ? "true" : "false"}
        />
    );
};

export default GoogleAdBanner;
