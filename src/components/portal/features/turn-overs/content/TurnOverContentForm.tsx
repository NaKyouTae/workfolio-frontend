import React, { useState, useEffect, useRef } from 'react';
import { TurnOverUpsertRequest } from '@/generated/turn_over';
import TurnOverGoalEdit, { TurnOverEditRef } from './edit/TurnOverGoalEdit';
import TurnOverChallengeEdit from './edit/TurnOverChallengeEdit';
import TurnOverRetrospectiveEdit from './edit/TurnOverRetrospectiveEdit';
import TurnOverContentTab, { TabType } from './TurnOverContentTab';
import TurnOverFloatingActions, { FloatingNavigationItem } from './TurnOverFloatingActions';
import Input from '@/components/portal/ui/Input';

interface TurnOverContentFormProps {
  name: string;
  turnOverRequest: TurnOverUpsertRequest | null;
  onNameChange: (name: string) => void;
  onTurnOverRequestChange?: (data: TurnOverUpsertRequest) => void;
  onSave?: (data: TurnOverUpsertRequest) => void;
  onCancel?: () => void;
}

const TurnOverContentForm: React.FC<TurnOverContentFormProps> = ({
  name,
  turnOverRequest,
  onNameChange,
  onTurnOverRequestChange,
  onSave,
  onCancel,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('goal');
  const [navigationItems, setNavigationItems] = useState<FloatingNavigationItem[]>([]);

  // 각 Edit 컴포넌트에 대한 ref
  const goalEditRef = useRef<TurnOverEditRef>(null);
  const challengeEditRef = useRef<TurnOverEditRef>(null);
  const retrospectiveEditRef = useRef<TurnOverEditRef>(null);

  const changeActiveTab = async (tab: TabType) => {
    setActiveTab(tab);
  };

  // 탭이 변경되거나 컴포넌트가 마운트될 때 네비게이션 아이템 업데이트
  useEffect(() => {
    const updateNavigationItems = () => {
      let items: FloatingNavigationItem[] = [];

      switch (activeTab) {
        case 'goal':
          items = goalEditRef.current?.getNavigationItems() || [];
          break;
        case 'challenge':
          items = challengeEditRef.current?.getNavigationItems() || [];
          break;
        case 'retrospective':
          items = retrospectiveEditRef.current?.getNavigationItems() || [];
          break;
      }

      setNavigationItems(items);
    };

    // 약간의 지연을 두고 네비게이션 아이템 업데이트 (컴포넌트 렌더링 완료 후)
    const timer = setTimeout(updateNavigationItems, 0);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const handleSave = (data: TurnOverUpsertRequest) => {
    // turnOverRequest 업데이트
    if (onTurnOverRequestChange) {
      onTurnOverRequestChange({
        ...data,
        name: name || '제목 없음',
      });
    }
    
    // 최종 저장
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
                        onChange={(e) => onNameChange(e.target.value)}
                    />
                </div>
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
                    ref={goalEditRef}
                    turnOverRequest={turnOverRequest || null} 
                    onSave={handleSave} 
                    />
                )}
                {activeTab === 'challenge' && (
                    <TurnOverChallengeEdit 
                    ref={challengeEditRef}
                    turnOverRequest={turnOverRequest || null} 
                    onSave={handleSave} 
                    />
                )}
                {activeTab === 'retrospective' && (
                    <TurnOverRetrospectiveEdit
                    ref={retrospectiveEditRef}
                    turnOverRequest={turnOverRequest || null}
                    onSave={handleSave}
                    />
                )}
            </article>
            
            <TurnOverFloatingActions
                navigationItems={navigationItems}
                onSave={onSave ? () => {
                  // 현재 활성 탭의 handleSave 호출
                  switch (activeTab) {
                    case 'goal':
                      goalEditRef.current?.handleSave();
                      break;
                    case 'challenge':
                      challengeEditRef.current?.handleSave();
                      break;
                    case 'retrospective':
                      retrospectiveEditRef.current?.handleSave();
                      break;
                  }
                } : undefined}
                onCancel={onCancel}
            />
        </div>
    </div>
  );
};

export default TurnOverContentForm;

