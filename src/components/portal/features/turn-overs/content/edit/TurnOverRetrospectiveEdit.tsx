import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef, useMemo, useCallback } from 'react';
import { DateUtil } from '@/utils/DateUtil';
import { TurnOverUpsertRequest, TurnOverUpsertRequest_MemoRequest, TurnOverUpsertRequest_TurnOverRetrospectiveRequest } from '@/generated/turn_over';
import { AttachmentRequest } from '@/generated/attachment';
import MemoEdit from '@/components/portal/features/turn-overs/content/edit/common/MemoEdit';
import AttachmentEdit from '@/components/portal/features/common/AttachmentEdit';
import { FloatingNavigationItem } from '@/components/portal/ui/FloatingNavigation';
import { TurnOverRetrospective_EmploymentType, JobApplication_JobApplicationStatus } from '@/generated/common';
import { TurnOverEditRef } from './TurnOverGoalEdit';
import Dropdown from '@/components/portal/ui/Dropdown';
import DatePicker from '@/components/portal/ui/DatePicker';
import { normalizeEnumValue, compareEnumValue } from '@/utils/commonUtils';
import { DateTime } from 'luxon';

interface TurnOverRetrospectiveEditProps {
  turnOverRequest: TurnOverUpsertRequest | null;
  onSave?: (data: TurnOverUpsertRequest) => void;
}

const TurnOverRetrospectiveEdit = forwardRef<TurnOverEditRef, TurnOverRetrospectiveEditProps>(({
  turnOverRequest,
  onSave,
}, ref) => {
  const [activeSection, setActiveSection] = useState<string>('finalChoice');
  
  // 각 섹션에 대한 ref
  const finalChoiceRef = useRef<HTMLDivElement>(null);
  const negotiationRef = useRef<HTMLDivElement>(null);
  const satisfactionRef = useRef<HTMLDivElement>(null);
  const memoRef = useRef<HTMLDivElement>(null);
  const attachmentRef = useRef<HTMLDivElement>(null);
  const [companyName, setCompanyName] = useState('');
  const [position, setPosition] = useState('');
  const [reason, setReason] = useState('');
  const [salary, setSalary] = useState(0);
  const [joinDate, setJoinDate] = useState<number | undefined>(undefined);
  const [employmentType, setEmploymentType] = useState<TurnOverRetrospective_EmploymentType>(TurnOverRetrospective_EmploymentType.EMPLOYMENT_TYPE_UNKNOWN);
  const [department, setDepartment] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [rank, setRank] = useState('');
  const [workType, setWorkType] = useState('');
  const [score, setScore] = useState(5);
  const [reviewSummary, setReviewSummary] = useState('');
  const [memos, setMemos] = useState<TurnOverUpsertRequest_MemoRequest[]>([]);
  const [attachments, setAttachments] = useState<AttachmentRequest[]>([]);

  // turnOverRequest가 초기 로드될 때만 state 업데이트
  const isInitializedRef = useRef(false);

  // 네비게이션 항목 정의 (각 탭에 따라 다른 네비게이션 표시 가능)
  // 섹션으로 스크롤하는 함수
  const scrollToSection = useCallback((sectionId: string) => {
    const refMap: { [key: string]: React.RefObject<HTMLDivElement | null> } = {
      finalChoice: finalChoiceRef,
      negotiation: negotiationRef,
      satisfaction: satisfactionRef,
      memo: memoRef,
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
        const offset = sectionId === 'finalChoice' ? 80 : 30; // 상단에서 100px 떨어진 위치로 스크롤
        
        const scrollTop = scrollContainer.scrollTop + (elementRect.top - containerRect.top) - offset;
        
        scrollContainer.scrollTo({
          top: scrollTop,
          behavior: 'smooth',
        });
      } else {
        // page-cont를 찾지 못한 경우 window 스크롤 사용
        requestAnimationFrame(() => {
          const elementTop = element.getBoundingClientRect().top + (window.pageYOffset || window.scrollY);
          const offset = sectionId === 'finalChoice' ? 80 : 30; // 상단에서 100px 떨어진 위치로 스크롤
          
          window.scrollTo({
            top: elementTop - offset,
            behavior: 'smooth',
          });
        });
      }
    }
  }, []);

  const getNavigationItems = useCallback((): FloatingNavigationItem[] => {
    return [
      {
        id: 'finalChoice',
        label: '최종 선택',
        isActive: activeSection === 'finalChoice',
        onClick: () => scrollToSection('finalChoice'),
      },
      {
        id: 'negotiation',
        label: '처우 협의',
        isActive: activeSection === 'negotiation',
        onClick: () => scrollToSection('negotiation'),
      },
      {
        id: 'satisfaction',
        label: '만족도 평가',
        isActive: activeSection === 'satisfaction',
        onClick: () => scrollToSection('satisfaction'),
      },
      {
        id: 'memo',
        label: '메모',
        isActive: activeSection === 'memo',
        onClick: () => scrollToSection('memo'),
      },
      {
        id: 'attachment',
        label: '첨부',
        isActive: activeSection === 'attachment',
        onClick: () => scrollToSection('attachment'),
      },
    ];
  }, [activeSection, scrollToSection]);

  // 합격한 지원 기록만 필터링
  const passedJobApplications = useMemo(() => {
    if (!turnOverRequest?.turnOverChallenge?.jobApplications) {
      return [];
    }
    return turnOverRequest.turnOverChallenge.jobApplications.filter(app =>
      compareEnumValue(app.status, JobApplication_JobApplicationStatus.PASSED, JobApplication_JobApplicationStatus)
    );
  }, [turnOverRequest]);

  // turnOverRequest가 초기 로드될 때만 state 업데이트
  useEffect(() => {
    // 초기 로드 시에만 turnOverRequest에서 state 초기화
    if (turnOverRequest?.turnOverRetrospective && !isInitializedRef.current) {
      setCompanyName(turnOverRequest.turnOverRetrospective.name || '');
      setPosition(turnOverRequest.turnOverRetrospective.position || '');
      setReason(turnOverRequest.turnOverRetrospective.reason || '');
      setSalary(turnOverRequest.turnOverRetrospective.salary || 0);
      setJoinDate(turnOverRequest.turnOverRetrospective.joinedAt || 0);
      setEmploymentType(turnOverRequest.turnOverRetrospective.employmentType || TurnOverRetrospective_EmploymentType.EMPLOYMENT_TYPE_UNKNOWN);
      setDepartment(turnOverRequest.turnOverRetrospective.department || '');
      setJobTitle(turnOverRequest.turnOverRetrospective.jobTitle || '');
      setRank(turnOverRequest.turnOverRetrospective.rank || '');
      setWorkType(turnOverRequest.turnOverRetrospective.workType || '');
      setScore(turnOverRequest.turnOverRetrospective.score || 5);
      setReviewSummary(turnOverRequest.turnOverRetrospective.reviewSummary || '');
      setMemos(turnOverRequest.turnOverRetrospective.memos || []);
      setAttachments(turnOverRequest.turnOverRetrospective.attachments || []);
      isInitializedRef.current = true;
    }
  }, [turnOverRequest]);

  const handleUpdateAttachments = (attachments: AttachmentRequest[]) => {
    setAttachments(attachments);
  };

  const handleSave = () => {
    if (onSave && turnOverRequest) {
      onSave({
        ...turnOverRequest,
        turnOverRetrospective: {
          id: turnOverRequest?.turnOverRetrospective?.id || undefined,
          name: companyName,
          position: position,
          reason: reason,
          salary: salary,
          joinedAt: joinDate,
          employmentType: employmentType,
          department: department,
          jobTitle: jobTitle,
          rank: rank,
          workType: workType,
          score: score,
          reviewSummary: reviewSummary,
          memos: memos,
          attachments: attachments,
        } as TurnOverUpsertRequest_TurnOverRetrospectiveRequest,
      } as TurnOverUpsertRequest);
    }
  };

  // ref를 통해 getNavigationItems와 handleSave 함수를 노출
  useImperativeHandle(ref, () => ({
    getNavigationItems,
    handleSave,
  }));

  return (
    <>
        {/* 최종 선택 */}
        <div ref={finalChoiceRef} className="cont-box">
            <div className="cont-tit">
                <div>
                    <h3>최종 선택</h3>
                </div>
            </div>
            <ul className="edit-list type1">
                <li>
                    <p>회사명</p>
                    <Dropdown
                        selectedOption={companyName || ''}
                        options={[
                            { value: '', label: '선택' },
                            ...passedJobApplications.map(app => ({
                                value: app.name || '',
                                label: app.name || '',
                            })),
                        ]}
                        setValue={(value) => {
                            const selectedApp = passedJobApplications.find(app => app.name === value);
                            setCompanyName(value as string);
                            if (selectedApp) {
                                setPosition(selectedApp.position || '');
                            }
                        }}
                    />
                </li>
                <li>
                    <p>직무</p>
                    <input
                        type="text"
                        placeholder="직무를 입력해 주세요."
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        readOnly={true}
                    />
                </li>
                <li className="full">
                    <p>선택 사유</p>
                    <textarea
                        placeholder="선택 사유를 입력해 주세요."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    />
                </li>
            </ul>
        </div>

        {/* 처우 협의 */}
        <div ref={negotiationRef} className="cont-box">
            <div className="cont-tit">
                <div>
                    <h3>처우 협의</h3>
                </div>
            </div>
            <ul className="edit-list type1">
                <li>
                    <p>입사 일자</p>
                    <DatePicker
                      value={DateUtil.formatTimestamp(joinDate || 0)}
                      onChange={(date) => setJoinDate(DateTime.fromISO(date).toMillis())}
                      required={false}
                    />
                </li>
                <li>
                    <p>재직 형태</p>
                    <Dropdown
                        selectedOption={normalizeEnumValue(employmentType, TurnOverRetrospective_EmploymentType)}
                        options={[
                            { value: TurnOverRetrospective_EmploymentType.EMPLOYMENT_TYPE_UNKNOWN, label: '선택' },
                            { value: TurnOverRetrospective_EmploymentType.FULL_TIME, label: '정규직' },
                            { value: TurnOverRetrospective_EmploymentType.CONTRACT, label: '계약직' },
                            { value: TurnOverRetrospective_EmploymentType.FREELANCER, label: '프리랜서' },
                            { value: TurnOverRetrospective_EmploymentType.INTERN, label: '인턴' },
                        ]}
                        setValue={(value) => setEmploymentType(normalizeEnumValue(value, TurnOverRetrospective_EmploymentType) || TurnOverRetrospective_EmploymentType.EMPLOYMENT_TYPE_UNKNOWN)}
                    />
                </li>
                <li>
                    <p>부서</p>
                    <input
                        type="text"
                        placeholder="부서를 입력해 주세요."
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                    />
                </li>
                <li>
                    <p>직무</p>
                    <input
                        type="text"
                        placeholder="직무를 입력해 주세요."
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        readOnly={true}
                    />
                </li>
                <li>
                    <p>직책</p>
                    <input
                        type="text"
                        placeholder="예) 파트장, 팀장, 분부장 등"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                    />
                </li>
                <li>
                    <p>직급</p>
                    <input
                        type="text"
                        placeholder="예) 사원, 대리, 과장 등"
                        value={rank}
                        onChange={(e) => setRank(e.target.value)}
                    />
                </li>
                <li>
                    <p>계약 연봉(만 원)</p>
                    <div className="input-desc">
                        <input 
                            type="text"
                            placeholder="예) 계약 연봉을 입력해 주세요."
                            value={salary}
                            onChange={(e) => setSalary(Number(e.target.value))}
                        />
                        <span>만 원</span>
                    </div>
                </li>
                <li>
                    <p>근무 형태</p>
                    <input
                        type="text"
                        placeholder="예) 재택, 유연근무 등"
                        value={workType}
                        onChange={(e) => setWorkType(e.target.value)}
                    />
                </li>
            </ul>
        </div>

        {/* 만족도 평가 */}
        <div ref={satisfactionRef} className="cont-box">
            <div className="cont-tit">
                <div>
                    <h3>만족도 평가</h3>
                </div>
            </div>
            <ul className="edit-list type2">
                <li>
                    <p>점수</p>
                    <ul className="input-list">
                        {[1, 2, 3, 4, 5].map((value) => {
                          const radioId = `score-${value}`;
                          return (
                            <li key={value}>
                                <input
                                    id={radioId}
                                    type="radio"
                                    name="score"
                                    value={value}
                                    checked={Number(score) === value}
                                    onChange={() => setScore(value)}
                                />
                                <label htmlFor={radioId}><p>{value}점</p></label>
                            </li>
                          );
                        })}
                    </ul>
                </li>
                <li>
                    <p>한 줄 회고</p>
                    <input
                        placeholder="회고 내용을 입력해 주세요."
                        value={reviewSummary}
                        onChange={(e) => setReviewSummary(e.target.value)}
                    />
                </li>
            </ul>
        </div>

        {/* 메모 */}
        <div ref={memoRef} className="cont-box">
            <MemoEdit memos={memos} onMemosChange={setMemos} />
        </div>

        {/* 첨부 */}
        <div ref={attachmentRef} className="cont-box">
            <AttachmentEdit attachments={attachments} onUpdate={handleUpdateAttachments} />
        </div>
    </>
  );
});

TurnOverRetrospectiveEdit.displayName = 'TurnOverRetrospectiveEdit';

export default TurnOverRetrospectiveEdit;

