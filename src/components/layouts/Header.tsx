import React, { useEffect, useCallback } from 'react'
import HttpMethod from "@/enums/HttpMethod"
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from '@/hooks/useUser';

const Header = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { user, fetchUser, logout: userLogout } = useUser();
    
    // 로그인 상태 확인 및 유저 정보 가져오기
    useEffect(() => {
        const accessToken = document.cookie
            .split('; ')
            .find(row => row.startsWith('accessToken='))
            ?.split('=')[1];
        
        // 로그인한 경우에만 유저 정보 가져오기
        if (accessToken) {
            fetchUser();
        }
    }, [fetchUser]);
    
    const logout = async () => {
        try {
            // 카카오 로그아웃 요청
            const data = await fetch('/api/logout', { method: HttpMethod.GET, credentials: "include" });
            
            if (data) {
                userLogout(); // 유저 정보 클리어
                
                // 로그아웃 후 리다이렉트
                window.location.href = 'http://localhost:3000';  // 로그아웃 후 리다이렉트
            } else {
                console.error('카카오 로그아웃 실패:', data);
            }
        } catch (error) {
            console.error('로그아웃 중 오류 발생:', error);
        }
    };
    
    const handleLogoClick = () => {
        // 이미 /records 페이지에 있으면 아무것도 안함 (불필요한 _rsc 요청 방지)
        if (pathname !== '/records') {
            router.push('/records');
        }
    };

    // 🔥 메뉴 클릭 핸들러 - _rsc 요청 방지
    const handleMenuClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
        // 현재 경로와 같으면 아무것도 안함
        if (pathname === path) {
            e.preventDefault();
            return;
        }
        
        // 다른 경로면 Link 컴포넌트가 처리하도록 함
        // (Link는 클라이언트 사이드 네비게이션을 처리)
    }, [pathname]);

    return (
        <header>
            <h1 style={{ cursor: 'pointer' }} onClick={handleLogoClick}>
                <Image src="/assets/img/logo/img-logo01.svg" alt="workfolio" width={1} height={1} />
            </h1>
            <div>
                <ul className="menu">
                    <li className={pathname === '/records' ? 'active' : ''}>
                        <Link 
                            href="/records" 
                            prefetch={false}
                            onClick={(e) => handleMenuClick(e, '/records')}
                        >
                            기록 관리
                        </Link>
                    </li>
                    <li className={pathname === '/company-history' ? 'active' : ''}>
                        <Link 
                            href="/company-history" 
                            prefetch={false}
                            onClick={(e) => handleMenuClick(e, '/company-history')}
                        >
                            커리어 관리
                        </Link>
                    </li>
                    <li className={pathname === '/job-search' ? 'active' : ''}>
                        <Link 
                            href="/job-search" 
                            prefetch={false}
                            onClick={(e) => handleMenuClick(e, '/job-search')}
                        >
                            이직 관리
                        </Link>
                    </li>
                </ul>
                {user? (
                    <ul className="user">
                        <li>{`${user.nickName} 님 반가워요 !`}</li>
                        <li>
                            <Link 
                                href="/mypage" 
                                prefetch={false}
                                onClick={(e) => handleMenuClick(e, '/mypage')}
                            >
                                마이페이지
                            </Link>
                        </li>
                        <li><a onClick={logout}>로그아웃</a></li>
                    </ul>
                ) : (
                    <ul className="user">
                        <li>환영해요 !</li>
                        <li>
                            <Link 
                                href="/mypage" 
                                prefetch={false}
                                onClick={(e) => handleMenuClick(e, '/mypage')}
                            >
                                마이페이지
                            </Link>
                        </li>
                        <li>
                            <a href="/login">로그인</a>
                        </li>
                    </ul>
                )}
            </div>
        </header>
    )
}

export default Header
