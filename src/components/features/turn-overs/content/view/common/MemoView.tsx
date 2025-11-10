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
        <div className="cont-tit">
            <div>
                <h3>메모</h3>
                <button onClick={openGuide}><i className="ic-question"></i></button>
            </div>
        </div>
        {!(memos && memos.length > 0) ? (
        <EmptyState text="등록된 메모가 없습니다." />
        ) : (
        <ul className="view-list type2">
            {memos.map((memo) => (
            <li key={memo.id}>
                <p>{memo.content}</p>
            </li>
            ))}
        </ul>
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

export default MemoView;
