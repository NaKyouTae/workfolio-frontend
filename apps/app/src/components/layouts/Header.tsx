import React, { useEffect, useCallback, useState } from "react";
import HttpMethod from "@workfolio/shared/enums/HttpMethod";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { isLoggedIn } from "@workfolio/shared/utils/authUtils";
import LoginModal from "@workfolio/shared/ui/LoginModal";

const Header = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isHydrated, fetchUser, logout: userLogout } = useUser();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [hasInitialized, setHasInitialized] = useState(false);

    // 로그인 상태 확인 및 유저 정보 가져오기 (한 번만 실행)
    useEffect(() => {
        if (!hasInitialized) {
            setHasInitialized(true);
            // httpOnly 쿠키는 JavaScript로 읽을 수 없으므로 토큰 체크를 하지 않고
            // 그냥 API를 호출하고 401이면 서버 사이드(apiFetchHandler)에서 자동으로 토큰 재발급 처리
            fetchUser();
        }
    }, [fetchUser, hasInitialized]);

    const logout = async () => {
        try {
            // 로그아웃 요청
            const response = await fetch("/api/logout", {
                method: HttpMethod.GET,
                credentials: "include",
            });

            // 응답 확인 (성공 여부와 관계없이 쿠키 삭제는 시도됨)
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    userLogout(); // 유저 정보 클리어

                    // 로그아웃 후 리다이렉트 (현재 페이지의 프로토콜 사용)
                    const currentProtocol = window.location.protocol;
                    const currentHost = window.location.host;
                    window.location.href = `${currentProtocol}//${currentHost}`;
                } else {
                    console.error("로그아웃 실패:", data);
                    // 실패해도 유저 정보는 클리어하고 리다이렉트
                    userLogout();
                    window.location.href = `${window.location.protocol}//${window.location.host}`;
                }
            } else {
                console.error("로그아웃 요청 실패:", response.status);
                // 요청 실패해도 유저 정보는 클리어하고 리다이렉트
                userLogout();
                window.location.href = `${window.location.protocol}//${window.location.host}`;
            }
        } catch (error) {
            console.error("로그아웃 중 오류 발생:", error);
            // 에러가 발생해도 유저 정보는 클리어하고 리다이렉트
            userLogout();
            window.location.href = `${window.location.protocol}//${window.location.host}`;
        }
    };

    const handleLogoClick = () => {
        // 이미 /dashboard 페이지에 있으면 아무것도 안함 (불필요한 _rsc 요청 방지)
        if (pathname !== "/dashboard") {
            router.push("/dashboard");
        }
    };

    // 🔥 메뉴 클릭 핸들러 - _rsc 요청 방지
    const handleMenuClick = useCallback(
        (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
            // 현재 경로와 같으면 아무것도 안함
            if (pathname === path) {
                e.preventDefault();
                return;
            }

            // 다른 경로면 Link 컴포넌트가 처리하도록 함
            // (Link는 클라이언트 사이드 네비게이션을 처리)
        },
        [pathname]
    );

    // 마이페이지 클릭 핸들러
    const handleMypageClick = useCallback(
        (e: React.MouseEvent<HTMLAnchorElement>) => {
            if (!isLoggedIn()) {
                e.preventDefault();
                setShowLoginModal(true);
                return;
            }
            handleMenuClick(e, "/mypage");
        },
        [handleMenuClick]
    );

    // 로그인 버튼 클릭 핸들러
    const handleLoginClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setShowLoginModal(true);
    }, []);

    // 워크폴리오 소개 클릭 핸들러
    const handleInfoClick = useCallback(
        (e: React.MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault();
            if (pathname !== "/info") {
                router.push("/info");
            }
        },
        [router, pathname]
    );

    return (
        <header>
            <h1 style={{ cursor: "pointer" }} onClick={handleLogoClick}>
                <Image
                    src="/assets/img/logo/img-logo01.svg"
                    alt="workfolio"
                    width={174}
                    height={50}
                />
            </h1>
            <div>
                <ul className="menu">
                    <li className={pathname.includes("/dashboard") ? "active" : ""}>
                        <Link
                            href="/dashboard"
                            prefetch={false}
                            onClick={(e) => handleMenuClick(e, "/dashboard")}
                        >
                            대시보드
                        </Link>
                    </li>
                    <li className={pathname.includes("/records") ? "active" : ""}>
                        <Link
                            href="/records"
                            prefetch={false}
                            onClick={(e) => handleMenuClick(e, "/records")}
                        >
                            내 기록
                        </Link>
                    </li>
                    <li className={pathname.includes("/careers") ? "active" : ""}>
                        <Link
                            href="/careers"
                            prefetch={false}
                            onClick={(e) => handleMenuClick(e, "/careers")}
                        >
                            내 이력서
                        </Link>
                    </li>
                    <li className={pathname.includes("/turn-overs") ? "active" : ""}>
                        <Link
                            href="/turn-overs"
                            prefetch={false}
                            onClick={(e) => handleMenuClick(e, "/turn-overs")}
                        >
                            커리어 준비
                        </Link>
                    </li>
                    <li className={pathname === "/templates" || pathname.startsWith("/templates/") ? "active" : ""}>
                        <Link
                            href="/templates"
                            prefetch={false}
                            onClick={(e) => handleMenuClick(e, "/templates")}
                        >
                            스토어
                        </Link>
                    </li>
                </ul>
                {/* 서버와 클라이언트에서 동일한 구조 렌더링 (hydration 에러 방지) */}
                <ul className="user">
                    {isHydrated && user ? (
                        <>
                            <li>{`${user.nickName} 님 반가워요 !`}</li>
                            <li>
                                <a onClick={handleInfoClick} style={{ cursor: "pointer" }}>
                                    <i className="ic-rocket" />
                                    워크폴리오 소개
                                </a>
                            </li>
                            <li>
                                <Link href="/mypage" prefetch={false} onClick={handleMypageClick}>
                                    마이페이지
                                </Link>
                            </li>
                            <li>
                                <a onClick={logout}>로그아웃</a>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <a onClick={handleInfoClick} style={{ cursor: "pointer" }}>
                                    <i className="ic-rocket" />
                                    워크폴리오 소개
                                </a>
                            </li>
                            <li>
                                <a onClick={handleLoginClick}>로그인</a>
                            </li>
                        </>
                    )}
                </ul>
            </div>
            <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
        </header>
    );
};

export default Header;
