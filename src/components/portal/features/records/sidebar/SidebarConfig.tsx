import React, { useState, useEffect } from 'react';
import { useRecordGroupStore } from '@/store/recordGroupStore';

interface SidebarConfigProps {
    onConfigToggle: () => void;
}

const SidebarConfig: React.FC<SidebarConfigProps> = ({ onConfigToggle }) => {
    const [isChecked, setIsChecked] = useState(true);
    const { 
        toggleAllGroups,
        ownedRecordGroups,
        sharedRecordGroups,
        checkedGroups
    } = useRecordGroupStore();
    
    // 모든 그룹이 체크되어 있는지 확인
    useEffect(() => {
        const allGroups = [...ownedRecordGroups, ...sharedRecordGroups];
        const checkedIds = Array.from(checkedGroups);
        const allChecked = allGroups.length > 0 && allGroups.every(group => checkedIds.includes(group.id));        
        setIsChecked(allChecked);
    }, [ownedRecordGroups, sharedRecordGroups, checkedGroups]); // 실제 데이터 변경을 감지
    
    const onToggle = () => {
        toggleAllGroups();
        // setIsChecked는 useEffect에서 자동으로 업데이트되므로 제거
    }

    return (
        <div className="record-all">
            <div>
                <input 
                    checked={isChecked} 
                    type="checkbox" 
                    id="all" 
                    onChange={onToggle} 
                />
                <label htmlFor="all"><p>내 기록 전체보기</p></label>
            </div>
            <button className="trans" onClick={onConfigToggle}><i className="ic-set" /></button>
        </div>
    );
};

export default SidebarConfig; 