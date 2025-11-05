import React from 'react';
import DateUtil from '@/utils/DateUtil';
import styles from './TurnOverContentViewHeader.module.css';

interface TurnOverContentViewHeaderProps {
  title: string;
  updatedAt: number;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
}

const TurnOverContentViewHeader: React.FC<TurnOverContentViewHeaderProps> = ({ 
  title, 
  updatedAt, 
  onEdit, 
  onDuplicate, 
  onDelete 
}) => {
  return (
    <div className={styles.header}>
      <div className={styles.titleSection}>
        <h1 className={styles.title}>{title}</h1>
        <span className={styles.date}>
          최종 수정일: {DateUtil.formatTimestamp(updatedAt, 'YYYY. MM. DD. HH:mm')}
        </span>
      </div>
      <div className={styles.actions}>
        {onEdit && (
          <>
            <a className={styles.actionButton} onClick={onEdit}>편집</a>
            <span className={styles.divider}>|</span>
          </>
        )}
        {onDuplicate && (
          <>
            <a className={styles.actionButton} onClick={onDuplicate}>복제</a>
            <span className={styles.divider}>|</span>
          </>
        )}
        {onDelete && (
          <a className={styles.actionButton} onClick={onDelete}>삭제</a>
        )}
      </div>
    </div>
  );
};

export default TurnOverContentViewHeader;

