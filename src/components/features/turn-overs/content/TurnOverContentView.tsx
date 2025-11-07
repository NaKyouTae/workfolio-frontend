import React, { useState } from 'react';
import { TurnOverDetail } from '@/generated/common';
import TurnOverGoalView from './view/TurnOverGoalView';
import TurnOverRetrospectiveView from './view/TurnOverRetrospectiveView';
import TurnOverChallengeView from './view/TurnOverChallengeView';
import TurnOverContentViewHeader from './TurnOverContentViewHeader';
import TurnOverContentTab, { TabType } from './TurnOverContentTab';
import styles from './TurnOverContentView.module.css';

interface TurnOversContentViewProps {
  selectedTurnOver: TurnOverDetail | null;
  onEdit?: () => void;
  onDuplicate?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const TurnOversContentView: React.FC<TurnOversContentViewProps> = ({ selectedTurnOver, onEdit, onDuplicate, onDelete }) => {
  const [activeTab, setActiveTab] = useState<TabType>('goal');

  const changeActiveTab = async (tab: TabType) => {
    setActiveTab(tab);
  };

  if (!selectedTurnOver) {
    return <div>이직 현황을 선택해주세요.</div>;
  }
    
  return (
    <div className="contents">
        {/* Header */}
        <TurnOverContentViewHeader
        title={selectedTurnOver.name}
        updatedAt={selectedTurnOver.updatedAt}
        onEdit={onEdit}
        onDuplicate={() => onDuplicate?.(selectedTurnOver.id)}
        onDelete={() => onDelete?.(selectedTurnOver.id)}
        />

        <div className="page-cont">
            <article>
                <TurnOverContentTab
                    activeTab={activeTab}
                    onTabChange={changeActiveTab}
                />

                {activeTab === 'goal' && (
                    <TurnOverGoalView turnOverGoal={selectedTurnOver?.turnOverGoal || null} />
                )}
                {activeTab === 'challenge' && (
                    <TurnOverChallengeView turnOverChallenge={selectedTurnOver?.turnOverChallenge || null} />
                )}
                {activeTab === 'retrospective' && (
                    <TurnOverRetrospectiveView turnOverRetrospective={selectedTurnOver?.turnOverRetrospective || null} />
                )}
            </article>
        </div>
    </div>
  );
};

export default TurnOversContentView;

