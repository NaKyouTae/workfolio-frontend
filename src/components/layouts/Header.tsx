import React, { useEffect } from 'react'
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
    
    return (
        <header>
            <h1 style={{ cursor: 'pointer' }} onClick={() => router.push('/records')}>
                <Image src="/assets/img/logo/img-logo01.svg" alt="workfolio" width={1} height={1} />
            </h1>
            <div>
                <ul className="menu">
                    <li className={pathname === '/records' ? 'active' : ''}><Link href="/records">기록 관리</Link></li>
                    <li className={pathname === '/company-history' ? 'active' : ''}><Link href="/company-history">커리어 관리</Link></li>
                    <li className={pathname === '/job-search' ? 'active' : ''}><Link href="/job-search">이직 관리</Link></li>
                </ul>
                {user? (
                    <ul className="user">
                        <li>{`${user.nickName} 님 반가워요 !`}</li>
                        <li><Link href="/mypage">마이페이지</Link></li>
                        <li><a onClick={logout}>로그아웃</a></li>
                    </ul>
                ) : (
                    <ul className="user">
                        <li>환영해요 !</li>
                        <li><Link href="/mypage">마이페이지</Link></li>
                        <li><a href="/login">로그인</a></li>
                    </ul>
                )}
            </div>
        </header>
    )
}

export default Header
