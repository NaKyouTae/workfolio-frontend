import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { RecordGroup } from '@workfolio/shared/generated/common';
import RecordGroupFormModal from './RecordGroupFormModal';
import { useConfirm } from '@workfolio/shared/hooks/useConfirm';
import { isLoggedIn } from '@workfolio/shared/utils/authUtils';
import LoginModal from '@workfolio/shared/ui/LoginModal';

interface RecordGroupItemProps {
    group: RecordGroup;
    isChecked: boolean;
    onToggle: (id: string) => void;
    onUpdate?: (id: string, title: string, color: string) => void;
    onDelete?: (id: string) => void;
}

const RecordGroupItem = ({ group, isChecked, onToggle, onUpdate, onDelete }: RecordGroupItemProps) => {
    const [showMenu, setShowMenu] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const { confirm } = useConfirm();

    const handleOpenMenu = useCallback(() => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setMenuPosition({
                top: rect.top,
                left: rect.right + 8,
            });
        }
        setShowMenu(true);
    }, []);

    // 외부 클릭 감지
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current && !menuRef.current.contains(event.target as Node) &&
                buttonRef.current && !buttonRef.current.contains(event.target as Node)
            ) {
                setShowMenu(false);
            }
        };

        if (showMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showMenu]);

    const handleEdit = () => {
        if (!isLoggedIn()) {
            setShowLoginModal(true);
            setShowMenu(false);
            return;
        }
        setShowMenu(false);
        setShowEditModal(true);
    };

    const handleEditSubmit = (title: string, color: string) => {
        if (onUpdate) {
            onUpdate(group.id, title, color);
        }
        setShowEditModal(false);
    };

    const handleDelete = async () => {
        if (!isLoggedIn()) {
            setShowLoginModal(true);
            setShowMenu(false);
            return;
        }
        setShowMenu(false);

        const confirmed = await confirm({
            title: '기록장 삭제',
            icon: '/assets/img/ico/ic-delete.svg',
            description: '기록장을 삭제하면 기록장에 있는 모든 기록이 삭제돼요.',
            confirmText: '삭제',
            cancelText: '취소',
        });

        if (confirmed && onDelete) {
            onDelete(group.id);
        }
    };

    return (
        <li>
            <div className="info">
                <input
                    checked={isChecked}
                    type="checkbox"
                    id={`group${group.id}`}
                    onChange={() => onToggle(group.id)}
                />
                <label
                    htmlFor={`group${group.id}`}
                    style={{"--group-color": `${group.color}` } as React.CSSProperties}
                >
                    <p>{group.isDefault ? '[기본] ' : ''}{group.title}</p>
                </label>
            </div>
            <div className="more">
                <button ref={buttonRef} className="trans active" onClick={handleOpenMenu}><i className="ic-more" /></button>
            </div>
            {showMenu && createPortal(
                <div
                    className="record-edit-modal-wrap"
                    ref={menuRef}
                    style={{
                        position: 'fixed',
                        top: menuPosition.top,
                        left: menuPosition.left,
                        zIndex: 1000,
                    }}
                >
                    <button onClick={handleEdit}>기록장 수정</button>
                    <button onClick={handleDelete} disabled={group.isDefault}>기록장 삭제</button>
                </div>,
                document.body
            )}
            <RecordGroupFormModal
                isOpen={showEditModal}
                mode="edit"
                initialTitle={group.title}
                initialColor={group.color}
                onSubmit={handleEditSubmit}
                onClose={() => setShowEditModal(false)}
            />
            <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
        </li>
    );
};

export default RecordGroupItem;
