'use client';

import React from 'react';

interface NotificationProps {
  isOpen: boolean;
  text: string;
}

const Notification: React.FC<NotificationProps> = ({
  isOpen,
  text,
}) => {
  if (!isOpen || !text || text.trim() === '') {
    return null;
  }

  return (
    <div className={`toast ${isOpen ? "show" : "hide"}`}>{text}</div>
  );
};

export default Notification;

