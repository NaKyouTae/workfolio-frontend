import React from 'react';
import Image from 'next/image';
import styles from './ConfirmDialog.module.css';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  icon?: string;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
}

/**
 * 확인/취소 다이얼로그 컴포넌트
 */
const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  icon,
  title,
  description,
  confirmText = '확인',
  cancelText = '취소',
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <>
      {/* 배경 오버레이 */}
      <div className={styles.overlay} onClick={onClose} />
      
      {/* 다이얼로그 */}
      <div className={styles.dialog}>
        <div className={styles.content}>
          {/* 아이콘 */}
          {icon && (
            <div className={styles.icon}>
              <Image src={icon} alt="icon" width={32} height={32} />
            </div>
          )}

          {/* 제목 */}
          <h2 className={styles.title}>{title}</h2>

          {/* 설명 */}
          {description && (
            <p className={styles.description}>{description}</p>
          )}
        </div>

        {/* 버튼 영역 */}
        <div className={styles.buttonGroup}>
          <button
            className={styles.cancelButton}
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button
            className={styles.confirmButton}
            onClick={handleConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </>
  );
};

export default ConfirmDialog;

