import React, { useState, useEffect } from 'react';
import { useRecordGroupStore } from '@/store/recordGroupStore';

interface RecordGroupMiddleProps {
    title: string;
}

const RecordGroupMiddle: React.FC<RecordGroupMiddleProps> = ({
    title
}) => {
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
        
        console.log('RecordGroupMiddle - allGroups:', allGroups);
        console.log('RecordGroupMiddle - checkedIds:', checkedIds);
        console.log('RecordGroupMiddle - allChecked:', allChecked);
        
        setIsChecked(allChecked);
    }, [ownedRecordGroups, sharedRecordGroups, checkedGroups]); // 실제 데이터 변경을 감지
    
    const onToggle = () => {
        toggleAllGroups();
        setIsChecked(!isChecked);
    }

    return (
        <div className="record-all">
            <div>
                <input checked={isChecked} type="checkbox" id="all" onClick={onToggle} />
                <label htmlFor="all"><p>{title}</p></label>
            </div>
            <button className="trans"><i className="ic-set" /></button>
        </div>
    );
};

export default RecordGroupMiddle; 