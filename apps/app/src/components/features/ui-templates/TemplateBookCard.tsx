"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { UITemplate } from '@workfolio/shared/types/uitemplate';

export interface TemplateBookCardBadge {
    label: string;
    color: string;
    bgColor: string;
}

export interface TemplateBookCardProps {
    uiTemplate: UITemplate;
    /** 카드 클릭 시 호출 */
    onClick?: (uiTemplate: UITemplate) => void;
    /** 현재 선택 상태 */
    isSelected?: boolean;
    /** 비활성/만료 등으로 반투명 처리 */
    dimmed?: boolean;
    /** 좌측 상단 배지 (기본 URL/PDF 등) */
    topLeftBadge?: TemplateBookCardBadge | null;
    /** 하단 텍스트 정보 (상태 + 타입 등) */
    bottomInfo?: React.ReactNode;
    /** 호버 시 표시할 오버레이 콘텐츠 */
    hoverOverlay?: React.ReactNode;
    /** 카드 아래 버튼 영역 (항상 표시) */
    bottomActions?: React.ReactNode;
}

const TemplateBookCard: React.FC<TemplateBookCardProps> = ({
    uiTemplate,
    onClick,
    isSelected = false,
    dimmed = false,
    topLeftBadge,
    bottomInfo,
    hoverOverlay,
    bottomActions,
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const isUrl = uiTemplate.type === 'URL' || uiTemplate.type === 1;

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => onClick?.(uiTemplate)}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                opacity: dimmed ? 0.5 : 1,
                transition: 'opacity 0.2s ease',
                cursor: onClick ? 'pointer' : 'default',
            }}
        >
            {/* 책 표지 */}
            <div style={{
                width: '100%',
                aspectRatio: '3 / 4',
                borderRadius: '6px',
                overflow: 'hidden',
                position: 'relative',
                backgroundColor: '#f0f0f0',
                boxShadow: isHovered || isSelected
                    ? '0 8px 20px rgba(0,0,0,0.15)'
                    : '0 2px 8px rgba(0,0,0,0.08)',
                transition: 'box-shadow 0.2s ease, transform 0.2s ease',
                transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                outline: isSelected ? '2px solid #3182f6' : 'none',
                outlineOffset: '2px',
            }}>
                {uiTemplate.thumbnailUrl ? (
                    <Image
                        src={uiTemplate.thumbnailUrl}
                        alt={uiTemplate.name}
                        fill
                        style={{ objectFit: 'cover' }}
                    />
                ) : (
                    <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: isUrl
                            ? 'linear-gradient(145deg, #e8eeff, #f4f6ff)'
                            : 'linear-gradient(145deg, #ffeef3, #fff5f7)',
                        padding: '16px',
                    }}>
                        <span style={{
                            fontSize: '13px',
                            fontWeight: 600,
                            color: isUrl ? '#4a6cf7' : '#d6336c',
                            textAlign: 'center',
                            lineHeight: '1.4',
                            wordBreak: 'keep-all',
                        }}>
                            {uiTemplate.name}
                        </span>
                    </div>
                )}

                {/* 좌측 상단 배지 */}
                {topLeftBadge && (
                    <span style={{
                        position: 'absolute',
                        top: '8px',
                        left: '8px',
                        backgroundColor: topLeftBadge.bgColor,
                        color: topLeftBadge.color,
                        padding: '3px 7px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: 700,
                        lineHeight: '1',
                    }}>
                        {topLeftBadge.label}
                    </span>
                )}

                {/* 우측 상단 배지 */}
                <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    alignItems: 'flex-end',
                }}>
                    {uiTemplate.isPopular && (
                        <span style={{
                            backgroundColor: '#ff6b35',
                            color: '#fff',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '10px',
                            fontWeight: 700,
                            lineHeight: '1.4',
                        }}>
                            인기
                        </span>
                    )}
                </div>

                {/* 호버 오버레이 */}
                {isHovered && hoverOverlay && (
                    <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
                        padding: '24px 10px 10px',
                        display: 'flex',
                        justifyContent: 'center',
                    }}>
                        {hoverOverlay}
                    </div>
                )}
            </div>

            {/* 제목 */}
            <p style={{
                marginTop: '10px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#222',
                textAlign: 'center',
                lineHeight: '1.4',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                wordBreak: 'keep-all',
                width: '100%',
            } as React.CSSProperties}>
                {uiTemplate.name}
            </p>

            {/* 하단 정보 */}
            {bottomInfo}

            {/* 하단 버튼 영역 */}
            {bottomActions}
        </div>
    );
};

export default TemplateBookCard;
