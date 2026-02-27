"use client";

import { useEffect, useMemo, useState } from "react";
import { Worker } from "@workfolio/shared/generated/common";
import AdminModal from "./AdminModal";
import AdminUserSearch from "./AdminUserSearch";

interface CreditAdjustModalProps {
    isOpen: boolean;
    action: "ADD" | "DEDUCT";
    initialWorker: Worker | null;
    onClose: () => void;
    onSubmit: (payload: { workerId: string; amount: number; description?: string }) => Promise<void>;
}

export default function CreditAdjustModal({
    isOpen,
    action,
    initialWorker,
    onClose,
    onSubmit,
}: CreditAdjustModalProps) {
    const [selectedWorker, setSelectedWorker] = useState<Worker | null>(initialWorker);
    const [amountInput, setAmountInput] = useState("");
    const [description, setDescription] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        setSelectedWorker(initialWorker);
        setAmountInput("");
        setDescription("");
    }, [isOpen, initialWorker]);

    const amount = useMemo(() => {
        const parsed = Number(amountInput.replace(/,/g, "").trim());
        return Number.isFinite(parsed) ? parsed : 0;
    }, [amountInput]);

    const isValid = selectedWorker !== null && Number.isInteger(amount) && amount > 0;
    const actionLabel = action === "ADD" ? "부여" : "차감";

    const handleSubmit = async () => {
        if (!selectedWorker || !isValid || submitting) return;

        setSubmitting(true);
        try {
            await onSubmit({
                workerId: selectedWorker.id,
                amount,
                description: description.trim() || undefined,
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AdminModal
            isOpen={isOpen}
            onClose={onClose}
            title={`크레딧 ${actionLabel}`}
            maxWidth="640px"
            maxHeight="90vh"
            footer={
                <>
                    <button
                        className="line gray"
                        onClick={onClose}
                        disabled={submitting}
                        style={{ height: "36px", padding: "0 16px" }}
                    >
                        취소
                    </button>
                    <button
                        className={action === "ADD" ? "dark-gray" : "line red"}
                        onClick={handleSubmit}
                        disabled={!isValid || submitting}
                        style={{ height: "36px", padding: "0 16px", minWidth: "74px" }}
                    >
                        {submitting ? "처리중..." : actionLabel}
                    </button>
                </>
            }
        >
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                    <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>대상 사용자</div>
                    <AdminUserSearch
                        selectedWorker={selectedWorker}
                        onSelectWorker={(worker) => setSelectedWorker(worker)}
                        onClearWorker={() => setSelectedWorker(null)}
                    />
                    {selectedWorker && (
                        <div style={{
                            marginTop: "8px",
                            padding: "8px 12px",
                            background: "var(--gray001, #f5f5f5)",
                            borderRadius: "6px",
                            fontSize: "13px",
                            color: "var(--gray007, #555)",
                        }}>
                            보유 크레딧: <strong style={{ color: "var(--gray009, #222)" }}>{selectedWorker.credit.toLocaleString()}</strong>
                        </div>
                    )}
                </div>

                <div>
                    <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>{actionLabel} 크레딧</div>
                    <input
                        type="number"
                        min={1}
                        step={1}
                        value={amountInput}
                        onChange={(e) => setAmountInput(e.target.value)}
                        placeholder={`${actionLabel}할 크레딧 수량 입력`}
                        style={{
                            width: "100%",
                            height: "40px",
                            border: "1px solid var(--gray003)",
                            borderRadius: "8px",
                            padding: "0 12px",
                            fontSize: "14px",
                        }}
                    />
                </div>

                <div>
                    <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>설명 (선택)</div>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder={`예) 관리자 ${actionLabel}`}
                        rows={3}
                        style={{
                            width: "100%",
                            border: "1px solid var(--gray003)",
                            borderRadius: "8px",
                            padding: "10px 12px",
                            fontSize: "13px",
                            resize: "vertical",
                        }}
                    />
                </div>
            </div>
        </AdminModal>
    );
}
