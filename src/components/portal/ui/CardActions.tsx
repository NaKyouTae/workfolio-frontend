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
    <div className="edit-btn">
        <button
            onClick={onToggleVisible}
            className={`line gray ${isVisible ? styles.visible : ''}`}
            title={isVisible ? '노출' : '숨김'}
            type="button"
        >
            <Image
                src={isVisible ? '/assets/img/ico/ic-show.svg' : '/assets/img/ico/ic-hide.svg'}
                alt={isVisible ? '노출' : '숨김'}
                width={1}
                height={1}
            />
        </button>
        <button
            onClick={onDelete}
            title="삭제"
            type="button"
            className="gray"
        >
            <Image
                src="/assets/img/ico/ic-minus.svg"
                alt="삭제"
                width={1}
                height={1}
            />
        </button>
    </div>
  );
};

export default CardActions;
