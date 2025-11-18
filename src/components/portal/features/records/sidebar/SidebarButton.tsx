import React, { useState } from 'react';
import { RecordGroup } from '@/generated/common';
import RecordCreateModal from '../modal/RecordCreateModal';

interface SidebarButtonProps {
    allRecordGroups: RecordGroup[];
}

const SidebarButton: React.FC<SidebarButtonProps> = ({ allRecordGroups }) => {
    const [isRecordCreateModalOpen, setIsRecordCreateModalOpen] = useState(false);

    const closeRecordCreateModal = () => {
        setIsRecordCreateModalOpen(false);
    };

    const openRecordCreateModal = () => {
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
        </div>
    );
};

export default SidebarButton; 