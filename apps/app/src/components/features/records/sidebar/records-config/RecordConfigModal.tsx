import React, { useEffect } from 'react';
import RecordConfig from './RecordConfig';

interface RecordConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const RecordConfigModal: React.FC<RecordConfigModalProps> = ({ isOpen, onClose }) => {
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
            <div className="modal-wrap record-config-modal">
                <div className="modal-tit">
                    <h2>기록 설정</h2>
                    <button className="btn-close-circle" onClick={onClose}><i className="ic-close" /></button>
                </div>
                <div className="modal-cont">
                    <RecordConfig onClose={onClose} />
                </div>
            </div>
        </div>
    );
};

export default RecordConfigModal;
