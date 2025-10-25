'use client';

import React from 'react';
import styles from './Notification.module.css';

interface NotificationProps {
  isOpen: boolean;
  text: string;
  color?: string;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({
  isOpen,
  text,
  color = '#4caf50',
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div 
        className={styles.notification}
        style={{ backgroundColor: color }}
        onClick={onClose}
      >
        <span className={styles.text}>{text}</span>
      </div>
    </div>
  );
};

export default Notification;

