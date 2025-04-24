import React, { useState } from 'react'
import RecordGroups from "@/app/components/layout/RecordGroups"
import RecordGroupDetailModal from "@/app/components/layout/RecordGroupDetailModal"
import RecordCreateModal from '../components/layout/RecordCreateModal';

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
            <div className="record-group-button-container">
                <button onClick={openRecordCreateModal}>새 기록 추가</button>
            </div>
            <div className="record-group-header-container">
                <div style={{ fontSize: '14px' }}>내 기록 전체보기</div>
            </div>
            <div className="record-group-container">
                <div className="record-group-navigation-header">
                    <div className="record-group-navigation-label-container">
                        <span className="record-group-navigation-label">내 기록장</span>
                        <span onClick={toggleGroups} className={`${isGroupsExpanded ? 'record-group-navigation-arrow' : ''}`}>▼</span>
                    </div>
                    <div onClick={openModal}>+</div>
                </div>
                <div style={{
                        maxHeight: isGroupsExpanded ? '100%' : '0',
                        overflow: 'hidden',
                        transition: 'max-height 0.3s ease-in-out'
                    }}
                >
                    <RecordGroups />
                </div>
            </div>
            
            <RecordCreateModal isOpen={isRecordCreateModalOpen} onClose={closeRecordCreateModal}/>
            <RecordGroupDetailModal isOpen={isModalOpen} onClose={closeModal} />
        </div>
    );
};

export default BodyLeft;
