"use client";

import { CreditHistory, getTxTypeLabel, isCreditAddition } from "@workfolio/shared/types/credit";

interface CreditHistoryDetailModalProps {
    isOpen: boolean;
    creditHistory: CreditHistory | null;
    onClose: () => void;
}

export default function CreditHistoryDetailModal({ isOpen, creditHistory, onClose }: CreditHistoryDetailModalProps) {
    if (!isOpen || !creditHistory) return null;

    const formatDate = (timestamp: number | string) => {
        const numTimestamp = typeof timestamp === "string" ? parseInt(timestamp, 10) : timestamp;
        if (isNaN(numTimestamp) || numTimestamp === 0) return "-";
        const date = new Date(numTimestamp);
        if (isNaN(date.getTime())) return "-";
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(
            date.getDate()
        ).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(
            2,
            "0"
        )}:${String(date.getSeconds()).padStart(2, "0")}`;
    };

    const isAddition = isCreditAddition(creditHistory.txType);

    const rows: { label: string; value: string | React.ReactNode }[] = [
        { label: "ID", value: creditHistory.id },
        {
            label: "사용자",
            value: creditHistory.worker ? (
                <div>
                    <span>{creditHistory.worker.nickName}</span>
                    <span style={{ color: "#6b6b6b", marginLeft: "8px" }}>({creditHistory.worker.email})</span>
                </div>
            ) : (
                "-"
            ),
        },
        {
            label: "유형",
            value: (
                <span
                    style={{
                        display: "inline-block",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: 600,
                        backgroundColor: isAddition ? "rgba(62, 207, 142, 0.15)" : "rgba(248, 113, 113, 0.15)",
                        color: isAddition ? "#3ecf8e" : "#f87171",
                    }}
                >
                    {getTxTypeLabel(creditHistory.txType)}
                </span>
            ),
        },
        {
            label: "금액",
            value: (
                <span style={{ fontWeight: 600, color: isAddition ? "#3ecf8e" : "#f87171" }}>
                    {isAddition ? "+" : ""}{creditHistory.amount.toLocaleString()}
                </span>
            ),
        },
        { label: "변경 전 잔액", value: creditHistory.balanceBefore.toLocaleString() },
        { label: "변경 후 잔액", value: creditHistory.balanceAfter.toLocaleString() },
        { label: "참조 유형", value: creditHistory.referenceType || "-" },
        { label: "참조 ID", value: creditHistory.referenceId || "-" },
        { label: "설명", value: creditHistory.description || "-" },
        { label: "일시", value: formatDate(creditHistory.createdAt) },
    ];

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
            }}
            onClick={onClose}
        >
            <div
                style={{
                    backgroundColor: "#1c1c1c",
                    borderRadius: "12px",
                    border: "1px solid #2e2e2e",
                    padding: "24px",
                    width: "100%",
                    maxWidth: "520px",
                    maxHeight: "80vh",
                    overflowY: "auto",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "20px",
                    }}
                >
                    <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#ededed" }}>크레딧 내역 상세</h3>
                    <button
                        onClick={onClose}
                        style={{
                            background: "none",
                            border: "none",
                            color: "#6b6b6b",
                            fontSize: "18px",
                            cursor: "pointer",
                            padding: "4px",
                        }}
                    >
                        ✕
                    </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {rows.map((row) => (
                        <div
                            key={row.label}
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "8px 0",
                                borderBottom: "1px solid #2e2e2e",
                            }}
                        >
                            <span style={{ color: "#6b6b6b", fontSize: "13px", flexShrink: 0, marginRight: "16px" }}>
                                {row.label}
                            </span>
                            <span style={{ color: "#ededed", fontSize: "13px", textAlign: "right" }}>{row.value}</span>
                        </div>
                    ))}
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
                    <button className="line gray" onClick={onClose} style={{ height: "36px", padding: "0 20px" }}>
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
}
