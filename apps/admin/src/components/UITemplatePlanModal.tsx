"use client";

import React, { useEffect, useState } from "react";
import { UiTemplatePlan } from "@workfolio/shared/types/uitemplate";
import AdminModal from "./AdminModal";

interface PlanFormData {
    durationDays: number;
    price: number;
    displayOrder: number;
}

interface UITemplatePlanModalProps {
    isOpen: boolean;
    plan: UiTemplatePlan | null;
    onClose: () => void;
    onSubmit: (data: PlanFormData) => Promise<boolean>;
}

const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px 10px",
    border: "1px solid #DDE0E3",
    borderRadius: "6px",
    fontSize: "13px",
    outline: "none",
    background: "#FFFFFF",
};

const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: "6px",
    fontWeight: 500,
    fontSize: "13px",
    color: "#121212",
};

const UITemplatePlanModal: React.FC<UITemplatePlanModalProps> = ({
    isOpen,
    plan,
    onClose,
    onSubmit,
}) => {
    const [form, setForm] = useState<PlanFormData>({
        durationDays: 30,
        price: 0,
        displayOrder: 0,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (plan) {
            setForm({
                durationDays: plan.durationDays,
                price: plan.price,
                displayOrder: plan.displayOrder,
            });
        } else {
            setForm({ durationDays: 30, price: 0, displayOrder: 0 });
        }
    }, [plan, isOpen]);

    const handleSubmit = async () => {
        if (form.durationDays <= 0 || form.price < 0) return;
        setIsSubmitting(true);
        const success = await onSubmit(form);
        if (success) onClose();
        setIsSubmitting(false);
    };

    const isEdit = plan !== null;

    return (
        <AdminModal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? "플랜 수정" : "플랜 추가"}
            maxWidth="400px"
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
                        disabled={isSubmitting || form.durationDays <= 0}
                        className="dark-gray"
                        style={{
                            padding: "8px 16px",
                            cursor: isSubmitting ? "not-allowed" : "pointer",
                            opacity: isSubmitting ? 0.5 : 1,
                        }}
                    >
                        {isSubmitting ? "처리 중..." : isEdit ? "저장" : "추가"}
                    </button>
                </>
            }
        >
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                    <label style={labelStyle}>이용일수</label>
                    <input
                        type="number"
                        min={1}
                        value={form.durationDays}
                        onChange={(e) => setForm((p) => ({ ...p, durationDays: Number(e.target.value) }))}
                        style={inputStyle}
                        placeholder="30"
                    />
                </div>
                <div>
                    <label style={labelStyle}>가격 (크레딧)</label>
                    <input
                        type="number"
                        min={0}
                        value={form.price}
                        onChange={(e) => setForm((p) => ({ ...p, price: Number(e.target.value) }))}
                        style={inputStyle}
                        placeholder="0"
                    />
                </div>
                <div>
                    <label style={labelStyle}>표시 순서</label>
                    <input
                        type="number"
                        min={0}
                        value={form.displayOrder}
                        onChange={(e) => setForm((p) => ({ ...p, displayOrder: Number(e.target.value) }))}
                        style={inputStyle}
                        placeholder="0"
                    />
                </div>
            </div>
        </AdminModal>
    );
};

export default UITemplatePlanModal;
