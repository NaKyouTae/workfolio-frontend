"use client";

import React from "react";
import Link from "next/link";

const Footer = () => {
    return (
        <>
            <footer>
                <ul>
                    <li>
                        <a href="https://forms.gle/ntxm9NVwbFLQmUbg6" target="_blank">
                            고객문의
                        </a>
                    </li>
                    <li>
                        <Link href="/service-guides/notices">공지사항</Link>
                    </li>
                    <li>
                        <Link href="/service-guides/terms-services">이용약관</Link>
                    </li>
                    <li>
                        <Link href="/service-guides/privacy-policies">개인정보 처리방침</Link>
                    </li>
                    <li>
                        <Link href="/service-guides/company">회사소개</Link>
                    </li>
                </ul>
                <p>Ⓒ 2025 Spectrum. All rights reserved.</p>
            </footer>
        </>
    );
};

export default Footer;
