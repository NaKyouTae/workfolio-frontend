import React from 'react';

interface SidebarListSkeletonProps {
  count?: number; // 스켈레톤 아이템 개수 (기본값: 3)
}

/**
 * 사이드바 리스트용 공통 스켈레톤 UI
 * 가로 줄 3개가 있는 스켈레톤 컴포넌트
 */
const SidebarListSkeleton: React.FC<SidebarListSkeletonProps> = ({ count = 3 }) => {
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
      {Array.from({ length: count }).map((_, index) => (
        <li key={`skeleton-${index}`}>
          <p 
            className="skeleton-item"
            style={{
              height: '1.8rem',
              width: '100%',
              margin: 0,
            }}
          />
        </li>
      ))}
    </>
  );
};

export default SidebarListSkeleton;

