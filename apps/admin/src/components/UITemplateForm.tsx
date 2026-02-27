"use client";

import React from "react";

export interface UITemplateFormData {
    name: string;
    description: string;
    type: string;
    label: string;
    urlPath: string;
    isActive: boolean;
    displayOrder: number;
}

interface UITemplateFormProps {
    formData: UITemplateFormData;
    onChange: (field: string, value: string | number | boolean) => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
    hideButtons?: boolean;
}

const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: "6px",
    fontWeight: 500,
    fontSize: "13px",
    color: "#121212",
};

const fieldStyle: React.CSSProperties = { marginBottom: "16px" };

const UITemplateForm: React.FC<UITemplateFormProps> = ({
    formData,
    onChange,
    onSubmit,
    onCancel,
    isSubmitting = false,
    hideButtons = false,
}) => {
    return (
        <form onSubmit={onSubmit}>
            <div style={fieldStyle}>
                <label style={labelStyle}>이름 <span style={{ color: "#f87171" }}>*</span></label>
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

            <div style={fieldStyle}>
                <label style={labelStyle}>타입 <span style={{ color: "#f87171" }}>*</span></label>
                <select
                    value={formData.type}
                    onChange={(e) => onChange("type", e.target.value)}
                    style={{ width: "100%" }}
                    required
                >
                    <option value="URL">URL</option>
                    <option value="PDF">PDF</option>
                </select>
            </div>

            <div style={fieldStyle}>
                <label style={labelStyle}>라벨</label>
                <input
                    type="text"
                    value={formData.label}
                    onChange={(e) => onChange("label", e.target.value)}
                    placeholder="예: NEW, HOT"
                />
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

            <div style={fieldStyle}>
                <label style={labelStyle}>정렬 순서</label>
                <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => onChange("displayOrder", parseInt(e.target.value, 10) || 0)}
                    placeholder="숫자가 작을수록 앞에 표시됩니다"
                    style={{ width: "120px" }}
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
                    <span style={{ fontWeight: 500, color: "#121212", fontSize: "13px" }}>활성화</span>
                </label>
            </div>

            {!hideButtons && (
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
            )}
        </form>
    );
};

export default UITemplateForm;
