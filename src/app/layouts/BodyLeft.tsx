import React, { useState } from 'react'
import RecordGroupDetailModal from "@/app/components/layout/RecordGroupDetailModal"
import RecordCreateModal from '../components/layout/RecordCreateModal';
import RecordGroupSection from '../components/layout/RecordGroupSection';
import RecordGroupButton from '../components/layout/RecordGroupButton';
import RecordGroupMiddle from '../components/layout/RecordGroupMiddle';

const BodyLeft = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRecordCreateModalOpen, setIsRecordCreateModalOpen] = useState(false);
    const [isGroupsExpanded, setIsGroupsExpanded] = useState(true);
    
    const closeModal = () => {
        setIsModalOpen(false);
    };
    
    const openModal = () => {
        setIsModalOpen(true);
    };

    const toggleGroups = () => {
        setIsGroupsExpanded(!isGroupsExpanded);
    };

    const closeRecordCreateModal = () => {
        setIsRecordCreateModalOpen(false);
    };

    const openRecordCreateModal = () => {
        setIsRecordCreateModalOpen(true);
    };

    return (
        <div style={{ 
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#fff',
            margin: 0,
            boxSizing: 'border-box'
        }}>
            <RecordGroupButton onClick={openRecordCreateModal} />
            <RecordGroupMiddle title="내 기록 전체보기" />
            <span className="record-group-separator"></span>
            <RecordGroupSection 
                title="내 기록장"
                isGroupsExpanded={isGroupsExpanded}
                onToggleGroups={toggleGroups}
                onOpenModal={openModal}
            />
            <span className="record-group-separator"></span>
            <RecordGroupSection 
                title="공유 기록장"
                isGroupsExpanded={isGroupsExpanded}
                onToggleGroups={toggleGroups}
                onOpenModal={openModal}
            />
            
            <RecordCreateModal isOpen={isRecordCreateModalOpen} onClose={closeRecordCreateModal}/>
            <RecordGroupDetailModal isOpen={isModalOpen} onClose={closeModal} />
        </div>
    );
};

export default BodyLeft;
