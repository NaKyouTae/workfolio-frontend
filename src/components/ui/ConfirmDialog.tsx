import React from 'react';
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
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // 이벤트 전파를 차단하여 다른 외부 클릭 감지 핸들러가 동작하지 않도록 함
    e.stopPropagation();
    e.preventDefault();
    
    // 백그라운드 클릭 시 모달이 닫히지 않도록 함
    if (e.target === e.currentTarget) {
      onClose(); // 주석 처리하여 백그라운드 클릭으로는 닫히지 않도록 함
    }
  };

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // 모달 내부 클릭 시 이벤트 전파 차단
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <div 
      className="modal" 
      onClick={handleBackdropClick}
      onMouseDown={handleBackdropClick}
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(2px)',
        zIndex: 10000
      }}
    >
        <div className="modal-wrap sm" onClick={handleModalClick} onMouseDown={handleModalClick}>
            <div className="modal-cont">
                <div className="modal-notice">
                    {icon && (
                        <Image src={icon} alt="" width={1} height={1} />
                    )}
                    <div>
                        <h2>{title}</h2>
                        {description && (
                            <p style={{ whiteSpace: 'pre-line' }}>{description}</p>
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

