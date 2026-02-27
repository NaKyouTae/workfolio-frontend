"use client";

import React, { useEffect, useState } from "react";
import {
    UITemplate,
    UiTemplatePlan,
    formatDuration,
} from "@workfolio/shared/types/uitemplate";

interface UITemplateExpandedRowProps {
    template: UITemplate;
}

const UITemplateExpandedRow: React.FC<UITemplateExpandedRowProps> = ({
    template,
}) => {
    const [plans, setPlans] = useState<UiTemplatePlan[]>(template.plans || []);

    useEffect(() => {
        setPlans(template.plans || []);
    }, [template]);

    const sorted = [...plans].sort((a, b) => a.displayOrder - b.displayOrder);

    return (
        <div onClick={(e) => e.stopPropagation()}>
            {/* 플랜 목록 (읽기 전용) */}
            <div style={{ marginBottom: "12px" }}>
                <div style={{ marginBottom: "8px" }}>
                    <label style={{ fontWeight: 500, fontSize: "13px", color: "#121212" }}>
                        이용 기간 플랜 ({plans.length})
                    </label>
                </div>

                {sorted.length === 0 ? (
                    <div style={{
                        padding: "16px",
                        textAlign: "center",
                        color: "#121212",
                        fontSize: "13px",
                        background: "#F7F8F9",
                        borderRadius: "8px",
                        border: "1px solid #EEF0F1",
                    }}>
                        등록된 플랜이 없습니다.
                    </div>
                ) : (
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                        gap: "8px",
                    }}>
                        {sorted.map((plan) => (
                            <div
                                key={plan.id}
                                style={{
                                    padding: "10px 12px",
                                    background: "#FFFFFF",
                                    border: "1px solid #EEF0F1",
                                    borderRadius: "8px",
                                    fontSize: "13px",
                                }}
                            >
                                <div style={{ fontWeight: 600, marginBottom: "4px" }}>
                                    {formatDuration(plan.durationDays)}
                                    <span style={{ color: "#121212", fontWeight: 400, marginLeft: "4px", fontSize: "12px" }}>
                                        ({plan.durationDays}일)
                                    </span>
                                </div>
                                <div style={{ color: "#121212" }}>
                                    {plan.price.toLocaleString()} 크레딧
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UITemplateExpandedRow;
