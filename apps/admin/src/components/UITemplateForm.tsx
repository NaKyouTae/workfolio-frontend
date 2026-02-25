"use client";

import React from "react";

export interface UITemplateFormData {
    name: string;
    description: string;
    type: string;
    label: string;
    price: number;
    durationDays: number;
    urlPath: string;
    isActive: boolean;
    isPopular: boolean;
    displayOrder: number;
}

interface UITemplateFormProps {
    formData: UITemplateFormData;
    onChange: (field: string, value: string | number | boolean) => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}

const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: "6px",
    fontWeight: 500,
    fontSize: "13px",
    color: "#a0a0a0",
};

const fieldStyle: React.CSSProperties = { marginBottom: "16px" };

const rowStyle: React.CSSProperties = {
    display: "flex",
    gap: "16px",
    marginBottom: "16px",
};

const UITemplateForm: React.FC<UITemplateFormProps> = ({
    formData,
    onChange,
    onSubmit,
    onCancel,
    isSubmitting = false,
}) => {
    return (
        <form onSubmit={onSubmit}>
            <div style={fieldStyle}>
                <label style={labelStyle}>이름 *</label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => onChange("name", e.target.value)}
                    required
                    placeholder="템플릿 이름을 입력하세요"
                />
            </div>

            <div style={fieldStyle}>
                <label style={labelStyle}>설명</label>
                <textarea
                    value={formData.description}
                    onChange={(e) => onChange("description", e.target.value)}
                    rows={4}
                    placeholder="템플릿 설명을 입력하세요"
                />
            </div>

            <div style={rowStyle}>
                <div style={{ flex: 1 }}>
                    <label style={labelStyle}>타입 *</label>
                    <select
                        value={formData.type}
                        onChange={(e) => onChange("type", e.target.value)}
                        required
                    >
                        <option value="URL">URL</option>
                        <option value="PDF">PDF</option>
                    </select>
                </div>
                <div style={{ flex: 1 }}>
                    <label style={labelStyle}>라벨</label>
                    <input
                        type="text"
                        value={formData.label}
                        onChange={(e) => onChange("label", e.target.value)}
                        placeholder="예: NEW, HOT"
                    />
                </div>
            </div>

            <div style={rowStyle}>
                <div style={{ flex: 1 }}>
                    <label style={labelStyle}>가격 (크레딧) *</label>
                    <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => onChange("price", parseInt(e.target.value) || 0)}
                        required
                        min={0}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <label style={labelStyle}>이용 기간 (일) *</label>
                    <input
                        type="number"
                        value={formData.durationDays}
                        onChange={(e) => onChange("durationDays", parseInt(e.target.value) || 0)}
                        required
                        min={1}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <label style={labelStyle}>정렬 순서</label>
                    <input
                        type="number"
                        value={formData.displayOrder}
                        onChange={(e) => onChange("displayOrder", parseInt(e.target.value) || 0)}
                        min={0}
                    />
                </div>
            </div>

            <div style={fieldStyle}>
                <label style={labelStyle}>URL 경로</label>
                <input
                    type="text"
                    value={formData.urlPath}
                    onChange={(e) => onChange("urlPath", e.target.value)}
                    placeholder="예: /templates/modern"
                />
            </div>

            <div style={{ display: "flex", gap: "24px", marginBottom: "24px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                    <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => onChange("isActive", e.target.checked)}
                        style={{ width: "18px", height: "18px", cursor: "pointer" }}
                    />
                    <span style={{ fontWeight: 500, color: "#ededed", fontSize: "13px" }}>활성화</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                    <input
                        type="checkbox"
                        checked={formData.isPopular}
                        onChange={(e) => onChange("isPopular", e.target.checked)}
                        style={{ width: "18px", height: "18px", cursor: "pointer" }}
                    />
                    <span style={{ fontWeight: 500, color: "#ededed", fontSize: "13px" }}>인기 템플릿</span>
                </label>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="line gray"
                    style={{
                        padding: "8px 16px",
                        cursor: isSubmitting ? "not-allowed" : "pointer",
                        opacity: isSubmitting ? 0.5 : 1,
                    }}
                >
                    취소
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="dark-gray"
                    style={{
                        padding: "8px 16px",
                        cursor: isSubmitting ? "not-allowed" : "pointer",
                        opacity: isSubmitting ? 0.5 : 1,
                    }}
                >
                    {isSubmitting ? "처리 중..." : "저장"}
                </button>
            </div>
        </form>
    );
};

export default UITemplateForm;
