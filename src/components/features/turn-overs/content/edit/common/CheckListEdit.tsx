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
import Image from 'next/image';

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
    <DraggableItem id={`checkList-${index}`}>
        <div className="card">
            <ul className="edit-cont type2">
                <li>
                    <input
                        type="checkbox"
                        checked={item.checked || false}
                        onChange={(e) => onUpdateChecked(index, e.target.checked)}
                    />
                    <label>
                        <Input
                            type="text"
                            placeholder="내용을 입력해 주세요."
                            value={item.content || ''}
                            onChange={(e) => onUpdateContent(index, e.target.value)}
                        />
                    </label>
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
        <div className="cont-tit">
            <div>
                <h3>체크리스트</h3>
                {/* <p>{checkList.length}개</p> */}
                <button onClick={openGuide}><i className="ic-question"></i></button>
            </div>
            <button onClick={addCheckListItem}><i className="ic-add" />추가</button>
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
