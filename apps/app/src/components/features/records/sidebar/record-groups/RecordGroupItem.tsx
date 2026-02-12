import React, { useState, useRef, useEffect } from 'react';
import { RecordGroup } from '@workfolio/shared/generated/common';
import RecordGroupColorModal from './RecordGroupColorModal';
import { isLoggedIn } from '@workfolio/shared/utils/authUtils';
import LoginModal from '@workfolio/shared/ui/LoginModal';

interface RecordGroupItemProps {
    group: RecordGroup;
    isChecked: boolean;
    onToggle: (id: string) => void;
    onUpdate?: (id: string, title: string) => void;
    onUpdateColor?: (id: string, color: string) => void;
    onDelete?: (id: string) => void;
}

const RecordGroupItem = ({ group, isChecked, onToggle, onUpdate, onUpdateColor, onDelete }: RecordGroupItemProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(group.title);
    const [showColorModal, setShowColorModal] = useState(false);
    const [isComposing, setIsComposing] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    // 외부 클릭 감지
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setShowColorModal(false);
            }
        };

        if (showColorModal) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showColorModal]);

    const handleSave = () => {
        if (editTitle.trim() && onUpdate) {
            onUpdate(group.id, editTitle.trim());
        }
        setIsEditing(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        // 한글 조합 중에는 Enter 키 이벤트 무시
        if (e.key === 'Enter' && !isComposing) {
            handleSave();
        }
    };

    const handleCompositionStart = () => {
        setIsComposing(true);
    };

    const handleCompositionEnd = () => {
        setIsComposing(false);
    };

    const handleColorSelect = (color: string) => {
        if (onUpdateColor) {
            onUpdateColor(group.id, color);
        }
        setShowColorModal(false);
    };

    return (
        <li>
            <div className="info">
                <input 
                    checked={isChecked} 
                    type="checkbox" 
                    id={`group${group.id}`} 
                    onChange={() => !isEditing && onToggle(group.id)}
                />
                <label 
                    htmlFor={`group${group.id}`}
                    style={{"--group-color": `${group.color}` } as React.CSSProperties} 
                >
                    {isEditing ? (
                        <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={handleKeyPress}
                            onCompositionStart={handleCompositionStart}
                            onCompositionEnd={handleCompositionEnd}
                            onBlur={handleSave}
                            autoFocus
                        />
                    ) : (
                        <p>{group.isDefault ? '[기본] ' : ''}{group.title}</p>
                    )}
                </label>
            </div>
            <div className="more">
                <button className="trans active" onClick={() => setShowColorModal(true)}><i className="ic-more" /></button>
                {showColorModal && (
                    <div className="record-edit-modal-wrap" ref={modalRef}>
                        {!group.isDefault && (
                            <button onClick={() => onDelete?.(group.id)}>기록장 삭제</button>
                        )}
                        <button onClick={() => {
                            if (!isLoggedIn()) {
                                setShowLoginModal(true);
                                setShowColorModal(false);
                                return;
                            }
                            setIsEditing(true);
                            setShowColorModal(false);
                        }}>기록장 이름 변경</button>
                        <RecordGroupColorModal
                            isOpen={showColorModal}
                            currentColor={group.color}
                            onColorSelect={handleColorSelect}
                        />
                    </div>
                )}
            </div>
            <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
        </li>
    );
};

export default RecordGroupItem;
