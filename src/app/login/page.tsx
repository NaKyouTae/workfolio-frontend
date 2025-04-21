"use client";

import Image from "next/image";
import Link from "next/link"
import {getCookie} from "@/utils/cookie"
import {useEffect, useState} from "react"
import {useRouter} from "next/navigation"

export default function LoginPage() {
    const router = useRouter();
    
    const KAKAO_AUTH_URL = "http://localhost:8080/api/oauth2/kakao"
    
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태를 추가하여 페이지 전환 시 처리할 수 있게 함
    
    useEffect(() => {
        // 비동기 함수 내에서 await 사용
        const checkAuth = async () => {
            const accessToken = await getCookie('accessToken');
            const refreshToken = await getCookie('refreshToken');
            
            // 쿠키에 accessToken과 refreshToken이 있다면 대시보드로 리디렉션
            if (accessToken && refreshToken) {
                console.log('로그인 성공')
                // router.push('/dashboard');
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
        <div className={'container'}>
            <h1 className={'title'}>
                워크폴리오<span className={'highlight'}>;</span>
            </h1>
            <p className={'description'}>
                워크폴리오는 업무와 이력을 한곳에서 관리하는 기록 플랫폼이에요.
                <br />
                쌓여가는 경험을 쉽고 편리하게 정리하고 더 나은 커리어를 만들어 보세요.
            </p>
            
            <div className={"buttonContainer"}>
                <Link href={KAKAO_AUTH_URL}>
                    <button className={'loginButton kakao'} >
                        <Image src="/kakao.png" alt="Kakao Logo" width={20} height={20} />
                        <span>카카오로 시작하기</span>
                    </button>
                </Link>
                {/*<button className={'loginButton naver'}>*/}
                {/*    <Image src="/naver.png" alt="Naver Logo" width={20} height={20} />*/}
                {/*    <span>네이버로 시작하기</span>*/}
                {/*</button>*/}
                
                {/*<button className={'loginButton google'}>*/}
                {/*    <Image src="/google.png" alt="Google Logo" width={20} height={20} />*/}
                {/*    <span>Google로 시작하기</span>*/}
                {/*</button>*/}
            </div>
        </div>
    );
}
