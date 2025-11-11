import React from 'react';
import { CheckList } from '@/generated/common';
import EmptyState from '@/components/portal/ui/EmptyState';
import GuideModal from '@/components/portal/ui/GuideModal';
import { useGuide } from '@/hooks/useGuide';
import { checkListGuide } from '@/utils/turnOverGuideData';
import '@/styles/component-view.css';

interface CheckListViewProps {
  checkList: CheckList[];
}

const CheckListView: React.FC<CheckListViewProps> = ({ checkList }) => {
  const { isOpen: isGuideOpen, openGuide, closeGuide } = useGuide();
  return (
    <>
        <div className="cont-tit">
            <div>
                <h3>체크리스트</h3>
                <button onClick={openGuide}><i className="ic-question"></i></button>
            </div>
        </div>
        {!checkList || checkList.length === 0 ? (
        <EmptyState text="등록된 체크리스트가 없습니다." />
        ) : (
        <ul className="view-box">
            {checkList.map((item, index) => (
            <li key={item.id || `checklist-${index}`}>
                <input
                    type="checkbox"
                    checked={item.checked}
                    readOnly
                />
                <label><p>{item.content}</p></label>
            </li>
            ))}
        </ul>
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

export default CheckListView;

