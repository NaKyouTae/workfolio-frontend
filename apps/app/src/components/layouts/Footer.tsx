"use client";

import React, { useState } from "react";
import Link from "next/link";
import CompanyModal from "@workfolio/shared/ui/CompanyModal";

const Footer = () => {
    const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);

    const handleCompanyClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setIsCompanyModalOpen(true);
    };

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
                        <a href="#" onClick={handleCompanyClick}>
                            회사소개
                        </a>
                    </li>
                </ul>
                <p>Ⓒ 2025 Spectrum. All rights reserved.</p>
            </footer>
            <CompanyModal
                isOpen={isCompanyModalOpen}
                onClose={() => setIsCompanyModalOpen(false)}
            />
        </>
    );
};

export default Footer;
