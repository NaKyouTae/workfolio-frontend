"use client";

import { useEffect, useState } from "react";
import { useAdminNotices } from "@/hooks/useAdminNotices";
import { Notice } from "@workfolio/shared/generated/common";
import TableView, { TableColumn } from "@workfolio/shared/ui/TableView";
import NoticeCreateModal from "./NoticeCreateModal";
import NoticeUpdateModal from "./NoticeUpdateModal";
import { NoticeCreateRequest, NoticeUpdateRequest } from "@workfolio/shared/generated/notice";


export default function AdminNotices() {
    const { notices, loading, error, fetchNotices, createNotice, updateNotice, deleteNotice } =
        useAdminNotices();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [editingNotice, setEditingNotice] = useState<Notice | null>(null);

    useEffect(() => {
        fetchNotices();
    }, [fetchNotices]);

    const handleOpenCreateModal = () => {
        setShowCreateModal(true);
    };

    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
    };

    const handleOpenUpdateModal = (notice: Notice) => {
        setEditingNotice(notice);
        setShowUpdateModal(true);
    };

    const handleCloseUpdateModal = () => {
        setEditingNotice(null);
        setShowUpdateModal(false);
    };

    const handleCreate = async (request: NoticeCreateRequest) => {
        return await createNotice(request);
    };

    const handleUpdate = async (request: NoticeUpdateRequest) => {
        return await updateNotice(request);
    };

    const handleDelete = async (id: string) => {
        if (confirm("정말 삭제하시겠습니까?")) {
            await deleteNotice(id);
        }
    };

    const formatDate = (timestamp: number | string) => {
        const numTimestamp = typeof timestamp === "string" ? parseInt(timestamp, 10) : timestamp;
        if (isNaN(numTimestamp) || numTimestamp === 0) {
            return "-";
        }
        const date = new Date(numTimestamp);
        if (isNaN(date.getTime())) {
            return "-";
        }
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(
            date.getDate()
        ).padStart(2, "0")}`;
    };

    const columns: TableColumn<Notice>[] = [
        {
            key: "isPinned",
            title: "고정",
            width: "60px",
            render: (notice) => (
                <span className={`table-badge ${notice.isPinned ? "active" : "inactive"}`}>
                    {notice.isPinned ? "고정" : "-"}
                </span>
            ),
        },
        {
            key: "title",
            title: "제목",
            render: (notice) => (
                <span style={{ fontWeight: 500, color: "#121212" }}>{notice.title}</span>
            ),
        },
        {
            key: "createdAt",
            title: "작성일",
            width: "100px",
            render: (notice) => (
                <span style={{ color: "#121212", fontSize: "12px" }}>{formatDate(notice.createdAt)}</span>
            ),
        },
        {
            key: "updatedAt",
            title: "수정일",
            width: "100px",
            render: (notice) => (
                <span style={{ color: "#121212", fontSize: "12px" }}>{formatDate(notice.updatedAt)}</span>
            ),
        },
        {
            key: "actions",
            title: "",
            width: "120px",
            render: (notice) => (
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "6px" }}>
                    <button
                        className="table-action-btn edit"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleOpenUpdateModal(notice);
                        }}
                    >
                        편집
                    </button>
                    <button
                        className="table-action-btn delete"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(notice.id);
                        }}
                    >
                        삭제
                    </button>
                </div>
            ),
        },
    ];

    const renderExpandedRow = (notice: Notice) => {
        return (
            <div>
                <div className="expanded-detail-grid">
                    <div className="detail-item">
                        <span className="detail-label">작성일</span>
                        <span className="detail-value">{formatDate(notice.createdAt)}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">수정일</span>
                        <span className="detail-value">{formatDate(notice.updatedAt)}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">고정 여부</span>
                        <span className="detail-value">{notice.isPinned ? "고정" : "미고정"}</span>
                    </div>
                </div>
                {notice.content && (
                    <div className="expanded-content-block">
                        {notice.content}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="contents">
            <div className="page-title">
                <div>
                    <h2>공지사항 관리</h2>
                    <p>공지사항을 생성하고 관리합니다.</p>
                </div>
                <button
                    onClick={() => fetchNotices()}
                    disabled={loading}
                    title="새로고침"
                    style={{ width: "36px", height: "36px", padding: 0, border: "1px solid var(--gray003)", borderRadius: "8px", backgroundColor: "transparent", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ animation: loading ? "spin 1s linear infinite" : "none" }}>
                        <path d="M13.65 2.35A7.96 7.96 0 0 0 8 0C3.58 0 0 3.58 0 8s3.58 8 8 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 8 14 6 6 0 1 1 8 2c1.66 0 3.14.69 4.22 1.78L9 7h7V0l-2.35 2.35z" fill="var(--gray005)" />
                    </svg>
                </button>
            </div>

            <div className="page-cont">
                <div className="cont-box">
                    <div className="cont-tit">
                        <h3>전체 공지사항 ({notices.length}개)</h3>
                        <button onClick={handleOpenCreateModal}>+ 새 공지사항 추가</button>
                    </div>

                    {error && <div style={{ color: "#f87171" }}>에러: {error}</div>}

                    <TableView
                        columns={columns}
                        data={notices}
                        expandedRowRender={renderExpandedRow}
                        getRowKey={(notice) => notice.id}
                        emptyMessage="등록된 공지사항이 없습니다."
                        isLoading={loading}
                    />
                </div>
            </div>

            <NoticeCreateModal
                isOpen={showCreateModal}
                onClose={handleCloseCreateModal}
                onSubmit={handleCreate}
            />

            <NoticeUpdateModal
                isOpen={showUpdateModal}
                notice={editingNotice}
                onClose={handleCloseUpdateModal}
                onSubmit={handleUpdate}
            />
        </div>
    );
}
