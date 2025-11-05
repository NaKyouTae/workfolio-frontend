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
    <div className={styles.floatingActions}>
      {/* 네비게이션 메뉴 */}
      {navigationItems && navigationItems.length > 0 && (
        <div className={styles.floatingNavigation}>
          {navigationItems.map((item) => (
            <button
              key={item.id}
              className={`${styles.navItem} ${item.isActive ? styles.navItemActive : ''}`}
              onClick={item.onClick}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* 액션 버튼 */}
      {showButtons && (
        <div className={styles.floatingButtons}>
          {onSave && (
            <button className={styles.saveButton} onClick={onSave}>
              저장하기
            </button>
          )}
          {onCancel && (
            <button className={styles.cancelButton} onClick={onCancel}>
              취소하기
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TurnOverFloatingActions;

