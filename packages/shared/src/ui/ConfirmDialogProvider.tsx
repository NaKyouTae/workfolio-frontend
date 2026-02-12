'use client';

import React from 'react';
import ConfirmDialog from './ConfirmDialog';
import { useConfirmStore } from '../hooks/useConfirm';

/**
 * 전역 확인 다이얼로그 프로바이더
 * 앱 최상위에서 한 번만 사용
 */
const ConfirmDialogProvider: React.FC = () => {
  const { isOpen, options, handleConfirm, handleCancel } = useConfirmStore();

  if (!options) return null;

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={handleCancel}
      onConfirm={handleConfirm}
      icon={options.icon}
      title={options.title}
      description={options.description}
      confirmText={options.confirmText}
      cancelText={options.cancelText}
    />
  );
};

export default ConfirmDialogProvider;

