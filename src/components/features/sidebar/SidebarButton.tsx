import React, { useState } from 'react';
import RecordCreateModal from '../modal/RecordCreateModal';

const SidebarButton: React.FC = () => {
    const [isRecordCreateModalOpen, setIsRecordCreateModalOpen] = useState(false);

    const closeRecordCreateModal = () => {
        setIsRecordCreateModalOpen(false);
    };

    const openRecordCreateModal = () => {
        setIsRecordCreateModalOpen(true);
    };

    return (
        <div className="aside-button">
            <button className="md" onClick={openRecordCreateModal}>새 기록 추가</button>
            <RecordCreateModal 
                isOpen={isRecordCreateModalOpen} 
                onClose={closeRecordCreateModal}
            />
        </div>
    );
};

export default SidebarButton; 