import React, { useState, useRef, useEffect } from 'react';
import { TurnOverDetail } from '@/generated/common';
import TurnOverGoalView, { TurnOverViewRef } from './view/TurnOverGoalView';
import TurnOverRetrospectiveView from './view/TurnOverRetrospectiveView';
import TurnOverChallengeView from './view/TurnOverChallengeView';
import TurnOverContentViewHeader from './TurnOverContentViewHeader';
import TurnOverContentTab, { TabType } from './TurnOverContentTab';
import TurnOverFloatingActions, { FloatingNavigationItem } from './TurnOverFloatingActions';

interface TurnOversContentViewProps {
  selectedTurnOver: TurnOverDetail | null;
  onEdit?: () => void;
  onDuplicate?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const TurnOversContentView: React.FC<TurnOversContentViewProps> = ({ selectedTurnOver, onEdit, onDuplicate, onDelete }) => {
  const [activeTab, setActiveTab] = useState<TabType>('goal');
  const [navigationItems, setNavigationItems] = useState<FloatingNavigationItem[]>([]);

  // 각 뷰 컴포넌트에 대한 ref
  const goalViewRef = useRef<TurnOverViewRef>(null);
  const challengeViewRef = useRef<TurnOverViewRef>(null);
  const retrospectiveViewRef = useRef<TurnOverViewRef>(null);

  const changeActiveTab = async (tab: TabType) => {
    setActiveTab(tab);
  };

  // 탭이 변경되거나 컴포넌트가 마운트될 때 네비게이션 아이템 업데이트
  useEffect(() => {
    const updateNavigationItems = () => {
      let items: FloatingNavigationItem[] = [];

      switch (activeTab) {
        case 'goal':
          items = goalViewRef.current?.getNavigationItems() || [];
          break;
        case 'challenge':
          items = challengeViewRef.current?.getNavigationItems() || [];
          break;
        case 'retrospective':
          items = retrospectiveViewRef.current?.getNavigationItems() || [];
          break;
      }

      setNavigationItems(items);
    };

    // 약간의 지연을 두고 네비게이션 아이템 업데이트 (컴포넌트 렌더링 완료 후)
    const timer = setTimeout(updateNavigationItems, 0);
    return () => clearTimeout(timer);
  }, [activeTab]);

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
                    <TurnOverGoalView 
                    ref={goalViewRef} 
                    turnOverGoal={selectedTurnOver?.turnOverGoal || null} />
                )}
                {activeTab === 'challenge' && (
                    <TurnOverChallengeView 
                    ref={challengeViewRef} 
                    turnOverChallenge={selectedTurnOver?.turnOverChallenge || null} />
                )}
                {activeTab === 'retrospective' && (
                    <TurnOverRetrospectiveView 
                    ref={retrospectiveViewRef} 
                    turnOverRetrospective={selectedTurnOver?.turnOverRetrospective || null} />
                )}
            </article>
            {/* Floating Navigation */}
            <TurnOverFloatingActions navigationItems={navigationItems} />
        </div>
    </div>
  );
};

export default TurnOversContentView;

