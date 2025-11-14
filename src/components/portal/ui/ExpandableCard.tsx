'use client';

import React, { useState } from 'react';
import styles from './ExpandableCard.module.css';

interface ExpandableCardProps {
  title: string;
  content: React.ReactNode;
  badge?: {
    text: string;
    variant?: 'important' | 'general';
  };
  date?: string;
  defaultExpanded?: boolean;
  onToggle?: (expanded: boolean) => void;
}

const ExpandableCard: React.FC<ExpandableCardProps> = ({
  title,
  content,
  badge,
  date,
  defaultExpanded = false,
  onToggle,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const handleToggle = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    if (onToggle) {
      onToggle(newExpanded);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header} onClick={handleToggle}>
        <div className={styles.headerLeft}>
          {badge && (
            <span className={`${styles.badge} ${styles[badge.variant || 'general']}`}>
              {badge.text}
            </span>
          )}
          <h3 className={styles.title}>{title}</h3>
        </div>
        <div className={styles.headerRight}>
          {date && <span className={styles.date}>{date}</span>}
          <span className={`${styles.icon} ${isExpanded ? styles.expanded : ''}`}>
            {isExpanded ? '^' : 'v'}
          </span>
        </div>
      </div>
      {isExpanded && (
        <div className={styles.content}>
          {content}
        </div>
      )}
    </div>
  );
};

export default ExpandableCard;

