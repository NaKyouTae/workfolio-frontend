"use client";

import { useEffect, useState } from "react";
import { useAdminUITemplates } from "@/hooks/useAdminUITemplates";
import {
    UITemplate,
    AdminUITemplateCreateRequest,
    AdminUITemplateUpdateRequest,
} from "@workfolio/shared/types/uitemplate";
import TableView, { TableColumn } from "@workfolio/shared/ui/TableView";
import UITemplateCreateModal from "./UITemplateCreateModal";
import UITemplateDetailModal from "./UITemplateDetailModal";
import LoadingScreen from "@workfolio/shared/ui/LoadingScreen";

export default function AdminUITemplates() {
    const {
        uiTemplates,
        loading,
        error,
        fetchUITemplates,
        getUITemplateById,
        createUITemplate,
        updateUITemplate,
        deleteUITemplate,
        uploadImages,
        deleteImage,
    } = useAdminUITemplates();

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<UITemplate | null>(null);

    useEffect(() => {
        fetchUITemplates();
    }, [fetchUITemplates]);

    const handleOpenDetail = async (template: UITemplate) => {
        const detail = await getUITemplateById(template.id);
        if (detail) {
            setSelectedTemplate(detail);
            setShowDetailModal(true);
        }
    };

    const handleCloseDetail = () => {
        setSelectedTemplate(null);
        setShowDetailModal(false);
    };

    const handleCreate = async (request: AdminUITemplateCreateRequest): Promise<boolean> => {
        return await createUITemplate(request);
    };

    const handleUpdate = async (id: string, request: AdminUITemplateUpdateRequest): Promise<boolean> => {
        return await updateUITemplate(id, request);
    };

    const handleDelete = async (id: string) => {
        if (confirm("정말 삭제하시겠습니까?")) {
            await deleteUITemplate(id);
        }
    };

    const formatDate = (timestamp: number | string) => {
        const numTimestamp = typeof timestamp === "string" ? parseInt(timestamp, 10) : timestamp;
        if (isNaN(numTimestamp) || numTimestamp === 0) return "-";
        const date = new Date(numTimestamp);
        if (isNaN(date.getTime())) return "-";
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
    };

    const getTypeLabel = (type: number | string) => {
        if (type === "URL" || type === 1) return "URL";
        if (type === "PDF" || type === 2) return "PDF";
        return "-";
    };

    const columns: TableColumn<UITemplate>[] = [
        {
            key: "name",
            title: "이름",
            render: (t) => (
                <div
                    style={{ fontWeight: 500, cursor: "pointer", color: "#ededed" }}
                    onClick={() => handleOpenDetail(t)}
                >
                    {t.name}
                </div>
            ),
        },
        {
            key: "type",
            title: "타입",
            width: "80px",
            render: (t) => (
                <span
                    style={{
                        display: "inline-block",
                        padding: "3px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: 600,
                        backgroundColor: getTypeLabel(t.type) === "URL" ? "rgba(59, 130, 246, 0.15)" : "rgba(168, 85, 247, 0.15)",
                        color: getTypeLabel(t.type) === "URL" ? "#3b82f6" : "#a855f7",
                    }}
                >
                    {getTypeLabel(t.type)}
                </span>
            ),
        },
        {
            key: "label",
            title: "라벨",
            width: "120px",
            render: (t) => (
                <span style={{ color: t.label ? "#ededed" : "#6b6b6b", fontSize: "13px", whiteSpace: "nowrap" }}>
                    {t.label || "-"}
                </span>
            ),
        },
        {
            key: "price",
            title: "가격",
            width: "110px",
            render: (t) => (
                <span style={{ fontSize: "13px", whiteSpace: "nowrap" }}>{t.price.toLocaleString()} 크레딧</span>
            ),
        },
        {
            key: "isActive",
            title: "상태",
            width: "80px",
            render: (t) => (
                <span
                    style={{
                        display: "inline-block",
                        padding: "3px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: 600,
                        backgroundColor: t.isActive ? "rgba(62, 207, 142, 0.15)" : "rgba(107, 107, 107, 0.15)",
                        color: t.isActive ? "#3ecf8e" : "#6b6b6b",
                    }}
                >
                    {t.isActive ? "활성" : "비활성"}
                </span>
            ),
        },
        {
            key: "isPopular",
            title: "인기",
            width: "60px",
            render: (t) => (
                <span
                    style={{
                        fontSize: "12px",
                        color: t.isPopular ? "#f59e0b" : "#6b6b6b",
                    }}
                >
                    {t.isPopular ? "인기" : "-"}
                </span>
            ),
        },
        {
            key: "displayOrder",
            title: "순서",
            width: "60px",
            render: (t) => <span style={{ fontSize: "13px" }}>{t.displayOrder}</span>,
        },
        {
            key: "createdAt",
            title: "생성일",
            width: "110px",
            render: (t) => <span style={{ fontSize: "13px", whiteSpace: "nowrap" }}>{formatDate(t.createdAt)}</span>,
        },
        {
            key: "actions",
            title: "작업",
            width: "160px",
            render: (t) => (
                <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "8px" }}>
                    <button
                        className="line gray"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDetail(t);
                        }}
                        style={{ minWidth: "60px", height: "30px", whiteSpace: "nowrap", padding: "0 12px" }}
                    >
                        편집
                    </button>
                    <button
                        className="line red"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(t.id);
                        }}
                        style={{ minWidth: "60px", height: "30px", whiteSpace: "nowrap", padding: "0 12px" }}
                    >
                        삭제
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="contents">
            <div className="page-title">
                <div>
                    <h2>UI 템플릿 관리</h2>
                    <p>UI 템플릿을 생성하고 관리합니다.</p>
                </div>
            </div>

            <div className="page-cont">
                <div className="cont-box">
                    <div className="cont-tit">
                        <h3>전체 UI 템플릿 ({uiTemplates.length}개)</h3>
                        <button onClick={() => setShowCreateModal(true)}>+ 새 템플릿 추가</button>
                    </div>

                    {loading && <LoadingScreen />}
                    {error && <div style={{ color: "#f87171" }}>에러: {error}</div>}

                    <TableView
                        columns={columns}
                        data={uiTemplates}
                        getRowKey={(t) => t.id}
                        emptyMessage="등록된 UI 템플릿이 없습니다."
                        isLoading={loading}
                    />
                </div>
            </div>

            <UITemplateCreateModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSubmit={handleCreate}
            />

            <UITemplateDetailModal
                isOpen={showDetailModal}
                template={selectedTemplate}
                onClose={handleCloseDetail}
                onSubmit={handleUpdate}
                onUploadImages={uploadImages}
                onDeleteImage={deleteImage}
                onRefresh={getUITemplateById}
            />
        </div>
    );
}
