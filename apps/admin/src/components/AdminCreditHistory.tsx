"use client";

import { useEffect, useState } from "react";
import { Worker } from "@workfolio/shared/generated/common";
import { useAdminCredits } from "@/hooks/useAdminCredits";
import { useSelectedWorker } from "@/contexts/SelectedWorkerContext";
import { CreditHistory, CreditTxType, getTxTypeLabel, isCreditAddition } from "@workfolio/shared/types/credit";
import TableView, { TableColumn } from "@workfolio/shared/ui/TableView";
import Pagination from "@workfolio/shared/ui/Pagination";

import CreditHistoryDetailModal from "./CreditHistoryDetailModal";
import AdminUserSearch from "./AdminUserSearch";
import CreditAdjustModal from "./CreditAdjustModal";

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
    const { creditHistories, totalElements, totalPages, currentPage, loading, error, fetchCreditHistories, adjustCredits } =
        useAdminCredits();
    const { selectedWorker, selectWorker, clearWorker } = useSelectedWorker();
    const [selectedTxType, setSelectedTxType] = useState("");
    const [selectedHistory, setSelectedHistory] = useState<CreditHistory | null>(null);
    const [creditAdjustAction, setCreditAdjustAction] = useState<"ADD" | "DEDUCT" | null>(null);

    useEffect(() => {
        if (selectedWorker) {
            fetchCreditHistories(0, PAGE_SIZE, selectedTxType || undefined, selectedWorker.id);
        }
    }, [fetchCreditHistories, selectedTxType, selectedWorker]);

    const handlePageChange = (page: number) => {
        if (selectedWorker) {
            fetchCreditHistories(page - 1, PAGE_SIZE, selectedTxType || undefined, selectedWorker.id);
        }
    };

    const handleTxTypeChange = (txType: string) => {
        setSelectedTxType(txType);
    };

    const handleSelectWorker = (worker: Worker) => {
        selectWorker(worker);
        setSelectedTxType("");
    };

    const handleClearWorker = () => {
        clearWorker();
        setSelectedTxType("");
    };

    const handleAdjustCredits = async (payload: { workerId: string; amount: number; description?: string }) => {
        if (!creditAdjustAction) return;
        const result = await adjustCredits(creditAdjustAction, payload.workerId, payload.amount, payload.description);
        if (!result.isSuccess) {
            alert(result.message || "크레딧 조정에 실패했습니다.");
            return;
        }
        setCreditAdjustAction(null);

        if (selectedWorker) {
            fetchCreditHistories(currentPage, PAGE_SIZE, selectedTxType || undefined, selectedWorker.id);
            return;
        }
        fetchCreditHistories(0, PAGE_SIZE, selectedTxType || undefined, payload.workerId);
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
            backgroundColor: isAddition ? "rgba(52, 199, 89, 0.12)" : "rgba(248, 113, 113, 0.15)",
            color: isAddition ? "#34C759" : "#f87171",
        } as const;
    };

    const columns: TableColumn<CreditHistory>[] = [
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
                    <span style={{ fontWeight: 600, color: isAddition ? "#34C759" : "#f87171" }}>
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
                <span style={{ color: "#121212" }}>
                    {history.balanceBefore.toLocaleString()} → {history.balanceAfter.toLocaleString()}
                </span>
            ),
        },
        {
            key: "description",
            title: "설명",
            render: (history) => (
                <span style={{ color: "#121212" }}>{history.description || "-"}</span>
            ),
        },
        {
            key: "createdAt",
            title: "일시",
            width: "160px",
            render: (history) => (
                <span style={{ color: "#121212" }}>{formatDate(history.createdAt)}</span>
            ),
        },
        {
            key: "actions",
            title: "",
            width: "80px",
            render: (history) => (
                <button
                    className="line gray"
                    onClick={(e) => { e.stopPropagation(); setSelectedHistory(history); }}
                    style={{ width: "50px", height: "30px", padding: "0", fontSize: "12px", whiteSpace: "nowrap" }}
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
                    <p>사용자를 선택하여 크레딧 내역을 조회합니다.</p>
                </div>
                {selectedWorker && (
                    <AdminUserSearch
                        selectedWorker={selectedWorker}
                        onSelectWorker={handleSelectWorker}
                        onClearWorker={handleClearWorker}
                        compact
                    />
                )}
            </div>

            <div className="page-cont" style={{ display: "flex", flexDirection: "column" }}>
                {!selectedWorker && (
                    <div className="cont-box" style={{ marginBottom: "16px" }}>
                        <AdminUserSearch
                            selectedWorker={selectedWorker}
                            onSelectWorker={handleSelectWorker}
                            onClearWorker={handleClearWorker}
                        />
                    </div>
                )}

                {selectedWorker && (
                    <div className="cont-box" style={{ display: "flex", flexDirection: "column" }}>
                        <div className="cont-tit">
                            <div>
                                <h3>크레딧 내역 ({totalElements.toLocaleString()}건)</h3>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", justifyContent: "flex-end" }}>
                                <button
                                    className="line gray"
                                    onClick={() => setCreditAdjustAction("ADD")}
                                    style={{ height: "34px", padding: "0 12px", fontSize: "13px" }}
                                >
                                    크레딧 부여
                                </button>
                                <button
                                    className="line red"
                                    onClick={() => setCreditAdjustAction("DEDUCT")}
                                    style={{ height: "34px", padding: "0 12px", fontSize: "13px" }}
                                >
                                    크레딧 차감
                                </button>
                                <button
                                    onClick={() => selectedWorker && fetchCreditHistories(currentPage, PAGE_SIZE, selectedTxType || undefined, selectedWorker.id)}
                                    disabled={loading}
                                    title="새로고침"
                                    style={{ width: "36px", height: "36px", padding: 0, border: "1px solid var(--gray003)", borderRadius: "8px", backgroundColor: "transparent", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                                >
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ animation: loading ? "spin 1s linear infinite" : "none" }}>
                                        <path d="M13.65 2.35A7.96 7.96 0 0 0 8 0C3.58 0 0 3.58 0 8s3.58 8 8 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 8 14 6 6 0 1 1 8 2c1.66 0 3.14.69 4.22 1.78L9 7h7V0l-2.35 2.35z" fill="var(--gray005)" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap", flexShrink: 0 }}>
                            {TX_TYPE_FILTERS.map((filter) => (
                                <button
                                    key={filter.value}
                                    className={selectedTxType === filter.value ? "dark-gray" : "line gray"}
                                    onClick={() => handleTxTypeChange(filter.value)}
                                    style={{ width: "fit-content", height: "34px", padding: "0 12px", fontSize: "13px", borderRadius: "8px" }}
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>

                        {error && <div style={{ color: "#f87171" }}>에러: {error}</div>}

                        {!loading && (
                            <>
                                <div style={{ flex: 1, minHeight: 0 }}>
                                    <TableView
                                        columns={columns}
                                        data={creditHistories}
                                        getRowKey={(history) => history.id}
                                        emptyMessage="크레딧 내역이 없습니다."
                                        isLoading={loading}
                                    />
                                </div>

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
                )}
            </div>

            <CreditHistoryDetailModal
                isOpen={selectedHistory !== null}
                creditHistory={selectedHistory}
                onClose={() => setSelectedHistory(null)}
            />
            <CreditAdjustModal
                isOpen={creditAdjustAction !== null}
                action={creditAdjustAction || "ADD"}
                initialWorker={selectedWorker as Worker | null}
                onClose={() => setCreditAdjustAction(null)}
                onSubmit={handleAdjustCredits}
            />
        </div>
    );
}
