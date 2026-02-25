"use client";

import React from "react";
import { Worker_Gender } from "@workfolio/shared/generated/common";

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
                <label style={{ display: "block", marginBottom: "6px", fontWeight: 500, fontSize: "13px", color: "#a0a0a0" }}>
                    닉네임 *
                </label>
                <input
                    type="text"
                    value={formData.nickName}
                    onChange={(e) => onChange("nickName", e.target.value)}
                    required
                    placeholder="닉네임을 입력하세요"
                />
            </div>

            <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: 500, fontSize: "13px", color: "#a0a0a0" }}>
                    이메일 *
                </label>
                <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => onChange("email", e.target.value)}
                    required
                    placeholder="이메일을 입력하세요"
                />
            </div>

            <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: 500, fontSize: "13px", color: "#a0a0a0" }}>
                    전화번호 *
                </label>
                <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => onChange("phone", e.target.value)}
                    required
                    placeholder="전화번호를 입력하세요"
                />
            </div>

            <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: 500, fontSize: "13px", color: "#a0a0a0" }}>
                    생년월일
                </label>
                <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => onChange("birthDate", e.target.value)}
                />
            </div>

            <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: 500, fontSize: "13px", color: "#a0a0a0" }}>
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

export default UserForm;
