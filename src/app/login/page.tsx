"use client";

import Image from 'next/image';
import {getCookie} from "@/utils/cookie"
import {useEffect, useState} from "react"
import {useRouter} from "next/navigation"

export default function LoginPage() {
    const router = useRouter();
    
    const KAKAO_AUTH_URL = "http://localhost:8080/api/oauth2/kakao"
    
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태를 추가하여 페이지 전환 시 처리할 수 있게 함
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        // URL에서 에러 파라미터 확인
        const urlParams = new URLSearchParams(window.location.search);
        const errorParam = urlParams.get('error');
        if (errorParam === 'oauth_failed') {
            setError('OAuth 로그인에 실패했습니다. 다시 시도해주세요.');
        }
        
        // 비동기 함수 내에서 await 사용
        const checkAuth = async () => {
            const accessToken = await getCookie('accessToken');
            const refreshToken = await getCookie('refreshToken');
            
            // 쿠키에 accessToken과 refreshToken이 있다면 대시보드로 리디렉션
            if (accessToken && refreshToken) {
                console.log('로그인 성공')
                router.push('/dashboard');
            } else {
                console.log('로그인 실패')
                setIsLoading(false); // 로그인 상태가 아니면 로딩 종료
            }
        };
        
        checkAuth();
    }, [router]);
    
    if (isLoading) {
        return <div>로딩 중...</div>; // 로딩 중일 때 표시할 내용
    }
    
    return (
        <div className="container">
            <div className="login-wrap">
                <div className="login-box">
                    <h1><Image src="/assets/img/logo/img-logo01.svg" alt="workfolio" width={1} height={1} /></h1>
                    <p>워크폴리오, 일과 이력을 한곳에 쌓아두는 나만의 기록장.<br/>차곡차곡 쌓이는 경험을 한곳에서 정리하고 더 멋진 커리어로 이어가 보세요.</p>
                    {error && (
                        <div style={{
                            color: '#dc3545',
                            backgroundColor: '#f8d7da',
                            border: '1px solid #f5c6cb',
                            borderRadius: '4px',
                            padding: '10px',
                            marginBottom: '20px',
                            fontSize: '14px'
                        }}>
                            {error}
                        </div>
                    )}
                    <ul>
                        <li>
                            <button className="btn-kakao" onClick={() => window.location.href = KAKAO_AUTH_URL}><span>카카오로 시작하기</span></button>
                        </li>   
                    </ul>
                </div>
            </div>
        </div>
    );
}
