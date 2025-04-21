import React from 'react'
import HttpMethod from "@/enums/HttpMethod"

const Header = () => {
    
    const logout = async () => {
        try {
            // 카카오 로그아웃 요청
            const data = await fetch('/api/logout', {
                method: HttpMethod.GET,
                credentials: "include"
            });
            
            console.log('logout data :: ', data)
            
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
            <div className={"top-logo"}>워크폴리오;</div>
            <button onClick={logout}>카카오 로그아웃</button>
        </div>
    )
}

export default Header
