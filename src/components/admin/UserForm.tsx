"use client";

import React from "react";
import { Worker_Gender } from "@/generated/common";

interface UserFormProps {
    formData: {
        nickName: string;
        phone: string;
        email: string;
        birthDate: string;
        gender: Worker_Gender | undefined;
    };
    onChange: (field: string, value: string | Worker_Gender | undefined) => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({
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
                    닉네임 *
                </label>
                <input
                    type="text"
                    value={formData.nickName}
                    onChange={(e) => onChange("nickName", e.target.value)}
                    required
                    style={{
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        fontSize: "14px",
                    }}
                    placeholder="닉네임을 입력하세요"
                />
            </div>

            <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
                    이메일 *
                </label>
                <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => onChange("email", e.target.value)}
                    required
                    style={{
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        fontSize: "14px",
                    }}
                    placeholder="이메일을 입력하세요"
                />
            </div>

            <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
                    전화번호 *
                </label>
                <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => onChange("phone", e.target.value)}
                    required
                    style={{
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        fontSize: "14px",
                    }}
                    placeholder="전화번호를 입력하세요"
                />
            </div>

            <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
                    생년월일
                </label>
                <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => onChange("birthDate", e.target.value)}
                    style={{
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        fontSize: "14px",
                    }}
                />
            </div>

            <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
                    성별
                </label>
                <select
                    value={formData.gender ?? ""}
                    onChange={(e) =>
                        onChange(
                            "gender",
                            e.target.value ? (parseInt(e.target.value) as Worker_Gender) : undefined
                        )
                    }
                    style={{
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        fontSize: "14px",
                    }}
                >
                    <option value="">선택 안함</option>
                    <option value={Worker_Gender.MALE}>남성</option>
                    <option value={Worker_Gender.FEMALE}>여성</option>
                </select>
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

export default UserForm;
