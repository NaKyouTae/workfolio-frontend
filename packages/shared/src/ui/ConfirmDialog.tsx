import React, { useEffect } from 'react';
import Image from 'next/image';

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
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      style={{ zIndex: 10000 }}
    >
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
                <button type="button" onClick={(e) => { e.stopPropagation(); onClose(); }}>{cancelText}</button>
                <button type="button" onClick={(e) => { e.stopPropagation(); onConfirm(); }}>{confirmText}</button>
            </div>
        </div>
    </div>
  );
};

export default ConfirmDialog;
