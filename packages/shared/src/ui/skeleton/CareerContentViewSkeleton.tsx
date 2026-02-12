import React from 'react';

const CareerContentViewSkeleton: React.FC = () => {
  return (
    <>
      <div className="contents">
        {/* Header Skeleton */}
        <div className="page-title">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '8px' }}>
              {/* 체크박스 스켈레톤 */}
              <div 
                className="skeleton-item"
                style={{ 
                  height: '20px', 
                  width: '20px', 
                  borderRadius: '4px',
                }} 
              />
              {/* 제목 스켈레톤 */}
              <div 
                className="skeleton-item"
                style={{ 
                  height: '32px', 
                  width: '200px',
                }} 
              />
            </div>
            {/* 수정일 스켈레톤 */}
            <div 
              className="skeleton-item"
              style={{ 
                height: '16px', 
                width: '150px',
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
            {/* 기본 정보 섹션 */}
            <div id="basic-info" className="cont-box resume-intro">
              <div>
                <div>
                  {/* 이름 스켈레톤 */}
                  <div className="skeleton-item" style={{ height: '28px', width: '150px', marginBottom: '8px' }} />
                  {/* 포지션 스켈레톤 */}
                  <div className="skeleton-item" style={{ height: '20px', width: '120px', marginBottom: '16px' }} />
                </div>
                <ul>
                  {/* 생년월일, 성별, 전화번호, 이메일 스켈레톤 */}
                  {[1, 2, 3, 4].map((i) => (
                    <li key={i}>
                      <div className="skeleton-item" style={{ height: '18px', width: `${120 + i * 20}px` }} />
                    </li>
                  ))}
                </ul>
              </div>
              {/* 설명 스켈레톤 */}
              <div style={{ marginTop: '16px' }}>
                <div className="skeleton-item" style={{ height: '60px', width: '100%' }} />
              </div>
            </div>

            {/* 학력 섹션 */}
            <div id="education" className="cont-box">
              <div className="cont-tit">
                <div>
                  <div className="skeleton-item" style={{ height: '24px', width: '80px' }} />
                </div>
              </div>
              <ul className="view-list type2">
                {[1, 2].map((i) => (
                  <li key={i} style={{ display: 'flex', flexFlow: 'column', rowGap: '1.2rem', padding: '2.4rem 2rem 2rem', border: '1px solid var(--gray003)', borderRadius: '1rem' }}>
                    <div className="skeleton-item" style={{ height: '20px', width: '200px' }} />
                    <div className="skeleton-item" style={{ height: '20px', width: '150px' }} />
                    <div className="skeleton-item" style={{ height: '60px', width: '100%' }} />
                  </li>
                ))}
              </ul>
            </div>

            {/* 경력 섹션 */}
            <div id="career" className="cont-box">
              <div className="cont-tit">
                <div>
                  <div className="skeleton-item" style={{ height: '24px', width: '80px' }} />
                </div>
              </div>
              <ul className="view-list type2">
                {[1, 2].map((i) => (
                  <li key={i} style={{ display: 'flex', flexFlow: 'column', rowGap: '1.2rem', padding: '2.4rem 2rem 2rem', border: '1px solid var(--gray003)', borderRadius: '1rem' }}>
                    <div className="skeleton-item" style={{ height: '20px', width: '250px' }} />
                    <div className="skeleton-item" style={{ height: '20px', width: '150px' }} />
                    <div className="skeleton-item" style={{ height: '20px', width: '100px' }} />
                    <div className="skeleton-item" style={{ height: '80px', width: '100%' }} />
                  </li>
                ))}
              </ul>
            </div>

            {/* 프로젝트 섹션 */}
            <div id="project" className="cont-box">
              <div className="cont-tit">
                <div>
                  <div className="skeleton-item" style={{ height: '24px', width: '100px' }} />
                </div>
              </div>
              <ul className="view-list type2">
                {[1, 2].map((i) => (
                  <li key={i} style={{ display: 'flex', flexFlow: 'column', rowGap: '1.2rem', padding: '2.4rem 2rem 2rem', border: '1px solid var(--gray003)', borderRadius: '1rem' }}>
                    <div className="skeleton-item" style={{ height: '20px', width: '200px' }} />
                    <div className="skeleton-item" style={{ height: '20px', width: '150px' }} />
                    <div className="skeleton-item" style={{ height: '100px', width: '100%' }} />
                  </li>
                ))}
              </ul>
            </div>

            {/* 활동 섹션 */}
            <div id="activity" className="cont-box">
              <div className="cont-tit">
                <div>
                  <div className="skeleton-item" style={{ height: '24px', width: '80px' }} />
                </div>
              </div>
              <ul className="view-list type2">
                {[1, 2].map((i) => (
                  <li key={i} style={{ display: 'flex', flexFlow: 'column', rowGap: '1.2rem', padding: '2.4rem 2rem 2rem', border: '1px solid var(--gray003)', borderRadius: '1rem' }}>
                    <div className="skeleton-item" style={{ height: '20px', width: '200px' }} />
                    <div className="skeleton-item" style={{ height: '20px', width: '150px' }} />
                    <div className="skeleton-item" style={{ height: '60px', width: '100%' }} />
                  </li>
                ))}
              </ul>
            </div>

            {/* 언어 섹션 */}
            <div id="language" className="cont-box">
              <div className="cont-tit">
                <div>
                  <div className="skeleton-item" style={{ height: '24px', width: '80px' }} />
                </div>
              </div>
              <ul className="view-box">
                {[1, 2, 3].map((i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', columnGap: '1rem' }}>
                    <div className="skeleton-item" style={{ height: '20px', width: '6.8rem', flexShrink: 0 }} />
                    <div className="skeleton-item" style={{ height: '20px', width: '100%', flex: 1 }} />
                  </li>
                ))}
              </ul>
            </div>

            {/* 첨부 섹션 */}
            <div id="attachment" className="cont-box">
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

export default CareerContentViewSkeleton;

