import React, { useState } from 'react';
import { RecordGroup } from '@/generated/common';
import RecordCreateModal from '../modal/RecordCreateModal';
import { isLoggedIn } from '@/utils/authUtils';
import LoginModal from '@/components/portal/ui/LoginModal';

interface SidebarButtonProps {
    allRecordGroups: RecordGroup[];
}

const SidebarButton: React.FC<SidebarButtonProps> = ({ allRecordGroups }) => {
    const [isRecordCreateModalOpen, setIsRecordCreateModalOpen] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const closeRecordCreateModal = () => {
        setIsRecordCreateModalOpen(false);
    };

    const openRecordCreateModal = () => {
        // 로그인 체크 - 팝업을 열기 전에 체크
        if (!isLoggedIn()) {
            setShowLoginModal(true);
            return;
        }
        
        setIsRecordCreateModalOpen(true);
    };

    return (
        <div className="aside-button">
            <button className="md" onClick={openRecordCreateModal}>신규 기록 추가</button>
            <RecordCreateModal 
                isOpen={isRecordCreateModalOpen} 
                onClose={closeRecordCreateModal}
                allRecordGroups={allRecordGroups}
            />
            <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
        </div>
    );
};

export default SidebarButton; 