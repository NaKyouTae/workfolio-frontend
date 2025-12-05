"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Hydration 에러를 디버깅하기 위한 유틸리티 컴포넌트
 *
 * 사용법:
 * 1. 의심되는 컴포넌트를 <HydrationDebugger name="컴포넌트이름">로 감싸기
 * 2. 브라우저 콘솔에서 "🔍 Checking hydration for: 컴포넌트이름" 메시지 확인
 * 3. 문제가 있는 컴포넌트를 찾을 때까지 범위를 좁혀가기
 *
 * 예시:
 * <HydrationDebugger name="Header">
 *   <Header />
 * </HydrationDebugger>
 */
export default function HydrationDebugger({
    children,
    name,
}: {
    children: React.ReactNode;
    name: string;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const hasLogged = useRef(false);
    const [isMounted, setIsMounted] = useState(false);
    const serverHTMLRef = useRef<string | null>(null);

    // 서버에서 렌더링된 HTML 저장
    useEffect(() => {
        if (containerRef.current && !serverHTMLRef.current) {
            serverHTMLRef.current = containerRef.current.innerHTML;
        }
    }, []);

    // 클라이언트에서 hydration 확인
    useEffect(() => {
        setIsMounted(true);

        if (!containerRef.current) return;

        // 콘솔 에러 감지
        const originalError = console.error;
        const originalWarn = console.warn;

        console.error = (...args: unknown[]) => {
            const message = args.map((arg) => String(arg)).join(" ");
            if (
                message.includes("Hydration") ||
                message.includes("hydration") ||
                message.includes("didn't match")
            ) {
                console.error(`🚨 [${name}] Hydration Error Detected:`, ...args);
                console.error(`📍 Component: ${name}`);
                console.error(`📍 Element:`, containerRef.current);
            }
            originalError.apply(console, args);
        };

        console.warn = (...args: unknown[]) => {
            const message = args.map((arg) => String(arg)).join(" ");
            if (
                message.includes("Hydration") ||
                message.includes("hydration") ||
                message.includes("didn't match")
            ) {
                console.warn(`⚠️ [${name}] Hydration Warning:`, ...args);
                console.warn(`📍 Component: ${name}`);
                console.warn(`📍 Element:`, containerRef.current);
            }
            originalWarn.apply(console, args);
        };

        // 약간의 지연 후 HTML 비교
        setTimeout(() => {
            if (containerRef.current && serverHTMLRef.current) {
                const clientHTML = containerRef.current.innerHTML;

                if (serverHTMLRef.current !== clientHTML) {
                    console.error(`🚨 [${name}] HTML Mismatch Detected!`);
                    console.error(`📍 Component: ${name}`);
                    console.error(`📍 Server HTML length: ${serverHTMLRef.current.length}`);
                    console.error(`📍 Client HTML length: ${clientHTML.length}`);
                    console.error(
                        `📍 Server HTML (first 500 chars):`,
                        serverHTMLRef.current.substring(0, 500)
                    );
                    console.error(
                        `📍 Client HTML (first 500 chars):`,
                        clientHTML.substring(0, 500)
                    );
                    console.error(`📍 Element:`, containerRef.current);
                } else if (!hasLogged.current) {
                    console.log(`✅ [${name}] No hydration mismatch detected`);
                    hasLogged.current = true;
                }
            } else if (!hasLogged.current) {
                console.log(`🔍 [${name}] Checking hydration...`);
                console.log(`📍 Element:`, containerRef.current);
                hasLogged.current = true;
            }
        }, 500);

        return () => {
            console.error = originalError;
            console.warn = originalWarn;
        };
    }, [name, isMounted]);

    return (
        <div ref={containerRef} data-hydration-debug={name} suppressHydrationWarning>
            {children}
        </div>
    );
}
