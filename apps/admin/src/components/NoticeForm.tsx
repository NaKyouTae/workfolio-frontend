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
    hideButtons?: boolean;
}

const NoticeForm: React.FC<NoticeFormProps> = ({
    formData,
    onChange,
    onSubmit,
    onCancel,
    isSubmitting = false,
    hideButtons = false,
}) => {
    return (
        <form onSubmit={onSubmit}>
            <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: 500, fontSize: "13px", color: "#121212" }}>
                    제목 <span style={{ color: "#f87171" }}>*</span>
                </label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => onChange("title", e.target.value)}
                    required
                    placeholder="공지사항 제목을 입력하세요"
                />
            </div>

            <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: 500, fontSize: "13px", color: "#121212" }}>
                    내용 <span style={{ color: "#f87171" }}>*</span>
                </label>
                <textarea
                    value={formData.content}
                    onChange={(e) => onChange("content", e.target.value)}
                    required
                    rows={10}
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
                    <span style={{ fontWeight: 500, color: "#121212", fontSize: "13px" }}>상단 고정</span>
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

export default NoticeForm;
