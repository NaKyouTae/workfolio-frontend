import React from 'react';
import '@/styles/component-view.css';

interface FinalChoiceViewProps {
  name: string;
  position: string;
  reason?: string;
}

const FinalChoiceView: React.FC<FinalChoiceViewProps> = ({ name, position, reason }) => {
  return (
    <div className="view-container">
      <h3 className="view-title">최종 선택</h3>
      
      <div className="view-list-container">
        <div className="view-item">
          <div className="view-item-content">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: reason ? '16px' : '0' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1a1a1a', margin: 0, flex: 1 }}>
                {name}
              </h3>
              <span style={{
                padding: '6px 16px',
                background: '#007bff',
                color: 'white',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 600,
                whiteSpace: 'nowrap'
              }}>
                {position}
              </span>
            </div>
            {reason && (
              <div style={{
                padding: '16px',
                background: '#f8f9fa',
                borderRadius: '8px',
                borderLeft: '4px solid #007bff'
              }}>
                <p style={{ fontSize: '15px', color: '#333', lineHeight: 1.8, margin: 0, whiteSpace: 'pre-wrap' }}>
                  {reason}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalChoiceView;

