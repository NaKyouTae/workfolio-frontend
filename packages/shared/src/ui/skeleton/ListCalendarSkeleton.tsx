import React from "react";

interface ListCalendarSkeletonProps {
    itemCount?: number; // 스켈레톤 아이템 개수 (기본값: 30)
}

const ListCalendarSkeleton: React.FC<ListCalendarSkeletonProps> = ({ itemCount = 30 }) => {
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
                :global(table.list thead) {
                    z-index: 10;
                    position: sticky;
                    top: 0;
                }
            `}</style>
            <table className="list">
                <colgroup>
                    <col style={{ width: "8rem" }} />
                    <col style={{ width: "4rem" }} />
                    <col style={{ width: "8rem" }} />
                    <col style={{ width: "16rem" }} />
                    <col style={{ width: "auto" }} />
                </colgroup>
                <thead>
                    <tr>
                        <th>일자</th>
                        <th>추가</th>
                        <th>시간</th>
                        <th>캘린더</th>
                        <th>내용</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: itemCount }).map((_, index) => {
                        // 날짜 그룹 표시 (매 3-5개마다 날짜가 있는 행 표시)
                        const isFirstRecordOfDay =
                            index === 0 || index % Math.floor(Math.random() * 3 + 3) === 0;
                        // 빈 날짜 행 표시 (매 5-7개마다)
                        const isEmptyDate =
                            index > 0 && index % Math.floor(Math.random() * 3 + 5) === 0;

                        if (isEmptyDate) {
                            // 빈 날짜 행
                            return (
                                <tr key={`empty-${index}`}>
                                    <td>
                                        <div
                                            className="skeleton-item"
                                            style={{
                                                width: "70px",
                                                height: "16px",
                                                borderRadius: "4px",
                                                margin: "0 auto",
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <div
                                            className="skeleton-item"
                                            style={{
                                                width: "1.6rem",
                                                height: "1.6rem",
                                                borderRadius: ".2rem",
                                                margin: "0 auto",
                                            }}
                                        />
                                    </td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            );
                        }

                        return (
                            <tr key={index}>
                                {/* 일자 - isFirstRecordOfDay일 때만 표시 */}
                                <td>
                                    {isFirstRecordOfDay ? (
                                        <div
                                            className="skeleton-item"
                                            style={{
                                                width: "70px",
                                                height: "16px",
                                                borderRadius: "4px",
                                                margin: "0 auto",
                                            }}
                                        />
                                    ) : (
                                        ""
                                    )}
                                </td>
                                {/* 추가 버튼 - isFirstRecordOfDay일 때만 표시 */}
                                <td>
                                    {isFirstRecordOfDay ? (
                                        <div
                                            className="skeleton-item"
                                            style={{
                                                width: "1.6rem",
                                                height: "1.6rem",
                                                borderRadius: ".2rem",
                                                margin: "0 auto",
                                            }}
                                        />
                                    ) : (
                                        ""
                                    )}
                                </td>
                                {/* 시간 */}
                                <td>
                                    <div
                                        className="skeleton-item"
                                        style={{
                                            width: "60px",
                                            height: "16px",
                                            borderRadius: "4px",
                                            margin: "0 auto",
                                        }}
                                    />
                                </td>
                                {/* 캘린더 */}
                                <td>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            columnGap: ".6rem",
                                        }}
                                    >
                                        <div
                                            className="skeleton-item"
                                            style={{
                                                width: ".6rem",
                                                height: "1.4rem",
                                                borderRadius: ".2rem",
                                                flexShrink: 0,
                                            }}
                                        />
                                        <div
                                            className="skeleton-item"
                                            style={{
                                                width: "100px",
                                                height: "16px",
                                                borderRadius: "4px",
                                                flex: 1,
                                                maxWidth: "12.8rem",
                                            }}
                                        />
                                    </div>
                                </td>
                                {/* 내용 */}
                                <td>
                                    <div
                                        className="skeleton-item"
                                        style={{
                                            width: `${Math.random() * 200 + 150}px`,
                                            height: "16px",
                                            borderRadius: "4px",
                                        }}
                                    />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </>
    );
};

export default ListCalendarSkeleton;
