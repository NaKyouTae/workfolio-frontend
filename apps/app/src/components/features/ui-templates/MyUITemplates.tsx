"use client";

import React, { useEffect, useState } from 'react';
import { useUITemplates } from '@/hooks/useUITemplates';
import { WorkerUITemplate, getUITemplateTypeLabel, getRemainingDays } from '@workfolio/shared/types/uitemplate';
import Pagination from '@workfolio/shared/ui/Pagination';

interface MyUITemplatesProps {
    onOpenUITemplateStore?: () => void;
}

const MyUITemplates: React.FC<MyUITemplatesProps> = ({ onOpenUITemplateStore }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { myUITemplates, fetchMyUITemplates, totalPages, currentPage, totalElements, loading, error } = useUITemplates();
    const [page, setPage] = useState(0);

    useEffect(() => {
        fetchMyUITemplates(page);
    }, [fetchMyUITemplates, page]);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getStatusBadge = (workerUITemplate: WorkerUITemplate) => {
        if (!workerUITemplate.isActive) {
            return { label: '비활성', color: '#9e9e9e', bgColor: '#f5f5f5' };
        }
        if (workerUITemplate.isExpired) {
            return { label: '만료됨', color: '#f44336', bgColor: '#ffebee' };
        }
        const remaining = getRemainingDays(workerUITemplate.expiredAt);
        if (remaining <= 7) {
            return { label: `${remaining}일 남음`, color: '#ff9800', bgColor: '#fff3e0' };
        }
        return { label: '사용 가능', color: '#4caf50', bgColor: '#e8f5e9' };
    };

    return (
        <div className="my-ui-templates">
            <div className="cont-box">
                <div className="cont-tit">
                    <div>
                        <h3>보유 템플릿</h3>
                        <p>구매한 템플릿 목록입니다.</p>
                    </div>
                    {onOpenUITemplateStore && (
                        <button className="sm" onClick={onOpenUITemplateStore}>
                            템플릿 구매하기
                        </button>
                    )}
                </div>

                {loading && <p style={{ padding: '20px', textAlign: 'center' }}>로딩 중...</p>}
                {error && <p style={{ padding: '20px', textAlign: 'center', color: 'red' }}>{error}</p>}

                {!loading && myUITemplates.length === 0 && (
                    <div style={{ padding: '40px 20px', textAlign: 'center', color: '#999' }}>
                        <p>보유한 템플릿이 없습니다.</p>
                        {onOpenUITemplateStore && (
                            <button
                                className="sm"
                                onClick={onOpenUITemplateStore}
                                style={{ marginTop: '16px' }}
                            >
                                템플릿 둘러보기
                            </button>
                        )}
                    </div>
                )}

                {!loading && myUITemplates.length > 0 && (
                    <>
                        <ul className="setting-list" style={{ marginTop: '16px' }}>
                            {myUITemplates.map((workerUITemplate) => {
                                const status = getStatusBadge(workerUITemplate);
                                return (
                                    <li
                                        key={workerUITemplate.id}
                                        style={{
                                            padding: '16px',
                                            borderBottom: '1px solid #eee',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                                <span
                                                    style={{
                                                        backgroundColor: workerUITemplate.uiTemplate.type === 'URL' ? '#e3f2fd' : '#fce4ec',
                                                        color: workerUITemplate.uiTemplate.type === 'URL' ? '#1976d2' : '#c2185b',
                                                        padding: '4px 8px',
                                                        borderRadius: '4px',
                                                        fontSize: '12px',
                                                    }}
                                                >
                                                    {getUITemplateTypeLabel(workerUITemplate.uiTemplate.type)}
                                                </span>
                                                <span
                                                    style={{
                                                        backgroundColor: status.bgColor,
                                                        color: status.color,
                                                        padding: '4px 8px',
                                                        borderRadius: '4px',
                                                        fontSize: '12px',
                                                    }}
                                                >
                                                    {status.label}
                                                </span>
                                            </div>
                                            <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>
                                                {workerUITemplate.uiTemplate.name}
                                            </h4>
                                            <p style={{ fontSize: '14px', color: '#666' }}>
                                                구매일: {formatDate(workerUITemplate.purchasedAt)} | 만료일: {formatDate(workerUITemplate.expiredAt)}
                                            </p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ fontSize: '14px', color: '#999' }}>
                                                {workerUITemplate.creditsUsed.toLocaleString()} 크레딧
                                            </p>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>

                        {totalPages > 1 && (
                            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
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
            </div>
        </div>
    );
};

export default MyUITemplates;
