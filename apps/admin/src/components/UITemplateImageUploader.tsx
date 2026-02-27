"use client";

import React, { useRef, useState } from "react";
import { UITemplateImage } from "@workfolio/shared/types/uitemplate";

interface UITemplateImageUploaderProps {
    images: UITemplateImage[];
    onUpload: (files: File[], imageType: string) => Promise<void>;
    onDelete: (imageId: string) => Promise<void>;
    disabled?: boolean;
}

const UITemplateImageUploader: React.FC<UITemplateImageUploaderProps> = ({
    images,
    onUpload,
    onDelete,
    disabled = false,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [imageType, setImageType] = useState("DETAIL");
    const [uploading, setUploading] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFiles(Array.from(e.target.files));
        }
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) return;
        setUploading(true);
        try {
            await onUpload(selectedFiles, imageType);
            setSelectedFiles([]);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (imageId: string) => {
        if (!confirm("이미지를 삭제하시겠습니까?")) return;
        setDeletingId(imageId);
        try {
            await onDelete(imageId);
        } finally {
            setDeletingId(null);
        }
    };

    const thumbnails = images.filter((img) => img.imageType === "THUMBNAIL");
    const details = images.filter((img) => img.imageType === "DETAIL");

    return (
        <div>
            {/* 업로드 영역 */}
            <div
                style={{
                    border: "1px dashed #DFE0E1",
                    borderRadius: "8px",
                    padding: "20px",
                    marginBottom: "20px",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                    <select
                        value={imageType}
                        onChange={(e) => setImageType(e.target.value)}
                        style={{ width: "140px" }}
                        disabled={disabled}
                    >
                        <option value="THUMBNAIL">썸네일</option>
                        <option value="DETAIL">상세 이미지</option>
                    </select>
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileSelect}
                        disabled={disabled}
                        style={{ flex: 1, color: "#121212", fontSize: "13px" }}
                    />
                </div>

                {selectedFiles.length > 0 && (
                    <div style={{ marginBottom: "12px" }}>
                        <div style={{ fontSize: "12px", color: "#121212", marginBottom: "8px" }}>
                            선택된 파일: {selectedFiles.length}개
                        </div>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                            {selectedFiles.map((file, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        width: "80px",
                                        height: "80px",
                                        borderRadius: "4px",
                                        overflow: "hidden",
                                        border: "1px solid #EEF0F1",
                                    }}
                                >
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={file.name}
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <button
                    type="button"
                    onClick={handleUpload}
                    disabled={disabled || uploading || selectedFiles.length === 0}
                    className="dark-gray"
                    style={{
                        padding: "6px 16px",
                        fontSize: "13px",
                        opacity: disabled || uploading || selectedFiles.length === 0 ? 0.5 : 1,
                        cursor: disabled || uploading || selectedFiles.length === 0 ? "not-allowed" : "pointer",
                    }}
                >
                    {uploading ? "업로드 중..." : "업로드"}
                </button>
            </div>

            {/* 썸네일 이미지 목록 */}
            {thumbnails.length > 0 && (
                <div style={{ marginBottom: "16px" }}>
                    <h4 style={{ fontSize: "13px", color: "#121212", marginBottom: "8px" }}>
                        썸네일 ({thumbnails.length})
                    </h4>
                    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                        {thumbnails.map((img) => (
                            <ImageCard
                                key={img.id}
                                image={img}
                                onDelete={handleDelete}
                                deleting={deletingId === img.id}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* 상세 이미지 목록 */}
            {details.length > 0 && (
                <div>
                    <h4 style={{ fontSize: "13px", color: "#121212", marginBottom: "8px" }}>
                        상세 이미지 ({details.length})
                    </h4>
                    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                        {details.map((img) => (
                            <ImageCard
                                key={img.id}
                                image={img}
                                onDelete={handleDelete}
                                deleting={deletingId === img.id}
                            />
                        ))}
                    </div>
                </div>
            )}

            {images.length === 0 && (
                <div style={{ color: "#121212", fontSize: "13px", textAlign: "center", padding: "20px" }}>
                    등록된 이미지가 없습니다.
                </div>
            )}
        </div>
    );
};

function ImageCard({
    image,
    onDelete,
    deleting,
}: {
    image: UITemplateImage;
    onDelete: (id: string) => void;
    deleting: boolean;
}) {
    return (
        <div
            style={{
                position: "relative",
                width: "120px",
                border: "1px solid #EEF0F1",
                borderRadius: "6px",
                overflow: "hidden",
                background: "#F7F8F9",
            }}
        >
            <img
                src={image.imageUrl}
                alt={`${image.imageType} ${image.displayOrder}`}
                style={{ width: "100%", height: "90px", objectFit: "cover" }}
            />
            <div
                style={{
                    padding: "6px 8px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <span style={{ fontSize: "11px", color: "#121212" }}>#{image.displayOrder}</span>
                <button
                    type="button"
                    onClick={() => onDelete(image.id)}
                    disabled={deleting}
                    style={{
                        background: "none",
                        border: "none",
                        color: "#f87171",
                        fontSize: "11px",
                        cursor: deleting ? "not-allowed" : "pointer",
                        padding: "2px 4px",
                        opacity: deleting ? 0.5 : 1,
                    }}
                >
                    {deleting ? "..." : "삭제"}
                </button>
            </div>
        </div>
    );
}

export default UITemplateImageUploader;
