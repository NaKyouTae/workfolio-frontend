import React, { useState, useCallback } from 'react';
import RecordGroupsSharedHeader from './RecordGroupsSharedHeader';
import RecordGroups from '../RecordGroups';
import { CreateRecordGroupRequest } from '@/generated/record_group';
import HttpMethod from '@/enums/HttpMethod';
import NewRecordGroupItem from '../NewRecordGroupItem';
import { RecordGroup, RecordGroup_RecordGroupType } from '@/generated/common';
import { isLoggedIn } from '@/utils/authUtils';
import LoginModal from '@/components/portal/ui/LoginModal';

interface RecordGroupSectionProps {
    defaultExpanded?: boolean;
    recordGroups: RecordGroup[];
    onRefresh: () => void;
}

const RecordGroupsShared: React.FC<RecordGroupSectionProps> = React.memo(({
    defaultExpanded = true,
    recordGroups,
    onRefresh,
}) => {
    
    const [isGroupsExpanded, setIsGroupsExpanded] = useState(defaultExpanded);
    const [isCreatingGroup, setIsCreatingGroup] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const handleToggleGroups = useCallback(() => {
        setIsGroupsExpanded(prev => !prev);
    }, []);

    const handleCreateGroupRequest = useCallback(() => {
        if (!isLoggedIn()) {
            setShowLoginModal(true);
            return;
        }
        setIsCreatingGroup(true);
    }, []);

    const handleCancelCreate = useCallback(() => {
        setIsCreatingGroup(false);
    }, []);

    const createRecordGroup = useCallback(async (title: string, color: string) => {
        if (!isLoggedIn()) {
            setShowLoginModal(true);
            return;
        }
        
        try {
            const message = CreateRecordGroupRequest.create({
                title: title,
                color: color,
                type: RecordGroup_RecordGroupType.SHARED,
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
    }, [recordGroups.length, onRefresh]);

    return (
        <>
            <div className="record-group">
                <RecordGroupsSharedHeader 
                    isGroupsExpanded={isGroupsExpanded}
                    onToggleGroups={handleToggleGroups}
                    onCreateGroup={handleCreateGroupRequest}
                />
                {isGroupsExpanded && (
                    <ul className="record-group-list">
                        {isCreatingGroup && (
                            <NewRecordGroupItem
                                placeholder="새 공유 기록장 이름"
                                onSave={createRecordGroup}
                                onCancel={handleCancelCreate}
                            />
                        )}
                        <RecordGroups 
                            recordGroups={recordGroups} 
                            onRefresh={onRefresh}
                        />
                    </ul>
                )}
            </div>
            <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
        </>
    );
});

RecordGroupsShared.displayName = 'RecordGroupsShared';

export default RecordGroupsShared; 