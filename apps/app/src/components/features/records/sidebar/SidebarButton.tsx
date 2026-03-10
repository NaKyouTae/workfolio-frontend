import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { RecordGroup } from '@workfolio/shared/generated/common';
import RecordCreateModal from '../modal/RecordCreateModal';
import { isLoggedIn } from '@workfolio/shared/utils/authUtils';
import LoginModal from '@workfolio/shared/ui/LoginModal';
import { RECORD_TEMPLATES, RecordTemplateType } from '../templates/recordTemplates';

interface SidebarButtonProps {
    allRecordGroups: RecordGroup[];
}

const SidebarButton: React.FC<SidebarButtonProps> = ({ allRecordGroups }) => {
    const [isRecordCreateModalOpen, setIsRecordCreateModalOpen] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showTemplateMenu, setShowTemplateMenu] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<RecordTemplateType>('free');
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const buttonRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const closeRecordCreateModal = () => {
        setIsRecordCreateModalOpen(false);
    };

    const handleButtonClick = () => {
        if (!isLoggedIn()) {
            setShowLoginModal(true);
            return;
        }

        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setMenuPosition({
                top: rect.top,
                left: rect.right + 8,
            });
        }
        setShowTemplateMenu(prev => !prev);
    };

    const handleTemplateSelect = (type: RecordTemplateType) => {
        setSelectedTemplate(type);
        setShowTemplateMenu(false);
        setIsRecordCreateModalOpen(true);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current && !menuRef.current.contains(event.target as Node) &&
                buttonRef.current && !buttonRef.current.contains(event.target as Node)
            ) {
                setShowTemplateMenu(false);
            }
        };

        if (showTemplateMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showTemplateMenu]);

    return (
        <div className="aside-button">
            <button ref={buttonRef} className="md" onClick={handleButtonClick}>신규 기록 추가</button>
            {showTemplateMenu && createPortal(
                <div
                    className="record-template-menu-wrap"
                    ref={menuRef}
                    style={{
                        position: 'fixed',
                        top: menuPosition.top,
                        left: menuPosition.left,
                        zIndex: 1000,
                    }}
                >
                    {RECORD_TEMPLATES.map((template) => (
                        <button
                            key={template.type}
                            onClick={() => handleTemplateSelect(template.type)}
                        >
                            <span className="template-label">{template.label}</span>
                            <span className="template-desc">{template.description}</span>
                        </button>
                    ))}
                </div>,
                document.body
            )}
            <RecordCreateModal
                isOpen={isRecordCreateModalOpen}
                onClose={closeRecordCreateModal}
                allRecordGroups={allRecordGroups}
                templateType={selectedTemplate}
            />
            <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
        </div>
    );
};

export default SidebarButton;
