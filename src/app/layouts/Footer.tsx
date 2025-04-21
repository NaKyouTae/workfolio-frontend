import React from 'react';
import Link from "next/link"

const Footer = () => {
    const KAKAO_AUTH_URL = "https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=fe9184e5f974225132f33ee838f35596&redirect_uri=http://localhost:8080/login/oauth2/code/kakao";
    
    return (
        <Link href={KAKAO_AUTH_URL} passHref>
            <button className="w-full bg-yellow-400 text-black flex items-center gap-2 hover:bg-yellow-500">
                카카오 로그인
            </button>
        </Link>
    );
};

export default Footer;
