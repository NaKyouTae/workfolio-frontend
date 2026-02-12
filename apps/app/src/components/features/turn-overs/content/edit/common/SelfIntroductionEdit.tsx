import React from 'react';
import { TurnOverUpsertRequest_TurnOverGoalRequest_SelfIntroductionRequest } from '@workfolio/shared/generated/turn_over';
import Input from '@workfolio/shared/ui/Input';
import DraggableList from '@workfolio/shared/ui/DraggableList';
import DraggableItem from '@workfolio/shared/ui/DraggableItem';
import EmptyState from '@workfolio/shared/ui/EmptyState';
import '@workfolio/shared/styles/component-edit.css';
import Image from 'next/image';

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
    <DraggableItem id={`selfIntroduction-${index}`}>
        <div className="card">
            <ul className="edit-cont type2">
                <li>
                    <p>문항</p>
                    <Input
                        type="text"
                        label="문항"
                        placeholder="문항을 입력해 주세요."
                        value={item.question || ''}
                        onChange={(e) => onUpdate(index, 'question', e.target.value)}
                    />
                </li>
                <li>
                    <p>내용</p>
                    <textarea
                        placeholder="내용을 입력해 주세요."
                        value={item.content || ''}
                        onChange={(e) => onUpdate(index, 'content', e.target.value)}                        
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
    <>
        <div className="cont-tit">
            <div>
                <h3>공통 자기소개서</h3>
                {/* <p>{selfIntroductions.length}개</p> */}
            </div>
            <button onClick={addSelfIntroduction}><i className="ic-add" />문항 추가</button>
        </div>

        {selfIntroductions.length === 0 ? (
        <EmptyState text="자기소개서 문항을 추가해 주세요." />
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
    </>
  );
};

export default SelfIntroductionEdit;
