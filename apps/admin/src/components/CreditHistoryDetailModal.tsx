"use client";

import { CreditHistory, getTxTypeLabel, isCreditAddition } from "@workfolio/shared/types/credit";
import AdminModal from "./AdminModal";

interface CreditHistoryDetailModalProps {
    isOpen: boolean;
    creditHistory: CreditHistory | null;
    onClose: () => void;
}

export default function CreditHistoryDetailModal({ isOpen, creditHistory, onClose }: CreditHistoryDetailModalProps) {
    if (!creditHistory) return null;

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
                    <span style={{ color: "#121212", marginLeft: "8px" }}>({creditHistory.worker.email})</span>
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
                        backgroundColor: isAddition ? "rgba(52, 199, 89, 0.12)" : "rgba(248, 113, 113, 0.15)",
                        color: isAddition ? "#34C759" : "#f87171",
                    }}
                >
                    {getTxTypeLabel(creditHistory.txType)}
                </span>
            ),
        },
        {
            label: "금액",
            value: (
                <span style={{ fontWeight: 600, color: isAddition ? "#34C759" : "#f87171" }}>
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
        <AdminModal
            isOpen={isOpen}
            onClose={onClose}
            title="크레딧 내역 상세"
            maxWidth="550px"
            maxHeight="90vh"
            footer={
                <button className="line gray" onClick={onClose} style={{ height: "36px", padding: "0 20px" }}>
                    닫기
                </button>
            }
        >
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {rows.map((row) => (
                    <div
                        key={row.label}
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "8px 0",
                            borderBottom: "1px solid #EEF0F1",
                        }}
                    >
                        <span style={{ color: "#121212", fontSize: "13px", flexShrink: 0, marginRight: "16px" }}>
                            {row.label}
                        </span>
                        <span style={{ color: "#121212", fontSize: "13px", textAlign: "right" }}>{row.value}</span>
                    </div>
                ))}
            </div>
        </AdminModal>
    );
}
