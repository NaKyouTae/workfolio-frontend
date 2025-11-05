import React from 'react';
import styles from './GuideModal.module.css';

interface MemoDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  memo: string;
}

const MemoDetailModal: React.FC<MemoDetailModalProps> = ({ isOpen, onClose, memo }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>메모 상세보기</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="닫기"
          >
            ×
          </button>
        </div>
        <div className={styles.content}>
          <div style={{ 
            fontSize: '15px', 
            lineHeight: 1.8, 
            color: '#1a1a1a',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          }}>
            {memo || '등록된 메모가 없습니다.'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoDetailModal;

