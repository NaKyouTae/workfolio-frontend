'use client';

import React from 'react';
import ConfirmDialog from './ConfirmDialog';
import { useConfirmStore } from '../hooks/useConfirm';

/**
 * 전역 확인 다이얼로그 프로바이더
 * 앱 최상위에서 한 번만 사용
 */
const ConfirmDialogProvider: React.FC = () => {
  const isOpen = useConfirmStore((state) => state.isOpen);
  const options = useConfirmStore((state) => state.options);
  const handleConfirm = useConfirmStore((state) => state.handleConfirm);
  const handleCancel = useConfirmStore((state) => state.handleCancel);

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={handleCancel}
      onConfirm={handleConfirm}
      icon={options?.icon}
      title={options?.title || ''}
      description={options?.description}
      confirmText={options?.confirmText}
      cancelText={options?.cancelText}
    />
  );
};

export default ConfirmDialogProvider;

