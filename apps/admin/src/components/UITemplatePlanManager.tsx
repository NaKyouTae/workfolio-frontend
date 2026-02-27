"use client";

import React, { useState, useEffect, useRef } from "react";
import { UiTemplatePlan } from "@workfolio/shared/types/uitemplate";

interface PlanFormData {
    durationDays: number;
    price: number;
    displayOrder: number;
}

interface PlanRow {
    id: string | null;
    durationDays: number;
    price: number;
    displayOrder: number;
}

interface UITemplatePlanManagerProps {
    plans: UiTemplatePlan[];
    onCreatePlan: (data: PlanFormData) => Promise<boolean>;
    onUpdatePlan: (planId: string, data: PlanFormData) => Promise<boolean>;
    onDeletePlan: (planId: string) => Promise<boolean>;
    onSaveComplete?: () => void;
}

const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px 10px",
    border: "1px solid #DDE0E3",
    borderRadius: "6px",
    fontSize: "13px",
    outline: "none",
    background: "#FFFFFF",
};

const headerStyle: React.CSSProperties = {
    fontSize: "12px",
    color: "#808991",
    fontWeight: 500,
};

const GripIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <circle cx="5.5" cy="3.5" r="1.2" />
        <circle cx="10.5" cy="3.5" r="1.2" />
        <circle cx="5.5" cy="8" r="1.2" />
        <circle cx="10.5" cy="8" r="1.2" />
        <circle cx="5.5" cy="12.5" r="1.2" />
        <circle cx="10.5" cy="12.5" r="1.2" />
    </svg>
);

const TrashIcon = ({ color = "#B0B8C1" }: { color?: string }) => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <line x1="10" y1="11" x2="10" y2="17" />
        <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
);

const UITemplatePlanManager: React.FC<UITemplatePlanManagerProps> = ({
    plans,
    onCreatePlan,
    onUpdatePlan,
    onDeletePlan,
    onSaveComplete,
}) => {
    const [rows, setRows] = useState<PlanRow[]>([]);
    const [deletedIds, setDeletedIds] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [dragIndex, setDragIndex] = useState<number | null>(null);
    const dragIndexRef = useRef<number | null>(null);
    const rowsRef = useRef<PlanRow[]>([]);
    const [hoverDeleteIndex, setHoverDeleteIndex] = useState<number | null>(null);

    useEffect(() => {
        const sorted = [...plans].sort((a, b) => a.displayOrder - b.displayOrder);
        const initialRows = sorted.map((p) => ({
            id: p.id,
            durationDays: p.durationDays,
            price: p.price,
            displayOrder: p.displayOrder,
        }));
        setRows(initialRows);
        rowsRef.current = initialRows;
        setDeletedIds([]);
    }, [plans]);

    const handleAdd = () => {
        setRows((prev) => {
            const updated = [
                { id: null, durationDays: 0, price: 0, displayOrder: 0 },
                ...prev.map((r, i) => ({ ...r, displayOrder: i + 1 })),
            ];
            rowsRef.current = updated;
            return updated;
        });
    };

    const handleChange = (index: number, field: "durationDays" | "price", rawValue: string) => {
        const value = rawValue === "" ? 0 : Number(rawValue);
        setRows((prev) => {
            const updated = prev.map((r, i) => (i === index ? { ...r, [field]: value } : r));
            rowsRef.current = updated;
            return updated;
        });
    };

    const handleRemove = (index: number) => {
        const row = rows[index];
        if (row.id) {
            setDeletedIds((prev) => [...prev, row.id!]);
        }
        setRows((prev) => {
            const updated = prev
                .filter((_, i) => i !== index)
                .map((r, i) => ({ ...r, displayOrder: i }));
            rowsRef.current = updated;
            return updated;
        });
    };

    // Drag & Drop
    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDragIndex(index);
        dragIndexRef.current = index;
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        if (dragIndexRef.current === null || index === dragIndexRef.current) return;

        // 드래그 중 실시간으로 순서 변경
        const fromIndex = dragIndexRef.current;
        setRows((prev) => {
            const newRows = [...prev];
            const [removed] = newRows.splice(fromIndex, 1);
            newRows.splice(index, 0, removed);
            const reordered = newRows.map((r, i) => ({ ...r, displayOrder: i }));
            rowsRef.current = reordered;
            return reordered;
        });
        setDragIndex(index);
        dragIndexRef.current = index;
    };

    const handleDragEnd = () => {
        setDragIndex(null);
        dragIndexRef.current = null;
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            for (const id of deletedIds) {
                await onDeletePlan(id);
            }
            for (const row of rows) {
                const data: PlanFormData = {
                    durationDays: row.durationDays,
                    price: row.price,
                    displayOrder: row.displayOrder,
                };
                if (row.id) {
                    await onUpdatePlan(row.id, data);
                } else {
                    await onCreatePlan(data);
                }
            }
            setDeletedIds([]);
            onSaveComplete?.();
        } catch (err) {
            console.error("Error saving plans:", err);
        } finally {
            setIsSaving(false);
        }
    };

    const hasChanges = deletedIds.length > 0 || rows.some((r) => {
        if (!r.id) return true;
        const original = plans.find((p) => p.id === r.id);
        if (!original) return true;
        return (
            original.durationDays !== r.durationDays ||
            original.price !== r.price ||
            original.displayOrder !== r.displayOrder
        );
    });

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}>
            {/* 라벨 + 추가 링크 */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <label style={{ fontWeight: 500, fontSize: "13px", color: "#121212" }}>
                    이용 기간 플랜 ({rows.length})
                </label>
                <span
                    onClick={handleAdd}
                    style={{
                        fontSize: "13px",
                        color: "#808991",
                        cursor: "pointer",
                        userSelect: "none",
                    }}
                >
                    + 추가
                </span>
            </div>

            <div style={{ flex: 1, minHeight: 0, overflowY: "auto", overflowX: "hidden", paddingRight: "4px" }}>
                {rows.length === 0 ? (
                    <div
                        style={{
                            padding: "24px",
                            textAlign: "center",
                            color: "#808991",
                            fontSize: "13px",
                            background: "#F7F8F9",
                            borderRadius: "8px",
                            border: "1px solid #EEF0F1",
                        }}
                    >
                        등록된 이용 기간 플랜이 없습니다.
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {/* 컬럼 헤더 */}
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "24px 1fr 1fr 28px",
                                gap: "8px",
                                alignItems: "center",
                            }}
                        >
                            <span />
                            <span style={headerStyle}>이용일수</span>
                            <span style={headerStyle}>가격 (크레딧)</span>
                            <span />
                        </div>

                        {rows.map((row, index) => (
                            <div
                                key={row.id || `new-${index}`}
                                onDragOver={(e) => handleDragOver(e, index)}
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "24px 1fr 1fr 28px",
                                    gap: "8px",
                                    alignItems: "center",
                                    padding: "2px 0",
                                    borderRadius: "6px",
                                    transition: "all 0.15s ease",
                                    background: dragIndex === index ? "#F0F4FF" : "transparent",
                                    boxShadow: dragIndex === index ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                                }}
                            >
                                {/* 드래그 핸들 */}
                                <div
                                    draggable={!!row.id}
                                    onDragStart={(e) => handleDragStart(e, index)}
                                    onDragEnd={handleDragEnd}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        cursor: row.id ? "grab" : "default",
                                        color: row.id ? "#B0B8C1" : "#DDE0E3",
                                    }}
                                >
                                    <GripIcon />
                                </div>

                                <input
                                    type="number"
                                    min={0}
                                    value={row.durationDays}
                                    onChange={(e) => handleChange(index, "durationDays", e.target.value)}
                                    style={inputStyle}
                                    placeholder="0"
                                />
                                <input
                                    type="number"
                                    min={0}
                                    value={row.price}
                                    onChange={(e) => handleChange(index, "price", e.target.value)}
                                    style={inputStyle}
                                    placeholder="0"
                                />

                                {/* 삭제 버튼 */}
                                <button
                                    type="button"
                                    onClick={() => handleRemove(index)}
                                    style={{
                                        width: "28px",
                                        height: "28px",
                                        padding: 0,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        border: "none",
                                        borderRadius: "6px",
                                        background: "transparent",
                                        cursor: "pointer",
                                        flexShrink: 0,
                                    }}
                                    onMouseEnter={() => setHoverDeleteIndex(index)}
                                    onMouseLeave={() => setHoverDeleteIndex(null)}
                                >
                                    <TrashIcon color={hoverDeleteIndex === index ? "#f87171" : "#B0B8C1"} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 저장 버튼 - 하단 고정 */}
            <div style={{
                marginTop: "12px",
                paddingTop: "12px",
                paddingBottom: "4px",
                background: "#FFFFFF",
                borderTop: "1px solid #EEF0F1",
                flexShrink: 0,
            }}>
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving || !hasChanges}
                    className="dark-gray"
                    style={{
                        width: "100%",
                        padding: "10px 20px",
                        opacity: isSaving || !hasChanges ? 0.5 : 1,
                        cursor: isSaving || !hasChanges ? "not-allowed" : "pointer",
                    }}
                >
                    {isSaving ? "저장 중..." : "저장"}
                </button>
            </div>
        </div>
    );
};

export default UITemplatePlanManager;
