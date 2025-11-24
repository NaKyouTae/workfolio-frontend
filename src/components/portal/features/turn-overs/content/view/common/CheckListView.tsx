import React, { useState, useEffect, useCallback } from 'react';
import { CheckList } from '@/generated/common';
import { CheckListCheckedUpdateRequest } from '@/generated/turn_over';
import HttpMethod from '@/enums/HttpMethod';
import EmptyState from '@/components/portal/ui/EmptyState';
import GuideModal from '@/components/portal/ui/GuideModal';
import { useGuide } from '@/hooks/useGuide';
import '@/styles/component-view.css';

interface CheckListViewProps {
  checkList: CheckList[];
  onUpdate?: () => void;
}

const CheckListView: React.FC<CheckListViewProps> = ({ checkList, onUpdate }) => {
  const { isOpen: isGuideOpen, openGuide, closeGuide } = useGuide();
  // 로컬 상태로 체크리스트 관리 (낙관적 업데이트)
  const [localCheckList, setLocalCheckList] = useState<CheckList[]>(checkList);

  // checkList prop이 변경되면 로컬 상태 업데이트
  useEffect(() => {
    setLocalCheckList(checkList);
  }, [checkList]);

  // checkbox 클릭 핸들러
  const handleCheckboxChange = useCallback(async (item: CheckList, checked: boolean) => {
    if (!item.id) {
      console.error('CheckList id is missing');
      return;
    }

    // 낙관적 업데이트: 먼저 로컬 상태 업데이트
    setLocalCheckList(prev => 
      prev.map(checkItem => 
        checkItem.id === item.id 
          ? { ...checkItem, checked }
          : checkItem
      )
    );

    try {
      const request: CheckListCheckedUpdateRequest = {
        id: item.id,
        checked,
      };

      const response = await fetch('/api/check-lists/checked', {
        method: HttpMethod.PUT,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (response.ok) {
        // API 성공 시 부모 컴포넌트에 알림
        if (onUpdate) {
          onUpdate();
        }
      } else {
        // 실패 시 원래 상태로 복구
        setLocalCheckList(checkList);
        const errorData = await response.json();
        console.error('체크리스트 업데이트 실패:', errorData);
        alert('체크리스트 업데이트에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      // 에러 발생 시 원래 상태로 복구
      setLocalCheckList(checkList);
      console.error('Error updating check list:', error);
      alert('체크리스트 업데이트 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  }, [checkList, onUpdate]);
  return (
    <>
        <div className="cont-tit">
            <div>
                <h3>체크리스트</h3>
                <button onClick={openGuide}><i className="ic-question"></i></button>
            </div>
        </div>
        {!localCheckList || localCheckList.length === 0 ? (
            <EmptyState text="등록된 체크리스트가 없습니다." />
        ) : (
            <ul className="view-box">
                {localCheckList.map((item, index) => (
                    <li key={item.id || `checklist-${index}`}>
                        <input
                            id={`checklist-${index}`}
                            type="checkbox"
                            checked={item.checked || false}
                            onChange={(e) => handleCheckboxChange(item, e.target.checked)}
                        />
                        <label htmlFor={`checklist-${index}`}><p>{item.content}</p></label>
                    </li>
                ))}
            </ul>
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

export default CheckListView;

