"use client";

import React from "react";
import styles from "./Company.module.css";

const COMPANY_INFO = {
    intro: {
        title: "회사소개",
        description:
            "워크폴리오(workfolio)는 직장인의 업무 기록과 커리어 성장을 돕는 서비스입니다. 매일의 업무를 체계적으로 기록하고, 기업 유형에 맞는 이력서를 자동으로 생성하여 더 나은 커리어를 준비할 수 있도록 지원합니다.",
    },
    business: [
        { label: "서비스명", value: "워크폴리오(workfolio)" },
        { label: "사업자명", value: "스펙트럼(spectrum)" },
        { label: "대표자명", value: "나규태" },
        { label: "사업자 번호", value: "244-20-02381" },
        { label: "사무실 주소", value: "다산중앙로82번안길 166-46, 2층 207-S37호" },
    ],
    contact: [
        { label: "대표자 연락처", value: "010-9109-2682" },
        {
            label: "고객센터 이메일",
            value: "spectrum.mesh@gmail.com",
            href: "mailto:spectrum.mesh@gmail.com",
        },
        {
            label: "도메인",
            value: "www.workfolio.kr",
            href: "https://www.workfolio.kr",
        },
    ],
};

const Company: React.FC = () => {
    return (
        <>
            <div className="page-title">
                <div>
                    <h2>회사소개</h2>
                </div>
            </div>
            <div className="page-cont">
                {/* 서비스 소개 카드 */}
                <div className={styles.introCard}>
                    <div className={styles.introIcon}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L2 7V10H22V7L12 2Z" fill="currentColor" opacity="0.2" />
                            <path d="M2 10H22V12H2V10Z" fill="currentColor" />
                            <path d="M4 12V20H8V16H10V20H14V16H16V20H20V12" stroke="currentColor" strokeWidth="1.5" fill="none" />
                            <path d="M2 20H22V22H2V20Z" fill="currentColor" opacity="0.6" />
                            <path d="M12 2L2 7V10H22V7L12 2Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
                        </svg>
                    </div>
                    <p className={styles.introText}>{COMPANY_INFO.intro.description}</p>
                </div>

                {/* 사업자 정보 */}
                <div className="cont-box">
                    <div className="cont-tit">
                        <div>
                            <h3>사업자 정보</h3>
                        </div>
                    </div>
                    <div className={styles.infoGrid}>
                        {COMPANY_INFO.business.map((item, idx) => (
                            <div className={styles.infoRow} key={idx}>
                                <span className={styles.infoLabel}>{item.label}</span>
                                <span className={styles.infoValue}>{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 연락처 정보 */}
                <div className="cont-box">
                    <div className="cont-tit">
                        <div>
                            <h3>연락처</h3>
                        </div>
                    </div>
                    <div className={styles.infoGrid}>
                        {COMPANY_INFO.contact.map((item, idx) => (
                            <div className={styles.infoRow} key={idx}>
                                <span className={styles.infoLabel}>{item.label}</span>
                                <span className={styles.infoValue}>
                                    {item.href ? (
                                        <a href={item.href} className={styles.link}>
                                            {item.value}
                                        </a>
                                    ) : (
                                        item.value
                                    )}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Company;
