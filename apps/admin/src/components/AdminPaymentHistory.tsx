"use client";

import { useEffect } from "react";
import { Payment, Payment_PaymentStatus, Payment_PaymentMethod } from "@workfolio/shared/generated/common";
import { useAdminPayments } from "@/hooks/useAdminPayments";
import { useSelectedWorker } from "@/contexts/SelectedWorkerContext";
import TableView, { TableColumn } from "@workfolio/shared/ui/TableView";
import Pagination from "@workfolio/shared/ui/Pagination";

import AdminUserSearch from "./AdminUserSearch";

const PAGE_SIZE = 20;

function getPaymentStatusLabel(status: Payment_PaymentStatus | string): string {
    const s = typeof status === "string" ? status : Payment_PaymentStatus[status];
    switch (s) {
        case "PENDING": return "대기";
        case "COMPLETED": return "완료";
        case "FAILED": return "실패";
        case "REFUNDED": return "환불";
        default: return "알 수 없음";
    }
}

function getPaymentMethodLabel(method: Payment_PaymentMethod | string): string {
    const m = typeof method === "string" ? method : Payment_PaymentMethod[method];
    switch (m) {
        case "CARD": return "카드";
        case "CASH": return "현금";
        default: return "-";
    }
}

function getStatusBadgeStyle(status: Payment_PaymentStatus | string) {
    const s = typeof status === "string" ? status : Payment_PaymentStatus[status];
    const colorMap: Record<string, { bg: string; color: string }> = {
        COMPLETED: { bg: "rgba(52, 199, 89, 0.12)", color: "#34C759" },
        PENDING: { bg: "rgba(255, 204, 0, 0.15)", color: "#CC8800" },
        FAILED: { bg: "rgba(248, 113, 113, 0.15)", color: "#f87171" },
        REFUNDED: { bg: "rgba(147, 130, 220, 0.15)", color: "#7C6DC4" },
    };
    const c = colorMap[s] || { bg: "#F2F3F5", color: "#121212" };
    return {
        display: "inline-block", padding: "4px 8px", borderRadius: "4px",
        fontSize: "12px", fontWeight: 600, backgroundColor: c.bg, color: c.color,
    } as const;
}

export default function AdminPaymentHistory() {
    const { payments, totalElements, totalPages, currentPage, loading, error, fetchPayments, deletePayment } =
        useAdminPayments();
    const { selectedWorker, selectWorker, clearWorker } = useSelectedWorker();

    useEffect(() => {
        if (selectedWorker) {
            fetchPayments(selectedWorker.id, 0, PAGE_SIZE);
        }
    }, [fetchPayments, selectedWorker]);

    const handlePageChange = (page: number) => {
        if (selectedWorker) {
            fetchPayments(selectedWorker.id, page - 1, PAGE_SIZE);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("정말 삭제하시겠습니까?")) return;
        const success = await deletePayment(id);
        if (success && selectedWorker) {
            fetchPayments(selectedWorker.id, currentPage, PAGE_SIZE);
        }
    };

    const formatDate = (timestamp: number | string | undefined) => {
        if (!timestamp) return "-";
        const numTimestamp = typeof timestamp === "string" ? parseInt(timestamp, 10) : timestamp;
        if (isNaN(numTimestamp) || numTimestamp === 0) return "-";
        const date = new Date(numTimestamp);
        if (isNaN(date.getTime())) return "-";
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(
            date.getDate()
        ).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
    };

    const columns: TableColumn<Payment>[] = [
        {
            key: "id",
            title: "결제 ID",
            width: "120px",
            render: (p) => (
                <span style={{ fontFamily: "monospace", fontSize: "11px", color: "#121212" }}>
                    {p.id.substring(0, 12)}...
                </span>
            ),
        },
        {
            key: "amount",
            title: "금액",
            width: "100px",
            render: (p) => <span style={{ fontWeight: 600 }}>{p.amount.toLocaleString()}원</span>,
        },
        {
            key: "status",
            title: "상태",
            width: "80px",
            render: (p) => <span style={getStatusBadgeStyle(p.status)}>{getPaymentStatusLabel(p.status)}</span>,
        },
        {
            key: "paymentMethod",
            title: "결제방법",
            width: "80px",
            render: (p) => <span style={{ color: "#121212" }}>{getPaymentMethodLabel(p.paymentMethod)}</span>,
        },
        {
            key: "paidAt",
            title: "결제일",
            width: "160px",
            render: (p) => <span style={{ color: "#121212" }}>{formatDate(p.paidAt)}</span>,
        },
        {
            key: "createdAt",
            title: "생성일",
            width: "160px",
            render: (p) => <span style={{ color: "#121212" }}>{formatDate(p.createdAt)}</span>,
        },
        {
            key: "actions",
            title: "",
            width: "70px",
            render: (p) => (
                <button
                    className="line red"
                    onClick={(e) => { e.stopPropagation(); handleDelete(p.id); }}
                    style={{ width: "50px", height: "30px", fontSize: "12px" }}
                >
                    삭제
                </button>
            ),
        },
    ];

    return (
        <div className="contents">
            <div className="page-title">
                <div>
                    <h2>결제 내역</h2>
                    <p>사용자를 선택하여 결제 내역을 조회합니다.</p>
                </div>
                {selectedWorker && (
                    <AdminUserSearch
                        selectedWorker={selectedWorker}
                        onSelectWorker={selectWorker}
                        onClearWorker={clearWorker}
                        compact
                    />
                )}
            </div>

            <div className="page-cont">
                {!selectedWorker && (
                    <div className="cont-box" style={{ marginBottom: "16px" }}>
                        <AdminUserSearch
                            selectedWorker={selectedWorker}
                            onSelectWorker={selectWorker}
                            onClearWorker={clearWorker}
                        />
                    </div>
                )}

                {selectedWorker && (
                    <div className="cont-box">
                        <div className="cont-tit">
                            <div>
                                <h3>결제 내역 ({totalElements.toLocaleString()}건)</h3>
                            </div>
                            <button
                                onClick={() => selectedWorker && fetchPayments(selectedWorker.id, currentPage, PAGE_SIZE)}
                                disabled={loading}
                                title="새로고침"
                                style={{ width: "36px", height: "36px", padding: 0, border: "1px solid var(--gray003)", borderRadius: "8px", backgroundColor: "transparent", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                            >
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ animation: loading ? "spin 1s linear infinite" : "none" }}>
                                    <path d="M13.65 2.35A7.96 7.96 0 0 0 8 0C3.58 0 0 3.58 0 8s3.58 8 8 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 8 14 6 6 0 1 1 8 2c1.66 0 3.14.69 4.22 1.78L9 7h7V0l-2.35 2.35z" fill="var(--gray005)" />
                                </svg>
                            </button>
                        </div>

                        {error && <div style={{ color: "#f87171" }}>에러: {error}</div>}

                        {!loading && (
                            <>
                                <TableView
                                    columns={columns}
                                    data={payments}
                                    getRowKey={(p) => p.id}
                                    emptyMessage="결제 내역이 없습니다."
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
                )}
            </div>
        </div>
    );
}
