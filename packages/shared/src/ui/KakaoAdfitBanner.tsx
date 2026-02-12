import { useCallback, useEffect, useRef } from "react";

interface WindowWithAdfit extends Window {
    adfit?: {
        request?: (unit: string) => void;
        init?: () => void;
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
        if (disabled || !unit) {
            if (!unit) {
                console.warn("KakaoAdfitBanner: unit이 비어있습니다.");
            }
            return;
        }
        if (!scriptElementWrapper.current) return;

        console.log("KakaoAdfitBanner 초기화:", unit, "width:", width, "height:", height);
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
        
        const initializeAd = () => {
            const globalAdfit = (window as unknown as WindowWithAdfit).adfit;
            if (globalAdfit) {
                // 카카오 애드핏이 이미 로드되어 있으면 명시적으로 광고 초기화
                if (globalAdfit.request) {
                    console.log("카카오 애드핏 광고 초기화 시도:", unit);
                    globalAdfit.request(unit);
                } else if (globalAdfit.init) {
                    console.log("카카오 애드핏 init 호출:", unit);
                    globalAdfit.init();
                } else {
                    // adfit 객체는 있지만 request나 init 메서드가 없는 경우
                    // 카카오 애드핏이 자동으로 ins 태그를 찾을 때까지 대기
                    console.log("카카오 애드핏 객체는 존재하지만 초기화 메서드를 찾을 수 없음:", unit);
                }
            } else {
                console.warn("카카오 애드핏 객체가 아직 로드되지 않음:", unit);
            }
        };
        
        let timeoutId: NodeJS.Timeout | null = null;
        
        if (existingScript) {
            // 스크립트가 이미 로드되어 있으면 바로 광고 초기화 시도
            // 약간의 지연을 두어 DOM이 완전히 렌더링된 후 초기화
            timeoutId = setTimeout(() => {
                initializeAd();
            }, 100);
        } else {
            // 스크립트가 없으면 새로 로드
            const script = document.createElement("script");
            script.setAttribute("src", "https://t1.daumcdn.net/kas/static/ba.min.js");
            
            script.onload = () => {
                // 스크립트 로드 완료 후 광고 초기화
                initializeAd();
            };
            
            scriptElementWrapper.current.appendChild(script);
        }

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            const globalAdfit = (window as unknown as WindowWithAdfit).adfit;
            if (globalAdfit && globalAdfit.destroy) {
                globalAdfit.destroy(unit);
            }
            delete (window as unknown as WindowWithAdfit)[globalFunctionName];
        };
    }, [unit, disabled, forceFail, triggerAdFail, width, height]);

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
