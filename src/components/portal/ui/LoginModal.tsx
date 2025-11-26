"use client";

import Image from 'next/image';
import { useEffect, useState } from "react";
import { getCookie } from "@/utils/cookie";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
    const KAKAO_AUTH_URL = `${API_BASE_URL}/api/oauth2/kakao`;
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen) {
            setError(null);
            return;
        }

        // URL에서 에러 파라미터 확인
        const urlParams = new URLSearchParams(window.location.search);
        const errorParam = urlParams.get('error');
        if (errorParam === 'oauth_failed') {
            setError('OAuth 로그인에 실패했습니다. 다시 시도해주세요.');
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        // 로그인 성공 체크 - 카카오 로그인 후 리다이렉트된 경우에만 체크
        const checkAuth = async () => {
            // URL에 code 파라미터가 있으면 카카오 로그인 리다이렉트임
            const urlParams = new URLSearchParams(window.location.search);
            const hasCode = urlParams.has('code');
            
            // 카카오 로그인 리다이렉트가 아니면 체크하지 않음
            if (!hasCode) {
                return;
            }
            
            const accessToken = await getCookie('accessToken');
            const refreshToken = await getCookie('refreshToken');
            
            if (accessToken && refreshToken) {
                // admin 토큰 제거 (portal 로그인 시)
                document.cookie = 'admin_access_token=; max-age=0; path=/';
                document.cookie = 'admin_refresh_token=; max-age=0; path=/';
                onClose();
                // 페이지 새로고침하여 로그인 상태 반영
                window.location.reload();
            }
        };

        // 초기 체크만 수행 (카카오 로그인 리다이렉트인 경우)
        checkAuth();
    }, [isOpen, onClose]);

    // ESC 키 이벤트 처리
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal" onClick={handleOverlayClick}>
            <div className="modal-wrap" style={{ width: '53rem', zIndex: 10000 }}>
                <div className="modal-tit">
                    <h2>로그인</h2>
                    <button onClick={onClose}><i className="ic-close" /></button>
                </div>
                <div className="modal-cont">
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
        </div>
    );
};

export default LoginModal;

