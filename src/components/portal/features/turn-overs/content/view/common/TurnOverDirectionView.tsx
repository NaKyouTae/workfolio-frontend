import React from 'react';
import '@/styles/component-view.css';
import GuideModal from '@/components/portal/ui/GuideModal';
import { useGuide } from '@/hooks/useGuide';
import { turnOverDirectionGuide } from '@/utils/turnOverGuideData';

interface TurnOverDirectionViewProps {
  reason: string;
  goal: string;
}

const TurnOverDirectionView: React.FC<TurnOverDirectionViewProps> = ({ reason, goal }) => {
  const { isOpen: isGuideOpen, openGuide, closeGuide } = useGuide();
  return (
    <>
        <div className="cont-tit">
            <div>
                <h3>이직 방향 설정</h3>
                <button onClick={openGuide}><i className="ic-question"></i></button>
            </div>
        </div>
        <ul className="view-box">
            <li><p>이직 사유</p><span>{reason || '-'}</span></li>
            <li><p>이직 목표</p><span>{goal || '-'}</span></li>
        </ul>

        {/* 가이드 모달 */}
        <GuideModal
          isOpen={isGuideOpen}
          onClose={closeGuide}
          title="이직 방향 설정 가이드"
          sections={turnOverDirectionGuide}
        />
    </>
  );
};

export default TurnOverDirectionView;

