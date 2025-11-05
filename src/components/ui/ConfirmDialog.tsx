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
    <div className="modal">
        <div className="modal-wrap sm">
            <div className="modal-cont">
                <div className="modal-notice">
                    {icon && (
                        <Image src={icon} alt="" width={1} height={1} />
                    )}
                    <div>
                        <h2>{title}</h2>
                        {description && (
                            <p>{description}</p>
                        )}
                    </div>
                </div>
            </div>
            <div className="modal-btn half">
                <button onClick={onClose}>{cancelText}</button>
                <button onClick={handleConfirm}>{confirmText}</button>
            </div>
        </div>
    </div>
  );
};

export default ConfirmDialog;

