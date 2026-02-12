import React from "react";

const WeeklyCalendarSkeleton: React.FC = () => {
    return (
        <>
            <style jsx>{`
                @keyframes skeleton-pulse {
                    0%,
                    100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.4;
                    }
                }
                .skeleton-item {
                    animation: skeleton-pulse 1.5s ease-in-out infinite;
                    background-color: #e0e0e0;
                }
            `}</style>
            <div className="weekly">
                {/* 요일 헤더 테이블 */}
                <table className="week">
                    <thead>
                        <tr>
                            <th>
                                <div
                                    className="skeleton-item"
                                    style={{
                                        width: "40px",
                                        height: "20px",
                                        borderRadius: "4px",
                                        margin: "0 auto",
                                    }}
                                />
                            </th>
                            {Array.from({ length: 7 }).map((_, index) => (
                                <th key={index}>
                                    <div
                                        className="skeleton-item"
                                        style={{
                                            width: "50px",
                                            height: "20px",
                                            borderRadius: "4px",
                                            margin: "0 auto",
                                        }}
                                    />
                                </th>
                            ))}
                        </tr>
                    </thead>
                </table>

                {/* 하루 종일 섹션 */}
                <div className="all">
                    <div>
                        <div
                            className="skeleton-item"
                            style={{ width: "60px", height: "16px", borderRadius: "4px" }}
                        />
                    </div>
                    <table>
                        <tbody>
                            {Array.from({ length: 3 }).map((_, rowIndex) => {
                                const isLastRow = rowIndex === 2; // 마지막 행 체크
                                return (
                                    <tr key={rowIndex}>
                                        {Array.from({ length: 7 }).map((_, colIndex) => (
                                            <td
                                                key={colIndex}
                                                className="record"
                                                style={{
                                                    padding: ".1rem 0",
                                                    paddingBottom: isLastRow ? ".5rem" : ".1rem",
                                                    cursor: "pointer",
                                                    position: "relative",
                                                }}
                                            >
                                                {/* td + td::before를 시각적으로 표현 */}
                                                {colIndex > 0 && (
                                                    <div
                                                        style={{
                                                            width: "1px",
                                                            height: "100%",
                                                            backgroundColor: "#e0e0e0",
                                                            position: "absolute",
                                                            bottom: 0,
                                                            left: 0,
                                                            zIndex: 1,
                                                        }}
                                                    />
                                                )}
                                                <div
                                                    className="skeleton-item"
                                                    style={{
                                                        width: "70%",
                                                        height: "2rem",
                                                        padding: "0 1rem",
                                                        margin: "0.3rem auto",
                                                        borderRadius: "4px",
                                                    }}
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* 시간별 이벤트 섹션 */}
                <div className="time">
                    {/* 시간 슬롯 리스트 */}
                    <ul>
                        {Array.from({ length: 24 }).map((_, index) => (
                            <li key={index}>
                                <div
                                    className="skeleton-item"
                                    style={{ width: "40px", height: "14px", borderRadius: "4px" }}
                                />
                            </li>
                        ))}
                    </ul>

                    {/* 시간별 이벤트 테이블 */}
                    <table>
                        <tbody>
                            <tr>
                                {Array.from({ length: 7 }).map((_, dayIndex) => (
                                    <td key={dayIndex} style={{ position: "relative" }}>
                                        {/* 시간 슬롯 구조 유지 (레이아웃을 위해, 스켈레톤은 표시하지 않음) */}
                                        <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                                            {Array.from({ length: 23 }).map((_, slotIndex) => (
                                                <li
                                                    key={slotIndex}
                                                    style={{
                                                        height: "4.8rem",
                                                        borderBottom: "1px solid #f0f0f0",
                                                        position: "relative",
                                                    }}
                                                >
                                                    {/* 30분 단위 서브 슬롯들 (빈 div로 구조만 유지) */}
                                                    <div
                                                        style={{
                                                            height: "2.4rem",
                                                            borderBottom: "1px solid #f5f5f5",
                                                        }}
                                                    ></div>
                                                    <div style={{ height: "2.4rem" }}></div>
                                                </li>
                                            ))}
                                        </ul>

                                        {/* 기록 아이템 스켈레톤 (랜덤하게 배치) */}
                                        <div
                                            className="record-wrap"
                                            style={{
                                                position: "absolute",
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                height: "110.4rem", // 23시간 * 4.8rem
                                            }}
                                        >
                                            {Array.from({ length: 5 }).map((_, eventIndex) => {
                                                const randomTop = Math.random() * 100; // 0-100rem 범위
                                                const randomHeight = 1.5 + Math.random() * 2; // 1.5-3.5rem 범위
                                                return (
                                                    <div
                                                        key={eventIndex}
                                                        className="skeleton-item"
                                                        style={{
                                                            position: "absolute",
                                                            top: `${randomTop}rem`,
                                                            left: "4px",
                                                            right: "4px",
                                                            height: `${randomHeight}rem`,
                                                            borderRadius: "4px",
                                                        }}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default WeeklyCalendarSkeleton;
