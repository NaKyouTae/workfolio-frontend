import React from 'react';
import { Memo } from '@/generated/common';
import EmptyState from '@/components/ui/EmptyState';
import '@/styles/component-view.css';

interface MemoViewProps {
  memos: Memo[];
}

const MemoView: React.FC<MemoViewProps> = ({ memos }) => {
  return (
    <div className="view-container">
      <h3 className="view-title">메모</h3>
      
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
  );
};

export default MemoView;
