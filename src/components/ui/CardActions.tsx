import React from 'react';
import Image from 'next/image';
import styles from './CardActions.module.css';

interface CardActionsProps {
  isVisible: boolean;
  onToggleVisible: () => void;
  onDelete: () => void;
}

/**
 * 카드의 액션 버튼들을 관리하는 컴포넌트
 * - 보임/안보임 토글 버튼
 * - 삭제 버튼
 */
const CardActions: React.FC<CardActionsProps> = ({
  isVisible,
  onToggleVisible,
  onDelete,
}) => {
  return (
    <div className={styles.cardActions}>
      <button
        onClick={onToggleVisible}
        className={`${styles.visibleButton} ${isVisible ? styles.visible : ''}`}
        title={isVisible ? '보임' : '안보임'}
        type="button"
      >
        <Image
          src={isVisible ? '/assets/img/ico/ic-show.png' : '/assets/img/ico/ic-hide.png'}
          alt={isVisible ? '보임' : '안보임'}
          width={20}
          height={20}
          style={{ display: 'block' }}
        />
      </button>
      <button
        onClick={onDelete}
        className={styles.cardDeleteButton}
        title="삭제"
        type="button"
      >
        <Image
          src="/assets/img/ico/ic-minus.png"
          alt="삭제"
          width={20}
          height={20}
          style={{ display: 'block' }}
        />
      </button>
    </div>
  );
};

export default CardActions;
