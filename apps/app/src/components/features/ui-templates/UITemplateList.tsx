"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useUITemplates } from '@/hooks/useUITemplates';
import { UITemplate, formatDuration } from '@workfolio/shared/types/uitemplate';
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
    const { uiTemplates, fetchUITemplates, purchaseUITemplate, checkOwnership, loading, error } = useUITemplates();
    const { balance, fetchBalance } = useCredits();
    const { showNotification } = useNotification();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [purchaseModalTemplate, setPurchaseModalTemplate] = useState<UITemplate | null>(null);
    const [ownedUITemplateIds, setOwnedUITemplateIds] = useState<Set<string>>(new Set());
    const [activeSection, setActiveSection] = useState<'url' | 'pdf'>('url');
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

    const handleTemplatePreview = (uiTemplate: UITemplate) => {
        const path = getPreviewPathFromUITemplate(uiTemplate);
        if (path) {
            window.open(`/templates/preview/${path}`, '_blank', 'noopener,noreferrer');
        }
    };

    const urlUITemplates = uiTemplates.filter(t => t.type === 'URL');
    const pdfUITemplates = uiTemplates.filter(t => t.type === 'PDF');

    const renderTemplateListItem = (uiTemplate: UITemplate) => {
        const previewPath = getPreviewPathFromUITemplate(uiTemplate);
        const lowestPlan = uiTemplate.plans?.slice().sort((a, b) => a.price - b.price)[0];
        const displayPrice = lowestPlan ? lowestPlan.price : uiTemplate.price;

        return (
            <div
                key={uiTemplate.id}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '16px',
                    borderRadius: '10px',
                    border: '1px solid #e8e8e8',
                    backgroundColor: '#fff',
                    transition: 'all 0.15s ease',
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
                <div style={{
                    width: '80px',
                    height: '100px',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    flexShrink: 0,
                    position: 'relative',
                    backgroundColor: '#f0f0f0',
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
                </div>

                {/* 정보 */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <span style={{
                            backgroundColor: MAIN_COLOR_LIGHT,
                            color: '#B8860B',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 600,
                        }}>
                            {uiTemplate.label ?? uiTemplate.type}
                        </span>
                        {uiTemplate.isPopular && (
                            <span style={{
                                backgroundColor: MAIN_COLOR_LIGHT,
                                color: MAIN_COLOR,
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontSize: '11px',
                                fontWeight: 700,
                            }}>
                                인기
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

                {/* 가격 + 액션 */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    flexShrink: 0,
                }}>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{
                            fontSize: '15px',
                            fontWeight: 700,
                            color: '#333',
                            margin: 0,
                        }}>
                            {displayPrice.toLocaleString()} 크레딧
                        </p>
                        {lowestPlan && uiTemplate.plans && uiTemplate.plans.length > 1 && (
                            <p style={{ fontSize: '11px', color: '#999', margin: '2px 0 0' }}>
                                {formatDuration(lowestPlan.durationDays)}~
                            </p>
                        )}
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                        {previewPath && (
                            <button
                                onClick={(e) => { e.stopPropagation(); handleTemplatePreview(uiTemplate); }}
                                style={{
                                    padding: '8px 14px',
                                    backgroundColor: '#f5f5f5',
                                    color: '#333',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '6px',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    transition: 'all 0.15s ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#e8e8e8';
                                    e.currentTarget.style.borderColor = '#ccc';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f5f5f5';
                                    e.currentTarget.style.borderColor = '#e0e0e0';
                                }}
                            >
                                미리보기
                            </button>
                        )}
                        <button
                            onClick={(e) => { e.stopPropagation(); handleUITemplateSelect(uiTemplate); }}
                            style={{
                                padding: '8px 14px',
                                backgroundColor: MAIN_COLOR,
                                color: '#fff',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.15s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#E5A820';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = MAIN_COLOR;
                            }}
                        >
                            구매하기
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <article>
                {!loading && uiTemplates.length === 0 && (
                    <p style={{ textAlign: 'center', color: '#999', padding: '40px 0' }}>
                        등록된 템플릿이 없습니다.
                    </p>
                )}

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
        </>
    );
};

export default UITemplateList;
