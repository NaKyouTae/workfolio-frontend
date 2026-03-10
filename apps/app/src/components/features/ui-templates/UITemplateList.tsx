"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useUITemplates } from '@/hooks/useUITemplates';
import { UITemplate, UITemplateImage } from '@workfolio/shared/types/uitemplate';
import { useCredits } from '@/hooks/useCredits';
import { isLoggedIn } from '@workfolio/shared/utils/authUtils';
import LoginModal from '@workfolio/shared/ui/LoginModal';
import { useNotification } from '@workfolio/shared/hooks/useNotification';
import TemplatePurchaseModal from './TemplatePurchaseModal';
import { getPreviewPathFromUITemplate } from '@/components/features/public-resume/templates/resumeTemplateConfig';
import FloatingNavigation from '@workfolio/shared/ui/FloatingNavigation';

const MAIN_COLOR = '#FFBB26';
const MAIN_COLOR_LIGHT = '#FFF8E6';

interface UITemplateListProps {
    onPurchaseSuccess?: () => void;
}

const UITemplateList: React.FC<UITemplateListProps> = ({ onPurchaseSuccess }) => {
    const { uiTemplates, fetchUITemplates, purchaseUITemplate, checkOwnership, error } = useUITemplates();
    const { balance, fetchBalance } = useCredits();
    const { showNotification } = useNotification();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [purchaseModalTemplate, setPurchaseModalTemplate] = useState<UITemplate | null>(null);
    const [ownedUITemplateIds, setOwnedUITemplateIds] = useState<Set<string>>(new Set());
    const [activeSection, setActiveSection] = useState<'url' | 'pdf'>('url');
    const [imagePreviewTemplate, setImagePreviewTemplate] = useState<UITemplate | null>(null);
    const urlSectionRef = useRef<HTMLDivElement>(null);
    const pdfSectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchUITemplates();
    }, [fetchUITemplates]);

    useEffect(() => {
        if (isLoggedIn()) {
            fetchBalance();
            checkOwnedUITemplates();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uiTemplates]);

    // 스크롤 위치에 따라 activeSection 갱신
    useEffect(() => {
        const scrollContainer = urlSectionRef.current?.closest('[data-scroll-container]');
        if (!scrollContainer) return;

        const handleScroll = () => {
            const pdfEl = pdfSectionRef.current;
            if (!pdfEl) return;
            const containerRect = scrollContainer.getBoundingClientRect();
            const pdfRect = pdfEl.getBoundingClientRect();
            setActiveSection(pdfRect.top <= containerRect.top + containerRect.height / 2 ? 'pdf' : 'url');
        };

        scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
        return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }, [uiTemplates]);

    const scrollToSection = (section: 'url' | 'pdf') => {
        if (section === 'url') {
            const scrollContainer = urlSectionRef.current?.closest('[data-scroll-container]');
            if (scrollContainer) {
                scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } else {
            pdfSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const checkOwnedUITemplates = async () => {
        if (!isLoggedIn() || uiTemplates.length === 0) return;

        const owned = new Set<string>();
        for (const uiTemplate of uiTemplates) {
            const ownership = await checkOwnership(uiTemplate.id);
            if (ownership?.ownsUiTemplate) {
                owned.add(uiTemplate.id);
            }
        }
        setOwnedUITemplateIds(owned);
    };

    const handleUITemplateSelect = (uiTemplate: UITemplate) => {
        if (!isLoggedIn()) {
            setShowLoginModal(true);
            return;
        }

        setPurchaseModalTemplate(uiTemplate);
    };

    const handlePurchaseModalSuccess = () => {
        if (purchaseModalTemplate) {
            showNotification('템플릿 구매가 완료되었습니다.', 'success');
            fetchBalance();
            setOwnedUITemplateIds(prev => new Set(prev).add(purchaseModalTemplate.id));
            onPurchaseSuccess?.();
        }
        setPurchaseModalTemplate(null);
    };

    const handlePurchaseModalPurchase = async (uiTemplateId: string, planId?: string) => {
        const result = await purchaseUITemplate(uiTemplateId, planId);
        if (!result) {
            throw new Error(error || '템플릿 구매에 실패했습니다.');
        }
    };

    const urlUITemplates = uiTemplates.filter(t => t.type === 'URL');
    const pdfUITemplates = uiTemplates.filter(t => t.type === 'PDF');

    const getTemplateImages = (uiTemplate: UITemplate): UITemplateImage[] => {
        return (uiTemplate.images ?? []).slice().sort((a, b) => a.displayOrder - b.displayOrder);
    };

    const getThumbnailSrc = (uiTemplate: UITemplate): string | undefined => {
        const allImages = getTemplateImages(uiTemplate);
        const thumbnail = allImages.find(img => img.imageType === 'THUMBNAIL');
        return thumbnail?.imageUrl || allImages[0]?.imageUrl || uiTemplate.thumbnailUrl;
    };

    const getDetailImages = (uiTemplate: UITemplate): UITemplateImage[] => {
        const allImages = getTemplateImages(uiTemplate);
        const details = allImages.filter(img => img.imageType === 'DETAIL');
        return details.length > 0 ? details : allImages;
    };

    const handleImagePreviewOpen = (uiTemplate: UITemplate) => {
        const images = getTemplateImages(uiTemplate);
        if (images.length > 0) {
            setImagePreviewTemplate(uiTemplate);
        }
    };

    const renderTemplateListItem = (uiTemplate: UITemplate) => {
        const lowestPlan = uiTemplate.plans?.slice().sort((a, b) => a.price - b.price)[0];
        const firstImageSrc = getThumbnailSrc(uiTemplate);
        const hasImages = (uiTemplate.images?.length ?? 0) > 0;
        const previewPath = getPreviewPathFromUITemplate(uiTemplate);

        return (
            <div
                key={uiTemplate.id}
                onClick={() => {
                    if (previewPath) {
                        window.open(`/templates/preview/${previewPath}`, '_blank', 'noopener,noreferrer');
                    } else if (hasImages) {
                        handleImagePreviewOpen(uiTemplate);
                    }
                }}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '16px',
                    borderRadius: '10px',
                    border: '1px solid #e8e8e8',
                    backgroundColor: '#fff',
                    transition: 'all 0.15s ease',
                    cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#d0d0d0';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e8e8e8';
                    e.currentTarget.style.boxShadow = 'none';
                }}
            >
                {/* 썸네일 */}
                <div
                    style={{
                        width: '80px',
                        height: '100px',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        flexShrink: 0,
                        position: 'relative',
                        backgroundColor: '#f0f0f0',
                    }}
                >
                    {firstImageSrc ? (
                        <Image
                            src={firstImageSrc}
                            alt={uiTemplate.name}
                            fill
                            style={{ objectFit: 'cover', objectPosition: 'top' }}
                        />
                    ) : (
                        <div style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'linear-gradient(145deg, #f0f0f0, #f8f8f8)',
                            padding: '8px',
                        }}>
                            <span style={{
                                fontSize: '11px',
                                fontWeight: 600,
                                color: '#888',
                                textAlign: 'center',
                                lineHeight: '1.3',
                                wordBreak: 'keep-all',
                            }}>
                                {uiTemplate.name}
                            </span>
                        </div>
                    )}
                    {/* 이미지 개수 배지 */}
                    {hasImages && (uiTemplate.images!.length > 1) && (
                        <span style={{
                            position: 'absolute',
                            bottom: '4px',
                            right: '4px',
                            backgroundColor: 'rgba(0,0,0,0.6)',
                            color: '#fff',
                            fontSize: '10px',
                            fontWeight: 600,
                            padding: '1px 5px',
                            borderRadius: '3px',
                            lineHeight: '1.4',
                        }}>
                            +{uiTemplate.images!.length - 1}
                        </span>
                    )}
                </div>

                {/* 정보 */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        {uiTemplate.label && (
                            <span style={{
                                backgroundColor: MAIN_COLOR_LIGHT,
                                color: '#B8860B',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontSize: '11px',
                                fontWeight: 600,
                            }}>
                                {uiTemplate.label}
                            </span>
                        )}
                    </div>
                    <p style={{
                        fontSize: '15px',
                        fontWeight: 600,
                        color: '#222',
                        margin: '0 0 4px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}>
                        {uiTemplate.name}
                    </p>
                    {uiTemplate.description && (
                        <p style={{
                            fontSize: '13px',
                            color: '#888',
                            margin: 0,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}>
                            {uiTemplate.description}
                        </p>
                    )}
                </div>

                {/* 액션 */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    flexShrink: 0,
                }}>
                    {lowestPlan && (
                        <p style={{
                            fontSize: '13px',
                            fontWeight: 700,
                            color: '#333',
                            margin: 0,
                            whiteSpace: 'nowrap',
                        }}>
                            {lowestPlan.price.toLocaleString()} 크레딧
                        </p>
                    )}
                    <button
                        onClick={(e) => { e.stopPropagation(); handleUITemplateSelect(uiTemplate); }}
                        style={{
                            padding: '6px 12px',
                            backgroundColor: MAIN_COLOR,
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        구매하기
                    </button>
                </div>
            </div>
        );
    };

    return (
        <>
            <article>
                {/* UI 템플릿 섹션 */}
                <div ref={urlSectionRef} className="cont-box" id="url-templates">
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '16px',
                        paddingBottom: '12px',
                        borderBottom: '2px solid #e0e0e0',
                    }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
                            UI 템플릿
                        </h3>
                        <span style={{ fontSize: '13px', color: '#999', marginLeft: '4px' }}>
                            URL 공유시 사용할 수 있는 템플릿
                        </span>
                    </div>
                    {urlUITemplates.length === 0 ? (
                        <p style={{ color: '#999', fontSize: '14px', margin: 0, textAlign: 'center', padding: '24px 0' }}>등록된 UI 템플릿이 없습니다.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {urlUITemplates.map(renderTemplateListItem)}
                        </div>
                    )}
                </div>

                {/* PDF 템플릿 섹션 */}
                <div ref={pdfSectionRef} className="cont-box" id="pdf-templates">
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '16px',
                        paddingBottom: '12px',
                        borderBottom: '2px solid #e0e0e0',
                    }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
                            PDF 템플릿
                        </h3>
                        <span style={{ fontSize: '13px', color: '#999', marginLeft: '4px' }}>
                            이력서를 PDF로 다운로드할 때 사용할 수 있는 템플릿
                        </span>
                    </div>
                    {pdfUITemplates.length === 0 ? (
                        <p style={{ color: '#999', fontSize: '14px', margin: 0, textAlign: 'center', padding: '24px 0' }}>등록된 PDF 템플릿이 없습니다.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {pdfUITemplates.map(renderTemplateListItem)}
                        </div>
                    )}
                </div>
            </article>

            <FloatingNavigation
                navigationItems={[
                    {
                        id: 'url-templates',
                        label: 'UI 템플릿',
                        isActive: activeSection === 'url',
                        onClick: () => scrollToSection('url'),
                    },
                    {
                        id: 'pdf-templates',
                        label: 'PDF 템플릿',
                        isActive: activeSection === 'pdf',
                        onClick: () => scrollToSection('pdf'),
                    },
                ]}
            />

            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
            />
            <TemplatePurchaseModal
                isOpen={!!purchaseModalTemplate}
                onClose={() => setPurchaseModalTemplate(null)}
                template={purchaseModalTemplate}
                balance={balance}
                isOwned={purchaseModalTemplate ? ownedUITemplateIds.has(purchaseModalTemplate.id) : false}
                onPurchase={handlePurchaseModalPurchase}
                onSuccess={handlePurchaseModalSuccess}
            />
            {imagePreviewTemplate && (
                <TemplateImagePreviewModal
                    images={getDetailImages(imagePreviewTemplate)}
                    templateName={imagePreviewTemplate.name}
                    onClose={() => setImagePreviewTemplate(null)}
                />
            )}
        </>
    );
};

/* 이미지 미리보기 모달 - 세로 스크롤 방식 */
export function TemplateImagePreviewModal({
    images,
    templateName,
    onClose,
}: {
    images: UITemplateImage[];
    templateName: string;
    onClose: () => void;
}) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [onClose]);

    if (images.length === 0) return null;

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                backgroundColor: 'rgba(0,0,0,0.85)',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* 상단 헤더 - 고정 */}
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '16px 56px',
                    position: 'relative',
                }}
            >
                <p style={{ color: '#fff', fontSize: '14px', fontWeight: 600, margin: 0 }}>
                    {templateName}
                </p>
                {/* 닫기 버튼 */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '12px',
                        right: '16px',
                        background: 'rgba(255,255,255,0.15)',
                        border: 'none',
                        color: '#fff',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 0,
                    }}
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 4L4 12M4 4L12 12" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>
            </div>

            {/* 세로 스크롤 이미지 영역 */}
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    flex: 1,
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '0 16px 32px',
                    WebkitOverflowScrolling: 'touch',
                }}
            >
                <div style={{
                    width: '100%',
                    maxWidth: '600px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                }}>
                    {images.map((img, idx) => (
                        <img
                            key={img.id}
                            src={img.imageUrl}
                            alt={`${templateName} ${idx + 1}`}
                            style={{
                                width: '100%',
                                height: 'auto',
                                display: 'block',
                                borderRadius: idx === 0 ? '8px 8px 0 0' : idx === images.length - 1 ? '0 0 8px 8px' : '0',
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default UITemplateList;
