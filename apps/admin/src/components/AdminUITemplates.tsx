"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useAdminUITemplates } from "@/hooks/useAdminUITemplates";
import {
    UITemplate,
    UiTemplatePlan,
    AdminUITemplateCreateRequest,
    AdminUITemplateUpdateRequest,
} from "@workfolio/shared/types/uitemplate";
import "@workfolio/shared/styles/table-view.css";
import UITemplateCreateModal from "./UITemplateCreateModal";
import UITemplateDetailModal from "./UITemplateDetailModal";
import UITemplateExpandedRow from "./UITemplateExpandedRow";
import UITemplatePlanManager from "./UITemplatePlanManager";
import AdminModal from "./AdminModal";


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
        createPlan,
        updatePlan,
        deletePlan,
    } = useAdminUITemplates();

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<UITemplate | null>(null);
    const [expandedDetails, setExpandedDetails] = useState<Record<string, UITemplate>>({});
    const [planManagerTemplate, setPlanManagerTemplate] = useState<UITemplate | null>(null);
    const [planManagerPlans, setPlanManagerPlans] = useState<UiTemplatePlan[]>([]);

    const [expandedRowKeys, setExpandedRowKeys] = useState<Set<string>>(new Set());

    useEffect(() => {
        fetchUITemplates();
    }, [fetchUITemplates]);

    // Row expand toggle
    const handleRowClick = useCallback(async (template: UITemplate) => {
        const key = template.id;
        setExpandedRowKeys((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(key)) {
                newSet.delete(key);
            } else {
                newSet.add(key);
            }
            return newSet;
        });

        if (!expandedDetails[template.id]) {
            const detail = await getUITemplateById(template.id);
            if (detail) {
                setExpandedDetails((prev) => ({ ...prev, [template.id]: detail }));
            }
        }
    }, [expandedDetails, getUITemplateById]);

    // 템플릿 편집 모달
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

    const handleCreate = async (request: AdminUITemplateCreateRequest, pendingFiles?: File[]): Promise<boolean> => {
        const createdId = await createUITemplate(request);
        if (!createdId) return false;
        if (pendingFiles && pendingFiles.length > 0) {
            await uploadImages(createdId, pendingFiles, "DETAIL");
            await fetchUITemplates();
        }
        return true;
    };

    const handleUpdate = async (id: string, request: AdminUITemplateUpdateRequest): Promise<boolean> => {
        return await updateUITemplate(id, request);
    };

    const handleOpenPlanManager = async (template: UITemplate) => {
        const detail = await getUITemplateById(template.id);
        if (detail) {
            setPlanManagerTemplate(detail);
            setPlanManagerPlans(detail.plans || []);
        }
    };

    const handleClosePlanManager = () => {
        setPlanManagerTemplate(null);
        setPlanManagerPlans([]);
    };

    const handlePlanManagerCreate = async (data: { durationDays: number; price: number; displayOrder: number }): Promise<boolean> => {
        if (!planManagerTemplate) return false;
        const plan = await createPlan(planManagerTemplate.id, data);
        return plan !== null;
    };

    const handlePlanManagerUpdate = async (planId: string, data: { durationDays: number; price: number; displayOrder: number }): Promise<boolean> => {
        return await updatePlan(planId, { id: planId, ...data });
    };

    const handlePlanManagerDelete = async (planId: string): Promise<boolean> => {
        return await deletePlan(planId);
    };

    const handlePlanManagerSaveComplete = async () => {
        if (!planManagerTemplate) return;
        const refreshed = await getUITemplateById(planManagerTemplate.id);
        if (refreshed) {
            setPlanManagerPlans(refreshed.plans || []);
            setExpandedDetails((prev) => ({ ...prev, [planManagerTemplate.id]: refreshed }));
        }
        await fetchUITemplates();
        handleClosePlanManager();
    };

    const handleDelete = async (id: string) => {
        if (confirm("정말 삭제하시겠습니까?")) {
            await deleteUITemplate(id);
            setExpandedDetails((prev) => {
                const next = { ...prev };
                delete next[id];
                return next;
            });
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

    return (
        <div className="contents">
            <div className="page-title">
                <div>
                    <h2>UI 템플릿 관리</h2>
                    <p>UI 템플릿을 생성하고 관리합니다.</p>
                </div>
                <button
                    onClick={() => fetchUITemplates()}
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
                        <h3>전체 UI 템플릿 ({uiTemplates.length}개)</h3>
                        <button onClick={() => setShowCreateModal(true)}>+ 새 템플릿 추가</button>
                    </div>

                    {error && <div style={{ color: "#f87171" }}>에러: {error}</div>}

                    <div className="table-view-container">
                        {loading && uiTemplates.length > 0 && (
                            <div className="table-view-refresh-overlay">
                                <svg className="table-view-refresh-spinner" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="40 60" />
                                </svg>
                            </div>
                        )}
                        {uiTemplates.length === 0 && !loading ? (
                            <div className="table-view-empty">등록된 UI 템플릿이 없습니다.</div>
                        ) : uiTemplates.length > 0 ? (
                            <table className="table-view">
                                <thead>
                                    <tr>
                                        <th style={{ width: "40px" }}></th>
                                        <th style={{ width: "50px" }}></th>
                                        <th style={{ width: "60px" }}>정렬</th>
                                        <th>이름</th>
                                        <th style={{ width: "80px" }}>타입</th>
                                        <th style={{ width: "120px" }}>라벨</th>
                                        <th style={{ width: "80px" }}>상태</th>
                                        <th style={{ width: "110px" }}>생성일</th>
                                        <th style={{ width: "240px" }}>작업</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {uiTemplates.map((t) => {
                                        const expanded = expandedRowKeys.has(t.id);
                                        return (
                                            <React.Fragment key={t.id}>
                                                <tr
                                                    onClick={() => handleRowClick(t)}
                                                    className="clickable"
                                                >
                                                    <td className="expand-icon-cell">
                                                        <span className={`expand-icon ${expanded ? "expanded" : ""}`}>
                                                            ▶
                                                        </span>
                                                    </td>
                                                    <td
                                                        className="thumbnail-cell"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        {(() => {
                                                            const sortedImages = [...(t.images || [])].sort((a, b) => a.displayOrder - b.displayOrder);
                                                            const imgUrl = sortedImages[0]?.imageUrl || t.thumbnailUrl || t.previewImageUrl;
                                                            return imgUrl ? (
                                                                <img
                                                                    src={imgUrl}
                                                                    alt=""
                                                                    style={{
                                                                        width: "40px",
                                                                        height: "40px",
                                                                        objectFit: "cover",
                                                                        borderRadius: "4px",
                                                                        border: "1px solid #E5E8EB",
                                                                    }}
                                                                />
                                                            ) : (
                                                                <div
                                                                    style={{
                                                                        width: "40px",
                                                                        height: "40px",
                                                                        borderRadius: "4px",
                                                                        backgroundColor: "#F2F4F6",
                                                                        border: "1px solid #E5E8EB",
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        justifyContent: "center",
                                                                        color: "#B0B8C1",
                                                                        fontSize: "10px",
                                                                    }}
                                                                >
                                                                    No img
                                                                </div>
                                                            );
                                                        })()}
                                                    </td>
                                                    <td>
                                                        <span style={{ fontSize: "13px", fontWeight: 600, color: "#121212" }}>
                                                            {t.displayOrder}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div style={{ fontWeight: 500, color: "#121212" }}>
                                                            {t.name}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span
                                                            style={{
                                                                display: "inline-block",
                                                                padding: "3px 8px",
                                                                borderRadius: "4px",
                                                                fontSize: "12px",
                                                                fontWeight: 600,
                                                                backgroundColor:
                                                                    getTypeLabel(t.type) === "URL"
                                                                        ? "rgba(59, 130, 246, 0.15)"
                                                                        : "rgba(168, 85, 247, 0.15)",
                                                                color:
                                                                    getTypeLabel(t.type) === "URL"
                                                                        ? "#3b82f6"
                                                                        : "#a855f7",
                                                            }}
                                                        >
                                                            {getTypeLabel(t.type)}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span style={{ color: "#121212", fontSize: "13px", whiteSpace: "nowrap" }}>
                                                            {t.label || "-"}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span
                                                            style={{
                                                                display: "inline-block",
                                                                padding: "3px 8px",
                                                                borderRadius: "4px",
                                                                fontSize: "12px",
                                                                fontWeight: 600,
                                                                backgroundColor: t.isActive
                                                                    ? "rgba(52, 199, 89, 0.12)"
                                                                    : "rgba(128, 137, 145, 0.12)",
                                                                color: t.isActive ? "#34C759" : "#121212",
                                                            }}
                                                        >
                                                            {t.isActive ? "활성" : "비활성"}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span style={{ fontSize: "13px", whiteSpace: "nowrap" }}>
                                                            {formatDate(t.createdAt)}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "8px" }}>
                                                            <button
                                                                className="line gray"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleOpenPlanManager(t);
                                                                }}
                                                                style={{ minWidth: "60px", height: "30px", whiteSpace: "nowrap", padding: "0 12px" }}
                                                            >
                                                                플랜 변경
                                                            </button>
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
                                                    </td>
                                                </tr>
                                                {expanded && (
                                                    <tr className="expanded-row">
                                                        <td colSpan={9}>
                                                            <div className="expanded-content">
                                                                {expandedDetails[t.id] ? (
                                                                    <UITemplateExpandedRow template={expandedDetails[t.id]} />
                                                                ) : (
                                                                    <div style={{ padding: "20px", textAlign: "center", color: "#121212", fontSize: "13px" }}>
                                                                        로딩 중...
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                </tbody>
                            </table>
                        ) : null}
                    </div>
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

            <AdminModal
                isOpen={!!planManagerTemplate}
                onClose={handleClosePlanManager}
                title={planManagerTemplate ? `플랜 변경 - ${planManagerTemplate.name}` : ""}
                maxWidth="760px"
                maxHeight="78vh"
            >
                <div style={{ height: "min(62vh, 640px)", minHeight: "360px", overflow: "hidden" }}>
                    <UITemplatePlanManager
                        plans={planManagerPlans}
                        onCreatePlan={handlePlanManagerCreate}
                        onUpdatePlan={handlePlanManagerUpdate}
                        onDeletePlan={handlePlanManagerDelete}
                        onSaveComplete={handlePlanManagerSaveComplete}
                    />
                </div>
            </AdminModal>
        </div>
    );
}
