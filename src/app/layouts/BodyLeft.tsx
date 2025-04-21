import React, {useState} from 'react'
import RecordGroups from "@/app/components/layout/RecordGroups"
import RecordGroupDetailModal from "@/app/components/layout/RecordGroupDetailModal"

const BodyLeft = () => {
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리
    
    const closeModal = () => {
        setIsModalOpen(false); // 모달 닫기
    };
    
    const openModal = () => {
        setIsModalOpen(true); // 모달 열기
    };
    
    return (
        <div>
            <div>
                <button>내 이력 관리</button>
                <button onClick={openModal}>새 기록장 추가</button>
            </div>
            <div>
                <RecordGroups />
            </div>
            <RecordGroupDetailModal isOpen={isModalOpen} onClose={closeModal} />
        </div>
    );
};

export default BodyLeft;
