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
        <div className="record-group-header-container">
            <div style={{
                display: 'flex',
                alignItems: 'center',
                flex: 1,
                cursor: 'pointer'
            }} onClick={onToggle}>
                <div style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '4px',
                    border: '2px solid #FFCB42',
                    backgroundColor: '#FFCB42',
                    marginRight: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    {isChecked && (
                        <Image
                            src="/ic-check.png"
                            alt="Toggle groups"
                            width={8}
                            height={6}
                        />
                    )}
                </div>
                <div style={{ fontSize: '14px' }}>{title}</div>
            </div>
            <Image
                src="/ic-set.png"
                alt='설정'
                width={16}
                height={16}
                style={{ cursor: 'pointer' }}
            />
        </div>
    );
};

export default RecordGroupMiddle; 