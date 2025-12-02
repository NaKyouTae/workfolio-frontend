import React from 'react';

interface StatsSummarySkeletonProps {
  count?: number; // 스켈레톤 아이템 개수 (기본값: 3)
}

/**
 * 통계 Summary용 공통 스켈레톤 UI
 * 정사각형 형태의 스켈레톤 카드
 */
const StatsSummarySkeleton: React.FC<StatsSummarySkeletonProps> = ({ count = 3 }) => {
  return (
    <>
      <style jsx>{`
        @keyframes skeleton-loading {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
        .skeleton-item {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: skeleton-loading 1.5s ease-in-out infinite;
          border-radius: 4px;
        }
      `}</style>
      <ul className="stats-summary">
        {Array.from({ length: count }).map((_, index) => (
          <li key={`skeleton-${index}`}>
            {/* 라벨 스켈레톤 */}
            <p 
              className="skeleton-item"
              style={{
                height: '1.8rem',
                width: '8rem',
                margin: 0,
              }}
            />
            {/* 값 스켈레톤 */}
            <div>
              <div 
                className="skeleton-item"
                style={{
                  height: '1.8rem',
                  width: '6rem',
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default StatsSummarySkeleton;

