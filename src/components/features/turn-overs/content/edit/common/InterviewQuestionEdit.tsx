import React from 'react';
import { TurnOverUpsertRequest_TurnOverGoalRequest_InterviewQuestionRequest } from '@/generated/turn_over';
import Input from '@/components/ui/Input';
import DraggableList from '@/components/ui/DraggableList';
import DraggableItem from '@/components/ui/DraggableItem';
import EmptyState from '@/components/ui/EmptyState';
import '@/styles/component-edit.css';

interface InterviewQuestionEditProps {
  interviewQuestions: TurnOverUpsertRequest_TurnOverGoalRequest_InterviewQuestionRequest[];
  onUpdate: (interviewQuestions: TurnOverUpsertRequest_TurnOverGoalRequest_InterviewQuestionRequest[]) => void;
}

interface InterviewQuestionItemProps {
  item: TurnOverUpsertRequest_TurnOverGoalRequest_InterviewQuestionRequest;
  index: number;
  onUpdate: (index: number, field: 'question' | 'answer', value: string) => void;
  onRemove: (index: number) => void;
}

const InterviewQuestionItem: React.FC<InterviewQuestionItemProps> = ({
  item,
  index,
  onUpdate,
  onRemove,
}) => {
  return (
    <DraggableItem
      id={`interviewQuestion-${index}`}
      className="edit-card-wrapper"
    >
      <div className="edit-card">
        <div className="edit-grid-container-1">
          <div className="edit-form-field">
            <Input
              type="text"
              label="질문"
              placeholder="질문을 입력해 주세요."
              value={item.question || ''}
              onChange={(e) => onUpdate(index, 'question', e.target.value)}
            />
          </div>
          <div className="edit-form-field">
            <label className="edit-label">답변</label>
            <textarea
              className="edit-textarea"
              placeholder="답변을 입력해 주세요."
              value={item.answer || ''}
              onChange={(e) => onUpdate(index, 'answer', e.target.value)}
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
 * 면접 예상 질문 편집 컴포넌트
 */
const InterviewQuestionEdit: React.FC<InterviewQuestionEditProps> = ({
  interviewQuestions,
  onUpdate,
}) => {
  const addInterviewQuestion = () => {
    const newItem: TurnOverUpsertRequest_TurnOverGoalRequest_InterviewQuestionRequest = {
      question: '',
      answer: '',
      isVisible: true,
      priority: interviewQuestions.length,
    };
    onUpdate([...interviewQuestions, newItem]);
  };

  const removeInterviewQuestion = (index: number) => {
    const updated = interviewQuestions.filter((_, i) => i !== index);
    // 재정렬 후 priority 업데이트
    const reordered = updated.map((item, idx) => ({
      ...item,
      priority: idx,
    }));
    onUpdate(reordered);
  };

  const updateInterviewQuestion = (index: number, field: 'question' | 'answer', value: string) => {
    const updated = [...interviewQuestions];
    updated[index][field] = value;
    onUpdate(updated);
  };

  const handleReorder = (reordered: TurnOverUpsertRequest_TurnOverGoalRequest_InterviewQuestionRequest[]) => {
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
          면접 예상 질문 | {interviewQuestions.length}개
        </h3>
        <div className="edit-add-button-container">
          <button
            onClick={addInterviewQuestion}
            className="edit-add-button"
          >
            <span>+ 질문 추가</span>
          </button>
        </div>
      </div>

      {interviewQuestions.length === 0 ? (
        <EmptyState text="질문을 추가해 주세요." />
      ) : (
        <DraggableList
          items={interviewQuestions}
          onReorder={handleReorder}
          getItemId={(_, idx) => `interviewQuestion-${idx}`}
          renderItem={(item, index) => (
            <InterviewQuestionItem
              key={`interviewQuestion-${index}`}
              item={item}
              index={index}
              onUpdate={updateInterviewQuestion}
              onRemove={removeInterviewQuestion}
            />
          )}
        />
      )}
    </div>
  );
};

export default InterviewQuestionEdit;
