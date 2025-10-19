import React, { useState, useRef } from 'react';
import RecordGroupsOwnedHeader from './RecordGroupsOwnedHeader';
import RecordGroups from '../RecordGroups';
import { CreateRecordGroupRequest } from '@/generated/record_group';
import HttpMethod from '@/enums/HttpMethod';
import NewRecordGroupItem from '../NewRecordGroupItem';
import { RecordGroup_RecordGroupType, RecordGroup } from '@/generated/common';

interface RecordGroupSectionProps {
    defaultExpanded?: boolean;
    recordGroups: RecordGroup[];
    onRefresh: () => void;
}

const RecordGroupsOwned: React.FC<RecordGroupSectionProps> = ({
    defaultExpanded = true,
    recordGroups,
    onRefresh,
}) => {
    
    const [isGroupsExpanded, setIsGroupsExpanded] = useState(defaultExpanded);
    const [isCreatingGroup, setIsCreatingGroup] = useState(false);

    // 🔍 디버깅: RecordGroupsOwned 렌더링 횟수 추적
    const renderCount = useRef(0);
    renderCount.current += 1;

    if (process.env.NODE_ENV === 'development') {
        console.log(`🟢 RecordGroupsOwned 렌더링 #${renderCount.current}`, {
            recordGroupsCount: recordGroups.length,
            isGroupsExpanded,
            isCreatingGroup,
            timestamp: new Date().toISOString()
        });
    }

    const handleToggleGroups = () => {
        setIsGroupsExpanded(!isGroupsExpanded);
    };

    // 새 그룹 생성 함수
    const createRecordGroup = async (title: string, color: string) => {
        try {
            const message = CreateRecordGroupRequest.create({
                title: title,
                color: color,
                type: RecordGroup_RecordGroupType.PRIVATE,
                priority: recordGroups.length + 1,
            });
            
            const response = await fetch('/api/record-groups', {
                method: HttpMethod.POST,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: message.title,
                    color: message.color,
                    type: message.type,
                    priority: message.priority.toString(),
                })
            });

            if (response.ok) {
                setIsCreatingGroup(false);
                
                // 레코드 그룹 생성 성공 시 레코드 그룹 다시 조회
                onRefresh();
            } else {
                console.error('Failed to create group');
            }
        } catch (error) {
            console.error('Error creating group:', error);
        }
    };

    // 그룹 생성 요청 핸들러
    const handleCreateGroupRequest = () => {
        setIsCreatingGroup(true);
    };

    

    return (
        <div className="record-group">
            <RecordGroupsOwnedHeader 
                isGroupsExpanded={isGroupsExpanded}
                onToggleGroups={handleToggleGroups}
                onCreateGroup={handleCreateGroupRequest}
            />
            {isGroupsExpanded && (
                <ul className="record-group-list">
                    {isCreatingGroup && (
                        <NewRecordGroupItem
                            placeholder="새 기록장 이름"
                            onSave={createRecordGroup}
                            onCancel={() => setIsCreatingGroup(false)}
                        />
                    )}
                    <RecordGroups 
                        key="owned-record-groups"
                        recordGroups={recordGroups} 
                        onUpdateRecordGroups={() => onRefresh()}
                        onRefresh={onRefresh}
                    />
                </ul>
            )}
        </div>
    );
};

export default RecordGroupsOwned; 