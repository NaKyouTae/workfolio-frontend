import React from 'react';

interface RecordGroupsSkeletonProps {
    count?: number; // 스켈레톤 아이템 개수 (기본값: 3)
}

const RecordGroupsSkeleton: React.FC<RecordGroupsSkeletonProps> = ({ count = 3 }) => {
    return (
        <>
            <style jsx>{`
                @keyframes skeleton-pulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.4;
                    }
                }
                .skeleton-item {
                    animation: skeleton-pulse 1.5s ease-in-out infinite;
                }
            `}</style>
            {Array.from({ length: count }).map((_, index) => (
                <li key={`skeleton-${index}`}>
                    <div className="info">
                        {/* 체크박스 스켈레톤 */}
                        <div 
                            className="skeleton-item"
                            style={{
                                width: '16px',
                                height: '16px',
                                borderRadius: '3px',
                                backgroundColor: '#e0e0e0',
                                flexShrink: 0,
                                display: 'inline-block',
                            }}
                        />
                        {/* label 스켈레톤 (색상 인디케이터 + 텍스트) */}
                        <div 
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                width: '80%',
                                flex: 1,
                                marginLeft: '8px',
                            }}
                        >
                            {/* 텍스트 스켈레톤 */}
                            <div
                                className="skeleton-item"
                                style={{
                                    width: '100%',
                                    height: '16px',
                                    backgroundColor: '#e0e0e0',
                                    borderRadius: '4px',
                                }}
                            />
                        </div>
                    </div>
                    <div className="more">
                        {/* 더보기 버튼 스켈레톤 */}
                        <div
                            className="skeleton-item"
                            style={{
                                width: '12px',
                                height: '18px',
                                borderRadius: '4px',
                                backgroundColor: '#e0e0e0',
                            }}
                        />
                    </div>
                </li>
            ))}
        </>
    );
};

export default RecordGroupsSkeleton;

