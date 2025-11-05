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
  return (
    <div className={`toast ${isOpen ? "show" : "hide"}`}>{text}</div>
  );
};

export default Notification;

