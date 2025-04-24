import React, { useEffect, useState } from 'react';
import HttpMethod from '@/enums/HttpMethod';
import { RecordGroup } from '../../../../generated/common';
import { useRecordGroupStore } from '@/store/recordGroupStore';

interface RecordGroupItemProps {
    group: RecordGroup;
    isChecked: boolean;
    onToggle: (id: string) => void;
}

const RecordGroupItem = ({ group, isChecked, onToggle }: RecordGroupItemProps) => {
    const [showOptions, setShowOptions] = useState(false);

    return (
        <div className="record-group-item">
            <div style={{
                display: 'flex',
                alignItems: 'center',
                flex: 1,
                cursor: 'pointer'
            }} onClick={() => onToggle(group.id)}>
                <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    border: `2px solid ${group.color}`,
                    backgroundColor: isChecked ? group.color : 'transparent',
                    marginRight: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    {isChecked && (
                        <span style={{ color: 'white', fontSize: '14px' }}>✓</span>
                    )}
                </div>
                <span style={{ fontSize: '14px' }}>{group.title}</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {showOptions && (
                    <button onClick={() => {}} style={{
                        background: 'none',
                        border: 'none',
                        padding: '4px',
                        cursor: 'pointer'
                    }}>
                        X
                    </button>
                )}
                <button 
                    onClick={() => setShowOptions(!showOptions)}
                    style={{
                        background: 'none',
                        border: 'none',
                        padding: '4px',
                        cursor: 'pointer'
                    }}
                >
                </button>
            </div>
        </div>
    );
};

const RecordGroups = () => {
    const [recordGroups, setRecordGroups] = useState<RecordGroup[]>([]);
    const { checkedGroups, toggleGroup, initializeGroups } = useRecordGroupStore();
    
    useEffect(() => {
        const fetchRecordGroups = async () => {
            try {
                const res = await fetch('/api/recordGroups', {method: HttpMethod.GET});
                const data = await res.json();
                
                if (data != null) {
                    setRecordGroups(data.groups);
                    // 모든 그룹을 기본적으로 체크된 상태로 초기화
                    initializeGroups(data.groups.map((group: RecordGroup) => group.id));
                }
            } catch (error) {
                console.error('Error fetching record groups:', error);
            }
        }
        fetchRecordGroups();
    }, [initializeGroups]);

    return (
        <div>
            {recordGroups.map((group) => (
                <RecordGroupItem
                    key={group.id}
                    group={group}
                    isChecked={checkedGroups.has(group.id)}
                    onToggle={toggleGroup}
                />
            ))}
        </div>
    );
};

export default RecordGroups;
