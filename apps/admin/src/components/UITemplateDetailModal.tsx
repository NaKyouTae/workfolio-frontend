"use client";

import React, { useEffect, useState } from "react";
import {
    UITemplate,
    UITemplateImage,
    AdminUITemplateUpdateRequest,
} from "@workfolio/shared/types/uitemplate";
import UITemplateForm, { UITemplateFormData } from "./UITemplateForm";
import UITemplateImageUploader from "./UITemplateImageUploader";

interface UITemplateDetailModalProps {
    isOpen: boolean;
    template: UITemplate | null;
    onClose: () => void;
    onSubmit: (id: string, request: AdminUITemplateUpdateRequest) => Promise<boolean>;
    onUploadImages: (id: string, files: File[], imageType: string) => Promise<UITemplateImage[]>;
    onDeleteImage: (imageId: string) => Promise<boolean>;
    onRefresh: (id: string) => Promise<UITemplate | null>;
}

type Tab = "info" | "images";

const UITemplateDetailModal: React.FC<UITemplateDetailModalProps> = ({
    isOpen,
    template,
    onClose,
    onSubmit,
    onUploadImages,
    onDeleteImage,
    onRefresh,
}) => {
    const [activeTab, setActiveTab] = useState<Tab>("info");
    const [formData, setFormData] = useState<UITemplateFormData>({
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
    });
    const [images, setImages] = useState<UITemplateImage[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
                price: template.price,
                durationDays: template.durationDays,
                urlPath: template.urlPath || "",
                isActive: template.isActive,
                isPopular: template.isPopular,
                displayOrder: template.displayOrder,
            });
            setImages(template.images || []);
            setActiveTab("info");
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
            price: formData.price,
            durationDays: formData.durationDays,
            urlPath: formData.urlPath || undefined,
            isActive: formData.isActive,
            isPopular: formData.isPopular,
            displayOrder: formData.displayOrder,
        };

        const success = await onSubmit(template.id, request);
        if (success) {
            onClose();
        }
        setIsSubmitting(false);
    };

    const handleUpload = async (files: File[], imageType: string) => {
        if (!template) return;
        const newImages = await onUploadImages(template.id, files, imageType);
        if (newImages.length > 0) {
            const refreshed = await onRefresh(template.id);
            if (refreshed) {
                setImages(refreshed.images || []);
            }
        }
    };

    const handleDeleteImage = async (imageId: string) => {
        if (!template) return;
        const success = await onDeleteImage(imageId);
        if (success) {
            setImages((prev) => prev.filter((img) => img.id !== imageId));
        }
    };

    if (!isOpen || !template) return null;

    const tabStyle = (tab: Tab): React.CSSProperties => ({
        padding: "8px 20px",
        background: activeTab === tab ? "#2e2e2e" : "transparent",
        color: activeTab === tab ? "#ededed" : "#6b6b6b",
        border: "none",
        borderBottom: activeTab === tab ? "2px solid #3ecf8e" : "2px solid transparent",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: activeTab === tab ? 600 : 400,
    });

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
                    maxWidth: "800px",
                    maxHeight: "90vh",
                    overflowY: "auto",
                }}
            >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#ededed" }}>
                        UI 템플릿 상세
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: "none",
                            border: "none",
                            color: "#6b6b6b",
                            fontSize: "20px",
                            cursor: "pointer",
                            padding: "4px 8px",
                        }}
                    >
                        ✕
                    </button>
                </div>

                {/* 탭 */}
                <div style={{ display: "flex", borderBottom: "1px solid #2e2e2e", marginBottom: "20px" }}>
                    <button type="button" style={tabStyle("info")} onClick={() => setActiveTab("info")}>
                        기본 정보
                    </button>
                    <button type="button" style={tabStyle("images")} onClick={() => setActiveTab("images")}>
                        이미지 관리 ({images.length})
                    </button>
                </div>

                {/* 기본 정보 탭 */}
                {activeTab === "info" && (
                    <UITemplateForm
                        formData={formData}
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                        onCancel={onClose}
                        isSubmitting={isSubmitting}
                    />
                )}

                {/* 이미지 관리 탭 */}
                {activeTab === "images" && (
                    <UITemplateImageUploader
                        images={images}
                        onUpload={handleUpload}
                        onDelete={handleDeleteImage}
                    />
                )}
            </div>
        </div>
    );
};

export default UITemplateDetailModal;
