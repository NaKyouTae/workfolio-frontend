import { useCallback, useEffect, useRef } from "react";

interface WindowWithAdfit extends Window {
    adfit?: {
        destroy: (unit: string) => void;
    };
    [key: string]: unknown;
}

interface KakaoAdfitBannerProps {
    unit: string;
    width: number;
    height: number;
    disabled: boolean;
    /**
     * 개발 환경에서만 사용 가능. 광고 실패를 강제로 시뮬레이션합니다.
     * @default false
     */
    forceFail?: boolean;
}

export function KakaoAdfitBanner({
    unit,
    width,
    height,
    disabled,
    forceFail = false,
}: KakaoAdfitBannerProps) {
    const scriptElementWrapper = useRef<HTMLDivElement>(null);
    const adFailedRef = useRef(false);

    const triggerAdFail = useCallback(() => {
        if (!adFailedRef.current) {
            adFailedRef.current = true;
            console.log("카카오 애드핏 광고 로드 실패:", unit);
        }
    }, [unit]);

    useEffect(() => {
        if (disabled || !unit) return;
        if (!scriptElementWrapper.current) return;

        const globalFunctionName = `handleAdFail_${unit}`;
        (window as unknown as WindowWithAdfit)[globalFunctionName] = triggerAdFail;

        // 개발 환경에서 forceFail이 true이면 즉시 실패 처리
        if (forceFail) {
            const timeout = setTimeout(() => {
                triggerAdFail();
            }, 100);
            return () => {
                clearTimeout(timeout);
                delete (window as unknown as WindowWithAdfit)[globalFunctionName];
            };
        }

        // 이미 스크립트가 로드되어 있는지 확인
        const existingScript = document.querySelector('script[src="https://t1.daumcdn.net/kas/static/ba.min.js"]');
        
        if (!existingScript) {
            // 스크립트가 없으면 새로 로드 (카카오 애드핏이 자동으로 ins 태그를 찾아서 초기화)
            const script = document.createElement("script");
            script.setAttribute("src", "https://t1.daumcdn.net/kas/static/ba.min.js");
            scriptElementWrapper.current.appendChild(script);
        }

        return () => {
            const globalAdfit = (window as unknown as WindowWithAdfit).adfit;
            if (globalAdfit && globalAdfit.destroy) {
                globalAdfit.destroy(unit);
            }
            delete (window as unknown as WindowWithAdfit)[globalFunctionName];
        };
    }, [unit, disabled, forceFail, triggerAdFail]);

    return (
        <div ref={scriptElementWrapper}>
            <ins
                className="kakao_ad_area"
                style={{ display: "none" }}
                data-ad-onfail={`handleAdFail_${unit}`}
                data-ad-unit={unit}
                data-ad-width={width}
                data-ad-height={height}
            ></ins>
        </div>
    );
}

KakaoAdfitBanner.displayName = "KakaoAdfitBanner";
