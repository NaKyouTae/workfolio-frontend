import React from 'react';
import '@/styles/component-view.css';
import GuideModal from '@/components/ui/GuideModal';
import { useGuide } from '@/hooks/useGuide';
import { turnOverDirectionGuide } from '@/utils/turnOverGuideData';

interface TurnOverDirectionViewProps {
  reason: string;
  goal: string;
}

const TurnOverDirectionView: React.FC<TurnOverDirectionViewProps> = ({ reason, goal }) => {
  const { isOpen: isGuideOpen, openGuide, closeGuide } = useGuide();
  return (
    <>
      <div className="view-container">
        <h3 className="view-title">
          이직 방향 설정
          <span 
            onClick={openGuide}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '18px',
              height: '18px',
              background: '#e5e7eb',
              color: '#6b7280',
              borderRadius: '50%',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              marginLeft: '8px'
            }}>?</span>
        </h3>
      
      <div className="view-list-container">
        <div className="view-item">
          <div className="view-item-content">
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
              이직 사유
            </label>
            <div style={{ fontSize: '14px', color: '#1a1a1a', lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {reason || '-'}
            </div>
          </div>
        </div>
        <div className="view-item">
          <div className="view-item-content">
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
              이직 목표
            </label>
            <div style={{ fontSize: '14px', color: '#1a1a1a', lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {goal || '-'}
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* 가이드 모달 */}
      <GuideModal
        isOpen={isGuideOpen}
        onClose={closeGuide}
        title="이직 방향 설정 가이드"
        sections={turnOverDirectionGuide}
      />
    </>
  );
};

export default TurnOverDirectionView;

