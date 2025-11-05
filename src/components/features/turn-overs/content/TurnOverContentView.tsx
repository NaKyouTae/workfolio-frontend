import React, { useState } from 'react';
import { TurnOverDetail } from '@/generated/common';
import TurnOverGoalView from './view/TurnOverGoalView';
import TurnOverRetrospectiveView from './view/TurnOverRetrospectiveView';
import TurnOverChallengeView from './view/TurnOverChallengeView';
import styles from './TurnOverContentView.module.css';
import DateUtil from '@/utils/DateUtil';

interface TurnOversContentViewProps {
  selectedTurnOver: TurnOverDetail | null;
  onEdit?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const TurnOversContentView: React.FC<TurnOversContentViewProps> = ({ selectedTurnOver, onEdit, onDuplicate, onDelete }) => {
  const [activeTab, setActiveTab] = useState<'goal' | 'challenge' | 'retrospective'>('goal');

  const changeActiveTab = async (tab: 'goal' | 'challenge' | 'retrospective') => {
    setActiveTab(tab);
  };

  if (!selectedTurnOver) {
    return <div>이직 현황을 선택해주세요.</div>;
  }
    
  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>{selectedTurnOver?.name}</h1>
          <span className={styles.date}>
            최종 수정일: {DateUtil.formatTimestamp(selectedTurnOver?.updatedAt || 0, 'YYYY. MM. DD. HH:mm')}
          </span>
        </div>
        <div className={styles.actions}>
          <a className={styles.actionButton} onClick={() => onEdit?.(selectedTurnOver?.id || '')}>편집</a>
          <span className={styles.divider}>|</span>
          <a className={styles.actionButton} onClick={() => onDuplicate?.(selectedTurnOver?.id || '')}>복제</a>
          <span className={styles.divider}>|</span>
          <a className={styles.actionButton} onClick={() => onDelete?.(selectedTurnOver?.id || '')}>삭제</a>
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
          <TurnOverGoalView turnOverGoal={selectedTurnOver?.turnOverGoal || null} />
        )}
        {activeTab === 'challenge' && (
          <TurnOverChallengeView turnOverChallenge={selectedTurnOver?.turnOverChallenge || null} />
        )}
        {activeTab === 'retrospective' && (
          <TurnOverRetrospectiveView turnOverRetrospective={selectedTurnOver?.turnOverRetrospective || null} />
        )}
      </div>
    </div>
  );
};

export default TurnOversContentView;

