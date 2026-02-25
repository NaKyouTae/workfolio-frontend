"use client";

import React from 'react';
import { UITemplate } from '@workfolio/shared/types/uitemplate';
import TemplateBookCard from './TemplateBookCard';

interface UITemplateCardProps {
    uiTemplate: UITemplate;
    onSelect: (uiTemplate: UITemplate) => void;
    onPreview?: (uiTemplate: UITemplate) => void;
    onDetail: (uiTemplate: UITemplate) => void;
    isOwned?: boolean;
    isSelected?: boolean;
}

const UITemplateCard: React.FC<UITemplateCardProps> = ({
    uiTemplate,
    onSelect,
    onPreview,
    onDetail,
    isOwned = false,
    isSelected = false,
}) => {
    const handlePreviewClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onPreview?.(uiTemplate);
    };

    const handlePurchaseClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isOwned) onSelect(uiTemplate);
    };

    const bottomActions = (
        <div style={{ display: 'flex', gap: '4px', marginTop: '6px', width: '100%' }}>
            {onPreview && (
                <button
                    onClick={handlePreviewClick}
                    style={{
                        flex: 1,
                        padding: '6px 0',
                        backgroundColor: '#f5f5f5',
                        color: '#333',
                        border: '1px solid #e0e0e0',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                    }}
                >
                    미리보기
                </button>
            )}
            {isOwned ? (
                <span style={{
                    flex: 1,
                    padding: '6px 0',
                    backgroundColor: '#e8f5e9',
                    color: '#4CAF50',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 600,
                    textAlign: 'center',
                    display: 'inline-block',
                }}>
                    보유중
                </span>
            ) : (
                <button
                    onClick={handlePurchaseClick}
                    style={{
                        flex: 1,
                        padding: '6px 0',
                        backgroundColor: '#3182f6',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                    }}
                >
                    구매하기
                </button>
            )}
        </div>
    );

    return (
        <TemplateBookCard
            uiTemplate={uiTemplate}
            onClick={onDetail}
            isSelected={isSelected}
            bottomActions={bottomActions}
        />
    );
};

export default UITemplateCard;
