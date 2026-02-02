"use client";

import React from 'react';
import Image from 'next/image';
import { UITemplate, getUITemplateTypeLabel, formatDuration } from '@/types/uitemplate';
import {
  getResumeTemplateSlugFromUITemplate,
  getResumeTemplateSlugFromPdfUrlPath,
  getResumeTemplateConfig,
  getPreviewPathFromUITemplate,
} from '@/components/portal/features/public-resume/templates/resumeTemplateConfig';

interface UITemplateCardProps {
    uiTemplate: UITemplate;
    /** 구매하기 클릭 시 호출 (모달에서 플랜 선택) */
    onSelect: (uiTemplate: UITemplate) => void;
    /** URL/PDF 템플릿: 클릭 시 미리보기로 이동 (미설정이면 카드 클릭 = 구매) */
    onPreview?: (uiTemplate: UITemplate) => void;
    isOwned?: boolean;
}

const UITemplateCard: React.FC<UITemplateCardProps> = ({ uiTemplate, onSelect, onPreview, isOwned = false }) => {
    const plans = (uiTemplate.plans ?? []).slice().sort((a, b) => a.displayOrder - b.displayOrder);

    const resumeSlug = getResumeTemplateSlugFromUITemplate(uiTemplate) ?? getResumeTemplateSlugFromPdfUrlPath(uiTemplate.urlPath);
    const templateLabel = resumeSlug ? getResumeTemplateConfig(resumeSlug).label : null;
    const previewPath = getPreviewPathFromUITemplate(uiTemplate);
    const canPreview = !!previewPath && !!onPreview;

    const handleCardClick = () => {
        if (isOwned) return;
        if (canPreview && onPreview) {
            onPreview(uiTemplate);
        } else {
            onSelect(uiTemplate);
        }
    };

    const handlePurchaseClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isOwned) onSelect(uiTemplate);
    };

    const cardStyle: React.CSSProperties = {
        border: '1px solid #e0e0e0',
        borderRadius: '10px',
        padding: '14px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        position: 'relative',
        backgroundColor: isOwned ? '#f8f9fa' : '#fff',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '320px',
    };

    const contentBlockStyle: React.CSSProperties = {
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
    };

    const bottomBlockStyle: React.CSSProperties = {
        marginTop: 'auto',
        paddingTop: '12px',
        borderTop: '1px solid #f0f0f0',
    };

    const showPurchaseButton = canPreview && !isOwned;
    const priceRowStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '8px',
        marginBottom: showPurchaseButton ? '10px' : 0,
    };

    const buttonStyle: React.CSSProperties = {
        width: '100%',
        padding: '6px 12px',
        minHeight: '32px',
        backgroundColor: '#3182f6',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer',
    };

    return (
        <div className="ui-template-card" onClick={handleCardClick} style={cardStyle}>
            {uiTemplate.isPopular && (
                <span
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        backgroundColor: '#ff6b35',
                        color: '#fff',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '11px',
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
                        top: '10px',
                        left: '10px',
                        backgroundColor: '#4CAF50',
                        color: '#fff',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                    }}
                >
                    보유중
                </span>
            )}

            <div style={contentBlockStyle}>
                {uiTemplate.thumbnailUrl ? (
                    <div style={{ marginBottom: '10px', borderRadius: '6px', overflow: 'hidden' }}>
                        <Image
                            src={uiTemplate.thumbnailUrl}
                            alt={uiTemplate.name}
                            width={220}
                            height={140}
                            style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                        />
                    </div>
                ) : (
                    <div
                        style={{
                            marginBottom: '10px',
                            borderRadius: '6px',
                            backgroundColor: '#f5f5f5',
                            height: '140px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#999',
                            fontSize: '13px',
                        }}
                    >
                        미리보기
                    </div>
                )}

                <div style={{ marginBottom: '8px', display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center' }}>
                    <span
                        style={{
                            backgroundColor: uiTemplate.type === 'URL' ? '#e3f2fd' : '#fce4ec',
                            color: uiTemplate.type === 'URL' ? '#1976d2' : '#c2185b',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '11px',
                        }}
                    >
                        {getUITemplateTypeLabel(uiTemplate.type)}
                    </span>
                    {templateLabel && (
                        <span
                            style={{
                                backgroundColor: '#f0f0f0',
                                color: '#555',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontSize: '10px',
                            }}
                            title="이 템플릿이 적용되는 공개 이력서 디자인"
                        >
                            {templateLabel}
                        </span>
                    )}
                </div>

                <h3 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '6px', lineHeight: '1.3' }}>
                    {uiTemplate.name}
                </h3>

                {uiTemplate.description && (
                    <p style={{ fontSize: '12px', color: '#666', marginBottom: 0, lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}>
                        {uiTemplate.description}
                    </p>
                )}
            </div>

            <div style={bottomBlockStyle}>
                {plans.length > 0 ? (
                    <div style={{ marginBottom: '10px' }}>
                        <div style={{ fontSize: '12px', color: '#666', marginBottom: '6px' }}>이용 기간 · 크레딧</div>
                        <p style={{ fontSize: '13px', color: '#333', margin: 0, lineHeight: 1.5 }}>
                            {plans.map((plan) => `${formatDuration(plan.durationDays)} ${plan.price.toLocaleString()} 크레딧`).join(' · ')}
                        </p>
                    </div>
                ) : (
                    <div style={priceRowStyle}>
                        <div>
                            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>
                                {uiTemplate.price.toLocaleString()}
                            </span>
                            <span style={{ fontSize: '12px', color: '#666' }}> 크레딧</span>
                        </div>
                        <span style={{ fontSize: '12px', color: '#999' }}>
                            {formatDuration(uiTemplate.durationDays)}
                        </span>
                    </div>
                )}
                {showPurchaseButton && (
                    <button type="button" onClick={handlePurchaseClick} style={buttonStyle}>
                        구매하기
                    </button>
                )}
            </div>
        </div>
    );
};

export default UITemplateCard;
