import React, { useEffect } from 'react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

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
                {children}
            </div>
        </div>
    </div>
  );
};

export default GuideModal;

