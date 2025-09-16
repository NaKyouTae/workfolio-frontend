import React from 'react'
import HttpMethod from "@/enums/HttpMethod"
import Image from 'next/image';
import { useViewStore } from '@/store/viewStore';

const Header = () => {
    const { setView } = useViewStore();
    
    const logout = async () => {
        try {
            // 카카오 로그아웃 요청
            const data = await fetch('/api/logout', { method: HttpMethod.GET, credentials: "include" });
            
            if (data) {
                console.log('카카오 로그아웃 성공');
                
                // 쿠키에서 JWT 토큰 제거
                document.cookie = 'accessToken=; max-age=0; path=/';  // accessToken 쿠키 삭제
                document.cookie = 'refreshToken=; max-age=0; path=/';  // refreshToken 쿠키 삭제 (필요한 경우)
                
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
        <div className={"top-container"}>
            <Image 
                width={174} 
                height={24} 
                src="/workfolio-logo.png" 
                alt="Workfolio Logo"
                style={{ cursor: 'pointer' }}
                onClick={() => setView('dashboard')}
            />
            <div className={"top-user-info"}>
                <div className={"top-user-info-contents"}>닉네임 님 반가워요!</div>
                <span className={"top-user-info-separator"}></span>
                <a className={"button-12"} onClick={() => setView('mypage')}>마이페이지</a>
                <span className={"top-user-info-separator"}></span>
                <a className={"button-12"} onClick={logout}>로그아웃</a>
            </div>
            
        </div>
    )
}

export default Header
