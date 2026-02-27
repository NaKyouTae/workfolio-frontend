"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Resume } from "@workfolio/shared/generated/common";
import { useAdminCareers } from "@/hooks/useAdminCareers";
import { useSelectedWorker } from "@/contexts/SelectedWorkerContext";
import TableView, { TableColumn } from "@workfolio/shared/ui/TableView";
import Pagination from "@workfolio/shared/ui/Pagination";

import AdminUserSearch from "./AdminUserSearch";
import { formatPhone } from "@/utils/format";

const DEFAULT_PAGE_SIZE = 20;
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export default function AdminCareers() {
    const router = useRouter();
    const { careers, totalElements, totalPages, currentPage, loading, error, fetchCareers } = useAdminCareers();
    const { selectedWorker, selectWorker, clearWorker } = useSelectedWorker();
    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

    useEffect(() => {
        if (selectedWorker) {
            fetchCareers(selectedWorker.id, 0, pageSize);
        }
    }, [fetchCareers, pageSize, selectedWorker]);

    const handlePageChange = (page: number) => {
        if (selectedWorker) {
            fetchCareers(selectedWorker.id, page - 1, pageSize);
        }
    };

    const formatDateTime = (timestamp?: number | string) => {
        if (!timestamp || timestamp === 0) return "-";
        const numTimestamp = typeof timestamp === "string" ? parseInt(timestamp, 10) : timestamp;
        if (isNaN(numTimestamp) || numTimestamp === 0) return "-";
        const date = new Date(numTimestamp);
        if (isNaN(date.getTime())) return "-";
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(
            date.getDate()
        ).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
    };

    const columns: TableColumn<Resume>[] = [
        {
            key: "title",
            title: "이력서 제목",
            width: "220px",
            render: (r) => <span style={{ fontWeight: 500 }}>{r.title || "-"}</span>,
        },
        {
            key: "name",
            title: "이름",
            width: "120px",
            render: (r) => <span>{r.name || "-"}</span>,
        },
        {
            key: "position",
            title: "포지션",
            width: "140px",
            render: (r) => <span>{r.position || "-"}</span>,
        },
        {
            key: "phone",
            title: "연락처",
            width: "150px",
            render: (r) => <span style={{ color: "#121212" }}>{formatPhone(r.phone)}</span>,
        },
        {
            key: "email",
            title: "이메일",
            width: "220px",
            render: (r) => <span style={{ color: "#121212" }}>{r.email || "-"}</span>,
        },
        {
            key: "isDefault",
            title: "기본",
            width: "80px",
            render: (r) => <span style={{ color: "#121212" }}>{r.isDefault ? "Y" : "N"}</span>,
        },
        {
            key: "isPublic",
            title: "공개",
            width: "80px",
            render: (r) => <span style={{ color: "#121212" }}>{r.isPublic ? "Y" : "N"}</span>,
        },
        {
            key: "updatedAt",
            title: "수정일",
            width: "170px",
            render: (r) => <span style={{ color: "#121212" }}>{formatDateTime(r.updatedAt)}</span>,
        },
    ];

    return (
        <div className="contents">
            <div className="page-title">
                <div>
                    <h2>이력 내역</h2>
                    <p>사용자를 선택하여 이력(경력) 내역을 조회합니다.</p>
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
                                <h3>이력 내역 ({totalElements.toLocaleString()}건)</h3>
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
                                    onClick={() => selectedWorker && fetchCareers(selectedWorker.id, currentPage, pageSize)}
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
                                <TableView
                                    columns={columns}
                                    data={careers}
                                    onRowClick={(career) => router.push(`/dashboard/careers/${career.id}`)}
                                    getRowKey={(c) => c.id}
                                    emptyMessage="이력 내역이 없습니다."
                                    isLoading={loading}
                                />
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
