import React from 'react';
import styles from './TurnOverContentTab.module.css';

export type TabType = 'goal' | 'challenge' | 'retrospective';

interface TurnOverContentTabProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TurnOverContentTab: React.FC<TurnOverContentTabProps> = ({ 
  activeTab, 
  onTabChange 
}) => {
  return (
    <div className={styles.tabs}>
      <button
        className={`${styles.tab} ${activeTab === 'goal' ? styles.tabActive : ''}`}
        onClick={() => onTabChange('goal')}
      >
        목표
      </button>
      <button
        className={`${styles.tab} ${activeTab === 'challenge' ? styles.tabActive : ''}`}
        onClick={() => onTabChange('challenge')}
      >
        도전
      </button>
      <button
        className={`${styles.tab} ${activeTab === 'retrospective' ? styles.tabActive : ''}`}
        onClick={() => onTabChange('retrospective')}
      >
        회고
      </button>
    </div>
  );
};

export default TurnOverContentTab;

