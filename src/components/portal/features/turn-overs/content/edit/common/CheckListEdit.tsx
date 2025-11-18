import React from 'react';
import { TurnOverUpsertRequest_TurnOverGoalRequest_CheckListRequest } from '@/generated/turn_over';
import Input from '@/components/portal/ui/Input';
import DraggableList from '@/components/portal/ui/DraggableList';
import DraggableItem from '@/components/portal/ui/DraggableItem';
import EmptyState from '@/components/portal/ui/EmptyState';
import GuideModal from '@/components/portal/ui/GuideModal';
import { useGuide } from '@/hooks/useGuide';
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
    console.log("================")
    console.log(updated[index]);
    console.log("================")

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
        >
          <div className="turnover-guide-wrap">
            <h3>1. 보완해야 할 역량 점검 및 학습 계획 세우기</h3>
            <ul>
              <li>부족한 기술이나 경험이 있다면 어떻게 채울지 학습 계획이나 개선 방법을 정리해 보세요.</li>
              <li>예: 데이터 분석 강화를 위해 Python 온라인 강의 수강하기</li>
            </ul>
          </div>
          <div className="turnover-guide-wrap">
            <h3>2. 이력서 및 자기소개서 최신판으로 갈아엎기</h3>
            <ul>
              <li>최신 경력과 맡았던 역할, 성과를 중심으로 문장과 구조를 다듬어 보세요.</li>
              <li>예: 최근 프로젝트 &apos;서비스 개편&apos; 성과 수치 포함해 자기소개서 업데이트하기</li>
            </ul>
          </div>
          <div className="turnover-guide-wrap">
            <h3>3. 포트폴리오 정리 및 보완하기</h3>
            <ul>
              <li>주요 프로젝트 결과물과 담당 역할, 성과 지표를 보기 쉽게 정리해 두세요.</li>
              <li>예: 지난 6개월간 참여한 프로젝트별 스크린샷과 결과 지표 추가</li>
            </ul>
          </div>
          <div className="turnover-guide-wrap">
            <h3>4. 면접 대비 자료 준비하기</h3>
            <ul>
              <li>자주 나오는 질문과 나의 강점, 프로젝트 사례를 정리하고 말하기 연습을 해보세요.</li>
              <li>예: 프로젝트에서 문제를 해결한 경험을 3문장으로 요약해 말하기 연습</li>
            </ul>
          </div>
          <div className="turnover-guide-wrap">
            <h3>5. 이직 일정 및 계획 세우기</h3>
            <ul>
              <li>지원 일정, 퇴사 시점, 휴식 기간 등을 캘린더에 표시해 두면 편리해요.</li>
              <li>예: 관심 기업 지원 마감일 캘린더에 등록</li>
            </ul>
          </div>
        </GuideModal>
    </>
  );
};

export default CheckListEdit;
