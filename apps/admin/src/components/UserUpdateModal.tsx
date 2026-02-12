"use client";

import React, { useState, useEffect } from "react";
import { WorkerUpdateRequest } from "@workfolio/shared/generated/worker";
import { Worker, Worker_Gender } from "@workfolio/shared/generated/common";
import UserForm from "./UserForm";
import DateUtil from "@workfolio/shared/utils/DateUtil";

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
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
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

    const handleCancel = () => {
        onClose();
    };

    if (!isOpen || !worker) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
            }}
        >
            <div
                style={{
                    background: "white",
                    borderRadius: "12px",
                    padding: "32px",
                    width: "90%",
                    maxWidth: "600px",
                    maxHeight: "90vh",
                    overflowY: "auto",
                }}
            >
                <h2 style={{ marginBottom: "24px", fontSize: "24px", fontWeight: "700" }}>
                    사용자 수정
                </h2>

                <UserForm
                    formData={formData}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    isSubmitting={isSubmitting}
                />
            </div>
        </div>
    );
};

export default UserUpdateModal;
