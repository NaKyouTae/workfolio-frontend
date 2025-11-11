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
    <div className="modal" onClick={handleOverlayClick}>
        <div className="modal-wrap">
            <div className="modal-tit">
                <h2>{title}</h2>
                <button onClick={onClose}><i className="ic-close" /></button>
            </div>
            <div className="modal-cont">
                <div className="modal-notice">
                    <p>{content || '등록된 내용이 없습니다.'}</p>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ContentModal;

