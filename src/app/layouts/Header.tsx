import React, { useEffect } from 'react'
import HttpMethod from "@/enums/HttpMethod"
import Image from 'next/image';
import { useViewStore } from '@/store/viewStore';
import { useUser } from '@/hooks/useUser';

const Header = () => {
    const { setView } = useViewStore();
    const { user, fetchUser, logout: userLogout } = useUser();
    
    // 컴포넌트 마운트 시 유저 정보 가져오기
    useEffect(() => {
        fetchUser();
    }, [fetchUser]); // fetchUser는 useCallback으로 메모이제이션됨
    
    const logout = async () => {
        try {
            // 카카오 로그아웃 요청
            const data = await fetch('/api/logout', { method: HttpMethod.GET, credentials: "include" });
            
            if (data) {
                console.log('카카오 로그아웃 성공');

                // 유저 정보 클리어
                userLogout();
                
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
                <div className={"top-user-info-contents"}>
                    {user ? `${user.nickName} 님 반가워요!` : '로딩 중...'}
                </div>
                <span className={"top-user-info-separator"}></span>
                <a className={"button-12"} onClick={() => setView('mypage')}>마이페이지</a>
                <span className={"top-user-info-separator"}></span>
                <a className={"button-12"} onClick={logout}>로그아웃</a>
            </div>
            
        </div>
    )
}

export default Header
