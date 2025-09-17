import React from 'react';
import HttpMethod from '@/enums/HttpMethod';
import { RecordGroup } from '../../../../../../generated/common';
import { useRecordGroupStore } from '@/store/recordGroupStore';
import { UpdateRecordGroupRequest } from '../../../../../../generated/record_group';
import { RecordGroupColor } from '@/enums/RecordGroupColor';
import RecordGroupItem from './RecordGroupItem';
import NewRecordGroupItem from './NewRecordGroupItem';

interface RecordGroupsProps {
    recordGroups: RecordGroup[];
    onUpdateRecordGroups: (updatedGroups: RecordGroup[]) => void;
    isCreatingGroup?: boolean;
    onCreateGroup?: (title: string) => void;
    onCancelCreateGroup?: () => void;
}

const RecordGroups = ({ 
    recordGroups, 
    onUpdateRecordGroups, 
    isCreatingGroup, 
    onCreateGroup, 
    onCancelCreateGroup 
}: RecordGroupsProps) => {
    const { checkedGroups, toggleGroup } = useRecordGroupStore();


    const updateRecordGroup = async (id: string, title: string) => {
        try {
            // 토큰이 없으면 로그인 페이지로 리다이렉트
            const accessToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('accessToken='))
                ?.split('=')[1];
            
            if (!accessToken) {
                window.location.href = '/login';
                return;
            }

            // 기존 그룹 정보 찾기
            const existingGroup = recordGroups.find(group => group.id === id);
            if (!existingGroup) {
                console.error('Group not found');
                return;
            }

            // UpdateRecordGroupRequest 생성
            const updateRequest = UpdateRecordGroupRequest.create({
                title: title,
                isPublic: existingGroup.isPublic || false,
                color: existingGroup.color || RecordGroupColor.RED,
                priority: existingGroup.priority || 1
            });

            const response = await fetch(`/api/record-groups/${id}`, {
                method: HttpMethod.PUT,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: updateRequest.title,
                    isPublic: updateRequest.isPublic,
                    color: updateRequest.color,
                    priority: updateRequest.priority.toString()
                })
            });

            if (response.status === 401) {
                window.location.href = '/login';
                return;
            }

            if (response.ok) {
                const updatedGroups = recordGroups.map(group => 
                    group.id === id ? { ...group, title } : group
                );
                onUpdateRecordGroups(updatedGroups);
            } else {
                console.error('Failed to update group');
            }
        } catch (error) {
            console.error('Error updating group:', error);
        }
    };

    const updateRecordGroupColor = async (id: string, color: string) => {
        try {
            // 토큰이 없으면 로그인 페이지로 리다이렉트
            const accessToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('accessToken='))
                ?.split('=')[1];
            
            if (!accessToken) {
                window.location.href = '/login';
                return;
            }

            // 기존 그룹 정보 찾기
            const existingGroup = recordGroups.find(group => group.id === id);
            if (!existingGroup) {
                console.error('Group not found');
                return;
            }

            // UpdateRecordGroupRequest 생성
            const updateRequest = UpdateRecordGroupRequest.create({
                title: existingGroup.title,
                isPublic: existingGroup.isPublic || false,
                color: color,
                priority: existingGroup.priority || 1
            });

            const response = await fetch(`/api/record-groups/${id}`, {
                method: HttpMethod.PUT,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: updateRequest.title,
                    isPublic: updateRequest.isPublic,
                    color: updateRequest.color,
                    priority: updateRequest.priority.toString()
                })
            });

            if (response.status === 401) {
                window.location.href = '/login';
                return;
            }

            if (response.ok) {
                const updatedGroups = recordGroups.map(group => 
                    group.id === id ? { ...group, color } : group
                );
                onUpdateRecordGroups(updatedGroups);
            } else {
                console.error('Failed to update group color');
            }
        } catch (error) {
            console.error('Error updating group color:', error);
        }
    };

    const deleteRecordGroup = async (id: string) => {
        try {
            // 토큰이 없으면 로그인 페이지로 리다이렉트
            const accessToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('accessToken='))
                ?.split('=')[1];
            
            if (!accessToken) {
                window.location.href = '/login';
                return;
            }

            const response = await fetch(`/api/record-groups/${id}`, {
                method: HttpMethod.DELETE,
            });

            if (response.status === 401) {
                window.location.href = '/login';
                return;
            }

            if (response.ok) {
                const updatedGroups = recordGroups.filter(group => group.id !== id);
                onUpdateRecordGroups(updatedGroups);
            } else {
                console.error('Failed to delete group');
            }
        } catch (error) {
            console.error('Error deleting group:', error);
        }
    };


    const handleSaveNewGroup = (title: string) => {
        if (onCreateGroup) {
            onCreateGroup(title);
        }
    };

    const handleCancelNewGroup = () => {
        if (onCancelCreateGroup) {
            onCancelCreateGroup();
        }
    };

    return (
        <>
            {isCreatingGroup && (
                <NewRecordGroupItem
                    onSave={handleSaveNewGroup}
                    onCancel={handleCancelNewGroup}
                />
            )}
            {recordGroups?.map((group) => (
                <RecordGroupItem
                    key={group.id}
                    group={group}
                    isChecked={checkedGroups.has(group.id)}
                    onToggle={toggleGroup}
                    onUpdate={updateRecordGroup}
                    onUpdateColor={updateRecordGroupColor}
                    onDelete={deleteRecordGroup}
                />
            ))}
        </>
    );
};

export default RecordGroups;
