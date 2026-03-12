import React, { useState } from 'react';
import { RecordGroup } from '@workfolio/shared/generated/common';
import RecordCreateModal from '../modal/RecordCreateModal';
import { isLoggedIn } from '@workfolio/shared/utils/authUtils';
import LoginModal from '@workfolio/shared/ui/LoginModal';

interface SidebarButtonProps {
    allRecordGroups: RecordGroup[];
}

const SidebarButton: React.FC<SidebarButtonProps> = ({ allRecordGroups }) => {
    const [isRecordCreateModalOpen, setIsRecordCreateModalOpen] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const handleButtonClick = () => {
        if (!isLoggedIn()) {
            setShowLoginModal(true);
            return;
        }
        setIsRecordCreateModalOpen(true);
    };

    return (
        <div className="aside-button">
            <button className="md" onClick={handleButtonClick}>신규 기록 추가</button>
            <RecordCreateModal
                isOpen={isRecordCreateModalOpen}
                onClose={() => setIsRecordCreateModalOpen(false)}
                allRecordGroups={allRecordGroups}
            />
            <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
        </div>
    );
};

export default SidebarButton;
