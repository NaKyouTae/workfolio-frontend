import React, { useEffect } from 'react'
import HttpMethod from "@/enums/HttpMethod"
import Image from 'next/image';
import { useViewStore } from '@/store/viewStore';
import { useUser } from '@/hooks/useUser';

const Header = () => {
    const { setView } = useViewStore();
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
            <h1 onClick={() => setView('dashboard')}><Image src="/assets/img/logo/img-logo01.svg" alt="workfolio" width={1} height={1} /></h1>
            {user? (
                <ul>
                <li>{`${user.nickName} 님 반가워요!`}</li>
                <li><a onClick={() => setView('mypage')}>마이페이지</a></li>
                <li><a onClick={logout}>로그아웃</a></li>
            </ul>
            ) : (
                <ul>
                    <li>환영합니다. <a href="/login" style={{ color: '#007bff', textDecoration: 'underline', cursor: 'pointer' }}>로그인</a>을 해보세요~</li>
                </ul>
            )}
            
        </header>
    )
}

export default Header
