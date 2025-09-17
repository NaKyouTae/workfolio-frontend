import React, { useState, useRef, useEffect } from 'react';
import HttpMethod from '@/enums/HttpMethod';
import { RecordGroup } from '../../../../generated/common';
import { SuccessRecordGroupResponse } from '../../../../generated/record_group';
import ColorSelectModal from './ColorSelectModal';

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

    const handleCancel = async () => {
        try {
            const response = await fetch(`/api/record-groups/${group.id}`, {
                method: HttpMethod.DELETE,
            });

            if (response.ok) {
                const result: SuccessRecordGroupResponse = await response.json();
                if (result.isSuccess) {
                    // 삭제 성공 시 부모 컴포넌트에 알림
                    if (onDelete) {
                        onDelete(group.id);
                    }
                } else {
                    console.error('Failed to delete record group:', result);
                }
            } else {
                console.error('Failed to delete record group');
            }
        } catch (error) {
            console.error('Error deleting record group:', error);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
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
                <input checked={isChecked} type="checkbox" id={`group${group.id}`} onClick={() => !isEditing && onToggle(group.id)} />
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
                            onBlur={handleSave}
                            autoFocus
                        />
                    ) : (
                        <p>{group.title}</p>
                    )}
                </label>
            </div>
            <div className="more">
                <button className="trans active" onClick={() => setShowColorModal(true)}><i className="ic-more" /></button>
                {showColorModal && (
                    <div className="record-edit-modal-wrap" ref={modalRef}>
                        <button onClick={() => setIsEditing(true)}>기록장 이름 변경</button>
                        <ColorSelectModal
                            isOpen={showColorModal}
                            currentColor={group.color}
                            onColorSelect={handleColorSelect}
                            onClose={() => setShowColorModal(false)}
                            title="기록장 색상 변경"
                        />
                    </div>
                )}
            </div>
        </li>
    );
};

export default RecordGroupItem;
