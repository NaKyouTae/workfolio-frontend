import React from 'react';
import styles from './EditFloatingActions.module.css';

export interface FloatingNavigationItem {
  id: string;
  label: string;
  isActive?: boolean;
  onClick: () => void;
}

interface EditFloatingActionsProps {
  navigationItems?: FloatingNavigationItem[];
  onSave: () => void;
  onCancel: () => void;
}

/**
 * 편집 모드 플로팅 액션 버튼 컴포넌트
 * 네비게이션 메뉴와 저장/취소 버튼을 포함합니다.
 */
const EditFloatingActions: React.FC<EditFloatingActionsProps> = ({
  navigationItems,
  onSave,
  onCancel,
}) => {
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
      <div className={styles.floatingButtons}>
        <button className={styles.saveButton} onClick={onSave}>
          저장하기
        </button>
        <button className={styles.cancelButton} onClick={onCancel}>
          취소하기
        </button>
      </div>
    </div>
  );
};

export default EditFloatingActions;

