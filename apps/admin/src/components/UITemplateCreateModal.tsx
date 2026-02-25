"use client";

import React, { useState } from "react";
import { AdminUITemplateCreateRequest } from "@workfolio/shared/types/uitemplate";
import UITemplateForm, { UITemplateFormData } from "./UITemplateForm";

interface UITemplateCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (request: AdminUITemplateCreateRequest) => Promise<boolean>;
}

const initialFormData: UITemplateFormData = {
    name: "",
    description: "",
    type: "URL",
    label: "",
    price: 0,
    durationDays: 30,
    urlPath: "",
    isActive: true,
    isPopular: false,
    displayOrder: 0,
};

const UITemplateCreateModal: React.FC<UITemplateCreateModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
}) => {
    const [formData, setFormData] = useState<UITemplateFormData>({ ...initialFormData });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (field: string, value: string | number | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const request: AdminUITemplateCreateRequest = {
            name: formData.name,
            description: formData.description || undefined,
            type: formData.type,
            label: formData.label || undefined,
            price: formData.price,
            durationDays: formData.durationDays,
            urlPath: formData.urlPath || undefined,
            isActive: formData.isActive,
            isPopular: formData.isPopular,
            displayOrder: formData.displayOrder,
        };

        const success = await onSubmit(request);
        if (success) {
            setFormData({ ...initialFormData });
            onClose();
        }
        setIsSubmitting(false);
    };

    const handleCancel = () => {
        setFormData({ ...initialFormData });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(0, 0, 0, 0.7)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
            }}
        >
            <div
                style={{
                    background: "#1c1c1c",
                    border: "1px solid #2e2e2e",
                    borderRadius: "8px",
                    padding: "28px",
                    width: "90%",
                    maxWidth: "700px",
                    maxHeight: "90vh",
                    overflowY: "auto",
                }}
            >
                <h2 style={{ marginBottom: "24px", fontSize: "18px", fontWeight: 600, color: "#ededed" }}>
                    새 UI 템플릿 추가
                </h2>

                <UITemplateForm
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

export default UITemplateCreateModal;
