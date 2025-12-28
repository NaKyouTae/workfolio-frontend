"use client";

import React from "react";

interface NoticeFormProps {
    formData: {
        title: string;
        content: string;
        isPinned: boolean;
    };
    onChange: (field: string, value: string | boolean) => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}

const NoticeForm: React.FC<NoticeFormProps> = ({
    formData,
    onChange,
    onSubmit,
    onCancel,
    isSubmitting = false,
}) => {
    return (
        <form onSubmit={onSubmit}>
            <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
                    제목 *
                </label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => onChange("title", e.target.value)}
                    required
                    style={{
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        fontSize: "14px",
                    }}
                    placeholder="공지사항 제목을 입력하세요"
                />
            </div>

            <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
                    내용 *
                </label>
                <textarea
                    value={formData.content}
                    onChange={(e) => onChange("content", e.target.value)}
                    required
                    rows={10}
                    style={{
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        fontSize: "14px",
                        resize: "vertical",
                        fontFamily: "inherit",
                    }}
                    placeholder="공지사항 내용을 입력하세요"
                />
            </div>

            <div style={{ marginBottom: "24px" }}>
                <label
                    style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
                >
                    <input
                        type="checkbox"
                        checked={formData.isPinned}
                        onChange={(e) => onChange("isPinned", e.target.checked)}
                        style={{ width: "18px", height: "18px", cursor: "pointer" }}
                    />
                    <span style={{ fontWeight: "600" }}>상단 고정</span>
                </label>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    style={{
                        padding: "10px 24px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        background: "#fff",
                        color: "#000",
                        cursor: isSubmitting ? "not-allowed" : "pointer",
                        fontSize: "14px",
                        fontWeight: "600",
                    }}
                >
                    취소
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                        padding: "10px 24px",
                        border: "none",
                        borderRadius: "6px",
                        background: "#2563eb",
                        color: "#fff",
                        cursor: isSubmitting ? "not-allowed" : "pointer",
                        fontSize: "14px",
                        fontWeight: "600",
                        opacity: isSubmitting ? 0.6 : 1,
                    }}
                >
                    {isSubmitting ? "처리 중..." : "저장"}
                </button>
            </div>
        </form>
    );
};

export default NoticeForm;
