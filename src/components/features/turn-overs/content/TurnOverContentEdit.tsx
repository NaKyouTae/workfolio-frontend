import React, { useEffect, useState } from 'react';
import { TurnOverDetail } from '@/generated/common';
import TurnOverGoalEdit from './edit/TurnOverGoalEdit';
import TurnOverChallengeEdit from './edit/TurnOverChallengeEdit';
import TurnOverRetrospectiveEdit from './edit/TurnOverRetrospectiveEdit';
import DateUtil from '@/utils/DateUtil';
import { useTurnOver } from '@/hooks/useTurnOver';
import styles from './TurnOverContentEdit.module.css';

interface TurnOverContentEditProps {
  selectedTurnOverId: string;
  onCancel?: () => void;
  onSave?: () => void;
}

const TurnOverContentEdit: React.FC<TurnOverContentEditProps> = ({
  selectedTurnOverId,
  onCancel,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<'goal' | 'challenge' | 'retrospective'>('goal');
  const [selectedTurnOver, setSelectedTurnOver] = useState<TurnOverDetail | null>(null);

  const { getTurnOverDetail } = useTurnOver();

  const changeActiveTab = async (tab: 'goal' | 'challenge' | 'retrospective') => {
    setActiveTab(tab);
    const turnOverDetail = await getTurnOverDetail(selectedTurnOverId);
    if (turnOverDetail) {
      setSelectedTurnOver(turnOverDetail);
    }
  };

  useEffect(() => {
    getTurnOverDetail(selectedTurnOverId).then((turnOverDetail) => {
      if (turnOverDetail) {
        setSelectedTurnOver(turnOverDetail);
      }
    });
  }, [selectedTurnOverId, getTurnOverDetail]);

  const handleSave = () => {
    // TODO: 저장 로직 구현
    if (onSave) {
      onSave();
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>기록할 이직 활동명을 입력해 주세요 (예: 2025년 01월 이직 활동)</h1>
          <span className={styles.date}>
            최종 수정일: {DateUtil.formatTimestamp(selectedTurnOver?.updatedAt || 0, 'YYYY. MM. DD. HH:mm')}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'goal' ? styles.tabActive : ''}`}
          onClick={() => changeActiveTab('goal')}
        >
          목표
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'challenge' ? styles.tabActive : ''}`}
          onClick={() => changeActiveTab('challenge')}
        >
          도전
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'retrospective' ? styles.tabActive : ''}`}
          onClick={() => changeActiveTab('retrospective')}
        >
          회고
        </button>
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {activeTab === 'goal' && (
          <TurnOverGoalEdit turnOverGoal={selectedTurnOver?.turnOverGoal || null} />
        )}
        {activeTab === 'challenge' && (
          <TurnOverChallengeEdit turnOverChallenge={selectedTurnOver?.turnOverChallenge || null} />
        )}
        {activeTab === 'retrospective' && (
          <TurnOverRetrospectiveEdit
            turnOverRetrospective={selectedTurnOver?.turnOverRetrospective || null}
          />
        )}
      </div>

      {/* Floating Action Buttons */}
      <div className={styles.floatingActions}>
        <button className={styles.saveButton} onClick={handleSave}>
          저장하기
        </button>
        <button className={styles.cancelButton} onClick={onCancel}>
          취소
        </button>
      </div>
    </div>
  );
};

export default TurnOverContentEdit;

