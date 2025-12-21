"use client";

import React, { useEffect } from "react";

interface CompanyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CompanyModal: React.FC<CompanyModalProps> = ({ isOpen, onClose }) => {
    // ESC 키 이벤트 처리
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape" && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <>
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                        .company-modal-cont {
                            padding: 3.2rem !important;
                        }
                        .company-modal-section {
                            margin-bottom: 3.6rem;
                        }
                        .company-modal-section:last-child {
                            margin-bottom: 0;
                        }
                        .company-modal-section-title {
                            font-size: 1.6rem;
                            font-weight: 600;
                            color: var(--black);
                            margin: 0 0 2rem 0;
                            letter-spacing: -0.02em;
                        }
                        .company-modal-info-grid {
                            display: flex;
                            flex-direction: column;
                            gap: 0;
                        }
                        .company-modal-info-item {
                            display: flex;
                            align-items: flex-start;
                            padding: 1.6rem 0;
                            border-bottom: 1px solid var(--gray002);
                        }
                        .company-modal-info-item:last-child {
                            border-bottom: none;
                        }
                        .company-modal-info-label {
                            font-size: 1.4rem;
                            font-weight: 500;
                            color: var(--gray005);
                            min-width: 14rem;
                            flex-shrink: 0;
                        }
                        .company-modal-info-value {
                            font-size: 1.4rem;
                            font-weight: 400;
                            color: var(--black);
                            word-break: break-word;
                            flex: 1;
                        }
                        .company-modal-info-value a {
                            color: var(--blue);
                            text-decoration: none;
                            transition: color 0.2s;
                        }
                        .company-modal-info-value a:hover {
                            color: var(--cyan);
                            text-decoration: underline;
                        }
                    `,
                }}
            />
            <div className="modal" onClick={handleOverlayClick}>
                <div className="modal-wrap" style={{ width: "64rem", maxHeight: "85vh" }}>
                    <div className="modal-tit">
                        <h2>회사 정보</h2>
                        <button onClick={onClose}>
                            <i className="ic-close"></i>
                        </button>
                    </div>
                    <div
                        className="modal-cont company-modal-cont"
                        style={{ maxHeight: "calc(85vh - 5.6rem - 7.6rem)", overflowY: "auto" }}
                    >
                        {/* 회사소개 */}
                        <div className="company-modal-section">
                            <h3 className="company-modal-section-title">회사소개</h3>
                            <div className="company-modal-info-grid">
                                <div className="company-modal-info-item">
                                    <span className="company-modal-info-label">서비스명</span>
                                    <span className="company-modal-info-value">
                                        워크폴리오(workfolio)
                                    </span>
                                </div>
                                <div className="company-modal-info-item">
                                    <span className="company-modal-info-label">도메인</span>
                                    <span className="company-modal-info-value">
                                        www.workfolio.kr
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 고객센터 */}
                        <div className="company-modal-section">
                            <h3 className="company-modal-section-title">고객센터</h3>
                            <div className="company-modal-info-grid">
                                <div className="company-modal-info-item">
                                    <span className="company-modal-info-label">이메일</span>
                                    <span className="company-modal-info-value">
                                        <a href="mailto:spectrum.mesh@gmail.com">
                                            spectrum.mesh@gmail.com
                                        </a>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 사업자 정보 */}
                        <div className="company-modal-section">
                            <h3 className="company-modal-section-title">사업자 정보</h3>
                            <div className="company-modal-info-grid">
                                <div className="company-modal-info-item">
                                    <span className="company-modal-info-label">사업자명</span>
                                    <span className="company-modal-info-value">
                                        스펙트럼(spectrum)
                                    </span>
                                </div>
                                <div className="company-modal-info-item">
                                    <span className="company-modal-info-label">대표자명</span>
                                    <span className="company-modal-info-value">나규태</span>
                                </div>
                                <div className="company-modal-info-item">
                                    <span className="company-modal-info-label">대표자 연락처</span>
                                    <span className="company-modal-info-value">010-9109-2682</span>
                                </div>
                                <div className="company-modal-info-item">
                                    <span className="company-modal-info-label">사업자 번호</span>
                                    <span className="company-modal-info-value">244-20-02381</span>
                                </div>
                                <div className="company-modal-info-item">
                                    <span className="company-modal-info-label">사무실 주소</span>
                                    <span className="company-modal-info-value">
                                        다산중앙로82번안길 166-46, 2층 207-S37호
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-btn">
                        <button onClick={onClose}>닫기</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CompanyModal;
