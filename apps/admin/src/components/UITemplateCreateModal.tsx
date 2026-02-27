"use client";

import React, { useEffect, useRef, useState } from "react";
import { AdminUITemplateCreateRequest } from "@workfolio/shared/types/uitemplate";
import UITemplateForm, { UITemplateFormData } from "./UITemplateForm";
import AdminModal from "./AdminModal";

interface UITemplateCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (request: AdminUITemplateCreateRequest, pendingFiles?: File[]) => Promise<boolean>;
}

interface PendingImage {
    file: File;
    previewUrl: string;
}

const initialFormData: UITemplateFormData = {
    name: "",
    description: "",
    type: "URL",
    label: "",
    urlPath: "",
    isActive: true,
    displayOrder: 0,
};

const UITemplateCreateModal: React.FC<UITemplateCreateModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState<UITemplateFormData>({ ...initialFormData });
    const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        return () => {};
    }, [isOpen]);

    const handleChange = (field: string, value: string | number | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleAddClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const newImages = Array.from(e.target.files).map((file) => ({
            file,
            previewUrl: URL.createObjectURL(file),
        }));
        setPendingImages((prev) => [...prev, ...newImages]);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleRemoveImage = (index: number) => {
        setPendingImages((prev) => {
            const removed = prev[index];
            if (removed) URL.revokeObjectURL(removed.previewUrl);
            return prev.filter((_, i) => i !== index);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const request: AdminUITemplateCreateRequest = {
            name: formData.name,
            description: formData.description || undefined,
            type: formData.type,
            label: formData.label || undefined,
            urlPath: formData.urlPath || undefined,
            isActive: formData.isActive,
            displayOrder: formData.displayOrder,
        };

        const files = pendingImages.map((img) => img.file);
        const success = await onSubmit(request, files.length > 0 ? files : undefined);
        if (success) {
            pendingImages.forEach((img) => URL.revokeObjectURL(img.previewUrl));
            setPendingImages([]);
            setFormData({ ...initialFormData });
            onClose();
        }
        setIsSubmitting(false);
    };

    const handleCancel = () => {
        pendingImages.forEach((img) => URL.revokeObjectURL(img.previewUrl));
        setPendingImages([]);
        setFormData({ ...initialFormData });
        onClose();
    };

    return (
        <AdminModal
            isOpen={isOpen}
            onClose={handleCancel}
            title="새 UI 템플릿 추가"
            maxWidth="550px"
            maxHeight="90vh"
            footer={
                <>
                    <button
                        type="button"
                        onClick={handleCancel}
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
            {/* 이미지 영역 */}
            <div style={{ marginBottom: "24px" }}>
                <label
                    style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: 500,
                        fontSize: "13px",
                        color: "#121212",
                    }}
                >
                    이미지 ({pendingImages.length})
                </label>
                <div
                    style={{
                        display: "flex",
                        border: "1px solid #EEF0F1",
                        borderRadius: "8px",
                        overflow: "hidden",
                        background: "#F7F8F9",
                    }}
                >
                    <button
                        type="button"
                        onClick={handleAddClick}
                        style={{
                            flexShrink: 0,
                            width: "120px",
                            height: "120px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            background: "#FFFFFF",
                            border: "none",
                            borderRight: "1px solid #EEF0F1",
                            cursor: "pointer",
                            color: "#121212",
                            fontSize: "13px",
                        }}
                    >
                        <span style={{ fontSize: "28px", lineHeight: 1, color: "#121212" }}>+</span>
                        <span>사진 추가</span>
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileSelect}
                        style={{ display: "none" }}
                    />
                    <div
                        style={{
                            display: "flex",
                            gap: "12px",
                            overflowX: "auto",
                            padding: pendingImages.length > 0 ? "12px" : "0",
                            flex: 1,
                            minWidth: 0,
                        }}
                    >
                        {pendingImages.map((img, idx) => (
                            <div
                                key={idx}
                                style={{
                                    position: "relative",
                                    flexShrink: 0,
                                    width: "96px",
                                    height: "96px",
                                    borderRadius: "6px",
                                    overflow: "hidden",
                                    border: "1px solid #EEF0F1",
                                }}
                            >
                                <img
                                    src={img.previewUrl}
                                    alt={img.file.name}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(idx)}
                                    style={{
                                        position: "absolute",
                                        top: "4px",
                                        right: "4px",
                                        width: "20px",
                                        height: "20px",
                                        borderRadius: "50%",
                                        background: "rgba(0, 0, 0, 0.6)",
                                        border: "none",
                                        color: "#fff",
                                        fontSize: "12px",
                                        lineHeight: "20px",
                                        textAlign: "center",
                                        cursor: "pointer",
                                        padding: 0,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <UITemplateForm
                formData={formData}
                onChange={handleChange}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isSubmitting={isSubmitting}
                hideButtons
            />
        </AdminModal>
    );
};

export default UITemplateCreateModal;
