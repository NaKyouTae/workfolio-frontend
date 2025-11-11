import React from 'react';
import { TurnOverUpsertRequest_MemoRequest } from '@/generated/turn_over';
import DraggableList from '@/components/ui/DraggableList';
import DraggableItem from '@/components/ui/DraggableItem';
import EmptyState from '@/components/ui/EmptyState';
import GuideModal from '@/components/ui/GuideModal';
import { useGuide } from '@/hooks/useGuide';
import { memoGuide } from '@/utils/turnOverGuideData';
import '@/styles/component-edit.css';
import Image from 'next/image';

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
    <DraggableItem id={`memo-${index}`}>
        <div className="card">
            <ul className="edit-cont type2">
                <li>
                    <p>내용</p>
                    <textarea 
                    placeholder="내용을 입력해 주세요."
                    value={item.content || ''}
                    onChange={(e) => onUpdate(index, e.target.value)}                     
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
        <div className="cont-tit">
            <div>
                <h3>메모</h3>
                {/* <p>{memos.length}개</p> */}
                <button onClick={openGuide}><i className="ic-question"></i></button>
            </div>
            <button onClick={addMemo}><i className="ic-add" />추가</button>
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
