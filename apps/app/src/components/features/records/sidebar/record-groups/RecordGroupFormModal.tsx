import React, { useState, useEffect } from 'react';
import { resolveRecordGroupColor } from '@workfolio/shared/models/ColorModel';
import RecordGroupColorModal from './RecordGroupColorModal';

interface RecordGroupFormModalProps {
    isOpen: boolean;
    mode: 'create' | 'edit';
    initialTitle?: string;
    initialColor?: string;
    onSubmit: (title: string, color: string) => void;
    onClose: () => void;
}

const RecordGroupFormModal: React.FC<RecordGroupFormModalProps> = ({
    isOpen,
    mode,
    initialTitle = '',
    initialColor,
    onSubmit,
    onClose,
}) => {
    const [title, setTitle] = useState(initialTitle);
    const [color, setColor] = useState<string>(resolveRecordGroupColor(initialColor));

    useEffect(() => {
        if (isOpen) {
            setTitle(initialTitle);
            setColor(resolveRecordGroupColor(initialColor));
        }
    }, [isOpen, initialTitle, initialColor]);

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

    const handleSubmit = () => {
        if (title.trim()) {
            onSubmit(title.trim(), color);
        }
    };

    return (
        <div className="modal" onClick={handleOverlayClick}>
            <div className="modal-wrap record-group-form-modal">
                <div className="modal-tit">
                    <h2>{mode === 'create' ? '새 기록장 만들기' : '기록장 수정'}</h2>
                    <button className="btn-close-circle" onClick={onClose}><i className="ic-close" /></button>
                </div>
                <div className="modal-cont">
                    <div className="record-group-form">
                        <div className="record-group-form-field">
                            <p className="record-group-form-label">기록장 이름</p>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="기록장 이름을 입력해 주세요."
                                autoFocus
                            />
                        </div>
                        <div className="record-group-form-field">
                            <p className="record-group-form-label">기록장 색상</p>
                            <RecordGroupColorModal
                                isOpen={true}
                                currentColor={color}
                                onColorSelect={setColor}
                            />
                        </div>
                    </div>
                </div>
                <div className="modal-btn">
                    <button onClick={handleSubmit} disabled={!title.trim()}>
                        {mode === 'create' ? '생성' : '수정'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecordGroupFormModal;
