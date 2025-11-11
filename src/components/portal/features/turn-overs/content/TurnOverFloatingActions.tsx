import React from 'react';
import styles from './TurnOverFloatingActions.module.css';

export interface FloatingNavigationItem {
  id: string;
  label: string;
  isActive?: boolean;
  onClick: () => void;
}

interface TurnOverFloatingActionsProps {
  navigationItems?: FloatingNavigationItem[];
  onSave?: () => void;
  onCancel?: () => void;
}

/**
 * 플로팅 액션 버튼 컴포넌트
 * 네비게이션 메뉴와 저장/취소 버튼을 포함합니다.
 * onSave, onCancel이 없으면 버튼을 표시하지 않습니다.
 */
const TurnOverFloatingActions: React.FC<TurnOverFloatingActionsProps> = ({
  navigationItems,
  onSave,
  onCancel,
}) => {
  const showButtons = onSave || onCancel;

  return (
    <nav>
        {navigationItems && navigationItems.length > 0 && (
            <ul className="nav-wrap">
                {navigationItems.map((item) => (
                    <li
                        key={item.id}
                        className={`${item.isActive ? 'active' : ''}`}
                        onClick={item.onClick}
                    >
                    {item.label}
                    </li>
                ))}
            </ul>
        )}
        {showButtons && (
            <div className="nav-btn">
                {onSave && (
                    <button className="dark-gray" onClick={onSave}>저장하기</button>
                )}
                {onCancel && (
                    <button className="line gray" onClick={onCancel}>취소</button>
                )}
            </div>
        )}
    </nav>
  );
};

export default TurnOverFloatingActions;

