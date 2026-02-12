import React from 'react';

const TurnOverContentViewSkeleton: React.FC = () => {
  return (
    <>
      <div className="contents">
        {/* Header Skeleton */}
        <div className="page-title">
          <div>
            <div 
              className="skeleton-item"
              style={{ 
                height: '32px', 
                width: '200px', 
                marginBottom: '8px',
              }} 
            />
            <div 
              className="skeleton-item"
              style={{ 
                height: '16px', 
                width: '120px',
              }} 
            />
          </div>
          <ul>
            <li className="skeleton-item" style={{ width: '50px', height: '20px' }} />
            <li className="skeleton-item" style={{ width: '50px', height: '20px' }} />
            <li className="skeleton-item" style={{ width: '50px', height: '20px' }} />
          </ul>
        </div>

        <div className="page-cont">
          <article>
            {/* Tab Skeleton */}
            <div style={{ display: 'flex', marginBottom: '24px', borderBottom: '1px solid #e0e0e0' }}>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="skeleton-item"
                  style={{
                    height: '32px',
                    width: '33.3%',
                    borderRadius: '4px 4px 0 0',
                    marginBottom: '-1px',
                  }}
                />
              ))}
            </div>

            {/* Content Skeleton - TurnOverGoalView 구조에 맞춤 */}
            {/* 이직 방향 설정 */}
            <div className="cont-box">
              <div className="cont-tit">
                <div>
                  <div className="skeleton-item" style={{ height: '24px', width: '150px' }} />
                </div>
              </div>
              <ul className="view-box">
                <li style={{ display: 'flex', alignItems: 'flex-start', columnGap: '1rem' }}>
                  <div className="skeleton-item" style={{ height: '20px', width: '6.8rem', flexShrink: 0 }} />
                  <div className="skeleton-item" style={{ height: '20px', width: '100%', flex: 1 }} />
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', columnGap: '1rem' }}>
                  <div className="skeleton-item" style={{ height: '20px', width: '6.8rem', flexShrink: 0 }} />
                  <div className="skeleton-item" style={{ height: '20px', width: '100%', flex: 1 }} />
                </li>
              </ul>
            </div>

            {/* 공통 자기소개서 */}
            <div className="cont-box">
              <div className="cont-tit">
                <div>
                  <div className="skeleton-item" style={{ height: '24px', width: '150px' }} />
                </div>
              </div>
              <ul className="view-list type2">
                {[1, 2].map((i) => (
                  <li key={i} style={{ display: 'flex', flexFlow: 'column', rowGap: '1.2rem', padding: '2.4rem 2rem 2rem', border: '1px solid var(--gray003)', borderRadius: '1rem' }}>
                    <div className="skeleton-item" style={{ height: '20px', width: '200px' }} />
                    <div className="skeleton-item" style={{ height: '60px', width: '100%' }} />
                  </li>
                ))}
              </ul>
            </div>

            {/* 면접 예상 질문 */}
            <div className="cont-box">
              <div className="cont-tit">
                <div>
                  <div className="skeleton-item" style={{ height: '24px', width: '150px' }} />
                </div>
              </div>
              <ul className="view-list type2">
                {[1, 2].map((i) => (
                  <li key={i} style={{ display: 'flex', flexFlow: 'column', rowGap: '1.2rem', padding: '2.4rem 2rem 2rem', border: '1px solid var(--gray003)', borderRadius: '1rem' }}>
                    <div className="skeleton-item" style={{ height: '20px', width: '200px' }} />
                    <div className="skeleton-item" style={{ height: '60px', width: '100%' }} />
                  </li>
                ))}
              </ul>
            </div>

            {/* 메모 */}
            <div className="cont-box">
              <div className="cont-tit">
                <div>
                  <div className="skeleton-item" style={{ height: '24px', width: '100px' }} />
                </div>
              </div>
              <ul className="view-list type2">
                {[1, 2].map((i) => (
                  <li key={i} style={{ display: 'flex', flexFlow: 'column', rowGap: '1.2rem', padding: '2.4rem 2rem 2rem', border: '1px solid var(--gray003)', borderRadius: '1rem' }}>
                    <div className="skeleton-item" style={{ height: '60px', width: '100%' }} />
                  </li>
                ))}
              </ul>
            </div>

            {/* 체크리스트 */}
            <div className="cont-box">
              <div className="cont-tit">
                <div>
                  <div className="skeleton-item" style={{ height: '24px', width: '120px' }} />
                </div>
              </div>
              <ul className="view-box">
                {[1, 2, 3].map((i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', columnGap: '1rem' }}>
                    <div className="skeleton-item" style={{ height: '20px', width: '20px', borderRadius: '4px', flexShrink: 0 }} />
                    <div className="skeleton-item" style={{ height: '20px', width: '100%', flex: 1 }} />
                  </li>
                ))}
              </ul>
            </div>

            {/* 첨부 */}
            <div className="cont-box">
              <div className="cont-tit">
                <div>
                  <div className="skeleton-item" style={{ height: '24px', width: '80px' }} />
                </div>
              </div>
              <ul className="view-file-list">
                {[1, 2].map((i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2.4rem 2rem', border: '1px solid var(--gray003)', borderRadius: '1rem' }}>
                    <div className="skeleton-item" style={{ height: '20px', width: '200px' }} />
                    <div className="skeleton-item" style={{ height: '16px', width: '80px' }} />
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </div>
      </div>

      <style jsx global>{`
        .skeleton-item {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: skeleton-loading 1.5s ease-in-out infinite;
          border-radius: 4px;
        }

        @keyframes skeleton-loading {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </>
  );
};

export default TurnOverContentViewSkeleton;

