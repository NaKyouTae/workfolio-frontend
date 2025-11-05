import React from 'react';
import '@/styles/component-view.css';

interface SatisfactionViewProps {
  score: number;
  reviewSummary?: string;
}

const SatisfactionView: React.FC<SatisfactionViewProps> = ({ score, reviewSummary }) => {
  const renderStars = (score: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span 
        key={index} 
        style={{ 
          fontSize: '32px', 
          color: index < score ? '#fbbf24' : '#e5e7eb',
          marginRight: '4px'
        }}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="view-container">
      <h3 className="view-title">만족도 평가</h3>
      
      <div className="view-list-container">
        <div className="view-item">
          <div className="view-item-content">
            {/* 점수 */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '16px',
              marginBottom: reviewSummary ? '20px' : '0',
              paddingBottom: reviewSummary ? '20px' : '0',
              borderBottom: reviewSummary ? '1px solid #e5e7eb' : 'none'
            }}>
              <span style={{ fontSize: '15px', fontWeight: 600, color: '#6b7280', flexShrink: 0 }}>점수</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {renderStars(score)}
                </div>
                <span style={{ fontSize: '20px', fontWeight: 700, color: '#1a1a1a' }}>{score}점</span>
              </div>
            </div>

            {/* 한 줄 회고 */}
            {reviewSummary && (
              <div>
                <span style={{ 
                  display: 'block',
                  fontSize: '15px', 
                  fontWeight: 600, 
                  color: '#6b7280',
                  marginBottom: '12px'
                }}>
                  한 줄 회고
                </span>
                <p style={{ 
                  fontSize: '15px', 
                  color: '#1a1a1a',
                  lineHeight: 1.8,
                  margin: 0,
                  whiteSpace: 'pre-wrap'
                }}>
                  {reviewSummary}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SatisfactionView;

