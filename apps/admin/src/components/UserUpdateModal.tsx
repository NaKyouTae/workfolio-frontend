"use client";

import React, { useState, useEffect } from "react";
import { WorkerUpdateRequest } from "@workfolio/shared/generated/worker";
import { Worker, Worker_Gender } from "@workfolio/shared/generated/common";
import UserForm from "./UserForm";
import DateUtil from "@workfolio/shared/utils/DateUtil";
import AdminModal from "./AdminModal";

interface UserUpdateModalProps {
    isOpen: boolean;
    worker: Worker | null;
    onClose: () => void;
    onSubmit: (request: WorkerUpdateRequest) => Promise<boolean>;
}

const UserUpdateModal: React.FC<UserUpdateModalProps> = ({ isOpen, worker, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        nickName: "",
        phone: "",
        email: "",
        birthDate: "",
        gender: undefined as Worker_Gender | undefined,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (worker) {
            setFormData({
                nickName: worker.nickName || "",
                phone: worker.phone || "",
                email: worker.email || "",
                birthDate: worker.birthDate
                    ? DateUtil.formatTimestamp(worker.birthDate, "YYYY-MM-DD")
                    : "",
                gender: worker.gender,
            });
        }
    }, [worker]);

    const handleChange = (field: string, value: string | Worker_Gender | undefined) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!worker) return;

        setIsSubmitting(true);

        const request: WorkerUpdateRequest = {
            id: worker.id,
            status: worker.status,
            nickName: formData.nickName,
            phone: formData.phone || undefined,
            email: formData.email || undefined,
            birthDate: formData.birthDate
                ? DateUtil.parseDateString(formData.birthDate)
                : undefined,
            gender: formData.gender,
        };

        const success = await onSubmit(request);
        if (success) {
            onClose();
        }
        setIsSubmitting(false);
    };

    if (!worker) return null;

    return (
        <AdminModal
            isOpen={isOpen}
            onClose={onClose}
            title="사용자 수정"
            maxWidth="550px"
            maxHeight="90vh"
            footer={
                <>
                    <button
                        type="button"
                        onClick={onClose}
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
                        type="button"
                        onClick={handleSubmit}
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
                </>
            }
        >
            <UserForm
                formData={formData}
                onChange={handleChange}
                onSubmit={handleSubmit}
                onCancel={onClose}
                isSubmitting={isSubmitting}
                hideButtons
            />
        </AdminModal>
    );
};

export default UserUpdateModal;
