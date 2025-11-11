import React from 'react';
import { TurnOverUpsertRequest_TurnOverGoalRequest_SelfIntroductionRequest } from '@/generated/turn_over';
import Input from '@/components/portal/ui/Input';
import DraggableList from '@/components/portal/ui/DraggableList';
import DraggableItem from '@/components/portal/ui/DraggableItem';
import EmptyState from '@/components/portal/ui/EmptyState';
import '@/styles/component-edit.css';

interface SelfIntroductionEditProps {
  selfIntroductions: TurnOverUpsertRequest_TurnOverGoalRequest_SelfIntroductionRequest[];
  onUpdate: (selfIntroductions: TurnOverUpsertRequest_TurnOverGoalRequest_SelfIntroductionRequest[]) => void;
}

interface SelfIntroductionItemProps {
  item: TurnOverUpsertRequest_TurnOverGoalRequest_SelfIntroductionRequest;
  index: number;
  onUpdate: (index: number, field: 'question' | 'content', value: string) => void;
  onRemove: (index: number) => void;
}

const SelfIntroductionItem: React.FC<SelfIntroductionItemProps> = ({
  item,
  index,
  onUpdate,
  onRemove,
}) => {
  return (
    <DraggableItem
      id={`selfIntroduction-${index}`}
      className="edit-card-wrapper"
    >
      <div className="edit-card">
        <div className="edit-grid-container-1">
          <div className="edit-form-field">
            <Input
              type="text"
              label="문항"
              placeholder="문항을 입력해 주세요."
              value={item.question || ''}
              onChange={(e) => onUpdate(index, 'question', e.target.value)}
            />
          </div>
          <div className="edit-form-field">
            <label className="edit-label">내용</label>
            <textarea
              className="edit-textarea"
              placeholder="내용을 입력해 주세요."
              value={item.content || ''}
              onChange={(e) => onUpdate(index, 'content', e.target.value)}
              rows={4}
            />
          </div>
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

/**
 * 공통 자기소개서 편집 컴포넌트
 */
const SelfIntroductionEdit: React.FC<SelfIntroductionEditProps> = ({
  selfIntroductions,
  onUpdate,
}) => {
  const addSelfIntroduction = () => {
    const newItem: TurnOverUpsertRequest_TurnOverGoalRequest_SelfIntroductionRequest = {
      question: '',
      content: '',
      isVisible: true,
      priority: selfIntroductions.length,
    };
    onUpdate([...selfIntroductions, newItem]);
  };

  const removeSelfIntroduction = (index: number) => {
    const updated = selfIntroductions.filter((_, i) => i !== index);
    // 재정렬 후 priority 업데이트
    const reordered = updated.map((item, idx) => ({
      ...item,
      priority: idx,
    }));
    onUpdate(reordered);
  };

  const updateSelfIntroduction = (index: number, field: 'question' | 'content', value: string) => {
    const updated = [...selfIntroductions];
    updated[index][field] = value;
    onUpdate(updated);
  };

  const handleReorder = (reordered: TurnOverUpsertRequest_TurnOverGoalRequest_SelfIntroductionRequest[]) => {
    // 드래그앤드롭 후 priority를 index로 업데이트
    const updatedWithPriority = reordered.map((item, idx) => ({
      ...item,
      priority: idx,
    }));
    onUpdate(updatedWithPriority);
  };

  return (
    <div className="edit-section">
      <div className="edit-section-header">
        <h3 className="edit-section-title-counter">
          공통 자기소개서 | {selfIntroductions.length}개
        </h3>
        <div className="edit-add-button-container">
          <button
            onClick={addSelfIntroduction}
            className="edit-add-button"
          >
            <span>+ 문항 추가</span>
          </button>
        </div>
      </div>

      {selfIntroductions.length === 0 ? (
        <EmptyState text="문항을 추가해 주세요." />
      ) : (
        <DraggableList
          items={selfIntroductions}
          onReorder={handleReorder}
          getItemId={(_, idx) => `selfIntroduction-${idx}`}
          renderItem={(item, index) => (
            <SelfIntroductionItem
              key={`selfIntroduction-${index}`}
              item={item}
              index={index}
              onUpdate={updateSelfIntroduction}
              onRemove={removeSelfIntroduction}
            />
          )}
        />
      )}
    </div>
  );
};

export default SelfIntroductionEdit;
