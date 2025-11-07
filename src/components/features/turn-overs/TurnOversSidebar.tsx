import React, { useEffect } from 'react';
import { TurnOver } from '@/generated/common';

interface TurnOversSidebarProps {
  turnOvers: TurnOver[];
  onGoHome: () => void;
  refreshTurnOvers: () => void;
  onTurnOverSelect: (id: string) => void;
  onTurnOverCreated: () => void;
}

const TurnOversSidebar: React.FC<TurnOversSidebarProps> = ({ turnOvers, onGoHome, refreshTurnOvers, onTurnOverSelect, onTurnOverCreated }) => {

  const handleTurnOverCreated = () => {
    onTurnOverCreated();
  };

  useEffect(() => {
    refreshTurnOvers();
  }, [refreshTurnOvers]);

  return (
    <aside> 
        <div className="aside-button">
            <button className="md" onClick={handleTurnOverCreated}>신규 이직 추가</button>
        </div>
        {/* 이력서 섹션 */}
        <div className="aside-cont">
            <div className={`aside-home`} onClick={onGoHome}>내 이직 관리</div>
            <div className="aside-group">
                <p className="aside-group-title">내 이직 활동</p>
                <ul className="aside-group-list">
                    {turnOvers.length > 0 ? (
                        <>
                        {turnOvers.map((turnOver) => {
                            return (
                                <li
                                    key={turnOver.id}
                                    onClick={() => onTurnOverSelect(turnOver.id)}
                                >
                                    <p>{turnOver.name}</p>
                                </li>
                            );
                        })}
                        </>
                    ) : (
                        <li>
                          <div className="empty">아직 등록된 이직 활동이 없어요.</div>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    </aside>
  );
};

export default TurnOversSidebar;
