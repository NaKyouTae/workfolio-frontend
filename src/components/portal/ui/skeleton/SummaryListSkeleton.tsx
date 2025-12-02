import React from 'react';

interface SummaryListSkeletonProps {
  count?: number; // 스켈레톤 아이템 개수 (기본값: 3)
}

/**
 * Summary List용 공통 스켈레톤 UI
 * CareerIntegration과 TurnOversIntegration에서 사용
 */
const SummaryListSkeleton: React.FC<SummaryListSkeletonProps> = ({ count = 3 }) => {
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
      <ul className="summary-list">
        {Array.from({ length: count }).map((_, index) => (
          <li key={`skeleton-${index}`}>
            <div className="info">
              <div>
                <div>
                  {/* 제목 영역 스켈레톤 */}
                  <p 
                    className="skeleton-item"
                    style={{
                      height: '1.8rem',
                      margin: 0,
                    }}
                  />
                </div>
                <ul>
                  {/* 액션 버튼들 스켈레톤 */}
                  <li>
                    <div 
                      className="skeleton-item"
                      style={{
                        height: '1.8rem',
                        width: '4rem',
                      }}
                    />
                  </li>
                  <li>
                    <div 
                      className="skeleton-item"
                      style={{
                        height: '1.8rem',
                        width: '4rem',
                      }}
                    />
                  </li>
                  <li>
                    <div 
                      className="skeleton-item"
                      style={{
                        height: '1.8rem',
                        width: '4rem',
                      }}
                    />
                  </li>
                </ul>
              </div>
              <ul>
                {/* 메타 정보 스켈레톤 */}
                <li>
                  <div 
                    className="skeleton-item"
                    style={{
                      height: '1.8rem',
                      width: '8rem',
                    }}
                  />
                </li>
                <li>
                  <div 
                    className="skeleton-item"
                    style={{
                      height: '1.8rem',
                      width: '10rem',
                    }}
                  />
                </li>
              </ul>
            </div>
            <div className="desc">
              {/* 설명 정보 스켈레톤 */}
              <p 
                className="skeleton-item"
                style={{
                  height: '1.8rem',
                  width: '12rem',
                  margin: 0,
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default SummaryListSkeleton;

