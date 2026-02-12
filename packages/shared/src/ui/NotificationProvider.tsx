'use client';

import React from 'react';
import Notification from './Notification';
import { useNotificationState } from '../hooks/useNotification';

const NotificationProvider: React.FC = () => {
  const { isOpen, text } = useNotificationState();

  return (
    <Notification
      isOpen={isOpen}
      text={text}
    />
  );
};

export default NotificationProvider;

