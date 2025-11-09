import React from 'react';
import styles from './GuideModal.module.css';

interface ContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  title?: string;
}

const ContentModal: React.FC<ContentModalProps> = ({ isOpen, onClose, content, title = '내용 보기' }) => {
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
          <h2 className={styles.title}>{title}</h2>
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
            {content || '등록된 내용이 없습니다.'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentModal;

