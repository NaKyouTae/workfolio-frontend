"use client";

import React from "react";

const Company: React.FC = () => {
    return (
        <>
            <div className="page-title">
                <div>
                    <h2>회사 정보</h2>
                </div>
            </div>
            <div className="page-cont">
                <article>
                    <div className="cont-box">
                        <div className="cont-tit">
                            <div>
                                <h3>사업자 정보</h3>
                            </div>
                        </div>
                        <div className="terms-desc">
                            <table
                                style={{
                                    width: "100%",
                                    borderCollapse: "collapse",
                                    marginTop: "1rem",
                                }}
                            >
                                <tbody>
                                    <tr style={{ borderBottom: "1px solid #e9ecef" }}>
                                        <td
                                            style={{
                                                padding: "1rem",
                                                fontWeight: "600",
                                                width: "200px",
                                                backgroundColor: "#f8f9fa",
                                            }}
                                        >
                                            사업자명
                                        </td>
                                        <td style={{ padding: "1rem" }}>스펙트럼(spectrum)</td>
                                    </tr>
                                    <tr style={{ borderBottom: "1px solid #e9ecef" }}>
                                        <td
                                            style={{
                                                padding: "1rem",
                                                fontWeight: "600",
                                                backgroundColor: "#f8f9fa",
                                            }}
                                        >
                                            서비스명
                                        </td>
                                        <td style={{ padding: "1rem" }}>워크폴리오(workfolio)</td>
                                    </tr>
                                    <tr style={{ borderBottom: "1px solid #e9ecef" }}>
                                        <td
                                            style={{
                                                padding: "1rem",
                                                fontWeight: "600",
                                                backgroundColor: "#f8f9fa",
                                            }}
                                        >
                                            도메인
                                        </td>
                                        <td style={{ padding: "1rem" }}>www.workfolio.kr</td>
                                    </tr>
                                    <tr style={{ borderBottom: "1px solid #e9ecef" }}>
                                        <td
                                            style={{
                                                padding: "1rem",
                                                fontWeight: "600",
                                                backgroundColor: "#f8f9fa",
                                            }}
                                        >
                                            사업자 번호
                                        </td>
                                        <td style={{ padding: "1rem" }}>244-20-02381</td>
                                    </tr>
                                    <tr style={{ borderBottom: "1px solid #e9ecef" }}>
                                        <td
                                            style={{
                                                padding: "1rem",
                                                fontWeight: "600",
                                                backgroundColor: "#f8f9fa",
                                            }}
                                        >
                                            사무실 주소
                                        </td>
                                        <td style={{ padding: "1rem" }}>
                                            다산중앙로82번안길 166-46, 2층 207-S37호
                                        </td>
                                    </tr>
                                    <tr style={{ borderBottom: "1px solid #e9ecef" }}>
                                        <td
                                            style={{
                                                padding: "1rem",
                                                fontWeight: "600",
                                                backgroundColor: "#f8f9fa",
                                            }}
                                        >
                                            고객센터 이메일
                                        </td>
                                        <td style={{ padding: "1rem" }}>
                                            <a
                                                href="mailto:spectrum.mesh@gmail.com"
                                                style={{ color: "#007bff", textDecoration: "none" }}
                                            >
                                                spectrum.mesh@gmail.com
                                            </a>
                                        </td>
                                    </tr>
                                    <tr style={{ borderBottom: "1px solid #e9ecef" }}>
                                        <td
                                            style={{
                                                padding: "1rem",
                                                fontWeight: "600",
                                                backgroundColor: "#f8f9fa",
                                            }}
                                        >
                                            업태 - 업종
                                        </td>
                                        <td style={{ padding: "1rem" }}>
                                            도매 및 소매업 - 전자상거래 소매업
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </article>
            </div>
        </>
    );
};

export default Company;
