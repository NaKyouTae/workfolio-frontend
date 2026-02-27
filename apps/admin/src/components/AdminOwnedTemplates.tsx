"use client";

import { useEffect, useState } from "react";
import { WorkerUITemplate, UITemplateType, getUITemplateTypeValue, isUITemplateExpired, getRemainingDays } from "@workfolio/shared/types/uitemplate";
import { useAdminOwnedTemplates } from "@/hooks/useAdminOwnedTemplates";
import { useSelectedWorker } from "@/contexts/SelectedWorkerContext";
import TableView, { TableColumn } from "@workfolio/shared/ui/TableView";
import Pagination from "@workfolio/shared/ui/Pagination";

import AdminUserSearch from "./AdminUserSearch";

const DEFAULT_PAGE_SIZE = 20;
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export default function AdminOwnedTemplates() {
    const { ownedTemplates, totalElements, totalPages, currentPage, loading, error, fetchOwnedTemplates } = useAdminOwnedTemplates();
    const { selectedWorker, selectWorker, clearWorker } = useSelectedWorker();
    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

    useEffect(() => {
        if (selectedWorker) {
            fetchOwnedTemplates(selectedWorker.id, 0, pageSize);
        }
    }, [fetchOwnedTemplates, pageSize, selectedWorker]);

    const formatDateTime = (timestamp: number | string) => {
        const numTimestamp = typeof timestamp === "string" ? parseInt(timestamp, 10) : timestamp;
        if (isNaN(numTimestamp) || numTimestamp === 0) return "-";
        const date = new Date(numTimestamp);
        if (isNaN(date.getTime())) return "-";
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(
            date.getDate()
        ).padStart(2, "0")}`;
    };

    const getTypeLabel = (type: UITemplateType | string) => {
        const value = getUITemplateTypeValue(type);
        switch (value) {
            case "URL":
                return "URL";
            case "PDF":
                return "PDF";
            default:
                return "-";
        }
    };

    const getStatusLabel = (item: WorkerUITemplate) => {
        if (!item.isActive) {
            return { label: "비활성", color: "#9ca3af" };
        }
        if (item.isExpired || isUITemplateExpired(item.expiredAt)) {
            return { label: "만료", color: "#f87171" };
        }
        const remaining = getRemainingDays(item.expiredAt);
        if (remaining <= 7) {
            return { label: `만료 임박 (${remaining}일)`, color: "#f59e0b" };
        }
        return { label: "활성", color: "#34d399" };
    };

    const columns: TableColumn<WorkerUITemplate>[] = [
        {
            key: "id",
            title: "ID",
            width: "80px",
            render: (item) => (
                <span style={{ color: "var(--gray005)", fontSize: "12px" }}>
                    {item.id?.substring(0, 8) || "-"}
                </span>
            ),
        },
        {
            key: "templateName",
            title: "템플릿명",
            width: "200px",
            render: (item) => (
                <span style={{ fontWeight: 500 }}>{item.uiTemplate?.name || "-"}</span>
            ),
        },
        {
            key: "type",
            title: "타입",
            width: "80px",
            render: (item) => (
                <span style={{
                    display: "inline-block",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontWeight: 500,
                    backgroundColor: item.uiTemplate?.type === UITemplateType.URL || item.uiTemplate?.type === "URL" ? "#dbeafe" : "#fce7f3",
                    color: item.uiTemplate?.type === UITemplateType.URL || item.uiTemplate?.type === "URL" ? "#2563eb" : "#db2777",
                }}>
                    {getTypeLabel(item.uiTemplate?.type)}
                </span>
            ),
        },
        {
            key: "purchasedAt",
            title: "구매일",
            width: "120px",
            render: (item) => <span>{formatDateTime(item.purchasedAt)}</span>,
        },
        {
            key: "expiredAt",
            title: "만료일",
            width: "120px",
            render: (item) => <span>{formatDateTime(item.expiredAt)}</span>,
        },
        {
            key: "status",
            title: "상태",
            width: "120px",
            render: (item) => {
                const status = getStatusLabel(item);
                return (
                    <span style={{
                        display: "inline-block",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: 500,
                        backgroundColor: `${status.color}20`,
                        color: status.color,
                    }}>
                        {status.label}
                    </span>
                );
            },
        },
        {
            key: "creditsUsed",
            title: "사용 크레딧",
            width: "100px",
            render: (item) => (
                <span style={{ fontWeight: 500 }}>
                    {item.creditsUsed?.toLocaleString() || "0"}
                </span>
            ),
        },
    ];

    const handlePageChange = (page: number) => {
        if (selectedWorker) {
            fetchOwnedTemplates(selectedWorker.id, page - 1, pageSize);
        }
    };

    return (
        <div className="contents">
            <div className="page-title">
                <div>
                    <h2>보유 템플릿</h2>
                    <p>사용자를 선택하여 보유 템플릿을 조회합니다.</p>
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
                    <div className="cont-box" style={{ display: "flex", flexDirection: "column" }}>
                        <div className="cont-tit">
                            <div>
                                <h3>보유 템플릿 ({totalElements.toLocaleString()}건)</h3>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", justifyContent: "flex-end" }}>
                                <div className="page-size-select-wrap">
                                    <select
                                        className="page-size-select"
                                        value={pageSize}
                                        onChange={(e) => setPageSize(Number(e.target.value))}
                                    >
                                        {PAGE_SIZE_OPTIONS.map((option) => (
                                            <option key={option} value={option}>
                                                {option}개
                                            </option>
                                        ))}
                                    </select>
                                    <svg
                                        width="10"
                                        height="6"
                                        viewBox="0 0 10 6"
                                        fill="none"
                                        className="page-size-select-chevron"
                                    >
                                        <path d="M1 1L5 5L9 1" stroke="var(--gray005)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <button
                                    onClick={() => selectedWorker && fetchOwnedTemplates(selectedWorker.id, currentPage, pageSize)}
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

                        {error && <div style={{ color: "#f87171" }}>에러: {error}</div>}

                        {!loading && (
                            <>
                                <div style={{ flex: 1, minHeight: 0 }}>
                                    <TableView
                                        columns={columns}
                                        data={ownedTemplates}
                                        getRowKey={(item) => item.id}
                                        emptyMessage="보유 템플릿이 없습니다."
                                        isLoading={loading}
                                    />
                                </div>
                                {totalPages > 1 && (
                                    <Pagination
                                        currentPage={currentPage + 1}
                                        totalPages={totalPages}
                                        itemsPerPage={pageSize}
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
