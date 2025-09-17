import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRecordGroupStore } from '@/store/recordGroupStore';

interface RecordGroupMiddleProps {
    title: string;
}

const RecordGroupMiddle: React.FC<RecordGroupMiddleProps> = ({
    title
}) => {
    const [isChecked, setIsChecked] = useState(true);
    const { toggleAllGroups, getAllRecordGroups, getCheckedGroupIds } = useRecordGroupStore();
    
    // 모든 그룹이 체크되어 있는지 확인
    useEffect(() => {
        const allGroups = getAllRecordGroups();
        const checkedIds = getCheckedGroupIds();
        const allChecked = allGroups.length > 0 && allGroups.every(group => checkedIds.includes(group.id));
        console.log('allChecked', allChecked);
        console.log('allGroups', allGroups);
        console.log('checkedIds', checkedIds);
    }, [getAllRecordGroups, getCheckedGroupIds]);
    
    const onToggle = () => {
        toggleAllGroups();
        setIsChecked(!isChecked);
    }

    return (
        <div className="record-all">
            <div><input type="checkbox" id="all" onClick={onToggle} /><label htmlFor="all"><p>{title}</p></label></div>
            <button className="trans"><i className="ic-set" /></button>
        </div>
    );
};

export default RecordGroupMiddle; 