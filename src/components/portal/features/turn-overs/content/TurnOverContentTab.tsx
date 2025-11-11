import React from 'react';

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
    <div className="tab-sticky">
        <ul className="tab-style1">
            <li><button className={`${activeTab === 'goal' ? 'active' : ''}`} onClick={() => onTabChange('goal')}>목표</button></li>
            <li><button className={`${activeTab === 'challenge' ? 'active' : ''}`} onClick={() => onTabChange('challenge')}>도전</button></li>
            <li><button className={`${activeTab === 'retrospective' ? 'active' : ''}`} onClick={() => onTabChange('retrospective')}>회고</button></li>
        </ul>
    </div>
  );
};

export default TurnOverContentTab;

