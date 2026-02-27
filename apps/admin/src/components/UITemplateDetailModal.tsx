"use client";

import React, { useEffect, useRef, useState } from "react";
import {
    UITemplate,
    UITemplateImage,
    AdminUITemplateUpdateRequest,
} from "@workfolio/shared/types/uitemplate";
import UITemplateForm, { UITemplateFormData } from "./UITemplateForm";
import AdminModal from "./AdminModal";

interface UITemplateDetailModalProps {
    isOpen: boolean;
    template: UITemplate | null;
    onClose: () => void;
    onSubmit: (id: string, request: AdminUITemplateUpdateRequest) => Promise<boolean>;
    onUploadImages: (id: string, files: File[], imageType: string) => Promise<UITemplateImage[]>;
    onDeleteImage: (imageId: string) => Promise<boolean>;
    onRefresh: (id: string) => Promise<UITemplate | null>;
}

const UITemplateDetailModal: React.FC<UITemplateDetailModalProps> = ({
    isOpen,
    template,
    onClose,
    onSubmit,
    onUploadImages,
    onDeleteImage,
    onRefresh,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState<UITemplateFormData>({
        name: "",
        description: "",
        type: "URL",
        label: "",
        urlPath: "",
        isActive: true,
        displayOrder: 0,
    });
    const [images, setImages] = useState<UITemplateImage[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        if (template) {
            const typeStr =
                typeof template.type === "string"
                    ? template.type
                    : template.type === 1
                    ? "URL"
                    : "PDF";
            setFormData({
                name: template.name,
                description: template.description || "",
                type: typeStr,
                label: template.label || "",
                urlPath: template.urlPath || "",
                isActive: template.isActive,
                displayOrder: template.displayOrder,
            });
            setImages(template.images || []);
        }
    }, [template]);

    const handleChange = (field: string, value: string | number | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!template) return;
        setIsSubmitting(true);

        const request: AdminUITemplateUpdateRequest = {
            id: template.id,
            name: formData.name,
            description: formData.description || undefined,
            type: formData.type,
            label: formData.label || undefined,
            urlPath: formData.urlPath || undefined,
            isActive: formData.isActive,
            displayOrder: formData.displayOrder,
        };

        const success = await onSubmit(template.id, request);
        if (success) {
            onClose();
        }
        setIsSubmitting(false);
    };

    const handleAddClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0 || !template) return;
        const files = Array.from(e.target.files);
        setUploading(true);
        try {
            const newImages = await onUploadImages(template.id, files, "DETAIL");
            if (newImages.length > 0) {
                const refreshed = await onRefresh(template.id);
                if (refreshed) {
                    setImages(refreshed.images || []);
                }
            }
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleDeleteImage = async (imageId: string) => {
        if (!template) return;
        if (!confirm("이미지를 삭제하시겠습니까?")) return;
        setDeletingId(imageId);
        try {
            const success = await onDeleteImage(imageId);
            if (success) {
                setImages((prev) => prev.filter((img) => img.id !== imageId));
            }
        } finally {
            setDeletingId(null);
        }
    };

    if (!template) return null;

    return (
        <AdminModal
            isOpen={isOpen}
            onClose={onClose}
            title="UI 템플릿 상세"
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
                    이미지 ({images.length})
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
                        disabled={uploading}
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
                            cursor: uploading ? "not-allowed" : "pointer",
                            color: "#121212",
                            fontSize: "13px",
                            opacity: uploading ? 0.5 : 1,
                        }}
                    >
                        <span style={{ fontSize: "28px", lineHeight: 1, color: "#121212" }}>+</span>
                        <span>{uploading ? "업로드 중..." : "사진 추가"}</span>
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
                            padding: images.length > 0 ? "12px" : "0",
                            flex: 1,
                            minWidth: 0,
                        }}
                    >
                        {images.map((img) => (
                            <div
                                key={img.id}
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
                                    src={img.imageUrl}
                                    alt={`${img.imageType} ${img.displayOrder}`}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                                <button
                                    type="button"
                                    onClick={() => handleDeleteImage(img.id)}
                                    disabled={deletingId === img.id}
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
                                        cursor: deletingId === img.id ? "not-allowed" : "pointer",
                                        padding: 0,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        opacity: deletingId === img.id ? 0.5 : 1,
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
                onCancel={onClose}
                isSubmitting={isSubmitting}
                hideButtons
            />
        </AdminModal>
    );
};

export default UITemplateDetailModal;
