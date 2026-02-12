import React from 'react';
import '@workfolio/shared/styles/component-view.css';
import GuideModal from '@workfolio/shared/ui/GuideModal';
import { useGuide } from '@workfolio/shared/hooks/useGuide';
import { DateUtil } from '@workfolio/shared/utils/DateUtil';

interface TurnOverDirectionViewProps {
  startedAt?: number | undefined;
  reason: string;
  goal: string;
}

const TurnOverDirectionView: React.FC<TurnOverDirectionViewProps> = ({ startedAt, reason, goal }) => {
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
            <li><p>시작일</p><span>{startedAt ? DateUtil.formatTimestamp(startedAt) : '-'}</span></li>
            <li><p>이직 사유</p><span>{reason || '-'}</span></li>
            <li><p>이직 목표</p><span>{goal || '-'}</span></li>
        </ul>

        {/* 가이드 모달 */}
        <GuideModal
          isOpen={isGuideOpen}
          onClose={closeGuide}
          title="이직 방향 설정 가이드"
        >
          <div className="turnover-guide-wrap">
            <h3>1단계 : 왜 떠나야 할까? (이직 사유 정리하기)</h3>
            <div>
              <h4>💡 작성 목적</h4>
              <p>왜 이직을 결정했는지, 그 이유를 스스로 명확하게 다듬기 위해서예요. 감정적인 이유보다는 지금의 나에게 어떤 변화가 필요했는지를 구체적으로 기록해보면 좋아요. 면접에서 자신감 있게 말할 수 있는 단단한 근거가 됩니다!</p>
            </div>
            <div>
              <h4>🤔 고민해 볼 것</h4>
              <ul>
                <li>지금 회사에 계속 머무른다면 가장 후회할 것 같은 부분은 무엇인가요?</li>
                <li>&apos;이것&apos;만은 꼭 바뀌어야 한다고 생각한 구체적인 상황은 무엇인가요?</li>
                <li>회사나 팀의 문제가 아니라, 나의 성장과 방향성에서 느낀 한계는 무엇인가요?</li>
              </ul>
            </div>
            <div>
              <h4>📌 작성 TIP</h4>
              <ul>
                <li>회사 평가보다 내 성장과 커리어 변화 중심으로 적어보세요.</li>
                <li>아쉬운 점 보다는 바라는 점 등 긍정적인 이유로 표현하면 좋아요.</li>
              </ul>
            </div>
            <div>
              <h4>🔍 예시</h4>
              <ul>
                <li>현재 구조에서는 역량 개발이 제한되어 있어, 새로운 환경에서 더 다양한 프로젝트를 경험하고 싶습니다.</li>
                <li>회사의 비전과 지향하는 커리어 방향이 달라 장기적인 성장 가능성에 한계를 느꼈습니다.</li>
                <li>서비스 기획 전 과정을 직접 리드하며 실질적인 문제 해결과 성과 창출을 경험하고 싶습니다.</li>
              </ul>
            </div>
          </div>
          <div className="turnover-guide-wrap">
            <h3>2단계 : 어디로 가야 할까? (이직 목표 설정하기)</h3>
            <div>
              <h4>💡 작성 목적</h4>
              <p>단순히 &apos;더 좋은 회사&apos;가 아니라, 나에게 맞는 역할과 환경을 찾아보세요. 이번 이직을 통해 어떤 방향으로 성장하고 싶은지 스스로에게 물어보면 좋습니다. 목표 설정을 통해 나에게 좀 더 딱 맞는 회사를 찾을 수 있어요!</p>
            </div>
            <div>
              <h4>🤔 고민해 볼 것</h4>
              <ul>
                <li>지금 나에게 가장 중요한 가치는 무엇인가요? (연봉, 성장, 워라밸 등)</li>
                <li>다음 회사에서는 어떤 역할을 맡고 싶나요?</li>
                <li>어떤 환경에서 가장 몰입하고 즐겁게 일할 수 있나요?</li>
              </ul>
            </div>
            <div>
              <h4>📌 작성 TIP</h4>
              <ul>
                <li>직무, 업무 환경, 조직 문화, 커리어 목표를 구체적으로 적어보세요.</li>
                <li>피하고 싶은 것보다 원하는 것에 초점을 맞춰보세요.</li>
              </ul>
            </div>
            <div>
              <h4>🔍 예시</h4>
              <ul>
                <li>데이터 기반 서비스 기획 역량을 확장하고 싶습니다.</li>
                <li>유저 중심의 제품 개발 문화를 가진 IT 서비스 기업에서 일하고 싶습니다.</li>
                <li>장기적으로는 PM 또는 서비스 기획 리더로 성장하고 싶습니다.</li>
              </ul>
            </div>
          </div>
        </GuideModal>
    </>
  );
};

export default TurnOverDirectionView;

