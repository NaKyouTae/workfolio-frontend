"use client";

import { useEffect, useState } from "react";
import { useAdminCredits } from "@/hooks/useAdminCredits";
import { CreditHistory, CreditTxType, getTxTypeLabel, isCreditAddition } from "@workfolio/shared/types/credit";
import TableView, { TableColumn } from "@workfolio/shared/ui/TableView";
import Pagination from "@workfolio/shared/ui/Pagination";
import LoadingScreen from "@workfolio/shared/ui/LoadingScreen";
import CreditHistoryDetailModal from "./CreditHistoryDetailModal";

const TX_TYPE_FILTERS = [
    { label: "전체", value: "" },
    { label: "충전", value: "CHARGE" },
    { label: "보너스", value: "BONUS" },
    { label: "사용", value: "USE" },
    { label: "환불", value: "REFUND" },
    { label: "관리자 지급", value: "ADMIN_ADD" },
    { label: "관리자 차감", value: "ADMIN_DEDUCT" },
];

const PAGE_SIZE = 20;

export default function AdminCreditHistory() {
    const { creditHistories, totalElements, totalPages, currentPage, loading, error, fetchCreditHistories } =
        useAdminCredits();
    const [selectedTxType, setSelectedTxType] = useState("");
    const [selectedHistory, setSelectedHistory] = useState<CreditHistory | null>(null);

    useEffect(() => {
        fetchCreditHistories(0, PAGE_SIZE, selectedTxType || undefined);
    }, [fetchCreditHistories, selectedTxType]);

    const handlePageChange = (page: number) => {
        fetchCreditHistories(page - 1, PAGE_SIZE, selectedTxType || undefined);
    };

    const handleTxTypeChange = (txType: string) => {
        setSelectedTxType(txType);
    };

    const formatDate = (timestamp: number | string) => {
        const numTimestamp = typeof timestamp === "string" ? parseInt(timestamp, 10) : timestamp;
        if (isNaN(numTimestamp) || numTimestamp === 0) return "-";
        const date = new Date(numTimestamp);
        if (isNaN(date.getTime())) return "-";
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(
            date.getDate()
        ).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
    };

    const getTxTypeBadgeStyle = (txType: CreditTxType | string) => {
        const isAddition = isCreditAddition(txType);
        return {
            display: "inline-block",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: 600,
            backgroundColor: isAddition ? "rgba(62, 207, 142, 0.15)" : "rgba(248, 113, 113, 0.15)",
            color: isAddition ? "#3ecf8e" : "#f87171",
        } as const;
    };

    const columns: TableColumn<CreditHistory>[] = [
        {
            key: "worker",
            title: "사용자",
            width: "150px",
            render: (history) => (
                <div>
                    <div style={{ fontWeight: 500 }}>{history.worker?.nickName || "-"}</div>
                    <div style={{ fontSize: "12px", color: "#6b6b6b" }}>{history.worker?.email || ""}</div>
                </div>
            ),
        },
        {
            key: "txType",
            title: "유형",
            width: "120px",
            render: (history) => (
                <span style={getTxTypeBadgeStyle(history.txType)}>
                    {getTxTypeLabel(history.txType)}
                </span>
            ),
        },
        {
            key: "amount",
            title: "금액",
            width: "100px",
            render: (history) => {
                const isAddition = isCreditAddition(history.txType);
                return (
                    <span style={{ fontWeight: 600, color: isAddition ? "#3ecf8e" : "#f87171" }}>
                        {isAddition ? "+" : ""}{history.amount.toLocaleString()}
                    </span>
                );
            },
        },
        {
            key: "balance",
            title: "잔액",
            width: "120px",
            render: (history) => (
                <span style={{ color: "#a0a0a0" }}>
                    {history.balanceBefore.toLocaleString()} → {history.balanceAfter.toLocaleString()}
                </span>
            ),
        },
        {
            key: "description",
            title: "설명",
            render: (history) => (
                <span style={{ color: "#a0a0a0" }}>{history.description || "-"}</span>
            ),
        },
        {
            key: "createdAt",
            title: "일시",
            width: "160px",
            render: (history) => (
                <span style={{ color: "#6b6b6b" }}>{formatDate(history.createdAt)}</span>
            ),
        },
        {
            key: "actions",
            title: "",
            width: "80px",
            render: (history) => (
                <button
                    className="line gray"
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedHistory(history);
                    }}
                    style={{ width: "60px", height: "30px" }}
                >
                    상세
                </button>
            ),
        },
    ];

    return (
        <div className="contents">
            <div className="page-title">
                <div>
                    <h2>크레딧 내역</h2>
                    <p>전체 사용자의 크레딧 내역을 조회합니다.</p>
                </div>
            </div>

            <div className="page-cont">
                <div className="cont-box">
                    <div className="cont-tit">
                        <h3>전체 크레딧 내역 ({totalElements.toLocaleString()}건)</h3>
                    </div>

                    <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
                        {TX_TYPE_FILTERS.map((filter) => (
                            <button
                                key={filter.value}
                                className={selectedTxType === filter.value ? "dark-gray" : "line gray"}
                                onClick={() => handleTxTypeChange(filter.value)}
                                style={{ height: "32px", padding: "0 12px", fontSize: "13px" }}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>

                    {loading && <LoadingScreen />}
                    {error && <div style={{ color: "#f87171" }}>에러: {error}</div>}

                    {!loading && (
                        <>
                            <TableView
                                columns={columns}
                                data={creditHistories}
                                getRowKey={(history) => history.id}
                                emptyMessage="크레딧 내역이 없습니다."
                                isLoading={loading}
                            />

                            {totalPages > 1 && (
                                <Pagination
                                    currentPage={currentPage + 1}
                                    totalPages={totalPages}
                                    itemsPerPage={PAGE_SIZE}
                                    onPageChange={handlePageChange}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>

            <CreditHistoryDetailModal
                isOpen={selectedHistory !== null}
                creditHistory={selectedHistory}
                onClose={() => setSelectedHistory(null)}
            />
        </div>
    );
}
