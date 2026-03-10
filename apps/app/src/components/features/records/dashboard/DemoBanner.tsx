"use client";

import React, { useState } from "react";
import LoginModal from "@workfolio/shared/ui/LoginModal";

interface DemoBannerProps {
    title?: string;
    description?: string;
    features?: string[];
}

const DemoBanner: React.FC<DemoBannerProps> = ({
    title = "업무 기록을 쌓으면 이력서가 자동으로 만들어집니다",
    description = "샘플 데이터를 체험 중입니다. 로그인하면 나만의 기록을 시작할 수 있어요.",
    features = ["주간 회고·프로젝트 기록으로 이력서 관리", "기업 유형별 이력서 자동 생성", "커리어 성장 데이터 시각화"],
}) => {
    const [showLoginModal, setShowLoginModal] = useState(false);

    return (
        <>
            <div className="demo-banner">
                <div className="demo-banner-content">
                    <div className="demo-banner-text">
                        <strong>{title}</strong>
                        <p>{description}</p>
                    </div>
                    <button
                        className="demo-banner-btn"
                        onClick={() => setShowLoginModal(true)}
                    >
                        로그인하고 시작하기
                    </button>
                </div>
                <ul className="demo-banner-features">
                    {features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                    ))}
                </ul>
            </div>
            <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
        </>
    );
};

export default DemoBanner;
