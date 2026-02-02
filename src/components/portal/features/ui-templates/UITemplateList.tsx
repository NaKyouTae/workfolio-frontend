"use client";

import React, { useEffect, useState } from 'react';
import { useUITemplates } from '@/hooks/useUITemplates';
import { UITemplate, formatDuration } from '@/types/uitemplate';
import { useCredits } from '@/hooks/useCredits';
import { isLoggedIn } from '@/utils/authUtils';
import LoginModal from '@/components/portal/ui/LoginModal';
import { useNotification } from '@/hooks/useNotification';
import { useConfirm } from '@/hooks/useConfirm';
import UITemplateCard from './UITemplateCard';
import { getPreviewPathFromUITemplate } from '@/components/portal/features/public-resume/templates/resumeTemplateConfig';

interface UITemplateListProps {
    onPurchaseSuccess?: () => void;
}

const UITemplateList: React.FC<UITemplateListProps> = ({ onPurchaseSuccess }) => {
    const { uiTemplates, fetchUITemplates, purchaseUITemplate, checkOwnership, loading, error } = useUITemplates();
    const { balance, fetchBalance } = useCredits();
    const { showNotification } = useNotification();
    const { confirm } = useConfirm();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [selectedUITemplate, setSelectedUITemplate] = useState<UITemplate | null>(null);
    const [ownedUITemplateIds, setOwnedUITemplateIds] = useState<Set<string>>(new Set());


    useEffect(() => {
        fetchUITemplates();
    }, [fetchUITemplates]);

    useEffect(() => {
        if (isLoggedIn()) {
            fetchBalance();
            checkOwnedUITemplates();
        }
    }, [uiTemplates]);

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

    const handleUITemplateSelect = async (uiTemplate: UITemplate) => {
        if (!isLoggedIn()) {
            setSelectedUITemplate(uiTemplate);
            setShowLoginModal(true);
            return;
        }

        if (ownedUITemplateIds.has(uiTemplate.id)) {
            showNotification('이미 보유한 템플릿입니다.', 'info');
            return;
        }

        const result = await confirm({
            icon: '/assets/img/ico/ic-info.svg',
            title: `${uiTemplate.name} 템플릿을 구매하시겠어요?`,
            description: `${uiTemplate.price.toLocaleString()} 크레딧이 차감됩니다. (현재 잔액: ${balance.toLocaleString()} 크레딧)\n이용 기간: ${formatDuration(uiTemplate.durationDays)}`,
            confirmText: '구매하기',
            cancelText: '취소',
        });

        if (result) {
            if (balance < uiTemplate.price) {
                showNotification('크레딧이 부족합니다. 크레딧을 충전해주세요.', 'error');
                return;
            }

            const purchaseResult = await purchaseUITemplate(uiTemplate.id);
            if (purchaseResult) {
                showNotification('템플릿 구매가 완료되었습니다.', 'success');
                fetchBalance();
                setOwnedUITemplateIds(prev => new Set(prev).add(uiTemplate.id));
                onPurchaseSuccess?.();
            } else {
                showNotification(error || '템플릿 구매에 실패했습니다.', 'error');
            }
        }
    };

    const handleLoginSuccess = () => {
        setShowLoginModal(false);
        fetchBalance();
        checkOwnedUITemplates();
        if (selectedUITemplate) {
            handleUITemplateSelect(selectedUITemplate);
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

    const sectionStyle: React.CSSProperties = {
        marginBottom: '48px',
        position: 'relative',
    };

    const sectionHeaderStyle: React.CSSProperties = {
        marginBottom: '16px',
    };

    const cardGridStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
    };

    return (
        <div className="ui-template-list" style={{ width: '100%' }}>
            {loading && <p style={{ textAlign: 'center', padding: '40px 0' }}>로딩 중...</p>}
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

            {!loading && uiTemplates.length === 0 && (
                <p style={{ textAlign: 'center', color: '#999', padding: '40px 0' }}>
                    등록된 템플릿이 없습니다.
                </p>
            )}

            {/* URL Templates Section - 항상 표시 (플로팅 네비 스크롤용 id) */}
            <div id="section-url" style={sectionStyle}>
                <div style={sectionHeaderStyle}>
                    <h3 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                            backgroundColor: '#e3f2fd',
                            color: '#1976d2',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: '600'
                        }}>
                            URL
                        </span>
                        URL 템플릿
                    </h3>
                    <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
                        공개 이력서 URL 공유시 사용할 수 있는 템플릿입니다.
                    </p>
                </div>
                {urlUITemplates.length === 0 ? (
                    <p style={{ color: '#999', fontSize: '14px', margin: 0 }}>등록된 URL 템플릿이 없습니다.</p>
                ) : (
                    <div style={cardGridStyle}>
                        {urlUITemplates.map((uiTemplate) => (
                            <UITemplateCard
                                key={uiTemplate.id}
                                uiTemplate={uiTemplate}
                                onSelect={handleUITemplateSelect}
                                onPreview={handleTemplatePreview}
                                isOwned={ownedUITemplateIds.has(uiTemplate.id)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* PDF Templates Section - 항상 표시 (플로팅 네비 스크롤용 id) */}
            <div id="section-pdf" style={sectionStyle}>
                <div style={sectionHeaderStyle}>
                    <h3 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                            backgroundColor: '#fce4ec',
                            color: '#c2185b',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: '600'
                        }}>
                            PDF
                        </span>
                        PDF 템플릿
                    </h3>
                    <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
                        이력서를 PDF로 다운로드할 때 사용할 수 있는 템플릿입니다.
                    </p>
                </div>
                {pdfUITemplates.length === 0 ? (
                    <p style={{ color: '#999', fontSize: '14px', margin: 0 }}>등록된 PDF 템플릿이 없습니다.</p>
                ) : (
                    <div style={cardGridStyle}>
                        {pdfUITemplates.map((uiTemplate) => (
                            <UITemplateCard
                                key={uiTemplate.id}
                                uiTemplate={uiTemplate}
                                onSelect={handleUITemplateSelect}
                                onPreview={handleTemplatePreview}
                                isOwned={ownedUITemplateIds.has(uiTemplate.id)}
                            />
                        ))}
                    </div>
                )}
            </div>

            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
            />
        </div>
    );
};

export default UITemplateList;
