import React, { useEffect, useState } from 'react';
import { TurnOverDetail, TurnOverRetrospective_EmploymentType } from '@/generated/common';
import TurnOverGoalEdit from './edit/TurnOverGoalEdit';
import { TurnOverUpsertRequest, TurnOverUpsertRequest_TurnOverChallengeRequest, TurnOverUpsertRequest_TurnOverGoalRequest, TurnOverUpsertRequest_TurnOverRetrospectiveRequest } from '@/generated/turn_over';
import TurnOverChallengeEdit from './edit/TurnOverChallengeEdit';
import TurnOverRetrospectiveEdit from './edit/TurnOverRetrospectiveEdit';
import TurnOverContentTab, { TabType } from './TurnOverContentTab';
import Input from '@/components/portal/ui/Input';

interface TurnOverContentEditProps {
  selectedTurnOver: TurnOverDetail | null;
  onCancel?: () => void;
  onSave?: (data: TurnOverUpsertRequest) => void;
}

const TurnOverContentEdit: React.FC<TurnOverContentEditProps> = ({
  selectedTurnOver,
  onCancel,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [turnOverRequest, setTurnOverRequest] = useState<TurnOverUpsertRequest | null>(null);

  const [activeTab, setActiveTab] = useState<TabType>('goal');

  const changeActiveTab = async (tab: TabType) => {
    setActiveTab(tab);
  };

  // selectedTurnOver가 변경될 때만 초기화
  useEffect(() => {
    setName(selectedTurnOver?.name || '');
    
    setTurnOverRequest({
      id: selectedTurnOver?.id || undefined,
      name: selectedTurnOver?.name || '제목 없음',
      turnOverGoal: {
        id: selectedTurnOver?.turnOverGoal?.id || undefined,
        reason: selectedTurnOver?.turnOverGoal?.reason || '',
        goal: selectedTurnOver?.turnOverGoal?.goal || '',
        selfIntroductions: selectedTurnOver?.turnOverGoal?.selfIntroductions || [],
        interviewQuestions: selectedTurnOver?.turnOverGoal?.interviewQuestions || [],
        checkList: selectedTurnOver?.turnOverGoal?.checkList || [],
        memos: selectedTurnOver?.turnOverGoal?.memos || [],
        attachments: selectedTurnOver?.turnOverGoal?.attachments || [],
      } as TurnOverUpsertRequest_TurnOverGoalRequest,
      turnOverChallenge: {
        id: selectedTurnOver?.turnOverChallenge?.id || undefined,
        memos: selectedTurnOver?.turnOverChallenge?.memos || [],
        attachments: selectedTurnOver?.turnOverChallenge?.attachments || [],
        jobApplications: selectedTurnOver?.turnOverChallenge?.jobApplications || [],
      } as TurnOverUpsertRequest_TurnOverChallengeRequest,
      turnOverRetrospective: {
        id: selectedTurnOver?.turnOverRetrospective?.id || undefined,
        name: selectedTurnOver?.turnOverRetrospective?.name || '',
        salary: selectedTurnOver?.turnOverRetrospective?.salary || 0,
        position: selectedTurnOver?.turnOverRetrospective?.position || '',
        jobTitle: selectedTurnOver?.turnOverRetrospective?.jobTitle || '',
        rank: selectedTurnOver?.turnOverRetrospective?.rank || '',
        reason: selectedTurnOver?.turnOverRetrospective?.reason || '',
        score: selectedTurnOver?.turnOverRetrospective?.score || 0,
        reviewSummary: selectedTurnOver?.turnOverRetrospective?.reviewSummary || '',
        department: selectedTurnOver?.turnOverRetrospective?.department || '',
        memos: selectedTurnOver?.turnOverRetrospective?.memos || [],
        attachments: selectedTurnOver?.turnOverRetrospective?.attachments || [],
        workType: selectedTurnOver?.turnOverRetrospective?.workType || '',
        employmentType: selectedTurnOver?.turnOverRetrospective?.employmentType || TurnOverRetrospective_EmploymentType.EMPLOYMENT_TYPE_UNKNOWN,
      } as TurnOverUpsertRequest_TurnOverRetrospectiveRequest,
    } as TurnOverUpsertRequest);
  }, [selectedTurnOver]);

  const handleSave = (data: TurnOverUpsertRequest) => {
    if (onSave) {
      // name을 업데이트하여 저장
      onSave({
        ...data,
        name: name || '제목 없음',
      });
    }
  };

  return (
    <div className="contents">
        {/* Header */}
        <div className="page-title">
            <div>
                <div>
                    <Input
                        type="text"
                        label="제목"
                        placeholder="기록할 이직 활동명을 입력해 주세요.(예: 2025년 01월 이직 활동)"
                        value={name}
                    />
                </div>
                {/* <h1 
                    className={styles.title}
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => setName(e.currentTarget.textContent || '')}
                    onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        e.currentTarget.blur();
                    }
                    }}
                >{name || '기록할 이직 활동명을 입력해 주세요 (예: 2025년 01월 이직 활동)'}</h1> */}
            </div>
        </div>
        <div className="page-cont">
            <article>
                <TurnOverContentTab
                    activeTab={activeTab}
                    onTabChange={changeActiveTab}
                />
                {activeTab === 'goal' && (
                    <TurnOverGoalEdit 
                    turnOverRequest={turnOverRequest || null} 
                    onSave={handleSave} 
                    onCancel={onCancel} 
                    />
                )}
                {activeTab === 'challenge' && (
                    <TurnOverChallengeEdit 
                    turnOverRequest={turnOverRequest || null} 
                    onSave={handleSave} 
                    onCancel={onCancel} 
                    />
                )}
                {activeTab === 'retrospective' && (
                    <TurnOverRetrospectiveEdit
                    turnOverRequest={turnOverRequest || null}
                    onSave={handleSave}
                    onCancel={onCancel}
                    />
                )}
            </article>
        </div>
    </div>
  );
};

export default TurnOverContentEdit;
