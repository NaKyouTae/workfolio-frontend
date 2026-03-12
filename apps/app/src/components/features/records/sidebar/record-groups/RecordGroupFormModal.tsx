import React, { useState, useEffect } from 'react';
import { resolveRecordGroupColor } from '@workfolio/shared/models/ColorModel';
import { RecordGroup_RecordGroupCategory } from '@workfolio/shared/generated/common';
import RecordGroupColorModal from './RecordGroupColorModal';

interface RecordGroupFormModalProps {
    isOpen: boolean;
    mode: 'create' | 'edit';
    initialTitle?: string;
    initialColor?: string;
    initialCategory?: RecordGroup_RecordGroupCategory;
    onSubmit: (title: string, color: string, category?: RecordGroup_RecordGroupCategory) => void;
    onClose: () => void;
}

const resolveCategory = (cat?: RecordGroup_RecordGroupCategory): RecordGroup_RecordGroupCategory =>
    cat === RecordGroup_RecordGroupCategory.GENERAL || cat === RecordGroup_RecordGroupCategory.PROJECT
        ? cat
        : RecordGroup_RecordGroupCategory.GENERAL;

const RecordGroupFormModal: React.FC<RecordGroupFormModalProps> = ({
    isOpen,
    mode,
    initialTitle = '',
    initialColor,
    initialCategory,
    onSubmit,
    onClose,
}) => {
    const [title, setTitle] = useState(initialTitle);
    const [color, setColor] = useState<string>(resolveRecordGroupColor(initialColor));
    const [category, setCategory] = useState<RecordGroup_RecordGroupCategory>(
        resolveCategory(initialCategory)
    );

    useEffect(() => {
        if (isOpen) {
            setTitle(initialTitle);
            setColor(resolveRecordGroupColor(initialColor));
            setCategory(resolveCategory(initialCategory));
        }
    }, [isOpen, initialTitle, initialColor, initialCategory]);

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
            onSubmit(title.trim(), color, category);
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
                            <p className="record-group-form-label">기록장 유형</p>
                            <div className="record-group-category-select" style={{ display: 'flex', gap: '16px' }}>
                                <span>
                                    <input
                                        type="radio"
                                        name="category"
                                        id="category-general"
                                        checked={category === RecordGroup_RecordGroupCategory.GENERAL}
                                        onChange={() => setCategory(RecordGroup_RecordGroupCategory.GENERAL)}
                                    />
                                    <label htmlFor="category-general"><p>일반</p></label>
                                </span>
                                <span>
                                    <input
                                        type="radio"
                                        name="category"
                                        id="category-project"
                                        checked={category === RecordGroup_RecordGroupCategory.PROJECT}
                                        onChange={() => setCategory(RecordGroup_RecordGroupCategory.PROJECT)}
                                    />
                                    <label htmlFor="category-project"><p>프로젝트</p></label>
                                </span>
                            </div>
                            <p style={{ fontSize: '1.2rem', color: '#888', marginTop: '8px', lineHeight: '1.8' }}>
                                유형에 따라 사용 가능한 기록 템플릿이 달라집니다.
                                <br />
                                사용 가능:{' '}
                                {(category === RecordGroup_RecordGroupCategory.GENERAL
                                    ? ['주간 회고', '프로젝트 회고', '성과 기록', '일일 업무 기록', '빈 기록']
                                    : ['프로젝트 개요', '업무 기록', '프로젝트 회고']
                                ).map((name, i, arr) => (
                                    <span key={name}>
                                        <strong style={{ color: '#555' }}>{name}</strong>
                                        {i < arr.length - 1 && ', '}
                                    </span>
                                ))}
                            </p>
                        </div>
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
