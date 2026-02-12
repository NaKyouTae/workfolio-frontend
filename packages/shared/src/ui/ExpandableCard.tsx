'use client';

import React, { useState } from 'react';

interface ExpandableCardProps {
  title: string;
  content: React.ReactNode;
  badge?: {
    text: string;
    variant?: 'red' | 'gray';
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
    <li>
        <div className="question" onClick={handleToggle}>
            <div className="info">
                {badge && (
                    <span className={`label ${[badge.variant || '']}`}>
                        {badge.text}
                    </span>
                )}
                <p>{title}</p>
            </div>
            <div className="option">
                {date && <span>{date}</span>}
                {isExpanded ? <i className="ic-arrow-up-14" /> : <i className="ic-arrow-down-14" />}
            </div>
        </div>
        {isExpanded && (
            <p className="answer">
                {content}
            </p>
        )}
    </li>
  );
};

export default ExpandableCard;

