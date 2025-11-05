import React from 'react';
import { TurnOverUpsertRequest_MemoRequest } from '@/generated/turn_over';
import DraggableList from '@/components/ui/DraggableList';
import DraggableItem from '@/components/ui/DraggableItem';
import EmptyState from '@/components/ui/EmptyState';
import GuideModal from '@/components/ui/GuideModal';
import { useGuide } from '@/hooks/useGuide';
import { memoGuide } from '@/utils/turnOverGuideData';
import '@/styles/component-edit.css';

interface MemoEditProps {
  memos: TurnOverUpsertRequest_MemoRequest[];
  onMemosChange: (memos: TurnOverUpsertRequest_MemoRequest[]) => void;
}

interface MemoItemProps {
  item: TurnOverUpsertRequest_MemoRequest;
  index: number;
  onUpdate: (index: number, content: string) => void;
  onRemove: (index: number) => void;
}

const MemoItem: React.FC<MemoItemProps> = ({
  item,
  index,
  onUpdate,
  onRemove,
}) => {
  return (
    <DraggableItem
      id={`memo-${index}`}
      className="edit-card-wrapper"
    >
      <div className="edit-card">
        <div className="edit-form-field">
          <label className="edit-label">내용</label>
          <textarea
            className="edit-textarea"
            placeholder="내용을 입력해 주세요."
            value={item.content || ''}
            onChange={(e) => onUpdate(index, e.target.value)}
            rows={3}
          />
        </div>
      </div>

      <button
        onClick={() => onRemove(index)}
        style={{
          width: '60px',
          padding: '8px 4px',
          backgroundColor: '#fff',
          border: '1px solid #ddd',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px',
          color: '#999',
          height: 'fit-content',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#ffebee';
          e.currentTarget.style.borderColor = '#f44336';
          e.currentTarget.style.color = '#f44336';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#fff';
          e.currentTarget.style.borderColor = '#ddd';
          e.currentTarget.style.color = '#999';
        }}
      >
        삭제
      </button>
    </DraggableItem>
  );
};

const MemoEdit: React.FC<MemoEditProps> = ({ memos, onMemosChange }) => {
  const { isOpen: isGuideOpen, openGuide, closeGuide } = useGuide();

  const addMemo = () => {
    const newItem: TurnOverUpsertRequest_MemoRequest = {
      content: '',
      isVisible: true,
      priority: memos.length,
    };
    onMemosChange([...memos, newItem]);
  };

  const removeMemo = (index: number) => {
    const updated = memos.filter((_, i) => i !== index);
    // 재정렬 후 priority 업데이트
    const reordered = updated.map((item, idx) => ({
      ...item,
      priority: idx,
    }));
    onMemosChange(reordered);
  };

  const updateMemo = (index: number, content: string) => {
    const updated = [...memos];
    updated[index].content = content;
    onMemosChange(updated);
  };

  const handleReorder = (reordered: TurnOverUpsertRequest_MemoRequest[]) => {
    // 드래그앤드롭 후 priority를 index로 업데이트
    const updatedWithPriority = reordered.map((item, idx) => ({
      ...item,
      priority: idx,
    }));
    onMemosChange(updatedWithPriority);
  };

  return (
    <>
      <div className="edit-section">
        <div className="edit-section-header">
          <h3 className="edit-section-title-counter">
            메모 | {memos.length}개
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
          <div className="edit-add-button-container">
            <button
              onClick={addMemo}
              className="edit-add-button"
            >
              <span>+ 추가</span>
            </button>
          </div>
        </div>

      {memos.length === 0 ? (
        <EmptyState text="메모를 추가해 주세요." />
      ) : (
        <DraggableList
          items={memos}
          onReorder={handleReorder}
          getItemId={(_, idx) => `memo-${idx}`}
          renderItem={(item, index) => (
            <MemoItem
              key={`memo-${index}`}
              item={item}
              index={index}
              onUpdate={updateMemo}
              onRemove={removeMemo}
            />
          )}
        />
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

export default MemoEdit;
