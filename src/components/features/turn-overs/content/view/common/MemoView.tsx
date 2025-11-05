import React from 'react';
import { Memo } from '@/generated/common';
import EmptyState from '@/components/ui/EmptyState';
import GuideModal from '@/components/ui/GuideModal';
import { useGuide } from '@/hooks/useGuide';
import { memoGuide } from '@/utils/turnOverGuideData';
import '@/styles/component-view.css';

interface MemoViewProps {
  memos: Memo[];
}

const MemoView: React.FC<MemoViewProps> = ({ memos }) => {
  const { isOpen: isGuideOpen, openGuide, closeGuide } = useGuide();
  return (
    <>
      <div className="view-container">
        <h3 className="view-title">
          메모
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
      
      {!(memos && memos.length > 0) ? (
        <EmptyState text="등록된 메모가 없습니다." />
      ) : (
        <div className="view-list-container">
          {memos.map((memo) => (
            <div className="view-item" key={memo.id}>
              <div className="view-item-content">
                <p style={{ 
                  fontSize: '15px', 
                  color: '#1a1a1a', 
                  lineHeight: 1.8, 
                  margin: 0,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}>
                  {memo.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>

      {/* 가이드 모달 */}
      <GuideModal
        isOpen={isGuideOpen}
        onClose={closeGuide}
        title="메모 가이드"
        sections={memoGuide}
      />
    </>
  );
};

export default MemoView;
