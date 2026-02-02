"use client";

import React from 'react';
import Image from 'next/image';
import { UITemplate, getUITemplateTypeLabel, formatDuration } from '@/types/uitemplate';

interface UITemplateCardProps {
    uiTemplate: UITemplate;
    onSelect: (uiTemplate: UITemplate) => void;
    isOwned?: boolean;
}

const UITemplateCard: React.FC<UITemplateCardProps> = ({ uiTemplate, onSelect, isOwned = false }) => {
    return (
        <div
            className="ui-template-card"
            onClick={() => onSelect(uiTemplate)}
            style={{
                border: '1px solid #e0e0e0',
                borderRadius: '12px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative',
                backgroundColor: isOwned ? '#f8f9fa' : '#fff',
            }}
        >
            {uiTemplate.isPopular && (
                <span
                    style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        backgroundColor: '#ff6b35',
                        color: '#fff',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                    }}
                >
                    인기
                </span>
            )}

            {isOwned && (
                <span
                    style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        backgroundColor: '#4CAF50',
                        color: '#fff',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                    }}
                >
                    보유중
                </span>
            )}

            {uiTemplate.thumbnailUrl ? (
                <div style={{ marginBottom: '16px', borderRadius: '8px', overflow: 'hidden' }}>
                    <Image
                        src={uiTemplate.thumbnailUrl}
                        alt={uiTemplate.name}
                        width={280}
                        height={180}
                        style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                    />
                </div>
            ) : (
                <div
                    style={{
                        marginBottom: '16px',
                        borderRadius: '8px',
                        backgroundColor: '#f5f5f5',
                        height: '180px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#999',
                    }}
                >
                    미리보기
                </div>
            )}

            <div style={{ marginBottom: '8px' }}>
                <span
                    style={{
                        backgroundColor: uiTemplate.type === 'URL' ? '#e3f2fd' : '#fce4ec',
                        color: uiTemplate.type === 'URL' ? '#1976d2' : '#c2185b',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                    }}
                >
                    {getUITemplateTypeLabel(uiTemplate.type)}
                </span>
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                {uiTemplate.name}
            </h3>

            {uiTemplate.description && (
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '12px', lineHeight: '1.5' }}>
                    {uiTemplate.description}
                </p>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#333' }}>
                        {uiTemplate.price.toLocaleString()}
                    </span>
                    <span style={{ fontSize: '14px', color: '#666' }}> 크레딧</span>
                </div>
                <span style={{ fontSize: '14px', color: '#999' }}>
                    {formatDuration(uiTemplate.durationDays)}
                </span>
            </div>
        </div>
    );
};

export default UITemplateCard;
