"use client";

import React, { useEffect } from "react";
import modalStyles from "./Modal.module.css";

interface AdminModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    maxWidth?: string;
    maxHeight?: string;
    footer?: React.ReactNode;
    children: React.ReactNode;
}

const AdminModal: React.FC<AdminModalProps> = ({
    isOpen,
    onClose,
    title,
    maxWidth = "500px",
    maxHeight = "80vh",
    footer,
    children,
}) => {
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(0, 0, 0, 0.4)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: "#FFFFFF",
                    border: "1px solid #EEF0F1",
                    borderRadius: "8px",
                    width: "90%",
                    maxWidth,
                    maxHeight,
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* 헤더 */}
                <div className={modalStyles.modalHeader}>
                    <h2 className={modalStyles.modalTitle}>{title}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className={modalStyles.closeButton}
                    >
                        ✕
                    </button>
                </div>

                {/* 컨텐츠 */}
                <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
                    {children}
                </div>

                {/* 푸터 */}
                {footer && (
                    <div style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "12px",
                        padding: "16px 28px",
                        borderTop: "1px solid #EEF0F1",
                        flexShrink: 0,
                    }}>
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminModal;
