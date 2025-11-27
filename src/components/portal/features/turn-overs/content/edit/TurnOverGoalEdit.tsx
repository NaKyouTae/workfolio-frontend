import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef, useCallback, useMemo } from 'react';
import { TurnOverUpsertRequest, TurnOverUpsertRequest_MemoRequest, TurnOverUpsertRequest_TurnOverGoalRequest_CheckListRequest, TurnOverUpsertRequest_TurnOverGoalRequest_InterviewQuestionRequest, TurnOverUpsertRequest_TurnOverGoalRequest_SelfIntroductionRequest } from '@/generated/turn_over';
import { AttachmentRequest } from '@/generated/attachment';
import MemoEdit from './common/MemoEdit';
import AttachmentEdit from '@/components/portal/features/common/AttachmentEdit';
import { FloatingNavigationItem } from '@/components/portal/ui/FloatingNavigation';
import SelfIntroductionEdit from './common/SelfIntroductionEdit';
import InterviewQuestionEdit from './common/InterviewQuestionEdit';
import CheckListEdit from './common/CheckListEdit';
import GuideModal from '@/components/portal/ui/GuideModal';
import { useGuide } from '@/hooks/useGuide';
import Input from '@/components/portal/ui/Input';
import DatePicker from '@/components/portal/ui/DatePicker';
import { DateUtil } from '@/utils/DateUtil';
import { DateTime } from 'luxon';

interface TurnOverGoalEditProps {
  turnOverRequest: TurnOverUpsertRequest | null;
  onSave?: (data: TurnOverUpsertRequest) => void;
}

export interface TurnOverEditRef {
  getNavigationItems: () => FloatingNavigationItem[];
  handleSave: () => void;
}

const TurnOverGoalEdit = forwardRef<TurnOverEditRef, TurnOverGoalEditProps>(({ turnOverRequest, onSave }, ref) => {
  const [activeSection, setActiveSection] = useState<string>('direction');
  
  // 초기값을 turnOverRequest에서 바로 계산하여 깜빡임 방지
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialStartedAt = useMemo(() => turnOverRequest?.startedAt || undefined, [turnOverRequest?.id]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialReason = useMemo(() => turnOverRequest?.turnOverGoal?.reason || '', [turnOverRequest?.id]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialGoal = useMemo(() => turnOverRequest?.turnOverGoal?.goal || '', [turnOverRequest?.id]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialSelfIntroductions = useMemo(() => turnOverRequest?.turnOverGoal?.selfIntroductions || [], [turnOverRequest?.id]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialInterviewQuestions = useMemo(() => turnOverRequest?.turnOverGoal?.interviewQuestions || [], [turnOverRequest?.id]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialCheckList = useMemo(() => turnOverRequest?.turnOverGoal?.checkList || [], [turnOverRequest?.id]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialMemos = useMemo(() => turnOverRequest?.turnOverGoal?.memos || [], [turnOverRequest?.id]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialAttachments = useMemo(() => turnOverRequest?.turnOverGoal?.attachments || [], [turnOverRequest?.id]);
  
  const [startedAt, setStartedAt] = useState<number | undefined>(initialStartedAt);
  const [reason, setReason] = useState(initialReason);
  const [goal, setGoal] = useState(initialGoal);
  const [selfIntroductions, setSelfIntroductions] = useState<TurnOverUpsertRequest_TurnOverGoalRequest_SelfIntroductionRequest[]>(initialSelfIntroductions);
  const [interviewQuestions, setInterviewQuestions] = useState<TurnOverUpsertRequest_TurnOverGoalRequest_InterviewQuestionRequest[]>(initialInterviewQuestions);
  const [checkList, setCheckList] = useState<TurnOverUpsertRequest_TurnOverGoalRequest_CheckListRequest[]>(initialCheckList);
  const [memos, setMemos] = useState<TurnOverUpsertRequest_MemoRequest[]>(initialMemos);
  const [attachments, setAttachments] = useState<AttachmentRequest[]>(initialAttachments);

  // 가이드 모달
  const { isOpen: isGuideOpen, openGuide, closeGuide } = useGuide();

  // 각 섹션에 대한 ref
  const directionRef = useRef<HTMLDivElement>(null);
  const selfIntroductionRef = useRef<HTMLDivElement>(null);
  const interviewQuestionRef = useRef<HTMLDivElement>(null);
  const memoRef = useRef<HTMLDivElement>(null);
  const checklistRef = useRef<HTMLDivElement>(null);
  const attachmentRef = useRef<HTMLDivElement>(null);

  // turnOverRequest의 id가 변경될 때만 state 업데이트
  const turnOverRequestIdRef = useRef<string | undefined>(turnOverRequest?.id);
  
  useEffect(() => {
    // turnOverRequest의 id가 변경된 경우에만 state 초기화
    if (turnOverRequest?.id !== turnOverRequestIdRef.current) {
      turnOverRequestIdRef.current = turnOverRequest?.id;
      if (turnOverRequest) {
        setStartedAt(turnOverRequest.startedAt || undefined);
        if (turnOverRequest.turnOverGoal) {
          setReason(turnOverRequest.turnOverGoal.reason || '');
          setGoal(turnOverRequest.turnOverGoal.goal || '');
          setSelfIntroductions(turnOverRequest.turnOverGoal.selfIntroductions || []);
          setInterviewQuestions(turnOverRequest.turnOverGoal.interviewQuestions || []);
          setCheckList(turnOverRequest.turnOverGoal.checkList || []);
          setMemos(turnOverRequest.turnOverGoal.memos || []);
          setAttachments(turnOverRequest.turnOverGoal.attachments || []);
        }
      }
    }
  }, [turnOverRequest]);

  // 섹션으로 스크롤하는 함수
  const scrollToSection = useCallback((sectionId: string) => {
    const refMap: { [key: string]: React.RefObject<HTMLDivElement | null> } = {
      direction: directionRef,
      selfIntroduction: selfIntroductionRef,
      interviewQuestion: interviewQuestionRef,
      memo: memoRef,
      checklist: checklistRef,
      attachment: attachmentRef,
    };

    const ref = refMap[sectionId];
    if (ref?.current) {
      setActiveSection(sectionId);
      const element = ref.current;
      
      // page-cont 스크롤 컨테이너 찾기
      const scrollContainer = element.closest('.page-cont') as HTMLElement;
      
      if (scrollContainer) {
        // 스크롤 컨테이너 내에서의 상대 위치 계산
        const containerRect = scrollContainer.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        const offset = sectionId === 'direction' ? 80 : 30; // 상단에서 100px 떨어진 위치로 스크롤
        
        const scrollTop = scrollContainer.scrollTop + (elementRect.top - containerRect.top) - offset;
        
        scrollContainer.scrollTo({
          top: scrollTop,
          behavior: 'smooth',
        });
      } else {
        // page-cont를 찾지 못한 경우 window 스크롤 사용
        requestAnimationFrame(() => {
          const elementTop = element.getBoundingClientRect().top + (window.pageYOffset || window.scrollY);
          const offset = sectionId === 'direction' ? 80 : 30; // 상단에서 100px 떨어진 위치로 스크롤
          
          window.scrollTo({
            top: elementTop - offset,
            behavior: 'smooth',
          });
        });
      }
    }
  }, []);

  // 네비게이션 항목 정의
  const getNavigationItems = useCallback((): FloatingNavigationItem[] => {
    return [
      {
        id: 'direction',
        label: '이직 방향',
        isActive: activeSection === 'direction',
        onClick: () => scrollToSection('direction'),
      },
      {
        id: 'selfIntroduction',
        label: '자기소개서',
        isActive: activeSection === 'selfIntroduction',
        onClick: () => scrollToSection('selfIntroduction'),
      },
      {
        id: 'interviewQuestion',
        label: '면접 질문',
        isActive: activeSection === 'interviewQuestion',
        onClick: () => scrollToSection('interviewQuestion'),
      },
      {
        id: 'memo',
        label: '메모',
        isActive: activeSection === 'memo',
        onClick: () => scrollToSection('memo'),
      },
      {
        id: 'checklist',
        label: '체크리스트',
        isActive: activeSection === 'checklist',
        onClick: () => scrollToSection('checklist'),
      },
      {
        id: 'attachment',
        label: '첨부',
        isActive: activeSection === 'attachment',
        onClick: () => scrollToSection('attachment'),
      },
    ];
  }, [activeSection, scrollToSection]);

  const handleSave = () => {
    if (onSave && turnOverRequest) {
      onSave({
        ...turnOverRequest,
        startedAt: startedAt,
        turnOverGoal: {
          id: turnOverRequest?.turnOverGoal?.id || undefined,
          reason: reason,
          goal: goal,
          selfIntroductions: selfIntroductions,
          interviewQuestions: interviewQuestions,
          checkList: checkList,
          memos: memos,
          attachments: attachments,
        },
      } as TurnOverUpsertRequest);
    }
  };

  const handleUpdateAttachments = (attachments: AttachmentRequest[]) => {
    setAttachments(attachments);
  };

  // ref를 통해 getNavigationItems와 handleSave 함수를 노출
  useImperativeHandle(ref, () => ({
    getNavigationItems,
    handleSave,
  }));

  return (
    <>
        {/* 이직 방향 설정 */}
        <div ref={directionRef} className="cont-box">
            <div className="cont-tit">
                <div>
                    <h3>이직 방향 설정</h3>
                    <button onClick={openGuide}><i className="ic-question"></i></button>
                </div>
            </div>
            <ul className="edit-list type2">
                <li>
                    <p>시작일</p>
                    <DatePicker
                      value={DateUtil.formatTimestamp(startedAt || 0)}
                      onChange={(date) => setStartedAt(DateTime.fromISO(date).toMillis())}
                      required={false}
                    />
                </li>
                <li>
                    <p>이직 사유</p>
                    <Input 
                        type="text"
                        label="이직 사유"
                        value={reason}
                        placeholder="왜 이직을 고민하게 되었나요? (예: 성장 기회 부족, 새로운 환경 필요 등)"
                        onChange={(e) => setReason(e.target.value)}
                    />
                </li>
                <li>
                    <p>이직 목표</p>
                    <Input 
                        type="text"
                        label="이직 목표"
                        value={goal}
                        placeholder="이직을 통해 이루고 싶은 목표는 무엇인가요? (예: 직무 전환, 연봉 인상, 원격 근무 가능한 회사 등)"
                        onChange={(e) => setGoal(e.target.value)}
                    />
                </li>
            </ul>
        </div>

        {/* 공통 자기소개서 */}
        <div ref={selfIntroductionRef} className="cont-box">
            <SelfIntroductionEdit 
                selfIntroductions={selfIntroductions}
                onUpdate={setSelfIntroductions}
            />
        </div>

        {/* 면접 예상 질문 */}
        <div ref={interviewQuestionRef} className="cont-box">
            <InterviewQuestionEdit
                interviewQuestions={interviewQuestions}
                onUpdate={setInterviewQuestions}
            />
        </div>

        {/* 메모 */}
        <div ref={memoRef} className="cont-box">
            <MemoEdit memos={memos} onMemosChange={setMemos} />
        </div>

        {/* 체크리스트 */}
        <div ref={checklistRef} className="cont-box">
            <CheckListEdit
                checkList={checkList}
                onUpdate={setCheckList}
            />
        </div>

        {/* 첨부 */}
        <div ref={attachmentRef} className="cont-box">
        <AttachmentEdit attachments={attachments} onUpdate={handleUpdateAttachments} />
        </div>

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
});

TurnOverGoalEdit.displayName = 'TurnOverGoalEdit';

export default TurnOverGoalEdit;

