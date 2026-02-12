import React from 'react';
import { TurnOverUpsertRequest_TurnOverGoalRequest_InterviewQuestionRequest } from '@workfolio/shared/generated/turn_over';
import Input from '@workfolio/shared/ui/Input';
import DraggableList from '@workfolio/shared/ui/DraggableList';
import DraggableItem from '@workfolio/shared/ui/DraggableItem';
import EmptyState from '@workfolio/shared/ui/EmptyState';
import '@workfolio/shared/styles/component-edit.css';
import Image from 'next/image';

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
    <DraggableItem id={`interviewQuestion-${index}`}>
        <div className="card">
            <ul className="edit-cont type2">
                <li>
                    <p>질문</p>
                    <Input
                        type="text"
                        label="질문"
                        placeholder="질문을 입력해 주세요."
                        value={item.question || ''}
                        onChange={(e) => onUpdate(index, 'question', e.target.value)}
                    />
                </li>
                <li>
                    <p>답변</p>
                    <textarea 
                        placeholder="답변을 입력해 주세요."
                        value={item.answer || ''}
                        onChange={(e) => onUpdate(index, 'answer', e.target.value)}                    
                        ></textarea>
                </li>
            </ul>
            <div className="edit-btn">
                <button
                    onClick={() => onRemove(index)}
                    title="삭제"
                    type="button"
                    className="gray"
                >
                    <Image
                        src="/assets/img/ico/ic-minus.svg"
                        alt="삭제"
                        width={1}
                        height={1}
                    />
                </button>
            </div>
        </div>
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
    <>
        <div className="cont-tit">
            <div>
                <h3>면접 예상 질문</h3>
                {/* <p>{interviewQuestions.length}개</p> */}
            </div>
            <button onClick={addInterviewQuestion}><i className="ic-add" />질문 추가</button>
        </div>

        {interviewQuestions.length === 0 ? (
        <EmptyState text="면접 예상 질문을 추가해 주세요." />
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
    </>
  );
};

export default InterviewQuestionEdit;
