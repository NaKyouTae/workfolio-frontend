import React from 'react';
import { SelfIntroduction } from '@/generated/common';
import EmptyState from '@/components/ui/EmptyState';
import '@/styles/component-view.css';

interface SelfIntroductionViewProps {
  selfIntroductions: SelfIntroduction[];
}

const SelfIntroductionView: React.FC<SelfIntroductionViewProps> = ({ selfIntroductions }) => {
  return (
    <div className="view-container">
      <h3 className="view-title">공통 자기소개서</h3>
      
      {!selfIntroductions || selfIntroductions.length === 0 ? (
        <EmptyState text="등록된 자기소개서가 없습니다." />
      ) : (
        <div className="view-list-container">
          {selfIntroductions.map((item, index) => (
            <div key={item.id || `self-intro-${index}`} className="view-item">
              <div className="view-item-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '24px',
                    height: '24px',
                    background: '#007bff',
                    color: 'white',
                    borderRadius: '50%',
                    fontSize: '14px',
                    fontWeight: 600,
                    flexShrink: 0
                  }}>
                    {index + 1}
                  </span>
                  <strong style={{ flex: 1 }}>문항 제목 들어가는 영역</strong>
                </div>
                <p style={{ fontWeight: 600, marginBottom: '8px', color: '#333', lineHeight: 1.6 }}>{item.question}</p>
                <p style={{ color: '#666', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{item.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelfIntroductionView;

