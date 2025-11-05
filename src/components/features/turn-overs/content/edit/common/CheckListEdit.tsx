import React from 'react';
import { TurnOverUpsertRequest_TurnOverGoalRequest_CheckListRequest } from '@/generated/turn_over';
import Input from '@/components/ui/Input';
import DraggableList from '@/components/ui/DraggableList';
import DraggableItem from '@/components/ui/DraggableItem';
import EmptyState from '@/components/ui/EmptyState';
import GuideModal from '@/components/ui/GuideModal';
import { useGuide } from '@/hooks/useGuide';
import { checkListGuide } from '@/utils/turnOverGuideData';
import '@/styles/component-edit.css';

interface CheckListEditProps {
  checkList: TurnOverUpsertRequest_TurnOverGoalRequest_CheckListRequest[];
  onUpdate: (checkList: TurnOverUpsertRequest_TurnOverGoalRequest_CheckListRequest[]) => void;
}

interface CheckListItemProps {
  item: TurnOverUpsertRequest_TurnOverGoalRequest_CheckListRequest;
  index: number;
  onUpdateChecked: (index: number, checked: boolean) => void;
  onUpdateContent: (index: number, content: string) => void;
  onRemove: (index: number) => void;
}

const CheckListItem: React.FC<CheckListItemProps> = ({
  item,
  index,
  onUpdateChecked,
  onUpdateContent,
  onRemove,
}) => {
  return (
    <DraggableItem
      id={`checkList-${index}`}
      className="edit-card-wrapper"
    >
      <div className="edit-card">
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input
            type="checkbox"
            className="edit-checkbox"
            checked={item.checked || false}
            onChange={(e) => onUpdateChecked(index, e.target.checked)}
          />
          <div className="edit-form-field" style={{ flex: 1 }}>
            <Input
              type="text"
              placeholder="내용을 입력해 주세요."
              value={item.content || ''}
              onChange={(e) => onUpdateContent(index, e.target.value)}
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
 * 체크리스트 편집 컴포넌트
 */
const CheckListEdit: React.FC<CheckListEditProps> = ({
  checkList,
  onUpdate,
}) => {
  const { isOpen: isGuideOpen, openGuide, closeGuide } = useGuide();

  const addCheckListItem = () => {
    const newItem: TurnOverUpsertRequest_TurnOverGoalRequest_CheckListRequest = {
      checked: false,
      content: '',
      isVisible: true,
      priority: checkList.length,
    };
    onUpdate([...checkList, newItem]);
  };

  const removeCheckListItem = (index: number) => {
    const updated = checkList.filter((_, i) => i !== index);
    // 재정렬 후 priority 업데이트
    const reordered = updated.map((item, idx) => ({
      ...item,
      priority: idx,
    }));
    onUpdate(reordered);
  };

  const updateCheckListChecked = (index: number, checked: boolean) => {
    const updated = [...checkList];
    updated[index].checked = checked;
    onUpdate(updated);
  };

  const updateCheckListContent = (index: number, content: string) => {
    const updated = [...checkList];
    updated[index].content = content;
    onUpdate(updated);
  };

  const handleReorder = (reordered: TurnOverUpsertRequest_TurnOverGoalRequest_CheckListRequest[]) => {
    // 드래그앤드롭 후 priority를 index로 업데이트
    const updatedWithPriority = reordered.map((item, idx) => ({
      ...item,
      priority: idx,
    }));
    onUpdate(updatedWithPriority);
  };

  return (
    <>
      <div className="edit-section">
        <div className="edit-section-header">
          <h3 className="edit-section-title-counter">
            체크리스트 | {checkList.length}개
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
              onClick={addCheckListItem}
              className="edit-add-button"
            >
              <span>+ 추가</span>
            </button>
          </div>
        </div>

      {checkList.length === 0 ? (
        <EmptyState text="체크리스트를 추가해 주세요." />
      ) : (
        <DraggableList
          items={checkList}
          onReorder={handleReorder}
          getItemId={(_, idx) => `checkList-${idx}`}
          renderItem={(item, index) => (
            <CheckListItem
              key={`checkList-${index}`}
              item={item}
              index={index}
              onUpdateChecked={updateCheckListChecked}
              onUpdateContent={updateCheckListContent}
              onRemove={removeCheckListItem}
            />
          )}
        />
      )}
      </div>

      {/* 가이드 모달 */}
      <GuideModal
        isOpen={isGuideOpen}
        onClose={closeGuide}
        title="체크리스트 가이드"
        sections={checkListGuide}
      />
    </>
  );
};

export default CheckListEdit;
