import React, { useState, useEffect, useRef } from 'react';
import styles from './TurnOverRetrospectiveEdit.module.css';
import { DateUtil } from '@/utils/DateUtil';
import { TurnOverUpsertRequest, TurnOverUpsertRequest_MemoRequest, TurnOverUpsertRequest_TurnOverRetrospectiveRequest } from '@/generated/turn_over';
import { AttachmentRequest } from '@/generated/attachment';
import MemoEdit from '@/components/portal/features/turn-overs/content/edit/common/MemoEdit';
import AttachmentEdit from '@/components/portal/features/common/AttachmentEdit';
import TurnOverFloatingActions, { FloatingNavigationItem } from '../TurnOverFloatingActions';
import { TurnOverRetrospective_EmploymentType } from '@/generated/common';

interface TurnOverRetrospectiveEditProps {
  turnOverRequest: TurnOverUpsertRequest | null;
  onSave?: (data: TurnOverUpsertRequest) => void;
  onCancel?: () => void;
}

const TurnOverRetrospectiveEdit: React.FC<TurnOverRetrospectiveEditProps> = ({
  turnOverRequest,
  onSave,
  onCancel,
}) => {
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

  // 네비게이션 항목 정의 (각 탭에 따라 다른 네비게이션 표시 가능)
  // 섹션으로 스크롤하는 함수
  const scrollToSection = (sectionId: string) => {
    const refMap: { [key: string]: React.RefObject<HTMLDivElement | null> } = {
      finalChoice: finalChoiceRef,
      negotiation: negotiationRef,
      satisfaction: satisfactionRef,
      memo: memoRef,
      attachment: attachmentRef,
    };

    const ref = refMap[sectionId];
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
    }
  };

  const getNavigationItems = (): FloatingNavigationItem[] => {
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
  };

  // turnOverRetrospective가 변경될 때마다 state 업데이트
  useEffect(() => {
    if (turnOverRequest) {
      setCompanyName(turnOverRequest.turnOverRetrospective?.name || '');
      setPosition(turnOverRequest.turnOverRetrospective?.position || '');
      setReason(turnOverRequest.turnOverRetrospective?.reason || '');
      setSalary(turnOverRequest.turnOverRetrospective?.salary || 0);
      setJoinDate(turnOverRequest.turnOverRetrospective?.joinedAt ? DateUtil.normalizeTimestamp(turnOverRequest.turnOverRetrospective.joinedAt) : undefined);
      setDepartment(turnOverRequest.turnOverRetrospective?.department || '');
      setJobTitle(turnOverRequest.turnOverRetrospective?.jobTitle || '');
      setRank(turnOverRequest.turnOverRetrospective?.rank || '');
      setWorkType(turnOverRequest.turnOverRetrospective?.workType || '');
      setScore(turnOverRequest.turnOverRetrospective?.score || 5);
      setReviewSummary(turnOverRequest.turnOverRetrospective?.reviewSummary || '');
      setMemos(turnOverRequest.turnOverRetrospective?.memos || []);
      setAttachments(turnOverRequest.turnOverRetrospective?.attachments || []);
    }
  }, [turnOverRequest]);

  const handleUpdateAttachments = (attachments: AttachmentRequest[]) => {
    setAttachments(attachments);
  };

  const handleSave = () => {
    if (onSave) {
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

  return (
    <div className={styles.container}>
      <div className={styles.contentInner}>
      {/* 최종 선택 */}
      <div ref={finalChoiceRef} className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>최종 선택</h2>
        </div>
        <div className={styles.sectionContent}>
          <div className={styles.inputRow}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>회사명</label>
              <select className={styles.select} value={companyName} onChange={(e) => setCompanyName(e.target.value)}>
                <option value="">선택</option>
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>직무</label>
              <input
                type="text"
                className={styles.input}
                placeholder="직무를 입력해 주세요."
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>선택 사유</label>
            <textarea
              className={styles.textarea}
              placeholder="선택 사유를 입력해 주세요."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* 처우 협의 */}
      <div ref={negotiationRef} className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>자우 협의</h2>
        </div>
        <div className={styles.sectionContent}>
          <div className={styles.inputRow}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>입사 일자</label>
              <input
                type="text"
                className={styles.input}
                placeholder="YYYY. MM. DD."
                value={joinDate}
                onChange={(e) => setJoinDate(DateUtil.normalizeTimestamp(e.target.value))}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>재직 형태</label>
              <select className={styles.select} value={employmentType} onChange={(e) => setEmploymentType(e.target.value as unknown as TurnOverRetrospective_EmploymentType)}>
                <option value={TurnOverRetrospective_EmploymentType.EMPLOYMENT_TYPE_UNKNOWN.toString()}>선택</option>
                <option value={TurnOverRetrospective_EmploymentType.FULL_TIME.toString()}>정규직</option>
                <option value={TurnOverRetrospective_EmploymentType.CONTRACT.toString()}>계약직</option>
                <option value={TurnOverRetrospective_EmploymentType.FREELANCER.toString()}>프리랜서</option>
                <option value={TurnOverRetrospective_EmploymentType.INTERN.toString()}>인턴</option>
              </select>
            </div>
          </div>
          <div className={styles.inputRow}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>부서</label>
              <input
                type="text"
                className={styles.input}
                placeholder="부서를 입력해 주세요."
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>직무</label>
              <input
                type="text"
                className={styles.input}
                placeholder="직무를 입력해 주세요."
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.inputRow}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>직책</label>
              <input
                type="text"
                className={styles.input}
                placeholder="(예) 파트장, 팀장, 분부장 등"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>직급</label>
              <input
                type="text"
                className={styles.input}
                placeholder="(예) 사원, 대리, 과장 등"
                value={rank}
                onChange={(e) => setRank(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.inputRow}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>계약 연봉(만원)</label>
              <input
                type="text"
                className={styles.input}
                placeholder="(예) 10000"
                value={salary}
                onChange={(e) => setSalary(Number(e.target.value))}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>근무 형태</label>
              <input
                type="text"
                className={styles.input}
                placeholder="(예) 재택, 출퇴근자유 등"
                value={workType}
                onChange={(e) => setWorkType(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 만족도 평가 */}
      <div ref={satisfactionRef} className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>만족도 평가</h2>
        </div>
        <div className={styles.sectionContent}>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>점수</label>
            <div className={styles.scoreGroup}>
              {[1, 2, 3, 4, 5].map((value) => (
                <label key={value} className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="score"
                    value={value}
                    checked={score === value}
                    onChange={() => setScore(value)}
                  />
                  {value}점
                </label>
              ))}
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>한 줄 회고</label>
            <textarea
              className={styles.textarea}
              placeholder="회고 내용을 입력해 주세요."
              value={reviewSummary}
              onChange={(e) => setReviewSummary(e.target.value)}
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* 메모 */}
      <div ref={memoRef}>
        <MemoEdit memos={memos} onMemosChange={setMemos} />
      </div>

      {/* 첨부 */}
      <div ref={attachmentRef}>
        <AttachmentEdit attachments={attachments} onUpdate={handleUpdateAttachments} />
      </div>
      </div>

      {/* Floating Action Buttons */}
      <TurnOverFloatingActions 
        navigationItems={getNavigationItems()}
        onSave={handleSave}
        onCancel={() => onCancel?.()}
      />
    </div>
  );
};

export default TurnOverRetrospectiveEdit;

