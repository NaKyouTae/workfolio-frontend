'use client';

import React from 'react';

interface NotificationProps {
  isOpen: boolean;
  text: string;
  // color?: string;
  // onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({
  isOpen,
  text,
  // color = '#4caf50',
  // onClose,
}) => {
  // text가 비어있거나 isOpen이 false이면 렌더링하지 않음
  if (!isOpen || !text || text.trim() === '') {
    return null;
  }

  return (
    <div className={`toast ${isOpen ? "show" : "hide"}`}>{text}</div>
  );
};

export default Notification;

