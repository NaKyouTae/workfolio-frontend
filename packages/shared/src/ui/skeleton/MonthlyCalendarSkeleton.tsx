import React from "react";

const MonthlyCalendarSkeleton: React.FC = () => {
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    const weeks = Array.from({ length: 6 }); // 최대 6주

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
            {/* 요일 헤더 */}
            <table className="week">
                <thead>
                    <tr>
                        {weekdays.map((day) => (
                            <th key={day}>
                                <div
                                    className="skeleton-item"
                                    style={{
                                        width: "30px",
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

            {/* 날짜 그리드 */}
            <div className="days">
                {weeks.map((_, weekIndex) => (
                    <div className="weekly" key={weekIndex}>
                        {/* 구조 테이블 */}
                        <table className="structure-table">
                            <tbody>
                                <tr>
                                    {Array.from({ length: 7 }).map((_, dayIndex) => (
                                        <td key={dayIndex} />
                                    ))}
                                </tr>
                            </tbody>
                        </table>

                        {/* 메인 테이블 */}
                        <table>
                            <tbody>
                                {/* 날짜 행 */}
                                <tr>
                                    {Array.from({ length: 7 }).map((_, dayIndex) => (
                                        <td key={dayIndex}>
                                            <div>
                                                <div
                                                    className="skeleton-item"
                                                    style={{
                                                        width: "24px",
                                                        height: "20px",
                                                        borderRadius: "4px",
                                                        margin: "4px",
                                                    }}
                                                />
                                            </div>
                                        </td>
                                    ))}
                                </tr>

                                {/* 레코드 행들 (최대 5개) */}
                                {Array.from({ length: 5 }).map((_, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {Array.from({ length: 7 }).map((_, dayIndex) => {
                                            // 랜덤하게 레코드 표시 (30% 확률)
                                            const showRecord = Math.random() < 0.3;
                                            const colSpan =
                                                showRecord && Math.random() < 0.3
                                                    ? Math.floor(Math.random() * 3) + 1
                                                    : 1;

                                            return (
                                                <td key={dayIndex} className="record">
                                                    {showRecord && (
                                                        <div
                                                            className="skeleton-item"
                                                            style={{
                                                                width: colSpan > 1 ? "100%" : "80%",
                                                                height: "24px",
                                                                borderRadius: "4px",
                                                                margin: "2px auto",
                                                            }}
                                                        />
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
        </>
    );
};

export default MonthlyCalendarSkeleton;
