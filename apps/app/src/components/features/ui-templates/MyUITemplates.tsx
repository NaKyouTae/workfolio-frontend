"use client";

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { useUITemplates } from '@/hooks/useUITemplates';
import { WorkerUITemplate, UITemplate, UITemplateImage, getRemainingDays, formatDuration } from '@workfolio/shared/types/uitemplate';
import Pagination from '@workfolio/shared/ui/Pagination';
import { useNotification } from '@workfolio/shared/hooks/useNotification';
import { useConfirm } from '@workfolio/shared/hooks/useConfirm';
import { getPreviewPathFromUITemplate } from '@/components/features/public-resume/templates/resumeTemplateConfig';
import { TemplateImagePreviewModal } from './UITemplateList';
import EmptyState from '@workfolio/shared/ui/EmptyState';


const MAIN_COLOR = '#FFBB26';

interface MyUITemplatesProps {
    onOpenUITemplateStore?: () => void;
}

const MyUITemplates: React.FC<MyUITemplatesProps> = () => {
    const { myUITemplates, fetchMyUITemplates, deleteMyUITemplate, totalPages, currentPage, loading, error } = useUITemplates();
    const { showNotification } = useNotification();
    const { confirm } = useConfirm();
    const [page, setPage] = useState(0);
    const [defaultUrlTemplate, setDefaultUrlTemplate] = useState<UITemplate | null>(null);
    const [defaultPdfTemplate, setDefaultPdfTemplate] = useState<UITemplate | null>(null);
    const [imagePreviewTemplate, setImagePreviewTemplate] = useState<UITemplate | null>(null);
    const [, setImagePreviewIndex] = useState(0);

    const fetchDefaultTemplates = useCallback(async () => {
        try {
            const response = await fetch('/api/ui-templates/my/default');
            if (response.ok) {
                const data = await response.json();
                setDefaultUrlTemplate(data.defaultUrlUiTemplate ?? data.default_url_ui_template ?? null);
                setDefaultPdfTemplate(data.defaultPdfUiTemplate ?? data.default_pdf_ui_template ?? null);
            }
        } catch (err) {
            console.error('Error fetching default templates:', err);
        }
    }, []);

    useEffect(() => {
        fetchMyUITemplates(page);
        fetchDefaultTemplates();
    }, [fetchMyUITemplates, fetchDefaultTemplates, page]);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleSetDefault = async (workerUITemplate: WorkerUITemplate) => {
        if (!workerUITemplate.isValid) {
            showNotification('만료되었거나 비활성화된 템플릿은 기본 설정할 수 없습니다.', 'error');
            return;
        }
        try {
            const response = await fetch(`/api/ui-templates/my/default/${workerUITemplate.uiTemplate.id}`, {
                method: 'PUT',
            });
            if (response.ok) {
                const data = await response.json();
                setDefaultUrlTemplate(data.defaultUrlUiTemplate ?? data.default_url_ui_template ?? null);
                setDefaultPdfTemplate(data.defaultPdfUiTemplate ?? data.default_pdf_ui_template ?? null);
                const typeLabel = workerUITemplate.uiTemplate.type === 'URL' || workerUITemplate.uiTemplate.type === 1 ? 'URL' : 'PDF';
                showNotification(`기본 ${typeLabel} 템플릿으로 설정되었습니다.`, 'success');
            } else {
                const errorData = await response.json();
                showNotification(errorData.message || '기본 템플릿 설정에 실패했습니다.', 'error');
            }
        } catch (err) {
            console.error('Error setting default template:', err);
            showNotification('기본 템플릿 설정 중 오류가 발생했습니다.', 'error');
        }
    };

    const handleDelete = async (workerUITemplate: WorkerUITemplate) => {
        const confirmed = await confirm({
            title: '템플릿 삭제',
            icon: '/assets/img/ico/ic-warning.svg',
            description: '삭제된 템플릿은 복원할 수 없으며, 다시 사용하려면 재구매해야 합니다.\n정말 삭제하시겠습니까?',
            confirmText: '삭제하기',
            cancelText: '취소',
        });

        if (!confirmed) return;

        const success = await deleteMyUITemplate(workerUITemplate.id);
        if (success) {
            showNotification('템플릿이 삭제되었습니다.', 'success');
            await fetchMyUITemplates(page);
            await fetchDefaultTemplates();
        } else {
            showNotification('템플릿 삭제에 실패했습니다. 다시 시도해주세요.', 'error');
        }
    };

    const isDefaultTemplate = (uiTemplate: UITemplate): boolean => {
        if (defaultUrlTemplate && defaultUrlTemplate.id === uiTemplate.id) return true;
        if (defaultPdfTemplate && defaultPdfTemplate.id === uiTemplate.id) return true;
        return false;
    };

    const getStatusInfo = (workerUITemplate: WorkerUITemplate) => {
        if (workerUITemplate.status === 'DELETED') {
            return { label: '삭제됨', color: '#9e9e9e' };
        }
        if (workerUITemplate.isExpired) {
            return { label: '만료됨', color: '#f44336' };
        }
        const remaining = getRemainingDays(workerUITemplate.expiredAt);
        if (remaining <= 7) {
            return { label: `${remaining}일 남음`, color: '#ff9800' };
        }
        return { label: '사용 가능', color: '#4caf50' };
    };

    const { urlTemplates, pdfTemplates } = useMemo(() => {
        const url: WorkerUITemplate[] = [];
        const pdf: WorkerUITemplate[] = [];
        myUITemplates.forEach((wt) => {
            const type = wt.uiTemplate.type;
            if (type === 'PDF' || type === 2) {
                pdf.push(wt);
            } else {
                url.push(wt);
            }
        });
        return { urlTemplates: url, pdfTemplates: pdf };
    }, [myUITemplates]);

    const getTemplateImages = (uiTemplate: UITemplate): UITemplateImage[] => {
        return (uiTemplate.images ?? []).slice().sort((a, b) => a.displayOrder - b.displayOrder);
    };

    const getFirstImageSrc = (uiTemplate: UITemplate): string | undefined => {
        const allImages = getTemplateImages(uiTemplate);
        const thumbnail = allImages.find(img => img.imageType === 'THUMBNAIL');
        return thumbnail?.imageUrl || allImages[0]?.imageUrl || uiTemplate.thumbnailUrl;
    };

    const handleImagePreviewOpen = (uiTemplate: UITemplate) => {
        const images = getTemplateImages(uiTemplate);
        if (images.length > 0) {
            setImagePreviewTemplate(uiTemplate);
            setImagePreviewIndex(0);
        }
    };

    const handleTemplatePreview = (uiTemplate: UITemplate) => {
        const images = getTemplateImages(uiTemplate);
        if (images.length > 0) {
            setImagePreviewTemplate(uiTemplate);
            setImagePreviewIndex(0);
            return;
        }
        const path = getPreviewPathFromUITemplate(uiTemplate);
        if (path) {
            window.open(`/templates/preview/${path}`, '_blank', 'noopener,noreferrer');
        }
    };

    const renderTemplateListItem = (workerUITemplate: WorkerUITemplate) => {
        const status = getStatusInfo(workerUITemplate);
        const isDefault = isDefaultTemplate(workerUITemplate.uiTemplate);
        const isExpiredOrInactive = !workerUITemplate.isValid;
        const uiTemplate = workerUITemplate.uiTemplate;
        const firstImageSrc = getFirstImageSrc(uiTemplate);
        const hasImages = (uiTemplate.images?.length ?? 0) > 0;

        return (
            <div
                key={workerUITemplate.id}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '16px',
                    borderRadius: '10px',
                    border: '1px solid #e8e8e8',
                    backgroundColor: '#fff',
                    transition: 'all 0.15s ease',
                    opacity: isExpiredOrInactive ? 0.5 : 1,
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
                    onClick={hasImages ? () => handleImagePreviewOpen(uiTemplate) : undefined}
                    style={{
                        width: '80px',
                        height: '100px',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        flexShrink: 0,
                        position: 'relative',
                        backgroundColor: '#f0f0f0',
                        cursor: hasImages ? 'pointer' : 'default',
                    }}
                >
                    {firstImageSrc ? (
                        <Image
                            src={firstImageSrc}
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
                        {isDefault && (
                            <span style={{
                                backgroundColor: '#FFF8E6',
                                color: '#B8860B',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontSize: '11px',
                                fontWeight: 700,
                            }}>
                                사용 중
                            </span>
                        )}
                        {!(isDefault && status.label === '사용 가능') && (
                            <span style={{
                                backgroundColor: status.color === '#4caf50' ? '#e8f5e9' : status.color === '#f44336' ? '#ffebee' : status.color === '#ff9800' ? '#fff3e0' : '#f5f5f5',
                                color: status.color,
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontSize: '11px',
                                fontWeight: 600,
                            }}>
                                {status.label}
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
                    {/* 보유 기간 */}
                    <p style={{
                        fontSize: '12px',
                        color: workerUITemplate.isExpired ? '#f44336' : '#666',
                        margin: '4px 0 0',
                    }}>
                        {(() => {
                            const purchasedDate = new Date(workerUITemplate.purchasedAt);
                            const expiredDate = new Date(workerUITemplate.expiredAt);
                            const fmt = (d: Date) => `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
                            const remaining = getRemainingDays(workerUITemplate.expiredAt);
                            const periodText = `${fmt(purchasedDate)} ~ ${fmt(expiredDate)}`;
                            if (workerUITemplate.isExpired) {
                                return `${periodText} (만료)`;
                            }
                            return `${periodText} (${formatDuration(remaining)} 남음)`;
                        })()}
                    </p>
                </div>

                {/* 액션 */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    flexShrink: 0,
                }}>
                    {(hasImages || getPreviewPathFromUITemplate(uiTemplate)) && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleTemplatePreview(uiTemplate);
                            }}
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
                            }}
                        >
                            미리보기
                        </button>
                    )}
                    {isDefault ? (
                        <button
                            disabled
                            style={{
                                padding: '8px 14px',
                                backgroundColor: '#e0e0e0',
                                color: '#999',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: 600,
                                cursor: 'default',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            사용 중
                        </button>
                    ) : workerUITemplate.isValid ? (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleSetDefault(workerUITemplate);
                            }}
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
                            }}
                        >
                            기본 설정
                        </button>
                    ) : null}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(workerUITemplate);
                        }}
                        style={{
                            padding: '8px 14px',
                            backgroundColor: '#fff',
                            color: '#f44336',
                            border: '1px solid #f44336',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        삭제
                    </button>
                </div>
            </div>
        );
    };

    const isEmpty = !loading && myUITemplates.length === 0;

    return (
        <>
            {/* 메인 컨텐츠 */}
            {isEmpty ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <EmptyState text="보유한 템플릿이 없습니다." noBorder centerVertically />
                </div>
            ) : (
                <article style={{ paddingBottom: '10px' }}>
                    {/* 기본 설정 템플릿 요약 */}
                    <div className="cont-box">
                        <div className="cont-tit">
                            <div>
                                <h3>기본 설정 템플릿</h3>
                            </div>
                        </div>
                        <ul className="stats-summary">
                            <li>
                                <p>UI 템플릿</p>
                                <div>{defaultUrlTemplate?.name || '미설정'}</div>
                            </li>
                            <li>
                                <p>PDF 템플릿</p>
                                <div>{defaultPdfTemplate?.name || '미설정'}</div>
                            </li>
                        </ul>
                    </div>

                    {/* loading && <p style={{ textAlign: 'center', padding: '40px 0' }}>로딩 중...</p> */}
                    {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

                    {!loading && myUITemplates.length > 0 && (
                        <>
                            {/* UI 템플릿 섹션 */}
                            <div style={{ marginTop: '24px', marginBottom: '40px' }}>
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
                                {urlTemplates.length === 0 ? (
                                    <EmptyState text="보유한 UI 템플릿이 없습니다." noBorder />
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {urlTemplates.map(renderTemplateListItem)}
                                    </div>
                                )}
                            </div>

                            {/* PDF 템플릿 섹션 */}
                            <div>
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
                                {pdfTemplates.length === 0 ? (
                                    <EmptyState text="보유한 PDF 템플릿이 없습니다." noBorder />
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {pdfTemplates.map(renderTemplateListItem)}
                                    </div>
                                )}
                            </div>

                            {totalPages > 1 && (
                                <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center' }}>
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        itemsPerPage={10}
                                        onPageChange={handlePageChange}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </article>
            )}

            {imagePreviewTemplate && (
                <TemplateImagePreviewModal
                    images={getTemplateImages(imagePreviewTemplate)}
                    templateName={imagePreviewTemplate.name}
                    onClose={() => setImagePreviewTemplate(null)}
                />
            )}
        </>
    );
};

export default MyUITemplates;
