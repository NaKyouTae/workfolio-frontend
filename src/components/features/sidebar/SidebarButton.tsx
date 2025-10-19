import React, { useState } from 'react';
import { RecordGroup, Company } from '@/generated/common';
import RecordCreateModal from '../modal/RecordCreateModal';

interface SidebarButtonProps {
    editableRecordGroups: RecordGroup[];
    companiesData: {
        companies: Company[];
        isLoading: boolean;
        refreshCompanies: () => void;
    };
}

const SidebarButton: React.FC<SidebarButtonProps> = ({ editableRecordGroups, companiesData }) => {
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
                editableRecordGroups={editableRecordGroups}
                companiesData={companiesData}
            />
        </div>
    );
};

export default SidebarButton; 