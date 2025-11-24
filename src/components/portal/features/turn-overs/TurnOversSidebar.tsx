import React from 'react';
import { TurnOver, TurnOverDetail } from '@/generated/common';

interface TurnOversSidebarProps {
  turnOvers: TurnOver[];
  selectedTurnOver: TurnOverDetail | null;
  onGoHome: () => void;
  refreshTurnOvers: () => void;
  onTurnOverSelect: (id: string) => void;
  onTurnOverCreated: () => void;
}

const TurnOversSidebar: React.FC<TurnOversSidebarProps> = ({ turnOvers, selectedTurnOver, onGoHome, onTurnOverSelect, onTurnOverCreated }) => {
  const handleTurnOverSelect = (id: string) => {
    onTurnOverSelect(id)
  };
  
  const handleTurnOverCreated = () => {
    onTurnOverCreated();
  };

  return (
    <aside> 
        <div className="aside-button">
            <button className="md" onClick={handleTurnOverCreated}>신규 이직 추가</button>
        </div>
        {/* 이력서 섹션 */}
        <div className="aside-cont">
            <div className={`aside-home ${selectedTurnOver === null ? 'active' : ''}`} onClick={onGoHome}>내 이직 관리</div>
            <div className="aside-group">
                <p className="aside-group-title">내 이직 활동</p>
                <ul className="aside-group-list">
                    {turnOvers.map((turnOver) => {
                        return (
                            <li
                                key={turnOver.id}
                                className={turnOver.id === selectedTurnOver?.id ? 'active' : ''}  
                                onClick={() => handleTurnOverSelect(turnOver.id)}
                            >
                                <p>{turnOver.name}</p>
                            </li>
                        );
                    })}
                    {/* 빈 배열일 때는 아무것도 표시하지 않음 (로딩 중 이전 데이터 유지) */}
                </ul>
            </div>
        </div>
    </aside>
  );
};

export default TurnOversSidebar;
